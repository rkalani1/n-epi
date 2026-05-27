/**
 * Neuro-Epi — Canvas Charting Library
 * Publication-quality charts: Forest plots, KM curves, funnel plots, etc.
 * All charts are Retina-aware, theme-aware, and exportable as PNG.
 */

var Charts = (() => {
    'use strict';

    const THEME = {
        dark: {
            bg: '#06090f', surface: '#0c1220', elevated: '#111827',
            text: '#f1f5f9', textSecondary: '#94a3b8', textTertiary: '#64748b',
            accent: '#22d3ee', grid: 'rgba(148,163,184,0.08)',
            border: 'rgba(148,163,184,0.15)',
            success: '#34d399', warning: '#fbbf24', danger: '#f87171', info: '#818cf8',
            series: ['#22d3ee', '#34d399', '#fbbf24', '#f87171', '#818cf8', '#fb923c', '#a78bfa', '#f472b6']
        },
        light: {
            bg: '#ffffff', surface: '#f8fafc', elevated: '#f1f5f9',
            text: '#0f172a', textSecondary: '#475569', textTertiary: '#64748b',
            accent: '#0891b2', grid: 'rgba(0,0,0,0.06)',
            border: 'rgba(0,0,0,0.1)',
            success: '#059669', warning: '#d97706', danger: '#dc2626', info: '#4f46e5',
            series: ['#0891b2', '#059669', '#d97706', '#dc2626', '#4f46e5', '#ea580c', '#7c3aed', '#db2777']
        }
    };

    function getTheme() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? THEME.light : THEME.dark;
    }

    function setupCanvas(canvas, width, height) {
        var dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        var ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        return ctx;
    }

    function exportPNG(canvas, filename) {
        var link = document.createElement('a');
        link.download = filename || 'chart.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    function drawRoundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    // ============================================================
    // UTILITY: Nice axis ticks (1, 2, 5 multiples)
    // ============================================================

    function niceNum(range, round) {
        var exponent = Math.floor(Math.log10(range));
        var fraction = range / Math.pow(10, exponent);
        var niceFraction;
        if (round) {
            if (fraction < 1.5) niceFraction = 1;
            else if (fraction < 3) niceFraction = 2;
            else if (fraction < 7) niceFraction = 5;
            else niceFraction = 10;
        } else {
            if (fraction <= 1) niceFraction = 1;
            else if (fraction <= 2) niceFraction = 2;
            else if (fraction <= 5) niceFraction = 5;
            else niceFraction = 10;
        }
        return niceFraction * Math.pow(10, exponent);
    }

    function niceScale(minVal, maxVal, maxTicks) {
        maxTicks = maxTicks || 6;
        var range = niceNum(maxVal - minVal, false);
        var tickSpacing = niceNum(range / (maxTicks - 1), true);
        var niceMin = Math.floor(minVal / tickSpacing) * tickSpacing;
        var niceMax = Math.ceil(maxVal / tickSpacing) * tickSpacing;
        var ticks = [];
        for (var v = niceMin; v <= niceMax + tickSpacing * 0.5; v += tickSpacing) {
            ticks.push(parseFloat(v.toPrecision(12)));
        }
        return { min: niceMin, max: niceMax, tickSpacing: tickSpacing, ticks: ticks };
    }

    // ============================================================
    // UTILITY: Optional drop shadow
    // ============================================================

    function applyDropShadow(ctx, enable) {
        if (enable) {
            ctx.shadowColor = 'rgba(0,0,0,0.18)';
            ctx.shadowBlur = 6;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 2;
        }
    }

    function clearDropShadow(ctx) {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    // ============================================================
    // UTILITY: Canvas guard (null / not visible)
    // ============================================================

    function guardCanvas(canvas) {
        if (!canvas) return false;
        if (!canvas.getContext) return false;
        if (canvas.offsetWidth === 0 && canvas.offsetHeight === 0) {
            // Canvas exists but is not visible; still allow rendering
        }
        return true;
    }

    // ============================================================
    // HIGH-RES EXPORT
    // ============================================================

    function exportHighRes(canvas, scale) {
        scale = scale || 2;
        if (!guardCanvas(canvas)) return null;

        var origWidth = parseInt(canvas.style.width, 10) || canvas.width;
        var origHeight = parseInt(canvas.style.height, 10) || canvas.height;

        var offscreen = document.createElement('canvas');
        offscreen.width = origWidth * scale;
        offscreen.height = origHeight * scale;
        var offCtx = offscreen.getContext('2d');
        offCtx.scale(scale, scale);

        // Draw the existing canvas content scaled up
        // We draw from the already-rendered canvas (which is at dpr resolution)
        offCtx.drawImage(canvas, 0, 0, origWidth, origHeight);

        return offscreen.toDataURL('image/png');
    }

    // ============================================================
    // DOWNLOAD PNG (with DPI-aware scaling)
    // ============================================================

    function downloadPNG(canvas, filename, scale) {
        scale = scale || (300 / 96); // default ~3.125x for 300 DPI
        if (!guardCanvas(canvas)) return;

        var dataUrl = exportHighRes(canvas, scale);
        if (!dataUrl) return;

        var link = document.createElement('a');
        link.download = filename || 'chart.png';
        link.href = dataUrl;
        link.click();
    }

    // ============================================================
    // LINE CHART
    // ============================================================

    function LineChart(canvas, options) {
        if (!guardCanvas(canvas)) return;
        const {
            data, // [{label, points: [{x, y}], color?, ciLower?, ciUpper?}]
            xLabel, yLabel, title,
            xMin, xMax, yMin, yMax,
            width = 700, height = 400,
            showGrid = true, showLegend = true,
            xTicks, yTicks
        } = options;

        const theme = getTheme();
        const ctx = setupCanvas(canvas, width, height);
        const pad = { top: 40, right: 30, bottom: 55, left: 65 };

        if (title) pad.top = 55;
        if (showLegend) pad.bottom += 25;

        const plotW = width - pad.left - pad.right;
        const plotH = height - pad.top - pad.bottom;

        // Compute ranges
        let allX = [], allY = [];
        data.forEach(s => {
            s.points.forEach(p => { allX.push(p.x); allY.push(p.y); });
            if (s.ciLower) s.ciLower.forEach(p => allY.push(p.y));
            if (s.ciUpper) s.ciUpper.forEach(p => allY.push(p.y));
        });
        const xR = [xMin !== undefined ? xMin : Math.min(...allX), xMax !== undefined ? xMax : Math.max(...allX)];
        const yR = [yMin !== undefined ? yMin : Math.min(...allY), yMax !== undefined ? yMax : Math.max(...allY)];
        const xRange = xR[1] - xR[0] || 1;
        const yRange = yR[1] - yR[0] || 1;

        function sx(v) { return pad.left + (v - xR[0]) / xRange * plotW; }
        function sy(v) { return pad.top + plotH - (v - yR[0]) / yRange * plotH; }

        // Background
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        // Title
        if (title) {
            ctx.fillStyle = theme.text;
            ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(title, width / 2, 22);
        }

        // Grid
        if (showGrid) {
            ctx.strokeStyle = theme.grid;
            ctx.lineWidth = 1;
            const nYTicks = yTicks || 5;
            for (let i = 0; i <= nYTicks; i++) {
                const yVal = yR[0] + (yRange * i) / nYTicks;
                const y = sy(yVal);
                ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + plotW, y); ctx.stroke();
                ctx.fillStyle = theme.textSecondary;
                ctx.font = '11px system-ui, -apple-system, sans-serif';
                ctx.textAlign = 'right';
                ctx.fillText(Statistics.round(yVal, 2), pad.left - 8, y + 4);
            }
            const nXTicks = xTicks || 5;
            for (let i = 0; i <= nXTicks; i++) {
                const xVal = xR[0] + (xRange * i) / nXTicks;
                const x = sx(xVal);
                ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + plotH); ctx.stroke();
                ctx.fillStyle = theme.textSecondary;
                ctx.textAlign = 'center';
                ctx.fillText(Statistics.round(xVal, 1), x, pad.top + plotH + 18);
            }
        }

        // Axes
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad.left, pad.top);
        ctx.lineTo(pad.left, pad.top + plotH);
        ctx.lineTo(pad.left + plotW, pad.top + plotH);
        ctx.stroke();

        // Axis labels
        ctx.fillStyle = theme.textSecondary;
        ctx.font = '12px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        if (xLabel) ctx.fillText(xLabel, pad.left + plotW / 2, height - (showLegend ? 35 : 10));
        if (yLabel) {
            ctx.save();
            ctx.translate(15, pad.top + plotH / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(yLabel, 0, 0);
            ctx.restore();
        }

        // Data series
        data.forEach((series, si) => {
            const color = series.color || theme.series[si % theme.series.length];
            const pts = series.points.sort((a, b) => a.x - b.x);

            // CI band
            if (series.ciLower && series.ciUpper) {
                ctx.fillStyle = color + '20';
                ctx.beginPath();
                const lower = series.ciLower.sort((a, b) => a.x - b.x);
                const upper = series.ciUpper.sort((a, b) => a.x - b.x);
                ctx.moveTo(sx(upper[0].x), sy(upper[0].y));
                upper.forEach(p => ctx.lineTo(sx(p.x), sy(p.y)));
                for (let i = lower.length - 1; i >= 0; i--) ctx.lineTo(sx(lower[i].x), sy(lower[i].y));
                ctx.closePath();
                ctx.fill();
            }

            // Line
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            pts.forEach((p, i) => {
                if (i === 0) ctx.moveTo(sx(p.x), sy(p.y));
                else ctx.lineTo(sx(p.x), sy(p.y));
            });
            ctx.stroke();

            // Points
            pts.forEach(p => {
                ctx.beginPath();
                ctx.arc(sx(p.x), sy(p.y), 3, 0, 2 * Math.PI);
                ctx.fillStyle = color;
                ctx.fill();
            });
        });

        // Legend
        if (showLegend && data.length > 1) {
            let lx = pad.left + 10;
            const ly = height - 15;
            ctx.font = '11px system-ui, -apple-system, sans-serif';
            data.forEach((series, si) => {
                const color = series.color || theme.series[si % theme.series.length];
                ctx.fillStyle = color;
                ctx.fillRect(lx, ly - 8, 14, 3);
                ctx.fillStyle = theme.textSecondary;
                ctx.textAlign = 'left';
                ctx.fillText(series.label, lx + 18, ly - 2);
                lx += ctx.measureText(series.label).width + 35;
            });
        }
    }

    // ============================================================
    // FOREST PLOT (publication-quality with heterogeneity, subgroup
    // subtotals, prediction intervals, numeric CI labels)
    // ============================================================

    function ForestPlot(canvas, options) {
        if (!guardCanvas(canvas)) return;

        var studies = options.studies;       // [{name, estimate, ci: {lower, upper}, weight, subgroup?}]
        var summary = options.summary;       // {estimate, ci: {lower, upper}, label?}
        var predInterval = options.predInterval; // {lower, upper}
        var nullValue = options.nullValue !== undefined ? options.nullValue : 0;
        var measureLabel = options.measureLabel || 'Effect Size';
        var logScale = options.logScale || false;
        var title = options.title;
        var width = options.width || 850;
        var heterogeneity = options.heterogeneity; // {I2, Q, p, tau2}
        var subgroupSummaries = options.subgroupSummaries; // {groupName: {estimate, ci:{lower,upper}, label?}}
        var dropShadow = options.dropShadow || false;

        var theme = getTheme();
        var rowH = 28;
        var headerH = 45;
        var footerH = summary ? 60 : 20;
        var subH = 15;

        // Count subgroup header rows for accurate height
        var subgroupCount = 0;
        var seenSubgroups = {};
        studies.forEach(function(s) {
            if (s.subgroup && !seenSubgroups[s.subgroup]) {
                seenSubgroups[s.subgroup] = true;
                subgroupCount++;
            }
        });

        // Extra height for subgroup subtotals and heterogeneity stats
        var subgroupSubtotalH = subgroupSummaries ? Object.keys(subgroupSummaries).length * (rowH + 10) : 0;
        var heteroH = heterogeneity ? 35 : 0;

        var height = options.height || (headerH + studies.length * rowH + subgroupCount * (subH + 5)
            + subgroupSubtotalH + footerH + heteroH + 60);

        var ctx = setupCanvas(canvas, width, height);
        var labelW = 240;
        var statsW = 200;
        var plotLeft = labelW + 10;
        var plotRight = width - statsW - 10;
        var plotW = plotRight - plotLeft;

        // Background
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        // Title
        if (title) {
            ctx.fillStyle = theme.text;
            ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(title, width / 2, 20);
        }

        // Compute plot range
        var allVals = [];
        studies.forEach(function(s) { allVals.push(s.ci.lower, s.ci.upper); });
        if (summary) { allVals.push(summary.ci.lower, summary.ci.upper); }
        if (predInterval) { allVals.push(predInterval.lower, predInterval.upper); }
        if (subgroupSummaries) {
            Object.keys(subgroupSummaries).forEach(function(k) {
                var sg = subgroupSummaries[k];
                allVals.push(sg.ci.lower, sg.ci.upper);
            });
        }
        allVals.push(nullValue);
        var plotMin = Math.min.apply(null, allVals);
        var plotMax = Math.max.apply(null, allVals);
        // Expand range by 10%
        var rangePad = (plotMax - plotMin) * 0.1 || 0.5;
        plotMin -= rangePad;
        plotMax += rangePad;
        if (logScale) {
            plotMin = Math.min(plotMin, nullValue - 1);
            plotMax = Math.max(plotMax, nullValue + 1);
        }
        var plotRange = plotMax - plotMin || 2;

        function sx(v) { return plotLeft + ((v - plotMin) / plotRange) * plotW; }

        // Header
        var y = headerH;
        ctx.fillStyle = theme.textSecondary;
        ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Study', 10, y - 10);
        ctx.textAlign = 'center';
        ctx.fillText(measureLabel, (plotLeft + plotRight) / 2, y - 10);
        ctx.textAlign = 'right';
        ctx.fillText('Estimate [95% CI]', width - statsW / 2, y - 18);
        ctx.fillText('Weight', width - 15, y - 18);

        // Separator
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(5, y); ctx.lineTo(width - 5, y); ctx.stroke();

        // Max weight for scaling squares
        var maxW = 1;
        studies.forEach(function(s) { if ((s.weight || 1) > maxW) maxW = s.weight || 1; });

        // Helper: format value for display
        function fmtVal(v) {
            return logScale ? Math.exp(v).toFixed(2) : v.toFixed(2);
        }

        // Helper: draw a diamond shape
        function drawDiamond(cx, cy, left, right, halfH, fillColor, strokeColor) {
            ctx.fillStyle = fillColor;
            if (strokeColor) ctx.strokeStyle = strokeColor;
            ctx.beginPath();
            ctx.moveTo(left, cy);
            ctx.lineTo(cx, cy - halfH);
            ctx.lineTo(right, cy);
            ctx.lineTo(cx, cy + halfH);
            ctx.closePath();
            if (dropShadow) applyDropShadow(ctx, true);
            ctx.fill();
            if (strokeColor) {
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            if (dropShadow) clearDropShadow(ctx);
        }

        // Studies
        var currentSubgroup = null;
        var subgroupStudyIndices = {}; // track which subgroup ends where
        studies.forEach(function(study, i) {
            // Subgroup headers
            if (study.subgroup && study.subgroup !== currentSubgroup) {
                // If previous subgroup had a subtotal, draw it
                if (currentSubgroup && subgroupSummaries && subgroupSummaries[currentSubgroup]) {
                    y += 5;
                    // Draw subgroup subtotal
                    var sgSum = subgroupSummaries[currentSubgroup];
                    y += rowH;
                    ctx.strokeStyle = theme.border + '80';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath(); ctx.moveTo(5, y - rowH + 2); ctx.lineTo(width - 5, y - rowH + 2); ctx.stroke();

                    ctx.fillStyle = theme.accent + 'cc';
                    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
                    ctx.textAlign = 'left';
                    ctx.fillText('  Subtotal: ' + currentSubgroup, 10, y);

                    var sgCx = sx(sgSum.estimate);
                    var sgDl = sx(sgSum.ci.lower);
                    var sgDr = sx(sgSum.ci.upper);
                    drawDiamond(sgCx, y - 5, sgDl, sgDr, 6, theme.accent + '80', theme.accent);

                    ctx.fillStyle = theme.accent;
                    ctx.font = 'bold 11px "SF Mono", "Fira Code", monospace';
                    ctx.textAlign = 'right';
                    ctx.fillText(fmtVal(sgSum.estimate) + ' [' + fmtVal(sgSum.ci.lower) + ', ' + fmtVal(sgSum.ci.upper) + ']', width - 60, y);
                    y += 5;
                }

                currentSubgroup = study.subgroup;
                y += subH;
                ctx.fillStyle = theme.accent;
                ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(study.subgroup, 10, y);
                y += 5;
            }

            y += rowH;

            // Alternate row bg
            if (i % 2 === 0) {
                ctx.fillStyle = theme.surface + '40';
                ctx.fillRect(0, y - rowH + 5, width, rowH);
            }

            // Study name
            ctx.fillStyle = theme.text;
            ctx.font = '12px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'left';
            var displayName = study.name.length > 32 ? study.name.substring(0, 30) + '...' : study.name;
            ctx.fillText(displayName, 10, y);

            // CI line
            var ciL = Math.max(plotMin, study.ci.lower);
            var ciU = Math.min(plotMax, study.ci.upper);
            ctx.strokeStyle = theme.text;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(sx(ciL), y - 5);
            ctx.lineTo(sx(ciU), y - 5);
            ctx.stroke();

            // Whiskers
            [ciL, ciU].forEach(function(v) {
                if (v > plotMin && v < plotMax) {
                    ctx.beginPath();
                    ctx.moveTo(sx(v), y - 9);
                    ctx.lineTo(sx(v), y - 1);
                    ctx.stroke();
                }
            });

            // Square (proportional to weight)
            var wt = study.weight || 1;
            var sqSize = 4 + (wt / maxW) * 8;
            if (dropShadow) applyDropShadow(ctx, true);
            ctx.fillStyle = theme.accent;
            ctx.fillRect(sx(study.estimate) - sqSize / 2, y - 5 - sqSize / 2, sqSize, sqSize);
            if (dropShadow) clearDropShadow(ctx);

            // Stats text (numeric labels on each row)
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '11px "SF Mono", "Fira Code", monospace';
            ctx.textAlign = 'right';
            var est = fmtVal(study.estimate);
            var ciLt = fmtVal(study.ci.lower);
            var ciUt = fmtVal(study.ci.upper);
            ctx.fillText(est + ' [' + ciLt + ', ' + ciUt + ']', width - 60, y);
            ctx.fillText(wt.toFixed(1) + '%', width - 10, y);
        });

        // Final subgroup subtotal (for the last subgroup)
        if (currentSubgroup && subgroupSummaries && subgroupSummaries[currentSubgroup]) {
            y += 5;
            var sgSum = subgroupSummaries[currentSubgroup];
            y += rowH;
            ctx.strokeStyle = theme.border + '80';
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(5, y - rowH + 2); ctx.lineTo(width - 5, y - rowH + 2); ctx.stroke();

            ctx.fillStyle = theme.accent + 'cc';
            ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('  Subtotal: ' + currentSubgroup, 10, y);

            var sgCx2 = sx(sgSum.estimate);
            var sgDl2 = sx(sgSum.ci.lower);
            var sgDr2 = sx(sgSum.ci.upper);
            drawDiamond(sgCx2, y - 5, sgDl2, sgDr2, 6, theme.accent + '80', theme.accent);

            ctx.fillStyle = theme.accent;
            ctx.font = 'bold 11px "SF Mono", "Fira Code", monospace';
            ctx.textAlign = 'right';
            ctx.fillText(fmtVal(sgSum.estimate) + ' [' + fmtVal(sgSum.ci.lower) + ', ' + fmtVal(sgSum.ci.upper) + ']', width - 60, y);
            y += 5;
        }

        // Summary diamond
        if (summary) {
            y += rowH + 10;
            ctx.strokeStyle = theme.border;
            ctx.beginPath(); ctx.moveTo(5, y - rowH); ctx.lineTo(width - 5, y - rowH); ctx.stroke();

            // Label
            ctx.fillStyle = theme.accent;
            ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(summary.label || 'Overall', 10, y);

            // Diamond (improved with stroke outline)
            var cx = sx(summary.estimate);
            var dl = sx(summary.ci.lower);
            var dr = sx(summary.ci.upper);
            var dh = 9;
            drawDiamond(cx, y - 5, dl, dr, dh, theme.accent + 'cc', theme.accent);

            // Prediction interval dashed line
            if (predInterval) {
                ctx.strokeStyle = theme.accent + '60';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 3]);
                ctx.beginPath();
                ctx.moveTo(sx(predInterval.lower), y - 5);
                ctx.lineTo(sx(predInterval.upper), y - 5);
                ctx.stroke();
                ctx.setLineDash([]);

                // Arrow tips on prediction interval ends
                var piTipSize = 4;
                [predInterval.lower, predInterval.upper].forEach(function(v) {
                    var px = sx(v);
                    ctx.fillStyle = theme.accent + '60';
                    ctx.beginPath();
                    ctx.moveTo(px, y - 5 - piTipSize);
                    ctx.lineTo(px, y - 5 + piTipSize);
                    ctx.stroke();
                });
            }

            // Summary stats
            ctx.fillStyle = theme.accent;
            ctx.font = 'bold 11px "SF Mono", "Fira Code", monospace';
            ctx.textAlign = 'right';
            ctx.fillText(fmtVal(summary.estimate) + ' [' + fmtVal(summary.ci.lower) + ', ' + fmtVal(summary.ci.upper) + ']', width - 60, y);
        }

        // Null line
        ctx.strokeStyle = theme.textTertiary;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(sx(nullValue), headerH);
        ctx.lineTo(sx(nullValue), y + 10);
        ctx.stroke();
        ctx.setLineDash([]);

        // X-axis label
        ctx.fillStyle = theme.textSecondary;
        ctx.font = '11px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        var nv = logScale ? Math.exp(nullValue).toFixed(1) : nullValue.toFixed(1);
        ctx.fillText(nv, sx(nullValue), y + 25);

        // Favors labels
        ctx.font = '10px system-ui, -apple-system, sans-serif';
        ctx.fillText('\u2190 Favors Treatment', (plotLeft + sx(nullValue)) / 2, y + 40);
        ctx.fillText('Favors Control \u2192', (sx(nullValue) + plotRight) / 2, y + 40);

        // Heterogeneity statistics below the plot
        if (heterogeneity) {
            y += 55;
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '11px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'left';
            var hetParts = [];
            if (heterogeneity.I2 !== undefined) hetParts.push('I\u00B2 = ' + heterogeneity.I2.toFixed(1) + '%');
            if (heterogeneity.tau2 !== undefined) hetParts.push('\u03C4\u00B2 = ' + heterogeneity.tau2.toFixed(4));
            if (heterogeneity.Q !== undefined) hetParts.push('Q = ' + heterogeneity.Q.toFixed(2));
            if (heterogeneity.p !== undefined) hetParts.push('p ' + (heterogeneity.p < 0.001 ? '< 0.001' : '= ' + heterogeneity.p.toFixed(3)));
            ctx.fillText('Heterogeneity: ' + hetParts.join(';  '), 10, y);
        }
    }

    // ============================================================
    // FUNNEL PLOT (enhanced with pseudo CI, Egger's, trim-and-fill)
    // ============================================================

    function FunnelPlot(canvas, options) {
        if (!guardCanvas(canvas)) return;

        var effects = options.effects;
        var se = options.se;
        var pooledEffect = options.pooledEffect;
        var eggerLine = options.eggerLine;       // {intercept, slope}
        var imputedEffects = options.imputedEffects;
        var imputedSE = options.imputedSE;
        var title = options.title !== undefined ? options.title : 'Funnel Plot';
        var width = options.width || 600;
        var height = options.height || 450;
        var showPseudoCI = options.showPseudoCI !== undefined ? options.showPseudoCI : true;
        var dropShadow = options.dropShadow || false;
        var xLabel = options.xLabel || 'Effect Size';
        var yLabel = options.yLabel || 'Standard Error';

        var theme = getTheme();
        var ctx = setupCanvas(canvas, width, height);
        var pad = { top: 45, right: 30, bottom: 55, left: 65 };
        var plotW = width - pad.left - pad.right;
        var plotH = height - pad.top - pad.bottom;

        var seMax = Math.max.apply(null, se) * 1.2;
        var maxAbsDiff = 0;
        effects.forEach(function(e) {
            var d = Math.abs(e - pooledEffect);
            if (d > maxAbsDiff) maxAbsDiff = d;
        });
        var effRange = maxAbsDiff * 1.5 + 1.96 * seMax;
        var effMin = pooledEffect - effRange;
        var effMax = pooledEffect + effRange;

        function sx(v) { return pad.left + ((v - effMin) / (effMax - effMin)) * plotW; }
        function sy(v) { return pad.top + (v / seMax) * plotH; }

        // Background
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = theme.text;
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 22);

        // Pseudo-95% CI triangle (filled region)
        if (showPseudoCI) {
            ctx.fillStyle = theme.surface;
            ctx.beginPath();
            ctx.moveTo(sx(pooledEffect), sy(0));
            ctx.lineTo(sx(pooledEffect - 1.96 * seMax), sy(seMax));
            ctx.lineTo(sx(pooledEffect + 1.96 * seMax), sy(seMax));
            ctx.closePath();
            ctx.fill();

            // Dashed CI boundary lines
            ctx.strokeStyle = theme.border;
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.moveTo(sx(pooledEffect), sy(0));
            ctx.lineTo(sx(pooledEffect - 1.96 * seMax), sy(seMax));
            ctx.moveTo(sx(pooledEffect), sy(0));
            ctx.lineTo(sx(pooledEffect + 1.96 * seMax), sy(seMax));
            ctx.stroke();
            ctx.setLineDash([]);

            // Additional 99% CI contour lines (lighter)
            ctx.strokeStyle = theme.border + '60';
            ctx.lineWidth = 0.7;
            ctx.setLineDash([2, 4]);
            ctx.beginPath();
            ctx.moveTo(sx(pooledEffect), sy(0));
            ctx.lineTo(sx(pooledEffect - 2.576 * seMax), sy(seMax));
            ctx.moveTo(sx(pooledEffect), sy(0));
            ctx.lineTo(sx(pooledEffect + 2.576 * seMax), sy(seMax));
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Grid
        ctx.strokeStyle = theme.grid;
        ctx.lineWidth = 1;
        for (var i = 0; i <= 4; i++) {
            var v = (seMax * i) / 4;
            ctx.beginPath(); ctx.moveTo(pad.left, sy(v)); ctx.lineTo(pad.left + plotW, sy(v)); ctx.stroke();
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '11px system-ui';
            ctx.textAlign = 'right';
            ctx.fillText(v.toFixed(2), pad.left - 8, sy(v) + 4);
        }

        // Effect size axis ticks
        var effScale = niceScale(effMin, effMax, 6);
        ctx.fillStyle = theme.textSecondary;
        ctx.font = '11px system-ui';
        ctx.textAlign = 'center';
        effScale.ticks.forEach(function(tv) {
            if (tv >= effMin && tv <= effMax) {
                ctx.fillText(tv.toFixed(2), sx(tv), pad.top + plotH + 18);
                ctx.strokeStyle = theme.grid;
                ctx.beginPath();
                ctx.moveTo(sx(tv), pad.top + plotH);
                ctx.lineTo(sx(tv), pad.top + plotH + 4);
                ctx.stroke();
            }
        });

        // Pooled effect line
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx(pooledEffect), pad.top);
        ctx.lineTo(sx(pooledEffect), pad.top + plotH);
        ctx.stroke();

        // Axes
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad.left, pad.top);
        ctx.lineTo(pad.left, pad.top + plotH);
        ctx.lineTo(pad.left + plotW, pad.top + plotH);
        ctx.stroke();

        // Points (observed studies)
        effects.forEach(function(e, idx) {
            if (dropShadow) applyDropShadow(ctx, true);
            ctx.beginPath();
            ctx.arc(sx(e), sy(se[idx]), 4, 0, 2 * Math.PI);
            ctx.fillStyle = theme.accent;
            ctx.fill();
            if (dropShadow) clearDropShadow(ctx);
        });

        // Imputed points (trim-and-fill) — different marker
        if (imputedEffects && imputedSE) {
            imputedEffects.forEach(function(e, idx) {
                var px = sx(e);
                var py = sy(imputedSE[idx]);
                // Open diamond marker for imputed studies
                ctx.fillStyle = theme.danger + '30';
                ctx.strokeStyle = theme.danger;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(px, py - 5);
                ctx.lineTo(px + 5, py);
                ctx.lineTo(px, py + 5);
                ctx.lineTo(px - 5, py);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            });
        }

        // Egger's regression line
        if (eggerLine) {
            ctx.strokeStyle = theme.warning;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            // Egger's regression: effect = intercept + slope * se
            // Plot from se=0 to se=seMax
            var eff0 = eggerLine.intercept;
            var eff1 = eggerLine.intercept + eggerLine.slope * seMax;
            ctx.moveTo(sx(eff0), sy(0));
            ctx.lineTo(sx(eff1), sy(seMax));
            ctx.stroke();
            ctx.setLineDash([]);

            // Egger's line label
            ctx.fillStyle = theme.warning;
            ctx.font = '10px system-ui';
            ctx.textAlign = 'left';
            ctx.fillText("Egger's", sx(eff1) + 4, sy(seMax) - 4);
        }

        // Legend for imputed studies
        if (imputedEffects && imputedEffects.length > 0) {
            var lx = pad.left + 5;
            var ly = pad.top + 12;
            ctx.fillStyle = theme.accent;
            ctx.beginPath(); ctx.arc(lx + 4, ly, 4, 0, 2 * Math.PI); ctx.fill();
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '10px system-ui';
            ctx.textAlign = 'left';
            ctx.fillText('Observed', lx + 12, ly + 3);

            ly += 16;
            ctx.fillStyle = theme.danger + '30';
            ctx.strokeStyle = theme.danger;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(lx + 4, ly - 4);
            ctx.lineTo(lx + 8, ly);
            ctx.lineTo(lx + 4, ly + 4);
            ctx.lineTo(lx, ly);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '10px system-ui';
            ctx.textAlign = 'left';
            ctx.fillText('Imputed (trim-fill)', lx + 12, ly + 3);
        }

        // Labels
        ctx.fillStyle = theme.textSecondary;
        ctx.font = '12px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(xLabel, width / 2, height - 10);
        ctx.save();
        ctx.translate(15, pad.top + plotH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(yLabel, 0, 0);
        ctx.restore();
    }

    // ============================================================
    // BAR CHART (enhanced: value labels, horizontal, grouped+stacked)
    // ============================================================

    function BarChart(canvas, options) {
        if (!guardCanvas(canvas)) return;

        var categories = options.categories;  // ['mRS 0', 'mRS 1', ...]
        var series = options.series;          // [{label, values: [...], stackGroup?}]
        var title = options.title;
        var yLabel = options.yLabel;
        var xLabel = options.xLabel;
        var stacked = options.stacked || false;
        var errorBars = options.errorBars;    // [{upper: [...], lower: [...]}]
        var width = options.width || 600;
        var height = options.height || 400;
        var colors = options.colors;
        var showValueLabels = options.showValueLabels !== undefined ? options.showValueLabels : false;
        var horizontal = options.horizontal || false;
        var dropShadow = options.dropShadow || false;
        var valueLabelFormat = options.valueLabelFormat || function(v) { return v % 1 === 0 ? v.toString() : v.toFixed(1); };

        if (!categories || !series || !categories.length || !series.length) return;

        var theme = getTheme();
        var ctx = setupCanvas(canvas, width, height);

        var pad;
        if (horizontal) {
            pad = { top: title ? 55 : 40, right: 40, bottom: 50, left: 120 };
        } else {
            pad = { top: title ? 55 : 40, right: 20, bottom: 70, left: 60 };
        }
        var plotW = width - pad.left - pad.right;
        var plotH = height - pad.top - pad.bottom;

        // Background
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        if (title) {
            ctx.fillStyle = theme.text;
            ctx.font = 'bold 13px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(title, width / 2, 22);
        }

        // Detect grouped+stacked combination:
        // If series have stackGroup property, group them by stackGroup
        var hasStackGroups = series.some(function(s) { return s.stackGroup !== undefined; });
        var stackGroupMap = {}; // stackGroup -> [seriesIndices]
        var stackGroupOrder = [];
        if (hasStackGroups) {
            series.forEach(function(s, si) {
                var grp = s.stackGroup !== undefined ? s.stackGroup : si;
                if (!stackGroupMap[grp]) {
                    stackGroupMap[grp] = [];
                    stackGroupOrder.push(grp);
                }
                stackGroupMap[grp].push(si);
            });
        }

        // Compute max
        var valMax = 0;
        if (stacked || hasStackGroups) {
            categories.forEach(function(_, ci) {
                if (hasStackGroups) {
                    stackGroupOrder.forEach(function(grp) {
                        var sum = 0;
                        stackGroupMap[grp].forEach(function(si) { sum += (series[si].values[ci] || 0); });
                        if (sum > valMax) valMax = sum;
                    });
                } else {
                    var sum = 0;
                    series.forEach(function(sr) { sum += (sr.values[ci] || 0); });
                    if (sum > valMax) valMax = sum;
                }
            });
        } else {
            series.forEach(function(s) {
                s.values.forEach(function(v) { if (v > valMax) valMax = v; });
            });
            if (errorBars) {
                errorBars.forEach(function(eb) {
                    if (eb && eb.upper) eb.upper.forEach(function(v) { if (v > valMax) valMax = v; });
                });
            }
        }
        valMax *= 1.15;

        var nCats = categories.length;

        // Helper functions depend on orientation
        var sVal, sCat;
        if (horizontal) {
            // Value axis is horizontal (X), category axis is vertical (Y)
            sVal = function(v) { return pad.left + (v / valMax) * plotW; };
            sCat = function(ci) { return pad.top + ci * (plotH / nCats); };
        } else {
            sVal = function(v) { return pad.top + plotH * (1 - v / valMax); };
            sCat = function(ci) { return pad.left + ci * (plotW / nCats); };
        }

        var groupDim = horizontal ? (plotH / nCats) : (plotW / nCats);
        var nBarGroups, barDim;

        if (hasStackGroups) {
            nBarGroups = stackGroupOrder.length;
            barDim = groupDim * 0.7 / nBarGroups;
        } else if (stacked) {
            barDim = groupDim * 0.6;
        } else {
            barDim = groupDim * 0.7 / series.length;
        }

        // Grid lines and axis ticks
        var valScale = niceScale(0, valMax, 6);
        ctx.strokeStyle = theme.grid;
        ctx.lineWidth = 1;
        valScale.ticks.forEach(function(tv) {
            if (tv < 0 || tv > valMax) return;
            if (horizontal) {
                var gx = sVal(tv);
                ctx.beginPath(); ctx.moveTo(gx, pad.top); ctx.lineTo(gx, pad.top + plotH); ctx.stroke();
                ctx.fillStyle = theme.textSecondary;
                ctx.font = '11px system-ui';
                ctx.textAlign = 'center';
                ctx.fillText(tv % 1 === 0 ? tv.toString() : tv.toFixed(1), gx, pad.top + plotH + 16);
            } else {
                var gy = sVal(tv);
                ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(pad.left + plotW, gy); ctx.stroke();
                ctx.fillStyle = theme.textSecondary;
                ctx.font = '11px system-ui';
                ctx.textAlign = 'right';
                ctx.fillText(tv % 1 === 0 ? tv.toString() : tv.toFixed(1), pad.left - 8, gy + 4);
            }
        });

        // Draw bars
        categories.forEach(function(cat, ci) {
            if (hasStackGroups) {
                // Grouped + stacked combination
                stackGroupOrder.forEach(function(grp, gi) {
                    var stackBase = horizontal ? sVal(0) : sVal(0);
                    stackGroupMap[grp].forEach(function(si) {
                        var color = (colors && colors[si]) || theme.series[si % theme.series.length];
                        var val = series[si].values[ci] || 0;

                        if (horizontal) {
                            var barLen = (val / valMax) * plotW;
                            var by = sCat(ci) + (groupDim * 0.15) + gi * barDim;
                            if (dropShadow) applyDropShadow(ctx, true);
                            ctx.fillStyle = color;
                            drawRoundedRect(ctx, stackBase, by, barLen, barDim, 2);
                            ctx.fill();
                            if (dropShadow) clearDropShadow(ctx);
                            stackBase += barLen;
                        } else {
                            var barH = (val / valMax) * plotH;
                            var bx = sCat(ci) + (groupDim * 0.15) + gi * barDim;
                            var by2 = stackBase - barH;
                            if (dropShadow) applyDropShadow(ctx, true);
                            ctx.fillStyle = color;
                            drawRoundedRect(ctx, bx, by2, barDim, Math.max(1, barH), 2);
                            ctx.fill();
                            if (dropShadow) clearDropShadow(ctx);

                            if (showValueLabels && val > 0) {
                                ctx.fillStyle = theme.text;
                                ctx.font = '10px system-ui';
                                ctx.textAlign = 'center';
                                ctx.fillText(valueLabelFormat(val), bx + barDim / 2, by2 - 4);
                            }
                            stackBase = by2;
                        }
                    });
                });
            } else if (horizontal) {
                var stackX = sVal(0);
                series.forEach(function(s, si) {
                    var color = (colors && colors[si]) || theme.series[si % theme.series.length];
                    var val = s.values[ci] || 0;
                    var barLen = (val / valMax) * plotW;

                    var by, bx;
                    if (stacked) {
                        by = sCat(ci) + (groupDim - barDim) / 2;
                        bx = stackX;
                        stackX += barLen;
                    } else {
                        by = sCat(ci) + (groupDim * 0.15) + si * barDim;
                        bx = sVal(0);
                    }

                    if (dropShadow) applyDropShadow(ctx, true);
                    ctx.fillStyle = color;
                    drawRoundedRect(ctx, bx, by, Math.max(1, barLen), barDim, 2);
                    ctx.fill();
                    if (dropShadow) clearDropShadow(ctx);

                    // Value labels at end of bar
                    if (showValueLabels && val > 0) {
                        ctx.fillStyle = theme.text;
                        ctx.font = '10px system-ui';
                        ctx.textAlign = 'left';
                        ctx.fillText(valueLabelFormat(val), bx + barLen + 4, by + barDim / 2 + 3);
                    }
                });
            } else {
                // Vertical bars (original behavior)
                var gx = sCat(ci);
                var stackY = sVal(0);

                series.forEach(function(s, si) {
                    var color = (colors && colors[si]) || theme.series[si % theme.series.length];
                    var val = s.values[ci] || 0;
                    var barH = (val / valMax) * plotH;

                    var bx, by;
                    if (stacked) {
                        bx = gx + (groupDim - barDim) / 2;
                        by = stackY - barH;
                        stackY = by;
                    } else {
                        bx = gx + (groupDim * 0.15) + si * barDim;
                        by = sVal(val);
                    }

                    if (dropShadow) applyDropShadow(ctx, true);
                    ctx.fillStyle = color;
                    drawRoundedRect(ctx, bx, by, barDim, Math.max(1, stacked ? barH : sVal(0) - by), 2);
                    ctx.fill();
                    if (dropShadow) clearDropShadow(ctx);

                    // Value labels on top of bars
                    if (showValueLabels && val > 0) {
                        ctx.fillStyle = theme.text;
                        ctx.font = '10px system-ui';
                        ctx.textAlign = 'center';
                        ctx.fillText(valueLabelFormat(val), bx + barDim / 2, by - 4);
                    }

                    // Error bars
                    if (errorBars && errorBars[si] && !stacked) {
                        var ub = errorBars[si].upper[ci];
                        var lb = errorBars[si].lower[ci];
                        var ecx = bx + barDim / 2;
                        ctx.strokeStyle = theme.text;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(ecx, sVal(lb)); ctx.lineTo(ecx, sVal(ub));
                        ctx.moveTo(ecx - 3, sVal(ub)); ctx.lineTo(ecx + 3, sVal(ub));
                        ctx.moveTo(ecx - 3, sVal(lb)); ctx.lineTo(ecx + 3, sVal(lb));
                        ctx.stroke();
                    }
                });
            }

            // Category label
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '11px system-ui';
            if (horizontal) {
                ctx.textAlign = 'right';
                ctx.fillText(cat, pad.left - 8, sCat(ci) + groupDim / 2 + 4);
            } else {
                ctx.textAlign = 'center';
                ctx.save();
                ctx.translate(sCat(ci) + groupDim / 2, pad.top + plotH + 15);
                if (cat.length > 8) ctx.rotate(-0.3);
                ctx.fillText(cat, 0, 0);
                ctx.restore();
            }
        });

        // Axes
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (horizontal) {
            ctx.moveTo(pad.left, pad.top);
            ctx.lineTo(pad.left, pad.top + plotH);
            ctx.lineTo(pad.left + plotW, pad.top + plotH);
        } else {
            ctx.moveTo(pad.left, pad.top);
            ctx.lineTo(pad.left, pad.top + plotH);
            ctx.lineTo(pad.left + plotW, pad.top + plotH);
        }
        ctx.stroke();

        // Axis labels
        if (horizontal) {
            if (xLabel || yLabel) {
                ctx.fillStyle = theme.textSecondary;
                ctx.font = '12px system-ui';
                ctx.textAlign = 'center';
                if (yLabel) ctx.fillText(yLabel, width / 2, height - 8);
                if (xLabel) {
                    ctx.save();
                    ctx.translate(15, pad.top + plotH / 2);
                    ctx.rotate(-Math.PI / 2);
                    ctx.fillText(xLabel, 0, 0);
                    ctx.restore();
                }
            }
        } else {
            if (yLabel) {
                ctx.fillStyle = theme.textSecondary;
                ctx.font = '12px system-ui';
                ctx.save();
                ctx.translate(15, pad.top + plotH / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.textAlign = 'center';
                ctx.fillText(yLabel, 0, 0);
                ctx.restore();
            }
        }

        // Legend
        if (series.length > 1) {
            var lx = pad.left;
            var ly = height - 10;
            ctx.font = '11px system-ui';
            series.forEach(function(s, si) {
                var color = (colors && colors[si]) || theme.series[si % theme.series.length];
                ctx.fillStyle = color;
                ctx.fillRect(lx, ly - 8, 12, 10);
                ctx.fillStyle = theme.textSecondary;
                ctx.textAlign = 'left';
                ctx.fillText(s.label, lx + 16, ly);
                lx += ctx.measureText(s.label).width + 30;
            });
        }
    }

    // ============================================================
    // ICON ARRAY (Cates Plot)
    // ============================================================

    function IconArray(canvas, options) {
        if (!guardCanvas(canvas)) return;
        const {
            cer, // control event rate
            eer, // experimental event rate
            n = 100,
            title,
            width = 500, height = 400
        } = options;

        const theme = getTheme();
        const ctx = setupCanvas(canvas, width, height);

        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        const pad = { top: title ? 50 : 20, left: 30, right: 30, bottom: 80 };
        const gridW = width - pad.left - pad.right;
        const gridH = height - pad.top - pad.bottom;
        const cols = 10;
        const rows = Math.ceil(n / cols);
        const cellW = gridW / cols;
        const cellH = gridH / rows;
        const iconSize = Math.min(cellW, cellH) * 0.6;

        if (title) {
            ctx.fillStyle = theme.text;
            ctx.font = 'bold 13px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(title, width / 2, 25);
        }

        const cerN = Math.round(cer * n);
        const eerN = Math.round(eer * n);
        const prevented = cerN - eerN;
        const harmed = eerN > cerN ? eerN - cerN : 0;

        for (let i = 0; i < n; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const cx = pad.left + col * cellW + cellW / 2;
            const cy = pad.top + row * cellH + cellH / 2;

            let color;
            if (i < eerN) {
                color = theme.danger; // Event with treatment
            } else if (i < cerN) {
                color = theme.success; // Prevented by treatment
            } else {
                color = theme.textTertiary + '40'; // No event
            }

            // Person icon
            ctx.fillStyle = color;
            // Head
            ctx.beginPath();
            ctx.arc(cx, cy - iconSize * 0.25, iconSize * 0.15, 0, 2 * Math.PI);
            ctx.fill();
            // Body
            ctx.beginPath();
            ctx.moveTo(cx, cy - iconSize * 0.1);
            ctx.lineTo(cx, cy + iconSize * 0.2);
            ctx.moveTo(cx - iconSize * 0.15, cy);
            ctx.lineTo(cx + iconSize * 0.15, cy);
            ctx.moveTo(cx, cy + iconSize * 0.2);
            ctx.lineTo(cx - iconSize * 0.1, cy + iconSize * 0.35);
            ctx.moveTo(cx, cy + iconSize * 0.2);
            ctx.lineTo(cx + iconSize * 0.1, cy + iconSize * 0.35);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // Legend
        const ly = height - pad.bottom + 20;
        const items = [
            { color: theme.danger, label: `Events with treatment (${eerN})` },
            { color: theme.success, label: `Events prevented (${prevented})` },
            { color: theme.textTertiary + '40', label: `No event (${n - cerN})` }
        ];
        let lx = pad.left;
        items.forEach(item => {
            ctx.fillStyle = item.color;
            ctx.fillRect(lx, ly, 12, 12);
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '11px system-ui';
            ctx.textAlign = 'left';
            ctx.fillText(item.label, lx + 16, ly + 10);
            lx += ctx.measureText(item.label).width + 30;
        });

        // NNT
        const nnt = prevented > 0 ? Math.round(n / prevented) : '∞';
        ctx.fillStyle = theme.accent;
        ctx.font = 'bold 14px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(`NNT = ${nnt}`, width / 2, height - 10);
    }

    // ============================================================
    // KAPLAN-MEIER PLOT
    // ============================================================

    function KaplanMeierPlot(canvas, options) {
        if (!guardCanvas(canvas)) return;
        const {
            groups, // [{label, table: [{time, survival, se, ciLower, ciUpper, nRisk, events, censored}], color?}]
            medianLines = true,
            showCI = true,
            showCensoring = true,
            showAtRisk = true,
            title = 'Kaplan-Meier Survival Curve',
            xLabel = 'Time', yLabel = 'Survival Probability',
            width = 700, height = 500
        } = options;

        const theme = getTheme();
        const atRiskH = showAtRisk ? 25 * groups.length + 20 : 0;
        const ctx = setupCanvas(canvas, width, height + atRiskH);

        const pad = { top: 50, right: 30, bottom: 55 + atRiskH, left: 65 };
        const plotW = width - pad.left - pad.right;
        const plotH = height - pad.top - 55;

        // Background
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height + atRiskH);

        ctx.fillStyle = theme.text;
        ctx.font = 'bold 13px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 22);

        // Compute ranges
        let tMax = 0;
        groups.forEach(g => g.table.forEach(r => tMax = Math.max(tMax, r.time)));
        tMax *= 1.05;

        function sx(t) { return pad.left + (t / tMax) * plotW; }
        function sy(s) { return pad.top + plotH * (1 - s); }

        // Grid
        ctx.strokeStyle = theme.grid;
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const s = i / 5;
            ctx.beginPath(); ctx.moveTo(pad.left, sy(s)); ctx.lineTo(pad.left + plotW, sy(s)); ctx.stroke();
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '11px system-ui';
            ctx.textAlign = 'right';
            ctx.fillText((s * 100).toFixed(0) + '%', pad.left - 8, sy(s) + 4);
        }

        // Time ticks
        const nTicks = 5;
        for (let i = 0; i <= nTicks; i++) {
            const t = (tMax * i) / nTicks;
            ctx.beginPath(); ctx.moveTo(sx(t), pad.top); ctx.lineTo(sx(t), pad.top + plotH); ctx.stroke();
            ctx.fillStyle = theme.textSecondary;
            ctx.textAlign = 'center';
            ctx.fillText(t.toFixed(0), sx(t), pad.top + plotH + 18);
        }

        // Axes
        ctx.strokeStyle = theme.border;
        ctx.beginPath();
        ctx.moveTo(pad.left, pad.top);
        ctx.lineTo(pad.left, pad.top + plotH);
        ctx.lineTo(pad.left + plotW, pad.top + plotH);
        ctx.stroke();

        // KM curves
        groups.forEach((g, gi) => {
            const color = g.color || theme.series[gi % theme.series.length];

            // CI band
            if (showCI) {
                ctx.fillStyle = color + '15';
                ctx.beginPath();
                let started = false;
                g.table.forEach((r, ri) => {
                    if (ri === 0) { ctx.moveTo(sx(r.time), sy(r.ciUpper || r.survival)); started = true; }
                    else {
                        const prevT = g.table[ri - 1].time;
                        ctx.lineTo(sx(r.time), sy(g.table[ri - 1].ciUpper || g.table[ri - 1].survival));
                        ctx.lineTo(sx(r.time), sy(r.ciUpper || r.survival));
                    }
                });
                for (let ri = g.table.length - 1; ri >= 0; ri--) {
                    const r = g.table[ri];
                    if (ri < g.table.length - 1) {
                        ctx.lineTo(sx(g.table[ri + 1].time), sy(r.ciLower || r.survival));
                    }
                    ctx.lineTo(sx(r.time), sy(r.ciLower || r.survival));
                }
                ctx.closePath();
                ctx.fill();
            }

            // Step function
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            g.table.forEach((r, ri) => {
                if (ri === 0) {
                    ctx.moveTo(sx(r.time), sy(r.survival));
                } else {
                    // Horizontal then vertical (step)
                    ctx.lineTo(sx(r.time), sy(g.table[ri - 1].survival));
                    ctx.lineTo(sx(r.time), sy(r.survival));
                }
            });
            ctx.stroke();

            // Censoring ticks
            if (showCensoring) {
                g.table.forEach(r => {
                    if (r.censored > 0) {
                        ctx.strokeStyle = color;
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(sx(r.time), sy(r.survival) - 5);
                        ctx.lineTo(sx(r.time), sy(r.survival) + 5);
                        ctx.stroke();
                    }
                });
            }

            // Median line
            if (medianLines) {
                const medRow = g.table.find(r => r.survival <= 0.5);
                if (medRow) {
                    ctx.strokeStyle = color + '60';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([3, 3]);
                    ctx.beginPath();
                    ctx.moveTo(pad.left, sy(0.5));
                    ctx.lineTo(sx(medRow.time), sy(0.5));
                    ctx.lineTo(sx(medRow.time), pad.top + plotH);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            }
        });

        // Number at risk table
        if (showAtRisk) {
            const tableY = pad.top + plotH + 40;
            ctx.fillStyle = theme.textSecondary;
            ctx.font = 'bold 11px system-ui';
            ctx.textAlign = 'left';
            ctx.fillText('No. at risk', 5, tableY);

            groups.forEach((g, gi) => {
                const color = g.color || theme.series[gi % theme.series.length];
                const gy = tableY + 18 + gi * 22;
                ctx.fillStyle = color;
                ctx.font = 'bold 11px system-ui';
                ctx.textAlign = 'left';
                ctx.fillText(g.label, 5, gy);

                ctx.font = '11px "SF Mono", monospace';
                for (let i = 0; i <= nTicks; i++) {
                    const t = (tMax * i) / nTicks;
                    // Find closest table entry
                    let nRisk = g.table[0].nRisk;
                    for (const r of g.table) {
                        if (r.time <= t) nRisk = r.nRisk;
                    }
                    ctx.textAlign = 'center';
                    ctx.fillText(nRisk.toString(), sx(t), gy);
                }
            });
        }

        // Axis labels
        ctx.fillStyle = theme.textSecondary;
        ctx.font = '12px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(xLabel, pad.left + plotW / 2, pad.top + plotH + 35);
        ctx.save();
        ctx.translate(15, pad.top + plotH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(yLabel, 0, 0);
        ctx.restore();

        // Legend
        if (groups.length > 1) {
            let lx = pad.left + 10;
            const ly = pad.top + 15;
            groups.forEach((g, gi) => {
                const color = g.color || theme.series[gi % theme.series.length];
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 20, ly); ctx.stroke();
                ctx.fillStyle = theme.text;
                ctx.font = '11px system-ui';
                ctx.textAlign = 'left';
                ctx.fillText(g.label, lx + 24, ly + 4);
                lx += ctx.measureText(g.label).width + 40;
            });
        }
    }

    // ============================================================
    // ROC CURVE
    // ============================================================

    function ROCCurve(canvas, options) {
        if (!guardCanvas(canvas)) return;
        const {
            points, // [{fpr, tpr, threshold?}]
            auc,
            optimalThreshold, // {fpr, tpr}
            title = 'ROC Curve',
            width = 500, height = 500
        } = options;

        const theme = getTheme();
        const ctx = setupCanvas(canvas, width, height);
        const pad = { top: 45, right: 30, bottom: 55, left: 55 };
        const plotW = width - pad.left - pad.right;
        const plotH = height - pad.top - pad.bottom;

        function sx(v) { return pad.left + v * plotW; }
        function sy(v) { return pad.top + plotH * (1 - v); }

        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = theme.text;
        ctx.font = 'bold 13px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 22);

        // Grid
        ctx.strokeStyle = theme.grid;
        for (let i = 0; i <= 5; i++) {
            const v = i / 5;
            ctx.beginPath(); ctx.moveTo(sx(v), pad.top); ctx.lineTo(sx(v), pad.top + plotH); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(pad.left, sy(v)); ctx.lineTo(pad.left + plotW, sy(v)); ctx.stroke();
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '11px system-ui';
            ctx.textAlign = 'right';
            ctx.fillText(v.toFixed(1), pad.left - 8, sy(v) + 4);
            ctx.textAlign = 'center';
            ctx.fillText(v.toFixed(1), sx(v), pad.top + plotH + 18);
        }

        // Diagonal
        ctx.strokeStyle = theme.textTertiary;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]);
        ctx.beginPath(); ctx.moveTo(sx(0), sy(0)); ctx.lineTo(sx(1), sy(1)); ctx.stroke();
        ctx.setLineDash([]);

        // AUC shading
        const sorted = [...points].sort((a, b) => a.fpr - b.fpr);
        ctx.fillStyle = theme.accent + '20';
        ctx.beginPath();
        ctx.moveTo(sx(sorted[0].fpr), sy(0));
        sorted.forEach(p => ctx.lineTo(sx(p.fpr), sy(p.tpr)));
        ctx.lineTo(sx(sorted[sorted.length - 1].fpr), sy(0));
        ctx.closePath();
        ctx.fill();

        // Curve
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        sorted.forEach((p, i) => {
            if (i === 0) ctx.moveTo(sx(p.fpr), sy(p.tpr));
            else ctx.lineTo(sx(p.fpr), sy(p.tpr));
        });
        ctx.stroke();

        // Optimal threshold
        if (optimalThreshold) {
            ctx.beginPath();
            ctx.arc(sx(optimalThreshold.fpr), sy(optimalThreshold.tpr), 6, 0, 2 * Math.PI);
            ctx.fillStyle = theme.warning;
            ctx.fill();
            ctx.strokeStyle = theme.bg;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // AUC text
        if (auc !== undefined) {
            ctx.fillStyle = theme.accent;
            ctx.font = 'bold 13px system-ui';
            ctx.textAlign = 'left';
            ctx.fillText(`AUC = ${auc.toFixed(3)}`, pad.left + 10, pad.top + plotH - 15);
        }

        // Axes
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad.left, pad.top);
        ctx.lineTo(pad.left, pad.top + plotH);
        ctx.lineTo(pad.left + plotW, pad.top + plotH);
        ctx.stroke();

        ctx.fillStyle = theme.textSecondary;
        ctx.font = '12px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('1 - Specificity (FPR)', width / 2, height - 10);
        ctx.save();
        ctx.translate(15, pad.top + plotH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Sensitivity (TPR)', 0, 0);
        ctx.restore();
    }

    // ============================================================
    // HEATMAP TABLE
    // ============================================================

    function HeatmapTable(canvas, options) {
        if (!guardCanvas(canvas)) return;
        const {
            data, // 2D array of values
            rowLabels, colLabels,
            title,
            colorScale = 'sequential', // 'sequential' or 'diverging'
            format = v => v.toFixed(0),
            width: w, height: h
        } = options;

        const theme = getTheme();
        const nRows = data.length;
        const nCols = data[0].length;
        const cellW = 70;
        const cellH = 35;
        const labelW = 120;
        const headerH = 45;
        const width = w || (labelW + nCols * cellW + 20);
        const height = h || (headerH + nRows * cellH + (title ? 35 : 10));

        const ctx = setupCanvas(canvas, width, height);

        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        if (title) {
            ctx.fillStyle = theme.text;
            ctx.font = 'bold 13px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(title, width / 2, 20);
        }

        const topY = title ? 35 : 10;

        // Find range
        let vMin = Infinity, vMax = -Infinity;
        data.forEach(row => row.forEach(v => {
            if (v < vMin) vMin = v;
            if (v > vMax) vMax = v;
        }));

        function cellColor(v) {
            const t = (v - vMin) / (vMax - vMin || 1);
            if (colorScale === 'diverging') {
                if (t < 0.5) {
                    const r = Math.round(34 + (1 - 2 * t) * (248 - 34));
                    return `rgba(${r}, ${Math.round(211 - t * 200)}, ${Math.round(238 - t * 200)}, 0.8)`;
                }
                return `rgba(${Math.round(34 + (2 * t - 1) * 200)}, ${Math.round(211 * (2 - 2 * t))}, ${Math.round(100)}, 0.8)`;
            }
            // Sequential (cyan)
            const alpha = 0.15 + t * 0.7;
            return `rgba(34, 211, 238, ${alpha})`;
        }

        // Column headers
        ctx.fillStyle = theme.textSecondary;
        ctx.font = 'bold 11px system-ui';
        ctx.textAlign = 'center';
        colLabels.forEach((label, i) => {
            ctx.fillText(label, labelW + i * cellW + cellW / 2, topY + headerH - 10);
        });

        // Rows
        data.forEach((row, ri) => {
            const y = topY + headerH + ri * cellH;

            // Row label
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '11px system-ui';
            ctx.textAlign = 'right';
            ctx.fillText(rowLabels[ri], labelW - 10, y + cellH / 2 + 4);

            // Cells
            row.forEach((v, ci) => {
                const x = labelW + ci * cellW;
                ctx.fillStyle = cellColor(v);
                drawRoundedRect(ctx, x + 1, y + 1, cellW - 2, cellH - 2, 3);
                ctx.fill();

                ctx.fillStyle = theme.text;
                ctx.font = '12px "SF Mono", monospace';
                ctx.textAlign = 'center';
                ctx.fillText(format(v), x + cellW / 2, y + cellH / 2 + 4);
            });
        });
    }

    // ============================================================
    // GANTT CHART
    // ============================================================

    function GanttChart(canvas, options) {
        if (!guardCanvas(canvas)) return;
        const {
            tasks, // [{label, start, end, color?, group?}] — start/end in months
            title = 'Project Timeline',
            totalMonths = 60,
            width = 800, height: h
        } = options;

        const theme = getTheme();
        const rowH = 32;
        const headerH = 50;
        const height = h || (headerH + tasks.length * rowH + 40);
        const labelW = 200;

        const ctx = setupCanvas(canvas, width, height);
        const plotW = width - labelW - 30;

        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = theme.text;
        ctx.font = 'bold 13px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 22);

        // Year markers
        const monthW = plotW / totalMonths;
        for (let m = 0; m <= totalMonths; m += 12) {
            const x = labelW + m * monthW;
            ctx.strokeStyle = theme.grid;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(x, headerH - 10); ctx.lineTo(x, headerH + tasks.length * rowH); ctx.stroke();
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '11px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(`Year ${m / 12 + 1}`, x + 6 * monthW, headerH - 15);
        }

        // Tasks
        tasks.forEach((task, i) => {
            const y = headerH + i * rowH;

            // Label
            ctx.fillStyle = theme.text;
            ctx.font = '12px system-ui';
            ctx.textAlign = 'right';
            ctx.fillText(task.label, labelW - 10, y + rowH / 2 + 4);

            // Bar
            const bx = labelW + task.start * monthW;
            const bw = (task.end - task.start) * monthW;
            const color = task.color || theme.series[i % theme.series.length];

            ctx.fillStyle = color + 'cc';
            drawRoundedRect(ctx, bx, y + 6, bw, rowH - 12, 4);
            ctx.fill();

            // Duration text
            const dur = task.end - task.start;
            if (bw > 40) {
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 10px system-ui';
                ctx.textAlign = 'center';
                ctx.fillText(`${dur}mo`, bx + bw / 2, y + rowH / 2 + 3);
            }
        });
    }

    // ============================================================
    // DAG DIAGRAM (simplified — directed acyclic graph)
    // ============================================================

    function DAGDiagram(container, options) {
        const {
            nodes, // [{id, label, type: 'exposure'|'outcome'|'confounder'|'mediator'|'collider', x, y}]
            edges, // [{from, to}]
            width = 700, height = 400
        } = options;

        const theme = getTheme();
        const canvas = container.tagName === 'CANVAS' ? container : (() => {
            const c = document.createElement('canvas');
            container.appendChild(c);
            return c;
        })();
        const ctx = setupCanvas(canvas, width, height);

        const typeColors = {
            exposure: theme.accent,
            outcome: theme.success,
            confounder: theme.warning,
            mediator: theme.info,
            collider: theme.danger,
            default: theme.textSecondary
        };

        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        // Draw edges (arrows)
        edges.forEach(edge => {
            const from = nodes.find(n => n.id === edge.from);
            const to = nodes.find(n => n.id === edge.to);
            if (!from || !to) return;

            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const nx = dx / dist;
            const ny = dy / dist;

            const startX = from.x + nx * 40;
            const startY = from.y + ny * 20;
            const endX = to.x - nx * 40;
            const endY = to.y - ny * 20;

            ctx.strokeStyle = theme.textTertiary;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Arrowhead
            const angle = Math.atan2(endY - startY, endX - startX);
            const aLen = 10;
            ctx.fillStyle = theme.textTertiary;
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - aLen * Math.cos(angle - 0.3), endY - aLen * Math.sin(angle - 0.3));
            ctx.lineTo(endX - aLen * Math.cos(angle + 0.3), endY - aLen * Math.sin(angle + 0.3));
            ctx.closePath();
            ctx.fill();
        });

        // Draw nodes
        nodes.forEach(node => {
            const color = typeColors[node.type] || typeColors.default;

            // Node box
            ctx.fillStyle = theme.surface;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            const tw = Math.max(70, node.label.length * 8 + 20);
            drawRoundedRect(ctx, node.x - tw / 2, node.y - 18, tw, 36, 8);
            ctx.fill();
            ctx.stroke();

            // Label
            ctx.fillStyle = theme.text;
            ctx.font = '12px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(node.label, node.x, node.y + 4);

            // Type badge
            ctx.fillStyle = color;
            ctx.font = '9px system-ui';
            ctx.fillText(node.type, node.x, node.y + 28);
        });
    }

    // ============================================================
    // BOX PLOT
    // ============================================================

    function BoxPlot(canvas, options) {
        if (!guardCanvas(canvas)) return;

        var groups = options.groups;          // [{label, data: [...]}]
        var title = options.title;
        var yLabel = options.yLabel;
        var xLabel = options.xLabel;
        var showPoints = options.showPoints !== undefined ? options.showPoints : true;
        var horizontal = options.horizontal || false;
        var width = options.width || 600;
        var height = options.height || 400;
        var dropShadow = options.dropShadow || false;
        var showMean = options.showMean !== undefined ? options.showMean : true;
        var jitterWidth = options.jitterWidth || 0.3;

        if (!groups || !groups.length) return;

        var theme = getTheme();
        var ctx = setupCanvas(canvas, width, height);

        var pad;
        if (horizontal) {
            pad = { top: title ? 55 : 40, right: 30, bottom: 50, left: 120 };
        } else {
            pad = { top: title ? 55 : 40, right: 30, bottom: 60, left: 65 };
        }
        var plotW = width - pad.left - pad.right;
        var plotH = height - pad.top - pad.bottom;

        // Background
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        if (title) {
            ctx.fillStyle = theme.text;
            ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(title, width / 2, 22);
        }

        // Compute statistics for each group
        function computeStats(data) {
            var sorted = data.slice().sort(function(a, b) { return a - b; });
            var n = sorted.length;
            var q1Idx = Math.floor(n * 0.25);
            var q2Idx = Math.floor(n * 0.5);
            var q3Idx = Math.floor(n * 0.75);
            var q1 = sorted[q1Idx];
            var median = n % 2 === 0 ? (sorted[q2Idx - 1] + sorted[q2Idx]) / 2 : sorted[q2Idx];
            var q3 = sorted[q3Idx];
            var iqr = q3 - q1;
            var whiskerLow = q1 - 1.5 * iqr;
            var whiskerHigh = q3 + 1.5 * iqr;
            // Clamp whiskers to actual data range
            var wLow = sorted[0];
            for (var i = 0; i < n; i++) {
                if (sorted[i] >= whiskerLow) { wLow = sorted[i]; break; }
            }
            var wHigh = sorted[n - 1];
            for (var j = n - 1; j >= 0; j--) {
                if (sorted[j] <= whiskerHigh) { wHigh = sorted[j]; break; }
            }
            var sum = 0;
            data.forEach(function(v) { sum += v; });
            var mean = sum / n;
            var outliers = sorted.filter(function(v) { return v < wLow || v > wHigh; });
            return {
                min: sorted[0], max: sorted[n - 1],
                q1: q1, median: median, q3: q3,
                whiskerLow: wLow, whiskerHigh: wHigh,
                mean: mean, iqr: iqr, outliers: outliers, n: n
            };
        }

        var stats = groups.map(function(g) { return computeStats(g.data); });

        // Value range
        var vMin = Infinity, vMax = -Infinity;
        stats.forEach(function(s) {
            if (s.min < vMin) vMin = s.min;
            if (s.max > vMax) vMax = s.max;
        });
        var vPad = (vMax - vMin) * 0.1 || 1;
        vMin -= vPad;
        vMax += vPad;

        var valScale = niceScale(vMin, vMax, 6);
        vMin = valScale.min;
        vMax = valScale.max;

        var nGroups = groups.length;
        var groupDim = horizontal ? (plotH / nGroups) : (plotW / nGroups);
        var boxWidth = Math.min(groupDim * 0.5, 50);

        // Scale functions
        var sVal, sGroup;
        if (horizontal) {
            sVal = function(v) { return pad.left + ((v - vMin) / (vMax - vMin)) * plotW; };
            sGroup = function(gi) { return pad.top + gi * groupDim + groupDim / 2; };
        } else {
            sVal = function(v) { return pad.top + plotH - ((v - vMin) / (vMax - vMin)) * plotH; };
            sGroup = function(gi) { return pad.left + gi * groupDim + groupDim / 2; };
        }

        // Grid lines
        ctx.strokeStyle = theme.grid;
        ctx.lineWidth = 1;
        valScale.ticks.forEach(function(tv) {
            if (horizontal) {
                var gx = sVal(tv);
                ctx.beginPath(); ctx.moveTo(gx, pad.top); ctx.lineTo(gx, pad.top + plotH); ctx.stroke();
                ctx.fillStyle = theme.textSecondary;
                ctx.font = '11px system-ui';
                ctx.textAlign = 'center';
                ctx.fillText(tv.toFixed(tv % 1 === 0 ? 0 : 1), gx, pad.top + plotH + 16);
            } else {
                var gy = sVal(tv);
                ctx.beginPath(); ctx.moveTo(pad.left, gy); ctx.lineTo(pad.left + plotW, gy); ctx.stroke();
                ctx.fillStyle = theme.textSecondary;
                ctx.font = '11px system-ui';
                ctx.textAlign = 'right';
                ctx.fillText(tv.toFixed(tv % 1 === 0 ? 0 : 1), pad.left - 8, gy + 4);
            }
        });

        // Axes
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (horizontal) {
            ctx.moveTo(pad.left, pad.top);
            ctx.lineTo(pad.left, pad.top + plotH);
            ctx.lineTo(pad.left + plotW, pad.top + plotH);
        } else {
            ctx.moveTo(pad.left, pad.top);
            ctx.lineTo(pad.left, pad.top + plotH);
            ctx.lineTo(pad.left + plotW, pad.top + plotH);
        }
        ctx.stroke();

        // Pseudo-random deterministic jitter
        function seededRandom(seed) {
            var x = Math.sin(seed + 1) * 10000;
            return x - Math.floor(x);
        }

        // Draw each group
        groups.forEach(function(g, gi) {
            var s = stats[gi];
            var color = theme.series[gi % theme.series.length];
            var center = sGroup(gi);
            var halfBox = boxWidth / 2;

            if (horizontal) {
                // Whisker line
                ctx.strokeStyle = theme.text;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(sVal(s.whiskerLow), center);
                ctx.lineTo(sVal(s.whiskerHigh), center);
                ctx.stroke();

                // Whisker caps
                ctx.beginPath();
                ctx.moveTo(sVal(s.whiskerLow), center - halfBox * 0.4);
                ctx.lineTo(sVal(s.whiskerLow), center + halfBox * 0.4);
                ctx.moveTo(sVal(s.whiskerHigh), center - halfBox * 0.4);
                ctx.lineTo(sVal(s.whiskerHigh), center + halfBox * 0.4);
                ctx.stroke();

                // Box
                var boxL = sVal(s.q1);
                var boxR = sVal(s.q3);
                if (dropShadow) applyDropShadow(ctx, true);
                ctx.fillStyle = color + '40';
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.fillRect(boxL, center - halfBox, boxR - boxL, boxWidth);
                ctx.strokeRect(boxL, center - halfBox, boxR - boxL, boxWidth);
                if (dropShadow) clearDropShadow(ctx);

                // Median line
                ctx.strokeStyle = theme.text;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(sVal(s.median), center - halfBox);
                ctx.lineTo(sVal(s.median), center + halfBox);
                ctx.stroke();

                // Mean marker (diamond)
                if (showMean) {
                    var mx = sVal(s.mean);
                    ctx.fillStyle = theme.warning;
                    ctx.beginPath();
                    ctx.moveTo(mx, center - 4);
                    ctx.lineTo(mx + 4, center);
                    ctx.lineTo(mx, center + 4);
                    ctx.lineTo(mx - 4, center);
                    ctx.closePath();
                    ctx.fill();
                }

                // Individual points (jittered)
                if (showPoints) {
                    g.data.forEach(function(v, pi) {
                        var jitter = (seededRandom(pi * 31 + gi * 97) - 0.5) * halfBox * jitterWidth * 2;
                        ctx.beginPath();
                        ctx.arc(sVal(v), center + jitter, 2, 0, 2 * Math.PI);
                        ctx.fillStyle = color + '60';
                        ctx.fill();
                    });
                }

                // Outlier markers
                s.outliers.forEach(function(v) {
                    ctx.beginPath();
                    ctx.arc(sVal(v), center, 3.5, 0, 2 * Math.PI);
                    ctx.fillStyle = 'transparent';
                    ctx.strokeStyle = theme.danger;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                });

                // Group label
                ctx.fillStyle = theme.textSecondary;
                ctx.font = '11px system-ui';
                ctx.textAlign = 'right';
                ctx.fillText(g.label, pad.left - 8, center + 4);
            } else {
                // Vertical box plot
                // Whisker line
                ctx.strokeStyle = theme.text;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(center, sVal(s.whiskerLow));
                ctx.lineTo(center, sVal(s.whiskerHigh));
                ctx.stroke();

                // Whisker caps
                ctx.beginPath();
                ctx.moveTo(center - halfBox * 0.4, sVal(s.whiskerLow));
                ctx.lineTo(center + halfBox * 0.4, sVal(s.whiskerLow));
                ctx.moveTo(center - halfBox * 0.4, sVal(s.whiskerHigh));
                ctx.lineTo(center + halfBox * 0.4, sVal(s.whiskerHigh));
                ctx.stroke();

                // Box (Q1 to Q3)
                var boxTop = sVal(s.q3);
                var boxBot = sVal(s.q1);
                if (dropShadow) applyDropShadow(ctx, true);
                ctx.fillStyle = color + '40';
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.fillRect(center - halfBox, boxTop, boxWidth, boxBot - boxTop);
                ctx.strokeRect(center - halfBox, boxTop, boxWidth, boxBot - boxTop);
                if (dropShadow) clearDropShadow(ctx);

                // Median line
                ctx.strokeStyle = theme.text;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(center - halfBox, sVal(s.median));
                ctx.lineTo(center + halfBox, sVal(s.median));
                ctx.stroke();

                // Mean marker (diamond)
                if (showMean) {
                    var my = sVal(s.mean);
                    ctx.fillStyle = theme.warning;
                    ctx.beginPath();
                    ctx.moveTo(center, my - 4);
                    ctx.lineTo(center + 4, my);
                    ctx.lineTo(center, my + 4);
                    ctx.lineTo(center - 4, my);
                    ctx.closePath();
                    ctx.fill();
                }

                // Individual points (jittered)
                if (showPoints) {
                    g.data.forEach(function(v, pi) {
                        var jitter = (seededRandom(pi * 31 + gi * 97) - 0.5) * halfBox * jitterWidth * 2;
                        ctx.beginPath();
                        ctx.arc(center + jitter, sVal(v), 2, 0, 2 * Math.PI);
                        ctx.fillStyle = color + '60';
                        ctx.fill();
                    });
                }

                // Outlier markers
                s.outliers.forEach(function(v) {
                    ctx.beginPath();
                    ctx.arc(center, sVal(v), 3.5, 0, 2 * Math.PI);
                    ctx.fillStyle = 'transparent';
                    ctx.strokeStyle = theme.danger;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                });

                // Group label
                ctx.fillStyle = theme.textSecondary;
                ctx.font = '11px system-ui';
                ctx.textAlign = 'center';
                ctx.save();
                ctx.translate(center, pad.top + plotH + 18);
                if (g.label.length > 10) ctx.rotate(-0.3);
                ctx.fillText(g.label, 0, 0);
                ctx.restore();
            }
        });

        // Axis labels
        ctx.fillStyle = theme.textSecondary;
        ctx.font = '12px system-ui';
        if (horizontal) {
            ctx.textAlign = 'center';
            if (xLabel) ctx.fillText(xLabel, pad.left + plotW / 2, height - 10);
            if (yLabel) {
                ctx.save();
                ctx.translate(15, pad.top + plotH / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.fillText(yLabel, 0, 0);
                ctx.restore();
            }
        } else {
            ctx.textAlign = 'center';
            if (xLabel) ctx.fillText(xLabel, pad.left + plotW / 2, height - 8);
            if (yLabel) {
                ctx.save();
                ctx.translate(15, pad.top + plotH / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.fillText(yLabel, 0, 0);
                ctx.restore();
            }
        }
    }

    // ============================================================
    // DOT PLOT (effect estimates with CI whiskers)
    // ============================================================

    function DotPlot(canvas, options) {
        if (!guardCanvas(canvas)) return;

        var estimates = options.estimates;  // [{label, estimate, lower, upper, color?}]
        var nullValue = options.nullValue !== undefined ? options.nullValue : 0;
        var title = options.title;
        var xLabel = options.xLabel || 'Effect Estimate';
        var width = options.width || 600;
        var height = options.height || 400;
        var dropShadow = options.dropShadow || false;
        var logScale = options.logScale || false;
        var showLabels = options.showLabels !== undefined ? options.showLabels : true;

        if (!estimates || !estimates.length) return;

        var theme = getTheme();
        var ctx = setupCanvas(canvas, width, height);
        var pad = { top: title ? 55 : 35, right: 30, bottom: 55, left: 200 };
        var plotW = width - pad.left - pad.right;
        var plotH = height - pad.top - pad.bottom;

        // Background
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        if (title) {
            ctx.fillStyle = theme.text;
            ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(title, width / 2, 22);
        }

        // Compute X range
        var allVals = [nullValue];
        estimates.forEach(function(e) {
            allVals.push(e.lower, e.upper, e.estimate);
        });
        var xMin = Math.min.apply(null, allVals);
        var xMax = Math.max.apply(null, allVals);
        var xPad = (xMax - xMin) * 0.15 || 0.5;
        xMin -= xPad;
        xMax += xPad;

        var xScale = niceScale(xMin, xMax, 6);
        xMin = xScale.min;
        xMax = xScale.max;

        function sx(v) { return pad.left + ((v - xMin) / (xMax - xMin)) * plotW; }

        var nEst = estimates.length;
        var rowH = Math.min(plotH / nEst, 35);
        var startY = pad.top + (plotH - nEst * rowH) / 2;

        // Grid lines (vertical)
        ctx.strokeStyle = theme.grid;
        ctx.lineWidth = 1;
        xScale.ticks.forEach(function(tv) {
            var gx = sx(tv);
            ctx.beginPath(); ctx.moveTo(gx, pad.top); ctx.lineTo(gx, pad.top + plotH); ctx.stroke();
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '11px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(tv.toFixed(tv % 1 === 0 ? 0 : 2), gx, pad.top + plotH + 16);
        });

        // Null value reference line
        ctx.strokeStyle = theme.textTertiary;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(sx(nullValue), pad.top);
        ctx.lineTo(sx(nullValue), pad.top + plotH);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw estimates
        estimates.forEach(function(est, i) {
            var cy = startY + i * rowH + rowH / 2;
            var color = est.color || theme.series[i % theme.series.length];

            // Alternate row background
            if (i % 2 === 0) {
                ctx.fillStyle = theme.surface + '40';
                ctx.fillRect(0, cy - rowH / 2, width, rowH);
            }

            // Label
            ctx.fillStyle = theme.text;
            ctx.font = '12px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'right';
            var label = est.label || ('Outcome ' + (i + 1));
            if (label.length > 28) label = label.substring(0, 26) + '...';
            ctx.fillText(label, pad.left - 10, cy + 4);

            // CI whisker line
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(sx(est.lower), cy);
            ctx.lineTo(sx(est.upper), cy);
            ctx.stroke();

            // Whisker caps
            ctx.beginPath();
            ctx.moveTo(sx(est.lower), cy - 4);
            ctx.lineTo(sx(est.lower), cy + 4);
            ctx.moveTo(sx(est.upper), cy - 4);
            ctx.lineTo(sx(est.upper), cy + 4);
            ctx.stroke();

            // Point estimate
            if (dropShadow) applyDropShadow(ctx, true);
            ctx.beginPath();
            ctx.arc(sx(est.estimate), cy, 5, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = theme.bg;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            if (dropShadow) clearDropShadow(ctx);

            // Numeric labels to the right
            if (showLabels) {
                ctx.fillStyle = theme.textSecondary;
                ctx.font = '10px "SF Mono", "Fira Code", monospace';
                ctx.textAlign = 'left';
                var fmtE = logScale ? Math.exp(est.estimate).toFixed(2) : est.estimate.toFixed(2);
                var fmtL = logScale ? Math.exp(est.lower).toFixed(2) : est.lower.toFixed(2);
                var fmtU = logScale ? Math.exp(est.upper).toFixed(2) : est.upper.toFixed(2);
                ctx.fillText(fmtE + ' [' + fmtL + ', ' + fmtU + ']', width - pad.right + 5 - 180, cy + 4);
            }
        });

        // Axes
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad.left, pad.top);
        ctx.lineTo(pad.left, pad.top + plotH);
        ctx.lineTo(pad.left + plotW, pad.top + plotH);
        ctx.stroke();

        // X-axis label
        ctx.fillStyle = theme.textSecondary;
        ctx.font = '12px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(xLabel, pad.left + plotW / 2, height - 10);
    }

    // ============================================================
    // PUBLIC API
    // ============================================================

    return {
        LineChart: LineChart,
        ForestPlot: ForestPlot,
        FunnelPlot: FunnelPlot,
        BarChart: BarChart,
        IconArray: IconArray,
        KaplanMeierPlot: KaplanMeierPlot,
        ROCCurve: ROCCurve,
        HeatmapTable: HeatmapTable,
        GanttChart: GanttChart,
        DAGDiagram: DAGDiagram,
        BoxPlot: BoxPlot,
        DotPlot: DotPlot,
        exportPNG: exportPNG,
        exportHighRes: exportHighRes,
        downloadPNG: downloadPNG,
        getTheme: getTheme,
        setupCanvas: setupCanvas
    };
})();

if (typeof module !== 'undefined') module.exports = Charts;
