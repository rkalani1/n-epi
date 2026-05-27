/**
 * Neuro-Epi — Project Planner Module
 * Research Project Planning & Timeline Tool
 * Features: Timeline Builder, Sample Size & Power Checklist,
 *           Budget Estimator, Milestone Tracker
 */

(function() {
    'use strict';

    const MODULE_ID = 'project-planner';

    var container;
    var milestones = [];
    var milestoneIdCounter = 0;
    var resources = [];
    var resourceIdCounter = 0;
    var risks = [];
    var riskIdCounter = 0;

    // ============================================================
    // RENDER
    // ============================================================

    function render(el) {
        container = el;

        var html = App.createModuleLayout(
            'Project Planner',
            'Plan research projects with timeline visualization, pre-study checklists, budget estimation, and milestone tracking.'
        );

        // ---- Learn & Reference ----
        html += '<div class="card" style="background: var(--bg-secondary); border-left: 4px solid var(--accent-color);">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\')">📚 Learn &amp; Reference <span style="font-size:0.8em; color: var(--text-muted);">(click to expand)</span></div>';
        html += '<div class="learn-body hidden">';

        html += '<div style="margin-bottom:1rem;">';
        html += '<strong style="color:var(--accent);">Research Timeline Principles</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>Allow 3-6 months for IRB approval</li>';
        html += '<li>Budget 20-30% extra time for recruitment</li>';
        html += '<li>Data cleaning typically takes 2-4x longer than expected</li>';
        html += '<li>Plan for 10-15% dropout rate</li>';
        html += '</ul></div>';

        html += '<div style="margin-bottom:1rem;">';
        html += '<strong style="color:var(--accent);">Budget Planning</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>Personnel costs typically 60-80% of total budget</li>';
        html += '<li>Include indirect costs (F&amp;A)</li>';
        html += '<li>Budget for open access publication fees</li>';
        html += '<li>Equipment vs supplies distinction matters for grants</li>';
        html += '</ul></div>';

        html += '<div style="margin-bottom:1rem;">';
        html += '<strong style="color:var(--accent);">Regulatory Essentials</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>Single IRB for multi-site studies (NIH policy)</li>';
        html += '<li>Data Safety Monitoring Board required for interventional trials</li>';
        html += '<li>ClinicalTrials.gov registration within 21 days of first enrollment</li>';
        html += '</ul></div>';

        html += '<div style="margin-bottom:1rem;">';
        html += '<strong style="color:var(--accent);">Common Pitfalls</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>Underestimating recruitment timeline</li>';
        html += '<li>Not budgeting for protocol amendments</li>';
        html += '<li>Forgetting data management costs</li>';
        html += '<li>Inadequate time for manuscript preparation</li>';
        html += '</ul></div>';

        html += '<div style="margin-bottom:0;">';
        html += '<strong style="color:var(--accent);">References</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>NIH Grants Policy Statement</li>';
        html += '<li>FDA 21 CFR Parts 50/56</li>';
        html += '<li>ICH-GCP E6(R2)</li>';
        html += '</ul></div>';

        html += '</div></div>';

        html += '<div class="card">';

        // Tab buttons
        html += '<div class="pp-tab-bar" style="display:flex;gap:0;border-bottom:1px solid var(--border)">'
            + '<button class="pp-tab-btn active" id="pp-btn-timeline" onclick="ProjectPlanner.switchTab(\'timeline\')" style="padding:0.6rem 1.2rem;background:none;border:none;border-bottom:2px solid var(--accent);color:var(--text);cursor:pointer;font-size:0.85rem;font-weight:600">Timeline Builder</button>'
            + '<button class="pp-tab-btn" id="pp-btn-checklist" onclick="ProjectPlanner.switchTab(\'checklist\')" style="padding:0.6rem 1.2rem;background:none;border:none;border-bottom:2px solid transparent;color:var(--text-secondary);cursor:pointer;font-size:0.85rem">Pre-Study Checklist</button>'
            + '<button class="pp-tab-btn" id="pp-btn-budget" onclick="ProjectPlanner.switchTab(\'budget\')" style="padding:0.6rem 1.2rem;background:none;border:none;border-bottom:2px solid transparent;color:var(--text-secondary);cursor:pointer;font-size:0.85rem">Budget Estimator</button>'
            + '<button class="pp-tab-btn" id="pp-btn-milestones" onclick="ProjectPlanner.switchTab(\'milestones\')" style="padding:0.6rem 1.2rem;background:none;border:none;border-bottom:2px solid transparent;color:var(--text-secondary);cursor:pointer;font-size:0.85rem">Milestone Tracker</button>'
            + '</div>';

        // ===== Tab 1: Timeline Builder =====
        html += '<div class="pp-tab" id="pp-timeline" style="display:block;padding:1rem 0">';
        html += '<div class="card-subtitle">Auto-generate a Gantt-style research timeline. Select your study type and generate standard phases.</div>';

        html += '<div class="form-group"><label class="form-label">Project Title</label>'
            + '<input type="text" class="form-input" id="pp-title" name="pp_title" placeholder="e.g., ESCAPE-NEXT: Extended Window Thrombectomy Trial"></div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Start Date</label>'
            + '<input type="date" class="form-input" id="pp-start-date" name="pp_start_date"></div>'
            + '<div class="form-group"><label class="form-label">Study Type</label>'
            + '<select class="form-select" id="pp-study-type" name="pp_study_type">'
            + '<option value="rct">Randomized Controlled Trial</option>'
            + '<option value="cohort">Cohort Study</option>'
            + '<option value="case-control">Case-Control Study</option>'
            + '<option value="cross-sectional">Cross-Sectional Study</option>'
            + '<option value="systematic-review">Systematic Review</option>'
            + '<option value="qualitative">Qualitative Study</option>'
            + '</select></div></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="ProjectPlanner.generateTimeline()">Generate Timeline</button>'
            + '<button class="btn btn-secondary" onclick="ProjectPlanner.copyTimeline()">Copy as Text</button>'
            + '</div>';

        html += '<div class="chart-container mt-2"><canvas id="pp-gantt-canvas" width="800" height="320"></canvas></div>';
        html += '<div id="pp-timeline-text" style="display:none"></div>';
        html += '</div>';

        // ===== Tab 2: Pre-Study Checklist =====
        html += '<div class="pp-tab" id="pp-checklist" style="display:none;padding:1rem 0">';
        html += '<div class="card-subtitle">Interactive checklist of items to complete before starting your study. Track readiness across key domains.</div>';

        html += '<div id="pp-checklist-progress" style="margin-bottom:1rem">'
            + '<div style="display:flex;justify-content:space-between;margin-bottom:0.3rem">'
            + '<span style="font-size:0.85rem;color:var(--text-secondary)">Overall Readiness</span>'
            + '<span id="pp-progress-pct" style="font-size:0.85rem;font-weight:600;color:var(--accent)">0%</span></div>'
            + '<div style="width:100%;height:8px;background:var(--bg-elevated);border-radius:4px;overflow:hidden">'
            + '<div id="pp-progress-bar" style="width:0%;height:100%;background:var(--accent);border-radius:4px;transition:width 0.3s"></div>'
            + '</div></div>';

        html += '<div id="pp-checklist-items">';
        html += buildChecklistHTML();
        html += '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="ProjectPlanner.exportChecklist()">Export Checklist</button>'
            + '</div>';
        html += '</div>';

        // ===== Tab 3: Budget Estimator =====
        html += '<div class="pp-tab" id="pp-budget" style="display:none;padding:1rem 0">';
        html += '<div class="card-subtitle">Estimate your research project budget. Enter costs by category and view the breakdown.</div>';

        html += '<div class="form-row form-row--2">'
            + '<div class="form-group"><label class="form-label">Number of Participants</label>'
            + '<input type="number" class="form-input" id="pp-num-participants" name="pp_num_participants" value="100" min="1"></div>'
            + '<div class="form-group"><label class="form-label">Cost per Participant ($)</label>'
            + '<input type="number" class="form-input" id="pp-cost-per-participant" name="pp_cost_per_participant" value="500" min="0"></div>'
            + '</div>';

        html += '<div class="form-row form-row--3">'
            + '<div class="form-group"><label class="form-label">Personnel Costs ($)</label>'
            + '<input type="number" class="form-input" id="pp-personnel-cost" name="pp_personnel_cost" value="150000" min="0"></div>'
            + '<div class="form-group"><label class="form-label">Equipment ($)</label>'
            + '<input type="number" class="form-input" id="pp-equipment-cost" name="pp_equipment_cost" value="25000" min="0"></div>'
            + '<div class="form-group"><label class="form-label">Other Costs ($)</label>'
            + '<input type="number" class="form-input" id="pp-other-cost" name="pp_other_cost" value="10000" min="0"></div>'
            + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-primary" onclick="ProjectPlanner.calculateBudget()">Calculate Budget</button>'
            + '<button class="btn btn-secondary" onclick="ProjectPlanner.copyBudget()">Copy Summary</button>'
            + '</div>';

        html += '<div id="pp-budget-results" class="mt-2"></div>';
        html += '<div class="chart-container mt-2"><canvas id="pp-budget-canvas" width="500" height="400"></canvas></div>';
        html += '</div>';

        // ===== Tab 4: Milestone Tracker =====
        html += '<div class="pp-tab" id="pp-milestones" style="display:none;padding:1rem 0">';
        html += '<div class="card-subtitle">Track custom milestones for your project. Monitor progress toward completion.</div>';

        html += '<div class="form-row form-row--3" style="align-items:flex-end">'
            + '<div class="form-group"><label class="form-label">Milestone Name</label>'
            + '<input type="text" class="form-input" id="pp-ms-name" placeholder="e.g., Ethics approval obtained"></div>'
            + '<div class="form-group"><label class="form-label">Target Date</label>'
            + '<input type="date" class="form-input" id="pp-ms-date"></div>'
            + '<div class="form-group"><label class="form-label">Status</label>'
            + '<select class="form-select" id="pp-ms-status">'
            + '<option value="not-started">Not Started</option>'
            + '<option value="in-progress">In Progress</option>'
            + '<option value="complete">Complete</option>'
            + '</select></div>'
            + '</div>';

        html += '<div class="btn-group mt-1">'
            + '<button class="btn btn-primary" onclick="ProjectPlanner.addMilestone()">Add Milestone</button>'
            + '</div>';

        html += '<div id="pp-ms-completion" class="mt-2" style="display:none">'
            + '<div style="display:flex;justify-content:space-between;margin-bottom:0.3rem">'
            + '<span style="font-size:0.85rem;color:var(--text-secondary)">Project Completion</span>'
            + '<span id="pp-ms-pct" style="font-size:0.85rem;font-weight:600;color:var(--accent)">0%</span></div>'
            + '<div style="width:100%;height:8px;background:var(--bg-elevated);border-radius:4px;overflow:hidden">'
            + '<div id="pp-ms-bar" style="width:0%;height:100%;background:var(--accent);border-radius:4px;transition:width 0.3s"></div>'
            + '</div></div>';

        html += '<div id="pp-ms-table" class="mt-2"></div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="ProjectPlanner.exportMilestones()">Export Milestones</button>'
            + '</div>';
        html += '</div>';

        html += '</div>'; // end main card

        /* === Card 2: Resource Allocation Tracker === */
        html += '<div class="card">';
        html += '<div class="card-title">Resource Allocation Tracker</div>';
        html += '<div class="card-subtitle">Track team members, their roles, effort allocation, and availability across your research project.</div>';

        html += '<div class="form-row form-row--3" style="align-items:flex-end">';
        html += '<div class="form-group"><label class="form-label">Team Member Name</label>';
        html += '<input type="text" class="form-input" id="pp-res-name" placeholder="e.g., Dr. Smith"></div>';
        html += '<div class="form-group"><label class="form-label">Role</label>';
        html += '<select class="form-select" id="pp-res-role">';
        html += '<option value="PI">Principal Investigator</option>';
        html += '<option value="Co-I">Co-Investigator</option>';
        html += '<option value="Coordinator">Research Coordinator</option>';
        html += '<option value="Statistician">Biostatistician</option>';
        html += '<option value="RA">Research Assistant</option>';
        html += '<option value="Postdoc">Postdoctoral Fellow</option>';
        html += '<option value="Student">Graduate Student</option>';
        html += '<option value="Other">Other</option>';
        html += '</select></div>';
        html += '<div class="form-group"><label class="form-label">% Effort (FTE)</label>';
        html += '<input type="number" class="form-input" id="pp-res-effort" value="25" min="1" max="100"></div>';
        html += '</div>';

        html += '<div class="form-row form-row--2" style="align-items:flex-end">';
        html += '<div class="form-group"><label class="form-label">Annual Salary ($)</label>';
        html += '<input type="number" class="form-input" id="pp-res-salary" value="80000" min="0"></div>';
        html += '<div class="form-group"><label class="form-label">Duration (months)</label>';
        html += '<input type="number" class="form-input" id="pp-res-months" value="12" min="1" max="60"></div>';
        html += '</div>';

        html += '<div class="btn-group mt-1">';
        html += '<button class="btn btn-primary" onclick="ProjectPlanner.addResource()">Add Team Member</button>';
        html += '</div>';
        html += '<div id="pp-res-table" class="mt-2"></div>';
        html += '<div class="btn-group mt-1">';
        html += '<button class="btn btn-secondary" onclick="ProjectPlanner.exportResources()">Export Resources</button>';
        html += '</div>';
        html += '</div>';

        /* === Card 3: Budget Estimation Tool === */
        html += '<div class="card">';
        html += '<div class="card-title">Detailed Budget Builder</div>';
        html += '<div class="card-subtitle">Build a comprehensive research budget with line items, indirect costs, and multi-year projections.</div>';

        html += '<div id="pp-budget-lines">';
        html += '<div class="form-row form-row--3" style="margin-bottom:0.3rem;">';
        html += '<div class="form-group"><label class="form-label">Category</label></div>';
        html += '<div class="form-group"><label class="form-label">Description</label></div>';
        html += '<div class="form-group"><label class="form-label">Annual Cost ($)</label></div>';
        html += '</div>';

        var budgetDefaults = [
            { cat: 'Personnel', desc: 'PI salary + fringe (20% effort)', cost: '45000' },
            { cat: 'Personnel', desc: 'Research Coordinator (100%)', cost: '55000' },
            { cat: 'Personnel', desc: 'Biostatistician (10% effort)', cost: '12000' },
            { cat: 'Equipment', desc: 'Data collection devices', cost: '15000' },
            { cat: 'Supplies', desc: 'Lab consumables', cost: '5000' },
            { cat: 'Travel', desc: 'Conference presentation', cost: '3000' },
            { cat: 'Other', desc: 'Publication fees (open access)', cost: '4000' },
            { cat: 'Other', desc: 'Participant compensation', cost: '10000' }
        ];

        for (var bl = 0; bl < budgetDefaults.length; bl++) {
            html += '<div class="form-row form-row--3" style="margin-bottom:0.3rem;">';
            html += '<div class="form-group"><input type="text" class="form-input" id="pp-bl-cat-' + bl + '" value="' + budgetDefaults[bl].cat + '"></div>';
            html += '<div class="form-group"><input type="text" class="form-input" id="pp-bl-desc-' + bl + '" value="' + budgetDefaults[bl].desc + '"></div>';
            html += '<div class="form-group"><input type="number" class="form-input" id="pp-bl-cost-' + bl + '" value="' + budgetDefaults[bl].cost + '" min="0"></div>';
            html += '</div>';
        }
        html += '</div>';

        html += '<div class="form-row form-row--3">';
        html += '<div class="form-group"><label class="form-label">Indirect Cost Rate (%)</label>';
        html += '<input type="number" class="form-input" id="pp-bl-indirect" value="55" min="0" max="100"></div>';
        html += '<div class="form-group"><label class="form-label">Project Duration (years)</label>';
        html += '<input type="number" class="form-input" id="pp-bl-years" value="3" min="1" max="10"></div>';
        html += '<div class="form-group"><label class="form-label">Annual Inflation (%)</label>';
        html += '<input type="number" class="form-input" id="pp-bl-inflation" value="3" min="0" max="10" step="0.5"></div>';
        html += '</div>';

        html += '<div class="btn-group mt-1">';
        html += '<button class="btn btn-primary" onclick="ProjectPlanner.calcDetailedBudget()">Calculate Budget</button>';
        html += '<button class="btn btn-secondary" onclick="ProjectPlanner.copyDetailedBudget()">Copy Budget</button>';
        html += '</div>';
        html += '<div id="pp-bl-results" class="mt-2"></div>';
        html += '</div>';

        /* === Card 4: Risk Assessment Matrix === */
        html += '<div class="card">';
        html += '<div class="card-title">Risk Assessment Matrix</div>';
        html += '<div class="card-subtitle">Identify and assess project risks by likelihood and impact. Develop mitigation strategies.</div>';

        html += '<div class="form-row form-row--2" style="align-items:flex-end">';
        html += '<div class="form-group"><label class="form-label">Risk Description</label>';
        html += '<input type="text" class="form-input" id="pp-risk-desc" placeholder="e.g., Slow recruitment"></div>';
        html += '<div class="form-group"><label class="form-label">Mitigation Strategy</label>';
        html += '<input type="text" class="form-input" id="pp-risk-mitigation" placeholder="e.g., Multi-site recruitment"></div>';
        html += '</div>';
        html += '<div class="form-row form-row--2" style="align-items:flex-end">';
        html += '<div class="form-group"><label class="form-label">Likelihood (1-5)</label>';
        html += '<select class="form-select" id="pp-risk-likelihood">';
        html += '<option value="1">1 - Rare</option>';
        html += '<option value="2">2 - Unlikely</option>';
        html += '<option value="3" selected>3 - Possible</option>';
        html += '<option value="4">4 - Likely</option>';
        html += '<option value="5">5 - Almost Certain</option>';
        html += '</select></div>';
        html += '<div class="form-group"><label class="form-label">Impact (1-5)</label>';
        html += '<select class="form-select" id="pp-risk-impact">';
        html += '<option value="1">1 - Negligible</option>';
        html += '<option value="2">2 - Minor</option>';
        html += '<option value="3" selected>3 - Moderate</option>';
        html += '<option value="4">4 - Major</option>';
        html += '<option value="5">5 - Catastrophic</option>';
        html += '</select></div>';
        html += '</div>';

        html += '<div class="btn-group mt-1">';
        html += '<button class="btn btn-primary" onclick="ProjectPlanner.addRisk()">Add Risk</button>';
        html += '</div>';
        html += '<div id="pp-risk-table" class="mt-2"></div>';
        html += '<div id="pp-risk-matrix" class="mt-2"></div>';
        html += '</div>';

        /* === Card 5: Project Template Library === */
        html += '<div class="card">';
        html += '<div class="card-title">Project Template Library</div>';
        html += '<div class="card-subtitle">Pre-built project templates with standard phases, milestones, and checklists for common study designs.</div>';

        var templates = [
            { id: 'rct-template', name: 'Randomized Controlled Trial', duration: '3-5 years', phases: 'Protocol (3mo) > IRB (3-6mo) > Recruitment (12-24mo) > Follow-up (6-24mo) > Analysis (3-6mo) > Dissemination (6-12mo)', milestones: ['Protocol finalized', 'IRB approval', 'DSMB established', 'First patient enrolled', '50% enrollment', 'Last patient enrolled', 'Database lock', 'Primary analysis complete', 'Manuscript submitted'], keyRisks: 'Slow recruitment, protocol amendments, DSMB recommendations, loss to follow-up' },
            { id: 'cohort-template', name: 'Prospective Cohort Study', duration: '2-5 years', phases: 'Protocol (2mo) > IRB (3mo) > Cohort Assembly (6-12mo) > Follow-up (12-36mo) > Analysis (3-6mo) > Dissemination (6mo)', milestones: ['Protocol finalized', 'IRB approval', 'Data collection tools validated', 'Cohort assembly complete', 'Interim analysis', 'End of follow-up', 'Database lock', 'Manuscript submitted'], keyRisks: 'Loss to follow-up, exposure misclassification, competing risks, outcome ascertainment' },
            { id: 'sr-template', name: 'Systematic Review / Meta-Analysis', duration: '6-18 months', phases: 'Protocol (2wk) > Search (4wk) > Screening (4-8wk) > Extraction (4-6wk) > Quality Assessment (2-4wk) > Synthesis (4-6wk) > Writing (4-8wk)', milestones: ['Protocol registered (PROSPERO)', 'Search strategy finalized', 'Screening complete', 'Data extraction complete', 'Risk of bias assessed', 'Meta-analysis complete', 'Manuscript submitted'], keyRisks: 'Insufficient studies, high heterogeneity, publication bias, delayed data availability' }
        ];

        for (var tp = 0; tp < templates.length; tp++) {
            var tpl = templates[tp];
            html += '<div style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.5rem;overflow:hidden;">';
            html += '<div onclick="ProjectPlanner.toggleTemplate(' + tp + ')" style="padding:0.6rem 1rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:var(--bg-elevated);">';
            html += '<div><strong>' + tpl.name + '</strong><span style="font-size:0.8rem;color:var(--text-tertiary);margin-left:0.5rem;">' + tpl.duration + '</span></div>';
            html += '<span id="pp-tpl-arrow-' + tp + '" style="transition:transform 0.2s;">&#9660;</span>';
            html += '</div>';
            html += '<div id="pp-tpl-detail-' + tp + '" class="hidden" style="padding:0.8rem 1rem;font-size:0.9rem;">';
            html += '<p><strong>Typical Duration:</strong> ' + tpl.duration + '</p>';
            html += '<p><strong>Phases:</strong> ' + tpl.phases + '</p>';
            html += '<p><strong>Key Milestones:</strong></p><ul style="margin:0.3rem 0;padding-left:1.5rem;">';
            for (var tmi = 0; tmi < tpl.milestones.length; tmi++) {
                html += '<li>' + tpl.milestones[tmi] + '</li>';
            }
            html += '</ul>';
            html += '<p><strong>Key Risks:</strong> ' + tpl.keyRisks + '</p>';
            html += '<button class="btn btn-xs btn-primary mt-1" onclick="ProjectPlanner.loadTemplate(' + tp + ')">Load Template Milestones</button>';
            html += '</div></div>';
        }
        html += '</div>';

        /* === Expanded Learn Section === */
        html += '<div class="card" style="background: var(--bg-secondary); border-left: 4px solid var(--accent-color);">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\')">&#128218; Advanced Project Management <span style="font-size:0.8em; color: var(--text-muted);">(click to expand)</span></div>';
        html += '<div class="learn-body hidden">';

        html += '<div style="margin-bottom:1rem;">';
        html += '<strong style="color:var(--accent);">Grant Budget Tips</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>NIH modular budgets: increments of $25K up to $250K/year (direct costs)</li>';
        html += '<li>Fringe benefits typically 25-35% of salary (varies by institution)</li>';
        html += '<li>Include annual salary increases (3-4%) in multi-year budgets</li>';
        html += '<li>Equipment vs. supplies: items >$5,000 are typically classified as equipment</li>';
        html += '<li>F&A (indirect) costs are negotiated between institution and NIH</li>';
        html += '<li>Subcontracts: first $25K subject to indirect costs; remainder exempt at many institutions</li>';
        html += '</ul></div>';

        html += '<div style="margin-bottom:1rem;">';
        html += '<strong style="color:var(--accent);">Risk Management Framework</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>Identify risks early in planning phase</li>';
        html += '<li>Classify risks: scientific, regulatory, operational, financial, personnel</li>';
        html += '<li>Score risks: Likelihood (1-5) x Impact (1-5) = Risk Score (1-25)</li>';
        html += '<li>Low risk (1-5): Accept and monitor</li>';
        html += '<li>Medium risk (6-12): Develop mitigation plan</li>';
        html += '<li>High risk (13-25): Requires active management and contingency plan</li>';
        html += '</ul></div>';

        html += '<div style="margin-bottom:1rem;">';
        html += '<strong style="color:var(--accent);">Milestone Dependencies</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>Identify critical path: longest chain of dependent milestones</li>';
        html += '<li>Build in buffer time (10-20%) for each phase</li>';
        html += '<li>Use finish-to-start dependencies as default</li>';
        html += '<li>Identify parallel tasks that can overlap</li>';
        html += '<li>Regular milestone review meetings (monthly or quarterly)</li>';
        html += '</ul></div>';

        html += '<div style="margin-bottom:0;">';
        html += '<strong style="color:var(--accent);">References</strong>';
        html += '<ul style="margin:0.3rem 0 0 1.2rem;font-size:0.85rem;line-height:1.7;">';
        html += '<li>NIH Grants Policy Statement (current edition)</li>';
        html += '<li>FDA 21 CFR Parts 50, 56, 312</li>';
        html += '<li>ICH-GCP E6(R2) Guidelines</li>';
        html += '<li>PMBOK Guide (Project Management Body of Knowledge)</li>';
        html += '</ul></div>';

        html += '</div></div>';

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);

        // Reset state
        milestones = [];
        milestoneIdCounter = 0;
        resources = [];
        resourceIdCounter = 0;
        risks = [];
        riskIdCounter = 0;
    }

    // ============================================================
    // TAB SWITCHING
    // ============================================================

    function switchTab(tabId) {
        var tabs = container.querySelectorAll('.pp-tab');
        var btns = container.querySelectorAll('.pp-tab-btn');
        tabs.forEach(function(t) { t.style.display = 'none'; });
        btns.forEach(function(b) {
            b.classList.remove('active');
            b.style.borderBottomColor = 'transparent';
            b.style.color = 'var(--text-secondary)';
            b.style.fontWeight = 'normal';
        });
        var tab = container.querySelector('#pp-' + tabId);
        var btn = container.querySelector('#pp-btn-' + tabId);
        if (tab) tab.style.display = 'block';
        if (btn) {
            btn.classList.add('active');
            btn.style.borderBottomColor = 'var(--accent)';
            btn.style.color = 'var(--text)';
            btn.style.fontWeight = '600';
        }
    }

    // ============================================================
    // TAB 1: TIMELINE BUILDER
    // ============================================================

    function getPhases(studyType) {
        var phases = {
            'rct': [
                { label: 'Protocol Development', startWeek: 1, endWeek: 4, color: '#22d3ee' },
                { label: 'Ethics / IRB Approval', startWeek: 4, endWeek: 12, color: '#818cf8' },
                { label: 'Recruitment', startWeek: 8, endWeek: 30, color: '#34d399' },
                { label: 'Data Collection', startWeek: 10, endWeek: 32, color: '#fbbf24' },
                { label: 'Data Analysis', startWeek: 28, endWeek: 36, color: '#f87171' },
                { label: 'Manuscript Writing', startWeek: 34, endWeek: 44, color: '#fb923c' },
                { label: 'Submission & Review', startWeek: 42, endWeek: 52, color: '#a78bfa' }
            ],
            'cohort': [
                { label: 'Protocol Development', startWeek: 1, endWeek: 4, color: '#22d3ee' },
                { label: 'Ethics / IRB Approval', startWeek: 4, endWeek: 12, color: '#818cf8' },
                { label: 'Cohort Assembly', startWeek: 8, endWeek: 24, color: '#34d399' },
                { label: 'Follow-up / Data Collection', startWeek: 12, endWeek: 40, color: '#fbbf24' },
                { label: 'Data Analysis', startWeek: 36, endWeek: 44, color: '#f87171' },
                { label: 'Manuscript Writing', startWeek: 42, endWeek: 50, color: '#fb923c' },
                { label: 'Submission & Review', startWeek: 48, endWeek: 56, color: '#a78bfa' }
            ],
            'case-control': [
                { label: 'Protocol Development', startWeek: 1, endWeek: 4, color: '#22d3ee' },
                { label: 'Ethics / IRB Approval', startWeek: 4, endWeek: 10, color: '#818cf8' },
                { label: 'Case Identification', startWeek: 8, endWeek: 18, color: '#34d399' },
                { label: 'Control Selection & Matching', startWeek: 10, endWeek: 20, color: '#fbbf24' },
                { label: 'Data Collection', startWeek: 14, endWeek: 24, color: '#f472b6' },
                { label: 'Data Analysis', startWeek: 22, endWeek: 30, color: '#f87171' },
                { label: 'Manuscript Writing', startWeek: 28, endWeek: 36, color: '#fb923c' },
                { label: 'Submission & Review', startWeek: 34, endWeek: 42, color: '#a78bfa' }
            ],
            'cross-sectional': [
                { label: 'Protocol Development', startWeek: 1, endWeek: 3, color: '#22d3ee' },
                { label: 'Ethics / IRB Approval', startWeek: 3, endWeek: 8, color: '#818cf8' },
                { label: 'Survey / Data Collection', startWeek: 6, endWeek: 18, color: '#34d399' },
                { label: 'Data Cleaning', startWeek: 16, endWeek: 20, color: '#fbbf24' },
                { label: 'Data Analysis', startWeek: 18, endWeek: 26, color: '#f87171' },
                { label: 'Manuscript Writing', startWeek: 24, endWeek: 32, color: '#fb923c' },
                { label: 'Submission & Review', startWeek: 30, endWeek: 38, color: '#a78bfa' }
            ],
            'systematic-review': [
                { label: 'Protocol & Registration', startWeek: 1, endWeek: 3, color: '#22d3ee' },
                { label: 'Literature Search', startWeek: 3, endWeek: 8, color: '#818cf8' },
                { label: 'Screening & Selection', startWeek: 6, endWeek: 14, color: '#34d399' },
                { label: 'Data Extraction', startWeek: 12, endWeek: 20, color: '#fbbf24' },
                { label: 'Quality Assessment', startWeek: 14, endWeek: 22, color: '#f472b6' },
                { label: 'Meta-Analysis / Synthesis', startWeek: 20, endWeek: 28, color: '#f87171' },
                { label: 'Manuscript Writing', startWeek: 26, endWeek: 34, color: '#fb923c' },
                { label: 'Submission & Review', startWeek: 32, endWeek: 40, color: '#a78bfa' }
            ],
            'qualitative': [
                { label: 'Protocol Development', startWeek: 1, endWeek: 4, color: '#22d3ee' },
                { label: 'Ethics / IRB Approval', startWeek: 4, endWeek: 10, color: '#818cf8' },
                { label: 'Participant Recruitment', startWeek: 8, endWeek: 16, color: '#34d399' },
                { label: 'Data Collection (Interviews)', startWeek: 10, endWeek: 24, color: '#fbbf24' },
                { label: 'Transcription & Coding', startWeek: 14, endWeek: 28, color: '#f472b6' },
                { label: 'Thematic Analysis', startWeek: 24, endWeek: 34, color: '#f87171' },
                { label: 'Manuscript Writing', startWeek: 32, endWeek: 40, color: '#fb923c' },
                { label: 'Submission & Review', startWeek: 38, endWeek: 46, color: '#a78bfa' }
            ]
        };
        return phases[studyType] || phases['rct'];
    }

    function generateTimeline() {
        var studyType = document.getElementById('pp-study-type').value;
        var projectTitle = document.getElementById('pp-title').value || 'Research Project';
        var phases = getPhases(studyType);

        var maxWeek = 0;
        phases.forEach(function(p) { if (p.endWeek > maxWeek) maxWeek = p.endWeek; });
        var totalWeeks = Math.ceil(maxWeek / 4) * 4;

        var canvas = document.getElementById('pp-gantt-canvas');
        if (!canvas) return;

        var width = 800;
        var barHeight = 24;
        var rowGap = 8;
        var topPadding = 60;
        var leftPadding = 200;
        var rightPadding = 30;
        var bottomPadding = 40;
        var chartHeight = topPadding + phases.length * (barHeight + rowGap) + bottomPadding;

        canvas.style.width = width + 'px';
        canvas.style.height = chartHeight + 'px';

        var ctx;
        if (typeof Charts !== 'undefined' && Charts.setupCanvas) {
            ctx = Charts.setupCanvas(canvas, width, chartHeight);
        } else {
            var dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = chartHeight * dpr;
            ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);
        }

        var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        var bgColor = isDark ? '#06090f' : '#ffffff';
        var textColor = isDark ? '#f1f5f9' : '#0f172a';
        var secondaryColor = isDark ? '#94a3b8' : '#475569';
        var gridColor = isDark ? 'rgba(148,163,184,0.08)' : 'rgba(0,0,0,0.06)';

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, chartHeight);

        // Title
        ctx.fillStyle = textColor;
        ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(projectTitle, width / 2, 24);

        var typeLabels = {
            'rct': 'Randomized Controlled Trial',
            'cohort': 'Cohort Study',
            'case-control': 'Case-Control Study',
            'cross-sectional': 'Cross-Sectional Study',
            'systematic-review': 'Systematic Review',
            'qualitative': 'Qualitative Study'
        };
        ctx.fillStyle = secondaryColor;
        ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(typeLabels[studyType] || studyType, width / 2, 42);

        var chartWidth = width - leftPadding - rightPadding;

        // Month grid lines
        ctx.textAlign = 'center';
        ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
        var monthInterval = totalWeeks <= 30 ? 4 : 8;
        for (var w = 0; w <= totalWeeks; w += monthInterval) {
            var x = leftPadding + (w / totalWeeks) * chartWidth;
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, topPadding - 5);
            ctx.lineTo(x, topPadding + phases.length * (barHeight + rowGap));
            ctx.stroke();
            ctx.fillStyle = secondaryColor;
            ctx.fillText('M' + Math.round(w / 4), x, topPadding + phases.length * (barHeight + rowGap) + 16);
        }

        // Draw bars
        phases.forEach(function(phase, i) {
            var y = topPadding + i * (barHeight + rowGap);

            ctx.fillStyle = textColor;
            ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(phase.label, leftPadding - 12, y + barHeight / 2 + 4);

            var x1 = leftPadding + (phase.startWeek / totalWeeks) * chartWidth;
            var x2 = leftPadding + (phase.endWeek / totalWeeks) * chartWidth;
            var barWidth = x2 - x1;

            ctx.fillStyle = phase.color;
            ctx.globalAlpha = 0.85;
            var radius = 4;
            ctx.beginPath();
            ctx.moveTo(x1 + radius, y);
            ctx.lineTo(x1 + barWidth - radius, y);
            ctx.quadraticCurveTo(x1 + barWidth, y, x1 + barWidth, y + radius);
            ctx.lineTo(x1 + barWidth, y + barHeight - radius);
            ctx.quadraticCurveTo(x1 + barWidth, y + barHeight, x1 + barWidth - radius, y + barHeight);
            ctx.lineTo(x1 + radius, y + barHeight);
            ctx.quadraticCurveTo(x1, y + barHeight, x1, y + barHeight - radius);
            ctx.lineTo(x1, y + radius);
            ctx.quadraticCurveTo(x1, y, x1 + radius, y);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1.0;

            if (barWidth > 60) {
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Wk ' + phase.startWeek + '-' + phase.endWeek, x1 + barWidth / 2, y + barHeight / 2 + 3);
            }
        });

        ctx.textAlign = 'left';
    }

    function copyTimeline() {
        var studyType = document.getElementById('pp-study-type').value;
        var projectTitle = document.getElementById('pp-title').value || 'Research Project';
        var startDate = document.getElementById('pp-start-date').value;
        var phases = getPhases(studyType);

        var text = 'PROJECT TIMELINE: ' + projectTitle + '\n';
        if (startDate) text += 'Start Date: ' + startDate + '\n';
        text += '\n';
        text += 'Phase'.padEnd(30) + 'Start'.padEnd(12) + 'End'.padEnd(12) + 'Duration\n';
        text += '-'.repeat(66) + '\n';

        phases.forEach(function(p) {
            var duration = p.endWeek - p.startWeek;
            text += p.label.padEnd(30)
                + ('Week ' + p.startWeek).padEnd(12)
                + ('Week ' + p.endWeek).padEnd(12)
                + duration + ' weeks\n';
        });

        Export.copyText(text);
    }

    // ============================================================
    // TAB 2: PRE-STUDY CHECKLIST
    // ============================================================

    function getChecklistItems() {
        return [
            {
                category: 'Study Design',
                items: [
                    { id: 'sd1', title: 'Research question defined', desc: 'Clear PICO/PECO framework with measurable outcomes' },
                    { id: 'sd2', title: 'Study design selected', desc: 'Appropriate design chosen with justification' },
                    { id: 'sd3', title: 'Sample size calculated', desc: 'Formal power analysis with stated assumptions' },
                    { id: 'sd4', title: 'Inclusion/exclusion criteria', desc: 'Clear, reproducible eligibility criteria documented' },
                    { id: 'sd5', title: 'Primary outcome defined', desc: 'Single primary outcome with measurement method and timing' }
                ]
            },
            {
                category: 'Ethics',
                items: [
                    { id: 'et1', title: 'IRB/Ethics application prepared', desc: 'Protocol, consent forms, and supporting documents ready' },
                    { id: 'et2', title: 'Informed consent drafted', desc: 'Plain-language consent document with required elements' },
                    { id: 'et3', title: 'Data privacy plan', desc: 'HIPAA/GDPR compliance, de-identification procedures' },
                    { id: 'et4', title: 'Conflict of interest disclosed', desc: 'All investigator COI forms completed' }
                ]
            },
            {
                category: 'Data Management',
                items: [
                    { id: 'dm1', title: 'Data collection forms designed', desc: 'CRFs or REDCap instruments built and tested' },
                    { id: 'dm2', title: 'Database set up', desc: 'Electronic data capture system configured with validation rules' },
                    { id: 'dm3', title: 'Data dictionary created', desc: 'All variables defined with coding rules and acceptable ranges' },
                    { id: 'dm4', title: 'Backup and security plan', desc: 'Regular backup schedule, access controls, audit trail' }
                ]
            },
            {
                category: 'Statistical Plan',
                items: [
                    { id: 'sp1', title: 'Statistical analysis plan written', desc: 'Pre-specified primary and secondary analyses' },
                    { id: 'sp2', title: 'Missing data strategy', desc: 'Plan for handling missing data (MCAR/MAR/MNAR assessment)' },
                    { id: 'sp3', title: 'Multiple comparisons addressed', desc: 'Correction method specified if multiple endpoints' },
                    { id: 'sp4', title: 'Sensitivity analyses planned', desc: 'Per-protocol, subgroup, and robustness analyses defined' }
                ]
            },
            {
                category: 'Reporting',
                items: [
                    { id: 'rp1', title: 'Reporting guideline identified', desc: 'CONSORT, STROBE, PRISMA, or other applicable guideline' },
                    { id: 'rp2', title: 'Trial registration', desc: 'ClinicalTrials.gov or equivalent registration completed' },
                    { id: 'rp3', title: 'Authorship criteria agreed', desc: 'ICMJE criteria discussed and documented with team' },
                    { id: 'rp4', title: 'Dissemination plan', desc: 'Target journals and conferences identified' }
                ]
            }
        ];
    }

    function buildChecklistHTML() {
        var categories = getChecklistItems();
        var html = '';

        categories.forEach(function(cat) {
            html += '<div style="margin-bottom:1rem">';
            html += '<div style="font-weight:600;font-size:0.9rem;color:var(--accent);margin-bottom:0.5rem;padding-bottom:0.3rem;border-bottom:1px solid var(--border)">'
                + cat.category + '</div>';

            cat.items.forEach(function(item) {
                html += '<label style="display:flex;gap:0.6rem;align-items:flex-start;padding:0.4rem 0;cursor:pointer">'
                    + '<input type="checkbox" id="pp-chk-' + item.id + '" onchange="ProjectPlanner.updateProgress()" style="margin-top:3px;flex-shrink:0">'
                    + '<div>'
                    + '<div style="font-size:0.85rem;font-weight:500;color:var(--text)">' + item.title + '</div>'
                    + '<div style="font-size:0.78rem;color:var(--text-tertiary)">' + item.desc + '</div>'
                    + '</div></label>';
            });

            html += '</div>';
        });

        return html;
    }

    function updateProgress() {
        var checkboxes = container.querySelectorAll('[id^="pp-chk-"]');
        var total = checkboxes.length;
        var checked = 0;
        checkboxes.forEach(function(cb) { if (cb.checked) checked++; });
        var pct = total > 0 ? Math.round((checked / total) * 100) : 0;

        var pctEl = document.getElementById('pp-progress-pct');
        var barEl = document.getElementById('pp-progress-bar');
        if (pctEl) pctEl.textContent = pct + '%';
        if (barEl) {
            barEl.style.width = pct + '%';
            barEl.style.background = pct === 100 ? 'var(--success)' : 'var(--accent)';
        }
    }

    function exportChecklist() {
        var categories = getChecklistItems();
        var text = 'PRE-STUDY CHECKLIST\n';
        text += '='.repeat(50) + '\n\n';

        var totalChecked = 0;
        var totalItems = 0;

        categories.forEach(function(cat) {
            text += cat.category.toUpperCase() + '\n';
            text += '-'.repeat(30) + '\n';

            cat.items.forEach(function(item) {
                var cb = document.getElementById('pp-chk-' + item.id);
                var done = cb && cb.checked;
                if (done) totalChecked++;
                totalItems++;
                text += (done ? '[x] ' : '[ ] ') + item.title + '\n';
                text += '    ' + item.desc + '\n';
            });
            text += '\n';
        });

        text += 'Progress: ' + totalChecked + '/' + totalItems + ' items complete ('
            + Math.round((totalChecked / totalItems) * 100) + '%)\n';

        Export.copyText(text);
    }

    // ============================================================
    // TAB 3: BUDGET ESTIMATOR
    // ============================================================

    function calculateBudget() {
        var numParticipants = parseInt(document.getElementById('pp-num-participants').value) || 0;
        var costPerParticipant = parseFloat(document.getElementById('pp-cost-per-participant').value) || 0;
        var personnelCost = parseFloat(document.getElementById('pp-personnel-cost').value) || 0;
        var equipmentCost = parseFloat(document.getElementById('pp-equipment-cost').value) || 0;
        var otherCost = parseFloat(document.getElementById('pp-other-cost').value) || 0;

        var participantTotal = numParticipants * costPerParticipant;
        var total = participantTotal + personnelCost + equipmentCost + otherCost;

        var items = [
            { label: 'Participant Costs', amount: participantTotal, color: '#22d3ee' },
            { label: 'Personnel', amount: personnelCost, color: '#34d399' },
            { label: 'Equipment', amount: equipmentCost, color: '#fbbf24' },
            { label: 'Other', amount: otherCost, color: '#f87171' }
        ];

        var html = '<table style="width:100%;border-collapse:collapse;font-size:0.85rem">';
        html += '<thead><tr style="border-bottom:2px solid var(--border)">'
            + '<th style="text-align:left;padding:0.5rem">Category</th>'
            + '<th style="text-align:right;padding:0.5rem">Amount</th>'
            + '<th style="text-align:right;padding:0.5rem">% of Total</th>'
            + '</tr></thead><tbody>';

        items.forEach(function(item) {
            var pct = total > 0 ? ((item.amount / total) * 100).toFixed(1) : '0.0';
            html += '<tr style="border-bottom:1px solid var(--border)">'
                + '<td style="padding:0.5rem"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:' + item.color + ';margin-right:0.5rem"></span>' + item.label + '</td>'
                + '<td style="text-align:right;padding:0.5rem;font-family:var(--font-mono)">$' + item.amount.toLocaleString() + '</td>'
                + '<td style="text-align:right;padding:0.5rem">' + pct + '%</td>'
                + '</tr>';
        });

        html += '<tr style="border-top:2px solid var(--border);font-weight:700">'
            + '<td style="padding:0.5rem">Total Budget</td>'
            + '<td style="text-align:right;padding:0.5rem;font-family:var(--font-mono);color:var(--accent)">$' + total.toLocaleString() + '</td>'
            + '<td style="text-align:right;padding:0.5rem">100%</td>'
            + '</tr>';

        html += '</tbody></table>';

        html += '<div style="font-size:0.78rem;color:var(--text-tertiary);margin-top:0.5rem">'
            + numParticipants + ' participants x $' + costPerParticipant.toLocaleString() + '/participant = $' + participantTotal.toLocaleString()
            + '</div>';

        App.setTrustedHTML(document.getElementById('pp-budget-results'), html);

        drawBudgetPie(items, total);
    }

    function drawBudgetPie(items, total) {
        var canvas = document.getElementById('pp-budget-canvas');
        if (!canvas || total <= 0) return;

        var width = 500;
        var height = 400;

        var ctx;
        if (typeof Charts !== 'undefined' && Charts.setupCanvas) {
            ctx = Charts.setupCanvas(canvas, width, height);
        } else {
            var dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);
        }

        var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        var bgColor = isDark ? '#06090f' : '#ffffff';
        var textColor = isDark ? '#f1f5f9' : '#0f172a';
        var secondaryColor = isDark ? '#94a3b8' : '#475569';

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = textColor;
        ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Budget Allocation', width / 2, 24);

        var centerX = width / 2;
        var centerY = height / 2 + 10;
        var radius = 120;
        var startAngle = -Math.PI / 2;

        var nonZero = items.filter(function(it) { return it.amount > 0; });

        nonZero.forEach(function(item) {
            var sliceAngle = (item.amount / total) * 2 * Math.PI;
            var endAngle = startAngle + sliceAngle;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = item.color;
            ctx.globalAlpha = 0.85;
            ctx.fill();
            ctx.globalAlpha = 1.0;

            var midAngle = startAngle + sliceAngle / 2;
            var pct = ((item.amount / total) * 100).toFixed(0);
            if (parseFloat(pct) >= 5) {
                var labelRadius = radius * 0.65;
                var lx = centerX + Math.cos(midAngle) * labelRadius;
                var ly = centerY + Math.sin(midAngle) * labelRadius;
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(pct + '%', lx, ly);
            }

            startAngle = endAngle;
        });

        ctx.textBaseline = 'alphabetic';
        var legendY = height - 50;
        var legendX = (width - nonZero.length * 120) / 2;
        nonZero.forEach(function(item, i) {
            var x = legendX + i * 120;
            ctx.fillStyle = item.color;
            ctx.fillRect(x, legendY, 10, 10);
            ctx.fillStyle = secondaryColor;
            ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(item.label, x + 14, legendY + 9);
        });
    }

    function copyBudget() {
        var numParticipants = parseInt(document.getElementById('pp-num-participants').value) || 0;
        var costPerParticipant = parseFloat(document.getElementById('pp-cost-per-participant').value) || 0;
        var personnelCost = parseFloat(document.getElementById('pp-personnel-cost').value) || 0;
        var equipmentCost = parseFloat(document.getElementById('pp-equipment-cost').value) || 0;
        var otherCost = parseFloat(document.getElementById('pp-other-cost').value) || 0;
        var participantTotal = numParticipants * costPerParticipant;
        var total = participantTotal + personnelCost + equipmentCost + otherCost;

        var text = 'BUDGET SUMMARY\n';
        text += '='.repeat(40) + '\n\n';
        text += 'Participant Costs:  $' + participantTotal.toLocaleString() + '\n';
        text += '  (' + numParticipants + ' participants x $' + costPerParticipant.toLocaleString() + ' each)\n';
        text += 'Personnel:          $' + personnelCost.toLocaleString() + '\n';
        text += 'Equipment:          $' + equipmentCost.toLocaleString() + '\n';
        text += 'Other:              $' + otherCost.toLocaleString() + '\n';
        text += '-'.repeat(40) + '\n';
        text += 'TOTAL:              $' + total.toLocaleString() + '\n';

        Export.copyText(text);
    }

    // ============================================================
    // TAB 4: MILESTONE TRACKER
    // ============================================================

    function addMilestone() {
        var nameEl = document.getElementById('pp-ms-name');
        var dateEl = document.getElementById('pp-ms-date');
        var statusEl = document.getElementById('pp-ms-status');

        var name = nameEl.value.trim();
        if (!name) return;

        milestones.push({
            id: milestoneIdCounter++,
            name: name,
            date: dateEl.value,
            status: statusEl.value
        });

        nameEl.value = '';
        dateEl.value = '';
        statusEl.value = 'not-started';

        renderMilestoneTable();
    }

    function removeMilestone(id) {
        milestones = milestones.filter(function(m) { return m.id !== id; });
        renderMilestoneTable();
    }

    function updateMilestoneStatus(id, newStatus) {
        milestones.forEach(function(m) {
            if (m.id === id) m.status = newStatus;
        });
        renderMilestoneTable();
    }

    function sortMilestones(field) {
        milestones.sort(function(a, b) {
            if (field === 'date') {
                return (a.date || '9999') < (b.date || '9999') ? -1 : 1;
            }
            if (field === 'status') {
                var order = { 'complete': 0, 'in-progress': 1, 'not-started': 2 };
                return (order[a.status] || 2) - (order[b.status] || 2);
            }
            return a.name.localeCompare(b.name);
        });
        renderMilestoneTable();
    }

    function renderMilestoneTable() {
        var tableEl = document.getElementById('pp-ms-table');
        var compEl = document.getElementById('pp-ms-completion');
        if (!tableEl) return;

        if (milestones.length === 0) {
            App.setTrustedHTML(tableEl, '<div style="color:var(--text-tertiary);font-size:0.85rem;padding:1rem 0">No milestones added yet. Use the form above to add project milestones.</div>');
            if (compEl) compEl.style.display = 'none';
            return;
        }

        var complete = milestones.filter(function(m) { return m.status === 'complete'; }).length;
        var pct = Math.round((complete / milestones.length) * 100);
        if (compEl) {
            compEl.style.display = 'block';
            var pctEl = document.getElementById('pp-ms-pct');
            var barEl = document.getElementById('pp-ms-bar');
            if (pctEl) pctEl.textContent = pct + '%';
            if (barEl) {
                barEl.style.width = pct + '%';
                barEl.style.background = pct === 100 ? 'var(--success)' : 'var(--accent)';
            }
        }

        var html = '<table style="width:100%;border-collapse:collapse;font-size:0.85rem">';
        html += '<thead><tr style="border-bottom:2px solid var(--border)">'
            + '<th style="text-align:left;padding:0.5rem;cursor:pointer" onclick="ProjectPlanner.sortMilestones(\'name\')">Milestone &#x25B4;&#x25BE;</th>'
            + '<th style="text-align:left;padding:0.5rem;cursor:pointer" onclick="ProjectPlanner.sortMilestones(\'date\')">Target Date &#x25B4;&#x25BE;</th>'
            + '<th style="text-align:left;padding:0.5rem;cursor:pointer" onclick="ProjectPlanner.sortMilestones(\'status\')">Status &#x25B4;&#x25BE;</th>'
            + '<th style="text-align:center;padding:0.5rem;width:100px">Actions</th>'
            + '</tr></thead><tbody>';

        milestones.forEach(function(m) {
            html += '<tr style="border-bottom:1px solid var(--border)">'
                + '<td style="padding:0.5rem">' + m.name + '</td>'
                + '<td style="padding:0.5rem;font-family:var(--font-mono)">' + (m.date || '--') + '</td>'
                + '<td style="padding:0.5rem">'
                + '<select class="form-select" style="font-size:0.8rem;padding:0.2rem 0.4rem" onchange="ProjectPlanner.updateMilestoneStatus(' + m.id + ', this.value)">'
                + '<option value="not-started"' + (m.status === 'not-started' ? ' selected' : '') + '>Not Started</option>'
                + '<option value="in-progress"' + (m.status === 'in-progress' ? ' selected' : '') + '>In Progress</option>'
                + '<option value="complete"' + (m.status === 'complete' ? ' selected' : '') + '>Complete</option>'
                + '</select></td>'
                + '<td style="text-align:center;padding:0.5rem">'
                + '<button class="btn btn-xs btn-secondary" onclick="ProjectPlanner.removeMilestone(' + m.id + ')" style="font-size:0.75rem">Remove</button>'
                + '</td></tr>';
        });

        html += '</tbody></table>';
        html += '<div style="font-size:0.78rem;color:var(--text-tertiary);margin-top:0.5rem">'
            + complete + ' of ' + milestones.length + ' milestones complete (' + pct + '%)</div>';

        App.setTrustedHTML(tableEl, html);
    }

    function exportMilestones() {
        if (milestones.length === 0) return;

        var complete = milestones.filter(function(m) { return m.status === 'complete'; }).length;
        var pct = Math.round((complete / milestones.length) * 100);

        var text = 'PROJECT MILESTONES\n';
        text += '='.repeat(60) + '\n\n';
        text += 'Milestone'.padEnd(30) + 'Target Date'.padEnd(15) + 'Status\n';
        text += '-'.repeat(60) + '\n';

        milestones.forEach(function(m) {
            var statusText = m.status === 'not-started' ? 'Not Started'
                : m.status === 'in-progress' ? 'In Progress' : 'Complete';
            text += m.name.padEnd(30) + (m.date || '--').padEnd(15) + statusText + '\n';
        });

        text += '-'.repeat(60) + '\n';
        text += 'Completion: ' + complete + '/' + milestones.length + ' (' + pct + '%)\n';

        Export.copyText(text);
    }

    // ============================================================
    // RESOURCE ALLOCATION TRACKER
    // ============================================================

    function addResource() {
        var nameEl = document.getElementById('pp-res-name');
        var roleEl = document.getElementById('pp-res-role');
        var effortEl = document.getElementById('pp-res-effort');
        var salaryEl = document.getElementById('pp-res-salary');
        var monthsEl = document.getElementById('pp-res-months');

        var name = nameEl.value.trim();
        if (!name) return;

        resources.push({
            id: resourceIdCounter++,
            name: name,
            role: roleEl.value,
            effort: parseInt(effortEl.value) || 25,
            salary: parseFloat(salaryEl.value) || 0,
            months: parseInt(monthsEl.value) || 12
        });

        nameEl.value = '';
        renderResourceTable();
    }

    function removeResource(id) {
        resources = resources.filter(function(r) { return r.id !== id; });
        renderResourceTable();
    }

    function renderResourceTable() {
        var el = document.getElementById('pp-res-table');
        if (!el) return;

        if (resources.length === 0) {
            App.setTrustedHTML(el, '<div style="color:var(--text-tertiary);font-size:0.85rem;padding:1rem 0">No team members added yet.</div>');
            return;
        }

        var totalCost = 0;
        var totalFTE = 0;
        var html = '<table style="width:100%;border-collapse:collapse;font-size:0.85rem">';
        html += '<thead><tr style="border-bottom:2px solid var(--border)">'
            + '<th style="text-align:left;padding:0.5rem">Name</th>'
            + '<th style="text-align:left;padding:0.5rem">Role</th>'
            + '<th style="text-align:right;padding:0.5rem">% Effort</th>'
            + '<th style="text-align:right;padding:0.5rem">Months</th>'
            + '<th style="text-align:right;padding:0.5rem">Cost</th>'
            + '<th style="text-align:center;padding:0.5rem">Actions</th>'
            + '</tr></thead><tbody>';

        resources.forEach(function(r) {
            var cost = (r.salary * (r.effort / 100) * (r.months / 12));
            totalCost += cost;
            totalFTE += r.effort / 100;
            html += '<tr style="border-bottom:1px solid var(--border)">'
                + '<td style="padding:0.5rem">' + r.name + '</td>'
                + '<td style="padding:0.5rem">' + r.role + '</td>'
                + '<td style="text-align:right;padding:0.5rem">' + r.effort + '%</td>'
                + '<td style="text-align:right;padding:0.5rem">' + r.months + '</td>'
                + '<td style="text-align:right;padding:0.5rem;font-family:var(--font-mono)">$' + Math.round(cost).toLocaleString() + '</td>'
                + '<td style="text-align:center;padding:0.5rem">'
                + '<button class="btn btn-xs btn-secondary" onclick="ProjectPlanner.removeResource(' + r.id + ')" style="font-size:0.75rem">Remove</button>'
                + '</td></tr>';
        });

        html += '<tr style="border-top:2px solid var(--border);font-weight:700">'
            + '<td style="padding:0.5rem" colspan="2">Total</td>'
            + '<td style="text-align:right;padding:0.5rem">' + (totalFTE * 100).toFixed(0) + '%</td>'
            + '<td style="padding:0.5rem"></td>'
            + '<td style="text-align:right;padding:0.5rem;font-family:var(--font-mono);color:var(--accent)">$' + Math.round(totalCost).toLocaleString() + '</td>'
            + '<td></td></tr>';
        html += '</tbody></table>';
        html += '<div style="font-size:0.78rem;color:var(--text-tertiary);margin-top:0.5rem">' + resources.length + ' team members, ' + totalFTE.toFixed(1) + ' total FTE</div>';

        App.setTrustedHTML(el, html);
    }

    function exportResources() {
        if (resources.length === 0) return;
        var text = 'RESOURCE ALLOCATION\n' + '='.repeat(60) + '\n\n';
        text += 'Name'.padEnd(20) + 'Role'.padEnd(18) + 'Effort'.padEnd(10) + 'Months'.padEnd(10) + 'Cost\n';
        text += '-'.repeat(60) + '\n';
        var totalCost = 0;
        resources.forEach(function(r) {
            var cost = (r.salary * (r.effort / 100) * (r.months / 12));
            totalCost += cost;
            text += r.name.padEnd(20) + r.role.padEnd(18) + (r.effort + '%').padEnd(10) + String(r.months).padEnd(10) + '$' + Math.round(cost).toLocaleString() + '\n';
        });
        text += '-'.repeat(60) + '\n';
        text += 'Total Personnel Cost: $' + Math.round(totalCost).toLocaleString() + '\n';
        Export.copyText(text);
    }

    // ============================================================
    // DETAILED BUDGET BUILDER
    // ============================================================

    function calcDetailedBudget() {
        var lineItems = [];
        for (var i = 0; i < 8; i++) {
            var catEl = document.getElementById('pp-bl-cat-' + i);
            var descEl = document.getElementById('pp-bl-desc-' + i);
            var costEl = document.getElementById('pp-bl-cost-' + i);
            if (catEl && catEl.value.trim() && costEl) {
                var cost = parseFloat(costEl.value) || 0;
                if (cost > 0) {
                    lineItems.push({ cat: catEl.value.trim(), desc: descEl ? descEl.value.trim() : '', cost: cost });
                }
            }
        }
        if (lineItems.length === 0) return;

        var indirectRate = parseFloat(document.getElementById('pp-bl-indirect').value) / 100 || 0;
        var years = parseInt(document.getElementById('pp-bl-years').value) || 1;
        var inflation = parseFloat(document.getElementById('pp-bl-inflation').value) / 100 || 0;

        var categories = {};
        lineItems.forEach(function(item) {
            if (!categories[item.cat]) categories[item.cat] = [];
            categories[item.cat].push(item);
        });

        var annualDirect = lineItems.reduce(function(sum, item) { return sum + item.cost; }, 0);

        var html = '<div class="result-panel">';
        html += '<div class="card-subtitle">Detailed Budget Summary</div>';

        // Line items by category
        html += '<table style="width:100%;border-collapse:collapse;font-size:0.85rem">';
        html += '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:0.5rem">Category</th><th style="text-align:left;padding:0.5rem">Description</th><th style="text-align:right;padding:0.5rem">Annual Cost</th></tr></thead><tbody>';
        var catKeys = Object.keys(categories);
        for (var c = 0; c < catKeys.length; c++) {
            var catName = catKeys[c];
            var catItems = categories[catName];
            var catTotal = 0;
            for (var ci = 0; ci < catItems.length; ci++) {
                catTotal += catItems[ci].cost;
                html += '<tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem">' + (ci === 0 ? '<strong>' + catName + '</strong>' : '') + '</td><td style="padding:0.5rem">' + catItems[ci].desc + '</td><td style="text-align:right;padding:0.5rem;font-family:var(--font-mono)">$' + catItems[ci].cost.toLocaleString() + '</td></tr>';
            }
            html += '<tr style="background:var(--bg-elevated)"><td colspan="2" style="padding:0.3rem 0.5rem;font-weight:600;font-size:0.8rem">' + catName + ' Subtotal</td><td style="text-align:right;padding:0.3rem 0.5rem;font-family:var(--font-mono);font-weight:600">$' + catTotal.toLocaleString() + '</td></tr>';
        }
        html += '</tbody></table>';

        // Multi-year projection
        html += '<div class="card-subtitle mt-2" style="font-weight:600;">Multi-Year Projection (' + years + ' years, ' + (inflation * 100).toFixed(1) + '% annual inflation)</div>';
        html += '<table style="width:100%;border-collapse:collapse;font-size:0.85rem">';
        html += '<thead><tr style="border-bottom:2px solid var(--border)"><th style="text-align:left;padding:0.5rem">Year</th><th style="text-align:right;padding:0.5rem">Direct Costs</th><th style="text-align:right;padding:0.5rem">Indirect (' + (indirectRate * 100).toFixed(0) + '%)</th><th style="text-align:right;padding:0.5rem">Total</th></tr></thead><tbody>';

        var grandTotal = 0;
        var grandDirect = 0;
        var grandIndirect = 0;
        for (var yr = 1; yr <= years; yr++) {
            var yearDirect = annualDirect * Math.pow(1 + inflation, yr - 1);
            var yearIndirect = yearDirect * indirectRate;
            var yearTotal = yearDirect + yearIndirect;
            grandDirect += yearDirect;
            grandIndirect += yearIndirect;
            grandTotal += yearTotal;
            html += '<tr style="border-bottom:1px solid var(--border)"><td style="padding:0.5rem">Year ' + yr + '</td><td style="text-align:right;padding:0.5rem;font-family:var(--font-mono)">$' + Math.round(yearDirect).toLocaleString() + '</td><td style="text-align:right;padding:0.5rem;font-family:var(--font-mono)">$' + Math.round(yearIndirect).toLocaleString() + '</td><td style="text-align:right;padding:0.5rem;font-family:var(--font-mono)">$' + Math.round(yearTotal).toLocaleString() + '</td></tr>';
        }
        html += '<tr style="border-top:2px solid var(--border);font-weight:700"><td style="padding:0.5rem">Grand Total</td><td style="text-align:right;padding:0.5rem;font-family:var(--font-mono)">$' + Math.round(grandDirect).toLocaleString() + '</td><td style="text-align:right;padding:0.5rem;font-family:var(--font-mono)">$' + Math.round(grandIndirect).toLocaleString() + '</td><td style="text-align:right;padding:0.5rem;font-family:var(--font-mono);color:var(--accent)">$' + Math.round(grandTotal).toLocaleString() + '</td></tr>';
        html += '</tbody></table>';

        html += '</div>';
        App.setTrustedHTML(document.getElementById('pp-bl-results'), html);
    }

    function copyDetailedBudget() {
        var el = document.getElementById('pp-bl-results');
        if (!el || !el.textContent.trim()) { calcDetailedBudget(); }
        var text = 'DETAILED BUDGET\n' + '='.repeat(50) + '\n\n';
        for (var i = 0; i < 8; i++) {
            var catEl = document.getElementById('pp-bl-cat-' + i);
            var descEl = document.getElementById('pp-bl-desc-' + i);
            var costEl = document.getElementById('pp-bl-cost-' + i);
            if (catEl && catEl.value.trim() && costEl && parseFloat(costEl.value) > 0) {
                text += catEl.value.padEnd(15) + (descEl ? descEl.value : '').padEnd(35) + '$' + parseFloat(costEl.value).toLocaleString() + '\n';
            }
        }
        var indirectRate = parseFloat(document.getElementById('pp-bl-indirect').value) || 0;
        var years = parseInt(document.getElementById('pp-bl-years').value) || 1;
        text += '\nIndirect rate: ' + indirectRate + '%, Duration: ' + years + ' years\n';
        Export.copyText(text);
    }

    // ============================================================
    // RISK ASSESSMENT MATRIX
    // ============================================================

    function addRisk() {
        var descEl = document.getElementById('pp-risk-desc');
        var mitigationEl = document.getElementById('pp-risk-mitigation');
        var likelihoodEl = document.getElementById('pp-risk-likelihood');
        var impactEl = document.getElementById('pp-risk-impact');

        var desc = descEl.value.trim();
        if (!desc) return;

        risks.push({
            id: riskIdCounter++,
            desc: desc,
            mitigation: mitigationEl.value.trim(),
            likelihood: parseInt(likelihoodEl.value) || 3,
            impact: parseInt(impactEl.value) || 3
        });

        descEl.value = '';
        mitigationEl.value = '';
        renderRiskTable();
        renderRiskMatrix();
    }

    function removeRisk(id) {
        risks = risks.filter(function(r) { return r.id !== id; });
        renderRiskTable();
        renderRiskMatrix();
    }

    function renderRiskTable() {
        var el = document.getElementById('pp-risk-table');
        if (!el) return;

        if (risks.length === 0) {
            App.setTrustedHTML(el, '<div style="color:var(--text-tertiary);font-size:0.85rem;padding:1rem 0">No risks added yet. Use the form above to identify project risks.</div>');
            return;
        }

        var html = '<table style="width:100%;border-collapse:collapse;font-size:0.85rem">';
        html += '<thead><tr style="border-bottom:2px solid var(--border)">'
            + '<th style="text-align:left;padding:0.5rem">Risk</th>'
            + '<th style="text-align:center;padding:0.5rem">L</th>'
            + '<th style="text-align:center;padding:0.5rem">I</th>'
            + '<th style="text-align:center;padding:0.5rem">Score</th>'
            + '<th style="text-align:left;padding:0.5rem">Level</th>'
            + '<th style="text-align:left;padding:0.5rem">Mitigation</th>'
            + '<th style="text-align:center;padding:0.5rem">Actions</th>'
            + '</tr></thead><tbody>';

        risks.sort(function(a, b) { return (b.likelihood * b.impact) - (a.likelihood * a.impact); });

        risks.forEach(function(r) {
            var score = r.likelihood * r.impact;
            var level = score <= 5 ? 'Low' : score <= 12 ? 'Medium' : 'High';
            var levelColor = score <= 5 ? 'var(--success)' : score <= 12 ? 'var(--warning)' : 'var(--danger)';
            html += '<tr style="border-bottom:1px solid var(--border)">'
                + '<td style="padding:0.5rem">' + r.desc + '</td>'
                + '<td style="text-align:center;padding:0.5rem">' + r.likelihood + '</td>'
                + '<td style="text-align:center;padding:0.5rem">' + r.impact + '</td>'
                + '<td style="text-align:center;padding:0.5rem;font-weight:700;color:' + levelColor + '">' + score + '</td>'
                + '<td style="padding:0.5rem;color:' + levelColor + ';font-weight:600">' + level + '</td>'
                + '<td style="padding:0.5rem;font-size:0.8rem">' + (r.mitigation || '--') + '</td>'
                + '<td style="text-align:center;padding:0.5rem"><button class="btn btn-xs btn-secondary" onclick="ProjectPlanner.removeRisk(' + r.id + ')" style="font-size:0.75rem">Remove</button></td>'
                + '</tr>';
        });

        html += '</tbody></table>';
        App.setTrustedHTML(el, html);
    }

    function renderRiskMatrix() {
        var el = document.getElementById('pp-risk-matrix');
        if (!el || risks.length === 0) {
            if (el) App.setTrustedHTML(el, '');
            return;
        }

        var html = '<div class="card-subtitle" style="font-weight:600;">Risk Heat Map (Likelihood x Impact)</div>';
        html += '<table style="border-collapse:collapse;font-size:0.8rem;margin:0 auto;">';
        html += '<thead><tr><th style="padding:4px 8px"></th>';
        for (var ih = 1; ih <= 5; ih++) {
            html += '<th style="padding:4px 8px;text-align:center">I=' + ih + '</th>';
        }
        html += '</tr></thead><tbody>';

        for (var li = 5; li >= 1; li--) {
            html += '<tr><td style="padding:4px 8px;font-weight:600">L=' + li + '</td>';
            for (var im = 1; im <= 5; im++) {
                var cellScore = li * im;
                var bg = cellScore <= 5 ? 'rgba(52,211,153,0.2)' : cellScore <= 12 ? 'rgba(251,191,36,0.2)' : 'rgba(248,113,113,0.3)';
                var riskCount = 0;
                for (var ri = 0; ri < risks.length; ri++) {
                    if (risks[ri].likelihood === li && risks[ri].impact === im) riskCount++;
                }
                var cellContent = riskCount > 0 ? '<strong style="color:var(--text)">' + riskCount + '</strong>' : '';
                html += '<td style="padding:8px 12px;text-align:center;background:' + bg + ';border:1px solid var(--border);min-width:40px">' + cellContent + '</td>';
            }
            html += '</tr>';
        }
        html += '</tbody></table>';
        html += '<div style="font-size:0.78rem;color:var(--text-tertiary);margin-top:0.3rem;text-align:center">L=Likelihood, I=Impact. Numbers show risk count in each cell.</div>';

        App.setTrustedHTML(el, html);
    }

    // ============================================================
    // PROJECT TEMPLATE LIBRARY
    // ============================================================

    var templateData = [
        { milestones: ['Protocol finalized', 'IRB approval obtained', 'DSMB established', 'First patient enrolled', '50% enrollment reached', 'Last patient enrolled', 'Database lock', 'Primary analysis complete', 'Manuscript submitted'] },
        { milestones: ['Protocol finalized', 'IRB approval obtained', 'Data collection tools validated', 'Cohort assembly complete', 'Interim analysis', 'End of follow-up', 'Database lock', 'Manuscript submitted'] },
        { milestones: ['Protocol registered (PROSPERO)', 'Search strategy finalized', 'Title/abstract screening complete', 'Full-text screening complete', 'Data extraction complete', 'Risk of bias assessed', 'Meta-analysis complete', 'Manuscript submitted'] }
    ];

    function toggleTemplate(idx) {
        var detail = document.getElementById('pp-tpl-detail-' + idx);
        var arrow = document.getElementById('pp-tpl-arrow-' + idx);
        if (detail) {
            detail.classList.toggle('hidden');
            if (arrow) arrow.style.transform = detail.classList.contains('hidden') ? '' : 'rotate(180deg)';
        }
    }

    function loadTemplate(idx) {
        if (!templateData[idx]) return;
        milestones = [];
        milestoneIdCounter = 0;
        templateData[idx].milestones.forEach(function(ms) {
            milestones.push({ id: milestoneIdCounter++, name: ms, date: '', status: 'not-started' });
        });
        switchTab('milestones');
        renderMilestoneTable();
    }

    // ============================================================
    // REGISTER
    // ============================================================

    App.registerModule(MODULE_ID, { render: render });

    window.ProjectPlanner = {
        switchTab: switchTab,
        generateTimeline: generateTimeline,
        copyTimeline: copyTimeline,
        updateProgress: updateProgress,
        exportChecklist: exportChecklist,
        calculateBudget: calculateBudget,
        copyBudget: copyBudget,
        addMilestone: addMilestone,
        removeMilestone: removeMilestone,
        updateMilestoneStatus: updateMilestoneStatus,
        sortMilestones: sortMilestones,
        exportMilestones: exportMilestones,
        addResource: addResource,
        removeResource: removeResource,
        exportResources: exportResources,
        calcDetailedBudget: calcDetailedBudget,
        copyDetailedBudget: copyDetailedBudget,
        addRisk: addRisk,
        removeRisk: removeRisk,
        toggleTemplate: toggleTemplate,
        loadTemplate: loadTemplate
    };
})();
