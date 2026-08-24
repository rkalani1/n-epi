/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Epidemiology Calculators Module', () => {
    beforeEach(() => {
        // Setup simple DOM
        document.body.innerHTML = '<div id="container"></div>';

        // Mock global App, Export, Statistics, References, Charts, RGenerator
        window.App = {
            createModuleLayout: jest.fn((title, desc) => `<div class="module-title">${title}</div><div class="module-desc">${desc}</div>`),
            setTrustedHTML: jest.fn((container, html) => {
                if (container) container.innerHTML = html;
            }),
            autoSaveInputs: jest.fn(),
            registerModule: jest.fn(),
            tooltip: jest.fn(text => `[tooltip: ${text}]`)
        };

        window.Export = {
            showToast: jest.fn(),
            copyText: jest.fn(),
            addToHistory: jest.fn()
        };

        window.Statistics = {
            formatPValue: jest.fn(val => `<p=${val}>`),
            formatCI: jest.fn((l, u, p) => `(${l.toFixed(p)}, ${u.toFixed(p)})`),
            twoByTwo: jest.fn((a, b, c, d) => ({
                p1: a / (a + b),
                p2: c / (c + d),
                rr: { value: 1.5, ci: { lower: 1.1, upper: 2.0 } },
                or: { value: 2.0, ci: { lower: 1.2, upper: 3.2 } },
                rd: { value: 0.1, ci: { lower: 0.02, upper: 0.18 }, newcombe: { diff: 0.1, lower: 0.02, upper: 0.18 } },
                rdNewcombe: { diff: 0.1, lower: 0.02, upper: 0.18 },
                nnt: { value: 10, isHarm: false },
                chi2: { chi2: 4.5, pValue: 0.034 },
                chi2Yates: { chi2: 4.1, pValue: 0.042 },
                fisher: { pValue: 0.035 },
                afExposed: 0.33,
                paf: 0.20,
                continuityCorrected: false
            })),
            mantelHaenszel: jest.fn((tables, measure) => ({
                estimate: 1.8,
                ci: { lower: 1.2, upper: 2.7 },
                stratumEstimates: [1.7, 1.9, 1.8],
                correctedStrata: [],
                breslowDay: { statistic: 0.5, df: 2, pValue: 0.78 }
            })),
            additiveInteraction: jest.fn((rr11, rr10, rr01) => ({
                reri: rr11 - rr10 - rr01 + 1,
                ap: (rr11 - rr10 - rr01 + 1) / rr11,
                s: (rr11 - 1) / ((rr10 - 1) + (rr01 - 1))
            })),
            cochranArmitageTrend: jest.fn((counts, totals, scores) => ({
                z: 2.45,
                pValue: 0.014
            })),
            chiSquaredTest2x2: jest.fn((a, b, c, d) => ({ chi2: 5.2, pValue: 0.022 })),
            fisherExact: jest.fn((a, b, c, d) => ({ pValue: 0.025 })),
            mcNemarTest: jest.fn((b, c, exact) => ({ chi2: 4.0, pValue: 0.045 })),
            normalQuantile: jest.fn(p => 1.96),
            incidenceRate: jest.fn((events, pt, alpha) => ({
                rate: events / pt,
                ci: { lower: (events / pt) * 0.7, upper: (events / pt) * 1.3 }
            })),
            rateRatio: jest.fn((e1, pt1, e2, pt2) => ({
                ratio: (e1 / pt1) / (e2 / pt2),
                ci: { lower: 1.1, upper: 2.5 }
            })),
            clopperPearsonCI: jest.fn((x, n, alpha) => ({ lower: 0.03, upper: 0.08 })),
            waldCI: jest.fn((p, n, z) => ({ lower: 0.03, upper: 0.07 })),
            wilsonCI: jest.fn((p, n, z) => ({ lower: 0.035, upper: 0.075 })),
            smr: jest.fn((obs, exp, alpha) => ({
                smr: obs / exp,
                ci: { lower: 1.15, upper: 1.68 }
            })),
            directStandardization: jest.fn(rates => ({
                rate: 0.0025,
                se: 0.0001,
                ci: { lower: 0.0023, upper: 0.0027 }
            }))
        };

        window.References = {
            biases: [
                {
                    name: 'Selection Bias',
                    description: 'Distortion from selection procedures.',
                    strokeExample: 'Hospital controls differ from general population.',
                    mitigation: 'Use population-based controls.'
                }
            ],
            standardPopulations: {
                'WHO World Standard': [
                    { ageGroup: '0-44', weight: 59490 },
                    { ageGroup: '45+', weight: 40510 }
                ]
            }
        };

        window.RGenerator = {
            showScript: jest.fn(),
            epiTwoByTwo: jest.fn(),
            epiMantelHaenszel: jest.fn()
        };

        window.Charts = {
            LineChart: jest.fn(),
            BarChart: jest.fn()
        };

        // Load epidemiology-calcs.js
        const filePath = path.resolve(__dirname, '../../js/modules/epidemiology-calcs.js');
        const code = fs.readFileSync(filePath, 'utf8');
        eval(code);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('API Exposure & Registration', () => {
        test('registers module with App', () => {
            expect(window.App.registerModule).toHaveBeenCalledWith(
                'epidemiology-calcs',
                expect.objectContaining({ render: expect.any(Function) })
            );
        });

        test('exposes EpiCalcModule globally', () => {
            expect(window.EpiCalcModule).toBeDefined();
            expect(typeof window.EpiCalcModule.switchTab).toBe('function');
            expect(typeof window.EpiCalcModule.calc2x2).toBe('function');
            expect(typeof window.EpiCalcModule.calcMH).toBe('function');
            expect(typeof window.EpiCalcModule.calcInteraction).toBe('function');
            expect(typeof window.EpiCalcModule.calcDoseResponse).toBe('function');
            expect(typeof window.EpiCalcModule.calcCaseControl).toBe('function');
            expect(typeof window.EpiCalcModule.calcScreening).toBe('function');
            expect(typeof window.EpiCalcModule.calcPAF).toBe('function');
            expect(typeof window.EpiCalcModule.calcIncidence).toBe('function');
            expect(typeof window.EpiCalcModule.calcRateRatio).toBe('function');
            expect(typeof window.EpiCalcModule.calcPrevalence).toBe('function');
            expect(typeof window.EpiCalcModule.calcSMR).toBe('function');
            expect(typeof window.EpiCalcModule.calcAgeStd).toBe('function');
            expect(typeof window.EpiCalcModule.calcDALY).toBe('function');
        });
    });

    describe('Render & Tab Switching', () => {
        test('render populates layout and initializes inputs', () => {
            const container = document.getElementById('container');
            const renderFunc = window.App.registerModule.mock.calls[0][1].render;
            renderFunc(container);

            expect(window.App.createModuleLayout).toHaveBeenCalledWith(
                'Epidemiology Calculators',
                expect.any(String)
            );
            expect(window.App.setTrustedHTML).toHaveBeenCalled();
            expect(window.App.autoSaveInputs).toHaveBeenCalledWith(container, 'epidemiology-calcs');
        });

        test('switchTab toggles tab classes correctly', () => {
            const container = document.getElementById('container');
            const renderFunc = window.App.registerModule.mock.calls[0][1].render;
            renderFunc(container);

            window.EpiCalcModule.switchTab('stratified');

            const mhTab = document.querySelector('[data-tab="stratified"]');
            expect(mhTab.classList.contains('active')).toBe(true);

            const mhContent = document.getElementById('epi-tab-stratified');
            expect(mhContent.classList.contains('active')).toBe(true);
        });
    });

    describe('2x2 Table Calculations', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('calc2x2 computes results with valid inputs', () => {
            document.getElementById('epi_a').value = '30';
            document.getElementById('epi_b').value = '70';
            document.getElementById('epi_c').value = '15';
            document.getElementById('epi_d').value = '85';

            window.EpiCalcModule.calc2x2();

            expect(window.Statistics.twoByTwo).toHaveBeenCalledWith(30, 70, 15, 85);
            expect(window.Export.addToHistory).toHaveBeenCalled();
            expect(document.getElementById('epi-2x2-results').innerHTML).toContain('Summary Table');
        });

        test('calc2x2 handles missing or invalid inputs', () => {
            document.getElementById('epi_a').value = '';
            window.EpiCalcModule.calc2x2();
            expect(window.Export.showToast).toHaveBeenCalledWith('Fill all cells', 'error');
        });

        test('copy2x2 copies text', () => {
            document.getElementById('epi_a').value = '30';
            document.getElementById('epi_b').value = '70';
            document.getElementById('epi_c').value = '15';
            document.getElementById('epi_d').value = '85';
            window.EpiCalcModule.calc2x2();

            window.EpiCalcModule.copy2x2();
            expect(window.Export.copyText).toHaveBeenCalled();
        });
    });

    describe('Stratified Analysis (MH)', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('buildMHInputs builds table rows', () => {
            document.getElementById('epi_mh_k').value = '2';
            window.EpiCalcModule.buildMHInputs();
            expect(document.getElementById('epi-mh-inputs').innerHTML).toContain('Stratum');
        });

        test('calcMH calculates pooled Mantel-Haenszel estimate', () => {
            document.getElementById('epi_mh_k').value = '2';
            window.EpiCalcModule.buildMHInputs();

            window.EpiCalcModule.calcMH();
            expect(window.Statistics.mantelHaenszel).toHaveBeenCalled();
            expect(document.getElementById('epi-mh-results').innerHTML).toContain('Mantel-Haenszel');
        });
    });

    describe('Interaction Assessment', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('calcInteraction assesses additive & multiplicative interaction', () => {
            document.getElementById('epi_rr11').value = '4.0';
            document.getElementById('epi_rr10').value = '2.5';
            document.getElementById('epi_rr01').value = '1.8';

            window.EpiCalcModule.calcInteraction();
            expect(window.Statistics.additiveInteraction).toHaveBeenCalledWith(4.0, 2.5, 1.8);
            expect(document.getElementById('epi-interaction-results').innerHTML).toContain('RERI');
        });
    });

    describe('Case-Control & Screening Metrics', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('calcCaseControl computes matched and unmatched statistics', () => {
            document.getElementById('epi_cc_a').value = '40';
            document.getElementById('epi_cc_b').value = '20';
            document.getElementById('epi_cc_c').value = '60';
            document.getElementById('epi_cc_d').value = '80';

            window.EpiCalcModule.calcCaseControl();
            expect(document.getElementById('epi-cc-results').innerHTML).toContain('Unmatched Case-Control Results');
        });

        test('calcScreening computes PPV and NPV', () => {
            document.getElementById('epi_scr_sens').value = '90';
            document.getElementById('epi_scr_spec').value = '95';
            document.getElementById('epi_scr_prev').value = '5';

            window.EpiCalcModule.calcScreening();
            expect(document.getElementById('epi-scr-results').innerHTML).toContain('PPV');
        });
    });

    describe('Rates, SMR & Age Standardization', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            window.App.registerModule.mock.calls[0][1].render(container);
        });

        test('calcIncidence calculates rate', () => {
            document.getElementById('epi_ir_events').value = '50';
            document.getElementById('epi_ir_pt').value = '10000';

            window.EpiCalcModule.calcIncidence();
            expect(window.Statistics.incidenceRate).toHaveBeenCalledWith(50, 10000, 0.05);
            expect(document.getElementById('epi-incidence-results').innerHTML).toContain('Incidence Rate');
        });

        test('calcPrevalence calculates prevalence with Clopper-Pearson CI', () => {
            document.getElementById('epi_prev_x').value = '25';
            document.getElementById('epi_prev_n').value = '500';

            window.EpiCalcModule.calcPrevalence();
            expect(window.Statistics.clopperPearsonCI).toHaveBeenCalledWith(25, 500, 0.05);
            expect(document.getElementById('epi-prevalence-results').innerHTML).toContain('Prevalence');
        });

        test('calcSMR calculates standardized mortality ratio', () => {
            document.getElementById('epi_smr_obs').value = '120';
            document.getElementById('epi_smr_exp').value = '85.5';

            window.EpiCalcModule.calcSMR();
            expect(window.Statistics.smr).toHaveBeenCalledWith(120, 85.5, 0.05);
            expect(document.getElementById('epi-smr-results').innerHTML).toContain('Standardized Mortality Ratio');
        });

        test('calcDALY computes DALY, YLL, and YLD', () => {
            document.getElementById('epi_yll_deaths').value = '10';
            document.getElementById('epi_yll_le').value = '18.5';
            document.getElementById('epi_yld_cases').value = '100';
            document.getElementById('epi_yld_duration').value = '5';
            document.getElementById('epi_yld_dw').value = '0.333';

            window.EpiCalcModule.calcDALY();
            expect(document.getElementById('epi-daly-results').innerHTML).toContain('Disability-Adjusted Life Years');
        });
    });
});
