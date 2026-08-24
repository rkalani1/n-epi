/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const statsCode = fs.readFileSync(path.join(__dirname, '../../js/core/statistics.js'), 'utf8');
const refCode = fs.readFileSync(path.join(__dirname, '../../js/data/references.js'), 'utf8');
const sampleSizeCode = fs.readFileSync(path.join(__dirname, '../../js/modules/sample-size.js'), 'utf8');

describe('Sample Size Calculator Module', () => {
    let registeredModule;

    beforeAll(() => {
        // Global mocks
        window.App = {
            registerModule: jest.fn((id, moduleObj) => {
                registeredModule = moduleObj;
            }),
            createModuleLayout: jest.fn((title, sub) => `<div class="layout-header"><h1>${title}</h1><p>${sub}</p></div>`),
            setTrustedHTML: jest.fn((el, html) => {
                if (el) el.innerHTML = html;
            }),
            autoSaveInputs: jest.fn(),
            tooltip: jest.fn(txt => `[tooltip: ${txt}]`)
        };

        window.Export = {
            showToast: jest.fn(),
            exportCanvasPNG: jest.fn(),
            formatGrantJustification: jest.fn().mockReturnValue('Grant justification text'),
            copyText: jest.fn(),
            addToHistory: jest.fn()
        };

        window.Charts = {
            LineChart: jest.fn(),
            BarChart: jest.fn()
        };

        window.RGenerator = {
            showScript: jest.fn(),
            sampleSize: {
                twoProportions: jest.fn().mockReturnValue('# R code proportions'),
                twoMeans: jest.fn().mockReturnValue('# R code means'),
                survival: jest.fn().mockReturnValue('# R code survival')
            }
        };

        // Evaluate Statistics
        window.eval(statsCode + '\n window.Statistics = Statistics;');
        // Evaluate References
        window.eval(refCode + '\n window.References = References;');
        // Evaluate SampleSize module
        window.eval(sampleSizeCode);
    });

    beforeEach(() => {
        document.body.innerHTML = '<div id="module-container"></div>';
        jest.clearAllMocks();
        jest.useFakeTimers();
        // Re-assign mock implementation for registerModule after clearAllMocks
        window.App.registerModule = jest.fn((id, moduleObj) => {
            registeredModule = moduleObj;
        });
        window.App.registerModule('sample-size', registeredModule);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should register the sample-size module with App', () => {
        expect(App.registerModule).toHaveBeenCalledWith('sample-size', expect.any(Object));
        expect(registeredModule).toBeDefined();
        expect(typeof registeredModule.render).toBe('function');
        expect(typeof registeredModule.onThemeChange).toBe('function');
    });

    it('should render module layout and inputs correctly', () => {
        const container = document.getElementById('module-container');
        registeredModule.render(container);

        expect(App.createModuleLayout).toHaveBeenCalledWith(
            'Sample Size Calculator',
            expect.any(String)
        );
        expect(App.setTrustedHTML).toHaveBeenCalled();
        expect(App.autoSaveInputs).toHaveBeenCalledWith(container, 'sample-size');
        expect(container.innerHTML).toContain('ss-tabs');
        expect(container.innerHTML).toContain('tab-proportions');
        expect(container.innerHTML).toContain('tab-means');
    });

    it('should switch tabs properly', () => {
        const container = document.getElementById('module-container');
        registeredModule.render(container);

        window.SampleSizeModule.switchTab('means');
        expect(document.querySelector('.tab[data-tab="means"]').classList.contains('active')).toBe(true);
        expect(document.getElementById('tab-means').classList.contains('active')).toBe(true);
        expect(document.getElementById('tab-proportions').classList.contains('active')).toBe(false);

        window.SampleSizeModule.switchTab('survival');
        expect(document.querySelector('.tab[data-tab="survival"]').classList.contains('active')).toBe(true);
        expect(document.getElementById('tab-survival').classList.contains('active')).toBe(true);
    });

    it('should synchronize proportions rates and ARR', () => {
        const container = document.getElementById('module-container');
        registeredModule.render(container);

        document.getElementById('ss_p1').value = '0.30';
        document.getElementById('ss_p2').value = '0.10';

        window.SampleSizeModule.syncRates('p1');
        expect(document.getElementById('ss_arr').value).toBe('0.200');

        document.getElementById('ss_arr').value = '0.15';
        window.SampleSizeModule.syncRates('arr');
        expect(document.getElementById('ss_p2').value).toBe('0.150');
    });

    it('should load presets correctly for all tabs', () => {
        const container = document.getElementById('module-container');
        registeredModule.render(container);

        // Proportions preset
        window.SampleSizeModule.loadPreset('lvo');
        expect(document.getElementById('ss_p1').value).toBe('0.28');
        expect(document.getElementById('ss_p2').value).toBe('0.46');

        // Means preset
        window.SampleSizeModule.loadMeansPreset('nihss');
        expect(document.getElementById('ss_delta').value).toBe('4');
        expect(document.getElementById('ss_sd1').value).toBe('8');

        // Survival preset
        window.SampleSizeModule.loadSurvivalPreset('onc');
        expect(document.getElementById('ss_hr').value).toBe('0.75');
        expect(document.getElementById('ss_medsurv').value).toBe('18');

        // Non-inferiority preset
        window.SampleSizeModule.loadNonInfPreset('generic');
        expect(document.getElementById('ss_ni_p').value).toBe('0.3');
        expect(document.getElementById('ss_ni_margin').value).toBe('0.1');

        // Equivalence preset
        window.SampleSizeModule.loadEquivPreset('bioequiv');
        expect(document.getElementById('ss_eq_p').value).toBe('0.5');
        expect(document.getElementById('ss_eq_margin').value).toBe('0.2');

        // Crossover preset
        window.SampleSizeModule.loadCrossoverPreset('analgesic');
        expect(document.getElementById('ss_co_delta').value).toBe('1.5');
        expect(document.getElementById('ss_co_sd').value).toBe('3');

        // Diagnostic preset
        window.SampleSizeModule.loadDiagPreset('screen');
        expect(document.getElementById('ss_dx_sens').value).toBe('0.9');
        expect(document.getElementById('ss_dx_prev').value).toBe('0.1');

        // Cluster preset
        window.SampleSizeModule.loadClusterPreset('facility');
        expect(document.getElementById('ss_cl_n').value).toBe('500');
        expect(document.getElementById('ss_cl_icc').value).toBe('0.03');

        // Group sequential preset
        window.SampleSizeModule.loadGSPreset('obf3');
        expect(document.getElementById('ss_gs_looks').value).toBe('3');
        expect(document.getElementById('ss_gs_type').value).toBe('obf');

        // mRS preset
        window.SampleSizeModule.loadMRSPreset('ESCAPE Control');
        expect(document.getElementById('ss_mrs_ctrl_0').value).toBe('0.06');
        expect(document.getElementById('ss-mrs-sum').textContent).toContain('Sum: 1.00');
    });

    describe('Calculations & Result Renderings', () => {
        beforeEach(() => {
            const container = document.getElementById('module-container');
            registeredModule.render(container);
        });

        it('should calculate Two Proportions correctly', () => {
            document.getElementById('ss_p1').value = '0.28';
            document.getElementById('ss_p2').value = '0.20';
            document.getElementById('ss_alpha').value = '0.05';
            document.getElementById('ss_power').value = '0.80';
            document.getElementById('ss_dropout').value = '10';

            window.SampleSizeModule.calculateProportions();

            const results = document.getElementById('ss-proportions-results');
            expect(results.innerHTML).toContain('participants');
            expect(results.innerHTML).toContain('Fleiss (corrected)');
            expect(Export.addToHistory).toHaveBeenCalled();

            jest.advanceTimersByTime(150);
            expect(Charts.LineChart).toHaveBeenCalled();
        });

        it('should validate Two Proportions inputs and handle equal rates error', () => {
            document.getElementById('ss_p1').value = '0.20';
            document.getElementById('ss_p2').value = '0.20';

            window.SampleSizeModule.calculateProportions();
            expect(Export.showToast).toHaveBeenCalledWith('Control and treatment rates must differ', 'error');

            // Test field validation out-of-bounds
            document.getElementById('ss_p1').value = '1.5';
            window.SampleSizeModule.calculateProportions();
            expect(document.getElementById('ss_p1-err')).not.toBeNull();
        });

        it('should calculate Two Means correctly', () => {
            document.getElementById('ss_delta').value = '4';
            document.getElementById('ss_sd1').value = '8';
            document.getElementById('ss_sd2').value = '8';
            document.getElementById('ssm_alpha').value = '0.05';
            document.getElementById('ssm_power').value = '0.80';

            window.SampleSizeModule.calculateMeans();

            const results = document.getElementById('ss-means-results');
            expect(results.innerHTML).toContain('participants');
            expect(results.innerHTML).toContain("Cohen's d");
            expect(Export.addToHistory).toHaveBeenCalled();

            jest.advanceTimersByTime(150);
            expect(Charts.LineChart).toHaveBeenCalled();
        });

        it('should calculate Time-to-Event (Survival) correctly', () => {
            document.getElementById('ss_hr').value = '0.70';
            document.getElementById('ss_medsurv').value = '24';
            document.getElementById('ss_accrual').value = '24';
            document.getElementById('ss_followup').value = '12';

            window.SampleSizeModule.calculateSurvival();

            const results = document.getElementById('ss-survival-results');
            expect(results.innerHTML).toContain('events needed');
            expect(results.innerHTML).toContain('Schoenfeld formula');

            jest.advanceTimersByTime(150);
            expect(Charts.LineChart).toHaveBeenCalled();
        });

        it('should calculate mRS Ordinal Shift correctly and handle invalid distribution sum', () => {
            window.SampleSizeModule.loadMRSPreset('ESCAPE Control');
            document.getElementById('ss_common_or').value = '1.5';

            window.SampleSizeModule.calculateOrdinal();
            const results = document.getElementById('ss-ordinal-results');
            expect(results.innerHTML).toContain('Proportional odds model (Whitehead formula)');

            jest.advanceTimersByTime(150);
            expect(Charts.BarChart).toHaveBeenCalled();

            // Make sum invalid
            document.getElementById('ss_mrs_ctrl_0').value = '0.99';
            window.SampleSizeModule.calculateOrdinal();
            expect(Export.showToast).toHaveBeenCalledWith('Distribution must sum to 1.0', 'error');
        });

        it('should calculate Non-Inferiority sample size', () => {
            document.getElementById('ss_ni_p').value = '0.30';
            document.getElementById('ss_ni_margin').value = '0.05';
            document.getElementById('ss_ni_alpha').value = '0.025';
            document.getElementById('ss_ni_power').value = '0.80';

            window.SampleSizeModule.calculateNonInf();

            const results = document.getElementById('ss-noninf-results');
            expect(results.innerHTML).toContain('Non-inferiority design');
            expect(results.innerHTML).toContain('margin = 0.05');
        });

        it('should calculate Equivalence sample size', () => {
            document.getElementById('ss_eq_p').value = '0.50';
            document.getElementById('ss_eq_margin').value = '0.10';
            document.getElementById('ss_eq_alpha').value = '0.025';
            document.getElementById('ss_eq_power').value = '0.80';

            window.SampleSizeModule.calculateEquivalence();

            const results = document.getElementById('ss-equivalence-results');
            expect(results.innerHTML).toContain('Equivalence (TOST) design');
        });

        it('should calculate Crossover sample size', () => {
            document.getElementById('ss_co_delta').value = '1.5';
            document.getElementById('ss_co_sd').value = '3.0';
            document.getElementById('ss_co_periods').value = '2';

            window.SampleSizeModule.calculateCrossover();

            const results = document.getElementById('ss-crossover-results');
            expect(results.innerHTML).toContain('Crossover design (2 periods)');
            expect(results.innerHTML).toContain('N Saved vs Parallel');
        });

        it('should calculate Diagnostic Accuracy sample size', () => {
            document.getElementById('ss_dx_sens').value = '0.90';
            document.getElementById('ss_dx_spec').value = '0.85';
            document.getElementById('ss_dx_width').value = '0.05';
            document.getElementById('ss_dx_prev').value = '0.20';

            window.SampleSizeModule.calculateDiagnostic();

            const results = document.getElementById('ss-diagnostic-results');
            expect(results.innerHTML).toContain('Diagnostic accuracy study');
            expect(results.innerHTML).toContain('Diseased Subjects');
        });

        it('should calculate Cluster RCT sample size', () => {
            document.getElementById('ss_cl_n').value = '500';
            document.getElementById('ss_cl_icc').value = '0.03';
            document.getElementById('ss_cl_size').value = '30';

            window.SampleSizeModule.calculateCluster();

            const results = document.getElementById('ss-cluster-results');
            expect(results.innerHTML).toContain('Design effect =');
            expect(results.innerHTML).toContain('Clusters per Arm');
        });

        it('should calculate Stepped-Wedge RCT sample size and handle invalid parameters', () => {
            document.getElementById('ss_sw_n').value = '500';
            document.getElementById('ss_sw_steps').value = '5';
            document.getElementById('ss_sw_cps').value = '4';
            document.getElementById('ss_sw_icc').value = '0.03';

            window.SampleSizeModule.calculateStepped();

            const results = document.getElementById('ss-stepped-results');
            expect(results.innerHTML).toContain('stepped-wedge cluster randomized design');

            // Invalid steps
            document.getElementById('ss_sw_steps').value = '1';
            window.SampleSizeModule.calculateStepped();
            expect(Export.showToast).toHaveBeenCalledWith(
                'Stepped-wedge design requires at least 2 steps and valid inputs.',
                'error'
            );
        });

        it('should calculate Multi-Arm sample size', () => {
            document.getElementById('ss_ma_n').value = '400';
            document.getElementById('ss_ma_arms').value = '3';
            document.getElementById('ss_ma_corr').value = 'bonferroni';

            window.SampleSizeModule.calculateMultiArm();

            const results = document.getElementById('ss-multiarm-results');
            expect(results.innerHTML).toContain('bonferroni correction');
            expect(results.innerHTML).toContain('per arm (3 arms)');
        });

        it('should calculate Group Sequential design sample size and handle invalid N', () => {
            document.getElementById('ss_gs_fixedn').value = '800';
            document.getElementById('ss_gs_looks').value = '3';
            document.getElementById('ss_gs_type').value = 'obf';

            window.SampleSizeModule.calculateGroupSeq();

            const results = document.getElementById('ss-groupseq-results');
            expect(results.innerHTML).toContain('Group sequential design: O\'Brien-Fleming');
            expect(results.innerHTML).toContain('Stopping Boundaries');

            // Invalid fixed N
            document.getElementById('ss_gs_fixedn').value = '5';
            window.SampleSizeModule.calculateGroupSeq();
            expect(Export.showToast).toHaveBeenCalledWith('Fixed-design N must be at least 10', 'error');
        });
    });
});
