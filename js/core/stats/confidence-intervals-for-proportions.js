(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        const { chiSquaredQuantile, fQuantile, normalQuantile } = S;

        function waldCI(p, n, z) {
            z = z || normalQuantile(0.975);
            const se = Math.sqrt(p * (1 - p) / n);
            return { lower: Math.max(0, p - z * se), upper: Math.min(1, p + z * se), se };
        }

        function wilsonCI(p, n, z) {
            z = z || normalQuantile(0.975);
            const denom = 1 + z * z / n;
            const center = (p + z * z / (2 * n)) / denom;
            const margin = (z / denom) * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n));
            return { lower: Math.max(0, center - margin), upper: Math.min(1, center + margin) };
        }

        function clopperPearsonCI(x, n, alpha) {
            alpha = alpha || 0.05;
            let lower, upper;
            if (x === 0) {
                lower = 0;
            } else {
                lower = 1 / (1 + (n - x + 1) / (x * fQuantile(alpha / 2, 2 * x, 2 * (n - x + 1))));
            }
            if (x === n) {
                upper = 1;
            } else {
                upper = 1 / (1 + (n - x) / ((x + 1) * fQuantile(1 - alpha / 2, 2 * (x + 1), 2 * (n - x))));
            }
            return { lower, upper };
        }

        function agrestiCoullCI(p, n, z) {
            z = z || normalQuantile(0.975);
            const nTilde = n + z * z;
            const pTilde = (p * n + z * z / 2) / nTilde;
            const se = Math.sqrt(pTilde * (1 - pTilde) / nTilde);
            return { lower: Math.max(0, pTilde - z * se), upper: Math.min(1, pTilde + z * se) };
        }

        // Newcombe CI for difference of proportions (Method 10)
        function newcombeCI(p1, n1, p2, n2, z) {
            z = z || normalQuantile(0.975);
            const w1 = wilsonCI(p1, n1, z);
            const w2 = wilsonCI(p2, n2, z);
            const diff = p1 - p2;
            const lower = diff - Math.sqrt(Math.pow(p1 - w1.lower, 2) + Math.pow(p2 - w2.upper, 2));
            const upper = diff + Math.sqrt(Math.pow(p1 - w1.upper, 2) + Math.pow(p2 - w2.lower, 2));
            return { diff, lower, upper };
        }

        // Poisson exact CI
        function poissonExactCI(k, alpha) {
            alpha = alpha || 0.05;
            let lower, upper;
            if (k === 0) {
                lower = 0;
            } else {
                lower = chiSquaredQuantile(alpha / 2, 2 * k) / 2;
            }
            upper = chiSquaredQuantile(1 - alpha / 2, 2 * (k + 1)) / 2;
            return { lower, upper };
        }

        // Log-rate CI for incidence rates
        function logRateCI(events, personTime, alpha) {
            alpha = alpha || 0.05;
            const z = normalQuantile(1 - alpha / 2);
            const rate = events / personTime;
            const se = Math.sqrt(events) / personTime;
            const logRate = Math.log(rate);
            const logSE = 1 / Math.sqrt(events);
            return {
                rate,
                se,
                lower: Math.exp(logRate - z * logSE),
                upper: Math.exp(logRate + z * logSE)
            };
        }

        return {
            agrestiCoullCI,
            clopperPearsonCI,
            logRateCI,
            newcombeCI,
            poissonExactCI,
            waldCI,
            wilsonCI,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
