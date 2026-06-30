/**
 * @jest-environment jsdom
 */

const Export = require('../../js/core/export.js');

describe('Export Module', () => {
    describe('exportCanvasPNG', () => {
        let mockCanvas;
        let mockLink;
        let originalCreateElement;
        let originalRequestAnimationFrame;

        beforeEach(() => {
            // Setup DOM
            document.body.innerHTML = '';

            // Mock Canvas
            mockCanvas = {
                toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mockdata')
            };

            // Mock document.createElement to intercept 'a' creation
            originalCreateElement = document.createElement.bind(document);
            mockLink = {
                click: jest.fn(),
                href: '',
                download: ''
            };

            jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
                if (tagName === 'a') {
                    return mockLink;
                }
                return originalCreateElement(tagName);
            });

            // Mock requestAnimationFrame for showToast
            originalRequestAnimationFrame = window.requestAnimationFrame;
            window.requestAnimationFrame = jest.fn((cb) => cb());
        });

        afterEach(() => {
            jest.restoreAllMocks();
            window.requestAnimationFrame = originalRequestAnimationFrame;
        });

        it('should export canvas with provided filename', () => {
            Export.exportCanvasPNG(mockCanvas, 'custom-chart.png');

            expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
            expect(mockLink.download).toBe('custom-chart.png');
            expect(mockLink.href).toBe('data:image/png;base64,mockdata');
            expect(mockLink.click).toHaveBeenCalledTimes(1);

            // Verify toast was shown by checking its DOM addition
            const toast = document.querySelector('.ne-toast');
            expect(toast).not.toBeNull();
            expect(toast.textContent).toBe('Chart exported as PNG');
        });

        it('should export canvas with default filename if none provided', () => {
            Export.exportCanvasPNG(mockCanvas);

            expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
            expect(mockLink.download).toBe('neuroepi-chart.png');
            expect(mockLink.href).toBe('data:image/png;base64,mockdata');
            expect(mockLink.click).toHaveBeenCalledTimes(1);

            // Verify toast was shown by checking its DOM addition
            const toast = document.querySelector('.ne-toast');
            expect(toast).not.toBeNull();
            expect(toast.textContent).toBe('Chart exported as PNG');
        });
    });
});
