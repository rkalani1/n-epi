/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Charts Module - ForestPlot', () => {
    let Charts;

    beforeEach(() => {
        // Mock Statistics required by Charts if needed
        global.Statistics = {
            round: (val, dec) => Number(val.toFixed(dec))
        };

        // Load Charts module
        const chartsCode = fs.readFileSync(path.join(__dirname, '../../js/core/charts.js'), 'utf8');
        // Evaluate in context
        const req = {};
        const mod = { exports: req };
        const fn = new Function('module', 'exports', chartsCode);
        fn(mod, req);
        Charts = mod.exports;
        window.Charts = Charts;
    });

    test('ForestPlot guards against missing canvas', () => {
        expect(() => Charts.ForestPlot(null, {})).not.toThrow();
        expect(() => Charts.ForestPlot({}, {})).not.toThrow();
    });

    test('ForestPlot renders basic plot with study and summary data', () => {
        const canvas = document.createElement('canvas');
        canvas.offsetWidth = 800;
        canvas.offsetHeight = 400;

        const mockContext = {
            scale: jest.fn(),
            fillRect: jest.fn(),
            fillText: jest.fn(),
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            stroke: jest.fn(),
            fill: jest.fn(),
            closePath: jest.fn(),
            save: jest.fn(),
            restore: jest.fn(),
            setLineDash: jest.fn(),
            measureText: jest.fn().mockReturnValue({ width: 50 })
        };
        jest.spyOn(canvas, 'getContext').mockReturnValue(mockContext);

        const options = {
            studies: [
                { name: 'Study 1', estimate: 1.2, ci: { lower: 0.8, upper: 1.6 }, weight: 40 },
                { name: 'Study 2', estimate: 1.5, ci: { lower: 1.1, upper: 1.9 }, weight: 60 }
            ],
            summary: { estimate: 1.35, ci: { lower: 1.05, upper: 1.7 }, label: 'Overall Effect' },
            nullValue: 1,
            measureLabel: 'Hazard Ratio',
            title: 'Meta-Analysis Forest Plot'
        };

        expect(() => Charts.ForestPlot(canvas, options)).not.toThrow();
        expect(mockContext.fillText).toHaveBeenCalled();
        expect(mockContext.stroke).toHaveBeenCalled();
        expect(mockContext.fill).toHaveBeenCalled();
    });

    test('ForestPlot handles subgroups, subgroupSummaries, predInterval, heterogeneity, and dropShadow', () => {
        const canvas = document.createElement('canvas');
        canvas.offsetWidth = 850;
        canvas.offsetHeight = 600;

        const mockContext = {
            scale: jest.fn(),
            fillRect: jest.fn(),
            fillText: jest.fn(),
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            stroke: jest.fn(),
            fill: jest.fn(),
            closePath: jest.fn(),
            save: jest.fn(),
            restore: jest.fn(),
            setLineDash: jest.fn(),
            measureText: jest.fn().mockReturnValue({ width: 50 })
        };
        jest.spyOn(canvas, 'getContext').mockReturnValue(mockContext);

        const options = {
            studies: [
                { name: 'Study A', estimate: 0.5, ci: { lower: 0.2, upper: 0.8 }, weight: 50, subgroup: 'Group 1' },
                { name: 'Study B', estimate: 0.7, ci: { lower: 0.4, upper: 1.0 }, weight: 50, subgroup: 'Group 1' },
                { name: 'Study C', estimate: 1.1, ci: { lower: 0.8, upper: 1.4 }, weight: 100, subgroup: 'Group 2' }
            ],
            subgroupSummaries: {
                'Group 1': { estimate: 0.6, ci: { lower: 0.35, upper: 0.85 } },
                'Group 2': { estimate: 1.1, ci: { lower: 0.8, upper: 1.4 } }
            },
            summary: { estimate: 0.8, ci: { lower: 0.5, upper: 1.1 }, label: 'Pooled' },
            predInterval: { lower: 0.3, upper: 1.3 },
            nullValue: 0,
            measureLabel: 'Mean Difference',
            logScale: false,
            dropShadow: true,
            heterogeneity: { I2: 45.2, Q: 8.5, p: 0.035, tau2: 0.021 },
            directionLabels: { left: 'Favors Treatment', right: 'Favors Control' }
        };

        expect(() => Charts.ForestPlot(canvas, options)).not.toThrow();
        expect(mockContext.fillText).toHaveBeenCalledWith('Favors Treatment', expect.any(Number), expect.any(Number));
        expect(mockContext.fillText).toHaveBeenCalledWith('Favors Control', expect.any(Number), expect.any(Number));
    });

    test('ForestPlot handles logScale formatting', () => {
        const canvas = document.createElement('canvas');
        const mockContext = {
            scale: jest.fn(),
            fillRect: jest.fn(),
            fillText: jest.fn(),
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            stroke: jest.fn(),
            fill: jest.fn(),
            closePath: jest.fn(),
            save: jest.fn(),
            restore: jest.fn(),
            setLineDash: jest.fn(),
            measureText: jest.fn().mockReturnValue({ width: 50 })
        };
        jest.spyOn(canvas, 'getContext').mockReturnValue(mockContext);

        const options = {
            studies: [
                { name: 'Log Study', estimate: 0.5, ci: { lower: 0.1, upper: 0.9 } }
            ],
            summary: { estimate: 0.5, ci: { lower: 0.1, upper: 0.9 } },
            nullValue: 0,
            logScale: true
        };

        expect(() => Charts.ForestPlot(canvas, options)).not.toThrow();
        // Math.exp(0.5).toFixed(2) === "1.65"
        const foundExpText = mockContext.fillText.mock.calls.some(call =>
            typeof call[0] === 'string' && call[0].includes('1.65')
        );
        expect(foundExpText).toBe(true);
    });
});
