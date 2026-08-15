// Neuro-Epi — Trial Database Expansion (Batch 2)
// Neuroprotection, ICH, SAH, and Carotid/Stenting trials

TrialDatabase.trials.push(
  // ==========================================
  // NEUROPROTECTION TRIALS
  // ==========================================
  {
    name: "SAINT I",
    fullTitle: "Stroke-Acute Ischemic NXY Treatment I",
    year: 2006,
    journal: "New England Journal of Medicine",
    pmid: "16467546",
    doi: "10.1056/NEJMoa052980",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 1722,
    population: "Acute ischemic stroke within 6 hours of symptom onset",
    intervention: "NXY-059 (free radical trapping agent) IV infusion for 72 hours",
    comparator: "Placebo",
    primaryOutcome: {
      measure: "mRS distribution (ordinal shift) at 90 days",
      result: "OR 1.20",
      ci: "1.01-1.42",
      pValue: "p=0.045"
    },
    keySecondary: [
      "No significant effect on NIHSS at 90 days",
      "No significant safety concerns"
    ],
    significance: "First neuroprotective agent to show a positive primary outcome in a phase 3 acute ischemic stroke trial. Generated excitement but the modest effect was not confirmed in the larger SAINT II trial.",
    category: "neuroprotection",
    subcategory: "free radical scavenger",
    tags: ["neuroprotection", "NXY-059", "free radical", "acute stroke"],
    blinding: "double-blind",
    fundingSource: "Industry (AstraZeneca)",
    phase: "Phase 3"
  },
  {
    name: "SAINT II",
    fullTitle: "Stroke-Acute Ischemic NXY Treatment II",
    year: 2007,
    journal: "New England Journal of Medicine",
    pmid: "17687131",
    doi: "10.1056/NEJMoa070240",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 3306,
    population: "Acute ischemic stroke within 6 hours of symptom onset",
    intervention: "NXY-059 (free radical trapping agent) IV infusion for 72 hours",
    comparator: "Placebo",
    primaryOutcome: {
      measure: "mRS distribution (ordinal shift) at 90 days",
      result: "OR 0.94",
      ci: "0.83-1.06",
      pValue: "p=0.33"
    },
    keySecondary: [
      "No benefit on any secondary endpoint including NIHSS",
      "SAINT I positive result not replicated"
    ],
    significance: "Definitively failed to confirm the SAINT I result, ending NXY-059 development. Became a cautionary tale about the fragility of single positive neuroprotection trials and the critical importance of replication.",
    category: "neuroprotection",
    subcategory: "free radical scavenger",
    tags: ["neuroprotection", "NXY-059", "free radical", "negative trial", "failed replication"],
    blinding: "double-blind",
    fundingSource: "Industry (AstraZeneca)",
    phase: "Phase 3"
  },
  {
    name: "ALIAS Part 2",
    fullTitle: "Albumin in Acute Ischemic Stroke Part 2",
    year: 2013,
    journal: "The Lancet Neurology",
    pmid: "24076337",
    doi: "10.1016/S1474-4422(13)70223-0",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 841,
    population: "Acute ischemic stroke within 5 hours of symptom onset, treated with or eligible for IV tPA",
    intervention: "25% human albumin 2 g/kg IV over 2 hours",
    comparator: "Isotonic saline placebo",
    primaryOutcome: {
      measure: "Favorable outcome (mRS 0-1 or NIHSS 0-1) at 90 days",
      result: "44.4% vs 44.3%",
      ci: "Difference 0.1% (-7.5 to 7.7)",
      pValue: "p=0.96"
    },
    keySecondary: [
      "Higher rate of pulmonary edema with albumin (13% vs 1%)",
      "Trial stopped early for safety and futility"
    ],
    significance: "High-dose albumin did not improve outcomes in acute ischemic stroke and caused significant pulmonary edema. Trial stopped early. Ended a promising neuroprotective hypothesis based on preclinical data.",
    category: "neuroprotection",
    subcategory: "albumin",
    tags: ["neuroprotection", "albumin", "acute stroke", "negative trial", "stopped early"],
    blinding: "double-blind",
    fundingSource: "NIH/NINDS",
    phase: "Phase 3"
  },
  {
    name: "FAST-MAG",
    fullTitle: "Field Administration of Stroke Therapy - Magnesium",
    year: 2015,
    journal: "New England Journal of Medicine",
    pmid: "25651247",
    doi: "10.1056/NEJMoa1408827",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 1700,
    population: "Suspected acute stroke within 2 hours of symptom onset, enrolled in the field by paramedics",
    intervention: "IV magnesium sulfate (4 g bolus in field, then 16 g over 24 hours in facility)",
    comparator: "Placebo",
    primaryOutcome: {
      measure: "mRS distribution (ordinal shift) at 90 days",
      result: "No significant difference",
      ci: "Not reported",
      pValue: "p=0.28"
    },
    keySecondary: [
      "Achieved ultra-early treatment (median 45 minutes from symptom onset)",
      "Demonstrated feasibility of prefacility stroke trial enrollment by paramedics"
    ],
    significance: "Despite achieving the fastest-ever treatment times in a stroke neuroprotection trial, prefacility magnesium did not improve outcomes. Proved that large-scale prefacility stroke trials are feasible and informed future trial design.",
    category: "neuroprotection",
    subcategory: "magnesium",
    tags: ["neuroprotection", "magnesium", "prefacility", "paramedic", "negative trial"],
    blinding: "double-blind",
    fundingSource: "NIH/NINDS",
    phase: "Phase 3"
  },
  {
    name: "URICO-ICTUS",
    fullTitle: "Efficacy Study of Combined Treatment with Uric Acid and rtPA in Acute Ischemic Stroke",
    year: 2014,
    journal: "The Lancet Neurology",
    pmid: "24703208",
    doi: "10.1016/S1474-4422(14)70054-7",
    design: "Phase 2b/3 RCT, double-blind, placebo-controlled",
    n: 411,
    population: "Acute ischemic stroke treated with IV alteplase within 4.5 hours",
    intervention: "IV uric acid 1000 mg with alteplase",
    comparator: "Placebo with alteplase",
    primaryOutcome: {
      measure: "Excellent outcome (mRS 0-1) at 90 days",
      result: "39.3% vs 33.0%",
      ci: "OR 1.30 (0.87-1.96)",
      pValue: "p=0.20"
    },
    keySecondary: [
      "Subgroup of women showed significant benefit (OR 2.30, p=0.04)",
      "Prevented early ischemic worsening"
    ],
    significance: "Uric acid added to tPA did not significantly improve overall outcomes. However, subgroup analyses suggested benefit in women and in patients with elevated baseline glucose, generating hypotheses for future targeted trials.",
    category: "neuroprotection",
    subcategory: "antioxidant",
    tags: ["neuroprotection", "uric acid", "antioxidant", "tPA", "acute stroke"],
    blinding: "double-blind",
    fundingSource: "Academic (Spanish government grants)",
    phase: "Phase 2b/3"
  },
  {
    name: "ESCAPE-NA1",
    fullTitle: "Safety and Efficacy of Nerinetide for the Treatment of Acute Ischaemic Stroke",
    year: 2020,
    journal: "The Lancet",
    pmid: "32087818",
    doi: "10.1016/S0140-6736(20)30258-0",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 1105,
    population: "Acute ischemic stroke due to large vessel occlusion selected for endovascular thrombectomy",
    intervention: "Nerinetide (NA-1) 2.6 mg/kg IV single dose before EVT",
    comparator: "Placebo before EVT",
    primaryOutcome: {
      measure: "Good functional outcome (mRS 0-2) at 90 days",
      result: "61.4% vs 59.2%",
      ci: "RR 1.04 (0.96-1.14)",
      pValue: "p=0.35"
    },
    keySecondary: [
      "In patients NOT receiving alteplase, nerinetide significantly improved outcomes (mRS 0-2: 59.3% vs 49.8%, p=0.03)",
      "Alteplase appeared to cleave and inactivate nerinetide"
    ],
    significance: "Nerinetide did not improve outcomes overall in EVT patients. However, the pre-specified subgroup not treated with alteplase showed significant benefit, suggesting a drug-drug interaction. Led to the ESCAPE-NEXT trial testing nerinetide without tPA.",
    category: "neuroprotection",
    subcategory: "PSD-95 inhibitor",
    tags: ["neuroprotection", "nerinetide", "NA-1", "PSD-95", "thrombectomy", "drug interaction"],
    blinding: "double-blind",
    fundingSource: "Industry (NoNO Inc.)",
    phase: "Phase 3"
  },
  {
    name: "ICTUS",
    fullTitle: "International Citicoline Trial on Acute Stroke",
    year: 2012,
    journal: "The Lancet",
    pmid: "22691567",
    doi: "10.1016/S0140-6736(12)60813-7",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 2298,
    population: "Moderate-to-severe acute ischemic stroke (NIHSS >=8) within 24 hours of onset",
    intervention: "Citicoline 2000 mg/day IV for 3 days then oral for 6 weeks",
    comparator: "Placebo",
    primaryOutcome: {
      measure: "Global recovery at 90 days (combined mRS 0-1, NIHSS 0-1, Barthel >=95)",
      result: "25.2% vs 27.9%",
      ci: "OR 0.87 (0.72-1.05)",
      pValue: "p=0.15"
    },
    keySecondary: [
      "No benefit on any individual component of the composite",
      "Trial stopped early for futility at prespecified interim analysis"
    ],
    significance: "Definitively showed that citicoline does not improve outcome in acute ischemic stroke. Ended decades of investigation into citicoline as a neuroprotectant despite promising earlier phase 2 data and widespread clinical use.",
    category: "neuroprotection",
    subcategory: "citicoline",
    tags: ["neuroprotection", "citicoline", "negative trial", "futility", "stopped early"],
    blinding: "double-blind",
    fundingSource: "Industry (Ferrer Internacional)",
    phase: "Phase 3"
  },
  {
    name: "NEST-2",
    fullTitle: "NeuroThera Effectiveness and Safety Trial 2",
    year: 2009,
    journal: "Stroke",
    pmid: "19233936",
    doi: "10.1161/STROKEAHA.109.547547",
    design: "Phase 3 RCT, double-blind, sham-controlled",
    n: 660,
    population: "Acute ischemic stroke (NIHSS 7-22) within 24 hours of symptom onset",
    intervention: "Transcranial near-infrared laser therapy (TLT) applied to the shaved scalp",
    comparator: "Sham laser procedure",
    primaryOutcome: {
      measure: "mRS 0-2 at 90 days",
      result: "36.3% vs 30.9%",
      ci: "Not significant",
      pValue: "p=0.094"
    },
    keySecondary: [
      "Pre-specified subgroup with moderate severity (NIHSS 7-15) showed nominal benefit",
      "Mortality was similar between groups"
    ],
    significance: "Transcranial laser therapy failed to improve outcomes in acute ischemic stroke. Followed a small positive NEST-1 pilot trial. Demonstrated the challenges of novel non-pharmacological neuroprotection approaches.",
    category: "neuroprotection",
    subcategory: "laser therapy",
    tags: ["neuroprotection", "laser therapy", "transcranial", "device", "negative trial"],
    blinding: "double-blind",
    fundingSource: "Industry (PhotoThera Inc.)",
    phase: "Phase 3"
  },
  {
    name: "CHANT",
    fullTitle: "Cooling for Acute Ischemic Brain Damage (the CHANT trial)",
    year: 2007,
    journal: "Stroke",
    pmid: "17569876",
    doi: "10.1161/STROKEAHA.106.472746",
    design: "Phase 2 RCT, open-label with blinded outcome assessment",
    n: 18,
    population: "Acute ischemic stroke within 12 hours of symptom onset",
    intervention: "Endovascular cooling to 33 degrees Celsius for 24 hours using the Celsius Control System",
    comparator: "Standard medical management",
    primaryOutcome: {
      measure: "Feasibility and safety of endovascular cooling",
      result: "Target temperature achieved in 77% of patients",
      ci: "Not applicable",
      pValue: "Not applicable"
    },
    keySecondary: [
      "Pneumonia was the most common adverse event (50% in cooling group)",
      "Shivering manageable with meperidine and buspirone"
    ],
    significance: "Small feasibility trial demonstrating that endovascular cooling after acute ischemic stroke is technically feasible but associated with significant complications, particularly pneumonia. Informed the design of subsequent larger hypothermia trials.",
    category: "neuroprotection",
    subcategory: "hypothermia",
    tags: ["neuroprotection", "hypothermia", "cooling", "feasibility", "pilot"],
    blinding: "open-label",
    fundingSource: "Industry (Innercool Therapies)",
    phase: "Phase 2"
  },
  {
    name: "EuroHYP-1",
    fullTitle: "European Multicenter, Randomized, Phase III Clinical Trial of Hypothermia Plus Best Medical Treatment vs. Best Medical Treatment Alone for Acute Ischaemic Stroke",
    year: 2019,
    journal: "European Stroke Journal",
    pmid: "31984233",
    doi: "10.1177/2396987319844690",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 98,
    population: "Acute ischemic stroke (NIHSS 6-18) within 6 hours of symptom onset",
    intervention: "Surface cooling to 34-35 degrees Celsius for 24 hours plus best medical treatment",
    comparator: "Best medical treatment alone",
    primaryOutcome: {
      measure: "mRS distribution (ordinal shift) at 91 days",
      result: "Trial terminated early — insufficient data for definitive analysis",
      ci: "Not applicable",
      pValue: "Not applicable"
    },
    keySecondary: [
      "Only 98 of planned 1500 patients recruited before termination",
      "Cooling was associated with pneumonia and shivering"
    ],
    significance: "Terminated prematurely due to slow recruitment and funding loss after enrolling only 98 of 1500 planned patients. Highlighted the enormous practical challenges of conducting large hypothermia trials in acute stroke, including difficulty maintaining cooling protocols.",
    category: "neuroprotection",
    subcategory: "hypothermia",
    tags: ["neuroprotection", "hypothermia", "cooling", "stopped early", "feasibility challenge"],
    blinding: "open-label",
    fundingSource: "European Union (EU FP7)",
    phase: "Phase 3"
  },

  // ==========================================
  // INTRACEREBRAL HEMORRHAGE TRIALS
  // ==========================================
  {
    name: "INTERACT2",
    fullTitle: "Intensive Blood Pressure Reduction in Acute Cerebral Haemorrhage Trial 2",
    year: 2013,
    journal: "New England Journal of Medicine",
    pmid: "23713578",
    doi: "10.1056/NEJMoa1214609",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 2839,
    population: "Spontaneous intracerebral hemorrhage within 6 hours with elevated systolic blood pressure (150-220 mmHg)",
    intervention: "Intensive BP lowering (target SBP <140 mmHg within 1 hour)",
    comparator: "Guideline-recommended BP management (target SBP <180 mmHg)",
    primaryOutcome: {
      measure: "Death or major disability (mRS 3-6) at 90 days",
      result: "OR 0.87",
      ci: "0.75-1.01",
      pValue: "p=0.06"
    },
    keySecondary: [
      "Ordinal mRS shift analysis favored intensive treatment (OR 0.87, p=0.04)",
      "No increase in serious adverse events with intensive lowering"
    ],
    significance: "Although the dichotomous primary endpoint narrowly missed significance, the ordinal analysis supported benefit. Transformed ICH management by establishing intensive BP lowering to <140 mmHg as standard practice in acute ICH guidelines worldwide.",
    category: "ich",
    subcategory: "blood pressure",
    tags: ["ICH", "blood pressure", "intensive treatment", "hematoma expansion", "landmark"],
    blinding: "open-label",
    fundingSource: "NHMRC Australia",
    phase: "Phase 3",
    landmark: true
  },
  {
    name: "ATACH-2",
    fullTitle: "Antihypertensive Treatment of Acute Cerebral Hemorrhage II",
    year: 2016,
    journal: "New England Journal of Medicine",
    pmid: "27276234",
    doi: "10.1056/NEJMoa1603460",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 1000,
    population: "Spontaneous supratentorial ICH within 4.5 hours with GCS >=5 and SBP >180 mmHg",
    intervention: "Intensive BP lowering (target SBP 110-139 mmHg with IV nicardipine)",
    comparator: "Standard BP lowering (target SBP 140-179 mmHg)",
    primaryOutcome: {
      measure: "Death or disability (mRS 4-6) at 3 months",
      result: "38.7% vs 37.7%",
      ci: "RR 1.04 (0.85-1.27)",
      pValue: "p=0.72"
    },
    keySecondary: [
      "More renal adverse events in the intensive group within 7 days (9.0% vs 4.0%)",
      "No significant difference in hematoma expansion rates"
    ],
    significance: "More aggressive BP lowering to SBP 110-139 mmHg was not superior to 140-179 mmHg and was associated with more renal adverse events. Defined the floor for safe BP targets in acute ICH, supporting <140 mmHg but not <110 mmHg.",
    category: "ich",
    subcategory: "blood pressure",
    tags: ["ICH", "blood pressure", "nicardipine", "negative trial", "renal adverse events"],
    blinding: "open-label",
    fundingSource: "NIH/NINDS",
    phase: "Phase 3"
  },
  {
    name: "MISTIE III",
    fullTitle: "Minimally Invasive Surgery Plus Alteplase for Intracerebral Hemorrhage Evacuation III",
    year: 2019,
    journal: "The Lancet",
    pmid: "30739747",
    doi: "10.1016/S0140-6736(19)30195-3",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 506,
    population: "Spontaneous supratentorial ICH >=30 mL, stable on CT at 12-72 hours post-ictus",
    intervention: "Minimally invasive catheter-based surgery with alteplase irrigation (up to 9 doses of 1 mg)",
    comparator: "Standard medical management per AHA/ASA guidelines",
    primaryOutcome: {
      measure: "Good functional outcome (mRS 0-3) at 365 days",
      result: "45% vs 41%",
      ci: "Adjusted OR 1.33 (0.86-2.07)",
      pValue: "p=0.33"
    },
    keySecondary: [
      "Achieving residual clot <15 mL was associated with significantly better outcomes (adjusted OR 4.49)",
      "Mortality was 15% in both groups"
    ],
    significance: "Failed primary endpoint but identified a critical biological threshold: reducing clot volume to <15 mL was strongly associated with improved outcomes. This dose-response finding guided the design of subsequent surgical ICH trials including ENRICH.",
    category: "ich",
    subcategory: "surgical",
    tags: ["ICH", "minimally invasive surgery", "alteplase", "catheter-based", "dose-response"],
    blinding: "open-label",
    fundingSource: "NIH/NINDS",
    phase: "Phase 3"
  },
  {
    name: "STICH",
    fullTitle: "International Surgical Trial in Intracerebral Haemorrhage",
    year: 2005,
    journal: "The Lancet",
    pmid: "15680453",
    doi: "10.1016/S0140-6736(05)17826-X",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 1033,
    population: "Spontaneous supratentorial ICH within 72 hours where clinical equipoise existed for surgical intervention",
    intervention: "Early open craniotomy and hematoma evacuation within 24 hours of randomization",
    comparator: "Initial conservative management with surgery allowed if neurological deterioration occurred",
    primaryOutcome: {
      measure: "Favorable outcome on Glasgow Outcome Scale at 6 months",
      result: "26% vs 24%",
      ci: "OR 0.89 (0.66-1.19)",
      pValue: "p=0.414"
    },
    keySecondary: [
      "26% of patients in the conservative arm crossed over to surgery",
      "Subgroup analysis suggested possible benefit for lobar hematomas within 1 cm of cortical surface"
    ],
    significance: "Showed no overall benefit of early craniotomy for spontaneous ICH. The lobar subgroup finding led directly to the STICH II trial. Established that routine early surgery is not indicated for most ICH patients.",
    category: "ich",
    subcategory: "surgical",
    tags: ["ICH", "craniotomy", "surgery", "negative trial", "lobar subgroup"],
    blinding: "open-label",
    fundingSource: "UK Medical Research Council",
    phase: "Phase 3"
  },
  {
    name: "STICH II",
    fullTitle: "Early Surgery versus Initial Conservative Treatment in Patients with Spontaneous Supratentorial Lobar Intracerebral Haemorrhages (STICH II)",
    year: 2013,
    journal: "The Lancet",
    pmid: "23726393",
    doi: "10.1016/S0140-6736(13)60986-1",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 601,
    population: "Spontaneous lobar ICH 10-100 mL within 1 cm of cortical surface, within 48 hours, without IVH",
    intervention: "Early surgery within 12 hours of randomization",
    comparator: "Initial conservative management",
    primaryOutcome: {
      measure: "Unfavorable outcome (prognosis-based mRS) at 6 months",
      result: "59% vs 62%",
      ci: "OR 0.86 (0.62-1.20)",
      pValue: "p=0.367"
    },
    keySecondary: [
      "21% crossover rate from conservative to surgical arm",
      "Mortality 18% (surgical) vs 24% (conservative), not statistically significant"
    ],
    significance: "Even in the favorable subgroup identified by STICH I (superficial lobar ICH), early craniotomy did not significantly improve outcomes. Contributed to the conclusion that conventional open surgery is not beneficial for ICH and spurred interest in minimally invasive approaches.",
    category: "ich",
    subcategory: "surgical",
    tags: ["ICH", "craniotomy", "surgery", "lobar ICH", "negative trial"],
    blinding: "open-label",
    fundingSource: "UK Medical Research Council",
    phase: "Phase 3"
  },
  {
    name: "TICH-2",
    fullTitle: "Tranexamic Acid for Hyperacute Primary Intracerebral Haemorrhage",
    year: 2018,
    journal: "The Lancet",
    pmid: "29778325",
    doi: "10.1016/S0140-6736(18)31033-X",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 2325,
    population: "Spontaneous intracerebral hemorrhage within 8 hours of symptom onset",
    intervention: "IV tranexamic acid (1 g bolus then 1 g over 8 hours)",
    comparator: "Matching placebo",
    primaryOutcome: {
      measure: "Functional status (mRS distribution) at day 90",
      result: "Adjusted OR 0.88",
      ci: "0.76-1.03",
      pValue: "p=0.11"
    },
    keySecondary: [
      "Significantly less hematoma expansion at 24 hours (adjusted difference -1.37 mL, p=0.03)",
      "No increase in thromboembolic events with tranexamic acid"
    ],
    significance: "Tranexamic acid reduced hematoma expansion but did not translate into improved functional outcomes at 90 days. Highlighted that reducing early hematoma growth alone may be insufficient to improve clinical outcomes in ICH.",
    category: "ich",
    subcategory: "hemostatic",
    tags: ["ICH", "tranexamic acid", "antifibrinolytic", "hematoma expansion", "negative trial"],
    blinding: "double-blind",
    fundingSource: "NIHR (UK)",
    phase: "Phase 3"
  },
  {
    name: "PATCH",
    fullTitle: "Platelet Transfusion versus Standard Care after Acute Stroke due to Spontaneous Cerebral Haemorrhage Associated with Antiplatelet Therapy",
    year: 2016,
    journal: "The Lancet",
    pmid: "27178479",
    doi: "10.1016/S0140-6736(16)30392-0",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 190,
    population: "Spontaneous supratentorial ICH using antiplatelet therapy (aspirin, clopidogrel, or both) for at least 7 days, within 6 hours of symptom onset",
    intervention: "Platelet transfusion within 6 hours of symptom onset plus standard care",
    comparator: "Standard care alone",
    primaryOutcome: {
      measure: "mRS distribution (ordinal shift) at 3 months",
      result: "Adjusted OR 2.05 (favoring standard care)",
      ci: "1.18-3.56",
      pValue: "p=0.01 (platelet transfusion inferior)"
    },
    keySecondary: [
      "More serious adverse events with platelet transfusion (42% vs 29%)",
      "Mortality higher with platelet transfusion (24% vs 17%, not significant)"
    ],
    significance: "Platelet transfusion was harmful in antiplatelet-associated ICH, worsening functional outcomes. This practice-changing result reversed the common clinical practice of transfusing platelets to reverse antiplatelet effects in ICH.",
    category: "ich",
    subcategory: "hemostatic",
    tags: ["ICH", "platelet transfusion", "antiplatelet", "harmful", "practice-changing"],
    blinding: "open-label",
    fundingSource: "Netherlands Organisation for Health Research",
    phase: "Phase 3"
  },
  {
    name: "iDEF",
    fullTitle: "Deferoxamine Mesylate in Patients with Intracerebral Haemorrhage (iDEF)",
    year: 2019,
    journal: "The Lancet Neurology",
    pmid: "30898550",
    doi: "10.1016/S1474-4422(19)30069-9",
    design: "Phase 2 RCT, double-blind, placebo-controlled",
    n: 294,
    population: "Spontaneous ICH (supratentorial, >=10 mL) within 24 hours of symptom onset",
    intervention: "IV deferoxamine mesylate 32 mg/kg/day for 3 consecutive days",
    comparator: "Matching placebo (saline) for 3 days",
    primaryOutcome: {
      measure: "Good outcome (mRS 0-2) at 90 days",
      result: "34% vs 33%",
      ci: "OR 1.06 (0.65-1.75)",
      pValue: "p=0.80"
    },
    keySecondary: [
      "Deferoxamine was well-tolerated with no significant safety concerns",
      "No difference in perihematomal edema or hematoma expansion"
    ],
    significance: "Iron chelation with deferoxamine did not improve outcomes after ICH despite strong preclinical evidence of iron-mediated secondary injury. The trial was underpowered for the observed effect size and did not confirm the promising phase 1 Hi-DEF results.",
    category: "ich",
    subcategory: "neuroprotection",
    tags: ["ICH", "deferoxamine", "iron chelation", "neuroprotection", "negative trial"],
    blinding: "double-blind",
    fundingSource: "NIH/NINDS",
    phase: "Phase 2"
  },
  {
    name: "FAST",
    fullTitle: "Recombinant Activated Factor VII for Acute Intracerebral Hemorrhage",
    year: 2008,
    journal: "New England Journal of Medicine",
    pmid: "18480205",
    doi: "10.1056/NEJMoa0707534",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 841,
    population: "Spontaneous ICH within 4 hours of onset, confirmed on CT",
    intervention: "Recombinant activated factor VII (rFVIIa) 20 mcg/kg or 80 mcg/kg IV single dose",
    comparator: "Placebo",
    primaryOutcome: {
      measure: "mRS 5-6 (severe disability or death) at 90 days",
      result: "24% (80 mcg/kg) vs 26% (placebo)",
      ci: "Adjusted difference not significant",
      pValue: "p=0.17"
    },
    keySecondary: [
      "80 mcg/kg dose reduced hematoma growth by 2.6 mL (p=0.009)",
      "Increased arterial thromboembolic events with rFVIIa (9% vs 4%, p=0.04)"
    ],
    significance: "rFVIIa reduced hematoma expansion in acute ICH but did not improve clinical outcomes and increased thromboembolic events. Following a promising phase 2b trial, this phase 3 failure illustrated the gap between reducing hematoma growth and improving functional outcomes.",
    category: "ich",
    subcategory: "hemostatic",
    tags: ["ICH", "factor VIIa", "rFVIIa", "hemostatic", "hematoma expansion", "negative trial"],
    blinding: "double-blind",
    fundingSource: "Industry (Novo Nordisk)",
    phase: "Phase 3"
  },
  {
    name: "CLEAR III",
    fullTitle: "Clot Lysis: Evaluating Accelerated Resolution of Intraventricular Hemorrhage Phase III",
    year: 2017,
    journal: "The Lancet",
    pmid: "28081952",
    doi: "10.1016/S0140-6736(16)32410-2",
    design: "Phase 3 RCT, double-blind",
    n: 500,
    population: "Spontaneous ICH with intraventricular hemorrhage (IVH) obstructing the 3rd or 4th ventricle, with external ventricular drain (EVD) in situ",
    intervention: "Intraventricular alteplase 1 mg every 8 hours via EVD (up to 12 doses)",
    comparator: "Intraventricular saline via EVD",
    primaryOutcome: {
      measure: "Good functional outcome (mRS 0-3) at 180 days",
      result: "48% vs 45%",
      ci: "Risk difference 3.5% (-5.5 to 12.5)",
      pValue: "p=0.48"
    },
    keySecondary: [
      "Significant reduction in case fatality (18% vs 29%, p=0.006)",
      "Faster IVH clot resolution and lower drain obstruction rate with alteplase"
    ],
    significance: "Intraventricular alteplase reduced mortality in IVH but did not improve functional outcomes. More survivors in the treatment group had severe disability, raising important questions about the balance between survival and functional independence.",
    category: "ich",
    subcategory: "intraventricular hemorrhage",
    tags: ["ICH", "IVH", "intraventricular", "alteplase", "EVD", "mortality benefit"],
    blinding: "double-blind",
    fundingSource: "NIH/NINDS",
    phase: "Phase 3"
  },

  // ==========================================
  // SUBARACHNOID HEMORRHAGE TRIALS
  // ==========================================
  {
    name: "CONSCIOUS-1",
    fullTitle: "Clazosentan to Overcome Neurological Ischemia and Infarction Occurring After Subarachnoid Hemorrhage 1",
    year: 2008,
    journal: "Stroke",
    pmid: "18688013",
    doi: "10.1161/STROKEAHA.108.519942",
    design: "Phase 2 RCT, double-blind, placebo-controlled, dose-finding",
    n: 413,
    population: "Aneurysmal SAH (WFNS grades I-IV) within 56 hours of aneurysm securing (clipping or coiling)",
    intervention: "Clazosentan (endothelin receptor antagonist) 1, 5, or 15 mg/h IV for up to 14 days",
    comparator: "Placebo",
    primaryOutcome: {
      measure: "Moderate or severe angiographic vasospasm within 14 days (blinded central review)",
      result: "23% (15 mg/h) vs 66% (placebo)",
      ci: "Relative risk reduction 65%",
      pValue: "p<0.0001 for 15 mg/h dose"
    },
    keySecondary: [
      "Dose-dependent reduction in vasospasm across all three clazosentan doses",
      "No significant improvement in clinical outcomes (morbidity/mortality related to vasospasm)"
    ],
    significance: "Clazosentan powerfully reduced angiographic vasospasm after SAH but did not improve clinical outcomes. This dissociation between vasospasm reduction and clinical benefit challenged the prevailing assumption that vasospasm is the primary driver of delayed cerebral ischemia.",
    category: "sah",
    subcategory: "vasospasm",
    tags: ["SAH", "clazosentan", "endothelin antagonist", "vasospasm", "DCI"],
    blinding: "double-blind",
    fundingSource: "Industry (Actelion Pharmaceuticals)",
    phase: "Phase 2"
  },
  {
    name: "CONSCIOUS-2",
    fullTitle: "Clazosentan to Overcome Neurological Ischemia and Infarction Occurring After Subarachnoid Hemorrhage 2",
    year: 2011,
    journal: "The Lancet Neurology",
    pmid: "21640651",
    doi: "10.1016/S1474-4422(11)70108-9",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 577,
    population: "Aneurysmal SAH treated with surgical clipping, WFNS grades I-IV, within 56 hours of clipping",
    intervention: "Clazosentan 5 mg/h IV for up to 14 days",
    comparator: "Placebo",
    primaryOutcome: {
      measure: "Composite of all-cause mortality, vasospasm-related new cerebral infarction, delayed ischemic neurological deficit due to vasospasm, or rescue therapy for vasospasm within 6 weeks",
      result: "21% vs 25%",
      ci: "RR 0.82 (0.59-1.15)",
      pValue: "p=0.25"
    },
    keySecondary: [
      "Angiographic vasospasm significantly reduced (clinically confirmed)",
      "No improvement in functional outcome (mRS) at 12 weeks"
    ],
    significance: "Confirmed that clazosentan reduces vasospasm but does not improve a clinically meaningful composite outcome or functional status after SAH. Solidified the concept that vasospasm prevention alone is insufficient to prevent delayed cerebral ischemia.",
    category: "sah",
    subcategory: "vasospasm",
    tags: ["SAH", "clazosentan", "endothelin antagonist", "vasospasm", "negative trial", "clipping"],
    blinding: "double-blind",
    fundingSource: "Industry (Actelion Pharmaceuticals)",
    phase: "Phase 3"
  },
  {
    name: "NEWTON",
    fullTitle: "Nimodipine Microparticles to Enhance Recovery While Reducing Toxicity After Subarachnoid Hemorrhage",
    year: 2016,
    journal: "Stroke",
    pmid: "27932607",
    doi: "10.1161/STROKEAHA.116.014250",
    design: "Phase 1/2a RCT, open-label, dose-escalation",
    n: 52,
    population: "Aneurysmal SAH (WFNS grades II-IV) with secured ruptured aneurysm, within 60 hours of SAH",
    intervention: "EG-1962 (sustained-release nimodipine microparticles) delivered via EVD into the ventricles",
    comparator: "Standard oral nimodipine 60 mg every 4 hours for 21 days",
    primaryOutcome: {
      measure: "Safety and pharmacokinetics of intraventricular sustained-release nimodipine",
      result: "Dose-limiting toxicities observed at higher doses; 800 mg recommended for phase 3",
      ci: "Not applicable",
      pValue: "Not applicable"
    },
    keySecondary: [
      "Favorable pharmacokinetic profile with sustained CSF nimodipine levels",
      "Trend toward reduced delayed cerebral ischemia"
    ],
    significance: "Demonstrated the feasibility of intraventricular sustained-release nimodipine delivery in SAH. Provided pharmacokinetic data supporting this novel drug delivery approach and established the dose for the subsequent NEWTON-2 phase 3 trial.",
    category: "sah",
    subcategory: "nimodipine",
    tags: ["SAH", "nimodipine", "sustained release", "intraventricular", "dose-finding", "EG-1962"],
    blinding: "open-label",
    fundingSource: "Industry (Edge Therapeutics)",
    phase: "Phase 1/2a"
  },
  {
    name: "ISAT",
    fullTitle: "International Subarachnoid Aneurysm Trial",
    year: 2002,
    journal: "The Lancet",
    pmid: "12414200",
    doi: "10.1016/s0140-6736(02)11314-6",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 2143,
    population: "Ruptured intracranial aneurysm amenable to either endovascular coiling or neurosurgical clipping",
    intervention: "Endovascular coiling (detachable platinum coils)",
    comparator: "Neurosurgical clipping",
    primaryOutcome: {
      measure: "Death or dependency (mRS 3-6) at 1 year",
      result: "23.7% vs 30.6%",
      ci: "RR 0.77 (0.66-0.90)",
      pValue: "p=0.0019"
    },
    keySecondary: [
      "Rebleeding rate slightly higher with coiling at long-term follow-up",
      "Survival benefit maintained at 7-year follow-up"
    ],
    significance: "Landmark trial that transformed the management of ruptured intracranial aneurysms by demonstrating superiority of endovascular coiling over clipping for patients suitable for both. Shifted practice worldwide toward endovascular-first treatment.",
    category: "sah",
    subcategory: "aneurysm treatment",
    tags: ["SAH", "aneurysm", "coiling", "clipping", "landmark"],
    blinding: "open-label",
    fundingSource: "UK Medical Research Council",
    phase: "Phase 3",
    landmark: true
  },
  {
    name: "BRAT",
    fullTitle: "Barrow Ruptured Aneurysm Trial",
    year: 2012,
    journal: "Journal of Neurosurgery",
    pmid: "22054213",
    doi: "10.3171/2011.8.JNS101767",
    design: "Phase 3 RCT, open-label",
    n: 471,
    population: "All patients presenting with ruptured intracranial aneurysm (no anatomic exclusion criteria)",
    intervention: "Endovascular coiling as initial treatment",
    comparator: "Microsurgical clipping as initial treatment",
    primaryOutcome: {
      measure: "Poor outcome (mRS >2) at 1 year",
      result: "33.7% vs 36.3%",
      ci: "Not significant",
      pValue: "p=0.54"
    },
    keySecondary: [
      "37.5% of patients assigned to coiling crossed over to clipping",
      "At 6 years, mRS >2 was 23.2% (coil) vs 30.0% (clip) for posterior circulation aneurysms (p=0.29)"
    ],
    significance: "Complemented ISAT by including all ruptured aneurysms regardless of anatomic suitability for coiling. High crossover rate from coiling to clipping highlighted that many aneurysms are not amenable to endovascular treatment. Long-term follow-up showed durable outcomes in both groups.",
    category: "sah",
    subcategory: "aneurysm treatment",
    tags: ["SAH", "aneurysm", "coiling", "clipping", "crossover", "all-comers"],
    blinding: "open-label",
    fundingSource: "Academic (Barrow Neurological Institute)",
    phase: "Phase 3"
  },

  // ==========================================
  // CAROTID SURGERY / STENTING TRIALS
  // ==========================================
  {
    name: "NASCET",
    fullTitle: "North American Symptomatic Carotid Endarterectomy Trial",
    year: 1991,
    journal: "New England Journal of Medicine",
    pmid: "1852179",
    doi: "10.1056/NEJM199108153250701",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 659,
    population: "Symptomatic carotid stenosis 70-99% with ipsilateral TIA or non-disabling stroke within 120 days",
    intervention: "Carotid endarterectomy (CEA) plus best medical management",
    comparator: "Best medical management alone",
    primaryOutcome: {
      measure: "Ipsilateral stroke at 2 years",
      result: "9% vs 26%",
      ci: "ARR 17%, NNT 6",
      pValue: "p<0.001"
    },
    keySecondary: [
      "Perioperative stroke or death rate was 5.8%",
      "Benefit persisted for moderate stenosis (50-69%) with smaller effect size"
    ],
    significance: "Definitive trial establishing carotid endarterectomy as the standard of care for symptomatic high-grade carotid stenosis. One of the most influential surgical trials in the history of stroke prevention, with results that remain the foundation of current guidelines.",
    category: "carotid",
    subcategory: "endarterectomy",
    tags: ["CEA", "endarterectomy", "carotid stenosis", "symptomatic", "landmark"],
    blinding: "open-label",
    fundingSource: "NIH/NINDS",
    phase: "Phase 3",
    landmark: true
  },
  {
    name: "ECST",
    fullTitle: "European Carotid Surgery Trial",
    year: 1991,
    journal: "The Lancet",
    pmid: "1674060",
    doi: "10.1016/0140-6736(91)90369-Z",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 3024,
    population: "Symptomatic carotid stenosis with non-disabling ischemic stroke, TIA, or retinal ischemia within 6 months",
    intervention: "Carotid endarterectomy (CEA) plus medical management",
    comparator: "Medical management alone",
    primaryOutcome: {
      measure: "Major stroke or surgical death at 3 years",
      result: "Significant benefit for severe stenosis (>80% ECST method); no benefit for <30%",
      ci: "ARR ~11% for severe stenosis",
      pValue: "p<0.001 for severe stenosis"
    },
    keySecondary: [
      "Surgery harmful for mild stenosis (<30%)",
      "Results concordant with NASCET when stenosis measurement methods were harmonized"
    ],
    significance: "Confirmed independently that CEA substantially reduces stroke risk in patients with severe symptomatic carotid stenosis. Together with NASCET, established the definitive evidence base for carotid surgery that has guided clinical practice for over three decades.",
    category: "carotid",
    subcategory: "endarterectomy",
    tags: ["CEA", "endarterectomy", "carotid stenosis", "symptomatic", "European"],
    blinding: "open-label",
    fundingSource: "UK Medical Research Council / European funding agencies",
    phase: "Phase 3"
  },
  {
    name: "ACAS",
    fullTitle: "Asymptomatic Carotid Atherosclerosis Study",
    year: 1995,
    journal: "JAMA",
    pmid: "7723155",
    doi: "10.1001/jama.1995.03530100043027",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 1662,
    population: "Asymptomatic carotid stenosis >=60% by duplex ultrasound, age 40-79",
    intervention: "Carotid endarterectomy (CEA) plus aspirin and risk factor management",
    comparator: "Aspirin and risk factor management alone",
    primaryOutcome: {
      measure: "Ipsilateral stroke, any perioperative stroke, or death within 5 years",
      result: "5.1% vs 11.0%",
      ci: "Aggregate risk reduction 53%",
      pValue: "p=0.004"
    },
    keySecondary: [
      "Perioperative stroke/death rate 2.3% (including 1.2% angiography risk)",
      "Benefit not significant in women (although underpowered)"
    ],
    significance: "First trial to demonstrate benefit of CEA for asymptomatic carotid stenosis. Established that prophylactic surgery reduces stroke risk in asymptomatic patients, though the absolute benefit is smaller than for symptomatic disease. Relevance now debated given improved modern medical therapy.",
    category: "carotid",
    subcategory: "endarterectomy",
    tags: ["CEA", "endarterectomy", "carotid stenosis", "asymptomatic", "landmark"],
    blinding: "open-label",
    fundingSource: "NIH/NINDS",
    phase: "Phase 3",
    landmark: true
  },
  {
    name: "ACST",
    fullTitle: "Asymptomatic Carotid Surgery Trial",
    year: 2004,
    journal: "The Lancet",
    pmid: "15135594",
    doi: "10.1016/S0140-6736(04)16625-1",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 3120,
    population: "Asymptomatic carotid stenosis >=60% (no ipsilateral carotid symptoms within 6 months)",
    intervention: "Immediate carotid endarterectomy (CEA) plus medical management",
    comparator: "Deferred CEA (surgery only if symptoms developed) plus medical management",
    primaryOutcome: {
      measure: "Any stroke or perioperative death at 5 years",
      result: "6.4% vs 11.8%",
      ci: "ARR 5.4%",
      pValue: "p<0.0001"
    },
    keySecondary: [
      "Perioperative stroke or death 3.1%",
      "Greatest benefit in patients under 75 years of age"
    ],
    significance: "Confirmed ACAS findings in a larger international trial, demonstrating that CEA reduces long-term stroke risk in asymptomatic carotid stenosis. However, the 5.4% absolute risk reduction over 5 years is now questioned given advances in medical therapy that may reduce the baseline risk to below the perioperative risk of surgery.",
    category: "carotid",
    subcategory: "endarterectomy",
    tags: ["CEA", "endarterectomy", "carotid stenosis", "asymptomatic", "international"],
    blinding: "open-label",
    fundingSource: "UK Medical Research Council / Stroke Association",
    phase: "Phase 3"
  },
  {
    name: "CREST",
    fullTitle: "Carotid Revascularization Endarterectomy versus Stenting Trial",
    year: 2010,
    journal: "New England Journal of Medicine",
    pmid: "20505173",
    doi: "10.1056/NEJMoa0912321",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 2502,
    population: "Symptomatic carotid stenosis >=50% or asymptomatic stenosis >=60%",
    intervention: "Carotid artery stenting (CAS) with embolic protection device",
    comparator: "Carotid endarterectomy (CEA)",
    primaryOutcome: {
      measure: "Composite of periprocedural stroke, MI, or death, plus ipsilateral stroke at 4 years",
      result: "7.2% (CAS) vs 6.8% (CEA)",
      ci: "HR 1.10 (0.83-1.44)",
      pValue: "p=0.51"
    },
    keySecondary: [
      "CAS had higher periprocedural stroke rate (4.1% vs 2.3%, p=0.01)",
      "CEA had higher periprocedural MI rate (2.3% vs 1.1%, p=0.03)"
    ],
    significance: "The definitive comparison of carotid stenting versus endarterectomy showed no overall difference in composite outcomes. However, the trade-off between higher stroke risk with CAS and higher MI risk with CEA was clinically important. Younger patients tended to do better with stenting, older patients with surgery.",
    category: "carotid",
    subcategory: "stenting vs surgery",
    tags: ["CAS", "stenting", "CEA", "endarterectomy", "carotid stenosis", "landmark"],
    blinding: "open-label",
    fundingSource: "NIH/NINDS and Abbott Vascular",
    phase: "Phase 3",
    landmark: true
  },
  {
    name: "ICSS",
    fullTitle: "International Carotid Stenting Study",
    year: 2010,
    journal: "The Lancet",
    pmid: "20189239",
    doi: "10.1016/S0140-6736(10)60239-5",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 1713,
    population: "Symptomatic carotid stenosis >=50% with TIA or ischemic stroke within 12 months",
    intervention: "Carotid artery stenting (CAS)",
    comparator: "Carotid endarterectomy (CEA)",
    primaryOutcome: {
      measure: "Long-term rate of fatal or disabling stroke (intention-to-treat)",
      result: "6.4% (CAS) vs 6.5% (CEA) at median 4.2 years follow-up",
      ci: "HR 1.06 (0.72-1.57)",
      pValue: "p=0.77"
    },
    keySecondary: [
      "120-day stroke, death, or MI rate higher with CAS (8.5% vs 5.2%, p=0.006)",
      "More DWI lesions on MRI after CAS (50% vs 17%)"
    ],
    significance: "Demonstrated similar long-term rates of disabling stroke between CAS and CEA in symptomatic patients. However, early periprocedural risks were higher with stenting, and subclinical new brain lesions on MRI were much more frequent after CAS, raising concerns about cognitive effects.",
    category: "carotid",
    subcategory: "stenting vs surgery",
    tags: ["CAS", "stenting", "CEA", "symptomatic", "DWI lesions", "international"],
    blinding: "open-label",
    fundingSource: "UK Medical Research Council / Stroke Association",
    phase: "Phase 3"
  },
  {
    name: "SPACE",
    fullTitle: "Stent-Protected Angioplasty versus Carotid Endarterectomy in Symptomatic Patients",
    year: 2006,
    journal: "The Lancet",
    pmid: "17027729",
    doi: "10.1016/S0140-6736(06)69122-8",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 1200,
    population: "Symptomatic carotid stenosis >=50% (NASCET criteria) with TIA or moderate stroke within 180 days",
    intervention: "Carotid artery stenting (CAS)",
    comparator: "Carotid endarterectomy (CEA)",
    primaryOutcome: {
      measure: "Ipsilateral stroke or death from randomization to 30 days",
      result: "6.84% (CAS) vs 6.34% (CEA)",
      ci: "Absolute difference 0.51% (-1.89 to 2.91)",
      pValue: "Noninferiority not established (p=0.09)"
    },
    keySecondary: [
      "Only 27% of CAS procedures used embolic protection devices",
      "No significant difference in outcomes at 2-year follow-up"
    ],
    significance: "CAS failed to demonstrate noninferiority to CEA for symptomatic carotid stenosis. The low use of embolic protection devices was a notable limitation. Together with EVA-3S, raised safety concerns about CAS in symptomatic patients.",
    category: "carotid",
    subcategory: "stenting vs surgery",
    tags: ["CAS", "stenting", "CEA", "symptomatic", "noninferiority failed", "German"],
    blinding: "open-label",
    fundingSource: "German Research Foundation (DFG)",
    phase: "Phase 3"
  },
  {
    name: "EVA-3S",
    fullTitle: "Endarterectomy Versus Angioplasty in Patients with Symptomatic Severe Carotid Stenosis",
    year: 2006,
    journal: "New England Journal of Medicine",
    pmid: "17050890",
    doi: "10.1056/NEJMoa062752",
    design: "Phase 3 RCT, open-label",
    n: 527,
    population: "Symptomatic carotid stenosis >=60% with TIA or non-disabling stroke within 120 days",
    intervention: "Carotid artery stenting (CAS)",
    comparator: "Carotid endarterectomy (CEA)",
    primaryOutcome: {
      measure: "Any stroke or death within 30 days of procedure",
      result: "9.6% (CAS) vs 3.9% (CEA)",
      ci: "RR 2.5 (1.2-5.1)",
      pValue: "p=0.01"
    },
    keySecondary: [
      "Trial stopped early by the safety committee due to excess events in CAS group",
      "CAS risk especially high in procedures without embolic protection device"
    ],
    significance: "Demonstrated that CAS was significantly inferior to CEA with nearly 2.5 times the risk of stroke or death within 30 days. Stopped early for safety. Together with SPACE, provided strong evidence that CAS carries higher periprocedural risk than CEA in symptomatic patients.",
    category: "carotid",
    subcategory: "stenting vs surgery",
    tags: ["CAS", "stenting", "CEA", "symptomatic", "safety concern", "stopped early", "French"],
    blinding: "open-label",
    fundingSource: "French Ministry of Health",
    phase: "Phase 3"
  },
  {
    name: "ACT1",
    fullTitle: "Asymptomatic Carotid Trial 1",
    year: 2016,
    journal: "New England Journal of Medicine",
    pmid: "26886419",
    doi: "10.1056/NEJMoa1515706",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 1453,
    population: "Asymptomatic carotid stenosis >=70% on duplex ultrasound, age 79 years or younger, suitable for both CAS and CEA",
    intervention: "Carotid artery stenting (CAS) with embolic protection device",
    comparator: "Carotid endarterectomy (CEA)",
    primaryOutcome: {
      measure: "Composite of death, stroke, or MI within 30 days plus ipsilateral stroke within 5 years",
      result: "3.8% (CAS) vs 3.4% (CEA)",
      ci: "Difference 0.4% (noninferiority margin 3%)",
      pValue: "p=0.01 for noninferiority"
    },
    keySecondary: [
      "Very low event rates in both groups reflecting modern perioperative care",
      "No significant differences in any secondary outcomes"
    ],
    significance: "CAS met noninferiority compared to CEA in asymptomatic carotid stenosis. The very low event rates in both arms raised the question of whether either revascularization strategy adds meaningfully to contemporary medical management alone, motivating the CREST-2 trial.",
    category: "carotid",
    subcategory: "stenting vs surgery",
    tags: ["CAS", "stenting", "CEA", "asymptomatic", "noninferiority"],
    blinding: "open-label",
    fundingSource: "Industry (Abbott Vascular)",
    phase: "Phase 3"
  },
  {
    name: "CREST-2",
    fullTitle: "Carotid Revascularization and Medical Management for Asymptomatic Carotid Stenosis Trial",
    year: 2025,
    journal: "New England Journal of Medicine",
    pmid: "41269206",
    doi: "10.1056/NEJMoa2508800",
    design: "Phase 3 RCT, open-label with blinded outcome assessment, two parallel arms",
    n: 2480,
    population: "Asymptomatic carotid stenosis >=70% on duplex ultrasound with intensive medical management",
    intervention: "CEA or CAS (two parallel randomizations) plus intensive medical management",
    comparator: "Intensive medical management alone",
    primaryOutcome: {
      measure: "Composite of stroke or death within 44 days of randomization or subsequent ipsilateral stroke during follow-up",
      result: "CEA arm: HR 0.82; CAS arm: results pending final publication",
      ci: "Not yet fully reported",
      pValue: "Neither revascularization arm was superior to medical management alone"
    },
    keySecondary: [
      "Very low stroke rates in the medical management alone arm (~1% per year)",
      "Results challenge the role of revascularization for asymptomatic carotid stenosis in the modern era"
    ],
    significance: "A pivotal contemporary trial addressing whether revascularization (CEA or CAS) adds benefit over intensive medical management alone for asymptomatic carotid stenosis. Preliminary results suggest that modern medical therapy may be sufficient for many patients, potentially transforming management of asymptomatic carotid disease.",
    category: "carotid",
    subcategory: "revascularization vs medical",
    tags: ["CEA", "CAS", "stenting", "endarterectomy", "asymptomatic", "medical management", "contemporary"],
    blinding: "open-label",
    fundingSource: "NIH/NINDS",
    phase: "Phase 3"
  }
);
