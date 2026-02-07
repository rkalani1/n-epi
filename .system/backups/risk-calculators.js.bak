/**
 * Neuro-Epi — Risk Calculators Module
 * Card 1: Clinical Stroke Risk Scores (CHA2DS2-VASc, HAS-BLED, ABCD2, ESRS, SEDAN, DRAGON)
 * Card 2: Epidemiological Rate Calculators
 *   Tabs: Incidence Rate, Rate Ratio, Prevalence, SMR,
 *         Age Standardization, Attributable Risk, Life Years Lost / DALY
 */

(function() {
    'use strict';

    const MODULE_ID = 'risk-calculators';

    // Age-standardization row state
    var ageRows = [];
    var ageRowIdCounter = 0;

    // ===== Clinical Risk Score lookup tables =====

    var chadsVascRisk = [0, 1.3, 2.2, 3.2, 4.0, 6.7, 9.8, 9.6, 6.7, 15.2];

    var hasBledRisk = {
        0: 1.13,
        1: 1.02,
        2: 1.88,
        3: 3.74,
        4: 8.70,
        5: 12.50
    };

    var abcd2TwoDayRisk = {
        low: 1.0,
        moderate: 4.1,
        high: 8.1
    };

    var abcd2SevenDayRisk = {
        low: 1.2,
        moderate: 5.9,
        high: 11.7
    };

    var sedanRisk = [1.4, 3.4, 5.7, 12.3, 16.9, 27.2];

    var dragonOutcome = {
        0: 96, 1: 96,
        2: 88,
        3: 78,
        4: 50, 5: 50,
        6: 20, 7: 20,
        8: 5, 9: 5, 10: 5
    };

    function render(container) {
        var html = App.createModuleLayout(
            'Risk Calculators',
            'Clinical stroke risk scores and epidemiological rate calculators. Includes validated scoring systems for stroke risk stratification, bleeding risk, outcome prediction, and population-level epidemiological measures with exact confidence intervals.'
        );

        // ===================================================================
        // CARD 1: Clinical Stroke Risk Scores
        // ===================================================================
        html += '<div class="card">';
        html += '<div class="card-title">Clinical Stroke Risk Scores</div>';
        html += '<div class="card-subtitle">Validated scoring systems for stroke risk stratification, bleeding risk, and outcome prediction.</div>';

        html += '<div class="tabs" id="crs-tabs">'
            + '<button class="tab active" data-tab="chadsvasc" onclick="RiskCalc.switchCrsTab(\'chadsvasc\')">CHA\u2082DS\u2082-VASc</button>'
            + '<button class="tab" data-tab="hasbled" onclick="RiskCalc.switchCrsTab(\'hasbled\')">HAS-BLED</button>'
            + '<button class="tab" data-tab="abcd2" onclick="RiskCalc.switchCrsTab(\'abcd2\')">ABCD\u00B2</button>'
            + '<button class="tab" data-tab="esrs" onclick="RiskCalc.switchCrsTab(\'esrs\')">ESRS</button>'
            + '<button class="tab" data-tab="sedan" onclick="RiskCalc.switchCrsTab(\'sedan\')">SEDAN</button>'
            + '<button class="tab" data-tab="dragon" onclick="RiskCalc.switchCrsTab(\'dragon\')">DRAGON</button>'
            + '</div>';

        // ----- CRS TAB 1: CHA2DS2-VASc -----
        html += '<div class="tab-content active" id="tab-crs-chadsvasc">';
        html += '<div class="card-subtitle">Stroke risk in atrial fibrillation. Score range: 0\u20139 points.</div>';

        html += '<div style="margin-bottom:12px">'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-chads-chf">'
            + '<span>C \u2014 Congestive heart failure / LV dysfunction (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-chads-htn">'
            + '<span>H \u2014 Hypertension (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-chads-dm">'
            + '<span>D \u2014 Diabetes mellitus (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-chads-stroke">'
            + '<span>S\u2082 \u2014 Stroke / TIA / thromboembolism history (+2)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-chads-vasc">'
            + '<span>V \u2014 Vascular disease (prior MI, PAD, aortic plaque) (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-chads-female">'
            + '<span>Sc \u2014 Sex category: female (+1)</span></label>'
            + '</div>';

        html += '<div class="form-group">'
            + '<label class="form-label">Age Category ' + App.tooltip('Age 65\u201374 scores 1 point; Age \u226575 scores 2 points. These are mutually exclusive.') + '</label>'
            + '<select class="form-select" id="crs-chads-age" style="max-width:280px">'
            + '<option value="0">Under 65 (0 points)</option>'
            + '<option value="1">65\u201374 years (+1 point)</option>'
            + '<option value="2">\u226575 years (+2 points)</option>'
            + '</select></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcCHADSVASc()">Calculate Score</button>'
            + '</div>';

        html += '<div id="crs-chadsvasc-results"></div>';
        html += '</div>';

        // ----- CRS TAB 2: HAS-BLED -----
        html += '<div class="tab-content" id="tab-crs-hasbled">';
        html += '<div class="card-subtitle">Bleeding risk assessment for patients on anticoagulation. Score range: 0\u20139 points.</div>';

        html += '<div style="margin-bottom:12px">'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-hasbled-htn">'
            + '<span>H \u2014 Hypertension (uncontrolled, systolic &gt;160 mmHg) (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-hasbled-renal">'
            + '<span>A \u2014 Abnormal renal function (dialysis, transplant, Cr &gt;2.26 mg/dL) (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-hasbled-liver">'
            + '<span>A \u2014 Abnormal liver function (cirrhosis, bilirubin &gt;2\u00d7 ULN, AST/ALT/ALP &gt;3\u00d7 ULN) (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-hasbled-stroke">'
            + '<span>S \u2014 Stroke history (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-hasbled-bleed">'
            + '<span>B \u2014 Bleeding history or predisposition (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-hasbled-inr">'
            + '<span>L \u2014 Labile INR (TTR &lt;60%) (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-hasbled-elderly">'
            + '<span>E \u2014 Elderly (&gt;65 years) (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-hasbled-drugs">'
            + '<span>D \u2014 Drugs predisposing to bleeding (antiplatelets, NSAIDs) (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-hasbled-alcohol">'
            + '<span>D \u2014 Alcohol excess (\u22658 drinks/week) (+1)</span></label>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcHASBLED()">Calculate Score</button>'
            + '</div>';

        html += '<div id="crs-hasbled-results"></div>';
        html += '</div>';

        // ----- CRS TAB 3: ABCD2 -----
        html += '<div class="tab-content" id="tab-crs-abcd2">';
        html += '<div class="card-subtitle">Stroke risk after TIA. Score range: 0\u20137 points.</div>';

        html += '<div style="margin-bottom:12px">'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-abcd2-age">'
            + '<span>A \u2014 Age \u226560 years (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-abcd2-bp">'
            + '<span>B \u2014 Blood pressure \u2265140/90 mmHg at presentation (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-abcd2-diabetes">'
            + '<span>D\u2082 \u2014 Diabetes mellitus (+1)</span></label>'
            + '</div>';

        html += '<div class="form-group">'
            + '<label class="form-label">C \u2014 Clinical Features ' + App.tooltip('Unilateral weakness scores 2; speech disturbance without weakness scores 1; other symptoms score 0.') + '</label>'
            + '<select class="form-select" id="crs-abcd2-clinical" style="max-width:360px">'
            + '<option value="0">Other symptoms (0 points)</option>'
            + '<option value="1">Speech disturbance without weakness (+1)</option>'
            + '<option value="2">Unilateral weakness (+2)</option>'
            + '</select></div>';

        html += '<div class="form-group">'
            + '<label class="form-label">D \u2014 Duration of Symptoms ' + App.tooltip('Duration of TIA symptoms. \u226560 min = 2 pts, 10\u201359 min = 1 pt, <10 min = 0 pts.') + '</label>'
            + '<select class="form-select" id="crs-abcd2-duration" style="max-width:280px">'
            + '<option value="0">&lt;10 minutes (0 points)</option>'
            + '<option value="1">10\u201359 minutes (+1 point)</option>'
            + '<option value="2">\u226560 minutes (+2 points)</option>'
            + '</select></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcABCD2()">Calculate Score</button>'
            + '</div>';

        html += '<div id="crs-abcd2-results"></div>';
        html += '</div>';

        // ----- CRS TAB 4: ESRS (Essen Stroke Risk Score) -----
        html += '<div class="tab-content" id="tab-crs-esrs">';
        html += '<div class="card-subtitle">Risk of recurrent stroke or cardiovascular event. Score range: 0\u20139 points.</div>';

        html += '<div style="margin-bottom:12px">'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-esrs-htn">'
            + '<span>Hypertension (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-esrs-dm">'
            + '<span>Diabetes mellitus (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-esrs-mi">'
            + '<span>Previous myocardial infarction (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-esrs-cvd">'
            + '<span>Other cardiovascular disease (excl MI, AF) (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-esrs-pad">'
            + '<span>Peripheral arterial disease (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-esrs-smoker">'
            + '<span>Current smoker (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-esrs-prior">'
            + '<span>Prior TIA or ischemic stroke (in addition to qualifying event) (+1)</span></label>'
            + '</div>';

        html += '<div class="form-group">'
            + '<label class="form-label">Age Category ' + App.tooltip('Age 65\u201375 scores 1 point; Age >75 scores 2 points. These are mutually exclusive.') + '</label>'
            + '<select class="form-select" id="crs-esrs-age" style="max-width:280px">'
            + '<option value="0">Under 65 (0 points)</option>'
            + '<option value="1">65\u201375 years (+1 point)</option>'
            + '<option value="2">&gt;75 years (+2 points)</option>'
            + '</select></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcESRS()">Calculate Score</button>'
            + '</div>';

        html += '<div id="crs-esrs-results"></div>';
        html += '</div>';

        // ----- CRS TAB 5: SEDAN -----
        html += '<div class="tab-content" id="tab-crs-sedan">';
        html += '<div class="card-subtitle">Symptomatic intracerebral hemorrhage (sICH) risk after IV thrombolysis. Score range: 0\u20135 points.</div>';

        html += '<div style="margin-bottom:12px">'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-sedan-sugar">'
            + '<span>S \u2014 Blood sugar &gt;145 mg/dL (&gt;8.1 mmol/L) on admission (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-sedan-infarct">'
            + '<span>E \u2014 Early infarct signs on CT (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-sedan-dense">'
            + '<span>D \u2014 Hyperdense cerebral artery sign on CT (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-sedan-age">'
            + '<span>A \u2014 Age &gt;75 years (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-sedan-nihss">'
            + '<span>N \u2014 NIHSS \u226510 (+1)</span></label>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcSEDAN()">Calculate Score</button>'
            + '</div>';

        html += '<div id="crs-sedan-results"></div>';
        html += '</div>';

        // ----- CRS TAB 6: DRAGON -----
        html += '<div class="tab-content" id="tab-crs-dragon">';
        html += '<div class="card-subtitle">Functional outcome prediction after IV thrombolysis. Score range: 0\u201310 points.</div>';

        html += '<div style="margin-bottom:12px">'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-dragon-dense">'
            + '<span>D \u2014 Dense cerebral artery sign on CT (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-dragon-infarct">'
            + '<span>D \u2014 Early infarct on CT (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-dragon-mrs">'
            + '<span>R \u2014 Pre-stroke mRS &gt;1 (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-dragon-glucose">'
            + '<span>G \u2014 Glucose on admission &gt;145 mg/dL (&gt;8.1 mmol/L) (+1)</span></label>'
            + '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0">'
            + '<input type="checkbox" id="crs-dragon-onset">'
            + '<span>O \u2014 Onset-to-treatment time &gt;90 minutes (+1)</span></label>'
            + '</div>';

        html += '<div class="form-group">'
            + '<label class="form-label">A \u2014 Age Category ' + App.tooltip('Age <45 = 0 pts, 45\u201365 = 1 pt, >65 = 2 pts.') + '</label>'
            + '<select class="form-select" id="crs-dragon-age" style="max-width:280px">'
            + '<option value="0">&lt;45 years (0 points)</option>'
            + '<option value="1">45\u201365 years (+1 point)</option>'
            + '<option value="2">&gt;65 years (+2 points)</option>'
            + '</select></div>';

        html += '<div class="form-group">'
            + '<label class="form-label">N \u2014 Baseline NIHSS ' + App.tooltip('NIHSS 0\u20134 = 0 pts, 5\u20139 = 1 pt, 10\u201315 = 2 pts, >15 = 3 pts.') + '</label>'
            + '<select class="form-select" id="crs-dragon-nihss" style="max-width:280px">'
            + '<option value="0">0\u20134 (0 points)</option>'
            + '<option value="1">5\u20139 (+1 point)</option>'
            + '<option value="2">10\u201315 (+2 points)</option>'
            + '<option value="3">&gt;15 (+3 points)</option>'
            + '</select></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcDRAGON()">Calculate Score</button>'
            + '</div>';

        html += '<div id="crs-dragon-results"></div>';
        html += '</div>';

        html += '</div>'; // end card 1 (Clinical Risk Scores)

        // ===================================================================
        // CARD 2: Epidemiological Rate Calculators (existing)
        // ===================================================================
        html += '<div class="card">';
        html += '<div class="card-title">Epidemiological Rate Calculators</div>';
        html += '<div class="card-subtitle">Compute epidemiological rates, ratios, and population-level measures with exact confidence intervals.</div>';

        html += '<div class="tabs" id="rc-tabs">'
            + '<button class="tab active" data-tab="incidence" onclick="RiskCalc.switchTab(\'incidence\')">Incidence Rate</button>'
            + '<button class="tab" data-tab="rateratio" onclick="RiskCalc.switchTab(\'rateratio\')">Rate Ratio</button>'
            + '<button class="tab" data-tab="prevalence" onclick="RiskCalc.switchTab(\'prevalence\')">Prevalence</button>'
            + '<button class="tab" data-tab="smr" onclick="RiskCalc.switchTab(\'smr\')">SMR</button>'
            + '<button class="tab" data-tab="agestd" onclick="RiskCalc.switchTab(\'agestd\')">Age Standardization</button>'
            + '<button class="tab" data-tab="ar" onclick="RiskCalc.switchTab(\'ar\')">Attributable Risk</button>'
            + '<button class="tab" data-tab="daly" onclick="RiskCalc.switchTab(\'daly\')">DALY / YLL</button>'
            + '</div>';

        // ===== TAB A: Incidence Rate =====
        html += '<div class="tab-content active" id="tab-incidence">';
        html += '<div class="card-subtitle">Calculate incidence rate (events per person-time) with Poisson exact confidence interval.</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Number of Events ' + App.tooltip('Total number of new cases or events observed') + '</label>'
            + '<input type="number" class="form-input" id="rc-ir-events" name="rc_ir_events" step="1" min="0" value="45"></div>'
            + '<div class="form-group"><label class="form-label">Person-Time ' + App.tooltip('Total observation time (e.g., person-years)') + '</label>'
            + '<input type="number" class="form-input" id="rc-ir-pt" name="rc_ir_pt" step="1" min="1" value="10000"></div>'
            + '<div class="form-group"><label class="form-label">Multiplier ' + App.tooltip('Express rate per X (e.g., 100000 for per 100,000)') + '</label>'
            + '<select class="form-select" id="rc-ir-multiplier" name="rc_ir_multiplier">'
            + '<option value="1">Per 1</option>'
            + '<option value="1000">Per 1,000</option>'
            + '<option value="10000">Per 10,000</option>'
            + '<option value="100000" selected>Per 100,000</option>'
            + '</select></div>'
            + '</div>';

        html += '<div class="form-group"><label class="form-label">Confidence Level</label>'
            + '<select class="form-select" id="rc-ir-alpha" name="rc_ir_alpha" style="max-width:200px">'
            + '<option value="0.05" selected>95% CI</option>'
            + '<option value="0.01">99% CI</option>'
            + '<option value="0.10">90% CI</option>'
            + '</select></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcIncidence()">Calculate</button>'
            + '</div>';

        html += '<div id="rc-incidence-results"></div>';
        html += '</div>';

        // ===== TAB B: Rate Ratio =====
        html += '<div class="tab-content" id="tab-rateratio">';
        html += '<div class="card-subtitle">Compare two incidence rates and compute the incidence rate ratio with confidence interval.</div>';

        html += '<div class="card-title">Exposed Group</div>';
        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Events (Exposed)</label>'
            + '<input type="number" class="form-input" id="rc-rr-events1" name="rc_rr_events1" step="1" min="0" value="30"></div>'
            + '<div class="form-group"><label class="form-label">Person-Time (Exposed)</label>'
            + '<input type="number" class="form-input" id="rc-rr-pt1" name="rc_rr_pt1" step="1" min="1" value="5000"></div>'
            + '</div>';

        html += '<div class="card-title mt-1">Unexposed Group</div>';
        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Events (Unexposed)</label>'
            + '<input type="number" class="form-input" id="rc-rr-events2" name="rc_rr_events2" step="1" min="0" value="15"></div>'
            + '<div class="form-group"><label class="form-label">Person-Time (Unexposed)</label>'
            + '<input type="number" class="form-input" id="rc-rr-pt2" name="rc_rr_pt2" step="1" min="1" value="8000"></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcRateRatio()">Calculate</button>'
            + '</div>';

        html += '<div id="rc-rateratio-results"></div>';
        html += '</div>';

        // ===== TAB C: Prevalence =====
        html += '<div class="tab-content" id="tab-prevalence">';
        html += '<div class="card-subtitle">Calculate prevalence (proportion) with exact Clopper-Pearson confidence interval.</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Number of Cases ' + App.tooltip('Number with the condition') + '</label>'
            + '<input type="number" class="form-input" id="rc-prev-x" name="rc_prev_x" step="1" min="0" value="120"></div>'
            + '<div class="form-group"><label class="form-label">Total Population</label>'
            + '<input type="number" class="form-input" id="rc-prev-n" name="rc_prev_n" step="1" min="1" value="5000"></div>'
            + '<div class="form-group"><label class="form-label">Confidence Level</label>'
            + '<select class="form-select" id="rc-prev-alpha" name="rc_prev_alpha">'
            + '<option value="0.05" selected>95% CI</option>'
            + '<option value="0.01">99% CI</option>'
            + '<option value="0.10">90% CI</option>'
            + '</select></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcPrevalence()">Calculate</button>'
            + '</div>';

        html += '<div id="rc-prevalence-results"></div>';
        html += '</div>';

        // ===== TAB D: SMR =====
        html += '<div class="tab-content" id="tab-smr">';
        html += '<div class="card-subtitle">Standardized Mortality (or Morbidity) Ratio: observed / expected with exact Poisson confidence interval.</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Observed Events ' + App.tooltip('Number of events actually observed in the study population') + '</label>'
            + '<input type="number" class="form-input" id="rc-smr-obs" name="rc_smr_obs" step="1" min="0" value="35"></div>'
            + '<div class="form-group"><label class="form-label">Expected Events ' + App.tooltip('Number expected based on reference population rates') + '</label>'
            + '<input type="number" class="form-input" id="rc-smr-exp" name="rc_smr_exp" step="0.1" min="0.1" value="25"></div>'
            + '<div class="form-group"><label class="form-label">Confidence Level</label>'
            + '<select class="form-select" id="rc-smr-alpha" name="rc_smr_alpha">'
            + '<option value="0.05" selected>95% CI</option>'
            + '<option value="0.01">99% CI</option>'
            + '</select></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcSMR()">Calculate</button>'
            + '</div>';

        html += '<div id="rc-smr-results"></div>';
        html += '</div>';

        // ===== TAB E: Age Standardization =====
        html += '<div class="tab-content" id="tab-agestd">';
        html += '<div class="card-subtitle">Direct age standardization: apply age-specific rates to a standard population to compute an age-adjusted rate.</div>';

        html += '<div class="form-group"><label class="form-label">Standard Population Preset</label>'
            + '<select class="form-select" id="rc-std-pop" name="rc_std_pop" onchange="RiskCalc.loadStdPop()" style="max-width:300px">'
            + '<option value="">-- Select preset or enter manually --</option>';
        Object.keys(References.standardPopulations).forEach(function(key) {
            html += '<option value="' + key + '">' + key + '</option>';
        });
        html += '</select></div>';

        html += '<div class="card-title mt-1">Age-Specific Data</div>';
        html += '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-bottom:8px">Enter events, study population, and standard population weight for each age group.</div>';

        html += '<div id="rc-age-rows"></div>';

        html += '<div class="btn-group mt-1">'
            + '<button class="btn btn-xs btn-secondary" onclick="RiskCalc.addAgeRow()">+ Add Age Group</button>'
            + '<button class="btn btn-xs btn-secondary" onclick="RiskCalc.clearAgeRows()">Clear All</button>'
            + '</div>';

        html += '<div class="form-group mt-2"><label class="form-label">Multiplier</label>'
            + '<select class="form-select" id="rc-agestd-multiplier" name="rc_agestd_multiplier" style="max-width:200px">'
            + '<option value="100000" selected>Per 100,000</option>'
            + '<option value="10000">Per 10,000</option>'
            + '<option value="1000">Per 1,000</option>'
            + '<option value="1">Per 1</option>'
            + '</select></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcAgeStd()">Calculate Standardized Rate</button>'
            + '</div>';

        html += '<div id="rc-agestd-results"></div>';
        html += '</div>';

        // ===== TAB F: Attributable Risk =====
        html += '<div class="tab-content" id="tab-ar">';
        html += '<div class="card-subtitle">Calculate attributable risk measures: absolute risk difference, attributable fraction in the exposed, and population attributable fraction.</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Rate in Exposed (R<sub>e</sub>) ' + App.tooltip('Incidence rate or risk in the exposed group') + '</label>'
            + '<input type="number" class="form-input" id="rc-ar-re" name="rc_ar_re" step="0.001" min="0" value="0.06"></div>'
            + '<div class="form-group"><label class="form-label">Rate in Unexposed (R<sub>u</sub>)</label>'
            + '<input type="number" class="form-input" id="rc-ar-ru" name="rc_ar_ru" step="0.001" min="0" value="0.02"></div>'
            + '</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Prevalence of Exposure (P<sub>e</sub>) ' + App.tooltip('Proportion of the population that is exposed. Needed for PAF calculation.') + '</label>'
            + '<input type="number" class="form-input" id="rc-ar-pe" name="rc_ar_pe" step="0.01" min="0" max="1" value="0.30"></div>'
            + '<div class="form-group"><label class="form-label">Sample Sizes (optional, for CI)</label>'
            + '<div class="form-row form-row--2">'
            + '<input type="number" class="form-input" id="rc-ar-ne" name="rc_ar_ne" placeholder="N exposed" step="1" min="1" value="1000">'
            + '<input type="number" class="form-input" id="rc-ar-nu" name="rc_ar_nu" placeholder="N unexposed" step="1" min="1" value="2000">'
            + '</div></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcAR()">Calculate</button>'
            + '</div>';

        html += '<div id="rc-ar-results"></div>';
        html += '</div>';

        // ===== TAB G: DALY / YLL =====
        html += '<div class="tab-content" id="tab-daly">';
        html += '<div class="card-subtitle">Calculate Years of Life Lost (YLL), Years Lived with Disability (YLD), and Disability-Adjusted Life Years (DALY = YLL + YLD).</div>';

        html += '<div class="card-title">Years of Life Lost (YLL)</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Number of Deaths ' + App.tooltip('Deaths attributable to the condition') + '</label>'
            + '<input type="number" class="form-input" id="rc-yll-deaths" name="rc_yll_deaths" step="1" min="0" value="150"></div>'
            + '<div class="form-group"><label class="form-label">Average Age at Death (years)</label>'
            + '<input type="number" class="form-input" id="rc-yll-age" name="rc_yll_age" step="0.1" value="72"></div>'
            + '<div class="form-group"><label class="form-label">Life Expectancy at Age of Death ' + App.tooltip('Remaining life expectancy at average age of death. Default uses standard GBD reference (86.6 years at birth).') + '</label>'
            + '<input type="number" class="form-input" id="rc-yll-le" name="rc_yll_le" step="0.1" value="14.6"></div>'
            + '</div>';

        html += '<div class="card-title mt-2">Years Lived with Disability (YLD)</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Number of Incident Cases</label>'
            + '<input type="number" class="form-input" id="rc-yld-cases" name="rc_yld_cases" step="1" min="0" value="500"></div>'
            + '<div class="form-group"><label class="form-label">Average Duration of Disability (years) ' + App.tooltip('Average time lived with the condition. For stroke: remaining life with disability.') + '</label>'
            + '<input type="number" class="form-input" id="rc-yld-duration" name="rc_yld_duration" step="0.1" min="0" value="8.5"></div>'
            + '<div class="form-group"><label class="form-label">Disability Weight (0-1) ' + App.tooltip('GBD disability weight. Stroke: mild=0.019, moderate=0.070, severe=0.552, long-term=0.316') + '</label>'
            + '<input type="number" class="form-input" id="rc-yld-dw" name="rc_yld_dw" step="0.001" min="0" max="1" value="0.316"></div>'
            + '</div>';

        html += '<div class="card-subtitle mt-1">Common Stroke Disability Weights (GBD 2019)</div>';
        html += '<div class="preset-group">'
            + '<button class="preset-btn" onclick="RiskCalc.setDW(0.019)">Mild (0.019)</button>'
            + '<button class="preset-btn" onclick="RiskCalc.setDW(0.070)">Moderate (0.070)</button>'
            + '<button class="preset-btn" onclick="RiskCalc.setDW(0.316)">Long-term (0.316)</button>'
            + '<button class="preset-btn" onclick="RiskCalc.setDW(0.552)">Severe (0.552)</button>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RiskCalc.calcDALY()">Calculate DALY</button>'
            + '</div>';

        html += '<div id="rc-daly-results"></div>';
        html += '</div>';

        html += '</div>'; // end card 2 (Epi calculators)

        // ===== LEARN SECTION =====
        html += '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Learn: Clinical Risk Scores</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';

        html += '<div class="card-subtitle" style="font-weight:600;">Score Selection Guide</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>CHA\u2082DS\u2082-VASc:</strong> Annual stroke risk in AF \u2192 guides anticoagulation decision</li>'
            + '<li><strong>HAS-BLED:</strong> Annual major bleeding risk \u2192 risk-benefit of anticoagulation</li>'
            + '<li><strong>ABCD\u00B2:</strong> 2-day/7-day stroke risk after TIA \u2192 urgency of workup</li>'
            + '<li><strong>ESRS:</strong> Recurrent stroke risk \u2192 identifies high-risk patients for aggressive prevention</li>'
            + '<li><strong>SEDAN:</strong> sICH risk after IV tPA \u2192 shared decision-making</li>'
            + '<li><strong>DRAGON:</strong> Functional outcome prediction after IV tPA</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Cautions</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>Risk scores provide population-level estimates, not individual predictions</li>'
            + '<li>Scores validated in specific populations may not generalize to all settings</li>'
            + '<li>Always combine scores with clinical judgment and shared decision-making</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;">'
            + '<li>Lip GY, et al. Refining clinical risk stratification for AF: CHA\u2082DS\u2082-VASc. <em>Chest</em>. 2010;137:263-72.</li>'
            + '<li>Pisters R, et al. HAS-BLED. <em>Chest</em>. 2010;138:1093-100.</li>'
            + '<li>Johnston SC, et al. ABCD\u00B2 score. <em>Lancet</em>. 2007;369:283-92.</li>'
            + '</ul>';
        html += '</div></div>';

        // ===================================================================
        // CARD 3: Additional Clinical Scores
        // ===================================================================
        html += '<div class="card">';
        html += '<div class="card-title">Additional Clinical Risk Scores</div>';
        html += '<div class="card-subtitle">Framingham Risk Score, ASCVD 10-year risk, ICH Score, and modified Rankin Scale (mRS) assessment.</div>';

        html += '<div class="tabs" id="extra-tabs">'
            + '<button class="tab active" data-tab="framingham" onclick="RiskCalc.switchExtraTab(\'framingham\')">Framingham</button>'
            + '<button class="tab" data-tab="ascvd" onclick="RiskCalc.switchExtraTab(\'ascvd\')">ASCVD</button>'
            + '<button class="tab" data-tab="ichscore" onclick="RiskCalc.switchExtraTab(\'ichscore\')">ICH Score</button>'
            + '<button class="tab" data-tab="mrs" onclick="RiskCalc.switchExtraTab(\'mrs\')">mRS Assessment</button>'
            + '</div>';

        // ----- Framingham -----
        html += '<div class="tab-content active" id="tab-extra-framingham">';
        html += '<div class="card-subtitle">Framingham 10-year cardiovascular disease risk. Simplified estimation.</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Sex</label><select class="form-select" id="rc-fram-sex"><option value="male">Male</option><option value="female">Female</option></select></div>';
        html += '<div class="form-group"><label class="form-label">Age (30-79)</label><input type="number" class="form-input" id="rc-fram-age" value="55" min="30" max="79"></div>';
        html += '</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Total Cholesterol (mg/dL)</label><input type="number" class="form-input" id="rc-fram-chol" value="220" min="100" max="400"></div>';
        html += '<div class="form-group"><label class="form-label">HDL (mg/dL)</label><input type="number" class="form-input" id="rc-fram-hdl" value="50" min="20" max="120"></div>';
        html += '</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Systolic BP (mmHg)</label><input type="number" class="form-input" id="rc-fram-sbp" value="140" min="90" max="200"></div>';
        html += '<div class="form-group"><label class="form-label">BP Treatment</label><select class="form-select" id="rc-fram-bptx"><option value="no">Not treated</option><option value="yes">On BP medication</option></select></div>';
        html += '</div>';
        html += '<div style="margin-bottom:12px">';
        html += '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0"><input type="checkbox" id="rc-fram-smoker"><span>Current smoker</span></label>';
        html += '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0"><input type="checkbox" id="rc-fram-diabetes"><span>Diabetes mellitus</span></label>';
        html += '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="RiskCalc.calcFramingham()">Calculate 10-Year Risk</button></div>';
        html += '<div id="rc-framingham-results"></div>';
        html += '</div>';

        // ----- ASCVD -----
        html += '<div class="tab-content" id="tab-extra-ascvd">';
        html += '<div class="card-subtitle">Pooled Cohort Equations (PCE) for 10-year ASCVD risk. Per 2013 ACC/AHA guidelines.</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Sex</label><select class="form-select" id="rc-ascvd-sex"><option value="male">Male</option><option value="female">Female</option></select></div>';
        html += '<div class="form-group"><label class="form-label">Race</label><select class="form-select" id="rc-ascvd-race"><option value="white">White / Other</option><option value="aa">African American</option></select></div>';
        html += '</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Age (40-79)</label><input type="number" class="form-input" id="rc-ascvd-age" value="55" min="40" max="79"></div>';
        html += '<div class="form-group"><label class="form-label">Total Cholesterol</label><input type="number" class="form-input" id="rc-ascvd-chol" value="220" min="100" max="400"></div>';
        html += '<div class="form-group"><label class="form-label">HDL (mg/dL)</label><input type="number" class="form-input" id="rc-ascvd-hdl" value="50" min="20" max="120"></div>';
        html += '</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Systolic BP</label><input type="number" class="form-input" id="rc-ascvd-sbp" value="140" min="90" max="200"></div>';
        html += '<div class="form-group"><label class="form-label">BP Treatment</label><select class="form-select" id="rc-ascvd-bptx"><option value="no">Not treated</option><option value="yes">On BP medication</option></select></div>';
        html += '</div>';
        html += '<div style="margin-bottom:12px">';
        html += '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0"><input type="checkbox" id="rc-ascvd-smoker"><span>Current smoker</span></label>';
        html += '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0"><input type="checkbox" id="rc-ascvd-diabetes"><span>Diabetes</span></label>';
        html += '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="RiskCalc.calcASCVD()">Calculate 10-Year ASCVD Risk</button></div>';
        html += '<div id="rc-ascvd-results"></div>';
        html += '</div>';

        // ----- ICH Score -----
        html += '<div class="tab-content" id="tab-extra-ichscore">';
        html += '<div class="card-subtitle">ICH Score for 30-day mortality after intracerebral hemorrhage (Hemphill 2001). Score: 0-6.</div>';
        html += '<div style="margin-bottom:12px">';
        html += '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0"><input type="checkbox" id="rc-ich-infratentorial"><span>Infratentorial origin (+1)</span></label>';
        html += '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 0"><input type="checkbox" id="rc-ich-ivh"><span>Intraventricular hemorrhage present (+1)</span></label>';
        html += '</div>';
        html += '<div class="form-group"><label class="form-label">GCS Score</label><select class="form-select" id="rc-ich-gcs" style="max-width:280px"><option value="0">13-15 (0 pts)</option><option value="1">5-12 (+1 pt)</option><option value="2">3-4 (+2 pts)</option></select></div>';
        html += '<div class="form-group"><label class="form-label">Age</label><select class="form-select" id="rc-ich-age" style="max-width:280px"><option value="0">&lt;80 (0 pts)</option><option value="1">&ge;80 (+1 pt)</option></select></div>';
        html += '<div class="form-group"><label class="form-label">ICH Volume</label><select class="form-select" id="rc-ich-volume" style="max-width:280px"><option value="0">&lt;30 cm&sup3; (0 pts)</option><option value="1">&ge;30 cm&sup3; (+1 pt)</option></select></div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="RiskCalc.calcICH()">Calculate ICH Score</button></div>';
        html += '<div id="rc-ich-results"></div>';
        html += '</div>';

        // ----- mRS -----
        html += '<div class="tab-content" id="tab-extra-mrs">';
        html += '<div class="card-subtitle">Modified Rankin Scale (mRS) -- standard functional outcome measure for stroke.</div>';
        var mrsDesc = [
            { s: 0, l: 'No symptoms', d: 'No symptoms at all.' },
            { s: 1, l: 'No significant disability', d: 'Despite symptoms, able to carry out all usual duties and activities.' },
            { s: 2, l: 'Slight disability', d: 'Unable to carry out all previous activities but able to look after own affairs without assistance.' },
            { s: 3, l: 'Moderate disability', d: 'Requiring some help, but able to walk without assistance.' },
            { s: 4, l: 'Moderately severe disability', d: 'Unable to walk without assistance; unable to attend to own bodily needs without assistance.' },
            { s: 5, l: 'Severe disability', d: 'Bedridden, incontinent, requiring constant nursing care.' },
            { s: 6, l: 'Dead', d: 'Deceased.' }
        ];
        for (var mri = 0; mri < mrsDesc.length; mri++) {
            html += '<label style="display:flex;align-items:flex-start;gap:0.6rem;padding:0.5rem;cursor:pointer;border:1px solid var(--border);border-radius:6px;margin-bottom:0.4rem;">';
            html += '<input type="radio" name="rc-mrs-score" value="' + mrsDesc[mri].s + '" style="margin-top:3px;flex-shrink:0;"' + (mri === 0 ? ' checked' : '') + '>';
            html += '<div><strong>mRS ' + mrsDesc[mri].s + ': ' + mrsDesc[mri].l + '</strong><div style="font-size:0.8rem;color:var(--text-tertiary)">' + mrsDesc[mri].d + '</div></div></label>';
        }
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="RiskCalc.assessMRS()">Generate Assessment</button></div>';
        html += '<div id="rc-mrs-results"></div>';
        html += '</div>';

        html += '</div>'; // end card 3

        // ===================================================================
        // CARD 4: Multi-Score Comparison
        // ===================================================================
        html += '<div class="card">';
        html += '<div class="card-title">Multi-Score Comparison Tool</div>';
        html += '<div class="card-subtitle">Calculate multiple risk scores simultaneously for the same patient.</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Age</label><input type="number" class="form-input" id="rc-multi-age" value="72" min="18" max="100"></div>';
        html += '<div class="form-group"><label class="form-label">Sex</label><select class="form-select" id="rc-multi-sex"><option value="male">Male</option><option value="female">Female</option></select></div>';
        html += '<div class="form-group"><label class="form-label">Systolic BP</label><input type="number" class="form-input" id="rc-multi-sbp" value="150" min="90" max="250"></div>';
        html += '</div>';
        html += '<div style="margin-bottom:12px">';
        var mChk = [['rc-multi-htn','Hypertension'],['rc-multi-dm','Diabetes'],['rc-multi-chf','Heart failure'],['rc-multi-stroke','Prior stroke/TIA'],['rc-multi-vasc','Vascular disease'],['rc-multi-smoker','Current smoker'],['rc-multi-af','Atrial fibrillation']];
        for (var mci = 0; mci < mChk.length; mci++) {
            html += '<label class="form-label" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:4px 0"><input type="checkbox" id="' + mChk[mci][0] + '"><span>' + mChk[mci][1] + '</span></label>';
        }
        html += '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="RiskCalc.calcMultiScore()">Calculate All Scores</button><button class="btn btn-secondary" onclick="RiskCalc.copyMultiScore()">Copy Results</button></div>';
        html += '<div id="rc-multi-results"></div>';
        html += '</div>';

        // ===================================================================
        // Expanded Learn
        // ===================================================================
        html += '<div class="card" style="background: var(--bg-secondary); border-left: 4px solid var(--accent-color);">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\')">&#128218; Extended Clinical Score Reference <span style="font-size:0.8em; color: var(--text-muted);">(click to expand)</span></div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';
        html += '<div style="margin-bottom:1rem;"><strong style="color:var(--accent);">Cardiovascular Risk Assessment</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;"><li><strong>Framingham:</strong> Original 10-yr CVD risk; validated in Framingham Heart Study</li><li><strong>ASCVD (PCE):</strong> 2013 ACC/AHA; race/sex-specific pooled cohort equations</li><li><strong>SCORE2:</strong> European cardiovascular risk (ESC guidelines)</li></ul></div>';
        html += '<div style="margin-bottom:1rem;"><strong style="color:var(--accent);">ICH Scores</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;"><li><strong>ICH Score:</strong> 30-day mortality; score 0 = 0%, score 5 = 100%</li><li><strong>FUNC Score:</strong> Functional independence at 90 days post-ICH</li></ul></div>';
        html += '<div style="margin-bottom:1rem;"><strong style="color:var(--accent);">Modified Rankin Scale</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;"><li>Most widely used stroke outcome measure</li><li>mRS 0-2 = functional independence (good outcome)</li><li>Structured interview improves reliability</li><li>Shift analysis (ordinal) preferred in clinical trials</li></ul></div>';
        html += '<div style="margin-bottom:0;"><strong style="color:var(--accent);">References</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;">';
        html += '<li>Hemphill JC et al. ICH Score. <em>Stroke</em>. 2001;32:891-897.</li>';
        html += '<li>Goff DC et al. PCE for ASCVD Risk. <em>JACC</em>. 2014;63:2935-59.</li>';
        html += '<li>Wilson PWF et al. Framingham. <em>Circulation</em>. 1998;97:1837-47.</li>';
        html += '<li>van Swieten JC et al. mRS. <em>Stroke</em>. 1988;19:604-607.</li>';
        html += '</ul></div>';
        html += '</div></div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);

        // Initialize age rows with a few defaults
        ageRows = [];
        ageRowIdCounter = 0;
        addDefaultAgeRows();
    }

    // ===== Tab switching for Epi calculators (Card 2) =====
    function switchTab(tabId) {
        document.querySelectorAll('#rc-tabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tabId); });
        var epiTabIds = ['incidence', 'rateratio', 'prevalence', 'smr', 'agestd', 'ar', 'daly'];
        epiTabIds.forEach(function(id) {
            var el = document.getElementById('tab-' + id);
            if (el) el.classList.toggle('active', id === tabId);
        });
    }

    // ===== Tab switching for Clinical Risk Scores (Card 1) =====
    function switchCrsTab(tabId) {
        document.querySelectorAll('#crs-tabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tabId); });
        var crsTabIds = ['chadsvasc', 'hasbled', 'abcd2', 'esrs', 'sedan', 'dragon'];
        crsTabIds.forEach(function(id) {
            var el = document.getElementById('tab-crs-' + id);
            if (el) el.classList.toggle('active', id === tabId);
        });
    }

    // ===================================================================
    // CLINICAL RISK SCORE CALCULATORS
    // ===================================================================

    // ----- CHA2DS2-VASc -----
    function calcCHADSVASc() {
        var score = 0;
        if (document.getElementById('crs-chads-chf').checked) score += 1;
        if (document.getElementById('crs-chads-htn').checked) score += 1;
        if (document.getElementById('crs-chads-dm').checked) score += 1;
        if (document.getElementById('crs-chads-stroke').checked) score += 2;
        if (document.getElementById('crs-chads-vasc').checked) score += 1;
        if (document.getElementById('crs-chads-female').checked) score += 1;
        score += parseInt(document.getElementById('crs-chads-age').value) || 0;

        var isFemale = document.getElementById('crs-chads-female').checked;
        var annualRisk = chadsVascRisk[Math.min(score, 9)];

        // Determine recommendation
        var recommendation = '';
        var recColor = '';
        if (score === 0) {
            recommendation = 'Low risk \u2014 no anticoagulation needed.';
            recColor = 'var(--success)';
        } else if (score === 1 && isFemale) {
            // Female with score 1 where the only point is sex: low risk
            var nonSexScore = score - 1;
            if (nonSexScore === 0) {
                recommendation = 'Low risk (sole point from female sex) \u2014 no anticoagulation needed.';
                recColor = 'var(--success)';
            } else {
                recommendation = 'Consider oral anticoagulation (DOAC preferred). Discuss risk-benefit with patient.';
                recColor = 'var(--warning)';
            }
        } else if (score === 1) {
            recommendation = 'Consider oral anticoagulation (DOAC preferred). Discuss risk-benefit with patient.';
            recColor = 'var(--warning)';
        } else {
            recommendation = 'Oral anticoagulation recommended (DOAC preferred over warfarin).';
            recColor = 'var(--danger)';
        }

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + score + ' / 9</div>';
        html += '<div class="result-label">CHA\u2082DS\u2082-VASc Score</div>';
        html += '<div class="result-detail">Estimated annual stroke risk: ' + annualRisk + '%</div>';

        html += '<div class="result-detail mt-1" style="color:' + recColor + ';font-weight:600">'
            + recommendation + '</div>';

        // Risk table
        html += '<div class="card-title mt-2">Annual Stroke Risk by Score</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Score</th><th>Annual Stroke Risk</th></tr></thead><tbody>';
        for (var i = 0; i <= 9; i++) {
            var rowStyle = i === score ? ' style="background:var(--accent-muted);font-weight:600"' : '';
            html += '<tr' + rowStyle + '><td>' + i + '</td><td class="num">' + chadsVascRisk[i] + '%</td></tr>';
        }
        html += '</tbody></table></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'CHA2DS2-VASc Score: ' + score + '/9. Annual stroke risk: ' + annualRisk + '%. ' + recommendation.replace(/'/g, "\\'") + '\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('crs-chadsvasc-results'), html);
        Export.addToHistory(MODULE_ID, { calculator: 'CHA2DS2-VASc', score: score }, 'CHA2DS2-VASc: ' + score + '/9 (' + annualRisk + '% annual risk)');
    }

    // ----- HAS-BLED -----
    function calcHASBLED() {
        var score = 0;
        if (document.getElementById('crs-hasbled-htn').checked) score += 1;
        if (document.getElementById('crs-hasbled-renal').checked) score += 1;
        if (document.getElementById('crs-hasbled-liver').checked) score += 1;
        if (document.getElementById('crs-hasbled-stroke').checked) score += 1;
        if (document.getElementById('crs-hasbled-bleed').checked) score += 1;
        if (document.getElementById('crs-hasbled-inr').checked) score += 1;
        if (document.getElementById('crs-hasbled-elderly').checked) score += 1;
        if (document.getElementById('crs-hasbled-drugs').checked) score += 1;
        if (document.getElementById('crs-hasbled-alcohol').checked) score += 1;

        var bleedRate = score >= 5 ? hasBledRisk[5] : (hasBledRisk[score] !== undefined ? hasBledRisk[score] : hasBledRisk[5]);

        var riskCategory = '';
        var riskColor = '';
        if (score <= 2) {
            riskCategory = 'Relatively low bleeding risk.';
            riskColor = 'var(--success)';
        } else {
            riskCategory = 'High bleeding risk \u2014 not a contraindication to OAC, but warrants careful monitoring and risk factor modification.';
            riskColor = 'var(--danger)';
        }

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + score + ' / 9</div>';
        html += '<div class="result-label">HAS-BLED Score</div>';
        html += '<div class="result-detail">Estimated bleeding rate: ' + bleedRate.toFixed(2) + ' bleeds per 100 patient-years</div>';

        html += '<div class="result-detail mt-1" style="color:' + riskColor + ';font-weight:600">'
            + riskCategory + '</div>';

        // Risk table
        html += '<div class="card-title mt-2">Bleeding Risk by Score</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Score</th><th>Bleeds per 100 patient-years</th></tr></thead><tbody>';
        var hasBledKeys = [0, 1, 2, 3, 4, 5];
        hasBledKeys.forEach(function(k) {
            var label = k === 5 ? '\u22655' : String(k);
            var rowStyle = (k === score || (score >= 5 && k === 5)) ? ' style="background:var(--accent-muted);font-weight:600"' : '';
            html += '<tr' + rowStyle + '><td>' + label + '</td><td class="num">' + hasBledRisk[k].toFixed(2) + '</td></tr>';
        });
        html += '</tbody></table></div>';

        html += '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:8px">A high HAS-BLED score is not a reason to withhold anticoagulation. It identifies patients who need closer follow-up and modification of reversible risk factors (e.g., uncontrolled HTN, labile INR, concomitant drugs, alcohol).</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'HAS-BLED Score: ' + score + '/9. Bleeding rate: ' + bleedRate.toFixed(2) + ' per 100 patient-years. ' + (score >= 3 ? 'High bleeding risk.' : 'Low bleeding risk.') + '\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('crs-hasbled-results'), html);
        Export.addToHistory(MODULE_ID, { calculator: 'HAS-BLED', score: score }, 'HAS-BLED: ' + score + '/9 (' + bleedRate.toFixed(2) + ' bleeds/100 pt-yr)');
    }

    // ----- ABCD2 -----
    function calcABCD2() {
        var score = 0;
        if (document.getElementById('crs-abcd2-age').checked) score += 1;
        if (document.getElementById('crs-abcd2-bp').checked) score += 1;
        if (document.getElementById('crs-abcd2-diabetes').checked) score += 1;
        score += parseInt(document.getElementById('crs-abcd2-clinical').value) || 0;
        score += parseInt(document.getElementById('crs-abcd2-duration').value) || 0;

        var riskCategory = '';
        var riskColor = '';
        var twoDayRisk = 0;
        var sevenDayRisk = 0;

        if (score <= 3) {
            riskCategory = 'Low risk';
            riskColor = 'var(--success)';
            twoDayRisk = abcd2TwoDayRisk.low;
            sevenDayRisk = abcd2SevenDayRisk.low;
        } else if (score <= 5) {
            riskCategory = 'Moderate risk';
            riskColor = 'var(--warning)';
            twoDayRisk = abcd2TwoDayRisk.moderate;
            sevenDayRisk = abcd2SevenDayRisk.moderate;
        } else {
            riskCategory = 'High risk';
            riskColor = 'var(--danger)';
            twoDayRisk = abcd2TwoDayRisk.high;
            sevenDayRisk = abcd2SevenDayRisk.high;
        }

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + score + ' / 7</div>';
        html += '<div class="result-label">ABCD\u00B2 Score</div>';
        html += '<div class="result-detail mt-1" style="color:' + riskColor + ';font-weight:600">'
            + riskCategory + '</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value" style="color:var(--warning)">' + twoDayRisk + '%</div><div class="result-item-label">2-Day Stroke Risk</div></div>'
            + '<div class="result-item"><div class="result-item-value" style="color:var(--danger)">' + sevenDayRisk + '%</div><div class="result-item-label">7-Day Stroke Risk</div></div>'
            + '</div>';

        // Risk table
        html += '<div class="card-title mt-2">Stroke Risk by Score Category</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Score</th><th>Risk Level</th><th>2-Day Stroke Risk</th><th>7-Day Stroke Risk</th></tr></thead><tbody>';
        var abcdRows = [
            { range: '0\u20133', level: 'Low', d2: abcd2TwoDayRisk.low, d7: abcd2SevenDayRisk.low, match: score <= 3 },
            { range: '4\u20135', level: 'Moderate', d2: abcd2TwoDayRisk.moderate, d7: abcd2SevenDayRisk.moderate, match: score >= 4 && score <= 5 },
            { range: '6\u20137', level: 'High', d2: abcd2TwoDayRisk.high, d7: abcd2SevenDayRisk.high, match: score >= 6 }
        ];
        abcdRows.forEach(function(r) {
            var rowStyle = r.match ? ' style="background:var(--accent-muted);font-weight:600"' : '';
            html += '<tr' + rowStyle + '><td>' + r.range + '</td><td>' + r.level + '</td><td class="num">' + r.d2 + '%</td><td class="num">' + r.d7 + '%</td></tr>';
        });
        html += '</tbody></table></div>';

        html += '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:8px">The ABCD\u00B2 score helps triage TIA patients for urgency of evaluation. Patients with scores \u22654 should be considered for urgent workup and possible hospitalization.</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'ABCD2 Score: ' + score + '/7. ' + riskCategory + '. 2-day stroke risk: ' + twoDayRisk + '%. 7-day stroke risk: ' + sevenDayRisk + '%.\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('crs-abcd2-results'), html);
        Export.addToHistory(MODULE_ID, { calculator: 'ABCD2', score: score }, 'ABCD2: ' + score + '/7 (' + riskCategory + ')');
    }

    // ----- ESRS (Essen Stroke Risk Score) -----
    function calcESRS() {
        var score = 0;
        if (document.getElementById('crs-esrs-htn').checked) score += 1;
        if (document.getElementById('crs-esrs-dm').checked) score += 1;
        if (document.getElementById('crs-esrs-mi').checked) score += 1;
        if (document.getElementById('crs-esrs-cvd').checked) score += 1;
        if (document.getElementById('crs-esrs-pad').checked) score += 1;
        if (document.getElementById('crs-esrs-smoker').checked) score += 1;
        if (document.getElementById('crs-esrs-prior').checked) score += 1;
        score += parseInt(document.getElementById('crs-esrs-age').value) || 0;

        var riskCategory = '';
        var riskColor = '';
        if (score <= 2) {
            riskCategory = 'Low risk (<4% annual recurrence rate)';
            riskColor = 'var(--success)';
        } else {
            riskCategory = 'High risk (\u22654% annual recurrence rate)';
            riskColor = 'var(--danger)';
        }

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + score + ' / 9</div>';
        html += '<div class="result-label">Essen Stroke Risk Score (ESRS)</div>';
        html += '<div class="result-detail mt-1" style="color:' + riskColor + ';font-weight:600">'
            + riskCategory + '</div>';

        // Interpretation
        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value">' + score + '</div><div class="result-item-label">Total Score</div></div>'
            + '<div class="result-item"><div class="result-item-value" style="color:' + riskColor + '">' + (score <= 2 ? 'Low' : 'High') + '</div><div class="result-item-label">Risk Category</div></div>'
            + '</div>';

        html += '<div class="card-title mt-2">Risk Stratification</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Score</th><th>Risk Level</th><th>Annual Recurrence Rate</th></tr></thead><tbody>';
        var esrsRows = [
            { range: '0\u20132', level: 'Low', rate: '<4%', match: score <= 2 },
            { range: '\u22653', level: 'High', rate: '\u22654%', match: score >= 3 }
        ];
        esrsRows.forEach(function(r) {
            var rowStyle = r.match ? ' style="background:var(--accent-muted);font-weight:600"' : '';
            html += '<tr' + rowStyle + '><td>' + r.range + '</td><td>' + r.level + '</td><td class="num">' + r.rate + '</td></tr>';
        });
        html += '</tbody></table></div>';

        html += '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:8px">The ESRS identifies patients with ischemic stroke or TIA who are at high risk for recurrent cardiovascular events. Patients with ESRS \u22653 may benefit from more aggressive secondary prevention strategies.</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'ESRS: ' + score + '/9. ' + riskCategory + '.\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('crs-esrs-results'), html);
        Export.addToHistory(MODULE_ID, { calculator: 'ESRS', score: score }, 'ESRS: ' + score + '/9 (' + (score <= 2 ? 'Low' : 'High') + ' risk)');
    }

    // ----- SEDAN -----
    function calcSEDAN() {
        var score = 0;
        if (document.getElementById('crs-sedan-sugar').checked) score += 1;
        if (document.getElementById('crs-sedan-infarct').checked) score += 1;
        if (document.getElementById('crs-sedan-dense').checked) score += 1;
        if (document.getElementById('crs-sedan-age').checked) score += 1;
        if (document.getElementById('crs-sedan-nihss').checked) score += 1;

        var sichRisk = sedanRisk[Math.min(score, 5)];

        var riskColor = '';
        if (score <= 1) {
            riskColor = 'var(--success)';
        } else if (score <= 3) {
            riskColor = 'var(--warning)';
        } else {
            riskColor = 'var(--danger)';
        }

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + score + ' / 5</div>';
        html += '<div class="result-label">SEDAN Score</div>';
        html += '<div class="result-detail">Estimated sICH risk: <span style="color:' + riskColor + ';font-weight:600">' + sichRisk + '%</span></div>';

        // Risk table
        html += '<div class="card-title mt-2">sICH Risk by SEDAN Score</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Score</th><th>sICH Risk</th></tr></thead><tbody>';
        for (var i = 0; i <= 5; i++) {
            var rowStyle = i === score ? ' style="background:var(--accent-muted);font-weight:600"' : '';
            html += '<tr' + rowStyle + '><td>' + i + '</td><td class="num">' + sedanRisk[i] + '%</td></tr>';
        }
        html += '</tbody></table></div>';

        html += '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:8px">The SEDAN score predicts the risk of symptomatic intracerebral hemorrhage (sICH) after intravenous thrombolysis for acute ischemic stroke. Higher scores indicate greater hemorrhagic transformation risk.</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'SEDAN Score: ' + score + '/5. sICH risk: ' + sichRisk + '%.\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('crs-sedan-results'), html);
        Export.addToHistory(MODULE_ID, { calculator: 'SEDAN', score: score }, 'SEDAN: ' + score + '/5 (sICH risk: ' + sichRisk + '%)');
    }

    // ----- DRAGON -----
    function calcDRAGON() {
        var score = 0;
        if (document.getElementById('crs-dragon-dense').checked) score += 1;
        if (document.getElementById('crs-dragon-infarct').checked) score += 1;
        if (document.getElementById('crs-dragon-mrs').checked) score += 1;
        if (document.getElementById('crs-dragon-glucose').checked) score += 1;
        if (document.getElementById('crs-dragon-onset').checked) score += 1;
        score += parseInt(document.getElementById('crs-dragon-age').value) || 0;
        score += parseInt(document.getElementById('crs-dragon-nihss').value) || 0;

        var goodOutcome = dragonOutcome[Math.min(score, 10)];

        var outcomeColor = '';
        var outcomeLabel = '';
        if (score <= 1) {
            outcomeColor = 'var(--success)';
            outcomeLabel = 'Excellent prognosis';
        } else if (score <= 3) {
            outcomeColor = 'var(--success)';
            outcomeLabel = 'Good prognosis';
        } else if (score <= 5) {
            outcomeColor = 'var(--warning)';
            outcomeLabel = 'Intermediate prognosis';
        } else if (score <= 7) {
            outcomeColor = 'var(--danger)';
            outcomeLabel = 'Poor prognosis';
        } else {
            outcomeColor = 'var(--danger)';
            outcomeLabel = 'Miserable outcome predicted';
        }

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + score + ' / 10</div>';
        html += '<div class="result-label">DRAGON Score</div>';
        html += '<div class="result-detail">Probability of good outcome (mRS 0\u20132 at 3 months): <span style="color:' + outcomeColor + ';font-weight:600">' + goodOutcome + '%</span></div>';
        html += '<div class="result-detail mt-1" style="color:' + outcomeColor + ';font-weight:600">'
            + outcomeLabel + '</div>';

        // Outcome table
        html += '<div class="card-title mt-2">Good Outcome (mRS 0\u20132) by DRAGON Score</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Score</th><th>Good Outcome (mRS 0\u20132)</th><th>Prognosis</th></tr></thead><tbody>';
        var dragonRows = [
            { range: '0\u20131', pct: '96%', label: 'Excellent', scores: [0, 1] },
            { range: '2', pct: '88%', label: 'Good', scores: [2] },
            { range: '3', pct: '78%', label: 'Good', scores: [3] },
            { range: '4\u20135', pct: '~50%', label: 'Intermediate', scores: [4, 5] },
            { range: '6\u20137', pct: '~20%', label: 'Poor', scores: [6, 7] },
            { range: '8\u201310', pct: '<5%', label: 'Miserable', scores: [8, 9, 10] }
        ];
        dragonRows.forEach(function(r) {
            var isMatch = r.scores.indexOf(score) !== -1;
            var rowStyle = isMatch ? ' style="background:var(--accent-muted);font-weight:600"' : '';
            html += '<tr' + rowStyle + '><td>' + r.range + '</td><td class="num">' + r.pct + '</td><td>' + r.label + '</td></tr>';
        });
        html += '</tbody></table></div>';

        html += '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:8px">The DRAGON score predicts functional outcome after IV thrombolysis for acute ischemic stroke. It can help with prognostication and shared decision-making, but should not be used alone to withhold treatment.</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'DRAGON Score: ' + score + '/10. Good outcome probability: ' + goodOutcome + '%. ' + outcomeLabel + '.\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('crs-dragon-results'), html);
        Export.addToHistory(MODULE_ID, { calculator: 'DRAGON', score: score }, 'DRAGON: ' + score + '/10 (' + goodOutcome + '% good outcome)');
    }

    // ===================================================================
    // EPIDEMIOLOGICAL CALCULATORS (existing, unchanged)
    // ===================================================================

    // ===== TAB A: Incidence Rate =====
    function calcIncidence() {
        var events = parseInt(document.getElementById('rc-ir-events').value);
        var pt = parseFloat(document.getElementById('rc-ir-pt').value);
        var multiplier = parseInt(document.getElementById('rc-ir-multiplier').value);
        var alpha = parseFloat(document.getElementById('rc-ir-alpha').value);

        if (isNaN(events) || isNaN(pt) || pt <= 0) {
            Export.showToast('Please enter valid numbers', 'error');
            return;
        }

        var result = Statistics.incidenceRate(events, pt, alpha);
        var rate = result.rate * multiplier;
        var ciLower = result.ci.lower * multiplier;
        var ciUpper = result.ci.upper * multiplier;

        var perLabel = 'per ' + multiplier.toLocaleString();

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + rate.toFixed(2) + ' ' + perLabel + '</div>';
        html += '<div class="result-label">Incidence Rate</div>';
        html += '<div class="result-detail">' + ((1 - alpha) * 100).toFixed(0) + '% CI: (' + ciLower.toFixed(2) + ', ' + ciUpper.toFixed(2) + ') ' + perLabel + '</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value">' + events + '</div><div class="result-item-label">Events</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + pt.toLocaleString() + '</div><div class="result-item-label">Person-Time</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + result.rate.toExponential(3) + '</div><div class="result-item-label">Raw Rate</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + ciLower.toFixed(2) + '</div><div class="result-item-label">Lower CI</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + ciUpper.toFixed(2) + '</div><div class="result-item-label">Upper CI</div></div>'
            + '<div class="result-item"><div class="result-item-value">Poisson Exact</div><div class="result-item-label">CI Method</div></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'Incidence rate: ' + rate.toFixed(2) + ' ' + perLabel + ' (' + ((1 - alpha) * 100).toFixed(0) + '% CI: ' + ciLower.toFixed(2) + ' to ' + ciUpper.toFixed(2) + ')\')">Copy Result</button>'
            + ' <button class="btn btn-xs r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.riskRateCalculators({events:' + events + ',pt:' + pt + ',alpha:' + alpha + ',per:' + per + '}), &quot;Incidence Rate Calculation&quot;)">'
            + '&#129513; R Script</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-incidence-results'), html);
        Export.addToHistory(MODULE_ID, { events: events, pt: pt }, 'IR: ' + rate.toFixed(2) + ' ' + perLabel);
    }

    // ===== TAB B: Rate Ratio =====
    function calcRateRatio() {
        var events1 = parseInt(document.getElementById('rc-rr-events1').value);
        var pt1 = parseFloat(document.getElementById('rc-rr-pt1').value);
        var events2 = parseInt(document.getElementById('rc-rr-events2').value);
        var pt2 = parseFloat(document.getElementById('rc-rr-pt2').value);

        if (isNaN(events1) || isNaN(pt1) || isNaN(events2) || isNaN(pt2) || pt1 <= 0 || pt2 <= 0 || events2 === 0) {
            Export.showToast('Please enter valid numbers. Unexposed events must be > 0.', 'error');
            return;
        }

        var result = Statistics.rateRatio(events1, pt1, events2, pt2);

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + result.ratio.toFixed(3) + '</div>';
        html += '<div class="result-label">Incidence Rate Ratio (IRR)</div>';
        html += '<div class="result-detail">95% CI: (' + result.ci.lower.toFixed(3) + ', ' + result.ci.upper.toFixed(3) + ')</div>';

        var significant = result.ci.lower > 1 || result.ci.upper < 1;
        html += '<div class="result-detail mt-1" style="color:' + (significant ? 'var(--accent)' : 'var(--text-tertiary)') + '">'
            + (result.ratio > 1
                ? 'The exposed group has a ' + ((result.ratio - 1) * 100).toFixed(1) + '% higher rate than the unexposed group.'
                : 'The exposed group has a ' + ((1 - result.ratio) * 100).toFixed(1) + '% lower rate than the unexposed group.')
            + (significant ? '' : ' (Not statistically significant at the 5% level.)')
            + '</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value">' + (events1 / pt1 * 100000).toFixed(1) + '</div><div class="result-item-label">Rate (Exposed) per 100K</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (events2 / pt2 * 100000).toFixed(1) + '</div><div class="result-item-label">Rate (Unexposed) per 100K</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + result.ratio.toFixed(3) + '</div><div class="result-item-label">IRR</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + Math.log(result.ratio).toFixed(4) + '</div><div class="result-item-label">ln(IRR)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + Math.sqrt(1 / events1 + 1 / events2).toFixed(4) + '</div><div class="result-item-label">SE of ln(IRR)</div></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'IRR: ' + result.ratio.toFixed(3) + ' (95% CI: ' + result.ci.lower.toFixed(3) + ' to ' + result.ci.upper.toFixed(3) + ')\')">Copy Result</button>'
            + ' <button class="btn btn-xs r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.riskRateRatio({events1:' + events1 + ',pt1:' + pt1 + ',events2:' + events2 + ',pt2:' + pt2 + '}), &quot;Incidence Rate Ratio&quot;)">'
            + '&#129513; R Script</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-rateratio-results'), html);
        Export.addToHistory(MODULE_ID, { events1: events1, pt1: pt1, events2: events2, pt2: pt2 }, 'IRR: ' + result.ratio.toFixed(3));
    }

    // ===== TAB C: Prevalence =====
    function calcPrevalence() {
        var x = parseInt(document.getElementById('rc-prev-x').value);
        var n = parseInt(document.getElementById('rc-prev-n').value);
        var alpha = parseFloat(document.getElementById('rc-prev-alpha').value);

        if (isNaN(x) || isNaN(n) || n <= 0 || x < 0 || x > n) {
            Export.showToast('Cases must be between 0 and total population', 'error');
            return;
        }

        var p = x / n;
        var cpCI = Statistics.clopperPearsonCI(x, n, alpha);
        var waldResult = Statistics.waldCI(p, n, Statistics.normalQuantile(1 - alpha / 2));
        var wilsonResult = Statistics.wilsonCI(p, n, Statistics.normalQuantile(1 - alpha / 2));

        var confLevel = ((1 - alpha) * 100).toFixed(0);

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + (p * 100).toFixed(2) + '%</div>';
        html += '<div class="result-label">Prevalence</div>';
        html += '<div class="result-detail">' + confLevel + '% Clopper-Pearson Exact CI: (' + (cpCI.lower * 100).toFixed(2) + '%, ' + (cpCI.upper * 100).toFixed(2) + '%)</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value">' + x + ' / ' + n + '</div><div class="result-item-label">Cases / Total</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (p * 100).toFixed(2) + '%</div><div class="result-item-label">Point Estimate</div></div>'
            + '</div>';

        // Compare CI methods
        html += '<div class="card-title mt-2">Confidence Interval Methods</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Method</th><th>Lower</th><th>Upper</th><th>Width</th></tr></thead><tbody>';
        html += '<tr style="background:var(--accent-muted)"><td>Clopper-Pearson (Exact)</td><td class="num">' + (cpCI.lower * 100).toFixed(3) + '%</td><td class="num">' + (cpCI.upper * 100).toFixed(3) + '%</td><td class="num">' + ((cpCI.upper - cpCI.lower) * 100).toFixed(3) + '%</td></tr>';
        html += '<tr><td>Wald</td><td class="num">' + (waldResult.lower * 100).toFixed(3) + '%</td><td class="num">' + (waldResult.upper * 100).toFixed(3) + '%</td><td class="num">' + ((waldResult.upper - waldResult.lower) * 100).toFixed(3) + '%</td></tr>';
        html += '<tr><td>Wilson Score</td><td class="num">' + (wilsonResult.lower * 100).toFixed(3) + '%</td><td class="num">' + (wilsonResult.upper * 100).toFixed(3) + '%</td><td class="num">' + ((wilsonResult.upper - wilsonResult.lower) * 100).toFixed(3) + '%</td></tr>';
        html += '</tbody></table></div>';

        html += '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:4px">Clopper-Pearson exact CI is recommended, especially for small samples and extreme proportions. Wilson score is preferred by some for moderate samples.</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'Prevalence: ' + (p * 100).toFixed(2) + '% (' + confLevel + '% CI: ' + (cpCI.lower * 100).toFixed(2) + '% to ' + (cpCI.upper * 100).toFixed(2) + '%; Clopper-Pearson exact)\')">Copy Result</button>'
            + ' <button class="btn btn-xs r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.riskRateCalculators({x:' + x + ',n:' + n + ',confLevel:' + (confLevel / 100) + '}), &quot;Prevalence Estimation&quot;)">'
            + '&#129513; R Script</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-prevalence-results'), html);
        Export.addToHistory(MODULE_ID, { x: x, n: n }, 'Prevalence: ' + (p * 100).toFixed(2) + '%');
    }

    // ===== TAB D: SMR =====
    function calcSMR() {
        var observed = parseInt(document.getElementById('rc-smr-obs').value);
        var expected = parseFloat(document.getElementById('rc-smr-exp').value);
        var alpha = parseFloat(document.getElementById('rc-smr-alpha').value);

        if (isNaN(observed) || isNaN(expected) || expected <= 0 || observed < 0) {
            Export.showToast('Please enter valid numbers', 'error');
            return;
        }

        var result = Statistics.smr(observed, expected, alpha);
        var confLevel = ((1 - alpha) * 100).toFixed(0);

        var color = result.smr > 1.0 ? 'var(--danger)' : result.smr < 1.0 ? 'var(--success)' : 'var(--text)';
        var significant = result.ci.lower > 1 || result.ci.upper < 1;

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value" style="color:' + color + '">' + result.smr.toFixed(3) + '</div>';
        html += '<div class="result-label">Standardized Mortality Ratio</div>';
        html += '<div class="result-detail">' + confLevel + '% CI: (' + result.ci.lower.toFixed(3) + ', ' + result.ci.upper.toFixed(3) + ')</div>';

        html += '<div class="result-detail mt-1">'
            + (result.smr > 1
                ? 'There were ' + ((result.smr - 1) * 100).toFixed(1) + '% more events than expected based on the reference population.'
                : result.smr < 1
                ? 'There were ' + ((1 - result.smr) * 100).toFixed(1) + '% fewer events than expected based on the reference population.'
                : 'Observed equals expected.')
            + (significant ? ' This is statistically significant.' : ' This is not statistically significant at the ' + (alpha * 100).toFixed(0) + '% level.')
            + '</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value">' + observed + '</div><div class="result-item-label">Observed</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + expected.toFixed(1) + '</div><div class="result-item-label">Expected</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + result.smr.toFixed(3) + '</div><div class="result-item-label">SMR</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (observed - expected).toFixed(1) + '</div><div class="result-item-label">Excess Events</div></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'SMR: ' + result.smr.toFixed(3) + ' (' + confLevel + '% CI: ' + result.ci.lower.toFixed(3) + ' to ' + result.ci.upper.toFixed(3) + '); Observed=' + observed + ', Expected=' + expected.toFixed(1) + '\')">Copy Result</button>'
            + ' <button class="btn btn-xs r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.riskSMR({observed:' + observed + ',expected:' + expected + ',alpha:' + alpha + '}), &quot;Standardized Mortality Ratio&quot;)">'
            + '&#129513; R Script</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-smr-results'), html);
        Export.addToHistory(MODULE_ID, { observed: observed, expected: expected }, 'SMR: ' + result.smr.toFixed(3));
    }

    // ===== TAB E: Age Standardization =====
    function addDefaultAgeRows() {
        var defaultGroups = [
            { ageGroup: '0-44', events: 5, population: 50000, weight: 59490 },
            { ageGroup: '45-54', events: 20, population: 15000, weight: 13458 },
            { ageGroup: '55-64', events: 45, population: 12000, weight: 8723 },
            { ageGroup: '65-74', events: 80, population: 8000, weight: 6601 },
            { ageGroup: '75-84', events: 110, population: 5000, weight: 4445 },
            { ageGroup: '85+', events: 60, population: 2000, weight: 1688 }
        ];
        defaultGroups.forEach(function(g) {
            ageRowIdCounter++;
            ageRows.push({ id: ageRowIdCounter, ageGroup: g.ageGroup, events: g.events, population: g.population, weight: g.weight });
        });
        renderAgeRows();
    }

    function addAgeRow() {
        ageRowIdCounter++;
        ageRows.push({ id: ageRowIdCounter, ageGroup: '', events: 0, population: 0, weight: 0 });
        renderAgeRows();
    }

    function removeAgeRow(id) {
        ageRows = ageRows.filter(function(r) { return r.id !== id; });
        renderAgeRows();
    }

    function clearAgeRows() {
        ageRows = [];
        ageRowIdCounter = 0;
        renderAgeRows();
    }

    function renderAgeRows() {
        var el = document.getElementById('rc-age-rows');
        if (!el) return;

        if (ageRows.length === 0) {
            App.setTrustedHTML(el, '<div style="color:var(--text-tertiary);font-size:0.85rem;padding:8px">No age groups. Add rows or load a preset.</div>');
            return;
        }

        var html = '<div class="table-scroll-wrap"><table class="data-table"><thead><tr>'
            + '<th>Age Group</th><th>Events</th><th>Study Population</th><th>Standard Pop Weight</th><th>Crude Rate</th><th></th>'
            + '</tr></thead><tbody>';

        ageRows.forEach(function(row) {
            var crudeRate = row.population > 0 ? (row.events / row.population * 100000).toFixed(1) : '--';
            html += '<tr>'
                + '<td><input type="text" class="form-input form-input--small" value="' + row.ageGroup + '" onchange="RiskCalc.updateAgeRow(' + row.id + ', \'ageGroup\', this.value)" style="width:80px"></td>'
                + '<td><input type="number" class="form-input form-input--small" value="' + row.events + '" onchange="RiskCalc.updateAgeRow(' + row.id + ', \'events\', this.value)" style="width:80px"></td>'
                + '<td><input type="number" class="form-input form-input--small" value="' + row.population + '" onchange="RiskCalc.updateAgeRow(' + row.id + ', \'population\', this.value)" style="width:100px"></td>'
                + '<td><input type="number" class="form-input form-input--small" value="' + row.weight + '" onchange="RiskCalc.updateAgeRow(' + row.id + ', \'weight\', this.value)" style="width:100px"></td>'
                + '<td class="num">' + crudeRate + '</td>'
                + '<td><button class="btn btn-xs btn-secondary" onclick="RiskCalc.removeAgeRow(' + row.id + ')">X</button></td>'
                + '</tr>';
        });

        html += '</tbody></table></div>';
        App.setTrustedHTML(el, html);
    }

    function updateAgeRow(id, field, value) {
        var row = ageRows.find(function(r) { return r.id === id; });
        if (!row) return;
        if (field === 'ageGroup') {
            row.ageGroup = value;
        } else {
            row[field] = parseFloat(value) || 0;
        }
        renderAgeRows();
    }

    function loadStdPop() {
        var key = document.getElementById('rc-std-pop').value;
        if (!key) return;

        var stdPop = References.standardPopulations[key];
        if (!stdPop) return;

        // Replace age rows with preset
        ageRows = [];
        ageRowIdCounter = 0;
        stdPop.forEach(function(ag) {
            ageRowIdCounter++;
            ageRows.push({ id: ageRowIdCounter, ageGroup: ag.ageGroup, events: 0, population: 0, weight: ag.weight });
        });
        renderAgeRows();
        Export.showToast('Loaded ' + key + ' standard population weights');
    }

    function calcAgeStd() {
        if (ageRows.length === 0) {
            Export.showToast('Add age groups first', 'error');
            return;
        }

        var multiplier = parseInt(document.getElementById('rc-agestd-multiplier').value);

        // Check for valid data
        var validRows = ageRows.filter(function(r) { return r.population > 0 && r.weight > 0; });
        if (validRows.length === 0) {
            Export.showToast('Please enter population and weight for at least one age group', 'error');
            return;
        }

        // Prepare data for Statistics.directStandardization
        var ageRates = validRows.map(function(r) {
            return { events: r.events, population: r.population, standardPop: r.weight };
        });

        var result = Statistics.directStandardization(ageRates);

        var adjustedRate = result.rate * multiplier;
        var adjustedSE = result.se * multiplier;
        var adjustedCILower = result.ci.lower * multiplier;
        var adjustedCIUpper = result.ci.upper * multiplier;

        // Crude rate
        var totalEvents = validRows.reduce(function(s, r) { return s + r.events; }, 0);
        var totalPop = validRows.reduce(function(s, r) { return s + r.population; }, 0);
        var crudeRate = (totalEvents / totalPop) * multiplier;

        var perLabel = 'per ' + multiplier.toLocaleString();

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + adjustedRate.toFixed(2) + ' ' + perLabel + '</div>';
        html += '<div class="result-label">Age-Standardized Rate (Direct Method)</div>';
        html += '<div class="result-detail">95% CI: (' + adjustedCILower.toFixed(2) + ', ' + adjustedCIUpper.toFixed(2) + ') ' + perLabel + '</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value">' + crudeRate.toFixed(2) + '</div><div class="result-item-label">Crude Rate ' + perLabel + '</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + adjustedRate.toFixed(2) + '</div><div class="result-item-label">Standardized Rate</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + totalEvents + '</div><div class="result-item-label">Total Events</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + totalPop.toLocaleString() + '</div><div class="result-item-label">Total Population</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + validRows.length + '</div><div class="result-item-label">Age Strata</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + adjustedSE.toFixed(3) + '</div><div class="result-item-label">SE ' + perLabel + '</div></div>'
            + '</div>';

        // Detail table
        html += '<div class="card-title mt-2">Age-Specific Rates</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Age Group</th><th>Events</th><th>Population</th><th>Crude Rate</th><th>Weight</th><th>Weighted Rate</th></tr></thead><tbody>';
        var totalWeight = validRows.reduce(function(s, r) { return s + r.weight; }, 0);
        validRows.forEach(function(r) {
            var cr = r.events / r.population * multiplier;
            var wr = (r.events / r.population) * r.weight;
            html += '<tr>'
                + '<td>' + r.ageGroup + '</td>'
                + '<td class="num">' + r.events + '</td>'
                + '<td class="num">' + r.population.toLocaleString() + '</td>'
                + '<td class="num">' + cr.toFixed(1) + '</td>'
                + '<td class="num">' + r.weight + '</td>'
                + '<td class="num">' + (wr / totalWeight * multiplier).toFixed(2) + '</td>'
                + '</tr>';
        });
        html += '</tbody></table></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'Age-standardized rate: ' + adjustedRate.toFixed(2) + ' ' + perLabel + ' (95% CI: ' + adjustedCILower.toFixed(2) + ' to ' + adjustedCIUpper.toFixed(2) + '). Crude rate: ' + crudeRate.toFixed(2) + ' ' + perLabel + '.\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-agestd-results'), html);
        Export.addToHistory(MODULE_ID, { ageGroups: validRows.length, totalEvents: totalEvents }, 'Age-std rate: ' + adjustedRate.toFixed(2) + ' ' + perLabel);
    }

    // ===== TAB F: Attributable Risk =====
    function calcAR() {
        var re = parseFloat(document.getElementById('rc-ar-re').value);
        var ru = parseFloat(document.getElementById('rc-ar-ru').value);
        var pe = parseFloat(document.getElementById('rc-ar-pe').value);
        var ne = parseInt(document.getElementById('rc-ar-ne').value) || null;
        var nu = parseInt(document.getElementById('rc-ar-nu').value) || null;

        if (isNaN(re) || isNaN(ru) || isNaN(pe) || re < 0 || ru < 0) {
            Export.showToast('Please enter valid rates', 'error');
            return;
        }

        // Attributable Risk (AR) = Risk difference
        var ar = re - ru;

        // Relative Risk
        var rr = ru > 0 ? re / ru : Infinity;

        // Attributable Fraction in Exposed (AFe)
        var afe = rr > 0 ? (rr - 1) / rr : 0;

        // Population Attributable Fraction (PAF) using Levin's formula
        var paf = (pe * (rr - 1)) / (1 + pe * (rr - 1));

        // Population Attributable Risk (PAR)
        var totalRate = pe * re + (1 - pe) * ru;
        var par = totalRate - ru;

        // CIs for AR if sample sizes available
        var arCILower = null, arCIUpper = null;
        if (ne && nu && ne > 0 && nu > 0) {
            var seAR = Math.sqrt(re * (1 - re) / ne + ru * (1 - ru) / nu);
            var z = Statistics.normalQuantile(0.975);
            arCILower = ar - z * seAR;
            arCIUpper = ar + z * seAR;
        }

        var html = '<div class="result-panel animate-in">';
        html += '<div class="card-title">Attributable Risk Measures</div>';

        html += '<div class="result-grid mt-1">'
            + '<div class="result-item"><div class="result-item-value">' + (ar * 100).toFixed(2) + '%</div><div class="result-item-label">Attributable Risk (AR)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + rr.toFixed(3) + '</div><div class="result-item-label">Relative Risk (RR)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (afe * 100).toFixed(1) + '%</div><div class="result-item-label">AF<sub>exposed</sub></div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (paf * 100).toFixed(1) + '%</div><div class="result-item-label">PAF</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (par * 100).toFixed(3) + '%</div><div class="result-item-label">Population AR</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (ar !== 0 ? Math.round(1 / Math.abs(ar)) : '--') + '</div><div class="result-item-label">' + (ar > 0 ? 'NNH' : 'NNT') + '</div></div>'
            + '</div>';

        if (arCILower !== null) {
            html += '<div class="result-detail mt-1">AR 95% CI: (' + (arCILower * 100).toFixed(2) + '%, ' + (arCIUpper * 100).toFixed(2) + '%)</div>';
        }

        // Interpretation
        html += '<div class="card-title mt-2">Interpretation</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Measure</th><th>Value</th><th>Interpretation</th></tr></thead><tbody>';
        html += '<tr><td>AR</td><td class="num">' + (ar * 100).toFixed(2) + '%</td>'
            + '<td>The excess risk in the exposed group attributable to the exposure is ' + (Math.abs(ar) * 100).toFixed(2) + ' per 100 persons.</td></tr>';
        html += '<tr><td>AF<sub>e</sub></td><td class="num">' + (afe * 100).toFixed(1) + '%</td>'
            + '<td>' + (afe * 100).toFixed(1) + '% of cases among the exposed can be attributed to the exposure.</td></tr>';
        html += '<tr><td>PAF</td><td class="num">' + (paf * 100).toFixed(1) + '%</td>'
            + '<td>' + (paf * 100).toFixed(1) + '% of all cases in the population could theoretically be prevented by eliminating the exposure.</td></tr>';
        html += '<tr><td>PAR</td><td class="num">' + (par * 100).toFixed(3) + '%</td>'
            + '<td>The absolute excess rate in the population attributable to the exposure.</td></tr>';
        html += '</tbody></table></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'Attributable Risk: ' + (ar * 100).toFixed(2) + '%; RR=' + rr.toFixed(3) + '; AF(exposed)=' + (afe * 100).toFixed(1) + '%; PAF=' + (paf * 100).toFixed(1) + '%\')">Copy Result</button>'
            + ' <button class="btn btn-xs r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.riskAttributable({re:' + re + ',ru:' + ru + ',pe:' + pe + '}), &quot;Attributable Risk Measures&quot;)">'
            + '&#129513; R Script</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-ar-results'), html);
        Export.addToHistory(MODULE_ID, { re: re, ru: ru, pe: pe }, 'PAF: ' + (paf * 100).toFixed(1) + '%');
    }

    // ===== TAB G: DALY / YLL =====
    function setDW(value) {
        var el = document.getElementById('rc-yld-dw');
        if (el) el.value = value;
    }

    function calcDALY() {
        var deaths = parseInt(document.getElementById('rc-yll-deaths').value);
        var ageAtDeath = parseFloat(document.getElementById('rc-yll-age').value);
        var lifeExpectancy = parseFloat(document.getElementById('rc-yll-le').value);

        var cases = parseInt(document.getElementById('rc-yld-cases').value);
        var duration = parseFloat(document.getElementById('rc-yld-duration').value);
        var dw = parseFloat(document.getElementById('rc-yld-dw').value);

        if (isNaN(deaths) || isNaN(lifeExpectancy) || isNaN(cases) || isNaN(duration) || isNaN(dw)) {
            Export.showToast('Please enter valid numbers', 'error');
            return;
        }

        // YLL = Number of deaths x Remaining life expectancy at age of death
        var yll = deaths * lifeExpectancy;

        // YLD = Number of cases x Duration x Disability weight
        var yld = cases * duration * dw;

        // DALY = YLL + YLD
        var daly = yll + yld;

        // Per-death and per-case metrics
        var yllPerDeath = deaths > 0 ? lifeExpectancy : 0;
        var yldPerCase = cases > 0 ? duration * dw : 0;
        var dalyPerCase = cases > 0 ? daly / cases : 0;

        // Proportion
        var yllPct = daly > 0 ? (yll / daly * 100) : 0;
        var yldPct = daly > 0 ? (yld / daly * 100) : 0;

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + daly.toFixed(1) + ' DALYs</div>';
        html += '<div class="result-label">Disability-Adjusted Life Years</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value" style="color:var(--danger)">' + yll.toFixed(1) + '</div><div class="result-item-label">YLL (Years of Life Lost)</div></div>'
            + '<div class="result-item"><div class="result-item-value" style="color:var(--warning)">' + yld.toFixed(1) + '</div><div class="result-item-label">YLD (Years Lived with Disability)</div></div>'
            + '<div class="result-item"><div class="result-item-value" style="color:var(--accent)">' + daly.toFixed(1) + '</div><div class="result-item-label">DALY (YLL + YLD)</div></div>'
            + '</div>';

        // Detail table
        html += '<div class="card-title mt-2">Calculation Details</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Component</th><th>Formula</th><th>Value</th><th>% of DALY</th></tr></thead><tbody>';
        html += '<tr><td>YLL</td><td class="num">' + deaths + ' deaths x ' + lifeExpectancy.toFixed(1) + ' years</td><td class="num" style="color:var(--danger)">' + yll.toFixed(1) + '</td><td class="num">' + yllPct.toFixed(1) + '%</td></tr>';
        html += '<tr><td>YLD</td><td class="num">' + cases + ' cases x ' + duration.toFixed(1) + ' years x ' + dw.toFixed(3) + '</td><td class="num" style="color:var(--warning)">' + yld.toFixed(1) + '</td><td class="num">' + yldPct.toFixed(1) + '%</td></tr>';
        html += '<tr style="font-weight:bold"><td>DALY</td><td class="num">YLL + YLD</td><td class="num" style="color:var(--accent)">' + daly.toFixed(1) + '</td><td class="num">100%</td></tr>';
        html += '</tbody></table></div>';

        // Per-case metrics
        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value">' + yllPerDeath.toFixed(1) + '</div><div class="result-item-label">YLL per Death</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + yldPerCase.toFixed(2) + '</div><div class="result-item-label">YLD per Case</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + dalyPerCase.toFixed(2) + '</div><div class="result-item-label">DALY per Case</div></div>'
            + '</div>';

        // Stroke context
        html += '<div class="card-title mt-2">Stroke Burden Context</div>';
        html += '<div style="padding:12px;background:var(--surface);border-radius:8px;color:var(--text-secondary);font-size:0.85rem;line-height:1.6">'
            + '<ul style="margin:0;padding-left:16px">'
            + '<li>Stroke is the 2nd leading cause of death and 3rd leading cause of disability worldwide (GBD 2019).</li>'
            + '<li>Global stroke DALYs: ~116 million in 2019, with ischemic stroke contributing ~63%.</li>'
            + '<li>YLL typically dominates in low-income settings; YLD contributes more in high-income countries due to better acute survival.</li>'
            + '<li>In this calculation, YLL accounts for <strong>' + yllPct.toFixed(0) + '%</strong> of total DALYs.</li>'
            + '</ul></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'DALY: ' + daly.toFixed(1) + ' (YLL=' + yll.toFixed(1) + ', YLD=' + yld.toFixed(1) + '). Deaths=' + deaths + ' (avg age ' + ageAtDeath.toFixed(1) + '), Cases=' + cases + ', DW=' + dw.toFixed(3) + '.\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-daly-results'), html);
        Export.addToHistory(MODULE_ID, { deaths: deaths, cases: cases, dw: dw }, 'DALY: ' + daly.toFixed(1));
    }

    // ===================================================================
    // EXTRA TAB SWITCHING (Card 3)
    // ===================================================================
    function switchExtraTab(tabId) {
        document.querySelectorAll('#extra-tabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tabId); });
        var ids = ['framingham', 'ascvd', 'ichscore', 'mrs'];
        ids.forEach(function(id) {
            var el = document.getElementById('tab-extra-' + id);
            if (el) el.classList.toggle('active', id === tabId);
        });
    }

    // ===================================================================
    // FRAMINGHAM RISK SCORE (Simplified)
    // ===================================================================
    function calcFramingham() {
        var sex = document.getElementById('rc-fram-sex').value;
        var age = parseInt(document.getElementById('rc-fram-age').value) || 55;
        var chol = parseInt(document.getElementById('rc-fram-chol').value) || 220;
        var hdl = parseInt(document.getElementById('rc-fram-hdl').value) || 50;
        var sbp = parseInt(document.getElementById('rc-fram-sbp').value) || 140;
        var bpTx = document.getElementById('rc-fram-bptx').value === 'yes';
        var smoker = document.getElementById('rc-fram-smoker').checked;
        var diabetes = document.getElementById('rc-fram-diabetes').checked;

        // Simplified Framingham point-based estimation
        var points = 0;
        if (sex === 'male') {
            if (age >= 70) points += 13; else if (age >= 65) points += 12; else if (age >= 60) points += 11; else if (age >= 55) points += 10; else if (age >= 50) points += 8; else if (age >= 45) points += 6; else if (age >= 40) points += 5; else if (age >= 35) points += 2; else points += 0;
            if (chol >= 280) points += 3; else if (chol >= 240) points += 2; else if (chol >= 200) points += 1; else if (chol >= 160) points += 0; else points += -1;
            if (hdl < 35) points += 2; else if (hdl < 45) points += 1; else if (hdl < 50) points += 0; else if (hdl < 60) points += -1; else points += -2;
            if (bpTx) { if (sbp >= 160) points += 3; else if (sbp >= 140) points += 2; else if (sbp >= 130) points += 1; else points += 0; }
            else { if (sbp >= 160) points += 2; else if (sbp >= 140) points += 1; else points += 0; }
            if (smoker) points += 4;
            if (diabetes) points += 3;
        } else {
            if (age >= 70) points += 16; else if (age >= 65) points += 14; else if (age >= 60) points += 13; else if (age >= 55) points += 11; else if (age >= 50) points += 9; else if (age >= 45) points += 7; else if (age >= 40) points += 4; else if (age >= 35) points += 2; else points += 0;
            if (chol >= 280) points += 3; else if (chol >= 240) points += 2; else if (chol >= 200) points += 1; else if (chol >= 160) points += 0; else points += -1;
            if (hdl < 35) points += 2; else if (hdl < 45) points += 1; else if (hdl < 50) points += 0; else if (hdl < 60) points += -1; else points += -2;
            if (bpTx) { if (sbp >= 160) points += 4; else if (sbp >= 140) points += 3; else if (sbp >= 130) points += 2; else points += 1; }
            else { if (sbp >= 160) points += 3; else if (sbp >= 140) points += 2; else if (sbp >= 130) points += 1; else points += 0; }
            if (smoker) points += 3;
            if (diabetes) points += 4;
        }

        // Approximate 10-year risk lookup
        var riskLookupMale = { '-3': 1, '-2': 1, '-1': 1, '0': 2, '1': 2, '2': 3, '3': 4, '4': 5, '5': 6, '6': 8, '7': 10, '8': 12, '9': 14, '10': 16, '11': 20, '12': 25, '13': 30 };
        var riskLookupFemale = { '-2': 1, '-1': 1, '0': 1, '1': 1, '2': 2, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '10': 10, '11': 12, '12': 14, '13': 17, '14': 20, '15': 24, '16': 27 };

        var lookup = sex === 'male' ? riskLookupMale : riskLookupFemale;
        var clampedPts = Math.max(sex === 'male' ? -3 : -2, Math.min(points, sex === 'male' ? 13 : 16));
        var risk10yr = lookup[String(clampedPts)] || (clampedPts > 13 ? 30 : 1);

        var riskColor = risk10yr < 10 ? 'var(--success)' : risk10yr < 20 ? 'var(--warning)' : 'var(--danger)';
        var riskCategory = risk10yr < 10 ? 'Low risk' : risk10yr < 20 ? 'Intermediate risk' : 'High risk';

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value" style="color:' + riskColor + '">' + risk10yr + '%</div>';
        html += '<div class="result-label">Estimated 10-Year CVD Risk (Framingham)</div>';
        html += '<div class="result-detail mt-1" style="color:' + riskColor + ';font-weight:600">' + riskCategory + ' (Points: ' + points + ')</div>';
        html += '<div class="result-grid mt-2">';
        html += '<div class="result-item"><div class="result-item-value">' + age + '</div><div class="result-item-label">Age</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + chol + '</div><div class="result-item-label">Total Chol</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + hdl + '</div><div class="result-item-label">HDL</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + sbp + '</div><div class="result-item-label">SBP</div></div>';
        html += '</div>';
        html += '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:8px">Simplified Framingham Risk Score. Low risk: &lt;10%; Intermediate: 10-19%; High: &ge;20%.</div>';
        html += '<div style="margin-top:8px;font-size:0.8rem;color:var(--warning);">Note: This is a simplified Framingham risk estimate. The full model includes age-cholesterol and age-smoking interaction terms. For clinical decisions, use the ACC/AHA Pooled Cohort Equations (ASCVD calculator in this module) which is the current standard.</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'Framingham 10-yr CVD risk: ' + risk10yr + '% (' + riskCategory + '). Points: ' + points + '. Age ' + age + ', TC ' + chol + ', HDL ' + hdl + ', SBP ' + sbp + '.\')">Copy Result</button></div>';
        html += '</div>';
        App.setTrustedHTML(document.getElementById('rc-framingham-results'), html);
    }

    // ===================================================================
    // ASCVD 10-YEAR RISK (Simplified PCE approximation)
    // ===================================================================
    function calcASCVD() {
        var sex = document.getElementById('rc-ascvd-sex').value;
        var race = document.getElementById('rc-ascvd-race').value;
        var age = parseInt(document.getElementById('rc-ascvd-age').value) || 55;
        var chol = parseInt(document.getElementById('rc-ascvd-chol').value) || 220;
        var hdl = parseInt(document.getElementById('rc-ascvd-hdl').value) || 50;
        var sbp = parseInt(document.getElementById('rc-ascvd-sbp').value) || 140;
        var bpTx = document.getElementById('rc-ascvd-bptx').value === 'yes';
        var smoker = document.getElementById('rc-ascvd-smoker').checked;
        var diabetes = document.getElementById('rc-ascvd-diabetes').checked;

        // PCE coefficients (log-transformed)
        var coeffs;
        if (sex === 'male' && race === 'white') {
            coeffs = { lnAge: 12.344, lnChol: 11.853, lnAgeChol: -2.664, lnHDL: -7.990, lnAgeHDL: 1.769, lnSBPTx: 1.797, lnSBPUntx: 1.764, lnAgeSBP: 0, smoke: 7.837, lnAgeSmoke: -1.795, dm: 0.658, base: 0.9144, mean: 61.18 };
        } else if (sex === 'male' && race === 'aa') {
            coeffs = { lnAge: 2.469, lnChol: 0.302, lnAgeChol: 0, lnHDL: -0.307, lnAgeHDL: 0, lnSBPTx: 1.916, lnSBPUntx: 1.809, lnAgeSBP: 0, smoke: 0.549, lnAgeSmoke: 0, dm: 0.645, base: 0.8954, mean: 19.54 };
        } else if (sex === 'female' && race === 'white') {
            coeffs = { lnAge: -29.799, lnChol: 13.540, lnAgeChol: -3.114, lnHDL: -13.578, lnAgeHDL: 3.149, lnSBPTx: 2.019, lnSBPUntx: 1.957, lnAgeSBP: 0, smoke: 7.574, lnAgeSmoke: -1.665, dm: 0.661, base: 0.9665, mean: -29.18 };
        } else {
            coeffs = { lnAge: 17.114, lnChol: 0.940, lnAgeChol: 0, lnHDL: -18.920, lnAgeHDL: 4.475, lnSBPTx: 29.291, lnSBPUntx: 27.820, lnAgeSBP: -6.432, smoke: 0.691, lnAgeSmoke: 0, dm: 0.874, base: 0.9533, mean: 86.61 };
        }

        var lnAge = Math.log(age);
        var lnChol = Math.log(chol);
        var lnHDL = Math.log(hdl);
        var lnSBP = Math.log(sbp);

        var indSum = coeffs.lnAge * lnAge
            + coeffs.lnChol * lnChol
            + coeffs.lnAgeChol * lnAge * lnChol
            + coeffs.lnHDL * lnHDL
            + coeffs.lnAgeHDL * lnAge * lnHDL
            + (bpTx ? coeffs.lnSBPTx : coeffs.lnSBPUntx) * lnSBP
            + coeffs.lnAgeSBP * lnAge * lnSBP
            + (smoker ? coeffs.smoke + coeffs.lnAgeSmoke * lnAge : 0)
            + (diabetes ? coeffs.dm : 0);

        var risk = 1 - Math.pow(coeffs.base, Math.exp(indSum - coeffs.mean));
        risk = Math.max(0, Math.min(1, risk));
        var riskPct = (risk * 100).toFixed(1);

        var riskColor = risk < 0.05 ? 'var(--success)' : risk < 0.075 ? 'var(--success)' : risk < 0.20 ? 'var(--warning)' : 'var(--danger)';
        var riskCat = risk < 0.05 ? 'Low risk' : risk < 0.075 ? 'Borderline risk' : risk < 0.20 ? 'Intermediate risk' : 'High risk';
        var statinRec = risk >= 0.20 ? 'High-intensity statin recommended' : risk >= 0.075 ? 'Moderate-to-high intensity statin recommended; consider risk enhancers' : risk >= 0.05 ? 'Consider statin if risk-enhancing factors present' : 'Statin not routinely recommended';

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value" style="color:' + riskColor + '">' + riskPct + '%</div>';
        html += '<div class="result-label">10-Year ASCVD Risk (Pooled Cohort Equations)</div>';
        html += '<div class="result-detail mt-1" style="color:' + riskColor + ';font-weight:600">' + riskCat + '</div>';
        html += '<div class="result-detail">' + statinRec + '</div>';

        html += '<div class="card-title mt-2">Risk Categories (2018 ACC/AHA)</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>10-Year Risk</th><th>Category</th><th>Statin Recommendation</th></tr></thead><tbody>';
        var ascvdRows = [
            { range: '< 5%', cat: 'Low', rec: 'Not routinely recommended', match: risk < 0.05 },
            { range: '5 - 7.4%', cat: 'Borderline', rec: 'Consider if risk enhancers present', match: risk >= 0.05 && risk < 0.075 },
            { range: '7.5 - 19.9%', cat: 'Intermediate', rec: 'Moderate-to-high intensity; consider CAC score', match: risk >= 0.075 && risk < 0.20 },
            { range: '\u2265 20%', cat: 'High', rec: 'High-intensity statin therapy', match: risk >= 0.20 }
        ];
        ascvdRows.forEach(function(r) {
            var style = r.match ? ' style="background:var(--accent-muted);font-weight:600"' : '';
            html += '<tr' + style + '><td>' + r.range + '</td><td>' + r.cat + '</td><td>' + r.rec + '</td></tr>';
        });
        html += '</tbody></table></div>';

        html += '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:8px">Based on 2013 ACC/AHA Pooled Cohort Equations. Validated for ages 40-79, non-Hispanic White and African American populations. May over/underestimate risk in other populations.</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'ASCVD 10-yr risk: ' + riskPct + '% (' + riskCat + '). Age ' + age + ', ' + sex + ', ' + race + '.\')">Copy Result</button></div>';
        html += '</div>';
        App.setTrustedHTML(document.getElementById('rc-ascvd-results'), html);
    }

    // ===================================================================
    // ICH SCORE
    // ===================================================================
    var ichMortality = { 0: 0, 1: 13, 2: 26, 3: 72, 4: 97, 5: 100, 6: 100 };

    function calcICH() {
        var score = 0;
        score += parseInt(document.getElementById('rc-ich-gcs').value) || 0;
        score += parseInt(document.getElementById('rc-ich-age').value) || 0;
        score += parseInt(document.getElementById('rc-ich-volume').value) || 0;
        if (document.getElementById('rc-ich-ivh').checked) score += 1;
        if (document.getElementById('rc-ich-infratentorial').checked) score += 1;

        var mortality = ichMortality[Math.min(score, 6)];
        var mortColor = mortality < 20 ? 'var(--success)' : mortality < 50 ? 'var(--warning)' : 'var(--danger)';

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + score + ' / 6</div>';
        html += '<div class="result-label">ICH Score</div>';
        html += '<div class="result-detail">30-day mortality: <span style="color:' + mortColor + ';font-weight:600">' + mortality + '%</span></div>';

        html += '<div class="card-title mt-2">30-Day Mortality by ICH Score</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Score</th><th>30-Day Mortality</th></tr></thead><tbody>';
        for (var i = 0; i <= 6; i++) {
            var rowStyle = i === score ? ' style="background:var(--accent-muted);font-weight:600"' : '';
            html += '<tr' + rowStyle + '><td>' + i + '</td><td class="num">' + ichMortality[i] + '%</td></tr>';
        }
        html += '</tbody></table></div>';

        html += '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:8px">The ICH Score was developed by Hemphill et al. (2001) to predict 30-day mortality after ICH. It should NOT be used to make withdrawal-of-care decisions, as this creates a self-fulfilling prophecy. Use for prognostication and communication with families.</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'ICH Score: ' + score + '/6. 30-day mortality: ' + mortality + '%.\')">Copy Result</button></div>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-ich-results'), html);
        Export.addToHistory(MODULE_ID, { calculator: 'ICH Score', score: score }, 'ICH Score: ' + score + '/6 (' + mortality + '% 30-day mortality)');
    }

    // ===================================================================
    // mRS ASSESSMENT
    // ===================================================================
    function assessMRS() {
        var radios = document.querySelectorAll('input[name="rc-mrs-score"]');
        var score = 0;
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) { score = parseInt(radios[i].value); break; }
        }

        var labels = ['No symptoms', 'No significant disability', 'Slight disability', 'Moderate disability', 'Moderately severe disability', 'Severe disability', 'Dead'];
        var outcomeColor = score <= 1 ? 'var(--success)' : score <= 2 ? 'var(--success)' : score <= 3 ? 'var(--warning)' : 'var(--danger)';
        var outcomeLabel = score <= 2 ? 'Good outcome (functionally independent)' : score <= 4 ? 'Poor outcome (functionally dependent)' : score === 5 ? 'Very poor outcome (bedridden)' : 'Deceased';

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value" style="color:' + outcomeColor + '">' + score + '</div>';
        html += '<div class="result-label">Modified Rankin Scale</div>';
        html += '<div class="result-detail" style="font-weight:600">' + labels[score] + '</div>';
        html += '<div class="result-detail mt-1" style="color:' + outcomeColor + '">' + outcomeLabel + '</div>';

        html += '<div class="card-title mt-2">mRS Scale Reference</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Score</th><th>Description</th><th>Category</th></tr></thead><tbody>';
        var mrsCats = ['Good', 'Good', 'Good (independent)', 'Poor (dependent)', 'Poor (dependent)', 'Very poor', 'Dead'];
        for (var m = 0; m <= 6; m++) {
            var rs = m === score ? ' style="background:var(--accent-muted);font-weight:600"' : '';
            html += '<tr' + rs + '><td>' + m + '</td><td>' + labels[m] + '</td><td>' + mrsCats[m] + '</td></tr>';
        }
        html += '</tbody></table></div>';

        html += '<div style="margin-top:0.8rem;font-size:0.85rem;line-height:1.7;">';
        html += '<strong>Clinical Trial Interpretation:</strong><br>';
        html += 'mRS 0-1: Excellent outcome. mRS 0-2: Good outcome (functional independence). mRS 3-5: Dependent or worse. mRS 6: Dead.<br>';
        html += '<strong>Analysis approach:</strong> Ordinal shift analysis preferred over dichotomized (e.g., mRS 0-2 vs 3-6). Report full mRS distribution.';
        html += '</div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'mRS: ' + score + ' - ' + labels[score] + '. ' + outcomeLabel + '.\')">Copy Result</button></div>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-mrs-results'), html);
        Export.addToHistory(MODULE_ID, { calculator: 'mRS', score: score }, 'mRS: ' + score + ' (' + labels[score] + ')');
    }

    // ===================================================================
    // MULTI-SCORE COMPARISON
    // ===================================================================
    function calcMultiScore() {
        var age = parseInt(document.getElementById('rc-multi-age').value) || 72;
        var sex = document.getElementById('rc-multi-sex').value;
        var sbp = parseInt(document.getElementById('rc-multi-sbp').value) || 150;
        var htn = document.getElementById('rc-multi-htn').checked;
        var dm = document.getElementById('rc-multi-dm').checked;
        var chf = document.getElementById('rc-multi-chf').checked;
        var stroke = document.getElementById('rc-multi-stroke').checked;
        var vasc = document.getElementById('rc-multi-vasc').checked;
        var smoker = document.getElementById('rc-multi-smoker').checked;
        var af = document.getElementById('rc-multi-af').checked;

        var scores = [];

        // CHA2DS2-VASc (if AF)
        if (af) {
            var chadsScore = 0;
            if (chf) chadsScore += 1;
            if (htn) chadsScore += 1;
            if (dm) chadsScore += 1;
            if (stroke) chadsScore += 2;
            if (vasc) chadsScore += 1;
            if (sex === 'female') chadsScore += 1;
            if (age >= 75) chadsScore += 2; else if (age >= 65) chadsScore += 1;
            var chadsRisk = chadsVascRisk[Math.min(chadsScore, 9)];
            scores.push({ name: 'CHA\u2082DS\u2082-VASc', score: chadsScore + '/9', risk: chadsRisk + '% annual stroke risk', color: chadsScore <= 1 ? 'var(--success)' : chadsScore <= 3 ? 'var(--warning)' : 'var(--danger)' });
        }

        // HAS-BLED (if AF)
        if (af) {
            var hasbledScore = 0;
            if (htn && sbp > 160) hasbledScore += 1;
            if (stroke) hasbledScore += 1;
            if (age > 65) hasbledScore += 1;
            var hbRate = hasbledScore >= 5 ? hasBledRisk[5] : (hasBledRisk[hasbledScore] || hasBledRisk[0]);
            scores.push({ name: 'HAS-BLED', score: hasbledScore + '/9', risk: hbRate.toFixed(1) + ' bleeds/100 pt-yr', color: hasbledScore >= 3 ? 'var(--danger)' : 'var(--success)' });
        }

        // ESRS
        var esrsScore = 0;
        if (htn) esrsScore += 1;
        if (dm) esrsScore += 1;
        if (vasc) esrsScore += 1;
        if (smoker) esrsScore += 1;
        if (stroke) esrsScore += 1;
        if (age > 75) esrsScore += 2; else if (age >= 65) esrsScore += 1;
        scores.push({ name: 'ESRS', score: esrsScore + '/9', risk: esrsScore >= 3 ? '\u22654% annual recurrence' : '<4% annual recurrence', color: esrsScore >= 3 ? 'var(--danger)' : 'var(--success)' });

        var html = '<div class="result-panel animate-in">';
        html += '<div class="card-subtitle">Multi-Score Comparison for ' + (sex === 'male' ? 'Male' : 'Female') + ', Age ' + age + '</div>';

        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Score</th><th>Result</th><th>Risk Estimate</th></tr></thead><tbody>';
        for (var si = 0; si < scores.length; si++) {
            html += '<tr><td><strong>' + scores[si].name + '</strong></td><td class="num" style="color:' + scores[si].color + ';font-weight:600">' + scores[si].score + '</td><td>' + scores[si].risk + '</td></tr>';
        }
        html += '</tbody></table></div>';

        html += '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:8px">Scores calculated from shared patient data. Some scores require additional information not captured here (e.g., HAS-BLED labile INR, drug/alcohol use). CHA\u2082DS\u2082-VASc and HAS-BLED are only calculated when AF is indicated.</div>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('rc-multi-results'), html);
        multiScoreCache = scores;
    }

    var multiScoreCache = [];

    function copyMultiScore() {
        if (multiScoreCache.length === 0) calcMultiScore();
        var text = 'MULTI-SCORE COMPARISON\n' + '='.repeat(50) + '\n';
        for (var i = 0; i < multiScoreCache.length; i++) {
            text += multiScoreCache[i].name + ': ' + multiScoreCache[i].score + ' (' + multiScoreCache[i].risk + ')\n';
        }
        Export.copyText(text);
    }

    // Register module
    App.registerModule(MODULE_ID, { render: render });

    // Expose functions globally for onclick handlers
    window.RiskCalc = {
        switchTab: switchTab,
        switchCrsTab: switchCrsTab,
        switchExtraTab: switchExtraTab,
        calcCHADSVASc: calcCHADSVASc,
        calcHASBLED: calcHASBLED,
        calcABCD2: calcABCD2,
        calcESRS: calcESRS,
        calcSEDAN: calcSEDAN,
        calcDRAGON: calcDRAGON,
        calcIncidence: calcIncidence,
        calcRateRatio: calcRateRatio,
        calcPrevalence: calcPrevalence,
        calcSMR: calcSMR,
        addAgeRow: addAgeRow,
        removeAgeRow: removeAgeRow,
        clearAgeRows: clearAgeRows,
        updateAgeRow: updateAgeRow,
        loadStdPop: loadStdPop,
        calcAgeStd: calcAgeStd,
        calcAR: calcAR,
        setDW: setDW,
        calcDALY: calcDALY,
        calcFramingham: calcFramingham,
        calcASCVD: calcASCVD,
        calcICH: calcICH,
        assessMRS: assessMRS,
        calcMultiScore: calcMultiScore,
        copyMultiScore: copyMultiScore
    };
})();
