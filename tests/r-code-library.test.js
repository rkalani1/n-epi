/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('r-code-library.js', () => {
    let container;

    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = '<div id="container"></div>';
        container = document.getElementById('container');

        // Mock App and Export
        window.App = {
            createModuleLayout: jest.fn().mockReturnValue('<div>Mock Layout</div>'),
            setTrustedHTML: jest.fn((el, html) => { el.innerHTML = html; }),
            registerModule: jest.fn((id, module) => {
                window._registeredModule = module;
            })
        };

        window.Export = {
            copyToClipboard: jest.fn()
        };

        // Load and execute the script
        const scriptPath = path.resolve(__dirname, '../js/modules/r-code-library.js');
        const scriptCode = fs.readFileSync(scriptPath, 'utf8');
        eval(scriptCode);
    });

    afterEach(() => {
        jest.clearAllMocks();
        delete window.RCodeLibrary;
        delete window._registeredModule;
        document.body.innerHTML = '';
    });

    test('registers module correctly', () => {
        expect(window.App.registerModule).toHaveBeenCalledWith('r-code-library', expect.any(Object));
        expect(window._registeredModule).toBeDefined();
        expect(typeof window._registeredModule.render).toBe('function');
    });

    test('render() initializes the DOM correctly', () => {
        window._registeredModule.render(container);

        expect(window.App.createModuleLayout).toHaveBeenCalledWith(
            'R Code Library',
            expect.any(String)
        );
        expect(window.App.setTrustedHTML).toHaveBeenCalled();

        // Check if categories are rendered as buttons
        const catButtons = container.querySelectorAll('button[id^="rcl-cat-"]');
        expect(catButtons.length).toBeGreaterThan(0);

        // Check if recipe container exists
        const recipesContainer = container.querySelector('#rcl-recipes');
        expect(recipesContainer).not.toBeNull();
    });

    test('showCategory() updates the active tab and renders recipes', () => {
        window._registeredModule.render(container);

        // Initial state
        let btn0 = document.getElementById('rcl-cat-0');
        let btn1 = document.getElementById('rcl-cat-1');
        expect(btn0.className).toContain('btn-primary');
        expect(btn1.className).toContain('btn-secondary');

        // Clear mock to cleanly check the next call
        window.App.setTrustedHTML.mockClear();

        // Act
        window.RCodeLibrary.showCategory(1);

        // Assert buttons updated
        expect(btn0.className).toContain('btn-secondary');
        expect(btn1.className).toContain('btn-primary');

        // Assert setTrustedHTML was called for the recipes container
        expect(window.App.setTrustedHTML).toHaveBeenCalledWith(
            expect.objectContaining({ id: 'rcl-recipes' }),
            expect.stringContaining('2x2 Table Analysis') // Title of first recipe in category 1
        );
    });

    test('showCategory() gracefully handles missing button', () => {
        window._registeredModule.render(container);

        // Remove a button to test the if (btn) condition
        const btn0 = document.getElementById('rcl-cat-0');
        if(btn0) btn0.remove();

        // Should not throw
        expect(() => {
            window.RCodeLibrary.showCategory(1);
        }).not.toThrow();
    });

    test('showCategory() gracefully handles missing recipes container', () => {
        window._registeredModule.render(container);

        // Remove recipes container to test the if (el) condition
        const recipesContainer = document.getElementById('rcl-recipes');
        if(recipesContainer) recipesContainer.remove();

        // Should not throw
        expect(() => {
            window.RCodeLibrary.showCategory(1);
        }).not.toThrow();
    });

    test('showCategory() escapes HTML in code blocks', () => {
        window._registeredModule.render(container);
        window.App.setTrustedHTML.mockClear();

        // Category 4 (Diagnostic Accuracy) has < in the ROC curve recipe
        window.RCodeLibrary.showCategory(4);

        const htmlCall = window.App.setTrustedHTML.mock.calls[0][1];

        // Original code: n <- 200 (assignment arrow)
        // Escaped: n &lt;- 200
        expect(htmlCall).toContain('n &lt;- 200');
        // The corrected ROC direction (">") must also be escaped
        expect(htmlCall).toContain('direction = "&gt;"');
    });

    test('copyRecipe() calls Export.copyToClipboard with correct code', () => {
        // Need to render first so the categories array is available
        // Well, the categories array is in the closure, so it's always available to copyRecipe
        window.RCodeLibrary.copyRecipe(0, 0); // Category 0, Recipe 0

        expect(window.Export.copyToClipboard).toHaveBeenCalled();
        const copiedText = window.Export.copyToClipboard.mock.calls[0][0];

        // Verify it contains a key piece of the R code
        expect(copiedText).toContain('library(pwr)');
        expect(copiedText).toContain('p1 <- 0.30');
    });

    test('copySetup() calls Export.copyToClipboard with setup script', () => {
        window.RCodeLibrary.copySetup();

        expect(window.Export.copyToClipboard).toHaveBeenCalled();
        const copiedText = window.Export.copyToClipboard.mock.calls[0][0];

        // Verify it contains install.packages and key packages
        expect(copiedText).toContain('install.packages(c("pwr", "epiR", "meta"');
        expect(copiedText).toContain('"ggplot2"');
    });
});
