/**
 * Factory for the per-scenario custom metrics every domain module
 * needs: a request-duration Trend (so `p(95)`/`p(99)` on outcomes
 * that are actually specific to "creating a Quote" as opposed to
 * every HTTP call the whole run makes) and an error Rate. k6's
 * built-in `http_req_duration` mixes every request together — these
 * per-scenario Trends are what let the summary answer "which endpoint
 * is slow", not just "was anything slow".
 */
import { Trend, Rate, Counter } from 'k6/metrics';

/**
 * @param {string} name - metric name prefix, e.g. "marketplace_browse"
 * @returns {{ duration: Trend, errors: Rate, timeouts: Counter, retries: Counter }}
 */
export function domainMetrics(name) {
  return {
    duration: new Trend(`${name}_duration`, true),
    errors: new Rate(`${name}_errors`),
    timeouts: new Counter(`${name}_timeouts`),
    retries: new Counter(`${name}_retries`),
  };
}

/** Records one HTTP response against a domain's metric set — call
 *  this right after every `http.*` call in a scenario module so
 *  duration/error/timeout accounting stays uniform across all of
 *  them instead of each file hand-rolling it. */
export function recordOutcome(metrics, res, expectedStatuses = [200, 201]) {
  const ok = expectedStatuses.includes(res.status);
  metrics.duration.add(res.timings.duration);
  metrics.errors.add(!ok);
  if (res.error_code === 1050 || res.status === 0) {
    // k6 error_code 1050 = request timeout; status 0 = connection
    // never completed (DNS failure, connection refused/reset) — both
    // are the "saturation"/"connection exhaustion" signals the
    // Etapa 20 brief asks this suite to surface explicitly, distinct
    // from a clean HTTP error response.
    metrics.timeouts.add(1);
  }
  return ok;
}
