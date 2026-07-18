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

describe('Mantel-Haenszel — Breslow-Day homogeneity test', () => {
    // Independent expected-cell solver via bisection (different algorithm than the
    // closed-form quadratic used in the implementation) for cross-verification.
    function breslowDayIndependent(tables, orMH) {
        let bd = 0;
        tables.forEach((t) => {
            const n = t.a + t.b + t.c + t.d;
            const r1 = t.a + t.b, c1 = t.a + t.c;
            const lo = Math.max(0, r1 + c1 - n) + 1e-9;
            const hi = Math.min(r1, c1) - 1e-9;
            const orAt = (a) => (a * (n - r1 - c1 + a)) / ((r1 - a) * (c1 - a));
            let a = lo, b = hi;
            for (let i = 0; i < 200; i++) {
                const m = (a + b) / 2;
                (orAt(m) < orMH) ? (a = m) : (b = m);
            }
            const aE = (a + b) / 2, bE = r1 - aE, cE = c1 - aE, dE = n - r1 - cE;
            const varA = 1 / (1 / aE + 1 / bE + 1 / cE + 1 / dE);
            bd += Math.pow(t.a - aE, 2) / varA;
        });
        return bd;
    }

    test('matches an independent bisection-based computation (heterogeneous strata)', () => {
        const tables = [
            { a: 15, b: 10, c: 12, d: 18 },
            { a: 8, b: 14, c: 20, d: 9 },
            { a: 25, b: 12, c: 10, d: 22 }
        ];
        const res = Statistics.mantelHaenszel(tables, 'OR');
        const expected = breslowDayIndependent(tables, res.estimate);
        expect(res.breslowDay.statistic).toBeCloseTo(expected, 4);
        // Sanity: the old broken Newton iteration produced values in the hundreds.
        expect(res.breslowDay.statistic).toBeLessThan(50);
    });

    test('is near zero and non-significant for homogeneous strata (equal OR)', () => {
        // Each stratum has OR = 2 exactly.
        const tables = [
            { a: 20, b: 10, c: 10, d: 10 },
            { a: 40, b: 20, c: 20, d: 20 },
            { a: 16, b: 8, c: 8, d: 8 }
        ];
        const res = Statistics.mantelHaenszel(tables, 'OR');
        expect(res.breslowDay.statistic).toBeLessThan(1e-6);
        expect(res.breslowDay.pValue).toBeGreaterThan(0.9);
    });
});
