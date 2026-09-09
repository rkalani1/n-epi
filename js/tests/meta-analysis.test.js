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

        const statsCode = fs.readFileSync('js/core/statistics.js', 'utf8');
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

    describe('parseTSV edge cases', () => {
        test('should clear table data and toast when parsing empty string or whitespace', () => {
            // First load example data
            window.MetaAnalysisModule.loadExample();

            // Parse empty TSV
            window.MetaAnalysisModule.parseTSV('');

            expect(window.Export.showToast).toHaveBeenCalledWith('Parsed 0 studies from clipboard');

            // Verify table has no data rows (only table structure without rows or empty tbody)
            const tableContainer = document.getElementById('ma-data-table');
            const rows = tableContainer.querySelectorAll('tbody tr');
            expect(rows.length).toBe(0);
        });

        test('should clear table data when parsing whitespace-only string', () => {
            window.MetaAnalysisModule.loadExample();

            window.MetaAnalysisModule.parseTSV('   \r\n   \n   ');

            expect(window.Export.showToast).toHaveBeenCalledWith('Parsed 0 studies from clipboard');
            const tableContainer = document.getElementById('ma-data-table');
            const rows = tableContainer.querySelectorAll('tbody tr');
            expect(rows.length).toBe(0);
        });

        test('should handle non-string or null inputs gracefully', () => {
            window.MetaAnalysisModule.loadExample();

            window.MetaAnalysisModule.parseTSV(null);

            expect(window.Export.showToast).toHaveBeenCalledWith('Parsed 0 studies from clipboard');
            const tableContainer = document.getElementById('ma-data-table');
            const rows = tableContainer.querySelectorAll('tbody tr');
            expect(rows.length).toBe(0);
        });

        test('should parse valid TSV data with header row correctly in effect mode', () => {
            const tsvData = 'Study\tEffect\tSE\tCI_Lower\tCI_Upper\tSubgroup\n' +
                'Study A\t0.5\t0.2\t0.1\t0.9\tEurope\n' +
                'Study B\t0.8\t0.3\t0.2\t1.4\tNorth America';

            window.MetaAnalysisModule.parseTSV(tsvData);

            expect(window.Export.showToast).toHaveBeenCalledWith('Parsed 2 studies from clipboard');
            const tableContainer = document.getElementById('ma-data-table');
            const rows = tableContainer.querySelectorAll('tbody tr');
            expect(rows.length).toBe(2);
        });

        test('should parse valid TSV data in binary mode correctly', () => {
            window.MetaAnalysisModule.switchInputMode('binary');
            const tsvData = 'Study\te1\tn1\te2\tn2\tSubgroup\n' +
                'Trial 1\t10\t100\t20\t100\tGroup A\n' +
                'Trial 2\t15\t150\t25\t150\tGroup B';

            window.MetaAnalysisModule.parseTSV(tsvData);

            expect(window.Export.showToast).toHaveBeenCalledWith('Parsed 2 studies from clipboard');
            const tableContainer = document.getElementById('ma-data-table');
            const rows = tableContainer.querySelectorAll('tbody tr');
            expect(rows.length).toBe(2);
        });

        test('should handle clipboard read success and failure in pasteClipboard', async () => {
            const originalClipboard = navigator.clipboard;

            // Mock clipboard success
            let resolvePromise;
            const mockReadTextSuccess = jest.fn(() => new Promise((resolve) => { resolvePromise = resolve; }));
            Object.defineProperty(navigator, 'clipboard', {
                value: { readText: mockReadTextSuccess },
                configurable: true
            });

            window.MetaAnalysisModule.pasteClipboard();
            resolvePromise('Study 1\t0.5\t0.2\nStudy 2\t0.8\t0.3');
            await Promise.resolve();

            expect(mockReadTextSuccess).toHaveBeenCalled();
            expect(window.Export.showToast).toHaveBeenCalledWith('Parsed 2 studies from clipboard');

            // Mock clipboard rejection
            let rejectPromise;
            const mockReadTextReject = jest.fn(() => new Promise((_, reject) => { rejectPromise = reject; }));
            Object.defineProperty(navigator, 'clipboard', {
                value: { readText: mockReadTextReject },
                configurable: true
            });

            window.MetaAnalysisModule.pasteClipboard();
            rejectPromise(new Error('Permission denied'));
            await Promise.resolve();
            await Promise.resolve();

            expect(window.Export.showToast).toHaveBeenCalledWith('Unable to read clipboard. Paste data directly into the table.', 'error');

            // Restore
            Object.defineProperty(navigator, 'clipboard', {
                value: originalClipboard,
                configurable: true
            });
        });
    });
});
