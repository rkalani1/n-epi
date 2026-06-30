/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Export Module', () => {
    let Export;

    beforeEach(() => {
        global.App = {
            showToast: jest.fn()
        };

        jest.isolateModules(() => {
            Export = require('../../js/core/export.js');
        });
    });

    describe('formatGrantJustification', () => {
        it('should format a basic justification for proportions design (ratio 1:1)', () => {
            const params = {
                n: 100,
                nPerGroup: 50,
                ratio: 1,
                power: 0.8,
                designType: 'proportions',
                p1: 0.2,
                p2: 0.1,
                alpha: 0.05
            };

            const result = Export.formatGrantJustification(params);
            expect(result).toBe('Sample size calculation: We will enroll 100 participants (50 per group) to achieve 80% power to detect an absolute difference of 10.0 percentage points (from 20.0% in the control group to 10.0% in the treatment group) using a two-sided test at the 0.05 significance level. Sample size was calculated using [software/formula reference].');
        });

        it('should format a justification with unequal allocation ratio', () => {
            const params = {
                n: 150,
                nPerGroup: '50 control, 100 treatment', // Note: formatGrantJustification just outputs nPerGroup
                ratio: 2,
                power: 0.9,
                designType: 'proportions',
                p1: 0.5,
                p2: 0.3,
                alpha: 0.01
            };

            const result = Export.formatGrantJustification(params);
            expect(result).toBe('Sample size calculation: We will enroll 150 participants (50 control, 100 treatment per group, allocation ratio 2:1) to achieve 90% power to detect an absolute difference of 20.0 percentage points (from 50.0% in the control group to 30.0% in the treatment group) using a two-sided test at the 0.01 significance level. Sample size was calculated using [software/formula reference].');
        });

        it('should format a justification for survival design', () => {
            const params = {
                n: 200,
                nPerGroup: 100,
                ratio: 1,
                power: 0.85,
                designType: 'survival',
                hr: 0.65,
                alpha: 0.05
            };

            const result = Export.formatGrantJustification(params);
            expect(result).toBe('Sample size calculation: We will enroll 200 participants (100 per group) to achieve 85% power to detect a hazard ratio of 0.65 using a two-sided test at the 0.05 significance level. Sample size was calculated using [software/formula reference].');
        });

        it('should format a justification for means design', () => {
            const params = {
                n: 60,
                nPerGroup: 30,
                ratio: 1,
                power: 0.8,
                designType: 'means',
                delta: 5.5,
                sd: 10,
                alpha: 0.05
            };

            const result = Export.formatGrantJustification(params);
            expect(result).toBe('Sample size calculation: We will enroll 60 participants (30 per group) to achieve 80% power to detect a difference of 5.5 (SD = 10) using a two-sided test at the 0.05 significance level. Sample size was calculated using [software/formula reference].');
        });

        it('should format a justification for ordinal design', () => {
            const params = {
                n: 500,
                nPerGroup: 250,
                ratio: 1,
                power: 0.9,
                designType: 'ordinal',
                commonOR: 1.5,
                alpha: 0.05
            };

            const result = Export.formatGrantJustification(params);
            expect(result).toBe('Sample size calculation: We will enroll 500 participants (250 per group) to achieve 90% power to detect a common odds ratio of 1.5 on the modified Rankin Scale using a two-sided test at the 0.05 significance level. Sample size was calculated using [software/formula reference].');
        });

        it('should use custom test type if provided', () => {
            const params = {
                n: 100,
                nPerGroup: 50,
                ratio: 1,
                power: 0.8,
                designType: 'means',
                delta: 5,
                sd: 10,
                alpha: 0.05,
                test: 'one-sided test'
            };

            const result = Export.formatGrantJustification(params);
            expect(result).toContain('using a one-sided test at the 0.05 significance level.');
        });

        it('should include dropout information if provided', () => {
            const params = {
                n: 100,
                nPerGroup: 50,
                ratio: 1,
                power: 0.8,
                designType: 'survival',
                hr: 0.5,
                alpha: 0.05,
                dropoutRate: 10,
                dropoutAdjusted: 112
            };

            const result = Export.formatGrantJustification(params);
            expect(result).toContain('Accounting for 10% dropout, we plan to enroll 112 participants.');
        });

        it('should include custom justification if provided', () => {
            const params = {
                n: 100,
                nPerGroup: 50,
                ratio: 1,
                power: 0.8,
                designType: 'survival',
                hr: 0.5,
                alpha: 0.05,
                justification: 'This sample size was deemed feasible by the clinical team.'
            };

            const result = Export.formatGrantJustification(params);
            expect(result).toContain('This sample size was deemed feasible by the clinical team. Sample size was calculated using');
        });
    });

    describe('showToast', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            document.body.innerHTML = '';
            global.requestAnimationFrame = jest.fn((callback) => callback());
        });

        afterEach(() => {
            jest.useRealTimers();
            delete global.requestAnimationFrame;
        });

        it('creates a visible success toast by default', () => {
            Export.showToast('Test message');

            const toast = document.querySelector('.ne-toast');
            expect(toast).not.toBeNull();
            expect(toast.textContent).toBe('Test message');
            expect(toast.className).toContain('ne-toast--success');
            expect(toast.classList.contains('ne-toast--visible')).toBe(true);
        });

        it('uses a custom toast type and removes any existing toast', () => {
            const existingToast = document.createElement('div');
            existingToast.className = 'ne-toast';
            existingToast.id = 'old-toast';
            document.body.appendChild(existingToast);

            Export.showToast('Error message', 'error');

            const toasts = document.querySelectorAll('.ne-toast');
            expect(document.getElementById('old-toast')).toBeNull();
            expect(toasts).toHaveLength(1);
            expect(toasts[0].textContent).toBe('Error message');
            expect(toasts[0].className).toContain('ne-toast--error');
        });

        it('removes the toast after the timeout lifecycle', () => {
            Export.showToast('Lifecycle message');

            const toast = document.querySelector('.ne-toast');
            expect(toast.classList.contains('ne-toast--visible')).toBe(true);

            jest.advanceTimersByTime(2000);
            expect(toast.classList.contains('ne-toast--visible')).toBe(false);
            expect(document.querySelector('.ne-toast')).not.toBeNull();

            jest.advanceTimersByTime(300);
            expect(document.querySelector('.ne-toast')).toBeNull();
        });
    });

    describe('copyText', () => {
        beforeEach(() => {
            jest.useFakeTimers();
            document.body.innerHTML = '';
            global.requestAnimationFrame = jest.fn((callback) => callback());
            document.execCommand = jest.fn().mockReturnValue(true);
            Object.defineProperty(navigator, 'clipboard', {
                value: {
                    writeText: jest.fn().mockResolvedValue(undefined)
                },
                configurable: true
            });
        });

        afterEach(() => {
            jest.useRealTimers();
            delete global.requestAnimationFrame;
            delete document.execCommand;
        });

        it('copies text through navigator.clipboard and shows a toast', async () => {
            Export.copyText('test text');
            await Promise.resolve();

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
            const toast = document.querySelector('.ne-toast');
            expect(toast).not.toBeNull();
            expect(toast.textContent).toBe('Copied to clipboard');
        });

        it('falls back to execCommand when navigator.clipboard rejects', async () => {
            navigator.clipboard.writeText.mockRejectedValueOnce(new Error('denied'));

            Export.copyText('fallback text');
            await Promise.resolve();
            await Promise.resolve();

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('fallback text');
            expect(document.execCommand).toHaveBeenCalledWith('copy');
            expect(document.querySelector('textarea')).toBeNull();
            expect(document.querySelector('.ne-toast').textContent).toBe('Copied to clipboard');
        });
    });

    describe('exportCanvasPNG', () => {
        let createElementSpy;
        let mockLink;

        beforeEach(() => {
            document.body.innerHTML = '';
            global.requestAnimationFrame = jest.fn((callback) => callback());
            mockLink = {
                download: '',
                href: '',
                click: jest.fn()
            };

            const originalCreateElement = document.createElement.bind(document);
            createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
                if (tagName === 'a') return mockLink;
                return originalCreateElement(tagName);
            });
        });

        afterEach(() => {
            createElementSpy.mockRestore();
            delete global.requestAnimationFrame;
        });

        it('exports canvas with provided filename', () => {
            const canvas = { toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mockdata') };

            Export.exportCanvasPNG(canvas, 'custom-chart.png');

            expect(canvas.toDataURL).toHaveBeenCalledWith('image/png');
            expect(mockLink.download).toBe('custom-chart.png');
            expect(mockLink.href).toBe('data:image/png;base64,mockdata');
            expect(mockLink.click).toHaveBeenCalledTimes(1);
            expect(document.querySelector('.ne-toast').textContent).toBe('Chart exported as PNG');
        });

        it('exports canvas with the default filename', () => {
            const canvas = { toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mockdata') };

            Export.exportCanvasPNG(canvas);

            expect(mockLink.download).toBe('neuroepi-chart.png');
            expect(mockLink.click).toHaveBeenCalledTimes(1);
        });
    });

    describe('copyTSV', () => {
        let originalCopyText;

        beforeEach(() => {
            originalCopyText = Export.copyText;
            Export.copyText = jest.fn();
        });

        afterEach(() => {
            Export.copyText = originalCopyText;
        });

        it('formats arrays as TSV and calls copyText', () => {
            Export.copyTSV(
                ['Header 1', 'Header 2'],
                [
                    ['Row 1 Col 1', 'Row 1 Col 2'],
                    ['Row 2 Col 1', 'Row 2 Col 2']
                ]
            );

            expect(Export.copyText).toHaveBeenCalledWith('Header 1\tHeader 2\nRow 1 Col 1\tRow 1 Col 2\nRow 2 Col 1\tRow 2 Col 2');
        });

        it('handles header-only TSV', () => {
            Export.copyTSV(['Col1', 'Col2'], []);

            expect(Export.copyText).toHaveBeenCalledWith('Col1\tCol2');
        });
    });
});
