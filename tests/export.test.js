/**
 * @jest-environment jsdom
 */

const Export = require('../js/core/export.js');

describe('Export - copyText', () => {
    let originalClipboard;
    let originalExecCommand;

    beforeEach(() => {
        // Clear DOM
        document.body.innerHTML = '';

        // Mock navigator.clipboard
        originalClipboard = navigator.clipboard;
        Object.defineProperty(navigator, 'clipboard', {
            value: {
                writeText: jest.fn()
            },
            writable: true
        });

        // Mock document.execCommand
        originalExecCommand = document.execCommand;
        document.execCommand = jest.fn();

        // Use fake timers to fast-forward toast timeouts
        jest.useFakeTimers();
    });

    afterEach(() => {
        // Restore mocks
        Object.defineProperty(navigator, 'clipboard', {
            value: originalClipboard,
            writable: true
        });
        document.execCommand = originalExecCommand;

        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('should use navigator.clipboard.writeText and show toast on success', async () => {
        navigator.clipboard.writeText.mockResolvedValueOnce();

        Export.copyText('test text');

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');

        // Wait for promise resolution
        await Promise.resolve();

        // Toast should be added
        const toast = document.querySelector('.ne-toast');
        expect(toast).not.toBeNull();
        expect(toast.textContent).toBe('Copied to clipboard');
        expect(toast.classList.contains('ne-toast--success')).toBe(true);
    });

    it('should fallback to document.execCommand when navigator.clipboard.writeText fails', async () => {
        // Create a promise we can control to resolve/reject after synchronous execution
        let rejectClipboard;
        const clipboardPromise = new Promise((_, reject) => {
            rejectClipboard = reject;
        });

        navigator.clipboard.writeText.mockReturnValueOnce(clipboardPromise);

        Export.copyText('fallback text');

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('fallback text');

        // Reject the promise
        rejectClipboard(new Error('Clipboard denied'));

        // Wait for the rejection to be processed in the microtask queue
        await Promise.resolve();
        await Promise.resolve();

        expect(document.execCommand).toHaveBeenCalledWith('copy');

        // Verify a temporary textarea was created and removed
        // Because it's removed synchronously in the catch block, it shouldn't be in the body anymore
        expect(document.querySelector('textarea')).toBeNull();

        // Toast should still be added in fallback
        const toast = document.querySelector('.ne-toast');
        expect(toast).not.toBeNull();
        expect(toast.textContent).toBe('Copied to clipboard');
    });
});
