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

    describe('normalPDF', () => {
        it('calculates the correct density for standard normal distribution at mean (z=0)', () => {
            const expected = 1 / Math.sqrt(2 * Math.PI); // approx 0.39894228
            expect(Statistics.normalPDF(0)).toBeCloseTo(expected, 8);
        });

        it('calculates the correct density for z=1 and z=-1', () => {
            const expected = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5); // approx 0.24197072
            expect(Statistics.normalPDF(1)).toBeCloseTo(expected, 8);
            expect(Statistics.normalPDF(-1)).toBeCloseTo(expected, 8);
        });

        it('calculates the correct density for z=1.96', () => {
            const expected = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * 1.96 * 1.96); // approx 0.05844094
            expect(Statistics.normalPDF(1.96)).toBeCloseTo(expected, 8);
            expect(Statistics.normalPDF(-1.96)).toBeCloseTo(expected, 8);
        });

        it('calculates the correct density for custom mean and standard deviation', () => {
            // Mean = 50, SD = 10, value = 60
            // This is equivalent to z = 1
            const expected = Statistics.normalPDF(1) / 10;
            expect(Statistics.normalPDF(60, 50, 10)).toBeCloseTo(expected, 8);

            // Mean = -5, SD = 2, value = -9
            // This is equivalent to z = -2
            const expected2 = Statistics.normalPDF(-2) / 2;
            expect(Statistics.normalPDF(-9, -5, 2)).toBeCloseTo(expected2, 8);
        });

        it('returns close to 0 for extreme outliers', () => {
            expect(Statistics.normalPDF(10)).toBeCloseTo(0, 10);
            expect(Statistics.normalPDF(-10)).toBeCloseTo(0, 10);
        });

        it('returns NaN when sigma is 0', () => {
            expect(Statistics.normalPDF(0, 0, 0)).toBeNaN();
            expect(Statistics.normalPDF(1, 0, 0)).toBeNaN();
        });
    });
});
