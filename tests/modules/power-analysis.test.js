const fs = require('fs');
const path = require('path');

describe('Power Analysis Module', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        // Setup simple DOM
        document.body.innerHTML = '<div id="container"></div>';

        // Mock App, Export, Charts, RGenerator
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
            copyText: jest.fn(),
            addToHistory: jest.fn(),
            exportCanvasPNG: jest.fn()
        };

        window.Charts = {
            LineChart: jest.fn()
        };

        window.RGenerator = {
            powerAnalysis: jest.fn(() => '# R script'),
            showScript: jest.fn()
        };

        // Load statistics.js and power-analysis.js
        const statsPath = path.resolve(__dirname, '../../js/core/statistics.js');
        const statsCode = fs.readFileSync(statsPath, 'utf8');
        window.eval(statsCode + '\n window.Statistics = Statistics;');

        const powerModulePath = path.resolve(__dirname, '../../js/modules/power-analysis.js');
        const powerCode = fs.readFileSync(powerModulePath, 'utf8');
        window.eval(powerCode);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    describe('API Exposure & Module Registration', () => {
        test('module registers with App', () => {
            expect(window.App.registerModule).toHaveBeenCalledWith('power-analysis', expect.objectContaining({
                render: expect.any(Function)
            }));
        });

        test('PowerModule exposes expected methods', () => {
            expect(window.PowerModule).toBeDefined();
            expect(typeof window.PowerModule.updateDesign).toBe('function');
            expect(typeof window.PowerModule.updateMDEDesign).toBe('function');
            expect(typeof window.PowerModule.calculate).toBe('function');
            expect(typeof window.PowerModule.updateDashboard).toBe('function');
            expect(typeof window.PowerModule.calculateMDE).toBe('function');
            expect(typeof window.PowerModule.compareScenarios).toBe('function');
            expect(typeof window.PowerModule.generateMethods).toBe('function');
            expect(typeof window.PowerModule.copyMethods).toBe('function');
        });
    });

    describe('Render & UI Updates', () => {
        test('render populates container and calls App helpers', () => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);

            expect(window.App.createModuleLayout).toHaveBeenCalledWith('Power Analysis', expect.any(String));
            expect(window.App.setTrustedHTML).toHaveBeenCalled();
            expect(window.App.autoSaveInputs).toHaveBeenCalledWith(container, 'power-analysis');
        });

        test('updateDesign toggles input visibility correctly', () => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);

            const designSelect = document.getElementById('pa-design');
            const propInputs = document.getElementById('pa-inputs-proportions');
            const meansInputs = document.getElementById('pa-inputs-means');
            const survInputs = document.getElementById('pa-inputs-survival');

            // Default is proportions
            expect(propInputs.classList.contains('hidden')).toBe(false);
            expect(meansInputs.classList.contains('hidden')).toBe(true);
            expect(survInputs.classList.contains('hidden')).toBe(true);

            // Switch to means
            designSelect.value = 'means';
            window.PowerModule.updateDesign();
            expect(propInputs.classList.contains('hidden')).toBe(true);
            expect(meansInputs.classList.contains('hidden')).toBe(false);
            expect(survInputs.classList.contains('hidden')).toBe(true);

            // Switch to survival
            designSelect.value = 'survival';
            window.PowerModule.updateDesign();
            expect(propInputs.classList.contains('hidden')).toBe(true);
            expect(meansInputs.classList.contains('hidden')).toBe(true);
            expect(survInputs.classList.contains('hidden')).toBe(false);
        });

        test('updateMDEDesign toggles MDE input visibility correctly', () => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);

            const mdeDesignSelect = document.getElementById('pa-mde-design');
            const propInputs = document.getElementById('pa-mde-proportions');
            const meansInputs = document.getElementById('pa-mde-means');
            const survInputs = document.getElementById('pa-mde-survival');

            mdeDesignSelect.value = 'means';
            window.PowerModule.updateMDEDesign();
            expect(propInputs.classList.contains('hidden')).toBe(true);
            expect(meansInputs.classList.contains('hidden')).toBe(false);

            mdeDesignSelect.value = 'survival';
            window.PowerModule.updateMDEDesign();
            expect(meansInputs.classList.contains('hidden')).toBe(true);
            expect(survInputs.classList.contains('hidden')).toBe(false);
        });
    });

    describe('Calculate Achieved Power', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('calculates proportions power and draws curve', () => {
            document.getElementById('pa-design').value = 'proportions';
            document.getElementById('pa-p1').value = '0.30';
            document.getElementById('pa-p2').value = '0.20';
            document.getElementById('pa-n').value = '300';
            document.getElementById('pa-alpha').value = '0.05';

            window.PowerModule.calculate();

            const resultsHtml = document.getElementById('pa-results').innerHTML;
            expect(resultsHtml).toContain('Achieved Power');
            expect(window.Export.addToHistory).toHaveBeenCalledWith('power-analysis', expect.any(Object), expect.stringContaining('% power'));

            // Advance timers for setTimeout chart drawing
            jest.runAllTimers();
            expect(window.Charts.LineChart).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({ title: 'Power Curve (current N highlighted)', xLabel: 'Total Sample Size' })
            );
        });

        test('validates proportions inputs and shows toast on invalid input', () => {
            document.getElementById('pa-design').value = 'proportions';
            document.getElementById('pa-p1').value = '1.2'; // Invalid proportion > 1
            document.getElementById('pa-p2').value = '0.2';

            window.PowerModule.calculate();
            expect(window.Export.showToast).toHaveBeenCalledWith('Please check input values', 'error');
        });

        test('calculates means power and draws curve', () => {
            document.getElementById('pa-design').value = 'means';
            document.getElementById('pa-delta').value = '5';
            document.getElementById('pa-sd').value = '10';
            document.getElementById('pa-n-means').value = '100';
            document.getElementById('pa-alpha-means').value = '0.05';

            window.PowerModule.calculate();

            const resultsHtml = document.getElementById('pa-results').innerHTML;
            expect(resultsHtml).toContain('Achieved Power');

            jest.runAllTimers();
            expect(window.Charts.LineChart).toHaveBeenCalled();
        });

        test('validates means inputs (e.g. invalid SD)', () => {
            document.getElementById('pa-design').value = 'means';
            document.getElementById('pa-sd').value = '-1'; // Invalid SD <= 0

            window.PowerModule.calculate();
            expect(window.Export.showToast).toHaveBeenCalledWith('Please check input values', 'error');
        });

        test('calculates survival power and draws curve', () => {
            document.getElementById('pa-design').value = 'survival';
            document.getElementById('pa-hr').value = '0.65';
            document.getElementById('pa-events').value = '150';
            document.getElementById('pa-alpha-surv').value = '0.05';

            window.PowerModule.calculate();

            const resultsHtml = document.getElementById('pa-results').innerHTML;
            expect(resultsHtml).toContain('Achieved Power');

            jest.runAllTimers();
            expect(window.Charts.LineChart).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({ xLabel: 'Number of Events' })
            );
        });

        test('validates survival inputs (e.g. invalid HR or events)', () => {
            document.getElementById('pa-design').value = 'survival';
            document.getElementById('pa-hr').value = '0'; // Invalid HR <= 0

            window.PowerModule.calculate();
            expect(window.Export.showToast).toHaveBeenCalledWith('Please check input values', 'error');
        });

        test('displays power status labels correctly (adequate >=80%, marginal 60-79%, underpowered <60%)', () => {
            document.getElementById('pa-design').value = 'proportions';

            // Adequate
            document.getElementById('pa-p1').value = '0.40';
            document.getElementById('pa-p2').value = '0.20';
            document.getElementById('pa-n').value = '500';
            window.PowerModule.calculate();
            expect(document.getElementById('pa-results').innerHTML).toContain('Adequate power');

            // Underpowered
            document.getElementById('pa-n').value = '10';
            window.PowerModule.calculate();
            expect(document.getElementById('pa-results').innerHTML).toContain('Underpowered');
        });
    });

    describe('Interactive Dashboard', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('updateDashboard updates UI values and renders chart after debounce', () => {
            document.getElementById('pa-slider-p1').value = '0.30';
            document.getElementById('pa-slider-eff').value = '0.10';
            document.getElementById('pa-slider-n').value = '600';
            document.getElementById('pa-slider-alpha').value = '0.05';

            window.PowerModule.updateDashboard();

            // Advance timers for debounce
            jest.runAllTimers();

            expect(document.getElementById('pa-slider-p1-val').textContent).toBe('0.30');
            expect(document.getElementById('pa-slider-eff-val').textContent).toBe('0.100');
            expect(document.getElementById('pa-slider-n-val').textContent).toBe('600');
            expect(document.getElementById('pa-dashboard-power').textContent).not.toBe('--');
            expect(window.Charts.LineChart).toHaveBeenCalledWith(
                document.getElementById('pa-dashboard-chart'),
                expect.objectContaining({ xLabel: 'Total Sample Size' })
            );
        });
    });

    describe('Minimum Detectable Effect Size (MDE)', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('calculateMDE for proportions', () => {
            document.getElementById('pa-mde-design').value = 'proportions';
            document.getElementById('pa-mde-p1').value = '0.25';
            document.getElementById('pa-mde-n').value = '250';
            document.getElementById('pa-mde-alpha').value = '0.05';

            window.PowerModule.calculateMDE();

            const mdeResults = document.getElementById('pa-mde-results').innerHTML;
            expect(mdeResults).toContain('Minimum detectable absolute risk reduction');
            expect(mdeResults).toContain('MDE (80% power)');
        });

        test('calculateMDE proportions validation', () => {
            document.getElementById('pa-mde-design').value = 'proportions';
            document.getElementById('pa-mde-p1').value = '1.5';

            window.PowerModule.calculateMDE();
            expect(window.Export.showToast).toHaveBeenCalledWith('Please check input values', 'error');
        });

        test('calculateMDE for means', () => {
            document.getElementById('pa-mde-design').value = 'means';
            document.getElementById('pa-mde-sd').value = '10';
            document.getElementById('pa-mde-n-means').value = '150';
            document.getElementById('pa-mde-alpha-means').value = '0.05';

            window.PowerModule.calculateMDE();

            const mdeResults = document.getElementById('pa-mde-results').innerHTML;
            expect(mdeResults).toContain('Minimum detectable mean difference');
            expect(mdeResults).toContain('Cohen\'s d');
        });

        test('calculateMDE means validation', () => {
            document.getElementById('pa-mde-design').value = 'means';
            document.getElementById('pa-mde-sd').value = '0';

            window.PowerModule.calculateMDE();
            expect(window.Export.showToast).toHaveBeenCalledWith('Please check input values', 'error');
        });

        test('calculateMDE for survival', () => {
            document.getElementById('pa-mde-design').value = 'survival';
            document.getElementById('pa-mde-events').value = '120';
            document.getElementById('pa-mde-alpha-surv').value = '0.05';

            window.PowerModule.calculateMDE();

            const mdeResults = document.getElementById('pa-mde-results').innerHTML;
            expect(mdeResults).toContain('Minimum detectable hazard ratio');
            expect(mdeResults).toContain('MDE HR (80%, favors trt)');
        });

        test('calculateMDE survival validation', () => {
            document.getElementById('pa-mde-design').value = 'survival';
            document.getElementById('pa-mde-events').value = '2';

            window.PowerModule.calculateMDE();
            expect(window.Export.showToast).toHaveBeenCalledWith('Please check input values', 'error');
        });
    });

    describe('Multi-Scenario Comparison', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('compareScenarios updates scenario power cells and renders chart', () => {
            window.PowerModule.compareScenarios();

            expect(document.getElementById('pa-sc1-power').textContent).not.toBe('--');
            expect(window.Charts.LineChart).toHaveBeenCalledWith(
                document.getElementById('pa-scenario-chart'),
                expect.objectContaining({ title: 'Multi-Scenario Power Comparison' })
            );
        });
    });

    describe('Methods Text Generation', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('generateMethods shows toast error if no calculation done', () => {
            delete window._paLastCalc;
            window.PowerModule.generateMethods();
            expect(window.Export.showToast).toHaveBeenCalledWith('Please calculate power first', 'error');
        });

        test('generateMethods generates text for proportions', () => {
            document.getElementById('pa-design').value = 'proportions';
            document.getElementById('pa-p1').value = '0.30';
            document.getElementById('pa-p2').value = '0.20';
            document.getElementById('pa-n').value = '200';
            document.getElementById('pa-alpha').value = '0.05';
            window.PowerModule.calculate();

            window.PowerModule.generateMethods();

            const methodsText = document.getElementById('pa-methods-text').textContent;
            expect(methodsText).toContain('With 200 participants per group');
            expect(methodsText).toContain('absolute risk reduction');
        });

        test('generateMethods generates text for means', () => {
            document.getElementById('pa-design').value = 'means';
            document.getElementById('pa-delta').value = '4';
            document.getElementById('pa-sd').value = '8';
            document.getElementById('pa-n-means').value = '100';
            document.getElementById('pa-alpha-means').value = '0.05';
            window.PowerModule.calculate();

            window.PowerModule.generateMethods();

            const methodsText = document.getElementById('pa-methods-text').textContent;
            expect(methodsText).toContain('mean difference of 4');
            expect(methodsText).toContain('two-sample comparison of means');
        });

        test('generateMethods generates text for survival', () => {
            document.getElementById('pa-design').value = 'survival';
            document.getElementById('pa-hr').value = '0.70';
            document.getElementById('pa-events').value = '150';
            document.getElementById('pa-alpha-surv').value = '0.05';
            window.PowerModule.calculate();

            window.PowerModule.generateMethods();

            const methodsText = document.getElementById('pa-methods-text').textContent;
            expect(methodsText).toContain('With 150 events');
            expect(methodsText).toContain('hazard ratio of 0.7');
        });

        test('copyMethods invokes Export.copyText with generated text', () => {
            document.getElementById('pa-methods-text').textContent = 'Test methods text';
            window.PowerModule.copyMethods();
            expect(window.Export.copyText).toHaveBeenCalledWith('Test methods text');
        });
    });
});
