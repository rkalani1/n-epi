/**
 * Neuro-Epi — Complete Statistical Engine
 * Implements all distribution functions, hypothesis tests, sample size formulas,
 * and epidemiological calculations from scratch.
 *
 * Numerical accuracy: 7+ decimal places for distribution functions.
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
        if (df <= 0) return NaN;
        const x = df / (df + t * t);
        const prob = 0.5 * regularizedIncompleteBeta(x, df / 2, 0.5);
        return t >= 0 ? 1 - prob : prob;
    }

    function tPDF(t, df) {
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

        z = (Math.abs(diff) - correction) / se;
        const pValue = 2 * (1 - normalCDF(Math.abs(z)));

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
        let numerator = 0, denominator = 0;
        let Q = 0; // Cochran Q for homogeneity
        const k = tables.length;
        const estimates = [];

        if (measure === 'OR') {
            let sumR = 0, sumS = 0;
            let sumRS = 0, sumR2 = 0, sumS2 = 0, sumPR = 0, sumPS = 0;

            tables.forEach(t => {
                const n = t.a + t.b + t.c + t.d;
                const R = t.a * t.d / n;
                const S = t.b * t.c / n;
                sumR += R;
                sumS += S;

                // For Breslow-Day / Tarone
                const or_i = (t.a * t.d) / (t.b * t.c);
                estimates.push(or_i);
            });

            const orMH = sumR / sumS;

            // Robins-Breslow-Greenland variance
            let P_R = 0, P_S = 0, Q_plus = 0;
            tables.forEach(t => {
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

            // Breslow-Day test for homogeneity
            let bd = 0;
            tables.forEach((t, i) => {
                const n = t.a + t.b + t.c + t.d;
                const r1 = t.a + t.b, c1 = t.a + t.c;
                // Expected a under common OR
                const A = orMH - 1;
                const B = -(r1 + c1 + (r1 * (orMH - 1) + n + c1));
                // Solve quadratic for expected a
                // Simplified: use iterative approach
                let aExp = t.a;
                for (let iter = 0; iter < 50; iter++) {
                    const bExp = r1 - aExp;
                    const cExp = c1 - aExp;
                    const dExp = n - r1 - cExp;
                    if (bExp <= 0 || cExp <= 0 || dExp <= 0) break;
                    const orExp = (aExp * dExp) / (bExp * cExp);
                    const f = orExp - orMH;
                    const deriv = dExp / (bExp * cExp) + aExp / (bExp * cExp) +
                                  aExp * dExp / (bExp * bExp * cExp) + aExp * dExp / (bExp * cExp * cExp);
                    // Simplified Newton
                    const correction = f / (1/aExp + 1/bExp + 1/cExp + 1/dExp);
                    aExp -= f / (1/aExp + 1/bExp + 1/cExp + 1/dExp) * (aExp*bExp*cExp*dExp/(aExp*dExp + bExp*cExp));
                    if (aExp < 0.5) aExp = 0.5;
                    if (aExp > Math.min(r1, c1) - 0.5) aExp = Math.min(r1, c1) - 0.5;
                }
                const bExp = r1 - aExp;
                const cExp = c1 - aExp;
                const dExp = n - r1 - cExp;
                const varA = 1 / (1/aExp + 1/bExp + 1/cExp + 1/dExp);
                bd += Math.pow(t.a - aExp, 2) / varA;
            });
            const bdPValue = 1 - chiSquaredCDF(bd, k - 1);

            return {
                measure: 'OR',
                estimate: orMH,
                lnEstimate: lnOR,
                se: seLnOR,
                ci: { lower: Math.exp(lnOR - z * seLnOR), upper: Math.exp(lnOR + z * seLnOR) },
                breslowDay: { statistic: bd, df: k - 1, pValue: bdPValue },
                stratumEstimates: estimates
            };
        }

        if (measure === 'RR') {
            let sumA = 0, sumB = 0;
            tables.forEach(t => {
                const n = t.a + t.b + t.c + t.d;
                sumA += t.a * (t.c + t.d) / n;
                sumB += t.c * (t.a + t.b) / n;
            });
            const rrMH = sumA / sumB;

            // Greenland-Robins variance
            let varNum = 0;
            tables.forEach(t => {
                const n = t.a + t.b + t.c + t.d;
                const r1 = t.a + t.b, r2 = t.c + t.d;
                varNum += (t.a * t.d * r1 + t.c * t.b * r2 - t.a * t.c * n) / (n * n) +
                          (r1 * r2 * (t.a * t.d - t.b * t.c)) / (n * n * n);
            });
            // Simplified variance estimate
            let P = 0;
            tables.forEach(t => {
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
                ci: { lower: Math.exp(lnRR - z * seLnRR), upper: Math.exp(lnRR + z * seLnRR) }
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
    function sampleSizeFreedman(hr, alpha, power, ratio) {
        alpha = alpha || 0.05;
        power = power || 0.80;
        ratio = ratio || 1;

        const za = normalQuantile(1 - alpha / 2);
        const zb = normalQuantile(power);
        const p = ratio / (1 + ratio);

        const events = Math.pow(za + zb, 2) / (p * (1 - p) * Math.pow(hr - 1, 2) / Math.pow(hr + 1, 2));
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

    // Equivalence — proportions
    function sampleSizeEquivalence(p1, margin, alpha, power) {
        alpha = alpha || 0.025;
        power = power || 0.80;

        const za = normalQuantile(1 - alpha);
        const zb = normalQuantile(power);
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

    // Stepped-wedge (Hussey-Hughes)
    function sampleSizeSteppedWedge(nParallel, steps, clustersPerStep, icc) {
        const k = steps;
        const m = clustersPerStep;
        const totalClusters = k * m;

        // Design effect for stepped-wedge
        const deff_sw = (1 + icc * (k * m - 1)) / (1 + icc * (m / 2 - 1));
        // Simplified: use ratio relative to parallel cluster RCT
        const correctionFactor = 3 * (1 - icc) / (2 * k * (k - 1 / k) * icc + 3 * (1 - icc));
        const nSW = Math.ceil(nParallel * correctionFactor);

        return {
            totalClusters,
            steps: k,
            clustersPerStep: m,
            correctionFactor,
            nPerCluster: Math.ceil(nSW / totalClusters),
            totalN: nSW
        };
    }

    // Ordinal shift (mRS) — Whitehead formula for proportional odds
    function sampleSizeOrdinalShift(controlDist, treatDist, commonOR, alpha, power) {
        alpha = alpha || 0.05;
        power = power || 0.80;

        // Whitehead method for ordinal data under proportional odds
        // N = 6 * (z_alpha/2 + z_beta)^2 / (log(OR)^2 * (1 - sum(pi^3)))
        const za = normalQuantile(1 - alpha / 2);
        const zb = normalQuantile(power);

        // Using control distribution to compute the non-centrality factor
        let sumPiCubed = 0;
        for (let i = 0; i < controlDist.length; i++) {
            sumPiCubed += Math.pow(controlDist[i], 3);
        }

        const lnOR = Math.log(commonOR);
        const N = 6 * Math.pow(za + zb, 2) / (lnOR * lnOR * (1 - sumPiCubed));

        return {
            nPerGroup: Math.ceil(N / 2),
            total: 2 * Math.ceil(N / 2),
            commonOR,
            lnOR,
            controlDist,
            treatDist
        };
    }

    // Multi-arm with Bonferroni correction
    function sampleSizeMultiArm(nPerGroup_2arm, nArms, correction) {
        correction = correction || 'bonferroni';
        let adjustedAlpha;
        if (correction === 'bonferroni') {
            adjustedAlpha = 0.05 / (nArms - 1);
        } else if (correction === 'dunnett') {
            // Approximate Dunnett — slightly less conservative than Bonferroni
            adjustedAlpha = 1 - Math.pow(1 - 0.05, 1 / (nArms - 1));
        } else {
            adjustedAlpha = 0.05;
        }

        const za = normalQuantile(1 - adjustedAlpha / 2);
        const ratio = za / normalQuantile(0.975);
        const adjustedN = Math.ceil(nPerGroup_2arm * ratio * ratio);

        return {
            nPerArm: adjustedN,
            totalN: adjustedN * nArms,
            adjustedAlpha,
            correction
        };
    }

    // Group sequential — O'Brien-Fleming and Pocock boundaries
    function groupSequentialBoundaries(nLooks, alpha, type) {
        type = type || 'obf';
        alpha = alpha || 0.05;
        const boundaries = [];

        if (type === 'obf') {
            // O'Brien-Fleming: z_k = z_final / sqrt(k/K)
            // Use Lan-DeMets spending function
            for (let k = 1; k <= nLooks; k++) {
                const t = k / nLooks;
                // OBF spending function
                const spent = 2 * (1 - normalCDF(normalQuantile(1 - alpha / 2) / Math.sqrt(t)));
                const z = normalQuantile(1 - spent / 2);
                boundaries.push({ look: k, fraction: t, z, nominalAlpha: spent });
            }
        } else if (type === 'pocock') {
            // Pocock: constant boundary — find z such that overall alpha is maintained
            // Approximation: z_pocock ≈ z_alpha * sqrt(nLooks corrections)
            let zp = normalQuantile(1 - alpha / (2 * nLooks)); // Initial Bonferroni approx
            for (let k = 1; k <= nLooks; k++) {
                const t = k / nLooks;
                boundaries.push({ look: k, fraction: t, z: zp, nominalAlpha: 2 * (1 - normalCDF(zp)) });
            }
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
        // For higher-order crossovers, efficiency gain ~ sqrt(nPeriods/2)
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

    // Group sequential sample size with alpha spending inflation factor
    function sampleSizeGroupSequential(nFixed, nLooks, spendingType) {
        spendingType = spendingType || 'obf';
        // Inflation factor for group sequential designs
        // OBF: very small inflation (~1.015 for 3 looks)
        // Pocock: larger inflation
        var inflationFactor;
        if (spendingType === 'obf') {
            // Approximate OBF inflation factors
            var obfFactors = { 2: 1.008, 3: 1.015, 4: 1.020, 5: 1.025 };
            inflationFactor = obfFactors[nLooks] || (1 + 0.005 * nLooks);
        } else {
            // Pocock inflation factors
            var pocockFactors = { 2: 1.17, 3: 1.23, 4: 1.27, 5: 1.30 };
            inflationFactor = pocockFactors[nLooks] || (1 + 0.06 * Math.log(nLooks) + 0.05);
        }

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
        const pHet = 1 - chiSquaredCDF(Q, df);

        // I-squared
        const I2 = Math.max(0, (Q - df) / Q);

        // H-squared
        const H2 = Q / df;

        // DerSimonian-Laird tau²
        const C = sumW - sumW2 / sumW;
        const tau2 = Math.max(0, (Q - df) / C);

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

        const z = normalQuantile(0.975);

        // I² CI (Higgins & Thompson)
        const B = 0.5 * (Math.log(Q) - Math.log(df)) / (Math.sqrt(2 * Q) - Math.sqrt(2 * df - 1));
        const I2Lower = Math.max(0, (Math.exp(0.5 * Math.log(Q / df) - 1.96 * B) - 1) / (Math.exp(0.5 * Math.log(Q / df) - 1.96 * B)));

        // Prediction interval
        const tVal = k > 2 ? tQuantile(0.975, k - 2) : normalQuantile(0.975);
        const predSE = Math.sqrt(seRE * seRE + tau2);
        const predInterval = {
            lower: pooledRE - tVal * predSE,
            upper: pooledRE + tVal * predSE
        };

        return {
            pooled: pooledRE,
            se: seRE,
            ci: { lower: pooledRE - z * seRE, upper: pooledRE + z * seRE },
            z: pooledRE / seRE,
            pValue: 2 * (1 - normalCDF(Math.abs(pooledRE / seRE))),
            Q, df, pHet,
            I2, H2, tau2,
            predInterval,
            weights: wiRE.map(w => w / sumWRE * 100),
            fixed: metaAnalysisFixedEffect(effects, variances)
        };
    }

    // Meta-analysis from 2x2 tables (Mantel-Haenszel)
    function metaAnalysisMH(tables, measure = 'OR') {
        const k = tables.length;
        const effects = [];
        const variances = [];

        tables.forEach(t => {
            const { a, b, c, d } = t;
            if (measure === 'OR') {
                const or = (a * d) / (b * c);
                const lnOR = Math.log(or);
                const var_lnOR = 1 / a + 1 / b + 1 / c + 1 / d;
                effects.push(lnOR);
                variances.push(var_lnOR);
            } else if (measure === 'RR') {
                const rr = (a / (a + b)) / (c / (c + d));
                const lnRR = Math.log(rr);
                const var_lnRR = 1 / a - 1 / (a + b) + 1 / c - 1 / (c + d);
                effects.push(lnRR);
                variances.push(var_lnRR);
            } else if (measure === 'RD') {
                const rd = a / (a + b) - c / (c + d);
                const var_rd = a * b / Math.pow(a + b, 3) + c * d / Math.pow(c + d, 3);
                effects.push(rd);
                variances.push(var_rd);
            }
        });

        return {
            iv: metaAnalysisRandomEffects(effects, variances),
            mh: mantelHaenszel(tables, measure === 'RD' ? 'RR' : measure),
            studyEffects: effects,
            studyVariances: variances
        };
    }

    // Egger's regression test for publication bias
    function eggerTest(effects, se) {
        const k = effects.length;
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

    // Trim and fill
    function trimAndFill(effects, variances) {
        const k = effects.length;
        const ma = metaAnalysisRandomEffects(effects, variances);
        const center = ma.pooled;

        // Rank-based method (R0)
        const residuals = effects.map(e => e - center);
        const absRes = residuals.map(Math.abs);
        const ranks = absRes.map((v, i) => ({ v, i }))
            .sort((a, b) => a.v - b.v)
            .map((item, rank) => ({ ...item, rank: rank + 1 }))
            .sort((a, b) => a.i - b.i);

        // Count studies on right side that are "extra"
        let T = 0;
        const rightSide = residuals.map((r, i) => r > 0 ? ranks[i].rank : 0);
        const S = rightSide.reduce((a, b) => a + b, 0);
        const expectedS = k * (k + 1) / 4;
        const k0 = Math.round(Math.max(0, (4 * S - k * (k + 1)) / (2 * k - 1)));

        // Generate imputed studies
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
            imputedVariances: imputedVariances.slice(k)
        };
    }

    // Subgroup analysis
    function subgroupAnalysis(effects, variances, groups) {
        const uniqueGroups = [...new Set(groups)];
        const subResults = {};
        const betweenGroupEffects = [];
        const betweenGroupVariances = [];

        uniqueGroups.forEach(g => {
            const idx = groups.map((gr, i) => gr === g ? i : -1).filter(i => i >= 0);
            const e = idx.map(i => effects[i]);
            const v = idx.map(i => variances[i]);
            const ma = metaAnalysisRandomEffects(e, v);
            subResults[g] = ma;
            betweenGroupEffects.push(ma.pooled);
            betweenGroupVariances.push(ma.se * ma.se);
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

            const uniqueTimes = [...new Set(gData.map(d => d.time))].sort((a, b) => a - b);

            uniqueTimes.forEach(t => {
                const atTime = gData.filter(d => d.time === t);
                const nEvents = atTime.filter(d => d.event === 1).length;
                const nCensored = atTime.filter(d => d.event === 0).length;

                if (nEvents > 0) {
                    survival *= (1 - nEvents / nRisk);
                    greenwood += nEvents / (nRisk * (nRisk - nEvents));
                }

                const se = survival * Math.sqrt(greenwood);
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
            });

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

        allTimes.forEach(t => {
            const nRisk = [];
            const nEvents = [];
            uniqueGroups.forEach(g => {
                const gIdx = times.map((_, i) => i).filter(i => groups[i] === g);
                const atRisk = gIdx.filter(i => times[i] >= t).length;
                const died = gIdx.filter(i => times[i] === t && events[i] === 1).length;
                nRisk.push(atRisk);
                nEvents.push(died);
            });

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

    // AUC by trapezoidal rule
    function aucTrapezoidal(sensitivities, specificities) {
        // Points should be sorted by 1-specificity
        const fpr = specificities.map(s => 1 - s);
        const points = fpr.map((f, i) => ({ fpr: f, tpr: sensitivities[i] }))
            .sort((a, b) => a.fpr - b.fpr);

        let auc = 0;
        for (let i = 1; i < points.length; i++) {
            auc += (points[i].fpr - points[i - 1].fpr) * (points[i].tpr + points[i - 1].tpr) / 2;
        }

        // SE via Hanley-McNeil
        const n1 = sensitivities.length; // Approximate
        const n2 = specificities.length;
        const Q1 = auc / (2 - auc);
        const Q2 = 2 * auc * auc / (1 + auc);
        const se = Math.sqrt((auc * (1 - auc) + (n1 - 1) * (Q1 - auc * auc) + (n2 - 1) * (Q2 - auc * auc)) / (n1 * n2));
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

        // Risk Ratio
        const rr = p1 / p2;
        const lnRR = Math.log(rr);
        const seLnRR = Math.sqrt(1 / a - 1 / (a + b) + 1 / c - 1 / (c + d));
        const rrCI = { lower: Math.exp(lnRR - z * seLnRR), upper: Math.exp(lnRR + z * seLnRR) };

        // Odds Ratio
        const or = (a * d) / (b * c);
        const lnOR = Math.log(or);
        const seLnOR = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d);
        const orCI = { lower: Math.exp(lnOR - z * seLnOR), upper: Math.exp(lnOR + z * seLnOR) };

        // Risk Difference
        const rd = p1 - p2;
        const seRD = Math.sqrt(p1 * (1 - p1) / (a + b) + p2 * (1 - p2) / (c + d));
        const rdCI = { lower: rd - z * seRD, upper: rd + z * seRD };

        // Newcombe CI for RD
        const rdNewcombe = newcombeCI(p1, a + b, p2, c + d, z);

        // NNT
        const nnt = rd !== 0 ? 1 / Math.abs(rd) : Infinity;
        const nntCI = rd !== 0 ? {
            lower: rdCI.upper !== 0 ? 1 / Math.abs(rdCI.upper) : Infinity,
            upper: rdCI.lower !== 0 ? 1 / Math.abs(rdCI.lower) : Infinity
        } : { lower: Infinity, upper: Infinity };

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
            rr: { value: rr, ci: rrCI, seLnRR },
            or: { value: or, ci: orCI, seLnOR },
            rd: { value: rd, ci: rdCI, seRD, newcombe: rdNewcombe },
            nnt: { value: rd > 0 ? nnt : -nnt, ci: nntCI, isHarm: rd < 0 },
            chi2, chi2Yates, fisher,
            afExposed, paf,
            counts: { a, b, c, d, n }
        };
    }

    // Fragility index
    function fragilityIndex(a, b, c, d) {
        let fragility = 0;
        let modA = a, modB = b, modC = c, modD = d;
        let currentP = fisherExact(a, b, c, d).pValue;

        if (currentP >= 0.05) return { index: 0, message: 'Result is already non-significant' };

        // Determine which cell to modify (move events from smaller p arm to non-events)
        const p1 = a / (a + b);
        const p2 = c / (c + d);

        while (currentP < 0.05 && fragility < 1000) {
            if (p1 > p2) {
                modA--;
                modB++;
            } else {
                modC--;
                modD++;
            }
            if (modA < 0 || modC < 0) break;
            fragility++;
            currentP = fisherExact(modA, modB, modC, modD).pValue;
        }

        return {
            index: fragility,
            originalP: fisherExact(a, b, c, d).pValue,
            modifiedP: currentP,
            modifiedTable: { a: modA, b: modB, c: modC, d: modD }
        };
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
        // ageRates = [{rate, se, weight}] or [{events, population, standardPop}]
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
