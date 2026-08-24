const { TextEncoder, TextDecoder } = require("util");
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { JSDOM } = require("jsdom");


// Mock the App and Export objects and other globals
global.registeredModules = {};

global.App = {
    createModuleLayout: function(title, subtitle) { return '<div class="module-layout"><h1>' + title + '</h1><p>' + subtitle + '</p></div>'; },
    tooltip: function(text) { return '<span class="tooltip" title="' + text + '">?</span>'; },
    setTrustedHTML: function(el, html) { el.innerHTML = html; },
    registerModule: function(id, moduleObj) { global.registeredModules[id] = moduleObj; },
    autoSaveInputs: function(container, id) {}
};

global.Export = {
    showToast: function(msg, type) {
        global.lastToast = { msg, type };
    }
};

global.RGenerator = {
    showScript: function(script, title) { return; },
    biostatPvalAdjust: function(opts) { return "R script string"; }
};

// Set up a clean DOM function
function setupDOM(htmlStr) {
    if (typeof document !== 'undefined') {
        document.body.innerHTML = htmlStr;
        global.lastToast = null;
        if (!window.BiostatRef) {
            require('../modules/biostats-reference.js');
        }
    } else {
        const dom = new JSDOM('<!doctype html><html><body>' + htmlStr + '</body></html>');
        global.document = dom.window.document;
        global.window = dom.window;
        global.lastToast = null;
        delete require.cache[require.resolve('../modules/biostats-reference.js')];
        require('../modules/biostats-reference.js');
    }
}

// Helper to run tests
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

// Test suite for biostats-reference.js

function testAdjustPvalsValid() {
    setupDOM('<div id="br-pval-results"></div><input id="br_pvals" value="0.01, 0.04, 0.05, 0.2"><input id="br_alpha" value="0.05">');

    window.BiostatRef.adjustPvals();

    const resultsHtml = document.getElementById('br-pval-results').innerHTML;
    assert(resultsHtml.includes("Adjusted P-Values"), "Results HTML should contain table header");

    // Bonferroni for 0.01, 0.04, 0.05, 0.2 with m=4
    assert(resultsHtml.includes("0.0400"), "Bonferroni first value should be 0.04");
    assert(resultsHtml.includes("0.1600"), "Bonferroni second value should be 0.16");
    assert(resultsHtml.includes("0.2000"), "Bonferroni third value should be 0.2");
    assert(resultsHtml.includes("0.8000"), "Bonferroni fourth value should be 0.8");

    // Test BH logic output is present
    assert(resultsHtml.includes("0.0667"), "BH FDR should contain 0.0667");

    console.log("✅ testAdjustPvalsValid passed!");
}

function testAdjustPvalsEmpty() {
    setupDOM('<div id="br-pval-results"></div><input id="br_pvals" value=""><input id="br_alpha" value="0.05">');

    window.BiostatRef.adjustPvals();
    assert(global.lastToast && global.lastToast.msg === 'Enter comma-separated p-values.', "Should show toast for empty input");

    console.log("✅ testAdjustPvalsEmpty passed!");
}

function testAdjustPvalsInvalid() {
    setupDOM('<div id="br-pval-results"></div><input id="br_pvals" value="foo, bar"><input id="br_alpha" value="0.05">');

    window.BiostatRef.adjustPvals();
    assert(global.lastToast && global.lastToast.msg === 'No valid p-values entered.', "Should show toast for invalid input");

    console.log("✅ testAdjustPvalsInvalid passed!");
}

function testCalcCIValid() {
    setupDOM(`
        <div id="br-ci-results"></div>
        <input id="br_ci_x" value="20">
        <input id="br_ci_n" value="100">
        <input id="br_ci_level" value="0.95">
    `);

    // Mock jStat for normal distribution logic
    global.jStat = {
        normal: {
            inv: function(p, mean, sd) { return 1.96; } // approximation for 95%
        }
    };

    window.BiostatRef.calcCI();

    const resultsHtml = document.getElementById('br-ci-results').innerHTML;
    assert(resultsHtml.includes("Wald"), "Should include Wald calculation");
    assert(resultsHtml.includes("Wilson"), "Should include Wilson calculation");

    // p = 20/100 = 0.2
    assert(resultsHtml.includes("0.2000"), "Should contain the estimate 0.2");
    // Wald CI
    assert(resultsHtml.includes("0.1216") || resultsHtml.includes("0.1216"), "Should contain Wald lower bound");

    console.log("✅ testCalcCIValid passed!");
}

