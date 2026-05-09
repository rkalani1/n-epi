/**
 * Neuro-Epi — Sample Size Calculator Module
 * Tabs: Two Proportions, Two Means, Time-to-Event, mRS Ordinal Shift,
 *       Non-Inferiority, Cluster RCT, Stepped-Wedge, Multi-Arm,
 *       Equivalence, Group Sequential, Crossover, Diagnostic Accuracy
 */

(function() {
    'use strict';

    var MODULE_ID = 'sample-size';

    /* ============================================================
     * Validation helpers
     * ============================================================ */

    function validateField(id, min, max, label) {
        var el = document.getElementById(id);
        if (!el) return null;
        var v = parseFloat(el.value);
        var msgId = id + '-err';
        var existing = document.getElementById(msgId);
        if (existing) existing.remove();
        if (isNaN(v) || v < min || v > max) {
            var msg = document.createElement('div');
            msg.id = msgId;
            msg.className = 'validation-error';
            msg.style.cssText = 'color:var(--danger);font-size:0.78rem;margin-top:2px;';
            msg.textContent = label + ' must be between ' + min + ' and ' + max;
            el.parentNode.appendChild(msg);
            el.style.borderColor = 'var(--danger)';
            return null;
        }
        el.style.borderColor = '';
        return v;
    }

    function clearValidation(id) {
        var el = document.getElementById(id);
        if (el) el.style.borderColor = '';
        var msgId = id + '-err';
        var existing = document.getElementById(msgId);
        if (existing) existing.remove();
    }

    /* ============================================================
     * Render
     * ============================================================ */

    function render(container) {
        var html = App.createModuleLayout(
            'Sample Size Calculator',
            'Calculate required sample sizes for clinical trials and observational studies. Includes presets for common clinical scenarios and publication-ready methods text.'
        );

        html += '<div class="card">';
        html += '<div class="tabs" id="ss-tabs" style="flex-wrap:wrap;">'
            + '<button class="tab active" data-tab="proportions" onclick="SampleSizeModule.switchTab(\'proportions\')">Two Proportions</button>'
            + '<button class="tab" data-tab="means" onclick="SampleSizeModule.switchTab(\'means\')">Two Means</button>'
            + '<button class="tab" data-tab="survival" onclick="SampleSizeModule.switchTab(\'survival\')">Time-to-Event</button>'
            + '<button class="tab" data-tab="ordinal" onclick="SampleSizeModule.switchTab(\'ordinal\')">mRS Ordinal Shift</button>'
            + '<button class="tab" data-tab="noninf" onclick="SampleSizeModule.switchTab(\'noninf\')">Non-Inferiority</button>'
            + '<button class="tab" data-tab="equivalence" onclick="SampleSizeModule.switchTab(\'equivalence\')">Equivalence</button>'
            + '<button class="tab" data-tab="crossover" onclick="SampleSizeModule.switchTab(\'crossover\')">Crossover</button>'
            + '<button class="tab" data-tab="diagnostic" onclick="SampleSizeModule.switchTab(\'diagnostic\')">Diagnostic Accuracy</button>'
            + '<button class="tab" data-tab="cluster" onclick="SampleSizeModule.switchTab(\'cluster\')">Cluster RCT</button>'
            + '<button class="tab" data-tab="stepped" onclick="SampleSizeModule.switchTab(\'stepped\')">Stepped-Wedge</button>'
            + '<button class="tab" data-tab="multiarm" onclick="SampleSizeModule.switchTab(\'multiarm\')">Multi-Arm</button>'
            + '<button class="tab" data-tab="groupseq" onclick="SampleSizeModule.switchTab(\'groupseq\')">Group Sequential</button>'
            + '</div>';

        // ===== TAB A: Two Proportions =====
        html += buildProportionsTab();

        // ===== TAB B: Two Means =====
        html += buildMeansTab();

        // ===== TAB C: Time-to-Event =====
        html += buildSurvivalTab();

        // ===== TAB D: mRS Ordinal Shift =====
        html += buildOrdinalTab();

        // ===== TAB E: Non-Inferiority =====
        html += buildNonInfTab();

        // ===== TAB F: Equivalence =====
        html += buildEquivalenceTab();

        // ===== TAB G: Crossover =====
        html += buildCrossoverTab();

        // ===== TAB H: Diagnostic Accuracy =====
        html += buildDiagnosticTab();

        // ===== TAB I: Cluster RCT =====
        html += buildClusterTab();

        // ===== TAB J: Stepped-Wedge =====
        html += buildSteppedTab();

        // ===== TAB K: Multi-Arm =====
        html += buildMultiArmTab();

        // ===== TAB L: Group Sequential =====
        html += buildGroupSeqTab();

        html += '</div>'; // end card

        // ===== LEARN SECTION =====
        html += buildLearnSection();

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    /* ============================================================
     * Common alpha/power/ratio/dropout row builder
     * ============================================================ */

    function commonParamsRow(prefix) {
        prefix = prefix || 'ss';
        return '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Significance Level (\u03B1)</label>'
            + '<select class="form-select" name="' + prefix + '_alpha" id="' + prefix + '_alpha"><option value="0.05" selected>0.05 (two-sided)</option><option value="0.01">0.01</option><option value="0.10">0.10</option></select></div>'
            + '<div class="form-group"><label class="form-label">Power (1-\u03B2)</label>'
            + '<select class="form-select" name="' + prefix + '_power" id="' + prefix + '_power"><option value="0.80" selected>80%</option><option value="0.85">85%</option><option value="0.90">90%</option><option value="0.95">95%</option></select></div>'
            + '<div class="form-group"><label class="form-label">Allocation Ratio ' + App.tooltip('Ratio of treatment to control (1 = equal)') + '</label>'
            + '<input type="number" class="form-input" name="' + prefix + '_ratio" id="' + prefix + '_ratio" step="0.5" min="0.5" max="4" value="1"></div>'
            + '<div class="form-group"><label class="form-label">Dropout Rate (%)</label>'
            + '<input type="number" class="form-input" name="' + prefix + '_dropout" id="' + prefix + '_dropout" step="1" min="0" max="50" value="10"></div>'
            + '</div>';
    }

    /* ============================================================
     * Tab builders
     * ============================================================ */

    function buildProportionsTab() {
        var html = '<div class="tab-content active" id="tab-proportions">';
        html += '<div class="card-subtitle">Most commonly used design in clinical trials. Compare event rates between two groups.</div>';

        html += '<div class="form-label">Common Presets ' + App.tooltip('Load common clinical trial scenarios with typical event rates') + '</div>';
        html += '<div class="preset-group">'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadPreset(\'lvo\')">Stroke: LVO mRS 0-2 (28% vs 46%)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadPreset(\'mortality\')">Mortality Trial (20% vs 14%)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadPreset(\'sich\')">AE Rate (6% vs 3%)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadPreset(\'recurrent\')">Event Prevention (5% vs 3.5%)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadPreset(\'ich\')">Moderate Effect (38% vs 30%)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadPreset(\'cardio\')">CV Events (12% vs 8%)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadPreset(\'onc\')">Oncology Response (30% vs 45%)</button>'
            + '</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Control Event Rate (p\u2081) ' + App.tooltip('Expected proportion with outcome in control group') + '</label>'
            + '<input type="number" class="form-input" name="ss_p1" id="ss_p1" step="0.01" min="0" max="1" value="0.28" oninput="SampleSizeModule.syncRates(\'p1\')"></div>'
            + '<div class="form-group"><label class="form-label">Treatment Event Rate (p\u2082)</label>'
            + '<input type="number" class="form-input" name="ss_p2" id="ss_p2" step="0.01" min="0" max="1" value="0.20" oninput="SampleSizeModule.syncRates(\'p2\')"></div>'
            + '<div class="form-group"><label class="form-label">Absolute Risk Reduction</label>'
            + '<input type="number" class="form-input" name="ss_arr" id="ss_arr" step="0.01" value="0.08" oninput="SampleSizeModule.syncRates(\'arr\')"></div>'
            + '</div>';

        html += commonParamsRow('ss');

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="SampleSizeModule.calculateProportions()">Calculate Sample Size</button>'
            + '</div>';

        html += '<div id="ss-proportions-results"></div>';
        html += '</div>';
        return html;
    }

    function buildMeansTab() {
        var html = '<div class="tab-content" id="tab-means">';
        html += '<div class="card-subtitle">Compare continuous outcomes between two groups (e.g., NIHSS change, blood pressure).</div>';

        html += '<div class="form-label">Common Presets</div>';
        html += '<div class="preset-group">'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadMeansPreset(\'nihss\')">NIHSS Change (\u03B4=4, SD=8)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadMeansPreset(\'bp\')">Blood Pressure (\u03B4=5, SD=12)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadMeansPreset(\'hba1c\')">HbA1c (\u03B4=0.5, SD=1.0)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadMeansPreset(\'moca\')">MoCA Score (\u03B4=2, SD=4)</button>'
            + '</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Mean Difference (\u03B4)</label>'
            + '<input type="number" class="form-input" name="ss_delta" id="ss_delta" step="0.1" value="4"></div>'
            + '<div class="form-group"><label class="form-label">SD (Group 1)</label>'
            + '<input type="number" class="form-input" name="ss_sd1" id="ss_sd1" step="0.1" min="0.1" value="8"></div>'
            + '<div class="form-group"><label class="form-label">SD (Group 2)</label>'
            + '<input type="number" class="form-input" name="ss_sd2" id="ss_sd2" step="0.1" min="0.1" value="8"></div>'
            + '</div>';

        html += commonParamsRow('ss');

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateMeans()">Calculate</button></div>';
        html += '<div id="ss-means-results"></div>';
        html += '</div>';
        return html;
    }

    function buildSurvivalTab() {
        var html = '<div class="tab-content" id="tab-survival">';
        html += '<div class="card-subtitle">For trials with time-to-event primary outcomes (e.g., survival, time to event).</div>';

        html += '<div class="form-label">Common Presets</div>';
        html += '<div class="preset-group">'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadSurvivalPreset(\'onc\')">Oncology (HR=0.75, med 18mo)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadSurvivalPreset(\'cv\')">CV Outcome (HR=0.80, med 48mo)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadSurvivalPreset(\'stroke\')">Stroke Recurrence (HR=0.70, med 24mo)</button>'
            + '</div>';

        html += '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Hazard Ratio ' + App.tooltip('Expected HR. <1 favors treatment.') + '</label>'
            + '<input type="number" class="form-input" name="ss_hr" id="ss_hr" step="0.05" min="0.1" value="0.70"></div>'
            + '<div class="form-group"><label class="form-label">Median Survival (Control, months)</label>'
            + '<input type="number" class="form-input" name="ss_medsurv" id="ss_medsurv" step="1" value="24"></div>'
            + '<div class="form-group"><label class="form-label">Accrual Period (months)</label>'
            + '<input type="number" class="form-input" name="ss_accrual" id="ss_accrual" step="1" value="24"></div>'
            + '<div class="form-group"><label class="form-label">Follow-up (months)</label>'
            + '<input type="number" class="form-input" name="ss_followup" id="ss_followup" step="1" value="12"></div>'
            + '</div>';

        html += commonParamsRow('ss');

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateSurvival()">Calculate</button></div>';
        html += '<div id="ss-survival-results"></div>';
        html += '</div>';
        return html;
    }

    function buildOrdinalTab() {
        var html = '<div class="tab-content" id="tab-ordinal">';
        html += '<div class="card-subtitle">Ordinal shift analysis using proportional odds model (Whitehead formula). Common for mRS in stroke trials and other ordinal outcomes.</div>';

        html += '<div class="form-label">Load Distribution Preset</div>';
        html += '<div class="preset-group">';
        Object.keys(References.mrsDistributions).forEach(function(key) {
            var d = References.mrsDistributions[key];
            if (key.indexOf('Control') > -1) {
                html += '<button class="preset-btn" onclick="SampleSizeModule.loadMRSPreset(\'' + key + '\')">' + d.trial + ' Control</button>';
            }
        });
        html += '</div>';

        html += '<div class="form-label mt-2">Control Group mRS Distribution (must sum to 1.0)</div>';
        html += '<div class="form-row" style="grid-template-columns:repeat(7,1fr)">';
        for (var i = 0; i <= 6; i++) {
            html += '<div class="form-group"><label class="form-label text-center">mRS ' + i + '</label>'
                + '<input type="number" class="form-input form-input--small text-center" name="ss_mrs_ctrl_' + i + '" id="ss_mrs_ctrl_' + i + '" step="0.01" min="0" max="1" value="' + [0.05, 0.07, 0.10, 0.10, 0.18, 0.20, 0.30][i] + '" oninput="SampleSizeModule.updateMRSSum()"></div>';
        }
        html += '</div>';
        html += '<div class="text-secondary" style="font-size:0.8rem" id="ss-mrs-sum">Sum: 1.00</div>';

        html += '<div class="form-row form-row--2 mt-2">'
            + '<div class="form-group"><label class="form-label">Common Odds Ratio ' + App.tooltip('The shift in odds across all mRS levels. ESCAPE~2.6, DAWN~2.0, realistic for new trial~1.5') + '</label>'
            + '<input type="number" class="form-input" name="ss_common_or" id="ss_common_or" step="0.1" min="1.1" value="1.5"></div>'
            + '<div class="form-group"><label class="form-label">Reference Effect Sizes</label>'
            + '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:8px">ESCAPE: OR 2.6 | DAWN: OR 2.0 | MR CLEAN: OR 1.67</div></div>'
            + '</div>';

        html += commonParamsRow('ss');

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateOrdinal()">Calculate</button></div>';
        html += '<div id="ss-ordinal-results"></div>';
        html += '</div>';
        return html;
    }

    function buildNonInfTab() {
        var html = '<div class="tab-content" id="tab-noninf">';
        html += '<div class="card-subtitle">Non-inferiority design. Uses one-sided alpha (default 0.025).</div>';

        html += '<div class="form-label">Common Presets</div>';
        html += '<div class="preset-group">'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadNonInfPreset(\'generic\')">Generic Drug (p=0.30, margin=0.10)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadNonInfPreset(\'device\')">Device Trial (p=0.15, margin=0.05)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadNonInfPreset(\'surgical\')">Surgical (p=0.25, margin=0.08)</button>'
            + '</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Expected Rate (both groups) ' + App.tooltip('Expected event rate assuming treatments are truly equivalent') + '</label>'
            + '<input type="number" class="form-input" name="ss_ni_p" id="ss_ni_p" step="0.01" min="0.01" max="0.99" value="0.30"></div>'
            + '<div class="form-group"><label class="form-label">Non-Inferiority Margin ' + App.tooltip('Maximum acceptable difference. Positive value.') + '</label>'
            + '<input type="number" class="form-input" name="ss_ni_margin" id="ss_ni_margin" step="0.01" min="0.001" value="0.05"></div>'
            + '<div class="form-group"><label class="form-label">One-Sided \u03B1</label>'
            + '<select class="form-select" name="ss_ni_alpha" id="ss_ni_alpha"><option value="0.025" selected>0.025</option><option value="0.05">0.05</option><option value="0.01">0.01</option></select></div>'
            + '</div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateNonInf()">Calculate</button></div>';
        html += '<div id="ss-noninf-results"></div>';
        html += '</div>';
        return html;
    }

    function buildEquivalenceTab() {
        var html = '<div class="tab-content" id="tab-equivalence">';
        html += '<div class="card-subtitle">Equivalence (two one-sided tests, TOST) design. Tests that the difference between treatments lies within a pre-specified margin.</div>';

        html += '<div class="form-label">Common Presets</div>';
        html += '<div class="preset-group">'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadEquivPreset(\'bioequiv\')">Bioequivalence (p=0.50, margin=0.20)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadEquivPreset(\'generic\')">Generic Drug (p=0.30, margin=0.10)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadEquivPreset(\'biosimilar\')">Biosimilar (p=0.40, margin=0.15)</button>'
            + '</div>';

        html += '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Expected Rate (both groups)</label>'
            + '<input type="number" class="form-input" name="ss_eq_p" id="ss_eq_p" step="0.01" min="0.01" max="0.99" value="0.50"></div>'
            + '<div class="form-group"><label class="form-label">Equivalence Margin (\u0394) ' + App.tooltip('Symmetric margin: treatments are equivalent if |p1-p2| < margin') + '</label>'
            + '<input type="number" class="form-input" name="ss_eq_margin" id="ss_eq_margin" step="0.01" min="0.001" value="0.10"></div>'
            + '<div class="form-group"><label class="form-label">One-Sided \u03B1</label>'
            + '<select class="form-select" name="ss_eq_alpha" id="ss_eq_alpha"><option value="0.025" selected>0.025</option><option value="0.05">0.05</option></select></div>'
            + '<div class="form-group"><label class="form-label">Power</label>'
            + '<select class="form-select" name="ss_eq_power" id="ss_eq_power"><option value="0.80" selected>80%</option><option value="0.85">85%</option><option value="0.90">90%</option></select></div>'
            + '</div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateEquivalence()">Calculate</button></div>';
        html += '<div id="ss-equivalence-results"></div>';
        html += '</div>';
        return html;
    }

    function buildCrossoverTab() {
        var html = '<div class="tab-content" id="tab-crossover">';
        html += '<div class="card-subtitle">Crossover (AB/BA) design. Subjects serve as their own control, reducing variability.</div>';

        html += '<div class="form-label">Common Presets</div>';
        html += '<div class="preset-group">'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadCrossoverPreset(\'analgesic\')">Analgesic Trial (\u03B4=1.5, SD=3)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadCrossoverPreset(\'bp\')">BP Crossover (\u03B4=3, SD=6)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadCrossoverPreset(\'epilepsy\')">Epilepsy Seizure (\u03B4=2, SD=5)</button>'
            + '</div>';

        html += '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Mean Difference (\u03B4)</label>'
            + '<input type="number" class="form-input" name="ss_co_delta" id="ss_co_delta" step="0.1" value="1.5"></div>'
            + '<div class="form-group"><label class="form-label">Within-Subject SD ' + App.tooltip('SD of within-subject differences. Usually smaller than between-subject SD.') + '</label>'
            + '<input type="number" class="form-input" name="ss_co_sd" id="ss_co_sd" step="0.1" min="0.1" value="3.0"></div>'
            + '<div class="form-group"><label class="form-label">Number of Periods</label>'
            + '<select class="form-select" name="ss_co_periods" id="ss_co_periods"><option value="2" selected>2 (AB/BA)</option><option value="3">3</option><option value="4">4</option></select></div>'
            + '<div class="form-group"><label class="form-label">\u03B1 (two-sided)</label>'
            + '<select class="form-select" name="ss_co_alpha" id="ss_co_alpha"><option value="0.05" selected>0.05</option><option value="0.01">0.01</option></select></div>'
            + '</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Power</label>'
            + '<select class="form-select" name="ss_co_power" id="ss_co_power"><option value="0.80" selected>80%</option><option value="0.85">85%</option><option value="0.90">90%</option><option value="0.95">95%</option></select></div>'
            + '<div class="form-group"><label class="form-label">Dropout Rate (%)</label>'
            + '<input type="number" class="form-input" name="ss_co_dropout" id="ss_co_dropout" step="1" min="0" max="50" value="10"></div>'
            + '</div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateCrossover()">Calculate</button></div>';
        html += '<div id="ss-crossover-results"></div>';
        html += '</div>';
        return html;
    }

    function buildDiagnosticTab() {
        var html = '<div class="tab-content" id="tab-diagnostic">';
        html += '<div class="card-subtitle">Sample size for diagnostic accuracy studies. Calculates N required to estimate sensitivity or specificity with a desired precision.</div>';

        html += '<div class="form-label">Common Presets</div>';
        html += '<div class="preset-group">'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadDiagPreset(\'screen\')">Screening Test (Se=0.90, width=0.10)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadDiagPreset(\'confirm\')">Confirmatory Test (Se=0.95, width=0.05)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadDiagPreset(\'imaging\')">Imaging Biomarker (Se=0.85, width=0.10)</button>'
            + '</div>';

        html += '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Expected Sensitivity ' + App.tooltip('Expected sensitivity of the diagnostic test') + '</label>'
            + '<input type="number" class="form-input" name="ss_dx_sens" id="ss_dx_sens" step="0.01" min="0.01" max="0.99" value="0.90"></div>'
            + '<div class="form-group"><label class="form-label">Expected Specificity</label>'
            + '<input type="number" class="form-input" name="ss_dx_spec" id="ss_dx_spec" step="0.01" min="0.01" max="0.99" value="0.85"></div>'
            + '<div class="form-group"><label class="form-label">Desired CI Half-Width ' + App.tooltip('Half-width of the 95% CI. E.g., 0.05 means CI within +/-5%') + '</label>'
            + '<input type="number" class="form-input" name="ss_dx_width" id="ss_dx_width" step="0.01" min="0.01" max="0.50" value="0.05"></div>'
            + '<div class="form-group"><label class="form-label">Disease Prevalence ' + App.tooltip('Prevalence in the study population. Used to calculate total enrollment.') + '</label>'
            + '<input type="number" class="form-input" name="ss_dx_prev" id="ss_dx_prev" step="0.01" min="0.01" max="0.99" value="0.20"></div>'
            + '</div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateDiagnostic()">Calculate</button></div>';
        html += '<div id="ss-diagnostic-results"></div>';
        html += '</div>';
        return html;
    }

    function buildClusterTab() {
        var html = '<div class="tab-content" id="tab-cluster">';
        html += '<div class="card-subtitle">Adjust sample size for cluster-randomized designs using the design effect.</div>';

        html += '<div class="form-label">Common Presets</div>';
        html += '<div class="preset-group">'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadClusterPreset(\'hospital\')">Hospital Clusters (N=500, ICC=0.03, m=30)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadClusterPreset(\'community\')">Community (N=800, ICC=0.05, m=50)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadClusterPreset(\'practice\')">GP Practice (N=300, ICC=0.02, m=20)</button>'
            + '</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Individual N (from standard calc)</label>'
            + '<input type="number" class="form-input" name="ss_cl_n" id="ss_cl_n" step="1" value="500"></div>'
            + '<div class="form-group"><label class="form-label">ICC ' + App.tooltip('Intracluster correlation coefficient. Typically 0.01-0.05 in clinical research.') + '</label>'
            + '<input type="number" class="form-input" name="ss_cl_icc" id="ss_cl_icc" step="0.005" min="0" max="1" value="0.03"></div>'
            + '<div class="form-group"><label class="form-label">Cluster Size</label>'
            + '<input type="number" class="form-input" name="ss_cl_size" id="ss_cl_size" step="5" min="2" value="30"></div>'
            + '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateCluster()">Calculate</button></div>';
        html += '<div id="ss-cluster-results"></div>';
        html += '</div>';
        return html;
    }

    function buildSteppedTab() {
        var html = '<div class="tab-content" id="tab-stepped">';
        html += '<div class="card-subtitle">Stepped-wedge cluster randomized design (Hussey-Hughes framework).</div>';
        html += '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Individual N (parallel)</label>'
            + '<input type="number" class="form-input" name="ss_sw_n" id="ss_sw_n" step="1" value="500"></div>'
            + '<div class="form-group"><label class="form-label">Number of Steps</label>'
            + '<input type="number" class="form-input" name="ss_sw_steps" id="ss_sw_steps" step="1" min="2" value="5"></div>'
            + '<div class="form-group"><label class="form-label">Clusters per Step</label>'
            + '<input type="number" class="form-input" name="ss_sw_cps" id="ss_sw_cps" step="1" min="1" value="4"></div>'
            + '<div class="form-group"><label class="form-label">ICC</label>'
            + '<input type="number" class="form-input" name="ss_sw_icc" id="ss_sw_icc" step="0.005" min="0" max="1" value="0.03"></div>'
            + '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateStepped()">Calculate</button></div>';
        html += '<div id="ss-stepped-results"></div>';
        html += '</div>';
        return html;
    }

    function buildMultiArmTab() {
        var html = '<div class="tab-content" id="tab-multiarm">';
        html += '<div class="card-subtitle">Multi-arm trials with multiplicity correction.</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">N per Group (2-arm design)</label>'
            + '<input type="number" class="form-input" name="ss_ma_n" id="ss_ma_n" step="1" value="400"></div>'
            + '<div class="form-group"><label class="form-label">Number of Arms</label>'
            + '<input type="number" class="form-input" name="ss_ma_arms" id="ss_ma_arms" step="1" min="2" max="10" value="3"></div>'
            + '<div class="form-group"><label class="form-label">Correction Method</label>'
            + '<select class="form-select" name="ss_ma_corr" id="ss_ma_corr"><option value="bonferroni">Bonferroni</option><option value="dunnett">Dunnett (approx)</option></select></div>'
            + '</div>';
        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Family-wise α</label>'
            + '<select class="form-select" name="ss_ma_alpha" id="ss_ma_alpha"><option value="0.05" selected>0.05</option><option value="0.025">0.025</option><option value="0.01">0.01</option><option value="0.10">0.10</option></select></div>'
            + '<div class="form-group"><label class="form-label">Power</label>'
            + '<select class="form-select" name="ss_ma_power" id="ss_ma_power"><option value="0.80" selected>80%</option><option value="0.85">85%</option><option value="0.90">90%</option><option value="0.95">95%</option></select></div>'
            + '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateMultiArm()">Calculate</button></div>';
        html += '<div id="ss-multiarm-results"></div>';
        html += '</div>';
        return html;
    }

    function buildGroupSeqTab() {
        var html = '<div class="tab-content" id="tab-groupseq">';
        html += '<div class="card-subtitle">Group sequential design with alpha spending. Calculates inflated sample size and stopping boundaries for interim analyses.</div>';

        html += '<div class="form-label">Common Presets</div>';
        html += '<div class="preset-group">'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadGSPreset(\'obf3\')">OBF 3-Look (typical)</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadGSPreset(\'obf5\')">OBF 5-Look</button>'
            + '<button class="preset-btn" onclick="SampleSizeModule.loadGSPreset(\'pocock3\')">Pocock 3-Look</button>'
            + '</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Fixed-Design N (total) ' + App.tooltip('The sample size from a standard (non-sequential) calculation') + '</label>'
            + '<input type="number" class="form-input" name="ss_gs_fixedn" id="ss_gs_fixedn" step="10" min="10" value="800"></div>'
            + '<div class="form-group"><label class="form-label">Number of Interim Looks</label>'
            + '<input type="number" class="form-input" name="ss_gs_looks" id="ss_gs_looks" step="1" min="2" max="10" value="3"></div>'
            + '<div class="form-group"><label class="form-label">Spending Function</label>'
            + '<select class="form-select" name="ss_gs_type" id="ss_gs_type"><option value="obf">O\'Brien-Fleming</option><option value="pocock">Pocock</option></select></div>'
            + '</div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="SampleSizeModule.calculateGroupSeq()">Calculate</button></div>';
        html += '<div id="ss-groupseq-results"></div>';
        html += '</div>';
        return html;
    }

    /* ============================================================
     * Learn section
     * ============================================================ */

    function buildLearnSection() {
        var html = '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Learn: Sample Size Essentials</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';

        html += '<div class="card-subtitle" style="font-weight:600;">Key Formulas</div>';
        html += '<div style="background:var(--bg-secondary);padding:12px;border-radius:8px;font-family:var(--font-mono);margin-bottom:12px;">'
            + '<div><strong>Two Proportions:</strong> N/group = (z<sub>\u03B1/2</sub> + z<sub>\u03B2</sub>)\u00B2 \u00D7 2p\u0304q\u0304 / (p\u2081 \u2212 p\u2082)\u00B2</div>'
            + '<div><strong>Two Means:</strong> N/group = (z<sub>\u03B1/2</sub> + z<sub>\u03B2</sub>)\u00B2 \u00D7 2\u03C3\u00B2 / \u03B4\u00B2</div>'
            + '<div><strong>Time-to-Event:</strong> Events = 4(z<sub>\u03B1/2</sub> + z<sub>\u03B2</sub>)\u00B2 / (ln HR)\u00B2</div>'
            + '<div><strong>Cluster RCT:</strong> N\u2019 = N \u00D7 [1 + (m\u22121)\u03C1] (design effect)</div>'
            + '<div><strong>Crossover:</strong> N = 2(z<sub>\u03B1/2</sub> + z<sub>\u03B2</sub>)\u00B2\u03C3<sub>w</sub>\u00B2 / \u03B4\u00B2</div>'
            + '<div><strong>Equivalence:</strong> N/group = (z<sub>\u03B1</sub> + z<sub>\u03B2</sub>)\u00B2 \u00D7 2p(1\u2212p) / \u0394\u00B2 (TOST)</div>'
            + '<div><strong>Diagnostic:</strong> N = 4z<sub>\u03B1/2</sub>\u00B2 \u00D7 Se(1\u2212Se) / w\u00B2</div>'
            + '</div>';

        html += '<div class="card-subtitle" style="font-weight:600;">Key Considerations</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>Always inflate for anticipated dropout (typically 10\u201320%)</li>'
            + '<li>Non-inferiority trials need a pre-specified margin (\u0394) and use one-sided alpha</li>'
            + '<li>Equivalence trials use TOST (two one-sided tests) and require larger N than NI designs</li>'
            + '<li>Crossover designs require fewer subjects but assume no period or carryover effects</li>'
            + '<li>Diagnostic accuracy sample size depends on prevalence in the study population</li>'
            + '<li>Multi-arm trials require multiplicity adjustment (\u03B1 correction)</li>'
            + '<li>Cluster trials: ICC (\u03C1) and cluster size (m) drive the design effect</li>'
            + '<li>Group sequential designs allow interim analyses that can save overall N</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;">'
            + '<li>Chow SC, Shao J, Wang H. <em>Sample Size Calculations in Clinical Research</em>. 3rd ed. 2017.</li>'
            + '<li>Donner A, Klar N. <em>Design and Analysis of Cluster Randomization Trials</em>. 2000.</li>'
            + '<li>Senn S. <em>Cross-over Trials in Clinical Research</em>. 2nd ed. 2002.</li>'
            + '<li>Flahault A, et al. <em>Sample size calculation should be performed for design accuracy in diagnostic test studies</em>. JCE, 2005.</li>'
            + '<li>Jennison C, Turnbull BW. <em>Group Sequential Methods with Applications to Clinical Trials</em>. 2000.</li>'
            + '</ul>';
        html += '</div></div>';
        return html;
    }

    /* ============================================================
     * Tab switching
     * ============================================================ */

    function switchTab(tabId) {
        document.querySelectorAll('#ss-tabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tabId); });
        // Only toggle tab-content divs inside the sample-size module card
        var card = document.getElementById('ss-tabs').parentElement;
        card.querySelectorAll('.tab-content').forEach(function(tc) { tc.classList.toggle('active', tc.id === 'tab-' + tabId); });
    }

    /* ============================================================
     * Rate syncing (proportions)
     * ============================================================ */

    function syncRates(source) {
        var p1 = parseFloat(document.getElementById('ss_p1').value);
        var p2 = parseFloat(document.getElementById('ss_p2').value);
        if (source === 'p1' || source === 'p2') {
            document.getElementById('ss_arr').value = (p1 - p2).toFixed(3);
        } else if (source === 'arr') {
            var arr = parseFloat(document.getElementById('ss_arr').value);
            document.getElementById('ss_p2').value = (p1 - arr).toFixed(3);
        }
    }

    /* ============================================================
     * Presets
     * ============================================================ */

    function loadPreset(name) {
        var presets = {
            lvo: { p1: 0.28, p2: 0.46 },
            mortality: { p1: 0.20, p2: 0.14 },
            sich: { p1: 0.06, p2: 0.03 },
            recurrent: { p1: 0.05, p2: 0.035 },
            ich: { p1: 0.38, p2: 0.30 },
            cardio: { p1: 0.12, p2: 0.08 },
            onc: { p1: 0.30, p2: 0.45 }
        };
        var p = presets[name];
        if (p) {
            document.getElementById('ss_p1').value = p.p1;
            document.getElementById('ss_p2').value = p.p2;
            document.getElementById('ss_arr').value = (p.p1 - p.p2).toFixed(3);
        }
    }

    function loadMeansPreset(name) {
        var presets = {
            nihss: { delta: 4, sd1: 8, sd2: 8 },
            bp: { delta: 5, sd1: 12, sd2: 12 },
            hba1c: { delta: 0.5, sd1: 1.0, sd2: 1.0 },
            moca: { delta: 2, sd1: 4, sd2: 4 }
        };
        var p = presets[name];
        if (p) {
            document.getElementById('ss_delta').value = p.delta;
            document.getElementById('ss_sd1').value = p.sd1;
            document.getElementById('ss_sd2').value = p.sd2;
        }
    }

    function loadSurvivalPreset(name) {
        var presets = {
            onc: { hr: 0.75, medsurv: 18, accrual: 24, followup: 12 },
            cv: { hr: 0.80, medsurv: 48, accrual: 36, followup: 24 },
            stroke: { hr: 0.70, medsurv: 24, accrual: 24, followup: 12 }
        };
        var p = presets[name];
        if (p) {
            document.getElementById('ss_hr').value = p.hr;
            document.getElementById('ss_medsurv').value = p.medsurv;
            document.getElementById('ss_accrual').value = p.accrual;
            document.getElementById('ss_followup').value = p.followup;
        }
    }

    function loadNonInfPreset(name) {
        var presets = {
            generic: { p: 0.30, margin: 0.10 },
            device: { p: 0.15, margin: 0.05 },
            surgical: { p: 0.25, margin: 0.08 }
        };
        var p = presets[name];
        if (p) {
            document.getElementById('ss_ni_p').value = p.p;
            document.getElementById('ss_ni_margin').value = p.margin;
        }
    }

    function loadEquivPreset(name) {
        var presets = {
            bioequiv: { p: 0.50, margin: 0.20 },
            generic: { p: 0.30, margin: 0.10 },
            biosimilar: { p: 0.40, margin: 0.15 }
        };
        var p = presets[name];
        if (p) {
            document.getElementById('ss_eq_p').value = p.p;
            document.getElementById('ss_eq_margin').value = p.margin;
        }
    }

    function loadCrossoverPreset(name) {
        var presets = {
            analgesic: { delta: 1.5, sd: 3 },
            bp: { delta: 3, sd: 6 },
            epilepsy: { delta: 2, sd: 5 }
        };
        var p = presets[name];
        if (p) {
            document.getElementById('ss_co_delta').value = p.delta;
            document.getElementById('ss_co_sd').value = p.sd;
        }
    }

    function loadDiagPreset(name) {
        var presets = {
            screen: { sens: 0.90, spec: 0.80, width: 0.05, prev: 0.10 },
            confirm: { sens: 0.95, spec: 0.90, width: 0.05, prev: 0.30 },
            imaging: { sens: 0.85, spec: 0.85, width: 0.05, prev: 0.20 }
        };
        var p = presets[name];
        if (p) {
            document.getElementById('ss_dx_sens').value = p.sens;
            document.getElementById('ss_dx_spec').value = p.spec;
            document.getElementById('ss_dx_width').value = p.width;
            document.getElementById('ss_dx_prev').value = p.prev;
        }
    }

    function loadClusterPreset(name) {
        var presets = {
            hospital: { n: 500, icc: 0.03, size: 30 },
            community: { n: 800, icc: 0.05, size: 50 },
            practice: { n: 300, icc: 0.02, size: 20 }
        };
        var p = presets[name];
        if (p) {
            document.getElementById('ss_cl_n').value = p.n;
            document.getElementById('ss_cl_icc').value = p.icc;
            document.getElementById('ss_cl_size').value = p.size;
        }
    }

    function loadGSPreset(name) {
        var presets = {
            obf3: { looks: 3, type: 'obf' },
            obf5: { looks: 5, type: 'obf' },
            pocock3: { looks: 3, type: 'pocock' }
        };
        var p = presets[name];
        if (p) {
            document.getElementById('ss_gs_looks').value = p.looks;
            document.getElementById('ss_gs_type').value = p.type;
        }
    }

    function loadMRSPreset(key) {
        var d = References.mrsDistributions[key];
        if (d) {
            for (var i = 0; i <= 6; i++) {
                document.getElementById('ss_mrs_ctrl_' + i).value = d.dist[i].toFixed(2);
            }
            updateMRSSum();
        }
    }

    function updateMRSSum() {
        var sum = 0;
        for (var i = 0; i <= 6; i++) {
            sum += parseFloat(document.getElementById('ss_mrs_ctrl_' + i).value) || 0;
        }
        var el = document.getElementById('ss-mrs-sum');
        if (el) {
            el.textContent = 'Sum: ' + sum.toFixed(2);
            el.style.color = Math.abs(sum - 1) < 0.01 ? 'var(--success)' : 'var(--danger)';
        }
    }

    /* ============================================================
     * Helper: get common params
     * ============================================================ */

    function getCommonParams() {
        return {
            alpha: parseFloat(document.getElementById('ss_alpha').value),
            power: parseFloat(document.getElementById('ss_power').value),
            ratio: parseFloat(document.getElementById('ss_ratio').value),
            dropout: parseFloat(document.getElementById('ss_dropout').value) / 100
        };
    }

    /* ============================================================
     * Helper: build sensitivity table (power x effect size)
     * ============================================================ */

    function buildSensitivityGrid(calcFn, baseParams) {
        var powers = [0.70, 0.80, 0.85, 0.90, 0.95];
        var effects = baseParams.effects;
        var effectLabel = baseParams.effectLabel || 'Effect Size';

        var html = '<div class="card-title mt-3">Sensitivity Table: N by Power and Effect Size</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>' + effectLabel + '</th>';
        powers.forEach(function(pw) {
            html += '<th>' + (pw * 100).toFixed(0) + '% Power</th>';
        });
        html += '</tr></thead><tbody>';

        effects.forEach(function(eff) {
            var isBase = Math.abs(eff - baseParams.baseEffect) < 0.0001;
            html += '<tr' + (isBase ? ' style="background:var(--accent-muted)"' : '') + '>';
            html += '<td class="num">' + baseParams.formatEffect(eff) + '</td>';
            powers.forEach(function(pw) {
                var n = calcFn(eff, pw);
                html += '<td class="num' + (isBase && Math.abs(pw - baseParams.basePower) < 0.001 ? ' highlight' : '') + '">' + n + '</td>';
            });
            html += '</tr>';
        });
        html += '</tbody></table></div>';
        return html;
    }

    /* ============================================================
     * Helper: build methods text block
     * ============================================================ */

    function buildMethodsBlock(methodsText, id) {
        return '<div class="mt-3"><div class="expandable-header" onclick="this.classList.toggle(\'open\')">Generate Methods Paragraph</div>'
            + '<div class="expandable-body"><div class="text-output" id="' + id + '">' + methodsText
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(this.parentElement.textContent.replace(\'Copy\',\'\').trim())">Copy</button></div></div></div>';
    }

    /* ============================================================
     * Calculations
     * ============================================================ */

    function calculateProportions() {
        var p1 = validateField('ss_p1', 0.001, 0.999, 'Control event rate');
        var p2 = validateField('ss_p2', 0.001, 0.999, 'Treatment event rate');
        if (p1 === null || p2 === null) return;
        if (Math.abs(p1 - p2) < 0.001) {
            Export.showToast('Control and treatment rates must differ', 'error');
            return;
        }
        var params = getCommonParams();

        var normal = Statistics.sampleSizeTwoProportions(p1, p2, params.alpha, params.power, params.ratio, 'normal');
        var fleiss = Statistics.sampleSizeTwoProportions(p1, p2, params.alpha, params.power, params.ratio, 'fleiss');
        var arcsine = Statistics.sampleSizeTwoProportions(p1, p2, params.alpha, params.power, params.ratio, 'arcsine');

        var recommended = fleiss;
        var dropoutN = Math.ceil(recommended.total / (1 - params.dropout));

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + recommended.total + ' participants</div>';
        html += '<div class="result-label">Recommended sample size (Fleiss continuity correction)</div>';
        html += '<div class="result-detail">' + recommended.n1 + ' per control group, ' + recommended.n2 + ' per treatment group';
        if (params.dropout > 0) html += '<br>Dropout-adjusted: <strong class="text-accent">' + dropoutN + '</strong> total (' + (params.dropout * 100).toFixed(0) + '% dropout)';
        html += '</div>';

        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + normal.total + '</div><div class="result-item-label">Normal Approximation</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + fleiss.total + '</div><div class="result-item-label">Fleiss (corrected)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + arcsine.total + '</div><div class="result-item-label">Arcsine Transform</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + ((p1 - p2) * 100).toFixed(1) + '%</div><div class="result-item-label">ARR</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (p2 / p1).toFixed(2) + '</div><div class="result-item-label">RR</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + Math.round(1 / Math.abs(p1 - p2)) + '</div><div class="result-item-label">NNT</div></div>'
            + '</div>';

        // Sensitivity table (varying p2 x power)
        var arrBase = Math.abs(p1 - p2);
        var arrValues = [];
        for (var mult = 0.5; mult <= 1.5; mult += 0.125) {
            var testArr = arrBase * mult;
            if (testArr > 0.001 && testArr < 1) arrValues.push(testArr);
        }

        html += buildSensitivityGrid(function(eff, pw) {
            var p2v = p1 - eff;
            if (p2v <= 0 || p2v >= 1) return '--';
            var r = Statistics.sampleSizeTwoProportions(p1, p2v, params.alpha, pw, params.ratio, 'fleiss');
            return r.total;
        }, {
            effects: arrValues,
            baseEffect: arrBase,
            basePower: params.power,
            effectLabel: 'ARR',
            formatEffect: function(v) { return (v * 100).toFixed(1) + '%'; }
        });

        // Power curve
        html += '<div class="chart-container"><canvas id="ss-power-chart" width="700" height="350"></canvas></div>';
        html += '<div class="chart-actions"><button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'ss-power-chart\'),\'power-curve.png\')">Export PNG</button></div>';

        // Methods text
        var methodsText = 'Sample size was calculated for a two-group comparison of proportions '
            + 'with a control group event rate of ' + (p1 * 100).toFixed(1) + '% and a treatment group event rate of '
            + (p2 * 100).toFixed(1) + '%, corresponding to an absolute risk reduction of '
            + ((p1 - p2) * 100).toFixed(1) + ' percentage points. Using a two-sided significance level of '
            + params.alpha + ' and ' + (params.power * 100).toFixed(0) + '% power'
            + (params.ratio !== 1 ? ' with a ' + params.ratio + ':1 allocation ratio' : '')
            + ', the Fleiss formula with continuity correction yields ' + recommended.n1 + ' participants per group '
            + '(' + recommended.total + ' total).'
            + (params.dropout > 0 ? ' Accounting for ' + (params.dropout * 100).toFixed(0) + '% dropout, a total of ' + dropoutN + ' participants will be enrolled.' : '');

        html += buildMethodsBlock(methodsText, 'ss-methods-prop');

        // Grant justification
        var grantText = Export.formatGrantJustification({
            n: recommended.total,
            nPerGroup: recommended.n1,
            ratio: params.ratio,
            power: params.power,
            alpha: params.alpha,
            designType: 'proportions',
            p1: p1, p2: p2,
            test: 'two-sided z-test for two proportions with Fleiss continuity correction',
            dropoutRate: params.dropout > 0 ? (params.dropout * 100).toFixed(0) : null,
            dropoutAdjusted: dropoutN
        });

        html += '<div class="expandable-header" onclick="this.classList.toggle(\'open\')">Grant Justification Text</div>'
            + '<div class="expandable-body"><div class="text-output">' + grantText
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(this.parentElement.textContent.replace(\'Copy\',\'\').trim())">Copy</button></div></div>';

        // R Script button
        html += '<button class="btn btn-sm r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.sampleSize.twoProportions({p1:' + p1 + ',p2:' + p2 + ',alpha:' + params.alpha + ',power:' + params.power + ',ratio:' + params.ratio + ',dropout:' + params.dropout + '}), \'Sample Size — Two Proportions\')">'
            + '&#129513; Generate R Script</button>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('ss-proportions-results'), html);

        // Draw power curve
        setTimeout(function() {
            var canvas = document.getElementById('ss-power-chart');
            if (!canvas) return;
            var points = [];
            var maxN = recommended.n1 * 3;
            for (var n = 20; n <= maxN; n += Math.max(1, Math.floor(maxN / 80))) {
                var pwr = Statistics.powerTwoProportions(p1, p2, n, params.alpha, params.ratio);
                points.push({ x: n * (1 + params.ratio), y: pwr });
            }
            Charts.LineChart(canvas, {
                data: [{ label: 'Power', points: points }],
                xLabel: 'Total Sample Size', yLabel: 'Power',
                title: 'Power vs Sample Size (p\u2081=' + p1 + ', p\u2082=' + p2 + ')',
                yMin: 0, yMax: 1,
                width: 700, height: 350
            });
        }, 100);

        Export.addToHistory(MODULE_ID, { p1: p1, p2: p2, alpha: params.alpha, power: params.power }, recommended.total + ' participants');
    }

    function calculateMeans() {
        var delta = validateField('ss_delta', 0.001, 10000, 'Mean difference');
        var sd1 = validateField('ss_sd1', 0.1, 10000, 'SD (Group 1)');
        var sd2 = validateField('ss_sd2', 0.1, 10000, 'SD (Group 2)');
        if (delta === null || sd1 === null || sd2 === null) return;

        var params = getCommonParams();
        var result = Statistics.sampleSizeTwoMeans(delta, sd1, sd2, params.alpha, params.power, params.ratio);
        var dropoutN = Math.ceil(result.total / (1 - params.dropout));

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + result.total + ' participants</div>';
        html += '<div class="result-label">Required sample size (two-sample t-test)</div>';
        html += '<div class="result-detail">' + result.n1 + ' per group. Cohen\'s d = ' + (delta / sd1).toFixed(2);
        if (params.dropout > 0) html += '. Dropout-adjusted: <strong class="text-accent">' + dropoutN + '</strong>';
        html += '</div>';

        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + result.n1 + '</div><div class="result-item-label">N per Group</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (delta / sd1).toFixed(2) + '</div><div class="result-item-label">Cohen\'s d</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + dropoutN + '</div><div class="result-item-label">With Dropout</div></div>'
            + '</div>';

        // Sensitivity grid
        var dValues = [];
        for (var mult = 0.5; mult <= 2.0; mult += 0.25) {
            dValues.push(delta * mult);
        }
        html += buildSensitivityGrid(function(eff, pw) {
            var r = Statistics.sampleSizeTwoMeans(eff, sd1, sd2, params.alpha, pw, params.ratio);
            return r.total;
        }, {
            effects: dValues,
            baseEffect: delta,
            basePower: params.power,
            effectLabel: '\u03B4',
            formatEffect: function(v) { return v.toFixed(1); }
        });

        // Power curve
        html += '<div class="chart-container"><canvas id="ss-means-power-chart" width="700" height="350"></canvas></div>';

        // Methods text
        var methodsText = 'Sample size was calculated for a two-sample t-test comparing means between two independent groups. '
            + 'Assuming a mean difference of ' + delta + ' with standard deviations of ' + sd1 + ' and ' + sd2
            + ' (Cohen\'s d = ' + (delta / sd1).toFixed(2) + '), a two-sided significance level of ' + params.alpha
            + ', and ' + (params.power * 100).toFixed(0) + '% power, '
            + result.n1 + ' participants per group (' + result.total + ' total) are required.'
            + (params.dropout > 0 ? ' After adjusting for ' + (params.dropout * 100).toFixed(0) + '% dropout, ' + dropoutN + ' participants will be enrolled.' : '');

        html += buildMethodsBlock(methodsText, 'ss-methods-means');

        // R Script button
        html += '<button class="btn btn-sm r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.sampleSize.twoMeans({delta:' + delta + ',sd1:' + sd1 + ',sd2:' + sd2 + ',alpha:' + params.alpha + ',power:' + params.power + ',ratio:' + params.ratio + ',dropout:' + params.dropout + '}), \'Sample Size — Two Means\')">'
            + '&#129513; Generate R Script</button>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('ss-means-results'), html);

        setTimeout(function() {
            var canvas = document.getElementById('ss-means-power-chart');
            if (!canvas) return;
            var points = [];
            var maxN = result.n1 * 3;
            for (var n = 10; n <= maxN; n += Math.max(1, Math.floor(maxN / 80))) {
                var pwr = Statistics.powerTwoMeans(delta, sd1, n, params.alpha, params.ratio);
                points.push({ x: n * (1 + params.ratio), y: pwr });
            }
            Charts.LineChart(canvas, {
                data: [{ label: 'Power', points: points }],
                xLabel: 'Total Sample Size', yLabel: 'Power',
                title: 'Power vs Sample Size (\u03B4=' + delta + ', SD=' + sd1 + ')',
                yMin: 0, yMax: 1,
                width: 700, height: 350
            });
        }, 100);

        Export.addToHistory(MODULE_ID, { delta: delta, sd1: sd1, alpha: params.alpha, power: params.power }, result.total + ' participants');
    }

    function calculateSurvival() {
        var hr = validateField('ss_hr', 0.01, 0.99, 'Hazard ratio');
        if (hr === null) return;
        var params = getCommonParams();

        var schoenfeld = Statistics.sampleSizeSchoenfeld(hr, params.alpha, params.power, params.ratio);
        var freedman = Statistics.sampleSizeFreedman(hr, params.alpha, params.power, params.ratio);

        var accrual = parseFloat(document.getElementById('ss_accrual').value);
        var followup = parseFloat(document.getElementById('ss_followup').value);
        var medSurv = parseFloat(document.getElementById('ss_medsurv').value);

        var lambda = Math.log(2) / medSurv;
        var avgFollowup = accrual / 2 + followup;
        var pEvent = 1 - Math.exp(-lambda * avgFollowup);
        var totalN = Math.ceil(schoenfeld.events / pEvent);
        var dropoutN = Math.ceil(totalN / (1 - params.dropout));

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + schoenfeld.events + ' events needed</div>';
        html += '<div class="result-label">Schoenfeld formula</div>';
        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + schoenfeld.events + '</div><div class="result-item-label">Events (Schoenfeld)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + freedman.events + '</div><div class="result-item-label">Events (Freedman)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (pEvent * 100).toFixed(1) + '%</div><div class="result-item-label">Est. Event Probability</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + totalN + '</div><div class="result-item-label">Total N Required</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + dropoutN + '</div><div class="result-item-label">Dropout-Adjusted</div></div>'
            + '</div>';

        // Sensitivity by HR
        html += '<div class="card-title mt-3">Sensitivity: Events by HR</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>HR</th><th>Events (Schoenfeld)</th><th>Total N</th></tr></thead><tbody>';
        [0.50, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90].forEach(function(h) {
            var r = Statistics.sampleSizeSchoenfeld(h, params.alpha, params.power, params.ratio);
            var isBase = Math.abs(h - hr) < 0.01;
            html += '<tr' + (isBase ? ' style="background:var(--accent-muted)"' : '') + '>'
                + '<td class="num">' + h.toFixed(2) + '</td>'
                + '<td class="num' + (isBase ? ' highlight' : '') + '">' + r.events + '</td>'
                + '<td class="num">' + Math.ceil(r.events / pEvent) + '</td></tr>';
        });
        html += '</tbody></table></div>';

        // Power curve
        html += '<div class="chart-container"><canvas id="ss-surv-power-chart" width="700" height="350"></canvas></div>';

        // Methods text
        var methodsText = 'The primary outcome is time to event analyzed using the log-rank test. '
            + 'Assuming a hazard ratio of ' + hr + ' with median survival of ' + medSurv + ' months in the control group, '
            + 'a two-sided significance level of ' + params.alpha + ', and ' + (params.power * 100).toFixed(0) + '% power, '
            + 'the Schoenfeld formula requires ' + schoenfeld.events + ' events. '
            + 'With an estimated event probability of ' + (pEvent * 100).toFixed(1) + '% '
            + '(based on ' + accrual + '-month accrual and ' + followup + '-month follow-up), '
            + 'a total of ' + totalN + ' participants are needed.'
            + (params.dropout > 0 ? ' Accounting for ' + (params.dropout * 100).toFixed(0) + '% dropout, ' + dropoutN + ' will be enrolled.' : '');

        html += buildMethodsBlock(methodsText, 'ss-methods-surv');

        // R Script button
        html += '<button class="btn btn-sm r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.sampleSize.survival({hr:' + hr + ',alpha:' + params.alpha + ',power:' + params.power + ',ratio:' + params.ratio + ',medianControl:' + medSurv + ',accrualMonths:' + accrual + ',followupMonths:' + followup + ',dropout:' + params.dropout + '}), \'Sample Size — Time-to-Event\')">'
            + '&#129513; Generate R Script</button>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('ss-survival-results'), html);

        setTimeout(function() {
            var canvas = document.getElementById('ss-surv-power-chart');
            if (!canvas) return;
            var points = [];
            for (var ev = 20; ev <= schoenfeld.events * 3; ev += Math.max(1, Math.floor(schoenfeld.events / 50))) {
                var pwr = Statistics.powerSurvival(hr, ev, params.alpha, params.ratio);
                points.push({ x: ev, y: pwr });
            }
            Charts.LineChart(canvas, {
                data: [{ label: 'Power', points: points }],
                xLabel: 'Number of Events', yLabel: 'Power',
                title: 'Power vs Events (HR=' + hr + ')',
                yMin: 0, yMax: 1,
                width: 700, height: 350
            });
        }, 100);
    }

    function calculateOrdinal() {
        var controlDist = [];
        for (var i = 0; i <= 6; i++) {
            controlDist.push(parseFloat(document.getElementById('ss_mrs_ctrl_' + i).value) || 0);
        }
        var commonOR = parseFloat(document.getElementById('ss_common_or').value);
        var params = getCommonParams();

        var sum = controlDist.reduce(function(a, b) { return a + b; }, 0);
        if (Math.abs(sum - 1) > 0.05) {
            Export.showToast('Distribution must sum to 1.0', 'error');
            return;
        }

        var result = Statistics.sampleSizeOrdinalShift(controlDist, null, commonOR, params.alpha, params.power);
        var dropoutN = Math.ceil(result.total / (1 - params.dropout));

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + result.total + ' participants</div>';
        html += '<div class="result-label">Proportional odds model (Whitehead formula), common OR = ' + commonOR + '</div>';
        html += '<div class="result-detail">' + result.nPerGroup + ' per group';
        if (params.dropout > 0) html += '. Dropout-adjusted: <strong class="text-accent">' + dropoutN + '</strong>';
        html += '</div>';

        html += '<div class="chart-container"><canvas id="ss-mrs-chart" width="600" height="300"></canvas></div>';

        // Sensitivity by common OR
        html += '<div class="card-title mt-3">Sensitivity: N by Common OR</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Common OR</th><th>N per Group</th><th>Total N</th></tr></thead><tbody>';
        [1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0, 2.5, 3.0].forEach(function(or) {
            var r = Statistics.sampleSizeOrdinalShift(controlDist, null, or, params.alpha, params.power);
            var isBase = Math.abs(or - commonOR) < 0.01;
            html += '<tr' + (isBase ? ' style="background:var(--accent-muted)"' : '') + '>'
                + '<td class="num">' + or.toFixed(1) + '</td>'
                + '<td class="num' + (isBase ? ' highlight' : '') + '">' + r.nPerGroup + '</td>'
                + '<td class="num">' + r.total + '</td></tr>';
        });
        html += '</tbody></table></div>';

        // Methods text
        var methodsText = 'The primary analysis will use an ordinal shift analysis of the modified Rankin Scale '
            + 'at 90 days using a proportional odds model. Assuming a common odds ratio of ' + commonOR
            + ', a two-sided significance level of ' + params.alpha + ', and ' + (params.power * 100).toFixed(0)
            + '% power, the Whitehead formula yields a required sample size of ' + result.nPerGroup
            + ' per group (' + result.total + ' total).'
            + (params.dropout > 0 ? ' After adjusting for ' + (params.dropout * 100).toFixed(0) + '% dropout, ' + dropoutN + ' participants will be enrolled.' : '');

        html += buildMethodsBlock(methodsText, 'ss-methods-ordinal');
        html += '</div>';

        App.setTrustedHTML(document.getElementById('ss-ordinal-results'), html);

        setTimeout(function() {
            var canvas = document.getElementById('ss-mrs-chart');
            if (!canvas) return;
            Charts.BarChart(canvas, {
                categories: ['mRS 0', 'mRS 1', 'mRS 2', 'mRS 3', 'mRS 4', 'mRS 5', 'mRS 6'],
                series: [
                    { label: 'Control', values: controlDist.map(function(v) { return v * 100; }) }
                ],
                title: 'Control Group mRS Distribution',
                yLabel: 'Proportion (%)',
                width: 600, height: 300,
                stacked: false
            });
        }, 100);
    }

    function calculateNonInf() {
        var p = validateField('ss_ni_p', 0.01, 0.99, 'Expected rate');
        var margin = validateField('ss_ni_margin', 0.001, 0.50, 'Non-inferiority margin');
        if (p === null || margin === null) return;
        var alpha = parseFloat(document.getElementById('ss_ni_alpha').value);
        var params = getCommonParams();

        var result = Statistics.sampleSizeNonInferiority(p, p, margin, alpha, params.power, params.ratio);
        var dropoutN = Math.ceil(result.total / (1 - params.dropout));

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + result.total + ' participants</div>';
        html += '<div class="result-label">Non-inferiority design, margin = ' + margin + ', one-sided \u03B1 = ' + alpha + '</div>';
        html += '<div class="result-detail">' + result.n1 + ' per group';
        if (params.dropout > 0) html += '. Dropout-adjusted: <strong class="text-accent">' + dropoutN + '</strong>';
        html += '</div>';

        // Sensitivity by margin
        html += '<div class="card-title mt-3">Sensitivity: N by NI Margin</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Margin</th><th>N/Group</th><th>Total N</th></tr></thead><tbody>';
        [0.02, 0.03, 0.05, 0.07, 0.10, 0.12, 0.15].forEach(function(m) {
            var r = Statistics.sampleSizeNonInferiority(p, p, m, alpha, params.power, params.ratio);
            var isBase = Math.abs(m - margin) < 0.001;
            html += '<tr' + (isBase ? ' style="background:var(--accent-muted)"' : '') + '>'
                + '<td class="num">' + m.toFixed(2) + '</td>'
                + '<td class="num' + (isBase ? ' highlight' : '') + '">' + r.n1 + '</td>'
                + '<td class="num">' + r.total + '</td></tr>';
        });
        html += '</tbody></table></div>';

        var methodsText = 'Sample size was calculated for a non-inferiority design comparing two groups with an expected event rate of '
            + (p * 100).toFixed(1) + '% in both arms. Using a non-inferiority margin of ' + (margin * 100).toFixed(1)
            + ' percentage points, a one-sided significance level of ' + alpha + ', and '
            + (params.power * 100).toFixed(0) + '% power, ' + result.n1 + ' participants per group ('
            + result.total + ' total) are required.'
            + (params.dropout > 0 ? ' With ' + (params.dropout * 100).toFixed(0) + '% dropout adjustment, ' + dropoutN + ' will be enrolled.' : '');

        html += buildMethodsBlock(methodsText, 'ss-methods-ni');
        html += '</div>';

        App.setTrustedHTML(document.getElementById('ss-noninf-results'), html);
    }

    function calculateEquivalence() {
        var p = validateField('ss_eq_p', 0.01, 0.99, 'Expected rate');
        var margin = validateField('ss_eq_margin', 0.001, 0.50, 'Equivalence margin');
        if (p === null || margin === null) return;
        var alpha = parseFloat(document.getElementById('ss_eq_alpha').value);
        var power = parseFloat(document.getElementById('ss_eq_power').value);

        var result = Statistics.sampleSizeEquivalence(p, margin, alpha, power);

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + result.total + ' participants</div>';
        html += '<div class="result-label">Equivalence (TOST) design, margin = \u00B1' + margin + ', one-sided \u03B1 = ' + alpha + '</div>';
        html += '<div class="result-detail">' + result.n1 + ' per group</div>';

        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + result.n1 + '</div><div class="result-item-label">N per Group</div></div>'
            + '<div class="result-item"><div class="result-item-value">\u00B1' + (margin * 100).toFixed(1) + '%</div><div class="result-item-label">Equivalence Margin</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (power * 100).toFixed(0) + '%</div><div class="result-item-label">Power</div></div>'
            + '</div>';

        // Sensitivity by margin
        html += '<div class="card-title mt-3">Sensitivity: N by Margin</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Margin</th><th>N/Group</th><th>Total N</th></tr></thead><tbody>';
        [0.05, 0.08, 0.10, 0.12, 0.15, 0.20, 0.25].forEach(function(m) {
            var r = Statistics.sampleSizeEquivalence(p, m, alpha, power);
            var isBase = Math.abs(m - margin) < 0.001;
            html += '<tr' + (isBase ? ' style="background:var(--accent-muted)"' : '') + '>'
                + '<td class="num">\u00B1' + (m * 100).toFixed(1) + '%</td>'
                + '<td class="num' + (isBase ? ' highlight' : '') + '">' + r.n1 + '</td>'
                + '<td class="num">' + r.total + '</td></tr>';
        });
        html += '</tbody></table></div>';

        var methodsText = 'Sample size was estimated for an equivalence trial using the two one-sided tests (TOST) procedure. '
            + 'Assuming an expected event rate of ' + (p * 100).toFixed(1) + '% in both groups, '
            + 'an equivalence margin of \u00B1' + (margin * 100).toFixed(1) + ' percentage points, '
            + 'a one-sided significance level of ' + alpha + ', and ' + (power * 100).toFixed(0) + '% power, '
            + 'a total of ' + result.total + ' participants (' + result.n1 + ' per group) are required.';

        html += buildMethodsBlock(methodsText, 'ss-methods-equiv');
        html += '</div>';

        App.setTrustedHTML(document.getElementById('ss-equivalence-results'), html);
    }

    function calculateCrossover() {
        var delta = validateField('ss_co_delta', 0.001, 10000, 'Mean difference');
        var sd = validateField('ss_co_sd', 0.1, 10000, 'Within-subject SD');
        if (delta === null || sd === null) return;

        var nPeriods = parseInt(document.getElementById('ss_co_periods').value);
        var alpha = parseFloat(document.getElementById('ss_co_alpha').value);
        var power = parseFloat(document.getElementById('ss_co_power').value);
        var dropout = parseFloat(document.getElementById('ss_co_dropout').value) / 100;

        var result = Statistics.sampleSizeCrossover(delta, sd, alpha, power, nPeriods);
        var dropoutN = Math.ceil(result.total / (1 - dropout));

        // Compare with parallel design
        var parallelResult = Statistics.sampleSizeTwoMeans(delta, sd * Math.sqrt(2), sd * Math.sqrt(2), alpha, power, 1);

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + result.total + ' participants</div>';
        html += '<div class="result-label">Crossover design (' + nPeriods + ' periods), within-subject SD = ' + sd + '</div>';
        html += '<div class="result-detail">Each participant receives both treatments';
        if (dropout > 0) html += '. Dropout-adjusted: <strong class="text-accent">' + dropoutN + '</strong>';
        html += '</div>';

        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + result.total + '</div><div class="result-item-label">Crossover N</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + parallelResult.total + '</div><div class="result-item-label">Parallel Design N</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (result.total / parallelResult.total * 100).toFixed(0) + '%</div><div class="result-item-label">Efficiency Gain</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + nPeriods + '</div><div class="result-item-label">Periods</div></div>'
            + '</div>';

        var methodsText = 'Sample size was calculated for a ' + nPeriods + '-period crossover design. '
            + 'Assuming a mean within-subject difference of ' + delta + ' with within-subject standard deviation of ' + sd
            + ', a two-sided significance level of ' + alpha + ', and ' + (power * 100).toFixed(0) + '% power, '
            + 'a total of ' + result.total + ' participants are required (each serving as their own control). '
            + 'By comparison, a parallel design would require ' + parallelResult.total + ' participants.'
            + (dropout > 0 ? ' Adjusting for ' + (dropout * 100).toFixed(0) + '% dropout, ' + dropoutN + ' will be enrolled.' : '');

        html += buildMethodsBlock(methodsText, 'ss-methods-co');
        html += '</div>';

        App.setTrustedHTML(document.getElementById('ss-crossover-results'), html);
    }

    function calculateDiagnostic() {
        var sens = validateField('ss_dx_sens', 0.01, 0.99, 'Expected sensitivity');
        var spec = validateField('ss_dx_spec', 0.01, 0.99, 'Expected specificity');
        var width = validateField('ss_dx_width', 0.01, 0.50, 'CI half-width');
        var prev = validateField('ss_dx_prev', 0.01, 0.99, 'Disease prevalence');
        if (sens === null || spec === null || width === null || prev === null) return;

        var resultSens = Statistics.sampleSizeDiagnosticAccuracy(sens, width, 0.05, prev);
        var resultSpec = Statistics.sampleSizeDiagnosticAccuracy(spec, width, 0.05, prev);

        var nDiseased = resultSens.nMetric;
        var nHealthy = resultSpec.nMetric;
        var totalForSens = Math.ceil(nDiseased / prev);
        var totalForSpec = Math.ceil(nHealthy / (1 - prev));
        var totalRequired = Math.max(totalForSens, totalForSpec);

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + totalRequired + ' total participants</div>';
        html += '<div class="result-label">Diagnostic accuracy study (95% CI half-width = ' + (width * 100).toFixed(0) + '%)</div>';

        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + nDiseased + '</div><div class="result-item-label">Diseased Subjects (for sensitivity)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + nHealthy + '</div><div class="result-item-label">Non-Diseased (for specificity)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + totalForSens + '</div><div class="result-item-label">Total (from sensitivity)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + totalForSpec + '</div><div class="result-item-label">Total (from specificity)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (prev * 100).toFixed(0) + '%</div><div class="result-item-label">Disease Prevalence</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + totalRequired + '</div><div class="result-item-label">Minimum Total Required</div></div>'
            + '</div>';

        // Sensitivity table by CI width
        html += '<div class="card-title mt-3">N by Desired Precision</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>CI Half-Width</th><th>N Diseased</th><th>N Healthy</th><th>Total (prev=' + (prev * 100).toFixed(0) + '%)</th></tr></thead><tbody>';
        [0.03, 0.05, 0.07, 0.10, 0.15].forEach(function(w) {
            var rS = Statistics.sampleSizeDiagnosticAccuracy(sens, w, 0.05, prev);
            var rSp = Statistics.sampleSizeDiagnosticAccuracy(spec, w, 0.05, prev);
            var tot = Math.max(Math.ceil(rS.nMetric / prev), Math.ceil(rSp.nMetric / (1 - prev)));
            var isBase = Math.abs(w - width) < 0.001;
            html += '<tr' + (isBase ? ' style="background:var(--accent-muted)"' : '') + '>'
                + '<td class="num">\u00B1' + (w * 100).toFixed(0) + '%</td>'
                + '<td class="num">' + rS.nMetric + '</td>'
                + '<td class="num">' + rSp.nMetric + '</td>'
                + '<td class="num' + (isBase ? ' highlight' : '') + '">' + tot + '</td></tr>';
        });
        html += '</tbody></table></div>';

        var methodsText = 'The sample size for this diagnostic accuracy study was calculated to estimate sensitivity of '
            + (sens * 100).toFixed(0) + '% and specificity of ' + (spec * 100).toFixed(0) + '% each with a 95% confidence interval '
            + 'half-width of ' + (width * 100).toFixed(0) + ' percentage points. '
            + 'This requires ' + nDiseased + ' diseased and ' + nHealthy + ' non-diseased subjects. '
            + 'Assuming a disease prevalence of ' + (prev * 100).toFixed(0) + '% in the study population, '
            + 'a total of ' + totalRequired + ' participants must be enrolled.';

        html += buildMethodsBlock(methodsText, 'ss-methods-dx');
        html += '</div>';

        App.setTrustedHTML(document.getElementById('ss-diagnostic-results'), html);
    }

    function calculateCluster() {
        var n = parseInt(document.getElementById('ss_cl_n').value);
        var icc = parseFloat(document.getElementById('ss_cl_icc').value);
        var clusterSize = parseInt(document.getElementById('ss_cl_size').value);

        var result = Statistics.sampleSizeCluster(n, icc, clusterSize);

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + result.totalN + ' participants</div>';
        html += '<div class="result-label">Design effect = ' + result.deff.toFixed(2) + '</div>';
        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + result.deff.toFixed(2) + '</div><div class="result-item-label">Design Effect</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + result.nClusters + '</div><div class="result-item-label">Clusters per Arm</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (result.nClusters * 2) + '</div><div class="result-item-label">Total Clusters</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + result.totalN + '</div><div class="result-item-label">Total Participants</div></div>'
            + '</div>';

        // Sensitivity by ICC
        html += '<div class="card-title mt-3">Sensitivity: N by ICC and Cluster Size</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>ICC</th>';
        [10, 20, 30, 50, 75].forEach(function(cs) { html += '<th>m=' + cs + '</th>'; });
        html += '</tr></thead><tbody>';
        [0.01, 0.02, 0.03, 0.05, 0.08, 0.10].forEach(function(ic) {
            var isBaseICC = Math.abs(ic - icc) < 0.001;
            html += '<tr' + (isBaseICC ? ' style="background:var(--accent-muted)"' : '') + '>';
            html += '<td class="num">' + ic.toFixed(2) + '</td>';
            [10, 20, 30, 50, 75].forEach(function(cs) {
                var r = Statistics.sampleSizeCluster(n, ic, cs);
                var isBase = isBaseICC && cs === clusterSize;
                html += '<td class="num' + (isBase ? ' highlight' : '') + '">' + r.totalN + '</td>';
            });
            html += '</tr>';
        });
        html += '</tbody></table></div>';

        var methodsText = 'Sample size was calculated for a cluster-randomized design. Starting from an individual-level sample size of '
            + n + ', with an intracluster correlation coefficient (ICC) of ' + icc + ' and ' + clusterSize + ' subjects per cluster, '
            + 'the design effect is ' + result.deff.toFixed(2) + ', yielding ' + result.nClusters + ' clusters per arm ('
            + (result.nClusters * 2) + ' total clusters, ' + result.totalN + ' total participants).';

        html += buildMethodsBlock(methodsText, 'ss-methods-cluster');
        html += '</div>';

        App.setTrustedHTML(document.getElementById('ss-cluster-results'), html);
    }

    function calculateStepped() {
        var n = parseInt(document.getElementById('ss_sw_n').value);
        var steps = parseInt(document.getElementById('ss_sw_steps').value);
        var cps = parseInt(document.getElementById('ss_sw_cps').value);
        var icc = parseFloat(document.getElementById('ss_sw_icc').value);

        var result = Statistics.sampleSizeSteppedWedge(n, steps, cps, icc);

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + result.totalN + ' participants</div>';
        html += '<div class="result-label">' + result.totalClusters + ' clusters, ' + steps + ' steps, correction factor = ' + result.correctionFactor.toFixed(3) + '</div>';

        var methodsText = 'Using a stepped-wedge cluster randomized design (Hussey-Hughes framework) with '
            + steps + ' steps, ' + cps + ' clusters per step (' + result.totalClusters + ' total clusters), '
            + 'and ICC of ' + icc + ', the design correction factor is ' + result.correctionFactor.toFixed(3)
            + ', yielding a total sample size of ' + result.totalN + ' participants.';

        html += buildMethodsBlock(methodsText, 'ss-methods-sw');
        html += '</div>';
        App.setTrustedHTML(document.getElementById('ss-stepped-results'), html);
    }

    function calculateMultiArm() {
        var n = parseInt(document.getElementById('ss_ma_n').value);
        var arms = parseInt(document.getElementById('ss_ma_arms').value);
        var corr = document.getElementById('ss_ma_corr').value;
        var alphaEl = document.getElementById('ss_ma_alpha');
        var powerEl = document.getElementById('ss_ma_power');
        var alpha = alphaEl ? parseFloat(alphaEl.value) : 0.05;
        var power = powerEl ? parseFloat(powerEl.value) : 0.80;

        var result = Statistics.sampleSizeMultiArm(n, arms, corr, alpha, power);

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + result.totalN + ' total</div>';
        html += '<div class="result-label">' + result.nPerArm + ' per arm (' + arms + ' arms), ' + corr + ' correction, family-wise \u03B1 = ' + alpha + ', adjusted per-comparison \u03B1 = ' + result.adjustedAlpha.toFixed(4) + '</div>';

        var methodsText = 'For a ' + arms + '-arm trial with ' + corr + ' correction for multiplicity '
            + 'at family-wise \u03B1 = ' + alpha + ' and power ' + (power * 100).toFixed(0) + '%, '
            + 'the per-comparison \u03B1 is ' + result.adjustedAlpha.toFixed(4)
            + '. Starting from a two-arm requirement of ' + n + ' per group, '
            + 'the inflation factor ((z_{\u03B1\'/2}+z_\u03B2)/(z_{\u03B1/2}+z_\u03B2))\u00B2 = ' + result.inflation.toFixed(3)
            + ' yields ' + result.nPerArm + ' per arm (' + result.totalN + ' total).';

        html += buildMethodsBlock(methodsText, 'ss-methods-ma');
        html += '</div>';
        App.setTrustedHTML(document.getElementById('ss-multiarm-results'), html);
    }

    function calculateGroupSeq() {
        var fixedN = parseInt(document.getElementById('ss_gs_fixedn').value);
        var nLooks = parseInt(document.getElementById('ss_gs_looks').value);
        var type = document.getElementById('ss_gs_type').value;

        if (isNaN(fixedN) || fixedN < 10) {
            Export.showToast('Fixed-design N must be at least 10', 'error');
            return;
        }

        var gsResult = Statistics.sampleSizeGroupSequential(fixedN, nLooks, type);
        var boundaries = Statistics.groupSequentialBoundaries(nLooks, 0.05, type);

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + gsResult.nAdjusted + ' total (maximum)</div>';
        html += '<div class="result-label">Group sequential design: ' + (type === 'obf' ? "O'Brien-Fleming" : 'Pocock') + ', '
            + nLooks + ' looks, inflation factor = ' + gsResult.inflationFactor.toFixed(3) + '</div>';

        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + fixedN + '</div><div class="result-item-label">Fixed Design N</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + gsResult.nAdjusted + '</div><div class="result-item-label">Maximum N</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + gsResult.inflationFactor.toFixed(3) + '</div><div class="result-item-label">Inflation Factor</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + nLooks + '</div><div class="result-item-label">Planned Analyses</div></div>'
            + '</div>';

        // Boundaries table
        html += '<div class="card-title mt-3">Stopping Boundaries</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Analysis</th><th>Information Fraction</th><th>Cumulative N</th><th>Z Boundary</th><th>Nominal \u03B1</th></tr></thead><tbody>';
        boundaries.forEach(function(b) {
            html += '<tr><td>' + b.look + ' of ' + nLooks + '</td>'
                + '<td class="num">' + b.fraction.toFixed(2) + '</td>'
                + '<td class="num">' + Math.ceil(gsResult.nAdjusted * b.fraction) + '</td>'
                + '<td class="num highlight">' + b.z.toFixed(3) + '</td>'
                + '<td class="num">' + b.nominalAlpha.toFixed(4) + '</td></tr>';
        });
        html += '</tbody></table></div>';

        var methodsText = 'A group sequential design with ' + nLooks + ' planned analyses was used with '
            + (type === 'obf' ? "O'Brien-Fleming" : 'Pocock') + ' alpha spending function. '
            + 'The fixed-design sample size of ' + fixedN + ' was inflated by a factor of '
            + gsResult.inflationFactor.toFixed(3) + ' to a maximum of ' + gsResult.nAdjusted
            + ' participants. Interim analyses will be conducted at information fractions of '
            + boundaries.map(function(b) { return b.fraction.toFixed(2); }).join(', ')
            + ' with corresponding z-boundaries of '
            + boundaries.map(function(b) { return b.z.toFixed(3); }).join(', ') + '.';

        html += buildMethodsBlock(methodsText, 'ss-methods-gs');
        html += '</div>';

        App.setTrustedHTML(document.getElementById('ss-groupseq-results'), html);
    }

    /* ============================================================
     * Register module
     * ============================================================ */

    var moduleObj = {
        render: render,
        onThemeChange: function() {}
    };

    App.registerModule(MODULE_ID, moduleObj);

    window.SampleSizeModule = {
        switchTab: switchTab,
        syncRates: syncRates,
        loadPreset: loadPreset,
        loadMeansPreset: loadMeansPreset,
        loadSurvivalPreset: loadSurvivalPreset,
        loadNonInfPreset: loadNonInfPreset,
        loadEquivPreset: loadEquivPreset,
        loadCrossoverPreset: loadCrossoverPreset,
        loadDiagPreset: loadDiagPreset,
        loadClusterPreset: loadClusterPreset,
        loadGSPreset: loadGSPreset,
        loadMRSPreset: loadMRSPreset,
        updateMRSSum: updateMRSSum,
        calculateProportions: calculateProportions,
        calculateMeans: calculateMeans,
        calculateSurvival: calculateSurvival,
        calculateOrdinal: calculateOrdinal,
        calculateNonInf: calculateNonInf,
        calculateEquivalence: calculateEquivalence,
        calculateCrossover: calculateCrossover,
        calculateDiagnostic: calculateDiagnostic,
        calculateCluster: calculateCluster,
        calculateStepped: calculateStepped,
        calculateMultiArm: calculateMultiArm,
        calculateGroupSeq: calculateGroupSeq
    };
})();
