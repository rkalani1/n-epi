/**
 * @jest-environment jsdom
 */

const Charts = require('../../js/core/charts.js');

describe('Charts Core Module', () => {
    let mockContext;
    let canvas;

    beforeEach(() => {
        document.documentElement.removeAttribute('data-theme');

        // Mock Statistics global required by LineChart
        global.Statistics = {
            round: jest.fn((val, dec) => {
                if (val === undefined || val === null || isNaN(val)) return 0;
                return Number(Math.round(val + 'e' + (dec || 0)) + 'e-' + (dec || 0));
            })
        };

        // Create a 2D context mock
        mockContext = {
            scale: jest.fn(),
            fillRect: jest.fn(),
            strokeRect: jest.fn(),
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            arc: jest.fn(),
            quadraticCurveTo: jest.fn(),
            closePath: jest.fn(),
            stroke: jest.fn(),
            fill: jest.fn(),
            fillText: jest.fn(),
            measureText: jest.fn(() => ({ width: 20 })),
            save: jest.fn(),
            restore: jest.fn(),
            translate: jest.fn(),
            rotate: jest.fn(),
            setLineDash: jest.fn(),
            drawImage: jest.fn(),
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 1,
            font: '',
            textAlign: '',
            shadowColor: '',
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0
        };

        // Mock HTMLCanvasElement.prototype.getContext so any canvas created gets our mock 2D context
        jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation((type) => {
            if (type === '2d') return mockContext;
            return null;
        });

        jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockImplementation(() => 'data:image/png;base64,fakeData');

        canvas = document.createElement('canvas');
        Object.defineProperty(canvas, 'offsetWidth', { value: 700, configurable: true });
        Object.defineProperty(canvas, 'offsetHeight', { value: 400, configurable: true });
    });

    afterEach(() => {
        delete global.Statistics;
        jest.restoreAllMocks();
    });

    describe('Theme and Canvas Utilities', () => {
        it('should return dark theme by default or light theme when data-theme is light', () => {
            const darkTheme = Charts.getTheme();
            expect(darkTheme.bg).toBe('#06090f');

            document.documentElement.setAttribute('data-theme', 'light');
            const lightTheme = Charts.getTheme();
            expect(lightTheme.bg).toBe('#ffffff');
        });

        it('should setup canvas with devicePixelRatio scaling', () => {
            window.devicePixelRatio = 2;
            const ctx = Charts.setupCanvas(canvas, 500, 300);

            expect(canvas.width).toBe(1000);
            expect(canvas.height).toBe(600);
            expect(canvas.style.width).toBe('500px');
            expect(canvas.style.height).toBe('300px');
            expect(ctx.scale).toHaveBeenCalledWith(2, 2);
        });

        it('should handle exportPNG by creating a download link', () => {
            const linkClickSpy = jest.fn();
            const originalCreateElement = document.createElement.bind(document);
            jest.spyOn(document, 'createElement').mockImplementation((tag) => {
                if (tag === 'a') {
                    return { download: '', href: '', click: linkClickSpy };
                }
                return originalCreateElement(tag);
            });

            Charts.exportPNG(canvas, 'my-chart.png');

            expect(canvas.toDataURL).toHaveBeenCalledWith('image/png');
            expect(linkClickSpy).toHaveBeenCalled();
        });

        it('should handle exportHighRes and downloadPNG', () => {
            const linkClickSpy = jest.fn();
            const originalCreateElement = document.createElement.bind(document);
            jest.spyOn(document, 'createElement').mockImplementation((tag) => {
                const el = originalCreateElement(tag);
                if (tag === 'a') {
                    el.click = linkClickSpy;
                }
                return el;
            });

            const dataUrl = Charts.exportHighRes(canvas, 2);
            expect(dataUrl).toBe('data:image/png;base64,fakeData');

            Charts.downloadPNG(canvas, 'highres.png', 3);
            expect(linkClickSpy).toHaveBeenCalled();
        });

        it('should safely return when invalid canvas is passed to export methods', () => {
            expect(Charts.exportHighRes(null)).toBeNull();
            expect(() => Charts.downloadPNG(null)).not.toThrow();
        });
    });

    describe('Canvas Guards for Chart Functions', () => {
        const chartFunctions = [
            'LineChart', 'ForestPlot', 'FunnelPlot', 'BarChart',
            'IconArray', 'KaplanMeierPlot', 'ROCCurve', 'HeatmapTable',
            'GanttChart', 'BoxPlot', 'DotPlot'
        ];

        chartFunctions.forEach((fnName) => {
            it(`${fnName} should handle null or invalid canvas gracefully`, () => {
                expect(() => Charts[fnName](null, {})).not.toThrow();
                expect(() => Charts[fnName]({}, {})).not.toThrow();
            });
        });
    });

    describe('LineChart', () => {
        it('should render a line chart with series, CI bounds, and grid', () => {
            const options = {
                title: 'Test Line Chart',
                xLabel: 'Time (days)',
                yLabel: 'Score',
                data: [
                    {
                        label: 'Group A',
                        points: [{ x: 0, y: 10 }, { x: 1, y: 20 }, { x: 2, y: 15 }],
                        ciLower: [{ x: 0, y: 8 }, { x: 1, y: 18 }, { x: 2, y: 12 }],
                        ciUpper: [{ x: 0, y: 12 }, { x: 1, y: 22 }, { x: 2, y: 18 }]
                    },
                    {
                        label: 'Group B',
                        points: [{ x: 0, y: 5 }, { x: 1, y: 10 }, { x: 2, y: 8 }]
                    }
                ],
                showGrid: true,
                showLegend: true
            };

            Charts.LineChart(canvas, options);

            expect(mockContext.fillText).toHaveBeenCalledWith('Test Line Chart', expect.any(Number), 22);
            expect(mockContext.fillText).toHaveBeenCalledWith('Time (days)', expect.any(Number), expect.any(Number));
            expect(mockContext.fillText).toHaveBeenCalledWith('Score', 0, 0);
            expect(mockContext.stroke).toHaveBeenCalled();
            expect(mockContext.fill).toHaveBeenCalled();
        });
    });

    describe('ForestPlot', () => {
        it('should render a forest plot with studies, summary, subgroups, and heterogeneity', () => {
            const options = {
                title: 'Meta-Analysis Forest Plot',
                measureLabel: 'Odds Ratio',
                studies: [
                    { name: 'Study 1', estimate: 1.2, ci: { lower: 0.8, upper: 1.8 }, weight: 40, subgroup: 'Group 1' },
                    { name: 'Study 2', estimate: 1.5, ci: { lower: 1.1, upper: 2.1 }, weight: 60, subgroup: 'Group 1' }
                ],
                summary: { label: 'Overall Effect', estimate: 1.35, ci: { lower: 1.05, upper: 1.73 } },
                predInterval: { lower: 0.9, upper: 2.0 },
                heterogeneity: { I2: 25.4, tau2: 0.02, Q: 3.2, p: 0.15 },
                subgroupSummaries: {
                    'Group 1': { estimate: 1.35, ci: { lower: 1.05, upper: 1.73 } }
                },
                dropShadow: true,
                logScale: false
            };

            Charts.ForestPlot(canvas, options);

            expect(mockContext.fillText).toHaveBeenCalledWith('Meta-Analysis Forest Plot', expect.any(Number), 20);
            expect(mockContext.fillText).toHaveBeenCalledWith('Study 1', 10, expect.any(Number));
            expect(mockContext.fillText).toHaveBeenCalledWith('Overall Effect', 10, expect.any(Number));
            expect(mockContext.shadowBlur).toBe(0); // cleared drop shadow
        });
    });

    describe('FunnelPlot', () => {
        it('should render funnel plot with observed, imputed points, pseudo CI, and Egger line', () => {
            const options = {
                effects: [0.2, 0.3, 0.1, 0.4],
                se: [0.1, 0.12, 0.08, 0.15],
                pooledEffect: 0.23,
                showPseudoCI: true,
                imputedEffects: [0.05],
                imputedSE: [0.11],
                eggerLine: { intercept: 0.5, slope: 0.15 },
                dropShadow: true
            };

            Charts.FunnelPlot(canvas, options);

            expect(mockContext.fillText).toHaveBeenCalledWith('Funnel Plot', expect.any(Number), 22);
            expect(mockContext.fillText).toHaveBeenCalledWith("Egger's", expect.any(Number), expect.any(Number));
            expect(mockContext.fillText).toHaveBeenCalledWith('Imputed (trim-fill)', expect.any(Number), expect.any(Number));
        });
    });

    describe('BarChart', () => {
        it('should render vertical bar chart with error bars and value labels', () => {
            const options = {
                title: 'Bar Chart',
                categories: ['Cat A', 'Cat B'],
                series: [
                    { label: 'Series 1', values: [10, 20] },
                    { label: 'Series 2', values: [15, 25] }
                ],
                errorBars: [
                    { lower: [8, 18], upper: [12, 22] },
                    { lower: [12, 22], upper: [18, 28] }
                ],
                showValueLabels: true,
                horizontal: false
            };

            Charts.BarChart(canvas, options);

            expect(mockContext.fillText).toHaveBeenCalledWith('Bar Chart', expect.any(Number), 22);
            expect(mockContext.fillText).toHaveBeenCalledWith('10', expect.any(Number), expect.any(Number));
        });

        it('should render horizontal bar chart and grouped+stacked bars', () => {
            const options = {
                title: 'Horizontal Stacked',
                categories: ['Cat A', 'Cat B'],
                series: [
                    { label: 'Series 1', values: [10, 20], stackGroup: 'G1' },
                    { label: 'Series 2', values: [15, 25], stackGroup: 'G1' }
                ],
                horizontal: true,
                showValueLabels: true,
                xLabel: 'X Axis',
                yLabel: 'Y Axis'
            };

            Charts.BarChart(canvas, options);

            expect(mockContext.fillText).toHaveBeenCalledWith('Horizontal Stacked', expect.any(Number), 22);
            expect(mockContext.fillText).toHaveBeenCalledWith('X Axis', 0, 0);
            expect(mockContext.fillText).toHaveBeenCalledWith('Y Axis', expect.any(Number), expect.any(Number));
        });
    });

    describe('IconArray', () => {
        it('should render icon array (Cates plot) with person icons and NNT', () => {
            const options = {
                title: 'Icon Array',
                cer: 0.2,
                eer: 0.1,
                n: 100
            };

            Charts.IconArray(canvas, options);

            expect(mockContext.fillText).toHaveBeenCalledWith('Icon Array', expect.any(Number), 25);
            expect(mockContext.fillText).toHaveBeenCalledWith('NNT = 10', expect.any(Number), expect.any(Number));
        });
    });

    describe('KaplanMeierPlot', () => {
        it('should render KM curve with CI bands, censoring ticks, and number-at-risk table', () => {
            const options = {
                title: 'Kaplan-Meier Survival',
                groups: [
                    {
                        label: 'Treatment',
                        table: [
                            { time: 0, survival: 1.0, ciLower: 1.0, ciUpper: 1.0, nRisk: 100, events: 0, censored: 0 },
                            { time: 10, survival: 0.8, ciLower: 0.7, ciUpper: 0.9, nRisk: 100, events: 20, censored: 0 },
                            { time: 20, survival: 0.4, ciLower: 0.3, ciUpper: 0.5, nRisk: 80, events: 35, censored: 5 }
                        ]
                    }
                ],
                medianLines: true,
                showCI: true,
                showCensoring: true,
                showAtRisk: true
            };

            Charts.KaplanMeierPlot(canvas, options);

            expect(mockContext.fillText).toHaveBeenCalledWith('Kaplan-Meier Survival', expect.any(Number), 22);
            expect(mockContext.fillText).toHaveBeenCalledWith('No. at risk', 5, expect.any(Number));
        });
    });

    describe('ROCCurve', () => {
        it('should render ROC curve with AUC and optimal threshold', () => {
            const options = {
                title: 'ROC Curve Analysis',
                points: [
                    { fpr: 0, tpr: 0 },
                    { fpr: 0.2, tpr: 0.7 },
                    { fpr: 1, tpr: 1 }
                ],
                auc: 0.85,
                optimalThreshold: { fpr: 0.2, tpr: 0.7 }
            };

            Charts.ROCCurve(canvas, options);

            expect(mockContext.fillText).toHaveBeenCalledWith('ROC Curve Analysis', expect.any(Number), 22);
            expect(mockContext.fillText).toHaveBeenCalledWith('AUC = 0.850', expect.any(Number), expect.any(Number));
        });
    });

    describe('HeatmapTable', () => {
        it('should render heatmap with sequential and diverging color scales', () => {
            const optionsSeq = {
                title: 'Sequential Heatmap',
                data: [[1, 2], [3, 4]],
                rowLabels: ['R1', 'R2'],
                colLabels: ['C1', 'C2'],
                colorScale: 'sequential'
            };

            Charts.HeatmapTable(canvas, optionsSeq);
            expect(mockContext.fillText).toHaveBeenCalledWith('Sequential Heatmap', expect.any(Number), 20);

            const optionsDiv = {
                title: 'Diverging Heatmap',
                data: [[-10, 0], [5, 10]],
                rowLabels: ['R1', 'R2'],
                colLabels: ['C1', 'C2'],
                colorScale: 'diverging'
            };

            Charts.HeatmapTable(canvas, optionsDiv);
            expect(mockContext.fillText).toHaveBeenCalledWith('Diverging Heatmap', expect.any(Number), 20);
        });
    });

    describe('GanttChart', () => {
        it('should render gantt chart with task timelines', () => {
            const options = {
                title: 'Study Schedule',
                tasks: [
                    { label: 'Enrollment', start: 0, end: 12 },
                    { label: 'Follow-up', start: 12, end: 36 }
                ],
                totalMonths: 36
            };

            Charts.GanttChart(canvas, options);

            expect(mockContext.fillText).toHaveBeenCalledWith('Study Schedule', expect.any(Number), 22);
            expect(mockContext.fillText).toHaveBeenCalledWith('Enrollment', expect.any(Number), expect.any(Number));
        });
    });

    describe('DAGDiagram', () => {
        it('should render DAG diagram onto canvas or container element', () => {
            const options = {
                nodes: [
                    { id: 'E', label: 'Exposure', type: 'exposure', x: 100, y: 200 },
                    { id: 'O', label: 'Outcome', type: 'outcome', x: 400, y: 200 },
                    { id: 'C', label: 'Confounder', type: 'confounder', x: 250, y: 100 }
                ],
                edges: [
                    { from: 'E', to: 'O' },
                    { from: 'C', to: 'E' },
                    { from: 'C', to: 'O' }
                ]
            };

            // Test passing canvas directly
            Charts.DAGDiagram(canvas, options);
            expect(mockContext.fillText).toHaveBeenCalledWith('Exposure', 100, 204);

            // Test passing div container
            const div = document.createElement('div');
            div.appendChild = jest.fn();
            Charts.DAGDiagram(div, options);
            expect(div.appendChild).toHaveBeenCalled();
        });
    });

    describe('BoxPlot', () => {
        it('should render vertical and horizontal box plot with outliers and jittered points', () => {
            const optionsVertical = {
                title: 'Vertical Box Plot',
                groups: [
                    { label: 'Group 1', data: [1, 2, 5, 6, 7, 8, 9, 20] }, // 20 is outlier
                    { label: 'Group 2', data: [3, 4, 5, 5, 6, 7, 8] }
                ],
                showPoints: true,
                showMean: true,
                horizontal: false,
                dropShadow: true
            };

            Charts.BoxPlot(canvas, optionsVertical);
            expect(mockContext.fillText).toHaveBeenCalledWith('Vertical Box Plot', expect.any(Number), 22);

            const optionsHorizontal = {
                title: 'Horizontal Box Plot',
                groups: [
                    { label: 'Group 1', data: [1, 2, 5, 6, 7, 8, 9, 20] }
                ],
                showPoints: true,
                showMean: true,
                horizontal: true
            };

            Charts.BoxPlot(canvas, optionsHorizontal);
            expect(mockContext.fillText).toHaveBeenCalledWith('Horizontal Box Plot', expect.any(Number), 22);
        });
    });

    describe('DotPlot', () => {
        it('should render dot plot with effect estimates, CI whiskers, and numeric labels', () => {
            const options = {
                title: 'Subgroup Analysis Dot Plot',
                estimates: [
                    { label: 'Subgroup A', estimate: 1.5, lower: 1.1, upper: 2.0 },
                    { label: 'Subgroup B', estimate: 0.9, lower: 0.6, upper: 1.3 }
                ],
                nullValue: 1.0,
                showLabels: true,
                logScale: false
            };

            Charts.DotPlot(canvas, options);

            expect(mockContext.fillText).toHaveBeenCalledWith('Subgroup Analysis Dot Plot', expect.any(Number), 22);
            expect(mockContext.fillText).toHaveBeenCalledWith('Subgroup A', expect.any(Number), expect.any(Number));
            expect(mockContext.fillText).toHaveBeenCalledWith('1.50 [1.10, 2.00]', expect.any(Number), expect.any(Number));
        });
    });
});
