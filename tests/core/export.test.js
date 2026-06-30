/**
 * @jest-environment jsdom
 */

const Export = require('../../js/core/export.js');

describe('Export.showToast()', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        jest.useFakeTimers();
        // Mock requestAnimationFrame for JSDOM
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
            cb();
            return 1;
        });
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    it('should create a toast element with default type success', () => {
        Export.showToast('Test message');

        const toast = document.querySelector('.ne-toast');
        expect(toast).toBeTruthy();
        expect(toast.textContent).toBe('Test message');
        expect(toast.className).toContain('ne-toast--success');
    });

    it('should create a toast element with a custom type', () => {
        Export.showToast('Error message', 'error');

        const toast = document.querySelector('.ne-toast');
        expect(toast).toBeTruthy();
        expect(toast.textContent).toBe('Error message');
        expect(toast.className).toContain('ne-toast--error');
    });

    it('should remove existing toast if one is already present', () => {
        // Add a mock existing toast
        const existingToast = document.createElement('div');
        existingToast.className = 'ne-toast';
        existingToast.id = 'old-toast';
        document.body.appendChild(existingToast);

        Export.showToast('New message');

        // Old toast should be removed
        expect(document.getElementById('old-toast')).toBeNull();

        // New toast should be present
        const toasts = document.querySelectorAll('.ne-toast');
        expect(toasts.length).toBe(1);
        expect(toasts[0].textContent).toBe('New message');
    });

    it('should add the visible class via requestAnimationFrame', () => {
        Export.showToast('Test message');

        const toast = document.querySelector('.ne-toast');
        // Because we mocked requestAnimationFrame to execute synchronously
        expect(toast.classList.contains('ne-toast--visible')).toBe(true);
    });

    it('should handle the timeout lifecycle correctly', () => {
        Export.showToast('Test message');

        const toast = document.querySelector('.ne-toast');
        expect(toast.classList.contains('ne-toast--visible')).toBe(true);

        // Advance timers by 2000ms
        jest.advanceTimersByTime(2000);

        // Visible class should be removed
        expect(toast.classList.contains('ne-toast--visible')).toBe(false);

        // The element should still be in DOM
        expect(document.querySelector('.ne-toast')).toBeTruthy();

        // Advance timers by another 300ms
        jest.advanceTimersByTime(300);

        // Element should be removed
        expect(document.querySelector('.ne-toast')).toBeNull();
    });
});
