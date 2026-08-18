(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        const { EPS, PI, logGamma, normalCDF, normalPDF, normalQuantile, regularizedIncompleteBeta } = S;

        function tCDF(t, df) {
            if (isNaN(t) || isNaN(df)) return NaN;
            if (df <= 0) return NaN;
            if (df === Infinity) return normalCDF(t);
            if (t === Infinity) return 1;
            if (t === -Infinity) return 0;
            const x = df / (df + t * t);
            const prob = 0.5 * regularizedIncompleteBeta(x, df / 2, 0.5);
            return t >= 0 ? 1 - prob : prob;
        }

        function tPDF(t, df) {
            if (isNaN(t) || isNaN(df)) return NaN;
            if (df <= 0) return NaN;
            if (df === Infinity) return normalPDF(t);
            if (Math.abs(t) === Infinity) return 0;
            return Math.exp(logGamma((df + 1) / 2) - logGamma(df / 2)) /
                (Math.sqrt(df * PI) * Math.pow(1 + t * t / df, (df + 1) / 2));
        }

        // Quantile via Newton-Raphson with normal starting point
        function tQuantile(p, df) {
            if (p <= 0) return -Infinity;
            if (p >= 1) return Infinity;
            if (df === Infinity) return normalQuantile(p);

            let x = normalQuantile(p);
            for (let i = 0; i < 50; i++) {
                const fx = tCDF(x, df) - p;
                const fpx = tPDF(x, df);
                if (Math.abs(fpx) < EPS) break;
                const dx = fx / fpx;
                x -= dx;
                if (Math.abs(dx) < EPS * Math.abs(x)) break;
            }
            return x;
        }

        return {
            tCDF,
            tPDF,
            tQuantile,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
