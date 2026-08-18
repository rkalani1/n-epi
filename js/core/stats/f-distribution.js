(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        const { EPS, regularizedIncompleteBeta } = S;

        function fCDF(x, df1, df2) {
            if (x <= 0) return 0;
            const v = df1 * x / (df1 * x + df2);
            return regularizedIncompleteBeta(v, df1 / 2, df2 / 2);
        }

        function fQuantile(p, df1, df2) {
            if (p <= 0) return 0;
            if (p >= 1) return Infinity;
            // Use bisection with refinement
            let lo = 0, hi = 100;
            while (fCDF(hi, df1, df2) < p) hi *= 2;
            for (let i = 0; i < 100; i++) {
                const mid = (lo + hi) / 2;
                if (fCDF(mid, df1, df2) < p) lo = mid;
                else hi = mid;
                if (hi - lo < EPS) break;
            }
            return (lo + hi) / 2;
        }

        return {
            fCDF,
            fQuantile,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
