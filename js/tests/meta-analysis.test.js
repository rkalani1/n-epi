const fs = require('fs');

describe('Meta-Analysis Module', () => {
    beforeEach(() => {
        jest.useFakeTimers();

        // Reset DOM
        document.body.innerHTML = '<div id="module-content"></div>';

        // Setup Window elements globally instead of in eval context
        window.App = {
            registerModule: jest.fn((id, module) => {
                window.App.modules = window.App.modules || {};
                window.App.modules[id] = module;
            }),
            createModuleLayout: jest.fn(() => '<div>Mock Layout</div>'),
            setTrustedHTML: jest.fn((el, html) => {
                if (el) {
                    el.innerHTML = html;
                    if (html.includes('ma-forest-canvas')) {
                        const canvas1 = document.createElement('canvas');
                        canvas1.id = 'ma-forest-canvas';
                        el.appendChild(canvas1);
                    }
                    if (html.includes('ma-funnel-canvas')) {
                        const canvas2 = document.createElement('canvas');
                        canvas2.id = 'ma-funnel-canvas';
                        el.appendChild(canvas2);
                    }
                }
            }),
            tooltip: jest.fn(() => '<span>[?]</span>')
        };

        window.Export = {
            showToast: jest.fn(),
            copyText: jest.fn()
        };

        window.Charts = {
            ForestPlot: jest.fn(),
            FunnelPlot: jest.fn()
        };

        const statsCode = ['constants.js', 'special-functions.js', 'normal-distribution.js', 'students-t-distribution.js', 'chi-squared-distribution.js', 'f-distribution.js', 'binomial-distribution.js', 'poisson-distribution.js', 'hypergeometric-distribution.js', 'confidence-intervals-for-proportions.js', 'hypothesis-tests.js', 'sample-size-formulas.js', 'meta-analysis.js', 'survival-analysis.js', 'diagnostic-accuracy.js', 'epidemiology-2x2-table.js', 'effect-size-conversions.js', 'utility-functions.js'].map(f => fs.readFileSync('js/core/stats/' + f, 'utf8')).join('\n');
        window.eval(statsCode + '; window.Statistics = Statistics;');

        const code = fs.readFileSync('js/modules/meta-analysis.js', 'utf8');
        window.eval(code);

        // Render main view
        window.App.modules['meta-analysis'].render(document.getElementById('module-content'));

        // HTML setup for analysis functions to run correctly
        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'ma-results';
        document.body.appendChild(resultsDiv);

        const pubBiasOutputEl = document.createElement('div');
        pubBiasOutputEl.id = 'ma-pubbias-results';
        document.body.appendChild(pubBiasOutputEl);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should register module correctly', () => {
        expect(window.App.modules['meta-analysis']).toBeDefined();
    });

    test('should load example data and run effect analysis', () => {
        window.MetaAnalysisModule.loadExample();
        window.MetaAnalysisModule.runAnalysis();
        jest.runAllTimers();

        const resultsEl = document.getElementById('ma-results-text');
        expect(resultsEl).not.toBeNull();
        expect(resultsEl.textContent).toContain('DerSimonian-Laird random-effects meta-analysis');
        expect(window.Charts.ForestPlot).toHaveBeenCalled();
        expect(window.Charts.FunnelPlot).toHaveBeenCalled();
    });

    test('should handle binary data format correctly', () => {
        window.MetaAnalysisModule.switchInputMode('binary');
        window.MetaAnalysisModule.loadExample();

        window.MetaAnalysisModule.runAnalysis();
        jest.runAllTimers();

        const resultsEl = document.getElementById('ma-results-text');
        expect(resultsEl.textContent).toContain('meta-analysis');
    });

    test('should run publication bias tests', () => {
        window.MetaAnalysisModule.loadExample();
        window.MetaAnalysisModule.runPublicationBias();

        const pubBiasOutputEl = document.getElementById('ma-pubbias-results');
        expect(pubBiasOutputEl.innerHTML).toContain('Trim-and-Fill Analysis');
    });
});
