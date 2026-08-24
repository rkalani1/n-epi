/**
 * @jest-environment jsdom
 */

// Mock global dependencies
global.App = {
    createModuleLayout: jest.fn().mockReturnValue('<div id="mock-layout"></div>'),
    setTrustedHTML: jest.fn((el, html) => { if (el) el.innerHTML = html; }),
    autoSaveInputs: jest.fn(),
    registerModule: jest.fn()
};

global.Export = {
    copyText: jest.fn()
};

describe('Project Planner Module', () => {
    let container;

    beforeEach(() => {
        document.body.innerHTML = '<div id="module-container"></div>';
        container = document.getElementById('module-container');
        jest.clearAllMocks();

        // Canvas 2D context mock
        HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
            scale: jest.fn(),
            fillRect: jest.fn(),
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            stroke: jest.fn(),
            fill: jest.fn(),
            fillText: jest.fn(),
            arc: jest.fn(),
            quadraticCurveTo: jest.fn(),
            closePath: jest.fn()
        }));

        jest.isolateModules(() => {
            require('../../js/modules/project-planner.js');
        });
    });

    it('should register the module', () => {
        expect(App.registerModule).toHaveBeenCalledWith('project-planner', expect.any(Object));
    });

    it('should render the full layout', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        expect(App.createModuleLayout).toHaveBeenCalledWith('Project Planner', expect.any(String));
        expect(App.setTrustedHTML).toHaveBeenCalled();
        expect(App.autoSaveInputs).toHaveBeenCalledWith(container, 'project-planner');

        // Check cards and sections present in DOM
        expect(container.innerHTML).toContain('📚 Learn &amp; Reference');
        expect(container.innerHTML).toContain('Timeline Builder');
        expect(container.innerHTML).toContain('Resource Allocation Tracker');
        expect(container.innerHTML).toContain('Detailed Budget Builder');
        expect(container.innerHTML).toContain('Risk Assessment Matrix');
        expect(container.innerHTML).toContain('Project Template Library');
        expect(container.innerHTML).toContain('Advanced Project Management');
    });

    it('should switch tabs properly', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        window.ProjectPlanner.switchTab('checklist');
        const checklistTab = container.querySelector('#pp-checklist');
        expect(checklistTab.style.display).toBe('block');

        const timelineTab = container.querySelector('#pp-timeline');
        expect(timelineTab.style.display).toBe('none');
    });

    it('should generate timeline and copy timeline text', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        const studyTypeSelect = container.querySelector('#pp-study-type');
        studyTypeSelect.value = 'rct';

        window.ProjectPlanner.generateTimeline();
        expect(container.querySelector('#pp-gantt-canvas')).not.toBeNull();

        window.ProjectPlanner.copyTimeline();
        expect(Export.copyText).toHaveBeenCalled();
        expect(Export.copyText.mock.calls[0][0]).toContain('PROJECT TIMELINE:');
    });

    it('should update checklist progress and export checklist', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        const chk1 = container.querySelector('#pp-chk-sd1');
        if (chk1) {
            chk1.checked = true;
            chk1.dispatchEvent(new Event('change'));
            window.ProjectPlanner.updateProgress();
            const progressPct = container.querySelector('#pp-progress-pct');
            expect(progressPct.textContent).not.toBe('0%');
        }

        window.ProjectPlanner.exportChecklist();
        expect(Export.copyText).toHaveBeenCalled();
        expect(Export.copyText.mock.calls[Export.copyText.mock.calls.length - 1][0]).toContain('PRE-STUDY CHECKLIST');
    });

    it('should calculate budget and copy budget', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        container.querySelector('#pp-num-participants').value = '50';
        container.querySelector('#pp-cost-per-participant').value = '1000';

        window.ProjectPlanner.calculateBudget();

        const results = container.querySelector('#pp-budget-results');
        expect(results.innerHTML).toContain('Total Budget');

        window.ProjectPlanner.copyBudget();
        expect(Export.copyText).toHaveBeenCalled();
        expect(Export.copyText.mock.calls[Export.copyText.mock.calls.length - 1][0]).toContain('BUDGET SUMMARY');
    });

    it('should manage milestones (add, status update, sort, remove, export)', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        const nameInput = container.querySelector('#pp-ms-name');
        const dateInput = container.querySelector('#pp-ms-date');
        const statusSelect = container.querySelector('#pp-ms-status');

        nameInput.value = 'Ethics Approval';
        dateInput.value = '2025-06-01';
        statusSelect.value = 'in-progress';

        window.ProjectPlanner.addMilestone();

        const table = container.querySelector('#pp-ms-table');
        expect(table.innerHTML).toContain('Ethics Approval');

        window.ProjectPlanner.updateMilestoneStatus(0, 'complete');
        expect(table.innerHTML).toContain('selected');

        window.ProjectPlanner.sortMilestones('name');

        window.ProjectPlanner.exportMilestones();
        expect(Export.copyText).toHaveBeenCalled();

        window.ProjectPlanner.removeMilestone(0);
        expect(table.innerHTML).toContain('No milestones added yet');
    });

    it('should manage resources (add, remove, export)', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        const nameInput = container.querySelector('#pp-res-name');
        nameInput.value = 'Dr. Jane Doe';

        window.ProjectPlanner.addResource();

        const table = container.querySelector('#pp-res-table');
        expect(table.innerHTML).toContain('Dr. Jane Doe');

        window.ProjectPlanner.exportResources();
        expect(Export.copyText).toHaveBeenCalled();

        window.ProjectPlanner.removeResource(0);
        expect(table.innerHTML).toContain('No team members added yet');
    });

    it('should calculate detailed budget and copy detailed budget', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        window.ProjectPlanner.calcDetailedBudget();

        const results = container.querySelector('#pp-bl-results');
        expect(results.innerHTML).toContain('Detailed Budget Summary');

        window.ProjectPlanner.copyDetailedBudget();
        expect(Export.copyText).toHaveBeenCalled();
    });

    it('should manage risks (add, remove)', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        const descInput = container.querySelector('#pp-risk-desc');
        const mitInput = container.querySelector('#pp-risk-mitigation');

        descInput.value = 'Recruitment delay';
        mitInput.value = 'Expand sites';

        window.ProjectPlanner.addRisk();

        const table = container.querySelector('#pp-risk-table');
        const matrix = container.querySelector('#pp-risk-matrix');

        expect(table.innerHTML).toContain('Recruitment delay');
        expect(matrix.innerHTML).toContain('Risk Heat Map');

        window.ProjectPlanner.removeRisk(0);
        expect(table.innerHTML).toContain('No risks added yet');
    });

    it('should toggle and load project template library', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        window.ProjectPlanner.toggleTemplate(0);
        const detail = container.querySelector('#pp-tpl-detail-0');
        expect(detail.classList.contains('hidden')).toBe(false);

        window.ProjectPlanner.loadTemplate(0);
        const msTable = container.querySelector('#pp-ms-table');
        expect(msTable.innerHTML).toContain('Protocol finalized');
    });
});
