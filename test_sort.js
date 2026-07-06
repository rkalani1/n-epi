const fs = require('fs');
let code = fs.readFileSync('./js/core/statistics.js', 'utf8');

// The code reviewer was mistaken, data is already sorted:
// const data = times.map((t, i) => ({ time: t, event: events[i], group: group ? group[i] : 0 }))
//    .sort((a, b) => a.time - b.time);
// gData is just filtered from data, so it remains sorted!
console.log("data is sorted at lines 1355-1356");
