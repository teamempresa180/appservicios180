/**
 * Concurrent login — measures `POST /authentications/login` under
 * real concurrency, always with `forceRelogin` so the metric reflects
 * the actual bcrypt-compare + JWT-sign cost on every call instead of
 * hitting the per-VU token cache other scenarios rely on.
 */
import { randomClient } from '../../data/fixtures.js';
import { loginAs, loginMetrics } from '../../helpers/auth.js';
import { apiGet } from '../../helpers/http.js';
import { checkStatus } from '../../helpers/checks.js';
import { domainMetrics, recordOutcome } from '../../helpers/metrics.js';

export const meMetrics = domainMetrics('auth_me');

export function concurrentLogin() {
  const client = randomClient();
  const session = loginAs(
    { documentNumber: client.documentNumber, password: client.password },
    { forceRelogin: true },
  );
  if (!session) return null;

  // Every real login is immediately followed by `GET /authentications/me`
  // on the mobile app (session restore / role confirmation) — mirror
  // that so the login scenario measures the pair together, matching
  // real traffic shape instead of an isolated endpoint no client ever
  // calls alone.
  const meRes = apiGet('authentications/me', session.accessToken, { tags: { name: 'auth_me' } });
  recordOutcome(meMetrics, meRes, [200]);
  checkStatus(meRes, 200, 'auth_me');

  return session;
}

export { loginMetrics };
