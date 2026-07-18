/**
 * Regression tests for calculator-accuracy fixes identified in the
 * 2026 methods audit. Each block documents the reference value and source.
 */
const Statistics = require('../../js/core/statistics.js');

describe('Sample size — survival (Freedman)', () => {
    // Freedman events (1:1) = ((HR+1)/(HR-1))^2 * (z_a/2 + z_b)^2.
    // HR=0.7, alpha=0.05, power=0.80 -> 32.111 * 7.849 = 252.0 -> 253.
    test('HR=0.7 gives ~253 events (not the ~4x-inflated 1009)', () => {
        const r = Statistics.sampleSizeFreedman(0.7, 0.05, 0.80, 1);
        expect(r.events).toBe(253);
    });
    test('HR=0.5, power=0.90 gives ~95 events (near Schoenfeld 88)', () => {
        const r = Statistics.sampleSizeFreedman(0.5, 0.05, 0.90, 1);
        expect(r.events).toBeGreaterThanOrEqual(93);
        expect(r.events).toBeLessThanOrEqual(97);
    });
    test('reduces to ((HR+1)/(HR-1))^2 form at ratio 1', () => {
        const hr = 0.6, za = Statistics.normalQuantile(0.975), zb = Statistics.normalQuantile(0.80);
        const expected = Math.ceil(Math.pow(za + zb, 2) * Math.pow((hr + 1) / (hr - 1), 2));
        expect(Statistics.sampleSizeFreedman(hr, 0.05, 0.80, 1).events).toBe(expected);
    });
});

describe('Sample size — equivalence (TOST)', () => {
    // At true difference 0, power term uses z_{1-beta/2}. p1=0.5, margin=0.1,
    // alpha=0.05, power=0.80 -> n1 = 429 (Chow/Julious). The z_{1-beta} bug gave 310.
    test('p1=0.5, margin=0.1 gives ~429/group (not the under-powered 310)', () => {
        const r = Statistics.sampleSizeEquivalence(0.5, 0.1, 0.05, 0.80);
        expect(r.n1).toBe(429);
    });
    test('equivalence N exceeds non-inferiority N for the same inputs', () => {
        const eq = Statistics.sampleSizeEquivalence(0.5, 0.1, 0.05, 0.80).n1;
        const ni = Statistics.sampleSizeNonInferiority(0.5, 0.5, 0.1, 0.05, 0.80, 1).n1;
        expect(eq).toBeGreaterThan(ni);
    });
});
