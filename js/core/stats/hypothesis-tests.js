(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        const { EPS, binomialPMF, chiSquaredCDF, hypergeometricPMF, normalCDF, normalQuantile } = S;

        // Z-test for two proportions
        function twoProportionZTest(x1, n1, x2, n2, options = {}) {
            const { pooled = true, continuityCorrection = false } = options;
            const p1 = x1 / n1;
            const p2 = x2 / n2;
            const diff = p1 - p2;
            let se, z;

            if (pooled) {
                const pPool = (x1 + x2) / (n1 + n2);
                se = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2));
            } else {
                se = Math.sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2);
            }

            let correction = 0;
            if (continuityCorrection) {
                correction = 0.5 * (1 / n1 + 1 / n2);
            }

            z = (Math.abs(diff) - correction) / se;
            const pValue = 2 * (1 - normalCDF(Math.abs(z)));

            return { p1, p2, diff, se, z, pValue };
        }

        // Chi-squared test for 2x2
        function chiSquaredTest2x2(a, b, c, d, yates = false) {
            const n = a + b + c + d;
            let num = n * Math.pow(a * d - b * c, 2);
            if (yates) {
                num = n * Math.pow(Math.max(0, Math.abs(a * d - b * c) - n / 2), 2);
            }
            const denom = (a + b) * (c + d) * (a + c) * (b + d);
            const chi2 = num / denom;
            const pValue = 1 - chiSquaredCDF(chi2, 1);
            return { chi2, df: 1, pValue };
        }

        // Fisher's exact test (two-sided)
        function fisherExact(a, b, c, d) {
            const n = a + b + c + d;
            const r1 = a + b, r2 = c + d, c1 = a + c, c2 = b + d;
            const pObs = hypergeometricPMF(a, n, r1, c1);
            let pValue = 0;
            const minA = Math.max(0, c1 - r2);
            const maxA = Math.min(r1, c1);
            for (let i = minA; i <= maxA; i++) {
                const pi = hypergeometricPMF(i, n, r1, c1);
                if (pi <= pObs + EPS) {
                    pValue += pi;
                }
            }
            return { pValue: Math.min(1, pValue), pObs };
        }

        // McNemar's test
        function mcNemarTest(b, c, exact = false) {
            if (exact) {
                const n = b + c;
                let pValue = 0;
                for (let i = 0; i <= Math.min(b, c); i++) {
                    pValue += binomialPMF(i, n, 0.5);
                }
                pValue *= 2;
                return { statistic: null, pValue: Math.min(1, pValue), method: 'exact' };
            }
            const chi2 = Math.pow(b - c, 2) / (b + c);
            const pValue = 1 - chiSquaredCDF(chi2, 1);
            return { chi2, df: 1, pValue, method: 'asymptotic' };
        }

        // Cochran-Armitage trend test
        function cochranArmitageTrend(counts, totals, scores) {
            // counts[i] = number of events in group i, totals[i] = n in group i
            // scores[i] = dose/trend score for group i (default: 0, 1, 2, ...)
            const k = counts.length;
            if (!scores) scores = Array.from({ length: k }, (_, i) => i);
            const N = totals.reduce((a, b) => a + b, 0);
            const X = counts.reduce((a, b) => a + b, 0);
            const pBar = X / N;

            let sumNS = 0, sumNS2 = 0, T = 0;
            const sBar = totals.reduce((sum, ni, i) => sum + ni * scores[i], 0) / N;

            for (let i = 0; i < k; i++) {
                T += counts[i] * (scores[i] - sBar);
                sumNS += totals[i] * scores[i];
                sumNS2 += totals[i] * scores[i] * scores[i];
            }

            const varT = pBar * (1 - pBar) * (sumNS2 - sumNS * sumNS / N);
            const z = T / Math.sqrt(varT);
            const pValue = 2 * (1 - normalCDF(Math.abs(z)));

            return { z, pValue, T, varT };
        }

        // Mantel-Haenszel for stratified 2x2 tables
        function mantelHaenszel(tables, measure = 'OR') {
            // tables = [{a, b, c, d}, ...]
            let numerator = 0, denominator = 0;
            let Q = 0; // Cochran Q for homogeneity
            const k = tables.length;
            const estimates = [];

            if (measure === 'OR') {
                let sumR = 0, sumS = 0;
                let sumRS = 0, sumR2 = 0, sumS2 = 0, sumPR = 0, sumPS = 0;

                tables.forEach(t => {
                    const n = t.a + t.b + t.c + t.d;
                    const R = t.a * t.d / n;
                    const S = t.b * t.c / n;
                    sumR += R;
                    sumS += S;

                    // For Breslow-Day / Tarone
                    const or_i = (t.a * t.d) / (t.b * t.c);
                    estimates.push(or_i);
                });

                const orMH = sumR / sumS;

                // Robins-Breslow-Greenland variance
                let P_R = 0, P_S = 0, Q_plus = 0;
                tables.forEach(t => {
                    const n = t.a + t.b + t.c + t.d;
                    const R = t.a * t.d / n;
                    const S = t.b * t.c / n;
                    const P = (t.a + t.d) / n;
                    const QQ = (t.b + t.c) / n;
                    P_R += P * R;
                    P_S += QQ * S;
                    Q_plus += P * S + QQ * R;
                });

                const varLnOR = P_R / (2 * sumR * sumR) + Q_plus / (2 * sumR * sumS) + P_S / (2 * sumS * sumS);
                const seLnOR = Math.sqrt(varLnOR);
                const z = normalQuantile(0.975);
                const lnOR = Math.log(orMH);

                // Breslow-Day test for homogeneity of the odds ratio.
                // For each stratum the expected cell "a" under the common OR (psi=orMH)
                // is the admissible root of the quadratic
                //   (psi-1) a^2 - [psi(r1+c1) + (n-r1-c1)] a + psi*r1*c1 = 0
                // (Breslow & Day 1980). Then Var(a) = (1/a + 1/b + 1/c + 1/d)^-1 on the
                // expected cells, and BD = sum (a_obs - a_exp)^2 / Var(a).
                let bd = 0;
                tables.forEach((t) => {
                    const n = t.a + t.b + t.c + t.d;
                    const r1 = t.a + t.b;   // row-1 (exposed) total
                    const c1 = t.a + t.c;   // col-1 (case) total
                    const psi = orMH;
                    let aExp;
                    if (Math.abs(psi - 1) < 1e-9) {
                        aExp = r1 * c1 / n; // independence
                    } else {
                        const A = psi - 1;
                        const B = -(psi * (r1 + c1) + (n - r1 - c1));
                        const C = psi * r1 * c1;
                        const disc = Math.sqrt(Math.max(0, B * B - 4 * A * C));
                        const root1 = (-B + disc) / (2 * A);
                        const root2 = (-B - disc) / (2 * A);
                        const lo = Math.max(0, r1 + c1 - n);
                        const hi = Math.min(r1, c1);
                        const inRange = (x) => x >= lo - 1e-7 && x <= hi + 1e-7;
                        if (inRange(root1) && (!inRange(root2) ||
                            Math.abs(root1 - t.a) <= Math.abs(root2 - t.a))) {
                            aExp = root1;
                        } else {
                            aExp = root2;
                        }
                    }
                    const bExp = r1 - aExp;
                    const cExp = c1 - aExp;
                    const dExp = n - r1 - cExp;
                    if (aExp <= 0 || bExp <= 0 || cExp <= 0 || dExp <= 0) return;
                    const varA = 1 / (1 / aExp + 1 / bExp + 1 / cExp + 1 / dExp);
                    bd += Math.pow(t.a - aExp, 2) / varA;
                });
                const bdPValue = 1 - chiSquaredCDF(bd, k - 1);

                return {
                    measure: 'OR',
                    estimate: orMH,
                    lnEstimate: lnOR,
                    se: seLnOR,
                    ci: { lower: Math.exp(lnOR - z * seLnOR), upper: Math.exp(lnOR + z * seLnOR) },
                    breslowDay: { statistic: bd, df: k - 1, pValue: bdPValue },
                    stratumEstimates: estimates
                };
            }

            if (measure === 'RR') {
                let sumA = 0, sumB = 0;
                tables.forEach(t => {
                    const n = t.a + t.b + t.c + t.d;
                    sumA += t.a * (t.c + t.d) / n;
                    sumB += t.c * (t.a + t.b) / n;
                });
                const rrMH = sumA / sumB;

                // Greenland-Robins variance of ln(RR_MH):
                //   var = sum[ (r1*r2*(a+c) - a*c*n) / n^2 ] / (sumA * sumB)
                let P = 0;
                tables.forEach(t => {
                    const n = t.a + t.b + t.c + t.d;
                    P += ((t.a + t.b) * (t.c + t.d) * (t.a + t.c) - t.a * t.c * n) / (n * n);
                });
                const seLnRR = Math.sqrt(P / (sumA * sumB));
                const z = normalQuantile(0.975);
                const lnRR = Math.log(rrMH);

                return {
                    measure: 'RR',
                    estimate: rrMH,
                    lnEstimate: lnRR,
                    se: seLnRR,
                    ci: { lower: Math.exp(lnRR - z * seLnRR), upper: Math.exp(lnRR + z * seLnRR) }
                };
            }

            return null;
        }

        return {
            chiSquaredTest2x2,
            cochranArmitageTrend,
            fisherExact,
            mantelHaenszel,
            mcNemarTest,
            twoProportionZTest,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
