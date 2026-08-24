const fs = require('fs');
const path = require('path');

describe('Sample Size Module', () => {
    beforeEach(() => {
        // Setup simple DOM
        document.body.innerHTML = '<div id="container"></div>';

        // Mock global App, Export, Statistics, Charts, RGenerator, References
        window.App = {
            createModuleLayout: jest.fn((title, desc) => `<div class="module-title">${title}</div><div class="module-desc">${desc}</div>`),
            tooltip: jest.fn((text) => `<span class="tooltip">${text}</span>`),
            setTrustedHTML: jest.fn((container, html) => {
                if (container) container.innerHTML = html;
            }),
            autoSaveInputs: jest.fn(),
            registerModule: jest.fn()
        };

        window.Export = {
            showToast: jest.fn(),
            copyText: jest.fn(),
            exportCanvasPNG: jest.fn(),
            formatGrantJustification: jest.fn(() => 'Grant Justification Text'),
            addToHistory: jest.fn()
        };

        // Load real Statistics engine or mock
        const statisticsPath = path.resolve(__dirname, '../../js/core/statistics.js');
        const statsCode = fs.readFileSync(statisticsPath, 'utf8');
        window.Statistics = eval(statsCode + '; Statistics;');

        window.Charts = {
            LineChart: jest.fn(),
            BarChart: jest.fn()
        };

        window.RGenerator = {
            showScript: jest.fn(),
            sampleSize: {
                twoProportions: jest.fn(() => 'r_script_two_proportions'),
                twoMeans: jest.fn(() => 'r_script_two_means'),
                survival: jest.fn(() => 'r_script_survival')
            }
        };

        window.References = {
            mrsDistributions: {
                mrCleanControl: { trial: 'MR CLEAN', dist: [0.05, 0.07, 0.10, 0.10, 0.18, 0.20, 0.30] },
                escapeControl: { trial: 'ESCAPE', dist: [0.03, 0.06, 0.10, 0.12, 0.15, 0.24, 0.30] }
            }
        };

        // Load sample-size.js
        const sampleSizePath = path.resolve(__dirname, '../../js/modules/sample-size.js');
        const code = fs.readFileSync(sampleSizePath, 'utf8');
        eval(code);

        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    describe('API Exposure & Registration', () => {
        test('module registers with App and exposes window.SampleSizeModule API', () => {
            expect(window.App.registerModule).toHaveBeenCalledWith('sample-size', expect.any(Object));
            expect(window.SampleSizeModule).toBeDefined();
            expect(typeof window.SampleSizeModule.switchTab).toBe('function');
            expect(typeof window.SampleSizeModule.syncRates).toBe('function');
            expect(typeof window.SampleSizeModule.calculateProportions).toBe('function');
            expect(typeof window.SampleSizeModule.calculateMeans).toBe('function');
            expect(typeof window.SampleSizeModule.calculateSurvival).toBe('function');
            expect(typeof window.SampleSizeModule.calculateOrdinal).toBe('function');
            expect(typeof window.SampleSizeModule.calculateNonInf).toBe('function');
            expect(typeof window.SampleSizeModule.calculateEquivalence).toBe('function');
            expect(typeof window.SampleSizeModule.calculateCrossover).toBe('function');
            expect(typeof window.SampleSizeModule.calculateDiagnostic).toBe('function');
            expect(typeof window.SampleSizeModule.calculateCluster).toBe('function');
            expect(typeof window.SampleSizeModule.calculateStepped).toBe('function');
            expect(typeof window.SampleSizeModule.calculateMultiArm).toBe('function');
            expect(typeof window.SampleSizeModule.calculateGroupSeq).toBe('function');
        });
    });

    describe('Render & Tab Switching', () => {
        test('render populates container and sets up layout', () => {
            const container = document.getElementById('container');
            const sampleSizeModule = window.App.registerModule.mock.calls.find(c => c[0] === 'sample-size')[1];
            sampleSizeModule.render(container);

            expect(window.App.createModuleLayout).toHaveBeenCalledWith(
                'Sample Size Calculator',
                expect.any(String)
            );
            expect(window.App.setTrustedHTML).toHaveBeenCalled();
            expect(window.App.autoSaveInputs).toHaveBeenCalledWith(container, 'sample-size');
            expect(document.getElementById('ss-tabs')).not.toBeNull();
        });

        test('switchTab toggles active tab and content', () => {
            const container = document.getElementById('container');
            const sampleSizeModule = window.App.registerModule.mock.calls.find(c => c[0] === 'sample-size')[1];
            sampleSizeModule.render(container);

            window.SampleSizeModule.switchTab('means');
            const tabMeans = document.getElementById('tab-means');
            const tabProps = document.getElementById('tab-proportions');

            expect(tabMeans.classList.contains('active')).toBe(true);
            expect(tabProps.classList.contains('active')).toBe(false);
        });
    });

    describe('Two Proportions Tab', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const sampleSizeModule = window.App.registerModule.mock.calls.find(c => c[0] === 'sample-size')[1];
            sampleSizeModule.render(container);
        });

        test('syncRates updates ARR and P2 accordingly', () => {
            document.getElementById('ss_p1').value = '0.30';
            document.getElementById('ss_p2').value = '0.20';
            window.SampleSizeModule.syncRates('p1');
            expect(document.getElementById('ss_arr').value).toBe('0.100');

            document.getElementById('ss_arr').value = '0.05';
            window.SampleSizeModule.syncRates('arr');
            expect(document.getElementById('ss_p2').value).toBe('0.250');
        });

        test('loadPreset sets preset values correctly', () => {
            window.SampleSizeModule.loadPreset('lvo');
            expect(document.getElementById('ss_p1').value).toBe('0.28');
            expect(document.getElementById('ss_p2').value).toBe('0.46');
            expect(document.getElementById('ss_arr').value).toBe('-0.180');
        });

        test('calculateProportions validates equal rates', () => {
            document.getElementById('ss_p1').value = '0.20';
            document.getElementById('ss_p2').value = '0.20';
            window.SampleSizeModule.calculateProportions();
            expect(window.Export.showToast).toHaveBeenCalledWith(
                'Control and treatment rates must differ',
                'error'
            );
        });

        test('calculateProportions calculates results, renders sensitivity grid, chart, and methods', () => {
            document.getElementById('ss_p1').value = '0.28';
            document.getElementById('ss_p2').value = '0.20';
            document.getElementById('ss_alpha').value = '0.05';
            document.getElementById('ss_power').value = '0.80';
            document.getElementById('ss_ratio').value = '1';
            document.getElementById('ss_dropout').value = '10';

            window.SampleSizeModule.calculateProportions();

            const results = document.getElementById('ss-proportions-results');
            expect(results.innerHTML).toContain('participants');
            expect(results.innerHTML).toContain('Fleiss (corrected)');
            expect(window.Export.addToHistory).toHaveBeenCalled();

            jest.advanceTimersByTime(100);
            expect(window.Charts.LineChart).toHaveBeenCalled();
        });

        test('calculateProportions works for p2 > p1', () => {
            document.getElementById('ss_p1').value = '0.20';
            document.getElementById('ss_p2').value = '0.35';
            window.SampleSizeModule.calculateProportions();
            const results = document.getElementById('ss-proportions-results');
            expect(results.innerHTML).toContain('participants');
        });
    });

    describe('Two Means Tab', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const sampleSizeModule = window.App.registerModule.mock.calls.find(c => c[0] === 'sample-size')[1];
            sampleSizeModule.render(container);
        });

        test('loadMeansPreset loads preset values', () => {
            window.SampleSizeModule.loadMeansPreset('nihss');
            expect(document.getElementById('ss_delta').value).toBe('4');
            expect(document.getElementById('ss_sd1').value).toBe('8');
            expect(document.getElementById('ss_sd2').value).toBe('8');
        });

        test('calculateMeans performs calculations and renders chart', () => {
            document.getElementById('ss_delta').value = '4';
            document.getElementById('ss_sd1').value = '8';
            document.getElementById('ss_sd2').value = '8';
            document.getElementById('ssm_alpha').value = '0.05';
            document.getElementById('ssm_power').value = '0.80';
            document.getElementById('ssm_ratio').value = '1';
            document.getElementById('ssm_dropout').value = '10';

            window.SampleSizeModule.calculateMeans();

            const results = document.getElementById('ss-means-results');
            expect(results.innerHTML).toContain('Cohen\'s d');
            expect(window.Export.addToHistory).toHaveBeenCalled();

            jest.advanceTimersByTime(100);
            expect(window.Charts.LineChart).toHaveBeenCalled();
        });

        test('calculateMeans validates missing/invalid fields', () => {
            document.getElementById('ss_delta').value = '';
            window.SampleSizeModule.calculateMeans();
            expect(document.getElementById('ss-means-results').innerHTML).toBe('');
        });
    });

    describe('Time-to-Event (Survival) Tab', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const sampleSizeModule = window.App.registerModule.mock.calls.find(c => c[0] === 'sample-size')[1];
            sampleSizeModule.render(container);
        });

        test('loadSurvivalPreset loads preset values', () => {
            window.SampleSizeModule.loadSurvivalPreset('onc');
            expect(document.getElementById('ss_hr').value).toBe('0.75');
            expect(document.getElementById('ss_medsurv').value).toBe('18');
        });

        test('calculateSurvival performs calculations and draws chart', () => {
            document.getElementById('ss_hr').value = '0.70';
            document.getElementById('ss_medsurv').value = '24';
            document.getElementById('ss_accrual').value = '24';
            document.getElementById('ss_followup').value = '12';
            document.getElementById('sssurv_alpha').value = '0.05';
            document.getElementById('sssurv_power').value = '0.80';

            window.SampleSizeModule.calculateSurvival();

            const results = document.getElementById('ss-survival-results');
            expect(results.innerHTML).toContain('events needed');
            expect(results.innerHTML).toContain('Schoenfeld formula');

            jest.advanceTimersByTime(100);
            expect(window.Charts.LineChart).toHaveBeenCalled();
        });
    });

    describe('mRS Ordinal Shift Tab', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const sampleSizeModule = window.App.registerModule.mock.calls.find(c => c[0] === 'sample-size')[1];
            sampleSizeModule.render(container);
        });

        test('loadMRSPreset loads mRS distribution and updates sum', () => {
            window.SampleSizeModule.loadMRSPreset('mrCleanControl');
            expect(document.getElementById('ss_mrs_ctrl_0').value).toBe('0.05');
            expect(document.getElementById('ss-mrs-sum').textContent).toContain('Sum: 1.00');
        });

        test('calculateOrdinal validates sum = 1', () => {
            document.getElementById('ss_mrs_ctrl_0').value = '0.90';
            document.getElementById('ss_mrs_ctrl_1').value = '0.90';
            window.SampleSizeModule.calculateOrdinal();
            expect(window.Export.showToast).toHaveBeenCalledWith(
                'Distribution must sum to 1.0',
                'error'
            );
        });

        test('calculateOrdinal computes Whitehead sample size and draws BarChart', () => {
            window.SampleSizeModule.loadMRSPreset('mrCleanControl');
            document.getElementById('ss_common_or').value = '1.5';
            window.SampleSizeModule.calculateOrdinal();

            const results = document.getElementById('ss-ordinal-results');
            expect(results.innerHTML).toContain('Proportional odds model');

            jest.advanceTimersByTime(100);
            expect(window.Charts.BarChart).toHaveBeenCalled();
        });
    });

    describe('Non-Inferiority Tab', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const sampleSizeModule = window.App.registerModule.mock.calls.find(c => c[0] === 'sample-size')[1];
            sampleSizeModule.render(container);
        });

        test('loadNonInfPreset loads preset values', () => {
            window.SampleSizeModule.loadNonInfPreset('generic');
            expect(document.getElementById('ss_ni_p').value).toBe('0.3');
            expect(document.getElementById('ss_ni_margin').value).toBe('0.1');
        });

        test('calculateNonInf computes non-inferiority sample size', () => {
            document.getElementById('ss_ni_p').value = '0.30';
            document.getElementById('ss_ni_margin').value = '0.05';
            document.getElementById('ss_ni_alpha').value = '0.025';
            document.getElementById('ss_ni_power').value = '0.80';

            window.SampleSizeModule.calculateNonInf();

            const results = document.getElementById('ss-noninf-results');
            expect(results.innerHTML).toContain('Non-inferiority design');
        });
    });

    describe('Equivalence Tab', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const sampleSizeModule = window.App.registerModule.mock.calls.find(c => c[0] === 'sample-size')[1];
            sampleSizeModule.render(container);
        });

        test('loadEquivPreset loads preset values', () => {
            window.SampleSizeModule.loadEquivPreset('bioequiv');
            expect(document.getElementById('ss_eq_p').value).toBe('0.5');
            expect(document.getElementById('ss_eq_margin').value).toBe('0.2');
        });

        test('calculateEquivalence computes TOST sample size', () => {
            document.getElementById('ss_eq_p').value = '0.50';
            document.getElementById('ss_eq_margin').value = '0.10';
            document.getElementById('ss_eq_alpha').value = '0.025';
            document.getElementById('ss_eq_power').value = '0.80';

            window.SampleSizeModule.calculateEquivalence();

            const results = document.getElementById('ss-equivalence-results');
            expect(results.innerHTML).toContain('Equivalence (TOST) design');
        });
    });

    describe('Crossover Tab', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const sampleSizeModule = window.App.registerModule.mock.calls.find(c => c[0] === 'sample-size')[1];
            sampleSizeModule.render(container);
        });

        test('loadCrossoverPreset loads preset values', () => {
            window.SampleSizeModule.loadCrossoverPreset('analgesic');
            expect(document.getElementById('ss_co_delta').value).toBe('1.5');
            expect(document.getElementById('ss_co_sd').value).toBe('3');
        });

        test('calculateCrossover computes crossover sample size and compares with parallel', () => {
            document.getElementById('ss_co_delta').value = '1.5';
            document.getElementById('ss_co_sd').value = '3.0';
            document.getElementById('ss_co_periods').value = '2';

            window.SampleSizeModule.calculateCrossover();

            const results = document.getElementById('ss-crossover-results');
            expect(results.innerHTML).toContain('Crossover design');
            expect(results.innerHTML).toContain('Parallel Design N');
        });
    });

    describe('Diagnostic Accuracy Tab', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const sampleSizeModule = window.App.registerModule.mock.calls.find(c => c[0] === 'sample-size')[1];
            sampleSizeModule.render(container);
        });

        test('loadDiagPreset loads preset values', () => {
            window.SampleSizeModule.loadDiagPreset('screen');
            expect(document.getElementById('ss_dx_sens').value).toBe('0.9');
            expect(document.getElementById('ss_dx_spec').value).toBe('0.8');
        });

        test('calculateDiagnostic calculates required sample size for sensitivity and specificity', () => {
            document.getElementById('ss_dx_sens').value = '0.90';
            document.getElementById('ss_dx_spec').value = '0.85';
            document.getElementById('ss_dx_width').value = '0.05';
            document.getElementById('ss_dx_prev').value = '0.20';

            window.SampleSizeModule.calculateDiagnostic();

            const results = document.getElementById('ss-diagnostic-results');
            expect(results.innerHTML).toContain('Diseased Subjects');
            expect(results.innerHTML).toContain('Non-Diseased');
        });
    });

    describe('Cluster RCT Tab', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const sampleSizeModule = window.App.registerModule.mock.calls.find(c => c[0] === 'sample-size')[1];
            sampleSizeModule.render(container);
        });

        test('loadClusterPreset loads preset values', () => {
            window.SampleSizeModule.loadClusterPreset('facility');
            expect(document.getElementById('ss_cl_n').value).toBe('500');
            expect(document.getElementById('ss_cl_icc').value).toBe('0.03');
        });

        test('calculateCluster calculates design effect and adjusted N', () => {
            document.getElementById('ss_cl_n').value = '500';
            document.getElementById('ss_cl_icc').value = '0.03';
            document.getElementById('ss_cl_size').value = '30';

            window.SampleSizeModule.calculateCluster();

            const results = document.getElementById('ss-cluster-results');
            expect(results.innerHTML).toContain('Design effect');
        });
    });

    describe('Stepped-Wedge Tab', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const sampleSizeModule = window.App.registerModule.mock.calls.find(c => c[0] === 'sample-size')[1];
            sampleSizeModule.render(container);
        });

        test('calculateStepped computes stepped-wedge design factor', () => {
            document.getElementById('ss_sw_n').value = '500';
            document.getElementById('ss_sw_steps').value = '5';
            document.getElementById('ss_sw_cps').value = '4';
            document.getElementById('ss_sw_icc').value = '0.03';

            window.SampleSizeModule.calculateStepped();

            const results = document.getElementById('ss-stepped-results');
            expect(results.innerHTML).toContain('clusters');
            expect(results.innerHTML).toContain('correction factor');
        });

        test('calculateStepped shows toast for invalid steps', () => {
            document.getElementById('ss_sw_steps').value = '1';
            window.SampleSizeModule.calculateStepped();
            expect(window.Export.showToast).toHaveBeenCalledWith(
                'Stepped-wedge design requires at least 2 steps and valid inputs.',
                'error'
            );
        });
    });

    describe('Multi-Arm Tab', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const sampleSizeModule = window.App.registerModule.mock.calls.find(c => c[0] === 'sample-size')[1];
            sampleSizeModule.render(container);
        });

        test('calculateMultiArm computes adjusted N with Bonferroni correction', () => {
            document.getElementById('ss_ma_n').value = '400';
            document.getElementById('ss_ma_arms').value = '3';
            document.getElementById('ss_ma_corr').value = 'bonferroni';

            window.SampleSizeModule.calculateMultiArm();

            const results = document.getElementById('ss-multiarm-results');
            expect(results.innerHTML).toContain('bonferroni correction');
        });
    });

    describe('Group Sequential Tab', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const sampleSizeModule = window.App.registerModule.mock.calls.find(c => c[0] === 'sample-size')[1];
            sampleSizeModule.render(container);
        });

        test('loadGSPreset loads preset values', () => {
            window.SampleSizeModule.loadGSPreset('obf3');
            expect(document.getElementById('ss_gs_looks').value).toBe('3');
            expect(document.getElementById('ss_gs_type').value).toBe('obf');
        });

        test('calculateGroupSeq validates fixed N input', () => {
            document.getElementById('ss_gs_fixedn').value = '5';
            window.SampleSizeModule.calculateGroupSeq();
            expect(window.Export.showToast).toHaveBeenCalledWith(
                'Fixed-design N must be at least 10',
                'error'
            );
        });

        test('calculateGroupSeq computes O\'Brien-Fleming stopping boundaries and inflated N', () => {
            document.getElementById('ss_gs_fixedn').value = '800';
            document.getElementById('ss_gs_looks').value = '3';
            document.getElementById('ss_gs_type').value = 'obf';

            window.SampleSizeModule.calculateGroupSeq();

            const results = document.getElementById('ss-groupseq-results');
            expect(results.innerHTML).toContain('O\'Brien-Fleming');
            expect(results.innerHTML).toContain('Stopping Boundaries');
            expect(results.innerHTML).toContain('Inflation Factor');
        });
    });
});
