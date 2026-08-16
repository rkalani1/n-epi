// Neuro-Epi — Trial Database Expansion (Batch 3)
// Antiplatelet, Blood Pressure, Cardiac/AF, PFO Closure, Lipid, and Rehabilitation trials

TrialDatabase.trials.push(
  // ==========================================
  // ANTIPLATELET TRIALS
  // ==========================================
  {
    name: "CAPRIE",
    fullTitle: "A Randomised, Blinded, Trial of Clopidogrel Versus Aspirin in Patients at Risk of Ischaemic Events",
    year: 1996,
    journal: "The Lancet",
    pmid: "8918275",
    doi: "10.1016/S0140-6736(96)09457-3",
    design: "Phase 3 RCT, double-blind, active-controlled",
    n: 19185,
    population: "Patients with recent ischemic stroke, MI, or symptomatic peripheral arterial disease",
    intervention: "Clopidogrel 75 mg daily",
    comparator: "Aspirin 325 mg daily",
    primaryOutcome: {
      measure: "Composite of ischemic stroke, MI, or vascular death",
      result: "5.32% vs 5.83% per year; RRR 8.7%",
      ci: "0.3%-16.5%",
      pValue: "p=0.043"
    },
    keySecondary: [
      "Stroke subgroup: clopidogrel 7.15% vs aspirin 7.71% (not significant individually)",
      "GI bleeding lower with clopidogrel; rash and diarrhea slightly higher"
    ],
    significance: "Established clopidogrel as a modestly superior alternative to aspirin for secondary prevention of vascular events. Became widely used in patients intolerant of aspirin.",
    category: "antiplatelets",
    subcategory: "monotherapy",
    tags: ["clopidogrel", "aspirin", "secondary prevention", "vascular events", "landmark"],
    blinding: "double-blind",
    fundingSource: "Sanofi-Winthrop",
    phase: "Phase 3",
    landmark: true
  },
  {
    name: "MATCH",
    fullTitle: "Management of Atherothrombosis with Clopidogrel in High-Risk Patients with Recent TIA or Ischaemic Stroke",
    year: 2004,
    journal: "The Lancet",
    pmid: "15276392",
    doi: "10.1016/S0140-6736(04)16721-4",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 7599,
    population: "Recent ischemic stroke or TIA with at least one additional vascular risk factor, already on clopidogrel",
    intervention: "Aspirin 75 mg daily added to clopidogrel 75 mg daily",
    comparator: "Placebo added to clopidogrel 75 mg daily",
    primaryOutcome: {
      measure: "Composite of ischemic stroke, MI, vascular death, or reinpatient stay for acute ischemia at 18 months",
      result: "15.7% vs 16.7%; ARR 1.0%",
      ci: "RRR 6.4%, 95% CI -4.6% to 16.3%",
      pValue: "p=0.244"
    },
    keySecondary: [
      "Life-threatening bleeding significantly increased: 2.6% vs 1.3% (p<0.001)",
      "Major bleeding increased: 1.9% vs 0.6%"
    ],
    significance: "Adding aspirin to clopidogrel in high-risk stroke/TIA patients did not reduce major vascular events but significantly increased life-threatening bleeding. Argued against long-term dual antiplatelet therapy.",
    category: "antiplatelets",
    subcategory: "dual-antiplatelet",
    tags: ["clopidogrel", "aspirin", "dual antiplatelet", "bleeding risk", "negative trial"],
    blinding: "double-blind",
    fundingSource: "Sanofi-Aventis",
    phase: "Phase 3"
  },
  {
    name: "CHARISMA",
    fullTitle: "Clopidogrel for High Atherothrombotic Risk and Ischemic Stabilization, Management, and Avoidance",
    year: 2006,
    journal: "New England Journal of Medicine",
    pmid: "16531616",
    doi: "10.1056/NEJMoa060989",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 15603,
    population: "Patients with established cardiovascular disease or multiple risk factors",
    intervention: "Clopidogrel 75 mg plus aspirin 75-162 mg daily",
    comparator: "Placebo plus aspirin 75-162 mg daily",
    primaryOutcome: {
      measure: "Composite of MI, stroke, or cardiovascular death",
      result: "6.8% vs 7.3%; RR 0.93",
      ci: "0.83-1.05",
      pValue: "p=0.22"
    },
    keySecondary: [
      "Symptomatic patients subgroup: 6.9% vs 7.9% (p=0.046)",
      "Asymptomatic subgroup: trend toward harm with dual therapy",
      "Moderate bleeding increased: 2.1% vs 1.3% (p<0.001)"
    ],
    significance: "Dual antiplatelet therapy with clopidogrel plus aspirin did not significantly reduce major cardiovascular events overall. Suggested benefit only in the subgroup with established atherosclerotic disease.",
    category: "antiplatelets",
    subcategory: "dual-antiplatelet",
    tags: ["clopidogrel", "aspirin", "dual antiplatelet", "primary prevention", "negative trial"],
    blinding: "double-blind",
    fundingSource: "Sanofi-Aventis and Bristol-Myers Squibb",
    phase: "Phase 3"
  },
  {
    name: "PRoFESS",
    fullTitle: "Prevention Regimen for Effectively Avoiding Second Strokes",
    year: 2008,
    journal: "New England Journal of Medicine",
    pmid: "18753638",
    doi: "10.1056/NEJMoa0802131",
    design: "Phase 3 RCT, double-blind, double-dummy, 2x2 factorial",
    n: 20332,
    population: "Recent ischemic stroke (within 120 days)",
    intervention: "Aspirin 25 mg + extended-release dipyridamole 200 mg twice daily",
    comparator: "Clopidogrel 75 mg daily",
    primaryOutcome: {
      measure: "Recurrent stroke",
      result: "9.0% vs 8.8%; HR 1.01",
      ci: "0.92-1.11",
      pValue: "p=0.84"
    },
    keySecondary: [
      "Net risk of recurrent stroke, MI, vascular death, or major hemorrhage: similar between groups",
      "More headache and GI side effects with ASA-dipyridamole; higher discontinuation rate"
    ],
    significance: "Demonstrated equivalence between aspirin-dipyridamole and clopidogrel for secondary stroke prevention. Neither regimen was superior, providing clinicians with two equally effective options.",
    category: "antiplatelets",
    subcategory: "comparison",
    tags: ["aspirin", "dipyridamole", "clopidogrel", "secondary prevention", "noninferiority"],
    blinding: "double-blind",
    fundingSource: "Boehringer Ingelheim",
    phase: "Phase 3"
  },
  {
    name: "SPS3 Antiplatelet",
    fullTitle: "Secondary Prevention of Small Subcortical Strokes — Antiplatelet Arm",
    year: 2012,
    journal: "New England Journal of Medicine",
    pmid: "22931315",
    doi: "10.1056/NEJMoa1204133",
    design: "Phase 3 RCT, double-blind, placebo-controlled, 2x2 factorial",
    n: 3020,
    population: "Recent symptomatic lacunar stroke confirmed by MRI",
    intervention: "Clopidogrel 75 mg plus aspirin 325 mg daily",
    comparator: "Aspirin 325 mg daily plus placebo",
    primaryOutcome: {
      measure: "Recurrent stroke (all types)",
      result: "2.5% vs 2.7% per year; HR 0.92",
      ci: "0.72-1.16",
      pValue: "p=0.48"
    },
    keySecondary: [
      "Major hemorrhage increased with DAPT: 2.1% vs 1.1% per year (HR 1.97, p=0.004)",
      "All-cause mortality higher with DAPT: 2.1% vs 1.4% per year (HR 1.52, p=0.03)"
    ],
    significance: "Dual antiplatelet therapy did not reduce recurrent stroke in lacunar stroke but increased bleeding and mortality. Established that DAPT is harmful for long-term secondary prevention in small vessel disease.",
    category: "antiplatelets",
    subcategory: "dual-antiplatelet",
    tags: ["clopidogrel", "aspirin", "lacunar stroke", "small vessel disease", "negative trial"],
    blinding: "double-blind",
    fundingSource: "NIH/NINDS",
    phase: "Phase 3"
  },
  {
    name: "CHANCE",
    fullTitle: "Clopidogrel in High-Risk Patients with Acute Nondisabling Cerebrovascular Events",
    year: 2013,
    journal: "New England Journal of Medicine",
    pmid: "23803136",
    doi: "10.1056/NEJMoa1215340",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 5170,
    population: "Minor ischemic stroke (NIHSS <=3) or high-risk TIA (ABCD2 >=4) within 24 hours, in China",
    intervention: "Clopidogrel 300 mg loading then 75 mg daily plus aspirin for 21 days, then clopidogrel alone to 90 days",
    comparator: "Aspirin 75-300 mg daily for 90 days plus placebo",
    primaryOutcome: {
      measure: "Recurrent stroke (ischemic or hemorrhagic) at 90 days",
      result: "8.2% vs 11.7%; HR 0.68",
      ci: "0.57-0.81",
      pValue: "p<0.001"
    },
    keySecondary: [
      "No significant increase in major or moderate bleeding (0.3% vs 0.3%)",
      "Benefit greatest in first week after randomization"
    ],
    significance: "Landmark trial demonstrating that short-term dual antiplatelet therapy (21 days) reduces recurrent stroke after minor stroke or TIA without increasing bleeding. Changed practice worldwide for early DAPT.",
    category: "antiplatelets",
    subcategory: "dual-antiplatelet",
    tags: ["clopidogrel", "aspirin", "minor stroke", "TIA", "dual antiplatelet", "short-term DAPT", "landmark"],
    blinding: "double-blind",
    fundingSource: "Chinese Ministry of Science and Technology",
    phase: "Phase 3",
    landmark: true
  },
  {
    name: "POINT",
    fullTitle: "Platelet-Oriented Inhibition in New TIA and Minor Ischemic Stroke",
    year: 2018,
    journal: "New England Journal of Medicine",
    pmid: "29766750",
    doi: "10.1056/NEJMoa1800410",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 4881,
    population: "Minor ischemic stroke (NIHSS <=3) or high-risk TIA (ABCD2 >=4) within 12 hours",
    intervention: "Clopidogrel 600 mg loading then 75 mg daily plus aspirin for 90 days",
    comparator: "Placebo plus aspirin for 90 days",
    primaryOutcome: {
      measure: "Composite of ischemic stroke, MI, or ischemic vascular death at 90 days",
      result: "5.0% vs 6.5%; HR 0.75",
      ci: "0.59-0.95",
      pValue: "p=0.02"
    },
    keySecondary: [
      "Major hemorrhage increased: 0.9% vs 0.4% (HR 2.32, p=0.02)",
      "Benefit concentrated in first 7 days; harm from bleeding accumulated over 90 days"
    ],
    significance: "Confirmed CHANCE findings in a multinational population. Together with CHANCE, established 21-day DAPT as standard of care after minor stroke/TIA. Led to pooled analysis supporting short-duration DAPT.",
    category: "antiplatelets",
    subcategory: "dual-antiplatelet",
    tags: ["clopidogrel", "aspirin", "minor stroke", "TIA", "dual antiplatelet"],
    blinding: "double-blind",
    fundingSource: "NIH/NINDS",
    phase: "Phase 3"
  },
  {
    name: "THALES",
    fullTitle: "Acute Stroke or Transient Ischaemic Attack Treated with Ticagrelor and Aspirin for Prevention of Stroke and Death",
    year: 2020,
    journal: "New England Journal of Medicine",
    pmid: "32668111",
    doi: "10.1056/NEJMoa1916870",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 11016,
    population: "Mild-to-moderate acute non-cardioembolic ischemic stroke (NIHSS <=5) or high-risk TIA within 24 hours",
    intervention: "Ticagrelor 180 mg loading then 90 mg twice daily plus aspirin for 30 days",
    comparator: "Placebo plus aspirin for 30 days",
    primaryOutcome: {
      measure: "Composite of stroke or death within 30 days",
      result: "5.5% vs 6.6%; HR 0.83",
      ci: "0.71-0.96",
      pValue: "p=0.02"
    },
    keySecondary: [
      "Severe bleeding increased: 0.5% vs 0.1% (p=0.001)",
      "Intracranial hemorrhage: 0.4% vs 0.1%",
      "Ischemic stroke alone: 5.0% vs 6.3% (HR 0.79)"
    ],
    significance: "Demonstrated that ticagrelor plus aspirin reduces stroke recurrence compared to aspirin alone within 30 days of minor stroke/TIA. Provides an alternative to clopidogrel-based DAPT, particularly for CYP2C19 loss-of-function carriers.",
    category: "antiplatelets",
    subcategory: "dual-antiplatelet",
    tags: ["ticagrelor", "aspirin", "minor stroke", "TIA", "dual antiplatelet"],
    blinding: "double-blind",
    fundingSource: "AstraZeneca",
    phase: "Phase 3"
  },
  {
    name: "SOCRATES",
    fullTitle: "Acute Stroke or Transient Ischaemic Attack Treated with Aspirin or Ticagrelor and Patient Outcomes",
    year: 2016,
    journal: "New England Journal of Medicine",
    pmid: "27160892",
    doi: "10.1056/NEJMoa1603060",
    design: "Phase 3 RCT, double-blind, double-dummy",
    n: 13199,
    population: "Non-cardioembolic acute ischemic stroke (NIHSS <=5) or high-risk TIA within 24 hours",
    intervention: "Ticagrelor 180 mg loading then 90 mg twice daily for 90 days",
    comparator: "Aspirin 300 mg loading then 100 mg daily for 90 days",
    primaryOutcome: {
      measure: "Composite of stroke, MI, or death at 90 days",
      result: "6.7% vs 7.5%; HR 0.89",
      ci: "0.78-1.01",
      pValue: "p=0.07"
    },
    keySecondary: [
      "Ischemic stroke alone: 5.8% vs 6.7% (HR 0.87, p=0.046 — not significant after hierarchical testing)",
      "Major bleeding comparable between groups",
      "Dyspnea more common with ticagrelor (6.3% vs 1.4%)"
    ],
    significance: "Ticagrelor monotherapy did not significantly reduce stroke, MI, or death compared to aspirin in minor stroke/TIA. Borderline results led to the THALES trial of ticagrelor plus aspirin.",
    category: "antiplatelets",
    subcategory: "monotherapy",
    tags: ["ticagrelor", "aspirin", "minor stroke", "TIA", "negative trial"],
    blinding: "double-blind",
    fundingSource: "AstraZeneca",
    phase: "Phase 3"
  },
  {
    name: "ESPS-2",
    fullTitle: "European Stroke Prevention Study 2",
    year: 1996,
    journal: "Journal of the Neurological Sciences",
    pmid: "8981292",
    doi: "10.1016/S0022-510X(96)00308-5",
    design: "Phase 3 RCT, double-blind, placebo-controlled, factorial",
    n: 6602,
    population: "Prior ischemic stroke or TIA within 3 months",
    intervention: "Aspirin 25 mg twice daily plus extended-release dipyridamole 200 mg twice daily (and factorial arms of each alone)",
    comparator: "Placebo",
    primaryOutcome: {
      measure: "Recurrent stroke",
      result: "Combination reduced stroke risk by 37% vs placebo; aspirin alone 18%; dipyridamole alone 16%",
      ci: "Combination vs placebo RRR 37% (95% CI 24.7%-47.1%)",
      pValue: "p<0.001"
    },
    keySecondary: [
      "Combination superior to aspirin alone: RRR 23% (p=0.006)",
      "Combination superior to dipyridamole alone: RRR 25% (p=0.002)",
      "Headache leading to discontinuation common with dipyridamole"
    ],
    significance: "Demonstrated that the combination of aspirin and dipyridamole is superior to either agent alone for secondary stroke prevention. Led to development of fixed-dose combination (Aggrenox).",
    category: "antiplatelets",
    subcategory: "combination",
    tags: ["aspirin", "dipyridamole", "secondary prevention", "factorial"],
    blinding: "double-blind",
    fundingSource: "Boehringer Ingelheim",
    phase: "Phase 3"
  },
  {
    name: "ESPRIT",
    fullTitle: "European/Australasian Stroke Prevention in Reversible Ischaemia Trial",
    year: 2006,
    journal: "The Lancet",
    pmid: "16714187",
    doi: "10.1016/S0140-6736(06)68734-5",
    design: "Phase 3 RCT, open-label with blinded outcome assessment",
    n: 2739,
    population: "TIA or minor stroke of presumed arterial origin within 6 months",
    intervention: "Aspirin 30-325 mg plus dipyridamole 200 mg twice daily",
    comparator: "Aspirin 30-325 mg daily alone",
    primaryOutcome: {
      measure: "Composite of vascular death, non-fatal stroke, non-fatal MI, or major bleeding",
      result: "13% vs 16%; HR 0.80",
      ci: "0.66-0.98",
      pValue: "p=0.03"
    },
    keySecondary: [
      "Stroke, MI, or vascular death (without bleeding): HR 0.78 (0.63-0.97)",
      "Headache led to discontinuation in 8% on combination vs 1.5% aspirin alone"
    ],
    significance: "Confirmed ESPS-2 findings that aspirin plus dipyridamole is superior to aspirin alone for secondary prevention after TIA or minor stroke. Reinforced combination therapy as a first-line option.",
    category: "antiplatelets",
    subcategory: "combination",
    tags: ["aspirin", "dipyridamole", "secondary prevention", "open-label"],
    blinding: "open-label with blinded outcome assessment",
    fundingSource: "Netherlands Heart Foundation and others",
    phase: "Phase 3"
  },

  // ==========================================
  // BLOOD PRESSURE TRIALS
  // ==========================================
  {
    name: "PROGRESS",
    fullTitle: "Perindopril Protection Against Recurrent Stroke Study",
    year: 2001,
    journal: "The Lancet",
    pmid: "11589932",
    doi: "10.1016/S0140-6736(01)06178-5",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 6105,
    population: "History of stroke or TIA within 5 years, hypertensive and non-hypertensive",
    intervention: "Perindopril 4 mg daily (± indapamide 2.5 mg at investigator discretion)",
    comparator: "Placebo (± placebo indapamide)",
    primaryOutcome: {
      measure: "Recurrent stroke (fatal or non-fatal)",
      result: "10% vs 14%; RRR 28%",
      ci: "17%-38%",
      pValue: "p<0.0001"
    },
    keySecondary: [
      "Combination therapy (perindopril + indapamide) reduced stroke by 43%",
      "Single-drug therapy (perindopril alone) had non-significant 5% reduction",
      "BP reduction: 9/4 mmHg overall; 12/5 mmHg in combination group",
      "Reduced both ischemic and hemorrhagic stroke"
    ],
    significance: "Landmark trial establishing blood pressure lowering for secondary stroke prevention regardless of baseline BP. Demonstrated that combination ACE inhibitor plus diuretic is superior to monotherapy. Changed global guidelines.",
    category: "blood-pressure",
    subcategory: "secondary-prevention",
    tags: ["perindopril", "indapamide", "blood pressure", "ACE inhibitor", "secondary prevention", "landmark"],
    blinding: "double-blind",
    fundingSource: "Servier",
    phase: "Phase 3",
    landmark: true
  },
  {
    name: "SPS3 Blood Pressure",
    fullTitle: "Secondary Prevention of Small Subcortical Strokes — Blood Pressure Arm",
    year: 2013,
    journal: "The Lancet",
    pmid: "23726159",
    doi: "10.1016/S0140-6736(13)60852-1",
    design: "Phase 3 RCT, open-label, 2x2 factorial",
    n: 3020,
    population: "Recent symptomatic lacunar stroke confirmed by MRI",
    intervention: "Intensive BP target (systolic <130 mmHg)",
    comparator: "Standard BP target (systolic 130-149 mmHg)",
    primaryOutcome: {
      measure: "Recurrent stroke (all types)",
      result: "2.25% vs 2.77% per year; HR 0.81",
      ci: "0.64-1.03",
      pValue: "p=0.08"
    },
    keySecondary: [
      "Achieved BP: 127 mmHg vs 138 mmHg",
      "Intracerebral hemorrhage reduced: HR 0.37 (0.15-0.95, p=0.03)",
      "Disabling or fatal stroke: HR 0.81 (0.53-1.23)"
    ],
    significance: "Intensive BP lowering showed a non-significant trend toward reduced stroke recurrence in lacunar stroke, with significant reduction in ICH. Supported lower BP targets, though primary endpoint was not met.",
    category: "blood-pressure",
    subcategory: "intensive-lowering",
    tags: ["blood pressure", "intensive treatment", "lacunar stroke", "small vessel disease"],
    blinding: "open-label",
    fundingSource: "NIH/NINDS",
    phase: "Phase 3"
  },
  {
    name: "RESPECT (BP)",
    fullTitle: "Recurrent Stroke Prevention Clinical Outcome Study",
    year: 2019,
    journal: "JAMA Neurology",
    pmid: "31355878",
    doi: "10.1001/jamaneurol.2019.2167",
    design: "Phase 4 RCT, open-label, PROBE design",
    n: 1149,
    population: "History of ischemic stroke with hypertension, in Japan",
    intervention: "Intensive BP lowering (target <120/80 mmHg)",
    comparator: "Standard BP lowering (target 120-140/<90 mmHg)",
    primaryOutcome: {
      measure: "Composite of stroke, vascular events, and death",
      result: "HR 0.73",
      ci: "0.49-1.11",
      pValue: "p=0.14"
    },
    keySecondary: [
      "Recurrent stroke: HR 0.67 (0.38-1.18)",
      "Achieved BP: 126/73 vs 133/78 mmHg",
      "No excess serious adverse events with intensive treatment"
    ],
    significance: "Did not demonstrate significant benefit of intensive BP lowering for recurrent stroke prevention, though a favorable trend was observed. Contributed to the evidence base for BP targets after stroke.",
    category: "blood-pressure",
    subcategory: "intensive-lowering",
    tags: ["blood pressure", "intensive treatment", "secondary prevention", "Japanese"],
    blinding: "open-label",
    fundingSource: "Japan Agency for Medical Research and Development",
    phase: "Phase 4"
  },
  {
    name: "ENOS",
    fullTitle: "Efficacy of Nitric Oxide, with or without Continuing Antihypertensive Treatment, for Management of High Blood Pressure in Acute Stroke",
    year: 2015,
    journal: "The Lancet",
    pmid: "25465108",
    doi: "10.1016/S0140-6736(14)61121-1",
    design: "Phase 3 RCT, partial-factorial, single-blind",
    n: 4011,
    population: "Acute stroke (ischemic or hemorrhagic) with systolic BP 140-220 mmHg within 48 hours",
    intervention: "Transdermal glyceryl trinitrate (GTN) 5 mg patch for 7 days",
    comparator: "No GTN patch (sham or nothing)",
    primaryOutcome: {
      measure: "mRS distribution at 90 days (ordinal shift)",
      result: "OR 1.01",
      ci: "0.91-1.13",
      pValue: "p=0.83"
    },
    keySecondary: [
      "BP reduction: 7/3.5 mmHg with GTN vs control",
      "No significant interaction with stroke type (ischemic vs hemorrhagic)",
      "Continue vs stop prior antihypertensives: no significant difference (mRS shift OR 1.05, p=0.45)"
    ],
    significance: "GTN in the acute stroke setting did not improve functional outcomes despite lowering blood pressure. The factorial arm also showed no benefit from continuing or stopping prior antihypertensives.",
    category: "blood-pressure",
    subcategory: "acute-treatment",
    tags: ["glyceryl trinitrate", "acute stroke", "blood pressure", "negative trial"],
    blinding: "single-blind",
    fundingSource: "UK Medical Research Council",
    phase: "Phase 3"
  },
  {
    name: "RIGHT-2",
    fullTitle: "Rapid Intervention with Glyceryl Trinitrate in Hypertensive Stroke Trial-2",
    year: 2019,
    journal: "The Lancet",
    pmid: "30738649",
    doi: "10.1016/S0140-6736(19)30194-1",
    design: "Phase 3 RCT, sham-controlled, single-blind (paramedic-delivered)",
    n: 1149,
    population: "Suspected acute stroke (pre-facility) with systolic BP >=120 mmHg within 4 hours of onset",
    intervention: "Transdermal GTN 5 mg patch applied by paramedic in the field",
    comparator: "Sham patch",
    primaryOutcome: {
      measure: "mRS distribution at 90 days (ordinal shift)",
      result: "Adjusted OR 1.04",
      ci: "0.84-1.29",
      pValue: "p=0.69"
    },
    keySecondary: [
      "Systolic BP reduced by 5.8 mmHg more in GTN group",
      "No benefit in any pre-specified subgroup including intracerebral hemorrhage",
      "12.1% of randomized patients did not have stroke (stroke mimic)"
    ],
    significance: "Ultra-early pre-facility GTN did not improve outcomes in acute stroke. Together with ENOS, this closed the door on GTN as a hyper-acute stroke treatment.",
    category: "blood-pressure",
    subcategory: "acute-treatment",
    tags: ["glyceryl trinitrate", "pre-facility", "ultra-acute", "blood pressure", "negative trial"],
    blinding: "single-blind",
    fundingSource: "British Heart Foundation",
    phase: "Phase 3"
  },
  {
    name: "SCAST",
    fullTitle: "Scandinavian Candesartan Acute Stroke Trial",
    year: 2011,
    journal: "The Lancet",
    pmid: "21316752",
    doi: "10.1016/S0140-6736(11)60104-9",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 2029,
    population: "Acute stroke (ischemic or hemorrhagic) with systolic BP >=140 mmHg within 30 hours",
    intervention: "Candesartan 4 mg escalating to 16 mg daily for 7 days",
    comparator: "Placebo for 7 days",
    primaryOutcome: {
      measure: "Composite of vascular death, MI, or stroke during 6-month follow-up",
      result: "Adjusted OR 1.09",
      ci: "0.84-1.41",
      pValue: "p=0.52"
    },
    keySecondary: [
      "Functional outcome (mRS ordinal shift at 6 months): OR 1.17 (1.00-1.38, p=0.048) — trend favoring placebo",
      "BP reduction: 5/2 mmHg greater with candesartan",
      "Progressive stroke events similar between groups"
    ],
    significance: "BP lowering with candesartan in acute stroke did not improve outcomes and showed a non-significant trend toward harm. Cautioned against aggressive BP lowering in acute stroke.",
    category: "blood-pressure",
    subcategory: "acute-treatment",
    tags: ["candesartan", "ARB", "acute stroke", "blood pressure", "negative trial"],
    blinding: "double-blind",
    fundingSource: "Scandinavian research councils and AstraZeneca",
    phase: "Phase 3"
  },

  // ==========================================
  // CARDIAC / AF TRIALS
  // ==========================================
  {
    name: "ROCKET AF",
    fullTitle: "Rivaroxaban Once Daily Oral Direct Factor Xa Inhibition Compared with Vitamin K Antagonism for Prevention of Stroke and Embolism Trial in Atrial Fibrillation",
    year: 2011,
    journal: "New England Journal of Medicine",
    pmid: "21830957",
    doi: "10.1056/NEJMoa1009638",
    design: "Phase 3 RCT, double-blind, double-dummy, noninferiority",
    n: 14264,
    population: "Non-valvular atrial fibrillation with moderate-to-high stroke risk (CHADS2 >=2)",
    intervention: "Rivaroxaban 20 mg daily (15 mg if CrCl 30-49 mL/min)",
    comparator: "Dose-adjusted warfarin (target INR 2.0-3.0)",
    primaryOutcome: {
      measure: "Stroke or systemic embolism",
      result: "1.7% vs 2.2% per year; HR 0.79",
      ci: "0.66-0.96",
      pValue: "p<0.001 for noninferiority; p=0.12 for superiority (ITT)"
    },
    keySecondary: [
      "Major and clinically relevant non-major bleeding similar: 14.9% vs 14.5%",
      "Intracranial hemorrhage reduced: 0.5% vs 0.7% per year (p=0.02)",
      "GI bleeding increased with rivaroxaban: 3.2% vs 2.2%",
      "TTR in warfarin arm was 55% (lower than other DOAC trials)"
    ],
    significance: "Established rivaroxaban as non-inferior to warfarin for stroke prevention in AF. First once-daily DOAC approved for AF. Higher-risk population than other DOAC trials.",
    category: "cardiac",
    subcategory: "atrial-fibrillation",
    tags: ["rivaroxaban", "DOAC", "warfarin", "atrial fibrillation", "noninferiority", "landmark"],
    blinding: "double-blind",
    fundingSource: "Bayer and Johnson & Johnson",
    phase: "Phase 3",
    landmark: true
  },
  {
    name: "RE-LY",
    fullTitle: "Randomized Evaluation of Long-Term Anticoagulation Therapy — Dabigatran vs Warfarin",
    year: 2009,
    journal: "New England Journal of Medicine",
    pmid: "19717844",
    doi: "10.1056/NEJMoa0905561",
    design: "Phase 3 RCT, open-label (warfarin) with blinded dabigatran doses, PROBE design",
    n: 18113,
    population: "Non-valvular atrial fibrillation with at least one stroke risk factor",
    intervention: "Dabigatran 110 mg or 150 mg twice daily",
    comparator: "Dose-adjusted warfarin (target INR 2.0-3.0)",
    primaryOutcome: {
      measure: "Stroke or systemic embolism",
      result: "Dabigatran 150 mg: 1.11% vs warfarin 1.69% per year; RR 0.66. Dabigatran 110 mg: 1.53% vs 1.69%; RR 0.91",
      ci: "150 mg: 0.53-0.82; 110 mg: 0.74-1.11",
      pValue: "150 mg: p<0.001 for superiority; 110 mg: p<0.001 for noninferiority"
    },
    keySecondary: [
      "Major bleeding: 150 mg 3.11% vs warfarin 3.36% (p=0.31); 110 mg 2.71% (p=0.003 vs warfarin)",
      "Intracranial hemorrhage reduced with both doses vs warfarin",
      "Dabigatran 150 mg had higher GI bleeding rate",
      "Dyspepsia more common with dabigatran (~11%)"
    ],
    significance: "First DOAC trial in AF. Dabigatran 150 mg was superior to warfarin for stroke prevention; 110 mg was non-inferior with less bleeding. Launched the era of direct oral anticoagulants.",
    category: "cardiac",
    subcategory: "atrial-fibrillation",
    tags: ["dabigatran", "DOAC", "warfarin", "atrial fibrillation", "superiority", "landmark"],
    blinding: "PROBE (blinded dose comparison, open-label vs warfarin)",
    fundingSource: "Boehringer Ingelheim",
    phase: "Phase 3",
    landmark: true
  },
  {
    name: "ARISTOTLE",
    fullTitle: "Apixaban for Reduction in Stroke and Other Thromboembolic Events in Atrial Fibrillation",
    year: 2011,
    journal: "New England Journal of Medicine",
    pmid: "21870978",
    doi: "10.1056/NEJMoa1107039",
    design: "Phase 3 RCT, double-blind, double-dummy, noninferiority",
    n: 18201,
    population: "Non-valvular atrial fibrillation with at least one stroke risk factor",
    intervention: "Apixaban 5 mg twice daily (2.5 mg if >=2 of: age >=80, weight <=60 kg, creatinine >=1.5 mg/dL)",
    comparator: "Dose-adjusted warfarin (target INR 2.0-3.0)",
    primaryOutcome: {
      measure: "Stroke or systemic embolism",
      result: "1.27% vs 1.60% per year; HR 0.79",
      ci: "0.66-0.95",
      pValue: "p<0.001 for noninferiority; p=0.01 for superiority"
    },
    keySecondary: [
      "Major bleeding reduced: 2.13% vs 3.09% per year (HR 0.69, p<0.001)",
      "All-cause mortality reduced: 3.52% vs 3.94% (HR 0.89, p=0.047)",
      "Intracranial hemorrhage: 0.33% vs 0.80% per year (HR 0.42, p<0.001)"
    ],
    significance: "Apixaban was superior to warfarin for efficacy, safety (less bleeding), and all-cause mortality. Widely considered the strongest DOAC trial result. Became the most prescribed DOAC for AF.",
    category: "cardiac",
    subcategory: "atrial-fibrillation",
    tags: ["apixaban", "DOAC", "warfarin", "atrial fibrillation", "superiority", "mortality benefit", "landmark"],
    blinding: "double-blind",
    fundingSource: "Bristol-Myers Squibb and Pfizer",
    phase: "Phase 3",
    landmark: true
  },
  {
    name: "ENGAGE AF-TIMI 48",
    fullTitle: "Effective Anticoagulation with Factor Xa Next Generation in Atrial Fibrillation — Thrombolysis in Myocardial Infarction 48",
    year: 2013,
    journal: "New England Journal of Medicine",
    pmid: "24251359",
    doi: "10.1056/NEJMoa1310907",
    design: "Phase 3 RCT, double-blind, double-dummy, noninferiority",
    n: 21105,
    population: "Non-valvular atrial fibrillation with CHADS2 >=2",
    intervention: "Edoxaban 60 mg or 30 mg once daily (dose halved for specific criteria)",
    comparator: "Dose-adjusted warfarin (target INR 2.0-3.0)",
    primaryOutcome: {
      measure: "Stroke or systemic embolism",
      result: "High-dose edoxaban 1.18% vs warfarin 1.50% per year; HR 0.79. Low-dose: 1.61%; HR 1.07",
      ci: "High-dose: 0.63-0.99; Low-dose: 0.87-1.31",
      pValue: "Both doses met noninferiority (p<0.001)"
    },
    keySecondary: [
      "Major bleeding: high-dose 2.75% vs warfarin 3.43% (HR 0.80, p<0.001)",
      "Intracranial hemorrhage reduced with both doses",
      "Cardiovascular mortality: high-dose HR 0.86 (p=0.01)",
      "GI bleeding increased with high-dose edoxaban"
    ],
    significance: "Largest DOAC trial. Edoxaban 60 mg was non-inferior to warfarin with significantly less bleeding. Completed the evidence base for the four major DOACs in atrial fibrillation.",
    category: "cardiac",
    subcategory: "atrial-fibrillation",
    tags: ["edoxaban", "DOAC", "warfarin", "atrial fibrillation", "noninferiority"],
    blinding: "double-blind",
    fundingSource: "Daiichi Sankyo",
    phase: "Phase 3"
  },
  {
    name: "ACTIVE-A",
    fullTitle: "Atrial Fibrillation Clopidogrel Trial with Irbesartan for Prevention of Vascular Events — Aspirin Arm",
    year: 2009,
    journal: "New England Journal of Medicine",
    pmid: "19336502",
    doi: "10.1056/NEJMoa0901301",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 7554,
    population: "Atrial fibrillation with at least one stroke risk factor, unsuitable for vitamin K antagonist therapy",
    intervention: "Clopidogrel 75 mg plus aspirin 75-100 mg daily",
    comparator: "Placebo plus aspirin 75-100 mg daily",
    primaryOutcome: {
      measure: "Stroke, MI, non-CNS systemic embolism, or vascular death",
      result: "6.8% vs 7.6% per year; RR 0.89",
      ci: "0.81-0.98",
      pValue: "p=0.01"
    },
    keySecondary: [
      "Stroke alone reduced: 2.4% vs 3.3% per year (RR 0.72, p<0.001)",
      "Major bleeding increased: 2.0% vs 1.3% per year (RR 1.57, p<0.001)",
      "Net clinical benefit favored clopidogrel + aspirin"
    ],
    significance: "In AF patients unsuitable for anticoagulation, adding clopidogrel to aspirin reduced stroke but increased major bleeding. Provided an alternative before DOACs became available.",
    category: "cardiac",
    subcategory: "atrial-fibrillation",
    tags: ["clopidogrel", "aspirin", "atrial fibrillation", "anticoagulant-ineligible"],
    blinding: "double-blind",
    fundingSource: "Sanofi-Aventis and Bristol-Myers Squibb",
    phase: "Phase 3"
  },
  {
    name: "AVERROES",
    fullTitle: "Apixaban Versus Acetylsalicylic Acid to Prevent Stroke in Atrial Fibrillation Patients Who Have Failed or Are Unsuitable for Vitamin K Antagonist Treatment",
    year: 2011,
    journal: "New England Journal of Medicine",
    pmid: "21309657",
    doi: "10.1056/NEJMoa1007432",
    design: "Phase 3 RCT, double-blind, double-dummy",
    n: 5599,
    population: "Non-valvular atrial fibrillation unsuitable for vitamin K antagonist therapy",
    intervention: "Apixaban 5 mg twice daily (2.5 mg with dose-reduction criteria)",
    comparator: "Aspirin 81-324 mg daily",
    primaryOutcome: {
      measure: "Stroke or systemic embolism",
      result: "1.6% vs 3.7% per year; HR 0.45",
      ci: "0.32-0.62",
      pValue: "p<0.001"
    },
    keySecondary: [
      "Major bleeding similar: 1.4% vs 1.2% per year (HR 1.13, p=0.57)",
      "Intracranial hemorrhage: 0.4% vs 0.4% per year",
      "Trial stopped early for clear efficacy"
    ],
    significance: "Apixaban dramatically reduced stroke vs aspirin without increasing major bleeding in AF patients unsuitable for warfarin. Eliminated the role of aspirin monotherapy for stroke prevention in AF.",
    category: "cardiac",
    subcategory: "atrial-fibrillation",
    tags: ["apixaban", "aspirin", "DOAC", "atrial fibrillation", "warfarin-ineligible"],
    blinding: "double-blind",
    fundingSource: "Bristol-Myers Squibb and Pfizer",
    phase: "Phase 3"
  },
  {
    name: "NAVIGATE ESUS",
    fullTitle: "New Approach Rivaroxaban Inhibition of Factor Xa in a Global Trial versus ASA to Prevent Embolism in Embolic Stroke of Undetermined Source",
    year: 2018,
    journal: "New England Journal of Medicine",
    pmid: "29766772",
    doi: "10.1056/NEJMoa1802686",
    design: "Phase 3 RCT, double-blind, double-dummy",
    n: 7213,
    population: "Embolic stroke of undetermined source (ESUS) within 7 days to 6 months",
    intervention: "Rivaroxaban 15 mg daily",
    comparator: "Aspirin 100 mg daily",
    primaryOutcome: {
      measure: "Recurrent stroke or systemic embolism",
      result: "5.1% vs 4.8%; HR 1.07",
      ci: "0.87-1.33",
      pValue: "p=0.52"
    },
    keySecondary: [
      "Major bleeding increased: 1.8% vs 0.7% per year (HR 2.72, p<0.001)",
      "Trial stopped early for futility and increased bleeding",
      "No benefit in any pre-specified subgroup"
    ],
    significance: "Rivaroxaban was not superior to aspirin for ESUS and caused more bleeding. Challenged the concept that ESUS is primarily cardioembolic and questioned empiric anticoagulation for cryptogenic stroke.",
    category: "cardiac",
    subcategory: "ESUS",
    tags: ["rivaroxaban", "DOAC", "aspirin", "ESUS", "cryptogenic stroke", "negative trial"],
    blinding: "double-blind",
    fundingSource: "Bayer",
    phase: "Phase 3"
  },
  {
    name: "RE-SPECT ESUS",
    fullTitle: "Randomized, Double-Blind, Evaluation in Secondary Stroke Prevention Comparing the Efficacy and Safety of the Oral Thrombin Inhibitor Dabigatran Etexilate vs. Acetylsalicylic Acid in Patients with Embolic Stroke of Undetermined Source",
    year: 2019,
    journal: "New England Journal of Medicine",
    pmid: "31091372",
    doi: "10.1056/NEJMoa1813959",
    design: "Phase 3 RCT, double-blind, double-dummy",
    n: 5390,
    population: "Embolic stroke of undetermined source (ESUS) within 3 months",
    intervention: "Dabigatran 150 mg or 110 mg twice daily",
    comparator: "Aspirin 100 mg daily",
    primaryOutcome: {
      measure: "Recurrent stroke",
      result: "4.1% vs 4.8%; HR 0.85",
      ci: "0.69-1.03",
      pValue: "p=0.10"
    },
    keySecondary: [
      "Major bleeding numerically higher but not significant: 1.7% vs 1.4%",
      "Ischemic stroke: HR 0.84 (0.68-1.03)",
      "No significant interaction with dabigatran dose"
    ],
    significance: "Dabigatran did not significantly reduce recurrent stroke vs aspirin in ESUS, though a trend was observed. Along with NAVIGATE ESUS, demonstrated that empiric anticoagulation for all ESUS patients is not warranted.",
    category: "cardiac",
    subcategory: "ESUS",
    tags: ["dabigatran", "DOAC", "aspirin", "ESUS", "cryptogenic stroke", "negative trial"],
    blinding: "double-blind",
    fundingSource: "Boehringer Ingelheim",
    phase: "Phase 3"
  },
  {
    name: "ATTICUS",
    fullTitle: "Apixaban for Treatment of Embolic Stroke of Undetermined Source",
    year: 2023,
    journal: "NEJM Evidence",
    pmid: "38320511",
    doi: "10.1056/EVIDoa2300235",
    design: "Phase 3 RCT, open-label, PROBE design",
    n: 353,
    population: "ESUS with at least one of: PFO, atrial cardiopathy (elevated NT-proBNP, left atrial enlargement), or other high-risk features",
    intervention: "Apixaban 5 mg twice daily",
    comparator: "Aspirin 100 mg daily",
    primaryOutcome: {
      measure: "New ischemic lesion on MRI at 12 months",
      result: "Apixaban 20.0% vs aspirin 22.1%",
      ci: "OR 0.88 (0.54-1.43)",
      pValue: "p=0.60"
    },
    keySecondary: [
      "Recurrent stroke: 3.4% vs 4.0% (not significant)",
      "Newly detected AF: 12.5% in apixaban vs 11.5% in aspirin group",
      "Major bleeding: 2.3% vs 0.6%"
    ],
    significance: "Apixaban did not reduce new MRI lesions compared to aspirin in ESUS patients with potential cardiac sources. Even in an enriched population, empiric anticoagulation did not show clear benefit.",
    category: "cardiac",
    subcategory: "ESUS",
    tags: ["apixaban", "DOAC", "aspirin", "ESUS", "PFO", "atrial cardiopathy", "negative trial"],
    blinding: "open-label",
    fundingSource: "German Federal Ministry of Education and Research",
    phase: "Phase 3"
  },

  // ==========================================
  // PFO CLOSURE TRIALS
  // ==========================================
  {
    name: "CLOSE",
    fullTitle: "Patent Foramen Ovale Closure or Anticoagulants versus Antiplatelet Therapy to Prevent Stroke Recurrence",
    year: 2017,
    journal: "New England Journal of Medicine",
    pmid: "28902593",
    doi: "10.1056/NEJMoa1705915",
    design: "Phase 3 RCT, open-label, three-arm",
    n: 663,
    population: "Age 16-60, recent cryptogenic stroke with PFO and atrial septal aneurysm or large interatrial shunt",
    intervention: "PFO closure (various devices) plus antiplatelet therapy",
    comparator: "Antiplatelet therapy alone (or anticoagulation in a third arm)",
    primaryOutcome: {
      measure: "Recurrent stroke",
      result: "PFO closure 0% vs antiplatelet 6.0% (at mean 5.3 years follow-up); HR 0.03",
      ci: "0-0.26",
      pValue: "p<0.001"
    },
    keySecondary: [
      "No strokes in the PFO closure group over entire follow-up",
      "Atrial fibrillation higher with closure: 4.6% vs 0.9% (p=0.02)",
      "Procedural complications: 5.9% (mostly device-related)"
    ],
    significance: "Landmark trial definitively showing PFO closure prevents recurrent stroke in young patients with high-risk PFO features. Zero strokes in the closure group was a striking result. Changed practice globally.",
    category: "pfo",
    subcategory: "closure",
    tags: ["PFO", "patent foramen ovale", "device closure", "cryptogenic stroke", "landmark"],
    blinding: "open-label",
    fundingSource: "French Ministry of Health",
    phase: "Phase 3",
    landmark: true
  },
  {
    name: "RESPECT (PFO)",
    fullTitle: "Randomized Evaluation of Recurrent Stroke Comparing PFO Closure to Established Current Standard of Care Treatment — Extended Follow-up",
    year: 2017,
    journal: "New England Journal of Medicine",
    pmid: "28902590",
    doi: "10.1056/NEJMoa1610057",
    design: "Phase 3 RCT, open-label",
    n: 980,
    population: "Age 18-60, cryptogenic stroke with PFO",
    intervention: "PFO closure with Amplatzer PFO Occluder plus medical therapy",
    comparator: "Medical therapy alone (antiplatelet, anticoagulant, or both)",
    primaryOutcome: {
      measure: "Recurrent ischemic stroke (extended follow-up, median 5.9 years)",
      result: "3.6% vs 5.8%; HR 0.55",
      ci: "0.31-0.999",
      pValue: "p=0.046"
    },
    keySecondary: [
      "Original trial (median 2.6 years): HR 0.49 (0.22-1.11, p=0.08) — not significant",
      "Atrial fibrillation post-procedure: similar between groups",
      "Benefit driven by patients with atrial septal aneurysm or substantial shunt"
    ],
    significance: "Extended follow-up of RESPECT showed significant benefit of PFO closure. Along with CLOSE and REDUCE, this trio of 2017 trials established PFO closure as standard of care for selected cryptogenic stroke patients.",
    category: "pfo",
    subcategory: "closure",
    tags: ["PFO", "patent foramen ovale", "Amplatzer", "device closure", "cryptogenic stroke", "extended follow-up"],
    blinding: "open-label",
    fundingSource: "St. Jude Medical (Abbott)",
    phase: "Phase 3"
  },
  {
    name: "REDUCE",
    fullTitle: "GORE REDUCE Clinical Study: PFO Closure or Medical Therapy for Cryptogenic Stroke",
    year: 2017,
    journal: "New England Journal of Medicine",
    pmid: "28902580",
    doi: "10.1056/NEJMoa1707404",
    design: "Phase 3 RCT, open-label",
    n: 664,
    population: "Age 18-59, cryptogenic stroke with PFO within 180 days",
    intervention: "PFO closure with GORE CARDIOFORM Septal Occluder plus antiplatelet therapy",
    comparator: "Antiplatelet therapy alone",
    primaryOutcome: {
      measure: "Clinical ischemic stroke at 24 months (co-primary); new brain infarct on MRI (co-primary)",
      result: "Clinical stroke: 1.4% vs 5.4% (HR 0.23); New brain infarct: 5.7% vs 11.3% (RR 0.51)",
      ci: "Clinical stroke: 0.09-0.62; Brain infarct: 0.29-0.91",
      pValue: "Clinical stroke: p=0.002; Brain infarct: p=0.04"
    },
    keySecondary: [
      "Atrial fibrillation: 6.6% in closure vs 0.4% in medical group (p<0.001)",
      "Device-related serious adverse events: 1.4%",
      "Benefit consistent regardless of shunt size"
    ],
    significance: "Demonstrated that PFO closure significantly reduced clinical stroke and subclinical brain infarction. Part of the landmark trio of 2017 PFO trials that changed clinical practice.",
    category: "pfo",
    subcategory: "closure",
    tags: ["PFO", "patent foramen ovale", "GORE device", "device closure", "cryptogenic stroke", "MRI endpoints"],
    blinding: "open-label",
    fundingSource: "W.L. Gore & Associates",
    phase: "Phase 3"
  },
  {
    name: "DEFENSE-PFO",
    fullTitle: "Device Closure Versus Medical Therapy for Cryptogenic Stroke Patients with High-Risk Patent Foramen Ovale",
    year: 2018,
    journal: "Journal of the American College of Cardiology",
    pmid: "29544871",
    doi: "10.1016/j.jacc.2018.02.046",
    design: "Phase 3 RCT, open-label",
    n: 120,
    population: "Cryptogenic stroke with high-risk PFO (atrial septal aneurysm, hypermobility, or large shunt size) in Korea",
    intervention: "PFO closure with Amplatzer PFO Occluder plus medical therapy",
    comparator: "Medical therapy alone",
    primaryOutcome: {
      measure: "Composite of stroke, vascular death, or TIMI major bleeding at 2 years",
      result: "0% vs 12.9%",
      ci: "Not reported (zero events in closure arm)",
      pValue: "p=0.013"
    },
    keySecondary: [
      "Recurrent stroke: 0% vs 10.5%",
      "No procedural complications in the closure group",
      "Small sample size limits generalizability"
    ],
    significance: "Small but striking trial showing zero events after PFO closure in high-risk PFO patients. Added to the evidence supporting device closure, particularly in patients with high-risk PFO features.",
    category: "pfo",
    subcategory: "closure",
    tags: ["PFO", "patent foramen ovale", "device closure", "high-risk PFO", "Korean"],
    blinding: "open-label",
    fundingSource: "Korean Ministry of Health and Welfare",
    phase: "Phase 3"
  },

  // ==========================================
  // LIPID TRIALS
  // ==========================================
  {
    name: "SPARCL",
    fullTitle: "Stroke Prevention by Aggressive Reduction in Cholesterol Levels",
    year: 2006,
    journal: "New England Journal of Medicine",
    pmid: "16899775",
    doi: "10.1056/NEJMoa061894",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 4731,
    population: "Recent stroke or TIA (1-6 months prior), no known coronary heart disease, LDL 100-190 mg/dL",
    intervention: "Atorvastatin 80 mg daily",
    comparator: "Placebo",
    primaryOutcome: {
      measure: "Recurrent fatal or non-fatal stroke at 5 years",
      result: "11.2% vs 13.1%; HR 0.84",
      ci: "0.71-0.99",
      pValue: "p=0.03"
    },
    keySecondary: [
      "Major cardiovascular events reduced: HR 0.80 (0.69-0.92, p=0.002)",
      "Ischemic stroke reduced: HR 0.78 (p=0.008)",
      "Hemorrhagic stroke slightly increased: HR 1.66 (1.08-2.55) — 55 vs 33 events",
      "LDL reduction from 133 to 73 mg/dL (atorvastatin) vs 133 to 129 (placebo)"
    ],
    significance: "First and only dedicated trial of statin therapy for secondary stroke prevention. Despite slight increase in hemorrhagic stroke, net benefit clearly favored atorvastatin. Established high-dose statin as standard of care after stroke/TIA.",
    category: "lipids",
    subcategory: "statin",
    tags: ["atorvastatin", "statin", "cholesterol", "secondary prevention", "LDL", "landmark"],
    blinding: "double-blind",
    fundingSource: "Pfizer",
    phase: "Phase 3",
    landmark: true
  },
  {
    name: "TST",
    fullTitle: "Treat Stroke to Target",
    year: 2020,
    journal: "New England Journal of Medicine",
    pmid: "31738483",
    doi: "10.1056/NEJMoa1910355",
    design: "Phase 4 RCT, open-label with blinded outcome assessment (PROBE)",
    n: 2860,
    population: "Ischemic stroke or TIA with evidence of atherosclerosis, LDL 70-135 mg/dL on statin",
    intervention: "Lower LDL target <70 mg/dL",
    comparator: "Higher LDL target 90-110 mg/dL",
    primaryOutcome: {
      measure: "Composite of major cardiovascular events (ischemic stroke, MI, urgent revascularization, cardiovascular death)",
      result: "8.5% vs 10.9%; HR 0.78",
      ci: "0.61-0.98",
      pValue: "p=0.04"
    },
    keySecondary: [
      "Achieved LDL: 65 mg/dL vs 96 mg/dL",
      "Ischemic stroke: 5.3% vs 7.1% (not individually significant)",
      "Hemorrhagic stroke: 1.3% vs 0.9% (not significant)",
      "No increase in new-onset diabetes"
    ],
    significance: "First trial to demonstrate that targeting LDL <70 mg/dL after atherosclerotic stroke reduces cardiovascular events compared to a higher target. Supports aggressive LDL lowering as goal-directed therapy after stroke.",
    category: "lipids",
    subcategory: "target-based",
    tags: ["LDL target", "statin", "treat-to-target", "atherosclerotic stroke", "secondary prevention"],
    blinding: "open-label with blinded outcome assessment",
    fundingSource: "French Ministry of Health",
    phase: "Phase 4"
  },
  {
    name: "LODESTAR",
    fullTitle: "Low-Density Lipoprotein Cholesterol Target Level for Primary Prevention with Statins",
    year: 2023,
    journal: "JAMA",
    pmid: "36877807",
    doi: "10.1001/jama.2023.2487",
    design: "Phase 4 RCT, open-label, noninferiority",
    n: 4400,
    population: "Patients with coronary artery disease or at high cardiovascular risk requiring statin therapy, in Korea",
    intervention: "Treat-to-target strategy (LDL 50-70 mg/dL)",
    comparator: "High-intensity statin (rosuvastatin 20 mg or atorvastatin 40 mg) regardless of LDL level",
    primaryOutcome: {
      measure: "Composite of death, MI, stroke, or coronary revascularization at 3 years",
      result: "8.1% vs 8.7%; absolute difference -0.6%",
      ci: "-1.9 to 0.8",
      pValue: "p<0.001 for noninferiority"
    },
    keySecondary: [
      "Mean LDL achieved: 69.1 mg/dL (target group) vs 68.4 mg/dL (high-intensity group)",
      "Lower statin dose in treat-to-target group on average",
      "New-onset diabetes: 7.5% vs 9.1% (HR 0.82, p=0.04)",
      "Drug discontinuation or dose reduction less frequent in target group"
    ],
    significance: "Demonstrated that a treat-to-target statin strategy is non-inferior to fixed high-intensity statin dosing. Supports individualized LDL management with potential for fewer side effects.",
    category: "lipids",
    subcategory: "target-based",
    tags: ["LDL target", "statin", "treat-to-target", "noninferiority", "Korean"],
    blinding: "open-label",
    fundingSource: "Korean Ministry of Health and Welfare",
    phase: "Phase 4"
  },

  // ==========================================
  // REHABILITATION TRIALS
  // ==========================================
  {
    name: "AVERT",
    fullTitle: "A Very Early Rehabilitation Trial for Stroke",
    year: 2015,
    journal: "The Lancet",
    pmid: "25892679",
    doi: "10.1016/S0140-6736(15)60770-2",
    design: "Phase 3 RCT, single-blind (outcome assessor blinded), parallel-group",
    n: 2104,
    population: "Acute stroke (ischemic or hemorrhagic) within 24 hours, able to respond to verbal commands",
    intervention: "Very early mobilization (out of bed within 24 hours, higher dose, more frequent mobilization)",
    comparator: "Usual care (standard timing and dose of mobilization)",
    primaryOutcome: {
      measure: "Favorable outcome (mRS 0-2) at 3 months",
      result: "46% vs 50%; OR 0.73",
      ci: "0.59-0.90",
      pValue: "p=0.004 (favored usual care)"
    },
    keySecondary: [
      "Time to first mobilization: median 18.5 hours (early) vs 22.4 hours (usual)",
      "Death at 3 months: 8% vs 4% (aOR 2.10, p=0.002 — more deaths with early mobilization)",
      "Dose-response analysis: less frequent but early mobilization may be beneficial"
    ],
    significance: "Landmark trial that overturned the assumption that earlier is better for post-stroke mobilization. Very early, high-dose mobilization worsened outcomes. Changed rehabilitation guidelines worldwide to favor a more measured approach.",
    category: "rehabilitation",
    subcategory: "early-mobilization",
    tags: ["early mobilization", "rehabilitation", "acute stroke", "negative trial", "landmark"],
    blinding: "single-blind (outcome assessor)",
    fundingSource: "NHMRC Australia and multiple international agencies",
    phase: "Phase 3",
    landmark: true
  },
  {
    name: "FLAME",
    fullTitle: "Fluoxetine for Motor Recovery After Acute Ischaemic Stroke",
    year: 2011,
    journal: "The Lancet Neurology",
    pmid: "21216670",
    doi: "10.1016/S1474-4422(10)70314-8",
    design: "Phase 2 RCT, double-blind, placebo-controlled",
    n: 118,
    population: "Acute ischemic stroke with hemiplegia or hemiparesis (FMMS <=55) within 5-10 days",
    intervention: "Fluoxetine 20 mg daily for 90 days",
    comparator: "Placebo for 90 days",
    primaryOutcome: {
      measure: "Change in Fugl-Meyer Motor Scale (FMMS) from baseline to day 90",
      result: "Improvement of 34.0 points vs 24.3 points; difference 9.7 points",
      ci: "3.2-16.2",
      pValue: "p=0.003"
    },
    keySecondary: [
      "mRS 0-2 at 90 days: 26% vs 9% (p=0.015)",
      "NIHSS improvement significantly greater with fluoxetine",
      "No significant increase in serious adverse events"
    ],
    significance: "Small but influential trial suggesting fluoxetine enhances motor recovery after stroke. Generated enormous interest in SSRIs for neuroplasticity but was later contradicted by larger FOCUS, AFFINITY, and EFFECTS trials.",
    category: "rehabilitation",
    subcategory: "pharmacological",
    tags: ["fluoxetine", "SSRI", "motor recovery", "neuroplasticity", "positive trial"],
    blinding: "double-blind",
    fundingSource: "French Ministry of Health (PHRC)",
    phase: "Phase 2"
  },
  {
    name: "FOCUS",
    fullTitle: "Fluoxetine or Control Under Supervision",
    year: 2019,
    journal: "The Lancet",
    pmid: "30528472",
    doi: "10.1016/S0140-6736(18)32823-X",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 3127,
    population: "Recent stroke (2-15 days) with focal neurological deficit, in the UK",
    intervention: "Fluoxetine 20 mg daily for 6 months",
    comparator: "Placebo for 6 months",
    primaryOutcome: {
      measure: "mRS distribution at 6 months (ordinal shift)",
      result: "Adjusted common OR 0.951",
      ci: "0.839-1.079",
      pValue: "p=0.44"
    },
    keySecondary: [
      "No significant difference in Stroke Impact Scale motor domain",
      "Bone fractures reduced: 2.9% vs 4.5% (p=0.007)",
      "New depression less frequent: 13.4% vs 17.2% (p=0.003)",
      "Falls and seizures not significantly different"
    ],
    significance: "Largest fluoxetine-for-stroke-recovery trial. Definitively showed no benefit of fluoxetine on functional outcomes. Along with AFFINITY and EFFECTS, refuted the FLAME hypothesis for routine SSRI use after stroke.",
    category: "rehabilitation",
    subcategory: "pharmacological",
    tags: ["fluoxetine", "SSRI", "motor recovery", "negative trial", "definitive"],
    blinding: "double-blind",
    fundingSource: "UK Stroke Association and NIHR",
    phase: "Phase 3"
  },
  {
    name: "AFFINITY",
    fullTitle: "Assessment of Fluoxetine in Stroke Recovery",
    year: 2020,
    journal: "The Lancet Neurology",
    pmid: "32702334",
    doi: "10.1016/S1474-4422(20)30207-6",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 1280,
    population: "Recent stroke (2-15 days) with persisting neurological deficit, in Australia, New Zealand, and Vietnam",
    intervention: "Fluoxetine 20 mg daily for 6 months",
    comparator: "Placebo for 6 months",
    primaryOutcome: {
      measure: "mRS distribution at 6 months (ordinal shift)",
      result: "Adjusted common OR 0.936",
      ci: "0.762-1.150",
      pValue: "p=0.53"
    },
    keySecondary: [
      "Mood disorders less common with fluoxetine: 3.8% vs 7.3% (p=0.003)",
      "Bone fractures: 2.8% vs 3.5% (not significant in this trial)",
      "Falls significantly increased: 4.5% vs 2.2% (p=0.02)",
      "Hyponatremia more frequent with fluoxetine"
    ],
    significance: "Confirmed FOCUS findings that fluoxetine does not improve functional outcomes after stroke. Part of the trio of definitive SSRI-for-stroke-recovery trials that ended routine use of fluoxetine for motor recovery.",
    category: "rehabilitation",
    subcategory: "pharmacological",
    tags: ["fluoxetine", "SSRI", "motor recovery", "negative trial", "Australian"],
    blinding: "double-blind",
    fundingSource: "Australian NHMRC",
    phase: "Phase 3"
  },
  {
    name: "EFFECTS",
    fullTitle: "Efficacy of Fluoxetine — A Randomised Controlled Trial in Stroke",
    year: 2020,
    journal: "The Lancet Neurology",
    pmid: "32702335",
    doi: "10.1016/S1474-4422(20)30219-2",
    design: "Phase 3 RCT, double-blind, placebo-controlled",
    n: 1500,
    population: "Acute stroke (2-15 days) with persisting neurological deficit, in Sweden",
    intervention: "Fluoxetine 20 mg daily for 6 months",
    comparator: "Placebo for 6 months",
    primaryOutcome: {
      measure: "mRS distribution at 6 months (ordinal shift)",
      result: "Adjusted common OR 0.94",
      ci: "0.78-1.13",
      pValue: "p=0.42"
    },
    keySecondary: [
      "Depression at 6 months less common with fluoxetine: 6.9% vs 9.9% (p=0.033)",
      "Bone fractures: 3.5% vs 2.8% (not significant)",
      "Hyponatremia: 3.2% vs 1.3% (p=0.009)",
      "No significant difference in any functional outcome measure"
    ],
    significance: "Third large negative fluoxetine-for-recovery trial published alongside AFFINITY. The concordance of FOCUS, AFFINITY, and EFFECTS conclusively demonstrated that fluoxetine does not enhance stroke recovery.",
    category: "rehabilitation",
    subcategory: "pharmacological",
    tags: ["fluoxetine", "SSRI", "motor recovery", "negative trial", "Swedish"],
    blinding: "double-blind",
    fundingSource: "Swedish Research Council and Swedish Heart-Lung Foundation",
    phase: "Phase 3"
  },
  {
    name: "COSSACS",
    fullTitle: "Continue or Stop Post-Stroke Antihypertensives Collaborative Study",
    year: 2010,
    journal: "The Lancet Neurology",
    pmid: "20621562",
    doi: "10.1016/S1474-4422(10)70163-0",
    design: "Phase 3 RCT, open-label with blinded outcome assessment (PROBE)",
    n: 763,
    population: "Acute stroke (within 48 hours) with prior antihypertensive therapy",
    intervention: "Continue pre-stroke antihypertensive medications",
    comparator: "Temporarily stop pre-stroke antihypertensive medications for 2 weeks",
    primaryOutcome: {
      measure: "Death or dependency (mRS >=3) at 2 weeks",
      result: "Continue: 25.1% vs Stop: 24.0%; OR 1.06",
      ci: "0.77-1.47",
      pValue: "p=0.72"
    },
    keySecondary: [
      "BP at day 7: 149/82 (continue) vs 153/84 (stop) mmHg",
      "Serious adverse events similar between groups",
      "Cardiovascular events at 6 months: no significant difference",
      "Study underpowered (recruited 763 of planned 2900)"
    ],
    significance: "Underpowered but showed no clear benefit or harm from continuing antihypertensives in acute stroke. Provided the only randomized data on this common clinical question. ENOS later addressed this in its factorial design.",
    category: "rehabilitation",
    subcategory: "acute-management",
    tags: ["antihypertensives", "acute stroke", "blood pressure", "continuation", "underpowered"],
    blinding: "open-label with blinded outcome assessment",
    fundingSource: "UK Stroke Association and British Heart Foundation",
    phase: "Phase 3"
  },
  {
    name: "ENCHANTED",
    fullTitle: "Enhanced Control of Hypertension and Thrombolysis Stroke Study — Dose-Intensity Arm",
    year: 2016,
    journal: "New England Journal of Medicine",
    pmid: "27161018",
    doi: "10.1056/NEJMoa1515510",
    design: "Phase 3 RCT, open-label with blinded outcome assessment, 2x2 factorial",
    n: 3310,
    population: "Acute ischemic stroke eligible for IV thrombolysis within 4.5 hours",
    intervention: "Low-dose IV alteplase (0.6 mg/kg, 15% as bolus, rest over 1 hour)",
    comparator: "Standard-dose IV alteplase (0.9 mg/kg)",
    primaryOutcome: {
      measure: "Death or disability (mRS 2-6) at 90 days",
      result: "53.2% vs 51.1%; OR 1.09",
      ci: "0.95-1.25",
      pValue: "p=0.51 for noninferiority (margin 1.14 not met)"
    },
    keySecondary: [
      "Symptomatic ICH significantly lower with low dose: 1.0% vs 2.1% (OR 0.49, p=0.01)",
      "Mortality similar: 8.5% vs 10.3%",
      "mRS 0-1 at 90 days: 43.9% vs 47.5%",
      "Ordinal mRS: no significant difference"
    ],
    significance: "Low-dose alteplase did not meet prespecified noninferiority criteria versus standard dose, though it had fewer hemorrhagic complications. Standard dose (0.9 mg/kg) remains the recommended regimen internationally.",
    category: "rehabilitation",
    subcategory: "thrombolysis-dosing",
    tags: ["alteplase", "low-dose", "thrombolysis", "noninferiority", "dose-finding"],
    blinding: "open-label with blinded outcome assessment",
    fundingSource: "NHMRC Australia and multiple international agencies",
    phase: "Phase 3"
  }
);
