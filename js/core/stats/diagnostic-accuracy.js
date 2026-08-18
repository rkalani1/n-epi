(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        const { normalQuantile, wilsonCI } = S;

        function diagnosticAccuracy(tp, fp, fn, tn) {
            const n = tp + fp + fn + tn;
            const sens = tp / (tp + fn);
            const spec = tn / (tn + fp);
            const ppv = tp / (tp + fp);
            const npv = tn / (tn + fn);
            const plr = sens / (1 - spec);
            const nlr = (1 - sens) / spec;
            const dor = (tp * tn) / (fp * fn);
            const accuracy = (tp + tn) / n;
            const prevalence = (tp + fn) / n;
            const youdenJ = sens + spec - 1;

            const ciSens = wilsonCI(sens, tp + fn);
            const ciSpec = wilsonCI(spec, tn + fp);
            const ciPPV = wilsonCI(ppv, tp + fp);
            const ciNPV = wilsonCI(npv, tn + fn);

            return {
                sensitivity: { value: sens, ci: ciSens },
                specificity: { value: spec, ci: ciSpec },
                ppv: { value: ppv, ci: ciPPV },
                npv: { value: npv, ci: ciNPV },
                plr, nlr, dor, accuracy, prevalence, youdenJ
            };
        }

        // Fagan nomogram calculations
        function faganNomogram(preTestProb, plr, nlr) {
            const preTestOdds = preTestProb / (1 - preTestProb);
            const postTestOddsPos = preTestOdds * plr;
            const postTestOddsNeg = preTestOdds * nlr;
            const postTestProbPos = postTestOddsPos / (1 + postTestOddsPos);
            const postTestProbNeg = postTestOddsNeg / (1 + postTestOddsNeg);

            return { preTestProb, postTestProbPos, postTestProbNeg, preTestOdds, postTestOddsPos, postTestOddsNeg };
        }

        // AUC by the trapezoidal rule over the ROC points.
        // The (0,0) and (1,1) endpoints are always included so the estimate spans
        // the full [0,1] FPR range and matches the plotted curve; omitting them
        // badly under-estimates the AUC when only interior thresholds are supplied.
        // The Hanley-McNeil SE/CI need the number of diseased (nPos) and
        // non-diseased (nNeg) SUBJECTS — not the number of ROC points. When those
        // counts are unavailable no valid interval exists, so ci/se are returned null.
        function aucTrapezoidal(sensitivities, specificities, nPos, nNeg) {
            const len = Math.min(sensitivities.length, specificities.length);
            const points = [{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }];
            for (let i = 0; i < len; i++) {
                points.push({ fpr: 1 - specificities[i], tpr: sensitivities[i] });
            }
            points.sort((a, b) => (a.fpr - b.fpr) || (a.tpr - b.tpr));

            let auc = 0;
            for (let i = 1; i < points.length; i++) {
                auc += (points[i].fpr - points[i - 1].fpr) * (points[i].tpr + points[i - 1].tpr) / 2;
            }

            // Hanley-McNeil SE requires real case counts, not the number of points.
            if (!(nPos > 0 && nNeg > 0)) {
                return { auc, se: null, ci: null };
            }
            const Q1 = auc / (2 - auc);
            const Q2 = 2 * auc * auc / (1 + auc);
            const se = Math.sqrt((auc * (1 - auc) + (nPos - 1) * (Q1 - auc * auc) +
                (nNeg - 1) * (Q2 - auc * auc)) / (nPos * nNeg));
            const z = normalQuantile(0.975);

            return { auc, se, ci: { lower: Math.max(0, auc - z * se), upper: Math.min(1, auc + z * se) } };
        }

        return {
            aucTrapezoidal,
            diagnosticAccuracy,
            faganNomogram,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
