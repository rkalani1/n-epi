const assert = require('assert');
const Statistics = require('../js/core/statistics.js');

describe('Statistics Engine Tests', function() {

    describe('normalCDF Distribution Function', function() {

        it('should return approximately 0.5 when x=mu', function() {
            assert.ok(Math.abs(Statistics.normalCDF(0) - 0.5) < 1e-7);
            assert.ok(Math.abs(Statistics.normalCDF(10, 10, 2) - 0.5) < 1e-7);
        });

        it('should calculate standard normal probabilities correctly', function() {
            // normalCDF(1.96) is approx 0.975
            assert.ok(Math.abs(Statistics.normalCDF(1.96) - 0.975) < 1e-4);
            // normalCDF(-1.96) is approx 0.025
            assert.ok(Math.abs(Statistics.normalCDF(-1.96) - 0.025) < 1e-4);

            // normalCDF(1) is approx 0.8413
            assert.ok(Math.abs(Statistics.normalCDF(1) - 0.8413447) < 1e-6);
            // normalCDF(-1) is approx 0.1587
            assert.ok(Math.abs(Statistics.normalCDF(-1) - 0.1586553) < 1e-6);
        });

        it('should correctly handle extreme z-scores', function() {
            assert.strictEqual(Statistics.normalCDF(8.5), 1);
            assert.strictEqual(Statistics.normalCDF(-8.5), 0);
        });

        it('should calculate non-standard normal probabilities correctly', function() {
            // mu=10, sigma=2, x=12 -> z=1
            assert.ok(Math.abs(Statistics.normalCDF(12, 10, 2) - 0.8413447) < 1e-6);
            // mu=10, sigma=2, x=6 -> z=-2
            assert.ok(Math.abs(Statistics.normalCDF(6, 10, 2) - 0.0227501) < 1e-6);
        });

    });

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
});
