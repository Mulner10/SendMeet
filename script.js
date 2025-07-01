
document.getElementById('checkBtn').onclick = evaluateCall;
document.getElementById('downloadBtn').onclick = downloadCSV;

function evaluateCall() {
  const text = document.getElementById('transcript').value.toLowerCase();
  const results = [];

  const phrases = {
    company: ['we're calling from', 'this is', 'calling you from', 'program manager', 'all in one'],
    availability: ['available', 'am', 'pm', 'meeting at', 'schedule'],
    needs: ['turf', 'landscaping', 'renovation', 'pool', 'project', 'golf'],
    spouse: ['wife', 'husband', 'spouse', 'partner', 'single', 'sole owner', 'no co-owner'],
    title: ['title holder', 'own the house', 'sole owner', 'no co-owner']
  };

  function check(label, keywords) {
    const found = keywords.some(phrase => text.includes(phrase));
    let symbol = found ? '✅' : '❌';
    if (!found && label === 'Spouse') {
      const partial = ['wife', 'husband', 'spouse', 'partner'].some(p => text.includes(p));
      if (partial) symbol = '⚠️';
    }
    results.push({ label, symbol });
  }

  check('Company Name', phrases.company);
  check('Client Availability', phrases.availability);
  check('Needs', phrases.needs);
  check('Spouse', phrases.spouse);
  check('Title Holders', phrases.title);

  let output = '';
  results.forEach(r => {
    const cls = r.symbol === '✅' ? 'good' : r.symbol === '❌' ? 'bad' : 'partial';
    output += `<p><strong>${r.label}:</strong> <span class="${cls}">${r.symbol}</span></p>`;
  });

  const score = results.filter(r => r.symbol === '✅').length;
  const summary = score === 5
    ? '<p><strong>✅ This is a qualified meeting (5/5)</strong></p>'
    : `<p><strong>⚠️ Not ready – missing ${5 - score} key item(s) (${score}/5)</strong></p>`;

  document.getElementById('output').innerHTML = output + summary;
  document.getElementById('downloadBtn').style.display = 'block';
  window.latestResults = results;
}

function downloadCSV() {
  const rows = window.latestResults.map(r => `${r.label},${r.symbol}`).join('\n');
  const blob = new Blob([rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'meeting-verification.csv';
  a.click();
  URL.revokeObjectURL(url);
}
