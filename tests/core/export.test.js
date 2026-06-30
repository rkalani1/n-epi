/**
 * @jest-environment jsdom
 */

const Export = require('../../js/core/export.js');

describe('Export.copyTSV', () => {
    let originalCopyText;

    beforeEach(() => {
        originalCopyText = Export.copyText;
        Export.copyText = jest.fn();
    });

    afterEach(() => {
        Export.copyText = originalCopyText;
        jest.restoreAllMocks();
    });

    it('formats arrays to TSV and correctly calls the mocked copyText', () => {
        const headers = ['Header 1', 'Header 2'];
        const rows = [
            ['Row 1 Col 1', 'Row 1 Col 2'],
            ['Row 2 Col 1', 'Row 2 Col 2']
        ];

        Export.copyTSV(headers, rows);

        expect(Export.copyText).toHaveBeenCalledTimes(1);
        expect(Export.copyText).toHaveBeenCalledWith(
            "Header 1\tHeader 2\nRow 1 Col 1\tRow 1 Col 2\nRow 2 Col 1\tRow 2 Col 2"
        );
    });

    it('handles empty rows array correctly', () => {
        const headers = ['Col1', 'Col2'];
        const rows = [];

        Export.copyTSV(headers, rows);

        expect(Export.copyText).toHaveBeenCalledTimes(1);
        expect(Export.copyText).toHaveBeenCalledWith("Col1\tCol2");
    });
});
