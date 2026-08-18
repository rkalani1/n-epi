(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        const SQRT2 = Math.sqrt(2);
        const SQRT2PI = Math.sqrt(2 * Math.PI);
        const LN2 = Math.log(2);
        const PI = Math.PI;
        const EPS = 1e-14;
        const MAX_ITER = 300;

        // Lanczos coefficients (g=7, n=9)
        const LANCZOS_G = 7;
        const LANCZOS_COEFF = [
            0.99999999999980993,
            676.5203681218851,
            -1259.1392167224028,
            771.32342877765313,
            -176.61502916214059,
            12.507343278686905,
            -0.13857109526572012,
            9.9843695780195716e-6,
            1.5056327351493116e-7
        ];

        return {
            _EPS: EPS,
            EPS,
            LANCZOS_COEFF,
            LANCZOS_G,
            LN2,
            MAX_ITER,
            PI,
            SQRT2,
            SQRT2PI,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
