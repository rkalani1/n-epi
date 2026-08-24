/**
 * @jest-environment jsdom
 */

const RGenerator = require('../../js/core/r-generator.js');

describe('RGenerator Module', () => {

    beforeEach(() => {
        document.body.innerHTML = '';
        delete global.Export;
    });

    // ============================================================
    // SAMPLE SIZE CALCULATIONS
    // ============================================================
    describe('sampleSize', () => {
        it('twoProportions generates standard R script', () => {
            const script = RGenerator.sampleSize.twoProportions({
                p1: 0.2,
                p2: 0.1,
                alpha: 0.05,
                power: 0.8,
                ratio: 1,
                dropout: 0.1
            });
            expect(script).toContain('# n-epi: Sample Size -- Two Proportions');
            expect(script).toContain('p1 <- 0.2');
            expect(script).toContain('p2 <- 0.1');
            expect(script).toContain('library(pwr)');
            expect(script).toContain('dropout_rate <- 0.1');
            expect(script).toContain('pwr.2p.test');
        });

        it('twoProportions handles unequal ratio and default parameters', () => {
            const script = RGenerator.sampleSize.twoProportions({
                p1: 0.3,
                p2: 0.15,
                ratio: 2
            });
            expect(script).toContain('ratio <- 2');
            expect(script).toContain('alpha <- 0.05'); // default
            expect(script).toContain('power <- 0.8');  // default
            expect(script).toContain('dropout_rate <- 0'); // default
            expect(script).toContain('if (ratio != 1)');
        });

        it('twoMeans generates R script for continuous outcomes', () => {
            const script = RGenerator.sampleSize.twoMeans({
                delta: 5,
                sd1: 10,
                sd2: 12,
                alpha: 0.01,
                power: 0.9,
                ratio: 1,
                dropout: 0.05
            });
            expect(script).toContain('Sample Size -- Two Means');
            expect(script).toContain('delta <- 5');
            expect(script).toContain('sd1 <- 10');
            expect(script).toContain('sd2 <- 12');
            expect(script).toContain('pwr.t.test');
        });

        it('survival generates R script for time-to-event outcomes', () => {
            const script = RGenerator.sampleSize.survival({
                hr: 0.7,
                alpha: 0.05,
                power: 0.8,
                medianSurvival: 18,
                accrual: 12,
                followup: 24,
                dropout: 0.1
            });
            expect(script).toContain('Sample Size -- Time-to-Event (Survival)');
            expect(script).toContain('hr <- 0.7');
            expect(script).toContain('median_surv <- 18');
            expect(script).toContain('Schoenfeld formula');
            expect(script).toContain('library(survival)');
        });

        it('clusterRCT generates R script for cluster trials', () => {
            const script = RGenerator.sampleSize.clusterRCT({
                individualN: 200,
                icc: 0.05,
                clusterSize: 20
            });
            expect(script).toContain('Sample Size -- Cluster Randomized Trial');
            expect(script).toContain('individual_n <- 200');
            expect(script).toContain('icc <- 0.05');
            expect(script).toContain('cluster_size <- 20');
            expect(script).toContain('deff <- 1 + (cluster_size - 1) * icc');
        });

        it('nonInferiority generates non-inferiority and equivalence scripts', () => {
            const nonInfScript = RGenerator.sampleSize.nonInferiority({
                p: 0.15,
                margin: 0.05,
                type: 'noninf'
            });
            expect(nonInfScript).toContain('Sample Size -- Non-Inferiority');
            expect(nonInfScript).toContain('design <- "noninf"');

            const equivScript = RGenerator.sampleSize.nonInferiority({
                p: 0.15,
                margin: 0.05,
                type: 'equiv'
            });
            expect(equivScript).toContain('Sample Size -- Equivalence');
            expect(equivScript).toContain('design <- "equiv"');
            expect(equivScript).toContain('Two one-sided tests (TOST)');
        });
    });

    // ============================================================
    // POWER ANALYSIS
    // ============================================================
    describe('powerAnalysis', () => {
        it('supports proportions design', () => {
            const script = RGenerator.powerAnalysis({
                design: 'proportions',
                p1: 0.25,
                p2: 0.10,
                n: 100,
                alpha: 0.05
            });
            expect(script).toContain('Power Analysis');
            expect(script).toContain('p1 <- 0.25');
            expect(script).toContain('p2 <- 0.1');
            expect(script).toContain('pwr.2p.test');
        });

        it('supports means design', () => {
            const script = RGenerator.powerAnalysis({
                design: 'means',
                delta: 2.5,
                sd: 5.0,
                n: 50
            });
            expect(script).toContain('Power Analysis: Two Means');
            expect(script).toContain('delta <- 2.5');
            expect(script).toContain('pwr.t.test');
        });

        it('supports survival design', () => {
            const script = RGenerator.powerAnalysis({
                design: 'survival',
                hr: 0.65,
                events: 80
            });
            expect(script).toContain('Power Analysis: Survival');
            expect(script).toContain('hr <- 0.65');
            expect(script).toContain('events <- 80');
            expect(script).toContain('pnorm(sqrt(events) * abs(log(hr)) / 2 - z_alpha)');
        });
    });

    // ============================================================
    // META-ANALYSIS
    // ============================================================
    describe('metaAnalysis', () => {
        it('handles binary input mode', () => {
            const script = RGenerator.metaAnalysis({
                inputMode: 'binary',
                measure: 'RR',
                hksj: true,
                binaryData: [
                    { name: 'Study A', e1: 10, n1: 100, e2: 20, n2: 100 },
                    { name: 'Study B', e1: 15, n1: 150, e2: 25, n2: 150 }
                ]
            });
            expect(script).toContain('Meta-Analysis');
            expect(script).toContain('metabin(');
            expect(script).toContain('sm = "RR"');
            expect(script).toContain('hakn = TRUE');
            expect(script).toContain('study <- c("Study A", "Study B")');
        });

        it('handles effect size input mode', () => {
            const script = RGenerator.metaAnalysis({
                inputMode: 'effect',
                measure: 'OR',
                studies: [
                    { name: 'Trial 1', logEffect: 0.5, se: 0.2 },
                    { name: 'Trial 2', logEffect: 0.3, se: 0.15 }
                ]
            });
            expect(script).toContain('metagen(');
            expect(script).toContain('sm = "OR"');
            expect(script).toContain('yi <- c(0.5, 0.3)');
            expect(script).toContain('sei <- c(0.2, 0.15)');
        });
    });

    // ============================================================
    // SURVIVAL ANALYSIS
    // ============================================================
    describe('survivalAnalysis', () => {
        it('handles data with groups', () => {
            const script = RGenerator.survivalAnalysis({
                data: [
                    { time: 10, event: 1, group: 'A' },
                    { time: 15, event: 0, group: 'B' }
                ]
            });
            expect(script).toContain('Kaplan-Meier Survival Curves');
            expect(script).toContain('survfit(Surv(time, status) ~ group');
            expect(script).toContain('survdiff(Surv(time, status) ~ group');
            expect(script).toContain('coxph(Surv(time, status) ~ group');
        });

        it('handles single group data', () => {
            const script = RGenerator.survivalAnalysis({
                data: [
                    { time: 12, event: 1 },
                    { time: 24, event: 0 }
                ]
            });
            expect(script).toContain('Kaplan-Meier Survival Curve');
            expect(script).toContain('survfit(Surv(time, status) ~ 1');
        });
    });

    // ============================================================
    // DIAGNOSTIC ACCURACY & EPIDEMIOLOGY 2x2
    // ============================================================
    describe('diagnosticAccuracy & epiTwoByTwo', () => {
        it('generates diagnostic accuracy script', () => {
            const script = RGenerator.diagnosticAccuracy({
                tp: 80, fp: 20, fn: 10, tn: 90
            });
            expect(script).toContain('Diagnostic Accuracy');
            expect(script).toContain('tp <- 80');
            expect(script).toContain('epi.tests');
            expect(script).toContain('Youden J');
        });

        it('generates 2x2 epi table script', () => {
            const script = RGenerator.epiTwoByTwo({
                a: 30, b: 70, c: 10, d: 90
            });
            expect(script).toContain('Epidemiology -- 2x2 Table Analysis');
            expect(script).toContain('a <- 30');
            expect(script).toContain('epi.2by2');
            expect(script).toContain('Risk Ratio (RR)');
        });
    });

    // ============================================================
    // EFFECT SIZE & NNT CALCULATOR
    // ============================================================
    describe('effectSize & nntCalculator', () => {
        it('effectSize supports various input types', () => {
            const script = RGenerator.effectSize({
                inputType: 'rr',
                value: 1.5,
                ciLower: 1.1,
                ciUpper: 2.0,
                p0: 0.1
            });
            expect(script).toContain('Effect Size Conversions');
            expect(script).toContain('input_type <- "rr"');
            expect(script).toContain('or_to_d');
        });

        it('nntCalculator supports 2x2 inputs', () => {
            const script = RGenerator.nntCalculator({
                a: 15, b: 85, c: 30, d: 70
            });
            expect(script).toContain('NNT / NNH Calculator');
            expect(script).toContain('a <- 15');
            expect(script).toContain('eer <- a / (a + b)');
            expect(script).toContain('Fragility Index');
        });

        it('nntCalculator supports CER/EER rates input', () => {
            const script = RGenerator.nntCalculator({
                cer: 0.20,
                eer: 0.12,
                nc: 200,
                ne: 200
            });
            expect(script).toContain('cer <- 0.2');
            expect(script).toContain('eer <- 0.12');
            expect(script).toContain('arr <- cer - eer');
        });
    });

    // ============================================================
    // REGRESSION & RISK/RATE CALCULATORS
    // ============================================================
    describe('regressionHelper & riskRateCalculators', () => {
        it('regressionHelper calculates EPV and model recommendations', () => {
            const script = RGenerator.regressionHelper({
                outcomeType: 'binary',
                events: 50,
                covariates: 5
            });
            expect(script).toContain('Regression Planning Helper');
            expect(script).toContain('epv <- events / covariates');
            expect(script).toContain('Logistic regression');
        });

        it('riskRateCalculators handles incidence, rateRatio, smr, and prevalence', () => {
            const inc = RGenerator.riskRateCalculators({ calcType: 'incidence', events: 10, personTime: 1000 });
            expect(inc).toContain('Incidence Rate Calculation');

            const rr = RGenerator.riskRateCalculators({ calcType: 'rateRatio', events1: 20, pt1: 1000, events2: 10, pt2: 1000 });
            expect(rr).toContain('Rate Ratio Calculation');

            const smr = RGenerator.riskRateCalculators({ calcType: 'smr', observed: 25, expected: 15 });
            expect(smr).toContain('Standardized Mortality Ratio');

            const prev = RGenerator.riskRateCalculators({ calcType: 'prevalence', cases: 50, population: 1000 });
            expect(prev).toContain('Prevalence Calculation');
        });
    });

    // ============================================================
    // CAUSAL INFERENCE, ML PREDICTION & BIOSTATS
    // ============================================================
    describe('causalInferenceDiD, mlPrediction & biostats', () => {
        it('causalInferenceDiD formats DiD analysis script', () => {
            const script = RGenerator.causalInferenceDiD({
                tPre: 10, tPost: 20, cPre: 8, cPost: 12
            });
            expect(script).toContain('Difference-in-Differences (DiD) Analysis');
            expect(script).toContain('did_estimate   <- treated_change - control_change');
        });

        it('mlPredictionValidation supports kfold, bootstrap, and split methods', () => {
            const kfold = RGenerator.mlPredictionValidation({ method: 'kfold', k: 5, n: 500, events: 100, predictors: 10 });
            expect(kfold).toContain('k-Fold Cross-Validation');

            const boot = RGenerator.mlPredictionValidation({ method: 'bootstrap', k: 100, n: 500, events: 100, predictors: 10 });
            expect(boot).toContain('Bootstrap Validation (.632+)');

            const split = RGenerator.mlPredictionValidation({ method: 'split', trainFrac: 0.8, n: 500, events: 100, predictors: 10 });
            expect(split).toContain('Train/Test Split');
        });

        it('mlPredictionNRI computes NRI and IDI', () => {
            const script = RGenerator.mlPredictionNRI({
                eventUp: 10, eventDown: 2, totalEvents: 50,
                noneventUp: 5, noneventDown: 20, totalNonevents: 150,
                oldEventProb: 0.4, newEventProb: 0.6,
                oldNoneventProb: 0.2, newNoneventProb: 0.1
            });
            expect(script).toContain('Net Reclassification Improvement & IDI');
            expect(script).toContain('nri_overall  <- nri_event + nri_nonevent');
        });

        it('biostatCI and biostatPvalAdjust format reference scripts', () => {
            const ciScript = RGenerator.biostatCI({ x: 40, n: 100, level: 0.95 });
            expect(ciScript).toContain('Confidence Intervals for a Single Proportion');
            expect(ciScript).toContain('Wilson');

            const pvalScript = RGenerator.biostatPvalAdjust({ pvals: [0.01, 0.04, 0.12], alpha: 0.05 });
            expect(pvalScript).toContain('Multiple Testing P-Value Adjustment');
            expect(pvalScript).toContain('p.adjust(pvals, method = "bonferroni")');
        });

        it('riskRateRatio, riskSMR, riskAttributable, epiMantelHaenszel, epiLifeTable', () => {
            const rrr = RGenerator.riskRateRatio({ events1: 15, pt1: 500, events2: 5, pt2: 500 });
            expect(rrr).toContain('Incidence Rate Ratio (IRR)');

            const smr = RGenerator.riskSMR({ observed: 30, expected: 20 });
            expect(smr).toContain('Standardized Mortality Ratio (SMR)');

            const attr = RGenerator.riskAttributable({ re: 0.15, ru: 0.05, pe: 0.3 });
            expect(attr).toContain('Attributable Risk Measures');

            const mh = RGenerator.epiMantelHaenszel({
                tables: [{ a: 10, b: 20, c: 5, d: 25 }, { a: 15, b: 15, c: 10, d: 20 }],
                measure: 'OR'
            });
            expect(mh).toContain('Mantel-Haenszel Stratified Analysis');

            const lt = RGenerator.epiLifeTable({
                deaths: [10, 5, 20],
                populations: [1000, 2000, 1500],
                ages: ['0-4', '5-14', '15+'],
                widths: [5, 10, 20]
            });
            expect(lt).toContain('Abridged Life Table');
        });
    });

    // ============================================================
    // UTILITIES & UI
    // ============================================================
    describe('Utilities & UI Methods', () => {
        it('formatR handles string and array inputs', () => {
            expect(RGenerator.formatR('x <- 1')).toBe('x <- 1');
            expect(RGenerator.formatR(['x <- 1', 'y <- 2'])).toBe('x <- 1\ny <- 2');
        });

        it('buttonHTML generates button markup with default and custom label', () => {
            const defaultBtn = RGenerator.buttonHTML('getScript()');
            expect(defaultBtn).toContain('RGenerator.showScript(getScript())');
            expect(defaultBtn).toContain('Generate R Script');

            const customBtn = RGenerator.buttonHTML('getScript()', 'Custom Label');
            expect(customBtn).toContain('Custom Label');
        });

        it('copyScript uses Export if present', () => {
            global.Export = {
                copyText: jest.fn(),
                showToast: jest.fn()
            };
            RGenerator.copyScript('cat("hello")');
            expect(global.Export.copyText).toHaveBeenCalledWith('cat("hello")');
            expect(global.Export.showToast).toHaveBeenCalledWith('R script copied to clipboard');
        });

        it('copyScript uses navigator.clipboard if Export is undefined', async () => {
            const writeTextMock = jest.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'clipboard', {
                value: { writeText: writeTextMock },
                configurable: true
            });

            RGenerator.copyScript('cat("hello")');
            expect(writeTextMock).toHaveBeenCalledWith('cat("hello")');
        });

        it('downloadScript triggers Blob download', () => {
            const createObjectURLMock = jest.fn().mockReturnValue('blob:http://localhost/mock-uuid');
            const revokeObjectURLMock = jest.fn();
            global.URL.createObjectURL = createObjectURLMock;
            global.URL.revokeObjectURL = revokeObjectURLMock;

            const clickMock = jest.fn();
            const originalCreateElement = document.createElement.bind(document);
            jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
                if (tagName === 'a') {
                    return {
                        href: '',
                        download: '',
                        click: clickMock
                    };
                }
                return originalCreateElement(tagName);
            });

            RGenerator.downloadScript('cat("test")', 'my_script.R');

            expect(createObjectURLMock).toHaveBeenCalled();
            expect(clickMock).toHaveBeenCalled();
            expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:http://localhost/mock-uuid');

            jest.restoreAllMocks();
        });

        it('showScript creates modal, handles copy, download, close, escape, and backdrop click', () => {
            const scriptText = 'cat("Script content")';
            RGenerator.showScript(scriptText, 'Test Title');

            const modalOverlay = document.getElementById('r-script-modal');
            expect(modalOverlay).not.toBeNull();
            expect(modalOverlay.querySelector('.r-script-title').textContent).toBe('Test Title');
            expect(modalOverlay.querySelector('.r-script-body').textContent).toBe(scriptText);

            // Test copy button within modal
            global.Export = {
                copyText: jest.fn(),
                showToast: jest.fn()
            };
            const copyBtn = modalOverlay.querySelector('button[title="Copy to clipboard"]');
            copyBtn.click();
            expect(global.Export.copyText).toHaveBeenCalledWith(scriptText);

            // Test download button within modal
            const createObjectURLMock = jest.fn().mockReturnValue('blob:http://localhost/mock');
            const revokeObjectURLMock = jest.fn();
            global.URL.createObjectURL = createObjectURLMock;
            global.URL.revokeObjectURL = revokeObjectURLMock;

            const dlBtn = modalOverlay.querySelector('button[title="Download .R file"]');
            dlBtn.click();
            expect(createObjectURLMock).toHaveBeenCalled();

            // Test ESC key listener
            const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            document.dispatchEvent(escEvent);
            expect(document.getElementById('r-script-modal')).toBeNull();

            // Test recreating modal and clicking backdrop overlay
            RGenerator.showScript(scriptText, 'Test Title');
            const newOverlay = document.getElementById('r-script-modal');
            expect(newOverlay).not.toBeNull();

            // Click background overlay
            newOverlay.onclick({ target: newOverlay });
            expect(document.getElementById('r-script-modal')).toBeNull();

            // Test close button
            RGenerator.showScript(scriptText, 'Test Title');
            const modal3 = document.getElementById('r-script-modal');
            const closeBtn = modal3.querySelector('button[title="Close"]');
            closeBtn.click();
            expect(document.getElementById('r-script-modal')).toBeNull();
        });
    });
});
