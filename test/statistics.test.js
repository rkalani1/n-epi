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

    describe('tQuantile Distribution Function', function() {
        it('should return -Infinity when p <= 0', function() {
            assert.strictEqual(Statistics.tQuantile(0, 10), -Infinity);
            assert.strictEqual(Statistics.tQuantile(-0.1, 10), -Infinity);
        });

        it('should return Infinity when p >= 1', function() {
            assert.strictEqual(Statistics.tQuantile(1, 10), Infinity);
            assert.strictEqual(Statistics.tQuantile(1.1, 10), Infinity);
        });

        it('should return 0 when p = 0.5', function() {
            assert.ok(Math.abs(Statistics.tQuantile(0.5, 10)) < 1e-7);
            assert.ok(Math.abs(Statistics.tQuantile(0.5, 1)) < 1e-7);
        });

        it('should handle Infinity df by falling back to normalQuantile', function() {
            // normalQuantile(0.975) is approx 1.95996
            assert.ok(Math.abs(Statistics.tQuantile(0.975, Infinity) - 1.95996398) < 1e-4);
            assert.ok(Math.abs(Statistics.tQuantile(0.025, Infinity) - (-1.95996398)) < 1e-4);
        });

        it('should calculate specific values for tQuantile correctly', function() {
            // From t-table: t-value for 95% confidence (two-tailed, p=0.975) and df=10 is approx 2.2281
            assert.ok(Math.abs(Statistics.tQuantile(0.975, 10) - 2.2281) < 1e-3);

            // df=1, p=0.975 is approx 12.7062
            assert.ok(Math.abs(Statistics.tQuantile(0.975, 1) - 12.7062) < 1e-2);

            // df=30, p=0.975 is approx 2.0423
            assert.ok(Math.abs(Statistics.tQuantile(0.975, 30) - 2.0423) < 1e-3);

            // symmetry check
            assert.ok(Math.abs(Statistics.tQuantile(0.025, 10) - (-2.2281)) < 1e-3);
        });
    });
