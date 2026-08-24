/**
 * @jest-environment jsdom
 */

// Mock global dependencies
global.App = {
    createModuleLayout: jest.fn((title, desc) => `<div class="module-header"><h1>${title}</h1><p>${desc}</p></div>`),
    setTrustedHTML: jest.fn((el, html) => { if (el) el.innerHTML = html; }),
    autoSaveInputs: jest.fn(),
    registerModule: jest.fn()
};

global.Export = {
    copyText: jest.fn()
};

global.Charts = {
    setupCanvas: jest.fn((canvas) => canvas.getContext('2d'))
};

describe('Project Planner Module', () => {
    let container;

    beforeEach(() => {
        document.body.innerHTML = '<div id="module-container"></div>';
        container = document.getElementById('module-container');

        // Mock HTMLCanvasElement context
        HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
            scale: jest.fn(),
            fillRect: jest.fn(),
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            stroke: jest.fn(),
            fill: jest.fn(),
            fillText: jest.fn(),
            quadraticCurveTo: jest.fn(),
            closePath: jest.fn(),
            arc: jest.fn(),
            rect: jest.fn()
        }));

        jest.clearAllMocks();

        jest.isolateModules(() => {
            require('../../js/modules/project-planner.js');
        });
    });

    it('should register the project-planner module', () => {
        expect(App.registerModule).toHaveBeenCalledWith('project-planner', expect.any(Object));
    });

    it('should render the module layout and components', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        expect(App.createModuleLayout).toHaveBeenCalledWith(
            'Project Planner',
            expect.any(String)
        );
        expect(App.setTrustedHTML).toHaveBeenCalledWith(container, expect.stringContaining('Project Planner'));
        expect(App.autoSaveInputs).toHaveBeenCalledWith(container, 'project-planner');
    });

    it('should switch tabs properly', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        window.ProjectPlanner.switchTab('checklist');
        const checklistTab = container.querySelector('#pp-checklist');
        expect(checklistTab.style.display).toBe('block');

        window.ProjectPlanner.switchTab('timeline');
        const timelineTab = container.querySelector('#pp-timeline');
        expect(timelineTab.style.display).toBe('block');
    });

    it('should handle timeline generation and copying', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        window.ProjectPlanner.generateTimeline();
        expect(document.getElementById('pp-gantt-canvas')).not.toBeNull();

        window.ProjectPlanner.copyTimeline();
        expect(Export.copyText).toHaveBeenCalled();
    });

    it('should calculate and copy basic budget', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        window.ProjectPlanner.calculateBudget();
        expect(document.getElementById('pp-budget-results').innerHTML).toContain('Total Budget');

        window.ProjectPlanner.copyBudget();
        expect(Export.copyText).toHaveBeenCalled();
    });

    it('should manage milestones (add, sort, update status, remove, export)', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        const nameInput = document.getElementById('pp-ms-name');
        const dateInput = document.getElementById('pp-ms-date');
        nameInput.value = 'Ethics Approval';
        dateInput.value = '2025-06-01';

        window.ProjectPlanner.addMilestone();
        expect(document.getElementById('pp-ms-table').innerHTML).toContain('Ethics Approval');

        window.ProjectPlanner.updateMilestoneStatus(0, 'complete');
        expect(document.getElementById('pp-ms-table').innerHTML).toContain('complete');

        window.ProjectPlanner.sortMilestones('name');

        window.ProjectPlanner.exportMilestones();
        expect(Export.copyText).toHaveBeenCalled();

        window.ProjectPlanner.removeMilestone(0);
        expect(document.getElementById('pp-ms-table').innerHTML).toContain('No milestones added yet');
    });

    it('should manage resources and detailed budget', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        const nameInput = document.getElementById('pp-res-name');
        nameInput.value = 'Dr. Alice';
        window.ProjectPlanner.addResource();
        expect(document.getElementById('pp-res-table').innerHTML).toContain('Dr. Alice');

        window.ProjectPlanner.exportResources();
        expect(Export.copyText).toHaveBeenCalled();

        window.ProjectPlanner.removeResource(0);
        expect(document.getElementById('pp-res-table').innerHTML).toContain('No team members added yet');

        window.ProjectPlanner.calcDetailedBudget();
        expect(document.getElementById('pp-bl-results').innerHTML).toContain('Multi-Year Projection');

        window.ProjectPlanner.copyDetailedBudget();
        expect(Export.copyText).toHaveBeenCalled();
    });

    it('should manage risk assessment and templates', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(container);

        const descInput = document.getElementById('pp-risk-desc');
        descInput.value = 'Slow recruitment';
        window.ProjectPlanner.addRisk();
        expect(document.getElementById('pp-risk-table').innerHTML).toContain('Slow recruitment');

        window.ProjectPlanner.removeRisk(0);
        expect(document.getElementById('pp-risk-table').innerHTML).toContain('No risks added yet');

        window.ProjectPlanner.toggleTemplate(0);
        window.ProjectPlanner.loadTemplate(0);
        expect(document.getElementById('pp-ms-table').innerHTML).toContain('Protocol finalized');
    });
});
