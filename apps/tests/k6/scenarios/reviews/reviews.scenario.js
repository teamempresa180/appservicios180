/**
 * Reviews: public read (marketplace trust signal, no ownership
 * restriction — anyone authenticated can browse them) and creation
 * against a fresh Order.
 */
import { getFixtures, vuClient } from '../../data/fixtures.js';
import { TEST_DATA_TAG } from '../../config/environment.js';
import { createTestOrder } from '../orders/lifecycle.scenario.js';
import { loginAs } from '../../helpers/auth.js';
import { apiGet, apiPost } from '../../helpers/http.js';
import { checkStatus } from '../../helpers/checks.js';
import { domainMetrics, recordOutcome } from '../../helpers/metrics.js';

export const reviewListMetrics = domainMetrics('review_list');
export const reviewCreateMetrics = domainMetrics('review_create');

export function listReviews() {
  const client = vuClient();
  const session = loginAs({ documentNumber: client.documentNumber, password: client.password });
  if (!session) return;

  const res = apiGet('reviews?page=1&pageSize=20', session.accessToken, {
    tags: { name: 'review_list' },
  });
  recordOutcome(reviewListMetrics, res, [200]);
  checkStatus(res, 200, 'review_list');
}

export function createReview() {
  const created = createTestOrder();
  if (!created) return;
  const { order, session, client } = created;

  const provider = getFixtures().providers[Math.floor(Math.random() * getFixtures().providers.length)];

  const res = apiPost(
    'reviews',
    {
      orderId: order.id,
      providerId: provider.providerId,
      reviewerIdentityId: client.identityId,
      rating: 5,
      title: `${TEST_DATA_TAG} review`,
      comment: `${TEST_DATA_TAG} — created by k6 load test, safe to remove.`,
    },
    session.accessToken,
    { tags: { name: 'review_create' } },
  );
  recordOutcome(reviewCreateMetrics, res, [201]);
  checkStatus(res, 201, 'review_create');
}
