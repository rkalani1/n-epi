(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        const { EPS, logGamma, normalQuantile, regularizedLowerIncompleteGamma } = S;

        function chiSquaredCDF(x, df) {
            if (x <= 0) return 0;
            return regularizedLowerIncompleteGamma(df / 2, x / 2);
        }

        function chiSquaredPDF(x, df) {
            if (x <= 0) return 0;
            const k = df / 2;
            return Math.exp((k - 1) * Math.log(x / 2) - x / 2 - logGamma(k)) / 2;
        }

        function chiSquaredQuantile(p, df) {
            if (p <= 0) return 0;
            if (p >= 1) return Infinity;
            // Wilson-Hilferty starting approximation
            let x = df * Math.pow(1 - 2 / (9 * df) + normalQuantile(p) * Math.sqrt(2 / (9 * df)), 3);
            if (x <= 0) x = 0.01;
            for (let i = 0; i < 100; i++) {
                const fx = chiSquaredCDF(x, df) - p;
                const fpx = chiSquaredPDF(x, df);
                if (Math.abs(fpx) < EPS) break;
                const dx = fx / fpx;
                x -= dx;
                if (x <= 0) x = EPS;
                if (Math.abs(dx) < EPS * x) break;
            }
            return x;
        }

        return {
            chiSquaredCDF,
            chiSquaredPDF,
            chiSquaredQuantile,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
