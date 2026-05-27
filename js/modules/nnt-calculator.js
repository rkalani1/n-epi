/**
 * Neuro-Epi — NNT / NNH Calculator Module
 * Input modes: Event rates, 2x2 table, Published RR/OR + baseline risk
 * Outputs: ARR, RR, RRR, OR, NNT/NNH with CIs, chi-squared, Fisher exact,
 *          fragility index, Cates plot, PEER-adjusted NNT, patient explanation,
 *          methods/results text generators.
 *
 * Enhanced: NNT over time (constant hazard), NNT/NNH spectrum bar,
 * improved Cates display with size selector, PEER sensitivity table.
 *
 * Note: All HTML content is generated from trusted internal sources only.
 */
(function () {
    'use strict';

    var MODULE_ID = 'nnt-calculator';

    // ================================================================
    // RENDER
    // ================================================================

    function render(container) {
        var html = App.createModuleLayout(
            'NNT / NNH Calculator',
            'Calculate Number Needed to Treat (NNT) or Number Needed to Harm (NNH) with full supporting statistics, fragility index, Cates visual, NNT over time, and publication-ready text.'
        );

        html += '<div class="card">';

        // Input mode selector
        html += '<div class="form-label">Input Mode ' + App.tooltip('Choose how you want to enter your data. All modes produce identical output.') + '</div>';
        html += '<div class="tabs" id="nnt-input-tabs">'
            + '<button class="tab active" data-tab="rates" onclick="NNTModule.switchInputMode(\'rates\')">Event Rates + N</button>'
            + '<button class="tab" data-tab="table" onclick="NNTModule.switchInputMode(\'table\')">2&times;2 Table</button>'
            + '<button class="tab" data-tab="published" onclick="NNTModule.switchInputMode(\'published\')">Published RR/OR</button>'
            + '</div>';

        // --- Mode A: Event rates ---
        html += '<div class="tab-content active" id="nnt-tab-rates">';
        html += '<div class="card-subtitle">Enter event rates and sample sizes for each group.</div>';
        html += '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Control Event Rate (CER)</label>'
            + '<input type="number" class="form-input" name="nnt_cer" id="nnt_cer" step="0.001" min="0" max="1" value="0.28"></div>'
            + '<div class="form-group"><label class="form-label">Experimental Event Rate (EER)</label>'
            + '<input type="number" class="form-input" name="nnt_eer" id="nnt_eer" step="0.001" min="0" max="1" value="0.20"></div>'
            + '<div class="form-group"><label class="form-label">N Control</label>'
            + '<input type="number" class="form-input" name="nnt_nc" id="nnt_nc" step="1" min="1" value="300"></div>'
            + '<div class="form-group"><label class="form-label">N Experimental</label>'
            + '<input type="number" class="form-input" name="nnt_ne" id="nnt_ne" step="1" min="1" value="300"></div>'
            + '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="NNTModule.calculateFromRates()">Calculate All</button></div>';
        html += '</div>';

        // --- Mode B: 2x2 table ---
        html += '<div class="tab-content" id="nnt-tab-table">';
        html += '<div class="card-subtitle">Enter cell counts directly from a 2&times;2 contingency table.</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table" style="max-width:400px;margin:0 auto 1rem">'
            + '<thead><tr><th></th><th>Event (+)</th><th>No Event (&minus;)</th></tr></thead>'
            + '<tbody>'
            + '<tr><td><strong>Exposed / Treatment</strong></td>'
            + '<td><input type="number" class="form-input form-input--small" name="nnt_a" id="nnt_a" value="60" min="0" style="width:80px"></td>'
            + '<td><input type="number" class="form-input form-input--small" name="nnt_b" id="nnt_b" value="240" min="0" style="width:80px"></td></tr>'
            + '<tr><td><strong>Control</strong></td>'
            + '<td><input type="number" class="form-input form-input--small" name="nnt_c" id="nnt_c" value="84" min="0" style="width:80px"></td>'
            + '<td><input type="number" class="form-input form-input--small" name="nnt_d" id="nnt_d" value="216" min="0" style="width:80px"></td></tr>'
            + '</tbody></table></div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="NNTModule.calculateFromTable()">Calculate All</button></div>';
        html += '</div>';

        // --- Mode C: Published RR/OR ---
        html += '<div class="tab-content" id="nnt-tab-published">';
        html += '<div class="card-subtitle">Convert a published RR or OR to NNT using an assumed baseline risk.</div>';
        html += '<div class="form-row form-row--4">'
            + '<div class="form-group"><label class="form-label">Measure</label>'
            + '<select class="form-select" name="nnt_pub_measure" id="nnt_pub_measure">'
            + '<option value="rr">Relative Risk (RR)</option>'
            + '<option value="or">Odds Ratio (OR)</option></select></div>'
            + '<div class="form-group"><label class="form-label">Point Estimate</label>'
            + '<input type="number" class="form-input" name="nnt_pub_est" id="nnt_pub_est" step="0.01" min="0.01" value="0.71"></div>'
            + '<div class="form-group"><label class="form-label">95% CI Lower</label>'
            + '<input type="number" class="form-input" name="nnt_pub_lo" id="nnt_pub_lo" step="0.01" value="0.56"></div>'
            + '<div class="form-group"><label class="form-label">95% CI Upper</label>'
            + '<input type="number" class="form-input" name="nnt_pub_hi" id="nnt_pub_hi" step="0.01" value="0.90"></div>'
            + '</div>';
        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Baseline Risk (CER) ' + App.tooltip('Control event rate in your population of interest') + '</label>'
            + '<input type="number" class="form-input" name="nnt_pub_cer" id="nnt_pub_cer" step="0.01" min="0.001" max="0.999" value="0.28"></div>'
            + '<div class="form-group"><label class="form-label">Total N (optional, for chi-sq / Fisher)</label>'
            + '<input type="number" class="form-input" name="nnt_pub_n" id="nnt_pub_n" step="1" min="0" value=""></div>'
            + '</div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="NNTModule.calculateFromPublished()">Calculate All</button></div>';
        html += '</div>';

        // Results container
        html += '<div id="nnt-results"></div>';

        html += '</div>'; // end card

        // ===== LEARN SECTION =====
        html += '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Learn: NNT / NNH Essentials</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';

        html += '<div class="card-subtitle" style="font-weight:600;">Key Formulas</div>';
        html += '<div style="background:var(--bg-secondary);padding:12px;border-radius:8px;font-family:var(--font-mono);margin-bottom:12px;">'
            + '<div><strong>ARR:</strong> CER \u2212 EER (absolute risk reduction)</div>'
            + '<div><strong>RR:</strong> EER / CER</div>'
            + '<div><strong>RRR:</strong> (CER \u2212 EER) / CER = 1 \u2212 RR</div>'
            + '<div><strong>NNT:</strong> 1 / |ARR|</div>'
            + '<div><strong>NNT CI:</strong> 1 / Newcombe CI for risk difference</div>'
            + '<div><strong>Fragility Index:</strong> Minimum events to change to add/remove to lose significance</div>'
            + '<div><strong>NNT(t):</strong> 1 / (S\u2080(t) \u2212 S\u2081(t)), where S(t) = exp(\u2212\u03BBt)</div>'
            + '<div><strong>PEER NNT:</strong> 1 / (PEER \u00D7 RRR)</div>'
            + '</div>';

        html += '<div class="card-subtitle" style="font-weight:600;">Assumptions</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>Outcomes are binary (event / no event)</li>'
            + '<li>NNT assumes constant baseline risk across populations</li>'
            + '<li>PEER-adjusted NNT corrects for individual patient baseline risk</li>'
            + '<li>Fragility index requires the original 2x2 table with integer counts</li>'
            + '<li>NNT over time assumes constant hazard (exponential survival)</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Common Pitfalls</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>NNT \u2260 1/p:</strong> NNT is based on risk difference, not absolute risk</li>'
            + '<li><strong>Extrapolating NNT:</strong> NNT depends on follow-up time and baseline risk</li>'
            + '<li><strong>NNT from OR:</strong> Converting OR to NNT requires a baseline risk assumption</li>'
            + '<li><strong>Infinite NNT CIs:</strong> When the CI for ARR crosses zero, NNT CI wraps through infinity</li>'
            + '<li><strong>Time-dependent NNT:</strong> NNT reported at 1 year differs from NNT at 5 years</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;">'
            + '<li>Altman DG. Confidence intervals for the number needed to treat. <em>BMJ</em>. 1998;317:1309-12.</li>'
            + '<li>Walsh M, et al. The fragility index. <em>J Clin Epidemiol</em>. 2014;67:622-8.</li>'
            + '<li>Newcombe RG. Interval estimation for the difference between independent proportions. <em>Stat Med</em>. 1998;17:873-90.</li>'
            + '<li>Smeeth L, et al. Limits of ecologic studies in determining the number needed to treat. <em>BMJ</em>. 1999;318:1600.</li>'
            + '<li>Citrome L, Ketter TA. When does a difference make a difference? <em>Int J Clin Pract</em>. 2013;67:407-11.</li>'
            + '</ul>';
        html += '</div></div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    // ================================================================
    // TAB SWITCHING
    // ================================================================

    function switchInputMode(tabId) {
        document.querySelectorAll('#nnt-input-tabs .tab').forEach(function (t) {
            t.classList.toggle('active', t.dataset.tab === tabId);
        });
        document.querySelectorAll('#nnt-tab-rates, #nnt-tab-table, #nnt-tab-published').forEach(function (tc) {
            tc.classList.toggle('active', tc.id === 'nnt-tab-' + tabId);
        });
    }

    // ================================================================
    // INPUT -> CANONICAL 2x2
    // ================================================================

    function ratesTo2x2(cer, eer, nc, ne) {
        var a = Math.round(eer * ne);
        var b = ne - a;
        var c = Math.round(cer * nc);
        var d = nc - c;
        return { a: a, b: b, c: c, d: d };
    }

    function publishedTo2x2(measure, est, cer, totalN) {
        var eer;
        if (measure === 'rr') {
            eer = est * cer;
        } else {
            var rr = Statistics.orToRR(est, cer);
            eer = rr * cer;
        }
        eer = Math.max(0.0001, Math.min(0.9999, eer));
        var n = totalN && totalN > 0 ? Math.round(totalN / 2) : 500;
        return ratesTo2x2(cer, eer, n, n);
    }

    // ================================================================
    // MAIN CALCULATE
    // ================================================================

    function calculateFromRates() {
        var cer = parseFloat(document.getElementById('nnt_cer').value);
        var eer = parseFloat(document.getElementById('nnt_eer').value);
        var nc = parseInt(document.getElementById('nnt_nc').value, 10);
        var ne = parseInt(document.getElementById('nnt_ne').value, 10);
        if (isNaN(cer) || isNaN(eer) || isNaN(nc) || isNaN(ne)) { Export.showToast('Please fill all fields', 'error'); return; }
        var t = ratesTo2x2(cer, eer, nc, ne);
        showResults(t.a, t.b, t.c, t.d);
    }

    function calculateFromTable() {
        var a = parseInt(document.getElementById('nnt_a').value, 10);
        var b = parseInt(document.getElementById('nnt_b').value, 10);
        var c = parseInt(document.getElementById('nnt_c').value, 10);
        var d = parseInt(document.getElementById('nnt_d').value, 10);
        if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) { Export.showToast('Please fill all cells', 'error'); return; }
        showResults(a, b, c, d);
    }

    function calculateFromPublished() {
        var measure = document.getElementById('nnt_pub_measure').value;
        var est = parseFloat(document.getElementById('nnt_pub_est').value);
        var lo = parseFloat(document.getElementById('nnt_pub_lo').value);
        var hi = parseFloat(document.getElementById('nnt_pub_hi').value);
        var cer = parseFloat(document.getElementById('nnt_pub_cer').value);
        var totalN = parseInt(document.getElementById('nnt_pub_n').value, 10);
        if (isNaN(est) || isNaN(cer)) { Export.showToast('Estimate and baseline risk are required', 'error'); return; }
        var t = publishedTo2x2(measure, est, cer, totalN);
        showResults(t.a, t.b, t.c, t.d, { pubMeasure: measure, pubEst: est, pubLo: lo, pubHi: hi, pubCER: cer });
    }

    // ================================================================
    // RESULTS
    // ================================================================

    function formatNNTCI(rdLower, rdUpper) {
        if (rdLower <= 0 && rdUpper >= 0) {
            if (rdLower < 0 && rdUpper > 0) {
                return 'NNTB ' + Math.ceil(1 / Math.abs(rdLower)) + ' to \u221E to NNTH ' + Math.ceil(1 / rdUpper);
            }
            if (rdLower < 0 && rdUpper === 0) {
                return 'NNTB ' + Math.ceil(1 / Math.abs(rdLower)) + ' to \u221E';
            }
            if (rdLower === 0 && rdUpper > 0) {
                return '\u221E to NNTH ' + Math.ceil(1 / rdUpper);
            }
            return '\u221E';
        }
        var nntLo = Math.ceil(1 / Math.abs(rdUpper));
        var nntHi = Math.ceil(1 / Math.abs(rdLower));
        var prefix = rdLower > 0 ? 'NNTH' : 'NNTB';
        return prefix + ' ' + nntLo + ' to ' + nntHi;
    }

    function showResults(a, b, c, d, pubInfo) {
        var res = Statistics.twoByTwo(a, b, c, d);
        var z = Statistics.normalQuantile(0.975);

        var n1 = a + b;
        var n2 = c + d;
        var p1 = a / n1; // EER
        var p2 = c / n2; // CER

        var arr = p2 - p1; // positive = benefit
        var newcombe = Statistics.newcombeCI(p2, n2, p1, n1, z);
        var rr = p1 / p2;
        var rrr = 1 - rr;
        var or = res.or.value;

        // Fragility index
        var frag = Statistics.fragilityIndex(a, b, c, d);

        // NNT core
        var nntVal = arr !== 0 ? 1 / Math.abs(arr) : Infinity;
        var isNNH = arr < 0;
        var nntLabel = isNNH ? 'NNH' : 'NNT';
        var nntDisplay = nntVal === Infinity ? '\u221E' : Math.ceil(nntVal);
        var nntCIStr = formatNNTCI(newcombe.lower, newcombe.upper);

        // Build output
        var html = '<div class="result-panel animate-in">';

        // Headline
        html += '<div class="result-value">' + nntLabel + ' = ' + nntDisplay + '</div>';
        html += '<div class="result-label">95% CI: ' + nntCIStr + '</div>';

        // 2x2 table visual
        html += '<div class="card-title mt-3">2&times;2 Table</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table" style="max-width:420px">'
            + '<thead><tr><th></th><th>Event</th><th>No Event</th><th>Total</th></tr></thead>'
            + '<tbody>'
            + '<tr><td><strong>Treatment</strong></td><td class="num">' + a + '</td><td class="num">' + b + '</td><td class="num">' + n1 + '</td></tr>'
            + '<tr><td><strong>Control</strong></td><td class="num">' + c + '</td><td class="num">' + d + '</td><td class="num">' + n2 + '</td></tr>'
            + '<tr style="border-top:2px solid var(--border)"><td><strong>Total</strong></td><td class="num">' + (a + c) + '</td><td class="num">' + (b + d) + '</td><td class="num">' + (a + b + c + d) + '</td></tr>'
            + '</tbody></table></div>';

        // All measures grid
        html += '<div class="card-title mt-3">Effect Measures (95% CI)</div>';
        html += '<div class="result-grid">';

        // ARR
        html += '<div class="result-item"><div class="result-item-value">' + (arr * 100).toFixed(2) + '%</div>'
            + '<div class="result-item-label">ARR ' + App.tooltip('Absolute Risk Reduction = CER - EER. Newcombe hybrid CI.') + '<br>'
            + '(' + (newcombe.lower * 100).toFixed(2) + '% to ' + (newcombe.upper * 100).toFixed(2) + '%)</div></div>';

        // RR
        html += '<div class="result-item"><div class="result-item-value">' + rr.toFixed(3) + '</div>'
            + '<div class="result-item-label">RR<br>' + Statistics.formatCI(res.rr.ci.lower, res.rr.ci.upper, 3) + '</div></div>';

        // RRR
        html += '<div class="result-item"><div class="result-item-value">' + (rrr * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">RRR<br>(1 &minus; RR)</div></div>';

        // OR
        html += '<div class="result-item"><div class="result-item-value">' + or.toFixed(3) + '</div>'
            + '<div class="result-item-label">OR<br>' + Statistics.formatCI(res.or.ci.lower, res.or.ci.upper, 3) + '</div></div>';

        // NNT / NNH
        html += '<div class="result-item"><div class="result-item-value">' + nntDisplay + '</div>'
            + '<div class="result-item-label">' + nntLabel + '<br>' + nntCIStr + '</div></div>';

        // Chi-squared
        html += '<div class="result-item"><div class="result-item-value">' + res.chi2.chi2.toFixed(2) + '</div>'
            + '<div class="result-item-label">\u03C7\u00B2 (p = ' + Statistics.formatPValue(res.chi2.pValue) + ')</div></div>';

        // Fisher exact
        html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(res.fisher.pValue) + '</div>'
            + '<div class="result-item-label">Fisher exact p</div></div>';

        // Fragility index
        html += '<div class="result-item"><div class="result-item-value">' + frag.index + '</div>'
            + '<div class="result-item-label">Fragility Index ' + App.tooltip('Number of events to reclassify to make p > 0.05') + '</div></div>';

        html += '</div>'; // end result-grid

        // ---- NNT/NNH Spectrum Bar ----
        html += '<div class="card-title mt-3">NNT / NNH Spectrum</div>';
        html += '<div class="card-subtitle">Visual representation of benefit vs. harm magnitude.</div>';
        html += '<div class="chart-container"><canvas id="nnt-spectrum-canvas" width="700" height="120"></canvas></div>';

        // ---- Cates plot with size selector ----
        html += '<div class="card-title mt-3">Cates Plot (Icon Array) ' + App.tooltip('Visual depiction of treatment effect per 100 or 200 patients') + '</div>';
        html += '<div class="form-row form-row--2" style="margin-bottom:0.5rem">'
            + '<div class="form-group"><label class="form-label">Icon Array Size</label>'
            + '<select class="form-select" id="nnt_cates_size" onchange="NNTModule.redrawCates()">'
            + '<option value="100">100 patients (10 x 10)</option>'
            + '<option value="200">200 patients (20 x 10)</option>'
            + '</select></div>'
            + '<div class="form-group"></div></div>';
        html += '<div class="chart-container"><canvas id="nnt-cates-canvas" width="520" height="420"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'nnt-cates-canvas\'),\'cates-plot.png\')">Export PNG</button></div>';

        // ---- PEER-adjusted NNT ----
        html += '<div class="card-title mt-3">PEER-Adjusted NNT ' + App.tooltip('Apply the RRR to a different baseline risk (Patient Expected Event Rate)') + '</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Your Patient\'s Baseline Risk</label>'
            + '<input type="number" class="form-input" id="nnt_peer" step="0.01" min="0.001" max="0.999" value="' + p2.toFixed(3) + '"></div>'
            + '<div class="form-group" style="display:flex;align-items:flex-end"><button class="btn btn-secondary" onclick="NNTModule.calcPEER()">Recalculate</button></div>'
            + '<div class="form-group" id="nnt-peer-result" style="display:flex;align-items:flex-end"><span class="text-secondary">Enter baseline risk and click Recalculate</span></div>'
            + '</div>';

        // ---- PEER Sensitivity Table ----
        html += '<div class="card-title mt-2">PEER Sensitivity: NNT Across Baseline Risks</div>';
        html += '<div class="card-subtitle">Shows how NNT changes with different patient baseline risks, given the observed RRR of ' + (rrr * 100).toFixed(1) + '%.</div>';
        html += buildPEERTable(rrr);

        // ---- NNT over Time ----
        html += '<div class="card-title mt-3">NNT Over Time (Constant Hazard) '
            + App.tooltip('Assumes exponential survival. NNT(t) = 1 / (S_control(t) - S_treatment(t)) where S(t) = exp(-lambda*t). Useful when converting NNT from one follow-up duration to another.') + '</div>';
        html += '<div class="card-subtitle">NNT changes with follow-up time. Enter the trial duration and compute NNT at other timepoints assuming constant hazard.</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Original Trial Duration</label>'
            + '<input type="number" class="form-input" id="nnt_trial_t" step="0.5" min="0.1" value="1"></div>'
            + '<div class="form-group"><label class="form-label">Time Unit</label>'
            + '<select class="form-select" id="nnt_time_unit">'
            + '<option value="years">Years</option>'
            + '<option value="months">Months</option>'
            + '</select></div>'
            + '<div class="form-group" style="display:flex;align-items:flex-end">'
            + '<button class="btn btn-secondary" onclick="NNTModule.calcNNTOverTime()">Calculate NNT Over Time</button></div>'
            + '</div>';
        html += '<div id="nnt-overtime-results"></div>';

        // ---- Patient explanation ----
        html += '<div class="card-title mt-3">Patient Explanation</div>';
        var explanation = generatePatientExplanation(p2, p1, nntDisplay, nntLabel);
        html += '<div class="text-output" id="nnt-patient-text">' + explanation
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(document.getElementById(\'nnt-patient-text\').textContent.replace(\'Copy\',\'\').trim())">Copy</button></div>';

        // ---- Methods text ----
        html += '<div class="mt-3"><div class="expandable-header" onclick="this.classList.toggle(\'open\')">Methods / Results Text</div>'
            + '<div class="expandable-body"><div class="text-output" id="nnt-methods-text">'
            + generateMethodsResults(a, b, c, d, res, arr, newcombe, rr, or, nntDisplay, nntLabel, nntCIStr, frag)
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(document.getElementById(\'nnt-methods-text\').textContent.replace(\'Copy\',\'\').trim())">Copy</button></div></div></div>';

        // ---- Copy all + R Script buttons ----
        html += '<div class="btn-group mt-3">'
            + '<button class="btn btn-secondary" onclick="NNTModule.copyAll()">Copy All Results to Clipboard</button>';
        if (typeof RGenerator !== 'undefined') {
            html += '<button class="btn btn-sm r-script-btn" '
                + 'onclick="RGenerator.showScript(RGenerator.nntCalculator({a:' + a + ',b:' + b + ',c:' + c + ',d:' + d + '}), \'NNT Calculator\')">'
                + '&#129513; Generate R Script</button>';
        }
        html += '</div>';

        html += '</div>'; // end result-panel

        App.setTrustedHTML(document.getElementById('nnt-results'), html);

        // Draw charts
        setTimeout(function () {
            drawCatesPlot(p2, p1, 100);
            drawSpectrumBar(nntVal, isNNH, arr);
        }, 80);

        // Store current results for copy-all, PEER, and NNT over time
        window._nntCurrentResults = {
            a: a, b: b, c: c, d: d,
            p1: p1, p2: p2, arr: arr, rr: rr, rrr: rrr, or: or,
            newcombe: newcombe, nntDisplay: nntDisplay, nntLabel: nntLabel,
            nntCIStr: nntCIStr, frag: frag, res: res
        };

        Export.addToHistory(MODULE_ID, { a: a, b: b, c: c, d: d }, nntLabel + ' = ' + nntDisplay);
    }

    // ================================================================
    // NNT/NNH SPECTRUM BAR
    // ================================================================

    function drawSpectrumBar(nntVal, isNNH, arr) {
        var canvas = document.getElementById('nnt-spectrum-canvas');
        if (!canvas) return;

        var width = 700, height = 120;
        var ctx = Charts.setupCanvas(canvas, width, height);
        var theme = Charts.getTheme();

        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        var pad = { left: 60, right: 60, top: 30, bottom: 30 };
        var barW = width - pad.left - pad.right;
        var barH = 32;
        var barY = pad.top + 10;

        // Gradient: green (NNT small = big benefit) -> yellow (NNT large) -> center (∞) -> yellow -> red (NNH small = big harm)
        var gradient = ctx.createLinearGradient(pad.left, 0, pad.left + barW, 0);
        gradient.addColorStop(0, theme.success || '#34d399');
        gradient.addColorStop(0.3, theme.warning || '#fbbf24');
        gradient.addColorStop(0.5, theme.textTertiary || '#64748b');
        gradient.addColorStop(0.7, theme.warning || '#fbbf24');
        gradient.addColorStop(1, theme.danger || '#f87171');

        // Bar background
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(pad.left, barY, barW, barH, 6);
        ctx.fill();

        // Labels
        ctx.fillStyle = theme.text;
        ctx.font = 'bold 11px system-ui';
        ctx.textAlign = 'left';
        ctx.fillText('NNT 2', pad.left, barY + barH + 16);
        ctx.textAlign = 'center';
        ctx.fillText('\u221E', pad.left + barW / 2, barY + barH + 16);
        ctx.textAlign = 'right';
        ctx.fillText('NNH 2', pad.left + barW, barY + barH + 16);

        // Scale labels
        ctx.font = '10px system-ui';
        ctx.fillStyle = theme.textSecondary;
        ctx.textAlign = 'left';
        ctx.fillText('Benefit', pad.left, barY - 6);
        ctx.textAlign = 'right';
        ctx.fillText('Harm', pad.left + barW, barY - 6);

        // Tick marks for key NNT values
        var ticks = [2, 5, 10, 20, 50];
        ctx.strokeStyle = theme.text + '60';
        ctx.lineWidth = 1;
        ctx.font = '9px system-ui';
        ctx.textAlign = 'center';
        ctx.fillStyle = theme.textTertiary;

        ticks.forEach(function (t) {
            // Map NNT to position: NNT 2 is at left edge, infinity at center, NNH 2 at right edge
            // Using log scale: position = 0.5 - (1/(2*log(maxNNT)) * log(t)) for benefit side
            var maxLog = Math.log(100);
            var logT = Math.log(t);
            var fracFromCenter = Math.min(1, logT / maxLog) * 0.5;

            // Benefit side (left of center)
            var xBenefit = pad.left + barW / 2 - fracFromCenter * barW;
            ctx.beginPath();
            ctx.moveTo(xBenefit, barY + barH);
            ctx.lineTo(xBenefit, barY + barH + 4);
            ctx.stroke();
            if (t <= 20) ctx.fillText(t.toString(), xBenefit, barY + barH + 16);

            // Harm side (right of center)
            var xHarm = pad.left + barW / 2 + fracFromCenter * barW;
            ctx.beginPath();
            ctx.moveTo(xHarm, barY + barH);
            ctx.lineTo(xHarm, barY + barH + 4);
            ctx.stroke();
            if (t <= 20) ctx.fillText(t.toString(), xHarm, barY + barH + 16);
        });

        // Marker for current NNT
        if (nntVal !== Infinity && nntVal < 1000) {
            var maxLog = Math.log(100);
            var logNNT = Math.log(Math.min(nntVal, 100));
            var fracFromCenter = Math.min(1, logNNT / maxLog) * 0.5;
            var markerX;
            if (isNNH) {
                markerX = pad.left + barW / 2 + fracFromCenter * barW;
            } else {
                markerX = pad.left + barW / 2 - fracFromCenter * barW;
            }

            // Triangle marker
            ctx.fillStyle = theme.text;
            ctx.beginPath();
            ctx.moveTo(markerX, barY - 2);
            ctx.lineTo(markerX - 6, barY - 12);
            ctx.lineTo(markerX + 6, barY - 12);
            ctx.closePath();
            ctx.fill();

            // Label
            ctx.font = 'bold 11px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText((isNNH ? 'NNH' : 'NNT') + ' = ' + Math.ceil(nntVal), markerX, barY - 16);
        }
    }

    // ================================================================
    // CATES PLOT (IMPROVED)
    // ================================================================

    function drawCatesPlot(cer, eer, nIcons) {
        var canvas = document.getElementById('nnt-cates-canvas');
        if (!canvas) return;

        var w = nIcons === 200 ? 700 : 520;
        var h = nIcons === 200 ? 360 : 420;

        Charts.IconArray(canvas, {
            cer: cer,
            eer: eer,
            n: nIcons,
            title: 'Treatment Effect per ' + nIcons + ' Patients',
            width: w,
            height: h
        });
    }

    function redrawCates() {
        var r = window._nntCurrentResults;
        if (!r) return;
        var sizeEl = document.getElementById('nnt_cates_size');
        var nIcons = sizeEl ? parseInt(sizeEl.value, 10) : 100;
        drawCatesPlot(r.p2, r.p1, nIcons);
    }

    // ================================================================
    // PEER
    // ================================================================

    function calcPEER() {
        var r = window._nntCurrentResults;
        if (!r) return;
        var peer = parseFloat(document.getElementById('nnt_peer').value);
        if (isNaN(peer) || peer <= 0 || peer >= 1) { Export.showToast('Enter a valid baseline risk (0-1)', 'error'); return; }
        var peerARR = peer * r.rrr;
        var peerNNT = peerARR !== 0 ? Math.ceil(1 / Math.abs(peerARR)) : Infinity;
        var label = peerARR > 0 ? 'NNT' : 'NNH';
        var display = peerNNT === Infinity ? '\u221E' : peerNNT;
        App.setTrustedHTML(document.getElementById('nnt-peer-result'),
            '<span><strong>' + label + ' = ' + display + '</strong> (ARR = ' + (peerARR * 100).toFixed(2) + '%, baseline = ' + (peer * 100).toFixed(1) + '%)</span>');
    }

    // ================================================================
    // PEER SENSITIVITY TABLE
    // ================================================================

    function buildPEERTable(rrr) {
        var risks = [0.01, 0.02, 0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.40, 0.50];
        var html = '<div class="table-scroll-wrap"><table class="data-table" style="max-width:600px">';
        html += '<thead><tr><th>Baseline Risk</th><th>PEER-Adjusted ARR</th><th>PEER-Adjusted NNT</th></tr></thead>';
        html += '<tbody>';
        risks.forEach(function (risk) {
            var peerARR = risk * rrr;
            var peerNNT = peerARR !== 0 ? Math.ceil(1 / Math.abs(peerARR)) : Infinity;
            var label = peerARR > 0 ? 'NNT' : 'NNH';
            var display = peerNNT === Infinity ? '\u221E' : peerNNT;
            html += '<tr>'
                + '<td class="num">' + (risk * 100).toFixed(0) + '%</td>'
                + '<td class="num">' + (peerARR * 100).toFixed(2) + '%</td>'
                + '<td class="num">' + label + ' ' + display + '</td>'
                + '</tr>';
        });
        html += '</tbody></table></div>';
        return html;
    }

    // ================================================================
    // NNT OVER TIME (CONSTANT HAZARD)
    // ================================================================

    function calcNNTOverTime() {
        var r = window._nntCurrentResults;
        if (!r) { Export.showToast('Run the main calculation first', 'error'); return; }

        var trialT = parseFloat(document.getElementById('nnt_trial_t').value);
        var unit = document.getElementById('nnt_time_unit').value;
        if (isNaN(trialT) || trialT <= 0) { Export.showToast('Enter a valid trial duration', 'error'); return; }

        // From the observed event rates over trialT, derive hazard rates assuming exponential survival
        // S(t) = exp(-lambda*t) => lambda = -ln(1 - eventRate) / t
        var lambdaC = -Math.log(1 - Math.min(r.p2, 0.9999)) / trialT; // control hazard
        var lambdaE = -Math.log(1 - Math.min(r.p1, 0.9999)) / trialT; // treatment hazard

        // Compute NNT at various timepoints
        var timepoints;
        if (unit === 'years') {
            timepoints = [0.5, 1, 2, 3, 5, 10];
        } else {
            timepoints = [1, 3, 6, 12, 24, 60];
        }

        var html = '<div class="table-scroll-wrap"><table class="data-table" style="max-width:700px">';
        html += '<thead><tr><th>Time (' + unit + ')</th><th>Control Risk</th><th>Treatment Risk</th><th>ARR</th><th>NNT</th></tr></thead>';
        html += '<tbody>';

        var nntTimeData = [];
        timepoints.forEach(function (t) {
            var sC = Math.exp(-lambdaC * t); // control survival
            var sE = Math.exp(-lambdaE * t); // treatment survival
            var riskC = 1 - sC;
            var riskE = 1 - sE;
            var arrT = riskC - riskE;
            var nntT = arrT > 0 ? Math.ceil(1 / arrT) : (arrT < 0 ? -Math.ceil(1 / Math.abs(arrT)) : Infinity);
            var nntLabel = arrT < 0 ? 'NNH' : 'NNT';
            var nntDisp = Math.abs(nntT) === Infinity ? '\u221E' : Math.abs(nntT);

            var isOriginal = Math.abs(t - trialT) < 0.01;
            var style = isOriginal ? ' style="background:var(--accent-muted);font-weight:600"' : '';

            html += '<tr' + style + '>'
                + '<td class="num">' + t + (isOriginal ? ' (original)' : '') + '</td>'
                + '<td class="num">' + (riskC * 100).toFixed(1) + '%</td>'
                + '<td class="num">' + (riskE * 100).toFixed(1) + '%</td>'
                + '<td class="num">' + (arrT * 100).toFixed(2) + '%</td>'
                + '<td class="num">' + nntLabel + ' ' + nntDisp + '</td>'
                + '</tr>';

            nntTimeData.push({ t: t, nnt: arrT > 0 ? 1 / arrT : (arrT < 0 ? -1 / Math.abs(arrT) : 1000) });
        });

        html += '</tbody></table></div>';

        html += '<div class="card-subtitle mt-2" style="font-style:italic;color:var(--text-secondary);font-size:0.85rem">'
            + 'Assumes constant hazard rates: \u03BB<sub>control</sub> = ' + lambdaC.toFixed(4) + '/' + unit.slice(0, -1)
            + ', \u03BB<sub>treatment</sub> = ' + lambdaE.toFixed(4) + '/' + unit.slice(0, -1)
            + '. This approximation is best for time-to-event outcomes with roughly constant risk.</div>';

        // NNT over time chart
        html += '<div class="card-title mt-2">NNT Over Time</div>';
        html += '<div class="chart-container"><canvas id="nnt-time-chart" width="700" height="300"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'nnt-time-chart\'),\'nnt-over-time.png\')">Export PNG</button></div>';

        var container = document.getElementById('nnt-overtime-results');
        if (container) App.setTrustedHTML(container, html);

        // Draw the NNT over time chart
        setTimeout(function () {
            drawNNTTimeChart(lambdaC, lambdaE, unit, trialT);
        }, 80);
    }

    function drawNNTTimeChart(lambdaC, lambdaE, unit, trialT) {
        var canvas = document.getElementById('nnt-time-chart');
        if (!canvas) return;

        var maxT = unit === 'years' ? 10 : 60;
        var points = [];
        for (var t = 0.1; t <= maxT; t += maxT / 100) {
            var sC = Math.exp(-lambdaC * t);
            var sE = Math.exp(-lambdaE * t);
            var arrT = (1 - sC) - (1 - sE);
            var nntT = arrT !== 0 ? 1 / Math.abs(arrT) : 1000;
            if (nntT > 200) nntT = 200; // cap for display
            points.push({ x: t, y: nntT });
        }

        Charts.LineChart(canvas, {
            data: [{
                label: 'NNT',
                points: points,
                color: null
            }],
            xLabel: 'Time (' + unit + ')',
            yLabel: 'NNT',
            title: 'NNT Over Time (Constant Hazard)',
            yMin: 0,
            yMax: Math.min(200, Math.max.apply(null, points.map(function (p) { return p.y; })) * 1.1),
            width: 700,
            height: 300
        });
    }

    // ================================================================
    // TEXT GENERATORS
    // ================================================================

    function generatePatientExplanation(cer, eer, nntDisplay, nntLabel) {
        var cerPct = (cer * 100).toFixed(0);
        var eerPct = (eer * 100).toFixed(0);
        if (nntLabel === 'NNT') {
            return 'Out of 100 patients like you, about ' + cerPct + ' would have this outcome without the treatment, '
                + 'and about ' + eerPct + ' would have it with the treatment. That means for every '
                + nntDisplay + ' patients treated, one additional patient is spared the outcome. '
                + 'The remaining ' + (100 - parseInt(cerPct, 10)) + ' out of 100 would not have had the outcome regardless.';
        }
        return 'Out of 100 patients like you, about ' + cerPct + ' would have this outcome without the treatment, '
            + 'and about ' + eerPct + ' would have it with the treatment. That means for every '
            + nntDisplay + ' patients treated, one additional patient experiences the harm. '
            + 'This treatment appears to increase the risk of this outcome.';
    }

    function generateMethodsResults(a, b, c, d, res, arr, newcombe, rr, or, nntDisplay, nntLabel, nntCIStr, frag) {
        var n = a + b + c + d;
        var n1 = a + b;
        var n2 = c + d;
        var text = 'Among ' + n + ' participants (' + n1 + ' treatment, ' + n2 + ' control), '
            + 'the event rate was ' + ((a / n1) * 100).toFixed(1) + '% in the treatment group and '
            + ((c / n2) * 100).toFixed(1) + '% in the control group. '
            + 'The absolute risk reduction was ' + (arr * 100).toFixed(2) + '% (95% Newcombe CI: '
            + (newcombe.lower * 100).toFixed(2) + '% to ' + (newcombe.upper * 100).toFixed(2) + '%). '
            + 'The relative risk was ' + rr.toFixed(2) + ' ' + Statistics.formatCI(res.rr.ci.lower, res.rr.ci.upper, 2) + ', '
            + 'odds ratio ' + or.toFixed(2) + ' ' + Statistics.formatCI(res.or.ci.lower, res.or.ci.upper, 2) + '. '
            + 'The ' + nntLabel + ' was ' + nntDisplay + ' (' + nntCIStr + '). '
            + 'The chi-squared test statistic was ' + res.chi2.chi2.toFixed(2) + ' (p ' + Statistics.formatPValue(res.chi2.pValue) + '); '
            + 'Fisher\'s exact p ' + Statistics.formatPValue(res.fisher.pValue) + '. '
            + 'The fragility index was ' + frag.index + '.';
        return text;
    }

    // ================================================================
    // COPY ALL
    // ================================================================

    function copyAll() {
        var r = window._nntCurrentResults;
        if (!r) { Export.showToast('No results to copy', 'error'); return; }
        var lines = [
            '=== NNT / NNH Calculator Results ===',
            '2x2 Table: a=' + r.a + ', b=' + r.b + ', c=' + r.c + ', d=' + r.d,
            'EER: ' + (r.p1 * 100).toFixed(2) + '%  CER: ' + (r.p2 * 100).toFixed(2) + '%',
            'ARR: ' + (r.arr * 100).toFixed(2) + '% (Newcombe CI: ' + (r.newcombe.lower * 100).toFixed(2) + '% to ' + (r.newcombe.upper * 100).toFixed(2) + '%)',
            'RR: ' + r.rr.toFixed(4) + ' ' + Statistics.formatCI(r.res.rr.ci.lower, r.res.rr.ci.upper, 4),
            'RRR: ' + (r.rrr * 100).toFixed(2) + '%',
            'OR: ' + r.or.toFixed(4) + ' ' + Statistics.formatCI(r.res.or.ci.lower, r.res.or.ci.upper, 4),
            r.nntLabel + ': ' + r.nntDisplay + ' (' + r.nntCIStr + ')',
            'Chi-squared: ' + r.res.chi2.chi2.toFixed(3) + ', p = ' + Statistics.formatPValue(r.res.chi2.pValue),
            'Fisher exact p = ' + Statistics.formatPValue(r.res.fisher.pValue),
            'Fragility Index: ' + r.frag.index
        ];
        Export.copyText(lines.join('\n'));
    }

    // ================================================================
    // REGISTER
    // ================================================================

    App.registerModule(MODULE_ID, { render: render });

    window.NNTModule = {
        switchInputMode: switchInputMode,
        calculateFromRates: calculateFromRates,
        calculateFromTable: calculateFromTable,
        calculateFromPublished: calculateFromPublished,
        calcPEER: calcPEER,
        copyAll: copyAll,
        redrawCates: redrawCates,
        calcNNTOverTime: calcNNTOverTime
    };
})();
