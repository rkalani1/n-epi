/**
 * Neuro-Epi — Epidemiological Measures & Concepts
 * Interactive reference and calculators for epidemiological measures and fundamental concepts.
 * Disease frequency, measures of association, impact measures, screening, study validity,
 * 2x2 association calculator (RR, OR, RD, PAF, NNT), standardization calculator,
 * life table calculator, epidemic curve builder, and disease burden metrics (YLL, YLD, DALY).
 */
(function() {
    'use strict';

    const MODULE_ID = 'epi-concepts';

    // ================================================================
    // RENDER
    // ================================================================
    function render(container) {
        var html = App.createModuleLayout(
            'Epidemiological Measures & Concepts',
            'Interactive reference for epidemiological measures with built-in calculators. Covers disease frequency, association, impact, screening, validity, standardization, life tables, epidemic curves, and disease burden metrics.'
        );

        // ===== LEARN SECTION =====
        html += '<div class="card" style="background: var(--bg-secondary); border-left: 4px solid var(--accent-color);">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\')">&#x25B6; Learn &amp; Reference <span style="font-size:0.8em; color: var(--text-muted);">(click to expand)</span></div>';
        html += '<div class="learn-body hidden">';

        html += '<div class="card-subtitle" style="font-weight:600;">Core Formulas</div>';
        html += '<div style="background:var(--bg-tertiary);padding:12px;border-radius:8px;font-size:0.9rem;line-height:1.8;margin-bottom:12px;">'
            + '<div><strong>Prevalence</strong> = Number of existing cases / Total population</div>'
            + '<div><strong>Incidence Rate</strong> = Number of new events / Total person-time at risk</div>'
            + '<div><strong>Risk (Cumulative Incidence)</strong> = Number of new events / Number of persons at risk</div>'
            + '<div><strong>Odds</strong> = p / (1 &minus; p)</div>'
            + '<div><strong>Risk Ratio (RR)</strong> = Risk in exposed / Risk in unexposed</div>'
            + '<div><strong>Odds Ratio (OR)</strong> = (a &times; d) / (b &times; c) from 2&times;2 table</div>'
            + '<div><strong>Risk Difference (RD)</strong> = Risk in exposed &minus; Risk in unexposed</div>'
            + '</div>';

        html += '<div class="card-subtitle" style="font-weight:600;">Key Relationships</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Prevalence &asymp; Incidence &times; Duration</strong> (valid when disease is rare and prevalence is in steady state)</li>'
            + '<li><strong>OR &asymp; RR</strong> when the outcome is rare (&lt;10%) &mdash; the rare disease assumption</li>'
            + '<li><strong>PAF = P<sub>e</sub>(RR&minus;1) / [P<sub>e</sub>(RR&minus;1) + 1]</strong> &mdash; Population Attributable Fraction</li>'
            + '<li><strong>NNT = 1 / ARD</strong> &mdash; Number Needed to Treat is the reciprocal of the absolute risk difference</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Standardization</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Direct standardization:</strong> Apply age-specific rates from your population to a standard population age structure. Use when you have complete age-specific rates.</li>'
            + '<li><strong>Indirect standardization:</strong> Apply standard population rates to your population age structure. Produces SMR (Standardized Mortality Ratio). Use when age-specific rates are unstable (small numbers).</li>'
            + '<li><strong>SMR = Observed / Expected</strong>: SMR > 1 means higher mortality than the standard; SMR < 1 means lower.</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Disease Burden Metrics</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>YLL (Years of Life Lost):</strong> Life expectancy at age of death &times; number of deaths</li>'
            + '<li><strong>YLD (Years Lived with Disability):</strong> Prevalence &times; disability weight &times; duration</li>'
            + '<li><strong>DALY = YLL + YLD:</strong> 1 DALY = 1 year of healthy life lost</li>'
            + '<li><strong>Disability weights:</strong> Range 0 (perfect health) to 1 (death); from GBD study</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Common Pitfalls</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Confusing incidence with prevalence:</strong> Incidence = new cases; prevalence = all existing cases</li>'
            + '<li><strong>Misinterpreting rate vs. risk:</strong> A rate uses person-time denominator; risk uses persons at risk</li>'
            + '<li><strong>Simpson\'s paradox:</strong> A trend in subgroups reverses when combined, due to confounding</li>'
            + '<li><strong>Inappropriate OR interpretation:</strong> OR should not be interpreted as RR when outcome is common</li>'
            + '<li><strong>Crude vs. adjusted rates:</strong> Crude rates can be misleading for comparisons; always standardize when comparing populations with different age structures</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px; font-size:0.85rem; line-height:1.7;">'
            + '<li>Porta M, ed. <em>A Dictionary of Epidemiology</em>, 6th ed. Oxford University Press, 2014.</li>'
            + '<li>Rothman KJ. <em>Epidemiology: An Introduction</em>, 2nd ed. Oxford University Press, 2012.</li>'
            + '<li>Murray CJ, Lopez AD. <em>The Global Burden of Disease</em>. WHO, 1996.</li>'
            + '<li>GBD 2019 Diseases and Injuries Collaborators. <em>Lancet</em>. 2020;396:1204-1222.</li>'
            + '</ul>';

        html += '</div></div>';

        // Card 1: Measures of Disease Frequency
        html += renderDiseaseFrequency();

        // Card 2: 2x2 Table Association Calculator
        html += renderAssociation();

        // Card 3: Measures of Impact
        html += renderImpact();

        // Card 4: Standardization Calculator
        html += renderStandardization();

        // Card 5: Life Table Calculator
        html += renderLifeTable();

        // Card 6: Epidemic Curve Builder
        html += renderEpiCurve();

        // Card 7: Disease Burden Metrics (YLL, YLD, DALY)
        html += renderDALY();

        // Card 8: Screening Concepts
        html += renderScreening();

        // Card 9: Study Validity Concepts
        html += renderValidity();

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    // ================================================================
    // CARD 1: Measures of Disease Frequency
    // ================================================================
    function renderDiseaseFrequency() {
        var html = '<div class="card">';
        html += '<div class="card-title">Measures of Disease Frequency</div>';
        html += '<div class="card-subtitle">Interactive calculators for common measures of disease occurrence.</div>';

        // Incidence Rate
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Incidence Rate (Person-Time)</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;"><strong>Formula:</strong> IR = New cases / Person-time at risk</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">New Cases</label><input type="number" class="form-input" id="df-ir-cases" min="0" step="1" value="50"></div>';
        html += '<div class="form-group"><label class="form-label">Person-Time at Risk</label><input type="number" class="form-input" id="df-ir-pt" min="0.01" step="0.01" value="10000"></div>';
        html += '<div class="form-group"><label class="form-label">Multiplier</label><select class="form-select" id="df-ir-mult"><option value="1">Per 1</option><option value="100">Per 100</option><option value="1000" selected>Per 1,000</option><option value="10000">Per 10,000</option><option value="100000">Per 100,000</option></select></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcIR()">Calculate</button></div>';
        html += '<div id="df-ir-result" class="mt-1"></div></div>';

        // Cumulative Incidence
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Cumulative Incidence (Risk)</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;"><strong>Formula:</strong> CI = New cases / Population at risk at start</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">New Cases</label><input type="number" class="form-input" id="df-ci-cases" min="0" step="1" value="50"></div>';
        html += '<div class="form-group"><label class="form-label">Population at Risk</label><input type="number" class="form-input" id="df-ci-pop" min="1" step="1" value="5000"></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcCI()">Calculate</button></div>';
        html += '<div id="df-ci-result" class="mt-1"></div></div>';

        // Point Prevalence
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Point Prevalence</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;"><strong>Formula:</strong> PP = Existing cases / Total population</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Existing Cases</label><input type="number" class="form-input" id="df-pp-cases" min="0" step="1" value="200"></div>';
        html += '<div class="form-group"><label class="form-label">Total Population</label><input type="number" class="form-input" id="df-pp-pop" min="1" step="1" value="10000"></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcPP()">Calculate</button></div>';
        html += '<div id="df-pp-result" class="mt-1"></div></div>';

        // Mortality Rate
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Mortality Rate</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;"><strong>Formula:</strong> MR = Deaths / Population</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Deaths</label><input type="number" class="form-input" id="df-mr-deaths" min="0" step="1" value="150"></div>';
        html += '<div class="form-group"><label class="form-label">Population</label><input type="number" class="form-input" id="df-mr-pop" min="1" step="1" value="100000"></div>';
        html += '<div class="form-group"><label class="form-label">Multiplier</label><select class="form-select" id="df-mr-mult"><option value="1000">Per 1,000</option><option value="10000">Per 10,000</option><option value="100000" selected>Per 100,000</option></select></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcMR()">Calculate</button></div>';
        html += '<div id="df-mr-result" class="mt-1"></div></div>';

        // Case Fatality Rate
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Case Fatality Rate (CFR)</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;"><strong>Formula:</strong> CFR = Deaths from disease / Total cases</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Deaths from Disease</label><input type="number" class="form-input" id="df-cfr-deaths" min="0" step="1" value="5"></div>';
        html += '<div class="form-group"><label class="form-label">Total Cases</label><input type="number" class="form-input" id="df-cfr-cases" min="1" step="1" value="50"></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcCFR()">Calculate</button></div>';
        html += '<div id="df-cfr-result" class="mt-1"></div></div>';

        // Period Prevalence
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Period Prevalence</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Formula:</strong> PP = (Existing cases at start + New cases during period) / Average population during period</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Existing Cases at Start</label>'
            + '<input type="number" class="form-input" id="df-perp-existing" min="0" step="1" value="200"></div>';
        html += '<div class="form-group"><label class="form-label">New Cases During Period</label>'
            + '<input type="number" class="form-input" id="df-perp-new" min="0" step="1" value="50"></div>';
        html += '<div class="form-group"><label class="form-label">Average Population</label>'
            + '<input type="number" class="form-input" id="df-perp-pop" min="1" step="1" value="10000"></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcPerP()">Calculate</button></div>';
        html += '<div id="df-perp-result" class="mt-1"></div></div>';

        // Attack Rate
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Attack Rate (Outbreak Context)</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Formula:</strong> AR = Number of new cases during outbreak / Population at risk at start. '
            + 'Also called <em>cumulative incidence</em> in outbreak settings. Can calculate food-specific attack rates to identify the source.</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Cases (ate food)</label>'
            + '<input type="number" class="form-input" id="df-ar-cases-exp" min="0" step="1" value="30"></div>';
        html += '<div class="form-group"><label class="form-label">Total Who Ate Food</label>'
            + '<input type="number" class="form-input" id="df-ar-total-exp" min="1" step="1" value="50"></div>';
        html += '<div class="form-group"><label class="form-label">&nbsp;</label>'
            + '<div style="font-size:0.85rem;color:var(--text-tertiary);padding-top:6px;">AR among exposed</div></div>';
        html += '</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Cases (did NOT eat food)</label>'
            + '<input type="number" class="form-input" id="df-ar-cases-unexp" min="0" step="1" value="5"></div>';
        html += '<div class="form-group"><label class="form-label">Total Who Did NOT Eat</label>'
            + '<input type="number" class="form-input" id="df-ar-total-unexp" min="1" step="1" value="50"></div>';
        html += '<div class="form-group"><label class="form-label">&nbsp;</label>'
            + '<div style="font-size:0.85rem;color:var(--text-tertiary);padding-top:6px;">AR among unexposed</div></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcAR()">Calculate Attack Rates</button></div>';
        html += '<div id="df-ar-result" class="mt-1"></div></div>';

        // Proportional Mortality Ratio
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Proportional Mortality Ratio (PMR)</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Formula:</strong> PMR = Deaths from specific cause / Total deaths x 100. '
            + 'Note: PMR does not measure risk; it reflects the relative importance of a cause of death.</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Deaths from Specific Cause</label>'
            + '<input type="number" class="form-input" id="df-pmr-cause" min="0" step="1" value="200"></div>';
        html += '<div class="form-group"><label class="form-label">Total Deaths (all causes)</label>'
            + '<input type="number" class="form-input" id="df-pmr-total" min="1" step="1" value="2000"></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcPMR()">Calculate</button></div>';
        html += '<div id="df-pmr-result" class="mt-1"></div></div>';

        // Rate ratio and Rate difference
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Rate Ratio &amp; Rate Difference</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Rate Ratio</strong> = IR<sub>exposed</sub> / IR<sub>unexposed</sub>. '
            + '<strong>Rate Difference</strong> = IR<sub>exposed</sub> - IR<sub>unexposed</sub>. '
            + 'Enter incidence rates per same unit of person-time.</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Incidence Rate in Exposed</label>'
            + '<input type="number" class="form-input" id="df-rr-ir-exp" min="0" step="0.01" value="5.0"></div>';
        html += '<div class="form-group"><label class="form-label">Incidence Rate in Unexposed</label>'
            + '<input type="number" class="form-input" id="df-rr-ir-unexp" min="0.001" step="0.01" value="2.0"></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcRateRatio()">Calculate</button></div>';
        html += '<div id="df-rr-result" class="mt-1"></div></div>';

        html += '</div>';
        return html;
    }

    // Disease frequency calculators
    function calcIR() {
        var cases = parseFloat(document.getElementById('df-ir-cases').value);
        var pt = parseFloat(document.getElementById('df-ir-pt').value);
        var mult = parseFloat(document.getElementById('df-ir-mult').value);
        if (isNaN(cases) || isNaN(pt) || pt <= 0) return;
        var ir = (cases / pt) * mult;
        var html = '<div class="result-panel"><div class="result-value">' + ir.toFixed(2) + '<div class="result-label">per ' + mult.toLocaleString() + ' person-time</div></div>'
            + '<div class="result-detail">IR = ' + cases + ' / ' + pt.toLocaleString() + ' = ' + (cases / pt).toExponential(4) + ' per person-time (' + ir.toFixed(2) + ' per ' + mult.toLocaleString() + ')</div></div>';
        App.setTrustedHTML(document.getElementById('df-ir-result'), html);
    }

    function calcCI() {
        var cases = parseFloat(document.getElementById('df-ci-cases').value);
        var pop = parseFloat(document.getElementById('df-ci-pop').value);
        if (isNaN(cases) || isNaN(pop) || pop <= 0) return;
        var ci = cases / pop;
        var html = '<div class="result-panel"><div class="result-value">' + (ci * 100).toFixed(2) + '%<div class="result-label">Cumulative Incidence</div></div>'
            + '<div class="result-detail">Risk = ' + cases + ' / ' + pop.toLocaleString() + ' = ' + ci.toFixed(4) + ' (' + (ci * 100).toFixed(2) + '%)</div></div>';
        App.setTrustedHTML(document.getElementById('df-ci-result'), html);
    }

    function calcPP() {
        var cases = parseFloat(document.getElementById('df-pp-cases').value);
        var pop = parseFloat(document.getElementById('df-pp-pop').value);
        if (isNaN(cases) || isNaN(pop) || pop <= 0) return;
        var pp = cases / pop;
        var html = '<div class="result-panel"><div class="result-value">' + (pp * 100).toFixed(2) + '%<div class="result-label">Point Prevalence</div></div>'
            + '<div class="result-detail">Prevalence = ' + cases + ' / ' + pop.toLocaleString() + ' = ' + pp.toFixed(4) + ' (' + (pp * 100).toFixed(2) + '%)</div></div>';
        App.setTrustedHTML(document.getElementById('df-pp-result'), html);
    }

    function calcMR() {
        var deaths = parseFloat(document.getElementById('df-mr-deaths').value);
        var pop = parseFloat(document.getElementById('df-mr-pop').value);
        var mult = parseFloat(document.getElementById('df-mr-mult').value);
        if (isNaN(deaths) || isNaN(pop) || pop <= 0) return;
        var mr = (deaths / pop) * mult;
        var html = '<div class="result-panel"><div class="result-value">' + mr.toFixed(2) + '<div class="result-label">per ' + mult.toLocaleString() + '</div></div>'
            + '<div class="result-detail">MR = ' + deaths + ' / ' + pop.toLocaleString() + ' = ' + mr.toFixed(2) + ' per ' + mult.toLocaleString() + '</div></div>';
        App.setTrustedHTML(document.getElementById('df-mr-result'), html);
    }

    function calcCFR() {
        var deaths = parseFloat(document.getElementById('df-cfr-deaths').value);
        var cases = parseFloat(document.getElementById('df-cfr-cases').value);
        if (isNaN(deaths) || isNaN(cases) || cases <= 0) return;
        var cfr = (deaths / cases) * 100;
        var html = '<div class="result-panel"><div class="result-value">' + cfr.toFixed(1) + '%<div class="result-label">Case Fatality Rate</div></div>'
            + '<div class="result-detail">CFR = ' + deaths + ' / ' + cases + ' = ' + cfr.toFixed(1) + '%</div></div>';
        App.setTrustedHTML(document.getElementById('df-cfr-result'), html);
    }

    function calcPerP() {
        var existing = parseFloat(document.getElementById('df-perp-existing').value);
        var newCases = parseFloat(document.getElementById('df-perp-new').value);
        var pop = parseFloat(document.getElementById('df-perp-pop').value);
        if (isNaN(existing) || isNaN(newCases) || isNaN(pop) || pop <= 0) return;
        var pp = (existing + newCases) / pop;
        var html = '<div class="result-panel">';
        html += '<div class="result-value">' + (pp * 100).toFixed(2) + '%<div class="result-label">Period Prevalence</div></div>';
        html += '<div class="result-detail">Period Prevalence = (' + existing + ' + ' + newCases + ') / ' + pop.toLocaleString()
            + ' = ' + pp.toFixed(4) + ' (' + (pp * 100).toFixed(2) + '%)';
        html += '<br>Note: Period prevalence includes prevalent cases at the start plus incident cases during the time period. '
            + 'It is always &ge; point prevalence.</div></div>';
        App.setTrustedHTML(document.getElementById('df-perp-result'), html);
    }

    function calcAR() {
        var casesExp = parseFloat(document.getElementById('df-ar-cases-exp').value);
        var totalExp = parseFloat(document.getElementById('df-ar-total-exp').value);
        var casesUnexp = parseFloat(document.getElementById('df-ar-cases-unexp').value);
        var totalUnexp = parseFloat(document.getElementById('df-ar-total-unexp').value);
        if (isNaN(casesExp) || isNaN(totalExp) || totalExp <= 0 ||
            isNaN(casesUnexp) || isNaN(totalUnexp) || totalUnexp <= 0) return;

        var arExp = (casesExp / totalExp) * 100;
        var arUnexp = (casesUnexp / totalUnexp) * 100;
        var rr = arExp / arUnexp;
        var arDiff = arExp - arUnexp;
        var totalAR = ((casesExp + casesUnexp) / (totalExp + totalUnexp)) * 100;

        var html = '<div class="result-panel">';
        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + arExp.toFixed(1) + '%</div><div class="result-item-label">AR (Exposed)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + arUnexp.toFixed(1) + '%</div><div class="result-item-label">AR (Unexposed)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + totalAR.toFixed(1) + '%</div><div class="result-item-label">Total AR</div></div>'
            + '</div>';
        html += '<div class="result-grid mt-1">'
            + '<div class="result-item"><div class="result-item-value">' + rr.toFixed(2) + '</div><div class="result-item-label">Risk Ratio</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + arDiff.toFixed(1) + ' pp</div><div class="result-item-label">AR Difference</div></div>'
            + '</div>';
        html += '<div class="result-detail mt-1">';
        if (rr > 2) {
            html += 'The attack rate in exposed is ' + rr.toFixed(1) + 'x higher than unexposed, strongly suggesting this food as the vehicle.';
        } else if (rr > 1.5) {
            html += 'Moderate elevation in exposed (RR = ' + rr.toFixed(2) + '). Suggestive but not definitive.';
        } else {
            html += 'Little difference between groups (RR = ' + rr.toFixed(2) + '). Unlikely to be the vehicle.';
        }
        html += '</div></div>';
        App.setTrustedHTML(document.getElementById('df-ar-result'), html);
    }

    function calcPMR() {
        var causeDeath = parseFloat(document.getElementById('df-pmr-cause').value);
        var totalDeaths = parseFloat(document.getElementById('df-pmr-total').value);
        if (isNaN(causeDeath) || isNaN(totalDeaths) || totalDeaths <= 0) return;
        var pmr = (causeDeath / totalDeaths) * 100;
        var html = '<div class="result-panel">';
        html += '<div class="result-value">' + pmr.toFixed(1) + '%<div class="result-label">Proportional Mortality Ratio</div></div>';
        html += '<div class="result-detail">PMR = ' + causeDeath + ' / ' + totalDeaths.toLocaleString()
            + ' x 100 = ' + pmr.toFixed(1) + '%';
        html += '<br><strong>Interpretation:</strong> ' + pmr.toFixed(1) + '% of all deaths were due to this specific cause.';
        html += '<br><strong>Caution:</strong> PMR is not a measure of risk. A high PMR can occur because '
            + 'the specific cause is truly more common OR because other causes of death are less common.</div></div>';
        App.setTrustedHTML(document.getElementById('df-pmr-result'), html);
    }

    function calcRateRatio() {
        var irExp = parseFloat(document.getElementById('df-rr-ir-exp').value);
        var irUnexp = parseFloat(document.getElementById('df-rr-ir-unexp').value);
        if (isNaN(irExp) || isNaN(irUnexp) || irUnexp <= 0) return;

        var rateRatio = irExp / irUnexp;
        var rateDiff = irExp - irUnexp;
        var lnRR = Math.log(rateRatio);
        // Approximate SE when individual-level data not available
        var afe = (rateRatio - 1) / rateRatio;

        var html = '<div class="result-panel">';
        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + rateRatio.toFixed(3) + '</div><div class="result-item-label">Rate Ratio (IRR)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + rateDiff.toFixed(3) + '</div><div class="result-item-label">Rate Difference</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (afe * 100).toFixed(1) + '%</div><div class="result-item-label">AFe</div></div>'
            + '</div>';
        html += '<div class="result-detail mt-1">';
        if (rateRatio > 1) {
            html += 'The exposed group has a ' + rateRatio.toFixed(2) + '-fold higher rate. '
                + 'The excess rate in exposed is ' + rateDiff.toFixed(2) + ' per unit person-time.';
        } else if (rateRatio < 1) {
            html += 'The exposed group has ' + ((1 - rateRatio) * 100).toFixed(0) + '% lower rate (protective exposure). '
                + 'Rate difference = ' + rateDiff.toFixed(2) + ' per unit person-time.';
        } else {
            html += 'No difference between groups.';
        }
        html += '</div></div>';
        App.setTrustedHTML(document.getElementById('df-rr-result'), html);
    }

    // ================================================================
    // CARD 2: Measures of Association (2x2 Table)
    // ================================================================
    function renderAssociation() {
        var html = '<div class="card">';
        html += '<div class="card-title">Measures of Association (2x2 Table)</div>';
        html += '<div class="card-subtitle">Calculate RR, OR, RD, PAF, and NNT from a 2x2 contingency table.</div>';

        html += '<div style="max-width:520px;margin:0 auto 16px;">';
        html += '<div class="table-scroll-wrap"><table class="data-table" style="text-align:center;">';
        html += '<thead><tr><th></th><th colspan="2" style="text-align:center;">Outcome</th><th></th></tr>'
            + '<tr><th>Exposure</th><th style="text-align:center;">Disease+ (D+)</th><th style="text-align:center;">Disease- (D-)</th><th style="text-align:center;">Total</th></tr></thead>';
        html += '<tbody>'
            + '<tr><td style="font-weight:600;">Exposed (E+)</td>'
            + '<td><input type="number" class="form-input" id="assoc-a" min="0" step="1" value="30" style="width:80px;margin:0 auto;text-align:center;"></td>'
            + '<td><input type="number" class="form-input" id="assoc-b" min="0" step="1" value="70" style="width:80px;margin:0 auto;text-align:center;"></td>'
            + '<td id="assoc-m1" style="font-weight:600;">100</td></tr>'
            + '<tr><td style="font-weight:600;">Unexposed (E-)</td>'
            + '<td><input type="number" class="form-input" id="assoc-c" min="0" step="1" value="10" style="width:80px;margin:0 auto;text-align:center;"></td>'
            + '<td><input type="number" class="form-input" id="assoc-d" min="0" step="1" value="90" style="width:80px;margin:0 auto;text-align:center;"></td>'
            + '<td id="assoc-m0" style="font-weight:600;">100</td></tr>'
            + '<tr><td style="font-weight:600;">Total</td>'
            + '<td id="assoc-n1" style="font-weight:600;">40</td>'
            + '<td id="assoc-n0" style="font-weight:600;">160</td>'
            + '<td id="assoc-n" style="font-weight:600;">200</td></tr></tbody></table></div>';
        html += '</div>';

        html += '<div class="btn-group" style="justify-content:center;">'
            + '<button class="btn btn-primary" onclick="EpiConcepts.calcAssociation()">Calculate All</button>'
            + '<button class="btn btn-secondary" onclick="EpiConcepts.copyAssociation()">Copy Results</button></div>';

        html += '<div id="assoc-results" class="mt-2"></div>';
        html += '</div>';
        return html;
    }

    function calcAssociation() {
        var a = parseFloat(document.getElementById('assoc-a').value) || 0;
        var b = parseFloat(document.getElementById('assoc-b').value) || 0;
        var c = parseFloat(document.getElementById('assoc-c').value) || 0;
        var d = parseFloat(document.getElementById('assoc-d').value) || 0;

        var m1 = a + b, m0 = c + d, n1 = a + c, n0 = b + d, n = a + b + c + d;

        App.setTrustedHTML(document.getElementById('assoc-m1'), m1.toString());
        App.setTrustedHTML(document.getElementById('assoc-m0'), m0.toString());
        App.setTrustedHTML(document.getElementById('assoc-n1'), n1.toString());
        App.setTrustedHTML(document.getElementById('assoc-n0'), n0.toString());
        App.setTrustedHTML(document.getElementById('assoc-n'), n.toString());

        if (n === 0 || m1 === 0 || m0 === 0) {
            App.setTrustedHTML(document.getElementById('assoc-results'), '<div class="result-panel" style="color:var(--danger);">Please enter valid cell counts.</div>');
            return;
        }

        var riskE = a / m1, riskU = c / m0;
        var rr = riskE / riskU;
        var lnRR = Math.log(rr);
        var seRR = Math.sqrt((1 / a) - (1 / m1) + (1 / c) - (1 / m0));
        var rrLo = Math.exp(lnRR - 1.96 * seRR), rrHi = Math.exp(lnRR + 1.96 * seRR);

        var or_val = (a * d) / (b * c);
        var lnOR = Math.log(or_val);
        var seOR = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d);
        var orLo = Math.exp(lnOR - 1.96 * seOR), orHi = Math.exp(lnOR + 1.96 * seOR);

        var rd = riskE - riskU;
        var seRD = Math.sqrt((riskE * (1 - riskE)) / m1 + (riskU * (1 - riskU)) / m0);
        var rdLo = rd - 1.96 * seRD, rdHi = rd + 1.96 * seRD;

        var arp = ((rr - 1) / rr) * 100;
        var pE = m1 / n;
        var par = (pE * (rr - 1)) / (1 + pE * (rr - 1));
        var paf = par * 100;
        var nnt = Math.abs(1 / rd);

        var html = '<div class="result-panel">';
        html += '<div class="card-title">Association Measures</div>';
        html += '<div class="table-container"><table class="data-table">';
        html += '<thead><tr><th>Measure</th><th>Value</th><th>95% CI</th><th>Interpretation</th></tr></thead><tbody>';

        html += '<tr><td><strong>Risk Ratio (RR)</strong></td><td>' + rr.toFixed(3) + '</td><td>' + rrLo.toFixed(3) + ' - ' + rrHi.toFixed(3) + '</td><td>' + interpretRR(rr) + '</td></tr>';
        html += '<tr><td><strong>Odds Ratio (OR)</strong></td><td>' + or_val.toFixed(3) + '</td><td>' + orLo.toFixed(3) + ' - ' + orHi.toFixed(3) + '</td><td>' + interpretOR(or_val) + '</td></tr>';
        html += '<tr><td><strong>Risk Difference (RD)</strong></td><td>' + rd.toFixed(4) + '</td><td>' + rdLo.toFixed(4) + ' - ' + rdHi.toFixed(4) + '</td><td>' + interpretRD(rd) + '</td></tr>';
        html += '<tr><td><strong>AR% (Attributable Risk %)</strong></td><td>' + arp.toFixed(1) + '%</td><td>-</td><td>' + arp.toFixed(1) + '% of cases in exposed attributable to exposure</td></tr>';
        html += '<tr><td><strong>PAF (Pop. Attr. Fraction)</strong></td><td>' + paf.toFixed(1) + '%</td><td>-</td><td>' + paf.toFixed(1) + '% of population disease attributable to exposure</td></tr>';

        var nntLabel = rd > 0 ? 'NNH (Number Needed to Harm)' : 'NNT (Number Needed to Treat)';
        html += '<tr><td><strong>' + nntLabel + '</strong></td><td>' + (isFinite(nnt) ? Math.ceil(nnt) : 'N/A') + '</td><td>-</td>'
            + '<td>' + (isFinite(nnt) ? (rd > 0 ? 'For every ' + Math.ceil(nnt) + ' exposed, 1 additional case' : 'Treat ' + Math.ceil(nnt) + ' to prevent 1 case') : 'No difference') + '</td></tr>';

        html += '</tbody></table></div>';
        html += '<div style="margin-top:12px;font-size:0.8rem;color:var(--text-tertiary);">95% CIs via Wald method (log-transformed for RR/OR). For small counts, use exact methods.</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="EpiConcepts.copyAssociation()">Copy Results</button>'
            + ' <button class="btn btn-xs r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.epiTwoByTwo({a:' + a + ',b:' + b + ',c:' + c + ',d:' + d + '}), &quot;2x2 Table Analysis&quot;)">'
            + '&#129513; R Script</button></div>';

        html += '</div>';
        App.setTrustedHTML(document.getElementById('assoc-results'), html);
    }

    function interpretRR(rr) {
        if (rr > 1) return 'Exposed group has ' + rr.toFixed(2) + 'x the risk (increased risk).';
        if (rr < 1) return 'Exposed group has ' + (rr * 100).toFixed(0) + '% the risk (protective).';
        return 'No association (RR = 1).';
    }
    function interpretOR(or_val) {
        if (or_val > 1) return 'Odds ' + or_val.toFixed(2) + 'x higher in exposed.';
        if (or_val < 1) return 'Odds ' + ((1 - or_val) * 100).toFixed(0) + '% lower in exposed (protective).';
        return 'No association (OR = 1).';
    }
    function interpretRD(rd) {
        if (rd > 0) return 'Absolute ' + (rd * 100).toFixed(1) + ' pp higher risk in exposed.';
        if (rd < 0) return 'Absolute ' + (Math.abs(rd) * 100).toFixed(1) + ' pp lower risk in exposed.';
        return 'No difference in risk.';
    }

    function copyAssociation() {
        var el = document.getElementById('assoc-results');
        if (el) Export.copyText(el.textContent);
    }

    // ================================================================
    // CARD 3: Measures of Impact
    // ================================================================
    function renderImpact() {
        var html = '<div class="card">';
        html += '<div class="card-title">Measures of Impact</div>';
        html += '<div class="card-subtitle">Population-level measures for quantifying disease burden and intervention impact.</div>';

        // Quick impact calculator
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:12px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:8px;">Quick Impact Calculator</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Relative Risk (RR)</label><input type="number" class="form-input" id="impact-rr" min="0.01" step="0.01" value="2.5"></div>';
        html += '<div class="form-group"><label class="form-label">Prevalence of Exposure (Pe)</label><input type="number" class="form-input" id="impact-pe" min="0" max="1" step="0.01" value="0.25"></div>';
        html += '<div class="form-group"><label class="form-label">&nbsp;</label><button class="btn btn-primary" onclick="EpiConcepts.calcImpact()">Calculate</button></div>';
        html += '</div>';
        html += '<div id="impact-results"></div></div>';

        // Reference table
        var measures = [
            { name: 'AFe (Attributable Fraction Exposed)', formula: 'AFe = (RR - 1) / RR', desc: 'Proportion of disease in exposed due to exposure' },
            { name: 'AFp / PAF (Population Attributable Fraction)', formula: 'AFp = Pe(RR-1) / [1 + Pe(RR-1)]', desc: 'Proportion of total disease attributable to exposure' },
            { name: 'Prevented Fraction (PF)', formula: 'PF = 1 - RR (when RR < 1)', desc: 'Proportion of potential cases prevented by protective exposure' },
            { name: 'NNT (Number Needed to Treat)', formula: 'NNT = 1 / |ARD|', desc: 'Number to treat to prevent 1 adverse outcome' }
        ];
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Measure</th><th>Formula</th><th>Interpretation</th></tr></thead><tbody>';
        measures.forEach(function(m) {
            html += '<tr><td><strong>' + m.name + '</strong></td><td><code>' + m.formula + '</code></td><td style="font-size:0.85rem">' + m.desc + '</td></tr>';
        });
        html += '</tbody></table></div>';
        html += '</div>';
        return html;
    }

    function calcImpact() {
        var rr = parseFloat(document.getElementById('impact-rr').value);
        var pe = parseFloat(document.getElementById('impact-pe').value);
        if (isNaN(rr) || isNaN(pe) || rr <= 0) return;

        var afe = (rr - 1) / rr;
        var afp = (pe * (rr - 1)) / (1 + pe * (rr - 1));
        var pf = 1 - rr;

        var html = '<div class="result-panel mt-1"><div class="form-row form-row--3">';
        html += '<div><div class="result-value">' + (afe * 100).toFixed(1) + '%<div class="result-label">AFe</div></div></div>';
        html += '<div><div class="result-value">' + (afp * 100).toFixed(1) + '%<div class="result-label">AFp / PAF</div></div></div>';
        html += '<div><div class="result-value">' + (rr < 1 ? (pf * 100).toFixed(1) + '%' : 'N/A') + '<div class="result-label">PF (requires RR &lt; 1)</div></div></div>';
        html += '</div>';
        html += '<div class="result-detail mt-1">';
        if (rr > 1) html += 'Among exposed, ' + (afe * 100).toFixed(1) + '% attributable to exposure. In population, ' + (afp * 100).toFixed(1) + '% preventable by eliminating exposure.';
        else if (rr < 1) html += 'Protective exposure prevents ' + (pf * 100).toFixed(1) + '% of potential cases.';
        else html += 'RR = 1: no association.';
        html += '</div></div>';
        App.setTrustedHTML(document.getElementById('impact-results'), html);
    }

    // ================================================================
    // CARD 4: Standardization Calculator
    // ================================================================
    function renderStandardization() {
        var html = '<div class="card">';
        html += '<div class="card-title">Age Standardization Calculator</div>';
        html += '<div class="card-subtitle">Calculate directly or indirectly standardized rates to compare populations with different age structures.</div>';

        // Direct Standardization
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Direct Standardization</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Method:</strong> Apply age-specific rates from your study population to a standard population. '
            + '<strong>Formula:</strong> DSR = Sum(age-specific rate x standard population in age group) / Total standard population</div>';

        html += '<p style="font-size:0.85rem;color:var(--text-secondary);margin:0 0 8px 0">Enter data for up to 5 age groups. Leave unused rows blank.</p>';

        html += '<div class="table-scroll-wrap"><table class="data-table" style="font-size:0.85rem"><thead><tr><th>Age Group</th><th>Study Deaths</th><th>Study Population</th><th>Standard Population</th></tr></thead><tbody>';
        var ageGroups = ['0-14', '15-44', '45-64', '65-74', '75+'];
        for (var i = 0; i < 5; i++) {
            html += '<tr><td>' + ageGroups[i] + '</td>'
                + '<td><input type="number" class="form-input" id="std-d-deaths-' + i + '" min="0" step="1" style="width:80px;text-align:center"></td>'
                + '<td><input type="number" class="form-input" id="std-d-pop-' + i + '" min="0" step="1" style="width:100px;text-align:center"></td>'
                + '<td><input type="number" class="form-input" id="std-d-std-' + i + '" min="0" step="1" style="width:100px;text-align:center"></td></tr>';
        }
        html += '</tbody></table></div>';
        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="EpiConcepts.calcDirectStd()">Calculate DSR</button>'
            + '<button class="btn btn-secondary" onclick="EpiConcepts.loadStdExample()">Load Example</button></div>';
        html += '<div id="std-direct-result" class="mt-1"></div>';
        html += '</div>';

        // Indirect Standardization
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Indirect Standardization (SMR)</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Method:</strong> Apply standard population rates to your study population structure. '
            + '<strong>Formula:</strong> SMR = Observed deaths / Expected deaths. Expected = Sum(standard rate x study population in age group)</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Total Observed Deaths</label>'
            + '<input type="number" class="form-input" id="std-i-obs" min="0" step="1" value="75"></div>'
            + '<div class="form-group"><label class="form-label">Total Expected Deaths</label>'
            + '<input type="number" class="form-input" id="std-i-exp" min="0.01" step="0.01" value="60"></div></div>';

        html += '<div class="btn-group mt-1"><button class="btn btn-primary" onclick="EpiConcepts.calcSMR()">Calculate SMR</button></div>';
        html += '<div id="std-smr-result" class="mt-1"></div>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    function calcDirectStd() {
        var totalExpected = 0;
        var totalStdPop = 0;
        var rows = [];

        for (var i = 0; i < 5; i++) {
            var deaths = parseFloat(document.getElementById('std-d-deaths-' + i).value);
            var pop = parseFloat(document.getElementById('std-d-pop-' + i).value);
            var stdPop = parseFloat(document.getElementById('std-d-std-' + i).value);
            if (isNaN(deaths) || isNaN(pop) || isNaN(stdPop) || pop === 0) continue;

            var rate = deaths / pop;
            var expected = rate * stdPop;
            totalExpected += expected;
            totalStdPop += stdPop;
            rows.push({ ageGroup: ['0-14', '15-44', '45-64', '65-74', '75+'][i], rate: rate, expected: expected, stdPop: stdPop });
        }

        if (rows.length === 0 || totalStdPop === 0) {
            Export.showToast('Enter data for at least one age group', 'error');
            return;
        }

        var dsr = totalExpected / totalStdPop;

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + (dsr * 100000).toFixed(1) + '<div class="result-label">Directly Standardized Rate (per 100,000)</div></div>';

        html += '<table class="data-table mt-2"><thead><tr><th>Age Group</th><th>Rate (per 100,000)</th><th>Standard Pop</th><th>Expected Deaths</th></tr></thead><tbody>';
        rows.forEach(function(r) {
            html += '<tr><td>' + r.ageGroup + '</td><td class="num">' + (r.rate * 100000).toFixed(1) + '</td><td class="num">' + r.stdPop.toLocaleString() + '</td><td class="num">' + r.expected.toFixed(1) + '</td></tr>';
        });
        html += '<tr style="font-weight:700"><td>Total</td><td>-</td><td class="num">' + totalStdPop.toLocaleString() + '</td><td class="num">' + totalExpected.toFixed(1) + '</td></tr>';
        html += '</tbody></table>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('std-direct-result'), html);
    }

    function loadStdExample() {
        var exData = [
            { deaths: 50, pop: 500000, std: 1000000 },
            { deaths: 200, pop: 1000000, std: 2000000 },
            { deaths: 500, pop: 800000, std: 1500000 },
            { deaths: 800, pop: 400000, std: 800000 },
            { deaths: 1200, pop: 200000, std: 500000 }
        ];
        for (var i = 0; i < 5; i++) {
            document.getElementById('std-d-deaths-' + i).value = exData[i].deaths;
            document.getElementById('std-d-pop-' + i).value = exData[i].pop;
            document.getElementById('std-d-std-' + i).value = exData[i].std;
        }
    }

    function calcSMR() {
        var obs = parseFloat(document.getElementById('std-i-obs').value);
        var exp = parseFloat(document.getElementById('std-i-exp').value);
        if (isNaN(obs) || isNaN(exp) || exp <= 0) return;

        var smr = obs / exp;
        var poisCI = Statistics.poissonExactCI(obs, 0.05);
        var smrLo = poisCI.lower / exp;
        var smrHi = poisCI.upper / exp;

        var interp = smr > 1 ? 'Mortality is ' + ((smr - 1) * 100).toFixed(0) + '% higher than the standard population.'
            : smr < 1 ? 'Mortality is ' + ((1 - smr) * 100).toFixed(0) + '% lower than the standard population.'
            : 'Mortality is equal to the standard population.';

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value" style="color:' + (smr > 1.2 ? 'var(--danger)' : smr < 0.8 ? 'var(--success)' : 'var(--text)') + '">' + smr.toFixed(2) + '<div class="result-label">Standardized Mortality Ratio (SMR)</div></div>';
        html += '<div class="result-detail">95% CI: ' + smrLo.toFixed(2) + ' - ' + smrHi.toFixed(2) + '<br>' + interp + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.riskSMR({observed:' + obs + ',expected:' + exp + ',alpha:0.05}), &quot;Standardized Mortality Ratio&quot;)">'
            + '&#129513; R Script</button></div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('std-smr-result'), html);
    }

    // ================================================================
    // CARD 5: Life Table Calculator
    // ================================================================
    function renderLifeTable() {
        var html = '<div class="card">';
        html += '<div class="card-title">Abridged Life Table Calculator</div>';
        html += '<div class="card-subtitle">Construct an abridged life table from age-specific mortality data. Enter the number of deaths and mid-year population for each age interval.</div>';

        html += '<p style="font-size:0.85rem;color:var(--text-secondary);margin:0 0 8px 0">Enter up to 6 age intervals. Standard life table starting with radix (l0) = 100,000.</p>';

        html += '<div class="table-scroll-wrap"><table class="data-table" style="font-size:0.85rem"><thead><tr><th>Age Interval</th><th>Deaths (dx)</th><th>Mid-Year Population</th></tr></thead><tbody>';
        var ltAges = ['0-4', '5-14', '15-44', '45-64', '65-74', '75+'];
        var ltWidths = [5, 10, 30, 20, 10, 999]; // last is open-ended
        for (var i = 0; i < 6; i++) {
            html += '<tr><td>' + ltAges[i] + '</td>'
                + '<td><input type="number" class="form-input" id="lt-deaths-' + i + '" min="0" step="1" style="width:90px;text-align:center"></td>'
                + '<td><input type="number" class="form-input" id="lt-pop-' + i + '" min="0" step="1" style="width:110px;text-align:center"></td></tr>';
        }
        html += '</tbody></table></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="EpiConcepts.calcLifeTable()">Calculate Life Table</button>'
            + '<button class="btn btn-secondary" onclick="EpiConcepts.loadLifeTableExample()">Load Example</button></div>';
        html += '<div id="lt-result" class="mt-2"></div>';
        html += '</div>';
        return html;
    }

    function loadLifeTableExample() {
        var exDeaths = [500, 200, 2000, 5000, 8000, 15000];
        var exPop = [400000, 800000, 2000000, 1500000, 600000, 300000];
        for (var i = 0; i < 6; i++) {
            document.getElementById('lt-deaths-' + i).value = exDeaths[i];
            document.getElementById('lt-pop-' + i).value = exPop[i];
        }
    }

    function calcLifeTable() {
        var ltAges = ['0-4', '5-14', '15-44', '45-64', '65-74', '75+'];
        var widths = [5, 10, 30, 20, 10, 10]; // approx for open-ended
        var radix = 100000;
        var intervals = [];

        for (var i = 0; i < 6; i++) {
            var deaths = parseFloat(document.getElementById('lt-deaths-' + i).value);
            var pop = parseFloat(document.getElementById('lt-pop-' + i).value);
            if (isNaN(deaths) || isNaN(pop) || pop === 0) continue;
            var mx = deaths / pop;
            var n = widths[i];
            var ax = (i === 0) ? 0.1 * n : 0.5 * n; // ax approximation
            var qx = (n * mx) / (1 + (n - ax) * mx);
            if (i === intervals.length && i > 0 && intervals.length > 0 && i === 5) qx = 1; // last open interval
            if (qx > 1) qx = 1;
            intervals.push({ age: ltAges[i], n: n, mx: mx, qx: qx });
        }

        if (intervals.length === 0) { Export.showToast('Enter data for at least one age interval', 'error'); return; }

        // Build life table
        var lx = radix;
        var rows = [];
        for (var j = 0; j < intervals.length; j++) {
            var iv = intervals[j];
            var dx = lx * iv.qx;
            var nLx = iv.n * (lx - dx) + (j === 0 ? 0.1 * iv.n * dx : 0.5 * iv.n * dx);
            rows.push({ age: iv.age, mx: iv.mx, qx: iv.qx, lx: lx, dx: dx, nLx: nLx });
            lx = lx - dx;
        }

        // Calculate Tx and ex (backward sum)
        var cumT = 0;
        for (var k = rows.length - 1; k >= 0; k--) {
            cumT += rows[k].nLx;
            rows[k].Tx = cumT;
            rows[k].ex = rows[k].Tx / rows[k].lx;
        }

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + rows[0].ex.toFixed(1) + ' years<div class="result-label">Life Expectancy at Birth (e0)</div></div>';

        html += '<table class="data-table mt-2"><thead><tr><th>Age</th><th>mx</th><th>qx</th><th>lx</th><th>dx</th><th>nLx</th><th>Tx</th><th>ex</th></tr></thead><tbody>';
        rows.forEach(function(r) {
            html += '<tr>'
                + '<td>' + r.age + '</td>'
                + '<td class="num">' + r.mx.toFixed(5) + '</td>'
                + '<td class="num">' + r.qx.toFixed(4) + '</td>'
                + '<td class="num">' + Math.round(r.lx).toLocaleString() + '</td>'
                + '<td class="num">' + Math.round(r.dx).toLocaleString() + '</td>'
                + '<td class="num">' + Math.round(r.nLx).toLocaleString() + '</td>'
                + '<td class="num">' + Math.round(r.Tx).toLocaleString() + '</td>'
                + '<td class="num">' + r.ex.toFixed(1) + '</td></tr>';
        });
        html += '</tbody></table>';

        html += '<div style="margin-top:8px;font-size:0.8rem;color:var(--text-tertiary)">'
            + 'mx = age-specific death rate; qx = probability of dying in interval; lx = survivors at start; dx = deaths in interval; '
            + 'nLx = person-years lived; Tx = total person-years remaining; ex = life expectancy at age x. Radix (l0) = 100,000.</div>';

        // Survivorship curve (CSS-based)
        html += '<div class="card-title mt-2">Survivorship Curve (l<sub>x</sub>)</div>';
        html += '<div style="display:flex;align-items:flex-end;gap:3px;height:120px;padding:8px 0;border-bottom:2px solid var(--border)">';
        rows.forEach(function(r, idx) {
            var height = (r.lx / radix) * 110;
            html += '<div style="flex:1;min-width:30px;background:var(--accent);height:' + height + 'px;'
                + 'border-radius:3px 3px 0 0;position:relative;" title="' + r.age + ': lx = ' + Math.round(r.lx).toLocaleString() + '">'
                + '<div style="position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:0.6rem;color:var(--text-tertiary)">'
                + Math.round(r.lx / 1000) + 'K</div></div>';
        });
        html += '</div>';
        html += '<div style="display:flex;gap:3px;padding-top:4px">';
        rows.forEach(function(r) {
            html += '<div style="flex:1;min-width:30px;text-align:center;font-size:0.6rem;color:var(--text-tertiary)">' + r.age + '</div>';
        });
        html += '</div>';

        // Key interpretations
        html += '<div style="margin-top:12px;padding:12px;background:var(--surface);border-radius:8px;border-left:3px solid var(--accent)">';
        html += '<div style="font-weight:600;margin-bottom:4px">Key Interpretations</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;line-height:1.7">';
        html += '<li>Life expectancy at birth (e<sub>0</sub>): <strong>' + rows[0].ex.toFixed(1) + ' years</strong></li>';
        if (rows.length > 1) {
            html += '<li>Probability of surviving to age ' + rows[1].age + ': <strong>' + ((rows[1].lx / radix) * 100).toFixed(1) + '%</strong></li>';
        }
        var maxQx = 0, maxQxAge = '';
        rows.forEach(function(r) { if (r.qx > maxQx) { maxQx = r.qx; maxQxAge = r.age; } });
        html += '<li>Highest mortality probability: <strong>' + (maxQx * 100).toFixed(1) + '%</strong> in age group ' + maxQxAge + '</li>';
        html += '</ul></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs r-script-btn" onclick="EpiConcepts.genRScriptLifeTable()">'
            + '&#129513; R Script</button></div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('lt-result'), html);
    }

    // ================================================================
    // CARD 6: Epidemic Curve Builder
    // ================================================================
    function renderEpiCurve() {
        var html = '<div class="card">';
        html += '<div class="card-title">Epidemic Curve Builder</div>';
        html += '<div class="card-subtitle">Enter daily case counts to generate an epidemic curve and calculate epidemic metrics. Useful for outbreak investigations.</div>';

        html += '<div class="form-group"><label class="form-label">Outbreak Name (optional)</label>'
            + '<input type="text" class="form-input" id="epi-curve-name" placeholder="e.g., Norovirus Outbreak, Building A"></div>';

        html += '<div class="form-group"><label class="form-label">Daily Case Counts (comma-separated) ' + App.tooltip('Enter the number of new cases per day, separated by commas. E.g., 1,2,5,8,12,10,7,4,2,1') + '</label>'
            + '<input type="text" class="form-input" id="epi-curve-data" value="1,2,4,7,12,15,18,14,10,7,5,3,2,1"></div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Start Date (Day 1)</label>'
            + '<input type="date" class="form-input" id="epi-curve-start" value="2025-01-01"></div>'
            + '<div class="form-group"><label class="form-label">Suspected Source</label>'
            + '<select class="form-select" id="epi-curve-source">'
            + '<option value="point">Point source (common exposure)</option>'
            + '<option value="continuous">Continuous / common source</option>'
            + '<option value="propagated">Propagated (person-to-person)</option>'
            + '</select></div></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="EpiConcepts.buildEpiCurve()">Build Epidemic Curve</button></div>';
        html += '<div id="epi-curve-result" class="mt-2"></div>';
        html += '</div>';
        return html;
    }

    function buildEpiCurve() {
        var dataStr = document.getElementById('epi-curve-data').value.trim();
        var name = document.getElementById('epi-curve-name').value.trim() || 'Outbreak';
        var source = document.getElementById('epi-curve-source').value;

        if (!dataStr) { Export.showToast('Enter daily case counts', 'error'); return; }

        var counts = dataStr.split(',').map(function(s) { return parseInt(s.trim()); }).filter(function(n) { return !isNaN(n); });
        if (counts.length === 0) { Export.showToast('Invalid data format', 'error'); return; }

        var totalCases = counts.reduce(function(a, b) { return a + b; }, 0);
        var peakDay = counts.indexOf(Math.max.apply(null, counts)) + 1;
        var peakCases = Math.max.apply(null, counts);
        var duration = counts.length;

        // Build text-based histogram
        var maxCount = peakCases;
        var html = '<div class="result-panel animate-in">';
        html += '<div class="card-title">Epidemic Curve: ' + name + '</div>';

        // Metrics
        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + totalCases + '</div><div class="result-item-label">Total Cases</div></div>'
            + '<div class="result-item"><div class="result-item-value">Day ' + peakDay + '</div><div class="result-item-label">Peak Day</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + peakCases + '</div><div class="result-item-label">Peak Cases</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + duration + ' days</div><div class="result-item-label">Duration</div></div>'
            + '</div>';

        // Bar chart (CSS-based)
        html += '<div class="card-title mt-2">Case Distribution</div>';
        html += '<div style="display:flex;align-items:flex-end;gap:2px;height:150px;padding:8px 0;border-bottom:2px solid var(--border)">';
        counts.forEach(function(c, idx) {
            var height = maxCount > 0 ? (c / maxCount) * 130 : 0;
            var isPeak = idx === peakDay - 1;
            html += '<div style="flex:1;min-width:12px;background:' + (isPeak ? 'var(--danger)' : 'var(--accent)') + ';height:' + height + 'px;border-radius:2px 2px 0 0;position:relative;" title="Day ' + (idx + 1) + ': ' + c + ' cases">'
                + '<div style="position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:0.65rem;color:var(--text-tertiary)">' + c + '</div></div>';
        });
        html += '</div>';
        html += '<div style="display:flex;gap:2px;padding-top:4px">';
        counts.forEach(function(c, idx) {
            html += '<div style="flex:1;min-width:12px;text-align:center;font-size:0.6rem;color:var(--text-tertiary)">' + (idx + 1) + '</div>';
        });
        html += '</div>';
        html += '<div style="text-align:center;font-size:0.75rem;color:var(--text-tertiary);margin-top:4px">Day of Outbreak</div>';

        // Source interpretation
        var sourceLabels = { point: 'Point Source', continuous: 'Continuous Common Source', propagated: 'Propagated (Person-to-Person)' };
        var sourceInterp = {
            point: 'A point source outbreak shows a sharp rise and fall, with cases clustering within one incubation period. The peak occurs quickly.',
            continuous: 'A continuous common source shows a prolonged plateau as long as the exposure persists. Cases do not cluster as tightly.',
            propagated: 'A propagated outbreak shows successive waves, with each wave separated by approximately one incubation period. The curve has multiple peaks.'
        };

        html += '<div style="margin-top:16px;padding:12px;background:var(--surface);border-radius:8px;border-left:3px solid var(--accent)">'
            + '<div style="font-weight:600;margin-bottom:4px">Source Type: ' + sourceLabels[source] + '</div>'
            + '<div style="font-size:0.85rem;color:var(--text-secondary)">' + sourceInterp[source] + '</div></div>';

        // Epidemic characteristics analysis
        var medianDay = 0;
        var cumCases = 0;
        var halfTotal = totalCases / 2;
        for (var ci = 0; ci < counts.length; ci++) {
            cumCases += counts[ci];
            if (cumCases >= halfTotal && medianDay === 0) {
                medianDay = ci + 1;
            }
        }

        // Calculate the ascending and descending phases
        var ascendingDays = peakDay;
        var descendingDays = duration - peakDay;
        var ratio = descendingDays > 0 ? (ascendingDays / descendingDays).toFixed(2) : 'N/A';

        html += '<div class="card-title mt-2">Epidemic Characteristics</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Characteristic</th><th>Value</th><th>Interpretation</th></tr></thead><tbody>';
        html += '<tr><td><strong>Total cases</strong></td><td class="num">' + totalCases + '</td>'
            + '<td style="font-size:0.85rem">Total case count over the outbreak period</td></tr>';
        html += '<tr><td><strong>Peak day</strong></td><td class="num">Day ' + peakDay + '</td>'
            + '<td style="font-size:0.85rem">Day with highest case count (' + peakCases + ' cases)</td></tr>';
        html += '<tr><td><strong>Median case day</strong></td><td class="num">Day ' + medianDay + '</td>'
            + '<td style="font-size:0.85rem">Day by which 50% of all cases occurred</td></tr>';
        html += '<tr><td><strong>Duration</strong></td><td class="num">' + duration + ' days</td>'
            + '<td style="font-size:0.85rem">Total span of the outbreak</td></tr>';
        html += '<tr><td><strong>Ascending phase</strong></td><td class="num">' + ascendingDays + ' days</td>'
            + '<td style="font-size:0.85rem">Days from onset to peak</td></tr>';
        html += '<tr><td><strong>Descending phase</strong></td><td class="num">' + descendingDays + ' days</td>'
            + '<td style="font-size:0.85rem">Days from peak to end</td></tr>';
        html += '<tr><td><strong>Ascending/Descending ratio</strong></td><td class="num">' + ratio + '</td>'
            + '<td style="font-size:0.85rem">' + (ratio !== 'N/A' && parseFloat(ratio) < 1 ? 'Rapid rise, slow decline (typical point source)' :
            ratio !== 'N/A' && parseFloat(ratio) > 1 ? 'Slow rise, rapid decline (uncommon pattern)' : 'Symmetric curve') + '</td></tr>';
        html += '</tbody></table></div>';

        // Incubation period estimation guidance
        if (source === 'point') {
            html += '<div style="margin-top:12px;padding:12px;background:var(--bg-tertiary);border-radius:8px">';
            html += '<div style="font-weight:600;margin-bottom:4px">Incubation Period Estimation (Point Source)</div>';
            html += '<div style="font-size:0.85rem;line-height:1.7;color:var(--text-secondary)">'
                + 'For a point source outbreak, the incubation period can be estimated as:<br>'
                + '&bull; <strong>Minimum incubation period:</strong> Time from exposure to first case (Day 1 = ' + counts[0] + ' case(s))<br>'
                + '&bull; <strong>Median incubation period:</strong> Time from exposure to median case (~Day ' + medianDay + ')<br>'
                + '&bull; <strong>Maximum incubation period:</strong> Time from exposure to last case (Day ' + duration + ')<br>'
                + 'Use these estimates to narrow down the likely pathogen based on known incubation ranges.</div>';
            html += '</div>';
        }

        // R script generation
        html += '<div style="margin-top:12px;">';
        html += '<button class="btn btn-secondary btn-xs" onclick="EpiConcepts.copyEpiCurveR()">Copy R Script</button>';
        html += '</div>';

        html += '</div>';
        App.setTrustedHTML(document.getElementById('epi-curve-result'), html);

        // Store data for R script
        window._epiCurveData = { counts: counts, name: name, source: source };
    }

    function copyEpiCurveR() {
        var data = window._epiCurveData;
        if (!data) { Export.showToast('Build the epidemic curve first', 'error'); return; }
        var rScript = '# Epidemic Curve - ' + data.name + '\n'
            + 'library(ggplot2)\n\n'
            + '# Data\n'
            + 'cases <- c(' + data.counts.join(', ') + ')\n'
            + 'days <- 1:' + data.counts.length + '\n'
            + 'epi_data <- data.frame(Day = days, Cases = cases)\n\n'
            + '# Plot\n'
            + 'ggplot(epi_data, aes(x = Day, y = Cases)) +\n'
            + '  geom_col(fill = "#4e79a7", width = 0.8) +\n'
            + '  theme_minimal() +\n'
            + '  labs(\n'
            + '    title = "Epidemic Curve: ' + data.name + '",\n'
            + '    subtitle = "Source type: ' + data.source + '",\n'
            + '    x = "Day of Outbreak",\n'
            + '    y = "Number of Cases"\n'
            + '  ) +\n'
            + '  scale_x_continuous(breaks = days) +\n'
            + '  theme(panel.grid.minor = element_blank())\n';
        Export.copyText(rScript);
    }

    // ================================================================
    // CARD 7: Disease Burden Metrics (YLL, YLD, DALY)
    // ================================================================
    function renderDALY() {
        var html = '<div class="card">';
        html += '<div class="card-title">Disease Burden Calculator (YLL, YLD, DALY)</div>';
        html += '<div class="card-subtitle">Calculate Years of Life Lost (YLL), Years Lived with Disability (YLD), and Disability-Adjusted Life Years (DALYs) for disease burden estimation.</div>';

        // YLL Calculator
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Years of Life Lost (YLL)</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Formula:</strong> YLL = Number of deaths &times; Standard life expectancy at age of death</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Number of Deaths</label>'
            + '<input type="number" class="form-input" id="daly-yll-deaths" min="0" step="1" value="100"></div>'
            + '<div class="form-group"><label class="form-label">Average Age at Death</label>'
            + '<input type="number" class="form-input" id="daly-yll-age" min="0" step="1" value="65"></div>'
            + '<div class="form-group"><label class="form-label">Reference Life Expectancy</label>'
            + '<input type="number" class="form-input" id="daly-yll-le" min="0" step="0.1" value="80"></div></div>';

        html += '<div class="btn-group mt-1"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcYLL()">Calculate YLL</button></div>';
        html += '<div id="daly-yll-result" class="mt-1"></div></div>';

        // YLD Calculator
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">Years Lived with Disability (YLD)</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + '<strong>Formula:</strong> YLD = Number of prevalent cases &times; Disability weight &times; Average duration (years)</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Prevalent Cases</label>'
            + '<input type="number" class="form-input" id="daly-yld-cases" min="0" step="1" value="500"></div>'
            + '<div class="form-group"><label class="form-label">Disability Weight (0-1) ' + App.tooltip('GBD disability weights: mild stroke = 0.019; moderate stroke = 0.070; severe stroke = 0.552; epilepsy = 0.263') + '</label>'
            + '<input type="number" class="form-input" id="daly-yld-dw" min="0" max="1" step="0.001" value="0.070"></div>'
            + '<div class="form-group"><label class="form-label">Average Duration (years)</label>'
            + '<input type="number" class="form-input" id="daly-yld-dur" min="0" step="0.1" value="10"></div></div>';

        html += '<div class="btn-group mt-1"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcYLD()">Calculate YLD</button></div>';
        html += '<div id="daly-yld-result" class="mt-1"></div></div>';

        // Combined DALY
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:4px;">DALY = YLL + YLD</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">'
            + 'Enter YLL and YLD values (calculated above or from other sources) to compute total DALYs.</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">YLL</label>'
            + '<input type="number" class="form-input" id="daly-total-yll" min="0" step="0.1" value="1500"></div>'
            + '<div class="form-group"><label class="form-label">YLD</label>'
            + '<input type="number" class="form-input" id="daly-total-yld" min="0" step="0.1" value="350"></div>'
            + '<div class="form-group" style="display:flex;align-items:flex-end">'
            + '<button class="btn btn-primary" onclick="EpiConcepts.calcDALY()">Calculate DALY</button></div></div>';
        html += '<div id="daly-total-result" class="mt-1"></div>';
        html += '</div>';

        // Reference disability weights table
        html += '<div class="card-title mt-2">Common Disability Weights (GBD 2019)</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Condition</th><th>Severity</th><th>Disability Weight</th></tr></thead><tbody>'
            + '<tr><td>Ischemic Stroke</td><td>Mild (mRS 1-2)</td><td class="num">0.019</td></tr>'
            + '<tr><td>Ischemic Stroke</td><td>Moderate (mRS 3)</td><td class="num">0.070</td></tr>'
            + '<tr><td>Ischemic Stroke</td><td>Severe (mRS 4-5)</td><td class="num">0.552</td></tr>'
            + '<tr><td>Hemorrhagic Stroke</td><td>Moderate-Severe</td><td class="num">0.316</td></tr>'
            + '<tr><td>Epilepsy</td><td>Controlled</td><td class="num">0.263</td></tr>'
            + '<tr><td>Dementia</td><td>Mild</td><td class="num">0.069</td></tr>'
            + '<tr><td>Dementia</td><td>Severe</td><td class="num">0.449</td></tr>'
            + '<tr><td>Major Depressive Disorder</td><td>Moderate</td><td class="num">0.396</td></tr>'
            + '<tr><td>Heart Failure</td><td>Moderate</td><td class="num">0.072</td></tr>'
            + '<tr><td>Diabetes (uncomplicated)</td><td>-</td><td class="num">0.049</td></tr>'
            + '</tbody></table></div>';

        html += '</div>';
        return html;
    }

    function calcYLL() {
        var deaths = parseFloat(document.getElementById('daly-yll-deaths').value);
        var age = parseFloat(document.getElementById('daly-yll-age').value);
        var le = parseFloat(document.getElementById('daly-yll-le').value);
        if (isNaN(deaths) || isNaN(age) || isNaN(le)) return;

        var yll = deaths * (le - age);
        if (yll < 0) yll = 0;

        var html = '<div class="result-panel"><div class="result-value">' + yll.toLocaleString() + '<div class="result-label">Years of Life Lost (YLL)</div></div>'
            + '<div class="result-detail">' + deaths + ' deaths x (' + le + ' - ' + age + ') = ' + yll.toLocaleString() + ' YLL</div></div>';
        App.setTrustedHTML(document.getElementById('daly-yll-result'), html);
    }

    function calcYLD() {
        var cases = parseFloat(document.getElementById('daly-yld-cases').value);
        var dw = parseFloat(document.getElementById('daly-yld-dw').value);
        var dur = parseFloat(document.getElementById('daly-yld-dur').value);
        if (isNaN(cases) || isNaN(dw) || isNaN(dur)) return;

        var yld = cases * dw * dur;

        var html = '<div class="result-panel"><div class="result-value">' + yld.toFixed(1) + '<div class="result-label">Years Lived with Disability (YLD)</div></div>'
            + '<div class="result-detail">' + cases + ' cases x ' + dw + ' DW x ' + dur + ' years = ' + yld.toFixed(1) + ' YLD</div></div>';
        App.setTrustedHTML(document.getElementById('daly-yld-result'), html);
    }

    function calcDALY() {
        var yll = parseFloat(document.getElementById('daly-total-yll').value);
        var yld = parseFloat(document.getElementById('daly-total-yld').value);
        if (isNaN(yll) || isNaN(yld)) return;

        var daly = yll + yld;
        var pctYLL = (yll / daly * 100).toFixed(1);
        var pctYLD = (yld / daly * 100).toFixed(1);

        var html = '<div class="result-panel"><div class="result-value">' + daly.toLocaleString() + '<div class="result-label">Total DALYs</div></div>';
        html += '<div class="result-grid mt-1">'
            + '<div class="result-item"><div class="result-item-value">' + yll.toLocaleString() + '</div><div class="result-item-label">YLL (' + pctYLL + '%)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + yld.toLocaleString() + '</div><div class="result-item-label">YLD (' + pctYLD + '%)</div></div></div>';
        html += '<div class="result-detail mt-1">1 DALY = 1 year of healthy life lost. A higher YLL proportion indicates mortality-dominant burden; higher YLD indicates morbidity-dominant burden.</div>';
        html += '</div>';
        App.setTrustedHTML(document.getElementById('daly-total-result'), html);
    }

    // ================================================================
    // CARD 8: Screening Concepts
    // ================================================================
    function renderScreening() {
        var html = '<div class="card">';
        html += '<div class="card-title">Screening Concepts</div>';
        html += '<div class="card-subtitle">Calculate screening test properties and explore how prevalence affects predictive values.</div>';

        html += '<div style="max-width:520px;margin:0 auto 16px;"><div class="table-scroll-wrap"><table class="data-table" style="text-align:center;">';
        html += '<thead><tr><th></th><th colspan="2" style="text-align:center;">Disease Status</th></tr>'
            + '<tr><th>Test Result</th><th style="text-align:center;">Disease+</th><th style="text-align:center;">Disease-</th></tr></thead>';
        html += '<tbody>'
            + '<tr><td style="font-weight:600;">Test +</td>'
            + '<td><input type="number" class="form-input" id="scr-tp" min="0" step="1" value="90" style="width:80px;margin:0 auto;text-align:center;"><div style="font-size:0.7rem;color:var(--text-tertiary)">TP</div></td>'
            + '<td><input type="number" class="form-input" id="scr-fp" min="0" step="1" value="50" style="width:80px;margin:0 auto;text-align:center;"><div style="font-size:0.7rem;color:var(--text-tertiary)">FP</div></td></tr>'
            + '<tr><td style="font-weight:600;">Test -</td>'
            + '<td><input type="number" class="form-input" id="scr-fn" min="0" step="1" value="10" style="width:80px;margin:0 auto;text-align:center;"><div style="font-size:0.7rem;color:var(--text-tertiary)">FN</div></td>'
            + '<td><input type="number" class="form-input" id="scr-tn" min="0" step="1" value="850" style="width:80px;margin:0 auto;text-align:center;"><div style="font-size:0.7rem;color:var(--text-tertiary)">TN</div></td></tr>'
            + '</tbody></table></div></div>';

        html += '<div class="btn-group" style="justify-content:center;">'
            + '<button class="btn btn-primary" onclick="EpiConcepts.calcScreening()">Calculate</button>'
            + '<button class="btn btn-secondary" onclick="EpiConcepts.copyScreening()">Copy</button></div>';
        html += '<div id="scr-results" class="mt-2"></div>';

        // Prevalence PPV/NPV
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-top:16px;">';
        html += '<div style="font-weight:700;margin-bottom:8px;">Prevalence and Predictive Values</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Sensitivity (%)</label><input type="number" class="form-input" id="scr-prev-sens" min="0" max="100" step="1" value="90"></div>';
        html += '<div class="form-group"><label class="form-label">Specificity (%)</label><input type="number" class="form-input" id="scr-prev-spec" min="0" max="100" step="1" value="95"></div>';
        html += '<div class="form-group"><label class="form-label">Prevalence (%)</label><input type="number" class="form-input" id="scr-prev-prev" min="0.01" max="100" step="0.1" value="5"></div>';
        html += '</div>';
        html += '<div class="btn-group"><button class="btn btn-primary btn-xs" onclick="EpiConcepts.calcPrevPV()">Calculate PPV/NPV</button></div>';
        html += '<div id="scr-prev-results" class="mt-1"></div></div>';

        html += '</div>';
        return html;
    }

    function calcScreening() {
        var tp = parseFloat(document.getElementById('scr-tp').value) || 0;
        var fp = parseFloat(document.getElementById('scr-fp').value) || 0;
        var fn = parseFloat(document.getElementById('scr-fn').value) || 0;
        var tn = parseFloat(document.getElementById('scr-tn').value) || 0;
        var n = tp + fp + fn + tn;
        if (n === 0) return;

        var sens = tp / (tp + fn), spec = tn / (tn + fp);
        var ppv = tp / (tp + fp), npv = tn / (tn + fn);
        var acc = (tp + tn) / n, plr = sens / (1 - spec), nlr = (1 - sens) / spec;
        var youden = sens + spec - 1;

        var html = '<div class="result-panel"><div class="card-title">Screening Test Properties</div>';
        html += '<div class="table-container"><table class="data-table"><thead><tr><th>Measure</th><th>Value</th><th>Interpretation</th></tr></thead><tbody>';
        html += '<tr><td><strong>Sensitivity</strong></td><td>' + (sens * 100).toFixed(1) + '%</td><td>TP rate; SnNOut</td></tr>';
        html += '<tr><td><strong>Specificity</strong></td><td>' + (spec * 100).toFixed(1) + '%</td><td>TN rate; SpPIn</td></tr>';
        html += '<tr><td><strong>PPV</strong></td><td>' + (ppv * 100).toFixed(1) + '%</td><td>P(Disease | Test+)</td></tr>';
        html += '<tr><td><strong>NPV</strong></td><td>' + (npv * 100).toFixed(1) + '%</td><td>P(No Disease | Test-)</td></tr>';
        html += '<tr><td><strong>Accuracy</strong></td><td>' + (acc * 100).toFixed(1) + '%</td><td>Overall correct rate</td></tr>';
        html += '<tr><td><strong>+LR</strong></td><td>' + plr.toFixed(2) + '</td><td>' + (plr > 10 ? 'Strong rule-in' : plr > 5 ? 'Moderate' : 'Weak') + '</td></tr>';
        html += '<tr><td><strong>-LR</strong></td><td>' + nlr.toFixed(3) + '</td><td>' + (nlr < 0.1 ? 'Strong rule-out' : nlr < 0.2 ? 'Moderate' : 'Weak') + '</td></tr>';
        html += '<tr><td><strong>Youden Index</strong></td><td>' + youden.toFixed(3) + '</td><td>0=useless, 1=perfect</td></tr>';
        html += '</tbody></table></div></div>';
        App.setTrustedHTML(document.getElementById('scr-results'), html);
    }

    function calcPrevPV() {
        var sens = parseFloat(document.getElementById('scr-prev-sens').value) / 100;
        var spec = parseFloat(document.getElementById('scr-prev-spec').value) / 100;
        var prev = parseFloat(document.getElementById('scr-prev-prev').value) / 100;
        if (isNaN(sens) || isNaN(spec) || isNaN(prev)) return;

        var ppv = (sens * prev) / (sens * prev + (1 - spec) * (1 - prev));
        var npv = (spec * (1 - prev)) / ((1 - sens) * prev + spec * (1 - prev));
        var plr = sens / (1 - spec);
        var nlr = (1 - sens) / spec;
        var preOdds = prev / (1 - prev);
        var postOddsPos = preOdds * plr;
        var postOddsNeg = preOdds * nlr;
        var postProbPos = postOddsPos / (1 + postOddsPos);
        var postProbNeg = postOddsNeg / (1 + postOddsNeg);

        var html = '<div class="result-panel">';
        html += '<div class="result-grid">';
        html += '<div class="result-item"><div class="result-item-value">' + (ppv * 100).toFixed(1) + '%</div><div class="result-item-label">PPV</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + (npv * 100).toFixed(1) + '%</div><div class="result-item-label">NPV</div></div>';
        html += '</div>';

        // Bayesian reasoning table
        html += '<div class="card-subtitle mt-2">Bayesian Reasoning (Fagan Nomogram)</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Step</th><th>If Test Positive</th><th>If Test Negative</th></tr></thead><tbody>';
        html += '<tr><td><strong>Pre-test probability</strong></td>'
            + '<td class="num">' + (prev * 100).toFixed(1) + '%</td>'
            + '<td class="num">' + (prev * 100).toFixed(1) + '%</td></tr>';
        html += '<tr><td><strong>Pre-test odds</strong></td>'
            + '<td class="num">' + preOdds.toFixed(4) + '</td>'
            + '<td class="num">' + preOdds.toFixed(4) + '</td></tr>';
        html += '<tr><td><strong>Likelihood ratio</strong></td>'
            + '<td class="num">+LR = ' + plr.toFixed(2) + '</td>'
            + '<td class="num">-LR = ' + nlr.toFixed(3) + '</td></tr>';
        html += '<tr><td><strong>Post-test odds</strong></td>'
            + '<td class="num">' + postOddsPos.toFixed(4) + '</td>'
            + '<td class="num">' + postOddsNeg.toFixed(4) + '</td></tr>';
        html += '<tr><td><strong>Post-test probability</strong></td>'
            + '<td class="num" style="font-weight:700;color:var(--danger)">' + (postProbPos * 100).toFixed(1) + '%</td>'
            + '<td class="num" style="font-weight:700;color:var(--success)">' + (postProbNeg * 100).toFixed(1) + '%</td></tr>';
        html += '</tbody></table></div>';

        html += '<div style="margin-top:8px;font-size:0.82rem;color:var(--text-secondary);line-height:1.6">'
            + '<strong>Post-test odds = Pre-test odds &times; LR.</strong> '
            + 'Post-test probability = Post-test odds / (1 + Post-test odds).<br>'
            + 'At ' + (prev * 100).toFixed(1) + '% prevalence, a positive test raises probability to '
            + (postProbPos * 100).toFixed(1) + '%, while a negative test lowers it to '
            + (postProbNeg * 100).toFixed(1) + '%.</div>';
        html += '</div>';
        App.setTrustedHTML(document.getElementById('scr-prev-results'), html);
    }

    function copyScreening() {
        var el = document.getElementById('scr-results');
        if (el) Export.copyText(el.textContent);
    }

    // ================================================================
    // CARD 9: Study Validity Concepts
    // ================================================================
    function renderValidity() {
        var html = '<div class="card">';
        html += '<div class="card-title">Study Validity Concepts</div>';
        html += '<div class="card-subtitle">Reference for validity, bias, error, and confounding in epidemiological research.</div>';

        // Internal vs External
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:8px;">Internal vs. External Validity</div>';
        html += '<div class="form-row form-row--2" style="gap:16px;">';
        html += '<div style="padding:12px;background:var(--bg-tertiary);border-radius:8px;">'
            + '<div style="font-weight:600;margin-bottom:4px;">Internal Validity</div>'
            + '<div style="font-size:0.9rem;line-height:1.6;">Degree to which results are free from systematic error within the study. Threats: selection bias, information bias, confounding.</div>'
            + '<ul style="margin:8px 0 0 16px;font-size:0.85rem;line-height:1.6">'
            + '<li>Selection bias: who gets into the study?</li>'
            + '<li>Information bias: how accurately are data measured?</li>'
            + '<li>Confounding: what unmeasured factors distort results?</li>'
            + '</ul></div>';
        html += '<div style="padding:12px;background:var(--bg-tertiary);border-radius:8px;">'
            + '<div style="font-weight:600;margin-bottom:4px;">External Validity</div>'
            + '<div style="font-size:0.9rem;line-height:1.6;">Generalizability to populations beyond the study. Internal validity is a prerequisite.</div>'
            + '<ul style="margin:8px 0 0 16px;font-size:0.85rem;line-height:1.6">'
            + '<li>Are participants representative of the target population?</li>'
            + '<li>Can results be applied to different settings?</li>'
            + '<li>Pragmatic trials prioritize external validity</li>'
            + '</ul></div>';
        html += '</div></div>';

        // Effect Modification vs Confounding
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:8px;">Effect Modification vs. Confounding</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Feature</th><th>Confounding</th><th>Effect Modification</th></tr></thead><tbody>'
            + '<tr><td><strong>Definition</strong></td><td>Third variable distorts the association</td><td>Effect differs across strata</td></tr>'
            + '<tr><td><strong>Is it bias?</strong></td><td>Yes (remove it)</td><td>No (report it)</td></tr>'
            + '<tr><td><strong>Assessment</strong></td><td>&gt;10% change in estimate after adjustment</td><td>Stratum-specific estimates differ meaningfully</td></tr>'
            + '<tr><td><strong>What to do</strong></td><td>Control for it (adjust, stratify, match)</td><td>Report stratum-specific estimates</td></tr>'
            + '<tr><td><strong>DAG representation</strong></td><td>Common cause of exposure &amp; outcome</td><td>Not represented as bias in DAG</td></tr>'
            + '<tr><td><strong>Example</strong></td><td>Age confounds the smoking-CHD association</td><td>Aspirin effect differs by sex</td></tr>'
            + '</tbody></table></div></div>';

        // Confounding Criteria
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:8px;">Criteria for Confounding</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">'
            + 'A variable C is a confounder of the E&rarr;D relationship if:<br>'
            + '<ol style="margin:8px 0 0 16px;">'
            + '<li><strong>C is associated with E</strong> (risk factor or correlated with exposure)</li>'
            + '<li><strong>C is an independent risk factor for D</strong> (associated with outcome regardless of exposure)</li>'
            + '<li><strong>C is NOT on the causal pathway</strong> from E to D (not a mediator)</li>'
            + '</ol>'
            + '<div style="margin-top:8px;font-size:0.85rem;color:var(--text-secondary)">'
            + '<strong>Methods to control confounding:</strong> Randomization (design), restriction (design), matching (design), '
            + 'stratification (analysis), multivariable regression (analysis), propensity scores (analysis), '
            + 'instrumental variables (analysis).</div>'
            + '</div></div>';

        // Random vs Systematic Error
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:8px;">Random Error vs. Systematic Error</div>';
        html += '<div class="form-row form-row--2" style="gap:16px;">';
        html += '<div style="padding:12px;background:var(--bg-tertiary);border-radius:8px;">'
            + '<div style="font-weight:600;margin-bottom:4px;">Random Error</div>'
            + '<div style="font-size:0.9rem;line-height:1.6;">Due to chance. Reduced by larger N. Affects precision (width of CI).</div>'
            + '<ul style="margin:8px 0 0 16px;font-size:0.85rem;line-height:1.6">'
            + '<li>Sampling variability</li>'
            + '<li>Quantified by p-values and confidence intervals</li>'
            + '<li>Wider CI = more random error</li>'
            + '</ul></div>';
        html += '<div style="padding:12px;background:var(--bg-tertiary);border-radius:8px;">'
            + '<div style="font-weight:600;margin-bottom:4px;">Systematic Error (Bias)</div>'
            + '<div style="font-size:0.9rem;line-height:1.6;">Due to design flaws. NOT reduced by larger N. Affects accuracy (estimate shifted from truth).</div>'
            + '<ul style="margin:8px 0 0 16px;font-size:0.85rem;line-height:1.6">'
            + '<li>Selection, information, confounding bias</li>'
            + '<li>Not quantified by standard statistics</li>'
            + '<li>Must be addressed in study design</li>'
            + '</ul></div>';
        html += '</div></div>';

        // Precision vs Accuracy diagram
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:8px;">Precision vs. Accuracy (Dart Board Analogy)</div>';
        html += '<div class="form-row form-row--2" style="gap:16px;">';

        html += '<div style="text-align:center">';
        html += '<div style="width:100px;height:100px;border-radius:50%;border:3px solid var(--border);margin:0 auto;position:relative;background:var(--bg-tertiary)">'
            + '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:1.5rem;font-weight:700;color:var(--success)">&#8226;&#8226;&#8226;</div></div>';
        html += '<div style="font-weight:600;margin-top:4px">Accurate + Precise</div>';
        html += '<div style="font-size:0.8rem;color:var(--text-tertiary)">No bias, no random error</div></div>';

        html += '<div style="text-align:center">';
        html += '<div style="width:100px;height:100px;border-radius:50%;border:3px solid var(--border);margin:0 auto;position:relative;background:var(--bg-tertiary)">'
            + '<div style="position:absolute;top:25%;left:60%;font-size:1.5rem;font-weight:700;color:var(--danger)">&#8226;&#8226;&#8226;</div></div>';
        html += '<div style="font-weight:600;margin-top:4px">Precise but Not Accurate</div>';
        html += '<div style="font-size:0.8rem;color:var(--text-tertiary)">Systematic bias present</div></div>';

        html += '</div>';
        html += '<div class="form-row form-row--2 mt-1" style="gap:16px;">';

        html += '<div style="text-align:center">';
        html += '<div style="width:100px;height:100px;border-radius:50%;border:3px solid var(--border);margin:0 auto;position:relative;background:var(--bg-tertiary)">'
            + '<div style="position:absolute;top:20%;left:20%;font-size:1rem;font-weight:700;color:var(--warning)">&#8226;</div>'
            + '<div style="position:absolute;top:70%;left:60%;font-size:1rem;font-weight:700;color:var(--warning)">&#8226;</div>'
            + '<div style="position:absolute;top:40%;left:70%;font-size:1rem;font-weight:700;color:var(--warning)">&#8226;</div></div>';
        html += '<div style="font-weight:600;margin-top:4px">Accurate but Not Precise</div>';
        html += '<div style="font-size:0.8rem;color:var(--text-tertiary)">Scattered around truth (random error)</div></div>';

        html += '<div style="text-align:center">';
        html += '<div style="width:100px;height:100px;border-radius:50%;border:3px solid var(--border);margin:0 auto;position:relative;background:var(--bg-tertiary)">'
            + '<div style="position:absolute;top:15%;left:15%;font-size:1rem;font-weight:700;color:var(--danger)">&#8226;</div>'
            + '<div style="position:absolute;top:25%;left:30%;font-size:1rem;font-weight:700;color:var(--danger)">&#8226;</div>'
            + '<div style="position:absolute;top:10%;left:22%;font-size:1rem;font-weight:700;color:var(--danger)">&#8226;</div></div>';
        html += '<div style="font-weight:600;margin-top:4px">Neither Accurate nor Precise</div>';
        html += '<div style="font-size:0.8rem;color:var(--text-tertiary)">Both bias and random error</div></div>';

        html += '</div></div>';

        // Causation Criteria (Hill's)
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;font-size:1rem;margin-bottom:8px;">Bradford Hill Criteria for Causation</div>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">Nine viewpoints to consider when assessing whether an observed association is causal (not a strict checklist):</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>#</th><th>Criterion</th><th>Description</th><th>Example</th></tr></thead><tbody>';

        var hillCriteria = [
            { name: 'Strength', desc: 'Stronger associations are more likely causal', example: 'Smoking &amp; lung cancer (RR ~20)' },
            { name: 'Consistency', desc: 'Association observed in different populations, times, settings', example: 'Smoking-lung cancer found across all studies worldwide' },
            { name: 'Specificity', desc: 'Exposure leads to one specific outcome', example: 'Asbestos &amp; mesothelioma (though specificity is the weakest criterion)' },
            { name: 'Temporality', desc: 'Exposure precedes outcome (the only required criterion)', example: 'Prospective studies confirm exposure before disease onset' },
            { name: 'Biological gradient', desc: 'Dose-response relationship', example: 'More cigarettes/day &rarr; higher lung cancer risk' },
            { name: 'Plausibility', desc: 'Biologically plausible mechanism exists', example: 'Known carcinogens in tobacco smoke damage DNA' },
            { name: 'Coherence', desc: 'Consistent with existing knowledge', example: 'Lab evidence supports epidemiological findings' },
            { name: 'Experiment', desc: 'Removal of exposure reduces risk', example: 'Smoking cessation reduces lung cancer risk' },
            { name: 'Analogy', desc: 'Similar exposures cause similar outcomes', example: 'If one chemical causes cancer, a similar one might too' }
        ];

        hillCriteria.forEach(function(c, idx) {
            html += '<tr><td class="num">' + (idx + 1) + '</td>'
                + '<td><strong>' + c.name + '</strong></td>'
                + '<td style="font-size:0.82rem">' + c.desc + '</td>'
                + '<td style="font-size:0.82rem;font-style:italic">' + c.example + '</td></tr>';
        });
        html += '</tbody></table></div>';
        html += '<div style="margin-top:8px;font-size:0.82rem;color:var(--text-tertiary)">'
            + 'Note: These are viewpoints to consider, not a strict checklist. Only <strong>temporality</strong> is absolutely required. '
            + 'Modern causal inference methods (counterfactual framework, DAGs) supplement Hill\'s criteria.</div>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    // ================================================================
    // REGISTER
    // ================================================================
    App.registerModule(MODULE_ID, { render: render });

    function genRScriptLifeTable() {
        var ltAges = ['0-4', '5-14', '15-44', '45-64', '65-74', '75+'];
        var widths = [5, 10, 30, 20, 10, 10];
        var deaths = [], pops = [];
        for (var i = 0; i < 6; i++) {
            var d = parseFloat(document.getElementById('lt-deaths-' + i).value);
            var p = parseFloat(document.getElementById('lt-pop-' + i).value);
            if (isNaN(d) || isNaN(p) || p === 0) continue;
            deaths.push(d);
            pops.push(p);
        }
        if (deaths.length === 0) { Export.showToast('Enter data first', 'error'); return; }
        RGenerator.showScript(
            RGenerator.epiLifeTable({ deaths: deaths, populations: pops, ages: ltAges.slice(0, deaths.length), widths: widths.slice(0, deaths.length) }),
            'Abridged Life Table'
        );
    }

    window.EpiConcepts = {
        calcIR: calcIR,
        calcCI: calcCI,
        calcPP: calcPP,
        calcMR: calcMR,
        calcCFR: calcCFR,
        calcPerP: calcPerP,
        calcAR: calcAR,
        calcPMR: calcPMR,
        calcRateRatio: calcRateRatio,
        calcAssociation: calcAssociation,
        copyAssociation: copyAssociation,
        calcImpact: calcImpact,
        calcDirectStd: calcDirectStd,
        loadStdExample: loadStdExample,
        calcSMR: calcSMR,
        calcLifeTable: calcLifeTable,
        loadLifeTableExample: loadLifeTableExample,
        buildEpiCurve: buildEpiCurve,
        copyEpiCurveR: copyEpiCurveR,
        calcYLL: calcYLL,
        calcYLD: calcYLD,
        calcDALY: calcDALY,
        calcScreening: calcScreening,
        calcPrevPV: calcPrevPV,
        copyScreening: copyScreening,
        genRScriptLifeTable: genRScriptLifeTable
    };
})();
