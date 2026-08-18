(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        const { SQRT2PI } = S;

        function normalPDF(x, mu = 0, sigma = 1) {
            const z = (x - mu) / sigma;
            return Math.exp(-0.5 * z * z) / (sigma * SQRT2PI);
        }

        // Abramowitz & Stegun 26.2.17 approximation — accuracy ~7.5e-8
        function normalCDF(x, mu = 0, sigma = 1) {
            const z = (x - mu) / sigma;
            if (z < -8) return 0;
            if (z > 8) return 1;

            const t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
            const d = 0.3989422804014327; // 1/sqrt(2*pi)
            const p = d * Math.exp(-z * z / 2.0) *
                (t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.8212560 + t * 1.3302744)))));

            return z > 0 ? 1.0 - p : p;
        }

        // Beasley-Springer-Moro algorithm for normal quantile
        function normalQuantile(p) {
            if (p <= 0) return -Infinity;
            if (p >= 1) return Infinity;
            if (p === 0.5) return 0;

            // Rational approximation for central region
            const a = [
                -3.969683028665376e+01, 2.209460984245205e+02,
                -2.759285104469687e+02, 1.383577518672690e+02,
                -3.066479806614716e+01, 2.506628277459239e+00
            ];
            const b = [
                -5.447609879822406e+01, 1.615858368580409e+02,
                -1.556989798598866e+02, 6.680131188771972e+01,
                -1.328068155288572e+01
            ];
            const c = [
                -7.784894002430293e-03, -3.223964580411365e-01,
                -2.400758277161838e+00, -2.549732539343734e+00,
                4.374664141464968e+00, 2.938163982698783e+00
            ];
            const d = [
                7.784695709041462e-03, 3.224671290700398e-01,
                2.445134137142996e+00, 3.754408661907416e+00
            ];

            const pLow = 0.02425;
            const pHigh = 1 - pLow;
            let q, r;

            if (p < pLow) {
                q = Math.sqrt(-2 * Math.log(p));
                return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
            } else if (p <= pHigh) {
                q = p - 0.5;
                r = q * q;
                return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
                    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
            } else {
                q = Math.sqrt(-2 * Math.log(1 - p));
                return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
            }
        }

        return {
            normalCDF,
            normalPDF,
            normalQuantile,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
