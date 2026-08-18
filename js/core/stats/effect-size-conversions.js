(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        function orToRR(or, p0) {
            // Zhang & Yu correction
            return or / (1 - p0 + p0 * or);
        }

        function rrToOR(rr, p0) {
            return rr * (1 - p0) / (1 - rr * p0);
        }

        function orToD(or) {
            return Math.log(or) / 1.81; // π/√3 ≈ 1.8138
        }

        function dToOR(d) {
            return Math.exp(1.81 * d);
        }

        function dToHedgesG(d, n1, n2) {
            const df = n1 + n2 - 2;
            const correction = 1 - 3 / (4 * df - 1);
            return d * correction;
        }

        function rToD(r) {
            return 2 * r / Math.sqrt(1 - r * r);
        }

        function dToR(d) {
            return d / Math.sqrt(d * d + 4);
        }

        return {
            dToHedgesG,
            dToOR,
            dToR,
            orToD,
            orToRR,
            rToD,
            rrToOR,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
