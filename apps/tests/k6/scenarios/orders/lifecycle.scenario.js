/**
 * Order lifecycle: create (client), list "mine" (client), list
 * "relevant for provider" (provider). `createTestOrder` is exported
 * for the quotes/chat/reviews/payments scenarios to reuse — every one
 * of those needs a real Order to hang off of, and duplicating this
 * logic in five files would be exactly the "sin duplicación" rule
 * this suite is supposed to follow.
 */
import { vuClient, vuProvider, getFixtures } from '../../data/fixtures.js';
import { TEST_DATA_TAG } from '../../config/environment.js';
import { loginAs } from '../../helpers/auth.js';
import { apiGet, apiPost } from '../../helpers/http.js';
import { checkStatus, safeJson } from '../../helpers/checks.js';
import { domainMetrics, recordOutcome } from '../../helpers/metrics.js';

export const orderCreateMetrics = domainMetrics('order_create');
export const orderMineMetrics = domainMetrics('order_list_mine');
export const orderRelevantMetrics = domainMetrics('order_list_relevant_for_provider');

/**
 * Creates one Order as a random seeded client, as an *open* request
 * (no `providerId`) in the shared k6 Category — the same shape
 * `RequestServicePage` submits. Returns `{ order, session, client }`
 * or `null` if the create call failed (caller decides whether that's
 * fatal for its own scenario).
 */
export function createTestOrder() {
  const client = vuClient();
  const session = loginAs({ documentNumber: client.documentNumber, password: client.password });
  if (!session) return null;

  const { category } = getFixtures();
  const scheduledDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const body = {
    identityId: client.identityId,
    categoryId: category.id,
    addressId: client.addressId,
    title: `${TEST_DATA_TAG} order`,
    description: `${TEST_DATA_TAG} — created by k6 load test, safe to remove.`,
    scheduledDate,
    priority: 'MEDIUM',
  };

  const res = apiPost('orders', body, session.accessToken, { tags: { name: 'order_create' } });
  recordOutcome(orderCreateMetrics, res, [201]);
  checkStatus(res, 201, 'order_create');

  const order = safeJson(res);
  if (!order || !order.id) return null;
  return { order, session, client };
}

export function listMyOrders() {
  const client = vuClient();
  const session = loginAs({ documentNumber: client.documentNumber, password: client.password });
  if (!session) return;

  const res = apiGet('orders/mine?page=1&pageSize=20', session.accessToken, {
    tags: { name: 'order_list_mine' },
  });
  recordOutcome(orderMineMetrics, res, [200]);
  checkStatus(res, 200, 'order_list_mine');
}

export function listRelevantForProvider() {
  const provider = vuProvider();
  const session = loginAs({ documentNumber: provider.documentNumber, password: provider.password });
  if (!session) return;

  const res = apiGet('orders/relevant-for-provider?page=1&pageSize=20', session.accessToken, {
    tags: { name: 'order_list_relevant_for_provider' },
  });
  recordOutcome(orderRelevantMetrics, res, [200]);
  checkStatus(res, 200, 'order_list_relevant_for_provider');
}
