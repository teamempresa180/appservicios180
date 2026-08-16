/**
 * Quote lifecycle: a provider submits a Quote on a freshly created
 * Order, then the client who owns that Order accepts it — the two
 * highest-value write paths for this domain, exercised together
 * since accepting only makes sense on a Quote that exists.
 * `AcceptQuoteUseCase` runs inside a real Prisma transaction
 * (Order + Quote written atomically, Etapa 18) — this is the one
 * write in the whole API where k6 can observe transaction latency
 * directly.
 */
import { vuProvider } from '../../data/fixtures.js';
import { TEST_DATA_TAG } from '../../config/environment.js';
import { createTestOrder } from '../orders/lifecycle.scenario.js';
import { loginAs } from '../../helpers/auth.js';
import { apiPost, apiPut } from '../../helpers/http.js';
import { checkStatus, safeJson } from '../../helpers/checks.js';
import { domainMetrics, recordOutcome } from '../../helpers/metrics.js';

export const quoteCreateMetrics = domainMetrics('quote_create');
export const quoteAcceptMetrics = domainMetrics('quote_accept');
export const quoteRejectMetrics = domainMetrics('quote_reject');

function submitQuote(order, provider) {
  const session = loginAs({ documentNumber: provider.documentNumber, password: provider.password });
  if (!session) return null;

  const body = {
    orderId: order.id,
    providerId: provider.providerId,
    proposedPrice: 75.5,
    estimatedDuration: 90,
    notes: `${TEST_DATA_TAG} quote — created by k6 load test.`,
    type: 'STANDARD',
  };
  const res = apiPost('quotes', body, session.accessToken, { tags: { name: 'quote_create' } });
  recordOutcome(quoteCreateMetrics, res, [201]);
  checkStatus(res, 201, 'quote_create');
  return safeJson(res);
}

/** Full happy path: order → quote → accept. Used by `load.js`/`stress.js`
 *  to exercise the transactional accept under concurrency. */
export function createOrderQuoteAndAccept() {
  const created = createTestOrder();
  if (!created) return;
  const { order, session: clientSession } = created;

  const provider = vuProvider();
  const quote = submitQuote(order, provider);
  if (!quote || !quote.id) return;

  const acceptRes = apiPut(`quotes/${quote.id}/accept`, {}, clientSession.accessToken, {
    tags: { name: 'quote_accept' },
  });
  recordOutcome(quoteAcceptMetrics, acceptRes, [200]);
  checkStatus(acceptRes, 200, 'quote_accept');
}

/** Order → quote → reject, for scenarios that want to exercise the
 *  reject path specifically instead of always accepting. */
export function createOrderQuoteAndReject() {
  const created = createTestOrder();
  if (!created) return;
  const { order, session: clientSession } = created;

  const provider = vuProvider();
  const quote = submitQuote(order, provider);
  if (!quote || !quote.id) return;

  const rejectRes = apiPut(`quotes/${quote.id}/reject`, {}, clientSession.accessToken, {
    tags: { name: 'quote_reject' },
  });
  recordOutcome(quoteRejectMetrics, rejectRes, [200]);
  checkStatus(rejectRes, 200, 'quote_reject');
}

export { submitQuote };
