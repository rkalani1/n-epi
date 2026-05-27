/**
 * Neuro-Epi — Meta-Analysis Module
 * Fixed-effect (IV), DerSimonian-Laird random-effects, HKSJ adjustment,
 * forest plot, funnel plot, sensitivity analysis, results text generation.
 * Subgroup analysis, meta-regression reference, GRADE certainty assessment,
 * clipboard import, publication bias tools, trim-and-fill visualization,
 * PRISMA flow diagram generator.
 */
(function() {
    'use strict';

    var MODULE_ID = 'meta-analysis';

    // ============================================================
    // STATE
    // ============================================================
    var studyData = [];
    var inputMode = 'effect'; // 'effect' or 'binary'
    var selectedMeasure = 'OR';
    var useHKSJ = false;
    var lastResults = null;
    var activeTab = 'main'; // 'main', 'subgroup', 'metareg', 'grade', 'prisma', 'pubbias'

    // Subgroup state
    var subgroupVariable = '';

    // GRADE state
    var gradeOutcomes = [];

    // PRISMA state
    var prismaNumbers = {
        identified: '', duplicates: '', screened: '', excludedScreen: '',
        fullText: '', excludedFT: '', includedQual: '', includedQuant: ''
    };

    // ============================================================
    // EXAMPLE DATA — Endovascular thrombectomy (EVT) trials
    // ============================================================
    var EVT_EXAMPLE = [
        { name: 'MR CLEAN (2015)',    logEffect: 0.4700, se: 0.2100, subgroup: 'Europe' },
        { name: 'ESCAPE (2015)',      logEffect: 0.9555, se: 0.2510, subgroup: 'North America' },
        { name: 'EXTEND-IA (2015)',   logEffect: 1.1314, se: 0.4130, subgroup: 'Oceania' },
        { name: 'SWIFT PRIME (2015)', logEffect: 1.0647, se: 0.3430, subgroup: 'North America' },
        { name: 'REVASCAT (2015)',    logEffect: 0.5481, se: 0.2780, subgroup: 'Europe' }
    ];

    var EVT_BINARY_EXAMPLE = [
        { name: 'MR CLEAN (2015)',    e1: 76,  n1: 233, e2: 51,  n2: 267, subgroup: 'Europe' },
        { name: 'ESCAPE (2015)',      e1: 87,  n1: 165, e2: 43,  n2: 150, subgroup: 'North America' },
        { name: 'EXTEND-IA (2015)',   e1: 25,  n1: 35,  e2: 14,  n2: 35,  subgroup: 'Oceania' },
        { name: 'SWIFT PRIME (2015)', e1: 44,  n1: 98,  e2: 27,  n2: 98,  subgroup: 'North America' },
        { name: 'REVASCAT (2015)',    e1: 39,  n1: 103, e2: 28,  n2: 103, subgroup: 'Europe' }
    ];

    // ============================================================
    // RENDER
    // ============================================================
    function render(container) {
        var html = App.createModuleLayout(
            'Meta-Analysis',
            'Combine results from multiple studies with fixed-effect (IV) or DerSimonian-Laird random-effects models. Generate publication-quality forest and funnel plots.'
        );

        html += '<div class="card">';

        // Tabs
        html += '<div class="tabs" id="ma-tabs">'
            + '<button class="tab' + (activeTab === 'main' ? ' active' : '') + '" data-tab="main" onclick="MetaAnalysisModule.switchTab(\'main\')">Analysis</button>'
            + '<button class="tab' + (activeTab === 'subgroup' ? ' active' : '') + '" data-tab="subgroup" onclick="MetaAnalysisModule.switchTab(\'subgroup\')">Subgroup Analysis</button>'
            + '<button class="tab' + (activeTab === 'pubbias' ? ' active' : '') + '" data-tab="pubbias" onclick="MetaAnalysisModule.switchTab(\'pubbias\')">Publication Bias</button>'
            + '<button class="tab' + (activeTab === 'metareg' ? ' active' : '') + '" data-tab="metareg" onclick="MetaAnalysisModule.switchTab(\'metareg\')">Meta-Regression</button>'
            + '<button class="tab' + (activeTab === 'grade' ? ' active' : '') + '" data-tab="grade" onclick="MetaAnalysisModule.switchTab(\'grade\')">GRADE Assessment</button>'
            + '<button class="tab' + (activeTab === 'prisma' ? ' active' : '') + '" data-tab="prisma" onclick="MetaAnalysisModule.switchTab(\'prisma\')">PRISMA Flow</button>'
            + '</div>';

        // ===== MAIN TAB =====
        html += '<div class="tab-content' + (activeTab === 'main' ? ' active' : '') + '" id="tab-main">';

        // Input mode toggle
        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Input Mode ' + App.tooltip('Choose between entering effect sizes directly (log scale) or 2x2 binary tables') + '</label>'
            + '<select class="form-select" id="ma-input-mode" onchange="MetaAnalysisModule.switchInputMode(this.value)">'
            + '<option value="effect" ' + (inputMode === 'effect' ? 'selected' : '') + '>Effect Size + SE / CI</option>'
            + '<option value="binary" ' + (inputMode === 'binary' ? 'selected' : '') + '>2x2 Binary (Events / N)</option>'
            + '</select></div>'
            + '<div class="form-group"><label class="form-label">Effect Measure</label>'
            + '<select class="form-select" id="ma-measure" onchange="MetaAnalysisModule.changeMeasure(this.value)">'
            + '<option value="OR"' + (selectedMeasure === 'OR' ? ' selected' : '') + '>Odds Ratio (OR)</option>'
            + '<option value="RR"' + (selectedMeasure === 'RR' ? ' selected' : '') + '>Risk Ratio (RR)</option>'
            + '<option value="RD"' + (selectedMeasure === 'RD' ? ' selected' : '') + '>Risk Difference (RD)</option>'
            + '<option value="HR"' + (selectedMeasure === 'HR' ? ' selected' : '') + '>Hazard Ratio (HR)</option>'
            + '<option value="MD"' + (selectedMeasure === 'MD' ? ' selected' : '') + '>Mean Difference (MD)</option>'
            + '<option value="SMD"' + (selectedMeasure === 'SMD' ? ' selected' : '') + '>Standardized Mean Diff (SMD)</option>'
            + '</select></div></div>';

        // HKSJ checkbox
        html += '<div class="form-row">'
            + '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;">'
            + '<input type="checkbox" id="ma-hksj" ' + (useHKSJ ? 'checked' : '') + ' onchange="MetaAnalysisModule.toggleHKSJ(this.checked)">'
            + ' Hartung-Knapp-Sidik-Jonkman (HKSJ) adjustment ' + App.tooltip('Uses t-distribution with k-1 df and adjusted SE. Recommended when number of studies is small.') + '</label></div>';

        // Action buttons
        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="MetaAnalysisModule.loadExample()">Load Example (EVT Trials)</button>'
            + '<button class="btn btn-secondary" onclick="MetaAnalysisModule.pasteClipboard()">Paste from Clipboard</button>'
            + '<button class="btn btn-secondary" onclick="MetaAnalysisModule.addRow()">+ Add Row</button>'
            + '<button class="btn btn-primary" onclick="MetaAnalysisModule.runAnalysis()">Run Meta-Analysis</button>'
            + '</div>';

        // Data table container
        html += '<div id="ma-data-table" class="mt-2"></div>';

        // Results
        html += '<div id="ma-results"></div>';
        html += '</div>'; // end tab-main

        // ===== SUBGROUP ANALYSIS TAB =====
        html += '<div class="tab-content' + (activeTab === 'subgroup' ? ' active' : '') + '" id="tab-subgroup">';
        html += '<div class="card-subtitle">Split studies by a categorical variable and compare subgroup-specific pooled effects. Requires a "Subgroup" column in the data table.</div>';

        html += '<div class="form-group"><label class="form-label">Subgroup Variable Name ' + App.tooltip('Each study must have a value in its "Subgroup" column. Studies with the same value will be pooled together.') + '</label>'
            + '<input type="text" class="form-input" id="ma-subgroup-var" value="' + escAttr(subgroupVariable || 'Region') + '" placeholder="e.g., Region, Risk of Bias, Dose Level"></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="MetaAnalysisModule.runSubgroupAnalysis()">Run Subgroup Analysis</button>'
            + '</div>';

        html += '<div id="ma-subgroup-results"></div>';
        html += '</div>'; // end tab-subgroup

        // ===== PUBLICATION BIAS TAB =====
        html += '<div class="tab-content' + (activeTab === 'pubbias' ? ' active' : '') + '" id="tab-pubbias">';
        html += '<div class="card-subtitle">Advanced publication bias assessment tools including Egger\'s test, Begg\'s rank correlation, and trim-and-fill analysis with visualization.</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="MetaAnalysisModule.runPublicationBias()">Run Publication Bias Tests</button>'
            + '</div>';

        html += '<div id="ma-pubbias-results"></div>';
        html += '</div>'; // end tab-pubbias

        // ===== META-REGRESSION TAB =====
        html += '<div class="tab-content' + (activeTab === 'metareg' ? ' active' : '') + '" id="tab-metareg">';
        html += renderMetaRegressionPanel();
        html += '</div>'; // end tab-metareg

        // ===== GRADE ASSESSMENT TAB =====
        html += '<div class="tab-content' + (activeTab === 'grade' ? ' active' : '') + '" id="tab-grade">';
        html += renderGRADEPanel();
        html += '</div>'; // end tab-grade

        // ===== PRISMA FLOW TAB =====
        html += '<div class="tab-content' + (activeTab === 'prisma' ? ' active' : '') + '" id="tab-prisma">';
        html += renderPRISMAPanel();
        html += '</div>'; // end tab-prisma

        html += '</div>'; // card

        // ===== LEARN SECTION =====
        html += '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Learn: Meta-Analysis Essentials</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';

        html += '<div class="card-subtitle" style="font-weight:600;">Key Formulas</div>';
        html += '<div style="background:var(--bg-secondary);padding:12px;border-radius:8px;font-family:var(--font-mono);margin-bottom:12px;">'
            + '<div><strong>Fixed-Effect (IV):</strong> \u03B8\u0302 = \u03A3(w\u1D62\u03B8\u1D62) / \u03A3w\u1D62, w\u1D62 = 1/v\u1D62</div>'
            + '<div><strong>DerSimonian-Laird \u03C4\u00B2:</strong> \u03C4\u00B2 = max(0, (Q \u2212 (k\u22121)) / (S\u2081 \u2212 S\u2082/S\u2081))</div>'
            + '<div><strong>Cochran Q:</strong> Q = \u03A3 w\u1D62(\u03B8\u1D62 \u2212 \u03B8\u0302)\u00B2</div>'
            + '<div><strong>I\u00B2:</strong> I\u00B2 = max(0, (Q \u2212 (k\u22121))/Q \u00D7 100%)</div>'
            + '<div><strong>HKSJ:</strong> Uses t<sub>k\u22121</sub> with adjusted variance q* = \u03A3w*\u1D62(\u03B8\u1D62 \u2212 \u03B8\u0302*)\u00B2/(k\u22121)</div>'
            + '<div><strong>Subgroup Q-between:</strong> Q<sub>between</sub> = Q<sub>overall</sub> - \u03A3 Q<sub>within</sub></div>'
            + '<div><strong>Begg rank correlation:</strong> Kendall \u03C4 between effect and SE</div>'
            + '</div>';

        html += '<div class="card-subtitle" style="font-weight:600;">Assumptions</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>Studies are independent</li>'
            + '<li>Fixed-effect: all studies share a common true effect</li>'
            + '<li>Random-effects: true effects follow a normal distribution across studies</li>'
            + '<li>Within-study variances are known (estimated with sufficient precision)</li>'
            + '<li>No systematic publication bias (testable via funnel plot + Egger\'s)</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Subgroup Analysis Considerations</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>Pre-specify subgroups to avoid data dredging</li>'
            + '<li>Use interaction test (Q-between), NOT comparing p-values of subgroups</li>'
            + '<li>Expect reduced power within subgroups</li>'
            + '<li>Report all planned subgroup analyses regardless of result</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Common Pitfalls</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Publication bias:</strong> Small positive studies are more likely to be published</li>'
            + '<li><strong>Garbage in, garbage out:</strong> Meta-analysis cannot fix poor-quality primary studies</li>'
            + '<li><strong>\u03C4\u00B2 underestimation:</strong> DL estimator can underestimate heterogeneity; consider REML or PM</li>'
            + '<li><strong>I\u00B2 misinterpretation:</strong> I\u00B2 measures proportion of variability due to heterogeneity, not the magnitude</li>'
            + '<li><strong>Few studies + HKSJ:</strong> HKSJ is preferred when k < 10 but can be conservative</li>'
            + '<li><strong>Ecological fallacy in meta-regression:</strong> Study-level moderators do not imply individual-level associations</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;">'
            + '<li>Borenstein M, et al. <em>Introduction to Meta-Analysis</em>. 2nd ed. Wiley; 2021.</li>'
            + '<li>Higgins JPT, et al. <em>Cochrane Handbook for Systematic Reviews of Interventions</em>. v6.4; 2023.</li>'
            + '<li>IntHout J, et al. The Hartung-Knapp-Sidik-Jonkman method. <em>BMC Med Res Methodol</em>. 2014;14:25.</li>'
            + '<li>Begg CB, Mazumdar M. Operating characteristics of a rank correlation test for publication bias. <em>Biometrics</em>. 1994;50:1088-101.</li>'
            + '<li>Guyatt GH, et al. GRADE guidelines. <em>J Clin Epidemiol</em>. 2011;64:383-94.</li>'
            + '</ul>';
        html += '</div></div>';

        App.setTrustedHTML(container, html);
        renderDataTable();
    }

    // ============================================================
    // TAB SWITCHING
    // ============================================================
    function switchTab(tabId) {
        activeTab = tabId;
        document.querySelectorAll('#ma-tabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tabId); });
        document.querySelectorAll('#ma-tabs ~ .tab-content').forEach(function(tc) { tc.classList.toggle('active', tc.id === 'tab-' + tabId); });
    }

    // ============================================================
    // DATA TABLE
    // ============================================================
    function renderDataTable() {
        var el = document.getElementById('ma-data-table');
        if (!el) return;
        var html = '';

        if (inputMode === 'effect') {
            html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr>'
                + '<th>#</th><th>Study Name</th>'
                + '<th>Effect (log scale) ' + App.tooltip('For OR, RR, HR: enter the natural log. For MD, SMD, RD: enter raw value.') + '</th>'
                + '<th>SE</th>'
                + '<th>95% CI Lower</th><th>95% CI Upper</th>'
                + '<th>Subgroup</th>'
                + '<th></th></tr></thead><tbody>';
            studyData.forEach(function(s, i) {
                html += '<tr>'
                    + '<td>' + (i + 1) + '</td>'
                    + '<td><input type="text" class="form-input form-input--small" value="' + escAttr(s.name) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'name\',this.value)"></td>'
                    + '<td><input type="number" class="form-input form-input--small" step="any" value="' + nvl(s.logEffect) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'logEffect\',this.value)"></td>'
                    + '<td><input type="number" class="form-input form-input--small" step="any" value="' + nvl(s.se) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'se\',this.value)"></td>'
                    + '<td><input type="number" class="form-input form-input--small" step="any" value="' + nvl(s.ciLower) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'ciLower\',this.value)"></td>'
                    + '<td><input type="number" class="form-input form-input--small" step="any" value="' + nvl(s.ciUpper) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'ciUpper\',this.value)"></td>'
                    + '<td><input type="text" class="form-input form-input--small" value="' + escAttr(s.subgroup || '') + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'subgroup\',this.value)"></td>'
                    + '<td><button class="btn btn-xs btn-danger" onclick="MetaAnalysisModule.removeRow(' + i + ')">x</button></td>'
                    + '</tr>';
            });
            html += '</tbody></table></div>';
        } else {
            html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr>'
                + '<th>#</th><th>Study Name</th>'
                + '<th>Events (Tx)</th><th>N (Tx)</th>'
                + '<th>Events (Ctrl)</th><th>N (Ctrl)</th>'
                + '<th>Subgroup</th>'
                + '<th></th></tr></thead><tbody>';
            studyData.forEach(function(s, i) {
                html += '<tr>'
                    + '<td>' + (i + 1) + '</td>'
                    + '<td><input type="text" class="form-input form-input--small" value="' + escAttr(s.name) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'name\',this.value)"></td>'
                    + '<td><input type="number" class="form-input form-input--small" step="1" min="0" value="' + nvl(s.e1) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'e1\',this.value)"></td>'
                    + '<td><input type="number" class="form-input form-input--small" step="1" min="1" value="' + nvl(s.n1) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'n1\',this.value)"></td>'
                    + '<td><input type="number" class="form-input form-input--small" step="1" min="0" value="' + nvl(s.e2) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'e2\',this.value)"></td>'
                    + '<td><input type="number" class="form-input form-input--small" step="1" min="1" value="' + nvl(s.n2) + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'n2\',this.value)"></td>'
                    + '<td><input type="text" class="form-input form-input--small" value="' + escAttr(s.subgroup || '') + '" onchange="MetaAnalysisModule.updateField(' + i + ',\'subgroup\',this.value)"></td>'
                    + '<td><button class="btn btn-xs btn-danger" onclick="MetaAnalysisModule.removeRow(' + i + ')">x</button></td>'
                    + '</tr>';
            });
            html += '</tbody></table></div>';
        }

        App.setTrustedHTML(el, html);
    }

    function escAttr(s) { return (s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
    function nvl(v) { return v !== undefined && v !== null && v !== '' ? v : ''; }

    // ============================================================
    // TABLE MANAGEMENT
    // ============================================================
    function addRow() {
        if (inputMode === 'effect') {
            studyData.push({ name: 'Study ' + (studyData.length + 1), logEffect: '', se: '', ciLower: '', ciUpper: '', subgroup: '' });
        } else {
            studyData.push({ name: 'Study ' + (studyData.length + 1), e1: '', n1: '', e2: '', n2: '', subgroup: '' });
        }
        renderDataTable();
    }

    function removeRow(i) {
        studyData.splice(i, 1);
        renderDataTable();
    }

    function updateField(i, field, value) {
        if (field === 'name' || field === 'subgroup') {
            studyData[i][field] = value;
        } else {
            studyData[i][field] = value === '' ? '' : parseFloat(value);
        }
    }

    function switchInputMode(mode) {
        inputMode = mode;
        studyData = [];
        renderDataTable();
    }

    function changeMeasure(m) {
        selectedMeasure = m;
    }

    function toggleHKSJ(checked) {
        useHKSJ = checked;
    }

    // ============================================================
    // LOAD EXAMPLE
    // ============================================================
    function loadExample() {
        selectedMeasure = 'OR';
        var measureSel = document.getElementById('ma-measure');
        if (measureSel) measureSel.value = 'OR';

        if (inputMode === 'effect') {
            studyData = EVT_EXAMPLE.map(function(d) {
                return { name: d.name, logEffect: d.logEffect, se: d.se, ciLower: '', ciUpper: '', subgroup: d.subgroup || '' };
            });
        } else {
            studyData = EVT_BINARY_EXAMPLE.map(function(d) {
                return { name: d.name, e1: d.e1, n1: d.n1, e2: d.e2, n2: d.n2, subgroup: d.subgroup || '' };
            });
        }
        renderDataTable();
        Export.showToast('Loaded 5 EVT thrombectomy trials');
    }

    // ============================================================
    // PASTE FROM CLIPBOARD
    // ============================================================
    function pasteClipboard() {
        navigator.clipboard.readText().then(function(text) {
            parseTSV(text);
        }).catch(function() {
            Export.showToast('Unable to read clipboard. Paste data directly into the table.', 'error');
        });
    }

    function parseTSV(text) {
        var lines = text.trim().split('\n');
        if (lines.length < 1) return;

        // Detect whether first line is a header
        var startIdx = 0;
        var firstCols = lines[0].split('\t');
        if (firstCols.length >= 2 && isNaN(parseFloat(firstCols[1]))) {
            startIdx = 1; // skip header
        }

        studyData = [];
        for (var i = startIdx; i < lines.length; i++) {
            var cols = lines[i].split('\t');
            if (cols.length < 2) continue;

            if (inputMode === 'effect') {
                studyData.push({
                    name: cols[0] || 'Study ' + (studyData.length + 1),
                    logEffect: parseFloat(cols[1]) || 0,
                    se: cols.length > 2 ? parseFloat(cols[2]) || '' : '',
                    ciLower: cols.length > 3 ? parseFloat(cols[3]) || '' : '',
                    ciUpper: cols.length > 4 ? parseFloat(cols[4]) || '' : '',
                    subgroup: cols.length > 5 ? (cols[5] || '').trim() : ''
                });
            } else {
                studyData.push({
                    name: cols[0] || 'Study ' + (studyData.length + 1),
                    e1: parseInt(cols[1]) || 0,
                    n1: parseInt(cols[2]) || 0,
                    e2: parseInt(cols[3]) || 0,
                    n2: parseInt(cols[4]) || 0,
                    subgroup: cols.length > 5 ? (cols[5] || '').trim() : ''
                });
            }
        }
        renderDataTable();
        Export.showToast('Parsed ' + studyData.length + ' studies from clipboard');
    }

    // ============================================================
    // COMPUTE EFFECTS FROM INPUT
    // ============================================================
    function prepareEffects() {
        var effects = [];
        var variances = [];
        var names = [];
        var seArr = [];
        var subgroups = [];
        var isLogScale = (selectedMeasure === 'OR' || selectedMeasure === 'RR' || selectedMeasure === 'HR');

        if (inputMode === 'effect') {
            for (var i = 0; i < studyData.length; i++) {
                var s = studyData[i];
                var eff = parseFloat(s.logEffect);
                if (isNaN(eff)) continue;

                var se = parseFloat(s.se);
                if (isNaN(se) || se <= 0) {
                    var lo = parseFloat(s.ciLower);
                    var hi = parseFloat(s.ciUpper);
                    if (!isNaN(lo) && !isNaN(hi)) {
                        if (isLogScale) {
                            se = (Math.log(hi) - Math.log(lo)) / (2 * 1.96);
                        } else {
                            se = (hi - lo) / (2 * 1.96);
                        }
                    }
                }
                if (isNaN(se) || se <= 0) continue;

                effects.push(eff);
                variances.push(se * se);
                seArr.push(se);
                names.push(s.name || 'Study ' + (i + 1));
                subgroups.push(s.subgroup || '');
            }
        } else {
            for (var j = 0; j < studyData.length; j++) {
                var d = studyData[j];
                var e1 = parseInt(d.e1);
                var n1 = parseInt(d.n1);
                var e2 = parseInt(d.e2);
                var n2 = parseInt(d.n2);
                if (isNaN(e1) || isNaN(n1) || isNaN(e2) || isNaN(n2)) continue;
                if (n1 <= 0 || n2 <= 0) continue;

                var a = e1, b = n1 - e1, c = e2, dv = n2 - e2;
                var cc = 0;
                if (a === 0 || b === 0 || c === 0 || dv === 0) cc = 0.5;

                var eff2, se2;
                if (selectedMeasure === 'OR') {
                    var orVal = ((a + cc) * (dv + cc)) / ((b + cc) * (c + cc));
                    eff2 = Math.log(orVal);
                    se2 = 1 / (a + cc) + 1 / (b + cc) + 1 / (c + cc) + 1 / (dv + cc);
                } else if (selectedMeasure === 'RR') {
                    var rrVal = ((a + cc) / (n1 + 2 * cc)) / ((c + cc) / (n2 + 2 * cc));
                    eff2 = Math.log(rrVal);
                    se2 = 1 / (a + cc) - 1 / (n1 + 2 * cc) + 1 / (c + cc) - 1 / (n2 + 2 * cc);
                } else if (selectedMeasure === 'RD') {
                    eff2 = a / n1 - c / n2;
                    se2 = (a * b) / (n1 * n1 * n1) + (c * dv) / (n2 * n2 * n2);
                } else {
                    var orV2 = ((a + cc) * (dv + cc)) / ((b + cc) * (c + cc));
                    eff2 = Math.log(orV2);
                    se2 = 1 / (a + cc) + 1 / (b + cc) + 1 / (c + cc) + 1 / (dv + cc);
                }

                effects.push(eff2);
                variances.push(se2);
                seArr.push(Math.sqrt(se2));
                names.push(d.name || 'Study ' + (j + 1));
                subgroups.push(d.subgroup || '');
            }
        }

        return { effects: effects, variances: variances, se: seArr, names: names, subgroups: subgroups, isLogScale: isLogScale };
    }

    // ============================================================
    // RUN ANALYSIS
    // ============================================================
    function runAnalysis() {
        var prep = prepareEffects();
        if (prep.effects.length < 2) {
            Export.showToast('Need at least 2 studies with valid data', 'error');
            return;
        }

        var k = prep.effects.length;
        var isLog = prep.isLogScale;

        var fe = Statistics.metaAnalysisFixedEffect(prep.effects, prep.variances);
        var re = Statistics.metaAnalysisRandomEffects(prep.effects, prep.variances, { hksj: useHKSJ });
        var egger = k >= 3 ? Statistics.eggerTest(prep.effects, prep.se) : null;
        var loo = Statistics.leaveOneOut(prep.effects, prep.variances);
        var cum = Statistics.cumulativeMA(prep.effects, prep.variances, prep.names);

        var reWeights = re.weights;

        var forestStudies = prep.names.map(function(name, i) {
            return {
                name: name,
                estimate: prep.effects[i],
                ci: {
                    lower: prep.effects[i] - 1.96 * prep.se[i],
                    upper: prep.effects[i] + 1.96 * prep.se[i]
                },
                weight: reWeights[i]
            };
        });

        var i2val = re.I2 * 100;
        var i2interp = i2val < 25 ? 'low' : (i2val < 50 ? 'moderate' : (i2val < 75 ? 'substantial' : 'considerable'));
        var hetSig = re.pHet < 0.10 ? 'significant' : 'not significant';

        lastResults = {
            fe: fe, re: re, egger: egger, loo: loo, cum: cum,
            prep: prep, forestStudies: forestStudies,
            i2interp: i2interp, hetSig: hetSig
        };

        var resultEl = document.getElementById('ma-results');
        var html = '<div class="result-panel animate-in mt-3">';

        // Summary
        html += '<div class="card-title">Summary Results (' + k + ' studies)</div>';
        html += '<div class="result-grid">';

        var reEst = isLog ? Math.exp(re.pooled).toFixed(3) : re.pooled.toFixed(3);
        var reLo = isLog ? Math.exp(re.ci.lower).toFixed(3) : re.ci.lower.toFixed(3);
        var reHi = isLog ? Math.exp(re.ci.upper).toFixed(3) : re.ci.upper.toFixed(3);
        var feEst = isLog ? Math.exp(fe.pooled).toFixed(3) : fe.pooled.toFixed(3);
        var feLo = isLog ? Math.exp(fe.ci.lower).toFixed(3) : fe.ci.lower.toFixed(3);
        var feHi = isLog ? Math.exp(fe.ci.upper).toFixed(3) : fe.ci.upper.toFixed(3);

        html += '<div class="result-item"><div class="result-item-value">' + reEst + '</div>'
            + '<div class="result-item-label">RE Pooled ' + selectedMeasure + '</div></div>';
        html += '<div class="result-item"><div class="result-item-value">[' + reLo + ', ' + reHi + ']</div>'
            + '<div class="result-item-label">RE 95% CI</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(re.pValue) + '</div>'
            + '<div class="result-item-label">RE p-value</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + feEst + '</div>'
            + '<div class="result-item-label">FE Pooled ' + selectedMeasure + '</div></div>';
        html += '<div class="result-item"><div class="result-item-value">[' + feLo + ', ' + feHi + ']</div>'
            + '<div class="result-item-label">FE 95% CI</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(fe.pValue) + '</div>'
            + '<div class="result-item-label">FE p-value</div></div>';
        html += '</div>';

        // Heterogeneity panel
        html += '<div class="card-title mt-3">Heterogeneity ' + App.tooltip('Measures the degree to which study results differ beyond what is expected by chance alone') + '</div>';
        html += '<div class="result-grid">';
        html += '<div class="result-item"><div class="result-item-value">' + re.Q.toFixed(2) + '</div>'
            + '<div class="result-item-label">Cochran Q (df=' + re.df + ')</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(re.pHet) + '</div>'
            + '<div class="result-item-label">Q p-value</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + i2val.toFixed(1) + '%</div>'
            + '<div class="result-item-label">I' + String.fromCharCode(178) + ' (' + i2interp + ')</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + re.H2.toFixed(2) + '</div>'
            + '<div class="result-item-label">H' + String.fromCharCode(178) + '</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + re.tau2.toFixed(4) + '</div>'
            + '<div class="result-item-label">' + String.fromCharCode(964) + String.fromCharCode(178) + ' (DL)</div></div>';

        if (re.predInterval) {
            var piLo = isLog ? Math.exp(re.predInterval.lower).toFixed(3) : re.predInterval.lower.toFixed(3);
            var piHi = isLog ? Math.exp(re.predInterval.upper).toFixed(3) : re.predInterval.upper.toFixed(3);
            html += '<div class="result-item"><div class="result-item-value">[' + piLo + ', ' + piHi + ']</div>'
                + '<div class="result-item-label">Prediction Interval</div></div>';
        }
        html += '</div>';

        if (useHKSJ) {
            html += '<div class="text-secondary" style="font-size:0.85rem;margin-top:4px;">HKSJ adjustment applied. Uses t-distribution with ' + (k - 1) + ' df.</div>';
        }

        // Forest plot
        html += '<div class="card-title mt-3">Forest Plot</div>';
        html += '<div class="chart-container"><canvas id="ma-forest-canvas"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'ma-forest-canvas\'),\'forest-plot.png\')">Export Forest PNG</button></div>';

        // Funnel plot
        html += '<div class="card-title mt-3">Funnel Plot</div>';
        if (egger) {
            html += '<div class="text-secondary" style="font-size:0.85rem;">Egger\'s test: intercept = ' + egger.intercept.toFixed(3)
                + ', t = ' + egger.t.toFixed(3) + ', p = ' + Statistics.formatPValue(egger.pValue)
                + (egger.pValue < 0.05 ? ' (suggests publication bias)' : ' (no evidence of publication bias)') + '</div>';
        }
        html += '<div class="chart-container"><canvas id="ma-funnel-canvas"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'ma-funnel-canvas\'),\'funnel-plot.png\')">Export Funnel PNG</button></div>';

        // Sensitivity: leave-one-out
        html += '<div class="card-title mt-3">Sensitivity Analysis: Leave-One-Out</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr>'
            + '<th>Excluded Study</th><th>Pooled ' + selectedMeasure + '</th><th>95% CI</th>'
            + '<th>I' + String.fromCharCode(178) + '</th><th>' + String.fromCharCode(964) + String.fromCharCode(178) + '</th></tr></thead><tbody>';
        loo.forEach(function(r) {
            var est = isLog ? Math.exp(r.pooled).toFixed(3) : r.pooled.toFixed(3);
            var lo = isLog ? Math.exp(r.ci.lower).toFixed(3) : r.ci.lower.toFixed(3);
            var hi = isLog ? Math.exp(r.ci.upper).toFixed(3) : r.ci.upper.toFixed(3);
            html += '<tr><td>' + prep.names[r.excluded] + '</td>'
                + '<td class="num">' + est + '</td>'
                + '<td class="num">[' + lo + ', ' + hi + ']</td>'
                + '<td class="num">' + (r.I2 * 100).toFixed(1) + '%</td>'
                + '<td class="num">' + r.tau2.toFixed(4) + '</td></tr>';
        });
        html += '</tbody></table></div>';

        // Cumulative meta-analysis
        html += '<div class="card-title mt-3">Cumulative Meta-Analysis</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr>'
            + '<th># Studies</th><th>Added Study</th><th>Cumulative ' + selectedMeasure + '</th><th>95% CI</th>'
            + '<th>I' + String.fromCharCode(178) + '</th></tr></thead><tbody>';
        cum.forEach(function(r) {
            var est = isLog ? Math.exp(r.pooled).toFixed(3) : r.pooled.toFixed(3);
            var lo = isLog ? Math.exp(r.ci.lower).toFixed(3) : r.ci.lower.toFixed(3);
            var hi = isLog ? Math.exp(r.ci.upper).toFixed(3) : r.ci.upper.toFixed(3);
            html += '<tr><td>' + r.nStudies + '</td>'
                + '<td>' + r.label + '</td>'
                + '<td class="num">' + est + '</td>'
                + '<td class="num">[' + lo + ', ' + hi + ']</td>'
                + '<td class="num">' + (r.I2 * 100).toFixed(1) + '%</td></tr>';
        });
        html += '</tbody></table></div>';

        // Results text
        var resultsText = generateResultsText(prep, fe, re, egger, isLog);
        html += '<div class="card-title mt-3">Results Text for Manuscript</div>';
        html += '<div class="text-output" id="ma-results-text">' + resultsText + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="MetaAnalysisModule.copyAllResults()">Copy All Results</button>'
            + '<button class="btn btn-sm r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.metaAnalysis({nStudies:' + prep.effects.length + ',measure:\'' + (isLog ? 'logOR' : 'SMD') + '\'}), \'Meta-Analysis\')">'
            + '&#129513; Generate R Script</button>'
            + '</div>';

        html += '</div>'; // result-panel

        App.setTrustedHTML(resultEl, html);

        setTimeout(function() { drawForestPlot(forestStudies, re, prep, isLog); }, 50);
        setTimeout(function() { drawFunnelPlot(prep, re, egger); }, 100);
    }

    // ============================================================
    // SUBGROUP ANALYSIS
    // ============================================================
    function runSubgroupAnalysis() {
        var prep = prepareEffects();
        if (prep.effects.length < 2) {
            Export.showToast('Need at least 2 studies with valid data', 'error');
            return;
        }

        var varEl = document.getElementById('ma-subgroup-var');
        subgroupVariable = varEl ? varEl.value : 'Subgroup';

        // Check that we have subgroup data
        var hasSubgroups = prep.subgroups.some(function(s) { return s && s.trim() !== ''; });
        if (!hasSubgroups) {
            Export.showToast('No subgroup labels found. Please fill in the Subgroup column in the data table.', 'error');
            return;
        }

        var groups = prep.subgroups.map(function(s) { return s && s.trim() !== '' ? s.trim() : 'Unspecified'; });
        var subResult = Statistics.subgroupAnalysis(prep.effects, prep.variances, groups);
        var isLog = prep.isLogScale;

        var resultEl = document.getElementById('ma-subgroup-results');
        var html = '<div class="result-panel animate-in mt-3">';

        html += '<div class="card-title">Subgroup Analysis: ' + escAttr(subgroupVariable) + '</div>';

        // Between-group test
        html += '<div class="result-grid">';
        html += '<div class="result-item"><div class="result-item-value">' + subResult.Qbetween.toFixed(2) + '</div>'
            + '<div class="result-item-label">Q-between (df=' + subResult.dfBetween + ')</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(subResult.pBetween) + '</div>'
            + '<div class="result-item-label">p (interaction)</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + subResult.Qwithin.toFixed(2) + '</div>'
            + '<div class="result-item-label">Q-within</div></div>';
        html += '</div>';

        if (subResult.pBetween < 0.10) {
            html += '<div style="background:var(--warning);color:#000;padding:8px 12px;border-radius:6px;font-size:0.85rem;margin-top:8px;">'
                + 'The test for subgroup differences is statistically significant (p ' + Statistics.formatPValue(subResult.pBetween)
                + '), suggesting the effect may differ across subgroups. Interpret with caution if subgroups were not pre-specified.</div>';
        }

        // Subgroup table
        html += '<table class="data-table mt-2"><thead><tr>'
            + '<th>Subgroup</th><th>k</th><th>Pooled ' + selectedMeasure + '</th><th>95% CI</th>'
            + '<th>I' + String.fromCharCode(178) + '</th><th>' + String.fromCharCode(964) + String.fromCharCode(178) + '</th><th>p</th></tr></thead><tbody>';

        var subgroupKeys = Object.keys(subResult.subgroups);
        subgroupKeys.forEach(function(key) {
            var sg = subResult.subgroups[key];
            var nStudies = prep.effects.filter(function(_, i) { return groups[i] === key; }).length;
            var est = isLog ? Math.exp(sg.pooled).toFixed(3) : sg.pooled.toFixed(3);
            var lo = isLog ? Math.exp(sg.ci.lower).toFixed(3) : sg.ci.lower.toFixed(3);
            var hi = isLog ? Math.exp(sg.ci.upper).toFixed(3) : sg.ci.upper.toFixed(3);

            html += '<tr>'
                + '<td><strong>' + escAttr(key) + '</strong></td>'
                + '<td class="num">' + nStudies + '</td>'
                + '<td class="num">' + est + '</td>'
                + '<td class="num">[' + lo + ', ' + hi + ']</td>'
                + '<td class="num">' + (sg.I2 * 100).toFixed(1) + '%</td>'
                + '<td class="num">' + sg.tau2.toFixed(4) + '</td>'
                + '<td class="num">' + Statistics.formatPValue(sg.pValue) + '</td>'
                + '</tr>';
        });

        // Overall
        var overEst = isLog ? Math.exp(subResult.overall.pooled).toFixed(3) : subResult.overall.pooled.toFixed(3);
        var overLo = isLog ? Math.exp(subResult.overall.ci.lower).toFixed(3) : subResult.overall.ci.lower.toFixed(3);
        var overHi = isLog ? Math.exp(subResult.overall.ci.upper).toFixed(3) : subResult.overall.ci.upper.toFixed(3);
        html += '<tr style="border-top:2px solid var(--border);font-weight:600;">'
            + '<td>Overall</td><td class="num">' + prep.effects.length + '</td>'
            + '<td class="num">' + overEst + '</td>'
            + '<td class="num">[' + overLo + ', ' + overHi + ']</td>'
            + '<td class="num">' + (subResult.overall.I2 * 100).toFixed(1) + '%</td>'
            + '<td class="num">' + subResult.overall.tau2.toFixed(4) + '</td>'
            + '<td class="num">' + Statistics.formatPValue(subResult.overall.pValue) + '</td></tr>';
        html += '</tbody></table>';

        // Subgroup forest plots
        html += '<div class="card-title mt-3">Subgroup Forest Plots</div>';
        subgroupKeys.forEach(function(key, ki) {
            html += '<div class="chart-container"><canvas id="ma-subforest-' + ki + '"></canvas></div>';
        });

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="MetaAnalysisModule.copySubgroupResults()">Copy Subgroup Results</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(resultEl, html);

        // Draw subgroup forest plots
        setTimeout(function() {
            subgroupKeys.forEach(function(key, ki) {
                var canvas = document.getElementById('ma-subforest-' + ki);
                if (!canvas) return;
                var idx = [];
                groups.forEach(function(g, i) { if (g === key) idx.push(i); });

                var studies = idx.map(function(i) {
                    return {
                        name: prep.names[i],
                        estimate: prep.effects[i],
                        ci: {
                            lower: prep.effects[i] - 1.96 * prep.se[i],
                            upper: prep.effects[i] + 1.96 * prep.se[i]
                        },
                        weight: 100 / idx.length
                    };
                });

                var sg = subResult.subgroups[key];
                Charts.ForestPlot(canvas, {
                    studies: studies,
                    summary: {
                        estimate: sg.pooled,
                        ci: sg.ci,
                        label: key + ' (' + idx.length + ' studies)'
                    },
                    nullValue: isLog ? 0 : 0,
                    measureLabel: selectedMeasure + (isLog ? ' (log scale)' : ''),
                    logScale: isLog,
                    title: 'Subgroup: ' + key,
                    width: 750
                });
            });
        }, 100);
    }

    function copySubgroupResults() {
        var el = document.getElementById('ma-subgroup-results');
        if (el) Export.copyText(el.textContent);
    }

    // ============================================================
    // PUBLICATION BIAS (enhanced)
    // ============================================================
    function runPublicationBias() {
        var prep = prepareEffects();
        if (prep.effects.length < 3) {
            Export.showToast('Need at least 3 studies for publication bias tests', 'error');
            return;
        }

        var k = prep.effects.length;
        var isLog = prep.isLogScale;
        var re = Statistics.metaAnalysisRandomEffects(prep.effects, prep.variances, { hksj: useHKSJ });
        var egger = Statistics.eggerTest(prep.effects, prep.se);

        // Begg's rank correlation (Kendall's tau)
        var begg = computeBeggTest(prep.effects, prep.se);

        // Trim and fill
        var tf = Statistics.trimAndFill(prep.effects, prep.variances);

        var resultEl = document.getElementById('ma-pubbias-results');
        var html = '<div class="result-panel animate-in mt-3">';

        // Egger's test (enhanced display)
        html += '<div class="card-title">Egger\'s Regression Test</div>';
        html += '<div class="result-grid">';
        html += '<div class="result-item"><div class="result-item-value">' + egger.intercept.toFixed(3) + '</div>'
            + '<div class="result-item-label">Intercept</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + egger.se.toFixed(3) + '</div>'
            + '<div class="result-item-label">SE (intercept)</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + egger.t.toFixed(3) + '</div>'
            + '<div class="result-item-label">t-statistic (df=' + egger.df + ')</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(egger.pValue) + '</div>'
            + '<div class="result-item-label">p-value</div></div>';
        html += '</div>';

        var eggerInterp = egger.pValue < 0.10
            ? '<span style="color:var(--warning);">Statistically significant funnel plot asymmetry detected (p ' + Statistics.formatPValue(egger.pValue) + '), suggesting potential publication bias or small-study effects.</span>'
            : '<span style="color:var(--success);">No statistically significant asymmetry detected (p ' + Statistics.formatPValue(egger.pValue) + ').</span>';
        html += '<div class="text-secondary" style="font-size:0.85rem;margin-top:4px;">' + eggerInterp + '</div>';

        // Begg's test
        html += '<div class="card-title mt-3">Begg\'s Rank Correlation Test ' + App.tooltip('Tests for correlation between effect size and its standard error using Kendall\'s tau. Less powerful than Egger\'s but fewer assumptions.') + '</div>';
        html += '<div class="result-grid">';
        html += '<div class="result-item"><div class="result-item-value">' + begg.tau.toFixed(3) + '</div>'
            + '<div class="result-item-label">Kendall\'s ' + String.fromCharCode(964) + '</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + begg.z.toFixed(3) + '</div>'
            + '<div class="result-item-label">z-statistic</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(begg.pValue) + '</div>'
            + '<div class="result-item-label">p-value (2-sided)</div></div>';
        html += '</div>';

        var beggInterp = begg.pValue < 0.10
            ? '<span style="color:var(--warning);">Significant rank correlation detected, consistent with publication bias.</span>'
            : '<span style="color:var(--success);">No significant rank correlation detected.</span>';
        html += '<div class="text-secondary" style="font-size:0.85rem;margin-top:4px;">' + beggInterp
            + ' Note: Begg\'s test has low power when k &lt; 25.</div>';

        // Trim and fill
        html += '<div class="card-title mt-3">Trim-and-Fill Analysis ' + App.tooltip('Estimates the number of missing studies due to publication bias and provides an adjusted pooled estimate.') + '</div>';
        html += '<div class="result-grid">';
        html += '<div class="result-item"><div class="result-item-value">' + tf.k0 + '</div>'
            + '<div class="result-item-label">Imputed Studies</div></div>';

        var origEst = isLog ? Math.exp(tf.original.pooled).toFixed(3) : tf.original.pooled.toFixed(3);
        var adjEst = isLog ? Math.exp(tf.adjusted.pooled).toFixed(3) : tf.adjusted.pooled.toFixed(3);
        var adjLo = isLog ? Math.exp(tf.adjusted.ci.lower).toFixed(3) : tf.adjusted.ci.lower.toFixed(3);
        var adjHi = isLog ? Math.exp(tf.adjusted.ci.upper).toFixed(3) : tf.adjusted.ci.upper.toFixed(3);

        html += '<div class="result-item"><div class="result-item-value">' + origEst + '</div>'
            + '<div class="result-item-label">Original ' + selectedMeasure + '</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + adjEst + '</div>'
            + '<div class="result-item-label">Adjusted ' + selectedMeasure + '</div></div>';
        html += '<div class="result-item"><div class="result-item-value">[' + adjLo + ', ' + adjHi + ']</div>'
            + '<div class="result-item-label">Adjusted 95% CI</div></div>';
        html += '</div>';

        if (tf.k0 > 0) {
            html += '<div class="text-secondary" style="font-size:0.85rem;margin-top:4px;">'
                + 'The trim-and-fill method estimated ' + tf.k0 + ' missing studies on the left side of the funnel plot. '
                + 'The adjusted estimate (' + adjEst + ') should be interpreted as a sensitivity analysis, not a corrected estimate.</div>';
        }

        // Enhanced funnel plot with imputed studies
        html += '<div class="card-title mt-3">Funnel Plot with Trim-and-Fill</div>';
        html += '<div class="chart-container"><canvas id="ma-tf-funnel-canvas"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'ma-tf-funnel-canvas\'),\'funnel-trim-fill.png\')">Export PNG</button></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="MetaAnalysisModule.copyPubBiasResults()">Copy Publication Bias Results</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(resultEl, html);

        // Draw enhanced funnel plot
        setTimeout(function() {
            var canvas = document.getElementById('ma-tf-funnel-canvas');
            if (!canvas) return;

            var imputedEffects = tf.imputedEffects;
            var imputedSE = tf.imputedVariances.map(function(v) { return Math.sqrt(v); });

            Charts.FunnelPlot(canvas, {
                effects: prep.effects,
                se: prep.se,
                pooledEffect: re.pooled,
                eggerLine: { intercept: egger.intercept, slope: egger.slope },
                imputedEffects: imputedEffects.length > 0 ? imputedEffects : null,
                imputedSE: imputedSE.length > 0 ? imputedSE : null,
                title: 'Funnel Plot with Trim-and-Fill (' + tf.k0 + ' imputed)',
                width: 650,
                height: 480
            });
        }, 100);
    }

    // Begg's rank correlation test (Kendall's tau)
    function computeBeggTest(effects, se) {
        var k = effects.length;
        // Compute standardized effects
        var concordant = 0;
        var discordant = 0;

        for (var i = 0; i < k; i++) {
            for (var j = i + 1; j < k; j++) {
                var diffEffect = effects[i] - effects[j];
                var diffSE = se[i] - se[j];
                if (diffEffect * diffSE > 0) concordant++;
                else if (diffEffect * diffSE < 0) discordant++;
            }
        }

        var tau = (concordant - discordant) / (k * (k - 1) / 2);
        var varTau = (2 * (2 * k + 5)) / (9 * k * (k - 1));
        var z = tau / Math.sqrt(varTau);
        var pValue = 2 * (1 - Statistics.normalCDF(Math.abs(z)));

        return { tau: tau, z: z, pValue: pValue, concordant: concordant, discordant: discordant };
    }

    function copyPubBiasResults() {
        var el = document.getElementById('ma-pubbias-results');
        if (el) Export.copyText(el.textContent);
    }

    // ============================================================
    // META-REGRESSION REFERENCE PANEL
    // ============================================================
    function renderMetaRegressionPanel() {
        var html = '';
        html += '<div class="card-subtitle">Meta-Regression: Concept and Implementation Reference</div>';

        html += '<div style="background:var(--bg-secondary);padding:16px;border-radius:8px;margin-bottom:16px;">';
        html += '<div style="font-weight:600;margin-bottom:8px;">What is Meta-Regression?</div>';
        html += '<div style="font-size:0.88rem;line-height:1.7;">'
            + 'Meta-regression extends meta-analysis by modeling how study-level covariates (moderators) explain '
            + 'heterogeneity in treatment effects. It is the meta-analytic analog of regression analysis, where '
            + 'each data point is a study rather than an individual patient.'
            + '<br><br>'
            + '<strong>Key considerations:</strong>'
            + '<ul style="margin:4px 0 0 16px;">'
            + '<li>Requires at least 10 studies per moderator (rule of thumb)</li>'
            + '<li>Results are ecological (study-level) associations -- do not imply individual-level effects</li>'
            + '<li>Pre-specify moderators to avoid data dredging</li>'
            + '<li>Use Knapp-Hartung adjustment for small number of studies</li>'
            + '<li>Report R' + String.fromCharCode(178) + ' (proportion of heterogeneity explained)</li>'
            + '</ul></div>';
        html += '</div>';

        // R code panel
        html += '<div class="card-title mt-2">R Code for Meta-Regression (metafor package)</div>';
        html += '<div style="background:var(--bg-secondary);padding:16px;border-radius:8px;font-family:var(--font-mono);font-size:0.82rem;line-height:1.8;white-space:pre-wrap;">'
            + '# Install if needed\n'
            + '# install.packages("metafor")\n'
            + 'library(metafor)\n\n'
            + '# Prepare data\n'
            + 'dat &lt;- data.frame(\n'
            + '  study = c("Study1", "Study2", "Study3", ...),\n'
            + '  yi    = c(0.47, 0.96, 1.13, ...),  # log-transformed effect\n'
            + '  sei   = c(0.21, 0.25, 0.41, ...),  # standard error\n'
            + '  year  = c(2015, 2015, 2015, ...),   # moderator\n'
            + '  dose  = c(100, 200, 100, ...)        # another moderator\n'
            + ')\n\n'
            + '# Random-effects meta-analysis (baseline)\n'
            + 'res &lt;- rma(yi, sei = sei, data = dat, method = "DL")\n'
            + 'summary(res)\n\n'
            + '# Meta-regression: single moderator\n'
            + 'res.mr &lt;- rma(yi, sei = sei, mods = ~ year, data = dat,\n'
            + '              method = "DL", test = "knha")\n'
            + 'summary(res.mr)\n\n'
            + '# Meta-regression: multiple moderators\n'
            + 'res.mr2 &lt;- rma(yi, sei = sei, mods = ~ year + dose, data = dat,\n'
            + '               method = "DL", test = "knha")\n'
            + 'summary(res.mr2)\n\n'
            + '# Bubble plot\n'
            + 'regplot(res.mr, xlab = "Year", ylab = "Log OR",\n'
            + '        main = "Meta-Regression: Effect by Year")\n\n'
            + '# R-squared (proportion of heterogeneity explained)\n'
            + 'cat("R-squared:", round(res.mr$R2, 1), "%\\n")\n'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="MetaAnalysisModule.copyMetaRegCode()">Copy R Code</button>'
            + '</div>';

        // Stata code
        html += '<div class="card-title mt-3">Stata Code for Meta-Regression</div>';
        html += '<div style="background:var(--bg-secondary);padding:16px;border-radius:8px;font-family:var(--font-mono);font-size:0.82rem;line-height:1.8;white-space:pre-wrap;" id="ma-metareg-stata">'
            + '* Meta-regression in Stata\n'
            + '* Using meta suite (Stata 16+)\n'
            + 'meta set yi sei, studylabel(study)\n'
            + 'meta regress year, random(dl) se(knha)\n\n'
            + '* Or using older metareg command\n'
            + '* ssc install metareg\n'
            + 'metareg yi year, wsse(sei) mm\n'
            + '</div>';

        return html;
    }

    function copyMetaRegCode() {
        var code = '# Meta-regression with metafor\nlibrary(metafor)\n\n'
            + 'dat <- data.frame(\n  study = c("Study1", "Study2", ...),\n'
            + '  yi = c(...),\n  sei = c(...),\n  moderator = c(...)\n)\n\n'
            + 'res.mr <- rma(yi, sei = sei, mods = ~ moderator, data = dat,\n'
            + '              method = "DL", test = "knha")\nsummary(res.mr)\n'
            + 'regplot(res.mr)';
        Export.copyText(code);
    }

    // ============================================================
    // GRADE CERTAINTY ASSESSMENT
    // ============================================================
    function renderGRADEPanel() {
        var html = '';
        html += '<div class="card-subtitle">Rate the certainty of evidence for each outcome using the GRADE framework. Start from High (RCTs) or Low (observational), then rate up/down.</div>';

        html += '<div class="form-group"><label class="form-label">Outcome Name</label>'
            + '<input type="text" class="form-input" id="ma-grade-outcome" placeholder="e.g., Functional independence (mRS 0-2) at 90 days"></div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Number of Studies</label>'
            + '<input type="number" class="form-input" id="ma-grade-nstudies" value="" placeholder="k"></div>'
            + '<div class="form-group"><label class="form-label">Study Design Base</label>'
            + '<select class="form-select" id="ma-grade-base">'
            + '<option value="4">RCTs (Start: High)</option>'
            + '<option value="2">Observational (Start: Low)</option>'
            + '</select></div></div>';

        // Rate down domains
        html += '<div class="card-title mt-2">Rate Down</div>';

        var domains = [
            { id: 'rob', label: 'Risk of Bias', desc: 'Study limitations (randomization, blinding, attrition, selective reporting)' },
            { id: 'inconsistency', label: 'Inconsistency', desc: 'Heterogeneity across studies (I-squared, overlapping CIs)' },
            { id: 'indirectness', label: 'Indirectness', desc: 'Differences in PICO from the question of interest' },
            { id: 'imprecision', label: 'Imprecision', desc: 'Wide CIs, small sample, few events, OIS not met' },
            { id: 'pubbias', label: 'Publication Bias', desc: 'Funnel asymmetry, small-study effects' }
        ];

        domains.forEach(function(d) {
            html += '<div class="checklist-question"><div class="checklist-question-text"><strong>' + d.label + ':</strong> ' + d.desc + '</div>';
            html += '<div class="radio-group">';
            ['No concern', 'Serious (-1)', 'Very serious (-2)'].forEach(function(opt) {
                html += '<label class="radio-pill"><input type="radio" name="ma-grade-' + d.id + '" value="' + opt + '">' + opt + '</label>';
            });
            html += '</div></div>';
        });

        // Rate up domains
        html += '<div class="card-title mt-2">Rate Up (for observational studies)</div>';
        var upDomains = [
            { id: 'large', label: 'Large Effect', desc: 'RR >2 or <0.5 with no plausible confounders' },
            { id: 'dose', label: 'Dose-Response', desc: 'Dose-response gradient observed' },
            { id: 'confounding', label: 'Residual Confounding', desc: 'All residual confounding would reduce observed effect' }
        ];

        upDomains.forEach(function(d) {
            html += '<div class="checklist-question"><div class="checklist-question-text"><strong>' + d.label + ':</strong> ' + d.desc + '</div>';
            html += '<div class="radio-group">';
            ['No', 'Yes (+1)'].forEach(function(opt) {
                html += '<label class="radio-pill"><input type="radio" name="ma-grade-up-' + d.id + '" value="' + opt + '">' + opt + '</label>';
            });
            html += '</div></div>';
        });

        html += '<div class="form-group mt-2"><label class="form-label">Footnotes / Justification</label>'
            + '<textarea class="form-input" id="ma-grade-notes" rows="3" placeholder="Explain rating decisions..."></textarea></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="MetaAnalysisModule.computeGRADE()">Compute GRADE Level</button>'
            + '<button class="btn btn-secondary" onclick="MetaAnalysisModule.addGRADEOutcome()">Add to Summary Table</button>'
            + '</div>';

        html += '<div id="ma-grade-result" class="mt-2"></div>';
        html += '<div id="ma-grade-table" class="mt-2"></div>';

        return html;
    }

    function computeGRADE() {
        var base = parseInt(document.getElementById('ma-grade-base').value);
        var level = base;

        var downDomains = ['rob', 'inconsistency', 'indirectness', 'imprecision', 'pubbias'];
        var downRatings = {};
        downDomains.forEach(function(d) {
            var sel = document.querySelector('input[name="ma-grade-' + d + '"]:checked');
            if (sel) {
                downRatings[d] = sel.value;
                if (sel.value.indexOf('-1') > -1) level -= 1;
                if (sel.value.indexOf('-2') > -1) level -= 2;
            } else {
                downRatings[d] = 'Not rated';
            }
        });

        var upDomains = ['large', 'dose', 'confounding'];
        var upRatings = {};
        upDomains.forEach(function(d) {
            var sel = document.querySelector('input[name="ma-grade-up-' + d + '"]:checked');
            if (sel) {
                upRatings[d] = sel.value;
                if (sel.value.indexOf('+1') > -1) level += 1;
            } else {
                upRatings[d] = 'Not rated';
            }
        });

        level = Math.max(1, Math.min(4, level));
        var labels = ['', 'Very Low', 'Low', 'Moderate', 'High'];
        var colors = ['', 'var(--danger)', 'var(--warning)', 'var(--info)', 'var(--success)'];
        var symbols = ['', '\u2B24\u2B24\u2B24\u2B24', '\u2B24\u2B24\u2B24\u25EF', '\u2B24\u2B24\u25EF\u25EF', '\u2B24\u25EF\u25EF\u25EF'];
        // Use filled/empty circles
        var gradeSymbols = '';
        for (var gi = 0; gi < 4; gi++) {
            gradeSymbols += gi < level ? '\u2B24' : '\u25EF';
        }

        var resultEl = document.getElementById('ma-grade-result');
        var html = '<div class="result-panel animate-in">';
        html += '<div style="text-align:center;font-size:1.5rem;font-weight:700;color:' + colors[level] + ';">'
            + gradeSymbols + '<br>' + labels[level] + '</div>';
        html += '<div class="text-secondary" style="text-align:center;font-size:0.85rem;margin-top:4px;">GRADE Certainty of Evidence</div>';
        html += '</div>';

        App.setTrustedHTML(resultEl, html);

        // Store for table building
        window._lastGradeLevel = level;
        window._lastGradeLabels = labels;
        window._lastGradeDownRatings = downRatings;
        window._lastGradeUpRatings = upRatings;
    }

    function addGRADEOutcome() {
        var outcome = document.getElementById('ma-grade-outcome').value || 'Unnamed outcome';
        var nStudies = document.getElementById('ma-grade-nstudies').value || '?';
        var notes = document.getElementById('ma-grade-notes').value || '';

        if (!window._lastGradeLevel) {
            Export.showToast('Please compute GRADE level first', 'error');
            return;
        }

        var labels = ['', 'Very Low', 'Low', 'Moderate', 'High'];
        gradeOutcomes.push({
            outcome: outcome,
            nStudies: nStudies,
            level: window._lastGradeLevel,
            levelLabel: labels[window._lastGradeLevel],
            downRatings: window._lastGradeDownRatings,
            upRatings: window._lastGradeUpRatings,
            notes: notes
        });

        renderGRADETable();
        Export.showToast('Added GRADE outcome: ' + outcome);
    }

    function renderGRADETable() {
        var el = document.getElementById('ma-grade-table');
        if (!el || gradeOutcomes.length === 0) return;

        var colors = ['', 'var(--danger)', 'var(--warning)', 'var(--info)', 'var(--success)'];

        var html = '<div class="card-title mt-2">Summary of Findings (GRADE)</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr>'
            + '<th>Outcome</th><th>k</th><th>Risk of Bias</th><th>Inconsistency</th>'
            + '<th>Indirectness</th><th>Imprecision</th><th>Pub Bias</th><th>Certainty</th></tr></thead><tbody>';

        gradeOutcomes.forEach(function(g) {
            html += '<tr>'
                + '<td>' + escAttr(g.outcome) + '</td>'
                + '<td class="num">' + g.nStudies + '</td>'
                + '<td>' + formatGradeCell(g.downRatings.rob) + '</td>'
                + '<td>' + formatGradeCell(g.downRatings.inconsistency) + '</td>'
                + '<td>' + formatGradeCell(g.downRatings.indirectness) + '</td>'
                + '<td>' + formatGradeCell(g.downRatings.imprecision) + '</td>'
                + '<td>' + formatGradeCell(g.downRatings.pubbias) + '</td>'
                + '<td style="color:' + colors[g.level] + ';font-weight:600;">' + g.levelLabel + '</td>'
                + '</tr>';
        });
        html += '</tbody></table></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="MetaAnalysisModule.exportGRADETable()">Copy GRADE Table</button>'
            + '</div>';

        App.setTrustedHTML(el, html);
    }

    function formatGradeCell(rating) {
        if (!rating || rating === 'No concern' || rating === 'Not rated') {
            return '<span style="color:var(--success);">No concern</span>';
        }
        if (rating.indexOf('-2') > -1) {
            return '<span style="color:var(--danger);">Very serious</span>';
        }
        if (rating.indexOf('-1') > -1) {
            return '<span style="color:var(--warning);">Serious</span>';
        }
        return rating;
    }

    function exportGRADETable() {
        var text = 'Summary of Findings (GRADE)\n\n';
        text += 'Outcome\tk\tRisk of Bias\tInconsistency\tIndirectness\tImprecision\tPub Bias\tCertainty\n';
        gradeOutcomes.forEach(function(g) {
            text += g.outcome + '\t' + g.nStudies + '\t'
                + g.downRatings.rob + '\t' + g.downRatings.inconsistency + '\t'
                + g.downRatings.indirectness + '\t' + g.downRatings.imprecision + '\t'
                + g.downRatings.pubbias + '\t' + g.levelLabel + '\n';
        });
        Export.copyText(text);
    }

    // ============================================================
    // PRISMA FLOW DIAGRAM
    // ============================================================
    function renderPRISMAPanel() {
        var html = '';
        html += '<div class="card-subtitle">Generate a text-based PRISMA 2020 flow diagram for your systematic review. Enter the numbers at each stage.</div>';

        var fields = [
            { id: 'identified', label: 'Records identified through database searching', placeholder: 'e.g., 1250' },
            { id: 'otherSources', label: 'Additional records from other sources', placeholder: 'e.g., 15' },
            { id: 'duplicates', label: 'Records removed as duplicates', placeholder: 'e.g., 320' },
            { id: 'screened', label: 'Records screened (title/abstract)', placeholder: 'e.g., 945' },
            { id: 'excludedScreen', label: 'Records excluded at screening', placeholder: 'e.g., 870' },
            { id: 'fullText', label: 'Full-text articles assessed for eligibility', placeholder: 'e.g., 75' },
            { id: 'excludedFT', label: 'Full-text articles excluded (with reasons)', placeholder: 'e.g., 55' },
            { id: 'excludedReasons', label: 'Exclusion reasons (comma-separated)', placeholder: 'e.g., Wrong outcome (20), Wrong design (15), Duplicate data (10), Conference abstract only (10)' },
            { id: 'includedQual', label: 'Studies included in qualitative synthesis', placeholder: 'e.g., 20' },
            { id: 'includedQuant', label: 'Studies included in quantitative synthesis (meta-analysis)', placeholder: 'e.g., 15' }
        ];

        html += '<div class="form-row form-row--2">';
        fields.forEach(function(f, i) {
            html += '<div class="form-group"><label class="form-label">' + f.label + '</label>'
                + '<input type="text" class="form-input" id="ma-prisma-' + f.id + '" placeholder="' + f.placeholder + '" value="' + escAttr(prismaNumbers[f.id] || '') + '"></div>';
            if (i % 2 === 1 && i < fields.length - 1) html += '</div><div class="form-row form-row--2">';
        });
        html += '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="MetaAnalysisModule.generatePRISMA()">Generate PRISMA Flow</button>'
            + '</div>';

        html += '<div id="ma-prisma-output" class="mt-2"></div>';

        return html;
    }

    function generatePRISMA() {
        var fields = ['identified', 'otherSources', 'duplicates', 'screened', 'excludedScreen', 'fullText', 'excludedFT', 'excludedReasons', 'includedQual', 'includedQuant'];
        var vals = {};
        fields.forEach(function(f) {
            var el = document.getElementById('ma-prisma-' + f);
            vals[f] = el ? el.value.trim() : '';
            prismaNumbers[f] = vals[f];
        });

        var n = function(v) { return v || 'n'; };

        var diagram = '';
        diagram += '=============================================================\n';
        diagram += '                   PRISMA 2020 Flow Diagram\n';
        diagram += '=============================================================\n\n';

        diagram += '  IDENTIFICATION\n';
        diagram += '  +-------------------------------------------+\n';
        diagram += '  | Records identified through      | Additional records    |\n';
        diagram += '  | database searching               | from other sources   |\n';
        diagram += '  | (n = ' + n(vals.identified) + ')' + spaces(30 - n(vals.identified).length) + '| (n = ' + n(vals.otherSources) + ')' + spaces(16 - n(vals.otherSources).length) + '|\n';
        diagram += '  +-------------------------------------------+\n';
        diagram += '                        |\n';
        diagram += '                        v\n';
        diagram += '  +-------------------------------------------+\n';
        diagram += '  | Records after duplicates removed           |\n';
        diagram += '  | (n = ' + n(vals.duplicates) + ' removed)' + spaces(33 - n(vals.duplicates).length) + '|\n';
        diagram += '  +-------------------------------------------+\n';
        diagram += '                        |\n';
        diagram += '  SCREENING             v\n';
        diagram += '  +-------------------------------------------+     +---------------------------+\n';
        diagram += '  | Records screened                           |     | Records excluded          |\n';
        diagram += '  | (n = ' + n(vals.screened) + ')' + spaces(36 - n(vals.screened).length) + '| --> | (n = ' + n(vals.excludedScreen) + ')' + spaces(18 - n(vals.excludedScreen).length) + '|\n';
        diagram += '  +-------------------------------------------+     +---------------------------+\n';
        diagram += '                        |\n';
        diagram += '  ELIGIBILITY           v\n';
        diagram += '  +-------------------------------------------+     +---------------------------+\n';
        diagram += '  | Full-text articles assessed                |     | Full-text articles        |\n';
        diagram += '  | for eligibility                            |     | excluded, with reasons    |\n';
        diagram += '  | (n = ' + n(vals.fullText) + ')' + spaces(36 - n(vals.fullText).length) + '| --> | (n = ' + n(vals.excludedFT) + ')' + spaces(18 - n(vals.excludedFT).length) + '|\n';

        if (vals.excludedReasons) {
            var reasons = vals.excludedReasons.split(',');
            reasons.forEach(function(r) {
                diagram += '  |                                           |     | - ' + r.trim() + spaces(Math.max(0, 22 - r.trim().length)) + '|\n';
            });
        }

        diagram += '  +-------------------------------------------+     +---------------------------+\n';
        diagram += '                        |\n';
        diagram += '  INCLUDED              v\n';
        diagram += '  +-------------------------------------------+\n';
        diagram += '  | Studies included in qualitative            |\n';
        diagram += '  | synthesis (n = ' + n(vals.includedQual) + ')' + spaces(27 - n(vals.includedQual).length) + '|\n';
        diagram += '  +-------------------------------------------+\n';
        diagram += '                        |\n';
        diagram += '                        v\n';
        diagram += '  +-------------------------------------------+\n';
        diagram += '  | Studies included in quantitative           |\n';
        diagram += '  | synthesis (meta-analysis)                  |\n';
        diagram += '  | (n = ' + n(vals.includedQuant) + ')' + spaces(36 - n(vals.includedQuant).length) + '|\n';
        diagram += '  +-------------------------------------------+\n';

        var outputEl = document.getElementById('ma-prisma-output');
        var html = '<div class="text-output" style="font-family:var(--font-mono);font-size:0.78rem;white-space:pre;overflow-x:auto;line-height:1.5;">'
            + diagram + '</div>';
        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="MetaAnalysisModule.copyPRISMA()">Copy PRISMA Diagram</button>'
            + '</div>';

        App.setTrustedHTML(outputEl, html);
    }

    function spaces(n) {
        if (n < 0) n = 0;
        var s = '';
        for (var i = 0; i < n; i++) s += ' ';
        return s;
    }

    function copyPRISMA() {
        var el = document.getElementById('ma-prisma-output');
        if (el) {
            var pre = el.querySelector('.text-output');
            if (pre) Export.copyText(pre.textContent);
        }
    }

    // ============================================================
    // FOREST PLOT
    // ============================================================
    function drawForestPlot(studies, re, prep, isLog) {
        var canvas = document.getElementById('ma-forest-canvas');
        if (!canvas) return;

        var nullVal = isLog ? 0 : 0;

        Charts.ForestPlot(canvas, {
            studies: studies,
            summary: {
                estimate: re.pooled,
                ci: re.ci,
                label: 'RE Model (DL' + (useHKSJ ? '+HKSJ' : '') + ')'
            },
            predInterval: re.predInterval,
            nullValue: nullVal,
            measureLabel: selectedMeasure + (isLog ? ' (log scale)' : ''),
            logScale: isLog,
            title: 'Forest Plot: ' + selectedMeasure + ' (' + prep.effects.length + ' studies)',
            width: 850
        });
    }

    // ============================================================
    // FUNNEL PLOT
    // ============================================================
    function drawFunnelPlot(prep, re, egger) {
        var canvas = document.getElementById('ma-funnel-canvas');
        if (!canvas) return;

        Charts.FunnelPlot(canvas, {
            effects: prep.effects,
            se: prep.se,
            pooledEffect: re.pooled,
            eggerLine: egger ? { intercept: egger.intercept, slope: egger.slope } : null,
            title: 'Funnel Plot: ' + selectedMeasure,
            width: 600,
            height: 450
        });
    }

    // ============================================================
    // RESULTS TEXT
    // ============================================================
    function generateResultsText(prep, fe, re, egger, isLog) {
        var k = prep.effects.length;
        var reEst = isLog ? Math.exp(re.pooled).toFixed(2) : re.pooled.toFixed(2);
        var reLo = isLog ? Math.exp(re.ci.lower).toFixed(2) : re.ci.lower.toFixed(2);
        var reHi = isLog ? Math.exp(re.ci.upper).toFixed(2) : re.ci.upper.toFixed(2);
        var feEst = isLog ? Math.exp(fe.pooled).toFixed(2) : fe.pooled.toFixed(2);
        var i2val = (re.I2 * 100).toFixed(1);
        var i2interp = re.I2 * 100 < 25 ? 'low' : (re.I2 * 100 < 50 ? 'moderate' : (re.I2 * 100 < 75 ? 'substantial' : 'considerable'));

        var text = 'A ' + (useHKSJ ? 'DerSimonian-Laird random-effects meta-analysis with Hartung-Knapp-Sidik-Jonkman adjustment' : 'DerSimonian-Laird random-effects meta-analysis')
            + ' of ' + k + ' studies was performed. '
            + 'The pooled ' + selectedMeasure + ' was ' + reEst
            + ' (95% CI, ' + reLo + ' to ' + reHi + '; P ' + Statistics.formatPValue(re.pValue) + '). '
            + 'The fixed-effect estimate was ' + feEst + ' (P ' + Statistics.formatPValue(fe.pValue) + '). '
            + 'Statistical heterogeneity was ' + i2interp
            + ' (I' + String.fromCharCode(178) + ' = ' + i2val + '%; '
            + 'Cochran Q = ' + re.Q.toFixed(2) + ', df = ' + re.df + ', P ' + Statistics.formatPValue(re.pHet) + '; '
            + String.fromCharCode(964) + String.fromCharCode(178) + ' = ' + re.tau2.toFixed(4) + '). ';

        if (re.predInterval) {
            var piLo = isLog ? Math.exp(re.predInterval.lower).toFixed(2) : re.predInterval.lower.toFixed(2);
            var piHi = isLog ? Math.exp(re.predInterval.upper).toFixed(2) : re.predInterval.upper.toFixed(2);
            text += 'The 95% prediction interval was ' + piLo + ' to ' + piHi + '. ';
        }

        if (egger) {
            text += 'Egger\'s regression test for funnel plot asymmetry '
                + (egger.pValue < 0.05 ? 'was statistically significant' : 'did not suggest publication bias')
                + ' (intercept = ' + egger.intercept.toFixed(2)
                + ', P ' + Statistics.formatPValue(egger.pValue) + '). ';
        }

        return text;
    }

    // ============================================================
    // COPY ALL RESULTS
    // ============================================================
    function copyAllResults() {
        var textEl = document.getElementById('ma-results-text');
        if (textEl) {
            Export.copyText(textEl.textContent);
        }
    }

    // ============================================================
    // REGISTER MODULE
    // ============================================================
    App.registerModule(MODULE_ID, {
        render: render,
        onThemeChange: function() {
            if (lastResults) {
                setTimeout(function() {
                    drawForestPlot(lastResults.forestStudies, lastResults.re, lastResults.prep, lastResults.prep.isLogScale);
                    drawFunnelPlot(lastResults.prep, lastResults.re, lastResults.egger);
                }, 50);
            }
        }
    });

    window.MetaAnalysisModule = {
        switchTab: switchTab,
        switchInputMode: switchInputMode,
        changeMeasure: changeMeasure,
        toggleHKSJ: toggleHKSJ,
        addRow: addRow,
        removeRow: removeRow,
        updateField: updateField,
        loadExample: loadExample,
        pasteClipboard: pasteClipboard,
        runAnalysis: runAnalysis,
        copyAllResults: copyAllResults,
        runSubgroupAnalysis: runSubgroupAnalysis,
        copySubgroupResults: copySubgroupResults,
        runPublicationBias: runPublicationBias,
        copyPubBiasResults: copyPubBiasResults,
        copyMetaRegCode: copyMetaRegCode,
        computeGRADE: computeGRADE,
        addGRADEOutcome: addGRADEOutcome,
        exportGRADETable: exportGRADETable,
        generatePRISMA: generatePRISMA,
        copyPRISMA: copyPRISMA
    };
})();
