# Neuro-Epi

**Comprehensive epidemiology, biostatistics, and clinical research platform.**

A zero-dependency static web app built for clinical researchers, epidemiologists, biostatisticians, and clinical trialists. Designed for daily use in study design, data analysis, grant writing, manuscript preparation, and critical appraisal.

**[Live Demo →](https://rkalani1.github.io/neuroepi-suite/)**

## Features

### Study Design
- **Sample Size Calculator** — 8 designs: two proportions, two means, time-to-event, mRS ordinal shift (Whitehead), non-inferiority, cluster RCT, stepped-wedge, multi-arm. Sensitivity tables, power curves, presets, grant-ready methods text.
- **Power Analysis** — Reverse calculator (input N → achieved power), interactive dashboard with real-time sliders, multi-scenario comparison.
- **Hypothesis Builder** — PICO/PECO framework, study design decision tree, variable classification, analysis plan generator.
- **Study Design Guide** — Interactive decision tree for selecting study designs, reference tables with Oxford CEBM evidence levels, design templates, bias & confounding quick reference.

### Epidemiology
- **Epidemiology Calculators** — 2×2 analysis, Mantel-Haenszel stratified analysis, additive/multiplicative interaction, Cochran-Armitage trend test, bias checklist.
- **Risk Calculators** — Clinical stroke risk scores (CHA₂DS₂-VASc, HAS-BLED, ABCD², ESRS, SEDAN, DRAGON) plus epidemiological rate calculators (incidence rates, rate ratios, prevalence, SMR, age standardization, attributable risk, DALY/YLL).
- **Epi Concepts** — Interactive reference for measures of disease frequency, association, impact, screening concepts, and study validity.
- **Causal Inference** — Bradford Hill criteria assessment, DAG builder, counterfactual framework reference, causal inference methods comparison.

### Biostatistics
- **Effect Size Converter** — Bidirectional conversions: OR ↔ RR ↔ RD ↔ Cohen's d ↔ Hedge's g.
- **NNT Calculator** — NNT/NNH from rates, 2×2 tables, or published OR/RR. Cates plot, fragility index, PEER-adjusted NNT.
- **Diagnostic Accuracy** — Full 2×2 with Wilson CIs, Fagan nomogram, ROC curve with AUC, McNemar's test.
- **Regression Helper** — Model selection wizard, events-per-variable calculator, DAG builder.
- **Survival Analysis** — Kaplan-Meier with CI bands, log-rank test, hazard ratio, median survival, number-at-risk tables.
- **Biostatistics Reference** — Statistical test selector, probability distributions, CI methods, effect size interpretation, multiple testing corrections.
- **Results Interpreter** — Paste p-values, CIs, or effect sizes and get plain-English interpretation.

### Clinical Trials
- **Trial Database** — 200+ clinical trials with verified data, searchable and filterable. Sort by year/name/size, landmark filter, visual result indicators, side-by-side comparison, CSV export, citation paragraph generator, evidence summary, PubMed/DOI links.
- **Critical Appraisal** — RoB 2.0, Newcastle-Ottawa, AMSTAR-2, QUADAS-2, GRADE.
- **Reporting Guidelines** — Interactive CONSORT, STROBE, PRISMA checklists with progress tracking and export.

### Meta-Analysis
- **Meta-Analysis** — Fixed and random effects (DerSimonian-Laird with optional HKSJ), forest plots, funnel plots, Egger's test, leave-one-out sensitivity, cumulative meta-analysis, trim-and-fill.

### ML & Prediction
- **ML for Clinical Research** — Method selector, algorithm reference, validation guide, TRIPOD+AI checklist, common pitfalls in clinical ML.

### Writing & Productivity

- **Methods Generator** — Auto-generate statistical methods paragraphs for manuscripts, common templates for RCTs, observational studies, meta-analyses.
- **Project Planner** — Research timeline builder, milestone tracker, budget calculator, regulatory checklists.

### Cross-Cutting Educational Features
- **Learn panels** in every module — collapsible sections with key formulas, assumptions, common pitfalls, and references
- **Methods text generators** — auto-generate publication-ready methods paragraphs for sample size, power analysis, diagnostic accuracy, meta-analysis, and more
- **Copy/Export** — clipboard integration for all results, PNG chart export, CSV export

### Technical Features
- Complete statistical engine built from scratch (no dependencies)
- Canvas-based charting with Retina support
- Dark/light theme toggle
- Responsive design (desktop, tablet, mobile)
- Print-optimized CSS
- localStorage persistence for saved calculations
- Clipboard integration for all results
- Works fully offline

## Getting Started

No build step required. Open `index.html` in any modern browser.

```bash
# Clone the repository
git clone https://github.com/rkalani1/neuroepi-suite.git

# Open in browser
open neuroepi-suite/index.html
```

Or visit the [live site](https://rkalani1.github.io/neuroepi-suite/).

## Technology

- Vanilla HTML, CSS, and JavaScript — no frameworks, no bundlers, no dependencies
- Single-page application with hash-based routing
- Statistical functions implemented from numerical methods (Lanczos gamma, Lentz's continued fraction, Abramowitz & Stegun approximations)
- Canvas 2D API for all charts with `devicePixelRatio` support

## Statistical Methods

The statistics engine implements:

| Category | Methods |
|----------|---------|
| **Distributions** | Normal, Student's t, Chi-squared, F, Binomial, Poisson |
| **Confidence Intervals** | Wald, Wilson, Clopper-Pearson, Agresti-Coull, Newcombe, log-rate |
| **Tests** | z-test, chi-squared, Fisher's exact, McNemar's, Cochran-Armitage, Mantel-Haenszel |
| **Sample Size** | Proportions (3 methods), means, Schoenfeld/Freedman survival, non-inferiority, equivalence, cluster, stepped-wedge, ordinal shift, multi-arm, group sequential |
| **Meta-Analysis** | Fixed (IV), Random (DL+HKSJ), MH, Egger's, leave-one-out, cumulative, trim-and-fill |
| **Survival** | Kaplan-Meier, log-rank, HR from O-E |
| **Diagnostics** | Sensitivity, specificity, LR, DOR, AUC, Fagan nomogram |
| **Epidemiology** | 2×2 analysis, attributable fractions, interaction measures, age standardization, fragility index |

## License

MIT — see [LICENSE](LICENSE).

## Citation

See [CITATION.cff](CITATION.cff) for citation information.
