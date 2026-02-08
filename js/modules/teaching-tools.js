/**
 * Neuro-Epi — Teaching & Mentoring Tools
 * Interactive educational tools for teaching epidemiology, biostatistics, and clinical research methods.
 * Features: Biostatistics Quiz Generator, Concept Flashcards, Study Design Decision Tree,
 *           Journal Club Worksheet, Concept Maps, Glossary
 */
(function () {
    'use strict';
    var MODULE_ID = 'teaching-tools';

    var currentTool = 'biostats-quiz';

    /* ------------------------------------------------------------------ */
    /*  Biostatistics Quiz Generator — 35 questions                       */
    /* ------------------------------------------------------------------ */
    var biostatQuizBank = [
        // Study Design Identification (8 questions)
        {
            q: 'Researchers survey 500 adults in a community on one day, measuring blood pressure and dietary salt intake simultaneously. What study design is this?',
            options: ['Cohort study', 'Case-control study', 'Cross-sectional study', 'Ecological study'],
            answer: 2,
            explanation: 'A cross-sectional study measures exposure and outcome at the same point in time. Because there is no follow-up and no temporal sequence established, this is cross-sectional.'
        },
        {
            q: 'A group of 10,000 nurses free of cardiovascular disease are enrolled and followed for 20 years, with periodic assessment of diet and incident MI. What study design is this?',
            options: ['Randomized controlled trial', 'Prospective cohort study', 'Retrospective cohort study', 'Case-control study'],
            answer: 1,
            explanation: 'This is a prospective cohort study: a defined population is assembled, exposure (diet) is measured at baseline and during follow-up, and the outcome (MI) is ascertained over time going forward.'
        },
        {
            q: 'Using hospital discharge records from 2010-2020, researchers identify patients who had DVT and compare prior oral contraceptive use to matched controls without DVT. What study design is this?',
            options: ['Prospective cohort study', 'Retrospective cohort study', 'Case-control study', 'Cross-sectional study'],
            answer: 2,
            explanation: 'Participants are selected based on outcome (DVT vs no DVT) and exposure is ascertained retrospectively from records. This is the hallmark of a case-control design.'
        },
        {
            q: 'A hospital assigns even-numbered beds to receive a new hand hygiene protocol and odd-numbered beds to standard care. This is best described as:',
            options: ['Randomized controlled trial', 'Quasi-experimental study', 'Cohort study', 'Case-control study'],
            answer: 1,
            explanation: 'Allocation based on bed number is systematic but not truly random. This is a quasi-experimental (non-randomized interventional) study because the intervention is assigned but without proper randomization.'
        },
        {
            q: 'A researcher reviews national mortality rates for heart disease across 50 countries and correlates them with average saturated fat consumption per capita. This is:',
            options: ['Cohort study', 'Case-control study', 'Ecological study', 'Cross-sectional study'],
            answer: 2,
            explanation: 'An ecological study uses aggregate (population-level) data rather than individual-level data. The unit of analysis is the country, not the person, making it susceptible to the ecological fallacy.'
        },
        {
            q: 'Patients with newly diagnosed epilepsy are randomized to levetiracetam vs. lamotrigine. Seizure freedom at 12 months is the primary endpoint. Which design is this?',
            options: ['Randomized controlled trial', 'Prospective cohort study', 'Pragmatic trial', 'Case series'],
            answer: 0,
            explanation: 'This is a classic randomized controlled trial (RCT): patients are randomized to intervention groups and followed to an endpoint. It could also be pragmatic, but the core design is an RCT.'
        },
        {
            q: 'Investigators compare outcomes between patients who chose surgery vs. conservative management for lumbar stenosis, using propensity score matching. What design is this?',
            options: ['Randomized controlled trial', 'Prospective cohort study with propensity adjustment', 'Case-control study', 'Cross-sectional study'],
            answer: 1,
            explanation: 'This is an observational cohort study because exposure (surgery) is not randomized but self-selected. Propensity score matching is used to reduce confounding by indication, but it does not make this an RCT.'
        },
        {
            q: 'Ten patients with a rare autoimmune encephalitis are described in detail, including demographics, treatment, and outcomes. No comparison group exists. This is a:',
            options: ['Case-control study', 'Case series', 'Cohort study', 'Cross-sectional study'],
            answer: 1,
            explanation: 'A case series is a descriptive study of a group of patients with a specific condition, without a comparison group. It is useful for rare conditions but cannot establish causation.'
        },
        // Bias Identification (7 questions)
        {
            q: 'In a case-control study of brain tumors and cell phone use, cases may remember their phone use differently than controls. This is an example of:',
            options: ['Selection bias', 'Recall bias', 'Lead-time bias', 'Attrition bias'],
            answer: 1,
            explanation: 'Recall bias occurs when cases report past exposures differently (usually more thoroughly) than controls because their disease status motivates them to search for explanations. This is a type of information bias.'
        },
        {
            q: 'A study of hospital patients finds a strong association between two diseases that is absent in the general population. This discrepancy is due to:',
            options: ['Confounding', 'Berkson bias', 'Misclassification bias', 'Ecological fallacy'],
            answer: 1,
            explanation: 'Berkson bias (admission rate bias) occurs when hospital-based sampling creates a spurious association because the probability of hospitalization differs by disease status. Both diseases independently increase hospitalization probability.'
        },
        {
            q: 'A screening program detects cancer earlier but does not change the time of death. Survival from diagnosis appears longer. This phenomenon is called:',
            options: ['Length-time bias', 'Lead-time bias', 'Detection bias', 'Immortal time bias'],
            answer: 1,
            explanation: 'Lead-time bias occurs when earlier detection by screening shifts the time of diagnosis forward without actually extending life, making survival time from diagnosis appear longer than it truly is.'
        },
        {
            q: 'In a cohort study, 30% of the unexposed group is lost to follow-up while only 5% of the exposed group is lost. This may cause:',
            options: ['Confounding', 'Recall bias', 'Attrition bias (differential loss to follow-up)', 'Immortal time bias'],
            answer: 2,
            explanation: 'Differential loss to follow-up (attrition bias) occurs when the reasons for dropout differ between groups. This can distort the association if those lost differ from those remaining in outcome risk.'
        },
        {
            q: 'A pharmacoepidemiologic study compares outcomes of a new drug vs. an old drug, but the new drug group has "immortal" person-time before the first prescription. This is:',
            options: ['Lead-time bias', 'Immortal time bias', 'Confounding by indication', 'Healthy user bias'],
            answer: 1,
            explanation: 'Immortal time bias arises when a period of follow-up during which the outcome cannot occur (because the subject must survive to receive the exposure) is misclassified or included in the exposed group, creating a spurious protective effect.'
        },
        {
            q: 'A non-differential misclassification of a binary exposure in a cohort study will generally bias the estimate of association toward:',
            options: ['Away from the null', 'Toward the null', 'It has no predictable direction', 'Toward an odds ratio of 2.0'],
            answer: 1,
            explanation: 'Non-differential misclassification of a binary exposure (where the error rate is the same in diseased and non-diseased) biases the risk ratio or odds ratio toward the null (toward 1.0). This is a well-established principle in epidemiology.'
        },
        {
            q: 'A study finds that coffee drinking is associated with lung cancer risk. However, the association disappears after adjusting for smoking. The unadjusted result was likely due to:',
            options: ['Selection bias', 'Recall bias', 'Confounding', 'Effect modification'],
            answer: 2,
            explanation: 'Confounding occurs when a third variable (smoking) is associated with both the exposure (coffee) and the outcome (lung cancer) and distorts their apparent relationship. Adjustment for smoking removes the confounding.'
        },
        // Statistical Test Selection (7 questions)
        {
            q: 'You want to compare mean systolic blood pressure between two independent groups (drug A vs. placebo). Data are normally distributed. The appropriate test is:',
            options: ['Paired t-test', 'Independent samples t-test', 'Chi-squared test', 'Mann-Whitney U test'],
            answer: 1,
            explanation: 'An independent samples t-test compares means of a continuous, normally distributed variable between two independent groups. Since the groups are independent (different patients), and data are normal, this is the correct choice.'
        },
        {
            q: 'You want to compare the proportion of patients achieving seizure freedom between three treatment groups. The appropriate test is:',
            options: ['Independent t-test', 'Chi-squared test', 'Paired t-test', 'Pearson correlation'],
            answer: 1,
            explanation: 'The chi-squared test compares proportions (categorical outcomes) across two or more independent groups. With three groups and a binary outcome, this is the correct choice. (Fisher exact if expected counts are small.)'
        },
        {
            q: 'Researchers measure pain scores (ordinal 0-10 scale) before and after an intervention in the same 30 patients. The best non-parametric test is:',
            options: ['Mann-Whitney U test', 'Wilcoxon signed-rank test', 'Chi-squared test', 'Kruskal-Wallis test'],
            answer: 1,
            explanation: 'The Wilcoxon signed-rank test is the non-parametric equivalent of the paired t-test. It is appropriate for ordinal or non-normally distributed paired data (same subjects measured twice).'
        },
        {
            q: 'To assess the relationship between a continuous predictor (age) and a binary outcome (stroke yes/no), the appropriate regression model is:',
            options: ['Linear regression', 'Logistic regression', 'Cox proportional hazards', 'Poisson regression'],
            answer: 1,
            explanation: 'Logistic regression models the log-odds of a binary outcome as a function of continuous or categorical predictors. It is the standard approach for binary outcomes when time-to-event is not the focus.'
        },
        {
            q: 'You want to compare time to recurrence of brain tumor among three surgical approaches, accounting for censoring. The appropriate test is:',
            options: ['One-way ANOVA', 'Log-rank test', 'Chi-squared test', 'Friedman test'],
            answer: 1,
            explanation: 'The log-rank test compares survival curves (time-to-event data with censoring) across two or more groups. It is the standard non-parametric test for comparing Kaplan-Meier curves.'
        },
        {
            q: 'When comparing means across four treatment groups with continuous normally distributed data, the initial omnibus test should be:',
            options: ['Multiple t-tests', 'One-way ANOVA', 'Chi-squared test', 'Mann-Whitney U test'],
            answer: 1,
            explanation: 'One-way ANOVA is the appropriate omnibus test for comparing means across more than two groups. Multiple pairwise t-tests inflate the Type I error rate. Post-hoc tests (Tukey, Bonferroni) follow a significant ANOVA.'
        },
        {
            q: 'You have count data (number of hospital readmissions per patient over 1 year) and want to model predictors of readmission. The best model is:',
            options: ['Linear regression', 'Logistic regression', 'Poisson regression (or negative binomial)', 'Cox proportional hazards'],
            answer: 2,
            explanation: 'Poisson regression models count outcomes (non-negative integers). If there is overdispersion (variance > mean), negative binomial regression is preferred. Linear regression is not appropriate for count data.'
        },
        // Interpretation of Results (7 questions)
        {
            q: 'An RCT reports an odds ratio of 0.60 (95% CI: 0.42-0.86) for stroke with the new anticoagulant vs. warfarin. This means:',
            options: [
                'The new drug increases stroke risk by 40%',
                'The new drug reduces the odds of stroke by 40% compared to warfarin, and this is statistically significant',
                'The new drug reduces the odds of stroke by 60%',
                'The result is not statistically significant'
            ],
            answer: 1,
            explanation: 'OR = 0.60 means the odds of stroke are 40% lower (1 - 0.60 = 0.40) in the new drug group. The 95% CI (0.42-0.86) does not include 1.0, so the result is statistically significant at alpha = 0.05.'
        },
        {
            q: 'A hazard ratio of 1.35 (95% CI: 1.10-1.65) for mortality comparing patients with vs. without diabetes means:',
            options: [
                'Diabetic patients have 35% lower mortality risk',
                'Diabetic patients have 35% higher instantaneous rate of death at any given time',
                'Diabetic patients live 35% shorter lives',
                'The result is not statistically significant'
            ],
            answer: 1,
            explanation: 'HR = 1.35 means the instantaneous rate (hazard) of death is 35% higher in diabetic vs. non-diabetic patients at any point during follow-up. The CI excludes 1.0, confirming statistical significance.'
        },
        {
            q: 'The NNT is 25 for a statin preventing one MI over 5 years. If 1000 patients take the statin for 5 years, approximately how many MIs are prevented?',
            options: ['25', '40', '100', '250'],
            answer: 1,
            explanation: 'NNT = 25 means 1 MI is prevented per 25 treated patients. For 1000 patients: 1000 / 25 = 40 MIs prevented over the 5-year period.'
        },
        {
            q: 'A study reports RR = 2.0 and the prevalence of exposure in the population is 20%. What is the population attributable risk percent (PAR%)?',
            options: ['10%', 'Approximately 17%', '20%', '40%'],
            answer: 1,
            explanation: 'PAR% = Pe(RR-1) / [Pe(RR-1) + 1] where Pe is prevalence of exposure. PAR% = 0.20(2.0-1) / [0.20(2.0-1) + 1] = 0.20 / 1.20 = 0.167 or approximately 17%.'
        },
        {
            q: 'A meta-analysis reports a pooled risk ratio of 0.75 (95% CI: 0.55-1.02, p = 0.07). The correct interpretation is:',
            options: [
                'The treatment significantly reduces risk by 25%',
                'There is a trend toward 25% risk reduction but it is not statistically significant at the conventional 0.05 level',
                'The treatment has no effect at all',
                'The confidence interval is too narrow'
            ],
            answer: 1,
            explanation: 'The point estimate (RR=0.75) suggests a 25% risk reduction, but the 95% CI crosses 1.0 and p > 0.05, meaning the result is not statistically significant at the conventional alpha level. The CI range (0.55-1.02) suggests the true effect could range from a 45% reduction to a 2% increase.'
        },
        {
            q: 'A diagnostic test has sensitivity 90% and specificity 95%. In a population with 1% disease prevalence, the positive predictive value is approximately:',
            options: ['90%', '50%', '15%', '95%'],
            answer: 2,
            explanation: 'Using Bayes theorem: PPV = (Sens x Prev) / [(Sens x Prev) + ((1-Spec) x (1-Prev))] = (0.90 x 0.01) / [(0.90 x 0.01) + (0.05 x 0.99)] = 0.009 / (0.009 + 0.0495) = 0.009 / 0.0585 = 15.4%. Even with a very good test, PPV is low when prevalence is low.'
        },
        {
            q: 'If the 95% CI for a mean difference is (2.1, 8.3) mmHg, which statement is correct?',
            options: [
                'The true difference is between 2.1 and 8.3 with 95% probability',
                '95% of individual patients will have a difference between 2.1 and 8.3',
                'If we repeated the study many times, 95% of such intervals would contain the true mean difference',
                'The p-value is greater than 0.05'
            ],
            answer: 2,
            explanation: 'The frequentist interpretation of a 95% CI is that if the study were repeated many times, 95% of the calculated intervals would contain the true population parameter. It does NOT mean there is a 95% probability the parameter is in this specific interval.'
        },
        // P-value and CI Interpretation (6 questions)
        {
            q: 'Study A (N=50) finds p=0.04 and Study B (N=5000) finds p=0.04 for the same outcome. Which statement is most accurate?',
            options: [
                'Both studies provide identical evidence against the null',
                'Study B likely detected a smaller effect size than Study A',
                'Study A has more statistical power',
                'The p-values are not comparable'
            ],
            answer: 1,
            explanation: 'With the same p-value but vastly different sample sizes, Study B (larger N) likely detected a much smaller effect size. Larger studies can achieve statistical significance with clinically trivial effects, illustrating why effect size matters more than p-values alone.'
        },
        {
            q: 'A researcher finds p=0.001. A colleague says "there is only a 0.1% chance the null hypothesis is true." This statement is:',
            options: [
                'Correct — that is what p-values mean',
                'Incorrect — the p-value is not the probability that H0 is true',
                'Correct — but only for two-sided tests',
                'Incorrect — it should be 99.9%'
            ],
            answer: 1,
            explanation: 'This is the most common misinterpretation of p-values. The p-value is P(data | H0), not P(H0 | data). The probability that H0 is true requires Bayesian reasoning and a prior probability, which the p-value does not provide.'
        },
        {
            q: 'If a 99% CI is wider than a 95% CI for the same data, this is because:',
            options: [
                'The 99% CI has a higher probability of containing the true parameter',
                'The 99% CI used a larger sample',
                'The 99% CI is less precise',
                'Both A and C are correct'
            ],
            answer: 3,
            explanation: 'A 99% CI is wider than a 95% CI because greater confidence requires a wider interval. There is a direct tradeoff: higher confidence level = wider interval = less precision. Both A and C are correct statements.'
        },
        {
            q: 'A study with N=20 finds a large effect (d=0.9) but p=0.08. The most likely explanation is:',
            options: [
                'The effect does not exist',
                'The study was underpowered to detect the effect at alpha=0.05',
                'The effect size calculation is wrong',
                'The test used was inappropriate'
            ],
            answer: 1,
            explanation: 'A large effect size with a non-significant p-value in a small sample is the hallmark of an underpowered study. With only 20 subjects, even a large true effect may not reach statistical significance. This underscores the importance of adequate sample size/power calculations.'
        },
        {
            q: 'Multiple comparisons: if you perform 20 independent tests at alpha=0.05, the expected number of false positives is:',
            options: ['0.05', '0.5', '1', '5'],
            answer: 2,
            explanation: 'The expected number of false positives = number of tests x alpha = 20 x 0.05 = 1. This is why multiple testing corrections (Bonferroni, FDR) are needed when performing many simultaneous tests.'
        },
        {
            q: 'Applying a Bonferroni correction for 10 comparisons at an overall alpha of 0.05, the adjusted significance threshold for each individual test is:',
            options: ['0.05', '0.01', '0.005', '0.001'],
            answer: 2,
            explanation: 'The Bonferroni correction divides the overall alpha by the number of comparisons: 0.05 / 10 = 0.005. Each individual test must have p < 0.005 to be considered significant. This is conservative but controls the family-wise error rate.'
        }
    ];

    /* ------------------------------------------------------------------ */
    /*  Concept Flashcard Deck — 45 cards                                  */
    /* ------------------------------------------------------------------ */
    var flashcardDeck = [
        { term: 'Incidence Rate', definition: 'The rate of new cases of disease per unit of person-time at risk. Accounts for varying follow-up durations.', example: 'If 10 strokes occur in 5,000 person-years of observation, the incidence rate is 10/5000 = 2 per 1,000 person-years.' },
        { term: 'Prevalence', definition: 'The proportion of a population that has a disease at a specific point (point prevalence) or during a time period (period prevalence).', example: 'If 200 out of 10,000 people have epilepsy on January 1, the point prevalence is 200/10,000 = 2%.' },
        { term: 'Relative Risk (Risk Ratio)', definition: 'The ratio of the risk of disease in the exposed group to the risk in the unexposed group. Used in cohort studies and RCTs.', example: 'If 10% of smokers and 2% of non-smokers develop lung cancer, RR = 0.10/0.02 = 5.0.' },
        { term: 'Odds Ratio', definition: 'The ratio of the odds of exposure among cases to the odds of exposure among controls. The primary measure of association in case-control studies.', example: 'If 60/40 cases and 30/70 controls were exposed, OR = (60x70)/(40x30) = 3.5.' },
        { term: 'Hazard Ratio', definition: 'The ratio of hazard rates between two groups in survival analysis. Represents the instantaneous rate ratio at any given time point.', example: 'HR = 0.70 for a treatment means the instantaneous rate of the event is 30% lower in the treatment group at any given time.' },
        { term: 'Number Needed to Treat (NNT)', definition: 'The number of patients who need to be treated for one additional patient to benefit. Calculated as 1/ARR.', example: 'If a drug reduces stroke from 8% to 5% (ARR=3%), NNT = 1/0.03 = 33.3, rounded to 34.' },
        { term: 'Confidence Interval', definition: 'A range of values that, with a specified probability (usually 95%), would contain the true population parameter if the study were repeated many times.', example: 'OR = 2.3 (95% CI: 1.5-3.5) means if we repeated the study many times, 95% of calculated CIs would contain the true OR.' },
        { term: 'P-value', definition: 'The probability of observing data as extreme as (or more extreme than) what was seen, assuming the null hypothesis is true. It is NOT the probability that H0 is true.', example: 'P = 0.03 means there is a 3% chance of seeing data this extreme if there truly is no effect.' },
        { term: 'Type I Error (Alpha)', definition: 'Rejecting the null hypothesis when it is actually true (false positive). Conventionally set at 0.05 (5%).', example: 'Concluding a drug works when it truly does not is a Type I error.' },
        { term: 'Type II Error (Beta)', definition: 'Failing to reject the null hypothesis when it is actually false (false negative). Related to power: Power = 1 - Beta.', example: 'Concluding a drug does not work when it truly does is a Type II error. With power = 80%, beta = 20%.' },
        { term: 'Statistical Power', definition: 'The probability of correctly rejecting a false null hypothesis (detecting a true effect). Influenced by sample size, effect size, alpha, and variability.', example: '80% power means an 80% chance of detecting a true effect of the specified size if it exists.' },
        { term: 'Confounding', definition: 'A distortion of the true association between exposure and outcome caused by a third variable that is associated with both and is not on the causal pathway.', example: 'Age confounds the relationship between gray hair and mortality: older people have more gray hair AND higher mortality.' },
        { term: 'Effect Modification (Interaction)', definition: 'When the effect of an exposure on an outcome differs across levels of a third variable. Unlike confounding, this is a real biological phenomenon to be reported.', example: 'If aspirin reduces MI risk more in men than women, sex is an effect modifier of the aspirin-MI relationship.' },
        { term: 'Selection Bias', definition: 'Systematic error arising from how participants are selected or retained in a study, leading to a non-representative sample.', example: 'Studying only hospitalized patients may create Berkson bias if admission rates differ by exposure and disease status.' },
        { term: 'Information Bias', definition: 'Systematic error in how data on exposure or outcome is collected, leading to incorrect classification of subjects.', example: 'If disease status influences how carefully exposure is recalled, recall bias (a form of information bias) occurs.' },
        { term: 'Recall Bias', definition: 'A type of information bias where cases recall past exposures differently from controls, usually remembering exposures more completely.', example: 'Mothers of children with birth defects may recall medication use during pregnancy more thoroughly than mothers of healthy children.' },
        { term: 'Lead-Time Bias', definition: 'Apparent improvement in survival due to earlier detection (screening) without actual postponement of death. Diagnosis moves forward but death time stays the same.', example: 'Cancer detected by screening at age 55 vs. symptoms at 60, death at 65 in both cases. Survival appears as 10 years vs. 5 years.' },
        { term: 'Immortal Time Bias', definition: 'Bias arising when a period of follow-up during which the outcome cannot occur is misclassified as exposed time, creating a spurious protective effect.', example: 'A patient must survive long enough to receive a drug. The "immortal" pre-prescription time, if counted as exposed, falsely inflates survival.' },
        { term: 'Intention-to-Treat Analysis', definition: 'Analyzing all participants in the groups to which they were originally randomized, regardless of adherence. Preserves the benefits of randomization.', example: 'If a patient randomized to surgery refuses and gets medication instead, they are still analyzed in the surgery group in ITT.' },
        { term: 'Per-Protocol Analysis', definition: 'Analyzing only participants who completed the study as prescribed. May introduce bias but estimates the effect under ideal adherence.', example: 'Excluding patients who dropped out or switched treatments. May overestimate efficacy if non-compliant patients have worse outcomes.' },
        { term: 'Sensitivity', definition: 'The proportion of true positives correctly identified by a test. Also called the true positive rate. Sens = TP / (TP + FN).', example: 'If a test detects 90 out of 100 patients with disease, sensitivity = 90/100 = 90%.' },
        { term: 'Specificity', definition: 'The proportion of true negatives correctly identified by a test. Also called the true negative rate. Spec = TN / (TN + FP).', example: 'If a test correctly identifies 950 out of 1000 disease-free patients, specificity = 950/1000 = 95%.' },
        { term: 'Positive Predictive Value (PPV)', definition: 'The probability that a person with a positive test truly has the disease. Depends heavily on prevalence.', example: 'With sensitivity 90%, specificity 95%, and prevalence 1%: PPV is only about 15%. PPV rises with higher prevalence.' },
        { term: 'Negative Predictive Value (NPV)', definition: 'The probability that a person with a negative test truly does not have the disease. Also depends on prevalence.', example: 'With sensitivity 90%, specificity 95%, and prevalence 1%: NPV is approximately 99.9%. High NPV is easier to achieve with low prevalence.' },
        { term: 'Likelihood Ratio (Positive)', definition: 'The ratio of the probability of a positive test result in diseased persons to the probability in non-diseased. LR+ = Sensitivity / (1 - Specificity).', example: 'Sensitivity 90%, Specificity 95%: LR+ = 0.90/0.05 = 18. A positive test is 18 times more likely in disease.' },
        { term: 'Kaplan-Meier Estimator', definition: 'A non-parametric method for estimating the survival function, accounting for censored observations. Produces a step-function survival curve.', example: 'The K-M curve drops at each event time. Tick marks indicate censored observations (patients lost to follow-up or study end).' },
        { term: 'Cox Proportional Hazards Model', definition: 'A semi-parametric survival regression model that estimates hazard ratios while adjusting for covariates. Assumes proportional hazards over time.', example: 'Adjusting for age and sex, the HR for treatment is 0.65 (95% CI: 0.50-0.85), meaning 35% lower hazard of death.' },
        { term: 'Log-Rank Test', definition: 'A non-parametric test comparing survival distributions between two or more groups. The standard method for comparing Kaplan-Meier curves.', example: 'Log-rank p = 0.003 for treatment vs. control suggests the survival curves are significantly different.' },
        { term: 'Meta-Analysis', definition: 'A statistical method that combines results from multiple independent studies to produce a single weighted estimate of effect, increasing precision.', example: 'A meta-analysis of 10 RCTs of aspirin for stroke prevention produces a pooled RR = 0.78 (95% CI: 0.70-0.87).' },
        { term: 'Heterogeneity (I-squared)', definition: 'The degree to which results of individual studies in a meta-analysis vary beyond chance. I-squared represents the percentage of variability due to true differences.', example: 'I-squared = 75% suggests substantial heterogeneity, meaning 75% of the variability is not due to sampling error.' },
        { term: 'Random Effects Model', definition: 'A meta-analysis model that assumes the true effect size varies across studies. Accounts for both within-study and between-study variance.', example: 'When significant heterogeneity exists (I-squared > 50%), a random effects model is generally preferred over fixed effects.' },
        { term: 'Funnel Plot', definition: 'A scatter plot of effect size vs. study precision (or sample size) used to visually assess publication bias in meta-analysis.', example: 'An asymmetric funnel plot (missing small negative studies in the bottom-left) suggests possible publication bias.' },
        { term: 'CONSORT Statement', definition: 'A reporting guideline for randomized controlled trials. Provides a checklist of essential items to include in trial reports.', example: 'CONSORT requires reporting the flow of participants through the trial, including randomization, follow-up, and analysis.' },
        { term: 'STROBE Statement', definition: 'A reporting guideline for observational studies (cohort, case-control, cross-sectional). Provides a checklist of items for transparent reporting.', example: 'STROBE requires reporting of eligibility criteria, sources of data, methods for addressing potential sources of bias, and handling of missing data.' },
        { term: 'GRADE Framework', definition: 'A systematic approach to rating the certainty (quality) of evidence and the strength of recommendations. Used in clinical guideline development.', example: 'GRADE rates evidence as high, moderate, low, or very low. RCTs start at high; observational studies start at low.' },
        { term: 'Propensity Score', definition: 'The probability of receiving the treatment (exposure) given observed baseline covariates. Used to reduce confounding in observational studies.', example: 'Propensity score matching pairs treated and untreated patients with similar probabilities of treatment, creating pseudo-randomization.' },
        { term: 'Instrumental Variable', definition: 'A variable that is associated with the exposure, affects the outcome only through the exposure, and is not associated with confounders. Used for causal inference.', example: 'Distance to a specialty hospital as an IV for treatment choice: it affects which treatment patients receive but does not directly affect outcomes.' },
        { term: 'Mendelian Randomization', definition: 'An epidemiologic method using genetic variants as instrumental variables to estimate causal effects of modifiable exposures.', example: 'Using a gene variant for alcohol metabolism to estimate the causal effect of alcohol on cardiovascular disease, reducing confounding.' },
        { term: 'Directed Acyclic Graph (DAG)', definition: 'A visual tool for representing causal assumptions between variables. Used to identify confounders, colliders, and mediators to guide analysis decisions.', example: 'In a DAG, a confounder has arrows pointing to both exposure and outcome. A collider has arrows from both exposure and outcome pointing to it.' },
        { term: 'Collider Bias', definition: 'Bias introduced by conditioning on (adjusting for, or selecting on) a common effect of two variables. This opens a non-causal path between the variables.', example: 'If both talent and attractiveness lead to fame, studying only famous people creates a spurious inverse association between talent and attractiveness.' },
        { term: 'Absolute Risk Reduction (ARR)', definition: 'The difference in event rates between the control and treatment groups. ARR = Control Event Rate - Experimental Event Rate.', example: 'If the event rate is 15% in control and 10% in treatment, ARR = 15% - 10% = 5%. NNT = 1/0.05 = 20.' },
        { term: 'Allocation Concealment', definition: 'The process of preventing those involved in enrollment from knowing the upcoming treatment assignment, protecting the randomization sequence.', example: 'Central telephone randomization or sealed opaque envelopes prevent investigators from influencing which patients get which treatment.' },
        { term: 'Ecological Fallacy', definition: 'The error of inferring individual-level associations from group-level (aggregate) data in ecological studies.', example: 'Countries with higher chocolate consumption have more Nobel laureates, but this does not mean individual chocolate eaters are smarter.' },
        { term: 'Regression to the Mean', definition: 'The phenomenon where extreme measurements tend to be less extreme on repeat testing, even without intervention. A threat to before-after study designs.', example: 'Patients selected for having very high blood pressure will often have lower readings at the next visit, regardless of treatment.' },
        { term: 'External Validity (Generalizability)', definition: 'The extent to which study results can be applied to populations or settings beyond the study sample.', example: 'A trial enrolling only patients aged 40-65 with no comorbidities may not generalize to elderly patients with multiple conditions.' }
    ];

    /* ------------------------------------------------------------------ */
    /*  Study Design Decision Tree                                         */
    /* ------------------------------------------------------------------ */
    var decisionTree = {
        id: 'start',
        question: 'Does the investigator assign the exposure or intervention?',
        options: [
            {
                label: 'Yes — Investigator assigns exposure',
                next: {
                    id: 'randomized',
                    question: 'Is the assignment randomized?',
                    options: [
                        {
                            label: 'Yes — Random assignment',
                            next: {
                                id: 'rct_type',
                                question: 'What is the unit of randomization?',
                                options: [
                                    {
                                        label: 'Individual patients',
                                        result: {
                                            design: 'Randomized Controlled Trial (RCT)',
                                            description: 'The gold standard for evaluating interventions. Individual patients are randomly allocated to treatment or control groups. Minimizes selection bias and confounding.',
                                            strengths: 'Strongest evidence for causation; minimizes bias through randomization, blinding, and controlled comparison.',
                                            limitations: 'Expensive; may lack generalizability (strict inclusion criteria); ethical constraints on randomizing harmful exposures.',
                                            measure: 'Risk Ratio (RR), Risk Difference (RD), Hazard Ratio (HR), or Odds Ratio (OR)',
                                            examples: 'NINDS rt-PA trial, IST-3, MR CLEAN'
                                        }
                                    },
                                    {
                                        label: 'Groups/clusters (clinics, hospitals, communities)',
                                        result: {
                                            design: 'Cluster Randomized Trial',
                                            description: 'Groups (clusters) rather than individuals are randomized. Useful when individual randomization is impractical or when the intervention is delivered at the group level.',
                                            strengths: 'Practical for community-level or system-level interventions; reduces contamination between groups.',
                                            limitations: 'Requires larger sample sizes (design effect due to intracluster correlation); more complex analysis; fewer randomization units.',
                                            measure: 'Same as individual RCT but adjusted for clustering (ICC)',
                                            examples: 'Stepped-wedge cluster RCTs of stroke care protocols'
                                        }
                                    },
                                    {
                                        label: 'Each patient serves as own control (crossover)',
                                        result: {
                                            design: 'Crossover Trial',
                                            description: 'Each patient receives both treatments in sequence (with a washout period). Patients serve as their own controls, reducing inter-individual variability.',
                                            strengths: 'Smaller sample sizes needed; controls for patient-level confounders since each patient is their own control.',
                                            limitations: 'Risk of carryover effects; only suitable for chronic, stable conditions; requires adequate washout period.',
                                            measure: 'Within-patient difference, often analyzed with paired tests',
                                            examples: 'Crossover trials of anti-epileptic drugs for chronic epilepsy'
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            label: 'No — Non-random assignment',
                            result: {
                                design: 'Quasi-Experimental Study (Non-randomized Interventional)',
                                description: 'The investigator assigns the intervention, but without random allocation (e.g., by hospital, by time period, by alternation). Includes before-after studies, interrupted time series, and regression discontinuity designs.',
                                strengths: 'Feasible when randomization is impractical or unethical; still evaluates an intervention.',
                                limitations: 'Susceptible to confounding and selection bias because groups may differ at baseline. Requires careful analysis (e.g., difference-in-differences, propensity scores).',
                                measure: 'Depends on design; often RD or RR with adjustment methods',
                                examples: 'Interrupted time series of a hospital stroke protocol change; before-after studies of clinical pathways'
                            }
                        }
                    ]
                }
            },
            {
                label: 'No — Investigator observes only',
                next: {
                    id: 'direction',
                    question: 'What is the direction of inquiry (how are participants selected)?',
                    options: [
                        {
                            label: 'Start with outcome, look back at exposure (outcome -> exposure)',
                            result: {
                                design: 'Case-Control Study',
                                description: 'Participants are selected based on outcome status: cases (with the disease) and controls (without). Past exposures are then compared between groups. Efficient for rare diseases.',
                                strengths: 'Efficient for rare diseases and diseases with long latency; relatively quick and inexpensive; can evaluate multiple exposures.',
                                limitations: 'Cannot calculate incidence or risk directly; susceptible to recall bias and selection bias in control selection.',
                                measure: 'Odds Ratio (OR)',
                                examples: 'Case-control study of cell phone use and brain tumors; study of risk factors for Guillain-Barre syndrome'
                            }
                        },
                        {
                            label: 'Start with exposure, follow forward to outcome (exposure -> outcome)',
                            next: {
                                id: 'cohort_timing',
                                question: 'When does the follow-up occur relative to the study start?',
                                options: [
                                    {
                                        label: 'Follow-up is in the future (prospective)',
                                        result: {
                                            design: 'Prospective Cohort Study',
                                            description: 'A group (cohort) is assembled based on exposure status and followed forward in time to observe who develops the outcome. Data are collected going forward from enrollment.',
                                            strengths: 'Can establish temporal sequence; can measure incidence directly; less susceptible to recall bias; can study multiple outcomes.',
                                            limitations: 'Time-consuming and expensive; loss to follow-up can introduce bias; not efficient for rare outcomes.',
                                            measure: 'Risk Ratio (RR), Rate Ratio, Hazard Ratio (HR)',
                                            examples: 'Framingham Heart Study, Nurses\' Health Study, UK Biobank'
                                        }
                                    },
                                    {
                                        label: 'Follow-up already happened (using existing records)',
                                        result: {
                                            design: 'Retrospective Cohort Study',
                                            description: 'Uses existing records to identify a cohort defined by past exposure status and follows them through records to identify outcomes that have already occurred. Looks back in time but maintains the cohort logic (exposure -> outcome).',
                                            strengths: 'Faster and cheaper than prospective cohorts; can use existing databases; can study rare exposures.',
                                            limitations: 'Dependent on quality of existing records; data may be incomplete or lack key confounders; cannot collect new variables.',
                                            measure: 'Risk Ratio (RR), Rate Ratio, Hazard Ratio (HR)',
                                            examples: 'Retrospective cohort using EHR data to study medication effects; occupational cohort studies using employment records'
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            label: 'Exposure and outcome measured at the same time (no follow-up)',
                            result: {
                                design: 'Cross-Sectional Study',
                                description: 'Both exposure and outcome are measured simultaneously in a defined population at one point in time. Provides a "snapshot" of the population.',
                                strengths: 'Quick and inexpensive; useful for measuring prevalence; can study multiple exposures and outcomes.',
                                limitations: 'Cannot establish temporal sequence (which came first); measures prevalence, not incidence; susceptible to prevalence bias.',
                                measure: 'Prevalence Ratio, Prevalence Odds Ratio',
                                examples: 'NHANES (National Health and Nutrition Examination Survey); community health surveys'
                            }
                        },
                        {
                            label: 'Using aggregate (population-level) data only',
                            result: {
                                design: 'Ecological Study',
                                description: 'Uses aggregate data for groups (countries, regions, time periods) rather than individual-level data. Correlates group-level exposures with group-level outcomes.',
                                strengths: 'Quick; uses readily available data; useful for generating hypotheses; can study population-level interventions.',
                                limitations: 'Susceptible to ecological fallacy (cannot infer individual-level associations from group data); cannot control for individual confounders.',
                                measure: 'Correlation coefficients at the group level',
                                examples: 'Comparing country-level dietary fat intake with cancer rates; comparing state-level vaccination rates with disease incidence'
                            }
                        }
                    ]
                }
            }
        ]
    };

    /* ------------------------------------------------------------------ */
    /*  Journal Club Worksheet Template                                    */
    /* ------------------------------------------------------------------ */
    var journalClubTemplate = {
        sections: [
            { title: 'Study Identification', fields: ['Title', 'Authors', 'Journal', 'Year', 'PMID/DOI'] },
            { title: 'Study Design', fields: ['Type (RCT, cohort, etc.)', 'Setting', 'Duration', 'Registration'] },
            { title: 'Participants', fields: ['Inclusion criteria', 'Exclusion criteria', 'N enrolled', 'N analyzed'] },
            { title: 'Intervention/Exposure', fields: ['Intervention', 'Comparator', 'Blinding'] },
            { title: 'Outcomes', fields: ['Primary outcome', 'Secondary outcomes', 'Follow-up duration'] },
            { title: 'Key Results', fields: ['Primary outcome result', 'Effect size + CI', 'p-value', 'NNT/NNH'] },
            { title: 'Validity Assessment', fields: ['Random sequence generation', 'Allocation concealment', 'Blinding', 'Incomplete outcome data', 'Selective reporting'] },
            { title: 'Clinical Significance', fields: ['Generalizability', 'Clinical importance', 'Bottom line'] }
        ]
    };

    /* ------------------------------------------------------------------ */
    /*  Concept Maps                                                       */
    /* ------------------------------------------------------------------ */
    var conceptMaps = [
        {
            title: 'Types of Bias in Clinical Research',
            nodes: [
                { label: 'Bias', x: 50, y: 10, root: true },
                { label: 'Selection Bias', x: 20, y: 30 },
                { label: 'Information Bias', x: 50, y: 30 },
                { label: 'Confounding', x: 80, y: 30 },
                { label: 'Berkson Bias', x: 5, y: 55 },
                { label: 'Healthy Worker', x: 20, y: 55 },
                { label: 'Self-selection', x: 35, y: 55 },
                { label: 'Recall Bias', x: 45, y: 55 },
                { label: 'Misclassification', x: 60, y: 55 },
                { label: 'Interviewer Bias', x: 75, y: 55 },
                { label: 'Design Stage', x: 70, y: 55 },
                { label: 'Analysis Stage', x: 90, y: 55 }
            ],
            edges: [
                [0, 1], [0, 2], [0, 3],
                [1, 4], [1, 5], [1, 6],
                [2, 7], [2, 8], [2, 9],
                [3, 10], [3, 11]
            ]
        },
        {
            title: 'Measures of Disease Frequency & Association',
            nodes: [
                { label: 'Measures', x: 50, y: 5, root: true },
                { label: 'Frequency', x: 25, y: 25 },
                { label: 'Association', x: 75, y: 25 },
                { label: 'Prevalence', x: 10, y: 50 },
                { label: 'Incidence Rate', x: 25, y: 50 },
                { label: 'Cumulative Inc.', x: 40, y: 50 },
                { label: 'Relative (RR, OR)', x: 60, y: 50 },
                { label: 'Absolute (RD, NNT)', x: 75, y: 50 },
                { label: 'Impact (PAF, AF)', x: 90, y: 50 }
            ],
            edges: [
                [0, 1], [0, 2],
                [1, 3], [1, 4], [1, 5],
                [2, 6], [2, 7], [2, 8]
            ]
        }
    ];

    /* ------------------------------------------------------------------ */
    /*  Render                                                              */
    /* ------------------------------------------------------------------ */

    function render(container) {
        var html = App.createModuleLayout(
            'Teaching & Mentoring Tools',
            'Interactive educational tools for teaching and learning epidemiology, biostatistics, and clinical research methods.'
        );

        // Tool tabs
        html += '<div class="card" style="margin-bottom:1rem"><div style="display:flex;flex-wrap:wrap;gap:0.5rem;padding:0.5rem">';
        var tools = [
            { id: 'biostats-quiz', label: 'Biostats Quiz Generator' },
            { id: 'flashcards', label: 'Concept Flashcards' },
            { id: 'decision-tree', label: 'Study Design Tree' },
            { id: 'journal-club', label: 'Journal Club Worksheet' },
            { id: 'concepts', label: 'Concept Maps' },
            { id: 'glossary', label: 'Glossary' }
        ];
        tools.forEach(function (t) {
            html += '<button class="btn ' + (t.id === currentTool ? 'btn-primary' : 'btn-secondary') + '" '
                + 'onclick="window.TeachingTools.switchTool(\'' + t.id + '\')" '
                + 'id="tt-tab-' + t.id + '">'
                + t.label + '</button>';
        });
        html += '</div></div>';

        // Content area
        html += '<div id="tt-content"></div>';

        // Learn section
        html += '<div class="card" style="margin-top:1.5rem">'
            + '<h3 onclick="this.nextElementSibling.classList.toggle(\'hidden\')" style="cursor:pointer">'
            + 'Learn & Reference <span style="font-size:0.8em;color:var(--text-secondary)">[ click to expand ]</span></h3>'
            + '<div class="learn-body hidden" style="margin-top:1rem">'
            + '<h4>Using These Tools for Teaching</h4>'
            + '<ul>'
            + '<li><strong>Biostats Quiz Generator</strong>: Randomly generates a 10-question quiz from a bank of 35+ questions covering study design, bias, statistical tests, and interpretation.</li>'
            + '<li><strong>Concept Flashcards</strong>: 45 flashcards covering key epidemiology and biostatistics concepts. Flip to see definitions and examples.</li>'
            + '<li><strong>Study Design Decision Tree</strong>: Answer questions about your research scenario to identify the most appropriate study design.</li>'
            + '<li><strong>Journal Club Worksheet</strong>: Structured template for presenting papers. Print or copy for your group.</li>'
            + '<li><strong>Concept Maps</strong>: Visual summaries of key relationships. Great for orientation lectures.</li>'
            + '<li><strong>Glossary</strong>: Quick-reference definitions for commonly confused terms.</li>'
            + '</ul>'
            + '<h4>Pedagogical Tips</h4>'
            + '<ul>'
            + '<li>Use quizzes as pre-reading assessments before journal clubs</li>'
            + '<li>Have trainees fill out the journal club worksheet before presenting</li>'
            + '<li>Concept maps work well as "knowledge check" exercises</li>'
            + '<li>The decision tree is ideal for research methods orientation sessions</li>'
            + '<li>Flashcards support spaced repetition — review daily for retention</li>'
            + '</ul></div></div>';

        App.setTrustedHTML(container, html);
        switchTool(currentTool);
    }

    function switchTool(toolId) {
        currentTool = toolId;
        // Update tabs
        var allTabs = ['biostats-quiz', 'flashcards', 'decision-tree', 'journal-club', 'concepts', 'glossary'];
        allTabs.forEach(function (id) {
            var btn = document.getElementById('tt-tab-' + id);
            if (btn) btn.className = id === toolId ? 'btn btn-primary' : 'btn btn-secondary';
        });

        var el = document.getElementById('tt-content');
        if (!el) return;

        if (toolId === 'biostats-quiz') renderBiostatQuiz(el);
        else if (toolId === 'flashcards') renderFlashcards(el);
        else if (toolId === 'decision-tree') renderDecisionTree(el);
        else if (toolId === 'journal-club') renderJournalClub(el);
        else if (toolId === 'concepts') renderConceptMaps(el);
        else if (toolId === 'glossary') renderGlossary(el);
    }



    /* ------------------------------------------------------------------ */
    /*  Biostatistics Quiz Generator                                       */
    /* ------------------------------------------------------------------ */

    var biostatQuizState = {
        started: false,
        questions: [],
        currentIdx: 0,
        answered: false,
        selected: -1,
        score: 0,
        total: 0,
        finished: false,
        answers: []
    };

    function shuffleArray(arr) {
        var shuffled = arr.slice();
        for (var i = shuffled.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }
        return shuffled;
    }

    function startBiostatQuiz() {
        var selected = shuffleArray(biostatQuizBank).slice(0, 10);
        biostatQuizState = {
            started: true,
            questions: selected,
            currentIdx: 0,
            answered: false,
            selected: -1,
            score: 0,
            total: 0,
            finished: false,
            answers: []
        };
        var el = document.getElementById('tt-content');
        if (el) renderBiostatQuiz(el);
    }

    function renderBiostatQuiz(el) {
        var html = '<div class="card">';

        if (!biostatQuizState.started) {
            // Start screen
            html += '<div style="text-align:center;padding:2rem 0">'
                + '<h3 style="margin-bottom:1rem">Biostatistics Quiz Generator</h3>'
                + '<p style="color:var(--text-secondary);margin-bottom:0.5rem">Test your knowledge with 10 randomly selected questions from a bank of ' + biostatQuizBank.length + ' questions.</p>'
                + '<p style="color:var(--text-secondary);margin-bottom:1.5rem">Topics covered: Study design identification, bias identification, statistical test selection, interpretation of results, p-value and CI interpretation.</p>'
                + '<button class="btn btn-primary" style="font-size:1.1rem;padding:0.75rem 2rem" onclick="window.TeachingTools.startBiostatQuiz()">Start Quiz</button>'
                + '</div>';
        } else if (biostatQuizState.finished) {
            // Results screen
            var pct = Math.round((biostatQuizState.score / biostatQuizState.total) * 100);
            var grade = pct >= 90 ? 'Excellent!' : pct >= 70 ? 'Good' : pct >= 50 ? 'Needs improvement' : 'Keep studying';
            var gradeColor = pct >= 90 ? '#22c55e' : pct >= 70 ? '#22d3ee' : pct >= 50 ? '#f59e0b' : '#ef4444';

            html += '<div style="text-align:center;padding:1.5rem 0">'
                + '<h3 style="margin-bottom:1rem">Quiz Complete!</h3>'
                + '<div style="font-size:3rem;font-weight:700;color:' + gradeColor + ';margin-bottom:0.5rem">' + biostatQuizState.score + ' / ' + biostatQuizState.total + '</div>'
                + '<div style="font-size:1.2rem;color:' + gradeColor + ';margin-bottom:0.25rem">' + pct + '%</div>'
                + '<div style="font-size:1.1rem;color:var(--text-secondary);margin-bottom:1.5rem">' + grade + '</div>'
                + '<button class="btn btn-primary" style="margin-right:0.5rem" onclick="window.TeachingTools.startBiostatQuiz()">New Quiz</button>'
                + '<button class="btn btn-secondary" onclick="window.TeachingTools.reviewBiostatQuiz()">Review Answers</button>'
                + '</div>';

            // Show review
            if (biostatQuizState.showReview) {
                html += '<div style="margin-top:1.5rem;border-top:1px solid var(--border);padding-top:1.5rem">';
                html += '<h4 style="margin-bottom:1rem">Answer Review</h4>';
                biostatQuizState.questions.forEach(function (q, i) {
                    var userAnswer = biostatQuizState.answers[i];
                    var isCorrect = userAnswer === q.answer;
                    var icon = isCorrect ? '<span style="color:#22c55e;font-weight:700">CORRECT</span>' : '<span style="color:#ef4444;font-weight:700">INCORRECT</span>';
                    html += '<div style="margin-bottom:1.5rem;padding:1rem;background:var(--surface-2);border-radius:8px;border-left:3px solid ' + (isCorrect ? '#22c55e' : '#ef4444') + '">'
                        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">'
                        + '<strong>Q' + (i + 1) + '.</strong> ' + icon + '</div>'
                        + '<div style="margin-bottom:0.75rem">' + q.q + '</div>';
                    q.options.forEach(function (opt, oi) {
                        var optStyle = '';
                        if (oi === q.answer) optStyle = 'color:#22c55e;font-weight:600';
                        else if (oi === userAnswer && oi !== q.answer) optStyle = 'color:#ef4444;text-decoration:line-through';
                        html += '<div style="padding:0.25rem 0;padding-left:1rem;' + optStyle + '">'
                            + String.fromCharCode(65 + oi) + '. ' + opt
                            + (oi === q.answer ? ' (correct)' : '')
                            + (oi === userAnswer && oi !== q.answer ? ' (your answer)' : '')
                            + '</div>';
                    });
                    html += '<div style="margin-top:0.75rem;color:var(--text-secondary);font-size:0.9rem;padding:0.5rem;background:var(--surface-1);border-radius:4px">'
                        + '<strong>Explanation:</strong> ' + q.explanation + '</div></div>';
                });
                html += '</div>';
            }
        } else {
            // Active quiz
            var q = biostatQuizState.questions[biostatQuizState.currentIdx];

            // Progress bar
            var progress = ((biostatQuizState.currentIdx) / biostatQuizState.questions.length) * 100;
            html += '<div style="margin-bottom:1rem">'
                + '<div style="display:flex;justify-content:space-between;margin-bottom:0.5rem">'
                + '<span style="color:var(--text-secondary)">Question ' + (biostatQuizState.currentIdx + 1) + ' of ' + biostatQuizState.questions.length + '</span>'
                + '<span style="color:var(--text-secondary)">Score: ' + biostatQuizState.score + '/' + biostatQuizState.total + '</span>'
                + '</div>'
                + '<div style="background:var(--surface-2);border-radius:8px;height:6px;overflow:hidden">'
                + '<div style="background:var(--accent);height:100%;width:' + progress + '%;border-radius:8px;transition:width 0.3s"></div>'
                + '</div></div>';

            html += '<h3 style="margin-bottom:1.25rem;line-height:1.5">' + q.q + '</h3>';

            q.options.forEach(function (opt, i) {
                var cls = 'btn btn-secondary';
                var disabled = '';
                if (biostatQuizState.answered) {
                    disabled = ' disabled';
                    if (i === q.answer) cls = 'btn btn-success';
                    else if (i === biostatQuizState.selected && i !== q.answer) cls = 'btn btn-danger';
                }
                html += '<button class="' + cls + '" style="display:block;width:100%;text-align:left;margin-bottom:0.5rem;padding:0.75rem 1rem" '
                    + 'onclick="window.TeachingTools.answerBiostatQuiz(' + i + ')"' + disabled + '>'
                    + '<strong>' + String.fromCharCode(65 + i) + '.</strong> ' + opt + '</button>';
            });

            if (biostatQuizState.answered) {
                html += '<div class="card" style="margin-top:1rem;background:var(--surface-2);border-left:3px solid var(--accent);padding:1rem">'
                    + '<strong>Explanation:</strong> ' + q.explanation + '</div>';
                html += '<div style="margin-top:1rem">';
                if (biostatQuizState.currentIdx < biostatQuizState.questions.length - 1) {
                    html += '<button class="btn btn-primary" onclick="window.TeachingTools.nextBiostatQuestion()">Next Question</button>';
                } else {
                    html += '<button class="btn btn-primary" onclick="window.TeachingTools.finishBiostatQuiz()">See Results</button>';
                }
                html += '</div>';
            }
        }

        html += '</div>';
        App.setTrustedHTML(el, html);
    }

    function answerBiostatQuiz(idx) {
        if (biostatQuizState.answered) return;
        biostatQuizState.answered = true;
        biostatQuizState.selected = idx;
        biostatQuizState.total++;
        biostatQuizState.answers.push(idx);
        if (idx === biostatQuizState.questions[biostatQuizState.currentIdx].answer) {
            biostatQuizState.score++;
        }
        var el = document.getElementById('tt-content');
        if (el) renderBiostatQuiz(el);
    }

    function nextBiostatQuestion() {
        biostatQuizState.currentIdx++;
        biostatQuizState.answered = false;
        biostatQuizState.selected = -1;
        var el = document.getElementById('tt-content');
        if (el) renderBiostatQuiz(el);
    }

    function finishBiostatQuiz() {
        biostatQuizState.finished = true;
        biostatQuizState.showReview = false;
        var el = document.getElementById('tt-content');
        if (el) renderBiostatQuiz(el);
    }

    function reviewBiostatQuiz() {
        biostatQuizState.showReview = !biostatQuizState.showReview;
        var el = document.getElementById('tt-content');
        if (el) renderBiostatQuiz(el);
    }

    /* ------------------------------------------------------------------ */
    /*  Concept Flashcards                                                 */
    /* ------------------------------------------------------------------ */

    var flashcardState = {
        currentIdx: 0,
        flipped: false,
        shuffled: false,
        deck: null
    };

    function getFlashcardDeck() {
        if (!flashcardState.deck) {
            flashcardState.deck = flashcardDeck.slice();
        }
        return flashcardState.deck;
    }

    function renderFlashcards(el) {
        var deck = getFlashcardDeck();
        var card = deck[flashcardState.currentIdx];
        var total = deck.length;
        var idx = flashcardState.currentIdx;

        var html = '<div class="card">';

        // Header
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">'
            + '<h3 style="margin:0">Concept Flashcards</h3>'
            + '<div style="display:flex;gap:0.5rem">'
            + '<button class="btn btn-secondary" onclick="window.TeachingTools.shuffleFlashcards()" title="Shuffle deck">'
            + (flashcardState.shuffled ? 'Unshuffle' : 'Shuffle') + '</button>'
            + '</div></div>';

        // Progress
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">'
            + '<span style="color:var(--text-secondary)">Card ' + (idx + 1) + ' of ' + total + '</span>'
            + '<div style="background:var(--surface-2);border-radius:8px;height:6px;overflow:hidden;flex:1;margin:0 1rem">'
            + '<div style="background:var(--accent);height:100%;width:' + ((idx + 1) / total * 100) + '%;border-radius:8px;transition:width 0.3s"></div>'
            + '</div></div>';

        // Flashcard
        var bgColor = flashcardState.flipped ? 'var(--surface-2)' : 'var(--surface-1)';
        var borderColor = flashcardState.flipped ? 'var(--accent)' : 'var(--border)';

        html += '<div onclick="window.TeachingTools.flipFlashcard()" '
            + 'style="cursor:pointer;min-height:200px;padding:2rem;border:2px solid ' + borderColor + ';border-radius:12px;'
            + 'background:' + bgColor + ';display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;'
            + 'transition:all 0.2s;margin-bottom:1rem;user-select:none">';

        if (!flashcardState.flipped) {
            // Front: term
            html += '<div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:1px">Term</div>'
                + '<div style="font-size:1.5rem;font-weight:700;color:var(--accent)">' + card.term + '</div>'
                + '<div style="margin-top:1.5rem;font-size:0.85rem;color:var(--text-secondary)">Click to reveal definition</div>';
        } else {
            // Back: definition + example
            html += '<div style="font-size:0.8rem;color:var(--accent);margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:1px">' + card.term + '</div>'
                + '<div style="font-size:1.05rem;line-height:1.6;margin-bottom:1rem;color:var(--text-primary)">' + card.definition + '</div>'
                + '<div style="padding:0.75rem;background:var(--surface-1);border-radius:8px;border-left:3px solid var(--accent);text-align:left;width:100%">'
                + '<strong style="font-size:0.85rem;color:var(--accent)">Example:</strong><br>'
                + '<span style="font-size:0.9rem;color:var(--text-secondary)">' + card.example + '</span></div>'
                + '<div style="margin-top:1rem;font-size:0.85rem;color:var(--text-secondary)">Click to see term</div>';
        }

        html += '</div>';

        // Navigation buttons
        html += '<div style="display:flex;justify-content:center;gap:0.5rem;align-items:center">'
            + '<button class="btn btn-secondary" onclick="window.TeachingTools.prevFlashcard()"' + (idx === 0 ? ' disabled' : '') + ' style="min-width:100px">Previous</button>'
            + '<button class="btn btn-primary" onclick="window.TeachingTools.flipFlashcard()" style="min-width:100px">' + (flashcardState.flipped ? 'Show Term' : 'Flip') + '</button>'
            + '<button class="btn btn-secondary" onclick="window.TeachingTools.nextFlashcard()"' + (idx === total - 1 ? ' disabled' : '') + ' style="min-width:100px">Next</button>'
            + '</div>';

        // Keyboard hint
        html += '<div style="text-align:center;margin-top:1rem;color:var(--text-secondary);font-size:0.8rem">'
            + 'Keyboard: &larr; Previous &nbsp;|&nbsp; Space/Enter = Flip &nbsp;|&nbsp; &rarr; Next'
            + '</div>';

        html += '</div>';
        App.setTrustedHTML(el, html);
    }

    function flipFlashcard() {
        flashcardState.flipped = !flashcardState.flipped;
        var el = document.getElementById('tt-content');
        if (el) renderFlashcards(el);
    }

    function nextFlashcard() {
        var deck = getFlashcardDeck();
        if (flashcardState.currentIdx < deck.length - 1) {
            flashcardState.currentIdx++;
            flashcardState.flipped = false;
            var el = document.getElementById('tt-content');
            if (el) renderFlashcards(el);
        }
    }

    function prevFlashcard() {
        if (flashcardState.currentIdx > 0) {
            flashcardState.currentIdx--;
            flashcardState.flipped = false;
            var el = document.getElementById('tt-content');
            if (el) renderFlashcards(el);
        }
    }

    function shuffleFlashcards() {
        if (flashcardState.shuffled) {
            flashcardState.deck = flashcardDeck.slice();
            flashcardState.shuffled = false;
        } else {
            flashcardState.deck = shuffleArray(flashcardDeck);
            flashcardState.shuffled = true;
        }
        flashcardState.currentIdx = 0;
        flashcardState.flipped = false;
        var el = document.getElementById('tt-content');
        if (el) renderFlashcards(el);
    }

    // Keyboard navigation for flashcards
    document.addEventListener('keydown', function (e) {
        if (currentTool !== 'flashcards') return;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowRight') { nextFlashcard(); e.preventDefault(); }
        else if (e.key === 'ArrowLeft') { prevFlashcard(); e.preventDefault(); }
        else if (e.key === ' ' || e.key === 'Enter') { flipFlashcard(); e.preventDefault(); }
    });

    /* ------------------------------------------------------------------ */
    /*  Study Design Decision Tree                                         */
    /* ------------------------------------------------------------------ */

    var treeState = {
        path: [],          // array of chosen option indices
        currentNode: null  // current node in the tree
    };

    function getTreeNode() {
        var node = decisionTree;
        for (var i = 0; i < treeState.path.length; i++) {
            var choice = node.options[treeState.path[i]];
            if (choice.result) return { result: choice.result, atResult: true };
            node = choice.next;
        }
        return { node: node, atResult: false };
    }

    function renderDecisionTree(el) {
        var html = '<div class="card">';
        html += '<h3 style="margin-bottom:0.5rem">Study Design Decision Tree</h3>'
            + '<p style="color:var(--text-secondary);margin-bottom:1.5rem">Answer questions about your research scenario to identify the most appropriate study design.</p>';

        // Breadcrumb trail
        if (treeState.path.length > 0) {
            html += '<div style="margin-bottom:1.5rem;padding:0.75rem;background:var(--surface-2);border-radius:8px">'
                + '<div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:1px">Your path:</div>';
            var trailNode = decisionTree;
            for (var i = 0; i < treeState.path.length; i++) {
                var chosen = trailNode.options[treeState.path[i]];
                html += '<div style="padding:0.25rem 0;color:var(--accent);font-size:0.9rem">'
                    + '<span style="color:var(--text-secondary)">' + (i + 1) + '.</span> '
                    + trailNode.question + ' <strong>&rarr; ' + chosen.label + '</strong></div>';
                if (chosen.next) trailNode = chosen.next;
            }
            html += '</div>';
        }

        var state = getTreeNode();

        if (state.atResult) {
            // Show result
            var r = state.result;
            html += '<div style="border:2px solid var(--accent);border-radius:12px;padding:1.5rem;margin-bottom:1rem">'
                + '<div style="font-size:0.8rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:1px;margin-bottom:0.5rem">Recommended Study Design</div>'
                + '<h2 style="color:var(--accent);margin-bottom:1rem">' + r.design + '</h2>'
                + '<p style="line-height:1.6;margin-bottom:1rem">' + r.description + '</p>'
                + '<div style="display:grid;gap:1rem;grid-template-columns:1fr 1fr">'
                + '<div style="padding:1rem;background:var(--surface-2);border-radius:8px">'
                + '<strong style="color:#22c55e">Strengths</strong>'
                + '<p style="margin-top:0.5rem;font-size:0.9rem;color:var(--text-secondary);line-height:1.5">' + r.strengths + '</p></div>'
                + '<div style="padding:1rem;background:var(--surface-2);border-radius:8px">'
                + '<strong style="color:#f59e0b">Limitations</strong>'
                + '<p style="margin-top:0.5rem;font-size:0.9rem;color:var(--text-secondary);line-height:1.5">' + r.limitations + '</p></div>'
                + '</div>'
                + '<div style="margin-top:1rem;padding:1rem;background:var(--surface-2);border-radius:8px">'
                + '<strong>Primary Measure of Association:</strong> <span style="color:var(--accent)">' + r.measure + '</span></div>'
                + '<div style="margin-top:0.75rem;padding:1rem;background:var(--surface-2);border-radius:8px">'
                + '<strong>Examples:</strong> <span style="color:var(--text-secondary)">' + r.examples + '</span></div>'
                + '</div>';

            html += '<div style="display:flex;gap:0.5rem;margin-top:1rem">'
                + '<button class="btn btn-primary" onclick="window.TeachingTools.resetDecisionTree()">Start Over</button>'
                + '<button class="btn btn-secondary" onclick="window.TeachingTools.backDecisionTree()">Go Back</button>'
                + '</div>';
        } else {
            // Show question
            var node = state.node;
            html += '<div style="margin-bottom:1.5rem">'
                + '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:0.5rem">Step ' + (treeState.path.length + 1) + '</div>'
                + '<h3 style="margin-bottom:1.25rem;line-height:1.5">' + node.question + '</h3>';

            node.options.forEach(function (opt, i) {
                html += '<button class="btn btn-secondary" '
                    + 'style="display:block;width:100%;text-align:left;margin-bottom:0.5rem;padding:0.75rem 1rem" '
                    + 'onclick="window.TeachingTools.chooseTreeOption(' + i + ')">'
                    + opt.label + '</button>';
            });
            html += '</div>';

            if (treeState.path.length > 0) {
                html += '<button class="btn btn-secondary" onclick="window.TeachingTools.backDecisionTree()">Go Back</button>';
            }
        }

        html += '</div>';
        App.setTrustedHTML(el, html);
    }

    function chooseTreeOption(idx) {
        treeState.path.push(idx);
        var el = document.getElementById('tt-content');
        if (el) renderDecisionTree(el);
    }

    function backDecisionTree() {
        if (treeState.path.length > 0) {
            treeState.path.pop();
            var el = document.getElementById('tt-content');
            if (el) renderDecisionTree(el);
        }
    }

    function resetDecisionTree() {
        treeState.path = [];
        var el = document.getElementById('tt-content');
        if (el) renderDecisionTree(el);
    }

    /* ------------------------------------------------------------------ */
    /*  Journal Club Worksheet                                              */
    /* ------------------------------------------------------------------ */

    function renderJournalClub(el) {
        var html = '<div class="card">'
            + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">'
            + '<h3 style="margin:0">Journal Club Worksheet</h3>'
            + '<div style="display:flex;gap:0.5rem">'
            + '<button class="btn btn-secondary" onclick="window.TeachingTools.copyWorksheet()">Copy as Text</button>'
            + '<button class="btn btn-secondary" onclick="window.TeachingTools.clearWorksheet()">Clear All</button>'
            + '</div></div>';

        journalClubTemplate.sections.forEach(function (section, si) {
            html += '<div style="margin-bottom:1.5rem">'
                + '<h4 style="color:var(--accent);margin-bottom:0.75rem;border-bottom:1px solid var(--border);padding-bottom:0.5rem">'
                + (si + 1) + '. ' + section.title + '</h4>';
            section.fields.forEach(function (field, fi) {
                var inputId = 'jc-' + si + '-' + fi;
                html += '<div style="margin-bottom:0.5rem">'
                    + '<label style="font-size:0.85rem;color:var(--text-secondary);display:block;margin-bottom:0.25rem">' + field + '</label>'
                    + '<textarea id="' + inputId + '" rows="2" style="width:100%;resize:vertical;background:var(--surface-2);border:1px solid var(--border);border-radius:6px;padding:0.5rem;color:var(--text-primary);font-family:inherit;font-size:0.9rem" placeholder="Enter ' + field.toLowerCase() + '..."></textarea>'
                    + '</div>';
            });
            html += '</div>';
        });

        html += '</div>';
        App.setTrustedHTML(el, html);
    }

    function copyWorksheet() {
        var text = '=== JOURNAL CLUB WORKSHEET ===\n\n';
        journalClubTemplate.sections.forEach(function (section, si) {
            text += section.title.toUpperCase() + '\n';
            text += '-'.repeat(section.title.length) + '\n';
            section.fields.forEach(function (field, fi) {
                var input = document.getElementById('jc-' + si + '-' + fi);
                var val = input ? input.value.trim() : '';
                text += field + ': ' + (val || '[not entered]') + '\n';
            });
            text += '\n';
        });
        Export.copyToClipboard(text);
    }

    function clearWorksheet() {
        journalClubTemplate.sections.forEach(function (section, si) {
            section.fields.forEach(function (_, fi) {
                var input = document.getElementById('jc-' + si + '-' + fi);
                if (input) input.value = '';
            });
        });
    }

    /* ------------------------------------------------------------------ */
    /*  Concept Maps                                                       */
    /* ------------------------------------------------------------------ */

    function renderConceptMaps(el) {
        var html = '';
        conceptMaps.forEach(function (map, mi) {
            html += '<div class="card" style="margin-bottom:1rem">'
                + '<h3>' + map.title + '</h3>'
                + '<canvas id="tt-concept-' + mi + '" style="width:100%;max-width:800px"></canvas>'
                + '</div>';
        });
        App.setTrustedHTML(el, html);

        // Draw concept maps on canvases
        setTimeout(function () {
            conceptMaps.forEach(function (map, mi) {
                drawConceptMap(document.getElementById('tt-concept-' + mi), map);
            });
        }, 50);
    }

    function drawConceptMap(canvas, map) {
        if (!canvas) return;
        var w = 800, h = 300;
        var dpr = window.devicePixelRatio || 1;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        var ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        var bg = isDark ? '#0d1117' : '#ffffff';
        var textColor = isDark ? '#e6edf3' : '#1f2937';
        var lineColor = isDark ? '#30363d' : '#d1d5db';
        var nodeColor = isDark ? '#161b22' : '#f9fafb';
        var accentColor = '#22d3ee';

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // Draw edges
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1.5;
        map.edges.forEach(function (edge) {
            var from = map.nodes[edge[0]];
            var to = map.nodes[edge[1]];
            var fx = from.x * w / 100, fy = from.y * h / 100;
            var tx = to.x * w / 100, ty = to.y * h / 100;
            ctx.beginPath();
            ctx.moveTo(fx, fy + 12);
            ctx.lineTo(tx, ty - 12);
            ctx.stroke();
        });

        // Draw nodes
        ctx.font = '11px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        map.nodes.forEach(function (node) {
            var nx = node.x * w / 100, ny = node.y * h / 100;
            var tw = ctx.measureText(node.label).width + 16;
            var th = 24;

            ctx.fillStyle = node.root ? accentColor : nodeColor;
            ctx.strokeStyle = node.root ? accentColor : lineColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(nx - tw / 2, ny - th / 2, tw, th, 6);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = node.root ? '#06090f' : textColor;
            ctx.fillText(node.label, nx, ny);
        });
    }

    /* ------------------------------------------------------------------ */
    /*  Glossary                                                            */
    /* ------------------------------------------------------------------ */

    var glossaryTerms = [
        { term: 'Absolute Risk Reduction (ARR)', def: 'The difference in event rates between control and treatment groups. ARR = CER - EER. Used to calculate NNT.' },
        { term: 'Alpha (Type I Error)', def: 'The probability of rejecting the null hypothesis when it is actually true. Conventionally set at 0.05 (5%).' },
        { term: 'Beta (Type II Error)', def: 'The probability of failing to reject the null hypothesis when it is false. Power = 1 - beta.' },
        { term: 'Bias', def: 'Systematic error in the design, conduct, or analysis of a study that leads to a distorted estimate of the true effect.' },
        { term: 'Blinding', def: 'Concealing treatment assignment from participants, investigators, or assessors to prevent performance and detection bias.' },
        { term: 'Case-Control Study', def: 'Observational study that identifies cases (with outcome) and controls (without) and looks back at exposures.' },
        { term: 'Cohort Study', def: 'Observational study that follows a group over time to determine which exposures lead to outcomes.' },
        { term: 'Confidence Interval', def: 'A range of values within which the true population parameter is expected to fall with a specified probability (usually 95%).' },
        { term: 'Confounding', def: 'A variable that is associated with both the exposure and outcome, distorting the true relationship between them.' },
        { term: 'Effect Modification', def: 'When the effect of an exposure on an outcome differs across levels of a third variable (interaction).' },
        { term: 'Forest Plot', def: 'Graphical display of results from multiple studies in a meta-analysis, showing individual and pooled effect estimates with CIs.' },
        { term: 'Funnel Plot', def: 'Scatter plot of study effect sizes vs. precision, used to assess publication bias in meta-analysis.' },
        { term: 'Hazard Ratio (HR)', def: 'The ratio of hazard rates between groups in survival analysis. HR < 1 favors treatment; HR > 1 favors control.' },
        { term: 'Heterogeneity', def: 'Variation in study results beyond what is expected by chance. Measured by I-squared and Cochran\'s Q.' },
        { term: 'Incidence Rate', def: 'The rate of new cases per unit of person-time at risk. Accounts for varying follow-up durations.' },
        { term: 'Intention-to-Treat (ITT)', def: 'Analysis including all randomized participants in their assigned groups, regardless of compliance.' },
        { term: 'Kaplan-Meier Curve', def: 'Non-parametric estimator of the survival function, showing the probability of surviving past each time point.' },
        { term: 'Likelihood Ratio', def: 'The ratio of the probability of a test result in diseased vs. non-diseased persons. LR+ = Sens/(1-Spec).' },
        { term: 'Meta-Analysis', def: 'Statistical method combining results from multiple studies to produce a single pooled estimate.' },
        { term: 'NNT (Number Needed to Treat)', def: 'The number of patients who need to be treated for one additional patient to benefit. NNT = 1/ARR.' },
        { term: 'Odds Ratio (OR)', def: 'The ratio of the odds of an event in the exposed group to the odds in the unexposed group.' },
        { term: 'P-value', def: 'The probability of observing results at least as extreme as those seen, assuming the null hypothesis is true.' },
        { term: 'Power', def: 'The probability of correctly rejecting a false null hypothesis (detecting a true effect). Power = 1 - beta.' },
        { term: 'Prevalence', def: 'The proportion of a population with a disease at a specific point in time (point prevalence) or period.' },
        { term: 'Relative Risk (RR)', def: 'The ratio of event rates in exposed vs. unexposed groups. RR = Risk_exposed / Risk_unexposed.' },
        { term: 'Risk Difference (RD)', def: 'The absolute difference in event rates between groups. Also called absolute risk reduction when treatment is beneficial.' },
        { term: 'Selection Bias', def: 'Systematic error arising from how participants are selected or retained, leading to a non-representative sample.' },
        { term: 'Sensitivity', def: 'The proportion of true positives correctly identified by a test. Sens = TP / (TP + FN).' },
        { term: 'Specificity', def: 'The proportion of true negatives correctly identified by a test. Spec = TN / (TN + FP).' },
        { term: 'Systematic Review', def: 'A structured, comprehensive literature review with explicit methodology to minimize bias in identifying and synthesizing evidence.' }
    ];

    function renderGlossary(el) {
        var html = '<div class="card">'
            + '<div style="margin-bottom:1rem">'
            + '<input type="text" id="tt-glossary-search" placeholder="Search terms..." '
            + 'oninput="window.TeachingTools.filterGlossary(this.value)" '
            + 'style="width:100%;padding:0.75rem;border:1px solid var(--border);border-radius:8px;background:var(--surface-2);color:var(--text-primary);font-size:1rem">'
            + '</div>'
            + '<div id="tt-glossary-list">';

        glossaryTerms.forEach(function (item) {
            html += glossaryItem(item);
        });

        html += '</div></div>';
        App.setTrustedHTML(el, html);
    }

    function glossaryItem(item) {
        return '<div class="glossary-entry" style="padding:0.75rem 0;border-bottom:1px solid var(--border)">'
            + '<strong style="color:var(--accent)">' + item.term + '</strong>'
            + '<div style="margin-top:0.25rem;color:var(--text-secondary);font-size:0.9rem">' + item.def + '</div></div>';
    }

    function filterGlossary(term) {
        var lower = term.toLowerCase();
        var filtered = glossaryTerms.filter(function (item) {
            return item.term.toLowerCase().indexOf(lower) !== -1 || item.def.toLowerCase().indexOf(lower) !== -1;
        });
        var html = '';
        filtered.forEach(function (item) { html += glossaryItem(item); });
        if (filtered.length === 0) html = '<div style="padding:1rem;color:var(--text-secondary)">No matching terms found.</div>';
        var list = document.getElementById('tt-glossary-list');
        if (list) App.setTrustedHTML(list, html);
    }



    /* ------------------------------------------------------------------ */
    /*  Public API                                                          */
    /* ------------------------------------------------------------------ */

    window.TeachingTools = {
        switchTool: switchTool,
        // Biostat quiz generator
        startBiostatQuiz: startBiostatQuiz,
        answerBiostatQuiz: answerBiostatQuiz,
        nextBiostatQuestion: nextBiostatQuestion,
        finishBiostatQuiz: finishBiostatQuiz,
        reviewBiostatQuiz: reviewBiostatQuiz,
        // Flashcards
        flipFlashcard: flipFlashcard,
        nextFlashcard: nextFlashcard,
        prevFlashcard: prevFlashcard,
        shuffleFlashcards: shuffleFlashcards,
        // Decision tree
        chooseTreeOption: chooseTreeOption,
        backDecisionTree: backDecisionTree,
        resetDecisionTree: resetDecisionTree,
        // Journal club
        copyWorksheet: copyWorksheet,
        clearWorksheet: clearWorksheet,
        // Glossary
        filterGlossary: filterGlossary
    };

    App.registerModule(MODULE_ID, { render: render });
})();
