const fs = require('fs');
const path = require('path');

describe('Causal Inference Module', () => {
    beforeEach(() => {
        // Setup simple DOM
        document.body.innerHTML = '<div id="container"></div>';

        // Mock global App, Export, Statistics, Charts objects if needed
        window.App = {
            createModuleLayout: jest.fn((title, desc) => `<div class="module-title">${title}</div><div class="module-desc">${desc}</div>`),
            setTrustedHTML: jest.fn((container, html) => {
                if (container) container.innerHTML = html;
            }),
            autoSaveInputs: jest.fn(),
            registerModule: jest.fn()
        };
        window.Export = {
            showToast: jest.fn(),
            copyText: jest.fn()
        };
        window.Statistics = {
            formatPValue: jest.fn(val => `<p=${val}>`)
        };
        window.Charts = {
            DAGDiagram: jest.fn()
        };

        // Load the causal-inference.js file
        const causalInferencePath = path.resolve(__dirname, '../../js/modules/causal-inference.js');
        const code = fs.readFileSync(causalInferencePath, 'utf8');
        // Clear old module state if any (using strict mode but we run eval again)
        eval(code);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('API Exposure', () => {
        test('module exposes correct API', () => {
            expect(window.CausalInference).toBeDefined();
            expect(typeof window.CausalInference.render).toBe('function');
            expect(typeof window.CausalInference.assessBH).toBe('function');
            expect(typeof window.CausalInference.exportBH).toBe('function');
            expect(typeof window.CausalInference.resetBH).toBe('function');
            expect(typeof window.CausalInference.addNode).toBe('function');
            expect(typeof window.CausalInference.addEdge).toBe('function');
            expect(typeof window.CausalInference.clearDAG).toBe('function');
            expect(typeof window.CausalInference.loadExampleDAG).toBe('function');
            expect(typeof window.CausalInference.loadTemplate).toBe('function');
            expect(typeof window.CausalInference.exportDAG).toBe('function');
            expect(typeof window.CausalInference.calcCounterfactual).toBe('function');
            expect(typeof window.CausalInference.exportMethods).toBe('function');
            expect(typeof window.CausalInference.calcDiD).toBe('function');
            expect(typeof window.CausalInference.exportTargetTrial).toBe('function');
        });
    });

    describe('Render', () => {
        test('render method populates container and calls App methods', () => {
            const container = document.getElementById('container');
            window.CausalInference.render(container);
            expect(window.App.createModuleLayout).toHaveBeenCalledWith(
                'Causal Inference',
                expect.any(String)
            );
            expect(window.App.setTrustedHTML).toHaveBeenCalled();
            expect(window.App.autoSaveInputs).toHaveBeenCalledWith(container, 'causal-inference');
        });
    });

    describe('Counterfactual Framework', () => {
        beforeEach(() => {
            window.CausalInference.render(document.getElementById('container'));
        });

        test('calcCounterfactual calculations for positive ACE', () => {
            document.getElementById('cf-y0').value = '0.10';
            document.getElementById('cf-y1').value = '0.20';
            window.CausalInference.calcCounterfactual();
            const resultsHtml = document.getElementById('cf-results').innerHTML;
            expect(resultsHtml).toContain('10.0%');
            expect(resultsHtml).toContain('var(--danger)'); // Positive ace (harm) usually danger color based on logic
        });

        test('calcCounterfactual calculations for negative ACE', () => {
            document.getElementById('cf-y0').value = '0.20';
            document.getElementById('cf-y1').value = '0.10';
            window.CausalInference.calcCounterfactual();
            const resultsHtml = document.getElementById('cf-results').innerHTML;
            expect(resultsHtml).toContain('-10.0%');
            expect(resultsHtml).toContain('var(--success)'); // Negative ace
        });

        test('calcCounterfactual handles invalid inputs', () => {
            document.getElementById('cf-y0').value = 'invalid';
            document.getElementById('cf-y1').value = '0.10';
            window.CausalInference.calcCounterfactual();
            expect(document.getElementById('cf-results').innerHTML).toBe('');
        });
    });

    describe('Difference-in-Differences', () => {
        beforeEach(() => {
            window.CausalInference.render(document.getElementById('container'));
        });

        test('calcDiD calculates correctly', () => {
            document.getElementById('did-t-pre').value = '10';
            document.getElementById('did-t-post').value = '20';
            document.getElementById('did-c-pre').value = '15';
            document.getElementById('did-c-post').value = '20';
            window.CausalInference.calcDiD();
            const resultsHtml = document.getElementById('did-results').innerHTML;
            expect(resultsHtml).toContain('5.00'); // (20 - 10) - (20 - 15) = 10 - 5 = 5
        });

        test('calcDiD handles invalid inputs', () => {
            document.getElementById('did-t-pre').value = '10';
            document.getElementById('did-t-post').value = '';
            document.getElementById('did-c-pre').value = '15';
            document.getElementById('did-c-post').value = '20';
            window.CausalInference.calcDiD();
            expect(document.getElementById('did-results').innerHTML).toBe('');
        });
    });

    describe('Bradford Hill Criteria', () => {
        beforeEach(() => {
            window.CausalInference.render(document.getElementById('container'));
        });

        test('assessBH handles all empty values', () => {
            window.CausalInference.assessBH();
            const resultsHtml = document.getElementById('bh-results').innerHTML;
            expect(resultsHtml).toContain('No criteria have been assessed yet.');
        });

        test('assessBH evaluates Strong inputs properly', () => {
            const criteriaNames = ['strength', 'consistency', 'specificity', 'temporality', 'gradient', 'plausibility'];
            criteriaNames.forEach(c => {
                const inputs = document.querySelectorAll(`input[name="bh-${c}"]`);
                inputs.forEach(input => {
                    if (input.value === 'Strong') input.checked = true;
                });
            });

            document.getElementById('bh-exposure').value = 'Smoking';
            document.getElementById('bh-outcome').value = 'Cancer';

            window.CausalInference.assessBH();
            const resultsHtml = document.getElementById('bh-results').innerHTML;
            expect(resultsHtml).toContain('Strong support for a causal relationship between Smoking and Cancer.');
        });

        test('assessBH evaluates Moderate inputs properly', () => {
            const criteriaNames = ['strength', 'consistency', 'specificity', 'temporality'];
            criteriaNames.forEach(c => {
                const inputs = document.querySelectorAll(`input[name="bh-${c}"]`);
                inputs.forEach(input => {
                    if (input.value === 'Moderate') input.checked = true;
                });
            });
            window.CausalInference.assessBH();
            const resultsHtml = document.getElementById('bh-results').innerHTML;
            expect(resultsHtml).toContain('Moderate support for a causal relationship');
            // Check temporality warning since temporality is Moderate, not Weak/Unassessed
            expect(resultsHtml).not.toContain('Note: Temporality is weak or unassessed');
        });

        test('assessBH evaluates weak temporality warning', () => {
            const inputs = document.querySelectorAll('input[name="bh-temporality"]');
            inputs.forEach(input => {
                if (input.value === 'Weak') input.checked = true;
            });
            window.CausalInference.assessBH();
            const resultsHtml = document.getElementById('bh-results').innerHTML;
            expect(resultsHtml).toContain('Temporality is weak or unassessed');
        });

        test('exportBH copies text to clipboard', () => {
            document.getElementById('bh-exposure').value = 'A';
            document.getElementById('bh-outcome').value = 'B';
            window.CausalInference.exportBH();
            expect(window.Export.copyText).toHaveBeenCalled();
            const exportText = window.Export.copyText.mock.calls[0][0];
            expect(exportText).toContain('Exposure: A');
            expect(exportText).toContain('Outcome: B');
            expect(exportText).toContain('Strength: Not assessed');
        });

        test('resetBH clears inputs', () => {
            const inputs = document.querySelectorAll('input[name="bh-strength"]');
            inputs[0].checked = true;
            document.getElementById('bh-exposure').value = 'A';
            document.getElementById('bh-outcome').value = 'B';

            window.CausalInference.resetBH();

            expect(document.getElementById('bh-exposure').value).toBe('');
            expect(document.getElementById('bh-outcome').value).toBe('');
            expect(inputs[0].checked).toBe(false);
            expect(document.getElementById('bh-results').innerHTML).toBe('');
        });
    });

    describe('DAG Builder', () => {
        beforeEach(() => {
            window.CausalInference.render(document.getElementById('container'));
            window.CausalInference.clearDAG(); // clear nodes to isolate tests
        });

        test('addNode adds a node successfully', () => {
            document.getElementById('ci-node-name').value = 'Exposure';
            document.getElementById('ci-node-type').value = 'exposure';
            window.CausalInference.addNode();

            const edgeFromSelect = document.getElementById('ci-edge-from');
            expect(edgeFromSelect.innerHTML).toContain('Exposure');
        });

        test('addNode prevents empty name', () => {
            document.getElementById('ci-node-name').value = '';
            window.CausalInference.addNode();
            expect(window.Export.showToast).toHaveBeenCalledWith('Enter a variable name', 'error');
        });

        test('addNode prevents duplicate name', () => {
            document.getElementById('ci-node-name').value = 'A';
            window.CausalInference.addNode();
            document.getElementById('ci-node-name').value = 'A';
            window.CausalInference.addNode();
            expect(window.Export.showToast).toHaveBeenCalledWith('Variable already exists', 'error');
        });

        test('addEdge prevents missing from/to', () => {
            document.getElementById('ci-node-name').value = 'A';
            window.CausalInference.addNode();

            document.getElementById('ci-edge-from').value = '';
            document.getElementById('ci-edge-to').value = '';
            window.CausalInference.addEdge();
            expect(window.Export.showToast).toHaveBeenCalledWith('Select from and to nodes', 'error');
        });

        test('addEdge prevents self-linking', () => {
            document.getElementById('ci-node-name').value = 'A';
            window.CausalInference.addNode();

            const edgeFromSelect = document.getElementById('ci-edge-from');
            const edgeToSelect = document.getElementById('ci-edge-to');
            const optionValue = edgeFromSelect.options[1].value; // First added node

            edgeFromSelect.value = optionValue;
            edgeToSelect.value = optionValue;
            window.CausalInference.addEdge();
            expect(window.Export.showToast).toHaveBeenCalledWith('Cannot link node to itself', 'error');
        });

        test('loadTemplate sets predefined DAGs', () => {
            window.CausalInference.loadTemplate('confounding');
            expect(window.Charts.DAGDiagram).toHaveBeenCalled();
            const dagInfoHtml = document.getElementById('ci-dag-info').innerHTML;
            expect(dagInfoHtml).toContain('Confounder');
            expect(dagInfoHtml).toContain('Adjust For');
        });

        test('loadExampleDAG loads predefined lipid example', () => {
            window.CausalInference.loadExampleDAG();
            expect(window.Charts.DAGDiagram).toHaveBeenCalled();
            const dagInfoHtml = document.getElementById('ci-dag-info').innerHTML;
            expect(dagInfoHtml).toContain('Statin Use');
            expect(dagInfoHtml).toContain('Collider bias detected');
        });

        test('exportDAG copies text to clipboard', () => {
            window.CausalInference.loadTemplate('confounding');
            window.CausalInference.exportDAG();
            expect(window.Export.copyText).toHaveBeenCalled();
            const exportText = window.Export.copyText.mock.calls[0][0];
            expect(exportText).toContain('Exposure -> Outcome');
        });
    });

    describe('Export Methods & Target Trial', () => {
        beforeEach(() => {
            window.CausalInference.render(document.getElementById('container'));
        });

        test('exportMethods calls Export.copyText', () => {
            window.CausalInference.exportMethods();
            expect(window.Export.copyText).toHaveBeenCalled();
            expect(window.Export.showToast).toHaveBeenCalledWith('Methods summary copied');
        });

        test('exportTargetTrial copies summary text', () => {
            document.getElementById('tte-summary').value = 'My Target Trial Protocol';
            window.CausalInference.exportTargetTrial();
            expect(window.Export.copyText).toHaveBeenCalled();
            const exportText = window.Export.copyText.mock.calls[0][0];
            expect(exportText).toContain('My Target Trial Protocol');
            expect(window.Export.showToast).toHaveBeenCalledWith('Protocol copied');
        });
    });
});
