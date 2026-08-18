const fs = require('fs');

let content = fs.readFileSync('js/core/charts.js', 'utf8');

// There's a case where we replaced with drawChartBackgroundAndTitle(..., null, null) but it was followed directly by manual title drawing, e.g. FunnelPlot and GanttChart and ROCCurve.
// Let's manually restore or clean those up so we can use the title drawing part of our helper!

// For FunnelPlot
content = content.replace(
`        // Background & Title

        drawChartBackgroundAndTitle(ctx, width, height, theme, null, null);

        ctx.fillStyle = theme.text;
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 22);`,
`        // Background & Title
        drawChartBackgroundAndTitle(ctx, width, height, theme, title, 22);`
);

// For IconArray
content = content.replace(
`        // Background & Title

        drawChartBackgroundAndTitle(ctx, width, height, theme, null, null);

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
        }`,
`        const pad = { top: title ? 50 : 20, left: 30, right: 30, bottom: 80 };
        const gridW = width - pad.left - pad.right;
        const gridH = height - pad.top - pad.bottom;
        const cols = 10;
        const rows = Math.ceil(n / cols);
        const cellW = gridW / cols;
        const cellH = gridH / rows;
        const iconSize = Math.min(cellW, cellH) * 0.6;

        // Background & Title
        drawChartBackgroundAndTitle(ctx, width, height, theme, title, 25);`
);

// For ROCCurve
content = content.replace(
`        // Background & Title

        drawChartBackgroundAndTitle(ctx, width, height, theme, null, null);

        ctx.fillStyle = theme.text;
        ctx.font = 'bold 13px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 22);`,
`        // Background & Title
        drawChartBackgroundAndTitle(ctx, width, height, theme, title, 22);`
);

// For GanttChart
content = content.replace(
`        // Background & Title

        drawChartBackgroundAndTitle(ctx, width, height, theme, null, null);

        ctx.fillStyle = theme.text;
        ctx.font = 'bold 13px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 22);`,
`        // Background & Title
        drawChartBackgroundAndTitle(ctx, width, height, theme, title, 22);`
);

// For DAGDiagram
content = content.replace(
`        // Background & Title

        drawChartBackgroundAndTitle(ctx, width, height, theme, null, null);`,
`        // Background (No title needed for DAG)
        drawChartBackgroundAndTitle(ctx, width, height, theme, null, null);`
);


// Clean up empty lines created by formatting
content = content.replace(/\n\s*\n\s*drawChartBackgroundAndTitle/g, "\n        drawChartBackgroundAndTitle");

fs.writeFileSync('js/core/charts.js', content);
