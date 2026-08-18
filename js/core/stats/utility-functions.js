(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        function round(x, decimals) {
            decimals = decimals || 4;
            return Math.round(x * Math.pow(10, decimals)) / Math.pow(10, decimals);
        }

        function formatCI(lower, upper, decimals) {
            decimals = decimals || 2;
            return `(${round(lower, decimals)}, ${round(upper, decimals)})`;
        }

        function formatPValue(p) {
            if (p < 0.001) return '< 0.001';
            if (p < 0.01) return p.toFixed(3);
            return p.toFixed(3);
        }

        return {
            formatCI,
            formatPValue,
            round,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
