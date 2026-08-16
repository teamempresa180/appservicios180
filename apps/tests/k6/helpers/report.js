/**
 * `handleSummary(data)` implementation shared by every test-type
 * entrypoint — writes JSON + CSV + a self-contained HTML report to
 * `reports/`, on top of k6's own stdout summary (never suppressed:
 * `stdout` is always included in the returned map). No external
 * `jslib.k6.io` dependency — this backend's CI/local runs shouldn't
 * depend on a third-party CDN being reachable at test time, so the
 * HTML table is hand-built from `data.metrics` instead of importing
 * k6's own summary formatter.
 */

function metricRow(name, metric) {
  const v = metric.values || {};
  const fmt = (n) => (typeof n === 'number' ? n.toFixed(2) : '—');
  return {
    name,
    type: metric.type,
    avg: fmt(v.avg),
    min: fmt(v.min),
    med: fmt(v.med),
    max: fmt(v.max),
    p90: fmt(v['p(90)']),
    p95: fmt(v['p(95)']),
    p99: fmt(v['p(99)']),
    count: v.count ?? v.passes ?? '—',
    rate: v.rate !== undefined ? `${(v.rate * 100).toFixed(2)}%` : '—',
  };
}

function buildRows(data) {
  return Object.entries(data.metrics || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, metric]) => metricRow(name, metric));
}

function buildCsv(rows) {
  const header = ['metric', 'type', 'avg', 'min', 'med', 'max', 'p90', 'p95', 'p99', 'count', 'rate'];
  const lines = [header.join(',')];
  for (const row of rows) {
    lines.push(header.map((key) => row[key === 'metric' ? 'name' : key]).join(','));
  }
  return lines.join('\n');
}

function buildHtml(rows, testType, thresholdsPassed) {
  const statusColor = thresholdsPassed ? '#1a7f37' : '#cf222e';
  const statusText = thresholdsPassed ? 'TODOS LOS THRESHOLDS PASARON' : 'AL MENOS UN THRESHOLD FALLÓ';
  const tableRows = rows
    .map(
      (r) => `<tr>
        <td>${r.name}</td><td>${r.type}</td><td>${r.avg}</td><td>${r.min}</td>
        <td>${r.med}</td><td>${r.max}</td><td>${r.p90}</td><td>${r.p95}</td>
        <td>${r.p99}</td><td>${r.count}</td><td>${r.rate}</td>
      </tr>`,
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>k6 — ${testType} — SERVICIOS 180°</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; margin: 2rem; color: #1f2328; }
  h1 { margin-bottom: 0.25rem; }
  .meta { color: #57606a; margin-bottom: 1rem; }
  .status { display: inline-block; padding: 0.35rem 0.75rem; border-radius: 6px; color: white; background: ${statusColor}; font-weight: 600; }
  table { border-collapse: collapse; width: 100%; margin-top: 1.5rem; font-size: 0.85rem; }
  th, td { border: 1px solid #d0d7de; padding: 0.4rem 0.6rem; text-align: right; }
  th:first-child, td:first-child { text-align: left; }
  thead { background: #f6f8fa; }
  tbody tr:nth-child(even) { background: #f6f8fa; }
</style>
</head>
<body>
  <h1>Reporte k6 — ${testType}</h1>
  <div class="meta">SERVICIOS 180° · generado el ${new Date().toISOString()}</div>
  <div class="status">${statusText}</div>
  <table>
    <thead>
      <tr><th>Métrica</th><th>Tipo</th><th>avg</th><th>min</th><th>med</th><th>max</th><th>p90</th><th>p95</th><th>p99</th><th>count</th><th>rate</th></tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
</body>
</html>`;
}

function buildStdout(rows, testType, thresholdsPassed) {
  const lines = [];
  lines.push('');
  lines.push(`k6 ${testType} — SERVICIOS 180°`);
  lines.push(thresholdsPassed ? '✔ todos los thresholds pasaron' : '✘ al menos un threshold falló');
  lines.push('');
  const header = 'metric'.padEnd(38) + 'avg'.padStart(10) + 'p90'.padStart(10) + 'p95'.padStart(10) + 'p99'.padStart(10) + 'max'.padStart(10) + 'rate'.padStart(10);
  lines.push(header);
  lines.push('-'.repeat(header.length));
  for (const r of rows) {
    lines.push(
      r.name.slice(0, 37).padEnd(38) +
        String(r.avg).padStart(10) +
        String(r.p90).padStart(10) +
        String(r.p95).padStart(10) +
        String(r.p99).padStart(10) +
        String(r.max).padStart(10) +
        String(r.rate).padStart(10),
    );
  }
  lines.push('');
  lines.push('Reportes completos: reports/latest-' + testType + '.{json,csv,html}');
  lines.push('');
  return lines.join('\n');
}

/**
 * @param {string} testType - "smoke" | "load" | "stress" | "spike" | "soak"
 * @param {object} data - the object k6 passes into `handleSummary`
 */
export function buildReportFiles(testType, data) {
  const rows = buildRows(data);
  const thresholdsPassed = Object.values(data.metrics || {}).every((metric) => {
    if (!metric.thresholds) return true;
    return Object.values(metric.thresholds).every((t) => t.ok !== false);
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const base = `reports/${testType}-${timestamp}`;
  const json = JSON.stringify(data, null, 2);
  const html = buildHtml(rows, testType, thresholdsPassed);

  return {
    stdout: buildStdout(rows, testType, thresholdsPassed),
    [`${base}.json`]: json,
    [`${base}.csv`]: buildCsv(rows),
    [`${base}.html`]: html,
    [`reports/latest-${testType}.json`]: json,
    [`reports/latest-${testType}.html`]: html,
  };
}
