/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Epidemiology Calculators Module', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="container"></div>';

        window.App = {
            createModuleLayout: jest.fn((title, desc) => `<div class="module-title">${title}</div><div class="module-desc">${desc}</div>`),
            setTrustedHTML: jest.fn((container, html) => {
                if (container) container.innerHTML = html;
            }),
            autoSaveInputs: jest.fn(),
            registerModule: jest.fn(),
            tooltip: jest.fn(text => `<span title="${text}">?</span>`)
        };

        window.Export = {
            showToast: jest.fn(),
            copyText: jest.fn(),
            addToHistory: jest.fn()
        };

        window.Charts = {
            LineChart: jest.fn(),
            BarChart: jest.fn()
        };

        window.RGenerator = {
            showScript: jest.fn(),
            epiTwoByTwo: jest.fn(),
            epiMantelHaenszel: jest.fn()
        };

        window.References = {
            biases: [
                { name: 'Selection Bias', description: 'Sample selection distortion', strokeExample: 'Example', mitigation: 'Random sampling' }
            ],
            standardPopulations: {
                'WHO World Standard': [
                    { ageGroup: '0-44', weight: 59490 },
                    { ageGroup: '45+', weight: 40510 }
                ]
            }
        };

        // Load core statistics module
        const statsPath = path.resolve(__dirname, '../../js/core/statistics.js');
        const statsCode = fs.readFileSync(statsPath, 'utf8');
        window.eval(statsCode + '\n window.Statistics = Statistics;');

        // Load epidemiology-calcs.js module
        const epiCalcsPath = path.resolve(__dirname, '../../js/modules/epidemiology-calcs.js');
        const epiCode = fs.readFileSync(epiCalcsPath, 'utf8');
        window.eval(epiCode);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('API Exposure', () => {
        test('EpiCalcModule is exposed on window', () => {
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

    describe('Module Render', () => {
        test('render populates container with module layout and tab contents', () => {
            const container = document.getElementById('container');
            const mod = window.App.registerModule.mock.calls[0][1];
            mod.render(container);

            expect(window.App.createModuleLayout).toHaveBeenCalledWith(
                'Epidemiology Calculators',
                expect.any(String)
            );
            expect(window.App.setTrustedHTML).toHaveBeenCalled();
            expect(window.App.autoSaveInputs).toHaveBeenCalledWith(container, 'epidemiology-calcs');

            expect(container.innerHTML).toContain('epi-tabs');
            expect(container.innerHTML).toContain('epi-tab-twobytwo');
            expect(container.innerHTML).toContain('epi-tab-stratified');
            expect(container.innerHTML).toContain('epi-tab-interaction');
            expect(container.innerHTML).toContain('epi-tab-doseresponse');
            expect(container.innerHTML).toContain('epi-tab-casecontrol');
            expect(container.innerHTML).toContain('epi-tab-screening');
            expect(container.innerHTML).toContain('epi-tab-paf');
            expect(container.innerHTML).toContain('epi-tab-incidence');
            expect(container.innerHTML).toContain('epi-tab-rateratio');
            expect(container.innerHTML).toContain('epi-tab-prevalence');
            expect(container.innerHTML).toContain('epi-tab-smr');
            expect(container.innerHTML).toContain('epi-tab-agestd');
            expect(container.innerHTML).toContain('epi-tab-daly');
            expect(container.innerHTML).toContain('epi-tab-bias');
        });

        test('switchTab toggles active tab and content', () => {
            const container = document.getElementById('container');
            const mod = window.App.registerModule.mock.calls[0][1];
            mod.render(container);

            window.EpiCalcModule.switchTab('stratified');
            const activeTab = document.querySelector('#epi-tabs .tab.active');
            expect(activeTab.dataset.tab).toBe('stratified');
            expect(document.getElementById('epi-tab-stratified').classList.contains('active')).toBe(true);
            expect(document.getElementById('epi-tab-twobytwo').classList.contains('active')).toBe(false);
        });
    });

    describe('2x2 Table Calculations', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const mod = window.App.registerModule.mock.calls[0][1];
            mod.render(container);
        });

        test('calc2x2 calculates risk ratio, odds ratio, and risk difference', () => {
            document.getElementById('epi_a').value = '30';
            document.getElementById('epi_b').value = '70';
            document.getElementById('epi_c').value = '15';
            document.getElementById('epi_d').value = '85';

            window.EpiCalcModule.calc2x2();

            const resultsHtml = document.getElementById('epi-2x2-results').innerHTML;
            expect(resultsHtml).toContain('RR');
            expect(resultsHtml).toContain('OR');
            expect(resultsHtml).toContain('2.000'); // RR = (30/100) / (15/100) = 2.0
            expect(window.Export.addToHistory).toHaveBeenCalled();
        });

        test('calc2x2 shows error on invalid input', () => {
            document.getElementById('epi_a').value = '-5';
            window.EpiCalcModule.calc2x2();

            expect(window.Export.showToast).toHaveBeenCalledWith(
                'Cell counts must be non-negative',
                'error'
            );
        });

        test('copy2x2 copies text to clipboard', () => {
            document.getElementById('epi_a').value = '30';
            document.getElementById('epi_b').value = '70';
            document.getElementById('epi_c').value = '15';
            document.getElementById('epi_d').value = '85';
            window.EpiCalcModule.calc2x2();

            window.EpiCalcModule.copy2x2();
            expect(window.Export.copyText).toHaveBeenCalled();
            expect(window.Export.copyText.mock.calls[0][0]).toContain('2x2 Table Analysis');
        });

        test('genMethods2x2 generates text output', () => {
            document.getElementById('epi_a').value = '30';
            document.getElementById('epi_b').value = '70';
            document.getElementById('epi_c').value = '15';
            document.getElementById('epi_d').value = '85';
            window.EpiCalcModule.calc2x2();

            window.EpiCalcModule.genMethods2x2();
            const methodsHtml = document.getElementById('epi-2x2-methods').innerHTML;
            expect(methodsHtml).toContain('A 2x2 contingency table analysis was performed');
        });
    });

    describe('Mantel-Haenszel Stratified Analysis', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const mod = window.App.registerModule.mock.calls[0][1];
            mod.render(container);
            window.EpiCalcModule.buildMHInputs();
        });

        test('calcMH performs pooled analysis across strata', () => {
            document.getElementById('epi_mh_k').value = '2';
            window.EpiCalcModule.buildMHInputs();

            document.getElementById('epi_mh_0_a').value = '10';
            document.getElementById('epi_mh_0_b').value = '40';
            document.getElementById('epi_mh_0_c').value = '5';
            document.getElementById('epi_mh_0_d').value = '45';

            document.getElementById('epi_mh_1_a').value = '20';
            document.getElementById('epi_mh_1_b').value = '30';
            document.getElementById('epi_mh_1_c').value = '15';
            document.getElementById('epi_mh_1_d').value = '35';

            window.EpiCalcModule.calcMH();

            const resultsHtml = document.getElementById('epi-mh-results').innerHTML;
            expect(resultsHtml).toContain('OR (MH)');
            expect(window.Export.addToHistory).toHaveBeenCalled();
        });

        test('copyMH and genMethodsMH work properly', () => {
            document.getElementById('epi_mh_k').value = '2';
            window.EpiCalcModule.buildMHInputs();
            window.EpiCalcModule.calcMH();

            window.EpiCalcModule.copyMH();
            expect(window.Export.copyText).toHaveBeenCalled();

            window.EpiCalcModule.genMethodsMH();
            expect(document.getElementById('epi-mh-methods').innerHTML).toContain('Mantel-Haenszel');
        });
    });

    describe('Interaction Assessment', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const mod = window.App.registerModule.mock.calls[0][1];
            mod.render(container);
        });

        test('calcInteraction evaluates additive and multiplicative interaction', () => {
            document.getElementById('epi_rr11').value = '4.0';
            document.getElementById('epi_rr10').value = '2.5';
            document.getElementById('epi_rr01').value = '1.8';

            window.EpiCalcModule.calcInteraction();

            const resultsHtml = document.getElementById('epi-interaction-results').innerHTML;
            expect(resultsHtml).toContain('RERI');
            expect(resultsHtml).toContain('Multiplicative Interaction');
            expect(window.Export.addToHistory).toHaveBeenCalled();
        });
    });

    describe('Dose-Response Trend Test', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const mod = window.App.registerModule.mock.calls[0][1];
            mod.render(container);
            window.EpiCalcModule.buildDRInputs();
        });

        test('calcDoseResponse calculates Cochran-Armitage test statistic', () => {
            window.EpiCalcModule.calcDoseResponse();

            const resultsHtml = document.getElementById('epi-dr-results').innerHTML;
            expect(resultsHtml).toContain('Cochran-Armitage Trend Test');
            expect(window.Export.addToHistory).toHaveBeenCalled();
        });
    });

    describe('Case-Control Analysis', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const mod = window.App.registerModule.mock.calls[0][1];
            mod.render(container);
        });

        test('calcCaseControl calculates unmatched and matched ORs', () => {
            document.getElementById('epi_cc_a').value = '40';
            document.getElementById('epi_cc_b').value = '20';
            document.getElementById('epi_cc_c').value = '60';
            document.getElementById('epi_cc_d').value = '80';

            document.getElementById('epi_cc_m_a').value = '25';
            document.getElementById('epi_cc_m_b').value = '35';
            document.getElementById('epi_cc_m_c').value = '10';
            document.getElementById('epi_cc_m_d').value = '30';

            window.EpiCalcModule.calcCaseControl();

            const resultsHtml = document.getElementById('epi-cc-results').innerHTML;
            expect(resultsHtml).toContain('Unmatched Case-Control Results');
            expect(resultsHtml).toContain('Matched Case-Control Results');
            expect(resultsHtml).toContain('Cornfield');
            expect(resultsHtml).toContain('McNemar');
        });
    });

    describe('Screening Metrics', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const mod = window.App.registerModule.mock.calls[0][1];
            mod.render(container);
        });

        test('calcScreening calculates PPV, NPV, +LR, -LR', () => {
            document.getElementById('epi_scr_sens').value = '90';
            document.getElementById('epi_scr_spec').value = '95';
            document.getElementById('epi_scr_prev').value = '5';

            window.EpiCalcModule.calcScreening();

            const resultsHtml = document.getElementById('epi-scr-results').innerHTML;
            expect(resultsHtml).toContain('PPV');
            expect(resultsHtml).toContain('NPV');
            expect(resultsHtml).toContain('+LR');
            expect(resultsHtml).toContain('-LR');
        });
    });

    describe('Population Attributable Fraction (PAF)', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const mod = window.App.registerModule.mock.calls[0][1];
            mod.render(container);
            window.EpiCalcModule.buildPAFInputs();
        });

        test('calcPAF calculates overall and level-specific PAF', () => {
            window.EpiCalcModule.calcPAF();

            const resultsHtml = document.getElementById('epi-paf-results').innerHTML;
            expect(resultsHtml).toContain('PAF =');
            expect(resultsHtml).toContain('Level-Specific Contributions');
        });
    });

    describe('Incidence, Rate Ratio, Prevalence, SMR, Age Standardization, DALY', () => {
        beforeEach(() => {
            const container = document.getElementById('container');
            const mod = window.App.registerModule.mock.calls[0][1];
            mod.render(container);
        });

        test('calcIncidence calculates incidence rate and CI', () => {
            document.getElementById('epi_ir_events').value = '50';
            document.getElementById('epi_ir_pt').value = '10000';
            window.EpiCalcModule.calcIncidence();

            const resultsHtml = document.getElementById('epi-incidence-results').innerHTML;
            expect(resultsHtml).toContain('Incidence Rate');
            expect(resultsHtml).toContain('5.00 per 1,000');
        });

        test('calcRateRatio calculates IRR and CI', () => {
            document.getElementById('epi_rr_events1').value = '30';
            document.getElementById('epi_rr_pt1').value = '5000';
            document.getElementById('epi_rr_events2').value = '20';
            document.getElementById('epi_rr_pt2').value = '8000';
            window.EpiCalcModule.calcRateRatio();

            const resultsHtml = document.getElementById('epi-rateratio-results').innerHTML;
            expect(resultsHtml).toContain('Incidence Rate Ratio (IRR)');
            expect(resultsHtml).toContain('2.400'); // (30/5000) / (20/8000) = 0.006 / 0.0025 = 2.4
        });

        test('calcPrevalence calculates Clopper-Pearson, Wald, and Wilson CIs', () => {
            document.getElementById('epi_prev_x').value = '25';
            document.getElementById('epi_prev_n').value = '500';
            window.EpiCalcModule.calcPrevalence();

            const resultsHtml = document.getElementById('epi-prevalence-results').innerHTML;
            expect(resultsHtml).toContain('Prevalence');
            expect(resultsHtml).toContain('5.00%');
            expect(resultsHtml).toContain('Clopper-Pearson');
        });

        test('calcSMR calculates SMR and CI', () => {
            document.getElementById('epi_smr_obs').value = '120';
            document.getElementById('epi_smr_exp').value = '85.5';
            window.EpiCalcModule.calcSMR();

            const resultsHtml = document.getElementById('epi-smr-results').innerHTML;
            expect(resultsHtml).toContain('Standardized Mortality Ratio');
            expect(resultsHtml).toContain('1.404');
        });

        test('calcAgeStd calculates direct age-standardized rate', () => {
            window.EpiCalcModule.addDefaultAgeRows();
            window.EpiCalcModule.calcAgeStd();

            const resultsHtml = document.getElementById('epi-agestd-results').innerHTML;
            expect(resultsHtml).toContain('Age-Standardized Rate');
        });

        test('calcDALY calculates YLL, YLD, and total DALY', () => {
            document.getElementById('epi_yll_deaths').value = '10';
            document.getElementById('epi_yll_le').value = '18.5';
            document.getElementById('epi_yld_cases').value = '100';
            document.getElementById('epi_yld_duration').value = '5';
            document.getElementById('epi_yld_dw').value = '0.333';

            window.EpiCalcModule.calcDALY();

            const resultsHtml = document.getElementById('epi-daly-results').innerHTML;
            expect(resultsHtml).toContain('DALYs');
            expect(resultsHtml).toContain('351.5 DALYs'); // (10*18.5) + (100*5*0.333) = 185 + 166.5 = 351.5
        });
    });
});
