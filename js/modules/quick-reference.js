/**
 * Neuro-Epi — Quick Reference Cards
 * Printable, pocket-sized reference cards for clinical research essentials.
 * Enhanced with: Statistical Test Selection Guide, Common Formulas Reference,
 * Reporting Checklist Quick Access, and A-Z Glossary.
 */
(function() {
    'use strict';
    var MODULE_ID = 'quick-reference';

    /* ================================================================
     * SECTION 1 — EXISTING REFERENCE CARDS (preserved in full)
     * ================================================================ */

    var cards = [
        {
            id: 'stat-tests',
            title: 'Statistical Test Selector',
            color: '#22d3ee',
            content: [
                { heading: 'Comparing Two Groups', items: [
                    ['Continuous, normal', 'Independent t-test'],
                    ['Continuous, non-normal', 'Mann-Whitney U'],
                    ['Categorical (2x2)', 'Chi-squared / Fisher exact'],
                    ['Categorical (RxC)', 'Chi-squared test'],
                    ['Paired continuous', 'Paired t-test'],
                    ['Paired categorical', "McNemar's test"],
                    ['Time-to-event', 'Log-rank test']
                ]},
                { heading: 'Comparing 3+ Groups', items: [
                    ['Continuous, normal', 'One-way ANOVA'],
                    ['Continuous, non-normal', 'Kruskal-Wallis'],
                    ['Repeated measures', 'Repeated measures ANOVA / Friedman']
                ]},
                { heading: 'Correlation & Regression', items: [
                    ['Linear relationship', "Pearson's r"],
                    ['Ordinal / non-normal', "Spearman's rho"],
                    ['Binary outcome', 'Logistic regression'],
                    ['Time-to-event', 'Cox proportional hazards'],
                    ['Ordinal outcome', 'Ordinal logistic (polr)'],
                    ['Count outcome', 'Poisson / negative binomial']
                ]}
            ]
        },
        {
            id: 'ci-formulas',
            title: 'Confidence Interval Formulas',
            color: '#f97316',
            content: [
                { heading: 'Proportions', items: [
                    ['Wald', 'p +/- z * sqrt(p(1-p)/n)'],
                    ['Wilson', '(p + z^2/2n +/- z*sqrt(p(1-p)/n + z^2/4n^2)) / (1 + z^2/n)'],
                    ['Clopper-Pearson', 'Based on Beta distribution (exact)']
                ]},
                { heading: 'Means', items: [
                    ['Single mean', 'x-bar +/- t * (s / sqrt(n))'],
                    ['Difference in means', '(x1 - x2) +/- t * SE_diff'],
                    ['SE_diff', 'sqrt(s1^2/n1 + s2^2/n2)']
                ]},
                { heading: 'Ratios', items: [
                    ['OR / RR', 'exp(ln(estimate) +/- z * SE_ln)'],
                    ['SE of ln(OR)', 'sqrt(1/a + 1/b + 1/c + 1/d)'],
                    ['SE of ln(RR)', 'sqrt(1/a - 1/(a+b) + 1/c - 1/(c+d))'],
                    ['HR', 'exp(ln(HR) +/- z * SE_ln(HR))']
                ]}
            ]
        },
        {
            id: 'sample-size-ref',
            title: 'Sample Size Quick Reference',
            color: '#a855f7',
            content: [
                { heading: 'Key Parameters', items: [
                    ['Alpha (type I error)', 'Usually 0.05 (two-sided)'],
                    ['Power (1-beta)', 'Usually 0.80 or 0.90'],
                    ['Effect size', 'Clinically meaningful difference'],
                    ['Variability', 'SD for continuous; baseline rate for proportions']
                ]},
                { heading: "Cohen's Conventions", items: [
                    ['Small effect', 'd=0.2, h=0.2, OR~1.5'],
                    ['Medium effect', 'd=0.5, h=0.5, OR~2.5'],
                    ['Large effect', 'd=0.8, h=0.8, OR~4.3']
                ]},
                { heading: 'Common Formulas', items: [
                    ['Two proportions', 'N = (za+zb)^2 * [p1(1-p1) + p2(1-p2)] / (p1-p2)^2'],
                    ['Two means', 'N = 2(za+zb)^2 * s^2 / delta^2'],
                    ['Survival (Schoenfeld)', 'Events = (za+zb)^2 / (ln(HR))^2'],
                    ['Non-inferiority', 'Add margin delta_NI to standard formula']
                ]},
                { heading: 'Adjustments', items: [
                    ['Dropout', 'N_adj = N / (1 - dropout rate)'],
                    ['Crossover', 'N_adj = N / (1 - crossover rate)^2'],
                    ['Cluster RCT', 'DE = 1 + (m-1)*ICC']
                ]}
            ]
        },
        {
            id: 'diagnostic-ref',
            title: 'Diagnostic Accuracy Reference',
            color: '#10b981',
            content: [
                { heading: '2x2 Table', items: [
                    ['', 'Disease+ / Disease-'],
                    ['Test+', 'TP / FP'],
                    ['Test-', 'FN / TN']
                ]},
                { heading: 'Metrics', items: [
                    ['Sensitivity', 'TP / (TP + FN) = P(T+ | D+)'],
                    ['Specificity', 'TN / (TN + FP) = P(T- | D-)'],
                    ['PPV', 'TP / (TP + FP) = P(D+ | T+)'],
                    ['NPV', 'TN / (TN + FN) = P(D- | T-)'],
                    ['LR+', 'Sens / (1 - Spec)'],
                    ['LR-', '(1 - Sens) / Spec'],
                    ['DOR', 'LR+ / LR- = (TP*TN) / (FP*FN)'],
                    ['Accuracy', '(TP + TN) / (TP + FP + FN + TN)']
                ]},
                { heading: 'LR Interpretation', items: [
                    ['LR+ > 10', 'Large increase in post-test probability'],
                    ['LR+ 5-10', 'Moderate increase'],
                    ['LR+ 2-5', 'Small increase'],
                    ['LR+ 1-2', 'Minimal change'],
                    ['LR- 0.5-1', 'Minimal change'],
                    ['LR- 0.1-0.5', 'Small-moderate decrease'],
                    ['LR- < 0.1', 'Large decrease in post-test probability']
                ]}
            ]
        },
        {
            id: 'meta-ref',
            title: 'Meta-Analysis Quick Reference',
            color: '#ef4444',
            content: [
                { heading: 'Models', items: [
                    ['Fixed effect', 'Assumes one true effect; weight = 1/var_i'],
                    ['Random effects (DL)', 'Assumes distribution of effects; adds tau^2'],
                    ['HKSJ correction', 'Better CI coverage for small meta-analyses']
                ]},
                { heading: 'Heterogeneity', items: [
                    ['Q statistic', 'Sum of weighted squared deviations; df = k-1'],
                    ['I-squared', '100% * (Q - df) / Q; 0-100%'],
                    ['Tau-squared', 'Between-study variance'],
                    ['Low I^2', '< 25%'],
                    ['Moderate I^2', '25-75%'],
                    ['High I^2', '> 75%']
                ]},
                { heading: 'Publication Bias', items: [
                    ['Funnel plot', 'Visual: asymmetry suggests bias'],
                    ["Egger's test", 'Regression test for funnel asymmetry'],
                    ["Begg's test", 'Rank correlation test'],
                    ['Trim and fill', 'Impute missing studies'],
                    ['p-curve', 'Distribution of significant p-values']
                ]},
                { heading: 'Quality Assessment', items: [
                    ['GRADE', 'Rate certainty: High/Moderate/Low/Very Low'],
                    ['RoB 2.0', 'Bias assessment for RCTs'],
                    ['ROBINS-I', 'Bias assessment for non-randomized studies'],
                    ['AMSTAR-2', 'Quality of systematic reviews']
                ]}
            ]
        },
        {
            id: 'epi-measures',
            title: 'Epidemiological Measures',
            color: '#ec4899',
            content: [
                { heading: 'Frequency', items: [
                    ['Prevalence', 'Cases / Population at a point in time'],
                    ['Cumulative incidence', 'New cases / Population at risk over time'],
                    ['Incidence rate', 'New cases / Person-time at risk'],
                    ['Attack rate', 'Cases / Population at risk (outbreak)']
                ]},
                { heading: 'Association', items: [
                    ['Risk Ratio (RR)', 'Risk_exposed / Risk_unexposed'],
                    ['Rate Ratio', 'Rate_exposed / Rate_unexposed'],
                    ['Odds Ratio (OR)', '(a*d) / (b*c) from 2x2 table'],
                    ['Risk Difference (RD)', 'Risk_exposed - Risk_unexposed']
                ]},
                { heading: 'Impact', items: [
                    ['AR (Attributable Risk)', 'Risk_exposed - Risk_unexposed'],
                    ['AF (Attributable Fraction)', '(RR - 1) / RR'],
                    ['PAR', 'Risk_total - Risk_unexposed'],
                    ['PAF', 'Pe(RR - 1) / [Pe(RR - 1) + 1]'],
                    ['NNT', '1 / ARR'],
                    ['NNH', '1 / ARI']
                ]},
                { heading: 'Standardization', items: [
                    ['Direct', 'Apply age-specific rates to standard population'],
                    ['Indirect (SMR)', 'Observed / Expected deaths'],
                    ['SMR CI', 'Exact Poisson-based confidence limits']
                ]}
            ]
        },
        {
            id: 'reporting',
            title: 'Reporting Checklist Summary',
            color: '#6366f1',
            content: [
                { heading: 'By Study Design', items: [
                    ['RCT', 'CONSORT (25 items)'],
                    ['Observational (cohort/CC/XS)', 'STROBE (22 items)'],
                    ['Systematic review', 'PRISMA (27 items)'],
                    ['Diagnostic accuracy', 'STARD (30 items)'],
                    ['Prediction model', 'TRIPOD (22 items)'],
                    ['Quality improvement', 'SQUIRE (18 items)'],
                    ['Case report', 'CARE (13 items)'],
                    ['Animal research', 'ARRIVE (21 items)']
                ]},
                { heading: 'Trial Registration', items: [
                    ['ClinicalTrials.gov', 'Required for ICMJE journals'],
                    ['WHO ICTRP', 'International registry portal'],
                    ['When', 'Before first participant enrolled']
                ]},
                { heading: 'Key Sections', items: [
                    ['Title', 'Include study design in title'],
                    ['Abstract', 'Structured abstract with all key elements'],
                    ['Methods', 'Reproducible detail of design, participants, analysis'],
                    ['Results', 'Flow diagram, primary + secondary outcomes, harms'],
                    ['Discussion', 'Limitations, generalizability, interpretation']
                ]}
            ]
        },
        {
            id: 'grade',
            title: 'GRADE Assessment',
            color: '#14b8a6',
            content: [
                { heading: 'Starting Certainty', items: [
                    ['RCTs', 'Start at HIGH'],
                    ['Observational', 'Start at LOW']
                ]},
                { heading: 'Reasons to Downgrade (-1 or -2)', items: [
                    ['Risk of bias', 'Limitations in study design/execution'],
                    ['Inconsistency', 'Unexplained heterogeneity across studies'],
                    ['Indirectness', 'Differences in PICO from question'],
                    ['Imprecision', 'Wide CIs, small sample, few events'],
                    ['Publication bias', 'Funnel asymmetry, selective reporting']
                ]},
                { heading: 'Reasons to Upgrade (+1 or +2)', items: [
                    ['Large effect', 'RR > 2 or < 0.5 (upgrade +1); RR > 5 or < 0.2 (+2)'],
                    ['Dose-response', 'Gradient across exposure levels'],
                    ['Confounding', 'All plausible confounders would reduce effect']
                ]},
                { heading: 'Certainty Levels', items: [
                    ['HIGH', 'Very confident in the estimate'],
                    ['MODERATE', 'Moderately confident; true effect likely close'],
                    ['LOW', 'Limited confidence; true effect may differ'],
                    ['VERY LOW', 'Very little confidence; estimate very uncertain']
                ]}
            ]
        }
    ];

    /* ================================================================
     * SECTION 2 — STATISTICAL TEST SELECTION GUIDE (filterable)
     * ================================================================ */

    var statTestDB = [
        // Continuous, 1 group
        { dataType: 'continuous', groups: '1', pairing: 'na', distribution: 'normal', test: 'One-sample t-test', use: 'Test if sample mean differs from hypothesized value', assumptions: 'Normal distribution or large n' },
        { dataType: 'continuous', groups: '1', pairing: 'na', distribution: 'non-normal', test: 'Wilcoxon signed-rank (one-sample)', use: 'Test if median differs from hypothesized value', assumptions: 'Symmetric distribution around median' },

        // Continuous, 2 groups, independent
        { dataType: 'continuous', groups: '2', pairing: 'independent', distribution: 'normal', test: 'Independent samples t-test', use: 'Compare means between two unrelated groups', assumptions: 'Normality, equal variances (or use Welch)' },
        { dataType: 'continuous', groups: '2', pairing: 'independent', distribution: 'non-normal', test: 'Mann-Whitney U test', use: 'Compare distributions between two unrelated groups', assumptions: 'Similar distribution shapes; ordinal or continuous data' },

        // Continuous, 2 groups, paired
        { dataType: 'continuous', groups: '2', pairing: 'paired', distribution: 'normal', test: 'Paired t-test', use: 'Compare means of paired/matched observations', assumptions: 'Normality of differences' },
        { dataType: 'continuous', groups: '2', pairing: 'paired', distribution: 'non-normal', test: 'Wilcoxon signed-rank test', use: 'Compare paired observations non-parametrically', assumptions: 'Symmetric distribution of differences' },

        // Continuous, 3+ groups, independent
        { dataType: 'continuous', groups: '3+', pairing: 'independent', distribution: 'normal', test: 'One-way ANOVA', use: 'Compare means across 3+ independent groups', assumptions: 'Normality, homogeneity of variances' },
        { dataType: 'continuous', groups: '3+', pairing: 'independent', distribution: 'non-normal', test: 'Kruskal-Wallis test', use: 'Compare distributions across 3+ independent groups', assumptions: 'Similar distribution shapes' },

        // Continuous, 3+ groups, paired/repeated
        { dataType: 'continuous', groups: '3+', pairing: 'paired', distribution: 'normal', test: 'Repeated measures ANOVA', use: 'Compare means across 3+ related conditions', assumptions: 'Normality, sphericity' },
        { dataType: 'continuous', groups: '3+', pairing: 'paired', distribution: 'non-normal', test: 'Friedman test', use: 'Compare ranks across 3+ related conditions', assumptions: 'Ordinal or continuous data' },

        // Categorical, 1 group
        { dataType: 'categorical', groups: '1', pairing: 'na', distribution: 'any', test: 'Chi-squared goodness-of-fit', use: 'Test if observed frequencies match expected', assumptions: 'Expected count >= 5 in each cell' },
        { dataType: 'categorical', groups: '1', pairing: 'na', distribution: 'any', test: 'Binomial test (exact)', use: 'Test single proportion against hypothesized value', assumptions: 'Binary outcome, fixed n' },

        // Categorical, 2 groups, independent
        { dataType: 'categorical', groups: '2', pairing: 'independent', distribution: 'any', test: 'Chi-squared test', use: 'Test association in 2x2 or RxC table', assumptions: 'Expected count >= 5 per cell' },
        { dataType: 'categorical', groups: '2', pairing: 'independent', distribution: 'any', test: "Fisher's exact test", use: 'Exact test for 2x2 table with small samples', assumptions: 'Fixed marginal totals; any sample size' },

        // Categorical, 2 groups, paired
        { dataType: 'categorical', groups: '2', pairing: 'paired', distribution: 'any', test: "McNemar's test", use: 'Compare paired proportions (before/after)', assumptions: 'Dichotomous outcome, matched pairs' },

        // Categorical, 3+ groups, independent
        { dataType: 'categorical', groups: '3+', pairing: 'independent', distribution: 'any', test: 'Chi-squared test (RxC)', use: 'Test association across multiple groups', assumptions: 'Expected count >= 5 per cell' },

        // Categorical, 3+ groups, paired
        { dataType: 'categorical', groups: '3+', pairing: 'paired', distribution: 'any', test: "Cochran's Q test", use: 'Compare 3+ related proportions', assumptions: 'Dichotomous outcome, repeated measures' },

        // Ordinal, 2 groups, independent
        { dataType: 'ordinal', groups: '2', pairing: 'independent', distribution: 'any', test: 'Mann-Whitney U test', use: 'Compare ordinal distributions between two groups', assumptions: 'Ordinal scale, similar shapes' },

        // Ordinal, 2 groups, paired
        { dataType: 'ordinal', groups: '2', pairing: 'paired', distribution: 'any', test: 'Wilcoxon signed-rank test', use: 'Compare paired ordinal observations', assumptions: 'Symmetric differences' },

        // Ordinal, 3+ groups, independent
        { dataType: 'ordinal', groups: '3+', pairing: 'independent', distribution: 'any', test: 'Kruskal-Wallis test', use: 'Compare ordinal data across 3+ groups', assumptions: 'Similar distribution shapes' },
        { dataType: 'ordinal', groups: '3+', pairing: 'independent', distribution: 'any', test: 'Jonckheere-Terpstra test', use: 'Test for ordered trend across groups', assumptions: 'A priori ordering of groups' },

        // Ordinal, 3+ groups, paired
        { dataType: 'ordinal', groups: '3+', pairing: 'paired', distribution: 'any', test: 'Friedman test', use: 'Compare ranks across 3+ related conditions', assumptions: 'Ordinal data, repeated measures' },

        // Time-to-event, 2 groups
        { dataType: 'time-to-event', groups: '2', pairing: 'independent', distribution: 'any', test: 'Log-rank test', use: 'Compare survival curves between two groups', assumptions: 'Proportional hazards, non-informative censoring' },
        { dataType: 'time-to-event', groups: '2', pairing: 'independent', distribution: 'any', test: 'Gehan-Breslow-Wilcoxon test', use: 'Compare survival curves (early differences weighted)', assumptions: 'More weight on early events' },

        // Time-to-event, 3+ groups
        { dataType: 'time-to-event', groups: '3+', pairing: 'independent', distribution: 'any', test: 'Log-rank test (stratified)', use: 'Compare survival curves across 3+ groups', assumptions: 'Proportional hazards' },

        // Time-to-event, regression
        { dataType: 'time-to-event', groups: '2', pairing: 'independent', distribution: 'any', test: 'Cox proportional hazards regression', use: 'Model hazard ratios with covariates', assumptions: 'Proportional hazards, linearity of continuous predictors' },
        { dataType: 'time-to-event', groups: '3+', pairing: 'independent', distribution: 'any', test: 'Cox proportional hazards regression', use: 'Model hazard ratios with multiple groups/covariates', assumptions: 'Proportional hazards, linearity of continuous predictors' },

        // Correlation
        { dataType: 'continuous', groups: '2', pairing: 'paired', distribution: 'normal', test: "Pearson's correlation (r)", use: 'Measure linear association between two continuous variables', assumptions: 'Bivariate normality, linearity' },
        { dataType: 'continuous', groups: '2', pairing: 'paired', distribution: 'non-normal', test: "Spearman's rank correlation (rho)", use: 'Measure monotonic association', assumptions: 'Ordinal or continuous data' },
        { dataType: 'ordinal', groups: '2', pairing: 'paired', distribution: 'any', test: "Kendall's tau", use: 'Measure ordinal association (robust for ties)', assumptions: 'Ordinal data' }
    ];

    /* ================================================================
     * SECTION 3 — COMMON FORMULAS REFERENCE (30+ formulas)
     * ================================================================ */

    var formulasDB = [
        // --- Measures of Association ---
        { id: 'rr', category: 'Association', name: 'Relative Risk (RR)', formula: 'RR = [a/(a+b)] / [c/(c+d)]', definition: 'Ratio of risk in exposed group to risk in unexposed group.', interpretation: 'RR = 1: no association; RR > 1: increased risk; RR < 1: decreased risk.', example: 'If 20/100 exposed and 10/100 unexposed get disease: RR = 0.20/0.10 = 2.0' },
        { id: 'or', category: 'Association', name: 'Odds Ratio (OR)', formula: 'OR = (a * d) / (b * c)', definition: 'Ratio of odds of exposure in cases to odds of exposure in controls.', interpretation: 'OR = 1: no association; OR > 1: positive association; OR < 1: negative association. Approximates RR when outcome is rare (<10%).', example: 'From 2x2 table: a=30, b=70, c=10, d=90. OR = (30*90)/(70*10) = 3.86' },
        { id: 'hr', category: 'Association', name: 'Hazard Ratio (HR)', formula: 'HR = h_exposed(t) / h_unexposed(t)', definition: 'Ratio of instantaneous hazard rates between groups at time t.', interpretation: 'HR = 1: no difference; HR > 1: higher hazard in exposed; HR < 1: lower hazard. Assumes proportional hazards.', example: 'HR = 0.75 means 25% lower instantaneous risk of event in treatment vs control.' },
        { id: 'rd', category: 'Association', name: 'Risk Difference (RD)', formula: 'RD = [a/(a+b)] - [c/(c+d)]', definition: 'Absolute difference in risk between exposed and unexposed groups.', interpretation: 'RD = 0: no difference. Positive = higher risk in exposed. Also called Attributable Risk (AR).', example: 'Risk_exposed = 0.20, Risk_unexposed = 0.10. RD = 0.10 (10 extra cases per 100)' },

        // --- Clinical Decision ---
        { id: 'nnt', category: 'Clinical Decision', name: 'Number Needed to Treat (NNT)', formula: 'NNT = 1 / ARR = 1 / |Risk_control - Risk_treatment|', definition: 'Number of patients that must be treated to prevent one additional adverse event.', interpretation: 'Lower NNT = more effective treatment. NNT of 1 = perfect treatment. Always report with CI.', example: 'If control event rate = 0.30, treatment event rate = 0.20: ARR = 0.10, NNT = 10' },
        { id: 'nnh', category: 'Clinical Decision', name: 'Number Needed to Harm (NNH)', formula: 'NNH = 1 / ARI = 1 / |Risk_treatment - Risk_control|', definition: 'Number of patients exposed to treatment before one additional patient is harmed.', interpretation: 'Higher NNH = safer treatment. Compare NNT vs NNH for benefit-risk.', example: 'If adverse event rate = 0.15 in treatment, 0.10 in control: ARI = 0.05, NNH = 20' },

        // --- Diagnostic Accuracy ---
        { id: 'sensitivity', category: 'Diagnostic', name: 'Sensitivity', formula: 'Sens = TP / (TP + FN)', definition: 'Proportion of true positives correctly identified by the test (true positive rate).', interpretation: 'High sensitivity = few false negatives. Good for ruling OUT disease (SnNout). 100% = no false negatives.', example: 'TP = 90, FN = 10. Sensitivity = 90/100 = 0.90 (90%)' },
        { id: 'specificity', category: 'Diagnostic', name: 'Specificity', formula: 'Spec = TN / (TN + FP)', definition: 'Proportion of true negatives correctly identified by the test (true negative rate).', interpretation: 'High specificity = few false positives. Good for ruling IN disease (SpPin). 100% = no false positives.', example: 'TN = 85, FP = 15. Specificity = 85/100 = 0.85 (85%)' },
        { id: 'ppv', category: 'Diagnostic', name: 'Positive Predictive Value (PPV)', formula: 'PPV = TP / (TP + FP)', definition: 'Probability that a positive test result is a true positive.', interpretation: 'Depends heavily on prevalence. Higher prevalence = higher PPV. Also called precision.', example: 'TP = 90, FP = 15. PPV = 90/105 = 0.857 (85.7%)' },
        { id: 'npv', category: 'Diagnostic', name: 'Negative Predictive Value (NPV)', formula: 'NPV = TN / (TN + FN)', definition: 'Probability that a negative test result is a true negative.', interpretation: 'Depends on prevalence. Lower prevalence = higher NPV.', example: 'TN = 85, FN = 10. NPV = 85/95 = 0.895 (89.5%)' },
        { id: 'lrp', category: 'Diagnostic', name: 'Positive Likelihood Ratio (LR+)', formula: 'LR+ = Sensitivity / (1 - Specificity)', definition: 'How much a positive test increases the odds of disease.', interpretation: 'LR+ > 10: large increase; 5-10: moderate; 2-5: small; 1: no change.', example: 'Sens = 0.90, Spec = 0.85. LR+ = 0.90/0.15 = 6.0' },
        { id: 'lrn', category: 'Diagnostic', name: 'Negative Likelihood Ratio (LR-)', formula: 'LR- = (1 - Sensitivity) / Specificity', definition: 'How much a negative test decreases the odds of disease.', interpretation: 'LR- < 0.1: large decrease; 0.1-0.2: moderate; 0.2-0.5: small; 1: no change.', example: 'Sens = 0.90, Spec = 0.85. LR- = 0.10/0.85 = 0.118' },
        { id: 'auc', category: 'Diagnostic', name: 'AUC (Area Under ROC Curve)', formula: 'AUC = integral of ROC curve from 0 to 1', definition: 'Summary measure of diagnostic accuracy across all thresholds.', interpretation: '0.5 = no discrimination; 0.7-0.8 = acceptable; 0.8-0.9 = excellent; >0.9 = outstanding.', example: 'AUC = 0.85 means 85% probability that a randomly chosen positive case has a higher test value than a negative case.' },

        // --- Epidemiological Measures ---
        { id: 'prevalence', category: 'Epidemiology', name: 'Prevalence', formula: 'Prevalence = Existing cases / Total population at time point', definition: 'Proportion of a population that has a condition at a specific point in time (point prevalence) or during a period (period prevalence).', interpretation: 'Useful for burden of disease, healthcare planning. Not a rate (no time component).', example: '500 cases in a population of 10,000: prevalence = 500/10,000 = 5%' },
        { id: 'incidence-rate', category: 'Epidemiology', name: 'Incidence Rate', formula: 'IR = New cases / Person-time at risk', definition: 'Rate at which new cases of disease occur in a population over time.', interpretation: 'Expressed per person-years (or person-months). Accounts for varying follow-up times.', example: '50 new cases in 10,000 person-years: IR = 50/10,000 = 5.0 per 1,000 person-years' },
        { id: 'cumulative-incidence', category: 'Epidemiology', name: 'Cumulative Incidence (Risk)', formula: 'CI = New cases / Population at risk at start', definition: 'Proportion of an at-risk population that develops disease during a specified time.', interpretation: 'Requires defined follow-up period. Also called incidence proportion or attack rate.', example: '100 new cases from 2,000 at-risk over 5 years: CI = 100/2,000 = 5%' },
        { id: 'attack-rate', category: 'Epidemiology', name: 'Attack Rate', formula: 'AR = Cases during outbreak / Population at risk', definition: 'Cumulative incidence used in the context of outbreaks or epidemics.', interpretation: 'Useful for identifying source of outbreak. Calculate food-specific attack rates.', example: '45 ill among 150 who ate potato salad: AR = 45/150 = 30%' },
        { id: 'af', category: 'Epidemiology', name: 'Attributable Fraction (AF)', formula: 'AF = (RR - 1) / RR', definition: 'Proportion of disease in exposed group attributable to the exposure.', interpretation: 'AF = 0: none attributable; AF = 1: all attributable. Only meaningful for causal exposures.', example: 'RR = 4.0. AF = (4-1)/4 = 0.75 (75% of cases in exposed are due to exposure)' },
        { id: 'paf', category: 'Epidemiology', name: 'Population Attributable Fraction (PAF)', formula: 'PAF = Pe(RR - 1) / [Pe(RR - 1) + 1]', definition: 'Proportion of disease in total population attributable to the exposure.', interpretation: 'Depends on both the strength of association (RR) and prevalence of exposure (Pe). Guides public health priorities.', example: 'RR = 3.0, Pe = 0.30. PAF = 0.30(2)/[0.30(2)+1] = 0.375 (37.5%)' },
        { id: 'smr', category: 'Epidemiology', name: 'Standardized Mortality Ratio (SMR)', formula: 'SMR = Observed deaths / Expected deaths', definition: 'Ratio of observed deaths in study group to expected deaths based on a standard population.', interpretation: 'SMR = 1: same as expected; SMR > 1: excess mortality; SMR < 1: lower mortality.', example: 'Observed = 45 deaths, Expected = 30 deaths. SMR = 45/30 = 1.50' },

        // --- Effect Size Measures ---
        { id: 'cohens-d', category: 'Effect Size', name: "Cohen's d", formula: 'd = (M1 - M2) / SD_pooled', definition: 'Standardized mean difference between two groups.', interpretation: 'Small = 0.2; Medium = 0.5; Large = 0.8 (Cohen, 1988). SD_pooled = sqrt[(s1^2 + s2^2)/2].', example: 'M1 = 75, M2 = 70, SD_pooled = 10. d = (75-70)/10 = 0.50 (medium effect)' },
        { id: 'hedges-g', category: 'Effect Size', name: "Hedges' g", formula: 'g = d * [1 - 3/(4(n1+n2) - 9)]', definition: 'Bias-corrected version of Cohen\'s d for small samples.', interpretation: 'Same interpretation as Cohen\'s d. Preferred when n < 20 per group.', example: 'd = 0.50, n1 = n2 = 15. g = 0.50 * [1 - 3/111] = 0.50 * 0.973 = 0.487' },
        { id: 'r-effect', category: 'Effect Size', name: 'Correlation coefficient (r)', formula: 'r = sum[(xi - x-bar)(yi - y-bar)] / sqrt[sum(xi - x-bar)^2 * sum(yi - y-bar)^2]', definition: 'Pearson correlation measuring linear association between two variables.', interpretation: 'Small = 0.1; Medium = 0.3; Large = 0.5. Range: -1 to +1.', example: 'r = 0.35 indicates a medium positive linear relationship.' },
        { id: 'eta-sq', category: 'Effect Size', name: 'Eta-squared', formula: 'eta^2 = SS_between / SS_total', definition: 'Proportion of total variance explained by group membership in ANOVA.', interpretation: 'Small = 0.01; Medium = 0.06; Large = 0.14. Can overestimate in small samples (use partial eta^2 or omega^2).', example: 'SS_between = 120, SS_total = 1000. eta^2 = 0.12 (medium-large effect)' },
        { id: 'r-squared', category: 'Effect Size', name: 'R-squared', formula: 'R^2 = 1 - (SS_residual / SS_total)', definition: 'Proportion of variance in the outcome explained by the regression model.', interpretation: 'Range 0-1. Higher = better fit. Report adjusted R^2 for multiple predictors. Be cautious of overfitting.', example: 'R^2 = 0.65 means the model explains 65% of the variance in the outcome.' },
        { id: 'phi', category: 'Effect Size', name: 'Phi coefficient', formula: 'phi = sqrt(chi^2 / n)', definition: 'Effect size for 2x2 chi-squared tests. Equivalent to Pearson r for two dichotomous variables.', interpretation: 'Small = 0.1; Medium = 0.3; Large = 0.5. Range: 0 to 1.', example: 'chi^2 = 9.0, n = 100. phi = sqrt(9/100) = 0.30 (medium effect)' },
        { id: 'cramers-v', category: 'Effect Size', name: "Cramer's V", formula: 'V = sqrt(chi^2 / [n * (min(r,c) - 1)])', definition: 'Generalization of phi for tables larger than 2x2.', interpretation: 'Small/medium/large thresholds depend on df. Range: 0 to 1.', example: '3x3 table: chi^2 = 25, n = 200. V = sqrt(25/(200*2)) = 0.25' },

        // --- Sample Size Formulas ---
        { id: 'ss-two-prop', category: 'Sample Size', name: 'Two Proportions', formula: 'n = (z_alpha + z_beta)^2 * [p1(1-p1) + p2(1-p2)] / (p1 - p2)^2', definition: 'Sample size per group for comparing two independent proportions.', interpretation: 'Increase n for: smaller difference, smaller alpha, higher power, proportions near 0.5.', example: 'p1=0.30, p2=0.20, alpha=0.05 (z=1.96), power=0.80 (z=0.84): n = (1.96+0.84)^2*[0.30*0.70+0.20*0.80]/(0.10)^2 = 294 per group' },
        { id: 'ss-two-means', category: 'Sample Size', name: 'Two Means', formula: 'n = 2(z_alpha + z_beta)^2 * sigma^2 / delta^2', definition: 'Sample size per group for comparing two independent means.', interpretation: 'sigma = common SD, delta = meaningful difference. Larger variability requires larger n.', example: 'delta=5, sigma=10, alpha=0.05, power=0.80: n = 2*(1.96+0.84)^2*100/25 = 63 per group' },
        { id: 'ss-single-prop', category: 'Sample Size', name: 'Single Proportion', formula: 'n = z_alpha^2 * p(1-p) / E^2', definition: 'Sample size to estimate a proportion with specified precision E (margin of error).', interpretation: 'Maximum n when p=0.5 (most conservative). E is the half-width of the confidence interval.', example: 'p=0.50 (conservative), E=0.05, alpha=0.05: n = (1.96)^2*0.25/0.0025 = 385' },
        { id: 'ss-survival', category: 'Sample Size', name: 'Survival (Schoenfeld)', formula: 'Events = (z_alpha + z_beta)^2 / [ln(HR)]^2', definition: 'Number of events needed for a survival analysis comparing two groups.', interpretation: 'Divide by event probability and allocation ratio to get total N. HR closer to 1 requires more events.', example: 'HR=0.70, alpha=0.05, power=0.80: Events = (1.96+0.84)^2/(ln(0.70))^2 = 7.84/0.127 = 62 events' },

        // --- Additional Key Formulas ---
        { id: 'wald-ci', category: 'Confidence Interval', name: 'Wald CI for Proportion', formula: 'p +/- z * sqrt(p(1-p)/n)', definition: 'Approximate confidence interval for a single proportion.', interpretation: 'Simple but can give invalid results near 0 or 1. Wilson or Clopper-Pearson preferred for small n or extreme p.', example: 'p = 0.30, n = 100, z = 1.96: CI = 0.30 +/- 1.96*sqrt(0.21/100) = [0.210, 0.390]' },
        { id: 'ci-mean', category: 'Confidence Interval', name: 'CI for Mean', formula: 'x-bar +/- t_(n-1) * (s / sqrt(n))', definition: 'Confidence interval for a population mean based on sample data.', interpretation: 'Uses t-distribution with n-1 df. Width decreases with larger n.', example: 'x-bar = 120, s = 15, n = 25, t = 2.064: CI = 120 +/- 2.064*(15/5) = [113.8, 126.2]' },
        { id: 'ci-or', category: 'Confidence Interval', name: 'CI for Odds Ratio', formula: 'exp[ln(OR) +/- z * sqrt(1/a + 1/b + 1/c + 1/d)]', definition: 'Confidence interval for an odds ratio using the log transformation.', interpretation: 'If CI includes 1, OR is not statistically significant. Asymmetric on natural scale.', example: 'OR = 2.5, a=30, b=20, c=15, d=35: SE = sqrt(1/30+1/20+1/15+1/35) = 0.479. CI = exp(0.916+/-1.96*0.479)' },
        { id: 'bayes-theorem', category: 'Diagnostic', name: "Bayes' Theorem (diagnostic)", formula: 'Post-test odds = Pre-test odds * LR', definition: 'Update probability of disease after a test result using likelihood ratios.', interpretation: 'Convert prevalence to pre-test odds, multiply by LR+ (if positive) or LR- (if negative), convert back to probability.', example: 'Prevalence=10% (odds=0.11), LR+=6.0: Post-test odds = 0.11*6 = 0.67, Post-test probability = 0.67/1.67 = 40%' },
        { id: 'i-squared', category: 'Meta-Analysis', name: 'I-squared (heterogeneity)', formula: 'I^2 = 100% * (Q - df) / Q', definition: 'Percentage of variability in effect estimates due to heterogeneity rather than sampling error.', interpretation: 'Low <25%; Moderate 25-75%; High >75%. I^2=0% does not prove homogeneity.', example: 'Q = 20.0, df = 9. I^2 = 100*(20-9)/20 = 55% (moderate heterogeneity)' }
    ];

    /* ================================================================
     * SECTION 4 — REPORTING CHECKLISTS
     * ================================================================ */

    var reportingChecklists = [
        {
            id: 'consort',
            name: 'CONSORT',
            fullName: 'Consolidated Standards of Reporting Trials',
            studyType: 'Randomized Controlled Trials',
            items: 25,
            url: 'https://www.consort-statement.org/',
            color: '#ef4444',
            keyItems: [
                'Title: Identify as randomized trial',
                'Trial design: description of design (parallel, factorial, etc.)',
                'Participants: eligibility criteria, settings, locations',
                'Interventions: details of each intervention',
                'Outcomes: primary and secondary outcomes defined a priori',
                'Sample size: how determined, interim analyses',
                'Randomization: sequence generation, allocation concealment, implementation',
                'Blinding: who was blinded, how',
                'Statistical methods: primary/secondary analyses, subgroup, adjusted',
                'Participant flow: CONSORT flow diagram required',
                'Recruitment: dates of recruitment and follow-up',
                'Baseline data: table of demographics and clinical characteristics',
                'Numbers analyzed: ITT or per-protocol, specify',
                'Outcomes and estimation: effect sizes with CIs for primary/secondary',
                'Harms: all important adverse events by group',
                'Registration: trial registration number and registry name',
                'Protocol: where full protocol can be accessed',
                'Funding: sources of funding and support'
            ]
        },
        {
            id: 'strobe',
            name: 'STROBE',
            fullName: 'Strengthening the Reporting of Observational Studies in Epidemiology',
            studyType: 'Cohort, Case-control, Cross-sectional studies',
            items: 22,
            url: 'https://www.strobe-statement.org/',
            color: '#f97316',
            keyItems: [
                'Title: indicate study design in title/abstract',
                'Background/rationale: scientific rationale for the study',
                'Objectives: specific objectives, including pre-specified hypotheses',
                'Study design: present key elements of study design early',
                'Setting: describe settings, locations, relevant dates',
                'Participants: eligibility criteria, sources, selection methods',
                'Variables: clearly define all outcomes, exposures, confounders',
                'Data sources/measurement: describe data sources and methods',
                'Bias: describe efforts to address potential sources of bias',
                'Study size: explain how sample size was determined',
                'Statistical methods: describe all methods including confounding control',
                'Descriptive data: characteristics of participants, number at each stage',
                'Outcome data: number of outcome events or summary measures over time',
                'Main results: unadjusted and adjusted estimates with CIs',
                'Other analyses: subgroup, interaction, sensitivity analyses',
                'Limitations: discuss limitations including bias, confounding',
                'Generalizability: discuss external validity',
                'Funding: specify funding sources'
            ]
        },
        {
            id: 'prisma',
            name: 'PRISMA',
            fullName: 'Preferred Reporting Items for Systematic Reviews and Meta-Analyses',
            studyType: 'Systematic Reviews and Meta-Analyses',
            items: 27,
            url: 'https://www.prisma-statement.org/',
            color: '#22d3ee',
            keyItems: [
                'Title: identify the report as a systematic review/meta-analysis',
                'Eligibility criteria: inclusion and exclusion criteria (PICOS)',
                'Information sources: databases, registers, dates of searches',
                'Search strategy: full electronic search strategy for at least one database',
                'Selection process: process of selecting studies (screening, eligibility)',
                'Data collection: process of extracting data, confirmation',
                'Study risk of bias: methods used to assess risk of bias',
                'Effect measures: specify effect measures (RR, OR, MD)',
                'Synthesis methods: meta-analysis methods, heterogeneity assessment',
                'PRISMA flow diagram: show study selection process',
                'Study characteristics: characteristics of included studies',
                'Risk of bias in studies: results of bias assessments',
                'Results of individual studies: forest plots for each outcome',
                'Results of syntheses: present meta-analysis results with CIs',
                'Certainty of evidence: GRADE assessment for each outcome',
                'Registration: PROSPERO or other registration number',
                'Protocol: where protocol can be accessed'
            ]
        },
        {
            id: 'stard',
            name: 'STARD',
            fullName: 'Standards for Reporting Diagnostic Accuracy Studies',
            studyType: 'Diagnostic Accuracy Studies',
            items: 30,
            url: 'https://www.equator-network.org/reporting-guidelines/stard/',
            color: '#10b981',
            keyItems: [
                'Title: identify as diagnostic accuracy study',
                'Index test: describe the test being evaluated',
                'Reference standard: describe the gold standard',
                'Study design: prospective or retrospective, cross-sectional or cohort',
                'Participants: eligibility criteria, recruitment method',
                'Test methods: technical specifications, blinding of assessors',
                'Analysis: methods for calculating diagnostic accuracy',
                'STARD flow diagram: show participant flow',
                'Cross tabulation: 2x2 table of index test vs reference standard',
                'Sensitivity, specificity: with 95% CIs',
                'Indeterminate results: how handled',
                'Adverse events: adverse events from testing'
            ]
        },
        {
            id: 'arrive',
            name: 'ARRIVE',
            fullName: 'Animal Research: Reporting of In Vivo Experiments',
            studyType: 'Animal Research',
            items: 21,
            url: 'https://arriveguidelines.org/',
            color: '#a855f7',
            keyItems: [
                'Study design: type of design, randomization, blinding',
                'Sample size: a priori calculation, methods used',
                'Inclusion/exclusion: criteria applied to animals',
                'Randomization: method of allocation to groups',
                'Blinding: awareness of group allocation',
                'Outcome measures: primary and secondary',
                'Statistical methods: analysis approaches, unit of analysis',
                'Experimental animals: species, strain, sex, age, weight',
                'Housing and husbandry: housing, light cycle, food/water, welfare',
                'Numbers analyzed: each experiment and outcome',
                'Results: effect sizes with CIs for all outcomes',
                'Adverse events: modifications to protocol, unexpected findings'
            ]
        },
        {
            id: 'spirit',
            name: 'SPIRIT',
            fullName: 'Standard Protocol Items: Recommendations for Interventional Trials',
            studyType: 'Clinical Trial Protocols',
            items: 33,
            url: 'https://www.spirit-statement.org/',
            color: '#6366f1',
            keyItems: [
                'Administrative information: title, trial registration, protocol version, funding',
                'Introduction: background, rationale, objectives/hypotheses',
                'Trial design: description, framework (superiority, non-inferiority)',
                'Study setting: sites, relevant characteristics',
                'Eligibility: inclusion and exclusion criteria',
                'Interventions: description of all interventions',
                'Outcomes: primary, secondary, other endpoints with time points',
                'Sample size: calculation methodology, assumptions',
                'Recruitment: strategies for achieving adequate enrollment',
                'Allocation: randomization method, concealment mechanism',
                'Blinding: who is blinded, procedures for unblinding',
                'Data collection: methods, retention plans, follow-up',
                'Statistical methods: analysis plan, interim analyses, subgroups',
                'Data monitoring: composition, reporting structure, stopping rules',
                'Harms: plans for collecting, managing, reporting adverse events',
                'Ethics: IRB approval, consent process, confidentiality',
                'Dissemination: plans for communicating results'
            ]
        }
    ];

    /* ================================================================
     * SECTION 5 — A-Z GLOSSARY (100+ terms)
     * ================================================================ */

    var glossaryTerms = [
        { term: 'Absolute Risk Reduction (ARR)', def: 'The arithmetic difference in event rates between control and treatment groups. ARR = Risk_control - Risk_treatment.' },
        { term: 'Allocation Concealment', def: 'Procedure to prevent foreknowledge of upcoming group assignments in a trial, distinct from blinding.' },
        { term: 'Alpha (Type I Error)', def: 'Probability of rejecting a true null hypothesis (false positive). Conventionally set at 0.05.' },
        { term: 'ANCOVA', def: 'Analysis of covariance. Combines ANOVA and regression to compare group means while controlling for continuous covariates.' },
        { term: 'ANOVA', def: 'Analysis of variance. Tests whether means differ across three or more groups by comparing between-group to within-group variability.' },
        { term: 'Ascertainment Bias', def: 'Systematic difference in identifying cases or outcomes depending on exposure status or other factors.' },
        { term: 'Attrition Bias', def: 'Bias from differential loss to follow-up between study groups.' },
        { term: 'Bayesian Analysis', def: 'Statistical approach that updates prior beliefs with observed data to produce posterior probability distributions.' },
        { term: 'Berkson Bias', def: 'Selection bias in facility-based case-control studies where facility admission rates differ by exposure and disease status.' },
        { term: 'Beta (Type II Error)', def: 'Probability of failing to reject a false null hypothesis (false negative). Power = 1 - beta.' },
        { term: 'Bias', def: 'Systematic error that leads to incorrect estimation of the association between exposure and outcome.' },
        { term: 'Blinding (Masking)', def: 'Concealing group assignments from participants, investigators, or assessors to prevent bias. Can be single, double, or triple.' },
        { term: 'Bonferroni Correction', def: 'Method to adjust for multiple comparisons by dividing alpha by the number of tests performed.' },
        { term: 'Bootstrap', def: 'Resampling method that draws repeated samples with replacement from observed data to estimate variability of statistics.' },
        { term: 'Box Plot', def: 'Graphical display showing median, quartiles (box), and outliers of continuous data distribution.' },
        { term: 'Case-Control Study', def: 'Observational study that selects participants by outcome status (cases vs. controls) and looks back at exposures.' },
        { term: 'Case Fatality Rate (CFR)', def: 'Proportion of persons with a disease who die from it. CFR = Deaths from disease / Persons with disease.' },
        { term: 'Censoring', def: 'In survival analysis, incomplete observation of time to event (e.g., patient lost to follow-up or study ends before event).' },
        { term: 'Chi-squared Test', def: 'Tests whether observed frequencies differ from expected frequencies in categorical data. Requires expected counts >= 5.' },
        { term: 'Clinical Equipoise', def: 'Genuine uncertainty among the expert community about the preferred treatment, ethically justifying randomization.' },
        { term: 'Cluster Randomization', def: 'Randomization of groups (clusters) rather than individuals. Requires design effect adjustment: DE = 1 + (m-1)*ICC.' },
        { term: 'Cohort Study', def: 'Observational study that follows a group of individuals over time to assess exposure-outcome relationships. Can be prospective or retrospective.' },
        { term: "Cohen's d", def: 'Standardized mean difference effect size. Small = 0.2, Medium = 0.5, Large = 0.8.' },
        { term: "Cohen's Kappa", def: 'Measure of inter-rater agreement beyond chance for categorical data. Ranges from -1 to 1; >0.8 = almost perfect.' },
        { term: 'Collinearity', def: 'High correlation between predictor variables in a regression model, causing unstable coefficient estimates.' },
        { term: 'Confidence Interval (CI)', def: 'Range of values within which the true population parameter is expected to fall with a given level of confidence (usually 95%).' },
        { term: 'Confounding', def: 'Distortion of the exposure-outcome association caused by a third variable associated with both exposure and outcome.' },
        { term: 'CONSORT', def: 'Consolidated Standards of Reporting Trials. 25-item checklist and flow diagram for reporting RCTs.' },
        { term: 'Cox Proportional Hazards', def: 'Semi-parametric regression model for time-to-event data. Estimates hazard ratios while adjusting for covariates. Assumes proportional hazards.' },
        { term: 'Cross-sectional Study', def: 'Observational study measuring exposure and outcome simultaneously at one time point. Measures prevalence, not incidence.' },
        { term: 'Crossover Trial', def: 'Trial design where each participant receives all treatments in sequence, serving as their own control.' },
        { term: 'Cumulative Incidence', def: 'Proportion of at-risk population developing disease over a specified period. Also called incidence proportion or risk.' },
        { term: 'DAG (Directed Acyclic Graph)', def: 'Causal diagram using nodes and directed arrows to represent assumed causal relationships among variables. Used for identifying confounders and mediators.' },
        { term: 'Design Effect', def: 'Factor by which variance is inflated due to cluster sampling compared to simple random sampling. DE = 1 + (m-1)*ICC.' },
        { term: 'Diagnostic Odds Ratio (DOR)', def: 'Single measure of diagnostic accuracy. DOR = (TP*TN)/(FP*FN) = LR+/LR-.' },
        { term: 'Dose-Response Relationship', def: 'Pattern where the magnitude of exposure correlates with the magnitude of effect, supporting causality.' },
        { term: 'Ecological Fallacy', def: 'Erroneous inference about individuals based on aggregate (group-level) data.' },
        { term: 'Ecological Study', def: 'Study using aggregate data for populations rather than individuals. Susceptible to ecological fallacy.' },
        { term: 'Effect Modification', def: 'Variation in the effect of an exposure on an outcome across levels of a third variable. Not a bias -- it is a finding to report.' },
        { term: 'Effect Size', def: 'Quantitative measure of the magnitude of a phenomenon. Includes Cohen\'s d, r, OR, RR, HR, eta-squared, etc.' },
        { term: 'Equipoise', def: 'Genuine uncertainty about which treatment is better. Ethical prerequisite for randomized trials.' },
        { term: 'External Validity', def: 'Extent to which study results can be generalized to other populations, settings, or times.' },
        { term: "Fisher's Exact Test", def: 'Exact test for association in 2x2 tables, preferred when expected cell counts are small (< 5).' },
        { term: 'Fixed Effect Model', def: 'Meta-analysis model assuming one true effect size underlying all studies. Weights by inverse variance only.' },
        { term: 'Forest Plot', def: 'Graphical display of results from individual studies and pooled estimate in meta-analysis.' },
        { term: 'Funnel Plot', def: 'Scatter plot of study effect sizes vs. precision (or sample size). Asymmetry suggests publication bias.' },
        { term: 'GRADE', def: 'Grading of Recommendations Assessment, Development and Evaluation. Framework for rating certainty of evidence: High, Moderate, Low, Very Low.' },
        { term: 'Hazard', def: 'Instantaneous rate of an event occurring at time t, given survival to that point.' },
        { term: 'Hazard Ratio (HR)', def: 'Ratio of hazard rates between two groups. HR = 1 means no difference; HR < 1 means lower risk in treatment group.' },
        { term: 'Healthy Worker Effect', def: 'Bias in occupational studies where employed individuals appear healthier than the general population.' },
        { term: 'Heterogeneity', def: 'Variability in study results beyond what is expected from sampling error. Assessed by Q test, I-squared, tau-squared.' },
        { term: 'Hypothesis Testing', def: 'Framework for deciding between null hypothesis (H0: no effect) and alternative hypothesis (H1: effect exists) based on data.' },
        { term: 'I-squared', def: 'Proportion of variability in meta-analysis due to heterogeneity rather than chance. Low < 25%, Moderate 25-75%, High > 75%.' },
        { term: 'Immortal Time Bias', def: 'Bias in cohort studies where a period of follow-up is guaranteed to be event-free, misclassified as exposed person-time.' },
        { term: 'Incidence', def: 'Number of new cases of disease occurring in a population over a specified period.' },
        { term: 'Incidence Rate', def: 'Number of new cases per unit of person-time at risk. Also called incidence density or person-time rate.' },
        { term: 'Information Bias', def: 'Bias from errors in measuring exposure or outcome. Includes recall bias, interviewer bias, misclassification.' },
        { term: 'Intention-to-Treat (ITT)', def: 'Analysis including all participants as randomized regardless of adherence. Preserves randomization and estimates real-world effectiveness.' },
        { term: 'Interaction', def: 'When the effect of one factor on the outcome depends on the level of another factor. Tested by including product term in regression.' },
        { term: 'Internal Validity', def: 'Extent to which a study accurately measures what it intends to measure, free from systematic error.' },
        { term: 'Interquartile Range (IQR)', def: 'Range between 25th and 75th percentiles. Robust measure of dispersion for non-normal distributions.' },
        { term: 'Intraclass Correlation Coefficient (ICC)', def: 'Proportion of total variance attributable to between-cluster differences. Range 0-1. Used for cluster trial design.' },
        { term: 'Kaplan-Meier Curve', def: 'Non-parametric estimate of survival function. Step function that decreases at each event time. Handles censoring.' },
        { term: 'Lead Time Bias', def: 'Apparent survival improvement from early diagnosis (screening) when actual time of death is unchanged.' },
        { term: 'Length Time Bias', def: 'Screening preferentially detects slower-growing diseases, making screened cases appear to have better prognosis.' },
        { term: 'Likelihood Ratio', def: 'Ratio summarizing diagnostic test performance. LR+ = Sens/(1-Spec); LR- = (1-Sens)/Spec.' },
        { term: 'Log-rank Test', def: 'Non-parametric test comparing survival curves between two or more groups. Gives equal weight to all time points.' },
        { term: 'Logistic Regression', def: 'Regression model for binary outcomes. Estimates odds ratios. logit(p) = beta_0 + beta_1*X1 + ...' },
        { term: 'Mann-Whitney U Test', def: 'Non-parametric test comparing distributions of two independent groups. Also called Wilcoxon rank-sum test.' },
        { term: 'Matching', def: 'Design strategy pairing cases and controls (or exposed/unexposed) on potential confounders to control confounding.' },
        { term: "McNemar's Test", def: 'Tests for changes in paired proportions (e.g., before-after). Uses discordant pairs only.' },
        { term: 'Median', def: 'Middle value when data is ordered. Robust to outliers. Preferred over mean for skewed distributions.' },
        { term: 'Meta-Analysis', def: 'Statistical method that combines results from multiple independent studies to produce a weighted overall estimate.' },
        { term: 'Misclassification', def: 'Error in categorizing exposure or outcome status. Differential (related to other variable) or non-differential (random).' },
        { term: 'Mixed Effects Model', def: 'Statistical model containing both fixed effects (population-level) and random effects (individual-level variability).' },
        { term: 'Multiple Comparisons', def: 'Problem of inflated Type I error when performing many statistical tests. Address with Bonferroni, FDR, or similar corrections.' },
        { term: 'Multivariate Analysis', def: 'Statistical methods analyzing multiple variables simultaneously. Includes MANOVA, factor analysis, SEM.' },
        { term: 'Negative Predictive Value (NPV)', def: 'Probability that a negative test result is a true negative. Depends on prevalence.' },
        { term: 'Nested Case-Control Study', def: 'Case-control study within a defined cohort. Cases are matched to controls from the same cohort at the time of case occurrence.' },
        { term: 'Non-inferiority Trial', def: 'Trial designed to show a new treatment is not worse than standard by more than a pre-specified margin.' },
        { term: 'Normal Distribution', def: 'Symmetric bell-shaped probability distribution characterized by mean and standard deviation. ~68% within 1 SD, ~95% within 2 SD.' },
        { term: 'Null Hypothesis (H0)', def: 'Statement of no effect or no association. Statistical tests assess the probability of observed data given H0 is true.' },
        { term: 'Number Needed to Treat (NNT)', def: 'Number of patients needed to treat to prevent one additional adverse outcome. NNT = 1/ARR.' },
        { term: 'Observational Study', def: 'Study in which the investigator does not assign exposure. Includes cohort, case-control, and cross-sectional designs.' },
        { term: 'Odds', def: 'Ratio of probability of event occurring to probability of event not occurring. Odds = p / (1-p).' },
        { term: 'Odds Ratio (OR)', def: 'Ratio of odds of exposure in cases to odds of exposure in controls. Primary measure in case-control studies.' },
        { term: 'Overfitting', def: 'Model that fits noise in the training data rather than the true signal, leading to poor prediction on new data.' },
        { term: 'P-value', def: 'Probability of observing a result at least as extreme as the data, assuming the null hypothesis is true. Not the probability that H0 is true.' },
        { term: 'Per-Protocol Analysis', def: 'Analysis including only participants who completed the study as specified in the protocol. Prone to bias but estimates efficacy.' },
        { term: 'Person-Time', def: 'Sum of time each person is at risk and under observation. Unit of denominaton for incidence rates.' },
        { term: 'Poisson Regression', def: 'Regression model for count outcomes. Assumes mean equals variance. Use negative binomial if overdispersed.' },
        { term: 'Population Attributable Fraction (PAF)', def: 'Proportion of disease in the population attributable to the exposure. Combines RR and exposure prevalence.' },
        { term: 'Positive Predictive Value (PPV)', def: 'Probability that a positive test result is a true positive. Increases with higher prevalence.' },
        { term: 'Power', def: 'Probability of correctly rejecting a false null hypothesis (1 - beta). Conventionally set at 0.80 or 0.90.' },
        { term: 'Precision', def: 'Inverse of variability in an estimate. Greater precision = narrower confidence interval. Increases with sample size.' },
        { term: 'Prevalence', def: 'Proportion of a population with a condition at a specific time point (point prevalence) or over a period (period prevalence).' },
        { term: 'PRISMA', def: 'Preferred Reporting Items for Systematic Reviews and Meta-Analyses. 27-item checklist and flow diagram.' },
        { term: 'Propensity Score', def: 'Probability of treatment assignment conditional on observed covariates. Used for matching, stratification, or weighting to reduce confounding.' },
        { term: 'Proportional Hazards Assumption', def: 'Assumption in Cox regression that the hazard ratio is constant over time. Test with Schoenfeld residuals or log-log plot.' },
        { term: 'Prospective Study', def: 'Study following participants forward in time from exposure to outcome.' },
        { term: 'Publication Bias', def: 'Tendency for studies with positive or significant results to be published more often than null results.' },
        { term: 'Random Effects Model', def: 'Meta-analysis model assuming true effect sizes vary across studies. Incorporates between-study variance (tau-squared).' },
        { term: 'Randomization', def: 'Allocation of participants to groups by chance. Eliminates selection bias and balances known/unknown confounders.' },
        { term: 'Recall Bias', def: 'Systematic difference in the accuracy of recollected information between cases and controls.' },
        { term: 'Regression to the Mean', def: 'Tendency of extreme measurements to move closer to the population mean on repeat testing.' },
        { term: 'Relative Risk (RR)', def: 'Ratio of risk in exposed group to risk in unexposed group. Primary measure in cohort studies and RCTs.' },
        { term: 'Retrospective Study', def: 'Study looking backward from outcome to exposure. Case-control studies are typically retrospective.' },
        { term: 'Risk', def: 'Probability of an event occurring during a specified time period. Range: 0 to 1.' },
        { term: 'Risk Difference', def: 'Absolute difference in risk between two groups. Also called attributable risk or absolute risk reduction.' },
        { term: 'ROC Curve', def: 'Receiver Operating Characteristic curve plotting sensitivity vs. (1-specificity) across all classification thresholds.' },
        { term: 'Sample Size', def: 'Number of observations needed to detect a specified effect with given power and alpha level.' },
        { term: 'Screening', def: 'Application of a test to identify presymptomatic disease in an apparently healthy population.' },
        { term: 'Selection Bias', def: 'Systematic error arising from the manner in which participants are selected or retained in a study.' },
        { term: 'Sensitivity', def: 'Proportion of true positives correctly identified by a test. P(Test+ | Disease+). High sensitivity good for ruling out (SnNout).' },
        { term: 'Sensitivity Analysis', def: 'Re-analysis with different assumptions or parameters to test robustness of findings.' },
        { term: 'Specificity', def: 'Proportion of true negatives correctly identified by a test. P(Test- | Disease-). High specificity good for ruling in (SpPin).' },
        { term: 'Standard Deviation (SD)', def: 'Measure of dispersion around the mean. SD = sqrt(variance). ~68% of data falls within +/- 1 SD of the mean.' },
        { term: 'Standard Error (SE)', def: 'Standard deviation of a sampling distribution. SE = SD / sqrt(n). Measures precision of the sample estimate.' },
        { term: 'Standardized Mean Difference (SMD)', def: 'Difference in means divided by pooled SD. Also called Cohen\'s d. Used to compare across different scales.' },
        { term: 'Statistical Significance', def: 'Result unlikely to have occurred by chance alone (typically p < 0.05). Does not imply clinical significance.' },
        { term: 'Stratification', def: 'Dividing data into subgroups (strata) based on potential confounders to control for their effects.' },
        { term: 'STROBE', def: 'Strengthening the Reporting of Observational Studies in Epidemiology. 22-item checklist for cohort, case-control, and cross-sectional studies.' },
        { term: 'Survival Analysis', def: 'Statistical methods for analyzing time-to-event data with censoring. Includes Kaplan-Meier, log-rank, Cox regression.' },
        { term: 'Systematic Review', def: 'Comprehensive, structured review of literature using explicit methods to identify, select, appraise, and synthesize relevant studies.' },
        { term: 'Tau-squared', def: 'Between-study variance in random effects meta-analysis. Estimated by DerSimonian-Laird, REML, or other methods.' },
        { term: 'Time-to-Event', def: 'Outcome measured as duration until an event occurs. Analyzed with survival methods to account for censoring.' },
        { term: 'Validity', def: 'Extent to which a measurement or study accurately reflects what it is intended to measure (internal) or can be generalized (external).' },
        { term: 'Variance', def: 'Average of squared deviations from the mean. Measures spread of data. SD = sqrt(variance).' },
        { term: 'Wilcoxon Signed-Rank Test', def: 'Non-parametric test for paired data comparing medians. Does not assume normal distribution of differences.' }
    ];

    /* ================================================================
     * RENDERING FUNCTIONS
     * ================================================================ */

    function render(container) {
        var html = App.createModuleLayout(
            'Quick Reference Cards',
            'Printable pocket reference cards for clinical research. Click any card to expand, or print the full set.'
        );

        /* --- Top toolbar --- */
        html += '<div style="margin-bottom:1rem;display:flex;gap:0.5rem;flex-wrap:wrap">'
            + '<button class="btn btn-primary" onclick="window.QuickReference.expandAll()">Expand All</button>'
            + '<button class="btn btn-secondary" onclick="window.QuickReference.collapseAll()">Collapse All</button>'
            + '<button class="btn btn-secondary" onclick="window.print()">Print Cards</button>'
            + '</div>';

        /* --- Tab navigation for sections --- */
        html += '<div id="qr-tab-bar" style="display:flex;gap:0.25rem;flex-wrap:wrap;margin-bottom:1.25rem;border-bottom:2px solid var(--border);padding-bottom:0.5rem">'
            + buildTabBtn('cards', 'Reference Cards', true)
            + buildTabBtn('test-guide', 'Test Selector', false)
            + buildTabBtn('formulas', 'Formulas', false)
            + buildTabBtn('checklists', 'Checklists', false)
            + buildTabBtn('glossary', 'Glossary', false)
            + '</div>';

        /* --- Tab panels --- */

        // Panel 1 — Original card grid
        html += '<div id="qr-panel-cards" class="qr-panel">';
        html += '<div id="qr-cards" style="display:grid;gap:1rem">';
        cards.forEach(function(card, i) {
            html += renderCard(card, i, false);
        });
        html += '</div>';
        html += '</div>';

        // Panel 2 — Statistical Test Selection Guide
        html += '<div id="qr-panel-test-guide" class="qr-panel" style="display:none">';
        html += renderTestGuidePanel();
        html += '</div>';

        // Panel 3 — Common Formulas Reference
        html += '<div id="qr-panel-formulas" class="qr-panel" style="display:none">';
        html += renderFormulasPanel();
        html += '</div>';

        // Panel 4 — Reporting Checklists
        html += '<div id="qr-panel-checklists" class="qr-panel" style="display:none">';
        html += renderChecklistsPanel();
        html += '</div>';

        // Panel 5 — Glossary
        html += '<div id="qr-panel-glossary" class="qr-panel" style="display:none">';
        html += renderGlossaryPanel();
        html += '</div>';

        // Learn section
        html += '<div class="card" style="margin-top:1.5rem">'
            + '<h3 onclick="this.nextElementSibling.classList.toggle(\'hidden\')" style="cursor:pointer">'
            + 'Learn & Reference <span style="font-size:0.8em;color:var(--text-secondary)">[ click to expand ]</span></h3>'
            + '<div class="learn-body hidden" style="margin-top:1rem">'
            + '<h4>About These Reference Cards</h4>'
            + '<ul>'
            + '<li>Each card contains the most commonly needed formulas and criteria for its topic</li>'
            + '<li>Cards are optimized for quick lookup during data analysis or manuscript writing</li>'
            + '<li>Use the <strong>Print</strong> button to create a physical pocket reference</li>'
            + '<li>All formulas use standard epidemiological and biostatistical notation</li>'
            + '</ul>'
            + '<h4>How to Use</h4>'
            + '<ul>'
            + '<li>Click a card header to expand/collapse it</li>'
            + '<li>Use "Expand All" then "Print" for a complete reference sheet</li>'
            + '<li>The color coding matches the navigation categories</li>'
            + '<li>Use the <strong>Test Selector</strong> tab to find the right statistical test via filters</li>'
            + '<li>Use the <strong>Formulas</strong> tab to search 30+ formulas with worked examples</li>'
            + '<li>Use the <strong>Checklists</strong> tab for quick access to CONSORT, STROBE, PRISMA, etc.</li>'
            + '<li>Use the <strong>Glossary</strong> tab for an A-Z searchable reference of 100+ terms</li>'
            + '</ul></div></div>';

        App.setTrustedHTML(container, html);
    }

    function buildTabBtn(panelId, label, active) {
        var style = 'padding:0.5rem 1rem;border:none;border-radius:6px 6px 0 0;cursor:pointer;font-weight:600;font-size:0.85rem;transition:background 0.15s,color 0.15s;';
        if (active) {
            style += 'background:var(--primary);color:#fff;';
        } else {
            style += 'background:transparent;color:var(--text-secondary);';
        }
        return '<button class="qr-tab-btn' + (active ? ' active' : '') + '" data-panel="' + panelId + '" style="' + style + '" onclick="window.QuickReference.switchTab(\'' + panelId + '\')">'
            + label + '</button>';
    }

    /* ------- Test Guide Panel ------- */

    function renderTestGuidePanel() {
        var html = '<div class="card">'
            + '<h3>Statistical Test Selection Guide</h3>'
            + '<p style="color:var(--text-secondary);margin-bottom:1rem;">Use the filters below to find the recommended statistical test for your analysis.</p>';

        // Filters
        html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.75rem;margin-bottom:1rem">'
            + '<div><label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:0.25rem">Data Type</label>'
            + '<select id="qr-filter-datatype" onchange="window.QuickReference.filterTests()" style="width:100%;padding:0.4rem;border-radius:6px;border:1px solid var(--border);background:var(--bg-secondary);color:var(--text-primary)">'
            + '<option value="all">All</option>'
            + '<option value="continuous">Continuous</option>'
            + '<option value="categorical">Categorical</option>'
            + '<option value="ordinal">Ordinal</option>'
            + '<option value="time-to-event">Time-to-event</option>'
            + '</select></div>'
            + '<div><label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:0.25rem">Number of Groups</label>'
            + '<select id="qr-filter-groups" onchange="window.QuickReference.filterTests()" style="width:100%;padding:0.4rem;border-radius:6px;border:1px solid var(--border);background:var(--bg-secondary);color:var(--text-primary)">'
            + '<option value="all">All</option>'
            + '<option value="1">1 group</option>'
            + '<option value="2">2 groups</option>'
            + '<option value="3+">3+ groups</option>'
            + '</select></div>'
            + '<div><label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:0.25rem">Pairing</label>'
            + '<select id="qr-filter-pairing" onchange="window.QuickReference.filterTests()" style="width:100%;padding:0.4rem;border-radius:6px;border:1px solid var(--border);background:var(--bg-secondary);color:var(--text-primary)">'
            + '<option value="all">All</option>'
            + '<option value="independent">Independent</option>'
            + '<option value="paired">Paired / Repeated</option>'
            + '<option value="na">N/A (single group)</option>'
            + '</select></div>'
            + '<div><label style="font-size:0.8rem;font-weight:600;display:block;margin-bottom:0.25rem">Distribution</label>'
            + '<select id="qr-filter-dist" onchange="window.QuickReference.filterTests()" style="width:100%;padding:0.4rem;border-radius:6px;border:1px solid var(--border);background:var(--bg-secondary);color:var(--text-primary)">'
            + '<option value="all">All</option>'
            + '<option value="normal">Normal</option>'
            + '<option value="non-normal">Non-normal</option>'
            + '<option value="any">Any / Not applicable</option>'
            + '</select></div>'
            + '</div>';

        html += '<div style="margin-bottom:0.5rem;font-size:0.8rem;color:var(--text-secondary)" id="qr-test-count">'
            + 'Showing all ' + statTestDB.length + ' tests</div>';

        // Results table
        html += '<div class="table-scroll-wrap"><table id="qr-test-table" style="width:100%;border-collapse:collapse;font-size:0.85rem">'
            + '<thead><tr style="background:var(--bg-secondary)">'
            + '<th style="padding:0.5rem;text-align:left;border-bottom:2px solid var(--border)">Test</th>'
            + '<th style="padding:0.5rem;text-align:left;border-bottom:2px solid var(--border)">Data Type</th>'
            + '<th style="padding:0.5rem;text-align:left;border-bottom:2px solid var(--border)">Groups</th>'
            + '<th style="padding:0.5rem;text-align:left;border-bottom:2px solid var(--border)">Pairing</th>'
            + '<th style="padding:0.5rem;text-align:left;border-bottom:2px solid var(--border)">Distribution</th>'
            + '<th style="padding:0.5rem;text-align:left;border-bottom:2px solid var(--border)">Use Case</th>'
            + '</tr></thead><tbody id="qr-test-tbody">';

        statTestDB.forEach(function(t) {
            html += renderTestRow(t);
        });

        html += '</tbody></table></div></div>';
        return html;
    }

    function renderTestRow(t) {
        var dataLabel = { continuous: 'Continuous', categorical: 'Categorical', ordinal: 'Ordinal', 'time-to-event': 'Time-to-event' };
        var pairLabel = { independent: 'Independent', paired: 'Paired', na: 'N/A' };
        var distLabel = { normal: 'Normal', 'non-normal': 'Non-normal', any: 'Any' };
        return '<tr data-datatype="' + t.dataType + '" data-groups="' + t.groups + '" data-pairing="' + t.pairing + '" data-dist="' + t.distribution + '" style="border-bottom:1px solid var(--border)">'
            + '<td style="padding:0.45rem 0.5rem;font-weight:600">' + t.test + '</td>'
            + '<td style="padding:0.45rem 0.5rem">' + (dataLabel[t.dataType] || t.dataType) + '</td>'
            + '<td style="padding:0.45rem 0.5rem">' + t.groups + '</td>'
            + '<td style="padding:0.45rem 0.5rem">' + (pairLabel[t.pairing] || t.pairing) + '</td>'
            + '<td style="padding:0.45rem 0.5rem">' + (distLabel[t.distribution] || t.distribution) + '</td>'
            + '<td style="padding:0.45rem 0.5rem;color:var(--text-secondary);font-size:0.82rem">' + t.use + '</td>'
            + '</tr>';
    }

    function filterTests() {
        var dt = document.getElementById('qr-filter-datatype');
        var gr = document.getElementById('qr-filter-groups');
        var pa = document.getElementById('qr-filter-pairing');
        var di = document.getElementById('qr-filter-dist');
        if (!dt) return;
        var fDT = dt.value;
        var fGR = gr.value;
        var fPA = pa.value;
        var fDI = di.value;
        var tbody = document.getElementById('qr-test-tbody');
        if (!tbody) return;
        var rows = tbody.querySelectorAll('tr');
        var shown = 0;
        rows.forEach(function(row) {
            var match = true;
            if (fDT !== 'all' && row.getAttribute('data-datatype') !== fDT) match = false;
            if (fGR !== 'all' && row.getAttribute('data-groups') !== fGR) match = false;
            if (fPA !== 'all' && row.getAttribute('data-pairing') !== fPA) match = false;
            if (fDI !== 'all' && row.getAttribute('data-dist') !== fDI) match = false;
            row.style.display = match ? '' : 'none';
            if (match) shown++;
        });
        var countEl = document.getElementById('qr-test-count');
        if (countEl) countEl.textContent = 'Showing ' + shown + ' of ' + statTestDB.length + ' tests';
    }

    /* ------- Formulas Panel ------- */

    function renderFormulasPanel() {
        var html = '<div class="card">'
            + '<h3>Common Formulas Reference</h3>'
            + '<p style="color:var(--text-secondary);margin-bottom:1rem;">Search 30+ key formulas with definitions, interpretation guides, and worked examples.</p>';

        // Search + category filter
        html += '<div style="display:flex;gap:0.75rem;margin-bottom:1rem;flex-wrap:wrap">'
            + '<input type="text" id="qr-formula-search" placeholder="Search formulas..." '
            + 'oninput="window.QuickReference.filterFormulas()" '
            + 'style="flex:1;min-width:200px;padding:0.5rem;border-radius:6px;border:1px solid var(--border);background:var(--bg-secondary);color:var(--text-primary)" />'
            + '<select id="qr-formula-cat" onchange="window.QuickReference.filterFormulas()" '
            + 'style="padding:0.5rem;border-radius:6px;border:1px solid var(--border);background:var(--bg-secondary);color:var(--text-primary)">'
            + '<option value="all">All Categories</option>';

        var cats = [];
        formulasDB.forEach(function(f) {
            if (cats.indexOf(f.category) === -1) cats.push(f.category);
        });
        cats.forEach(function(c) {
            html += '<option value="' + c + '">' + c + '</option>';
        });
        html += '</select></div>';

        html += '<div id="qr-formula-count" style="margin-bottom:0.75rem;font-size:0.8rem;color:var(--text-secondary)">'
            + 'Showing all ' + formulasDB.length + ' formulas</div>';

        // Formula cards
        html += '<div id="qr-formula-list" style="display:grid;gap:0.75rem">';
        formulasDB.forEach(function(f) {
            html += renderFormulaCard(f);
        });
        html += '</div></div>';
        return html;
    }

    function renderFormulaCard(f) {
        return '<div class="card qr-formula-card" data-cat="' + f.category + '" data-search="' + (f.name + ' ' + f.category + ' ' + f.definition).toLowerCase() + '" '
            + 'style="border-left:3px solid var(--primary);padding:0.75rem 1rem">'
            + '<div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:0.5rem">'
            + '<div>'
            + '<div style="font-weight:700;font-size:0.95rem">' + f.name + '</div>'
            + '<span style="font-size:0.7rem;background:var(--bg-secondary);padding:0.15rem 0.5rem;border-radius:99px;color:var(--text-secondary)">' + f.category + '</span>'
            + '</div></div>'
            + '<div style="margin:0.6rem 0;padding:0.5rem 0.75rem;background:var(--bg-secondary);border-radius:6px;font-family:monospace;font-size:0.88rem;overflow-x:auto;white-space:nowrap">'
            + f.formula + '</div>'
            + '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:0.35rem"><strong>Definition:</strong> ' + f.definition + '</div>'
            + '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:0.35rem"><strong>Interpretation:</strong> ' + f.interpretation + '</div>'
            + '<div style="font-size:0.85rem;color:var(--text-secondary)"><strong>Example:</strong> ' + f.example + '</div>'
            + '</div>';
    }

    function filterFormulas() {
        var searchEl = document.getElementById('qr-formula-search');
        var catEl = document.getElementById('qr-formula-cat');
        if (!searchEl || !catEl) return;
        var q = searchEl.value.toLowerCase().trim();
        var cat = catEl.value;
        var cards_el = document.querySelectorAll('.qr-formula-card');
        var shown = 0;
        cards_el.forEach(function(card) {
            var matchCat = (cat === 'all' || card.getAttribute('data-cat') === cat);
            var matchSearch = (!q || card.getAttribute('data-search').indexOf(q) > -1);
            card.style.display = (matchCat && matchSearch) ? '' : 'none';
            if (matchCat && matchSearch) shown++;
        });
        var countEl = document.getElementById('qr-formula-count');
        if (countEl) countEl.textContent = 'Showing ' + shown + ' of ' + formulasDB.length + ' formulas';
    }

    /* ------- Checklists Panel ------- */

    function renderChecklistsPanel() {
        var html = '<div class="card">'
            + '<h3>Reporting Checklist Quick Access</h3>'
            + '<p style="color:var(--text-secondary);margin-bottom:1rem;">One-click access to essential reporting checklists. Click a checklist to view its key items summary.</p>'
            + '</div>';

        // Button grid
        html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:0.75rem;margin-bottom:1rem">';
        reportingChecklists.forEach(function(cl) {
            html += '<button class="card" style="border-left:4px solid ' + cl.color + ';cursor:pointer;text-align:left;padding:1rem" '
                + 'onclick="window.QuickReference.showChecklist(\'' + cl.id + '\')">'
                + '<div style="font-weight:700;font-size:1.1rem;margin-bottom:0.25rem">' + cl.name + '</div>'
                + '<div style="font-size:0.75rem;color:var(--text-secondary)">' + cl.studyType + '</div>'
                + '<div style="font-size:0.75rem;color:var(--text-secondary);margin-top:0.25rem">' + cl.items + ' items</div>'
                + '</button>';
        });
        html += '</div>';

        // Detail area
        html += '<div id="qr-checklist-detail"></div>';
        return html;
    }

    function showChecklist(id) {
        var cl = null;
        for (var i = 0; i < reportingChecklists.length; i++) {
            if (reportingChecklists[i].id === id) { cl = reportingChecklists[i]; break; }
        }
        if (!cl) return;
        var el = document.getElementById('qr-checklist-detail');
        if (!el) return;

        var html = '<div class="card" style="border-left:4px solid ' + cl.color + '">'
            + '<div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem">'
            + '<div>'
            + '<h3 style="margin:0">' + cl.name + ' &mdash; ' + cl.fullName + '</h3>'
            + '<p style="color:var(--text-secondary);margin:0.25rem 0 0;font-size:0.9rem">' + cl.studyType + ' &bull; ' + cl.items + ' items</p>'
            + '</div>'
            + '<a href="' + cl.url + '" target="_blank" rel="noopener" class="btn btn-primary" style="font-size:0.85rem;text-decoration:none">Visit Official Site</a>'
            + '</div>'
            + '<h4 style="margin-bottom:0.5rem">Key Items Summary</h4>'
            + '<div class="table-scroll-wrap"><table style="width:100%;border-collapse:collapse;font-size:0.85rem">';

        cl.keyItems.forEach(function(item, idx) {
            html += '<tr style="border-bottom:1px solid var(--border)">'
                + '<td style="padding:0.4rem 0.5rem;font-weight:600;width:30px;color:var(--text-secondary)">' + (idx + 1) + '</td>'
                + '<td style="padding:0.4rem 0.5rem">' + item + '</td></tr>';
        });

        html += '</table></div></div>';
        App.setTrustedHTML(el, html);
    }

    /* ------- Glossary Panel ------- */

    function renderGlossaryPanel() {
        // Build letter index
        var letters = {};
        glossaryTerms.forEach(function(g) {
            var l = g.term.charAt(0).toUpperCase();
            if (!letters[l]) letters[l] = [];
            letters[l].push(g);
        });
        var sortedLetters = Object.keys(letters).sort();

        var html = '<div class="card">'
            + '<h3>A-Z Glossary of Epidemiology & Biostatistics</h3>'
            + '<p style="color:var(--text-secondary);margin-bottom:1rem;">' + glossaryTerms.length + ' terms with concise definitions. Use the search box to filter.</p>';

        // Search
        html += '<input type="text" id="qr-glossary-search" placeholder="Search glossary..." '
            + 'oninput="window.QuickReference.filterGlossary()" '
            + 'style="width:100%;max-width:400px;padding:0.5rem;border-radius:6px;border:1px solid var(--border);background:var(--bg-secondary);color:var(--text-primary);margin-bottom:0.75rem" />';

        // Letter jump bar
        html += '<div style="display:flex;flex-wrap:wrap;gap:0.25rem;margin-bottom:1rem">';
        sortedLetters.forEach(function(l) {
            html += '<a href="javascript:void(0)" onclick="window.QuickReference.jumpToLetter(\'' + l + '\')" '
                + 'style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;border-radius:4px;background:var(--bg-secondary);color:var(--text-primary);font-weight:600;font-size:0.8rem;text-decoration:none">'
                + l + '</a>';
        });
        html += '</div>';

        html += '<div id="qr-glossary-count" style="margin-bottom:0.75rem;font-size:0.8rem;color:var(--text-secondary)">Showing all ' + glossaryTerms.length + ' terms</div>';

        // Terms list
        html += '<div id="qr-glossary-list">';
        sortedLetters.forEach(function(l) {
            html += '<div class="qr-glossary-letter" id="qr-gloss-' + l + '" style="font-size:1.3rem;font-weight:700;color:var(--primary);margin:1rem 0 0.5rem;border-bottom:2px solid var(--primary);padding-bottom:0.25rem">' + l + '</div>';
            letters[l].forEach(function(g) {
                html += '<div class="qr-glossary-term" data-search="' + (g.term + ' ' + g.def).toLowerCase() + '" '
                    + 'style="padding:0.5rem 0;border-bottom:1px solid var(--border)">'
                    + '<span style="font-weight:600">' + g.term + '</span>'
                    + '<span style="color:var(--text-secondary);font-size:0.88rem;margin-left:0.25rem">&mdash; ' + g.def + '</span>'
                    + '</div>';
            });
        });
        html += '</div></div>';
        return html;
    }

    function filterGlossary() {
        var searchEl = document.getElementById('qr-glossary-search');
        if (!searchEl) return;
        var q = searchEl.value.toLowerCase().trim();
        var terms = document.querySelectorAll('.qr-glossary-term');
        var letterDivs = document.querySelectorAll('.qr-glossary-letter');
        var shown = 0;
        var visibleLetters = {};

        terms.forEach(function(t) {
            var match = !q || t.getAttribute('data-search').indexOf(q) > -1;
            t.style.display = match ? '' : 'none';
            if (match) {
                shown++;
                // Find the preceding letter heading
                var prev = t.previousElementSibling;
                while (prev && !prev.classList.contains('qr-glossary-letter')) {
                    prev = prev.previousElementSibling;
                }
                if (prev) visibleLetters[prev.id] = true;
            }
        });

        letterDivs.forEach(function(ld) {
            ld.style.display = (!q || visibleLetters[ld.id]) ? '' : 'none';
        });

        var countEl = document.getElementById('qr-glossary-count');
        if (countEl) countEl.textContent = 'Showing ' + shown + ' of ' + glossaryTerms.length + ' terms';
    }

    function jumpToLetter(letter) {
        var el = document.getElementById('qr-gloss-' + letter);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ------- Tab switching ------- */

    function switchTab(panelId) {
        // Hide all panels
        var panels = document.querySelectorAll('.qr-panel');
        panels.forEach(function(p) { p.style.display = 'none'; });

        // Show target panel
        var target = document.getElementById('qr-panel-' + panelId);
        if (target) target.style.display = '';

        // Update tab buttons
        var btns = document.querySelectorAll('.qr-tab-btn');
        btns.forEach(function(b) {
            var isActive = b.getAttribute('data-panel') === panelId;
            b.classList.toggle('active', isActive);
            b.style.background = isActive ? 'var(--primary)' : 'transparent';
            b.style.color = isActive ? '#fff' : 'var(--text-secondary)';
        });
    }

    /* ================================================================
     * EXISTING CARD RENDERING + TOGGLE (preserved exactly)
     * ================================================================ */

    function renderCard(card, index, expanded) {
        var exp = expanded ? '' : ' style="display:none"';
        return '<div class="card" id="qr-card-' + index + '" style="border-left:4px solid ' + card.color + '">'
            + '<h3 onclick="window.QuickReference.toggle(' + index + ')" style="cursor:pointer;margin:0;display:flex;justify-content:space-between;align-items:center">'
            + '<span>' + card.title + '</span>'
            + '<span style="font-size:0.75em;color:var(--text-secondary)" id="qr-arrow-' + index + '">' + (expanded ? '\u25BC' : '\u25B6') + '</span>'
            + '</h3>'
            + '<div id="qr-body-' + index + '"' + exp + '>' + renderCardBody(card) + '</div>'
            + '</div>';
    }

    function renderCardBody(card) {
        var html = '';
        card.content.forEach(function(section) {
            html += '<h4 style="color:var(--text-secondary);margin:1rem 0 0.5rem;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em">'
                + section.heading + '</h4>';
            html += '<table style="width:100%;border-collapse:collapse;font-size:0.88rem">';
            section.items.forEach(function(item) {
                html += '<tr style="border-bottom:1px solid var(--border)">'
                    + '<td style="padding:0.35rem 0.5rem;font-weight:600;white-space:nowrap;width:40%;vertical-align:top">' + item[0] + '</td>'
                    + '<td style="padding:0.35rem 0.5rem;color:var(--text-secondary)">' + item[1] + '</td></tr>';
            });
            html += '</table>';
        });
        return html;
    }

    function toggle(index) {
        var body = document.getElementById('qr-body-' + index);
        var arrow = document.getElementById('qr-arrow-' + index);
        if (!body) return;
        if (body.style.display === 'none') {
            body.style.display = '';
            if (arrow) arrow.textContent = '\u25BC';
        } else {
            body.style.display = 'none';
            if (arrow) arrow.textContent = '\u25B6';
        }
    }

    function expandAll() {
        cards.forEach(function(_, i) {
            var body = document.getElementById('qr-body-' + i);
            var arrow = document.getElementById('qr-arrow-' + i);
            if (body) body.style.display = '';
            if (arrow) arrow.textContent = '\u25BC';
        });
    }

    function collapseAll() {
        cards.forEach(function(_, i) {
            var body = document.getElementById('qr-body-' + i);
            var arrow = document.getElementById('qr-arrow-' + i);
            if (body) body.style.display = 'none';
            if (arrow) arrow.textContent = '\u25B6';
        });
    }

    /* ================================================================
     * PUBLIC API — window.QuickReference
     * ================================================================ */

    window.QuickReference = {
        toggle: toggle,
        expandAll: expandAll,
        collapseAll: collapseAll,
        switchTab: switchTab,
        filterTests: filterTests,
        filterFormulas: filterFormulas,
        showChecklist: showChecklist,
        filterGlossary: filterGlossary,
        jumpToLetter: jumpToLetter
    };

    App.registerModule(MODULE_ID, { render: render });
})();
