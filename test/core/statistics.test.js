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

    describe('chiSquaredPDF', () => {
        test('returns 0 for x <= 0', () => {
            expect(Statistics.chiSquaredPDF(0, 1)).toBe(0);
            expect(Statistics.chiSquaredPDF(-1, 2)).toBe(0);
            expect(Statistics.chiSquaredPDF(-10, 5)).toBe(0);
        });

        test('computes correct PDF values for positive x and valid df', () => {
            // chiSquaredPDF(1, 1) = exp(-0.5) / sqrt(2*PI)
            const expected_1_1 = Math.exp(-0.5) / Math.sqrt(2 * Math.PI);
            expect(Statistics.chiSquaredPDF(1, 1)).toBeCloseTo(expected_1_1, 10);

            // chiSquaredPDF(2, 2) = exp(-1) / 2
            const expected_2_2 = Math.exp(-1) / 2;
            expect(Statistics.chiSquaredPDF(2, 2)).toBeCloseTo(expected_2_2, 10);

            // chiSquaredPDF(3, 3) = sqrt(3) * exp(-1.5) / sqrt(2*PI)
            const expected_3_3 = (Math.sqrt(3) * Math.exp(-1.5)) / Math.sqrt(2 * Math.PI);
            expect(Statistics.chiSquaredPDF(3, 3)).toBeCloseTo(expected_3_3, 10);

            // chiSquaredPDF(4, 4) = exp(-2)
            const expected_4_4 = Math.exp(-2);
            expect(Statistics.chiSquaredPDF(4, 4)).toBeCloseTo(expected_4_4, 10);
        });
    });
});
