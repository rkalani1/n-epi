/**
 * Neuro-Epi — Study Design Guide
 * Interactive decision tree and comprehensive reference for selecting
 * the right epidemiological study design. Includes design templates,
 * bias reference, Oxford CEBM evidence levels, interactive decision tree,
 * bias assessment tool, design comparison, evidence hierarchy, and
 * common design modifications.
 */
(function() {
    'use strict';
    const MODULE_ID = 'study-design-guide';

    /* ================================================================
       DATA: Study designs, biases, templates
       ================================================================ */

    var DESIGNS = [
        {
            name: 'Meta-Analysis',
            level: '1a',
            strengths: 'Highest statistical power; quantitative synthesis of multiple studies; can resolve conflicting results; identifies overall effect with precision',
            limitations: 'Garbage-in-garbage-out; heterogeneity can limit conclusions; publication bias; requires comparable studies; ecological fallacy at study level',
            when: 'Multiple studies exist on the same question and need quantitative synthesis',
            example: 'Meta-analysis of thrombectomy RCTs (HERMES collaboration) pooling individual patient data from 5 trials',
            reporting: 'PRISMA 2020',
            measure: 'Pooled effect size (OR, RR, MD, SMD)',
            minStudies: '2+ (ideally 5+)'
        },
        {
            name: 'Systematic Review',
            level: '1a',
            strengths: 'Comprehensive; reproducible methodology; reduces bias in study selection; transparent search and appraisal',
            limitations: 'Time-intensive; limited by quality of included studies; publication bias; may not be feasible for all questions',
            when: 'Need to comprehensively summarize evidence on a clinical question',
            example: 'Cochrane review of anticoagulation for secondary stroke prevention in atrial fibrillation',
            reporting: 'PRISMA 2020',
            measure: 'Narrative or quantitative synthesis',
            minStudies: 'Comprehensive search required'
        },
        {
            name: 'Randomized Controlled Trial (RCT)',
            level: '1b',
            strengths: 'Strongest causal inference; controls for known and unknown confounders; randomization eliminates selection bias; blinding reduces information bias',
            limitations: 'Expensive; time-consuming; ethical constraints; may lack external validity; volunteer bias; intention-to-treat may dilute effect',
            when: 'Testing efficacy of a treatment/intervention; ethical equipoise exists; adequate sample size is feasible',
            example: 'MR CLEAN: RCT of intra-arterial treatment for acute ischemic stroke due to proximal intracranial occlusion',
            reporting: 'CONSORT 2010',
            measure: 'RR, RD, HR, NNT',
            minStudies: 'N/A (single study)'
        },
        {
            name: 'Cohort (Prospective)',
            level: '2b',
            strengths: 'Establishes temporal sequence; can calculate incidence and RR; good for rare exposures; multiple outcomes from one exposure',
            limitations: 'Expensive and time-consuming; attrition bias; not efficient for rare outcomes; confounding possible',
            when: 'Studying the effect of an exposure on multiple outcomes over time; RCT not feasible or ethical',
            example: 'Framingham Heart Study: prospective follow-up of stroke risk factors over decades',
            reporting: 'STROBE',
            measure: 'RR, HR, IRR',
            minStudies: 'N/A'
        },
        {
            name: 'Cohort (Retrospective)',
            level: '2b',
            strengths: 'Faster and cheaper than prospective; can calculate RR; good for rare exposures; uses existing data',
            limitations: 'Dependent on data quality; cannot control data collection; recall and information bias; confounding',
            when: 'Studying exposure-outcome relationships using existing records; time constraints prevent prospective design',
            example: 'Retrospective cohort study of statin use and hemorrhagic transformation after tPA using facility records',
            reporting: 'STROBE / RECORD',
            measure: 'RR, HR, IRR',
            minStudies: 'N/A'
        },
        {
            name: 'Case-Control',
            level: '3b',
            strengths: 'Efficient for rare diseases; relatively quick and inexpensive; can study multiple exposures; calculates OR',
            limitations: 'Cannot calculate incidence or RR directly; recall bias; selection bias in control choice; temporal ambiguity',
            when: 'Studying rare outcomes; hypothesis generation; limited time/budget; multiple exposures of interest',
            example: 'Case-control study of oral contraceptive use and young-onset ischemic stroke',
            reporting: 'STROBE',
            measure: 'OR',
            minStudies: 'N/A'
        },
        {
            name: 'Cross-Sectional',
            level: '4',
            strengths: 'Quick; inexpensive; generates prevalence data; good for planning; can study multiple outcomes and exposures simultaneously',
            limitations: 'Cannot establish temporal sequence or causation; prevalence not incidence; survivor bias; susceptible to confounding',
            when: 'Estimating disease prevalence; needs assessment; hypothesis generation; resource-limited settings',
            example: 'NHANES survey estimating prevalence of undiagnosed atrial fibrillation in the US population',
            reporting: 'STROBE',
            measure: 'Prevalence, PR, POR',
            minStudies: 'N/A'
        },
        {
            name: 'Ecological',
            level: '5',
            strengths: 'Uses readily available data; inexpensive; can study population-level exposures (e.g., policy, pollution); generates hypotheses',
            limitations: 'Ecological fallacy; cannot make individual-level inferences; confounding at group level; data quality varies',
            when: 'Studying population-level exposures; comparing geographic regions; hypothesis generation',
            example: 'Ecological study of regional stroke mortality rates and air pollution levels across US counties',
            reporting: 'STROBE',
            measure: 'Correlation coefficient, regression coefficient',
            minStudies: 'N/A'
        },
        {
            name: 'Case Series',
            level: '4',
            strengths: 'Simple to conduct; useful for rare diseases; generates hypotheses; describes clinical spectrum; no control group needed',
            limitations: 'No comparison group; no causal inference; selection bias; reporting bias; cannot calculate rates',
            when: 'Describing unusual presentations; early characterization of a new condition; rare disease descriptions',
            example: 'Case series of 12 patients with COVID-19-associated large vessel occlusion stroke',
            reporting: 'CARE (modified)',
            measure: 'Descriptive statistics',
            minStudies: 'N/A'
        },
        {
            name: 'Case Report',
            level: '5',
            strengths: 'First signal of new diseases/adverse effects; educational value; rapid publication; clinically detailed',
            limitations: 'No generalizability; no statistical analysis; publication bias; anecdotal evidence only',
            when: 'Reporting novel or unusual clinical findings; rare adverse events; unique therapeutic approaches',
            example: 'Case report of reversible cerebral vasoconstriction syndrome mimicking aneurysmal SAH',
            reporting: 'CARE',
            measure: 'Narrative',
            minStudies: 'N/A'
        }
    ];

    var BIASES = [
        {
            phase: 'Selection',
            name: 'Selection Bias (general)',
            definition: 'Systematic error arising from the way participants are selected or retained in a study, leading to a sample that is not representative of the target population.',
            direction: 'Can bias in either direction depending on mechanism.',
            strategies: 'Random sampling; clearly defined eligibility criteria; high participation rates; compare responders vs. non-responders.'
        },
        {
            phase: 'Selection',
            name: "Berkson's Bias",
            definition: 'Selection bias specific to facility-based case-control studies. Inpatient patients have different exposure profiles than the general population because facility admission itself is related to both exposure and disease.',
            direction: 'Often creates a spurious inverse association.',
            strategies: 'Use population-based controls; avoid facility-based case-control designs when possible; use multiple control groups.'
        },
        {
            phase: 'Selection',
            name: 'Healthy Worker Effect',
            definition: 'Workers tend to be healthier than the general population, leading to underestimation of occupational risk when comparing to general population rates.',
            direction: 'Biases toward the null (underestimates risk).',
            strategies: 'Use employed comparison groups; internal comparisons within the workforce; standardize by employment status.'
        },
        {
            phase: 'Selection',
            name: 'Volunteer/Self-Selection Bias',
            definition: 'People who volunteer for studies differ systematically from those who do not (healthier, more educated, more compliant).',
            direction: 'Variable; often biases toward healthier outcomes.',
            strategies: 'Maximize recruitment from target population; use population-based registries; assess representativeness.'
        },
        {
            phase: 'Selection',
            name: 'Immortal Time Bias',
            definition: 'A period of follow-up during which the outcome cannot occur by definition is misclassified, artificially inflating survival in the exposed group.',
            direction: 'Biases toward a protective effect of exposure.',
            strategies: 'Time-dependent exposure modeling; landmark analysis; exclude immortal time from analysis; use proper cohort entry definitions.'
        },
        {
            phase: 'Selection',
            name: 'Prevalent User Bias',
            definition: 'Including patients who have already been on treatment (prevalent users) mixes early and late effects. Early adverse events and early dropouts are missed.',
            direction: 'Usually biases toward a beneficial effect of treatment.',
            strategies: 'New-user (incident user) design; restrict to treatment-naive patients; active comparator new-user design.'
        },
        {
            phase: 'Selection',
            name: 'Incidence-Prevalence Bias (Neyman Bias)',
            definition: 'In cross-sectional or case-control studies, only surviving (prevalent) cases are identified. Those who died rapidly or recovered quickly are missed.',
            direction: 'Biases toward milder or chronic disease forms.',
            strategies: 'Use incident cases; population-based registries; prospective designs.'
        },
        {
            phase: 'Information',
            name: 'Recall Bias',
            definition: 'Cases may recall exposures differently (usually more completely) than controls, particularly in case-control studies.',
            direction: 'Usually overestimates association.',
            strategies: 'Use objective exposure measures; blinded assessment; validated questionnaires; prospective data collection; use records rather than self-report.'
        },
        {
            phase: 'Information',
            name: 'Measurement/Misclassification Bias',
            definition: 'Errors in measuring exposure or outcome. Differential misclassification depends on the other variable; non-differential does not.',
            direction: 'Non-differential usually biases toward null; differential can bias in either direction.',
            strategies: 'Standardized, validated instruments; blinded assessors; calibration; training protocols; duplicate measurements.'
        },
        {
            phase: 'Information',
            name: 'Detection/Surveillance Bias',
            definition: 'More intensive monitoring of exposed individuals leads to greater detection of outcomes compared to unexposed.',
            direction: 'Overestimates association.',
            strategies: 'Equal follow-up protocols for all groups; blinded outcome assessment; standardized surveillance intensity.'
        },
        {
            phase: 'Information',
            name: 'Lead-Time Bias',
            definition: 'Earlier detection through screening appears to increase survival time, even if the true time of death is unchanged.',
            direction: 'Overestimates survival benefit of screening.',
            strategies: 'Use mortality as endpoint rather than survival from diagnosis; use disease-specific mortality; randomize screening assignment.'
        },
        {
            phase: 'Information',
            name: 'Length-Time Bias',
            definition: 'Screening preferentially detects slow-growing, less aggressive disease, making screened cases appear to have better prognosis.',
            direction: 'Overestimates screening benefit.',
            strategies: 'Use RCT design for screening studies; analyze by intention-to-screen; compare mortality rates rather than case fatality.'
        },
        {
            phase: 'Information',
            name: 'Protopathic Bias',
            definition: 'The exposure (e.g., medication) is initiated in response to early symptoms of the yet-undiagnosed outcome, creating a spurious association.',
            direction: 'Can mimic a harmful effect of the exposure.',
            strategies: 'Lag time analysis (require minimum exposure duration before outcome window); restrict to diagnoses made after a washout period.'
        },
        {
            phase: 'Confounding',
            name: 'Confounding',
            definition: 'A third variable is associated with both the exposure and the outcome, distorting the observed association. Must be a common cause (or proxy) of both.',
            direction: 'Can bias in either direction.',
            strategies: 'Randomization; restriction; matching; stratification; multivariable regression; propensity scores; instrumental variables; DAG-guided analysis.'
        },
        {
            phase: 'Confounding',
            name: 'Confounding by Indication',
            definition: 'In observational studies, the indication for treatment is itself a risk factor for the outcome, confounding the treatment-outcome relationship.',
            direction: 'Usually biases against treatment (sicker patients receive treatment).',
            strategies: 'Propensity score methods; instrumental variables; active comparator designs; restriction to narrow indication.'
        },
        {
            phase: 'Confounding',
            name: 'Collider Bias',
            definition: 'Conditioning on a common effect (collider) of exposure and outcome (or their causes) creates a spurious association.',
            direction: 'Variable; can create associations where none exist.',
            strategies: 'DAG-based analysis planning; avoid conditioning on post-treatment variables; sensitivity analyses.'
        },
        {
            phase: 'Confounding',
            name: 'Time-Varying Confounding',
            definition: 'A confounder that changes over time and is also affected by prior treatment. Standard regression adjustment can introduce bias.',
            direction: 'Variable; standard adjustment may increase bias.',
            strategies: 'Marginal structural models with inverse probability weighting; g-estimation; g-computation; structural nested models.'
        },
        {
            phase: 'Attrition',
            name: 'Attrition/Loss-to-Follow-Up Bias',
            definition: 'Systematic differences between those who complete the study and those who drop out, particularly if dropout is related to both exposure and outcome.',
            direction: 'Variable direction depending on mechanism.',
            strategies: 'Minimize dropout; ITT analysis; sensitivity analyses (worst-case, best-case); multiple imputation; inverse probability weighting.'
        },
        {
            phase: 'Attrition',
            name: 'Differential Attrition',
            definition: 'Dropout rates differ between study groups, and reasons for dropout are related to the outcome.',
            direction: 'Usually biases toward or away from null depending on direction of dropout.',
            strategies: 'Monitor dropout by group; per-protocol and ITT analyses; CACE estimation; pattern mixture models.'
        }
    ];

    var DECISION_QUESTIONS = [
        { id: 'q_goal', text: 'What is the primary goal of your study?', options: [
            { value: 'prevalence', label: 'Estimate disease/condition prevalence' },
            { value: 'etiology', label: 'Identify risk factors or causes' },
            { value: 'treatment', label: 'Evaluate a treatment or intervention' },
            { value: 'prognosis', label: 'Determine prognosis or natural history' },
            { value: 'diagnosis', label: 'Evaluate a diagnostic test' },
            { value: 'synthesize', label: 'Synthesize existing evidence' }
        ]},
        { id: 'q_timing', text: 'What is the temporal relationship between exposure/intervention and outcome measurement?', options: [
            { value: 'simultaneous', label: 'Exposure and outcome measured at the same time' },
            { value: 'forward', label: 'Start with exposure, follow forward to outcome' },
            { value: 'backward', label: 'Start with outcome (cases), look back for exposure' },
            { value: 'na', label: 'Not applicable (synthesis or diagnostic study)' }
        ]},
        { id: 'q_randomize', text: 'Is randomization of the exposure/intervention feasible and ethical?', options: [
            { value: 'yes', label: 'Yes - randomization is feasible and ethical' },
            { value: 'no_ethical', label: 'No - would be unethical (e.g., smoking, harmful exposure)' },
            { value: 'no_feasible', label: 'No - logistically infeasible' },
            { value: 'na', label: 'Not applicable' }
        ]},
        { id: 'q_outcome_freq', text: 'How common is the outcome of interest?', options: [
            { value: 'common', label: 'Common (>10% in population)' },
            { value: 'uncommon', label: 'Uncommon (1-10%)' },
            { value: 'rare', label: 'Rare (<1%)' },
            { value: 'na', label: 'Not applicable' }
        ]},
        { id: 'q_data', text: 'What data sources are available?', options: [
            { value: 'new', label: 'Will collect new primary data prospectively' },
            { value: 'existing', label: 'Existing records, databases, or registries' },
            { value: 'published', label: 'Published literature / existing studies' },
            { value: 'both', label: 'Both new and existing data' }
        ]}
    ];

    var TEMPLATES = {
        'parallel-rct': {
            name: 'Parallel Group RCT',
            pico: 'P: [Target population with condition]\nI: [Intervention, dose, duration]\nC: [Control/placebo, dose, duration]\nO: [Primary outcome, measurement timepoint]',
            endpoint: 'Binary: proportion achieving favorable outcome at [timepoint]\nOR Continuous: mean change in [scale] at [timepoint]',
            sampleSize: 'Two-sample test of proportions (or means). Use alpha=0.05, power=0.80-0.90. Inflate by 10-20% for dropout. Consider adaptive designs for uncertain effect sizes.',
            analysis: '1. Primary: Intention-to-treat (ITT) analysis\n2. Test: Chi-squared or Fisher exact (binary); t-test or ANCOVA (continuous)\n3. Effect measure: Absolute risk difference + 95% CI; NNT\n4. Sensitivity: Per-protocol analysis; multiple imputation for missing data\n5. Subgroup: Pre-specified, limited in number, interaction tests',
            timeline: 'Protocol development: 3-6 months\nIRB/regulatory: 3-6 months\nRecruitment: 12-36 months\nFollow-up: per protocol\nAnalysis & publication: 6-12 months\nTotal: 2-5 years typical',
            reporting: 'CONSORT 2010'
        },
        'crossover-rct': {
            name: 'Crossover RCT',
            pico: 'P: [Stable chronic condition; patients serve as own controls]\nI: [Intervention, dose, duration per period]\nC: [Control/placebo, dose, duration per period]\nO: [Outcome measured at end of each period]',
            endpoint: 'Within-subject difference in [outcome] between treatment periods',
            sampleSize: 'Paired analysis reduces required N substantially. Key: adequate washout period. Use paired t-test or mixed model. Account for period and carryover effects.',
            analysis: '1. Primary: Mixed-effects model with treatment, period, sequence, subject(sequence)\n2. Test for carryover effect (treatment x period interaction)\n3. If carryover significant, analyze period 1 only\n4. Effect measure: Mean difference with 95% CI\n5. Account for within-subject correlation',
            timeline: 'Shorter recruitment but longer per-patient duration.\nWashout period: typically 5 half-lives of intervention\nTotal: 1-3 years typical',
            reporting: 'CONSORT extension for crossover trials'
        },
        'cluster-rct': {
            name: 'Cluster Randomized Trial',
            pico: 'P: [Clusters: facilities/clinics/communities]\nI: [Cluster-level or individual-level intervention]\nC: [Usual care or alternative at cluster level]\nO: [Individual-level outcome measured within clusters]',
            endpoint: 'Proportion or mean at individual level, accounting for clustering',
            sampleSize: 'Inflate individual-level N by design effect = 1 + (m-1)*ICC, where m = cluster size, ICC = intracluster correlation. Typical ICC for clinical outcomes: 0.01-0.05. Need adequate number of clusters (minimum 6-8 per arm).',
            analysis: '1. Primary: GEE or mixed-effects model accounting for clustering\n2. Report ICC and design effect\n3. Adjust for cluster-level and individual-level covariates\n4. Consider informative cluster size\n5. Sensitivity: varying correlation structure',
            timeline: 'Protocol: 3-6 months\nCluster recruitment: 6-12 months\nIndividual enrollment: 12-24 months\nTotal: 2-4 years typical',
            reporting: 'CONSORT extension for cluster trials'
        },
        'prospective-cohort': {
            name: 'Prospective Cohort Study',
            pico: 'P: [Defined cohort free of outcome at baseline]\nE: [Exposure of interest, measurement method]\nC: [Unexposed or different exposure level]\nO: [Incident outcome(s), ascertainment method, follow-up duration]',
            endpoint: 'Incidence rate or cumulative incidence of [outcome] by exposure status',
            sampleSize: 'Based on expected incidence in unexposed, minimum detectable RR, alpha, power. For rare outcomes, consider person-time approach. Account for loss to follow-up (typically 5-15% per year).',
            analysis: '1. Primary: Cox proportional hazards (time-to-event) or Poisson/log-binomial regression\n2. Effect: Hazard ratio or incidence rate ratio with 95% CI\n3. Confounding: DAG-guided covariate selection; multivariable models; propensity scores\n4. Missing data: Multiple imputation\n5. Sensitivity: E-value for unmeasured confounding; negative control outcomes',
            timeline: 'Setup: 6-12 months\nRecruitment: 12-36 months\nFollow-up: 2-20+ years\nTotal: highly variable, often 5+ years',
            reporting: 'STROBE'
        },
        'retrospective-cohort': {
            name: 'Retrospective Cohort Study',
            pico: 'P: [Historical cohort identified from records/registries]\nE: [Exposure, ascertained from existing data]\nC: [Unexposed comparator]\nO: [Outcome(s) ascertained from records]',
            endpoint: 'Same as prospective cohort but using historical data',
            sampleSize: 'Often determined by available data. Power calculation based on available N, expected effect size, and event rate. May need to demonstrate adequate power post-hoc.',
            analysis: '1. Primary: Cox PH or logistic regression\n2. Address time-related biases: immortal time, time-varying exposures\n3. Active comparator preferred over non-user comparator\n4. New-user design to avoid prevalent-user bias\n5. Sensitivity: High-dimensional propensity scores; quantitative bias analysis',
            timeline: 'Data access/agreements: 1-6 months\nData cleaning/preparation: 1-3 months\nAnalysis: 2-6 months\nTotal: 6-18 months typical',
            reporting: 'STROBE / RECORD'
        },
        'nested-cc': {
            name: 'Nested Case-Control Study',
            pico: 'P: [Cases and controls sampled from within a defined cohort]\nE: [Exposure measured from stored specimens or detailed records]\nC: [Controls matched on time/risk-set sampling from same cohort]\nO: [Incident outcome that defines case status]',
            endpoint: 'Odds ratio approximating incidence rate ratio (with incidence density sampling)',
            sampleSize: 'Cases: all incident cases in cohort. Controls: 2-4 per case typically. Power depends on case count, control ratio, and expected OR.',
            analysis: '1. Primary: Conditional logistic regression (matched analysis)\n2. Incidence density sampling yields OR = IRR\n3. Control for matching factors and confounders\n4. Efficient for expensive biomarker measurements\n5. Sensitivity: vary control-to-case ratio; unmeasured confounding assessment',
            timeline: 'Depends on parent cohort timeline.\nNested analysis: 3-12 months\nBiomarker assays: 1-6 months\nTotal from initiation: 6-18 months',
            reporting: 'STROBE'
        },
        'pop-cc': {
            name: 'Population-Based Case-Control Study',
            pico: 'P: [Cases from population-based registry; controls from same source population]\nE: [Exposure(s) measured by interview, records, or biomarkers]\nC: [Population controls (random digit dialing, registry-based)]\nO: [Case status (the disease/condition)]',
            endpoint: 'Odds ratio for association between exposure and disease',
            sampleSize: 'Based on expected prevalence of exposure in controls, minimum detectable OR, case-to-control ratio (1:1 to 1:4), alpha, power.',
            analysis: '1. Primary: Unconditional or conditional logistic regression\n2. Multiple control groups to assess selection bias\n3. Matched analysis if frequency or individual matching used\n4. Stratified analysis for effect modification\n5. Sensitivity: vary case/control definitions; assess recall bias impact',
            timeline: 'Protocol/IRB: 3-6 months\nCase ascertainment: 12-36 months\nControl recruitment: concurrent\nAnalysis: 3-6 months\nTotal: 2-4 years typical',
            reporting: 'STROBE'
        },
        'cross-sectional': {
            name: 'Cross-Sectional Survey',
            pico: 'P: [Defined target population at a specific time]\nE: [Exposure/characteristic of interest]\nC: [Unexposed/different characteristic level]\nO: [Prevalence of outcome at the survey time]',
            endpoint: 'Prevalence of [condition/outcome]; prevalence ratio or prevalence OR',
            sampleSize: 'Based on expected prevalence, desired precision (CI width), population size (if finite), design effect (if cluster sampling).',
            analysis: '1. Descriptive: Prevalence with 95% CI (Wilson or Clopper-Pearson)\n2. Analytic: Log-binomial for prevalence ratios; logistic regression for prevalence OR\n3. Account for survey design: weighting, stratification, clustering\n4. Cannot establish causation - association only\n5. Assess non-response bias',
            timeline: 'Protocol/IRB: 2-4 months\nSurvey development/piloting: 2-4 months\nData collection: 1-6 months\nAnalysis: 2-4 months\nTotal: 6-18 months typical',
            reporting: 'STROBE'
        }
    };

    /* ================================================================
       DESIGN MODIFICATIONS DATA
       ================================================================ */
    var DESIGN_MODIFICATIONS = [
        {
            name: 'Factorial Design',
            description: 'Tests two or more interventions simultaneously in a single trial. Participants are randomized to all combinations of treatments. A 2x2 factorial tests Treatment A, Treatment B, both, and neither.',
            advantages: 'Efficient (tests two questions for the price of one); can detect interactions; maximizes use of sample size.',
            disadvantages: 'Assumes no interaction between treatments (or must be powered for interaction); more complex randomization and analysis; participant burden with multiple treatments.',
            when: 'Two interventions can be combined; no expected interaction; limited resources for separate trials.',
            example: 'CHANCE trial: factorial testing of clopidogrel + aspirin vs aspirin alone AND simvastatin vs placebo in TIA/minor stroke patients.',
            analysis: 'Main effects analyzed at the margins (ignoring the other factor). Interaction tested separately. If no interaction, efficient; if interaction present, must interpret cautiously.'
        },
        {
            name: 'Adaptive Design',
            description: 'Pre-planned modifications to the trial based on interim data (e.g., sample size re-estimation, response-adaptive randomization, dropping futile arms, enrichment). All adaptations must be specified in the protocol before unblinding.',
            advantages: 'More efficient use of resources; can stop early for efficacy or futility; adjusts to emerging data; ethical advantages; flexible sample size.',
            disadvantages: 'Statistically complex; requires simulation to validate operating characteristics; regulatory scrutiny; potential for bias if adaptations not pre-planned.',
            when: 'Uncertain about effect size; multiple treatment arms; need to minimize exposure to inferior treatments; rare disease settings.',
            example: 'DAWN trial: Bayesian adaptive design with interim analyses and pre-specified stopping rules for late-window thrombectomy.',
            analysis: 'Bayesian or frequentist with alpha-spending functions. Require simulation to verify Type I error control. Document all pre-specified adaptations in the protocol.'
        },
        {
            name: 'Crossover Design',
            description: 'Each participant receives both treatments in sequence, serving as their own control. Includes a washout period between treatments. Can be AB/BA or more complex (Latin square).',
            advantages: 'Eliminates between-subject variability; requires fewer subjects; each patient serves as own control.',
            disadvantages: 'Only suitable for chronic, stable conditions; carryover effects; period effects; longer per-patient duration; cannot use for outcomes that change the condition.',
            when: 'Chronic stable condition (e.g., epilepsy, chronic pain); reversible treatments; no expected carryover; outcome not affected by disease progression.',
            example: 'Crossover trial of two antiepileptic drugs measuring seizure frequency over two 12-week periods with 4-week washout.',
            analysis: 'Mixed model with treatment, period, sequence, and subject(sequence). Test for carryover first. If significant carryover, may need to analyze only period 1 data.'
        },
        {
            name: 'Platform Trial',
            description: 'A perpetual, multi-arm trial infrastructure that allows new treatments to enter and leave the trial over time. A shared control arm reduces the number of control patients needed. Uses a master protocol.',
            advantages: 'Efficient control arm sharing; rapid evaluation of multiple treatments; infrastructure reuse; statistical efficiency through Bayesian updating.',
            disadvantages: 'Complex governance; potential calendar time effects; requires robust infrastructure; regulatory complexity; may not suit all diseases.',
            when: 'Pandemic response (e.g., RECOVERY trial for COVID-19); oncology basket trials; when multiple treatments need evaluation simultaneously.',
            example: 'RECOVERY trial: adaptive platform trial evaluating multiple COVID-19 treatments with shared control; identified dexamethasone benefit rapidly.',
            analysis: 'Bayesian or frequentist with multiplicity adjustment. Non-concurrent control handling is a key consideration. Consider MAMS (multi-arm multi-stage) frameworks.'
        },
        {
            name: 'Stepped-Wedge Design',
            description: 'All clusters start in the control phase and sequentially cross over to the intervention at randomly determined time points until all clusters are receiving the intervention.',
            advantages: 'All clusters receive intervention eventually (ethical/practical advantage); acts as own control; suitable when simultaneous rollout is impossible.',
            disadvantages: 'Complex analysis; strong temporal trends can confound; long duration; requires all clusters to participate throughout; carry-forward effects.',
            when: 'Policy or system-level interventions where all sites will eventually implement; staggered rollout is practical necessity; cluster RCT infrastructure exists.',
            example: 'Stepped-wedge trial of a stroke telemedicine system across rural facilities, with each facility transitioning to telemedicine at pre-specified intervals.',
            analysis: 'GEE or mixed model accounting for clustering and time. Must model secular trends. Consider incomplete stepped-wedge designs for efficiency.'
        },
        {
            name: 'N-of-1 Trial',
            description: 'A randomized crossover trial in a single patient. The patient alternates between active treatment and placebo (or two active treatments) over multiple cycles, with the patient and provider blinded.',
            advantages: 'Directly tests treatment effect in the individual; highest relevance to clinical decision-making; each patient is their own control.',
            disadvantages: 'Only works for chronic stable conditions with rapid-onset, reversible treatment effects; generalizability limited to one patient; time-consuming.',
            when: 'Uncertain whether a treatment benefits an individual patient; chronic conditions with symptomatic treatments; personalized medicine contexts.',
            example: 'N-of-1 trial of amitriptyline vs placebo for chronic neuropathic pain in a single patient with 3 treatment cycles.',
            analysis: 'Paired t-test or Bayesian analysis across cycles. At least 3 treatment pairs recommended. Visual analysis with run charts. Can aggregate across multiple N-of-1 trials.'
        },
        {
            name: 'Pragmatic Trial',
            description: 'A trial designed to test effectiveness in real-world clinical practice, with broad eligibility criteria, usual care comparators, and clinically meaningful outcomes. Maximizes external validity.',
            advantages: 'Highly generalizable; reflects real-world practice; can use existing clinical infrastructure; lower per-patient cost; informs policy decisions.',
            disadvantages: 'Less controlled; harder to detect small effects; contamination between groups; protocol adherence may be lower; may have more missing data.',
            when: 'Treatment efficacy is established but real-world effectiveness is unknown; policy-relevant questions; comparing existing treatments.',
            example: 'POINT trial: pragmatic approach to dual antiplatelet therapy after minor stroke/TIA in the real-world clinical setting.',
            analysis: 'ITT analysis is primary. Consider PRECIS-2 tool to characterize where the trial sits on the pragmatic-explanatory spectrum.'
        },
        {
            name: 'Non-Inferiority Trial',
            description: 'Tests whether a new treatment is not clinically worse than the standard by more than a pre-specified margin (delta). The new treatment may offer other advantages (safety, cost, convenience).',
            advantages: 'Preserves effective treatments; allows simpler or safer alternatives; uses active comparator (no placebo ethical concerns).',
            disadvantages: 'Non-inferiority margin selection is subjective; requires larger sample sizes; biocreep concern over time; per-protocol analysis is co-primary; assay sensitivity assumption.',
            when: 'New treatment has potential advantages beyond efficacy (e.g., fewer side effects, oral vs IV); ethical concerns about placebo; effective treatments already exist.',
            example: 'NAVIGATE ESUS: non-inferiority trial comparing rivaroxaban to aspirin for secondary stroke prevention in embolic stroke of undetermined source.',
            analysis: 'Both ITT and per-protocol analyses required. Pre-specified non-inferiority margin. One-sided test or 95% CI approach. Switching to superiority testing is allowed if NI is established.'
        }
    ];

    /* ================================================================
       RENDER
       ================================================================ */

    function render(container) {
        var html = App.createModuleLayout(
            'Study Design Guide',
            'Interactive decision support for selecting the optimal epidemiological study design. Includes evidence hierarchy, design templates, bias reference, design modifications, and comparison tools.'
        );

        // ===== LEARN SECTION =====
        html += '<div class="card" style="background: var(--bg-secondary); border-left: 4px solid var(--accent-color);">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\')">&#x25B6; Learn &amp; Reference <span style="font-size:0.8em; color: var(--text-muted);">(click to expand)</span></div>';
        html += '<div class="learn-body hidden">';

        html += '<div class="card-subtitle" style="font-weight:600;">Key Concepts</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Hierarchy of evidence:</strong> RCT &gt; cohort &gt; case-control &gt; case series &gt; expert opinion</li>'
            + '<li><strong>Internal validity:</strong> Degree to which results are free from systematic error (bias) within the study</li>'
            + '<li><strong>External validity:</strong> Generalizability of results to populations beyond the study sample</li>'
            + '<li><strong>Selection bias:</strong> Systematic error from how participants are selected or retained</li>'
            + '<li><strong>Information bias:</strong> Systematic error from how data are measured or classified</li>'
            + '<li><strong>Confounding:</strong> Distortion by a third variable associated with both exposure and outcome</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Design Selection Principles</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Rare disease</strong> &rarr; Case-control study (efficient sampling of cases)</li>'
            + '<li><strong>Rare exposure</strong> &rarr; Cohort study (follow exposed group forward)</li>'
            + '<li><strong>Causal inference</strong> &rarr; RCT (randomization controls known and unknown confounders)</li>'
            + '<li><strong>Prognostic question</strong> &rarr; Prospective cohort (inception cohort followed over time)</li>'
            + '<li><strong>Prevalence estimation</strong> &rarr; Cross-sectional survey</li>'
            + '<li><strong>Evidence synthesis</strong> &rarr; Systematic review / meta-analysis</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Design Modifications</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Factorial:</strong> Tests 2+ interventions simultaneously; efficient when no interaction expected</li>'
            + '<li><strong>Adaptive:</strong> Pre-planned modifications based on interim data (sample re-estimation, arm dropping)</li>'
            + '<li><strong>Crossover:</strong> Each patient receives both treatments (own control); requires stable chronic condition</li>'
            + '<li><strong>Platform:</strong> Master protocol with shared control; treatments enter/leave over time (e.g., RECOVERY)</li>'
            + '<li><strong>Stepped-wedge:</strong> All clusters crossover to intervention sequentially; good for policy rollouts</li>'
            + '<li><strong>N-of-1:</strong> Randomized crossover in a single patient; personalized treatment evaluation</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Common Pitfalls</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Confusing association with causation:</strong> Observational studies show association; causation requires additional evidence</li>'
            + '<li><strong>Ecological fallacy:</strong> Inferring individual-level associations from group-level data</li>'
            + '<li><strong>Lead-time bias:</strong> Earlier detection appears to increase survival even if death occurs at the same time</li>'
            + '<li><strong>Length-time bias:</strong> Screening preferentially detects slow-growing, less aggressive disease</li>'
            + '<li><strong>Immortal time bias:</strong> A period during which the outcome cannot occur is misclassified</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px; font-size:0.85rem; line-height:1.7;">'
            + '<li>Rothman KJ, Greenland S, Lash TL. <em>Modern Epidemiology</em>, 4th ed. Lippincott Williams &amp; Wilkins, 2021.</li>'
            + '<li>STROBE Statement (von Elm et al., 2007). CONSORT 2010 Statement (Schulz et al., 2010).</li>'
            + '<li>Bothwell LE, et al. Adaptive design clinical trials: a review. <em>JAMA Intern Med</em>. 2018.</li>'
            + '</ul>';

        html += '</div></div>';

        // ---- Card 1: Decision Tree ----
        html += '<div class="card">';
        html += '<div class="card-title">Study Design Decision Tree</div>';
        html += '<div class="card-subtitle">Answer the questions below and receive a tailored study design recommendation with reasoning.</div>';

        for (var i = 0; i < DECISION_QUESTIONS.length; i++) {
            var q = DECISION_QUESTIONS[i];
            html += '<div class="form-group">';
            html += '<label class="form-label">' + (i + 1) + '. ' + q.text + '</label>';
            html += '<select class="form-select" id="sdg_' + q.id + '" name="sdg_' + q.id + '">';
            html += '<option value="">-- Select --</option>';
            for (var j = 0; j < q.options.length; j++) {
                html += '<option value="' + q.options[j].value + '">' + q.options[j].label + '</option>';
            }
            html += '</select></div>';
        }

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-primary" onclick="StudyDesignGuide.recommend()">Get Recommendation</button>';
        html += '<button class="btn btn-secondary" onclick="StudyDesignGuide.resetDecision()">Reset</button>';
        html += '</div>';
        html += '<div id="sdg-recommendation"></div>';
        html += '</div>';

        // ---- Card 2: Study Design Reference Table ----
        html += '<div class="card">';
        html += '<div class="card-title">Study Design Comparison Table</div>';
        html += '<div class="card-subtitle">Comprehensive comparison of study designs with Oxford CEBM evidence levels, strengths, weaknesses, and when to use.</div>';

        html += '<div class="table-container"><table class="data-table">';
        html += '<thead><tr><th>Design</th><th>CEBM Level</th><th>Reporting</th><th>Measure</th><th>Strengths</th><th>Limitations</th><th>When to Use</th><th>Example</th></tr></thead>';
        html += '<tbody>';
        for (var d = 0; d < DESIGNS.length; d++) {
            var ds = DESIGNS[d];
            html += '<tr><td><strong>' + ds.name + '</strong></td>'
                + '<td style="text-align:center;font-weight:600;color:var(--accent)">' + ds.level + '</td>'
                + '<td style="font-size:0.82rem;white-space:nowrap">' + (ds.reporting || '-') + '</td>'
                + '<td style="font-size:0.82rem">' + (ds.measure || '-') + '</td>'
                + '<td style="font-size:0.82rem">' + ds.strengths + '</td>'
                + '<td style="font-size:0.82rem">' + ds.limitations + '</td>'
                + '<td style="font-size:0.82rem">' + ds.when + '</td>'
                + '<td style="font-size:0.82rem;font-style:italic">' + ds.example + '</td></tr>';
        }
        html += '</tbody></table></div>';

        // Evidence pyramid
        html += '<div class="result-panel mt-2">';
        html += '<div class="card-subtitle">Oxford CEBM Levels of Evidence (2011)</div>';
        html += '<div style="font-size:0.85rem;line-height:1.7">';
        var levels = [
            { label: '1a', desc: 'Systematic reviews of RCTs (with homogeneity)' },
            { label: '1b', desc: 'Individual RCT (with narrow CI)' },
            { label: '1c', desc: 'All-or-none studies' },
            { label: '2a', desc: 'Systematic reviews of cohort studies' },
            { label: '2b', desc: 'Individual cohort study or low-quality RCT' },
            { label: '2c', desc: 'Outcomes research; ecological studies' },
            { label: '3a', desc: 'Systematic review of case-control studies' },
            { label: '3b', desc: 'Individual case-control study' },
            { label: '4', desc: 'Case series, cross-sectional studies' },
            { label: '5', desc: 'Expert opinion, bench research, case reports' }
        ];
        levels.forEach(function(l) { html += '<strong>Level ' + l.label + ':</strong> ' + l.desc + '<br>'; });
        html += '</div></div>';

        // Evidence hierarchy visual
        html += '<div class="card-title mt-2">Evidence Hierarchy (Visual)</div>';
        html += '<div style="margin:8px 0">';
        var pyramid = ['Systematic Reviews / Meta-Analyses', 'Randomized Controlled Trials', 'Cohort Studies', 'Case-Control Studies', 'Cross-Sectional Studies', 'Case Series / Case Reports', 'Expert Opinion / Editorials'];
        pyramid.forEach(function(level, idx) {
            var opacity = 1 - idx * 0.1;
            var width = 95 - idx * 10;
            var bgColor = idx < 2 ? 'var(--success)' : idx < 4 ? 'var(--accent)' : idx < 6 ? 'var(--warning)' : 'var(--text-tertiary)';
            html += '<div style="margin:3px auto;padding:8px 16px;background:' + bgColor + ';opacity:' + opacity + ';border-radius:6px;text-align:center;width:' + width + '%;color:var(--bg);font-size:0.82rem;font-weight:600">'
                + level + '</div>';
        });
        html += '</div>';
        html += '</div>';

        // ---- Card 3: Design Templates ----
        html += '<div class="card">';
        html += '<div class="card-title">Study Design Templates</div>';
        html += '<div class="card-subtitle">Pre-built templates with PICO/PECO structure, endpoints, sample size approach, analysis plan, and typical timeline.</div>';

        html += '<div class="form-group"><label class="form-label">Select Study Design Template</label>';
        html += '<select class="form-select" id="sdg_template_select" name="sdg_template_select" onchange="StudyDesignGuide.showTemplate()">';
        html += '<option value="">-- Choose a template --</option>';
        var tKeys = Object.keys(TEMPLATES);
        for (var t = 0; t < tKeys.length; t++) {
            html += '<option value="' + tKeys[t] + '">' + TEMPLATES[tKeys[t]].name + '</option>';
        }
        html += '</select></div>';
        html += '<div id="sdg-template-display"></div>';
        html += '</div>';

        // ---- Card 4: Design Modifications ----
        html += '<div class="card">';
        html += '<div class="card-title">Common Design Modifications</div>';
        html += '<div class="card-subtitle">Advanced trial designs that modify the standard parallel-group RCT. Select a design to learn about its advantages, limitations, and when to use it.</div>';

        html += '<div class="form-group"><label class="form-label">Select Design Modification</label>';
        html += '<select class="form-select" id="sdg_mod_select" onchange="StudyDesignGuide.showModification()">';
        html += '<option value="">-- Choose a modification --</option>';
        DESIGN_MODIFICATIONS.forEach(function(m, idx) {
            html += '<option value="' + idx + '">' + m.name + '</option>';
        });
        html += '</select></div>';
        html += '<div id="sdg-mod-display"></div>';

        // Comparison table always visible
        html += '<div class="card-title mt-3">Design Modifications Comparison</div>';
        html += '<div class="table-container"><table class="data-table"><thead><tr><th>Design</th><th>Key Advantage</th><th>Key Limitation</th><th>Best For</th></tr></thead><tbody>';
        DESIGN_MODIFICATIONS.forEach(function(m) {
            html += '<tr><td><strong>' + m.name + '</strong></td>'
                + '<td style="font-size:0.82rem">' + m.advantages.split(';')[0] + '</td>'
                + '<td style="font-size:0.82rem">' + m.disadvantages.split(';')[0] + '</td>'
                + '<td style="font-size:0.82rem">' + m.when.split(';')[0] + '</td></tr>';
        });
        html += '</tbody></table></div>';
        html += '</div>';

        // ---- Card 5: Bias Assessment Tool ----
        html += '<div class="card">';
        html += '<div class="card-title">Bias Assessment Tool</div>';
        html += '<div class="card-subtitle">Select your study design to see the most relevant biases, their likely direction, and specific mitigation strategies.</div>';

        html += '<div class="form-group"><label class="form-label">Select Study Design for Bias Assessment</label>';
        html += '<select class="form-select" id="sdg_bias_design" onchange="StudyDesignGuide.assessBias()">';
        html += '<option value="">-- Select design --</option>';
        html += '<option value="rct">Randomized Controlled Trial</option>';
        html += '<option value="cohort_pro">Prospective Cohort</option>';
        html += '<option value="cohort_retro">Retrospective Cohort</option>';
        html += '<option value="case_control">Case-Control</option>';
        html += '<option value="cross_sectional">Cross-Sectional</option>';
        html += '</select></div>';
        html += '<div id="sdg-bias-assessment"></div>';
        html += '</div>';

        // ---- Card 6: Reporting Guidelines Reference ----
        html += '<div class="card">';
        html += '<div class="card-title">Reporting Guidelines Reference</div>';
        html += '<div class="card-subtitle">Use the appropriate reporting guideline to ensure transparent, complete reporting of your study. EQUATOR Network is the central repository.</div>';

        var reportingGuidelines = [
            {
                guideline: 'CONSORT 2010',
                fullName: 'Consolidated Standards of Reporting Trials',
                designType: 'Randomized Controlled Trials',
                keyItems: '25-item checklist: title, trial design, participants, interventions, outcomes, sample size, randomization, blinding, statistical methods, results, harms, discussion, registration',
                extensions: 'Cluster trials, crossover trials, non-inferiority trials, pragmatic trials, pilot/feasibility trials, adaptive designs, N-of-1 trials'
            },
            {
                guideline: 'STROBE',
                fullName: 'Strengthening the Reporting of Observational Studies',
                designType: 'Cohort, Case-Control, Cross-Sectional',
                keyItems: '22-item checklist: setting, participants, variables, data sources, bias, study size, quantitative variables, statistical methods, descriptive data, outcome data, main results',
                extensions: 'STROBE-ME (molecular epidemiology), RECORD (routinely collected data), STROBE-NI (neonatal infections)'
            },
            {
                guideline: 'PRISMA 2020',
                fullName: 'Preferred Reporting Items for Systematic Reviews and Meta-Analyses',
                designType: 'Systematic Reviews, Meta-Analyses',
                keyItems: '27-item checklist: eligibility criteria, information sources, search strategy, selection process, data extraction, risk of bias assessment, synthesis methods, results of search, study characteristics, results of syntheses, certainty assessment',
                extensions: 'PRISMA-NMA (network meta-analysis), PRISMA-IPD (individual patient data), PRISMA-S (search), PRISMA-ScR (scoping reviews)'
            },
            {
                guideline: 'STARD 2015',
                fullName: 'Standards for Reporting of Diagnostic Accuracy Studies',
                designType: 'Diagnostic Accuracy Studies',
                keyItems: '30-item checklist: index test, reference standard, participants, test methods, analyses, results flow diagram, cross-tabulation, estimates of diagnostic accuracy',
                extensions: 'STARD for abstracts'
            },
            {
                guideline: 'TRIPOD',
                fullName: 'Transparent Reporting of a Multivariable Prediction Model',
                designType: 'Prediction / Prognostic Models',
                keyItems: '22-item checklist: source of data, participants, outcome, predictors, sample size, missing data, statistical analysis, model development, model specification, model performance, model updating',
                extensions: 'TRIPOD-SRMA (systematic reviews of prediction models), TRIPOD-AI (artificial intelligence)'
            },
            {
                guideline: 'CARE',
                fullName: 'Case Report Guidelines',
                designType: 'Case Reports / Case Series',
                keyItems: '13-item checklist: title, key words, abstract, introduction, patient information, clinical findings, timeline, diagnostic assessment, therapeutic intervention, follow-up, discussion, patient perspective, informed consent',
                extensions: 'None'
            },
            {
                guideline: 'SPIRIT 2013',
                fullName: 'Standard Protocol Items: Recommendations for Interventional Trials',
                designType: 'Trial Protocols',
                keyItems: '33-item checklist for protocol content: administrative information, introduction, methods, ethics, dissemination',
                extensions: 'SPIRIT-AI (artificial intelligence trials), SPIRIT-PRO (patient-reported outcomes)'
            },
            {
                guideline: 'CHEERS 2022',
                fullName: 'Consolidated Health Economic Evaluation Reporting Standards',
                designType: 'Health Economic Evaluations',
                keyItems: '28-item checklist: title, abstract, background, target population, setting, comparators, perspective, time horizon, discount rate, health outcomes, resources/costs, currency, model, analytics, characterizing heterogeneity, uncertainty',
                extensions: 'None'
            }
        ];

        html += '<div class="table-container"><table class="data-table">';
        html += '<thead><tr><th>Guideline</th><th>Full Name</th><th>Study Type</th><th>Key Items</th><th>Extensions</th></tr></thead><tbody>';
        reportingGuidelines.forEach(function(rg) {
            html += '<tr>'
                + '<td><strong>' + rg.guideline + '</strong></td>'
                + '<td style="font-size:0.82rem">' + rg.fullName + '</td>'
                + '<td style="font-size:0.82rem">' + rg.designType + '</td>'
                + '<td style="font-size:0.82rem">' + rg.keyItems + '</td>'
                + '<td style="font-size:0.82rem">' + rg.extensions + '</td></tr>';
        });
        html += '</tbody></table></div>';

        html += '<div class="result-panel mt-2">';
        html += '<div style="font-size:0.85rem;line-height:1.7">';
        html += '<strong>EQUATOR Network:</strong> www.equator-network.org — The central resource for all reporting guidelines. ';
        html += 'Always check for the most current version and relevant extensions for your study design.<br>';
        html += '<strong>Tip:</strong> Select the reporting guideline before you start writing. ';
        html += 'Use the checklist during manuscript preparation and include a completed checklist with your submission.';
        html += '</div></div>';
        html += '</div>';

        // ---- Card 7: PRECIS-2 Pragmatic-Explanatory Spectrum ----
        html += '<div class="card">';
        html += '<div class="card-title">PRECIS-2: Pragmatic-Explanatory Spectrum</div>';
        html += '<div class="card-subtitle">The PRECIS-2 tool helps characterize where a trial sits on the continuum between pragmatic and explanatory. Rate each domain from 1 (most explanatory) to 5 (most pragmatic).</div>';

        var precis2Domains = [
            {
                domain: 'Eligibility criteria',
                explanatory: 'Highly selected, many exclusions, homogeneous population',
                pragmatic: 'Few exclusions, broad population reflecting real practice',
                question: 'How similar are the trial participants to those who would receive the intervention in usual care?'
            },
            {
                domain: 'Recruitment',
                explanatory: 'Extra recruitment efforts, advertising, run-in periods',
                pragmatic: 'Patients identified through usual encounters, no extra efforts',
                question: 'How much extra effort is made to recruit participants beyond what would happen in usual care?'
            },
            {
                domain: 'Setting',
                explanatory: 'Academic centers, specialized facilities only',
                pragmatic: 'Usual care settings including community practices',
                question: 'How different are the settings from usual care settings?'
            },
            {
                domain: 'Organization',
                explanatory: 'Highly organized, special staff, extra resources',
                pragmatic: 'Delivered as part of usual care with existing staff',
                question: 'How different are the resources, staff expertise, and organization from usual care?'
            },
            {
                domain: 'Flexibility (delivery)',
                explanatory: 'Strictly protocolized, no variation allowed',
                pragmatic: 'Practitioners free to deliver intervention as they see fit',
                question: 'How different is the flexibility in how the intervention is delivered?'
            },
            {
                domain: 'Flexibility (adherence)',
                explanatory: 'Active monitoring, reminders, compliance aids',
                pragmatic: 'No special adherence monitoring beyond usual care',
                question: 'How different is the adherence monitoring from usual care?'
            },
            {
                domain: 'Follow-up',
                explanatory: 'Frequent visits, extensive testing beyond clinical need',
                pragmatic: 'No follow-up visits beyond routine care; use administrative data',
                question: 'How different is the follow-up intensity from usual care?'
            },
            {
                domain: 'Primary outcome',
                explanatory: 'Surrogate markers, lab values, short-term endpoints',
                pragmatic: 'Outcomes meaningful to patients; clinically relevant endpoints',
                question: 'How important is the outcome to patients?'
            },
            {
                domain: 'Primary analysis',
                explanatory: 'Per-protocol; completers only; efficacy-focused',
                pragmatic: 'Intention-to-treat; all randomized patients included; effectiveness-focused',
                question: 'How closely does the analysis reflect what would happen in usual care?'
            }
        ];

        html += '<div id="sdg-precis2-form">';
        precis2Domains.forEach(function(d, idx) {
            html += '<div style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:8px">';
            html += '<div style="font-weight:600;margin-bottom:4px">' + (idx + 1) + '. ' + d.domain + '</div>';
            html += '<div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:6px">' + d.question + '</div>';
            html += '<div class="form-row form-row--2" style="gap:8px;margin-bottom:6px">';
            html += '<div style="font-size:0.78rem;color:var(--text-tertiary)"><em>Explanatory (1):</em> ' + d.explanatory + '</div>';
            html += '<div style="font-size:0.78rem;color:var(--text-tertiary)"><em>Pragmatic (5):</em> ' + d.pragmatic + '</div>';
            html += '</div>';
            html += '<div style="display:flex;align-items:center;gap:8px">';
            html += '<span style="font-size:0.75rem;color:var(--text-tertiary)">Explan.</span>';
            for (var s = 1; s <= 5; s++) {
                html += '<label style="display:flex;align-items:center;gap:2px;cursor:pointer;font-size:0.8rem">'
                    + '<input type="radio" name="precis2_' + idx + '" value="' + s + '"' + (s === 3 ? ' checked' : '') + '> ' + s
                    + '</label>';
            }
            html += '<span style="font-size:0.75rem;color:var(--text-tertiary)">Pragm.</span>';
            html += '</div></div>';
        });
        html += '</div>';

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-primary" onclick="StudyDesignGuide.scorePRECIS2()">Generate PRECIS-2 Summary</button>';
        html += '</div>';
        html += '<div id="sdg-precis2-result"></div>';
        html += '</div>';

        // ---- Card 8: Bias & Confounding Quick Reference ----
        html += '<div class="card">';
        html += '<div class="card-title">Bias &amp; Confounding Quick Reference</div>';
        html += '<div class="card-subtitle">Common biases organized by study phase.</div>';

        html += '<div class="form-group"><label class="form-label">Filter by Phase</label>';
        html += '<select class="form-select" id="sdg_bias_filter" name="sdg_bias_filter" onchange="StudyDesignGuide.filterBiases()">';
        html += '<option value="all">All Phases</option><option value="Selection">Selection</option>';
        html += '<option value="Information">Information / Measurement</option><option value="Confounding">Confounding</option>';
        html += '<option value="Attrition">Attrition / Follow-up</option></select></div>';

        html += '<div class="table-container" id="sdg-bias-table-container">';
        html += buildBiasTable('all');
        html += '</div>';

        html += '<div class="result-panel mt-2">';
        html += '<div class="card-subtitle">Key Principles for Minimizing Bias</div>';
        html += '<div style="font-size:0.85rem;line-height:1.8">';
        html += '<strong>1. Internal Validity:</strong> Randomization, blinding, and rigorous protocols are the primary tools.<br>';
        html += '<strong>2. External Validity:</strong> Broad eligibility, pragmatic designs, and multi-site recruitment improve it.<br>';
        html += '<strong>3. DAGs:</strong> Use causal diagrams to identify confounders, mediators, and colliders before analysis.<br>';
        html += '<strong>4. E-value:</strong> Quantifies the minimum strength of unmeasured confounding needed to explain an association.<br>';
        html += '<strong>5. QBA:</strong> Formally model the impact of selection bias, misclassification, and confounding.<br>';
        html += '</div></div>';
        html += '</div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    /* ================================================================
       DECISION TREE LOGIC
       ================================================================ */

    function recommend() {
        var goal = document.getElementById('sdg_q_goal').value;
        var timing = document.getElementById('sdg_q_timing').value;
        var randomize = document.getElementById('sdg_q_randomize').value;
        var outcomeFreq = document.getElementById('sdg_q_outcome_freq').value;
        var data = document.getElementById('sdg_q_data').value;

        if (!goal) { Export.showToast('Please answer at least the first question.', 'error'); return; }

        var recommendations = [];
        var reasoning = [];

        if (goal === 'synthesize') {
            recommendations.push('Meta-Analysis', 'Systematic Review');
            reasoning.push('Your goal is to synthesize existing evidence. A systematic review provides a comprehensive summary. If studies are homogeneous, a meta-analysis gives a pooled estimate.');
        } else if (goal === 'diagnosis') {
            recommendations.push('Cross-Sectional (Diagnostic Accuracy)');
            reasoning.push('Diagnostic accuracy studies are cross-sectional: index test and reference standard applied at the same time. Follow STARD guidelines.');
        } else if (goal === 'prevalence') {
            recommendations.push('Cross-Sectional Survey');
            reasoning.push('Cross-sectional designs are standard for prevalence estimation.');
        } else if (goal === 'treatment') {
            if (randomize === 'yes') {
                recommendations.push('Randomized Controlled Trial (RCT)');
                reasoning.push('Randomization is feasible and ethical. An RCT provides the strongest evidence.');
                if (outcomeFreq === 'rare') reasoning.push('With a rare outcome, consider a multi-center trial or adaptive design.');
            } else {
                if (timing === 'forward') { recommendations.push('Prospective Cohort Study'); reasoning.push('Forward follow-up without randomization. Use propensity scores.'); }
                else if (timing === 'backward') { recommendations.push('Case-Control Study'); reasoning.push('Starting from outcome and looking back. Consider nested case-control.'); }
                else { recommendations.push('Retrospective Cohort Study', 'Propensity-Score Matched Cohort'); reasoning.push('Using existing data with advanced confounding adjustment.'); }
                if (outcomeFreq === 'rare') { recommendations.push('Case-Control Study'); reasoning.push('Case-control is efficient for rare outcomes.'); }
            }
        } else if (goal === 'etiology') {
            if (timing === 'forward' && data === 'new') { recommendations.push('Prospective Cohort Study'); reasoning.push('Forward follow-up establishes temporality for causal inference.'); }
            else if (timing === 'forward') { recommendations.push('Retrospective Cohort Study'); reasoning.push('Using existing records preserves temporal sequence.'); }
            else if (timing === 'backward') { recommendations.push('Case-Control Study'); reasoning.push('Efficient for rare diseases or multiple exposures.'); }
            else if (timing === 'simultaneous') { recommendations.push('Cross-Sectional Study'); reasoning.push('Simultaneous measurement: association only, not causation.'); }
            if (outcomeFreq === 'rare' && recommendations.indexOf('Case-Control Study') === -1) { recommendations.push('Case-Control Study'); reasoning.push('Case-control is most efficient for rare outcomes.'); }
        } else if (goal === 'prognosis') {
            recommendations.push('Prospective Cohort Study');
            reasoning.push('Prognosis requires following patients from a defined inception point.');
            if (data === 'existing') { recommendations.push('Retrospective Cohort Study'); reasoning.push('Existing records can also address prognostic questions.'); }
        }

        if (recommendations.length === 0) {
            recommendations.push('Prospective Cohort Study', 'Cross-Sectional Study');
            reasoning.push('Consider the specific question and available resources.');
        }

        var uniqueRecs = Array.from(new Set(recommendations));

        var out = '<div class="result-panel animate-in mt-2">';
        out += '<div class="card-title">Recommended Design' + (uniqueRecs.length > 1 ? 's' : '') + '</div>';
        for (var k = 0; k < uniqueRecs.length; k++) {
            out += '<div class="result-value" style="font-size:1.3rem">' + (k + 1) + '. ' + uniqueRecs[k] + '</div>';
            out += '<div class="result-label">' + (k === 0 ? 'Primary Recommendation' : 'Alternative Option') + '</div>';
        }

        out += '<div class="card-subtitle mt-2">Reasoning</div><div style="font-size:0.9rem;line-height:1.7">';
        for (var p = 0; p < reasoning.length; p++) out += '<p style="margin:0.4em 0">' + reasoning[p] + '</p>';
        out += '</div>';

        out += '<div class="card-subtitle mt-2">Decision Pathway</div>';
        out += '<div style="font-family:monospace;font-size:0.82rem;line-height:1.6;padding:1em;background:var(--bg-offset);border-radius:8px">';
        out += 'START<br>  |<br>  +-- Goal: ' + (goal || '?') + '<br>';
        if (goal === 'synthesize') { out += '  |     +-- Published literature -> Systematic Review / Meta-Analysis<br>'; }
        else if (goal === 'diagnosis') { out += '  |     +-- Diagnostic test -> Cross-sectional (STARD)<br>'; }
        else if (goal === 'prevalence') { out += '  |     +-- Prevalence estimation -> Cross-sectional survey<br>'; }
        else {
            out += '  |<br>  +-- Randomization? ' + (randomize || '?') + '<br>';
            if (randomize === 'yes') { out += '  |     +-- YES -> RCT<br>'; }
            else {
                out += '  |     +-- NO -> Observational<br>  |         +-- Timing: ' + (timing || '?') + '<br>';
                if (timing === 'forward') out += '  |         |    +-- Forward -> Cohort<br>';
                else if (timing === 'backward') out += '  |         |    +-- Backward -> Case-control<br>';
                else out += '  |         |    +-- Simultaneous -> Cross-sectional<br>';
                out += '  |         +-- Outcome: ' + (outcomeFreq || '?') + '<br>';
                if (outcomeFreq === 'rare') out += '  |              +-- Rare -> Case-control preferred<br>';
            }
        }
        out += '  |<br>  END -> ' + uniqueRecs[0] + '<br></div></div>';

        App.setTrustedHTML(document.getElementById('sdg-recommendation'), out);
    }

    function resetDecision() {
        for (var i = 0; i < DECISION_QUESTIONS.length; i++) {
            var el = document.getElementById('sdg_' + DECISION_QUESTIONS[i].id);
            if (el) el.value = '';
        }
        App.setTrustedHTML(document.getElementById('sdg-recommendation'), '');
    }

    /* ================================================================
       TEMPLATES
       ================================================================ */

    function showTemplate() {
        var sel = document.getElementById('sdg_template_select').value;
        var displayEl = document.getElementById('sdg-template-display');
        if (!sel || !TEMPLATES[sel]) { App.setTrustedHTML(displayEl, ''); return; }

        var t = TEMPLATES[sel];
        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">' + t.name + ' Template</div>';
        var sections = [
            { label: 'PICO / PECO Framework', content: t.pico },
            { label: 'Suggested Primary Endpoint', content: t.endpoint },
            { label: 'Sample Size Approach', content: t.sampleSize },
            { label: 'Analysis Plan', content: t.analysis },
            { label: 'Typical Timeline', content: t.timeline }
        ];
        for (var s = 0; s < sections.length; s++) {
            html += '<div class="card-subtitle mt-2">' + sections[s].label + '</div>';
            html += '<div style="font-size:0.88rem;line-height:1.7;white-space:pre-line;background:var(--bg-offset);padding:0.8em 1em;border-radius:6px;margin-top:0.3em">' + sections[s].content + '</div>';
        }
        html += '<div class="btn-group mt-2"><button class="btn btn-secondary" onclick="StudyDesignGuide.copyTemplate()">Copy Template</button></div>';
        html += '</div>';
        App.setTrustedHTML(displayEl, html);
    }

    function copyTemplate() {
        var sel = document.getElementById('sdg_template_select').value;
        if (!sel || !TEMPLATES[sel]) return;
        var t = TEMPLATES[sel];
        Export.copyText('=== ' + t.name + ' ===\n\nPICO:\n' + t.pico + '\n\nEndpoint:\n' + t.endpoint + '\n\nSample Size:\n' + t.sampleSize + '\n\nAnalysis:\n' + t.analysis + '\n\nTimeline:\n' + t.timeline);
    }

    /* ================================================================
       DESIGN MODIFICATIONS
       ================================================================ */

    function showModification() {
        var sel = document.getElementById('sdg_mod_select').value;
        var displayEl = document.getElementById('sdg-mod-display');
        if (sel === '' || isNaN(parseInt(sel))) { App.setTrustedHTML(displayEl, ''); return; }

        var m = DESIGN_MODIFICATIONS[parseInt(sel)];
        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">' + m.name + '</div>';
        html += '<p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.7;margin:0 0 12px 0">' + m.description + '</p>';

        html += '<div class="form-row form-row--2" style="gap:12px">'
            + '<div style="padding:12px;background:var(--surface);border-radius:8px;border-left:3px solid var(--success)">'
            + '<div style="font-weight:600;color:var(--success);margin-bottom:4px">Advantages</div>'
            + '<div style="font-size:0.85rem;color:var(--text-secondary)">' + m.advantages + '</div></div>'
            + '<div style="padding:12px;background:var(--surface);border-radius:8px;border-left:3px solid var(--danger)">'
            + '<div style="font-weight:600;color:var(--danger);margin-bottom:4px">Disadvantages</div>'
            + '<div style="font-size:0.85rem;color:var(--text-secondary)">' + m.disadvantages + '</div></div>'
            + '</div>';

        html += '<div style="margin-top:12px;padding:12px;background:var(--surface);border-radius:8px;border-left:3px solid var(--accent)">'
            + '<div style="font-weight:600;color:var(--accent);margin-bottom:4px">When to Use</div>'
            + '<div style="font-size:0.85rem;color:var(--text-secondary)">' + m.when + '</div></div>';

        html += '<div style="margin-top:12px;padding:12px;background:var(--surface);border-radius:8px">'
            + '<div style="font-weight:600;margin-bottom:4px">Example</div>'
            + '<div style="font-size:0.85rem;color:var(--text-secondary);font-style:italic">' + m.example + '</div></div>';

        if (m.analysis) {
            html += '<div style="margin-top:12px;padding:12px;background:var(--surface);border-radius:8px;border-left:3px solid var(--warning)">'
                + '<div style="font-weight:600;color:var(--warning);margin-bottom:4px">Analysis Considerations</div>'
                + '<div style="font-size:0.85rem;color:var(--text-secondary)">' + m.analysis + '</div></div>';
        }

        html += '</div>';
        App.setTrustedHTML(displayEl, html);
    }

    /* ================================================================
       BIAS ASSESSMENT TOOL
       ================================================================ */

    function assessBias() {
        var design = document.getElementById('sdg_bias_design').value;
        var displayEl = document.getElementById('sdg-bias-assessment');
        if (!design) { App.setTrustedHTML(displayEl, ''); return; }

        var biasProfiles = {
            rct: {
                title: 'RCT Bias Assessment (Cochrane RoB 2)',
                domains: [
                    { domain: 'Randomization process', risk: 'Low', note: 'Central randomization with allocation concealment minimizes this', tool: 'Was the allocation sequence random? Was concealment adequate?' },
                    { domain: 'Deviations from intended interventions', risk: 'Some concerns', note: 'Blinding of participants and personnel; adherence monitoring', tool: 'Were participants aware of assignment? Were there protocol deviations?' },
                    { domain: 'Missing outcome data', risk: 'Some concerns', note: 'ITT analysis with <5% missing; sensitivity analysis needed if >5%', tool: 'Was outcome data available for all (or nearly all) participants?' },
                    { domain: 'Measurement of outcome', risk: 'Low', note: 'Blinded outcome assessment; validated instruments; central adjudication', tool: 'Could outcome assessors have been aware of intervention received?' },
                    { domain: 'Selection of reported result', risk: 'Low', note: 'Pre-registered protocol and analysis plan; no selective reporting', tool: 'Is the trial pre-registered? Do analyses match the protocol?' }
                ]
            },
            cohort_pro: {
                title: 'Prospective Cohort Bias Assessment',
                domains: [
                    { domain: 'Confounding', risk: 'High', note: 'No randomization; must adjust for measured confounders; unmeasured confounding possible', tool: 'Were all important confounders measured? Was a DAG used? Report E-value.' },
                    { domain: 'Selection of participants', risk: 'Some concerns', note: 'Inception cohort preferred; consecutive/random enrollment', tool: 'Was the cohort representative? Was start of follow-up clearly defined?' },
                    { domain: 'Classification of exposure', risk: 'Some concerns', note: 'Prospective measurement reduces misclassification', tool: 'Was exposure measured before outcome? Were measures validated?' },
                    { domain: 'Missing data / attrition', risk: 'High', note: 'Long follow-up leads to dropout; use IPW or MI for missing data', tool: 'What was the loss to follow-up rate? Was it differential?' },
                    { domain: 'Outcome measurement', risk: 'Some concerns', note: 'Blinded assessment when possible; standardized ascertainment', tool: 'Were outcome assessors blinded to exposure status?' },
                    { domain: 'Selective reporting', risk: 'Some concerns', note: 'Pre-registered analysis plan reduces risk', tool: 'Were all planned analyses reported? Were there post-hoc analyses?' }
                ]
            },
            cohort_retro: {
                title: 'Retrospective Cohort Bias Assessment',
                domains: [
                    { domain: 'Confounding', risk: 'High', note: 'Same as prospective; additional concern for unmeasured variables not in records', tool: 'Were confounders adequately measured in existing records?' },
                    { domain: 'Exposure classification', risk: 'High', note: 'Dependent on record quality; potential for misclassification', tool: 'Were exposure data collected for clinical purposes (not research)?' },
                    { domain: 'Time-related biases', risk: 'High', note: 'Immortal time bias; prevalent user bias; time-varying confounding', tool: 'Was immortal time properly handled? Was a new-user design used?' },
                    { domain: 'Missing data', risk: 'High', note: 'Records may be incomplete; missing-not-at-random common', tool: 'Was completeness of data assessed? Were missing data methods appropriate?' },
                    { domain: 'Outcome ascertainment', risk: 'Some concerns', note: 'Dependent on coding accuracy; ICD codes may misclassify', tool: 'Were outcome codes validated against chart review?' }
                ]
            },
            case_control: {
                title: 'Case-Control Bias Assessment',
                domains: [
                    { domain: 'Selection of cases', risk: 'Some concerns', note: 'Population-based ascertainment preferred; consecutive enrollment', tool: 'Were cases representative? Were they incident or prevalent?' },
                    { domain: 'Selection of controls', risk: 'High', note: 'Controls must come from same source population; multiple control groups', tool: 'Were controls from the same source population? How were they sampled?' },
                    { domain: 'Recall bias', risk: 'High', note: 'Cases may recall exposures differently; use objective records when possible', tool: 'Were exposures ascertained from records or self-report? Was recall differential?' },
                    { domain: 'Confounding', risk: 'High', note: 'Matching and adjustment needed; residual confounding likely', tool: 'Was matching appropriate? Were important confounders adjusted for?' },
                    { domain: 'Exposure measurement', risk: 'Some concerns', note: 'Blinded assessment; validated instruments; biomarkers when available', tool: 'Were exposure assessors blinded to case/control status?' }
                ]
            },
            cross_sectional: {
                title: 'Cross-Sectional Bias Assessment',
                domains: [
                    { domain: 'Temporal ambiguity', risk: 'High', note: 'Cannot establish cause and effect; exposure and outcome measured simultaneously', tool: 'Is it biologically plausible that exposure preceded outcome?' },
                    { domain: 'Selection / non-response', risk: 'Some concerns', note: 'Non-response bias if participation rate is low or differential', tool: 'What was the response rate? Were responders different from non-responders?' },
                    { domain: 'Prevalence-incidence bias', risk: 'Some concerns', note: 'Prevalent cases overrepresent long-duration, less-fatal cases', tool: 'Are prevalent or incident cases being studied? Could survivor bias affect results?' },
                    { domain: 'Information bias', risk: 'Some concerns', note: 'Self-report may be inaccurate; social desirability bias', tool: 'Were validated instruments used? Was ascertainment standardized?' },
                    { domain: 'Confounding', risk: 'High', note: 'Multiple potential confounders; cannot determine direction of association', tool: 'Were important confounders measured and adjusted for?' }
                ]
            }
        };

        var profile = biasProfiles[design];
        if (!profile) return;

        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">' + profile.title + '</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Domain</th><th>Typical Risk</th><th>Notes</th><th>Assessment Questions</th></tr></thead><tbody>';

        profile.domains.forEach(function(d) {
            var color = d.risk === 'Low' ? 'var(--success)' : d.risk === 'Some concerns' ? 'var(--warning)' : 'var(--danger)';
            html += '<tr><td><strong>' + d.domain + '</strong></td>'
                + '<td style="color:' + color + ';font-weight:600;text-align:center">' + d.risk + '</td>'
                + '<td style="font-size:0.82rem">' + d.note + '</td>'
                + '<td style="font-size:0.82rem;font-style:italic">' + d.tool + '</td></tr>';
        });

        html += '</tbody></table></div></div>';
        App.setTrustedHTML(displayEl, html);
    }

    /* ================================================================
       BIAS TABLE
       ================================================================ */

    function buildBiasTable(phase) {
        var html = '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Phase</th><th>Bias Type</th><th>Definition</th><th>Direction</th><th>Mitigation</th></tr></thead><tbody>';
        for (var b = 0; b < BIASES.length; b++) {
            var bias = BIASES[b];
            if (phase !== 'all' && bias.phase !== phase) continue;
            var phaseColor = bias.phase === 'Selection' ? '#4e79a7' : bias.phase === 'Information' ? '#e15759' : bias.phase === 'Confounding' ? '#f28e2b' : '#76b7b2';
            html += '<tr><td><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + phaseColor + ';margin-right:6px"></span>' + bias.phase + '</td>'
                + '<td><strong>' + bias.name + '</strong></td>'
                + '<td style="font-size:0.82rem">' + bias.definition + '</td>'
                + '<td style="font-size:0.82rem">' + bias.direction + '</td>'
                + '<td style="font-size:0.82rem">' + bias.strategies + '</td></tr>';
        }
        html += '</tbody></table></div>';
        return html;
    }

    function filterBiases() {
        var phase = document.getElementById('sdg_bias_filter').value;
        App.setTrustedHTML(document.getElementById('sdg-bias-table-container'), buildBiasTable(phase));
    }

    /* ================================================================
       PRECIS-2 Scoring
       ================================================================ */

    function scorePRECIS2() {
        var domainNames = [
            'Eligibility criteria',
            'Recruitment',
            'Setting',
            'Organization',
            'Flexibility (delivery)',
            'Flexibility (adherence)',
            'Follow-up',
            'Primary outcome',
            'Primary analysis'
        ];
        var scores = [];
        var total = 0;

        for (var i = 0; i < 9; i++) {
            var radios = document.querySelectorAll('input[name="precis2_' + i + '"]');
            var score = 3; // default
            for (var r = 0; r < radios.length; r++) {
                if (radios[r].checked) {
                    score = parseInt(radios[r].value);
                    break;
                }
            }
            scores.push(score);
            total += score;
        }

        var avg = total / 9;
        var isExplanatory = avg < 2.5;
        var isPragmatic = avg > 3.5;
        var classification = isPragmatic ? 'Predominantly Pragmatic' :
            isExplanatory ? 'Predominantly Explanatory' : 'Mixed / Intermediate';

        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="result-value">' + avg.toFixed(1) + '<div class="result-label">'
            + 'Mean PRECIS-2 Score (' + classification + ')</div></div>';

        // Spider/radar chart approximation using bar chart
        html += '<div class="card-title mt-2">Domain Scores</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Domain</th><th>Score</th><th>Visual</th><th>Interpretation</th></tr></thead><tbody>';

        for (var j = 0; j < 9; j++) {
            var barWidth = (scores[j] / 5) * 100;
            var barColor = scores[j] <= 2 ? 'var(--danger)' : scores[j] >= 4 ? 'var(--success)' : 'var(--warning)';
            var interp = scores[j] <= 2 ? 'Explanatory' : scores[j] >= 4 ? 'Pragmatic' : 'Mixed';

            html += '<tr><td><strong>' + domainNames[j] + '</strong></td>';
            html += '<td class="num">' + scores[j] + '/5</td>';
            html += '<td><div style="background:var(--bg-tertiary);border-radius:4px;height:16px;width:100%;position:relative">'
                + '<div style="background:' + barColor + ';border-radius:4px;height:100%;width:' + barWidth + '%"></div></div></td>';
            html += '<td style="font-size:0.82rem;color:' + barColor + '">' + interp + '</td></tr>';
        }
        html += '</tbody></table></div>';

        // Summary and recommendations
        html += '<div style="margin-top:12px;padding:12px;background:var(--surface);border-radius:8px;border-left:3px solid var(--accent)">';
        html += '<div style="font-weight:600;margin-bottom:4px">Summary</div>';
        html += '<div style="font-size:0.85rem;line-height:1.7;color:var(--text-secondary)">';
        html += 'This trial design is <strong>' + classification.toLowerCase() + '</strong> (mean score: ' + avg.toFixed(1) + '/5).<br>';

        // Find most explanatory and most pragmatic domains
        var minScore = 6, maxScore = 0, minDomain = '', maxDomain = '';
        for (var k = 0; k < 9; k++) {
            if (scores[k] < minScore) { minScore = scores[k]; minDomain = domainNames[k]; }
            if (scores[k] > maxScore) { maxScore = scores[k]; maxDomain = domainNames[k]; }
        }

        html += 'Most explanatory domain: <strong>' + minDomain + '</strong> (score: ' + minScore + ').<br>';
        html += 'Most pragmatic domain: <strong>' + maxDomain + '</strong> (score: ' + maxScore + ').<br>';

        if (isPragmatic) {
            html += 'This design prioritizes real-world applicability. Results will be most useful for clinical decision-making and policy.';
        } else if (isExplanatory) {
            html += 'This design prioritizes internal validity. Results will demonstrate efficacy under ideal conditions.';
        } else {
            html += 'This is a mixed design with both pragmatic and explanatory elements. Consider whether this balance is intentional and aligned with your research question.';
        }
        html += '</div></div>';

        html += '</div>';
        App.setTrustedHTML(document.getElementById('sdg-precis2-result'), html);
    }

    /* ================================================================
       REGISTER
       ================================================================ */

    App.registerModule(MODULE_ID, { render: render });

    window.StudyDesignGuide = {
        recommend: recommend,
        resetDecision: resetDecision,
        showTemplate: showTemplate,
        copyTemplate: copyTemplate,
        showModification: showModification,
        assessBias: assessBias,
        filterBiases: filterBiases,
        scorePRECIS2: scorePRECIS2
    };
})();
