/**
 * @jest-environment jsdom
 */
const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '../js/modules/biobank-cleaning.js'), 'utf8');

beforeAll(() => {
    window.App = { registerModule: jest.fn(), createModuleLayout: jest.fn(() => ''), tooltip: jest.fn() };
    window.Export = { showToast: jest.fn(), copyText: jest.fn() };
    window.eval(code);
});

describe('biobank redaction helpers', () => {
    let B;
    beforeEach(() => { B = window.BiobankCleaning; });

    test('recognises identifier/date-like column names, including bare id and visit', () => {
        ['id', 'patient_id', 'MRN', 'visit', 'onset_date', 'DOB', 'email', 'phone', 'notes']
            .forEach((c) => expect(B._isSensitiveColumn(c)).toBe(true));
        ['age', 'sbp', 'nihss', 'valid', 'lipid'].forEach((c) => expect(B._isSensitiveColumn(c)).toBe(false));
    });

    test('redacts cell values that look like PHI regardless of column name', () => {
        expect(B._looksLikePHIValue('2019-03-14')).toBe(true);
        expect(B._looksLikePHIValue('03/14/2019')).toBe(true);
        expect(B._looksLikePHIValue('123-45-6789')).toBe(true);      // SSN
        expect(B._looksLikePHIValue('jane.doe@example.com')).toBe(true);
        expect(B._looksLikePHIValue('206-555-0101')).toBe(true);     // phone
        // Benign clinical values are not redacted.
        expect(B._looksLikePHIValue('65')).toBe(false);
        expect(B._looksLikePHIValue('Male')).toBe(false);
        expect(B._looksLikePHIValue('12.5')).toBe(false);
    });

    test('escapeHTML neutralises angle brackets and quotes', () => {
        expect(B._escapeHTML('<img onerror=x>')).toBe('&lt;img onerror=x&gt;');
    });
});
