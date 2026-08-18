(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        const { normalCDF, normalQuantile } = S;

        // Two proportions — normal approximation
        function sampleSizeTwoProportions(p1, p2, alpha, power, ratio, method) {
            alpha = alpha || 0.05;
            power = power || 0.80;
            ratio = ratio || 1;
            method = method || 'normal';

            const za = normalQuantile(1 - alpha / 2);
            const zb = normalQuantile(power);
            const diff = Math.abs(p1 - p2);

            if (method === 'normal') {
                const pBar = (p1 + ratio * p2) / (1 + ratio);
                const n1 = Math.pow(za * Math.sqrt((1 + 1 / ratio) * pBar * (1 - pBar)) +
                    zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2) / ratio), 2) / (diff * diff);
                return { n1: Math.ceil(n1), n2: Math.ceil(n1 * ratio), total: Math.ceil(n1) + Math.ceil(n1 * ratio) };
            }

            if (method === 'fleiss') {
                // Fleiss continuity correction
                const pBar = (p1 + ratio * p2) / (1 + ratio);
                const n1_uncorrected = Math.pow(za * Math.sqrt((1 + 1 / ratio) * pBar * (1 - pBar)) +
                    zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2) / ratio), 2) / (diff * diff);

                // Apply correction
                const n1 = (n1_uncorrected / 4) * Math.pow(1 + Math.sqrt(1 + 2 * (1 + 1/ratio) / (n1_uncorrected * diff)), 2);
                return { n1: Math.ceil(n1), n2: Math.ceil(n1 * ratio), total: Math.ceil(n1) + Math.ceil(n1 * ratio) };
            }

            if (method === 'arcsine') {
                const h = 2 * Math.asin(Math.sqrt(p1)) - 2 * Math.asin(Math.sqrt(p2));
                const n1 = Math.pow((za + zb) / h, 2);
                return { n1: Math.ceil(n1), n2: Math.ceil(n1 * ratio), total: Math.ceil(n1) + Math.ceil(n1 * ratio) };
            }

            return null;
        }

        // Two means
        function sampleSizeTwoMeans(delta, sd1, sd2, alpha, power, ratio) {
            alpha = alpha || 0.05;
            power = power || 0.80;
            ratio = ratio || 1;
            sd2 = sd2 || sd1;

            const za = normalQuantile(1 - alpha / 2);
            const zb = normalQuantile(power);

            const n1 = Math.pow(za + zb, 2) * (sd1 * sd1 + sd2 * sd2 / ratio) / (delta * delta);
            return { n1: Math.ceil(n1), n2: Math.ceil(n1 * ratio), total: Math.ceil(n1) + Math.ceil(n1 * ratio) };
        }

        // Survival — Schoenfeld
        function sampleSizeSchoenfeld(hr, alpha, power, ratio, pEvent) {
            alpha = alpha || 0.05;
            power = power || 0.80;
            ratio = ratio || 1;

            const za = normalQuantile(1 - alpha / 2);
            const zb = normalQuantile(power);
            const lnHR = Math.log(hr);

            const events = Math.pow(za + zb, 2) / (lnHR * lnHR * ratio / Math.pow(1 + ratio, 2));
            const totalEvents = Math.ceil(events);

            let totalN = null;
            if (pEvent) {
                totalN = Math.ceil(totalEvents / pEvent);
            }

            return { events: totalEvents, totalN, hr, lnHR };
        }

        // Survival — Freedman
        // Total number of events = (z_a + z_b)^2 * (1 + ratio*HR)^2 / (ratio * (1 - HR)^2),
        // where ratio is the allocation ratio (n2/n1). Reduces to
        // ((HR+1)/(HR-1))^2 * (z_a + z_b)^2 for 1:1 allocation.
        function sampleSizeFreedman(hr, alpha, power, ratio) {
            alpha = alpha || 0.05;
            power = power || 0.80;
            ratio = ratio || 1;

            const za = normalQuantile(1 - alpha / 2);
            const zb = normalQuantile(power);

            const events = Math.pow(za + zb, 2) * Math.pow(1 + ratio * hr, 2) /
                (ratio * Math.pow(1 - hr, 2));
            return { events: Math.ceil(events) };
        }

        // Non-inferiority — proportions
        function sampleSizeNonInferiority(p1, p2, margin, alpha, power, ratio) {
            alpha = alpha || 0.025; // one-sided
            power = power || 0.80;
            ratio = ratio || 1;

            const za = normalQuantile(1 - alpha);
            const zb = normalQuantile(power);
            const delta = p1 - p2 + margin;

            const n1 = Math.pow(za + zb, 2) * (p1 * (1 - p1) + p2 * (1 - p2) / ratio) / (delta * delta);
            return { n1: Math.ceil(n1), n2: Math.ceil(n1 * ratio), total: Math.ceil(n1) + Math.ceil(n1 * ratio) };
        }

        // Equivalence — proportions (two one-sided tests).
        // At a true difference of zero the design can be rejected in either
        // direction, so the power term uses z_{1-beta/2}, not z_{1-beta}
        // (Chow, Shao & Wang; Julious 2004). Using z_{1-beta} under-powers the study.
        function sampleSizeEquivalence(p1, margin, alpha, power) {
            alpha = alpha || 0.025;
            power = power || 0.80;

            const za = normalQuantile(1 - alpha);
            const zb = normalQuantile(1 - (1 - power) / 2);
            const n = Math.pow(za + zb, 2) * 2 * p1 * (1 - p1) / (margin * margin);
            return { n1: Math.ceil(n), n2: Math.ceil(n), total: 2 * Math.ceil(n) };
        }

        // Cluster-randomized
        function sampleSizeCluster(nIndividual, icc, clusterSize) {
            const deff = 1 + (clusterSize - 1) * icc;
            const nAdjusted = Math.ceil(nIndividual * deff);
            const nClusters = Math.ceil(nAdjusted / clusterSize);
            return { deff, nAdjusted, nClusters, totalN: nClusters * clusterSize };
        }

        // Stepped-wedge (Hussey-Hughes)
        function sampleSizeSteppedWedge(nParallel, steps, clustersPerStep, icc) {
            const k = steps;
            const m = clustersPerStep;
            const totalClusters = k * m;

            // Design effect for stepped-wedge
            const deff_sw = (1 + icc * (k * m - 1)) / (1 + icc * (m / 2 - 1));
            // Simplified: use ratio relative to parallel cluster RCT
            const correctionFactor = 3 * (1 - icc) / (2 * k * (k - 1 / k) * icc + 3 * (1 - icc));
            const nSW = Math.ceil(nParallel * correctionFactor);

            return {
                totalClusters,
                steps: k,
                clustersPerStep: m,
                correctionFactor,
                nPerCluster: Math.ceil(nSW / totalClusters),
                totalN: nSW
            };
        }

        // Ordinal shift (mRS) — Whitehead formula for proportional odds
        function sampleSizeOrdinalShift(controlDist, treatDist, commonOR, alpha, power) {
            alpha = alpha || 0.05;
            power = power || 0.80;

            // Whitehead method for ordinal data under proportional odds
            // N = 6 * (z_alpha/2 + z_beta)^2 / (log(OR)^2 * (1 - sum(pBar_i^3)))
            // where pBar_i is the MEAN of the two arms' category probabilities.
            const za = normalQuantile(1 - alpha / 2);
            const zb = normalQuantile(power);

            // Derive the treatment distribution from the control distribution under
            // proportional odds (odds_treat(Y<=k) = OR * odds_control(Y<=k)) unless a
            // treatment distribution is supplied directly.
            let tDist;
            if (treatDist && treatDist.length === controlDist.length) {
                tDist = treatDist;
            } else {
                tDist = [];
                let cum = 0, prevT = 0;
                for (let i = 0; i < controlDist.length; i++) {
                    cum += controlDist[i];
                    let T;
                    if (i === controlDist.length - 1) {
                        T = 1;
                    } else {
                        const oddsC = cum / (1 - cum);
                        const oddsT = commonOR * oddsC;
                        T = oddsT / (1 + oddsT);
                    }
                    tDist.push(T - prevT);
                    prevT = T;
                }
            }

            // Non-centrality factor from the average category proportions.
            let sumPiCubed = 0;
            for (let i = 0; i < controlDist.length; i++) {
                const pBar = (controlDist[i] + tDist[i]) / 2;
                sumPiCubed += Math.pow(pBar, 3);
            }

            const lnOR = Math.log(commonOR);
            const N = 6 * Math.pow(za + zb, 2) / (lnOR * lnOR * (1 - sumPiCubed));

            return {
                nPerGroup: Math.ceil(N / 2),
                total: 2 * Math.ceil(N / 2),
                commonOR,
                lnOR,
                controlDist,
                treatDist: tDist
            };
        }

        // Multi-arm with Bonferroni / approximate-Dunnett correction.
        // N scales with (z_alpha/2 + z_beta)^2; only the significance level changes
        // with the multiplicity adjustment, so the two-arm N is rescaled by
        // (z_adj + z_beta)^2 / (z_0.975 + z_beta)^2 (power is required — scaling the
        // whole N by the alpha-ratio alone over-inflates the z_beta component).
        function sampleSizeMultiArm(nPerGroup_2arm, nArms, correction, power) {
            correction = correction || 'bonferroni';
            power = power || 0.80;
            let adjustedAlpha;
            if (correction === 'bonferroni') {
                adjustedAlpha = 0.05 / (nArms - 1);
            } else if (correction === 'dunnett') {
                // Approximate Dunnett — slightly less conservative than Bonferroni
                adjustedAlpha = 1 - Math.pow(1 - 0.05, 1 / (nArms - 1));
            } else {
                adjustedAlpha = 0.05;
            }

            const zb = normalQuantile(power);
            const zaAdj = normalQuantile(1 - adjustedAlpha / 2);
            const zaOrig = normalQuantile(0.975);
            const factor = Math.pow(zaAdj + zb, 2) / Math.pow(zaOrig + zb, 2);
            const adjustedN = Math.ceil(nPerGroup_2arm * factor);

            return {
                nPerArm: adjustedN,
                totalN: adjustedN * nArms,
                adjustedAlpha,
                correction,
                power
            };
        }

        // Group sequential — O'Brien-Fleming and Pocock boundaries
        function groupSequentialBoundaries(nLooks, alpha, type) {
            type = type || 'obf';
            alpha = alpha || 0.05;
            const boundaries = [];

            if (type === 'obf') {
                // O'Brien-Fleming: z_k = z_final / sqrt(k/K)
                // Use Lan-DeMets spending function
                for (let k = 1; k <= nLooks; k++) {
                    const t = k / nLooks;
                    // OBF spending function
                    const spent = 2 * (1 - normalCDF(normalQuantile(1 - alpha / 2) / Math.sqrt(t)));
                    const z = normalQuantile(1 - spent / 2);
                    boundaries.push({ look: k, fraction: t, z, nominalAlpha: spent });
                }
            } else if (type === 'pocock') {
                // Pocock: constant boundary — find z such that overall alpha is maintained
                // Approximation: z_pocock ≈ z_alpha * sqrt(nLooks corrections)
                let zp = normalQuantile(1 - alpha / (2 * nLooks)); // Initial Bonferroni approx
                for (let k = 1; k <= nLooks; k++) {
                    const t = k / nLooks;
                    boundaries.push({ look: k, fraction: t, z: zp, nominalAlpha: 2 * (1 - normalCDF(zp)) });
                }
            }

            return boundaries;
        }

        // Crossover design sample size
        function sampleSizeCrossover(delta, sdWithin, alpha, power, nPeriods) {
            alpha = alpha || 0.05;
            power = power || 0.80;
            nPeriods = nPeriods || 2;

            const za = normalQuantile(1 - alpha / 2);
            const zb = normalQuantile(power);

            // For a 2x2 crossover: N = 2*(za+zb)^2 * sd_within^2 / delta^2
            // For higher-order crossovers, efficiency gain ~ sqrt(nPeriods/2)
            var n = 2 * Math.pow(za + zb, 2) * sdWithin * sdWithin / (delta * delta);
            if (nPeriods > 2) {
                n = n * (2 / nPeriods);
            }
            return { n: Math.ceil(n), total: Math.ceil(n), nPeriods: nPeriods, sdWithin: sdWithin };
        }

        // Diagnostic accuracy study sample size (based on expected sensitivity or specificity)
        function sampleSizeDiagnosticAccuracy(expectedProp, ciWidth, alpha, prevalence) {
            alpha = alpha || 0.05;
            var za = normalQuantile(1 - alpha / 2);

            // N for the specific metric (sensitivity or specificity)
            var nMetric = Math.ceil(4 * za * za * expectedProp * (1 - expectedProp) / (ciWidth * ciWidth));

            var totalN = null;
            if (prevalence && prevalence > 0) {
                // If estimating sensitivity, we need nMetric diseased subjects
                // total N = nMetric / prevalence (for sensitivity)
                // total N = nMetric / (1 - prevalence) (for specificity)
                // Return both
                totalN = {
                    forSensitivity: Math.ceil(nMetric / prevalence),
                    forSpecificity: Math.ceil(nMetric / (1 - prevalence))
                };
            }

            return { nMetric: nMetric, totalN: totalN, expectedProp: expectedProp, ciWidth: ciWidth };
        }

        // Group sequential sample size with alpha spending inflation factor
        function sampleSizeGroupSequential(nFixed, nLooks, spendingType) {
            spendingType = spendingType || 'obf';
            // Inflation factor for group sequential designs
            // OBF: very small inflation (~1.015 for 3 looks)
            // Pocock: larger inflation
            var inflationFactor;
            if (spendingType === 'obf') {
                // Approximate OBF inflation factors
                var obfFactors = { 2: 1.008, 3: 1.015, 4: 1.020, 5: 1.025 };
                inflationFactor = obfFactors[nLooks] || (1 + 0.005 * nLooks);
            } else {
                // Pocock inflation factors
                var pocockFactors = { 2: 1.17, 3: 1.23, 4: 1.27, 5: 1.30 };
                inflationFactor = pocockFactors[nLooks] || (1 + 0.06 * Math.log(nLooks) + 0.05);
            }

            var nAdjusted = Math.ceil(nFixed * inflationFactor);
            return {
                nFixed: nFixed,
                nAdjusted: nAdjusted,
                inflationFactor: inflationFactor,
                nLooks: nLooks,
                spendingType: spendingType,
                maxNPerLook: Math.ceil(nAdjusted / nLooks)
            };
        }

        // Minimum detectable effect size given N, alpha, power (proportions)
        function mdeProportions(p1, nPerGroup, alpha, power) {
            alpha = alpha || 0.05;
            power = power || 0.80;
            var za = normalQuantile(1 - alpha / 2);
            var zb = normalQuantile(power);

            // Binary search for p2
            var lo = 0.001, hi = p1 - 0.001;
            if (hi <= lo) { lo = p1 + 0.001; hi = 0.999; }
            for (var iter = 0; iter < 100; iter++) {
                var mid = (lo + hi) / 2;
                var pw = powerTwoProportions(p1, mid, nPerGroup, alpha);
                if (pw < power) {
                    // Need bigger effect (mid closer to p1 is smaller effect for hi side)
                    if (mid < p1) hi = mid; else lo = mid;
                } else {
                    if (mid < p1) lo = mid; else hi = mid;
                }
                if (Math.abs(hi - lo) < 0.0001) break;
            }
            var p2 = (lo + hi) / 2;
            return { p2: p2, arr: Math.abs(p1 - p2), rr: p2 / p1 };
        }

        // Minimum detectable effect size given N, alpha, power (means)
        function mdeMeans(sd, nPerGroup, alpha, power) {
            alpha = alpha || 0.05;
            power = power || 0.80;
            var za = normalQuantile(1 - alpha / 2);
            var zb = normalQuantile(power);
            var delta = (za + zb) * sd * Math.sqrt(2 / nPerGroup);
            return { delta: delta, cohensD: delta / sd };
        }

        // Minimum detectable effect size given N events, alpha, power (survival)
        function mdeSurvival(events, alpha, power) {
            alpha = alpha || 0.05;
            power = power || 0.80;
            var za = normalQuantile(1 - alpha / 2);
            var zb = normalQuantile(power);
            var lnHR = (za + zb) / Math.sqrt(events / 4);
            return { hr: Math.exp(-lnHR), hrUpper: Math.exp(lnHR), lnHR: lnHR };
        }

        // Power calculation (reverse: given N, compute power)
        function powerTwoProportions(p1, p2, n1, alpha, ratio) {
            alpha = alpha || 0.05;
            ratio = ratio || 1;
            const n2 = Math.ceil(n1 * ratio);
            const za = normalQuantile(1 - alpha / 2);
            const diff = Math.abs(p1 - p2);
            const pBar = (p1 * n1 + p2 * n2) / (n1 + n2);

            const se0 = Math.sqrt(pBar * (1 - pBar) * (1 / n1 + 1 / n2));
            const se1 = Math.sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2);

            const z = (diff - za * se0) / se1;
            return normalCDF(z);
        }

        function powerTwoMeans(delta, sd, n1, alpha, ratio) {
            alpha = alpha || 0.05;
            ratio = ratio || 1;
            const n2 = Math.ceil(n1 * ratio);
            const za = normalQuantile(1 - alpha / 2);
            const zb = delta / (sd * Math.sqrt(1 / n1 + 1 / n2)) - za;
            return normalCDF(zb);
        }

        function powerSurvival(hr, events, alpha, ratio) {
            alpha = alpha || 0.05;
            ratio = ratio || 1;
            const za = normalQuantile(1 - alpha / 2);
            const p = ratio / (1 + ratio);
            const zb = Math.abs(Math.log(hr)) * Math.sqrt(events * p * (1 - p)) - za;
            return normalCDF(zb);
        }

        return {
            groupSequentialBoundaries,
            mdeMeans,
            mdeProportions,
            mdeSurvival,
            powerSurvival,
            powerTwoMeans,
            powerTwoProportions,
            sampleSizeCluster,
            sampleSizeCrossover,
            sampleSizeDiagnosticAccuracy,
            sampleSizeEquivalence,
            sampleSizeFreedman,
            sampleSizeGroupSequential,
            sampleSizeMultiArm,
            sampleSizeNonInferiority,
            sampleSizeOrdinalShift,
            sampleSizeSchoenfeld,
            sampleSizeSteppedWedge,
            sampleSizeTwoMeans,
            sampleSizeTwoProportions,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
