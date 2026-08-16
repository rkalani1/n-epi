/**
 * Neuro-Epi — Reporting Guidelines Hub
 * Interactive checklists for major research reporting guidelines (CONSORT, STROBE, PRISMA, etc.)
 */
(function() {
    'use strict';
    const MODULE_ID = 'reporting-guidelines';

    var currentGuideline = 'CONSORT';
    var checklistState = {};

    /* ------------------------------------------------------------------ */
    /*  Guideline metadata                                                 */
    /* ------------------------------------------------------------------ */
    var guidelines = {
        'CONSORT':   { name: 'CONSORT 2010',     use: 'Randomised controlled trials' },
        'STROBE':    { name: 'STROBE',            use: 'Observational studies (cohort, case-control, cross-sectional)' },
        'PRISMA':    { name: 'PRISMA 2020',       use: 'Systematic reviews and meta-analyses' },
        'PRISMA-ScR':{ name: 'PRISMA-ScR',        use: 'Scoping reviews' },
        'SPIRIT':    { name: 'SPIRIT 2013',       use: 'Clinical trial protocols' },
        'STARD':     { name: 'STARD 2015',        use: 'Diagnostic accuracy studies' },
        'TRIPOD':    { name: 'TRIPOD',            use: 'Prediction model studies' },
        'CARE':      { name: 'CARE (adapted)',    use: 'Case reports' },
        'CHEERS':    { name: 'CHEERS (condensed)', use: 'Health economic evaluations' },
        'ARRIVE':    { name: 'ARRIVE 2.0',        use: 'Animal research' },
        'AGREE-II':  { name: 'AGREE II',          use: 'Clinical practice guidelines appraisal' },
        'RECORD':    { name: 'RECORD (adapted)',  use: 'Studies using routinely collected health data' },
        'MOOSE':     { name: 'MOOSE',             use: 'Meta-analyses of observational studies' }
    };

    /* ------------------------------------------------------------------ */
    /*  Full checklists                                                    */
    /* ------------------------------------------------------------------ */
    var checklists = {};

    checklists['CONSORT'] = [
        { num: '1a', section: 'Title / Abstract', text: 'Identification as a randomised trial in the title' },
        { num: '1b', section: 'Title / Abstract', text: 'Structured summary of trial design, methods, results, and conclusions' },
        { num: '2a', section: 'Introduction', text: 'Scientific background and explanation of rationale' },
        { num: '2b', section: 'Introduction', text: 'Specific objectives or hypotheses' },
        { num: '3a', section: 'Methods', text: 'Description of trial design (e.g., parallel, factorial) including allocation ratio' },
        { num: '3b', section: 'Methods', text: 'Important changes to methods after trial commencement with reasons' },
        { num: '4a', section: 'Methods', text: 'Eligibility criteria for participants' },
        { num: '4b', section: 'Methods', text: 'Settings and locations where the data were collected' },
        { num: '5',  section: 'Methods', text: 'Interventions for each group with sufficient details to allow replication, including how and when administered' },
        { num: '6a', section: 'Methods', text: 'Completely defined pre-specified primary and secondary outcome measures, including how and when assessed' },
        { num: '6b', section: 'Methods', text: 'Any changes to trial outcomes after the trial commenced, with reasons' },
        { num: '7a', section: 'Methods', text: 'How sample size was determined' },
        { num: '7b', section: 'Methods', text: 'When applicable, explanation of any interim analyses and stopping guidelines' },
        { num: '8a', section: 'Methods', text: 'Method used to generate the random allocation sequence' },
        { num: '8b', section: 'Methods', text: 'Type of randomisation; details of any restriction (e.g., blocking and block size)' },
        { num: '9',  section: 'Methods', text: 'Mechanism used to implement the random allocation sequence, describing any steps to conceal the sequence' },
        { num: '10', section: 'Methods', text: 'Who generated the random allocation sequence, enrolled participants, and assigned participants to interventions' },
        { num: '11a', section: 'Methods', text: 'If done, who was blinded after assignment to interventions and how' },
        { num: '11b', section: 'Methods', text: 'If relevant, description of the similarity of interventions' },
        { num: '12a', section: 'Methods', text: 'Statistical methods used to compare groups for primary and secondary outcomes' },
        { num: '12b', section: 'Methods', text: 'Methods for additional analyses, such as subgroup analyses and adjusted analyses' },
        { num: '13a', section: 'Results', text: 'For each group, the numbers of participants randomly assigned, receiving intended treatment, and analysed for the primary outcome' },
        { num: '13b', section: 'Results', text: 'For each group, losses and exclusions after randomisation, together with reasons' },
        { num: '14a', section: 'Results', text: 'Dates defining the periods of recruitment and follow-up' },
        { num: '14b', section: 'Results', text: 'Why the trial ended or was stopped' },
        { num: '15', section: 'Results', text: 'A table showing baseline demographic and clinical characteristics for each group' },
        { num: '16', section: 'Results', text: 'For each group, number of participants (denominator) included in each analysis and whether the analysis was by original assigned groups' },
        { num: '17a', section: 'Results', text: 'For each primary and secondary outcome, results for each group, estimated effect size and its precision (e.g., 95% CI)' },
        { num: '17b', section: 'Results', text: 'For binary outcomes, presentation of both absolute and relative effect sizes is recommended' },
        { num: '18', section: 'Results', text: 'Results of any other analyses performed, including subgroup analyses and adjusted analyses, distinguishing pre-specified from exploratory' },
        { num: '19', section: 'Results', text: 'All important harms or unintended effects in each group' },
        { num: '20', section: 'Discussion', text: 'Trial limitations, addressing sources of potential bias, imprecision, and multiplicity of analyses' },
        { num: '21', section: 'Discussion', text: 'Generalisability (external validity, applicability) of the trial findings' },
        { num: '22', section: 'Discussion', text: 'Interpretation consistent with results, balancing benefits and harms, and considering other relevant evidence' },
        { num: '23', section: 'Other', text: 'Registration number and name of trial registry' },
        { num: '24', section: 'Other', text: 'Where the full trial protocol can be accessed, if available' },
        { num: '25', section: 'Other', text: 'Sources of funding and other support, role of funders' }
    ];

    checklists['STROBE'] = [
        { num: '1',  section: 'Title / Abstract', text: 'Indicate the study design with a commonly used term in the title or abstract; provide an informative and balanced summary' },
        { num: '2',  section: 'Introduction', text: 'Explain the scientific background and rationale for the investigation being reported' },
        { num: '3',  section: 'Introduction', text: 'State specific objectives, including any prespecified hypotheses' },
        { num: '4',  section: 'Methods', text: 'Present key elements of study design early in the paper' },
        { num: '5',  section: 'Methods', text: 'Describe the setting, locations, and relevant dates, including periods of recruitment, exposure, follow-up, and data collection' },
        { num: '6a', section: 'Methods', text: 'Cohort: Give the eligibility criteria, and the sources and methods of selection of participants. Describe methods of follow-up' },
        { num: '6b', section: 'Methods', text: 'Case-control: Give the eligibility criteria, and the sources and methods of case ascertainment and control selection. Give the rationale for the choice of cases and controls' },
        { num: '6c', section: 'Methods', text: 'Cross-sectional: Give the eligibility criteria, and the sources and methods of selection of participants' },
        { num: '6d', section: 'Methods', text: 'For matched studies: give matching criteria and number of exposed and unexposed (cohort) or number of controls per case (case-control) [official STROBE item 6(b)]' },
        { num: '7',  section: 'Methods', text: 'Clearly define all outcomes, exposures, predictors, potential confounders, and effect modifiers. Give diagnostic criteria, if applicable' },
        { num: '8',  section: 'Methods', text: 'For each variable of interest, give sources of data and details of methods of assessment (measurement). Describe comparability of assessment methods if there is more than one group' },
        { num: '9',  section: 'Methods', text: 'Describe any efforts to address potential sources of bias' },
        { num: '10', section: 'Methods', text: 'Explain how the study size was arrived at' },
        { num: '11', section: 'Methods', text: 'Explain how quantitative variables were handled in the analyses. If applicable, describe which groupings were chosen and why' },
        { num: '12a', section: 'Methods', text: 'Describe all statistical methods, including those used to control for confounding' },
        { num: '12b', section: 'Methods', text: 'Describe any methods used to examine subgroups and interactions' },
        { num: '12c', section: 'Methods', text: 'Explain how missing data were addressed' },
        { num: '12d', section: 'Methods', text: 'Cohort: If applicable, explain how loss to follow-up was addressed; Case-control: If applicable, explain how matching of cases and controls was addressed; Cross-sectional: If applicable, describe analytical methods taking account of sampling strategy' },
        { num: '12e', section: 'Methods', text: 'Describe any sensitivity analyses' },
        { num: '13a', section: 'Results', text: 'Report numbers of individuals at each stage of study (e.g., numbers potentially eligible, examined for eligibility, confirmed eligible, included in the study, completing follow-up, and analysed)' },
        { num: '13b', section: 'Results', text: 'Give reasons for non-participation at each stage' },
        { num: '13c', section: 'Results', text: 'Consider use of a flow diagram' },
        { num: '14a', section: 'Results', text: 'Give characteristics of study participants and information on exposures and potential confounders' },
        { num: '14b', section: 'Results', text: 'Indicate number of participants with missing data for each variable of interest' },
        { num: '14c', section: 'Results', text: 'Cohort: Summarise follow-up time (e.g., average and total amount)' },
        { num: '15', section: 'Results', text: 'Cohort: Report numbers of outcome events or summary measures over time; Case-control: Report numbers in each exposure category, or summary measures of exposure; Cross-sectional: Report numbers of outcome events or summary measures' },
        { num: '16a', section: 'Results', text: 'Give unadjusted estimates and, if applicable, confounder-adjusted estimates and their precision. Make clear which confounders were adjusted for and why' },
        { num: '16b', section: 'Results', text: 'Report category boundaries when continuous variables were categorized' },
        { num: '16c', section: 'Results', text: 'If relevant, consider translating estimates of relative risk into absolute risk for a meaningful time period' },
        { num: '17', section: 'Results', text: 'Report other analyses done (e.g., analyses of subgroups and interactions, and sensitivity analyses)' },
        { num: '18', section: 'Discussion', text: 'Summarise key results with reference to study objectives' },
        { num: '19', section: 'Discussion', text: 'Discuss limitations of the study, taking into account sources of potential bias or imprecision. Discuss direction and magnitude of any potential bias' },
        { num: '20', section: 'Discussion', text: 'Give a cautious overall interpretation of results considering objectives, limitations, multiplicity of analyses, results from similar studies, and other relevant evidence' },
        { num: '21', section: 'Discussion', text: 'Discuss the generalisability (external validity) of the study results' },
        { num: '22', section: 'Other', text: 'Give the source of funding and the role of the funders for the present study and, if applicable, for the original study on which the present article is based' }
    ];

    checklists['PRISMA'] = [
        { num: '1',  section: 'Title', text: 'Identify the report as a systematic review' },
        { num: '2',  section: 'Abstract', text: 'Provide a structured summary per the PRISMA 2020 for Abstracts checklist (background, objectives, eligibility, sources, synthesis methods, results, limitations, conclusions, registration)' },
        { num: '3',  section: 'Introduction', text: 'Describe the rationale for the review in the context of existing knowledge' },
        { num: '4',  section: 'Introduction', text: 'Provide an explicit statement of the objective(s) or question(s) the review addresses' },
        { num: '5',  section: 'Methods', text: 'Specify the inclusion and exclusion criteria for the review and how studies were grouped for the syntheses' },
        { num: '6',  section: 'Methods', text: 'Specify all databases, registers, websites, organisations, reference lists and other sources searched or consulted to identify studies; specify date when each source was last searched' },
        { num: '7',  section: 'Methods', text: 'Present the full search strategies for all databases, registers and websites, including any filters and limits used' },
        { num: '8',  section: 'Methods', text: 'Specify methods used to decide whether a study met inclusion criteria, including how many reviewers screened each record, whether they worked independently, and details of any automation tools used' },
        { num: '9',  section: 'Methods', text: 'Specify methods used to collect data from reports, including how many reviewers collected data, whether they worked independently, and any processes for obtaining or confirming data from investigators' },
        { num: '10', section: 'Methods', text: 'List and define all outcomes and other variables for which data were sought; specify whether all results compatible with each outcome domain were sought, and if not, methods used to decide which results to collect' },
        { num: '11', section: 'Methods', text: 'Specify the methods used to assess risk of bias in the included studies, including details of the tool(s) used, how many reviewers assessed each study, whether they worked independently, and any automation tools used' },
        { num: '12', section: 'Methods', text: 'Specify for each outcome the effect measure(s) (e.g., risk ratio, mean difference) used in the synthesis or presentation of results' },
        { num: '13', section: 'Methods', text: 'Describe the processes used to decide which studies were eligible for each synthesis; methods to prepare data for presentation or synthesis; methods to tabulate or visually display results; methods to synthesize results; methods to explore heterogeneity; and any sensitivity analyses' },
        { num: '14', section: 'Methods', text: 'Describe any methods used to assess risk of bias due to missing results in a synthesis (arising from reporting biases)' },
        { num: '15', section: 'Methods', text: 'Describe any methods used to assess certainty (or confidence) in the body of evidence for an outcome' },
        { num: '16', section: 'Results', text: 'Describe the results of the search and selection process, from the number of records identified to the number of studies included, ideally using a PRISMA flow diagram' },
        { num: '17', section: 'Results', text: 'Cite each included study and present its characteristics' },
        { num: '18', section: 'Results', text: 'Present assessments of risk of bias for each included study' },
        { num: '19', section: 'Results', text: 'For all outcomes, present for each study: summary statistics for each group (where appropriate) and an effect estimate and its precision (e.g., confidence interval)' },
        { num: '20', section: 'Results', text: 'For each synthesis, briefly summarise the characteristics and risk of bias among contributing studies; present results of all statistical syntheses conducted; present results of any investigations of heterogeneity; present results of sensitivity analyses' },
        { num: '21', section: 'Results', text: 'Present results of all assessments of risk of bias due to missing results (reporting biases) in syntheses' },
        { num: '22', section: 'Results', text: 'Present assessments of certainty (or confidence) in the body of evidence for each outcome assessed' },
        { num: '23a', section: 'Discussion', text: 'Provide a general interpretation of the results in the context of other evidence' },
        { num: '23b', section: 'Discussion', text: 'Discuss any limitations of the evidence included in the review' },
        { num: '23c', section: 'Discussion', text: 'Discuss any limitations of the review processes used' },
        { num: '23d', section: 'Discussion', text: 'Provide implications of the results for practice, policy, and future research' },
        { num: '24', section: 'Other Information', text: 'Provide registration information for the review (register name and registration number) or state that it was not registered; indicate where the review protocol can be accessed or state that one was not prepared; report any amendments to the registration or protocol' },
        { num: '25', section: 'Other Information', text: 'Describe sources of financial or non-financial support for the review, and the role of the funders or sponsors' },
        { num: '26', section: 'Other Information', text: 'Declare any competing interests of review authors' },
        { num: '27', section: 'Other Information', text: 'Report which of the following are publicly available and where they can be found: template data collection forms; data extracted from included studies; data used for all analyses; analytic code; any other materials used in the review' }
    ];

    checklists['PRISMA-ScR'] = [
        { num: '1',  section: 'Title', text: 'Identify the report as a scoping review' },
        { num: '2',  section: 'Abstract', text: 'Provide a structured summary with objectives, eligibility criteria, sources, charting methods, results, and conclusions' },
        { num: '3',  section: 'Introduction', text: 'Describe the rationale for the scoping review in the context of what is already known' },
        { num: '4',  section: 'Introduction', text: 'Provide an explicit statement of the questions the scoping review addresses (PCC framework)' },
        { num: '5',  section: 'Methods', text: 'Indicate if a scoping review protocol exists and where it can be accessed; state if and where it was registered' },
        { num: '6',  section: 'Methods', text: 'Specify characteristics of the sources of evidence used as eligibility criteria and their rationale' },
        { num: '7',  section: 'Methods', text: 'Describe all information sources and the date last searched' },
        { num: '8',  section: 'Methods', text: 'Present the full search strategy for at least one database including limits used' },
        { num: '9',  section: 'Methods', text: 'State the process for selecting sources of evidence (screening, eligibility)' },
        { num: '10', section: 'Methods', text: 'Describe the methods of charting data from the included sources' },
        { num: '11', section: 'Methods', text: 'List and define all variables for which data were sought and charted' },
        { num: '12', section: 'Methods', text: 'If done, provide the rationale for conducting a critical appraisal; describe the method used' },
        { num: '13', section: 'Methods', text: 'Describe methods of handling and summarizing the data that were charted' },
        { num: '14', section: 'Results', text: 'Give numbers of sources of evidence screened, assessed for eligibility, and included, with reasons for exclusions at each stage' },
        { num: '15', section: 'Results', text: 'Present characteristics of sources of evidence' },
        { num: '16', section: 'Results', text: 'If done, present the critical appraisal results' },
        { num: '17', section: 'Results', text: 'For each included source, present the relevant data that were charted relating to the review questions' },
        { num: '18', section: 'Results', text: 'Present main results (including summary/synthesis of charted data) that relate to the review questions and objectives' },
        { num: '19', section: 'Discussion', text: 'Summarise the main findings, relating them to the review questions and objectives' },
        { num: '20', section: 'Discussion', text: 'Discuss the limitations of the scoping review process' },
        { num: '21', section: 'Discussion', text: 'Provide a general interpretation of the results with respect to the review questions and objectives, as well as potential implications' },
        { num: '22', section: 'Funding', text: 'Describe sources of funding for the included sources of evidence and for the scoping review; role of funders' }
    ];

    checklists['SPIRIT'] = [
        { num: '1',  section: 'Admin', text: 'Descriptive title identifying the study design, population, interventions, and if applicable, trial acronym' },
        { num: '2a', section: 'Admin', text: 'Trial registration number and registry name; for prospectively registered trials, date of registration' },
        { num: '2b', section: 'Admin', text: 'All items from the WHO Trial Registration Data Set' },
        { num: '3',  section: 'Admin', text: 'Protocol version number, date, and amendment history' },
        { num: '4',  section: 'Admin', text: 'Sources and types of financial, material, and other support' },
        { num: '5a', section: 'Admin', text: 'Names, institutional affiliations, and roles of protocol contributors' },
        { num: '5b', section: 'Admin', text: 'Name and contact information for the trial sponsor' },
        { num: '5c', section: 'Admin', text: 'Role of study sponsor and funders in study design, collection, management, analysis, interpretation, report writing, and publication decisions' },
        { num: '5d', section: 'Admin', text: 'Composition, roles, and responsibilities of the coordinating centre, steering committee, endpoint adjudication committee, data management team, and others' },
        { num: '6a', section: 'Introduction', text: 'Description of research question and justification for undertaking the trial, including summary of relevant studies' },
        { num: '6b', section: 'Introduction', text: 'Explanation for choice of comparators' },
        { num: '7',  section: 'Introduction', text: 'Specific objectives or hypotheses' },
        { num: '8',  section: 'Methods', text: 'Description of trial design including type of trial, allocation ratio, and framework (superiority, equivalence, noninferiority, exploratory)' },
        { num: '9',  section: 'Methods', text: 'Description of study settings and list of countries where data will be collected' },
        { num: '10', section: 'Methods', text: 'Eligibility criteria for participants: inclusion and exclusion criteria' },
        { num: '11a', section: 'Methods', text: 'Interventions for each group with sufficient detail to allow replication' },
        { num: '11b', section: 'Methods', text: 'Criteria for discontinuing or modifying allocated interventions' },
        { num: '11c', section: 'Methods', text: 'Strategies to improve adherence and procedures for monitoring adherence' },
        { num: '11d', section: 'Methods', text: 'Relevant concomitant care and interventions permitted or prohibited during the trial' },
        { num: '12', section: 'Methods', text: 'Primary, secondary, and other outcomes including the specific measurement variable, analysis metric, method of aggregation, and time point' },
        { num: '13', section: 'Methods', text: 'Time schedule of enrolment, interventions, assessments, and visits (SPIRIT figure)' },
        { num: '14', section: 'Methods', text: 'Sample size (number of participants or observations, number of events) and its justification' },
        { num: '15', section: 'Methods', text: 'Strategies for achieving adequate participant enrolment' },
        { num: '16a', section: 'Methods', text: 'Method of generating the allocation sequence; type of randomisation, details of any restrictions' },
        { num: '16b', section: 'Methods', text: 'Allocation concealment mechanism and implementation details' },
        { num: '16c', section: 'Methods', text: 'Who will generate the allocation sequence, enrol participants, and assign participants to interventions' },
        { num: '17a', section: 'Methods', text: 'Who will be blinded and how (participants, care providers, outcome assessors, data analysts)' },
        { num: '17b', section: 'Methods', text: 'If blinded, circumstances under which unblinding is permissible and procedure for revealing the allocation' },
        { num: '18a', section: 'Methods', text: 'Plans for data collection and quality assurance (forms, instruments, visits schedule)' },
        { num: '18b', section: 'Methods', text: 'Plans to promote participant retention and complete follow-up, including list of any outcome data to be collected for participants who discontinue or deviate' },
        { num: '19', section: 'Methods', text: 'Plans for data management including data entry, coding, security, and storage' },
        { num: '20a', section: 'Methods', text: 'Statistical methods for analysing primary and secondary outcomes' },
        { num: '20b', section: 'Methods', text: 'Methods for any additional analyses (subgroup, adjusted, sensitivity)' },
        { num: '20c', section: 'Methods', text: 'Definition of analysis population (e.g., ITT, per protocol) and any statistical methods to handle missing data' },
        { num: '21a', section: 'Methods', text: 'Composition of the data monitoring committee (DMC), its role and reporting structure, and statement of whether it is independent from the sponsor (or explanation of why a DMC is not needed)' },
        { num: '21b', section: 'Methods', text: 'Description of any interim analyses and stopping guidelines, including who will have access to the interim results and make the final decision to terminate the trial' },
        { num: '22', section: 'Methods', text: 'Plans for collecting, assessing, reporting, and managing solicited and spontaneously reported adverse events and other unintended effects of trial interventions or trial conduct (harms)' },
        { num: '23', section: 'Methods', text: 'Frequency and procedures for auditing trial conduct, if any, and whether the process will be independent from investigators and the sponsor' },
        { num: '24', section: 'Ethics', text: 'Plans for seeking research ethics/IRB approval' },
        { num: '25', section: 'Ethics', text: 'Plans for communicating important protocol amendments to relevant parties (investigators, ethics committees, participants, registries, journals, regulators)' },
        { num: '26a', section: 'Ethics', text: 'Plans for seeking informed consent or assent, including any provisions for surrogate consent' },
        { num: '26b', section: 'Ethics', text: 'Additional consent provisions for collection and use of participant data and biological specimens in ancillary studies, if applicable' },
        { num: '27', section: 'Ethics', text: 'How personal information about potential and enrolled participants will be protected (confidentiality)' },
        { num: '28', section: 'Ethics', text: 'Financial and other competing interests for principal investigators for the overall trial and each study site' },
        { num: '29', section: 'Ethics', text: 'Statement of who will have access to the final trial dataset, and disclosure of contractual agreements that limit such access for investigators' },
        { num: '30', section: 'Ethics', text: 'Provisions, if any, for ancillary and post-trial care, and for compensation to those who suffer harm from trial participation' },
        { num: '31a', section: 'Dissemination', text: 'Plans for investigators and sponsor to communicate trial results to participants, healthcare professionals, the public, and other relevant groups' },
        { num: '31b', section: 'Dissemination', text: 'Authorship eligibility guidelines and any intended use of professional writers' },
        { num: '31c', section: 'Dissemination', text: 'Plans for granting public access to the full protocol, participant-level dataset, and statistical code' },
        { num: '32', section: 'Appendices', text: 'Model consent form and other related documentation given to participants and authorised surrogates' },
        { num: '33', section: 'Appendices', text: 'Plans for collection, laboratory evaluation, and storage of biological specimens for genetic or molecular analysis in this trial or future use in ancillary studies, if applicable' }
    ];

    checklists['STARD'] = [
        { num: '1',  section: 'Title / Abstract', text: 'Identification as a study of diagnostic accuracy using at least one measure (sensitivity, specificity, predictive values, or AUC)' },
        { num: '2',  section: 'Abstract', text: 'Structured abstract with study design, methods, results, and conclusions' },
        { num: '3',  section: 'Introduction', text: 'Scientific and clinical background, including the intended use and clinical role of the index test' },
        { num: '4',  section: 'Introduction', text: 'Study objectives and hypotheses' },
        { num: '5',  section: 'Methods', text: 'Whether data collection was planned before the index test and reference standard were performed (prospective study) or after (retrospective study)' },
        { num: '6',  section: 'Methods', text: 'Eligibility criteria' },
        { num: '7',  section: 'Methods', text: 'On what basis potentially eligible participants were identified (symptoms, results from previous tests, inclusion in registry)' },
        { num: '8',  section: 'Methods', text: 'Where and when potentially eligible participants were identified (setting, location and dates)' },
        { num: '9',  section: 'Methods', text: 'Whether participants formed a consecutive, random, or convenience series' },
        { num: '10a', section: 'Methods', text: 'Index test, in sufficient detail to allow replication' },
        { num: '10b', section: 'Methods', text: 'Reference standard, in sufficient detail to allow replication' },
        { num: '11', section: 'Methods', text: 'Rationale for choosing the reference standard (if alternatives exist)' },
        { num: '12a', section: 'Methods', text: 'Definition of and rationale for test positivity cut-offs or result categories of the index test, distinguishing pre-specified from exploratory' },
        { num: '12b', section: 'Methods', text: 'Definition of and rationale for test positivity cut-offs or result categories of the reference standard' },
        { num: '13a', section: 'Methods', text: 'Whether clinical information and reference standard results were available to the performers/readers of the index test' },
        { num: '13b', section: 'Methods', text: 'Whether clinical information and index test results were available to the assessors of the reference standard' },
        { num: '14', section: 'Methods', text: 'Methods for estimating or comparing measures of diagnostic accuracy' },
        { num: '15', section: 'Methods', text: 'How indeterminate index test or reference standard results were handled' },
        { num: '16', section: 'Methods', text: 'How missing data on the index test and reference standard were handled' },
        { num: '17', section: 'Methods', text: 'Any analyses of variability in diagnostic accuracy, distinguishing pre-specified from exploratory' },
        { num: '18', section: 'Methods', text: 'Intended sample size and how it was determined' },
        { num: '19', section: 'Results', text: 'Flow of participants, using a diagram' },
        { num: '20', section: 'Results', text: 'Baseline demographic and clinical characteristics of participants' },
        { num: '21', section: 'Results', text: 'Distribution of severity of disease in those with the target condition; other diagnoses in those without' },
        { num: '22', section: 'Results', text: 'Time interval and any clinical interventions between index test and reference standard' },
        { num: '23', section: 'Results', text: 'A cross tabulation of the index test results by the results of the reference standard' },
        { num: '24', section: 'Results', text: 'Estimates of diagnostic accuracy and their precision (e.g., 95% CI)' },
        { num: '25', section: 'Results', text: 'Any adverse events from performing the index test or the reference standard' },
        { num: '26', section: 'Discussion', text: 'Study limitations including sources of potential bias, statistical uncertainty, and generalisability' },
        { num: '27', section: 'Discussion', text: 'Implications for practice, including the intended use and clinical role of the index test' },
        { num: '28', section: 'Other', text: 'Registration number and name of registry' },
        { num: '29', section: 'Other', text: 'Where the full study protocol can be accessed' },
        { num: '30', section: 'Other', text: 'Sources of funding and other support; role of funders' }
    ];

    checklists['TRIPOD'] = [
        { num: '1',  section: 'Title', text: 'Identify the study as developing and/or validating a multivariable prediction model, the target population, and the outcome' },
        { num: '2',  section: 'Abstract', text: 'Provide a summary of objectives, study design, setting, participants, sample size, predictors, outcome, statistical analysis, results, and conclusions' },
        { num: '3a', section: 'Introduction', text: 'Explain the medical context and rationale for developing or validating the prediction model' },
        { num: '3b', section: 'Introduction', text: 'Specify the objectives, including whether the study describes development or validation of the model or both' },
        { num: '4a', section: 'Methods', text: 'Describe the study design or source of data separately for development and validation data sets' },
        { num: '4b', section: 'Methods', text: 'Specify the key study dates, including start of accrual, end of accrual, and end of follow-up' },
        { num: '5a', section: 'Methods', text: 'Specify key elements of the study setting including number and location of centres' },
        { num: '5b', section: 'Methods', text: 'Describe eligibility criteria for participants' },
        { num: '5c', section: 'Methods', text: 'Give details of treatments received, if relevant' },
        { num: '6a', section: 'Methods', text: 'Clearly define the outcome that is predicted by the prediction model including how and when assessed' },
        { num: '6b', section: 'Methods', text: 'Report any actions to blind assessment of the outcome to be predicted' },
        { num: '7a', section: 'Methods', text: 'Clearly define all predictors used in developing the model, including how and when they were measured' },
        { num: '7b', section: 'Methods', text: 'Report any actions to blind assessment of predictors for the outcome and other predictors' },
        { num: '8',  section: 'Methods', text: 'Explain how the study size was arrived at' },
        { num: '9',  section: 'Methods', text: 'Describe how missing data were handled with details of any imputation method' },
        { num: '10a', section: 'Methods', text: 'Describe how predictors were handled in the analyses' },
        { num: '10b', section: 'Methods', text: 'Specify type of model, all model-building procedures, and method for internal validation' },
        { num: '10c', section: 'Methods', text: 'For validation, describe how the predictions were calculated' },
        { num: '10d', section: 'Methods', text: 'Specify all measures used to assess model performance and, if relevant, to compare multiple models' },
        { num: '11', section: 'Methods', text: 'Provide details on how risk groups were created, if done' },
        { num: '12', section: 'Methods', text: 'For validation, identify any differences from the development data in setting, eligibility criteria, outcome, and predictors' },
        { num: '13a', section: 'Results', text: 'Describe the flow of participants, including the number of participants and outcome events in each analysis' },
        { num: '13b', section: 'Results', text: 'Describe the characteristics of the participants, including the number with missing data for predictors and outcome' },
        { num: '14a', section: 'Results', text: 'Specify the number of participants and outcome events in each analysis' },
        { num: '14b', section: 'Results', text: 'If done, report the unadjusted association between each candidate predictor and outcome' },
        { num: '15a', section: 'Results', text: 'Present the full prediction model to allow predictions for individuals' },
        { num: '15b', section: 'Results', text: 'Explain how to use the prediction model' },
        { num: '16', section: 'Results', text: 'Report performance measures (with CIs) for the prediction model' },
        { num: '17', section: 'Results', text: 'If done, report the results from any model updating' },
        { num: '18', section: 'Discussion', text: 'Discuss any limitations of the study (data source, outcome, predictors)' },
        { num: '19a', section: 'Discussion', text: 'For validation, discuss the results with reference to performance in the development data, and any other validation data' },
        { num: '19b', section: 'Discussion', text: 'Give an overall interpretation of the results considering objectives, limitations, and results from similar studies' },
        { num: '20', section: 'Discussion', text: 'Discuss the potential clinical use of the model and implications for future research' },
        { num: '21', section: 'Other', text: 'Provide information about the availability of supplementary resources (data, analytic code, prediction model)' },
        { num: '22', section: 'Other', text: 'Give the source of funding and the role of the funders' }
    ];

    checklists['CARE'] = [
        { num: '1',  section: 'Title', text: 'The words "case report" should appear in the title along with the area of focus' },
        { num: '2',  section: 'Keywords', text: 'Two to five keywords that identify the case' },
        { num: '3a', section: 'Abstract', text: 'Introduction: What is unique about this case? What does it add to the medical literature?' },
        { num: '3b', section: 'Abstract', text: 'Main symptoms, important clinical findings, main diagnoses, interventions, outcomes' },
        { num: '3c', section: 'Abstract', text: 'Conclusion: What are the main take-away lessons from this case?' },
        { num: '4',  section: 'Introduction', text: 'Brief background summary of the case referencing relevant medical literature' },
        { num: '5a', section: 'Patient Information', text: 'De-identified patient demographics' },
        { num: '5b', section: 'Patient Information', text: 'Main symptoms of the patient (chief complaints)' },
        { num: '5c', section: 'Patient Information', text: 'Medical, family, and psychosocial history including diet, lifestyle, genetic information' },
        { num: '5d', section: 'Patient Information', text: 'Relevant past interventions and their outcomes' },
        { num: '6',  section: 'Clinical Findings', text: 'Describe the relevant physical examination (PE) findings' },
        { num: '7',  section: 'Timeline', text: 'Depict important dates and times in this case as a table or figure' },
        { num: '8a', section: 'Diagnostic Assessment', text: 'Diagnostic methods (PE, laboratory testing, imaging, questionnaires)' },
        { num: '8b', section: 'Diagnostic Assessment', text: 'Diagnostic challenges (e.g., financial, language/cultural)' },
        { num: '8c', section: 'Diagnostic Assessment', text: 'Diagnostic reasoning including other diagnoses considered' },
        { num: '8d', section: 'Diagnostic Assessment', text: 'Prognostic characteristics where applicable' },
        { num: '9a', section: 'Therapeutic Intervention', text: 'Types of intervention (pharmacologic, surgical, preventive, self-care)' },
        { num: '9b', section: 'Therapeutic Intervention', text: 'Administration of intervention (dosage, strength, duration)' },
        { num: '9c', section: 'Therapeutic Intervention', text: 'Changes in therapeutic interventions with rationale' },
        { num: '10a', section: 'Follow-up and Outcomes', text: 'Clinician and patient-assessed outcomes when appropriate' },
        { num: '10b', section: 'Follow-up and Outcomes', text: 'Important follow-up diagnostic and other test results' },
        { num: '10c', section: 'Follow-up and Outcomes', text: 'Intervention adherence and tolerability (and how assessed)' },
        { num: '10d', section: 'Follow-up and Outcomes', text: 'Adverse and unanticipated events' },
        { num: '11', section: 'Discussion', text: 'Strengths and limitations in the management of this case' },
        { num: '12', section: 'Discussion', text: 'Discussion of the relevant medical literature with references' },
        { num: '13', section: 'Discussion', text: 'The rationale for conclusions (including assessment of possible causes)' },
        { num: '14', section: 'Discussion', text: 'The primary take-away lessons of this case report' },
        { num: '15', section: 'Patient Perspective', text: 'When appropriate, the patient should share their perspective on the treatments received' },
        { num: '16', section: 'Informed Consent', text: 'The patient should give informed consent for the publication of the report' }
    ];

    // Condensed working list — the official CHEERS 2022 statement (Husereau et
    // al., BMJ 2022) has 28 items; complete it for journal submission.
    checklists['CHEERS'] = [
        { num: '1',  section: 'Title', text: 'Identify the study as an economic evaluation and specify the interventions being compared' },
        { num: '2',  section: 'Abstract', text: 'Provide a structured summary including objectives, perspective, setting, methods, results, and conclusions' },
        { num: '3',  section: 'Introduction', text: 'Provide an explicit statement of the broader context for the study and present the study question with sub-questions' },
        { num: '4',  section: 'Methods', text: 'Indicate the health decision problem and its overall context' },
        { num: '5',  section: 'Methods', text: 'Describe the characteristics of the base-case population (who is affected by the intervention)' },
        { num: '6',  section: 'Methods', text: 'State the location, relevant features, and why chosen' },
        { num: '7',  section: 'Methods', text: 'Describe comparators with rationale' },
        { num: '8',  section: 'Methods', text: 'State the perspective(s) adopted and justify' },
        { num: '9',  section: 'Methods', text: 'Describe the time horizon for costs and outcomes and the discount rate' },
        { num: '10', section: 'Methods', text: 'Describe how health outcomes were measured or valued' },
        { num: '11', section: 'Methods', text: 'Describe approaches used to estimate resource use and costs' },
        { num: '12', section: 'Methods', text: 'Describe currency, price date, and conversion' },
        { num: '13', section: 'Methods', text: 'Describe and justify the model structure, diagram if applicable' },
        { num: '14', section: 'Methods', text: 'Describe all analytical methods supporting the evaluation; describe approaches for uncertainty analysis' },
        { num: '15', section: 'Results', text: 'Report the values, ranges, references, and probability distributions for all parameters' },
        { num: '16', section: 'Results', text: 'Report mean values for the main categories of costs and outcomes and summarize in a cost-effectiveness table' },
        { num: '17', section: 'Results', text: 'Describe the effects of uncertainty; present sensitivity analyses, scenario analyses, etc.' },
        { num: '18', section: 'Discussion', text: 'Summarise key findings and describe how they support the conclusions reached. Discuss limitations and generalisability' },
        { num: '19', section: 'Other', text: 'Describe how the study was funded and the role of the funder; report conflicts of interest' }
    ];

    checklists['ARRIVE'] = [
        { num: '1',  section: 'Essential', text: 'Study design: Provide details of the study design including the type of experimental design and specify the experimental unit' },
        { num: '2',  section: 'Essential', text: 'Sample size: Specify the total number of animals used in each experiment, and the number of animals in each experimental group. Explain how the sample size was decided' },
        { num: '3',  section: 'Essential', text: 'Inclusion and exclusion criteria: Describe any a priori criteria used for including and excluding animals (or experimental units), and data points' },
        { num: '4',  section: 'Essential', text: 'Randomisation: State whether randomisation was used to allocate experimental units to control and treatment groups. If done, describe the method' },
        { num: '5',  section: 'Essential', text: 'Blinding: Describe who was blinded to the group allocation and outcome assessment, and how' },
        { num: '6',  section: 'Essential', text: 'Outcome measures: Clearly define all outcome measures assessed (primary and secondary)' },
        { num: '7',  section: 'Essential', text: 'Statistical methods: Provide details of the statistical methods used for each analysis, methods for assessing model assumptions' },
        { num: '8',  section: 'Essential', text: 'Experimental animals: Provide species-specific details such as species, strain, sex, developmental stage, weight, and source' },
        { num: '9',  section: 'Essential', text: 'Experimental procedures: Describe each procedure, treatment, and intervention (including route of delivery, frequency, anaesthesia, analgesia, and surgical procedure)' },
        { num: '10', section: 'Essential', text: 'Results: Report results for each outcome measure with a measure of precision (e.g., SEM or CI). For hypothesis testing, report exact p values' },
        { num: '11', section: 'Recommended', text: 'Abstract: Provide an accurate summary of the research objectives, animal species, key methods, principal findings, and the study interpretation' },
        { num: '12', section: 'Recommended', text: 'Background: Include sufficient scientific background to understand the rationale and context for the study, and explain the experimental approach' },
        { num: '13', section: 'Recommended', text: 'Objectives: Clearly describe the research question(s) that the study addresses. Indicate the primary objective(s) and any pre-specified hypotheses' },
        { num: '14', section: 'Recommended', text: 'Ethical statement: Provide the name of the ethical review committee or body that approved the study and the licence/protocol number' },
        { num: '15', section: 'Recommended', text: 'Housing and husbandry: Provide details of housing and husbandry conditions such as cage type, bedding, food and water access, light/dark cycle, temperature, and enrichment' },
        { num: '16', section: 'Recommended', text: 'Animal care and monitoring: Describe any interventions or steps taken to reduce severity of experimental procedures; note any humane endpoints' },
        { num: '17', section: 'Recommended', text: 'Interpretation/scientific implications: Interpret the results, taking into account the study objectives and hypotheses, current evidence, and limitations' },
        { num: '18', section: 'Recommended', text: 'Generalisability/translation: Comment on whether the findings can be generalised to other species or experimental conditions (external validity) and potential translational implications' },
        { num: '19', section: 'Recommended', text: 'Protocol registration: Provide a link to the protocol if registered' },
        { num: '20', section: 'Recommended', text: 'Data access: Include a statement describing if and where study data can be accessed' },
        { num: '21', section: 'Recommended', text: 'Declaration of interests: Declare all potential competing or financial interests that could be perceived to influence the research' }
    ];

    checklists['AGREE-II'] = [
        { num: '1',  section: 'Scope and Purpose', text: 'The overall objective(s) of the guideline is (are) specifically described' },
        { num: '2',  section: 'Scope and Purpose', text: 'The health question(s) covered by the guideline is (are) specifically described' },
        { num: '3',  section: 'Scope and Purpose', text: 'The population (patients, public, etc.) to whom the guideline is meant to apply is specifically described' },
        { num: '4',  section: 'Stakeholder Involvement', text: 'The guideline development group includes individuals from all relevant professional groups' },
        { num: '5',  section: 'Stakeholder Involvement', text: 'The views and preferences of the target population (patients, public, etc.) have been sought' },
        { num: '6',  section: 'Stakeholder Involvement', text: 'The target users of the guideline are clearly defined' },
        { num: '7',  section: 'Rigour of Development', text: 'Systematic methods were used to search for evidence' },
        { num: '8',  section: 'Rigour of Development', text: 'The criteria for selecting the evidence are clearly described' },
        { num: '9',  section: 'Rigour of Development', text: 'The strengths and limitations of the body of evidence are clearly described' },
        { num: '10', section: 'Rigour of Development', text: 'The methods for formulating the recommendations are clearly described' },
        { num: '11', section: 'Rigour of Development', text: 'The health benefits, side effects, and risks have been considered in formulating the recommendations' },
        { num: '12', section: 'Rigour of Development', text: 'There is an explicit link between the recommendations and the supporting evidence' },
        { num: '13', section: 'Rigour of Development', text: 'The guideline has been externally reviewed by experts prior to its publication' },
        { num: '14', section: 'Rigour of Development', text: 'A procedure for updating the guideline is provided' },
        { num: '15', section: 'Clarity of Presentation', text: 'The recommendations are specific and unambiguous' },
        { num: '16', section: 'Clarity of Presentation', text: 'The different options for management of the condition or health issue are clearly presented' },
        { num: '17', section: 'Clarity of Presentation', text: 'Key recommendations are easily identifiable' },
        { num: '18', section: 'Applicability', text: 'The guideline describes facilitators and barriers to its application' },
        { num: '19', section: 'Applicability', text: 'The guideline provides advice and/or tools on how the recommendations can be put into practice' },
        { num: '20', section: 'Applicability', text: 'The potential resource implications of applying the recommendations have been considered' },
        { num: '21', section: 'Applicability', text: 'The guideline presents monitoring and/or auditing criteria' },
        { num: '22', section: 'Editorial Independence', text: 'The views of the funding body have not influenced the content of the guideline' },
        { num: '23', section: 'Editorial Independence', text: 'Competing interests of guideline development group members have been recorded and addressed' }
    ];

    checklists['RECORD'] = [
        { num: 'R1',  section: 'Title / Abstract', text: 'The type of data used should be specified in the title or abstract. When possible, the name of the databases used should be included' },
        { num: 'R2',  section: 'Title / Abstract', text: 'The geographic region and time frame should be specified' },
        { num: 'R3',  section: 'Methods', text: 'The population of interest and the database used to create the study population should be described in detail' },
        { num: 'R4',  section: 'Methods', text: 'Any validation studies of the codes or algorithms used to identify participants should be referenced' },
        { num: 'R5',  section: 'Methods', text: 'Complete list of codes and algorithms used to classify exposures, outcomes, confounders, and effect modifiers' },
        { num: 'R6',  section: 'Methods', text: 'State the methods for data cleaning; describe if data linkage was performed' },
        { num: 'R7',  section: 'Methods', text: 'If applicable, describe the methods of study size calculation' },
        { num: 'R8',  section: 'Results', text: 'Describe the completeness of data, including percentage of missing and/or unavailable data' },
        { num: 'R9',  section: 'Results', text: 'Authors should provide information on who had access to the data, data security procedures, and any audit processes' },
        { num: 'R10', section: 'Discussion', text: 'Discuss the implications of using data that were not created for the purpose of the study' },
        { num: 'R11', section: 'Other', text: 'State whether the study included person-level, institutional-level, or other data' },
        { num: 'R12', section: 'Other', text: 'Authors should provide information on data access and cleaning methods' },
        { num: 'R13', section: 'Other', text: 'Authors should describe ethical approval requirements and the involvement of patients/public in the research' }
    ];

    checklists['MOOSE'] = [
        { num: '1',  section: 'Reporting of Background', text: 'Problem definition' },
        { num: '2',  section: 'Reporting of Background', text: 'Hypothesis statement' },
        { num: '3',  section: 'Reporting of Background', text: 'Description of study outcome(s)' },
        { num: '4',  section: 'Reporting of Background', text: 'Type of exposure or intervention used' },
        { num: '5',  section: 'Reporting of Background', text: 'Type of study designs used' },
        { num: '6',  section: 'Reporting of Background', text: 'Study population' },
        { num: '7',  section: 'Reporting of Search Strategy', text: 'Qualifications of searchers (e.g., librarians and investigators)' },
        { num: '8',  section: 'Reporting of Search Strategy', text: 'Search strategy, including time period included in the synthesis and keywords' },
        { num: '9',  section: 'Reporting of Search Strategy', text: 'Effort to include all available studies, including contact with authors' },
        { num: '10', section: 'Reporting of Search Strategy', text: 'Databases and registries searched' },
        { num: '11', section: 'Reporting of Search Strategy', text: 'Search software used, name and version, including special features used' },
        { num: '12', section: 'Reporting of Search Strategy', text: 'Use of hand searching (e.g., reference lists of obtained articles)' },
        { num: '13', section: 'Reporting of Search Strategy', text: 'List of citations located and those excluded, including justification' },
        { num: '14', section: 'Reporting of Search Strategy', text: 'Method of addressing articles published in languages other than English' },
        { num: '15', section: 'Reporting of Search Strategy', text: 'Method of handling abstracts and unpublished studies' },
        { num: '16', section: 'Reporting of Search Strategy', text: 'Description of any contact with authors' },
        { num: '17', section: 'Reporting of Methods', text: 'Description of relevance or appropriateness of studies assembled for assessing the hypothesis' },
        { num: '18', section: 'Reporting of Methods', text: 'Rationale for the selection and coding of data (e.g., sound clinical principles or convenience)' },
        { num: '19', section: 'Reporting of Methods', text: 'Documentation of how data were classified and coded (e.g., multiple raters, blinding, inter-rater reliability)' },
        { num: '20', section: 'Reporting of Methods', text: 'Assessment of confounding (e.g., comparability of cases/controls in studies where appropriate)' },
        { num: '21', section: 'Reporting of Methods', text: 'Assessment of study quality, including blinding of quality assessors; stratification or regression on possible predictors of study results' },
        { num: '22', section: 'Reporting of Methods', text: 'Assessment of heterogeneity' },
        { num: '23', section: 'Reporting of Methods', text: 'Description of statistical methods in sufficient detail to be replicated' },
        { num: '24', section: 'Reporting of Methods', text: 'Provision of appropriate tables and graphics' },
        { num: '25', section: 'Reporting of Results', text: 'Graphic summarizing individual study estimates and overall estimate' },
        { num: '26', section: 'Reporting of Results', text: 'Table giving descriptive information for each study included' },
        { num: '27', section: 'Reporting of Results', text: 'Results of sensitivity testing (e.g., subgroup analysis)' },
        { num: '28', section: 'Reporting of Results', text: 'Indication of statistical uncertainty of findings' },
        { num: '29', section: 'Reporting of Discussion', text: 'Quantitative assessment of bias (e.g., publication bias)' },
        { num: '30', section: 'Reporting of Discussion', text: 'Justification for exclusion (e.g., exclusion of non-English-language citations)' },
        { num: '31', section: 'Reporting of Discussion', text: 'Assessment of quality of included studies' },
        { num: '32', section: 'Reporting of Conclusions', text: 'Consideration of alternative explanations for observed results' },
        { num: '33', section: 'Reporting of Conclusions', text: 'Generalization of the conclusions' },
        { num: '34', section: 'Reporting of Conclusions', text: 'Guidelines for future research' },
        { num: '35', section: 'Reporting of Conclusions', text: 'Disclosure of funding source' }
    ];

    /* ------------------------------------------------------------------ */
    /*  Render                                                             */
    /* ------------------------------------------------------------------ */
    function render(container) {
        var html = App.createModuleLayout(
            'Reporting Guidelines Hub',
            'Interactive checklists for major research reporting guidelines. Select a guideline, track your progress, and export completed checklists.'
        );

        // Learn & Reference section
        html += '<div class="card" style="background: var(--bg-secondary); border-left: 4px solid var(--accent-color);">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\')">&#128218; Learn &amp; Reference <span style="font-size:0.8em; color: var(--text-muted);">(click to expand)</span></div>';
        html += '<div class="learn-body hidden">';

        html += '<div style="margin-bottom:1.2rem;">';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">When to Use Which Guideline</div>';
        html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
        html += '<li><strong>CONSORT</strong> &rarr; RCTs (parallel, cluster, non-inferiority, equivalence)</li>';
        html += '<li><strong>STROBE</strong> &rarr; Observational studies (cohort, case-control, cross-sectional)</li>';
        html += '<li><strong>PRISMA</strong> &rarr; Systematic reviews and meta-analyses</li>';
        html += '<li><strong>PRISMA-ScR</strong> &rarr; Scoping reviews</li>';
        html += '<li><strong>SPIRIT</strong> &rarr; Clinical trial protocols</li>';
        html += '<li><strong>STARD</strong> &rarr; Diagnostic / prognostic accuracy studies</li>';
        html += '<li><strong>TRIPOD</strong> &rarr; Prediction model development and validation</li>';
        html += '<li><strong>CARE</strong> &rarr; Case reports and case series</li>';
        html += '<li><strong>CHEERS</strong> &rarr; Health economic evaluations</li>';
        html += '<li><strong>ARRIVE</strong> &rarr; Animal research</li>';
        html += '<li><strong>AGREE II</strong> &rarr; Clinical practice guidelines appraisal</li>';
        html += '<li><strong>RECORD</strong> &rarr; Studies using routinely collected health data</li>';
        html += '<li><strong>MOOSE</strong> &rarr; Meta-analyses of observational studies</li>';
        html += '</ul>';
        html += '</div>';

        html += '<div style="margin-bottom:1.2rem;">';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Key Principles of Research Reporting</div>';
        html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
        html += '<li>Complete reporting improves reproducibility and reduces research waste.</li>';
        html += '<li>Checklists are reporting aids, <strong>not quality assessment tools</strong>. A well-reported study can still be poorly designed.</li>';
        html += '<li>All checklist items should be addressed, even if &ldquo;not applicable&rdquo; &mdash; state why it does not apply.</li>';
        html += '<li>Include page/section numbers for each item when submitting to journals.</li>';
        html += '<li>Many journals now <strong>require</strong> completed checklists at submission (BMJ, Lancet, JAMA, PLOS Medicine).</li>';
        html += '<li>The EQUATOR Network (equator-network.org) maintains the definitive library of reporting guidelines.</li>';
        html += '</ul>';
        html += '</div>';

        html += '<div style="margin-bottom:1.2rem;">';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Reporting Guideline Extensions</div>';
        html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
        html += '<li><strong>CONSORT extensions:</strong> Cluster trials, non-inferiority, pragmatic trials, harms, pilot/feasibility, N-of-1, PRO, herbal interventions</li>';
        html += '<li><strong>STROBE extensions:</strong> STROBE-ME (molecular epidemiology), STROBE-Vet (veterinary), STROBE-NI (neonatal infections), RECORD (routinely collected data)</li>';
        html += '<li><strong>PRISMA extensions:</strong> PRISMA-P (protocols), PRISMA-IPD (individual patient data), PRISMA-NMA (network meta-analysis), PRISMA-DTA (diagnostic test accuracy), PRISMA-S (search reporting)</li>';
        html += '<li><strong>Other notable:</strong> SQUIRE 2.0 (quality improvement), TIDieR (intervention description), SRQR (qualitative research), COREQ (qualitative interviews/focus groups)</li>';
        html += '</ul>';
        html += '</div>';

        html += '<div style="margin-bottom:1.2rem;">';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Common Pitfalls</div>';
        html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
        html += '<li>Treating checklists as quality scores or risk-of-bias tools</li>';
        html += '<li>Omitting negative/null results or unfavorable secondary outcomes</li>';
        html += '<li>Inadequate flow diagrams (CONSORT, PRISMA, STARD all require flow diagrams)</li>';
        html += '<li>Not registering protocols prospectively (ClinicalTrials.gov, PROSPERO, OSF)</li>';
        html += '<li>Using the wrong guideline for your study type (e.g., STROBE for an RCT)</li>';
        html += '<li>Completing the checklist <em>after</em> writing the paper instead of using it during drafting</li>';
        html += '<li>Not specifying primary vs secondary outcomes clearly</li>';
        html += '<li>Inadequate reporting of missing data handling</li>';
        html += '</ul>';
        html += '</div>';

        html += '<div style="margin-bottom:1.2rem;">';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">How to Use Checklists Effectively</div>';
        html += '<ol style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
        html += '<li><strong>Before writing:</strong> Review the checklist to ensure your study design and data collection will support complete reporting.</li>';
        html += '<li><strong>During writing:</strong> Use the checklist as an outline. Address each item as you draft each section.</li>';
        html += '<li><strong>Before submission:</strong> Complete the checklist formally with page numbers. Upload as supplementary material.</li>';
        html += '<li><strong>During peer review:</strong> Use reviewer comments to fill gaps identified by the checklist.</li>';
        html += '</ol>';
        html += '</div>';

        html += '<div>';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Key References</div>';
        html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>EQUATOR Network: equator-network.org (Enhancing the QUAlity and Transparency Of health Research)</li>';
        html += '<li>Schulz KF et al. CONSORT 2010 Statement. BMJ. 2010;340:c332</li>';
        html += '<li>von Elm E et al. STROBE Statement. Lancet. 2007;370(9596):1453-1457</li>';
        html += '<li>Page MJ et al. PRISMA 2020 Statement. BMJ. 2021;372:n71</li>';
        html += '<li>Chan AW et al. SPIRIT 2013 Statement. Ann Intern Med. 2013;158(3):200-207</li>';
        html += '<li>Bossuyt PM et al. STARD 2015 Updated Reporting Guidelines. BMJ. 2015;351:h5527</li>';
        html += '<li>Collins GS et al. TRIPOD Statement. Ann Intern Med. 2015;162(1):55-63</li>';
        html += '<li>Glasziou P et al. Reducing waste from incomplete or unusable reports. Lancet. 2014;383(9913):267-276</li>';
        html += '</ul>';
        html += '</div>';

        html += '</div></div>';

        /* Card 1: Guideline Selector */
        html += '<div class="card">';
        html += '<div class="card-title">Select Reporting Guideline</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group">';
        html += '<label class="form-label">Guideline</label>';
        html += '<select class="form-select" id="rg-guideline-select" onchange="ReportingGuide.selectGuideline()">';
        var keys = Object.keys(guidelines);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var sel = (k === currentGuideline) ? ' selected' : '';
            html += '<option value="' + k + '"' + sel + '>' + guidelines[k].name + '</option>';
        }
        html += '</select>';
        html += '</div>';
        html += '<div class="form-group">';
        html += '<label class="form-label">When to Use</label>';
        html += '<div class="form-input" id="rg-description" style="background:var(--bg-elevated);min-height:2.2rem;display:flex;align-items:center;font-size:0.9rem;">' + guidelines[currentGuideline].use + '</div>';
        html += '</div>';
        html += '</div>';

        /* Guideline quick-reference table */
        html += '<div class="card-subtitle mt-1">Quick Reference: All Guidelines</div>';
        html += '<div class="table-container">';
        html += '<table class="data-table">';
        html += '<thead><tr><th>Guideline</th><th>Full Name</th><th>Study Type</th><th>Items</th></tr></thead>';
        html += '<tbody>';
        for (var j = 0; j < keys.length; j++) {
            var gk = keys[j];
            var itemCount = checklists[gk] ? checklists[gk].length : '—';
            html += '<tr>';
            html += '<td><strong>' + gk + '</strong></td>';
            html += '<td>' + guidelines[gk].name + '</td>';
            html += '<td>' + guidelines[gk].use + '</td>';
            html += '<td>' + itemCount + '</td>';
            html += '</tr>';
        }
        html += '</tbody></table>';
        html += '</div>';
        html += '</div>';

        /* Card 2: Guideline Comparison Tool */
        html += renderGuidelineComparison();

        /* Card 3: Auto-Fill Study Design */
        html += renderAutoFillStudyDesign();

        /* Card 4: Checklist Notes & Page Numbers */
        html += renderChecklistNotes();

        /* Card 5: Interactive Checklist */
        html += '<div class="card">';
        html += '<div class="card-title" id="rg-checklist-title">Checklist: ' + guidelines[currentGuideline].name + '</div>';

        /* Progress bar */
        html += '<div style="margin-bottom:1rem;">';
        html += '<div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:0.3rem;">';
        html += '<span id="rg-progress-text">0 / ' + (checklists[currentGuideline] ? checklists[currentGuideline].length : 0) + ' items completed</span>';
        html += '<span id="rg-progress-pct">0%</span>';
        html += '</div>';
        html += '<div style="height:8px;background:var(--bg-elevated);border-radius:4px;overflow:hidden;">';
        html += '<div id="rg-progress-bar" style="height:100%;width:0%;background:var(--accent);border-radius:4px;transition:width 0.3s;"></div>';
        html += '</div>';
        html += '</div>';

        /* Section filter */
        html += '<div class="form-group">';
        html += '<label class="form-label">Filter by Section</label>';
        html += '<select class="form-select" id="rg-section-filter" onchange="ReportingGuide.filterSection()">';
        html += '<option value="all">All Sections</option>';
        html += '</select>';
        html += '</div>';

        /* Checklist container */
        html += '<div id="rg-checklist-body"></div>';

        /* Buttons */
        html += '<div class="btn-group mt-2">';
        html += '<button class="btn btn-primary" onclick="ReportingGuide.copyChecklist()">Copy Completed Checklist</button>';
        html += '<button class="btn btn-secondary" onclick="ReportingGuide.downloadChecklist()">Download as Text</button>';
        html += '<button class="btn btn-secondary" onclick="ReportingGuide.exportChecklist()">Export Full Checklist</button>';
        html += '<button class="btn btn-secondary" onclick="ReportingGuide.resetChecklist()">Reset</button>';
        html += '</div>';

        html += '</div>'; /* end card 2 */

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);

        buildChecklist();
    }

    /* ------------------------------------------------------------------ */
    /*  Card 2: Guideline Comparison Tool                                  */
    /* ------------------------------------------------------------------ */
    function renderGuidelineComparison() {
        var html = '<div class="card">';
        html += '<div class="card-title">Guideline Finder: Which Guideline Do I Need?</div>';
        html += '<div class="card-subtitle">Select your study design and we will recommend the appropriate reporting guideline(s).</div>';

        html += '<div class="form-group">';
        html += '<label class="form-label">What type of study are you reporting?</label>';
        html += '<select class="form-select" id="rg-study-type" name="rg-study-type" onchange="ReportingGuide.findGuideline()">';
        html += '<option value="">-- Select study type --</option>';
        html += '<option value="rct">Randomised Controlled Trial (RCT)</option>';
        html += '<option value="rct_cluster">Cluster RCT</option>';
        html += '<option value="rct_noninferiority">Non-inferiority / Equivalence Trial</option>';
        html += '<option value="rct_pilot">Pilot / Feasibility Trial</option>';
        html += '<option value="cohort">Cohort Study</option>';
        html += '<option value="case_control">Case-Control Study</option>';
        html += '<option value="cross_sectional">Cross-Sectional Study</option>';
        html += '<option value="systematic_review">Systematic Review / Meta-Analysis</option>';
        html += '<option value="scoping_review">Scoping Review</option>';
        html += '<option value="meta_obs">Meta-Analysis of Observational Studies</option>';
        html += '<option value="trial_protocol">Clinical Trial Protocol</option>';
        html += '<option value="diagnostic">Diagnostic Accuracy Study</option>';
        html += '<option value="prediction">Prediction Model Study</option>';
        html += '<option value="case_report">Case Report / Case Series</option>';
        html += '<option value="economic">Health Economic Evaluation</option>';
        html += '<option value="animal">Animal Research</option>';
        html += '<option value="guideline_appraisal">Clinical Practice Guideline Appraisal</option>';
        html += '<option value="routinely_collected">Study Using Routinely Collected Data</option>';
        html += '<option value="quality_improvement">Quality Improvement Study</option>';
        html += '<option value="qualitative">Qualitative Research</option>';
        html += '</select>';
        html += '</div>';

        html += '<div id="rg-finder-results"></div>';

        /* Comprehensive comparison table */
        html += '<div style="margin-top:16px;border-top:1px solid var(--border);padding-top:16px;">';
        html += '<div style="font-weight:700;margin-bottom:8px;">Guideline Comparison Matrix</div>';
        html += '<div class="table-container"><table class="data-table" style="font-size:0.82rem;">';
        html += '<thead><tr><th>Feature</th><th>CONSORT</th><th>STROBE</th><th>PRISMA</th><th>SPIRIT</th><th>STARD</th><th>TRIPOD</th></tr></thead>';
        html += '<tbody>';
        html += '<tr><td>Study type</td><td>RCT</td><td>Observational</td><td>Syst. review</td><td>Trial protocol</td><td>Diagnostic</td><td>Prediction</td></tr>';
        html += '<tr><td>Total items</td><td>25</td><td>22</td><td>27</td><td>33</td><td>30</td><td>22</td></tr>';
        html += '<tr><td>Flow diagram</td><td>Required</td><td>Recommended</td><td>Required</td><td>SPIRIT figure</td><td>Required</td><td>Required</td></tr>';
        html += '<tr><td>Registration</td><td>Required</td><td>Not required</td><td>PROSPERO</td><td>Required</td><td>Recommended</td><td>Recommended</td></tr>';
        html += '<tr><td>Protocol</td><td>Referenced</td><td>Not required</td><td>Required (if exists)</td><td>Is the protocol</td><td>Referenced</td><td>Referenced</td></tr>';
        html += '<tr><td>Sample size justification</td><td>Required</td><td>Explained</td><td>N/A</td><td>Required</td><td>Required</td><td>Required</td></tr>';
        html += '<tr><td>Blinding details</td><td>Required</td><td>N/A</td><td>N/A</td><td>Required</td><td>Required</td><td>N/A</td></tr>';
        html += '<tr><td>Effect size + CI</td><td>Required</td><td>Required</td><td>Required</td><td>Pre-specified</td><td>Required</td><td>Required</td></tr>';
        html += '<tr><td>Harms / adverse events</td><td>Required</td><td>N/A</td><td>N/A</td><td>SAE reporting plan</td><td>Required</td><td>N/A</td></tr>';
        html += '<tr><td>Funding source</td><td>Required</td><td>Required</td><td>Required</td><td>Required</td><td>Required</td><td>Required</td></tr>';
        html += '</tbody></table></div>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    /* ------------------------------------------------------------------ */
    /*  Guideline finder logic                                             */
    /* ------------------------------------------------------------------ */
    var guidelineMap = {
        'rct':                { primary: 'CONSORT', secondary: ['SPIRIT'], notes: 'Use CONSORT 2010 for standard parallel-group RCTs. Also submit the protocol (SPIRIT) and register on ClinicalTrials.gov.' },
        'rct_cluster':        { primary: 'CONSORT', secondary: ['SPIRIT'], notes: 'Use the CONSORT extension for cluster randomised trials. Key additions: rationale for cluster design, ICC, adjusted analysis.' },
        'rct_noninferiority': { primary: 'CONSORT', secondary: ['SPIRIT'], notes: 'Use the CONSORT extension for non-inferiority and equivalence trials. Key: pre-specify non-inferiority margin, ITT and per-protocol analyses.' },
        'rct_pilot':          { primary: 'CONSORT', secondary: ['SPIRIT'], notes: 'Use the CONSORT extension for pilot and feasibility studies. Focus on feasibility outcomes, not efficacy. Do not use p-values for primary outcomes.' },
        'cohort':             { primary: 'STROBE', secondary: ['RECORD'], notes: 'Use STROBE for cohort studies. If using routinely collected data (e.g., EHR, claims), also use the RECORD extension.' },
        'case_control':       { primary: 'STROBE', secondary: [], notes: 'Use STROBE for case-control studies. Note: items 6b, 12d, 14c, 15 have case-control-specific wording.' },
        'cross_sectional':    { primary: 'STROBE', secondary: [], notes: 'Use STROBE for cross-sectional studies. Items 6c, 12d, 14c, 15 have cross-sectional-specific wording.' },
        'systematic_review':  { primary: 'PRISMA', secondary: [], notes: 'Use PRISMA 2020 for systematic reviews with or without meta-analysis. Register protocol on PROSPERO. Include PRISMA flow diagram.' },
        'scoping_review':     { primary: 'PRISMA-ScR', secondary: [], notes: 'Use PRISMA-ScR for scoping reviews. Key differences from PRISMA: no meta-analysis, charting data instead of extraction, broader scope.' },
        'meta_obs':           { primary: 'MOOSE', secondary: ['PRISMA'], notes: 'Use MOOSE for meta-analyses of observational studies. MOOSE emphasizes assessment of confounding and heterogeneity. Also consider PRISMA items.' },
        'trial_protocol':     { primary: 'SPIRIT', secondary: [], notes: 'Use SPIRIT 2013 for clinical trial protocols. Include the SPIRIT figure (schedule of enrolment, interventions, assessments). Register the trial before recruitment.' },
        'diagnostic':         { primary: 'STARD', secondary: [], notes: 'Use STARD 2015 for diagnostic accuracy studies. Include the STARD flow diagram. Report sensitivity, specificity, predictive values, and likelihood ratios.' },
        'prediction':         { primary: 'TRIPOD', secondary: [], notes: 'Use TRIPOD for prediction model development, validation, or both. Report full model equation, discrimination (AUC), calibration (calibration plot), and internal/external validation.' },
        'case_report':        { primary: 'CARE', secondary: [], notes: 'Use CARE for case reports. Include timeline figure. Obtain patient consent for publication. Focus on diagnostic reasoning and clinical decision-making.' },
        'economic':           { primary: 'CHEERS', secondary: [], notes: 'Use CHEERS 2022 for health economic evaluations (cost-effectiveness, cost-utility, cost-benefit). Report perspective, time horizon, discount rates, sensitivity analyses.' },
        'animal':             { primary: 'ARRIVE', secondary: [], notes: 'Use ARRIVE 2.0 for animal research. Essential 10 items are mandatory; recommended 11 items improve completeness. Report species, strain, sample size justification, blinding.' },
        'guideline_appraisal': { primary: 'AGREE-II', secondary: [], notes: 'Use AGREE II to appraise clinical practice guidelines. Six domains, 23 items scored 1-7. Calculate domain scores as percentages. Minimum 2 appraisers recommended.' },
        'routinely_collected': { primary: 'RECORD', secondary: ['STROBE'], notes: 'Use RECORD for studies using routinely collected health data (EHR, claims, registries). RECORD extends STROBE with 13 additional items specific to these data sources.' },
        'quality_improvement': { primary: null, secondary: [], notes: 'Use SQUIRE 2.0 (Standards for QUality Improvement Reporting Excellence) for quality improvement studies. Not included in this tool but available at squire-statement.org.' },
        'qualitative':        { primary: null, secondary: [], notes: 'Use SRQR (Standards for Reporting Qualitative Research) or COREQ (Consolidated criteria for reporting qualitative research). Not included in this tool but available at equator-network.org.' }
    };

    function findGuideline() {
        var studyType = document.getElementById('rg-study-type').value;
        if (!studyType) {
            App.setTrustedHTML(document.getElementById('rg-finder-results'), '');
            return;
        }

        var match = guidelineMap[studyType];
        if (!match) {
            App.setTrustedHTML(document.getElementById('rg-finder-results'), '<p style="color:var(--text-secondary);margin-top:12px;">No specific guideline mapped for this study type. Check EQUATOR Network.</p>');
            return;
        }

        var rhtml = '<div class="result-panel mt-2">';
        rhtml += '<div style="border-left:4px solid var(--success);padding:12px 16px;margin-bottom:12px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        if (match.primary) {
            rhtml += '<div style="font-weight:700;font-size:1.1rem;color:var(--success);margin-bottom:4px;">Primary: ' + match.primary + '</div>';
            if (guidelines[match.primary]) {
                rhtml += '<div style="font-size:0.9rem;">' + guidelines[match.primary].name + ' &mdash; ' + guidelines[match.primary].use + '</div>';
                rhtml += '<div style="margin-top:8px;"><button class="btn btn-primary btn-sm" onclick="document.getElementById(\'rg-guideline-select\').value=\'' + match.primary + '\';ReportingGuide.selectGuideline();">Load This Checklist</button></div>';
            }
        } else {
            rhtml += '<div style="font-weight:700;font-size:1.1rem;margin-bottom:4px;">Primary guideline not included in this tool</div>';
        }
        rhtml += '</div>';

        if (match.secondary && match.secondary.length > 0) {
            rhtml += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:12px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
            rhtml += '<div style="font-weight:600;margin-bottom:4px;">Also Consider</div>';
            for (var s = 0; s < match.secondary.length; s++) {
                var sec = match.secondary[s];
                rhtml += '<div style="font-size:0.9rem;margin-bottom:4px;"><strong>' + sec + '</strong>';
                if (guidelines[sec]) rhtml += ' &mdash; ' + guidelines[sec].use;
                rhtml += '</div>';
            }
            rhtml += '</div>';
        }

        rhtml += '<div style="border-left:4px solid var(--warning);padding:12px 16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        rhtml += '<div style="font-weight:600;margin-bottom:4px;">Notes</div>';
        rhtml += '<div style="font-size:0.9rem;line-height:1.6;">' + match.notes + '</div>';
        rhtml += '</div>';

        rhtml += '</div>';
        App.setTrustedHTML(document.getElementById('rg-finder-results'), rhtml);
    }

    /* ------------------------------------------------------------------ */
    /*  Card 3: Auto-Fill Study Design Checklist                           */
    /* ------------------------------------------------------------------ */
    function renderAutoFillStudyDesign() {
        var html = '<div class="card">';
        html += '<div class="card-title">Auto-Fill Reporting Checklist</div>';
        html += '<div class="card-subtitle">Enter basic study details and we will pre-populate a reporting checklist template for your manuscript.</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Study Title</label>'
            + '<input type="text" class="form-input" id="af-title" name="af-title" placeholder="e.g., Effect of X on Y in patients with Z"></div>';
        html += '<div class="form-group"><label class="form-label">Study Design</label>'
            + '<select class="form-select" id="af-design" name="af-design">'
            + '<option value="rct">Randomised Controlled Trial</option>'
            + '<option value="cohort">Prospective Cohort</option>'
            + '<option value="retrospective_cohort">Retrospective Cohort</option>'
            + '<option value="case_control">Case-Control</option>'
            + '<option value="cross_sectional">Cross-Sectional</option>'
            + '<option value="systematic_review">Systematic Review / Meta-Analysis</option>'
            + '<option value="diagnostic">Diagnostic Accuracy Study</option>'
            + '<option value="prediction">Prediction Model Study</option>'
            + '<option value="case_report">Case Report</option>'
            + '</select></div>';
        html += '</div>';

        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Setting</label>'
            + '<input type="text" class="form-input" id="af-setting" name="af-setting" placeholder="e.g., Single-center, tertiary facility"></div>';
        html += '<div class="form-group"><label class="form-label">Sample Size</label>'
            + '<input type="text" class="form-input" id="af-n" name="af-n" placeholder="e.g., n = 250"></div>';
        html += '<div class="form-group"><label class="form-label">Primary Outcome</label>'
            + '<input type="text" class="form-input" id="af-outcome" name="af-outcome" placeholder="e.g., 90-day mortality"></div>';
        html += '</div>';

        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Intervention / Exposure</label>'
            + '<input type="text" class="form-input" id="af-intervention" name="af-intervention" placeholder="e.g., Alteplase vs placebo"></div>';
        html += '<div class="form-group"><label class="form-label">Follow-up Duration</label>'
            + '<input type="text" class="form-input" id="af-followup" name="af-followup" placeholder="e.g., 12 months"></div>';
        html += '<div class="form-group"><label class="form-label">Registration Number</label>'
            + '<input type="text" class="form-input" id="af-reg" name="af-reg" placeholder="e.g., NCT01234567"></div>';
        html += '</div>';

        html += '<div class="btn-group">';
        html += '<button class="btn btn-primary" onclick="ReportingGuide.autoFill()">Generate Template</button>';
        html += '<button class="btn btn-secondary" onclick="ReportingGuide.copyAutoFill()">Copy Template</button>';
        html += '</div>';

        html += '<div id="af-results"></div>';
        html += '</div>';
        return html;
    }

    function autoFill() {
        var title = document.getElementById('af-title').value || '[Study Title]';
        var design = document.getElementById('af-design').value;
        var setting = document.getElementById('af-setting').value || '[Setting]';
        var n = document.getElementById('af-n').value || '[Sample size]';
        var outcome = document.getElementById('af-outcome').value || '[Primary outcome]';
        var intervention = document.getElementById('af-intervention').value || '[Intervention/Exposure]';
        var followup = document.getElementById('af-followup').value || '[Follow-up duration]';
        var reg = document.getElementById('af-reg').value || '[Not registered]';

        var designLabel = {
            'rct': 'Randomised Controlled Trial',
            'cohort': 'Prospective Cohort Study',
            'retrospective_cohort': 'Retrospective Cohort Study',
            'case_control': 'Case-Control Study',
            'cross_sectional': 'Cross-Sectional Study',
            'systematic_review': 'Systematic Review / Meta-Analysis',
            'diagnostic': 'Diagnostic Accuracy Study',
            'prediction': 'Prediction Model Study',
            'case_report': 'Case Report'
        }[design] || design;

        var guidelineName = {
            'rct': 'CONSORT', 'cohort': 'STROBE', 'retrospective_cohort': 'STROBE',
            'case_control': 'STROBE', 'cross_sectional': 'STROBE',
            'systematic_review': 'PRISMA', 'diagnostic': 'STARD',
            'prediction': 'TRIPOD', 'case_report': 'CARE'
        }[design] || 'STROBE';

        var lines = [];
        lines.push(guidelineName + ' Reporting Checklist');
        lines.push('='.repeat(50));
        lines.push('');
        lines.push('Study: ' + title);
        lines.push('Design: ' + designLabel);
        lines.push('Setting: ' + setting);
        lines.push('Sample size: ' + n);
        lines.push('Primary outcome: ' + outcome);
        lines.push('Intervention/Exposure: ' + intervention);
        lines.push('Follow-up: ' + followup);
        lines.push('Registration: ' + reg);
        lines.push('Guideline: ' + guidelineName);
        lines.push('');
        lines.push('='.repeat(50));
        lines.push('');

        var items = checklists[guidelineName];
        if (items) {
            var lastSection = '';
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.section !== lastSection) {
                    if (lastSection !== '') lines.push('');
                    lines.push('--- ' + item.section + ' ---');
                    lastSection = item.section;
                }

                var autoText = '';
                // Pre-fill certain items with user input
                if ((item.num === '1a' || item.num === '1' || item.num === '1') && item.section.indexOf('Title') >= 0) {
                    autoText = ' >> "' + title + '"';
                }
                if (item.text.toLowerCase().indexOf('setting') >= 0 && item.text.toLowerCase().indexOf('location') >= 0) {
                    autoText = ' >> ' + setting;
                }
                if (item.text.toLowerCase().indexOf('sample size') >= 0 || item.text.toLowerCase().indexOf('study size') >= 0) {
                    autoText = ' >> ' + n;
                }
                if (item.text.toLowerCase().indexOf('registration') >= 0 || item.text.toLowerCase().indexOf('registry') >= 0) {
                    autoText = ' >> ' + reg;
                }
                if (item.text.toLowerCase().indexOf('primary') >= 0 && item.text.toLowerCase().indexOf('outcome') >= 0) {
                    autoText = ' >> ' + outcome;
                }
                if (item.text.toLowerCase().indexOf('intervention') >= 0 && !autoText) {
                    autoText = ' >> ' + intervention;
                }
                if (item.text.toLowerCase().indexOf('follow-up') >= 0 && !autoText) {
                    autoText = ' >> ' + followup;
                }

                lines.push('[ ] ' + item.num + '. ' + item.text + autoText);
                lines.push('    Page/Section: ____');
            }
        }

        lines.push('');
        lines.push('Generated: ' + new Date().toLocaleDateString());
        lines.push('Prepared with Neuro-Epi Suite Reporting Guidelines Hub');

        var text = lines.join('\n');

        var rhtml = '<div class="result-panel mt-2">';
        rhtml += '<div class="card-title">Generated ' + guidelineName + ' Template for: ' + title + '</div>';
        rhtml += '<div style="font-size:0.85rem;margin-bottom:12px;color:var(--text-secondary);">';
        rhtml += 'Design: ' + designLabel + ' | Guideline: ' + guidelineName + ' | Items: ' + (items ? items.length : '?');
        rhtml += ' | Items with auto-fill data are marked with ">>"';
        rhtml += '</div>';
        rhtml += '<pre id="af-text" style="background:var(--bg-primary);border:1px solid var(--border);padding:16px;border-radius:8px;font-size:0.78rem;line-height:1.5;max-height:400px;overflow-y:auto;white-space:pre-wrap;font-family:monospace;">' + text + '</pre>';
        rhtml += '</div>';

        App.setTrustedHTML(document.getElementById('af-results'), rhtml);
    }

    function copyAutoFill() {
        var el = document.getElementById('af-text');
        if (el) Export.copyText(el.textContent);
    }

    /* ------------------------------------------------------------------ */
    /*  Card 4: Checklist Notes & Page Numbers                             */
    /* ------------------------------------------------------------------ */
    function renderChecklistNotes() {
        var html = '<div class="card">';
        html += '<div class="card-title">Checklist Completion Tracker with Notes</div>';
        html += '<div class="card-subtitle">For formal submission: track completion status, add page numbers, and add reviewer notes for each major section.</div>';

        html += '<div class="form-group"><label class="form-label">Select Guideline for Tracking</label>';
        html += '<select class="form-select" id="cn-guideline" name="cn-guideline">';
        var keys = Object.keys(guidelines);
        for (var i = 0; i < keys.length; i++) {
            html += '<option value="' + keys[i] + '"' + (keys[i] === 'CONSORT' ? ' selected' : '') + '>' + guidelines[keys[i]].name + '</option>';
        }
        html += '</select></div>';

        html += '<button class="btn btn-primary" onclick="ReportingGuide.generateNotes()">Generate Section Notes</button>';
        html += '<div id="cn-results"></div>';

        html += '<div style="margin-top:16px;border-top:1px solid var(--border);padding-top:16px;">';
        html += '<div style="font-weight:700;margin-bottom:8px;">Journal Requirements Quick Reference</div>';
        html += '<div class="table-container"><table class="data-table" style="font-size:0.82rem;">';
        html += '<thead><tr><th>Journal</th><th>Required Checklists</th><th>Flow Diagram</th><th>Registration</th><th>Protocol</th></tr></thead>';
        html += '<tbody>';
        html += '<tr><td><strong>BMJ</strong></td><td>All relevant (mandatory)</td><td>Required</td><td>Required (RCT)</td><td>Encouraged</td></tr>';
        html += '<tr><td><strong>Lancet</strong></td><td>CONSORT, STROBE, PRISMA</td><td>Required</td><td>Required (RCT)</td><td>Referenced</td></tr>';
        html += '<tr><td><strong>JAMA</strong></td><td>All relevant (mandatory)</td><td>Required</td><td>Required (RCT)</td><td>Referenced</td></tr>';
        html += '<tr><td><strong>NEJM</strong></td><td>CONSORT (RCT)</td><td>Required</td><td>Required</td><td>Required</td></tr>';
        html += '<tr><td><strong>PLOS Medicine</strong></td><td>All relevant (mandatory)</td><td>Required</td><td>Required</td><td>Encouraged</td></tr>';
        html += '<tr><td><strong>Stroke</strong></td><td>CONSORT, STROBE</td><td>Required</td><td>Required (RCT)</td><td>Referenced</td></tr>';
        html += '<tr><td><strong>Neurology</strong></td><td>CONSORT, STROBE, STARD</td><td>Required</td><td>Required (RCT)</td><td>Referenced</td></tr>';
        html += '<tr><td><strong>Ann Neurol</strong></td><td>Relevant guidelines</td><td>Recommended</td><td>Required (RCT)</td><td>Referenced</td></tr>';
        html += '</tbody></table></div>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    function generateNotes() {
        var gl = document.getElementById('cn-guideline').value;
        var items = checklists[gl];
        if (!items) {
            App.setTrustedHTML(document.getElementById('cn-results'), '<p style="color:var(--text-secondary);margin-top:12px;">No checklist data available.</p>');
            return;
        }

        // Group by section
        var sections = [];
        var sectionMap = {};
        for (var i = 0; i < items.length; i++) {
            if (!sectionMap[items[i].section]) {
                sectionMap[items[i].section] = true;
                sections.push(items[i].section);
            }
        }

        var rhtml = '<div class="result-panel mt-2">';
        rhtml += '<div class="card-title">' + guidelines[gl].name + ' Section-by-Section Notes</div>';
        rhtml += '<div style="font-size:0.85rem;margin-bottom:12px;color:var(--text-secondary);">Add page numbers and notes for each section. This helps during journal submission.</div>';

        for (var si = 0; si < sections.length; si++) {
            var sec = sections[si];
            var sectionItems = [];
            for (var j = 0; j < items.length; j++) {
                if (items[j].section === sec) sectionItems.push(items[j]);
            }

            rhtml += '<div style="border:1px solid var(--border);border-radius:8px;margin-bottom:8px;padding:12px;">';
            rhtml += '<div style="font-weight:700;color:var(--accent);margin-bottom:6px;">' + sec + ' (' + sectionItems.length + ' items)</div>';
            rhtml += '<div style="font-size:0.82rem;line-height:1.6;margin-bottom:8px;color:var(--text-secondary);">';
            for (var k = 0; k < sectionItems.length; k++) {
                rhtml += '<div>' + sectionItems[k].num + '. ' + sectionItems[k].text.substring(0, 80) + (sectionItems[k].text.length > 80 ? '...' : '') + '</div>';
            }
            rhtml += '</div>';
            rhtml += '<div class="form-row form-row--2">';
            rhtml += '<div class="form-group"><label class="form-label" style="font-size:0.8rem;">Page Number(s)</label>'
                + '<input type="text" class="form-input" id="cn-page-' + si + '" placeholder="e.g., pp. 3-5"></div>';
            rhtml += '<div class="form-group"><label class="form-label" style="font-size:0.8rem;">Notes / Status</label>'
                + '<input type="text" class="form-input" id="cn-note-' + si + '" placeholder="e.g., Complete, Needs revision"></div>';
            rhtml += '</div>';
            rhtml += '</div>';
        }

        rhtml += '<div class="btn-group mt-1">';
        rhtml += '<button class="btn btn-secondary" onclick="ReportingGuide.copyNotes(' + sections.length + ')">Copy Notes Summary</button>';
        rhtml += '</div>';

        rhtml += '</div>';
        App.setTrustedHTML(document.getElementById('cn-results'), rhtml);
    }

    function copyNotes(numSections) {
        var gl = document.getElementById('cn-guideline').value;
        var lines = [];
        lines.push(guidelines[gl].name + ' Completion Notes');
        lines.push('='.repeat(40));
        lines.push('');

        // Gather sections again
        var items = checklists[gl];
        var sections = [];
        var sectionMap = {};
        for (var i = 0; i < items.length; i++) {
            if (!sectionMap[items[i].section]) {
                sectionMap[items[i].section] = true;
                sections.push(items[i].section);
            }
        }

        for (var si = 0; si < sections.length; si++) {
            var pageEl = document.getElementById('cn-page-' + si);
            var noteEl = document.getElementById('cn-note-' + si);
            var page = pageEl ? pageEl.value : '';
            var note = noteEl ? noteEl.value : '';
            lines.push(sections[si] + ': ' + (page ? 'Pages ' + page : 'Page: __') + ' | ' + (note || 'No notes'));
        }

        lines.push('');
        lines.push('Generated: ' + new Date().toLocaleDateString());
        Export.copyText(lines.join('\n'));
    }

    /* ------------------------------------------------------------------ */
    /*  Build checklist items                                              */
    /* ------------------------------------------------------------------ */
    function buildChecklist() {
        var gl = currentGuideline;
        var items = checklists[gl];
        if (!items) {
            var body = document.getElementById('rg-checklist-body');
            if (body) App.setTrustedHTML(body, '<p style="color:var(--text-secondary)">Checklist data not yet available for this guideline.</p>');
            return;
        }

        /* Collect unique sections */
        var sections = [];
        var sectionMap = {};
        for (var i = 0; i < items.length; i++) {
            if (!sectionMap[items[i].section]) {
                sectionMap[items[i].section] = true;
                sections.push(items[i].section);
            }
        }

        /* Populate section filter */
        var filterEl = document.getElementById('rg-section-filter');
        if (filterEl) {
            var fhtml = '<option value="all">All Sections</option>';
            for (var s = 0; s < sections.length; s++) {
                fhtml += '<option value="' + sections[s] + '">' + sections[s] + '</option>';
            }
            App.setTrustedHTML(filterEl, fhtml);
        }

        /* Initialize checklist state for this guideline if not present */
        if (!checklistState[gl]) {
            checklistState[gl] = {};
        }

        /* Build items grouped by section */
        var bodyHtml = '';
        for (var si = 0; si < sections.length; si++) {
            var sec = sections[si];
            bodyHtml += '<div class="rg-section-group" data-section="' + sec + '">';
            bodyHtml += '<div style="font-weight:600;font-size:0.95rem;color:var(--accent);margin:1rem 0 0.5rem;border-bottom:1px solid var(--border);padding-bottom:0.3rem;">' + sec + '</div>';

            for (var ii = 0; ii < items.length; ii++) {
                if (items[ii].section !== sec) continue;
                var item = items[ii];
                var itemKey = gl + '_' + item.num;
                var checked = checklistState[gl][item.num] ? ' checked' : '';

                bodyHtml += '<label style="display:flex;align-items:flex-start;gap:0.5rem;padding:0.4rem 0;cursor:pointer;font-size:0.9rem;">';
                bodyHtml += '<input type="checkbox" id="rg-chk-' + itemKey + '"' + checked + ' onchange="ReportingGuide.toggleItem(\'' + gl + '\',\'' + item.num + '\')" style="margin-top:3px;flex-shrink:0;">';
                bodyHtml += '<span><strong>' + item.num + '.</strong> ' + item.text + '</span>';
                bodyHtml += '</label>';
            }
            bodyHtml += '</div>';
        }

        var body = document.getElementById('rg-checklist-body');
        if (body) App.setTrustedHTML(body, bodyHtml);

        updateProgress();
    }

    /* ------------------------------------------------------------------ */
    /*  Guideline selection                                                */
    /* ------------------------------------------------------------------ */
    function selectGuideline() {
        var sel = document.getElementById('rg-guideline-select');
        if (!sel) return;
        currentGuideline = sel.value;

        var descEl = document.getElementById('rg-description');
        if (descEl) App.setTrustedHTML(descEl, guidelines[currentGuideline].use);

        var titleEl = document.getElementById('rg-checklist-title');
        if (titleEl) App.setTrustedHTML(titleEl, 'Checklist: ' + guidelines[currentGuideline].name);

        buildChecklist();
    }

    /* ------------------------------------------------------------------ */
    /*  Toggle item                                                        */
    /* ------------------------------------------------------------------ */
    function toggleItem(gl, num) {
        if (!checklistState[gl]) checklistState[gl] = {};
        checklistState[gl][num] = !checklistState[gl][num];
        updateProgress();
    }

    /* ------------------------------------------------------------------ */
    /*  Update progress                                                    */
    /* ------------------------------------------------------------------ */
    function updateProgress() {
        var gl = currentGuideline;
        var items = checklists[gl];
        if (!items) return;

        var total = items.length;
        var done = 0;
        for (var i = 0; i < items.length; i++) {
            if (checklistState[gl] && checklistState[gl][items[i].num]) done++;
        }
        var pct = total > 0 ? Math.round((done / total) * 100) : 0;

        var textEl = document.getElementById('rg-progress-text');
        if (textEl) App.setTrustedHTML(textEl, done + ' / ' + total + ' items completed');

        var pctEl = document.getElementById('rg-progress-pct');
        if (pctEl) App.setTrustedHTML(pctEl, pct + '%');

        var barEl = document.getElementById('rg-progress-bar');
        if (barEl) barEl.style.width = pct + '%';
    }

    /* ------------------------------------------------------------------ */
    /*  Filter by section                                                  */
    /* ------------------------------------------------------------------ */
    function filterSection() {
        var filter = document.getElementById('rg-section-filter');
        if (!filter) return;
        var val = filter.value;

        var groups = document.querySelectorAll('.rg-section-group');
        for (var i = 0; i < groups.length; i++) {
            if (val === 'all' || groups[i].getAttribute('data-section') === val) {
                groups[i].style.display = '';
            } else {
                groups[i].style.display = 'none';
            }
        }
    }

    /* ------------------------------------------------------------------ */
    /*  Generate checklist text                                            */
    /* ------------------------------------------------------------------ */
    function generateChecklistText(completedOnly) {
        var gl = currentGuideline;
        var items = checklists[gl];
        if (!items) return '';

        var lines = [];
        lines.push(guidelines[gl].name + ' Checklist');
        lines.push('='.repeat(40));
        lines.push('');

        var lastSection = '';
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var done = checklistState[gl] && checklistState[gl][item.num];

            if (completedOnly && !done) continue;

            if (item.section !== lastSection) {
                if (lastSection !== '') lines.push('');
                lines.push('--- ' + item.section + ' ---');
                lastSection = item.section;
            }

            var mark = done ? '[X]' : '[ ]';
            lines.push(mark + ' ' + item.num + '. ' + item.text);
        }

        var total = items.length;
        var doneCount = 0;
        for (var j = 0; j < items.length; j++) {
            if (checklistState[gl] && checklistState[gl][items[j].num]) doneCount++;
        }
        lines.push('');
        lines.push('Progress: ' + doneCount + '/' + total + ' (' + Math.round((doneCount / total) * 100) + '%)');
        lines.push('Generated: ' + new Date().toLocaleDateString());

        return lines.join('\n');
    }

    /* ------------------------------------------------------------------ */
    /*  Export / Copy / Download                                           */
    /* ------------------------------------------------------------------ */
    function copyChecklist() {
        var text = generateChecklistText(true);
        if (!text || text.split('\n').length < 6) {
            text = generateChecklistText(false);
        }
        Export.copyText(text);
    }

    function downloadChecklist() {
        var text = generateChecklistText(false);
        var blob = new Blob([text], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = currentGuideline.toLowerCase() + '-checklist.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportChecklist() {
        var text = generateChecklistText(false);
        Export.copyText(text);
    }

    function resetChecklist() {
        checklistState[currentGuideline] = {};
        buildChecklist();
    }

    /* ------------------------------------------------------------------ */
    /*  Register                                                           */
    /* ------------------------------------------------------------------ */
    App.registerModule(MODULE_ID, { render: render });
    window.ReportingGuide = {
        selectGuideline: selectGuideline,
        toggleItem: toggleItem,
        filterSection: filterSection,
        copyChecklist: copyChecklist,
        downloadChecklist: downloadChecklist,
        exportChecklist: exportChecklist,
        resetChecklist: resetChecklist,
        findGuideline: findGuideline,
        autoFill: autoFill,
        copyAutoFill: copyAutoFill,
        generateNotes: generateNotes,
        copyNotes: copyNotes
    };
})();