function testCalcCIInvalid() {
    setupDOM(`
        <div id="br-ci-results"></div>
        <input id="br_ci_x" value="120">
        <input id="br_ci_n" value="100">
        <input id="br_ci_level" value="0.95">
    `);

    window.BiostatRef.calcCI();
    assert(global.lastToast && global.lastToast.msg.includes('Enter valid values'), "Should show toast for x > n");

    console.log("✅ testCalcCIInvalid passed!");
}

function testFindTest() {
    setupDOM(`
        <div id="br-test-results"></div>
        <select id="br_outcome"><option value="continuous" selected></option></select>
        <select id="br_groups"><option value="2" selected></option></select>
        <select id="br_paired"><option value="independent" selected></option></select>
        <select id="br_parametric"><option value="true" selected></option></select>
    `);

    window.BiostatRef.findTest();

    const resultsHtml = document.getElementById('br-test-results').innerHTML;
    assert(resultsHtml.includes("Two-sample t-test (independent)"), "Should find Two-sample t-test");

    console.log("✅ testFindTest passed!");
}

function testFindTestEmpty() {
    setupDOM(`
        <div id="br-test-results"></div>
        <select id="br_outcome"><option value="" selected></option></select>
        <select id="br_groups"><option value="2"></option></select>
        <select id="br_paired"><option value="independent"></option></select>
        <select id="br_parametric"><option value="true"></option></select>
    `);

    window.BiostatRef.findTest();
    assert(global.lastToast && global.lastToast.msg.includes('Please select the outcome variable type'), "Should show toast for missing outcome");

    console.log("✅ testFindTestEmpty passed!");
}

function testRenderModule() {
    const container = document.createElement('div');
    setupDOM('');
    const module = global.registeredModules['biostats-reference'];
    assert(module && typeof module.render === 'function', "Module should be registered with render function");

    module.render(container);

    assert(container.innerHTML.includes("Biostatistics Reference"), "Rendered HTML should contain title");
    assert(container.innerHTML.includes("Statistical Test Selector"), "Rendered HTML should contain Statistical Test Selector card");
    assert(container.innerHTML.includes("Probability Distributions Gallery"), "Rendered HTML should contain Distributions Gallery card");
    assert(container.innerHTML.includes("Central Limit Theorem Demonstrator"), "Rendered HTML should contain CLT Demonstrator card");
    assert(container.innerHTML.includes("Confidence Interval Methods"), "Rendered HTML should contain CI Methods card");
    assert(container.innerHTML.includes("Effect Size Interpretation Guide"), "Rendered HTML should contain Effect Size card");
    assert(container.innerHTML.includes("Multiple Testing &amp; P-value Reference"), "Rendered HTML should contain Multiple Testing card");

    console.log("✅ testRenderModule passed!");
}

// Run all tests
describe("BiostatRef Tests", () => {
    test("testAdjustPvalsValid", () => {
        testAdjustPvalsValid();
    });
    test("testAdjustPvalsEmpty", () => {
        testAdjustPvalsEmpty();
    });
    test("testAdjustPvalsInvalid", () => {
        testAdjustPvalsInvalid();
    });
    test("testCalcCIValid", () => {
        testCalcCIValid();
    });
    test("testCalcCIInvalid", () => {
        testCalcCIInvalid();
    });
    test("testFindTest", () => {
        testFindTest();
    });
    test("testFindTestEmpty", () => {
        testFindTestEmpty();
    });
    test("testRenderModule", () => {
        testRenderModule();
    });
});

