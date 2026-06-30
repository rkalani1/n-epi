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
