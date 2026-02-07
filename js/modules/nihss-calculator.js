/**
 * Neuro-Epi — NIH Stroke Scale (NIHSS) Module
 * Quantitative assessment of stroke-related neurological deficit.
 * Reference: Brott T, Adams HP, et al. Measurements of acute cerebral infarction: a clinical examination scale. Stroke. 1989;20(7):864-70.
 */

(function () {
    'use strict';

    const MODULE_ID = 'nihss-calculator';

    function render(container) {
        var html = App.createModuleLayout(
            'NIH Stroke Scale',
            'Quantify neurological impairment in stroke using the standardized NIHSS. Score ranges from 0 to 42. Assessment should be performed exactly as described in each section.'
        );

        html += '<div class="card">';
        html += '<div class="card-title">NIHSS Assessment</div>';
        html += '<div class="card-subtitle">Complete all 15 items of the scale. Scores represent the level of impairment.</div>';

        const items = [
            {
                id: '1a', label: '1a. Level of Consciousness',
                options: [
                    { v: 0, l: '0 - Alert' },
                    { v: 1, l: '1 - Not alert; but arousable by minor stimulation' },
                    { v: 2, l: '2 - Not alert; requires repeated stimulation to attend' },
                    { v: 3, l: '3 - Responds only with reflex motor or autonomic effects, or totally unresponsive' }
                ]
            },
            {
                id: '1b', label: '1b. LOC Questions (Month, Age)',
                options: [
                    { v: 0, l: '0 - Answers both questions correctly' },
                    { v: 1, l: '1 - Answers one question correctly' },
                    { v: 2, l: '2 - Answers neither question correctly' }
                ]
            },
            {
                id: '1c', label: '1c. LOC Commands (Open/Close Eyes, Grip/Release Hand)',
                options: [
                    { v: 0, l: '0 - Performs both tasks correctly' },
                    { v: 1, l: '1 - Performs one task correctly' },
                    { v: 2, l: '2 - Performs neither task correctly' }
                ]
            },
            {
                id: '2', label: '2. Best Gaze',
                options: [
                    { v: 0, l: '0 - Normal' },
                    { v: 1, l: '1 - Partial gaze palsy' },
                    { v: 2, l: '2 - Forced deviation' }
                ]
            },
            {
                id: '3', label: '3. Visual Fields',
                options: [
                    { v: 0, l: '0 - No visual loss' },
                    { v: 1, l: '1 - Partial hemianopia' },
                    { v: 2, l: '2 - Complete hemianopia' },
                    { v: 3, l: '3 - Bilateral hemianopia' }
                ]
            },
            {
                id: '4', label: '4. Facial Palsy',
                options: [
                    { v: 0, l: '0 - Normal symmetrical movements' },
                    { v: 1, l: '1 - Minor paralysis (flattened nasolabial fold, asymmetry on smiling)' },
                    { v: 2, l: '2 - Partial paralysis (total or near-total paralysis of lower face)' },
                    { v: 3, l: '3 - Complete paralysis of one or both sides (upper and lower face)' }
                ]
            },
            {
                id: '5a', label: '5a. Motor Arm - Left',
                options: [
                    { v: 0, l: '0 - No drift; limb holds 90 (or 45) degrees for full 10 seconds' },
                    { v: 1, l: '1 - Drift; limb holds 90 (or 45) degrees, but drifts down before full 10 seconds' },
                    { v: 2, l: '2 - Some effort against gravity; limb cannot get to or maintain 90 (or 45) degrees' },
                    { v: 3, l: '3 - No effort against gravity; limb falls' },
                    { v: 4, l: '4 - No movement' },
                    { v: 0, label: 'UN - Amputation or joint fusion (Untestable)' }
                ]
            },
            {
                id: '5b', label: '5b. Motor Arm - Right',
                options: [
                    { v: 0, l: '0 - No drift' },
                    { v: 1, l: '1 - Drift' },
                    { v: 2, l: '2 - Some effort against gravity' },
                    { v: 3, l: '3 - No effort against gravity' },
                    { v: 4, l: '4 - No movement' }
                ]
            },
            {
                id: '6a', label: '6a. Motor Leg - Left',
                options: [
                    { v: 0, l: '0 - No drift; holds 30 degrees for full 5 seconds' },
                    { v: 1, l: '1 - Drift; holds 30 degrees, but drifts down before full 5 seconds' },
                    { v: 2, l: '2 - Some effort against gravity; limb falls to bed by 5 seconds' },
                    { v: 3, l: '3 - No effort against gravity; limb falls to bed immediately' },
                    { v: 4, l: '4 - No movement' }
                ]
            },
            {
                id: '6b', label: '6b. Motor Leg - Right',
                options: [
                    { v: 0, l: '0 - No drift' },
                    { v: 1, l: '1 - Drift' },
                    { v: 2, l: '2 - Some effort against gravity' },
                    { v: 3, l: '3 - No effort against gravity' },
                    { v: 4, l: '4 - No movement' }
                ]
            },
            {
                id: '7', label: '7. Limb Ataxia',
                options: [
                    { v: 0, l: '0 - Absent' },
                    { v: 1, l: '1 - Present in one limb' },
                    { v: 2, l: '2 - Present in two limbs' }
                ]
            },
            {
                id: '8', label: '8. Sensory',
                options: [
                    { v: 0, l: '0 - Normal; no sensory loss' },
                    { v: 1, l: '1 - Mild-to-moderate sensory loss' },
                    { v: 2, l: '2 - Severe to total sensory loss' }
                ]
            },
            {
                id: '9', label: '9. Best Language',
                options: [
                    { v: 0, l: '0 - No aphasia; normal' },
                    { v: 1, l: '1 - Mild-to-moderate aphasia' },
                    { v: 2, l: '2 - Severe aphasia' },
                    { v: 3, l: '3 - Mute, global aphasia' }
                ]
            },
            {
                id: '10', label: '10. Dysarthria',
                options: [
                    { v: 0, l: '0 - Normal' },
                    { v: 1, l: '1 - Mild-to-moderate dysarthria' },
                    { v: 2, l: '2 - Severe dysarthria' },
                    { v: 0, label: 'UN - Intubated or other physical barrier' }
                ]
            },
            {
                id: '11', label: '11. Extinction and Inattention (formerly Neglect)',
                options: [
                    { v: 0, l: '0 - No abnormality' },
                    { v: 1, l: '1 - Visual, tactile, auditory, spatial, or personal inattention' },
                    { v: 2, l: '2 - Profound hemi-inattention or extinction to more than one modality' }
                ]
            }
        ];

        items.forEach(function (item) {
            html += '<div class="form-group">';
            html += '<label class="form-label">' + item.label + '</label>';
            html += '<select class="form-select" id="nihss-' + item.id + '" onchange="NIHSS.calculate()">';
            item.options.forEach(function (opt) {
                html += '<option value="' + opt.v + '">' + (opt.l || opt.label) + '</option>';
            });
            html += '</select></div>';
        });

        html += '<div id="nihss-results" class="mt-2"></div>';

        html += '</div>'; // end card

        // Learn section
        html += '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Learn: NIH Stroke Scale Clinical Significance</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';
        html += '<div class="card-subtitle" style="font-weight:600;">Severity Classification</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>0:</strong> No stroke symptoms</li>'
            + '<li><strong>1-4:</strong> Minor stroke</li>'
            + '<li><strong>5-15:</strong> Moderate stroke</li>'
            + '<li><strong>16-20:</strong> Moderate to severe stroke</li>'
            + '<li><strong>21-42:</strong> Severe stroke</li>'
            + '</ul>';
        html += '<div class="card-subtitle" style="font-weight:600;">Mathematical Note on Reliability</div>';
        html += '<p>The NIHSS has high inter-rater reliability (Kappa coefficients typically > 0.60 for most items). However, items like "Facial Palsy" and "Ataxia" show lower reliability compared to "Motor" and "LOC" items. It is an <em>ordinal scale</em>, meaning a score of 10 is not necessarily twice as severe as a score of 5.</p>';
        html += '</div></div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
        calculate(); // Initial calculation
    }

    function calculate() {
        var score = 0;
        const itemIds = ['1a', '1b', '1c', '2', '3', '4', '5a', '5b', '6a', '6b', '7', '8', '9', '10', '11'];
        itemIds.forEach(function (id) {
            var el = document.getElementById('nihss-' + id);
            if (el) score += parseInt(el.value) || 0;
        });

        var severity = '';
        var color = '';
        if (score === 0) { severity = 'No stroke symptoms'; color = 'var(--text-tertiary)'; }
        else if (score <= 4) { severity = 'Minor stroke'; color = 'var(--success)'; }
        else if (score <= 15) { severity = 'Moderate stroke'; color = 'var(--warning)'; }
        else if (score <= 20) { severity = 'Moderate to severe stroke'; color = 'var(--danger)'; }
        else { severity = 'Severe stroke'; color = 'var(--danger)'; }

        var resultsEl = document.getElementById('nihss-results');
        if (resultsEl) {
            var html = '<div class="result-panel animate-in">';
            html += '<div class="result-value">' + score + '</div>';
            html += '<div class="result-label">Total NIHSS Score</div>';
            html += '<div class="result-detail" style="color:' + color + '; font-weight:600">' + severity + '</div>';
            html += '</div>';
            App.setTrustedHTML(resultsEl, html);
        }
    }

    // Register module
    App.registerModule(MODULE_ID, { render: render });

    // Expose for global access
    window.NIHSS = {
        calculate: calculate
    };
})();
