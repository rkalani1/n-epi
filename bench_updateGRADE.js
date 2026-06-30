const { JSDOM } = require("jsdom");
const { performance } = require("perf_hooks");

const dom = new JSDOM(`
  <html>
    <body>
      <div id="container">
      </div>
    </body>
  </html>
`);

const document = dom.window.document;
const container = document.getElementById("container");

// create a bunch of junk inputs to make the DOM larger and queries take longer
for(let i=0; i<10000; i++) {
    const el = document.createElement("input");
    el.type = "radio";
    el.name = "junk-" + i;
    container.appendChild(el);
}

// add the relevant elements
const baseEl = document.createElement("input");
baseEl.type = "radio";
baseEl.name = "ca-grade-base";
baseEl.value = "RCT";
baseEl.checked = true;
container.appendChild(baseEl);

for(let i=0; i<5; i++) {
    const el = document.createElement("input");
    el.type = "radio";
    el.name = "ca-grade-down-" + i;
    el.value = "Serious (-1)";
    el.checked = true;
    container.appendChild(el);
}

for(let i=0; i<3; i++) {
    const el = document.createElement("input");
    el.type = "radio";
    el.name = "ca-grade-up-" + i;
    el.value = "Yes (+1)";
    el.checked = true;
    container.appendChild(el);
}

// Result element
const resultEl = document.createElement("div");
resultEl.id = "ca-grade-level";
container.appendChild(resultEl);


// Mock App for setTrustedHTML
global.App = {
    setTrustedHTML: (el, html) => {
        el.innerHTML = html;
    }
};

global.document = document;

function originalUpdateGRADE() {
    var base = document.querySelector('input[name="ca-grade-base"]:checked');
    if (!base) return;

    var level = base.value === 'RCT' ? 4 : 2;

    for (var i = 0; i < 5; i++) {
        var sel = document.querySelector('input[name="ca-grade-down-' + i + '"]:checked');
        if (sel) {
            if (sel.value.indexOf('-1') > -1) level -= 1;
            if (sel.value.indexOf('-2') > -1) level -= 2;
        }
    }

    for (var j = 0; j < 3; j++) {
        var selUp = document.querySelector('input[name="ca-grade-up-' + j + '"]:checked');
        if (selUp) {
            if (selUp.value.indexOf('+1') > -1) level += 1;
            if (selUp.value.indexOf('+2') > -1) level += 2;
        }
    }

    level = Math.max(1, Math.min(4, level));
    var labels = ['', 'Very Low', 'Low', 'Moderate', 'High'];
    var colors = ['', 'var(--danger)', 'var(--warning)', 'var(--info)', 'var(--success)'];
    var symbols = ['', '\u2295\u2296\u2296\u2296', '\u2295\u2295\u2296\u2296', '\u2295\u2295\u2295\u2296', '\u2295\u2295\u2295\u2295'];

    var el = document.getElementById('ca-grade-level');
    if (el) {
        App.setTrustedHTML(el, '<span style="color:' + colors[level] + '">' + symbols[level] + ' ' + labels[level] + '</span>');
    }
}

function optimizedUpdateGRADE() {
    var base = document.querySelector('input[name="ca-grade-base"]:checked');
    if (!base) return;

    var level = base.value === 'RCT' ? 4 : 2;

    var downSels = document.querySelectorAll('input[name^="ca-grade-down-"]:checked');
    for (var i = 0; i < downSels.length; i++) {
        var sel = downSels[i];
        if (sel.value.indexOf('-1') > -1) level -= 1;
        if (sel.value.indexOf('-2') > -1) level -= 2;
    }

    var upSels = document.querySelectorAll('input[name^="ca-grade-up-"]:checked');
    for (var j = 0; j < upSels.length; j++) {
        var selUp = upSels[j];
        if (selUp.value.indexOf('+1') > -1) level += 1;
        if (selUp.value.indexOf('+2') > -1) level += 2;
    }

    level = Math.max(1, Math.min(4, level));
    var labels = ['', 'Very Low', 'Low', 'Moderate', 'High'];
    var colors = ['', 'var(--danger)', 'var(--warning)', 'var(--info)', 'var(--success)'];
    var symbols = ['', '\u2295\u2296\u2296\u2296', '\u2295\u2295\u2296\u2296', '\u2295\u2295\u2295\u2296', '\u2295\u2295\u2295\u2295'];

    var el = document.getElementById('ca-grade-level');
    if (el) {
        App.setTrustedHTML(el, '<span style="color:' + colors[level] + '">' + symbols[level] + ' ' + labels[level] + '</span>');
    }
}

const RUNS = 1000;

let start1 = performance.now();
for(let i=0; i<RUNS; i++) originalUpdateGRADE();
let end1 = performance.now();
console.log("Original:", end1 - start1, "ms");

let start2 = performance.now();
for(let i=0; i<RUNS; i++) optimizedUpdateGRADE();
let end2 = performance.now();
console.log("Optimized:", end2 - start2, "ms");
