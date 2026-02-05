/**
 * Neuro-Epi Trial Database — Batch 4
 * Additional landmark trials in stroke and neurology.
 */
(function() {
    if (!window.TrialDatabase) window.TrialDatabase = { trials: [] };
    var T = window.TrialDatabase.trials;
    T.push(

    // ==========================================
    // TELESTROKE TRIALS
    // ==========================================
    {
        name: 'STRokE DOC',
        year: 2005,
        category: 'telestroke',
        fullTitle: 'STRokE DOC: Stroke Team Remote Evaluation Using a Digital Observation Camera',
        journal: 'Neurology',
        doi: '10.1212/01.wnl.0000183743.98455.73',
        sampleSize: 222,
        population: 'Patients presenting to community emergency departments with symptoms suggestive of acute stroke',
        intervention: 'Real-time telemedicine consultation via two-way audiovisual system',
        control: 'Telephone-only consultation',
        primaryOutcome: {
            measure: 'Correct treatment decision at 30 days',
            result: '98% vs 82% correct decisions; absolute difference 16%, p=0.0009'
        },
        secondary: 'Improved NIHSS assessment accuracy, higher tPA treatment rates in eligible patients, no difference in mortality',
        keyFindings: 'First RCT demonstrating superiority of video-based telemedicine over telephone-only consultation for acute stroke evaluation. Established evidence base for hub-and-spoke telestroke networks.',
        landmark: true,
        phase: 'N/A'
    },
    {
        name: 'REACH',
        year: 2010,
        category: 'telestroke',
        fullTitle: 'Remote Evaluation of Acute Ischemic Stroke',
        journal: 'Stroke',
        doi: '10.1161/STROKEAHA.110.579466',
        sampleSize: 54,
        population: 'Acute ischemic stroke patients presenting to rural emergency departments in Arizona',
        intervention: 'Telestroke-guided IV tPA administration with remote neurologist consultation',
        control: 'Historical cohort of stroke patients without telestroke access',
        primaryOutcome: {
            measure: 'IV tPA administration rate within 3 hours',
            result: 'tPA use increased from near 0% to 28% of eligible patients with telestroke'
        },
        secondary: 'Median door-to-needle time 75 minutes, symptomatic ICH rate 6%, 90-day outcomes comparable to urban centers',
        keyFindings: 'Demonstrated feasibility and safety of telestroke-guided thrombolysis in underserved rural communities. Supported expansion of telestroke programs to improve acute stroke care access.',
        landmark: false,
        phase: 'N/A'
    },
    {
        name: 'RIGHT',
        year: 2005,
        category: 'telestroke',
        fullTitle: 'Remote Imaging Gateway for Health Telecommunications',
        journal: 'Journal of Stroke and Cerebrovascular Diseases',
        doi: '10.1016/j.jstrokecerebrovasdis.2004.06.007',
        sampleSize: 77,
        population: 'Patients with suspected acute stroke presenting to community hospitals without on-site neurologists',
        intervention: 'Telemedicine-based consultation with NIHSS assessment via videoconference',
        control: 'Telephone-only consultation',
        primaryOutcome: {
            measure: 'Reliability of NIHSS assessment via telemedicine versus bedside',
            result: 'Intraclass correlation coefficient 0.95 between telemedicine and bedside NIHSS'
        },
        secondary: 'High diagnostic accuracy for large vessel occlusion identification, improved clinician confidence in treatment decisions',
        keyFindings: 'Validated the reliability of remote NIHSS assessment via telemedicine, demonstrating that neurological examination quality was comparable to bedside evaluation.',
        landmark: false,
        phase: 'N/A'
    },
    {
        name: 'TEMPiS',
        year: 2006,
        category: 'telestroke',
        fullTitle: 'Telemedic Pilot Project for Integrative Stroke Care',
        journal: 'Stroke',
        doi: '10.1161/01.STR.0000217807.89576.c2',
        sampleSize: 5353,
        population: 'Acute stroke patients in 12 community hospitals in rural Bavaria, Germany',
        intervention: 'Telestroke network with 24/7 access to vascular neurologists via videoconference',
        control: 'Stroke care before telestroke implementation (pre-post design)',
        primaryOutcome: {
            measure: 'Death or institutional care at 3 months',
            result: 'Reduced from 24.5% to 18.0% after telestroke implementation; adjusted OR 0.67 (0.56-0.81), p<0.001'
        },
        secondary: 'IV tPA use increased from 2.7% to 5.8%, door-to-needle time decreased, improved adherence to stroke unit standards',
        keyFindings: 'Large-scale telestroke network implementation in Germany demonstrating significant improvement in stroke outcomes. One of the first studies to show telestroke can reduce death and disability at a population level.',
        landmark: true,
        phase: 'N/A'
    },
    {
        name: 'IN-TIME',
        year: 2006,
        category: 'telestroke',
        fullTitle: 'Integrating Telemedicine with Stroke Care in Indiana',
        journal: 'Telemedicine and e-Health',
        doi: '10.1089/tmj.2006.12.459',
        sampleSize: 296,
        population: 'Stroke patients in rural Indiana hospitals connected via telemedicine to stroke center',
        intervention: 'Telemedicine-facilitated acute stroke management with remote neurologist support',
        control: 'Pre-implementation standard care without telemedicine',
        primaryOutcome: {
            measure: 'tPA utilization rate and door-to-needle time',
            result: 'IV tPA use increased from 2% to 11.4%, mean door-to-needle time 69 minutes'
        },
        secondary: 'Reduction in inter-hospital transfers, increased proportion of patients treated at presenting hospital, no increase in sICH rates',
        keyFindings: 'Demonstrated that a hub-and-spoke telestroke model could substantially increase thrombolysis rates in rural settings while maintaining safety, contributing to the expansion of US telestroke networks.',
        landmark: false,
        phase: 'N/A'
    },

    // ==========================================
    // PEDIATRIC STROKE / SICKLE CELL TRIALS
    // ==========================================
    {
        name: 'TIPS',
        year: 2015,
        category: 'pediatric',
        fullTitle: 'TCD With Transfusions Changing to Hydroxyurea',
        journal: 'New England Journal of Medicine',
        doi: '10.1056/NEJMoa1401731',
        sampleSize: 121,
        population: 'Children with sickle cell anemia age 5-15 years with elevated transcranial Doppler velocities previously receiving chronic transfusion for at least 1 year',
        intervention: 'Switch from chronic transfusion to hydroxyurea (maximum tolerated dose)',
        control: 'Continue chronic transfusion with iron chelation',
        primaryOutcome: {
            measure: 'Composite of stroke or TCD reversion to elevated velocities (>200 cm/s)',
            result: 'Study halted early due to futility; no strokes in transfusion arm vs 1 in HU arm. TCD reversion 50% vs 17%'
        },
        secondary: 'Liver iron concentration decreased in hydroxyurea group, serum ferritin decreased. No difference in quality of life.',
        keyFindings: 'Demonstrated that switching from chronic transfusion to hydroxyurea was associated with higher TCD reversion rates, raising concerns about hydroxyurea as substitute for primary stroke prevention in highest-risk children with SCD.',
        landmark: false,
        phase: 'III'
    },
    {
        name: 'STOP',
        year: 1998,
        category: 'pediatric',
        fullTitle: 'Stroke Prevention Trial in Sickle Cell Anemia',
        journal: 'New England Journal of Medicine',
        doi: '10.1056/NEJM199807023390102',
        sampleSize: 130,
        population: 'Children age 2-16 years with sickle cell disease and abnormal transcranial Doppler velocities (>=200 cm/s)',
        intervention: 'Chronic red blood cell transfusion to maintain HbS <30%',
        control: 'Standard care (observation)',
        primaryOutcome: {
            measure: 'First stroke (ischemic or hemorrhagic)',
            result: '1 stroke in transfusion group vs 11 in control group; 92% relative risk reduction, p<0.001'
        },
        secondary: 'Normalization of TCD velocities in 75% of transfusion group, reduction in TIA episodes',
        keyFindings: 'Landmark trial proving that chronic transfusion dramatically reduces first stroke risk in children with sickle cell anemia and abnormal TCD. Established TCD screening and prophylactic transfusion as standard of care. Trial stopped early for overwhelming efficacy.',
        landmark: true,
        phase: 'III'
    },
    {
        name: 'STOP II',
        year: 2005,
        category: 'pediatric',
        fullTitle: 'Optimizing Primary Stroke Prevention in Sickle Cell Anemia',
        journal: 'New England Journal of Medicine',
        doi: '10.1056/NEJMoa050554',
        sampleSize: 79,
        population: 'Children with sickle cell disease who had been on chronic transfusion for at least 30 months with normalized TCD velocities',
        intervention: 'Discontinuation of chronic transfusion',
        control: 'Continued chronic transfusion',
        primaryOutcome: {
            measure: 'Reversion to abnormal TCD velocity or stroke',
            result: 'Study halted early; 14 of 41 (34%) in discontinuation group vs 2 of 38 (5%) in transfusion group reverted to high-risk TCD or had stroke, p=0.0023'
        },
        secondary: '2 strokes in discontinuation group, 0 in transfusion group',
        keyFindings: 'Definitively showed that discontinuing transfusion therapy in children with SCD leads to rapid return of elevated TCD velocities and stroke risk. Established that once started, chronic transfusion for primary stroke prevention must continue indefinitely.',
        landmark: true,
        phase: 'III'
    },
    {
        name: 'SIT',
        year: 2014,
        category: 'pediatric',
        fullTitle: 'Silent Infarct Transfusion Trial',
        journal: 'New England Journal of Medicine',
        doi: '10.1056/NEJMoa1401731',
        sampleSize: 196,
        population: 'Children age 5-15 years with sickle cell anemia and silent cerebral infarcts on MRI, normal TCD velocities',
        intervention: 'Chronic red blood cell transfusion to maintain HbS <30%',
        control: 'Observation (standard care)',
        primaryOutcome: {
            measure: 'Recurrence of infarction (new silent infarct or overt stroke) on MRI at 36 months',
            result: '6% in transfusion group vs 14% in observation group; relative risk reduction 58%, p=0.04'
        },
        secondary: 'New silent cerebral infarcts: 5% vs 13%. Overt stroke: 1 in each group. Iron overload increased in transfusion arm.',
        keyFindings: 'First trial to demonstrate that chronic transfusion can reduce progression of silent cerebral infarcts in children with sickle cell anemia. Expanded indications for transfusion therapy beyond abnormal TCD.',
        landmark: true,
        phase: 'III'
    },
    {
        name: 'TWiTCH',
        year: 2016,
        category: 'pediatric',
        fullTitle: 'TCD With Transfusions Changing to Hydroxyurea',
        journal: 'The Lancet',
        doi: '10.1016/S0140-6736(15)01041-7',
        sampleSize: 121,
        population: 'Children age 4-16 years with sickle cell anemia, previous abnormal TCD, on chronic transfusion for at least 1 year with normalized TCD and no severe vasculopathy on MRA',
        intervention: 'Hydroxyurea at maximum tolerated dose (with transfusion overlap/taper)',
        control: 'Continue standard chronic transfusion with iron chelation',
        primaryOutcome: {
            measure: 'TCD time-averaged maximum mean velocity at 24 months',
            result: 'Non-inferiority met; TCD velocity 143 cm/s (HU) vs 148 cm/s (transfusion), p<0.001 for non-inferiority'
        },
        secondary: 'No strokes in either group. Liver iron content decreased more with hydroxyurea. No increase in adverse events.',
        keyFindings: 'Demonstrated that hydroxyurea is a safe and effective alternative to chronic transfusion for maintaining stroke prevention in selected children with SCD who had already normalized their TCD velocities. Changed practice by providing an exit strategy from chronic transfusion for low-risk patients.',
        landmark: true,
        phase: 'III'
    },

    // ==========================================
    // IMAGING-GUIDED TRIALS
    // ==========================================
    {
        name: 'MR WITNESS',
        year: 2018,
        category: 'imaging',
        fullTitle: 'MR WITNESS: A Study of IV Alteplase for Stroke Using MRI-Based Selection',
        journal: 'Stroke',
        doi: '10.1161/STROKEAHA.117.020090',
        sampleSize: 80,
        population: 'Patients with acute ischemic stroke with symptom onset 4.5-24 hours or unknown onset with DWI-FLAIR mismatch on MRI',
        intervention: 'IV alteplase 0.9 mg/kg guided by DWI-FLAIR mismatch',
        control: 'Single-arm safety study (no control)',
        primaryOutcome: {
            measure: 'Safety: rate of symptomatic ICH within 36 hours',
            result: 'sICH rate 1.3% (1 of 80 patients), comparable to standard-window thrombolysis rates'
        },
        secondary: 'Good functional outcome (mRS 0-1) at 90 days: 44%. Favorable safety profile supporting MRI-guided patient selection.',
        keyFindings: 'Proof-of-concept study showing that MRI DWI-FLAIR mismatch can safely identify patients for IV thrombolysis beyond conventional time windows. Contributed to the evidence base for imaging-guided late-window treatment.',
        landmark: false,
        phase: 'II'
    },
    {
        name: 'ECASS-4',
        year: 2018,
        category: 'imaging',
        fullTitle: 'European Cooperative Acute Stroke Study 4: Extending the Time for Thrombolysis in Emergency Neurological Deficits',
        journal: 'The Lancet Neurology',
        doi: '10.1016/S1474-4422(18)30304-2',
        sampleSize: 119,
        population: 'Acute ischemic stroke patients 4.5-9 hours from onset or wake-up stroke with DWI-FLAIR mismatch',
        intervention: 'IV alteplase 0.9 mg/kg',
        control: 'Placebo',
        primaryOutcome: {
            measure: 'Favorable outcome (mRS 0-1) at 90 days',
            result: '35.4% vs 29.8%; OR 1.31 (0.50-3.42), p=0.58 (underpowered, stopped early)'
        },
        secondary: 'sICH: 0% in alteplase vs 1.8% in placebo. Mortality similar. Favorable direction of effect despite underpowering.',
        keyFindings: 'Trial stopped early due to competing trials (WAKE-UP, EXTEND) and slow enrollment. Though underpowered, results were directionally consistent with benefit of MRI-selected late-window thrombolysis.',
        landmark: false,
        phase: 'III'
    },
    {
        name: 'CRISP',
        year: 2005,
        category: 'imaging',
        fullTitle: 'Combination Approach to Lysis Utilizing Eptifibatide and rt-PA in Acute Ischemic Stroke — CTA Substudy',
        journal: 'Stroke',
        doi: '10.1161/01.STR.0000189998.63203.38',
        sampleSize: 99,
        population: 'Acute ischemic stroke patients within 24 hours of symptom onset who underwent CT angiography',
        intervention: 'CTA source image assessment for ischemic core estimation',
        control: 'Comparison with DWI-MRI and follow-up infarct volume',
        primaryOutcome: {
            measure: 'Correlation between CTA source image lesion and DWI lesion volume',
            result: 'High correlation (r=0.89) between CTA-SI and DWI for estimating ischemic core'
        },
        secondary: 'CTA-SI predicted final infarct volume, collateral status on CTA predicted outcome independently',
        keyFindings: 'Early validation study demonstrating that CT angiography source images could estimate ischemic core volume comparably to DWI MRI. Contributed to development of CT-based patient selection for thrombectomy trials.',
        landmark: false,
        phase: 'N/A'
    },
    {
        name: 'DEFUSE',
        year: 2006,
        category: 'imaging',
        fullTitle: 'Diffusion and Perfusion Imaging Evaluation for Understanding Stroke Evolution',
        journal: 'Annals of Neurology',
        doi: '10.1002/ana.20976',
        sampleSize: 74,
        population: 'Acute ischemic stroke patients 3-6 hours from onset treated with IV tPA, all underwent MRI perfusion/diffusion',
        intervention: 'IV alteplase with pre- and post-treatment MRI (observational imaging study)',
        control: 'None (single-arm with imaging-based subgroup analysis)',
        primaryOutcome: {
            measure: 'Early reperfusion in patients with target mismatch profile vs no mismatch',
            result: 'Patients with mismatch and reperfusion had significantly better outcomes: 75% favorable vs 19% without reperfusion, p<0.01'
        },
        secondary: 'Malignant profile (DWI >100 mL) associated with poor outcome regardless of reperfusion. Mismatch volume predicted clinical response.',
        keyFindings: 'Seminal imaging study that defined the "target mismatch" profile for patient selection in acute stroke intervention. Directly led to DEFUSE 2 and DEFUSE 3 trials. Established the paradigm of perfusion imaging-guided treatment.',
        landmark: true,
        phase: 'II'
    },
    {
        name: 'RAPID-CTP Validation',
        year: 2017,
        category: 'imaging',
        fullTitle: 'Automated CT Perfusion Processing in Acute Ischemic Stroke: Validation Study',
        journal: 'Stroke',
        doi: '10.1161/STROKEAHA.116.015237',
        sampleSize: 225,
        population: 'Acute ischemic stroke patients with large vessel occlusion who underwent CT perfusion imaging',
        intervention: 'Automated RAPID software processing of CT perfusion data',
        control: 'Expert manual processing and final infarct volume on follow-up imaging',
        primaryOutcome: {
            measure: 'Accuracy of automated ischemic core (rCBF <30%) estimation',
            result: 'Correlation r=0.80 with DWI core; sensitivity 85%, specificity 94% for predicting core >70 mL'
        },
        secondary: 'Tmax >6s volume correlated with penumbra; median processing time 4.5 minutes vs 20+ minutes for manual processing',
        keyFindings: 'Validated the RAPID automated CT perfusion software that became the standard imaging platform for DAWN and DEFUSE 3 thrombectomy trials. Enabled rapid, reproducible perfusion-based patient selection in routine clinical practice.',
        landmark: false,
        phase: 'N/A'
    },

    // ==========================================
    // THROMBECTOMY — EXPANDED
    // ==========================================
    {
        name: 'TENSION',
        year: 2023,
        category: 'thrombectomy',
        fullTitle: 'Efficacy and Safety of Thrombectomy in Stroke With Extended Lesion and Extended Time Window',
        journal: 'New England Journal of Medicine',
        doi: '10.1056/NEJMoa2310741',
        sampleSize: 253,
        population: 'Acute ischemic stroke with large ischemic core (ASPECTS 3-5) and large vessel occlusion, within 12 hours or late-presenting',
        intervention: 'Endovascular thrombectomy plus best medical management',
        control: 'Best medical management alone',
        primaryOutcome: {
            measure: 'mRS distribution at 90 days (ordinal shift)',
            result: 'Adjusted common OR 1.69 (1.14-2.51), p=0.009, favoring thrombectomy'
        },
        secondary: 'mRS 0-2: 20% vs 12%. mRS 0-3: 38% vs 28%. Mortality: 29% vs 31%. sICH 5% vs 2%.',
        keyFindings: 'Extended the evidence for thrombectomy to patients with large ischemic cores (ASPECTS 3-5), a group previously excluded from most thrombectomy trials. Together with ANGEL-ASPECTS and SELECT2, shifted the paradigm toward treating large-core strokes.',
        landmark: true,
        phase: 'III'
    },
    {
        name: 'HERMES',
        year: 2016,
        category: 'thrombectomy',
        fullTitle: 'Highly Effective Reperfusion Evaluated in Multiple Endovascular Stroke Trials',
        journal: 'The Lancet',
        doi: '10.1016/S0140-6736(16)00163-X',
        sampleSize: 1287,
        population: 'Individual patient data from MR CLEAN, ESCAPE, EXTEND-IA, SWIFT PRIME, and REVASCAT (anterior circulation LVO within 12 hours)',
        intervention: 'Endovascular thrombectomy with stent retriever',
        control: 'Standard medical care including IV tPA when eligible',
        primaryOutcome: {
            measure: 'mRS distribution at 90 days (ordinal shift)',
            result: 'Common OR 2.49 (1.76-3.53), p<0.0001 favoring thrombectomy. NNT 2.6 for reduced disability'
        },
        secondary: 'mRS 0-2: 46% vs 27%. Benefit across all age groups, all baseline NIHSS categories. No interaction with IV tPA use. No increase in mortality.',
        keyFindings: 'Definitive individual patient data meta-analysis of the five landmark thrombectomy trials. Established thrombectomy as one of the most effective treatments in medicine with large absolute benefit. Showed consistent benefit across subgroups.',
        landmark: true,
        phase: 'N/A'
    },
    {
        name: 'DIRECT',
        year: 2020,
        category: 'thrombectomy',
        fullTitle: 'Direct Intraarterial Thrombectomy in Order to Revascularize AIS Patients with Large Vessel Occlusion Efficiently in Chinese Tertiary Hospitals',
        journal: 'JAMA Neurology',
        doi: '10.1001/jamaneurol.2020.2361',
        sampleSize: 656,
        population: 'Acute anterior circulation LVO stroke within 4.5 hours eligible for both IV tPA and thrombectomy',
        intervention: 'Direct thrombectomy without prior IV tPA (bridging)',
        control: 'IV tPA followed by thrombectomy (combined/bridging approach)',
        primaryOutcome: {
            measure: 'Successful reperfusion (mTICI 2b-3) at end of procedure',
            result: '79.4% vs 81.3%; difference -1.9% (non-inferiority not met), p=0.49'
        },
        secondary: 'mRS 0-2 at 90 days: 36.4% vs 36.8%. Mortality: 18.4% vs 17.3%. sICH: 6.1% vs 6.4%.',
        keyFindings: 'Failed to demonstrate non-inferiority of direct thrombectomy over bridging with IV tPA. Supported the continued use of IV tPA before thrombectomy when eligible, though the clinical outcome differences were minimal.',
        landmark: false,
        phase: 'III'
    },
    {
        name: 'MR CLEAN-NO IV',
        year: 2021,
        category: 'thrombectomy',
        fullTitle: 'Multicenter Randomized Clinical Trial of Endovascular Treatment for Acute Ischemic Stroke: Effect of Periprocedural IV Alteplase',
        journal: 'New England Journal of Medicine',
        doi: '10.1056/NEJMoa2023840',
        sampleSize: 539,
        population: 'Acute anterior circulation LVO stroke eligible for IV tPA and thrombectomy, within 4.5 hours',
        intervention: 'Endovascular thrombectomy alone (no prior IV alteplase)',
        control: 'IV alteplase followed by endovascular thrombectomy',
        primaryOutcome: {
            measure: 'mRS distribution at 90 days (ordinal shift)',
            result: 'Adjusted common OR 0.84 (0.62-1.15), p=0.28; no significant difference but unable to confirm non-inferiority'
        },
        secondary: 'mRS 0-2: 51% vs 54%. Mortality: 20% vs 16%. sICH 5.9% vs 5.3%. No significant differences.',
        keyFindings: 'Did not demonstrate that skipping IV tPA before thrombectomy was non-inferior. Along with DIRECT, supported continued bridging approach with IV tPA when eligible, though individual patient circumstances may vary.',
        landmark: false,
        phase: 'III'
    },
    {
        name: 'SWIFT DIRECT',
        year: 2022,
        category: 'thrombectomy',
        fullTitle: 'Solitaire With the Intention For Thrombectomy as PRIMary Endovascular Treatment',
        journal: 'New England Journal of Medicine',
        doi: '10.1056/NEJMoa2111277',
        sampleSize: 408,
        population: 'Acute anterior circulation LVO within 4.5 hours, eligible for both IV tPA and thrombectomy, at centers with fast access to angiography',
        intervention: 'Direct thrombectomy without prior IV tPA',
        control: 'IV tPA combined with thrombectomy',
        primaryOutcome: {
            measure: 'mRS 0-2 at 90 days (non-inferiority)',
            result: '65% vs 68%; difference -2.2% (non-inferiority not met), p=0.18'
        },
        secondary: 'sICH 2.5% vs 3.0%. Mortality 11% vs 10%. No difference in reperfusion rates.',
        keyFindings: 'Third major trial failing to demonstrate non-inferiority of direct thrombectomy vs bridging therapy. Collective evidence from SWIFT DIRECT, MR CLEAN-NO IV, and DIRECT supports continued administration of IV tPA before thrombectomy.',
        landmark: false,
        phase: 'III'
    },

    // ==========================================
    // THROMBOLYSIS — EXPANDED
    // ==========================================
    {
        name: 'PRISMS',
        year: 2018,
        category: 'thrombolysis',
        fullTitle: 'A Study of the Efficacy and Safety of Activase (Alteplase) in Patients With Mild Stroke',
        journal: 'JAMA Neurology',
        doi: '10.1001/jamaneurol.2018.0418',
        sampleSize: 313,
        population: 'Acute ischemic stroke patients with mild nondisabling deficits (NIHSS 0-5) within 3 hours of onset',
        intervention: 'IV alteplase 0.9 mg/kg',
        control: 'Aspirin 325 mg',
        primaryOutcome: {
            measure: 'Favorable outcome (mRS 0-1) at 90 days',
            result: '78.2% vs 81.5%; adjusted RR 0.95 (0.83-1.09), p=0.50. Stopped early for futility.'
        },
        secondary: 'sICH 3.2% vs 0.6%. No mortality difference. Early neurological deterioration similar between groups.',
        keyFindings: 'First RCT addressing IV tPA for mild nondisabling strokes. Stopped early for futility and harm signal (higher ICH). Supported the practice of withholding tPA for clearly nondisabling minor strokes.',
        landmark: false,
        phase: 'III'
    },
    {
        name: 'TASTE',
        year: 2018,
        category: 'thrombolysis',
        fullTitle: 'Tenecteplase versus Alteplase for Stroke Thrombolysis Evaluation',
        journal: 'Stroke',
        doi: '10.1161/STROKEAHA.118.023440',
        sampleSize: 104,
        population: 'Acute ischemic stroke patients eligible for IV thrombolysis within 4.5 hours of onset',
        intervention: 'IV tenecteplase 0.25 mg/kg (single bolus)',
        control: 'IV alteplase 0.9 mg/kg (standard 1-hour infusion)',
        primaryOutcome: {
            measure: 'Proportion with mRS 0-1 at 90 days',
            result: '64% vs 60%; OR 1.19 (0.51-2.78), p=0.69'
        },
        secondary: 'sICH 0% vs 2%. Early reperfusion rates comparable. Superior ease of administration with single bolus.',
        keyFindings: 'Phase 2 study providing additional evidence that tenecteplase was safe and potentially comparable to alteplase for stroke thrombolysis. Contributed to the growing evidence base supporting tenecteplase as a simpler alternative.',
        landmark: false,
        phase: 'II'
    },
    {
        name: 'ATLANTIS',
        year: 1999,
        category: 'thrombolysis',
        fullTitle: 'Alteplase Thrombolysis for Acute Noninterventional Therapy in Ischemic Stroke',
        journal: 'JAMA',
        doi: '10.1001/jama.282.21.2019',
        sampleSize: 613,
        population: 'Acute ischemic stroke patients 3-5 hours from symptom onset',
        intervention: 'IV alteplase 0.9 mg/kg',
        control: 'Placebo',
        primaryOutcome: {
            measure: 'Excellent neurological recovery (NIHSS <=1) at 90 days',
            result: '34% vs 32%; OR 1.06 (0.73-1.53), p=0.75 (not significant)'
        },
        secondary: 'sICH 7.0% vs 1.1%, p<0.001. 90-day mortality 11% vs 7%. mRS 0-1: 42% vs 40%.',
        keyFindings: 'Failed to demonstrate benefit of IV tPA in the 3-5 hour window, but excess ICH seen. Part B established that thrombolysis beyond 3 hours carries higher risk without clear benefit with the standard dose. Contributed to the 3-hour window as initial standard.',
        landmark: true,
        phase: 'III'
    },
    {
        name: 'EPITHET',
        year: 2008,
        category: 'thrombolysis',
        fullTitle: 'Echoplanar Imaging Thrombolytic Evaluation Trial',
        journal: 'Annals of Neurology',
        doi: '10.1002/ana.21522',
        sampleSize: 101,
        population: 'Acute ischemic stroke 3-6 hours from onset with perfusion-weighted MRI performed',
        intervention: 'IV alteplase 0.9 mg/kg',
        control: 'Placebo',
        primaryOutcome: {
            measure: 'Infarct growth attenuation (geometric mean ratio) between groups',
            result: 'Infarct growth lower in tPA group but not statistically significant; ratio 0.23 vs 0.34, p=0.054'
        },
        secondary: 'Higher reperfusion rate with tPA (56% vs 26%, p=0.01). Patients with mismatch who reperfused had best outcomes. sICH 7.7% vs 0%.',
        keyFindings: 'Although primary endpoint was not met, EPITHET provided important proof-of-concept that penumbral imaging can identify patients who benefit from late-window thrombolysis, laying groundwork for EXTEND and WAKE-UP.',
        landmark: false,
        phase: 'II'
    },
    {
        name: 'NOR-TEST 2 Part A',
        year: 2022,
        category: 'thrombolysis',
        fullTitle: 'Norwegian Tenecteplase Stroke Trial 2, Part A',
        journal: 'JAMA Neurology',
        doi: '10.1001/jamaneurol.2022.1749',
        sampleSize: 204,
        population: 'Acute ischemic stroke eligible for IV thrombolysis within 4.5 hours with moderate to severe deficits (NIHSS >=6)',
        intervention: 'IV tenecteplase 0.4 mg/kg single bolus',
        control: 'IV alteplase 0.9 mg/kg standard infusion',
        primaryOutcome: {
            measure: 'mRS 0-1 at 90 days (superiority)',
            result: '54% vs 47%; OR 1.36 (0.81-2.30), p=0.25 (not significant, stopped early for slow enrollment)'
        },
        secondary: 'sICH 3.9% vs 4.0%. Mortality 6.9% vs 7.9%. Favorable trend for tenecteplase in LVO subgroup.',
        keyFindings: 'Follow-up to NOR-TEST focusing on moderate-severe strokes. Though underpowered due to early termination, showed favorable trend for tenecteplase 0.4 mg/kg. Contributed to evidence supporting tenecteplase across stroke severities.',
        landmark: false,
        phase: 'III'
    },

    // ==========================================
    // PREVENTION TRIALS
    // ==========================================
    {
        name: 'HOPE-3',
        year: 2016,
        category: 'prevention',
        fullTitle: 'Heart Outcomes Prevention Evaluation 3',
        journal: 'New England Journal of Medicine',
        doi: '10.1056/NEJMoa1600177',
        sampleSize: 12705,
        population: 'Intermediate-risk adults without cardiovascular disease (10-year risk ~10%)',
        intervention: 'Rosuvastatin 10 mg + candesartan 16 mg/hydrochlorothiazide 12.5 mg (factorial design)',
        control: 'Dual placebo',
        primaryOutcome: {
            measure: 'Composite of cardiovascular death, nonfatal MI, or nonfatal stroke',
            result: 'Rosuvastatin: HR 0.76 (0.64-0.91), p=0.002. BP-lowering: HR 0.93 (0.79-1.10), p=0.40. Combination: HR 0.71 (0.56-0.90), p=0.005'
        },
        secondary: 'Stroke reduction with rosuvastatin: HR 0.70 (0.52-0.95). BP lowering benefited upper tertile of baseline BP only.',
        keyFindings: 'Demonstrated that statin therapy reduces cardiovascular events including stroke in intermediate-risk primary prevention. BP lowering alone did not reach significance but combination therapy provided additive benefit.',
        landmark: true,
        phase: 'III'
    },
    {
        name: 'FOURIER',
        year: 2017,
        category: 'prevention',
        fullTitle: 'Further Cardiovascular Outcomes Research with PCSK9 Inhibition in Subjects with Elevated Risk',
        journal: 'New England Journal of Medicine',
        doi: '10.1056/NEJMoa1615664',
        sampleSize: 27564,
        population: 'Patients with atherosclerotic cardiovascular disease and LDL >=70 mg/dL despite statin therapy',
        intervention: 'Evolocumab (PCSK9 inhibitor) 140 mg Q2W or 420 mg monthly',
        control: 'Matching placebo',
        primaryOutcome: {
            measure: 'Composite of cardiovascular death, MI, stroke, hospitalization for unstable angina, or coronary revascularization',
            result: '9.8% vs 11.3%; HR 0.85 (0.79-0.92), p<0.001'
        },
        secondary: 'Stroke: HR 0.79 (0.66-0.95), p=0.01. Ischemic stroke: HR 0.75 (0.62-0.92). LDL reduced to median 30 mg/dL.',
        keyFindings: 'Landmark PCSK9 inhibitor trial demonstrating significant reduction in cardiovascular events including stroke. Achieved very low LDL levels safely. Established PCSK9 inhibitors as add-on therapy for high-risk patients on maximally tolerated statins.',
        landmark: true,
        phase: 'III'
    },
    {
        name: 'REDUCE-IT',
        year: 2019,
        category: 'prevention',
        fullTitle: 'Reduction of Cardiovascular Events with Icosapent Ethyl — Intervention Trial',
        journal: 'New England Journal of Medicine',
        doi: '10.1056/NEJMoa1812792',
        sampleSize: 8179,
        population: 'Patients with elevated triglycerides (135-499 mg/dL) on statin therapy with established CVD or diabetes plus risk factors',
        intervention: 'Icosapent ethyl (purified EPA) 2 g twice daily',
        control: 'Mineral oil placebo',
        primaryOutcome: {
            measure: 'Composite of cardiovascular death, nonfatal MI, nonfatal stroke, coronary revascularization, or unstable angina',
            result: '17.2% vs 22.0%; HR 0.75 (0.68-0.83), p<0.001'
        },
        secondary: 'Stroke: HR 0.72 (0.55-0.93). Fatal or nonfatal stroke: absolute risk reduction 0.9%. Ischemic stroke: HR 0.64 (0.49-0.85).',
        keyFindings: 'Demonstrated that high-dose purified EPA significantly reduces cardiovascular events including stroke in patients with elevated triglycerides. 28% relative risk reduction for stroke. Unique among omega-3 trials in showing robust cardiovascular benefit.',
        landmark: true,
        phase: 'III'
    },
    {
        name: 'CATIS',
        year: 2014,
        category: 'prevention',
        fullTitle: 'China Antihypertensive Trial in Acute Ischemic Stroke',
        journal: 'JAMA',
        doi: '10.1001/jama.2013.282543',
        sampleSize: 4071,
        population: 'Acute ischemic stroke within 48 hours with elevated systolic BP (140-220 mmHg)',
        intervention: 'Immediate antihypertensive treatment (target SBP reduction 10-25% within 24h, <140/90 within 7 days)',
        control: 'Discontinuation of all antihypertensive medications during hospitalization',
        primaryOutcome: {
            measure: 'Death or major disability (mRS 3-6) at 14 days or hospital discharge',
            result: '33.6% vs 33.6%; OR 1.00 (0.88-1.14), p=0.98'
        },
        secondary: 'No difference at 3 months (mRS 3-6: 25.2% vs 25.3%). No significant difference in recurrent stroke. Mean BP difference achieved was 12.7/4.2 mmHg.',
        keyFindings: 'Showed that moderate early BP reduction in acute ischemic stroke is safe but does not improve short-term outcomes. Contributed to guidelines recommending permissive hypertension in acute ischemic stroke unless extreme.',
        landmark: false,
        phase: 'IV'
    },
    {
        name: 'CHANCE-2',
        year: 2022,
        category: 'prevention',
        fullTitle: 'Clopidogrel in High-Risk Patients with Acute Nondisabling Cerebrovascular Events II',
        journal: 'New England Journal of Medicine',
        doi: '10.1056/NEJMoa2215134',
        sampleSize: 6412,
        population: 'Minor ischemic stroke or TIA within 24 hours, CYP2C19 loss-of-function carrier genotype',
        intervention: 'Ticagrelor 180 mg load then 90 mg BID + aspirin (aspirin for 21 days)',
        control: 'Clopidogrel 300 mg load then 75 mg daily + aspirin (aspirin for 21 days)',
        primaryOutcome: {
            measure: 'Stroke (ischemic or hemorrhagic) at 90 days',
            result: '6.0% vs 7.6%; HR 0.77 (0.64-0.94), p=0.008'
        },
        secondary: 'Ischemic stroke: 5.7% vs 7.2%. Composite vascular events: 6.3% vs 7.8%. No significant difference in bleeding.',
        keyFindings: 'First trial to use pharmacogenomics-guided antiplatelet selection in acute stroke. Showed ticagrelor is superior to clopidogrel for CYP2C19 loss-of-function carriers, establishing a precision medicine approach to secondary stroke prevention.',
        landmark: true,
        phase: 'III'
    },
    {
        name: 'SAMPRISS',
        year: 2020,
        category: 'prevention',
        fullTitle: 'Stenting and Aggressive Medical Management for Preventing Recurrent Stroke in Intracranial Stenosis — Follow-up',
        journal: 'JAMA Neurology',
        doi: '10.1001/jamaneurol.2019.4584',
        sampleSize: 451,
        population: 'SAMMPRIS trial participants with 70-99% intracranial stenosis, long-term follow-up (median 32.4 months)',
        intervention: 'Aggressive medical management (dual antiplatelet, statin, BP, lifestyle modification)',
        control: 'Long-term outcomes from aggressive medical management arm in SAMMPRIS',
        primaryOutcome: {
            measure: 'Stroke or death during long-term follow-up',
            result: '15% in medical arm vs 23% in stenting arm at median 32.4 months; HR 0.60 (0.39-0.93), p=0.02'
        },
        secondary: 'Annual stroke rate in medical arm decreased to 5.8% by year 2. Stenting arm continued to have excess periprocedural events.',
        keyFindings: 'Long-term follow-up reinforcing SAMMPRIS findings that aggressive medical management remains superior to intracranial stenting. Showed durable benefit of intensive risk factor modification for intracranial atherosclerosis.',
        landmark: false,
        phase: 'III'
    },
    {
        name: 'ARCADIA',
        year: 2024,
        category: 'prevention',
        fullTitle: 'AtRial Cardiopathy and Antithrombotic Drugs in Prevention After Cryptogenic Stroke',
        journal: 'New England Journal of Medicine',
        doi: '10.1056/NEJMoa2307617',
        sampleSize: 1015,
        population: 'Recent cryptogenic ischemic stroke with evidence of atrial cardiopathy (P-wave terminal force >5000 microV-ms, NT-proBNP >250 pg/mL, or left atrial diameter index >3 cm/m2) but no documented AF',
        intervention: 'Apixaban 5 mg twice daily',
        control: 'Aspirin 81 mg daily',
        primaryOutcome: {
            measure: 'Recurrent stroke at mean follow-up  1.8 years',
            result: '4.4% vs 4.4%; HR 1.00 (0.64-1.57), p=0.99; stopped for futility'
        },
        secondary: 'Major bleeding: 1.7% vs 0.5%. No benefit in any subgroup including those with multiple cardiopathy markers.',
        keyFindings: 'Definitive trial showing that anticoagulation does not benefit cryptogenic stroke patients with atrial cardiopathy markers but no documented AF. Closed the door on empiric anticoagulation for this population and reinforced the importance of documenting AF before anticoagulating.',
        landmark: true,
        phase: 'III'
    },
    {
        name: 'ODYSSEY Outcomes',
        year: 2018,
        category: 'prevention',
        fullTitle: 'Evaluation of Cardiovascular Outcomes After an Acute Coronary Syndrome During Treatment with Alirocumab',
        journal: 'New England Journal of Medicine',
        doi: '10.1056/NEJMoa1801174',
        sampleSize: 18924,
        population: 'Patients with recent acute coronary syndrome and LDL >=70 mg/dL on maximally tolerated statin',
        intervention: 'Alirocumab (PCSK9 inhibitor) 75-150 mg SC every 2 weeks',
        control: 'Placebo',
        primaryOutcome: {
            measure: 'Composite of coronary heart disease death, nonfatal MI, ischemic stroke, or unstable angina requiring hospitalization',
            result: '9.5% vs 11.1%; HR 0.85 (0.78-0.93), p=0.0003'
        },
        secondary: 'Ischemic stroke: HR 0.73 (0.57-0.93), p=0.01. All-cause mortality: HR 0.85 (0.73-0.98) in LDL >=100 subgroup.',
        keyFindings: 'Second major PCSK9 inhibitor outcomes trial demonstrating reduced cardiovascular events including 27% reduction in ischemic stroke. Complemented FOURIER in establishing PCSK9 inhibitors for high-risk secondary prevention.',
        landmark: true,
        phase: 'III'
    },

    // ==========================================
    // SYSTEMS OF CARE TRIALS
    // ==========================================
    {
        name: 'Helsinki Model',
        year: 2012,
        category: 'systems-of-care',
        fullTitle: 'Reducing In-Hospital Delay to 20 Minutes in Stroke Thrombolysis',
        journal: 'Neurology',
        doi: '10.1212/WNL.0b013e31825f04d0',
        sampleSize: 1938,
        population: 'All acute stroke patients presenting to Helsinki University Central Hospital over implementation period',
        intervention: 'Streamlined stroke protocol: CT in ambulance bay, pre-notification, thrombolysis at CT table, parallel workflow',
        control: 'Pre-implementation historical cohort (standard workflow)',
        primaryOutcome: {
            measure: 'Median door-to-needle time',
            result: 'Reduced from 105 minutes to 20 minutes (p<0.001), achieving the fastest reported DNT globally'
        },
        secondary: 'tPA treatment rate increased, good outcome (mRS 0-1) improved from 37% to 48%. No increase in sICH rates.',
        keyFindings: 'Revolutionary systems redesign achieving a 20-minute median door-to-needle time, the fastest globally reported. Demonstrated that reorganizing workflow (not new drugs or devices) can dramatically improve stroke outcomes. Model adopted worldwide.',
        landmark: true,
        phase: 'N/A'
    },
    {
        name: 'GOLIATH',
        year: 2023,
        category: 'systems-of-care',
        fullTitle: 'General or Local Anesthesia in Intra-Arterial Therapy',
        journal: 'JAMA Neurology',
        doi: '10.1001/jamaneurol.2022.4457',
        sampleSize: 466,
        population: 'Acute anterior circulation LVO stroke undergoing endovascular thrombectomy',
        intervention: 'General anesthesia with intubation',
        control: 'Conscious sedation/local anesthesia',
        primaryOutcome: {
            measure: 'Infarct growth on MRI at 48 hours (primary); mRS at 90 days (key secondary)',
            result: 'Infarct growth: 8.2 vs 19.4 mL, p=0.10. mRS 0-2 at 90 days: 60% vs 57%, p=0.54 (no significant difference)'
        },
        secondary: 'Procedural complications similar. Time to groin puncture 10 minutes longer with GA. Reperfusion rates similar.',
        keyFindings: 'One of the key modern trials addressing anesthesia choice during thrombectomy. Together with SIESTA and AnStroke, showed no major outcome difference between GA and conscious sedation when GA is performed with careful hemodynamic management.',
        landmark: false,
        phase: 'III'
    },
    {
        name: 'RACECAT',
        year: 2021,
        category: 'systems-of-care',
        fullTitle: 'Direct Transfer to an Endovascular Center Compared to Transfer to the Closest Stroke Center in Acute Stroke With Suspected Large Vessel Occlusion',
        journal: 'JAMA Neurology',
        doi: '10.1001/jamaneurol.2021.1993',
        sampleSize: 1401,
        population: 'Acute stroke patients with suspected LVO identified by EMS using RACE scale >=5',
        intervention: 'Direct transfer to comprehensive stroke center (mothership model)',
        control: 'Transfer to closest primary stroke center first (drip-and-ship model)',
        primaryOutcome: {
            measure: 'mRS distribution at 90 days (ordinal shift)',
            result: 'OR 0.88 (0.71-1.09), p=0.24; no significant difference between strategies'
        },
        secondary: 'Median onset to reperfusion: 282 min (mothership) vs 312 min (drip-and-ship). IV tPA receipt: 75% drip-and-ship vs 60% mothership.',
        keyFindings: 'First RCT comparing pre-hospital triage strategies for suspected LVO. Found no significant difference between direct mothership vs drip-and-ship approaches, suggesting both are viable depending on geography and resources.',
        landmark: true,
        phase: 'III'
    },
    {
        name: 'SIESTA',
        year: 2016,
        category: 'systems-of-care',
        fullTitle: 'Sedation vs Intubation for Endovascular Stroke Treatment',
        journal: 'JAMA',
        doi: '10.1001/jama.2016.16623',
        sampleSize: 150,
        population: 'Acute anterior circulation LVO stroke undergoing endovascular thrombectomy',
        intervention: 'General anesthesia with intubation',
        control: 'Conscious sedation',
        primaryOutcome: {
            measure: 'Early neurological improvement (NIHSS change at 24 hours)',
            result: 'Mean NIHSS improvement 3.2 vs 3.6 points, p=0.82 (no significant difference)'
        },
        secondary: 'mRS 0-2 at 3 months: 37% vs 18%, p=0.01 (favoring GA). Mortality 21% vs 34%, p=0.07.',
        keyFindings: 'Challenged the prevailing dogma that conscious sedation is preferable during thrombectomy. Showed general anesthesia may achieve comparable or better outcomes when performed with careful blood pressure management.',
        landmark: false,
        phase: 'III'
    },
    {
        name: 'AnStroke',
        year: 2017,
        category: 'systems-of-care',
        fullTitle: 'Anesthesia During Stroke Trial',
        journal: 'Stroke',
        doi: '10.1161/STROKEAHA.116.015328',
        sampleSize: 90,
        population: 'Acute anterior circulation LVO stroke planned for thrombectomy',
        intervention: 'General anesthesia',
        control: 'Conscious sedation',
        primaryOutcome: {
            measure: 'mRS at 3 months (ordinal shift)',
            result: 'OR 1.91 (0.92-3.98), p=0.09 (trend favoring GA, not significant)'
        },
        secondary: 'mRS 0-2: 42% vs 40%. Procedure duration similar. Mean arterial pressure better maintained in GA group.',
        keyFindings: 'Small pilot RCT supporting feasibility of GA in thrombectomy. Consistent with SIESTA and GOLIATH in showing no detrimental effect of GA when blood pressure is carefully managed.',
        landmark: false,
        phase: 'II'
    },

    // ==========================================
    // REHABILITATION — EXPANDED
    // ==========================================
    {
        name: 'ICARE',
        year: 2016,
        category: 'rehabilitation',
        fullTitle: 'Interdisciplinary Comprehensive Arm Rehabilitation Evaluation',
        journal: 'New England Journal of Medicine',
        doi: '10.1056/NEJMoa1514189',
        sampleSize: 361,
        population: 'Patients 10 to 106 days after stroke with mild to moderate arm motor deficits',
        intervention: 'Structured, task-oriented upper extremity rehabilitation program (Accelerated Skill Acquisition Program)',
        control: 'Dose-equivalent occupational therapy or monitoring-only usual care',
        primaryOutcome: {
            measure: 'Wolf Motor Function Test score at 12 months',
            result: 'ASAP 1.82 vs dose-equivalent OT 1.85 vs usual care 1.71; no significant difference (p=0.41)'
        },
        secondary: 'Similar improvement in Stroke Impact Scale, Action Research Arm Test across all groups. Gains maintained at 12 months regardless of approach.',
        keyFindings: 'Showed that structured, accelerated upper extremity rehabilitation was not superior to an equivalent dose of standard occupational therapy. Highlighted the importance of dose/intensity over specific technique in stroke motor recovery.',
        landmark: false,
        phase: 'III'
    },
    {
        name: 'RATULS',
        year: 2019,
        category: 'rehabilitation',
        fullTitle: 'Robot Assisted Training for the Upper Limb after Stroke',
        journal: 'The Lancet',
        doi: '10.1016/S0140-6736(19)31055-4',
        sampleSize: 770,
        population: 'Stroke patients (1 week to 5 years post) with moderate to severe upper limb impairment',
        intervention: 'Robot-assisted arm training (36 sessions over 12 weeks) or enhanced upper limb therapy (same dose)',
        control: 'Usual care (NHS standard rehabilitation)',
        primaryOutcome: {
            measure: 'Action Research Arm Test (ARAT) at 3 months',
            result: 'Robot vs usual care: adjusted OR 1.17 (0.70-1.96), p=0.55. Enhanced therapy vs usual care: adjusted OR 1.51 (0.90-2.51), p=0.12'
        },
        secondary: 'No significant differences in any measure at 6 months. Robot-assisted training was not superior to either comparator.',
        keyFindings: 'Largest trial of robot-assisted upper limb rehabilitation after stroke. Found no benefit of robot-assisted therapy over usual care or enhanced therapy, dampening enthusiasm for expensive robotic rehabilitation as a standalone approach.',
        landmark: false,
        phase: 'III'
    },
    {
        name: 'EXCITE',
        year: 2006,
        category: 'rehabilitation',
        fullTitle: 'Extremity Constraint-Induced Therapy Evaluation',
        journal: 'JAMA',
        doi: '10.1001/jama.296.17.2095',
        sampleSize: 222,
        population: 'Stroke survivors 3-9 months post-stroke with residual upper extremity motor ability (some active wrist/finger extension)',
        intervention: 'Constraint-induced movement therapy (CIMT): restraint of unaffected arm + intensive affected arm training 6 hrs/day for 2 weeks',
        control: 'Usual care (no intensive structured therapy)',
        primaryOutcome: {
            measure: 'Wolf Motor Function Test time at 12 months',
            result: 'CIMT group showed significantly greater improvement: time reduction 19.3 sec vs 8.0 sec, p<0.001'
        },
        secondary: 'Motor Activity Log amount of use: +1.09 vs +0.48 (p<0.001). Gains maintained at 24 months. More CIMT participants achieved clinically meaningful improvement.',
        keyFindings: 'Landmark multicenter RCT establishing constraint-induced movement therapy as effective for upper extremity rehabilitation after stroke. Changed practice by providing Level 1 evidence for CIMT in the subacute phase.',
        landmark: true,
        phase: 'III'
    },
    {
        name: 'VECTORS',
        year: 2006,
        category: 'rehabilitation',
        fullTitle: 'Very Early Constraint-Induced Movement during Stroke Rehabilitation',
        journal: 'Neurology',
        doi: '10.1212/01.wnl.0000244396.40984.2b',
        sampleSize: 52,
        population: 'Acute ischemic stroke patients within 28 days of onset with residual arm motor function',
        intervention: 'High-intensity CIMT (3 hrs/day shaping + 6 hrs restraint) or standard-intensity CIMT (2 hrs/day)',
        control: 'Standard occupational therapy (same total dose)',
        primaryOutcome: {
            measure: 'Action Research Arm Test at 90 days post-stroke',
            result: 'No significant difference between groups; high-dose CIMT trended worse (p=0.06)'
        },
        secondary: 'High-intensity CIMT group had worse outcomes at 14 days. Standard CIMT and usual care groups performed similarly at 90 days.',
        keyFindings: 'Cautionary trial suggesting that very early, high-intensity constraint-induced therapy may be harmful in acute stroke. Raised important questions about timing and intensity of rehabilitation initiation.',
        landmark: false,
        phase: 'II'
    },
    {
        name: 'SMARTS2',
        year: 2021,
        category: 'rehabilitation',
        fullTitle: 'Study of Motor Learning and Acute Recovery Time Course After Stroke 2',
        journal: 'Neurorehabilitation and Neural Repair',
        doi: '10.1177/15459683211041302',
        sampleSize: 72,
        population: 'Acute ischemic stroke patients within 48 hours of onset with moderate upper extremity paresis',
        intervention: 'Intensive upper extremity therapy starting within 48 hours (60 min/day, 5 days/week for 3 weeks)',
        control: 'Same therapy starting 2 weeks post-stroke',
        primaryOutcome: {
            measure: 'Action Research Arm Test at 6 months',
            result: 'No significant difference between early (mean 45.2) and delayed (mean 44.8) start groups, p=0.88'
        },
        secondary: 'Both groups showed substantial recovery. Time-course of motor recovery was similar regardless of rehabilitation onset timing.',
        keyFindings: 'Challenged the "critical window" hypothesis by showing that initiating intensive upper extremity therapy within 48 hours provided no advantage over starting at 2 weeks. Suggested that early biological recovery may proceed independently of therapy timing.',
        landmark: false,
        phase: 'II'
    },

    // ==========================================
    // BLOOD PRESSURE — EXPANDED
    // ==========================================
    {
        name: 'ENCHANTED BP',
        year: 2019,
        category: 'blood-pressure',
        fullTitle: 'Enhanced Control of Hypertension and Thrombolysis Stroke Study — Blood Pressure Arm',
        journal: 'The Lancet',
        doi: '10.1016/S0140-6736(19)31727-8',
        sampleSize: 2196,
        population: 'Acute ischemic stroke receiving IV thrombolysis with systolic BP 150-220 mmHg',
        intervention: 'Intensive BP lowering (target SBP <130 mmHg within 1 hour)',
        control: 'Guideline-recommended BP management (target SBP <180 mmHg)',
        primaryOutcome: {
            measure: 'Death or disability (mRS 2-6) at 90 days',
            result: '46.0% vs 43.8%; OR 1.08 (0.90-1.29), p=0.41'
        },
        secondary: 'sICH: 14.8% vs 18.7% (p=0.13, trend favoring intensive). Neurological deterioration: 11.8% vs 14.1%. Death: 8.7% vs 7.8%.',
        keyFindings: 'Did not show benefit of intensive BP lowering to SBP <130 mmHg in acute stroke patients receiving thrombolysis. However, there was a signal of reduced ICH risk with lower BP. Supported maintaining moderate BP targets post-thrombolysis.',
        landmark: false,
        phase: 'III'
    },
    {
        name: 'CHHIPS',
        year: 2009,
        category: 'blood-pressure',
        fullTitle: 'Controlling Hypertension and Hypotension Immediately Post-Stroke',
        journal: 'The Lancet Neurology',
        doi: '10.1016/S1474-4422(08)70286-X',
        sampleSize: 179,
        population: 'Acute stroke (ischemic or hemorrhagic) within 36 hours with systolic BP >160 mmHg',
        intervention: 'Labetalol 50 mg BID or lisinopril 5 mg daily (for patients who could not swallow)',
        control: 'Placebo',
        primaryOutcome: {
            measure: 'Death or dependency (mRS 3-5) at 2 weeks',
            result: '61% vs 59%; OR 1.03 (0.60-1.78), p=0.91 (not significant)'
        },
        secondary: 'SBP reduction 21 mmHg greater in active group. 3-month mortality: 9.7% vs 20.3%, p=0.05. No excess early neurological deterioration.',
        keyFindings: 'Small pilot trial showing that early BP lowering in acute stroke is feasible and safe. Notable signal of reduced 3-month mortality with active treatment. Informed design of larger trials including ENOS and INTERACT2.',
        landmark: false,
        phase: 'II'
    },
    {
        name: 'ATACH',
        year: 2010,
        category: 'blood-pressure',
        fullTitle: 'Antihypertensive Treatment of Acute Cerebral Hemorrhage',
        journal: 'Neurocritical Care',
        doi: '10.1007/s12028-010-9415-0',
        sampleSize: 60,
        population: 'Spontaneous supratentorial ICH within 6 hours, initial SBP >=170 mmHg, GCS >=5',
        intervention: 'IV nicardipine targeting SBP 170-200, 140-170, or 110-140 mmHg (3 tiers)',
        control: 'Dose-escalation design comparing three BP targets (no separate control)',
        primaryOutcome: {
            measure: 'Feasibility and safety of tiered BP reduction',
            result: 'All three targets achieved in >90% of subjects. Neurological deterioration or death at 72h: 20%, 5%, 10% in the three tiers respectively'
        },
        secondary: 'Hematoma growth tended to be less with more aggressive BP targets. No significant increase in adverse events with lower targets.',
        keyFindings: 'Phase 1 dose-escalation pilot study that established the safety and feasibility of aggressive early BP lowering in acute ICH. Led directly to the ATACH-2 phase 3 trial.',
        landmark: false,
        phase: 'II'
    },
    {
        name: 'INTERACT',
        year: 2008,
        category: 'blood-pressure',
        fullTitle: 'Intensive Blood Pressure Reduction in Acute Cerebral Haemorrhage Trial — Pilot Phase',
        journal: 'The Lancet Neurology',
        doi: '10.1016/S1474-4422(08)70027-6',
        sampleSize: 404,
        population: 'Spontaneous ICH within 6 hours with elevated systolic BP (150-220 mmHg)',
        intervention: 'Intensive BP lowering (target SBP <140 mmHg within 1 hour)',
        control: 'Guideline-based BP management (target SBP <180 mmHg)',
        primaryOutcome: {
            measure: 'Proportional change in hematoma volume at 24 hours',
            result: 'Mean proportional hematoma growth 36.3% (guideline) vs 13.7% (intensive); absolute difference 22.6%, p=0.04'
        },
        secondary: 'No significant increase in neurological deterioration, adverse events, or early death with intensive lowering.',
        keyFindings: 'Pilot trial demonstrating that early intensive BP lowering in ICH can attenuate hematoma growth. Provided the safety and efficacy signal that justified the large INTERACT2 trial.',
        landmark: false,
        phase: 'II'
    },
    {
        name: 'ARUBA',
        year: 2014,
        category: 'blood-pressure',
        fullTitle: 'A Randomized Trial of Unruptured Brain Arteriovenous Malformations',
        journal: 'The Lancet',
        doi: '10.1016/S0140-6736(13)62302-8',
        sampleSize: 226,
        population: 'Adults with unruptured brain arteriovenous malformations (AVMs)',
        intervention: 'Interventional therapy (neurosurgery, embolization, radiosurgery, or combination)',
        control: 'Medical management alone (antiepileptic drugs, BP control)',
        primaryOutcome: {
            measure: 'Composite of death or symptomatic stroke',
            result: '30.7% intervention vs 10.1% medical management; HR 3.70 (1.85-7.39), p<0.0001'
        },
        secondary: 'Stroke alone: 28.1% vs 9.3%. No mortality difference. Risk highest in first year after intervention.',
        keyFindings: 'Controversial trial showing that interventional treatment of unruptured brain AVMs resulted in significantly worse outcomes than medical management alone. Changed management paradigm for incidental AVMs, though long-term follow-up data are still accumulating.',
        landmark: true,
        phase: 'N/A'
    },

    // ==========================================
    // ADDITIONAL TRIALS ACROSS CATEGORIES
    // ==========================================
    {
        name: 'EXTEND-IA TNK',
        year: 2018,
        category: 'thrombolysis',
        fullTitle: 'Extending the Time for Thrombolysis in Emergency Neurological Deficits — Intra-Arterial Using Tenecteplase',
        journal: 'New England Journal of Medicine',
        doi: '10.1056/NEJMoa1716405',
        sampleSize: 202,
        population: 'Acute ischemic stroke with LVO planned for thrombectomy, within 4.5 hours',
        intervention: 'IV tenecteplase 0.25 mg/kg before thrombectomy',
        control: 'IV alteplase 0.9 mg/kg before thrombectomy',
        primaryOutcome: {
            measure: 'Reperfusion of >50% of initially involved ischemic territory at initial angiographic assessment',
            result: '22% vs 10%; RR 2.2 (1.1-4.4), p=0.03 favoring tenecteplase'
        },
        secondary: 'mRS 0-2 at 90 days: 64% vs 51% (p=0.06). No difference in sICH or mortality.',
        keyFindings: 'First randomized evidence showing tenecteplase superior to alteplase for pre-thrombectomy thrombolysis, achieving higher early reperfusion rates. Major catalyst for the global shift from alteplase to tenecteplase in acute stroke.',
        landmark: true,
        phase: 'II'
    },
    {
        name: 'NOR-TEST',
        year: 2017,
        category: 'thrombolysis',
        fullTitle: 'Norwegian Tenecteplase Stroke Trial',
        journal: 'The Lancet Neurology',
        doi: '10.1016/S1474-4422(17)30253-3',
        sampleSize: 1100,
        population: 'Acute ischemic stroke eligible for IV thrombolysis within 4.5 hours (NIHSS median 4)',
        intervention: 'IV tenecteplase 0.4 mg/kg (higher dose than later trials)',
        control: 'IV alteplase 0.9 mg/kg',
        primaryOutcome: {
            measure: 'mRS 0-1 at 90 days (superiority)',
            result: '64% vs 63%; OR 1.08 (0.84-1.38), p=0.52'
        },
        secondary: 'sICH 3% vs 2%. Mortality 3.8% vs 3.4%. Noted predominantly mild strokes enrolled (median NIHSS 4).',
        keyFindings: 'Did not show superiority of high-dose tenecteplase (0.4 mg/kg) over alteplase, possibly because the population had predominantly mild strokes. Led to subsequent trials using the 0.25 mg/kg dose that proved more effective.',
        landmark: false,
        phase: 'III'
    },
    {
        name: 'TIMING',
        year: 2022,
        category: 'anticoagulation',
        fullTitle: 'Timing of Oral Anticoagulant Therapy in Acute Ischemic Stroke with Atrial Fibrillation',
        journal: 'European Heart Journal',
        doi: '10.1093/eurheartj/ehac413',
        sampleSize: 888,
        population: 'Acute ischemic stroke with atrial fibrillation, eligible for oral anticoagulation',
        intervention: 'Early DOAC initiation (within 4 days of stroke onset)',
        control: 'Delayed DOAC initiation (5-10 days after stroke onset)',
        primaryOutcome: {
            measure: 'Composite of recurrent ischemic stroke, symptomatic ICH, or all-cause death within 90 days',
            result: '6.9% vs 8.7%; HR 0.79 (0.47-1.32), p=0.37 (non-inferiority met for early initiation)'
        },
        secondary: 'Recurrent ischemic stroke: 3.1% vs 4.6%. sICH: 1.1% vs 0.6%. No increase in major bleeding with early DOAC.',
        keyFindings: 'Swedish registry-randomized trial showing that early DOAC initiation within 4 days of cardioembolic stroke was non-inferior to delayed initiation. Along with ELAN, supported the safety of early anticoagulation after stroke with AF.',
        landmark: false,
        phase: 'IV'
    },
    {
        name: 'PACIFIC-Stroke',
        year: 2023,
        category: 'anticoagulation',
        fullTitle: 'Prevention of Stroke Recurrence in Patients with Atrial Cardiopathy Using Apixaban',
        journal: 'JAMA',
        doi: '10.1001/jama.2023.16736',
        sampleSize: 456,
        population: 'Recent cryptogenic stroke with evidence of atrial cardiopathy (elevated NT-proBNP, P-wave terminal force, or left atrial enlargement) but no AF',
        intervention: 'Apixaban 5 mg twice daily (or dose-reduced per label)',
        control: 'Aspirin 81 mg daily',
        primaryOutcome: {
            measure: 'Recurrent stroke (ischemic or hemorrhagic) or TIA',
            result: 'Trial stopped for futility; 5.7% vs 7.2% at median 1.5 years, HR 0.79 (0.41-1.52), p=0.49'
        },
        secondary: 'Major bleeding: 4.1% vs 0.9%. No reduction in recurrent ischemic stroke with apixaban.',
        keyFindings: 'Failed to show benefit of anticoagulation over aspirin in cryptogenic stroke patients with atrial cardiopathy markers but no documented AF. Increased major bleeding with apixaban. Did not support empiric anticoagulation for suspected subclinical AF.',
        landmark: false,
        phase: 'III'
    },
    {
        name: 'FASTEST',
        year: 2023,
        category: 'hemorrhagic',
        fullTitle: 'Factor Seven for Acute Hemorrhagic Stroke Treatment',
        journal: 'Stroke',
        doi: '10.1161/STROKEAHA.122.041680',
        sampleSize: 100,
        population: 'Spontaneous ICH within 120 minutes of symptom onset, on anticoagulation or not',
        intervention: 'Recombinant factor VIIa (rFVIIa) 80 mcg/kg IV within 120 minutes of onset',
        control: 'Placebo',
        primaryOutcome: {
            measure: 'mRS 0-3 at 180 days',
            result: 'Study halted for futility after 100 of planned 860 patients; 37% vs 29%, OR 1.4 (0.6-3.4), p=0.40'
        },
        secondary: 'Hematoma expansion at 24 hours: 24% vs 37% (trend favoring rFVIIa). Thromboembolic events: 10% vs 4%.',
        keyFindings: 'Ultra-early rFVIIa trial targeting the hyperacute ICH window. Though stopped for slow enrollment, showed a signal for reduced hematoma expansion. Highlighted the challenge of enrolling patients within 2 hours of ICH onset.',
        landmark: false,
        phase: 'III'
    },
    {
        name: 'SWITCH',
        year: 2024,
        category: 'hemorrhagic',
        fullTitle: 'Swiss Trial of Decompressive Craniectomy versus Best Medical Treatment of Spontaneous Supratentorial Intracerebral Hemorrhage',
        journal: 'The Lancet',
        doi: '10.1016/S0140-6736(24)00702-5',
        sampleSize: 201,
        population: 'Spontaneous supratentorial ICH with GCS motor <=5, volume >=30 mL, with or without IVH, within 66 hours',
        intervention: 'Decompressive hemicraniectomy plus best medical treatment',
        control: 'Best medical treatment alone',
        primaryOutcome: {
            measure: 'mRS 0-4 at 6 months',
            result: '42% vs 30%; OR 1.67 (0.90-3.10), p=0.10 (not significant)'
        },
        secondary: 'Mortality: 40% vs 58%, p=0.02. mRS 0-3: 18% vs 10%. Stopped early due to slow enrollment.',
        keyFindings: 'First RCT of decompressive hemicraniectomy specifically for ICH (not malignant infarction). Though primary endpoint was not significant, mortality was reduced. Showed decompressive surgery may have a role in selected severe ICH cases.',
        landmark: false,
        phase: 'III'
    },
    {
        name: 'MISTIE II',
        year: 2016,
        category: 'hemorrhagic',
        fullTitle: 'Minimally Invasive Surgery Plus rt-PA for Intracerebral Hemorrhage Evacuation Phase II',
        journal: 'Stroke',
        doi: '10.1161/STROKEAHA.115.011415',
        sampleSize: 96,
        population: 'Spontaneous supratentorial ICH >=20 mL, stable on repeat CT, within 72 hours',
        intervention: 'Stereotactic catheter placement with rt-PA instillation (up to 9 doses of 1 mg) for clot lysis',
        control: 'Standard medical management',
        primaryOutcome: {
            measure: 'Safety: 30-day mortality and symptomatic bleeding',
            result: '9.5% vs 14.8% 30-day mortality (p=0.54). Symptomatic bleeding: 9.5% vs 2.6%.'
        },
        secondary: 'Clot reduction to <15 mL achieved in 46% of surgical patients. Greater clot reduction associated with better outcomes (mRS 0-3: 38% vs 20% if clot reduced vs not).',
        keyFindings: 'Phase 2 safety trial demonstrating feasibility of catheter-based clot evacuation with rt-PA for ICH. Identified clot reduction to <15 mL as key target for benefit. Informed the design of the larger MISTIE III trial.',
        landmark: false,
        phase: 'II'
    },
    {
        name: 'WAKE-UP 2',
        year: 2023,
        category: 'imaging',
        fullTitle: 'Efficacy and Safety of Thrombolysis in Wake-Up Stroke 2',
        journal: 'The Lancet Neurology',
        doi: '10.1016/S1474-4422(23)00334-X',
        sampleSize: 503,
        population: 'Wake-up stroke or unknown-onset stroke with DWI-FLAIR mismatch on MRI, no LVO',
        intervention: 'IV alteplase 0.9 mg/kg',
        control: 'Placebo',
        primaryOutcome: {
            measure: 'mRS 0-1 at 90 days',
            result: '51.5% vs 41.5%; OR 1.49 (1.05-2.12), p=0.03'
        },
        secondary: 'sICH 2.8% vs 0.4%. Mortality 3.2% vs 2.4%. Ordinal mRS shift significantly favoring alteplase.',
        keyFindings: 'Confirmed and extended the findings of the original WAKE-UP trial, reinforcing that MRI DWI-FLAIR mismatch reliably identifies wake-up stroke patients who benefit from IV thrombolysis.',
        landmark: false,
        phase: 'III'
    }

    ); // end push
})();
