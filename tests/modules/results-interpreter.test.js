/**
 * @jest-environment jsdom
 */

// Mock global dependencies
global.App = {
    createModuleLayout: jest.fn().mockReturnValue('<div id="mock-layout"></div>'),
    setTrustedHTML: jest.fn((el, html) => { if (el) el.innerHTML = html; }),
    autoSaveInputs: jest.fn(),
    registerModule: jest.fn()
};

global.Export = {
    copyText: jest.fn()
};

describe('Results Interpreter Module', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="module-content"></div>';
        jest.clearAllMocks();

        jest.isolateModules(() => {
            require('../../js/modules/results-interpreter.js');
        });
    });

    it('should register the module', () => {
        expect(App.registerModule).toHaveBeenCalledWith('results-interpreter', expect.any(Object));
    });

    describe('copyForestPlot', () => {
        it('should copy tab-separated table rows excluding visual plot column when table exists', () => {
            document.body.innerHTML = `
                <div id="fpr-results">
                    <table id="fpr-table">
                        <thead>
                            <tr><th>Study</th><th>Effect</th><th>95% CI</th><th>Weight</th><th>Forest Plot</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Study A</td><td>1.20</td><td>0.90 to 1.50</td><td>45%</td><td><div>visual</div></td></tr>
                            <tr><td>Study B</td><td>0.80</td><td>0.50 to 1.10</td><td>55%</td><td><div>visual</div></td></tr>
                        </tbody>
                    </table>
                </div>
            `;

            window.ResultsInterp.copyForestPlot();

            expect(Export.copyText).toHaveBeenCalledTimes(1);
            const copiedText = Export.copyText.mock.calls[0][0];
            expect(copiedText).toBe(
                'Study\tEffect\t95% CI\tWeight\n' +
                'Study A\t1.20\t0.90 to 1.50\t45%\n' +
                'Study B\t0.80\t0.50 to 1.10\t55%\n'
            );
        });

        it('should fallback to copying container textContent when table is missing', () => {
            document.body.innerHTML = '<div id="fpr-results">No data available</div>';

            window.ResultsInterp.copyForestPlot();

            expect(Export.copyText).toHaveBeenCalledTimes(1);
            expect(Export.copyText).toHaveBeenCalledWith('No data available');
        });
    });

    describe('copyROR', () => {
        it('should copy tab-separated table rows excluding visual plot column when table exists', () => {
            document.body.innerHTML = `
                <div id="ror-results">
                    <table id="ror-table">
                        <thead>
                            <tr><th>Variable</th><th>Coeff</th><th>OR</th><th>95% CI</th><th>P-value</th><th>Sig</th><th>Plot</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Age</td><td>0.020</td><td>1.02</td><td>1.01 to 1.03</td><td>0.001</td><td>Yes</td><td><div>plot</div></td></tr>
                            <tr><td>Sex</td><td>0.150</td><td>1.16</td><td>0.95 to 1.42</td><td>0.120</td><td>No</td><td><div>plot</div></td></tr>
                        </tbody>
                    </table>
                </div>
            `;

            window.ResultsInterp.copyROR();

            expect(Export.copyText).toHaveBeenCalledTimes(1);
            const copiedText = Export.copyText.mock.calls[0][0];
            expect(copiedText).toBe(
                'Variable\tCoeff\tOR\t95% CI\tP-value\tSig\n' +
                'Age\t0.020\t1.02\t1.01 to 1.03\t0.001\tYes\n' +
                'Sex\t0.150\t1.16\t0.95 to 1.42\t0.120\tNo\n'
            );
        });

        it('should fallback to copying container textContent when table is missing', () => {
            document.body.innerHTML = '<div id="ror-results">No regression output</div>';

            window.ResultsInterp.copyROR();

            expect(Export.copyText).toHaveBeenCalledTimes(1);
            expect(Export.copyText).toHaveBeenCalledWith('No regression output');
        });
    });
});
