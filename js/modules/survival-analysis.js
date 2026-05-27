/**
 * Neuro-Epi — Survival Analysis Module
 * Kaplan-Meier estimator, log-rank test, hazard ratio, KM plot,
 * multi-group overlay, survival tables, results text generation,
 * number at risk table, median survival with CI, RMST,
 * landmark analysis, competing risks info, spreadsheet paste support.
 */
(function() {
    'use strict';

    var MODULE_ID = 'survival-analysis';

    // ============================================================
    // STATE
    // ============================================================
    var survivalData = [];
    var lastResults = null;

    // ============================================================
    // EXAMPLE DATA
    // ============================================================
    var STROKE_EXAMPLE = [
        { time:  2, event: 1, group: 'EVT' },
        { time:  5, event: 1, group: 'EVT' },
        { time:  8, event: 0, group: 'EVT' },
        { time: 12, event: 1, group: 'EVT' },
        { time: 15, event: 0, group: 'EVT' },
        { time: 18, event: 1, group: 'EVT' },
        { time: 22, event: 0, group: 'EVT' },
        { time: 28, event: 1, group: 'EVT' },
        { time: 30, event: 0, group: 'EVT' },
        { time: 35, event: 0, group: 'EVT' },
        { time: 40, event: 1, group: 'EVT' },
        { time: 48, event: 0, group: 'EVT' },
        { time: 52, event: 0, group: 'EVT' },
        { time: 60, event: 0, group: 'EVT' },
        { time: 72, event: 0, group: 'EVT' },
        { time:  1, event: 1, group: 'Medical' },
        { time:  3, event: 1, group: 'Medical' },
        { time:  6, event: 1, group: 'Medical' },
        { time:  9, event: 1, group: 'Medical' },
        { time: 10, event: 0, group: 'Medical' },
        { time: 14, event: 1, group: 'Medical' },
        { time: 16, event: 1, group: 'Medical' },
        { time: 20, event: 0, group: 'Medical' },
        { time: 24, event: 1, group: 'Medical' },
        { time: 26, event: 1, group: 'Medical' },
        { time: 30, event: 0, group: 'Medical' },
        { time: 33, event: 1, group: 'Medical' },
        { time: 38, event: 0, group: 'Medical' },
        { time: 45, event: 1, group: 'Medical' },
        { time: 55, event: 0, group: 'Medical' }
    ];

    // ============================================================
    // RENDER
    // ============================================================
    function render(container) {
        var html = App.createModuleLayout(
            'Survival Analysis',
            'Kaplan-Meier survival estimation with log-rank testing, hazard ratio calculation, number at risk table, median survival with CI, RMST, and landmark analysis. Supports multi-group comparisons and spreadsheet paste.'
        );

        html += '<div class="card">';

        // Action buttons
        html += '<div class="btn-group">'
            + '<button class="btn btn-secondary" onclick="SurvivalModule.loadExample()">Load Clinical Example</button>'
            + '<button class="btn btn-secondary" onclick="SurvivalModule.pasteCSV()">Paste CSV</button>'
            + '<button class="btn btn-secondary" onclick="SurvivalModule.pasteSpreadsheet()">Paste Spreadsheet (Tab-separated)</button>'
            + '<button class="btn btn-secondary" onclick="SurvivalModule.addRow()">+ Add Row</button>'
            + '<button class="btn btn-secondary" onclick="SurvivalModule.clearData()">Clear All</button>'
            + '</div>';

        // Landmark analysis option
        html += '<div class="form-row form-row--3 mt-2">'
            + '<div class="form-group"><label class="form-label">Landmark Time (optional) ' + App.tooltip('Analyze only from this timepoint forward. Subjects who had events before the landmark are excluded.') + '</label>'
            + '<input type="number" class="form-input" id="sa-landmark" step="any" min="0" value="" placeholder="Leave blank for standard analysis"></div>'
            + '<div class="form-group"><label class="form-label">RMST Truncation Time ' + App.tooltip('Time point at which to truncate the RMST calculation. Defaults to minimum of max follow-up across groups.') + '</label>'
            + '<input type="number" class="form-input" id="sa-rmst-tau" step="any" min="0" value="" placeholder="Auto (min max time)"></div>'
            + '<div class="form-group" style="display:flex;align-items:flex-end;">'
            + '<button class="btn btn-primary" onclick="SurvivalModule.runAnalysis()">Analyze</button></div>'
            + '</div>';

        // Data table
        html += '<div id="sa-data-table" class="mt-2"></div>';

        // Results
        html += '<div id="sa-results"></div>';
        html += '</div>';

        // ===== COMPETING RISKS INFO PANEL =====
        html += '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Competing Risks: When Standard KM Is Not Enough</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';
        html += '<div class="card-subtitle" style="font-weight:600;">What Are Competing Risks?</div>';
        html += '<p>A competing risk is an event that precludes the occurrence of the primary outcome. For example, '
            + 'when studying time to stroke recurrence, death from cardiac causes is a competing risk.</p>';
        html += '<div class="card-subtitle" style="font-weight:600;">Why Standard KM Overestimates</div>';
        html += '<p>Standard Kaplan-Meier analysis treats competing events as censored observations, which violates the '
            + 'non-informative censoring assumption and leads to <strong>overestimation of cumulative incidence</strong>.</p>';
        html += '<div class="card-subtitle" style="font-weight:600;">Recommended Approaches</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Cumulative Incidence Function (CIF):</strong> Aalen-Johansen estimator accounts for competing events</li>'
            + '<li><strong>Fine-Gray model:</strong> Subdistribution hazard regression for CIF modeling</li>'
            + '<li><strong>Cause-specific hazard:</strong> Standard Cox model applied to each event type separately</li>'
            + '</ul>';
        html += '<div class="card-subtitle" style="font-weight:600;">Software</div>';
        html += '<div style="background:var(--bg-secondary);padding:12px;border-radius:8px;font-family:var(--font-mono);margin-bottom:12px;">'
            + '<div><strong>R:</strong> <code>cmprsk::cuminc()</code>, <code>tidycmprsk::cuminc()</code>, <code>survival::finegray()</code></div>'
            + '<div><strong>SAS:</strong> <code>PROC PHREG</code> with <code>EVENTCODE</code> option</div>'
            + '<div><strong>Stata:</strong> <code>stcrreg</code>, <code>stcurve</code></div>'
            + '</div>';
        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;">'
            + '<li>Austin PC, et al. Introduction to the analysis of survival data in the presence of competing risks. <em>Circulation</em>. 2016;133:601-9.</li>'
            + '<li>Fine JP, Gray RJ. A proportional hazards model for the subdistribution of a competing risk. <em>JASA</em>. 1999;94:496-509.</li>'
            + '</ul>';
        html += '</div></div>';

        // ===== LEARN SECTION =====
        html += '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Learn: Survival Analysis Essentials</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';

        html += '<div class="card-subtitle" style="font-weight:600;">Key Formulas</div>';
        html += '<div style="background:var(--bg-secondary);padding:12px;border-radius:8px;font-family:var(--font-mono);margin-bottom:12px;">'
            + '<div><strong>Kaplan-Meier:</strong> S(t) = \u220F (1 \u2212 d\u1D62/n\u1D62) for each event time</div>'
            + '<div><strong>Greenwood SE:</strong> SE[S(t)] = S(t) \u00D7 \u221A(\u03A3 d\u1D62/(n\u1D62(n\u1D62\u2212d\u1D62)))</div>'
            + '<div><strong>Log-Rank Test:</strong> \u03C7\u00B2 = \u03A3(O\u1D62\u2212E\u1D62)\u00B2/E\u1D62, df = groups \u2212 1</div>'
            + '<div><strong>Median Survival:</strong> Smallest t where S(t) \u2264 0.50</div>'
            + '<div><strong>RMST:</strong> \u222B\u2080\u1D40 S(t)dt (area under the KM curve up to time \u03C4)</div>'
            + '<div><strong>Hazard Ratio:</strong> HR = h\u2081(t)/h\u2082(t), estimated from Cox model</div>'
            + '</div>';

        html += '<div class="card-subtitle" style="font-weight:600;">Assumptions</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li>Non-informative censoring (censored subjects have same prognosis as uncensored)</li>'
            + '<li>Kaplan-Meier: no covariates, purely time-based estimation</li>'
            + '<li>Log-rank test: proportional hazards (constant HR over time)</li>'
            + '<li>Cox PH model: hazards proportional, log-linearity, no time-varying coefficients</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">Common Pitfalls</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Late crossing of KM curves:</strong> May indicate non-proportional hazards; consider RMST</li>'
            + '<li><strong>Ignoring competing risks:</strong> Standard KM overestimates cumulative incidence; use Fine-Gray model</li>'
            + '<li><strong>Median not reached:</strong> When <50% of subjects have events, report milestone rates instead</li>'
            + '<li><strong>Landmark bias:</strong> Conditioning on survival to a specific time introduces bias if not handled properly</li>'
            + '</ul>';

        html += '<div class="card-subtitle" style="font-weight:600;">References</div>';
        html += '<ul style="margin:0 0 0 16px;font-size:0.85rem;">'
            + '<li>Collett D. <em>Modelling Survival Data in Medical Research</em>. 4th ed. CRC Press; 2023.</li>'
            + '<li>Bland JM, Altman DG. Survival probabilities (the Kaplan-Meier method). <em>BMJ</em>. 1998;317:1572.</li>'
            + '<li>Royston P, Parmar MK. Restricted mean survival time. <em>BMC Med Res Methodol</em>. 2013;13:152.</li>'
            + '</ul>';
        html += '</div></div>';

        App.setTrustedHTML(container, html);
        renderDataTable();
    }

    // ============================================================
    // DATA TABLE
    // ============================================================
    function renderDataTable() {
        var el = document.getElementById('sa-data-table');
        if (!el) return;

        var html = '<div class="table-scroll-wrap"><table class="data-table"><thead><tr>'
            + '<th>#</th>'
            + '<th>Time ' + App.tooltip('Follow-up time (any unit: days, months, years)') + '</th>'
            + '<th>Event ' + App.tooltip('1 = event occurred, 0 = censored') + '</th>'
            + '<th>Group (optional) ' + App.tooltip('Leave blank for single-group analysis, or enter group name for comparison') + '</th>'
            + '<th></th>'
            + '</tr></thead><tbody>';

        survivalData.forEach(function(s, i) {
            html += '<tr>'
                + '<td>' + (i + 1) + '</td>'
                + '<td><input type="number" class="form-input form-input--small" step="any" min="0" value="' + nvl(s.time) + '" onchange="SurvivalModule.updateField(' + i + ',\'time\',this.value)"></td>'
                + '<td><select class="form-select form-input--small" onchange="SurvivalModule.updateField(' + i + ',\'event\',this.value)">'
                + '<option value="1"' + (s.event === 1 ? ' selected' : '') + '>1 (Event)</option>'
                + '<option value="0"' + (s.event === 0 ? ' selected' : '') + '>0 (Censored)</option>'
                + '</select></td>'
                + '<td><input type="text" class="form-input form-input--small" value="' + escAttr(s.group) + '" onchange="SurvivalModule.updateField(' + i + ',\'group\',this.value)"></td>'
                + '<td><button class="btn btn-xs btn-danger" onclick="SurvivalModule.removeRow(' + i + ')">x</button></td>'
                + '</tr>';
        });
        html += '</tbody></table></div>';

        if (survivalData.length > 0) {
            var nEvents = survivalData.filter(function(s) { return s.event === 1; }).length;
            var nCensored = survivalData.length - nEvents;
            var groups = getUniqueGroups();
            html += '<div class="text-secondary" style="font-size:0.85rem;margin-top:4px;">'
                + survivalData.length + ' observations: ' + nEvents + ' events, ' + nCensored + ' censored'
                + (groups.length > 1 ? ' | Groups: ' + groups.join(', ') : '')
                + '</div>';
        }

        App.setTrustedHTML(el, html);
    }

    function escAttr(s) { return (s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
    function nvl(v) { return v !== undefined && v !== null && v !== '' ? v : ''; }

    function getUniqueGroups() {
        var set = {};
        survivalData.forEach(function(s) {
            if (s.group && s.group.trim()) set[s.group.trim()] = true;
        });
        return Object.keys(set);
    }

    // ============================================================
    // TABLE MANAGEMENT
    // ============================================================
    function addRow() {
        survivalData.push({ time: '', event: 1, group: '' });
        renderDataTable();
    }

    function removeRow(i) {
        survivalData.splice(i, 1);
        renderDataTable();
    }

    function updateField(i, field, value) {
        if (field === 'time') {
            survivalData[i].time = value === '' ? '' : parseFloat(value);
        } else if (field === 'event') {
            survivalData[i].event = parseInt(value);
        } else {
            survivalData[i][field] = value;
        }
    }

    function clearData() {
        survivalData = [];
        renderDataTable();
        var resEl = document.getElementById('sa-results');
        if (resEl) App.setTrustedHTML(resEl, '');
    }

    // ============================================================
    // LOAD EXAMPLE
    // ============================================================
    function loadExample() {
        survivalData = STROKE_EXAMPLE.map(function(d) {
            return { time: d.time, event: d.event, group: d.group };
        });
        renderDataTable();
        Export.showToast('Loaded clinical survival example (30 observations, 2 groups)');
    }

    // ============================================================
    // PASTE CSV
    // ============================================================
    function pasteCSV() {
        navigator.clipboard.readText().then(function(text) {
            parseCSVData(text);
        }).catch(function() {
            Export.showToast('Unable to read clipboard', 'error');
        });
    }

    // Paste from spreadsheet (tab-separated)
    function pasteSpreadsheet() {
        navigator.clipboard.readText().then(function(text) {
            parseCSVData(text);
        }).catch(function() {
            Export.showToast('Unable to read clipboard. Copy data from spreadsheet first (Time, Event, Group columns).', 'error');
        });
    }

    function parseCSVData(text) {
        var lines = text.trim().split('\n');
        if (lines.length < 1) return;

        var delimiter = lines[0].indexOf('\t') >= 0 ? '\t' : ',';
        var startIdx = 0;
        var firstCols = lines[0].split(delimiter);
        if (firstCols.length >= 2 && isNaN(parseFloat(firstCols[0]))) {
            startIdx = 1;
        }

        survivalData = [];
        for (var i = startIdx; i < lines.length; i++) {
            var cols = lines[i].split(delimiter).map(function(c) { return c.trim(); });
            if (cols.length < 2) continue;
            survivalData.push({
                time: parseFloat(cols[0]) || 0,
                event: parseInt(cols[1]) || 0,
                group: cols.length > 2 ? cols[2] : ''
            });
        }
        renderDataTable();
        Export.showToast('Parsed ' + survivalData.length + ' observations');
    }

    // ============================================================
    // RMST CALCULATION
    // ============================================================
    function computeRMST(table, tau) {
        // RMST = area under KM curve from 0 to tau
        // table: [{time, survival, se, ...}] sorted by time
        if (!table || table.length < 2) return { rmst: 0, se: 0 };

        var rmst = 0;
        var variance = 0;
        var prevTime = 0;
        var prevSurv = 1;

        for (var i = 1; i < table.length; i++) {
            var t = table[i].time;
            if (t > tau) {
                // Add area from prevTime to tau at the previous survival level
                rmst += prevSurv * (tau - prevTime);
                break;
            }
            // Area of rectangle from prevTime to t at prevSurv
            rmst += prevSurv * (t - prevTime);
            prevTime = t;
            prevSurv = table[i].survival;

            if (i === table.length - 1 && t <= tau) {
                // Last time point is before tau, extend
                rmst += prevSurv * (tau - t);
            }
        }

        // SE approximation using Greenwood-type variance
        // Var(RMST) ≈ sum over event times of (integral from t_j to tau of S(u)du)^2 * d_j/(n_j*(n_j-d_j))
        var tailAreas = [];
        for (var i = 1; i < table.length; i++) {
            if (table[i].time > tau) break;
            if (table[i].events > 0) {
                // Area from this time to tau
                var area = 0;
                var ti = table[i].time;
                var si = table[i].survival;
                for (var j = i + 1; j < table.length; j++) {
                    var tj = Math.min(table[j].time, tau);
                    area += si * (tj - ti);
                    ti = tj;
                    si = table[j].survival;
                    if (table[j].time >= tau) break;
                }
                if (ti < tau) {
                    area += si * (tau - ti);
                }
                var dj = table[i].events;
                var nj = table[i].nRisk;
                if (nj > dj && nj > 0) {
                    variance += area * area * dj / (nj * (nj - dj));
                }
            }
        }

        return { rmst: rmst, se: Math.sqrt(variance) };
    }

    // ============================================================
    // RUN ANALYSIS
    // ============================================================
    function runAnalysis() {
        // Check for landmark
        var landmarkEl = document.getElementById('sa-landmark');
        var landmarkTime = landmarkEl && landmarkEl.value !== '' ? parseFloat(landmarkEl.value) : null;

        // Filter data
        var workingData = survivalData.filter(function(s) {
            return s.time !== '' && !isNaN(s.time) && s.time >= 0;
        });

        // Apply landmark analysis
        if (landmarkTime !== null && !isNaN(landmarkTime) && landmarkTime > 0) {
            // Exclude subjects who had events before the landmark
            workingData = workingData.filter(function(s) {
                if (s.event === 1 && s.time < landmarkTime) return false; // event before landmark: exclude
                return s.time >= landmarkTime; // keep only those still at risk at landmark
            });
            // Adjust times to be relative to landmark
            workingData = workingData.map(function(s) {
                return { time: s.time - landmarkTime, event: s.event, group: s.group || '' };
            });
        }

        if (workingData.length < 2) {
            Export.showToast('Need at least 2 observations with valid time' + (landmarkTime ? ' after landmark' : ''), 'error');
            return;
        }

        var times = workingData.map(function(s) { return s.time; });
        var events = workingData.map(function(s) { return s.event; });
        var groups = getUniqueGroupsFrom(workingData);
        var hasGroups = groups.length > 1;
        var groupArr = hasGroups ? workingData.map(function(s) { return s.group || groups[0]; }) : null;

        // KM analysis
        var km = Statistics.kaplanMeier(times, events, groupArr);

        // Log-rank test (if 2 groups)
        var logRank = null;
        if (hasGroups && groups.length === 2) {
            logRank = Statistics.logRankTest(times, events, groupArr);
        }

        // RMST
        var rmstTauEl = document.getElementById('sa-rmst-tau');
        var rmstTau = rmstTauEl && rmstTauEl.value !== '' ? parseFloat(rmstTauEl.value) : null;
        if (rmstTau === null || isNaN(rmstTau)) {
            // Default: minimum of max time across groups
            var groupKeys = Object.keys(km);
            var maxTimes = groupKeys.map(function(gKey) {
                var t = km[gKey].table;
                return t[t.length - 1].time;
            });
            rmstTau = Math.min.apply(null, maxTimes);
        }

        var rmstResults = {};
        var groupKeysAll = Object.keys(km);
        groupKeysAll.forEach(function(gKey) {
            rmstResults[gKey] = computeRMST(km[gKey].table, rmstTau);
        });

        lastResults = { km: km, logRank: logRank, groups: groups, hasGroups: hasGroups, validData: workingData, rmstResults: rmstResults, rmstTau: rmstTau, landmarkTime: landmarkTime };

        // Build results HTML
        var resultEl = document.getElementById('sa-results');
        var html = '<div class="result-panel animate-in mt-3">';

        // Landmark notice
        if (landmarkTime !== null && !isNaN(landmarkTime) && landmarkTime > 0) {
            html += '<div style="background:var(--accent-muted);padding:8px 12px;border-radius:6px;margin-bottom:12px;font-size:0.9rem;">'
                + '<strong>Landmark Analysis:</strong> Analysis starts at time ' + landmarkTime.toFixed(1) + '. '
                + 'Subjects with events before the landmark are excluded. '
                + workingData.length + ' subjects included.'
                + '</div>';
        }

        // Summary
        html += '<div class="card-title">Kaplan-Meier Analysis</div>';

        var groupKeys = Object.keys(km);

        // Summary metrics with median survival and CI
        html += '<div class="result-grid">';
        groupKeys.forEach(function(gKey) {
            var gData = km[gKey];
            var label = hasGroups ? gKey : 'Overall';
            html += '<div class="result-item"><div class="result-item-value">' + gData.n + '</div>'
                + '<div class="result-item-label">' + label + ' N</div></div>';

            var nEvts = 0;
            gData.table.forEach(function(r) { nEvts += r.events; });
            html += '<div class="result-item"><div class="result-item-value">' + nEvts + '</div>'
                + '<div class="result-item-label">' + label + ' Events</div></div>';

            if (gData.median !== null) {
                var medStr = gData.median.toFixed(1);
                if (gData.medianCI && gData.medianCI.lower !== null && gData.medianCI.upper !== null) {
                    medStr += ' [' + gData.medianCI.lower.toFixed(1) + ', '
                        + (gData.medianCI.upper !== null ? gData.medianCI.upper.toFixed(1) : 'NR') + ']';
                }
                html += '<div class="result-item"><div class="result-item-value">' + medStr + '</div>'
                    + '<div class="result-item-label">' + label + ' Median Survival (95% CI)</div></div>';
            } else {
                html += '<div class="result-item"><div class="result-item-value">NR</div>'
                    + '<div class="result-item-label">' + label + ' Median Survival</div></div>';
            }
        });
        html += '</div>';

        // RMST Section
        html += '<div class="card-title mt-3">Restricted Mean Survival Time (RMST)</div>';
        html += '<div class="card-subtitle">Area under the KM curve up to \u03C4 = ' + rmstTau.toFixed(1) + '</div>';
        html += '<div class="result-grid">';
        groupKeys.forEach(function(gKey) {
            var label = hasGroups ? gKey : 'Overall';
            var rmst = rmstResults[gKey];
            var z = Statistics.normalQuantile(0.975);
            html += '<div class="result-item"><div class="result-item-value">' + rmst.rmst.toFixed(2) + '</div>'
                + '<div class="result-item-label">' + label + ' RMST<br>95% CI: (' + (rmst.rmst - z * rmst.se).toFixed(2) + ', ' + (rmst.rmst + z * rmst.se).toFixed(2) + ')</div></div>';
        });
        // RMST difference if two groups
        if (hasGroups && groupKeys.length === 2) {
            var rmst1 = rmstResults[groupKeys[0]];
            var rmst2 = rmstResults[groupKeys[1]];
            var rmstDiff = rmst1.rmst - rmst2.rmst;
            var rmstDiffSE = Math.sqrt(rmst1.se * rmst1.se + rmst2.se * rmst2.se);
            var zVal = Statistics.normalQuantile(0.975);
            var rmstDiffP = 2 * (1 - Statistics.normalCDF(Math.abs(rmstDiff / rmstDiffSE)));
            html += '<div class="result-item"><div class="result-item-value">' + rmstDiff.toFixed(2) + '</div>'
                + '<div class="result-item-label">RMST Difference<br>95% CI: (' + (rmstDiff - zVal * rmstDiffSE).toFixed(2) + ', ' + (rmstDiff + zVal * rmstDiffSE).toFixed(2) + ')<br>p = ' + Statistics.formatPValue(rmstDiffP) + '</div></div>';
        }
        html += '</div>';

        // Log-rank test results
        if (logRank) {
            html += '<div class="card-title mt-3">Log-Rank Test</div>';
            html += '<div class="result-grid">';
            html += '<div class="result-item"><div class="result-item-value">' + logRank.chi2.toFixed(3) + '</div>'
                + '<div class="result-item-label">Chi-squared (df=1)</div></div>';
            html += '<div class="result-item"><div class="result-item-value">' + Statistics.formatPValue(logRank.pValue) + '</div>'
                + '<div class="result-item-label">P-value</div></div>';
            html += '<div class="result-item"><div class="result-item-value">' + logRank.hr.toFixed(3) + '</div>'
                + '<div class="result-item-label">Hazard Ratio</div></div>';
            html += '<div class="result-item"><div class="result-item-value">[' + logRank.hrCI.lower.toFixed(3) + ', ' + logRank.hrCI.upper.toFixed(3) + ']</div>'
                + '<div class="result-item-label">HR 95% CI</div></div>';
            html += '</div>';
        }

        // KM Plot
        html += '<div class="card-title mt-3">Kaplan-Meier Plot</div>';
        html += '<div class="chart-container"><canvas id="sa-km-canvas"></canvas></div>';
        html += '<div class="chart-actions">'
            + '<button class="btn btn-xs btn-secondary" onclick="Export.exportCanvasPNG(document.getElementById(\'sa-km-canvas\'),\'km-plot.png\')">Export PNG</button></div>';

        // Number at risk table
        html += '<div class="card-title mt-3">Number at Risk</div>';
        html += buildNumberAtRiskTable(km, groupKeys, hasGroups);

        // Survival tables per group
        groupKeys.forEach(function(gKey) {
            var gData = km[gKey];
            var label = hasGroups ? gKey : 'Overall';
            html += '<div class="card-title mt-3">Survival Table: ' + label + '</div>';
            html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr>'
                + '<th>Time</th><th>N at Risk</th><th>Events</th><th>Censored</th>'
                + '<th>Survival</th><th>SE</th><th>95% CI</th>'
                + '</tr></thead><tbody>';
            gData.table.forEach(function(r) {
                if (r.time === 0 && r.events === 0 && r.censored === 0) {
                    html += '<tr><td class="num">0</td><td class="num">' + r.nRisk + '</td>'
                        + '<td class="num">-</td><td class="num">-</td>'
                        + '<td class="num">1.000</td><td class="num">-</td><td class="num">-</td></tr>';
                    return;
                }
                html += '<tr>'
                    + '<td class="num">' + r.time.toFixed(1) + '</td>'
                    + '<td class="num">' + r.nRisk + '</td>'
                    + '<td class="num">' + r.events + '</td>'
                    + '<td class="num">' + r.censored + '</td>'
                    + '<td class="num">' + r.survival.toFixed(4) + '</td>'
                    + '<td class="num">' + r.se.toFixed(4) + '</td>'
                    + '<td class="num">[' + r.ciLower.toFixed(4) + ', ' + r.ciUpper.toFixed(4) + ']</td>'
                    + '</tr>';
            });
            html += '</tbody></table></div>';
        });

        // Results text
        var resultsText = generateResultsText(km, logRank, groups, hasGroups, workingData, rmstResults, rmstTau, landmarkTime);
        html += '<div class="card-title mt-3">Results Text for Manuscript</div>';
        html += '<div class="text-output" id="sa-results-text">' + resultsText + '</div>';

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-secondary" onclick="SurvivalModule.copyResults()">Copy Results Text</button>'
            + '<button class="btn btn-sm r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.survivalAnalysis({hasGroups:' + hasGroups + ',nGroups:' + groupKeys.length + '}), \'Survival Analysis\')">'
            + '&#129513; Generate R Script</button>'
            + '</div>';

        html += '</div>'; // result-panel

        App.setTrustedHTML(resultEl, html);

        // Draw KM plot
        setTimeout(function() { drawKMPlot(km, groups, hasGroups); }, 50);
    }

    function getUniqueGroupsFrom(data) {
        var set = {};
        data.forEach(function(s) {
            if (s.group && s.group.trim()) set[s.group.trim()] = true;
        });
        return Object.keys(set);
    }

    // ============================================================
    // NUMBER AT RISK TABLE
    // ============================================================
    function buildNumberAtRiskTable(km, groupKeys, hasGroups) {
        // Determine time intervals for the at-risk table
        var allTimes = [];
        groupKeys.forEach(function(gKey) {
            km[gKey].table.forEach(function(r) { allTimes.push(r.time); });
        });
        var maxTime = Math.max.apply(null, allTimes);
        var nIntervals = Math.min(10, Math.max(5, Math.ceil(maxTime / 5)));
        var step = maxTime / nIntervals;
        var timePoints = [0];
        for (var i = 1; i <= nIntervals; i++) {
            timePoints.push(Math.round(step * i * 10) / 10);
        }

        var html = '<div class="table-scroll-wrap"><table class="data-table" style="font-size:0.85rem;"><thead><tr><th>Group</th>';
        timePoints.forEach(function(t) { html += '<th class="num">' + t.toFixed(0) + '</th>'; });
        html += '</tr></thead><tbody>';

        groupKeys.forEach(function(gKey) {
            var label = hasGroups ? gKey : 'Overall';
            html += '<tr><td><strong>' + label + '</strong></td>';
            timePoints.forEach(function(tp) {
                var nAtRisk = getAtRisk(km[gKey].table, tp);
                html += '<td class="num">' + nAtRisk + '</td>';
            });
            html += '</tr>';
        });

        html += '</tbody></table></div>';
        return html;
    }

    function getAtRisk(table, targetTime) {
        // Find number at risk just before or at targetTime
        var nRisk = table[0].nRisk;
        for (var i = 1; i < table.length; i++) {
            if (table[i].time > targetTime) break;
            nRisk = table[i].nRisk - table[i].events - table[i].censored;
        }
        return Math.max(0, nRisk);
    }

    // ============================================================
    // KM PLOT
    // ============================================================
    function drawKMPlot(km, groups, hasGroups) {
        var canvas = document.getElementById('sa-km-canvas');
        if (!canvas) return;

        var groupKeys = Object.keys(km);
        var plotGroups = groupKeys.map(function(gKey) {
            var gData = km[gKey];
            return {
                label: hasGroups ? gKey : 'Overall',
                table: gData.table
            };
        });

        Charts.KaplanMeierPlot(canvas, {
            groups: plotGroups,
            medianLines: true,
            showCI: true,
            showCensoring: true,
            showAtRisk: true,
            title: 'Kaplan-Meier Survival Curve',
            xLabel: 'Time',
            yLabel: 'Survival Probability',
            width: 700,
            height: 500
        });
    }

    // ============================================================
    // RESULTS TEXT
    // ============================================================
    function generateResultsText(km, logRank, groups, hasGroups, validData, rmstResults, rmstTau, landmarkTime) {
        var totalN = validData.length;
        var totalEvents = validData.filter(function(s) { return s.event === 1; }).length;
        var text = '';

        if (landmarkTime !== null && !isNaN(landmarkTime) && landmarkTime > 0) {
            text += 'A landmark analysis from time ' + landmarkTime.toFixed(1) + ' was performed. ';
        }

        if (hasGroups && groups.length === 2) {
            var g1 = km[groups[0]];
            var g2 = km[groups[1]];
            var n1 = g1.n;
            var n2 = g2.n;
            var e1 = 0;
            var e2 = 0;
            g1.table.forEach(function(r) { e1 += r.events; });
            g2.table.forEach(function(r) { e2 += r.events; });

            text += 'Survival analysis was performed on ' + totalN + ' participants (' + n1 + ' in the ' + groups[0]
                + ' group and ' + n2 + ' in the ' + groups[1] + ' group). '
                + 'A total of ' + totalEvents + ' events were observed (' + e1 + ' in ' + groups[0]
                + ' and ' + e2 + ' in ' + groups[1] + '). ';

            if (g1.median !== null) {
                text += 'Median survival in the ' + groups[0] + ' group was ' + g1.median.toFixed(1);
                if (g1.medianCI && g1.medianCI.lower !== null) {
                    text += ' (95% CI, ' + g1.medianCI.lower.toFixed(1) + ' to '
                        + (g1.medianCI.upper !== null ? g1.medianCI.upper.toFixed(1) : 'not reached') + ')';
                }
                text += '. ';
            } else {
                text += 'Median survival in the ' + groups[0] + ' group was not reached. ';
            }

            if (g2.median !== null) {
                text += 'Median survival in the ' + groups[1] + ' group was ' + g2.median.toFixed(1);
                if (g2.medianCI && g2.medianCI.lower !== null) {
                    text += ' (95% CI, ' + g2.medianCI.lower.toFixed(1) + ' to '
                        + (g2.medianCI.upper !== null ? g2.medianCI.upper.toFixed(1) : 'not reached') + ')';
                }
                text += '. ';
            } else {
                text += 'Median survival in the ' + groups[1] + ' group was not reached. ';
            }

            if (logRank) {
                text += 'The log-rank test ' + (logRank.pValue < 0.05 ? 'showed a statistically significant difference' : 'did not show a statistically significant difference')
                    + ' between groups (chi-squared = ' + logRank.chi2.toFixed(2) + ', P ' + Statistics.formatPValue(logRank.pValue) + '). '
                    + 'The hazard ratio was ' + logRank.hr.toFixed(2)
                    + ' (95% CI, ' + logRank.hrCI.lower.toFixed(2) + ' to ' + logRank.hrCI.upper.toFixed(2) + '). ';
            }

            // RMST
            if (rmstResults) {
                var r1 = rmstResults[groups[0]];
                var r2 = rmstResults[groups[1]];
                text += 'The restricted mean survival time up to ' + rmstTau.toFixed(1) + ' was '
                    + r1.rmst.toFixed(1) + ' in the ' + groups[0] + ' group and '
                    + r2.rmst.toFixed(1) + ' in the ' + groups[1] + ' group '
                    + '(difference: ' + (r1.rmst - r2.rmst).toFixed(1) + '). ';
            }
        } else {
            var gKey = Object.keys(km)[0];
            var gData = km[gKey];
            text += 'Kaplan-Meier analysis was performed on ' + totalN + ' participants with '
                + totalEvents + ' events observed. ';
            if (gData.median !== null) {
                text += 'Median survival was ' + gData.median.toFixed(1);
                if (gData.medianCI && gData.medianCI.lower !== null) {
                    text += ' (95% CI, ' + gData.medianCI.lower.toFixed(1) + ' to '
                        + (gData.medianCI.upper !== null ? gData.medianCI.upper.toFixed(1) : 'not reached') + ')';
                }
                text += '. ';
            } else {
                text += 'Median survival was not reached. ';
            }

            if (rmstResults && rmstResults[gKey]) {
                text += 'The restricted mean survival time up to ' + rmstTau.toFixed(1) + ' was '
                    + rmstResults[gKey].rmst.toFixed(1) + '. ';
            }
        }

        return text;
    }

    // ============================================================
    // COPY RESULTS
    // ============================================================
    function copyResults() {
        var textEl = document.getElementById('sa-results-text');
        if (textEl) {
            Export.copyText(textEl.textContent);
        }
    }

    // ============================================================
    // REGISTER MODULE
    // ============================================================
    App.registerModule(MODULE_ID, {
        render: render,
        onThemeChange: function() {
            if (lastResults) {
                setTimeout(function() {
                    drawKMPlot(lastResults.km, lastResults.groups, lastResults.hasGroups);
                }, 50);
            }
        }
    });

    window.SurvivalModule = {
        loadExample: loadExample,
        pasteCSV: pasteCSV,
        pasteSpreadsheet: pasteSpreadsheet,
        addRow: addRow,
        removeRow: removeRow,
        updateField: updateField,
        clearData: clearData,
        runAnalysis: runAnalysis,
        copyResults: copyResults
    };
})();
