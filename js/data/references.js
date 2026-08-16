/**
 * Neuro-Epi — Reference Data
 * Clinical scales, presets, common parameters for stroke research
 */

const References = {
    // mRS distributions from landmark trials (approximate, based on published figures)
    mrsDistributions: {
        'ESCAPE Control': { dist: [0.06, 0.09, 0.12, 0.08, 0.16, 0.20, 0.29], label: 'ESCAPE Control Arm', trial: 'ESCAPE', year: 2015 },
        'ESCAPE Treatment': { dist: [0.14, 0.17, 0.20, 0.10, 0.10, 0.10, 0.19], label: 'ESCAPE EVT Arm', trial: 'ESCAPE', year: 2015 },
        'DAWN Control': { dist: [0.05, 0.08, 0.10, 0.08, 0.16, 0.22, 0.31], label: 'DAWN Control Arm', trial: 'DAWN', year: 2018 },
        'DAWN Treatment': { dist: [0.15, 0.15, 0.19, 0.09, 0.12, 0.12, 0.18], label: 'DAWN Thrombectomy Arm', trial: 'DAWN', year: 2018 },
        'NINDS Control': { dist: [0.20, 0.06, 0.09, 0.13, 0.17, 0.14, 0.21], label: 'NINDS Placebo Arm', trial: 'NINDS', year: 1995 },
        'NINDS Treatment': { dist: [0.26, 0.13, 0.11, 0.10, 0.13, 0.10, 0.17], label: 'NINDS tPA Arm', trial: 'NINDS', year: 1995 },
        'MR CLEAN Control': { dist: [0.05, 0.05, 0.12, 0.12, 0.16, 0.17, 0.33], label: 'MR CLEAN Control', trial: 'MR CLEAN', year: 2015 },
        'MR CLEAN Treatment': { dist: [0.09, 0.10, 0.13, 0.13, 0.14, 0.13, 0.28], label: 'MR CLEAN EVT', trial: 'MR CLEAN', year: 2015 },
        'Typical LVO Control': { dist: [0.05, 0.07, 0.10, 0.10, 0.18, 0.20, 0.30], label: 'Typical LVO Medical Therapy', trial: 'Composite', year: 2020 },
        'Typical AIS Control': { dist: [0.15, 0.12, 0.15, 0.12, 0.14, 0.12, 0.20], label: 'Typical AIS (mixed)', trial: 'Composite', year: 2020 }
    },

    // Common event rates in stroke trials
    eventRates: {
        'mRS 0-2 LVO control': { rate: 0.28, description: 'Functional independence (mRS 0-2) in LVO with medical therapy', source: 'Meta-analysis of EVT trials' },
        'mRS 0-2 LVO EVT': { rate: 0.46, description: 'Functional independence (mRS 0-2) with EVT', source: 'Meta-analysis of EVT trials' },
        'mRS 0-1 after tPA': { rate: 0.39, description: 'Excellent outcome (mRS 0-1) with IV tPA within 4.5h', source: 'ECASS III' },
        'mRS 0-1 placebo': { rate: 0.29, description: 'Excellent outcome (mRS 0-1) without treatment', source: 'ECASS III control' },
        '90-day mortality LVO': { rate: 0.20, description: '90-day mortality in LVO stroke', source: 'Meta-analysis' },
        'sICH with tPA': { rate: 0.06, description: 'Symptomatic ICH rate with IV tPA', source: 'SITS-MOST, NINDS' },
        'sICH with EVT': { rate: 0.05, description: 'Symptomatic ICH rate with EVT + tPA', source: 'HERMES meta-analysis' },
        'Recurrent stroke 1yr': { rate: 0.05, description: 'Recurrent stroke at 1 year', source: 'Secondary prevention trials' },
        'Recurrent stroke 1yr DAPT': { rate: 0.035, description: 'Recurrent stroke at 1 year with DAPT', source: 'CHANCE/POINT' },
        'Stroke/SEE AF warfarin': { rate: 0.016, description: 'Annual stroke/SEE with warfarin in AF', source: 'RE-LY, ROCKET-AF' },
        'Stroke/SEE AF DOAC': { rate: 0.012, description: 'Annual stroke/SEE with DOAC in AF', source: 'Meta-analysis of DOAC trials' },
        'ICH growth >33%': { rate: 0.38, description: 'ICH hematoma expansion >33%', source: 'INTERACT2' },
        'ICH 90-day mortality': { rate: 0.30, description: 'ICH 90-day mortality', source: 'Observational data' },
        'Carotid ipsilateral stroke 5yr': { rate: 0.26, description: '5-year ipsilateral stroke with ≥70% carotid stenosis (medical)', source: 'NASCET' }
    },

    // Common effect sizes
    effectSizes: {
        'EVT common OR (large)': { value: 2.6, type: 'OR', source: 'ESCAPE', description: 'Common OR for mRS shift, ESCAPE trial' },
        'EVT common OR (pooled)': { value: 2.0, type: 'OR', source: 'HERMES', description: 'Pooled common OR from 5 pivotal EVT trials' },
        'EVT common OR (late window)': { value: 2.0, type: 'OR', source: 'DAWN', description: 'Common OR for late-window EVT' },
        'Realistic new EVT trial': { value: 1.5, type: 'OR', source: 'Assumption', description: 'Conservative common OR for new EVT indication trial' },
        'tPA OR (within 3h)': { value: 1.75, type: 'OR', source: 'NINDS', description: 'OR for favorable outcome with tPA within 3 hours' },
        'DAPT HR stroke': { value: 0.68, type: 'HR', source: 'CHANCE', description: 'HR for recurrent stroke with DAPT vs aspirin' },
        'DOAC vs warfarin': { value: 0.80, type: 'RR', source: 'Meta-analysis', description: 'Pooled RR for stroke/SEE with DOACs vs warfarin' },
        'BP lowering (PROGRESS)': { value: 0.72, type: 'RR', source: 'PROGRESS', description: 'RR for recurrent stroke with BP lowering' },
        'Statin (SPARCL)': { value: 0.84, type: 'HR', source: 'SPARCL', description: 'HR for recurrent stroke with atorvastatin 80mg' },
        'CEA vs medical': { value: 0.35, type: 'ARR', source: 'NASCET', description: 'ARR for stroke at 2 years, ≥70% stenosis, with CEA' }
    },

    // Sample size presets
    sampleSizePresets: {
        'NINDS-like (tPA 0-3h)': {
            designType: 'proportions',
            p1: 0.20, p2: 0.32,
            alpha: 0.05, power: 0.80,
            description: 'Similar to NINDS: comparing mRS 0-1 rate, tPA vs placebo within 3 hours'
        },
        'DAWN-like (late EVT)': {
            designType: 'ordinal',
            commonOR: 2.0,
            alpha: 0.05, power: 0.80,
            controlDist: [0.05, 0.08, 0.10, 0.08, 0.16, 0.22, 0.31],
            description: 'Late-window EVT trial using ordinal mRS shift'
        },
        'Secondary Prevention': {
            designType: 'proportions',
            p1: 0.05, p2: 0.035,
            alpha: 0.05, power: 0.80,
            description: 'Secondary prevention: 1-year recurrent stroke, treatment vs control'
        },
        'ICH Trial': {
            designType: 'proportions',
            p1: 0.38, p2: 0.30,
            alpha: 0.05, power: 0.80,
            description: 'ICH trial: death or disability at 90 days'
        },
        'Neuroprotection Trial': {
            designType: 'ordinal',
            commonOR: 1.3,
            alpha: 0.05, power: 0.80,
            controlDist: [0.15, 0.12, 0.15, 0.12, 0.14, 0.12, 0.20],
            description: 'Neuroprotection trial with modest effect size on mRS'
        }
    },

    // Clinical scales
    scales: {
        mRS: {
            name: 'Modified Rankin Scale',
            levels: [
                { score: 0, label: 'No symptoms' },
                { score: 1, label: 'No significant disability' },
                { score: 2, label: 'Slight disability' },
                { score: 3, label: 'Moderate disability' },
                { score: 4, label: 'Moderately severe disability' },
                { score: 5, label: 'Severe disability' },
                { score: 6, label: 'Dead' }
            ]
        },
        NIHSS: {
            name: 'NIH Stroke Scale',
            range: '0-42',
            categories: [
                { range: '0', label: 'No stroke symptoms' },
                { range: '1-4', label: 'Minor stroke' },
                { range: '5-15', label: 'Moderate stroke' },
                { range: '16-20', label: 'Moderate to severe' },
                { range: '21-42', label: 'Severe stroke' }
            ]
        },
        ASPECTS: {
            name: 'Alberta Stroke Program Early CT Score',
            range: '0-10',
            description: '10 = normal, each point deducted for early ischemic change in defined region'
        },
        GCS: {
            name: 'Glasgow Coma Scale',
            range: '3-15',
            categories: [
                { range: '13-15', label: 'Mild' },
                { range: '9-12', label: 'Moderate' },
                { range: '3-8', label: 'Severe' }
            ]
        }
    },

    // Bias catalog
    biases: [
        { name: 'Selection Bias', description: 'Systematic differences between comparison groups at baseline', strokeExample: 'Comparing EVT outcomes at comprehensive vs primary stroke centers without accounting for case-mix differences', mitigation: 'Randomization; propensity score matching; restriction; stratification' },
        { name: 'Immortal Time Bias', description: 'Misclassification of unexposed person-time as exposed, creating artificial survival advantage', strokeExample: 'Comparing patients who received EVT (must survive to catheterization) vs medical therapy from stroke onset', mitigation: 'Landmark analysis; time-dependent Cox modeling; exclude immortal time from analysis' },
        { name: 'Lead Time Bias', description: 'Earlier detection appears to improve survival without changing disease course', strokeExample: 'Screening for asymptomatic carotid stenosis appears to improve stroke-free survival', mitigation: 'Use disease-specific mortality; back-calculate expected detection time' },
        { name: 'Survivor Bias (Prevalent Case Bias)', description: 'Studying prevalent cases overrepresents long survivors', strokeExample: 'Cross-sectional study of post-stroke depression excludes patients who died early (often those with largest strokes)', mitigation: 'Incident cohort design; time-from-event matching' },
        { name: 'Referral Bias (Berkson\'s)', description: 'Facility-based samples differ systematically from population-based samples', strokeExample: 'Stroke mimics are overrepresented in tertiary center studies compared to community-based studies', mitigation: 'Population-based studies; multicenter sampling' },
        { name: 'Healthy Worker Effect', description: 'Working populations are healthier than general population', strokeExample: 'Occupational studies of stroke risk underestimate true incidence', mitigation: 'Use appropriate reference population; internal comparisons' },
        { name: 'Recall Bias', description: 'Differential recall of exposures between cases and controls', strokeExample: 'Stroke patients may over-report prior headache compared to controls', mitigation: 'Prospective data collection; medical records verification' },
        { name: 'Ascertainment Bias', description: 'Differential detection of outcomes between groups', strokeExample: 'More frequent MRI in treatment arm detects more silent infarcts', mitigation: 'Blinded outcome assessment; standardized follow-up protocol' },
        { name: 'Attrition Bias', description: 'Systematic differences between those who complete follow-up and those lost', strokeExample: 'More severely affected stroke patients are lost to 90-day follow-up, inflating treatment effect', mitigation: 'Intention-to-treat analysis; multiple imputation; sensitivity analyses' },
        { name: 'Collider Bias', description: 'Conditioning on a common effect of exposure and outcome creates spurious association', strokeExample: 'Among inpatient stroke patients (collider), obesity may appear protective because selection into facility differs by BMI', mitigation: 'Avoid conditioning on colliders; DAG-based analysis planning' },
        { name: 'Length Bias', description: 'Slowly progressing cases are overrepresented in prevalence studies', strokeExample: 'Survey of stroke survivors overrepresents mild strokes with good recovery', mitigation: 'Incident case enrollment; time-to-event analysis' },
        { name: 'Information Bias', description: 'Errors in measuring exposure or outcome', strokeExample: 'NIHSS scoring variability between sites in multicenter trial', mitigation: 'Standardized training; central adjudication; blinding' },
        { name: 'Publication Bias', description: 'Positive studies are more likely to be published', strokeExample: 'Multiple negative neuroprotection trials went unpublished, inflating apparent efficacy in meta-analyses', mitigation: 'Trial registration; funnel plots; trim-and-fill; comprehensive search strategies' },
        { name: 'Confounding by Indication', description: 'Treatment selection is influenced by prognosis', strokeExample: 'Comparing outcomes of EVT vs no EVT in observational data — EVT patients selected based on favorable imaging', mitigation: 'Randomization; instrumental variables; propensity scores' },
        { name: 'Time-window Bias', description: 'Exposure requires minimum survival time', strokeExample: 'Comparing 90-day outcomes by treatment received requires surviving long enough to receive treatment', mitigation: 'Time-dependent exposure; landmark analysis' }
    ],

    // Regression model recommendations
    regressionModels: {
        'binary_independent': { model: 'Logistic Regression', formula: 'logit(P(Y=1)) = β₀ + β₁X₁ + ...', assumptions: 'Independent observations, no multicollinearity, large sample (EPV≥10)', notes: 'Standard for binary outcomes in stroke research (e.g., mRS 0-2 vs 3-6)' },
        'binary_clustered': { model: 'GEE (logit link) or Mixed-effects Logistic', formula: 'logit(P(Y=1)) = β₀ + β₁X₁ + ... + b_i', assumptions: 'Exchangeable or unstructured correlation within clusters', notes: 'For multicenter studies with site-level clustering' },
        'binary_repeated': { model: 'GEE or Mixed-effects Logistic', formula: 'Same as above with time-varying covariates', assumptions: 'Specify working correlation structure', notes: 'Repeated binary outcomes over time' },
        'continuous_independent': { model: 'Linear Regression', formula: 'Y = β₀ + β₁X₁ + ...', assumptions: 'Normality of residuals, homoscedasticity, independence, no multicollinearity', notes: 'For continuous outcomes like NIHSS change' },
        'continuous_clustered': { model: 'Mixed-effects Linear Model', formula: 'Y = β₀ + β₁X₁ + ... + b_i', assumptions: 'Random effects normally distributed', notes: 'For continuous outcomes with clustering' },
        'continuous_repeated': { model: 'Mixed-effects Model or GEE', formula: 'Y_ij = β₀ + β₁X_ij + ... + b_i', assumptions: 'Missing at random for mixed models', notes: 'Longitudinal continuous outcomes' },
        'count_independent': { model: 'Poisson or Negative Binomial', formula: 'log(E(Y)) = β₀ + β₁X₁ + offset(log(t))', assumptions: 'Mean=variance (Poisson) or overdispersion allowed (NB)', notes: 'For count outcomes like number of lesions' },
        'time_independent': { model: 'Cox Proportional Hazards', formula: 'h(t) = h₀(t) × exp(β₁X₁ + ...)', assumptions: 'Proportional hazards, non-informative censoring', notes: 'Standard for time-to-event outcomes in stroke trials' },
        'time_clustered': { model: 'Frailty Model (shared frailty)', formula: 'h(t) = h₀(t) × exp(β₁X₁ + ... + w_i)', assumptions: 'Frailty term captures cluster-level heterogeneity', notes: 'For clustered time-to-event data' },
        'ordinal_independent': { model: 'Ordinal Logistic (Proportional Odds)', formula: 'logit(P(Y≤j)) = α_j - (β₁X₁ + ...)', assumptions: 'Proportional odds assumption', notes: 'PREFERRED for mRS shift analysis in stroke trials' }
    },

    // Standard populations for age-standardization
    standardPopulations: {
        'WHO World Standard': [
            { ageGroup: '0-4', weight: 8860 },
            { ageGroup: '5-9', weight: 8690 },
            { ageGroup: '10-14', weight: 8600 },
            { ageGroup: '15-19', weight: 8470 },
            { ageGroup: '20-24', weight: 8220 },
            { ageGroup: '25-29', weight: 7930 },
            { ageGroup: '30-34', weight: 7610 },
            { ageGroup: '35-39', weight: 7150 },
            { ageGroup: '40-44', weight: 6590 },
            { ageGroup: '45-49', weight: 6040 },
            { ageGroup: '50-54', weight: 5370 },
            { ageGroup: '55-59', weight: 4550 },
            { ageGroup: '60-64', weight: 3720 },
            { ageGroup: '65-69', weight: 2960 },
            { ageGroup: '70-74', weight: 2210 },
            { ageGroup: '75-79', weight: 1520 },
            { ageGroup: '80-84', weight: 910 },
            { ageGroup: '85+', weight: 635 }
        ],
        'US 2000 Standard': [
            { ageGroup: '0-4', weight: 6941 },
            { ageGroup: '5-14', weight: 14567 },
            { ageGroup: '15-24', weight: 13839 },
            { ageGroup: '25-34', weight: 13520 },
            { ageGroup: '35-44', weight: 16218 },
            { ageGroup: '45-54', weight: 13458 },
            { ageGroup: '55-64', weight: 8723 },
            { ageGroup: '65-74', weight: 6601 },
            { ageGroup: '75-84', weight: 4445 },
            { ageGroup: '85+', weight: 1688 }
        ]
    },

    // GRADE framework
    grade: {
        startingLevel: { RCT: 'High', Observational: 'Low' },
        rateDown: [
            { domain: 'Risk of Bias', description: 'Study limitations (randomization, blinding, attrition, etc.)' },
            { domain: 'Inconsistency', description: 'Heterogeneity across studies (I², overlapping CIs)' },
            { domain: 'Indirectness', description: 'Differences in population, intervention, comparator, or outcome from question of interest' },
            { domain: 'Imprecision', description: 'Wide confidence intervals, small sample size, few events' },
            { domain: 'Publication Bias', description: 'Asymmetric funnel plot, small-study effects' }
        ],
        rateUp: [
            { domain: 'Large Effect', description: 'RR >2 or <0.5 with no plausible confounders' },
            { domain: 'Dose-Response', description: 'Dose-response gradient observed' },
            { domain: 'Confounding', description: 'All residual confounding would reduce effect' }
        ],
        certaintyLevels: ['High', 'Moderate', 'Low', 'Very Low']
    },

    // RoB 2.0 domains
    rob2: {
        domains: [
            {
                id: 'D1',
                name: 'Randomization process',
                questions: [
                    'Was the allocation sequence random?',
                    'Was the allocation sequence concealed until participants were enrolled and assigned?',
                    'Did baseline differences between groups suggest a problem with randomization?'
                ]
            },
            {
                id: 'D2',
                name: 'Deviations from intended interventions',
                questions: [
                    'Were participants aware of their assigned intervention during the trial?',
                    'Were carers and trial personnel aware of assigned intervention during the trial?',
                    'Were there deviations from the intended intervention that arose because of the trial context?',
                    'Were these deviations likely to have affected the outcome?',
                    'Was an appropriate analysis used to estimate the effect of assignment to intervention?'
                ]
            },
            {
                id: 'D3',
                name: 'Missing outcome data',
                questions: [
                    'Were data for this outcome available for all, or nearly all, participants?',
                    'Is there evidence that the result was not biased by missing outcome data?',
                    'Could missingness depend on true value of the outcome?'
                ]
            },
            {
                id: 'D4',
                name: 'Measurement of the outcome',
                questions: [
                    'Was the method of measuring the outcome inappropriate?',
                    'Could measurement of the outcome have differed between groups?',
                    'Were outcome assessors aware of the intervention received by study participants?'
                ]
            },
            {
                id: 'D5',
                name: 'Selection of the reported result',
                questions: [
                    'Were the data that produced this result analysed in accordance with a pre-specified analysis plan?',
                    'Is the numerical result likely to have been selected from multiple outcome measurements or analyses?'
                ]
            }
        ],
        judgmentOptions: ['Low risk', 'Some concerns', 'High risk'],
        algorithm: 'Overall: Low if all domains Low; High if any domain High; Some concerns otherwise. A trial with some concerns in multiple domains may also be judged High risk overall if this substantially lowers confidence in the result.'
    },

    // AMSTAR-2 items
    amstar2: {
        items: [
            { id: 1, text: 'Did the research questions include PICO components?', critical: false },
            { id: 2, text: 'Was there an explicit statement that methods were established prior to the review?', critical: true },
            { id: 3, text: 'Did the authors explain their selection of study designs for inclusion?', critical: false },
            { id: 4, text: 'Did the authors use a comprehensive literature search strategy?', critical: true },
            { id: 5, text: 'Was study selection performed in duplicate?', critical: false },
            { id: 6, text: 'Was data extraction performed in duplicate?', critical: false },
            { id: 7, text: 'Did the authors provide a list of excluded studies and justify the exclusions?', critical: true },
            { id: 8, text: 'Did the authors describe the included studies in adequate detail?', critical: false },
            { id: 9, text: 'Did the authors use a satisfactory technique for assessing RoB?', critical: true },
            { id: 10, text: 'Did the authors report sources of funding for included studies?', critical: false },
            { id: 11, text: 'If meta-analysis was performed, did the authors use appropriate methods?', critical: true },
            { id: 12, text: 'If meta-analysis was performed, did the authors assess impact of RoB on results?', critical: false },
            { id: 13, text: 'Did the authors account for RoB when interpreting results?', critical: true },
            { id: 14, text: 'Did the authors provide a satisfactory explanation for heterogeneity?', critical: false },
            { id: 15, text: 'If quantitative synthesis, did the authors carry out adequate investigation of publication bias?', critical: true },
            { id: 16, text: 'Did the authors report any potential sources of conflict of interest?', critical: false }
        ],
        ratingAlgorithm: 'High: no critical flaw, no or one non-critical weakness; Moderate: no critical flaw, more than one non-critical weakness; Low: one critical flaw; Critically Low: more than one critical flaw'
    }
};

if (typeof module !== 'undefined') module.exports = References;
