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

        test('computes logGamma correctly for edge cases and large values', () => {
            // Gamma(0) is undefined, limit goes to Infinity
            expect(Statistics.logGamma(0)).toBe(Infinity);

            // Gamma for negative integers is undefined (singularities)
            expect(Number.isNaN(Statistics.logGamma(-1))).toBe(true);

            // Gamma(-1.5) approx 2.3632718012073547 -> ln(|Gamma(-1.5)|) approx 0.860047015376481
            expect(Statistics.logGamma(-1.5)).toBeCloseTo(0.860047015376481, 10);

            // NaN should return NaN
            expect(Number.isNaN(Statistics.logGamma(NaN))).toBe(true);

            // Large positive value
            // logGamma(171) = Math.log(170!) approx 706.5730622457874
            expect(Statistics.logGamma(171)).toBeCloseTo(706.5730622457874, 10);
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

    describe('betaFunction', () => {
        test('computes betaFunction correctly for integers', () => {
            // B(1, 2) = Gamma(1)Gamma(2)/Gamma(3) = (1 * 1) / 2 = 0.5
            expect(Statistics.betaFunction(1, 2)).toBeCloseTo(0.5, 10);

            // B(2, 3) = Gamma(2)Gamma(3)/Gamma(5) = (1 * 2) / 24 = 2 / 24 = 1 / 12 = 0.08333333333333333
            expect(Statistics.betaFunction(2, 3)).toBeCloseTo(1 / 12, 10);

            // B(3, 4) = Gamma(3)Gamma(4)/Gamma(7) = (2 * 6) / 720 = 12 / 720 = 1 / 60
            expect(Statistics.betaFunction(3, 4)).toBeCloseTo(1 / 60, 10);
        });

        test('computes betaFunction correctly for half-integers', () => {
            // B(0.5, 0.5) = Gamma(0.5)Gamma(0.5)/Gamma(1) = sqrt(PI)*sqrt(PI)/1 = PI
            expect(Statistics.betaFunction(0.5, 0.5)).toBeCloseTo(Math.PI, 10);

            // B(1.5, 1.5) = Gamma(1.5)Gamma(1.5)/Gamma(3) = (0.5*sqrt(PI) * 0.5*sqrt(PI)) / 2 = 0.25 * PI / 2 = PI / 8
            expect(Statistics.betaFunction(1.5, 1.5)).toBeCloseTo(Math.PI / 8, 10);
        });

        test('is symmetric: B(x, y) = B(y, x)', () => {
            expect(Statistics.betaFunction(2, 5)).toBeCloseTo(Statistics.betaFunction(5, 2), 10);
            expect(Statistics.betaFunction(0.2, 0.8)).toBeCloseTo(Statistics.betaFunction(0.8, 0.2), 10);
            expect(Statistics.betaFunction(3.14, 2.71)).toBeCloseTo(Statistics.betaFunction(2.71, 3.14), 10);
        });
    });

    describe('logBeta', () => {
        test('computes logBeta correctly for integers', () => {
            // B(1, 2) = 0.5 -> logBeta(1, 2) = ln(0.5)
            expect(Statistics.logBeta(1, 2)).toBeCloseTo(Math.log(0.5), 10);

            // B(2, 3) = 1/12 -> logBeta(2, 3) = ln(1/12)
            expect(Statistics.logBeta(2, 3)).toBeCloseTo(Math.log(1 / 12), 10);

            expect(Statistics.logBeta(1, 1)).toBeCloseTo(0, 10);
            expect(Statistics.logBeta(2, 2)).toBeCloseTo(-Math.log(6), 10);
            expect(Statistics.logBeta(3, 2)).toBeCloseTo(-Math.log(12), 10);
        });

        test('computes logBeta correctly for half-integers', () => {
            // B(0.5, 0.5) = PI -> logBeta(0.5, 0.5) = ln(PI)
            expect(Statistics.logBeta(0.5, 0.5)).toBeCloseTo(Math.log(Math.PI), 10);
            expect(Statistics.logBeta(0.5, 1.5)).toBeCloseTo(Math.log(0.5 * Math.PI), 10);
        });

        test('is symmetric: logBeta(x, y) = logBeta(y, x)', () => {
            expect(Statistics.logBeta(2, 5)).toBeCloseTo(Statistics.logBeta(5, 2), 10);
            expect(Statistics.logBeta(0.2, 0.8)).toBeCloseTo(Statistics.logBeta(0.8, 0.2), 10);
            expect(Statistics.logBeta(3.14, 2.71)).toBeCloseTo(Statistics.logBeta(2.71, 3.14), 10);
        });
    });

    describe('normalPDF', () => {
        test('calculates standard normal density values', () => {
            const standard = 1 / Math.sqrt(2 * Math.PI);

            expect(Statistics.normalPDF(0)).toBeCloseTo(standard, 8);
            expect(Statistics.normalPDF(1)).toBeCloseTo(standard * Math.exp(-0.5), 8);
            expect(Statistics.normalPDF(-1)).toBeCloseTo(standard * Math.exp(-0.5), 8);
            expect(Statistics.normalPDF(1.96)).toBeCloseTo(standard * Math.exp(-0.5 * 1.96 * 1.96), 8);
            expect(Statistics.normalPDF(-1.96)).toBeCloseTo(standard * Math.exp(-0.5 * 1.96 * 1.96), 8);
        });

        test('supports nonstandard mean and standard deviation', () => {
            expect(Statistics.normalPDF(60, 50, 10)).toBeCloseTo(Statistics.normalPDF(1) / 10, 8);
            expect(Statistics.normalPDF(-9, -5, 2)).toBeCloseTo(Statistics.normalPDF(-2) / 2, 8);
        });

        test('handles extreme and invalid scale inputs', () => {
            expect(Statistics.normalPDF(10)).toBeCloseTo(0, 10);
            expect(Statistics.normalPDF(-10)).toBeCloseTo(0, 10);
            expect(Statistics.normalPDF(0, 0, 0)).toBeNaN();
            expect(Statistics.normalPDF(1, 0, 0)).toBeNaN();
        });
    });

    describe('tPDF', () => {
        test('calculates known Student t densities', () => {
            const cases = [
                { t: 0, df: 1, expected: 0.31830988618379075 },
                { t: 0, df: 10, expected: 0.38910838396603115 },
                { t: 1.96, df: 10, expected: 0.0650947506545504 },
                { t: 2.5, df: 30, expected: 0.02105701922062158 },
                { t: -1.5, df: 5, expected: 0.12451734464635511 },
                { t: 0, df: 100, expected: 0.39794618693590594 }
            ];

            cases.forEach(({ t, df, expected }) => {
                expect(Statistics.tPDF(t, df)).toBeCloseTo(expected, 6);
            });
        });

        test('handles edge cases', () => {
            expect(Statistics.tPDF(0, 0)).toBeNaN();
            expect(Statistics.tPDF(0, -1)).toBeNaN();
            expect(Statistics.tPDF(NaN, 1)).toBeNaN();
            expect(Statistics.tPDF(0, NaN)).toBeNaN();
            expect(Statistics.tPDF(Infinity, 1)).toBe(0);
            expect(Statistics.tPDF(-Infinity, 1)).toBe(0);
            expect(Statistics.tPDF(0, Infinity)).toBeCloseTo(1 / Math.sqrt(2 * Math.PI), 6);
        });
    });

    describe('chiSquaredCDF', () => {
        test('returns 0 when x is not positive', () => {
            expect(Statistics.chiSquaredCDF(0, 1)).toBe(0);
            expect(Statistics.chiSquaredCDF(-1, 5)).toBe(0);
        });

        test('matches standard chi-square quantile table values', () => {
            expect(Statistics.chiSquaredCDF(3.841, 1)).toBeCloseTo(0.95, 2);
            expect(Statistics.chiSquaredCDF(6.635, 1)).toBeCloseTo(0.99, 2);
            expect(Statistics.chiSquaredCDF(5.991, 2)).toBeCloseTo(0.95, 2);
            expect(Statistics.chiSquaredCDF(9.210, 2)).toBeCloseTo(0.99, 2);
            expect(Statistics.chiSquaredCDF(11.070, 5)).toBeCloseTo(0.95, 2);
            expect(Statistics.chiSquaredCDF(18.307, 10)).toBeCloseTo(0.95, 2);
        });
    });

    describe('chiSquaredPDF', () => {
        test('returns 0 for nonpositive x', () => {
            expect(Statistics.chiSquaredPDF(0, 1)).toBe(0);
            expect(Statistics.chiSquaredPDF(-1, 2)).toBe(0);
            expect(Statistics.chiSquaredPDF(-10, 5)).toBe(0);
        });

        test('computes known positive density values', () => {
            expect(Statistics.chiSquaredPDF(1, 1)).toBeCloseTo(Math.exp(-0.5) / Math.sqrt(2 * Math.PI), 10);
            expect(Statistics.chiSquaredPDF(2, 2)).toBeCloseTo(Math.exp(-1) / 2, 10);
            expect(Statistics.chiSquaredPDF(3, 3)).toBeCloseTo((Math.sqrt(3) * Math.exp(-1.5)) / Math.sqrt(2 * Math.PI), 10);
            expect(Statistics.chiSquaredPDF(4, 4)).toBeCloseTo(Math.exp(-2), 10);
        });
    });

    describe('sampleSizeTwoMeans', () => {
        test('computes sample size with default alpha=0.05, power=0.8, ratio=1', () => {
            const result = Statistics.sampleSizeTwoMeans(1, 1);
            // using normal approximation: n1 = (1.96 + 0.84)^2 * (1 + 1)/1 ≈ 15.68 -> 16
            expect(result).toEqual({ n1: 16, n2: 16, total: 32 });
        });

        test('computes sample size with explicit alpha, power, and unequal SDs/ratio', () => {
            const result = Statistics.sampleSizeTwoMeans(5, 10, 15, 0.01, 0.9, 2);
            // delta=5, sd1=10, sd2=15, alpha=0.01, power=0.9, ratio=2
            // za ≈ 2.576, zb ≈ 1.282
            // n1 = (2.576 + 1.282)^2 * (100 + 225/2) / 25 ≈ 126.5 -> 127
            // n2 = n1 * 2 ≈ 253
            expect(result).toEqual({ n1: 127, n2: 253, total: 380 });
        });

        test('handles single sd parameter implicitly duplicating for sd2', () => {
            const result = Statistics.sampleSizeTwoMeans(5, 10, undefined, undefined, undefined, undefined);
            // sd2 becomes 10, defaults for rest
            expect(result).toEqual({ n1: 63, n2: 63, total: 126 });
        });

        test('computes sample size with larger power (e.g. 0.95)', () => {
            const result = Statistics.sampleSizeTwoMeans(1, 1, 1, 0.05, 0.95, 1);
            // za = 1.96, zb = 1.645
            // n1 = (1.96 + 1.645)^2 * 2 ≈ 25.99 -> 26
            expect(result).toEqual({ n1: 26, n2: 26, total: 52 });
        });
    });
});
