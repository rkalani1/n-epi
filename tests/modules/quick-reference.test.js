/**
 * @jest-environment jsdom
 */

// Mock global dependencies
global.App = {
    createModuleLayout: jest.fn().mockReturnValue('<div id="mock-layout"></div>'),
    setTrustedHTML: jest.fn((el, html) => { if (el) el.innerHTML = html; }),
    tooltip: jest.fn().mockReturnValue(''),
    registerModule: jest.fn()
};

describe('Quick Reference Module', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="module-container"></div>';
        jest.clearAllMocks();

        jest.isolateModules(() => {
            require('../../js/modules/quick-reference.js');
        });
    });

    it('should register the quick-reference module', () => {
        expect(App.registerModule).toHaveBeenCalledWith('quick-reference', expect.any(Object));
    });

    it('should render module layout without any javascript: URIs', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        const container = document.getElementById('module-container');

        renderFunc(container);

        expect(App.setTrustedHTML).toHaveBeenCalled();

        const renderedHTML = container.innerHTML;
        expect(renderedHTML).not.toContain('javascript:');
    });

    it('should use button elements for letter jump links in glossary', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        const container = document.getElementById('module-container');

        renderFunc(container);

        // Switch to glossary tab
        window.QuickReference.switchTab('glossary');

        // Ensure glossary contains letter buttons and no javascript: links
        const letterButtons = container.querySelectorAll('button[onclick*="jumpToLetter"]');
        expect(letterButtons.length).toBeGreaterThan(0);

        letterButtons.forEach(btn => {
            expect(btn.getAttribute('type')).toBe('button');
            expect(btn.hasAttribute('href')).toBe(false);
        });
    });

    it('should call jumpToLetter when a letter jump button is clicked', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        const container = document.getElementById('module-container');

        renderFunc(container);
        window.QuickReference.switchTab('glossary');

        const scrollSpy = jest.fn();
        const targetDiv = document.getElementById('qr-gloss-A');
        if (targetDiv) {
            targetDiv.scrollIntoView = scrollSpy;
        }

        window.QuickReference.jumpToLetter('A');
        expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });
});
