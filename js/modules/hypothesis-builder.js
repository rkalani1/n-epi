/**
 * Neuro-Epi — Hypothesis Builder Module
 * Features: PICO/PECO Builder, Study Design Decision Tree, Variable Classification Tool,
 *           PICO/PICOT Framework Builder, Hypothesis Type Selector, Research Question Generator,
 *           Specific Aims Template, Hypothesis Refinement Checklist
 */

(function() {
    'use strict';

    const MODULE_ID = 'hypothesis-builder';

    // Variable classification state
    var classifiedVars = [];
    var varIdCounter = 0;

    function render(container) {
        var html = App.createModuleLayout(
            'Hypothesis Builder',
            'Formulate structured research questions, select optimal study designs, classify variables, build PICOT frameworks, and generate specific aims for grant applications.'
        );

        html += '<div class="card">';
        html += '<div class="tabs" id="hb-tabs">'
            + '<button class="tab active" data-tab="pico" onclick="HypothesisBuilder.switchTab(\'pico\')">PICO/PECO Builder</button>'
            + '<button class="tab" data-tab="picot" onclick="HypothesisBuilder.switchTab(\'picot\')">PICOT Framework</button>'
            + '<button class="tab" data-tab="hyptype" onclick="HypothesisBuilder.switchTab(\'hyptype\')">Hypothesis Types</button>'
            + '<button class="tab" data-tab="resgen" onclick="HypothesisBuilder.switchTab(\'resgen\')">Question Generator</button>'
            + '<button class="tab" data-tab="design" onclick="HypothesisBuilder.switchTab(\'design\')">Study Design Tree</button>'
            + '<button class="tab" data-tab="variables" onclick="HypothesisBuilder.switchTab(\'variables\')">Variable Classification</button>'
            + '<button class="tab" data-tab="aims" onclick="HypothesisBuilder.switchTab(\'aims\')">Specific Aims</button>'
            + '<button class="tab" data-tab="checklist" onclick="HypothesisBuilder.switchTab(\'checklist\')">Refinement Checklist</button>'
            + '</div>';

        // ===== TAB A: PICO/PECO Builder =====
        html += '<div class="tab-content active" id="tab-pico">';
        html += '<div class="card-subtitle">Build a structured research question using the PICO (intervention) or PECO (exposure) framework. Generates formatted hypothesis statements and suggests study designs.</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Framework</label>'
            + '<select class="form-select" id="hb-framework" onchange="HypothesisBuilder.updateFramework()">'
            + '<option value="pico">PICO (Intervention study)</option>'
            + '<option value="peco">PECO (Exposure/observational study)</option>'
            + '</select></div>'
            + '<div class="form-group"><label class="form-label">Clinical Domain</label>'
            + '<select class="form-select" id="hb-domain">'
            + '<option value="acute_stroke">Acute Ischemic Stroke</option>'
            + '<option value="ich">Intracerebral Hemorrhage</option>'
            + '<option value="secondary_prevention">Secondary Prevention</option>'
            + '<option value="rehabilitation">Stroke Rehabilitation</option>'
            + '<option value="neurovascular">Neurovascular (Carotid / Aneurysm)</option>'
            + '<option value="cardiology">Cardiology</option>'
            + '<option value="oncology">Oncology</option>'
            + '<option value="infectious_disease">Infectious Disease</option>'
            + '<option value="critical_care">Critical Care / ICU</option>'
            + '<option value="surgery">Surgery</option>'
            + '<option value="psychiatry">Psychiatry</option>'
            + '<option value="primary_care">Primary Care / Family Medicine</option>'
            + '<option value="other">Other</option>'
            + '</select></div>'
            + '</div>';

        html += '<div class="form-group"><label class="form-label">P - Population ' + App.tooltip('Who are the patients? Include age, sex, condition, setting.') + '</label>'
            + '<input type="text" class="form-input" id="hb-population" name="hb_population" placeholder="e.g., Adults with [condition] presenting within [timeframe] of [event]"></div>';

        html += '<div class="form-group"><label class="form-label" id="hb-ie-label">I - Intervention</label>'
            + '<input type="text" class="form-input" id="hb-intervention" name="hb_intervention" placeholder="e.g., [Intervention] plus standard of care"></div>';

        html += '<div class="form-group"><label class="form-label">C - Comparison ' + App.tooltip('What is the control or reference group?') + '</label>'
            + '<input type="text" class="form-input" id="hb-comparison" name="hb_comparison" placeholder="e.g., Medical therapy alone (standard of care)"></div>';

        html += '<div class="form-group"><label class="form-label">O - Outcome ' + App.tooltip('What is the primary outcome being measured?') + '</label>'
            + '<input type="text" class="form-input" id="hb-outcome" name="hb_outcome" placeholder="e.g., Functional independence (mRS 0-2) at 90 days"></div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Outcome Type</label>'
            + '<select class="form-select" id="hb-outcome-type">'
            + '<option value="binary">Binary (yes/no)</option>'
            + '<option value="continuous">Continuous (score)</option>'
            + '<option value="ordinal">Ordinal (mRS shift)</option>'
            + '<option value="time_to_event">Time-to-event</option>'
            + '<option value="rate">Rate (events per time)</option>'
            + '</select></div>'
            + '<div class="form-group"><label class="form-label">Direction of Expected Effect</label>'
            + '<select class="form-select" id="hb-direction">'
            + '<option value="superiority">Superiority (treatment better)</option>'
            + '<option value="noninferiority">Non-inferiority (not worse)</option>'
            + '<option value="equivalence">Equivalence (same)</option>'
            + '<option value="harm">Potential harm (risk association)</option>'
            + '</select></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="HypothesisBuilder.generateHypothesis()">Generate Research Question &amp; Hypotheses</button>'
            + '</div>';

        html += '<div id="hb-pico-results"></div>';
        html += '</div>';

        // ===== TAB B: PICOT Framework Builder =====
        html += '<div class="tab-content" id="tab-picot">';
        html += '<div class="card-subtitle">Extended PICOT framework adds a Time element. Build a comprehensive, structured research question with all five components.</div>';

        html += '<div class="form-group"><label class="form-label">P - Population / Problem ' + App.tooltip('Define the patient population, disease, and setting') + '</label>'
            + '<input type="text" class="form-input" id="hb-picot-p" name="hb_picot_p" placeholder="e.g., Adult patients (age >= 18) with acute ischemic stroke due to large vessel occlusion"></div>';

        html += '<div class="form-group"><label class="form-label">I - Intervention / Indicator ' + App.tooltip('The intervention, treatment, exposure, or prognostic factor of interest') + '</label>'
            + '<input type="text" class="form-input" id="hb-picot-i" name="hb_picot_i" placeholder="e.g., Mechanical thrombectomy plus IV tPA"></div>';

        html += '<div class="form-group"><label class="form-label">C - Comparison / Control ' + App.tooltip('The alternative treatment, usual care, or reference group') + '</label>'
            + '<input type="text" class="form-input" id="hb-picot-c" name="hb_picot_c" placeholder="e.g., IV tPA alone (standard medical management)"></div>';

        html += '<div class="form-group"><label class="form-label">O - Outcome ' + App.tooltip('Primary outcome with measurement method') + '</label>'
            + '<input type="text" class="form-input" id="hb-picot-o" name="hb_picot_o" placeholder="e.g., Functional independence defined as modified Rankin Scale 0-2"></div>';

        html += '<div class="form-group"><label class="form-label">T - Time ' + App.tooltip('Duration of follow-up, when the outcome is measured') + '</label>'
            + '<input type="text" class="form-input" id="hb-picot-t" name="hb_picot_t" placeholder="e.g., 90 days after stroke onset"></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="HypothesisBuilder.generatePICOT()">Generate PICOT Statement</button>'
            + '<button class="btn btn-secondary" onclick="HypothesisBuilder.loadPICOTExample()">Load Example</button>'
            + '</div>';

        html += '<div id="hb-picot-results"></div>';
        html += '</div>';

        // ===== TAB C: Hypothesis Type Selector =====
        html += '<div class="tab-content" id="tab-hyptype">';
        html += '<div class="card-subtitle">Select a hypothesis type to get templates and guidance for formulating superiority, non-inferiority, or equivalence hypotheses.</div>';

        html += '<div class="form-group"><label class="form-label">Hypothesis Type</label>'
            + '<select class="form-select" id="hb-hyp-type" onchange="HypothesisBuilder.showHypothesisType()">'
            + '<option value="">-- Select hypothesis type --</option>'
            + '<option value="superiority">Superiority</option>'
            + '<option value="noninferiority">Non-Inferiority</option>'
            + '<option value="equivalence">Equivalence</option>'
            + '</select></div>';

        html += '<div id="hb-hyp-type-results"></div>';

        // Comparison table (always visible)
        html += '<div class="card-title mt-3">Comparison of Hypothesis Types</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Feature</th><th>Superiority</th><th>Non-Inferiority</th><th>Equivalence</th></tr></thead><tbody>'
            + '<tr><td><strong>Goal</strong></td><td>Show new treatment is better</td><td>Show new treatment is not worse by more than a margin</td><td>Show treatments are the same within a margin</td></tr>'
            + '<tr><td><strong>H0</strong></td><td>No difference (delta = 0)</td><td>New is worse by at least margin</td><td>Difference exceeds margin</td></tr>'
            + '<tr><td><strong>H1</strong></td><td>There is a difference (delta != 0)</td><td>New is not worse than margin</td><td>Difference is within margin</td></tr>'
            + '<tr><td><strong>Margin</strong></td><td>Not applicable</td><td>Pre-specified NI margin (delta)</td><td>Pre-specified equivalence margin (+/- delta)</td></tr>'
            + '<tr><td><strong>Sided test</strong></td><td>Two-sided (usually)</td><td>One-sided (lower bound of CI)</td><td>Two one-sided tests (TOST)</td></tr>'
            + '<tr><td><strong>Sample size</strong></td><td>Standard</td><td>Often larger than superiority</td><td>Largest (must exclude both directions)</td></tr>'
            + '<tr><td><strong>When to use</strong></td><td>Expected clinically meaningful benefit</td><td>New treatment has other advantages (safety, cost, convenience)</td><td>Generic vs. branded drug; biosimilars</td></tr>'
            + '<tr><td><strong>Key pitfall</strong></td><td>Underpowered studies falsely conclude "no difference"</td><td>Biocreep (successive NI trials erode efficacy)</td><td>Choosing too wide a margin</td></tr>'
            + '</tbody></table></div>';
        html += '</div>';

        // ===== TAB D: Research Question Generator =====
        html += '<div class="tab-content" id="tab-resgen">';
        html += '<div class="card-subtitle">Select your study type and clinical domain to generate structured research question templates.</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Study Type</label>'
            + '<select class="form-select" id="hb-rq-type">'
            + '<option value="rct">Randomized Controlled Trial</option>'
            + '<option value="cohort">Prospective Cohort Study</option>'
            + '<option value="case_control">Case-Control Study</option>'
            + '<option value="cross_sectional">Cross-Sectional Study</option>'
            + '<option value="diagnostic">Diagnostic Accuracy Study</option>'
            + '<option value="prognostic">Prognostic Study</option>'
            + '<option value="sr_ma">Systematic Review / Meta-Analysis</option>'
            + '</select></div>'
            + '<div class="form-group"><label class="form-label">Clinical Focus Area</label>'
            + '<select class="form-select" id="hb-rq-domain">'
            + '<option value="stroke">Stroke / Cerebrovascular</option>'
            + '<option value="neuro">General Neurology</option>'
            + '<option value="cardio">Cardiovascular</option>'
            + '<option value="onc">Oncology</option>'
            + '<option value="id">Infectious Disease</option>'
            + '<option value="general">General Clinical</option>'
            + '</select></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="HypothesisBuilder.generateResearchQuestions()">Generate Templates</button>'
            + '</div>';

        html += '<div id="hb-rq-results"></div>';
        html += '</div>';

        // ===== TAB E: Study Design Decision Tree =====
        html += '<div class="tab-content" id="tab-design">';
        html += '<div class="card-subtitle">Select your research question type to see the optimal study design, hierarchy of evidence, and practical guidance for clinical research.</div>';

        html += '<div class="form-group"><label class="form-label">What type of question are you asking?</label>'
            + '<select class="form-select" id="hb-question-type" onchange="HypothesisBuilder.showDesignTree()">'
            + '<option value="">-- Select question type --</option>'
            + '<option value="therapy">Therapy / Prevention (Does an intervention work?)</option>'
            + '<option value="diagnosis">Diagnosis (How accurate is a test?)</option>'
            + '<option value="prognosis">Prognosis (What will happen over time?)</option>'
            + '<option value="etiology">Etiology / Harm (What causes the condition?)</option>'
            + '</select></div>';

        html += '<div id="hb-design-results"></div>';
        html += '</div>';

        // ===== TAB F: Variable Classification Tool =====
        html += '<div class="tab-content" id="tab-variables">';
        html += '<div class="card-subtitle">Classify study variables to generate an analysis plan outline and check for methodological pitfalls.</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Variable Name</label>'
            + '<input type="text" class="form-input" id="hb-var-name" placeholder="e.g., NIHSS at baseline"></div>'
            + '<div class="form-group"><label class="form-label">Classification</label>'
            + '<select class="form-select" id="hb-var-class">'
            + '<option value="independent">Independent Variable (Exposure)</option>'
            + '<option value="dependent">Dependent Variable (Outcome)</option>'
            + '<option value="confounder">Confounder</option>'
            + '<option value="mediator">Mediator</option>'
            + '<option value="moderator">Effect Modifier / Moderator</option>'
            + '<option value="precision">Precision Variable</option>'
            + '</select></div>'
            + '<div class="form-group" style="display:flex;align-items:flex-end">'
            + '<button class="btn btn-primary" onclick="HypothesisBuilder.addVariable()">Add Variable</button></div>'
            + '</div>';

        html += '<div id="hb-var-table"></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="HypothesisBuilder.clearVariables()">Clear All</button>'
            + '<button class="btn btn-primary" onclick="HypothesisBuilder.generateAnalysisPlan()">Generate Analysis Plan</button>'
            + '</div>';

        html += '<div id="hb-analysis-plan"></div>';
        html += '</div>';

        // ===== TAB G: Specific Aims Template =====
        html += '<div class="tab-content" id="tab-aims">';
        html += '<div class="card-subtitle">Generate a structured Specific Aims page template for NIH-style grant applications.</div>';
        html += buildSpecificAimsContent();
        html += '</div>';

        // ===== TAB H: Hypothesis Refinement Checklist =====
        html += '<div class="tab-content" id="tab-checklist">';
        html += '<div class="card-subtitle">Use this checklist to evaluate and refine your research hypothesis before finalizing your protocol.</div>';
        html += buildRefinementChecklist();
        html += '</div>';

        html += '</div>'; // end card

        // ===== LEARN SECTION =====
        html += '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Learn: Hypothesis Building Essentials</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';

        html += '<div class="card-subtitle" style="font-weight:600;">PICO/FINER Frameworks</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>PICO:</strong> Population, Intervention, Comparison, Outcome</li>'
            + '<li><strong>PICOT:</strong> Adds Time element (when outcome is measured)</li>'
            + '<li><strong>PECO:</strong> Population, Exposure, Comparison, Outcome (for observational studies)</li>'
            + '<li><strong>FINER:</strong> Feasible, Interesting, Novel, Ethical, Relevant</li>'
            + '<li>A well-formed hypothesis specifies the expected direction and magnitude of effect</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Hypothesis Types</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Superiority:</strong> Tests whether the new treatment is better than the control (two-sided test)</li>'
            + '<li><strong>Non-inferiority:</strong> Tests whether the new treatment is not worse than the control by a pre-specified margin (one-sided)</li>'
            + '<li><strong>Equivalence:</strong> Tests whether treatments are essentially the same within a margin (two one-sided tests, TOST)</li>'
            + '<li><strong>Futility:</strong> Tests whether it is worth continuing a trial (interim analysis)</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Variable Classification</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Primary exposure:</strong> The main independent variable of interest</li>'
            + '<li><strong>Primary outcome:</strong> The main dependent variable (determines sample size)</li>'
            + '<li><strong>Confounders:</strong> Variables associated with both exposure and outcome</li>'
            + '<li><strong>Effect modifiers:</strong> Variables that change the magnitude/direction of the association</li>'
            + '<li><strong>Mediators:</strong> Variables on the causal pathway (do NOT adjust for these)</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Specific Aims Structure (NIH)</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Opening paragraph:</strong> Importance of the problem; what is known</li>'
            + '<li><strong>Gap paragraph:</strong> What is NOT known; why it matters</li>'
            + '<li><strong>Proposal paragraph:</strong> Long-term goal, objective, central hypothesis, rationale</li>'
            + '<li><strong>Aims:</strong> Typically 2-3 aims with specific hypotheses and approaches</li>'
            + '<li><strong>Payoff paragraph:</strong> Expected outcomes, significance, innovation</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Common Pitfalls</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Vague outcomes:</strong> Always pre-specify how the outcome will be measured and at what time point</li>'
            + '<li><strong>Multiple primaries:</strong> More than one primary outcome requires multiplicity correction</li>'
            + '<li><strong>Post-hoc hypotheses:</strong> Hypotheses generated from data should be labeled as exploratory</li>'
            + '<li><strong>Untestable hypotheses:</strong> Must be specific and falsifiable with available methods</li>'
            + '<li><strong>Missing comparison group:</strong> Every hypothesis needs a clearly defined comparator</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;">'
            + '<li>Hulley SB, et al. <em>Designing Clinical Research</em>. 4th ed. Lippincott Williams & Wilkins; 2013.</li>'
            + '<li>Sackett DL, et al. <em>Evidence-Based Medicine: How to Practice and Teach It</em>. 4th ed. Churchill Livingstone; 2010.</li>'
            + '<li>NIH Center for Scientific Review. <em>Peer Review: Specific Aims Guidance</em>.</li>'
            + '</ul>';
        html += '</div></div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);

        // Reset variable state
        classifiedVars = [];
        varIdCounter = 0;
    }

    // ===== Specific Aims Template Builder =====
    function buildSpecificAimsContent() {
        var html = '';

        html += '<div class="card-title">Specific Aims Page Builder (NIH Format)</div>';
        html += '<p style="color:var(--text-secondary);font-size:0.85rem;margin:0 0 12px 0">'
            + 'Fill in the fields below to generate a structured Specific Aims page. The output follows the standard NIH format.</p>';

        html += '<div class="form-group"><label class="form-label">Project Title</label>'
            + '<input type="text" class="form-input" id="hb-aim-title" name="hb_aim_title" placeholder="e.g., Optimizing Acute Stroke Treatment with Imaging-Based Patient Selection"></div>';

        html += '<div class="form-group"><label class="form-label">Opening: Significance / Problem Statement ' + App.tooltip('Why is this problem important? What is the burden? Cite key statistics.') + '</label>'
            + '<textarea class="form-input" id="hb-aim-opening" name="hb_aim_opening" rows="3" placeholder="e.g., Stroke is the leading cause of disability in the US, affecting X patients annually..."></textarea></div>';

        html += '<div class="form-group"><label class="form-label">Knowledge Gap ' + App.tooltip('What is unknown or unresolved? Why does it matter?') + '</label>'
            + '<textarea class="form-input" id="hb-aim-gap" name="hb_aim_gap" rows="2" placeholder="e.g., However, the optimal imaging criteria for patient selection beyond 6 hours remain undefined..."></textarea></div>';

        html += '<div class="form-group"><label class="form-label">Long-term Goal</label>'
            + '<input type="text" class="form-input" id="hb-aim-ltg" name="hb_aim_ltg" placeholder="e.g., To improve functional outcomes for acute stroke patients through precision medicine approaches"></div>';

        html += '<div class="form-group"><label class="form-label">Objective of This Application</label>'
            + '<input type="text" class="form-input" id="hb-aim-obj" name="hb_aim_obj" placeholder="e.g., To determine the optimal imaging selection criteria for late-window thrombectomy"></div>';

        html += '<div class="form-group"><label class="form-label">Central Hypothesis</label>'
            + '<input type="text" class="form-input" id="hb-aim-hyp" name="hb_aim_hyp" placeholder="e.g., Perfusion imaging-based selection identifies patients who benefit from thrombectomy beyond 6 hours"></div>';

        html += '<div class="form-group"><label class="form-label">Rationale</label>'
            + '<textarea class="form-input" id="hb-aim-rationale" name="hb_aim_rationale" rows="2" placeholder="e.g., Our rationale is based on the DAWN and DEFUSE 3 trial results showing..."></textarea></div>';

        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:16px;margin:12px 0;">';
        html += '<div style="font-weight:700;margin-bottom:8px;">Specific Aims (up to 3)</div>';

        for (var i = 1; i <= 3; i++) {
            html += '<div style="margin-bottom:12px;padding:12px;background:var(--surface);border-radius:8px;">';
            html += '<div style="font-weight:600;margin-bottom:4px;">Aim ' + i + '</div>';
            html += '<div class="form-group"><label class="form-label">Aim Statement</label>'
                + '<input type="text" class="form-input" id="hb-aim' + i + '-stmt" name="hb_aim' + i + '_stmt" placeholder="e.g., To determine the [primary objective]..."></div>';
            html += '<div class="form-group"><label class="form-label">Hypothesis for Aim ' + i + '</label>'
                + '<input type="text" class="form-input" id="hb-aim' + i + '-hyp" name="hb_aim' + i + '_hyp" placeholder="e.g., We hypothesize that..."></div>';
            html += '<div class="form-group"><label class="form-label">Approach (brief)</label>'
                + '<input type="text" class="form-input" id="hb-aim' + i + '-approach" name="hb_aim' + i + '_approach" placeholder="e.g., We will conduct a [study type] using [methods]..."></div>';
            html += '</div>';
        }
        html += '</div>';

        html += '<div class="form-group"><label class="form-label">Payoff / Expected Outcomes</label>'
            + '<textarea class="form-input" id="hb-aim-payoff" name="hb_aim_payoff" rows="2" placeholder="e.g., This work is expected to establish evidence-based imaging criteria that will..."></textarea></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="HypothesisBuilder.generateAimsPage()">Generate Aims Page</button>'
            + '<button class="btn btn-secondary" onclick="HypothesisBuilder.copyAimsPage()">Copy to Clipboard</button>'
            + '</div>';

        html += '<div id="hb-aims-output"></div>';

        return html;
    }

    // ===== Hypothesis Refinement Checklist =====
    function buildRefinementChecklist() {
        var html = '';

        var criteria = [
            { id: 'specific', label: 'Specific', question: 'Is the hypothesis focused on a single, well-defined relationship between specific variables?', tip: 'Avoid vague terms like "affects" or "impacts." Specify the direction and expected magnitude.' },
            { id: 'measurable', label: 'Measurable', question: 'Are all variables operationally defined with validated measurement instruments and time points?', tip: 'Specify exactly how each variable will be measured (e.g., "NIHSS at 24 hours" not just "neurological function").' },
            { id: 'falsifiable', label: 'Falsifiable', question: 'Can the hypothesis be proven wrong? Is there a conceivable result that would reject it?', tip: 'A hypothesis that cannot be rejected is not scientific. Ensure your design can produce a negative result.' },
            { id: 'feasible', label: 'Feasible', question: 'Is testing this hypothesis achievable with available resources, sample size, and timeline?', tip: 'Consider recruitment rate, follow-up period, budget, and existing infrastructure.' },
            { id: 'novel', label: 'Novel', question: 'Does this hypothesis address a genuine gap in knowledge, or has it already been answered?', tip: 'Conduct a systematic literature search before finalizing. Consider existing systematic reviews.' },
            { id: 'ethical', label: 'Ethical', question: 'Is it ethical to test this hypothesis? Does equipoise exist?', tip: 'For RCTs, genuine uncertainty about the best treatment must exist. Ensure IRB/ethics approval is obtainable.' },
            { id: 'relevant', label: 'Clinically Relevant', question: 'Would the results, if confirmed, change clinical practice or advance scientific understanding?', tip: 'Consider the minimum clinically important difference (MCID) for your outcome measure.' },
            { id: 'comparison', label: 'Clear Comparator', question: 'Is there a well-defined comparison group or reference standard?', tip: 'Specify active vs. placebo control, or exposed vs. unexposed definition.' },
            { id: 'timeline', label: 'Defined Timeline', question: 'Is there a specified time point for outcome assessment?', tip: 'Define primary endpoint time (e.g., 90-day mRS) and any interim assessments.' },
            { id: 'powered', label: 'Adequately Powered', question: 'Has a power analysis been performed based on realistic effect size estimates?', tip: 'Base effect size on pilot data or literature, not optimistic assumptions. Plan for dropout.' },
            { id: 'preregistered', label: 'Pre-Registered', question: 'Will the hypothesis and analysis plan be pre-registered before data collection?', tip: 'Register at ClinicalTrials.gov, PROSPERO, or OSF. Pre-registration enhances credibility.' },
            { id: 'confounders', label: 'Confounders Addressed', question: 'Have potential confounders been identified and is a plan in place to control for them?', tip: 'Use a DAG to identify the minimum sufficient adjustment set. Plan for unmeasured confounding assessment (E-value).' }
        ];

        html += '<div class="card-title">Hypothesis Quality Assessment</div>';
        html += '<p style="color:var(--text-secondary);font-size:0.85rem;margin:0 0 12px 0">'
            + 'Check each criterion that your hypothesis satisfies. A score of 10+ out of 12 indicates a well-formulated, testable hypothesis ready for protocol development.</p>';

        html += '<div id="hb-checklist-items">';
        criteria.forEach(function(c) {
            html += '<div style="padding:10px 12px;margin-bottom:6px;border:1px solid var(--border);border-radius:8px;background:var(--surface);">'
                + '<label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;">'
                + '<input type="checkbox" id="hb-chk-' + c.id + '" onchange="HypothesisBuilder.updateChecklistScore()" style="margin-top:3px;">'
                + '<div>'
                + '<div style="font-weight:600;font-size:0.9rem;">' + c.label + '</div>'
                + '<div style="font-size:0.85rem;color:var(--text-secondary);">' + c.question + '</div>'
                + '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:2px;font-style:italic;">Tip: ' + c.tip + '</div>'
                + '</div></label></div>';
        });
        html += '</div>';

        html += '<div id="hb-checklist-score" style="margin-top:12px;padding:16px;background:var(--surface);border-radius:8px;text-align:center;">'
            + '<div style="font-size:2rem;font-weight:700;color:var(--text-tertiary);">0 / 12</div>'
            + '<div style="font-size:0.85rem;color:var(--text-tertiary);">Check items above to assess your hypothesis</div>'
            + '</div>';

        // Store criteria count for score calculation
        html += '<input type="hidden" id="hb-checklist-total" value="' + criteria.length + '">';

        return html;
    }

    // ===== Tab switching =====
    function switchTab(tabId) {
        document.querySelectorAll('#hb-tabs .tab').forEach(function(t) { t.classList.toggle('active', t.dataset.tab === tabId); });
        document.querySelectorAll('.tab-content').forEach(function(tc) {
            var tcId = tc.id.replace('tab-', '');
            tc.classList.toggle('active', tcId === tabId);
        });
    }

    function updateFramework() {
        var fw = document.getElementById('hb-framework').value;
        var label = document.getElementById('hb-ie-label');
        if (label) {
            label.textContent = fw === 'pico' ? 'I - Intervention' : 'E - Exposure';
        }
        var input = document.getElementById('hb-intervention');
        if (input) {
            input.placeholder = fw === 'pico'
                ? 'e.g., Endovascular thrombectomy plus medical therapy'
                : 'e.g., Exposure to air pollution (PM2.5 > 25 ug/m3)';
        }
    }

    // ===== PICO/PECO Generator =====
    function generateHypothesis() {
        var framework = document.getElementById('hb-framework').value;
        var domain = document.getElementById('hb-domain').value;
        var population = document.getElementById('hb-population').value.trim();
        var intervention = document.getElementById('hb-intervention').value.trim();
        var comparison = document.getElementById('hb-comparison').value.trim();
        var outcome = document.getElementById('hb-outcome').value.trim();
        var outcomeType = document.getElementById('hb-outcome-type').value;
        var direction = document.getElementById('hb-direction').value;

        if (!population || !intervention || !comparison || !outcome) {
            Export.showToast('Please fill in all PICO/PECO fields', 'error');
            return;
        }

        var ieLabel = framework === 'pico' ? 'receiving' : 'exposed to';
        var cLabel = framework === 'pico' ? 'compared to' : 'compared with';

        var researchQuestion = 'Among ' + population + ', '
            + (direction === 'harm' ? 'is ' : 'does ')
            + intervention.toLowerCase()
            + (direction === 'harm' ? ' associated with ' : ' result in ')
            + (direction === 'superiority' ? 'improved ' : direction === 'noninferiority' ? 'non-inferior ' : direction === 'equivalence' ? 'equivalent ' : 'increased risk of ')
            + outcome.toLowerCase()
            + ' ' + cLabel + ' ' + comparison.toLowerCase() + '?';

        var h0, h1;
        var outcomeTypeLabel = { binary: 'proportion', continuous: 'mean', ordinal: 'odds of improvement', time_to_event: 'hazard', rate: 'rate' };
        var measureLabel = outcomeTypeLabel[outcomeType] || 'outcome measure';

        if (direction === 'superiority') {
            h0 = 'There is no difference in ' + outcome.toLowerCase() + ' between patients ' + ieLabel + ' ' + intervention.toLowerCase() + ' and those ' + ieLabel + ' ' + comparison.toLowerCase() + '.';
            h1 = 'Patients ' + ieLabel + ' ' + intervention.toLowerCase() + ' have a significantly better ' + measureLabel + ' of ' + outcome.toLowerCase() + ' compared to those ' + ieLabel + ' ' + comparison.toLowerCase() + '.';
        } else if (direction === 'noninferiority') {
            h0 = intervention + ' is inferior to ' + comparison.toLowerCase() + ' in ' + outcome.toLowerCase() + ' by more than the pre-specified non-inferiority margin.';
            h1 = intervention + ' is non-inferior to ' + comparison.toLowerCase() + ' in ' + outcome.toLowerCase() + ', with the lower bound of the CI above the non-inferiority margin.';
        } else if (direction === 'equivalence') {
            h0 = 'The difference in ' + outcome.toLowerCase() + ' between ' + intervention.toLowerCase() + ' and ' + comparison.toLowerCase() + ' exceeds the equivalence margin.';
            h1 = intervention + ' and ' + comparison.toLowerCase() + ' produce equivalent ' + outcome.toLowerCase() + ', with the CI falling entirely within the equivalence margin.';
        } else {
            h0 = 'There is no association between ' + intervention.toLowerCase() + ' and ' + outcome.toLowerCase() + '.';
            h1 = intervention + ' is associated with an increased risk of ' + outcome.toLowerCase() + ' compared to ' + comparison.toLowerCase() + '.';
        }

        var designSuggestion = '';
        var designNote = '';
        if (framework === 'pico') {
            if (direction === 'superiority' || direction === 'noninferiority' || direction === 'equivalence') {
                designSuggestion = 'Randomized Controlled Trial (RCT)';
                designNote = 'A parallel-group RCT is the gold standard for intervention questions. Consider adaptive designs for trials where recruitment is challenging.';
            }
        } else {
            if (direction === 'harm') {
                designSuggestion = 'Cohort Study or Case-Control Study';
                designNote = 'For etiology/harm questions, prospective cohort or nested case-control designs minimize bias. Consider population-based registries.';
            } else {
                designSuggestion = 'Prospective Cohort Study';
                designNote = 'Observational cohorts are most appropriate for exposure-outcome associations. Use propensity score methods to control confounding.';
            }
        }

        if (outcomeType === 'ordinal' && domain === 'acute_stroke') {
            designNote += ' For acute stroke trials using mRS, ordinal shift analysis (proportional odds model) is the preferred primary analysis, as recommended by regulatory guidance.';
        }

        var html = '<div class="result-panel animate-in">';

        html += '<div class="card-title">Structured Research Question</div>';
        html += '<div style="font-size:1rem;color:var(--text);line-height:1.6;margin:8px 0;padding:12px;background:var(--surface);border-radius:8px;border-left:3px solid var(--accent)">'
            + researchQuestion + '</div>';

        html += '<div class="card-title mt-2">' + framework.toUpperCase() + ' Components</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><tbody>'
            + '<tr><td style="font-weight:bold;color:var(--accent);width:140px">P - Population</td><td>' + population + '</td></tr>'
            + '<tr><td style="font-weight:bold;color:var(--accent)">' + (framework === 'pico' ? 'I - Intervention' : 'E - Exposure') + '</td><td>' + intervention + '</td></tr>'
            + '<tr><td style="font-weight:bold;color:var(--accent)">C - Comparison</td><td>' + comparison + '</td></tr>'
            + '<tr><td style="font-weight:bold;color:var(--accent)">O - Outcome</td><td>' + outcome + '</td></tr>'
            + '</tbody></table></div>';

        html += '<div class="card-title mt-2">Hypotheses</div>';
        html += '<div style="margin:8px 0">'
            + '<div style="padding:10px;background:var(--surface);border-radius:8px;margin-bottom:8px">'
            + '<strong style="color:var(--text-secondary);font-size:0.85rem">H<sub>0</sub> (Null Hypothesis):</strong><br>'
            + '<span style="color:var(--text-secondary);font-size:0.9rem">' + h0 + '</span></div>'
            + '<div style="padding:10px;background:var(--surface);border-radius:8px">'
            + '<strong style="color:var(--accent);font-size:0.85rem">H<sub>1</sub> (Alternative Hypothesis):</strong><br>'
            + '<span style="color:var(--text-secondary);font-size:0.9rem">' + h1 + '</span></div>'
            + '</div>';

        html += '<div class="card-title mt-2">Suggested Study Design</div>';
        html += '<div style="padding:12px;background:var(--surface);border-radius:8px">'
            + '<div style="font-size:1rem;color:var(--accent);font-weight:600">' + designSuggestion + '</div>'
            + '<div style="font-size:0.85rem;color:var(--text-secondary);margin-top:4px">' + designNote + '</div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="HypothesisBuilder.copyPICO()">Copy All</button>'
            + '<button class="btn btn-xs btn-primary" onclick="App.navigate(\'sample-size\')">Go to Sample Size Calculator</button>'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('hb-pico-results'), html);
        Export.addToHistory(MODULE_ID, { population: population, intervention: intervention }, researchQuestion);
    }

    function copyPICO() {
        var population = document.getElementById('hb-population').value.trim();
        var intervention = document.getElementById('hb-intervention').value.trim();
        var comparison = document.getElementById('hb-comparison').value.trim();
        var outcome = document.getElementById('hb-outcome').value.trim();
        var framework = document.getElementById('hb-framework').value;

        var text = framework.toUpperCase() + ' Framework\n'
            + 'P: ' + population + '\n'
            + (framework === 'pico' ? 'I' : 'E') + ': ' + intervention + '\n'
            + 'C: ' + comparison + '\n'
            + 'O: ' + outcome;
        Export.copyText(text);
    }

    // ===== PICOT Generator =====
    function generatePICOT() {
        var p = document.getElementById('hb-picot-p').value.trim();
        var i = document.getElementById('hb-picot-i').value.trim();
        var c = document.getElementById('hb-picot-c').value.trim();
        var o = document.getElementById('hb-picot-o').value.trim();
        var t = document.getElementById('hb-picot-t').value.trim();

        if (!p || !i || !c || !o || !t) {
            Export.showToast('Please fill in all five PICOT fields', 'error');
            return;
        }

        var question = 'In ' + p.toLowerCase() + ', does ' + i.toLowerCase() + ' compared to ' + c.toLowerCase()
            + ' improve ' + o.toLowerCase() + ' at ' + t.toLowerCase() + '?';

        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">PICOT Research Question</div>';
        html += '<div style="font-size:1rem;color:var(--text);line-height:1.6;margin:8px 0;padding:12px;background:var(--surface);border-radius:8px;border-left:3px solid var(--accent)">'
            + question + '</div>';

        html += '<div class="table-scroll-wrap"><table class="data-table"><tbody>'
            + '<tr><td style="font-weight:bold;color:var(--accent);width:140px">P - Population</td><td>' + p + '</td></tr>'
            + '<tr><td style="font-weight:bold;color:var(--accent)">I - Intervention</td><td>' + i + '</td></tr>'
            + '<tr><td style="font-weight:bold;color:var(--accent)">C - Comparison</td><td>' + c + '</td></tr>'
            + '<tr><td style="font-weight:bold;color:var(--accent)">O - Outcome</td><td>' + o + '</td></tr>'
            + '<tr><td style="font-weight:bold;color:var(--accent)">T - Time</td><td>' + t + '</td></tr>'
            + '</tbody></table></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.copyText(\'' + question.replace(/'/g, "\\'") + '\')">Copy Question</button>'
            + '</div>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('hb-picot-results'), html);
    }

    function loadPICOTExample() {
        document.getElementById('hb-picot-p').value = 'Adult patients (age >= 18) with acute ischemic stroke due to large vessel occlusion presenting within 6-24 hours of last known well';
        document.getElementById('hb-picot-i').value = 'Mechanical thrombectomy plus standard medical therapy';
        document.getElementById('hb-picot-c').value = 'Standard medical therapy alone (including IV tPA if eligible)';
        document.getElementById('hb-picot-o').value = 'Functional independence defined as modified Rankin Scale score 0-2';
        document.getElementById('hb-picot-t').value = '90 days after stroke onset';
    }

    // ===== Hypothesis Type Selector =====
    function showHypothesisType() {
        var type = document.getElementById('hb-hyp-type').value;
        var display = document.getElementById('hb-hyp-type-results');
        if (!type) { App.setTrustedHTML(display, ''); return; }

        var data = {
            superiority: {
                title: 'Superiority Hypothesis',
                h0: 'H0: There is no difference between groups (\u03BC_treatment = \u03BC_control)',
                h1: 'H1: There is a difference (\u03BC_treatment \u2260 \u03BC_control)',
                template: 'Among [population], [intervention] will result in [superior/improved] [outcome] compared to [control], as measured by [outcome measure] at [time point].',
                considerations: [
                    'Standard two-sided alpha = 0.05, power = 0.80-0.90',
                    'Effect size based on clinically meaningful difference (MCID)',
                    'Primary analysis: intention-to-treat',
                    'Consider multiplicity adjustments if multiple primary endpoints'
                ],
                example: 'Among patients with acute ischemic stroke due to large vessel occlusion, mechanical thrombectomy plus IV tPA will result in a higher rate of functional independence (mRS 0-2) at 90 days compared to IV tPA alone.'
            },
            noninferiority: {
                title: 'Non-Inferiority Hypothesis',
                h0: 'H0: Treatment is inferior by more than margin \u0394 (lower bound of CI below -\u0394)',
                h1: 'H1: Treatment is not inferior by more than margin \u0394 (lower bound of CI above -\u0394)',
                template: 'Among [population], [new treatment] is non-inferior to [standard treatment] in [outcome], with a pre-specified non-inferiority margin of [\u0394 = margin] as measured at [time point].',
                considerations: [
                    'One-sided alpha = 0.025 (equivalent to two-sided 0.05)',
                    'Non-inferiority margin must be pre-specified and justified (fraction of proven effect)',
                    'Both ITT and per-protocol populations should be analyzed (both must demonstrate NI)',
                    'Risk of biocreep with successive NI trials',
                    'Assay sensitivity: the study must be able to detect the effect of the active control'
                ],
                example: 'Among patients with atrial fibrillation requiring anticoagulation, apixaban is non-inferior to warfarin in preventing stroke or systemic embolism, with a pre-specified non-inferiority margin of 1.38 for the hazard ratio.'
            },
            equivalence: {
                title: 'Equivalence Hypothesis',
                h0: 'H0: Difference exceeds the equivalence margin (\u0394 > |\u03B5| in either direction)',
                h1: 'H1: Difference is within the equivalence margin (-\u03B5 < \u0394 < \u03B5)',
                template: 'Among [population], [treatment A] and [treatment B] produce equivalent [outcome], with a pre-specified equivalence margin of \u00B1[\u03B5 = margin] as measured at [time point].',
                considerations: [
                    'Two one-sided tests (TOST) procedure at alpha = 0.05 each',
                    'Equivalence margin must be pre-specified and clinically justified',
                    'Typically requires larger sample sizes than superiority trials',
                    'Common in bioequivalence studies (generics, biosimilars)',
                    'Both confidence limits must fall within the equivalence margin'
                ],
                example: 'Among healthy volunteers, generic clopidogrel 75mg produces equivalent antiplatelet activity (AUC and Cmax within 80-125% bioequivalence range) compared to brand-name Plavix.'
            }
        };

        var d = data[type];
        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">' + d.title + '</div>';

        html += '<div style="margin:8px 0;padding:10px;background:var(--surface);border-radius:8px">'
            + '<div style="font-family:var(--font-mono);font-size:0.9rem;color:var(--text-secondary);margin-bottom:4px">' + d.h0 + '</div>'
            + '<div style="font-family:var(--font-mono);font-size:0.9rem;color:var(--accent)">' + d.h1 + '</div>'
            + '</div>';

        html += '<div class="card-title mt-2">Template</div>';
        html += '<div style="padding:12px;background:var(--surface);border-radius:8px;border-left:3px solid var(--accent);font-size:0.9rem;color:var(--text-secondary);line-height:1.6">'
            + d.template + '</div>';

        html += '<div class="card-title mt-2">Key Considerations</div>';
        html += '<ul style="margin:0;padding-left:20px;color:var(--text-secondary);font-size:0.9rem;line-height:1.8">';
        d.considerations.forEach(function(c) { html += '<li>' + c + '</li>'; });
        html += '</ul>';

        html += '<div class="card-title mt-2">Example</div>';
        html += '<div style="padding:12px;background:var(--surface);border-radius:8px;font-size:0.85rem;color:var(--text-secondary);font-style:italic;line-height:1.6">'
            + d.example + '</div>';

        html += '</div>';
        App.setTrustedHTML(display, html);
    }

    // ===== Research Question Generator =====
    function generateResearchQuestions() {
        var studyType = document.getElementById('hb-rq-type').value;
        var domain = document.getElementById('hb-rq-domain').value;

        var templates = {
            rct: [
                'Does [intervention] improve [primary outcome] compared to [standard care] in [population]?',
                'Is [new treatment] non-inferior to [established treatment] for [outcome] in [population]?',
                'Does the addition of [adjunct therapy] to [standard treatment] reduce [adverse event rate] in [population]?'
            ],
            cohort: [
                'Is [exposure] associated with an increased risk of [outcome] in [population] over [time period]?',
                'Does [prognostic factor] predict [clinical outcome] in [population] followed for [duration]?',
                'What is the incidence of [outcome] among [population] with [characteristic] compared to those without?'
            ],
            case_control: [
                'Is [exposure] more common among patients with [disease] compared to controls?',
                'Is there an association between [risk factor] and [disease] in [population]?',
                'Do patients with [outcome] have higher odds of prior [exposure] than matched controls?'
            ],
            cross_sectional: [
                'What is the prevalence of [condition] in [population] and what factors are associated with it?',
                'Is [characteristic] associated with [outcome] in a cross-sectional sample of [population]?',
                'What is the burden of [condition] in [setting] and how does it vary by [demographic factors]?'
            ],
            diagnostic: [
                'What is the sensitivity and specificity of [index test] for detecting [target condition] in [population]?',
                'How does [new diagnostic tool] compare to [reference standard] for identifying [condition]?',
                'What is the diagnostic accuracy of [biomarker/score] for predicting [outcome] in [clinical setting]?'
            ],
            prognostic: [
                'What factors predict [long-term outcome] in [population] with [condition]?',
                'Does [baseline characteristic] independently predict [adverse outcome] at [time point]?',
                'Can a prediction model incorporating [factors] accurately identify [population] at high risk for [outcome]?'
            ],
            sr_ma: [
                'What is the overall effect of [intervention] on [outcome] in [population] based on published RCTs?',
                'Is [exposure] consistently associated with [outcome] across observational studies?',
                'What is the pooled estimate of [diagnostic test] accuracy for [condition]?'
            ]
        };

        var domainExamples = {
            stroke: { population: 'acute ischemic stroke patients', exposure: 'atrial fibrillation', intervention: 'mechanical thrombectomy', outcome: 'functional independence (mRS 0-2)' },
            neuro: { population: 'patients with epilepsy', exposure: 'sleep deprivation', intervention: 'vagus nerve stimulation', outcome: 'seizure frequency' },
            cardio: { population: 'patients with heart failure', exposure: 'diabetes mellitus', intervention: 'SGLT2 inhibitors', outcome: 'cardiovascular mortality' },
            onc: { population: 'patients with non-small cell lung cancer', exposure: 'BRCA mutation', intervention: 'immunotherapy', outcome: 'progression-free survival' },
            id: { population: 'inpatient COVID-19 patients', exposure: 'immunosuppression', intervention: 'antiviral therapy', outcome: 'time to recovery' },
            general: { population: 'adult patients', exposure: 'risk factor', intervention: 'treatment', outcome: 'clinical outcome' }
        };

        var ex = domainExamples[domain] || domainExamples.general;
        var tpls = templates[studyType] || templates.rct;

        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">Research Question Templates</div>';
        html += '<p style="color:var(--text-secondary);font-size:0.85rem;margin:0 0 12px 0">Replace bracketed placeholders with your specific variables. Example domain values shown in italics.</p>';

        tpls.forEach(function(t, idx) {
            var filled = t.replace('[intervention]', '<em>' + ex.intervention + '</em>')
                .replace('[new treatment]', '<em>' + ex.intervention + '</em>')
                .replace('[adjunct therapy]', '<em>' + ex.intervention + '</em>')
                .replace('[new diagnostic tool]', '<em>' + ex.intervention + '</em>')
                .replace('[index test]', '<em>' + ex.intervention + '</em>')
                .replace('[standard care]', '<em>standard medical therapy</em>')
                .replace('[standard treatment]', '<em>standard medical therapy</em>')
                .replace('[established treatment]', '<em>standard medical therapy</em>')
                .replace('[reference standard]', '<em>gold standard imaging</em>')
                .replace('[exposure]', '<em>' + ex.exposure + '</em>')
                .replace('[risk factor]', '<em>' + ex.exposure + '</em>')
                .replace('[prognostic factor]', '<em>' + ex.exposure + '</em>')
                .replace('[characteristic]', '<em>' + ex.exposure + '</em>')
                .replace('[baseline characteristic]', '<em>' + ex.exposure + '</em>')
                .replace('[biomarker/score]', '<em>' + ex.exposure + '</em>')
                .replace(/\[factors\]/g, '<em>' + ex.exposure + '</em>')
                .replace(/\[primary outcome\]/g, '<em>' + ex.outcome + '</em>')
                .replace(/\[outcome\]/g, '<em>' + ex.outcome + '</em>')
                .replace(/\[clinical outcome\]/g, '<em>' + ex.outcome + '</em>')
                .replace(/\[long-term outcome\]/g, '<em>' + ex.outcome + '</em>')
                .replace(/\[adverse outcome\]/g, '<em>' + ex.outcome + '</em>')
                .replace(/\[adverse event rate\]/g, '<em>complication rate</em>')
                .replace(/\[population\]/g, '<em>' + ex.population + '</em>')
                .replace(/\[disease\]/g, '<em>' + ex.population + '</em>')
                .replace(/\[condition\]/g, '<em>' + ex.outcome + '</em>')
                .replace(/\[target condition\]/g, '<em>' + ex.outcome + '</em>')
                .replace(/\[time period\]/g, '<em>5 years</em>')
                .replace(/\[time point\]/g, '<em>90 days</em>')
                .replace(/\[duration\]/g, '<em>2 years</em>')
                .replace(/\[setting\]/g, '<em>tertiary care centers</em>')
                .replace(/\[clinical setting\]/g, '<em>emergency department</em>')
                .replace(/\[demographic factors\]/g, '<em>age, sex, and race</em>');

            html += '<div style="padding:12px;background:var(--surface);border-radius:8px;margin-bottom:8px;border-left:3px solid var(--accent)">'
                + '<div style="font-size:0.85rem;font-weight:600;color:var(--text-tertiary);margin-bottom:4px">Template ' + (idx + 1) + '</div>'
                + '<div style="font-size:0.9rem;color:var(--text-secondary);line-height:1.6">' + filled + '</div>'
                + '</div>';
        });

        html += '</div>';
        App.setTrustedHTML(document.getElementById('hb-rq-results'), html);
    }

    // ===== Study Design Decision Tree =====
    function showDesignTree() {
        var type = document.getElementById('hb-question-type').value;
        if (!type) {
            App.setTrustedHTML(document.getElementById('hb-design-results'), '');
            return;
        }

        var data = getDesignData(type);
        var html = '<div class="result-panel animate-in">';

        html += '<div class="card-title">Hierarchy of Evidence: ' + data.title + '</div>';
        html += '<div style="margin:8px 0">';
        data.hierarchy.forEach(function(level, idx) {
            var opacity = 1 - idx * 0.12;
            var width = 100 - idx * 8;
            html += '<div style="margin:4px auto;padding:10px 16px;background:var(--accent);opacity:' + opacity + ';border-radius:8px;text-align:center;width:' + width + '%;color:var(--bg);font-size:0.85rem;font-weight:600">'
                + (idx + 1) + '. ' + level + '</div>';
        });
        html += '</div>';

        html += '<div class="card-title mt-2">Recommended Design</div>';
        html += '<div style="padding:16px;background:var(--surface);border-radius:12px;border-left:3px solid var(--accent)">'
            + '<div style="font-size:1.1rem;color:var(--accent);font-weight:700">' + data.recommended + '</div>'
            + '<p style="margin:8px 0;color:var(--text-secondary);font-size:0.9rem">' + data.explanation + '</p>'
            + '</div>';

        html += '<div class="card-title mt-2">Key Threats to Validity</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Threat</th><th>Description</th><th>Mitigation</th></tr></thead><tbody>';
        data.threats.forEach(function(t) {
            html += '<tr><td style="font-weight:600;color:var(--warning)">' + t.name + '</td>'
                + '<td style="color:var(--text-secondary);font-size:0.85rem">' + t.description + '</td>'
                + '<td style="color:var(--text-secondary);font-size:0.85rem">' + t.mitigation + '</td></tr>';
        });
        html += '</tbody></table></div>';

        html += '<div class="card-title mt-2">Research Context</div>';
        html += '<div class="result-grid">'
            + '<div class="result-item"><div class="result-item-value">' + data.typicalN + '</div><div class="result-item-label">Typical Sample Size</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + data.timeline + '</div><div class="result-item-label">Typical Timeline</div></div>'
            + '<div class="result-item"><div class="result-item-value">' + data.budget + '</div><div class="result-item-label">Budget Range</div></div>'
            + '</div>';

        if (data.examples && data.examples.length > 0) {
            html += '<div class="card-title mt-2">Landmark Examples</div>';
            html += '<ul style="margin:0;padding-left:20px;color:var(--text-secondary);font-size:0.85rem;line-height:1.8">';
            data.examples.forEach(function(ex) {
                html += '<li><strong>' + ex.name + '</strong>: ' + ex.description + '</li>';
            });
            html += '</ul>';
        }

        html += '</div>';

        App.setTrustedHTML(document.getElementById('hb-design-results'), html);
    }

    function getDesignData(type) {
        var designs = {
            therapy: {
                title: 'Therapy / Prevention',
                hierarchy: ['Systematic Review of RCTs', 'Randomized Controlled Trial (RCT)', 'Controlled Trial without Randomization', 'Cohort Study with Comparison', 'Case-Control Study', 'Case Series / Case Reports', 'Expert Opinion'],
                recommended: 'Randomized Controlled Trial (RCT)',
                explanation: 'RCTs are the gold standard for therapy questions because randomization eliminates confounding by indication and ensures balance of measured and unmeasured confounders.',
                threats: [
                    { name: 'Selection Bias', description: 'Non-random allocation or failure of randomization', mitigation: 'Central randomization, allocation concealment, stratification' },
                    { name: 'Performance Bias', description: 'Differences in care beyond the intervention', mitigation: 'Blinding of participants and care providers when possible' },
                    { name: 'Attrition Bias', description: 'Differential dropout between arms', mitigation: 'ITT analysis, multiple imputation, sensitivity analyses' },
                    { name: 'Detection Bias', description: 'Biased outcome assessment', mitigation: 'Blinded outcome assessment; central adjudication' }
                ],
                typicalN: '200-5000', timeline: '3-7 years', budget: '$2M-$50M+',
                examples: [
                    { name: 'MR CLEAN (2015)', description: 'First positive EVT trial; n=500' },
                    { name: 'DAWN (2018)', description: 'Late-window EVT; n=206; Bayesian adaptive' }
                ]
            },
            diagnosis: {
                title: 'Diagnosis',
                hierarchy: ['Systematic Review of Cross-Sectional Studies', 'Cross-Sectional Study with Gold Standard', 'Non-Consecutive Cohort Study', 'Case-Control Diagnostic Study', 'Case Series with Reference Standard', 'Expert Opinion'],
                recommended: 'Cross-Sectional Diagnostic Accuracy Study',
                explanation: 'Enroll a consecutive or random sample of patients suspected of the condition. Apply both the index test and reference standard to all patients. Follow STARD guidelines.',
                threats: [
                    { name: 'Spectrum Bias', description: 'Testing in extreme cases inflates accuracy', mitigation: 'Consecutive enrollment; include borderline cases' },
                    { name: 'Verification Bias', description: 'Only test-positive patients receive gold standard', mitigation: 'Apply reference standard to all patients' },
                    { name: 'Incorporation Bias', description: 'Index test is part of the reference standard', mitigation: 'Ensure tests are independent' },
                    { name: 'Review Bias', description: 'Knowledge of one test influences the other', mitigation: 'Blind interpreters to other test results' }
                ],
                typicalN: '100-500', timeline: '1-3 years', budget: '$100K-$2M',
                examples: [{ name: 'CTA for LVO Detection', description: 'Sensitivity/specificity of CTA vs DSA' }]
            },
            prognosis: {
                title: 'Prognosis',
                hierarchy: ['Systematic Review of Inception Cohorts', 'Inception Cohort Study', 'Cohort Study (non-inception)', 'Case-Control Study (nested)', 'Case Series', 'Expert Opinion'],
                recommended: 'Prospective Inception Cohort Study',
                explanation: 'Enroll patients at a common time point and follow forward. Measure prognostic factors at baseline. Use Kaplan-Meier and Cox regression.',
                threats: [
                    { name: 'Survivor Bias', description: 'Prevalent cases overrepresent long survivors', mitigation: 'Use inception cohort' },
                    { name: 'Loss to Follow-up', description: 'Differential attrition', mitigation: 'Minimize dropout; use IPW; sensitivity analyses' },
                    { name: 'Confounding', description: 'Unmeasured prognostic factors', mitigation: 'DAG-guided analysis; E-value for unmeasured confounding' },
                    { name: 'Lead Time Bias', description: 'Earlier detection extends apparent survival', mitigation: 'Time-zero alignment' }
                ],
                typicalN: '500-10000', timeline: '2-5 years', budget: '$500K-$5M',
                examples: [{ name: 'Framingham Heart Study', description: 'Stroke risk factors over decades' }]
            },
            etiology: {
                title: 'Etiology / Harm',
                hierarchy: ['Systematic Review of Cohort Studies', 'Prospective Cohort Study', 'Retrospective Cohort Study', 'Case-Control Study', 'Cross-Sectional Study', 'Ecological Study', 'Case Reports / Expert Opinion'],
                recommended: 'Prospective Cohort Study or Nested Case-Control Study',
                explanation: 'For etiology and harm questions, RCTs are typically not feasible. Prospective cohorts provide the best observational evidence with temporality established.',
                threats: [
                    { name: 'Confounding', description: 'Association due to common cause', mitigation: 'DAG-based adjustment; propensity scores; IV; MR' },
                    { name: 'Reverse Causation', description: 'Outcome causes the exposure', mitigation: 'Temporal separation; prospective design' },
                    { name: 'Information Bias', description: 'Misclassification of exposure/outcome', mitigation: 'Validated assessment; blinded ascertainment' },
                    { name: 'Healthy Worker Effect', description: 'Selection of healthier exposed', mitigation: 'Internal comparisons; appropriate reference group' }
                ],
                typicalN: '1000-100000+', timeline: '3-10 years', budget: '$1M-$20M',
                examples: [{ name: 'INTERSTROKE', description: 'Case-control of stroke risk factors; n=26,919' }]
            }
        };
        return designs[type];
    }

    // ===== Variable Classification Tool =====
    function addVariable() {
        var nameEl = document.getElementById('hb-var-name');
        var classEl = document.getElementById('hb-var-class');
        var name = nameEl.value.trim();
        var classification = classEl.value;

        if (!name) { Export.showToast('Please enter a variable name', 'error'); return; }

        varIdCounter++;
        classifiedVars.push({ id: varIdCounter, name: name, classification: classification });
        nameEl.value = '';
        renderVarTable();
    }

    function removeVariable(id) {
        classifiedVars = classifiedVars.filter(function(v) { return v.id !== id; });
        renderVarTable();
    }

    function clearVariables() {
        classifiedVars = [];
        varIdCounter = 0;
        renderVarTable();
        App.setTrustedHTML(document.getElementById('hb-analysis-plan'), '');
    }

    function renderVarTable() {
        var el = document.getElementById('hb-var-table');
        if (!el) return;

        if (classifiedVars.length === 0) {
            App.setTrustedHTML(el, '<div style="color:var(--text-tertiary);font-size:0.85rem;padding:12px">No variables added yet.</div>');
            return;
        }

        var classColors = { independent: 'var(--accent)', dependent: 'var(--success)', confounder: 'var(--warning)', mediator: 'var(--info)', moderator: '#a78bfa', precision: 'var(--text-tertiary)' };
        var classLabels = { independent: 'Independent (Exposure)', dependent: 'Dependent (Outcome)', confounder: 'Confounder', mediator: 'Mediator', moderator: 'Effect Modifier', precision: 'Precision Variable' };

        var html = '<table class="data-table mt-2"><thead><tr><th>Variable</th><th>Classification</th><th>Action</th></tr></thead><tbody>';
        classifiedVars.forEach(function(v) {
            html += '<tr><td>' + v.name + '</td>'
                + '<td><span style="color:' + classColors[v.classification] + ';font-weight:600">' + classLabels[v.classification] + '</span></td>'
                + '<td><button class="btn btn-xs btn-secondary" onclick="HypothesisBuilder.removeVariable(' + v.id + ')">Remove</button></td></tr>';
        });
        html += '</tbody></table>';
        App.setTrustedHTML(el, html);
    }

    function generateAnalysisPlan() {
        if (classifiedVars.length === 0) { Export.showToast('Please add variables first', 'error'); return; }

        var exposures = classifiedVars.filter(function(v) { return v.classification === 'independent'; });
        var outcomes = classifiedVars.filter(function(v) { return v.classification === 'dependent'; });
        var confounders = classifiedVars.filter(function(v) { return v.classification === 'confounder'; });
        var mediators = classifiedVars.filter(function(v) { return v.classification === 'mediator'; });
        var moderators = classifiedVars.filter(function(v) { return v.classification === 'moderator'; });
        var precision = classifiedVars.filter(function(v) { return v.classification === 'precision'; });

        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">Analysis Plan Outline</div>';

        html += '<div style="margin:8px 0;padding:12px;background:var(--surface);border-radius:8px">'
            + '<strong style="color:var(--text-secondary);font-size:0.85rem">Variable Summary:</strong>'
            + '<div style="font-size:0.85rem;color:var(--text-secondary);margin-top:4px">'
            + (exposures.length > 0 ? '<span style="color:var(--accent)">Exposures:</span> ' + exposures.map(function(v) { return v.name; }).join(', ') + '<br>' : '')
            + (outcomes.length > 0 ? '<span style="color:var(--success)">Outcomes:</span> ' + outcomes.map(function(v) { return v.name; }).join(', ') + '<br>' : '')
            + (confounders.length > 0 ? '<span style="color:var(--warning)">Confounders:</span> ' + confounders.map(function(v) { return v.name; }).join(', ') + '<br>' : '')
            + (mediators.length > 0 ? '<span style="color:var(--info)">Mediators:</span> ' + mediators.map(function(v) { return v.name; }).join(', ') + '<br>' : '')
            + (moderators.length > 0 ? '<span style="color:#a78bfa">Effect Modifiers:</span> ' + moderators.map(function(v) { return v.name; }).join(', ') + '<br>' : '')
            + (precision.length > 0 ? '<span style="color:var(--text-tertiary)">Precision Variables:</span> ' + precision.map(function(v) { return v.name; }).join(', ') : '')
            + '</div></div>';

        html += '<div class="card-title mt-2">Recommended Analysis Steps</div>';
        html += '<ol style="margin:0;padding-left:20px;color:var(--text-secondary);font-size:0.9rem;line-height:1.8">';
        html += '<li><strong>Descriptive analysis:</strong> Report baseline characteristics of all ' + classifiedVars.length + ' variables by exposure group.</li>';

        if (confounders.length > 0) {
            html += '<li><strong>Unadjusted analysis:</strong> Estimate the association between '
                + (exposures.length > 0 ? exposures[0].name : 'exposure') + ' and '
                + (outcomes.length > 0 ? outcomes[0].name : 'outcome') + ' without adjustment.</li>';
            html += '<li><strong>Adjusted analysis:</strong> Include confounders: '
                + confounders.map(function(v) { return v.name; }).join(', ')
                + '. EPV check: ' + confounders.length + ' confounders require at least '
                + (confounders.length * 10) + ' events (EPV=10).</li>';
        } else {
            html += '<li><strong>Primary analysis:</strong> Estimate the association between '
                + (exposures.length > 0 ? exposures[0].name : 'exposure') + ' and '
                + (outcomes.length > 0 ? outcomes[0].name : 'outcome') + '.</li>';
        }

        if (precision.length > 0) {
            html += '<li><strong>Precision variables:</strong> Include ' + precision.map(function(v) { return v.name; }).join(', ') + ' to improve precision.</li>';
        }
        if (moderators.length > 0) {
            html += '<li><strong>Effect modification:</strong> Test interactions with ' + moderators.map(function(v) { return v.name; }).join(', ') + '.</li>';
        }
        if (mediators.length > 0) {
            html += '<li><strong>Mediation analysis (optional):</strong> Formal mediation analysis for ' + mediators.map(function(v) { return v.name; }).join(', ') + '.</li>';
        }
        html += '<li><strong>Sensitivity analyses:</strong> Alternative adjustment sets, complete-case vs MI, E-value.</li>';
        html += '</ol>';

        // Warnings
        var warnings = [];
        if (mediators.length > 0 && confounders.length > 0) {
            warnings.push({ type: 'Mediator Adjustment', message: 'Do NOT include mediators (' + mediators.map(function(v) { return v.name; }).join(', ') + ') in primary model for total effect.', severity: 'danger' });
        }
        if (moderators.length > 0) {
            warnings.push({ type: 'Interaction Testing', message: 'Interaction tests require ~4x the sample size. Report as exploratory unless specifically powered.', severity: 'warning' });
        }
        var totalModelVars = confounders.length + precision.length + (moderators.length > 0 ? moderators.length + exposures.length : 0);
        if (totalModelVars > 15) {
            warnings.push({ type: 'Model Complexity', message: totalModelVars + ' variables require at least ' + (totalModelVars * 10) + ' events (EPV=10). Consider penalized regression.', severity: 'warning' });
        }
        if (outcomes.length > 1) {
            warnings.push({ type: 'Multiple Outcomes', message: outcomes.length + ' outcomes. Consider multiplicity adjustments or designate one primary.', severity: 'info' });
        }

        if (warnings.length > 0) {
            html += '<div class="card-title mt-2">Methodological Warnings</div>';
            warnings.forEach(function(w) {
                var colors = { danger: 'var(--danger)', warning: 'var(--warning)', info: 'var(--info)' };
                html += '<div style="padding:10px;background:var(--surface);border-left:3px solid ' + colors[w.severity] + ';border-radius:0 8px 8px 0;margin:6px 0">'
                    + '<strong style="color:' + colors[w.severity] + ';font-size:0.85rem">' + w.type + ':</strong><br>'
                    + '<span style="color:var(--text-secondary);font-size:0.85rem">' + w.message + '</span></div>';
            });
        }

        html += '<div class="btn-group mt-2"><button class="btn btn-xs btn-secondary" onclick="HypothesisBuilder.copyAnalysisPlan()">Copy Analysis Plan</button></div>';
        html += '</div>';

        App.setTrustedHTML(document.getElementById('hb-analysis-plan'), html);
    }

    function copyAnalysisPlan() {
        var exposures = classifiedVars.filter(function(v) { return v.classification === 'independent'; });
        var outcomes = classifiedVars.filter(function(v) { return v.classification === 'dependent'; });
        var confounders = classifiedVars.filter(function(v) { return v.classification === 'confounder'; });
        var text = 'Analysis Plan\nExposure(s): ' + exposures.map(function(v) { return v.name; }).join(', ')
            + '\nOutcome(s): ' + outcomes.map(function(v) { return v.name; }).join(', ')
            + '\nConfounders: ' + confounders.map(function(v) { return v.name; }).join(', ')
            + '\nMinimum events needed (EPV=10): ' + (confounders.length * 10);
        Export.copyText(text);
    }

    // ===== Specific Aims Page Generator =====
    function generateAimsPage() {
        var title = document.getElementById('hb-aim-title').value.trim();
        var opening = document.getElementById('hb-aim-opening').value.trim();
        var gap = document.getElementById('hb-aim-gap').value.trim();
        var ltg = document.getElementById('hb-aim-ltg').value.trim();
        var obj = document.getElementById('hb-aim-obj').value.trim();
        var hyp = document.getElementById('hb-aim-hyp').value.trim();
        var rationale = document.getElementById('hb-aim-rationale').value.trim();
        var payoff = document.getElementById('hb-aim-payoff').value.trim();

        if (!title) { Export.showToast('Please enter at least a project title', 'error'); return; }

        var html = '<div class="result-panel animate-in mt-2">';
        html += '<div class="card-title">SPECIFIC AIMS</div>';
        html += '<div style="font-weight:700;text-align:center;margin-bottom:16px;font-size:1.1rem">' + title + '</div>';

        if (opening) html += '<div style="font-size:0.9rem;line-height:1.7;color:var(--text-secondary);margin-bottom:12px">' + opening + '</div>';
        if (gap) html += '<div style="font-size:0.9rem;line-height:1.7;color:var(--text-secondary);margin-bottom:12px;font-style:italic">' + gap + '</div>';

        if (ltg || obj || hyp) {
            html += '<div style="font-size:0.9rem;line-height:1.7;color:var(--text-secondary);margin-bottom:12px">';
            if (ltg) html += 'The <strong>long-term goal</strong> is ' + ltg.toLowerCase() + '. ';
            if (obj) html += 'The <strong>objective</strong> of this application is ' + obj.toLowerCase() + '. ';
            if (hyp) html += 'Our <strong>central hypothesis</strong> is that ' + hyp.toLowerCase() + '. ';
            if (rationale) html += rationale;
            html += '</div>';
        }

        for (var i = 1; i <= 3; i++) {
            var stmt = document.getElementById('hb-aim' + i + '-stmt').value.trim();
            var aimHyp = document.getElementById('hb-aim' + i + '-hyp').value.trim();
            var approach = document.getElementById('hb-aim' + i + '-approach').value.trim();
            if (stmt) {
                html += '<div style="margin-bottom:12px;padding:12px;background:var(--surface);border-radius:8px;border-left:3px solid var(--accent)">'
                    + '<div style="font-weight:700;color:var(--accent);margin-bottom:4px">Aim ' + i + ': ' + stmt + '</div>';
                if (aimHyp) html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:4px"><strong>Hypothesis:</strong> ' + aimHyp + '</div>';
                if (approach) html += '<div style="font-size:0.85rem;color:var(--text-secondary)"><strong>Approach:</strong> ' + approach + '</div>';
                html += '</div>';
            }
        }

        if (payoff) {
            html += '<div style="font-size:0.9rem;line-height:1.7;color:var(--text-secondary);margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">'
                + '<strong>Expected Outcomes and Significance:</strong> ' + payoff + '</div>';
        }

        html += '</div>';
        App.setTrustedHTML(document.getElementById('hb-aims-output'), html);
    }

    function copyAimsPage() {
        var output = document.getElementById('hb-aims-output');
        if (output && output.textContent.trim()) {
            Export.copyText(output.textContent);
        } else {
            Export.showToast('Generate the aims page first', 'error');
        }
    }

    // ===== Checklist Score =====
    function updateChecklistScore() {
        var total = parseInt(document.getElementById('hb-checklist-total').value) || 12;
        var checked = 0;
        for (var i = 0; i < total; i++) {
            var ids = ['specific', 'measurable', 'falsifiable', 'feasible', 'novel', 'ethical', 'relevant', 'comparison', 'timeline', 'powered', 'preregistered', 'confounders'];
            if (i < ids.length) {
                var cb = document.getElementById('hb-chk-' + ids[i]);
                if (cb && cb.checked) checked++;
            }
        }

        var color = checked < 6 ? 'var(--danger)' : checked < 10 ? 'var(--warning)' : 'var(--success)';
        var label = checked < 6 ? 'Needs significant revision' : checked < 10 ? 'Good, but could be strengthened' : 'Well-formulated hypothesis';

        var html = '<div style="font-size:2rem;font-weight:700;color:' + color + '">' + checked + ' / ' + total + '</div>'
            + '<div style="font-size:0.85rem;color:' + color + '">' + label + '</div>';
        App.setTrustedHTML(document.getElementById('hb-checklist-score'), html);
    }

    // Register module
    App.registerModule(MODULE_ID, { render: render });

    // Expose functions globally for onclick handlers
    window.HypothesisBuilder = {
        switchTab: switchTab,
        updateFramework: updateFramework,
        generateHypothesis: generateHypothesis,
        copyPICO: copyPICO,
        generatePICOT: generatePICOT,
        loadPICOTExample: loadPICOTExample,
        showHypothesisType: showHypothesisType,
        generateResearchQuestions: generateResearchQuestions,
        showDesignTree: showDesignTree,
        addVariable: addVariable,
        removeVariable: removeVariable,
        clearVariables: clearVariables,
        generateAnalysisPlan: generateAnalysisPlan,
        copyAnalysisPlan: copyAnalysisPlan,
        generateAimsPage: generateAimsPage,
        copyAimsPage: copyAimsPage,
        updateChecklistScore: updateChecklistScore
    };
})();
