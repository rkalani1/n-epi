/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load modules by evaluating them into the JSDOM window
const statsCode = fs.readFileSync(path.join(__dirname, '../../js/core/statistics.js'), 'utf8');

beforeAll(() => {
    // Evaluate statistics which assigns to const Statistics.
    // We attach it to window
    window.eval(statsCode + '\n window.Statistics = Statistics;');
});

describe('Statistics.regularizedLowerIncompleteGamma', () => {
    let Statistics;

    beforeEach(() => {
        Statistics = window.Statistics;
    });

    test('should return 0 when x < 0', () => {
        expect(Statistics.regularizedLowerIncompleteGamma(2, -1)).toBe(0);
    });

    test('should return 0 when x === 0', () => {
        expect(Statistics.regularizedLowerIncompleteGamma(2, 0)).toBe(0);
    });

    test('should use lowerIncompleteGammaSeries when x < a + 1', () => {
        // x = 2, a = 3, so 2 < 3 + 1 (2 < 4) is true
        // regularizedLowerIncompleteGamma(3, 2)
        const result = Statistics.regularizedLowerIncompleteGamma(3, 2);
        // expected value: ~0.3233236
        expect(result).toBeCloseTo(0.32332358381693616, 6);
    });

    test('should use upperIncompleteGammaCF when x >= a + 1', () => {
        // x = 10, a = 1, so 10 < 1 + 1 (10 < 2) is false
        // regularizedLowerIncompleteGamma(1, 10)
        const result = Statistics.regularizedLowerIncompleteGamma(1, 10);
        // expected value: ~0.9999546
        expect(result).toBeCloseTo(0.9999546000702375, 6);
    });
});

describe('Statistics.binomialPMF', () => {
    let Statistics;

    beforeEach(() => {
        Statistics = window.Statistics;
    });

    test('should return 0 when k < 0', () => {
        expect(Statistics.binomialPMF(-1, 10, 0.5)).toBe(0);
    });

    test('should return 0 when k > n', () => {
        expect(Statistics.binomialPMF(11, 10, 0.5)).toBe(0);
    });

    test('should return correct PMF for k = 0', () => {
        // P(X=0) for n=10, p=0.5 is 0.5^10
        expect(Statistics.binomialPMF(0, 10, 0.5)).toBeCloseTo(Math.pow(0.5, 10), 6);
    });

    test('should return correct PMF for k = n', () => {
        // P(X=10) for n=10, p=0.5 is 0.5^10
        expect(Statistics.binomialPMF(10, 10, 0.5)).toBeCloseTo(Math.pow(0.5, 10), 6);
    });

    test('should return correct PMF for standard values', () => {
        // P(X=5) for n=10, p=0.5
        // (10 choose 5) * 0.5^5 * 0.5^5 = 252 * 0.5^10 = 0.24609375
        expect(Statistics.binomialPMF(5, 10, 0.5)).toBeCloseTo(0.24609375, 6);
    });
});

describe('Statistics.binomialCDF', () => {
    let Statistics;

    beforeEach(() => {
        Statistics = window.Statistics;
    });

    test('should return 0 when k < 0', () => {
        expect(Statistics.binomialCDF(-1, 10, 0.5)).toBe(0);
    });

    test('should return correct CDF for k = 0', () => {
        // P(X <= 0) = P(X=0) = 0.5^10 = 0.0009765625
        expect(Statistics.binomialCDF(0, 10, 0.5)).toBeCloseTo(Math.pow(0.5, 10), 6);
    });

    test('should return correct CDF for standard intermediate k', () => {
        // For n=5, p=0.3:
        // P(X=0) = 0.7^5 = 0.16807
        // P(X=1) = 5 * 0.3 * 0.7^4 = 0.36015
        // P(X=2) = 10 * 0.09 * 0.7^3 = 0.3087
        // CDF(2) = 0.16807 + 0.36015 + 0.3087 = 0.83692
        expect(Statistics.binomialCDF(2, 5, 0.3)).toBeCloseTo(0.83692, 6);

        // For n=10, p=0.5: CDF(5) = 638 / 1024 = 0.623046875
        expect(Statistics.binomialCDF(5, 10, 0.5)).toBeCloseTo(0.623046875, 6);
    });

    test('should handle non-integer k by flooring k', () => {
        // binomialCDF(2.8, 5, 0.3) should equal binomialCDF(2, 5, 0.3)
        expect(Statistics.binomialCDF(2.8, 5, 0.3)).toBeCloseTo(0.83692, 6);
    });

    test('should return 1 when k = n or k > n', () => {
        expect(Statistics.binomialCDF(10, 10, 0.5)).toBe(1);
        expect(Statistics.binomialCDF(15, 10, 0.5)).toBe(1);
    });

    test('should handle edge probabilities p = 0 and p = 1', () => {
        // For p = 0, X is always 0: CDF(k >= 0) = 1
        expect(Statistics.binomialCDF(0, 10, 0)).toBe(1);
        expect(Statistics.binomialCDF(5, 10, 0)).toBe(1);

        // For p = 1, X is always n: CDF(k < n) = 0, CDF(k >= n) = 1
        expect(Statistics.binomialCDF(9, 10, 1)).toBe(0);
        expect(Statistics.binomialCDF(10, 10, 1)).toBe(1);
    });
});
