var TrialDatabase = {
  trials: [
    // ==========================================
    // THROMBOLYSIS TRIALS
    // ==========================================
    {
      name: "NINDS",
      fullTitle: "National Institute of Neurological Disorders and Stroke rt-PA Stroke Study",
      year: 1995,
      journal: "New England Journal of Medicine",
      pmid: "7477192",
      design: "Phase 3 RCT, double-blind, placebo-controlled",
      n: 624,
      population: "Acute ischemic stroke within 3 hours of symptom onset",
      intervention: "IV alteplase 0.9 mg/kg",
      comparator: "Placebo",
      primaryOutcome: {
        measure: "Favorable outcome (mRS 0-1) at 90 days",
        result: "OR 1.7",
        ci: "1.2-2.6",
        pValue: "p=0.008"
      },
      keySecondary: [
        "Symptomatic ICH 6.4% vs 0.6%",
        "No difference in 90-day mortality"
      ],
      significance: "Landmark trial establishing IV tPA as standard of care for acute ischemic stroke within 3 hours. Led to FDA approval of alteplase for stroke in 1996.",
      category: "thrombolysis",
      tags: ["alteplase", "tPA", "acute stroke", "3-hour window", "landmark"]
    },
    {
      name: "ECASS II",
      fullTitle: "European Cooperative Acute Stroke Study II",
      year: 1998,
      journal: "The Lancet",
      pmid: "9856521",
      design: "Phase 3 RCT, double-blind, placebo-controlled",
      n: 800,
      population: "Acute ischemic stroke within 6 hours of symptom onset",
      intervention: "IV alteplase 0.9 mg/kg",
      comparator: "Placebo",
      primaryOutcome: {
        measure: "Favorable outcome (mRS 0-1) at 90 days",
        result: "40.3% vs 36.6%",
        pValue: "p=0.277"
      },
      keySecondary: [
        "Symptomatic ICH 8.8% vs 3.4%",
        "Mortality 10.5% vs 12.7%"
      ],
      significance: "Failed to show benefit of IV tPA in the 0-6 hour window at the primary endpoint, but suggested benefit in post-hoc analyses. Helped refine the treatment window.",
      category: "thrombolysis",
      tags: ["alteplase", "tPA", "6-hour window", "negative trial"]
    },
    {
      name: "ECASS III",
      fullTitle: "European Cooperative Acute Stroke Study III",
      year: 2008,
      journal: "New England Journal of Medicine",
      pmid: "18815396",
      design: "Phase 3 RCT, double-blind, placebo-controlled",
      n: 821,
      population: "Acute ischemic stroke 3-4.5 hours after symptom onset",
      intervention: "IV alteplase 0.9 mg/kg",
      comparator: "Placebo",
      primaryOutcome: {
        measure: "Favorable outcome (mRS 0-1) at 90 days",
        result: "OR 1.34",
        ci: "1.02-1.76",
        pValue: "p=0.04"
      },
      keySecondary: [
        "Symptomatic ICH 2.4% vs 0.2%",
        "Absolute benefit 7.2% in favorable outcomes"
      ],
      significance: "Extended the treatment window for IV tPA from 3 to 4.5 hours. Changed guidelines worldwide and remains a cornerstone of acute stroke treatment.",
      category: "thrombolysis",
      tags: ["alteplase", "tPA", "extended window", "4.5-hour", "landmark"]
    },
    {
      name: "IST-3",
      fullTitle: "Third International Stroke Trial",
      year: 2012,
      journal: "The Lancet",
      pmid: "22632908",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 3035,
      population: "Acute ischemic stroke within 6 hours, including patients >80 years",
      intervention: "IV alteplase 0.9 mg/kg",
      comparator: "Open control (no alteplase)",
      primaryOutcome: {
        measure: "Alive and independent (OHS 0-2) at 6 months",
        result: "OR 1.13",
        ci: "0.95-1.35",
        pValue: "p=0.181"
      },
      keySecondary: [
        "Ordinal shift analysis favored tPA (p=0.001)",
        "Early hazard offset by later benefit"
      ],
      significance: "Largest thrombolysis RCT; primary endpoint not significant but ordinal analysis supported benefit. Included the first substantial data on patients over 80 years.",
      category: "thrombolysis",
      tags: ["alteplase", "tPA", "elderly", "6-hour window"]
    },
    {
      name: "ENCHANTED",
      fullTitle: "Enhanced Control of Hypertension and Thrombolysis Stroke Study",
      year: 2016,
      journal: "New England Journal of Medicine",
      pmid: "27088098",
      design: "Phase 3 RCT, 2x2 factorial, open-label with blinded outcome assessment",
      n: 3310,
      population: "Acute ischemic stroke eligible for IV thrombolysis within 4.5 hours",
      intervention: "Low-dose IV alteplase (0.6 mg/kg)",
      comparator: "Standard-dose IV alteplase (0.9 mg/kg)",
      primaryOutcome: {
        measure: "Death or disability (mRS 2-6) at 90 days",
        result: "OR 1.09",
        ci: "0.95-1.25",
        pValue: "Noninferiority not established"
      },
      keySecondary: [
        "Lower rate of symptomatic ICH with low dose (1.0% vs 2.1%)",
        "Similar mortality rates"
      ],
      significance: "Low-dose alteplase did not meet noninferiority vs standard dose. Standard dosing (0.9 mg/kg) remains the recommended regimen worldwide.",
      category: "thrombolysis",
      tags: ["alteplase", "dose-finding", "low-dose", "noninferiority"]
    },
    {
      name: "EXTEND",
      fullTitle: "Extending the Time for Thrombolysis in Emergency Neurological Deficits",
      year: 2019,
      journal: "New England Journal of Medicine",
      pmid: "31091394",
      design: "Phase 3 RCT, double-blind, placebo-controlled",
      n: 225,
      population: "Ischemic stroke 4.5-9 hours from onset or wake-up stroke with perfusion mismatch on CT/MRI",
      intervention: "IV alteplase 0.9 mg/kg",
      comparator: "Placebo",
      primaryOutcome: {
        measure: "Excellent outcome (mRS 0-1) at 90 days",
        result: "OR 1.44",
        ci: "1.01-2.06",
        pValue: "p=0.04"
      },
      keySecondary: [
        "Symptomatic ICH 6.2% vs 0.9%",
        "Ordinal mRS shift favored alteplase"
      ],
      significance: "Demonstrated that imaging-based selection can extend the thrombolysis window beyond 4.5 hours. Supports the tissue-based rather than time-based approach to treatment.",
      category: "thrombolysis",
      tags: ["alteplase", "extended window", "perfusion imaging", "wake-up stroke"]
    },
    {
      name: "WAKE-UP",
      fullTitle: "MRI-Guided Thrombolysis for Stroke with Unknown Time of Onset",
      year: 2018,
      journal: "New England Journal of Medicine",
      pmid: "29766770",
      design: "Phase 3 RCT, double-blind, placebo-controlled",
      n: 503,
      population: "Wake-up stroke with DWI-FLAIR mismatch on MRI",
      intervention: "IV alteplase 0.9 mg/kg",
      comparator: "Placebo",
      primaryOutcome: {
        measure: "Favorable outcome (mRS 0-1) at 90 days",
        result: "53.3% vs 41.8%, OR 1.61",
        ci: "1.09-2.36",
        pValue: "p=0.02"
      },
      keySecondary: [
        "Symptomatic ICH 2.0% vs 0.4%",
        "Median mRS 1 vs 2"
      ],
      significance: "Established DWI-FLAIR mismatch as a guide for treating wake-up strokes with IV tPA. Paradigm-shifting use of tissue clock rather than time clock.",
      category: "thrombolysis",
      tags: ["alteplase", "wake-up stroke", "MRI", "DWI-FLAIR mismatch"]
    },
    {
      name: "AcT",
      fullTitle: "Alteplase Compared to Tenecteplase in Patients with Acute Ischemic Stroke",
      year: 2024,
      journal: "New England Journal of Medicine",
      pmid: "38587247",
      design: "Phase 3 RCT, open-label, noninferiority",
      n: 1600,
      population: "Acute ischemic stroke eligible for IV thrombolysis within 4.5 hours",
      intervention: "IV tenecteplase 0.25 mg/kg",
      comparator: "IV alteplase 0.9 mg/kg",
      primaryOutcome: {
        measure: "Excellent outcome (mRS 0-1) at 90 days",
        result: "36.9% vs 34.8%",
        ci: "Difference 2.1% (-2.6 to 6.9)",
        pValue: "Noninferiority met"
      },
      keySecondary: [
        "Similar rates of symptomatic ICH",
        "Tenecteplase is single-bolus, easier to administer"
      ],
      significance: "Demonstrated noninferiority of tenecteplase vs alteplase for acute ischemic stroke. Supports transition to tenecteplase as preferred thrombolytic due to ease of administration.",
      category: "thrombolysis",
      tags: ["tenecteplase", "alteplase", "noninferiority", "single bolus"]
    },
    {
      name: "TIMELESS",
      fullTitle: "Tenecteplase in Ischemic Stroke Patients with Large Vessel Occlusion and Mismatch",
      year: 2024,
      journal: "New England Journal of Medicine",
      pmid: "39110496",
      design: "Phase 3 RCT, double-blind, placebo-controlled",
      n: 458,
      population: "Large vessel occlusion stroke 4.5-24 hours with perfusion mismatch, eligible for thrombectomy",
      intervention: "IV tenecteplase 0.25 mg/kg before thrombectomy",
      comparator: "Placebo before thrombectomy",
      primaryOutcome: {
        measure: "mRS distribution (ordinal shift) at 90 days",
        result: "Adjusted common OR 0.93",
        ci: "0.67-1.28",
        pValue: "p=0.65"
      },
      keySecondary: [
        "No significant difference in reperfusion rates",
        "Similar safety profile"
      ],
      significance: "Tenecteplase prior to thrombectomy in the late window did not improve outcomes. Does not support routine bridging thrombolysis in late-window thrombectomy patients.",
      category: "thrombolysis",
      tags: ["tenecteplase", "bridging", "thrombectomy", "late window"]
    },

    // ==========================================
    // THROMBECTOMY TRIALS
    // ==========================================
    {
      name: "MR CLEAN",
      fullTitle: "Multicenter Randomized Clinical Trial of Endovascular Treatment for Acute Ischemic Stroke in the Netherlands",
      year: 2015,
      journal: "New England Journal of Medicine",
      pmid: "25517348",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 500,
      population: "Anterior circulation LVO stroke within 6 hours, confirmed on CTA",
      intervention: "Endovascular treatment (mostly stent retriever) + usual care",
      comparator: "Usual care alone (including IV tPA if eligible)",
      primaryOutcome: {
        measure: "mRS distribution (ordinal shift) at 90 days",
        result: "Adjusted OR 1.67",
        ci: "1.21-2.30",
        pValue: "p<0.01"
      },
      keySecondary: [
        "mRS 0-2: 32.6% vs 19.1%",
        "No difference in mortality or sICH"
      ],
      significance: "First positive trial proving endovascular thrombectomy improves outcomes in LVO stroke. Triggered early stopping of multiple concurrent trials and revolutionized acute stroke care.",
      category: "thrombectomy",
      tags: ["endovascular", "stent retriever", "LVO", "landmark", "CTA"]
    },
    {
      name: "ESCAPE",
      fullTitle: "Endovascular Treatment for Small Core and Anterior Circulation Proximal Occlusion with Emphasis on Minimizing CT to Recanalization Times",
      year: 2015,
      journal: "New England Journal of Medicine",
      pmid: "25671797",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 316,
      population: "Anterior circulation LVO stroke within 12 hours with moderate-to-good collaterals on CTA",
      intervention: "Endovascular thrombectomy + standard care",
      comparator: "Standard care alone",
      primaryOutcome: {
        measure: "mRS distribution (ordinal shift) at 90 days",
        result: "Adjusted OR 3.1",
        ci: "2.0-4.7",
        pValue: "p<0.001"
      },
      keySecondary: [
        "mRS 0-2: 53.0% vs 29.3%",
        "Mortality 10.4% vs 19.0%"
      ],
      significance: "Demonstrated large treatment effect with rapid workflow and collateral-based imaging selection. Emphasized importance of fast door-to-groin times.",
      category: "thrombectomy",
      tags: ["endovascular", "LVO", "collaterals", "workflow optimization"]
    },
    {
      name: "EXTEND-IA",
      fullTitle: "Extending the Time for Thrombolysis in Emergency Neurological Deficits - Intra-Arterial",
      year: 2015,
      journal: "New England Journal of Medicine",
      pmid: "25671798",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 70,
      population: "Anterior circulation LVO stroke within 4.5 hours with perfusion mismatch, receiving IV tPA",
      intervention: "IV tPA + endovascular thrombectomy (Solitaire stent retriever)",
      comparator: "IV tPA alone",
      primaryOutcome: {
        measure: "Reperfusion at 24 hours and early neurological improvement (NIHSS reduction >=8 at 3 days)",
        result: "100% vs 37% reperfusion; 80% vs 37% early improvement",
        pValue: "p<0.001 for both"
      },
      keySecondary: [
        "mRS 0-2 at 90 days: 71% vs 40%",
        "No increase in symptomatic ICH"
      ],
      significance: "Small but highly significant trial using perfusion imaging to select patients for thrombectomy after IV tPA. Demonstrated dramatic reperfusion and functional benefit.",
      category: "thrombectomy",
      tags: ["endovascular", "LVO", "perfusion mismatch", "Solitaire", "bridging"]
    },
    {
      name: "SWIFT PRIME",
      fullTitle: "Solitaire with the Intention for Thrombectomy as Primary Endovascular Treatment",
      year: 2015,
      journal: "New England Journal of Medicine",
      pmid: "25671799",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 196,
      population: "Anterior circulation LVO stroke within 6 hours with small core on CT perfusion or CTA, receiving IV tPA",
      intervention: "IV tPA + endovascular thrombectomy (Solitaire stent retriever)",
      comparator: "IV tPA alone",
      primaryOutcome: {
        measure: "mRS distribution (ordinal shift) at 90 days",
        result: "Adjusted OR for improvement 1.70",
        ci: "1.23-2.33",
        pValue: "p<0.001"
      },
      keySecondary: [
        "mRS 0-2: 60% vs 35%",
        "Similar mortality rates"
      ],
      significance: "Confirmed benefit of stent-retriever thrombectomy after IV tPA with imaging selection. Stopped early for overwhelming efficacy.",
      category: "thrombectomy",
      tags: ["endovascular", "LVO", "Solitaire", "stent retriever", "imaging selection"]
    },
    {
      name: "REVASCAT",
      fullTitle: "Randomized Trial of Revascularization with Solitaire FR Device vs Best Medical Therapy in the Treatment of Acute Stroke Due to Anterior Circulation Large Vessel Occlusion",
      year: 2015,
      journal: "New England Journal of Medicine",
      pmid: "25671800",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 206,
      population: "Anterior circulation LVO stroke within 8 hours",
      intervention: "Endovascular thrombectomy (Solitaire stent retriever) + medical therapy",
      comparator: "Medical therapy alone",
      primaryOutcome: {
        measure: "mRS distribution (ordinal shift) at 90 days",
        result: "Adjusted OR 1.7",
        ci: "1.05-2.8",
        pValue: "p=0.04"
      },
      keySecondary: [
        "mRS 0-2: 43.7% vs 28.2%",
        "No safety concerns"
      ],
      significance: "Fifth trial in 2015 confirming thrombectomy benefit for LVO stroke. Enrolled up to 8 hours, slightly extending the confirmed treatment window.",
      category: "thrombectomy",
      tags: ["endovascular", "LVO", "Solitaire", "8-hour window"]
    },
    {
      name: "DAWN",
      fullTitle: "DWI or CTP Assessment with Clinical Mismatch in the Triage of Wake-Up and Late Presenting Strokes Undergoing Neurointervention with Trevo",
      year: 2018,
      journal: "New England Journal of Medicine",
      pmid: "29129157",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 206,
      population: "LVO stroke 6-24 hours from last known well with clinical-core mismatch on CT perfusion or DWI-MRI",
      intervention: "Thrombectomy (Trevo stent retriever) + standard care",
      comparator: "Standard care alone",
      primaryOutcome: {
        measure: "Utility-weighted mRS at 90 days",
        result: "Adjusted difference 0.15",
        ci: "0.07-0.23",
        pValue: "p<0.001"
      },
      keySecondary: [
        "mRS 0-2: 49% vs 13%",
        "Absolute benefit 36 percentage points"
      ],
      significance: "Paradigm-shifting trial extending the thrombectomy window to 24 hours using clinical-imaging mismatch. Established imaging-based patient selection for late-window treatment.",
      category: "thrombectomy",
      tags: ["endovascular", "late window", "clinical-core mismatch", "24-hour", "landmark"]
    },
    {
      name: "DEFUSE 3",
      fullTitle: "Endovascular Therapy Following Imaging Evaluation for Ischemic Stroke 3",
      year: 2018,
      journal: "New England Journal of Medicine",
      pmid: "29129158",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 182,
      population: "LVO stroke 6-16 hours from last known well with perfusion mismatch on CT perfusion or MRI",
      intervention: "Endovascular thrombectomy + standard care",
      comparator: "Standard care alone",
      primaryOutcome: {
        measure: "mRS distribution (ordinal shift) at 90 days",
        result: "OR 2.77",
        ci: "1.63-4.70",
        pValue: "p<0.001"
      },
      keySecondary: [
        "mRS 0-2: 45% vs 17%",
        "Reperfusion achieved in 76%"
      ],
      significance: "Confirmed benefit of thrombectomy in the 6-16 hour window using perfusion-based imaging selection. Together with DAWN, established late-window thrombectomy as standard of care.",
      category: "thrombectomy",
      tags: ["endovascular", "late window", "perfusion mismatch", "16-hour"]
    },
    {
      name: "MR CLEAN LATE",
      fullTitle: "MR CLEAN LATE: Endovascular Treatment in the Late Time Window",
      year: 2023,
      journal: "New England Journal of Medicine",
      pmid: "37212440",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 502,
      population: "LVO stroke 6-24 hours with collateral-based imaging selection on CTA",
      intervention: "Endovascular thrombectomy + standard care",
      comparator: "Standard care alone",
      primaryOutcome: {
        measure: "mRS distribution (ordinal shift) at 90 days",
        result: "Adjusted cOR 1.67",
        ci: "1.20-2.33",
        pValue: "p=0.002"
      },
      keySecondary: [
        "mRS 0-2: 38% vs 26%",
        "Mortality similar between groups"
      ],
      significance: "Extended evidence for late-window thrombectomy using CTA collateral imaging rather than perfusion imaging. Broadened access to late-window treatment.",
      category: "thrombectomy",
      tags: ["endovascular", "late window", "collaterals", "CTA-based selection"]
    },
    {
      name: "ANGEL-ASPECTS",
      fullTitle: "Endovascular Treatment for Acute Anterior Circulation Large Vessel Occlusion with a Large Ischemic Core",
      year: 2023,
      journal: "New England Journal of Medicine",
      pmid: "37212442",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 456,
      population: "Anterior circulation LVO stroke within 24 hours with large ischemic core (ASPECTS 3-5)",
      intervention: "Endovascular thrombectomy + medical care",
      comparator: "Medical care alone",
      primaryOutcome: {
        measure: "mRS distribution (ordinal shift) at 90 days",
        result: "Adjusted cOR 1.37",
        ci: "1.11-1.69",
        pValue: "p=0.004"
      },
      keySecondary: [
        "mRS 0-2: 30% vs 11.6%",
        "Higher rate of sICH in thrombectomy group"
      ],
      significance: "One of the first trials showing benefit of thrombectomy in patients with large ischemic cores (ASPECTS 3-5), a population previously excluded from trials.",
      category: "thrombectomy",
      tags: ["endovascular", "large core", "low ASPECTS", "LVO"]
    },
    {
      name: "SELECT2",
      fullTitle: "Endovascular Thrombectomy for Large Ischemic Core Stroke",
      year: 2023,
      journal: "New England Journal of Medicine",
      pmid: "37212441",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 352,
      population: "Anterior circulation LVO stroke within 24 hours with large ischemic core (>=50 mL on CT perfusion or ASPECTS 3-5)",
      intervention: "Endovascular thrombectomy + medical care",
      comparator: "Medical care alone",
      primaryOutcome: {
        measure: "Utility-weighted mRS at 90 days",
        result: "Adjusted mean difference 0.10",
        ci: "0.04-0.16",
        pValue: "p=0.006"
      },
      keySecondary: [
        "mRS 0-2: 20% vs 7%",
        "Mortality 38% vs 42%"
      ],
      significance: "Confirmed thrombectomy benefit for large core ischemic strokes alongside ANGEL-ASPECTS. Changed practice to include patients with larger infarcts.",
      category: "thrombectomy",
      tags: ["endovascular", "large core", "LVO", "CT perfusion"]
    },
    {
      name: "ATTENTION",
      fullTitle: "Endovascular Treatment for Acute Anterior Circulation Large Vessel Occlusion Stroke with Large Infarct",
      year: 2023,
      journal: "New England Journal of Medicine",
      pmid: "37212439",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 340,
      population: "Anterior circulation LVO stroke within 24 hours with large ischemic core (ASPECTS 3-5)",
      intervention: "Endovascular thrombectomy + medical care",
      comparator: "Medical care alone",
      primaryOutcome: {
        measure: "mRS distribution (ordinal shift) at 90 days",
        result: "Adjusted cOR 1.57",
        ci: "1.18-2.08",
        pValue: "p=0.002"
      },
      keySecondary: [
        "mRS 0-3: 47.0% vs 34.2%",
        "sICH 6.5% vs 2.4%"
      ],
      significance: "Third major trial in 2023 confirming thrombectomy benefit in large core strokes. Collectively, these trials expanded indications to include patients with ASPECTS 3-5.",
      category: "thrombectomy",
      tags: ["endovascular", "large core", "low ASPECTS", "Chinese population"]
    },
    {
      name: "RESCUE-Japan LIMIT",
      fullTitle: "Recovery by Endovascular Salvage for Cerebral Ultra-acute Embolism Japan Large Ischemic Core Trial",
      year: 2022,
      journal: "New England Journal of Medicine",
      pmid: "35856661",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 203,
      population: "Anterior circulation LVO stroke within 6-24 hours with large core (ASPECTS 3-5 or core 50-100 mL)",
      intervention: "Endovascular thrombectomy + medical care",
      comparator: "Medical care alone",
      primaryOutcome: {
        measure: "mRS 0-3 at 90 days",
        result: "31% vs 12.7%",
        pValue: "p=0.002"
      },
      keySecondary: [
        "mRS distribution shift favored thrombectomy",
        "Any ICH more common in thrombectomy group"
      ],
      significance: "First RCT to demonstrate thrombectomy benefit in patients with large ischemic cores (ASPECTS 3-5), paving the way for the 2023 large core trials.",
      category: "thrombectomy",
      tags: ["endovascular", "large core", "Japanese population", "low ASPECTS"]
    },

    // ==========================================
    // ICH TRIALS
    // ==========================================
    {
      name: "INTERACT2",
      fullTitle: "Intensive Blood Pressure Reduction in Acute Cerebral Haemorrhage Trial 2",
      year: 2013,
      journal: "New England Journal of Medicine",
      pmid: "23713578",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 2839,
      population: "Spontaneous intracerebral hemorrhage within 6 hours with SBP 150-220 mmHg",
      intervention: "Intensive BP lowering (target SBP <140 mmHg within 1 hour)",
      comparator: "Guideline-recommended BP management (target SBP <180 mmHg)",
      primaryOutcome: {
        measure: "Death or major disability (mRS 3-6) at 90 days",
        result: "OR 0.87",
        ci: "0.75-1.01",
        pValue: "p=0.06"
      },
      keySecondary: [
        "Ordinal mRS shift favored intensive treatment (p=0.04)",
        "No increase in serious adverse events"
      ],
      significance: "Although the primary outcome was not statistically significant, the ordinal analysis suggested benefit. Supported intensive BP lowering to <140 mmHg in acute ICH.",
      category: "ich",
      tags: ["blood pressure", "ICH", "intensive treatment", "hematoma"]
    },
    {
      name: "INTERACT3",
      fullTitle: "Intensive Ambulance-Delivered Blood Pressure Reduction in Hyperacute Stroke Trial 3",
      year: 2023,
      journal: "The Lancet",
      pmid: "37321233",
      design: "Cluster-randomized, stepped-wedge, open-label",
      n: 7036,
      population: "Acute stroke (primarily ICH) with elevated blood pressure in the prefacility and acute setting",
      intervention: "Intensive care bundle (early BP lowering, glucose control, antipyretics, rapid access to care)",
      comparator: "Usual care",
      primaryOutcome: {
        measure: "mRS distribution (ordinal shift) at 6 months",
        result: "Adjusted OR 0.86",
        ci: "0.76-0.97",
        pValue: "p=0.015"
      },
      keySecondary: [
        "mRS 0-2: 41.6% vs 37.4%",
        "Greater benefit in ICH subgroup"
      ],
      significance: "Demonstrated that an organized, intensive care bundle in hyperacute stroke improves functional outcomes. Supports protocol-driven early acute stroke management.",
      category: "ich",
      tags: ["blood pressure", "care bundle", "prefacility", "ICH", "cluster randomized"]
    },
    {
      name: "ATACH-2",
      fullTitle: "Antihypertensive Treatment of Acute Cerebral Hemorrhage II",
      year: 2016,
      journal: "New England Journal of Medicine",
      pmid: "27276234",
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
        "More renal adverse events in intensive group",
        "No difference in hematoma expansion"
      ],
      significance: "Intensive BP lowering to <140 mmHg did not improve outcomes over <180 mmHg and had more renal AEs. Tempered enthusiasm for aggressive BP targets in ICH.",
      category: "ich",
      tags: ["blood pressure", "ICH", "nicardipine", "negative trial"]
    },
    {
      name: "MISTIE III",
      fullTitle: "Minimally Invasive Surgery Plus Alteplase for Intracerebral Hemorrhage Evacuation III",
      year: 2019,
      journal: "The Lancet",
      pmid: "30739747",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 506,
      population: "Spontaneous supratentorial ICH >=30 mL, stable on CT at 12-72 hours",
      intervention: "Minimally invasive surgery with catheter + alteplase irrigation",
      comparator: "Standard medical management",
      primaryOutcome: {
        measure: "Good outcome (mRS 0-3) at 365 days",
        result: "45% vs 41%",
        pValue: "p=0.33"
      },
      keySecondary: [
        "Clot reduction to <15 mL associated with better outcomes",
        "Mortality 15% in both groups"
      ],
      significance: "MISTIE III failed its primary endpoint but identified a threshold of residual clot volume (<15 mL) associated with better outcomes. Guided future minimally invasive ICH surgery trials.",
      category: "ich",
      tags: ["ICH", "minimally invasive surgery", "alteplase", "catheter-based"]
    },
    {
      name: "STICH",
      fullTitle: "International Surgical Trial in Intracerebral Haemorrhage",
      year: 2005,
      journal: "The Lancet",
      pmid: "15680453",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 1033,
      population: "Spontaneous supratentorial ICH within 72 hours where clinical equipoise existed",
      intervention: "Early open craniotomy surgery within 24 hours",
      comparator: "Initial conservative management (surgery if needed later)",
      primaryOutcome: {
        measure: "Good outcome (GOS favorable) at 6 months",
        result: "26% vs 24%",
        ci: "OR 0.89 (0.66-1.19)",
        pValue: "p=0.414"
      },
      keySecondary: [
        "26% of conservative group crossed over to surgery",
        "Lobar hematomas trended toward surgical benefit"
      ],
      significance: "No overall benefit of early surgery for spontaneous ICH. However, subgroup analysis suggested possible benefit in superficial lobar hemorrhages, leading to STICH II.",
      category: "ich",
      tags: ["ICH", "craniotomy", "surgery", "negative trial"]
    },
    {
      name: "STICH II",
      fullTitle: "International Surgical Trial in Intracerebral Haemorrhage II",
      year: 2013,
      journal: "The Lancet",
      pmid: "23726393",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 601,
      population: "Spontaneous lobar ICH within 48 hours, 10-100 mL, within 1 cm of cortical surface",
      intervention: "Early surgery within 12 hours of randomization",
      comparator: "Initial conservative management",
      primaryOutcome: {
        measure: "Unfavorable outcome (prognosis-based mRS) at 6 months",
        result: "59% vs 62%",
        ci: "OR 0.86 (0.62-1.20)",
        pValue: "p=0.367"
      },
      keySecondary: [
        "21% crossover to surgery in conservative group",
        "Mortality 18% vs 24% (not significant)"
      ],
      significance: "Failed to demonstrate benefit of early surgery even in the subgroup of superficial lobar ICH that appeared favorable in STICH I. Shaped ongoing surgical ICH research.",
      category: "ich",
      tags: ["ICH", "craniotomy", "surgery", "lobar ICH", "negative trial"]
    },
    {
      name: "CLEAR III",
      fullTitle: "Clot Lysis: Evaluating Accelerated Resolution of Intraventricular Hemorrhage III",
      year: 2017,
      journal: "The Lancet",
      pmid: "28081952",
      design: "Phase 3 RCT, double-blind",
      n: 500,
      population: "Spontaneous ICH with intraventricular hemorrhage (IVH) obstructing the 3rd or 4th ventricle, with EVD",
      intervention: "Intraventricular alteplase (1 mg q8h via EVD, up to 12 doses)",
      comparator: "Intraventricular saline via EVD",
      primaryOutcome: {
        measure: "Good outcome (mRS 0-3) at 180 days",
        result: "48% vs 45%",
        pValue: "p=0.48"
      },
      keySecondary: [
        "Case fatality reduced (18% vs 29%, p=0.006)",
        "Faster clot resolution with alteplase"
      ],
      significance: "IVH lysis with alteplase did not improve functional outcomes but significantly reduced mortality. Patients surviving had more severe disability, raising quality-of-life questions.",
      category: "ich",
      tags: ["ICH", "IVH", "intraventricular", "alteplase", "EVD"]
    },
    {
      name: "ENRICH",
      fullTitle: "Early Minimally Invasive Removal of Intracerebral Hemorrhage",
      year: 2024,
      journal: "The Lancet Neurology",
      pmid: "39304240",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 300,
      population: "Spontaneous lobar or anterior basal ganglia ICH 30-80 mL, within 24 hours",
      intervention: "Early minimally invasive parafascicular surgery (MIPS) within 24 hours",
      comparator: "Guideline-based medical management",
      primaryOutcome: {
        measure: "Utility-weighted mRS at 180 days",
        result: "Mean 0.458 vs 0.374",
        ci: "Difference 0.084 (0.005-0.163)",
        pValue: "p=0.04"
      },
      keySecondary: [
        "mRS 0-3: 56.7% vs 46.7%",
        "Safety profile favorable"
      ],
      significance: "First positive surgical ICH trial. Demonstrated that early minimally invasive parafascicular surgery improves functional outcomes in selected ICH patients.",
      category: "ich",
      tags: ["ICH", "minimally invasive surgery", "MIPS", "positive trial", "landmark"]
    },
    {
      name: "TICH-2",
      fullTitle: "Tranexamic Acid for Intracerebral Haemorrhage 2",
      year: 2018,
      journal: "The Lancet",
      pmid: "29778325",
      design: "Phase 3 RCT, double-blind, placebo-controlled",
      n: 2325,
      population: "Spontaneous ICH within 8 hours of symptom onset",
      intervention: "IV tranexamic acid (1g bolus then 1g over 8 hours)",
      comparator: "Matching placebo",
      primaryOutcome: {
        measure: "Functional status (mRS) at 90 days",
        result: "Adjusted OR 0.88",
        ci: "0.76-1.03",
        pValue: "p=0.11"
      },
      keySecondary: [
        "Less hematoma expansion at 24h with TXA (difference -1.37 mL)",
        "No difference in thromboembolic events"
      ],
      significance: "Tranexamic acid did not improve functional outcomes in ICH despite reducing hematoma growth. Highlighted that reducing expansion alone may not translate to clinical benefit.",
      category: "ich",
      tags: ["ICH", "tranexamic acid", "antifibrinolytic", "negative trial"]
    },

    // ==========================================
    // SAH TRIALS
    // ==========================================
    {
      name: "ISAT",
      fullTitle: "International Subarachnoid Aneurysm Trial",
      year: 2002,
      journal: "The Lancet",
      pmid: "12414200",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 2143,
      population: "Aneurysmal subarachnoid hemorrhage suitable for either coiling or clipping",
      intervention: "Endovascular coiling",
      comparator: "Neurosurgical clipping",
      primaryOutcome: {
        measure: "Death or dependency (mRS 3-6) at 1 year",
        result: "23.7% vs 30.6%",
        ci: "RR 0.77 (0.66-0.90)",
        pValue: "p=0.0019"
      },
      keySecondary: [
        "Higher rebleeding rate with coiling at long-term follow-up",
        "Survival advantage maintained at 7 years"
      ],
      significance: "Landmark trial establishing endovascular coiling as the preferred treatment for ruptured aneurysms amenable to both approaches. Transformed neurovascular practice worldwide.",
      category: "sah",
      tags: ["SAH", "aneurysm", "coiling", "clipping", "landmark"]
    },
    {
      name: "BRAT",
      fullTitle: "Barrow Ruptured Aneurysm Trial",
      year: 2012,
      journal: "Journal of Neurosurgery",
      pmid: "22339164",
      design: "Phase 3 RCT, open-label",
      n: 471,
      population: "All patients with ruptured intracranial aneurysms (no anatomic exclusion)",
      intervention: "Endovascular coiling as first treatment",
      comparator: "Microsurgical clipping as first treatment",
      primaryOutcome: {
        measure: "Poor outcome (mRS >2) at 1 year",
        result: "33.7% vs 23.2%",
        pValue: "p=0.02 favoring coiling"
      },
      keySecondary: [
        "38% crossover from coiling to clipping",
        "Posterior circulation: coiling clearly favored"
      ],
      significance: "Intent-to-treat analysis initially favored coiling, but high crossover rate complicated interpretation. At 6-year follow-up, no significant difference between groups.",
      category: "sah",
      tags: ["SAH", "aneurysm", "coiling", "clipping", "crossover"]
    },
    {
      name: "CONSCIOUS-1",
      fullTitle: "Clazosentan to Overcome Neurological Ischemia and Infarction Occurring After Subarachnoid Hemorrhage 1",
      year: 2008,
      journal: "Stroke",
      pmid: "18309149",
      design: "Phase 2 RCT, double-blind, placebo-controlled, dose-finding",
      n: 413,
      population: "Aneurysmal SAH (Fisher grade 3) within 56 hours of aneurysm repair",
      intervention: "Clazosentan (1, 5, or 15 mg/h IV)",
      comparator: "Placebo",
      primaryOutcome: {
        measure: "Moderate-severe angiographic vasospasm within 14 days",
        result: "Dose-dependent reduction: 65% (placebo) to 23% (15 mg/h)",
        pValue: "p<0.0001"
      },
      keySecondary: [
        "No significant reduction in delayed ischemic neurological deficit",
        "Pulmonary complications more frequent with clazosentan"
      ],
      significance: "Clazosentan markedly reduced angiographic vasospasm but did not translate to clinical benefit. Highlighted the disconnect between angiographic and clinical outcomes in SAH.",
      category: "sah",
      tags: ["SAH", "vasospasm", "endothelin antagonist", "clazosentan"]
    },

    // ==========================================
    // ANTIPLATELET TRIALS
    // ==========================================
    {
      name: "CAST",
      fullTitle: "Chinese Acute Stroke Trial",
      year: 1997,
      journal: "The Lancet",
      pmid: "9217720",
      design: "Phase 3 RCT, open-label, placebo-controlled",
      n: 21106,
      population: "Suspected acute ischemic stroke within 48 hours",
      intervention: "Aspirin 160 mg daily for up to 4 weeks",
      comparator: "Placebo",
      primaryOutcome: {
        measure: "Death or non-fatal stroke at 4 weeks",
        result: "5.3% vs 5.9%",
        pValue: "p=0.03"
      },
      keySecondary: [
        "Recurrent ischemic stroke reduced (1.6% vs 2.1%)",
        "Small excess of hemorrhagic stroke with aspirin"
      ],
      significance: "Together with IST, established aspirin within 48 hours as standard acute ischemic stroke therapy. Benefit modest but consistent, with low NNT given stroke incidence.",
      category: "antiplatelets",
      tags: ["aspirin", "acute stroke", "antiplatelet", "Chinese population"]
    },
    {
      name: "IST",
      fullTitle: "International Stroke Trial",
      year: 1997,
      journal: "The Lancet",
      pmid: "9217719",
      design: "Phase 3 RCT, open-label, 3x2 factorial",
      n: 19435,
      population: "Suspected acute ischemic stroke within 48 hours",
      intervention: "Aspirin 300 mg daily (with or without heparin)",
      comparator: "No aspirin (with or without heparin)",
      primaryOutcome: {
        measure: "Death within 14 days and death/dependency at 6 months",
        result: "9.0% vs 9.4% (14-day death); 62.2% vs 63.5% (6-month death/dependency)",
        pValue: "p=0.03 for 6-month outcome"
      },
      keySecondary: [
        "Recurrent ischemic stroke reduced with aspirin",
        "Heparin showed no net benefit due to bleeding"
      ],
      significance: "With CAST, provided definitive evidence for early aspirin in acute ischemic stroke. Showed no benefit of early heparin anticoagulation in acute stroke.",
      category: "antiplatelets",
      tags: ["aspirin", "heparin", "acute stroke", "factorial design"]
    },
    {
      name: "CHANCE",
      fullTitle: "Clopidogrel in High-Risk Patients with Acute Nondisabling Cerebrovascular Events",
      year: 2013,
      journal: "New England Journal of Medicine",
      pmid: "23778136",
      design: "Phase 3 RCT, double-blind, placebo-controlled",
      n: 5170,
      population: "Minor ischemic stroke (NIHSS <=3) or high-risk TIA within 24 hours",
      intervention: "Clopidogrel + aspirin for 21 days then clopidogrel alone",
      comparator: "Aspirin + placebo",
      primaryOutcome: {
        measure: "Stroke (ischemic or hemorrhagic) at 90 days",
        result: "HR 0.68",
        ci: "0.57-0.81",
        pValue: "p<0.001"
      },
      keySecondary: [
        "NNT of 29 to prevent one stroke",
        "No increase in moderate-to-severe hemorrhage"
      ],
      significance: "Established dual antiplatelet therapy (DAPT) for 21 days as superior to aspirin alone for minor stroke/TIA. Changed guidelines worldwide for early secondary prevention.",
      category: "antiplatelets",
      tags: ["DAPT", "clopidogrel", "aspirin", "minor stroke", "TIA", "landmark"]
    },
    {
      name: "POINT",
      fullTitle: "Platelet-Oriented Inhibition in New TIA and Minor Ischemic Stroke",
      year: 2018,
      journal: "New England Journal of Medicine",
      pmid: "29766752",
      design: "Phase 3 RCT, double-blind, placebo-controlled",
      n: 4881,
      population: "Minor ischemic stroke (NIHSS <=3) or high-risk TIA within 12 hours",
      intervention: "Clopidogrel (600mg load then 75mg daily) + aspirin for 90 days",
      comparator: "Placebo + aspirin for 90 days",
      primaryOutcome: {
        measure: "Composite of ischemic stroke, MI, or ischemic vascular death at 90 days",
        result: "HR 0.75",
        ci: "0.59-0.95",
        pValue: "p=0.02"
      },
      keySecondary: [
        "Major hemorrhage higher with DAPT (0.9% vs 0.4%)",
        "Most benefit within first 21 days"
      ],
      significance: "Confirmed CHANCE results in a global population. Greater benefit in first 21 days with increasing hemorrhagic risk thereafter, supporting 21-day DAPT duration per CHANCE.",
      category: "antiplatelets",
      tags: ["DAPT", "clopidogrel", "aspirin", "minor stroke", "TIA"]
    },
    {
      name: "THALES",
      fullTitle: "Acute Stroke or Transient Ischaemic Attack Treated with Ticagrelor and ASA for Prevention of Stroke and Death",
      year: 2020,
      journal: "New England Journal of Medicine",
      pmid: "32668111",
      design: "Phase 3 RCT, double-blind, placebo-controlled",
      n: 11016,
      population: "Mild-to-moderate ischemic stroke (NIHSS <=5) or high-risk TIA within 24 hours",
      intervention: "Ticagrelor (180mg load, then 90mg BID) + aspirin for 30 days",
      comparator: "Placebo + aspirin for 30 days",
      primaryOutcome: {
        measure: "Stroke or death within 30 days",
        result: "HR 0.83",
        ci: "0.71-0.96",
        pValue: "p=0.02"
      },
      keySecondary: [
        "Severe bleeding higher with ticagrelor (0.5% vs 0.1%)",
        "Greater benefit in ipsilateral atherosclerosis subgroup"
      ],
      significance: "Ticagrelor plus aspirin reduced recurrent stroke vs aspirin alone, but with increased bleeding. Provides an alternative DAPT regimen, particularly for clopidogrel non-responders.",
      category: "antiplatelets",
      tags: ["DAPT", "ticagrelor", "aspirin", "minor stroke", "TIA"]
    },
    {
      name: "SOCRATES",
      fullTitle: "Acute Stroke or Transient Ischaemic Attack Treated with Aspirin or Ticagrelor and Patient Outcomes",
      year: 2016,
      journal: "New England Journal of Medicine",
      pmid: "27428468",
      design: "Phase 3 RCT, double-blind, double-dummy",
      n: 13199,
      population: "Non-cardioembolic ischemic stroke (NIHSS <=5) or high-risk TIA within 24 hours",
      intervention: "Ticagrelor 90 mg BID (monotherapy after day 1 loading with aspirin)",
      comparator: "Aspirin 100 mg daily",
      primaryOutcome: {
        measure: "Stroke, MI, or death at 90 days",
        result: "HR 0.89",
        ci: "0.78-1.01",
        pValue: "p=0.07"
      },
      keySecondary: [
        "Ischemic stroke: HR 0.87 (0.76-1.00)",
        "Similar bleeding rates"
      ],
      significance: "Ticagrelor monotherapy was not superior to aspirin in acute minor stroke or TIA. Led to the design of THALES, which tested ticagrelor plus aspirin instead.",
      category: "antiplatelets",
      tags: ["ticagrelor", "aspirin", "minor stroke", "TIA", "negative trial"]
    },

    // ==========================================
    // ANTICOAGULATION TRIALS
    // ==========================================
    {
      name: "RE-LY",
      fullTitle: "Randomized Evaluation of Long-Term Anticoagulation Therapy",
      year: 2009,
      journal: "New England Journal of Medicine",
      pmid: "19717844",
      design: "Phase 3 RCT, PROBE design (open-label dabigatran, blinded warfarin)",
      n: 18113,
      population: "Non-valvular atrial fibrillation with >=1 stroke risk factor",
      intervention: "Dabigatran 110 mg or 150 mg BID",
      comparator: "Warfarin (target INR 2.0-3.0)",
      primaryOutcome: {
        measure: "Stroke or systemic embolism",
        result: "1.53%/yr (110mg) and 1.11%/yr (150mg) vs 1.69%/yr (warfarin)",
        pValue: "p<0.001 for noninferiority (110mg); p<0.001 for superiority (150mg)"
      },
      keySecondary: [
        "150mg: lower ischemic stroke, similar major bleeding",
        "110mg: similar stroke, less major bleeding"
      ],
      significance: "First trial of a DOAC vs warfarin in AF. Dabigatran 150mg was superior for stroke prevention; 110mg was noninferior with less bleeding. Launched the DOAC era.",
      category: "anticoagulation",
      tags: ["DOAC", "dabigatran", "warfarin", "atrial fibrillation", "landmark"]
    },
    {
      name: "ROCKET AF",
      fullTitle: "Rivaroxaban Once Daily Oral Direct Factor Xa Inhibition Compared with Vitamin K Antagonism for Prevention of Stroke and Embolism Trial in Atrial Fibrillation",
      year: 2011,
      journal: "New England Journal of Medicine",
      pmid: "21830957",
      design: "Phase 3 RCT, double-blind, double-dummy",
      n: 14264,
      population: "Non-valvular atrial fibrillation with moderate-to-high stroke risk (CHADS2 >=2)",
      intervention: "Rivaroxaban 20 mg daily (15 mg if CrCl 30-49 mL/min)",
      comparator: "Warfarin (target INR 2.0-3.0)",
      primaryOutcome: {
        measure: "Stroke or systemic embolism",
        result: "HR 0.79",
        ci: "0.66-0.96",
        pValue: "p<0.001 for noninferiority; p=0.02 for superiority (on-treatment)"
      },
      keySecondary: [
        "Less intracranial hemorrhage with rivaroxaban",
        "Similar major bleeding overall"
      ],
      significance: "Rivaroxaban was noninferior to warfarin for stroke prevention in AF, with less intracranial hemorrhage. Became the second DOAC approved for AF.",
      category: "anticoagulation",
      tags: ["DOAC", "rivaroxaban", "warfarin", "atrial fibrillation"]
    },
    {
      name: "ARISTOTLE",
      fullTitle: "Apixaban for Reduction in Stroke and Other Thromboembolic Events in Atrial Fibrillation",
      year: 2011,
      journal: "New England Journal of Medicine",
      pmid: "21870978",
      design: "Phase 3 RCT, double-blind, double-dummy",
      n: 18201,
      population: "Non-valvular atrial fibrillation with >=1 stroke risk factor",
      intervention: "Apixaban 5 mg BID (2.5 mg BID for select patients)",
      comparator: "Warfarin (target INR 2.0-3.0)",
      primaryOutcome: {
        measure: "Stroke or systemic embolism",
        result: "HR 0.79",
        ci: "0.66-0.95",
        pValue: "p=0.01 for superiority"
      },
      keySecondary: [
        "Major bleeding reduced (HR 0.69, p<0.001)",
        "All-cause mortality reduced (HR 0.89, p=0.047)"
      ],
      significance: "Apixaban was superior to warfarin for both efficacy and safety. Only DOAC to show superiority vs warfarin in stroke prevention, major bleeding, AND mortality.",
      category: "anticoagulation",
      tags: ["DOAC", "apixaban", "warfarin", "atrial fibrillation", "landmark"]
    },
    {
      name: "ENGAGE AF-TIMI 48",
      fullTitle: "Effective Anticoagulation with Factor Xa Next Generation in Atrial Fibrillation - Thrombolysis in Myocardial Infarction 48",
      year: 2013,
      journal: "New England Journal of Medicine",
      pmid: "24251359",
      design: "Phase 3 RCT, double-blind, double-dummy",
      n: 21105,
      population: "Non-valvular atrial fibrillation with CHADS2 >=2",
      intervention: "Edoxaban 60 mg or 30 mg daily",
      comparator: "Warfarin (target INR 2.0-3.0)",
      primaryOutcome: {
        measure: "Stroke or systemic embolism",
        result: "HR 0.79 (60mg) and 1.07 (30mg) vs warfarin",
        pValue: "p<0.001 for noninferiority (both doses)"
      },
      keySecondary: [
        "Both doses had significantly less bleeding than warfarin",
        "Less intracranial hemorrhage and cardiovascular death"
      ],
      significance: "Edoxaban at both doses was noninferior to warfarin with less bleeding. Completed the quartet of major DOAC trials that transformed anticoagulation for AF.",
      category: "anticoagulation",
      tags: ["DOAC", "edoxaban", "warfarin", "atrial fibrillation"]
    },
    {
      name: "NAVIGATE ESUS",
      fullTitle: "New Approach Rivaroxaban Inhibition of Factor Xa in a Global Trial vs ASA to Prevent Embolism in Embolic Stroke of Undetermined Source",
      year: 2018,
      journal: "New England Journal of Medicine",
      pmid: "29766772",
      design: "Phase 3 RCT, double-blind, double-dummy",
      n: 7213,
      population: "Recent embolic stroke of undetermined source (ESUS) within 7 days to 6 months",
      intervention: "Rivaroxaban 15 mg daily",
      comparator: "Aspirin 100 mg daily",
      primaryOutcome: {
        measure: "Recurrent stroke or systemic embolism",
        result: "HR 1.07",
        ci: "0.87-1.33",
        pValue: "p=0.52"
      },
      keySecondary: [
        "More major bleeding with rivaroxaban (1.8% vs 0.7%/yr)",
        "Trial stopped early for futility"
      ],
      significance: "Rivaroxaban was not superior to aspirin for secondary prevention after ESUS but caused more bleeding. Challenged the concept of ESUS as a primarily embolic entity.",
      category: "anticoagulation",
      tags: ["ESUS", "rivaroxaban", "aspirin", "negative trial", "cryptogenic stroke"]
    },
    {
      name: "RE-SPECT ESUS",
      fullTitle: "Randomized, Double-Blind, Evaluation in Secondary Stroke Prevention Comparing the Efficacy and Safety of the Oral Thrombin Inhibitor Dabigatran Etexilate vs Acetylsalicylic Acid in Patients with Embolic Stroke of Undetermined Source",
      year: 2019,
      journal: "New England Journal of Medicine",
      pmid: "31178150",
      design: "Phase 3 RCT, double-blind, double-dummy",
      n: 5390,
      population: "Embolic stroke of undetermined source within 3 months",
      intervention: "Dabigatran 150 mg or 110 mg BID",
      comparator: "Aspirin 100 mg daily",
      primaryOutcome: {
        measure: "Recurrent stroke",
        result: "HR 0.85",
        ci: "0.69-1.03",
        pValue: "p=0.10"
      },
      keySecondary: [
        "Numerically fewer ischemic strokes with dabigatran",
        "No significant difference in major bleeding"
      ],
      significance: "Second negative ESUS trial. Dabigatran showed a trend toward benefit but was not significant. Together with NAVIGATE ESUS, ended the empiric anticoagulation approach for ESUS.",
      category: "anticoagulation",
      tags: ["ESUS", "dabigatran", "aspirin", "negative trial", "cryptogenic stroke"]
    },
    {
      name: "COMPASS",
      fullTitle: "Cardiovascular Outcomes for People Using Anticoagulation Strategies",
      year: 2017,
      journal: "New England Journal of Medicine",
      pmid: "28844192",
      design: "Phase 3 RCT, double-blind",
      n: 27395,
      population: "Stable atherosclerotic vascular disease (CAD or PAD)",
      intervention: "Rivaroxaban 2.5 mg BID + aspirin 100 mg daily",
      comparator: "Aspirin 100 mg daily alone",
      primaryOutcome: {
        measure: "CV death, stroke, or MI",
        result: "HR 0.76",
        ci: "0.66-0.86",
        pValue: "p<0.001"
      },
      keySecondary: [
        "Stroke reduced by 42% (HR 0.58)",
        "Major bleeding higher (HR 1.70) but no increase in fatal bleeding"
      ],
      significance: "Low-dose rivaroxaban plus aspirin reduced cardiovascular events including stroke in stable atherosclerosis. Established the dual-pathway inhibition strategy.",
      category: "anticoagulation",
      tags: ["rivaroxaban", "aspirin", "dual pathway", "atherosclerosis", "vascular"]
    },
    {
      name: "WARSS",
      fullTitle: "Warfarin-Aspirin Recurrent Stroke Study",
      year: 2001,
      journal: "New England Journal of Medicine",
      pmid: "11572048",
      design: "Phase 3 RCT, double-blind",
      n: 2206,
      population: "Non-cardioembolic ischemic stroke within 30 days",
      intervention: "Warfarin (target INR 1.4-2.8)",
      comparator: "Aspirin 325 mg daily",
      primaryOutcome: {
        measure: "Recurrent ischemic stroke or death within 2 years",
        result: "HR 1.13",
        ci: "0.92-1.38",
        pValue: "p=0.25"
      },
      keySecondary: [
        "Major hemorrhage rates similar",
        "No subgroup benefited from warfarin"
      ],
      significance: "Warfarin was not superior to aspirin for secondary stroke prevention in non-cardioembolic stroke. Established aspirin as standard for non-cardioembolic ischemic stroke prevention.",
      category: "anticoagulation",
      tags: ["warfarin", "aspirin", "secondary prevention", "non-cardioembolic"]
    },

    // ==========================================
    // PFO TRIALS
    // ==========================================
    {
      name: "CLOSURE I",
      fullTitle: "Evaluation of the STARFlex Septal Closure System in Patients after Stroke or Transient Ischemic Attack due to Presumed Paradoxical Embolism through a Patent Foramen Ovale",
      year: 2012,
      journal: "New England Journal of Medicine",
      pmid: "22417252",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 909,
      population: "Cryptogenic stroke or TIA with PFO, age 18-60",
      intervention: "PFO closure with STARFlex device + medical therapy",
      comparator: "Medical therapy alone (antiplatelet or anticoagulation)",
      primaryOutcome: {
        measure: "Stroke or TIA within 2 years, or all-cause mortality within 30 days",
        result: "5.5% vs 6.8%",
        ci: "HR 0.78 (0.45-1.35)",
        pValue: "p=0.37"
      },
      keySecondary: [
        "No difference in stroke alone",
        "Higher rate of atrial fibrillation with closure (5.7% vs 0.7%)"
      ],
      significance: "First PFO closure RCT was negative, likely due to the inferior STARFlex device and broad inclusion criteria. Led to design improvements in subsequent trials.",
      category: "pfo",
      tags: ["PFO", "closure", "cryptogenic stroke", "STARFlex", "negative trial"]
    },
    {
      name: "REDUCE",
      fullTitle: "REDUCE: Patent Foramen Ovale Closure or Antiplatelet Therapy for Cryptogenic Stroke",
      year: 2017,
      journal: "New England Journal of Medicine",
      pmid: "28885193",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 664,
      population: "Cryptogenic stroke with PFO, age 18-59",
      intervention: "PFO closure (HELEX or Cardioform device) + antiplatelet therapy",
      comparator: "Antiplatelet therapy alone",
      primaryOutcome: {
        measure: "Freedom from clinical recurrent ischemic stroke",
        result: "1.4% vs 5.4%",
        ci: "HR 0.23 (0.09-0.62)",
        pValue: "p=0.002"
      },
      keySecondary: [
        "New brain infarcts on MRI reduced (5.7% vs 11.3%)",
        "Higher rate of new-onset atrial fibrillation with closure"
      ],
      significance: "Demonstrated significant reduction in recurrent stroke with PFO closure. Along with CLOSE, provided strong evidence supporting PFO closure in appropriately selected patients.",
      category: "pfo",
      tags: ["PFO", "closure", "cryptogenic stroke", "HELEX", "positive trial"]
    },
    {
      name: "CLOSE",
      fullTitle: "Patent Foramen Ovale Closure or Anticoagulants vs Antiplatelets After Stroke",
      year: 2017,
      journal: "New England Journal of Medicine",
      pmid: "28885191",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 663,
      population: "Cryptogenic stroke with PFO and atrial septal aneurysm or large shunt, age 16-60",
      intervention: "PFO closure + antiplatelet therapy",
      comparator: "Antiplatelet therapy alone (separate anticoagulant arm)",
      primaryOutcome: {
        measure: "Fatal or nonfatal stroke",
        result: "0% vs 6.0%",
        ci: "HR not calculable (no events in closure group)",
        pValue: "p<0.001"
      },
      keySecondary: [
        "Higher procedural atrial fibrillation (4.6% vs 0.9%)",
        "Anticoagulant arm: no strokes (0% vs 1.5% antiplatelet)"
      ],
      significance: "Most dramatic PFO trial result with zero strokes in the closure group. Targeted high-risk PFO features (ASA or large shunt), establishing PFO closure as standard of care in this population.",
      category: "pfo",
      tags: ["PFO", "closure", "cryptogenic stroke", "atrial septal aneurysm", "landmark"]
    },
    {
      name: "DEFENSE-PFO",
      fullTitle: "Device Closure Versus Medical Therapy for Cryptogenic Stroke Patients with High-Risk Patent Foramen Ovale",
      year: 2018,
      journal: "Journal of the American College of Cardiology",
      pmid: "29866739",
      design: "Phase 3 RCT, open-label",
      n: 120,
      population: "Cryptogenic stroke with high-risk PFO (ASA, hypermobility, or large shunt) within 6 months",
      intervention: "PFO closure (Amplatzer device) + medical therapy",
      comparator: "Medical therapy alone",
      primaryOutcome: {
        measure: "Composite of stroke, vascular death, or major bleeding at 2 years",
        result: "0% vs 12.9%",
        pValue: "p=0.013"
      },
      keySecondary: [
        "6 events in medical group vs 0 in closure group",
        "All events in medical group were recurrent strokes"
      ],
      significance: "Small but significant Korean trial supporting PFO closure in high-risk PFO patients. Consistent with CLOSE and REDUCE, reinforcing benefit in high-risk anatomies.",
      category: "pfo",
      tags: ["PFO", "closure", "cryptogenic stroke", "Amplatzer", "Korean"]
    },

    // ==========================================
    // SECONDARY PREVENTION TRIALS
    // ==========================================
    {
      name: "SPS3",
      fullTitle: "Secondary Prevention of Small Subcortical Strokes Trial",
      year: 2012,
      journal: "New England Journal of Medicine",
      pmid: "22894573",
      design: "Phase 3 RCT, 2x2 factorial (antiplatelet component and BP component)",
      n: 3020,
      population: "Recent symptomatic lacunar stroke confirmed on MRI",
      intervention: "Aspirin + clopidogrel (DAPT) and/or intensive BP lowering (SBP <130)",
      comparator: "Aspirin alone and/or usual BP lowering (SBP 130-149)",
      primaryOutcome: {
        measure: "Recurrent stroke (antiplatelet arm)",
        result: "HR 0.92",
        ci: "0.72-1.16",
        pValue: "p=0.48"
      },
      keySecondary: [
        "DAPT increased major hemorrhage (HR 1.97)",
        "DAPT arm stopped early for harm and futility"
      ],
      significance: "DAPT did not reduce recurrent lacunar stroke vs aspirin alone and increased bleeding. Intensive BP arm showed non-significant 19% stroke reduction, supporting lower BP targets.",
      category: "secondary-prevention",
      tags: ["lacunar stroke", "DAPT", "blood pressure", "small vessel disease"]
    },
    {
      name: "SPRINT",
      fullTitle: "Systolic Blood Pressure Intervention Trial",
      year: 2015,
      journal: "New England Journal of Medicine",
      pmid: "26551272",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 9361,
      population: "Adults >=50 years, SBP 130-180 mmHg, high CV risk (NOT including prior stroke or diabetes)",
      intervention: "Intensive BP lowering (target SBP <120 mmHg)",
      comparator: "Standard BP lowering (target SBP <140 mmHg)",
      primaryOutcome: {
        measure: "Composite of MI, ACS, stroke, HF, or CV death",
        result: "HR 0.75",
        ci: "0.64-0.89",
        pValue: "p<0.001"
      },
      keySecondary: [
        "All-cause mortality reduced (HR 0.73)",
        "Higher rates of hypotension, syncope, and AKI in intensive group"
      ],
      significance: "Landmark trial showing intensive BP lowering to <120 mmHg reduced cardiovascular events and mortality. Influenced BP guidelines globally, though did not include stroke patients.",
      category: "secondary-prevention",
      tags: ["blood pressure", "hypertension", "intensive treatment", "cardiovascular"]
    },
    {
      name: "PROGRESS",
      fullTitle: "Perindopril Protection Against Recurrent Stroke Study",
      year: 2001,
      journal: "The Lancet",
      pmid: "11560996",
      design: "Phase 3 RCT, double-blind, placebo-controlled",
      n: 6105,
      population: "History of stroke or TIA (hypertensive or normotensive) within 5 years",
      intervention: "Perindopril 4 mg daily +/- indapamide 2.5 mg daily",
      comparator: "Matching placebo(s)",
      primaryOutcome: {
        measure: "Recurrent stroke",
        result: "HR 0.72 (combination), HR 0.95 (perindopril alone)",
        ci: "0.62-0.83 (combination)",
        pValue: "p<0.001 (combination)"
      },
      keySecondary: [
        "28% risk reduction for total stroke with combination",
        "Major coronary events also reduced"
      ],
      significance: "Demonstrated that BP lowering after stroke reduces recurrence. Combination therapy (ACE inhibitor + diuretic) was effective; monotherapy was not. Cornerstone of secondary stroke prevention.",
      category: "secondary-prevention",
      tags: ["blood pressure", "ACE inhibitor", "perindopril", "secondary prevention", "landmark"]
    },
    {
      name: "SPARCL",
      fullTitle: "Stroke Prevention by Aggressive Reduction in Cholesterol Levels",
      year: 2006,
      journal: "New England Journal of Medicine",
      pmid: "16899775",
      design: "Phase 3 RCT, double-blind, placebo-controlled",
      n: 4731,
      population: "Recent stroke or TIA within 6 months, no known CAD, LDL 100-190 mg/dL",
      intervention: "Atorvastatin 80 mg daily",
      comparator: "Placebo",
      primaryOutcome: {
        measure: "Fatal or nonfatal stroke",
        result: "HR 0.84",
        ci: "0.71-0.99",
        pValue: "p=0.03"
      },
      keySecondary: [
        "Major cardiovascular events reduced (HR 0.80)",
        "Small increase in hemorrhagic stroke (HR 1.66, 55 vs 33)"
      ],
      significance: "First trial to show that high-dose statin therapy reduces recurrent stroke. Established statins as a key secondary prevention treatment after ischemic stroke/TIA.",
      category: "secondary-prevention",
      tags: ["statin", "atorvastatin", "cholesterol", "secondary prevention", "landmark"]
    },
    {
      name: "IRIS",
      fullTitle: "Insulin Resistance Intervention after Stroke",
      year: 2016,
      journal: "New England Journal of Medicine",
      pmid: "26886418",
      design: "Phase 3 RCT, double-blind, placebo-controlled",
      n: 3876,
      population: "Recent ischemic stroke or TIA (within 6 months) with insulin resistance (HOMA-IR >3.0) but no diabetes",
      intervention: "Pioglitazone 45 mg daily",
      comparator: "Placebo",
      primaryOutcome: {
        measure: "Fatal or nonfatal stroke or MI",
        result: "HR 0.76",
        ci: "0.62-0.93",
        pValue: "p=0.007"
      },
      keySecondary: [
        "Diabetes incidence reduced by 52%",
        "Weight gain and edema more common with pioglitazone"
      ],
      significance: "Pioglitazone reduced recurrent stroke and MI in insulin-resistant non-diabetic stroke patients. Highlighted metabolic risk as a modifiable target in secondary prevention.",
      category: "secondary-prevention",
      tags: ["pioglitazone", "insulin resistance", "metabolic", "secondary prevention"]
    },
    {
      name: "SAMMPRIS",
      fullTitle: "Stenting and Aggressive Medical Management for Preventing Recurrent Stroke in Intracranial Stenosis",
      year: 2011,
      journal: "New England Journal of Medicine",
      pmid: "21899409",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 451,
      population: "Recent TIA or stroke (within 30 days) attributed to 70-99% intracranial arterial stenosis",
      intervention: "Wingspan stenting + aggressive medical management",
      comparator: "Aggressive medical management alone (DAPT, statin, BP/lifestyle targets)",
      primaryOutcome: {
        measure: "Stroke or death within 30 days, or ipsilateral stroke within 12 months",
        result: "14.7% vs 5.8%",
        pValue: "p=0.002 favoring medical management"
      },
      keySecondary: [
        "Periprocedural stroke/death rate 14.7% with stenting",
        "Medical therapy alone performed better than expected"
      ],
      significance: "Intracranial stenting was inferior to aggressive medical management alone. Established aggressive medical therapy (DAPT, statin, BP control) as standard for intracranial stenosis.",
      category: "secondary-prevention",
      tags: ["intracranial stenosis", "stenting", "Wingspan", "medical management", "negative for stenting"]
    },
    {
      name: "COSS",
      fullTitle: "Carotid Occlusion Surgery Study",
      year: 2011,
      journal: "JAMA",
      pmid: "22068992",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 195,
      population: "Symptomatic carotid occlusion with hemodynamic compromise (increased OEF on PET)",
      intervention: "EC-IC bypass surgery + medical management",
      comparator: "Medical management alone",
      primaryOutcome: {
        measure: "Ipsilateral ischemic stroke within 2 years",
        result: "21.0% vs 22.7%",
        pValue: "p=0.78"
      },
      keySecondary: [
        "Perioperative stroke rate 14.4%",
        "Surgical group normalized OEF"
      ],
      significance: "EC-IC bypass did not reduce stroke despite improving hemodynamics. The high perioperative complication rate negated any long-term benefit. Effectively ended routine EC-IC bypass for carotid occlusion.",
      category: "secondary-prevention",
      tags: ["EC-IC bypass", "carotid occlusion", "hemodynamic", "PET", "negative trial"]
    },
    {
      name: "WASID",
      fullTitle: "Warfarin-Aspirin Symptomatic Intracranial Disease Study",
      year: 2005,
      journal: "New England Journal of Medicine",
      pmid: "15758000",
      design: "Phase 3 RCT, double-blind",
      n: 569,
      population: "TIA or stroke due to 50-99% intracranial arterial stenosis within 90 days",
      intervention: "Warfarin (target INR 2.0-3.0)",
      comparator: "Aspirin 1300 mg daily",
      primaryOutcome: {
        measure: "Ischemic stroke, brain hemorrhage, or vascular death",
        result: "HR 1.04",
        ci: "0.73-1.48",
        pValue: "p=0.83"
      },
      keySecondary: [
        "Warfarin associated with more adverse events",
        "Trial stopped early for safety concerns"
      ],
      significance: "Warfarin was not superior to aspirin for intracranial stenosis and was associated with more complications. Established antiplatelet therapy as standard for intracranial atherosclerosis.",
      category: "secondary-prevention",
      tags: ["intracranial stenosis", "warfarin", "aspirin", "negative trial"]
    },

    // ==========================================
    // CAROTID TRIALS
    // ==========================================
    {
      name: "NASCET",
      fullTitle: "North American Symptomatic Carotid Endarterectomy Trial",
      year: 1991,
      journal: "New England Journal of Medicine",
      pmid: "1852179",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 659,
      population: "Symptomatic carotid stenosis 70-99% (ipsilateral TIA or stroke within 120 days)",
      intervention: "Carotid endarterectomy (CEA) + medical management",
      comparator: "Medical management alone",
      primaryOutcome: {
        measure: "Ipsilateral stroke at 2 years",
        result: "9% vs 26%",
        ci: "ARR 17%",
        pValue: "p<0.001"
      },
      keySecondary: [
        "Perioperative stroke/death rate 5.8%",
        "NNT = 6 over 2 years for severe stenosis"
      ],
      significance: "Landmark trial establishing CEA as standard of care for symptomatic severe (70-99%) carotid stenosis. One of the most influential surgical trials in stroke prevention.",
      category: "carotid",
      tags: ["CEA", "endarterectomy", "carotid stenosis", "symptomatic", "landmark"]
    },
    {
      name: "ECST",
      fullTitle: "European Carotid Surgery Trial",
      year: 1998,
      journal: "The Lancet",
      pmid: "9622188",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 3024,
      population: "Symptomatic carotid stenosis (TIA, minor stroke, or retinal ischemia within 6 months)",
      intervention: "Carotid endarterectomy (CEA) + medical management",
      comparator: "Medical management alone",
      primaryOutcome: {
        measure: "Major stroke or surgical death at 3 years",
        result: "Benefit for >80% stenosis (ECST method); no benefit for <30%",
        pValue: "p<0.001 for severe stenosis"
      },
      keySecondary: [
        "Surgery harmful for mild stenosis",
        "Similar results to NASCET when measurement methods harmonized"
      ],
      significance: "Confirmed NASCET findings that CEA benefits patients with severe symptomatic carotid stenosis. Together with NASCET, defined the evidence base for carotid surgery.",
      category: "carotid",
      tags: ["CEA", "endarterectomy", "carotid stenosis", "symptomatic", "European"]
    },
    {
      name: "ACST",
      fullTitle: "Asymptomatic Carotid Surgery Trial",
      year: 2004,
      journal: "The Lancet",
      pmid: "15135594",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 3120,
      population: "Asymptomatic carotid stenosis >=60% (no ipsilateral symptoms within 6 months)",
      intervention: "Immediate carotid endarterectomy (CEA) + medical management",
      comparator: "Deferred CEA (surgery only if symptoms developed) + medical management",
      primaryOutcome: {
        measure: "Any stroke or perioperative death at 5 years",
        result: "6.4% vs 11.8%",
        ci: "ARR 5.4%",
        pValue: "p<0.0001"
      },
      keySecondary: [
        "Perioperative stroke/death 3.1%",
        "Benefit mainly in patients <75 years"
      ],
      significance: "Demonstrated benefit of CEA for asymptomatic carotid stenosis >=60%. However, subsequent medical advances led to debate about continued relevance given improved medical therapy.",
      category: "carotid",
      tags: ["CEA", "endarterectomy", "carotid stenosis", "asymptomatic"]
    },
    {
      name: "CREST",
      fullTitle: "Carotid Revascularization Endarterectomy vs Stenting Trial",
      year: 2010,
      journal: "New England Journal of Medicine",
      pmid: "20505173",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 2502,
      population: "Symptomatic carotid stenosis >=50% or asymptomatic stenosis >=60%",
      intervention: "Carotid artery stenting (CAS) with embolic protection",
      comparator: "Carotid endarterectomy (CEA)",
      primaryOutcome: {
        measure: "Composite of periprocedural stroke, MI, death, or ipsilateral stroke at 4 years",
        result: "7.2% vs 6.8%",
        ci: "HR 1.10 (0.83-1.44)",
        pValue: "p=0.51"
      },
      keySecondary: [
        "CAS had higher periprocedural stroke rate (4.1% vs 2.3%)",
        "CEA had higher periprocedural MI rate (2.3% vs 1.1%)"
      ],
      significance: "No significant difference in composite outcomes between CAS and CEA. CAS had more strokes; CEA had more MIs. Age influenced treatment effect (younger favored CAS).",
      category: "carotid",
      tags: ["CAS", "stenting", "CEA", "endarterectomy", "carotid stenosis"]
    },
    {
      name: "ACT-1",
      fullTitle: "Asymptomatic Carotid Trial 1",
      year: 2016,
      journal: "New England Journal of Medicine",
      pmid: "27959613",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 328,
      population: "Asymptomatic carotid stenosis >=70% on duplex, age <80",
      intervention: "Carotid artery stenting (CAS) with embolic protection",
      comparator: "Carotid endarterectomy (CEA)",
      primaryOutcome: {
        measure: "Composite of death, stroke, or MI within 30 days plus ipsilateral stroke within 5 years",
        result: "3.8% vs 3.4%",
        pValue: "Noninferiority met (p=0.01)"
      },
      keySecondary: [
        "Low event rates in both groups",
        "Underpowered due to slow enrollment"
      ],
      significance: "CAS was noninferior to CEA in asymptomatic carotid stenosis. However, the trial was underpowered due to slow enrollment and evolving medical management.",
      category: "carotid",
      tags: ["CAS", "stenting", "CEA", "asymptomatic", "noninferiority"]
    },
    {
      name: "SPACE",
      fullTitle: "Stent-Protected Angioplasty versus Carotid Endarterectomy",
      year: 2006,
      journal: "The Lancet",
      pmid: "17027730",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 1200,
      population: "Symptomatic carotid stenosis >=50% (NASCET criteria) with TIA or stroke within 180 days",
      intervention: "Carotid artery stenting (CAS)",
      comparator: "Carotid endarterectomy (CEA)",
      primaryOutcome: {
        measure: "Ipsilateral stroke or death within 30 days",
        result: "6.84% vs 6.34%",
        ci: "Absolute difference 0.51% (-1.89 to 2.91)",
        pValue: "Noninferiority not established (p=0.09)"
      },
      keySecondary: [
        "Only 27% of CAS used embolic protection devices",
        "No difference in outcome at 2 years"
      ],
      significance: "CAS failed to demonstrate noninferiority to CEA. Low use of embolic protection devices may have contributed. Supported CEA as the preferred approach for symptomatic stenosis.",
      category: "carotid",
      tags: ["CAS", "stenting", "CEA", "symptomatic", "noninferiority failed"]
    },
    {
      name: "EVA-3S",
      fullTitle: "Endarterectomy Versus Angioplasty in Patients with Symptomatic Severe Carotid Stenosis",
      year: 2006,
      journal: "New England Journal of Medicine",
      pmid: "17050890",
      design: "Phase 3 RCT, open-label",
      n: 527,
      population: "Symptomatic carotid stenosis >=60% within 120 days",
      intervention: "Carotid artery stenting (CAS)",
      comparator: "Carotid endarterectomy (CEA)",
      primaryOutcome: {
        measure: "Any stroke or death within 30 days",
        result: "9.6% vs 3.9%",
        ci: "RR 2.5 (1.2-5.1)",
        pValue: "p=0.01"
      },
      keySecondary: [
        "Trial stopped early for safety",
        "CAS risk especially high in patients not using embolic protection"
      ],
      significance: "CAS was inferior to CEA with higher 30-day stroke and death rates. Stopped early for safety. Reinforced CEA as the preferred treatment for symptomatic carotid stenosis.",
      category: "carotid",
      tags: ["CAS", "stenting", "CEA", "symptomatic", "safety concern"]
    },
    {
      name: "ACST-2",
      fullTitle: "Asymptomatic Carotid Surgery Trial 2",
      year: 2021,
      journal: "The Lancet",
      pmid: "34469763",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 3625,
      population: "Asymptomatic carotid stenosis >=60% where both CEA and CAS were considered suitable",
      intervention: "Carotid artery stenting (CAS)",
      comparator: "Carotid endarterectomy (CEA)",
      primaryOutcome: {
        measure: "Procedural stroke/death plus any subsequent non-procedural stroke at 5 years",
        result: "3.7% vs 3.2%",
        pValue: "p=0.53"
      },
      keySecondary: [
        "Procedural stroke/death similar (1.0% vs 0.9%)",
        "Very low annual stroke rates in both groups"
      ],
      significance: "CAS and CEA had equivalent outcomes in asymptomatic stenosis with modern techniques. Both had very low complication rates, raising questions about whether either beats medical therapy alone.",
      category: "carotid",
      tags: ["CAS", "stenting", "CEA", "asymptomatic", "equivalence"]
    },

    // ==========================================
    // DECOMPRESSIVE SURGERY TRIALS
    // ==========================================
    {
      name: "DESTINY",
      fullTitle: "Decompressive Surgery for the Treatment of Malignant Infarction of the Middle Cerebral Artery",
      year: 2007,
      journal: "Stroke",
      pmid: "17272757",
      design: "Phase 2 RCT, open-label",
      n: 32,
      population: "Malignant MCA infarction within 12-36 hours, age 18-60",
      intervention: "Decompressive hemicraniectomy within 36 hours",
      comparator: "Conservative medical management",
      primaryOutcome: {
        measure: "mRS <=3 at 6 months (original); revised to mortality",
        result: "Mortality 12% vs 53%",
        pValue: "p=0.02"
      },
      keySecondary: [
        "88% survival in surgery vs 47% in control",
        "Many survivors had moderate-severe disability"
      ],
      significance: "One of three pooled European RCTs (with DECIMAL and HAMLET) showing decompressive hemicraniectomy dramatically reduces mortality in malignant MCA infarction under age 60.",
      category: "decompressive",
      tags: ["hemicraniectomy", "malignant MCA", "decompressive surgery", "young"]
    },
    {
      name: "DESTINY II",
      fullTitle: "Decompressive Surgery for the Treatment of Malignant Infarction of the Middle Cerebral Artery II",
      year: 2014,
      journal: "New England Journal of Medicine",
      pmid: "24382066",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 112,
      population: "Malignant MCA infarction within 48 hours, age >60 years",
      intervention: "Decompressive hemicraniectomy within 48 hours",
      comparator: "Conservative medical management",
      primaryOutcome: {
        measure: "Survival without severe disability (mRS 0-4) at 6 months",
        result: "38% vs 18%",
        ci: "OR 2.91 (1.10-7.70)",
        pValue: "p=0.03"
      },
      keySecondary: [
        "Mortality 33% vs 70%",
        "mRS 5 (severe disability) in 32% of surgery survivors"
      ],
      significance: "Hemicraniectomy reduced mortality in patients >60 but many survivors had severe disability (mRS 5). Raised critical ethical questions about quality of life and shared decision-making.",
      category: "decompressive",
      tags: ["hemicraniectomy", "malignant MCA", "elderly", "quality of life"]
    },
    {
      name: "DECIMAL",
      fullTitle: "Decompressive Craniectomy in Malignant Middle Cerebral Artery Infarcts",
      year: 2007,
      journal: "Stroke",
      pmid: "17272761",
      design: "Phase 3 RCT, open-label",
      n: 38,
      population: "Malignant MCA infarction within 24 hours, age 18-55, infarct >50% MCA territory",
      intervention: "Decompressive hemicraniectomy within 30 hours",
      comparator: "Conservative medical management",
      primaryOutcome: {
        measure: "mRS <=3 at 6 months",
        result: "25% vs 5.6%",
        pValue: "p not significant (underpowered)"
      },
      keySecondary: [
        "Mortality 25% vs 78% (p<0.001)",
        "Contributed to pooled analysis proving mortality benefit"
      ],
      significance: "Small French trial that, together with DESTINY and HAMLET, provided data for the landmark pooled analysis confirming that early hemicraniectomy reduces mortality in malignant MCA infarction.",
      category: "decompressive",
      tags: ["hemicraniectomy", "malignant MCA", "decompressive surgery", "French"]
    },
    {
      name: "HAMLET",
      fullTitle: "Hemicraniectomy After Middle Cerebral Artery Infarction with Life-Threatening Edema Trial",
      year: 2009,
      journal: "The Lancet Neurology",
      pmid: "19541235",
      design: "Phase 3 RCT, open-label",
      n: 64,
      population: "Space-occupying MCA infarction within 4 days, age 18-60",
      intervention: "Decompressive hemicraniectomy within 96 hours",
      comparator: "Conservative medical management",
      primaryOutcome: {
        measure: "mRS <=3 at 1 year",
        result: "25% vs 25%",
        pValue: "p=0.99"
      },
      keySecondary: [
        "Mortality reduced (22% vs 59%, p=0.002)",
        "Surgery after 48 hours appeared less effective"
      ],
      significance: "No functional outcome benefit when surgery extended to 96 hours, but mortality still reduced. Supported the 48-hour window from pooled analysis of earlier trials.",
      category: "decompressive",
      tags: ["hemicraniectomy", "malignant MCA", "extended window", "Dutch"]
    },

    // ==========================================
    // NEUROPROTECTION TRIALS
    // ==========================================
    {
      name: "RIGHT-2",
      fullTitle: "Rapid Intervention with Glyceryl Trinitrate in Hypertensive Stroke Trial 2",
      year: 2019,
      journal: "The Lancet",
      pmid: "30738314",
      design: "Phase 3 RCT, single-blind (sham-controlled)",
      n: 1149,
      population: "Ultra-acute stroke (within 4 hours) with SBP >=120 mmHg in the prefacility setting",
      intervention: "Transdermal glyceryl trinitrate (GTN) 5 mg patch",
      comparator: "Sham patch",
      primaryOutcome: {
        measure: "mRS distribution (ordinal shift) at 90 days",
        result: "Adjusted OR 1.25",
        ci: "0.97-1.60",
        pValue: "p=0.083"
      },
      keySecondary: [
        "BP lowered by ~6 mmHg with GTN",
        "No benefit in any subgroup"
      ],
      significance: "Prefacility GTN for blood pressure lowering did not improve outcomes in ultra-acute stroke. Highlights the difficulty of prefacility neuroprotection trials.",
      category: "neuroprotection",
      tags: ["neuroprotection", "GTN", "prefacility", "blood pressure", "negative trial"]
    },
    {
      name: "FAST-MAG",
      fullTitle: "Field Administration of Stroke Therapy - Magnesium",
      year: 2015,
      journal: "The Lancet Neurology",
      pmid: "25544691",
      design: "Phase 3 RCT, double-blind, placebo-controlled",
      n: 1700,
      population: "Suspected stroke within 2 hours of onset, enrolled in the field by paramedics",
      intervention: "IV magnesium sulfate (4g bolus in field, then 16g over 24h in facility)",
      comparator: "Placebo",
      primaryOutcome: {
        measure: "mRS distribution (ordinal shift) at 90 days",
        result: "No significant difference",
        pValue: "p=0.28"
      },
      keySecondary: [
        "Achieved very early treatment (median 45 min from onset)",
        "Safe and feasible prefacility trial model"
      ],
      significance: "Prefacility magnesium did not improve stroke outcomes despite achieving ultra-early treatment. Proved feasibility of prefacility stroke trials and informed future trial design.",
      category: "neuroprotection",
      tags: ["neuroprotection", "magnesium", "prefacility", "paramedic", "negative trial"]
    },
    {
      name: "SAINT I",
      fullTitle: "Stroke-Acute Ischemic NXY Treatment I",
      year: 2006,
      journal: "New England Journal of Medicine",
      pmid: "16481640",
      design: "Phase 3 RCT, double-blind, placebo-controlled",
      n: 1722,
      population: "Acute ischemic stroke within 6 hours",
      intervention: "NXY-059 (free radical trapping agent) IV infusion for 72 hours",
      comparator: "Placebo",
      primaryOutcome: {
        measure: "mRS distribution (ordinal shift) at 90 days",
        result: "OR 1.20",
        ci: "1.01-1.42",
        pValue: "p=0.045"
      },
      keySecondary: [
        "NIHSS at 90 days not significantly different",
        "No significant safety concerns"
      ],
      significance: "First neuroprotective agent to show a positive primary outcome in acute ischemic stroke. However, the effect was modest and not confirmed in SAINT II.",
      category: "neuroprotection",
      tags: ["neuroprotection", "NXY-059", "free radical", "acute stroke"]
    },
    {
      name: "SAINT II",
      fullTitle: "Stroke-Acute Ischemic NXY Treatment II",
      year: 2008,
      journal: "New England Journal of Medicine",
      pmid: "18843118",
      design: "Phase 3 RCT, double-blind, placebo-controlled",
      n: 3306,
      population: "Acute ischemic stroke within 6 hours",
      intervention: "NXY-059 (free radical trapping agent) IV infusion for 72 hours",
      comparator: "Placebo",
      primaryOutcome: {
        measure: "mRS distribution (ordinal shift) at 90 days",
        result: "OR 0.94",
        ci: "0.83-1.06",
        pValue: "p=0.33"
      },
      keySecondary: [
        "No benefit on any secondary endpoint",
        "SAINT I result not replicated"
      ],
      significance: "Failed to confirm SAINT I results, definitively ending NXY-059 development. Served as a cautionary tale about neuroprotection trials and the importance of replication.",
      category: "neuroprotection",
      tags: ["neuroprotection", "NXY-059", "free radical", "negative trial", "failed replication"]
    },

    // ==========================================
    // OTHER TRIALS
    // ==========================================
    {
      name: "CLOTS 3",
      fullTitle: "Clots in Legs Or sTockings after Stroke 3",
      year: 2013,
      journal: "The Lancet",
      pmid: "23726390",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 2876,
      population: "Immobile patients with acute stroke (ischemic or hemorrhagic)",
      intervention: "Intermittent pneumatic compression (IPC) + routine care",
      comparator: "Routine care alone (no IPC)",
      primaryOutcome: {
        measure: "DVT in proximal veins detected on screening ultrasound",
        result: "8.5% vs 12.1%",
        ci: "OR 0.65 (0.51-0.84)",
        pValue: "p=0.001"
      },
      keySecondary: [
        "Absolute risk reduction 3.6% for proximal DVT",
        "Trend toward reduced mortality at 6 months"
      ],
      significance: "IPC reduced DVT in immobile stroke patients. Along with CLOTS 1 (GCS ineffective), established IPC as the recommended thromboprophylaxis method for acute stroke.",
      category: "other",
      tags: ["DVT", "thromboprophylaxis", "IPC", "immobile stroke"]
    },
    {
      name: "HeadPoST",
      fullTitle: "Head Positioning in Acute Stroke Trial",
      year: 2017,
      journal: "New England Journal of Medicine",
      pmid: "28813702",
      design: "Cluster-randomized crossover trial",
      n: 11093,
      population: "Acute stroke (ischemic or hemorrhagic) within 24 hours of facility admission",
      intervention: "Lying-flat head position (0 degrees) for 24 hours",
      comparator: "Sitting-up head position (>=30 degrees) for 24 hours",
      primaryOutcome: {
        measure: "mRS distribution (ordinal shift) at 90 days",
        result: "Adjusted OR 1.01",
        ci: "0.92-1.10",
        pValue: "p=0.84"
      },
      keySecondary: [
        "No interaction by stroke type",
        "Lying flat was well-tolerated"
      ],
      significance: "No difference in outcome between lying flat and sitting up in acute stroke. Nurses' preference can guide positioning. Resolved a longstanding clinical uncertainty.",
      category: "other",
      tags: ["head positioning", "nursing care", "cluster randomized", "neutral trial"]
    },
    {
      name: "ELAN",
      fullTitle: "Early vs Late Anticoagulation for Stroke with Atrial Fibrillation",
      year: 2023,
      journal: "New England Journal of Medicine",
      pmid: "37222476",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 2013,
      population: "Acute ischemic stroke associated with atrial fibrillation",
      intervention: "Early DOAC initiation (within 48h for minor/moderate; day 6-7 for major stroke)",
      comparator: "Late DOAC initiation (day 3-4 for minor; day 6-7 for moderate; day 12-14 for major stroke)",
      primaryOutcome: {
        measure: "Composite of recurrent ischemic stroke, systemic embolism, major extracranial bleeding, symptomatic ICH, or vascular death within 30 days",
        result: "2.9% vs 4.1%",
        ci: "Difference -1.18% (-2.84 to 0.47)",
        pValue: "p not significant"
      },
      keySecondary: [
        "Recurrent ischemic stroke: 1.4% vs 2.5%",
        "sICH: 0.2% in both groups"
      ],
      significance: "Early DOAC initiation appeared safe and was associated with a favorable trend in reducing recurrent events. Supports earlier anticoagulation after AF-related stroke than traditionally practiced.",
      category: "anticoagulation",
      tags: ["DOAC", "atrial fibrillation", "early anticoagulation", "timing"]
    },
    {
      name: "ENCHANTED2/MT",
      fullTitle: "Enhanced Control of Hypertension and Thrombolysis Stroke Study 2 / Mechanical Thrombectomy",
      year: 2022,
      journal: "The Lancet",
      pmid: "36174555",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 821,
      population: "Successful reperfusion (mTICI 2b-3) after thrombectomy with SBP >=120 mmHg",
      intervention: "Intensive BP lowering (target SBP <120 mmHg within 1 hour post-procedure)",
      comparator: "Standard BP management (target SBP 140-180 mmHg)",
      primaryOutcome: {
        measure: "mRS distribution (ordinal shift) at 90 days",
        result: "Adjusted cOR 1.37",
        ci: "1.07-1.76",
        pValue: "p=0.01 (favoring standard treatment)"
      },
      keySecondary: [
        "Worse outcomes with intensive BP lowering",
        "More neurological deterioration in intensive group"
      ],
      significance: "Intensive BP lowering after successful thrombectomy was harmful. SBP <120 mmHg post-procedure should be avoided. Changed practice for post-thrombectomy BP management.",
      category: "thrombectomy",
      tags: ["thrombectomy", "blood pressure", "post-procedure", "harmful"]
    },
    {
      name: "BEST",
      fullTitle: "Basilar Artery Occlusion Endovascular Intervention vs Standard Medical Treatment",
      year: 2020,
      journal: "JAMA Neurology",
      pmid: "32227154",
      design: "Phase 3 RCT, open-label",
      n: 131,
      population: "Acute basilar artery occlusion within 8 hours",
      intervention: "Endovascular thrombectomy + standard care",
      comparator: "Standard medical care (including IV tPA if eligible)",
      primaryOutcome: {
        measure: "mRS 0-3 at 90 days",
        result: "42% vs 32%",
        ci: "OR 1.74 (0.81-3.74)",
        pValue: "p=0.15"
      },
      keySecondary: [
        "High crossover rate (22% in control group)",
        "Per-protocol analysis favored thrombectomy"
      ],
      significance: "Failed to demonstrate benefit of thrombectomy for basilar artery occlusion in intention-to-treat analysis, but high crossover rates complicated interpretation. Led to the ATTENTION posterior trial.",
      category: "thrombectomy",
      tags: ["basilar artery", "posterior circulation", "thrombectomy", "negative trial"]
    },
    {
      name: "BASICS",
      fullTitle: "Basilar Artery International Cooperation Study",
      year: 2021,
      journal: "The Lancet Neurology",
      pmid: "33853542",
      design: "Phase 3 RCT, open-label with blinded outcome assessment",
      n: 300,
      population: "Acute basilar artery occlusion within 6 hours",
      intervention: "Endovascular thrombectomy + best medical management",
      comparator: "Best medical management alone (IV tPA if eligible)",
      primaryOutcome: {
        measure: "mRS 0-3 at 90 days",
        result: "44.2% vs 37.7%",
        ci: "RR 1.18 (0.92-1.50)",
        pValue: "p=0.18"
      },
      keySecondary: [
        "No significant difference in mortality",
        "mRS 0-2: 34.9% vs 31.4%"
      ],
      significance: "Second negative posterior circulation thrombectomy trial. However, together with BEST, observational data, and subsequent positive trials (ATTENTION-2), the totality of evidence evolved.",
      category: "thrombectomy",
      tags: ["basilar artery", "posterior circulation", "thrombectomy", "negative trial"]
    }
  ]
};
