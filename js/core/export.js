/**
 * Neuro-Epi — Export Utilities
 * Clipboard, PNG export, text formatters, localStorage persistence
 */

const Export = (() => {
    'use strict';

    // ============================================================
    // CLIPBOARD
    // ============================================================

    function copyText(text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard');
        }).catch(() => {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast('Copied to clipboard');
        });
    }

    function copyTSV(headers, rows) {
        const lines = [headers.join('\t')];
        rows.forEach(row => lines.push(row.join('\t')));
        copyText(lines.join('\n'));
    }

    // ============================================================
    // TOAST NOTIFICATION
    // ============================================================

    function showToast(message, type = 'success') {
        const existing = document.querySelector('.ne-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `ne-toast ne-toast--${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('ne-toast--visible'));
        setTimeout(() => {
            toast.classList.remove('ne-toast--visible');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // ============================================================
    // PNG EXPORT
    // ============================================================

    function exportCanvasPNG(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename || 'neuroepi-chart.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('Chart exported as PNG');
    }

    // ============================================================
    // TEXT FORMATTERS
    // ============================================================

    function formatMethodsText(params) {
        const parts = [];
        if (params.design) parts.push(params.design);
        if (params.test) parts.push(`using a ${params.test}`);
        if (params.alpha) parts.push(`with a two-sided significance level of ${params.alpha}`);
        if (params.power) parts.push(`${(params.power * 100).toFixed(0)}% power`);
        if (params.effect) parts.push(`to detect ${params.effect}`);
        if (params.n) parts.push(`A total of ${params.n} participants are required`);
        if (params.dropoutAdjusted) parts.push(`(${params.dropoutAdjusted} after adjusting for ${params.dropoutRate}% dropout)`);
        return parts.join(', ') + '.';
    }

    function formatGrantJustification(params) {
        let text = `Sample size calculation: We will enroll ${params.n} participants `;
        text += `(${params.nPerGroup} per group${params.ratio !== 1 ? `, allocation ratio ${params.ratio}:1` : ''}) `;
        text += `to achieve ${(params.power * 100).toFixed(0)}% power to detect `;

        if (params.designType === 'proportions') {
            text += `an absolute difference of ${((params.p1 - params.p2) * 100).toFixed(1)} percentage points `;
            text += `(from ${(params.p1 * 100).toFixed(1)}% in the control group to ${(params.p2 * 100).toFixed(1)}% in the treatment group) `;
        } else if (params.designType === 'survival') {
            text += `a hazard ratio of ${params.hr} `;
        } else if (params.designType === 'means') {
            text += `a difference of ${params.delta} (SD = ${params.sd}) `;
        } else if (params.designType === 'ordinal') {
            text += `a common odds ratio of ${params.commonOR} on the modified Rankin Scale `;
        }

        text += `using a ${params.test || 'two-sided test'} at the ${params.alpha} significance level. `;

        if (params.dropoutRate) {
            text += `Accounting for ${params.dropoutRate}% dropout, we plan to enroll ${params.dropoutAdjusted} participants. `;
        }

        if (params.justification) {
            text += params.justification + ' ';
        }

        text += `Sample size was calculated using [software/formula reference].`;

        return text;
    }

    function formatResultsText(params) {
        let text = '';
        if (params.measure === 'OR') {
            text = `The odds ratio was ${params.estimate.toFixed(2)} (95% CI, ${params.ci.lower.toFixed(2)} to ${params.ci.upper.toFixed(2)}`;
            if (params.pValue !== undefined) text += `; P ${Statistics.formatPValue(params.pValue)}`;
            text += ').';
        } else if (params.measure === 'RR') {
            text = `The relative risk was ${params.estimate.toFixed(2)} (95% CI, ${params.ci.lower.toFixed(2)} to ${params.ci.upper.toFixed(2)}`;
            if (params.pValue !== undefined) text += `; P ${Statistics.formatPValue(params.pValue)}`;
            text += ').';
        } else if (params.measure === 'HR') {
            text = `The hazard ratio was ${params.estimate.toFixed(2)} (95% CI, ${params.ci.lower.toFixed(2)} to ${params.ci.upper.toFixed(2)}`;
            if (params.pValue !== undefined) text += `; P ${Statistics.formatPValue(params.pValue)}`;
            text += ').';
        } else if (params.measure === 'NNT') {
            text = `The number needed to treat was ${Math.round(params.estimate)} (95% CI, ${Math.round(params.ci.lower)} to ${params.ci.upper === Infinity ? '∞' : Math.round(params.ci.upper)}).`;
        }
        return text;
    }

    function formatMetaAnalysisText(params) {
        let text = `We performed a ${params.model} meta-analysis of ${params.k} studies. `;
        const expEst = params.logScale ? `${Math.exp(params.pooled).toFixed(2)}` : `${params.pooled.toFixed(2)}`;
        const expLower = params.logScale ? `${Math.exp(params.ci.lower).toFixed(2)}` : `${params.ci.lower.toFixed(2)}`;
        const expUpper = params.logScale ? `${Math.exp(params.ci.upper).toFixed(2)}` : `${params.ci.upper.toFixed(2)}`;
        text += `The pooled ${params.measureLabel || 'effect estimate'} was ${expEst} (95% CI, ${expLower} to ${expUpper}; P ${Statistics.formatPValue(params.pValue)}). `;
        text += `Heterogeneity was ${params.I2 < 25 ? 'low' : params.I2 < 50 ? 'moderate' : params.I2 < 75 ? 'substantial' : 'considerable'} `;
        text += `(I² = ${params.I2.toFixed(1)}%; Q = ${params.Q.toFixed(1)}, P ${Statistics.formatPValue(params.pHet)}; τ² = ${params.tau2.toFixed(3)}). `;

        if (params.eggerP !== undefined) {
            text += `Egger's test for funnel plot asymmetry was ${params.eggerP < 0.05 ? '' : 'not '}statistically significant (P ${Statistics.formatPValue(params.eggerP)}). `;
        }

        return text;
    }

    // ============================================================
    // LOCAL STORAGE PERSISTENCE
    // ============================================================

    const STORAGE_PREFIX = 'neuroepi_';

    function saveState(key, data) {
        try {
            localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save state:', e);
        }
    }

    function loadState(key) {
        try {
            const data = localStorage.getItem(STORAGE_PREFIX + key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('Failed to load state:', e);
            return null;
        }
    }

    function removeState(key) {
        localStorage.removeItem(STORAGE_PREFIX + key);
    }

    function listSavedCalculations() {
        const calcs = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(STORAGE_PREFIX + 'saved_')) {
                const data = JSON.parse(localStorage.getItem(key));
                calcs.push({ key: key.replace(STORAGE_PREFIX, ''), ...data });
            }
        }
        return calcs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }

    function saveCalculation(name, moduleId, data) {
        const key = `saved_${Date.now()}`;
        saveState(key, { name, moduleId, data, timestamp: Date.now() });
        showToast(`Saved: ${name}`);
        return key;
    }

    // ============================================================
    // COPY RESULT PANEL
    // ============================================================

    function copyResultPanel(panelId) {
        var panel = document.getElementById(panelId);
        if (!panel) {
            showToast('Panel not found', 'error');
            return;
        }
        var lines = [];
        var labels = panel.querySelectorAll('.result-label');
        var values = panel.querySelectorAll('.result-value');
        var details = panel.querySelectorAll('.result-detail');

        labels.forEach(function(label, i) {
            var line = label.textContent.trim();
            if (values[i]) {
                line += ': ' + values[i].textContent.trim();
            }
            lines.push(line);
        });
        // Append any remaining values not paired with labels
        if (values.length > labels.length) {
            for (var i = labels.length; i < values.length; i++) {
                lines.push(values[i].textContent.trim());
            }
        }
        details.forEach(function(detail) {
            lines.push(detail.textContent.trim());
        });

        var text = lines.filter(function(l) { return l.length > 0; }).join('\n');
        if (!text) {
            showToast('No results to copy', 'error');
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
            showToast('Results copied');
        }).catch(function() {
            // Fallback
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast('Results copied');
        });
    }

    // ============================================================
    // INTERPRET VALUE HELPER
    // ============================================================

    function interpretValue(type, value) {
        switch (type) {
            case 'p-value':
                if (value < 0.001) return 'Highly significant';
                if (value < 0.05) return 'Statistically significant';
                if (value < 0.1) return 'Marginally significant (trend)';
                return 'Not statistically significant';

            case 'rr':
            case 'or':
                if (Math.abs(value - 1) < 0.001) return 'No association';
                if (value > 1) return 'Increased risk';
                return 'Decreased risk (protective)';

            case 'nnt':
                if (value < 10) return 'Strong treatment effect';
                if (value <= 50) return 'Moderate treatment effect';
                return 'Weak treatment effect';

            case 'power':
                if (value >= 0.8) return 'Adequate power';
                if (value >= 0.5) return 'Underpowered';
                return 'Severely underpowered';

            case 'ci-width':
                if (value && typeof value === 'object' && value.point !== undefined) {
                    var width = (value.upper - value.lower) / value.point;
                    if (width < 0.5) return 'Precise';
                    if (width < 1) return 'Moderate precision';
                    return 'Imprecise';
                }
                return 'Invalid input';

            default:
                return 'Unknown type';
        }
    }

    // ============================================================
    // RECENT HISTORY
    // ============================================================

    function addToHistory(moduleId, params, result) {
        const history = loadState('history') || [];
        history.unshift({
            moduleId,
            params: JSON.parse(JSON.stringify(params)),
            result: typeof result === 'string' ? result : JSON.stringify(result).substring(0, 200),
            timestamp: Date.now()
        });
        // Keep last 50
        if (history.length > 50) history.length = 50;
        saveState('history', history);
    }

    function getHistory() {
        return loadState('history') || [];
    }

    // ============================================================
    // PUBLIC API
    // ============================================================

    return {
        copyText,
        copyTSV,
        showToast,
        exportCanvasPNG,
        formatMethodsText,
        formatGrantJustification,
        formatResultsText,
        formatMetaAnalysisText,
        saveState,
        loadState,
        removeState,
        listSavedCalculations,
        saveCalculation,
        addToHistory,
        getHistory,
        copyResultPanel,
        interpretValue
    };
})();

if (typeof module !== 'undefined') module.exports = Export;
