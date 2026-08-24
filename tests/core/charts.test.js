/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const Charts = require('../../js/core/charts.js');

describe('Charts.ForestPlot', () => {
    let mockCtx;

    beforeEach(() => {
        mockCtx = {
            scale: jest.fn(),
            fillRect: jest.fn(),
            strokeRect: jest.fn(),
            fillText: jest.fn(),
            measureText: jest.fn().mockReturnValue({ width: 50 }),
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            closePath: jest.fn(),
            stroke: jest.fn(),
            fill: jest.fn(),
            arc: jest.fn(),
            quadraticCurveTo: jest.fn(),
            setLineDash: jest.fn(),
            save: jest.fn(),
            restore: jest.fn(),
            translate: jest.fn(),
            rotate: jest.fn(),
        };

        HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(mockCtx);
    });

    test('renders forest plot without crashing with standard options', () => {
        const canvas = document.createElement('canvas');
        Object.defineProperty(canvas, 'offsetWidth', { value: 850 });
        Object.defineProperty(canvas, 'offsetHeight', { value: 400 });

        const options = {
            studies: [
                { name: 'Study 1 (Very long study name to test truncation)', estimate: 1.2, ci: { lower: 0.8, upper: 1.6 }, weight: 25 },
                { name: 'Study 2', estimate: 1.5, ci: { lower: 1.1, upper: 1.9 }, weight: 35 },
            ],
            summary: { estimate: 1.35, ci: { lower: 1.05, upper: 1.7 }, label: 'Overall' },
            predInterval: { lower: 0.7, upper: 2.1 },
            heterogeneity: { I2: 25.4, tau2: 0.02, Q: 3.5, p: 0.18 },
            directionLabels: { left: 'Favors A', right: 'Favors B' },
            title: 'Test Forest Plot'
        };

        expect(() => Charts.ForestPlot(canvas, options)).not.toThrow();
        expect(mockCtx.fillText).toHaveBeenCalledWith('Study', 10, expect.any(Number));
        expect(mockCtx.fillText).toHaveBeenCalledWith('Favors A', expect.any(Number), expect.any(Number));
        expect(mockCtx.fillText).toHaveBeenCalledWith('Favors B', expect.any(Number), expect.any(Number));
    });

    test('renders forest plot with subgroups and subgroup summaries', () => {
        const canvas = document.createElement('canvas');
        const options = {
            studies: [
                { name: 'Study 1', estimate: 1.2, ci: { lower: 0.8, upper: 1.6 }, weight: 25, subgroup: 'Group A' },
                { name: 'Study 2', estimate: 1.5, ci: { lower: 1.1, upper: 1.9 }, weight: 35, subgroup: 'Group B' },
            ],
            subgroupSummaries: {
                'Group A': { estimate: 1.2, ci: { lower: 0.8, upper: 1.6 } },
                'Group B': { estimate: 1.5, ci: { lower: 1.1, upper: 1.9 } },
            },
            summary: { estimate: 1.35, ci: { lower: 1.05, upper: 1.7 } }
        };

        expect(() => Charts.ForestPlot(canvas, options)).not.toThrow();
        expect(mockCtx.fillText).toHaveBeenCalledWith('Group A', 10, expect.any(Number));
        expect(mockCtx.fillText).toHaveBeenCalledWith('  Subtotal: Group A', 10, expect.any(Number));
        expect(mockCtx.fillText).toHaveBeenCalledWith('Group B', 10, expect.any(Number));
        expect(mockCtx.fillText).toHaveBeenCalledWith('  Subtotal: Group B', 10, expect.any(Number));
    });

    test('handles log scale, drop shadow options and heterogeneity p < 0.001 formatting', () => {
        const canvas = document.createElement('canvas');
        const options = {
            studies: [
                { name: 'Study 1', estimate: 0.2, ci: { lower: -0.2, upper: 0.6 }, weight: 50 },
            ],
            heterogeneity: { I2: 80, tau2: 0.1, Q: 15.2, p: 0.0001 },
            logScale: true,
            dropShadow: true,
            nullValue: 0
        };

        expect(() => Charts.ForestPlot(canvas, options)).not.toThrow();
        expect(mockCtx.fillText).toHaveBeenCalledWith('Heterogeneity: I² = 80.0%;  τ² = 0.1000;  Q = 15.20;  p < 0.001', 10, expect.any(Number));
    });

    test('returns early if canvas guard fails', () => {
        expect(Charts.ForestPlot(null, {})).toBeUndefined();
    });
});
