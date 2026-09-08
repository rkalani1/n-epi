/**
 * Neuro-Epi — Critical Appraisal Module
 * Interactive scored checklists: RoB 2.0, NOS, AMSTAR-2, QUADAS-2, GRADE,
 * ROBINS-I, JBI checklists, Summary of Findings table, Risk of Bias visualization.
 */

(function() {
    'use strict';

    const MODULE_ID = 'critical-appraisal';

    var currentTool = 'rob2';
    var responses = {};

    /* ================================================================
       NEW DATA: ROBINS-I domains
       ================================================================ */

    var ROBINS_I = {
        name: 'ROBINS-I (Risk Of Bias In Non-randomized Studies of Interventions)',
        domains: [
            {
                id: 'RI-D1',
                name: 'Bias due to confounding',
                questions: [
                    'Is there potential for confounding of the effect of intervention in this study?',
                    'Was the analysis based on splitting participants\u2019 follow-up time according to intervention received?',
                    'Were intervention discontinuations or switches likely to be related to factors that are prognostic for the outcome?',
                    'Did the authors use an appropriate analysis method that controlled for all important confounding domains?',
                    'Were confounding domains that were controlled for measured validly and reliably?',
                    'Did the authors control for any post-intervention variables that could have been affected by the intervention?'
                ]
            },
            {
                id: 'RI-D2',
                name: 'Bias in selection of participants into the study',
                questions: [
                    'Was selection of participants into the study (or into the analysis) based on participant characteristics observed after the start of intervention?',
                    'Do start of follow-up and start of intervention coincide for most participants?',
                    'Were adjustment techniques used that are likely to correct for the presence of selection biases?'
                ]
            },
            {
                id: 'RI-D3',
                name: 'Bias in classification of interventions',
                questions: [
                    'Were intervention groups clearly defined?',
                    'Was the information used to define intervention groups recorded at the start of the intervention?',
                    'Could classification of intervention status have been affected by knowledge of the outcome or risk of the outcome?'
                ]
            },
            {
                id: 'RI-D4',
                name: 'Bias due to deviations from intended interventions',
                questions: [
                    'Were there deviations from the intended intervention beyond what would be expected in usual practice?',
                    'Were important co-interventions balanced across intervention groups?',
                    'Was the intervention implemented successfully for most participants?',
                    'Did the authors use an appropriate analysis that estimated the effect of starting and adhering to intervention?'
                ]
            },
            {
                id: 'RI-D5',
                name: 'Bias due to missing data',
                questions: [
                    'Were outcome data available for all, or nearly all, participants?',
                    'Were participants excluded due to missing data on intervention status?',
                    'Were participants excluded due to missing data on other variables needed for the analysis?',
                    'Are the proportion of participants and reasons for missing data similar across interventions?',
                    'Is there evidence that results were not biased by missing outcome data?'
                ]
            },
            {
                id: 'RI-D6',
                name: 'Bias in measurement of outcomes',
                questions: [
                    'Could the outcome measure have been influenced by knowledge of the intervention received?',
                    'Were outcome assessors aware of the intervention received by study participants?',
                    'Were the methods of outcome assessment comparable across intervention groups?',
                    'Were any systematic errors in measurement of the outcome related to intervention received?'
                ]
            },
            {
                id: 'RI-D7',
                name: 'Bias in selection of the reported result',
                questions: [
                    'Is the reported effect estimate likely to be selected, on the basis of the results, from multiple outcome measurements?',
                    'Is the reported effect estimate likely to be selected, on the basis of the results, from multiple analyses of the intervention-outcome relationship?',
                    'Is the reported effect estimate likely to be selected, on the basis of the results, from different subgroups?'
                ]
            }
        ],
        judgmentOptions: ['Low', 'Moderate', 'Serious', 'Critical', 'No Information']
    };

    /* ================================================================
       NEW DATA: JBI Checklists
       ================================================================ */

    var JBI_CHECKLISTS = {
        'cohort': {
            name: 'JBI Checklist for Cohort Studies',
            items: [
                'Were the two groups similar and recruited from the same population?',
                'Were the exposures measured similarly to assign people to both exposed and unexposed groups?',
                'Was the exposure measured in a valid and reliable way?',
                'Were confounding factors identified?',
                'Were strategies to deal with confounding factors stated?',
                'Were the groups/participants free of the outcome at the start of the study (or at the moment of exposure)?',
                'Were the outcomes measured in a valid and reliable way?',
                'Was the follow up time reported and sufficient to be long enough for outcomes to occur?',
                'Was follow up complete, and if not, were the reasons for loss to follow up described and explored?',
                'Were strategies to address incomplete follow up utilized?',
                'Was appropriate statistical analysis used?'
            ]
        },
        'case-control': {
            name: 'JBI Checklist for Case-Control Studies',
            items: [
                'Were the groups comparable other than the presence of disease in cases or the absence of disease in controls?',
                'Were cases and controls matched appropriately?',
                'Were the same criteria used for identification of cases and controls?',
                'Was exposure measured in a standard, valid and reliable way?',
                'Was exposure measured in the same way for cases and controls?',
                'Were confounding factors identified?',
                'Were strategies to deal with confounding factors stated?',
                'Were outcomes assessed in a standard, valid and reliable way for cases and controls?',
                'Was the exposure period of interest long enough to be meaningful?',
                'Was appropriate statistical analysis used?'
            ]
        },
        'cross-sectional': {
            name: 'JBI Checklist for Cross-Sectional Studies',
            items: [
                'Were the criteria for inclusion in the sample clearly defined?',
                'Were the study subjects and the setting described in detail?',
                'Was the exposure measured in a valid and reliable way?',
                'Were objective, standard criteria used for measurement of the condition?',
                'Were confounding factors identified?',
                'Were strategies to deal with confounding factors stated?',
                'Were the outcomes measured in a valid and reliable way?',
                'Was appropriate statistical analysis used?'
            ]
        },
        'rct': {
            name: 'JBI Checklist for Randomized Controlled Trials',
            items: [
                'Was true randomization used for assignment of participants to treatment groups?',
                'Was allocation to treatment groups concealed?',
                'Were treatment groups similar at the baseline?',
                'Were participants blind to treatment assignment?',
                'Were those delivering treatment blind to treatment assignment?',
                'Were outcomes assessors blind to treatment assignment?',
                'Were treatment groups treated identically other than the intervention of interest?',
                'Was follow up complete and if not, were differences between groups in terms of their follow up adequately described and analyzed?',
                'Were participants analyzed in the groups to which they were randomized?',
                'Were outcomes measured in the same way for treatment groups?',
                'Were outcomes measured in a reliable way?',
                'Was appropriate statistical analysis used?',
                'Was the trial design appropriate, and any deviations from the standard RCT design accounted for in the conduct and analysis?'
            ]
        }
    };

    /* ================================================================
       NEW DATA: CASP Checklists
       ================================================================ */

    var CASP_CHECKLISTS = {
        'rct': {
            name: 'CASP Checklist for Randomised Controlled Trials',
            sections: [
                { title: 'Section A: Are the results of the trial valid?', items: [
                    { id: 1, text: 'Did the trial address a clearly focused issue?', screening: true, help: 'Consider: population, intervention, comparator, outcomes (PICO)' },
                    { id: 2, text: 'Was the assignment of patients to treatments randomised?', screening: true, help: 'Consider: how randomisation was carried out, whether allocation was concealed' },
                    { id: 3, text: 'Were all of the patients who entered the trial properly accounted for at its conclusion?', help: 'Consider: was follow-up complete, were patients analysed in the groups to which they were randomised (ITT)' },
                    { id: 4, text: 'Were patients, health workers, and study personnel "blind" to treatment?', help: 'Consider: patients, clinicians, outcome assessors' },
                    { id: 5, text: 'Were the groups similar at the start of the trial?', help: 'Consider: baseline characteristics, confounders' },
                    { id: 6, text: 'Aside from the experimental intervention, were the groups treated equally?', help: 'Consider: co-interventions, care protocols' }
                ]},
                { title: 'Section B: What are the results?', items: [
                    { id: 7, text: 'How large was the treatment effect?', help: 'Consider: what outcomes were measured, effect sizes (RR, OR, NNT, mean difference)' },
                    { id: 8, text: 'How precise was the estimate of the treatment effect?', help: 'Consider: confidence intervals, p-values' }
                ]},
                { title: 'Section C: Will the results help locally?', items: [
                    { id: 9, text: 'Can the results be applied in your context (or to the local population)?', help: 'Consider: patients, setting, differences from your population' },
                    { id: 10, text: 'Were all clinically important outcomes considered?', help: 'Consider: primary and secondary outcomes, harms, quality of life' },
                    { id: 11, text: 'Are the benefits worth the harms and costs?', help: 'Consider: NNT, absolute risk, costs, patient values' }
                ]}
            ]
        },
        'cohort': {
            name: 'CASP Checklist for Cohort Studies',
            sections: [
                { title: 'Section A: Are the results of the study valid?', items: [
                    { id: 1, text: 'Did the study address a clearly focused issue?', screening: true, help: 'Consider: population, risk factors, outcome, whether cohort or nested case-control' },
                    { id: 2, text: 'Was the cohort recruited in an acceptable way?', screening: true, help: 'Consider: selection bias, how the cohort was identified and recruited' },
                    { id: 3, text: 'Was the exposure accurately measured to minimise bias?', help: 'Consider: subjective or objective measures, validation of measurement tools' },
                    { id: 4, text: 'Was the outcome accurately measured to minimise bias?', help: 'Consider: blinding of outcome assessors, objective vs subjective measures, validation' },
                    { id: 5, text: 'Have the authors identified all important confounding factors?', help: 'Consider: age, sex, socioeconomic status, other risk factors; list them' },
                    { id: 6, text: 'Have they taken account of the confounding factors in the design and/or analysis?', help: 'Consider: restriction, matching, stratification, regression, propensity scores' },
                    { id: 7, text: 'Was the follow up of subjects complete enough?', help: 'Consider: % lost to follow-up, reasons for loss, differences between groups' },
                    { id: 8, text: 'Was the follow up of subjects long enough?', help: 'Consider: adequate time for outcomes to develop' }
                ]},
                { title: 'Section B: What are the results?', items: [
                    { id: 9, text: 'What are the results of this study?', help: 'Consider: RR, HR, OR with confidence intervals, adjusted vs crude estimates' },
                    { id: 10, text: 'How precise are the results?', help: 'Consider: confidence intervals, variability, sample size' }
                ]},
                { title: 'Section C: Will the results help locally?', items: [
                    { id: 11, text: 'Do you believe the results?', help: 'Consider: Bradford Hill criteria for causation, biological plausibility, consistency with other evidence' },
                    { id: 12, text: 'Can the results be applied to the local population?', help: 'Consider: differences in population, setting, time period' },
                    { id: 13, text: 'Do the results of this study fit with other available evidence?', help: 'Consider: systematic reviews, other cohort studies, consistency' }
                ]}
            ]
        },
        'case-control': {
            name: 'CASP Checklist for Case-Control Studies',
            sections: [
                { title: 'Section A: Are the results of the study valid?', items: [
                    { id: 1, text: 'Did the study address a clearly focused issue?', screening: true, help: 'Consider: population, risk factor studied, whether the outcome is clearly defined' },
                    { id: 2, text: 'Did the authors use an appropriate method to answer their question?', screening: true, help: 'Consider: is case-control the right design, is it a rare outcome?' },
                    { id: 3, text: 'Were the cases recruited in an acceptable way?', help: 'Consider: are they representative, validated diagnosis, are they incident or prevalent' },
                    { id: 4, text: 'Were the controls selected in an acceptable way?', help: 'Consider: same population as cases, not people who would become cases, matching' },
                    { id: 5, text: 'Was the exposure accurately measured to minimise bias?', help: 'Consider: recall bias, same method for cases and controls, blinding of measurement' },
                    { id: 6, text: 'What confounding factors have the authors accounted for?', help: 'Consider: age, sex, other risk factors; list them and how controlled' },
                    { id: 7, text: 'Have the authors taken account of the potential confounding factors in the design and/or analysis?', help: 'Consider: restriction, matching, stratification, multivariate analysis' }
                ]},
                { title: 'Section B: What are the results?', items: [
                    { id: 8, text: 'What are the results of this study?', help: 'Consider: OR with confidence intervals, adjusted vs crude estimates, dose-response' },
                    { id: 9, text: 'How precise are the results? How precise is the estimate of risk?', help: 'Consider: confidence intervals, size of study' }
                ]},
                { title: 'Section C: Will the results help locally?', items: [
                    { id: 10, text: 'Do you believe the results?', help: 'Consider: strength of association, temporal relationship, consistency, plausibility' },
                    { id: 11, text: 'Can the results be applied to the local population?', help: 'Consider: population differences, is the exposure similar' }
                ]}
            ]
        },
        'systematic-review': {
            name: 'CASP Checklist for Systematic Reviews',
            sections: [
                { title: 'Section A: Are the results of the review valid?', items: [
                    { id: 1, text: 'Did the review address a clearly focused question?', screening: true, help: 'Consider: PICO components, type of study design included' },
                    { id: 2, text: 'Did the authors look for the right type of papers?', screening: true, help: 'Consider: study design appropriate to question, PICO addressed' },
                    { id: 3, text: 'Do you think all the important, relevant studies were included?', help: 'Consider: databases searched, reference lists, unpublished studies, non-English language, contact with experts' },
                    { id: 4, text: 'Did the review authors do enough to assess the quality of the included studies?', help: 'Consider: risk of bias tool used, quality assessment reported and used in analysis' },
                    { id: 5, text: 'If the results of the review have been combined, was it reasonable to do so?', help: 'Consider: heterogeneity (I-squared, chi-squared), forest plot inspection, pre-specified subgroups' }
                ]},
                { title: 'Section B: What are the results?', items: [
                    { id: 6, text: 'What are the overall results of the review?', help: 'Consider: pooled effect estimate, forest plot, weight of each study' },
                    { id: 7, text: 'How precise are the results?', help: 'Consider: confidence intervals, prediction interval' }
                ]},
                { title: 'Section C: Will the results help locally?', items: [
                    { id: 8, text: 'Can the results be applied to the local population?', help: 'Consider: populations, settings, interventions similar to yours' },
                    { id: 9, text: 'Were all important outcomes considered?', help: 'Consider: are benefits and harms both addressed, quality of life, costs' },
                    { id: 10, text: 'Are the benefits worth the harms and costs?', help: 'Consider: absolute effect sizes, NNT, cost-effectiveness, patient values' }
                ]}
            ]
        }
    };

    /* ================================================================
       NEW DATA: Jadad (Oxford Quality Scoring System)
       ================================================================ */

    var JADAD_ITEMS = [
        { id: 'jadad-1', text: 'Was the study described as randomised?', points: 1, category: 'Randomization' },
        { id: 'jadad-2', text: 'Was the method of randomisation appropriate (e.g., random number table, computer-generated)?', points: 1, bonus: true, category: 'Randomization', deductText: 'Deduct 1 point if the method of randomisation was inappropriate (e.g., allocation by date of birth, hospital number)' },
        { id: 'jadad-3', text: 'Was the study described as double-blind?', points: 1, category: 'Blinding' },
        { id: 'jadad-4', text: 'Was the method of blinding appropriate (e.g., identical placebo, active placebo)?', points: 1, bonus: true, category: 'Blinding', deductText: 'Deduct 1 point if the method of blinding was inappropriate (e.g., comparison of tablet vs injection with no double dummy)' },
        { id: 'jadad-5', text: 'Was there a description of withdrawals and dropouts?', points: 1, category: 'Withdrawals' }
    ];

    /* ================================================================
       NEW DATA: Enhanced Newcastle-Ottawa Scale (Cohort & Case-Control)
       ================================================================ */

    var NOS_DETAILED = {
        'cohort': {
            name: 'Newcastle-Ottawa Scale for Cohort Studies',
            maxStars: 9,
            sections: [
                {
                    name: 'Selection',
                    maxStars: 4,
                    items: [
                        {
                            label: 'Representativeness of the exposed cohort',
                            id: 'nos-coh-s1',
                            options: [
                                { text: 'Truly representative of the average in the community', star: true },
                                { text: 'Somewhat representative of the average in the community', star: true },
                                { text: 'Selected group of users (e.g., nurses, volunteers)', star: false },
                                { text: 'No description of the derivation of the cohort', star: false }
                            ]
                        },
                        {
                            label: 'Selection of the non-exposed cohort',
                            id: 'nos-coh-s2',
                            options: [
                                { text: 'Drawn from the same community as the exposed cohort', star: true },
                                { text: 'Drawn from a different source', star: false },
                                { text: 'No description of the derivation of the non-exposed cohort', star: false }
                            ]
                        },
                        {
                            label: 'Ascertainment of exposure',
                            id: 'nos-coh-s3',
                            options: [
                                { text: 'Secure record (e.g., surgical records)', star: true },
                                { text: 'Structured interview', star: true },
                                { text: 'Written self-report', star: false },
                                { text: 'No description', star: false }
                            ]
                        },
                        {
                            label: 'Demonstration that outcome of interest was not present at start of study',
                            id: 'nos-coh-s4',
                            options: [
                                { text: 'Yes', star: true },
                                { text: 'No', star: false }
                            ]
                        }
                    ]
                },
                {
                    name: 'Comparability',
                    maxStars: 2,
                    items: [
                        {
                            label: 'Comparability of cohorts on the basis of the design or analysis',
                            id: 'nos-coh-c1',
                            options: [
                                { text: 'Study controls for the most important factor', star: true },
                                { text: 'Study does not control for the most important factor', star: false }
                            ]
                        },
                        {
                            label: 'Study controls for any additional factor',
                            id: 'nos-coh-c2',
                            options: [
                                { text: 'Study controls for any additional factor (age, sex, etc.)', star: true },
                                { text: 'Study does not control for additional factors', star: false }
                            ]
                        }
                    ]
                },
                {
                    name: 'Outcome',
                    maxStars: 3,
                    items: [
                        {
                            label: 'Assessment of outcome',
                            id: 'nos-coh-o1',
                            options: [
                                { text: 'Independent blind assessment', star: true },
                                { text: 'Record linkage', star: true },
                                { text: 'Self-report', star: false },
                                { text: 'No description', star: false }
                            ]
                        },
                        {
                            label: 'Was follow-up long enough for outcomes to occur?',
                            id: 'nos-coh-o2',
                            options: [
                                { text: 'Yes (select an adequate follow-up period for the outcome)', star: true },
                                { text: 'No', star: false }
                            ]
                        },
                        {
                            label: 'Adequacy of follow-up of cohorts',
                            id: 'nos-coh-o3',
                            options: [
                                { text: 'Complete follow-up; all subjects accounted for', star: true },
                                { text: 'Subjects lost to follow-up unlikely to introduce bias (small number, or description provided)', star: true },
                                { text: 'Follow-up rate < 80% (or not described) and no description of those lost', star: false },
                                { text: 'No statement', star: false }
                            ]
                        }
                    ]
                }
            ]
        },
        'case-control': {
            name: 'Newcastle-Ottawa Scale for Case-Control Studies',
            maxStars: 9,
            sections: [
                {
                    name: 'Selection',
                    maxStars: 4,
                    items: [
                        {
                            label: 'Is the case definition adequate?',
                            id: 'nos-cc-s1',
                            options: [
                                { text: 'Yes, with independent validation', star: true },
                                { text: 'Yes, e.g. record linkage or based on self-reports', star: false },
                                { text: 'No description', star: false }
                            ]
                        },
                        {
                            label: 'Representativeness of the cases',
                            id: 'nos-cc-s2',
                            options: [
                                { text: 'Consecutive or obviously representative series of cases', star: true },
                                { text: 'Potential for selection biases or not stated', star: false }
                            ]
                        },
                        {
                            label: 'Selection of controls',
                            id: 'nos-cc-s3',
                            options: [
                                { text: 'Community controls', star: true },
                                { text: 'Hospital controls', star: false },
                                { text: 'No description', star: false }
                            ]
                        },
                        {
                            label: 'Definition of controls',
                            id: 'nos-cc-s4',
                            options: [
                                { text: 'No history of disease (endpoint)', star: true },
                                { text: 'No description of source', star: false }
                            ]
                        }
                    ]
                },
                {
                    name: 'Comparability',
                    maxStars: 2,
                    items: [
                        {
                            label: 'Comparability of cases and controls on the basis of the design or analysis',
                            id: 'nos-cc-c1',
                            options: [
                                { text: 'Study controls for the most important factor', star: true },
                                { text: 'Study does not control for the most important factor', star: false }
                            ]
                        },
                        {
                            label: 'Study controls for any additional factor',
                            id: 'nos-cc-c2',
                            options: [
                                { text: 'Study controls for any additional factor', star: true },
                                { text: 'Study does not control for additional factors', star: false }
                            ]
                        }
                    ]
                },
                {
                    name: 'Exposure',
                    maxStars: 3,
                    items: [
                        {
                            label: 'Ascertainment of exposure',
                            id: 'nos-cc-e1',
                            options: [
                                { text: 'Secure record (e.g., surgical records)', star: true },
                                { text: 'Structured interview where blind to case/control status', star: true },
                                { text: 'Interview not blinded to case/control status', star: false },
                                { text: 'Written self-report or medical record only', star: false },
                                { text: 'No description', star: false }
                            ]
                        },
                        {
                            label: 'Same method of ascertainment for cases and controls',
                            id: 'nos-cc-e2',
                            options: [
                                { text: 'Yes', star: true },
                                { text: 'No', star: false }
                            ]
                        },
                        {
                            label: 'Non-response rate',
                            id: 'nos-cc-e3',
                            options: [
                                { text: 'Same rate for both groups', star: true },
                                { text: 'Non-respondents described', star: false },
                                { text: 'Rate different and no designation', star: false }
                            ]
                        }
                    ]
                }
            ]
        }
    };

    /* ================================================================
       NEW DATA: Stored RoB assessments for visualization
       ================================================================ */

    var robStudies = [];
    var sofOutcomes = [];

    /* ================================================================
       RENDER
       ================================================================ */

    function render(container) {
        var html = App.createModuleLayout(
            'Critical Appraisal',
            'Interactive risk-of-bias and evidence quality assessment tools with algorithmic judgments.'
        );

        html += '<div class="card">';
        html += '<div class="tabs" id="ca-tabs">'
            + '<button class="tab active" data-tab="rob2" onclick="CritAppraisal.switchTool(\'rob2\')">RoB 2.0</button>'
            + '<button class="tab" data-tab="robins" onclick="CritAppraisal.switchTool(\'robins\')">ROBINS-I</button>'
            + '<button class="tab" data-tab="casp" onclick="CritAppraisal.switchTool(\'casp\')">CASP</button>'
            + '<button class="tab" data-tab="jadad" onclick="CritAppraisal.switchTool(\'jadad\')">Jadad</button>'
            + '<button class="tab" data-tab="nos" onclick="CritAppraisal.switchTool(\'nos\')">NOS</button>'
            + '<button class="tab" data-tab="nosdetail" onclick="CritAppraisal.switchTool(\'nosdetail\')">NOS (Detailed)</button>'
            + '<button class="tab" data-tab="amstar" onclick="CritAppraisal.switchTool(\'amstar\')">AMSTAR-2</button>'
            + '<button class="tab" data-tab="quadas" onclick="CritAppraisal.switchTool(\'quadas\')">QUADAS-2</button>'
            + '<button class="tab" data-tab="jbi" onclick="CritAppraisal.switchTool(\'jbi\')">JBI</button>'
            + '<button class="tab" data-tab="grade" onclick="CritAppraisal.switchTool(\'grade\')">GRADE</button>'
            + '<button class="tab" data-tab="gradedetail" onclick="CritAppraisal.switchTool(\'gradedetail\')">GRADE (Profile)</button>'
            + '<button class="tab" data-tab="sof" onclick="CritAppraisal.switchTool(\'sof\')">SoF Table</button>'
            + '<button class="tab" data-tab="robviz" onclick="CritAppraisal.switchTool(\'robviz\')">RoB Visualization</button>'
            + '</div>';

        // ==== RoB 2.0 ====
        html += '<div class="tab-content active" id="tab-rob2">';
        html += '<div class="card-subtitle">Cochrane Risk of Bias 2.0 -- Assess 5 domains with signaling questions</div>';
        html += '<div class="form-group"><label class="form-label">Study Name</label><input type="text" class="form-input" id="ca-study-name" placeholder="e.g., NINDS 1995"></div>';

        References.rob2.domains.forEach(function(domain) {
            html += '<div class="checklist-domain">';
            html += '<div class="checklist-domain-title"><span class="traffic-dot" id="ca-dot-' + domain.id + '"></span>' + domain.id + ': ' + domain.name + '</div>';

            domain.questions.forEach(function(q, qi) {
                var qId = domain.id + '_q' + qi;
                html += '<div class="checklist-question">';
                html += '<div class="checklist-question-text">' + q + '</div>';
                html += '<div class="radio-group">';
                ['Yes', 'Probably Yes', 'Probably No', 'No', 'No Information'].forEach(function(opt) {
                    html += '<label class="radio-pill"><input type="radio" name="ca-' + qId + '" value="' + opt + '" onchange="CritAppraisal.updateRoB()">' + opt + '</label>';
                });
                html += '</div></div>';
            });

            html += '<div class="flex items-center gap-1 mt-1">'
                + '<span style="font-size:0.8rem;color:var(--text-tertiary)">Domain Judgment:</span>'
                + '<span class="risk-badge" id="ca-judgment-' + domain.id + '">Not assessed</span>'
                + '</div>';
            html += '</div>';
        });

        html += '<div class="result-panel mt-2" id="ca-rob2-overall">'
            + '<div class="card-title">Overall Risk of Bias</div>'
            + '<div class="traffic-light" id="ca-rob2-traffic"></div>'
            + '<div class="result-detail mt-1" id="ca-rob2-summary">Complete all domains to see overall judgment</div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportRoB()">Export Assessment</button>'
            + '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.resetRoB()">Reset</button>'
            + '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.saveRoB()">Save to Browser</button>'
            + '<button class="btn btn-primary btn-sm" onclick="CritAppraisal.addToRoBViz()">Add to Visualization</button>'
            + '</div>';
        html += '</div>';

        // ==== ROBINS-I (NEW) ====
        html += '<div class="tab-content" id="tab-robins">';
        html += renderROBINSI();
        html += '</div>';

        // ==== CASP ====
        html += '<div class="tab-content" id="tab-casp">';
        html += renderCASP();
        html += '</div>';

        // ==== Jadad ====
        html += '<div class="tab-content" id="tab-jadad">';
        html += renderJadad();
        html += '</div>';

        // ==== NOS ====
        html += '<div class="tab-content" id="tab-nos">';
        html += '<div class="card-subtitle">Newcastle-Ottawa Scale for Observational Studies</div>';
        html += renderNOS();
        html += '</div>';

        // ==== NOS Detailed ====
        html += '<div class="tab-content" id="tab-nosdetail">';
        html += renderNOSDetailed();
        html += '</div>';

        // ==== AMSTAR-2 ====
        html += '<div class="tab-content" id="tab-amstar">';
        html += '<div class="card-subtitle">AMSTAR-2 -- Systematic Review Quality Assessment</div>';
        html += renderAMSTAR();
        html += '</div>';

        // ==== QUADAS-2 ====
        html += '<div class="tab-content" id="tab-quadas">';
        html += '<div class="card-subtitle">QUADAS-2 -- Diagnostic Accuracy Studies</div>';
        html += renderQUADAS();
        html += '</div>';

        // ==== JBI (NEW) ====
        html += '<div class="tab-content" id="tab-jbi">';
        html += renderJBI();
        html += '</div>';

        // ==== GRADE ====
        html += '<div class="tab-content" id="tab-grade">';
        html += '<div class="card-subtitle">GRADE Evidence Assessment -- Rate certainty of evidence</div>';
        html += renderGRADE();
        html += '</div>';

        // ==== GRADE Evidence Profile (DETAILED) ====
        html += '<div class="tab-content" id="tab-gradedetail">';
        html += renderGRADEProfile();
        html += '</div>';

        // ==== Summary of Findings Table (NEW) ====
        html += '<div class="tab-content" id="tab-sof">';
        html += renderSoF();
        html += '</div>';

        // ==== RoB Visualization (NEW) ====
        html += '<div class="tab-content" id="tab-robviz">';
        html += renderRoBViz();
        html += '</div>';

        html += '</div>'; // close card

        // ===== LEARN SECTION =====
        html += '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Learn: Critical Appraisal Essentials</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';

        html += '<div class="card-subtitle" style="font-weight:600;">Appraisal Tools Overview</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Cochrane RoB 2:</strong> Risk of bias in randomized trials (5 domains)</li>'
            + '<li><strong>ROBINS-I:</strong> Risk of bias in non-randomized studies of interventions (7 domains)</li>'
            + '<li><strong>CASP Checklists:</strong> Critical Appraisal Skills Programme -- structured checklists for RCTs, cohort, case-control, and systematic reviews</li>'
            + '<li><strong>Jadad Scale:</strong> Oxford Quality Scoring System (0-5) for RCT quality: randomization, blinding, withdrawals</li>'
            + '<li><strong>Newcastle-Ottawa Scale:</strong> Non-randomized studies (selection, comparability, outcome) -- basic and detailed versions</li>'
            + '<li><strong>JBI Checklists:</strong> Study-type-specific quality assessment (cohort, case-control, cross-sectional, RCT)</li>'
            + '<li><strong>GRADE:</strong> Overall evidence certainty (high/moderate/low/very low) -- basic and detailed profile versions</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">ROBINS-I vs RoB 2</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>RoB 2 is for randomized trials; ROBINS-I is for non-randomized studies</li>'
            + '<li>ROBINS-I has 7 domains vs 5 for RoB 2</li>'
            + '<li>ROBINS-I judgments: Low / Moderate / Serious / Critical / No Information</li>'
            + '<li>Overall ROBINS-I judgment is driven by worst domain (most conservative)</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">CASP Checklists</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>CASP provides study-type-specific checklists with Yes / No / Can\'t Tell responses</li>'
            + '<li>First 2 questions are "screening" questions -- proceed only if both are "Yes"; if either is "No", consider whether further appraisal is worthwhile</li>'
            + '<li>Sections cover: validity, results, and applicability</li>'
            + '<li>Widely used in journal clubs, systematic reviews, and evidence-based practice</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Jadad Scale</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>Simple 0-5 scale for RCT quality (also called Oxford Quality Scoring System)</li>'
            + '<li>Assesses: (1) randomization described, (2) appropriate method, (3) blinding described, (4) appropriate method, (5) withdrawals reported</li>'
            + '<li>Score >= 3 generally indicates adequate quality</li>'
            + '<li>Items 2 and 4 can add or subtract a point depending on appropriateness of method</li>'
            + '<li>Limitation: does not assess allocation concealment or intention-to-treat analysis</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Newcastle-Ottawa Scale (Detailed)</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>Stars awarded across Selection, Comparability, and Outcome/Exposure sections</li>'
            + '<li>Cohort studies: Selection (4 stars), Comparability (2), Outcome (3) = max 9</li>'
            + '<li>Case-control studies: Selection (4 stars), Comparability (2), Exposure (3) = max 9</li>'
            + '<li>Common total-star heuristic (not part of the NOS itself): >= 7 good, 5-6 fair, < 5 poor. The AHRQ good/fair/poor standard is domain-based (e.g., "good" requires adequate stars in every domain), not a simple total</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">GRADE Domains</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>Risk of bias \u2192 downgrade if serious limitations</li>'
            + '<li>Inconsistency \u2192 downgrade if I\u00B2 > 50% or conflicting results</li>'
            + '<li>Indirectness \u2192 downgrade if PICO differs from evidence</li>'
            + '<li>Imprecision \u2192 downgrade if CI crosses clinical threshold</li>'
            + '<li>Publication bias \u2192 downgrade if funnel plot asymmetry or selective reporting</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Summary of Findings Tables</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>SoF tables present GRADE evidence profiles for key outcomes</li>'
            + '<li>Include: outcome, N studies, N participants, effect estimate (95% CI), GRADE certainty</li>'
            + '<li>Footnotes explain rationale for downgrading/upgrading</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;">'
            + '<li>Sterne JAC, et al. RoB 2: revised tool for assessing risk of bias. <em>BMJ</em>. 2019;366:l4898.</li>'
            + '<li>Sterne JA, et al. ROBINS-I: assessing risk of bias in non-randomised studies. <em>BMJ</em>. 2016;355:i4919.</li>'
            + '<li>Guyatt GH, et al. GRADE guidelines. <em>J Clin Epidemiol</em>. 2011;64:383-94.</li>'
            + '<li>Moola S, et al. JBI Manual for Evidence Synthesis. 2020.</li>'
            + '<li>CASP (Critical Appraisal Skills Programme). CASP Checklists. <a href="https://casp-uk.net/casp-tools-checklists/" target="_blank" style="color:var(--primary)">casp-uk.net</a>.</li>'
            + '<li>Jadad AR, et al. Assessing the quality of reports of randomized clinical trials. <em>Control Clin Trials</em>. 1996;17(1):1-12.</li>'
            + '<li>Wells GA, et al. The Newcastle-Ottawa Scale for assessing the quality of nonrandomised studies in meta-analyses. Ottawa Hospital Research Institute. 2000.</li>'
            + '</ul>';
        html += '</div></div>';

        App.setTrustedHTML(container, html);
    }

    /* ================================================================
       ROBINS-I TAB (NEW)
       ================================================================ */

    function renderROBINSI() {
        var html = '<div class="card-subtitle">ROBINS-I -- Risk Of Bias In Non-randomized Studies of Interventions (7 domains)</div>';
        html += '<div class="form-group"><label class="form-label">Study Name</label><input type="text" class="form-input" id="ca-robins-study" placeholder="e.g., Author 2020"></div>';

        ROBINS_I.domains.forEach(function(domain) {
            html += '<div class="checklist-domain">';
            html += '<div class="checklist-domain-title"><span class="traffic-dot" id="ca-robins-dot-' + domain.id + '"></span>' + domain.id.replace('RI-', '') + ': ' + domain.name + '</div>';

            domain.questions.forEach(function(q, qi) {
                var qId = domain.id + '_q' + qi;
                html += '<div class="checklist-question">';
                html += '<div class="checklist-question-text">' + q + '</div>';
                html += '<div class="radio-group">';
                ['Yes', 'Probably Yes', 'Probably No', 'No', 'No Information'].forEach(function(opt) {
                    html += '<label class="radio-pill"><input type="radio" name="ca-robins-' + qId + '" value="' + opt + '" onchange="CritAppraisal.updateROBINS()">' + opt + '</label>';
                });
                html += '</div></div>';
            });

            html += '<div class="flex items-center gap-1 mt-1">'
                + '<span style="font-size:0.8rem;color:var(--text-tertiary)">Domain Judgment:</span>'
                + '<select class="form-select" id="ca-robins-judgment-' + domain.id + '" style="width:150px;height:30px;font-size:0.8rem" onchange="CritAppraisal.updateROBINSOverall()">';
            ROBINS_I.judgmentOptions.forEach(function(opt) {
                html += '<option value="' + opt + '">' + opt + '</option>';
            });
            html += '</select></div>';
            html += '</div>';
        });

        html += '<div class="result-panel mt-2" id="ca-robins-overall">'
            + '<div class="card-title">Overall ROBINS-I Judgment</div>'
            + '<div class="result-value" id="ca-robins-overall-level" style="font-size:1.3rem">Not Assessed</div>'
            + '<div class="result-detail mt-1" id="ca-robins-overall-text">Complete all domain judgments to see overall assessment</div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportROBINS()">Export ROBINS-I</button>'
            + '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.resetROBINS()">Reset</button>'
            + '</div>';
        return html;
    }

    function updateROBINS() {
        // Auto-suggest domain judgments based on signaling questions
        ROBINS_I.domains.forEach(function(domain) {
            var answers = [];
            domain.questions.forEach(function(q, qi) {
                var sel = document.querySelector('input[name="ca-robins-' + domain.id + '_q' + qi + '"]:checked');
                if (sel) answers.push(sel.value);
            });

            var dot = document.getElementById('ca-robins-dot-' + domain.id);
            if (answers.length === domain.questions.length) {
                // Directionality per the published ROBINS-I signalling questions:
                // 'yes' = a Yes answer indicates possible bias; 'no' = a No answer does.
                // Softened questions suggest at most Moderate (e.g., potential for
                // confounding is expected in nearly every non-randomized study).
                var DIRS = {
                    'RI-D1': { dir: ['yes', 'yes', 'yes', 'no', 'no', 'yes'], soft: [0, 1] },
                    'RI-D2': { dir: ['yes', 'no', 'no'], soft: [2] },
                    'RI-D3': { dir: ['no', 'no', 'yes'], soft: [] },
                    'RI-D4': { dir: ['yes', 'no', 'no', 'no'], soft: [] },
                    'RI-D5': { dir: ['no', 'yes', 'yes', 'no', 'no'], soft: [3, 4] },
                    'RI-D6': { dir: ['yes', 'yes', 'no', 'yes'], soft: [1] },
                    'RI-D7': { dir: ['yes', 'yes', 'yes'], soft: [] }
                };
                var conf = DIRS[domain.id];
                var strongBias = false, probBias = false, hasNI = false;
                answers.forEach(function(a, qi) {
                    if (a === 'No Information') { hasNI = true; return; }
                    var d = conf.dir[qi];
                    var exact = (d === 'yes' && a === 'Yes') || (d === 'no' && a === 'No');
                    var prob = (d === 'yes' && a === 'Probably Yes') || (d === 'no' && a === 'Probably No');
                    if (!exact && !prob) return;
                    if (exact && conf.soft.indexOf(qi) === -1) strongBias = true;
                    else probBias = true;
                });
                // Nearly-complete outcome data makes the missing-data domain low-risk
                if (domain.id === 'RI-D5' && (answers[0] === 'Yes' || answers[0] === 'Probably Yes')) {
                    strongBias = false; probBias = false;
                }

                var suggested = 'Low';
                if (strongBias) suggested = 'Serious';
                else if (probBias) suggested = 'Moderate';
                else if (hasNI) suggested = 'No Information';

                // Auto-set the domain judgment dropdown
                var judg = document.getElementById('ca-robins-judgment-' + domain.id);
                if (judg) judg.value = suggested;

                if (dot) {
                    dot.className = 'traffic-dot';
                    if (suggested === 'Low') dot.className += ' traffic-dot--low';
                    else if (suggested === 'Moderate') dot.className += ' traffic-dot--some';
                    else if (suggested === 'Serious' || suggested === 'Critical') dot.className += ' traffic-dot--high';
                    else dot.className += ' traffic-dot--unclear';
                }
            } else if (dot) {
                dot.className = 'traffic-dot traffic-dot--unclear';
            }
        });

        updateROBINSOverall();
    }

    function updateROBINSOverall() {
        var judgments = [];
        ROBINS_I.domains.forEach(function(domain) {
            var judg = document.getElementById('ca-robins-judgment-' + domain.id);
            if (judg) judgments.push(judg.value);
        });

        // ROBINS-I overall: worst domain drives overall
        var colorMap = { 'Low': 'var(--success)', 'Moderate': 'var(--warning)', 'Serious': 'var(--danger)', 'Critical': '#dc2626', 'No Information': 'var(--text-secondary)' };
        var severity = { 'Low': 0, 'Moderate': 1, 'Serious': 2, 'Critical': 3, 'No Information': -1 };

        var worst = 'Low';
        var worstScore = 0;
        var hasNI = false;
        judgments.forEach(function(j) {
            if (j === 'No Information') { hasNI = true; return; }
            if (severity[j] > worstScore) { worstScore = severity[j]; worst = j; }
        });

        if (hasNI && worstScore < 2) worst = 'No Information';

        var el = document.getElementById('ca-robins-overall-level');
        if (el) { el.textContent = worst; el.style.color = colorMap[worst] || 'var(--text-secondary)'; }

        var textEl = document.getElementById('ca-robins-overall-text');
        if (textEl) {
            if (worst === 'Low') textEl.textContent = 'Study is comparable to a well-performed randomized trial with respect to this outcome.';
            else if (worst === 'Moderate') textEl.textContent = 'Study provides sound evidence but cannot be considered comparable to a well-performed randomized trial.';
            else if (worst === 'Serious') textEl.textContent = 'Study has some important problems in one or more domains.';
            else if (worst === 'Critical') textEl.textContent = 'Study is too problematic to provide useful evidence on the effect of intervention.';
            else textEl.textContent = 'Insufficient information to assess risk of bias for one or more key domains.';
        }
    }

    function exportROBINS() {
        var study = document.getElementById('ca-robins-study').value || 'Unknown Study';
        var text = 'ROBINS-I Assessment: ' + study + '\n\n';
        ROBINS_I.domains.forEach(function(domain) {
            var judg = document.getElementById('ca-robins-judgment-' + domain.id);
            text += domain.id.replace('RI-', '') + ' - ' + domain.name + ': ' + (judg ? judg.value : 'Not assessed') + '\n';
        });
        var overall = document.getElementById('ca-robins-overall-level');
        text += '\nOverall: ' + (overall ? overall.textContent : 'Not assessed');
        Export.copyText(text);
    }

    function resetROBINS() {
        document.querySelectorAll('input[name^="ca-robins-"]:checked').forEach(function(el) { el.checked = false; });
        ROBINS_I.domains.forEach(function(domain) {
            var judg = document.getElementById('ca-robins-judgment-' + domain.id);
            if (judg) judg.value = 'Low';
            var dot = document.getElementById('ca-robins-dot-' + domain.id);
            if (dot) dot.className = 'traffic-dot traffic-dot--unclear';
        });
        var el = document.getElementById('ca-robins-overall-level');
        if (el) { el.textContent = 'Not Assessed'; el.style.color = 'var(--text-secondary)'; }
    }

    /* ================================================================
       JBI TAB (NEW)
       ================================================================ */

    function renderJBI() {
        var html = '<div class="card-subtitle">JBI Critical Appraisal Checklists -- Select study type and assess each item</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Study Type</label>';
        html += '<select class="form-select" id="ca-jbi-type" name="ca-jbi-type" onchange="CritAppraisal.loadJBI()">';
        html += '<option value="">-- Select --</option>';
        var jbiKeys = Object.keys(JBI_CHECKLISTS);
        for (var jk = 0; jk < jbiKeys.length; jk++) {
            html += '<option value="' + jbiKeys[jk] + '">' + JBI_CHECKLISTS[jbiKeys[jk]].name + '</option>';
        }
        html += '</select></div>';
        html += '<div class="form-group"><label class="form-label">Study Name</label>';
        html += '<input type="text" class="form-input" id="ca-jbi-study" placeholder="e.g., Smith 2022"></div>';
        html += '</div>';

        html += '<div id="ca-jbi-items"></div>';
        html += '<div id="ca-jbi-result" class="mt-2"></div>';
        return html;
    }

    function loadJBI() {
        var type = document.getElementById('ca-jbi-type').value;
        var itemsEl = document.getElementById('ca-jbi-items');
        var resultEl = document.getElementById('ca-jbi-result');
        App.setTrustedHTML(resultEl, '');

        if (!type || !JBI_CHECKLISTS[type]) {
            App.setTrustedHTML(itemsEl, '');
            return;
        }

        var checklist = JBI_CHECKLISTS[type];
        var html = '<div class="card-title mt-1">' + checklist.name + '</div>';

        checklist.items.forEach(function(item, i) {
            html += '<div class="checklist-question" style="padding:8px 0;border-bottom:1px solid var(--border)">';
            html += '<div class="checklist-question-text">' + (i + 1) + '. ' + item + '</div>';
            html += '<div class="radio-group">';
            ['Yes', 'No', 'Unclear', 'Not Applicable'].forEach(function(opt) {
                html += '<label class="radio-pill"><input type="radio" name="ca-jbi-item-' + i + '" value="' + opt + '" onchange="CritAppraisal.updateJBI()">' + opt + '</label>';
            });
            html += '</div></div>';
        });

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportJBI()">Export JBI Assessment</button>';
        html += '</div>';

        App.setTrustedHTML(itemsEl, html);
    }

    function updateJBI() {
        var type = document.getElementById('ca-jbi-type').value;
        if (!type || !JBI_CHECKLISTS[type]) return;

        var checklist = JBI_CHECKLISTS[type];
        var yesCount = 0;
        var totalApplicable = 0;
        var answered = 0;

        for (var i = 0; i < checklist.items.length; i++) {
            var sel = document.querySelector('input[name="ca-jbi-item-' + i + '"]:checked');
            if (sel) {
                answered++;
                if (sel.value !== 'Not Applicable') {
                    totalApplicable++;
                    if (sel.value === 'Yes') yesCount++;
                }
            }
        }

        if (answered < checklist.items.length) return;

        // Note: JBI leaves inclusion thresholds to the reviewers' a-priori
        // decision; these percentage cutoffs are an unofficial heuristic.
        var pct = totalApplicable > 0 ? (yesCount / totalApplicable * 100) : 0;
        var rating, color;
        if (pct >= 70) { rating = 'Consider Include (unofficial heuristic: >=70% yes)'; color = 'var(--success)'; }
        else if (pct >= 50) { rating = 'Consider Include with Caution (unofficial heuristic: 50-69% yes)'; color = 'var(--warning)'; }
        else { rating = 'Consider Exclude (unofficial heuristic: <50% yes)'; color = 'var(--danger)'; }

        var resultEl = document.getElementById('ca-jbi-result');
        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value" style="color:' + color + '">' + rating + '</div>';
        html += '<div class="result-label">JBI Quality Rating</div>';
        html += '<div class="result-detail mt-1">' + yesCount + ' / ' + totalApplicable + ' applicable items answered "Yes" (' + pct.toFixed(0) + '%)</div>';

        // Color-coded bar
        html += '<div style="margin-top:0.8rem;background:var(--bg-offset);border-radius:8px;height:24px;overflow:hidden;position:relative">';
        html += '<div style="width:' + pct + '%;height:100%;background:' + color + ';border-radius:8px;transition:width 0.4s"></div>';
        html += '<div style="position:absolute;top:0;left:50%;transform:translateX(-50%);line-height:24px;font-size:0.75rem;font-weight:600">' + pct.toFixed(0) + '%</div>';
        html += '</div>';

        html += '</div>';
        App.setTrustedHTML(resultEl, html);
    }

    function exportJBI() {
        var type = document.getElementById('ca-jbi-type').value;
        var study = document.getElementById('ca-jbi-study').value || 'Unknown Study';
        if (!type || !JBI_CHECKLISTS[type]) return;

        var checklist = JBI_CHECKLISTS[type];
        var text = checklist.name + ': ' + study + '\n\n';
        for (var i = 0; i < checklist.items.length; i++) {
            var sel = document.querySelector('input[name="ca-jbi-item-' + i + '"]:checked');
            text += (i + 1) + '. ' + checklist.items[i] + ': ' + (sel ? sel.value : 'Not assessed') + '\n';
        }
        Export.copyText(text);
    }

    /* ================================================================
       CASP CHECKLISTS
       ================================================================ */

    function renderCASP() {
        var html = '<div class="card-subtitle">CASP (Critical Appraisal Skills Programme) Checklists -- Structured appraisal with Yes / No / Can\'t Tell scoring</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Study Type</label>';
        html += '<select class="form-select" id="ca-casp-type" name="ca-casp-type" onchange="CritAppraisal.loadCASP()">';
        html += '<option value="">-- Select Study Type --</option>';
        var caspKeys = Object.keys(CASP_CHECKLISTS);
        for (var ck = 0; ck < caspKeys.length; ck++) {
            html += '<option value="' + caspKeys[ck] + '">' + CASP_CHECKLISTS[caspKeys[ck]].name + '</option>';
        }
        html += '</select></div>';
        html += '<div class="form-group"><label class="form-label">Study Reference</label>';
        html += '<input type="text" class="form-input" id="ca-casp-study" placeholder="e.g., Author et al. (Year)"></div>';
        html += '</div>';

        html += '<div id="ca-casp-items"></div>';
        html += '<div id="ca-casp-result" class="mt-2"></div>';
        return html;
    }

    function loadCASP() {
        var type = document.getElementById('ca-casp-type').value;
        var itemsEl = document.getElementById('ca-casp-items');
        var resultEl = document.getElementById('ca-casp-result');
        App.setTrustedHTML(resultEl, '');

        if (!type || !CASP_CHECKLISTS[type]) {
            App.setTrustedHTML(itemsEl, '');
            return;
        }

        var checklist = CASP_CHECKLISTS[type];
        var html = '<div class="card-title mt-1">' + checklist.name + '</div>';

        checklist.sections.forEach(function(section) {
            html += '<div class="checklist-domain">';
            html += '<div class="checklist-domain-title">' + section.title + '</div>';

            section.items.forEach(function(item) {
                html += '<div class="checklist-question" style="padding:8px 0;border-bottom:1px solid var(--border)">';
                html += '<div class="checklist-question-text">';
                if (item.screening) {
                    html += '<span class="risk-badge risk-badge--some" style="font-size:0.6rem;margin-right:4px">SCREENING</span>';
                }
                html += item.id + '. ' + item.text + '</div>';
                if (item.help) {
                    html += '<div style="font-size:0.78rem;color:var(--text-tertiary);margin:4px 0 6px 0;font-style:italic">' + item.help + '</div>';
                }
                html += '<div class="radio-group">';
                ['Yes', 'No', 'Can\'t Tell'].forEach(function(opt) {
                    html += '<label class="radio-pill"><input type="radio" name="ca-casp-q-' + item.id + '" value="' + opt + '" onchange="CritAppraisal.updateCASP()">' + opt + '</label>';
                });
                html += '</div></div>';
            });

            html += '</div>';
        });

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportCASP()">Export CASP Assessment</button>';
        html += '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.resetCASP()">Reset</button>';
        html += '</div>';

        App.setTrustedHTML(itemsEl, html);
    }

    function updateCASP() {
        var type = document.getElementById('ca-casp-type').value;
        if (!type || !CASP_CHECKLISTS[type]) return;

        var checklist = CASP_CHECKLISTS[type];
        var totalItems = 0;
        var yesCount = 0;
        var noCount = 0;
        var cantTellCount = 0;
        var answered = 0;
        var screeningFailed = false;

        var checkedInputs = document.querySelectorAll('input[name^="ca-casp-q-"]:checked');
        var checkedMap = {};
        for (var c = 0; c < checkedInputs.length; c++) {
            var inp = checkedInputs[c];
            checkedMap[inp.name] = inp;
        }

        checklist.sections.forEach(function(section) {
            section.items.forEach(function(item) {
                totalItems++;
                var sel = checkedMap['ca-casp-q-' + item.id];
                if (sel) {
                    answered++;
                    if (sel.value === 'Yes') yesCount++;
                    else if (sel.value === 'No') {
                        noCount++;
                        if (item.screening) screeningFailed = true;
                    }
                    else cantTellCount++;
                }
            });
        });

        if (answered < totalItems) {
            var resultEl = document.getElementById('ca-casp-result');
            if (answered > 0) {
                var partialHtml = '<div class="result-panel">';
                partialHtml += '<div class="result-detail">Answered ' + answered + ' of ' + totalItems + ' questions. Yes: ' + yesCount + ', No: ' + noCount + ', Can\'t Tell: ' + cantTellCount + '</div>';
                partialHtml += '</div>';
                App.setTrustedHTML(resultEl, partialHtml);
            }
            return;
        }

        var pct = (yesCount / totalItems * 100);
        var rating, color, explanation;

        if (screeningFailed) {
            rating = 'Major Concerns';
            color = 'var(--danger)';
            explanation = 'One or more screening questions answered "No" -- consider stopping the appraisal. The study may not be worth appraising further.';
        } else if (noCount === 0 && cantTellCount === 0) {
            rating = 'High Quality';
            color = 'var(--success)';
            explanation = 'All items answered "Yes". The study meets all CASP quality criteria.';
        } else if (noCount === 0 && cantTellCount <= 2) {
            rating = 'Good Quality';
            color = 'var(--success)';
            explanation = 'No "No" answers, but ' + cantTellCount + ' item(s) uncertain. Overall methodological quality is good.';
        } else if (noCount <= 2) {
            rating = 'Moderate Quality';
            color = 'var(--warning)';
            explanation = noCount + ' weakness(es) identified and ' + cantTellCount + ' uncertain item(s). Interpret results with caution.';
        } else {
            rating = 'Low Quality';
            color = 'var(--danger)';
            explanation = noCount + ' weaknesses identified. Significant methodological concerns -- results may not be reliable.';
        }

        var resultEl = document.getElementById('ca-casp-result');
        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value" style="color:' + color + '">' + rating + '</div>';
        html += '<div style="font-size:0.75rem;color:var(--text-tertiary);margin-top:2px;">Unofficial summary rating &mdash; CASP itself does not define a scoring system; use the itemized answers to inform judgement.</div>';
        html += '<div class="result-label">CASP Quality Assessment</div>';
        html += '<div class="result-detail mt-1">' + explanation + '</div>';

        // Score breakdown
        html += '<div style="margin-top:1rem">';
        html += '<div class="table-scroll-wrap"><table style="width:100%;border-collapse:collapse;font-size:0.82rem">';
        html += '<thead><tr style="border-bottom:2px solid var(--border-color);background:var(--bg-offset)">';
        html += '<th style="padding:6px 8px;text-align:left">Response</th>';
        html += '<th style="padding:6px 8px;text-align:center">Count</th>';
        html += '<th style="padding:6px 8px;text-align:center">Percentage</th>';
        html += '</tr></thead><tbody>';

        html += '<tr style="border-bottom:1px solid var(--border-color)"><td style="padding:6px 8px"><span style="color:var(--success);font-weight:600">Yes</span></td>';
        html += '<td style="padding:6px 8px;text-align:center">' + yesCount + '</td>';
        html += '<td style="padding:6px 8px;text-align:center">' + pct.toFixed(0) + '%</td></tr>';

        html += '<tr style="border-bottom:1px solid var(--border-color)"><td style="padding:6px 8px"><span style="color:var(--danger);font-weight:600">No</span></td>';
        html += '<td style="padding:6px 8px;text-align:center">' + noCount + '</td>';
        html += '<td style="padding:6px 8px;text-align:center">' + (noCount / totalItems * 100).toFixed(0) + '%</td></tr>';

        html += '<tr style="border-bottom:1px solid var(--border-color)"><td style="padding:6px 8px"><span style="color:var(--text-secondary);font-weight:600">Can\'t Tell</span></td>';
        html += '<td style="padding:6px 8px;text-align:center">' + cantTellCount + '</td>';
        html += '<td style="padding:6px 8px;text-align:center">' + (cantTellCount / totalItems * 100).toFixed(0) + '%</td></tr>';

        html += '</tbody></table></div>';

        // Progress bar
        html += '<div style="margin-top:0.8rem;background:var(--bg-offset);border-radius:8px;height:24px;overflow:hidden;position:relative;display:flex">';
        var yesPct = (yesCount / totalItems * 100);
        var noPct = (noCount / totalItems * 100);
        var ctPct = (cantTellCount / totalItems * 100);
        html += '<div style="width:' + yesPct + '%;height:100%;background:var(--success);transition:width 0.4s"></div>';
        html += '<div style="width:' + ctPct + '%;height:100%;background:var(--text-tertiary);transition:width 0.4s"></div>';
        html += '<div style="width:' + noPct + '%;height:100%;background:var(--danger);transition:width 0.4s"></div>';
        html += '</div>';
        html += '<div style="display:flex;justify-content:space-between;font-size:0.72rem;margin-top:4px;color:var(--text-tertiary)">';
        html += '<span>Yes (' + yesCount + ')</span><span>Can\'t Tell (' + cantTellCount + ')</span><span>No (' + noCount + ')</span>';
        html += '</div>';

        html += '</div>';
        html += '</div>';
        App.setTrustedHTML(resultEl, html);
    }

    function exportCASP() {
        var type = document.getElementById('ca-casp-type').value;
        var study = document.getElementById('ca-casp-study').value || 'Unknown Study';
        if (!type || !CASP_CHECKLISTS[type]) return;

        var checklist = CASP_CHECKLISTS[type];
        var text = checklist.name + '\nStudy: ' + study + '\n\n';

        checklist.sections.forEach(function(section) {
            text += section.title + '\n';
            section.items.forEach(function(item) {
                var sel = document.querySelector('input[name="ca-casp-q-' + item.id + '"]:checked');
                text += '  ' + item.id + '. ' + item.text + ': ' + (sel ? sel.value : 'Not assessed') + '\n';
            });
            text += '\n';
        });

        // Get result
        var resultEl = document.getElementById('ca-casp-result');
        if (resultEl) {
            var ratingEl = resultEl.querySelector('.result-value');
            if (ratingEl) text += 'Overall: ' + ratingEl.textContent + '\n';
        }

        Export.copyText(text);
    }

    function resetCASP() {
        var type = document.getElementById('ca-casp-type').value;
        if (!type || !CASP_CHECKLISTS[type]) return;

        var checklist = CASP_CHECKLISTS[type];
        checklist.sections.forEach(function(section) {
            section.items.forEach(function(item) {
                var radios = document.querySelectorAll('input[name="ca-casp-q-' + item.id + '"]');
                radios.forEach(function(r) { r.checked = false; });
            });
        });
        App.setTrustedHTML(document.getElementById('ca-casp-result'), '');
    }

    /* ================================================================
       JADAD SCORE CALCULATOR
       ================================================================ */

    function renderJadad() {
        var html = '<div class="card-subtitle">Jadad Scale (Oxford Quality Scoring System) -- Assess RCT quality on a 0-5 scale based on randomization, blinding, and withdrawals.</div>';

        html += '<div class="form-group"><label class="form-label">Study Reference</label>';
        html += '<input type="text" class="form-input" id="ca-jadad-study" placeholder="e.g., Author et al. (Year)"></div>';

        html += '<div class="card-title mt-1">Jadad Scoring Items</div>';
        html += '<div style="font-size:0.82rem;color:var(--text-tertiary);margin-bottom:1rem">The Jadad scale awards 0-5 points. A score of 3+ indicates adequate quality. Items 2 and 4 are bonus/penalty items: award the point if the method is appropriate, deduct if inappropriate.</div>';

        JADAD_ITEMS.forEach(function(item, idx) {
            html += '<div class="checklist-question" style="padding:10px 0;border-bottom:1px solid var(--border)">';
            html += '<div class="checklist-question-text">';
            html += '<span class="risk-badge risk-badge--low" style="font-size:0.6rem;margin-right:4px">' + item.category.toUpperCase() + '</span>';
            html += (idx + 1) + '. ' + item.text;
            html += '</div>';
            if (item.bonus) {
                html += '<div style="font-size:0.78rem;color:var(--text-tertiary);margin:4px 0 6px 0;font-style:italic">' + item.deductText + '</div>';
            }
            html += '<div class="radio-group">';
            if (item.bonus) {
                ['Appropriate (+1)', 'Inappropriate (-1)', 'Not described (0)'].forEach(function(opt) {
                    html += '<label class="radio-pill"><input type="radio" name="ca-' + item.id + '" value="' + opt + '" onchange="CritAppraisal.updateJadad()">' + opt + '</label>';
                });
            } else {
                ['Yes (+1)', 'No (0)'].forEach(function(opt) {
                    html += '<label class="radio-pill"><input type="radio" name="ca-' + item.id + '" value="' + opt + '" onchange="CritAppraisal.updateJadad()">' + opt + '</label>';
                });
            }
            html += '</div></div>';
        });

        html += '<div class="result-panel mt-2" id="ca-jadad-result">';
        html += '<div class="result-value" id="ca-jadad-score" style="font-size:2rem">--</div>';
        html += '<div class="result-label">Jadad Score (0-5)</div>';
        html += '<div class="result-detail mt-1" id="ca-jadad-interp">Complete all items to see the score</div>';
        html += '<div id="ca-jadad-breakdown" class="mt-1"></div>';
        html += '</div>';

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportJadad()">Export Jadad Score</button>';
        html += '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.resetJadad()">Reset</button>';
        html += '</div>';

        return html;
    }

    function updateJadad() {
        var score = 0;
        var answered = 0;
        var breakdown = { 'Randomization': 0, 'Blinding': 0, 'Withdrawals': 0 };

        JADAD_ITEMS.forEach(function(item) {
            var sel = document.querySelector('input[name="ca-' + item.id + '"]:checked');
            if (sel) {
                answered++;
                var val = sel.value;
                var points = 0;
                if (val.indexOf('+1') > -1) points = 1;
                else if (val.indexOf('-1') > -1) points = -1;
                score += points;
                breakdown[item.category] += points;
            }
        });

        // Clamp score to 0-5
        score = Math.max(0, Math.min(5, score));

        var scoreEl = document.getElementById('ca-jadad-score');
        var interpEl = document.getElementById('ca-jadad-interp');
        var breakdownEl = document.getElementById('ca-jadad-breakdown');

        if (answered < JADAD_ITEMS.length) {
            if (scoreEl) { scoreEl.textContent = '--'; scoreEl.style.color = 'var(--text-secondary)'; }
            if (interpEl) interpEl.textContent = 'Complete all ' + JADAD_ITEMS.length + ' items (' + answered + '/' + JADAD_ITEMS.length + ' answered)';
            if (breakdownEl) App.setTrustedHTML(breakdownEl, '');
            return;
        }

        var color, interpretation;
        if (score >= 3) {
            color = 'var(--success)';
            interpretation = 'Adequate quality (score >= 3). The trial has acceptable randomization, blinding, and reporting of withdrawals.';
        } else {
            color = 'var(--danger)';
            interpretation = 'Low quality (score < 3). The trial has significant methodological limitations.';
        }

        if (scoreEl) { scoreEl.textContent = score + ' / 5'; scoreEl.style.color = color; }
        if (interpEl) { interpEl.textContent = interpretation; interpEl.style.color = color; }

        // Breakdown table
        if (breakdownEl) {
            var bhtml = '<div class="table-scroll-wrap"><table style="width:100%;border-collapse:collapse;font-size:0.82rem;margin-top:0.5rem">';
            bhtml += '<thead><tr style="border-bottom:2px solid var(--border-color);background:var(--bg-offset)">';
            bhtml += '<th style="padding:6px 8px;text-align:left">Domain</th>';
            bhtml += '<th style="padding:6px 8px;text-align:center">Points</th>';
            bhtml += '<th style="padding:6px 8px;text-align:center">Max</th>';
            bhtml += '</tr></thead><tbody>';

            var maxPoints = { 'Randomization': 2, 'Blinding': 2, 'Withdrawals': 1 };
            var keys = Object.keys(breakdown);
            for (var bk = 0; bk < keys.length; bk++) {
                var k = keys[bk];
                var pts = Math.max(0, breakdown[k]);
                var max = maxPoints[k];
                var bcolor = pts === max ? 'var(--success)' : pts > 0 ? 'var(--warning)' : 'var(--danger)';
                bhtml += '<tr style="border-bottom:1px solid var(--border-color)">';
                bhtml += '<td style="padding:6px 8px;font-weight:600">' + k + '</td>';
                bhtml += '<td style="padding:6px 8px;text-align:center;color:' + bcolor + ';font-weight:700">' + pts + '</td>';
                bhtml += '<td style="padding:6px 8px;text-align:center">' + max + '</td>';
                bhtml += '</tr>';
            }

            bhtml += '</tbody></table></div>';

            // Visual score bar
            bhtml += '<div style="margin-top:0.8rem;display:flex;gap:6px;justify-content:center">';
            for (var si = 0; si < 5; si++) {
                var filled = si < score;
                bhtml += '<div style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;'
                    + 'background:' + (filled ? color : 'var(--bg-offset)') + ';color:' + (filled ? '#fff' : 'var(--text-tertiary)')
                    + '">' + (si + 1) + '</div>';
            }
            bhtml += '</div>';

            App.setTrustedHTML(breakdownEl, bhtml);
        }
    }

    function exportJadad() {
        var study = document.getElementById('ca-jadad-study').value || 'Unknown Study';
        var scoreEl = document.getElementById('ca-jadad-score');
        var text = 'Jadad Score Assessment: ' + study + '\n\n';

        JADAD_ITEMS.forEach(function(item, idx) {
            var sel = document.querySelector('input[name="ca-' + item.id + '"]:checked');
            text += (idx + 1) + '. ' + item.text + ': ' + (sel ? sel.value : 'Not assessed') + '\n';
        });

        text += '\nTotal Score: ' + (scoreEl ? scoreEl.textContent : 'Not assessed');
        Export.copyText(text);
    }

    function resetJadad() {
        JADAD_ITEMS.forEach(function(item) {
            var radios = document.querySelectorAll('input[name="ca-' + item.id + '"]');
            radios.forEach(function(r) { r.checked = false; });
        });
        var scoreEl = document.getElementById('ca-jadad-score');
        if (scoreEl) { scoreEl.textContent = '--'; scoreEl.style.color = 'var(--text-secondary)'; }
        var interpEl = document.getElementById('ca-jadad-interp');
        if (interpEl) { interpEl.textContent = 'Complete all items to see the score'; interpEl.style.color = 'var(--text-secondary)'; }
        App.setTrustedHTML(document.getElementById('ca-jadad-breakdown'), '');
    }

    /* ================================================================
       NEWCASTLE-OTTAWA SCALE -- DETAILED (Cohort & Case-Control)
       ================================================================ */

    function renderNOSDetailed() {
        var html = '<div class="card-subtitle">Newcastle-Ottawa Scale (Detailed) -- Full NOS with specific criteria for cohort and case-control studies. Select study design to see the appropriate scale.</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Study Design</label>';
        html += '<select class="form-select" id="ca-nosdetail-type" onchange="CritAppraisal.loadNOSDetailed()">';
        html += '<option value="">-- Select Design --</option>';
        html += '<option value="cohort">Cohort Study</option>';
        html += '<option value="case-control">Case-Control Study</option>';
        html += '</select></div>';
        html += '<div class="form-group"><label class="form-label">Study Reference</label>';
        html += '<input type="text" class="form-input" id="ca-nosdetail-study" placeholder="e.g., Author et al. (Year)"></div>';
        html += '</div>';

        html += '<div id="ca-nosdetail-items"></div>';
        html += '<div id="ca-nosdetail-result" class="mt-2"></div>';
        return html;
    }

    function loadNOSDetailed() {
        var type = document.getElementById('ca-nosdetail-type').value;
        var itemsEl = document.getElementById('ca-nosdetail-items');
        var resultEl = document.getElementById('ca-nosdetail-result');
        App.setTrustedHTML(resultEl, '');

        if (!type || !NOS_DETAILED[type]) {
            App.setTrustedHTML(itemsEl, '');
            return;
        }

        var scale = NOS_DETAILED[type];
        var html = '<div class="card-title mt-1">' + scale.name + ' (max ' + scale.maxStars + ' stars)</div>';

        scale.sections.forEach(function(section) {
            html += '<div class="checklist-domain">';
            html += '<div class="checklist-domain-title">' + section.name + ' (max ' + section.maxStars + ' stars)</div>';

            section.items.forEach(function(item) {
                html += '<div class="checklist-question" style="padding:8px 0;border-bottom:1px solid var(--border)">';
                html += '<div class="checklist-question-text" style="font-weight:600">' + item.label + '</div>';
                html += '<div style="margin-top:6px">';
                item.options.forEach(function(opt, oi) {
                    var starLabel = opt.star ? ' [star]' : '';
                    html += '<label style="display:block;padding:3px 0;font-size:0.82rem;cursor:pointer">';
                    html += '<input type="radio" name="ca-' + item.id + '" value="' + oi + '" data-star="' + (opt.star ? '1' : '0') + '" onchange="CritAppraisal.updateNOSDetailed()" style="margin-right:6px">';
                    html += opt.text;
                    if (opt.star) html += ' <span style="color:var(--warning);font-size:0.9rem">&#9733;</span>';
                    html += '</label>';
                });
                html += '</div></div>';
            });

            html += '</div>';
        });

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportNOSDetailed()">Export NOS Assessment</button>';
        html += '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.resetNOSDetailed()">Reset</button>';
        html += '</div>';

        App.setTrustedHTML(itemsEl, html);
    }

    function updateNOSDetailed() {
        var type = document.getElementById('ca-nosdetail-type').value;
        if (!type || !NOS_DETAILED[type]) return;

        var scale = NOS_DETAILED[type];
        var totalStars = 0;
        var totalItems = 0;
        var answered = 0;
        var sectionStars = {};

        scale.sections.forEach(function(section) {
            var secStars = 0;
            section.items.forEach(function(item) {
                totalItems++;
                var sel = document.querySelector('input[name="ca-' + item.id + '"]:checked');
                if (sel) {
                    answered++;
                    if (sel.getAttribute('data-star') === '1') {
                        secStars++;
                        totalStars++;
                    }
                }
            });
            sectionStars[section.name] = { earned: secStars, max: section.maxStars };
        });

        if (answered < totalItems) {
            var resultEl = document.getElementById('ca-nosdetail-result');
            if (answered > 0) {
                var partialHtml = '<div class="result-panel">';
                partialHtml += '<div class="result-detail">Answered ' + answered + ' of ' + totalItems + ' items. Stars so far: ' + totalStars + ' / ' + scale.maxStars + '</div>';
                partialHtml += '</div>';
                App.setTrustedHTML(resultEl, partialHtml);
            }
            return;
        }

        var color, interpretation;
        if (totalStars >= 7) { color = 'var(--success)'; interpretation = 'Good quality study (>= 7 stars)'; }
        else if (totalStars >= 5) { color = 'var(--warning)'; interpretation = 'Fair quality study (5-6 stars)'; }
        else { color = 'var(--danger)'; interpretation = 'Poor quality study (< 5 stars)'; }

        var resultEl = document.getElementById('ca-nosdetail-result');
        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value" style="color:' + color + ';font-size:1.8rem">' + totalStars + ' / ' + scale.maxStars + '</div>';
        html += '<div class="result-label">NOS Stars</div>';
        html += '<div class="result-detail mt-1" style="color:' + color + '">' + interpretation + '</div>';

        // Star display
        html += '<div style="margin-top:0.5rem;font-size:1.4rem">';
        for (var si = 0; si < scale.maxStars; si++) {
            if (si < totalStars) html += '<span style="color:var(--warning)">&#9733;</span>';
            else html += '<span style="color:var(--text-tertiary)">&#9734;</span>';
        }
        html += '</div>';

        // Section breakdown
        html += '<div class="table-scroll-wrap" style="margin-top:1rem"><table style="width:100%;border-collapse:collapse;font-size:0.82rem">';
        html += '<thead><tr style="border-bottom:2px solid var(--border-color);background:var(--bg-offset)">';
        html += '<th style="padding:6px 8px;text-align:left">Section</th>';
        html += '<th style="padding:6px 8px;text-align:center">Stars Earned</th>';
        html += '<th style="padding:6px 8px;text-align:center">Maximum</th>';
        html += '<th style="padding:6px 8px;text-align:center">Stars</th>';
        html += '</tr></thead><tbody>';

        var secKeys = Object.keys(sectionStars);
        for (var sk = 0; sk < secKeys.length; sk++) {
            var sec = sectionStars[secKeys[sk]];
            var secColor = sec.earned === sec.max ? 'var(--success)' : sec.earned > 0 ? 'var(--warning)' : 'var(--danger)';
            html += '<tr style="border-bottom:1px solid var(--border-color)">';
            html += '<td style="padding:6px 8px;font-weight:600">' + secKeys[sk] + '</td>';
            html += '<td style="padding:6px 8px;text-align:center;color:' + secColor + ';font-weight:700">' + sec.earned + '</td>';
            html += '<td style="padding:6px 8px;text-align:center">' + sec.max + '</td>';
            html += '<td style="padding:6px 8px;text-align:center">';
            for (var ss = 0; ss < sec.max; ss++) {
                if (ss < sec.earned) html += '<span style="color:var(--warning)">&#9733;</span>';
                else html += '<span style="color:var(--text-tertiary)">&#9734;</span>';
            }
            html += '</td></tr>';
        }

        html += '</tbody></table></div>';
        html += '</div>';
        App.setTrustedHTML(resultEl, html);
    }

    function exportNOSDetailed() {
        var type = document.getElementById('ca-nosdetail-type').value;
        var study = document.getElementById('ca-nosdetail-study').value || 'Unknown Study';
        if (!type || !NOS_DETAILED[type]) return;

        var scale = NOS_DETAILED[type];
        var text = scale.name + '\nStudy: ' + study + '\n\n';
        var totalStars = 0;

        scale.sections.forEach(function(section) {
            text += section.name + ' (max ' + section.maxStars + ' stars):\n';
            section.items.forEach(function(item) {
                var sel = document.querySelector('input[name="ca-' + item.id + '"]:checked');
                var star = sel && sel.getAttribute('data-star') === '1';
                if (star) totalStars++;
                var selectedOption = '';
                if (sel) {
                    var optIdx = parseInt(sel.value);
                    selectedOption = item.options[optIdx] ? item.options[optIdx].text : 'N/A';
                }
                text += '  ' + item.label + ': ' + (selectedOption || 'Not assessed') + (star ? ' [STAR]' : '') + '\n';
            });
            text += '\n';
        });

        text += 'Total: ' + totalStars + ' / ' + scale.maxStars + ' stars\n';
        Export.copyText(text);
    }

    function resetNOSDetailed() {
        var type = document.getElementById('ca-nosdetail-type').value;
        if (!type || !NOS_DETAILED[type]) return;

        NOS_DETAILED[type].sections.forEach(function(section) {
            section.items.forEach(function(item) {
                var radios = document.querySelectorAll('input[name="ca-' + item.id + '"]');
                radios.forEach(function(r) { r.checked = false; });
            });
        });
        App.setTrustedHTML(document.getElementById('ca-nosdetail-result'), '');
    }

    /* ================================================================
       GRADE EVIDENCE PROFILE (Detailed)
       ================================================================ */

    function renderGRADEProfile() {
        var html = '<div class="card-subtitle">GRADE Evidence Quality Profile -- Detailed assessment with outcome-level certainty rating, structured explanations, and exportable evidence profile table.</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Review Question</label>';
        html += '<input type="text" class="form-input" id="ca-gradep-question" placeholder="e.g., Does EVT improve outcomes in LVO stroke?"></div>';
        html += '<div class="form-group"><label class="form-label">Outcome Assessed</label>';
        html += '<input type="text" class="form-input" id="ca-gradep-outcome" placeholder="e.g., Functional independence (mRS 0-2) at 90 days"></div>';
        html += '</div>';

        // Study design starting level
        html += '<div class="form-group"><label class="form-label">Study Design (Starting Level)</label>';
        html += '<div class="radio-group">';
        html += '<label class="radio-pill"><input type="radio" name="ca-gradep-base" value="4" checked onchange="CritAppraisal.updateGRADEProfile()">Randomised Trials (High: ++++)</label>';
        html += '<label class="radio-pill"><input type="radio" name="ca-gradep-base" value="2" onchange="CritAppraisal.updateGRADEProfile()">Observational Studies (Low: ++OO)</label>';
        html += '</div></div>';

        // Rate DOWN factors
        html += '<div class="card-title mt-2">Factors that Lower Quality (Rate Down)</div>';

        var downFactors = [
            { id: 'rob', name: 'Risk of Bias', desc: 'Limitations in study design or execution (e.g., lack of blinding, inadequate randomization, high attrition)', examples: 'Unblinded trials, high dropout, broken allocation concealment, selective reporting' },
            { id: 'inconsistency', name: 'Inconsistency', desc: 'Unexplained heterogeneity of results across studies', examples: 'I-squared > 50%, non-overlapping CIs, inconsistent direction of effect, unexplained subgroup differences' },
            { id: 'indirectness', name: 'Indirectness', desc: 'Evidence not directly applicable to the question of interest', examples: 'Different population, intervention, comparator, or outcome; surrogate outcomes; indirect comparisons' },
            { id: 'imprecision', name: 'Imprecision', desc: 'Wide confidence intervals or few events', examples: 'CI crosses clinical decision threshold, OIS not met, fewer than 300 events for dichotomous outcomes' },
            { id: 'pubbias', name: 'Publication Bias', desc: 'Selective publication of studies', examples: 'Asymmetric funnel plot, small-study effects, industry-funded studies with missing data' }
        ];

        downFactors.forEach(function(factor) {
            html += '<div class="checklist-question" style="padding:10px 0;border-bottom:1px solid var(--border)">';
            html += '<div class="checklist-question-text"><strong>' + factor.name + ':</strong> ' + factor.desc + '</div>';
            html += '<div style="font-size:0.78rem;color:var(--text-tertiary);margin:2px 0 6px 0;font-style:italic">Examples: ' + factor.examples + '</div>';
            html += '<div class="radio-group">';
            ['No concern (0)', 'Serious (-1)', 'Very serious (-2)'].forEach(function(opt) {
                html += '<label class="radio-pill"><input type="radio" name="ca-gradep-down-' + factor.id + '" value="' + opt + '" onchange="CritAppraisal.updateGRADEProfile()">' + opt + '</label>';
            });
            html += '</div>';
            html += '<div class="form-group mt-1"><label class="form-label" style="font-size:0.75rem">Explanation (optional)</label>';
            html += '<input type="text" class="form-input" id="ca-gradep-note-' + factor.id + '" placeholder="Describe specific concerns..." style="font-size:0.82rem"></div>';
            html += '</div>';
        });

        // Rate UP factors
        html += '<div class="card-title mt-2">Factors that Raise Quality (Rate Up -- for observational studies)</div>';

        var upFactors = [
            { id: 'large', name: 'Large Magnitude of Effect', desc: 'RR > 2 or < 0.5 with no plausible confounders' },
            { id: 'doseresponse', name: 'Dose-Response Gradient', desc: 'Clear dose-response relationship observed' },
            { id: 'confounding', name: 'All Residual Confounding Would Reduce Effect', desc: 'Plausible unmeasured confounders would only attenuate the observed effect' }
        ];

        upFactors.forEach(function(factor) {
            html += '<div class="checklist-question" style="padding:10px 0;border-bottom:1px solid var(--border)">';
            html += '<div class="checklist-question-text"><strong>' + factor.name + ':</strong> ' + factor.desc + '</div>';
            html += '<div class="radio-group">';
            // Only a very large effect (RR >5 or <0.2) justifies a 2-level upgrade in GRADE
            var profOpts = factor.id === 'large'
                ? ['Not present (0)', 'Present (+1)', 'Strongly present (+2)']
                : ['Not present (0)', 'Present (+1)'];
            profOpts.forEach(function(opt) {
                html += '<label class="radio-pill"><input type="radio" name="ca-gradep-up-' + factor.id + '" value="' + opt + '" onchange="CritAppraisal.updateGRADEProfile()">' + opt + '</label>';
            });
            html += '</div></div>';
        });

        html += '<div class="result-panel mt-2" id="ca-gradep-result">';
        html += '<div class="result-value" id="ca-gradep-level" style="font-size:1.5rem">Not Assessed</div>';
        html += '<div class="result-label">GRADE Certainty of Evidence</div>';
        html += '<div class="result-detail mt-1" id="ca-gradep-explanation">Select study design and rate each domain to see the final assessment</div>';
        html += '<div id="ca-gradep-profile" class="mt-2"></div>';
        html += '</div>';

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportGRADEProfile()">Export GRADE Profile</button>';
        html += '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.resetGRADEProfile()">Reset</button>';
        html += '</div>';

        return html;
    }

    function updateGRADEProfile() {
        var baseEl = document.querySelector('input[name="ca-gradep-base"]:checked');
        if (!baseEl) return;

        var level = parseInt(baseEl.value);
        var downIds = ['rob', 'inconsistency', 'indirectness', 'imprecision', 'pubbias'];
        var upIds = ['large', 'doseresponse', 'confounding'];
        var downgrades = {};
        var upgrades = {};

        downIds.forEach(function(id) {
            var sel = document.querySelector('input[name="ca-gradep-down-' + id + '"]:checked');
            if (sel) {
                var val = sel.value;
                if (val.indexOf('-1') > -1) { level -= 1; downgrades[id] = -1; }
                else if (val.indexOf('-2') > -1) { level -= 2; downgrades[id] = -2; }
                else { downgrades[id] = 0; }
            }
        });

        upIds.forEach(function(id) {
            var sel = document.querySelector('input[name="ca-gradep-up-' + id + '"]:checked');
            if (sel) {
                var val = sel.value;
                if (val.indexOf('+1') > -1) { level += 1; upgrades[id] = 1; }
                else if (val.indexOf('+2') > -1) { level += 2; upgrades[id] = 2; }
                else { upgrades[id] = 0; }
            }
        });

        level = Math.max(1, Math.min(4, level));

        var labels = ['', 'Very Low', 'Low', 'Moderate', 'High'];
        var colors = ['', 'var(--danger)', 'var(--warning)', 'var(--info)', 'var(--success)'];
        var symbols = ['', '\u2295\u2296\u2296\u2296', '\u2295\u2295\u2296\u2296', '\u2295\u2295\u2295\u2296', '\u2295\u2295\u2295\u2295'];
        var descriptions = [
            '',
            'The true effect is probably markedly different from the estimated effect.',
            'The true effect might be markedly different from the estimated effect.',
            'The true effect is probably close to the estimated effect.',
            'We are very confident that the true effect is close to the estimated effect.'
        ];

        var el = document.getElementById('ca-gradep-level');
        if (el) {
            App.setTrustedHTML(el, '<span style="color:' + colors[level] + '">' + symbols[level] + ' ' + labels[level] + '</span>');
        }

        var expEl = document.getElementById('ca-gradep-explanation');
        if (expEl) {
            expEl.textContent = descriptions[level];
            expEl.style.color = colors[level];
        }

        // Build evidence profile table
        var profileEl = document.getElementById('ca-gradep-profile');
        if (profileEl) {
            var phtml = '<div class="table-scroll-wrap"><table style="width:100%;border-collapse:collapse;font-size:0.82rem">';
            phtml += '<thead><tr style="border-bottom:2px solid var(--border-color);background:var(--bg-offset)">';
            phtml += '<th style="padding:6px 8px;text-align:left">Domain</th>';
            phtml += '<th style="padding:6px 8px;text-align:center">Rating</th>';
            phtml += '<th style="padding:6px 8px;text-align:left">Notes</th>';
            phtml += '</tr></thead><tbody>';

            var domainNames = { rob: 'Risk of Bias', inconsistency: 'Inconsistency', indirectness: 'Indirectness', imprecision: 'Imprecision', pubbias: 'Publication Bias' };
            downIds.forEach(function(id) {
                var note = document.getElementById('ca-gradep-note-' + id);
                var noteText = note ? note.value.trim() : '';
                var val = downgrades[id];
                var ratingText = val === undefined ? '--' : val === 0 ? 'No concern' : val === -1 ? 'Serious (-1)' : 'Very serious (-2)';
                var rColor = val === undefined ? 'var(--text-tertiary)' : val === 0 ? 'var(--success)' : val === -1 ? 'var(--warning)' : 'var(--danger)';

                phtml += '<tr style="border-bottom:1px solid var(--border-color)">';
                phtml += '<td style="padding:6px 8px;font-weight:600">' + domainNames[id] + '</td>';
                phtml += '<td style="padding:6px 8px;text-align:center;color:' + rColor + ';font-weight:600">' + ratingText + '</td>';
                phtml += '<td style="padding:6px 8px;font-size:0.78rem;color:var(--text-secondary)">' + (noteText || '--') + '</td>';
                phtml += '</tr>';
            });

            var upNames = { large: 'Large Effect', doseresponse: 'Dose-Response', confounding: 'Residual Confounding' };
            upIds.forEach(function(id) {
                var val = upgrades[id];
                var ratingText = val === undefined ? '--' : val === 0 ? 'Not present' : val === 1 ? 'Present (+1)' : 'Strongly present (+2)';
                var rColor = val === undefined ? 'var(--text-tertiary)' : val === 0 ? 'var(--text-secondary)' : 'var(--success)';

                phtml += '<tr style="border-bottom:1px solid var(--border-color)">';
                phtml += '<td style="padding:6px 8px;font-weight:600">' + upNames[id] + ' (upgrade)</td>';
                phtml += '<td style="padding:6px 8px;text-align:center;color:' + rColor + ';font-weight:600">' + ratingText + '</td>';
                phtml += '<td style="padding:6px 8px;font-size:0.78rem;color:var(--text-secondary)">--</td>';
                phtml += '</tr>';
            });

            phtml += '</tbody></table></div>';
            App.setTrustedHTML(profileEl, phtml);
        }
    }

    function exportGRADEProfile() {
        var question = document.getElementById('ca-gradep-question').value || 'Not specified';
        var outcome = document.getElementById('ca-gradep-outcome').value || 'Not specified';
        var levelEl = document.getElementById('ca-gradep-level');

        var text = 'GRADE Evidence Profile\n';
        text += 'Question: ' + question + '\n';
        text += 'Outcome: ' + outcome + '\n\n';

        var baseEl = document.querySelector('input[name="ca-gradep-base"]:checked');
        text += 'Starting level: ' + (baseEl && baseEl.value === '4' ? 'High (RCT)' : 'Low (Observational)') + '\n\n';

        text += 'Rate Down:\n';
        var downIds = ['rob', 'inconsistency', 'indirectness', 'imprecision', 'pubbias'];
        var domainNames = { rob: 'Risk of Bias', inconsistency: 'Inconsistency', indirectness: 'Indirectness', imprecision: 'Imprecision', pubbias: 'Publication Bias' };
        downIds.forEach(function(id) {
            var sel = document.querySelector('input[name="ca-gradep-down-' + id + '"]:checked');
            var note = document.getElementById('ca-gradep-note-' + id);
            text += '  ' + domainNames[id] + ': ' + (sel ? sel.value : 'Not rated');
            if (note && note.value.trim()) text += ' -- ' + note.value.trim();
            text += '\n';
        });

        text += '\nRate Up:\n';
        var upIds = ['large', 'doseresponse', 'confounding'];
        var upNames = { large: 'Large Effect', doseresponse: 'Dose-Response', confounding: 'Residual Confounding' };
        upIds.forEach(function(id) {
            var sel = document.querySelector('input[name="ca-gradep-up-' + id + '"]:checked');
            text += '  ' + upNames[id] + ': ' + (sel ? sel.value : 'Not rated') + '\n';
        });

        text += '\nFinal Certainty: ' + (levelEl ? levelEl.textContent : 'Not assessed') + '\n';
        Export.copyText(text);
    }

    function resetGRADEProfile() {
        var downIds = ['rob', 'inconsistency', 'indirectness', 'imprecision', 'pubbias'];
        var upIds = ['large', 'doseresponse', 'confounding'];

        downIds.forEach(function(id) {
            var radios = document.querySelectorAll('input[name="ca-gradep-down-' + id + '"]');
            radios.forEach(function(r) { r.checked = false; });
            var note = document.getElementById('ca-gradep-note-' + id);
            if (note) note.value = '';
        });

        upIds.forEach(function(id) {
            var radios = document.querySelectorAll('input[name="ca-gradep-up-' + id + '"]');
            radios.forEach(function(r) { r.checked = false; });
        });

        var el = document.getElementById('ca-gradep-level');
        if (el) App.setTrustedHTML(el, 'Not Assessed');
        var expEl = document.getElementById('ca-gradep-explanation');
        if (expEl) { expEl.textContent = 'Select study design and rate each domain to see the final assessment'; expEl.style.color = 'var(--text-secondary)'; }
        App.setTrustedHTML(document.getElementById('ca-gradep-profile'), '');
    }

    /* ================================================================
       NOS (original, preserved)
       ================================================================ */

    function renderNOS() {
        var html = '<div class="form-group"><label class="form-label">Study Name</label><input type="text" class="form-input" id="ca-nos-study"></div>';

        var sections = [
            { name: 'Selection', maxStars: 4, items: [
                'Representativeness of the exposed cohort',
                'Selection of the non-exposed cohort',
                'Ascertainment of exposure',
                'Outcome not present at start'
            ]},
            { name: 'Comparability', maxStars: 2, items: [
                'Comparability based on design or analysis (study controls for most important factor)',
                'Study controls for additional factor'
            ]},
            { name: 'Outcome', maxStars: 3, items: [
                'Assessment of outcome',
                'Adequate follow-up duration',
                'Adequacy of follow-up rate'
            ]}
        ];

        sections.forEach(function(sec) {
            html += '<div class="checklist-domain">';
            html += '<div class="checklist-domain-title">' + sec.name + ' (max ' + sec.maxStars + ' stars)</div>';
            sec.items.forEach(function(item, i) {
                var id = 'nos_' + sec.name.toLowerCase() + '_' + i;
                html += '<div class="checklist-question">'
                    + '<div class="checklist-question-text">' + item + '</div>'
                    + '<div class="radio-group">'
                    + '<label class="radio-pill"><input type="radio" name="ca-' + id + '" value="star" onchange="CritAppraisal.updateNOS()">Star</label>'
                    + '<label class="radio-pill"><input type="radio" name="ca-' + id + '" value="no" onchange="CritAppraisal.updateNOS()">No Star</label>'
                    + '</div></div>';
            });
            html += '</div>';
        });

        html += '<div class="result-panel" id="ca-nos-result"><div class="result-value" id="ca-nos-score">0 / 9</div><div class="result-label">NOS Stars</div>'
            + '<div class="result-detail" id="ca-nos-interp">Complete assessment to see rating</div>';

        // Color-coded star display
        html += '<div id="ca-nos-stars" style="margin-top:0.5rem;font-size:1.2rem"></div>';
        html += '</div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportNOS()">Export</button></div>';
        return html;
    }

    /* ================================================================
       AMSTAR-2 (original, preserved with color coding)
       ================================================================ */

    function renderAMSTAR() {
        var html = '';
        References.amstar2.items.forEach(function(item) {
            html += '<div class="checklist-question" style="padding:10px 0;border-bottom:1px solid var(--border)">';
            html += '<div class="checklist-question-text">'
                + (item.critical ? '<span class="risk-badge risk-badge--high" style="font-size:0.6rem;margin-right:4px">CRITICAL</span>' : '<span class="risk-badge risk-badge--low" style="font-size:0.6rem;margin-right:4px">NON-CRITICAL</span>')
                + item.id + '. ' + item.text + '</div>';
            html += '<div class="radio-group">';
            // Items 11, 12, and 15 include a "No meta-analysis conducted" response
            // in the published instrument (it is not counted as a weakness)
            var amstarOpts = ([11, 12, 15].indexOf(item.id) !== -1)
                ? ['Yes', 'Partial Yes', 'No', 'No meta-analysis']
                : ['Yes', 'Partial Yes', 'No'];
            amstarOpts.forEach(function(opt) {
                html += '<label class="radio-pill"><input type="radio" name="ca-amstar-' + item.id + '" value="' + opt + '" onchange="CritAppraisal.updateAMSTAR()">' + opt + '</label>';
            });
            html += '</div></div>';
        });

        html += '<div class="result-panel mt-2" id="ca-amstar-result">'
            + '<div class="result-value" id="ca-amstar-rating">Not Assessed</div>'
            + '<div class="result-label">Overall Confidence</div>'
            + '<div class="result-detail mt-1" id="ca-amstar-detail"></div>'
            + '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportAMSTAR()">Export</button></div>';
        return html;
    }

    /* ================================================================
       QUADAS-2 (original, preserved with color coding)
       ================================================================ */

    function renderQUADAS() {
        var domains = [
            { name: 'Patient Selection', questions: ['Was a consecutive or random sample of patients enrolled?', 'Was a case-control design avoided?', 'Did the study avoid inappropriate exclusions?'] },
            { name: 'Index Test', questions: ['Were the index test results interpreted without knowledge of the reference standard?', 'Was a pre-specified threshold used?'] },
            { name: 'Reference Standard', questions: ['Is the reference standard likely to correctly classify the target condition?', 'Were the reference standard results interpreted without knowledge of the index test?'] },
            { name: 'Flow and Timing', questions: ['Was there an appropriate interval between index test and reference standard?', 'Did all patients receive a reference standard?', 'Did all patients receive the same reference standard?', 'Were all patients included in the analysis?'] }
        ];

        var html = '';
        domains.forEach(function(domain, di) {
            html += '<div class="checklist-domain">';
            html += '<div class="checklist-domain-title">' + domain.name + '</div>';
            domain.questions.forEach(function(q, qi) {
                var id = 'quadas_' + di + '_' + qi;
                html += '<div class="checklist-question"><div class="checklist-question-text">' + q + '</div>';
                html += '<div class="radio-group">';
                ['Yes', 'No', 'Unclear'].forEach(function(opt) {
                    html += '<label class="radio-pill"><input type="radio" name="ca-' + id + '" value="' + opt + '" onchange="CritAppraisal.updateQUADAS()">' + opt + '</label>';
                });
                html += '</div></div>';
            });
            html += '<div class="flex items-center gap-1 mt-1"><span style="font-size:0.8rem">Risk of Bias:</span><span class="risk-badge" id="ca-quadas-' + di + '">--</span>';
            // QUADAS-2 assesses applicability for the first three domains only
            // (Flow and Timing has no applicability rating)
            if (di < 3) {
                html += '<span style="font-size:0.8rem;margin-left:12px">Applicability Concern:</span>'
                    + '<select class="form-select" id="ca-quadas-app-' + di + '" style="width:120px;height:28px;font-size:0.75rem">'
                    + '<option>Low</option><option>High</option><option>Unclear</option></select>';
            }
            html += '</div>';
            html += '</div>';
        });

        html += '<div class="btn-group mt-2"><button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportQUADAS()">Export</button></div>';
        return html;
    }

    /* ================================================================
       GRADE (original, preserved)
       ================================================================ */

    function renderGRADE() {
        var html = '<div class="form-group"><label class="form-label">Study Design Base</label>'
            + '<div class="radio-group">'
            + '<label class="radio-pill"><input type="radio" name="ca-grade-base" value="RCT" checked onchange="CritAppraisal.updateGRADE()">RCT (Start: High)</label>'
            + '<label class="radio-pill"><input type="radio" name="ca-grade-base" value="Observational" onchange="CritAppraisal.updateGRADE()">Observational (Start: Low)</label>'
            + '</div></div>';

        html += '<div class="card-title mt-2">Rate Down</div>';
        References.grade.rateDown.forEach(function(domain, i) {
            html += '<div class="checklist-question"><div class="checklist-question-text">' + domain.domain + ': ' + domain.description + '</div>';
            html += '<div class="radio-group">';
            ['No concern', 'Serious (-1)', 'Very serious (-2)'].forEach(function(opt) {
                html += '<label class="radio-pill"><input type="radio" name="ca-grade-down-' + i + '" value="' + opt + '" onchange="CritAppraisal.updateGRADE()">' + opt + '</label>';
            });
            html += '</div></div>';
        });

        html += '<div class="card-title mt-2">Rate Up</div>';
        References.grade.rateUp.forEach(function(domain, i) {
            html += '<div class="checklist-question"><div class="checklist-question-text">' + domain.domain + ': ' + domain.description + '</div>';
            html += '<div class="radio-group">';
            // GRADE reserves 2-level upgrades for very large effects (RR >5 or <0.2);
            // dose-response and opposing-confounding are 1-level factors
            var upOpts = domain.domain === 'Large Effect' ? ['No', 'Yes (+1)', 'Very large (RR >5 or <0.2) (+2)'] : ['No', 'Yes (+1)'];
            upOpts.forEach(function(opt) {
                html += '<label class="radio-pill"><input type="radio" name="ca-grade-up-' + i + '" value="' + opt + '" onchange="CritAppraisal.updateGRADE()">' + opt + '</label>';
            });
            html += '</div></div>';
        });

        html += '<div class="result-panel mt-2" id="ca-grade-result">'
            + '<div class="result-value" id="ca-grade-level">Not Assessed</div>'
            + '<div class="result-label">GRADE Certainty of Evidence</div></div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportGRADE()">Export GRADE Profile</button></div>';
        return html;
    }

    /* ================================================================
       SUMMARY OF FINDINGS TABLE (NEW)
       ================================================================ */

    function renderSoF() {
        var html = '<div class="card-subtitle">Generate a GRADE Summary of Findings (SoF) table for a systematic review. Add outcomes and rate evidence certainty.</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Comparison</label>';
        html += '<input type="text" class="form-input" id="ca-sof-comparison" placeholder="e.g., Intervention vs Control"></div>';
        html += '<div class="form-group"><label class="form-label">Population</label>';
        html += '<input type="text" class="form-input" id="ca-sof-population" placeholder="e.g., Adults with acute ischemic stroke"></div>';
        html += '</div>';

        html += '<div class="card-title mt-2">Add Outcome</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Outcome Name</label>';
        html += '<input type="text" class="form-input" id="ca-sof-outcome" placeholder="e.g., Functional independence (mRS 0-2)"></div>';
        html += '<div class="form-group"><label class="form-label">N Studies (N Participants)</label>';
        html += '<input type="text" class="form-input" id="ca-sof-nstudies" placeholder="e.g., 5 RCTs (3200)"></div>';
        html += '<div class="form-group"><label class="form-label">Effect Estimate (95% CI)</label>';
        html += '<input type="text" class="form-input" id="ca-sof-effect" placeholder="e.g., OR 2.0 (1.6-2.5)"></div>';
        html += '</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">GRADE Certainty</label>';
        html += '<select class="form-select" id="ca-sof-certainty">';
        html += '<option value="High">High</option>';
        html += '<option value="Moderate">Moderate</option>';
        html += '<option value="Low">Low</option>';
        html += '<option value="Very Low">Very Low</option>';
        html += '</select></div>';
        html += '<div class="form-group"><label class="form-label">Footnotes / Reasons</label>';
        html += '<input type="text" class="form-input" id="ca-sof-footnotes" placeholder="e.g., Downgraded for imprecision (wide CI)"></div>';
        html += '</div>';

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-primary btn-sm" onclick="CritAppraisal.addSoFOutcome()">Add Outcome</button>';
        html += '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.clearSoF()">Clear All</button>';
        html += '</div>';

        html += '<div id="ca-sof-table" class="mt-2"></div>';

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.exportSoF()">Copy SoF Table</button>';
        html += '</div>';

        return html;
    }

    function addSoFOutcome() {
        var outcome = document.getElementById('ca-sof-outcome').value.trim();
        var nstudies = document.getElementById('ca-sof-nstudies').value.trim();
        var effect = document.getElementById('ca-sof-effect').value.trim();
        var certainty = document.getElementById('ca-sof-certainty').value;
        var footnotes = document.getElementById('ca-sof-footnotes').value.trim();

        if (!outcome) { Export.showToast('Enter an outcome name.', 'error'); return; }

        sofOutcomes.push({ outcome: outcome, nstudies: nstudies, effect: effect, certainty: certainty, footnotes: footnotes });

        // Clear inputs
        document.getElementById('ca-sof-outcome').value = '';
        document.getElementById('ca-sof-nstudies').value = '';
        document.getElementById('ca-sof-effect').value = '';
        document.getElementById('ca-sof-footnotes').value = '';

        renderSoFTable();
        Export.showToast('Outcome added to SoF table.', 'success');
    }

    function renderSoFTable() {
        var el = document.getElementById('ca-sof-table');
        if (sofOutcomes.length === 0) {
            App.setTrustedHTML(el, '<div class="result-detail">No outcomes added yet.</div>');
            return;
        }

        var comparison = document.getElementById('ca-sof-comparison').value.trim() || '[Comparison]';
        var population = document.getElementById('ca-sof-population').value.trim() || '[Population]';

        var certaintyColors = {
            'High': 'var(--success)',
            'Moderate': 'var(--info)',
            'Low': 'var(--warning)',
            'Very Low': 'var(--danger)'
        };

        var certaintySymbols = {
            'High': '\u2295\u2295\u2295\u2295',
            'Moderate': '\u2295\u2295\u2295\u2296',
            'Low': '\u2295\u2295\u2296\u2296',
            'Very Low': '\u2295\u2296\u2296\u2296'
        };

        var html = '<div class="animate-in">';
        html += '<div style="font-weight:700;font-size:0.95rem;margin-bottom:0.5rem">Summary of Findings Table</div>';
        html += '<div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.8rem">';
        html += '<strong>Comparison:</strong> ' + comparison + ' | <strong>Population:</strong> ' + population;
        html += '</div>';

        html += '<table style="width:100%;border-collapse:collapse;font-size:0.82rem">';
        html += '<thead><tr style="border-bottom:2px solid var(--border-color);background:var(--bg-offset)">';
        html += '<th style="padding:8px;text-align:left;width:25%">Outcome</th>';
        html += '<th style="padding:8px;text-align:center;width:18%">Studies (N)</th>';
        html += '<th style="padding:8px;text-align:center;width:22%">Effect (95% CI)</th>';
        html += '<th style="padding:8px;text-align:center;width:18%">Certainty</th>';
        html += '<th style="padding:8px;text-align:left;width:17%">Notes</th>';
        html += '</tr></thead><tbody>';

        for (var i = 0; i < sofOutcomes.length; i++) {
            var o = sofOutcomes[i];
            var color = certaintyColors[o.certainty] || 'var(--text-secondary)';
            var symbols = certaintySymbols[o.certainty] || '';

            html += '<tr style="border-bottom:1px solid var(--border-color)">';
            html += '<td style="padding:8px;font-weight:600">' + o.outcome + '</td>';
            html += '<td style="padding:8px;text-align:center">' + (o.nstudies || '--') + '</td>';
            html += '<td style="padding:8px;text-align:center;font-family:monospace">' + (o.effect || '--') + '</td>';
            html += '<td style="padding:8px;text-align:center"><span style="color:' + color + ';font-weight:700">' + symbols + '</span><br><span style="font-size:0.75rem;color:' + color + '">' + o.certainty + '</span></td>';
            html += '<td style="padding:8px;font-size:0.78rem;color:var(--text-secondary)">' + (o.footnotes || '') + '</td>';
            html += '</tr>';
        }

        html += '</tbody></table></div>';
        App.setTrustedHTML(el, html);
    }

    function clearSoF() {
        sofOutcomes = [];
        renderSoFTable();
    }

    function exportSoF() {
        if (sofOutcomes.length === 0) { Export.showToast('No outcomes in SoF table.', 'error'); return; }

        var comparison = document.getElementById('ca-sof-comparison').value.trim() || '[Comparison]';
        var population = document.getElementById('ca-sof-population').value.trim() || '[Population]';

        var text = 'Summary of Findings Table\n';
        text += 'Comparison: ' + comparison + '\n';
        text += 'Population: ' + population + '\n\n';
        text += 'Outcome\tStudies (N)\tEffect (95% CI)\tCertainty\tNotes\n';
        text += '-'.repeat(80) + '\n';

        for (var i = 0; i < sofOutcomes.length; i++) {
            var o = sofOutcomes[i];
            text += o.outcome + '\t' + (o.nstudies || '--') + '\t' + (o.effect || '--') + '\t' + o.certainty + '\t' + (o.footnotes || '') + '\n';
        }

        Export.copyText(text);
    }

    /* ================================================================
       RoB VISUALIZATION (NEW)
       ================================================================ */

    function renderRoBViz() {
        var html = '<div class="card-subtitle">Risk of Bias traffic light plot and summary chart. Add studies from the RoB 2.0 tab, or enter data manually below.</div>';

        html += '<div class="card-title mt-1">Manual Entry</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Study Name</label>';
        html += '<input type="text" class="form-input" id="ca-viz-study" placeholder="e.g., NINDS 1995"></div>';
        html += '<div class="form-group">&nbsp;</div>';
        html += '</div>';

        html += '<div class="form-row" style="display:flex;gap:0.5rem;flex-wrap:wrap">';
        References.rob2.domains.forEach(function(domain) {
            html += '<div class="form-group" style="flex:1;min-width:120px"><label class="form-label" style="font-size:0.75rem">' + domain.id + '</label>';
            html += '<select class="form-select" id="ca-viz-' + domain.id + '" style="height:30px;font-size:0.78rem">';
            html += '<option value="Low">Low</option>';
            html += '<option value="Some concerns">Some concerns</option>';
            html += '<option value="High">High</option>';
            html += '</select></div>';
        });
        html += '</div>';

        html += '<div class="btn-group mt-1">';
        html += '<button class="btn btn-primary btn-sm" onclick="CritAppraisal.addManualStudy()">Add Study</button>';
        html += '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.clearRoBViz()">Clear All</button>';
        html += '</div>';

        html += '<div id="ca-viz-list" class="mt-2" style="font-size:0.82rem"></div>';

        html += '<div class="card-title mt-2">Traffic Light Plot</div>';
        html += '<div style="text-align:center"><canvas id="ca-viz-traffic-canvas" width="700" height="100"></canvas></div>';

        html += '<div class="card-title mt-2">Summary Bar Chart</div>';
        html += '<div style="text-align:center"><canvas id="ca-viz-summary-canvas" width="700" height="280"></canvas></div>';

        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-secondary btn-sm" onclick="CritAppraisal.drawRoBViz()">Redraw Charts</button>';
        html += '<button class="btn btn-secondary btn-sm" onclick="Export.exportCanvasPNG(document.getElementById(\'ca-viz-traffic-canvas\'), \'rob-traffic-light.png\')">Export Traffic Light PNG</button>';
        html += '<button class="btn btn-secondary btn-sm" onclick="Export.exportCanvasPNG(document.getElementById(\'ca-viz-summary-canvas\'), \'rob-summary.png\')">Export Summary PNG</button>';
        html += '</div>';

        return html;
    }

    function addToRoBViz() {
        // Collect current RoB 2 assessment and add to visualization
        var study = document.getElementById('ca-study-name').value.trim() || 'Study ' + (robStudies.length + 1);
        var domainJudgments = {};

        References.rob2.domains.forEach(function(domain) {
            var badge = document.getElementById('ca-judgment-' + domain.id);
            domainJudgments[domain.id] = badge ? badge.textContent : 'Not assessed';
        });

        // Check if at least some domains are assessed
        var assessed = Object.values(domainJudgments).filter(function(v) { return v !== 'Not assessed'; });
        if (assessed.length === 0) {
            Export.showToast('Complete at least some domains before adding to visualization.', 'error');
            return;
        }

        robStudies.push({ name: study, domains: domainJudgments });
        updateRoBVizList();
        drawRoBViz();
        Export.showToast('Study "' + study + '" added to RoB visualization.', 'success');
    }

    function addManualStudy() {
        var study = document.getElementById('ca-viz-study').value.trim() || 'Study ' + (robStudies.length + 1);
        var domainJudgments = {};

        References.rob2.domains.forEach(function(domain) {
            var sel = document.getElementById('ca-viz-' + domain.id);
            domainJudgments[domain.id] = sel ? sel.value : 'Not assessed';
        });

        robStudies.push({ name: study, domains: domainJudgments });
        document.getElementById('ca-viz-study').value = '';
        updateRoBVizList();
        drawRoBViz();
        Export.showToast('Study added.', 'success');
    }

    function updateRoBVizList() {
        var el = document.getElementById('ca-viz-list');
        if (!el) return;
        if (robStudies.length === 0) {
            App.setTrustedHTML(el, '<div class="result-detail">No studies added yet.</div>');
            return;
        }

        var colorMap = {
            'Low risk': '#34d399', 'Low': '#34d399',
            'Some concerns': '#fbbf24',
            'High risk': '#f87171', 'High': '#f87171',
            'Not assessed': '#64748b'
        };

        var html = '<div style="font-size:0.82rem;margin-bottom:0.5rem"><strong>' + robStudies.length + ' studies</strong> in visualization</div>';
        html += '<table style="width:100%;border-collapse:collapse;font-size:0.78rem">';
        html += '<thead><tr style="border-bottom:2px solid var(--border-color)">';
        html += '<th style="padding:4px 6px;text-align:left">Study</th>';
        References.rob2.domains.forEach(function(d) {
            html += '<th style="padding:4px 6px;text-align:center">' + d.id + '</th>';
        });
        html += '<th style="padding:4px 6px;text-align:center">Remove</th>';
        html += '</tr></thead><tbody>';

        for (var i = 0; i < robStudies.length; i++) {
            var s = robStudies[i];
            html += '<tr style="border-bottom:1px solid var(--border-color)">';
            html += '<td style="padding:4px 6px">' + s.name + '</td>';
            References.rob2.domains.forEach(function(d) {
                var j = s.domains[d.id] || 'Not assessed';
                var bg = colorMap[j] || '#64748b';
                html += '<td style="padding:4px 6px;text-align:center"><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:' + bg + '" title="' + j + '"></span></td>';
            });
            html += '<td style="padding:4px 6px;text-align:center"><button class="btn btn-xs" style="font-size:0.7rem;padding:2px 6px" onclick="CritAppraisal.removeRoBStudy(' + i + ')">x</button></td>';
            html += '</tr>';
        }
        html += '</tbody></table>';
        App.setTrustedHTML(el, html);
    }

    function removeRoBStudy(idx) {
        robStudies.splice(idx, 1);
        updateRoBVizList();
        drawRoBViz();
    }

    function clearRoBViz() {
        robStudies = [];
        updateRoBVizList();
        drawRoBViz();
    }

    function drawRoBViz() {
        drawTrafficLightPlot();
        drawSummaryBarChart();
    }

    function drawTrafficLightPlot() {
        var canvas = document.getElementById('ca-viz-traffic-canvas');
        if (!canvas || robStudies.length === 0) {
            if (canvas) {
                var ctx0 = canvas.getContext('2d');
                ctx0.clearRect(0, 0, canvas.width, canvas.height);
            }
            return;
        }

        var domains = References.rob2.domains;
        var nStudies = robStudies.length;
        var cellSize = 24;
        var labelWidth = 120;
        var domainLabelHeight = 50;
        var rowHeight = cellSize + 4;
        var colWidth = cellSize + 4;

        var totalWidth = labelWidth + domains.length * colWidth + 20;
        var totalHeight = domainLabelHeight + nStudies * rowHeight + 10;

        var dpr = window.devicePixelRatio || 1;
        canvas.width = totalWidth * dpr;
        canvas.height = totalHeight * dpr;
        canvas.style.width = totalWidth + 'px';
        canvas.style.height = totalHeight + 'px';

        var ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        var textColor = isDark ? '#f1f5f9' : '#0f172a';
        var bgColor = isDark ? '#06090f' : '#ffffff';

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        var colorMap = {
            'Low risk': '#34d399', 'Low': '#34d399',
            'Some concerns': '#fbbf24',
            'High risk': '#f87171', 'High': '#f87171',
            'Not assessed': '#64748b'
        };
        var symbolMap = {
            'Low risk': '+', 'Low': '+',
            'Some concerns': '~',
            'High risk': '-', 'High': '-',
            'Not assessed': '?'
        };

        // Domain labels (rotated)
        ctx.save();
        ctx.fillStyle = textColor;
        ctx.font = '10px system-ui, sans-serif';
        ctx.textAlign = 'left';
        for (var di = 0; di < domains.length; di++) {
            var cx = labelWidth + di * colWidth + colWidth / 2;
            ctx.save();
            ctx.translate(cx, domainLabelHeight - 4);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(domains[di].id, 0, 0);
            ctx.restore();
        }
        ctx.restore();

        // Study rows
        for (var si = 0; si < nStudies; si++) {
            var study = robStudies[si];
            var y = domainLabelHeight + si * rowHeight;

            // Study name
            ctx.fillStyle = textColor;
            ctx.font = '10px system-ui, sans-serif';
            ctx.textAlign = 'right';
            var name = study.name.length > 18 ? study.name.substring(0, 16) + '..' : study.name;
            ctx.fillText(name, labelWidth - 6, y + cellSize / 2 + 3);

            // Domain circles
            for (var dj = 0; dj < domains.length; dj++) {
                var judgment = study.domains[domains[dj].id] || 'Not assessed';
                var x = labelWidth + dj * colWidth + colWidth / 2;
                var cy2 = y + cellSize / 2;

                ctx.beginPath();
                ctx.arc(x, cy2, cellSize / 2 - 1, 0, 2 * Math.PI);
                ctx.fillStyle = colorMap[judgment] || '#64748b';
                ctx.fill();

                // Symbol
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 12px system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(symbolMap[judgment] || '?', x, cy2);
            }
        }
    }

    function drawSummaryBarChart() {
        var canvas = document.getElementById('ca-viz-summary-canvas');
        if (!canvas || robStudies.length === 0) {
            if (canvas) {
                var ctx0 = canvas.getContext('2d');
                ctx0.clearRect(0, 0, canvas.width, canvas.height);
            }
            return;
        }

        var domains = References.rob2.domains;
        var nStudies = robStudies.length;

        // Count per domain (unassessed judgments must not be counted as High risk)
        var counts = [];
        for (var di = 0; di < domains.length; di++) {
            var low = 0, some = 0, high = 0;
            for (var si = 0; si < nStudies; si++) {
                var j = robStudies[si].domains[domains[di].id] || 'Not assessed';
                if (j === 'Low risk' || j === 'Low') low++;
                else if (j === 'Some concerns') some++;
                else if (j === 'High risk' || j === 'High') high++;
            }
            counts.push({ low: low, some: some, high: high });
        }

        var width = 680;
        var height = 260;
        var dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        var ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        var textColor = isDark ? '#f1f5f9' : '#0f172a';
        var bgColor = isDark ? '#06090f' : '#ffffff';

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        var margin = { top: 30, right: 20, bottom: 70, left: 60 };
        var plotW = width - margin.left - margin.right;
        var plotH = height - margin.top - margin.bottom;
        var barWidth = Math.min(50, plotW / domains.length * 0.6);
        var gap = plotW / domains.length;

        // Title
        ctx.fillStyle = textColor;
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Risk of Bias Summary', width / 2, 18);

        // Y-axis
        ctx.fillStyle = textColor;
        ctx.font = '10px system-ui, sans-serif';
        ctx.textAlign = 'right';
        for (var pct = 0; pct <= 100; pct += 25) {
            var yy = margin.top + plotH - (pct / 100) * plotH;
            ctx.fillText(pct + '%', margin.left - 6, yy + 3);

            ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.08)' : 'rgba(0,0,0,0.06)';
            ctx.beginPath();
            ctx.moveTo(margin.left, yy);
            ctx.lineTo(width - margin.right, yy);
            ctx.stroke();
        }

        // Bars
        for (var di2 = 0; di2 < domains.length; di2++) {
            var c = counts[di2];
            var lowPct = c.low / nStudies;
            var somePct = c.some / nStudies;
            var highPct = c.high / nStudies;

            var bx = margin.left + di2 * gap + (gap - barWidth) / 2;
            var baseY = margin.top + plotH;

            // Low (green) -- bottom
            var lowH = lowPct * plotH;
            ctx.fillStyle = '#34d399';
            ctx.fillRect(bx, baseY - lowH, barWidth, lowH);

            // Some concerns (amber) -- middle
            var someH = somePct * plotH;
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(bx, baseY - lowH - someH, barWidth, someH);

            // High (red) -- top
            var highH = highPct * plotH;
            ctx.fillStyle = '#f87171';
            ctx.fillRect(bx, baseY - lowH - someH - highH, barWidth, highH);

            // Domain label
            ctx.save();
            ctx.fillStyle = textColor;
            ctx.font = '9px system-ui, sans-serif';
            ctx.textAlign = 'center';
            var labelX = bx + barWidth / 2;
            ctx.translate(labelX, baseY + 8);
            ctx.rotate(Math.PI / 4);
            var domainLabel = domains[di2].name.length > 20 ? domains[di2].name.substring(0, 18) + '..' : domains[di2].name;
            ctx.fillText(domainLabel, 0, 0);
            ctx.restore();
        }

        // Legend
        var legendY = height - 12;
        var legendX = margin.left;
        var legendItems = [
            { color: '#34d399', label: 'Low risk' },
            { color: '#fbbf24', label: 'Some concerns' },
            { color: '#f87171', label: 'High risk' }
        ];
        ctx.font = '10px system-ui, sans-serif';
        ctx.textAlign = 'left';
        legendItems.forEach(function(item) {
            ctx.fillStyle = item.color;
            ctx.fillRect(legendX, legendY - 8, 10, 10);
            ctx.fillStyle = textColor;
            ctx.fillText(item.label, legendX + 14, legendY);
            legendX += 100;
        });
    }

    /* ================================================================
       TOOL SWITCHING
       ================================================================ */

    function switchTool(tool) {
        currentTool = tool;
        document.querySelectorAll('#ca-tabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tool); });
        document.querySelectorAll('.tab-content').forEach(function(tc) { tc.classList.toggle('active', tc.id === 'tab-' + tool); });

        // Redraw charts when switching to viz tab
        if (tool === 'robviz') {
            setTimeout(function() { drawRoBViz(); }, 100);
        }
    }

    /* ================================================================
       UPDATE FUNCTIONS (original, preserved with enhancements)
       ================================================================ */

    // Suggested RoB 2 domain judgment following the published signalling-question
    // directionality (Sterne et al., BMJ 2019): for some questions "Yes" indicates
    // possible bias, for others "No" does. Approximates the published domain
    // algorithms for this tool's reduced question sets; the badge is a suggestion.
    function rob2DomainJudgment(id, a) {
        function Y(i) { return a[i] === 'Yes' || a[i] === 'Probably Yes'; }
        function N(i) { return a[i] === 'No' || a[i] === 'Probably No'; }
        function NI(i) { return a[i] === 'No Information'; }
        switch (id) {
            case 'D1': // q0 random sequence; q1 concealment; q2 baseline differences suggest problem
                if (N(1)) return 'High risk';
                if (N(0) && Y(2)) return 'High risk';
                if (N(0) || Y(2) || NI(0) || NI(1) || NI(2)) return 'Some concerns';
                return 'Low risk';
            case 'D2': // q0/q1 awareness; q2 deviations arose; q3 deviations affected outcome; q4 appropriate analysis
                if (Y(2) && Y(3)) return 'High risk';
                if (N(4)) return Y(3) ? 'High risk' : 'Some concerns';
                if ((Y(2) && NI(3)) || NI(2) || NI(4)) return 'Some concerns';
                return 'Low risk';
            case 'D3': // q0 nearly-complete data; q1 evidence result not biased; q2 missingness could depend on true value
                if (Y(0)) return 'Low risk';
                if (Y(1)) return 'Low risk';
                if (Y(2)) return 'High risk';
                return 'Some concerns';
            case 'D4': // q0 inappropriate method; q1 measurement differed between groups; q2 assessors aware
                if (Y(0) || Y(1)) return 'High risk';
                if (Y(2) || NI(0) || NI(1) || NI(2)) return 'Some concerns';
                return 'Low risk';
            case 'D5': // q0 pre-specified plan followed; q1 result selected from multiple analyses
                if (Y(1)) return 'High risk';
                if (N(0) || NI(0) || NI(1)) return 'Some concerns';
                return 'Low risk';
        }
        return 'Some concerns';
    }

    function updateRoB() {
        var domainJudgments = {};
        References.rob2.domains.forEach(function(domain) {
            var answers = [];
            domain.questions.forEach(function(q, qi) {
                var qId = domain.id + '_q' + qi;
                var selected = document.querySelector('input[name="ca-' + qId + '"]:checked');
                if (selected) answers.push(selected.value);
            });

            var judgment = 'Not assessed';
            var badgeClass = '';
            if (answers.length === domain.questions.length) {
                judgment = rob2DomainJudgment(domain.id, answers);
                badgeClass = judgment === 'Low risk' ? 'risk-badge--low'
                    : judgment === 'High risk' ? 'risk-badge--high' : 'risk-badge--some';
            }

            domainJudgments[domain.id] = judgment;
            var badge = document.getElementById('ca-judgment-' + domain.id);
            if (badge) {
                badge.textContent = judgment;
                badge.className = 'risk-badge ' + badgeClass;
            }

            // Traffic dot
            var dot = document.getElementById('ca-dot-' + domain.id);
            if (dot) {
                dot.className = 'traffic-dot';
                if (judgment === 'Low risk') dot.className += ' traffic-dot--low';
                else if (judgment === 'High risk') dot.className += ' traffic-dot--high';
                else if (judgment === 'Some concerns') dot.className += ' traffic-dot--some';
                else dot.className += ' traffic-dot--unclear';
            }
        });

        // Overall judgment
        var values = Object.values(domainJudgments);
        var overall = 'Not assessed';
        if (values.every(function(v) { return v !== 'Not assessed'; })) {
            var someCount = values.filter(function(v) { return v === 'Some concerns'; }).length;
            if (values.some(function(v) { return v === 'High risk'; })) {
                overall = 'High risk of bias';
            } else if (values.every(function(v) { return v === 'Low risk'; })) {
                overall = 'Low risk of bias';
            } else if (someCount >= 3) {
                // Published overall rule: some concerns for multiple domains can
                // substantially lower confidence and justify an overall High rating
                overall = 'Some concerns (multiple domains — consider rating overall High risk)';
            } else {
                overall = 'Some concerns';
            }
        }

        var summary = document.getElementById('ca-rob2-summary');
        if (summary) summary.textContent = overall;

        // Traffic light display
        var traffic = document.getElementById('ca-rob2-traffic');
        if (traffic) {
            var html = '';
            References.rob2.domains.forEach(function(d) {
                var j = domainJudgments[d.id];
                var cls = j === 'Low risk' ? 'traffic-dot--low' : j === 'High risk' ? 'traffic-dot--high' : j === 'Some concerns' ? 'traffic-dot--some' : 'traffic-dot--unclear';
                html += '<span class="traffic-dot ' + cls + '" title="' + d.id + ': ' + j + '"></span>';
            });
            App.setTrustedHTML(traffic, html);
        }
    }

    function updateNOS() {
        var stars = 0;
        document.querySelectorAll('input[name^="ca-nos_"]:checked').forEach(function(el) {
            if (el.value === 'star') stars++;
        });
        var scoreEl = document.getElementById('ca-nos-score');
        if (scoreEl) scoreEl.textContent = stars + ' / 9';
        var interpEl = document.getElementById('ca-nos-interp');
        if (interpEl) {
            if (stars >= 7) { interpEl.textContent = 'Good quality study'; interpEl.style.color = 'var(--success)'; }
            else if (stars >= 5) { interpEl.textContent = 'Fair quality study'; interpEl.style.color = 'var(--warning)'; }
            else { interpEl.textContent = 'Poor quality study'; interpEl.style.color = 'var(--danger)'; }
        }

        // Star display
        var starsEl = document.getElementById('ca-nos-stars');
        if (starsEl) {
            var html = '';
            for (var i = 0; i < 9; i++) {
                if (i < stars) html += '<span style="color:var(--warning)">\u2605</span>';
                else html += '<span style="color:var(--text-tertiary)">\u2606</span>';
            }
            App.setTrustedHTML(starsEl, html);
        }
    }

    function updateAMSTAR() {
        var criticalWeaknesses = 0;
        var nonCriticalWeaknesses = 0;

        References.amstar2.items.forEach(function(item) {
            var selected = document.querySelector('input[name="ca-amstar-' + item.id + '"]:checked');
            if (selected && selected.value === 'No') {
                if (item.critical) criticalWeaknesses++;
                else nonCriticalWeaknesses++;
            }
        });

        // Shea et al., BMJ 2017: High = no critical flaw, no or one non-critical
        // weakness; Moderate = no critical flaw, >1 non-critical weakness;
        // Low = one critical flaw; Critically Low = more than one critical flaw.
        var rating = 'Not Assessed';
        var color = 'var(--text-secondary)';
        var detail = '';
        if (criticalWeaknesses === 0 && nonCriticalWeaknesses <= 1) {
            rating = 'High'; color = 'var(--success)';
            detail = nonCriticalWeaknesses + ' non-critical weakness(es), no critical flaws.';
        } else if (criticalWeaknesses === 0) {
            rating = 'Moderate'; color = 'var(--warning)';
            detail = nonCriticalWeaknesses + ' non-critical weaknesses, no critical flaws.';
        } else if (criticalWeaknesses === 1) {
            rating = 'Low'; color = 'var(--warning)';
            detail = '1 critical flaw. ' + nonCriticalWeaknesses + ' non-critical weakness(es).';
        } else {
            rating = 'Critically Low'; color = 'var(--danger)';
            detail = criticalWeaknesses + ' critical flaws. ' + nonCriticalWeaknesses + ' non-critical weakness(es).';
        }

        var el = document.getElementById('ca-amstar-rating');
        if (el) { el.textContent = rating; el.style.color = color; }

        var detailEl = document.getElementById('ca-amstar-detail');
        if (detailEl) detailEl.textContent = detail;
    }

    function updateQUADAS() {
        for (var di = 0; di < 4; di++) {
            var hasNo = false;
            var hasUnclear = false;
            var allAnswered = true;
            var nQ = di === 0 ? 3 : di === 1 ? 2 : di === 2 ? 2 : 3;

            for (var qi = 0; qi < nQ; qi++) {
                var sel = document.querySelector('input[name="ca-quadas_' + di + '_' + qi + '"]:checked');
                if (!sel) { allAnswered = false; continue; }
                if (sel.value === 'No') hasNo = true;
                if (sel.value === 'Unclear') hasUnclear = true;
            }

            var badge = document.getElementById('ca-quadas-' + di);
            if (badge && allAnswered) {
                if (hasNo) { badge.textContent = 'High'; badge.className = 'risk-badge risk-badge--high'; }
                else if (hasUnclear) { badge.textContent = 'Unclear'; badge.className = 'risk-badge risk-badge--some'; }
                else { badge.textContent = 'Low'; badge.className = 'risk-badge risk-badge--low'; }
            }
        }
    }

    function updateGRADE() {
        var base = document.querySelector('input[name="ca-grade-base"]:checked');
        if (!base) return;

        var level = base.value === 'RCT' ? 4 : 2;

        var downSels = document.querySelectorAll('input[name^="ca-grade-down-"]:checked');
        for (var i = 0; i < downSels.length; i++) {
            var sel = downSels[i];
            if (sel.value.indexOf('-1') > -1) level -= 1;
            if (sel.value.indexOf('-2') > -1) level -= 2;
        }

        var upSels = document.querySelectorAll('input[name^="ca-grade-up-"]:checked');
        for (var j = 0; j < upSels.length; j++) {
            var selUp = upSels[j];
            if (selUp.value.indexOf('+1') > -1) level += 1;
            if (selUp.value.indexOf('+2') > -1) level += 2;
        }

        level = Math.max(1, Math.min(4, level));
        var labels = ['', 'Very Low', 'Low', 'Moderate', 'High'];
        var colors = ['', 'var(--danger)', 'var(--warning)', 'var(--info)', 'var(--success)'];
        var symbols = ['', '\u2295\u2296\u2296\u2296', '\u2295\u2295\u2296\u2296', '\u2295\u2295\u2295\u2296', '\u2295\u2295\u2295\u2295'];

        var el = document.getElementById('ca-grade-level');
        if (el) {
            App.setTrustedHTML(el, '<span style="color:' + colors[level] + '">' + symbols[level] + ' ' + labels[level] + '</span>');
        }
    }

    /* ================================================================
       EXPORT FUNCTIONS (original, preserved)
       ================================================================ */

    function exportRoB() {
        var study = document.getElementById('ca-study-name').value || 'Unknown Study';
        var text = 'Risk of Bias 2.0 Assessment: ' + study + '\n\n';
        References.rob2.domains.forEach(function(domain) {
            var badge = document.getElementById('ca-judgment-' + domain.id);
            text += domain.id + ' - ' + domain.name + ': ' + (badge ? badge.textContent : 'Not assessed') + '\n';
        });
        var summary = document.getElementById('ca-rob2-summary');
        text += '\nOverall: ' + (summary ? summary.textContent : 'Not assessed');
        Export.copyText(text);
    }

    function exportNOS() {
        var study = document.getElementById('ca-nos-study').value || 'Unknown Study';
        var score = document.getElementById('ca-nos-score');
        Export.copyText('Newcastle-Ottawa Scale: ' + study + ' -- ' + (score ? score.textContent : ''));
    }

    function exportAMSTAR() {
        var rating = document.getElementById('ca-amstar-rating');
        Export.copyText('AMSTAR-2 Rating: ' + (rating ? rating.textContent : 'Not assessed'));
    }

    function exportQUADAS() {
        var text = 'QUADAS-2 Assessment\n\n';
        var domainNames = ['Patient Selection', 'Index Test', 'Reference Standard', 'Flow and Timing'];
        for (var di = 0; di < 4; di++) {
            var badge = document.getElementById('ca-quadas-' + di);
            var app = document.getElementById('ca-quadas-app-' + di);
            text += domainNames[di] + ': RoB=' + (badge ? badge.textContent : '--') + ', Applicability=' + (app ? app.value : '--') + '\n';
        }
        Export.copyText(text);
    }

    function exportGRADE() {
        var level = document.getElementById('ca-grade-level');
        Export.copyText('GRADE Certainty: ' + (level ? level.textContent : 'Not assessed'));
    }

    function resetRoB() {
        document.querySelectorAll('input[name^="ca-D"]:checked').forEach(function(el) { el.checked = false; });
        updateRoB();
    }

    function saveRoB() {
        var data = {};
        document.querySelectorAll('input[name^="ca-"]:checked').forEach(function(el) {
            data[el.name] = el.value;
        });
        data.studyName = document.getElementById('ca-study-name').value;
        Export.saveCalculation(data.studyName || 'RoB Assessment', MODULE_ID, data);
    }

    /* ================================================================
       REGISTER
       ================================================================ */

    App.registerModule(MODULE_ID, { render: render });

    window.CritAppraisal = {
        switchTool: switchTool,
        updateRoB: updateRoB,
        updateNOS: updateNOS,
        updateAMSTAR: updateAMSTAR,
        updateQUADAS: updateQUADAS,
        updateGRADE: updateGRADE,
        exportRoB: exportRoB,
        exportNOS: exportNOS,
        exportAMSTAR: exportAMSTAR,
        exportQUADAS: exportQUADAS,
        exportGRADE: exportGRADE,
        resetRoB: resetRoB,
        saveRoB: saveRoB,
        // ROBINS-I
        updateROBINS: updateROBINS,
        updateROBINSOverall: updateROBINSOverall,
        exportROBINS: exportROBINS,
        resetROBINS: resetROBINS,
        // JBI
        loadJBI: loadJBI,
        updateJBI: updateJBI,
        exportJBI: exportJBI,
        // SoF Table
        addSoFOutcome: addSoFOutcome,
        clearSoF: clearSoF,
        exportSoF: exportSoF,
        // RoB Visualization
        addToRoBViz: addToRoBViz,
        addManualStudy: addManualStudy,
        removeRoBStudy: removeRoBStudy,
        clearRoBViz: clearRoBViz,
        drawRoBViz: drawRoBViz,
        // CASP Checklists
        loadCASP: loadCASP,
        updateCASP: updateCASP,
        exportCASP: exportCASP,
        resetCASP: resetCASP,
        // Jadad Score
        updateJadad: updateJadad,
        exportJadad: exportJadad,
        resetJadad: resetJadad,
        // NOS Detailed
        loadNOSDetailed: loadNOSDetailed,
        updateNOSDetailed: updateNOSDetailed,
        exportNOSDetailed: exportNOSDetailed,
        resetNOSDetailed: resetNOSDetailed,
        // GRADE Profile (Detailed)
        updateGRADEProfile: updateGRADEProfile,
        exportGRADEProfile: exportGRADEProfile,
        resetGRADEProfile: resetGRADEProfile
    };
})();
