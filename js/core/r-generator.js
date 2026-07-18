/**
 * n-epi -- R Script Generator
 * Generates complete, runnable R scripts for all calculator modules.
 * Each script includes package installation (commented), library loading,
 * parameter setup, computation, results output, and ggplot2 visualization.
 */

var RGenerator = (function() {
    'use strict';

    // ============================================================
    // HELPERS
    // ============================================================

    /**
     * Get current date string for script headers
     */
    function dateStr() {
        return new Date().toISOString().slice(0, 10);
    }

    /**
     * Build a standard script header comment block
     */
    function header(title) {
        return [
            '# ============================================================',
            '# n-epi: ' + title,
            '# Generated: ' + dateStr(),
            '# https://github.com/rkalani1/n-epi',
            '# ============================================================',
            ''
        ].join('\n');
    }

    /**
     * Format an array of R lines with consistent indentation.
     * Lines starting with '#' or empty lines are left as-is.
     * Other lines are trimmed of leading/trailing whitespace.
     */
    function formatR(lines) {
        if (typeof lines === 'string') return lines;
        return lines.map(function(line) {
            return line;
        }).join('\n');
    }

    /**
     * Generate commented install.packages() block for required packages
     */
    function installBlock(packages) {
        var lines = ['# --- Install required packages (uncomment if needed) ---'];
        packages.forEach(function(pkg) {
            lines.push('# install.packages("' + pkg + '")');
        });
        lines.push('');
        return lines.join('\n');
    }

    /**
     * Generate library() loading block
     */
    function libraryBlock(packages) {
        var lines = ['# --- Load libraries ---'];
        packages.forEach(function(pkg) {
            lines.push('library(' + pkg + ')');
        });
        lines.push('');
        return lines.join('\n');
    }

    /**
     * Wrap main computation in tryCatch for error handling
     */
    function tryCatchWrap(code) {
        return [
            'tryCatch({',
            code,
            '}, error = function(e) {',
            '  message("Error: ", conditionMessage(e))',
            '  message("Please check your input parameters and try again.")',
            '})'
        ].join('\n');
    }

    /**
     * Format a numeric value for R code
     */
    function rNum(val) {
        if (val === null || val === undefined || val === '') return 'NA';
        var n = parseFloat(val);
        if (isNaN(n)) return 'NA';
        return String(n);
    }

    /**
     * Format a string value for R code
     */
    function rStr(val) {
        if (val === null || val === undefined) return 'NA';
        return '"' + String(val).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
    }

    /**
     * Format a numeric array for R code: c(1, 2, 3)
     */
    function rVec(arr) {
        if (!arr || arr.length === 0) return 'c()';
        return 'c(' + arr.map(function(v) { return rNum(v); }).join(', ') + ')';
    }

    /**
     * Format a string array for R code: c("a", "b", "c")
     */
    function rStrVec(arr) {
        if (!arr || arr.length === 0) return 'c()';
        return 'c(' + arr.map(function(v) { return rStr(v); }).join(', ') + ')';
    }

    /**
     * Copy R script to clipboard with toast notification
     */
    function copyScript(script) {
        if (typeof Export !== 'undefined' && Export.copyText) {
            Export.copyText(script);
            Export.showToast('R script copied to clipboard');
        } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(script).then(function() {
                if (typeof Export !== 'undefined' && Export.showToast) {
                    Export.showToast('R script copied to clipboard');
                }
            });
        }
    }

    /**
     * Download R script as .R file
     */
    function downloadScript(script, filename) {
        filename = filename || 'neuroepi_script.R';
        var blob = new Blob([script], { type: 'text/plain' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    /**
     * Show R script in a modal overlay with copy + download buttons.
     * Uses safe DOM methods (textContent for script body).
     */
    function showScript(script, title) {
        title = title || 'R Script';
        var overlay = document.getElementById('r-script-modal');
        if (overlay) overlay.remove();

        overlay = document.createElement('div');
        overlay.id = 'r-script-modal';
        overlay.className = 'r-script-overlay';
        overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

        var modal = document.createElement('div');
        modal.className = 'r-script-modal';

        // Header — built with safe DOM methods
        var hdr = document.createElement('div');
        hdr.className = 'r-script-header';
        var titleSpan = document.createElement('span');
        titleSpan.className = 'r-script-title';
        titleSpan.textContent = title;
        hdr.appendChild(titleSpan);

        var actions = document.createElement('div');
        actions.className = 'r-script-actions';

        var copyBtn = document.createElement('button');
        copyBtn.className = 'btn btn-sm';
        copyBtn.title = 'Copy to clipboard';
        copyBtn.textContent = '\ud83d\udccb Copy';
        copyBtn.onclick = function() {
            copyScript(script);
            copyBtn.textContent = '\u2713 Copied!';
            setTimeout(function() { copyBtn.textContent = '\ud83d\udccb Copy'; }, 2000);
        };

        var dlBtn = document.createElement('button');
        dlBtn.className = 'btn btn-sm';
        dlBtn.title = 'Download .R file';
        dlBtn.textContent = '\u2b07 Download';
        dlBtn.onclick = function() {
            downloadScript(script, title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() + '.R');
        };

        var closeBtn = document.createElement('button');
        closeBtn.className = 'btn btn-sm';
        closeBtn.title = 'Close';
        closeBtn.textContent = '\u00d7';
        closeBtn.onclick = function() { overlay.remove(); };

        actions.appendChild(copyBtn);
        actions.appendChild(dlBtn);
        actions.appendChild(closeBtn);
        hdr.appendChild(actions);
        modal.appendChild(hdr);

        // Script body — uses textContent (safe, no XSS)
        var body = document.createElement('pre');
        body.className = 'r-script-body';
        body.textContent = script;
        modal.appendChild(body);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Escape key to close
        function onEsc(e) { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', onEsc); } }
        document.addEventListener('keydown', onEsc);
    }

    /**
     * Create an "R Script" button HTML string for embedding in modules.
     * @param {string} onclickExpr - JS expression that returns the script string
     * @param {string} [label] - Button label
     */
    function buttonHTML(onclickExpr, label) {
        label = label || '&#129513; Generate R Script';
        return '<button class="btn btn-sm r-script-btn" onclick="RGenerator.showScript(' + onclickExpr + ')" '
            + 'title="Generate equivalent R code for this analysis">' + label + '</button>';
    }

    // ============================================================
    // SAMPLE SIZE CALCULATIONS
    // ============================================================

    var sampleSize = {

        /**
         * Two Proportions sample size
         * @param {Object} params - { p1, p2, alpha, power, ratio, dropout }
         */
        twoProportions: function(params) {
            var p1 = rNum(params.p1);
            var p2 = rNum(params.p2);
            var alpha = rNum(params.alpha || 0.05);
            var power = rNum(params.power || 0.80);
            var ratio = rNum(params.ratio || 1);
            var dropout = rNum(params.dropout || 0);

            var packages = ['pwr'];
            var script = header('Sample Size -- Two Proportions');
            script += installBlock(packages);
            script += libraryBlock(packages);

            script += [
                '# --- Input Parameters ---',
                'p1 <- ' + p1 + '  # Control group event rate',
                'p2 <- ' + p2 + '  # Treatment group event rate',
                'alpha <- ' + alpha + '  # Two-sided significance level',
                'power <- ' + power + '  # Desired power (1 - beta)',
                'ratio <- ' + ratio + '  # Allocation ratio (treatment:control)',
                'dropout_rate <- ' + dropout + '  # Expected dropout rate (proportion)',
                '',
                '# --- Calculation ---',
                ''
            ].join('\n');

            script += tryCatchWrap([
                '  # Cohen\'s h effect size for two proportions',
                '  h <- ES.h(p1, p2)',
                '  cat("Cohen\'s h effect size:", round(h, 4), "\\n\\n")',
                '',
                '  # Sample size using pwr package',
                '  result <- pwr.2p.test(',
                '    h = h,',
                '    sig.level = alpha,',
                '    power = power,',
                '    alternative = "two.sided"',
                '  )',
                '',
                '  n_per_group <- ceiling(result$n)',
                '',
                '  # Adjust for unequal allocation',
                '  if (ratio != 1) {',
                '    # For unequal allocation, inflate by design factor',
                '    design_factor <- (1 + ratio)^2 / (4 * ratio)',
                '    n_control <- ceiling(n_per_group * design_factor)',
                '    n_treatment <- ceiling(n_control * ratio)',
                '    total_n <- n_control + n_treatment',
                '  } else {',
                '    n_control <- n_per_group',
                '    n_treatment <- n_per_group',
                '    total_n <- n_per_group * 2',
                '  }',
                '',
                '  # Adjust for dropout',
                '  if (dropout_rate > 0) {',
                '    total_n_adjusted <- ceiling(total_n / (1 - dropout_rate))',
                '  } else {',
                '    total_n_adjusted <- total_n',
                '  }',
                '',
                '  # --- Results ---',
                '  cat("=== Sample Size: Two Proportions ===\\n")',
                '  cat("Control rate (p1):", p1, "\\n")',
                '  cat("Treatment rate (p2):", p2, "\\n")',
                '  cat("Absolute risk reduction:", round(abs(p1 - p2) * 100, 1), "%\\n")',
                '  cat("Relative risk:", round(p2 / p1, 3), "\\n")',
                '  cat("NNT:", round(1 / abs(p1 - p2)), "\\n")',
                '  cat("Cohen\'s h:", round(h, 4), "\\n\\n")',
                '  cat("N per group (control):", n_control, "\\n")',
                '  cat("N per group (treatment):", n_treatment, "\\n")',
                '  cat("Total N:", total_n, "\\n")',
                '  if (dropout_rate > 0) {',
                '    cat("Dropout-adjusted total N:", total_n_adjusted,',
                '        paste0("(", dropout_rate * 100, "% dropout)"), "\\n")',
                '  }',
                '',
                '  # --- Power Curve Plot ---',
                '  n_range <- seq(10, n_per_group * 3, by = max(1, floor(n_per_group / 50)))',
                '  power_values <- sapply(n_range, function(n) {',
                '    pwr.2p.test(h = h, n = n, sig.level = alpha)$power',
                '  })',
                '',
                '  plot_df <- data.frame(n = n_range * 2, power = power_values)',
                '',
                '  if (requireNamespace("ggplot2", quietly = TRUE)) {',
                '    library(ggplot2)',
                '    p <- ggplot(plot_df, aes(x = n, y = power)) +',
                '      geom_line(color = "#4A90D9", linewidth = 1.2) +',
                '      geom_hline(yintercept = power, linetype = "dashed", color = "red", alpha = 0.6) +',
                '      geom_vline(xintercept = total_n, linetype = "dashed", color = "grey50", alpha = 0.6) +',
                '      scale_y_continuous(limits = c(0, 1), labels = scales::percent) +',
                '      labs(',
                '        title = "Power vs. Sample Size (Two Proportions)",',
                '        subtitle = paste0("p1=", p1, ", p2=", p2, ", alpha=", alpha),',
                '        x = "Total Sample Size",',
                '        y = "Power"',
                '      ) +',
                '      theme_minimal(base_size = 13) +',
                '      annotate("point", x = total_n, y = power, size = 3, color = "red")',
                '    print(p)',
                '  }',
            ].join('\n'));

            return script;
        },

        /**
         * Two Means sample size
         * @param {Object} params - { delta, sd1, sd2, alpha, power, ratio, dropout }
         */
        twoMeans: function(params) {
            var delta = rNum(params.delta);
            var sd1 = rNum(params.sd1);
            var sd2 = rNum(params.sd2 || params.sd1);
            var alpha = rNum(params.alpha || 0.05);
            var power = rNum(params.power || 0.80);
            var ratio = rNum(params.ratio || 1);
            var dropout = rNum(params.dropout || 0);

            var packages = ['pwr'];
            var script = header('Sample Size -- Two Means');
            script += installBlock(packages);
            script += libraryBlock(packages);

            script += [
                '# --- Input Parameters ---',
                'delta <- ' + delta + '  # Mean difference to detect',
                'sd1 <- ' + sd1 + '  # SD in group 1',
                'sd2 <- ' + sd2 + '  # SD in group 2',
                'alpha <- ' + alpha + '  # Two-sided significance level',
                'power <- ' + power + '  # Desired power',
                'ratio <- ' + ratio + '  # Allocation ratio',
                'dropout_rate <- ' + dropout + '  # Expected dropout rate',
                '',
                '# --- Calculation ---',
                ''
            ].join('\n');

            script += tryCatchWrap([
                '  # Pooled SD',
                '  sd_pooled <- sqrt((sd1^2 + sd2^2) / 2)',
                '  d <- delta / sd_pooled  # Cohen\'s d',
                '  cat("Cohen\'s d:", round(d, 3), "\\n\\n")',
                '',
                '  # Sample size calculation',
                '  result <- pwr.t.test(',
                '    d = d,',
                '    sig.level = alpha,',
                '    power = power,',
                '    type = "two.sample",',
                '    alternative = "two.sided"',
                '  )',
                '',
                '  n_per_group <- ceiling(result$n)',
                '  total_n <- n_per_group * 2',
                '',
                '  # Adjust for dropout',
                '  total_n_adjusted <- if (dropout_rate > 0) ceiling(total_n / (1 - dropout_rate)) else total_n',
                '',
                '  # --- Results ---',
                '  cat("=== Sample Size: Two Means ===\\n")',
                '  cat("Mean difference (delta):", delta, "\\n")',
                '  cat("Pooled SD:", round(sd_pooled, 3), "\\n")',
                '  cat("Cohen\'s d:", round(d, 3), "\\n")',
                '  cat("N per group:", n_per_group, "\\n")',
                '  cat("Total N:", total_n, "\\n")',
                '  if (dropout_rate > 0) {',
                '    cat("Dropout-adjusted total N:", total_n_adjusted, "\\n")',
                '  }',
                '',
                '  # --- Power Curve ---',
                '  if (requireNamespace("ggplot2", quietly = TRUE)) {',
                '    library(ggplot2)',
                '    n_seq <- seq(5, n_per_group * 3, by = max(1, floor(n_per_group / 50)))',
                '    pwr_vals <- sapply(n_seq, function(n) {',
                '      pwr.t.test(d = d, n = n, sig.level = alpha, type = "two.sample")$power',
                '    })',
                '    df <- data.frame(n = n_seq * 2, power = pwr_vals)',
                '    p <- ggplot(df, aes(x = n, y = power)) +',
                '      geom_line(color = "#4A90D9", linewidth = 1.2) +',
                '      geom_hline(yintercept = power, linetype = "dashed", color = "red", alpha = 0.6) +',
                '      scale_y_continuous(limits = c(0, 1), labels = scales::percent) +',
                '      labs(title = "Power vs. Sample Size (Two Means)",',
                '           subtitle = paste0("delta=", delta, ", SD=", round(sd_pooled, 2), ", d=", round(d, 2)),',
                '           x = "Total Sample Size", y = "Power") +',
                '      theme_minimal(base_size = 13)',
                '    print(p)',
                '  }',
            ].join('\n'));

            return script;
        },

        /**
         * Survival (Time-to-Event) sample size
         * @param {Object} params - { hr, alpha, power, ratio, medianSurvival, accrual, followup, dropout }
         */
        survival: function(params) {
            var hr = rNum(params.hr);
            var alpha = rNum(params.alpha || 0.05);
            var power = rNum(params.power || 0.80);
            var ratio = rNum(params.ratio || 1);
            var medSurv = rNum(params.medianSurvival || 24);
            var accrual = rNum(params.accrual || 24);
            var followup = rNum(params.followup || 12);
            var dropout = rNum(params.dropout || 0);

            var packages = ['survival'];
            var script = header('Sample Size -- Time-to-Event (Survival)');
            script += installBlock(packages);
            script += libraryBlock(packages);

            script += [
                '# --- Input Parameters ---',
                'hr <- ' + hr + '  # Hazard ratio to detect',
                'alpha <- ' + alpha + '  # Two-sided significance level',
                'power <- ' + power + '  # Desired power',
                'ratio <- ' + ratio + '  # Allocation ratio',
                'median_surv <- ' + medSurv + '  # Median survival in control (months)',
                'accrual <- ' + accrual + '  # Accrual period (months)',
                'followup <- ' + followup + '  # Additional follow-up (months)',
                'dropout_rate <- ' + dropout + '  # Expected dropout rate',
                '',
                '# --- Calculation (Schoenfeld formula) ---',
                ''
            ].join('\n');

            script += tryCatchWrap([
                '  z_alpha <- qnorm(1 - alpha / 2)',
                '  z_beta <- qnorm(power)',
                '',
                '  # Schoenfeld formula for required number of events',
                '  events_needed <- ceiling(4 * (z_alpha + z_beta)^2 / (log(hr))^2)',
                '',
                '  # Freedman formula (alternative)',
                '  events_freedman <- ceiling(((z_alpha + z_beta) / (1 - hr))^2 * (1 + hr)^2 / (1 + ratio)^2 * (1 + ratio))',
                '',
                '  # Estimate event probability',
                '  lambda <- log(2) / median_surv',
                '  avg_followup <- accrual / 2 + followup',
                '  p_event <- 1 - exp(-lambda * avg_followup)',
                '',
                '  # Total N required',
                '  total_n <- ceiling(events_needed / p_event)',
                '  total_n_adjusted <- if (dropout_rate > 0) ceiling(total_n / (1 - dropout_rate)) else total_n',
                '',
                '  # --- Results ---',
                '  cat("=== Sample Size: Time-to-Event ===\\n")',
                '  cat("Hazard ratio:", hr, "\\n")',
                '  cat("Median survival (control):", median_surv, "months\\n")',
                '  cat("Accrual period:", accrual, "months\\n")',
                '  cat("Follow-up period:", followup, "months\\n\\n")',
                '  cat("Events needed (Schoenfeld):", events_needed, "\\n")',
                '  cat("Events needed (Freedman):", events_freedman, "\\n")',
                '  cat("Estimated event probability:", round(p_event, 3), "\\n")',
                '  cat("Total N required:", total_n, "\\n")',
                '  if (dropout_rate > 0) {',
                '    cat("Dropout-adjusted N:", total_n_adjusted, "\\n")',
                '  }',
                '',
                '  # --- Sensitivity Table: Events by HR ---',
                '  hr_range <- c(0.50, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90)',
                '  sens <- data.frame(',
                '    HR = hr_range,',
                '    Events = sapply(hr_range, function(h) {',
                '      ceiling(4 * (z_alpha + z_beta)^2 / (log(h))^2)',
                '    }),',
                '    Total_N = sapply(hr_range, function(h) {',
                '      ceiling(ceiling(4 * (z_alpha + z_beta)^2 / (log(h))^2) / p_event)',
                '    })',
                '  )',
                '  cat("\\nSensitivity Analysis:\\n")',
                '  print(sens)',
                '',
                '  # --- Plot ---',
                '  if (requireNamespace("ggplot2", quietly = TRUE)) {',
                '    library(ggplot2)',
                '    p <- ggplot(sens, aes(x = HR, y = Events)) +',
                '      geom_line(color = "#4A90D9", linewidth = 1.2) +',
                '      geom_point(color = "#4A90D9", size = 2.5) +',
                '      geom_vline(xintercept = hr, linetype = "dashed", color = "red", alpha = 0.6) +',
                '      labs(title = "Required Events by Hazard Ratio",',
                '           subtitle = paste0("alpha=", alpha, ", power=", power),',
                '           x = "Hazard Ratio", y = "Number of Events Required") +',
                '      theme_minimal(base_size = 13)',
                '    print(p)',
                '  }',
            ].join('\n'));

            return script;
        },

        /**
         * Cluster RCT sample size
         * @param {Object} params - { individualN, icc, clusterSize }
         */
        clusterRCT: function(params) {
            var n = rNum(params.individualN);
            var icc = rNum(params.icc);
            var clusterSize = rNum(params.clusterSize);

            var script = header('Sample Size -- Cluster Randomized Trial');
            script += installBlock([]);

            script += [
                '# --- Input Parameters ---',
                'individual_n <- ' + n + '  # N from standard (non-clustered) calculation',
                'icc <- ' + icc + '  # Intracluster correlation coefficient',
                'cluster_size <- ' + clusterSize + '  # Average number of subjects per cluster',
                '',
                '# --- Calculation ---',
                ''
            ].join('\n');

            script += tryCatchWrap([
                '  # Design effect',
                '  deff <- 1 + (cluster_size - 1) * icc',
                '',
                '  # Adjusted sample size',
                '  adjusted_n <- ceiling(individual_n * deff)',
                '  n_clusters_per_arm <- ceiling(adjusted_n / (2 * cluster_size))',
                '  total_clusters <- n_clusters_per_arm * 2',
                '  total_n <- total_clusters * cluster_size',
                '',
                '  # --- Results ---',
                '  cat("=== Cluster RCT Sample Size ===\\n")',
                '  cat("Individual N (parallel):", individual_n, "\\n")',
                '  cat("ICC:", icc, "\\n")',
                '  cat("Cluster size:", cluster_size, "\\n")',
                '  cat("Design effect:", round(deff, 3), "\\n")',
                '  cat("Clusters per arm:", n_clusters_per_arm, "\\n")',
                '  cat("Total clusters:", total_clusters, "\\n")',
                '  cat("Total N:", total_n, "\\n")',
                '',
                '  # --- Sensitivity: Design effect by ICC ---',
                '  icc_range <- seq(0.01, 0.10, by = 0.01)',
                '  sens <- data.frame(',
                '    ICC = icc_range,',
                '    DEFF = 1 + (cluster_size - 1) * icc_range,',
                '    Total_N = sapply(icc_range, function(r) {',
                '      ceiling(individual_n * (1 + (cluster_size - 1) * r))',
                '    })',
                '  )',
                '  cat("\\nSensitivity by ICC:\\n")',
                '  print(sens)',
                '',
                '  if (requireNamespace("ggplot2", quietly = TRUE)) {',
                '    library(ggplot2)',
                '    p <- ggplot(sens, aes(x = ICC, y = Total_N)) +',
                '      geom_line(color = "#4A90D9", linewidth = 1.2) +',
                '      geom_point(color = "#4A90D9", size = 2.5) +',
                '      geom_vline(xintercept = icc, linetype = "dashed", color = "red") +',
                '      labs(title = "Total N by ICC (Cluster RCT)",',
                '           subtitle = paste0("Cluster size = ", cluster_size),',
                '           x = "ICC", y = "Total Sample Size Required") +',
                '      theme_minimal(base_size = 13)',
                '    print(p)',
                '  }',
            ].join('\n'));

            return script;
        },

        /**
         * Non-inferiority sample size
         * @param {Object} params - { p, margin, alpha, power, type, ratio }
         */
        nonInferiority: function(params) {
            var p = rNum(params.p);
            var margin = rNum(params.margin);
            var alpha = rNum(params.alpha || 0.025);
            var power = rNum(params.power || 0.80);
            var type = params.type || 'noninf';
            var ratio = rNum(params.ratio || 1);

            var script = header('Sample Size -- ' + (type === 'equiv' ? 'Equivalence' : 'Non-Inferiority'));
            script += installBlock([]);

            script += [
                '# --- Input Parameters ---',
                'p <- ' + p + '  # Expected rate in both groups',
                'margin <- ' + margin + '  # Non-inferiority / equivalence margin',
                'alpha <- ' + alpha + '  # One-sided significance level',
                'power <- ' + power + '  # Desired power',
                'design <- "' + type + '"  # "noninf" or "equiv"',
                '',
                '# --- Calculation ---',
                ''
            ].join('\n');

            script += tryCatchWrap([
                '  z_alpha <- qnorm(1 - alpha)',
                '  z_beta <- qnorm(power)',
                '',
                '  if (design == "equiv") {',
                '    # Two one-sided tests (TOST)',
                '    n_per_group <- ceiling(((z_alpha + z_beta)^2 * 2 * p * (1 - p)) / margin^2)',
                '  } else {',
                '    # Non-inferiority',
                '    n_per_group <- ceiling(((z_alpha + z_beta)^2 * 2 * p * (1 - p)) / margin^2)',
                '  }',
                '',
                '  total_n <- n_per_group * 2',
                '',
                '  # --- Results ---',
                '  cat("=== Sample Size: ", if (design == "equiv") "Equivalence" else "Non-Inferiority", " ===\\n")',
                '  cat("Expected rate (both groups):", p, "\\n")',
                '  cat("Margin:", margin, "\\n")',
                '  cat("One-sided alpha:", alpha, "\\n")',
                '  cat("Power:", power, "\\n")',
                '  cat("N per group:", n_per_group, "\\n")',
                '  cat("Total N:", total_n, "\\n")',
            ].join('\n'));

            return script;
        }
    };

    // ============================================================
    // POWER ANALYSIS
    // ============================================================

    /**
     * Power Analysis
     * @param {Object} params - { design, p1, p2, n, alpha, delta, sd, hr, events }
     */
    function powerAnalysis(params) {
        var design = params.design || 'proportions';
        var packages = ['pwr'];
        var script = header('Power Analysis');
        script += installBlock(packages);
        script += libraryBlock(packages);

        if (design === 'proportions') {
            var p1 = rNum(params.p1);
            var p2 = rNum(params.p2);
            var n = rNum(params.n);
            var alpha = rNum(params.alpha || 0.05);

            script += [
                '# --- Input Parameters ---',
                'p1 <- ' + p1 + '  # Control rate',
                'p2 <- ' + p2 + '  # Treatment rate',
                'n_per_group <- ' + n + '  # N per group',
                'alpha <- ' + alpha + '  # Significance level',
                '',
                '# --- Calculation ---',
                ''
            ].join('\n');

            script += tryCatchWrap([
                '  h <- ES.h(p1, p2)',
                '  result <- pwr.2p.test(h = h, n = n_per_group, sig.level = alpha)',
                '  power <- result$power',
                '',
                '  cat("=== Power Analysis: Two Proportions ===\\n")',
                '  cat("p1:", p1, " p2:", p2, "\\n")',
                '  cat("N per group:", n_per_group, "\\n")',
                '  cat("Alpha:", alpha, "\\n")',
                '  cat("Achieved power:", round(power * 100, 1), "%\\n")',
                '  cat("Interpretation:", if (power >= 0.80) "Adequately powered" else if (power >= 0.60) "Marginally powered" else "Underpowered", "\\n")',
                '',
                '  # Power curve',
                '  if (requireNamespace("ggplot2", quietly = TRUE)) {',
                '    library(ggplot2)',
                '    n_seq <- seq(10, n_per_group * 3, by = max(1, floor(n_per_group / 40)))',
                '    pwr_vals <- sapply(n_seq, function(nn) pwr.2p.test(h = h, n = nn, sig.level = alpha)$power)',
                '    df <- data.frame(Total_N = n_seq * 2, Power = pwr_vals)',
                '    p <- ggplot(df, aes(x = Total_N, y = Power)) +',
                '      geom_line(color = "#4A90D9", linewidth = 1.2) +',
                '      geom_hline(yintercept = 0.80, linetype = "dashed", color = "grey50") +',
                '      geom_vline(xintercept = n_per_group * 2, linetype = "dashed", color = "red") +',
                '      annotate("point", x = n_per_group * 2, y = power, size = 3, color = "red") +',
                '      scale_y_continuous(limits = c(0, 1), labels = scales::percent) +',
                '      labs(title = "Power Curve (Two Proportions)",',
                '           x = "Total Sample Size", y = "Power") +',
                '      theme_minimal(base_size = 13)',
                '    print(p)',
                '  }',
            ].join('\n'));

        } else if (design === 'means') {
            var delta = rNum(params.delta);
            var sd = rNum(params.sd);
            var nM = rNum(params.n);
            var alphaM = rNum(params.alpha || 0.05);

            script += [
                '# --- Input Parameters ---',
                'delta <- ' + delta + '  # Mean difference',
                'sd <- ' + sd + '  # Common SD',
                'n_per_group <- ' + nM + '  # N per group',
                'alpha <- ' + alphaM + '  # Significance level',
                '',
                '# --- Calculation ---',
                ''
            ].join('\n');

            script += tryCatchWrap([
                '  d <- delta / sd  # Cohen\'s d',
                '  result <- pwr.t.test(d = d, n = n_per_group, sig.level = alpha, type = "two.sample")',
                '  power <- result$power',
                '',
                '  cat("=== Power Analysis: Two Means ===\\n")',
                '  cat("Delta:", delta, " SD:", sd, " d:", round(d, 3), "\\n")',
                '  cat("N per group:", n_per_group, "\\n")',
                '  cat("Achieved power:", round(power * 100, 1), "%\\n")',
            ].join('\n'));

        } else if (design === 'survival') {
            var hr = rNum(params.hr);
            var events = rNum(params.events);
            var alphaS = rNum(params.alpha || 0.05);

            script += [
                '# --- Input Parameters ---',
                'hr <- ' + hr + '  # Hazard ratio',
                'events <- ' + events + '  # Number of events',
                'alpha <- ' + alphaS + '  # Significance level',
                '',
                '# --- Calculation (Schoenfeld) ---',
                ''
            ].join('\n');

            script += tryCatchWrap([
                '  z_alpha <- qnorm(1 - alpha / 2)',
                '  # Power = Phi(sqrt(D) * |ln(HR)| / 2 - z_alpha/2)',
                '  power <- pnorm(sqrt(events) * abs(log(hr)) / 2 - z_alpha)',
                '',
                '  cat("=== Power Analysis: Survival ===\\n")',
                '  cat("HR:", hr, "\\n")',
                '  cat("Events:", events, "\\n")',
                '  cat("Achieved power:", round(power * 100, 1), "%\\n")',
            ].join('\n'));
        }

        return script;
    }

    // ============================================================
    // META-ANALYSIS
    // ============================================================

    /**
     * Meta-Analysis
     * @param {Object} params - { studies, effects, se, measure, hksj, inputMode, binaryData }
     */
    function metaAnalysis(params) {
        var measure = params.measure || 'OR';
        var hksj = params.hksj || false;
        var inputMode = params.inputMode || 'effect';

        var packages = ['meta', 'metafor', 'ggplot2'];
        var script = header('Meta-Analysis');
        script += installBlock(packages);
        script += libraryBlock(packages);

        if (inputMode === 'binary' && params.binaryData && params.binaryData.length > 0) {
            var names = params.binaryData.map(function(s) { return s.name || 'Study'; });
            var e1 = params.binaryData.map(function(s) { return s.e1; });
            var n1 = params.binaryData.map(function(s) { return s.n1; });
            var e2 = params.binaryData.map(function(s) { return s.e2; });
            var n2 = params.binaryData.map(function(s) { return s.n2; });

            script += [
                '# --- Study Data (2x2 Binary) ---',
                'study <- ' + rStrVec(names),
                'event_treatment <- ' + rVec(e1),
                'n_treatment <- ' + rVec(n1),
                'event_control <- ' + rVec(e2),
                'n_control <- ' + rVec(n2),
                '',
                '# --- Meta-Analysis ---',
                ''
            ].join('\n');

            script += tryCatchWrap([
                '  # Run meta-analysis using meta package',
                '  m <- metabin(',
                '    event.e = event_treatment,',
                '    n.e = n_treatment,',
                '    event.c = event_control,',
                '    n.c = n_control,',
                '    studlab = study,',
                '    sm = "' + measure + '",',
                '    method = "MH",',
                '    method.tau = "DL"' + (hksj ? ',\n    hakn = TRUE' : '') + '',
                '  )',
                '',
                '  # Summary',
                '  cat("=== Meta-Analysis Results ===\\n")',
                '  summary(m)',
                '',
                '  # Forest plot',
                '  forest(m, sortvar = TE, predict = TRUE,',
                '         print.tau2 = TRUE, print.I2 = TRUE,',
                '         col.diamond = "steelblue",',
                '         leftcols = c("studlab", "event.e", "n.e", "event.c", "n.c"),',
                '         leftlabs = c("Study", "Events", "N", "Events", "N"))',
                '',
                '  # Funnel plot',
                '  funnel(m, main = "Funnel Plot")',
                '',
                '  # Egger\'s test for publication bias',
                '  if (m$k >= 3) {',
                '    egger <- metabias(m, method.bias = "linreg")',
                '    cat("\\nEgger\'s test for publication bias:\\n")',
                '    print(egger)',
                '  }',
                '',
                '  # Leave-one-out sensitivity analysis',
                '  cat("\\nLeave-one-out sensitivity analysis:\\n")',
                '  loo <- metainf(m, pooled = "random")',
                '  print(loo)',
            ].join('\n'));

        } else {
            var studyNames = (params.studies || []).map(function(s) { return s.name || 'Study'; });
            var effects = (params.studies || []).map(function(s) { return s.logEffect; });
            var se = (params.studies || []).map(function(s) { return s.se; });

            script += [
                '# --- Study Data (Effect + SE) ---',
                'study <- ' + rStrVec(studyNames),
                'yi <- ' + rVec(effects) + '  # Effect estimates (log scale for OR/RR/HR)',
                'sei <- ' + rVec(se) + '  # Standard errors',
                '',
                '# --- Meta-Analysis ---',
                ''
            ].join('\n');

            script += tryCatchWrap([
                '  # Run meta-analysis using meta package',
                '  m <- metagen(',
                '    TE = yi,',
                '    seTE = sei,',
                '    studlab = study,',
                '    sm = "' + measure + '",',
                '    method.tau = "DL"' + (hksj ? ',\n    hakn = TRUE' : '') + '',
                '  )',
                '',
                '  # Summary',
                '  cat("=== Meta-Analysis Results ===\\n")',
                '  summary(m)',
                '',
                '  # Forest plot',
                '  forest(m, sortvar = TE, predict = TRUE,',
                '         print.tau2 = TRUE, print.I2 = TRUE,',
                '         col.diamond = "steelblue")',
                '',
                '  # Funnel plot',
                '  funnel(m, main = "Funnel Plot")',
                '',
                '  # Egger\'s test for publication bias',
                '  if (m$k >= 3) {',
                '    egger <- metabias(m, method.bias = "linreg")',
                '    cat("\\nEgger\'s test:\\n")',
                '    print(egger)',
                '  }',
                '',
                '  # Leave-one-out sensitivity analysis',
                '  cat("\\nLeave-one-out sensitivity analysis:\\n")',
                '  loo <- metainf(m, pooled = "random")',
                '  print(loo)',
                '',
                '  # --- metafor package (alternative with REML) ---',
                '  cat("\\n--- metafor REML estimate ---\\n")',
                '  m_reml <- rma(yi = yi, sei = sei, method = "REML")',
                '  print(m_reml)',
            ].join('\n'));
        }

        return script;
    }

    // ============================================================
    // SURVIVAL ANALYSIS
    // ============================================================

    /**
     * Survival Analysis (KM + log-rank)
     * @param {Object} params - { data: [{time, event, group}] }
     */
    function survivalAnalysis(params) {
        var data = params.data || [];
        var times = data.map(function(d) { return d.time; });
        var events = data.map(function(d) { return d.event; });
        var groups = data.map(function(d) { return d.group || ''; });
        var hasGroups = groups.some(function(g) { return g && g.trim() !== ''; });

        var packages = ['survival', 'survminer', 'ggplot2'];
        var script = header('Survival Analysis (Kaplan-Meier)');
        script += installBlock(packages);
        script += libraryBlock(packages);

        script += [
            '# --- Data ---',
            'time <- ' + rVec(times),
            'status <- ' + rVec(events) + '  # 1 = event, 0 = censored',
        ].join('\n');

        if (hasGroups) {
            script += '\ngroup <- ' + rStrVec(groups) + '\n';
        }

        script += [
            '',
            'df <- data.frame(time = time, status = status' + (hasGroups ? ', group = group' : '') + ')',
            '',
            '# --- Kaplan-Meier Analysis ---',
            ''
        ].join('\n');

        if (hasGroups) {
            script += tryCatchWrap([
                '  # Fit KM curves by group',
                '  fit <- survfit(Surv(time, status) ~ group, data = df)',
                '  cat("=== Kaplan-Meier Summary by Group ===\\n")',
                '  print(fit)',
                '  cat("\\nMedian survival:\\n")',
                '  print(summary(fit)$table)',
                '',
                '  # Log-rank test',
                '  lr <- survdiff(Surv(time, status) ~ group, data = df)',
                '  cat("\\n=== Log-Rank Test ===\\n")',
                '  print(lr)',
                '  p_val <- 1 - pchisq(lr$chisq, df = length(lr$n) - 1)',
                '  cat("P-value:", format.pval(p_val, digits = 4), "\\n")',
                '',
                '  # Cox proportional hazards for HR',
                '  cox_fit <- coxph(Surv(time, status) ~ group, data = df)',
                '  cat("\\n=== Cox Proportional Hazards ===\\n")',
                '  print(summary(cox_fit))',
                '',
                '  # KM Plot with survminer',
                '  p <- ggsurvplot(',
                '    fit,',
                '    data = df,',
                '    pval = TRUE,',
                '    risk.table = TRUE,',
                '    conf.int = TRUE,',
                '    palette = c("#4A90D9", "#E74C3C"),',
                '    ggtheme = theme_minimal(base_size = 13),',
                '    title = "Kaplan-Meier Survival Curves",',
                '    xlab = "Time",',
                '    ylab = "Survival Probability",',
                '    risk.table.col = "strata",',
                '    surv.median.line = "hv"',
                '  )',
                '  print(p)',
            ].join('\n'));
        } else {
            script += tryCatchWrap([
                '  # Fit single KM curve',
                '  fit <- survfit(Surv(time, status) ~ 1, data = df)',
                '  cat("=== Kaplan-Meier Summary ===\\n")',
                '  print(fit)',
                '  cat("\\nSurvival table:\\n")',
                '  print(summary(fit))',
                '',
                '  # KM Plot',
                '  p <- ggsurvplot(',
                '    fit,',
                '    data = df,',
                '    conf.int = TRUE,',
                '    palette = "#4A90D9",',
                '    ggtheme = theme_minimal(base_size = 13),',
                '    title = "Kaplan-Meier Survival Curve",',
                '    xlab = "Time",',
                '    ylab = "Survival Probability",',
                '    surv.median.line = "hv"',
                '  )',
                '  print(p)',
            ].join('\n'));
        }

        return script;
    }

    // ============================================================
    // DIAGNOSTIC ACCURACY
    // ============================================================

    /**
     * Diagnostic Accuracy
     * @param {Object} params - { tp, fp, fn, tn, preTestProb }
     */
    function diagnosticAccuracy(params) {
        var tp = rNum(params.tp);
        var fp = rNum(params.fp);
        var fn = rNum(params.fn);
        var tn = rNum(params.tn);

        var packages = ['epiR', 'ggplot2'];
        var script = header('Diagnostic Accuracy');
        script += installBlock(packages);
        script += libraryBlock(packages);

        script += [
            '# --- 2x2 Table ---',
            'tp <- ' + tp + '  # True positives',
            'fp <- ' + fp + '  # False positives',
            'fn <- ' + fn + '  # False negatives',
            'tn <- ' + tn + '  # True negatives',
            '',
            '# --- Calculation ---',
            ''
        ].join('\n');

        script += tryCatchWrap([
            '  # Build 2x2 matrix (epiR format: rows=test, cols=disease)',
            '  # epiR expects: [TP, FP; FN, TN]',
            '  tab <- matrix(c(tp, fp, fn, tn), nrow = 2, byrow = TRUE,',
            '                dimnames = list(',
            '                  "Test" = c("Positive", "Negative"),',
            '                  "Disease" = c("Positive", "Negative")',
            '                ))',
            '',
            '  cat("=== 2x2 Table ===\\n")',
            '  print(tab)',
            '  cat("\\n")',
            '',
            '  # Compute diagnostic accuracy metrics using epiR',
            '  result <- epi.tests(as.table(tab), conf.level = 0.95)',
            '  cat("=== Diagnostic Accuracy Results ===\\n")',
            '  print(result)',
            '',
            '  # Manual calculations for verification',
            '  n <- tp + fp + fn + tn',
            '  sensitivity <- tp / (tp + fn)',
            '  specificity <- tn / (tn + fp)',
            '  ppv <- tp / (tp + fp)',
            '  npv <- tn / (tn + fn)',
            '  plr <- sensitivity / (1 - specificity)',
            '  nlr <- (1 - sensitivity) / specificity',
            '  dor <- (tp * tn) / (fp * fn)',
            '  youden_j <- sensitivity + specificity - 1',
            '  accuracy <- (tp + tn) / n',
            '  prevalence <- (tp + fn) / n',
            '',
            '  cat("\\n--- Summary ---\\n")',
            '  cat("Sensitivity:", round(sensitivity * 100, 1), "%\\n")',
            '  cat("Specificity:", round(specificity * 100, 1), "%\\n")',
            '  cat("PPV:", round(ppv * 100, 1), "%\\n")',
            '  cat("NPV:", round(npv * 100, 1), "%\\n")',
            '  cat("+LR:", round(plr, 2), "\\n")',
            '  cat("-LR:", round(nlr, 3), "\\n")',
            '  cat("DOR:", round(dor, 1), "\\n")',
            '  cat("Youden J:", round(youden_j, 3), "\\n")',
            '  cat("Accuracy:", round(accuracy * 100, 1), "%\\n")',
            '  cat("Prevalence:", round(prevalence * 100, 1), "%\\n")',
            '',
            '  # Fagan nomogram data',
            '  pre_test_prob <- prevalence',
            '  pre_test_odds <- pre_test_prob / (1 - pre_test_prob)',
            '  post_test_odds_pos <- pre_test_odds * plr',
            '  post_test_odds_neg <- pre_test_odds * nlr',
            '  post_test_prob_pos <- post_test_odds_pos / (1 + post_test_odds_pos)',
            '  post_test_prob_neg <- post_test_odds_neg / (1 + post_test_odds_neg)',
            '',
            '  cat("\\n--- Post-Test Probabilities (at prevalence) ---\\n")',
            '  cat("Post-test prob (test +):", round(post_test_prob_pos * 100, 1), "%\\n")',
            '  cat("Post-test prob (test -):", round(post_test_prob_neg * 100, 1), "%\\n")',
            '',
            '  # ROC-style point plot',
            '  if (requireNamespace("ggplot2", quietly = TRUE)) {',
            '    library(ggplot2)',
            '    roc_df <- data.frame(FPR = 1 - specificity, TPR = sensitivity)',
            '    p <- ggplot() +',
            '      geom_abline(intercept = 0, slope = 1, linetype = "dashed", color = "grey60") +',
            '      geom_point(data = roc_df, aes(x = FPR, y = TPR), size = 5, color = "#E74C3C") +',
            '      xlim(0, 1) + ylim(0, 1) +',
            '      labs(title = "ROC Space",',
            '           x = "1 - Specificity (FPR)", y = "Sensitivity (TPR)") +',
            '      theme_minimal(base_size = 13) +',
            '      coord_equal()',
            '    print(p)',
            '  }',
        ].join('\n'));

        return script;
    }

    // ============================================================
    // EPIDEMIOLOGY 2x2
    // ============================================================

    /**
     * Epidemiology 2x2 Table Analysis
     * @param {Object} params - { a, b, c, d }
     */
    function epiTwoByTwo(params) {
        var a = rNum(params.a);
        var b = rNum(params.b);
        var c = rNum(params.c);
        var d = rNum(params.d);

        var packages = ['epiR', 'ggplot2'];
        var script = header('Epidemiology -- 2x2 Table Analysis');
        script += installBlock(packages);
        script += libraryBlock(packages);

        script += [
            '# --- 2x2 Table ---',
            '# Rows: Exposure (Exposed, Unexposed)',
            '# Cols: Disease (Disease+, Disease-)',
            'a <- ' + a + '  # Exposed, Disease+',
            'b <- ' + b + '  # Exposed, Disease-',
            'c <- ' + c + '  # Unexposed, Disease+',
            'd <- ' + d + '  # Unexposed, Disease-',
            '',
            '# --- Analysis ---',
            ''
        ].join('\n');

        script += tryCatchWrap([
            '  tab <- matrix(c(a, b, c, d), nrow = 2, byrow = TRUE,',
            '                dimnames = list(',
            '                  Exposure = c("Exposed", "Unexposed"),',
            '                  Disease = c("Disease+", "Disease-")',
            '                ))',
            '  cat("=== 2x2 Table ===\\n")',
            '  print(tab)',
            '',
            '  # epiR analysis (note: epiR expects specific ordering)',
            '  # For cohort study: rtype = "cohort.count"',
            '  result <- epi.2by2(as.table(tab), method = "cohort.count", conf.level = 0.95)',
            '  cat("\\n=== Epidemiological Measures ===\\n")',
            '  print(result)',
            '',
            '  # Manual calculations',
            '  n1 <- a + b  # Exposed total',
            '  n2 <- c + d  # Unexposed total',
            '  n <- n1 + n2',
            '  p1 <- a / n1  # Risk in exposed',
            '  p2 <- c / n2  # Risk in unexposed',
            '',
            '  rr <- p1 / p2',
            '  or_val <- (a * d) / (b * c)',
            '  rd <- p1 - p2',
            '  nnt <- if (rd != 0) 1 / abs(rd) else Inf',
            '',
            '  # Attributable fractions',
            '  af_exposed <- (rr - 1) / rr',
            '  pe <- n1 / n  # Proportion exposed',
            '  paf <- pe * (rr - 1) / (1 + pe * (rr - 1))',
            '',
            '  cat("\\n--- Summary ---\\n")',
            '  cat("Risk (exposed):", round(p1, 4), "\\n")',
            '  cat("Risk (unexposed):", round(p2, 4), "\\n")',
            '  cat("Risk Ratio (RR):", round(rr, 4), "\\n")',
            '  cat("Odds Ratio (OR):", round(or_val, 4), "\\n")',
            '  cat("Risk Difference (RD):", round(rd, 4), "\\n")',
            '  cat("NNT:", round(nnt, 0), "\\n")',
            '  cat("AF (exposed):", round(af_exposed * 100, 1), "%\\n")',
            '  cat("PAF:", round(paf * 100, 1), "%\\n")',
            '',
            '  # Chi-squared test',
            '  chi_test <- chisq.test(tab, correct = FALSE)',
            '  chi_yates <- chisq.test(tab, correct = TRUE)',
            '  fisher <- fisher.test(tab)',
            '',
            '  cat("\\n--- Statistical Tests ---\\n")',
            '  cat("Chi-squared:", round(chi_test$statistic, 3), ", p =", format.pval(chi_test$p.value, digits = 4), "\\n")',
            '  cat("Chi-squared (Yates):", round(chi_yates$statistic, 3), ", p =", format.pval(chi_yates$p.value, digits = 4), "\\n")',
            '  cat("Fisher exact p:", format.pval(fisher$p.value, digits = 4), "\\n")',
            '',
            '  # Mosaic plot',
            '  mosaicplot(tab, main = "2x2 Table", color = c("#E74C3C", "#4A90D9"),',
            '             shade = FALSE)',
        ].join('\n'));

        return script;
    }

    // ============================================================
    // EFFECT SIZE CONVERSIONS
    // ============================================================

    /**
     * Effect Size Converter
     * @param {Object} params - { inputType, value, ciLower, ciUpper, p0, n1, n2 }
     */
    function effectSize(params) {
        var inputType = params.inputType || 'or';
        var value = rNum(params.value);
        var ciLo = rNum(params.ciLower);
        var ciHi = rNum(params.ciUpper);
        var p0 = rNum(params.p0 || 0.20);
        var n1 = rNum(params.n1 || 100);
        var n2 = rNum(params.n2 || 100);

        var packages = ['esc'];
        var script = header('Effect Size Conversions');
        script += installBlock(packages);
        script += ['# library(esc)  # Optional: effect size conversion package', ''].join('\n');

        script += [
            '# --- Input ---',
            'input_type <- "' + inputType + '"',
            'value <- ' + value,
            'ci_lower <- ' + ciLo,
            'ci_upper <- ' + ciHi,
            'p0 <- ' + p0 + '  # Baseline risk (control group event rate)',
            'n1 <- ' + n1 + '  # Group 1 sample size',
            'n2 <- ' + n2 + '  # Group 2 sample size',
            '',
            '# --- Conversion Functions ---',
            ''
        ].join('\n');

        script += tryCatchWrap([
            '  # OR <-> d conversion (Chinn, 2000)',
            '  or_to_d <- function(or) log(or) * sqrt(3) / pi',
            '  d_to_or <- function(d) exp(d * pi / sqrt(3))',
            '',
            '  # OR -> RR via Zhang & Yu',
            '  or_to_rr <- function(or, p0) or / (1 - p0 + p0 * or)',
            '',
            '  # RR -> OR',
            '  rr_to_or <- function(rr, p0) rr * (1 - p0) / (1 - rr * p0)',
            '',
            '  # Hedge\'s g correction',
            '  d_to_g <- function(d, n1, n2) {',
            '    df <- n1 + n2 - 2',
            '    d * (1 - 3 / (4 * df - 1))',
            '  }',
            '',
            '  # Start from input type and compute all',
            '  if (input_type == "or") {',
            '    or_val <- value',
            '  } else if (input_type == "rr") {',
            '    or_val <- rr_to_or(value, p0)',
            '  } else if (input_type == "d") {',
            '    or_val <- d_to_or(value)',
            '  } else if (input_type == "lnor") {',
            '    or_val <- exp(value)',
            '  } else if (input_type == "lnrr") {',
            '    or_val <- rr_to_or(exp(value), p0)',
            '  } else if (input_type == "rd") {',
            '    eer <- p0 + value',
            '    rr_val <- eer / p0',
            '    or_val <- rr_to_or(rr_val, p0)',
            '  } else {',
            '    or_val <- value  # default: treat as OR',
            '  }',
            '',
            '  # Derive all measures',
            '  rr_val <- or_to_rr(or_val, p0)',
            '  d_val <- or_to_d(or_val)',
            '  g_val <- d_to_g(d_val, n1, n2)',
            '  rd_val <- rr_val * p0 - p0',
            '',
            '  cat("=== Effect Size Conversions ===\\n")',
            '  cat("Odds Ratio (OR):", round(or_val, 4), "\\n")',
            '  cat("Relative Risk (RR):", round(rr_val, 4), "\\n")',
            '  cat("Risk Difference (RD):", round(rd_val, 4), "\\n")',
            '  cat("Cohen\'s d:", round(d_val, 4), "\\n")',
            '  cat("Hedge\'s g:", round(g_val, 4), "\\n")',
            '  cat("log(OR):", round(log(or_val), 4), "\\n")',
            '  cat("log(RR):", round(log(rr_val), 4), "\\n")',
            '',
            '  # Cohen benchmarks',
            '  cat("\\n--- Cohen Interpretation ---\\n")',
            '  d_abs <- abs(d_val)',
            '  cat("d =", round(d_abs, 3), "->",',
            '      if (d_abs < 0.2) "Negligible"',
            '      else if (d_abs < 0.5) "Small"',
            '      else if (d_abs < 0.8) "Medium"',
            '      else "Large", "\\n")',
        ].join('\n'));

        return script;
    }

    // ============================================================
    // NNT CALCULATOR
    // ============================================================

    /**
     * NNT / NNH Calculator
     * @param {Object} params - { cer, eer, nc, ne } OR { a, b, c, d }
     */
    function nntCalculator(params) {
        var script = header('NNT / NNH Calculator');
        script += installBlock([]);

        if (params.a !== undefined) {
            // From 2x2 table
            script += [
                '# --- 2x2 Table ---',
                'a <- ' + rNum(params.a) + '  # Treatment, Event',
                'b <- ' + rNum(params.b) + '  # Treatment, No Event',
                'c <- ' + rNum(params.c) + '  # Control, Event',
                'd <- ' + rNum(params.d) + '  # Control, No Event',
                '',
                'eer <- a / (a + b)  # Experimental event rate',
                'cer <- c / (c + d)  # Control event rate',
                'nc <- c + d',
                'ne <- a + b',
            ].join('\n');
        } else {
            script += [
                '# --- Input Parameters ---',
                'cer <- ' + rNum(params.cer) + '  # Control event rate',
                'eer <- ' + rNum(params.eer) + '  # Experimental event rate',
                'nc <- ' + rNum(params.nc || 300) + '  # N control',
                'ne <- ' + rNum(params.ne || 300) + '  # N experimental',
            ].join('\n');
        }

        script += '\n\n# --- Calculation ---\n\n';

        script += tryCatchWrap([
            '  arr <- cer - eer  # Absolute risk reduction',
            '  rr <- eer / cer',
            '  rrr <- 1 - rr  # Relative risk reduction',
            '',
            '  # Reconstruct 2x2 for OR and tests',
            '  a <- round(eer * ne)',
            '  b <- ne - a',
            '  c <- round(cer * nc)',
            '  d <- nc - c',
            '  or_val <- (a * d) / (b * c)',
            '',
            '  # NNT',
            '  nnt <- if (arr != 0) ceiling(1 / abs(arr)) else Inf',
            '  nnt_label <- if (arr > 0) "NNT (benefit)" else if (arr < 0) "NNH (harm)" else "Infinite (no difference)"',
            '',
            '  # Statistical tests',
            '  tab <- matrix(c(a, b, c, d), nrow = 2, byrow = TRUE)',
            '  chi_test <- chisq.test(tab, correct = FALSE)',
            '  fisher <- fisher.test(tab)',
            '',
            '  # Confidence interval for ARR (Newcombe method)',
            '  prop_test <- prop.test(c(c, a), c(nc, ne), correct = FALSE)',
            '',
            '  # --- Results ---',
            '  cat("=== NNT / NNH Calculator ===\\n")',
            '  cat("CER:", round(cer, 4), "\\n")',
            '  cat("EER:", round(eer, 4), "\\n")',
            '  cat("ARR:", round(arr * 100, 2), "%\\n")',
            '  cat("RR:", round(rr, 4), "\\n")',
            '  cat("RRR:", round(rrr * 100, 1), "%\\n")',
            '  cat("OR:", round(or_val, 4), "\\n")',
            '  cat(nnt_label, ":", nnt, "\\n")',
            '  cat("Chi-squared p:", format.pval(chi_test$p.value, digits = 4), "\\n")',
            '  cat("Fisher p:", format.pval(fisher$p.value, digits = 4), "\\n")',
            '',
            '  # Fragility Index',
            '  frag_idx <- 0',
            '  if (fisher$p.value < 0.05) {',
            '    aa <- a; bb <- b; cc <- c; dd <- d',
            '    while (fisher.test(matrix(c(aa, bb, cc, dd), nrow = 2, byrow = TRUE))$p.value < 0.05) {',
            '      if (aa / (aa + bb) > cc / (cc + dd)) {',
            '        aa <- aa - 1; bb <- bb + 1',
            '      } else {',
            '        cc <- cc - 1; dd <- dd + 1',
            '      }',
            '      frag_idx <- frag_idx + 1',
            '      if (frag_idx > 1000) break',
            '    }',
            '  }',
            '  cat("Fragility Index:", frag_idx, "\\n")',
            '',
            '  # Cates-style icon array',
            '  if (requireNamespace("ggplot2", quietly = TRUE)) {',
            '    library(ggplot2)',
            '    n_icons <- 100',
            '    cer_count <- round(cer * n_icons)',
            '    eer_count <- round(eer * n_icons)',
            '    benefit_count <- max(0, cer_count - eer_count)',
            '',
            '    categories <- c(rep("Event despite treatment", eer_count),',
            '                    rep("Benefit from treatment", benefit_count),',
            '                    rep("No event regardless", n_icons - cer_count))',
            '    icon_df <- data.frame(',
            '      x = rep(1:10, each = 10),',
            '      y = rep(10:1, times = 10),',
            '      category = factor(categories[1:n_icons],',
            '                        levels = c("Event despite treatment",',
            '                                   "Benefit from treatment",',
            '                                   "No event regardless"))',
            '    )',
            '',
            '    p <- ggplot(icon_df, aes(x = x, y = y, fill = category)) +',
            '      geom_tile(color = "white", linewidth = 0.5) +',
            '      scale_fill_manual(values = c("#E74C3C", "#2ECC71", "#BDC3C7")) +',
            '      labs(title = paste0("Treatment Effect per 100 Patients (", nnt_label, " = ", nnt, ")"),',
            '           fill = "Outcome") +',
            '      theme_void(base_size = 13) +',
            '      theme(legend.position = "bottom") +',
            '      coord_equal()',
            '    print(p)',
            '  }',
        ].join('\n'));

        return script;
    }

    // ============================================================
    // REGRESSION HELPER
    // ============================================================

    /**
     * Regression Planning Helper
     * @param {Object} params - { outcomeType, events, covariates, clustering, repeated }
     */
    function regressionHelper(params) {
        var outcomeType = params.outcomeType || 'binary';
        var events = rNum(params.events || 100);
        var covariates = rNum(params.covariates || 8);

        var packages = ['ggplot2'];
        var script = header('Regression Planning Helper');
        script += installBlock(packages);
        script += libraryBlock(packages);

        script += [
            '# --- Input Parameters ---',
            'outcome_type <- "' + outcomeType + '"  # binary, continuous, count, time, ordinal',
            'events <- ' + events + '  # Number of events (or N for continuous)',
            'covariates <- ' + covariates + '  # Number of candidate covariates',
            '',
            '# --- EPV Calculation ---',
            ''
        ].join('\n');

        script += tryCatchWrap([
            '  epv <- events / covariates',
            '',
            '  cat("=== Events Per Variable (EPV) Analysis ===\\n")',
            '  cat("Events:", events, "\\n")',
            '  cat("Covariates:", covariates, "\\n")',
            '  cat("EPV:", round(epv, 1), "\\n\\n")',
            '',
            '  # Interpretation',
            '  cat("Interpretation: ")',
            '  if (epv < 5) {',
            '    cat("SEVERELY INADEQUATE -- High risk of overfitting\\n")',
            '  } else if (epv < 10) {',
            '    cat("INADEQUATE -- Below traditional minimum\\n")',
            '  } else if (epv < 20) {',
            '    cat("MARGINAL -- Meets minimum but consider reducing covariates\\n")',
            '  } else if (epv < 50) {',
            '    cat("ADEQUATE -- Good for most models\\n")',
            '  } else {',
            '    cat("EXCELLENT -- Supports complex models\\n")',
            '  }',
            '',
            '  cat("Max covariates at EPV=10:", floor(events / 10), "\\n")',
            '  cat("Max covariates at EPV=20:", floor(events / 20), "\\n")',
            '  cat("Events needed for EPV=10:", covariates * 10, "\\n")',
            '  cat("Events needed for EPV=20:", covariates * 20, "\\n")',
            '',
            '  # Recommended model',
            '  cat("\\n--- Recommended Model ---\\n")',
            '  if (outcome_type == "binary") {',
            '    cat("Logistic regression: glm(outcome ~ x1 + x2 + ..., family = binomial)\\n")',
            '  } else if (outcome_type == "continuous") {',
            '    cat("Linear regression: lm(outcome ~ x1 + x2 + ...)\\n")',
            '  } else if (outcome_type == "count") {',
            '    cat("Poisson regression: glm(outcome ~ x1 + x2 + ..., family = poisson)\\n")',
            '    cat("  If overdispersed: negative binomial via MASS::glm.nb()\\n")',
            '  } else if (outcome_type == "time") {',
            '    cat("Cox PH: survival::coxph(Surv(time, status) ~ x1 + x2 + ...)\\n")',
            '  } else if (outcome_type == "ordinal") {',
            '    cat("Proportional odds: MASS::polr(outcome ~ x1 + x2 + ...)\\n")',
            '    cat("  Or ordinal::clm() for cumulative link models\\n")',
            '  }',
            '',
            '  # EPV sensitivity plot',
            '  cov_range <- 3:30',
            '  epv_vals <- events / cov_range',
            '  epv_df <- data.frame(Covariates = cov_range, EPV = epv_vals)',
            '',
            '  p <- ggplot(epv_df, aes(x = Covariates, y = EPV)) +',
            '    geom_line(color = "#4A90D9", linewidth = 1.2) +',
            '    geom_hline(yintercept = 10, linetype = "dashed", color = "red", alpha = 0.7) +',
            '    geom_hline(yintercept = 20, linetype = "dashed", color = "orange", alpha = 0.7) +',
            '    geom_vline(xintercept = covariates, linetype = "dotted", color = "grey40") +',
            '    annotate("text", x = max(cov_range) - 1, y = 11, label = "EPV = 10",',
            '             color = "red", size = 3.5, hjust = 1) +',
            '    annotate("text", x = max(cov_range) - 1, y = 21, label = "EPV = 20",',
            '             color = "orange", size = 3.5, hjust = 1) +',
            '    labs(title = paste0("EPV by Number of Covariates (", events, " events)"),',
            '         x = "Number of Covariates", y = "Events Per Variable") +',
            '    theme_minimal(base_size = 13)',
            '  print(p)',
        ].join('\n'));

        return script;
    }

    // ============================================================
    // RISK / RATE CALCULATORS
    // ============================================================

    /**
     * Risk & Rate Calculators (Epi rates)
     * @param {Object} params - { calcType, events, personTime, rate1, rate2, pt1, pt2 }
     */
    /* -------------------------------------------------------------- */
    /*  Causal Inference — DiD                                         */
    /* -------------------------------------------------------------- */
    function causalInferenceDiD(params) {
        var lines = [
            header('Difference-in-Differences (DiD) Analysis'),
            '# --- Input data ---',
            'treated_pre  <- ' + rNum(params.tPre),
            'treated_post <- ' + rNum(params.tPost),
            'control_pre  <- ' + rNum(params.cPre),
            'control_post <- ' + rNum(params.cPost),
            '',
            '# --- DiD calculation ---',
            'treated_change <- treated_post - treated_pre',
            'control_change <- control_post - control_pre',
            'did_estimate   <- treated_change - control_change',
            'counterfactual <- treated_pre + control_change',
            '',
            'cat("\\n=== DiD Results ===\\n")',
            'cat(sprintf("Treated change : %+.3f\\n", treated_change))',
            'cat(sprintf("Control change : %+.3f\\n", control_change))',
            'cat(sprintf("DiD estimate   : %+.3f\\n", did_estimate))',
            'cat(sprintf("Counterfactual : %.3f\\n", counterfactual))',
            '',
            '# --- Visualization ---',
            installBlock(['ggplot2']),
            libraryBlock(['ggplot2']),
            '',
            'df <- data.frame(',
            '  group  = rep(c("Treated", "Control", "Counterfactual"), each = 2),',
            '  time   = rep(c("Pre", "Post"), 3),',
            '  value  = c(treated_pre, treated_post, control_pre, control_post, treated_pre, counterfactual)',
            ')',
            'df$time  <- factor(df$time, levels = c("Pre", "Post"))',
            'df$group <- factor(df$group, levels = c("Treated", "Control", "Counterfactual"))',
            '',
            'ggplot(df, aes(x = time, y = value, group = group, color = group)) +',
            '  geom_point(size = 3) +',
            '  geom_line(aes(linetype = group), linewidth = 1) +',
            '  scale_linetype_manual(values = c("Treated" = "solid", "Control" = "solid", "Counterfactual" = "dashed")) +',
            '  scale_color_manual(values = c("Treated" = "#2563eb", "Control" = "#6b7280", "Counterfactual" = "#f59e0b")) +',
            '  annotate("segment", x = 2, xend = 2, y = counterfactual, yend = treated_post,',
            '           arrow = arrow(length = unit(0.2, "cm"), ends = "both"), color = "#dc2626") +',
            '  annotate("text", x = 2.1, y = (counterfactual + treated_post) / 2,',
            '           label = sprintf("DiD = %.2f", did_estimate), hjust = 0, color = "#dc2626") +',
            '  labs(title = "Difference-in-Differences", x = "Period", y = "Outcome") +',
            '  theme_minimal(base_size = 14)'
        ];
        return formatR(lines);
    }

    /* -------------------------------------------------------------- */
    /*  ML Prediction — Model Validation                               */
    /* -------------------------------------------------------------- */
    function mlPredictionValidation(params) {
        var method = params.method || 'kfold';
        var lines = [
            header('Clinical Prediction Model — Validation Strategy'),
            '# --- Input parameters ---',
            'n          <- ' + rNum(params.n),
            'events     <- ' + rNum(params.events),
            'predictors <- ' + rNum(params.predictors),
            '',
            '# --- Key metrics ---',
            'epv        <- events / predictors',
            'prevalence <- events / n',
            'cat(sprintf("EPV: %.1f  |  Prevalence: %.1f%%\\n", epv, prevalence * 100))',
            ''
        ];

        if (method === 'kfold') {
            lines = lines.concat([
                '# --- k-Fold Cross-Validation ---',
                installBlock(['caret', 'pROC']),
                libraryBlock(['caret', 'pROC']),
                '',
                'k <- ' + rNum(params.k || 10),
                '',
                '# Example: Logistic regression with k-fold CV',
                '# ctrl <- trainControl(method = "cv", number = k,',
                '#                      classProbs = TRUE, summaryFunction = twoClassSummary,',
                '#                      savePredictions = "final")',
                '# fit <- train(outcome ~ ., data = dat, method = "glm",',
                '#              family = "binomial", trControl = ctrl, metric = "ROC")',
                '# print(fit)  # CV performance',
                '',
                'cat(sprintf("k-Fold CV setup: k = %d, ~%d per fold\\n", k, floor(n / k)))',
                'cat(sprintf("~%d events per fold (test)\\n", round(events / k)))'
            ]);
        } else if (method === 'bootstrap') {
            lines = lines.concat([
                '# --- Bootstrap Validation (.632+) ---',
                installBlock(['rms']),
                libraryBlock(['rms']),
                '',
                'B <- ' + rNum(params.k || 200),
                '',
                '# Example with rms::validate()',
                '# dd <- datadist(dat); options(datadist = "dd")',
                '# fit <- lrm(outcome ~ ., data = dat, x = TRUE, y = TRUE)',
                '# val <- validate(fit, B = B)',
                '# print(val)  # Optimism-corrected indices',
                '',
                'cat(sprintf("Bootstrap resamples: B = %d\\n", B))',
                'cat(sprintf("Expected OOB samples per iteration: ~%d\\n", round(n * 0.368)))'
            ]);
        } else {
            lines = lines.concat([
                '# --- Train/Test Split ---',
                'train_frac <- ' + rNum(params.trainFrac || 0.7),
                '',
                installBlock(['caret']),
                libraryBlock(['caret']),
                '',
                '# set.seed(42)',
                '# idx <- createDataPartition(dat$outcome, p = train_frac, list = FALSE)',
                '# train_dat <- dat[idx, ]',
                '# test_dat  <- dat[-idx, ]',
                '',
                'cat(sprintf("Train: %d (events ~%d)  |  Test: %d (events ~%d)\\n",',
                '    round(n * train_frac), round(events * train_frac),',
                '    n - round(n * train_frac), events - round(events * train_frac)))'
            ]);
        }
        return formatR(lines);
    }

    /* -------------------------------------------------------------- */
    /*  ML Prediction — NRI / IDI                                      */
    /* -------------------------------------------------------------- */
    function mlPredictionNRI(params) {
        var lines = [
            header('Net Reclassification Improvement & IDI'),
            installBlock(['nricens', 'PredictABEL']),
            libraryBlock(['nricens']),
            '',
            '# --- NRI from reclassification counts ---',
            'event_up       <- ' + rNum(params.eventUp),
            'event_down     <- ' + rNum(params.eventDown),
            'total_events   <- ' + rNum(params.totalEvents),
            'nonevent_up    <- ' + rNum(params.noneventUp),
            'nonevent_down  <- ' + rNum(params.noneventDown),
            'total_nonevents <- ' + rNum(params.totalNonevents),
            '',
            '# NRI components',
            'nri_event    <- (event_up - event_down) / total_events',
            'nri_nonevent <- (nonevent_down - nonevent_up) / total_nonevents',
            'nri_overall  <- nri_event + nri_nonevent',
            '',
            '# Standard error & p-value',
            'se_event    <- sqrt((event_up + event_down) / total_events^2)',
            'se_nonevent <- sqrt((nonevent_up + nonevent_down) / total_nonevents^2)',
            'se_nri      <- sqrt(se_event^2 + se_nonevent^2)',
            'z_nri       <- nri_overall / se_nri',
            'p_nri       <- 2 * pnorm(-abs(z_nri))',
            '',
            'cat("\\n=== NRI Results ===\\n")',
            'cat(sprintf("NRI (events)     : %+.1f%%\\n", nri_event * 100))',
            'cat(sprintf("NRI (non-events) : %+.1f%%\\n", nri_nonevent * 100))',
            'cat(sprintf("Overall NRI      : %+.1f%% (z = %.3f, p = %.4f)\\n", nri_overall * 100, z_nri, p_nri))',
            '',
            '# --- IDI from mean predicted probabilities ---',
            'old_event_prob    <- ' + rNum(params.oldEventProb || 0),
            'new_event_prob    <- ' + rNum(params.newEventProb || 0),
            'old_nonevent_prob <- ' + rNum(params.oldNoneventProb || 0),
            'new_nonevent_prob <- ' + rNum(params.newNoneventProb || 0),
            '',
            'is_old <- old_event_prob - old_nonevent_prob',
            'is_new <- new_event_prob - new_nonevent_prob',
            'idi    <- is_new - is_old',
            '',
            'cat(sprintf("\\nIDI = %.4f\\n", idi))',
            'cat(sprintf("  Old model IS: %.4f  |  New model IS: %.4f\\n", is_old, is_new))',
            '',
            '# --- For individual-level data, use nricens package ---',
            '# result <- nricens(event = dat$outcome,',
            '#                   p.std = dat$prob_old, p.new = dat$prob_new,',
            '#                   cut = 0.1,  # risk threshold',
            '#                   niter = 1000)',
            '# print(result)'
        ];
        return formatR(lines);
    }

    /* -------------------------------------------------------------- */
    /*  Biostats Reference — CI comparison                             */
    /* -------------------------------------------------------------- */
    function biostatCI(params) {
        var lines = [
            header('Confidence Intervals for a Single Proportion'),
            '# --- Input ---',
            'x     <- ' + rNum(params.x) + '   # successes',
            'n     <- ' + rNum(params.n) + '   # total',
            'level <- ' + rNum(params.level) + ' # confidence level',
            'alpha <- 1 - level',
            'z     <- qnorm(1 - alpha / 2)',
            'p_hat <- x / n',
            '',
            '# --- Wald CI ---',
            'se_wald <- sqrt(p_hat * (1 - p_hat) / n)',
            'wald    <- c(max(0, p_hat - z * se_wald), min(1, p_hat + z * se_wald))',
            '',
            '# --- Wilson (score) CI ---',
            'denom  <- 1 + z^2 / n',
            'center <- (p_hat + z^2 / (2 * n)) / denom',
            'half   <- (z / denom) * sqrt(p_hat * (1 - p_hat) / n + z^2 / (4 * n^2))',
            'wilson <- c(max(0, center - half), min(1, center + half))',
            '',
            '# --- Agresti-Coull CI ---',
            'n_t  <- n + z^2',
            'p_t  <- (x + z^2 / 2) / n_t',
            'se_t <- sqrt(p_t * (1 - p_t) / n_t)',
            'ac   <- c(max(0, p_t - z * se_t), min(1, p_t + z * se_t))',
            '',
            '# --- Clopper-Pearson (exact) CI ---',
            'cp <- c(',
            '  ifelse(x == 0, 0, qbeta(alpha / 2, x, n - x + 1)),',
            '  ifelse(x == n, 1, qbeta(1 - alpha / 2, x + 1, n - x))',
            ')',
            '',
            '# --- Results table ---',
            'results <- data.frame(',
            '  Method = c("Wald", "Wilson", "Agresti-Coull", "Clopper-Pearson"),',
            '  Lower  = c(wald[1], wilson[1], ac[1], cp[1]),',
            '  Upper  = c(wald[2], wilson[2], ac[2], cp[2]),',
            '  Width  = c(diff(wald), diff(wilson), diff(ac), diff(cp))',
            ')',
            'cat(sprintf("\\nProportion: %d/%d = %.4f (%g%% CI)\\n\\n", x, n, p_hat, level * 100))',
            'print(results, digits = 4)',
            '',
            '# --- Also available via binom package ---',
            '# install.packages("binom")',
            '# library(binom)',
            '# binom.confint(x, n, conf.level = level, methods = "all")'
        ];
        return formatR(lines);
    }

    /* -------------------------------------------------------------- */
    /*  Biostats Reference — P-value adjustment                        */
    /* -------------------------------------------------------------- */
    function biostatPvalAdjust(params) {
        var pvals = params.pvals || [];
        var alpha = params.alpha || 0.05;
        var lines = [
            header('Multiple Testing P-Value Adjustment'),
            '# --- Input ---',
            'pvals <- c(' + pvals.join(', ') + ')',
            'alpha <- ' + rNum(alpha),
            '',
            '# --- Adjustments (using built-in p.adjust) ---',
            'bonferroni <- p.adjust(pvals, method = "bonferroni")',
            'holm       <- p.adjust(pvals, method = "holm")',
            'hochberg   <- p.adjust(pvals, method = "hochberg")',
            'bh_fdr     <- p.adjust(pvals, method = "BH")',
            '',
            '# Sidak (manual)',
            'm <- length(pvals)',
            'sidak <- 1 - (1 - pvals)^m',
            '',
            '# --- Results table ---',
            'results <- data.frame(',
            '  Test       = seq_along(pvals),',
            '  Raw_P      = pvals,',
            '  Bonferroni = bonferroni,',
            '  Holm       = holm,',
            '  Hochberg   = hochberg,',
            '  BH_FDR     = bh_fdr,',
            '  Sidak      = pmin(1, sidak)',
            ')',
            '',
            'cat(sprintf("\\nMultiple Testing Correction (%d tests, alpha = %.3f)\\n\\n", m, alpha))',
            'print(results, digits = 4)',
            '',
            '# --- Summary ---',
            'cat(sprintf("\\nSignificant after Bonferroni: %d/%d\\n", sum(bonferroni < alpha), m))',
            'cat(sprintf("Significant after Holm:       %d/%d\\n", sum(holm < alpha), m))',
            'cat(sprintf("Significant after BH (FDR):   %d/%d\\n", sum(bh_fdr < alpha), m))'
        ];
        return formatR(lines);
    }

    /* -------------------------------------------------------------- */
    /*  Rate Ratio (IRR)                                               */
    /* -------------------------------------------------------------- */
    function riskRateRatio(params) {
        var lines = [
            header('Incidence Rate Ratio (IRR)'),
            '# --- Input ---',
            'events_exposed   <- ' + rNum(params.events1),
            'pt_exposed       <- ' + rNum(params.pt1),
            'events_unexposed <- ' + rNum(params.events2),
            'pt_unexposed     <- ' + rNum(params.pt2),
            '',
            '# --- Rate Ratio ---',
            'rate_exposed   <- events_exposed / pt_exposed',
            'rate_unexposed <- events_unexposed / pt_unexposed',
            'irr <- rate_exposed / rate_unexposed',
            '',
            '# 95% CI via log-normal method',
            'se_ln_irr <- sqrt(1 / events_exposed + 1 / events_unexposed)',
            'irr_lower <- exp(log(irr) - 1.96 * se_ln_irr)',
            'irr_upper <- exp(log(irr) + 1.96 * se_ln_irr)',
            '',
            'cat("\\n=== Incidence Rate Ratio ===\\n")',
            'cat(sprintf("Exposed rate   : %.2f per 100,000\\n", rate_exposed * 1e5))',
            'cat(sprintf("Unexposed rate : %.2f per 100,000\\n", rate_unexposed * 1e5))',
            'cat(sprintf("IRR            : %.3f (95%% CI: %.3f - %.3f)\\n", irr, irr_lower, irr_upper))',
            '',
            '# --- Exact test (using epitools if available) ---',
            '# install.packages("epitools")',
            '# library(epitools)',
            '# rateratio(c(events_exposed, events_unexposed),',
            '#           c(pt_exposed, pt_unexposed), method = "exact")'
        ];
        return formatR(lines);
    }

    /* -------------------------------------------------------------- */
    /*  Standardized Mortality Ratio (SMR)                             */
    /* -------------------------------------------------------------- */
    function riskSMR(params) {
        var lines = [
            header('Standardized Mortality Ratio (SMR)'),
            '# --- Input ---',
            'observed <- ' + rNum(params.observed),
            'expected <- ' + rNum(params.expected),
            'alpha    <- ' + rNum(params.alpha || 0.05),
            '',
            '# --- SMR ---',
            'smr <- observed / expected',
            '',
            '# Exact Poisson CI (Garwood method)',
            'smr_lower <- qchisq(alpha / 2, 2 * observed) / (2 * expected)',
            'smr_upper <- qchisq(1 - alpha / 2, 2 * (observed + 1)) / (2 * expected)',
            '',
            'cat("\\n=== Standardized Mortality Ratio ===\\n")',
            'cat(sprintf("Observed: %d  |  Expected: %.1f\\n", observed, expected))',
            'cat(sprintf("SMR: %.3f (%g%% CI: %.3f - %.3f)\\n", smr, (1 - alpha) * 100, smr_lower, smr_upper))',
            'cat(sprintf("Excess events: %.1f\\n", observed - expected))',
            '',
            '# --- Exact Poisson test ---',
            'test <- poisson.test(observed, expected)',
            'print(test)'
        ];
        return formatR(lines);
    }

    /* -------------------------------------------------------------- */
    /*  Attributable Risk (AR, PAF, etc.)                              */
    /* -------------------------------------------------------------- */
    function riskAttributable(params) {
        var lines = [
            header('Attributable Risk Measures'),
            '# --- Input ---',
            're <- ' + rNum(params.re) + '  # risk in exposed',
            'ru <- ' + rNum(params.ru) + '  # risk in unexposed',
            'pe <- ' + rNum(params.pe) + '  # prevalence of exposure',
            '',
            '# --- Calculations ---',
            'ar  <- re - ru                          # Attributable Risk (risk difference)',
            'rr  <- re / ru                          # Relative Risk',
            'afe <- (rr - 1) / rr                    # Attributable Fraction in Exposed',
            'paf <- pe * (rr - 1) / (1 + pe * (rr - 1))  # Population Attributable Fraction (Levin)',
            'total_rate <- pe * re + (1 - pe) * ru',
            'par <- total_rate - ru                   # Population Attributable Risk',
            '',
            'cat("\\n=== Attributable Risk Measures ===\\n")',
            'cat(sprintf("Attributable Risk (AR)    : %.4f (%.2f%%)\\n", ar, ar * 100))',
            'cat(sprintf("Relative Risk (RR)        : %.3f\\n", rr))',
            'cat(sprintf("AF (exposed)              : %.1f%%\\n", afe * 100))',
            'cat(sprintf("PAF (Levin formula)       : %.1f%%\\n", paf * 100))',
            'cat(sprintf("Population AR             : %.4f\\n", par))',
            'cat(sprintf("NNH (1/AR)                : %d\\n", round(1 / abs(ar))))',
            '',
            '# --- Confidence interval for AR ---',
            '# Requires sample sizes:',
            '# ne <- 500  # exposed sample size',
            '# nu <- 500  # unexposed sample size',
            '# se_ar <- sqrt(re * (1 - re) / ne + ru * (1 - ru) / nu)',
            '# ar_ci <- ar + c(-1, 1) * qnorm(0.975) * se_ar',
            '# cat(sprintf("AR 95%% CI: (%.4f, %.4f)\\n", ar_ci[1], ar_ci[2]))'
        ];
        return formatR(lines);
    }

    /* -------------------------------------------------------------- */
    /*  Mantel-Haenszel Stratified Analysis                            */
    /* -------------------------------------------------------------- */
    function epiMantelHaenszel(params) {
        // params.tables is an array of {a,b,c,d}
        // params.measure is 'OR' or 'RR'
        var tables = params.tables || [];
        var measure = params.measure || 'OR';
        var k = tables.length;

        var lines = [
            header('Mantel-Haenszel Stratified Analysis'),
            installBlock(['epiR', 'vcd']),
            libraryBlock(['epiR']),
            '',
            '# --- Stratum data ---',
            '# Each stratum: a (exposed/case), b (exposed/non-case), c (unexposed/case), d (unexposed/non-case)'
        ];

        for (var i = 0; i < k; i++) {
            var t = tables[i];
            lines.push('s' + (i + 1) + ' <- matrix(c(' + t.a + ', ' + t.b + ', ' + t.c + ', ' + t.d + '), nrow = 2, byrow = TRUE,');
            lines.push('            dimnames = list(Exposure = c("Yes", "No"), Outcome = c("Yes", "No")))');
        }

        lines = lines.concat([
            '',
            '# --- Combine into 3D array ---',
            'strata <- array(c(' + tables.map(function(_, i) { return 's' + (i + 1); }).join(', ') + '),',
            '                dim = c(2, 2, ' + k + '),',
            '                dimnames = list(Exposure = c("Yes", "No"),',
            '                               Outcome = c("Yes", "No"),',
            '                               Stratum = paste0("S", 1:' + k + ')))',
            '',
            '# --- Mantel-Haenszel test ---',
            'mh_test <- mantelhaen.test(strata)',
            'print(mh_test)',
            '',
            '# --- Breslow-Day test for homogeneity (via vcd) ---',
            '# library(vcd)',
            '# woolf_test(strata)  # Woolf test for homogeneity of OR',
            '',
            '# --- Stratum-specific ' + measure + 's ---'
        ]);

        for (var j = 0; j < k; j++) {
            var tj = tables[j];
            if (measure === 'OR') {
                lines.push('cat(sprintf("Stratum ' + (j + 1) + ': OR = %.3f\\n", (' + tj.a + ' * ' + tj.d + ') / (' + tj.b + ' * ' + tj.c + ')))');
            } else {
                lines.push('cat(sprintf("Stratum ' + (j + 1) + ': RR = %.3f\\n", (' + tj.a + ' / (' + tj.a + ' + ' + tj.b + ')) / (' + tj.c + ' / (' + tj.c + ' + ' + tj.d + '))))');
            }
        }

        return formatR(lines);
    }

    function riskRateCalculators(params) {
        var calcType = params.calcType || 'incidence';

        var packages = ['epiR'];
        var script = header('Epidemiological Rate Calculators');
        script += installBlock(packages);
        script += libraryBlock(packages);

        if (calcType === 'incidence') {
            script += [
                '# --- Incidence Rate Calculation ---',
                'events <- ' + rNum(params.events || 50),
                'person_time <- ' + rNum(params.personTime || 10000),
                '',
            ].join('\n');

            script += tryCatchWrap([
                '  rate <- events / person_time',
                '  rate_per_1000 <- rate * 1000',
                '',
                '  # Exact Poisson CI',
                '  ci <- poisson.test(events, person_time)$conf.int * 1000',
                '',
                '  cat("=== Incidence Rate ===\\n")',
                '  cat("Events:", events, "\\n")',
                '  cat("Person-time:", person_time, "\\n")',
                '  cat("Rate:", round(rate, 6), "per person-time\\n")',
                '  cat("Rate per 1,000:", round(rate_per_1000, 2), "\\n")',
                '  cat("95% CI per 1,000:", round(ci[1], 2), "to", round(ci[2], 2), "\\n")',
            ].join('\n'));

        } else if (calcType === 'rateRatio') {
            script += [
                '# --- Rate Ratio Calculation ---',
                'events1 <- ' + rNum(params.events1 || 50) + '  # Exposed events',
                'pt1 <- ' + rNum(params.pt1 || 5000) + '  # Exposed person-time',
                'events2 <- ' + rNum(params.events2 || 30) + '  # Unexposed events',
                'pt2 <- ' + rNum(params.pt2 || 10000) + '  # Unexposed person-time',
                '',
            ].join('\n');

            script += tryCatchWrap([
                '  rate1 <- events1 / pt1',
                '  rate2 <- events2 / pt2',
                '  irr <- rate1 / rate2',
                '',
                '  # CI for rate ratio (Wald on log scale)',
                '  log_irr <- log(irr)',
                '  se_log_irr <- sqrt(1/events1 + 1/events2)',
                '  ci_lower <- exp(log_irr - 1.96 * se_log_irr)',
                '  ci_upper <- exp(log_irr + 1.96 * se_log_irr)',
                '',
                '  cat("=== Incidence Rate Ratio ===\\n")',
                '  cat("Rate (exposed):", round(rate1 * 1000, 2), "per 1,000\\n")',
                '  cat("Rate (unexposed):", round(rate2 * 1000, 2), "per 1,000\\n")',
                '  cat("IRR:", round(irr, 3), "\\n")',
                '  cat("95% CI:", round(ci_lower, 3), "to", round(ci_upper, 3), "\\n")',
                '  cat("P-value:", format.pval(2 * pnorm(-abs(log_irr / se_log_irr)), digits = 4), "\\n")',
            ].join('\n'));

        } else if (calcType === 'smr') {
            script += [
                '# --- Standardized Mortality Ratio ---',
                'observed <- ' + rNum(params.observed || 45),
                'expected <- ' + rNum(params.expected || 30),
                '',
            ].join('\n');

            script += tryCatchWrap([
                '  smr <- observed / expected',
                '',
                '  # Exact Poisson CI',
                '  ci <- poisson.test(observed, expected)$conf.int',
                '  p_val <- poisson.test(observed, expected)$p.value',
                '',
                '  cat("=== Standardized Mortality Ratio ===\\n")',
                '  cat("Observed:", observed, "\\n")',
                '  cat("Expected:", expected, "\\n")',
                '  cat("SMR:", round(smr, 3), "\\n")',
                '  cat("95% CI:", round(ci[1], 3), "to", round(ci[2], 3), "\\n")',
                '  cat("P-value:", format.pval(p_val, digits = 4), "\\n")',
                '  cat("Interpretation:", if (smr > 1) "Excess mortality" else "Lower than expected mortality", "\\n")',
            ].join('\n'));

        } else {
            // Generic prevalence calculation
            script += [
                '# --- Prevalence Calculation ---',
                'cases <- ' + rNum(params.cases || 150),
                'population <- ' + rNum(params.population || 5000),
                '',
            ].join('\n');

            script += tryCatchWrap([
                '  prevalence <- cases / population',
                '',
                '  # Wilson score CI',
                '  ci <- prop.test(cases, population, correct = FALSE)$conf.int',
                '',
                '  cat("=== Prevalence ===\\n")',
                '  cat("Cases:", cases, "\\n")',
                '  cat("Population:", population, "\\n")',
                '  cat("Prevalence:", round(prevalence * 100, 2), "%\\n")',
                '  cat("95% CI:", round(ci[1] * 100, 2), "% to", round(ci[2] * 100, 2), "%\\n")',
                '  cat("Prevalence per 1,000:", round(prevalence * 1000, 1), "\\n")',
            ].join('\n'));
        }

        return script;
    }

    // ============================================================
    // Life Table Construction
    // ============================================================
    function epiLifeTable(params) {
        var deaths = params.deaths || [];
        var pops = params.populations || [];
        var ages = params.ages || ['0-4', '5-14', '15-44', '45-64', '65-74', '75+'];
        var widths = params.widths || [5, 10, 30, 20, 10, 10];

        var packages = ['ggplot2'];
        var script = header('Epidemiology -- Abridged Life Table');
        script += installBlock(packages);
        script += libraryBlock(packages);

        script += [
            '# --- Input Data ---',
            'age_labels <- c(' + ages.map(function(a) { return '"' + a + '"'; }).join(', ') + ')',
            'deaths <- c(' + deaths.join(', ') + ')',
            'population <- c(' + pops.join(', ') + ')',
            'widths <- c(' + widths.join(', ') + ')',
            'radix <- 100000  # Starting population (l0)',
            '',
            '# --- Life Table Construction ---',
            ''
        ].join('\n');

        script += tryCatchWrap([
            '  n_intervals <- length(deaths)',
            '  mx <- deaths / population  # Age-specific death rates',
            '',
            '  # Calculate ax (fraction of interval lived by those who die)',
            '  ax <- ifelse(seq_along(widths) == 1, 0.1 * widths, 0.5 * widths)',
            '',
            '  # Calculate qx (probability of dying)',
            '  qx <- (widths * mx) / (1 + (widths - ax) * mx)',
            '  qx[qx > 1] <- 1',
            '  qx[n_intervals] <- 1  # Last interval is open-ended',
            '',
            '  # Calculate lx (survivors)',
            '  lx <- numeric(n_intervals)',
            '  lx[1] <- radix',
            '  for (i in 2:n_intervals) {',
            '    lx[i] <- lx[i-1] * (1 - qx[i-1])',
            '  }',
            '',
            '  # dx (deaths in life table)',
            '  dx <- lx * qx',
            '',
            '  # nLx (person-years lived)',
            '  nLx <- widths * (lx - dx) + ax * dx',
            '',
            '  # Tx (total person-years remaining)',
            '  Tx <- rev(cumsum(rev(nLx)))',
            '',
            '  # ex (life expectancy)',
            '  ex <- Tx / lx',
            '',
            '  # Build data frame',
            '  life_table <- data.frame(',
            '    Age = age_labels,',
            '    n = widths,',
            '    mx = round(mx, 6),',
            '    qx = round(qx, 5),',
            '    lx = round(lx),',
            '    dx = round(dx),',
            '    nLx = round(nLx),',
            '    Tx = round(Tx),',
            '    ex = round(ex, 1)',
            '  )',
            '',
            '  cat("=== Abridged Life Table ===\\n")',
            '  print(life_table, row.names = FALSE)',
            '  cat("\\nLife expectancy at birth (e0):", round(ex[1], 1), "years\\n")',
            '',
            '  # Survivorship Curve',
            '  age_midpoints <- cumsum(widths) - widths / 2',
            '  surv_df <- data.frame(age = age_midpoints, lx = lx)',
            '',
            '  p <- ggplot(surv_df, aes(x = age, y = lx)) +',
            '    geom_line(color = "#4A90D9", linewidth = 1.2) +',
            '    geom_point(color = "#4A90D9", size = 3) +',
            '    scale_y_continuous(labels = scales::comma, limits = c(0, radix * 1.05)) +',
            '    labs(title = "Survivorship Curve (lx)",',
            '         subtitle = paste0("Life expectancy at birth: ", round(ex[1], 1), " years"),',
            '         x = "Age (midpoint of interval)", y = "Survivors (lx)") +',
            '    theme_minimal(base_size = 12) +',
            '    theme(plot.title = element_text(face = "bold"))',
            '  print(p)',
        ].join('\n'));

        return script;
    }

    // ============================================================
    // PUBLIC API
    // ============================================================

    return {
        // Sample size calculations
        sampleSize: {
            twoProportions: sampleSize.twoProportions,
            twoMeans: sampleSize.twoMeans,
            survival: sampleSize.survival,
            clusterRCT: sampleSize.clusterRCT,
            nonInferiority: sampleSize.nonInferiority
        },

        // Power analysis
        powerAnalysis: powerAnalysis,

        // Meta-analysis
        metaAnalysis: metaAnalysis,

        // Survival analysis
        survivalAnalysis: survivalAnalysis,

        // Diagnostic accuracy
        diagnosticAccuracy: diagnosticAccuracy,

        // Epidemiology 2x2
        epiTwoByTwo: epiTwoByTwo,

        // Effect size conversions
        effectSize: effectSize,

        // NNT calculation
        nntCalculator: nntCalculator,

        // Regression helper
        regressionHelper: regressionHelper,

        // Risk calculators (epi rates)
        riskRateCalculators: riskRateCalculators,

        // Causal inference (DiD)
        causalInferenceDiD: causalInferenceDiD,

        // ML prediction (validation & NRI)
        mlPredictionValidation: mlPredictionValidation,
        mlPredictionNRI: mlPredictionNRI,

        // Biostats reference (CI)
        biostatCI: biostatCI,

        // Biostats reference (p-value adjustment)
        biostatPvalAdjust: biostatPvalAdjust,

        // Epi rate ratio
        riskRateRatio: riskRateRatio,

        // SMR
        riskSMR: riskSMR,

        // Attributable risk
        riskAttributable: riskAttributable,

        // Mantel-Haenszel
        epiMantelHaenszel: epiMantelHaenszel,

        // Life table
        epiLifeTable: epiLifeTable,

        // Utility: copy script to clipboard
        copyScript: copyScript,

        // Utility: download script as .R file
        downloadScript: downloadScript,

        // UI: show script modal
        showScript: showScript,

        // UI: generate button HTML
        buttonHTML: buttonHTML,

        // Utility: format R code
        formatR: formatR
    };
})();

if (typeof module !== 'undefined') module.exports = RGenerator;
