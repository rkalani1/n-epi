(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        const { logChoose } = S;

        function hypergeometricPMF(k, N, K, n) {
            if (k < Math.max(0, n + K - N) || k > Math.min(n, K)) return 0;
            return Math.exp(
                logChoose(K, k) + logChoose(N - K, n - k) - logChoose(N, n)
            );
        }

        return {
            hypergeometricPMF,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
