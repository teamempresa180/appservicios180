/**
 * Loads the fixture pool created by `fixtures/seed.js` — real rows
 * (Identity + Credential + Profile + Address, Providers with real
 * Services) already committed to the target database, so load
 * scenarios never spend iteration time on registration/onboarding
 * and never risk flooding the Identity table with throwaway accounts
 * (see Etapa 20 brief: "no usar datos aleatorios que rompan el
 * backend").
 *
 * `SharedArray` loads the JSON once per k6 process (not once per VU)
 * — with thousands of VUs, that's the difference between reading the
 * file once and reading it thousands of times.
 */
import { SharedArray } from 'k6/data';
import exec from 'k6/execution';

function loadFixtures() {
  const raw = open('./fixtures.json');
  return JSON.parse(raw);
}

const fixtures = new SharedArray('k6-fixtures', () => {
  const data = loadFixtures();
  // SharedArray requires a flat array — wrap the whole fixture
  // document as its single element so every VU can still reach
  // `.clients`, `.providers`, `.category`, etc. via fixtures()[0].
  return [data];
});

/** @returns {{
 *   category: {id: string, name: string},
 *   clients: Array<{identityId: string, documentNumber: string, password: string, profileId: string, addressId: string}>,
 *   providers: Array<{identityId: string, documentNumber: string, password: string, providerId: string, services: Array<{id: string, basePrice: number, estimatedDuration: number}>}>,
 *   seededAt: string,
 * }} */
export function getFixtures() {
  return fixtures[0];
}

export function randomClient() {
  const { clients } = getFixtures();
  return clients[Math.floor(Math.random() * clients.length)];
}

export function randomProvider() {
  const { providers } = getFixtures();
  return providers[Math.floor(Math.random() * providers.length)];
}

export function randomService() {
  const provider = randomProvider();
  const service = provider.services[Math.floor(Math.random() * provider.services.length)];
  return { provider, service };
}

/**
 * Deterministic per-VU client, keyed by k6's own VU id — every
 * scenario that needs "someone logged in to do a browsing/reading
 * action" should use this instead of `randomClient()`. A real mobile
 * session logs in once and reuses that session for every action the
 * user takes; picking a brand-new random Identity on every iteration
 * would mean every single scenario call pays a fresh login, which
 * both misrepresents real traffic and (see `POST /authentications/login`'s
 * `@Throttle(5/60s)`, Etapa 18) collides with the per-IP login
 * throttle purely as a test-harness artifact — every k6 VU shares the
 * same source IP, unlike real users on real distinct networks. Only
 * the dedicated `auth_login` scenario (`scenarios/auth/login.scenario.js`)
 * deliberately logs in fresh every call, since exercising that
 * throttle under concurrency is the whole point of that scenario.
 */
export function vuClient() {
  const { clients } = getFixtures();
  return clients[exec.vu.idInTest % clients.length];
}

/** Deterministic per-VU provider — same reasoning as `vuClient()`. */
export function vuProvider() {
  const { providers } = getFixtures();
  return providers[exec.vu.idInTest % providers.length];
}
