(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        const { logGamma, normalQuantile, regularizedLowerIncompleteGamma } = S;

        function poissonPMF(k, lambda) {
            if (k < 0) return 0;
            return Math.exp(k * Math.log(lambda) - lambda - logGamma(k + 1));
        }

        function poissonCDF(k, lambda) {
            if (k < 0) return 0;
            return 1 - regularizedLowerIncompleteGamma(Math.floor(k) + 1, lambda);
        }

        function poissonQuantile(p, lambda) {
            if (p <= 0) return 0;
            if (p >= 1) return Infinity;
            let k = Math.max(0, Math.floor(lambda + normalQuantile(p) * Math.sqrt(lambda) - 0.5));
            while (poissonCDF(k, lambda) < p) k++;
            while (k > 0 && poissonCDF(k - 1, lambda) >= p) k--;
            return k;
        }

        return {
            poissonCDF,
            poissonPMF,
            poissonQuantile,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
