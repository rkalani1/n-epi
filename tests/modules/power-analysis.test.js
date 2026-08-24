const fs = require('fs');
const path = require('path');

describe('Power Analysis Module', () => {
    beforeEach(() => {
        // Setup DOM environment
        document.body.innerHTML = '<div id="container"></div>';

        // Mock global dependencies
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

        window.Statistics = {
            powerTwoProportions: jest.fn((p1, p2, n, alpha) => 0.82),
            powerTwoMeans: jest.fn((delta, sd, n, alpha) => 0.75),
            powerSurvival: jest.fn((hr, events, alpha) => 0.85),
            mdeProportions: jest.fn((p1, n, alpha, power) => ({ arr: 0.08, p2: 0.20 })),
            mdeMeans: jest.fn((sd, n, alpha, power) => ({ delta: 2.5, cohensD: 0.31 })),
            mdeSurvival: jest.fn((events, alpha, power) => ({ hr: 0.65, hrUpper: 1.53 }))
        };

        window.Charts = {
            LineChart: jest.fn()
        };

        window.RGenerator = {
            powerAnalysis: jest.fn(params => 'power.t.test(...)'),
            showScript: jest.fn()
        };

        // Fake canvas getContext if needed by jsdom
        HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
            fillRect: jest.fn(),
            clearRect: jest.fn(),
            getImageData: jest.fn(),
            putImageData: jest.fn(),
            createImageData: jest.fn(),
            setTransform: jest.fn(),
            drawImage: jest.fn(),
            save: jest.fn(),
            fillText: jest.fn(),
            restore: jest.fn(),
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            closePath: jest.fn(),
            stroke: jest.fn(),
            translate: jest.fn(),
            scale: jest.fn(),
            rotate: jest.fn(),
            arc: jest.fn(),
            fill: jest.fn(),
            measureText: jest.fn(() => ({ width: 0 })),
            transform: jest.fn(),
            rect: jest.fn(),
            clip: jest.fn()
        }));

        // Load and evaluate module
        const modulePath = path.resolve(__dirname, '../../js/modules/power-analysis.js');
        const code = fs.readFileSync(modulePath, 'utf8');
        eval(code);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    describe('API Exposure & Registration', () => {
        test('registers power-analysis module with App', () => {
            expect(window.App.registerModule).toHaveBeenCalledWith(
                'power-analysis',
                expect.objectContaining({ render: expect.any(Function) })
            );
        });

        test('exposes PowerModule globally with required methods', () => {
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

    describe('Rendering & Layout', () => {
        test('render creates module layout and populates container', () => {
            const container = document.getElementById('container');
            const renderFn = window.App.registerModule.mock.calls.find(call => call[0] === 'power-analysis')[1].render;
            renderFn(container);

            expect(window.App.createModuleLayout).toHaveBeenCalledWith(
                'Power Analysis',
                expect.any(String)
            );
            expect(window.App.setTrustedHTML).toHaveBeenCalledWith(container, expect.any(String));
            expect(window.App.autoSaveInputs).toHaveBeenCalledWith(container, 'power-analysis');
        });
    });

    describe('Design Toggling', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const renderFn = window.App.registerModule.mock.calls.find(call => call[0] === 'power-analysis')[1].render;
            renderFn(container);
        });

        test('updateDesign toggles calculation section input visibility', () => {
            const select = document.getElementById('pa-design');
            const propInputs = document.getElementById('pa-inputs-proportions');
            const meansInputs = document.getElementById('pa-inputs-means');
            const survInputs = document.getElementById('pa-inputs-survival');

            // Default is proportions
            expect(propInputs.classList.contains('hidden')).toBe(false);
            expect(meansInputs.classList.contains('hidden')).toBe(true);
            expect(survInputs.classList.contains('hidden')).toBe(true);

            // Switch to means
            select.value = 'means';
            PowerModule.updateDesign();
            expect(propInputs.classList.contains('hidden')).toBe(true);
            expect(meansInputs.classList.contains('hidden')).toBe(false);
            expect(survInputs.classList.contains('hidden')).toBe(true);

            // Switch to survival
            select.value = 'survival';
            PowerModule.updateDesign();
            expect(propInputs.classList.contains('hidden')).toBe(true);
            expect(meansInputs.classList.contains('hidden')).toBe(true);
            expect(survInputs.classList.contains('hidden')).toBe(false);
        });

        test('updateMDEDesign toggles MDE section input visibility', () => {
            const select = document.getElementById('pa-mde-design');
            const propInputs = document.getElementById('pa-mde-proportions');
            const meansInputs = document.getElementById('pa-mde-means');
            const survInputs = document.getElementById('pa-mde-survival');

            // Switch to means
            select.value = 'means';
            PowerModule.updateMDEDesign();
            expect(propInputs.classList.contains('hidden')).toBe(true);
            expect(meansInputs.classList.contains('hidden')).toBe(false);
            expect(survInputs.classList.contains('hidden')).toBe(true);

            // Switch to survival
            select.value = 'survival';
            PowerModule.updateMDEDesign();
            expect(propInputs.classList.contains('hidden')).toBe(true);
            expect(meansInputs.classList.contains('hidden')).toBe(true);
            expect(survInputs.classList.contains('hidden')).toBe(false);
        });
    });

    describe('Power Calculations', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            const container = document.getElementById('container');
            const renderFn = window.App.registerModule.mock.calls.find(call => call[0] === 'power-analysis')[1].render;
            renderFn(container);
        });

        describe('Two Proportions', () => {
            test('calculates power and updates DOM for valid inputs', () => {
                document.getElementById('pa-design').value = 'proportions';
                document.getElementById('pa-p1').value = '0.30';
                document.getElementById('pa-p2').value = '0.20';
                document.getElementById('pa-n').value = '200';
                document.getElementById('pa-alpha').value = '0.05';

                window.Statistics.powerTwoProportions.mockReturnValue(0.85);

                PowerModule.calculate();

                expect(window.Statistics.powerTwoProportions).toHaveBeenCalledWith(0.30, 0.20, 200, 0.05);
                const resultsEl = document.getElementById('pa-results');
                expect(resultsEl.innerHTML).toContain('85.0%');
                expect(resultsEl.innerHTML).toContain('Adequate power');
                expect(window.Export.addToHistory).toHaveBeenCalledWith('power-analysis', expect.any(Object), '85.0% power');

                // Fast forward chart setTimeout
                jest.runAllTimers();
                expect(window.Charts.LineChart).toHaveBeenCalled();
            });

            test('displays warning for marginal power (60-79%)', () => {
                document.getElementById('pa-design').value = 'proportions';
                window.Statistics.powerTwoProportions.mockReturnValue(0.65);

                PowerModule.calculate();
                const resultsEl = document.getElementById('pa-results');
                expect(resultsEl.innerHTML).toContain('65.0%');
                expect(resultsEl.innerHTML).toContain('Marginal power');
            });

            test('displays danger warning for underpowered (<60%)', () => {
                document.getElementById('pa-design').value = 'proportions';
                window.Statistics.powerTwoProportions.mockReturnValue(0.40);

                PowerModule.calculate();
                const resultsEl = document.getElementById('pa-results');
                expect(resultsEl.innerHTML).toContain('40.0%');
                expect(resultsEl.innerHTML).toContain('Underpowered');
            });

            test('shows error toast for invalid inputs (e.g., NaN or out of bounds)', () => {
                document.getElementById('pa-design').value = 'proportions';
                document.getElementById('pa-p1').value = '1.5'; // invalid p1 > 1

                PowerModule.calculate();

                expect(window.Export.showToast).toHaveBeenCalledWith('Please check input values', 'error');
            });
        });

        describe('Two Means', () => {
            test('calculates power for means design', () => {
                document.getElementById('pa-design').value = 'means';
                PowerModule.updateDesign();

                document.getElementById('pa-delta').value = '5';
                document.getElementById('pa-sd').value = '10';
                document.getElementById('pa-n-means').value = '150';
                document.getElementById('pa-alpha-means').value = '0.05';

                window.Statistics.powerTwoMeans.mockReturnValue(0.82);

                PowerModule.calculate();

                expect(window.Statistics.powerTwoMeans).toHaveBeenCalledWith(5, 10, 150, 0.05);
                const resultsEl = document.getElementById('pa-results');
                expect(resultsEl.innerHTML).toContain('82.0%');

                jest.runAllTimers();
                expect(window.Charts.LineChart).toHaveBeenCalled();
            });

            test('shows error toast for invalid SD or sample size', () => {
                document.getElementById('pa-design').value = 'means';
                PowerModule.updateDesign();

                document.getElementById('pa-sd').value = '0'; // invalid SD <= 0

                PowerModule.calculate();

                expect(window.Export.showToast).toHaveBeenCalledWith('Please check input values', 'error');
            });
        });

        describe('Survival (Time-to-Event)', () => {
            test('calculates power for survival design', () => {
                document.getElementById('pa-design').value = 'survival';
                PowerModule.updateDesign();

                document.getElementById('pa-hr').value = '0.75';
                document.getElementById('pa-events').value = '180';
                document.getElementById('pa-alpha-surv').value = '0.05';

                window.Statistics.powerSurvival.mockReturnValue(0.88);

                PowerModule.calculate();

                expect(window.Statistics.powerSurvival).toHaveBeenCalledWith(0.75, 180, 0.05);
                const resultsEl = document.getElementById('pa-results');
                expect(resultsEl.innerHTML).toContain('88.0%');

                jest.runAllTimers();
                expect(window.Charts.LineChart).toHaveBeenCalled();
            });

            test('shows error toast for invalid hazard ratio or events', () => {
                document.getElementById('pa-design').value = 'survival';
                PowerModule.updateDesign();

                document.getElementById('pa-hr').value = '-0.5'; // invalid HR <= 0

                PowerModule.calculate();

                expect(window.Export.showToast).toHaveBeenCalledWith('Please check input values', 'error');
            });
        });
    });

    describe('Interactive Dashboard', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            const container = document.getElementById('container');
            const renderFn = window.App.registerModule.mock.calls.find(call => call[0] === 'power-analysis')[1].render;
            renderFn(container);
        });

        test('updateDashboard updates values and draws chart after debounce', () => {
            document.getElementById('pa-slider-p1').value = '0.30';
            document.getElementById('pa-slider-eff').value = '0.10';
            document.getElementById('pa-slider-n').value = '400';
            document.getElementById('pa-slider-alpha').value = '0.05';

            window.Statistics.powerTwoProportions.mockReturnValue(0.84);

            PowerModule.updateDashboard();

            // Value text updated immediately or after debounce
            jest.advanceTimersByTime(50);

            expect(document.getElementById('pa-slider-p1-val').textContent).toBe('0.30');
            expect(document.getElementById('pa-slider-eff-val').textContent).toBe('0.100');
            expect(document.getElementById('pa-slider-n-val').textContent).toBe('400');
            expect(document.getElementById('pa-slider-alpha-val').textContent).toBe('0.050');

            expect(document.getElementById('pa-dashboard-power').textContent).toBe('84.0%');
            expect(window.Charts.LineChart).toHaveBeenCalled();
        });
    });

    describe('Minimum Detectable Effect Size (MDE)', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const renderFn = window.App.registerModule.mock.calls.find(call => call[0] === 'power-analysis')[1].render;
            renderFn(container);
        });

        test('calculateMDE for proportions', () => {
            document.getElementById('pa-mde-design').value = 'proportions';
            document.getElementById('pa-mde-p1').value = '0.25';
            document.getElementById('pa-mde-n').value = '250';
            document.getElementById('pa-mde-alpha').value = '0.05';

            window.Statistics.mdeProportions.mockReturnValue({ arr: 0.075, p2: 0.175 });

            PowerModule.calculateMDE();

            expect(window.Statistics.mdeProportions).toHaveBeenCalledWith(0.25, 250, 0.05, 0.80);
            expect(window.Statistics.mdeProportions).toHaveBeenCalledWith(0.25, 250, 0.05, 0.90);
            const mdeResults = document.getElementById('pa-mde-results');
            expect(mdeResults.innerHTML).toContain('7.5% ARR');
            expect(mdeResults.innerHTML).toContain('MDE by Sample Size');
        });

        test('calculateMDE for proportions shows error on invalid input', () => {
            document.getElementById('pa-mde-design').value = 'proportions';
            document.getElementById('pa-mde-n').value = '5'; // n < 10

            PowerModule.calculateMDE();
            expect(window.Export.showToast).toHaveBeenCalledWith('Please check input values', 'error');
        });

        test('calculateMDE for means', () => {
            document.getElementById('pa-mde-design').value = 'means';
            PowerModule.updateMDEDesign();

            document.getElementById('pa-mde-sd').value = '6.0';
            document.getElementById('pa-mde-n-means').value = '150';
            document.getElementById('pa-mde-alpha-means').value = '0.05';

            window.Statistics.mdeMeans.mockReturnValue({ delta: 2.1, cohensD: 0.35 });

            PowerModule.calculateMDE();

            expect(window.Statistics.mdeMeans).toHaveBeenCalledWith(6.0, 150, 0.05, 0.80);
            const mdeResults = document.getElementById('pa-mde-results');
            expect(mdeResults.innerHTML).toContain('δ = 2.10');
        });

        test('calculateMDE for means shows error on invalid SD', () => {
            document.getElementById('pa-mde-design').value = 'means';
            PowerModule.updateMDEDesign();
            document.getElementById('pa-mde-sd').value = '0';

            PowerModule.calculateMDE();
            expect(window.Export.showToast).toHaveBeenCalledWith('Please check input values', 'error');
        });

        test('calculateMDE for survival', () => {
            document.getElementById('pa-mde-design').value = 'survival';
            PowerModule.updateMDEDesign();

            document.getElementById('pa-mde-events').value = '150';
            document.getElementById('pa-mde-alpha-surv').value = '0.05';

            window.Statistics.mdeSurvival.mockReturnValue({ hr: 0.63, hrUpper: 1.58 });

            PowerModule.calculateMDE();

            expect(window.Statistics.mdeSurvival).toHaveBeenCalledWith(150, 0.05, 0.80);
            const mdeResults = document.getElementById('pa-mde-results');
            expect(mdeResults.innerHTML).toContain('HR = 0.630');
        });

        test('calculateMDE for survival shows error on invalid events', () => {
            document.getElementById('pa-mde-design').value = 'survival';
            PowerModule.updateMDEDesign();
            document.getElementById('pa-mde-events').value = '3';

            PowerModule.calculateMDE();
            expect(window.Export.showToast).toHaveBeenCalledWith('Please check input values', 'error');
        });
    });

    describe('Multi-scenario Comparison', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const renderFn = window.App.registerModule.mock.calls.find(call => call[0] === 'power-analysis')[1].render;
            renderFn(container);
        });

        test('compareScenarios evaluates populated scenario rows and plots comparison chart', () => {
            document.getElementById('pa-sc1-p1').value = '0.30';
            document.getElementById('pa-sc1-p2').value = '0.20';
            document.getElementById('pa-sc1-n').value = '200';
            document.getElementById('pa-sc1-alpha').value = '0.05';

            window.Statistics.powerTwoProportions.mockReturnValue(0.85);

            PowerModule.compareScenarios();

            expect(document.getElementById('pa-sc1-power').textContent).toBe('85.0%');
            expect(window.Charts.LineChart).toHaveBeenCalled();
        });

        test('compareScenarios skips rows with invalid input', () => {
            document.getElementById('pa-sc1-n').value = '-10'; // invalid N <= 0

            PowerModule.compareScenarios();

            expect(document.getElementById('pa-sc1-power').textContent).toBe('--');
        });
    });

    describe('Methods Text Generation & Copy', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const renderFn = window.App.registerModule.mock.calls.find(call => call[0] === 'power-analysis')[1].render;
            renderFn(container);
        });

        test('generateMethods displays error toast if power has not been calculated yet', () => {
            delete window._paLastCalc;
            PowerModule.generateMethods();
            expect(window.Export.showToast).toHaveBeenCalledWith('Please calculate power first', 'error');
        });

        test('generateMethods creates methods text for proportions design', () => {
            document.getElementById('pa-design').value = 'proportions';
            document.getElementById('pa-p1').value = '0.28';
            document.getElementById('pa-p2').value = '0.20';
            document.getElementById('pa-n').value = '500';
            document.getElementById('pa-alpha').value = '0.05';
            window.Statistics.powerTwoProportions.mockReturnValue(0.825);

            PowerModule.calculate();
            PowerModule.generateMethods();

            const textEl = document.getElementById('pa-methods-text');
            expect(textEl.textContent).toContain('With 500 participants per group (total N = 1000)');
            expect(textEl.textContent).toContain('82.5% power');
            expect(textEl.textContent).toContain('28.0% to 20.0%');
        });

        test('generateMethods creates methods text for means design', () => {
            document.getElementById('pa-design').value = 'means';
            PowerModule.updateDesign();
            document.getElementById('pa-delta').value = '4';
            document.getElementById('pa-sd').value = '8';
            document.getElementById('pa-n-means').value = '200';
            document.getElementById('pa-alpha-means').value = '0.05';
            window.Statistics.powerTwoMeans.mockReturnValue(0.78);

            PowerModule.calculate();
            PowerModule.generateMethods();

            const textEl = document.getElementById('pa-methods-text');
            expect(textEl.textContent).toContain('With 200 participants per group, the study has 78.0% power');
            expect(textEl.textContent).toContain('mean difference of 4');
        });

        test('generateMethods creates methods text for survival design', () => {
            document.getElementById('pa-design').value = 'survival';
            PowerModule.updateDesign();
            document.getElementById('pa-hr').value = '0.70';
            document.getElementById('pa-events').value = '200';
            document.getElementById('pa-alpha-surv').value = '0.05';
            window.Statistics.powerSurvival.mockReturnValue(0.85);

            PowerModule.calculate();
            PowerModule.generateMethods();

            const textEl = document.getElementById('pa-methods-text');
            expect(textEl.textContent).toContain('With 200 events, the study has 85.0% power to detect a hazard ratio of 0.7');
        });

        test('copyMethods copies current text to clipboard using Export.copyText', () => {
            const textEl = document.getElementById('pa-methods-text');
            textEl.textContent = 'Sample methods text for power analysis';

            PowerModule.copyMethods();

            expect(window.Export.copyText).toHaveBeenCalledWith('Sample methods text for power analysis');
        });
    });
});
