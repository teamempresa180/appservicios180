/**
 * Load profiles per test type. Every number here is overridable via
 * `-e` so the same scripts serve both "a quick, safe validation run
 * against the real Railway deployment" (the defaults below) and "the
 * actual capacity-finding run a team schedules deliberately, off
 * peak hours" (raise `*_VUS`/`*_DURATION` when you're ready for that).
 *
 * The defaults are intentionally conservative: this backend runs on
 * a single shared Railway instance with a real MySQL host serving
 * whatever real traffic exists — a stress/spike/soak profile sized
 * for "find the breaking point" by default would risk degrading a
 * shared production service for anyone using it while the test runs.
 * See `README.md` → "Ejecutar una prueba de capacidad real" for how
 * to raise these deliberately.
 */

export const SMOKE = {
  vus: Number(__ENV.K6_SMOKE_VUS || 1),
  iterations: Number(__ENV.K6_SMOKE_ITERATIONS || 1),
};

export const LOAD = {
  // Kept modest by default so the *aggregate* request rate across
  // every scenario comfortably clears Etapa 18's global 100 req/60s
  // per-IP throttle with room to spare — every k6 VU shares this
  // machine's one source IP, unlike real distributed users, so a
  // "50 concurrent users" load profile from a single runner would
  // just measure the limiter, not the backend. See helpers/pacing.js
  // and README.md → "Sobre el límite global por IP".
  readVus: Number(__ENV.K6_LOAD_READ_VUS || 3),
  writeVus: Number(__ENV.K6_LOAD_WRITE_VUS || 1),
  duration: __ENV.K6_LOAD_DURATION || '2m',
  rampUp: __ENV.K6_LOAD_RAMP_UP || '30s',
  rampDown: __ENV.K6_LOAD_RAMP_DOWN || '15s',
};

export const STRESS = {
  // Staged ramp well past LOAD's steady-state VUs — the point is to
  // keep climbing until error rate / latency thresholds start
  // failing, which is what "find the limit" means. Conservative
  // ceiling by default (see file doc comment); raise
  // K6_STRESS_PEAK_VUS for a real capacity-finding run.
  readPeakVus: Number(__ENV.K6_STRESS_PEAK_VUS || 40),
  writePeakVus: Number(__ENV.K6_STRESS_PEAK_WRITE_VUS || 15),
  stageDuration: __ENV.K6_STRESS_STAGE_DURATION || '1m',
};

export const SPIKE = {
  baseVus: Number(__ENV.K6_SPIKE_BASE_VUS || 5),
  peakVus: Number(__ENV.K6_SPIKE_PEAK_VUS || 60),
  spikeDuration: __ENV.K6_SPIKE_DURATION || '30s',
  recoveryDuration: __ENV.K6_SPIKE_RECOVERY || '1m',
};

export const SOAK = {
  vus: Number(__ENV.K6_SOAK_VUS || 6),
  duration: __ENV.K6_SOAK_DURATION || '10m',
  healthPollInterval: __ENV.K6_SOAK_HEALTH_INTERVAL || '10s',
};
