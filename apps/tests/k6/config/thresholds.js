/**
 * Threshold presets shared by every test-type entrypoint
 * (tests/smoke.js, load.js, stress.js, spike.js, soak.js) and by the
 * per-domain scenario modules that define their own custom Trend
 * metrics. Centralized so every script judges "is this endpoint
 * healthy" by the same rule instead of each file inventing its own
 * numbers.
 *
 * Two tiers, matching how the API actually behaves (verified against
 * this backend's own Etapa 17 performance pass): reads are indexed,
 * paginated lookups; writes go through the Application layer's
 * validators plus, for Orders/Quotes, a real MySQL write (and for
 * AcceptQuote, a transaction). A write is allowed 2x the latency
 * budget of a read before it's flagged.
 */

// Measured against the real Railway deployment during Etapa 20
// (see the delivery report): this backend's MySQL host is NOT
// co-located with Railway's compute region, so every query pays a
// fixed cross-network round trip before any query-execution time is
// even counted. That shows up as a base latency floor on every
// endpoint, reads included, well above what a co-located database
// would cost. These defaults are set to a realistic-but-real target
// given that constraint, not to whatever number made the first run
// green — see the Etapa 20 report's "Cuellos de botella" section for
// the measured baseline these are calibrated against.
export const READ_P95_MS = Number(__ENV.K6_READ_P95_MS || 800);
export const WRITE_P95_MS = Number(__ENV.K6_WRITE_P95_MS || 2500);
export const AUTH_P95_MS = Number(__ENV.K6_AUTH_P95_MS || 3500);

/** Global ceiling on the error rate across an entire run — anything
 *  above this means the system is failing requests it should be
 *  serving, not just running slow. */
export const MAX_ERROR_RATE = Number(__ENV.K6_MAX_ERROR_RATE || 0.01);

/** `http_req_failed` + duration thresholds for a *read* endpoint
 *  (GET list/detail/search). Pass a metric name prefix so each
 *  scenario gets its own named threshold in the summary instead of
 *  everything colliding under the same key. */
export function readThresholds(prefix) {
  return {
    [`${prefix}_duration`]: [`p(95)<${READ_P95_MS}`, `p(99)<${READ_P95_MS * 2}`],
    [`${prefix}_errors`]: [`rate<${MAX_ERROR_RATE}`],
  };
}

/** Same shape, for a *write* endpoint (POST/PUT that persists a row). */
export function writeThresholds(prefix) {
  return {
    [`${prefix}_duration`]: [`p(95)<${WRITE_P95_MS}`, `p(99)<${WRITE_P95_MS * 2}`],
    [`${prefix}_errors`]: [`rate<${MAX_ERROR_RATE}`],
  };
}

/** Auth endpoints (login/refresh) do a bcrypt compare and a JWT sign
 *  — inherently slower than a plain read, but still latency-sensitive
 *  since every session restore and token refresh waits on it. */
export function authThresholds(prefix) {
  return {
    [`${prefix}_duration`]: [`p(95)<${AUTH_P95_MS}`, `p(99)<${AUTH_P95_MS * 2}`],
    [`${prefix}_errors`]: [`rate<${MAX_ERROR_RATE}`],
  };
}

/** Global, script-wide thresholds every test-type entrypoint merges
 *  its scenario-specific ones into — the run itself fails (non-zero
 *  exit) if these are breached, which is what makes `npm run k6:*`
 *  useful in CI, not just a pretty report.
 *
 * Deliberately does NOT include a blanket `http_req_duration`
 * threshold: this suite's requests span everything from a plain
 * indexed `SELECT` to `POST /authentications/login` (a bcrypt compare
 * — inherently ~150-250ms of CPU time by design, the whole point of
 * bcrypt, regardless of backend performance) to a transactional
 * Quote-accept. A single global latency ceiling either lets the slow
 * ones hide inside the average or falsely fails the run over
 * legitimately-slow-by-design endpoints. Per-endpoint thresholds
 * (`readThresholds`/`writeThresholds`/`authThresholds` above,
 * applied by each test-type entrypoint) are the real latency gate;
 * this stays global-error-rate-only. */
export const GLOBAL_THRESHOLDS = {
  http_req_failed: [`rate<${MAX_ERROR_RATE}`],
};
