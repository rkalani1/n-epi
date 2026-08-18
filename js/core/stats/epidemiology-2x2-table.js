(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        const { chiSquaredTest2x2, fisherExact, newcombeCI, normalQuantile, poissonExactCI } = S;

        function twoByTwo(a, b, c, d) {
            const n = a + b + c + d;
            const p1 = a / (a + b);
            const p2 = c / (c + d);
            const z = normalQuantile(0.975);

            // Risk Ratio
            const rr = p1 / p2;
            const lnRR = Math.log(rr);
            const seLnRR = Math.sqrt(1 / a - 1 / (a + b) + 1 / c - 1 / (c + d));
            const rrCI = { lower: Math.exp(lnRR - z * seLnRR), upper: Math.exp(lnRR + z * seLnRR) };

            // Odds Ratio
            const or = (a * d) / (b * c);
            const lnOR = Math.log(or);
            const seLnOR = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d);
            const orCI = { lower: Math.exp(lnOR - z * seLnOR), upper: Math.exp(lnOR + z * seLnOR) };

            // Risk Difference
            const rd = p1 - p2;
            const seRD = Math.sqrt(p1 * (1 - p1) / (a + b) + p2 * (1 - p2) / (c + d));
            const rdCI = { lower: rd - z * seRD, upper: rd + z * seRD };

            // Newcombe CI for RD
            const rdNewcombe = newcombeCI(p1, a + b, p2, c + d, z);

            // NNT / NNH from the risk difference (rd = risk_exposed - risk_unexposed,
            // so rd > 0 indicates harm in the exposed group). When the RD CI crosses
            // zero the NNT interval is discontinuous (Altman 1998, BMJ): it runs from
            // a finite benefit NNT out to infinity and from infinity in to a finite
            // harm NNT, so no single finite interval is reported.
            const nnt = rd !== 0 ? 1 / Math.abs(rd) : Infinity;
            let nntCI;
            if (rdCI.lower <= 0 && rdCI.upper >= 0) {
                nntCI = {
                    crossesZero: true,
                    nntHarm: rdCI.upper > 0 ? 1 / rdCI.upper : Infinity,
                    nntBenefit: rdCI.lower < 0 ? 1 / Math.abs(rdCI.lower) : Infinity
                };
            } else {
                nntCI = {
                    crossesZero: false,
                    lower: 1 / Math.abs(rdCI.upper),
                    upper: 1 / Math.abs(rdCI.lower)
                };
            }

            // Chi-squared
            const chi2 = chiSquaredTest2x2(a, b, c, d);
            const chi2Yates = chiSquaredTest2x2(a, b, c, d, true);
            const fisher = fisherExact(a, b, c, d);

            // Attributable fractions
            const afExposed = (rr - 1) / rr;
            const prevalenceExposure = (a + b) / n;
            const paf = prevalenceExposure * (rr - 1) / (1 + prevalenceExposure * (rr - 1));

            return {
                p1, p2,
                rr: { value: rr, ci: rrCI, seLnRR },
                or: { value: or, ci: orCI, seLnOR },
                rd: { value: rd, ci: rdCI, seRD, newcombe: rdNewcombe },
                nnt: { value: nnt, ci: nntCI, isHarm: rd > 0 },
                chi2, chi2Yates, fisher,
                afExposed, paf,
                counts: { a, b, c, d, n }
            };
        }

        // Fragility index (Walsh et al. 2014): the fewest patient-outcome changes,
        // within a single arm, needed to make a significant result non-significant.
        // Minimised over both arms and both flip directions (the previous version
        // only tried one direction and could overestimate the index).
        function fragilityIndex(a, b, c, d) {
            const originalP = fisherExact(a, b, c, d).pValue;
            if (originalP >= 0.05) {
                return { index: 0, originalP, modifiedP: originalP, modifiedTable: { a, b, c, d }, message: 'Result is already non-significant' };
            }

            const moves = [
                { arm: 'group 1 (event to non-event)', da: -1, db: 1, dc: 0, dd: 0 },
                { arm: 'group 1 (non-event to event)', da: 1, db: -1, dc: 0, dd: 0 },
                { arm: 'group 2 (event to non-event)', da: 0, db: 0, dc: -1, dd: 1 },
                { arm: 'group 2 (non-event to event)', da: 0, db: 0, dc: 1, dd: -1 }
            ];

            let best = Infinity, bestTable = null, bestP = originalP, bestArm = null;
            moves.forEach(m => {
                let A = a, B = b, C = c, D = d, steps = 0, p = originalP;
                while (p < 0.05 && steps < 1000) {
                    A += m.da; B += m.db; C += m.dc; D += m.dd;
                    if (A < 0 || B < 0 || C < 0 || D < 0) { steps = Infinity; break; }
                    steps++;
                    p = fisherExact(A, B, C, D).pValue;
                }
                if (p >= 0.05 && steps < best) {
                    best = steps; bestTable = { a: A, b: B, c: C, d: D }; bestP = p; bestArm = m.arm;
                }
            });

            if (!isFinite(best)) {
                return { index: null, originalP, message: 'Could not reach non-significance by single-arm changes' };
            }
            return { index: best, originalP, modifiedP: bestP, modifiedTable: bestTable, arm: bestArm };
        }

        // Additive interaction measures
        function additiveInteraction(rr11, rr10, rr01) {
            const reri = rr11 - rr10 - rr01 + 1;
            const ap = reri / rr11;
            const s = (rr11 - 1) / ((rr10 - 1) + (rr01 - 1));

            return { reri, ap, s };
        }

        // Incidence rate
        function incidenceRate(events, personTime, alpha) {
            alpha = alpha || 0.05;
            const rate = events / personTime;
            const ci = poissonExactCI(events, alpha);
            return {
                rate,
                ci: { lower: ci.lower / personTime, upper: ci.upper / personTime },
                events,
                personTime
            };
        }

        // Rate ratio
        function rateRatio(events1, pt1, events2, pt2, alpha) {
            alpha = alpha || 0.05;
            const z = normalQuantile(1 - alpha / 2);
            const r1 = events1 / pt1;
            const r2 = events2 / pt2;
            const ratio = r1 / r2;
            const lnRatio = Math.log(ratio);
            const seLnRatio = Math.sqrt(1 / events1 + 1 / events2);
            return {
                ratio,
                ci: { lower: Math.exp(lnRatio - z * seLnRatio), upper: Math.exp(lnRatio + z * seLnRatio) },
                r1, r2
            };
        }

        // SMR
        function smr(observed, expected, alpha) {
            alpha = alpha || 0.05;
            const ratio = observed / expected;
            const ci = poissonExactCI(observed, alpha);
            return {
                smr: ratio,
                ci: { lower: ci.lower / expected, upper: ci.upper / expected }
            };
        }

        // Direct age-standardization
        function directStandardization(ageRates, ageWeights) {
            // ageRates = [{rate, se, weight}] or [{events, population, standardPop}]
            let stdRate = 0;
            let stdVar = 0;

            ageRates.forEach((ag, i) => {
                const rate = ag.events !== undefined ? ag.events / ag.population : ag.rate;
                const w = ageWeights ? ageWeights[i] : ag.standardPop;
                const se = ag.events !== undefined ? Math.sqrt(ag.events) / ag.population : ag.se;
                stdRate += rate * w;
                stdVar += Math.pow(se * w, 2);
            });

            const totalWeight = ageWeights ? ageWeights.reduce((a, b) => a + b, 0) : ageRates.reduce((a, b) => a + (b.standardPop || 0), 0);
            stdRate /= totalWeight;
            stdVar /= totalWeight * totalWeight;

            const z = normalQuantile(0.975);
            return {
                rate: stdRate,
                se: Math.sqrt(stdVar),
                ci: { lower: stdRate - z * Math.sqrt(stdVar), upper: stdRate + z * Math.sqrt(stdVar) }
            };
        }

        return {
            additiveInteraction,
            directStandardization,
            fragilityIndex,
            incidenceRate,
            rateRatio,
            smr,
            twoByTwo,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
