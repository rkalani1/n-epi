/**
 * @jest-environment jsdom
 */

const Export = require('../js/core/export.js');

describe('Export Module - formatMethodsText', () => {
    describe('formatMethodsText()', () => {
        it('should return a dot when params is empty', () => {
            const result = Export.formatMethodsText({});
            expect(result).toBe('.');
        });

        it('should correctly format when all parameters are provided', () => {
            const params = {
                design: 'A randomized controlled trial',
                test: 'Chi-square test',
                alpha: 0.05,
                power: 0.8,
                effect: 'a 10% difference',
                n: 100,
                dropoutAdjusted: 110,
                dropoutRate: 10
            };
            const result = Export.formatMethodsText(params);
            expect(result).toBe('A randomized controlled trial, using a Chi-square test, with a two-sided significance level of 0.05, 80% power, to detect a 10% difference, A total of 100 participants are required, (110 after adjusting for 10% dropout).');
        });

        it('should correctly format when only a subset of parameters is provided', () => {
            const params = {
                design: 'An observational study',
                alpha: 0.01,
                n: 500
            };
            const result = Export.formatMethodsText(params);
            expect(result).toBe('An observational study, with a two-sided significance level of 0.01, A total of 500 participants are required.');
        });

        it('should skip falsy parameter values for properties that require truthy checks', () => {
            const params = {
                power: 0, // falsy, should be skipped
                alpha: 0, // falsy, should be skipped
                dropoutRate: 0, // this will be rendered if dropoutAdjusted is truthy
                dropoutAdjusted: 50
            };
            const result = Export.formatMethodsText(params);
            expect(result).toBe('(50 after adjusting for 0% dropout).');
        });
    });
});
