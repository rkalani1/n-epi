# NeuroEpi Suite

**Production-quality stroke epidemiology and clinical research toolkit.**

A comprehensive, zero-dependency static web app built for vascular neurologists, stroke researchers, epidemiologists, and clinical trialists. Designed for daily use in grant writing, manuscript preparation, study design, hypothesis development, and critical appraisal.

**[Live Demo →](https://rkalani1.github.io/neuroepi-suite/)**

## Features

### Study Design
- **Sample Size Calculator** — 8 designs: two proportions, two means, time-to-event, mRS ordinal shift (Whitehead), non-inferiority, cluster RCT, stepped-wedge, multi-arm. Includes sensitivity tables, power curves, presets for landmark trials, and grant-ready methods text.
- **Power Analysis** — Reverse calculator (input N → achieved power), interactive dashboard with real-time sliders, multi-scenario comparison with overlaid power curves.

### Analysis Tools
- **NNT Calculator** — NNT/NNH from rates, 2×2 tables, or published OR/RR. Cates plot (icon array), fragility index, PEER-adjusted NNT, patient explanation generator.
- **Meta-Analysis** — Fixed and random effects (DerSimonian-Laird with optional HKSJ), forest plots, funnel plots, Egger's test, leave-one-out sensitivity, cumulative meta-analysis, trim-and-fill.
- **Survival Analysis** — Kaplan-Meier with CI bands, log-rank test, hazard ratio, median survival, number-at-risk tables, multi-group overlays.
- **Diagnostic Accuracy** — Full 2×2 with Wilson CIs, Fagan nomogram (interactive canvas), ROC curve with AUC, McNemar's test for paired comparisons.
- **Epidemiology Calculators** — 2×2 analysis, Mantel-Haenszel stratified analysis, additive/multiplicative interaction, Cochran-Armitage trend test, bias checklist.
- **Effect Size Converter** — Bidirectional conversions: OR ↔ RR ↔ RD ↔ Cohen's d ↔ Hedge's g. Cohen and stroke-specific benchmarks.
- **Risk Calculators** — Clinical stroke risk scores (CHA₂DS₂-VASc, HAS-BLED, ABCD², Essen Stroke Risk Score, SEDAN, DRAGON) plus epidemiological rate calculators (incidence rates, rate ratios, prevalence, SMR, direct age standardization, attributable risk, DALY/YLL).
- **Regression Helper** — Model selection wizard, events-per-variable calculator, DAG builder for confounder identification.

### Evidence & Writing
- **Trial Database** — 80+ major stroke trials with verified data, searchable and filterable. Side-by-side comparison, copy citation, PubMed links.
- **Critical Appraisal** — RoB 2.0 (with signaling questions and algorithmic judgments), Newcastle-Ottawa, AMSTAR-2, QUADAS-2, GRADE.
- **Grant Assistant** — Specific aims page builder, study design section, power justification text, Gantt timeline, human subjects template, budget calculator.
- **Hypothesis Builder** — PICO/PECO framework, study design decision tree, variable classification, analysis plan generator.

### Technical Features
- Complete statistical engine built from scratch (no dependencies)
- Canvas-based charting with Retina support (forest plots, KM curves, ROC, funnel plots, Cates plots, heatmaps, DAGs)
- Dark/light theme toggle
- Responsive design (desktop, tablet, mobile)
- Print-optimized CSS
- localStorage persistence for saved calculations
- Clipboard integration for all results
- Keyboard navigation
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
