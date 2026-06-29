/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Load the module code
const hypothesisBuilderPath = path.resolve(__dirname, '../js/modules/hypothesis-builder.js');
const hypothesisBuilderCode = fs.readFileSync(hypothesisBuilderPath, 'utf-8');

describe('Hypothesis Builder Module', () => {
    let mockApp;
    let mockExport;
    let container;

    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = '<div id="module-container"></div>';
        container = document.getElementById('module-container');

        // Mock App globally
        mockApp = {
            createModuleLayout: jest.fn().mockReturnValue('<div>Mock Layout</div>'),
            setTrustedHTML: jest.fn((el, html) => {
                if (el) el.innerHTML = html;
            }),
            registerModule: jest.fn(),
            tooltip: jest.fn(text => `[Tooltip: ${text}]`),
            autoSaveInputs: jest.fn()
        };
        global.App = mockApp;

        // Mock Export globally
        mockExport = {
            showToast: jest.fn(),
            copyText: jest.fn(),
            addToHistory: jest.fn()
        };
        global.Export = mockExport;

        // Evaluate the module code in the current context
        eval(hypothesisBuilderCode);

        // Render the module into the container
        const moduleRegistration = mockApp.registerModule.mock.calls[0][1];
        moduleRegistration.render(container);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('module registers with App', () => {
        expect(mockApp.registerModule).toHaveBeenCalledWith('hypothesis-builder', expect.any(Object));
    });

    test('window.HypothesisBuilder is populated', () => {
        expect(window.HypothesisBuilder).toBeDefined();
        expect(typeof window.HypothesisBuilder.switchTab).toBe('function');
        expect(typeof window.HypothesisBuilder.addVariable).toBe('function');
    });

    test('switchTab changes the active tab', () => {
        // Find a tab to click
        const buttons = document.querySelectorAll('.tab');
        const targetTab = buttons[1].dataset.tab;

        window.HypothesisBuilder.switchTab(targetTab);

        // Assert the tab became active
        const tabs = document.querySelectorAll('.tab');
        let activeTabFound = false;
        tabs.forEach(tab => {
            if (tab.dataset.tab === targetTab) {
                expect(tab.classList.contains('active')).toBe(true);
                activeTabFound = true;
            } else {
                expect(tab.classList.contains('active')).toBe(false);
            }
        });
        expect(activeTabFound).toBe(true);

        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            if (content.id === `tab-${targetTab}`) {
                expect(content.classList.contains('active')).toBe(true);
            } else {
                expect(content.classList.contains('active')).toBe(false);
            }
        });
    });

    test('addVariable adds a variable to the table', () => {
        // Setup values
        document.getElementById('hb-var-name').value = 'Age';
        document.getElementById('hb-var-class').value = 'confounder';

        window.HypothesisBuilder.addVariable();

        // The innerHTML of the variable table should be updated via App.setTrustedHTML
        expect(mockApp.setTrustedHTML).toHaveBeenCalled();
        const htmlArgs = mockApp.setTrustedHTML.mock.calls.find(call => call[0].id === 'hb-var-table');
        expect(htmlArgs).toBeDefined();
        expect(htmlArgs[1]).toContain('Age');
        expect(htmlArgs[1]).toContain('Confounder'); // Title cased in output

        // Reset state
        window.HypothesisBuilder.clearVariables();
    });

    test('updateChecklistScore updates the checklist score based on checkboxes', () => {
        // All checkboxes are currently unchecked initially
        window.HypothesisBuilder.updateChecklistScore();
        let htmlArgs = mockApp.setTrustedHTML.mock.calls.find(call => call[0].id === 'hb-checklist-score');
        expect(htmlArgs[1]).toContain('0 / 12');

        // Check a few boxes
        document.getElementById('hb-chk-specific').checked = true;
        document.getElementById('hb-chk-measurable').checked = true;

        window.HypothesisBuilder.updateChecklistScore();

        // Fetch the most recent call
        const calls = mockApp.setTrustedHTML.mock.calls.filter(call => call[0].id === 'hb-checklist-score');
        htmlArgs = calls[calls.length - 1];
        expect(htmlArgs[1]).toContain('2 / 12');
    });

    test('generateAimsPage shows error toast if title is missing', () => {
        document.getElementById('hb-aim-title').value = '';
        window.HypothesisBuilder.generateAimsPage();

        expect(mockExport.showToast).toHaveBeenCalledWith('Please enter at least a project title', 'error');
    });

    test('removeVariable removes a variable from the table', () => {
        // Setup values
        document.getElementById('hb-var-name').value = 'Age';
        document.getElementById('hb-var-class').value = 'confounder';
        window.HypothesisBuilder.addVariable();

        // The ID will be 1 as it's the first variable
        window.HypothesisBuilder.removeVariable(1);

        // Assert table is updated and does not contain Age
        const htmlArgs = mockApp.setTrustedHTML.mock.calls.filter(call => call[0].id === 'hb-var-table');
        const lastCall = htmlArgs[htmlArgs.length - 1];
        expect(lastCall[1]).not.toContain('Age');
    });

    test('updateFramework updates inputs for PICO vs PECO', () => {
        document.getElementById('hb-framework').value = 'peco';
        window.HypothesisBuilder.updateFramework();

        expect(document.getElementById('hb-ie-label').textContent).toBe('E - Exposure');
        expect(document.getElementById('hb-intervention').placeholder).toBe('e.g., Exposure to air pollution (PM2.5 > 25 ug/m3)');
    });

    test('generateHypothesis outputs valid hypotheses', () => {
        document.getElementById('hb-population').value = 'Adults with hypertension';
        document.getElementById('hb-intervention').value = 'Dietary intervention';
        document.getElementById('hb-comparison').value = 'Usual care';
        document.getElementById('hb-outcome').value = 'Lower blood pressure';

        window.HypothesisBuilder.generateHypothesis();

        const htmlArgs = mockApp.setTrustedHTML.mock.calls.find(call => call[0].id === 'hb-pico-results');
        expect(htmlArgs[1]).toContain('Adults with hypertension');
        expect(htmlArgs[1]).toContain('Dietary intervention');
    });

    test('generatePICOT statements and loads example', () => {
        // Load Example
        window.HypothesisBuilder.loadPICOTExample();
        expect(document.getElementById('hb-picot-p').value).toContain('acute ischemic stroke');

        // Generate Statement
        window.HypothesisBuilder.generatePICOT();
        const htmlArgs = mockApp.setTrustedHTML.mock.calls.find(call => call[0].id === 'hb-picot-results');
        expect(htmlArgs[1]).toContain('acute ischemic stroke');
    });

    test('showHypothesisType displays corresponding information', () => {
        document.getElementById('hb-hyp-type').value = 'superiority';
        window.HypothesisBuilder.showHypothesisType();

        const htmlArgs = mockApp.setTrustedHTML.mock.calls.find(call => call[0].id === 'hb-hyp-type-results');
        expect(htmlArgs[1]).toContain('Superiority Hypothesis');
    });
});
