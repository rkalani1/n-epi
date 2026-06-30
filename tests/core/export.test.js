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
});
