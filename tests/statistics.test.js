/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const statsCode = ['constants.js', 'special-functions.js', 'normal-distribution.js', 'students-t-distribution.js', 'chi-squared-distribution.js', 'f-distribution.js', 'binomial-distribution.js', 'poisson-distribution.js', 'hypergeometric-distribution.js', 'confidence-intervals-for-proportions.js', 'hypothesis-tests.js', 'sample-size-formulas.js', 'meta-analysis.js', 'survival-analysis.js', 'diagnostic-accuracy.js', 'epidemiology-2x2-table.js', 'effect-size-conversions.js', 'utility-functions.js'].map(f => fs.readFileSync(path.join(__dirname, '../js/core/stats/' + f), 'utf8')).join('\n');

beforeAll(() => {
    // Evaluate statistics which assigns to const Statistics.
    window.eval(statsCode + '\n window.Statistics = Statistics;');
});

describe('Statistics Module - normalQuantile', () => {
    let stats;

    beforeEach(() => {
        stats = window.Statistics;
    });

    test('normalQuantile handles edge case p <= 0', () => {
        expect(stats.normalQuantile(0)).toBe(-Infinity);
        expect(stats.normalQuantile(-1)).toBe(-Infinity);
    });

    test('normalQuantile handles edge case p >= 1', () => {
        expect(stats.normalQuantile(1)).toBe(Infinity);
        expect(stats.normalQuantile(2)).toBe(Infinity);
    });

    test('normalQuantile handles center point p === 0.5', () => {
        expect(stats.normalQuantile(0.5)).toBe(0);
    });

    test('normalQuantile calculates correctly for standard quantiles', () => {
        // Standard normal quantile for 0.975 is approximately 1.95996
        expect(stats.normalQuantile(0.975)).toBeCloseTo(1.95996, 4);

        // Standard normal quantile for 0.025 is approximately -1.95996
        expect(stats.normalQuantile(0.025)).toBeCloseTo(-1.95996, 4);

        // Standard normal quantile for 0.95 is approximately 1.64485
        expect(stats.normalQuantile(0.95)).toBeCloseTo(1.64485, 4);

        // Standard normal quantile for 0.05 is approximately -1.64485
        expect(stats.normalQuantile(0.05)).toBeCloseTo(-1.64485, 4);
    });

    test('normalQuantile calculates correctly for extreme probabilities', () => {
        // Test p < 0.02425 branch
        expect(stats.normalQuantile(0.01)).toBeCloseTo(-2.32635, 4);

        // Test p > 0.97575 branch
        expect(stats.normalQuantile(0.99)).toBeCloseTo(2.32635, 4);
    });
});
