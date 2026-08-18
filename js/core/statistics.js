/**
 * n-epi — Complete Statistical Engine
 * Note: The Statistics module has been refactored into smaller files in js/core/stats/.
 * This file now serves only as an aggregator for Node.js environments.
 */

if (typeof require !== 'undefined' && typeof module !== 'undefined') {
    require('./stats/constants.js');
    require('./stats/special-functions.js');
    require('./stats/normal-distribution.js');
    require('./stats/students-t-distribution.js');
    require('./stats/chi-squared-distribution.js');
    require('./stats/f-distribution.js');
    require('./stats/binomial-distribution.js');
    require('./stats/poisson-distribution.js');
    require('./stats/hypergeometric-distribution.js');
    require('./stats/confidence-intervals-for-proportions.js');
    require('./stats/hypothesis-tests.js');
    require('./stats/sample-size-formulas.js');
    require('./stats/meta-analysis.js');
    require('./stats/survival-analysis.js');
    require('./stats/diagnostic-accuracy.js');
    require('./stats/epidemiology-2x2-table.js');
    require('./stats/effect-size-conversions.js');
    require('./stats/utility-functions.js');

    module.exports = (typeof window !== 'undefined' ? window.Statistics : global.Statistics);
} else {
    console.warn("js/core/statistics.js is deprecated for browser use. Please include the individual scripts from js/core/stats/ instead.");
}
