/**
 * Payments: list the caller's own payments (Etapa 18 scoped this to
 * payer + receiving provider — no third-party payment data leaks),
 * and create one against a Quote that was just accepted, the same
 * order→quote→accept→pay sequence a real transaction follows.
 */
import { vuClient, vuProvider } from '../../data/fixtures.js';
import { createTestOrder } from '../orders/lifecycle.scenario.js';
import { submitQuote } from '../quotes/lifecycle.scenario.js';
import { loginAs } from '../../helpers/auth.js';
import { apiGet, apiPost, apiPut } from '../../helpers/http.js';
import { checkStatus } from '../../helpers/checks.js';
import { domainMetrics, recordOutcome } from '../../helpers/metrics.js';

export const paymentListMetrics = domainMetrics('payment_list');
export const paymentCreateMetrics = domainMetrics('payment_create');

export function listPayments() {
  const client = vuClient();
  const session = loginAs({ documentNumber: client.documentNumber, password: client.password });
  if (!session) return;

  const res = apiGet('payments?page=1&pageSize=20', session.accessToken, {
    tags: { name: 'payment_list' },
  });
  recordOutcome(paymentListMetrics, res, [200]);
  checkStatus(res, 200, 'payment_list');
}

export function createPayment() {
  const created = createTestOrder();
  if (!created) return;
  const { order, session, client } = created;

  const provider = vuProvider();
  const quote = submitQuote(order, provider);
  if (!quote || !quote.id) return;

  const acceptRes = apiPut(`quotes/${quote.id}/accept`, {}, session.accessToken, {
    tags: { name: 'quote_accept' },
  });
  if (acceptRes.status !== 200) return;

  const res = apiPost(
    'payments',
    {
      quoteId: quote.id,
      orderId: order.id,
      payerIdentityId: client.identityId,
      receiverProviderId: provider.providerId,
      amount: quote.proposedPrice ?? 75.5,
      method: 'CARD',
    },
    session.accessToken,
    { tags: { name: 'payment_create' } },
  );
  recordOutcome(paymentCreateMetrics, res, [201]);
  checkStatus(res, 201, 'payment_create');
}
