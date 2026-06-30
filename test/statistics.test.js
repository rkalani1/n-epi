const assert = require('assert');
const Statistics = require('../js/core/statistics.js');

describe('Statistics Engine Tests', function() {
    describe('tCDF Distribution Function', function() {

        it('should return 0.5 when t=0', function() {
            assert.strictEqual(Statistics.tCDF(0, 1), 0.5);
            assert.strictEqual(Statistics.tCDF(0, 10), 0.5);
        });

        it('should calculate specific values correctly', function() {
            assert.ok(Math.abs(Statistics.tCDF(1, 1) - 0.75) < 1e-7);
            assert.ok(Math.abs(Statistics.tCDF(-1, 1) - 0.25) < 1e-7);
        });

        it('should handle Infinity degrees of freedom by falling back to normalCDF', function() {
            // normalCDF(1.96) is approx 0.9750021
            assert.ok(Math.abs(Statistics.tCDF(1.96, Infinity) - 0.9750021) < 1e-4);
            assert.ok(Math.abs(Statistics.tCDF(-1.96, Infinity) - 0.0249979) < 1e-4);
            assert.ok(Math.abs(Statistics.tCDF(0, Infinity) - 0.5) < 1e-4);
        });

        it('should handle large t values correctly', function() {
            assert.ok(Math.abs(Statistics.tCDF(1000, 10) - 1.0) < 1e-7);
            assert.ok(Math.abs(Statistics.tCDF(-1000, 10) - 0.0) < 1e-7);
        });

        it('should handle Infinity t correctly', function() {
            assert.strictEqual(Statistics.tCDF(Infinity, 10), 1.0);
            assert.strictEqual(Statistics.tCDF(-Infinity, 10), 0.0);
        });

        it('should handle NaN inputs correctly', function() {
            assert.ok(isNaN(Statistics.tCDF(NaN, 10)));
            assert.ok(isNaN(Statistics.tCDF(1, NaN)));
            assert.ok(isNaN(Statistics.tCDF(NaN, NaN)));
        });

        it('should handle invalid df values correctly', function() {
            assert.ok(isNaN(Statistics.tCDF(1, 0)));
            assert.ok(isNaN(Statistics.tCDF(1, -1)));
        });

    });

    describe('regularizedIncompleteBeta Function', function() {
        it('should return NaN when x < 0', function() {
            assert.ok(isNaN(Statistics.regularizedIncompleteBeta(-0.1, 2, 2)));
            assert.ok(isNaN(Statistics.regularizedIncompleteBeta(-1, 2, 2)));
        });

        it('should return NaN when x > 1', function() {
            assert.ok(isNaN(Statistics.regularizedIncompleteBeta(1.1, 2, 2)));
            assert.ok(isNaN(Statistics.regularizedIncompleteBeta(2, 2, 2)));
        });

        it('should return 0 when x === 0', function() {
            assert.strictEqual(Statistics.regularizedIncompleteBeta(0, 2, 2), 0);
        });

        it('should return 1 when x === 1', function() {
            assert.strictEqual(Statistics.regularizedIncompleteBeta(1, 2, 2), 1);
        });
    });
});
