/**
 * Neuro-Epi — Methods Generator
 * Auto-generates publication-ready statistical methods paragraphs for manuscripts.
 * Includes customizable parameters, common templates, reporting checklists,
 * study-design-specific templates with fill-in-blank fields,
 * Statistical Analysis Plan (SAP) outline generator,
 * and CONSORT/STROBE statement methods mapping.
 */
(function() {
    'use strict';
    const MODULE_ID = 'methods-generator';

    /* ================================================================
       DATA: Analysis methods by outcome type, templates, checklists
       ================================================================ */

    var ANALYSIS_METHODS = {
        binary: [
            { value: 'chi2', label: 'Chi-squared test' },
            { value: 'fisher', label: "Fisher's exact test" },
            { value: 'logistic', label: 'Logistic regression' },
            { value: 'log-binomial', label: 'Log-binomial regression (RR)' },
            { value: 'modified-poisson', label: 'Modified Poisson regression (RR)' },
            { value: 'gee-binary', label: 'GEE (binary, clustered data)' },
            { value: 'mixed-logistic', label: 'Mixed-effects logistic regression' },
            { value: 'propensity', label: 'Propensity score-adjusted logistic regression' },
            { value: 'cmh', label: 'Cochran-Mantel-Haenszel test' }
        ],
        continuous: [
            { value: 'ttest', label: 'Independent samples t-test' },
            { value: 'paired-t', label: 'Paired t-test' },
            { value: 'anova', label: 'One-way ANOVA' },
            { value: 'ancova', label: 'ANCOVA' },
            { value: 'linear', label: 'Linear regression' },
            { value: 'mixed-linear', label: 'Linear mixed-effects model' },
            { value: 'wilcoxon', label: 'Wilcoxon rank-sum (Mann-Whitney U)' },
            { value: 'kruskal', label: 'Kruskal-Wallis test' },
            { value: 'gee-continuous', label: 'GEE (continuous, clustered data)' },
            { value: 'rmanova', label: 'Repeated measures ANOVA' }
        ],
        'time-to-event': [
            { value: 'logrank', label: 'Log-rank test' },
            { value: 'cox', label: 'Cox proportional hazards regression' },
            { value: 'km', label: 'Kaplan-Meier with log-rank' },
            { value: 'fine-gray', label: 'Fine-Gray competing risks regression' },
            { value: 'cox-td', label: 'Cox regression with time-dependent covariates' },
            { value: 'frailty', label: 'Shared frailty (clustered survival) model' },
            { value: 'parametric-surv', label: 'Parametric survival model (Weibull/exponential)' },
            { value: 'landmark', label: 'Landmark analysis' }
        ],
        ordinal: [
            { value: 'ordinal-logistic', label: 'Ordinal (proportional odds) logistic regression' },
            { value: 'wilcoxon-ord', label: 'Wilcoxon rank-sum test' },
            { value: 'cmh-ordinal', label: 'CMH test (row mean scores)' },
            { value: 'ordinal-mixed', label: 'Cumulative link mixed model' },
            { value: 'shift', label: 'Shift analysis (common OR)' }
        ],
        count: [
            { value: 'poisson', label: 'Poisson regression' },
            { value: 'negbin', label: 'Negative binomial regression' },
            { value: 'zip', label: 'Zero-inflated Poisson' },
            { value: 'zinb', label: 'Zero-inflated negative binomial' }
        ]
    };

    var MULTIPLICITY_METHODS = [
        { value: 'none', label: 'None (single primary outcome)' },
        { value: 'bonferroni', label: 'Bonferroni correction' },
        { value: 'holm', label: 'Holm step-down procedure' },
        { value: 'hochberg', label: 'Hochberg step-up procedure' },
        { value: 'bh', label: 'Benjamini-Hochberg (FDR)' },
        { value: 'hierarchical', label: 'Hierarchical (gatekeeping) testing' },
        { value: 'alpha-split', label: 'Alpha splitting across co-primary endpoints' }
    ];

    var MISSING_METHODS = [
        { value: 'complete', label: 'Complete case analysis' },
        { value: 'mi', label: 'Multiple imputation (MICE)' },
        { value: 'locf', label: 'Last observation carried forward (LOCF)' },
        { value: 'mmrm', label: 'Mixed model for repeated measures (MMRM)' },
        { value: 'ipw', label: 'Inverse probability weighting' },
        { value: 'pmm', label: 'Pattern mixture models' },
        { value: 'worst-case', label: 'Worst-case imputation (sensitivity)' }
    ];

    var SOFTWARE_OPTIONS = [
        { value: 'r', label: 'R (version 4.x)' },
        { value: 'stata', label: 'Stata (version 18)' },
        { value: 'sas', label: 'SAS (version 9.4)' },
        { value: 'spss', label: 'IBM SPSS (version 29)' },
        { value: 'python', label: 'Python (statsmodels / scipy)' },
        { value: 'prism', label: 'GraphPad Prism' },
        { value: 'jmp', label: 'JMP Pro' }
    ];

    var COMMON_TEMPLATES = {
        'rct-binary': {
            name: 'Two-Arm RCT (Binary Outcome)',
            text: 'The primary analysis compared the proportion of patients achieving [outcome] between the [intervention] and [control] groups using the chi-squared test (or Fisher\'s exact test if expected cell counts were <5). The primary analysis was conducted on the intention-to-treat (ITT) population, defined as all randomized participants analyzed according to their assigned treatment group regardless of adherence. The treatment effect was quantified as the absolute risk difference with its 95% confidence interval, along with the relative risk and number needed to treat (NNT). A pre-specified per-protocol analysis was conducted as a sensitivity analysis, restricted to participants who completed the study without major protocol violations. Subgroup analyses were performed for [pre-specified subgroups] using interaction tests between treatment assignment and subgroup variable in a logistic regression model. A two-sided alpha of 0.05 was used for the primary outcome. No adjustment for multiplicity was applied to secondary endpoints, which are reported as point estimates with 95% confidence intervals and should be interpreted as exploratory.'
        },
        'rct-continuous': {
            name: 'Two-Arm RCT (Continuous Outcome)',
            text: 'The primary outcome, [outcome measure], was compared between treatment groups using analysis of covariance (ANCOVA) with the baseline value as a covariate and treatment group as the independent variable. The treatment effect was estimated as the adjusted mean difference with 95% confidence interval. The primary analysis was based on the ITT population. Normality of residuals was assessed using the Shapiro-Wilk test and visual inspection of Q-Q plots. If the normality assumption was violated, the Wilcoxon rank-sum test was used as a sensitivity analysis, with the Hodges-Lehmann estimate of location shift and its 95% confidence interval. A mixed-effects model for repeated measures (MMRM) was used for longitudinal secondary outcomes, with an unstructured covariance matrix, including terms for treatment, visit, treatment-by-visit interaction, baseline value, and stratification factors. Model-based least squares means and their differences at each time point are reported with 95% confidence intervals.'
        },
        'tte-analysis': {
            name: 'Time-to-Event Analysis',
            text: 'Time-to-event outcomes were analyzed using the Kaplan-Meier method, with survival curves compared between groups using the log-rank test. Median survival times with 95% confidence intervals were estimated for each group. The treatment effect was quantified using a Cox proportional hazards regression model, yielding the hazard ratio (HR) with 95% confidence interval. The proportional hazards assumption was evaluated by examining scaled Schoenfeld residuals and testing for a time-by-treatment interaction; if violated, a time-varying coefficient or restricted mean survival time (RMST) analysis was planned. Participants who were event-free at the end of follow-up or lost to follow-up were censored at their last known alive date. Competing risks were handled using the Fine-Gray subdistribution hazard model, with the subdistribution HR reported alongside the cause-specific HR. Cumulative incidence functions were plotted to visualize the competing events. Multivariable Cox models included pre-specified covariates: [list covariates].'
        },
        'obs-propensity': {
            name: 'Observational Cohort with Propensity Score',
            text: 'To minimize confounding by indication, propensity scores for receipt of [exposure/treatment] were estimated using a multivariable logistic regression model including the following baseline covariates: [list covariates]. The propensity score model\'s discrimination was assessed using the C-statistic. Balance of covariates between groups was evaluated before and after adjustment using standardized mean differences (SMD), with an SMD <0.10 considered indicative of adequate balance. The primary analysis used inverse probability of treatment weighting (IPTW) with stabilized weights, trimmed at the 1st and 99th percentiles to reduce the influence of extreme weights. The average treatment effect (ATE) was estimated using a weighted [Cox / logistic / linear] regression model. Sensitivity analyses included: (1) propensity score matching using nearest-neighbor 1:1 matching with a caliper of 0.2 standard deviations of the logit of the propensity score; (2) doubly robust estimation combining IPTW with outcome regression; (3) the E-value to assess the robustness of findings to unmeasured confounding. A negative control outcome analysis was conducted to detect residual confounding.'
        },
        'meta-analysis-dl': {
            name: 'Meta-Analysis (DerSimonian-Laird)',
            text: 'A random-effects meta-analysis was conducted using the DerSimonian-Laird estimator for between-study variance (tau-squared). The pooled effect estimate was calculated as the weighted mean of study-specific estimates, with weights inversely proportional to the sum of within-study and between-study variance. Heterogeneity was assessed using Cochran\'s Q test (with significance at P<0.10 due to low power) and quantified using the I-squared statistic, interpreted as: <25% low, 25-75% moderate, >75% high heterogeneity. The prediction interval was reported to convey the range of true effects expected in future similar studies. Pre-specified subgroup analyses were conducted using random-effects meta-regression with the Knapp-Hartung adjustment for the confidence interval of the pooled estimate. Publication bias was assessed visually using a funnel plot and statistically using Egger\'s regression test (for continuous outcomes) or the Peters test (for binary outcomes with ORs). If publication bias was suspected, the trim-and-fill method was applied as a sensitivity analysis. A leave-one-out analysis was performed to assess the influence of individual studies. Results are presented as forest plots with study-level and pooled effect estimates and 95% confidence intervals.'
        },
        'diagnostic-accuracy': {
            name: 'Diagnostic Accuracy Study',
            text: 'Diagnostic accuracy was assessed by comparing the index test ([test name]) against the reference standard ([reference standard]) in a cross-sectional design. Sensitivity, specificity, positive predictive value (PPV), negative predictive value (NPV), and their 95% confidence intervals (Wilson method) were calculated from the 2x2 classification table. Positive and negative likelihood ratios with 95% CIs were derived. The area under the receiver operating characteristic (ROC) curve (AUC) was calculated to assess overall discriminative ability, with 95% CI estimated using the DeLong method. The optimal threshold was determined by maximizing the Youden index (J = sensitivity + specificity - 1). For comparison of two diagnostic tests, the difference in AUC was tested using the DeLong test for paired ROC curves. The study was designed and reported in accordance with the STARD (Standards for Reporting Diagnostic Accuracy) guidelines.'
        }
    };

    var REPORTING_CHECKLISTS = {
        consort: {
            name: 'CONSORT (RCTs)',
            items: [
                'Title: Identified as randomized trial',
                'Trial design: Description of trial design (parallel, factorial, etc.)',
                'Participants: Eligibility criteria, settings, locations',
                'Interventions: Details of interventions for each group with sufficient detail for replication',
                'Outcomes: Pre-specified primary and secondary outcomes, including how and when assessed',
                'Sample size: How sample size was determined (including interim analyses and stopping rules)',
                'Randomization: Method of generating allocation sequence, type, mechanism of allocation concealment',
                'Blinding: Who was blinded (participants, care providers, outcome assessors); how blinding was ensured',
                'Statistical methods: Methods used to compare groups for primary and secondary outcomes; methods for additional analyses (subgroup, adjusted)',
                'Participant flow: CONSORT flow diagram with numbers at each stage',
                'Baseline data: Table of baseline demographic and clinical characteristics by group',
                'Numbers analyzed: Number in each group included in each analysis and whether ITT',
                'Outcomes and estimation: For each outcome, effect size with CI and p-value',
                'Ancillary analyses: Subgroup and adjusted analyses, distinguishing pre-specified from exploratory',
                'Harms: All important harms or unintended effects in each group',
                'Registration: Registration number and registry name',
                'Protocol: Where full protocol can be accessed',
                'Funding: Sources of funding and role of funders'
            ]
        },
        strobe: {
            name: 'STROBE (Observational Studies)',
            items: [
                'Title/abstract: Indicate study design in title or abstract',
                'Background: Scientific background and rationale; specific objectives/hypotheses',
                'Study design: Present key elements of study design early in the paper',
                'Setting: Describe setting, locations, relevant dates (recruitment, exposure, follow-up, data collection)',
                'Participants: Eligibility criteria, sources, methods of selection, follow-up',
                'Variables: Define outcomes, exposures, predictors, confounders, effect modifiers; give diagnostic criteria',
                'Data sources: Describe measurement methods for each variable of interest',
                'Bias: Describe any efforts to address potential sources of bias',
                'Study size: Explain how the study size was arrived at',
                'Quantitative variables: Explain how quantitative variables were handled; describe groupings and rationale',
                'Statistical methods: Describe all statistical methods; how confounders were handled; how missing data were addressed; sensitivity analyses',
                'Participants: Numbers at each study stage (diagram recommended); reasons for non-participation',
                'Descriptive data: Characteristics of participants; number with missing data for each variable',
                'Outcome data: Numbers of outcome events or summary measures over time',
                'Main results: Unadjusted and adjusted estimates with CI and p-values; category boundaries if continuous variables were categorized',
                'Other analyses: Subgroup, interaction, sensitivity analyses',
                'Key results: Summarize key results with reference to study objectives',
                'Limitations: Discuss sources of bias or imprecision; direction and magnitude of bias',
                'Generalizability: Discuss external validity',
                'Funding: Sources of funding and role of funders'
            ]
        },
        prisma: {
            name: 'PRISMA (Systematic Reviews)',
            items: [
                'Title: Identify the report as a systematic review, meta-analysis, or both',
                'Protocol and registration: Registration info (PROSPERO); protocol access',
                'Eligibility criteria: Inclusion/exclusion criteria with rationale; PICO elements',
                'Information sources: All databases searched with dates; other sources (registries, contact with authors)',
                'Search strategy: Full electronic search strategy for at least one database; replicable',
                'Selection process: Process for selecting studies (screening, eligibility); number of reviewers',
                'Data collection: Process for data extraction; number of reviewers; how disagreements resolved',
                'Data items: List and define all variables for which data were sought',
                'Risk of bias assessment: Tool used (RoB 2, NOS, etc.); how applied; how used in synthesis',
                'Effect measures: Specify effect measures used (RR, OR, MD, SMD)',
                'Synthesis methods: Describe meta-analytic method; handling of heterogeneity; sensitivity/subgroup analyses',
                'Study selection: PRISMA flow diagram with numbers at each stage',
                'Study characteristics: Table of included studies with key characteristics',
                'Risk of bias results: Summary of risk of bias assessments',
                'Results of syntheses: Forest plots; pooled estimates with CI; heterogeneity statistics (I-squared, tau-squared)',
                'Publication bias: Results of publication bias assessment',
                'Certainty of evidence: GRADE assessment for each outcome',
                'Discussion: Summary, limitations of evidence, limitations of review, implications'
            ]
        }
    };

    /* ================================================================
       NEW DATA: Study-design-specific templates with fill-in-blank
       ================================================================ */

    var STUDY_DESIGN_TEMPLATES = {
        'rct': {
            name: 'Randomized Controlled Trial (RCT)',
            guideline: 'CONSORT 2010',
            sections: [
                {
                    title: 'Trial Design',
                    text: 'This was a [parallel-group / crossover / factorial / cluster-randomized], [double-blind / single-blind / open-label], [superiority / non-inferiority / equivalence] randomized controlled trial conducted at [number] center(s) in [country/region]. The trial was registered at [registry name] ([registration number]) and approved by [institutional review board / ethics committee] at [institution]. Written informed consent was obtained from all participants (or their legally authorized representatives).'
                },
                {
                    title: 'Participants',
                    text: 'Eligible participants were adults aged [age range] years with [condition/diagnosis] confirmed by [diagnostic criteria]. Key inclusion criteria were: [criterion 1], [criterion 2], [criterion 3]. Key exclusion criteria were: [criterion 1], [criterion 2], [criterion 3]. Participants were recruited from [setting, e.g., emergency departments, outpatient clinics] between [start date] and [end date].'
                },
                {
                    title: 'Randomization and Blinding',
                    text: 'Participants were randomly assigned in a [1:1 / 2:1 / other] ratio to [intervention group name] or [control group name] using a computer-generated random sequence with [permuted blocks of size X / stratified by Y]. The allocation sequence was generated by [independent statistician / automated system] and concealed using [sealed opaque envelopes / centralized web-based system / interactive voice response system]. [Participants / care providers / outcome assessors] were blinded to treatment assignment. [Describe how blinding was maintained, e.g., matching placebo, sham procedure].'
                },
                {
                    title: 'Intervention',
                    text: 'The intervention group received [detailed intervention description including dose, route, frequency, duration]. The control group received [standard care / placebo / active comparator: describe]. Treatment was administered by [trained personnel type] according to [protocol / guidelines]. Treatment adherence was assessed by [method]. Participants were followed for [duration] after randomization.'
                },
                {
                    title: 'Outcomes',
                    text: 'The primary outcome was [outcome description] assessed at [time point] by [method of assessment]. Secondary outcomes included: (1) [outcome 1] at [time point]; (2) [outcome 2] at [time point]; (3) [outcome 3] at [time point]. Safety outcomes included [adverse events, serious adverse events, specific safety endpoints]. All outcomes were assessed by [blinded / central / independent] assessors using [standardized instrument / validated scale].'
                },
                {
                    title: 'Statistical Analysis',
                    text: 'The sample size of [N] participants ([n] per group) was calculated to provide [80% / 90%] power to detect a [clinically meaningful difference / minimum clinically important difference] of [effect size] at a two-sided significance level of [0.05], assuming [additional assumptions, e.g., dropout rate, baseline rate]. The primary analysis was conducted in the intention-to-treat (ITT) population using [statistical test / model]. The treatment effect was reported as [effect measure, e.g., odds ratio, mean difference] with 95% confidence intervals. Pre-specified subgroup analyses included [list]. Missing data were handled by [method]. All analyses were performed using [software and version]. A two-sided P < [alpha] was considered statistically significant for the primary outcome.'
                }
            ]
        },
        'cohort': {
            name: 'Cohort Study',
            guideline: 'STROBE Statement',
            sections: [
                {
                    title: 'Study Design and Setting',
                    text: 'This was a [prospective / retrospective / ambidirectional] cohort study using data from [data source, e.g., institutional registry, administrative database, medical records]. The study was conducted at [institution(s)] in [location] and included patients [admitted / treated / diagnosed] between [start date] and [end date]. The study was approved by [ethics committee] with [waiver of / requirement for] informed consent. The study is reported in accordance with the STROBE guidelines.'
                },
                {
                    title: 'Participants',
                    text: 'The study population comprised [consecutive / all eligible] patients aged [age range] with [condition] identified using [ICD codes / clinical criteria / registry definition]. The exposed group consisted of patients who [received intervention / had exposure], and the unexposed group consisted of [comparator description]. Patients were excluded if they had [exclusion criterion 1], [exclusion criterion 2], or [exclusion criterion 3]. Follow-up began at [index date definition] and continued until [outcome event / death / loss to follow-up / end of study period / administrative censoring on date].'
                },
                {
                    title: 'Variables and Data Collection',
                    text: 'The primary exposure was [exposure definition], classified as [binary: yes/no / categorical / continuous / time-varying]. The primary outcome was [outcome definition], ascertained by [method: chart review, ICD codes, adjudication committee]. Covariates were selected a priori based on clinical knowledge and included: [demographics: age, sex, race/ethnicity], [comorbidities: list], [baseline severity: score/scale], and [treatment variables]. Data were extracted from [source] using [method] by [trained abstractors / automated extraction]. Inter-rater reliability was assessed for [% of charts] with a kappa of [value].'
                },
                {
                    title: 'Statistical Analysis',
                    text: 'Baseline characteristics were compared between groups using [chi-squared tests / t-tests / Wilcoxon rank-sum tests] as appropriate. The primary analysis used [Cox proportional hazards / logistic regression / linear regression] to estimate the association between [exposure] and [outcome], reported as [HR / OR / coefficient] with 95% confidence intervals. Models were adjusted for [confounders]. The proportional hazards assumption was tested using [Schoenfeld residuals / log-log plots]. To address confounding by indication, [propensity score matching / IPTW / stratification / E-value] was performed. Sensitivity analyses included: (1) [analysis 1]; (2) [analysis 2]; (3) [analysis 3]. Missing data for [variables] were addressed using [method]. All analyses used [software and version] with a two-sided alpha of [0.05].'
                }
            ]
        },
        'case-control': {
            name: 'Case-Control Study',
            guideline: 'STROBE Statement',
            sections: [
                {
                    title: 'Study Design',
                    text: 'This was a [population-based / facility-based / nested] case-control study conducted using data from [source] in [location] between [dates]. The study was approved by [ethics committee]. Reporting follows the STROBE guidelines for case-control studies.'
                },
                {
                    title: 'Case Definition and Selection',
                    text: 'Cases were defined as patients with [outcome/disease], identified using [diagnostic criteria / ICD codes / pathological confirmation / clinical adjudication]. [Incident / prevalent] cases were identified from [source population]. A total of [N] cases were identified during the study period. Cases were [consecutively / randomly] selected from [source].'
                },
                {
                    title: 'Control Selection',
                    text: 'Controls were selected from [same source population / facility patients / community volunteers] who did not have [outcome/disease] at the time of case diagnosis. Controls were matched to cases in a [1:1 / 1:2 / 1:4] ratio on [matching variables, e.g., age (+/- X years), sex, facility, calendar year]. [Incidence density sampling / risk-set sampling / cumulative sampling] was used. [N] controls were selected.'
                },
                {
                    title: 'Exposure Assessment',
                    text: 'The primary exposure of interest was [exposure], ascertained by [medical records / questionnaire / biomarker / database]. Exposure was classified as [binary / categorical / continuous] and defined as [definition]. Information on potential confounders was collected including: [list covariates]. Exposure data were collected [blinded / unblinded] to case-control status by [method].'
                },
                {
                    title: 'Statistical Analysis',
                    text: 'The association between [exposure] and [outcome] was estimated using [conditional logistic regression (for matched studies) / unconditional logistic regression], yielding odds ratios (OR) with 95% confidence intervals. Models were adjusted for [confounders]. Dose-response was assessed by [modeling exposure as ordinal / restricted cubic splines / trend test]. Effect modification was assessed using [interaction terms / stratified analyses] for [variables]. Sensitivity analyses included: [list]. The sample size provided [X]% power to detect an OR of [value] with [alpha]. All analyses used [software].'
                }
            ]
        },
        'cross-sectional': {
            name: 'Cross-Sectional Study',
            guideline: 'STROBE Statement',
            sections: [
                {
                    title: 'Study Design and Setting',
                    text: 'This was a [cross-sectional / repeated cross-sectional] study conducted at [institution/setting] in [location] between [dates]. The study was approved by [ethics committee]. Data were collected as part of [routine clinical care / a dedicated survey / a registry / a larger cohort study baseline assessment]. The study is reported according to the STROBE guidelines.'
                },
                {
                    title: 'Participants',
                    text: 'The study included [consecutive / randomly sampled / all eligible] [adults / patients / individuals] aged [age range] who [met criteria]. Participants were recruited via [method, e.g., consecutive enrollment, random sampling, convenience sampling]. The response rate was [X]%. Exclusion criteria included: [criterion 1], [criterion 2]. A total of [N] participants were included in the final analysis.'
                },
                {
                    title: 'Variables and Measurements',
                    text: 'The primary outcome was [prevalence of condition / score on instrument], assessed using [method/instrument]. The primary exposure/variable of interest was [variable], measured by [method]. Covariates included [demographics], [clinical variables], and [social determinants]. All measurements were performed by [trained personnel] using [standardized protocol]. [Instrument] has been previously validated with a reported reliability of [kappa/ICC/alpha = value].'
                },
                {
                    title: 'Statistical Analysis',
                    text: 'Descriptive statistics were calculated as frequencies and percentages for categorical variables, and means (SD) or medians (IQR) for continuous variables depending on distribution. Prevalence estimates were reported with 95% confidence intervals calculated using the [Wilson / Clopper-Pearson / Wald] method. Associations between [variables] were assessed using [chi-squared test / logistic regression / linear regression / Poisson regression with robust variance (for prevalence ratios)]. Prevalence ratios were preferred over odds ratios because the outcome prevalence exceeded 10%. Multivariable models were adjusted for [confounders]. [Survey weights / cluster-adjusted standard errors] were used to account for [complex survey design / clustering]. Missing data were handled by [method]. All analyses used [software].'
                }
            ]
        },
        'systematic-review': {
            name: 'Systematic Review / Meta-Analysis',
            guideline: 'PRISMA 2020',
            sections: [
                {
                    title: 'Protocol and Registration',
                    text: 'This systematic review was conducted according to a pre-specified protocol registered with PROSPERO ([registration number: CRD__________]) and is reported in accordance with the PRISMA 2020 guidelines. The review question was formulated using the PICO framework: Population: [population]; Intervention/Exposure: [intervention]; Comparator: [comparator]; Outcome: [outcome].'
                },
                {
                    title: 'Search Strategy',
                    text: 'A comprehensive literature search was conducted in [PubMed/MEDLINE, Embase, Cochrane CENTRAL, Web of Science, other databases] from inception through [date] with no language restrictions. The search strategy was developed in consultation with a [medical librarian / information specialist] using a combination of Medical Subject Headings (MeSH) and free-text terms related to [key concepts]. The full search strategy for [primary database] is provided in [Supplementary Table/Appendix]. Reference lists of included studies and relevant review articles were hand-searched. [ClinicalTrials.gov and WHO ICTRP] were searched for unpublished and ongoing studies. [Authors of key studies] were contacted for additional data.'
                },
                {
                    title: 'Study Selection',
                    text: 'Studies were included if they: (1) enrolled [population]; (2) evaluated [intervention/exposure]; (3) reported [outcome]; and (4) used a [study design, e.g., RCT, cohort, any comparative design]. Studies were excluded if: (1) [criterion]; (2) [criterion]; (3) [conference abstracts without sufficient data]. Two independent reviewers ([initials]) screened titles and abstracts using [Covidence / Rayyan / other software]. Full-text articles of potentially eligible studies were assessed independently by both reviewers. Disagreements were resolved by consensus or consultation with a third reviewer ([initials]). Inter-rater agreement was assessed using Cohen\'s kappa.'
                },
                {
                    title: 'Data Extraction and Quality Assessment',
                    text: 'Data were extracted independently by two reviewers using a standardized data extraction form piloted on [N] studies. Extracted data included: study characteristics (author, year, country, design, sample size, follow-up), participant characteristics ([list key variables]), intervention/exposure details, outcome definitions and results ([effect measures, counts, means, SDs]). Risk of bias was assessed using [Cochrane RoB 2 for RCTs / ROBINS-I for non-randomized / NOS / JBI tool]. Certainty of evidence was assessed using the GRADE framework for each key outcome.'
                },
                {
                    title: 'Data Synthesis',
                    text: 'A random-effects meta-analysis was performed using the [DerSimonian-Laird / restricted maximum likelihood (REML) / Hartung-Knapp-Sidik-Jonkman] estimator. The effect measure was [OR / RR / HR / MD / SMD] with 95% confidence intervals. Heterogeneity was assessed using Cochran\'s Q test (P < 0.10) and quantified using I-squared and tau-squared. The 95% prediction interval was reported. Pre-specified subgroup analyses were performed by [variables]. Meta-regression was conducted to explore sources of heterogeneity if >= 10 studies were available. Publication bias was assessed visually using funnel plots and statistically using [Egger\'s / Peters / Begg\'s] test when >= 10 studies were available; trim-and-fill analysis was performed if bias was suspected. Sensitivity analyses included: (1) leave-one-out analysis; (2) [restricting to low RoB studies]; (3) [alternative effect measure]. Analyses were performed using [R metafor / Stata metan / RevMan / other].'
                }
            ]
        },
        'diagnostic-accuracy': {
            name: 'Diagnostic Accuracy Study',
            guideline: 'STARD 2015',
            sections: [
                {
                    title: 'Study Design',
                    text: 'This was a [prospective / retrospective] [cross-sectional / cohort] diagnostic accuracy study conducted at [institution(s)] in [location] between [dates]. The study was designed and reported in accordance with the Standards for Reporting Diagnostic Accuracy (STARD 2015) guidelines. The study was approved by [ethics committee].'
                },
                {
                    title: 'Participants',
                    text: 'The study enrolled [consecutive / randomly sampled] patients presenting with [clinical presentation / symptoms / clinical suspicion of condition] at [setting]. Inclusion criteria were: [criterion 1], [criterion 2]. Exclusion criteria were: [criterion 1, e.g., prior diagnosis, inability to undergo reference standard], [criterion 2]. The intended sample was [spectrum of disease severity: mild to severe / clinical referral population / screening population].'
                },
                {
                    title: 'Index Test and Reference Standard',
                    text: 'The index test was [test name], performed according to [manufacturer instructions / standardized protocol]. The test was [interpreted by / scored using] [method], with a pre-specified positive threshold of [cutoff value / criteria]. The reference standard was [test/diagnosis method], considered the best available method for confirming [target condition]. The reference standard was performed [within X hours/days of the index test / regardless of index test results (complete verification)]. [Index test / reference standard] results were interpreted blinded to the results of [the other test / clinical information]. If any patients did not receive the reference standard, [describe how partial verification was handled].'
                },
                {
                    title: 'Statistical Analysis',
                    text: 'Diagnostic accuracy was evaluated by calculating sensitivity, specificity, positive predictive value (PPV), negative predictive value (NPV), and their 95% confidence intervals (Wilson method) from the 2x2 classification table. Positive and negative likelihood ratios with 95% CIs were computed. The area under the receiver operating characteristic (ROC) curve (AUC) was calculated with 95% CI using the [DeLong / bootstrap] method. The optimal cutoff was determined by maximizing the Youden index (J = sensitivity + specificity - 1). [If applicable: For comparison of two tests, paired ROC curves were compared using the DeLong test.] Subgroup analyses were performed by [variables]. Indeterminate/failed test results were reported separately and handled by [excluding from primary analysis / assigning as positive/negative / sensitivity analysis]. All analyses used [software].'
                }
            ]
        }
    };

    /* ================================================================
       NEW DATA: SAP section structure
       ================================================================ */

    var SAP_SECTIONS = [
        { id: 'admin', title: '1. Administrative Information', items: [
            'Study title',
            'SAP version and date',
            'Protocol version',
            'SAP authors and affiliations',
            'Signatures (statistician, PI, sponsor)',
            'Trial registration number'
        ]},
        { id: 'intro', title: '2. Introduction', items: [
            'Brief study background',
            'Study objectives (primary, secondary, exploratory)',
            'Study design summary',
            'Protocol amendments affecting analysis'
        ]},
        { id: 'endpoints', title: '3. Study Endpoints', items: [
            'Primary endpoint definition and measurement',
            'Key secondary endpoints',
            'Safety endpoints',
            'Exploratory endpoints',
            'Timing of endpoint assessment',
            'Handling of composite endpoints'
        ]},
        { id: 'populations', title: '4. Analysis Populations', items: [
            'Intention-to-treat (ITT) population definition',
            'Modified ITT (mITT) population definition',
            'Per-protocol (PP) population definition',
            'Safety population definition',
            'Rules for excluding participants from each population'
        ]},
        { id: 'sample-size', title: '5. Sample Size and Power', items: [
            'Sample size calculation with all assumptions',
            'Power statement',
            'Adjustment for dropout/non-compliance',
            'Re-estimation plan (if adaptive)',
            'Interim analysis plan and alpha spending function'
        ]},
        { id: 'descriptive', title: '6. General Statistical Methods', items: [
            'Significance level (two-sided alpha)',
            'Confidence interval level (95%)',
            'Continuous variables: mean (SD) or median (IQR)',
            'Categorical variables: n (%)',
            'Baseline comparisons between groups',
            'Multiplicity adjustment strategy'
        ]},
        { id: 'primary', title: '7. Analysis of Primary Endpoint', items: [
            'Statistical model specification',
            'Covariates/stratification factors in model',
            'Effect measure and its CI',
            'Hypothesis (superiority, non-inferiority margin)',
            'Sensitivity analyses for primary endpoint',
            'Handling of intercurrent events (estimand framework)'
        ]},
        { id: 'secondary', title: '8. Analysis of Secondary Endpoints', items: [
            'Statistical methods for each secondary endpoint',
            'Testing hierarchy or multiplicity adjustment',
            'Sensitivity analyses'
        ]},
        { id: 'subgroup', title: '9. Subgroup and Interaction Analyses', items: [
            'List of pre-specified subgroups',
            'Method (interaction terms in regression)',
            'Forest plot presentation',
            'Interpretation guidance (exploratory)'
        ]},
        { id: 'missing', title: '10. Missing Data', items: [
            'Expected pattern and amount of missing data',
            'Primary approach (e.g., MMRM, multiple imputation)',
            'Imputation model specification (if MI)',
            'Sensitivity analyses under MNAR (tipping point, pattern mixture)',
            'Missing data reporting requirements'
        ]},
        { id: 'safety', title: '11. Safety Analyses', items: [
            'Adverse event coding (MedDRA)',
            'Summary tables (TEAEs, SAEs, deaths)',
            'Exposure-adjusted incidence rates',
            'Laboratory and vital signs analysis',
            'Predefined safety stopping rules'
        ]},
        { id: 'interim', title: '12. Interim Analyses', items: [
            'Number and timing of interim looks',
            'Alpha spending function (O\'Brien-Fleming / Pocock)',
            'Stopping boundaries (efficacy and futility)',
            'DSMB charter summary',
            'Conditional power for futility'
        ]},
        { id: 'software', title: '13. Software and Programming', items: [
            'Statistical software and version',
            'Key packages/procedures',
            'Validation and QC procedures',
            'Table shells and mock figures'
        ]}
    ];

    /* ================================================================
       NEW DATA: CONSORT/STROBE methods mapping
       ================================================================ */

    var METHODS_MAPPING = {
        consort: {
            name: 'CONSORT 2010 Methods Mapping',
            description: 'Maps CONSORT checklist items to the corresponding methods paragraph section.',
            items: [
                { item: '3a. Trial design', section: 'Trial Design', guidance: 'Describe trial design (parallel, crossover, factorial) including allocation ratio.' },
                { item: '3b. Important changes after trial start', section: 'Trial Design', guidance: 'Report protocol changes with reasons. Reference protocol amendments.' },
                { item: '4a. Eligibility criteria', section: 'Participants', guidance: 'List inclusion and exclusion criteria with rationale for each.' },
                { item: '4b. Settings and locations', section: 'Participants', guidance: 'Describe study sites, clinical settings, dates of enrollment.' },
                { item: '5. Interventions', section: 'Intervention', guidance: 'Describe interventions for each arm with enough detail for replication (dose, schedule, route, duration).' },
                { item: '6a. Pre-specified outcomes', section: 'Outcomes', guidance: 'Define primary and secondary outcomes precisely, including measurement tools and timing.' },
                { item: '6b. Changes to outcomes', section: 'Outcomes', guidance: 'Report any changes from protocol with rationale.' },
                { item: '7a. Sample size determination', section: 'Statistical Analysis', guidance: 'Report sample size calculation with all assumptions (effect size, alpha, power, variance, dropout).' },
                { item: '7b. Interim analysis and stopping', section: 'Statistical Analysis', guidance: 'Describe interim analysis plan and stopping rules.' },
                { item: '8a. Sequence generation', section: 'Randomization and Blinding', guidance: 'Describe method for generating allocation sequence (computer-generated, etc.).' },
                { item: '8b. Randomization type', section: 'Randomization and Blinding', guidance: 'Describe type: simple, blocked (block size), stratified (stratification factors).' },
                { item: '9. Allocation concealment', section: 'Randomization and Blinding', guidance: 'Describe mechanism (central, sealed envelopes, IVRS) and who implemented.' },
                { item: '10. Implementation', section: 'Randomization and Blinding', guidance: 'Report who generated sequence, enrolled participants, and assigned interventions.' },
                { item: '11a. Blinding', section: 'Randomization and Blinding', guidance: 'Report who was blinded (participants, care providers, assessors) and how.' },
                { item: '12a. Statistical methods for primary', section: 'Statistical Analysis', guidance: 'Describe primary analysis method, ITT/PP populations, covariates, sensitivity analyses.' },
                { item: '12b. Subgroup and adjusted analyses', section: 'Statistical Analysis', guidance: 'Describe pre-specified subgroup analyses and interaction tests.' }
            ]
        },
        strobe: {
            name: 'STROBE Methods Mapping',
            description: 'Maps STROBE checklist items to the corresponding methods paragraph section.',
            items: [
                { item: '4. Study design', section: 'Study Design and Setting', guidance: 'Present key elements of study design early (cohort, case-control, cross-sectional).' },
                { item: '5. Setting', section: 'Study Design and Setting', guidance: 'Describe setting, locations, and relevant dates of recruitment, exposure, follow-up.' },
                { item: '6a. Eligibility criteria', section: 'Participants', guidance: 'Give eligibility criteria with sources and methods of participant selection.' },
                { item: '6b. Matching (case-control)', section: 'Participants', guidance: 'For matched studies, give matching criteria and number of controls per case.' },
                { item: '7. Variables', section: 'Variables and Data Collection', guidance: 'Clearly define outcomes, exposures, predictors, confounders, effect modifiers with diagnostic criteria.' },
                { item: '8. Data sources/measurement', section: 'Variables and Data Collection', guidance: 'Describe measurement methods for each variable. Describe comparability of methods across groups.' },
                { item: '9. Bias', section: 'Statistical Analysis', guidance: 'Describe any efforts to address potential sources of bias.' },
                { item: '10. Study size', section: 'Statistical Analysis', guidance: 'Explain how the study size was arrived at.' },
                { item: '11. Quantitative variables', section: 'Statistical Analysis', guidance: 'Explain how quantitative variables were handled; describe groupings and rationale for cutpoints.' },
                { item: '12a. Statistical methods', section: 'Statistical Analysis', guidance: 'Describe all statistical methods including confounding control.' },
                { item: '12b. Subgroups and interactions', section: 'Statistical Analysis', guidance: 'Describe subgroup and interaction analysis methods.' },
                { item: '12c. Missing data', section: 'Statistical Analysis', guidance: 'Explain how missing data were addressed (complete case, imputation).' },
                { item: '12d. Follow-up (cohort)', section: 'Participants', guidance: 'For cohort studies, explain how loss to follow-up was addressed.' },
                { item: '12e. Sensitivity analyses', section: 'Statistical Analysis', guidance: 'Describe any sensitivity analyses.' }
            ]
        }
    };

    /* ================================================================
       RENDER
       ================================================================ */

    function render(container) {
        var html = App.createModuleLayout(
            'Methods Generator',
            'Auto-generate publication-ready statistical methods paragraphs for manuscripts. Customize parameters and copy directly into your paper.'
        );

        // ---- Learn & Reference ----
        html += '<div class="card" style="background: var(--bg-secondary); border-left: 4px solid var(--accent-color);">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\')">Learn &amp; Reference <span style="font-size:0.8em; color: var(--text-muted);">(click to expand)</span></div>';
        html += '<div class="learn-body hidden">';

        html += '<div style="margin-bottom:1rem;">';
        html += '<strong style="color:var(--accent);">Writing Principles</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>Methods should be reproducible by another researcher</li>';
        html += '<li>Use past tense</li>';
        html += '<li>Report software and version</li>';
        html += '<li>State statistical significance threshold</li>';
        html += '<li>Describe handling of missing data</li>';
        html += '</ul></div>';

        html += '<div style="margin-bottom:1rem;">';
        html += '<strong style="color:var(--accent);">Key Elements</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>Study design + setting + timeframe</li>';
        html += '<li>Population + eligibility criteria</li>';
        html += '<li>Intervention/exposure definition</li>';
        html += '<li>Outcome definition + measurement</li>';
        html += '<li>Sample size justification</li>';
        html += '<li>Statistical analysis plan</li>';
        html += '</ul></div>';

        html += '<div style="margin-bottom:1rem;">';
        html += '<strong style="color:var(--accent);">Style Guide</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>Follow journal-specific instructions</li>';
        html += '<li>Use active voice for clarity</li>';
        html += '<li>Define abbreviations at first use</li>';
        html += '<li>Report exact p-values (not just &lt; 0.05)</li>';
        html += '<li>Include effect sizes with CIs</li>';
        html += '</ul></div>';

        html += '<div style="margin-bottom:1rem;">';
        html += '<strong style="color:var(--accent);">Common Pitfalls</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>Vague analysis descriptions (&ldquo;standard statistical methods&rdquo;)</li>';
        html += '<li>Omitting software versions</li>';
        html += '<li>Not describing intention-to-treat vs per-protocol</li>';
        html += '<li>Insufficient detail on randomization/blinding</li>';
        html += '</ul></div>';

        html += '<div style="margin-bottom:0;">';
        html += '<strong style="color:var(--accent);">References</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>ICMJE Recommendations</li>';
        html += '<li>Lang TA &amp; Secic M &mdash; <em>How to Report Statistics in Medicine</em></li>';
        html += '<li>Moher D et al &mdash; CONSORT 2010</li>';
        html += '<li>Gamble C et al &mdash; Guidelines for the Content of Statistical Analysis Plans. <em>JAMA</em>. 2017;318(23):2337-2343.</li>';
        html += '</ul></div>';

        html += '</div></div>';

        // ---- Tabs ----
        html += '<div class="card">';
        html += '<div class="tabs" id="mg-tabs">';
        html += '<button class="tab active" data-tab="generator" onclick="MethodsGen.switchTab(\'generator\')">Methods Generator</button>';
        html += '<button class="tab" data-tab="templates" onclick="MethodsGen.switchTab(\'templates\')">Common Templates</button>';
        html += '<button class="tab" data-tab="design-templates" onclick="MethodsGen.switchTab(\'design-templates\')">Study Design Templates</button>';
        html += '<button class="tab" data-tab="sap" onclick="MethodsGen.switchTab(\'sap\')">SAP Outline</button>';
        html += '<button class="tab" data-tab="mapping" onclick="MethodsGen.switchTab(\'mapping\')">CONSORT/STROBE Mapping</button>';
        html += '<button class="tab" data-tab="checklists" onclick="MethodsGen.switchTab(\'checklists\')">Checklists</button>';
        html += '<button class="tab" data-tab="sap-builder" onclick="MethodsGen.switchTab(\'sap-builder\')">SAP Builder</button>';
        html += '</div>';

        // ==== TAB 1: Methods Generator (original) ====
        html += '<div class="tab-content active" id="tab-generator">';
        html += renderGeneratorTab();
        html += '</div>';

        // ==== TAB 2: Common Templates (original) ====
        html += '<div class="tab-content" id="tab-templates">';
        html += renderCommonTemplatesTab();
        html += '</div>';

        // ==== TAB 3: Study Design Templates (NEW) ====
        html += '<div class="tab-content" id="tab-design-templates">';
        html += renderDesignTemplatesTab();
        html += '</div>';

        // ==== TAB 4: SAP Outline (NEW) ====
        html += '<div class="tab-content" id="tab-sap">';
        html += renderSAPTab();
        html += '</div>';

        // ==== TAB 5: CONSORT/STROBE Mapping (NEW) ====
        html += '<div class="tab-content" id="tab-mapping">';
        html += renderMappingTab();
        html += '</div>';

        // ==== TAB 6: Checklists (original) ====
        html += '<div class="tab-content" id="tab-checklists">';
        html += renderChecklistsTab();
        html += '</div>';

        // ==== TAB 7: SAP Builder (NEW) ====
        html += '<div class="tab-content" id="tab-sap-builder">';
        html += renderSAPBuilderTab();
        html += '</div>';

        html += '</div>'; // close card

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    /* ================================================================
       TAB RENDERERS
       ================================================================ */

    function renderGeneratorTab() {
        var html = '';

        // Study Parameters
        html += '<div class="card-subtitle">Configure your study design and analysis approach. The generator will create a tailored methods paragraph.</div>';

        // Row 1: Design and sample size
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Study Design ' + App.tooltip('Select the overall study design. This shapes the structure of the generated text.') + '</label>';
        html += '<select class="form-select" id="mg_design" name="mg_design">';
        html += '<option value="parallel-rct">Parallel Group RCT</option>';
        html += '<option value="crossover-rct">Crossover RCT</option>';
        html += '<option value="cluster-rct">Cluster Randomized Trial</option>';
        html += '<option value="prospective-cohort">Prospective Cohort</option>';
        html += '<option value="retrospective-cohort">Retrospective Cohort</option>';
        html += '<option value="case-control">Case-Control Study</option>';
        html += '<option value="cross-sectional">Cross-Sectional Study</option>';
        html += '<option value="meta-analysis">Meta-Analysis</option>';
        html += '<option value="diagnostic">Diagnostic Accuracy Study</option>';
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Total Sample Size</label>';
        html += '<input type="number" class="form-input" id="mg_n" name="mg_n" value="200" min="1"></div>';

        html += '<div class="form-group"><label class="form-label">Number of Groups / Arms</label>';
        html += '<input type="number" class="form-input" id="mg_arms" name="mg_arms" value="2" min="1" max="10"></div>';
        html += '</div>';

        // Row 2: Alpha, power, outcome type
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Significance Level (alpha)</label>';
        html += '<select class="form-select" id="mg_alpha" name="mg_alpha">';
        html += '<option value="0.05">0.05 (two-sided)</option>';
        html += '<option value="0.01">0.01 (two-sided)</option>';
        html += '<option value="0.025">0.025 (one-sided)</option>';
        html += '<option value="0.10">0.10 (two-sided)</option>';
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Statistical Power</label>';
        html += '<select class="form-select" id="mg_power" name="mg_power">';
        html += '<option value="0.80">80%</option>';
        html += '<option value="0.85">85%</option>';
        html += '<option value="0.90" selected>90%</option>';
        html += '<option value="0.95">95%</option>';
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Primary Outcome Type ' + App.tooltip('Determines which analysis methods are available.') + '</label>';
        html += '<select class="form-select" id="mg_outcome" name="mg_outcome" onchange="MethodsGen.updateAnalysisMethods()">';
        html += '<option value="binary">Binary (proportion / event)</option>';
        html += '<option value="continuous">Continuous (mean / change score)</option>';
        html += '<option value="time-to-event">Time-to-Event (survival)</option>';
        html += '<option value="ordinal">Ordinal (ranked categories)</option>';
        html += '<option value="count">Count (rate data)</option>';
        html += '</select></div>';
        html += '</div>';

        // Row 3: Analysis method and software
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Primary Analysis Method</label>';
        html += '<select class="form-select" id="mg_analysis" name="mg_analysis">';
        var defaultMethods = ANALYSIS_METHODS['binary'];
        for (var m = 0; m < defaultMethods.length; m++) {
            html += '<option value="' + defaultMethods[m].value + '">' + defaultMethods[m].label + '</option>';
        }
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Statistical Software</label>';
        html += '<select class="form-select" id="mg_software" name="mg_software">';
        for (var sw = 0; sw < SOFTWARE_OPTIONS.length; sw++) {
            html += '<option value="' + SOFTWARE_OPTIONS[sw].value + '">' + SOFTWARE_OPTIONS[sw].label + '</option>';
        }
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Multiplicity Adjustment</label>';
        html += '<select class="form-select" id="mg_multiplicity" name="mg_multiplicity">';
        for (var mu = 0; mu < MULTIPLICITY_METHODS.length; mu++) {
            html += '<option value="' + MULTIPLICITY_METHODS[mu].value + '">' + MULTIPLICITY_METHODS[mu].label + '</option>';
        }
        html += '</select></div>';
        html += '</div>';

        // Row 4: Missing data and sensitivity analyses
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Missing Data Approach</label>';
        html += '<select class="form-select" id="mg_missing" name="mg_missing">';
        for (var mi = 0; mi < MISSING_METHODS.length; mi++) {
            html += '<option value="' + MISSING_METHODS[mi].value + '">' + MISSING_METHODS[mi].label + '</option>';
        }
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Planned Sensitivity Analyses ' + App.tooltip('Describe additional sensitivity analyses to be included in the methods text.') + '</label>';
        html += '<input type="text" class="form-input" id="mg_sensitivity" name="mg_sensitivity" placeholder="e.g., per-protocol analysis, E-value, tipping point"></div>';
        html += '</div>';

        // Additional free-text inputs
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Primary Outcome Description</label>';
        html += '<input type="text" class="form-input" id="mg_outcome_desc" name="mg_outcome_desc" placeholder="e.g., mRS 0-2 at 90 days"></div>';

        html += '<div class="form-group"><label class="form-label">Key Covariates / Confounders</label>';
        html += '<input type="text" class="form-input" id="mg_covariates" name="mg_covariates" placeholder="e.g., age, sex, baseline NIHSS, onset-to-treatment time"></div>';
        html += '</div>';

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-primary" onclick="MethodsGen.generate()">Generate Methods Text</button>';
        html += '</div>';

        // ---- Generated Output ----
        html += '<div class="card-title mt-2">Generated Methods Section</div>';
        html += '<div class="card-subtitle">Review and copy the auto-generated text. Edit the bracketed placeholders with your specific details.</div>';
        html += '<div id="mg-output" class="result-panel" style="min-height:60px">';
        html += '<div class="result-detail">Click "Generate Methods Text" above to create your methods paragraph.</div>';
        html += '</div>';
        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-secondary" onclick="MethodsGen.copyOutput()">Copy to Clipboard</button>';
        html += '</div>';

        return html;
    }

    function renderCommonTemplatesTab() {
        var html = '';
        html += '<div class="card-subtitle">Pre-written, publication-ready methods paragraphs for common study types. Select a template, review, and customize.</div>';

        html += '<div class="form-group">';
        html += '<label class="form-label">Select Template</label>';
        html += '<select class="form-select" id="mg_template_sel" name="mg_template_sel" onchange="MethodsGen.showCommonTemplate()">';
        html += '<option value="">-- Choose a template --</option>';
        var tmplKeys = Object.keys(COMMON_TEMPLATES);
        for (var tk = 0; tk < tmplKeys.length; tk++) {
            html += '<option value="' + tmplKeys[tk] + '">' + COMMON_TEMPLATES[tmplKeys[tk]].name + '</option>';
        }
        html += '</select></div>';

        html += '<div id="mg-template-display"></div>';
        return html;
    }

    function renderDesignTemplatesTab() {
        var html = '';
        html += '<div class="card-subtitle">Structured methods templates for all major study designs with fill-in-the-blank fields. Select a design, then edit the <span style="background:var(--accent-muted);padding:1px 4px;border-radius:3px">[bracketed]</span> placeholders.</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Study Design</label>';
        html += '<select class="form-select" id="mg_design_tmpl" name="mg_design_tmpl" onchange="MethodsGen.showDesignTemplate()">';
        html += '<option value="">-- Select study design --</option>';
        var dKeys = Object.keys(STUDY_DESIGN_TEMPLATES);
        for (var dk = 0; dk < dKeys.length; dk++) {
            html += '<option value="' + dKeys[dk] + '">' + STUDY_DESIGN_TEMPLATES[dKeys[dk]].name + '</option>';
        }
        html += '</select></div>';
        html += '<div class="form-group"><label class="form-label">Reporting Guideline</label>';
        html += '<div class="form-input" id="mg_guideline_display" style="background:var(--bg-offset);color:var(--text-secondary);line-height:2.2">Select a design to see its guideline</div>';
        html += '</div></div>';

        html += '<div id="mg-design-template-display"></div>';
        return html;
    }

    function renderSAPTab() {
        var html = '';
        html += '<div class="card-subtitle">Generate a Statistical Analysis Plan (SAP) outline following ICH E9 and Gamble et al. (JAMA 2017) recommendations. Fill in study details and export.</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Study Title</label>';
        html += '<input type="text" class="form-input" id="mg_sap_title" name="mg_sap_title" placeholder="Enter study title"></div>';
        html += '<div class="form-group"><label class="form-label">Trial Registration</label>';
        html += '<input type="text" class="form-input" id="mg_sap_reg" name="mg_sap_reg" placeholder="e.g., NCT00000000"></div>';
        html += '</div>';

        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">PI Name</label>';
        html += '<input type="text" class="form-input" id="mg_sap_pi" name="mg_sap_pi" placeholder="Principal Investigator"></div>';
        html += '<div class="form-group"><label class="form-label">Statistician</label>';
        html += '<input type="text" class="form-input" id="mg_sap_stat" name="mg_sap_stat" placeholder="Lead Statistician"></div>';
        html += '<div class="form-group"><label class="form-label">SAP Version</label>';
        html += '<input type="text" class="form-input" id="mg_sap_version" name="mg_sap_version" value="1.0"></div>';
        html += '</div>';

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-primary" onclick="MethodsGen.generateSAP()">Generate SAP Outline</button>';
        html += '<button class="btn btn-secondary" onclick="MethodsGen.copySAP()">Copy SAP</button>';
        html += '</div>';

        html += '<div id="mg-sap-output" class="mt-2"></div>';

        // SAP section checklist
        html += '<div class="card-title mt-2">SAP Section Checklist</div>';
        html += '<div class="card-subtitle">Reference list of all recommended SAP sections per Gamble et al. (JAMA 2017)</div>';
        for (var si = 0; si < SAP_SECTIONS.length; si++) {
            var sec = SAP_SECTIONS[si];
            html += '<div style="margin-bottom:0.8rem">';
            html += '<div style="font-weight:600;font-size:0.9rem;margin-bottom:0.3rem;color:var(--accent)">' + sec.title + '</div>';
            html += '<div style="font-size:0.82rem;line-height:1.7;margin-left:1rem">';
            for (var ii = 0; ii < sec.items.length; ii++) {
                html += '<div style="padding:2px 0;border-bottom:1px solid var(--border-color)">' + sec.items[ii] + '</div>';
            }
            html += '</div></div>';
        }

        return html;
    }

    function renderMappingTab() {
        var html = '';
        html += '<div class="card-subtitle">See how each reporting guideline item maps to specific methods sections. Use this to ensure your methods paragraph addresses all required items.</div>';

        html += '<div class="form-group"><label class="form-label">Select Guideline</label>';
        html += '<select class="form-select" id="mg_mapping_sel" name="mg_mapping_sel" onchange="MethodsGen.showMapping()">';
        html += '<option value="">-- Select --</option>';
        html += '<option value="consort">CONSORT 2010 (RCTs)</option>';
        html += '<option value="strobe">STROBE (Observational)</option>';
        html += '</select></div>';

        html += '<div id="mg-mapping-display"></div>';
        return html;
    }

    function renderChecklistsTab() {
        var html = '';
        html += '<div class="card-subtitle">Key reporting items from CONSORT, STROBE, and PRISMA guidelines. Click a section to expand.</div>';

        var checklistKeys = Object.keys(REPORTING_CHECKLISTS);
        for (var ck = 0; ck < checklistKeys.length; ck++) {
            var cl = REPORTING_CHECKLISTS[checklistKeys[ck]];
            html += '<div class="mb-1">';
            html += '<button class="btn btn-secondary" style="width:100%;text-align:left;font-weight:600" onclick="MethodsGen.toggleChecklist(\'' + checklistKeys[ck] + '\')">';
            html += cl.name + ' (' + cl.items.length + ' items)';
            html += '</button>';
            html += '<div id="mg-checklist-' + checklistKeys[ck] + '" class="hidden" style="padding:0.8em 0">';
            html += '<div style="font-size:0.85rem;line-height:1.8">';
            for (var ci = 0; ci < cl.items.length; ci++) {
                html += '<div style="padding:0.2em 0;border-bottom:1px solid var(--border-color)">';
                html += '<span style="color:var(--text-tertiary);margin-right:6px">' + (ci + 1) + '.</span>';
                html += cl.items[ci];
                html += '</div>';
            }
            html += '</div>';
            html += '<div class="btn-group mt-1">';
            html += '<button class="btn btn-xs btn-secondary" onclick="MethodsGen.copyChecklist(\'' + checklistKeys[ck] + '\')">Copy Checklist</button>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        }

        return html;
    }

    /* ================================================================
       TAB SWITCHING
       ================================================================ */

    function switchTab(tab) {
        document.querySelectorAll('#mg-tabs .tab').forEach(function(t) {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        document.querySelectorAll('#mg-tabs ~ .tab-content').forEach(function(tc) {
            tc.classList.toggle('active', tc.id === 'tab-' + tab);
        });
    }

    /* ================================================================
       ANALYSIS METHOD DROPDOWN UPDATE
       ================================================================ */

    function updateAnalysisMethods() {
        var outcomeType = document.getElementById('mg_outcome').value;
        var methodSelect = document.getElementById('mg_analysis');
        var methods = ANALYSIS_METHODS[outcomeType] || ANALYSIS_METHODS['binary'];

        var optionsHtml = '';
        for (var i = 0; i < methods.length; i++) {
            optionsHtml += '<option value="' + methods[i].value + '">' + methods[i].label + '</option>';
        }
        App.setTrustedHTML(methodSelect, optionsHtml);
    }

    /* ================================================================
       METHODS TEXT GENERATION (original)
       ================================================================ */

    function getLabel(options, value) {
        for (var i = 0; i < options.length; i++) {
            if (options[i].value === value) return options[i].label;
        }
        return value;
    }

    function generate() {
        var design = document.getElementById('mg_design').value;
        var n = document.getElementById('mg_n').value;
        var arms = document.getElementById('mg_arms').value;
        var alpha = document.getElementById('mg_alpha').value;
        var power = document.getElementById('mg_power').value;
        var outcomeType = document.getElementById('mg_outcome').value;
        var analysis = document.getElementById('mg_analysis').value;
        var software = document.getElementById('mg_software').value;
        var multiplicity = document.getElementById('mg_multiplicity').value;
        var missing = document.getElementById('mg_missing').value;
        var sensitivity = document.getElementById('mg_sensitivity').value.trim();
        var outcomeDesc = document.getElementById('mg_outcome_desc').value.trim() || '[primary outcome]';
        var covariates = document.getElementById('mg_covariates').value.trim() || '[pre-specified covariates]';

        var outcomeTypeMethods = ANALYSIS_METHODS[outcomeType] || ANALYSIS_METHODS['binary'];
        var analysisLabel = getLabel(outcomeTypeMethods, analysis);
        var multiplicityLabel = getLabel(MULTIPLICITY_METHODS, multiplicity);
        var softwareLabel = getLabel(SOFTWARE_OPTIONS, software);
        var powerPct = Math.round(parseFloat(power) * 100);
        var perArm = Math.ceil(parseInt(n, 10) / parseInt(arms, 10));

        var text = '';

        // --- Sample Size Justification ---
        text += 'Sample Size Justification\n\n';
        text += 'A total sample size of ' + n + ' participants (' + perArm + ' per group across ' + arms + ' group' + (parseInt(arms) > 1 ? 's' : '') + ') was determined to provide ' + powerPct + '% power to detect a clinically meaningful difference in ' + outcomeDesc;
        var sidedness = (alpha === '0.025') ? 'one-sided' : 'two-sided';
        text += ' at a ' + sidedness + ' significance level of ' + alpha + '.';

        if (outcomeType === 'binary') {
            text += ' The sample size calculation was based on a two-sample test of proportions, assuming [control event rate] and a minimum clinically important difference of [absolute risk difference].';
        } else if (outcomeType === 'continuous') {
            text += ' The calculation assumed a mean difference of [delta], a common standard deviation of [SD], and used the two-sample t-test formula.';
        } else if (outcomeType === 'time-to-event') {
            text += ' The calculation was based on the log-rank test, assuming an exponential distribution with a median [time] in the control group and a hazard ratio of [HR], with [duration] of accrual and [duration] of additional follow-up (Schoenfeld formula).';
        } else if (outcomeType === 'ordinal') {
            text += ' The sample size was estimated using the proportional odds model, assuming a common odds ratio of [cOR] across ordinal categories, with the expected distribution derived from [source].';
        } else if (outcomeType === 'count') {
            text += ' The sample size was based on a comparison of rates using [Poisson / negative binomial] assumptions, with an expected rate of [rate] in the reference group and a rate ratio of [RR].';
        }
        text += ' The sample size was inflated by [X]% to account for anticipated loss to follow-up.\n\n';

        // --- Statistical Analysis ---
        text += 'Statistical Analysis\n\n';

        // Design-specific opener
        if (design === 'parallel-rct') {
            text += 'The primary analysis was performed on the intention-to-treat (ITT) population, defined as all randomized participants analyzed according to their assigned treatment group regardless of protocol adherence. ';
        } else if (design === 'crossover-rct') {
            text += 'The primary analysis used a mixed-effects model with treatment, period, and sequence as fixed effects and participant nested within sequence as a random effect. A test for carryover was performed as a treatment-by-period interaction. ';
        } else if (design === 'cluster-rct') {
            text += 'The analysis accounted for the clustered design using [GEE with exchangeable correlation / mixed-effects models with a random intercept for cluster]. The intracluster correlation coefficient (ICC) is reported. ';
        } else if (design.indexOf('cohort') !== -1) {
            text += 'The analysis was conducted on all eligible participants meeting inclusion criteria who had complete baseline data. ';
        } else if (design === 'case-control') {
            text += 'Cases and controls were compared using conditional logistic regression to account for matching factors. ';
        } else if (design === 'cross-sectional') {
            text += 'Prevalence estimates with 95% confidence intervals were calculated. ';
        } else if (design === 'meta-analysis') {
            text += 'A random-effects meta-analysis was conducted using the DerSimonian-Laird estimator. Heterogeneity was quantified using the I-squared statistic and Cochran\'s Q test. ';
        } else if (design === 'diagnostic') {
            text += 'Diagnostic accuracy measures (sensitivity, specificity, positive and negative predictive values, likelihood ratios) were calculated with 95% Wilson confidence intervals. ';
        }

        // Analysis method sentence
        text += 'The primary outcome, ' + outcomeDesc + ', was analyzed using ' + analysisLabel + '. ';

        // Effect measure
        if (outcomeType === 'binary') {
            text += 'The treatment effect was reported as the odds ratio (or risk ratio if using a log-binomial / modified Poisson model) with 95% confidence interval and absolute risk difference. ';
        } else if (outcomeType === 'continuous') {
            text += 'The treatment effect was reported as the adjusted mean difference with 95% confidence interval. ';
        } else if (outcomeType === 'time-to-event') {
            text += 'The treatment effect was reported as the hazard ratio with 95% confidence interval. Kaplan-Meier survival curves were generated. ';
        } else if (outcomeType === 'ordinal') {
            text += 'The treatment effect was reported as the common odds ratio with 95% confidence interval under the proportional odds assumption. The proportional odds assumption was verified using the Brant test. ';
        } else if (outcomeType === 'count') {
            text += 'The treatment effect was reported as the incidence rate ratio with 95% confidence interval. Overdispersion was assessed, and a negative binomial model was used if the Poisson variance assumption was violated. ';
        }

        // Covariates
        if (covariates !== '[pre-specified covariates]') {
            text += 'Multivariable models were adjusted for the following pre-specified covariates: ' + covariates + '. ';
        } else {
            text += 'Multivariable models included pre-specified covariates: ' + covariates + '. ';
        }

        // Multiplicity
        if (multiplicity !== 'none') {
            text += 'To control for multiple comparisons, ' + multiplicityLabel + ' was applied. ';
        } else {
            text += 'No adjustment for multiplicity was applied to secondary endpoints, which should be interpreted as exploratory. ';
        }

        // Subgroup analyses
        text += 'Pre-specified subgroup analyses were conducted using interaction terms between the treatment variable and subgroup indicator in the regression model. Subgroup analyses are considered hypothesis-generating and are presented graphically.\n\n';

        // --- Handling of Missing Data ---
        text += 'Handling of Missing Data\n\n';
        if (missing === 'mi') {
            text += 'Missing data were handled using multiple imputation by chained equations (MICE) with ' + '[M=20]' + ' imputed datasets. The imputation model included the outcome, treatment assignment, and all covariates from the analysis model, along with auxiliary variables predictive of missingness. Rubin\'s rules were used to pool parameter estimates and standard errors across imputed datasets. ';
        } else if (missing === 'complete') {
            text += 'The primary analysis was conducted on complete cases (participants with no missing data for the primary outcome and key covariates). The proportion of missing data is reported, and the missing-at-random assumption was assessed by comparing baseline characteristics of completers and non-completers. ';
        } else if (missing === 'locf') {
            text += 'Missing outcome data were imputed using the last observation carried forward (LOCF) approach. This was complemented by a sensitivity analysis using multiple imputation. ';
        } else if (missing === 'mmrm') {
            text += 'The mixed model for repeated measures (MMRM) approach was used, which implicitly handles missing data under the missing-at-random (MAR) assumption by using all available data. An unstructured covariance matrix was specified. ';
        } else if (missing === 'ipw') {
            text += 'Inverse probability of censoring weights were used to account for informative missing data. Weights were estimated using a logistic regression model for the probability of completing the study, conditional on baseline covariates and treatment assignment. Stabilized weights were used, and extreme weights were truncated at the 1st and 99th percentiles. ';
        } else if (missing === 'pmm') {
            text += 'Pattern mixture models were used to assess the sensitivity of results to different missing data mechanisms, including missing-not-at-random (MNAR) scenarios. ';
        } else if (missing === 'worst-case') {
            text += 'A worst-case imputation sensitivity analysis was performed, assigning unfavorable outcomes to all participants with missing data in the treatment group and favorable outcomes to those in the control group. ';
        }
        text += '\n\n';

        // --- Sensitivity Analyses ---
        text += 'Sensitivity Analyses\n\n';
        text += 'The following sensitivity analyses were planned a priori: ';
        var sensItems = [];
        if (design.indexOf('rct') !== -1) {
            sensItems.push('(1) per-protocol analysis restricted to participants who completed the study without major protocol deviations');
        }
        if (missing !== 'complete') {
            sensItems.push('(' + (sensItems.length + 1) + ') complete case analysis as a comparison to the primary imputation approach');
        }
        if (design.indexOf('cohort') !== -1 || design === 'case-control') {
            sensItems.push('(' + (sensItems.length + 1) + ') E-value calculation to quantify robustness to unmeasured confounding');
            sensItems.push('(' + (sensItems.length + 1) + ') quantitative bias analysis for key potential biases');
        }
        if (sensitivity) {
            sensItems.push('(' + (sensItems.length + 1) + ') ' + sensitivity);
        }
        if (sensItems.length === 0) {
            sensItems.push('(1) analysis with alternate model specifications or distributional assumptions');
        }
        text += sensItems.join('; ') + '.\n\n';

        // --- Software ---
        text += 'Software\n\n';
        text += 'All statistical analyses were performed using ' + softwareLabel + '. ';
        if (software === 'r') {
            text += 'Key packages included [list packages, e.g., survival, lme4, mice, ggplot2]. ';
        } else if (software === 'stata') {
            text += 'Key commands included [list commands, e.g., stcox, melogit, mi impute]. ';
        } else if (software === 'sas') {
            text += 'Key procedures included [list procedures, e.g., PROC PHREG, PROC LOGISTIC, PROC MI]. ';
        }
        text += 'A ' + ((alpha === '0.025') ? 'one-sided' : 'two-sided') + ' P value <' + alpha + ' was considered statistically significant for the primary outcome. All confidence intervals are reported at the 95% level.\n';

        // Store and display
        window._mgGeneratedText = text;
        displayOutput(text);

        Export.showToast('Methods text generated successfully.', 'success');
    }

    function displayOutput(text) {
        var el = document.getElementById('mg-output');
        var html = '<div class="animate-in" style="white-space:pre-wrap;font-size:0.9rem;line-height:1.8;font-family:Georgia,serif">';
        // Bold section headers
        var formatted = text
            .replace(/^(Sample Size Justification)/m, '<strong style="font-size:1rem">$1</strong>')
            .replace(/^(Statistical Analysis)/m, '<strong style="font-size:1rem">$1</strong>')
            .replace(/^(Handling of Missing Data)/m, '<strong style="font-size:1rem">$1</strong>')
            .replace(/^(Sensitivity Analyses)/m, '<strong style="font-size:1rem">$1</strong>')
            .replace(/^(Software)/m, '<strong style="font-size:1rem">$1</strong>')
            .replace(/\[([^\]]+)\]/g, '<span style="background:var(--accent-muted);padding:0 4px;border-radius:3px;font-family:inherit">[$1]</span>');
        html += formatted;
        html += '</div>';
        App.setTrustedHTML(el, html);
    }

    function copyOutput() {
        if (!window._mgGeneratedText) {
            Export.showToast('No methods text generated yet.', 'error');
            return;
        }
        Export.copyText(window._mgGeneratedText);
    }

    /* ================================================================
       COMMON TEMPLATES (original)
       ================================================================ */

    function showCommonTemplate() {
        var sel = document.getElementById('mg_template_sel').value;
        var displayEl = document.getElementById('mg-template-display');
        if (!sel || !COMMON_TEMPLATES[sel]) {
            App.setTrustedHTML(displayEl, '');
            return;
        }

        var t = COMMON_TEMPLATES[sel];
        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-subtitle">' + t.name + '</div>';
        html += '<div style="white-space:pre-wrap;font-size:0.88rem;line-height:1.8;font-family:Georgia,serif;background:var(--bg-offset);padding:1em;border-radius:8px;margin-top:0.5em">';

        var formatted = t.text.replace(/\[([^\]]+)\]/g, '<span style="background:var(--accent-muted);padding:0 4px;border-radius:3px">[$1]</span>');
        html += formatted;
        html += '</div>';
        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-secondary" onclick="MethodsGen.copyCommonTemplate()">Copy Template</button>';
        html += '</div>';
        html += '</div>';

        App.setTrustedHTML(displayEl, html);
    }

    function copyCommonTemplate() {
        var sel = document.getElementById('mg_template_sel').value;
        if (!sel || !COMMON_TEMPLATES[sel]) return;
        Export.copyText(COMMON_TEMPLATES[sel].text);
    }

    /* ================================================================
       NEW: STUDY DESIGN TEMPLATES
       ================================================================ */

    function showDesignTemplate() {
        var sel = document.getElementById('mg_design_tmpl').value;
        var displayEl = document.getElementById('mg-design-template-display');
        var guidelineEl = document.getElementById('mg_guideline_display');

        if (!sel || !STUDY_DESIGN_TEMPLATES[sel]) {
            App.setTrustedHTML(displayEl, '');
            App.setTrustedHTML(guidelineEl, 'Select a design to see its guideline');
            return;
        }

        var tmpl = STUDY_DESIGN_TEMPLATES[sel];
        App.setTrustedHTML(guidelineEl, '<strong style="color:var(--accent)">' + tmpl.guideline + '</strong>');

        var html = '<div class="animate-in mt-2">';
        html += '<div style="margin-bottom:0.5rem;font-size:0.85rem;color:var(--text-secondary)">';
        html += 'Template for <strong>' + tmpl.name + '</strong> following ' + tmpl.guideline + '. Edit the <span style="background:var(--accent-muted);padding:1px 4px;border-radius:3px">[bracketed]</span> placeholders with your study-specific details.';
        html += '</div>';

        for (var si = 0; si < tmpl.sections.length; si++) {
            var sec = tmpl.sections[si];
            html += '<div style="margin-bottom:1rem;background:var(--bg-offset);border-radius:8px;padding:1em;border-left:3px solid var(--accent-color)">';
            html += '<div style="font-weight:700;font-size:0.95rem;margin-bottom:0.5rem;color:var(--accent)">' + sec.title + '</div>';
            html += '<div style="white-space:pre-wrap;font-size:0.88rem;line-height:1.8;font-family:Georgia,serif">';
            var formatted = sec.text.replace(/\[([^\]]+)\]/g, '<span style="background:var(--accent-muted);padding:0 4px;border-radius:3px">[$1]</span>');
            html += formatted;
            html += '</div></div>';
        }

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-primary" onclick="MethodsGen.copyDesignTemplate()">Copy Full Template</button>';
        html += '<button class="btn btn-secondary" onclick="MethodsGen.copyDesignTemplatePlain()">Copy Plain Text (no formatting)</button>';
        html += '</div>';
        html += '</div>';

        App.setTrustedHTML(displayEl, html);
    }

    function copyDesignTemplate() {
        var sel = document.getElementById('mg_design_tmpl').value;
        if (!sel || !STUDY_DESIGN_TEMPLATES[sel]) return;

        var tmpl = STUDY_DESIGN_TEMPLATES[sel];
        var text = tmpl.name + ' Methods Template (' + tmpl.guideline + ')\n\n';
        for (var si = 0; si < tmpl.sections.length; si++) {
            text += tmpl.sections[si].title + '\n\n';
            text += tmpl.sections[si].text + '\n\n';
        }
        Export.copyText(text);
    }

    function copyDesignTemplatePlain() {
        var sel = document.getElementById('mg_design_tmpl').value;
        if (!sel || !STUDY_DESIGN_TEMPLATES[sel]) return;

        var tmpl = STUDY_DESIGN_TEMPLATES[sel];
        var text = '';
        for (var si = 0; si < tmpl.sections.length; si++) {
            text += tmpl.sections[si].text + '\n\n';
        }
        Export.copyText(text);
    }

    /* ================================================================
       NEW: SAP OUTLINE GENERATOR
       ================================================================ */

    function generateSAP() {
        var title = document.getElementById('mg_sap_title').value.trim() || '[Study Title]';
        var reg = document.getElementById('mg_sap_reg').value.trim() || '[Registration Number]';
        var pi = document.getElementById('mg_sap_pi').value.trim() || '[PI Name]';
        var stat = document.getElementById('mg_sap_stat').value.trim() || '[Statistician Name]';
        var version = document.getElementById('mg_sap_version').value.trim() || '1.0';
        var today = new Date().toISOString().slice(0, 10);

        var text = '';
        text += 'STATISTICAL ANALYSIS PLAN\n';
        text += '=========================\n\n';
        text += 'Study Title: ' + title + '\n';
        text += 'Trial Registration: ' + reg + '\n';
        text += 'SAP Version: ' + version + '\n';
        text += 'SAP Date: ' + today + '\n';
        text += 'Principal Investigator: ' + pi + '\n';
        text += 'Lead Statistician: ' + stat + '\n\n';

        text += '---\n\n';

        for (var si = 0; si < SAP_SECTIONS.length; si++) {
            var sec = SAP_SECTIONS[si];
            text += sec.title + '\n\n';
            for (var ii = 0; ii < sec.items.length; ii++) {
                text += '  ' + (ii + 1) + '. ' + sec.items[ii] + '\n';
                text += '     [Enter details here]\n\n';
            }
            text += '---\n\n';
        }

        text += 'SIGNATURES\n\n';
        text += 'Principal Investigator: ________________________  Date: __________\n';
        text += 'Lead Statistician:     ________________________  Date: __________\n';
        text += 'Sponsor Representative: ________________________  Date: __________\n';

        window._mgSAPText = text;

        // Display
        var el = document.getElementById('mg-sap-output');
        var html = '<div class="result-panel animate-in">';
        html += '<div style="white-space:pre-wrap;font-size:0.85rem;line-height:1.7;font-family:\'Courier New\',monospace;background:var(--bg-offset);padding:1.2em;border-radius:8px;max-height:500px;overflow-y:auto">';
        html += text.replace(/\[([^\]]+)\]/g, '<span style="background:var(--accent-muted);padding:0 4px;border-radius:3px">[$1]</span>');
        html += '</div></div>';
        App.setTrustedHTML(el, html);

        Export.showToast('SAP outline generated.', 'success');
    }

    function copySAP() {
        if (!window._mgSAPText) {
            Export.showToast('Generate an SAP outline first.', 'error');
            return;
        }
        Export.copyText(window._mgSAPText);
    }

    /* ================================================================
       NEW: CONSORT/STROBE METHODS MAPPING
       ================================================================ */

    function showMapping() {
        var sel = document.getElementById('mg_mapping_sel').value;
        var displayEl = document.getElementById('mg-mapping-display');
        if (!sel || !METHODS_MAPPING[sel]) {
            App.setTrustedHTML(displayEl, '');
            return;
        }

        var mapping = METHODS_MAPPING[sel];
        var html = '<div class="animate-in mt-2">';
        html += '<div style="margin-bottom:0.8rem;font-size:0.9rem"><strong>' + mapping.name + '</strong></div>';
        html += '<div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:1rem">' + mapping.description + '</div>';

        html += '<table style="width:100%;border-collapse:collapse;font-size:0.83rem">';
        html += '<thead><tr style="border-bottom:2px solid var(--border-color);text-align:left">';
        html += '<th style="padding:8px;width:22%">Checklist Item</th>';
        html += '<th style="padding:8px;width:20%">Methods Section</th>';
        html += '<th style="padding:8px;width:58%">Guidance</th>';
        html += '</tr></thead><tbody>';

        for (var mi = 0; mi < mapping.items.length; mi++) {
            var item = mapping.items[mi];
            html += '<tr style="border-bottom:1px solid var(--border-color)">';
            html += '<td style="padding:8px;font-weight:600;color:var(--accent)">' + item.item + '</td>';
            html += '<td style="padding:8px;color:var(--text-secondary)">' + item.section + '</td>';
            html += '<td style="padding:8px;line-height:1.6">' + item.guidance + '</td>';
            html += '</tr>';
        }

        html += '</tbody></table>';

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-secondary" onclick="MethodsGen.copyMapping()">Copy Mapping Table</button>';
        html += '</div>';
        html += '</div>';

        App.setTrustedHTML(displayEl, html);
    }

    function copyMapping() {
        var sel = document.getElementById('mg_mapping_sel').value;
        if (!sel || !METHODS_MAPPING[sel]) return;

        var mapping = METHODS_MAPPING[sel];
        var text = mapping.name + '\n\n';
        for (var mi = 0; mi < mapping.items.length; mi++) {
            var item = mapping.items[mi];
            text += item.item + '\n';
            text += '  Section: ' + item.section + '\n';
            text += '  Guidance: ' + item.guidance + '\n\n';
        }
        Export.copyText(text);
    }

    /* ================================================================
       CHECKLISTS (original)
       ================================================================ */

    function toggleChecklist(key) {
        var el = document.getElementById('mg-checklist-' + key);
        if (!el) return;
        if (el.classList.contains('hidden')) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    }

    function copyChecklist(key) {
        var cl = REPORTING_CHECKLISTS[key];
        if (!cl) return;
        var text = cl.name + ' Checklist\n\n';
        for (var i = 0; i < cl.items.length; i++) {
            text += (i + 1) + '. ' + cl.items[i] + '\n';
        }
        Export.copyText(text);
    }

    /* ================================================================
       NEW: SAP BUILDER (interactive)
       ================================================================ */

    function renderSAPBuilderTab() {
        var html = '';
        html += '<div class="card-subtitle">Select study parameters to generate a tailored Statistical Analysis Plan template with recommended methods, sensitivity analyses, and missing data strategies.</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Primary Outcome Type</label>';
        html += '<select class="form-select" id="mg_sapb_outcome" name="mg_sapb_outcome">';
        html += '<option value="continuous">Continuous</option>';
        html += '<option value="binary">Binary</option>';
        html += '<option value="time-to-event">Time-to-Event</option>';
        html += '<option value="ordinal">Ordinal</option>';
        html += '<option value="count">Count</option>';
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Study Design</label>';
        html += '<select class="form-select" id="mg_sapb_design" name="mg_sapb_design">';
        html += '<option value="rct">Randomized Controlled Trial</option>';
        html += '<option value="cohort">Cohort Study</option>';
        html += '<option value="case-control">Case-Control Study</option>';
        html += '<option value="cross-sectional">Cross-Sectional Study</option>';
        html += '</select></div></div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Number of Groups</label>';
        html += '<select class="form-select" id="mg_sapb_groups" name="mg_sapb_groups">';
        html += '<option value="2">2 groups</option>';
        html += '<option value="3+">3 or more groups</option>';
        html += '</select></div>';

        html += '<div class="form-group"><label class="form-label">Covariates / Confounders?</label>';
        html += '<select class="form-select" id="mg_sapb_covariates" name="mg_sapb_covariates">';
        html += '<option value="yes">Yes</option>';
        html += '<option value="no">No</option>';
        html += '</select></div></div>';

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-primary" onclick="MethodsGen.generateSAPBuilder()">Generate SAP Template</button>';
        html += '<button class="btn btn-secondary" onclick="MethodsGen.copySAPBuilder()">Copy to Clipboard</button>';
        html += '</div>';

        html += '<div id="mg-sapb-output" class="mt-2"></div>';
        return html;
    }

    function getSAPBuilderPrimary(outcome, design, groups, hasCovariates) {
        var method = '';
        var effectMeasure = '';

        if (outcome === 'continuous') {
            if (design === 'rct' && groups === '2') {
                method = hasCovariates ? 'ANCOVA with baseline value as covariate' : 'Two-sample t-test (or Wilcoxon rank-sum if non-normal)';
                effectMeasure = 'Adjusted mean difference with 95% CI';
            } else if (design === 'rct' && groups === '3+') {
                method = hasCovariates ? 'ANCOVA with post-hoc pairwise comparisons (Tukey or Dunnett)' : 'One-way ANOVA with post-hoc tests';
                effectMeasure = 'Pairwise mean differences with 95% CIs';
            } else if (design === 'cohort') {
                method = hasCovariates ? 'Multivariable linear regression' : 'Two-sample t-test or Wilcoxon rank-sum';
                effectMeasure = 'Regression coefficient (beta) with 95% CI';
            } else {
                method = hasCovariates ? 'Linear regression' : 'Two-sample t-test';
                effectMeasure = 'Mean difference or beta coefficient with 95% CI';
            }
        } else if (outcome === 'binary') {
            if (design === 'rct' && groups === '2') {
                method = hasCovariates ? 'Logistic regression adjusted for stratification factors' : 'Chi-squared test (Fisher exact if expected cell count <5)';
                effectMeasure = 'Odds ratio, absolute risk difference, and NNT with 95% CIs';
            } else if (design === 'rct' && groups === '3+') {
                method = 'Multinomial or binary logistic regression with pairwise comparisons';
                effectMeasure = 'Odds ratios with 95% CIs for each pairwise comparison';
            } else if (design === 'cohort') {
                method = hasCovariates ? 'Multivariable logistic regression (or modified Poisson for prevalence >10%)' : 'Chi-squared test';
                effectMeasure = 'Adjusted OR (or RR) with 95% CI';
            } else if (design === 'case-control') {
                method = hasCovariates ? 'Conditional logistic regression (matched) or unconditional logistic regression' : 'Chi-squared or Fisher exact test';
                effectMeasure = 'Odds ratio with 95% CI';
            } else {
                method = hasCovariates ? 'Logistic regression or Poisson regression with robust variance' : 'Chi-squared test';
                effectMeasure = 'Prevalence ratio or OR with 95% CI';
            }
        } else if (outcome === 'time-to-event') {
            if (groups === '2' && !hasCovariates) {
                method = 'Kaplan-Meier with log-rank test';
            } else {
                method = 'Cox proportional hazards regression';
            }
            effectMeasure = 'Hazard ratio with 95% CI; median survival with 95% CI';
        } else if (outcome === 'ordinal') {
            if (groups === '2') {
                method = hasCovariates ? 'Ordinal (proportional odds) logistic regression' : 'Wilcoxon rank-sum (Mann-Whitney U) test';
                effectMeasure = 'Common OR with 95% CI under proportional odds assumption';
            } else {
                method = 'Ordinal logistic regression with pairwise comparisons';
                effectMeasure = 'Common OR with 95% CI per comparison';
            }
        } else if (outcome === 'count') {
            method = hasCovariates ? 'Negative binomial regression (or Poisson if no overdispersion)' : 'Poisson regression';
            effectMeasure = 'Incidence rate ratio with 95% CI';
        }
        return { method: method, effectMeasure: effectMeasure };
    }

    function generateSAPBuilder() {
        var outcome = document.getElementById('mg_sapb_outcome').value;
        var design = document.getElementById('mg_sapb_design').value;
        var groups = document.getElementById('mg_sapb_groups').value;
        var hasCovariates = document.getElementById('mg_sapb_covariates').value === 'yes';
        var isRCT = (design === 'rct');

        var primary = getSAPBuilderPrimary(outcome, design, groups, hasCovariates);

        var text = 'STATISTICAL ANALYSIS PLAN (SAP) TEMPLATE\n';
        text += '==========================================\n\n';

        // 1. Primary analysis
        text += '1. PRIMARY ANALYSIS\n\n';
        text += 'Recommended Method: ' + primary.method + '\n';
        text += 'Effect Measure: ' + primary.effectMeasure + '\n';
        if (isRCT) {
            text += 'Analysis Population: Intention-to-treat (ITT) -- all randomized participants analyzed per assigned group.\n';
        } else if (design === 'cohort') {
            text += 'Analysis Population: All eligible participants with complete exposure and outcome data.\n';
        } else {
            text += 'Analysis Population: All participants meeting inclusion criteria.\n';
        }
        if (hasCovariates) {
            text += 'Covariates: [List pre-specified covariates, e.g., age, sex, baseline severity, site]\n';
        }
        text += 'Significance Level: Two-sided alpha = 0.05\n\n';

        // 2. Sensitivity analyses
        text += '2. SENSITIVITY ANALYSES\n\n';
        var sensIdx = 1;
        if (isRCT) {
            text += '  ' + sensIdx++ + '. Per-protocol analysis: restricted to participants without major protocol deviations.\n';
            text += '  ' + sensIdx++ + '. As-treated analysis: participants analyzed according to treatment actually received.\n';
        }
        if (outcome === 'continuous') {
            text += '  ' + sensIdx++ + '. Non-parametric analysis (Wilcoxon rank-sum) if normality assumption is violated.\n';
            text += '  ' + sensIdx++ + '. Mixed-effects model for repeated measures (MMRM) for longitudinal data.\n';
        } else if (outcome === 'binary') {
            text += '  ' + sensIdx++ + '. Log-binomial or modified Poisson regression to estimate risk ratios instead of ORs.\n';
        } else if (outcome === 'time-to-event') {
            text += '  ' + sensIdx++ + '. Restricted mean survival time (RMST) analysis if proportional hazards assumption is violated.\n';
            text += '  ' + sensIdx++ + '. Fine-Gray competing risks regression for competing events.\n';
        } else if (outcome === 'ordinal') {
            text += '  ' + sensIdx++ + '. Binary collapse analysis (dichotomized outcome) as robustness check.\n';
            text += '  ' + sensIdx++ + '. Brant test to verify proportional odds assumption; partial proportional odds model if violated.\n';
        } else if (outcome === 'count') {
            text += '  ' + sensIdx++ + '. Zero-inflated model if excess zeros are detected.\n';
            text += '  ' + sensIdx++ + '. Dispersion test to confirm Poisson vs. negative binomial.\n';
        }
        if (design === 'cohort' || design === 'case-control') {
            text += '  ' + sensIdx++ + '. E-value calculation to assess robustness to unmeasured confounding.\n';
            if (hasCovariates) {
                text += '  ' + sensIdx++ + '. Propensity score analysis (matching or IPTW) as alternative confounding adjustment.\n';
            }
        }
        text += '\n';

        // 3. Missing data
        text += '3. MISSING DATA HANDLING\n\n';
        text += 'Primary Approach:\n';
        if (isRCT) {
            if (outcome === 'continuous') {
                text += '  Mixed model for repeated measures (MMRM) -- handles missing data under MAR assumption using all available data.\n';
            } else {
                text += '  Multiple imputation by chained equations (MICE) with M=20 imputed datasets. Imputation model includes outcome, treatment, all covariates, and auxiliary variables.\n';
            }
        } else {
            text += '  Complete case analysis as primary; multiple imputation (MICE) as sensitivity analysis.\n';
        }
        text += '\nSensitivity Analyses for Missing Data:\n';
        text += '  a. Tipping point analysis: systematically vary imputed values under MNAR to find the delta at which conclusions change.\n';
        if (isRCT) {
            text += '  b. Worst-case imputation: unfavorable outcomes assigned to missing participants in the treatment group.\n';
            text += '  c. Pattern mixture models to assess sensitivity under MNAR assumptions.\n';
        } else {
            text += '  b. Compare baseline characteristics of completers vs. non-completers to assess MAR plausibility.\n';
        }
        text += '  Reporting: Document percentage of missing data per variable and per group.\n\n';

        // 4. Multiplicity
        text += '4. MULTIPLICITY ADJUSTMENT\n\n';
        if (groups === '3+') {
            text += 'Primary outcome: Hierarchical (gatekeeping) testing procedure or Bonferroni-Holm step-down for pairwise comparisons.\n';
        } else {
            text += 'Single primary outcome: No multiplicity adjustment for the primary endpoint.\n';
        }
        text += 'Secondary outcomes: Reported as point estimates with 95% CIs; interpreted as exploratory (no formal adjustment).\n';
        text += 'Alternative: Benjamini-Hochberg FDR correction if multiple co-primary endpoints are specified.\n\n';

        // 5. Subgroup analyses
        text += '5. PRE-SPECIFIED SUBGROUP ANALYSES\n\n';
        text += 'Subgroup variables (specify a priori):\n';
        text += '  1. Age (<65 vs. >=65 years)\n';
        text += '  2. Sex (male vs. female)\n';
        text += '  3. Baseline severity ([mild vs. moderate/severe])\n';
        text += '  4. [Additional subgroup variable]\n\n';
        text += 'Method: Interaction terms between treatment/exposure and subgroup variable in the primary model.\n';
        text += 'Presentation: Forest plot showing effect estimates and 95% CIs for each subgroup, with P-interaction reported.\n';
        text += 'Interpretation: Subgroup analyses are hypothesis-generating; not powered for formal testing.\n\n';

        // 6. Interim analysis (RCT only)
        if (isRCT) {
            text += '6. INTERIM ANALYSIS PLAN\n\n';
            text += 'Number of interim looks: [1-2] planned\n';
            text += 'Timing: After [50% / 33% and 67%] of primary endpoint data are available.\n';
            text += 'Alpha spending: O\'Brien-Fleming spending function to preserve overall type I error at 0.05.\n';
            text += 'Efficacy boundary: [Specify nominal alpha at each look, e.g., 0.005 at 50%, 0.048 at final]\n';
            text += 'Futility boundary: Conditional power <10% under the original alternative hypothesis.\n';
            text += 'DSMB: Independent Data Safety Monitoring Board will review unblinded interim data.\n';
            text += 'DSMB charter should specify composition, meeting schedule, and stopping rules.\n\n';
        }

        window._mgSAPBuilderText = text;

        // Display
        var el = document.getElementById('mg-sapb-output');
        var displayHtml = '<div class="result-panel animate-in">';
        displayHtml += '<div style="white-space:pre-wrap;font-size:0.85rem;line-height:1.7;font-family:var(--font-mono);background:var(--bg-offset);padding:1.2em;border-radius:8px;max-height:600px;overflow-y:auto">';
        displayHtml += text.replace(/\[([^\]]+)\]/g, '<span style="background:var(--accent-muted);padding:0 4px;border-radius:3px">[$1]</span>');
        displayHtml += '</div></div>';
        App.setTrustedHTML(el, displayHtml);
        Export.showToast('SAP template generated based on your selections.', 'success');
    }

    function copySAPBuilder() {
        if (!window._mgSAPBuilderText) {
            Export.showToast('Generate a SAP template first.', 'error');
            return;
        }
        Export.copyText(window._mgSAPBuilderText);
    }

    /* ================================================================
       REGISTER
       ================================================================ */

    App.registerModule(MODULE_ID, { render: render });

    window.MethodsGen = {
        switchTab: switchTab,
        updateAnalysisMethods: updateAnalysisMethods,
        generate: generate,
        copyOutput: copyOutput,
        showCommonTemplate: showCommonTemplate,
        copyCommonTemplate: copyCommonTemplate,
        showDesignTemplate: showDesignTemplate,
        copyDesignTemplate: copyDesignTemplate,
        copyDesignTemplatePlain: copyDesignTemplatePlain,
        generateSAP: generateSAP,
        copySAP: copySAP,
        showMapping: showMapping,
        copyMapping: copyMapping,
        toggleChecklist: toggleChecklist,
        copyChecklist: copyChecklist,
        generateSAPBuilder: generateSAPBuilder,
        copySAPBuilder: copySAPBuilder
    };
})();
