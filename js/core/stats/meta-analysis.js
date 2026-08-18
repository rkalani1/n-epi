(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        const { chiSquaredCDF, mantelHaenszel, normalCDF, normalQuantile, round, tCDF, tQuantile } = S;

        function metaAnalysisFixedEffect(effects, variances, weights) {
            if (!weights) {
                weights = variances.map(v => 1 / v);
            }
            const sumW = weights.reduce((a, b) => a + b, 0);
            const pooled = weights.reduce((sum, w, i) => sum + w * effects[i], 0) / sumW;
            const sePo = Math.sqrt(1 / sumW);
            const z = normalQuantile(0.975);

            return {
                pooled,
                se: sePo,
                ci: { lower: pooled - z * sePo, upper: pooled + z * sePo },
                z: pooled / sePo,
                pValue: 2 * (1 - normalCDF(Math.abs(pooled / sePo))),
                weights
            };
        }

        function metaAnalysisRandomEffects(effects, variances, options = {}) {
            const { hksj = false } = options;
            const k = effects.length;
            const wi = variances.map(v => 1 / v);
            const sumW = wi.reduce((a, b) => a + b, 0);
            const sumW2 = wi.reduce((a, w) => a + w * w, 0);
            const sumWY = wi.reduce((sum, w, i) => sum + w * effects[i], 0);
            const pooledFixed = sumWY / sumW;

            // Q statistic
            const Q = wi.reduce((sum, w, i) => sum + w * Math.pow(effects[i] - pooledFixed, 2), 0);
            const df = k - 1;
            const pHet = 1 - chiSquaredCDF(Q, df);

            // I-squared
            const I2 = Math.max(0, (Q - df) / Q);

            // H-squared
            const H2 = Q / df;

            // DerSimonian-Laird tau²
            const C = sumW - sumW2 / sumW;
            const tau2 = Math.max(0, (Q - df) / C);

            // Random-effects weights
            const wiRE = variances.map(v => 1 / (v + tau2));
            const sumWRE = wiRE.reduce((a, b) => a + b, 0);
            const pooledRE = wiRE.reduce((sum, w, i) => sum + w * effects[i], 0) / sumWRE;
            let seRE = Math.sqrt(1 / sumWRE);

            // HKSJ adjustment
            if (hksj && k > 1) {
                const qHKSJ = wiRE.reduce((sum, w, i) => sum + w * Math.pow(effects[i] - pooledRE, 2), 0) / df;
                seRE *= Math.sqrt(qHKSJ);
            }

            // Critical value / p-value reference: the Hartung-Knapp-Sidik-Jonkman
            // adjustment uses a t_{k-1} reference (matching its inflated SE); the
            // standard DerSimonian-Laird random-effects model uses the normal.
            const useT = hksj && k > 1;
            const crit = useT ? tQuantile(0.975, k - 1) : normalQuantile(0.975);
            const zStat = pooledRE / seRE;
            const pVal = useT
                ? 2 * (1 - tCDF(Math.abs(zStat), k - 1))
                : 2 * (1 - normalCDF(Math.abs(zStat)));

            // Prediction interval (IntHout et al. 2016): t_{k-2} reference.
            const tVal = k > 2 ? tQuantile(0.975, k - 2) : normalQuantile(0.975);
            const predSE = Math.sqrt(seRE * seRE + tau2);
            const predInterval = {
                lower: pooledRE - tVal * predSE,
                upper: pooledRE + tVal * predSE
            };

            return {
                pooled: pooledRE,
                se: seRE,
                ci: { lower: pooledRE - crit * seRE, upper: pooledRE + crit * seRE },
                z: zStat,
                pValue: pVal,
                Q, df, pHet,
                I2, H2, tau2,
                predInterval,
                weights: wiRE.map(w => w / sumWRE * 100),
                fixed: metaAnalysisFixedEffect(effects, variances)
            };
        }

        // Meta-analysis from 2x2 tables (Mantel-Haenszel)
        function metaAnalysisMH(tables, measure = 'OR') {
            const k = tables.length;
            const effects = [];
            const variances = [];

            tables.forEach(t => {
                const { a, b, c, d } = t;
                if (measure === 'OR') {
                    const or = (a * d) / (b * c);
                    const lnOR = Math.log(or);
                    const var_lnOR = 1 / a + 1 / b + 1 / c + 1 / d;
                    effects.push(lnOR);
                    variances.push(var_lnOR);
                } else if (measure === 'RR') {
                    const rr = (a / (a + b)) / (c / (c + d));
                    const lnRR = Math.log(rr);
                    const var_lnRR = 1 / a - 1 / (a + b) + 1 / c - 1 / (c + d);
                    effects.push(lnRR);
                    variances.push(var_lnRR);
                } else if (measure === 'RD') {
                    const rd = a / (a + b) - c / (c + d);
                    const var_rd = a * b / Math.pow(a + b, 3) + c * d / Math.pow(c + d, 3);
                    effects.push(rd);
                    variances.push(var_rd);
                }
            });

            return {
                iv: metaAnalysisRandomEffects(effects, variances),
                mh: mantelHaenszel(tables, measure === 'RD' ? 'RR' : measure),
                studyEffects: effects,
                studyVariances: variances
            };
        }

        // Egger's regression test for publication bias
        function eggerTest(effects, se) {
            const k = effects.length;
            const precision = se.map(s => 1 / s);
            const standardized = effects.map((e, i) => e / se[i]);

            // Weighted linear regression: standardized effect = a + b * precision
            const sumX = precision.reduce((a, b) => a + b, 0);
            const sumY = standardized.reduce((a, b) => a + b, 0);
            const sumXY = precision.reduce((sum, x, i) => sum + x * standardized[i], 0);
            const sumX2 = precision.reduce((sum, x) => sum + x * x, 0);

            const b = (k * sumXY - sumX * sumY) / (k * sumX2 - sumX * sumX);
            const a = (sumY - b * sumX) / k;

            // SE of intercept
            const yPred = precision.map(x => a + b * x);
            const residSS = standardized.reduce((sum, y, i) => sum + Math.pow(y - yPred[i], 2), 0);
            const mse = residSS / (k - 2);
            const seA = Math.sqrt(mse * (1 / k + Math.pow(sumX / k, 2) / (sumX2 - sumX * sumX / k)));

            const tStat = a / seA;
            const pValue = 2 * (1 - tCDF(Math.abs(tStat), k - 2));

            return { intercept: a, slope: b, se: seA, t: tStat, pValue, df: k - 2 };
        }

        // Leave-one-out sensitivity analysis
        function leaveOneOut(effects, variances) {
            const results = [];
            for (let i = 0; i < effects.length; i++) {
                const e = effects.filter((_, j) => j !== i);
                const v = variances.filter((_, j) => j !== i);
                const ma = metaAnalysisRandomEffects(e, v);
                results.push({
                    excluded: i,
                    pooled: ma.pooled,
                    ci: ma.ci,
                    I2: ma.I2,
                    tau2: ma.tau2
                });
            }
            return results;
        }

        // Cumulative meta-analysis
        function cumulativeMA(effects, variances, labels) {
            const results = [];
            for (let i = 0; i < effects.length; i++) {
                const e = effects.slice(0, i + 1);
                const v = variances.slice(0, i + 1);
                if (e.length === 1) {
                    // Single study: return its own effect and CI directly
                    const se = Math.sqrt(v[0]);
                    const z = normalQuantile(0.975);
                    results.push({
                        nStudies: 1,
                        label: labels ? labels[0] : 'Study 1',
                        pooled: e[0],
                        ci: [e[0] - z * se, e[0] + z * se],
                        I2: 0
                    });
                } else {
                    const ma = metaAnalysisRandomEffects(e, v);
                    results.push({
                        nStudies: i + 1,
                        label: labels ? labels[i] : `Study ${i + 1}`,
                        pooled: ma.pooled,
                        ci: ma.ci,
                        I2: ma.I2
                    });
                }
            }
            return results;
        }

        // Trim and fill
        function trimAndFill(effects, variances) {
            const k = effects.length;
            const ma = metaAnalysisRandomEffects(effects, variances);
            const center = ma.pooled;

            // L0 estimator (Duval & Tweedie): rank the absolute residuals, sum the
            // ranks of the right-side (positive-residual) studies, and estimate the
            // number of missing studies. NB: this is a single-pass estimate, not the
            // full iterative trim/re-centre/re-estimate loop.
            const residuals = effects.map(e => e - center);
            const absRes = residuals.map(Math.abs);
            const ranks = absRes.map((v, i) => ({ v, i }))
                .sort((a, b) => a.v - b.v)
                .map((item, rank) => ({ ...item, rank: rank + 1 }))
                .sort((a, b) => a.i - b.i);

            const rightSide = residuals.map((r, i) => r > 0 ? ranks[i].rank : 0);
            const S = rightSide.reduce((a, b) => a + b, 0);
            const k0 = Math.round(Math.max(0, (4 * S - k * (k + 1)) / (2 * k - 1)));

            // Generate imputed studies
            const imputedEffects = [...effects];
            const imputedVariances = [...variances];
            const rightEffects = effects
                .map((e, i) => ({ e, v: variances[i], r: e - center }))
                .filter(item => item.r > 0)
                .sort((a, b) => b.r - a.r);

            for (let i = 0; i < Math.min(k0, rightEffects.length); i++) {
                imputedEffects.push(2 * center - rightEffects[i].e);
                imputedVariances.push(rightEffects[i].v);
            }

            const adjusted = metaAnalysisRandomEffects(imputedEffects, imputedVariances);

            return {
                k0,
                original: ma,
                adjusted,
                imputedEffects: imputedEffects.slice(k),
                imputedVariances: imputedVariances.slice(k)
            };
        }

        // Subgroup analysis
        function subgroupAnalysis(effects, variances, groups) {
            const uniqueGroups = [...new Set(groups)];
            const subResults = {};

            uniqueGroups.forEach(g => {
                const idx = groups.map((gr, i) => gr === g ? i : -1).filter(i => i >= 0);
                const e = idx.map(i => effects[i]);
                const v = idx.map(i => variances[i]);
                subResults[g] = metaAnalysisRandomEffects(e, v);
            });

            // Between-group Q test
            const overallMA = metaAnalysisRandomEffects(effects, variances);
            const Qwithin = Object.values(subResults).reduce((sum, r) => sum + r.Q, 0);
            const Qbetween = overallMA.Q - Qwithin;
            const dfBetween = uniqueGroups.length - 1;
            const pBetween = 1 - chiSquaredCDF(Qbetween, dfBetween);

            return {
                subgroups: subResults,
                overall: overallMA,
                Qbetween, dfBetween, pBetween,
                Qwithin
            };
        }

        return {
            cumulativeMA,
            eggerTest,
            leaveOneOut,
            metaAnalysisFixedEffect,
            metaAnalysisMH,
            metaAnalysisRandomEffects,
            subgroupAnalysis,
            trimAndFill,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
