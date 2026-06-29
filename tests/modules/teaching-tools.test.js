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

global.Export = {
    showToast: jest.fn(),
    copyToClipboard: jest.fn()
};

describe('Teaching Tools Module', () => {
    beforeEach(() => {
        // Clear DOM and mocks
        document.body.innerHTML = '<div id="module-content"></div>';
        jest.clearAllMocks();

        // Reset the module to ensure it initializes fresh for tests
        jest.isolateModules(() => {
            require('../../js/modules/teaching-tools.js');
        });
    });

    it('should register the module', () => {
        expect(App.registerModule).toHaveBeenCalledWith('teaching-tools', expect.any(Object));
    });
});

describe('UI Rendering and Navigation', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="tt-content"></div>';
        jest.isolateModules(() => {
            require('../../js/modules/teaching-tools.js');
        });
    });

    it('should render initial layout and switch tabs', () => {
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        const container = document.createElement('div');
        container.id = 'module-container';
        document.body.appendChild(container);

        renderFunc(container);

        expect(App.createModuleLayout).toHaveBeenCalled();
        expect(App.setTrustedHTML).toHaveBeenCalled();

        // Test tab switching
        window.TeachingTools.switchTool('flashcards');
        expect(document.getElementById('tt-content')).toBeDefined();
    });
});

describe('Biostatistics Quiz Generator', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="tt-content"></div>';
        jest.isolateModules(() => {
            require('../../js/modules/teaching-tools.js');
        });
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        const container = document.createElement('div');
        renderFunc(container);
    });

    it('should start quiz and render first question', () => {
        window.TeachingTools.startBiostatQuiz();
        const content = document.getElementById('tt-content').innerHTML;
        expect(content).toContain('Question 1 of 10');
    });

    it('should allow answering a question', () => {
        window.TeachingTools.startBiostatQuiz();
        window.TeachingTools.answerBiostatQuiz(0);
        const content = document.getElementById('tt-content').innerHTML;
        expect(content).toContain('Explanation:');
    });
});

describe('Concept Flashcards', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="tt-content"></div>';
        jest.isolateModules(() => {
            require('../../js/modules/teaching-tools.js');
        });
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        const container = document.createElement('div');
        renderFunc(container);
        window.TeachingTools.switchTool('flashcards');
    });

    it('should flip the flashcard', () => {
        window.TeachingTools.flipFlashcard();
        const content = document.getElementById('tt-content').innerHTML;
        expect(content).toContain('Example:');
    });

    it('should navigate to next and prev flashcard', () => {
        window.TeachingTools.nextFlashcard();
        let content = document.getElementById('tt-content').innerHTML;
        expect(content).toContain('Card 2 of 45');

        window.TeachingTools.prevFlashcard();
        content = document.getElementById('tt-content').innerHTML;
        expect(content).toContain('Card 1 of 45');
    });

    it('should shuffle flashcards', () => {
        window.TeachingTools.shuffleFlashcards();
        const content = document.getElementById('tt-content').innerHTML;
        expect(content).toContain('Unshuffle');
    });
});

describe('Study Design Decision Tree', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="tt-content"></div>';
        jest.isolateModules(() => {
            require('../../js/modules/teaching-tools.js');
        });
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        const container = document.createElement('div');
        renderFunc(container);
        window.TeachingTools.switchTool('decision-tree');
    });

    it('should navigate decision tree and show result', () => {
        // Answer Yes to first question (Investigator assigns exposure)
        window.TeachingTools.chooseTreeOption(0);
        let content = document.getElementById('tt-content').innerHTML;
        expect(content).toContain('Is the assignment randomized?');

        // Answer Yes (Randomized)
        window.TeachingTools.chooseTreeOption(0);
        content = document.getElementById('tt-content').innerHTML;
        expect(content).toContain('What is the unit of randomization?');

        // Answer Individual patients
        window.TeachingTools.chooseTreeOption(0);
        content = document.getElementById('tt-content').innerHTML;
        expect(content).toContain('Randomized Controlled Trial (RCT)');
    });

    it('should navigate back and reset in decision tree', () => {
        window.TeachingTools.chooseTreeOption(0);
        window.TeachingTools.backDecisionTree();
        let content = document.getElementById('tt-content').innerHTML;
        expect(content).toContain('Does the investigator assign the exposure or intervention?');

        window.TeachingTools.chooseTreeOption(0);
        window.TeachingTools.resetDecisionTree();
        content = document.getElementById('tt-content').innerHTML;
        expect(content).toContain('Does the investigator assign the exposure or intervention?');
    });
});

describe('Journal Club Worksheet', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="tt-content"></div>';
        jest.isolateModules(() => {
            require('../../js/modules/teaching-tools.js');
        });
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        const container = document.createElement('div');
        renderFunc(container);
        window.TeachingTools.switchTool('journal-club');
    });

    it('should clear worksheet inputs', () => {
        const input = document.getElementById('jc-0-0');
        input.value = 'Test Title';

        window.TeachingTools.clearWorksheet();
        expect(document.getElementById('jc-0-0').value).toBe('');
    });

    it('should copy worksheet text', () => {
        const input = document.getElementById('jc-0-0');
        input.value = 'Test Title';

        window.TeachingTools.copyWorksheet();
        expect(Export.copyToClipboard).toHaveBeenCalled();
        expect(Export.copyToClipboard.mock.calls[0][0]).toContain('Test Title');
    });
});

describe('Glossary', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="tt-content"></div>';
        jest.isolateModules(() => {
            require('../../js/modules/teaching-tools.js');
        });
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        const container = document.createElement('div');
        renderFunc(container);
        window.TeachingTools.switchTool('glossary');
    });

    it('should filter glossary terms', () => {
        const listDiv = document.createElement('div');
        listDiv.id = 'tt-glossary-list';
        document.body.appendChild(listDiv);

        window.TeachingTools.filterGlossary('Absolute Risk');
        expect(App.setTrustedHTML).toHaveBeenCalled();
        const callHtml = App.setTrustedHTML.mock.calls[App.setTrustedHTML.mock.calls.length - 1][1];
        expect(callHtml).toContain('Absolute Risk Reduction (ARR)');
        expect(callHtml).not.toContain('Forest Plot');
    });

    it('should show no matching terms found when no terms match', () => {
        const listDiv = document.createElement('div');
        listDiv.id = 'tt-glossary-list';
        document.body.appendChild(listDiv);

        window.TeachingTools.filterGlossary('asdasdasd123123');
        const callHtml = App.setTrustedHTML.mock.calls[App.setTrustedHTML.mock.calls.length - 1][1];
        expect(callHtml).toContain('No matching terms found');
    });
});

describe('Concept Maps Drawing', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="tt-content"></div>';
        jest.useFakeTimers();

        // Mock canvas context
        HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
            scale: jest.fn(),
            fillRect: jest.fn(),
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            stroke: jest.fn(),
            measureText: jest.fn(() => ({ width: 10 })),
            roundRect: jest.fn(),
            fill: jest.fn(),
            fillText: jest.fn()
        }));

        jest.isolateModules(() => {
            require('../../js/modules/teaching-tools.js');
        });
        const renderFunc = App.registerModule.mock.calls[0][1].render;
        const container = document.createElement('div');
        renderFunc(container);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should draw concept maps after timeout', () => {
        window.TeachingTools.switchTool('concepts');
        jest.runAllTimers();

        const canvas = document.getElementById('tt-concept-0');
        expect(canvas).not.toBeNull();
        expect(canvas.getContext).toHaveBeenCalledWith('2d');
    });
});
