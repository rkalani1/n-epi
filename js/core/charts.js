/**
 * NeuroEpi Suite — Canvas Charting Library
 * Publication-quality charts: Forest plots, KM curves, funnel plots, etc.
 * All charts are Retina-aware, theme-aware, and exportable as PNG.
 */

const Charts = (() => {
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
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        return ctx;
    }

    function exportPNG(canvas, filename) {
        const link = document.createElement('a');
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
    // LINE CHART
    // ============================================================

    function LineChart(canvas, options) {
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
    // FOREST PLOT
    // ============================================================

    function ForestPlot(canvas, options) {
        const {
            studies, // [{name, estimate, ci: {lower, upper}, weight, subgroup?}]
            summary, // {estimate, ci: {lower, upper}, label?}
            predInterval, // {lower, upper}
            nullValue = 0,
            measureLabel = 'Effect Size',
            logScale = false,
            title,
            width = 850, height: h
        } = options;

        const theme = getTheme();
        const rowH = 28;
        const headerH = 45;
        const footerH = summary ? 60 : 20;
        const subH = 15;
        const height = h || (headerH + studies.length * rowH + footerH + 60);

        const ctx = setupCanvas(canvas, width, height);
        const labelW = 240;
        const statsW = 200;
        const plotLeft = labelW + 10;
        const plotRight = width - statsW - 10;
        const plotW = plotRight - plotLeft;

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
        let allVals = studies.flatMap(s => [s.ci.lower, s.ci.upper]);
        if (summary) allVals.push(summary.ci.lower, summary.ci.upper);
        if (predInterval) allVals.push(predInterval.lower, predInterval.upper);
        allVals.push(nullValue);
        let plotMin = Math.min(...allVals) * 1.1;
        let plotMax = Math.max(...allVals) * 1.1;
        if (logScale) {
            plotMin = Math.min(plotMin, nullValue - 1);
            plotMax = Math.max(plotMax, nullValue + 1);
        }
        const plotRange = plotMax - plotMin || 2;

        function sx(v) { return plotLeft + ((v - plotMin) / plotRange) * plotW; }

        // Header
        let y = headerH;
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
        const maxW = Math.max(...studies.map(s => s.weight || 1));

        // Studies
        let currentSubgroup = null;
        studies.forEach((study, i) => {
            // Subgroup headers
            if (study.subgroup && study.subgroup !== currentSubgroup) {
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
            const displayName = study.name.length > 32 ? study.name.substring(0, 30) + '...' : study.name;
            ctx.fillText(displayName, 10, y);

            // CI line
            const ciL = Math.max(plotMin, study.ci.lower);
            const ciU = Math.min(plotMax, study.ci.upper);
            ctx.strokeStyle = theme.text;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(sx(ciL), y - 5);
            ctx.lineTo(sx(ciU), y - 5);
            ctx.stroke();

            // Whiskers
            [ciL, ciU].forEach(v => {
                if (v > plotMin && v < plotMax) {
                    ctx.beginPath();
                    ctx.moveTo(sx(v), y - 9);
                    ctx.lineTo(sx(v), y - 1);
                    ctx.stroke();
                }
            });

            // Square (proportional to weight)
            const wt = study.weight || 1;
            const sqSize = 4 + (wt / maxW) * 8;
            ctx.fillStyle = theme.accent;
            ctx.fillRect(sx(study.estimate) - sqSize / 2, y - 5 - sqSize / 2, sqSize, sqSize);

            // Stats text
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '11px "SF Mono", "Fira Code", monospace';
            ctx.textAlign = 'right';
            const est = logScale ? Math.exp(study.estimate).toFixed(2) : study.estimate.toFixed(2);
            const ciLt = logScale ? Math.exp(study.ci.lower).toFixed(2) : study.ci.lower.toFixed(2);
            const ciUt = logScale ? Math.exp(study.ci.upper).toFixed(2) : study.ci.upper.toFixed(2);
            ctx.fillText(`${est} [${ciLt}, ${ciUt}]`, width - 60, y);
            ctx.fillText((wt).toFixed(1) + '%', width - 10, y);
        });

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

            // Diamond
            const cx = sx(summary.estimate);
            const dl = sx(summary.ci.lower);
            const dr = sx(summary.ci.upper);
            const dh = 8;
            ctx.fillStyle = theme.accent + 'cc';
            ctx.beginPath();
            ctx.moveTo(dl, y - 5);
            ctx.lineTo(cx, y - 5 - dh);
            ctx.lineTo(dr, y - 5);
            ctx.lineTo(cx, y - 5 + dh);
            ctx.closePath();
            ctx.fill();

            // Prediction interval
            if (predInterval) {
                ctx.strokeStyle = theme.accent + '60';
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 3]);
                ctx.beginPath();
                ctx.moveTo(sx(predInterval.lower), y - 5);
                ctx.lineTo(sx(predInterval.upper), y - 5);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Summary stats
            ctx.fillStyle = theme.accent;
            ctx.font = 'bold 11px "SF Mono", "Fira Code", monospace';
            ctx.textAlign = 'right';
            const sEst = logScale ? Math.exp(summary.estimate).toFixed(2) : summary.estimate.toFixed(2);
            const sCiL = logScale ? Math.exp(summary.ci.lower).toFixed(2) : summary.ci.lower.toFixed(2);
            const sCiU = logScale ? Math.exp(summary.ci.upper).toFixed(2) : summary.ci.upper.toFixed(2);
            ctx.fillText(`${sEst} [${sCiL}, ${sCiU}]`, width - 60, y);
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
        const nv = logScale ? Math.exp(nullValue).toFixed(1) : nullValue.toFixed(1);
        ctx.fillText(nv, sx(nullValue), y + 25);

        // Favors labels
        ctx.font = '10px system-ui, -apple-system, sans-serif';
        ctx.fillText('← Favors Treatment', (plotLeft + sx(nullValue)) / 2, y + 40);
        ctx.fillText('Favors Control →', (sx(nullValue) + plotRight) / 2, y + 40);
    }

    // ============================================================
    // FUNNEL PLOT
    // ============================================================

    function FunnelPlot(canvas, options) {
        const {
            effects, se,
            pooledEffect,
            eggerLine, // {intercept, slope}
            imputedEffects, imputedSE,
            title = 'Funnel Plot',
            width = 600, height = 450
        } = options;

        const theme = getTheme();
        const ctx = setupCanvas(canvas, width, height);
        const pad = { top: 45, right: 30, bottom: 55, left: 65 };
        const plotW = width - pad.left - pad.right;
        const plotH = height - pad.top - pad.bottom;

        const seMax = Math.max(...se) * 1.2;
        const effRange = Math.max(...effects.map(e => Math.abs(e - pooledEffect))) * 1.5 + 1.96 * seMax;
        const effMin = pooledEffect - effRange;
        const effMax = pooledEffect + effRange;

        function sx(v) { return pad.left + ((v - effMin) / (effMax - effMin)) * plotW; }
        function sy(v) { return pad.top + (v / seMax) * plotH; }

        // Background
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = theme.text;
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 22);

        // Pseudo-95% CI triangle
        ctx.fillStyle = theme.surface;
        ctx.beginPath();
        ctx.moveTo(sx(pooledEffect), sy(0));
        ctx.lineTo(sx(pooledEffect - 1.96 * seMax), sy(seMax));
        ctx.lineTo(sx(pooledEffect + 1.96 * seMax), sy(seMax));
        ctx.closePath();
        ctx.fill();

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

        // Grid
        ctx.strokeStyle = theme.grid;
        for (let i = 0; i <= 4; i++) {
            const v = (seMax * i) / 4;
            ctx.beginPath(); ctx.moveTo(pad.left, sy(v)); ctx.lineTo(pad.left + plotW, sy(v)); ctx.stroke();
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '11px system-ui';
            ctx.textAlign = 'right';
            ctx.fillText(v.toFixed(2), pad.left - 8, sy(v) + 4);
        }

        // Pooled effect line
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx(pooledEffect), pad.top);
        ctx.lineTo(sx(pooledEffect), pad.top + plotH);
        ctx.stroke();

        // Axes
        ctx.strokeStyle = theme.border;
        ctx.beginPath();
        ctx.moveTo(pad.left, pad.top);
        ctx.lineTo(pad.left, pad.top + plotH);
        ctx.lineTo(pad.left + plotW, pad.top + plotH);
        ctx.stroke();

        // Points
        effects.forEach((e, i) => {
            ctx.beginPath();
            ctx.arc(sx(e), sy(se[i]), 4, 0, 2 * Math.PI);
            ctx.fillStyle = theme.accent;
            ctx.fill();
        });

        // Imputed points (trim-fill)
        if (imputedEffects) {
            imputedEffects.forEach((e, i) => {
                ctx.beginPath();
                ctx.arc(sx(e), sy(imputedSE[i]), 4, 0, 2 * Math.PI);
                ctx.fillStyle = theme.danger + '80';
                ctx.fill();
                ctx.strokeStyle = theme.danger;
                ctx.lineWidth = 1;
                ctx.stroke();
            });
        }

        // Egger's line
        if (eggerLine) {
            ctx.strokeStyle = theme.warning;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            const y0 = eggerLine.intercept;
            const y1 = eggerLine.intercept + eggerLine.slope * (1 / 0.01);
            ctx.moveTo(sx(y0 * 0.01), sy(0.01));
            ctx.lineTo(sx(y1 * seMax), sy(seMax));
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Labels
        ctx.fillStyle = theme.textSecondary;
        ctx.font = '12px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('Effect Size', width / 2, height - 10);
        ctx.save();
        ctx.translate(15, pad.top + plotH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Standard Error', 0, 0);
        ctx.restore();
    }

    // ============================================================
    // BAR CHART
    // ============================================================

    function BarChart(canvas, options) {
        const {
            categories, // ['mRS 0', 'mRS 1', ...]
            series, // [{label, values: [...]}, ...]
            title, yLabel,
            stacked = false,
            errorBars, // [{upper: [...], lower: [...]}]
            width = 600, height = 400,
            colors
        } = options;

        const theme = getTheme();
        const ctx = setupCanvas(canvas, width, height);
        const pad = { top: title ? 55 : 40, right: 20, bottom: 70, left: 60 };
        const plotW = width - pad.left - pad.right;
        const plotH = height - pad.top - pad.bottom;

        // Background
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, width, height);

        if (title) {
            ctx.fillStyle = theme.text;
            ctx.font = 'bold 13px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(title, width / 2, 22);
        }

        // Compute max
        let yMax = 0;
        if (stacked) {
            categories.forEach((_, ci) => {
                const sum = series.reduce((s, sr) => s + (sr.values[ci] || 0), 0);
                yMax = Math.max(yMax, sum);
            });
        } else {
            series.forEach(s => s.values.forEach(v => yMax = Math.max(yMax, v)));
            if (errorBars) errorBars.forEach(eb => eb.upper.forEach(v => yMax = Math.max(yMax, v)));
        }
        yMax *= 1.15;

        const nCats = categories.length;
        const groupW = plotW / nCats;
        const barW = stacked ? groupW * 0.6 : groupW * 0.7 / series.length;

        function sy(v) { return pad.top + plotH * (1 - v / yMax); }

        // Grid
        ctx.strokeStyle = theme.grid;
        for (let i = 0; i <= 5; i++) {
            const v = (yMax * i) / 5;
            const y = sy(v);
            ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + plotW, y); ctx.stroke();
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '11px system-ui';
            ctx.textAlign = 'right';
            ctx.fillText(v.toFixed(v < 1 ? 2 : 0), pad.left - 8, y + 4);
        }

        // Bars
        categories.forEach((cat, ci) => {
            const gx = pad.left + ci * groupW;
            let stackY = sy(0);

            series.forEach((s, si) => {
                const color = (colors && colors[si]) || theme.series[si % theme.series.length];
                const val = s.values[ci] || 0;
                const barH = (val / yMax) * plotH;

                let bx, by;
                if (stacked) {
                    bx = gx + (groupW - barW) / 2;
                    by = stackY - barH;
                    stackY = by;
                } else {
                    bx = gx + (groupW * 0.15) + si * barW;
                    by = sy(val);
                }

                ctx.fillStyle = color;
                drawRoundedRect(ctx, bx, by, barW, Math.max(1, stacked ? barH : sy(0) - by), 2);
                ctx.fill();

                // Error bars
                if (errorBars && errorBars[si] && !stacked) {
                    const ub = errorBars[si].upper[ci];
                    const lb = errorBars[si].lower[ci];
                    const cx = bx + barW / 2;
                    ctx.strokeStyle = theme.text;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(cx, sy(lb)); ctx.lineTo(cx, sy(ub));
                    ctx.moveTo(cx - 3, sy(ub)); ctx.lineTo(cx + 3, sy(ub));
                    ctx.moveTo(cx - 3, sy(lb)); ctx.lineTo(cx + 3, sy(lb));
                    ctx.stroke();
                }
            });

            // Category label
            ctx.fillStyle = theme.textSecondary;
            ctx.font = '11px system-ui';
            ctx.textAlign = 'center';
            ctx.save();
            ctx.translate(gx + groupW / 2, pad.top + plotH + 15);
            if (cat.length > 8) ctx.rotate(-0.3);
            ctx.fillText(cat, 0, 0);
            ctx.restore();
        });

        // Axes
        ctx.strokeStyle = theme.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad.left, pad.top);
        ctx.lineTo(pad.left, pad.top + plotH);
        ctx.lineTo(pad.left + plotW, pad.top + plotH);
        ctx.stroke();

        // Y label
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

        // Legend
        if (series.length > 1) {
            let lx = pad.left;
            const ly = height - 10;
            ctx.font = '11px system-ui';
            series.forEach((s, si) => {
                const color = (colors && colors[si]) || theme.series[si % theme.series.length];
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
    // PUBLIC API
    // ============================================================

    return {
        LineChart,
        ForestPlot,
        FunnelPlot,
        BarChart,
        IconArray,
        KaplanMeierPlot,
        ROCCurve,
        HeatmapTable,
        GanttChart,
        DAGDiagram,
        exportPNG,
        getTheme,
        setupCanvas
    };
})();

if (typeof module !== 'undefined') module.exports = Charts;
