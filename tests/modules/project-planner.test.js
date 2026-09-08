/** @jest-environment jsdom */

const fs = require('fs');
const path = require('path');

describe('Project Planner Module', () => {
    let mockCtx;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '<div id="container"></div>';

        mockCtx = {
            fillRect: jest.fn(),
            fillText: jest.fn(),
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            quadraticCurveTo: jest.fn(),
            closePath: jest.fn(),
            fill: jest.fn(),
            stroke: jest.fn(),
            arc: jest.fn(),
            scale: jest.fn(),
            getContext: jest.fn()
        };

        // Mock global App and Export objects
        window.App = {
            createModuleLayout: jest.fn((title, desc) => `<div class="module-title">${title}</div><div class="module-desc">${desc}</div>`),
            setTrustedHTML: jest.fn((container, html) => {
                if (container) container.innerHTML = html;
            }),
            autoSaveInputs: jest.fn(),
            registerModule: jest.fn()
        };
        window.Export = {
            showToast: jest.fn(),
            copyText: jest.fn()
        };
        window.Charts = {
            setupCanvas: jest.fn((canvas, width, height) => {
                return mockCtx;
            })
        };

        // Load project-planner.js
        const projectPlannerPath = path.resolve(__dirname, '../../js/modules/project-planner.js');
        const code = fs.readFileSync(projectPlannerPath, 'utf8');
        eval(code);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('API Exposure', () => {
        test('module registers with App and exposes ProjectPlanner API', () => {
            expect(window.App.registerModule).toHaveBeenCalledWith('project-planner', expect.any(Object));
            expect(window.ProjectPlanner).toBeDefined();
            expect(typeof window.ProjectPlanner.switchTab).toBe('function');
            expect(typeof window.ProjectPlanner.generateTimeline).toBe('function');
            expect(typeof window.ProjectPlanner.copyTimeline).toBe('function');
            expect(typeof window.ProjectPlanner.updateProgress).toBe('function');
            expect(typeof window.ProjectPlanner.exportChecklist).toBe('function');
            expect(typeof window.ProjectPlanner.calculateBudget).toBe('function');
            expect(typeof window.ProjectPlanner.copyBudget).toBe('function');
            expect(typeof window.ProjectPlanner.addMilestone).toBe('function');
            expect(typeof window.ProjectPlanner.removeMilestone).toBe('function');
            expect(typeof window.ProjectPlanner.updateMilestoneStatus).toBe('function');
            expect(typeof window.ProjectPlanner.sortMilestones).toBe('function');
            expect(typeof window.ProjectPlanner.exportMilestones).toBe('function');
            expect(typeof window.ProjectPlanner.addResource).toBe('function');
            expect(typeof window.ProjectPlanner.removeResource).toBe('function');
            expect(typeof window.ProjectPlanner.exportResources).toBe('function');
            expect(typeof window.ProjectPlanner.calcDetailedBudget).toBe('function');
            expect(typeof window.ProjectPlanner.copyDetailedBudget).toBe('function');
            expect(typeof window.ProjectPlanner.addRisk).toBe('function');
            expect(typeof window.ProjectPlanner.removeRisk).toBe('function');
            expect(typeof window.ProjectPlanner.toggleTemplate).toBe('function');
            expect(typeof window.ProjectPlanner.loadTemplate).toBe('function');
        });
    });

    describe('Render Function', () => {
        test('render sets up HTML layout and initializes state', () => {
            const container = document.getElementById('container');
            const registeredModule = window.App.registerModule.mock.calls[0][1];
            registeredModule.render(container);

            expect(window.App.createModuleLayout).toHaveBeenCalledWith('Project Planner', expect.any(String));
            expect(window.App.setTrustedHTML).toHaveBeenCalled();
            expect(window.App.autoSaveInputs).toHaveBeenCalledWith(container, 'project-planner');

            expect(document.getElementById('pp-timeline')).not.toBeNull();
            expect(document.getElementById('pp-checklist')).not.toBeNull();
            expect(document.getElementById('pp-budget')).not.toBeNull();
            expect(document.getElementById('pp-milestones')).not.toBeNull();
        });
    });

    describe('Tab Switching', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('switchTab toggles tab visibility and active state', () => {
            window.ProjectPlanner.switchTab('checklist');

            const checklistTab = document.getElementById('pp-checklist');
            const timelineTab = document.getElementById('pp-timeline');
            const checklistBtn = document.getElementById('pp-btn-checklist');

            expect(checklistTab.style.display).toBe('block');
            expect(timelineTab.style.display).toBe('none');
            expect(checklistBtn.classList.contains('active')).toBe(true);
        });
    });

    describe('Timeline Builder', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('generateTimeline draws on canvas without error', () => {
            document.getElementById('pp-title').value = 'Test Trial';
            document.getElementById('pp-study-type').value = 'rct';
            expect(() => window.ProjectPlanner.generateTimeline()).not.toThrow();
            expect(mockCtx.fillRect).toHaveBeenCalled();
        });

        test('copyTimeline copies timeline summary to clipboard', () => {
            document.getElementById('pp-title').value = 'Test Trial';
            document.getElementById('pp-start-date').value = '2025-01-01';
            document.getElementById('pp-study-type').value = 'cohort';

            window.ProjectPlanner.copyTimeline();
            expect(window.Export.copyText).toHaveBeenCalled();
            const copiedText = window.Export.copyText.mock.calls[0][0];
            expect(copiedText).toContain('PROJECT TIMELINE: Test Trial');
            expect(copiedText).toContain('Start Date: 2025-01-01');
        });
    });

    describe('Pre-Study Checklist', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('updateProgress updates progress percentage and bar width', () => {
            const chk1 = document.getElementById('pp-chk-sd1');
            const chk2 = document.getElementById('pp-chk-sd2');
            if (chk1) chk1.checked = true;
            if (chk2) chk2.checked = true;

            window.ProjectPlanner.updateProgress();

            const pctEl = document.getElementById('pp-progress-pct');
            expect(pctEl.textContent).not.toBe('0%');
        });

        test('exportChecklist exports checklist text to clipboard', () => {
            const chk1 = document.getElementById('pp-chk-sd1');
            if (chk1) chk1.checked = true;

            window.ProjectPlanner.exportChecklist();
            expect(window.Export.copyText).toHaveBeenCalled();
            const text = window.Export.copyText.mock.calls[0][0];
            expect(text).toContain('PRE-STUDY CHECKLIST');
            expect(text).toContain('[x] Research question defined');
        });
    });

    describe('Budget Estimator', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('calculateBudget updates budget results table', () => {
            document.getElementById('pp-num-participants').value = '50';
            document.getElementById('pp-cost-per-participant').value = '1000';
            document.getElementById('pp-personnel-cost').value = '100000';

            window.ProjectPlanner.calculateBudget();

            const resultsEl = document.getElementById('pp-budget-results');
            expect(resultsEl.innerHTML).toContain('Total Budget');
            expect(resultsEl.innerHTML).toContain('$185,000');
            expect(mockCtx.fill).toHaveBeenCalled();
        });

        test('copyBudget copies budget summary to clipboard', () => {
            document.getElementById('pp-num-participants').value = '10';
            document.getElementById('pp-cost-per-participant').value = '500';

            window.ProjectPlanner.copyBudget();
            expect(window.Export.copyText).toHaveBeenCalled();
            const text = window.Export.copyText.mock.calls[0][0];
            expect(text).toContain('BUDGET SUMMARY');
            expect(text).toContain('Participant Costs:  $5,000');
        });
    });

    describe('Milestone Tracker', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('addMilestone adds milestone and renders table', () => {
            document.getElementById('pp-ms-name').value = 'Ethics Approval';
            document.getElementById('pp-ms-date').value = '2025-06-01';
            document.getElementById('pp-ms-status').value = 'in-progress';

            window.ProjectPlanner.addMilestone();

            const tableEl = document.getElementById('pp-ms-table');
            expect(tableEl.innerHTML).toContain('Ethics Approval');
            expect(tableEl.innerHTML).toContain('2025-06-01');
        });

        test('updateMilestoneStatus and removeMilestone update the list', () => {
            document.getElementById('pp-ms-name').value = 'Milestone 1';
            window.ProjectPlanner.addMilestone();

            window.ProjectPlanner.updateMilestoneStatus(0, 'complete');
            expect(document.getElementById('pp-ms-pct').textContent).toBe('100%');

            window.ProjectPlanner.removeMilestone(0);
            expect(document.getElementById('pp-ms-table').innerHTML).toContain('No milestones added yet');
        });

        test('sortMilestones reorders milestone list', () => {
            document.getElementById('pp-ms-name').value = 'Beta';
            document.getElementById('pp-ms-date').value = '2025-02-01';
            window.ProjectPlanner.addMilestone();

            document.getElementById('pp-ms-name').value = 'Alpha';
            document.getElementById('pp-ms-date').value = '2025-01-01';
            window.ProjectPlanner.addMilestone();

            window.ProjectPlanner.sortMilestones('name');
            let tableText = document.getElementById('pp-ms-table').innerHTML;
            expect(tableText.indexOf('Alpha')).toBeLessThan(tableText.indexOf('Beta'));

            window.ProjectPlanner.sortMilestones('date');
            tableText = document.getElementById('pp-ms-table').innerHTML;
            expect(tableText.indexOf('Alpha')).toBeLessThan(tableText.indexOf('Beta'));
        });

        test('exportMilestones copies milestone list to clipboard', () => {
            document.getElementById('pp-ms-name').value = 'Milestone 1';
            window.ProjectPlanner.addMilestone();

            window.ProjectPlanner.exportMilestones();
            expect(window.Export.copyText).toHaveBeenCalled();
            const text = window.Export.copyText.mock.calls[0][0];
            expect(text).toContain('PROJECT MILESTONES');
            expect(text).toContain('Milestone 1');
        });
    });

    describe('Resource Allocation Tracker', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('addResource and removeResource modify team table', () => {
            document.getElementById('pp-res-name').value = 'Dr. Jane';
            document.getElementById('pp-res-role').value = 'PI';
            document.getElementById('pp-res-effort').value = '50';
            document.getElementById('pp-res-salary').value = '100000';

            window.ProjectPlanner.addResource();

            const tableEl = document.getElementById('pp-res-table');
            expect(tableEl.innerHTML).toContain('Dr. Jane');
            expect(tableEl.innerHTML).toContain('PI');

            window.ProjectPlanner.removeResource(0);
            expect(tableEl.innerHTML).toContain('No team members added yet');
        });

        test('exportResources copies team breakdown to clipboard', () => {
            document.getElementById('pp-res-name').value = 'Dr. Jane';
            window.ProjectPlanner.addResource();

            window.ProjectPlanner.exportResources();
            expect(window.Export.copyText).toHaveBeenCalled();
            const text = window.Export.copyText.mock.calls[0][0];
            expect(text).toContain('RESOURCE ALLOCATION');
            expect(text).toContain('Dr. Jane');
        });
    });

    describe('Detailed Budget Builder', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('calcDetailedBudget calculates multi-year budget', () => {
            window.ProjectPlanner.calcDetailedBudget();

            const resultsEl = document.getElementById('pp-bl-results');
            expect(resultsEl.innerHTML).toContain('Detailed Budget Summary');
            expect(resultsEl.innerHTML).toContain('Multi-Year Projection');
            expect(resultsEl.innerHTML).toContain('Grand Total');
        });

        test('copyDetailedBudget exports budget text', () => {
            window.ProjectPlanner.copyDetailedBudget();
            expect(window.Export.copyText).toHaveBeenCalled();
            const text = window.Export.copyText.mock.calls[0][0];
            expect(text).toContain('DETAILED BUDGET');
            expect(text).toContain('Personnel');
        });
    });

    describe('Risk Assessment Matrix', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('addRisk and removeRisk update table and matrix', () => {
            document.getElementById('pp-risk-desc').value = 'Recruitment delay';
            document.getElementById('pp-risk-mitigation').value = 'Add secondary site';
            document.getElementById('pp-risk-likelihood').value = '4';
            document.getElementById('pp-risk-impact').value = '4';

            window.ProjectPlanner.addRisk();

            const tableEl = document.getElementById('pp-risk-table');
            const matrixEl = document.getElementById('pp-risk-matrix');

            expect(tableEl.innerHTML).toContain('Recruitment delay');
            expect(tableEl.innerHTML).toContain('Score');
            expect(tableEl.innerHTML).toContain('16');
            expect(matrixEl.innerHTML).toContain('Risk Heat Map');

            window.ProjectPlanner.removeRisk(0);
            expect(tableEl.innerHTML).toContain('No risks added yet');
        });
    });

    describe('Template Library', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('toggleTemplate toggles visibility', () => {
            window.ProjectPlanner.toggleTemplate(0);
            const detailEl = document.getElementById('pp-tpl-detail-0');
            expect(detailEl.classList.contains('hidden')).toBe(false);
        });

        test('loadTemplate populates milestones and switches to milestone tab', () => {
            window.ProjectPlanner.loadTemplate(0);

            const milestonesTab = document.getElementById('pp-milestones');
            const tableEl = document.getElementById('pp-ms-table');

            expect(milestonesTab.style.display).toBe('block');
            expect(tableEl.innerHTML).toContain('Protocol finalized');
            expect(tableEl.innerHTML).toContain('IRB approval obtained');
        });
    });
});
