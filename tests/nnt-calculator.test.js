const fs = require('fs');
const path = require('path');

// Load modules by evaluating them into the JSDOM window
const statsCode = fs.readFileSync(path.join(__dirname, '../js/core/statistics.js'), 'utf8');
const nntCode = fs.readFileSync(path.join(__dirname, '../js/modules/nnt-calculator.js'), 'utf8');

beforeAll(() => {
    // Setup necessary globals
    window.App = {
        registerModule: jest.fn(),
        createModuleLayout: jest.fn(),
        tooltip: jest.fn()
    };

    window.Export = {
        showToast: jest.fn(),
        copyText: jest.fn()
    };

    // Evaluate statistics which assigns to const Statistics.
    // We attach it to window so nnt-calculator can use it
    window.eval(statsCode + '\n window.Statistics = Statistics;');

    // Evaluate NNT calculator module
    window.eval(nntCode);
});

describe('nnt-calculator pure functions', () => {
    let nnt;

    beforeEach(() => {
        nnt = window.NNTModule;
    });

    test('ratesTo2x2 converts rates to canonical 2x2 table correctly', () => {
        const result = nnt._ratesTo2x2(0.20, 0.10, 100, 100);
        expect(result).toEqual({ a: 10, b: 90, c: 20, d: 80 });
    });

    test('ratesTo2x2 handles fractions by rounding', () => {
        const result = nnt._ratesTo2x2(0.20, 0.10, 105, 105);
        expect(result).toEqual({ a: 11, b: 94, c: 21, d: 84 });
    });

    test('ratesTo2x2 works for 0% and 100% rates', () => {
        const result = nnt._ratesTo2x2(0, 1, 50, 50);
        expect(result).toEqual({ a: 50, b: 0, c: 0, d: 50 });
    });

    test('publishedTo2x2 correctly reconstructs RR measure', () => {
        const result = nnt._publishedTo2x2('rr', 0.5, 0.20, 200);
        expect(result).toEqual({ a: 10, b: 90, c: 20, d: 80 });
    });

    test('publishedTo2x2 correctly reconstructs OR measure', () => {
        const result = nnt._publishedTo2x2('or', 0.4444444444, 0.20, 200);
        expect(result.a).toBe(10);
        expect(result.c).toBe(20);
    });

    test('publishedTo2x2 uses default N=500 per arm if totalN is invalid or missing', () => {
        const result = nnt._publishedTo2x2('rr', 0.5, 0.20, 0);
        expect(result).toEqual({ a: 50, b: 450, c: 100, d: 400 });
    });

    test('publishedTo2x2 bounds EER between 0.0001 and 0.9999', () => {
        const result = nnt._publishedTo2x2('rr', 10, 0.20, 200);
        expect(result.a).toBe(100);
        expect(result.b).toBe(0);
    });

    test('publishedTo2x2 bounds EER exactly to 0.0001 when negative or 0', () => {
        const result = nnt._publishedTo2x2('rr', 0, 0.20, 200);
        expect(result.a).toBe(0);
        expect(result.b).toBe(100);
    });
});
