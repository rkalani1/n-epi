# AutoMedBench-Lite Gate for AI-Assisted Methods Updates

Use this gate before accepting AI-generated changes to epidemiology formulas, statistical methods text, calculators, app modules, exported interpretation text, or critical-appraisal content.

This gate evaluates whether an agent planned, set up, validated, executed, and submitted the work responsibly. It does not certify statistical correctness, clinical validity, or regulatory readiness.

## Safety Boundary

- Use public, aggregate, synthetic, or de-identified examples only.
- Do not paste PHI, patient identifiers, limited datasets, restricted research data, learner records, credentials, or confidential institutional material.
- Do not present generated methods text as a substitute for investigator, statistician, or regulatory review.

## S1 Plan

The agent must state:

- Target module, calculator, or text generator.
- Exact formula, interpretation, or UI behavior being changed.
- Source or internal consistency reason for the change.
- Assumptions, edge cases, and unsupported use cases.
- Stop conditions, especially missing source support or failed numerical checks.

## S2 Setup

The agent must identify:

- Current implementation files under `js/`.
- Any related data constants, examples, or generated text.
- Existing decision-log or compliance requirements.
- Browser/manual checks needed because this repo has no build step.

## S3 Validate

The agent must complete concrete checks:

- Source fidelity: methods language maps to cited or documented methods.
- Numerical validation: at least one synthetic expected-value case covers changed calculator logic.
- Edge-case validation: zero cells, boundary probabilities, rare outcomes, high event rates, missing inputs, and invalid ranges when affected.
- Cross-module consistency: formulas, explanatory text, exports, and examples agree.
- Privacy validation: no real clinical/research data or realistic fake records are introduced.

## S4 Execute

Make the smallest scoped change after validation planning is complete. Keep educational framing, data guardrails, and zero-dependency constraints intact.

## S5 Submit

The final response or PR description must include:

- Changed files.
- Source or formula trace.
- Synthetic validation cases and observed results.
- Browser/manual checks performed.
- Residual methods assumptions requiring human review.

## One-Shot Prompt

```text
Apply the n-epi AutoMedBench-Lite gate. Write S1 Plan, S2 Setup, and S3 Validate before editing. Then execute the scoped change and submit changed files, formula/source trace, synthetic validation, manual browser checks, and residual methods assumptions. Stop if source support or numerical validation cannot be completed.
```
