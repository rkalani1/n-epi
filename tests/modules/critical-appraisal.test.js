/**
 * @jest-environment jsdom
 */

global.App = {
    createModuleLayout: jest.fn().mockReturnValue('<div id="mock-layout"></div>'),
    setTrustedHTML: jest.fn((el, html) => { if (el) el.innerHTML = html; }),
    tooltip: jest.fn().mockReturnValue(''),
    registerModule: jest.fn()
};

global.Export = {
    showToast: jest.fn(),
    copyText: jest.fn(),
    saveCalculation: jest.fn()
};

global.References = {
    rob2: { domains: [] },
    amstar2: { items: [] },
    grade: { rateDown: [], rateUp: [] }
};

describe('Critical Appraisal Module - CASP Checklist', () => {
    let appContainer;

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"></div>';
        appContainer = document.getElementById('app');
        jest.clearAllMocks();

        jest.isolateModules(() => {
            require('../../js/modules/critical-appraisal.js');
        });

        // Render module layout
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        renderFunc(appContainer);

        // Select RCT CASP checklist
        const select = document.getElementById('ca-casp-type');
        select.value = 'rct';
        window.CritAppraisal.loadCASP();
    });

    it('should calculate CASP results correctly when all items are Yes', () => {
        const radios = document.querySelectorAll('input[type="radio"][value="Yes"]');
        radios.forEach(r => { r.checked = true; });

        window.CritAppraisal.updateCASP();

        const resultEl = document.getElementById('ca-casp-result');
        expect(resultEl.innerHTML).toContain('High Quality');
        expect(resultEl.innerHTML).toContain('All items answered "Yes"');
    });

    it('should report Major Concerns if screening question is No', () => {
        const radios = document.querySelectorAll('input[type="radio"][value="Yes"]');
        radios.forEach(r => { r.checked = true; });

        // Q1 is a screening question in RCT CASP checklist
        const q1No = document.querySelector('input[name="ca-casp-q-1"][value="No"]');
        if (q1No) q1No.checked = true;

        window.CritAppraisal.updateCASP();

        const resultEl = document.getElementById('ca-casp-result');
        expect(resultEl.innerHTML).toContain('Major Concerns');
        expect(resultEl.innerHTML).toContain('screening questions answered "No"');
    });

    it('should display partial progress when not all items are answered', () => {
        // Answer only question 1
        const q1Yes = document.querySelector('input[name="ca-casp-q-1"][value="Yes"]');
        if (q1Yes) q1Yes.checked = true;

        window.CritAppraisal.updateCASP();

        const resultEl = document.getElementById('ca-casp-result');
        expect(resultEl.innerHTML).toContain('Answered 1 of 11 questions');
    });
});
