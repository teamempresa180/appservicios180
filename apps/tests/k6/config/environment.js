/**
 * Single source of truth for environment-dependent configuration.
 * Every k6 script imports from here instead of reading __ENV directly
 * — one place to change the target, one place to see every knob that
 * exists.
 *
 * Override any value with `-e KEY=value` on the k6 CLI, e.g.:
 *   k6 run -e BASE_URL=http://localhost:3000 tests/smoke.js
 */

/** Public Railway deployment — the default target for every script. */
const DEFAULT_BASE_URL = 'https://appservicios180-production.up.railway.app';

export const BASE_URL = (__ENV.K6_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');

/** Request timeout — Railway's own edge timeout is higher than this,
 *  so a script hitting this ceiling means the backend itself is slow,
 *  not the network hop. */
export const HTTP_TIMEOUT = __ENV.K6_HTTP_TIMEOUT || '15s';

/** How many distinct seeded client identities the fixture pool
 *  provides (see fixtures/seed.js) — scenarios that need "a random
 *  real user" pick from this pool instead of registering fresh
 *  accounts per iteration, which would flood Identity/Credential
 *  tables under load and defeats the purpose of a repeatable test. */
export const SEED_CLIENT_COUNT = Number(__ENV.K6_SEED_CLIENTS || 20);

/** How many seeded provider identities exist, each with an ACTIVE
 *  Provider record — see fixtures/seed.js for why this can't be done
 *  through the public API (Etapa 19: no real approval mechanism
 *  exists yet, so fixtures seed directly through Prisma). */
export const SEED_PROVIDER_COUNT = Number(__ENV.K6_SEED_PROVIDERS || 5);

/** Shared prefix stamped on every piece of data these scripts create
 *  (Identity.fullName, Order.title, Message.content, …) so a human
 *  or a cleanup script can immediately recognize k6-generated rows
 *  and nothing else in the database is ever mistaken for test data. */
export const TEST_DATA_TAG = 'K6-LOADTEST';

/** Fixed document-number prefix for seeded Identities — lets
 *  fixtures/teardown.js find and remove exactly the rows
 *  fixtures/seed.js created, by prefix match, without touching a
 *  single real user. */
export const TEST_DOCUMENT_PREFIX = 'K6TEST-';

export const DEFAULT_HEADERS = Object.freeze({
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

/** Central place to reason about "is this run against the real
 *  production deployment" — stress/spike/soak scripts read this to
 *  print a loud warning before ramping up. */
export const IS_PRODUCTION_TARGET = BASE_URL.includes('railway.app');
