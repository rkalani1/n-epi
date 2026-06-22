const fs = require('fs');
const path = require('path');

// Mock DOM environment
document.body.innerHTML = '<div id="module-content"></div>';

// Load app framework and module
const appCode = fs.readFileSync(path.resolve(__dirname, '../js/app.js'), 'utf8');
const exportCode = fs.readFileSync(path.resolve(__dirname, '../js/core/export.js'), 'utf8');
const rgenCode = fs.readFileSync(path.resolve(__dirname, '../js/core/r-generator.js'), 'utf8');
const moduleCode = fs.readFileSync(path.resolve(__dirname, '../js/modules/regression-helper.js'), 'utf8');

// Create a safe app evaluation
const safeEval = (code) => {
    return (new Function(code))();
};

// Mock dependencies
window.Export = {
    showToast: jest.fn(),
    addToHistory: jest.fn(),
    copyText: jest.fn()
};
window.RGenerator = {
    showScript: jest.fn(),
    regressionHelper: jest.fn()
};
window.Charts = {
    setupCanvas: jest.fn(),
    clearCanvas: jest.fn(),
    drawArrow: jest.fn(),
    DAGDiagram: jest.fn()
};
window.References = {
    regressionModels: {
        'binary_independent': {
            model: 'Logistic Regression',
            linkFn: 'Logit',
            formula: 'glm(y ~ x, family=binomial)',
            assumptions: ['Linearity of independent variables and log odds'],
            rCode: 'glm(y ~ x, family=binomial)',
            notes: ['Test notes']
        }
    }
};

safeEval(appCode);
safeEval(exportCode);
safeEval(rgenCode);

// Register module mock to capture it
let registeredModule;
window.App = window.App || {};
window.App.registerModule = (id, module) => {
    registeredModule = module;
};
window.App.createModuleLayout = (title, desc) => `<div>${title} - ${desc}</div>`;
window.App.setTrustedHTML = (el, html) => { if (el) el.innerHTML = html; };
window.App.tooltip = (text) => `<span class="tooltip">${text}</span>`;
window.App.autoSaveInputs = jest.fn();
window.App.logModuleUsage = jest.fn();

safeEval(moduleCode);

describe('Regression Helper Module', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="module-content"></div>';
        registeredModule.render(document.getElementById('module-content'));
        window.Export.showToast.mockClear();
        window.Export.addToHistory.mockClear();
    });

    test('module is registered', () => {
        expect(registeredModule).toBeDefined();
        expect(typeof registeredModule.render).toBe('function');
    });

    test('render method returns valid HTML', () => {
        expect(document.getElementById('module-content').innerHTML).not.toBe('');
    });

    // Test EPV Calculator
    test('calculateEPV valid input', () => {
        document.getElementById('rh-events').value = 30;
        document.getElementById('rh-covariates').value = 5;

        window.RegressionHelper.calculateEPV();

        const resultHtml = document.getElementById('rh-epv-results').innerHTML;
        expect(resultHtml).toContain('6.0 EPV'); // EPV
    });

    test('calculateEPV invalid input - alerts', () => {
        document.getElementById('rh-events').value = "invalid";
        document.getElementById('rh-covariates').value = 5;

        window.RegressionHelper.calculateEPV();

        expect(window.Export.showToast).toHaveBeenCalledWith('Please enter valid positive numbers', 'error');
    });

    test('calcInteraction calculation', () => {
        document.getElementById('rh-int-b1').value = 0.693; // ln(2)
        document.getElementById('rh-int-b2').value = 1.099; // ln(3)
        document.getElementById('rh-int-b3').value = 0.405; // ln(1.5)
        document.getElementById('rh-int-type').value = 'logistic';

        window.RegressionHelper.calcInteraction();

        const resultHtml = document.getElementById('rh-int-result').innerHTML;
        expect(resultHtml).toContain('synergistic');
    });

    test('calcRERI calculation', () => {
        document.getElementById('rh-reri-a').value = 2.0;
        document.getElementById('rh-reri-b').value = 3.0;
        document.getElementById('rh-reri-ab').value = 6.0;

        window.RegressionHelper.calcRERI();

        const resultHtml = document.getElementById('rh-reri-result').innerHTML;
        // RERI = orAB - orA - orB + 1 = 6 - 2 - 3 + 1 = 2
        expect(resultHtml).toContain('2.000');
        expect(resultHtml).toContain('Positive additive interaction');
    });

    test('calcRegSS calculation - linear', () => {
        document.getElementById('rh-ss-type').value = 'linear';
        document.getElementById('rh-ss-k').value = 5;

        window.RegressionHelper.calcRegSS();

        const resultHtml = document.getElementById('rh-ss-result').innerHTML;
        // For linear with k=5: max of (50 + 8*5 = 90) or (104 + 5 = 109) -> 109
        expect(resultHtml).toContain('109');
    });

    test('calcRegSS calculation - logistic', () => {
        document.getElementById('rh-ss-type').value = 'logistic';
        document.getElementById('rh-ss-k').value = 5;
        document.getElementById('rh-ss-rate').value = 0.2;
        document.getElementById('rh-ss-epv').value = 10;

        window.RegressionHelper.calcRegSS();

        const resultHtml = document.getElementById('rh-ss-result').innerHTML;
        // events needed = 10 * 5 = 50
        // total N needed = 50 / 0.2 = 250
        expect(resultHtml).toContain('50');
        expect(resultHtml).toContain('250');
    });

    test('switchTab changes active tab', () => {
        expect(document.getElementById('tab-wizard').classList.contains('active')).toBe(true);
        expect(document.getElementById('tab-epv').classList.contains('active')).toBe(false);

        window.RegressionHelper.switchTab('epv');

        expect(document.getElementById('tab-wizard').classList.contains('active')).toBe(false);
        expect(document.getElementById('tab-epv').classList.contains('active')).toBe(true);
    });

    test('recommend generates correct model recommendation', () => {
        document.getElementById('rh-outcome-type').value = 'binary';
        document.getElementById('rh-clustering').value = 'no';
        document.getElementById('rh-repeated').value = 'no';

        window.RegressionHelper.recommend();

        const resultHtml = document.getElementById('rh-wizard-results').innerHTML;
        expect(resultHtml).toContain('Logistic Regression');
    });

    test('recommend alerts on missing outcome type', () => {
        document.getElementById('rh-outcome-type').value = '';

        window.RegressionHelper.recommend();

        expect(window.Export.showToast).toHaveBeenCalledWith('Please select an outcome type', 'error');
    });

    test('loadExampleDAG sets up nodes and edges', () => {
        // Can't easily test canvas output without more mocking, but we can verify it doesn't crash
        // and calls Charts.DAGDiagram
        window.RegressionHelper.loadExampleDAG();
        expect(window.Charts.DAGDiagram).toHaveBeenCalled();
    });
});
