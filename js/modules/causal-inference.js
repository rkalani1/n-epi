/**
 * Neuro-Epi — Causal Inference Module
 * Interactive tools for causal reasoning in epidemiological research.
 * Bradford Hill criteria, DAG builder, counterfactual framework, methods comparison,
 * propensity score guide, instrumental variables, Mendelian randomization,
 * difference-in-differences, target trial emulation.
 */
(function () {
    'use strict';

    const MODULE_ID = 'causal-inference';

    // ================================================================
    // STATE
    // ================================================================
    var dagNodes = [];
    var dagEdges = [];
    var nodeIdCounter = 0;

    // ================================================================
    // RENDER
    // ================================================================
    function render(container) {
        var html = App.createModuleLayout(
            'Causal Inference',
            'Interactive tools for causal reasoning in epidemiological research. Assess Bradford Hill criteria, build DAGs, explore the counterfactual framework, and compare causal inference methods.'
        );

        // ===== LEARN SECTION =====
        html += '<div class="card" style="background: var(--bg-secondary); border-left: 4px solid var(--accent-color);">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\')">&#x1F4DA; Learn &amp; Reference <span style="font-size:0.8em; color: var(--text-muted);">(click to expand)</span></div>';
        html += '<div class="learn-body hidden">';

        html += '<div class="card-subtitle" style="font-weight:600;">Key Frameworks</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Bradford Hill criteria (1965):</strong> Nine viewpoints for assessing causation (strength, consistency, specificity, temporality, biological gradient, plausibility, coherence, experiment, analogy). These support arguments for association, not definitive proof of causation.</li>'
            + '<li><strong>Counterfactual / potential outcomes (Rubin):</strong> Defines causal effects as the contrast between what happened and what would have happened under an alternative treatment. Individual causal effects are unobservable; we estimate average effects.</li>'
            + '<li><strong>Directed Acyclic Graphs (Pearl, Greenland):</strong> Graphical tools to encode causal assumptions, identify confounders, mediators, and colliders, and determine the correct adjustment set for estimating causal effects.</li>'
            + '<li><strong>Structural Causal Models (Pearl):</strong> Formal mathematical framework that uses structural equations and DAGs together to define causal quantities (interventional and counterfactual) and derive identification results.</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Core Concepts</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Confounding:</strong> A common cause of both the exposure and the outcome that distorts the observed association. Must be controlled in design or analysis.</li>'
            + '<li><strong>Collider bias:</strong> Conditioning on (adjusting for) a common effect of two variables creates a spurious association between them. Do NOT adjust for colliders.</li>'
            + '<li><strong>Effect modification &ne; confounding:</strong> Effect modification (interaction) is a biological finding to be reported (stratum-specific estimates differ). Confounding is a nuisance to be removed (crude vs. adjusted estimates differ).</li>'
            + '<li><strong>Mediation:</strong> A variable on the causal pathway between exposure and outcome. Adjusting for mediators blocks the indirect effect.</li>'
            + '<li><strong>Selection bias:</strong> Occurs when the selection of subjects into the study (or the analysis) depends on both the exposure and the outcome, often equivalent to conditioning on a collider.</li>'
            + '<li><strong>Immortal time bias:</strong> A period of follow-up during which the outcome cannot occur. Misclassifying this time inflates the apparent benefit of treatment. Addressed by target trial emulation.</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Methods Overview</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Design phase:</strong> Randomization, restriction, matching</li>'
            + '<li><strong>Analysis phase:</strong> Stratification, multivariable regression, IP weighting, standardization</li>'
            + '<li><strong>Quasi-experimental:</strong> Instrumental variables, difference-in-differences, regression discontinuity, interrupted time series</li>'
            + '<li><strong>Advanced:</strong> Marginal structural models, g-estimation, target trial emulation, Mendelian randomization</li>'
            + '<li><strong>Propensity-based:</strong> Propensity score matching, stratification, IPTW, doubly robust estimation</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Causal Identification Strategies</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Backdoor criterion (Pearl):</strong> A set Z satisfies the backdoor criterion if (i) no node in Z is a descendant of treatment, and (ii) Z blocks every path between treatment and outcome that contains an arrow into treatment.</li>'
            + '<li><strong>Frontdoor criterion:</strong> When confounders are unmeasured but a mediator M fully mediates the effect of X on Y, and M is not directly confounded with Y given X.</li>'
            + '<li><strong>Instrumental variable identification:</strong> Exploits an exogenous source of variation that affects treatment but has no direct effect on the outcome.</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Target Trial Emulation Framework</div>';
        html += '<ul style="margin:0 0 12px 16px; font-size:0.9rem; line-height:1.7;">'
            + '<li><strong>Step 1:</strong> Specify the protocol of the target trial (eligibility, treatment strategies, assignment, follow-up start, outcomes, causal contrast, analysis plan).</li>'
            + '<li><strong>Step 2:</strong> Emulate each component using observational data.</li>'
            + '<li><strong>Step 3:</strong> Explicitly state which components can and cannot be emulated.</li>'
            + '<li><strong>Key benefit:</strong> Prevents immortal time bias, prevalent user bias, and other common pitfalls by forcing explicit alignment of observational analysis with trial logic.</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px; font-size:0.85rem; line-height:1.7;">'
            + '<li>Hern&aacute;n MA, Robins JM. <em>Causal Inference: What If</em>. Chapman &amp; Hall/CRC, 2020.</li>'
            + '<li>Pearl J. <em>Causality: Models, Reasoning, and Inference</em>, 2nd ed. Cambridge University Press, 2009.</li>'
            + '<li>VanderWeele TJ. <em>Explanation in Causal Inference: Methods for Mediation and Interaction</em>. Oxford University Press, 2015.</li>'
            + '<li>Hern&aacute;n MA, Robins JM. Using Big Data to Emulate a Target Trial When a Randomized Trial Is Not Available. Am J Epidemiol. 2016;183(8):758-764.</li>'
            + '<li>Davey Smith G, Hemani G. Mendelian randomization: genetic anchors for causal inference in epidemiological studies. Hum Mol Genet. 2014;23(R1):R89-R98.</li>'
            + '<li>Rosenbaum PR, Rubin DB. The central role of the propensity score in observational studies for causal effects. Biometrika. 1983;70(1):41-55.</li>'
            + '</ul>';

        html += '</div></div>';

        // ===== CARD 1: Bradford Hill Criteria =====
        html += renderBradfordHill();

        // ===== CARD 2: Interactive DAG Builder (Canvas) =====
        html += renderDAGBuilder();

        // ===== CARD 3: Counterfactual Framework =====
        html += renderCounterfactual();

        // ===== CARD 4: Causal Methods Comparison =====
        html += renderMethodsComparison();

        // ===== CARD 5: Propensity Score Guide =====
        html += renderPropensityScoreGuide();

        // ===== CARD 6: Instrumental Variables & MR =====
        html += renderIVandMR();

        // ===== CARD 7: Difference-in-Differences =====
        html += renderDiD();

        // ===== CARD 8: Target Trial Emulation =====
        html += renderTargetTrial();

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }

    // ================================================================
    // CARD 1: Bradford Hill Criteria Assessment
    // ================================================================
    function renderBradfordHill() {
        var criteria = [
            {
                id: 'strength',
                name: 'Strength of Association',
                desc: 'A large effect size increases confidence in a causal relationship.',
                input: 'Effect size (e.g., OR, RR, HR)'
            },
            {
                id: 'consistency',
                name: 'Consistency',
                desc: 'The association has been observed repeatedly in different populations, settings, and times.',
                input: 'Number of studies showing the association'
            },
            {
                id: 'specificity',
                name: 'Specificity',
                desc: 'The exposure is specifically associated with the outcome (not multiple unrelated outcomes).',
                input: 'Notes on specificity of association'
            },
            {
                id: 'temporality',
                name: 'Temporality',
                desc: 'The exposure precedes the outcome in time. This is the only criterion considered essential.',
                input: 'Evidence for temporal sequence'
            },
            {
                id: 'gradient',
                name: 'Biological Gradient (Dose-Response)',
                desc: 'Greater exposure leads to a greater effect (or a defined threshold pattern).',
                input: 'Evidence for dose-response relationship'
            },
            {
                id: 'plausibility',
                name: 'Plausibility',
                desc: 'A biologically plausible mechanism exists linking exposure to outcome.',
                input: 'Proposed biological mechanism'
            },
            {
                id: 'coherence',
                name: 'Coherence',
                desc: 'The association is consistent with existing knowledge of the disease/biology.',
                input: 'Coherence with known biology'
            },
            {
                id: 'experiment',
                name: 'Experiment',
                desc: 'Evidence from interventional studies (RCTs, natural experiments) supports the association.',
                input: 'Experimental/interventional evidence'
            },
            {
                id: 'analogy',
                name: 'Analogy',
                desc: 'Similar exposures cause similar outcomes (e.g., if drug A causes defects, drug B might too).',
                input: 'Analogous relationships'
            }
        ];

        var html = '<div class="card">';
        html += '<div class="card-title">Bradford Hill Criteria Assessment</div>';
        html += '<div class="card-subtitle">Evaluate the 9 Bradford Hill criteria to assess the likelihood of a causal relationship. '
            + 'Rate each criterion and provide supporting notes.</div>';

        html += '<div style="background:var(--bg-tertiary);border-radius:8px;padding:12px;margin-bottom:16px;font-size:0.85rem;color:var(--text-secondary);">'
            + '<strong>Important:</strong> The Bradford Hill criteria (1965) are guidelines for assessing causation, not a rigid checklist. '
            + 'Not all criteria need to be met for a causal inference, and meeting all criteria does not guarantee causation. '
            + 'Temporality is the only criterion widely considered necessary. Modern epidemiology emphasizes the counterfactual framework '
            + 'and DAG-based reasoning alongside these considerations (Rothman & Greenland, 2005).'
            + '</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Exposure</label>'
            + '<input type="text" class="form-input" id="bh-exposure" name="bh-exposure" placeholder="e.g., Cigarette smoking"></div>'
            + '<div class="form-group"><label class="form-label">Outcome</label>'
            + '<input type="text" class="form-input" id="bh-outcome" name="bh-outcome" placeholder="e.g., Lung cancer"></div>'
            + '</div>';

        for (var i = 0; i < criteria.length; i++) {
            var c = criteria[i];
            html += '<div style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:12px;">';
            html += '<div style="font-weight:600;margin-bottom:4px;">' + (i + 1) + '. ' + c.name + '</div>';
            html += '<div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">' + c.desc + '</div>';

            html += '<div class="form-row form-row--2">';
            html += '<div class="form-group"><label class="form-label">Rating</label>';
            html += '<div class="radio-group">';
            var options = ['Strong', 'Moderate', 'Weak', 'Not assessed'];
            for (var j = 0; j < options.length; j++) {
                html += '<label class="radio-pill"><input type="radio" name="bh-' + c.id + '" value="' + options[j] + '">' + options[j] + '</label>';
            }
            html += '</div></div>';

            html += '<div class="form-group"><label class="form-label">' + c.input + '</label>'
                + '<input type="text" class="form-input" id="bh-note-' + c.id + '" name="bh-note-' + c.id + '" placeholder="Supporting evidence or notes"></div>';
            html += '</div>';
            html += '</div>';
        }

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="CausalInference.assessBH()">Assess</button>'
            + '<button class="btn btn-secondary" onclick="CausalInference.exportBH()">Export Assessment</button>'
            + '<button class="btn btn-secondary" onclick="CausalInference.resetBH()">Reset</button>'
            + '</div>';

        html += '<div id="bh-results"></div>';
        html += '</div>';

        return html;
    }

    function assessBH() {
        var exposure = document.getElementById('bh-exposure').value || '[Exposure]';
        var outcome = document.getElementById('bh-outcome').value || '[Outcome]';

        var criteriaNames = ['strength', 'consistency', 'specificity', 'temporality',
            'gradient', 'plausibility', 'coherence', 'experiment', 'analogy'];
        var criteriaLabels = ['Strength', 'Consistency', 'Specificity', 'Temporality',
            'Biological Gradient', 'Plausibility', 'Coherence', 'Experiment', 'Analogy'];

        var strong = 0, moderate = 0, weak = 0, notAssessed = 0;
        var details = [];

        for (var i = 0; i < criteriaNames.length; i++) {
            var radios = document.querySelectorAll('input[name="bh-' + criteriaNames[i] + '"]');
            var selected = '';
            for (var j = 0; j < radios.length; j++) {
                if (radios[j].checked) { selected = radios[j].value; break; }
            }
            var note = document.getElementById('bh-note-' + criteriaNames[i]).value || '';

            if (selected === 'Strong') strong++;
            else if (selected === 'Moderate') moderate++;
            else if (selected === 'Weak') weak++;
            else notAssessed++;

            details.push({
                name: criteriaLabels[i],
                rating: selected || 'Not assessed',
                note: note
            });
        }

        var assessed = 9 - notAssessed;
        var met = strong + moderate;

        var overallText = '';
        if (assessed === 0) {
            overallText = 'No criteria have been assessed yet.';
        } else if (strong >= 6) {
            overallText = 'Strong support for a causal relationship between ' + exposure + ' and ' + outcome + '. '
                + 'Multiple Bradford Hill criteria are rated as strong.';
        } else if (met >= 5) {
            overallText = 'Moderate-to-strong support for a causal relationship between ' + exposure + ' and ' + outcome + '. '
                + 'A majority of assessed criteria are met at strong or moderate levels.';
        } else if (met >= 3) {
            overallText = 'Moderate support for a causal relationship between ' + exposure + ' and ' + outcome + '. '
                + 'Some criteria are met, but gaps remain.';
        } else {
            overallText = 'Limited support for a causal relationship between ' + exposure + ' and ' + outcome + '. '
                + 'Few Bradford Hill criteria are met at a strong or moderate level.';
        }

        // Check temporality specifically
        var tempRadios = document.querySelectorAll('input[name="bh-temporality"]');
        var tempRating = '';
        for (var k = 0; k < tempRadios.length; k++) {
            if (tempRadios[k].checked) { tempRating = tempRadios[k].value; break; }
        }
        if (tempRating === 'Weak' || tempRating === 'Not assessed') {
            overallText += ' Note: Temporality is weak or unassessed. Temporality is widely considered the most essential criterion.';
        }

        var html = '<div class="result-panel mt-2">';
        html += '<div class="card-title">Assessment Summary: ' + exposure + ' and ' + outcome + '</div>';
        html += '<div class="form-row form-row--4">';
        html += '<div class="result-value" style="color:var(--success);">' + strong + '<div class="result-label">Strong</div></div>';
        html += '<div class="result-value" style="color:var(--warning);">' + moderate + '<div class="result-label">Moderate</div></div>';
        html += '<div class="result-value" style="color:var(--danger);">' + weak + '<div class="result-label">Weak</div></div>';
        html += '<div class="result-value" style="color:var(--text-tertiary);">' + notAssessed + '<div class="result-label">Not Assessed</div></div>';
        html += '</div>';
        html += '<div class="result-detail mt-1">' + overallText + '</div>';

        // Detail table
        html += '<div class="table-container mt-2">';
        html += '<table class="data-table"><thead><tr><th>Criterion</th><th>Rating</th><th>Notes</th></tr></thead><tbody>';
        for (var d = 0; d < details.length; d++) {
            var color = details[d].rating === 'Strong' ? 'var(--success)' :
                details[d].rating === 'Moderate' ? 'var(--warning)' :
                    details[d].rating === 'Weak' ? 'var(--danger)' : 'var(--text-tertiary)';
            html += '<tr><td>' + details[d].name + '</td>'
                + '<td style="color:' + color + ';font-weight:600;">' + details[d].rating + '</td>'
                + '<td>' + (details[d].note || '-') + '</td></tr>';
        }
        html += '</tbody></table></div>';

        html += '<div style="margin-top:12px;font-size:0.8rem;color:var(--text-tertiary);">'
            + 'Reference: Hill AB. The Environment and Disease: Association or Causation? Proc R Soc Med. 1965;58:295-300. '
            + 'See also: Rothman KJ, Greenland S. Causation and causal inference in epidemiology. Am J Public Health. 2005;95(S1):S144-S150.'
            + '</div>';

        html += '</div>';

        App.setTrustedHTML(document.getElementById('bh-results'), html);
    }

    function exportBH() {
        var exposure = document.getElementById('bh-exposure').value || '[Exposure]';
        var outcome = document.getElementById('bh-outcome').value || '[Outcome]';
        var criteriaNames = ['strength', 'consistency', 'specificity', 'temporality',
            'gradient', 'plausibility', 'coherence', 'experiment', 'analogy'];
        var criteriaLabels = ['Strength', 'Consistency', 'Specificity', 'Temporality',
            'Biological Gradient', 'Plausibility', 'Coherence', 'Experiment', 'Analogy'];

        var lines = ['Bradford Hill Criteria Assessment', '===', 'Exposure: ' + exposure, 'Outcome: ' + outcome, ''];
        for (var i = 0; i < criteriaNames.length; i++) {
            var radios = document.querySelectorAll('input[name="bh-' + criteriaNames[i] + '"]');
            var selected = 'Not assessed';
            for (var j = 0; j < radios.length; j++) {
                if (radios[j].checked) { selected = radios[j].value; break; }
            }
            var note = document.getElementById('bh-note-' + criteriaNames[i]).value || '';
            lines.push((i + 1) + '. ' + criteriaLabels[i] + ': ' + selected + (note ? ' (' + note + ')' : ''));
        }
        Export.copyText(lines.join('\n'));
    }

    function resetBH() {
        var criteriaNames = ['strength', 'consistency', 'specificity', 'temporality',
            'gradient', 'plausibility', 'coherence', 'experiment', 'analogy'];
        for (var i = 0; i < criteriaNames.length; i++) {
            var radios = document.querySelectorAll('input[name="bh-' + criteriaNames[i] + '"]');
            for (var j = 0; j < radios.length; j++) { radios[j].checked = false; }
            document.getElementById('bh-note-' + criteriaNames[i]).value = '';
        }
        document.getElementById('bh-exposure').value = '';
        document.getElementById('bh-outcome').value = '';
        App.setTrustedHTML(document.getElementById('bh-results'), '');
    }

    // ================================================================
    // CARD 2: DAG Builder (Text-Based) with Node Types
    // ================================================================
    // ================================================================
    // CARD 2: DAG Builder (Canvas-Based)
    // ================================================================
    function renderDAGBuilder() {
        var html = '<div class="card">';
        html += '<div class="card-title">Interactive DAG Builder</div>';
        html += '<div class="card-subtitle">Visually construct a directed acyclic graph to identify confounding, mediation, and collider bias. Define variables as exposure, outcome, confounder, etc.</div>';

        // Add Node Form
        html += '<div style="background:var(--bg-secondary);padding:1rem;border-radius:8px;margin-bottom:1rem;border:1px solid var(--border);">';
        html += '<div style="font-weight:600;margin-bottom:0.8rem;font-size:0.9rem;">1. Add Variables</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Variable Name</label>'
            + '<input type="text" class="form-input" id="ci-node-name" placeholder="e.g., Smoking"></div>';
        html += '<div class="form-group"><label class="form-label">Role</label>'
            + '<select class="form-select" id="ci-node-type">'
            + '<option value="exposure">Exposure (E)</option>'
            + '<option value="outcome">Outcome (D)</option>'
            + '<option value="confounder">Confounder (C)</option>'
            + '<option value="mediator">Mediator (M)</option>'
            + '<option value="collider">Collider (S)</option>'
            + '<option value="unmeasured">Unmeasured Confounder</option>'
            + '</select></div>';
        html += '<div class="form-group" style="display:flex;align-items:flex-end;">'
            + '<button class="btn btn-primary w-100" onclick="CausalInference.addNode()">Add Node</button></div>';
        html += '</div>';
        html += '</div>';

        // Add Edge Form
        html += '<div style="background:var(--bg-secondary);padding:1rem;border-radius:8px;margin-bottom:1rem;border:1px solid var(--border);">';
        html += '<div style="font-weight:600;margin-bottom:0.8rem;font-size:0.9rem;">2. Add Causal Paths</div>';
        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Source (From)</label>'
            + '<select class="form-select" id="ci-edge-from"></select></div>';
        html += '<div class="form-group" style="display:flex;align-items:center;justify-content:center;padding-top:20px;font-weight:bold;font-size:1.5rem;">&rarr;</div>';
        html += '<div class="form-group"><label class="form-label">Target (To)</label>'
            + '<select class="form-select" id="ci-edge-to"></select></div>';
        html += '</div>';
        html += '<div class="btn-group mt-1">'
            + '<button class="btn btn-secondary btn-xs" onclick="CausalInference.addEdge()">Add Edge</button>'
            + '</div>';
        html += '</div>';

        // Canvas Area
        html += '<div id="ci-dag-container" style="background:var(--card-bg);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:12px;position:relative;height:400px;">'
            + '<canvas id="ci-dag-canvas" width="700" height="400" style="width:100%;height:100%;cursor:crosshair;"></canvas>'
            + '</div>';

        // Actions
        html += '<div class="btn-group">'
            + '<button class="btn btn-secondary" onclick="CausalInference.loadExampleDAG()">Load Example</button>'
            + '<button class="btn btn-secondary" onclick="CausalInference.clearDAG()">Clear All</button>'
            + '</div>';

        // Analysis Info
        html += '<div id="ci-dag-info" class="mt-2"></div>';

        // Quick Templates
        html += '<div class="card-subtitle mt-2">Causal Structure Templates</div>';
        html += '<div class="btn-group">';
        html += '<button class="btn btn-xs btn-secondary" onclick="CausalInference.loadTemplate(\'confounding\')">Confounding</button>';
        html += '<button class="btn btn-xs btn-secondary" onclick="CausalInference.loadTemplate(\'mediation\')">Mediation</button>';
        html += '<button class="btn btn-xs btn-secondary" onclick="CausalInference.loadTemplate(\'collider\')">Collider Bias</button>';
        html += '<button class="btn btn-xs btn-secondary" onclick="CausalInference.loadTemplate(\'iv\')">Instrumental Variable</button>';
        html += '<button class="btn btn-xs btn-secondary" onclick="CausalInference.loadTemplate(\'mbias\')">M-Bias</button>';
        html += '</div>';

        html += '</div>';

        return html;
    }

    function addNode() {
        var nameEl = document.getElementById('ci-node-name');
        var typeEl = document.getElementById('ci-node-type');
        var name = nameEl.value.trim();
        var type = typeEl.value;

        if (!name) { Export.showToast('Enter a variable name', 'error'); return; }
        if (dagNodes.some(n => n.label === name)) { Export.showToast('Variable already exists', 'error'); return; }

        nodeIdCounter++;
        var id = 'n' + nodeIdCounter;

        // Auto-position based on type
        var positions = {
            exposure: { x: 100, y: 200 },
            outcome: { x: 600, y: 200 },
            confounder: { x: 350, y: 60 },
            mediator: { x: 350, y: 200 },
            collider: { x: 350, y: 340 },
            unmeasured: { x: 350, y: 130 }
        };
        var basePos = positions[type] || { x: 350, y: 200 };
        var count = dagNodes.filter(n => n.type === type).length;
        var x = basePos.x + (count % 3) * 120;
        var y = basePos.y + Math.floor(count / 3) * 50;

        dagNodes.push({ id: id, label: name, type: type, x: x, y: y });
        nameEl.value = '';
        updateEdgeDropdowns();
        renderDAG();
    }

    function addEdge() {
        var fromId = document.getElementById('ci-edge-from').value;
        var toId = document.getElementById('ci-edge-to').value;

        if (!fromId || !toId) { Export.showToast('Select from and to nodes', 'error'); return; }
        if (fromId === toId) { Export.showToast('Cannot link node to itself', 'error'); return; }
        if (dagEdges.some(e => e.from === fromId && e.to === toId)) { Export.showToast('Edge already exists', 'error'); return; }

        dagEdges.push({ from: fromId, to: toId });
        renderDAG();
    }

    function updateEdgeDropdowns() {
        var fromEl = document.getElementById('ci-edge-from');
        var toEl = document.getElementById('ci-edge-to');
        if (!fromEl || !toEl) return;

        var html = '<option value="">-- Select --</option>';
        dagNodes.forEach(n => {
            html += '<option value="' + n.id + '">' + n.label + '</option>';
        });
        App.setTrustedHTML(fromEl, html);
        App.setTrustedHTML(toEl, html);
    }

    function renderDAG() {
        var canvas = document.getElementById('ci-dag-canvas');
        if (!canvas) return;

        Charts.DAGDiagram(canvas, {
            nodes: dagNodes,
            edges: dagEdges,
            width: 700,
            height: 400
        });

        analyzeDAG_New();
    }

    function analyzeDAG_New() {
        var infoEl = document.getElementById('ci-dag-info');
        if (!infoEl || dagNodes.length === 0) return;

        var exposures = dagNodes.filter(n => n.type === 'exposure').map(n => n.label);
        var outcomes = dagNodes.filter(n => n.type === 'outcome').map(n => n.label);
        var confounders = dagNodes.filter(n => n.type === 'confounder' || n.type === 'unmeasured').map(n => n.label);
        var mediators = dagNodes.filter(n => n.type === 'mediator').map(n => n.label);
        var colliders = dagNodes.filter(n => n.type === 'collider').map(n => n.label);

        var html = '<div class="result-panel animate-in mt-1">';
        html += '<div class="card-title">Causal Structure Analysis</div>';

        if (exposures.length && outcomes.length) {
            html += '<p style="font-size:0.9rem;"><strong>Path:</strong> ' + exposures.join(', ') + ' &rarr; ' + outcomes.join(', ') + '</p>';
        }

        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:0.5rem;font-size:0.85rem;">';

        // Adjustment set
        html += '<div>';
        html += '<div style="font-weight:600;color:var(--success);">Adjust For (Confounders):</div>';
        html += '<ul>' + (confounders.length ? confounders.map(c => '<li>' + c + '</li>').join('') : '<li>No confounders identified</li>') + '</ul>';
        html += '</div>';

        // Forbidden set
        html += '<div>';
        html += '<div style="font-weight:600;color:var(--danger);">Do NOT Adjust For:</div>';
        html += '<ul>';
        if (mediators.length) html += '<li title="Adjusting for mediators blocks the causal path">Mediators: ' + mediators.join(', ') + '</li>';
        if (colliders.length) html += '<li title="Adjusting for colliders introduces selection bias">Colliders: ' + colliders.join(', ') + '</li>';
        if (!mediators.length && !colliders.length) html += '<li>None identified</li>';
        html += '</ul>';
        html += '</div>';

        html += '</div>';

        // AI Insight
        var insight = '';
        if (colliders.length > 0) insight = '<strong>Warning:</strong> Collider bias detected. Adjusting for ' + colliders[0] + ' will open a non-causal path between exposure and outcome.';
        else if (confounders.length > 0) insight = 'To estimate the total effect, you should perform multivariable adjustment or use propensity score methods for ' + confounders.join(', ') + '.';
        else if (mediators.length > 0) insight = 'Adjusting for ' + mediators[0] + ' will allow you to estimate the Direct Effect, but will bias the Total Effect estimate.';

        if (insight) html += '<div class="result-detail mt-1" style="border-top:1px solid var(--border);padding-top:0.5rem;">' + insight + '</div>';

        html += '</div>';
        App.setTrustedHTML(infoEl, html);
    }

    function clearDAG() {
        dagNodes = [];
        dagEdges = [];
        nodeIdCounter = 0;
        updateEdgeDropdowns();
        renderDAG();
        App.setTrustedHTML(document.getElementById('ci-dag-info'), '');
    }

    function loadExampleDAG() {
        dagNodes = [
            { id: 'n1', label: 'Lipids', type: 'exposure', x: 100, y: 200 },
            { id: 'n2', label: 'Stroke', type: 'outcome', x: 600, y: 200 },
            { id: 'n3', label: 'Age', type: 'confounder', x: 350, y: 60 },
            { id: 'n4', label: 'Statin Use', type: 'mediator', x: 350, y: 200 },
            { id: 'n5', label: 'Side Effects', type: 'collider', x: 350, y: 340 }
        ];
        dagEdges = [
            { from: 'n1', to: 'n2' },
            { from: 'n3', to: 'n1' },
            { from: 'n3', to: 'n2' },
            { from: 'n1', to: 'n4' },
            { from: 'n4', to: 'n2' },
            { from: 'n1', to: 'n5' },
            { from: 'n2', to: 'n5' }
        ];
        nodeIdCounter = 5;
        updateEdgeDropdowns();
        renderDAG();
    }

    function loadTemplate(type) {
        clearDAG();
        if (type === 'confounding') {
            dagNodes = [
                { id: 'n1', label: 'Exposure', type: 'exposure', x: 100, y: 200 },
                { id: 'n2', label: 'Outcome', type: 'outcome', x: 600, y: 200 },
                { id: 'n3', label: 'Confounder', type: 'confounder', x: 350, y: 60 }
            ];
            dagEdges = [{ from: 'n1', to: 'n2' }, { from: 'n3', to: 'n1' }, { from: 'n3', to: 'n2' }];
            nodeIdCounter = 3;
        } else if (type === 'mediation') {
            dagNodes = [
                { id: 'n1', label: 'Exposure', type: 'exposure', x: 100, y: 200 },
                { id: 'n2', label: 'Outcome', type: 'outcome', x: 600, y: 200 },
                { id: 'n3', label: 'Mediator', type: 'mediator', x: 350, y: 200 }
            ];
            dagEdges = [{ from: 'n1', to: 'n3' }, { from: 'n3', to: 'n2' }, { from: 'n1', to: 'n2' }];
            nodeIdCounter = 3;
        } else if (type === 'collider') {
            dagNodes = [
                { id: 'n1', label: 'Exposure', type: 'exposure', x: 100, y: 200 },
                { id: 'n2', label: 'Outcome', type: 'outcome', x: 600, y: 200 },
                { id: 'n3', label: 'Collider', type: 'collider', x: 350, y: 340 }
            ];
            dagEdges = [{ from: 'n1', to: 'n3' }, { from: 'n2', to: 'n3' }];
            nodeIdCounter = 3;
        } else if (type === 'iv') {
            dagNodes = [
                { id: 'n1', label: 'Instrument', type: 'exposure', x: 100, y: 200 },
                { id: 'n2', label: 'Exposure', type: 'mediator', x: 300, y: 200 },
                { id: 'n3', label: 'Outcome', type: 'outcome', x: 600, y: 200 },
                { id: 'n4', label: 'Unmeasured C', type: 'unmeasured', x: 450, y: 60 }
            ];
            dagEdges = [
                { from: 'n1', to: 'n2' }, { from: 'n2', to: 'n3' },
                { from: 'n4', to: 'n2' }, { from: 'n4', to: 'n3' }
            ];
            nodeIdCounter = 4;
        } else if (type === 'mbias') {
            dagNodes = [
                { id: 'n1', label: 'Exposure', type: 'exposure', x: 100, y: 200 },
                { id: 'n2', label: 'Outcome', type: 'outcome', x: 600, y: 200 },
                { id: 'n3', label: 'U1', type: 'unmeasured', x: 100, y: 60 },
                { id: 'n4', label: 'U2', type: 'unmeasured', x: 600, y: 60 },
                { id: 'n5', label: 'Collider M', type: 'collider', x: 350, y: 60 }
            ];
            dagEdges = [
                { from: 'n3', to: 'n1' }, { from: 'n3', to: 'n5' },
                { from: 'n4', to: 'n2' }, { from: 'n4', to: 'n5' },
                { from: 'n1', to: 'n2' }
            ];
            nodeIdCounter = 5;
        }
        updateEdgeDropdowns();
        renderDAG();
    }
    function exportDAG() {
        var lines = ['Directed Acyclic Graph (DAG)', '===', 'Nodes:'];
        dagNodes.forEach(n => lines.push('- ' + n.label + ' (' + n.type + ')'));
        lines.push('', 'Edges:');
        dagEdges.forEach(e => {
            var f = dagNodes.find(n => n.id === e.from);
            var t = dagNodes.find(n => n.id === e.to);
            if (f && t) lines.push('- ' + f.label + ' -> ' + t.label);
        });
        Export.copyText(lines.join('\n'));
    }

    // ================================================================
    // CARD 3: Counterfactual Framework Reference
    // ================================================================
    function renderCounterfactual() {
        var html = '<div class="card">';
        html += '<div class="card-title">Counterfactual Framework Reference</div>';
        html += '<div class="card-subtitle">Educational reference for the potential outcomes framework and key assumptions for causal inference.</div>';

        // Potential Outcomes
        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:700;font-size:1.05rem;margin-bottom:8px;">Potential Outcomes Framework (Rubin Causal Model)</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">'
            + '<p>For each individual <em>i</em>, we define two <strong>potential outcomes</strong>:</p>'
            + '<ul style="margin:8px 0 8px 20px;">'
            + '<li><strong>Y<sub>i</sub>(1)</strong> &mdash; The outcome if individual <em>i</em> receives treatment (exposed)</li>'
            + '<li><strong>Y<sub>i</sub>(0)</strong> &mdash; The outcome if individual <em>i</em> does not receive treatment (unexposed)</li>'
            + '</ul>'
            + '<p>The <strong>individual causal effect</strong> is: Y<sub>i</sub>(1) &minus; Y<sub>i</sub>(0)</p>'
            + '<p style="margin-top:8px;">This framework was formalized by Donald Rubin (1974) building on Neyman (1923). '
            + 'It provides a precise mathematical definition of a causal effect independent of statistical models.</p>'
            + '</div></div>';

        // Fundamental Problem
        html += '<div style="border-left:4px solid var(--danger);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:700;font-size:1.05rem;margin-bottom:8px;">Fundamental Problem of Causal Inference</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">'
            + '<p>We can <strong>never observe both</strong> potential outcomes for the same individual at the same time. '
            + 'Each person is either exposed or unexposed &mdash; we observe one potential outcome and the other is <strong>counterfactual</strong> (contrary to fact).</p>'
            + '<p style="margin-top:8px;">This is why causal inference requires assumptions to bridge from what we observe to what we want to estimate. '
            + 'Individual causal effects are generally not identifiable; we focus instead on <strong>average causal effects</strong>.</p>'
            + '</div></div>';

        // ATE, ATT, ATU
        html += '<div style="border-left:4px solid var(--success);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:700;font-size:1.05rem;margin-bottom:8px;">Average Treatment Effects</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">';
        html += '<div class="table-container"><table class="data-table">';
        html += '<thead><tr><th>Measure</th><th>Definition</th><th>Formula</th><th>Interpretation</th></tr></thead>';
        html += '<tbody>';
        html += '<tr><td><strong>ATE</strong><br>Average Treatment Effect</td>'
            + '<td>Average causal effect across the entire population</td>'
            + '<td>E[Y(1) &minus; Y(0)]</td>'
            + '<td>Expected difference in outcome if everyone was treated vs. no one treated</td></tr>';
        html += '<tr><td><strong>ATT</strong><br>Average Treatment Effect on the Treated</td>'
            + '<td>Average effect among those who actually received treatment</td>'
            + '<td>E[Y(1) &minus; Y(0) | A=1]</td>'
            + '<td>Effect of treatment among those selected for treatment</td></tr>';
        html += '<tr><td><strong>ATU</strong><br>Average Treatment Effect on the Untreated</td>'
            + '<td>Average effect among those who did not receive treatment</td>'
            + '<td>E[Y(1) &minus; Y(0) | A=0]</td>'
            + '<td>What would have happened to the untreated if they had been treated</td></tr>';
        html += '</tbody></table></div>';
        html += '</div></div>';

        // Identifiability Conditions
        html += '<div style="border-left:4px solid var(--primary);padding:12px 16px;margin-bottom:16px;background:var(--bg-tertiary);border-radius:0 8px 8px 0;">';
        html += '<div style="font-weight:700;font-size:1.05rem;margin-bottom:8px;">Identifiability Conditions</div>';
        html += '<div style="font-size:0.9rem;line-height:1.7;">';
        html += '<p>Three assumptions are required to identify causal effects from observational data:</p>';
        html += '<div style="margin:12px 0;padding:12px;background:var(--bg-secondary);border-radius:8px;">'
            + '<div style="font-weight:600;">1. Exchangeability (No Unmeasured Confounding)</div>'
            + '<div style="margin-top:4px;">Conditional on measured covariates L, the treatment groups are comparable.</div>'
            + '</div>';
        html += '<div style="margin:12px 0;padding:12px;background:var(--bg-secondary);border-radius:8px;">'
            + '<div style="font-weight:600;">2. Positivity</div>'
            + '<div style="margin-top:4px;">Within every stratum of covariates, there is a non-zero probability of receiving each treatment.</div>'
            + '</div>';
        html += '<div style="margin:12px 0;padding:12px;background:var(--bg-secondary);border-radius:8px;">'
            + '<div style="font-weight:600;">3. Consistency</div>'
            + '<div style="margin-top:4px;">The observed outcome under the treatment received equals the potential outcome under that treatment.</div>'
            + '</div></div></div>';

        html += '<div class="card-subtitle mt-2">Counterfactual Simulator</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Outcome if UNTREATED (Y&#8320;)</label>'
            + '<input type="number" class="form-input" id="cf-y0" step="0.01" value="0.15"></div>';
        html += '<div class="form-group"><label class="form-label">Outcome if TREATED (Y&#8321;)</label>'
            + '<input type="number" class="form-input" id="cf-y1" step="0.01" value="0.10"></div>';
        html += '</div>';
        html += '<button class="btn btn-primary w-100" onclick="CausalInference.calcCounterfactual()">Run Simulation</button>';
        html += '<div id="cf-results" class="mt-2"></div>';

        html += '<div style="font-size:0.8rem;color:var(--text-tertiary);margin-top:8px;">'
            + 'References: Rubin DB. J Educ Psychol. 1974;66(5):688-701. '
            + 'Hernan MA, Robins JM. Causal Inference: What If. 2020.</div>';

        html += '</div>';
        return html;
    }

    function calcCounterfactual() {
        var y0 = parseFloat(document.getElementById('cf-y0').value);
        var y1 = parseFloat(document.getElementById('cf-y1').value);
        if (isNaN(y0) || isNaN(y1)) return;
        var ace = y1 - y0;
        var html = '<div class="result-panel animate-in">';
        html += '<div style="font-size:0.9rem;color:var(--text-secondary);">Average Causal Effect (ACE)</div>';
        html += '<div style="font-size:1.8rem;font-weight:700;color:' + (ace < 0 ? 'var(--success)' : 'var(--danger)') + '">' + (ace * 100).toFixed(1) + '%</div>';
        html += '</div>';
        App.setTrustedHTML(document.getElementById('cf-results'), html);
    }

    // ================================================================
    // CARD 4: Causal Inference Methods Comparison
    // ================================================================
    function renderMethodsComparison() {
        var methods = [
            { name: 'Propensity Score Matching', assumptions: 'Conditional exchangeability; positivity.', strengths: 'Intuitive; balances measured covariates.', when: 'Many measured confounders; clinical comparison.', reference: 'Rosenbaum & Rubin, 1983' },
            { name: 'Inverse Probability Weighting', assumptions: 'Conditional exchangeability; positivity.', strengths: 'Uses all subjects; handles time-varying treatments.', when: 'Marginal structural models.', reference: 'Robins et al., 2000' },
            { name: 'Instrumental Variables', assumptions: 'Relevance; Independence; Exclusion restriction.', strengths: 'Handles unmeasured confounding.', when: 'Strong instrument available.', reference: 'Angrist et al., 1996' },
            { name: 'Difference-in-Differences', assumptions: 'Parallel trends; no anticipation.', strengths: 'Controls for time-invariant unmeasured confounding.', when: 'Policy evaluation with pre/post control group.', reference: 'Angrist & Pischke, 2009' }
        ];

        var html = '<div class="card">';
        html += '<div class="card-title">Causal Inference Methods Comparison</div>';
        html += '<div class="card-subtitle">Comparison of common methods for identifying causal effects.</div>';
        html += '<div class="table-container"><table class="data-table"><thead><tr><th>Method</th><th>Assumptions</th><th>Strengths</th><th>Reference</th></tr></thead><tbody>';
        methods.forEach(m => {
            html += '<tr><td><strong>' + m.name + '</strong></td><td>' + m.assumptions + '</td><td>' + m.strengths + '</td><td>' + m.reference + '</td></tr>';
        });
        html += '</tbody></table></div>';
        html += '<button class="btn btn-secondary w-100 mt-1" onclick="CausalInference.exportMethods()">Export Table</button>';
        html += '</div>';
        return html;
    }

    function exportMethods() {
        Export.copyText("Causal Inference Methods Comparison\n\n- PS Matching\n- IPW\n- IV/MR\n- DiD\n- Target Trial");
        Export.showToast('Methods summary copied');
    }

    // ================================================================
    // CARD 5: Propensity Score Guide
    // ================================================================
    function renderPropensityScoreGuide() {
        var html = '<div class="card">';
        html += '<div class="card-title">Propensity Score Analysis Guide</div>';
        html += '<div class="card-subtitle">Steps for conducting propensity score analysis.</div>';
        var steps = [
            '1. Select covariates (all confounders & prognostic factors).',
            '2. Estimate propensity score (logistic regression: P(A=1|X)).',
            '3. Check overlap/support between groups.',
            '4. Choose method: Matching, Weighting (IPTW), Stratification.',
            '5. Assess balance (Standardized Mean Differences < 0.1).',
            '6. Estimate treatment effect in the balanced sample.'
        ];
        html += '<div style="background:var(--bg-tertiary);border-radius:8px;padding:16px;">';
        steps.forEach(s => html += '<div style="margin-bottom:8px;font-size:0.9rem;">&#x2705; ' + s + '</div>');
        html += '</div></div>';
        return html;
    }

    // ================================================================
    // CARD 6: Instrumental Variables & MR
    // ================================================================
    function renderIVandMR() {
        var html = '<div class="card">';
        html += '<div class="card-title">IV &amp; Mendelian Randomization</div>';
        html += '<div class="card-subtitle">Using instruments (Z) to identify causal effects of exposures (X) on outcomes (Y).</div>';
        html += '<div style="border:1px solid var(--border);border-radius:8px;padding:12px;background:var(--bg-secondary);">';
        html += '<strong>Assumptions:</strong> 1. Relevance (Z->X), 2. Independence (Z is free of U), 3. Exclusion (Z affects Y only through X).</div>';
        html += '</div>';
        return html;
    }

    // ================================================================
    // CARD 7: Difference-in-Differences
    // ================================================================
    function renderDiD() {
        var html = '<div class="card">';
        html += '<div class="card-title">Difference-in-Differences (DiD)</div>';
        html += '<div class="card-subtitle">Estimates treatment effects by comparing pre-post changes between groups.</div>';
        html += '<div class="form-row form-row--4">';
        html += '<div class="form-group"><label class="form-label">Treated Pre</label><input type="number" class="form-input" id="did-t-pre" step="0.1" value="50"></div>';
        html += '<div class="form-group"><label class="form-label">Treated Post</label><input type="number" class="form-input" id="did-t-post" step="0.1" value="65"></div>';
        html += '<div class="form-group"><label class="form-label">Control Pre</label><input type="number" class="form-input" id="did-c-pre" step="0.1" value="48"></div>';
        html += '<div class="form-group"><label class="form-label">Control Post</label><input type="number" class="form-input" id="did-c-post" step="0.1" value="55"></div>';
        html += '</div>';
        html += '<button class="btn btn-primary w-100" onclick="CausalInference.calcDiD()">Calculate DiD</button>';
        html += '<div id="did-results"></div>';
        html += '</div>';
        return html;
    }

    function calcDiD() {
        var tPre = parseFloat(document.getElementById('did-t-pre').value);
        var tPost = parseFloat(document.getElementById('did-t-post').value);
        var cPre = parseFloat(document.getElementById('did-c-pre').value);
        var cPost = parseFloat(document.getElementById('did-c-post').value);
        if (isNaN(tPre) || isNaN(tPost) || isNaN(cPre) || isNaN(cPost)) return;
        var did = (tPost - tPre) - (cPost - cPre);
        var html = '<div class="result-panel mt-2 animate-in">';
        html += '<div class="result-value" style="color:var(--primary);">' + did.toFixed(2) + '</div>';
        html += '<div class="result-label">Causal Effect (DiD)</div></div>';
        App.setTrustedHTML(document.getElementById('did-results'), html);
    }

    // ================================================================
    // CARD 8: Target Trial Emulation
    // ================================================================
    function renderTargetTrial() {
        var html = '<div class="card">';
        html += '<div class="card-title">Target Trial Emulation Framework</div>';
        html += '<div class="card-subtitle">Explicitly align observational analysis with a hypothetical trial protocol.</div>';
        var items = ['Eligibility', 'Treatment Assignment (New-User)', 'Time Zero Alignment', 'Outcome Definition', 'Confounding Adjustment'];
        html += '<div style="background:var(--bg-tertiary);border-radius:8px;padding:16px;">';
        items.forEach(i => html += '<div style="margin-bottom:6px;font-size:0.9rem;">&#x2705; ' + i + '</div>');
        html += '</div>';
        html += '<div class="form-group mt-2"><label class="form-label">Protocol Summary</label><textarea class="form-input" id="tte-summary" rows="3" placeholder="Describe the target trial protocol..."></textarea></div>';
        html += '<button class="btn btn-secondary w-100 mt-1" onclick="CausalInference.exportTargetTrial()">Export Protocol</button>';
        html += '</div>';
        return html;
    }

    function exportTargetTrial() {
        var summary = document.getElementById('tte-summary').value;
        Export.copyText('Target Trial Emulation Protocol\n\n' + summary);
        Export.showToast('Protocol copied');
    }

    // ================================================================
    // HELPERS & EXPORTS
    // ================================================================
    function isAncestor(from, to, childrenMap) {
        var visited = {};
        var queue = [from];
        visited[from] = true;
        while (queue.length > 0) {
            var current = queue.shift();
            var kids = childrenMap[current] || [];
            for (var i = 0; i < kids.length; i++) {
                if (kids[i] === to) return true;
                if (!visited[kids[i]]) {
                    visited[kids[i]] = true;
                    queue.push(kids[i]);
                }
            }
        }
        return false;
    }

    function generateDAGText() {
        var lines = ['Directed Acyclic Graph', '==='];
        dagNodes.forEach(n => lines.push('- ' + n.label + ' (' + n.type + ')'));
        dagEdges.forEach(e => {
            var f = dagNodes.find(n => n.id === e.from);
            var t = dagNodes.find(n => n.id === e.to);
            if (f && t) lines.push(f.label + ' -> ' + t.label);
        });
        return lines.join('\n');
    }

    // ================================================================
    // REGISTER
    // ================================================================
    App.registerModule(MODULE_ID, { render: render });

    window.CausalInference = {
        render: render,
        assessBH: assessBH,
        exportBH: exportBH,
        resetBH: resetBH,
        addNode: addNode,
        addEdge: addEdge,
        clearDAG: clearDAG,
        loadExampleDAG: loadExampleDAG,
        loadTemplate: loadTemplate,
        exportDAG: exportDAG,
        calcCounterfactual: calcCounterfactual,
        exportMethods: exportMethods,
        calcDiD: calcDiD,
        exportTargetTrial: exportTargetTrial
    };
})();
