/**
 * Neuro-Epi — Power Analysis Module
 * Reverse of sample size: input N -> compute achieved power
 * Interactive power dashboard with real-time sliders
 * Multi-scenario comparison, MDE solver, power curve visualization
 */

(function() {
    'use strict';

    var MODULE_ID = 'power-analysis';

    /* ============================================================
     * Render
     * ============================================================ */

    function render(container) {
        var html = App.createModuleLayout(
            'Power Analysis',
            'Calculate achieved power for a given sample size, or explore how power changes across multiple scenarios interactively.'
        );

        // ===== SECTION 1: Power Calculation =====
        html += '<div class="card">';
        html += '<div class="card-title">Calculate Achieved Power</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Outcome Type</label>'
            + '<select class="form-select" id="pa-design" onchange="PowerModule.updateDesign()">'
            + '<option value="proportions">Two Proportions</option>'
            + '<option value="means">Two Means</option>'
            + '<option value="survival">Time-to-Event (HR)</option>'
            + '</select></div>'
            + '</div>';

        // Proportions inputs
        html += '<div id="pa-inputs-proportions">';
        html += '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Control Rate (p\u2081)</label>'
            + '<input type="number" class="form-input" id="pa-p1" step="0.01" min="0.001" max="0.999" value="0.28"></div>'
            + '<div class="form-group"><label class="form-label">Treatment Rate (p\u2082)</label>'
            + '<input type="number" class="form-input" id="pa-p2" step="0.01" min="0.001" max="0.999" value="0.20"></div>'
            + '<div class="form-group"><label class="form-label">N per group</label>'
            + '<input type="number" class="form-input" id="pa-n" step="10" min="5" value="500"></div>'
            + '<div class="form-group"><label class="form-label">\u03B1</label>'
            + '<select class="form-select" id="pa-alpha"><option value="0.05" selected>0.05</option><option value="0.01">0.01</option><option value="0.10">0.10</option></select></div>'
            + '</div>';
        html += '</div>';

        // Means inputs
        html += '<div id="pa-inputs-means" class="hidden">';
        html += '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Mean Difference</label>'
            + '<input type="number" class="form-input" id="pa-delta" step="0.5" value="4"></div>'
            + '<div class="form-group"><label class="form-label">Common SD</label>'
            + '<input type="number" class="form-input" id="pa-sd" step="0.5" min="0.1" value="8"></div>'
            + '<div class="form-group"><label class="form-label">N per group</label>'
            + '<input type="number" class="form-input" id="pa-n-means" step="10" min="5" value="200"></div>'
            + '<div class="form-group"><label class="form-label">\u03B1</label>'
            + '<input type="number" class="form-input" id="pa-alpha-means" step="0.01" min="0.001" max="0.20" value="0.05"></div>'
            + '</div>';
        html += '</div>';

        // Survival inputs
        html += '<div id="pa-inputs-survival" class="hidden">';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Hazard Ratio</label>'
            + '<input type="number" class="form-input" id="pa-hr" step="0.05" min="0.01" value="0.70"></div>'
            + '<div class="form-group"><label class="form-label">Number of Events</label>'
            + '<input type="number" class="form-input" id="pa-events" step="10" min="5" value="200"></div>'
            + '<div class="form-group"><label class="form-label">\u03B1</label>'
            + '<input type="number" class="form-input" id="pa-alpha-surv" step="0.01" min="0.001" max="0.20" value="0.05"></div>'
            + '</div>';
        html += '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="PowerModule.calculate()">Calculate Power</button>'
            + '</div>';

        html += '<div id="pa-results"></div>';
        html += '</div>';

        // ===== SECTION 2: Interactive Dashboard =====
        html += '<div class="card">';
        html += '<div class="card-title">Interactive Power Dashboard</div>';
        html += '<div class="card-subtitle">Drag sliders to see power change in real-time</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Base Control Rate (p\u2081): <span id="pa-slider-p1-val">0.28</span></label>'
            + '<input type="range" id="pa-slider-p1" min="0.05" max="0.80" step="0.01" value="0.28" style="width:100%" oninput="PowerModule.updateDashboard()"></div>'
            + '<div class="form-group"><label class="form-label">Effect Size (ARR): <span id="pa-slider-eff-val">0.08</span></label>'
            + '<input type="range" id="pa-slider-eff" min="0.01" max="0.20" step="0.005" value="0.08" style="width:100%" oninput="PowerModule.updateDashboard()"></div>'
            + '</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Total N: <span id="pa-slider-n-val">500</span></label>'
            + '<input type="range" id="pa-slider-n" min="50" max="5000" step="10" value="500" style="width:100%" oninput="PowerModule.updateDashboard()"></div>'
            + '<div class="form-group"><label class="form-label">\u03B1: <span id="pa-slider-alpha-val">0.05</span></label>'
            + '<input type="range" id="pa-slider-alpha" min="0.01" max="0.10" step="0.005" value="0.05" style="width:100%" oninput="PowerModule.updateDashboard()"></div>'
            + '</div>';

        html += '<div class="result-panel" id="pa-dashboard-result">'
            + '<div class="result-value" id="pa-dashboard-power">--</div>'
            + '<div class="result-label">Achieved Power</div>'
            + '<div class="result-detail" id="pa-dashboard-detail"></div></div>';

        html += '<div class="chart-container"><canvas id="pa-dashboard-chart" width="700" height="350"></canvas></div>';
        html += '<div class="chart-actions"><button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'pa-dashboard-chart\'),\'power-dashboard.png\')">Export PNG</button></div>';
        html += '</div>';

        // ===== SECTION 3: Minimum Detectable Effect Size =====
        html += '<div class="card">';
        html += '<div class="card-title">Minimum Detectable Effect Size</div>';
        html += '<div class="card-subtitle">Given your sample size, alpha, and desired power, what is the smallest effect you can detect?</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Design</label>'
            + '<select class="form-select" id="pa-mde-design" onchange="PowerModule.updateMDEDesign()">'
            + '<option value="proportions">Two Proportions</option>'
            + '<option value="means">Two Means</option>'
            + '<option value="survival">Time-to-Event</option>'
            + '</select></div>'
            + '</div>';

        // MDE Proportions inputs
        html += '<div id="pa-mde-proportions">';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Control Rate (p\u2081)</label>'
            + '<input type="number" class="form-input" id="pa-mde-p1" step="0.01" min="0.01" max="0.99" value="0.28"></div>'
            + '<div class="form-group"><label class="form-label">N per Group</label>'
            + '<input type="number" class="form-input" id="pa-mde-n" step="10" min="10" value="300"></div>'
            + '<div class="form-group"><label class="form-label">\u03B1</label>'
            + '<select class="form-select" id="pa-mde-alpha"><option value="0.05" selected>0.05</option><option value="0.01">0.01</option></select></div>'
            + '</div>';
        html += '</div>';

        // MDE Means inputs
        html += '<div id="pa-mde-means" class="hidden">';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Common SD</label>'
            + '<input type="number" class="form-input" id="pa-mde-sd" step="0.5" min="0.1" value="8"></div>'
            + '<div class="form-group"><label class="form-label">N per Group</label>'
            + '<input type="number" class="form-input" id="pa-mde-n-means" step="10" min="10" value="200"></div>'
            + '<div class="form-group"><label class="form-label">\u03B1</label>'
            + '<select class="form-select" id="pa-mde-alpha-means"><option value="0.05" selected>0.05</option><option value="0.01">0.01</option></select></div>'
            + '</div>';
        html += '</div>';

        // MDE Survival inputs
        html += '<div id="pa-mde-survival" class="hidden">';
        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Number of Events</label>'
            + '<input type="number" class="form-input" id="pa-mde-events" step="10" min="10" value="200"></div>'
            + '<div class="form-group"><label class="form-label">\u03B1</label>'
            + '<select class="form-select" id="pa-mde-alpha-surv"><option value="0.05" selected>0.05</option><option value="0.01">0.01</option></select></div>'
            + '</div>';
        html += '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="PowerModule.calculateMDE()">Calculate MDE</button>'
            + '</div>';

        html += '<div id="pa-mde-results"></div>';
        html += '</div>';

        // ===== SECTION 4: Multi-scenario comparison =====
        html += '<div class="card">';
        html += '<div class="card-title">Multi-Scenario Comparison</div>';
        html += '<div class="card-subtitle">Define up to 6 scenarios and compare power side-by-side</div>';
        html += '<div id="pa-scenarios">';

        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Scenario</th><th>p\u2081</th><th>p\u2082</th><th>N/Group</th><th>\u03B1</th><th>Power</th></tr></thead><tbody>';
        for (var i = 1; i <= 6; i++) {
            html += '<tr>'
                + '<td>Scenario ' + i + '</td>'
                + '<td><input type="number" class="form-input form-input--small" id="pa-sc' + i + '-p1" step="0.01" value="0.28" style="width:70px"></td>'
                + '<td><input type="number" class="form-input form-input--small" id="pa-sc' + i + '-p2" step="0.01" value="' + +(0.28 - 0.02 * i).toFixed(2) + '" style="width:70px"></td>'
                + '<td><input type="number" class="form-input form-input--small" id="pa-sc' + i + '-n" step="10" value="' + (200 + i * 100) + '" style="width:80px"></td>'
                + '<td><select class="form-select" id="pa-sc' + i + '-alpha" style="width:70px"><option value="0.05" selected>0.05</option><option value="0.01">0.01</option></select></td>'
                + '<td style="font-family:var(--font-mono);color:var(--accent);font-weight:600" id="pa-sc' + i + '-power">--</td>'
                + '</tr>';
        }
        html += '</tbody></table></div>';

        html += '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="PowerModule.compareScenarios()">Compare All</button></div>';
        html += '<div class="chart-container"><canvas id="pa-scenario-chart" width="700" height="350"></canvas></div>';
        html += '<div class="chart-actions"><button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'pa-scenario-chart\'),\'multi-scenario.png\')">Export PNG</button></div>';
        html += '</div>';

        // ===== SECTION 5: Methods Text =====
        html += '<div class="card">';
        html += '<div class="card-title">Generate Methods Text</div>';
        html += '<div id="pa-methods-text" class="text-output" style="min-height:40px;">Click "Calculate Power" above first, then generate methods text.</div>';
        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="PowerModule.generateMethods()">Generate Methods Text</button>'
            + '<button class="btn btn-secondary" onclick="PowerModule.copyMethods()">Copy</button></div>';
        html += '</div>';

        // ===== LEARN SECTION =====
        html += '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Learn: Power Analysis Essentials</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';

        html += '<div class="card-subtitle" style="font-weight:600;">Key Formulas</div>';
        html += '<div style="background:var(--bg-secondary);padding:12px;border-radius:8px;font-family:var(--font-mono);margin-bottom:12px;">'
            + '<div><strong>Two Proportions:</strong> Power = \u03A6(|p\u2081 \u2212 p\u2082|\u00B7\u221A(n / (p\u0304q\u0304\u00B72)) \u2212 z<sub>\u03B1/2</sub>)</div>'
            + '<div><strong>Two Means:</strong> Power = \u03A6(\u03B4\u00B7\u221An / (\u03C3\u221A2) \u2212 z<sub>\u03B1/2</sub>)</div>'
            + '<div><strong>Survival (HR):</strong> Power = \u03A6(\u221AD\u00B7|ln(HR)|/2 \u2212 z<sub>\u03B1/2</sub>)</div>'
            + '<div><strong>MDE (means):</strong> \u03B4<sub>min</sub> = (z<sub>\u03B1/2</sub> + z<sub>\u03B2</sub>)\u00B7\u03C3\u00B7\u221A(2/n)</div>'
            + '</div>';

        html += '<div class="card-subtitle" style="font-weight:600;">Interpreting Power</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Power >= 80%:</strong> Generally adequate. Standard threshold for clinical trials.</li>'
            + '<li><strong>Power 60-79%:</strong> Marginal. May miss real effects. Consider increasing N.</li>'
            + '<li><strong>Power < 60%:</strong> Underpowered. High risk of Type II error.</li>'
            + '<li><strong>Post-hoc power:</strong> Do NOT compute power using the observed effect size -- this is circular and misleading.</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Minimum Detectable Effect Size</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>MDE answers: "Given my N, what is the smallest effect I can reliably detect?"</li>'
            + '<li>More useful than post-hoc power for interpreting completed studies</li>'
            + '<li>Report MDE in grant applications alongside sample size calculations</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Common Pitfalls</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Overly optimistic effect sizes:</strong> Post-hoc power using the observed effect is misleading</li>'
            + '<li><strong>Ignoring attrition:</strong> Inflate N by 10\u201320% to account for dropout</li>'
            + '<li><strong>Multiple comparisons:</strong> Adjust \u03B1 (e.g., Bonferroni) when testing multiple outcomes</li>'
            + '<li><strong>Non-compliance:</strong> ITT analysis dilutes treatment effect, reducing effective power</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;">'
            + '<li>Chow SC, Shao J, Wang H. <em>Sample Size Calculations in Clinical Research</em>. 3rd ed. Chapman & Hall; 2017.</li>'
            + '<li>Julious SA. <em>Sample Sizes for Clinical Trials</em>. Chapman & Hall; 2009.</li>'
            + '<li>Hoenig JM, Heisey DM. The abuse of power: the pervasive fallacy of power calculations for data analysis. <em>Am Stat</em>. 2001;55(1):19-24.</li>'
            + '</ul>';
        html += '</div></div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    /* ============================================================
     * Design toggling
     * ============================================================ */

    function updateDesign() {
        var design = document.getElementById('pa-design').value;
        document.getElementById('pa-inputs-proportions').classList.toggle('hidden', design !== 'proportions');
        document.getElementById('pa-inputs-means').classList.toggle('hidden', design !== 'means');
        document.getElementById('pa-inputs-survival').classList.toggle('hidden', design !== 'survival');
    }

    function updateMDEDesign() {
        var design = document.getElementById('pa-mde-design').value;
        document.getElementById('pa-mde-proportions').classList.toggle('hidden', design !== 'proportions');
        document.getElementById('pa-mde-means').classList.toggle('hidden', design !== 'means');
        document.getElementById('pa-mde-survival').classList.toggle('hidden', design !== 'survival');
    }

    /* ============================================================
     * Power calculation
     * ============================================================ */

    function calculate() {
        var design = document.getElementById('pa-design').value;
        var power, details, params;

        if (design === 'proportions') {
            var p1 = parseFloat(document.getElementById('pa-p1').value);
            var p2 = parseFloat(document.getElementById('pa-p2').value);
            var n = parseInt(document.getElementById('pa-n').value);
            var alpha = parseFloat(document.getElementById('pa-alpha').value);
            if (isNaN(p1) || isNaN(p2) || isNaN(n) || p1 <= 0 || p1 >= 1 || p2 <= 0 || p2 >= 1 || n < 5) {
                Export.showToast('Please check input values', 'error');
                return;
            }
            power = Statistics.powerTwoProportions(p1, p2, n, alpha);
            details = 'p\u2081=' + p1 + ', p\u2082=' + p2 + ', N/group=' + n + ', \u03B1=' + alpha;
            params = { design: design, p1: p1, p2: p2, n: n, alpha: alpha };
        } else if (design === 'means') {
            var delta = parseFloat(document.getElementById('pa-delta').value);
            var sd = parseFloat(document.getElementById('pa-sd').value);
            var nM = parseInt(document.getElementById('pa-n-means').value);
            var alphaM = parseFloat(document.getElementById('pa-alpha-means').value);
            if (isNaN(delta) || isNaN(sd) || isNaN(nM) || sd <= 0 || nM < 5) {
                Export.showToast('Please check input values', 'error');
                return;
            }
            power = Statistics.powerTwoMeans(delta, sd, nM, alphaM);
            details = '\u03B4=' + delta + ', SD=' + sd + ', N/group=' + nM + ', \u03B1=' + alphaM;
            params = { design: design, delta: delta, sd: sd, n: nM, alpha: alphaM };
        } else {
            var hr = parseFloat(document.getElementById('pa-hr').value);
            var events = parseInt(document.getElementById('pa-events').value);
            var alphaS = parseFloat(document.getElementById('pa-alpha-surv').value);
            if (isNaN(hr) || isNaN(events) || hr <= 0 || events < 5) {
                Export.showToast('Please check input values', 'error');
                return;
            }
            power = Statistics.powerSurvival(hr, events, alphaS);
            details = 'HR=' + hr + ', Events=' + events + ', \u03B1=' + alphaS;
            params = { design: design, hr: hr, events: events, alpha: alphaS };
        }

        var pct = (power * 100).toFixed(1);
        var color = power >= 0.80 ? 'var(--success)' : power >= 0.60 ? 'var(--warning)' : 'var(--danger)';

        var html = '<div class="result-panel animate-in">'
            + '<div class="result-value" style="color:' + color + '">' + pct + '%</div>'
            + '<div class="result-label">Achieved Power</div>'
            + '<div class="result-detail">' + details + '</div>'
            + '<div class="result-detail mt-1" style="font-size:0.85rem">'
            + (power >= 0.80 ? 'Adequate power (\u226580%). This study is well-powered to detect the specified effect.'
                : power >= 0.60 ? 'Marginal power (60-79%). Consider increasing sample size for more reliable detection.'
                : 'Underpowered (<60%). High risk of Type II error. Strongly consider increasing sample size.')
            + '</div>';

        // Power curve alongside
        html += '<div class="chart-container"><canvas id="pa-result-curve" width="700" height="350"></canvas></div>';
        html += '<div class="chart-actions"><button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'pa-result-curve\'),\'power-curve.png\')">Export PNG</button></div>';

        // R Script button
        html += '<button class="btn btn-sm r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.powerAnalysis(' + JSON.stringify(params) + '), \'Power Analysis\')">'
            + '&#129513; Generate R Script</button>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('pa-results'), html);

        // Store params for methods text
        window._paLastCalc = { design: design, power: power, params: params };

        // Draw power curve
        setTimeout(function() {
            var canvas = document.getElementById('pa-result-curve');
            if (!canvas) return;
            var points = [];
            var currentN, xLabel;

            if (design === 'proportions') {
                currentN = params.n * 2;
                var maxX = Math.max(currentN * 2.5, 200);
                for (var nn = 10; nn <= maxX; nn += Math.max(1, Math.floor(maxX / 100))) {
                    var pw = Statistics.powerTwoProportions(params.p1, params.p2, Math.floor(nn / 2), params.alpha);
                    points.push({ x: nn, y: pw });
                }
                xLabel = 'Total Sample Size';
            } else if (design === 'means') {
                currentN = params.n * 2;
                var maxXM = Math.max(currentN * 2.5, 200);
                for (var nm = 10; nm <= maxXM; nm += Math.max(1, Math.floor(maxXM / 100))) {
                    var pwm = Statistics.powerTwoMeans(params.delta, params.sd, Math.floor(nm / 2), params.alpha);
                    points.push({ x: nm, y: pwm });
                }
                xLabel = 'Total Sample Size';
            } else {
                currentN = params.events;
                var maxXS = Math.max(currentN * 2.5, 100);
                for (var ne = 10; ne <= maxXS; ne += Math.max(1, Math.floor(maxXS / 100))) {
                    var pws = Statistics.powerSurvival(params.hr, ne, params.alpha);
                    points.push({ x: ne, y: pws });
                }
                xLabel = 'Number of Events';
            }

            Charts.LineChart(canvas, {
                data: [{ label: 'Power', points: points }],
                xLabel: xLabel, yLabel: 'Power',
                title: 'Power Curve (current N highlighted)',
                yMin: 0, yMax: 1,
                width: 700, height: 350
            });
        }, 100);

        Export.addToHistory(MODULE_ID, params, pct + '% power');
    }

    /* ============================================================
     * Interactive Dashboard
     * ============================================================ */

    var _dashboardTimer = null;

    function updateDashboard() {
        // Debounce for smooth slider interaction
        if (_dashboardTimer) clearTimeout(_dashboardTimer);
        _dashboardTimer = setTimeout(_doDashboardUpdate, 30);
    }

    function _doDashboardUpdate() {
        var p1 = parseFloat(document.getElementById('pa-slider-p1').value);
        var eff = parseFloat(document.getElementById('pa-slider-eff').value);
        var totalN = parseInt(document.getElementById('pa-slider-n').value);
        var alpha = parseFloat(document.getElementById('pa-slider-alpha').value);

        document.getElementById('pa-slider-p1-val').textContent = p1.toFixed(2);
        document.getElementById('pa-slider-eff-val').textContent = eff.toFixed(3);
        document.getElementById('pa-slider-n-val').textContent = totalN;
        document.getElementById('pa-slider-alpha-val').textContent = alpha.toFixed(3);

        var p2 = Math.max(0.001, p1 - eff);
        var nPerGroup = Math.floor(totalN / 2);
        var power = Statistics.powerTwoProportions(p1, p2, nPerGroup, alpha);
        var pct = (power * 100).toFixed(1);
        var color = power >= 0.80 ? 'var(--success)' : power >= 0.60 ? 'var(--warning)' : 'var(--danger)';

        var el = document.getElementById('pa-dashboard-power');
        if (el) {
            el.textContent = pct + '%';
            el.style.color = color;
        }

        var detailEl = document.getElementById('pa-dashboard-detail');
        if (detailEl) {
            detailEl.textContent = 'p\u2081=' + p1.toFixed(2) + ', p\u2082=' + p2.toFixed(3) + ', ARR=' + (eff * 100).toFixed(1) + '%, N=' + totalN + ', \u03B1=' + alpha.toFixed(3);
        }

        // Draw power curve
        var canvas = document.getElementById('pa-dashboard-chart');
        if (!canvas) return;
        var points = [];
        var maxN = Math.max(totalN * 2, 500);
        for (var n = 20; n <= maxN; n += Math.max(1, Math.floor(maxN / 80))) {
            var pw = Statistics.powerTwoProportions(p1, p2, Math.floor(n / 2), alpha);
            points.push({ x: n, y: pw });
        }

        Charts.LineChart(canvas, {
            data: [{ label: 'Power', points: points }],
            xLabel: 'Total Sample Size', yLabel: 'Power',
            title: 'Power Curve (ARR = ' + (eff * 100).toFixed(1) + '%, \u03B1 = ' + alpha + ')',
            yMin: 0, yMax: 1,
            width: 700, height: 350
        });
    }

    /* ============================================================
     * Minimum Detectable Effect Size
     * ============================================================ */

    function calculateMDE() {
        var design = document.getElementById('pa-mde-design').value;
        var html = '<div class="result-panel animate-in">';

        if (design === 'proportions') {
            var p1 = parseFloat(document.getElementById('pa-mde-p1').value);
            var nPG = parseInt(document.getElementById('pa-mde-n').value);
            var alpha = parseFloat(document.getElementById('pa-mde-alpha').value);

            if (isNaN(p1) || isNaN(nPG) || p1 <= 0 || p1 >= 1 || nPG < 10) {
                Export.showToast('Please check input values', 'error');
                return;
            }

            // Compute MDE at 80% and 90% power
            var mde80 = Statistics.mdeProportions(p1, nPG, alpha, 0.80);
            var mde90 = Statistics.mdeProportions(p1, nPG, alpha, 0.90);

            html += '<div class="result-value">' + (mde80.arr * 100).toFixed(1) + '% ARR (80% power)</div>';
            html += '<div class="result-label">Minimum detectable absolute risk reduction with N=' + nPG + ' per group</div>';

            html += '<div class="result-grid">'
                + '<div class="result-item"><div class="result-item-value">' + (mde80.arr * 100).toFixed(1) + '%</div><div class="result-item-label">MDE (80% power)</div></div>'
                + '<div class="result-item"><div class="result-item-value">' + mde80.p2.toFixed(3) + '</div><div class="result-item-label">Detectable p\u2082</div></div>'
                + '<div class="result-item"><div class="result-item-value">' + (mde90.arr * 100).toFixed(1) + '%</div><div class="result-item-label">MDE (90% power)</div></div>'
                + '<div class="result-item"><div class="result-item-value">' + mde90.p2.toFixed(3) + '</div><div class="result-item-label">Detectable p\u2082</div></div>'
                + '</div>';

            // MDE table by N
            html += '<div class="card-title mt-3">MDE by Sample Size (80% power)</div>';
            html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>N/Group</th><th>MDE (ARR)</th><th>Detectable p\u2082</th></tr></thead><tbody>';
            var nValues = [50, 100, 200, 300, 500, 750, 1000, 1500, 2000];
            nValues.forEach(function(nv) {
                var m = Statistics.mdeProportions(p1, nv, alpha, 0.80);
                var isBase = nv === nPG;
                html += '<tr' + (isBase ? ' style="background:var(--accent-muted)"' : '') + '>'
                    + '<td class="num">' + nv + '</td>'
                    + '<td class="num' + (isBase ? ' highlight' : '') + '">' + (m.arr * 100).toFixed(1) + '%</td>'
                    + '<td class="num">' + m.p2.toFixed(3) + '</td></tr>';
            });
            html += '</tbody></table></div>';

        } else if (design === 'means') {
            var sd = parseFloat(document.getElementById('pa-mde-sd').value);
            var nPGm = parseInt(document.getElementById('pa-mde-n-means').value);
            var alphaM = parseFloat(document.getElementById('pa-mde-alpha-means').value);

            if (isNaN(sd) || isNaN(nPGm) || sd <= 0 || nPGm < 10) {
                Export.showToast('Please check input values', 'error');
                return;
            }

            var mde80m = Statistics.mdeMeans(sd, nPGm, alphaM, 0.80);
            var mde90m = Statistics.mdeMeans(sd, nPGm, alphaM, 0.90);

            html += '<div class="result-value">\u03B4 = ' + mde80m.delta.toFixed(2) + ' (80% power)</div>';
            html += '<div class="result-label">Minimum detectable mean difference with N=' + nPGm + ' per group, SD=' + sd + '</div>';

            html += '<div class="result-grid">'
                + '<div class="result-item"><div class="result-item-value">' + mde80m.delta.toFixed(2) + '</div><div class="result-item-label">MDE \u03B4 (80%)</div></div>'
                + '<div class="result-item"><div class="result-item-value">' + mde80m.cohensD.toFixed(2) + '</div><div class="result-item-label">Cohen\'s d (80%)</div></div>'
                + '<div class="result-item"><div class="result-item-value">' + mde90m.delta.toFixed(2) + '</div><div class="result-item-label">MDE \u03B4 (90%)</div></div>'
                + '<div class="result-item"><div class="result-item-value">' + mde90m.cohensD.toFixed(2) + '</div><div class="result-item-label">Cohen\'s d (90%)</div></div>'
                + '</div>';

            // Table by N
            html += '<div class="card-title mt-3">MDE by Sample Size (80% power)</div>';
            html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>N/Group</th><th>MDE \u03B4</th><th>Cohen\'s d</th></tr></thead><tbody>';
            [30, 50, 100, 200, 300, 500, 750, 1000].forEach(function(nv) {
                var m = Statistics.mdeMeans(sd, nv, alphaM, 0.80);
                var isBase = nv === nPGm;
                html += '<tr' + (isBase ? ' style="background:var(--accent-muted)"' : '') + '>'
                    + '<td class="num">' + nv + '</td>'
                    + '<td class="num' + (isBase ? ' highlight' : '') + '">' + m.delta.toFixed(2) + '</td>'
                    + '<td class="num">' + m.cohensD.toFixed(2) + '</td></tr>';
            });
            html += '</tbody></table></div>';

        } else {
            var events = parseInt(document.getElementById('pa-mde-events').value);
            var alphaS = parseFloat(document.getElementById('pa-mde-alpha-surv').value);

            if (isNaN(events) || events < 10) {
                Export.showToast('Please check input values', 'error');
                return;
            }

            var mde80s = Statistics.mdeSurvival(events, alphaS, 0.80);
            var mde90s = Statistics.mdeSurvival(events, alphaS, 0.90);

            html += '<div class="result-value">HR = ' + mde80s.hr.toFixed(3) + ' (80% power)</div>';
            html += '<div class="result-label">Minimum detectable hazard ratio with ' + events + ' events</div>';

            html += '<div class="result-grid">'
                + '<div class="result-item"><div class="result-item-value">' + mde80s.hr.toFixed(3) + '</div><div class="result-item-label">MDE HR (80%, favors trt)</div></div>'
                + '<div class="result-item"><div class="result-item-value">' + mde80s.hrUpper.toFixed(3) + '</div><div class="result-item-label">MDE HR (80%, favors ctrl)</div></div>'
                + '<div class="result-item"><div class="result-item-value">' + mde90s.hr.toFixed(3) + '</div><div class="result-item-label">MDE HR (90%, favors trt)</div></div>'
                + '<div class="result-item"><div class="result-item-value">' + mde90s.hrUpper.toFixed(3) + '</div><div class="result-item-label">MDE HR (90%, favors ctrl)</div></div>'
                + '</div>';

            // Table by events
            html += '<div class="card-title mt-3">MDE by Number of Events (80% power)</div>';
            html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Events</th><th>MDE HR (favors trt)</th><th>MDE HR (favors ctrl)</th></tr></thead><tbody>';
            [50, 100, 150, 200, 300, 500, 750, 1000].forEach(function(ev) {
                var m = Statistics.mdeSurvival(ev, alphaS, 0.80);
                var isBase = ev === events;
                html += '<tr' + (isBase ? ' style="background:var(--accent-muted)"' : '') + '>'
                    + '<td class="num">' + ev + '</td>'
                    + '<td class="num' + (isBase ? ' highlight' : '') + '">' + m.hr.toFixed(3) + '</td>'
                    + '<td class="num">' + m.hrUpper.toFixed(3) + '</td></tr>';
            });
            html += '</tbody></table></div>';
        }

        html += '</div>';
        App.setTrustedHTML(document.getElementById('pa-mde-results'), html);
    }

    /* ============================================================
     * Multi-scenario comparison
     * ============================================================ */

    function compareScenarios() {
        var series = [];
        for (var i = 1; i <= 6; i++) {
            var p1El = document.getElementById('pa-sc' + i + '-p1');
            var p2El = document.getElementById('pa-sc' + i + '-p2');
            var nEl = document.getElementById('pa-sc' + i + '-n');
            var alphaEl = document.getElementById('pa-sc' + i + '-alpha');
            if (!p1El || !p2El || !nEl) continue;

            var p1 = parseFloat(p1El.value);
            var p2 = parseFloat(p2El.value);
            var nPG = parseInt(nEl.value);
            var scAlpha = parseFloat(alphaEl.value);
            if (isNaN(p1) || isNaN(p2) || isNaN(nPG) || nPG <= 0) continue;

            var power = Statistics.powerTwoProportions(p1, p2, nPG, scAlpha);
            var powerEl = document.getElementById('pa-sc' + i + '-power');
            if (powerEl) {
                var pct = (power * 100).toFixed(1) + '%';
                powerEl.textContent = pct;
                powerEl.style.color = power >= 0.80 ? 'var(--success)' : power >= 0.60 ? 'var(--warning)' : 'var(--danger)';
            }

            // Generate power curve for this scenario
            var points = [];
            var maxN = nPG * 3;
            for (var n = 20; n <= maxN; n += Math.max(1, Math.floor(maxN / 40))) {
                var pw = Statistics.powerTwoProportions(p1, p2, n, scAlpha);
                points.push({ x: n * 2, y: pw });
            }
            series.push({ label: 'S' + i + ': ARR=' + ((p1 - p2) * 100).toFixed(1) + '%', points: points });
        }

        if (series.length > 0) {
            var canvas = document.getElementById('pa-scenario-chart');
            if (canvas) {
                Charts.LineChart(canvas, {
                    data: series,
                    xLabel: 'Total Sample Size', yLabel: 'Power',
                    title: 'Multi-Scenario Power Comparison',
                    yMin: 0, yMax: 1,
                    width: 700, height: 350
                });
            }
        }
    }

    /* ============================================================
     * Methods text generation
     * ============================================================ */

    function generateMethods() {
        var calc = window._paLastCalc;
        if (!calc) {
            Export.showToast('Please calculate power first', 'error');
            return;
        }

        var design = calc.design;
        var text = '';
        if (design === 'proportions') {
            var p = calc.params;
            text = 'With ' + p.n + ' participants per group (total N = ' + (p.n * 2) + '), '
                + 'the study has ' + (calc.power * 100).toFixed(1) + '% power to detect '
                + 'a difference in proportions from ' + (p.p1 * 100).toFixed(1) + '% to '
                + (p.p2 * 100).toFixed(1) + '% (absolute risk reduction = '
                + ((p.p1 - p.p2) * 100).toFixed(1) + ' percentage points) '
                + 'using a two-sided test at the ' + p.alpha + ' significance level.';
        } else if (design === 'means') {
            var pm = calc.params;
            text = 'With ' + pm.n + ' participants per group, the study has '
                + (calc.power * 100).toFixed(1) + '% power to detect a mean difference of '
                + pm.delta + ' (SD = ' + pm.sd + ', effect size d = ' + (pm.delta / pm.sd).toFixed(2) + ') '
                + 'using a two-sided two-sample t-test at \u03B1 = ' + pm.alpha + '.';
        } else {
            var ps = calc.params;
            text = 'With ' + ps.events + ' events, the study has '
                + (calc.power * 100).toFixed(1) + '% power to detect a hazard ratio of '
                + ps.hr + ' using a two-sided log-rank test at \u03B1 = ' + ps.alpha + '.';
        }

        var el = document.getElementById('pa-methods-text');
        if (el) App.setTrustedHTML(el, text);
    }

    function copyMethods() {
        var el = document.getElementById('pa-methods-text');
        if (el) Export.copyText(el.textContent);
    }

    /* ============================================================
     * Register module
     * ============================================================ */

    App.registerModule(MODULE_ID, { render: render });

    window.PowerModule = {
        updateDesign: updateDesign,
        updateMDEDesign: updateMDEDesign,
        calculate: calculate,
        updateDashboard: updateDashboard,
        calculateMDE: calculateMDE,
        compareScenarios: compareScenarios,
        generateMethods: generateMethods,
        copyMethods: copyMethods
    };
})();
