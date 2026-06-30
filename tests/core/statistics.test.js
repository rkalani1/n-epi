const fs = require('fs');
const path = require('path');

// Load modules by evaluating them into the JSDOM window
const statsCode = fs.readFileSync(path.join(__dirname, '../../js/core/statistics.js'), 'utf8');

beforeAll(() => {
    // Evaluate statistics which assigns to const Statistics.
    window.eval(statsCode + '\n window.Statistics = Statistics;');
});

describe('Statistics Module - tPDF', () => {
    let stats;

    beforeEach(() => {
        stats = window.Statistics;
    });

    test('calculates correct values for tPDF', () => {
        // Values calculated using scipy.stats.t.pdf
        const testCases = [
            { t: 0, df: 1, expected: 0.31830988618379075 },
            { t: 0, df: 10, expected: 0.38910838396603115 },
            { t: 1.96, df: 10, expected: 0.0650947506545504 },
            { t: 2.5, df: 30, expected: 0.02105701922062158 },
            { t: -1.5, df: 5, expected: 0.12451734464635511 },
            { t: 0, df: 100, expected: 0.39794618693590594 }
        ];

        testCases.forEach(({ t, df, expected }) => {
            const result = stats.tPDF(t, df);
            expect(result).toBeCloseTo(expected, 6);
        });
    });

    test('handles edge cases for tPDF', () => {
        expect(stats.tPDF(0, 0)).toBeNaN();
        expect(stats.tPDF(0, -1)).toBeNaN();
        expect(stats.tPDF(NaN, 1)).toBeNaN();
        expect(stats.tPDF(0, NaN)).toBeNaN();
        expect(stats.tPDF(Infinity, 1)).toBe(0);
        expect(stats.tPDF(-Infinity, 1)).toBe(0);

        // When df = Infinity, it converges to normal distribution
        expect(stats.tPDF(0, Infinity)).toBeCloseTo(0.3989422804014327, 6); // 1 / sqrt(2*pi)
    });
});
