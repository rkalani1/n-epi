/**
 * @jest-environment jsdom
 */

const Statistics = require('../../js/core/statistics.js');

describe('Statistics Module - gammaFunction', () => {
    // Helper function to test approximately equal
    const expectApproxEqual = (actual, expected, tolerance = 1e-6) => {
        expect(Math.abs(actual - expected)).toBeLessThan(tolerance);
    };

    it('should compute gamma for positive integers correctly (gamma(n) = (n-1)!)', () => {
        expectApproxEqual(Statistics.gammaFunction(1), 1); // 0!
        expectApproxEqual(Statistics.gammaFunction(2), 1); // 1!
        expectApproxEqual(Statistics.gammaFunction(3), 2); // 2!
        expectApproxEqual(Statistics.gammaFunction(4), 6); // 3!
        expectApproxEqual(Statistics.gammaFunction(5), 24); // 4!
        expectApproxEqual(Statistics.gammaFunction(6), 120); // 5!
    });

    it('should compute gamma for half-integers correctly', () => {
        expectApproxEqual(Statistics.gammaFunction(0.5), Math.sqrt(Math.PI));
        expectApproxEqual(Statistics.gammaFunction(1.5), 0.5 * Math.sqrt(Math.PI));
        expectApproxEqual(Statistics.gammaFunction(2.5), 0.75 * Math.sqrt(Math.PI));
    });

    it('should compute gamma for values < 0.5 (using reflection formula)', () => {
        expectApproxEqual(Statistics.gammaFunction(0.1), 9.513507698668736, 1e-5);
        expectApproxEqual(Statistics.gammaFunction(0.2), 4.590843711998803, 1e-5);
        expectApproxEqual(Statistics.gammaFunction(0.3), 2.9915689876875904, 1e-5);
        expectApproxEqual(Statistics.gammaFunction(0.4), 2.218159543757688, 1e-5);

        // Negative non-integers
        expectApproxEqual(Statistics.gammaFunction(-0.5), -2 * Math.sqrt(Math.PI));
        expectApproxEqual(Statistics.gammaFunction(-1.5), (4/3) * Math.sqrt(Math.PI));
        expectApproxEqual(Statistics.gammaFunction(-2.5), -(8/15) * Math.sqrt(Math.PI));
    });
});
