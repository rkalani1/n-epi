/**
 * Neuro-Epi — Biobank Data Cleaning & Standardization Module
 * Utilities for cleaning large-scale epidemiological and clinical data.
 */

(function () {
    'use strict';

    const MODULE_ID = 'biobank-cleaning';
    let currentData = null;

    function render(container) {
        var html = App.createModuleLayout(
            'Biobank Data Cleaning',
            'Standardize and clean large-scale biobank or clinical registry datasets. Supports outlier detection, inconsistency checks, and unit conversion.'
        );

        html += '<div class="card">';
        html += '<div class="card-title">Data Standardization Pipeline</div>';
        html += '<div class="card-subtitle">Upload a CSV file (client-side only) to run clinical validation checks.</div>';

        html += '<div class="form-group">';
        html += '<label class="form-label">Select CSV File</label>';
        html += '<input type="file" class="form-input" id="cleaning-file-input" accept=".csv" onchange="BiobankCleaning.handleFile(this)">';
        html += '</div>';

        html += '<div class="form-row form-row--2">';
        html += '<div class="form-group"><label class="form-label">Age Range</label>'
            + '<div style="display:flex;gap:8px;"><input type="number" class="form-input" id="clean-age-min" value="18" style="width:70px">'
            + ' to <input type="number" class="form-input" id="clean-age-max" value="110" style="width:70px"></div></div>';
        html += '<div class="form-group"><label class="form-label">NIHSS Range</label>'
            + '<div style="display:flex;gap:8px;"><input type="number" class="form-input" id="clean-nihss-min" value="0" style="width:70px">'
            + ' to <input type="number" class="form-input" id="clean-nihss-max" value="42" style="width:70px"></div></div>';
        html += '</div>';

        html += '<div id="cleaning-status" class="mt-2"></div>';
        html += '<div id="cleaning-results" class="mt-2"></div>';

        html += '</div>'; // end card

        // Learn section
        html += '<div class="card">';
        html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\');">'
            + '\u25B6 Learn: Scientific Data Cleaning (GIGO Principle)</div>';
        html += '<div class="learn-body hidden" style="font-size:0.9rem;line-height:1.7;">';
        html += '<p><strong>Garbage In, Garbage Out (GIGO):</strong> Even the most advanced causal inference or machine learning models fail if the input data is flawed. Scientific rigor requires proactive detection of biological impossibilities and statistical outliers.</p>';
        html += '<div class="card-subtitle" style="font-weight:600;">Standard Checks</div>';
        html += '<ul style="margin:0 0 12px 16px;">'
            + '<li><strong>Biological Impossibility:</strong> e.g., diastolic BP > systolic BP, or age < 0.</li>'
            + '<li><strong>Statistical Outliers:</strong> Data points > 3 SD from the mean (Z-score > 3) or > 1.5 \u00D7 IQR.</li>'
            + '<li><strong>Consistency:</strong> e.g., "Male" gender with "History of Pregnancy".</li>'
            + '</ul>';
        html += '</div></div>';

        App.setTrustedHTML(container, html);
    }

    function handleFile(input) {
        const file = input.files[0];
        if (!file) return;

        const statusEl = document.getElementById('cleaning-status');
        App.setTrustedHTML(statusEl, '<div class="text-secondary animate-pulse">Reading file...</div>');

        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            processData(text);
        };
        reader.readAsText(file);
    }

    function processData(csvText) {
        const lines = csvText.split('\n').filter(l => l.trim().length > 0);
        if (lines.length < 2) {
            Export.showToast('Invalid CSV format', 'error');
            return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const data = lines.slice(1).map(line => {
            const values = line.split(',');
            const row = {};
            headers.forEach((h, i) => { row[h] = values[i]; });
            return row;
        });

        currentData = data;

        const ageMin = parseInt(document.getElementById('clean-age-min').value) || 0;
        const ageMax = parseInt(document.getElementById('clean-age-max').value) || 120;
        const nihssMax = parseInt(document.getElementById('clean-nihss-max').value) || 42;

        const issues = [];
        const numericCols = headers.filter(h => data.some(row => row[h] !== undefined && !isNaN(parseFloat(row[h]))));

        // Detect outliers for all numeric columns
        const stats = {};
        numericCols.forEach(col => {
            const vals = data.map(row => parseFloat(row[col])).filter(v => !isNaN(v));
            if (vals.length > 5) {
                const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
                const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / vals.length;
                const sd = Math.sqrt(variance);
                const sorted = [...vals].sort((a, b) => a - b);
                const q1 = sorted[Math.floor(sorted.length * 0.25)];
                const q3 = sorted[Math.floor(sorted.length * 0.75)];
                const iqr = q3 - q1;
                stats[col] = { mean, sd, q1, q3, iqr };
            }
        });

        // --- 0. Data Overview & Duplicates ---
        const missingCounts = {};
        headers.forEach(h => missingCounts[h] = 0);
        const idMap = {};

        data.forEach((row, idx) => {
            const lineNum = idx + 2;

            // Missing value count
            headers.forEach(h => {
                const val = row[h];
                if (val === undefined || val === null || val.trim() === '' || val.toLowerCase() === 'na' || val.toLowerCase() === 'nan') {
                    missingCounts[h]++;
                }
            });

            // Duplicate ID Check
            const idCol = headers.find(h => h === 'id' || h === 'subject_id' || h === 'patient_id' || h === 'record_id');
            if (idCol && row[idCol]) {
                const id = row[idCol];
                if (idMap[id]) {
                    issues.push(`Line ${lineNum}: [Duplicate] ID '${id}' duplicates line ${idMap[id]}.`);
                } else {
                    idMap[id] = lineNum;
                }
            }

            // --- 1. Absolute Biological Range Checks ---
            if (row.sbp) {
                const val = parseFloat(row.sbp);
                if (!isNaN(val) && (val < 40 || val > 300)) issues.push(`Line ${lineNum}: [Range] SBP (${val}) is physiologically implausible (<40 or >300).`);
            }
            if (row.dbp) {
                const val = parseFloat(row.dbp);
                if (!isNaN(val) && (val < 20 || val > 200)) issues.push(`Line ${lineNum}: [Range] DBP (${val}) is physiologically implausible (<20 or >200).`);
            }
            if (row.temperature || row.temp) {
                const val = parseFloat(row.temperature || row.temp);
                if (!isNaN(val) && (val < 30 || val > 45)) issues.push(`Line ${lineNum}: [Range] Temperature (${val}) is physiologically implausible (<30 or >45).`);
            }

            // Existing relative checks
            if (row.age && (parseInt(row.age) < ageMin || parseInt(row.age) > ageMax)) {
                issues.push(`Line ${lineNum}: [Range] Age (${row.age}) out of configured range.`);
            }
            if (row.nihss && (parseInt(row.nihss) < 0 || parseInt(row.nihss) > nihssMax)) {
                issues.push(`Line ${lineNum}: [Range] NIHSS (${row.nihss}) out of range.`);
            }
            if (row.sbp && row.dbp && parseFloat(row.sbp) <= parseFloat(row.dbp)) {
                issues.push(`Line ${lineNum}: [Consistency] Biological impossibility (SBP ${row.sbp} <= DBP ${row.dbp}).`);
            }

            // --- 2. Statistical Outliers ---
            numericCols.forEach(col => {
                const val = parseFloat(row[col]);
                if (isNaN(val) || !stats[col]) return;

                const s = stats[col];
                // Z-score threshold 3
                if (Math.abs(val - s.mean) > 3 * s.sd) {
                    issues.push(`Line ${lineNum}: [Outlier] ${col} (${val}) Z-score > 3.`);
                }
                // Tukey's fences
                if (val < (s.q1 - 1.5 * s.iqr) || val > (s.q3 + 1.5 * s.iqr)) {
                    issues.push(`Line ${lineNum}: [Outlier] ${col} (${val}) outside Tukey fences.`);
                }
            });

            // --- 3. Gender-Specific Consistency ---
            if (row.gender) {
                const g = row.gender.toLowerCase().trim();
                const isMale = g === 'male' || g === 'm' || g === 'man';
                const isFemale = g === 'female' || g === 'f' || g === 'woman';

                // Pregnancy check
                if (row.pregnancy) {
                    const p = row.pregnancy.toLowerCase().trim();
                    const isPregnant = p === 'yes' || p === '1' || p === 'y' || p === 'true';
                    if (isMale && isPregnant) {
                        issues.push(`Line ${lineNum}: [Consistency] Male gender with Pregnancy status.`);
                    }
                }

                // Prostate checks (only for females)
                const prostateCols = Object.keys(row).filter(k => k.includes('prostate'));
                if (isFemale && prostateCols.length > 0) {
                    prostateCols.forEach(col => {
                        const val = row[col].toLowerCase().trim();
                        if (val && val !== '0' && val !== 'no' && val !== 'false' && val !== 'na' && val !== '') {
                            issues.push(`Line ${lineNum}: [Consistency] Female gender with data in ${col}.`);
                        }
                    });
                }

                // Ovarian/Uterine checks (only for males)
                const gynCols = Object.keys(row).filter(k => k.includes('ovarian') || k.includes('uterine') || k.includes('cervical'));
                if (isMale && gynCols.length > 0) {
                    gynCols.forEach(col => {
                        const val = row[col].toLowerCase().trim();
                        if (val && val !== '0' && val !== 'no' && val !== 'false' && val !== 'na' && val !== '') {
                            issues.push(`Line ${lineNum}: [Consistency] Male gender with data in ${col}.`);
                        }
                    });
                }
            }

            // --- 4. Unit Conversion Warnings ---
            // SBP: < 30 is likely kPa (1 kPa = 7.5 mmHg)
            if (row.sbp) {
                const val = parseFloat(row.sbp);
                if (!isNaN(val)) {
                    if (val < 30) {
                        issues.push(`Line ${lineNum}: [Unit] SBP (${val}) is extremely low. Likely kPa? (30 kPa \u2248 225 mmHg).`);
                    } else if (val >= 30 && val < 60) {
                        issues.push(`Line ${lineNum}: [Unit] SBP (${val}) is suspicious. Possible kPa?`);
                    }
                }
            }
            // DBP: < 20 is likely kPa
            if (row.dbp) {
                const val = parseFloat(row.dbp);
                if (!isNaN(val)) {
                    if (val < 20) {
                        issues.push(`Line ${lineNum}: [Unit] DBP (${val}) is extremely low. Likely kPa? (15 kPa \u2248 112 mmHg).`);
                    } else if (val >= 20 && val < 40) {
                        issues.push(`Line ${lineNum}: [Unit] DBP (${val}) is suspicious. Possible kPa?`);
                    }
                }
            }
            // Height: 1.0 - 2.5 is likely meters, > 100 is likely cm
            if (row.height) {
                const val = parseFloat(row.height);
                if (!isNaN(val)) {
                    if (val > 1.0 && val < 2.5) {
                        issues.push(`Line ${lineNum}: [Unit] Height (${val}) looks like meters. Ensure dataset is standardized (e.g. to cm).`);
                    }
                }
            }

            // --- 5. Date Consistency Checks ---
            const dateCols = Object.keys(row).filter(k => k.includes('date') || k.includes('dob') || k.includes('time'));
            const parseDate = (dStr) => {
                if (!dStr) return null;
                const d = new Date(dStr);
                return isNaN(d.getTime()) ? null : d;
            };

            const dobCol = dateCols.find(c => c.includes('dob') || c.includes('birth'));
            const visitCol = dateCols.find(c => c.includes('visit') || c.includes('admission') || c.includes('exam'));

            if (dobCol && visitCol) {
                const dob = parseDate(row[dobCol]);
                const visit = parseDate(row[visitCol]);
                if (dob && visit && dob >= visit) {
                    issues.push(`Line ${lineNum}: [Logic] Date of Birth (${row[dobCol]}) is >= Date of Visit (${row[visitCol]}).`);
                }
            }

            const onsetCol = dateCols.find(c => c.includes('onset') || c.includes('symptom'));
            const admitCol = dateCols.find(c => c.includes('admit') || c.includes('admission'));

            if (onsetCol && admitCol) {
                const onset = parseDate(row[onsetCol]);
                const admit = parseDate(row[admitCol]);
                if (onset && admit && onset > admit) {
                    issues.push(`Line ${lineNum}: [Logic] Symptom Onset (${row[onsetCol]}) is after Admission (${row[admitCol]}).`);
                }
            }
        });

        // Report significant missing data
        const significantMissing = Object.keys(missingCounts)
            .filter(h => missingCounts[h] > 0 && (missingCounts[h] / data.length) > 0.1)
            .map(h => `${h} (${Math.round((missingCounts[h] / data.length) * 100)}%)`);

        if (significantMissing.length > 0) {
            issues.push(`[Data Quality] Significant missing data (>10%) in columns: ${significantMissing.join(', ')}.`);
        }

        renderResults(data.length, issues);
    }

    function renderResults(totalRows, issues) {
        const resultsEl = document.getElementById('cleaning-results');
        const statusEl = document.getElementById('cleaning-status');
        App.setTrustedHTML(statusEl, '');

        let html = '<div class="result-panel animate-in">';
        html += `<div class="card-title">Analysis Complete: ${totalRows} Rows Scanned</div>`;

        if (issues.length > 0) {
            // Visualize Categories
            const categories = {
                'Range': 0,
                'Logic': 0,
                'Consistency': 0,
                'Outlier': 0,
                'Unit': 0,
                'Duplicate': 0,
                'Data Quality': 0
            };

            issues.forEach(i => {
                if (i.includes('[Range]')) categories['Range']++;
                else if (i.includes('[Logic]')) categories['Logic']++;
                else if (i.includes('[Consistency]')) categories['Consistency']++;
                else if (i.includes('[Outlier]')) categories['Outlier']++;
                else if (i.includes('[Unit]')) categories['Unit']++;
                else if (i.includes('[Duplicate]')) categories['Duplicate']++;
                else if (i.includes('[Data Quality]')) categories['Data Quality']++;
            });

            // Summary Chart
            html += '<div style="margin-bottom:16px; padding:12px; background:rgba(0,0,0,0.2); border-radius:6px;">';
            html += '<div style="font-size:0.85rem; font-weight:600; margin-bottom:8px;">Issue Distribution</div>';

            Object.keys(categories).forEach(cat => {
                const count = categories[cat];
                if (count > 0) {
                    const pct = Math.min(100, Math.round((count / issues.length) * 100));
                    html += `<div style="display:flex; align-items:center; margin-bottom:4px; font-size:0.8rem;">`;
                    html += `<div style="width:100px;">${cat}</div>`;
                    html += `<div style="flex-grow:1; background:#333; height:8px; border-radius:4px; overflow:hidden;">`;
                    html += `<div style="width:${pct}%; background:var(--primary); height:100%;"></div>`;
                    html += `</div>`;
                    html += `<div style="width:40px; text-align:right;">${count}</div>`;
                    html += `</div>`;
                }
            });
            html += '</div>';
        }

        if (issues.length === 0) {
            html += '<div class="text-success" style="font-weight:600;">\u2713 No basic biological inconsistencies detected.</div>';
        } else {
            html += `<div class="text-danger" style="font-weight:600;">\u26A0 Detected ${issues.length} potential issues:</div>`;
            html += '<ul style="font-size:0.85rem; max-height:200px; overflow-y:auto; margin-top:8px;">';
            issues.slice(0, 100).forEach(issue => {
                html += `<li>${issue}</li>`;
            });
            if (issues.length > 100) html += '<li>... and more.</li>';
            html += '</ul>';
        }

        html += '</div>';

        // Export Button
        if (totalRows > 0) {
            html += '<div class="mt-2">';
            html += '<button class="btn btn-primary" onclick="BiobankCleaning.exportCleanedData()">\u2B07 Export Standardized CSV</button>';
            html += '</div>';
        }

        App.setTrustedHTML(resultsEl, html);
    }

    function exportCleanedData() {
        if (!currentData || currentData.length === 0) {
            Export.showToast('No data to export', 'error');
            return;
        }

        // Standardize Data
        const cleaned = currentData.map(row => {
            const newRow = { ...row };

            // Gender Standardization
            if (newRow.gender) {
                const g = newRow.gender.toLowerCase().trim();
                if (g === 'm' || g === 'male' || g === 'man') newRow.gender = 'Male';
                else if (g === 'f' || g === 'female' || g === 'woman') newRow.gender = 'Female';
            }

            // Boolean Standardization (Pregnancy, etc.)
            // Detect boolean-like columns efficiently? 
            // For now, let's just target known columns or do a simple check
            const boolCols = ['pregnancy', 'history_stroke', 'hypertension', 'diabetes', 'active_smoker'];
            // Or iterate all and check if values are boolean-like?
            // Let's stick to specific columns if possible, but generic is better.
            // Let's do generic boolean standardization for common Yes/No terms
            Object.keys(newRow).forEach(k => {
                const val = newRow[k]?.toLowerCase().trim();
                if (val === 'yes' || val === 'y' || val === 'true' || val === '1') newRow[k] = 'Yes';
                if (val === 'no' || val === 'n' || val === 'false' || val === '0') newRow[k] = 'No';
            });

            return newRow;
        });

        // Convert to CSV
        const headers = Object.keys(cleaned[0]);
        const csvContent = [
            headers.join(','),
            ...cleaned.map(row => headers.map(h => row[h]).join(','))
        ].join('\n');

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'biobank_cleaned_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Register module
    App.registerModule(MODULE_ID, { render: render });

    window.BiobankCleaning = {
        handleFile: handleFile,
        exportCleanedData: exportCleanedData
    };
})();
