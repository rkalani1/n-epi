(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        const { logGamma } = S;

        function logChoose(n, k) {
            if (k < 0 || k > n) return -Infinity;
            if (k === 0 || k === n) return 0;
            return logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);
        }

        function binomialPMF(k, n, p) {
            if (k < 0 || k > n) return 0;
            return Math.exp(logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
        }

        function binomialCDF(k, n, p) {
            let sum = 0;
            for (let i = 0; i <= Math.floor(k); i++) {
                sum += binomialPMF(i, n, p);
            }
            return Math.min(1, sum);
        }

        return {
            binomialCDF,
            binomialPMF,
            logChoose,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
