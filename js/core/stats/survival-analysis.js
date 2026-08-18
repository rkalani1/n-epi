(function(global) {
    const S = global.Statistics = global.Statistics || {};
    Object.assign(S, (function() {
        'use strict';

        const { chiSquaredCDF, normalQuantile } = S;

        function kaplanMeier(times, events, group) {
            // Sort by time
            const data = times.map((t, i) => ({ time: t, event: events[i], group: group ? group[i] : 0 }))
                .sort((a, b) => a.time - b.time);

            const groups = group ? [...new Set(group)] : [0];
            const results = {};

            groups.forEach(g => {
                const gData = data.filter(d => d.group === g);
                const n = gData.length;
                let nRisk = n;
                const table = [{ time: 0, nRisk: n, events: 0, censored: 0, survival: 1, se: 0, ciLower: 1, ciUpper: 1 }];
                let survival = 1;
                let greenwood = 0;

                let i = 0;
                while (i < gData.length) {
                    const t = gData[i].time;
                    let nEvents = 0;
                    let nCensored = 0;

                    while (i < gData.length && gData[i].time === t) {
                        if (gData[i].event === 1) nEvents++;
                        else if (gData[i].event === 0) nCensored++;
                        i++;
                    }

                    if (nEvents > 0) {
                        survival *= (1 - nEvents / nRisk);
                        // Skip the Greenwood term when everyone at risk has an event
                        // (nRisk === nEvents): the term is undefined (÷0) and survival
                        // becomes 0, so its variance is taken as 0.
                        if (nRisk > nEvents) {
                            greenwood += nEvents / (nRisk * (nRisk - nEvents));
                        }
                    }

                    // Guard the 0 * Infinity case so SE is 0 (not NaN) once S(t) = 0.
                    const se = survival > 0 ? survival * Math.sqrt(greenwood) : 0;
                    // Log-log CI
                    let ciLower, ciUpper;
                    if (survival > 0 && survival < 1) {
                        const loglog = Math.log(-Math.log(survival));
                        const seLogLog = Math.sqrt(greenwood) / Math.abs(Math.log(survival));
                        const z = normalQuantile(0.975);
                        ciLower = Math.exp(-Math.exp(loglog + z * seLogLog));
                        ciUpper = Math.exp(-Math.exp(loglog - z * seLogLog));
                    } else {
                        ciLower = survival;
                        ciUpper = survival;
                    }

                    table.push({ time: t, nRisk, events: nEvents, censored: nCensored, survival, se, ciLower, ciUpper });
                    nRisk -= (nEvents + nCensored);
                }

                // Median survival
                let median = null, medianCI = null;
                for (let i = 1; i < table.length; i++) {
                    if (table[i].survival <= 0.5) {
                        median = table[i].time;
                        break;
                    }
                }
                // Brookmeyer-Crowley CI for median
                if (median !== null) {
                    const z = normalQuantile(0.975);
                    let medianLower = null, medianUpper = null;
                    for (let i = 1; i < table.length; i++) {
                        if (table[i].survival <= 0.5 + z * table[i].se && medianLower === null) {
                            medianLower = table[i].time;
                        }
                        if (table[i].survival <= 0.5 - z * table[i].se && medianUpper === null) {
                            medianUpper = table[i].time;
                        }
                    }
                    medianCI = { lower: medianLower, upper: medianUpper };
                }

                results[g] = { table, median, medianCI, n };
            });

            return results;
        }

        // Log-rank (Mantel-Cox) test
        function logRankTest(times, events, groups) {
            const uniqueGroups = [...new Set(groups)];
            if (uniqueGroups.length !== 2) return null;

            const allTimes = [...new Set(times.filter((t, i) => events[i] === 1))].sort((a, b) => a - b);

            let O1 = 0, E1 = 0, V = 0;

            const groupStats = uniqueGroups.map(g => {
                const data = [];
                for (let i = 0; i < times.length; i++) {
                    if (groups[i] === g) {
                        data.push({ t: times[i], e: events[i] });
                    }
                }
                data.sort((a, b) => a.t - b.t);
                return data;
            });

            const groupPointers = [0, 0];
            const currentAtRisk = [groupStats[0].length, groupStats[1].length];

            allTimes.forEach(t => {
                const nRisk = [0, 0];
                const nEvents = [0, 0];

                for (let gIndex = 0; gIndex < 2; gIndex++) {
                    let p = groupPointers[gIndex];
                    const data = groupStats[gIndex];

                    while (p < data.length && data[p].t < t) {
                        p++;
                        currentAtRisk[gIndex]--;
                    }
                    groupPointers[gIndex] = p;

                    nRisk[gIndex] = currentAtRisk[gIndex];

                    let died = 0;
                    let tempP = p;
                    while (tempP < data.length && data[tempP].t === t) {
                        if (data[tempP].e === 1) {
                            died++;
                        }
                        tempP++;
                    }
                    nEvents[gIndex] = died;
                }

                const totalRisk = nRisk[0] + nRisk[1];
                const totalEvents = nEvents[0] + nEvents[1];

                if (totalRisk > 0) {
                    const e1 = nRisk[0] * totalEvents / totalRisk;
                    O1 += nEvents[0];
                    E1 += e1;
                    if (totalRisk > 1) {
                        V += nRisk[0] * nRisk[1] * totalEvents * (totalRisk - totalEvents) / (totalRisk * totalRisk * (totalRisk - 1));
                    }
                }
            });

            const chi2 = Math.pow(O1 - E1, 2) / V;
            const pValue = 1 - chiSquaredCDF(chi2, 1);

            // HR from O-E method
            const hr = Math.exp((O1 - E1) / V);
            const seLnHR = 1 / Math.sqrt(V);
            const z = normalQuantile(0.975);
            const hrCI = {
                lower: Math.exp(Math.log(hr) - z * seLnHR),
                upper: Math.exp(Math.log(hr) + z * seLnHR)
            };

            return { chi2, pValue, O1, E1, V, hr, hrCI, seLnHR };
        }

        return {
            kaplanMeier,
            logRankTest,
        };
    })());
})(typeof window !== 'undefined' ? window : global);
