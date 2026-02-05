/**
 * Neuro-Epi — Trial Database Module
 * Searchable database of 200+ clinical trials with verified data
 */

(function() {
    'use strict';

    const MODULE_ID = 'trial-database';
    var activeFilters = new Set();
    var compareMode = false;
    var selectedTrials = new Set();
    var searchTerm = '';
    var sortField = 'year';
    var sortDir = 'desc';
    var landmarkOnly = false;

    const CATEGORIES = [
        { id: 'thrombolysis', label: 'Thrombolysis' },
        { id: 'thrombectomy', label: 'Thrombectomy' },
        { id: 'neuroprotection', label: 'Neuroprotection' },
        { id: 'ich', label: 'ICH' },
        { id: 'sah', label: 'SAH' },
        { id: 'carotid', label: 'Carotid' },
        { id: 'antiplatelets', label: 'Antiplatelets' },
        { id: 'antiplatelet', label: 'Antiplatelets (legacy)' },
        { id: 'blood-pressure', label: 'Blood Pressure' },
        { id: 'cardiac', label: 'Cardiac / AF' },
        { id: 'anticoagulation', label: 'Anticoagulation' },
        { id: 'pfo', label: 'PFO Closure' },
        { id: 'lipids', label: 'Lipids' },
        { id: 'rehabilitation', label: 'Rehabilitation' },
        { id: 'secondary-prevention', label: 'Secondary Prevention' },
        { id: 'decompressive', label: 'Decompressive Surgery' },
        { id: 'prevention', label: 'Prevention' },
        { id: 'telestroke', label: 'Telestroke' },
        { id: 'pediatric', label: 'Pediatric' },
        { id: 'imaging', label: 'Imaging' },
        { id: 'systems-of-care', label: 'Systems of Care' },
        { id: 'other', label: 'Other' }
    ];

    // Deduplicate trials by name (keep last entry which has richer schema from batch files)
    function deduplicateTrials() {
        if (typeof TrialDatabase === 'undefined' || !TrialDatabase.trials) return;
        var seen = {};
        var unique = [];
        // Iterate in reverse so last entry (richer schema) wins, then reverse back
        for (var i = TrialDatabase.trials.length - 1; i >= 0; i--) {
            var t = TrialDatabase.trials[i];
            if (!seen[t.name]) {
                seen[t.name] = true;
                unique.push(t);
            }
        }
        unique.reverse();
        TrialDatabase.trials = unique;
    }

    function render(container) {
        deduplicateTrials();
        var html = App.createModuleLayout(
            'Clinical Trial Database',
            'Comprehensive database of landmark clinical trials with verified data. Search, filter, compare, and generate citation text for grants and manuscripts.'
        );

        // Search and controls
        html += '<div class="card">';
        html += '<div class="search-box"><input type="text" id="td-search" placeholder="Search trials by name, intervention, population, tags..." oninput="TrialDB.search(this.value)"></div>';

        // Filter tags
        html += '<div class="filter-tags" id="td-filters">';
        CATEGORIES.forEach(function(cat) {
            if (cat.id === 'antiplatelet') return; // skip legacy
            html += '<button class="filter-tag" data-cat="' + cat.id + '" onclick="TrialDB.toggleFilter(\'' + cat.id + '\')">' + cat.label + '</button>';
        });
        html += '</div>';

        // Controls row
        html += '<div class="form-row form-row--4" style="align-items:end;margin-top:8px">';

        // Sort
        html += '<div class="form-group"><label class="form-label">Sort by</label>'
            + '<select class="form-select" id="td-sort" onchange="TrialDB.setSort(this.value)">'
            + '<option value="year-desc">Year (newest first)</option>'
            + '<option value="year-asc">Year (oldest first)</option>'
            + '<option value="name-asc">Name (A-Z)</option>'
            + '<option value="n-desc">Sample size (largest)</option>'
            + '<option value="n-asc">Sample size (smallest)</option>'
            + '</select></div>';

        // Landmark filter
        html += '<div class="form-group" style="display:flex;align-items:center;gap:8px;padding-bottom:4px">'
            + '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:0.85rem">'
            + '<input type="checkbox" id="td-landmark" onchange="TrialDB.toggleLandmark(this.checked)"> Landmark trials only'
            + '</label></div>';

        // Count and actions
        html += '<div class="form-group"><div class="text-secondary" style="font-size:0.8rem" id="td-count">Showing all trials</div></div>';

        html += '<div class="form-group">'
            + '<div class="btn-group">'
            + '<button class="btn btn-xs btn-secondary" id="td-compare-btn" onclick="TrialDB.toggleCompare()">Compare Mode</button>'
            + '<button class="btn btn-xs btn-secondary hidden" id="td-compare-action" onclick="TrialDB.showComparison()">Compare Selected</button>'
            + '<button class="btn btn-xs btn-secondary" onclick="TrialDB.exportCSV()">Export CSV</button>'
            + '</div></div>';

        html += '</div>'; // form-row

        html += '<div id="td-trials"></div>';
        html += '</div>';

        // Timeline visualization
        html += '<div class="card">';
        html += '<div class="card-title">Trial Timeline</div>';
        html += '<div class="card-subtitle">Visual overview of trial publication years and sample sizes</div>';
        html += '<div class="chart-container"><canvas id="td-timeline-chart" width="800" height="300"></canvas></div>';
        html += '</div>';

        // Comparison panel
        html += '<div class="card hidden" id="td-comparison">';
        html += '<div class="card-title">Trial Comparison</div>';
        html += '<div id="td-comparison-content"></div>';
        html += '</div>';

        // Citation generator
        html += '<div class="card">';
        html += '<div class="card-title">Citation &amp; Evidence Summary Generator</div>';
        html += '<div class="card-subtitle">Select trials above (Compare Mode) or filter by category, then generate publication-ready text</div>';
        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Output Format</label>'
            + '<select class="form-select" id="td-cite-format">'
            + '<option value="paragraph">Citation Paragraph</option>'
            + '<option value="evidence">Evidence Summary Table</option>'
            + '<option value="references">Formatted Reference List</option>'
            + '</select></div>';
        html += '<div class="form-group" style="display:flex;align-items:end"><button class="btn btn-primary" onclick="TrialDB.generateCitation()">Generate</button></div>';
        html += '</div>';
        html += '<div id="td-cite-output"></div>';
        html += '</div>';

        App.setTrustedHTML(container, html);
        renderTrials();
        renderTimeline();
    }

    function inferResult(trial) {
        if (!trial.primaryOutcome) return 'neutral';
        var pv = trial.primaryOutcome.pValue || '';
        // Check for clear negative
        if (/p\s*[=>]\s*0\.[1-9]/.test(pv) || /NS/.test(pv) || /not significant/i.test(pv) || /p\s*=\s*0\.0[5-9]/.test(pv)) return 'negative';
        if (/p\s*=\s*0\.277/.test(pv) || /p\s*=\s*0\.18/.test(pv) || /p\s*=\s*0\.1[0-9]/.test(pv)) return 'negative';
        // Check for clear positive
        if (/p\s*[<]\s*0\.0[0-5]/.test(pv) || /p\s*=\s*0\.00/.test(pv) || /p\s*<\s*0\.001/.test(pv) || /p\s*=\s*0\.0[0-4]/.test(pv)) return 'positive';
        if (/p\s*=\s*0\.008/.test(pv) || /p\s*<\s*0\.05/.test(pv)) return 'positive';
        // Heuristic from significance text
        if (trial.significance && (/negative trial|failed|did not show|no significant|no benefit|not superior/i.test(trial.significance))) return 'negative';
        if (trial.significance && (/landmark|established|superior|improved|reduced|benefit/i.test(trial.significance))) return 'positive';
        return 'neutral';
    }

    function resultIcon(trial) {
        var r = inferResult(trial);
        if (r === 'positive') return '<span style="color:var(--success)" title="Positive result">\u25B2</span>';
        if (r === 'negative') return '<span style="color:var(--danger)" title="Negative/neutral result">\u25BC</span>';
        return '<span style="color:var(--text-tertiary)" title="Mixed/unclear result">\u25CF</span>';
    }

    function getFilteredTrials() {
        if (typeof TrialDatabase === 'undefined' || !TrialDatabase.trials) return [];

        var filtered = TrialDatabase.trials.filter(function(trial) {
            // Category filter (handle legacy 'antiplatelet' matching 'antiplatelets')
            if (activeFilters.size > 0) {
                var catMatch = activeFilters.has(trial.category);
                if (!catMatch && trial.category === 'antiplatelet') catMatch = activeFilters.has('antiplatelets');
                if (!catMatch && trial.category === 'antiplatelets') catMatch = activeFilters.has('antiplatelet');
                if (!catMatch) return false;
            }

            // Landmark filter
            if (landmarkOnly && !trial.landmark) return false;

            // Search filter
            if (searchTerm) {
                var term = searchTerm.toLowerCase();
                var searchable = (trial.name + ' ' + (trial.fullTitle || '') + ' ' + trial.population + ' ' + trial.intervention + ' ' + (trial.comparator || '') + ' ' + (trial.tags ? trial.tags.join(' ') : '')).toLowerCase();
                if (searchable.indexOf(term) === -1) return false;
            }

            return true;
        });

        // Sort
        filtered.sort(function(a, b) {
            if (sortField === 'year') return sortDir === 'asc' ? (a.year || 0) - (b.year || 0) : (b.year || 0) - (a.year || 0);
            if (sortField === 'name') return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            if (sortField === 'n') return sortDir === 'asc' ? (a.n || 0) - (b.n || 0) : (b.n || 0) - (a.n || 0);
            return 0;
        });

        return filtered;
    }

    function renderTrials() {
        var trials = getFilteredTrials();
        var total = TrialDatabase.trials ? TrialDatabase.trials.length : 0;
        var countEl = document.getElementById('td-count');
        if (countEl) countEl.textContent = 'Showing ' + trials.length + ' of ' + total + ' trials';

        var html = '';
        trials.forEach(function(trial) {
            var isSelected = selectedTrials.has(trial.name);
            html += '<div class="trial-card' + (isSelected ? ' expanded' : '') + '" id="trial-' + trial.name.replace(/\s/g, '-') + '" onclick="TrialDB.toggleTrial(\'' + trial.name.replace(/'/g, "\\'") + '\')">';

            if (compareMode) {
                html += '<div style="float:right"><input type="checkbox" ' + (isSelected ? 'checked' : '') + ' onclick="event.stopPropagation();TrialDB.toggleSelect(\'' + trial.name.replace(/'/g, "\\'") + '\')"></div>';
            }

            html += '<div class="trial-card-header">'
                + '<div class="trial-card-name">' + resultIcon(trial) + ' ' + trial.name + (trial.year ? ' (' + trial.year + ')' : '')
                + (trial.landmark ? ' <span style="color:var(--accent);font-size:0.7rem;vertical-align:super">\u2605</span>' : '')
                + '</div>'
                + '<div class="trial-card-year">N=' + (trial.n || '?') + '</div></div>';

            html += '<div class="trial-card-desc">' + (trial.intervention || '') + ' vs ' + (trial.comparator || '') + '</div>';

            if (trial.tags) {
                html += '<div class="trial-card-tags">';
                trial.tags.forEach(function(tag) {
                    html += '<span class="trial-tag">' + tag + '</span>';
                });
                html += '</div>';
            }

            // Expanded detail
            html += '<div class="trial-detail">';
            if (trial.fullTitle) html += '<div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:8px"><em>' + trial.fullTitle + '</em></div>';
            html += '<table class="data-table" style="font-size:0.8rem">';
            if (trial.journal) {
                html += '<tr><td style="width:130px;font-weight:500">Journal</td><td>' + trial.journal;
                if (trial.pmid) html += ' <a href="https://pubmed.ncbi.nlm.nih.gov/' + trial.pmid + '/" target="_blank" rel="noopener" onclick="event.stopPropagation()" style="color:var(--accent)">[PubMed]</a>';
                if (trial.doi) html += ' <a href="https://doi.org/' + trial.doi + '" target="_blank" rel="noopener" onclick="event.stopPropagation()" style="color:var(--accent)">[DOI]</a>';
                html += '</td></tr>';
            }
            if (trial.design) html += '<tr><td style="font-weight:500">Design</td><td>' + trial.design + '</td></tr>';
            if (trial.phase) html += '<tr><td style="font-weight:500">Phase</td><td>' + trial.phase + '</td></tr>';
            if (trial.blinding) html += '<tr><td style="font-weight:500">Blinding</td><td>' + trial.blinding + '</td></tr>';
            if (trial.population) html += '<tr><td style="font-weight:500">Population</td><td>' + trial.population + '</td></tr>';
            if (trial.fundingSource) html += '<tr><td style="font-weight:500">Funding</td><td>' + trial.fundingSource + '</td></tr>';
            if (trial.primaryOutcome) {
                html += '<tr><td style="font-weight:500">Primary Outcome</td><td>' + trial.primaryOutcome.measure + '</td></tr>';
                html += '<tr><td style="font-weight:500">Result</td><td style="color:' + (inferResult(trial) === 'positive' ? 'var(--success)' : inferResult(trial) === 'negative' ? 'var(--danger)' : 'var(--accent)') + ';font-weight:600">'
                    + trial.primaryOutcome.result
                    + (trial.primaryOutcome.ci ? ' ' + trial.primaryOutcome.ci : '')
                    + (trial.primaryOutcome.pValue ? ', ' + trial.primaryOutcome.pValue : '')
                    + '</td></tr>';
            }
            if (trial.keySecondary && trial.keySecondary.length > 0) {
                html += '<tr><td style="font-weight:500">Key Secondary</td><td>' + trial.keySecondary.join('; ') + '</td></tr>';
            }
            if (trial.significance) html += '<tr><td style="font-weight:500">Significance</td><td>' + trial.significance + '</td></tr>';
            html += '</table>';

            html += '<div class="btn-group mt-1">'
                + '<button class="btn btn-xs btn-secondary" onclick="event.stopPropagation();TrialDB.copyCitation(\'' + trial.name.replace(/'/g, "\\'") + '\')">Copy Citation</button>'
                + '<button class="btn btn-xs btn-secondary" onclick="event.stopPropagation();TrialDB.copyDetails(\'' + trial.name.replace(/'/g, "\\'") + '\')">Copy Details</button>';
            if (trial.pmid) {
                html += '<a class="btn btn-xs btn-ghost" href="https://pubmed.ncbi.nlm.nih.gov/' + trial.pmid + '/" target="_blank" rel="noopener" onclick="event.stopPropagation()">PubMed \u2197</a>';
            }
            if (trial.doi) {
                html += '<a class="btn btn-xs btn-ghost" href="https://doi.org/' + trial.doi + '" target="_blank" rel="noopener" onclick="event.stopPropagation()">DOI \u2197</a>';
            }
            html += '</div>';
            html += '</div>'; // trial-detail

            html += '</div>'; // trial-card
        });

        if (trials.length === 0) {
            html = '<div class="text-center text-secondary" style="padding:40px">No trials match your search criteria.</div>';
        }

        var el = document.getElementById('td-trials');
        if (el) App.setTrustedHTML(el, html);
    }

    function renderTimeline() {
        var canvas = document.getElementById('td-timeline-chart');
        if (!canvas || typeof Charts === 'undefined') return;
        if (!TrialDatabase || !TrialDatabase.trials) return;

        // Group trials by year
        var byYear = {};
        TrialDatabase.trials.forEach(function(t) {
            if (!t.year) return;
            if (!byYear[t.year]) byYear[t.year] = [];
            byYear[t.year].push(t);
        });

        var years = Object.keys(byYear).map(Number).sort(function(a, b) { return a - b; });
        if (years.length === 0) return;

        var points = years.map(function(y) {
            return { x: y, y: byYear[y].length };
        });

        Charts.BarChart(canvas, {
            data: points,
            xLabel: 'Publication Year',
            yLabel: 'Number of Trials',
            title: 'Trial Publications by Year (N=' + TrialDatabase.trials.length + ')',
            width: 800,
            height: 300,
            color: 'var(--accent)'
        });
    }

    function search(term) {
        searchTerm = term;
        renderTrials();
    }

    function setSort(value) {
        var parts = value.split('-');
        sortField = parts[0];
        sortDir = parts[1];
        renderTrials();
    }

    function toggleLandmark(checked) {
        landmarkOnly = checked;
        renderTrials();
    }

    function toggleFilter(catId) {
        if (activeFilters.has(catId)) {
            activeFilters.delete(catId);
        } else {
            activeFilters.add(catId);
        }
        document.querySelectorAll('.filter-tag').forEach(function(btn) {
            btn.classList.toggle('active', activeFilters.has(btn.dataset.cat));
        });
        renderTrials();
    }

    function toggleTrial(name) {
        if (compareMode) return;
        var card = document.querySelector('[id="trial-' + name.replace(/\s/g, '-') + '"]');
        if (card) card.classList.toggle('expanded');
    }

    function toggleCompare() {
        compareMode = !compareMode;
        selectedTrials.clear();
        var btn = document.getElementById('td-compare-btn');
        if (btn) btn.textContent = compareMode ? 'Exit Compare' : 'Compare Mode';
        var action = document.getElementById('td-compare-action');
        if (action) action.classList.toggle('hidden', !compareMode);
        var panel = document.getElementById('td-comparison');
        if (panel) panel.classList.add('hidden');
        renderTrials();
    }

    function toggleSelect(name) {
        if (selectedTrials.has(name)) {
            selectedTrials.delete(name);
        } else {
            selectedTrials.add(name);
        }
        renderTrials();
    }

    function showComparison() {
        if (selectedTrials.size < 2) {
            Export.showToast('Select at least 2 trials to compare', 'warning');
            return;
        }

        var trials = TrialDatabase.trials.filter(function(t) { return selectedTrials.has(t.name); });
        var panel = document.getElementById('td-comparison');
        panel.classList.remove('hidden');

        var html = '<div style="overflow-x:auto"><table class="data-table">';
        html += '<thead><tr><th>Property</th>';
        trials.forEach(function(t) { html += '<th>' + t.name + '</th>'; });
        html += '</tr></thead><tbody>';

        var rows = [
            { label: 'Year', fn: function(t) { return t.year || '-'; } },
            { label: 'N', fn: function(t) { return t.n || '-'; } },
            { label: 'Design', fn: function(t) { return t.design || '-'; } },
            { label: 'Population', fn: function(t) { return t.population || '-'; } },
            { label: 'Intervention', fn: function(t) { return t.intervention || '-'; } },
            { label: 'Comparator', fn: function(t) { return t.comparator || '-'; } },
            { label: 'Blinding', fn: function(t) { return t.blinding || '-'; } },
            { label: 'Funding', fn: function(t) { return t.fundingSource || '-'; } }
        ];

        rows.forEach(function(row) {
            html += '<tr><td style="font-weight:500">' + row.label + '</td>';
            trials.forEach(function(t) { html += '<td>' + row.fn(t) + '</td>'; });
            html += '</tr>';
        });

        // Primary outcome row
        html += '<tr><td style="font-weight:500">Primary Outcome</td>';
        trials.forEach(function(t) {
            if (t.primaryOutcome) {
                var color = inferResult(t) === 'positive' ? 'var(--success)' : inferResult(t) === 'negative' ? 'var(--danger)' : 'var(--accent)';
                html += '<td>' + t.primaryOutcome.measure + ': <span style="color:' + color + ';font-weight:600">'
                    + t.primaryOutcome.result + '</span>'
                    + (t.primaryOutcome.pValue ? ' (' + t.primaryOutcome.pValue + ')' : '') + '</td>';
            } else {
                html += '<td>-</td>';
            }
        });
        html += '</tr>';

        html += '<tr><td style="font-weight:500">Significance</td>';
        trials.forEach(function(t) { html += '<td>' + (t.significance || '-') + '</td>'; });
        html += '</tr>';

        html += '</tbody></table></div>';

        html += '<div class="btn-group mt-2"><button class="btn btn-xs btn-secondary" onclick="TrialDB.copyComparison()">Copy as Table</button></div>';

        App.setTrustedHTML(document.getElementById('td-comparison-content'), html);
    }

    function copyCitation(name) {
        var trial = TrialDatabase.trials.find(function(t) { return t.name === name; });
        if (!trial) return;
        var text = trial.name;
        if (trial.fullTitle) text += ' (' + trial.fullTitle + ')';
        text += '. ' + (trial.journal || '') + ' ' + (trial.year || '');
        if (trial.pmid) text += '. PMID: ' + trial.pmid;
        if (trial.doi) text += '. DOI: ' + trial.doi;
        text += '.';
        Export.copyText(text);
    }

    function copyDetails(name) {
        var trial = TrialDatabase.trials.find(function(t) { return t.name === name; });
        if (!trial) return;
        var text = trial.name + ' (' + trial.year + '): '
            + trial.intervention + ' vs ' + trial.comparator
            + '. N=' + trial.n + '. '
            + (trial.primaryOutcome ? trial.primaryOutcome.measure + ': ' + trial.primaryOutcome.result
                + (trial.primaryOutcome.ci ? ' ' + trial.primaryOutcome.ci : '')
                + (trial.primaryOutcome.pValue ? ', ' + trial.primaryOutcome.pValue : '') : '')
            + '. ' + (trial.significance || '');
        Export.copyText(text);
    }

    function copyComparison() {
        var trials = TrialDatabase.trials.filter(function(t) { return selectedTrials.has(t.name); });
        var headers = ['Property'].concat(trials.map(function(t) { return t.name; }));
        var rows = [
            ['Year'].concat(trials.map(function(t) { return t.year || '-'; })),
            ['N'].concat(trials.map(function(t) { return t.n || '-'; })),
            ['Intervention'].concat(trials.map(function(t) { return t.intervention || '-'; })),
            ['Primary Outcome'].concat(trials.map(function(t) {
                return t.primaryOutcome ? t.primaryOutcome.result : '-';
            }))
        ];
        Export.copyTSV(headers, rows);
    }

    function exportCSV() {
        var trials = getFilteredTrials();
        if (trials.length === 0) {
            Export.showToast('No trials to export', 'warning');
            return;
        }

        var headers = ['Name', 'Year', 'N', 'Journal', 'PMID', 'DOI', 'Design', 'Population', 'Intervention', 'Comparator', 'Primary Outcome', 'Result', 'P-value', 'Category', 'Landmark'];
        var csvRows = [headers.join(',')];

        trials.forEach(function(t) {
            var row = [
                '"' + (t.name || '').replace(/"/g, '""') + '"',
                t.year || '',
                t.n || '',
                '"' + (t.journal || '').replace(/"/g, '""') + '"',
                t.pmid || '',
                t.doi || '',
                '"' + (t.design || '').replace(/"/g, '""') + '"',
                '"' + (t.population || '').replace(/"/g, '""') + '"',
                '"' + (t.intervention || '').replace(/"/g, '""') + '"',
                '"' + (t.comparator || '').replace(/"/g, '""') + '"',
                '"' + (t.primaryOutcome ? t.primaryOutcome.measure : '').replace(/"/g, '""') + '"',
                '"' + (t.primaryOutcome ? t.primaryOutcome.result : '').replace(/"/g, '""') + '"',
                '"' + (t.primaryOutcome ? (t.primaryOutcome.pValue || '') : '').replace(/"/g, '""') + '"',
                t.category || '',
                t.landmark ? 'Yes' : 'No'
            ];
            csvRows.push(row.join(','));
        });

        var csv = csvRows.join('\n');
        var blob = new Blob([csv], { type: 'text/csv' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'neuro-epi-trials.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        Export.showToast('CSV exported (' + trials.length + ' trials)');
    }

    function generateCitation() {
        var format = document.getElementById('td-cite-format').value;
        var trials;

        // Use selected trials if in compare mode, otherwise use filtered
        if (selectedTrials.size > 0) {
            trials = TrialDatabase.trials.filter(function(t) { return selectedTrials.has(t.name); });
        } else {
            trials = getFilteredTrials();
        }

        if (trials.length === 0) {
            App.setTrustedHTML(document.getElementById('td-cite-output'),
                '<div class="result-panel"><div class="result-detail">No trials selected. Use filters or Compare Mode to select trials.</div></div>');
            return;
        }

        var html = '';

        if (format === 'paragraph') {
            // Generate citation paragraph
            var text = generateCitationParagraph(trials);
            html = '<div class="result-panel"><div style="font-family:var(--font-sans);line-height:1.6;padding:12px;background:var(--bg-base);border-radius:8px;font-size:0.9rem">'
                + text + '</div>'
                + '<div class="btn-group mt-2"><button class="btn btn-xs btn-secondary" onclick="TrialDB.copyCitationText()">Copy to Clipboard</button></div></div>';
        } else if (format === 'evidence') {
            // Evidence summary table
            html = '<div class="result-panel"><div style="overflow-x:auto"><table class="data-table" style="font-size:0.8rem">'
                + '<thead><tr><th>Trial</th><th>Year</th><th>N</th><th>Intervention</th><th>Primary Result</th><th>Direction</th></tr></thead><tbody>';
            trials.forEach(function(t) {
                var dir = inferResult(t);
                var dirText = dir === 'positive' ? '\u2705 Positive' : dir === 'negative' ? '\u274C Negative' : '\u2796 Neutral';
                html += '<tr><td style="font-weight:500">' + t.name + '</td><td>' + (t.year || '-') + '</td><td>' + (t.n || '-') + '</td>'
                    + '<td>' + (t.intervention || '-') + '</td>'
                    + '<td>' + (t.primaryOutcome ? t.primaryOutcome.result + (t.primaryOutcome.pValue ? ' (' + t.primaryOutcome.pValue + ')' : '') : '-') + '</td>'
                    + '<td>' + dirText + '</td></tr>';
            });
            html += '</tbody></table></div>'
                + '<div class="btn-group mt-2"><button class="btn btn-xs btn-secondary" onclick="TrialDB.copyEvidenceTable()">Copy as Table</button></div></div>';
        } else if (format === 'references') {
            // Formatted reference list
            html = '<div class="result-panel"><ol style="font-size:0.85rem;line-height:1.8;padding-left:24px">';
            trials.sort(function(a, b) { return (a.year || 0) - (b.year || 0); });
            trials.forEach(function(t) {
                html += '<li>' + t.name;
                if (t.fullTitle) html += ' (' + t.fullTitle + ')';
                html += '. <em>' + (t.journal || 'Journal') + '</em>';
                html += '. ' + (t.year || '');
                if (t.pmid) html += '. PMID: <a href="https://pubmed.ncbi.nlm.nih.gov/' + t.pmid + '/" target="_blank" rel="noopener" style="color:var(--accent)">' + t.pmid + '</a>';
                if (t.doi) html += '. DOI: <a href="https://doi.org/' + t.doi + '" target="_blank" rel="noopener" style="color:var(--accent)">' + t.doi + '</a>';
                html += '.</li>';
            });
            html += '</ol>'
                + '<div class="btn-group mt-2"><button class="btn btn-xs btn-secondary" onclick="TrialDB.copyReferences()">Copy Reference List</button></div></div>';
        }

        App.setTrustedHTML(document.getElementById('td-cite-output'), html);
    }

    function generateCitationParagraph(trials) {
        // Group by category
        var categories = {};
        trials.forEach(function(t) {
            var cat = t.category || 'other';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(t);
        });

        var paragraphs = [];
        Object.keys(categories).forEach(function(cat) {
            var catTrials = categories[cat].sort(function(a, b) { return (a.year || 0) - (b.year || 0); });
            var names = catTrials.map(function(t) { return t.name + ' (' + t.year + ')'; });

            if (catTrials.length === 1) {
                var t = catTrials[0];
                paragraphs.push('The ' + t.name + ' trial (' + t.year + ', N=' + t.n + ') evaluated '
                    + t.intervention + ' versus ' + t.comparator + ' in ' + (t.population || 'the target population').toLowerCase()
                    + ', with the primary outcome of ' + (t.primaryOutcome ? t.primaryOutcome.measure.toLowerCase() : 'the primary endpoint')
                    + ' showing ' + (t.primaryOutcome ? t.primaryOutcome.result : 'mixed results')
                    + (t.primaryOutcome && t.primaryOutcome.pValue ? ' (' + t.primaryOutcome.pValue + ')' : '') + '.');
            } else {
                var catLabel = CATEGORIES.find(function(c) { return c.id === cat; });
                paragraphs.push('Key ' + (catLabel ? catLabel.label.toLowerCase() : cat) + ' trials include '
                    + names.join(', ')
                    + ', enrolling a combined ' + catTrials.reduce(function(sum, t) { return sum + (t.n || 0); }, 0) + ' patients.');
            }
        });

        return paragraphs.join(' ');
    }

    function copyCitationText() {
        var el = document.querySelector('#td-cite-output div[style]');
        if (el) Export.copyText(el.textContent);
    }

    function copyEvidenceTable() {
        var trials;
        if (selectedTrials.size > 0) {
            trials = TrialDatabase.trials.filter(function(t) { return selectedTrials.has(t.name); });
        } else {
            trials = getFilteredTrials();
        }
        var headers = ['Trial', 'Year', 'N', 'Intervention', 'Result', 'Direction'];
        var rows = trials.map(function(t) {
            return [t.name, t.year || '', t.n || '', t.intervention || '',
                t.primaryOutcome ? t.primaryOutcome.result : '', inferResult(t)];
        });
        Export.copyTSV(headers, rows);
    }

    function copyReferences() {
        var trials;
        if (selectedTrials.size > 0) {
            trials = TrialDatabase.trials.filter(function(t) { return selectedTrials.has(t.name); });
        } else {
            trials = getFilteredTrials();
        }
        trials.sort(function(a, b) { return (a.year || 0) - (b.year || 0); });
        var text = trials.map(function(t, i) {
            return (i + 1) + '. ' + t.name + (t.fullTitle ? ' (' + t.fullTitle + ')' : '')
                + '. ' + (t.journal || '') + '. ' + (t.year || '')
                + (t.pmid ? '. PMID: ' + t.pmid : '')
                + (t.doi ? '. DOI: ' + t.doi : '') + '.';
        }).join('\n');
        Export.copyText(text);
    }

    App.registerModule(MODULE_ID, { render: render });

    window.TrialDB = {
        search: search,
        setSort: setSort,
        toggleLandmark: toggleLandmark,
        toggleFilter: toggleFilter,
        toggleTrial: toggleTrial,
        toggleCompare: toggleCompare,
        toggleSelect: toggleSelect,
        showComparison: showComparison,
        copyCitation: copyCitation,
        copyDetails: copyDetails,
        copyComparison: copyComparison,
        exportCSV: exportCSV,
        generateCitation: generateCitation,
        copyCitationText: copyCitationText,
        copyEvidenceTable: copyEvidenceTable,
        copyReferences: copyReferences
    };
})();
