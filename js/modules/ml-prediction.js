/**
 * Neuro-Epi — ML for Clinical Research
 * Educational reference and decision tools for machine learning in clinical research.
 */
(function() {
    'use strict';
    const MODULE_ID = 'ml-prediction';

    var tripodState = {};

    /* ------------------------------------------------------------------ */
    /*  Algorithm reference data                                           */
    /* ------------------------------------------------------------------ */
    var algorithms = [
        {
            name: 'Logistic Regression',
            desc: 'Linear model for binary classification using the logistic function. Gold standard for clinical prediction models.',
            pros: 'Highly interpretable; well-understood coefficients (OR); fast; works well with small samples; supports confidence intervals.',
            cons: 'Assumes linearity of log-odds; may underperform with complex non-linear relationships; sensitive to multicollinearity.',
            hyperparams: 'Regularization strength (C), penalty type (L1/L2/ElasticNet), solver, max iterations.',
            interpretability: 5,
            applications: 'Disease risk prediction, mortality prediction, treatment response classification, diagnostic models.'
        },
        {
            name: 'LASSO / Ridge / Elastic Net',
            desc: 'Regularized regression methods. LASSO (L1) performs feature selection; Ridge (L2) handles multicollinearity; Elastic Net combines both.',
            pros: 'Automatic feature selection (LASSO); handles high-dimensional data; reduces overfitting; stable coefficient estimates.',
            cons: 'Assumes linearity; LASSO may be unstable with correlated features; requires tuning of lambda.',
            hyperparams: 'Lambda (regularization strength), alpha (L1/L2 ratio for Elastic Net), standardization method.',
            interpretability: 4,
            applications: 'Genomic studies, biomarker selection, high-dimensional clinical data, variable selection in EHR data.'
        },
        {
            name: 'Decision Trees',
            desc: 'Non-parametric method that recursively partitions data based on feature thresholds to create interpretable decision rules.',
            pros: 'Highly interpretable; handles non-linearity; no assumptions about data distribution; handles mixed data types.',
            cons: 'Prone to overfitting; unstable (small data changes cause large tree changes); generally lower accuracy.',
            hyperparams: 'Max depth, min samples split, min samples leaf, criterion (Gini/entropy), max features.',
            interpretability: 5,
            applications: 'Clinical decision rules, triage algorithms, treatment selection pathways.'
        },
        {
            name: 'Random Forest',
            desc: 'Ensemble of decision trees trained on bootstrap samples with random feature subsets. Reduces variance through averaging.',
            pros: 'High accuracy; handles non-linearity; robust to outliers; built-in feature importance; OOB error estimation.',
            cons: 'Less interpretable than single trees; computationally heavier; can overfit noisy data; biased feature importance with correlated features.',
            hyperparams: 'Number of trees (n_estimators), max depth, max features (mtry), min samples split, bootstrap.',
            interpretability: 3,
            applications: 'Disease classification, readmission prediction, survival prediction, imaging feature analysis.'
        },
        {
            name: 'Gradient Boosting (XGBoost / LightGBM)',
            desc: 'Sequential ensemble that builds trees to correct errors of previous trees. XGBoost and LightGBM are optimized implementations.',
            pros: 'Often highest accuracy; handles missing data; built-in regularization; feature importance; handles imbalanced data.',
            cons: 'Computationally intensive; many hyperparameters to tune; risk of overfitting; less interpretable.',
            hyperparams: 'Learning rate (eta), n_estimators, max depth, subsample, colsample_bytree, reg_alpha, reg_lambda, min_child_weight.',
            interpretability: 2,
            applications: 'ICU mortality prediction, disease progression, treatment outcome prediction, EHR-based prediction.'
        },
        {
            name: 'Support Vector Machines (SVM)',
            desc: 'Finds optimal hyperplane separating classes with maximum margin. Kernel trick enables non-linear classification.',
            pros: 'Effective in high-dimensional spaces; memory efficient; versatile with kernel functions; good generalization.',
            cons: 'Not directly probabilistic; slow with large datasets; sensitive to feature scaling; kernel choice critical.',
            hyperparams: 'C (regularization), kernel (linear/RBF/poly), gamma, degree (for polynomial kernel).',
            interpretability: 2,
            applications: 'Imaging classification, genomic classification, text classification (clinical notes).'
        },
        {
            name: 'k-Nearest Neighbors (kNN)',
            desc: 'Instance-based learning that classifies samples based on majority vote of k nearest training examples.',
            pros: 'Simple; no training phase; naturally handles multi-class; non-parametric.',
            cons: 'Slow prediction with large datasets; sensitive to irrelevant features and feature scaling; curse of dimensionality.',
            hyperparams: 'k (number of neighbors), distance metric (Euclidean/Manhattan/Minkowski), weighting scheme.',
            interpretability: 3,
            applications: 'Pattern recognition, imputation of missing data, anomaly detection in clinical data.'
        },
        {
            name: 'Naive Bayes',
            desc: 'Probabilistic classifier based on Bayes theorem with the (naive) assumption of feature independence.',
            pros: 'Fast; works well with small samples; handles high-dimensional data; naturally probabilistic; good baseline.',
            cons: 'Strong independence assumption rarely holds; may produce poorly calibrated probabilities.',
            hyperparams: 'Distribution type (Gaussian/Multinomial/Bernoulli), smoothing parameter (alpha).',
            interpretability: 4,
            applications: 'Text classification of clinical notes, diagnostic screening, spam detection in clinical alerts.'
        },
        {
            name: 'Neural Networks (MLP)',
            desc: 'Multi-layer perceptrons with interconnected nodes. Universal function approximators for complex patterns.',
            pros: 'Can model complex non-linear relationships; flexible architecture; good with large datasets.',
            cons: 'Requires large data; many hyperparameters; prone to overfitting; black-box; computationally expensive.',
            hyperparams: 'Hidden layers, neurons per layer, activation function, learning rate, batch size, epochs, dropout, optimizer.',
            interpretability: 1,
            applications: 'Complex disease prediction, multi-modal data integration, drug discovery.'
        },
        {
            name: 'Cox-LASSO',
            desc: 'Cox proportional hazards model with L1 (LASSO) penalty for simultaneous feature selection and survival modeling.',
            pros: 'Feature selection in survival context; handles high-dimensional data; interpretable hazard ratios.',
            cons: 'Assumes proportional hazards; linear log-hazard; may miss complex interactions.',
            hyperparams: 'Lambda (regularization strength), cross-validation folds for lambda selection.',
            interpretability: 4,
            applications: 'Prognostic modeling, time-to-event prediction, cancer survival, cardiovascular risk scores.'
        },
        {
            name: 'Random Survival Forests',
            desc: 'Extension of random forests for right-censored survival data. Ensemble of survival trees.',
            pros: 'Handles non-linear effects; no proportional hazards assumption; variable importance; handles interactions.',
            cons: 'Less interpretable; computationally heavier; requires sufficient events; may not extrapolate well.',
            hyperparams: 'Number of trees, mtry, nodesize, splitrule (logrank/logrankscore/C), nsplit.',
            interpretability: 2,
            applications: 'Cancer prognosis, transplant survival, ICU length of stay, competing risks analysis.'
        },
        {
            name: 'Deep Learning — CNNs (Imaging)',
            desc: 'Convolutional Neural Networks process images through learned filters for feature extraction and classification.',
            pros: 'State-of-the-art image classification; automatic feature learning; transfer learning available.',
            cons: 'Requires large labeled datasets; computationally very expensive; black-box; requires GPUs.',
            hyperparams: 'Architecture (ResNet/VGG/DenseNet/EfficientNet), learning rate, batch size, augmentation strategy, pretrained weights.',
            interpretability: 1,
            applications: 'Medical imaging (X-ray, CT, MRI, pathology), retinal screening, dermatology, radiology.'
        },
        {
            name: 'Deep Learning — RNNs / Transformers (Sequences)',
            desc: 'Recurrent and Transformer architectures for sequential/temporal data. LSTM/GRU handle long-range dependencies.',
            pros: 'Captures temporal patterns; handles variable-length sequences; attention mechanisms aid interpretation.',
            cons: 'Data-hungry; complex to train; RNNs suffer vanishing gradients; Transformers need large compute.',
            hyperparams: 'Architecture (LSTM/GRU/Transformer), hidden size, number of layers, attention heads, sequence length, dropout.',
            interpretability: 1,
            applications: 'EHR trajectory prediction, clinical NLP, time-series vital signs, sepsis early warning.'
        }
    ];

    /* ------------------------------------------------------------------ */
    /*  Validation strategies data                                         */
    /* ------------------------------------------------------------------ */
    var validationStrategies = [
        {
            name: 'Train/Test Split',
            desc: 'Randomly partition data into training (e.g., 70-80%) and test (20-30%) sets. Model is trained on training set and evaluated on test set.',
            when: 'Large datasets (>10,000 samples); quick initial evaluation.',
            pros: 'Simple, fast, computationally efficient.',
            cons: 'High variance in estimate; wastes data; single evaluation point.',
            recommendation: 'Use only for very large datasets or as a quick preliminary check. Always pair with cross-validation.'
        },
        {
            name: 'k-Fold Cross-Validation',
            desc: 'Partition data into k equally-sized folds. Train on k-1 folds, test on the remaining fold. Repeat k times and average performance.',
            when: 'Standard approach for most datasets. k=5 or k=10 are common choices.',
            pros: 'More reliable estimate; uses all data for both training and testing; lower variance than single split.',
            cons: 'Computationally more expensive (k model fits); still has some variance.',
            recommendation: 'Default choice for internal validation. Use stratified k-fold for imbalanced outcomes. Repeat multiple times for stable estimates.'
        },
        {
            name: 'Leave-One-Out Cross-Validation (LOOCV)',
            desc: 'Special case of k-fold where k equals the number of samples. Each sample is used as a single test case.',
            when: 'Very small datasets (<100 samples) where maximizing training data is essential.',
            pros: 'Maximum use of available data; nearly unbiased.',
            cons: 'Computationally expensive; high variance; may overfit.',
            recommendation: 'Consider only for very small datasets. Prefer 10-fold CV or bootstrap for most scenarios.'
        },
        {
            name: 'Bootstrap Validation (.632 / .632+)',
            desc: 'Draw bootstrap samples (with replacement) for training; use out-of-bag samples for testing. .632 and .632+ apply bias corrections.',
            when: 'Small to moderate datasets; when you need optimism-corrected estimates.',
            pros: 'Optimism-corrected; uses all data; .632+ handles overfitting better.',
            cons: 'More complex; .632 can underestimate error with overfit models; computationally intensive.',
            recommendation: 'Excellent for small clinical datasets. .632+ recommended by Harrell for clinical prediction models. Use 200+ bootstrap resamples.'
        },
        {
            name: 'External Validation',
            desc: 'Evaluate model on completely independent dataset from different time, location, or population.',
            when: 'Before clinical deployment; regulatory requirements; generalizability assessment.',
            pros: 'Gold standard for generalizability; detects overfitting to development population.',
            cons: 'Requires separate dataset; may not be available; differences may be too large.',
            recommendation: 'Essential before clinical implementation. Geographic and temporal external validation both important.'
        },
        {
            name: 'Temporal Validation',
            desc: 'Train on historical data, validate on more recent data from the same institution. Tests stability over time.',
            when: 'EHR-based studies; when external data unavailable; assessing temporal stability.',
            pros: 'Tests real-world stability; easy to implement with longitudinal data; tests temporal transportability.',
            cons: 'Confounded by temporal trends; may not represent geographic generalizability.',
            recommendation: 'Highly recommended for EHR-based prediction models. Use at least 1-2 years of temporal gap when possible.'
        }
    ];

    /* ------------------------------------------------------------------ */
    /*  Performance metrics data                                           */
    /* ------------------------------------------------------------------ */
    var classificationMetrics = [
        { name: 'AUC-ROC', desc: 'Area under the Receiver Operating Characteristic curve. Probability that a randomly chosen positive has higher predicted probability than a randomly chosen negative.', range: '0.5 (random) to 1.0 (perfect)', notes: 'Insensitive to class imbalance; threshold-independent. Most common discrimination metric.' },
        { name: 'AUC-PR', desc: 'Area under the Precision-Recall curve. More informative than AUC-ROC for rare outcomes.', range: 'Prevalence (random) to 1.0 (perfect)', notes: 'Preferred when outcome prevalence is low (<5%). Baseline equals the prevalence.' },
        { name: 'Sensitivity (Recall)', desc: 'Proportion of true positives correctly identified. TP / (TP + FN).', range: '0 to 1.0', notes: 'Critical when missing positive cases is costly (e.g., cancer screening).' },
        { name: 'Specificity', desc: 'Proportion of true negatives correctly identified. TN / (TN + FP).', range: '0 to 1.0', notes: 'Important when false positives are costly (e.g., unnecessary surgery).' },
        { name: 'F1 Score', desc: 'Harmonic mean of precision and recall. 2 * (precision * recall) / (precision + recall).', range: '0 to 1.0', notes: 'Useful for imbalanced classes; balances precision and recall.' },
        { name: 'Brier Score', desc: 'Mean squared difference between predicted probabilities and actual outcomes.', range: '0 (perfect) to 1.0 (worst)', notes: 'Combines discrimination and calibration. Decomposable into reliability and resolution.' },
        { name: 'Calibration: Hosmer-Lemeshow', desc: 'Goodness-of-fit test comparing observed and predicted event rates across risk groups.', range: 'p > 0.05 indicates adequate fit', notes: 'Sensitive to sample size and number of groups. Supplement with calibration plots.' },
        { name: 'Calibration Slope', desc: 'Slope of logistic recalibration model (logit of predicted vs. actual). Perfect calibration = 1.0.', range: '<1 indicates overfitting, >1 indicates underfitting', notes: 'More informative than H-L test. Report with calibration-in-the-large (intercept).' }
    ];

    var regressionMetrics = [
        { name: 'RMSE', desc: 'Root Mean Squared Error. Square root of mean squared differences between predicted and actual values.', range: '0 (perfect) to infinity', notes: 'Penalizes large errors more than MAE. Same units as outcome.' },
        { name: 'MAE', desc: 'Mean Absolute Error. Average absolute difference between predicted and actual values.', range: '0 (perfect) to infinity', notes: 'More robust to outliers than RMSE. Easier to interpret.' },
        { name: 'R-squared', desc: 'Proportion of variance in outcome explained by the model.', range: '0 to 1.0 (can be negative for very poor models)', notes: 'Context-dependent interpretation. Can be misleadingly high with large variance.' },
        { name: 'Explained Variance', desc: 'Similar to R2 but accounts for bias in predictions.', range: '0 to 1.0', notes: 'Equals R2 when predictions are unbiased.' }
    ];

    var survivalMetrics = [
        { name: 'C-statistic (Harrell)', desc: 'Concordance probability: proportion of all usable patient pairs where predicted risk correctly ranks patients.', range: '0.5 (random) to 1.0 (perfect)', notes: 'Analogous to AUC for survival data. Standard discrimination metric for Cox models.' },
        { name: 'Time-dependent AUC', desc: 'AUC evaluated at specific time points, accounting for censoring.', range: '0.5 to 1.0', notes: 'Useful when discrimination varies over time. Report at clinically meaningful time points.' },
        { name: 'Calibration Plot (Survival)', desc: 'Plot of predicted vs. observed survival probabilities at a specific time point.', range: 'Perfect: 45-degree line', notes: 'Use bootstrap-corrected calibration. Report at multiple time points.' },
        { name: 'Net Reclassification Index (NRI)', desc: 'Measures improvement in classification when a new predictor or model is added. Sums improvement in event and non-event categories.', range: '-2 to +2', notes: 'Report category-based or continuous NRI. Always report event and non-event components separately.' },
        { name: 'Integrated Discrimination Improvement (IDI)', desc: 'Difference in mean predicted probabilities between events and non-events for new vs. old model.', range: '0 (no improvement) to 1.0', notes: 'Complementary to NRI. Does not require predefined risk categories.' }
    ];

    /* ------------------------------------------------------------------ */
    /*  TRIPOD+AI checklist items                                          */
    /* ------------------------------------------------------------------ */
    var tripodItems = [
        { num: '1',  section: 'Source of Data', text: 'Describe the study design or source of data (e.g., randomized trial, cohort, registry, EHR), separately for development and validation' },
        { num: '2',  section: 'Source of Data', text: 'Specify the key study dates, including start of accrual, end of accrual, and end of follow-up' },
        { num: '3',  section: 'Participants', text: 'Specify key elements of the study setting including number and location of centres and relevant dates' },
        { num: '4',  section: 'Participants', text: 'Describe eligibility criteria for participants' },
        { num: '5',  section: 'Participants', text: 'Give details of treatments received, if relevant' },
        { num: '6',  section: 'Outcome', text: 'Clearly define the outcome that is predicted, including how and when assessed' },
        { num: '7',  section: 'Outcome', text: 'Report any actions to blind assessment of the outcome' },
        { num: '8',  section: 'Predictors', text: 'Clearly define all candidate predictors used, including how and when measured' },
        { num: '9',  section: 'Predictors', text: 'Report any actions to blind assessment of predictors for outcome and other predictors' },
        { num: '10', section: 'Sample Size', text: 'Explain how the study size was arrived at, including events per variable considerations' },
        { num: '11', section: 'Missing Data', text: 'Describe how missing data were handled (e.g., complete-case, imputation) with details of any imputation method' },
        { num: '12', section: 'Statistical Analysis', text: 'Describe how predictors were handled in the analyses (coding, transformations)' },
        { num: '13', section: 'Statistical Analysis', text: 'Specify type of model, all model-building procedures (e.g., variable selection), and method for internal validation' },
        { num: '14', section: 'Statistical Analysis', text: 'Specify all measures used to assess model performance (discrimination and calibration)' },
        { num: '15', section: 'Model Development', text: 'Report the full prediction model to allow predictions for individuals (regression coefficients or equivalent)' },
        { num: '16', section: 'Model Development', text: 'Explain how to use the prediction model' },
        { num: '17', section: 'Model Performance', text: 'Report discrimination measures with confidence intervals (e.g., C-statistic, AUC)' },
        { num: '18', section: 'Model Performance', text: 'Report calibration measures with confidence intervals (e.g., calibration plot, slope, intercept)' },
        { num: '19', section: 'Model Performance', text: 'Report any reclassification measures if comparing models (NRI, IDI)' },
        { num: '20', section: 'Model Updating', text: 'If done, report the results from any model updating (recalibration, revision, extension)' },
        { num: '21', section: 'AI-Specific', text: 'Describe the AI/ML algorithm architecture and implementation details sufficient for reproducibility' },
        { num: '22', section: 'AI-Specific', text: 'Report hyperparameter tuning approach and final values' },
        { num: '23', section: 'AI-Specific', text: 'Describe hardware and software used (libraries, versions, GPU/CPU)' },
        { num: '24', section: 'AI-Specific', text: 'Report any explainability methods used (SHAP, LIME, attention maps, partial dependence plots)' },
        { num: '25', section: 'AI-Specific', text: 'Describe fairness and bias assessment across patient subgroups (age, sex, race/ethnicity)' },
        { num: '26', section: 'AI-Specific', text: 'Provide a data flow diagram showing preprocessing, feature engineering, model training, and evaluation pipeline' },
        { num: '27', section: 'AI-Specific', text: 'Report availability of code, trained models, and data (or reasons for restricted access)' }
    ];

    /* ------------------------------------------------------------------ */
    /*  Common pitfalls data                                               */
    /* ------------------------------------------------------------------ */
    var pitfalls = [
        {
            title: 'Data Leakage',
            content: 'Data leakage occurs when information from outside the training dataset is used to create the model, leading to overly optimistic performance estimates.\n\n'
                + '<strong>Common examples:</strong>\n'
                + '<ul style="margin:0.5rem 0;padding-left:1.5rem;">'
                + '<li>Using future information to predict current outcomes (e.g., using 30-day lab results to predict mortality at admission)</li>'
                + '<li>Performing feature selection or normalization on the full dataset before splitting into train/test</li>'
                + '<li>Including variables that are consequences of the outcome (e.g., using ICU admission as a predictor of inpatient mortality when ICU admission happens after the outcome)</li>'
                + '<li>Patient-level data appearing in both training and test sets (e.g., multiple visits from the same patient)</li>'
                + '</ul>'
                + '<strong>Prevention:</strong> Always split data before any preprocessing. Use temporal splits when possible. Carefully review each feature for potential causal path to outcome.'
        },
        {
            title: 'Class Imbalance Handling',
            content: 'Clinical outcomes are often rare (e.g., 1-5% event rate), causing models to predict the majority class.\n\n'
                + '<strong>Approaches:</strong>\n'
                + '<ul style="margin:0.5rem 0;padding-left:1.5rem;">'
                + '<li><strong>Resampling:</strong> SMOTE, random oversampling, random undersampling (apply only to training data, never test data)</li>'
                + '<li><strong>Cost-sensitive learning:</strong> Assign higher misclassification costs to the minority class</li>'
                + '<li><strong>Appropriate metrics:</strong> Use AUC-PR instead of AUC-ROC; use F1 instead of accuracy</li>'
                + '<li><strong>Threshold tuning:</strong> Optimize classification threshold for the specific clinical use case</li>'
                + '</ul>'
                + '<strong>Key point:</strong> Do NOT use accuracy as a metric for imbalanced data. A model predicting "no event" always would have 95% accuracy with 5% event rate.'
        },
        {
            title: 'Feature Selection Bias',
            content: 'Performing feature selection on the entire dataset before cross-validation leads to information leakage and optimistic performance.\n\n'
                + '<strong>Wrong approach:</strong> Select top features from full dataset, then cross-validate using only those features.\n\n'
                + '<strong>Correct approach:</strong> Feature selection must be performed within each fold of cross-validation (nested cross-validation).\n\n'
                + '<strong>Impact:</strong> Bias can be substantial -- studies have shown AUC inflation of 0.05-0.15 when feature selection is done outside CV.'
        },
        {
            title: 'Overfitting in Small Datasets',
            content: 'Clinical datasets are often small, making overfitting a major concern.\n\n'
                + '<strong>Rules of thumb:</strong>\n'
                + '<ul style="margin:0.5rem 0;padding-left:1.5rem;">'
                + '<li>Events per variable (EPV): Minimum 10-20 events per predictor for logistic regression (Riley et al. recommend sample size calculations)</li>'
                + '<li>For ML methods: Generally need even more events per feature</li>'
                + '<li>Use penalized methods (LASSO, ridge) for high p/n ratios</li>'
                + '<li>Report optimism-corrected performance (bootstrap .632+ or internal-external CV)</li>'
                + '</ul>'
                + '<strong>Warning signs:</strong> Large gap between training and validation performance; very high training AUC (>0.95); unstable variable selection across bootstrap samples.'
        },
        {
            title: 'Calibration vs. Discrimination',
            content: 'Discrimination (can the model rank patients?) and calibration (are predicted probabilities accurate?) are distinct and both important.\n\n'
                + '<strong>Key points:</strong>\n'
                + '<ul style="margin:0.5rem 0;padding-left:1.5rem;">'
                + '<li>A model can have excellent discrimination (high AUC) but poor calibration (predicted 20% risk when actual risk is 5%)</li>'
                + '<li>Clinical decisions based on predicted probabilities require good calibration</li>'
                + '<li>Always report both: AUC/C-statistic for discrimination AND calibration plot/slope for calibration</li>'
                + '<li>Recalibration can fix calibration without affecting discrimination</li>'
                + '</ul>'
                + '<strong>Clinical impact:</strong> A poorly calibrated model may lead to over-treatment or under-treatment when used for shared decision-making.'
        },
        {
            title: 'Confusing Prediction with Causation',
            content: 'Prediction models identify patterns associated with outcomes, not causal relationships.\n\n'
                + '<strong>Key distinctions:</strong>\n'
                + '<ul style="margin:0.5rem 0;padding-left:1.5rem;">'
                + '<li>A predictor in a model may be a confounder, mediator, collider, or simply correlated</li>'
                + '<li>Feature importance (SHAP, permutation) shows predictive contribution, not causal effect</li>'
                + '<li>Intervening on a predictor identified by an ML model may not change the outcome</li>'
                + '<li>Prediction and causal inference require different frameworks (prediction: maximize fit; causal: minimize confounding)</li>'
                + '</ul>'
                + '<strong>Recommendation:</strong> Clearly state whether the goal is prediction or causal inference. Use appropriate methods for each.'
        },
        {
            title: 'Ignoring Temporal Relationships',
            content: 'In clinical data, the timing of measurements relative to the prediction time point is critical.\n\n'
                + '<strong>Common mistakes:</strong>\n'
                + '<ul style="margin:0.5rem 0;padding-left:1.5rem;">'
                + '<li>Using data collected after the prediction time point (future data leakage)</li>'
                + '<li>Not accounting for concept drift (disease definitions, treatment protocols change over time)</li>'
                + '<li>Ignoring lead-time bias when using screening-detected outcomes</li>'
                + '<li>Not performing temporal validation (training on older data, testing on newer)</li>'
                + '</ul>'
                + '<strong>Best practice:</strong> Define a clear clinical timeline with prediction time point (T0) and ensure all predictors are available at T0.'
        },
        {
            title: 'Not Accounting for Missing Data Properly',
            content: 'Missing data is ubiquitous in clinical datasets and how it is handled profoundly affects results.\n\n'
                + '<strong>Approaches (from worst to best):</strong>\n'
                + '<ul style="margin:0.5rem 0;padding-left:1.5rem;">'
                + '<li><strong>Complete-case analysis:</strong> Deletes rows with missing values. Introduces bias if data is not MCAR; loses statistical power.</li>'
                + '<li><strong>Single imputation (mean/median):</strong> Underestimates variance; introduces bias toward the mean.</li>'
                + '<li><strong>Multiple imputation:</strong> Creates multiple plausible datasets, analyses each, and combines results. Gold standard for statistical models.</li>'
                + '<li><strong>Indicator method:</strong> Adding a "missing" indicator variable. Can sometimes be useful but biased in many settings.</li>'
                + '</ul>'
                + '<strong>Key:</strong> Report the proportion of missing data per variable. Use multiple imputation (e.g., MICE) when possible. Perform sensitivity analyses comparing approaches.'
        }
    ];

    /* ------------------------------------------------------------------ */
    /*  ML Method recommendation logic                                     */
    /* ------------------------------------------------------------------ */
    function getRecommendations(task, dataSize, interpretability, featureType) {
        var recs = [];

        if (task === 'classification') {
            if (interpretability === 'high') {
                recs.push({ method: 'Logistic Regression', reason: 'Gold standard for interpretable classification; produces odds ratios; well-accepted in clinical literature.' });
                recs.push({ method: 'LASSO / Elastic Net', reason: 'Adds automatic feature selection to logistic regression; ideal when many candidate predictors exist.' });
                recs.push({ method: 'Decision Trees', reason: 'Produces intuitive decision rules; easy to explain to clinicians; useful for creating clinical decision algorithms.' });
            }
            if (interpretability === 'medium') {
                recs.push({ method: 'Random Forest', reason: 'Balances accuracy and interpretability; feature importance available; robust to overfitting.' });
                if (dataSize !== 'small') {
                    recs.push({ method: 'Gradient Boosting (XGBoost)', reason: 'Often highest accuracy; built-in handling of missing data; SHAP values for interpretation.' });
                }
                recs.push({ method: 'Naive Bayes', reason: 'Fast, works well with small samples; good baseline model to compare against more complex methods.' });
            }
            if (interpretability === 'low') {
                recs.push({ method: 'Gradient Boosting (XGBoost/LightGBM)', reason: 'State-of-the-art accuracy for tabular data; extensive hyperparameter tuning available.' });
                recs.push({ method: 'Support Vector Machines', reason: 'Excellent for high-dimensional data; kernel methods capture non-linear patterns.' });
                if (dataSize === 'large') {
                    recs.push({ method: 'Neural Networks', reason: 'Can capture complex patterns with sufficient data; flexible architecture.' });
                }
                if (featureType === 'images') {
                    recs.push({ method: 'CNNs (Deep Learning)', reason: 'State-of-the-art for image classification; transfer learning with pretrained models (ResNet, EfficientNet).' });
                }
                if (featureType === 'text') {
                    recs.push({ method: 'RNNs / Transformers', reason: 'Best for sequential/text data; clinical NLP applications; pretrained models (BioBERT, ClinicalBERT) available.' });
                }
            }
        } else if (task === 'regression') {
            if (interpretability === 'high') {
                recs.push({ method: 'Linear Regression with LASSO/Ridge', reason: 'Interpretable coefficients; feature selection; confidence intervals available.' });
            }
            if (interpretability === 'medium' || interpretability === 'low') {
                recs.push({ method: 'Random Forest Regressor', reason: 'Handles non-linearity; robust; feature importance available.' });
                recs.push({ method: 'Gradient Boosting Regressor', reason: 'Often best accuracy; handles mixed feature types well.' });
            }
            if (dataSize === 'large' && interpretability === 'low') {
                recs.push({ method: 'Neural Networks', reason: 'Flexible function approximation for large datasets with complex relationships.' });
            }
        } else if (task === 'survival') {
            recs.push({ method: 'Cox-LASSO', reason: 'Feature selection for survival data; interpretable hazard ratios; handles high-dimensional data.' });
            if (interpretability !== 'high') {
                recs.push({ method: 'Random Survival Forests', reason: 'No proportional hazards assumption; handles non-linear effects and interactions.' });
            }
            if (dataSize === 'large' && interpretability === 'low') {
                recs.push({ method: 'DeepSurv / Deep Learning Survival', reason: 'Neural network-based survival models for complex patterns in large datasets.' });
            }
        } else if (task === 'clustering') {
            recs.push({ method: 'K-Means / K-Medoids', reason: 'Simple and fast; good starting point for identifying patient subgroups.' });
            recs.push({ method: 'Hierarchical Clustering', reason: 'Produces dendrogram; no need to prespecify number of clusters; interpretable.' });
            if (dataSize !== 'small') {
                recs.push({ method: 'DBSCAN', reason: 'Finds clusters of arbitrary shape; handles noise; no need to specify number of clusters.' });
            }
            recs.push({ method: 'Latent Class Analysis', reason: 'Model-based clustering with probabilistic framework; good for mixed data types in clinical studies.' });
        } else if (task === 'dimensionality') {
            recs.push({ method: 'PCA', reason: 'Linear dimensionality reduction; preserves maximum variance; widely understood.' });
            recs.push({ method: 'UMAP / t-SNE', reason: 'Non-linear dimensionality reduction for visualization; preserves local structure.' });
            if (featureType === 'mixed') {
                recs.push({ method: 'Factor Analysis of Mixed Data (FAMD)', reason: 'Handles mixed continuous and categorical variables simultaneously.' });
            }
            recs.push({ method: 'Autoencoders', reason: 'Neural network-based non-linear dimensionality reduction; can capture complex relationships.' });
        }

        if (recs.length === 0) {
            recs.push({ method: 'Logistic Regression / Random Forest', reason: 'Good default starting point. Consider the specific characteristics of your data for further refinement.' });
        }

        return recs;
    }

    /* ------------------------------------------------------------------ */
    /*  Render                                                             */
    /* ------------------------------------------------------------------ */
    function renderLearnAndReference() {
            var html = '';
            // Learn & Reference section
            html += '<div class="card" style="background: var(--bg-secondary); border-left: 4px solid var(--accent-color);">';
            html += '<div class="card-title" style="cursor:pointer;" onclick="this.parentElement.querySelector(\'.learn-body\').classList.toggle(\'hidden\')">&#128218; Learn &amp; Reference <span style="font-size:0.8em; color: var(--text-muted);">(click to expand)</span></div>';
            html += '<div class="learn-body hidden">';

            html += '<div style="margin-bottom:1.2rem;">';
            html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Key Concepts</div>';
            html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
            html += '<li>Bias-variance tradeoff</li>';
            html += '<li>Overfitting vs underfitting</li>';
            html += '<li>Feature engineering</li>';
            html += '<li>Cross-validation (k-fold, LOOCV, nested CV)</li>';
            html += '<li>Hyperparameter tuning</li>';
            html += '</ul>';
            html += '</div>';

            html += '<div style="margin-bottom:1.2rem;">';
            html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Validation Hierarchy</div>';
            html += '<div style="font-size:0.9rem;line-height:1.7;padding-left:0.5rem;">';
            html += 'Internal (cross-validation) &rarr; Temporal validation &rarr; External (different population) &rarr; Clinical impact study.';
            html += '<br><strong>Always split BEFORE any data exploration.</strong>';
            html += '</div>';
            html += '</div>';

            html += '<div style="margin-bottom:1.2rem;">';
            html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Performance Metrics</div>';
            html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
            html += '<li><strong>Discrimination:</strong> AUC-ROC, c-statistic</li>';
            html += '<li><strong>Calibration:</strong> Hosmer-Lemeshow, calibration plots</li>';
            html += '<li><strong>Net benefit:</strong> Decision curves</li>';
            html += '<li><strong>Clinical utility:</strong> NRI, IDI</li>';
            html += '</ul>';
            html += '</div>';

            html += '<div style="margin-bottom:1.2rem;">';
            html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Common Pitfalls</div>';
            html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
            html += '<li>Data leakage (using test info during training)</li>';
            html += '<li>Class imbalance &rarr; misleading accuracy</li>';
            html += '<li>Overfitting to training data</li>';
            html += '<li>Ignoring calibration</li>';
            html += '<li>Not reporting confidence intervals</li>';
            html += '</ul>';
            html += '</div>';

            html += '<div style="margin-bottom:1.2rem;">';
            html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Model Development Workflow</div>';
            html += '<div style="font-size:0.9rem;line-height:1.7;padding-left:0.5rem;">';
            html += '1. Define clinical question &rarr; 2. Assess data quality &rarr; 3. Handle missing data &rarr; 4. Feature selection &rarr; 5. Model training &rarr; 6. Internal validation &rarr; 7. External validation &rarr; 8. Clinical impact study';
            html += '<br><strong>Sample size:</strong> Use Riley et al. criteria. Minimum EPV of 10-20 for logistic regression; more for complex ML methods.';
            html += '</div>';
            html += '</div>';

            html += '<div style="margin-bottom:1.2rem;">';
            html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Explainability Methods</div>';
            html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
            html += '<li><strong>SHAP values:</strong> Shapley Additive Explanations -- consistent, locally accurate feature attributions</li>';
            html += '<li><strong>LIME:</strong> Local Interpretable Model-agnostic Explanations -- local linear approximations</li>';
            html += '<li><strong>Partial Dependence Plots:</strong> Show marginal effect of a feature on predicted outcome</li>';
            html += '<li><strong>Attention Maps:</strong> For deep learning -- highlight input regions driving predictions</li>';
            html += '<li><strong>Permutation Importance:</strong> Measure drop in performance when a feature is shuffled</li>';
            html += '</ul>';
            html += '</div>';

            html += '<div style="margin-bottom:1.2rem;">';
            html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">Fairness & Bias Assessment</div>';
            html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.9rem;line-height:1.7;">';
            html += '<li>Evaluate model performance across demographic subgroups (age, sex, race/ethnicity)</li>';
            html += '<li>Report calibration separately for each subgroup</li>';
            html += '<li>Assess algorithmic fairness metrics: equalized odds, demographic parity, predictive parity</li>';
            html += '<li>Document training data demographics and representativeness</li>';
            html += '</ul>';
            html += '</div>';

            html += '<div>';
            html += '<div style="font-weight:700;margin-bottom:0.4rem;color:var(--accent);">References</div>';
            html += '<ul style="margin:0;padding-left:1.5rem;font-size:0.85rem;line-height:1.7;">';
            html += '<li>Collins GS et al. TRIPOD+AI, 2024</li>';
            html += '<li>Steyerberg EW. Clinical Prediction Models, 2nd ed. Springer 2019</li>';
            html += '<li>Rajkomar A et al. ML in Medicine, NEJM 2019</li>';
            html += '<li>Riley RD et al. Calculating sample size for prediction models. BMJ 2020</li>';
            html += '<li>Van Calster B et al. Calibration. Med Decis Making 2019</li>';
            html += '<li>Pencina MJ et al. NRI/IDI. Stat Med 2008;27:157-172</li>';
            html += '<li>Lundberg SM, Lee SI. SHAP. NeurIPS 2017</li>';
            html += '</ul>';
            html += '</div>';

            html += '</div></div>';
            return html;
        }

        function renderMLMethodSelector() {
            var html = '';
            /* === Card 1: ML Method Selector === */
            html += '<div class="card">';
            html += '<div class="card-title">ML Method Selector</div>';
            html += '<div class="card-subtitle">Answer the questions below to get algorithm recommendations tailored to your research problem.</div>';

            html += '<div class="form-row form-row--2">';
            html += '<div class="form-group"><label class="form-label">Task Type</label>';
            html += '<select class="form-select" id="ml-task">';
            html += '<option value="classification">Classification (binary/multi-class)</option>';
            html += '<option value="regression">Regression (continuous outcome)</option>';
            html += '<option value="clustering">Clustering (unsupervised grouping)</option>';
            html += '<option value="dimensionality">Dimensionality Reduction</option>';
            html += '<option value="survival">Survival / Time-to-Event</option>';
            html += '</select></div>';

            html += '<div class="form-group"><label class="form-label">Dataset Size</label>';
            html += '<select class="form-select" id="ml-datasize">';
            html += '<option value="small">Small (&lt;500 samples)</option>';
            html += '<option value="medium" selected>Medium (500 - 10,000)</option>';
            html += '<option value="large">Large (&gt;10,000)</option>';
            html += '</select></div>';
            html += '</div>';

            html += '<div class="form-row form-row--2">';
            html += '<div class="form-group"><label class="form-label">Interpretability Needed</label>';
            html += '<select class="form-select" id="ml-interp">';
            html += '<option value="high">High (clinician must understand model)</option>';
            html += '<option value="medium" selected>Medium (feature importance sufficient)</option>';
            html += '<option value="low">Low (performance is priority)</option>';
            html += '</select></div>';

            html += '<div class="form-group"><label class="form-label">Feature Types</label>';
            html += '<select class="form-select" id="ml-features">';
            html += '<option value="continuous">Continuous</option>';
            html += '<option value="categorical">Categorical</option>';
            html += '<option value="mixed" selected>Mixed</option>';
            html += '<option value="text">Text / Clinical Notes</option>';
            html += '<option value="images">Images (radiology, pathology)</option>';
            html += '</select></div>';
            html += '</div>';

            html += '<div class="btn-group mt-1">';
            html += '<button class="btn btn-primary" onclick="MLPrediction.recommend()">Get Recommendations</button>';
            html += '</div>';

            html += '<div id="ml-recommendations" class="mt-2"></div>';
            html += '</div>';
            return html;
        }

        function renderAlgorithmReference() {
            var html = '';
            /* === Card 2: Algorithm Reference === */
            html += '<div class="card">';
            html += '<div class="card-title">Algorithm Reference</div>';
            html += '<div class="card-subtitle">Comprehensive reference for machine learning algorithms commonly used in clinical research.</div>';

            html += '<div class="table-container">';
            html += '<table class="data-table">';
            html += '<thead><tr><th>Algorithm</th><th>Interpretability</th><th>Description</th><th style="min-width:200px">Clinical Applications</th></tr></thead>';
            html += '<tbody>';
            for (var a = 0; a < algorithms.length; a++) {
                var alg = algorithms[a];
                var stars = '';
                for (var si = 0; si < 5; si++) {
                    stars += si < alg.interpretability ? '&#9733;' : '&#9734;';
                }
                html += '<tr>';
                html += '<td><strong>' + alg.name + '</strong></td>';
                html += '<td style="white-space:nowrap;">' + stars + ' (' + alg.interpretability + '/5)</td>';
                html += '<td style="font-size:0.85rem;">' + alg.desc + '</td>';
                html += '<td style="font-size:0.85rem;">' + alg.applications + '</td>';
                html += '</tr>';
            }
            html += '</tbody></table>';
            html += '</div>';

            /* Expandable detail cards for each algorithm */
            html += '<div class="card-subtitle mt-2">Detailed Algorithm Information</div>';
            for (var b = 0; b < algorithms.length; b++) {
                var alg2 = algorithms[b];
                html += '<div style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.5rem;overflow:hidden;">';
                html += '<div onclick="MLPrediction.toggleAlgDetail(' + b + ')" style="padding:0.6rem 1rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:var(--bg-elevated);">';
                html += '<strong>' + alg2.name + '</strong>';
                html += '<span id="ml-alg-arrow-' + b + '" style="transition:transform 0.2s;">&#9660;</span>';
                html += '</div>';
                html += '<div id="ml-alg-detail-' + b + '" class="hidden" style="padding:0.8rem 1rem;font-size:0.9rem;">';
                html += '<p><strong>Description:</strong> ' + alg2.desc + '</p>';
                html += '<p><strong>Pros:</strong> ' + alg2.pros + '</p>';
                html += '<p><strong>Cons:</strong> ' + alg2.cons + '</p>';
                html += '<p><strong>Key Hyperparameters:</strong> ' + alg2.hyperparams + '</p>';
                html += '<p><strong>Clinical Applications:</strong> ' + alg2.applications + '</p>';
                html += '</div></div>';
            }
            html += '</div>';
            return html;
        }

        function renderModelValidationGuide() {
            var html = '';
            /* === Card 3: Model Validation Guide === */
            html += '<div class="card">';
            html += '<div class="card-title">Model Validation Guide</div>';

            html += '<div class="card-subtitle">Validation Strategies</div>';
            for (var v = 0; v < validationStrategies.length; v++) {
                var vs = validationStrategies[v];
                html += '<div style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.5rem;overflow:hidden;">';
                html += '<div onclick="MLPrediction.toggleValidation(' + v + ')" style="padding:0.6rem 1rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:var(--bg-elevated);">';
                html += '<strong>' + vs.name + '</strong>';
                html += '<span id="ml-val-arrow-' + v + '" style="transition:transform 0.2s;">&#9660;</span>';
                html += '</div>';
                html += '<div id="ml-val-detail-' + v + '" class="hidden" style="padding:0.8rem 1rem;font-size:0.9rem;">';
                html += '<p>' + vs.desc + '</p>';
                html += '<p><strong>When to use:</strong> ' + vs.when + '</p>';
                html += '<p><strong>Pros:</strong> ' + vs.pros + '</p>';
                html += '<p><strong>Cons:</strong> ' + vs.cons + '</p>';
                html += '<p style="color:var(--accent);"><strong>Recommendation:</strong> ' + vs.recommendation + '</p>';
                html += '</div></div>';
            }

            /* Classification metrics */
            html += '<div class="card-subtitle mt-2">Classification Metrics</div>';
            html += '<div class="table-container">';
            html += '<table class="data-table">';
            html += '<thead><tr><th>Metric</th><th>Range</th><th>Description</th><th>Notes</th></tr></thead>';
            html += '<tbody>';
            for (var cm = 0; cm < classificationMetrics.length; cm++) {
                var m = classificationMetrics[cm];
                html += '<tr><td><strong>' + m.name + '</strong></td><td style="white-space:nowrap;font-size:0.85rem;">' + m.range + '</td><td style="font-size:0.85rem;">' + m.desc + '</td><td style="font-size:0.85rem;">' + m.notes + '</td></tr>';
            }
            html += '</tbody></table></div>';

            /* Regression metrics */
            html += '<div class="card-subtitle mt-2">Regression Metrics</div>';
            html += '<div class="table-container">';
            html += '<table class="data-table">';
            html += '<thead><tr><th>Metric</th><th>Range</th><th>Description</th><th>Notes</th></tr></thead>';
            html += '<tbody>';
            for (var rm = 0; rm < regressionMetrics.length; rm++) {
                var mr = regressionMetrics[rm];
                html += '<tr><td><strong>' + mr.name + '</strong></td><td style="white-space:nowrap;font-size:0.85rem;">' + mr.range + '</td><td style="font-size:0.85rem;">' + mr.desc + '</td><td style="font-size:0.85rem;">' + mr.notes + '</td></tr>';
            }
            html += '</tbody></table></div>';

            /* Survival metrics */
            html += '<div class="card-subtitle mt-2">Survival / Reclassification Metrics</div>';
            html += '<div class="table-container">';
            html += '<table class="data-table">';
            html += '<thead><tr><th>Metric</th><th>Range</th><th>Description</th><th>Notes</th></tr></thead>';
            html += '<tbody>';
            for (var sm = 0; sm < survivalMetrics.length; sm++) {
                var ms = survivalMetrics[sm];
                html += '<tr><td><strong>' + ms.name + '</strong></td><td style="white-space:nowrap;font-size:0.85rem;">' + ms.range + '</td><td style="font-size:0.85rem;">' + ms.desc + '</td><td style="font-size:0.85rem;">' + ms.notes + '</td></tr>';
            }
            html += '</tbody></table></div>';
            html += '</div>';
            return html;
        }

        function renderTripodChecklist() {
            var html = '';
            /* === Card 4: TRIPOD+AI Checklist === */
            html += '<div class="card">';
            html += '<div class="card-title">TRIPOD+AI Checklist</div>';
            html += '<div class="card-subtitle">Checklist for reporting prediction model studies with AI/ML components. Based on TRIPOD with AI extensions.</div>';

            /* Progress bar */
            html += '<div style="margin-bottom:1rem;">';
            html += '<div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:0.3rem;">';
            html += '<span id="ml-tripod-progress-text">0 / ' + tripodItems.length + ' items completed</span>';
            html += '<span id="ml-tripod-progress-pct">0%</span>';
            html += '</div>';
            html += '<div style="height:8px;background:var(--bg-elevated);border-radius:4px;overflow:hidden;">';
            html += '<div id="ml-tripod-progress-bar" style="height:100%;width:0%;background:var(--accent);border-radius:4px;transition:width 0.3s;"></div>';
            html += '</div>';
            html += '</div>';

            var lastTripodSection = '';
            for (var t = 0; t < tripodItems.length; t++) {
                var ti = tripodItems[t];
                if (ti.section !== lastTripodSection) {
                    if (lastTripodSection !== '') html += '</div>';
                    html += '<div style="margin-bottom:0.5rem;">';
                    html += '<div style="font-weight:600;font-size:0.95rem;color:var(--accent);margin:0.8rem 0 0.4rem;border-bottom:1px solid var(--border);padding-bottom:0.2rem;">' + ti.section + '</div>';
                    lastTripodSection = ti.section;
                }
                var tKey = 'tripod_' + ti.num;
                html += '<label style="display:flex;align-items:flex-start;gap:0.5rem;padding:0.35rem 0;cursor:pointer;font-size:0.9rem;">';
                html += '<input type="checkbox" id="ml-tripod-' + tKey + '" onchange="MLPrediction.toggleTripod(\'' + ti.num + '\')" style="margin-top:3px;flex-shrink:0;">';
                html += '<span><strong>' + ti.num + '.</strong> ' + ti.text + '</span>';
                html += '</label>';
            }
            if (lastTripodSection !== '') html += '</div>';

            html += '<div class="btn-group mt-2">';
            html += '<button class="btn btn-secondary" onclick="MLPrediction.copyTripod()">Copy TRIPOD+AI Checklist</button>';
            html += '<button class="btn btn-secondary" onclick="MLPrediction.resetTripod()">Reset</button>';
            html += '</div>';
            html += '</div>';
            return html;
        }

        function renderCommonPitfalls() {
            var html = '';
            /* === Card 5: Common Pitfalls === */
            html += '<div class="card">';
            html += '<div class="card-title">Common Pitfalls in Clinical ML</div>';
            html += '<div class="card-subtitle">Critical issues to avoid when applying machine learning to clinical research data.</div>';

            for (var p = 0; p < pitfalls.length; p++) {
                var pit = pitfalls[p];
                html += '<div style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.5rem;overflow:hidden;">';
                html += '<div onclick="MLPrediction.togglePitfall(' + p + ')" style="padding:0.6rem 1rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:var(--bg-elevated);">';
                html += '<strong style="color:var(--warning,#e67e22);">' + (p + 1) + '. ' + pit.title + '</strong>';
                html += '<span id="ml-pit-arrow-' + p + '" style="transition:transform 0.2s;">&#9660;</span>';
                html += '</div>';
                html += '<div id="ml-pit-detail-' + p + '" class="hidden" style="padding:0.8rem 1rem;font-size:0.9rem;">';
                html += pit.content;
                html += '</div></div>';
            }
            html += '</div>';
            return html;
        }

        function renderValidationCalculator() {
            var html = '';
            /* === Card 6: Model Validation Calculator === */
            html += '<div class="card">';
            html += '<div class="card-title">Model Validation Calculator</div>';
            html += '<div class="card-subtitle">Compute cross-validation, bootstrap, and train/test split performance estimates for model evaluation.</div>';

            html += '<div class="form-row form-row--2">';
            html += '<div class="form-group"><label class="form-label">Validation Method</label>';
            html += '<select class="form-select" id="ml-val-method">';
            html += '<option value="kfold">k-Fold Cross-Validation</option>';
            html += '<option value="bootstrap">Bootstrap (.632+)</option>';
            html += '<option value="traintestsplit">Train/Test Split</option>';
            html += '</select></div>';
            html += '<div class="form-group"><label class="form-label">Total Sample Size (N)</label>';
            html += '<input type="number" class="form-input" id="ml-val-n" value="500" min="10"></div>';
            html += '</div>';

            html += '<div class="form-row form-row--3">';
            html += '<div class="form-group"><label class="form-label">Number of Events</label>';
            html += '<input type="number" class="form-input" id="ml-val-events" value="75" min="1"></div>';
            html += '<div class="form-group"><label class="form-label">Number of Predictors</label>';
            html += '<input type="number" class="form-input" id="ml-val-predictors" value="10" min="1"></div>';
            html += '<div class="form-group"><label class="form-label">k (folds) / B (bootstraps)</label>';
            html += '<input type="number" class="form-input" id="ml-val-k" value="10" min="2" max="500"></div>';
            html += '</div>';

            html += '<div class="form-row form-row--2">';
            html += '<div class="form-group"><label class="form-label">Apparent AUC (training)</label>';
            html += '<input type="number" class="form-input" id="ml-val-auc" value="0.82" min="0.5" max="1" step="0.01"></div>';
            html += '<div class="form-group"><label class="form-label">Train Fraction (for split)</label>';
            html += '<input type="number" class="form-input" id="ml-val-trainfrac" value="0.7" min="0.5" max="0.9" step="0.05"></div>';
            html += '</div>';

            html += '<div class="btn-group mt-1">';
            html += '<button class="btn btn-primary" onclick="MLPrediction.calcValidation()">Evaluate Validation Strategy</button>';
            html += '</div>';
            html += '<div id="ml-val-results" class="mt-2"></div>';
            html += '</div>';
            return html;
        }

        function renderFeatureSelection() {
            var html = '';
            /* === Card 7: Feature Selection Guide === */
            html += '<div class="card">';
            html += '<div class="card-title">Feature Selection Guide</div>';
            html += '<div class="card-subtitle">Compare feature selection methods and get recommendations based on your data characteristics.</div>';

            var featureSelMethods = [
                { name: 'Univariate Filtering', desc: 'Rank features independently using statistical tests (t-test, chi-squared, mutual information). Select top-k features.', pros: 'Fast; simple; scales to large feature sets; no model dependency.', cons: 'Ignores feature interactions; may miss jointly predictive features; threshold is arbitrary.', when: 'Initial screening of very high-dimensional data (genomics, EHR); as a pre-filter before wrapper methods.', rCode: 'library(caret)<br>nearZeroVar(data) # Remove near-zero variance<br># Chi-squared test for categorical features<br>chisq.test(table(feature, outcome))<br># For continuous: Wilcoxon or t-test per feature' },
                { name: 'LASSO (L1 Regularization)', desc: 'Penalized regression that shrinks coefficients toward zero. Features with zero coefficients are eliminated.', pros: 'Simultaneous selection and estimation; handles correlated features; embeds in model training.', cons: 'Assumes linearity; unstable with highly correlated features; may select arbitrarily among correlated group.', when: 'Standard choice for clinical prediction models; moderate to high-dimensional data; when interpretability is needed.', rCode: 'library(glmnet)<br>cv_fit &lt;- cv.glmnet(X, y, family="binomial", alpha=1)<br>coef(cv_fit, s="lambda.min")' },
                { name: 'Elastic Net', desc: 'Combines L1 (LASSO) and L2 (Ridge) penalties. Alpha parameter controls the mix.', pros: 'Handles correlated features better than LASSO alone; groups correlated features; flexible.', cons: 'Two hyperparameters to tune (alpha, lambda); slightly more complex than pure LASSO.', when: 'When features are correlated (common in clinical data); when LASSO is unstable across bootstrap samples.', rCode: 'library(glmnet)<br>cv_fit &lt;- cv.glmnet(X, y, family="binomial", alpha=0.5)<br>coef(cv_fit, s="lambda.min")' },
                { name: 'Recursive Feature Elimination (RFE)', desc: 'Iteratively trains model, ranks features by importance, removes least important, and repeats.', pros: 'Considers feature interactions; wrapper method captures model-specific importance.', cons: 'Computationally expensive; risk of overfitting if not nested in CV; greedy algorithm.', when: 'Moderate number of features (<100); when feature interactions matter; with random forest or SVM.', rCode: 'library(caret)<br>ctrl &lt;- rfeControl(functions=rfFuncs, method="cv", number=10)<br>result &lt;- rfe(X, y, sizes=c(5,10,15,20), rfeControl=ctrl)' },
                { name: 'Stability Selection', desc: 'Runs LASSO on random subsamples of data; selects features that appear frequently across subsamples.', pros: 'Controls false discovery rate; robust; identifies truly important features.', cons: 'Computationally intensive; conservative (may miss some true features).', when: 'When controlling false positives in feature selection is critical; high-dimensional settings; biomarker discovery.', rCode: 'library(stabs)<br>stab &lt;- stabsel(X, y, fitfun=glmnet.lasso, cutoff=0.75, PFER=1)' },
                { name: 'Boruta (Random Forest Wrapper)', desc: 'Creates shadow features (shuffled copies) and compares real feature importance against shadows using random forest.', pros: 'Statistically principled; captures non-linear relationships and interactions; all-relevant selection.', cons: 'Slow for large datasets; depends on random forest assumptions; may be unstable with small samples.', when: 'When non-linear relationships expected; exploratory analysis; complementing LASSO-based methods.', rCode: 'library(Boruta)<br>boruta_result &lt;- Boruta(outcome ~ ., data=df, doTrace=2)<br>getSelectedAttributes(boruta_result)' }
            ];

            for (var fs = 0; fs < featureSelMethods.length; fs++) {
                var fsm = featureSelMethods[fs];
                html += '<div style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.5rem;overflow:hidden;">';
                html += '<div onclick="MLPrediction.toggleFeatureSel(' + fs + ')" style="padding:0.6rem 1rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:var(--bg-elevated);">';
                html += '<strong>' + fsm.name + '</strong>';
                html += '<span id="ml-fs-arrow-' + fs + '" style="transition:transform 0.2s;">&#9660;</span>';
                html += '</div>';
                html += '<div id="ml-fs-detail-' + fs + '" class="hidden" style="padding:0.8rem 1rem;font-size:0.9rem;">';
                html += '<p>' + fsm.desc + '</p>';
                html += '<p><strong>Pros:</strong> ' + fsm.pros + '</p>';
                html += '<p><strong>Cons:</strong> ' + fsm.cons + '</p>';
                html += '<p><strong>When to use:</strong> ' + fsm.when + '</p>';
                html += '<div style="margin-top:0.5rem;padding:0.5rem;background:var(--bg-elevated);border-radius:4px;font-family:var(--font-mono,monospace);font-size:0.8rem;line-height:1.6;">' + fsm.rCode + '</div>';
                html += '</div></div>';
            }
            html += '</div>';
            return html;
        }

        function renderModelComparison() {
            var html = '';
            /* === Card 8: Model Comparison Metrics Table === */
            html += '<div class="card">';
            html += '<div class="card-title">Model Comparison Calculator</div>';
            html += '<div class="card-subtitle">Enter metrics for multiple models to generate a comparison table. Supports AUC, Brier score, and calibration slope.</div>';

            html += '<div id="ml-comp-models">';
            html += '<div class="form-row form-row--3" style="margin-bottom:0.3rem;">';
            html += '<div class="form-group"><label class="form-label">Model Name</label></div>';
            html += '<div class="form-group"><label class="form-label">AUC (0.5-1.0)</label></div>';
            html += '<div class="form-group"><label class="form-label">Brier Score (0-1)</label></div>';
            html += '</div>';
            for (var mi = 0; mi < 3; mi++) {
                var mNames = ['Logistic Regression', 'Random Forest', 'XGBoost'];
                var mAucs = ['0.78', '0.82', '0.84'];
                var mBriers = ['0.18', '0.16', '0.15'];
                html += '<div class="form-row form-row--3" style="margin-bottom:0.3rem;">';
                html += '<div class="form-group"><input type="text" class="form-input" id="ml-comp-name-' + mi + '" value="' + mNames[mi] + '"></div>';
                html += '<div class="form-group"><input type="number" class="form-input" id="ml-comp-auc-' + mi + '" value="' + mAucs[mi] + '" step="0.01" min="0" max="1"></div>';
                html += '<div class="form-group"><input type="number" class="form-input" id="ml-comp-brier-' + mi + '" value="' + mBriers[mi] + '" step="0.01" min="0" max="1"></div>';
                html += '</div>';
            }
            html += '</div>';

            html += '<div class="form-row form-row--3" style="margin-bottom:0.3rem;">';
            html += '<div class="form-group"><label class="form-label">Calibration Slope</label></div>';
            html += '<div class="form-group"><label class="form-label">Sensitivity</label></div>';
            html += '<div class="form-group"><label class="form-label">Specificity</label></div>';
            html += '</div>';
            for (var mj = 0; mj < 3; mj++) {
                var mSlopes = ['0.95', '0.88', '0.85'];
                var mSens = ['0.72', '0.78', '0.80'];
                var mSpecs = ['0.74', '0.76', '0.78'];
                html += '<div class="form-row form-row--3" style="margin-bottom:0.3rem;">';
                html += '<div class="form-group"><input type="number" class="form-input" id="ml-comp-slope-' + mj + '" value="' + mSlopes[mj] + '" step="0.01" min="0" max="2"></div>';
                html += '<div class="form-group"><input type="number" class="form-input" id="ml-comp-sens-' + mj + '" value="' + mSens[mj] + '" step="0.01" min="0" max="1"></div>';
                html += '<div class="form-group"><input type="number" class="form-input" id="ml-comp-spec-' + mj + '" value="' + mSpecs[mj] + '" step="0.01" min="0" max="1"></div>';
                html += '</div>';
            }

            html += '<div class="btn-group mt-1">';
            html += '<button class="btn btn-primary" onclick="MLPrediction.compareModels()">Compare Models</button>';
            html += '<button class="btn btn-secondary" onclick="MLPrediction.copyComparison()">Copy Table</button>';
            html += '</div>';
            html += '<div id="ml-comp-results" class="mt-2"></div>';
            html += '</div>';
            return html;
        }

        function renderNRIIDICalculator() {
            var html = '';
            /* === Card 9: NRI / IDI Calculator === */
            html += '<div class="card">';
            html += '<div class="card-title">NRI &amp; IDI Calculator</div>';
            html += '<div class="card-subtitle">Calculate Net Reclassification Improvement and Integrated Discrimination Improvement when comparing two models.</div>';

            html += '<div class="card-subtitle" style="font-weight:600;margin-top:0.5rem;">Event Subjects</div>';
            html += '<div class="form-row form-row--3">';
            html += '<div class="form-group"><label class="form-label">Reclassified Up (events)</label>';
            html += '<input type="number" class="form-input" id="ml-nri-event-up" value="25" min="0"></div>';
            html += '<div class="form-group"><label class="form-label">Reclassified Down (events)</label>';
            html += '<input type="number" class="form-input" id="ml-nri-event-down" value="10" min="0"></div>';
            html += '<div class="form-group"><label class="form-label">Total Events</label>';
            html += '<input type="number" class="form-input" id="ml-nri-total-events" value="100" min="1"></div>';
            html += '</div>';

            html += '<div class="card-subtitle" style="font-weight:600;">Non-Event Subjects</div>';
            html += '<div class="form-row form-row--3">';
            html += '<div class="form-group"><label class="form-label">Reclassified Up (non-events)</label>';
            html += '<input type="number" class="form-input" id="ml-nri-nonevent-up" value="15" min="0"></div>';
            html += '<div class="form-group"><label class="form-label">Reclassified Down (non-events)</label>';
            html += '<input type="number" class="form-input" id="ml-nri-nonevent-down" value="30" min="0"></div>';
            html += '<div class="form-group"><label class="form-label">Total Non-Events</label>';
            html += '<input type="number" class="form-input" id="ml-nri-total-nonevents" value="400" min="1"></div>';
            html += '</div>';

            html += '<div class="card-subtitle" style="font-weight:600;">IDI Inputs</div>';
            html += '<div class="form-row form-row--2">';
            html += '<div class="form-group"><label class="form-label">Mean Predicted Prob (Old Model, Events)</label>';
            html += '<input type="number" class="form-input" id="ml-idi-old-event" value="0.35" step="0.01" min="0" max="1"></div>';
            html += '<div class="form-group"><label class="form-label">Mean Predicted Prob (New Model, Events)</label>';
            html += '<input type="number" class="form-input" id="ml-idi-new-event" value="0.45" step="0.01" min="0" max="1"></div>';
            html += '</div>';
            html += '<div class="form-row form-row--2">';
            html += '<div class="form-group"><label class="form-label">Mean Predicted Prob (Old Model, Non-Events)</label>';
            html += '<input type="number" class="form-input" id="ml-idi-old-nonevent" value="0.12" step="0.01" min="0" max="1"></div>';
            html += '<div class="form-group"><label class="form-label">Mean Predicted Prob (New Model, Non-Events)</label>';
            html += '<input type="number" class="form-input" id="ml-idi-new-nonevent" value="0.10" step="0.01" min="0" max="1"></div>';
            html += '</div>';

            html += '<div class="btn-group mt-1">';
            html += '<button class="btn btn-primary" onclick="MLPrediction.calcNRI()">Calculate NRI &amp; IDI</button>';
            html += '</div>';
            html += '<div id="ml-nri-results" class="mt-2"></div>';
            html += '</div>';
            return html;
        }

        function renderCalibrationExplainer() {
            var html = '';
            /* === Card 10: Calibration Plot Explainer === */
            html += '<div class="card">';
            html += '<div class="card-title">Calibration Plot Explainer</div>';
            html += '<div class="card-subtitle">Understand how to interpret calibration plots and common calibration issues in prediction models.</div>';

            var calibTopics = [
                { title: 'What is Calibration?', content: 'Calibration measures the agreement between predicted probabilities and observed outcomes. A well-calibrated model predicts 20% risk for a group where 20% of patients actually have the event.<br><br><strong>Why it matters:</strong> Clinical decisions based on predicted probabilities (e.g., "your 10-year stroke risk is 15%") require accurate calibration. A model with high AUC but poor calibration may rank patients correctly but give wrong absolute risk estimates.' },
                { title: 'Calibration Plot Interpretation', content: '<strong>Perfect calibration:</strong> Points fall on the 45-degree diagonal line.<br><br><strong>Calibration-in-the-large (intercept):</strong> Measures whether the average predicted probability matches the overall event rate. Intercept = 0 means overall calibration is correct.<br><br><strong>Calibration slope:</strong><ul style="margin:0.5rem 0;padding-left:1.5rem;"><li>Slope = 1.0: Perfect calibration</li><li>Slope &lt; 1.0: Overfitting (predictions too extreme -- high predictions too high, low predictions too low)</li><li>Slope &gt; 1.0: Underfitting (predictions too conservative -- not spread out enough)</li></ul>' },
                { title: 'Common Calibration Problems', content: '<strong>1. Systematic overestimation:</strong> All predicted probabilities are too high. The calibration curve falls below the diagonal. Causes: Higher event rate in development than validation population.<br><br><strong>2. Systematic underestimation:</strong> All predicted probabilities are too low. The curve falls above the diagonal.<br><br><strong>3. Overfitting:</strong> Slope &lt; 1. High-risk predictions are too high, low-risk predictions are too low. Causes: Too many predictors, small sample, no regularization.<br><br><strong>4. Poor calibration at extremes:</strong> Good calibration in middle risk groups but poor at very low or very high predicted probabilities.' },
                { title: 'Recalibration Methods', content: '<strong>Logistic recalibration:</strong> Fit logit(observed) = a + b * logit(predicted). Adjusts intercept (a) and slope (b).<br><br><strong>Platt scaling:</strong> Post-hoc calibration using logistic regression on predicted scores. Common for SVMs and neural networks.<br><br><strong>Isotonic regression:</strong> Non-parametric calibration method. More flexible but requires larger validation sets.<br><br><strong>When to recalibrate:</strong> When applying a model to a new population with different event rate or risk factor distribution. Report both original and recalibrated performance.' },
                { title: 'Hosmer-Lemeshow vs. Calibration Plots', content: '<strong>Hosmer-Lemeshow test:</strong><ul style="margin:0.5rem 0;padding-left:1.5rem;"><li>Groups patients into deciles of predicted risk</li><li>Compares observed vs expected events per group</li><li>p > 0.05 suggests adequate calibration</li><li><strong>Limitations:</strong> Sensitive to sample size, arbitrary grouping, low power in small samples</li></ul><strong>Calibration plots with loess smoother are preferred</strong> because they show the full calibration curve without arbitrary grouping. Report calibration slope and intercept as quantitative summary measures.' }
            ];

            for (var ct = 0; ct < calibTopics.length; ct++) {
                var ctopic = calibTopics[ct];
                html += '<div style="border:1px solid var(--border);border-radius:6px;margin-bottom:0.5rem;overflow:hidden;">';
                html += '<div onclick="MLPrediction.toggleCalib(' + ct + ')" style="padding:0.6rem 1rem;cursor:pointer;display:flex;justify-content:space-between;align-items:center;background:var(--bg-elevated);">';
                html += '<strong>' + ctopic.title + '</strong>';
                html += '<span id="ml-calib-arrow-' + ct + '" style="transition:transform 0.2s;">&#9660;</span>';
                html += '</div>';
                html += '<div id="ml-calib-detail-' + ct + '" class="hidden" style="padding:0.8rem 1rem;font-size:0.9rem;line-height:1.7;">';
                html += ctopic.content;
                html += '</div></div>';
            }
            html += '</div>';
            return html;
        }

        function renderCPMChecklist() {
            var html = '';
            /* === Card 11: Clinical Prediction Model Development Checklist === */
            html += '<div class="card">';
            html += '<div class="card-title">Clinical Prediction Model Development Checklist</div>';
            html += '<div class="card-subtitle">Step-by-step guide for developing and validating clinical prediction models following best practices.</div>';

            var cpmSteps = [
                { step: '1', title: 'Define the Clinical Problem', items: ['Specify the target population', 'Define the prediction time point (T0)', 'Define the outcome and time horizon', 'Determine intended clinical use (screening, diagnosis, prognosis)', 'Conduct a systematic review of existing models'] },
                { step: '2', title: 'Study Design & Data', items: ['Choose appropriate study design (cohort preferred)', 'Calculate minimum sample size (Riley et al. criteria)', 'Ensure adequate events per variable (EPV >= 10-20)', 'Document data source and collection methods', 'Check data quality and completeness'] },
                { step: '3', title: 'Candidate Predictors', items: ['Select predictors available at T0 in clinical practice', 'Limit number based on EPV considerations', 'Avoid predictors that are consequences of the outcome', 'Document how each predictor is measured', 'Consider clinical face validity'] },
                { step: '4', title: 'Missing Data', items: ['Report missing data proportions per variable', 'Assess missing data mechanism (MCAR/MAR/MNAR)', 'Use multiple imputation (not complete case)', 'Include outcome in imputation model', 'Perform sensitivity analysis for missing data'] },
                { step: '5', title: 'Model Development', items: ['Pre-specify the modeling strategy', 'Handle continuous predictors appropriately (no dichotomization)', 'Use penalized methods if p/n ratio is high', 'Avoid automated stepwise selection', 'Consider non-linear effects (restricted cubic splines)'] },
                { step: '6', title: 'Internal Validation', items: ['Use bootstrap validation (200+ resamples) or cross-validation', 'Report optimism-corrected performance', 'Assess calibration (plot, slope, intercept)', 'Assess discrimination (C-statistic/AUC)', 'Report confidence intervals for all metrics'] },
                { step: '7', title: 'Model Presentation', items: ['Present the full model (all coefficients)', 'Create a nomogram or scoring system', 'Provide example calculations', 'Develop a risk calculator or app', 'Explain how to use the model clinically'] },
                { step: '8', title: 'External Validation', items: ['Validate in independent dataset', 'Assess geographic and temporal transportability', 'Report calibration and discrimination in validation data', 'Consider recalibration if needed', 'Plan for model updating over time'] }
            ];

            html += '<div id="ml-cpm-checklist">';
            for (var cs = 0; cs < cpmSteps.length; cs++) {
                var cstep = cpmSteps[cs];
                html += '<div style="margin-bottom:0.8rem;border:1px solid var(--border);border-radius:6px;padding:0.8rem 1rem;">';
                html += '<div style="font-weight:700;color:var(--accent);margin-bottom:0.4rem;">Step ' + cstep.step + ': ' + cstep.title + '</div>';
                for (var ci = 0; ci < cstep.items.length; ci++) {
                    html += '<label style="display:flex;align-items:flex-start;gap:0.5rem;padding:0.2rem 0;cursor:pointer;font-size:0.85rem;">';
                    html += '<input type="checkbox" id="ml-cpm-' + cs + '-' + ci + '" onchange="MLPrediction.updateCPMProgress()" style="margin-top:3px;flex-shrink:0;">';
                    html += '<span>' + cstep.items[ci] + '</span>';
                    html += '</label>';
                }
                html += '</div>';
            }
            html += '</div>';

            html += '<div style="margin-top:0.5rem;">';
            html += '<div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:0.3rem;">';
            html += '<span id="ml-cpm-progress-text">0 items completed</span>';
            html += '<span id="ml-cpm-progress-pct">0%</span>';
            html += '</div>';
            html += '<div style="height:8px;background:var(--bg-elevated);border-radius:4px;overflow:hidden;">';
            html += '<div id="ml-cpm-progress-bar" style="height:100%;width:0%;background:var(--accent);border-radius:4px;transition:width 0.3s;"></div>';
            html += '</div>';
            html += '</div>';

            html += '<div class="btn-group mt-2">';
            html += '<button class="btn btn-secondary" onclick="MLPrediction.copyCPMChecklist()">Copy Checklist</button>';
            html += '</div>';
            html += '</div>';
            return html;
        }

    function render(container) {
        var html = App.createModuleLayout(
            'ML for Clinical Research',
            'Educational reference and decision tools for applying machine learning methods in clinical and epidemiological research.'
        );

        html += renderLearnAndReference();
        html += renderMLMethodSelector();
        html += renderAlgorithmReference();
        html += renderModelValidationGuide();
        html += renderTripodChecklist();
        html += renderCommonPitfalls();
        html += renderValidationCalculator();
        html += renderFeatureSelection();
        html += renderModelComparison();
        html += renderNRIIDICalculator();
        html += renderCalibrationExplainer();
        html += renderCPMChecklist();

        App.setTrustedHTML(container, html);
        App.autoSaveInputs(container, MODULE_ID);
    }


    /* ------------------------------------------------------------------ */
    /*  Interaction handlers                                               */
    /* ------------------------------------------------------------------ */
    function recommend() {
        var task = document.getElementById('ml-task').value;
        var dataSize = document.getElementById('ml-datasize').value;
        var interp = document.getElementById('ml-interp').value;
        var features = document.getElementById('ml-features').value;

        var recs = getRecommendations(task, dataSize, interp, features);

        var html = '<div class="result-panel">';
        html += '<div class="card-subtitle">Recommended Methods</div>';

        for (var i = 0; i < recs.length; i++) {
            var rec = recs[i];
            html += '<div style="padding:0.6rem 0;border-bottom:1px solid var(--border);">';
            html += '<div class="result-value" style="font-size:1rem;">' + (i + 1) + '. ' + rec.method + '</div>';
            html += '<div class="result-detail">' + rec.reason + '</div>';
            html += '</div>';
        }

        html += '<div style="margin-top:0.8rem;padding:0.6rem;background:var(--bg-elevated);border-radius:4px;font-size:0.85rem;">';
        html += '<strong>Context:</strong> Task=' + task + ', Data size=' + dataSize + ', Interpretability=' + interp + ', Features=' + features;
        html += '<br><strong>General advice:</strong> Always start with a simple, interpretable baseline (e.g., logistic regression) and only move to complex models if performance improvement justifies the loss of interpretability.';
        html += '</div>';
        html += '</div>';

        var el = document.getElementById('ml-recommendations');
        if (el) App.setTrustedHTML(el, html);
    }

    function toggleAlgDetail(idx) {
        var detail = document.getElementById('ml-alg-detail-' + idx);
        var arrow = document.getElementById('ml-alg-arrow-' + idx);
        if (detail) {
            detail.classList.toggle('hidden');
            if (arrow) arrow.style.transform = detail.classList.contains('hidden') ? '' : 'rotate(180deg)';
        }
    }

    function toggleValidation(idx) {
        var detail = document.getElementById('ml-val-detail-' + idx);
        var arrow = document.getElementById('ml-val-arrow-' + idx);
        if (detail) {
            detail.classList.toggle('hidden');
            if (arrow) arrow.style.transform = detail.classList.contains('hidden') ? '' : 'rotate(180deg)';
        }
    }

    function togglePitfall(idx) {
        var detail = document.getElementById('ml-pit-detail-' + idx);
        var arrow = document.getElementById('ml-pit-arrow-' + idx);
        if (detail) {
            detail.classList.toggle('hidden');
            if (arrow) arrow.style.transform = detail.classList.contains('hidden') ? '' : 'rotate(180deg)';
        }
    }

    function toggleTripod(num) {
        tripodState[num] = !tripodState[num];
        updateTripodProgress();
    }

    function updateTripodProgress() {
        var total = tripodItems.length;
        var done = 0;
        for (var i = 0; i < tripodItems.length; i++) {
            if (tripodState[tripodItems[i].num]) done++;
        }
        var pct = total > 0 ? Math.round((done / total) * 100) : 0;

        var textEl = document.getElementById('ml-tripod-progress-text');
        if (textEl) App.setTrustedHTML(textEl, done + ' / ' + total + ' items completed');

        var pctEl = document.getElementById('ml-tripod-progress-pct');
        if (pctEl) App.setTrustedHTML(pctEl, pct + '%');

        var barEl = document.getElementById('ml-tripod-progress-bar');
        if (barEl) barEl.style.width = pct + '%';
    }

    function copyTripod() {
        var lines = ['TRIPOD+AI Checklist', '='.repeat(40), ''];
        var lastSection = '';
        for (var i = 0; i < tripodItems.length; i++) {
            var item = tripodItems[i];
            if (item.section !== lastSection) {
                if (lastSection !== '') lines.push('');
                lines.push('--- ' + item.section + ' ---');
                lastSection = item.section;
            }
            var mark = tripodState[item.num] ? '[X]' : '[ ]';
            lines.push(mark + ' ' + item.num + '. ' + item.text);
        }
        var done = 0;
        for (var j = 0; j < tripodItems.length; j++) {
            if (tripodState[tripodItems[j].num]) done++;
        }
        lines.push('');
        lines.push('Progress: ' + done + '/' + tripodItems.length + ' (' + Math.round((done / tripodItems.length) * 100) + '%)');
        lines.push('Generated: ' + new Date().toLocaleDateString());
        Export.copyText(lines.join('\n'));
    }

    function resetTripod() {
        tripodState = {};
        var checkboxes = document.querySelectorAll('[id^="ml-tripod-tripod_"]');
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
        updateTripodProgress();
    }

    /* ------------------------------------------------------------------ */
    /*  Feature selection toggle                                           */
    /* ------------------------------------------------------------------ */
    function toggleFeatureSel(idx) {
        var detail = document.getElementById('ml-fs-detail-' + idx);
        var arrow = document.getElementById('ml-fs-arrow-' + idx);
        if (detail) {
            detail.classList.toggle('hidden');
            if (arrow) arrow.style.transform = detail.classList.contains('hidden') ? '' : 'rotate(180deg)';
        }
    }

    /* ------------------------------------------------------------------ */
    /*  Calibration topic toggle                                           */
    /* ------------------------------------------------------------------ */
    function toggleCalib(idx) {
        var detail = document.getElementById('ml-calib-detail-' + idx);
        var arrow = document.getElementById('ml-calib-arrow-' + idx);
        if (detail) {
            detail.classList.toggle('hidden');
            if (arrow) arrow.style.transform = detail.classList.contains('hidden') ? '' : 'rotate(180deg)';
        }
    }

    /* ------------------------------------------------------------------ */
    /*  Model Validation Calculator                                        */
    /* ------------------------------------------------------------------ */
    function calcValidation() {
        var method = document.getElementById('ml-val-method').value;
        var n = parseInt(document.getElementById('ml-val-n').value) || 500;
        var events = parseInt(document.getElementById('ml-val-events').value) || 75;
        var predictors = parseInt(document.getElementById('ml-val-predictors').value) || 10;
        var k = parseInt(document.getElementById('ml-val-k').value) || 10;
        var apparentAUC = parseFloat(document.getElementById('ml-val-auc').value) || 0.82;
        var trainFrac = parseFloat(document.getElementById('ml-val-trainfrac').value) || 0.7;

        var epv = events / predictors;
        var prevalence = events / n;

        var html = '<div class="result-panel">';
        html += '<div class="card-subtitle">Validation Strategy Assessment</div>';

        // EPV check
        var epvColor = epv >= 20 ? 'var(--success)' : epv >= 10 ? 'var(--warning)' : 'var(--danger)';
        var epvAdvice = epv >= 20 ? 'Adequate EPV for most methods.' : epv >= 10 ? 'Borderline EPV -- use penalized methods.' : 'Low EPV -- high overfitting risk. Reduce predictors or increase events.';

        html += '<div class="result-grid mt-1">';
        html += '<div class="result-item"><div class="result-item-value" style="color:' + epvColor + '">' + epv.toFixed(1) + '</div><div class="result-item-label">Events Per Variable</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + (prevalence * 100).toFixed(1) + '%</div><div class="result-item-label">Event Rate</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + n + '</div><div class="result-item-label">Total N</div></div>';
        html += '</div>';

        html += '<div style="padding:0.5rem;background:var(--bg-elevated);border-radius:4px;margin:0.5rem 0;font-size:0.85rem;color:' + epvColor + '"><strong>EPV Assessment:</strong> ' + epvAdvice + '</div>';

        if (method === 'kfold') {
            var foldSize = Math.floor(n / k);
            var trainSize = n - foldSize;
            var optimismEst = (predictors / events) * 0.5;
            var correctedAUC = Math.max(0.5, apparentAUC - optimismEst * 0.3);

            html += '<div class="card-subtitle" style="font-weight:600;">k-Fold Cross-Validation (k=' + k + ')</div>';
            html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Parameter</th><th>Value</th></tr></thead><tbody>';
            html += '<tr><td>Folds</td><td>' + k + '</td></tr>';
            html += '<tr><td>Samples per fold</td><td>~' + foldSize + '</td></tr>';
            html += '<tr><td>Training set per fold</td><td>~' + trainSize + '</td></tr>';
            html += '<tr><td>Events per fold (test)</td><td>~' + Math.round(events / k) + '</td></tr>';
            html += '<tr><td>Apparent AUC</td><td>' + apparentAUC.toFixed(3) + '</td></tr>';
            html += '<tr><td>Estimated optimism</td><td>' + (optimismEst * 0.3).toFixed(3) + '</td></tr>';
            html += '<tr><td>Expected CV AUC</td><td>~' + correctedAUC.toFixed(3) + '</td></tr>';
            html += '</tbody></table></div>';

            var kAdvice = k === 10 ? '10-fold CV is the standard choice.' : k === 5 ? '5-fold is acceptable but 10-fold generally preferred.' : k > 15 ? 'High k gives low bias but high variance. Consider k=10.' : 'Non-standard k value. 5 or 10 are most common.';
            html += '<div style="font-size:0.85rem;margin-top:0.5rem;"><strong>Recommendation:</strong> ' + kAdvice + ' Repeat CV 10-100 times for stable estimates. Use stratified k-fold for imbalanced outcomes.</div>';

        } else if (method === 'bootstrap') {
            var b632AUC = 0.368 * apparentAUC + 0.632 * Math.max(0.5, apparentAUC - (predictors / events) * 0.25);
            html += '<div class="card-subtitle" style="font-weight:600;">Bootstrap Validation (.632+)</div>';
            html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Parameter</th><th>Value</th></tr></thead><tbody>';
            html += '<tr><td>Bootstrap resamples (B)</td><td>' + k + '</td></tr>';
            html += '<tr><td>Apparent AUC</td><td>' + apparentAUC.toFixed(3) + '</td></tr>';
            html += '<tr><td>Estimated .632 AUC</td><td>~' + b632AUC.toFixed(3) + '</td></tr>';
            html += '<tr><td>OOB sample fraction</td><td>~36.8%</td></tr>';
            html += '<tr><td>OOB samples per iteration</td><td>~' + Math.round(n * 0.368) + '</td></tr>';
            html += '</tbody></table></div>';

            var bAdvice = k >= 200 ? 'Adequate number of bootstrap resamples.' : 'Increase to at least 200 resamples for stable estimates.';
            html += '<div style="font-size:0.85rem;margin-top:0.5rem;"><strong>Recommendation:</strong> ' + bAdvice + ' .632+ is recommended by Harrell for clinical prediction models. It corrects for optimism better than apparent performance.</div>';

        } else {
            var trainN = Math.round(n * trainFrac);
            var testN = n - trainN;
            var trainEvents = Math.round(events * trainFrac);
            var testEvents = events - trainEvents;
            var testEPV = testEvents / predictors;

            html += '<div class="card-subtitle" style="font-weight:600;">Train/Test Split (' + (trainFrac * 100).toFixed(0) + '/' + ((1 - trainFrac) * 100).toFixed(0) + ')</div>';
            html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Parameter</th><th>Training</th><th>Test</th></tr></thead><tbody>';
            html += '<tr><td>Sample size</td><td>' + trainN + '</td><td>' + testN + '</td></tr>';
            html += '<tr><td>Expected events</td><td>~' + trainEvents + '</td><td>~' + testEvents + '</td></tr>';
            html += '<tr><td>EPV</td><td>' + (trainEvents / predictors).toFixed(1) + '</td><td>' + testEPV.toFixed(1) + '</td></tr>';
            html += '</tbody></table></div>';

            var splitAdvice = testEvents < 50 ? 'Warning: Few test events (' + testEvents + '). Performance estimates will be unstable. Consider cross-validation instead.' : 'Test set has reasonable number of events. Still consider pairing with cross-validation.';
            html += '<div style="font-size:0.85rem;margin-top:0.5rem;color:' + (testEvents < 50 ? 'var(--warning)' : 'var(--text)') + '"><strong>Assessment:</strong> ' + splitAdvice + '</div>';
        }

        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.mlPredictionValidation({method:&quot;' + method + '&quot;,n:' + n + ',events:' + events + ',predictors:' + predictors + ',k:' + k + ',trainFrac:' + trainFrac + '}), &quot;Model Validation Strategy&quot;)">'
            + '&#129513; Generate R Script</button></div>';
        html += '</div>';
        var el = document.getElementById('ml-val-results');
        if (el) App.setTrustedHTML(el, html);
    }

    /* ------------------------------------------------------------------ */
    /*  Model Comparison                                                   */
    /* ------------------------------------------------------------------ */
    function compareModels() {
        var models = [];
        for (var i = 0; i < 3; i++) {
            var name = document.getElementById('ml-comp-name-' + i);
            var auc = document.getElementById('ml-comp-auc-' + i);
            if (name && name.value.trim()) {
                models.push({
                    name: name.value.trim(),
                    auc: parseFloat(auc.value) || 0,
                    brier: parseFloat(document.getElementById('ml-comp-brier-' + i).value) || 0,
                    slope: parseFloat(document.getElementById('ml-comp-slope-' + i).value) || 0,
                    sens: parseFloat(document.getElementById('ml-comp-sens-' + i).value) || 0,
                    spec: parseFloat(document.getElementById('ml-comp-spec-' + i).value) || 0
                });
            }
        }
        if (models.length === 0) return;

        var bestAUC = 0, bestBrier = 1, bestSlope = 2;
        for (var j = 0; j < models.length; j++) {
            if (models[j].auc > bestAUC) bestAUC = models[j].auc;
            if (models[j].brier < bestBrier) bestBrier = models[j].brier;
            if (Math.abs(models[j].slope - 1) < Math.abs(bestSlope - 1)) bestSlope = models[j].slope;
        }

        var html = '<div class="result-panel">';
        html += '<div class="card-subtitle">Model Comparison Summary</div>';
        html += '<div class="table-container"><table class="data-table">';
        html += '<thead><tr><th>Model</th><th>AUC</th><th>Brier</th><th>Cal. Slope</th><th>Sensitivity</th><th>Specificity</th><th>Youden J</th></tr></thead><tbody>';

        for (var m = 0; m < models.length; m++) {
            var md = models[m];
            var youden = md.sens + md.spec - 1;
            var aucStyle = md.auc === bestAUC ? 'font-weight:700;color:var(--success)' : '';
            var brierStyle = md.brier === bestBrier ? 'font-weight:700;color:var(--success)' : '';
            var slopeStyle = md.slope === bestSlope ? 'font-weight:700;color:var(--success)' : '';
            html += '<tr>';
            html += '<td><strong>' + md.name + '</strong></td>';
            html += '<td class="num" style="' + aucStyle + '">' + md.auc.toFixed(3) + '</td>';
            html += '<td class="num" style="' + brierStyle + '">' + md.brier.toFixed(3) + '</td>';
            html += '<td class="num" style="' + slopeStyle + '">' + md.slope.toFixed(3) + '</td>';
            html += '<td class="num">' + md.sens.toFixed(3) + '</td>';
            html += '<td class="num">' + md.spec.toFixed(3) + '</td>';
            html += '<td class="num">' + youden.toFixed(3) + '</td>';
            html += '</tr>';
        }
        html += '</tbody></table></div>';

        // Interpretation
        html += '<div style="margin-top:0.8rem;font-size:0.85rem;line-height:1.7;">';
        html += '<strong>Interpretation Guide:</strong><br>';
        html += '<strong>AUC:</strong> Higher is better (0.5=random, 0.7-0.8=acceptable, 0.8-0.9=excellent, >0.9=outstanding).<br>';
        html += '<strong>Brier Score:</strong> Lower is better (combines discrimination + calibration). Max useful Brier = prevalence * (1-prevalence).<br>';
        html += '<strong>Calibration Slope:</strong> Closer to 1.0 is better. &lt;1 suggests overfitting, &gt;1 suggests underfitting.<br>';
        html += '<strong>Youden J:</strong> Sensitivity + Specificity - 1. Higher indicates better classification at the chosen threshold.';
        html += '</div>';
        html += '</div>';

        var el = document.getElementById('ml-comp-results');
        if (el) App.setTrustedHTML(el, html);
    }

    function copyComparison() {
        var text = 'MODEL COMPARISON\n' + '='.repeat(70) + '\n';
        text += 'Model'.padEnd(25) + 'AUC'.padEnd(10) + 'Brier'.padEnd(10) + 'Cal.Slope'.padEnd(12) + 'Sens'.padEnd(8) + 'Spec\n';
        text += '-'.repeat(70) + '\n';
        for (var i = 0; i < 3; i++) {
            var name = document.getElementById('ml-comp-name-' + i);
            if (name && name.value.trim()) {
                text += name.value.trim().padEnd(25);
                text += (document.getElementById('ml-comp-auc-' + i).value || '--').padEnd(10);
                text += (document.getElementById('ml-comp-brier-' + i).value || '--').padEnd(10);
                text += (document.getElementById('ml-comp-slope-' + i).value || '--').padEnd(12);
                text += (document.getElementById('ml-comp-sens-' + i).value || '--').padEnd(8);
                text += (document.getElementById('ml-comp-spec-' + i).value || '--') + '\n';
            }
        }
        Export.copyText(text);
    }

    /* ------------------------------------------------------------------ */
    /*  NRI / IDI Calculator                                               */
    /* ------------------------------------------------------------------ */
    function calcNRI() {
        var eventUp = parseInt(document.getElementById('ml-nri-event-up').value) || 0;
        var eventDown = parseInt(document.getElementById('ml-nri-event-down').value) || 0;
        var totalEvents = parseInt(document.getElementById('ml-nri-total-events').value) || 1;
        var noneventUp = parseInt(document.getElementById('ml-nri-nonevent-up').value) || 0;
        var noneventDown = parseInt(document.getElementById('ml-nri-nonevent-down').value) || 0;
        var totalNonevents = parseInt(document.getElementById('ml-nri-total-nonevents').value) || 1;

        // NRI components
        var nriEvent = (eventUp - eventDown) / totalEvents;
        var nriNonevent = (noneventDown - noneventUp) / totalNonevents;
        var nri = nriEvent + nriNonevent;

        // Standard errors
        var seNriEvent = Math.sqrt((eventUp + eventDown) / (totalEvents * totalEvents));
        var seNriNonevent = Math.sqrt((noneventUp + noneventDown) / (totalNonevents * totalNonevents));
        var seNri = Math.sqrt(seNriEvent * seNriEvent + seNriNonevent * seNriNonevent);
        var zNri = seNri > 0 ? nri / seNri : 0;
        var pNri = seNri > 0 ? 2 * (1 - 0.5 * (1 + erf(Math.abs(zNri) / Math.sqrt(2)))) : 1;

        // IDI
        var oldEventProb = parseFloat(document.getElementById('ml-idi-old-event').value) || 0;
        var newEventProb = parseFloat(document.getElementById('ml-idi-new-event').value) || 0;
        var oldNoneventProb = parseFloat(document.getElementById('ml-idi-old-nonevent').value) || 0;
        var newNoneventProb = parseFloat(document.getElementById('ml-idi-new-nonevent').value) || 0;

        var isOld = oldEventProb - oldNoneventProb;
        var isNew = newEventProb - newNoneventProb;
        var idi = isNew - isOld;

        var html = '<div class="result-panel">';
        html += '<div class="card-subtitle">NRI &amp; IDI Results</div>';

        html += '<div class="result-grid mt-1">';
        html += '<div class="result-item"><div class="result-item-value" style="color:' + (nri > 0 ? 'var(--success)' : 'var(--danger)') + '">' + (nri * 100).toFixed(1) + '%</div><div class="result-item-label">Overall NRI</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + (nriEvent * 100).toFixed(1) + '%</div><div class="result-item-label">NRI (Events)</div></div>';
        html += '<div class="result-item"><div class="result-item-value">' + (nriNonevent * 100).toFixed(1) + '%</div><div class="result-item-label">NRI (Non-Events)</div></div>';
        html += '<div class="result-item"><div class="result-item-value" style="color:' + (idi > 0 ? 'var(--success)' : 'var(--danger)') + '">' + (idi * 100).toFixed(2) + '%</div><div class="result-item-label">IDI</div></div>';
        html += '</div>';

        html += '<div class="card-subtitle mt-2" style="font-weight:600;">NRI Reclassification Table</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Component</th><th>Reclassified Up</th><th>Reclassified Down</th><th>Net %</th></tr></thead><tbody>';
        html += '<tr><td>Events (n=' + totalEvents + ')</td><td class="num">' + eventUp + '</td><td class="num">' + eventDown + '</td><td class="num" style="color:' + (nriEvent >= 0 ? 'var(--success)' : 'var(--danger)') + '">' + (nriEvent * 100).toFixed(1) + '%</td></tr>';
        html += '<tr><td>Non-Events (n=' + totalNonevents + ')</td><td class="num">' + noneventUp + '</td><td class="num">' + noneventDown + '</td><td class="num" style="color:' + (nriNonevent >= 0 ? 'var(--success)' : 'var(--danger)') + '">' + (nriNonevent * 100).toFixed(1) + '%</td></tr>';
        html += '<tr style="font-weight:700;border-top:2px solid var(--border);"><td>Overall NRI</td><td colspan="2"></td><td class="num">' + (nri * 100).toFixed(1) + '%</td></tr>';
        html += '</tbody></table></div>';

        html += '<div style="font-size:0.85rem;margin-top:0.5rem;"><strong>NRI z-statistic:</strong> ' + zNri.toFixed(3) + ' (p ' + (pNri < 0.001 ? '< 0.001' : '= ' + pNri.toFixed(3)) + ')</div>';

        html += '<div class="card-subtitle mt-2" style="font-weight:600;">IDI Components</div>';
        html += '<div class="table-scroll-wrap"><table class="data-table"><thead><tr><th>Measure</th><th>Old Model</th><th>New Model</th><th>Difference</th></tr></thead><tbody>';
        html += '<tr><td>Mean predicted prob (events)</td><td class="num">' + oldEventProb.toFixed(3) + '</td><td class="num">' + newEventProb.toFixed(3) + '</td><td class="num">' + (newEventProb - oldEventProb).toFixed(3) + '</td></tr>';
        html += '<tr><td>Mean predicted prob (non-events)</td><td class="num">' + oldNoneventProb.toFixed(3) + '</td><td class="num">' + newNoneventProb.toFixed(3) + '</td><td class="num">' + (newNoneventProb - oldNoneventProb).toFixed(3) + '</td></tr>';
        html += '<tr><td>Integrated Sensitivity (IS)</td><td class="num">' + isOld.toFixed(3) + '</td><td class="num">' + isNew.toFixed(3) + '</td><td class="num" style="font-weight:700;color:' + (idi > 0 ? 'var(--success)' : 'var(--danger)') + '">' + idi.toFixed(3) + '</td></tr>';
        html += '</tbody></table></div>';

        html += '<div style="margin-top:0.8rem;font-size:0.85rem;line-height:1.7;">';
        html += '<strong>Interpretation:</strong><br>';
        html += '<strong>NRI > 0:</strong> New model correctly reclassifies more subjects. Report event and non-event components separately.<br>';
        html += '<strong>IDI > 0:</strong> New model has better discrimination slope (wider separation of predicted probabilities between events and non-events).<br>';
        html += '<strong>Always report both NRI and IDI alongside AUC comparison.</strong>';
        html += '</div>';
        html += '<div class="btn-group mt-2">'
            + '<button class="btn btn-xs r-script-btn" '
            + 'onclick="RGenerator.showScript(RGenerator.mlPredictionNRI({eventUp:' + eventUp + ',eventDown:' + eventDown + ',totalEvents:' + totalEvents + ',noneventUp:' + noneventUp + ',noneventDown:' + noneventDown + ',totalNonevents:' + totalNonevents + ',oldEventProb:' + oldEventProb + ',newEventProb:' + newEventProb + ',oldNoneventProb:' + oldNoneventProb + ',newNoneventProb:' + newNoneventProb + '}), &quot;NRI &amp; IDI Analysis&quot;)">'
            + '&#129513; Generate R Script</button></div>';

        html += '</div>';

        var el = document.getElementById('ml-nri-results');
        if (el) App.setTrustedHTML(el, html);
    }

    /* simple erf approximation for p-value */
    function erf(x) {
        var a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
        var sign = x < 0 ? -1 : 1;
        x = Math.abs(x);
        var t = 1.0 / (1.0 + p * x);
        var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        return sign * y;
    }

    /* ------------------------------------------------------------------ */
    /*  CPM Checklist Progress                                             */
    /* ------------------------------------------------------------------ */
    function updateCPMProgress() {
        var checkboxes = document.querySelectorAll('[id^="ml-cpm-"]');
        var total = 0;
        var done = 0;
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type === 'checkbox') {
                total++;
                if (checkboxes[i].checked) done++;
            }
        }
        var pct = total > 0 ? Math.round((done / total) * 100) : 0;
        var textEl = document.getElementById('ml-cpm-progress-text');
        if (textEl) App.setTrustedHTML(textEl, done + ' / ' + total + ' items completed');
        var pctEl = document.getElementById('ml-cpm-progress-pct');
        if (pctEl) App.setTrustedHTML(pctEl, pct + '%');
        var barEl = document.getElementById('ml-cpm-progress-bar');
        if (barEl) barEl.style.width = pct + '%';
    }

    function copyCPMChecklist() {
        var lines = ['Clinical Prediction Model Development Checklist', '='.repeat(50), ''];
        var checkboxes = document.querySelectorAll('[id^="ml-cpm-"]');
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type === 'checkbox') {
                var mark = checkboxes[i].checked ? '[X]' : '[ ]';
                var label = checkboxes[i].parentElement.querySelector('span');
                if (label) lines.push(mark + ' ' + label.textContent);
            }
        }
        lines.push('');
        lines.push('Generated: ' + new Date().toLocaleDateString());
        Export.copyText(lines.join('\n'));
    }

    /* ------------------------------------------------------------------ */
    /*  Register                                                           */
    /* ------------------------------------------------------------------ */
    App.registerModule(MODULE_ID, { render: render });
    window.MLPrediction = {
        recommend: recommend,
        toggleAlgDetail: toggleAlgDetail,
        toggleValidation: toggleValidation,
        togglePitfall: togglePitfall,
        toggleTripod: toggleTripod,
        copyTripod: copyTripod,
        resetTripod: resetTripod,
        toggleFeatureSel: toggleFeatureSel,
        toggleCalib: toggleCalib,
        calcValidation: calcValidation,
        compareModels: compareModels,
        copyComparison: copyComparison,
        calcNRI: calcNRI,
        updateCPMProgress: updateCPMProgress,
        copyCPMChecklist: copyCPMChecklist
    };
})();
