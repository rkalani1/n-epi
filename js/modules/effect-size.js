/**
 * Neuro-Epi — Effect Size Converter Module
 * Input any effect measure with CI -> compute all others.
 * Conversions: OR <-> RR <-> RD <-> Cohen's d <-> Hedge's g <-> log-OR <-> log-RR
 * Interpretive labels, common OR shift visualization, copy buttons.
 *
 * Enhanced: NNT from effect sizes, overlapping normal curves, expanded benchmarks,
 * forest-plot preview, R script generation, methods text.
 *
 * Note: All HTML content is generated from trusted internal sources only.
 */
(function () {
    'use strict';

    var MODULE_ID = 'effect-size';

    // ================================================================
    // RENDER
    // ================================================================

    function render(container) {
        var html = App.createModuleLayout(
            'Effect Size Converter',
            'Convert between effect size measures. Input any one measure with its confidence interval and derive all others. Includes Cohen benchmarks, NNT derivation, visual comparator, and forest-plot preview.'
        );

        // ---- TABS ----
        html += '<div class="card">';
        html += '<div class="tabs" id="es-tabs">'
            + '<button class="tab active" data-tab="converter" onclick="EffectSizeModule.switchTab(\'converter\')">Converter</button>'
            + '<button class="tab" data-tab="visual" onclick="EffectSizeModule.switchTab(\'visual\')">Visual Comparator</button>'
            + '<button class="tab" data-tab="benchmarks" onclick="EffectSizeModule.switchTab(\'benchmarks\')">Benchmarks</button>'
            + '</div>';

        // ===== TAB A: Converter (existing + NNT + forest plot) =====
        html += '<div class="tab-content active" id="es-tab-converter">';
        html += '<div class="card-subtitle">Select the effect measure you have, enter the value and CI, then click Convert.</div>';

        // Input measure selector
        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Input Measure</label>'
            + '<select class="form-select" id="es_input_type" name="es_input_type" onchange="EffectSizeModule.onMeasureChange()">'
            + '<option value="or">Odds Ratio (OR)</option>'
            + '<option value="rr">Relative Risk (RR)</option>'
            + '<option value="rd">Risk Difference (RD)</option>'
            + '<option value="d">Cohen\'s d</option>'
            + '<option value="g">Hedge\'s g</option>'
            + '<option value="lnor">log(OR)</option>'
            + '<option value="lnrr">log(RR)</option>'
            + '</select></div>'
            + '<div class="form-group" id="es-baseline-group"><label class="form-label">Baseline Risk (P\u2080) '
            + App.tooltip('Required for OR\u2194RR conversion (Zhang & Yu) and for RD calculations. Enter the event rate in the unexposed/control group.') + '</label>'
            + '<input type="number" class="form-input" id="es_p0" name="es_p0" step="0.01" min="0.001" max="0.999" value="0.20"></div>'
            + '</div>';

        // Value + CI
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Point Estimate</label>'
            + '<input type="number" class="form-input" id="es_val" name="es_val" step="0.01" value="1.50"></div>'
            + '<div class="form-group"><label class="form-label">95% CI Lower</label>'
            + '<input type="number" class="form-input" id="es_lo" name="es_lo" step="0.01" value="1.10"></div>'
            + '<div class="form-group"><label class="form-label">95% CI Upper</label>'
            + '<input type="number" class="form-input" id="es_hi" name="es_hi" step="0.01" value="2.05"></div>'
            + '</div>';

        // Optional sample sizes for Hedge's g correction
        html += '<div class="form-row form-row--2" id="es-n-row">'
            + '<div class="form-group"><label class="form-label">N group 1 (for Hedge\'s g correction) ' + App.tooltip('Optional. Used to compute the small-sample correction factor for Hedge\'s g.') + '</label>'
            + '<input type="number" class="form-input" id="es_n1" name="es_n1" step="1" min="2" value="100"></div>'
            + '<div class="form-group"><label class="form-label">N group 2</label>'
            + '<input type="number" class="form-input" id="es_n2" name="es_n2" step="1" min="2" value="100"></div>'
            + '</div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="EffectSizeModule.convert()">Convert All</button></div>';

        // Results
        html += '<div id="es-results"></div>';

        html += '</div>'; // end tab-converter

        // ===== TAB B: Visual Comparator =====
        html += '<div class="tab-content" id="es-tab-visual">';
        html += '<div class="card-subtitle">Overlapping normal distributions showing the separation corresponding to Cohen\'s d. Enter a d value or run the converter first.</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Cohen\'s d for visualization</label>'
            + '<input type="number" class="form-input" id="es_vis_d" name="es_vis_d" step="0.1" value="0.50"></div>'
            + '<div class="form-group" style="display:flex;align-items:flex-end">'
            + '<button class="btn btn-primary" onclick="EffectSizeModule.drawOverlap()">Draw</button></div>'
            + '</div>';

        html += '<div class="chart-container"><canvas id="es-overlap-canvas" width="700" height="350"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'es-overlap-canvas\'),\'overlap-curves.png\')">Export PNG</button></div>';

        html += '<div id="es-overlap-stats" class="mt-2"></div>';

        html += '</div>'; // end tab-visual

        // ===== TAB C: Benchmarks =====
        html += '<div class="tab-content" id="es-tab-benchmarks">';
        html += '<div class="card-subtitle">Effect size benchmarks across different frameworks and clinical domains.</div>';

        html += '<div class="card-title mt-2">General Frameworks</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table">';
        html += '<thead><tr><th>Measure</th><th>Negligible</th><th>Small</th><th>Medium</th><th>Large</th><th>Very Large</th></tr></thead>';
        html += '<tbody>';
        html += '<tr><td>Cohen\'s d</td><td>&lt; 0.2</td><td>0.2</td><td>0.5</td><td>0.8</td><td>&gt; 1.2</td></tr>';
        html += '<tr><td>Hedge\'s g</td><td>&lt; 0.2</td><td>0.2</td><td>0.5</td><td>0.8</td><td>&gt; 1.2</td></tr>';
        html += '<tr><td>OR (harmful)</td><td>1.0 - 1.22</td><td>1.22 - 1.86</td><td>1.86 - 3.00</td><td>3.00 - 4.27</td><td>&gt; 4.27</td></tr>';
        html += '<tr><td>OR (protective)</td><td>0.82 - 1.0</td><td>0.54 - 0.82</td><td>0.33 - 0.54</td><td>0.23 - 0.33</td><td>&lt; 0.23</td></tr>';
        html += '<tr><td>RR (harmful)</td><td>1.0 - 1.1</td><td>1.1 - 1.5</td><td>1.5 - 2.0</td><td>2.0 - 3.0</td><td>&gt; 3.0</td></tr>';
        html += '<tr><td>RR (protective)</td><td>0.9 - 1.0</td><td>0.67 - 0.9</td><td>0.5 - 0.67</td><td>0.33 - 0.5</td><td>&lt; 0.33</td></tr>';
        html += '<tr><td>Risk Difference</td><td>&lt; 2%</td><td>2 - 5%</td><td>5 - 10%</td><td>10 - 20%</td><td>&gt; 20%</td></tr>';
        html += '<tr><td>Correlation (r)</td><td>&lt; 0.1</td><td>0.1</td><td>0.3</td><td>0.5</td><td>&gt; 0.7</td></tr>';
        html += '<tr><td>R\u00B2 (variance explained)</td><td>&lt; 1%</td><td>1%</td><td>9%</td><td>25%</td><td>&gt; 49%</td></tr>';
        html += '<tr><td>NNT</td><td>&gt; 100</td><td>25 - 100</td><td>10 - 25</td><td>5 - 10</td><td>&lt; 5</td></tr>';
        html += '</tbody></table></div>';

        html += '<div class="card-title mt-3">Domain-Specific Benchmarks</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table">';
        html += '<thead><tr><th>Field</th><th>Small</th><th>Medium</th><th>Large</th><th>Reference</th></tr></thead>';
        html += '<tbody>';
        html += '<tr><td><strong>Stroke rehabilitation</strong></td><td>d &lt; 0.4</td><td>d 0.4 - 0.7</td><td>d &gt; 0.7</td><td>Salter et al. 2013</td></tr>';
        html += '<tr><td><strong>Stroke thrombolysis</strong></td><td>NNT &gt; 20</td><td>NNT 10 - 20</td><td>NNT &lt; 10</td><td>Wardlaw et al. 2014</td></tr>';
        html += '<tr><td><strong>Epilepsy AED trials</strong></td><td>RRR &lt; 20%</td><td>RRR 20 - 40%</td><td>RRR &gt; 40%</td><td>Marson et al. 2007</td></tr>';
        html += '<tr><td><strong>Dementia prevention</strong></td><td>d &lt; 0.2</td><td>d 0.2 - 0.4</td><td>d &gt; 0.4</td><td>Livingston et al. 2020</td></tr>';
        html += '<tr><td><strong>Neuropathic pain</strong></td><td>NNT &gt; 8</td><td>NNT 4 - 8</td><td>NNT &lt; 4</td><td>Finnerup et al. 2015</td></tr>';
        html += '<tr><td><strong>Neurosurgery (oncology)</strong></td><td>HR 0.7 - 1.0</td><td>HR 0.5 - 0.7</td><td>HR &lt; 0.5</td><td>Stupp et al. 2005</td></tr>';
        html += '<tr><td><strong>MS disease-modifying Tx</strong></td><td>RRR &lt; 30%</td><td>RRR 30 - 50%</td><td>RRR &gt; 50%</td><td>Tintore et al. 2019</td></tr>';
        html += '<tr><td><strong>Psychiatry/psychotherapy</strong></td><td>d &lt; 0.33</td><td>d 0.33 - 0.56</td><td>d &gt; 0.56</td><td>Hattie et al. 2002</td></tr>';
        html += '</tbody></table></div>';

        html += '<div class="card-subtitle mt-3" style="font-style:italic;color:var(--text-secondary)">Note: Benchmarks are rough guides. Always interpret effect sizes in context of clinical meaningfulness, baseline risk, and outcome severity.</div>';

        html += '</div>'; // end tab-benchmarks

        html += '</div>'; // card

        // ===== LEARN SECTION =====
        html += '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Learn: Effect Size Essentials</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';

        html += '<div class="card-subtitle" style="font-weight:600;">Key Formulas</div>';
        html += '<div style="background:var(--bg-secondary);padding:12px;border-radius:8px;font-family:var(--font-mono);margin-bottom:12px;">'
            + '<div><strong>Cohen\'s d:</strong> d = (M\u2081 \u2212 M\u2082) / SD<sub>pooled</sub></div>'
            + '<div><strong>Hedge\'s g:</strong> g = d \u00D7 (1 \u2212 3/(4(n\u2081+n\u2082)\u22129))</div>'
            + '<div><strong>OR \u2192 d:</strong> d = ln(OR) \u00D7 \u221A3 / \u03C0  \u2248 ln(OR) / 1.81</div>'
            + '<div><strong>d \u2192 OR:</strong> OR = exp(d \u00D7 \u03C0 / \u221A3) \u2248 exp(1.81 \u00D7 d)</div>'
            + '<div><strong>OR \u2192 RR:</strong> RR = OR / (1 \u2212 P\u2080 + P\u2080 \u00D7 OR) [Zhang & Yu]</div>'
            + '<div><strong>RD:</strong> P\u2081 \u2212 P\u2080 (= EER \u2212 CER)</div>'
            + '<div><strong>NNT:</strong> 1 / |RD|</div>'
            + '<div><strong>U\u2083 (overlap):</strong> 2\u03A6(-|d|/2) = proportion of overlap</div>'
            + '</div>';

        html += '<div class="card-subtitle" style="font-weight:600;">Interpretation (Cohen Benchmarks)</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Small:</strong> d = 0.2, OR \u2248 1.44, r \u2248 0.10</li>'
            + '<li><strong>Medium:</strong> d = 0.5, OR \u2248 2.48, r \u2248 0.24</li>'
            + '<li><strong>Large:</strong> d = 0.8, OR \u2248 4.27, r \u2248 0.37</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Common Pitfalls</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>OR \u2260 RR:</strong> When outcome prevalence >10%, OR overestimates RR</li>'
            + '<li><strong>Baseline risk required:</strong> OR\u2194RR conversion needs the control group event rate</li>'
            + '<li><strong>Cohen benchmarks are defaults:</strong> Always interpret effect sizes in clinical context</li>'
            + '<li><strong>Small samples:</strong> Use Hedge\'s g (not d) for bias correction when n < 20</li>'
            + '<li><strong>NNT from effect sizes:</strong> NNT derived from OR/RR requires a baseline risk assumption</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;">'
            + '<li>Cohen J. <em>Statistical Power Analysis for the Behavioral Sciences</em>. 2nd ed. 1988.</li>'
            + '<li>Chinn S. A simple method for converting an OR to effect size. <em>Stat Med</em>. 2000;19:3127-31.</li>'
            + '<li>Zhang J, Yu KF. What\'s the relative risk? <em>JAMA</em>. 1998;280:1690-1.</li>'
            + '<li>Borenstein M, et al. <em>Introduction to Meta-Analysis</em>. Wiley. 2009.</li>'
            + '<li>Kraemer HC, Kupfer DJ. Size of treatment effects and their importance. <em>Biol Psychiatry</em>. 2006;59:990-6.</li>'
            + '</ul>';
        html += '</div></div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    // ================================================================
    // TAB SWITCHING
    // ================================================================

    function switchTab(tabId) {
        document.querySelectorAll('#es-tabs .tab').forEach(function (t) {
            t.classList.toggle('active', t.dataset.tab === tabId);
        });
        var tabIds = ['converter', 'visual', 'benchmarks'];
        tabIds.forEach(function (id) {
            var el = document.getElementById('es-tab-' + id);
            if (el) el.classList.toggle('active', id === tabId);
        });
    }

    function onMeasureChange() {
        // Always show baseline risk and N fields
    }

    // ================================================================
    // CORE CONVERSION ENGINE
    // ================================================================

    function convertValue(type, val, p0) {
        // Returns {or, rr, rd, d, g, lnor, lnrr} from any input type
        var orVal, rrVal, rdVal, dVal;

        switch (type) {
            case 'or':
                orVal = val;
                rrVal = Statistics.orToRR(orVal, p0);
                rdVal = rrVal * p0 - p0; // EER - CER = RR*p0 - p0
                dVal = Statistics.orToD(orVal);
                break;
            case 'rr':
                rrVal = val;
                orVal = Statistics.rrToOR(rrVal, p0);
                rdVal = rrVal * p0 - p0;
                dVal = Statistics.orToD(orVal);
                break;
            case 'rd':
                rdVal = val;
                var eer = p0 + val;
                eer = Math.max(0.0001, Math.min(0.9999, eer));
                rrVal = eer / p0;
                orVal = Statistics.rrToOR(rrVal, p0);
                dVal = Statistics.orToD(orVal);
                break;
            case 'd':
                dVal = val;
                orVal = Statistics.dToOR(dVal);
                rrVal = Statistics.orToRR(orVal, p0);
                rdVal = rrVal * p0 - p0;
                break;
            case 'g':
                // g ≈ d * correction. Reverse: d = g / correction. Need n1,n2.
                var n1g = parseInt(document.getElementById('es_n1').value, 10) || 100;
                var n2g = parseInt(document.getElementById('es_n2').value, 10) || 100;
                var dfg = n1g + n2g - 2;
                var corr = 1 - 3 / (4 * dfg - 1);
                dVal = corr > 0 ? val / corr : val;
                orVal = Statistics.dToOR(dVal);
                rrVal = Statistics.orToRR(orVal, p0);
                rdVal = rrVal * p0 - p0;
                break;
            case 'lnor':
                orVal = Math.exp(val);
                rrVal = Statistics.orToRR(orVal, p0);
                rdVal = rrVal * p0 - p0;
                dVal = Statistics.orToD(orVal);
                break;
            case 'lnrr':
                rrVal = Math.exp(val);
                orVal = Statistics.rrToOR(rrVal, p0);
                rdVal = rrVal * p0 - p0;
                dVal = Statistics.orToD(orVal);
                break;
            default:
                return null;
        }

        // Hedge's g
        var n1 = parseInt(document.getElementById('es_n1').value, 10) || 100;
        var n2 = parseInt(document.getElementById('es_n2').value, 10) || 100;
        var gVal = Statistics.dToHedgesG(dVal, n1, n2);

        return {
            or: orVal,
            rr: rrVal,
            rd: rdVal,
            d: dVal,
            g: gVal,
            lnor: Math.log(orVal),
            lnrr: Math.log(rrVal)
        };
    }

    // ================================================================
    // INTERPRETATION
    // ================================================================

    function cohenLabel(d) {
        var abs = Math.abs(d);
        if (abs < 0.2) return 'Negligible';
        if (abs < 0.5) return 'Small';
        if (abs < 0.8) return 'Medium';
        return 'Large';
    }

    function orInterpretation(or) {
        if (or >= 0.9 && or <= 1.1) return 'Negligible association';
        if ((or > 1.1 && or <= 1.5) || (or >= 0.67 && or < 0.9)) return 'Weak association';
        if ((or > 1.5 && or <= 3.0) || (or >= 0.33 && or < 0.67)) return 'Moderate association';
        return 'Strong association';
    }

    function rrInterpretation(rr) {
        if (rr >= 0.9 && rr <= 1.1) return 'Negligible';
        if ((rr > 1.1 && rr <= 1.5) || (rr >= 0.67 && rr < 0.9)) return 'Weak';
        if ((rr > 1.5 && rr <= 2.0) || (rr >= 0.5 && rr < 0.67)) return 'Moderate';
        return 'Strong';
    }

    // ================================================================
    // CONVERT
    // ================================================================

    function convert() {
        var type = document.getElementById('es_input_type').value;
        var val = parseFloat(document.getElementById('es_val').value);
        var lo = parseFloat(document.getElementById('es_lo').value);
        var hi = parseFloat(document.getElementById('es_hi').value);
        var p0 = parseFloat(document.getElementById('es_p0').value);
        var n1 = parseInt(document.getElementById('es_n1').value, 10) || 100;
        var n2 = parseInt(document.getElementById('es_n2').value, 10) || 100;

        if (isNaN(val)) { Export.showToast('Enter a point estimate', 'error'); return; }
        if (isNaN(p0) || p0 <= 0 || p0 >= 1) { Export.showToast('Baseline risk must be between 0 and 1', 'error'); return; }

        var main = convertValue(type, val, p0);
        var ciLow = !isNaN(lo) ? convertValue(type, lo, p0) : null;
        var ciHigh = !isNaN(hi) ? convertValue(type, hi, p0) : null;

        if (!main) { Export.showToast('Conversion error', 'error'); return; }

        var html = '<div class="result-panel animate-in">';

        // Results table
        html += '<div class="card-title mt-2">Converted Effect Sizes</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table">';
        html += '<thead><tr><th>Measure</th><th>Estimate</th><th>95% CI</th><th>Interpretation</th><th></th></tr></thead>';
        html += '<tbody>';

        var rows = [
            { label: 'Odds Ratio (OR)', key: 'or', dec: 3, interp: orInterpretation(main.or) },
            { label: 'Relative Risk (RR)', key: 'rr', dec: 3, interp: rrInterpretation(main.rr) },
            { label: 'Risk Difference (RD)', key: 'rd', dec: 4, interp: '' },
            { label: 'Cohen\'s d', key: 'd', dec: 3, interp: cohenLabel(main.d) },
            { label: 'Hedge\'s g', key: 'g', dec: 3, interp: cohenLabel(main.g) },
            { label: 'log(OR)', key: 'lnor', dec: 4, interp: '' },
            { label: 'log(RR)', key: 'lnrr', dec: 4, interp: '' }
        ];

        rows.forEach(function (r) {
            var est = main[r.key];
            var ciStr = '';
            if (ciLow && ciHigh) {
                var a = ciLow[r.key];
                var b = ciHigh[r.key];
                var lower = Math.min(a, b);
                var upper = Math.max(a, b);
                ciStr = '(' + lower.toFixed(r.dec) + ', ' + upper.toFixed(r.dec) + ')';
            }
            var copyVal = est.toFixed(r.dec) + (ciStr ? ' ' + ciStr : '');
            html += '<tr>'
                + '<td>' + r.label + '</td>'
                + '<td class="num highlight">' + est.toFixed(r.dec) + '</td>'
                + '<td class="num">' + ciStr + '</td>'
                + '<td>' + r.interp + '</td>'
                + '<td><button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'' + copyVal.replace(/'/g, "\\'") + '\')">Copy</button></td>'
                + '</tr>';
        });

        html += '</tbody></table></div>';

        // ---- NNT from Effect Sizes ----
        html += '<div class="card-title mt-3">NNT Derived from Effect Size</div>';
        var absRD = Math.abs(main.rd);
        var nntVal = absRD > 0 ? 1 / absRD : Infinity;
        var nntDisplay = nntVal === Infinity ? '\u221E' : Math.ceil(nntVal);
        var nntType = main.rd < 0 ? 'NNH' : 'NNT';
        if (main.rd === 0) nntType = 'NNT';

        var nntCIStr = '';
        if (ciLow && ciHigh) {
            var rdLo = Math.min(ciLow.rd, ciHigh.rd);
            var rdHi = Math.max(ciLow.rd, ciHigh.rd);
            if (rdLo <= 0 && rdHi >= 0) {
                if (rdLo < 0 && rdHi > 0) {
                    nntCIStr = 'NNTB ' + Math.ceil(1 / Math.abs(rdLo)) + ' to \u221E to NNTH ' + Math.ceil(1 / rdHi);
                } else if (rdLo < 0 && rdHi === 0) {
                    nntCIStr = 'NNTB ' + Math.ceil(1 / Math.abs(rdLo)) + ' to \u221E';
                } else if (rdLo === 0 && rdHi > 0) {
                    nntCIStr = '\u221E to NNTH ' + Math.ceil(1 / rdHi);
                } else {
                    nntCIStr = '\u221E';
                }
            } else {
                var nntCILo = Math.ceil(1 / Math.abs(rdHi));
                var nntCIHi = Math.ceil(1 / Math.abs(rdLo));
                var ciPrefix = rdLo > 0 ? 'NNTH' : 'NNTB';
                nntCIStr = ciPrefix + ' ' + nntCILo + ' to ' + nntCIHi;
            }
        }

        html += '<div class="result-grid">';
        html += '<div class="result-item"><div class="result-item-value">' + nntDisplay + '</div>'
            + '<div class="result-item-label">' + nntType + (nntCIStr ? '<br>' + nntCIStr : '') + '</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + (absRD * 100).toFixed(2) + '%</div>'
            + '<div class="result-item-label">|Risk Difference|</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + (p0 * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Assumed Baseline Risk</div></div>';
        html += '</div>';

        html += '<div class="card-subtitle" style="font-style:italic;color:var(--text-secondary);font-size:0.85rem">Note: NNT depends on the baseline risk (P\u2080). Change P\u2080 above to see how NNT varies across populations.</div>';

        // ---- Interpretive benchmarks (compact) ----
        html += '<div class="card-title mt-3">Interpretation Benchmarks</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table" style="max-width:600px">';
        html += '<thead><tr><th>Framework</th><th>Small</th><th>Medium</th><th>Large</th></tr></thead>';
        html += '<tbody>';
        html += '<tr><td>Cohen\'s d</td><td>0.2</td><td>0.5</td><td>0.8</td></tr>';
        html += '<tr><td>OR</td><td>1.5 / 0.67</td><td>2.5 / 0.4</td><td>4.3 / 0.23</td></tr>';
        html += '<tr><td>RR</td><td>1.22 / 0.82</td><td>1.86 / 0.54</td><td>3.00 / 0.33</td></tr>';
        html += '<tr style="background:var(--accent-muted)"><td><strong>Stroke-specific</strong></td><td>d &lt; 0.4</td><td>d 0.4-0.7</td><td>d &gt; 0.7</td></tr>';
        html += '</tbody></table></div>';

        // ---- Formula reference ----
        html += '<div class="card-title mt-3">Conversion Formulas</div>';
        html += '<div class="text-output" style="font-family:monospace;font-size:0.85rem;line-height:1.8">'
            + 'd = ln(OR) / 1.81<br>'
            + 'OR = exp(1.81 &times; d)<br>'
            + 'RR = OR / (1 - P\u2080 + P\u2080 &times; OR)  &mdash; Zhang &amp; Yu<br>'
            + 'OR = RR &times; (1 - P\u2080) / (1 - RR &times; P\u2080)<br>'
            + 'RD = RR &times; P\u2080 - P\u2080<br>'
            + 'NNT = 1 / |RD|<br>'
            + 'g = d &times; (1 - 3/(4(n\u2081+n\u2082-2) - 1))  &mdash; Hedge\'s correction'
            + '</div>';

        // ---- Common OR shift visualization ----
        html += '<div class="card-title mt-3">Common OR to mRS Shift Visualization</div>';
        html += '<div class="card-subtitle">Shows how different common ORs shift a typical LVO control mRS distribution.</div>';
        html += '<div class="chart-container"><canvas id="es-shift-chart" width="700" height="350"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'es-shift-chart\'),\'or-shift.png\')">Export PNG</button></div>';

        // ---- Forest Plot Preview ----
        html += '<div class="card-title mt-3">Forest Plot Preview</div>';
        html += '<div class="card-subtitle">Single-study forest plot showing the converted effect on the selected scale.</div>';
        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Display Scale</label>'
            + '<select class="form-select" id="es_forest_scale" onchange="EffectSizeModule.drawForestPlot()">'
            + '<option value="or">OR</option>'
            + '<option value="rr">RR</option>'
            + '<option value="d">Cohen\'s d</option>'
            + '<option value="g">Hedge\'s g</option>'
            + '</select></div>'
            + '<div class="form-group"></div>'
            + '</div>';
        html += '<div class="chart-container"><canvas id="es-forest-canvas" width="700" height="200"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'es-forest-canvas\'),\'effect-forest.png\')">Export PNG</button></div>';

        // ---- Methods text ----
        html += '<div class="mt-3"><div class="expandable-header" onclick="this.classList.toggle(\'open\')">Methods / Results Text</div>'
            + '<div class="expandable-body"><div class="text-output" id="es-methods-text">'
            + generateMethodsText(type, val, lo, hi, p0, main, ciLow, ciHigh, nntDisplay, nntType, nntCIStr)
            + '<button class="btn btn-xs btn-secondary copy-btn" onclick="Export.copyText(document.getElementById(\'es-methods-text\').textContent.replace(\'Copy\',\'\').trim())">Copy</button></div></div></div>';

        // Copy all + R Script
        html += '<div class="btn-group mt-3">'
            + '<button class="btn btn-secondary" onclick="EffectSizeModule.copyAll()">Copy All Results</button>';
        if (typeof RGenerator !== 'undefined') {
            html += '<button class="btn btn-sm r-script-btn" '
                + 'onclick="RGenerator.showScript(RGenerator.effectSize({inputType:\'' + type + '\',value:' + val
                + ',ciLower:' + (isNaN(lo) ? 'null' : lo) + ',ciUpper:' + (isNaN(hi) ? 'null' : hi)
                + ',p0:' + p0 + ',n1:' + n1 + ',n2:' + n2 + '}), \'Effect Size Converter\')">'
                + '&#129513; Generate R Script</button>';
        }
        html += '</div>';

        html += '</div>'; // result-panel

        App.setTrustedHTML(document.getElementById('es-results'), html);

        // Draw charts
        setTimeout(function () {
            drawShiftChart(main.or);
            drawForestPlot();
        }, 80);

        // Update visual tab d value
        var visD = document.getElementById('es_vis_d');
        if (visD) visD.value = main.d.toFixed(2);

        // Store for copy and forest plot
        window._esCurrentMain = main;
        window._esCurrentCILow = ciLow;
        window._esCurrentCIHigh = ciHigh;
        window._esCurrentRows = rows.map(function (r) {
            var est = main[r.key];
            var ciStr = '';
            if (ciLow && ciHigh) {
                var a = ciLow[r.key];
                var b = ciHigh[r.key];
                ciStr = '(' + Math.min(a, b).toFixed(r.dec) + ', ' + Math.max(a, b).toFixed(r.dec) + ')';
            }
            return r.label + ': ' + est.toFixed(r.dec) + ' ' + ciStr + (r.interp ? ' [' + r.interp + ']' : '');
        });
        window._esNNT = { display: nntDisplay, type: nntType, ciStr: nntCIStr, rd: main.rd };

        Export.addToHistory(MODULE_ID, { type: type, val: val, p0: p0 }, 'OR=' + main.or.toFixed(2) + ', d=' + main.d.toFixed(2) + ', ' + nntType + '=' + nntDisplay);
    }

    // ================================================================
    // FOREST PLOT PREVIEW
    // ================================================================

    function drawForestPlot() {
        var canvas = document.getElementById('es-forest-canvas');
        if (!canvas || !window._esCurrentMain) return;

        var main = window._esCurrentMain;
        var ciLow = window._esCurrentCILow;
        var ciHigh = window._esCurrentCIHigh;

        var scaleEl = document.getElementById('es_forest_scale');
        var scale = scaleEl ? scaleEl.value : 'or';

        var est, lower, upper, nullVal, label, useLog;

        switch (scale) {
            case 'or':
                est = main.or;
                lower = ciLow ? Math.min(ciLow.or, ciHigh.or) : est * 0.7;
                upper = ciHigh ? Math.max(ciLow.or, ciHigh.or) : est * 1.3;
                nullVal = 1;
                label = 'Odds Ratio';
                useLog = true;
                break;
            case 'rr':
                est = main.rr;
                lower = ciLow ? Math.min(ciLow.rr, ciHigh.rr) : est * 0.7;
                upper = ciHigh ? Math.max(ciLow.rr, ciHigh.rr) : est * 1.3;
                nullVal = 1;
                label = 'Relative Risk';
                useLog = true;
                break;
            case 'd':
                est = main.d;
                lower = ciLow ? Math.min(ciLow.d, ciHigh.d) : est - 0.3;
                upper = ciHigh ? Math.max(ciLow.d, ciHigh.d) : est + 0.3;
                nullVal = 0;
                label = 'Cohen\'s d';
                useLog = false;
                break;
            case 'g':
                est = main.g;
                lower = ciLow ? Math.min(ciLow.g, ciHigh.g) : est - 0.3;
                upper = ciHigh ? Math.max(ciLow.g, ciHigh.g) : est + 0.3;
                nullVal = 0;
                label = 'Hedge\'s g';
                useLog = false;
                break;
            default:
                return;
        }

        Charts.ForestPlot(canvas, {
            studies: [{
                name: 'Converted Effect',
                estimate: est,
                ci: { lower: lower, upper: upper },
                weight: 100
            }],
            summary: null,
            nullValue: nullVal,
            measureLabel: label,
            logScale: useLog,
            title: 'Effect Size: ' + label,
            width: 700,
            height: 200
        });
    }

    // ================================================================
    // OVERLAPPING NORMAL CURVES (Visual Comparator)
    // ================================================================

    function drawOverlap() {
        var dVal = parseFloat(document.getElementById('es_vis_d').value);
        if (isNaN(dVal)) { Export.showToast('Enter a Cohen\'s d value', 'error'); return; }

        var canvas = document.getElementById('es-overlap-canvas');
        if (!canvas) return;

        var width = 700, height = 350;
        var ctx = Charts.setupCanvas(canvas, width, height);
        var theme = Charts.getTheme();

        // Clear
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        var pad = { top: 50, right: 40, bottom: 60, left: 50 };
        var plotW = width - pad.left - pad.right;
        var plotH = height - pad.top - pad.bottom;

        // Two normal distributions: N(0,1) and N(d,1)
        var absD = Math.abs(dVal);
        var xMin = Math.min(-4, dVal - 4);
        var xMax = Math.max(4, dVal + 4);

        function normalPDF(x, mu) {
            var z = x - mu;
            return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
        }

        // Generate points
        var nPts = 300;
        var step = (xMax - xMin) / nPts;
        var pts1 = [], pts2 = [];
        var yMax = 0;
        for (var i = 0; i <= nPts; i++) {
            var x = xMin + i * step;
            var y1 = normalPDF(x, 0);
            var y2 = normalPDF(x, dVal);
            if (y1 > yMax) yMax = y1;
            if (y2 > yMax) yMax = y2;
            pts1.push({ x: x, y: y1 });
            pts2.push({ x: x, y: y2 });
        }
        yMax *= 1.15;

        function toCanvasX(val) { return pad.left + (val - xMin) / (xMax - xMin) * plotW; }
        function toCanvasY(val) { return pad.top + plotH - (val / yMax) * plotH; }

        // Grid lines
        ctx.strokeStyle = theme.grid;
        ctx.lineWidth = 1;
        for (var gx = Math.ceil(xMin); gx <= Math.floor(xMax); gx++) {
            ctx.beginPath();
            ctx.moveTo(toCanvasX(gx), pad.top);
            ctx.lineTo(toCanvasX(gx), pad.top + plotH);
            ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pad.left, pad.top + plotH);
        ctx.lineTo(pad.left + plotW, pad.top + plotH);
        ctx.stroke();

        // Draw overlap region (filled)
        ctx.beginPath();
        for (var i = 0; i <= nPts; i++) {
            var minY = Math.min(pts1[i].y, pts2[i].y);
            var cx = toCanvasX(pts1[i].x);
            var cy = toCanvasY(minY);
            if (i === 0) ctx.moveTo(cx, toCanvasY(0));
            ctx.lineTo(cx, cy);
        }
        ctx.lineTo(toCanvasX(xMax), toCanvasY(0));
        ctx.closePath();
        ctx.fillStyle = theme.series[4] + '30';
        ctx.fill();

        // Draw curve 1 (Control)
        ctx.beginPath();
        for (var i = 0; i <= nPts; i++) {
            var cx = toCanvasX(pts1[i].x);
            var cy = toCanvasY(pts1[i].y);
            if (i === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
        }
        ctx.strokeStyle = theme.series[0];
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Fill under curve 1
        ctx.beginPath();
        ctx.moveTo(toCanvasX(xMin), toCanvasY(0));
        for (var i = 0; i <= nPts; i++) {
            ctx.lineTo(toCanvasX(pts1[i].x), toCanvasY(pts1[i].y));
        }
        ctx.lineTo(toCanvasX(xMax), toCanvasY(0));
        ctx.closePath();
        ctx.fillStyle = theme.series[0] + '18';
        ctx.fill();

        // Draw curve 2 (Treatment)
        ctx.beginPath();
        for (var i = 0; i <= nPts; i++) {
            var cx = toCanvasX(pts2[i].x);
            var cy = toCanvasY(pts2[i].y);
            if (i === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
        }
        ctx.strokeStyle = theme.series[1];
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Fill under curve 2
        ctx.beginPath();
        ctx.moveTo(toCanvasX(xMin), toCanvasY(0));
        for (var i = 0; i <= nPts; i++) {
            ctx.lineTo(toCanvasX(pts2[i].x), toCanvasY(pts2[i].y));
        }
        ctx.lineTo(toCanvasX(xMax), toCanvasY(0));
        ctx.closePath();
        ctx.fillStyle = theme.series[1] + '18';
        ctx.fill();

        // Arrow showing d
        var arrowY = toCanvasY(normalPDF(0, 0) * 0.4);
        ctx.strokeStyle = theme.text;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(toCanvasX(0), arrowY);
        ctx.lineTo(toCanvasX(dVal), arrowY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow heads
        var arrowDir = dVal >= 0 ? 1 : -1;
        if (dVal !== 0) {
            var arrowTip = toCanvasX(dVal);
            ctx.beginPath();
            ctx.moveTo(arrowTip, arrowY);
            ctx.lineTo(arrowTip - arrowDir * 8, arrowY - 5);
            ctx.lineTo(arrowTip - arrowDir * 8, arrowY + 5);
            ctx.closePath();
            ctx.fillStyle = theme.text;
            ctx.fill();
        }

        // d label
        ctx.fillStyle = theme.text;
        ctx.font = 'bold 13px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('d = ' + dVal.toFixed(2), (toCanvasX(0) + toCanvasX(dVal)) / 2, arrowY - 10);

        // X-axis ticks
        ctx.fillStyle = theme.textSecondary;
        ctx.font = '11px system-ui';
        ctx.textAlign = 'center';
        for (var gx = Math.ceil(xMin); gx <= Math.floor(xMax); gx++) {
            ctx.fillText(gx.toString(), toCanvasX(gx), pad.top + plotH + 16);
        }

        // X-axis label
        ctx.fillStyle = theme.textSecondary;
        ctx.font = '12px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Standard Deviations', width / 2, height - 10);

        // Legend
        ctx.fillStyle = theme.series[0];
        ctx.fillRect(pad.left + 10, pad.top - 35, 14, 14);
        ctx.fillStyle = theme.text;
        ctx.font = '12px system-ui';
        ctx.textAlign = 'left';
        ctx.fillText('Control (\u03BC = 0)', pad.left + 30, pad.top - 23);

        ctx.fillStyle = theme.series[1];
        ctx.fillRect(pad.left + 170, pad.top - 35, 14, 14);
        ctx.fillStyle = theme.text;
        ctx.fillText('Treatment (\u03BC = ' + dVal.toFixed(2) + ')', pad.left + 190, pad.top - 23);

        // Title
        ctx.fillStyle = theme.text;
        ctx.font = 'bold 14px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Effect Size Visualization: Overlapping Distributions', width / 2, 18);

        // Statistics panel
        // U3: proportion of treatment group above control median = Phi(d)
        var u3 = Statistics.normalCDF(absD);
        // Overlap coefficient (OVL): 2*Phi(-|d|/2)
        var ovl = 2 * Statistics.normalCDF(-absD / 2);
        // Probability of superiority: Phi(d / sqrt(2))
        var probSup = Statistics.normalCDF(absD / Math.sqrt(2));

        var statsHtml = '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + (ovl * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Overlap (OVL) ' + App.tooltip('Proportion of the two distributions that overlap. OVL = 2\u03A6(-|d|/2).') + '</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (u3 * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">U\u2083 Percentile ' + App.tooltip('Proportion of the treatment group exceeding the control group median. U3 = \u03A6(d).') + '</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (probSup * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Prob. of Superiority ' + App.tooltip('Probability that a random treatment subject scores higher than a random control subject. PS = \u03A6(d/\u221A2).') + '</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + ((1 - ovl) * 100).toFixed(1) + '%</div>'
            + '<div class="result-item-label">Non-Overlap</div></div>'
            + '</div>';

        var statsEl = document.getElementById('es-overlap-stats');
        if (statsEl) App.setTrustedHTML(statsEl, statsHtml);
    }

    // ================================================================
    // SHIFT CHART
    // ================================================================

    function drawShiftChart(inputOR) {
        var canvas = document.getElementById('es-shift-chart');
        if (!canvas) return;

        // Use typical LVO control distribution
        var ctrl = [0.05, 0.07, 0.10, 0.10, 0.18, 0.20, 0.30];

        function shiftDist(dist, commonOR) {
            var cum = [];
            var s = 0;
            for (var i = 0; i < dist.length; i++) {
                s += dist[i];
                cum.push(s);
            }
            var newCum = [];
            for (var i = 0; i < cum.length - 1; i++) {
                var odds = cum[i] / (1 - cum[i]);
                var newOdds = commonOR * odds;
                newCum.push(newOdds / (1 + newOdds));
            }
            newCum.push(1.0);
            var newDist = [newCum[0]];
            for (var i = 1; i < newCum.length; i++) {
                newDist.push(Math.max(0, newCum[i] - newCum[i - 1]));
            }
            return newDist;
        }

        var ors = [1.0, 1.5, 2.0, 2.5];
        var found = false;
        for (var i = 0; i < ors.length; i++) {
            if (Math.abs(ors[i] - inputOR) < 0.1) { found = true; break; }
        }
        if (!found && inputOR > 0.3 && inputOR < 10) {
            ors.push(inputOR);
            ors.sort(function (a, b) { return a - b; });
        }

        var series = ors.map(function (or) {
            var d = or === 1.0 ? ctrl : shiftDist(ctrl, or);
            return {
                label: 'OR = ' + or.toFixed(1),
                values: d.map(function (v) { return v * 100; })
            };
        });

        Charts.BarChart(canvas, {
            categories: ['mRS 0', 'mRS 1', 'mRS 2', 'mRS 3', 'mRS 4', 'mRS 5', 'mRS 6'],
            series: series,
            title: 'mRS Distribution by Common OR (Proportional Odds Shift)',
            yLabel: 'Proportion (%)',
            width: 700,
            height: 350,
            stacked: false
        });
    }

    // ================================================================
    // METHODS TEXT
    // ================================================================

    function generateMethodsText(type, val, lo, hi, p0, main, ciLow, ciHigh, nntDisplay, nntType, nntCIStr) {
        var measureName = { or: 'odds ratio', rr: 'relative risk', rd: 'risk difference', d: 'Cohen\'s d', g: 'Hedge\'s g', lnor: 'log(OR)', lnrr: 'log(RR)' };

        var ciStr = '';
        if (ciLow && ciHigh) {
            ciStr = ' (95% CI: ' + lo + ' to ' + hi + ')';
        }

        var text = 'The reported ' + (measureName[type] || type) + ' was ' + val + ciStr + '. ';
        text += 'Using standard conversion formulas (Chinn 2000; Zhang & Yu 1998) with an assumed baseline risk of '
            + (p0 * 100).toFixed(1) + '%, this corresponds to: ';
        text += 'OR ' + main.or.toFixed(2);
        if (ciLow && ciHigh) {
            text += ' (' + Math.min(ciLow.or, ciHigh.or).toFixed(2) + '-' + Math.max(ciLow.or, ciHigh.or).toFixed(2) + ')';
        }
        text += ', RR ' + main.rr.toFixed(2);
        if (ciLow && ciHigh) {
            text += ' (' + Math.min(ciLow.rr, ciHigh.rr).toFixed(2) + '-' + Math.max(ciLow.rr, ciHigh.rr).toFixed(2) + ')';
        }
        text += ', RD ' + (main.rd * 100).toFixed(2) + '%';
        text += ', Cohen\'s d = ' + main.d.toFixed(2) + ' (' + cohenLabel(main.d) + ')';
        text += ', Hedge\'s g = ' + main.g.toFixed(2) + '. ';
        text += 'The derived ' + nntType + ' was ' + nntDisplay;
        if (nntCIStr) text += ' (' + nntCIStr + ')';
        text += '.';

        return text;
    }

    // ================================================================
    // COPY ALL
    // ================================================================

    function copyAll() {
        if (!window._esCurrentRows || window._esCurrentRows.length === 0) {
            Export.showToast('No results to copy', 'error');
            return;
        }
        var nnt = window._esNNT;
        var lines = ['=== Effect Size Conversions ==='].concat(window._esCurrentRows);
        if (nnt) {
            lines.push(nnt.type + ': ' + nnt.display + (nnt.ciStr ? ' (' + nnt.ciStr + ')' : ''));
            lines.push('Risk Difference: ' + (nnt.rd * 100).toFixed(2) + '%');
        }
        Export.copyText(lines.join('\n'));
    }

    // ================================================================
    // REGISTER
    // ================================================================

    App.registerModule(MODULE_ID, { render: render });

    window.EffectSizeModule = {
        onMeasureChange: onMeasureChange,
        convert: convert,
        copyAll: copyAll,
        switchTab: switchTab,
        drawOverlap: drawOverlap,
        drawForestPlot: drawForestPlot
    };
})();
