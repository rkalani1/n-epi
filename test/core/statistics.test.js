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

    describe('tQuantile', () => {
        test('matches standard t-distribution quantile table values', () => {
            // df = 1
            expect(Statistics.tQuantile(0.95, 1)).toBeCloseTo(6.313751514675035, 5);

            // df = 5
            expect(Statistics.tQuantile(0.5, 5)).toBeCloseTo(0, 5);
            expect(Statistics.tQuantile(0.95, 5)).toBeCloseTo(2.0150483733330693, 5);

            // df = 10
            expect(Statistics.tQuantile(0.025, 10)).toBeCloseTo(-2.2281388519862753, 5);
            expect(Statistics.tQuantile(0.975, 10)).toBeCloseTo(2.228138851986274, 5);

            // df = 30
            expect(Statistics.tQuantile(0.975, 30)).toBeCloseTo(2.042272456301238, 5);
            expect(Statistics.tQuantile(0.025, 30)).toBeCloseTo(-2.042272456301238, 5);
        });

        test('handles probabilities at or beyond boundaries', () => {
            expect(Statistics.tQuantile(0, 10)).toBe(-Infinity);
            expect(Statistics.tQuantile(-0.1, 10)).toBe(-Infinity);
            expect(Statistics.tQuantile(1, 10)).toBe(Infinity);
            expect(Statistics.tQuantile(1.1, 10)).toBe(Infinity);
        });

        test('handles infinite degrees of freedom (converges to normal distribution)', () => {
            // Should match normalQuantile
            expect(Statistics.tQuantile(0.975, Infinity)).toBeCloseTo(1.959963984540054, 5);
            expect(Statistics.tQuantile(0.025, Infinity)).toBeCloseTo(-1.959963984540054, 5);
            expect(Statistics.tQuantile(0.5, Infinity)).toBeCloseTo(0, 5);
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

    describe('waldCI', () => {
        test('calculates Wald CI correctly with specified z', () => {
            const p = 0.5;
            const n = 100;
            const z = 1.96; // Approximate 95% CI
            const result = Statistics.waldCI(p, n, z);
            
            // se = sqrt(0.5 * 0.5 / 100) = 0.05
            // lower = 0.5 - 1.96 * 0.05 = 0.402
            // upper = 0.5 + 1.96 * 0.05 = 0.598
            expect(result.se).toBeCloseTo(0.05, 5);
            expect(result.lower).toBeCloseTo(0.402, 5);
            expect(result.upper).toBeCloseTo(0.598, 5);
        });

        test('uses default z value when z is omitted', () => {
            const p = 0.5;
            const n = 100;
            const result = Statistics.waldCI(p, n);
            const zDefault = Statistics.normalQuantile(0.975);
            expect(result.lower).toBeCloseTo(0.5 - zDefault * 0.05, 5);
            expect(result.upper).toBeCloseTo(0.5 + zDefault * 0.05, 5);
        });

        test('caps lower bound at 0', () => {
            const result = Statistics.waldCI(0.01, 10, 2);
            expect(result.lower).toBe(0);
        });

        test('caps upper bound at 1', () => {
            const result = Statistics.waldCI(0.99, 10, 2);
            expect(result.upper).toBe(1);
        });
    });
});

    describe('twoByTwo', () => {
        test('computes risk ratio, odds ratio, and risk difference correctly', () => {
            const result = Statistics.twoByTwo(20, 80, 10, 90);

            // Proportions
            expect(result.p1).toBeCloseTo(0.2, 5);
            expect(result.p2).toBeCloseTo(0.1, 5);

            // Risk Ratio
            expect(result.rr.value).toBeCloseTo(2, 5);
            expect(result.rr.ci.lower).toBeCloseTo(0.98656, 5);
            expect(result.rr.ci.upper).toBeCloseTo(4.05448, 5);

            // Odds Ratio
            expect(result.or.value).toBeCloseTo(2.25, 5);
            expect(result.or.ci.lower).toBeCloseTo(0.99429, 5);
            expect(result.or.ci.upper).toBeCloseTo(5.09155, 5);

            expect(result.rd.value).toBeCloseTo(0.1, 5);
            expect(result.rd.ci.lower).toBeCloseTo(0.00200, 5);
            expect(result.rd.ci.upper).toBeCloseTo(0.19800, 5);

            // NNT — exposed risk (0.2) exceeds unexposed (0.1), so rd > 0 is HARM.
            expect(result.nnt.value).toBeCloseTo(10, 5);
            expect(result.nnt.ci.crossesZero).toBe(false);
            expect(result.nnt.ci.lower).toBeCloseTo(5.05055, 5);
            expect(result.nnt.ci.upper).toBeCloseTo(499.55023, 5);
            expect(result.nnt.isHarm).toBe(true);

            // Attributable Fractions
            expect(result.afExposed).toBeCloseTo(0.5, 5);
            expect(result.paf).toBeCloseTo(0.33333, 5);

            // Counts
            expect(result.counts).toEqual({ a: 20, b: 80, c: 10, d: 90, n: 200 });
        });

        test('handles a protective exposure (negative risk difference) as benefit', () => {
            const result = Statistics.twoByTwo(10, 90, 20, 80);

            expect(result.rd.value).toBeCloseTo(-0.1, 5);
            // Value is the NNT magnitude; the direction is carried by isHarm.
            expect(result.nnt.value).toBeCloseTo(10, 5);
            expect(result.nnt.isHarm).toBe(false);
        });

        test('handles zero risk difference (Infinity NNT, CI crosses zero)', () => {
            const result = Statistics.twoByTwo(10, 90, 10, 90);

            expect(result.rd.value).toBeCloseTo(0, 5);
            expect(result.nnt.value).toBe(Infinity);
            expect(result.nnt.ci.crossesZero).toBe(true);
            expect(result.nnt.isHarm).toBe(false);
        });

        test('applies Haldane-Anscombe 0.5 correction to zero cells for odds ratio', () => {
            const result = Statistics.twoByTwo(10, 0, 10, 90); // b = 0
            // (10.5 * 90.5) / (0.5 * 10.5) = 181
            expect(result.or.value).toBeCloseTo(181, 5);
            expect(result.or.continuityCorrected).toBe(true);
            expect(Number.isFinite(result.or.ci.lower)).toBe(true);
            expect(Number.isFinite(result.or.ci.upper)).toBe(true);

            const result2 = Statistics.twoByTwo(0, 10, 10, 90); // a = 0
            // (0.5 * 90.5) / (10.5 * 10.5) = 0.41043...
            expect(result2.or.value).toBeGreaterThan(0);
            expect(result2.or.continuityCorrected).toBe(true);

            // No zero cells: no correction, values unchanged
            const clean = Statistics.twoByTwo(10, 90, 20, 80);
            expect(clean.or.continuityCorrected).toBeFalsy();
            expect(clean.or.value).toBeCloseTo((10 * 80) / (90 * 20), 8);
        });
    });

describe('Additional Statistics Coverage', () => {
    describe('poissonCDF', () => {
        test('handles edge cases and known cumulative values', () => {
            expect(Statistics.poissonCDF(-1, 2)).toBe(0);
            expect(Statistics.poissonCDF(0, 2)).toBeCloseTo(0.1353352832366127, 8);
            expect(Statistics.poissonCDF(1, 2)).toBeCloseTo(0.4060058497098381, 8);
            expect(Statistics.poissonCDF(2.9, 2)).toBeCloseTo(Statistics.poissonCDF(2, 2), 8);
            expect(Statistics.poissonCDF(20, 2)).toBeCloseTo(1, 8);
        });
    });

    describe('fCDF', () => {
        test('handles nonpositive x and standard F-distribution values', () => {
            expect(Statistics.fCDF(0, 1, 1)).toBe(0);
            expect(Statistics.fCDF(-1, 5, 10)).toBe(0);
            expect(Statistics.fCDF(4.9646, 1, 10)).toBeCloseTo(0.95, 4);
            expect(Statistics.fCDF(4.1028, 2, 10)).toBeCloseTo(0.95, 4);
            expect(Statistics.fCDF(2.7109, 5, 20)).toBeCloseTo(0.95, 4);
        });
    });

    describe('diagnosticAccuracy', () => {
        test('calculates standard diagnostic accuracy metrics', () => {
            const result = Statistics.diagnosticAccuracy(40, 10, 20, 80);
            expect(result.sensitivity.value).toBeCloseTo(2 / 3, 5);
            expect(result.specificity.value).toBeCloseTo(8 / 9, 5);
            expect(result.ppv.value).toBeCloseTo(0.8, 5);
            expect(result.npv.value).toBeCloseTo(0.8, 5);
            expect(result.plr).toBeCloseTo(6, 5);
            expect(result.nlr).toBeCloseTo(0.375, 5);
            expect(result.dor).toBeCloseTo(16, 5);
            expect(result.accuracy).toBeCloseTo(0.8, 5);
            expect(result.prevalence).toBeCloseTo(0.4, 5);
            expect(result.youdenJ).toBeCloseTo(5 / 9, 5);
        });

        test('handles perfect and completely wrong tests', () => {
            const perfect = Statistics.diagnosticAccuracy(50, 0, 0, 50);
            expect(perfect.sensitivity.value).toBeCloseTo(1, 5);
            expect(perfect.specificity.value).toBeCloseTo(1, 5);
            expect(perfect.plr).toBe(Infinity);
            expect(perfect.nlr).toBeCloseTo(0, 5);
            expect(perfect.dor).toBe(Infinity);

            const wrong = Statistics.diagnosticAccuracy(0, 50, 50, 0);
            expect(wrong.sensitivity.value).toBeCloseTo(0, 5);
            expect(wrong.specificity.value).toBeCloseTo(0, 5);
            expect(wrong.plr).toBeCloseTo(0, 5);
            expect(wrong.nlr).toBe(Infinity);
            expect(wrong.dor).toBeCloseTo(0, 5);
            expect(wrong.youdenJ).toBeCloseTo(-1, 5);
        });
    });

    describe('sampleSizeTwoMeans', () => {
        test('computes default, unequal-ratio, and high-power sample sizes', () => {
            expect(Statistics.sampleSizeTwoMeans(1, 1)).toEqual({ n1: 16, n2: 16, total: 32 });
            expect(Statistics.sampleSizeTwoMeans(5, 10, 15, 0.01, 0.9, 2)).toEqual({ n1: 127, n2: 253, total: 380 });
            expect(Statistics.sampleSizeTwoMeans(5, 10, undefined, undefined, undefined, undefined)).toEqual({ n1: 63, n2: 63, total: 126 });
            expect(Statistics.sampleSizeTwoMeans(1, 1, 1, 0.05, 0.95, 1)).toEqual({ n1: 26, n2: 26, total: 52 });
        });
    });

    describe('chiSquaredTest2x2', () => {
        test('calculates uncorrected and Yates-corrected chi-squared tests', () => {
            const noEffect = Statistics.chiSquaredTest2x2(10, 10, 10, 10);
            expect(noEffect.chi2).toBe(0);
            expect(noEffect.df).toBe(1);
            expect(noEffect.pValue).toBe(1);

            const uncorrected = Statistics.chiSquaredTest2x2(15, 5, 5, 15);
            expect(uncorrected.chi2).toBeCloseTo(10, 5);
            expect(uncorrected.pValue).toBeCloseTo(0.0015654, 5);

            const yates = Statistics.chiSquaredTest2x2(15, 5, 5, 15, true);
            expect(yates.chi2).toBeCloseTo(8.1, 5);
            expect(yates.pValue).toBeCloseTo(0.0044265, 5);
        });
    });

    describe('sampleSizeTwoProportions', () => {
        test('computes supported methods and rejects invalid methods', () => {
            expect(Statistics.sampleSizeTwoProportions(0.5, 0.4)).toEqual({ n1: 388, n2: 388, total: 776 });
            expect(Statistics.sampleSizeTwoProportions(0.5, 0.4, 0.05, 0.8, 1, 'fleiss')).toEqual({ n1: 408, n2: 408, total: 816 });
            expect(Statistics.sampleSizeTwoProportions(0.5, 0.4, 0.05, 0.8, 1, 'arcsine')).toEqual({ n1: 194, n2: 194, total: 388 });
            expect(Statistics.sampleSizeTwoProportions(0.5, 0.4, 0.05, 0.8, 2, 'arcsine')).toEqual({ n1: 194, n2: 388, total: 582 });
            expect(Statistics.sampleSizeTwoProportions(0.5, 0.4, 0.05, 0.8, 1, 'invalid_method')).toBeNull();
        });
    });

    describe('sampleSizeCluster', () => {
        test('computes cluster-randomized sample size correctly for standard inputs', () => {
            const nIndividual = 100;
            const icc = 0.1;
            const clusterSize = 10;

            // deff = 1 + (10 - 1) * 0.1 = 1 + 9 * 0.1 = 1.9
            // nAdjusted = Math.ceil(100 * 1.9) = 190
            // nClusters = Math.ceil(190 / 10) = 19
            // totalN = 19 * 10 = 190
            const result = Statistics.sampleSizeCluster(nIndividual, icc, clusterSize);
            expect(result.deff).toBeCloseTo(1.9, 5);
            expect(result.nAdjusted).toBe(190);
            expect(result.nClusters).toBe(19);
            expect(result.totalN).toBe(190);
        });

        test('handles icc = 0 (no cluster effect, deff = 1)', () => {
            const result = Statistics.sampleSizeCluster(100, 0, 20);
            expect(result.deff).toBe(1);
            expect(result.nAdjusted).toBe(100);
            expect(result.nClusters).toBe(5);
            expect(result.totalN).toBe(100);
        });

        test('handles clusterSize = 1 (individual randomization equivalent)', () => {
            const result = Statistics.sampleSizeCluster(100, 0.1, 1);
            expect(result.deff).toBe(1);
            expect(result.nAdjusted).toBe(100);
            expect(result.nClusters).toBe(100);
            expect(result.totalN).toBe(100);
        });

        test('correctly rounds up nAdjusted and nClusters when fractional', () => {
            // nIndividual = 101, icc = 0.02, clusterSize = 15
            // deff = 1 + 14 * 0.02 = 1.28
            // nAdjusted = Math.ceil(101 * 1.28) = Math.ceil(129.28) = 130
            // nClusters = Math.ceil(130 / 15) = Math.ceil(8.6667) = 9
            // totalN = 9 * 15 = 135
            const result = Statistics.sampleSizeCluster(101, 0.02, 15);
            expect(result.deff).toBeCloseTo(1.28, 5);
            expect(result.nAdjusted).toBe(130);
            expect(result.nClusters).toBe(9);
            expect(result.totalN).toBe(135);
        });
    });

    describe('mcNemarTest', () => {
        test('calculates exact and asymptotic McNemar tests', () => {
            const exact = Statistics.mcNemarTest(10, 2, true);
            expect(exact.method).toBe('exact');
            expect(exact.statistic).toBeNull();
            expect(exact.pValue).toBeCloseTo(0.038574, 4);

            const asymptotic = Statistics.mcNemarTest(10, 2, false);
            expect(asymptotic.method).toBe('asymptotic');
            expect(asymptotic.df).toBe(1);
            expect(asymptotic.chi2).toBeCloseTo(5.3333, 4);
            expect(asymptotic.pValue).toBeCloseTo(0.020921, 4);
        });

        test('handles ties and zero discordant cells', () => {
            expect(Statistics.mcNemarTest(5, 5, true).pValue).toBe(1);
            expect(Statistics.mcNemarTest(5, 5, false).chi2).toBe(0);
            expect(Statistics.mcNemarTest(10, 0, true).pValue).toBeCloseTo(0.001953125, 4);
            expect(Statistics.mcNemarTest(10, 0, false).chi2).toBeCloseTo(10, 4);
        });
    });

    describe('wilsonCI', () => {
        test('calculates Wilson intervals with bounds and custom z-scores', () => {
            const z = Statistics.normalQuantile(0.975);
            const ci = Statistics.wilsonCI(0.5, 100, z);
            expect(ci.lower).toBeCloseTo(0.40383, 5);
            expect(ci.upper).toBeCloseTo(0.59617, 5);

            expect(Statistics.wilsonCI(0, 10, 1.96).lower).toBe(0);
            expect(Statistics.wilsonCI(1, 10, 1.96).upper).toBe(1);

            const wide = Statistics.wilsonCI(0.5, 100, 2.576);
            expect(wide.lower).toBeCloseTo(0.3753, 4);
            expect(wide.upper).toBeCloseTo(0.6247, 4);
        });
    });

    describe('kaplanMeier', () => {
        test('computes survival for a single group', () => {
            const results = Statistics.kaplanMeier([1, 2, 2, 3, 4, 5], [1, 1, 0, 1, 0, 1]);
            const group0 = results['0'];
            expect(group0.n).toBe(6);
            expect(group0.median).toBe(3);
            expect(group0.table[1]).toMatchObject({ time: 1, nRisk: 6, events: 1, censored: 0 });
            expect(group0.table[1].survival).toBeCloseTo(5 / 6, 5);
            expect(group0.table[2].survival).toBeCloseTo((5 / 6) * (4 / 5), 5);
            expect(group0.table[5].survival).toBe(0);
        });

        test('computes survival for multiple groups and Greenwood intervals', () => {
            const grouped = Statistics.kaplanMeier(
                [1, 2, 3, 2, 4, 5],
                [1, 1, 0, 1, 0, 1],
                ['A', 'A', 'A', 'B', 'B', 'B']
            );
            expect(grouped.A.n).toBe(3);
            expect(grouped.B.n).toBe(3);
            expect(grouped.A.median).toBe(2);
            expect(grouped.B.median).toBe(5);

            const single = Statistics.kaplanMeier([1, 2, 3], [1, 1, 0]);
            expect(single['0'].table[1].se).toBeCloseTo((2 / 3) * Math.sqrt(1 / 6), 5);
        });
    });

    describe('metaAnalysisFixedEffect', () => {
        test('calculates fixed-effect meta-analysis with internal and explicit weights', () => {
            const effects = [0.1, 0.2, 0.3];
            const variances = [0.01, 0.04, 0.09];
            const result = Statistics.metaAnalysisFixedEffect(effects, variances);
            expect(result.pooled).toBeCloseTo(0.13469, 4);
            expect(result.se).toBeCloseTo(0.08571, 4);
            expect(result.z).toBeCloseTo(1.5714, 4);
            expect(result.weights[0]).toBeCloseTo(100, 4);

            const weighted = Statistics.metaAnalysisFixedEffect(effects, variances, [50, 50, 50]);
            expect(weighted.pooled).toBeCloseTo(0.2, 4);
            expect(weighted.se).toBeCloseTo(0.08165, 4);
            expect(weighted.z).toBeCloseTo(2.44948, 4);
            expect(weighted.weights).toEqual([50, 50, 50]);
        });
    });

    describe('logRankTest', () => {
        test('returns null unless there are exactly two groups', () => {
            expect(Statistics.logRankTest([10, 20, 30], [1, 1, 1], [1, 1, 1])).toBeNull();
            expect(Statistics.logRankTest([10, 20, 30], [1, 1, 1], [1, 2, 3])).toBeNull();
        });

        test('calculates standard, tied-time, and no-event datasets', () => {
            const result = Statistics.logRankTest(
                [10, 20, 30, 40, 50, 60, 70, 80],
                [1, 1, 0, 1, 1, 0, 1, 0],
                [1, 1, 1, 1, 2, 2, 2, 2]
            );
            expect(result.chi2).toBeCloseTo(5.347771891555002, 5);
            expect(result.pValue).toBeCloseTo(0.020748769062276073, 5);
            expect(result.hr).toBeCloseTo(17.41946107240046, 5);

            const tied = Statistics.logRankTest([10, 10, 20, 20], [1, 1, 1, 0], [1, 2, 1, 2]);
            expect(tied.O1).toBe(2);
            expect(tied.E1).toBeCloseTo(1.5, 5);
            expect(tied.V).toBeCloseTo(0.5833333333333333, 5);

            // No events -> zero log-rank variance: the test is undefined and returns null
            const noEvents = Statistics.logRankTest([10, 20, 30, 40], [0, 0, 0, 0], [1, 1, 2, 2]);
            expect(noEvents).toBeNull();
        });
    });

    describe('fisherExact', () => {
        test('calculates exact p-values and caps at 1', () => {
            expect(Statistics.fisherExact(10, 10, 10, 10).pValue).toBeCloseTo(1.0, 4);
            expect(Statistics.fisherExact(2, 14, 15, 3).pValue).toBeCloseTo(0.000086035, 6);
            expect(Statistics.fisherExact(0, 5, 5, 0).pValue).toBeCloseTo(0.0079365, 5);
            expect(Statistics.fisherExact(1, 9, 11, 3).pValue).toBeCloseTo(0.002759, 5);
            expect(Statistics.fisherExact(5, 5, 5, 5).pValue).toBeLessThanOrEqual(1.0);
        });
    });
});
