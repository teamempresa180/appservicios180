/**
 * Login + per-VU token cache. A module-level `let`/object in k6 is
 * private to the JS VM instance backing one VU for that VU's entire
 * lifetime (k6 does not share module state across VUs) — so caching
 * here means each virtual user logs in once and reuses its access
 * token across iterations, exactly like a real mobile session, instead
 * of re-authenticating (and re-paying the bcrypt cost) on every
 * iteration, which would make every scenario secretly measure login
 * performance instead of its own endpoint.
 */
import { apiPost } from './http.js';
import { checkStatus, safeJson } from './checks.js';
import { domainMetrics, recordOutcome } from './metrics.js';

const loginMetrics = domainMetrics('auth_login');

/** identityId -> { accessToken, refreshToken, identityId, role } */
const tokenCache = {};

/**
 * @param {{documentNumber: string, password: string}} credentials
 * @param {{forceRelogin?: boolean}} [opts]
 */
export function loginAs(credentials, opts = {}) {
  const cacheKey = credentials.documentNumber;
  if (!opts.forceRelogin && tokenCache[cacheKey]) {
    return tokenCache[cacheKey];
  }

  const res = apiPost(
    'authentications/login',
    { documentNumber: credentials.documentNumber, password: credentials.password },
    null,
    { tags: { name: 'auth_login' } },
  );
  recordOutcome(loginMetrics, res, [200, 201]);
  checkStatus(res, 200, 'login');

  const body = safeJson(res);
  if (!body || !body.accessToken) {
    return null;
  }

  const session = {
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
    documentNumber: credentials.documentNumber,
  };
  tokenCache[cacheKey] = session;
  return session;
}

export function clearTokenCache() {
  Object.keys(tokenCache).forEach((key) => delete tokenCache[key]);
}

export { loginMetrics };
