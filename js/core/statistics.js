/**
 * n-epi — Complete Statistical Engine
 * Implements all distribution functions, hypothesis tests, sample size formulas,
 * and epidemiological calculations from scratch.
 *
 * Numerical accuracy: distribution CDFs/quantiles are accurate to ~1e-7 or
 * better in the practical range (normalCDF uses the A&S 26.2.17 approximation,
 * ~7.5e-8 absolute; extreme tails beyond |z|~8 are clamped).
 * References: Abramowitz & Stegun, Fleiss, Whitehead, Schoenfeld, DerSimonian-Laird
 */

const Statistics = (() => {
    'use strict';

    // ============================================================
    // CONSTANTS
    // ============================================================
    const SQRT2 = Math.sqrt(2);
    const SQRT2PI = Math.sqrt(2 * Math.PI);
    const LN2 = Math.log(2);
    const PI = Math.PI;
    const EPS = 1e-14;
    const MAX_ITER = 300;

    // Lanczos coefficients (g=7, n=9)
    const LANCZOS_G = 7;
    const LANCZOS_COEFF = [
        0.99999999999980993,
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7
    ];

    // ============================================================
    // SPECIAL FUNCTIONS
    // ============================================================

    function logGamma(x) {
        if (x < 0.5) {
            return Math.log(PI / Math.sin(PI * x)) - logGamma(1 - x);
        }
        x -= 1;
        let a = LANCZOS_COEFF[0];
        const t = x + LANCZOS_G + 0.5;
        for (let i = 1; i < LANCZOS_COEFF.length; i++) {
            a += LANCZOS_COEFF[i] / (x + i);
        }
        return 0.5 * Math.log(2 * PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
    }

    function gammaFunction(x) {
        if (x < 0.5) {
            return PI / (Math.sin(PI * x) * gammaFunction(1 - x));
        }
        x -= 1;
        let a = LANCZOS_COEFF[0];
        const t = x + LANCZOS_G + 0.5;
        for (let i = 1; i < LANCZOS_COEFF.length; i++) {
            a += LANCZOS_COEFF[i] / (x + i);
        }
        return Math.sqrt(2 * PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
    }

    function betaFunction(a, b) {
        return Math.exp(logGamma(a) + logGamma(b) - logGamma(a + b));
    }

    function logBeta(a, b) {
        return logGamma(a) + logGamma(b) - logGamma(a + b);
    }

    // Lower incomplete gamma via series expansion for small x, continued fraction for large x
    function lowerIncompleteGammaSeries(a, x) {
        if (x === 0) return 0;
        let sum = 1.0 / a;
        let term = 1.0 / a;
        for (let n = 1; n < MAX_ITER; n++) {
            term *= x / (a + n);
            sum += term;
            if (Math.abs(term) < EPS * Math.abs(sum)) break;
        }
        return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
    }

    // Upper incomplete gamma via continued fraction (Lentz's method)
    function upperIncompleteGammaCF(a, x) {
        let f = x + 1 - a;
        if (Math.abs(f) < EPS) f = EPS;
        let C = f;
        let D = 0;
        for (let i = 1; i < MAX_ITER; i++) {
            const an = -i * (i - a);
            const bn = x + 2 * i + 1 - a;
            D = bn + an * D;
            if (Math.abs(D) < EPS) D = EPS;
            C = bn + an / C;
            if (Math.abs(C) < EPS) C = EPS;
            D = 1.0 / D;
            const delta = C * D;
            f *= delta;
            if (Math.abs(delta - 1.0) < EPS) break;
        }
        return Math.exp(-x + a * Math.log(x) - logGamma(a)) / f;
    }

    function regularizedLowerIncompleteGamma(a, x) {
        if (x < 0) return 0;
        if (x === 0) return 0;
        if (x < a + 1) {
            return lowerIncompleteGammaSeries(a, x);
        } else {
            return 1.0 - upperIncompleteGammaCF(a, x);
        }
    }

    // Regularized incomplete beta function using continued fraction (Lentz's method)
    function regularizedIncompleteBeta(x, a, b) {
        if (x < 0 || x > 1) return NaN;
        if (x === 0) return 0;
        if (x === 1) return 1;

        // Use symmetry relation if x > (a+1)/(a+b+2)
        if (x > (a + 1) / (a + b + 2)) {
            return 1.0 - regularizedIncompleteBeta(1 - x, b, a);
        }

        const lbeta = logBeta(a, b);
        const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta) / a;

        // Lentz's continued fraction
        let f = 1.0, C = 1.0, D = 0.0;
        for (let i = 0; i <= MAX_ITER; i++) {
            let m = Math.floor(i / 2);
            let numerator;
            if (i === 0) {
                numerator = 1.0;
            } else if (i % 2 === 0) {
                numerator = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m));
            } else {
                numerator = -((a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1));
            }
            D = 1.0 + numerator * D;
            if (Math.abs(D) < EPS) D = EPS;
            C = 1.0 + numerator / C;
            if (Math.abs(C) < EPS) C = EPS;
            D = 1.0 / D;
            const delta = C * D;
            f *= delta;
            if (Math.abs(delta - 1.0) < EPS) break;
        }
        return front * (f - 1);
    }

    // ============================================================
    // NORMAL DISTRIBUTION
    // ============================================================

    function normalPDF(x, mu = 0, sigma = 1) {
        const z = (x - mu) / sigma;
        return Math.exp(-0.5 * z * z) / (sigma * SQRT2PI);
    }

    // Abramowitz & Stegun 26.2.17 approximation — accuracy ~7.5e-8
    function normalCDF(x, mu = 0, sigma = 1) {
        const z = (x - mu) / sigma;
        if (z < -8) return 0;
        if (z > 8) return 1;

        const t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
        const d = 0.3989422804014327; // 1/sqrt(2*pi)
        const p = d * Math.exp(-z * z / 2.0) *
            (t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.8212560 + t * 1.3302744)))));

        return z > 0 ? 1.0 - p : p;
    }

    // Beasley-Springer-Moro algorithm for normal quantile
    function normalQuantile(p) {
        if (p <= 0) return -Infinity;
        if (p >= 1) return Infinity;
        if (p === 0.5) return 0;

        // Rational approximation for central region
        const a = [
            -3.969683028665376e+01, 2.209460984245205e+02,
            -2.759285104469687e+02, 1.383577518672690e+02,
            -3.066479806614716e+01, 2.506628277459239e+00
        ];
        const b = [
            -5.447609879822406e+01, 1.615858368580409e+02,
            -1.556989798598866e+02, 6.680131188771972e+01,
            -1.328068155288572e+01
        ];
        const c = [
            -7.784894002430293e-03, -3.223964580411365e-01,
            -2.400758277161838e+00, -2.549732539343734e+00,
            4.374664141464968e+00, 2.938163982698783e+00
        ];
        const d = [
            7.784695709041462e-03, 3.224671290700398e-01,
            2.445134137142996e+00, 3.754408661907416e+00
        ];

        const pLow = 0.02425;
        const pHigh = 1 - pLow;
        let q, r;

        if (p < pLow) {
            q = Math.sqrt(-2 * Math.log(p));
            return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
        } else if (p <= pHigh) {
            q = p - 0.5;
            r = q * q;
            return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
                (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
        } else {
            q = Math.sqrt(-2 * Math.log(1 - p));
            return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
        }
    }

    // ============================================================
    // STUDENT'S t DISTRIBUTION
    // ============================================================

    function tCDF(t, df) {
        if (isNaN(t) || isNaN(df)) return NaN;
        if (df <= 0) return NaN;
        if (df === Infinity) return normalCDF(t);
        if (t === Infinity) return 1;
        if (t === -Infinity) return 0;
        const x = df / (df + t * t);
        const prob = 0.5 * regularizedIncompleteBeta(x, df / 2, 0.5);
        return t >= 0 ? 1 - prob : prob;
    }

    function tPDF(t, df) {
        if (isNaN(t) || isNaN(df)) return NaN;
        if (df <= 0) return NaN;
        if (df === Infinity) return normalPDF(t);
        if (Math.abs(t) === Infinity) return 0;
        return Math.exp(logGamma((df + 1) / 2) - logGamma(df / 2)) /
            (Math.sqrt(df * PI) * Math.pow(1 + t * t / df, (df + 1) / 2));
    }

    // Quantile via Newton-Raphson with normal starting point
    function tQuantile(p, df) {
        if (p <= 0) return -Infinity;
        if (p >= 1) return Infinity;
        if (df === Infinity) return normalQuantile(p);

        let x = normalQuantile(p);
        for (let i = 0; i < 50; i++) {
            const fx = tCDF(x, df) - p;
            const fpx = tPDF(x, df);
            if (Math.abs(fpx) < EPS) break;
            const dx = fx / fpx;
            x -= dx;
            if (Math.abs(dx) < EPS * Math.abs(x)) break;
        }
        return x;
    }

    // ============================================================
    // CHI-SQUARED DISTRIBUTION
    // ============================================================

    function chiSquaredCDF(x, df) {
        if (x <= 0) return 0;
        return regularizedLowerIncompleteGamma(df / 2, x / 2);
    }

    function chiSquaredPDF(x, df) {
        if (x <= 0) return 0;
        const k = df / 2;
        return Math.exp((k - 1) * Math.log(x / 2) - x / 2 - logGamma(k)) / 2;
    }

    function chiSquaredQuantile(p, df) {
        if (p <= 0) return 0;
        if (p >= 1) return Infinity;
        // Wilson-Hilferty starting approximation
        let x = df * Math.pow(1 - 2 / (9 * df) + normalQuantile(p) * Math.sqrt(2 / (9 * df)), 3);
        if (x <= 0) x = 0.01;
        for (let i = 0; i < 100; i++) {
            const fx = chiSquaredCDF(x, df) - p;
            const fpx = chiSquaredPDF(x, df);
            if (Math.abs(fpx) < EPS) break;
            const dx = fx / fpx;
            x -= dx;
            if (x <= 0) x = EPS;
            if (Math.abs(dx) < EPS * x) break;
        }
        return x;
    }

    // ============================================================
    // F DISTRIBUTION
    // ============================================================

    function fCDF(x, df1, df2) {
        if (x <= 0) return 0;
        const v = df1 * x / (df1 * x + df2);
        return regularizedIncompleteBeta(v, df1 / 2, df2 / 2);
    }

    function fQuantile(p, df1, df2) {
        if (p <= 0) return 0;
        if (p >= 1) return Infinity;
        // Use bisection with refinement
        let lo = 0, hi = 100;
        while (fCDF(hi, df1, df2) < p) hi *= 2;
        for (let i = 0; i < 100; i++) {
            const mid = (lo + hi) / 2;
            if (fCDF(mid, df1, df2) < p) lo = mid;
            else hi = mid;
            if (hi - lo < EPS) break;
        }
        return (lo + hi) / 2;
    }

    // ============================================================
    // BINOMIAL DISTRIBUTION
    // ============================================================

    function logChoose(n, k) {
        if (k < 0 || k > n) return -Infinity;
        if (k === 0 || k === n) return 0;
        return logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);
    }

    function binomialPMF(k, n, p) {
        if (k < 0 || k > n) return 0;
        // Degenerate p: k*log(0) = 0*(-Inf) = NaN, so handle explicitly.
        if (p <= 0) return k === 0 ? 1 : 0;
        if (p >= 1) return k === n ? 1 : 0;
        return Math.exp(logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
    }

    function binomialCDF(k, n, p) {
        let sum = 0;
        for (let i = 0; i <= Math.floor(k); i++) {
            sum += binomialPMF(i, n, p);
        }
        return Math.min(1, sum);
    }

    // ============================================================
    // POISSON DISTRIBUTION
    // ============================================================

    function poissonPMF(k, lambda) {
        if (k < 0) return 0;
        return Math.exp(k * Math.log(lambda) - lambda - logGamma(k + 1));
    }

    function poissonCDF(k, lambda) {
        if (k < 0) return 0;
        return 1 - regularizedLowerIncompleteGamma(Math.floor(k) + 1, lambda);
    }

    function poissonQuantile(p, lambda) {
        if (p <= 0) return 0;
        if (p >= 1) return Infinity;
        let k = Math.max(0, Math.floor(lambda + normalQuantile(p) * Math.sqrt(lambda) - 0.5));
        while (poissonCDF(k, lambda) < p) k++;
        while (k > 0 && poissonCDF(k - 1, lambda) >= p) k--;
        return k;
    }

    // ============================================================
    // HYPERGEOMETRIC DISTRIBUTION
    // ============================================================

    function hypergeometricPMF(k, N, K, n) {
        if (k < Math.max(0, n + K - N) || k > Math.min(n, K)) return 0;
        return Math.exp(
            logChoose(K, k) + logChoose(N - K, n - k) - logChoose(N, n)
        );
    }

    // ============================================================
    // CONFIDENCE INTERVALS FOR PROPORTIONS
    // ============================================================

    function waldCI(p, n, z) {
        z = z || normalQuantile(0.975);
        const se = Math.sqrt(p * (1 - p) / n);
        return { lower: Math.max(0, p - z * se), upper: Math.min(1, p + z * se), se };
    }

    function wilsonCI(p, n, z) {
        z = z || normalQuantile(0.975);
        const denom = 1 + z * z / n;
        const center = (p + z * z / (2 * n)) / denom;
        const margin = (z / denom) * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n));
        return { lower: Math.max(0, center - margin), upper: Math.min(1, center + margin) };
    }

    function clopperPearsonCI(x, n, alpha) {
        alpha = alpha || 0.05;
        let lower, upper;
        if (x === 0) {
            lower = 0;
        } else {
            lower = 1 / (1 + (n - x + 1) / (x * fQuantile(alpha / 2, 2 * x, 2 * (n - x + 1))));
        }
        if (x === n) {
            upper = 1;
        } else {
            upper = 1 / (1 + (n - x) / ((x + 1) * fQuantile(1 - alpha / 2, 2 * (x + 1), 2 * (n - x))));
        }
        return { lower, upper };
    }

    function agrestiCoullCI(p, n, z) {
        z = z || normalQuantile(0.975);
        const nTilde = n + z * z;
        const pTilde = (p * n + z * z / 2) / nTilde;
        const se = Math.sqrt(pTilde * (1 - pTilde) / nTilde);
        return { lower: Math.max(0, pTilde - z * se), upper: Math.min(1, pTilde + z * se) };
    }

    // Newcombe CI for difference of proportions (Method 10)
    function newcombeCI(p1, n1, p2, n2, z) {
        z = z || normalQuantile(0.975);
        const w1 = wilsonCI(p1, n1, z);
        const w2 = wilsonCI(p2, n2, z);
        const diff = p1 - p2;
        const lower = diff - Math.sqrt(Math.pow(p1 - w1.lower, 2) + Math.pow(p2 - w2.upper, 2));
        const upper = diff + Math.sqrt(Math.pow(p1 - w1.upper, 2) + Math.pow(p2 - w2.lower, 2));
        return { diff, lower, upper };
    }

    // Poisson exact CI
    function poissonExactCI(k, alpha) {
        alpha = alpha || 0.05;
        let lower, upper;
        if (k === 0) {
            lower = 0;
        } else {
            lower = chiSquaredQuantile(alpha / 2, 2 * k) / 2;
        }
        upper = chiSquaredQuantile(1 - alpha / 2, 2 * (k + 1)) / 2;
        return { lower, upper };
    }

    // Log-rate CI for incidence rates
    function logRateCI(events, personTime, alpha) {
        alpha = alpha || 0.05;
        const z = normalQuantile(1 - alpha / 2);
        const rate = events / personTime;
        const se = Math.sqrt(events) / personTime;
        const logRate = Math.log(rate);
        const logSE = 1 / Math.sqrt(events);
        return {
            rate,
            se,
            lower: Math.exp(logRate - z * logSE),
            upper: Math.exp(logRate + z * logSE)
        };
    }

    // ============================================================
    // HYPOTHESIS TESTS
    // ============================================================

    // Z-test for two proportions
    function twoProportionZTest(x1, n1, x2, n2, options = {}) {
        const { pooled = true, continuityCorrection = false } = options;
        const p1 = x1 / n1;
        const p2 = x2 / n2;
        const diff = p1 - p2;
        let se, z;

        if (pooled) {
            const pPool = (x1 + x2) / (n1 + n2);
            se = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2));
        } else {
            se = Math.sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2);
        }

        let correction = 0;
        if (continuityCorrection) {
            correction = 0.5 * (1 / n1 + 1 / n2);
        }

        if (se === 0) {
            // Degenerate table (e.g. 0 events in both groups): the asymptotic
            // z-test is undefined (0/0 or +/-Infinity). Report z = 0, p = 1
            // rather than a spurious "significant" result.
            return {
                p1, p2, diff, se, z: 0, pValue: 1,
                note: 'Standard error is zero; asymptotic z-test not applicable. Use Fisher\'s exact test.'
            };
        }

        // Floor the corrected difference at zero: when the continuity
        // correction is at least |diff|, the corrected statistic is z = 0
        // (p = 1) — a negative value must NOT be treated as evidence.
        // (Clamp at 1: the polynomial CDF approximation is ~1e-8 off at z = 0.)
        z = Math.max(0, Math.abs(diff) - correction) / se;
        const pValue = Math.min(1, 2 * (1 - normalCDF(Math.abs(z))));

        return { p1, p2, diff, se, z, pValue };
    }

    // Chi-squared test for 2x2
    function chiSquaredTest2x2(a, b, c, d, yates = false) {
        const n = a + b + c + d;
        let num = n * Math.pow(a * d - b * c, 2);
        if (yates) {
            num = n * Math.pow(Math.max(0, Math.abs(a * d - b * c) - n / 2), 2);
        }
        const denom = (a + b) * (c + d) * (a + c) * (b + d);
        const chi2 = num / denom;
        const pValue = 1 - chiSquaredCDF(chi2, 1);
        return { chi2, df: 1, pValue };
    }

    // Fisher's exact test (two-sided)
    function fisherExact(a, b, c, d) {
        const n = a + b + c + d;
        const r1 = a + b, r2 = c + d, c1 = a + c, c2 = b + d;
        const pObs = hypergeometricPMF(a, n, r1, c1);
        let pValue = 0;
        const minA = Math.max(0, c1 - r2);
        const maxA = Math.min(r1, c1);
        for (let i = minA; i <= maxA; i++) {
            const pi = hypergeometricPMF(i, n, r1, c1);
            if (pi <= pObs + EPS) {
                pValue += pi;
            }
        }
        return { pValue: Math.min(1, pValue), pObs };
    }

    // McNemar's test
    function mcNemarTest(b, c, exact = false) {
        if (exact) {
            const n = b + c;
            let pValue = 0;
            for (let i = 0; i <= Math.min(b, c); i++) {
                pValue += binomialPMF(i, n, 0.5);
            }
            pValue *= 2;
            return { statistic: null, pValue: Math.min(1, pValue), method: 'exact' };
        }
        if (b + c === 0) {
            // No discordant pairs: statistic is 0/0; there is no evidence of
            // asymmetry, so report chi2 = 0, p = 1 instead of NaN.
            return { chi2: 0, df: 1, pValue: 1, method: 'asymptotic', note: 'No discordant pairs' };
        }
        const chi2 = Math.pow(b - c, 2) / (b + c);
        const pValue = 1 - chiSquaredCDF(chi2, 1);
        return { chi2, df: 1, pValue, method: 'asymptotic' };
    }

    // Cochran-Armitage trend test
    function cochranArmitageTrend(counts, totals, scores) {
        // counts[i] = number of events in group i, totals[i] = n in group i
        // scores[i] = dose/trend score for group i (default: 0, 1, 2, ...)
        const k = counts.length;
        if (!scores) scores = Array.from({ length: k }, (_, i) => i);
        const N = totals.reduce((a, b) => a + b, 0);
        const X = counts.reduce((a, b) => a + b, 0);
        const pBar = X / N;

        let sumNS = 0, sumNS2 = 0, T = 0;
        const sBar = totals.reduce((sum, ni, i) => sum + ni * scores[i], 0) / N;

        for (let i = 0; i < k; i++) {
            T += counts[i] * (scores[i] - sBar);
            sumNS += totals[i] * scores[i];
            sumNS2 += totals[i] * scores[i] * scores[i];
        }

        const varT = pBar * (1 - pBar) * (sumNS2 - sumNS * sumNS / N);
        const z = T / Math.sqrt(varT);
        const pValue = 2 * (1 - normalCDF(Math.abs(z)));

        return { z, pValue, T, varT };
    }

    // Mantel-Haenszel for stratified 2x2 tables
    function mantelHaenszel(tables, measure = 'OR') {
        // tables = [{a, b, c, d}, ...]
        const k = tables.length;
        const estimates = [];

        // The MH estimator itself tolerates zero cells (that is its virtue),
        // so the pooled estimate is computed on the raw counts. A global
        // Haldane-Anscombe 0.5 correction is applied ONLY when the MH sums
        // themselves are degenerate (numerator or denominator sum is 0, which
        // requires a zero cell in EVERY stratum) — otherwise the estimate or
        // the variance would be 0/Infinity/NaN.
        const correctAll = (ts) => ts.map(t => ({ a: t.a + 0.5, b: t.b + 0.5, c: t.c + 0.5, d: t.d + 0.5 }));

        if (measure === 'OR') {
            let continuityCorrected = false;
            let work = tables;
            if (tables.every(t => t.b === 0 || t.c === 0) ||
                tables.every(t => t.a === 0 || t.d === 0)) {
                work = correctAll(tables);
                continuityCorrected = true;
            }

            let sumR = 0, sumS = 0;
            const correctedStrata = [];

            work.forEach(t => {
                const n = t.a + t.b + t.c + t.d;
                sumR += t.a * t.d / n;
                sumS += t.b * t.c / n;
            });

            // Stratum-specific ORs (display only): Haldane-Anscombe 0.5 for
            // any stratum where a zero cell would give 0/Infinity/NaN.
            tables.forEach((t, i) => {
                if (t.a === 0 || t.b === 0 || t.c === 0 || t.d === 0) {
                    estimates.push(((t.a + 0.5) * (t.d + 0.5)) / ((t.b + 0.5) * (t.c + 0.5)));
                    correctedStrata.push(i);
                } else {
                    estimates.push((t.a * t.d) / (t.b * t.c));
                }
            });

            const orMH = sumR / sumS;

            // Robins-Breslow-Greenland variance
            let P_R = 0, P_S = 0, Q_plus = 0;
            work.forEach(t => {
                const n = t.a + t.b + t.c + t.d;
                const R = t.a * t.d / n;
                const S = t.b * t.c / n;
                const P = (t.a + t.d) / n;
                const QQ = (t.b + t.c) / n;
                P_R += P * R;
                P_S += QQ * S;
                Q_plus += P * S + QQ * R;
            });

            const varLnOR = P_R / (2 * sumR * sumR) + Q_plus / (2 * sumR * sumS) + P_S / (2 * sumS * sumS);
            const seLnOR = Math.sqrt(varLnOR);
            const z = normalQuantile(0.975);
            const lnOR = Math.log(orMH);

            // Breslow-Day test for homogeneity of the odds ratio.
            // For each stratum the expected cell "a" under the common OR (psi=orMH)
            // is the admissible root of the quadratic
            //   (psi-1) a^2 - [psi(r1+c1) + (n-r1-c1)] a + psi*r1*c1 = 0
            // (Breslow & Day 1980). Then Var(a) = (1/a + 1/b + 1/c + 1/d)^-1 on the
            // expected cells, and BD = sum (a_obs - a_exp)^2 / Var(a).
            let bd = 0, bdStrata = 0;
            work.forEach((t) => {
                const n = t.a + t.b + t.c + t.d;
                const r1 = t.a + t.b;   // row-1 (exposed) total
                const c1 = t.a + t.c;   // col-1 (case) total
                const psi = orMH;
                let aExp;
                if (Math.abs(psi - 1) < 1e-9) {
                    aExp = r1 * c1 / n; // independence
                } else {
                    const A = psi - 1;
                    const B = -(psi * (r1 + c1) + (n - r1 - c1));
                    const C = psi * r1 * c1;
                    const disc = Math.sqrt(Math.max(0, B * B - 4 * A * C));
                    const root1 = (-B + disc) / (2 * A);
                    const root2 = (-B - disc) / (2 * A);
                    const lo = Math.max(0, r1 + c1 - n);
                    const hi = Math.min(r1, c1);
                    const inRange = (x) => x >= lo - 1e-7 && x <= hi + 1e-7;
                    if (inRange(root1) && (!inRange(root2) ||
                        Math.abs(root1 - t.a) <= Math.abs(root2 - t.a))) {
                        aExp = root1;
                    } else {
                        aExp = root2;
                    }
                }
                const bExp = r1 - aExp;
                const cExp = c1 - aExp;
                const dExp = n - r1 - cExp;
                if (aExp <= 0 || bExp <= 0 || cExp <= 0 || dExp <= 0) return;
                const varA = 1 / (1 / aExp + 1 / bExp + 1 / cExp + 1 / dExp);
                bd += Math.pow(t.a - aExp, 2) / varA;
                bdStrata++;
            });
            // df = (strata actually contributing to the statistic) - 1;
            // strata skipped for non-positive expected cells carry no
            // information about OR homogeneity.
            const bdDf = Math.max(0, bdStrata - 1);
            const bdPValue = bdDf > 0 ? 1 - chiSquaredCDF(bd, bdDf) : NaN;

            return {
                measure: 'OR',
                estimate: orMH,
                lnEstimate: lnOR,
                se: seLnOR,
                ci: { lower: Math.exp(lnOR - z * seLnOR), upper: Math.exp(lnOR + z * seLnOR) },
                breslowDay: { statistic: bd, df: bdDf, pValue: bdPValue, strataIncluded: bdStrata },
                stratumEstimates: estimates,
                continuityCorrected,
                correctedStrata
            };
        }

        if (measure === 'RR') {
            let continuityCorrected = false;
            let work = tables;
            if (tables.every(t => t.a === 0) || tables.every(t => t.c === 0)) {
                // MH RR numerator/denominator sum would be 0 — apply the
                // Haldane-Anscombe 0.5 correction to all cells.
                work = correctAll(tables);
                continuityCorrected = true;
            }

            let sumA = 0, sumB = 0;
            work.forEach(t => {
                const n = t.a + t.b + t.c + t.d;
                sumA += t.a * (t.c + t.d) / n;
                sumB += t.c * (t.a + t.b) / n;
            });
            const rrMH = sumA / sumB;

            // Greenland-Robins variance of ln(RR_MH):
            //   var = sum[ (r1*r2*(a+c) - a*c*n) / n^2 ] / (sumA * sumB)
            let P = 0;
            work.forEach(t => {
                const n = t.a + t.b + t.c + t.d;
                P += ((t.a + t.b) * (t.c + t.d) * (t.a + t.c) - t.a * t.c * n) / (n * n);
            });
            const seLnRR = Math.sqrt(P / (sumA * sumB));
            const z = normalQuantile(0.975);
            const lnRR = Math.log(rrMH);

            return {
                measure: 'RR',
                estimate: rrMH,
                lnEstimate: lnRR,
                se: seLnRR,
                ci: { lower: Math.exp(lnRR - z * seLnRR), upper: Math.exp(lnRR + z * seLnRR) },
                continuityCorrected
            };
        }

        if (measure === 'RD') {
            // Greenland-Robins (1985) Mantel-Haenszel risk difference:
            //   RD_MH = sum[(a*n0 - c*n1)/n] / sum[n1*n0/n]
            //   Var(RD_MH) = sum[(a*b*n0^3 + c*d*n1^3)/(n1*n0*n^2)] / (sum[n1*n0/n])^2
            // where n1 = a+b (exposed total), n0 = c+d (unexposed total).
            // Zero cells are unproblematic for RD; strata with an empty arm
            // (n1 = 0 or n0 = 0) carry no information and are skipped.
            let num = 0, den = 0, varNum = 0;
            tables.forEach(t => {
                const n1 = t.a + t.b, n0 = t.c + t.d;
                if (n1 === 0 || n0 === 0) return;
                const n = n1 + n0;
                num += (t.a * n0 - t.c * n1) / n;
                den += n1 * n0 / n;
                varNum += (t.a * t.b * Math.pow(n0, 3) + t.c * t.d * Math.pow(n1, 3)) / (n1 * n0 * n * n);
            });
            const rdMH = num / den;
            const seRD = Math.sqrt(varNum) / den;
            const z = normalQuantile(0.975);

            return {
                measure: 'RD',
                estimate: rdMH,
                se: seRD,
                ci: { lower: rdMH - z * seRD, upper: rdMH + z * seRD }
            };
        }

        return null;
    }

    // ============================================================
    // SAMPLE SIZE FORMULAS
    // ============================================================

    // Two proportions — normal approximation
    function sampleSizeTwoProportions(p1, p2, alpha, power, ratio, method) {
        alpha = alpha || 0.05;
        power = power || 0.80;
        ratio = ratio || 1;
        method = method || 'normal';

        const za = normalQuantile(1 - alpha / 2);
        const zb = normalQuantile(power);
        const diff = Math.abs(p1 - p2);

        if (method === 'normal') {
            const pBar = (p1 + ratio * p2) / (1 + ratio);
            const n1 = Math.pow(za * Math.sqrt((1 + 1 / ratio) * pBar * (1 - pBar)) +
                zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2) / ratio), 2) / (diff * diff);
            return { n1: Math.ceil(n1), n2: Math.ceil(n1 * ratio), total: Math.ceil(n1) + Math.ceil(n1 * ratio) };
        }

        if (method === 'fleiss') {
            // Fleiss continuity correction
            const pBar = (p1 + ratio * p2) / (1 + ratio);
            const n1_uncorrected = Math.pow(za * Math.sqrt((1 + 1 / ratio) * pBar * (1 - pBar)) +
                zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2) / ratio), 2) / (diff * diff);

            // Apply correction
            const n1 = (n1_uncorrected / 4) * Math.pow(1 + Math.sqrt(1 + 2 * (1 + 1/ratio) / (n1_uncorrected * diff)), 2);
            return { n1: Math.ceil(n1), n2: Math.ceil(n1 * ratio), total: Math.ceil(n1) + Math.ceil(n1 * ratio) };
        }

        if (method === 'arcsine') {
            const h = 2 * Math.asin(Math.sqrt(p1)) - 2 * Math.asin(Math.sqrt(p2));
            const n1 = Math.pow((za + zb) / h, 2);
            return { n1: Math.ceil(n1), n2: Math.ceil(n1 * ratio), total: Math.ceil(n1) + Math.ceil(n1 * ratio) };
        }

        return null;
    }

    // Two means
    function sampleSizeTwoMeans(delta, sd1, sd2, alpha, power, ratio) {
        alpha = alpha || 0.05;
        power = power || 0.80;
        ratio = ratio || 1;
        sd2 = sd2 || sd1;

        const za = normalQuantile(1 - alpha / 2);
        const zb = normalQuantile(power);

        const n1 = Math.pow(za + zb, 2) * (sd1 * sd1 + sd2 * sd2 / ratio) / (delta * delta);
        return { n1: Math.ceil(n1), n2: Math.ceil(n1 * ratio), total: Math.ceil(n1) + Math.ceil(n1 * ratio) };
    }

    // Survival — Schoenfeld
    function sampleSizeSchoenfeld(hr, alpha, power, ratio, pEvent) {
        alpha = alpha || 0.05;
        power = power || 0.80;
        ratio = ratio || 1;

        const za = normalQuantile(1 - alpha / 2);
        const zb = normalQuantile(power);
        const lnHR = Math.log(hr);

        const events = Math.pow(za + zb, 2) / (lnHR * lnHR * ratio / Math.pow(1 + ratio, 2));
        const totalEvents = Math.ceil(events);

        let totalN = null;
        if (pEvent) {
            totalN = Math.ceil(totalEvents / pEvent);
        }

        return { events: totalEvents, totalN, hr, lnHR };
    }

    // Survival — Freedman
    // Total number of events = (z_a + z_b)^2 * (1 + ratio*HR)^2 / (ratio * (1 - HR)^2),
    // where ratio is the allocation ratio (n2/n1). Reduces to
    // ((HR+1)/(HR-1))^2 * (z_a + z_b)^2 for 1:1 allocation.
    function sampleSizeFreedman(hr, alpha, power, ratio) {
        alpha = alpha || 0.05;
        power = power || 0.80;
        ratio = ratio || 1;

        const za = normalQuantile(1 - alpha / 2);
        const zb = normalQuantile(power);

        const events = Math.pow(za + zb, 2) * Math.pow(1 + ratio * hr, 2) /
            (ratio * Math.pow(1 - hr, 2));
        return { events: Math.ceil(events) };
    }

    // Non-inferiority — proportions
    function sampleSizeNonInferiority(p1, p2, margin, alpha, power, ratio) {
        alpha = alpha || 0.025; // one-sided
        power = power || 0.80;
        ratio = ratio || 1;

        const za = normalQuantile(1 - alpha);
        const zb = normalQuantile(power);
        const delta = p1 - p2 + margin;

        const n1 = Math.pow(za + zb, 2) * (p1 * (1 - p1) + p2 * (1 - p2) / ratio) / (delta * delta);
        return { n1: Math.ceil(n1), n2: Math.ceil(n1 * ratio), total: Math.ceil(n1) + Math.ceil(n1 * ratio) };
    }

    // Equivalence — proportions (two one-sided tests).
    // At a true difference of zero the design can be rejected in either
    // direction, so the power term uses z_{1-beta/2}, not z_{1-beta}
    // (Chow, Shao & Wang; Julious 2004). Using z_{1-beta} under-powers the study.
    function sampleSizeEquivalence(p1, margin, alpha, power) {
        alpha = alpha || 0.025;
        power = power || 0.80;

        const za = normalQuantile(1 - alpha);
        const zb = normalQuantile(1 - (1 - power) / 2);
        const n = Math.pow(za + zb, 2) * 2 * p1 * (1 - p1) / (margin * margin);
        return { n1: Math.ceil(n), n2: Math.ceil(n), total: 2 * Math.ceil(n) };
    }

    // Cluster-randomized
    function sampleSizeCluster(nIndividual, icc, clusterSize) {
        const deff = 1 + (clusterSize - 1) * icc;
        const nAdjusted = Math.ceil(nIndividual * deff);
        const nClusters = Math.ceil(nAdjusted / clusterSize);
        return { deff, nAdjusted, nClusters, totalN: nClusters * clusterSize };
    }

    // Small dense matrix inverse (Gauss-Jordan with partial pivoting).
    function matInverse(M) {
        const N = M.length;
        const A = M.map((row, i) => [...row, ...row.map((_, j) => (i === j ? 1 : 0))]);
        for (let i = 0; i < N; i++) {
            let piv = i;
            for (let r = i + 1; r < N; r++) {
                if (Math.abs(A[r][i]) > Math.abs(A[piv][i])) piv = r;
            }
            const tmp = A[i]; A[i] = A[piv]; A[piv] = tmp;
            const d = A[i][i];
            for (let j = 0; j < 2 * N; j++) A[i][j] /= d;
            for (let r = 0; r < N; r++) {
                if (r === i) continue;
                const f2 = A[r][i];
                if (f2 === 0) continue;
                for (let j = 0; j < 2 * N; j++) A[r][j] -= f2 * A[i][j];
            }
        }
        return A.map(row => row.slice(N));
    }

    // Hussey & Hughes (2007) GLS variance of the treatment effect for a
    // cross-sectional cluster design with T periods, fixed period effects and
    // a random cluster intercept. treatRows holds one 0/1 treatment vector of
    // length T per cluster. Cluster-period MEANS are modelled with residual
    // variance sigmaW2/n and between-cluster variance tau2 (exchangeable).
    function hhVarianceTheta(treatRows, T, nPerClusterPeriod, tau2, sigmaW2) {
        const a = sigmaW2 / nPerClusterPeriod;
        // V^{-1} = (1/a) I - cJ * J  for  V = a I + tau2 J  (T x T)
        const cJ = tau2 / (a * (a + T * tau2));
        const p = T + 1; // T period effects + treatment effect
        const info = [];
        for (let i = 0; i < p; i++) info.push(new Array(p).fill(0));
        treatRows.forEach(x => {
            let sx = 0;
            for (let j = 0; j < T; j++) sx += x[j];
            for (let j = 0; j < T; j++) {
                for (let l = 0; l < T; l++) {
                    info[j][l] += (j === l ? 1 / a : 0) - cJ;
                }
                const cross = x[j] / a - cJ * sx;
                info[j][T] += cross;
                info[T][j] += cross;
            }
            // x entries are 0/1 so sum(x^2) = sx
            info[T][T] += sx / a - cJ * sx * sx;
        });
        return matInverse(info)[T][T];
    }

    // Stepped-wedge (cross-sectional, Hussey & Hughes 2007 — exact GLS).
    // Given the total N required by a comparator parallel cluster-randomized
    // design (nParallel), returns the total N a stepped-wedge design with
    // `steps` steps and `clustersPerStep` clusters per step needs for the
    // same precision. Design: T = steps + 1 periods, clusters split evenly
    // across steps, each group crossing to intervention one step at a time;
    // the comparator is a parallel design with the same clusters/periods,
    // half intervention and half control. The treatment-effect variance in
    // both designs is the exact GLS variance under the Hussey-Hughes model
    // (fixed period effects, random cluster intercepts, ICC = icc).
    // NOTE: a stepped wedge needs MORE subjects than a parallel design at low
    // ICC (treatment is partially confounded with time) and fewer at high ICC
    // — correctionFactor is the realized ratio totalN / nParallel.
    function sampleSizeSteppedWedge(nParallel, steps, clustersPerStep, icc) {
        const k = steps;
        const m = clustersPerStep;
        const totalClusters = k * m;
        const T = k + 1;
        if (!(k >= 2) || !(m >= 1) || !(nParallel > 0)) return null;

        const iccC = Math.min(Math.max(icc || 0, 0), 0.999);
        const tau2 = iccC;          // total individual variance normalized to 1
        const sigmaW2 = 1 - iccC;   // (scale cancels in the N ratio)

        // Precision achieved by the comparator parallel cluster design.
        const parRows = [];
        for (let i = 0; i < totalClusters; i++) {
            parRows.push(new Array(T).fill(i < totalClusters / 2 ? 1 : 0));
        }
        const nParPerCP = nParallel / (totalClusters * T);
        const vTarget = hhVarianceTheta(parRows, T, nParPerCP, tau2, sigmaW2);

        // Stepped-wedge design matrix.
        const swRows = [];
        for (let s = 0; s < k; s++) {
            for (let j = 0; j < m; j++) {
                const x = new Array(T).fill(0);
                for (let t = s + 1; t < T; t++) x[t] = 1;
                swRows.push(x);
            }
        }

        // Solve for the SW cluster-period size that attains the same
        // precision. Var(theta) is monotone decreasing in n and tends to 0
        // as n -> Infinity under this model (the random intercept cancels in
        // within-cluster contrasts), so a solution always exists.
        let hi = 1;
        while (hhVarianceTheta(swRows, T, hi, tau2, sigmaW2) > vTarget && hi < 1e12) hi *= 2;
        let lo = hi / 2;
        if (hhVarianceTheta(swRows, T, lo, tau2, sigmaW2) <= vTarget) lo = 1e-9;
        for (let i = 0; i < 60; i++) {
            const mid = Math.sqrt(lo * hi);
            if (hhVarianceTheta(swRows, T, mid, tau2, sigmaW2) > vTarget) lo = mid;
            else hi = mid;
        }
        const nSWPerCP = hi;
        const totalN = Math.ceil(totalClusters * T * nSWPerCP);
        const correctionFactor = totalN / nParallel;

        return {
            totalClusters,
            steps: k,
            clustersPerStep: m,
            periods: T,
            correctionFactor,
            nPerClusterPeriod: Math.ceil(nSWPerCP),
            nPerCluster: Math.ceil(totalN / totalClusters),
            totalN,
            method: 'Hussey-Hughes GLS (cross-sectional)'
        };
    }

    // Ordinal shift (mRS) — Whitehead formula for proportional odds
    function sampleSizeOrdinalShift(controlDist, treatDist, commonOR, alpha, power) {
        alpha = alpha || 0.05;
        power = power || 0.80;

        // Whitehead method for ordinal data under proportional odds
        // N = 6 * (z_alpha/2 + z_beta)^2 / (log(OR)^2 * (1 - sum(pBar_i^3)))
        // where pBar_i is the MEAN of the two arms' category probabilities.
        const za = normalQuantile(1 - alpha / 2);
        const zb = normalQuantile(power);

        // Derive the treatment distribution from the control distribution under
        // proportional odds (odds_treat(Y<=k) = OR * odds_control(Y<=k)) unless a
        // treatment distribution is supplied directly.
        let tDist;
        if (treatDist && treatDist.length === controlDist.length) {
            tDist = treatDist;
        } else {
            tDist = [];
            let cum = 0, prevT = 0;
            for (let i = 0; i < controlDist.length; i++) {
                cum += controlDist[i];
                let T;
                if (i === controlDist.length - 1) {
                    T = 1;
                } else {
                    const oddsC = cum / (1 - cum);
                    const oddsT = commonOR * oddsC;
                    T = oddsT / (1 + oddsT);
                }
                tDist.push(T - prevT);
                prevT = T;
            }
        }

        // Non-centrality factor from the average category proportions.
        let sumPiCubed = 0;
        for (let i = 0; i < controlDist.length; i++) {
            const pBar = (controlDist[i] + tDist[i]) / 2;
            sumPiCubed += Math.pow(pBar, 3);
        }

        const lnOR = Math.log(commonOR);
        const N = 6 * Math.pow(za + zb, 2) / (lnOR * lnOR * (1 - sumPiCubed));

        return {
            nPerGroup: Math.ceil(N / 2),
            total: 2 * Math.ceil(N / 2),
            commonOR,
            lnOR,
            controlDist,
            treatDist: tDist
        };
    }

    // Multi-arm with Bonferroni / approximate-Dunnett correction.
    // N scales with (z_alpha/2 + z_beta)^2; only the significance level changes
    // with the multiplicity adjustment, so the two-arm N is rescaled by
    // (z_adj + z_beta)^2 / (z_0.975 + z_beta)^2 (power is required — scaling the
    // whole N by the alpha-ratio alone over-inflates the z_beta component).
    function sampleSizeMultiArm(nPerGroup_2arm, nArms, correction, power) {
        correction = correction || 'bonferroni';
        power = power || 0.80;
        let adjustedAlpha;
        if (correction === 'bonferroni') {
            adjustedAlpha = 0.05 / (nArms - 1);
        } else if (correction === 'dunnett') {
            // Approximate Dunnett — slightly less conservative than Bonferroni
            adjustedAlpha = 1 - Math.pow(1 - 0.05, 1 / (nArms - 1));
        } else {
            adjustedAlpha = 0.05;
        }

        const zb = normalQuantile(power);
        const zaAdj = normalQuantile(1 - adjustedAlpha / 2);
        const zaOrig = normalQuantile(0.975);
        const factor = Math.pow(zaAdj + zb, 2) / Math.pow(zaOrig + zb, 2);
        const adjustedN = Math.ceil(nPerGroup_2arm * factor);

        return {
            nPerArm: adjustedN,
            totalN: adjustedN * nArms,
            adjustedAlpha,
            correction,
            power
        };
    }

    // ------------------------------------------------------------
    // Group-sequential machinery: exact boundary-crossing probabilities by
    // recursive numerical integration over the joint distribution of the
    // sequential Z statistics (Armitage-McPherson-Rowe recursion).
    // ------------------------------------------------------------

    // P(|Z_k| >= zBounds[k] at ANY look k), for Z statistics observed at
    // information fractions `fractions` (increasing, last = 1), under drift
    // theta = E[Z at full information] (theta = 0 gives the type I error).
    function seqCrossingProb(zBounds, fractions, drift, gridStep) {
        const h = gridStep || 0.01;
        const K = zBounds.length;
        // Work on the Brownian-motion scale S_k = Z_k * sqrt(t_k).
        const B = zBounds.map((b, i) => b * Math.sqrt(fractions[i]));
        const pdf = (x) => Math.exp(-0.5 * x * x) / SQRT2PI;
        const makeGrid = (bound) => {
            const g = [];
            for (let x = -bound + h / 2; x < bound; x += h) g.push(x);
            return g;
        };
        let grid = makeGrid(B[0]);
        const sd0 = Math.sqrt(fractions[0]);
        let f = grid.map(s => pdf((s - drift * fractions[0]) / sd0) / sd0);
        for (let i = 1; i < K; i++) {
            const dt = fractions[i] - fractions[i - 1];
            const sd = Math.sqrt(dt);
            const next = makeGrid(B[i]);
            const nf = next.map(y => {
                let s = 0;
                for (let j = 0; j < grid.length; j++) {
                    s += f[j] * pdf((y - grid[j] - drift * dt) / sd);
                }
                return s * h / sd;
            });
            grid = next;
            f = nf;
        }
        let surviving = 0;
        for (let j = 0; j < f.length; j++) surviving += f[j];
        return 1 - surviving * h;
    }

    // Boundary constant for the classical shapes, solved so that the overall
    // two-sided type I error equals alpha exactly:
    //   Pocock: z_k = c;   O'Brien-Fleming: z_k = c / sqrt(t_k).
    // Reproduces the Jennison & Turnbull constants (equally spaced looks),
    // e.g. K = 5, alpha = 0.05: Pocock c = 2.413, OBF final boundary 2.040.
    const seqConstCache = {};
    function seqBoundaryConstant(nLooks, alpha, type) {
        const key = type + ':' + nLooks + ':' + alpha;
        if (seqConstCache[key] !== undefined) return seqConstCache[key];
        const ts = Array.from({ length: nLooks }, (_, i) => (i + 1) / nLooks);
        const shape = (c) => ts.map(t => (type === 'pocock' ? c : c / Math.sqrt(t)));
        let lo = 1.0, hi = 6.0;
        for (let i = 0; i < 40; i++) {
            const mid = (lo + hi) / 2;
            if (seqCrossingProb(shape(mid), ts, 0, 0.02) > alpha) lo = mid;
            else hi = mid;
        }
        // One refinement pass on a finer grid around the coarse solution.
        let lo2 = (lo + hi) / 2 - 0.02, hi2 = (lo + hi) / 2 + 0.02;
        for (let i = 0; i < 20; i++) {
            const mid = (lo2 + hi2) / 2;
            if (seqCrossingProb(shape(mid), ts, 0, 0.008) > alpha) lo2 = mid;
            else hi2 = mid;
        }
        const c = (lo2 + hi2) / 2;
        seqConstCache[key] = c;
        return c;
    }

    // Group sequential — O'Brien-Fleming and Pocock boundaries, calibrated
    // against the joint distribution so the overall two-sided type I error
    // equals alpha (the previous version used the cumulative spending value
    // as a per-look nominal level, i.e. OBF boundaries z_{alpha/2}/sqrt(t)
    // with an overall alpha of 0.052-0.061, and Bonferroni instead of true
    // Pocock boundaries with an overall alpha of 0.033-0.043).
    // Returned fields per look:
    //   z              — stopping boundary for |Z|
    //   nominalAlpha   — per-look two-sided nominal level 2(1 - Phi(z))
    //   cumulativeAlpha— P(crossing by this look | H0), reaches alpha at look K
    function groupSequentialBoundaries(nLooks, alpha, type) {
        type = type || 'obf';
        alpha = alpha || 0.05;
        const shapeType = type === 'pocock' ? 'pocock' : 'obf';
        const c = seqBoundaryConstant(nLooks, alpha, shapeType);
        const ts = Array.from({ length: nLooks }, (_, i) => (i + 1) / nLooks);
        const zs = ts.map(t => (shapeType === 'pocock' ? c : c / Math.sqrt(t)));
        const boundaries = [];
        for (let k = 1; k <= nLooks; k++) {
            const z = zs[k - 1];
            boundaries.push({
                look: k,
                fraction: ts[k - 1],
                z,
                nominalAlpha: 2 * (1 - normalCDF(z)),
                cumulativeAlpha: k === nLooks
                    ? alpha
                    : seqCrossingProb(zs.slice(0, k), ts.slice(0, k), 0, 0.01)
            });
        }
        return boundaries;
    }

    // Crossover design sample size
    function sampleSizeCrossover(delta, sdWithin, alpha, power, nPeriods) {
        alpha = alpha || 0.05;
        power = power || 0.80;
        nPeriods = nPeriods || 2;

        const za = normalQuantile(1 - alpha / 2);
        const zb = normalQuantile(power);

        // For a 2x2 crossover: N = 2*(za+zb)^2 * sd_within^2 / delta^2
        // For higher-order crossovers each subject contributes ~nPeriods/2
        // paired contrasts, so N is scaled by the linear factor 2/nPeriods
        // (an approximation; the exact gain depends on the sequence design).
        var n = 2 * Math.pow(za + zb, 2) * sdWithin * sdWithin / (delta * delta);
        if (nPeriods > 2) {
            n = n * (2 / nPeriods);
        }
        return { n: Math.ceil(n), total: Math.ceil(n), nPeriods: nPeriods, sdWithin: sdWithin };
    }

    // Diagnostic accuracy study sample size (based on expected sensitivity or specificity)
    function sampleSizeDiagnosticAccuracy(expectedProp, ciWidth, alpha, prevalence) {
        alpha = alpha || 0.05;
        var za = normalQuantile(1 - alpha / 2);

        // N for the specific metric (sensitivity or specificity)
        var nMetric = Math.ceil(4 * za * za * expectedProp * (1 - expectedProp) / (ciWidth * ciWidth));

        var totalN = null;
        if (prevalence && prevalence > 0) {
            // If estimating sensitivity, we need nMetric diseased subjects
            // total N = nMetric / prevalence (for sensitivity)
            // total N = nMetric / (1 - prevalence) (for specificity)
            // Return both
            totalN = {
                forSensitivity: Math.ceil(nMetric / prevalence),
                forSpecificity: Math.ceil(nMetric / (1 - prevalence))
            };
        }

        return { nMetric: nMetric, totalN: totalN, expectedProp: expectedProp, ciWidth: ciWidth };
    }

    // Maximum-sample-size inflation factor R for the classical boundary
    // shapes at alpha = 0.05 (two-sided), power = 0.80, equally spaced looks:
    // R = (theta_seq / theta_fixed)^2 where theta_seq is the drift giving 80%
    // crossing probability under the calibrated boundaries. The K = 2..5
    // values are pre-computed (they match Jennison & Turnbull Table 2.2,
    // e.g. Pocock: 1.110, 1.166, 1.202, 1.229); other K are solved exactly
    // with the same integration machinery and memoized.
    const seqInflationCache = {
        'obf:2': 1.006, 'obf:3': 1.017, 'obf:4': 1.023, 'obf:5': 1.028,
        'pocock:2': 1.110, 'pocock:3': 1.166, 'pocock:4': 1.203, 'pocock:5': 1.229
    };
    function seqInflationFactor(nLooks, type) {
        const key = type + ':' + nLooks;
        if (seqInflationCache[key] !== undefined) return seqInflationCache[key];
        const alpha = 0.05, power = 0.80;
        if (nLooks <= 1) return 1;
        const c = seqBoundaryConstant(nLooks, alpha, type);
        const ts = Array.from({ length: nLooks }, (_, i) => (i + 1) / nLooks);
        const zB = ts.map(t => (type === 'pocock' ? c : c / Math.sqrt(t)));
        let lo = 0.5, hi = 8;
        for (let i = 0; i < 30; i++) {
            const mid = (lo + hi) / 2;
            if (seqCrossingProb(zB, ts, mid, 0.02) < power) lo = mid;
            else hi = mid;
        }
        // Refinement pass on a finer grid around the coarse solution.
        let lo2 = (lo + hi) / 2 - 0.03, hi2 = (lo + hi) / 2 + 0.03;
        for (let i = 0; i < 20; i++) {
            const mid = (lo2 + hi2) / 2;
            if (seqCrossingProb(zB, ts, mid, 0.005) < power) lo2 = mid;
            else hi2 = mid;
        }
        const thetaSeq = (lo2 + hi2) / 2;
        const thetaFixed = normalQuantile(1 - alpha / 2) + normalQuantile(power);
        const R = Math.pow(thetaSeq / thetaFixed, 2);
        seqInflationCache[key] = R;
        return R;
    }

    // Group sequential sample size with maximum-N inflation factor
    // (alpha = 0.05 two-sided, power = 0.80, equally spaced looks).
    function sampleSizeGroupSequential(nFixed, nLooks, spendingType) {
        spendingType = spendingType || 'obf';
        var type = spendingType === 'obf' ? 'obf' : 'pocock';
        var inflationFactor = seqInflationFactor(nLooks, type);

        var nAdjusted = Math.ceil(nFixed * inflationFactor);
        return {
            nFixed: nFixed,
            nAdjusted: nAdjusted,
            inflationFactor: inflationFactor,
            nLooks: nLooks,
            spendingType: spendingType,
            maxNPerLook: Math.ceil(nAdjusted / nLooks)
        };
    }

    // Minimum detectable effect size given N, alpha, power (proportions)
    function mdeProportions(p1, nPerGroup, alpha, power) {
        alpha = alpha || 0.05;
        power = power || 0.80;
        var za = normalQuantile(1 - alpha / 2);
        var zb = normalQuantile(power);

        // Binary search for p2
        var lo = 0.001, hi = p1 - 0.001;
        if (hi <= lo) { lo = p1 + 0.001; hi = 0.999; }
        for (var iter = 0; iter < 100; iter++) {
            var mid = (lo + hi) / 2;
            var pw = powerTwoProportions(p1, mid, nPerGroup, alpha);
            if (pw < power) {
                // Need bigger effect (mid closer to p1 is smaller effect for hi side)
                if (mid < p1) hi = mid; else lo = mid;
            } else {
                if (mid < p1) lo = mid; else hi = mid;
            }
            if (Math.abs(hi - lo) < 0.0001) break;
        }
        var p2 = (lo + hi) / 2;
        return { p2: p2, arr: Math.abs(p1 - p2), rr: p2 / p1 };
    }

    // Minimum detectable effect size given N, alpha, power (means)
    function mdeMeans(sd, nPerGroup, alpha, power) {
        alpha = alpha || 0.05;
        power = power || 0.80;
        var za = normalQuantile(1 - alpha / 2);
        var zb = normalQuantile(power);
        var delta = (za + zb) * sd * Math.sqrt(2 / nPerGroup);
        return { delta: delta, cohensD: delta / sd };
    }

    // Minimum detectable effect size given N events, alpha, power (survival)
    function mdeSurvival(events, alpha, power) {
        alpha = alpha || 0.05;
        power = power || 0.80;
        var za = normalQuantile(1 - alpha / 2);
        var zb = normalQuantile(power);
        var lnHR = (za + zb) / Math.sqrt(events / 4);
        return { hr: Math.exp(-lnHR), hrUpper: Math.exp(lnHR), lnHR: lnHR };
    }

    // Power calculation (reverse: given N, compute power)
    function powerTwoProportions(p1, p2, n1, alpha, ratio) {
        alpha = alpha || 0.05;
        ratio = ratio || 1;
        const n2 = Math.ceil(n1 * ratio);
        const za = normalQuantile(1 - alpha / 2);
        const diff = Math.abs(p1 - p2);
        const pBar = (p1 * n1 + p2 * n2) / (n1 + n2);

        const se0 = Math.sqrt(pBar * (1 - pBar) * (1 / n1 + 1 / n2));
        const se1 = Math.sqrt(p1 * (1 - p1) / n1 + p2 * (1 - p2) / n2);

        const z = (diff - za * se0) / se1;
        return normalCDF(z);
    }

    function powerTwoMeans(delta, sd, n1, alpha, ratio) {
        alpha = alpha || 0.05;
        ratio = ratio || 1;
        const n2 = Math.ceil(n1 * ratio);
        const za = normalQuantile(1 - alpha / 2);
        const zb = delta / (sd * Math.sqrt(1 / n1 + 1 / n2)) - za;
        return normalCDF(zb);
    }

    function powerSurvival(hr, events, alpha, ratio) {
        alpha = alpha || 0.05;
        ratio = ratio || 1;
        const za = normalQuantile(1 - alpha / 2);
        const p = ratio / (1 + ratio);
        const zb = Math.abs(Math.log(hr)) * Math.sqrt(events * p * (1 - p)) - za;
        return normalCDF(zb);
    }

    // ============================================================
    // META-ANALYSIS
    // ============================================================

    function metaAnalysisFixedEffect(effects, variances, weights) {
        if (!weights) {
            weights = variances.map(v => 1 / v);
        }
        const sumW = weights.reduce((a, b) => a + b, 0);
        const pooled = weights.reduce((sum, w, i) => sum + w * effects[i], 0) / sumW;
        const sePo = Math.sqrt(1 / sumW);
        const z = normalQuantile(0.975);

        return {
            pooled,
            se: sePo,
            ci: { lower: pooled - z * sePo, upper: pooled + z * sePo },
            z: pooled / sePo,
            pValue: 2 * (1 - normalCDF(Math.abs(pooled / sePo))),
            weights
        };
    }

    function metaAnalysisRandomEffects(effects, variances, options = {}) {
        const { hksj = false } = options;
        const k = effects.length;
        const wi = variances.map(v => 1 / v);
        const sumW = wi.reduce((a, b) => a + b, 0);
        const sumW2 = wi.reduce((a, w) => a + w * w, 0);
        const sumWY = wi.reduce((sum, w, i) => sum + w * effects[i], 0);
        const pooledFixed = sumWY / sumW;

        // Q statistic
        const Q = wi.reduce((sum, w, i) => sum + w * Math.pow(effects[i] - pooledFixed, 2), 0);
        const df = k - 1;
        const pHet = df > 0 ? 1 - chiSquaredCDF(Q, df) : NaN;

        // Guard the single-study case (df = 0): heterogeneity quantities are
        // undefined; use tau2 = 0 so the pooled result reduces to the study
        // itself instead of propagating 0/0 = NaN.
        // I-squared
        const I2 = df > 0 && Q > 0 ? Math.max(0, (Q - df) / Q) : 0;

        // H-squared
        const H2 = df > 0 ? Q / df : 1;

        // DerSimonian-Laird tau²
        const C = sumW - sumW2 / sumW;
        const tau2 = df > 0 && C > 0 ? Math.max(0, (Q - df) / C) : 0;

        // Random-effects weights
        const wiRE = variances.map(v => 1 / (v + tau2));
        const sumWRE = wiRE.reduce((a, b) => a + b, 0);
        const pooledRE = wiRE.reduce((sum, w, i) => sum + w * effects[i], 0) / sumWRE;
        let seRE = Math.sqrt(1 / sumWRE);

        // HKSJ adjustment
        if (hksj && k > 1) {
            const qHKSJ = wiRE.reduce((sum, w, i) => sum + w * Math.pow(effects[i] - pooledRE, 2), 0) / df;
            seRE *= Math.sqrt(qHKSJ);
        }

        // Critical value / p-value reference: the Hartung-Knapp-Sidik-Jonkman
        // adjustment uses a t_{k-1} reference (matching its inflated SE); the
        // standard DerSimonian-Laird random-effects model uses the normal.
        const useT = hksj && k > 1;
        const crit = useT ? tQuantile(0.975, k - 1) : normalQuantile(0.975);
        const zStat = pooledRE / seRE;
        const pVal = useT
            ? 2 * (1 - tCDF(Math.abs(zStat), k - 1))
            : 2 * (1 - normalCDF(Math.abs(zStat)));

        // Prediction interval (IntHout et al. 2016): t_{k-2} reference.
        const tVal = k > 2 ? tQuantile(0.975, k - 2) : normalQuantile(0.975);
        const predSE = Math.sqrt(seRE * seRE + tau2);
        const predInterval = {
            lower: pooledRE - tVal * predSE,
            upper: pooledRE + tVal * predSE
        };

        return {
            pooled: pooledRE,
            se: seRE,
            ci: { lower: pooledRE - crit * seRE, upper: pooledRE + crit * seRE },
            z: zStat,
            pValue: pVal,
            Q, df, pHet,
            I2, H2, tau2,
            predInterval,
            weights: wiRE.map(w => w / sumWRE * 100),
            fixed: metaAnalysisFixedEffect(effects, variances)
        };
    }

    // Meta-analysis from 2x2 tables (inverse-variance + Mantel-Haenszel).
    // Zero-cell policy for the inverse-variance (per-study) effects, matching
    // standard practice (RevMan/metafor): for ratio measures, studies with no
    // events (or no non-events) in EITHER arm are excluded (their OR/RR is
    // undefined); other studies containing a zero cell get a Haldane-Anscombe
    // 0.5 added to all four cells. For RD, zero cells are fine; the 0.5
    // correction is applied only when the variance would otherwise be zero.
    // The MH pooled estimate is always computed on the raw counts.
    function metaAnalysisMH(tables, measure = 'OR') {
        const effects = [];
        const variances = [];
        const includedStudies = [];
        const excludedStudies = [];
        const correctedStudies = [];

        tables.forEach((t, i) => {
            let { a, b, c, d } = t;
            if (measure === 'OR' || measure === 'RR') {
                const noEvents = a === 0 && c === 0;
                const allEvents = b === 0 && d === 0;
                if (noEvents || allEvents) {
                    excludedStudies.push(i);
                    return;
                }
                if (a === 0 || b === 0 || c === 0 || d === 0) {
                    a += 0.5; b += 0.5; c += 0.5; d += 0.5;
                    correctedStudies.push(i);
                }
            } else if (measure === 'RD') {
                if (a * b === 0 && c * d === 0) {
                    a += 0.5; b += 0.5; c += 0.5; d += 0.5;
                    correctedStudies.push(i);
                }
            }

            if (measure === 'OR') {
                const or = (a * d) / (b * c);
                effects.push(Math.log(or));
                variances.push(1 / a + 1 / b + 1 / c + 1 / d);
            } else if (measure === 'RR') {
                const rr = (a / (a + b)) / (c / (c + d));
                effects.push(Math.log(rr));
                variances.push(1 / a - 1 / (a + b) + 1 / c - 1 / (c + d));
            } else if (measure === 'RD') {
                const rd = a / (a + b) - c / (c + d);
                const var_rd = a * b / Math.pow(a + b, 3) + c * d / Math.pow(c + d, 3);
                effects.push(rd);
                variances.push(var_rd);
            }
            includedStudies.push(i);
        });

        return {
            iv: metaAnalysisRandomEffects(effects, variances),
            mh: mantelHaenszel(tables, measure),
            studyEffects: effects,
            studyVariances: variances,
            includedStudies,
            excludedStudies,
            correctedStudies
        };
    }

    // Egger's regression test for publication bias
    function eggerTest(effects, se) {
        const k = effects.length;
        // Intercept SE needs k - 2 > 0 residual degrees of freedom.
        if (k < 3) return null;
        const precision = se.map(s => 1 / s);
        const standardized = effects.map((e, i) => e / se[i]);

        // Weighted linear regression: standardized effect = a + b * precision
        const sumX = precision.reduce((a, b) => a + b, 0);
        const sumY = standardized.reduce((a, b) => a + b, 0);
        const sumXY = precision.reduce((sum, x, i) => sum + x * standardized[i], 0);
        const sumX2 = precision.reduce((sum, x) => sum + x * x, 0);

        const b = (k * sumXY - sumX * sumY) / (k * sumX2 - sumX * sumX);
        const a = (sumY - b * sumX) / k;

        // SE of intercept
        const yPred = precision.map(x => a + b * x);
        const residSS = standardized.reduce((sum, y, i) => sum + Math.pow(y - yPred[i], 2), 0);
        const mse = residSS / (k - 2);
        const seA = Math.sqrt(mse * (1 / k + Math.pow(sumX / k, 2) / (sumX2 - sumX * sumX / k)));

        const tStat = a / seA;
        const pValue = 2 * (1 - tCDF(Math.abs(tStat), k - 2));

        return { intercept: a, slope: b, se: seA, t: tStat, pValue, df: k - 2 };
    }

    // Leave-one-out sensitivity analysis
    function leaveOneOut(effects, variances) {
        const results = [];
        for (let i = 0; i < effects.length; i++) {
            const e = effects.filter((_, j) => j !== i);
            const v = variances.filter((_, j) => j !== i);
            const ma = metaAnalysisRandomEffects(e, v);
            results.push({
                excluded: i,
                pooled: ma.pooled,
                ci: ma.ci,
                I2: ma.I2,
                tau2: ma.tau2
            });
        }
        return results;
    }

    // Cumulative meta-analysis
    function cumulativeMA(effects, variances, labels) {
        const results = [];
        for (let i = 0; i < effects.length; i++) {
            const e = effects.slice(0, i + 1);
            const v = variances.slice(0, i + 1);
            if (e.length === 1) {
                // Single study: return its own effect and CI directly
                const se = Math.sqrt(v[0]);
                const z = normalQuantile(0.975);
                results.push({
                    nStudies: 1,
                    label: labels ? labels[0] : 'Study 1',
                    pooled: e[0],
                    ci: [e[0] - z * se, e[0] + z * se],
                    I2: 0
                });
            } else {
                const ma = metaAnalysisRandomEffects(e, v);
                results.push({
                    nStudies: i + 1,
                    label: labels ? labels[i] : `Study ${i + 1}`,
                    pooled: ma.pooled,
                    ci: ma.ci,
                    I2: ma.I2
                });
            }
        }
        return results;
    }

    // Trim and fill (Duval & Tweedie 2000), L0 estimator.
    // Follows the original algorithm: the funnel centre is estimated by
    // FIXED-EFFECT meta-analysis (a random-effects centre lets tau^2 absorb
    // the asymmetry and underestimates the number of missing studies), and
    // the trim/re-centre/re-estimate loop is iterated to convergence.
    // Missing studies are assumed to be on the LEFT of the funnel (mirrors of
    // the most extreme right-side studies); the reported `original` and
    // `adjusted` summaries remain DerSimonian-Laird random-effects models.
    function trimAndFill(effects, variances) {
        const k = effects.length;
        const ma = metaAnalysisRandomEffects(effects, variances);

        const feCenter = (e, v) => {
            let sw = 0, swy = 0;
            for (let i = 0; i < e.length; i++) {
                const w = 1 / v[i];
                sw += w;
                swy += w * e[i];
            }
            return swy / sw;
        };

        // L0 estimator: rank the absolute residuals about `center`, sum the
        // ranks of the right-side (positive-residual) studies.
        const estimateK0 = (center) => {
            const residuals = effects.map(e => e - center);
            const ranks = residuals.map((r, i) => ({ v: Math.abs(r), i }))
                .sort((x, y) => x.v - y.v)
                .map((item, rank) => ({ ...item, rank: rank + 1 }))
                .sort((x, y) => x.i - y.i);
            let S = 0;
            residuals.forEach((r, i) => { if (r > 0) S += ranks[i].rank; });
            return Math.round(Math.max(0, (4 * S - k * (k + 1)) / (2 * k - 1)));
        };

        // Iterate: estimate k0, trim the k0 rightmost studies, re-centre by
        // fixed effect on the trimmed set, re-estimate k0, until stable.
        const byEffectDesc = effects.map((e, i) => i).sort((x, y) => effects[y] - effects[x]);
        let k0 = 0;
        let center = feCenter(effects, variances);
        let iterations = 0;
        for (let iter = 0; iter < 30; iter++) {
            iterations = iter + 1;
            const k0new = Math.min(estimateK0(center), Math.max(0, k - 2));
            const keepIdx = byEffectDesc.slice(k0new);
            center = feCenter(keepIdx.map(i => effects[i]), keepIdx.map(i => variances[i]));
            if (k0new === k0) { k0 = k0new; break; }
            k0 = k0new;
        }

        // Fill: mirror the k0 most extreme right-side studies about the
        // final (fixed-effect, trimmed) centre.
        const imputedEffects = [...effects];
        const imputedVariances = [...variances];
        const rightEffects = effects
            .map((e, i) => ({ e, v: variances[i], r: e - center }))
            .filter(item => item.r > 0)
            .sort((a, b) => b.r - a.r);

        for (let i = 0; i < Math.min(k0, rightEffects.length); i++) {
            imputedEffects.push(2 * center - rightEffects[i].e);
            imputedVariances.push(rightEffects[i].v);
        }

        const adjusted = metaAnalysisRandomEffects(imputedEffects, imputedVariances);

        return {
            k0,
            original: ma,
            adjusted,
            imputedEffects: imputedEffects.slice(k),
            imputedVariances: imputedVariances.slice(k),
            center,
            iterations,
            method: 'L0, fixed-effect centring, iterative'
        };
    }

    // Subgroup analysis
    function subgroupAnalysis(effects, variances, groups) {
        const uniqueGroups = [...new Set(groups)];
        const subResults = {};

        uniqueGroups.forEach(g => {
            const idx = groups.map((gr, i) => gr === g ? i : -1).filter(i => i >= 0);
            const e = idx.map(i => effects[i]);
            const v = idx.map(i => variances[i]);
            subResults[g] = metaAnalysisRandomEffects(e, v);
        });

        // Between-group Q test
        const overallMA = metaAnalysisRandomEffects(effects, variances);
        const Qwithin = Object.values(subResults).reduce((sum, r) => sum + r.Q, 0);
        const Qbetween = overallMA.Q - Qwithin;
        const dfBetween = uniqueGroups.length - 1;
        const pBetween = 1 - chiSquaredCDF(Qbetween, dfBetween);

        return {
            subgroups: subResults,
            overall: overallMA,
            Qbetween, dfBetween, pBetween,
            Qwithin
        };
    }

    // ============================================================
    // SURVIVAL ANALYSIS
    // ============================================================

    function kaplanMeier(times, events, group) {
        // Sort by time
        const data = times.map((t, i) => ({ time: t, event: events[i], group: group ? group[i] : 0 }))
            .sort((a, b) => a.time - b.time);

        const groups = group ? [...new Set(group)] : [0];
        const results = {};

        groups.forEach(g => {
            const gData = data.filter(d => d.group === g);
            const n = gData.length;
            let nRisk = n;
            const table = [{ time: 0, nRisk: n, events: 0, censored: 0, survival: 1, se: 0, ciLower: 1, ciUpper: 1 }];
            let survival = 1;
            let greenwood = 0;

            let i = 0;
            while (i < gData.length) {
                const t = gData[i].time;
                let nEvents = 0;
                let nCensored = 0;

                while (i < gData.length && gData[i].time === t) {
                    if (gData[i].event === 1) nEvents++;
                    else if (gData[i].event === 0) nCensored++;
                    i++;
                }

                if (nEvents > 0) {
                    survival *= (1 - nEvents / nRisk);
                    // Skip the Greenwood term when everyone at risk has an event
                    // (nRisk === nEvents): the term is undefined (÷0) and survival
                    // becomes 0, so its variance is taken as 0.
                    if (nRisk > nEvents) {
                        greenwood += nEvents / (nRisk * (nRisk - nEvents));
                    }
                }

                // Guard the 0 * Infinity case so SE is 0 (not NaN) once S(t) = 0.
                const se = survival > 0 ? survival * Math.sqrt(greenwood) : 0;
                // Log-log CI
                let ciLower, ciUpper;
                if (survival > 0 && survival < 1) {
                    const loglog = Math.log(-Math.log(survival));
                    const seLogLog = Math.sqrt(greenwood) / Math.abs(Math.log(survival));
                    const z = normalQuantile(0.975);
                    ciLower = Math.exp(-Math.exp(loglog + z * seLogLog));
                    ciUpper = Math.exp(-Math.exp(loglog - z * seLogLog));
                } else {
                    ciLower = survival;
                    ciUpper = survival;
                }

                table.push({ time: t, nRisk, events: nEvents, censored: nCensored, survival, se, ciLower, ciUpper });
                nRisk -= (nEvents + nCensored);
            }

            // Median survival
            let median = null, medianCI = null;
            for (let i = 1; i < table.length; i++) {
                if (table[i].survival <= 0.5) {
                    median = table[i].time;
                    break;
                }
            }
            // Brookmeyer-Crowley CI for median
            if (median !== null) {
                const z = normalQuantile(0.975);
                let medianLower = null, medianUpper = null;
                for (let i = 1; i < table.length; i++) {
                    if (table[i].survival <= 0.5 + z * table[i].se && medianLower === null) {
                        medianLower = table[i].time;
                    }
                    if (table[i].survival <= 0.5 - z * table[i].se && medianUpper === null) {
                        medianUpper = table[i].time;
                    }
                }
                medianCI = { lower: medianLower, upper: medianUpper };
            }

            results[g] = { table, median, medianCI, n };
        });

        return results;
    }

    // Log-rank (Mantel-Cox) test
    function logRankTest(times, events, groups) {
        const uniqueGroups = [...new Set(groups)];
        if (uniqueGroups.length !== 2) return null;

        const allTimes = [...new Set(times.filter((t, i) => events[i] === 1))].sort((a, b) => a - b);

        let O1 = 0, E1 = 0, V = 0;

        const groupStats = uniqueGroups.map(g => {
            const data = [];
            for (let i = 0; i < times.length; i++) {
                if (groups[i] === g) {
                    data.push({ t: times[i], e: events[i] });
                }
            }
            data.sort((a, b) => a.t - b.t);
            return data;
        });

        const groupPointers = [0, 0];
        const currentAtRisk = [groupStats[0].length, groupStats[1].length];

        allTimes.forEach(t => {
            const nRisk = [0, 0];
            const nEvents = [0, 0];

            for (let gIndex = 0; gIndex < 2; gIndex++) {
                let p = groupPointers[gIndex];
                const data = groupStats[gIndex];

                while (p < data.length && data[p].t < t) {
                    p++;
                    currentAtRisk[gIndex]--;
                }
                groupPointers[gIndex] = p;

                nRisk[gIndex] = currentAtRisk[gIndex];

                let died = 0;
                let tempP = p;
                while (tempP < data.length && data[tempP].t === t) {
                    if (data[tempP].e === 1) {
                        died++;
                    }
                    tempP++;
                }
                nEvents[gIndex] = died;
            }

            const totalRisk = nRisk[0] + nRisk[1];
            const totalEvents = nEvents[0] + nEvents[1];

            if (totalRisk > 0) {
                const e1 = nRisk[0] * totalEvents / totalRisk;
                O1 += nEvents[0];
                E1 += e1;
                if (totalRisk > 1) {
                    V += nRisk[0] * nRisk[1] * totalEvents * (totalRisk - totalEvents) / (totalRisk * totalRisk * (totalRisk - 1));
                }
            }
        });

        // V = 0 means no between-group information at any event time (e.g. no
        // overlapping risk sets); the test is undefined — return null like the
        // other unsupported-input cases rather than NaN/Infinity.
        if (!(V > 0)) return null;

        const chi2 = Math.pow(O1 - E1, 2) / V;
        const pValue = 1 - chiSquaredCDF(chi2, 1);

        // HR from O-E method
        const hr = Math.exp((O1 - E1) / V);
        const seLnHR = 1 / Math.sqrt(V);
        const z = normalQuantile(0.975);
        const hrCI = {
            lower: Math.exp(Math.log(hr) - z * seLnHR),
            upper: Math.exp(Math.log(hr) + z * seLnHR)
        };

        return { chi2, pValue, O1, E1, V, hr, hrCI, seLnHR };
    }

    // ============================================================
    // DIAGNOSTIC ACCURACY
    // ============================================================

    function diagnosticAccuracy(tp, fp, fn, tn) {
        const n = tp + fp + fn + tn;
        const sens = tp / (tp + fn);
        const spec = tn / (tn + fp);
        const ppv = tp / (tp + fp);
        const npv = tn / (tn + fn);
        const plr = sens / (1 - spec);
        const nlr = (1 - sens) / spec;
        const dor = (tp * tn) / (fp * fn);
        const accuracy = (tp + tn) / n;
        const prevalence = (tp + fn) / n;
        const youdenJ = sens + spec - 1;

        const ciSens = wilsonCI(sens, tp + fn);
        const ciSpec = wilsonCI(spec, tn + fp);
        const ciPPV = wilsonCI(ppv, tp + fp);
        const ciNPV = wilsonCI(npv, tn + fn);

        return {
            sensitivity: { value: sens, ci: ciSens },
            specificity: { value: spec, ci: ciSpec },
            ppv: { value: ppv, ci: ciPPV },
            npv: { value: npv, ci: ciNPV },
            plr, nlr, dor, accuracy, prevalence, youdenJ
        };
    }

    // Fagan nomogram calculations
    function faganNomogram(preTestProb, plr, nlr) {
        const preTestOdds = preTestProb / (1 - preTestProb);
        const postTestOddsPos = preTestOdds * plr;
        const postTestOddsNeg = preTestOdds * nlr;
        const postTestProbPos = postTestOddsPos / (1 + postTestOddsPos);
        const postTestProbNeg = postTestOddsNeg / (1 + postTestOddsNeg);

        return { preTestProb, postTestProbPos, postTestProbNeg, preTestOdds, postTestOddsPos, postTestOddsNeg };
    }

    // AUC by the trapezoidal rule over the ROC points.
    // The (0,0) and (1,1) endpoints are always included so the estimate spans
    // the full [0,1] FPR range and matches the plotted curve; omitting them
    // badly under-estimates the AUC when only interior thresholds are supplied.
    // The Hanley-McNeil SE/CI need the number of diseased (nPos) and
    // non-diseased (nNeg) SUBJECTS — not the number of ROC points. When those
    // counts are unavailable no valid interval exists, so ci/se are returned null.
    function aucTrapezoidal(sensitivities, specificities, nPos, nNeg) {
        const len = Math.min(sensitivities.length, specificities.length);
        const points = [{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }];
        for (let i = 0; i < len; i++) {
            points.push({ fpr: 1 - specificities[i], tpr: sensitivities[i] });
        }
        points.sort((a, b) => (a.fpr - b.fpr) || (a.tpr - b.tpr));

        let auc = 0;
        for (let i = 1; i < points.length; i++) {
            auc += (points[i].fpr - points[i - 1].fpr) * (points[i].tpr + points[i - 1].tpr) / 2;
        }

        // Hanley-McNeil SE requires real case counts, not the number of points.
        if (!(nPos > 0 && nNeg > 0)) {
            return { auc, se: null, ci: null };
        }
        const Q1 = auc / (2 - auc);
        const Q2 = 2 * auc * auc / (1 + auc);
        const se = Math.sqrt((auc * (1 - auc) + (nPos - 1) * (Q1 - auc * auc) +
            (nNeg - 1) * (Q2 - auc * auc)) / (nPos * nNeg));
        const z = normalQuantile(0.975);

        return { auc, se, ci: { lower: Math.max(0, auc - z * se), upper: Math.min(1, auc + z * se) } };
    }

    // ============================================================
    // EPIDEMIOLOGY — 2×2 TABLE
    // ============================================================

    function twoByTwo(a, b, c, d) {
        const n = a + b + c + d;
        const p1 = a / (a + b);
        const p2 = c / (c + d);
        const z = normalQuantile(0.975);

        // Haldane-Anscombe 0.5 continuity correction for the ratio measures
        // when a zero cell would otherwise give a 0/Infinity estimate or an
        // undefined (NaN/Infinity) standard error. Applied to all four cells.
        // RR only breaks when an EVENT cell is zero (a or c); OR and its
        // Woolf SE break when any cell is zero. RD, chi-square and Fisher's
        // exact test are computed from the raw counts.
        const orCC = (a === 0 || b === 0 || c === 0 || d === 0);
        const rrCC = (a === 0 || c === 0);

        // Risk Ratio
        const aR = rrCC ? a + 0.5 : a, bR = rrCC ? b + 0.5 : b;
        const cR = rrCC ? c + 0.5 : c, dR = rrCC ? d + 0.5 : d;
        const rr = (aR / (aR + bR)) / (cR / (cR + dR));
        const lnRR = Math.log(rr);
        const seLnRR = Math.sqrt(1 / aR - 1 / (aR + bR) + 1 / cR - 1 / (cR + dR));
        const rrCI = { lower: Math.exp(lnRR - z * seLnRR), upper: Math.exp(lnRR + z * seLnRR) };

        // Odds Ratio
        const aO = orCC ? a + 0.5 : a, bO = orCC ? b + 0.5 : b;
        const cO = orCC ? c + 0.5 : c, dO = orCC ? d + 0.5 : d;
        const or = (aO * dO) / (bO * cO);
        const lnOR = Math.log(or);
        const seLnOR = Math.sqrt(1 / aO + 1 / bO + 1 / cO + 1 / dO);
        const orCI = { lower: Math.exp(lnOR - z * seLnOR), upper: Math.exp(lnOR + z * seLnOR) };

        // Risk Difference
        const rd = p1 - p2;
        const seRD = Math.sqrt(p1 * (1 - p1) / (a + b) + p2 * (1 - p2) / (c + d));
        const rdCI = { lower: rd - z * seRD, upper: rd + z * seRD };

        // Newcombe CI for RD
        const rdNewcombe = newcombeCI(p1, a + b, p2, c + d, z);

        // NNT / NNH from the risk difference (rd = risk_exposed - risk_unexposed,
        // so rd > 0 indicates harm in the exposed group). When the RD CI crosses
        // zero the NNT interval is discontinuous (Altman 1998, BMJ): it runs from
        // a finite benefit NNT out to infinity and from infinity in to a finite
        // harm NNT, so no single finite interval is reported.
        const nnt = rd !== 0 ? 1 / Math.abs(rd) : Infinity;
        let nntCI;
        if (rdCI.lower <= 0 && rdCI.upper >= 0) {
            nntCI = {
                crossesZero: true,
                nntHarm: rdCI.upper > 0 ? 1 / rdCI.upper : Infinity,
                nntBenefit: rdCI.lower < 0 ? 1 / Math.abs(rdCI.lower) : Infinity
            };
        } else {
            nntCI = {
                crossesZero: false,
                lower: 1 / Math.abs(rdCI.upper),
                upper: 1 / Math.abs(rdCI.lower)
            };
        }

        // Chi-squared
        const chi2 = chiSquaredTest2x2(a, b, c, d);
        const chi2Yates = chiSquaredTest2x2(a, b, c, d, true);
        const fisher = fisherExact(a, b, c, d);

        // Attributable fractions
        const afExposed = (rr - 1) / rr;
        const prevalenceExposure = (a + b) / n;
        const paf = prevalenceExposure * (rr - 1) / (1 + prevalenceExposure * (rr - 1));

        return {
            p1, p2,
            rr: { value: rr, ci: rrCI, seLnRR, continuityCorrected: rrCC },
            or: { value: or, ci: orCI, seLnOR, continuityCorrected: orCC },
            rd: { value: rd, ci: rdCI, seRD, newcombe: rdNewcombe },
            nnt: { value: nnt, ci: nntCI, isHarm: rd > 0 },
            chi2, chi2Yates, fisher,
            afExposed, paf,
            continuityCorrected: orCC || rrCC,
            counts: { a, b, c, d, n }
        };
    }

    // Fragility index (Walsh et al. 2014): the fewest patient-outcome changes,
    // within a single arm, needed to make a significant result non-significant.
    // Minimised over both arms and both flip directions (the previous version
    // only tried one direction and could overestimate the index).
    function fragilityIndex(a, b, c, d) {
        const originalP = fisherExact(a, b, c, d).pValue;
        if (originalP >= 0.05) {
            return { index: 0, originalP, modifiedP: originalP, modifiedTable: { a, b, c, d }, message: 'Result is already non-significant' };
        }

        const moves = [
            { arm: 'group 1 (event to non-event)', da: -1, db: 1, dc: 0, dd: 0 },
            { arm: 'group 1 (non-event to event)', da: 1, db: -1, dc: 0, dd: 0 },
            { arm: 'group 2 (event to non-event)', da: 0, db: 0, dc: -1, dd: 1 },
            { arm: 'group 2 (non-event to event)', da: 0, db: 0, dc: 1, dd: -1 }
        ];

        let best = Infinity, bestTable = null, bestP = originalP, bestArm = null;
        moves.forEach(m => {
            let A = a, B = b, C = c, D = d, steps = 0, p = originalP;
            while (p < 0.05 && steps < 1000) {
                A += m.da; B += m.db; C += m.dc; D += m.dd;
                if (A < 0 || B < 0 || C < 0 || D < 0) { steps = Infinity; break; }
                steps++;
                p = fisherExact(A, B, C, D).pValue;
            }
            if (p >= 0.05 && steps < best) {
                best = steps; bestTable = { a: A, b: B, c: C, d: D }; bestP = p; bestArm = m.arm;
            }
        });

        if (!isFinite(best)) {
            return { index: null, originalP, message: 'Could not reach non-significance by single-arm changes' };
        }
        return { index: best, originalP, modifiedP: bestP, modifiedTable: bestTable, arm: bestArm };
    }

    // Additive interaction measures
    function additiveInteraction(rr11, rr10, rr01) {
        const reri = rr11 - rr10 - rr01 + 1;
        const ap = reri / rr11;
        const s = (rr11 - 1) / ((rr10 - 1) + (rr01 - 1));

        return { reri, ap, s };
    }

    // Incidence rate
    function incidenceRate(events, personTime, alpha) {
        alpha = alpha || 0.05;
        const rate = events / personTime;
        const ci = poissonExactCI(events, alpha);
        return {
            rate,
            ci: { lower: ci.lower / personTime, upper: ci.upper / personTime },
            events,
            personTime
        };
    }

    // Rate ratio
    function rateRatio(events1, pt1, events2, pt2, alpha) {
        alpha = alpha || 0.05;
        const z = normalQuantile(1 - alpha / 2);
        const r1 = events1 / pt1;
        const r2 = events2 / pt2;
        const ratio = r1 / r2;
        const lnRatio = Math.log(ratio);
        const seLnRatio = Math.sqrt(1 / events1 + 1 / events2);
        return {
            ratio,
            ci: { lower: Math.exp(lnRatio - z * seLnRatio), upper: Math.exp(lnRatio + z * seLnRatio) },
            r1, r2
        };
    }

    // SMR
    function smr(observed, expected, alpha) {
        alpha = alpha || 0.05;
        const ratio = observed / expected;
        const ci = poissonExactCI(observed, alpha);
        return {
            smr: ratio,
            ci: { lower: ci.lower / expected, upper: ci.upper / expected }
        };
    }

    // Direct age-standardization
    function directStandardization(ageRates, ageWeights) {
        // ageRates = [{events, population, standardPop}]
        //   or      [{rate, se, standardPop}]
        //   or      [{rate, se}] / [{events, population}] with the stratum
        //           weights supplied separately as the ageWeights array.
        // (The per-stratum weight is read from standardPop, or from
        //  ageWeights[i] when that argument is given.)
        let stdRate = 0;
        let stdVar = 0;

        ageRates.forEach((ag, i) => {
            const rate = ag.events !== undefined ? ag.events / ag.population : ag.rate;
            const w = ageWeights ? ageWeights[i] : ag.standardPop;
            const se = ag.events !== undefined ? Math.sqrt(ag.events) / ag.population : ag.se;
            stdRate += rate * w;
            stdVar += Math.pow(se * w, 2);
        });

        const totalWeight = ageWeights ? ageWeights.reduce((a, b) => a + b, 0) : ageRates.reduce((a, b) => a + (b.standardPop || 0), 0);
        stdRate /= totalWeight;
        stdVar /= totalWeight * totalWeight;

        const z = normalQuantile(0.975);
        return {
            rate: stdRate,
            se: Math.sqrt(stdVar),
            ci: { lower: stdRate - z * Math.sqrt(stdVar), upper: stdRate + z * Math.sqrt(stdVar) }
        };
    }

    // ============================================================
    // EFFECT SIZE CONVERSIONS
    // ============================================================

    function orToRR(or, p0) {
        // Zhang & Yu correction
        return or / (1 - p0 + p0 * or);
    }

    function rrToOR(rr, p0) {
        return rr * (1 - p0) / (1 - rr * p0);
    }

    function orToD(or) {
        return Math.log(or) / 1.81; // π/√3 ≈ 1.8138
    }

    function dToOR(d) {
        return Math.exp(1.81 * d);
    }

    function dToHedgesG(d, n1, n2) {
        const df = n1 + n2 - 2;
        const correction = 1 - 3 / (4 * df - 1);
        return d * correction;
    }

    function rToD(r) {
        return 2 * r / Math.sqrt(1 - r * r);
    }

    function dToR(d) {
        return d / Math.sqrt(d * d + 4);
    }

    // ============================================================
    // UTILITY FUNCTIONS
    // ============================================================

    function round(x, decimals) {
        decimals = decimals || 4;
        return Math.round(x * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }

    function formatCI(lower, upper, decimals) {
        decimals = decimals || 2;
        return `(${round(lower, decimals)}, ${round(upper, decimals)})`;
    }

    function formatPValue(p) {
        if (p < 0.001) return '< 0.001';
        if (p < 0.01) return p.toFixed(3);
        return p.toFixed(3);
    }

    // ============================================================
    // PUBLIC API
    // ============================================================

    return {
        // Special functions
        logGamma, gammaFunction, betaFunction, logBeta,
        regularizedIncompleteBeta, regularizedLowerIncompleteGamma,

        // Distributions
        normalPDF, normalCDF, normalQuantile,
        tPDF, tCDF, tQuantile,
        chiSquaredPDF, chiSquaredCDF, chiSquaredQuantile,
        fCDF, fQuantile,
        binomialPMF, binomialCDF,
        poissonPMF, poissonCDF, poissonQuantile,
        hypergeometricPMF,

        // Confidence intervals
        waldCI, wilsonCI, clopperPearsonCI, agrestiCoullCI,
        newcombeCI, poissonExactCI, logRateCI,

        // Hypothesis tests
        twoProportionZTest, chiSquaredTest2x2, fisherExact,
        mcNemarTest, cochranArmitageTrend, mantelHaenszel,

        // Sample size
        sampleSizeTwoProportions, sampleSizeTwoMeans,
        sampleSizeSchoenfeld, sampleSizeFreedman,
        sampleSizeNonInferiority, sampleSizeEquivalence,
        sampleSizeCluster, sampleSizeSteppedWedge,
        sampleSizeOrdinalShift, sampleSizeMultiArm,
        groupSequentialBoundaries,

        // Additional sample size
        sampleSizeCrossover, sampleSizeDiagnosticAccuracy,
        sampleSizeGroupSequential,

        // Power
        powerTwoProportions, powerTwoMeans, powerSurvival,

        // Minimum detectable effect
        mdeProportions, mdeMeans, mdeSurvival,

        // Meta-analysis
        metaAnalysisFixedEffect, metaAnalysisRandomEffects,
        metaAnalysisMH, eggerTest, leaveOneOut, cumulativeMA,
        trimAndFill, subgroupAnalysis,

        // Survival
        kaplanMeier, logRankTest,

        // Diagnostic accuracy
        diagnosticAccuracy, faganNomogram, aucTrapezoidal,

        // Epidemiology
        twoByTwo, fragilityIndex, additiveInteraction,
        incidenceRate, rateRatio, smr, directStandardization,

        // Effect size
        orToRR, rrToOR, orToD, dToOR, dToHedgesG, rToD, dToR,

        // Utility
        round, formatCI, formatPValue,

        // Expose constants for testing
        _EPS: EPS
    };
})();

if (typeof module !== 'undefined') module.exports = Statistics;
