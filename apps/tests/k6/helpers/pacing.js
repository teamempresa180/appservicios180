/**
 * Inter-iteration think-time. Every domain scenario is wrapped with
 * this in `tests/_registry.js` for one specific, load-tester-only
 * reason: `ThrottlerModule` (Etapa 18) applies a global 100
 * req/60s-per-IP limit across the whole API, and k6 — unlike real
 * traffic — sends every VU's requests from the **same** source IP.
 * Without pacing, a modest VU count (tens, not hundreds) already
 * fires enough back-to-back requests to blow past that limit within
 * the first second, which floods every endpoint with 429s that have
 * nothing to do with the backend's actual capacity — it's the
 * request-generator's topology colliding with a per-IP guard, not a
 * finding about the system under test. A real mobile user also never
 * fires a request the instant the previous one returns; there's
 * always a pause while they read the screen or the app renders.
 *
 * `auth_login` is deliberately exempt (see
 * `scenarios/auth/login.scenario.js`) — it exists specifically to
 * show the login throttle's behavior under concurrency, and skipping
 * think-time there is what makes that visible.
 */
import { sleep } from 'k6';

const MIN_THINK_SECONDS = Number(__ENV.K6_MIN_THINK_SECONDS || 1);
const MAX_THINK_SECONDS = Number(__ENV.K6_MAX_THINK_SECONDS || 3);

export function thinkTime() {
  const seconds = MIN_THINK_SECONDS + Math.random() * (MAX_THINK_SECONDS - MIN_THINK_SECONDS);
  sleep(seconds);
}
