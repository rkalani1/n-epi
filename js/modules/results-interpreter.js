/**
 * Neuro-Epi — Results Interpreter Module
 * Paste statistical results and get plain-English interpretation.
 * P-values, confidence intervals, effect sizes, regression output, quick reference,
 * forest plot interpreter, funnel plot interpreter, Kaplan-Meier interpreter,
 * ROC curve interpreter, regression output interpreter, red flags checklist.
 */
(function() {
    'use strict';

    const MODULE_ID = 'results-interpreter';

    // ================================================================
    // RENDER
    // ================================================================
    function render(container) {
        var html = App.createModuleLayout(
            'Results Interpreter',
            'Paste statistical results and get plain-English interpretation. Covers p-values, confidence intervals, effect sizes, regression output, and common statistics.'
        );

        // Learn & Reference section
        html += '<div class="card" style="background: var(--bg-secondary); border-left: 4px solid var(--accent-color);">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\')">&#128218; Learn &amp; Reference <span style="font-size:0.8em; color: var(--text-muted);">(click to expand)</span></div>';
        html += '<div class="learn-body hidden">';

        html += '<div style="margin-bottom:1.2rem;">';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">P-value Interpretation</div>';
        html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
        html += '<li><strong>p &lt; 0.001</strong> &mdash; Strong evidence against H&#8320;</li>';
        html += '<li><strong>0.001&ndash;0.01</strong> &mdash; Good evidence against H&#8320;</li>';
        html += '<li><strong>0.01&ndash;0.05</strong> &mdash; Moderate evidence against H&#8320;</li>';
        html += '<li><strong>&gt; 0.05</strong> &mdash; Insufficient evidence against H&#8320;</li>';
        html += '</ul>';
        html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.3rem;">Never say &ldquo;the result is significant&rdquo; without context about effect size and clinical relevance.</div>';
        html += '</div>';

        html += '<div style="margin-bottom:1.2rem;">';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">CI Interpretation</div>';
        html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
        html += '<li>Contains plausible population values.</li>';
        html += '<li>Width reflects precision.</li>';
        html += '<li>If CI for a difference includes 0 (or ratio includes 1) &rarr; not statistically significant at corresponding &alpha;.</li>';
        html += '</ul>';
        html += '</div>';

        html += '<div style="margin-bottom:1.2rem;">';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Effect Size Guidelines</div>';
        html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
        html += '<li><strong>Cohen\'s d:</strong> 0.2 small, 0.5 medium, 0.8 large</li>';
        html += '<li><strong>OR / RR:</strong> Interpretation depends on clinical context</li>';
        html += '<li><strong>NNT:</strong> Lower = stronger effect</li>';
        html += '</ul>';
        html += '</div>';

        html += '<div style="margin-bottom:1.2rem;">';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Reading Common Plots</div>';
        html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
        html += '<li><strong>Forest plot:</strong> Point estimates + CIs for each study + pooled diamond. Check if diamond crosses the null line.</li>';
        html += '<li><strong>Funnel plot:</strong> Symmetry suggests no publication bias. Asymmetry (missing small negative studies) suggests bias.</li>';
        html += '<li><strong>Kaplan-Meier:</strong> Stepwise survival curves. Vertical drops = events. Tick marks = censored observations.</li>';
        html += '<li><strong>ROC curve:</strong> Plots sensitivity vs 1-specificity. AUC = discrimination. Closer to top-left corner = better.</li>';
        html += '</ul>';
        html += '</div>';

        html += '<div style="margin-bottom:1.2rem;">';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Common Pitfalls</div>';
        html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
        html += '<li>Absence of evidence &ne; evidence of absence</li>';
        html += '<li>P-value is NOT the probability H&#8320; is true</li>';
        html += '<li>Statistical significance &ne; clinical importance</li>';
        html += '<li>Bayesian vs frequentist interpretation</li>';
        html += '<li>Reporting SE instead of SD makes variability appear smaller</li>';
        html += '</ul>';
        html += '</div>';

        html += '<div>';
        html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">References</div>';
        html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>Wasserstein RL et al. ASA statement on p-values, 2016</li>';
        html += '<li>Greenland S et al. Statistical tests, P values, CIs: a reappraisal, 2016</li>';
        html += '<li>Sterne JAC et al. Funnel plots for detecting bias. BMJ, 2011</li>';
        html += '<li>Bland JM, Altman DG. Survival probabilities (the Kaplan-Meier method). BMJ, 1998</li>';
        html += '</ul>';
        html += '</div>';

        html += '</div></div>';

        // Card 1: P-value Interpreter
        html += renderPValue();

        // Card 2: Confidence Interval Interpreter
        html += renderCI();

        // Card 3: Effect Size Interpreter
        html += renderEffectSize();

        // Card 4: Regression Output Interpreter
        html += renderRegression();

        // Card 5: Forest Plot Interpreter
        html += renderForestPlotGuide();

        // Card 5b: Forest Plot Data Reader (NEW)
        html += renderForestPlotReader();

        // Card 6: Funnel Plot Interpreter
        html += renderFunnelPlotGuide();

        // Card 7: Kaplan-Meier Interpreter
        html += renderKMGuide();

        // Card 8: ROC Curve Interpreter
        html += renderROCGuide();

        // Card 9: Red Flags Checklist
        html += renderRedFlags();

        // Card 10: Bland-Altman Agreement Guide
        html += renderBlandAltmanGuide();

        // Card 11: Effect Size Converter
        html += renderESConverter();

        // Card 12: Statistical Test Selector
        html += renderTestSelector();

        // Card 13: Multi-Variable Regression Summary
        html += renderMultiVarRegression();

        // Card 13b: Regression Output Reader (NEW)
        html += renderRegressionOutputReader();

        // Card 14: Quick Reference Cards
        html += renderQuickReference();

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    // ================================================================
    // CARD 1: P-value Interpreter
    // ================================================================
    function renderPValue() {
        var html = '<div class="card">';
        html += '<div class="card-title">P-value Interpreter</div>';
        html += '<div class="card-subtitle">Enter a p-value and get a plain-English interpretation with context about what it does and does not mean.</div>';

        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">P-value</label>'
            + '<input type="number" class="form-input" id="pv-value" name="pv-value" min="0" max="1" step="0.001" value="0.03"></div>';
        html += '<div class="form-group"><label class="form-label">Alpha Level</label>'
            + '<input type="number" class="form-input" id="pv-alpha" name="pv-alpha" min="0.001" max="0.5" step="0.01" value="0.05"></div>';
        html += '<div class="form-group"><label class="form-label">Test Type</label>'
            + '<select class="form-select" id="pv-type" name="pv-type">'
            + '<option value="two-sided">Two-sided</option>'
            + '<option value="one-sided">One-sided</option>'
            + '</select></div>';
        html += '</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Total Sample Size (optional, for Bayes Factor)</label>'
            + '<input type="number" class="form-input" id="pv-n" name="pv-n" min="2" step="1" placeholder="e.g., 200"></div>';
        html += '<div class="form-group"><label class="form-label">Number of Comparisons (optional, for Bonferroni)</label>'
            + '<input type="number" class="form-input" id="pv-comparisons" name="pv-comparisons" min="1" step="1" value="1" placeholder="e.g., 10"></div>';
        html += '</div>';

        html += '<div class="btn-group">'
            + '<button class="btn btn-primary" onclick="ResultsInterp.interpretPValue()">Interpret</button>'
            + '<button class="btn btn-secondary" onclick="ResultsInterp.copyPValue()">Copy</button>'
            + '</div>';

        html += '<div id="pv-results"></div>';
        html += '</div>';
        return html;
    }

    function interpretPValue() {
        var p = parseFloat(document.getElementById('pv-value').value);
        var alpha = parseFloat(document.getElementById('pv-alpha').value);
        var testType = document.getElementById('pv-type').value;
        var sampleN = parseFloat(document.getElementById('pv-n').value);
        var numComparisons = parseInt(document.getElementById('pv-comparisons').value) || 1;

        if (isNaN(p) || isNaN(alpha)) return;

        var significant = p < alpha;
        var pDisplay = p < 0.001 ? '< 0.001' : p.toFixed(4);

        var html = '<div class="result-panel mt-2">';
        html += '<div class="card-title">P-value Interpretation</div>';

        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Plain English</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        html += 'The probability of observing data this extreme or more extreme, <em>assuming the null hypothesis is true</em>, is <strong>'
            + pDisplay + '</strong>.';
        if (testType === 'two-sided') {
            html += ' This is a two-sided test, so it considers deviations in either direction.';
        } else {
            html += ' This is a one-sided test, so it only considers deviations in one direction.';
        }
        html += '</div></div>';

        html += '<div style="border-left:4px solid ' + (significant ? 'var(--success)' : 'var(--warning)') + ';padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Statistical Conclusion</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        if (significant) {
            html += 'At alpha = ' + alpha + ', this result is <strong style="color:var(--success);">statistically significant</strong>. '
                + 'We reject the null hypothesis (p = ' + pDisplay + ' < ' + alpha + ').';
        } else {
            html += 'At alpha = ' + alpha + ', this result is <strong style="color:var(--warning);">not statistically significant</strong>. '
                + 'We fail to reject the null hypothesis (p = ' + pDisplay + ' >= ' + alpha + ').';
        }
        html += '</div></div>';

        html += '<div style="border-left:4px solid var(--warning);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Important Context</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        html += '<strong>Statistical significance does not imply clinical significance.</strong> '
            + 'A very large study can detect trivially small differences as "statistically significant." '
            + 'Always consider the effect size and clinical relevance alongside the p-value.';
        if (!significant) {
            html += '<br><br><strong>Absence of evidence is not evidence of absence.</strong> '
                + 'A non-significant p-value does not prove the null hypothesis is true. The study may have been underpowered (insufficient sample size) to detect a meaningful effect.';
        }
        html += '</div></div>';

        html += '<div style="border-left:4px solid var(--text-tertiary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Strength of Evidence (informal)</div>';
        html += '<div style="font-size:0.95rem;">';
        if (p < 0.001) html += 'p < 0.001: Very strong evidence against the null hypothesis.';
        else if (p < 0.01) html += 'p < 0.01: Strong evidence against the null hypothesis.';
        else if (p < 0.05) html += 'p < 0.05: Moderate evidence against the null hypothesis.';
        else if (p < 0.10) html += 'p < 0.10: Weak evidence against the null hypothesis (sometimes considered "marginal" or "trending").';
        else html += 'p >= 0.10: Little to no evidence against the null hypothesis.';
        html += '</div></div>';

        // Bayesian interpretation (approximate Bayes Factor)
        if (!isNaN(sampleN) && sampleN > 1) {
            html += '<div style="border-left:4px solid var(--accent-color, var(--primary));padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
            html += '<div style="font-weight:600;margin-bottom:4px;">Approximate Bayesian Interpretation</div>';
            html += '<div style="font-size:0.95rem;line-height:1.6;">';
            // Approximate BF using the Sellke, Bayarri & Berger (2001) calibration: BF >= -e * p * ln(p)
            var bf10;
            if (p > 0 && p < 1) {
                bf10 = -1 * Math.E * p * Math.log(p);
                if (bf10 < 1) bf10 = 1; // BF cannot favor H1 less than 1:1 by this bound
            } else if (p <= 0) {
                bf10 = 9999;
            } else {
                bf10 = 1;
            }
            // Vovk-Sellke maximum p-ratio: 1 / (-e * p * ln(p))
            var vsMPR = (p > 0 && p < (1 / Math.E)) ? 1 / (-1 * Math.E * p * Math.log(p)) : 1;
            html += '<strong>Vovk-Sellke Maximum p-Ratio (VS-MPR):</strong> ' + (vsMPR > 999 ? '> 999' : vsMPR.toFixed(1)) + '<br>';
            html += 'This means the data are at most <strong>' + (vsMPR > 999 ? '> 999' : vsMPR.toFixed(1)) + ' times more likely</strong> under the alternative hypothesis than the null. ';
            var bfLabel;
            if (vsMPR > 100) bfLabel = 'Decisive evidence for H1';
            else if (vsMPR > 30) bfLabel = 'Very strong evidence for H1';
            else if (vsMPR > 10) bfLabel = 'Strong evidence for H1';
            else if (vsMPR > 3) bfLabel = 'Moderate evidence for H1';
            else bfLabel = 'Weak evidence -- barely worth mentioning';
            html += '(' + bfLabel + ', Jeffreys scale)<br>';
            html += '<span style="font-size:0.82rem;color:var(--text-secondary);">Note: This is an approximate upper bound based on the Sellke et al. (2001) calibration. '
                + 'A proper Bayes Factor requires specifying a prior on the effect size. With n = ' + Math.round(sampleN) + ', this approximation is '
                + (sampleN > 50 ? 'reasonable' : 'rough -- small samples make this less reliable') + '.</span>';
            html += '</div></div>';
        }

        // Multiple comparisons (Bonferroni)
        if (numComparisons > 1) {
            var bonferroniAlpha = alpha / numComparisons;
            var bonferroniSig = p < bonferroniAlpha;
            var sidakAlpha = 1 - Math.pow(1 - alpha, 1 / numComparisons);
            var sidakSig = p < sidakAlpha;
            html += '<div style="border-left:4px solid var(--danger);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
            html += '<div style="font-weight:600;margin-bottom:4px;">Multiple Comparisons Adjustment</div>';
            html += '<div style="font-size:0.95rem;line-height:1.6;">';
            html += 'With <strong>' + numComparisons + ' comparisons</strong>, the family-wise error rate inflates dramatically if uncorrected.<br><br>';
            html += '<strong>Bonferroni-adjusted threshold:</strong> ' + bonferroniAlpha.toFixed(4) + ' (alpha / ' + numComparisons + ')<br>';
            html += 'Your p-value (' + (p < 0.001 ? '< 0.001' : p.toFixed(4)) + ') is '
                + '<strong style="color:' + (bonferroniSig ? 'var(--success)' : 'var(--danger)') + ';">'
                + (bonferroniSig ? 'still significant' : 'NO LONGER significant') + '</strong> after Bonferroni correction.<br><br>';
            html += '<strong>Sidak-adjusted threshold:</strong> ' + sidakAlpha.toFixed(4) + ' (slightly less conservative)<br>';
            html += 'Your p-value is '
                + '<strong style="color:' + (sidakSig ? 'var(--success)' : 'var(--danger)') + ';">'
                + (sidakSig ? 'still significant' : 'NO LONGER significant') + '</strong> after Sidak correction.<br><br>';
            html += '<span style="font-size:0.82rem;color:var(--text-secondary);">Bonferroni is very conservative. If comparisons are correlated, consider FDR (Benjamini-Hochberg) or Holm step-down procedure, which are more powerful.</span>';
            html += '</div></div>';
        }

        // Fragility Index concept
        html += '<div style="border-left:4px solid var(--warning);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Fragility Index Concept</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        html += 'The <strong>Fragility Index (FI)</strong> is the minimum number of patients whose outcome would need to change from a non-event to an event to flip this result from significant to non-significant (or vice versa).<br><br>';
        if (significant && p > 0.01) {
            html += '<span style="color:var(--warning);font-weight:600;">Since p = ' + pDisplay + ' is close to the threshold, the fragility index is likely <strong>low</strong> (1-5).</span> '
                + 'A small number of changed outcomes could reverse this conclusion. ';
        } else if (significant && p <= 0.01) {
            html += '<span style="color:var(--success);">Since p = ' + pDisplay + ' is well below 0.05, the fragility index is likely <strong>moderate to high</strong>.</span> ';
        } else {
            html += 'Since this result is not significant, the "reverse fragility index" asks: how many outcomes would need to change to <em>make</em> it significant? ';
        }
        html += '<br><br><span style="font-size:0.82rem;color:var(--text-secondary);">To calculate the exact FI, you need a 2x2 table from the original study. '
            + 'Iteratively move one patient from non-event to event in the treatment group and re-test until the p-value crosses the threshold. '
            + 'Many RCTs in major journals have FI of 0-3 (Walsh et al., JAMA 2014).</span>';
        html += '</div></div>';

        // Educational panel: What p-values do and don't tell you
        html += '<div style="border:2px solid var(--primary);border-radius:8px;padding:16px;margin-bottom:16px;">';
        html += '<div style="font-weight:700;color:var(--primary);margin-bottom:8px;">What This P-value Does and Does Not Tell You</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">';
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">';
        html += '<div style="background:var(--bg-tertiary);padding:12px;border-radius:8px;">';
        html += '<div style="font-weight:600;color:var(--success);margin-bottom:6px;">IT DOES TELL YOU:</div>';
        html += '<ul style="margin:0;padding-left:16px;">';
        html += '<li>How compatible your data are with the null hypothesis</li>';
        html += '<li>How surprising this result would be if H0 were true</li>';
        html += '<li>Whether to reject H0 at a pre-specified alpha (a binary decision rule)</li>';
        html += '<li>p = ' + pDisplay + ' means: if H0 were true and the study repeated many times, ~' + (p * 100).toFixed(1) + '% of studies would show results this extreme or more</li>';
        html += '</ul></div>';
        html += '<div style="background:var(--bg-tertiary);padding:12px;border-radius:8px;">';
        html += '<div style="font-weight:600;color:var(--danger);margin-bottom:6px;">IT DOES NOT TELL YOU:</div>';
        html += '<ul style="margin:0;padding-left:16px;">';
        html += '<li>The probability that H0 is true (that requires Bayesian analysis)</li>';
        html += '<li>The size of the effect (a tiny effect can have a tiny p-value with large N)</li>';
        html += '<li>Clinical or practical significance</li>';
        html += '<li>Whether the study was well-designed or unbiased</li>';
        html += '<li>Whether the result will replicate</li>';
        html += '<li>The probability the result is a false positive (that depends on prior probability)</li>';
        html += '</ul></div>';
        html += '</div></div></div>';

        html += '<div style="border:1px solid var(--danger);border-radius:8px;padding:16px;margin-top:16px;">';
        html += '<div style="font-weight:700;color:var(--danger);margin-bottom:8px;">Common Misinterpretations to Avoid</div>';
        html += '<div style="font-size:0.85rem;line-height:1.7;">';
        html += '<ul style="margin-left:16px;">';
        html += '<li><strong>Wrong:</strong> "There is a ' + (p * 100).toFixed(1) + '% probability that the null hypothesis is true."<br>'
            + '<strong>Correct:</strong> The p-value is the probability of the data (or more extreme data) given the null is true, not the probability of the null being true.</li>';
        html += '<li style="margin-top:8px;"><strong>Wrong:</strong> "The result is ' + (significant ? '' : 'not ') + 'significant, so the effect is ' + (significant ? 'real.' : 'zero."') + '<br>'
            + '<strong>Correct:</strong> P-values are continuous measures of evidence. The 0.05 threshold is arbitrary. A p-value of 0.049 is not meaningfully different from 0.051.</li>';
        html += '<li style="margin-top:8px;"><strong>Wrong:</strong> "The p-value tells us the size of the effect."<br>'
            + '<strong>Correct:</strong> P-values conflate effect size and sample size. A tiny effect with a large N can yield a small p-value.</li>';
        html += '<li style="margin-top:8px;"><strong>Wrong:</strong> "A significant p-value means the study is well-designed."<br>'
            + '<strong>Correct:</strong> A biased study can produce a significant p-value. Significance does not validate the methodology.</li>';
        html += '</ul></div></div>';

        html += '</div>';
        App.setTrustedHTML(document.getElementById('pv-results'), html);
    }

    function copyPValue() {
        var el = document.getElementById('pv-results');
        if (el) Export.copyText(el.textContent);
    }

    // ================================================================
    // CARD 2: Confidence Interval Interpreter
    // ================================================================
    function renderCI() {
        var html = '<div class="card">';
        html += '<div class="card-title">Confidence Interval Interpreter</div>';
        html += '<div class="card-subtitle">Enter a point estimate with its confidence interval for a plain-English interpretation.</div>';

        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">Point Estimate</label>'
            + '<input type="number" class="form-input" id="ci-point" name="ci-point" step="0.01" value="1.85"></div>';
        html += '<div class="form-group"><label class="form-label">Lower Bound</label>'
            + '<input type="number" class="form-input" id="ci-lower" name="ci-lower" step="0.01" value="1.20"></div>';
        html += '<div class="form-group"><label class="form-label">Upper Bound</label>'
            + '<input type="number" class="form-input" id="ci-upper" name="ci-upper" step="0.01" value="2.85"></div>';
        html += '<div class="form-group"><label class="form-label">Confidence Level (%)</label>'
            + '<input type="number" class="form-input" id="ci-level" name="ci-level" step="1" min="80" max="99" value="95"></div>';
        html += '</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Type of Measure</label>'
            + '<select class="form-select" id="ci-measure" name="ci-measure">'
            + '<option value="mean_diff">Mean Difference</option>'
            + '<option value="rr" selected>Risk Ratio (RR)</option>'
            + '<option value="or">Odds Ratio (OR)</option>'
            + '<option value="hr">Hazard Ratio (HR)</option>'
            + '<option value="rd">Risk Difference</option>'
            + '<option value="correlation">Correlation (r)</option>'
            + '</select></div>';
        html += '<div class="form-group"><label class="form-label">MCID (optional, for clinical significance)</label>'
            + '<input type="number" class="form-input" id="ci-mcid" name="ci-mcid" step="0.01" placeholder="e.g., 1.5 for RR or 5 for mean diff"></div>';
        html += '</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Clinical Decision Threshold (optional)</label>'
            + '<input type="number" class="form-input" id="ci-threshold" name="ci-threshold" step="0.01" placeholder="e.g., 2.0 for RR threshold"></div>';
        html += '<div class="form-group"><label class="form-label">Original Sample Size (optional, for halving CI)</label>'
            + '<input type="number" class="form-input" id="ci-sample-n" name="ci-sample-n" min="2" step="1" placeholder="e.g., 200"></div>';
        html += '</div>';

        html += '<div class="btn-group">'
            + '<button class="btn btn-primary" onclick="ResultsInterp.interpretCI()">Interpret</button>'
            + '<button class="btn btn-secondary" onclick="ResultsInterp.copyCI()">Copy</button>'
            + '</div>';

        html += '<div id="ci-results"></div>';
        html += '</div>';
        return html;
    }

    function interpretCI() {
        var point = parseFloat(document.getElementById('ci-point').value);
        var lower = parseFloat(document.getElementById('ci-lower').value);
        var upper = parseFloat(document.getElementById('ci-upper').value);
        var level = parseFloat(document.getElementById('ci-level').value);
        var measure = document.getElementById('ci-measure').value;
        var mcid = parseFloat(document.getElementById('ci-mcid').value);
        var clinThreshold = parseFloat(document.getElementById('ci-threshold').value);
        var ciSampleN = parseFloat(document.getElementById('ci-sample-n').value);

        if (isNaN(point) || isNaN(lower) || isNaN(upper)) return;

        var width = upper - lower;
        var nullValue = (measure === 'mean_diff' || measure === 'rd' || measure === 'correlation') ? 0 : 1;
        var nullLabel = nullValue === 0 ? '0' : '1';
        var excludesNull = (lower > nullValue) || (upper < nullValue);

        var measureLabel = {
            'mean_diff': 'mean difference',
            'rr': 'risk ratio',
            'or': 'odds ratio',
            'hr': 'hazard ratio',
            'rd': 'risk difference',
            'correlation': 'correlation coefficient'
        }[measure] || measure;

        var html = '<div class="result-panel mt-2">';
        html += '<div class="card-title">Confidence Interval Interpretation</div>';

        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Plain English</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        html += 'The ' + measureLabel + ' is <strong>' + point.toFixed(2) + '</strong> (' + level + '% CI: ' + lower.toFixed(2) + ' to ' + upper.toFixed(2) + '). ';
        html += 'We are ' + level + '% confident that the true ' + measureLabel + ' in the population lies between ' + lower.toFixed(2) + ' and ' + upper.toFixed(2) + '. ';
        html += 'If this study were repeated many times, ' + level + '% of the computed confidence intervals would contain the true value.';
        html += '</div></div>';

        html += '<div style="border-left:4px solid ' + (excludesNull ? 'var(--success)' : 'var(--warning)') + ';padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Null Value Assessment</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        if (excludesNull) {
            html += 'The ' + level + '% CI <strong style="color:var(--success);">excludes the null value (' + nullLabel + ')</strong>. '
                + 'This is consistent with statistical significance at alpha = ' + (1 - level / 100).toFixed(2) + '. ';
            if (measure === 'rr' || measure === 'or' || measure === 'hr') {
                if (lower > 1) html += 'The entire CI is above 1, suggesting an <strong>increased risk</strong> (harmful association).';
                else if (upper < 1) html += 'The entire CI is below 1, suggesting a <strong>decreased risk</strong> (protective association).';
            } else if (measure === 'mean_diff' || measure === 'rd') {
                if (lower > 0) html += 'The entire CI is above 0, suggesting a <strong>positive effect</strong>.';
                else if (upper < 0) html += 'The entire CI is below 0, suggesting a <strong>negative effect</strong>.';
            }
        } else {
            html += 'The ' + level + '% CI <strong style="color:var(--warning);">includes the null value (' + nullLabel + ')</strong>. '
                + 'This is consistent with the result not being statistically significant at alpha = ' + (1 - level / 100).toFixed(2) + '. '
                + 'However, the point estimate of ' + point.toFixed(2) + ' may still be clinically meaningful.';
        }
        html += '</div></div>';

        html += '<div style="border-left:4px solid var(--text-tertiary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Precision Assessment</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        html += 'CI width: ' + width.toFixed(2) + '. ';
        if (measure === 'rr' || measure === 'or' || measure === 'hr') {
            var ratio = upper / lower;
            if (ratio < 2) html += 'The CI is relatively <strong>narrow</strong>, indicating good precision.';
            else if (ratio < 4) html += 'The CI is <strong>moderately wide</strong>. The estimate has moderate precision.';
            else html += 'The CI is <strong>wide</strong>, indicating substantial uncertainty in the estimate. Consider whether the study had adequate sample size.';
        } else {
            if (width < Math.abs(point) * 0.5) html += 'The CI is relatively <strong>narrow</strong> relative to the point estimate, indicating good precision.';
            else if (width < Math.abs(point) * 1.5) html += 'The CI is <strong>moderately wide</strong> relative to the point estimate.';
            else html += 'The CI is <strong>wide</strong> relative to the point estimate, indicating substantial uncertainty.';
        }
        html += '</div></div>';

        if (!isNaN(mcid)) {
            html += '<div style="border-left:4px solid var(--success);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
            html += '<div style="font-weight:600;margin-bottom:4px;">Clinical Significance</div>';
            html += '<div style="font-size:0.95rem;line-height:1.6;">';
            html += 'Minimum clinically important difference (MCID): <strong>' + mcid + '</strong>. ';
            if (measure === 'rr' || measure === 'or' || measure === 'hr') {
                if (lower >= mcid) html += 'The entire CI exceeds the MCID. The result is likely <strong>clinically significant</strong>.';
                else if (point >= mcid) html += 'The point estimate exceeds the MCID, but the lower bound (' + lower.toFixed(2) + ') does not. Clinical significance is <strong>possible but uncertain</strong>.';
                else html += 'The point estimate is below the MCID. The result is unlikely to be <strong>clinically significant</strong>.';
            } else {
                if (lower >= mcid || (mcid < 0 && upper <= mcid)) html += 'The entire CI exceeds the MCID. The result is likely <strong>clinically significant</strong>.';
                else if (Math.abs(point) >= Math.abs(mcid)) html += 'The point estimate exceeds the MCID, but the CI includes values below the MCID. Clinical significance is <strong>possible but uncertain</strong>.';
                else html += 'The point estimate does not reach the MCID. The result may not be <strong>clinically significant</strong>.';
            }
            html += '</div></div>';
        }

        // Extended CI Analysis: Width, Relative Precision, Clinical Threshold
        html += '<div style="border-left:4px solid var(--accent-color, var(--primary));padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Extended Precision Analysis</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">';
        html += '<strong>CI Width:</strong> ' + width.toFixed(3) + '<br>';
        // Relative precision: ratio of CI width to absolute effect size
        var absPoint = Math.abs(point);
        if (absPoint > 0.001) {
            var relPrecision = width / absPoint;
            html += '<strong>Relative Precision (CI width / |effect|):</strong> ' + relPrecision.toFixed(2);
            if (relPrecision < 0.5) html += ' -- <span style="color:var(--success);">Excellent precision</span>. CI is narrow relative to effect.';
            else if (relPrecision < 1.0) html += ' -- <span style="color:var(--primary);">Good precision</span>. CI is reasonably narrow.';
            else if (relPrecision < 2.0) html += ' -- <span style="color:var(--warning);">Moderate precision</span>. CI is relatively wide.';
            else html += ' -- <span style="color:var(--danger);">Poor precision</span>. CI is very wide relative to the effect.';
            html += '<br>';
        }
        // Symmetry check (for ratios, check on log scale)
        if (measure === 'rr' || measure === 'or' || measure === 'hr') {
            if (point > 0 && lower > 0 && upper > 0) {
                var logPoint = Math.log(point);
                var logLower = Math.log(lower);
                var logUpper = Math.log(upper);
                var lowerDist = logPoint - logLower;
                var upperDist = logUpper - logPoint;
                var asymmetry = Math.abs(lowerDist - upperDist) / ((lowerDist + upperDist) / 2);
                html += '<strong>CI Symmetry (log scale):</strong> ';
                if (asymmetry < 0.1) html += 'Symmetric -- consistent with standard modeling.';
                else html += 'Asymmetry ratio = ' + asymmetry.toFixed(2) + '. Some asymmetry on log scale. May indicate back-transformation or non-standard CI method.';
                html += '<br>';
            }
        }
        html += '</div></div>';

        // Clinical decision threshold
        if (!isNaN(clinThreshold)) {
            html += '<div style="border-left:4px solid var(--danger);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
            html += '<div style="font-weight:600;margin-bottom:4px;">Clinical Decision Threshold Analysis</div>';
            html += '<div style="font-size:0.95rem;line-height:1.6;">';
            html += 'Clinical decision threshold: <strong>' + clinThreshold + '</strong><br>';
            var crossesThreshold = (lower <= clinThreshold && upper >= clinThreshold);
            var entirelyAbove = lower > clinThreshold;
            var entirelyBelow = upper < clinThreshold;
            if (entirelyAbove) {
                html += 'The entire CI is <strong style="color:var(--success);">above</strong> the threshold of ' + clinThreshold + '. The true value almost certainly exceeds this threshold.';
            } else if (entirelyBelow) {
                html += 'The entire CI is <strong style="color:var(--primary);">below</strong> the threshold of ' + clinThreshold + '. The true value almost certainly falls short of this threshold.';
            } else {
                html += 'The CI <strong style="color:var(--warning);">crosses</strong> the clinical decision threshold of ' + clinThreshold + '. ';
                html += 'The data are inconclusive regarding whether the true effect exceeds this threshold.';
            }
            html += '</div></div>';
        }

        // Sample size needed to halve the CI
        if (!isNaN(ciSampleN) && ciSampleN > 1) {
            html += '<div style="border-left:4px solid var(--warning);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
            html += '<div style="font-weight:600;margin-bottom:4px;">Sample Size to Improve Precision</div>';
            html += '<div style="font-size:0.95rem;line-height:1.6;">';
            // CI width is proportional to 1/sqrt(n), so to halve width, need 4x the sample
            var nHalf = Math.ceil(ciSampleN * 4);
            var nQuarter = Math.ceil(ciSampleN * 16);
            var halfWidth = width / 2;
            var quarterWidth = width / 4;
            html += 'Current CI width: <strong>' + width.toFixed(3) + '</strong> (n = ' + Math.round(ciSampleN) + ')<br>';
            html += 'To halve the CI width to ~' + halfWidth.toFixed(3) + ': need <strong>n ~ ' + nHalf + '</strong> (4x current sample)<br>';
            html += 'To quarter the CI width to ~' + quarterWidth.toFixed(3) + ': need <strong>n ~ ' + nQuarter + '</strong> (16x current sample)<br>';
            html += '<span style="font-size:0.82rem;color:var(--text-secondary);">Assumes CI width scales as 1/sqrt(n). This is exact for means and approximate for ratios (on the log scale). '
                + 'Actual requirements depend on the specific statistic and design.</span>';
            html += '</div></div>';
        }

        html += '</div>';
        App.setTrustedHTML(document.getElementById('ci-results'), html);
    }

    function copyCI() {
        var el = document.getElementById('ci-results');
        if (el) Export.copyText(el.textContent);
    }

    // ================================================================
    // CARD 3: Effect Size Interpreter (same as original)
    // ================================================================
    function renderEffectSize() {
        var html = '<div class="card">';
        html += '<div class="card-title">Effect Size Interpreter</div>';
        html += '<div class="card-subtitle">Enter an effect size and its type for a plain-English interpretation with magnitude classification.</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Effect Size Value</label>'
            + '<input type="number" class="form-input" id="es-value" name="es-value" step="0.01" value="0.50"></div>';
        html += '<div class="form-group"><label class="form-label">Effect Size Type</label>'
            + '<select class="form-select" id="es-type" name="es-type" onchange="ResultsInterp.updateESLabels()">'
            + '<option value="cohens_d" selected>Cohen\'s d</option>'
            + '<option value="or">Odds Ratio</option>'
            + '<option value="rr">Risk Ratio</option>'
            + '<option value="hr">Hazard Ratio</option>'
            + '<option value="r2">R-squared</option>'
            + '<option value="r">Correlation (r)</option>'
            + '<option value="nnt">Number Needed to Treat (NNT)</option>'
            + '<option value="rd">Risk Difference</option>'
            + '</select></div>';
        html += '</div>';

        html += '<div class="btn-group">'
            + '<button class="btn btn-primary" onclick="ResultsInterp.interpretES()">Interpret</button>'
            + '<button class="btn btn-secondary" onclick="ResultsInterp.copyES()">Copy</button>'
            + '</div>';

        html += '<div id="es-results"></div>';
        html += '</div>';
        return html;
    }

    function updateESLabels() { }

    function interpretES() {
        var value = parseFloat(document.getElementById('es-value').value);
        var type = document.getElementById('es-type').value;
        if (isNaN(value)) return;

        var magnitude = '', plainEnglish = '', benchmark = '', barWidth = 0, barColor = '';

        switch (type) {
            case 'cohens_d':
                var absD = Math.abs(value);
                if (absD < 0.2) { magnitude = 'Negligible'; barWidth = 10; barColor = 'var(--text-tertiary)'; }
                else if (absD < 0.5) { magnitude = 'Small'; barWidth = 25; barColor = 'var(--warning)'; }
                else if (absD < 0.8) { magnitude = 'Medium'; barWidth = 50; barColor = 'var(--primary)'; }
                else if (absD < 1.2) { magnitude = 'Large'; barWidth = 75; barColor = 'var(--success)'; }
                else { magnitude = 'Very Large'; barWidth = 95; barColor = 'var(--danger)'; }
                plainEnglish = 'A Cohen\'s d of ' + value.toFixed(2) + ' means the treatment group scored ' + Math.abs(value).toFixed(2) + ' standard deviations ' + (value > 0 ? 'higher' : 'lower') + ' than the control group.';
                benchmark = 'Cohen (1988): Small = 0.2, Medium = 0.5, Large = 0.8. In stroke rehabilitation: d = 0.2 may represent a meaningful clinical change.';
                break;
            case 'or':
                if (value >= 0.8 && value <= 1.25) { magnitude = 'Negligible'; barWidth = 10; barColor = 'var(--text-tertiary)'; }
                else if ((value > 1.25 && value <= 2) || (value >= 0.5 && value < 0.8)) { magnitude = 'Small'; barWidth = 25; barColor = 'var(--warning)'; }
                else if ((value > 2 && value <= 4) || (value >= 0.25 && value < 0.5)) { magnitude = 'Medium'; barWidth = 50; barColor = 'var(--primary)'; }
                else { magnitude = 'Large'; barWidth = 75; barColor = 'var(--success)'; }
                plainEnglish = value > 1 ? 'An odds ratio of ' + value.toFixed(2) + ' means the odds are ' + value.toFixed(2) + ' times higher in the exposed group.' : value < 1 ? 'An odds ratio of ' + value.toFixed(2) + ' means the odds are ' + ((1 - value) * 100).toFixed(0) + '% lower (protective).' : 'An odds ratio of 1.00 means no difference.';
                benchmark = 'Chen et al. (2010): OR 1.5 ~ d=0.2, OR 2.5 ~ d=0.5, OR 4.3 ~ d=0.8.';
                break;
            case 'rr':
                if (value >= 0.9 && value <= 1.1) { magnitude = 'Negligible'; barWidth = 10; barColor = 'var(--text-tertiary)'; }
                else if ((value > 1.1 && value <= 1.5) || (value >= 0.67 && value < 0.9)) { magnitude = 'Small'; barWidth = 25; barColor = 'var(--warning)'; }
                else if ((value > 1.5 && value <= 3) || (value >= 0.33 && value < 0.67)) { magnitude = 'Medium'; barWidth = 50; barColor = 'var(--primary)'; }
                else { magnitude = 'Large'; barWidth = 75; barColor = 'var(--success)'; }
                plainEnglish = value > 1 ? 'A risk ratio of ' + value.toFixed(2) + ' means ' + ((value - 1) * 100).toFixed(0) + '% increased risk.' : value < 1 ? 'A risk ratio of ' + value.toFixed(2) + ' means ' + ((1 - value) * 100).toFixed(0) + '% lower risk (protective).' : 'RR of 1.00 means no difference.';
                benchmark = 'RR 1.5-2.0 for modifiable risk factors is common. RR > 3 is strong (e.g., AF and stroke).';
                break;
            case 'hr':
                if (value >= 0.9 && value <= 1.1) { magnitude = 'Negligible'; barWidth = 10; barColor = 'var(--text-tertiary)'; }
                else if ((value > 1.1 && value <= 1.5) || (value >= 0.67 && value < 0.9)) { magnitude = 'Small'; barWidth = 25; barColor = 'var(--warning)'; }
                else if ((value > 1.5 && value <= 3) || (value >= 0.33 && value < 0.67)) { magnitude = 'Medium'; barWidth = 50; barColor = 'var(--primary)'; }
                else { magnitude = 'Large'; barWidth = 75; barColor = 'var(--success)'; }
                plainEnglish = value > 1 ? 'A hazard ratio of ' + value.toFixed(2) + ' means the event rate is ' + ((value - 1) * 100).toFixed(0) + '% higher.' : value < 1 ? 'A hazard ratio of ' + value.toFixed(2) + ' means the event rate is ' + ((1 - value) * 100).toFixed(0) + '% lower (protective).' : 'HR of 1.00 means no difference.';
                benchmark = 'Interpreted similarly to RR. HR assumes proportional hazards.';
                break;
            case 'r2':
                if (value < 0.02) { magnitude = 'Negligible'; barWidth = 5; barColor = 'var(--text-tertiary)'; }
                else if (value < 0.13) { magnitude = 'Small'; barWidth = 25; barColor = 'var(--warning)'; }
                else if (value < 0.26) { magnitude = 'Medium'; barWidth = 50; barColor = 'var(--primary)'; }
                else { magnitude = 'Large'; barWidth = 75; barColor = 'var(--success)'; }
                plainEnglish = 'An R-squared of ' + value.toFixed(3) + ' means ' + (value * 100).toFixed(1) + '% of variance is explained.';
                benchmark = 'Cohen (1988): Small=0.02, Medium=0.13, Large=0.26. R-sq of 0.20-0.40 often meaningful.';
                break;
            case 'r':
                var absR = Math.abs(value);
                if (absR < 0.1) { magnitude = 'Negligible'; barWidth = 5; barColor = 'var(--text-tertiary)'; }
                else if (absR < 0.3) { magnitude = 'Small'; barWidth = 25; barColor = 'var(--warning)'; }
                else if (absR < 0.5) { magnitude = 'Medium'; barWidth = 50; barColor = 'var(--primary)'; }
                else { magnitude = 'Large'; barWidth = 75; barColor = 'var(--success)'; }
                plainEnglish = 'Correlation of ' + value.toFixed(2) + ': ' + magnitude.toLowerCase() + ' ' + (value >= 0 ? 'positive' : 'negative') + ' relationship. Explains ' + (value * value * 100).toFixed(1) + '% of variance.';
                benchmark = 'Cohen (1988): Small=0.10, Medium=0.30, Large=0.50.';
                break;
            case 'nnt':
                var absNNT = Math.abs(value);
                if (absNNT <= 5) { magnitude = 'Very effective'; barWidth = 90; barColor = 'var(--success)'; }
                else if (absNNT <= 20) { magnitude = 'Moderately effective'; barWidth = 60; barColor = 'var(--primary)'; }
                else if (absNNT <= 50) { magnitude = 'Somewhat effective'; barWidth = 35; barColor = 'var(--warning)'; }
                else { magnitude = 'Minimally effective'; barWidth = 15; barColor = 'var(--danger)'; }
                plainEnglish = 'NNT of ' + Math.round(absNNT) + ': treat ' + Math.round(absNNT) + ' patients to prevent 1 adverse outcome.';
                benchmark = 'Stroke thrombolysis NNT ~ 7-8. Statin primary prevention NNT ~ 50-100 over 5 years.';
                break;
            case 'rd':
                var absRD = Math.abs(value);
                if (absRD < 0.01) { magnitude = 'Negligible'; barWidth = 5; barColor = 'var(--text-tertiary)'; }
                else if (absRD < 0.05) { magnitude = 'Small'; barWidth = 25; barColor = 'var(--warning)'; }
                else if (absRD < 0.15) { magnitude = 'Medium'; barWidth = 50; barColor = 'var(--primary)'; }
                else { magnitude = 'Large'; barWidth = 75; barColor = 'var(--success)'; }
                plainEnglish = 'Risk difference of ' + (value * 100).toFixed(1) + ' percentage points. NNT = ' + Math.round(1 / Math.abs(value)) + '.';
                benchmark = 'Absolute measures are essential for clinical decisions. NNT = 1/|RD|.';
                break;
        }

        var html = '<div class="result-panel mt-2">';
        html += '<div class="card-title">Effect Size Interpretation</div>';
        html += '<div style="text-align:center;margin-bottom:16px;">';
        html += '<div style="display:inline-block;padding:8px 24px;border-radius:20px;font-weight:700;font-size:1.1rem;background:' + barColor + ';color:white;">' + magnitude + '</div>';
        html += '</div>';
        html += '<div style="margin-bottom:16px;padding:0 20px;"><div style="background:var(--bg-tertiary);border-radius:8px;height:32px;overflow:hidden;position:relative;">';
        html += '<div style="background:' + barColor + ';height:100%;width:' + barWidth + '%;border-radius:8px;transition:width 0.5s;"></div>';
        html += '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-weight:600;font-size:0.85rem;">' + type.replace('_', ' ').toUpperCase() + ' = ' + value.toFixed(2) + '</div>';
        html += '</div></div>';
        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Plain English</div>';
        html += '<div style="font-size:0.95rem;line-height:1.6;">' + plainEnglish + '</div></div>';
        html += '<div style="border-left:4px solid var(--text-tertiary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Context & Benchmarks</div>';
        html += '<div style="font-size:0.9rem;line-height:1.6;">' + benchmark + '</div></div>';
        html += '</div>';
        App.setTrustedHTML(document.getElementById('es-results'), html);
    }

    function copyES() { var el = document.getElementById('es-results'); if (el) Export.copyText(el.textContent); }

    // ================================================================
    // CARD 4: Regression Output Interpreter (abbreviated - same pattern)
    // ================================================================
    function renderRegression() {
        var html = '<div class="card">';
        html += '<div class="card-title">Regression Output Interpreter</div>';
        html += '<div class="card-subtitle">Enter regression coefficients and get a plain-English interpretation.</div>';

        html += '<div class="form-group"><label class="form-label">Regression Type</label>'
            + '<select class="form-select" id="reg-type" name="reg-type" onchange="ResultsInterp.updateRegFields()">'
            + '<option value="linear">Linear Regression</option>'
            + '<option value="logistic">Logistic Regression</option>'
            + '<option value="cox">Cox Proportional Hazards</option>'
            + '<option value="poisson">Poisson Regression</option>'
            + '</select></div>';

        html += '<div id="reg-fields-linear">';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">Coefficient (B)</label><input type="number" class="form-input" id="reg-lin-coef" step="0.01" value="2.50"></div>';
        html += '<div class="form-group"><label class="form-label">Std Error (SE)</label><input type="number" class="form-input" id="reg-lin-se" step="0.01" value="0.80"></div>';
        html += '<div class="form-group"><label class="form-label">t-statistic</label><input type="number" class="form-input" id="reg-lin-t" step="0.01" value="3.13"></div>';
        html += '<div class="form-group"><label class="form-label">P-value</label><input type="number" class="form-input" id="reg-lin-p" step="0.001" value="0.002"></div>';
        html += '</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">R-squared</label><input type="number" class="form-input" id="reg-lin-r2" step="0.01" min="0" max="1" value="0.35"></div>';
        html += '<div class="form-group"><label class="form-label">Predictor Name</label><input type="text" class="form-input" id="reg-lin-pred" value="Age"></div>';
        html += '<div class="form-group"><label class="form-label">Outcome Name</label><input type="text" class="form-input" id="reg-lin-out" value="NIHSS score"></div>';
        html += '</div></div>';

        html += '<div id="reg-fields-logistic" class="hidden">';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">Coefficient (log-OR)</label><input type="number" class="form-input" id="reg-log-coef" step="0.01" value="0.65"></div>';
        html += '<div class="form-group"><label class="form-label">Std Error</label><input type="number" class="form-input" id="reg-log-se" step="0.01" value="0.20"></div>';
        html += '<div class="form-group"><label class="form-label">OR</label><input type="number" class="form-input" id="reg-log-or" step="0.01" value="1.92"></div>';
        html += '<div class="form-group"><label class="form-label">P-value</label><input type="number" class="form-input" id="reg-log-p" step="0.001" value="0.001"></div>';
        html += '</div>';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">95% CI Lower</label><input type="number" class="form-input" id="reg-log-ci-lo" step="0.01" value="1.30"></div>';
        html += '<div class="form-group"><label class="form-label">95% CI Upper</label><input type="number" class="form-input" id="reg-log-ci-hi" step="0.01" value="2.83"></div>';
        html += '<div class="form-group"><label class="form-label">Predictor</label><input type="text" class="form-input" id="reg-log-pred" value="Hypertension"></div>';
        html += '<div class="form-group"><label class="form-label">Outcome</label><input type="text" class="form-input" id="reg-log-out" value="Stroke"></div>';
        html += '</div></div>';

        html += '<div id="reg-fields-cox" class="hidden">';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">Coefficient (log-HR)</label><input type="number" class="form-input" id="reg-cox-coef" step="0.01" value="0.47"></div>';
        html += '<div class="form-group"><label class="form-label">Std Error</label><input type="number" class="form-input" id="reg-cox-se" step="0.01" value="0.15"></div>';
        html += '<div class="form-group"><label class="form-label">HR</label><input type="number" class="form-input" id="reg-cox-hr" step="0.01" value="1.60"></div>';
        html += '<div class="form-group"><label class="form-label">P-value</label><input type="number" class="form-input" id="reg-cox-p" step="0.001" value="0.002"></div>';
        html += '</div>';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">95% CI Lower</label><input type="number" class="form-input" id="reg-cox-ci-lo" step="0.01" value="1.19"></div>';
        html += '<div class="form-group"><label class="form-label">95% CI Upper</label><input type="number" class="form-input" id="reg-cox-ci-hi" step="0.01" value="2.15"></div>';
        html += '<div class="form-group"><label class="form-label">Predictor</label><input type="text" class="form-input" id="reg-cox-pred" value="Diabetes"></div>';
        html += '<div class="form-group"><label class="form-label">Outcome</label><input type="text" class="form-input" id="reg-cox-out" value="Mortality"></div>';
        html += '</div></div>';

        html += '<div id="reg-fields-poisson" class="hidden">';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">Coefficient (log-IRR)</label><input type="number" class="form-input" id="reg-poi-coef" step="0.01" value="0.30"></div>';
        html += '<div class="form-group"><label class="form-label">Std Error</label><input type="number" class="form-input" id="reg-poi-se" step="0.01" value="0.10"></div>';
        html += '<div class="form-group"><label class="form-label">IRR</label><input type="number" class="form-input" id="reg-poi-irr" step="0.01" value="1.35"></div>';
        html += '<div class="form-group"><label class="form-label">P-value</label><input type="number" class="form-input" id="reg-poi-p" step="0.001" value="0.003"></div>';
        html += '</div>';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">95% CI Lower</label><input type="number" class="form-input" id="reg-poi-ci-lo" step="0.01" value="1.11"></div>';
        html += '<div class="form-group"><label class="form-label">95% CI Upper</label><input type="number" class="form-input" id="reg-poi-ci-hi" step="0.01" value="1.64"></div>';
        html += '<div class="form-group"><label class="form-label">Predictor</label><input type="text" class="form-input" id="reg-poi-pred" value="Smoking"></div>';
        html += '<div class="form-group"><label class="form-label">Outcome</label><input type="text" class="form-input" id="reg-poi-out" value="Seizure episodes"></div>';
        html += '</div></div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-primary" onclick="ResultsInterp.interpretReg()">Interpret</button><button class="btn btn-secondary" onclick="ResultsInterp.copyReg()">Copy</button></div>';
        html += '<div id="reg-results"></div>';
        html += '</div>';
        return html;
    }

    function updateRegFields() {
        var type = document.getElementById('reg-type').value;
        var types = ['linear', 'logistic', 'cox', 'poisson'];
        for (var i = 0; i < types.length; i++) {
            var el = document.getElementById('reg-fields-' + types[i]);
            if (el) { el.classList.toggle('hidden', types[i] !== type); }
        }
    }

    function interpretReg() {
        var type = document.getElementById('reg-type').value;
        var html = '';
        if (type === 'linear') html = interpretLinReg();
        else if (type === 'logistic') html = interpretLogReg();
        else if (type === 'cox') html = interpretCoxReg();
        else if (type === 'poisson') html = interpretPoiReg();
        App.setTrustedHTML(document.getElementById('reg-results'), html);
    }

    function interpretLinReg() {
        var coef = parseFloat(document.getElementById('reg-lin-coef').value), se = parseFloat(document.getElementById('reg-lin-se').value);
        var t = parseFloat(document.getElementById('reg-lin-t').value), p = parseFloat(document.getElementById('reg-lin-p').value);
        var r2 = parseFloat(document.getElementById('reg-lin-r2').value);
        var pred = document.getElementById('reg-lin-pred').value || 'Predictor', out = document.getElementById('reg-lin-out').value || 'Outcome';
        var ciLo = coef - 1.96 * se, ciHi = coef + 1.96 * se, significant = p < 0.05;
        var html = '<div class="result-panel mt-2"><div class="card-title">Linear Regression Interpretation</div>';
        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;margin-bottom:4px;">Coefficient</div><div style="font-size:0.95rem;line-height:1.6;">';
        html += 'For each one-unit increase in <strong>' + pred + '</strong>, <strong>' + out + '</strong> changes by <strong>' + coef.toFixed(2) + '</strong> units (95% CI: ' + ciLo.toFixed(2) + ' to ' + ciHi.toFixed(2) + '), holding other variables constant.</div></div>';
        html += '<div style="border-left:4px solid ' + (significant ? 'var(--success)' : 'var(--warning)') + ';padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;">Significance</div><div style="font-size:0.95rem;">t=' + t.toFixed(2) + ', p=' + (p < 0.001 ? '<0.001' : p.toFixed(4)) + '. <strong>' + (significant ? 'Significant' : 'Not significant') + '</strong> at alpha=0.05.</div></div>';
        if (!isNaN(r2)) {
            html += '<div style="border-left:4px solid var(--text-tertiary);padding:12px 16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
            html += '<div style="font-weight:600;">Model Fit</div><div style="font-size:0.95rem;">R-sq=' + r2.toFixed(3) + '. Model explains ' + (r2 * 100).toFixed(1) + '% of variance in ' + out + '.</div></div>';
        }
        html += '</div>';
        return html;
    }

    function interpretLogReg() {
        var coef = parseFloat(document.getElementById('reg-log-coef').value), se = parseFloat(document.getElementById('reg-log-se').value);
        var or_val = parseFloat(document.getElementById('reg-log-or').value), p = parseFloat(document.getElementById('reg-log-p').value);
        var ciLo = parseFloat(document.getElementById('reg-log-ci-lo').value), ciHi = parseFloat(document.getElementById('reg-log-ci-hi').value);
        var pred = document.getElementById('reg-log-pred').value || 'Predictor', out = document.getElementById('reg-log-out').value || 'Outcome';
        if (isNaN(or_val) && !isNaN(coef)) or_val = Math.exp(coef);
        if (isNaN(ciLo) && !isNaN(coef) && !isNaN(se)) ciLo = Math.exp(coef - 1.96 * se);
        if (isNaN(ciHi) && !isNaN(coef) && !isNaN(se)) ciHi = Math.exp(coef + 1.96 * se);
        var html = '<div class="result-panel mt-2"><div class="card-title">Logistic Regression Interpretation</div>';
        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;">OR Interpretation</div><div style="font-size:0.95rem;line-height:1.6;">';
        html += or_val > 1 ? pred + ' associated with ' + ((or_val - 1) * 100).toFixed(0) + '% increased odds of ' + out + ' (OR=' + or_val.toFixed(2) + ', 95% CI: ' + ciLo.toFixed(2) + '-' + ciHi.toFixed(2) + ').'
            : pred + ' associated with ' + ((1 - or_val) * 100).toFixed(0) + '% decreased odds of ' + out + ' (OR=' + or_val.toFixed(2) + ', 95% CI: ' + ciLo.toFixed(2) + '-' + ciHi.toFixed(2) + ').';
        html += '</div></div>';
        html += '<div style="border-left:4px solid ' + (p < 0.05 ? 'var(--success)' : 'var(--warning)') + ';padding:12px 16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;">Significance</div><div style="font-size:0.95rem;">p=' + (p < 0.001 ? '<0.001' : p.toFixed(4)) + '. ' + (p < 0.05 ? 'Significant' : 'Not significant') + ' at alpha=0.05. Note: OR approximates RR only when outcome is rare (<10%).</div></div>';
        html += '</div>';
        return html;
    }

    function interpretCoxReg() {
        var coef = parseFloat(document.getElementById('reg-cox-coef').value), se = parseFloat(document.getElementById('reg-cox-se').value);
        var hr = parseFloat(document.getElementById('reg-cox-hr').value), p = parseFloat(document.getElementById('reg-cox-p').value);
        var ciLo = parseFloat(document.getElementById('reg-cox-ci-lo').value), ciHi = parseFloat(document.getElementById('reg-cox-ci-hi').value);
        var pred = document.getElementById('reg-cox-pred').value || 'Predictor', out = document.getElementById('reg-cox-out').value || 'Outcome';
        if (isNaN(hr) && !isNaN(coef)) hr = Math.exp(coef);
        if (isNaN(ciLo) && !isNaN(coef) && !isNaN(se)) ciLo = Math.exp(coef - 1.96 * se);
        if (isNaN(ciHi) && !isNaN(coef) && !isNaN(se)) ciHi = Math.exp(coef + 1.96 * se);
        var html = '<div class="result-panel mt-2"><div class="card-title">Cox Regression Interpretation</div>';
        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;">HR Interpretation</div><div style="font-size:0.95rem;line-height:1.6;">';
        html += hr > 1 ? pred + ': ' + ((hr - 1) * 100).toFixed(0) + '% increased hazard of ' + out + ' (HR=' + hr.toFixed(2) + ', 95% CI: ' + ciLo.toFixed(2) + '-' + ciHi.toFixed(2) + ').'
            : pred + ': ' + ((1 - hr) * 100).toFixed(0) + '% decreased hazard of ' + out + ' (HR=' + hr.toFixed(2) + ', 95% CI: ' + ciLo.toFixed(2) + '-' + ciHi.toFixed(2) + ').';
        html += '</div></div>';
        html += '<div style="border-left:4px solid var(--warning);padding:12px 16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;">Assumption</div><div style="font-size:0.85rem;">Proportional hazards assumed. Check with Schoenfeld residuals. p=' + (p < 0.001 ? '<0.001' : p.toFixed(4)) + '.</div></div>';
        html += '</div>';
        return html;
    }

    function interpretPoiReg() {
        var coef = parseFloat(document.getElementById('reg-poi-coef').value), se = parseFloat(document.getElementById('reg-poi-se').value);
        var irr = parseFloat(document.getElementById('reg-poi-irr').value), p = parseFloat(document.getElementById('reg-poi-p').value);
        var ciLo = parseFloat(document.getElementById('reg-poi-ci-lo').value), ciHi = parseFloat(document.getElementById('reg-poi-ci-hi').value);
        var pred = document.getElementById('reg-poi-pred').value || 'Predictor', out = document.getElementById('reg-poi-out').value || 'Outcome';
        if (isNaN(irr) && !isNaN(coef)) irr = Math.exp(coef);
        if (isNaN(ciLo) && !isNaN(coef) && !isNaN(se)) ciLo = Math.exp(coef - 1.96 * se);
        if (isNaN(ciHi) && !isNaN(coef) && !isNaN(se)) ciHi = Math.exp(coef + 1.96 * se);
        var html = '<div class="result-panel mt-2"><div class="card-title">Poisson Regression Interpretation</div>';
        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;">IRR Interpretation</div><div style="font-size:0.95rem;">';
        html += irr > 1 ? pred + ': rate of ' + out + ' is ' + ((irr - 1) * 100).toFixed(0) + '% higher (IRR=' + irr.toFixed(2) + ', 95% CI: ' + ciLo.toFixed(2) + '-' + ciHi.toFixed(2) + ').'
            : pred + ': rate of ' + out + ' is ' + ((1 - irr) * 100).toFixed(0) + '% lower (IRR=' + irr.toFixed(2) + ', 95% CI: ' + ciLo.toFixed(2) + '-' + ciHi.toFixed(2) + ').';
        html += '</div></div>';
        html += '<div style="border-left:4px solid var(--warning);padding:12px 16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:600;">Assumption</div><div style="font-size:0.85rem;">Poisson assumes mean=variance. If overdispersed, use negative binomial. p=' + (p < 0.001 ? '<0.001' : p.toFixed(4)) + '.</div></div>';
        html += '</div>';
        return html;
    }

    function copyReg() { var el = document.getElementById('reg-results'); if (el) Export.copyText(el.textContent); }

    // ================================================================
    // CARD 5: Forest Plot Interpreter
    // ================================================================
    function renderForestPlotGuide() {
        var html = '<div class="card">';
        html += '<div class="card-title">Forest Plot Interpreter</div>';
        html += '<div class="card-subtitle">Visual guide to reading and interpreting forest plots from meta-analyses.</div>';

        html += '<div style="font-family:monospace;font-size:0.78rem;line-height:1.4;background:var(--bg-primary);border:1px solid var(--border);padding:16px;border-radius:8px;overflow-x:auto;white-space:pre;">';
        html += 'Study              ES    [95% CI]       Weight  \n';
        html += '-----------------------------------------------\n';
        html += 'Smith 2018   ----[===]----            0.72 [0.51, 1.02]  15%\n';
        html += 'Jones 2019        --[====]---         0.85 [0.65, 1.12]  22%\n';
        html += 'Lee 2020         ---[=]--             0.68 [0.55, 0.84]  28%\n';
        html += 'Brown 2021     ----[==]-----          0.75 [0.48, 1.18]  12%\n';
        html += 'Davis 2022         -[====]-           0.80 [0.68, 0.94]  23%\n';
        html += '-----------------------------------------------\n';
        html += 'Overall (RE)     --[<>]--             0.77 [0.67, 0.88] 100%\n';
        html += '                   |                                      \n';
        html += '                 1.0 (null)                               \n';
        html += '           Favors treatment | Favors control              \n';
        html += '</div>';

        html += '<div style="margin-top:12px;">';
        var items = [
            { label: 'Square (===)', desc: 'Point estimate for each study. Size is proportional to the study weight (precision).' },
            { label: 'Horizontal line (---)', desc: 'Confidence interval. If it crosses the null line (1.0 for ratios, 0 for differences), the result is not statistically significant.' },
            { label: 'Diamond (<>)', desc: 'Pooled (summary) estimate. Width represents the CI of the pooled estimate.' },
            { label: 'Vertical null line', desc: 'Line of no effect (OR/RR/HR = 1, or mean difference = 0). Studies whose CI crosses this line are not individually significant.' },
            { label: 'Heterogeneity (I-sq)', desc: 'Reported below the plot. I-sq > 50% = substantial heterogeneity. Consider random-effects model and explore sources.' },
            { label: 'Weight (%)', desc: 'Each study\'s contribution to the pooled estimate. In fixed-effects: based on variance. In random-effects: also considers between-study variance.' }
        ];
        for (var i = 0; i < items.length; i++) {
            html += '<div style="display:flex;gap:8px;margin-bottom:8px;font-size:0.88rem;line-height:1.6;">';
            html += '<div style="font-weight:600;min-width:160px;color:var(--primary);">' + items[i].label + '</div>';
            html += '<div>' + items[i].desc + '</div></div>';
        }
        html += '</div>';

        html += '<div style="background:var(--bg-tertiary);border-radius:8px;padding:12px;margin-top:12px;font-size:0.85rem;line-height:1.7;">';
        html += '<strong>Checklist when reading a forest plot:</strong> (1) Does the pooled diamond cross the null? (2) How much heterogeneity (I-sq)? '
            + '(3) Are studies consistent in direction? (4) Are any studies outliers? (5) Is the model fixed or random effects?';
        html += '</div>';
        html += '</div>';
        return html;
    }

    // ================================================================
    // CARD 5b: Forest Plot Data Reader (NEW)
    // ================================================================
    function renderForestPlotReader() {
        var html = '<div class="card">';
        html += '<div class="card-title">Forest Plot Data Reader</div>';
        html += '<div class="card-subtitle">Enter study-level data from a meta-analysis to generate a text-based forest plot table with pooled estimate. Useful for quickly visualizing and sharing results.</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Measure Type</label>'
            + '<select class="form-select" id="fpr-measure" name="fpr-measure">'
            + '<option value="ratio" selected>Ratio (OR/RR/HR, null=1)</option>'
            + '<option value="diff">Difference (MD/SMD/RD, null=0)</option>'
            + '</select></div>';
        html += '<div class="form-group"><label class="form-label">Pooling Method</label>'
            + '<select class="form-select" id="fpr-method" name="fpr-method">'
            + '<option value="iv" selected>Inverse Variance (fixed)</option>'
            + '<option value="simple">Simple Average</option>'
            + '</select></div>';
        html += '</div>';

        for (var i = 1; i <= 8; i++) {
            html += '<div style="border:1px solid var(--border);border-radius:8px;padding:8px 10px;margin-bottom:4px;">';
            html += '<div class="form-row form-row--4" style="margin-bottom:0;">';
            html += '<div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:0.78rem;">Study ' + i + ' Name</label>'
                + '<input type="text" class="form-input" id="fpr-name-' + i + '" placeholder="e.g., Smith 2020"></div>';
            html += '<div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:0.78rem;">Effect Size</label>'
                + '<input type="number" class="form-input" id="fpr-es-' + i + '" step="0.01"></div>';
            html += '<div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:0.78rem;">CI Lower</label>'
                + '<input type="number" class="form-input" id="fpr-lo-' + i + '" step="0.01"></div>';
            html += '<div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:0.78rem;">CI Upper</label>'
                + '<input type="number" class="form-input" id="fpr-hi-' + i + '" step="0.01"></div>';
            html += '</div></div>';
        }

        html += '<div class="btn-group mt-1">';
        html += '<button class="btn btn-primary" onclick="ResultsInterp.buildForestPlot()">Generate Forest Plot</button>';
        html += '<button class="btn btn-secondary" onclick="ResultsInterp.copyForestPlot()">Copy as Table</button>';
        html += '</div>';
        html += '<div id="fpr-results"></div>';
        html += '</div>';
        return html;
    }

    function buildForestPlot() {
        var measureType = document.getElementById('fpr-measure').value;
        var method = document.getElementById('fpr-method').value;
        var nullVal = measureType === 'ratio' ? 1 : 0;
        var studies = [];

        for (var i = 1; i <= 8; i++) {
            var name = (document.getElementById('fpr-name-' + i).value || '').trim();
            if (!name) continue;
            var es = parseFloat(document.getElementById('fpr-es-' + i).value);
            var lo = parseFloat(document.getElementById('fpr-lo-' + i).value);
            var hi = parseFloat(document.getElementById('fpr-hi-' + i).value);
            if (isNaN(es) || isNaN(lo) || isNaN(hi)) continue;
            // Calculate SE from CI (assuming 95% CI)
            var se;
            if (measureType === 'ratio' && es > 0 && lo > 0 && hi > 0) {
                se = (Math.log(hi) - Math.log(lo)) / (2 * 1.96);
            } else {
                se = (hi - lo) / (2 * 1.96);
            }
            var weight = (se > 0) ? 1 / (se * se) : 1;
            studies.push({ name: name, es: es, lo: lo, hi: hi, se: se, weight: weight });
        }

        if (studies.length === 0) {
            App.setTrustedHTML(document.getElementById('fpr-results'), '<p style="color:var(--text-secondary);margin-top:12px;">Enter at least one study with name, effect size, and CI bounds.</p>');
            return;
        }

        // Compute pooled estimate (inverse-variance fixed-effect)
        var totalWeight = 0;
        var weightedSum = 0;
        for (var s = 0; s < studies.length; s++) {
            totalWeight += studies[s].weight;
            if (measureType === 'ratio' && studies[s].es > 0) {
                weightedSum += studies[s].weight * Math.log(studies[s].es);
            } else {
                weightedSum += studies[s].weight * studies[s].es;
            }
        }
        var pooledEst, pooledSE, pooledLo, pooledHi;
        if (method === 'iv') {
            if (measureType === 'ratio') {
                var logPooled = weightedSum / totalWeight;
                pooledEst = Math.exp(logPooled);
                pooledSE = Math.sqrt(1 / totalWeight);
                pooledLo = Math.exp(logPooled - 1.96 * pooledSE);
                pooledHi = Math.exp(logPooled + 1.96 * pooledSE);
            } else {
                pooledEst = weightedSum / totalWeight;
                pooledSE = Math.sqrt(1 / totalWeight);
                pooledLo = pooledEst - 1.96 * pooledSE;
                pooledHi = pooledEst + 1.96 * pooledSE;
            }
        } else {
            // Simple average
            var sum = 0;
            for (var sa = 0; sa < studies.length; sa++) sum += studies[sa].es;
            pooledEst = sum / studies.length;
            // Approximate pooled CI from individual SEs
            var seSum = 0;
            for (var sb = 0; sb < studies.length; sb++) seSum += studies[sb].se * studies[sb].se;
            pooledSE = Math.sqrt(seSum) / studies.length;
            if (measureType === 'ratio' && pooledEst > 0) {
                pooledLo = Math.exp(Math.log(pooledEst) - 1.96 * pooledSE);
                pooledHi = Math.exp(Math.log(pooledEst) + 1.96 * pooledSE);
            } else {
                pooledLo = pooledEst - 1.96 * pooledSE;
                pooledHi = pooledEst + 1.96 * pooledSE;
            }
        }

        // Compute weight percentages
        for (var w = 0; w < studies.length; w++) {
            studies[w].weightPct = (studies[w].weight / totalWeight * 100).toFixed(1);
        }

        // Determine min/max for the visual display
        var allVals = [];
        for (var v = 0; v < studies.length; v++) {
            allVals.push(studies[v].lo, studies[v].hi);
        }
        allVals.push(pooledLo, pooledHi, nullVal);
        var plotMin = Math.min.apply(null, allVals);
        var plotMax = Math.max.apply(null, allVals);
        var range = plotMax - plotMin;
        if (range < 0.01) range = 1;
        // Add 10% padding
        plotMin -= range * 0.1;
        plotMax += range * 0.1;
        range = plotMax - plotMin;

        // Null line position (percentage)
        var nullPct = ((nullVal - plotMin) / range * 100);

        // Build results HTML
        var rhtml = '<div class="result-panel mt-2">';
        rhtml += '<div class="card-title">Forest Plot</div>';

        // Summary table
        rhtml += '<div class="table-scroll-wrap">';
        rhtml += '<table class="data-table" id="fpr-table">';
        rhtml += '<thead><tr><th>Study</th><th>Effect</th><th>95% CI</th><th>Weight</th><th style="min-width:250px;">Forest Plot</th></tr></thead>';
        rhtml += '<tbody>';

        for (var r = 0; r < studies.length; r++) {
            var st = studies[r];
            var esPct = ((st.es - plotMin) / range * 100);
            var loPct = ((st.lo - plotMin) / range * 100);
            var hiPct = ((st.hi - plotMin) / range * 100);
            // Clamp
            loPct = Math.max(0, Math.min(100, loPct));
            hiPct = Math.max(0, Math.min(100, hiPct));
            esPct = Math.max(0, Math.min(100, esPct));
            var crossesNull = (st.lo <= nullVal && st.hi >= nullVal);
            var sigColor = crossesNull ? 'var(--text-secondary)' : 'var(--success)';

            rhtml += '<tr>';
            rhtml += '<td><strong>' + st.name + '</strong></td>';
            rhtml += '<td>' + st.es.toFixed(2) + '</td>';
            rhtml += '<td>' + st.lo.toFixed(2) + ' to ' + st.hi.toFixed(2) + '</td>';
            rhtml += '<td>' + st.weightPct + '%</td>';
            rhtml += '<td><div style="position:relative;height:24px;background:var(--bg-tertiary);border-radius:4px;">';
            // Null line
            rhtml += '<div style="position:absolute;left:' + nullPct + '%;top:0;bottom:0;width:1px;background:var(--text-tertiary);z-index:1;"></div>';
            // CI line
            rhtml += '<div style="position:absolute;left:' + loPct + '%;width:' + (hiPct - loPct) + '%;top:50%;height:2px;background:' + sigColor + ';transform:translateY(-50%);z-index:2;"></div>';
            // Point estimate (square)
            var squareSize = Math.max(6, Math.min(16, parseFloat(st.weightPct) / 100 * 30 + 6));
            rhtml += '<div style="position:absolute;left:' + esPct + '%;top:50%;width:' + squareSize + 'px;height:' + squareSize + 'px;background:' + sigColor + ';transform:translate(-50%,-50%);z-index:3;"></div>';
            rhtml += '</div></td>';
            rhtml += '</tr>';
        }

        // Pooled estimate row
        var pooledEsPct = ((pooledEst - plotMin) / range * 100);
        var pooledLoPct = ((pooledLo - plotMin) / range * 100);
        var pooledHiPct = ((pooledHi - plotMin) / range * 100);
        pooledLoPct = Math.max(0, Math.min(100, pooledLoPct));
        pooledHiPct = Math.max(0, Math.min(100, pooledHiPct));
        pooledEsPct = Math.max(0, Math.min(100, pooledEsPct));
        var pooledCrossesNull = (pooledLo <= nullVal && pooledHi >= nullVal);
        var pooledColor = pooledCrossesNull ? 'var(--warning)' : 'var(--success)';

        rhtml += '<tr style="border-top:2px solid var(--border);font-weight:700;">';
        rhtml += '<td><strong>Pooled (' + (method === 'iv' ? 'IV-FE' : 'Avg') + ')</strong></td>';
        rhtml += '<td>' + pooledEst.toFixed(2) + '</td>';
        rhtml += '<td>' + pooledLo.toFixed(2) + ' to ' + pooledHi.toFixed(2) + '</td>';
        rhtml += '<td>100%</td>';
        rhtml += '<td><div style="position:relative;height:24px;background:var(--bg-tertiary);border-radius:4px;">';
        rhtml += '<div style="position:absolute;left:' + nullPct + '%;top:0;bottom:0;width:1px;background:var(--text-tertiary);z-index:1;"></div>';
        // Diamond for pooled
        rhtml += '<div style="position:absolute;left:' + pooledLoPct + '%;width:' + (pooledHiPct - pooledLoPct) + '%;top:50%;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ' + pooledColor + ';border-bottom:8px solid ' + pooledColor + ';transform:translateY(-50%);z-index:2;clip-path:polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%);"></div>';
        rhtml += '</div></td>';
        rhtml += '</tr>';
        rhtml += '</tbody></table>';
        rhtml += '</div>';

        // Interpretation
        rhtml += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-top:12px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        rhtml += '<div style="font-weight:600;margin-bottom:4px;">Interpretation</div>';
        rhtml += '<div style="font-size:0.9rem;line-height:1.6;">';
        rhtml += 'Pooled estimate: <strong>' + pooledEst.toFixed(2) + '</strong> (95% CI: ' + pooledLo.toFixed(2) + ' to ' + pooledHi.toFixed(2) + '). ';
        if (pooledCrossesNull) {
            rhtml += 'The pooled CI <strong style="color:var(--warning);">includes the null value (' + nullVal + ')</strong>, suggesting the overall effect is not statistically significant. ';
        } else {
            rhtml += 'The pooled CI <strong style="color:var(--success);">excludes the null value (' + nullVal + ')</strong>, suggesting a statistically significant overall effect. ';
        }
        // Count how many studies cross null
        var nullCrossCount = 0;
        var sameDirection = true;
        var firstDirection = studies[0].es > nullVal ? 'above' : 'below';
        for (var c = 0; c < studies.length; c++) {
            if (studies[c].lo <= nullVal && studies[c].hi >= nullVal) nullCrossCount++;
            var dir = studies[c].es > nullVal ? 'above' : 'below';
            if (dir !== firstDirection) sameDirection = false;
        }
        rhtml += nullCrossCount + ' of ' + studies.length + ' individual studies have CIs crossing the null. ';
        if (sameDirection) {
            rhtml += 'All studies show effects in the <strong>same direction</strong>, suggesting consistency.';
        } else {
            rhtml += 'Studies show effects in <strong>different directions</strong>, suggesting possible heterogeneity.';
        }
        rhtml += '</div></div>';

        // Note about limitations
        rhtml += '<div style="font-size:0.82rem;color:var(--text-secondary);margin-top:8px;">';
        rhtml += 'Note: This is a simplified fixed-effect inverse-variance pooling. For a proper meta-analysis, use specialized software (R metafor, RevMan, Stata) that accounts for random effects, heterogeneity (I-sq, tau-sq), and publication bias.';
        rhtml += '</div>';

        rhtml += '</div>';
        App.setTrustedHTML(document.getElementById('fpr-results'), rhtml);
    }

    function copyForestPlot() {
        var table = document.getElementById('fpr-table');
        if (!table) {
            var el = document.getElementById('fpr-results');
            if (el) Export.copyText(el.textContent);
            return;
        }
        // Build tab-separated text for pasting into spreadsheets
        var text = '';
        var rows = table.querySelectorAll('tr');
        for (var i = 0; i < rows.length; i++) {
            var cells = rows[i].querySelectorAll('th, td');
            var rowText = [];
            for (var j = 0; j < cells.length - 1; j++) { // Skip the visual column
                rowText.push(cells[j].textContent.trim());
            }
            text += rowText.join('\t') + '\n';
        }
        Export.copyText(text);
    }

    // ================================================================
    // CARD 6: Funnel Plot Interpreter
    // ================================================================
    function renderFunnelPlotGuide() {
        var html = '<div class="card">';
        html += '<div class="card-title">Funnel Plot Interpreter</div>';
        html += '<div class="card-subtitle">Guide to identifying publication bias and small-study effects using funnel plots.</div>';

        html += '<div style="font-family:monospace;font-size:0.78rem;line-height:1.4;background:var(--bg-primary);border:1px solid var(--border);padding:16px;border-radius:8px;overflow-x:auto;white-space:pre;">';
        html += 'Precision                                     \n';
        html += '(1/SE)   SYMMETRIC (No bias)   ASYMMETRIC (Possible bias)\n';
        html += '  |                                                      \n';
        html += '  |           *                        *                 \n';
        html += '  |          * *                      * *                \n';
        html += '  |         *   *                    *   *               \n';
        html += '  |        *  |  *                  *  |                 \n';
        html += '  |       *   |   *                *   |                 \n';
        html += '  |      *    |    *              *    |                 \n';
        html += '  |     *     |     *            *     |                 \n';
        html += '  |    *      |      *          *      |  (gap)         \n';
        html += '  |___________|___________   ___________|____________    \n';
        html += '           Effect size              Effect size          \n';
        html += '</div>';

        html += '<div style="margin-top:12px;font-size:0.88rem;line-height:1.7;">';
        html += '<div style="font-weight:600;margin-bottom:6px;">How to interpret:</div>';
        html += '<ul style="margin:0 0 0 20px;">';
        html += '<li><strong>Symmetric funnel:</strong> Studies scatter evenly around the pooled estimate. Larger studies (higher precision) cluster near the top. No evidence of publication bias.</li>';
        html += '<li><strong>Asymmetric funnel (gap in bottom-left/right):</strong> Missing small studies with null or negative results suggests publication bias.</li>';
        html += '<li><strong>Statistical tests:</strong> Egger test (regression of effect on precision), Begg test (rank correlation), trim-and-fill method (estimates missing studies).</li>';
        html += '<li><strong>Caution:</strong> Asymmetry can also result from genuine heterogeneity, differences in study quality, or chance (especially with < 10 studies).</li>';
        html += '</ul></div>';

        html += '<div style="background:var(--bg-tertiary);border-radius:8px;padding:12px;margin-top:12px;font-size:0.85rem;">';
        html += '<strong>Reference:</strong> Sterne JAC et al. Recommendations for examining and interpreting funnel plot asymmetry in meta-analyses of randomised controlled trials. BMJ. 2011;343:d4002.';
        html += '</div>';
        html += '</div>';
        return html;
    }

    // ================================================================
    // CARD 7: Kaplan-Meier Interpreter
    // ================================================================
    function renderKMGuide() {
        var html = '<div class="card">';
        html += '<div class="card-title">Kaplan-Meier Curve Interpreter</div>';
        html += '<div class="card-subtitle">Guide to reading and interpreting Kaplan-Meier survival curves.</div>';

        html += '<div style="font-family:monospace;font-size:0.78rem;line-height:1.4;background:var(--bg-primary);border:1px solid var(--border);padding:16px;border-radius:8px;overflow-x:auto;white-space:pre;">';
        html += 'Survival                                              \n';
        html += '  1.0 |_____                                          \n';
        html += '      |     |____+                    Treatment       \n';
        html += '  0.8 |          |___                                 \n';
        html += '      |              |___+___                         \n';
        html += '  0.6 |                      |____                    \n';
        html += '      |  _____                    |___+               \n';
        html += '  0.4 |       |___                    |___            \n';
        html += '      |           |____+                  |___        \n';
        html += '  0.2 |                |___                   |___    \n';
        html += '      |                    |___+      Control     |__ \n';
        html += '  0.0 |_____________________________________________  \n';
        html += '      0    6    12    18    24    30    36  Months     \n';
        html += '                                                      \n';
        html += '  |___ = step down (event occurred)                   \n';
        html += '  +    = censored observation                         \n';
        html += '</div>';

        html += '<div style="margin-top:12px;font-size:0.88rem;line-height:1.7;">';
        html += '<div style="font-weight:600;margin-bottom:6px;">Key elements:</div>';
        html += '<ul style="margin:0 0 0 20px;">';
        html += '<li><strong>Step-down:</strong> Each drop represents one or more events (deaths, relapses, etc.).</li>';
        html += '<li><strong>Tick marks (+):</strong> Censored observations (lost to follow-up, study ended, withdrew).</li>';
        html += '<li><strong>Median survival:</strong> Time at which the curve crosses 0.5 (50% survival).</li>';
        html += '<li><strong>Separation of curves:</strong> Greater separation = larger treatment effect.</li>';
        html += '<li><strong>Number at risk table:</strong> Should be shown below the curve. Decreasing numbers indicate censoring or events.</li>';
        html += '<li><strong>Crossing curves:</strong> If curves cross, the proportional hazards assumption may be violated (HR not constant over time).</li>';
        html += '<li><strong>Log-rank test:</strong> Tests whether the survival distributions differ. Does not provide an effect estimate (use Cox model for HR).</li>';
        html += '<li><strong>Restricted mean survival time (RMST):</strong> The area under the KM curve up to a specified time point. Useful when proportional hazards assumption fails.</li>';
        html += '</ul></div>';

        html += '<div style="background:var(--bg-tertiary);border-radius:8px;padding:12px;margin-top:12px;font-size:0.85rem;">';
        html += '<strong>Common pitfalls:</strong> (1) Ignoring the number at risk (curves become unreliable when few remain). '
            + '(2) Assuming curves are proportional throughout (they may cross). '
            + '(3) Reading survival % at specific timepoints without considering CIs. '
            + '(4) Ignoring censoring patterns (heavy early censoring may indicate bias).';
        html += '</div>';
        html += '</div>';
        return html;
    }

    // ================================================================
    // CARD 8: ROC Curve Interpreter
    // ================================================================
    function renderROCGuide() {
        var html = '<div class="card">';
        html += '<div class="card-title">ROC Curve Interpreter</div>';
        html += '<div class="card-subtitle">Guide to interpreting Receiver Operating Characteristic curves and AUC values.</div>';

        html += '<div style="font-family:monospace;font-size:0.78rem;line-height:1.4;background:var(--bg-primary);border:1px solid var(--border);padding:16px;border-radius:8px;overflow-x:auto;white-space:pre;">';
        html += 'Sensitivity (TPR)                                   \n';
        html += '  1.0 |__________________________*****              \n';
        html += '      |                    *****/                    \n';
        html += '  0.8 |                ****                          \n';
        html += '      |             ***    Good test (AUC=0.85)      \n';
        html += '  0.6 |          ***                                 \n';
        html += '      |        **                                    \n';
        html += '  0.4 |      **     ....                             \n';
        html += '      |    **    ...   Chance line (AUC=0.50)        \n';
        html += '  0.2 |  **  ...                                     \n';
        html += '      | * ...                                        \n';
        html += '  0.0 |.____________________________________________ \n';
        html += '      0.0   0.2   0.4   0.6   0.8   1.0             \n';
        html += '               1 - Specificity (FPR)                 \n';
        html += '</div>';

        html += '<div style="margin-top:12px;">';
        html += '<div class="table-container"><table class="data-table"><thead><tr><th>AUC Range</th><th>Classification</th><th>Interpretation</th></tr></thead><tbody>';
        html += '<tr><td>0.90 - 1.00</td><td style="color:var(--success);font-weight:600;">Outstanding</td><td>Excellent discrimination</td></tr>';
        html += '<tr><td>0.80 - 0.90</td><td style="color:var(--primary);font-weight:600;">Excellent</td><td>Strong discrimination</td></tr>';
        html += '<tr><td>0.70 - 0.80</td><td style="color:var(--warning);font-weight:600;">Acceptable</td><td>Adequate for most clinical uses</td></tr>';
        html += '<tr><td>0.60 - 0.70</td><td style="color:var(--danger);font-weight:600;">Poor</td><td>Limited clinical utility</td></tr>';
        html += '<tr><td>0.50 - 0.60</td><td style="color:var(--text-tertiary);">Fail</td><td>No better than chance</td></tr>';
        html += '</tbody></table></div>';

        html += '<div style="margin-top:12px;font-size:0.88rem;line-height:1.7;">';
        html += '<div style="font-weight:600;margin-bottom:6px;">Key concepts:</div>';
        html += '<ul style="margin:0 0 0 20px;">';
        html += '<li><strong>AUC (c-statistic):</strong> Probability that a randomly chosen positive case ranks higher than a randomly chosen negative case.</li>';
        html += '<li><strong>Optimal cutpoint:</strong> Youden index (maximize Sensitivity + Specificity - 1) or clinical criteria (maximize sensitivity for screening, specificity for confirmation).</li>';
        html += '<li><strong>Discrimination vs calibration:</strong> AUC measures discrimination only. A well-calibrated model may have moderate AUC but be clinically useful.</li>';
        html += '<li><strong>Comparing ROC curves:</strong> DeLong test compares AUC between two models on the same data. Net reclassification improvement (NRI) assesses added value.</li>';
        html += '</ul></div>';
        html += '</div>';
        html += '</div>';
        return html;
    }

    // ================================================================
    // CARD 9: Red Flags Checklist
    // ================================================================
    function renderRedFlags() {
        var html = '<div class="card">';
        html += '<div class="card-title">Red Flags Checklist for Statistical Reporting</div>';
        html += '<div class="card-subtitle">Common red flags to watch for when reading statistical results in published research.</div>';

        var flags = [
            { category: 'P-value Issues', items: [
                'P-values reported as "p = 0.000" (impossible -- should be p < 0.001)',
                'Only "significant" or "not significant" stated without actual p-values',
                'P-value of exactly 0.05 or suspiciously close to threshold',
                'Multiple comparisons without correction',
                'One-sided tests without pre-specified justification'
            ]},
            { category: 'Effect Size & CI Issues', items: [
                'No confidence intervals reported',
                'No effect sizes reported (only p-values)',
                'Reporting SE instead of SD (makes data appear less variable)',
                'Odds ratios used for common outcomes (>10%) -- exaggerates effect',
                'NNT reported without specifying baseline risk and time frame'
            ]},
            { category: 'Study Design Issues', items: [
                'Post-hoc subgroup analyses presented as primary findings',
                'Outcome switching from protocol/registration',
                'Missing CONSORT/STROBE flow diagram',
                'Per-protocol analysis favored over ITT without justification',
                'Baseline imbalances not addressed'
            ]},
            { category: 'Analysis Issues', items: [
                'Events per variable < 10 in logistic/Cox regression (overfitting risk)',
                'Stepwise variable selection without validation',
                'Proportional hazards not assessed for Cox regression',
                'Missing data handled by complete case only (no sensitivity analysis)',
                'Correlation interpreted as causation without causal framework'
            ]},
            { category: 'Reporting Issues', items: [
                'Selective reporting of favorable outcomes only',
                'Spin: emphasis on favorable secondary results when primary is null',
                'Denominators change across tables without explanation',
                'Survival curves without number at risk table',
                'Forest plot without heterogeneity assessment'
            ]}
        ];

        for (var i = 0; i < flags.length; i++) {
            html += '<div style="border-left:4px solid var(--danger);padding:12px 16px;margin-bottom:12px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
            html += '<div style="font-weight:700;margin-bottom:6px;color:var(--danger);">' + flags[i].category + '</div>';
            html += '<ul style="margin:0 0 0 16px;font-size:0.88rem;line-height:1.7;">';
            for (var j = 0; j < flags[i].items.length; j++) {
                html += '<li>' + flags[i].items[j] + '</li>';
            }
            html += '</ul></div>';
        }

        html += '<div style="background:var(--bg-tertiary);border-radius:8px;padding:12px;margin-top:12px;font-size:0.85rem;">';
        html += '<strong>Reference:</strong> Lang T, Altman D. Statistical Analyses and Methods in the Published Literature: The SAMPL Guidelines. '
            + 'Goodman SN et al. What does research reproducibility mean? Sci Transl Med. 2016;8(341):341ps12.';
        html += '</div>';
        html += '</div>';
        return html;
    }

    // ================================================================
    // CARD 10: Bland-Altman Agreement Guide
    // ================================================================
    function renderBlandAltmanGuide() {
        var html = '<div class="card">';
        html += '<div class="card-title">Bland-Altman Agreement Guide</div>';
        html += '<div class="card-subtitle">Guide to interpreting Bland-Altman plots for method comparison studies (agreement between two measurement methods).</div>';

        html += '<div style="font-family:monospace;font-size:0.78rem;line-height:1.4;background:var(--bg-primary);border:1px solid var(--border);padding:16px;border-radius:8px;overflow-x:auto;white-space:pre;">';
        html += 'Difference                                                \n';
        html += '(Method A - B)                                            \n';
        html += '  +3  |                                    +1.96 SD       \n';
        html += '      |         .               . ----------------------  \n';
        html += '  +2  |    .        .   .                                 \n';
        html += '      |       .  .     .    .    .                        \n';
        html += '  +1  |  .       .  .     .                               \n';
        html += '      |    . .  .  .   .  .   .    Mean diff              \n';
        html += '   0  |- - -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.  \n';
        html += '      |  .    .  .    .     .   .                         \n';
        html += '  -1  |       .     .   .                                 \n';
        html += '      |    .         .          . ----------------------  \n';
        html += '  -2  |                                    -1.96 SD       \n';
        html += '      |______________________________________             \n';
        html += '      0    20    40    60    80    100                     \n';
        html += '           Mean of Method A and B                         \n';
        html += '</div>';

        html += '<div style="margin-top:12px;">';
        var baItems = [
            { label: 'Mean difference (bias)', desc: 'Horizontal center line. Represents systematic bias between methods. Ideally close to zero.' },
            { label: 'Limits of agreement', desc: 'Mean +/- 1.96 SD. Approximately 95% of differences should fall within these limits. Clinician decides if these limits are acceptable.' },
            { label: 'Proportional bias', desc: 'If the scatter shows a trend (funnel shape or slope), the difference depends on the magnitude of measurement. Consider log transformation or regression-based limits.' },
            { label: 'Outliers', desc: 'Points outside limits of agreement. A few (about 5%) are expected. Investigate any clear outliers.' },
            { label: 'Assumption', desc: 'Differences should be approximately normally distributed. Check with histogram of differences or Shapiro-Wilk test.' }
        ];
        for (var i = 0; i < baItems.length; i++) {
            html += '<div style="display:flex;gap:8px;margin-bottom:8px;font-size:0.88rem;line-height:1.6;">';
            html += '<div style="font-weight:600;min-width:180px;color:var(--primary);">' + baItems[i].label + '</div>';
            html += '<div>' + baItems[i].desc + '</div></div>';
        }
        html += '</div>';

        // Interactive Bland-Altman Calculator
        html += '<div style="border-top:1px solid var(--border);margin-top:16px;padding-top:16px;">';
        html += '<div style="font-weight:700;margin-bottom:8px;">Quick Bland-Altman Calculator</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Mean Difference (Bias)</label>'
            + '<input type="number" class="form-input" id="ba-bias" name="ba-bias" step="0.01" value="0.5" placeholder="e.g., 0.5"></div>';
        html += '<div class="form-group"><label class="form-label">SD of Differences</label>'
            + '<input type="number" class="form-input" id="ba-sd" name="ba-sd" step="0.01" value="2.1" placeholder="e.g., 2.1"></div>';
        html += '<div class="form-group"><label class="form-label">Clinically Acceptable Limit</label>'
            + '<input type="number" class="form-input" id="ba-accept" name="ba-accept" step="0.1" value="5.0" placeholder="e.g., 5.0"></div>';
        html += '</div>';
        html += '<button class="btn btn-primary" onclick="ResultsInterp.calcBA()">Calculate</button>';
        html += '<div id="ba-results"></div>';
        html += '</div>';

        html += '<div style="background:var(--bg-tertiary);border-radius:8px;padding:12px;margin-top:12px;font-size:0.85rem;line-height:1.7;">';
        html += '<strong>When to use:</strong> Comparing two measurement methods, rater agreement, test-retest reliability. '
            + 'Do NOT use correlation (r) alone for agreement -- two methods can be highly correlated but systematically different. '
            + 'ICC (intraclass correlation coefficient) is also useful but does not show bias patterns.<br>';
        html += '<strong>Reference:</strong> Bland JM, Altman DG. Statistical methods for assessing agreement between two methods of clinical measurement. Lancet. 1986;327(8476):307-310.';
        html += '</div>';
        html += '</div>';
        return html;
    }

    function calcBA() {
        var bias = parseFloat(document.getElementById('ba-bias').value);
        var sd = parseFloat(document.getElementById('ba-sd').value);
        var accept = parseFloat(document.getElementById('ba-accept').value);
        if (isNaN(bias) || isNaN(sd)) return;

        var upperLoA = bias + 1.96 * sd;
        var lowerLoA = bias - 1.96 * sd;
        var acceptable = !isNaN(accept) && Math.abs(upperLoA) <= accept && Math.abs(lowerLoA) <= accept;

        var rhtml = '<div class="result-panel mt-2">';
        rhtml += '<div class="card-title">Bland-Altman Results</div>';
        rhtml += '<div class="table-container"><table class="data-table"><thead><tr><th>Parameter</th><th>Value</th></tr></thead><tbody>';
        rhtml += '<tr><td>Mean Difference (Bias)</td><td>' + bias.toFixed(2) + '</td></tr>';
        rhtml += '<tr><td>SD of Differences</td><td>' + sd.toFixed(2) + '</td></tr>';
        rhtml += '<tr><td>Upper Limit of Agreement (+1.96 SD)</td><td>' + upperLoA.toFixed(2) + '</td></tr>';
        rhtml += '<tr><td>Lower Limit of Agreement (-1.96 SD)</td><td>' + lowerLoA.toFixed(2) + '</td></tr>';
        rhtml += '<tr><td>Width of LoA</td><td>' + (upperLoA - lowerLoA).toFixed(2) + '</td></tr>';
        rhtml += '</tbody></table></div>';

        rhtml += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-top:12px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        rhtml += '<div style="font-weight:600;margin-bottom:4px;">Interpretation</div>';
        rhtml += '<div style="font-size:0.9rem;line-height:1.6;">';
        rhtml += 'The mean difference between methods is ' + bias.toFixed(2) + ' (systematic bias). ';
        rhtml += '95% of differences are expected to fall between ' + lowerLoA.toFixed(2) + ' and ' + upperLoA.toFixed(2) + '. ';
        if (!isNaN(accept)) {
            if (acceptable) {
                rhtml += '<strong style="color:var(--success);">The limits of agreement fall within the clinically acceptable range of +/- ' + accept.toFixed(1) + '.</strong> The methods may be considered interchangeable for clinical purposes.';
            } else {
                rhtml += '<strong style="color:var(--danger);">The limits of agreement exceed the clinically acceptable range of +/- ' + accept.toFixed(1) + '.</strong> The methods should NOT be considered interchangeable.';
            }
        }
        rhtml += '</div></div>';
        rhtml += '</div>';
        App.setTrustedHTML(document.getElementById('ba-results'), rhtml);
    }

    // ================================================================
    // CARD 11: Effect Size Converter
    // ================================================================
    function renderESConverter() {
        var html = '<div class="card">';
        html += '<div class="card-title">Effect Size Converter</div>';
        html += '<div class="card-subtitle">Convert between common effect size measures. Enter a value, select input type, and click Convert.</div>';

        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Input Value</label>'
            + '<input type="number" class="form-input" id="esc-val" name="esc-val" step="0.01" value="0.50" placeholder="Enter value"></div>';
        html += '<div class="form-group"><label class="form-label">Convert From</label>'
            + '<select class="form-select" id="esc-from" name="esc-from">'
            + '<option value="d">Cohen\'s d</option>'
            + '<option value="r">Correlation r</option>'
            + '<option value="or">Odds Ratio</option>'
            + '<option value="lor">Log Odds Ratio</option>'
            + '<option value="eta2">Eta-squared</option>'
            + '</select></div>';
        html += '<div class="form-group"><label class="form-label">Baseline Risk (for NNT)</label>'
            + '<input type="number" class="form-input" id="esc-br" name="esc-br" step="0.01" min="0.01" max="0.99" value="0.10"></div>';
        html += '</div>';

        html += '<div class="btn-group">'
            + '<button class="btn btn-primary" onclick="ResultsInterp.convertES()">Convert</button>'
            + '</div>';

        html += '<div id="esc-results"></div>';

        html += '<div style="margin-top:12px;background:var(--bg-tertiary);border-radius:8px;padding:12px;font-size:0.85rem;line-height:1.7;">';
        html += '<strong>Conversion formulas:</strong><br>';
        html += 'd = 2r / sqrt(1 - r<sup>2</sup>) &nbsp;|&nbsp; r = d / sqrt(d<sup>2</sup> + 4) &nbsp;|&nbsp; ln(OR) = d &times; pi / sqrt(3) &nbsp;|&nbsp; g = d &times; (1 - 3/(4*df - 1))<br>';
        html += '<strong>Note:</strong> These are approximate conversions. The d-to-OR conversion assumes logistic distribution. Context matters more than exact values.';
        html += '</div>';
        html += '</div>';
        return html;
    }

    function convertES() {
        var val = parseFloat(document.getElementById('esc-val').value);
        var from = document.getElementById('esc-from').value;
        var baseRisk = parseFloat(document.getElementById('esc-br').value) || 0.10;
        if (isNaN(val)) return;

        var d, r, or_val, lor, r2, g, eta2, f2;

        // Convert everything to Cohen's d first
        if (from === 'd') { d = val; }
        else if (from === 'r') { r = val; d = 2 * r / Math.sqrt(1 - r * r); }
        else if (from === 'or') { lor = Math.log(val); d = lor * Math.sqrt(3) / Math.PI; }
        else if (from === 'lor') { lor = val; d = lor * Math.sqrt(3) / Math.PI; }
        else if (from === 'eta2') { eta2 = val; f2 = eta2 / (1 - eta2); d = 2 * Math.sqrt(f2); }

        // From d, compute all others
        r = d / Math.sqrt(d * d + 4);
        r2 = r * r;
        lor = d * Math.PI / Math.sqrt(3);
        or_val = Math.exp(lor);
        g = d * (1 - 3 / (4 * 100 - 1)); // approximate df=100
        eta2 = d * d / (d * d + 4); // approximation for 2 groups
        f2 = eta2 / (1 - eta2);
        var rr_approx = or_val / (1 - baseRisk + baseRisk * or_val);
        var rd = baseRisk * rr_approx - baseRisk;
        var nnt = Math.abs(rd) > 0.001 ? Math.ceil(1 / Math.abs(rd)) : 9999;

        var mag = '';
        var absD = Math.abs(d);
        if (absD < 0.2) mag = 'Negligible';
        else if (absD < 0.5) mag = 'Small';
        else if (absD < 0.8) mag = 'Medium';
        else if (absD < 1.2) mag = 'Large';
        else mag = 'Very Large';

        var rhtml = '<div class="result-panel mt-2">';
        rhtml += '<div class="card-title">Conversion Results (' + mag + ' Effect)</div>';
        rhtml += '<div class="table-container"><table class="data-table"><thead><tr><th>Measure</th><th>Value</th><th>Interpretation</th></tr></thead><tbody>';
        rhtml += '<tr><td>Cohen\'s d</td><td><strong>' + d.toFixed(3) + '</strong></td><td>' + mag + ' (Cohen 1988: 0.2/0.5/0.8)</td></tr>';
        rhtml += '<tr><td>Hedge\'s g</td><td>' + g.toFixed(3) + '</td><td>Bias-corrected d (use for small samples)</td></tr>';
        rhtml += '<tr><td>Correlation r</td><td>' + r.toFixed(3) + '</td><td>Explains ' + (r2 * 100).toFixed(1) + '% of variance</td></tr>';
        rhtml += '<tr><td>R-squared</td><td>' + r2.toFixed(4) + '</td><td>Proportion of shared variance</td></tr>';
        rhtml += '<tr><td>Eta-squared</td><td>' + eta2.toFixed(4) + '</td><td>Variance explained (ANOVA context)</td></tr>';
        rhtml += '<tr><td>Odds Ratio</td><td>' + or_val.toFixed(3) + '</td><td>' + (or_val > 1 ? ((or_val - 1) * 100).toFixed(0) + '% increased odds' : ((1 - or_val) * 100).toFixed(0) + '% decreased odds') + '</td></tr>';
        rhtml += '<tr><td>Log OR</td><td>' + lor.toFixed(3) + '</td><td>Symmetric scale used in meta-analysis</td></tr>';
        rhtml += '<tr><td>Risk Ratio (approx)</td><td>' + rr_approx.toFixed(3) + '</td><td>At baseline risk = ' + (baseRisk * 100).toFixed(0) + '%</td></tr>';
        rhtml += '<tr><td>NNT (approx)</td><td>' + nnt + '</td><td>At baseline risk = ' + (baseRisk * 100).toFixed(0) + '%</td></tr>';
        rhtml += '</tbody></table></div>';
        rhtml += '</div>';
        App.setTrustedHTML(document.getElementById('esc-results'), rhtml);
    }

    // ================================================================
    // CARD 12: Statistical Test Selector (Interactive)
    // ================================================================
    function renderTestSelector() {
        var html = '<div class="card">';
        html += '<div class="card-title">Statistical Test Selector</div>';
        html += '<div class="card-subtitle">Choose the appropriate statistical test based on your data characteristics and research question.</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Research Goal</label>'
            + '<select class="form-select" id="ts-goal" name="ts-goal">'
            + '<option value="compare_means">Compare means between groups</option>'
            + '<option value="compare_proportions">Compare proportions between groups</option>'
            + '<option value="association">Test association between variables</option>'
            + '<option value="prediction">Predict an outcome</option>'
            + '<option value="agreement">Assess agreement / reliability</option>'
            + '<option value="survival">Analyze time-to-event data</option>'
            + '</select></div>';
        html += '<div class="form-group"><label class="form-label">Number of Groups</label>'
            + '<select class="form-select" id="ts-groups" name="ts-groups">'
            + '<option value="2">2 groups</option>'
            + '<option value="3+">3 or more groups</option>'
            + '<option value="1">1 group (vs. reference)</option>'
            + '<option value="paired">Paired / matched</option>'
            + '</select></div>';
        html += '</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Data Distribution</label>'
            + '<select class="form-select" id="ts-dist" name="ts-dist">'
            + '<option value="normal">Normal / approximately normal</option>'
            + '<option value="non-normal">Non-normal / skewed</option>'
            + '<option value="categorical">Categorical / binary</option>'
            + '<option value="ordinal">Ordinal</option>'
            + '</select></div>';
        html += '<div class="form-group"><label class="form-label">Sample Size</label>'
            + '<select class="form-select" id="ts-n" name="ts-n">'
            + '<option value="large">Large (n > 30 per group)</option>'
            + '<option value="small">Small (n <= 30 per group)</option>'
            + '</select></div>';
        html += '</div>';

        html += '<button class="btn btn-primary" onclick="ResultsInterp.selectTest()">Find Test</button>';
        html += '<div id="ts-results"></div>';

        // Reference table
        html += '<div style="margin-top:16px;border-top:1px solid var(--border);padding-top:16px;">';
        html += '<div style="font-weight:700;margin-bottom:8px;">Comprehensive Test Reference</div>';
        html += '<div class="table-container"><table class="data-table" style="font-size:0.82rem;">';
        html += '<thead><tr><th>Scenario</th><th>Parametric</th><th>Non-parametric</th><th>Effect Size</th></tr></thead>';
        html += '<tbody>';
        html += '<tr><td>2 independent groups, continuous</td><td>Independent t-test</td><td>Mann-Whitney U</td><td>Cohen\'s d</td></tr>';
        html += '<tr><td>2 paired groups, continuous</td><td>Paired t-test</td><td>Wilcoxon signed-rank</td><td>Cohen\'s d (paired)</td></tr>';
        html += '<tr><td>3+ independent groups</td><td>One-way ANOVA</td><td>Kruskal-Wallis</td><td>Eta-squared</td></tr>';
        html += '<tr><td>3+ paired groups</td><td>Repeated-measures ANOVA</td><td>Friedman test</td><td>Partial eta-squared</td></tr>';
        html += '<tr><td>2 groups, binary outcome</td><td>Chi-square / Fisher exact</td><td>Fisher exact (small n)</td><td>OR, RR, RD, phi</td></tr>';
        html += '<tr><td>Ordered categories</td><td>--</td><td>Chi-square for trend</td><td>Gamma, Kendall tau-b</td></tr>';
        html += '<tr><td>Correlation (continuous)</td><td>Pearson r</td><td>Spearman rho</td><td>r, r-squared</td></tr>';
        html += '<tr><td>Predict continuous outcome</td><td>Linear regression</td><td>Quantile regression</td><td>R-squared</td></tr>';
        html += '<tr><td>Predict binary outcome</td><td>Logistic regression</td><td>--</td><td>OR, AUC</td></tr>';
        html += '<tr><td>Time-to-event (2 groups)</td><td>Log-rank test</td><td>--</td><td>HR, RMST</td></tr>';
        html += '<tr><td>Agreement (continuous)</td><td>ICC</td><td>Bland-Altman</td><td>ICC, LoA</td></tr>';
        html += '<tr><td>Agreement (categorical)</td><td>Cohen kappa</td><td>Weighted kappa</td><td>Kappa</td></tr>';
        html += '<tr><td>Count data</td><td>Poisson regression</td><td>Negative binomial</td><td>IRR</td></tr>';
        html += '</tbody></table></div>';
        html += '</div>';
        html += '</div>';
        return html;
    }

    function selectTest() {
        var goal = document.getElementById('ts-goal').value;
        var groups = document.getElementById('ts-groups').value;
        var dist = document.getElementById('ts-dist').value;
        var sampleSize = document.getElementById('ts-n').value;

        var primary = '', alternative = '', effectSize = '', assumptions = '', rCode = '';

        if (goal === 'compare_means') {
            if (groups === '2' && dist === 'normal') {
                primary = 'Independent samples t-test (Welch)';
                alternative = 'Mann-Whitney U if normality violated';
                effectSize = 'Cohen\'s d with 95% CI';
                assumptions = 'Normality (or n > 30 by CLT), independence';
                rCode = 't.test(outcome ~ group, data = df)';
            } else if (groups === '2' && dist === 'non-normal') {
                primary = 'Mann-Whitney U test (Wilcoxon rank-sum)';
                alternative = 'Permutation test, bootstrap CI for median';
                effectSize = 'Rank-biserial correlation r, Hodges-Lehmann estimator';
                assumptions = 'Independence, similar distribution shapes';
                rCode = 'wilcox.test(outcome ~ group, data = df, conf.int = TRUE)';
            } else if (groups === 'paired' && dist === 'normal') {
                primary = 'Paired t-test';
                alternative = 'Wilcoxon signed-rank (non-normal differences)';
                effectSize = 'Cohen\'s d (paired) = mean_diff / sd_diff';
                assumptions = 'Normality of paired differences, paired observations';
                rCode = 't.test(pre, post, paired = TRUE)';
            } else if (groups === 'paired' && dist === 'non-normal') {
                primary = 'Wilcoxon signed-rank test';
                alternative = 'Sign test (very non-normal), permutation test';
                effectSize = 'Matched-pairs rank-biserial r';
                assumptions = 'Symmetric distribution of differences, paired observations';
                rCode = 'wilcox.test(pre, post, paired = TRUE, conf.int = TRUE)';
            } else if (groups === '3+' && dist === 'normal') {
                primary = 'One-way ANOVA + Tukey HSD post-hoc';
                alternative = 'Welch ANOVA (unequal variances), Kruskal-Wallis';
                effectSize = 'Eta-squared, omega-squared';
                assumptions = 'Normality, homogeneity of variances (Levene test), independence';
                rCode = 'aov(outcome ~ group, data = df) %>% summary()\nTukeyHSD(aov_model)';
            } else if (groups === '3+' && dist === 'non-normal') {
                primary = 'Kruskal-Wallis test + Dunn post-hoc';
                alternative = 'Permutation ANOVA';
                effectSize = 'Epsilon-squared';
                assumptions = 'Independence, similar distribution shapes';
                rCode = 'kruskal.test(outcome ~ group, data = df)\ndunn.test::dunn.test(df$outcome, df$group, method = "bonferroni")';
            } else if (groups === '1') {
                primary = dist === 'normal' ? 'One-sample t-test' : 'Wilcoxon signed-rank test (one-sample)';
                alternative = 'Bootstrap CI for mean/median';
                effectSize = 'Cohen\'s d (one-sample) = (mean - mu0) / sd';
                assumptions = dist === 'normal' ? 'Normality (or n > 30)' : 'Symmetric distribution';
                rCode = dist === 'normal' ? 't.test(x, mu = reference_value)' : 'wilcox.test(x, mu = reference_value, conf.int = TRUE)';
            } else {
                primary = 'Independent t-test or ANOVA';
                alternative = 'Mann-Whitney / Kruskal-Wallis';
                effectSize = 'Cohen\'s d or eta-squared';
                assumptions = 'See specific test requirements';
                rCode = '# Choose based on number of groups and normality';
            }
        } else if (goal === 'compare_proportions') {
            if (groups === '2' && sampleSize === 'large') {
                primary = 'Chi-square test of independence';
                alternative = 'Fisher exact test (expected cells < 5), logistic regression';
                effectSize = 'Odds ratio, risk ratio, risk difference, phi coefficient';
                assumptions = 'Independence, expected cell counts >= 5';
                rCode = 'chisq.test(table(group, outcome))\nfisher.test(table(group, outcome))';
            } else if (groups === '2' && sampleSize === 'small') {
                primary = 'Fisher exact test';
                alternative = 'Mid-P exact test, Barnard exact test';
                effectSize = 'Odds ratio with exact CI';
                assumptions = 'Independence';
                rCode = 'fisher.test(table(group, outcome))';
            } else if (groups === '3+') {
                primary = 'Chi-square test (R x C table)';
                alternative = 'Fisher-Freeman-Halton exact test';
                effectSize = 'Cramer\'s V';
                assumptions = 'Expected cells >= 5';
                rCode = 'chisq.test(table(group, outcome))';
            } else if (groups === 'paired') {
                primary = 'McNemar test';
                alternative = 'Exact McNemar (small n)';
                effectSize = 'OR of discordant pairs';
                assumptions = 'Paired binary data';
                rCode = 'mcnemar.test(table(before, after))';
            } else {
                primary = 'Binomial test';
                alternative = 'Exact binomial CI';
                effectSize = 'Proportion with Wilson CI';
                assumptions = 'Independent binary outcomes';
                rCode = 'binom.test(successes, n, p = reference_p)';
            }
        } else if (goal === 'association') {
            if (dist === 'normal') {
                primary = 'Pearson correlation';
                alternative = 'Spearman (non-linear monotonic), partial correlation (adjusted)';
                effectSize = 'r, r-squared, partial r';
                assumptions = 'Bivariate normality, linearity, no outliers';
                rCode = 'cor.test(x, y, method = "pearson")';
            } else if (dist === 'non-normal' || dist === 'ordinal') {
                primary = 'Spearman rank correlation';
                alternative = 'Kendall tau (many ties), point-biserial r (binary vs continuous)';
                effectSize = 'rho, tau-b';
                assumptions = 'Monotonic relationship';
                rCode = 'cor.test(x, y, method = "spearman")';
            } else {
                primary = 'Chi-square test of association';
                alternative = 'Fisher exact, logistic regression';
                effectSize = 'Cramer\'s V, phi, OR';
                assumptions = 'Independence, expected cells >= 5';
                rCode = 'chisq.test(table(var1, var2))';
            }
        } else if (goal === 'prediction') {
            if (dist === 'categorical') {
                primary = 'Logistic regression';
                alternative = 'Penalized regression (LASSO/ridge), random forest';
                effectSize = 'OR, AUC, Brier score';
                assumptions = 'Linearity in logit, no multicollinearity, EPV >= 10';
                rCode = 'glm(outcome ~ pred1 + pred2, family = binomial, data = df)';
            } else {
                primary = 'Multiple linear regression';
                alternative = 'Robust regression, LASSO/ridge, quantile regression';
                effectSize = 'R-squared, adjusted R-squared, standardized beta';
                assumptions = 'Linearity, normality of residuals, homoscedasticity, no multicollinearity';
                rCode = 'lm(outcome ~ pred1 + pred2, data = df) %>% summary()';
            }
        } else if (goal === 'agreement') {
            if (dist === 'categorical' || dist === 'ordinal') {
                primary = 'Cohen\'s kappa (2 raters), Fleiss kappa (3+ raters)';
                alternative = 'Weighted kappa (ordinal), PABAK, Gwet AC1';
                effectSize = 'Kappa: < 0.20 poor, 0.21-0.40 fair, 0.41-0.60 moderate, 0.61-0.80 substantial, > 0.80 almost perfect';
                assumptions = 'Same categories, independent ratings within pairs';
                rCode = 'irr::kappa2(ratings)';
            } else {
                primary = 'ICC (intraclass correlation coefficient)';
                alternative = 'Bland-Altman plot, Lin concordance correlation';
                effectSize = 'ICC: < 0.50 poor, 0.50-0.75 moderate, 0.75-0.90 good, > 0.90 excellent';
                assumptions = 'Normality of differences, correct ICC model selection';
                rCode = 'irr::icc(ratings, model = "twoway", type = "agreement")';
            }
        } else if (goal === 'survival') {
            if (groups === '2' || groups === '3+') {
                primary = 'Log-rank test + Cox proportional hazards';
                alternative = 'Weighted log-rank, RMST, accelerated failure time model';
                effectSize = 'HR, median survival difference, RMST difference';
                assumptions = 'Proportional hazards (Schoenfeld residuals), non-informative censoring';
                rCode = 'survdiff(Surv(time, status) ~ group, data = df)\ncoxph(Surv(time, status) ~ group + covar, data = df)';
            } else {
                primary = 'Kaplan-Meier estimator';
                alternative = 'Nelson-Aalen, parametric models (Weibull, exponential)';
                effectSize = 'Median survival, survival at time t, RMST';
                assumptions = 'Non-informative censoring, independence';
                rCode = 'survfit(Surv(time, status) ~ 1, data = df)';
            }
        }

        var rhtml = '<div class="result-panel mt-2">';
        rhtml += '<div class="card-title">Recommended Statistical Test</div>';

        rhtml += '<div style="border-left:4px solid var(--success);padding:12px 16px;margin-bottom:12px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        rhtml += '<div style="font-weight:700;font-size:1.05rem;color:var(--success);margin-bottom:4px;">' + primary + '</div></div>';

        rhtml += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:12px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        rhtml += '<div style="font-weight:600;margin-bottom:4px;">Alternative(s)</div>';
        rhtml += '<div style="font-size:0.9rem;">' + alternative + '</div></div>';

        rhtml += '<div style="border-left:4px solid var(--warning);padding:12px 16px;margin-bottom:12px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        rhtml += '<div style="font-weight:600;margin-bottom:4px;">Effect Size to Report</div>';
        rhtml += '<div style="font-size:0.9rem;">' + effectSize + '</div></div>';

        rhtml += '<div style="border-left:4px solid var(--text-tertiary);padding:12px 16px;margin-bottom:12px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        rhtml += '<div style="font-weight:600;margin-bottom:4px;">Key Assumptions</div>';
        rhtml += '<div style="font-size:0.9rem;">' + assumptions + '</div></div>';

        rhtml += '<div style="border-left:4px solid var(--accent);padding:12px 16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        rhtml += '<div style="font-weight:600;margin-bottom:4px;">R Code</div>';
        rhtml += '<pre style="margin:0;font-size:0.82rem;white-space:pre-wrap;font-family:monospace;">' + rCode + '</pre></div>';

        rhtml += '</div>';
        App.setTrustedHTML(document.getElementById('ts-results'), rhtml);
    }

    // ================================================================
    // CARD 13: Multi-Variable Regression Summary Builder
    // ================================================================
    function renderMultiVarRegression() {
        var html = '<div class="card">';
        html += '<div class="card-title">Multi-Variable Regression Summary Builder</div>';
        html += '<div class="card-subtitle">Enter up to 5 predictors from a single regression model to generate a publication-ready summary table and plain-English interpretation.</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Regression Type</label>'
            + '<select class="form-select" id="mvr-type" name="mvr-type">'
            + '<option value="logistic">Logistic (OR)</option>'
            + '<option value="cox">Cox (HR)</option>'
            + '<option value="linear">Linear (B)</option>'
            + '<option value="poisson">Poisson (IRR)</option>'
            + '</select></div>';
        html += '<div class="form-group"><label class="form-label">Outcome Name</label>'
            + '<input type="text" class="form-input" id="mvr-outcome" name="mvr-outcome" value="Stroke"></div>';
        html += '</div>';

        for (var i = 1; i <= 5; i++) {
            html += '<div style="border:1px solid var(--border);border-radius:8px;padding:10px;margin-bottom:6px;">';
            html += '<div style="font-weight:600;font-size:0.85rem;margin-bottom:6px;">Predictor ' + i + '</div>';
            html += '<div class="form-row form-row--5">';
            html += '<div class="form-group"><label class="form-label" style="font-size:0.8rem;">Name</label><input type="text" class="form-input" id="mvr-name-' + i + '" placeholder="e.g., Age"></div>';
            html += '<div class="form-group"><label class="form-label" style="font-size:0.8rem;">Estimate</label><input type="number" class="form-input" id="mvr-est-' + i + '" step="0.01"></div>';
            html += '<div class="form-group"><label class="form-label" style="font-size:0.8rem;">CI Lower</label><input type="number" class="form-input" id="mvr-lo-' + i + '" step="0.01"></div>';
            html += '<div class="form-group"><label class="form-label" style="font-size:0.8rem;">CI Upper</label><input type="number" class="form-input" id="mvr-hi-' + i + '" step="0.01"></div>';
            html += '<div class="form-group"><label class="form-label" style="font-size:0.8rem;">P-value</label><input type="number" class="form-input" id="mvr-p-' + i + '" step="0.001" min="0" max="1"></div>';
            html += '</div></div>';
        }

        html += '<div class="btn-group mt-1">';
        html += '<button class="btn btn-primary" onclick="ResultsInterp.buildMVR()">Build Summary</button>';
        html += '<button class="btn btn-secondary" onclick="ResultsInterp.copyMVR()">Copy Table</button>';
        html += '</div>';
        html += '<div id="mvr-results"></div>';

        // Interpretation guide
        html += '<div style="margin-top:16px;border-top:1px solid var(--border);padding-top:16px;">';
        html += '<div style="font-weight:700;margin-bottom:8px;">Multi-Variable Regression Interpretation Guide</div>';

        var guideItems = [
            { title: 'Linear Regression', content: 'B coefficient: per 1-unit increase in X, Y changes by B units, holding others constant. R-sq: proportion of variance explained. F-test: overall model significance. Assumptions: linearity, normality of residuals, homoscedasticity, no multicollinearity.' },
            { title: 'Logistic Regression', content: 'OR = exp(B): per 1-unit increase in X, odds multiply by OR, adjusting for other variables. Pseudo R-sq: use Nagelkerke or McFadden. c-statistic (AUC): discrimination. Hosmer-Lemeshow or calibration plot: calibration.' },
            { title: 'Cox Regression', content: 'HR = exp(B): per 1-unit increase in X, hazard multiplied by HR. PH assumption: test with Schoenfeld residuals. Concordance (Harrell C): discrimination for survival models.' },
            { title: 'Poisson Regression', content: 'IRR = exp(B): per 1-unit increase in X, rate multiplied by IRR. Assumes mean = variance (equidispersion). If overdispersed, use negative binomial or robust SE.' }
        ];
        for (var gi = 0; gi < guideItems.length; gi++) {
            html += '<div onclick="this.querySelector(\'.mvr-guide-body\').classList.toggle(\'hidden\');" style="cursor:pointer;border-bottom:1px solid var(--border);padding:8px 0;">';
            html += '<strong>' + guideItems[gi].title + '</strong> <span style="font-size:0.8rem;">&#9656;</span>';
            html += '<div class="mvr-guide-body hidden" style="font-size:0.85rem;line-height:1.7;margin-top:6px;color:var(--text-secondary);">' + guideItems[gi].content + '</div>';
            html += '</div>';
        }

        html += '<div style="margin-top:12px;font-size:0.85rem;line-height:1.7;color:var(--text-secondary);">';
        html += '<strong>Common pitfalls:</strong> Multicollinearity (VIF > 5), overfitting (EPV < 10), adjusting for mediators instead of confounders, stepwise selection without validation.';
        html += '</div>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    function buildMVR() {
        var type = document.getElementById('mvr-type').value;
        var outcome = document.getElementById('mvr-outcome').value || 'Outcome';
        var estLabel = { logistic: 'OR', cox: 'HR', linear: 'B', poisson: 'IRR' }[type];

        var rows = [];
        for (var i = 1; i <= 5; i++) {
            var name = (document.getElementById('mvr-name-' + i).value || '').trim();
            if (!name) continue;
            var est = parseFloat(document.getElementById('mvr-est-' + i).value);
            var lo = parseFloat(document.getElementById('mvr-lo-' + i).value);
            var hi = parseFloat(document.getElementById('mvr-hi-' + i).value);
            var p = parseFloat(document.getElementById('mvr-p-' + i).value);
            if (isNaN(est)) continue;
            rows.push({ name: name, est: est, lo: lo, hi: hi, p: p });
        }

        if (rows.length === 0) {
            App.setTrustedHTML(document.getElementById('mvr-results'), '<p style="color:var(--text-secondary);margin-top:12px;">Enter at least one predictor with an estimate.</p>');
            return;
        }

        var rhtml = '<div class="result-panel mt-2">';
        rhtml += '<div class="card-title">' + (type === 'linear' ? 'Linear' : type === 'logistic' ? 'Logistic' : type === 'cox' ? 'Cox' : 'Poisson') + ' Regression: ' + outcome + '</div>';

        rhtml += '<div class="table-container"><table class="data-table">';
        rhtml += '<thead><tr><th>Predictor</th><th>' + estLabel + '</th><th>95% CI</th><th>P-value</th><th>Sig.</th></tr></thead>';
        rhtml += '<tbody>';
        for (var j = 0; j < rows.length; j++) {
            var r = rows[j];
            var sig = !isNaN(r.p) && r.p < 0.05;
            var pStr = isNaN(r.p) ? '--' : r.p < 0.001 ? '< 0.001' : r.p.toFixed(3);
            var ciStr = (!isNaN(r.lo) && !isNaN(r.hi)) ? r.lo.toFixed(2) + ' - ' + r.hi.toFixed(2) : '--';
            rhtml += '<tr><td><strong>' + r.name + '</strong></td><td>' + r.est.toFixed(2) + '</td><td>' + ciStr + '</td><td>' + pStr + '</td>';
            rhtml += '<td style="color:' + (sig ? 'var(--success)' : 'var(--text-secondary)') + ';font-weight:600;">' + (sig ? 'Yes' : 'No') + '</td></tr>';
        }
        rhtml += '</tbody></table></div>';

        // Plain English
        rhtml += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-top:12px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        rhtml += '<div style="font-weight:600;margin-bottom:8px;">Plain-English Interpretation</div>';
        rhtml += '<div style="font-size:0.9rem;line-height:1.8;">';
        for (var k = 0; k < rows.length; k++) {
            var row = rows[k];
            var sigK = !isNaN(row.p) && row.p < 0.05;
            var pDisp = isNaN(row.p) ? '' : ' (p ' + (row.p < 0.001 ? '< 0.001' : '= ' + row.p.toFixed(3)) + ')';
            var ciDisp = (!isNaN(row.lo) && !isNaN(row.hi)) ? ', 95% CI: ' + row.lo.toFixed(2) + '-' + row.hi.toFixed(2) : '';
            if (type === 'logistic') {
                rhtml += sigK
                    ? (row.est > 1 ? row.name + ': ' + ((row.est - 1) * 100).toFixed(0) + '% increased odds of ' + outcome + ' (OR = ' + row.est.toFixed(2) + ciDisp + pDisp + ').'
                        : row.name + ': ' + ((1 - row.est) * 100).toFixed(0) + '% decreased odds of ' + outcome + ' (OR = ' + row.est.toFixed(2) + ciDisp + pDisp + ').')
                    : row.name + ': not significantly associated with ' + outcome + ' (OR = ' + row.est.toFixed(2) + pDisp + ').';
            } else if (type === 'cox') {
                rhtml += sigK
                    ? (row.est > 1 ? row.name + ': ' + ((row.est - 1) * 100).toFixed(0) + '% increased hazard of ' + outcome + ' (HR = ' + row.est.toFixed(2) + ciDisp + pDisp + ').'
                        : row.name + ': ' + ((1 - row.est) * 100).toFixed(0) + '% decreased hazard of ' + outcome + ' (HR = ' + row.est.toFixed(2) + ciDisp + pDisp + ').')
                    : row.name + ': not significantly associated with ' + outcome + ' (HR = ' + row.est.toFixed(2) + pDisp + ').';
            } else if (type === 'linear') {
                rhtml += sigK
                    ? 'Each unit increase in ' + row.name + ': change of ' + row.est.toFixed(2) + ' in ' + outcome + ' (B = ' + row.est.toFixed(2) + ciDisp + pDisp + ').'
                    : row.name + ': not significantly associated with ' + outcome + ' (B = ' + row.est.toFixed(2) + pDisp + ').';
            } else {
                rhtml += sigK
                    ? (row.est > 1 ? row.name + ': rate ' + ((row.est - 1) * 100).toFixed(0) + '% higher (IRR = ' + row.est.toFixed(2) + ciDisp + pDisp + ').'
                        : row.name + ': rate ' + ((1 - row.est) * 100).toFixed(0) + '% lower (IRR = ' + row.est.toFixed(2) + ciDisp + pDisp + ').')
                    : row.name + ': not significantly associated with ' + outcome + ' rate (IRR = ' + row.est.toFixed(2) + pDisp + ').';
            }
            rhtml += '<br>';
        }
        rhtml += '</div></div>';
        rhtml += '</div>';
        App.setTrustedHTML(document.getElementById('mvr-results'), rhtml);
    }

    function copyMVR() {
        var el = document.getElementById('mvr-results');
        if (el) Export.copyText(el.textContent);
    }

    // ================================================================
    // CARD 13b: Regression Output Reader (NEW)
    // ================================================================
    function renderRegressionOutputReader() {
        var html = '<div class="card">';
        html += '<div class="card-title">Regression Output Reader</div>';
        html += '<div class="card-subtitle">Paste coefficient, SE, p-value, and variable name for multiple predictors from a published paper. Generates a formatted results table with standardized interpretations and visual display.</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Regression Type</label>'
            + '<select class="form-select" id="ror-type" name="ror-type">'
            + '<option value="linear">Linear (coefficients)</option>'
            + '<option value="logistic">Logistic (log-OR, will exponentiate)</option>'
            + '<option value="cox">Cox (log-HR, will exponentiate)</option>'
            + '<option value="poisson">Poisson (log-IRR, will exponentiate)</option>'
            + '</select></div>';
        html += '<div class="form-group"><label class="form-label">Outcome Variable Name</label>'
            + '<input type="text" class="form-input" id="ror-outcome" name="ror-outcome" value="Outcome" placeholder="e.g., Stroke recurrence"></div>';
        html += '</div>';

        for (var i = 1; i <= 10; i++) {
            var hidden = i > 4 ? ' class="ror-extra-row hidden"' : '';
            html += '<div' + hidden + ' style="border:1px solid var(--border);border-radius:8px;padding:6px 10px;margin-bottom:4px;">';
            html += '<div class="form-row form-row--4" style="margin-bottom:0;">';
            html += '<div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:0.78rem;">Variable ' + i + '</label>'
                + '<input type="text" class="form-input" id="ror-var-' + i + '" placeholder="e.g., Age"></div>';
            html += '<div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:0.78rem;">Coefficient</label>'
                + '<input type="number" class="form-input" id="ror-coef-' + i + '" step="0.001"></div>';
            html += '<div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:0.78rem;">Std Error</label>'
                + '<input type="number" class="form-input" id="ror-se-' + i + '" step="0.001"></div>';
            html += '<div class="form-group" style="margin-bottom:0;"><label class="form-label" style="font-size:0.78rem;">P-value</label>'
                + '<input type="number" class="form-input" id="ror-p-' + i + '" step="0.001" min="0" max="1"></div>';
            html += '</div></div>';
        }

        html += '<div class="btn-group mt-1">';
        html += '<button class="btn btn-secondary btn-sm" onclick="ResultsInterp.toggleRORRows()">Show More / Less Rows</button>';
        html += '<button class="btn btn-primary" onclick="ResultsInterp.buildROR()">Generate Report</button>';
        html += '<button class="btn btn-secondary" onclick="ResultsInterp.copyROR()">Copy Table</button>';
        html += '</div>';
        html += '<div id="ror-results"></div>';
        html += '</div>';
        return html;
    }

    function toggleRORRows() {
        var rows = document.querySelectorAll('.ror-extra-row');
        for (var i = 0; i < rows.length; i++) {
            rows[i].classList.toggle('hidden');
        }
    }

    function buildROR() {
        var regType = document.getElementById('ror-type').value;
        var outcome = document.getElementById('ror-outcome').value || 'Outcome';
        var isRatio = (regType !== 'linear');
        var estLabels = { linear: 'B', logistic: 'OR', cox: 'HR', poisson: 'IRR' };
        var estLabel = estLabels[regType];
        var predictors = [];

        for (var i = 1; i <= 10; i++) {
            var varName = (document.getElementById('ror-var-' + i).value || '').trim();
            if (!varName) continue;
            var coef = parseFloat(document.getElementById('ror-coef-' + i).value);
            var se = parseFloat(document.getElementById('ror-se-' + i).value);
            var pVal = parseFloat(document.getElementById('ror-p-' + i).value);
            if (isNaN(coef)) continue;

            var estimate, ciLo, ciHi;
            if (isRatio) {
                estimate = Math.exp(coef);
                ciLo = !isNaN(se) ? Math.exp(coef - 1.96 * se) : NaN;
                ciHi = !isNaN(se) ? Math.exp(coef + 1.96 * se) : NaN;
            } else {
                estimate = coef;
                ciLo = !isNaN(se) ? coef - 1.96 * se : NaN;
                ciHi = !isNaN(se) ? coef + 1.96 * se : NaN;
            }

            predictors.push({
                name: varName,
                coef: coef,
                se: se,
                pVal: pVal,
                estimate: estimate,
                ciLo: ciLo,
                ciHi: ciHi,
                sig: !isNaN(pVal) && pVal < 0.05
            });
        }

        if (predictors.length === 0) {
            App.setTrustedHTML(document.getElementById('ror-results'), '<p style="color:var(--text-secondary);margin-top:12px;">Enter at least one variable with a coefficient.</p>');
            return;
        }

        var nullVal = isRatio ? 1 : 0;

        // Find range for forest-style display
        var allVals = [];
        for (var v = 0; v < predictors.length; v++) {
            allVals.push(predictors[v].estimate);
            if (!isNaN(predictors[v].ciLo)) allVals.push(predictors[v].ciLo);
            if (!isNaN(predictors[v].ciHi)) allVals.push(predictors[v].ciHi);
        }
        allVals.push(nullVal);
        var plotMin = Math.min.apply(null, allVals);
        var plotMax = Math.max.apply(null, allVals);
        var plotRange = plotMax - plotMin;
        if (plotRange < 0.01) plotRange = 1;
        plotMin -= plotRange * 0.1;
        plotMax += plotRange * 0.1;
        plotRange = plotMax - plotMin;
        var nullPct = ((nullVal - plotMin) / plotRange * 100);

        var rhtml = '<div class="result-panel mt-2">';
        rhtml += '<div class="card-title">Regression Output: ' + (regType.charAt(0).toUpperCase() + regType.slice(1)) + ' Regression -- ' + outcome + '</div>';

        // Table
        rhtml += '<div class="table-scroll-wrap">';
        rhtml += '<table class="data-table" id="ror-table">';
        rhtml += '<thead><tr><th>Variable</th><th>Coeff</th><th>' + estLabel + '</th><th>95% CI</th><th>P-value</th><th>Sig</th><th style="min-width:200px;">Plot</th></tr></thead>';
        rhtml += '<tbody>';

        for (var r = 0; r < predictors.length; r++) {
            var pred = predictors[r];
            var pStr = isNaN(pred.pVal) ? '--' : (pred.pVal < 0.001 ? '< 0.001' : pred.pVal.toFixed(3));
            var ciStr = (!isNaN(pred.ciLo) && !isNaN(pred.ciHi)) ? pred.ciLo.toFixed(2) + ' to ' + pred.ciHi.toFixed(2) : '--';
            var sigColor = pred.sig ? 'var(--success)' : 'var(--text-secondary)';

            var esPct = ((pred.estimate - plotMin) / plotRange * 100);
            var loPct = !isNaN(pred.ciLo) ? ((pred.ciLo - plotMin) / plotRange * 100) : esPct;
            var hiPct = !isNaN(pred.ciHi) ? ((pred.ciHi - plotMin) / plotRange * 100) : esPct;
            esPct = Math.max(0, Math.min(100, esPct));
            loPct = Math.max(0, Math.min(100, loPct));
            hiPct = Math.max(0, Math.min(100, hiPct));

            rhtml += '<tr>';
            rhtml += '<td><strong>' + pred.name + '</strong></td>';
            rhtml += '<td>' + pred.coef.toFixed(3) + '</td>';
            rhtml += '<td><strong>' + pred.estimate.toFixed(2) + '</strong></td>';
            rhtml += '<td>' + ciStr + '</td>';
            rhtml += '<td>' + pStr + '</td>';
            rhtml += '<td style="color:' + sigColor + ';font-weight:600;">' + (pred.sig ? 'Yes' : 'No') + '</td>';
            rhtml += '<td><div style="position:relative;height:20px;background:var(--bg-tertiary);border-radius:4px;">';
            rhtml += '<div style="position:absolute;left:' + nullPct + '%;top:0;bottom:0;width:1px;background:var(--text-tertiary);z-index:1;"></div>';
            if (!isNaN(pred.ciLo) && !isNaN(pred.ciHi)) {
                rhtml += '<div style="position:absolute;left:' + loPct + '%;width:' + Math.max(1, hiPct - loPct) + '%;top:50%;height:2px;background:' + sigColor + ';transform:translateY(-50%);z-index:2;"></div>';
            }
            rhtml += '<div style="position:absolute;left:' + esPct + '%;top:50%;width:8px;height:8px;background:' + sigColor + ';transform:translate(-50%,-50%);border-radius:50%;z-index:3;"></div>';
            rhtml += '</div></td>';
            rhtml += '</tr>';
        }
        rhtml += '</tbody></table>';
        rhtml += '</div>';

        // Summary of significant vs non-significant
        var sigCount = 0;
        var nonSigCount = 0;
        for (var sc = 0; sc < predictors.length; sc++) {
            if (predictors[sc].sig) sigCount++;
            else nonSigCount++;
        }

        rhtml += '<div style="display:flex;gap:16px;margin-top:12px;flex-wrap:wrap;">';
        rhtml += '<div style="flex:1;min-width:200px;padding:12px;background:var(--bg-tertiary);border-radius:8px;border-left:4px solid var(--success);">';
        rhtml += '<div style="font-weight:700;color:var(--success);">Significant (p < 0.05)</div>';
        rhtml += '<div style="font-size:1.5rem;font-weight:700;">' + sigCount + '</div>';
        var sigNames = [];
        for (var sn = 0; sn < predictors.length; sn++) { if (predictors[sn].sig) sigNames.push(predictors[sn].name); }
        if (sigNames.length > 0) rhtml += '<div style="font-size:0.85rem;color:var(--text-secondary);">' + sigNames.join(', ') + '</div>';
        rhtml += '</div>';
        rhtml += '<div style="flex:1;min-width:200px;padding:12px;background:var(--bg-tertiary);border-radius:8px;border-left:4px solid var(--text-secondary);">';
        rhtml += '<div style="font-weight:700;color:var(--text-secondary);">Not Significant</div>';
        rhtml += '<div style="font-size:1.5rem;font-weight:700;">' + nonSigCount + '</div>';
        var nonSigNames = [];
        for (var nsn = 0; nsn < predictors.length; nsn++) { if (!predictors[nsn].sig) nonSigNames.push(predictors[nsn].name); }
        if (nonSigNames.length > 0) rhtml += '<div style="font-size:0.85rem;color:var(--text-secondary);">' + nonSigNames.join(', ') + '</div>';
        rhtml += '</div></div>';

        // Standardized interpretation sentences
        rhtml += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-top:12px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        rhtml += '<div style="font-weight:600;margin-bottom:8px;">Standardized Interpretation Sentences</div>';
        rhtml += '<div style="font-size:0.9rem;line-height:1.8;">';
        for (var k = 0; k < predictors.length; k++) {
            var pr = predictors[k];
            var pDisp = isNaN(pr.pVal) ? '' : ' (p ' + (pr.pVal < 0.001 ? '< 0.001' : '= ' + pr.pVal.toFixed(3)) + ')';
            var ciDisp = (!isNaN(pr.ciLo) && !isNaN(pr.ciHi)) ? ' (95% CI: ' + pr.ciLo.toFixed(2) + ' to ' + pr.ciHi.toFixed(2) + ')' : '';

            if (regType === 'linear') {
                if (pr.sig) {
                    rhtml += 'Each one-unit increase in <strong>' + pr.name + '</strong> was associated with a '
                        + (pr.estimate > 0 ? 'higher' : 'lower') + ' ' + outcome + ' by <strong>'
                        + Math.abs(pr.estimate).toFixed(2) + ' units</strong>' + ciDisp + pDisp + '.';
                } else {
                    rhtml += '<strong>' + pr.name + '</strong> was not significantly associated with ' + outcome
                        + ' (B = ' + pr.estimate.toFixed(2) + pDisp + ').';
                }
            } else if (regType === 'logistic') {
                if (pr.sig) {
                    rhtml += '<strong>' + pr.name + '</strong> was associated with '
                        + (pr.estimate > 1 ? ((pr.estimate - 1) * 100).toFixed(0) + '% increased' : ((1 - pr.estimate) * 100).toFixed(0) + '% decreased')
                        + ' odds of ' + outcome + ' (OR = ' + pr.estimate.toFixed(2) + ciDisp + pDisp + ').';
                } else {
                    rhtml += '<strong>' + pr.name + '</strong> was not significantly associated with ' + outcome
                        + ' (OR = ' + pr.estimate.toFixed(2) + pDisp + ').';
                }
            } else if (regType === 'cox') {
                if (pr.sig) {
                    rhtml += '<strong>' + pr.name + '</strong> was associated with '
                        + (pr.estimate > 1 ? ((pr.estimate - 1) * 100).toFixed(0) + '% increased' : ((1 - pr.estimate) * 100).toFixed(0) + '% decreased')
                        + ' hazard of ' + outcome + ' (HR = ' + pr.estimate.toFixed(2) + ciDisp + pDisp + ').';
                } else {
                    rhtml += '<strong>' + pr.name + '</strong> was not significantly associated with ' + outcome
                        + ' (HR = ' + pr.estimate.toFixed(2) + pDisp + ').';
                }
            } else if (regType === 'poisson') {
                if (pr.sig) {
                    rhtml += '<strong>' + pr.name + '</strong> was associated with '
                        + (pr.estimate > 1 ? ((pr.estimate - 1) * 100).toFixed(0) + '% higher' : ((1 - pr.estimate) * 100).toFixed(0) + '% lower')
                        + ' rate of ' + outcome + ' (IRR = ' + pr.estimate.toFixed(2) + ciDisp + pDisp + ').';
                } else {
                    rhtml += '<strong>' + pr.name + '</strong> was not significantly associated with ' + outcome
                        + ' rate (IRR = ' + pr.estimate.toFixed(2) + pDisp + ').';
                }
            }
            rhtml += '<br>';
        }
        rhtml += '</div></div>';

        rhtml += '</div>';
        App.setTrustedHTML(document.getElementById('ror-results'), rhtml);
    }

    function copyROR() {
        var table = document.getElementById('ror-table');
        if (!table) {
            var el = document.getElementById('ror-results');
            if (el) Export.copyText(el.textContent);
            return;
        }
        var text = '';
        var rows = table.querySelectorAll('tr');
        for (var i = 0; i < rows.length; i++) {
            var cells = rows[i].querySelectorAll('th, td');
            var rowText = [];
            for (var j = 0; j < cells.length - 1; j++) { // Skip plot column
                rowText.push(cells[j].textContent.trim());
            }
            text += rowText.join('\t') + '\n';
        }
        Export.copyText(text);
    }

    // ================================================================
    // CARD 14: Quick Reference Cards
    // ================================================================
    function renderQuickReference() {
        var html = '<div class="card">';
        html += '<div class="card-title">Quick Reference: What Does This Statistic Mean?</div>';
        html += '<div class="card-subtitle">Click any statistic to expand its definition, interpretation, and common pitfalls.</div>';

        var refs = [
            { id: 'ref-pvalue', title: 'P-value', content: '<strong>Definition:</strong> The probability of observing data as extreme as (or more extreme than) the observed data, assuming the null hypothesis is true.<br><br><strong>Range:</strong> 0 to 1.<br><br><strong>Key point:</strong> A small p-value indicates the data are unlikely under the null hypothesis. It does NOT indicate the probability that the null is true, nor does it measure effect size.<br><br><strong>Common threshold:</strong> alpha = 0.05 (arbitrary).' },
            { id: 'ref-ci', title: 'Confidence Interval (CI)', content: '<strong>Definition:</strong> A range of values within which the true population parameter is expected to lie with a specified probability (typically 95%).<br><br><strong>Interpretation:</strong> If the study were repeated many times, 95% of computed CIs would contain the true value.<br><br><strong>Key point:</strong> CIs provide more information than p-values alone.' },
            { id: 'ref-se', title: 'Standard Error (SE)', content: '<strong>Definition:</strong> The standard deviation of a sampling distribution.<br><br><strong>Relationship:</strong> SE = SD / sqrt(n).<br><br><strong>Use:</strong> CIs and test statistics. Do not confuse with SD.' },
            { id: 'ref-or', title: 'Odds Ratio (OR)', content: '<strong>Definition:</strong> Ratio of odds of outcome in exposed vs unexposed.<br><br><strong>Range:</strong> 0 to infinity. OR=1 means no association.<br><br><strong>Key point:</strong> OR approximates RR only when outcome is rare (<10%).' },
            { id: 'ref-rr', title: 'Risk Ratio (RR)', content: '<strong>Definition:</strong> Ratio of risk in exposed vs unexposed.<br><br><strong>Range:</strong> 0 to infinity. RR=1 means no association.<br><br><strong>Key point:</strong> More intuitive than OR. Can be estimated from cohort studies and RCTs.' },
            { id: 'ref-hr', title: 'Hazard Ratio (HR)', content: '<strong>Definition:</strong> Ratio of hazards (instantaneous event rates) between groups.<br><br><strong>Assumption:</strong> Proportional hazards (constant HR over time).<br><br><strong>Key point:</strong> Unlike RR, HR accounts for censoring and time-to-event data.' },
            { id: 'ref-nnt', title: 'Number Needed to Treat (NNT)', content: '<strong>Definition:</strong> Number of patients to treat to prevent one event.<br><br><strong>Formula:</strong> NNT = 1/ARR.<br><br><strong>Key point:</strong> Always specify time frame and baseline risk.' },
            { id: 'ref-auc', title: 'AUC (c-statistic)', content: '<strong>Definition:</strong> Probability that a randomly chosen positive case ranks higher than a negative case.<br><br><strong>Range:</strong> 0.5 (no discrimination) to 1.0 (perfect).<br><br><strong>Key point:</strong> Measures discrimination, not calibration.' },
            { id: 'ref-i2', title: 'I-squared (I\u00B2)', content: '<strong>Definition:</strong> Percentage of variability due to true heterogeneity vs chance.<br><br><strong>Benchmarks:</strong> 0-25% low, 25-50% moderate, 50-75% substantial, >75% considerable.<br><br><strong>Key point:</strong> Does not indicate the magnitude of heterogeneity.' },
            { id: 'ref-fragility', title: 'Fragility Index', content: '<strong>Definition:</strong> Minimum number of patients whose outcome would need to change to make a significant result non-significant.<br><br><strong>Key point:</strong> Low fragility (0-3) means the result is fragile.' }
        ];

        for (var i = 0; i < refs.length; i++) {
            var r = refs[i];
            html += '<div style="border:1px solid var(--border);border-radius:8px;margin-bottom:8px;">';
            html += '<div onclick="ResultsInterp.toggleRef(\'' + r.id + '\')" style="padding:12px 16px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:0.95rem;user-select:none;">'
                + r.title + '<span id="' + r.id + '-icon" style="font-size:1.2rem;transition:transform 0.2s;">&#9656;</span></div>';
            html += '<div id="' + r.id + '" class="hidden" style="padding:0 16px 16px 16px;font-size:0.9rem;line-height:1.7;">' + r.content + '</div>';
            html += '</div>';
        }

        html += '</div>';
        return html;
    }

    function toggleRef(id) {
        var el = document.getElementById(id);
        var icon = document.getElementById(id + '-icon');
        if (!el) return;
        if (el.classList.contains('hidden')) {
            el.classList.remove('hidden');
            if (icon) icon.style.transform = 'rotate(90deg)';
        } else {
            el.classList.add('hidden');
            if (icon) icon.style.transform = 'rotate(0deg)';
        }
    }

    // ================================================================
    // REGISTER
    // ================================================================
    App.registerModule(MODULE_ID, { render: render });

    window.ResultsInterp = {
        interpretPValue: interpretPValue,
        copyPValue: copyPValue,
        interpretCI: interpretCI,
        copyCI: copyCI,
        interpretES: interpretES,
        updateESLabels: updateESLabels,
        copyES: copyES,
        interpretReg: interpretReg,
        updateRegFields: updateRegFields,
        copyReg: copyReg,
        toggleRef: toggleRef,
        calcBA: calcBA,
        convertES: convertES,
        selectTest: selectTest,
        buildMVR: buildMVR,
        copyMVR: copyMVR,
        buildForestPlot: buildForestPlot,
        copyForestPlot: copyForestPlot,
        buildROR: buildROR,
        copyROR: copyROR,
        toggleRORRows: toggleRORRows
    };
})();
