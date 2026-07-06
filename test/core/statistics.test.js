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

    describe('logRankTest', () => {
        test('returns null if there are not exactly 2 unique groups', () => {
            // 1 group
            expect(Statistics.logRankTest([10], [1], ['A'])).toBeNull();

            // 3 groups
            expect(Statistics.logRankTest(
                [10, 20, 30],
                [1, 1, 1],
                ['A', 'B', 'C']
            )).toBeNull();
        });

        test('computes correct statistics for a typical dataset', () => {
            const times = [10, 20, 30, 40, 50, 15, 25, 35, 45, 55];
            const events = [1, 1, 0, 1, 0, 1, 0, 1, 0, 1];
            const groups = ['A', 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B'];

            const result = Statistics.logRankTest(times, events, groups);

            expect(result).not.toBeNull();

            // From our reference run
            expect(result.O1).toBe(3);
            expect(result.E1).toBeCloseTo(2.3444444, 5);
            expect(result.V).toBeCloseTo(1.2369135, 5);
            expect(result.chi2).toBeCloseTo(0.347439, 5);
            expect(result.pValue).toBeCloseTo(0.55556, 4);
            expect(result.hr).toBeCloseTo(1.69892, 4);
            expect(result.seLnHR).toBeCloseTo(0.899146, 5);
            expect(result.hrCI.lower).toBeCloseTo(0.29162, 4);
            expect(result.hrCI.upper).toBeCloseTo(9.89755, 4);
        });

        test('handles dataset with no events (all censored)', () => {
            const times = [10, 20, 15, 25];
            const events = [0, 0, 0, 0]; // all censored
            const groups = ['A', 'A', 'B', 'B'];

            const result = Statistics.logRankTest(times, events, groups);

            // If there are no events, O1=0, E1=0, V=0.
            // chi2 will be 0/0 -> NaN or 0 if handled. In JS Math.pow(0,2)/0 is NaN.
            expect(result).not.toBeNull();
            expect(result.O1).toBe(0);
            expect(result.E1).toBe(0);
            expect(result.V).toBe(0);
            expect(Number.isNaN(result.chi2)).toBe(true);
        });

        test('handles tied event times across groups', () => {
            const times = [10, 10, 20, 20];
            const events = [1, 1, 0, 1];
            const groups = ['A', 'B', 'A', 'B'];

            const result = Statistics.logRankTest(times, events, groups);

            expect(result).not.toBeNull();
            // Expected checks for tied events
            // at t=10, 4 at risk (2 in A, 2 in B), 2 died (1 in A, 1 in B)
            // e1 = nRisk[0] * totalEvents / totalRisk = 2 * 2 / 4 = 1
            // v = 2*2*2*(4-2) / (4*4*3) = 16 / 48 = 1/3 (0.333...)

            // at t=20, 2 at risk (1 in A, 1 in B), 1 died (0 in A, 1 in B)
            // e1 = 1 * 1 / 2 = 0.5
            // v = 1*1*1*(2-1) / (2*2*1) = 1/4 = 0.25

            // Total O1 = 1 + 0 = 1
            // Total E1 = 1 + 0.5 = 1.5
            // Total V = 0.3333 + 0.25 = 0.583333...

            expect(result.O1).toBe(1);
            expect(result.E1).toBeCloseTo(1.5, 4);
            expect(result.V).toBeCloseTo(0.58333, 4);
        });
});
});
