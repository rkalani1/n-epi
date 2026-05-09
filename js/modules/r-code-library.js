/**
 * Neuro-Epi — R Code Library
 * Curated, runnable R code recipes for common clinical research tasks.
 */
(function() {
    'use strict';
    var MODULE_ID = 'r-code-library';

    var categories = [
        {
            name: 'Sample Size & Power',
            icon: '#',
            recipes: [
                {
                    title: 'Two-Sample Proportions',
                    desc: 'Sample size for comparing two proportions (e.g., treatment vs control event rates)',
                    packages: ['pwr'],
                    code: [
                        '# Sample size: two-sample proportions',
                        '# install.packages("pwr")',
                        'library(pwr)',
                        '',
                        'p1 <- 0.30   # control event rate',
                        'p2 <- 0.20   # treatment event rate',
                        'alpha <- 0.05',
                        'power <- 0.80',
                        '',
                        'h <- ES.h(p1, p2)  # Cohen\'s h effect size',
                        'result <- pwr.2p.test(h = h, sig.level = alpha, power = power)',
                        '',
                        'cat("Effect size (h):", round(h, 4), "\\n")',
                        'cat("N per group:", ceiling(result$n), "\\n")',
                        'cat("Total N:", ceiling(result$n) * 2, "\\n")'
                    ].join('\n')
                },
                {
                    title: 'Two-Sample Means',
                    desc: 'Sample size for comparing two means (e.g., NIHSS change)',
                    packages: ['pwr'],
                    code: [
                        '# Sample size: two-sample means',
                        'library(pwr)',
                        '',
                        'delta <- 2.5     # expected difference in means',
                        'sd <- 4.0        # common standard deviation',
                        'alpha <- 0.05',
                        'power <- 0.80',
                        '',
                        'd <- delta / sd   # Cohen\'s d',
                        'result <- pwr.t.test(d = d, sig.level = alpha, power = power,',
                        '                     type = "two.sample", alternative = "two.sided")',
                        '',
                        'cat("Cohen\'s d:", round(d, 4), "\\n")',
                        'cat("N per group:", ceiling(result$n), "\\n")',
                        'cat("Total N:", ceiling(result$n) * 2, "\\n")'
                    ].join('\n')
                },
                {
                    title: 'Survival (Log-Rank)',
                    desc: 'Sample size for time-to-event using Schoenfeld method',
                    packages: ['pwr', 'survival'],
                    code: [
                        '# Sample size: survival / time-to-event (Schoenfeld)',
                        'library(survival)',
                        '',
                        'hr <- 0.75          # hazard ratio to detect',
                        'alpha <- 0.05',
                        'power <- 0.80',
                        'allocation <- 1     # 1:1 allocation',
                        'prob_event <- 0.70  # expected proportion with event',
                        '',
                        'za <- qnorm(1 - alpha / 2)',
                        'zb <- qnorm(power)',
                        '',
                        '# Schoenfeld formula',
                        'events_needed <- ((za + zb)^2) / ((log(hr))^2 * (allocation / (1 + allocation)^2))',
                        'total_n <- ceiling(events_needed / prob_event)',
                        '',
                        'cat("Events needed:", ceiling(events_needed), "\\n")',
                        'cat("Total N (accounting for event rate):", total_n, "\\n")',
                        'cat("N per group:", ceiling(total_n / 2), "\\n")'
                    ].join('\n')
                },
                {
                    title: 'Power Curve Plot',
                    desc: 'Generate a power curve across sample sizes',
                    packages: ['pwr', 'ggplot2'],
                    code: [
                        '# Power curve: visualize power vs sample size',
                        'library(pwr)',
                        'library(ggplot2)',
                        '',
                        'h <- ES.h(0.30, 0.20)',
                        'ns <- seq(50, 500, by = 10)',
                        '',
                        'powers <- sapply(ns, function(n) {',
                        '  pwr.2p.test(h = h, n = n, sig.level = 0.05)$power',
                        '})',
                        '',
                        'df <- data.frame(N = ns, Power = powers)',
                        '',
                        'ggplot(df, aes(x = N, y = Power)) +',
                        '  geom_line(color = "#22d3ee", linewidth = 1.2) +',
                        '  geom_hline(yintercept = 0.80, linetype = "dashed", color = "red") +',
                        '  annotate("text", x = max(ns) * 0.8, y = 0.82, label = "80% power",',
                        '           color = "red", size = 3.5) +',
                        '  scale_y_continuous(labels = scales::percent, limits = c(0, 1)) +',
                        '  labs(title = "Power Curve", x = "Sample Size per Group", y = "Power") +',
                        '  theme_minimal()'
                    ].join('\n')
                }
            ]
        },
        {
            name: 'Epidemiology',
            icon: '2',
            recipes: [
                {
                    title: '2x2 Table Analysis',
                    desc: 'RR, OR, RD with confidence intervals from a 2x2 table',
                    packages: ['epiR'],
                    code: [
                        '# 2x2 table analysis with epiR',
                        '# install.packages("epiR")',
                        'library(epiR)',
                        '',
                        '# Layout: | D+ D- |',
                        '#    E+   |  a  b |',
                        '#    E-   |  c  d |',
                        'a <- 30; b <- 70; c <- 15; d <- 85',
                        '',
                        'tab <- matrix(c(a, b, c, d), nrow = 2, byrow = TRUE)',
                        'result <- epi.2by2(as.table(tab), method = "cohort.count")',
                        'print(result)'
                    ].join('\n')
                },
                {
                    title: 'Mantel-Haenszel Stratified Analysis',
                    desc: 'Stratified OR with CMH test',
                    packages: ['stats'],
                    code: [
                        '# Mantel-Haenszel stratified analysis',
                        '',
                        '# Stratum 1',
                        'a1 <- 25; b1 <- 75; c1 <- 10; d1 <- 90',
                        '# Stratum 2',
                        'a2 <- 15; b2 <- 60; c2 <- 8; d2 <- 80',
                        '',
                        'strata <- array(c(a1, c1, b1, d1, a2, c2, b2, d2),',
                        '                dim = c(2, 2, 2),',
                        '                dimnames = list(',
                        '                  Exposure = c("E+", "E-"),',
                        '                  Disease = c("D+", "D-"),',
                        '                  Stratum = c("Stratum 1", "Stratum 2")))',
                        '',
                        'result <- mantelhaen.test(strata)',
                        'cat("CMH OR:", round(result$estimate, 3), "\\n")',
                        'cat("95% CI:", round(result$conf.int, 3), "\\n")',
                        'cat("p-value:", format.pval(result$p.value), "\\n")'
                    ].join('\n')
                },
                {
                    title: 'Age Standardization',
                    desc: 'Direct age-standardized rates',
                    packages: ['epitools'],
                    code: [
                        '# Direct age standardization',
                        '# install.packages("epitools")',
                        'library(epitools)',
                        '',
                        '# Population data by age group',
                        'cases <- c(5, 15, 30, 50, 80)',
                        'person_years <- c(10000, 12000, 15000, 11000, 8000)',
                        '',
                        '# Standard population weights (e.g., WHO World Standard)',
                        'std_pop <- c(8860, 8600, 8600, 6600, 4400)',
                        '',
                        '# Crude rates per 100,000',
                        'crude_rates <- (cases / person_years) * 100000',
                        '',
                        '# Direct standardized rate',
                        'weights <- std_pop / sum(std_pop)',
                        'asr <- sum(crude_rates * weights)',
                        '',
                        'cat("Age-specific rates per 100k:", round(crude_rates, 1), "\\n")',
                        'cat("Crude rate per 100k:", round(sum(cases) / sum(person_years) * 1e5, 1), "\\n")',
                        'cat("Age-standardized rate per 100k:", round(asr, 1), "\\n")'
                    ].join('\n')
                }
            ]
        },
        {
            name: 'Meta-Analysis',
            icon: 'M',
            recipes: [
                {
                    title: 'Random Effects Meta-Analysis',
                    desc: 'DerSimonian-Laird with forest plot',
                    packages: ['meta', 'metafor'],
                    code: [
                        '# Random effects meta-analysis with forest plot',
                        '# install.packages(c("meta", "metafor"))',
                        'library(meta)',
                        '',
                        'study <- c("Trial A", "Trial B", "Trial C", "Trial D", "Trial E")',
                        'yi <- c(0.35, 0.52, 0.18, 0.45, 0.60)   # log(OR)',
                        'sei <- c(0.12, 0.18, 0.10, 0.15, 0.20)  # SE of log(OR)',
                        '',
                        'm <- metagen(TE = yi, seTE = sei, studlab = study,',
                        '             sm = "OR", method.tau = "DL",',
                        '             common = TRUE, random = TRUE)  # meta >= 5.0',
                        '',
                        'summary(m)',
                        'forest(m, sortvar = yi, col.diamond = "steelblue")',
                        'funnel(m)',
                        '',
                        '# Heterogeneity',
                        'cat("\\nI-squared:", round(m$I2 * 100, 1), "%\\n")',
                        'cat("Tau-squared:", round(m$tau2, 4), "\\n")',
                        'cat("Q statistic:", round(m$Q, 2), ", p =", format.pval(m$pval.Q), "\\n")'
                    ].join('\n')
                },
                {
                    title: 'Subgroup Analysis',
                    desc: 'Subgroup meta-analysis with interaction test',
                    packages: ['meta'],
                    code: [
                        '# Subgroup meta-analysis',
                        'library(meta)',
                        '',
                        'study <- c("A", "B", "C", "D", "E", "F")',
                        'yi <- c(0.30, 0.45, 0.25, 0.60, 0.55, 0.40)',
                        'sei <- c(0.12, 0.15, 0.10, 0.18, 0.16, 0.14)',
                        'subgroup <- c("IV tPA", "IV tPA", "IV tPA",',
                        '              "Thrombectomy", "Thrombectomy", "Thrombectomy")',
                        '',
                        'm <- metagen(TE = yi, seTE = sei, studlab = study, sm = "OR",',
                        '             subgroup = subgroup)',
                        '',
                        'forest(m, sortvar = subgroup)',
                        '',
                        '# Test for subgroup differences',
                        'cat("Test for subgroup differences:\\n")',
                        'cat("Q:", round(m$Q.b.random, 2), "\\n")',
                        'cat("p-value:", format.pval(m$pval.Q.b.random), "\\n")'
                    ].join('\n')
                },
                {
                    title: 'Trim and Fill',
                    desc: 'Publication bias adjustment with trim-and-fill',
                    packages: ['metafor'],
                    code: [
                        '# Trim and fill for publication bias',
                        'library(metafor)',
                        '',
                        'yi <- c(0.35, 0.52, 0.18, 0.45, 0.60, 0.28, 0.40)',
                        'sei <- c(0.12, 0.18, 0.10, 0.15, 0.20, 0.11, 0.16)',
                        '',
                        'res <- rma(yi = yi, sei = sei, method = "DL")',
                        'tf <- trimfill(res)',
                        '',
                        'summary(tf)',
                        'funnel(tf)',
                        '',
                        '# Egger\'s test',
                        'regtest(res)',
                        '',
                        'cat("\\nOriginal estimate:", round(res$beta, 4), "\\n")',
                        'cat("Trim-and-fill estimate:", round(tf$beta, 4), "\\n")',
                        'cat("Studies imputed:", tf$k0, "\\n")'
                    ].join('\n')
                }
            ]
        },
        {
            name: 'Survival Analysis',
            icon: 'S',
            recipes: [
                {
                    title: 'Kaplan-Meier with Log-Rank',
                    desc: 'KM curves, median survival, log-rank test',
                    packages: ['survival', 'survminer'],
                    code: [
                        '# Kaplan-Meier survival analysis',
                        '# install.packages(c("survival", "survminer"))',
                        'library(survival)',
                        'library(survminer)',
                        '',
                        '# Example data',
                        'time <- c(5, 8, 12, 15, 18, 22, 25, 30, 35, 40,',
                        '          3, 6, 10, 14, 16, 20, 24, 28, 33, 38)',
                        'status <- c(1, 1, 0, 1, 1, 0, 1, 0, 1, 0,',
                        '            1, 1, 1, 0, 1, 1, 0, 1, 0, 1)',
                        'group <- rep(c("Treatment", "Control"), each = 10)',
                        '',
                        'df <- data.frame(time, status, group)',
                        '',
                        '# Kaplan-Meier fit',
                        'fit <- survfit(Surv(time, status) ~ group, data = df)',
                        'print(fit)',
                        '',
                        '# Log-rank test',
                        'lr <- survdiff(Surv(time, status) ~ group, data = df)',
                        'lr_df <- length(lr$n) - 1',
                        'lr_p  <- 1 - pchisq(lr$chisq, df = lr_df)',
                        'cat(sprintf("\\nLog-rank chi-sq = %.3f, df = %d, p = %s\\n",',
                        '            lr$chisq, lr_df, format.pval(lr_p, digits = 4)))',
                        '',
                        '# Publication-quality KM plot',
                        'ggsurvplot(fit, data = df,',
                        '           pval = TRUE, risk.table = TRUE,',
                        '           palette = c("#22d3ee", "#f97316"),',
                        '           xlab = "Time (months)", ylab = "Survival Probability",',
                        '           title = "Kaplan-Meier Survival Curve",',
                        '           ggtheme = theme_minimal())'
                    ].join('\n')
                },
                {
                    title: 'Cox Proportional Hazards',
                    desc: 'Cox regression with hazard ratios',
                    packages: ['survival', 'survminer'],
                    code: [
                        '# Cox proportional hazards regression',
                        'library(survival)',
                        'library(survminer)',
                        '',
                        '# Using lung dataset as example',
                        'data(lung)',
                        '',
                        '# Fit Cox model',
                        'fit <- coxph(Surv(time, status) ~ age + sex + ph.ecog, data = lung)',
                        'summary(fit)',
                        '',
                        '# Forest plot of hazard ratios',
                        'ggforest(fit, data = lung)',
                        '',
                        '# Test proportional hazards assumption',
                        'test.ph <- cox.zph(fit)',
                        'print(test.ph)',
                        'plot(test.ph)'
                    ].join('\n')
                },
                {
                    title: 'Restricted Mean Survival Time',
                    desc: 'RMST comparison between groups',
                    packages: ['survRM2'],
                    code: [
                        '# Restricted Mean Survival Time',
                        '# install.packages("survRM2")',
                        'library(survRM2)',
                        '',
                        'time <- c(5, 8, 12, 15, 18, 22, 25, 30, 35, 40,',
                        '          3, 6, 10, 14, 16, 20, 24, 28, 33, 38)',
                        'status <- c(1, 1, 0, 1, 1, 0, 1, 0, 1, 0,',
                        '            1, 1, 1, 0, 1, 1, 0, 1, 0, 1)',
                        'arm <- c(rep(1, 10), rep(0, 10))  # 1 = treatment, 0 = control',
                        '',
                        '# RMST comparison at tau = 36 months',
                        'result <- rmst2(time, status, arm, tau = 36)',
                        'print(result)'
                    ].join('\n')
                }
            ]
        },
        {
            name: 'Diagnostic Accuracy',
            icon: 'D',
            recipes: [
                {
                    title: 'ROC Curve Analysis',
                    desc: 'ROC curve, AUC, optimal threshold',
                    packages: ['pROC', 'ggplot2'],
                    code: [
                        '# ROC curve analysis',
                        '# install.packages("pROC")',
                        'library(pROC)',
                        '',
                        '# Example: NIHSS predicting good outcome',
                        'set.seed(42)',
                        'n <- 200',
                        'nihss <- c(rnorm(100, 12, 5), rnorm(100, 18, 6))',
                        'outcome <- c(rep(1, 100), rep(0, 100))',
                        '',
                        'roc_obj <- roc(outcome, nihss, direction = "<")',
                        '',
                        '# AUC with CI',
                        'auc_ci <- ci.auc(roc_obj)',
                        'cat("AUC:", round(auc(roc_obj), 3), "\\n")',
                        'cat("95% CI:", round(auc_ci[1], 3), "-", round(auc_ci[3], 3), "\\n")',
                        '',
                        '# Optimal threshold (Youden\'s J). transpose = FALSE works for pROC >= 1.16.',
                        'coords <- coords(roc_obj, "best",',
                        '                 ret = c("threshold", "sensitivity", "specificity"),',
                        '                 transpose = FALSE)',
                        'cat("\\nOptimal threshold:", round(coords$threshold, 2), "\\n")',
                        'cat("Sensitivity:", round(coords$sensitivity, 3), "\\n")',
                        'cat("Specificity:", round(coords$specificity, 3), "\\n")',
                        '',
                        '# Plot',
                        'ggroc(roc_obj) +',
                        '  geom_abline(slope = 1, intercept = 1, linetype = "dashed", color = "grey") +',
                        '  annotate("text", x = 0.3, y = 0.3, label = paste0("AUC = ", round(auc(roc_obj), 3))) +',
                        '  theme_minimal() +',
                        '  labs(title = "ROC Curve")'
                    ].join('\n')
                },
                {
                    title: 'Diagnostic Test Comparison',
                    desc: 'Compare two ROC curves (DeLong test)',
                    packages: ['pROC'],
                    code: [
                        '# Compare two diagnostic tests (DeLong test)',
                        'library(pROC)',
                        '',
                        'set.seed(42)',
                        'n <- 200',
                        'outcome <- rbinom(n, 1, 0.4)',
                        'test1 <- outcome * rnorm(n, 2, 1) + (1 - outcome) * rnorm(n, 0, 1)',
                        'test2 <- outcome * rnorm(n, 1.5, 1) + (1 - outcome) * rnorm(n, 0, 1)',
                        '',
                        'roc1 <- roc(outcome, test1)',
                        'roc2 <- roc(outcome, test2)',
                        '',
                        'cat("Test 1 AUC:", round(auc(roc1), 3), "\\n")',
                        'cat("Test 2 AUC:", round(auc(roc2), 3), "\\n")',
                        '',
                        '# DeLong test',
                        'comparison <- roc.test(roc1, roc2, method = "delong")',
                        'cat("\\nDifference in AUC:", round(comparison$estimate[1] - comparison$estimate[2], 4), "\\n")',
                        'cat("p-value:", format.pval(comparison$p.value), "\\n")'
                    ].join('\n')
                }
            ]
        },
        {
            name: 'Visualization',
            icon: 'V',
            recipes: [
                {
                    title: 'Publication Forest Plot',
                    desc: 'Journal-ready forest plot with ggplot2',
                    packages: ['ggplot2'],
                    code: [
                        '# Publication-quality forest plot',
                        'library(ggplot2)',
                        '',
                        'df <- data.frame(',
                        '  study = c("NINDS", "ECASS III", "IST-3", "SITS-MOST", "Summary"),',
                        '  or = c(1.7, 1.34, 1.27, 1.50, 1.42),',
                        '  lower = c(1.2, 1.02, 1.10, 1.20, 1.25),',
                        '  upper = c(2.4, 1.76, 1.47, 1.88, 1.62),',
                        '  weight = c(25, 30, 20, 15, NA)',
                        ')',
                        '',
                        'df$study <- factor(df$study, levels = rev(df$study))',
                        'df$is_summary <- df$study == "Summary"',
                        '',
                        'ggplot(df, aes(x = or, y = study)) +',
                        '  geom_vline(xintercept = 1, linetype = "dashed", color = "grey50") +',
                        '  geom_errorbarh(aes(xmin = lower, xmax = upper), height = 0.2) +',
                        '  geom_point(aes(size = weight, shape = is_summary), fill = "steelblue") +',
                        '  scale_shape_manual(values = c(16, 18), guide = "none") +',
                        '  scale_size_continuous(range = c(2, 6), guide = "none") +',
                        '  scale_x_log10() +',
                        '  labs(title = "Forest Plot: OR for Good Outcome", x = "Odds Ratio (log scale)", y = "") +',
                        '  theme_minimal() +',
                        '  theme(panel.grid.minor = element_blank())'
                    ].join('\n')
                },
                {
                    title: 'Funnel Plot',
                    desc: 'Funnel plot for publication bias',
                    packages: ['metafor'],
                    code: [
                        '# Enhanced funnel plot',
                        'library(metafor)',
                        '',
                        'yi <- c(0.35, 0.52, 0.18, 0.45, 0.60, 0.28, 0.40)',
                        'sei <- c(0.12, 0.18, 0.10, 0.15, 0.20, 0.11, 0.16)',
                        'study <- paste("Study", 1:7)',
                        '',
                        'res <- rma(yi = yi, sei = sei, method = "DL")',
                        '',
                        'funnel(res, main = "Funnel Plot",',
                        '       xlab = "Log Odds Ratio",',
                        '       col = "steelblue", pch = 19,',
                        '       level = c(90, 95, 99),',
                        '       shade = c("white", "grey85", "grey75"),',
                        '       refline = res$beta)'
                    ].join('\n')
                }
            ]
        },
        {
            name: 'Data Wrangling',
            icon: 'W',
            recipes: [
                {
                    title: 'Table 1 Generator',
                    desc: 'Publication-ready baseline characteristics table',
                    packages: ['tableone'],
                    code: [
                        '# Table 1: Baseline characteristics',
                        '# install.packages("tableone")',
                        'library(tableone)',
                        '',
                        '# Example clinical data',
                        'set.seed(42)',
                        'n <- 200',
                        'df <- data.frame(',
                        '  group = rep(c("Treatment", "Control"), each = n/2),',
                        '  age = c(rnorm(n/2, 68, 12), rnorm(n/2, 70, 11)),',
                        '  sex = factor(rbinom(n, 1, 0.45), labels = c("Male", "Female")),',
                        '  nihss = c(rpois(n/2, 14), rpois(n/2, 13)),',
                        '  diabetes = factor(rbinom(n, 1, 0.25), labels = c("No", "Yes")),',
                        '  hypertension = factor(rbinom(n, 1, 0.65), labels = c("No", "Yes")),',
                        '  smoking = factor(sample(0:2, n, replace = TRUE, prob = c(0.4, 0.35, 0.25)),',
                        '                  labels = c("Never", "Former", "Current"))',
                        ')',
                        '',
                        '# Create Table 1',
                        'vars <- c("age", "sex", "nihss", "diabetes", "hypertension", "smoking")',
                        'cat_vars <- c("sex", "diabetes", "hypertension", "smoking")',
                        '',
                        'tab1 <- CreateTableOne(vars = vars, strata = "group",',
                        '                       data = df, factorVars = cat_vars)',
                        '',
                        '# Print with SMD and exact tests for small cells',
                        'print(tab1, smd = TRUE, test = TRUE, nonnormal = "nihss")',
                        '',
                        '# Export to CSV',
                        'tab1_csv <- print(tab1, quote = FALSE, noSpaces = TRUE, printToggle = FALSE)',
                        'write.csv(tab1_csv, "table1.csv")'
                    ].join('\n')
                },
                {
                    title: 'Multiple Imputation (MICE)',
                    desc: 'Handle missing data with multiple imputation by chained equations',
                    packages: ['mice', 'VIM'],
                    code: [
                        '# Multiple imputation with MICE',
                        '# install.packages(c("mice", "VIM"))',
                        'library(mice)',
                        '',
                        '# Visualize missing data pattern',
                        'md.pattern(your_data)',
                        '',
                        '# Impute (m = 20 datasets, predictive mean matching)',
                        'imp <- mice(your_data, m = 20, method = "pmm", seed = 42)',
                        '',
                        '# Check convergence',
                        'plot(imp)  # Should show mixing/convergence',
                        '',
                        '# Fit model on each imputed dataset',
                        'fit <- with(imp, glm(outcome ~ age + nihss + treatment,',
                        '                     family = binomial))',
                        '',
                        '# Pool results using Rubin\'s rules',
                        'pooled <- pool(fit)',
                        'summary(pooled)',
                        '',
                        '# Pool R-squared',
                        'pool.r.squared(fit)',
                        '',
                        '# Diagnostic: compare observed vs imputed distributions',
                        'densityplot(imp, ~age + nihss)'
                    ].join('\n')
                },
                {
                    title: 'Reshape Long to Wide',
                    desc: 'Reshape repeated measures data between long and wide formats',
                    packages: ['tidyr'],
                    code: [
                        '# Reshape data: long <-> wide',
                        'library(tidyr)',
                        '',
                        '# Example: repeated NIHSS measurements',
                        'long_data <- data.frame(',
                        '  patient_id = rep(1:5, each = 3),',
                        '  timepoint = rep(c("baseline", "day7", "day90"), 5),',
                        '  nihss = c(14,8,4, 18,12,6, 10,6,2, 22,15,10, 16,9,5)',
                        ')',
                        '',
                        '# Long to wide',
                        'wide_data <- pivot_wider(long_data,',
                        '  names_from = timepoint,',
                        '  values_from = nihss,',
                        '  names_prefix = "nihss_"',
                        ')',
                        'print(wide_data)',
                        '',
                        '# Wide to long',
                        'back_to_long <- pivot_longer(wide_data,',
                        '  cols = starts_with("nihss_"),',
                        '  names_to = "timepoint",',
                        '  names_prefix = "nihss_",',
                        '  values_to = "nihss"',
                        ')',
                        'print(back_to_long)'
                    ].join('\n')
                }
            ]
        },
        {
            name: 'Causal Inference',
            icon: 'C',
            recipes: [
                {
                    title: 'Propensity Score Matching',
                    desc: 'Match treated and control subjects on propensity scores',
                    packages: ['MatchIt', 'cobalt'],
                    code: [
                        '# Propensity score matching',
                        '# install.packages(c("MatchIt", "cobalt"))',
                        'library(MatchIt)',
                        'library(cobalt)',
                        '',
                        '# Simulate observational data',
                        'set.seed(42)',
                        'n <- 500',
                        'age <- rnorm(n, 70, 10)',
                        'nihss <- rpois(n, 14)',
                        'diabetes <- rbinom(n, 1, 0.3)',
                        '',
                        '# Treatment assignment (confounded by age and NIHSS)',
                        'p_treat <- plogis(-3 + 0.03 * age - 0.05 * nihss)',
                        'treatment <- rbinom(n, 1, p_treat)',
                        '',
                        'outcome <- rbinom(n, 1, plogis(-1 + 0.02*age + 0.08*nihss - 0.5*treatment))',
                        'df <- data.frame(outcome, treatment, age, nihss, diabetes)',
                        '',
                        '# 1:1 nearest-neighbor matching',
                        'match_obj <- matchit(treatment ~ age + nihss + diabetes,',
                        '                     data = df, method = "nearest",',
                        '                     distance = "glm", ratio = 1)',
                        '',
                        '# Check balance',
                        'summary(match_obj)',
                        'love.plot(match_obj, thresholds = c(m = 0.1))  # SMD < 0.1',
                        '',
                        '# Extract matched data',
                        'matched_df <- match.data(match_obj)',
                        '',
                        '# Estimate treatment effect',
                        'fit <- glm(outcome ~ treatment, data = matched_df,',
                        '           family = binomial, weights = weights)',
                        'cat("OR:", round(exp(coef(fit)["treatment"]), 3), "\\n")',
                        'cat("95% CI:", round(exp(confint(fit)["treatment",]), 3), "\\n")'
                    ].join('\n')
                },
                {
                    title: 'Inverse Probability Weighting',
                    desc: 'IPTW for causal effect estimation in observational data',
                    packages: ['WeightIt', 'survey', 'cobalt'],
                    code: [
                        '# Inverse probability of treatment weighting (IPTW)',
                        '# install.packages(c("WeightIt", "survey", "cobalt"))',
                        'library(WeightIt)',
                        'library(survey)',
                        'library(cobalt)',
                        '',
                        '# Estimate propensity scores and weights',
                        'W <- weightit(treatment ~ age + nihss + diabetes,',
                        '              data = df, method = "ps",',
                        '              estimand = "ATE")',
                        '',
                        '# Check balance after weighting',
                        'bal.tab(W, thresholds = c(m = 0.1))',
                        'love.plot(W)',
                        '',
                        '# Weighted outcome model (robust SEs via survey package)',
                        'design <- svydesign(ids = ~1, weights = W$weights, data = df)',
                        'fit <- svyglm(outcome ~ treatment, design = design,',
                        '              family = binomial)',
                        '',
                        'summary(fit)',
                        'cat("\\nIPTW OR:", round(exp(coef(fit)["treatment"]), 3), "\\n")',
                        'cat("95% CI:", round(exp(confint(fit)["treatment",]), 3), "\\n")'
                    ].join('\n')
                },
                {
                    title: 'Difference-in-Differences',
                    desc: 'DiD estimator for policy evaluation or treatment effects',
                    packages: ['fixest'],
                    code: [
                        '# Difference-in-Differences',
                        '# install.packages("fixest")',
                        'library(fixest)',
                        '',
                        '# Simulate panel data (e.g., stroke center policy change)',
                        'set.seed(42)',
                        'n_hospitals <- 50',
                        'n_periods <- 10',
                        '',
                        'df <- expand.grid(hospital = 1:n_hospitals, time = 1:n_periods)',
                        'df$treated_group <- ifelse(df$hospital <= 25, 1, 0)',
                        'df$post <- ifelse(df$time > 5, 1, 0)',
                        '',
                        '# Outcome with treatment effect = -2 (reduction in mortality)',
                        'df$mortality <- 15 + 2*df$treated_group - 0.5*df$time +',
                        '  -2*df$treated_group*df$post + rnorm(nrow(df), 0, 2)',
                        '',
                        '# Two-way fixed effects DiD',
                        'fit <- feols(mortality ~ treated_group:post |',
                        '             hospital + time, data = df)',
                        'summary(fit)',
                        '',
                        '# Visualize parallel trends',
                        'library(ggplot2)',
                        'agg <- aggregate(mortality ~ time + treated_group, df, mean)',
                        'agg$group <- factor(agg$treated_group, labels = c("Control", "Treated"))',
                        'ggplot(agg, aes(x = time, y = mortality, color = group)) +',
                        '  geom_line(linewidth = 1) + geom_point() +',
                        '  geom_vline(xintercept = 5.5, linetype = "dashed") +',
                        '  theme_minimal() + labs(title = "Difference-in-Differences")'
                    ].join('\n')
                }
            ]
        },
        {
            name: 'Mixed Models',
            icon: 'X',
            recipes: [
                {
                    title: 'Linear Mixed Model',
                    desc: 'Repeated measures with random intercepts and slopes',
                    packages: ['lme4', 'lmerTest'],
                    code: [
                        '# Linear mixed model for repeated measures',
                        '# install.packages(c("lme4", "lmerTest"))',
                        'library(lme4)',
                        'library(lmerTest)  # for p-values',
                        '',
                        '# Simulate longitudinal NIHSS data',
                        'set.seed(42)',
                        'n_patients <- 50',
                        'n_timepoints <- 4',
                        '',
                        'df <- expand.grid(patient = 1:n_patients, time = 0:(n_timepoints-1))',
                        'df$treatment <- rep(rbinom(n_patients, 1, 0.5), each = n_timepoints)',
                        '',
                        '# Random intercepts + slopes',
                        'patient_intercept <- rep(rnorm(n_patients, 0, 3), each = n_timepoints)',
                        'patient_slope <- rep(rnorm(n_patients, 0, 0.5), each = n_timepoints)',
                        '',
                        'df$nihss <- 15 + patient_intercept +',
                        '  (-1.5 + patient_slope) * df$time +',
                        '  -2 * df$treatment * df$time +  # treatment x time interaction',
                        '  rnorm(nrow(df), 0, 2)',
                        '',
                        '# Fit mixed model',
                        'fit <- lmer(nihss ~ treatment * time + (1 + time | patient), data = df)',
                        'summary(fit)',
                        '',
                        '# Confidence intervals',
                        'confint(fit, method = "Wald")',
                        '',
                        '# ICC',
                        'performance::icc(fit)'
                    ].join('\n')
                },
                {
                    title: 'Generalized Linear Mixed Model',
                    desc: 'Mixed model for binary outcomes (multi-site trials)',
                    packages: ['lme4'],
                    code: [
                        '# GLMM for binary outcome with site clustering',
                        'library(lme4)',
                        '',
                        '# Simulate multi-site clinical trial',
                        'set.seed(42)',
                        'n_sites <- 20',
                        'n_per_site <- 30',
                        '',
                        'df <- data.frame(',
                        '  site = rep(1:n_sites, each = n_per_site),',
                        '  treatment = rep(c(0, 1), n_sites * n_per_site / 2),',
                        '  age = rnorm(n_sites * n_per_site, 70, 10)',
                        ')',
                        '',
                        '# Site random effect',
                        'site_effect <- rep(rnorm(n_sites, 0, 0.5), each = n_per_site)',
                        'df$outcome <- rbinom(nrow(df), 1,',
                        '  plogis(-1 + site_effect + 0.5*df$treatment + 0.02*df$age))',
                        '',
                        '# Fit GLMM',
                        'fit <- glmer(outcome ~ treatment + age + (1 | site),',
                        '             data = df, family = binomial)',
                        'summary(fit)',
                        '',
                        '# Fixed effects as OR',
                        'cat("\\nOdds Ratios:\\n")',
                        'print(round(exp(fixef(fit)), 3))',
                        'cat("95% CI for treatment OR:",',
                        '    round(exp(confint(fit, parm = "treatment")), 3), "\\n")'
                    ].join('\n')
                }
            ]
        },
        {
            name: 'Regression',
            icon: 'R',
            recipes: [
                {
                    title: 'Logistic Regression',
                    desc: 'Binary logistic regression with OR and diagnostics',
                    packages: ['stats'],
                    code: [
                        '# Logistic regression for clinical outcomes',
                        '',
                        '# Simulate stroke outcome data',
                        'set.seed(42)',
                        'n <- 300',
                        'age <- rnorm(n, 70, 10)',
                        'nihss <- rpois(n, 12)',
                        'tpa <- rbinom(n, 1, 0.5)',
                        '',
                        'logit_p <- -2 + 0.03 * age + 0.1 * nihss - 0.5 * tpa',
                        'outcome <- rbinom(n, 1, plogis(logit_p))',
                        '',
                        'df <- data.frame(outcome, age, nihss, tpa)',
                        '',
                        '# Fit model',
                        'fit <- glm(outcome ~ age + nihss + tpa, data = df, family = binomial)',
                        'summary(fit)',
                        '',
                        '# Odds ratios with 95% CI',
                        'or <- exp(cbind(OR = coef(fit), confint(fit)))',
                        'print(round(or, 3))',
                        '',
                        '# Model diagnostics',
                        'cat("\\nAIC:", AIC(fit), "\\n")',
                        '# Discrimination: C-statistic (= AUC) via pROC',
                        'cat("C-statistic (AUC):",',
                        '    round(pROC::auc(outcome, predict(fit, type = "response")), 3), "\\n")',
                        '',
                        '# Calibration: Hosmer-Lemeshow goodness-of-fit (separate from AUC)',
                        '# install.packages("ResourceSelection"); library(ResourceSelection)',
                        '# hl <- hoslem.test(outcome, fitted(fit), g = 10); print(hl)'
                    ].join('\n')
                },
                {
                    title: 'Ordinal Logistic Regression',
                    desc: 'Proportional odds model for mRS',
                    packages: ['MASS'],
                    code: [
                        '# Ordinal logistic regression (shift analysis)',
                        'library(MASS)',
                        '',
                        '# Simulate mRS data',
                        'set.seed(42)',
                        'n <- 400',
                        'treatment <- rep(c(0, 1), each = n / 2)',
                        'age <- rnorm(n, 70, 10)',
                        '',
                        '# Generate ordinal outcome (mRS 0-6)',
                        'latent <- -0.3 * treatment + 0.02 * age + rnorm(n)',
                        'mrs <- cut(latent, breaks = c(-Inf, -2, -1, 0, 1, 2, 3, Inf),',
                        '           labels = 0:6)',
                        '',
                        'df <- data.frame(mrs = ordered(mrs), treatment, age)',
                        '',
                        '# Fit proportional odds model',
                        'fit <- polr(mrs ~ treatment + age, data = df, Hess = TRUE)',
                        '',
                        '# Summary with p-values',
                        'ctable <- coef(summary(fit))',
                        'p <- pnorm(abs(ctable[, "t value"]), lower.tail = FALSE) * 2',
                        'ctable <- cbind(ctable, "p value" = p)',
                        'print(round(ctable, 4))',
                        '',
                        '# Common OR',
                        'cat("\\nCommon OR for treatment:", round(exp(-coef(fit)["treatment"]), 3), "\\n")'
                    ].join('\n')
                }
            ]
        }
    ];

    function render(container) {
        var html = App.createModuleLayout(
            'R Code Library',
            'Curated, runnable R code recipes for clinical research. Copy any recipe and run directly in R/RStudio.'
        );

        // Category tabs
        html += '<div class="card" style="margin-bottom:1rem"><div style="display:flex;flex-wrap:wrap;gap:0.5rem;padding:0.5rem">';
        categories.forEach(function(cat, i) {
            html += '<button class="btn ' + (i === 0 ? 'btn-primary' : 'btn-secondary') + '" '
                + 'onclick="window.RCodeLibrary.showCategory(' + i + ')" '
                + 'id="rcl-cat-' + i + '">'
                + cat.icon + ' ' + cat.name + '</button>';
        });
        html += '</div></div>';

        // Recipe display area
        html += '<div id="rcl-recipes"></div>';

        // Package reference card
        html += '<div class="card" style="margin-top:1.5rem">'
            + '<h3>Common Packages Reference</h3>'
            + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin-top:1rem">'
            + pkgCard('pwr', 'Power analysis & sample size')
            + pkgCard('epiR', 'Epidemiological analysis')
            + pkgCard('meta', 'Meta-analysis (forest/funnel)')
            + pkgCard('metafor', 'Advanced meta-analysis')
            + pkgCard('survival', 'Survival analysis & Cox')
            + pkgCard('survminer', 'KM plot visualization')
            + pkgCard('pROC', 'ROC curves & AUC')
            + pkgCard('ggplot2', 'Publication graphics')
            + pkgCard('MASS', 'Ordinal regression & more')
            + pkgCard('survRM2', 'Restricted mean survival')
            + pkgCard('epitools', 'Epi rates & standardization')
            + pkgCard('tableone', 'Table 1 generator')
            + pkgCard('mice', 'Multiple imputation (MICE)')
            + pkgCard('MatchIt', 'Propensity score matching')
            + pkgCard('WeightIt', 'Inverse probability weighting')
            + pkgCard('cobalt', 'Balance diagnostics')
            + pkgCard('lme4', 'Mixed-effects models')
            + pkgCard('lmerTest', 'P-values for mixed models')
            + pkgCard('fixest', 'Fixed effects & DiD')
            + pkgCard('tidyr', 'Data reshaping')
            + '</div></div>';

        // Install all button
        html += '<div class="card" style="margin-top:1rem">'
            + '<h3>Quick Setup</h3>'
            + '<p style="margin-bottom:0.75rem">Install all recommended packages at once:</p>'
            + '<pre style="background:var(--surface-2);padding:1rem;border-radius:8px;overflow-x:auto;font-size:0.85rem">'
            + 'install.packages(c("pwr", "epiR", "meta", "metafor", "survival",\n'
            + '                    "survminer", "pROC", "ggplot2", "MASS",\n'
            + '                    "survRM2", "epitools", "tableone"))'
            + '</pre>'
            + '<button class="btn btn-secondary" onclick="window.RCodeLibrary.copySetup()">Copy Install Script</button>'
            + '</div>';

        // Learn section
        html += '<div class="card" style="margin-top:1.5rem">'
            + '<h3 onclick="this.nextElementSibling.classList.toggle(\'hidden\')" style="cursor:pointer">'
            + 'Learn & Reference <span style="font-size:0.8em;color:var(--text-secondary)">[ click to expand ]</span></h3>'
            + '<div class="learn-body hidden" style="margin-top:1rem">'
            + '<h4>Getting Started with R for Clinical Research</h4>'
            + '<ul>'
            + '<li><strong>R</strong> is a free, open-source language widely used in biostatistics and clinical research</li>'
            + '<li><strong>RStudio</strong> is the recommended IDE (<a href="https://posit.co/download/rstudio-desktop/" target="_blank">Download</a>)</li>'
            + '<li>Every recipe here is self-contained and can be run directly after installing packages</li>'
            + '<li>Results are reproducible via <code>set.seed()</code> for simulated data</li>'
            + '</ul>'
            + '<h4>Package Installation</h4>'
            + '<p>Use <code>install.packages("name")</code> for CRAN packages. Install once, then load with <code>library(name)</code>.</p>'
            + '<h4>Recommended Resources</h4>'
            + '<ul>'
            + '<li>R for Data Science (<a href="https://r4ds.had.co.nz/" target="_blank">r4ds.had.co.nz</a>)</li>'
            + '<li>CRAN Task View: Clinical Trials (<a href="https://cran.r-project.org/web/views/ClinicalTrials.html" target="_blank">link</a>)</li>'
            + '<li>CRAN Task View: Survival Analysis (<a href="https://cran.r-project.org/web/views/Survival.html" target="_blank">link</a>)</li>'
            + '</ul></div></div>';

        App.setTrustedHTML(container, html);
        showCategory(0);
    }

    function pkgCard(name, desc) {
        return '<div style="background:var(--surface-2);padding:0.75rem;border-radius:8px">'
            + '<strong style="color:var(--accent)">' + name + '</strong>'
            + '<div style="font-size:0.85rem;color:var(--text-secondary);margin-top:0.25rem">' + desc + '</div></div>';
    }

    function showCategory(index) {
        // Update tab buttons
        categories.forEach(function(_, i) {
            var btn = document.getElementById('rcl-cat-' + i);
            if (btn) {
                btn.className = i === index ? 'btn btn-primary' : 'btn btn-secondary';
            }
        });

        var cat = categories[index];
        var html = '';
        cat.recipes.forEach(function(recipe, ri) {
            html += '<div class="card" style="margin-bottom:1rem">'
                + '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem">'
                + '<div><h3 style="margin:0">' + recipe.title + '</h3>'
                + '<p style="margin:0.25rem 0;color:var(--text-secondary);font-size:0.9rem">' + recipe.desc + '</p>'
                + '<div style="display:flex;gap:0.25rem;flex-wrap:wrap;margin-top:0.25rem">'
                + recipe.packages.map(function(p) {
                    return '<span style="background:var(--accent-bg);color:var(--accent);font-size:0.75rem;padding:0.15rem 0.5rem;border-radius:12px">' + p + '</span>';
                }).join('')
                + '</div></div>'
                + '<button class="btn btn-primary" onclick="window.RCodeLibrary.copyRecipe(' + index + ',' + ri + ')">'
                + 'Copy R Code</button></div>'
                + '<pre style="background:var(--surface-2);padding:1rem;border-radius:8px;overflow-x:auto;margin-top:1rem;font-size:0.82rem;line-height:1.5">'
                + escapeHtml(recipe.code) + '</pre></div>';
        });

        var el = document.getElementById('rcl-recipes');
        if (el) App.setTrustedHTML(el, html);
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function copyRecipe(catIndex, recipeIndex) {
        var code = categories[catIndex].recipes[recipeIndex].code;
        Export.copyToClipboard(code);
    }

    function copySetup() {
        var script = 'install.packages(c("pwr", "epiR", "meta", "metafor", "survival",\n'
            + '                    "survminer", "pROC", "ggplot2", "MASS",\n'
            + '                    "survRM2", "epitools", "tableone", "mice",\n'
            + '                    "MatchIt", "WeightIt", "cobalt", "lme4",\n'
            + '                    "lmerTest", "fixest", "tidyr"))';
        Export.copyToClipboard(script);
    }

    window.RCodeLibrary = {
        showCategory: showCategory,
        copyRecipe: copyRecipe,
        copySetup: copySetup
    };

    App.registerModule(MODULE_ID, { render: render });
})();
