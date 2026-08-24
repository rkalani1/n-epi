/**
 * Neuro-Epi — Biostatistics Reference
 * Quick-reference encyclopedia for common biostatistical concepts, tests,
 * distributions, confidence interval methods, effect sizes, multiple testing,
 * probability distributions gallery, CLT demonstrator, hypothesis testing
 * flowchart, multiple testing corrections calculator, Bayesian vs frequentist.
 */
(function() {
    'use strict';
    const MODULE_ID = 'biostats-reference';

    /* ================================================================
       DATA: Statistical tests
       ================================================================ */

    var STAT_TESTS = [
        { name: 'One-sample z-test', outcome: 'continuous', groups: '1', paired: 'na', parametric: true, when: 'Test whether a population mean equals a hypothesized value when population SD is known and n is large.', assumptions: 'Known population variance; large sample (n>30); approximately normal distribution.', effect: 'Standardized mean difference (z-score).', formula: 'z = (x-bar - mu0) / (sigma / sqrt(n))', interpretation: 'If |z| > 1.96, reject H0 at alpha=0.05. Example: "The mean systolic BP (138 mmHg) was significantly different from the population norm of 130 mmHg (z=2.45, P=0.014)."' },
        { name: 'One-sample t-test', outcome: 'continuous', groups: '1', paired: 'na', parametric: true, when: 'Test whether a sample mean differs from a hypothesized value when population SD is unknown.', assumptions: 'Continuous outcome; approximately normal distribution (robust with n>30); unknown population variance.', effect: "Cohen's d = (x-bar - mu0) / s", formula: 't = (x-bar - mu0) / (s / sqrt(n)), df = n-1', interpretation: 'Example: "The mean NIHSS at discharge (8.2, SD 4.1) was significantly lower than the hypothesized population mean of 10 (t(49) = -3.11, P = 0.003, d = -0.44)."' },
        { name: 'Two-sample t-test (independent)', outcome: 'continuous', groups: '2', paired: 'independent', parametric: true, when: 'Compare means of a continuous outcome between two independent groups.', assumptions: 'Independent observations; continuous outcome; normal distribution in each group (robust with large n); equal variances (use Welch correction if unequal).', effect: "Cohen's d = (x1-bar - x2-bar) / s_pooled", formula: 't = (x1-bar - x2-bar) / sqrt(sp^2 * (1/n1 + 1/n2)), df = n1+n2-2', interpretation: 'Example: "Mean NIHSS improvement was greater in the treatment group (6.2 vs 4.1, mean difference 2.1, 95% CI 0.8-3.4, P=0.002)."' },
        { name: 'Paired t-test', outcome: 'continuous', groups: '2', paired: 'paired', parametric: true, when: 'Compare means of paired/matched continuous measurements (e.g., before-after on same subjects).', assumptions: 'Paired observations; differences are approximately normally distributed; continuous outcome.', effect: "Cohen's d_z = mean_diff / SD_diff", formula: 't = d-bar / (s_d / sqrt(n)), df = n-1', interpretation: 'Example: "NIHSS decreased significantly from admission (14.3) to discharge (8.7), mean change -5.6 (95% CI -7.1 to -4.1, t(39) = -7.42, P<0.001)."' },
        { name: 'One-way ANOVA', outcome: 'continuous', groups: '3+', paired: 'independent', parametric: true, when: 'Compare means across 3 or more independent groups.', assumptions: 'Independent observations; continuous outcome; normal distribution in each group; homogeneity of variances (Levene test).', effect: 'Eta-squared = SS_between / SS_total; partial eta-squared', formula: 'F = MS_between / MS_within, df = (k-1, N-k)', interpretation: 'Example: "NIHSS at 24h differed significantly across the three treatment groups (F(2,147) = 5.83, P = 0.004, eta-sq = 0.073). Post-hoc Tukey tests revealed..."' },
        { name: 'Repeated measures ANOVA', outcome: 'continuous', groups: '3+', paired: 'paired', parametric: true, when: 'Compare means across 3+ time points or conditions for the same subjects.', assumptions: 'Continuous outcome; normality; sphericity (Mauchly test; use Greenhouse-Geisser correction if violated).', effect: 'Partial eta-squared.', formula: 'F = MS_effect / MS_error, with Greenhouse-Geisser or Huynh-Feldt correction if needed', interpretation: 'Example: "NIHSS showed significant change over the 4 assessment time points (F(2.3, 89.7) = 12.4, P<0.001, partial eta-sq = 0.24, Greenhouse-Geisser corrected)."' },
        { name: 'Kruskal-Wallis test', outcome: 'continuous', groups: '3+', paired: 'independent', parametric: false, when: 'Non-parametric alternative to one-way ANOVA. Compare distributions across 3+ independent groups.', assumptions: 'Independent observations; ordinal or continuous outcome; similar distribution shapes (tests for stochastic dominance, not just medians).', effect: 'Epsilon-squared = H / ((n^2-1)/(n+1))', formula: 'H = (12 / (N(N+1))) * sum(R_i^2 / n_i) - 3(N+1), approx Chi-sq with df=k-1', interpretation: 'Example: "Median mRS at 90 days differed significantly across etiologic subtypes (H(3) = 14.2, P = 0.003). Dunn post-hoc tests with Bonferroni correction revealed..."' },
        { name: 'Mann-Whitney U test', outcome: 'continuous', groups: '2', paired: 'independent', parametric: false, when: 'Non-parametric alternative to the independent t-test. Compare distributions of two independent groups.', assumptions: 'Independent observations; ordinal or continuous outcome; similarly shaped distributions for testing medians.', effect: 'Rank-biserial correlation r = 1 - (2U / (n1*n2))', formula: 'U = n1*n2 + n1(n1+1)/2 - R1', interpretation: 'Example: "Median onset-to-treatment time was significantly shorter in the mobile stroke unit group (45 vs 72 min, U = 1234, P = 0.008, r = 0.32)."' },
        { name: 'Wilcoxon signed-rank test', outcome: 'continuous', groups: '2', paired: 'paired', parametric: false, when: 'Non-parametric alternative to the paired t-test. Compare paired observations.', assumptions: 'Paired observations; ordinal or continuous outcome; symmetric distribution of differences.', effect: 'r = Z / sqrt(n)', formula: 'T = min(T+, T-), where T+/T- are sums of positive/negative signed ranks', interpretation: 'Example: "mRS improved significantly from baseline to 90 days (median change -1, IQR -2 to 0, Z = -4.12, P < 0.001, r = 0.46)."' },
        { name: 'Friedman test', outcome: 'continuous', groups: '3+', paired: 'paired', parametric: false, when: 'Non-parametric alternative to repeated measures ANOVA. Compare 3+ related groups.', assumptions: 'Related samples (repeated measures or matched); ordinal or continuous outcome.', effect: "Kendall's W = Chi-sq_F / (n*(k-1))", formula: 'Chi-sq_F = (12 / (nk(k+1))) * sum(R_j^2) - 3n(k+1), df=k-1', interpretation: 'Example: "Pain scores differed significantly across the 4 time points (Chi-sq(3) = 18.7, P < 0.001, W = 0.42). Nemenyi post-hoc tests revealed..."' },
        { name: 'Chi-squared test', outcome: 'binary', groups: '2', paired: 'independent', parametric: false, when: 'Test association between two categorical variables in a contingency table.', assumptions: 'Independent observations; expected cell counts >= 5 in 80% of cells (use Fisher if violated).', effect: "Cramer's V = sqrt(Chi-sq / (n * min(r-1, c-1)))", formula: 'Chi-sq = sum((O-E)^2 / E), df = (r-1)(c-1)', interpretation: 'Example: "The proportion achieving mRS 0-2 was significantly higher in the thrombectomy group (46.0% vs 26.5%, Chi-sq(1) = 12.3, P < 0.001)."' },
        { name: "Fisher's exact test", outcome: 'binary', groups: '2', paired: 'independent', parametric: false, when: 'Test association in a 2x2 table when sample size is small or expected counts are <5.', assumptions: 'Independent observations; fixed marginals; exact probability calculation.', effect: 'Odds ratio from the 2x2 table.', formula: 'P = (a+b)!(c+d)!(a+c)!(b+d)! / (N! a! b! c! d!)', interpretation: 'Example: "sICH occurred in 2/50 (4.0%) treatment vs 0/48 (0%) control patients (Fisher exact P = 0.50)."' },
        { name: "McNemar's test", outcome: 'binary', groups: '2', paired: 'paired', parametric: false, when: 'Test change in a binary outcome for paired data (before-after, matched pairs).', assumptions: 'Paired binary observations; discordant pairs are of primary interest.', effect: 'Odds ratio of discordant pairs = b/c.', formula: 'Chi-sq = (|b-c| - 1)^2 / (b+c), df=1 (with continuity correction)', interpretation: 'Example: "The proportion of patients classified as functionally independent changed significantly from admission to discharge (McNemar Chi-sq = 8.1, P = 0.004)."' },
        { name: 'Cochran-Armitage trend test', outcome: 'binary', groups: '3+', paired: 'independent', parametric: false, when: 'Test for a linear trend in proportions across ordered groups (dose-response).', assumptions: 'Independent observations; ordinal exposure with binary outcome; linear trend assumption.', effect: 'Trend slope estimate.', formula: 'Z_trend = sum(d_i * (x_i - x-bar)) / sqrt(...), one-sided or two-sided', interpretation: 'Example: "There was a significant linear trend of increasing sICH risk with higher blood glucose tertiles (P-trend = 0.003)."' },
        { name: 'Log-rank test', outcome: 'time-to-event', groups: '2', paired: 'independent', parametric: false, when: 'Compare survival distributions between two or more groups.', assumptions: 'Non-informative censoring; survival curves do not cross (most powerful when hazards are proportional).', effect: 'Hazard ratio (from corresponding Cox model).', formula: 'Chi-sq = (sum(O_i - E_i))^2 / sum(V_i), df=k-1', interpretation: 'Example: "Median time to recurrent stroke was longer in the DAPT group (not reached vs 18.4 months, log-rank P = 0.02)."' },
        { name: 'Cox proportional hazards regression', outcome: 'time-to-event', groups: '2', paired: 'independent', parametric: false, when: 'Model the effect of covariates on time-to-event outcomes. Semi-parametric.', assumptions: 'Proportional hazards (constant HR over time); non-informative censoring; correct model specification.', effect: 'Hazard ratio (HR) = exp(beta).', formula: 'h(t|X) = h0(t) * exp(beta1*X1 + ... + betap*Xp)', interpretation: 'Example: "After adjustment for age and NIHSS, thrombectomy was associated with lower hazard of death (HR 0.62, 95% CI 0.44-0.87, P = 0.006)."' },
        { name: 'Logistic regression', outcome: 'binary', groups: '2', paired: 'independent', parametric: true, when: 'Model the relationship between covariates and a binary outcome. Obtain adjusted ORs.', assumptions: 'Binary outcome; independent observations; linearity of log-odds with continuous predictors; no multicollinearity; adequate events per variable (>=10 EPV rule of thumb).', effect: 'Odds ratio = exp(beta).', formula: 'log(p / (1-p)) = beta0 + beta1*X1 + ... + betap*Xp', interpretation: 'Example: "In multivariable logistic regression, diabetes was independently associated with poor outcome (OR 1.82, 95% CI 1.23-2.69, P = 0.003)."' },
        { name: 'Linear regression', outcome: 'continuous', groups: '2', paired: 'independent', parametric: true, when: 'Model the relationship between covariates and a continuous outcome.', assumptions: 'Continuous outcome; linearity; independence of errors; homoscedasticity; normality of residuals; no multicollinearity.', effect: 'Beta coefficient (unstandardized); standardized beta; R-squared.', formula: 'Y = beta0 + beta1*X1 + ... + betap*Xp + epsilon', interpretation: 'Example: "Each 10-year increase in age was associated with a 1.4-point increase in NIHSS at admission (beta = 0.14 per year, 95% CI 0.08-0.20, P < 0.001, R-sq = 0.32)."' },
        { name: 'Poisson regression', outcome: 'count', groups: '2', paired: 'independent', parametric: true, when: 'Model count outcomes or rates. Assumes mean equals variance.', assumptions: 'Count outcome; independence; mean = variance (equidispersion); log-linear relationship; adequate follow-up time.', effect: 'Incidence rate ratio (IRR) = exp(beta).', formula: 'log(mu) = beta0 + beta1*X1 + ... + offset(log(t))', interpretation: 'Example: "The seizure rate was 40% lower in the treatment group (IRR 0.60, 95% CI 0.42-0.86, P = 0.005)."' },
        { name: 'Negative binomial regression', outcome: 'count', groups: '2', paired: 'independent', parametric: true, when: 'Model count outcomes when overdispersion is present (variance > mean).', assumptions: 'Count outcome; independence; overdispersion; gamma-distributed rate parameter.', effect: 'Incidence rate ratio (IRR) = exp(beta).', formula: 'log(mu) = beta0 + beta1*X1 + ... with var(Y) = mu + mu^2/theta', interpretation: 'Example: "After accounting for overdispersion, the number of ED visits was significantly lower in the intervention group (IRR 0.72, 95% CI 0.55-0.94, P = 0.02)."' },
        { name: 'Cochran-Mantel-Haenszel test', outcome: 'binary', groups: '2', paired: 'independent', parametric: false, when: 'Test association between two binary variables while controlling for a stratifying variable.', assumptions: 'Independent observations within strata; homogeneity of ORs across strata (Breslow-Day test).', effect: 'Common odds ratio (Mantel-Haenszel estimator).', formula: 'Chi-sq_MH = (sum(a_i - E(a_i)))^2 / sum(Var(a_i)), df=1', interpretation: 'Example: "After stratifying by study site, the treatment remained significantly associated with the outcome (CMH OR 1.65, 95% CI 1.12-2.43, P = 0.011, Breslow-Day P = 0.45)."' },
        { name: 'Mixed-effects (multilevel) model', outcome: 'continuous', groups: '2', paired: 'independent', parametric: true, when: 'Model hierarchical/clustered data or repeated measures with both fixed and random effects.', assumptions: 'Correct specification of fixed and random effects; normality of random effects and residuals; correct covariance structure.', effect: 'Fixed effects: beta coefficients. Random effects: variance components. ICC.', formula: 'Y_ij = X_ij*beta + Z_ij*u_j + epsilon_ij, u_j ~ N(0, G), epsilon ~ N(0, R)', interpretation: 'Example: "In a mixed-effects model with random intercepts for facility, thrombectomy was associated with lower 90-day NIHSS (beta = -3.2, 95% CI -4.8 to -1.6, P < 0.001). The ICC was 0.08, indicating 8% of variance was between facilities."' }
    ];

    /* ================================================================
       DATA: Probability distributions
       ================================================================ */

    var DISTRIBUTIONS = [
        { name: 'Normal (Gaussian)', params: 'mu (mean), sigma^2 (variance)', mean: 'mu', variance: 'sigma^2', formula: 'f(x) = (1 / (sigma*sqrt(2*pi))) * exp(-(x-mu)^2 / (2*sigma^2))', uses: 'Most biological measurements; basis for t-test, ANOVA, regression; CLT approximation for large samples.' },
        { name: 'Student t', params: 'nu (degrees of freedom)', mean: '0 (for nu>1)', variance: 'nu / (nu-2) for nu>2', formula: 'f(t) = Gamma((nu+1)/2) / (sqrt(nu*pi) * Gamma(nu/2)) * (1 + t^2/nu)^(-(nu+1)/2)', uses: 'Small-sample inference for means; t-tests; confidence intervals when sigma is unknown.' },
        { name: 'Chi-squared', params: 'k (degrees of freedom)', mean: 'k', variance: '2k', formula: 'f(x) = x^(k/2-1) * exp(-x/2) / (2^(k/2) * Gamma(k/2)), x >= 0', uses: 'Goodness-of-fit tests; contingency tables; variance estimation; sum of squared standard normals.' },
        { name: 'F', params: 'd1, d2 (degrees of freedom)', mean: 'd2 / (d2-2) for d2>2', variance: '2*d2^2*(d1+d2-2) / (d1*(d2-2)^2*(d2-4)) for d2>4', formula: 'Ratio of two independent chi-squared variables divided by their df', uses: 'ANOVA F-tests; comparing two variances; regression overall significance tests.' },
        { name: 'Binomial', params: 'n (trials), p (probability)', mean: 'n*p', variance: 'n*p*(1-p)', formula: 'P(X=k) = C(n,k) * p^k * (1-p)^(n-k)', uses: 'Number of successes in fixed number of trials; proportions testing; diagnostic accuracy counts.' },
        { name: 'Poisson', params: 'lambda (rate)', mean: 'lambda', variance: 'lambda', formula: 'P(X=k) = e^(-lambda) * lambda^k / k!', uses: 'Count of rare events in fixed time/space; incidence rates; overdispersion check (mean vs. variance).' },
        { name: 'Negative Binomial', params: 'r (successes), p (probability)', mean: 'r*(1-p)/p', variance: 'r*(1-p)/p^2', formula: 'P(X=k) = C(k+r-1, k) * p^r * (1-p)^k', uses: 'Overdispersed count data (variance > mean); number of failures before r-th success; ED visits, seizure counts.' },
        { name: 'Exponential', params: 'lambda (rate)', mean: '1/lambda', variance: '1/lambda^2', formula: 'f(x) = lambda * exp(-lambda*x), x >= 0', uses: 'Time between events; constant hazard survival model; memoryless property; waiting times.' },
        { name: 'Weibull', params: 'lambda (scale), k (shape)', mean: 'lambda * Gamma(1 + 1/k)', variance: 'lambda^2 * [Gamma(1+2/k) - (Gamma(1+1/k))^2]', formula: 'f(x) = (k/lambda) * (x/lambda)^(k-1) * exp(-(x/lambda)^k)', uses: 'Flexible survival modeling; k<1 decreasing hazard, k=1 constant (exponential), k>1 increasing hazard; reliability analysis.' },
        { name: 'Beta', params: 'alpha, beta (shape parameters)', mean: 'alpha / (alpha+beta)', variance: 'alpha*beta / ((alpha+beta)^2 * (alpha+beta+1))', formula: 'f(x) = x^(alpha-1) * (1-x)^(beta-1) / B(alpha,beta), 0<=x<=1', uses: 'Prior distribution for probabilities (Bayesian); modeling proportions; meta-analysis heterogeneity priors.' },
        { name: 'Gamma', params: 'alpha (shape), beta (rate)', mean: 'alpha/beta', variance: 'alpha/beta^2', formula: 'f(x) = beta^alpha * x^(alpha-1) * exp(-beta*x) / Gamma(alpha), x >= 0', uses: 'Waiting times (sum of exponentials); Bayesian priors for precision; modeling right-skewed positive data.' },
        { name: 'Uniform', params: 'a (min), b (max)', mean: '(a+b)/2', variance: '(b-a)^2 / 12', formula: 'f(x) = 1/(b-a), a <= x <= b', uses: 'Non-informative prior (Bayesian); random number generation; null model for tests of randomness.' },
        { name: 'Bernoulli', params: 'p (probability of success)', mean: 'p', variance: 'p*(1-p)', formula: 'P(X=k) = p^k * (1-p)^(1-k), k in {0,1}', uses: 'Single binary trial; building block for binomial; logistic regression underlying distribution.' },
        { name: 'Hypergeometric', params: 'N (pop), K (successes in pop), n (draws)', mean: 'n*K/N', variance: 'n*(K/N)*(1-K/N)*(N-n)/(N-1)', formula: 'P(X=k) = C(K,k)*C(N-K,n-k) / C(N,n)', uses: "Fisher's exact test; sampling without replacement; enrichment analysis in genomics." }
    ];

    /* ================================================================
       DATA: CI methods
       ================================================================ */

    var CI_METHODS = [
        { name: 'Wald', formula: 'p-hat +/- z * sqrt(p-hat*(1-p-hat)/n)', when: 'Quick approximation for proportions when n is large and p is not near 0 or 1.', assumptions: 'Large sample; normal approximation to binomial; performs poorly when p is near 0 or 1 or n is small.' },
        { name: 'Wilson (score)', formula: '(p-hat + z^2/(2n) +/- z*sqrt(p-hat*(1-p-hat)/n + z^2/(4n^2))) / (1 + z^2/n)', when: 'Recommended default for single proportions. Better coverage than Wald, especially for small n or extreme p.', assumptions: 'Binomial data; outperforms Wald across all sample sizes; recommended by Agresti and others.' },
        { name: 'Clopper-Pearson (exact)', formula: 'Based on inverting two one-sided binomial tests: Beta(x, n-x+1) and Beta(x+1, n-x)', when: 'Conservative exact interval. Guarantees >= nominal coverage. Required by some regulatory agencies.', assumptions: 'Binomial data; exact method; tends to be wider than necessary (conservative).' },
        { name: 'Agresti-Coull', formula: 'Add z^2/2 pseudo-successes and failures: p-tilde = (x + z^2/2) / (n + z^2), then Wald formula with p-tilde', when: 'Simple, well-performing alternative to Wald. The "add 2 successes, 2 failures" rule for 95% CI.', assumptions: 'Binomial data; approximately the same as Wilson; very easy to compute by hand.' },
        { name: 'Newcombe (hybrid score)', formula: 'Based on Wilson intervals for each proportion, combined using Newcombe method for the difference', when: 'Confidence interval for the difference between two independent proportions. Outperforms Wald for differences.', assumptions: 'Two independent binomial samples; accounts for asymmetry near 0 and 1.' },
        { name: 'Log-rate (Poisson)', formula: 'exp(ln(rate) +/- z / sqrt(events))', when: 'CI for an incidence rate based on Poisson count data.', assumptions: 'Events follow Poisson distribution; rate = events / person-time; log-transformation for symmetry.' },
        { name: 'Exact Poisson', formula: 'Based on Chi-squared percentiles: (Chi-sq(2x, alpha/2) / (2T), Chi-sq(2(x+1), 1-alpha/2) / (2T))', when: 'Exact CI for Poisson rate. Preferred when event count is small.', assumptions: 'Poisson-distributed counts; exact method; conservative like Clopper-Pearson.' },
        { name: 'Profile likelihood', formula: 'Set of parameter values where -2*log(L/L_max) <= Chi-sq(1, 1-alpha)', when: 'General-purpose CI based on the likelihood function. Works for any parametric model.', assumptions: 'Correctly specified parametric model; asymptotic chi-squared distribution of likelihood ratio.' }
    ];

    /* ================================================================
       DATA: Effect size benchmarks
       ================================================================ */

    var EFFECT_SIZES = [
        { measure: "Cohen's d", small: '0.2', medium: '0.5', large: '0.8', notes: 'Standardized mean difference. d = (M1-M2)/SD_pooled. Most widely used benchmark (Cohen, 1988). Context-dependent: a "small" effect can be highly clinically meaningful.' },
        { measure: 'Odds Ratio (OR)', small: '1.4 (or 0.69)', medium: '2.5 (or 0.40)', large: '4.3 (or 0.23)', notes: 'Derived from Cohen d via OR = exp(pi*d/sqrt(3)). These benchmarks are approximate conversions; Chen et al. (2010) give higher equivalents (1.68/3.47/6.71) at low baseline risk.' },
        { measure: 'Risk Ratio (RR)', small: '~1.2 (or ~0.83)', medium: '~1.9 (or ~0.53)', large: '~3.0 (or ~0.33)', notes: 'Depends on baseline risk. Approximations assume moderate baseline risk (~20-30%).' },
        { measure: 'Number Needed to Treat (NNT)', small: '>10', medium: '4-10', large: '<4', notes: 'NNT = 1/ARD. Lower is stronger effect. Context-dependent: NNT of 20 may be excellent for mortality prevention.' },
        { measure: 'Correlation (r)', small: '0.10', medium: '0.30', large: '0.50', notes: 'Pearson or Spearman. r^2 gives proportion of variance explained. r=0.30 explains ~9% of variance.' },
        { measure: 'Eta-squared (eta^2)', small: '0.01', medium: '0.06', large: '0.14', notes: 'Proportion of total variance explained by factor in ANOVA. Analogous to R^2. Tends to overestimate in small samples.' },
        { measure: 'Partial eta-squared', small: '0.01', medium: '0.06', large: '0.14', notes: 'Proportion of variance explained by a factor after removing other factors. More commonly reported than eta-squared in factorial ANOVA.' },
        { measure: 'R-squared', small: '0.02', medium: '0.13', large: '0.26', notes: 'Proportion of variance in outcome explained by the model. Benchmarks follow Cohen (1988) f^2 = 0.02/0.15/0.35 via R^2 = f^2/(1+f^2). Context-dependent: R^2=0.15 may be excellent for predicting human behavior.' },
        { measure: "Cramer's V", small: '0.10', medium: '0.30', large: '0.50', notes: 'Effect size for chi-squared tests. V = sqrt(chi^2 / (n * min(r-1, c-1))). Range: 0 to 1.' },
        { measure: "Cohen's w", small: '0.10', medium: '0.30', large: '0.50', notes: 'Effect size for chi-squared goodness-of-fit. w = sqrt(sum((P0-P1)^2/P0)).' },
        { measure: "Cohen's f", small: '0.10', medium: '0.25', large: '0.40', notes: 'Effect size for ANOVA. f = sqrt(eta^2 / (1-eta^2)). Related to eta-squared.' }
    ];

    /* ================================================================
       DATA: Multiple testing methods
       ================================================================ */

    var MULTIPLE_TESTING = [
        { name: 'Bonferroni', type: 'FWER', conservative: 'Yes (most conservative)', when: 'Simple, widely understood. Use when: few comparisons; need strict type I error control; comparisons are independent or positively correlated.' },
        { name: 'Holm (step-down)', type: 'FWER', conservative: 'Less than Bonferroni', when: 'Uniformly more powerful than Bonferroni with same FWER control. Preferred over Bonferroni in almost all situations. Order p-values and compare to alpha/(m-k+1).' },
        { name: 'Hochberg (step-up)', type: 'FWER', conservative: 'Less than Holm', when: 'Slightly more powerful than Holm. Requires independence or positive dependence of test statistics. Order p-values and work from largest to smallest.' },
        { name: 'Benjamini-Hochberg (BH)', type: 'FDR', conservative: 'No (controls FDR, not FWER)', when: 'Controls the expected proportion of false discoveries. Preferred for large-scale testing (genomics, imaging). More powerful than FWER methods. Order p-values and compare to (k/m)*alpha.' },
        { name: 'Sidak', type: 'FWER', conservative: 'Slightly less than Bonferroni', when: 'Similar to Bonferroni but slightly less conservative. Exact for independent tests: alpha_adj = 1 - (1-alpha)^(1/m). Use when tests are independent.' },
        { name: 'Tukey HSD', type: 'FWER (pairwise)', conservative: 'Moderate', when: 'Specifically for all pairwise comparisons after significant ANOVA. Controls FWER for pairwise differences. Based on the studentized range distribution.' },
        { name: 'Dunnett', type: 'FWER (vs. control)', conservative: 'Moderate', when: 'Comparing multiple treatment groups against a single control. More powerful than Bonferroni for this specific pattern. Common in dose-finding studies.' },
        { name: 'Benjamini-Yekutieli (BY)', type: 'FDR', conservative: 'More than BH', when: 'Controls FDR under arbitrary dependence. Use when test statistics may be negatively correlated. More conservative than BH but more broadly applicable.' }
    ];

    /* ================================================================
       RENDER
       ================================================================ */

    function renderLearnSection() {
        var html = '<div class="card" style="background: var(--bg-secondary); border-left: 4px solid var(--accent-color);">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\')">&#x1F4DA; Learn &amp; Reference <span style="font-size:0.8em; color: var(--text-muted);">(click to expand)</span></div>';
        html += '<div class="learn-body hidden">';

        html += '<div class="card-subtitle" style="font-weight:600;">Fundamental Concepts</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Type I error (&alpha;):</strong> False positive &mdash; rejecting H&#8320; when it is true. Conventionally set at 0.05.</li>'
            + '<li><strong>Type II error (&beta;):</strong> False negative &mdash; failing to reject H&#8320; when it is false.</li>'
            + '<li><strong>Power = 1 &minus; &beta;:</strong> Probability of correctly detecting a true effect. Typically 0.80 or 0.90.</li>'
            + '<li><strong>p-value:</strong> P(observed data or more extreme | H&#8320; is true). It is NOT the probability that H&#8320; is true.</li>'
            + '<li><strong>Confidence interval:</strong> A range of values that, across repeated sampling, would contain the true parameter (1&minus;&alpha;)% of the time. It does NOT mean there is a 95% probability the true value lies within this specific interval.</li>'
            + '<li><strong>Central Limit Theorem:</strong> As sample size increases, the sampling distribution of the mean approaches a normal distribution regardless of the shape of the population distribution. This is why many parametric tests are robust with large n.</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Test Selection Logic</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Continuous outcome:</strong> t-test (2 groups), ANOVA (3+ groups), linear regression (adjusted)</li>'
            + '<li><strong>Binary outcome:</strong> Chi-squared / Fisher exact (unadjusted), logistic regression (adjusted)</li>'
            + '<li><strong>Time-to-event outcome:</strong> Log-rank test (unadjusted), Cox proportional hazards (adjusted)</li>'
            + '<li><strong>Paired data:</strong> Paired t-test (parametric), McNemar test (binary), Wilcoxon signed-rank (non-parametric)</li>'
            + '<li><strong>Non-parametric alternatives:</strong> Mann-Whitney U (2 groups), Kruskal-Wallis (3+ groups), Friedman (repeated measures)</li>'
            + '<li><strong>Count data:</strong> Poisson regression (mean = variance), negative binomial (overdispersed)</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Bayesian vs Frequentist</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Frequentist:</strong> Parameters are fixed but unknown. Probability is long-run frequency. Makes no probabilistic statements about parameters, only about data.</li>'
            + '<li><strong>Bayesian:</strong> Parameters are random variables with distributions. Uses prior information updated by data (via Bayes theorem) to produce posterior distributions.</li>'
            + '<li><strong>Key difference:</strong> A 95% credible interval (Bayesian) means "there is a 95% probability the parameter lies in this range given the data." A 95% CI (frequentist) means "in repeated sampling, 95% of such intervals would contain the true value."</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Common Pitfalls</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Multiple testing inflation:</strong> With 20 tests at &alpha;=0.05, expect 1 false positive by chance. Apply Bonferroni, Holm, or BH correction.</li>'
            + '<li><strong>P-hacking:</strong> Selective reporting, optional stopping, or outcome switching to achieve significance. Pre-register analyses.</li>'
            + '<li><strong>Statistical vs. clinical significance:</strong> A statistically significant result (p&lt;0.05) may be clinically trivial. Always report effect sizes and confidence intervals.</li>'
            + '<li><strong>Non-significant &ne; &ldquo;no effect&rdquo;:</strong> Absence of evidence is not evidence of absence. A non-significant result may reflect inadequate power, not a true null effect.</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px; font-size:0.85rem; line-height:1.7;">'
            + '<li>Altman DG. <em>Practical Statistics for Medical Research</em>. Chapman &amp; Hall/CRC, 1991.</li>'
            + '<li>Bland M. <em>An Introduction to Medical Statistics</em>, 4th ed. Oxford University Press, 2015.</li>'
            + '<li>Vittinghoff E, Glidden DV, Shiboski SC, McCulloch CE. <em>Regression Methods in Biostatistics</em>, 2nd ed. Springer, 2012.</li>'
            + '<li>Gelman A, Carlin JB, Stern HS, et al. <em>Bayesian Data Analysis</em>, 3rd ed. Chapman &amp; Hall/CRC, 2013.</li>'
            + '</ul>';

        html += '</div></div>';
        return html;
    }

    function renderTestSelector() {
        var html = '<div class="card">';
        html += '<div class="card-title">Statistical Test Selector</div>';
        html += '<div class="card-subtitle">Answer the questions below to find the appropriate statistical test. Covers 20+ common tests with assumptions, formulas, and interpretation examples.</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Outcome Variable Type ' + App.tooltip('What type of data is your dependent variable?') + '</label>';
        html += '<select class="form-select" id="br_outcome" name="br_outcome">';
        html += '<option value="">-- Select --</option>';
        html += '<option value="binary">Binary (yes/no, event/no event)</option>';
        html += '<option value="continuous">Continuous (means, scores)</option>';
        html += '<option value="ordinal">Ordinal (ranked categories, e.g., mRS)</option>';
        html += '<option value="time-to-event">Time-to-Event (survival)</option>';
        html += '<option value="count">Count (number of events)</option>';
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Number of Groups</label>';
        html += '<select class="form-select" id="br_groups" name="br_groups">';
        html += '<option value="">-- Select --</option>';
        html += '<option value="1">1 (one-sample test)</option>';
        html += '<option value="2">2 groups</option>';
        html += '<option value="3+">3 or more groups</option>';
        html += '</select></div>';
        html += '</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Paired or Independent?</label>';
        html += '<select class="form-select" id="br_paired" name="br_paired">';
        html += '<option value="">-- Select --</option>';
        html += '<option value="independent">Independent (different subjects in each group)</option>';
        html += '<option value="paired">Paired/Matched (same subjects, before-after, matched)</option>';
        html += '<option value="na">Not applicable (one-sample or survival)</option>';
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Parametric Assumptions Met? ' + App.tooltip('Normal distribution, equal variances. If unsure, select No for a non-parametric alternative.') + '</label>';
        html += '<select class="form-select" id="br_parametric" name="br_parametric">';
        html += '<option value="">-- Select --</option>';
        html += '<option value="yes">Yes (normality, homoscedasticity satisfied)</option>';
        html += '<option value="no">No (non-parametric preferred)</option>';
        html += '</select></div>';
        html += '</div>';

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-primary" onclick="BiostatRef.findTest()">Find Recommended Test</button>';
        html += '<button class="btn btn-secondary" onclick="BiostatRef.showAllTests()">Show All Tests</button>';
        html += '</div>';

        html += '<div id="br-test-results"></div>';
        html += '</div>';
        return html;
    }

    function renderDistributionsGallery() {
        var html = '<div class="card">';
        html += '<div class="card-title">Probability Distributions Gallery</div>';
        html += '<div class="card-subtitle">Interactive exploration of common probability distributions with parameter adjustments.</div>';

        // Interactive distribution explorer
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Distribution</label>';
        html += '<select class="form-select" id="br_dist_select" onchange="BiostatRef.showDistribution()">';
        html += '<option value="normal">Normal (Gaussian)</option>';
        html += '<option value="t">Student t</option>';
        html += '<option value="chi2">Chi-squared</option>';
        html += '<option value="f">F distribution</option>';
        html += '<option value="poisson">Poisson</option>';
        html += '<option value="binomial">Binomial</option>';
        html += '</select></div>';
        html += '<div class="form-group"><label class="form-label">Parameter 1</label>';
        html += '<input type="number" class="form-input" id="br_dist_p1" value="0" step="0.5" onchange="BiostatRef.showDistribution()"></div>';
        html += '<div class="form-group"><label class="form-label">Parameter 2</label>';
        html += '<input type="number" class="form-input" id="br_dist_p2" value="1" step="0.5" onchange="BiostatRef.showDistribution()"></div>';
        html += '</div>';
        html += '<div id="br-dist-info"></div>';
        html += '<div id="br-dist-visual" style="margin-top:12px;"></div>';

        // Full reference table
        html += '<div class="card-subtitle mt-2">Full Distribution Reference</div>';
        html += '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr><th>Distribution</th><th>Parameters</th><th>Mean</th><th>Variance</th><th>PDF / PMF</th><th>Common Uses</th></tr></thead>';
        html += '<tbody>';

        for (var d = 0; d < DISTRIBUTIONS.length; d++) {
            var dist = DISTRIBUTIONS[d];
            html += '<tr>';
            html += '<td><strong>' + dist.name + '</strong></td>';
            html += '<td style="font-size:0.82rem">' + dist.params + '</td>';
            html += '<td style="font-size:0.82rem;font-family:monospace">' + dist.mean + '</td>';
            html += '<td style="font-size:0.82rem;font-family:monospace">' + dist.variance + '</td>';
            html += '<td style="font-size:0.78rem;font-family:monospace">' + dist.formula + '</td>';
            html += '<td style="font-size:0.82rem">' + dist.uses + '</td>';
            html += '</tr>';
        }

        html += '</tbody></table>';
        html += '</div>';
        html += '</div>';
        return html;
    }

    function renderCIMethods() {
        var html = '<div class="card">';
        html += '<div class="card-title">Confidence Interval Methods</div>';
        html += '<div class="card-subtitle">Reference for CI construction methods for proportions and rates. Includes an interactive calculator.</div>';

        html += '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr><th>Method</th><th>Formula / Approach</th><th>When to Use</th><th>Assumptions / Notes</th></tr></thead>';
        html += '<tbody>';

        for (var c = 0; c < CI_METHODS.length; c++) {
            var ci = CI_METHODS[c];
            html += '<tr>';
            html += '<td><strong>' + ci.name + '</strong></td>';
            html += '<td style="font-size:0.8rem;font-family:monospace">' + ci.formula + '</td>';
            html += '<td style="font-size:0.82rem">' + ci.when + '</td>';
            html += '<td style="font-size:0.82rem">' + ci.assumptions + '</td>';
            html += '</tr>';
        }

        html += '</tbody></table>';
        html += '</div>';

        // CI Calculator
        html += '<div class="card-subtitle mt-2">Interactive CI Calculator for a Single Proportion</div>';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">Successes (x)</label>';
        html += '<input type="number" class="form-input" id="br_ci_x" name="br_ci_x" value="23" min="0"></div>';
        html += '<div class="form-group"><label class="form-label">Total (n)</label>';
        html += '<input type="number" class="form-input" id="br_ci_n" name="br_ci_n" value="100" min="1"></div>';
        html += '<div class="form-group"><label class="form-label">Confidence Level</label>';
        html += '<select class="form-select" id="br_ci_level" name="br_ci_level">';
        html += '<option value="0.95" selected>95%</option>';
        html += '<option value="0.90">90%</option>';
        html += '<option value="0.99">99%</option>';
        html += '</select></div>';
        html += '<div class="form-group"><label class="form-label">&nbsp;</label>';
        html += '<button class="btn btn-primary" onclick="BiostatRef.calcCI()" style="width:100%">Calculate CIs</button></div>';
        html += '</div>';

        html += '<div id="br-ci-results"></div>';
        html += '</div>';
        return html;
    }

    function renderEffectSizes() {
        var html = '<div class="card">';
        html += '<div class="card-title">Effect Size Interpretation Guide</div>';
        html += '<div class="card-subtitle">Conventional benchmarks for interpreting effect sizes. Note: These are rules of thumb -- clinical context always determines meaningfulness.</div>';

        html += '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr><th>Measure</th><th>Small</th><th>Medium</th><th>Large</th><th>Notes</th></tr></thead>';
        html += '<tbody>';

        for (var e = 0; e < EFFECT_SIZES.length; e++) {
            var es = EFFECT_SIZES[e];
            html += '<tr>';
            html += '<td><strong>' + es.measure + '</strong></td>';
            html += '<td style="text-align:center">' + es.small + '</td>';
            html += '<td style="text-align:center">' + es.medium + '</td>';
            html += '<td style="text-align:center">' + es.large + '</td>';
            html += '<td style="font-size:0.82rem">' + es.notes + '</td>';
            html += '</tr>';
        }

        html += '</tbody></table>';
        html += '</div>';

        html += '<div class="result-panel mt-2">';
        html += '<div class="card-subtitle">Important Caveats About Effect Size Benchmarks</div>';
        html += '<div style="font-size:0.85rem;line-height:1.8">';
        html += '<strong>1. Context is paramount:</strong> A "small" effect (d=0.2) may be clinically transformative if the outcome is mortality. Conversely, a "large" effect on a surrogate endpoint may be clinically irrelevant.<br>';
        html += '<strong>2. Minimal clinically important difference (MCID):</strong> Use the MCID for the specific outcome measure rather than generic benchmarks whenever possible.<br>';
        html += '<strong>3. Distribution-based vs. anchor-based:</strong> Distribution-based thresholds (like Cohen\'s d) should be supplemented with anchor-based MCIDs tied to patient-perceived change.<br>';
        html += '<strong>4. Confidence intervals matter:</strong> Always report the CI for effect sizes, not just point estimates. A "large" effect with a wide CI spanning zero is not clinically useful.<br>';
        html += '<strong>5. NNT context:</strong> NNT of 10 for preventing death is excellent; NNT of 10 for preventing mild headache may not justify treatment costs or risks.<br>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        return html;
    }

    function renderMultipleTesting() {
        var html = '<div class="card">';
        html += '<div class="card-title">Multiple Testing &amp; P-value Reference</div>';
        html += '<div class="card-subtitle">Methods for controlling the family-wise error rate (FWER) or false discovery rate (FDR) when performing multiple comparisons.</div>';

        // P-value interpretation
        html += '<div class="result-panel mb-1">';
        html += '<div class="card-subtitle">What a P-Value IS and IS NOT</div>';
        html += '<div style="font-size:0.85rem;line-height:1.8">';
        html += '<strong>A p-value IS:</strong> The probability of observing data at least as extreme as the observed data, assuming the null hypothesis is true.<br>';
        html += '<strong>A p-value IS NOT:</strong><br>';
        html += '&bull; The probability that the null hypothesis is true (this requires Bayesian inference)<br>';
        html += '&bull; The probability that the result is due to chance<br>';
        html += '&bull; A measure of effect size or clinical importance<br>';
        html += '&bull; Binary (significant vs. not): treat as a continuous measure of evidence strength<br>';
        html += '<strong>ASA Statement (2016):</strong> "Statistical significance is not equivalent to scientific, human, or economic significance." Report effect sizes with confidence intervals alongside p-values.<br>';
        html += '</div>';
        html += '</div>';

        html += '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr><th>Method</th><th>Controls</th><th>Conservative?</th><th>When to Use</th></tr></thead>';
        html += '<tbody>';

        for (var mt = 0; mt < MULTIPLE_TESTING.length; mt++) {
            var m = MULTIPLE_TESTING[mt];
            var typeColor = m.type === 'FWER' ? 'var(--accent)' : '#e15759';
            html += '<tr>';
            html += '<td><strong>' + m.name + '</strong></td>';
            html += '<td><span style="color:' + typeColor + ';font-weight:600">' + m.type + '</span></td>';
            html += '<td>' + m.conservative + '</td>';
            html += '<td style="font-size:0.82rem">' + m.when + '</td>';
            html += '</tr>';
        }

        html += '</tbody></table>';
        html += '</div>';

        // Interactive multiple testing adjustment
        html += '<div class="card-subtitle mt-2">P-Value Adjustment Calculator</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">P-values (comma-separated)</label>';
        html += '<input type="text" class="form-input" id="br_pvals" name="br_pvals" value="0.01, 0.04, 0.03, 0.08, 0.005" placeholder="e.g., 0.01, 0.04, 0.03"></div>';
        html += '<div class="form-group"><label class="form-label">Alpha Level</label>';
        html += '<input type="number" class="form-input" id="br_alpha" name="br_alpha" value="0.05" step="0.01" min="0.001" max="0.20"></div>';
        html += '<div class="form-group"><label class="form-label">&nbsp;</label>';
        html += '<button class="btn btn-primary" onclick="BiostatRef.adjustPvals()" style="width:100%">Apply Adjustments</button></div>';
        html += '</div>';

        html += '<div id="br-pval-results"></div>';

        // Key definitions
        html += '<div class="result-panel mt-2">';
        html += '<div class="card-subtitle">Key Definitions</div>';
        html += '<div style="font-size:0.85rem;line-height:1.8">';
        html += '<strong>FWER (Family-Wise Error Rate):</strong> Probability of making at least one Type I error among all tests. Controls the chance of ANY false positive. Stricter.<br>';
        html += '<strong>FDR (False Discovery Rate):</strong> Expected proportion of rejected hypotheses that are false positives. Controls the RATE of false positives among discoveries. More powerful for large-scale testing.<br>';
        html += '<strong>Per-comparison error rate:</strong> The unadjusted alpha for each individual test. With m=20 tests at alpha=0.05, the expected number of false positives under the global null is 1.0.<br>';
        html += '<strong>When to choose:</strong> FWER for confirmatory analysis with few pre-specified comparisons (clinical trial primary outcomes). FDR for exploratory analysis with many tests (genomics, neuroimaging).<br>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        return html;
    }

    function render(container) {
        var html = App.createModuleLayout(
            'Biostatistics Reference',
            'Quick-reference encyclopedia for statistical tests, distributions, confidence intervals, effect sizes, and multiple testing corrections.'
        );

        html += renderLearnSection();
        html += renderTestSelector();
        html += renderDistributionsGallery();
        html += renderCLTDemonstrator();
        html += renderHypothesisFlowchart();
        html += renderCIMethods();
        html += renderEffectSizes();
        html += renderMultipleTesting();
        html += renderBayesianComparison();

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);

        // Initialize distribution display
        setTimeout(function() { showDistribution(); }, 100);
    }

    /* ================================================================
       CLT DEMONSTRATOR
       ================================================================ */

    function renderCLTDemonstrator() {
        var html = '<div class="card">';
        html += '<div class="card-title">Central Limit Theorem Demonstrator</div>';
        html += '<div class="card-subtitle">Explore how the sampling distribution of the mean approaches normality as sample size increases, regardless of the population distribution.</div>';

        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Population Distribution</label>';
        html += '<select class="form-select" id="br_clt_dist">';
        html += '<option value="uniform">Uniform (flat)</option>';
        html += '<option value="exponential">Exponential (right-skewed)</option>';
        html += '<option value="bimodal">Bimodal (two peaks)</option>';
        html += '<option value="normal">Normal (already normal)</option>';
        html += '</select></div>';
        html += '<div class="form-group"><label class="form-label">Sample Size (n)</label>';
        html += '<select class="form-select" id="br_clt_n">';
        html += '<option value="1">n = 1</option>';
        html += '<option value="5">n = 5</option>';
        html += '<option value="10">n = 10</option>';
        html += '<option value="30" selected>n = 30</option>';
        html += '<option value="100">n = 100</option>';
        html += '</select></div>';
        html += '<div class="form-group"><label class="form-label">Number of Samples</label>';
        html += '<select class="form-select" id="br_clt_reps">';
        html += '<option value="100">100 samples</option>';
        html += '<option value="500">500 samples</option>';
        html += '<option value="1000" selected>1000 samples</option>';
        html += '<option value="5000">5000 samples</option>';
        html += '</select></div>';
        html += '</div>';

        html += '<div class="btn-group"><button class="btn btn-primary" onclick="BiostatRef.runCLT()">Simulate</button></div>';
        html += '<div id="br-clt-results"></div>';

        html += '<div style="background:var(--bg-tertiary);border-radius:8px;padding:12px;margin-top:12px;font-size:0.85rem;line-height:1.7;">';
        html += '<strong>Why CLT matters:</strong> The Central Limit Theorem is the reason t-tests and ANOVA work even when individual observations are not normally distributed. '
            + 'With n >= 30, the sampling distribution of the mean is approximately normal for most population shapes. '
            + 'For highly skewed distributions, larger n may be needed (n >= 50 or more). '
            + 'CLT does NOT say the data become normal -- it says the <em>distribution of sample means</em> becomes normal.';
        html += '</div>';

        html += '</div>';
        return html;
    }

    function runCLT() {
        var distType = document.getElementById('br_clt_dist').value;
        var n = parseInt(document.getElementById('br_clt_n').value);
        var reps = parseInt(document.getElementById('br_clt_reps').value);

        // Generate sample means
        var means = [];
        for (var r = 0; r < reps; r++) {
            var sum = 0;
            for (var i = 0; i < n; i++) {
                sum += generateFromDist(distType);
            }
            means.push(sum / n);
        }

        // Calculate statistics
        var grandMean = means.reduce(function(a, b) { return a + b; }, 0) / means.length;
        var variance = means.reduce(function(a, b) { return a + (b - grandMean) * (b - grandMean); }, 0) / (means.length - 1);
        var sd = Math.sqrt(variance);

        // Build histogram (text-based)
        var min = Math.min.apply(null, means);
        var max = Math.max.apply(null, means);
        var bins = 20;
        var binWidth = (max - min) / bins;
        var counts = new Array(bins).fill(0);
        for (var m = 0; m < means.length; m++) {
            var bin = Math.min(Math.floor((means[m] - min) / binWidth), bins - 1);
            counts[bin]++;
        }
        var maxCount = Math.max.apply(null, counts);

        var html = '<div class="result-panel mt-2">';
        html += '<div class="card-title">CLT Simulation Results</div>';
        html += '<div class="form-row form-row--4">';
        html += '<div class="result-value">' + grandMean.toFixed(3) + '<div class="result-label">Mean of Means</div></div>';
        html += '<div class="result-value">' + sd.toFixed(3) + '<div class="result-label">SD of Means (SE)</div></div>';
        html += '<div class="result-value">' + n + '<div class="result-label">Sample Size</div></div>';
        html += '<div class="result-value">' + reps + '<div class="result-label">Samples Drawn</div></div>';
        html += '</div>';

        // Text histogram
        html += '<div style="font-family:monospace;font-size:0.78rem;line-height:1.3;margin-top:12px;background:var(--bg-primary);border:1px solid var(--border);padding:12px;border-radius:8px;overflow-x:auto;">';
        html += '<div style="margin-bottom:6px;font-weight:600;">Distribution of ' + reps + ' sample means (n=' + n + '):</div>';
        for (var b = 0; b < bins; b++) {
            var barLen = Math.round((counts[b] / maxCount) * 40);
            var label = (min + b * binWidth).toFixed(2);
            var bar = '';
            for (var bl = 0; bl < barLen; bl++) bar += '#';
            html += label + ' | ' + bar + ' (' + counts[b] + ')\n';
        }
        html += '</div>';

        html += '<div class="result-detail mt-1" style="font-size:0.88rem;">';
        if (n >= 30) {
            html += 'With n = ' + n + ', the sampling distribution of the mean is approximately <strong>normal</strong> (CLT in action), '
                + 'even though the population distribution is ' + distType + '.';
        } else if (n >= 10) {
            html += 'With n = ' + n + ', the sampling distribution is approaching normality but may still show some skew from the ' + distType + ' population.';
        } else {
            html += 'With n = ' + n + ', the sampling distribution still reflects the shape of the ' + distType + ' population. Larger n is needed for CLT to produce approximate normality.';
        }
        html += '</div>';

        html += '</div>';
        App.setTrustedHTML(document.getElementById('br-clt-results'), html);
    }

    function generateFromDist(type) {
        if (type === 'uniform') {
            return Math.random() * 10;
        } else if (type === 'exponential') {
            return -Math.log(1 - Math.random()) * 2;
        } else if (type === 'bimodal') {
            return Math.random() < 0.5 ? (2 + (Math.random() - 0.5)) : (8 + (Math.random() - 0.5));
        } else {
            // Box-Muller for normal
            var u1 = Math.random();
            var u2 = Math.random();
            return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * 1 + 5;
        }
    }

    /* ================================================================
       HYPOTHESIS TESTING DECISION FLOWCHART
       ================================================================ */

    function renderHypothesisFlowchart() {
        var html = '<div class="card">';
        html += '<div class="card-title">Hypothesis Testing Decision Flowchart</div>';
        html += '<div class="card-subtitle">Follow this decision tree to determine the correct hypothesis testing approach for your research question.</div>';

        html += '<div style="font-family:monospace;font-size:0.82rem;line-height:1.5;background:var(--bg-primary);border:1px solid var(--border);padding:16px;border-radius:8px;overflow-x:auto;white-space:pre;">';
        html += 'What is your research question?\n';
        html += '|\n';
        html += '|-- Compare GROUPS on an outcome?\n';
        html += '|   |\n';
        html += '|   |-- How many groups?\n';
        html += '|   |   |-- 1 group vs. known value --> One-sample t-test (or z-test)\n';
        html += '|   |   |-- 2 groups\n';
        html += '|   |   |   |-- Independent? --> t-test / Mann-Whitney U\n';
        html += '|   |   |   |-- Paired?      --> Paired t-test / Wilcoxon signed-rank\n';
        html += '|   |   |-- 3+ groups\n';
        html += '|   |       |-- Independent? --> ANOVA / Kruskal-Wallis\n';
        html += '|   |       |-- Repeated?    --> RM-ANOVA / Friedman\n';
        html += '|   |\n';
        html += '|   |-- What type of outcome?\n';
        html += '|       |-- Continuous   --> t-test, ANOVA, Mann-Whitney, Kruskal-Wallis\n';
        html += '|       |-- Binary       --> Chi-squared, Fisher exact, McNemar\n';
        html += '|       |-- Time-to-event --> Log-rank, Cox regression\n';
        html += '|       |-- Count        --> Poisson or negative binomial regression\n';
        html += '|\n';
        html += '|-- Assess ASSOCIATION between variables?\n';
        html += '|   |-- Both continuous --> Pearson r (parametric), Spearman rho\n';
        html += '|   |-- Both categorical --> Chi-squared, Cramer V\n';
        html += '|   |-- Mixed           --> Point-biserial r, logistic regression\n';
        html += '|\n';
        html += '|-- PREDICT an outcome from predictors?\n';
        html += '|   |-- Continuous outcome --> Linear regression\n';
        html += '|   |-- Binary outcome     --> Logistic regression\n';
        html += '|   |-- Time-to-event      --> Cox regression\n';
        html += '|   |-- Count outcome      --> Poisson / neg binomial regression\n';
        html += '|   |-- Clustered data     --> Mixed-effects / multilevel model\n';
        html += '|\n';
        html += '|-- Test for TREND across ordered groups?\n';
        html += '    |-- Binary outcome  --> Cochran-Armitage trend test\n';
        html += '    |-- Continuous      --> Linear contrast in ANOVA\n';
        html += '</div>';

        html += '<div style="background:var(--bg-tertiary);border-radius:8px;padding:12px;margin-top:12px;font-size:0.85rem;line-height:1.7;">';
        html += '<strong>Key decision points:</strong> (1) What is your outcome type? (2) How many groups? (3) Independent or paired? (4) Parametric assumptions met? '
            + 'When assumptions are violated, use non-parametric alternatives. When adjusting for covariates, use regression models instead of simple tests.';
        html += '</div>';

        html += '</div>';
        return html;
    }

    /* ================================================================
       DISTRIBUTION EXPLORER
       ================================================================ */

    function showDistribution() {
        var distType = document.getElementById('br_dist_select').value;
        var p1 = parseFloat(document.getElementById('br_dist_p1').value);
        var p2 = parseFloat(document.getElementById('br_dist_p2').value);

        var info = '';
        var paramLabels = '';

        if (distType === 'normal') {
            if (isNaN(p1)) p1 = 0;
            if (isNaN(p2) || p2 <= 0) p2 = 1;
            paramLabels = 'mu = ' + p1 + ', sigma = ' + p2;
            info = '<strong>Normal distribution</strong> with mean = ' + p1 + ' and SD = ' + p2 + '. '
                + 'Bell-shaped, symmetric. 68% of values within 1 SD, 95% within 2 SD, 99.7% within 3 SD. '
                + 'Mean = ' + p1 + ', Variance = ' + (p2 * p2).toFixed(2) + '.';
        } else if (distType === 't') {
            if (isNaN(p1) || p1 < 1) p1 = 5;
            paramLabels = 'df = ' + p1;
            info = '<strong>Student t distribution</strong> with ' + p1 + ' degrees of freedom. '
                + 'Heavier tails than normal (more probability in extremes). Approaches normal as df increases. '
                + 'Mean = 0 (for df > 1), Variance = ' + (p1 > 2 ? (p1 / (p1 - 2)).toFixed(3) : 'undefined (df <= 2)') + '.';
        } else if (distType === 'chi2') {
            if (isNaN(p1) || p1 < 1) p1 = 5;
            paramLabels = 'k = ' + p1;
            info = '<strong>Chi-squared distribution</strong> with k = ' + p1 + ' degrees of freedom. '
                + 'Right-skewed; becomes more symmetric as k increases. Mean = ' + p1 + ', Variance = ' + (2 * p1) + '.';
        } else if (distType === 'f') {
            if (isNaN(p1) || p1 < 1) p1 = 5;
            if (isNaN(p2) || p2 < 1) p2 = 20;
            paramLabels = 'd1 = ' + p1 + ', d2 = ' + p2;
            info = '<strong>F distribution</strong> with d1 = ' + p1 + ' and d2 = ' + p2 + ' degrees of freedom. '
                + 'Right-skewed. Used for comparing variances and ANOVA F-tests. '
                + 'Mean = ' + (p2 > 2 ? (p2 / (p2 - 2)).toFixed(3) : 'undefined') + '.';
        } else if (distType === 'poisson') {
            if (isNaN(p1) || p1 < 0) p1 = 5;
            paramLabels = 'lambda = ' + p1;
            info = '<strong>Poisson distribution</strong> with rate lambda = ' + p1 + '. '
                + 'Discrete distribution for counts. Mean = Variance = ' + p1 + '. '
                + 'Approaches normal when lambda is large (>= 20).';
        } else if (distType === 'binomial') {
            if (isNaN(p1) || p1 < 1) p1 = 20;
            if (isNaN(p2) || p2 < 0 || p2 > 1) p2 = 0.5;
            paramLabels = 'n = ' + p1 + ', p = ' + p2;
            info = '<strong>Binomial distribution</strong> with n = ' + Math.round(p1) + ' trials and p = ' + p2 + '. '
                + 'Discrete distribution for number of successes. Mean = ' + (Math.round(p1) * p2).toFixed(1)
                + ', Variance = ' + (Math.round(p1) * p2 * (1 - p2)).toFixed(2) + '. '
                + 'Approaches normal when np >= 5 and n(1-p) >= 5.';
        }

        var infoEl = document.getElementById('br-dist-info');
        if (infoEl) {
            App.setTrustedHTML(infoEl, '<div style="background:var(--bg-tertiary);border-radius:8px;padding:12px;font-size:0.88rem;line-height:1.6;">'
                + '<strong>Parameters:</strong> ' + paramLabels + '<br>' + info + '</div>');
        }

        // Generate text-based visualization
        var visualEl = document.getElementById('br-dist-visual');
        if (visualEl) {
            var vizHtml = generateDistViz(distType, p1, p2);
            App.setTrustedHTML(visualEl, vizHtml);
        }
    }

    function generateDistViz(distType, p1, p2) {
        var points = [];
        var nPoints = 40;
        var xMin, xMax;

        if (distType === 'normal') {
            xMin = p1 - 4 * p2;
            xMax = p1 + 4 * p2;
        } else if (distType === 't') {
            xMin = -4;
            xMax = 4;
        } else if (distType === 'chi2') {
            xMin = 0;
            xMax = p1 + 4 * Math.sqrt(2 * p1);
        } else if (distType === 'f') {
            xMin = 0;
            xMax = Math.max(5, p1 / p2 * 4);
        } else if (distType === 'poisson') {
            xMin = 0;
            xMax = Math.max(10, p1 + 4 * Math.sqrt(p1));
            nPoints = Math.min(Math.round(xMax) + 1, 30);
        } else if (distType === 'binomial') {
            xMin = 0;
            xMax = Math.round(p1);
            nPoints = Math.min(Math.round(p1) + 1, 30);
        }

        // Calculate density/probability values
        for (var i = 0; i < nPoints; i++) {
            var x;
            if (distType === 'poisson' || distType === 'binomial') {
                x = i;
                if (x > xMax) break;
            } else {
                x = xMin + (xMax - xMin) * i / (nPoints - 1);
            }

            var y = 0;
            if (distType === 'normal') {
                y = (1 / (p2 * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - p1) / p2, 2));
            } else if (distType === 't') {
                // Approximate t-density using normal for display
                var v = p1;
                var coef = 1 / (Math.sqrt(v) * 3.14159);
                y = coef * Math.pow(1 + x * x / v, -(v + 1) / 2);
            } else if (distType === 'chi2') {
                if (x > 0) {
                    var k = p1;
                    y = Math.pow(x, k / 2 - 1) * Math.exp(-x / 2) / (Math.pow(2, k / 2) * approxGamma(k / 2));
                }
            } else if (distType === 'f') {
                if (x > 0) {
                    y = Math.pow(x, p1 / 2 - 1) / Math.pow(1 + p1 * x / p2, (p1 + p2) / 2) * 0.5;
                }
            } else if (distType === 'poisson') {
                var lam = p1;
                y = Math.exp(-lam + x * Math.log(lam) - logFactorial(x));
            } else if (distType === 'binomial') {
                var nn = Math.round(p1);
                var pp = p2;
                if (x <= nn) {
                    y = Math.exp(logCombination(nn, x) + x * Math.log(pp) + (nn - x) * Math.log(1 - pp));
                }
            }

            points.push({ x: x, y: isFinite(y) ? y : 0 });
        }

        // Build text-based bar chart
        var maxY = 0;
        for (var j = 0; j < points.length; j++) {
            if (points[j].y > maxY) maxY = points[j].y;
        }

        var html = '<div style="font-family:monospace;font-size:0.78rem;line-height:1.2;background:var(--bg-primary);border:1px solid var(--border);padding:12px;border-radius:8px;overflow-x:auto;">';
        for (var k = 0; k < points.length; k++) {
            var barLen = maxY > 0 ? Math.round((points[k].y / maxY) * 35) : 0;
            var bar = '';
            for (var bl = 0; bl < barLen; bl++) bar += '#';
            var xLabel = points[k].x.toFixed(1);
            if (xLabel.length < 6) xLabel = ('      ' + xLabel).slice(-6);
            html += xLabel + ' | ' + bar + '\n';
        }
        html += '</div>';
        return html;
    }

    function approxGamma(n) {
        // Stirling's approximation for Gamma function
        if (n <= 0) return 1;
        if (n < 0.5) return Math.PI / (Math.sin(Math.PI * n) * approxGamma(1 - n));
        n -= 1;
        var x = 1;
        var t = n + 7.5;
        var coeffs = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
        var sum = coeffs[0];
        for (var i = 1; i < 9; i++) {
            sum += coeffs[i] / (n + i);
        }
        return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * sum;
    }

    function logFactorial(n) {
        var result = 0;
        for (var i = 2; i <= n; i++) result += Math.log(i);
        return result;
    }

    function logCombination(n, k) {
        return logFactorial(n) - logFactorial(k) - logFactorial(n - k);
    }

    /* ================================================================
       BAYESIAN vs FREQUENTIST COMPARISON
       ================================================================ */

    function renderBayesianComparison() {
        var html = '<div class="card">';
        html += '<div class="card-title">Bayesian vs Frequentist Comparison</div>';
        html += '<div class="card-subtitle">Side-by-side comparison of the two major frameworks for statistical inference.</div>';

        html += '<div class="table-container">';
        html += '<table class="data-table"><thead><tr><th>Aspect</th><th>Frequentist</th><th>Bayesian</th></tr></thead><tbody>';

        var rows = [
            ['Definition of probability', 'Long-run frequency of events', 'Degree of belief or certainty'],
            ['Parameters', 'Fixed but unknown constants', 'Random variables with distributions'],
            ['Data', 'Random (different samples yield different data)', 'Fixed (the data we observed)'],
            ['Inference target', 'P(data | parameter) -- likelihood', 'P(parameter | data) -- posterior'],
            ['Key formula', 'Likelihood function', 'Bayes theorem: posterior = prior x likelihood / evidence'],
            ['Prior information', 'Not formally incorporated', 'Explicitly incorporated via prior distributions'],
            ['Confidence/Credible interval', '95% CI: In repeated sampling, 95% of intervals would contain the true value', '95% CrI: There is a 95% probability the parameter lies in this interval, given the data and prior'],
            ['Hypothesis testing', 'Reject/fail to reject H0 based on p-value and alpha', 'Compute posterior probability of hypotheses; Bayes factors'],
            ['Multiple comparisons', 'Requires correction (Bonferroni, FDR)', 'Naturally handled through hierarchical models (partial pooling)'],
            ['Small samples', 'Can be unreliable; relies on asymptotics', 'Works well with informative priors; exact posterior inference'],
            ['Computation', 'Often closed-form or simple', 'May require MCMC, variational inference'],
            ['Common criticism', 'p-values are widely misinterpreted; arbitrary thresholds', 'Choice of prior is subjective; computational cost'],
            ['When to prefer', 'Regulatory settings; large samples; when objectivity is paramount', 'Small samples; sequential analysis; when prior information is available']
        ];

        for (var i = 0; i < rows.length; i++) {
            html += '<tr><td><strong>' + rows[i][0] + '</strong></td>'
                + '<td style="font-size:0.82rem;">' + rows[i][1] + '</td>'
                + '<td style="font-size:0.82rem;">' + rows[i][2] + '</td></tr>';
        }

        html += '</tbody></table></div>';

        html += '<div style="background:var(--bg-tertiary);border-radius:8px;padding:12px;margin-top:12px;font-size:0.85rem;line-height:1.7;">';
        html += '<strong>Practical guidance:</strong> In most clinical research, frequentist methods remain standard. '
            + 'Bayesian methods are increasingly used for: (1) adaptive clinical trial designs, (2) meta-analyses with informative priors, '
            + '(3) rare disease research with small samples, (4) diagnostic test evaluation, and (5) health technology assessment. '
            + 'Some journals (e.g., JAMA) now accept Bayesian analyses alongside or instead of frequentist results.';
        html += '</div>';

        html += '<div style="margin-top:12px;font-size:0.8rem;color:var(--text-tertiary);">'
            + 'References: Gelman A et al. Bayesian Data Analysis, 3rd ed. CRC Press, 2013. '
            + 'Kruschke JK. Bayesian estimation supersedes the t test. J Exp Psychol Gen. 2013;142(2):573-603. '
            + 'Greenland S. Bayesian perspectives for epidemiological research. Int J Epidemiol. 2006;35(3):765-775.'
            + '</div>';

        html += '</div>';
        return html;
    }

    /* ================================================================
       STATISTICAL TEST SELECTOR
       ================================================================ */

    function findTest() {
        var outcome = document.getElementById('br_outcome').value;
        var groups = document.getElementById('br_groups').value;
        var paired = document.getElementById('br_paired').value;
        var parametric = document.getElementById('br_parametric').value;

        if (!outcome) {
            Export.showToast('Please select the outcome variable type.', 'error');
            return;
        }

        var matches = [];
        for (var i = 0; i < STAT_TESTS.length; i++) {
            var t = STAT_TESTS[i];
            var outcomeMatch = (t.outcome === outcome) ||
                               (outcome === 'ordinal' && (t.outcome === 'continuous' || t.outcome === 'binary'));
            var groupsMatch = !groups || t.groups === groups || (groups === '3+' && t.groups === '3+') || (groups === '2' && t.groups === '2');
            var pairedMatch = !paired || t.paired === paired || t.paired === 'na' || paired === 'na';
            var paramMatch = !parametric || (parametric === 'yes' && t.parametric) || (parametric === 'no' && !t.parametric);

            if (outcomeMatch && groupsMatch && pairedMatch && paramMatch) {
                matches.push(t);
            }
        }

        if (matches.length === 0) {
            for (var j = 0; j < STAT_TESTS.length; j++) {
                var t2 = STAT_TESTS[j];
                if (t2.outcome === outcome) {
                    matches.push(t2);
                }
            }
        }

        displayTestResults(matches);
    }

    function showAllTests() {
        displayTestResults(STAT_TESTS);
    }

    function displayTestResults(tests) {
        var el = document.getElementById('br-test-results');
        if (tests.length === 0) {
            App.setTrustedHTML(el, '<div class="result-panel mt-2"><div class="result-detail">No matching tests found. Try broadening your criteria.</div></div>');
            return;
        }

        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">' + tests.length + ' Test' + (tests.length > 1 ? 's' : '') + ' Found</div>';

        for (var i = 0; i < tests.length; i++) {
            var t = tests[i];
            html += '<div style="border:1px solid var(--border-color);border-radius:8px;padding:1em;margin-bottom:0.8em;background:var(--bg-offset)">';
            html += '<div style="font-weight:700;font-size:1.05rem;color:var(--accent)">' + t.name + '</div>';

            html += '<div style="display:grid;grid-template-columns:auto 1fr;gap:0.3em 1em;font-size:0.85rem;line-height:1.6;margin-top:0.5em">';
            html += '<strong>When to use:</strong><div>' + t.when + '</div>';
            html += '<strong>Assumptions:</strong><div>' + t.assumptions + '</div>';
            html += '<strong>Effect measure:</strong><div>' + t.effect + '</div>';
            html += '<strong>Formula:</strong><div style="font-family:monospace;font-size:0.82rem">' + t.formula + '</div>';
            html += '<strong>Interpretation:</strong><div style="font-style:italic">' + t.interpretation + '</div>';
            html += '</div>';

            html += '<div style="margin-top:0.5em">';
            html += '<span style="display:inline-block;background:var(--accent-muted);color:var(--accent);padding:2px 8px;border-radius:12px;font-size:0.75rem;margin-right:4px">' + t.outcome + '</span>';
            html += '<span style="display:inline-block;background:var(--accent-muted);padding:2px 8px;border-radius:12px;font-size:0.75rem;margin-right:4px">' + t.groups + ' group' + (t.groups !== '1' ? 's' : '') + '</span>';
            html += '<span style="display:inline-block;background:var(--accent-muted);padding:2px 8px;border-radius:12px;font-size:0.75rem;margin-right:4px">' + (t.parametric ? 'parametric' : 'non-parametric') + '</span>';
            if (t.paired !== 'na') {
                html += '<span style="display:inline-block;background:var(--accent-muted);padding:2px 8px;border-radius:12px;font-size:0.75rem">' + t.paired + '</span>';
            }
            html += '</div>';
            html += '</div>';
        }

        html += '</div>';
        App.setTrustedHTML(el, html);
    }

    /* ================================================================
       CI CALCULATOR
       ================================================================ */

    function calcCI() {
        var x = parseInt(document.getElementById('br_ci_x').value, 10);
        var n = parseInt(document.getElementById('br_ci_n').value, 10);
        var level = parseFloat(document.getElementById('br_ci_level').value);

        if (isNaN(x) || isNaN(n) || n <= 0 || x < 0 || x > n) {
            Export.showToast('Enter valid values: 0 <= x <= n, n > 0.', 'error');
            return;
        }

        var alpha = 1 - level;
        var hasStats = typeof Statistics !== 'undefined';
        var z = (hasStats && typeof Statistics.normalQuantile === 'function')
            ? Statistics.normalQuantile(1 - alpha / 2)
            : (level >= 0.99 ? 2.5758 : (level <= 0.90 ? 1.6449 : 1.96));
        var p = x / n;

        // Wald
        var waldSE = Math.sqrt(p * (1 - p) / n);
        var waldLo = Math.max(0, p - z * waldSE);
        var waldHi = Math.min(1, p + z * waldSE);

        // Wilson
        var wilsonDenom = 1 + z * z / n;
        var wilsonCenter = (p + z * z / (2 * n)) / wilsonDenom;
        var wilsonHalf = (z / wilsonDenom) * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n));
        var wilsonLo = Math.max(0, wilsonCenter - wilsonHalf);
        var wilsonHi = Math.min(1, wilsonCenter + wilsonHalf);

        // Agresti-Coull
        var nTilde = n + z * z;
        var pTilde = (x + z * z / 2) / nTilde;
        var acSE = Math.sqrt(pTilde * (1 - pTilde) / nTilde);
        var acLo = Math.max(0, pTilde - z * acSE);
        var acHi = Math.min(1, pTilde + z * acSE);

        // Clopper-Pearson (exact) via the core statistics library
        // (falls back to the Wald bounds only if the library is unavailable)
        var cpLo = waldLo, cpHi = waldHi;
        if (hasStats && typeof Statistics.wilsonCI === 'function') {
            try {
                var wCI = Statistics.wilsonCI(p, n, z);
                wilsonLo = wCI.lower;
                wilsonHi = wCI.upper;
            } catch (e) { /* fallback already calculated */ }
        }
        if (hasStats && typeof Statistics.clopperPearsonCI === 'function') {
            try {
                var cpCI = Statistics.clopperPearsonCI(x, n, alpha);
                cpLo = cpCI.lower;
                cpHi = cpCI.upper;
            } catch (e) { /* fallback already calculated */ }
        }

        var results = [
            { name: 'Wald', lo: waldLo, hi: waldHi },
            { name: 'Wilson (score)', lo: wilsonLo, hi: wilsonHi },
            { name: 'Agresti-Coull', lo: acLo, hi: acHi },
            { name: 'Clopper-Pearson (exact)', lo: cpLo, hi: cpHi }
        ];

        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="result-value">' + p.toFixed(4) + '</div>';
        html += '<div class="result-label">Observed Proportion (' + x + '/' + n + ')</div>';

        html += '<table class="data-table mt-1">';
        html += '<thead><tr><th>Method</th><th>Lower</th><th>Upper</th><th>Width</th></tr></thead>';
        html += '<tbody>';

        for (var r = 0; r < results.length; r++) {
            var res = results[r];
            var width = res.hi - res.lo;
            html += '<tr>';
            html += '<td><strong>' + res.name + '</strong></td>';
            html += '<td class="num">' + res.lo.toFixed(4) + '</td>';
            html += '<td class="num">' + res.hi.toFixed(4) + '</td>';
            html += '<td class="num">' + width.toFixed(4) + '</td>';
            html += '</tr>';
        }

        html += '</tbody></table>';

        html += '<div class="result-detail mt-1" style="font-size:0.82rem">';
        html += '<strong>Recommendation:</strong> Wilson is generally preferred for single proportions. ';
        html += 'Clopper-Pearson guarantees >= nominal coverage but tends to be conservative. ';
        html += 'Avoid Wald when p is near 0 or 1, or n is small.';
        html += '</div>';
        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.biostatCI({x:' + x + ',n:' + n + ',level:' + level + '}), &quot;Confidence Intervals for Proportions&quot;)">'
            + '&#129513; Generate R Script</button></div>';

        html += '</div>';
        App.setTrustedHTML(document.getElementById('br-ci-results'), html);
    }

    /* ================================================================
       P-VALUE ADJUSTMENT CALCULATOR
       ================================================================ */

    function adjustPvals() {
        var rawInput = document.getElementById('br_pvals').value.trim();
        var alpha = parseFloat(document.getElementById('br_alpha').value);

        if (!rawInput) {
            Export.showToast('Enter comma-separated p-values.', 'error');
            return;
        }

        var pvals = rawInput.split(',').map(function(s) { return parseFloat(s.trim()); }).filter(function(v) { return !isNaN(v) && v >= 0 && v <= 1; });
        if (pvals.length === 0) {
            Export.showToast('No valid p-values entered.', 'error');
            return;
        }

        var m = pvals.length;

        var indexed = [];
        for (var i = 0; i < m; i++) {
            indexed.push({ idx: i, p: pvals[i] });
        }
        indexed.sort(function(a, b) { return a.p - b.p; });

        // Bonferroni
        var bonf = pvals.map(function(p) { return Math.min(1, p * m); });

        // Holm (step-down)
        var holm = new Array(m);
        var holmMax = 0;
        for (var h = 0; h < m; h++) {
            var adjP = indexed[h].p * (m - h);
            holmMax = Math.max(holmMax, adjP);
            holm[indexed[h].idx] = Math.min(1, holmMax);
        }

        // Hochberg (step-up)
        var hochberg = new Array(m);
        var hochMin = 1;
        for (var hb = m - 1; hb >= 0; hb--) {
            var adjPH = indexed[hb].p * (m - hb);
            hochMin = Math.min(hochMin, adjPH);
            hochberg[indexed[hb].idx] = Math.min(1, hochMin);
        }

        // Benjamini-Hochberg (FDR)
        var bh = new Array(m);
        var bhMin = 1;
        for (var b = m - 1; b >= 0; b--) {
            var adjPBH = indexed[b].p * m / (b + 1);
            bhMin = Math.min(bhMin, adjPBH);
            bh[indexed[b].idx] = Math.min(1, bhMin);
        }

        // Sidak
        var sidak = pvals.map(function(p) { return Math.min(1, 1 - Math.pow(1 - p, m)); });

        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">Adjusted P-Values (' + m + ' tests, alpha = ' + alpha + ')</div>';

        html += '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr><th>Test #</th><th>Raw P</th><th>Bonferroni</th><th>Holm</th><th>Hochberg</th><th>BH (FDR)</th><th>Sidak</th></tr></thead>';
        html += '<tbody>';

        for (var j = 0; j < m; j++) {
            html += '<tr>';
            html += '<td>' + (j + 1) + '</td>';
            html += '<td class="num">' + pvals[j].toFixed(4) + '</td>';

            var methods = [bonf[j], holm[j], hochberg[j], bh[j], sidak[j]];
            for (var k = 0; k < methods.length; k++) {
                var sig = methods[k] < alpha;
                html += '<td class="num" style="' + (sig ? 'color:var(--accent);font-weight:600' : '') + '">' + methods[k].toFixed(4) + (sig ? ' *' : '') + '</td>';
            }
            html += '</tr>';
        }

        html += '</tbody></table>';
        html += '</div>';

        // Summary
        var bonfSig = bonf.filter(function(p) { return p < alpha; }).length;
        var holmSig = holm.filter(function(p) { return p < alpha; }).length;
        var hochSig = hochberg.filter(function(p) { return p < alpha; }).length;
        var bhSig = bh.filter(function(p) { return p < alpha; }).length;
        var sidakSig = sidak.filter(function(p) { return p < alpha; }).length;
        var rawSig = pvals.filter(function(p) { return p < alpha; }).length;

        html += '<div class="result-detail mt-1" style="font-size:0.85rem;line-height:1.7">';
        html += '<strong>Summary of significant tests (at alpha = ' + alpha + '):</strong><br>';
        html += 'Unadjusted: ' + rawSig + '/' + m + ' | ';
        html += 'Bonferroni: ' + bonfSig + '/' + m + ' | ';
        html += 'Holm: ' + holmSig + '/' + m + ' | ';
        html += 'Hochberg: ' + hochSig + '/' + m + ' | ';
        html += 'BH (FDR): ' + bhSig + '/' + m + ' | ';
        html += 'Sidak: ' + sidakSig + '/' + m;
        html += '<br><span style="color:var(--text-tertiary)">* indicates significant after adjustment</span>';
        html += '</div>';
        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.biostatPvalAdjust({pvals:[' + pvals.join(',') + '],alpha:' + alpha + '}), &quot;P-Value Adjustment&quot;)">'
            + '&#129513; Generate R Script</button></div>';

        html += '</div>';
        App.setTrustedHTML(document.getElementById('br-pval-results'), html);
    }

    /* ================================================================
       REGISTER
       ================================================================ */

    App.registerModule(MODULE_ID, { render: render });

    window.BiostatRef = {
        findTest: findTest,
        showAllTests: showAllTests,
        calcCI: calcCI,
        adjustPvals: adjustPvals,
        showDistribution: showDistribution,
        runCLT: runCLT
    };
})();
