/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Results Interpreter - copy functions', () => {
    let ResultsInterp;

    beforeEach(() => {
        document.body.innerHTML = '';
        window.App = {
            createModuleLayout: (title, desc) => `<h1>${title}</h1><p>${desc}</p>`,
            setTrustedHTML: (el, html) => { if (el) el.innerHTML = html; },
            autoSaveInputs: () => {},
            registerModule: () => {}
        };
        window.Export = {
            copyText: jest.fn()
        };

        const code = fs.readFileSync(path.join(__dirname, '../../js/modules/results-interpreter.js'), 'utf8');
        window.eval(code);
        ResultsInterp = window.ResultsInterp;
    });

    test('copyForestPlot builds tab-separated text using table rows/cells', () => {
        document.body.innerHTML = `
            <table id="fpr-table">
                <thead>
                    <tr><th>Study</th><th>Effect</th><th>95% CI</th><th>Weight</th><th>Plot</th></tr>
                </thead>
                <tbody>
                    <tr><td>Study 1</td><td>1.50</td><td>1.10 to 2.05</td><td>45%</td><td><div>Plot graphic</div></td></tr>
                    <tr><td>Study 2</td><td>0.85</td><td>0.60 to 1.20</td><td>55%</td><td><div>Plot graphic</div></td></tr>
                </tbody>
            </table>
        `;

        ResultsInterp.copyForestPlot();

        expect(window.Export.copyText).toHaveBeenCalledTimes(1);
        const expectedText = "Study\tEffect\t95% CI\tWeight\n" +
                             "Study 1\t1.50\t1.10 to 2.05\t45%\n" +
                             "Study 2\t0.85\t0.60 to 1.20\t55%\n";
        expect(window.Export.copyText).toHaveBeenCalledWith(expectedText);
    });

    test('copyROR builds tab-separated text using table rows/cells', () => {
        document.body.innerHTML = `
            <table id="ror-table">
                <thead>
                    <tr><th>Variable</th><th>Coeff</th><th>OR</th><th>95% CI</th><th>P-value</th><th>Sig</th><th>Plot</th></tr>
                </thead>
                <tbody>
                    <tr><td>Age</td><td>0.050</td><td>1.05</td><td>1.01 to 1.10</td><td>0.015</td><td>Yes</td><td><div>Plot graphic</div></td></tr>
                </tbody>
            </table>
        `;

        ResultsInterp.copyROR();

        expect(window.Export.copyText).toHaveBeenCalledTimes(1);
        const expectedText = "Variable\tCoeff\tOR\t95% CI\tP-value\tSig\n" +
                             "Age\t0.050\t1.05\t1.01 to 1.10\t0.015\tYes\n";
        expect(window.Export.copyText).toHaveBeenCalledWith(expectedText);
    });
});
