(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        const { EPS, LANCZOS_COEFF, LANCZOS_G, MAX_ITER, PI } = S;

        function logGamma(x) {
            if (x < 0.5) {
                return Math.log(PI / Math.sin(PI * x)) - logGamma(1 - x);
            }
            x -= 1;
            let a = LANCZOS_COEFF[0];
            const t = x + LANCZOS_G + 0.5;
            for (let i = 1; i < LANCZOS_COEFF.length; i++) {
                a += LANCZOS_COEFF[i] / (x + i);
            }
            return 0.5 * Math.log(2 * PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
        }

        function gammaFunction(x) {
            if (x < 0.5) {
                return PI / (Math.sin(PI * x) * gammaFunction(1 - x));
            }
            x -= 1;
            let a = LANCZOS_COEFF[0];
            const t = x + LANCZOS_G + 0.5;
            for (let i = 1; i < LANCZOS_COEFF.length; i++) {
                a += LANCZOS_COEFF[i] / (x + i);
            }
            return Math.sqrt(2 * PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
        }

        function betaFunction(a, b) {
            return Math.exp(logGamma(a) + logGamma(b) - logGamma(a + b));
        }

        function logBeta(a, b) {
            return logGamma(a) + logGamma(b) - logGamma(a + b);
        }

        // Lower incomplete gamma via series expansion for small x, continued fraction for large x
        function lowerIncompleteGammaSeries(a, x) {
            if (x === 0) return 0;
            let sum = 1.0 / a;
            let term = 1.0 / a;
            for (let n = 1; n < MAX_ITER; n++) {
                term *= x / (a + n);
                sum += term;
                if (Math.abs(term) < EPS * Math.abs(sum)) break;
            }
            return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
        }

        // Upper incomplete gamma via continued fraction (Lentz's method)
        function upperIncompleteGammaCF(a, x) {
            let f = x + 1 - a;
            if (Math.abs(f) < EPS) f = EPS;
            let C = f;
            let D = 0;
            for (let i = 1; i < MAX_ITER; i++) {
                const an = -i * (i - a);
                const bn = x + 2 * i + 1 - a;
                D = bn + an * D;
                if (Math.abs(D) < EPS) D = EPS;
                C = bn + an / C;
                if (Math.abs(C) < EPS) C = EPS;
                D = 1.0 / D;
                const delta = C * D;
                f *= delta;
                if (Math.abs(delta - 1.0) < EPS) break;
            }
            return Math.exp(-x + a * Math.log(x) - logGamma(a)) / f;
        }

        function regularizedLowerIncompleteGamma(a, x) {
            if (x < 0) return 0;
            if (x === 0) return 0;
            if (x < a + 1) {
                return lowerIncompleteGammaSeries(a, x);
            } else {
                return 1.0 - upperIncompleteGammaCF(a, x);
            }
        }

        // Regularized incomplete beta function using continued fraction (Lentz's method)
        function regularizedIncompleteBeta(x, a, b) {
            if (x < 0 || x > 1) return NaN;
            if (x === 0) return 0;
            if (x === 1) return 1;

            // Use symmetry relation if x > (a+1)/(a+b+2)
            if (x > (a + 1) / (a + b + 2)) {
                return 1.0 - regularizedIncompleteBeta(1 - x, b, a);
            }

            const lbeta = logBeta(a, b);
            const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta) / a;

            // Lentz's continued fraction
            let f = 1.0, C = 1.0, D = 0.0;
            for (let i = 0; i <= MAX_ITER; i++) {
                let m = Math.floor(i / 2);
                let numerator;
                if (i === 0) {
                    numerator = 1.0;
                } else if (i % 2 === 0) {
                    numerator = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m));
                } else {
                    numerator = -((a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1));
                }
                D = 1.0 + numerator * D;
                if (Math.abs(D) < EPS) D = EPS;
                C = 1.0 + numerator / C;
                if (Math.abs(C) < EPS) C = EPS;
                D = 1.0 / D;
                const delta = C * D;
                f *= delta;
                if (Math.abs(delta - 1.0) < EPS) break;
            }
            return front * (f - 1);
        }

        return {
            betaFunction,
            gammaFunction,
            logBeta,
            logGamma,
            regularizedIncompleteBeta,
            regularizedLowerIncompleteGamma,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
