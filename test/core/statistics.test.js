const Statistics = require('../../js/core/statistics.js');

describe('Statistics Module', () => {
    describe('logGamma', () => {
        test('computes logGamma correctly for positive values', () => {
            // Gamma(n) = (n-1)! for integer n
            // logGamma(1) = ln(0!) = ln(1) = 0
            expect(Statistics.logGamma(1)).toBeCloseTo(0, 10);

            // logGamma(2) = ln(1!) = ln(1) = 0
            expect(Statistics.logGamma(2)).toBeCloseTo(0, 10);

            // logGamma(3) = ln(2!) = ln(2)
            expect(Statistics.logGamma(3)).toBeCloseTo(Math.log(2), 10);

            // logGamma(4) = ln(3!) = ln(6)
            expect(Statistics.logGamma(4)).toBeCloseTo(Math.log(6), 10);

            // logGamma(5) = ln(4!) = ln(24)
            expect(Statistics.logGamma(5)).toBeCloseTo(Math.log(24), 10);
        });

        test('computes logGamma correctly for half-integers', () => {
            // Gamma(0.5) = sqrt(PI) -> logGamma(0.5) = 0.5 * ln(PI)
            expect(Statistics.logGamma(0.5)).toBeCloseTo(0.5 * Math.log(Math.PI), 10);

            // Gamma(1.5) = 0.5 * sqrt(PI) -> logGamma(1.5) = ln(0.5) + 0.5 * ln(PI)
            expect(Statistics.logGamma(1.5)).toBeCloseTo(Math.log(0.5) + 0.5 * Math.log(Math.PI), 10);
        });

        test('computes logGamma correctly for values < 0.5 (using reflection formula)', () => {
            // Gamma(0.1) is approx 9.513507698668731
            const gamma0_1 = 9.513507698668731;
            expect(Statistics.logGamma(0.1)).toBeCloseTo(Math.log(gamma0_1), 10);

            // Gamma(0.2) is approx 4.590843711998803
            const gamma0_2 = 4.590843711998803;
            expect(Statistics.logGamma(0.2)).toBeCloseTo(Math.log(gamma0_2), 10);
        });
    });

    describe('gammaFunction', () => {
        test('computes gammaFunction correctly', () => {
            expect(Statistics.gammaFunction(1)).toBeCloseTo(1, 10);
            expect(Statistics.gammaFunction(2)).toBeCloseTo(1, 10);
            expect(Statistics.gammaFunction(3)).toBeCloseTo(2, 10);
            expect(Statistics.gammaFunction(4)).toBeCloseTo(6, 10);
            expect(Statistics.gammaFunction(5)).toBeCloseTo(24, 10);
        });
        test('computes gammaFunction correctly for half-integers', () => {
            expect(Statistics.gammaFunction(0.5)).toBeCloseTo(Math.sqrt(Math.PI), 10);
            expect(Statistics.gammaFunction(1.5)).toBeCloseTo(0.5 * Math.sqrt(Math.PI), 10);
        });

        test('computes gammaFunction correctly for values < 0.5', () => {
            expect(Statistics.gammaFunction(0.1)).toBeCloseTo(9.513507698668731, 10);
            expect(Statistics.gammaFunction(0.2)).toBeCloseTo(4.590843711998803, 10);
        });
    });

    describe('chiSquaredCDF', () => {
        it('should return 0 when x is <= 0', () => {
            expect(Statistics.chiSquaredCDF(0, 1)).toBe(0);
            expect(Statistics.chiSquaredCDF(-1, 5)).toBe(0);
        });

        it('should calculate correct CDF for df=1', () => {
            // chi-squared with df=1, x=3.841 is approx 0.95 (alpha=0.05)
            const cdf = Statistics.chiSquaredCDF(3.841, 1);
            expect(cdf).toBeCloseTo(0.95, 2);

            // x=6.635 -> 0.99 (alpha=0.01)
            expect(Statistics.chiSquaredCDF(6.635, 1)).toBeCloseTo(0.99, 2);
        });

        it('should calculate correct CDF for df=2', () => {
            // x=5.991 -> 0.95
            expect(Statistics.chiSquaredCDF(5.991, 2)).toBeCloseTo(0.95, 2);

            // x=9.210 -> 0.99
            expect(Statistics.chiSquaredCDF(9.210, 2)).toBeCloseTo(0.99, 2);
        });

        it('should calculate correct CDF for df=5', () => {
            // x=11.070 -> 0.95
            expect(Statistics.chiSquaredCDF(11.070, 5)).toBeCloseTo(0.95, 2);
        });

        it('should calculate correct CDF for df=10', () => {
            // x=18.307 -> 0.95
            expect(Statistics.chiSquaredCDF(18.307, 10)).toBeCloseTo(0.95, 2);
        });
    });
});
