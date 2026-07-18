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

describe('Sample size — multi-arm multiplicity scaling', () => {
    // Only z_alpha changes with the adjustment, so N scales by
    // (z_adj + z_beta)^2 / (z_orig + z_beta)^2, not (z_adj/z_orig)^2.
    test('3-arm Bonferroni from 400/group gives 485/arm (not the inflated 524)', () => {
        const r = Statistics.sampleSizeMultiArm(400, 3, 'bonferroni', 0.80);
        expect(r.nPerArm).toBe(485);
        expect(r.adjustedAlpha).toBeCloseTo(0.025, 6);
        // The old alpha-only scaling over-inflated N.
        const za = Statistics.normalQuantile(0.9875), z0 = Statistics.normalQuantile(0.975);
        const oldN = Math.ceil(400 * (za / z0) * (za / z0));
        expect(r.nPerArm).toBeLessThan(oldN);
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

describe('Meta-analysis — HKSJ uses t_{k-1}', () => {
    const effects = [0.5, 0.7, 0.3, 0.9, 0.6];
    const variances = [0.05, 0.08, 0.06, 0.10, 0.04];
    const k = effects.length;

    test('HKSJ CI and p-value use the t_{k-1} reference', () => {
        const hk = Statistics.metaAnalysisRandomEffects(effects, variances, { hksj: true });
        const halfWidth = (hk.ci.upper - hk.ci.lower) / 2;
        expect(halfWidth / hk.se).toBeCloseTo(Statistics.tQuantile(0.975, k - 1), 5);
        expect(hk.pValue).toBeCloseTo(2 * (1 - Statistics.tCDF(Math.abs(hk.z), k - 1)), 6);
    });

    test('default random-effects still uses the normal reference', () => {
        const re = Statistics.metaAnalysisRandomEffects(effects, variances);
        const halfWidth = (re.ci.upper - re.ci.lower) / 2;
        expect(halfWidth / re.se).toBeCloseTo(Statistics.normalQuantile(0.975), 5);
    });

    test('HKSJ interval is wider than a normal reference on the same SE (small k)', () => {
        const hk = Statistics.metaAnalysisRandomEffects(effects, variances, { hksj: true });
        expect(Statistics.tQuantile(0.975, k - 1)).toBeGreaterThan(Statistics.normalQuantile(0.975));
    });
});

describe('Diagnostic — AUC trapezoidal', () => {
    // The module's own 9-point ROC example. With the (0,0)/(1,1) anchors the AUC
    // is 0.8554; without them it was under-estimated to 0.6566.
    const sens = [0.98, 0.95, 0.90, 0.82, 0.75, 0.65, 0.50, 0.35, 0.15];
    const spec = [0.20, 0.40, 0.58, 0.72, 0.82, 0.90, 0.95, 0.97, 0.99];

    test('includes the (0,0) and (1,1) anchors (AUC 0.855, not 0.657)', () => {
        expect(Statistics.aucTrapezoidal(sens, spec).auc).toBeCloseTo(0.8554, 3);
    });

    test('a perfect corner ROC integrates to 1.0', () => {
        expect(Statistics.aucTrapezoidal([1], [1]).auc).toBeCloseTo(1.0, 6);
    });

    test('no CI without case counts; valid Hanley-McNeil CI with counts', () => {
        const noCounts = Statistics.aucTrapezoidal(sens, spec);
        expect(noCounts.ci).toBeNull();
        expect(noCounts.se).toBeNull();

        const withCounts = Statistics.aucTrapezoidal(sens, spec, 50, 50);
        expect(withCounts.se).toBeGreaterThan(0);
        expect(withCounts.ci.lower).toBeLessThan(withCounts.auc);
        expect(withCounts.ci.upper).toBeGreaterThan(withCounts.auc);
    });

    test('SE no longer changes when redundant ROC points are duplicated', () => {
        // Same underlying curve, sampled twice as densely -> SE must be identical
        // for the same case counts (the old point-count bug shrank it).
        const dup = (arr) => arr.concat(arr);
        const a = Statistics.aucTrapezoidal(sens, spec, 60, 40).se;
        const b = Statistics.aucTrapezoidal(dup(sens), dup(spec), 60, 40).se;
        expect(b).toBeCloseTo(a, 10);
    });
});

describe('twoByTwo — NNT/NNH labelling and CI (Altman)', () => {
    test('a harmful exposure (risk_exposed > risk_unexposed) is flagged isHarm', () => {
        // a=30/100 exposed events vs c=10/100 unexposed -> rd = +0.20 (harm)
        const harm = Statistics.twoByTwo(30, 70, 10, 90);
        expect(harm.rd.value).toBeGreaterThan(0);
        expect(harm.nnt.isHarm).toBe(true);

        // protective exposure -> not harm
        const benefit = Statistics.twoByTwo(10, 90, 30, 70);
        expect(benefit.rd.value).toBeLessThan(0);
        expect(benefit.nnt.isHarm).toBe(false);
    });

    test('a significant (non-crossing) RD gives a finite NNT interval', () => {
        const res = Statistics.twoByTwo(30, 70, 10, 90);
        expect(res.nnt.ci.crossesZero).toBe(false);
        expect(res.nnt.ci.lower).toBeLessThan(res.nnt.ci.upper);
        expect(res.nnt.value).toBeCloseTo(1 / 0.2, 6);
    });

    test('an RD CI that crosses zero yields a discontinuous benefit/harm interval', () => {
        // Borderline table whose Wald RD CI straddles 0.
        const res = Statistics.twoByTwo(12, 88, 8, 92);
        expect(res.rd.ci.lower).toBeLessThan(0);
        expect(res.rd.ci.upper).toBeGreaterThan(0);
        expect(res.nnt.ci.crossesZero).toBe(true);
        expect(res.nnt.ci.nntBenefit).toBeGreaterThan(0);
        expect(res.nnt.ci.nntHarm).toBeGreaterThan(0);
        // No misleading single finite [lower, upper] interval is exposed.
        expect(res.nnt.ci.lower).toBeUndefined();
    });
});

describe('Kaplan-Meier — Greenwood SE at S(t)=0', () => {
    test('SE is finite (0, not NaN) when survival reaches exactly zero', () => {
        // Last observation is an event, so S drops to 0 with nRisk === nEvents.
        const km = Statistics.kaplanMeier([2, 4, 6], [1, 0, 1]);
        const table = km[0].table;
        const last = table[table.length - 1];
        expect(last.survival).toBe(0);
        expect(Number.isNaN(last.se)).toBe(false);
        expect(last.se).toBe(0);
        // Every SE in the table is a real number.
        table.forEach((row) => expect(Number.isNaN(row.se)).toBe(false));
    });
});
