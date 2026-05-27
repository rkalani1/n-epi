/**
 * Neuro-Epi — Diagnostic Accuracy Module
 * 2x2 diagnostic table, sensitivity/specificity/LR/DOR with Wilson CIs,
 * Fagan nomogram (canvas), ROC curve with threshold markers, two-test comparison,
 * ROC comparison tab (DeLong reference), pre/post-test probability calculator,
 * STARD reporting checklist.
 */
(function() {
    'use strict';

    var MODULE_ID = 'diagnostic-accuracy';

    // ============================================================
    // STATE
    // ============================================================
    var preTestProb = 0.30;
    var rocPoints = [];
    var rocPoints2 = []; // second test for comparison
    var lastDiagResults = null;

    // ============================================================
    // RENDER
    // ============================================================
    function render(container) {
        var html = App.createModuleLayout(
            'Diagnostic Accuracy',
            'Calculate sensitivity, specificity, predictive values, likelihood ratios with confidence intervals. Includes Fagan nomogram, ROC curve analysis, pre/post-test probability calculator, two-test comparison, and STARD checklist.'
        );

        // ===== TAB NAV =====
        html += '<div class="card">';
        html += '<div class="tabs" id="da-tabs" style="flex-wrap:wrap;">'
            + '<button class="tab active" data-tab="accuracy" onclick="DiagAccuracyModule.switchTab(\'accuracy\')">Diagnostic Accuracy</button>'
            + '<button class="tab" data-tab="nomogram" onclick="DiagAccuracyModule.switchTab(\'nomogram\')">Fagan Nomogram</button>'
            + '<button class="tab" data-tab="prepost" onclick="DiagAccuracyModule.switchTab(\'prepost\')">Pre/Post-Test</button>'
            + '<button class="tab" data-tab="roc" onclick="DiagAccuracyModule.switchTab(\'roc\')">ROC Curve</button>'
            + '<button class="tab" data-tab="roccompare" onclick="DiagAccuracyModule.switchTab(\'roccompare\')">ROC Comparison</button>'
            + '<button class="tab" data-tab="compare" onclick="DiagAccuracyModule.switchTab(\'compare\')">Compare Two Tests</button>'
            + '<button class="tab" data-tab="stard" onclick="DiagAccuracyModule.switchTab(\'stard\')">STARD Checklist</button>'
            + '</div>';

        // ===== TAB A: Diagnostic Accuracy =====
        html += '<div class="tab-content active" id="tab-accuracy">';
        html += '<div class="card-subtitle">Enter the 2x2 contingency table from your diagnostic study.</div>';

        // 2x2 visual table
        html += '<div style="max-width:500px;margin:0 auto 16px;">';
        html += '<div class="table-scroll-wrap"><table class="data-table" style="text-align:center;">';
        html += '<thead><tr><th></th><th colspan="2" style="text-align:center;">Disease Status (Reference)</th></tr>'
            + '<tr><th>Test Result</th><th style="text-align:center;">Positive (D+)</th><th style="text-align:center;">Negative (D-)</th></tr></thead>';
        html += '<tbody>'
            + '<tr><td style="font-weight:600;">Test Positive</td>'
            + '<td><input type="number" class="form-input form-input--small text-center" id="da-tp" min="0" step="1" value="80" style="width:80px;margin:0 auto;" onchange="DiagAccuracyModule.calculate()">'
            + '<div class="text-secondary" style="font-size:0.7rem;">TP</div></td>'
            + '<td><input type="number" class="form-input form-input--small text-center" id="da-fp" min="0" step="1" value="10" style="width:80px;margin:0 auto;" onchange="DiagAccuracyModule.calculate()">'
            + '<div class="text-secondary" style="font-size:0.7rem;">FP</div></td></tr>'
            + '<tr><td style="font-weight:600;">Test Negative</td>'
            + '<td><input type="number" class="form-input form-input--small text-center" id="da-fn" min="0" step="1" value="20" style="width:80px;margin:0 auto;" onchange="DiagAccuracyModule.calculate()">'
            + '<div class="text-secondary" style="font-size:0.7rem;">FN</div></td>'
            + '<td><input type="number" class="form-input form-input--small text-center" id="da-tn" min="0" step="1" value="190" style="width:80px;margin:0 auto;" onchange="DiagAccuracyModule.calculate()">'
            + '<div class="text-secondary" style="font-size:0.7rem;">TN</div></td></tr>'
            + '</tbody></table></div>';
        html += '</div>';

        html += '<div class="btn-group" style="justify-content:center;">'
            + '<button class="btn btn-primary" onclick="DiagAccuracyModule.calculate()">Calculate</button>'
            + '<button class="btn btn-secondary" onclick="DiagAccuracyModule.copyDiagResults()">Copy All Results</button>'
            + '</div>';

        html += '<div id="da-results"></div>';
        html += '</div>'; // tab-accuracy

        // ===== TAB B: Fagan Nomogram =====
        html += '<div class="tab-content" id="tab-nomogram">';
        html += '<div class="card-subtitle">Interactive Fagan nomogram. Adjust pre-test probability to see post-test probabilities.</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Pre-test Probability (%) ' + App.tooltip('Prevalence or prior probability before testing') + '</label>'
            + '<input type="range" id="da-pretest-slider" min="1" max="99" value="' + Math.round(preTestProb * 100) + '" oninput="DiagAccuracyModule.updateNomogram()" style="width:100%;">'
            + '<div class="text-center" id="da-pretest-display" style="font-size:1.2rem;font-weight:600;">' + Math.round(preTestProb * 100) + '%</div></div>'
            + '<div class="form-group"><label class="form-label">Positive LR (+LR)</label>'
            + '<input type="number" class="form-input" id="da-plr-input" step="0.1" min="0.01" value="8.0" onchange="DiagAccuracyModule.updateNomogram()"></div>'
            + '<div class="form-group"><label class="form-label">Negative LR (-LR)</label>'
            + '<input type="number" class="form-input" id="da-nlr-input" step="0.01" min="0.001" max="1" value="0.11" onchange="DiagAccuracyModule.updateNomogram()"></div>'
            + '</div>';

        html += '<div class="result-grid" id="da-nomogram-results"></div>';
        html += '<div class="chart-container"><canvas id="da-nomogram-canvas"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'da-nomogram-canvas\'),\'fagan-nomogram.png\')">Export PNG</button></div>';
        html += '</div>'; // tab-nomogram

        // ===== TAB: Pre/Post-Test Probability Calculator =====
        html += '<div class="tab-content" id="tab-prepost">';
        html += '<div class="card-subtitle">Calculate post-test probabilities from pre-test probability and likelihood ratios. Visualize the shift as a bar.</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Pre-test Probability (%)</label>'
            + '<input type="number" class="form-input" id="da-pp-pretest" step="0.1" min="0.1" max="99.9" value="25"></div>'
            + '<div class="form-group"><label class="form-label">Positive LR (+LR)</label>'
            + '<input type="number" class="form-input" id="da-pp-plr" step="0.1" min="0.01" value="5.0"></div>'
            + '<div class="form-group"><label class="form-label">Negative LR (-LR)</label>'
            + '<input type="number" class="form-input" id="da-pp-nlr" step="0.01" min="0.001" max="10" value="0.15"></div>'
            + '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary" onclick="DiagAccuracyModule.calcPrePost()">Calculate</button></div>';
        html += '<div id="da-pp-results"></div>';
        html += '</div>'; // tab-prepost

        // ===== TAB C: ROC Curve =====
        html += '<div class="tab-content" id="tab-roc">';
        html += '<div class="card-subtitle">Enter sensitivity and specificity at multiple thresholds to plot the ROC curve and compute AUC. Click threshold markers on the plot to see details.</div>';

        html += '<div class="form-row form-row--2 mt-2">'
            + '<div class="form-group"><label class="form-label">Show Threshold Markers ' + App.tooltip('Display threshold values as labeled points on the ROC curve') + '</label>'
            + '<select class="form-select" id="da-roc-markers"><option value="all">All Thresholds</option><option value="optimal">Optimal Only</option><option value="none">None</option></select></div>'
            + '<div class="form-group"></div>'
            + '</div>';

        html += '<div class="btn-group">'
            + '<button class="btn btn-secondary" onclick="DiagAccuracyModule.addROCPoint()">+ Add Threshold Point</button>'
            + '<button class="btn btn-secondary" onclick="DiagAccuracyModule.loadROCExample()">Load Example</button>'
            + '<button class="btn btn-primary" onclick="DiagAccuracyModule.plotROC()">Plot ROC & Compute AUC</button>'
            + '</div>';

        html += '<div id="da-roc-table" class="mt-2"></div>';
        html += '<div id="da-roc-results"></div>';
        html += '</div>'; // tab-roc

        // ===== TAB: ROC Comparison =====
        html += '<div class="tab-content" id="tab-roccompare">';
        html += '<div class="card-subtitle">Compare two diagnostic tests by overlaying their ROC curves. Uses DeLong\'s method reference for AUC comparison.</div>';

        html += '<div class="card-title">Test 1 Data</div>';
        html += '<div class="btn-group">'
            + '<button class="btn btn-secondary" onclick="DiagAccuracyModule.addROCCompPoint(1)">+ Add Point (Test 1)</button>'
            + '<button class="btn btn-secondary" onclick="DiagAccuracyModule.loadROCCompExample()">Load Example</button>'
            + '</div>';
        html += '<div id="da-rocc-table1" class="mt-2"></div>';

        html += '<div class="card-title mt-3">Test 2 Data</div>';
        html += '<div class="btn-group">'
            + '<button class="btn btn-secondary" onclick="DiagAccuracyModule.addROCCompPoint(2)">+ Add Point (Test 2)</button>'
            + '</div>';
        html += '<div id="da-rocc-table2" class="mt-2"></div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="DiagAccuracyModule.compareROC()">Compare ROC Curves</button></div>';
        html += '<div id="da-rocc-results"></div>';
        html += '</div>'; // tab-roccompare

        // ===== TAB D: Compare Two Tests =====
        html += '<div class="tab-content" id="tab-compare">';
        html += '<div class="card-subtitle">Compare two diagnostic tests on the same subjects using McNemar\'s test for paired data.</div>';

        html += '<div style="max-width:450px;margin:0 auto 16px;">';
        html += '<div class="form-label text-center" style="font-weight:600;">Test 2 Result</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table" style="text-align:center;">';
        html += '<thead><tr><th>Test 1 \\ Test 2</th><th>Positive</th><th>Negative</th></tr></thead>';
        html += '<tbody>'
            + '<tr><td style="font-weight:600;">Positive</td>'
            + '<td><input type="number" class="form-input form-input--small text-center" id="da-mc-a" min="0" step="1" value="40" style="width:70px;margin:0 auto;">'
            + '<div class="text-secondary" style="font-size:0.7rem;">Both +</div></td>'
            + '<td><input type="number" class="form-input form-input--small text-center" id="da-mc-b" min="0" step="1" value="15" style="width:70px;margin:0 auto;">'
            + '<div class="text-secondary" style="font-size:0.7rem;">T1+, T2-</div></td></tr>'
            + '<tr><td style="font-weight:600;">Negative</td>'
            + '<td><input type="number" class="form-input form-input--small text-center" id="da-mc-c" min="0" step="1" value="5" style="width:70px;margin:0 auto;">'
            + '<div class="text-secondary" style="font-size:0.7rem;">T1-, T2+</div></td>'
            + '<td><input type="number" class="form-input form-input--small text-center" id="da-mc-d" min="0" step="1" value="140" style="width:70px;margin:0 auto;">'
            + '<div class="text-secondary" style="font-size:0.7rem;">Both -</div></td></tr>'
            + '</tbody></table></div>';
        html += '</div>';

        html += '<div class="btn-group" style="justify-content:center;">'
            + '<button class="btn btn-primary" onclick="DiagAccuracyModule.compareMcNemar()">Run McNemar\'s Test</button>'
            + '</div>';
        html += '<div id="da-compare-results"></div>';
        html += '</div>'; // tab-compare

        // ===== TAB: STARD Checklist =====
        html += '<div class="tab-content" id="tab-stard">';
        html += '<div class="card-subtitle">STARD 2015 Reporting Checklist for Diagnostic Accuracy Studies. Check items as you complete them.</div>';
        html += buildSTARDChecklist();
        html += '<div class="btn-group mt-3">'
            + '<button class="btn btn-secondary" onclick="DiagAccuracyModule.copySTARD()">Copy Checklist Status</button>'
            + '</div>';
        html += '</div>'; // tab-stard

        html += '</div>'; // card

        // ===== LEARN SECTION =====
        html += '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Learn: Diagnostic Accuracy Essentials</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';

        html += '<div class="card-subtitle" style="font-weight:600;">Key Formulas</div>';
        html += '<div style="background:var(--bg-secondary);padding:12px;border-radius:8px;font-family:var(--font-mono);margin-bottom:12px;">'
            + '<div><strong>Sensitivity:</strong> TP / (TP + FN)</div>'
            + '<div><strong>Specificity:</strong> TN / (TN + FP)</div>'
            + '<div><strong>PPV:</strong> TP / (TP + FP)</div>'
            + '<div><strong>NPV:</strong> TN / (TN + FN)</div>'
            + '<div><strong>+LR:</strong> Sensitivity / (1 \u2212 Specificity)</div>'
            + '<div><strong>\u2212LR:</strong> (1 \u2212 Sensitivity) / Specificity</div>'
            + '<div><strong>DOR:</strong> (+LR) / (\u2212LR)</div>'
            + '<div><strong>Youden J:</strong> Sensitivity + Specificity \u2212 1</div>'
            + '<div><strong>Post-test odds:</strong> Pre-test odds \u00D7 LR</div>'
            + '</div>';

        html += '<div class="card-subtitle" style="font-weight:600;">DeLong\'s Test for AUC Comparison</div>';
        html += '<div style="background:var(--bg-secondary);padding:12px;border-radius:8px;font-family:var(--font-mono);margin-bottom:12px;">'
            + '<div>DeLong et al. (1988) proposed a non-parametric method for comparing correlated AUCs.</div>'
            + '<div>This module provides the trapezoidal AUC approximation for each test; for formal DeLong\'s test, '
            + 'individual-level data is required (use R <code>pROC::roc.test()</code> or SAS).</div>'
            + '</div>';

        html += '<div class="card-subtitle" style="font-weight:600;">Assumptions</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>Reference standard is a true gold standard (no misclassification)</li>'
            + '<li>Test and reference applied independently</li>'
            + '<li>Cross-sectional sampling or case-control with representative spectrum</li>'
            + '<li>PPV/NPV depend on disease prevalence in the tested population</li>'
            + '<li>Likelihood ratios are prevalence-independent (preferred for clinical use)</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Common Pitfalls</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Spectrum bias:</strong> Testing only high-suspicion cases inflates sensitivity</li>'
            + '<li><strong>Verification bias:</strong> Only test-positive patients get the reference test</li>'
            + '<li><strong>PPV/NPV generalizability:</strong> These depend heavily on prevalence; use LR instead</li>'
            + '<li><strong>ROC threshold choice:</strong> Optimal threshold varies by clinical context (rule-in vs rule-out)</li>'
            + '<li><strong>Ignoring inconclusive results:</strong> Report and handle indeterminate test results</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;">'
            + '<li>Bossuyt PM, et al. STARD 2015: updated reporting for diagnostic accuracy studies. <em>BMJ</em>. 2015;351:h5527.</li>'
            + '<li>McGee S. Simplifying likelihood ratios. <em>J Gen Intern Med</em>. 2002;17:647-52.</li>'
            + '<li>Deeks JJ, Altman DG. Diagnostic tests 4: likelihood ratios. <em>BMJ</em>. 2004;329:168-9.</li>'
            + '<li>DeLong ER, DeLong DM, Clarke-Pearson DL. Comparing the areas under two or more correlated ROC curves. <em>Biometrics</em>. 1988;44:837-45.</li>'
            + '</ul>';
        html += '</div></div>';

        // ===== METHODS TEXT =====
        html += '<div class="card">';
        html += '<div class="card-title">Generate Methods Text</div>';
        html += '<div id="da-methods-text" class="text-output" style="min-height:40px;">Run a calculation above, then generate methods text.</div>';
        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="DiagAccuracyModule.generateMethods()">Generate Methods Text</button>'
            + '<button class="btn btn-secondary" onclick="DiagAccuracyModule.copyMethods()">Copy Methods</button></div>';
        html += '</div>';

        App.setTrustedHTML(container, html);
        renderROCTable();
        renderROCCompTables();
    }

    // ============================================================
    // TAB SWITCHING
    // ============================================================
    function switchTab(tabId) {
        document.querySelectorAll('#da-tabs .tab').forEach(function(t) {
            t.classList.toggle('active', t.dataset.tab === tabId);
        });
        var allTabs = ['accuracy', 'nomogram', 'prepost', 'roc', 'roccompare', 'compare', 'stard'];
        allTabs.forEach(function(id) {
            var el = document.getElementById('tab-' + id);
            if (el) el.classList.toggle('active', id === tabId);
        });

        if (tabId === 'nomogram') {
            setTimeout(function() { updateNomogram(); }, 50);
        }
    }

    // ============================================================
    // DIAGNOSTIC ACCURACY CALCULATION
    // ============================================================
    function calculate() {
        var tp = parseInt(document.getElementById('da-tp').value) || 0;
        var fp = parseInt(document.getElementById('da-fp').value) || 0;
        var fn = parseInt(document.getElementById('da-fn').value) || 0;
        var tn = parseInt(document.getElementById('da-tn').value) || 0;
        var n = tp + fp + fn + tn;

        if (n === 0) {
            Export.showToast('Enter values in the 2x2 table', 'error');
            return;
        }

        var da = Statistics.diagnosticAccuracy(tp, fp, fn, tn);
        lastDiagResults = da;

        // Update nomogram inputs
        var plrInput = document.getElementById('da-plr-input');
        var nlrInput = document.getElementById('da-nlr-input');
        if (plrInput && isFinite(da.plr)) plrInput.value = da.plr.toFixed(2);
        if (nlrInput && isFinite(da.nlr)) nlrInput.value = da.nlr.toFixed(3);

        var html = '<div class="result-panel animate-in mt-3">';

        // Main metrics table
        html += '<div class="card-title">Diagnostic Accuracy Metrics (Wilson 95% CI)</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr>'
            + '<th>Metric</th><th>Value</th><th>95% CI</th></tr></thead><tbody>';

        html += metricRow('Sensitivity', da.sensitivity.value, da.sensitivity.ci);
        html += metricRow('Specificity', da.specificity.value, da.specificity.ci);
        html += metricRow('PPV (Positive Predictive Value)', da.ppv.value, da.ppv.ci);
        html += metricRow('NPV (Negative Predictive Value)', da.npv.value, da.npv.ci);
        html += metricRowPlain('Positive Likelihood Ratio (+LR)', da.plr);
        html += metricRowPlain('Negative Likelihood Ratio (-LR)', da.nlr);
        html += metricRowPlain('Diagnostic Odds Ratio (DOR)', da.dor);
        html += metricRow('Accuracy', da.accuracy, null);
        html += metricRow('Prevalence', da.prevalence, null);
        html += metricRowPlain('Youden\'s J Index', da.youdenJ);

        html += '</tbody></table></div>';

        // Summary grid
        html += '<div class="result-grid mt-2">';
        html += '<div class="result-item"><div class="result-item-value">' + (da.sensitivity.value * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Sensitivity</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + (da.specificity.value * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Specificity</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + da.plr.toFixed(2) + '</div>'
            + '<div class="result-item-label">+LR</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + da.nlr.toFixed(3) + '</div>'
            + '<div class="result-item-label">-LR</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + da.dor.toFixed(1) + '</div>'
            + '<div class="result-item-label">DOR</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + da.youdenJ.toFixed(3) + '</div>'
            + '<div class="result-item-label">Youden\'s J</div></div>';
        html += '</div>';

        // SPIN / SNOUT interpretation
        html += '<div class="card-title mt-3">Clinical Interpretation</div>';
        html += '<div style="font-size:0.9rem;line-height:1.6;">';

        // SpPIn
        if (da.specificity.value >= 0.95) {
            html += '<div style="margin-bottom:8px;"><strong style="color:var(--success);">SpPIn (Specificity ' + (da.specificity.value * 100).toFixed(0) + '%):</strong> '
                + 'A highly specific test — when positive, it effectively rules IN disease. '
                + 'A positive result has a high +LR of ' + da.plr.toFixed(1) + ', meaning disease is '
                + da.plr.toFixed(1) + 'x more likely in those who test positive.</div>';
        } else if (da.specificity.value >= 0.90) {
            html += '<div style="margin-bottom:8px;"><strong>SpPIn (Specificity ' + (da.specificity.value * 100).toFixed(0) + '%):</strong> '
                + 'Moderately specific test. A positive result increases disease probability (+LR = ' + da.plr.toFixed(1) + ') '
                + 'but does not definitively rule in disease.</div>';
        } else {
            html += '<div style="margin-bottom:8px;"><strong>SpPIn:</strong> '
                + 'Specificity is ' + (da.specificity.value * 100).toFixed(0) + '% — not high enough for reliable rule-in. '
                + '+LR = ' + da.plr.toFixed(1) + '.</div>';
        }

        // SnNOut
        if (da.sensitivity.value >= 0.95) {
            html += '<div style="margin-bottom:8px;"><strong style="color:var(--success);">SnNOut (Sensitivity ' + (da.sensitivity.value * 100).toFixed(0) + '%):</strong> '
                + 'A highly sensitive test — when negative, it effectively rules OUT disease. '
                + 'A negative result has a low -LR of ' + da.nlr.toFixed(3) + ', making disease very unlikely.</div>';
        } else if (da.sensitivity.value >= 0.90) {
            html += '<div style="margin-bottom:8px;"><strong>SnNOut (Sensitivity ' + (da.sensitivity.value * 100).toFixed(0) + '%):</strong> '
                + 'Moderately sensitive. A negative result reduces disease probability (-LR = ' + da.nlr.toFixed(3) + ') '
                + 'but does not definitively rule out disease.</div>';
        } else {
            html += '<div style="margin-bottom:8px;"><strong>SnNOut:</strong> '
                + 'Sensitivity is ' + (da.sensitivity.value * 100).toFixed(0) + '% — not high enough for reliable rule-out. '
                + '-LR = ' + da.nlr.toFixed(3) + '.</div>';
        }

        // LR interpretation
        var plrLevel = da.plr >= 10 ? 'large and often conclusive' : (da.plr >= 5 ? 'moderate' : (da.plr >= 2 ? 'small' : 'negligible'));
        var nlrLevel = da.nlr <= 0.1 ? 'large and often conclusive' : (da.nlr <= 0.2 ? 'moderate' : (da.nlr <= 0.5 ? 'small' : 'negligible'));
        html += '<div style="margin-bottom:8px;">The shift in probability from a positive test is <strong>' + plrLevel + '</strong> (+LR = ' + da.plr.toFixed(2) + '). '
            + 'The shift from a negative test is <strong>' + nlrLevel + '</strong> (-LR = ' + da.nlr.toFixed(3) + ').</div>';

        html += '</div>';

        // R Script button
        html += '<button class="btn btn-sm r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.diagnosticAccuracy({tp:' + tp + ',fp:' + fp + ',fn:' + fn + ',tn:' + tn + '}), \'Diagnostic Accuracy\')">'
            + '&#129513; Generate R Script</button>';

        html += '</div>'; // result-panel

        App.setTrustedHTML(document.getElementById('da-results'), html);
    }

    function metricRow(label, value, ci) {
        var valStr = typeof value === 'number' ? (value * 100).toFixed(1) + '%' : value;
        var ciStr = ci ? '[' + (ci.lower * 100).toFixed(1) + '%, ' + (ci.upper * 100).toFixed(1) + '%]' : '-';
        return '<tr><td>' + label + '</td><td class="num">' + valStr + '</td><td class="num">' + ciStr + '</td></tr>';
    }

    function metricRowPlain(label, value) {
        var valStr = isFinite(value) ? value.toFixed(3) : (value > 0 ? 'Inf' : '0');
        return '<tr><td>' + label + '</td><td class="num">' + valStr + '</td><td class="num">-</td></tr>';
    }

    // ============================================================
    // COPY RESULTS
    // ============================================================
    function copyDiagResults() {
        if (!lastDiagResults) {
            Export.showToast('Run calculation first', 'error');
            return;
        }
        var da = lastDiagResults;
        var lines = [
            'Diagnostic Accuracy Results',
            'Sensitivity: ' + (da.sensitivity.value * 100).toFixed(1) + '% [' + (da.sensitivity.ci.lower * 100).toFixed(1) + ', ' + (da.sensitivity.ci.upper * 100).toFixed(1) + ']',
            'Specificity: ' + (da.specificity.value * 100).toFixed(1) + '% [' + (da.specificity.ci.lower * 100).toFixed(1) + ', ' + (da.specificity.ci.upper * 100).toFixed(1) + ']',
            'PPV: ' + (da.ppv.value * 100).toFixed(1) + '% [' + (da.ppv.ci.lower * 100).toFixed(1) + ', ' + (da.ppv.ci.upper * 100).toFixed(1) + ']',
            'NPV: ' + (da.npv.value * 100).toFixed(1) + '% [' + (da.npv.ci.lower * 100).toFixed(1) + ', ' + (da.npv.ci.upper * 100).toFixed(1) + ']',
            '+LR: ' + da.plr.toFixed(2),
            '-LR: ' + da.nlr.toFixed(3),
            'DOR: ' + da.dor.toFixed(1),
            'Accuracy: ' + (da.accuracy * 100).toFixed(1) + '%',
            'Prevalence: ' + (da.prevalence * 100).toFixed(1) + '%',
            'Youden\'s J: ' + da.youdenJ.toFixed(3)
        ];
        Export.copyText(lines.join('\n'));
    }

    // ============================================================
    // PRE/POST-TEST PROBABILITY CALCULATOR
    // ============================================================
    function calcPrePost() {
        var pre = parseFloat(document.getElementById('da-pp-pretest').value) / 100;
        var plr = parseFloat(document.getElementById('da-pp-plr').value);
        var nlr = parseFloat(document.getElementById('da-pp-nlr').value);
        if (isNaN(pre) || isNaN(plr) || isNaN(nlr)) { Export.showToast('Fill all fields', 'error'); return; }
        if (pre <= 0 || pre >= 1) { Export.showToast('Pre-test probability must be between 0 and 100%', 'error'); return; }

        var fagan = Statistics.faganNomogram(pre, plr, nlr);
        var postPos = fagan.postTestProbPos;
        var postNeg = fagan.postTestProbNeg;

        var html = '<div class="result-panel animate-in mt-3">';
        html += '<div class="result-grid">';
        html += '<div class="result-item"><div class="result-item-value">' + (pre * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Pre-test Probability</div></div>';
        html += '<div class="result-item"><div class="result-item-value" style="color:var(--danger);">' + (postPos * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Post-test (Test +)</div></div>';
        html += '<div class="result-item"><div class="result-item-value" style="color:var(--success);">' + (postNeg * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Post-test (Test -)</div></div>';
        html += '</div>';

        // Visual probability bar
        html += '<div class="card-title mt-3">Probability Shift Visualization</div>';
        var barWidth = 500;
        html += '<div style="max-width:' + barWidth + 'px;margin:0 auto;">';

        // Pre-test bar
        html += '<div style="margin-bottom:8px;font-size:0.85rem;"><strong>Pre-test:</strong></div>';
        html += '<div style="background:var(--bg-secondary);border-radius:4px;height:24px;position:relative;overflow:hidden;">'
            + '<div style="background:var(--accent);height:100%;width:' + (pre * 100) + '%;border-radius:4px;"></div>'
            + '<span style="position:absolute;right:6px;top:3px;font-size:0.8rem;color:var(--text);">' + (pre * 100).toFixed(1) + '%</span>'
            + '</div>';

        // Post-test positive bar
        html += '<div style="margin:8px 0 4px;font-size:0.85rem;"><strong style="color:var(--danger);">After Positive Test:</strong></div>';
        html += '<div style="background:var(--bg-secondary);border-radius:4px;height:24px;position:relative;overflow:hidden;">'
            + '<div style="background:var(--danger);height:100%;width:' + Math.min(postPos * 100, 100) + '%;border-radius:4px;opacity:0.8;"></div>'
            + '<span style="position:absolute;right:6px;top:3px;font-size:0.8rem;color:var(--text);">' + (postPos * 100).toFixed(1) + '%</span>'
            + '</div>';

        // Post-test negative bar
        html += '<div style="margin:8px 0 4px;font-size:0.85rem;"><strong style="color:var(--success);">After Negative Test:</strong></div>';
        html += '<div style="background:var(--bg-secondary);border-radius:4px;height:24px;position:relative;overflow:hidden;">'
            + '<div style="background:var(--success);height:100%;width:' + Math.min(postNeg * 100, 100) + '%;border-radius:4px;opacity:0.8;"></div>'
            + '<span style="position:absolute;right:6px;top:3px;font-size:0.8rem;color:var(--text);">' + (postNeg * 100).toFixed(1) + '%</span>'
            + '</div>';

        html += '</div>';

        // Copy button
        html += '<div class="btn-group mt-3"><button class="btn btn-secondary" onclick="DiagAccuracyModule.copyPrePost()">Copy Results</button></div>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('da-pp-results'), html);
        window._daPrePost = { pre: pre, postPos: postPos, postNeg: postNeg, plr: plr, nlr: nlr };
    }

    function copyPrePost() {
        var r = window._daPrePost;
        if (!r) return;
        Export.copyText([
            'Pre/Post-Test Probability',
            'Pre-test: ' + (r.pre * 100).toFixed(1) + '%',
            '+LR: ' + r.plr.toFixed(2) + ', Post-test (positive): ' + (r.postPos * 100).toFixed(1) + '%',
            '-LR: ' + r.nlr.toFixed(3) + ', Post-test (negative): ' + (r.postNeg * 100).toFixed(1) + '%'
        ].join('\n'));
    }

    // ============================================================
    // FAGAN NOMOGRAM
    // ============================================================
    function updateNomogram() {
        var slider = document.getElementById('da-pretest-slider');
        var display = document.getElementById('da-pretest-display');
        if (!slider) return;

        preTestProb = parseInt(slider.value) / 100;
        if (display) display.textContent = Math.round(preTestProb * 100) + '%';

        var plr = parseFloat(document.getElementById('da-plr-input').value) || 1;
        var nlr = parseFloat(document.getElementById('da-nlr-input').value) || 1;

        var fagan = Statistics.faganNomogram(preTestProb, plr, nlr);

        // Update results
        var resEl = document.getElementById('da-nomogram-results');
        if (resEl) {
            var html = '<div class="result-item"><div class="result-item-value">' + (fagan.preTestProb * 100).toFixed(1) + '%</div>'
                + '<div class="result-item-label">Pre-test Probability</div></div>';
            html += '<div class="result-item"><div class="result-item-value" style="color:var(--danger);">' + (fagan.postTestProbPos * 100).toFixed(1) + '%</div>'
                + '<div class="result-item-label">Post-test Prob (Test +)</div></div>';
            html += '<div class="result-item"><div class="result-item-value" style="color:var(--success);">' + (fagan.postTestProbNeg * 100).toFixed(1) + '%</div>'
                + '<div class="result-item-label">Post-test Prob (Test -)</div></div>';
            App.setTrustedHTML(resEl, html);
        }

        // Draw nomogram
        drawNomogram(fagan, plr, nlr);
    }

    function drawNomogram(fagan, plr, nlr) {
        var canvas = document.getElementById('da-nomogram-canvas');
        if (!canvas) return;

        var width = 500;
        var height = 500;
        var theme = Charts.getTheme();
        var ctx = Charts.setupCanvas(canvas, width, height);

        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = theme.text;
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Fagan Nomogram', width / 2, 22);

        var leftX = 80;
        var midX = width / 2;
        var rightX = width - 80;
        var topY = 50;
        var botY = height - 40;
        var scaleH = botY - topY;

        function probToY(p) {
            if (p <= 0.001) p = 0.001;
            if (p >= 0.999) p = 0.999;
            var logOdds = Math.log(p / (1 - p));
            var t = (logOdds + 6) / 12;
            return botY - t * scaleH;
        }

        function lrToY(lr) {
            if (lr <= 0.001) lr = 0.001;
            if (lr > 1000) lr = 1000;
            var logLR = Math.log10(lr);
            var t = (logLR + 3) / 6;
            return botY - t * scaleH;
        }

        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 1.5;

        ctx.beginPath(); ctx.moveTo(leftX, topY); ctx.lineTo(leftX, botY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(midX, topY); ctx.lineTo(midX, botY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rightX, topY); ctx.lineTo(rightX, botY); ctx.stroke();

        ctx.font = '10px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = theme.textSecondary;

        var probTicks = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 0.95, 0.99];
        var probLabels = ['0.1', '0.2', '0.5', '1', '2', '5', '10', '20', '30', '40', '50', '60', '70', '80', '90', '95', '99'];

        probTicks.forEach(function(p, i) {
            var y = probToY(p);
            ctx.beginPath(); ctx.moveTo(leftX - 4, y); ctx.lineTo(leftX, y); ctx.stroke();
            ctx.textAlign = 'right'; ctx.fillText(probLabels[i], leftX - 7, y + 3);
            ctx.beginPath(); ctx.moveTo(rightX, y); ctx.lineTo(rightX + 4, y); ctx.stroke();
            ctx.textAlign = 'left'; ctx.fillText(probLabels[i], rightX + 7, y + 3);
        });

        var lrTicks = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 1000];
        var lrLabels = ['0.001', '0.002', '0.005', '0.01', '0.02', '0.05', '0.1', '0.2', '0.5', '1', '2', '5', '10', '20', '50', '100', '1000'];

        lrTicks.forEach(function(lr, i) {
            var y = lrToY(lr);
            ctx.beginPath(); ctx.moveTo(midX - 4, y); ctx.lineTo(midX + 4, y); ctx.stroke();
            ctx.textAlign = 'center'; ctx.fillText(lrLabels[i], midX, y - 5);
        });

        ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center'; ctx.fillStyle = theme.text;
        ctx.fillText('Pre-test', leftX, topY - 15); ctx.fillText('Prob (%)', leftX, topY - 4);
        ctx.fillText('Likelihood', midX, topY - 15); ctx.fillText('Ratio', midX, topY - 4);
        ctx.fillText('Post-test', rightX, topY - 15); ctx.fillText('Prob (%)', rightX, topY - 4);

        var preY = probToY(fagan.preTestProb);
        var plrY = lrToY(plr);
        var postPosY = probToY(fagan.postTestProbPos);

        ctx.strokeStyle = theme.danger; ctx.lineWidth = 2; ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(leftX, preY); ctx.lineTo(midX, plrY); ctx.lineTo(rightX, postPosY); ctx.stroke();

        var nlrY = lrToY(nlr);
        var postNegY = probToY(fagan.postTestProbNeg);

        ctx.strokeStyle = theme.success; ctx.lineWidth = 2; ctx.setLineDash([5, 3]);
        ctx.beginPath(); ctx.moveTo(leftX, preY); ctx.lineTo(midX, nlrY); ctx.lineTo(rightX, postNegY); ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath(); ctx.arc(leftX, preY, 5, 0, 2 * Math.PI); ctx.fillStyle = theme.accent; ctx.fill();
        ctx.beginPath(); ctx.arc(rightX, postPosY, 5, 0, 2 * Math.PI); ctx.fillStyle = theme.danger; ctx.fill();
        ctx.beginPath(); ctx.arc(rightX, postNegY, 5, 0, 2 * Math.PI); ctx.fillStyle = theme.success; ctx.fill();

        ctx.font = '11px system-ui, -apple-system, sans-serif'; ctx.textAlign = 'left';
        ctx.fillStyle = theme.danger; ctx.fillRect(leftX + 20, botY + 10, 16, 3);
        ctx.fillText('Test Positive: ' + (fagan.postTestProbPos * 100).toFixed(1) + '%', leftX + 40, botY + 15);
        ctx.fillStyle = theme.success; ctx.fillRect(leftX + 20, botY + 25, 16, 3);
        ctx.fillText('Test Negative: ' + (fagan.postTestProbNeg * 100).toFixed(1) + '%', leftX + 40, botY + 30);
    }

    // ============================================================
    // ROC CURVE
    // ============================================================
    var ROC_EXAMPLE = [
        { threshold: 0.1, sens: 0.98, spec: 0.20 },
        { threshold: 0.2, sens: 0.95, spec: 0.40 },
        { threshold: 0.3, sens: 0.90, spec: 0.58 },
        { threshold: 0.4, sens: 0.82, spec: 0.72 },
        { threshold: 0.5, sens: 0.75, spec: 0.82 },
        { threshold: 0.6, sens: 0.65, spec: 0.90 },
        { threshold: 0.7, sens: 0.50, spec: 0.95 },
        { threshold: 0.8, sens: 0.35, spec: 0.97 },
        { threshold: 0.9, sens: 0.15, spec: 0.99 }
    ];

    function renderROCTable() {
        var el = document.getElementById('da-roc-table');
        if (!el) return;

        if (rocPoints.length === 0) {
            App.setTrustedHTML(el, '<div class="text-secondary">No threshold points. Add points or load example.</div>');
            return;
        }

        var html = '<div class="table-scroll-wrap"><table class="data-table"><thead><tr>'
            + '<th>#</th><th>Threshold</th><th>Sensitivity</th><th>Specificity</th>'
            + '<th>1-Specificity (FPR)</th><th>Youden J</th><th></th>'
            + '</tr></thead><tbody>';

        rocPoints.forEach(function(p, i) {
            var fpr = !isNaN(p.spec) ? (1 - p.spec).toFixed(3) : '';
            var yJ = (!isNaN(p.sens) && !isNaN(p.spec)) ? (p.sens + p.spec - 1).toFixed(3) : '';
            html += '<tr>'
                + '<td>' + (i + 1) + '</td>'
                + '<td><input type="number" class="form-input form-input--small" step="any" value="' + p.threshold + '" onchange="DiagAccuracyModule.updateROCPoint(' + i + ',\'threshold\',this.value)"></td>'
                + '<td><input type="number" class="form-input form-input--small" step="0.01" min="0" max="1" value="' + p.sens + '" onchange="DiagAccuracyModule.updateROCPoint(' + i + ',\'sens\',this.value)"></td>'
                + '<td><input type="number" class="form-input form-input--small" step="0.01" min="0" max="1" value="' + p.spec + '" onchange="DiagAccuracyModule.updateROCPoint(' + i + ',\'spec\',this.value)"></td>'
                + '<td class="num">' + fpr + '</td>'
                + '<td class="num">' + yJ + '</td>'
                + '<td><button class="btn btn-xs btn-danger" onclick="DiagAccuracyModule.removeROCPoint(' + i + ')">x</button></td>'
                + '</tr>';
        });
        html += '</tbody></table></div>';
        App.setTrustedHTML(el, html);
    }

    function addROCPoint() {
        rocPoints.push({ threshold: '', sens: '', spec: '' });
        renderROCTable();
    }

    function removeROCPoint(i) {
        rocPoints.splice(i, 1);
        renderROCTable();
    }

    function updateROCPoint(i, field, value) {
        rocPoints[i][field] = value === '' ? '' : parseFloat(value);
    }

    function loadROCExample() {
        rocPoints = ROC_EXAMPLE.map(function(d) {
            return { threshold: d.threshold, sens: d.sens, spec: d.spec };
        });
        renderROCTable();
        Export.showToast('Loaded 9 ROC threshold points');
    }

    function plotROC() {
        var validPoints = rocPoints.filter(function(p) {
            return !isNaN(p.sens) && !isNaN(p.spec) && p.sens >= 0 && p.sens <= 1 && p.spec >= 0 && p.spec <= 1;
        });

        if (validPoints.length < 2) {
            Export.showToast('Need at least 2 valid threshold points', 'error');
            return;
        }

        var allPoints = [{ fpr: 0, tpr: 0, threshold: null }];
        validPoints.forEach(function(p) {
            allPoints.push({ fpr: 1 - p.spec, tpr: p.sens, threshold: p.threshold });
        });
        allPoints.push({ fpr: 1, tpr: 1, threshold: null });
        allPoints.sort(function(a, b) { return a.fpr - b.fpr; });

        var sens = validPoints.map(function(p) { return p.sens; });
        var spec = validPoints.map(function(p) { return p.spec; });
        var aucResult = Statistics.aucTrapezoidal(sens, spec);

        var bestJ = -1;
        var optimal = null;
        validPoints.forEach(function(p) {
            var j = p.sens + p.spec - 1;
            if (j > bestJ) {
                bestJ = j;
                optimal = { fpr: 1 - p.spec, tpr: p.sens, threshold: p.threshold, youdenJ: j };
            }
        });

        var markerMode = 'all';
        var markerEl = document.getElementById('da-roc-markers');
        if (markerEl) markerMode = markerEl.value;

        var resEl = document.getElementById('da-roc-results');
        var html = '<div class="result-panel animate-in mt-3">';
        html += '<div class="result-grid">';
        html += '<div class="result-item"><div class="result-item-value">' + aucResult.auc.toFixed(3) + '</div>'
            + '<div class="result-item-label">AUC</div></div>';
        html += '<div class="result-item"><div class="result-item-value">[' + aucResult.ci.lower.toFixed(3) + ', ' + aucResult.ci.upper.toFixed(3) + ']</div>'
            + '<div class="result-item-label">AUC 95% CI</div></div>';

        if (optimal) {
            html += '<div class="result-item"><div class="result-item-value">' + optimal.threshold + '</div>'
                + '<div class="result-item-label">Optimal Threshold (Youden)</div></div>';
            html += '<div class="result-item"><div class="result-item-value">' + optimal.youdenJ.toFixed(3) + '</div>'
                + '<div class="result-item-label">Max Youden\'s J</div></div>';
            html += '<div class="result-item"><div class="result-item-value">' + (optimal.tpr * 100).toFixed(1) + '%</div>'
                + '<div class="result-item-label">Sensitivity at Optimal</div></div>';
            html += '<div class="result-item"><div class="result-item-value">' + ((1 - optimal.fpr) * 100).toFixed(1) + '%</div>'
                + '<div class="result-item-label">Specificity at Optimal</div></div>';
        }
        html += '</div>';

        var aucInterp = aucResult.auc >= 0.9 ? 'excellent' : (aucResult.auc >= 0.8 ? 'good' : (aucResult.auc >= 0.7 ? 'fair' : (aucResult.auc >= 0.6 ? 'poor' : 'fail')));
        html += '<div class="text-secondary" style="margin-top:8px;">AUC interpretation: <strong>' + aucInterp + '</strong> discriminative ability.</div>';

        html += '<div class="chart-container"><canvas id="da-roc-canvas"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'da-roc-canvas\'),\'roc-curve.png\')">Export PNG</button>'
            + '<button class="btn btn-xs btn-secondary" onclick="DiagAccuracyModule.copyROCResults()">Copy ROC Results</button></div>';

        html += '</div>';

        App.setTrustedHTML(resEl, html);

        window._daROCResult = { auc: aucResult, optimal: optimal };

        setTimeout(function() {
            var canvas = document.getElementById('da-roc-canvas');
            if (!canvas) return;

            // Prepare threshold markers based on mode
            var thresholdMarkers = [];
            if (markerMode === 'all') {
                validPoints.forEach(function(p) {
                    thresholdMarkers.push({ fpr: 1 - p.spec, tpr: p.sens, label: '' + p.threshold });
                });
            } else if (markerMode === 'optimal' && optimal) {
                thresholdMarkers.push({ fpr: optimal.fpr, tpr: optimal.tpr, label: '' + optimal.threshold });
            }

            Charts.ROCCurve(canvas, {
                points: allPoints,
                auc: aucResult.auc,
                optimalThreshold: optimal,
                thresholdMarkers: thresholdMarkers,
                title: 'ROC Curve (AUC = ' + aucResult.auc.toFixed(3) + ')',
                width: 500,
                height: 500
            });
        }, 50);
    }

    function copyROCResults() {
        var r = window._daROCResult;
        if (!r) return;
        var lines = ['ROC Curve Results', 'AUC: ' + r.auc.auc.toFixed(4) + ' (' + r.auc.ci.lower.toFixed(4) + ', ' + r.auc.ci.upper.toFixed(4) + ')'];
        if (r.optimal) {
            lines.push('Optimal threshold: ' + r.optimal.threshold + ' (Youden J = ' + r.optimal.youdenJ.toFixed(3) + ')');
            lines.push('Sensitivity at optimal: ' + (r.optimal.tpr * 100).toFixed(1) + '%');
            lines.push('Specificity at optimal: ' + ((1 - r.optimal.fpr) * 100).toFixed(1) + '%');
        }
        Export.copyText(lines.join('\n'));
    }

    // ============================================================
    // ROC COMPARISON TAB
    // ============================================================
    var ROC_COMP_EXAMPLE_1 = [
        { threshold: 0.1, sens: 0.98, spec: 0.20 },
        { threshold: 0.3, sens: 0.90, spec: 0.55 },
        { threshold: 0.5, sens: 0.75, spec: 0.80 },
        { threshold: 0.7, sens: 0.50, spec: 0.93 },
        { threshold: 0.9, sens: 0.15, spec: 0.99 }
    ];
    var ROC_COMP_EXAMPLE_2 = [
        { threshold: 0.1, sens: 0.95, spec: 0.30 },
        { threshold: 0.3, sens: 0.85, spec: 0.60 },
        { threshold: 0.5, sens: 0.70, spec: 0.78 },
        { threshold: 0.7, sens: 0.40, spec: 0.90 },
        { threshold: 0.9, sens: 0.10, spec: 0.97 }
    ];

    function renderROCCompTables() {
        renderROCCompTable(1, rocPoints, 'da-rocc-table1');
        renderROCCompTable(2, rocPoints2, 'da-rocc-table2');
    }

    function renderROCCompTable(testNum, pts, elId) {
        var el = document.getElementById(elId);
        if (!el) return;
        if (pts.length === 0) {
            App.setTrustedHTML(el, '<div class="text-secondary">No points for Test ' + testNum + '.</div>');
            return;
        }
        var html = '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>#</th><th>Threshold</th><th>Sens</th><th>Spec</th><th></th></tr></thead><tbody>';
        pts.forEach(function(p, i) {
            html += '<tr><td>' + (i + 1) + '</td>'
                + '<td><input type="number" class="form-input form-input--small" step="any" value="' + p.threshold + '" onchange="DiagAccuracyModule.updateROCCompPoint(' + testNum + ',' + i + ',\'threshold\',this.value)"></td>'
                + '<td><input type="number" class="form-input form-input--small" step="0.01" min="0" max="1" value="' + p.sens + '" onchange="DiagAccuracyModule.updateROCCompPoint(' + testNum + ',' + i + ',\'sens\',this.value)"></td>'
                + '<td><input type="number" class="form-input form-input--small" step="0.01" min="0" max="1" value="' + p.spec + '" onchange="DiagAccuracyModule.updateROCCompPoint(' + testNum + ',' + i + ',\'spec\',this.value)"></td>'
                + '<td><button class="btn btn-xs btn-danger" onclick="DiagAccuracyModule.removeROCCompPoint(' + testNum + ',' + i + ')">x</button></td></tr>';
        });
        html += '</tbody></table></div>';
        App.setTrustedHTML(el, html);
    }

    function addROCCompPoint(testNum) {
        var arr = testNum === 1 ? rocPoints : rocPoints2;
        arr.push({ threshold: '', sens: '', spec: '' });
        renderROCCompTables();
    }

    function removeROCCompPoint(testNum, i) {
        var arr = testNum === 1 ? rocPoints : rocPoints2;
        arr.splice(i, 1);
        renderROCCompTables();
    }

    function updateROCCompPoint(testNum, i, field, value) {
        var arr = testNum === 1 ? rocPoints : rocPoints2;
        arr[i][field] = value === '' ? '' : parseFloat(value);
    }

    function loadROCCompExample() {
        rocPoints = ROC_COMP_EXAMPLE_1.map(function(d) { return { threshold: d.threshold, sens: d.sens, spec: d.spec }; });
        rocPoints2 = ROC_COMP_EXAMPLE_2.map(function(d) { return { threshold: d.threshold, sens: d.sens, spec: d.spec }; });
        renderROCCompTables();
        Export.showToast('Loaded example data for two tests');
    }

    function compareROC() {
        function getValidPoints(arr) {
            return arr.filter(function(p) {
                return !isNaN(p.sens) && !isNaN(p.spec) && p.sens >= 0 && p.sens <= 1 && p.spec >= 0 && p.spec <= 1;
            });
        }
        var v1 = getValidPoints(rocPoints);
        var v2 = getValidPoints(rocPoints2);
        if (v1.length < 2 || v2.length < 2) {
            Export.showToast('Each test needs at least 2 valid points', 'error');
            return;
        }

        var auc1 = Statistics.aucTrapezoidal(v1.map(function(p) { return p.sens; }), v1.map(function(p) { return p.spec; }));
        var auc2 = Statistics.aucTrapezoidal(v2.map(function(p) { return p.sens; }), v2.map(function(p) { return p.spec; }));

        var aucDiff = auc1.auc - auc2.auc;
        // Approximate comparison using independent SEs (note: DeLong requires paired data)
        var seDiff = Math.sqrt(auc1.se * auc1.se + auc2.se * auc2.se);
        var zDiff = seDiff > 0 ? Math.abs(aucDiff) / seDiff : 0;
        var pDiff = 2 * (1 - Statistics.normalCDF(Math.abs(zDiff)));

        var resEl = document.getElementById('da-rocc-results');
        var html = '<div class="result-panel animate-in mt-3">';

        html += '<div class="card-title">AUC Comparison</div>';
        html += '<div class="result-grid">';
        html += '<div class="result-item"><div class="result-item-value">' + auc1.auc.toFixed(3) + '</div>'
            + '<div class="result-item-label">AUC (Test 1)<br>[' + auc1.ci.lower.toFixed(3) + ', ' + auc1.ci.upper.toFixed(3) + ']</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + auc2.auc.toFixed(3) + '</div>'
            + '<div class="result-item-label">AUC (Test 2)<br>[' + auc2.ci.lower.toFixed(3) + ', ' + auc2.ci.upper.toFixed(3) + ']</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + aucDiff.toFixed(3) + '</div>'
            + '<div class="result-item-label">AUC Difference</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(pDiff) + '</div>'
            + '<div class="result-item-label">p-value (approx.)</div></div>';
        html += '</div>';

        html += '<div class="text-secondary" style="margin-top:8px;font-size:0.85rem;">'
            + '<strong>Note:</strong> This comparison uses independent standard errors as an approximation. '
            + 'For a formal DeLong\'s test with correlated AUCs from paired data, use R (<code>pROC::roc.test()</code>) '
            + 'or SAS (<code>PROC LOGISTIC</code> with <code>ROC</code> statement and <code>ROCCONTRAST</code>).'
            + '</div>';

        // Overlay ROC curves
        html += '<div class="chart-container"><canvas id="da-rocc-canvas"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'da-rocc-canvas\'),\'roc-comparison.png\')">Export PNG</button></div>';

        html += '</div>';
        App.setTrustedHTML(resEl, html);

        // Draw overlaid ROC curves
        setTimeout(function() {
            var canvas = document.getElementById('da-rocc-canvas');
            if (!canvas) return;

            function buildAllPoints(vp) {
                var pts = [{ fpr: 0, tpr: 0 }];
                vp.forEach(function(p) { pts.push({ fpr: 1 - p.spec, tpr: p.sens }); });
                pts.push({ fpr: 1, tpr: 1 });
                pts.sort(function(a, b) { return a.fpr - b.fpr; });
                return pts;
            }

            var pts1 = buildAllPoints(v1);
            var pts2 = buildAllPoints(v2);

            var theme = Charts.getTheme();
            var w = 500, h = 500;
            var ctx = Charts.setupCanvas(canvas, w, h);
            var pad = { top: 40, right: 30, bottom: 60, left: 60 };
            var plotW = w - pad.left - pad.right;
            var plotH = h - pad.top - pad.bottom;

            ctx.fillStyle = theme.bg;
            ctx.fillRect(0, 0, w, h);

            // Title
            ctx.fillStyle = theme.text;
            ctx.font = 'bold 13px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText('ROC Curve Comparison', w / 2, 22);

            // Grid
            ctx.strokeStyle = theme.grid;
            ctx.lineWidth = 1;
            for (var g = 0; g <= 10; g++) {
                var gx = pad.left + (g / 10) * plotW;
                var gy = pad.top + plotH - (g / 10) * plotH;
                ctx.beginPath(); ctx.moveTo(gx, pad.top); ctx.lineTo(gx, pad.top + plotH); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(pad.left + plotW, gy); ctx.stroke();
            }

            // Diagonal
            ctx.strokeStyle = theme.textTertiary;
            ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(pad.left, pad.top + plotH); ctx.lineTo(pad.left + plotW, pad.top); ctx.stroke();
            ctx.setLineDash([]);

            // Draw curves
            function drawCurve(pts, color, dash) {
                ctx.strokeStyle = color;
                ctx.lineWidth = 2.5;
                ctx.setLineDash(dash || []);
                ctx.beginPath();
                pts.forEach(function(p, i) {
                    var x = pad.left + p.fpr * plotW;
                    var y = pad.top + plotH - p.tpr * plotH;
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                });
                ctx.stroke();
                ctx.setLineDash([]);
            }

            drawCurve(pts1, theme.series[0], []);
            drawCurve(pts2, theme.series[1], [6, 3]);

            // Axes labels
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '11px system-ui';
            ctx.textAlign = 'center';
            for (var t = 0; t <= 10; t += 2) {
                var xp = pad.left + (t / 10) * plotW;
                var yp = pad.top + plotH - (t / 10) * plotH;
                ctx.fillText((t / 10).toFixed(1), xp, pad.top + plotH + 15);
                ctx.textAlign = 'right';
                ctx.fillText((t / 10).toFixed(1), pad.left - 8, yp + 4);
                ctx.textAlign = 'center';
            }
            ctx.fillStyle = theme.text;
            ctx.font = 'bold 12px system-ui';
            ctx.fillText('1 - Specificity (FPR)', pad.left + plotW / 2, pad.top + plotH + 35);
            ctx.save();
            ctx.translate(15, pad.top + plotH / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText('Sensitivity (TPR)', 0, 0);
            ctx.restore();

            // Legend
            var lx = pad.left + plotW - 160;
            var ly = pad.top + plotH - 30;
            ctx.fillStyle = theme.series[0]; ctx.fillRect(lx, ly, 16, 3);
            ctx.fillStyle = theme.text; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
            ctx.fillText('Test 1 (AUC=' + auc1.auc.toFixed(3) + ')', lx + 20, ly + 4);
            ctx.fillStyle = theme.series[1]; ctx.fillRect(lx, ly + 15, 16, 3);
            ctx.fillText('Test 2 (AUC=' + auc2.auc.toFixed(3) + ')', lx + 20, ly + 19);
        }, 80);
    }

    // ============================================================
    // COMPARE TWO TESTS (McNemar)
    // ============================================================
    function compareMcNemar() {
        var a = parseInt(document.getElementById('da-mc-a').value) || 0;
        var b = parseInt(document.getElementById('da-mc-b').value) || 0;
        var c = parseInt(document.getElementById('da-mc-c').value) || 0;
        var d = parseInt(document.getElementById('da-mc-d').value) || 0;
        var n = a + b + c + d;

        if (n === 0 || (b + c) === 0) {
            Export.showToast('Enter discordant pairs (b and c must be > 0)', 'error');
            return;
        }

        var mcResult = Statistics.mcNemarTest(b, c, false);
        var mcExact = (b + c) < 25 ? Statistics.mcNemarTest(b, c, true) : null;

        var pTest1 = (a + b) / n;
        var pTest2 = (a + c) / n;
        var diff = pTest1 - pTest2;

        var html = '<div class="result-panel animate-in mt-3">';
        html += '<div class="card-title">McNemar\'s Test for Paired Proportions</div>';

        html += '<div class="result-grid">';
        html += '<div class="result-item"><div class="result-item-value">' + (pTest1 * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Test 1 Positive Rate</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + (pTest2 * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Test 2 Positive Rate</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + (diff * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Difference</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + b + ' / ' + c + '</div>'
            + '<div class="result-item-label">Discordant Pairs (b / c)</div></div>';

        if (mcResult.chi2 !== undefined) {
            html += '<div class="result-item"><div class="result-item-value">' + mcResult.chi2.toFixed(3) + '</div>'
                + '<div class="result-item-label">McNemar Chi-squared</div></div>';
        }
        html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(mcResult.pValue) + '</div>'
            + '<div class="result-item-label">P-value (asymptotic)</div></div>';

        if (mcExact) {
            html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(mcExact.pValue) + '</div>'
                + '<div class="result-item-label">P-value (exact binomial)</div></div>';
        }
        html += '</div>';

        var sig = mcResult.pValue < 0.05;
        html += '<div class="text-secondary" style="margin-top:8px;font-size:0.9rem;">'
            + (sig ? 'The two tests have significantly different positive rates (P ' + Statistics.formatPValue(mcResult.pValue) + '). '
                    + 'Test 1 has a ' + (diff > 0 ? 'higher' : 'lower') + ' positive rate by ' + Math.abs(diff * 100).toFixed(1) + ' percentage points.'
                 : 'There is no significant difference between the two tests\' positive rates (P ' + Statistics.formatPValue(mcResult.pValue) + ').')
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('da-compare-results'), html);
    }

    // ============================================================
    // STARD CHECKLIST
    // ============================================================
    function buildSTARDChecklist() {
        var items = [
            { section: 'Title/Abstract', items: ['Identification as a diagnostic accuracy study', 'Structured summary of design, methods, results'] },
            { section: 'Introduction', items: ['Scientific background and rationale', 'Study objectives and hypotheses'] },
            { section: 'Methods', items: [
                'Study design (prospective or retrospective)',
                'Participants: eligibility criteria',
                'Participants: setting and location',
                'Participants: sampling method',
                'Test methods: index test description',
                'Test methods: reference standard description',
                'Test methods: threshold definition',
                'Analysis: methods for estimating diagnostic accuracy',
                'Analysis: methods for handling indeterminate results',
                'Analysis: methods for missing data'
            ]},
            { section: 'Results', items: [
                'Flow diagram of participants',
                'Baseline demographics',
                'Distribution of disease severity',
                'Cross-tabulation of results (2x2 table)',
                'Estimates of accuracy with CIs',
                'Any adverse events'
            ]},
            { section: 'Discussion', items: [
                'Study limitations and sources of bias',
                'Applicability with reference to context',
                'Implications for practice'
            ]},
            { section: 'Other', items: [
                'Registration number and registry name',
                'Where full protocol can be accessed',
                'Sources of funding and role of funders'
            ]}
        ];

        var html = '<div class="mt-2" id="da-stard-list">';
        var idx = 0;
        items.forEach(function(sec) {
            html += '<div class="card-subtitle" style="font-weight:600;margin-top:12px;">' + sec.section + '</div>';
            sec.items.forEach(function(item) {
                html += '<label style="display:flex;align-items:flex-start;gap:8px;padding:4px 0;font-size:0.9rem;cursor:pointer;">'
                    + '<input type="checkbox" class="da-stard-check" data-idx="' + idx + '" style="margin-top:3px;">'
                    + '<span>' + item + '</span></label>';
                idx++;
            });
        });
        html += '</div>';
        return html;
    }

    function copySTARD() {
        var checks = document.querySelectorAll('.da-stard-check');
        var total = checks.length;
        var checked = 0;
        var lines = ['STARD 2015 Checklist Status'];
        checks.forEach(function(cb) {
            var label = cb.parentElement.querySelector('span').textContent;
            var status = cb.checked ? '[x]' : '[ ]';
            if (cb.checked) checked++;
            lines.push(status + ' ' + label);
        });
        lines.unshift('Completed: ' + checked + '/' + total);
        Export.copyText(lines.join('\n'));
    }

    // ============================================================
    // METHODS TEXT
    // ============================================================
    function generateMethods() {
        if (!lastDiagResults) {
            Export.showToast('Run a calculation first', 'error');
            return;
        }
        var da = lastDiagResults;
        var tp = parseInt(document.getElementById('da-tp').value) || 0;
        var fp = parseInt(document.getElementById('da-fp').value) || 0;
        var fn = parseInt(document.getElementById('da-fn').value) || 0;
        var tn = parseInt(document.getElementById('da-tn').value) || 0;
        var n = tp + fp + fn + tn;
        var text = 'Diagnostic accuracy was assessed in ' + n + ' subjects (' + (tp + fn) + ' disease-positive, '
            + (fp + tn) + ' disease-negative). '
            + 'Sensitivity was ' + (da.sensitivity.value * 100).toFixed(1) + '% '
            + '(95% CI, ' + (da.sensitivity.ci.lower * 100).toFixed(1) + '\u2013' + (da.sensitivity.ci.upper * 100).toFixed(1) + '%) '
            + 'and specificity was ' + (da.specificity.value * 100).toFixed(1) + '% '
            + '(95% CI, ' + (da.specificity.ci.lower * 100).toFixed(1) + '\u2013' + (da.specificity.ci.upper * 100).toFixed(1) + '%). '
            + 'The positive likelihood ratio was ' + da.plr.toFixed(2)
            + ' and negative likelihood ratio was ' + da.nlr.toFixed(3) + '. '
            + 'Confidence intervals were computed using the Wilson score method. '
            + 'The diagnostic odds ratio was ' + da.dor.toFixed(1) + '.';
        var el = document.getElementById('da-methods-text');
        if (el) App.setTrustedHTML(el, text);
    }

    function copyMethods() {
        var el = document.getElementById('da-methods-text');
        if (el) Export.copyText(el.textContent);
    }

    // ============================================================
    // REGISTER MODULE
    // ============================================================
    App.registerModule(MODULE_ID, {
        render: render,
        onThemeChange: function() {
            var canvas = document.getElementById('da-nomogram-canvas');
            if (canvas && canvas.offsetParent !== null) {
                setTimeout(function() { updateNomogram(); }, 50);
            }
        }
    });

    window.DiagAccuracyModule = {
        switchTab: switchTab,
        calculate: calculate,
        copyDiagResults: copyDiagResults,
        calcPrePost: calcPrePost,
        copyPrePost: copyPrePost,
        updateNomogram: updateNomogram,
        addROCPoint: addROCPoint,
        removeROCPoint: removeROCPoint,
        updateROCPoint: updateROCPoint,
        loadROCExample: loadROCExample,
        plotROC: plotROC,
        copyROCResults: copyROCResults,
        addROCCompPoint: addROCCompPoint,
        removeROCCompPoint: removeROCCompPoint,
        updateROCCompPoint: updateROCCompPoint,
        loadROCCompExample: loadROCCompExample,
        compareROC: compareROC,
        compareMcNemar: compareMcNemar,
        copySTARD: copySTARD,
        generateMethods: generateMethods,
        copyMethods: copyMethods
    };
})();
