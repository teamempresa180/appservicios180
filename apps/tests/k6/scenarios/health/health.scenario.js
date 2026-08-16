/**
 * `GET /health` — the one endpoint every test-type entrypoint can
 * call regardless of auth/fixtures, and the one soak.js polls
 * continuously to catch slow degradation over a long run (see
 * `tests/soak.js`). Real DB check (`SELECT 1`), not just "is the
 * process alive" — see `apps/backend/src/app.controller.ts`.
 */
import { apiGet } from '../../helpers/http.js';
import { checkStatus, checkJsonField } from '../../helpers/checks.js';
import { domainMetrics, recordOutcome } from '../../helpers/metrics.js';

export const healthMetrics = domainMetrics('health_check');

export function checkHealth() {
  const res = apiGet('health', null, { tags: { name: 'health_check' } });
  recordOutcome(healthMetrics, res, [200]);
  checkStatus(res, 200, 'health');
  checkJsonField(res, 'database', 'health');
  return res;
}
