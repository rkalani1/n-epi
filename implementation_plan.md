# Implementation Plan: Biobank Data Cleaning Enhancement

This plan outlines the enhancements to the Biobank Data Cleaning module, focusing on biological impossibility checks, expanded gender-consistency logic, and improved unit conversion detection.

## 1. Gender-Specific Consistency Logic
- **Current state**: Only checks 'Male' + 'Pregnancy'.
- **Enhancement**:
    - Improve gender detection to handle more strings ('male', 'm', 'man', 'female', 'f', 'woman').
    - Add checks for prostate-related columns for females (if columns like `prostate_psa` or `prostate_cancer` exist).
    - Add checks for ovarian/uterine-related columns for males.

## 2. Unit Conversion Warnings
- **Current state**: SBP check for values between 30 and 50.
- **Enhancement**:
    - Add DBP check: Values between 5 and 25 are likely kPa (37-187 mmHg).
    - Refine SBP check: Any SBP < 30 is almost certainly kPa (1 kPa = 7.5 mmHg; 30 kPa = 225 mmHg). Values between 30-50 are suspicious.
    - Height check: Detect if height is in meters (1.5-2.2) vs cm (150-220).

## 3. Expanded Biological Range Checks
- Add absolute range boundaries for common clinical metrics:
    - SBP: < 40 or > 300 mmHg.
    - DBP: < 20 or > 200 mmHg.
    - Temperature: < 30°C or > 45°C.

## 4. UI/UX Polish
- Ensure the issues list is clearly categorized by type (Range, Consistency, Outlier, Unit).

## Proposed Changes to `js/modules/biobank-cleaning.js`
- Modify `processData` loop to include these new conditions.
- Update `issues.push` messages to be more descriptive.

## Verification Plan
1. Test with a mock CSV containing:
    - Male with pregnancy = Yes.
    - Female with prostate_cancer = 1.
    - SBP = 18 (kPa).
    - DBP = 12 (kPa).
    - Height = 1.75 (meters).
2. Confirm all issues are flagged in the `renderResults` output.
