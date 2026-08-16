/**
 * Neuro-Epi — Regression Planning Helper Module
 * Features: Regression Wizard, EPV Calculator, DAG Builder, Model Building Strategy Guide,
 *           Logistic Regression Guide, Multivariate Model Building, Assumption Checking,
 *           Interaction Terms Calculator, Sample Size for Regression
 */

(function() {
    'use strict';

    const MODULE_ID = 'regression-helper';

    // DAG state
    var dagNodes = [];
    var dagEdges = [];
    var nodeIdCounter = 0;

    function render(container) {
        var html = App.createModuleLayout(
            'Regression Planning',
            'Tools for choosing the right regression model, checking sample size adequacy, building directed acyclic graphs, planning model building strategies, and interpreting logistic regression and interaction terms.'
        );

        html += '<div class="card">';
        html += '<div class="tabs" id="rh-tabs">'
            + '<button class="tab active" data-tab="wizard" onclick="RegressionHelper.switchTab(\'wizard\')">Regression Wizard</button>'
            + '<button class="tab" data-tab="epv" onclick="RegressionHelper.switchTab(\'epv\')">EPV Calculator</button>'
            + '<button class="tab" data-tab="dag" onclick="RegressionHelper.switchTab(\'dag\')">DAG Builder</button>'
            + '<button class="tab" data-tab="strategy" onclick="RegressionHelper.switchTab(\'strategy\')">Model Building</button>'
            + '<button class="tab" data-tab="logistic" onclick="RegressionHelper.switchTab(\'logistic\')">Logistic Regression</button>'
            + '<button class="tab" data-tab="assumptions" onclick="RegressionHelper.switchTab(\'assumptions\')">Assumption Checks</button>'
            + '<button class="tab" data-tab="interaction" onclick="RegressionHelper.switchTab(\'interaction\')">Interactions</button>'
            + '<button class="tab" data-tab="regss" onclick="RegressionHelper.switchTab(\'regss\')">Sample Size</button>'
            + '</div>';

        // ===== TAB A: Regression Wizard =====
        html += '<div class="tab-content active" id="tab-wizard">';
        html += '<div class="card-subtitle">Answer a few questions to find the most appropriate regression model for your analysis.</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Outcome Type ' + App.tooltip('What is the nature of your dependent variable?') + '</label>'
            + '<select class="form-select" id="rh-outcome-type">'
            + '<option value="">-- Select --</option>'
            + '<option value="binary">Binary (e.g., mRS 0-2 vs 3-6)</option>'
            + '<option value="continuous">Continuous (e.g., NIHSS score change)</option>'
            + '<option value="count">Count (e.g., number of lesions)</option>'
            + '<option value="time">Time-to-Event (e.g., time to event/relapse)</option>'
            + '<option value="ordinal">Ordinal (e.g., full mRS shift)</option>'
            + '</select></div>'
            + '<div class="form-group"><label class="form-label">Clustering? ' + App.tooltip('Are observations grouped (e.g., patients within facilities)?') + '</label>'
            + '<select class="form-select" id="rh-clustering">'
            + '<option value="no">No</option>'
            + '<option value="yes">Yes (e.g., multicenter)</option>'
            + '</select></div>'
            + '<div class="form-group"><label class="form-label">Repeated Measures? ' + App.tooltip('Multiple measurements per subject over time?') + '</label>'
            + '<select class="form-select" id="rh-repeated">'
            + '<option value="no">No</option>'
            + '<option value="yes">Yes</option>'
            + '</select></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RegressionHelper.recommend()">Recommend Model</button>'
            + '</div>';

        html += '<div id="rh-wizard-results"></div>';
        html += '</div>';

        // ===== TAB B: EPV Calculator =====
        html += '<div class="tab-content" id="tab-epv">';
        html += '<div class="card-subtitle">Events Per Variable (EPV) determines if your sample size is adequate for the number of covariates in your regression model.</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Number of Events (or total N for continuous) ' + App.tooltip('For logistic regression: number of events in the smaller outcome group. For Cox: number of events. For linear: total N.') + '</label>'
            + '<input type="number" class="form-input" id="rh-events" step="1" min="1" value="100"></div>'
            + '<div class="form-group"><label class="form-label">Number of Covariates (candidate predictors)</label>'
            + '<input type="number" class="form-input" id="rh-covariates" step="1" min="1" value="8"></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RegressionHelper.calculateEPV()">Calculate EPV</button>'
            + '</div>';

        html += '<div id="rh-epv-results"></div>';

        html += '<div class="card-title mt-3">EPV Reference Guide</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>EPV</th><th>Interpretation</th><th>Recommendation</th></tr></thead><tbody>'
            + '<tr><td class="num" style="color:var(--danger)">&lt; 5</td><td>Severely inadequate</td><td>Model will be highly unstable; reduce covariates or increase sample</td></tr>'
            + '<tr><td class="num" style="color:var(--danger)">5 - 9</td><td>Inadequate</td><td>High risk of overfitting; coefficient estimates unreliable</td></tr>'
            + '<tr><td class="num" style="color:var(--warning)">10 - 20</td><td>Marginal</td><td>Traditional minimum; may be adequate for simple models</td></tr>'
            + '<tr><td class="num" style="color:var(--success)">20 - 50</td><td>Adequate</td><td>Good for most models; reliable coefficient estimates</td></tr>'
            + '<tr><td class="num" style="color:var(--success)">&gt; 50</td><td>Excellent</td><td>Supports complex models with interactions and nonlinearity</td></tr>'
            + '</tbody></table></div>';

        html += '</div>';

        // ===== TAB C: DAG Builder =====
        html += '<div class="tab-content" id="tab-dag">';
        html += '<div class="card-subtitle">Build a simplified Directed Acyclic Graph (DAG) for your study. Add nodes (variables) and edges (causal paths) to visualize relationships and identify the adjustment set.</div>';

        html += '<div class="card-title">Add Node</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Variable Name</label>'
            + '<input type="text" class="form-input" id="rh-node-name" placeholder="e.g., Disease Severity, Age, BMI"></div>'
            + '<div class="form-group"><label class="form-label">Type</label>'
            + '<select class="form-select" id="rh-node-type">'
            + '<option value="exposure">Exposure</option>'
            + '<option value="outcome">Outcome</option>'
            + '<option value="confounder">Confounder</option>'
            + '<option value="mediator">Mediator</option>'
            + '<option value="collider">Collider</option>'
            + '</select></div>'
            + '<div class="form-group" style="display:flex;align-items:flex-end">'
            + '<button class="btn btn-primary" onclick="RegressionHelper.addNode()">Add Node</button></div>'
            + '</div>';

        html += '<div class="card-title mt-2">Add Edge (Causal Path)</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">From</label>'
            + '<select class="form-select" id="rh-edge-from"></select></div>'
            + '<div class="form-group"><label class="form-label">To</label>'
            + '<select class="form-select" id="rh-edge-to"></select></div>'
            + '<div class="form-group" style="display:flex;align-items:flex-end">'
            + '<button class="btn btn-primary" onclick="RegressionHelper.addEdge()">Add Edge</button></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="RegressionHelper.clearDAG()">Clear DAG</button>'
            + '<button class="btn btn-secondary" onclick="RegressionHelper.loadExampleDAG()">Load Example</button>'
            + '</div>';

        html += '<div class="chart-container mt-2"><canvas id="rh-dag-canvas" width="700" height="400"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'rh-dag-canvas\'),\'dag-diagram.png\')">Export PNG</button>'
            + '</div>';

        html += '<div id="rh-dag-info"></div>';
        html += '</div>';

        // ===== TAB D: Model Building Strategy Guide =====
        html += '<div class="tab-content" id="tab-strategy">';
        html += '<div class="card-subtitle">Guidance on variable selection strategies, collinearity diagnostics, and model building best practices.</div>';

        html += buildStrategyContent();
        html += '</div>';

        // ===== TAB E: Logistic Regression Guide =====
        html += '<div class="tab-content" id="tab-logistic">';
        html += '<div class="card-subtitle">Comprehensive guide to logistic regression: odds ratio interpretation, ROC curve concepts, and model fit assessment.</div>';
        html += buildLogisticContent();
        html += '</div>';

        // ===== TAB F: Assumption Checking Guide =====
        html += '<div class="tab-content" id="tab-assumptions">';
        html += '<div class="card-subtitle">Assumption checking guide for each regression type with diagnostic approaches and remedies.</div>';
        html += buildAssumptionContent();
        html += '</div>';

        // ===== TAB G: Interaction Terms =====
        html += '<div class="tab-content" id="tab-interaction">';
        html += '<div class="card-subtitle">Calculator and interpretation guide for interaction terms in regression models.</div>';
        html += buildInteractionContent();
        html += '</div>';

        // ===== TAB H: Sample Size for Regression =====
        html += '<div class="tab-content" id="tab-regss">';
        html += '<div class="card-subtitle">Sample size requirements for different regression approaches including the events-per-variable rule.</div>';
        html += buildRegressionSampleSizeContent();
        html += '</div>';

        html += '</div>'; // end card

        // ===== LEARN SECTION =====
        html += '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Learn: Regression Analysis Essentials</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';

        html += '<div class="card-subtitle" style="font-weight:600;">Key Formulas</div>';
        html += '<div style="background:var(--bg-secondary);padding:12px;border-radius:8px;font-family:var(--font-mono);margin-bottom:12px;">'
            + '<div><strong>Linear:</strong> Y = \u03B2\u2080 + \u03B2\u2081X\u2081 + \u2026 + \u03B5</div>'
            + '<div><strong>Logistic:</strong> logit(P) = \u03B2\u2080 + \u03B2\u2081X\u2081 + \u2026, OR = exp(\u03B2)</div>'
            + '<div><strong>Poisson:</strong> log(\u03BC) = \u03B2\u2080 + \u03B2\u2081X\u2081 + \u2026, IRR = exp(\u03B2)</div>'
            + '<div><strong>Cox PH:</strong> h(t) = h\u2080(t) \u00D7 exp(\u03B2\u2081X\u2081 + \u2026), HR = exp(\u03B2)</div>'
            + '<div><strong>Ordinal (proportional odds):</strong> logit(P(Y\u2264j)) = \u03B1\u2C7C \u2212 \u03B2X, common OR</div>'
            + '</div>';

        html += '<div class="card-subtitle" style="font-weight:600;">Model Selection Rules of Thumb</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>Events per variable (EPV) \u2265 10 for logistic/Cox regression</li>'
            + '<li>Use AIC/BIC for non-nested models, LRT for nested models</li>'
            + '<li>VIF > 5 suggests collinearity; VIF > 10 is severe</li>'
            + '<li>Check linearity of continuous predictors with restricted cubic splines</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Logistic Regression Essentials</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>OR interpretation:</strong> exp(\u03B2) gives the multiplicative change in odds for a 1-unit increase in the predictor</li>'
            + '<li><strong>OR to probability:</strong> P = OR / (1 + OR) when baseline odds are 1:1</li>'
            + '<li><strong>ROC/AUC:</strong> AUC = 0.5 (no discrimination) to 1.0 (perfect). AUC > 0.7 is acceptable, > 0.8 is excellent</li>'
            + '<li><strong>Hosmer-Lemeshow test:</strong> Tests calibration by grouping predicted probabilities; a non-significant p means no statistical evidence of miscalibration (not proof of adequate fit &mdash; the test has low power in small samples)</li>'
            + '<li><strong>Calibration plots:</strong> Plot observed vs predicted probabilities; should follow the 45-degree line</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Multivariate Model Building</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Forward selection:</strong> Start empty, add variables one at a time based on significance or fit improvement</li>'
            + '<li><strong>Backward elimination:</strong> Start full, remove variables based on largest p-value above threshold</li>'
            + '<li><strong>Stepwise:</strong> Combination of forward and backward; variables can enter and leave; high Type I error</li>'
            + '<li><strong>LASSO (L1 penalty):</strong> Shrinks coefficients toward zero; performs variable selection; requires cross-validation for lambda</li>'
            + '<li><strong>Ridge (L2 penalty):</strong> Shrinks coefficients but keeps all variables; better for collinear predictors</li>'
            + '<li><strong>Elastic net:</strong> Combination of LASSO and ridge; good for correlated predictors with some true zeros</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Interaction Terms</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Product term:</strong> Include X1 * X2 in the model to test if the effect of X1 depends on the level of X2</li>'
            + '<li><strong>Interpretation:</strong> The coefficient of the interaction term represents the additional effect beyond the main effects</li>'
            + '<li><strong>Power:</strong> Interaction tests typically require 4x the sample size of main effect tests</li>'
            + '<li><strong>Centering:</strong> Mean-center continuous variables before creating interactions to reduce collinearity</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Common Pitfalls</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Stepwise selection:</strong> Inflates Type I error and produces unstable models; use penalized methods instead</li>'
            + '<li><strong>Ignoring interactions:</strong> Effect modification can mask true relationships</li>'
            + '<li><strong>Overfitting:</strong> Too many predictors relative to events; validate with bootstrapping or cross-validation</li>'
            + '<li><strong>Collider bias:</strong> Adjusting for a collider opens a spurious pathway; use DAG guidance</li>'
            + '<li><strong>Complete separation:</strong> In logistic regression, perfect prediction by a covariate makes ML estimates infinite; use Firth correction</li>'
            + '<li><strong>Ignoring non-linearity:</strong> Continuous predictors may have nonlinear effects; use splines or fractional polynomials</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;">'
            + '<li>Harrell FE. <em>Regression Modeling Strategies</em>. 2nd ed. Springer; 2015.</li>'
            + '<li>Vittinghoff E, et al. <em>Regression Methods in Biostatistics</em>. 2nd ed. Springer; 2012.</li>'
            + '<li>Hosmer DW, Lemeshow S, Sturdivant RX. <em>Applied Logistic Regression</em>. 3rd ed. Wiley; 2013.</li>'
            + '<li>Steyerberg EW. <em>Clinical Prediction Models</em>. 2nd ed. Springer; 2019.</li>'
            + '<li>Riley RD, et al. Minimum sample size for developing a multivariable prediction model. <em>BMJ</em>. 2020;368:m441.</li>'
            + '</ul>';
        html += '</div></div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);

        // Reset DAG state
        dagNodes = [];
        dagEdges = [];
        nodeIdCounter = 0;
    }

    // ===== Logistic Regression Guide =====
    function buildLogisticContent() {
        var html = '';

        // OR Interpretation Section
        html += '<div class="card-title">Odds Ratio Interpretation Guide</div>';
        html += '<div class="result-panel mb-2">';
        html += '<p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.7;margin:0 0 12px 0">'
            + 'In logistic regression, coefficients (\u03B2) are on the log-odds scale. Exponentiate to get the odds ratio: '
            + '<strong>OR = exp(\u03B2)</strong>. The OR represents the multiplicative change in the odds of the outcome for a 1-unit increase in the predictor.</p>';

        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Coefficient (\u03B2)</th><th>OR = exp(\u03B2)</th><th>Interpretation</th></tr></thead><tbody>'
            + '<tr><td class="num">\u03B2 > 0</td><td class="num">OR > 1</td><td>Increased odds (risk factor)</td></tr>'
            + '<tr><td class="num">\u03B2 = 0</td><td class="num">OR = 1</td><td>No association</td></tr>'
            + '<tr><td class="num">\u03B2 < 0</td><td class="num">OR < 1</td><td>Decreased odds (protective)</td></tr>'
            + '</tbody></table></div>';

        html += '<div class="card-title mt-2">OR Quick Calculator</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Coefficient (\u03B2)</label>'
            + '<input type="number" class="form-input" id="rh-or-beta" step="0.01" value="0.69"></div>'
            + '<div class="form-group"><label class="form-label">Unit change in predictor</label>'
            + '<input type="number" class="form-input" id="rh-or-unit" step="1" value="1"></div>'
            + '<div class="form-group" style="display:flex;align-items:flex-end">'
            + '<button class="btn btn-primary" onclick="RegressionHelper.calcOR()">Calculate OR</button></div>'
            + '</div>';
        html += '<div id="rh-or-result"></div>';
        html += '</div>';

        // ROC Curve Concepts
        html += '<div class="card-title mt-3">ROC Curve and Discrimination</div>';
        html += '<div class="result-panel mb-2">';
        html += '<p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.7;margin:0 0 12px 0">'
            + 'The Receiver Operating Characteristic (ROC) curve plots sensitivity (true positive rate) against 1-specificity (false positive rate) '
            + 'at various discrimination thresholds. The area under the curve (AUC or C-statistic) summarizes overall discrimination ability.</p>';

        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>AUC / C-statistic</th><th>Discrimination Quality</th><th>Interpretation</th></tr></thead><tbody>'
            + '<tr><td class="num" style="color:var(--danger)">0.50 - 0.59</td><td>Fail / No discrimination</td><td>No better than chance; model has no discriminating ability</td></tr>'
            + '<tr><td class="num" style="color:var(--warning)">0.60 - 0.69</td><td>Poor</td><td>Minimal discrimination; rarely clinically useful alone</td></tr>'
            + '<tr><td class="num" style="color:var(--warning)">0.70 - 0.79</td><td>Acceptable</td><td>Reasonable discrimination; useful in conjunction with other information</td></tr>'
            + '<tr><td class="num" style="color:var(--success)">0.80 - 0.89</td><td>Excellent</td><td>Strong discrimination; clinically useful for risk stratification</td></tr>'
            + '<tr><td class="num" style="color:var(--success)">0.90 - 1.00</td><td>Outstanding</td><td>Near-perfect discrimination; rare in clinical prediction models</td></tr>'
            + '</tbody></table></div>';
        html += '</div>';

        // Hosmer-Lemeshow and Calibration
        html += '<div class="card-title mt-3">Goodness of Fit: Hosmer-Lemeshow Test</div>';
        html += '<div class="result-panel mb-2">';
        html += '<p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.7;margin:0 0 12px 0">'
            + 'The Hosmer-Lemeshow (HL) test assesses <strong>calibration</strong> -- whether predicted probabilities match observed frequencies. '
            + 'It divides subjects into deciles of predicted risk and compares observed vs. expected counts using a chi-squared statistic.</p>';

        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>HL Test Result</th><th>Interpretation</th><th>Action</th></tr></thead><tbody>'
            + '<tr><td>p > 0.05</td><td style="color:var(--success)">No evidence of miscalibration</td><td>Consistent with adequate calibration, but not proof (low power in small samples) &mdash; inspect the calibration plot</td></tr>'
            + '<tr><td>p < 0.05</td><td style="color:var(--danger)">Poor fit</td><td>Model miscalibrated; consider adding non-linear terms, interactions, or recalibrating</td></tr>'
            + '</tbody></table></div>';

        html += '<div style="margin-top:12px;padding:12px;background:var(--surface);border-radius:8px;">'
            + '<strong style="color:var(--warning);font-size:0.85rem">Limitations of the HL test:</strong>'
            + '<ul style="margin:4px 0 0 16px;color:var(--text-secondary);font-size:0.85rem;line-height:1.6">'
            + '<li>Sensitive to sample size (large samples may reject even adequate models)</li>'
            + '<li>Result depends on number of groups (default is 10 deciles)</li>'
            + '<li>Low power with small samples</li>'
            + '<li>Modern alternative: calibration plots with loess smoother and calibration slope/intercept</li>'
            + '</ul></div>';
        html += '</div>';

        // Model performance summary
        html += '<div class="card-title mt-3">Complete Model Assessment Checklist</div>';
        html += '<div class="result-panel">';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Aspect</th><th>Metric</th><th>Target</th><th>R / Stata Command</th></tr></thead><tbody>'
            + '<tr><td>Discrimination</td><td>AUC / C-statistic</td><td>&ge; 0.70</td><td><code>pROC::auc()</code> / <code>lroc</code></td></tr>'
            + '<tr><td>Calibration</td><td>Calibration plot, slope &asymp; 1</td><td>Close to 45-degree line</td><td><code>rms::val.prob()</code> / <code>pmcalplot</code></td></tr>'
            + '<tr><td>Calibration</td><td>Hosmer-Lemeshow</td><td>p > 0.05</td><td><code>ResourceSelection::hoslem.test()</code> / <code>estat gof</code></td></tr>'
            + '<tr><td>Overall fit</td><td>Nagelkerke R-squared</td><td>Higher is better</td><td><code>rms::lrm()</code> / <code>fitstat</code></td></tr>'
            + '<tr><td>Overall fit</td><td>Brier score</td><td>Lower is better; compare against the non-informative benchmark prevalence &times; (1 &minus; prevalence)</td><td><code>DescTools::BrierScore()</code></td></tr>'
            + '<tr><td>Validation</td><td>Optimism-corrected AUC</td><td>Minimal shrinkage</td><td><code>rms::validate()</code></td></tr>'
            + '</tbody></table></div>';
        html += '</div>';

        return html;
    }

    // ===== Multivariate Model Building Guide (in Strategy tab) =====
    function buildStrategyContent() {
        var html = '';

        // Strategy cards
        var strategies = [
            {
                title: 'Purposeful Selection (Hosmer-Lemeshow)',
                description: 'Begin with univariable analysis of each candidate variable. Include variables with p < 0.25 in multivariable model. Remove variables one at a time; keep if removal changes any remaining coefficient by >15-20%. Recheck excluded variables by adding them back. Include clinically important variables regardless of statistical significance.',
                pros: 'Clinically driven; balances parsimony with confounding control; recommended for epidemiologic research',
                cons: 'Subjective choice of significance threshold; labor-intensive; may not scale well with many variables',
                bestFor: 'Etiologic studies where confounding control is primary goal'
            },
            {
                title: 'Change-in-Estimate (10% Rule)',
                description: 'Include a variable in the model if its removal changes the exposure-outcome coefficient by more than 10%. This method focuses purely on confounding control rather than statistical significance. Apply iteratively, removing one confounder at a time.',
                pros: 'Objective criterion; focuses on bias reduction; not dependent on sample size',
                cons: 'Arbitrary 10% threshold; does not account for precision; may retain irrelevant variables in small samples',
                bestFor: 'Observational studies focused on estimating a single exposure effect'
            },
            {
                title: 'Backward Elimination',
                description: 'Start with all candidate variables in the model. Remove the variable with the largest p-value above the threshold (e.g., p > 0.10). Repeat until all remaining variables meet the criterion. Consider using a liberal threshold (p = 0.157 corresponds to AIC).',
                pros: 'Simple; automated; more stable than forward selection (though selection remains unstable in small samples)',
                cons: 'May drop confounders; order-dependent; multiple testing issues; p-values unreliable after selection',
                bestFor: 'Prediction models where parsimony is prioritized'
            },
            {
                title: 'Forward Selection',
                description: 'Start with no variables. Add the variable that most improves model fit (lowest p-value or highest likelihood ratio test statistic). Continue adding variables until no further improvement meets the threshold.',
                pros: 'Simple; works with many candidate variables',
                cons: 'Tends to miss important variables; sensitive to collinearity; order-dependent; less stable than backward',
                bestFor: 'Exploratory analysis when number of candidates greatly exceeds what can be included'
            },
            {
                title: 'LASSO Penalized Regression',
                description: 'Applies an L1 penalty to the log-likelihood, shrinking some coefficients exactly to zero. The penalty strength (lambda) is selected via cross-validation. Performs simultaneous estimation and variable selection.',
                pros: 'Handles high-dimensional data; automated variable selection; shrinks overfitting; handles collinearity',
                cons: 'Coefficients are biased (shrunk); requires cross-validation; interpretation differs from standard logistic regression; no standard CIs without bootstrap',
                bestFor: 'Prediction models with many candidate predictors or high-dimensional data (genomics, imaging features)'
            },
            {
                title: 'Full Pre-Specified Model (DAG-Based)',
                description: 'Pre-specify the adjustment set based on a directed acyclic graph (DAG) before seeing the data. Include all identified confounders regardless of statistical significance. Do not perform variable selection.',
                pros: 'Eliminates data-driven selection bias; transparent; reproducible; no inflation of Type I error',
                cons: 'Requires strong causal knowledge; may include unnecessary variables; relies on correct DAG specification',
                bestFor: 'Causal inference studies; pre-registered analyses; confirmatory research'
            }
        ];

        strategies.forEach(function(s) {
            html += '<div class="result-panel mb-2">'
                + '<div class="card-title">' + s.title + '</div>'
                + '<p style="margin:8px 0;color:var(--text-secondary);font-size:0.9rem">' + s.description + '</p>'
                + '<div class="form-row form-row--3">'
                + '<div><strong style="color:var(--success);font-size:0.8rem">Strengths:</strong><br><span style="font-size:0.8rem;color:var(--text-secondary)">' + s.pros + '</span></div>'
                + '<div><strong style="color:var(--danger);font-size:0.8rem">Limitations:</strong><br><span style="font-size:0.8rem;color:var(--text-secondary)">' + s.cons + '</span></div>'
                + '<div><strong style="color:var(--accent);font-size:0.8rem">Best For:</strong><br><span style="font-size:0.8rem;color:var(--text-secondary)">' + s.bestFor + '</span></div>'
                + '</div></div>';
        });

        // Collinearity / VIF Table
        html += '<div class="card-title mt-3">Collinearity Diagnostics: VIF Interpretation ' + App.tooltip('Variance Inflation Factor quantifies how much the variance of a coefficient is inflated due to collinearity with other predictors.') + '</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>VIF Range</th><th>Tolerance (1/VIF)</th><th>Interpretation</th><th>Action</th></tr></thead><tbody>'
            + '<tr><td class="num" style="color:var(--success)">1.0 - 2.5</td><td class="num">0.40 - 1.00</td><td>No significant collinearity</td><td>No action needed</td></tr>'
            + '<tr><td class="num" style="color:var(--warning)">2.5 - 5.0</td><td class="num">0.20 - 0.40</td><td>Moderate collinearity</td><td>Monitor; consider combining or dropping one variable</td></tr>'
            + '<tr><td class="num" style="color:var(--danger)">5.0 - 10.0</td><td class="num">0.10 - 0.20</td><td>High collinearity</td><td>SEs unreliable; combine variables or remove one</td></tr>'
            + '<tr><td class="num" style="color:var(--danger)">&gt; 10.0</td><td class="num">&lt; 0.10</td><td>Severe collinearity</td><td>Model unstable; must address before interpreting coefficients</td></tr>'
            + '</tbody></table></div>';

        // Model Checking Checklist
        html += '<div class="card-title mt-3">Model Checking Checklist</div>';
        html += '<div class="result-panel">'
            + '<ul style="margin:0;padding-left:20px;color:var(--text-secondary);font-size:0.9rem;line-height:1.8">'
            + '<li><strong>Proportional odds assumption</strong> (ordinal logistic): Test with Brant test or partial proportional odds model</li>'
            + '<li><strong>Proportional hazards</strong> (Cox): Check Schoenfeld residuals and log-log plots</li>'
            + '<li><strong>Linearity</strong> (all models): Check continuous predictors with fractional polynomials or restricted cubic splines</li>'
            + '<li><strong>Influential observations</strong>: Check dfbetas, Cook\'s distance, leverage values</li>'
            + '<li><strong>Goodness of fit</strong>: Hosmer-Lemeshow test (logistic), C-statistic / AUC, calibration plots</li>'
            + '<li><strong>Model specification</strong>: Link test (logistic), Pregibon test, information criteria (AIC, BIC)</li>'
            + '<li><strong>Overdispersion</strong> (Poisson): Compare deviance to df; use negative binomial if overdispersed</li>'
            + '<li><strong>Missing data</strong>: Document missingness pattern; consider multiple imputation for MAR data</li>'
            + '</ul></div>';

        html += '<div class="card-title mt-3">Clinical Research Best Practices</div>';
        html += '<div class="result-panel">'
            + '<ul style="margin:0;padding-left:20px;color:var(--text-secondary);font-size:0.9rem;line-height:1.8">'
            + '<li>Use <strong>ordinal logistic regression</strong> for mRS as the primary analysis (preserves statistical power)</li>'
            + '<li>Always test the <strong>proportional odds assumption</strong> when using ordinal logistic regression</li>'
            + '<li>Pre-specify the adjustment set based on a <strong>DAG</strong>, not on statistical significance</li>'
            + '<li>For multicenter studies, account for center effects using <strong>mixed-effects models</strong> or <strong>GEE</strong></li>'
            + '<li>Report both <strong>adjusted and unadjusted</strong> estimates in observational studies</li>'
            + '<li>Include <strong>disease severity</strong> and <strong>age</strong> as minimum adjustment variables</li>'
            + '<li>Consider <strong>treatment-by-subgroup interactions</strong> for key pre-specified subgroups</li>'
            + '<li>Account for <strong>time-varying confounders</strong> (e.g., blood pressure) with marginal structural models or g-estimation</li>'
            + '</ul></div>';

        return html;
    }

    // ===== Assumption Checking Guide =====
    function buildAssumptionContent() {
        var html = '';

        var regressionTypes = [
            {
                name: 'Linear Regression',
                assumptions: [
                    { name: 'Linearity', description: 'The relationship between each predictor and the outcome is linear.', diagnostic: 'Scatter plots of residuals vs. fitted values; partial residual plots (component-plus-residual plots); added variable plots.', remedy: 'Transform variables (log, square root); use restricted cubic splines or fractional polynomials for non-linear terms.' },
                    { name: 'Independence of errors', description: 'Residuals are independent of each other (no autocorrelation).', diagnostic: 'Durbin-Watson test (values near 2 indicate no autocorrelation); residual vs. order plot.', remedy: 'Use GEE or mixed-effects models for clustered/longitudinal data; time-series methods for temporal data.' },
                    { name: 'Homoscedasticity', description: 'Residuals have constant variance across all levels of predicted values.', diagnostic: 'Residual vs. fitted value plot (look for fan/funnel shape); Breusch-Pagan test or White test.', remedy: 'Log-transform the outcome; use weighted least squares (WLS); use robust (sandwich) standard errors.' },
                    { name: 'Normality of residuals', description: 'Residuals follow a normal distribution (important for small samples and CIs).', diagnostic: 'Q-Q (quantile-quantile) plot; histogram of residuals; Shapiro-Wilk test.', remedy: 'Transform the outcome; use robust regression; for large samples, Central Limit Theorem makes this less critical.' },
                    { name: 'No multicollinearity', description: 'Predictors are not highly correlated with each other.', diagnostic: 'VIF (Variance Inflation Factor); correlation matrix; condition indices.', remedy: 'Remove one of the correlated pair; combine into a composite score; use ridge regression or PCA.' },
                    { name: 'No influential outliers', description: 'No single observations unduly influence the regression results.', diagnostic: 'Cook\'s distance (> 4/n is concerning); DFBETAS; leverage plots; studentized residuals (> |3|).', remedy: 'Investigate outliers (data errors?); sensitivity analysis with and without outliers; use robust regression.' }
                ]
            },
            {
                name: 'Logistic Regression',
                assumptions: [
                    { name: 'Binary outcome', description: 'The dependent variable is dichotomous.', diagnostic: 'Check distribution of outcome variable.', remedy: 'Recode outcome if needed; for ordinal outcomes, use ordinal logistic regression.' },
                    { name: 'Linearity of logit', description: 'Continuous predictors have a linear relationship with the log-odds of the outcome.', diagnostic: 'Box-Tidwell test (add X*ln(X) to the model); lowess smoothed logit plot; fractional polynomial analysis.', remedy: 'Transform predictors (log, categories); use restricted cubic splines with 3-5 knots.' },
                    { name: 'No multicollinearity', description: 'Predictors are not highly correlated with each other.', diagnostic: 'VIF from auxiliary OLS regressions; correlation matrix.', remedy: 'Same as linear regression: remove, combine, or use penalized methods.' },
                    { name: 'Independence of observations', description: 'Each observation is independent; no repeated measures or clustering.', diagnostic: 'Study design review; check for clustering structure.', remedy: 'Use GEE, conditional logistic regression, or mixed-effects logistic models.' },
                    { name: 'Adequate sample size', description: 'Sufficient events per variable (EPV >= 10-20).', diagnostic: 'Calculate EPV; Riley criteria for prediction models.', remedy: 'Reduce model complexity; use penalized methods; increase sample size.' },
                    { name: 'No complete separation', description: 'No predictor perfectly predicts the outcome.', diagnostic: 'Model fails to converge; extremely large coefficients/SEs; Hauck-Donner effect.', remedy: 'Use Firth penalized logistic regression; combine categories; remove perfectly-predicting variable.' }
                ]
            },
            {
                name: 'Cox Proportional Hazards',
                assumptions: [
                    { name: 'Proportional hazards', description: 'The hazard ratio between groups is constant over time.', diagnostic: 'Schoenfeld residuals test (scaled, plot vs. time); log(-log(S(t))) plots (parallel curves); interaction with time.', remedy: 'Stratified Cox model (stratify by the non-PH variable); time-varying coefficients; restricted mean survival time (RMST).' },
                    { name: 'Linearity of continuous covariates', description: 'Log-hazard is linearly related to each continuous covariate.', diagnostic: 'Martingale residuals from null model plotted against each covariate; restricted cubic splines.', remedy: 'Transform covariates; use restricted cubic splines; categorize (but avoid arbitrary cutpoints).' },
                    { name: 'No influential observations', description: 'No single observation unduly influences coefficient estimates.', diagnostic: 'Score residuals; dfbeta residuals; deviance residuals; influence plots.', remedy: 'Investigate and report; sensitivity analysis excluding outliers.' },
                    { name: 'Independence of censoring', description: 'Censoring is independent of the outcome (non-informative censoring).', diagnostic: 'Compare characteristics of censored vs. event subjects; sensitivity analyses assuming different censoring mechanisms.', remedy: 'Use IPCW (inverse probability of censoring weights); sensitivity analysis; pattern mixture models.' },
                    { name: 'Correct model specification', description: 'All important covariates are included; no omitted variable bias.', diagnostic: 'Cox-Snell residuals (should follow unit exponential); AIC/BIC comparison.', remedy: 'Include omitted confounders; use causal inference frameworks (DAGs).' }
                ]
            },
            {
                name: 'Poisson Regression',
                assumptions: [
                    { name: 'Count outcome', description: 'The outcome is a count (non-negative integer).', diagnostic: 'Check distribution of outcome variable.', remedy: 'If continuous, use linear regression; if binary, use logistic.' },
                    { name: 'Mean equals variance', description: 'Poisson assumes the conditional mean equals the conditional variance (equidispersion).', diagnostic: 'Deviance/df ratio (should be ~1); Pearson chi-squared/df; Cameron-Trivedi test for overdispersion.', remedy: 'Negative binomial regression (for overdispersion); quasi-Poisson with robust SE; zero-inflated models for excess zeros.' },
                    { name: 'Log-linearity', description: 'The log of the mean is a linear function of the covariates.', diagnostic: 'Residual plots; link test.', remedy: 'Transform covariates; add polynomial or spline terms.' },
                    { name: 'Independence of observations', description: 'Events are independent of each other.', diagnostic: 'Study design review; Durbin-Watson on deviance residuals.', remedy: 'GEE or mixed-effects Poisson for clustered data.' }
                ]
            },
            {
                name: 'Ordinal Logistic Regression',
                assumptions: [
                    { name: 'Proportional odds', description: 'The effect of each predictor is the same across all cumulative cutpoints of the ordinal outcome.', diagnostic: 'Brant test; Score test of the proportional odds assumption; compare coefficients across binary decompositions.', remedy: 'Partial proportional odds model (relax assumption for specific variables); multinomial logistic regression; constrained continuation ratio model.' },
                    { name: 'No multicollinearity', description: 'Predictors are not highly correlated.', diagnostic: 'Same as logistic regression (VIF, correlation matrix).', remedy: 'Same as logistic regression.' },
                    { name: 'Adequate sample size', description: 'Adequate events in each ordinal category.', diagnostic: 'Check cell counts for each outcome level; minimum ~10 events per category per covariate.', remedy: 'Collapse sparse categories; reduce model complexity.' }
                ]
            }
        ];

        html += '<div class="form-group"><label class="form-label">Select Regression Type</label>'
            + '<select class="form-select" id="rh-assumption-type" onchange="RegressionHelper.showAssumptions()">'
            + '<option value="">-- Select --</option>';
        regressionTypes.forEach(function(rt, idx) {
            html += '<option value="' + idx + '">' + rt.name + '</option>';
        });
        html += '</select></div>';

        html += '<div id="rh-assumption-display"></div>';

        // Store data for access from the function
        html += '<script type="application/json" id="rh-assumption-data">' + JSON.stringify(regressionTypes) + '<\/script>';

        return html;
    }

    function showAssumptions() {
        var sel = document.getElementById('rh-assumption-type');
        var display = document.getElementById('rh-assumption-display');
        if (!sel || !display) return;

        var idx = parseInt(sel.value);
        if (isNaN(idx)) {
            App.setTrustedHTML(display, '');
            return;
        }

        var dataEl = document.getElementById('rh-assumption-data');
        var data = JSON.parse(dataEl.textContent);
        var rt = data[idx];

        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">' + rt.name + ' Assumptions</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Assumption</th><th>Description</th><th>Diagnostic</th><th>Remedy</th></tr></thead><tbody>';
        rt.assumptions.forEach(function(a) {
            html += '<tr><td><strong>' + a.name + '</strong></td>'
                + '<td style="font-size:0.85rem">' + a.description + '</td>'
                + '<td style="font-size:0.85rem">' + a.diagnostic + '</td>'
                + '<td style="font-size:0.85rem">' + a.remedy + '</td></tr>';
        });
        html += '</tbody></table></div>';
        html += '</div>';

        App.setTrustedHTML(display, html);
    }

    // ===== Interaction Terms Content =====
    function buildInteractionContent() {
        var html = '';

        html += '<div class="card-title">Interaction Terms: Concept and Interpretation</div>';
        html += '<div class="result-panel mb-2">'
            + '<p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.7;margin:0 0 12px 0">'
            + 'An interaction (effect modification) occurs when the effect of one predictor on the outcome depends on the level of another predictor. '
            + 'In a regression model, this is tested by including a product term: <strong>Y = \u03B2\u2080 + \u03B2\u2081X + \u03B2\u2082Z + \u03B2\u2083(X\u00D7Z)</strong>. '
            + 'The coefficient \u03B2\u2083 represents the change in the effect of X per unit change in Z.</p>'

            + '<div style="margin-top:12px;"><strong style="color:var(--accent);">Additive vs. Multiplicative Interaction:</strong></div>'
            + '<ul style="margin:4px 0 12px 16px;color:var(--text-secondary);font-size:0.9rem;line-height:1.6">'
            + '<li><strong>Multiplicative:</strong> Tested via product term in logistic/Cox regression. Departure from multiplicative joint effect.</li>'
            + '<li><strong>Additive:</strong> Tested via RERI (Relative Excess Risk due to Interaction), AP (Attributable Proportion), and S (Synergy Index). Often more relevant for public health.</li>'
            + '<li>It is possible to have multiplicative but not additive interaction, or vice versa.</li>'
            + '</ul></div>';

        // Interaction Calculator
        html += '<div class="card-title mt-2">Interaction Calculator (Linear Scale)</div>';
        html += '<div class="result-panel mb-2">';
        html += '<p style="color:var(--text-secondary);font-size:0.85rem;margin:0 0 12px 0">'
            + 'Enter coefficients from a regression model with an interaction term to interpret the combined effect.</p>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Coefficient for X (\u03B2\u2081)</label>'
            + '<input type="number" class="form-input" id="rh-int-b1" step="0.01" value="0.50"></div>'
            + '<div class="form-group"><label class="form-label">Coefficient for Z (\u03B2\u2082)</label>'
            + '<input type="number" class="form-input" id="rh-int-b2" step="0.01" value="0.30"></div>'
            + '</div>';
        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Interaction Coefficient (\u03B2\u2083)</label>'
            + '<input type="number" class="form-input" id="rh-int-b3" step="0.01" value="0.20"></div>'
            + '<div class="form-group"><label class="form-label">Model Type</label>'
            + '<select class="form-select" id="rh-int-type">'
            + '<option value="linear">Linear Regression</option>'
            + '<option value="logistic">Logistic Regression (OR)</option>'
            + '<option value="cox">Cox Regression (HR)</option>'
            + '</select></div>'
            + '<div class="form-group" style="display:flex;align-items:flex-end">'
            + '<button class="btn btn-primary" onclick="RegressionHelper.calcInteraction()">Interpret Interaction</button></div>'
            + '</div>';
        html += '<div id="rh-int-result"></div>';
        html += '</div>';

        // RERI Calculator
        html += '<div class="card-title mt-3">RERI (Additive Interaction) Calculator</div>';
        html += '<div class="result-panel mb-2">';
        html += '<p style="color:var(--text-secondary);font-size:0.85rem;margin:0 0 12px 0">'
            + 'Calculate the Relative Excess Risk due to Interaction (RERI) from three odds/risk/hazard ratios obtained from a 2x2 factorial arrangement of two binary exposures. '
            + '<strong>Caveats:</strong> RERI/AP/S computed from odds ratios approximate additive interaction on the risk scale only when the outcome is rare &mdash; with common outcomes, use RRs or convert first (Knol &amp; VanderWeele 2012). The synergy index S is unreliable when either exposure is preventive (ratio &lt; 1); recode so both exposures are risk factors before computing S.</p>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">OR/RR for A alone (vs. neither)</label>'
            + '<input type="number" class="form-input" id="rh-reri-a" step="0.01" value="1.80"></div>'
            + '<div class="form-group"><label class="form-label">OR/RR for B alone (vs. neither)</label>'
            + '<input type="number" class="form-input" id="rh-reri-b" step="0.01" value="2.20"></div>'
            + '<div class="form-group"><label class="form-label">OR/RR for A+B together (vs. neither)</label>'
            + '<input type="number" class="form-input" id="rh-reri-ab" step="0.01" value="5.50"></div>'
            + '</div>';
        html += '<div class="btn-group mt-1">'
            + '<button class="btn btn-primary" onclick="RegressionHelper.calcRERI()">Calculate RERI</button>'
            + '</div>';
        html += '<div id="rh-reri-result"></div>';
        html += '</div>';

        // Interpretation guide table
        html += '<div class="card-title mt-3">Interaction Interpretation Guide</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Scale</th><th>No Interaction</th><th>Synergistic (Super-additive)</th><th>Antagonistic (Sub-additive)</th></tr></thead><tbody>'
            + '<tr><td><strong>Multiplicative</strong></td><td>OR_AB = OR_A x OR_B<br>Interaction term p > 0.05</td><td>OR_AB > OR_A x OR_B<br>Interaction coefficient > 0</td><td>OR_AB < OR_A x OR_B<br>Interaction coefficient < 0</td></tr>'
            + '<tr><td><strong>Additive (RERI)</strong></td><td>RERI = 0</td><td>RERI > 0</td><td>RERI < 0</td></tr>'
            + '<tr><td><strong>Additive (AP)</strong></td><td>AP = 0</td><td>AP > 0</td><td>AP < 0</td></tr>'
            + '<tr><td><strong>Synergy Index (S)</strong></td><td>S = 1</td><td>S > 1</td><td>S < 1</td></tr>'
            + '</tbody></table></div>';

        return html;
    }

    // ===== Sample Size for Regression =====
    function buildRegressionSampleSizeContent() {
        var html = '';

        html += '<div class="card-title">Sample Size Rules for Regression Models</div>';

        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Regression Type</th><th>Minimum Rule</th><th>Modern Recommendation</th><th>Key Reference</th></tr></thead><tbody>'
            + '<tr><td><strong>Linear regression</strong></td><td>N &ge; 10-20 per predictor</td><td>N &ge; 50 + 8k (where k = number of predictors) for testing the overall model; N &ge; 104 + k for testing individual predictors</td><td>Green (1991)</td></tr>'
            + '<tr><td><strong>Logistic regression</strong></td><td>EPV &ge; 10</td><td>EPV &ge; 20 recommended; Riley criteria for prediction models; consider Firth correction for EPV &lt; 10</td><td>Peduzzi et al. (1996); Riley et al. (2020)</td></tr>'
            + '<tr><td><strong>Cox regression</strong></td><td>EPV 5-10 may suffice for adjusted effect estimation (Vittinghoff & McCulloch 2007)</td><td>EPV &ge; 20 or a formal sample-size calculation for prediction models; minimum 100 events for stable HRs</td><td>Concato et al. (1995); Riley et al. (2020)</td></tr>'
            + '<tr><td><strong>Poisson regression</strong></td><td>N &ge; 10 per predictor</td><td>Total events &ge; 10-20 per predictor; ensure adequate person-time in each covariate stratum</td><td>Adapted from logistic regression rules</td></tr>'
            + '<tr><td><strong>Ordinal logistic</strong></td><td>N &ge; 10 per predictor per outcome level</td><td>Use Harrell\'s effective sample size n &minus; (1/n&sup2;)&Sigma;n&#7522;&sup3; (n&#7522; = category counts); EPV &ge; 10-20 on that basis</td><td>Harrell, Regression Modeling Strategies</td></tr>'
            + '<tr><td><strong>Mixed-effects models</strong></td><td>N &ge; 30 clusters; n &ge; 5 per cluster</td><td>50+ clusters preferred for reliable random effects; level-2 variance requires adequate clusters, not observations</td><td>Maas & Hox (2005)</td></tr>'
            + '</tbody></table></div>';

        // Interactive calculator
        html += '<div class="card-title mt-3">Regression Sample Size Calculator</div>';
        html += '<div class="result-panel">';
        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Regression Type</label>'
            + '<select class="form-select" id="rh-ss-type">'
            + '<option value="linear">Linear Regression</option>'
            + '<option value="logistic">Logistic Regression</option>'
            + '<option value="cox">Cox Proportional Hazards</option>'
            + '</select></div>'
            + '<div class="form-group"><label class="form-label">Number of Candidate Predictors (k)</label>'
            + '<input type="number" class="form-input" id="rh-ss-k" step="1" min="1" value="8"></div>'
            + '</div>';
        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Event Rate (for logistic/Cox, proportion 0-1) ' + App.tooltip('For logistic: prevalence of outcome. For Cox: proportion experiencing event.') + '</label>'
            + '<input type="number" class="form-input" id="rh-ss-rate" step="0.01" min="0.01" max="0.99" value="0.20"></div>'
            + '<div class="form-group"><label class="form-label">Target EPV (for logistic/Cox)</label>'
            + '<select class="form-select" id="rh-ss-epv">'
            + '<option value="10">10 (traditional minimum)</option>'
            + '<option value="15">15 (moderate)</option>'
            + '<option value="20" selected>20 (recommended)</option>'
            + '<option value="50">50 (complex models)</option>'
            + '</select></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="RegressionHelper.calcRegSS()">Calculate Sample Size</button>'
            + '</div>';
        html += '<div id="rh-ss-result"></div>';
        html += '</div>';

        // Riley criteria
        html += '<div class="card-title mt-3">Riley Criteria for Prediction Models (2020)</div>';
        html += '<div class="result-panel">';
        html += '<p style="color:var(--text-secondary);font-size:0.9rem;line-height:1.7;margin:0 0 12px 0">'
            + 'Riley et al. (BMJ 2020;368:m441) define minimum sample-size criteria for multivariable prediction model development (as implemented in <code>pmsampsize</code>). '
            + 'For binary and survival outcomes the required sample size is the <strong>maximum</strong> across these criteria:</p>';

        html += '<ol style="margin:0 0 12px 20px;color:var(--text-secondary);font-size:0.9rem;line-height:1.8">'
            + '<li><strong>Criterion 1 (coefficient shrinkage):</strong> Expected uniform shrinkage of predictor effects &ge; 0.9 (i.e., &le; 10% overfitting of the linear predictor)</li>'
            + '<li><strong>Criterion 2 (overall fit optimism):</strong> Small absolute difference (&le; 0.05) between apparent and optimism-adjusted Nagelkerke R-squared</li>'
            + '<li><strong>Criterion 3 (baseline risk):</strong> Precise estimation of the overall outcome proportion (margin of error &le; 0.05)</li>'
            + '</ol>';
        html += '<p style="color:var(--text-secondary);font-size:0.85rem;line-height:1.6;margin:0 0 12px 0">'
            + 'For continuous outcomes a fourth criterion applies: precise estimation of the residual standard deviation and mean outcome value.</p>';
        html += '<p style="color:var(--text-secondary);font-size:0.85rem;line-height:1.6;margin:0">'
            + 'Use the R package <code style="background:var(--surface);padding:2px 6px;border-radius:4px;">pmsampsize</code> to calculate Riley criteria-based sample sizes.</p>';
        html += '</div>';

        return html;
    }

    // ===== Tab switching =====
    function switchTab(tabId) {
        document.querySelectorAll('#rh-tabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tabId); });
        document.querySelectorAll('.tab-content').forEach(function(tc) {
            var tcId = tc.id.replace('tab-', '');
            tc.classList.toggle('active', tcId === tabId);
        });
    }

    // ===== Regression Wizard =====
    function recommend() {
        var outcomeType = document.getElementById('rh-outcome-type').value;
        var clustering = document.getElementById('rh-clustering').value;
        var repeated = document.getElementById('rh-repeated').value;

        if (!outcomeType) {
            Export.showToast('Please select an outcome type', 'error');
            return;
        }

        // Build lookup key
        var typeMap = { binary: 'binary', continuous: 'continuous', count: 'count', time: 'time', ordinal: 'ordinal' };
        var suffix = '_independent';
        if (clustering === 'yes' || repeated === 'yes') suffix = '_clustered';
        if (repeated === 'yes') suffix = '_repeated';

        var key = typeMap[outcomeType] + suffix;
        var model = References.regressionModels[key];

        // Fallback: if exact key not found, try independent
        if (!model) {
            key = typeMap[outcomeType] + '_independent';
            model = References.regressionModels[key];
        }

        if (!model) {
            Export.showToast('No model recommendation found for this combination', 'error');
            return;
        }

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value">' + model.model + '</div>';
        html += '<div class="result-label">Recommended Regression Model</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item" style="grid-column:span 2"><div class="result-item-label">Formula</div>'
            + '<div style="font-family:var(--font-mono);font-size:0.95rem;color:var(--accent);margin-top:4px">' + model.formula + '</div></div>'
            + '</div>';

        html += '<div class="mt-2"><strong style="color:var(--text-secondary);font-size:0.85rem">Key Assumptions:</strong>'
            + '<p style="color:var(--text-secondary);font-size:0.85rem;margin:4px 0">' + model.assumptions + '</p></div>';

        html += '<div class="mt-1"><strong style="color:var(--accent);font-size:0.85rem">Domain-Specific Notes:</strong>'
            + '<p style="color:var(--text-secondary);font-size:0.85rem;margin:4px 0">' + model.notes + '</p></div>';

        // Additional contextual guidance
        if (outcomeType === 'binary') {
            html += '<div class="mt-2" style="border-top:1px solid var(--border);padding-top:12px">'
                + '<strong style="color:var(--text-secondary);font-size:0.85rem">Additional Guidance for Binary Outcomes:</strong>'
                + '<ul style="margin:4px 0;padding-left:16px;color:var(--text-secondary);font-size:0.85rem;line-height:1.6">'
                + '<li>Report odds ratios with 95% CIs and p-values</li>'
                + '<li>If baseline risk is high (>10%), OR overestimates RR. Consider log-binomial or modified Poisson for RR estimation.</li>'
                + '<li>For rare outcomes (prevalence &lt;5%), OR approximates RR well</li>'
                + '<li>Check calibration (Hosmer-Lemeshow) and discrimination (C-statistic)</li>'
                + '</ul></div>';
        }

        if (outcomeType === 'ordinal') {
            html += '<div class="mt-2" style="border-top:1px solid var(--border);padding-top:12px">'
                + '<strong style="color:var(--accent);font-size:0.85rem">mRS Shift Analysis (Preferred for Stroke Trials):</strong>'
                + '<ul style="margin:4px 0;padding-left:16px;color:var(--text-secondary);font-size:0.85rem;line-height:1.6">'
                + '<li>Report the <strong>common OR</strong> (aka shift OR or adjusted common OR)</li>'
                + '<li>Always test proportional odds assumption (Brant test or Score test)</li>'
                + '<li>If PO violated, consider partial proportional odds or dichotomized analyses as sensitivity</li>'
                + '<li>Visualize with a stacked mRS distribution bar chart (butterfly plot)</li>'
                + '</ul></div>';
        }

        if (outcomeType === 'time') {
            html += '<div class="mt-2" style="border-top:1px solid var(--border);padding-top:12px">'
                + '<strong style="color:var(--text-secondary);font-size:0.85rem">Time-to-Event Guidance:</strong>'
                + '<ul style="margin:4px 0;padding-left:16px;color:var(--text-secondary);font-size:0.85rem;line-height:1.6">'
                + '<li>Report hazard ratios with 95% CIs</li>'
                + '<li>Check PH assumption with Schoenfeld residuals and log(-log(S(t))) plots</li>'
                + '<li>If PH violated: consider restricted mean survival time (RMST), time-dependent coefficients, or stratified Cox</li>'
                + '<li>For competing risks (e.g., death preventing outcome occurrence), use Fine-Gray subdistribution hazard or cause-specific hazards</li>'
                + '</ul></div>';
        }

        html += '<div class="mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="RegressionHelper.copyRecommendation()">Copy Recommendation</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rh-wizard-results'), html);
        Export.addToHistory(MODULE_ID, { outcome: outcomeType, clustering: clustering, repeated: repeated }, model.model);
    }

    function copyRecommendation() {
        var outcomeType = document.getElementById('rh-outcome-type').value;
        var clustering = document.getElementById('rh-clustering').value;
        var repeated = document.getElementById('rh-repeated').value;
        var typeMap = { binary: 'binary', continuous: 'continuous', count: 'count', time: 'time', ordinal: 'ordinal' };
        var suffix = '_independent';
        if (clustering === 'yes' || repeated === 'yes') suffix = '_clustered';
        if (repeated === 'yes') suffix = '_repeated';
        var key = typeMap[outcomeType] + suffix;
        var model = References.regressionModels[key] || References.regressionModels[typeMap[outcomeType] + '_independent'];
        if (model) {
            Export.copyText('Recommended model: ' + model.model + '\nFormula: ' + model.formula + '\nAssumptions: ' + model.assumptions + '\nNotes: ' + model.notes);
        }
    }

    // ===== EPV Calculator =====
    function calculateEPV() {
        var events = parseInt(document.getElementById('rh-events').value);
        var covariates = parseInt(document.getElementById('rh-covariates').value);

        if (isNaN(events) || isNaN(covariates) || events <= 0 || covariates <= 0) {
            Export.showToast('Please enter valid positive numbers', 'error');
            return;
        }

        var epv = events / covariates;
        var color, level, advice;

        if (epv < 5) {
            color = 'var(--danger)';
            level = 'Severely Inadequate';
            advice = 'Your model is severely underpowered. Coefficient estimates will be unreliable and overfitting is very likely. Reduce the number of covariates to at most ' + Math.floor(events / 10) + ' (for EPV >= 10) or increase your sample size.';
        } else if (epv < 10) {
            color = 'var(--danger)';
            level = 'Inadequate';
            advice = 'Below the traditional minimum of 10 EPV. Estimates may be biased and confidence intervals inaccurate. Consider reducing covariates to ' + Math.floor(events / 10) + ' or fewer.';
        } else if (epv < 20) {
            color = 'var(--warning)';
            level = 'Marginal';
            advice = 'Meets the traditional minimum (EPV >= 10) but modern guidance suggests EPV >= 20 for reliable estimates. Adequate for simple main-effects models.';
        } else if (epv < 50) {
            color = 'var(--success)';
            level = 'Adequate';
            advice = 'Good sample size relative to model complexity. Reliable for most regression models including some interactions.';
        } else {
            color = 'var(--success)';
            level = 'Excellent';
            advice = 'Excellent EPV. Supports complex models with interactions, nonlinear terms, and subgroup analyses.';
        }

        var maxCovariatesAt10 = Math.floor(events / 10);
        var maxCovariatesAt20 = Math.floor(events / 20);
        var eventsNeededFor10 = covariates * 10;
        var eventsNeededFor20 = covariates * 20;

        var html = '<div class="result-panel animate-in">';
        html += '<div class="result-value" style="color:' + color + '">' + epv.toFixed(1) + ' EPV</div>';
        html += '<div class="result-label">' + level + '</div>';
        html += '<div class="result-detail" style="margin-top:8px">' + advice + '</div>';

        html += '<div class="result-grid mt-2">'
            + '<div class="result-item"><div class="result-item-value">' + events + '</div><div class="result-item-label">Events</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + covariates + '</div><div class="result-item-label">Covariates</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + maxCovariatesAt10 + '</div><div class="result-item-label">Max Covariates (EPV=10)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + maxCovariatesAt20 + '</div><div class="result-item-label">Max Covariates (EPV=20)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + eventsNeededFor10 + '</div><div class="result-item-label">Events Needed (EPV=10)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + eventsNeededFor20 + '</div><div class="result-item-label">Events Needed (EPV=20)</div></div>'
            + '</div>';

        // Sensitivity table
        html += '<div class="card-title mt-3">EPV by Number of Covariates</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Covariates</th><th>EPV</th><th>Adequacy</th></tr></thead><tbody>';
        var covList = [3, 5, 8, 10, 12, 15, 20, 25, 30];
        covList.forEach(function(c) {
            var e = events / c;
            var clr = e < 10 ? 'var(--danger)' : e < 20 ? 'var(--warning)' : 'var(--success)';
            var isCurrent = c === covariates;
            html += '<tr' + (isCurrent ? ' style="background:var(--accent-muted)"' : '') + '>'
                + '<td class="num">' + c + '</td>'
                + '<td class="num" style="color:' + clr + '">' + e.toFixed(1) + '</td>'
                + '<td>' + (e < 10 ? 'Inadequate' : e < 20 ? 'Marginal' : 'Adequate') + '</td></tr>';
        });
        html += '</tbody></table></div>';

        html += '<div class="mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'EPV = ' + epv.toFixed(1) + ' (' + events + ' events, ' + covariates + ' covariates). ' + level + '.\')">Copy Result</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rh-epv-results'), html);
        Export.addToHistory(MODULE_ID, { events: events, covariates: covariates }, 'EPV = ' + epv.toFixed(1));
    }

    // ===== DAG Builder =====
    function addNode() {
        var nameEl = document.getElementById('rh-node-name');
        var typeEl = document.getElementById('rh-node-type');
        var name = nameEl.value.trim();
        var type = typeEl.value;

        if (!name) {
            Export.showToast('Please enter a variable name', 'error');
            return;
        }

        // Check duplicate
        if (dagNodes.some(function(n) { return n.label === name; })) {
            Export.showToast('Variable already exists', 'error');
            return;
        }

        nodeIdCounter++;
        var nodeId = 'n' + nodeIdCounter;

        // Auto-position nodes
        var typePositions = { exposure: { x: 100, baseY: 200 }, outcome: { x: 600, baseY: 200 }, confounder: { x: 350, baseY: 60 }, mediator: { x: 350, baseY: 300 }, collider: { x: 350, baseY: 380 } };
        var pos = typePositions[type] || { x: 350, baseY: 200 };
        var sameTypeCount = dagNodes.filter(function(n) { return n.type === type; }).length;
        var x = pos.x + sameTypeCount * 120;
        var y = pos.baseY + sameTypeCount * 40;

        // Keep within canvas
        if (x > 650) x = pos.x;
        if (y > 370) y = pos.baseY;

        dagNodes.push({ id: nodeId, label: name, type: type, x: x, y: y });
        nameEl.value = '';

        updateEdgeDropdowns();
        renderDAG();
    }

    function addEdge() {
        var from = document.getElementById('rh-edge-from').value;
        var to = document.getElementById('rh-edge-to').value;

        if (!from || !to) {
            Export.showToast('Please select both From and To nodes', 'error');
            return;
        }

        if (from === to) {
            Export.showToast('Cannot create self-loop', 'error');
            return;
        }

        // Check duplicate
        if (dagEdges.some(function(e) { return e.from === from && e.to === to; })) {
            Export.showToast('Edge already exists', 'error');
            return;
        }

        dagEdges.push({ from: from, to: to });
        renderDAG();
    }

    function updateEdgeDropdowns() {
        var fromEl = document.getElementById('rh-edge-from');
        var toEl = document.getElementById('rh-edge-to');
        if (!fromEl || !toEl) return;

        var opts = '<option value="">-- Select --</option>';
        dagNodes.forEach(function(n) {
            opts += '<option value="' + n.id + '">' + n.label + ' (' + n.type + ')</option>';
        });
        App.setTrustedHTML(fromEl, opts);
        App.setTrustedHTML(toEl, opts);
    }

    function renderDAG() {
        var canvas = document.getElementById('rh-dag-canvas');
        if (!canvas || dagNodes.length === 0) return;

        Charts.DAGDiagram(canvas, {
            nodes: dagNodes,
            edges: dagEdges,
            width: 700,
            height: 400
        });

        // Build info panel
        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">DAG Summary</div>';

        // Variables by type
        var types = ['exposure', 'outcome', 'confounder', 'mediator', 'collider'];
        types.forEach(function(type) {
            var vars = dagNodes.filter(function(n) { return n.type === type; });
            if (vars.length > 0) {
                var typeColors = { exposure: 'var(--accent)', outcome: 'var(--success)', confounder: 'var(--warning)', mediator: 'var(--info)', collider: 'var(--danger)' };
                html += '<div style="margin:4px 0"><strong style="color:' + typeColors[type] + ';text-transform:capitalize;font-size:0.85rem">' + type + ':</strong> '
                    + '<span style="color:var(--text-secondary);font-size:0.85rem">' + vars.map(function(v) { return v.label; }).join(', ') + '</span></div>';
            }
        });

        // Edges
        if (dagEdges.length > 0) {
            html += '<div style="margin:8px 0"><strong style="color:var(--text-secondary);font-size:0.85rem">Causal Paths:</strong></div>';
            html += '<ul style="margin:0;padding-left:16px;color:var(--text-secondary);font-size:0.85rem">';
            dagEdges.forEach(function(e) {
                var fromNode = dagNodes.find(function(n) { return n.id === e.from; });
                var toNode = dagNodes.find(function(n) { return n.id === e.to; });
                if (fromNode && toNode) {
                    html += '<li>' + fromNode.label + ' &rarr; ' + toNode.label + '</li>';
                }
            });
            html += '</ul>';
        }

        // Adjustment set recommendation
        var confounders = dagNodes.filter(function(n) { return n.type === 'confounder'; });
        var mediators = dagNodes.filter(function(n) { return n.type === 'mediator'; });
        var colliders = dagNodes.filter(function(n) { return n.type === 'collider'; });

        html += '<div class="card-title mt-2">Adjustment Set Recommendation</div>';
        if (confounders.length > 0) {
            html += '<div style="margin:4px 0;color:var(--success);font-size:0.85rem"><strong>Adjust for (confounders):</strong> '
                + confounders.map(function(c) { return c.label; }).join(', ') + '</div>';
        } else {
            html += '<div style="margin:4px 0;color:var(--text-tertiary);font-size:0.85rem">No confounders identified. Add confounders to build the adjustment set.</div>';
        }

        if (mediators.length > 0) {
            html += '<div style="margin:4px 0;color:var(--warning);font-size:0.85rem"><strong>Do NOT adjust for (mediators):</strong> '
                + mediators.map(function(m) { return m.label; }).join(', ')
                + '<br><span style="color:var(--text-tertiary)">Adjusting for mediators blocks part of the causal effect and biases the total effect estimate.</span></div>';
        }

        if (colliders.length > 0) {
            html += '<div style="margin:4px 0;color:var(--danger);font-size:0.85rem"><strong>Do NOT adjust for (colliders):</strong> '
                + colliders.map(function(c) { return c.label; }).join(', ')
                + '<br><span style="color:var(--text-tertiary)">Adjusting for colliders opens a biasing pathway (collider bias).</span></div>';
        }

        html += '</div>';

        App.setTrustedHTML(document.getElementById('rh-dag-info'), html);
    }

    function clearDAG() {
        dagNodes = [];
        dagEdges = [];
        nodeIdCounter = 0;
        updateEdgeDropdowns();
        var canvas = document.getElementById('rh-dag-canvas');
        if (canvas) {
            var ctx = canvas.getContext('2d');
            var dpr = window.devicePixelRatio || 1;
            ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        }
        App.setTrustedHTML(document.getElementById('rh-dag-info'), '');
    }

    function loadExampleDAG() {
        dagNodes = [
            { id: 'n1', label: 'EVT Treatment', type: 'exposure', x: 100, y: 200 },
            { id: 'n2', label: 'mRS at 90 days', type: 'outcome', x: 600, y: 200 },
            { id: 'n3', label: 'Age', type: 'confounder', x: 250, y: 60 },
            { id: 'n4', label: 'NIHSS', type: 'confounder', x: 450, y: 60 },
            { id: 'n5', label: 'Reperfusion', type: 'mediator', x: 350, y: 300 },
            { id: 'n6', label: 'Inpatient stay', type: 'collider', x: 350, y: 380 }
        ];
        dagEdges = [
            { from: 'n1', to: 'n2' },
            { from: 'n3', to: 'n1' },
            { from: 'n3', to: 'n2' },
            { from: 'n4', to: 'n1' },
            { from: 'n4', to: 'n2' },
            { from: 'n1', to: 'n5' },
            { from: 'n5', to: 'n2' },
            { from: 'n1', to: 'n6' },
            { from: 'n2', to: 'n6' }
        ];
        nodeIdCounter = 6;
        updateEdgeDropdowns();
        renderDAG();
    }

    // ===== OR Calculator =====
    function calcOR() {
        var beta = parseFloat(document.getElementById('rh-or-beta').value);
        var unit = parseFloat(document.getElementById('rh-or-unit').value) || 1;
        if (isNaN(beta)) { Export.showToast('Enter a valid coefficient', 'error'); return; }

        var or_val = Math.exp(beta * unit);

        var interp = '';
        if (or_val > 1) {
            interp = 'For each ' + unit + '-unit increase in the predictor, the odds of the outcome increase by ' + ((or_val - 1) * 100).toFixed(1) + '%.';
        } else if (or_val < 1) {
            interp = 'For each ' + unit + '-unit increase in the predictor, the odds of the outcome decrease by ' + ((1 - or_val) * 100).toFixed(1) + '%.';
        } else {
            interp = 'OR = 1.0: No association between the predictor and the outcome.';
        }

        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="result-value">' + or_val.toFixed(3) + '</div>';
        html += '<div class="result-label">Odds Ratio (OR = exp(' + beta + ' x ' + unit + '))</div>';
        html += '<div class="result-detail" style="margin-top:8px">' + interp + '</div>';
        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.regressionHelper({beta:' + beta + ',unit:' + unit + ',or:' + or_val.toFixed(4) + '}), \'Regression — OR Interpretation\')">'
            + '&#129513; Generate R Script</button></div>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('rh-or-result'), html);
    }

    // ===== Interaction Calculator =====
    function calcInteraction() {
        var b1 = parseFloat(document.getElementById('rh-int-b1').value);
        var b2 = parseFloat(document.getElementById('rh-int-b2').value);
        var b3 = parseFloat(document.getElementById('rh-int-b3').value);
        var modelType = document.getElementById('rh-int-type').value;

        if (isNaN(b1) || isNaN(b2) || isNaN(b3)) { Export.showToast('Enter valid coefficients', 'error'); return; }

        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">Interaction Interpretation</div>';

        if (modelType === 'linear') {
            html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Scenario</th><th>Combined Effect on Y</th></tr></thead><tbody>'
                + '<tr><td>X=1, Z=0</td><td>\u0394Y = ' + b1.toFixed(3) + '</td></tr>'
                + '<tr><td>X=0, Z=1</td><td>\u0394Y = ' + b2.toFixed(3) + '</td></tr>'
                + '<tr><td>X=1, Z=1</td><td>\u0394Y = ' + (b1 + b2 + b3).toFixed(3) + ' (\u03B2\u2081 + \u03B2\u2082 + \u03B2\u2083)</td></tr>'
                + '</tbody></table></div>';
            html += '<div class="result-detail mt-1">The interaction term (\u03B2\u2083 = ' + b3.toFixed(3) + ') means the effect of X changes by ' + b3.toFixed(3) + ' units for each unit increase in Z.</div>';
        } else {
            var or_x = Math.exp(b1);
            var or_z = Math.exp(b2);
            var or_int = Math.exp(b3);
            var or_xz = Math.exp(b1 + b2 + b3);
            var label = modelType === 'logistic' ? 'OR' : 'HR';

            html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Scenario</th><th>' + label + '</th></tr></thead><tbody>'
                + '<tr><td>X=1, Z=0 (vs X=0, Z=0)</td><td>' + label + ' = ' + or_x.toFixed(3) + '</td></tr>'
                + '<tr><td>X=0, Z=1 (vs X=0, Z=0)</td><td>' + label + ' = ' + or_z.toFixed(3) + '</td></tr>'
                + '<tr><td>X=1, Z=1 (vs X=0, Z=0)</td><td>' + label + ' = ' + or_xz.toFixed(3) + '</td></tr>'
                + '<tr><td>Interaction ' + label + '</td><td>' + or_int.toFixed(3) + '</td></tr>'
                + '</tbody></table></div>';

            var multExpected = or_x * or_z;
            html += '<div class="result-detail mt-1">'
                + 'Without interaction, expected joint ' + label + ' = ' + or_x.toFixed(3) + ' x ' + or_z.toFixed(3) + ' = ' + multExpected.toFixed(3) + '. '
                + 'Observed joint ' + label + ' = ' + or_xz.toFixed(3) + '. ';
            if (or_int > 1) {
                html += 'The interaction is <strong>synergistic</strong> (super-multiplicative): the combined effect exceeds the product of individual effects.';
            } else if (or_int < 1) {
                html += 'The interaction is <strong>antagonistic</strong> (sub-multiplicative): the combined effect is less than the product of individual effects.';
            } else {
                html += 'No multiplicative interaction (interaction ' + label + ' = 1.0).';
            }
            html += '</div>';
        }

        html += '</div>';
        App.setTrustedHTML(document.getElementById('rh-int-result'), html);
    }

    // ===== RERI Calculator =====
    function calcRERI() {
        var orA = parseFloat(document.getElementById('rh-reri-a').value);
        var orB = parseFloat(document.getElementById('rh-reri-b').value);
        var orAB = parseFloat(document.getElementById('rh-reri-ab').value);

        const isInvalidOrA = isNaN(orA) || orA <= 0;
        const isInvalidOrB = isNaN(orB) || orB <= 0;
        const isInvalidOrAB = isNaN(orAB) || orAB <= 0;

        if (isInvalidOrA || isInvalidOrB || isInvalidOrAB) {
            Export.showToast('Enter valid positive OR/RR values', 'error');
            return;
        }

        var reri = orAB - orA - orB + 1;
        var ap = reri / orAB;
        var si = (orAB - 1) / ((orA - 1) + (orB - 1));

        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">Additive Interaction Measures</div>';
        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value" style="color:' + (reri > 0 ? 'var(--danger)' : reri < 0 ? 'var(--success)' : 'var(--text)') + '">' + reri.toFixed(3) + '</div><div class="result-item-label">RERI</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (ap * 100).toFixed(1) + '%</div><div class="result-item-label">Attributable Proportion (AP)</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + (isFinite(si) ? si.toFixed(3) : 'N/A') + '</div><div class="result-item-label">Synergy Index (S)</div></div>'
            + '</div>';

        html += '<div class="result-detail mt-1">';
        if (reri > 0) {
            html += '<strong style="color:var(--danger)">Positive additive interaction (synergism):</strong> The joint effect of both exposures exceeds what would be expected from the sum of individual effects. '
                + (ap * 100).toFixed(1) + '% of the risk among doubly-exposed is attributable to the interaction.';
        } else if (reri < 0) {
            html += '<strong style="color:var(--success)">Negative additive interaction (antagonism):</strong> The joint effect is less than what would be expected from the sum of individual effects.';
        } else {
            html += 'RERI = 0: No additive interaction. The joint effect equals the sum of individual effects.';
        }
        html += '</div>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('rh-reri-result'), html);
    }

    // ===== Regression Sample Size Calculator =====
    function calcRegSS() {
        var type = document.getElementById('rh-ss-type').value;
        var k = parseInt(document.getElementById('rh-ss-k').value);
        var rate = parseFloat(document.getElementById('rh-ss-rate').value);
        var epvTarget = parseInt(document.getElementById('rh-ss-epv').value);

        if (isNaN(k) || k <= 0) { Export.showToast('Enter a valid number of predictors', 'error'); return; }

        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">Sample Size Requirements</div>';

        if (type === 'linear') {
            var n_overall = 50 + 8 * k;
            var n_individual = 104 + k;
            var n_recommended = Math.max(n_overall, n_individual);

            html += '<div class="result-grid">'
                + '<div class="result-item"><div class="result-item-value">' + n_overall + '</div><div class="result-item-label">For overall model test (50 + 8k)</div></div>'
                + '<div class="result-item"><div class="result-item-value">' + n_individual + '</div><div class="result-item-label">For individual predictors (104 + k)</div></div>'
                + '<div class="result-item"><div class="result-item-value" style="color:var(--accent)">' + n_recommended + '</div><div class="result-item-label">Recommended N (max of both)</div></div>'
                + '</div>';
            html += '<div class="result-detail mt-1">Based on Green (1991) rules for linear regression with ' + k + ' predictors. '
                + 'Assumes medium effect size (f-squared = 0.15), alpha = 0.05, power = 0.80.</div>';
        } else {
            if (isNaN(rate) || rate <= 0 || rate >= 1) { Export.showToast('Enter a valid event rate (0-1)', 'error'); return; }

            var events_needed = epvTarget * k;
            var n_needed = Math.ceil(events_needed / rate);
            var n_non_events = n_needed - events_needed;

            html += '<div class="result-grid">'
                + '<div class="result-item"><div class="result-item-value">' + events_needed + '</div><div class="result-item-label">Events Needed (EPV=' + epvTarget + ' x ' + k + ')</div></div>'
                + '<div class="result-item"><div class="result-item-value" style="color:var(--accent)">' + n_needed + '</div><div class="result-item-label">Total N Required</div></div>'
                + '<div class="result-item"><div class="result-item-value">' + n_non_events + '</div><div class="result-item-label">Non-events</div></div>'
                + '</div>';
            html += '<div class="result-detail mt-1">With ' + k + ' predictors, event rate = ' + (rate * 100).toFixed(0)
                + '%, and target EPV = ' + epvTarget + ', you need at least ' + events_needed + ' events, requiring a total sample of '
                + n_needed + ' subjects.</div>';

            // Sensitivity table
            html += '<div class="card-title mt-2">Sensitivity Analysis</div>';
            html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Event Rate</th><th>Events Needed</th><th>Total N</th></tr></thead><tbody>';
            var rates = [0.05, 0.10, 0.15, 0.20, 0.30, 0.40, 0.50];
            rates.forEach(function(r) {
                var ev = epvTarget * k;
                var nTot = Math.ceil(ev / r);
                var isCurrent = Math.abs(r - rate) < 0.001;
                html += '<tr' + (isCurrent ? ' style="background:var(--accent-muted)"' : '') + '>'
                    + '<td class="num">' + (r * 100).toFixed(0) + '%</td>'
                    + '<td class="num">' + ev + '</td>'
                    + '<td class="num">' + nTot + '</td></tr>';
            });
            html += '</tbody></table></div>';
        }

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.regressionHelper({type:&quot;' + type + '&quot;,k:' + k + ',rate:' + (rate || 0) + ',epv:' + (epvTarget || 10) + '}), &quot;Regression — Sample Size&quot;)">'
            + '&#129513; Generate R Script</button></div>';
        html += '</div>';
        App.setTrustedHTML(document.getElementById('rh-ss-result'), html);
    }

    // Register module
    App.registerModule(MODULE_ID, {
        render: render,
        onThemeChange: function() {
            if (dagNodes.length > 0) renderDAG();
        }
    });

    // Expose functions globally for onclick handlers
    window.RegressionHelper = {
        switchTab: switchTab,
        recommend: recommend,
        copyRecommendation: copyRecommendation,
        calculateEPV: calculateEPV,
        addNode: addNode,
        addEdge: addEdge,
        clearDAG: clearDAG,
        loadExampleDAG: loadExampleDAG,
        calcOR: calcOR,
        showAssumptions: showAssumptions,
        calcInteraction: calcInteraction,
        calcRERI: calcRERI,
        calcRegSS: calcRegSS
    };
})();
