document.getElementById('checkBtn').onclick = evaluateCall;
document.getElementById('downloadBtn').onclick = downloadCSV;

function evaluateCall() {
  const t = document.getElementById('transcript').value.toLowerCase();
  const checks = [];
  checks.push(check('Company Name', t.includes('we\'re calling from') || t.includes('this is from') ? '✅' : '❌'));
  checks.push(check('Client Availability', (t.includes('available') && (t.includes('am') || t.includes('pm'))) ? '✅' : '⚠️'));
  checks.push(check('Needs', (t.includes('need') || t.includes('problem') || t.includes('issue')) ? '✅' : '⚠️'));
  checks.push(check('Spouse', (t.includes('wife') || t.includes('husband') || t.includes('partner')) ? '✅' : '⚠️'));
  checks.push(check('Title Holders', (t.includes('title holder') || t.includes('own the house')) ? '✅' : '❌'));

  const output = checks.map(c => `<p><strong>${c.label}:</strong> <span class="${c.sym==='✅'?'good':c.sym==='❌'?'bad':'partial'}">${c.sym}</span></p>`).join('');
  document.getElementById('output').innerHTML = output;
  document.getElementById('downloadBtn').style.display = 'block';
  window.latestChecks = checks;
}

function check(label, ok) {
  return { label: label, sym: ok };
}

function downloadCSV() {
  const rows = window.latestChecks.map(c => `${c.label},${c.sym}`).join('\n');
  const blob = new Blob([rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sendmeet-evaluation.csv';
  a.click();
  URL.revokeObjectURL(url);
}
