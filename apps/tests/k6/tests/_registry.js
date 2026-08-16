/**
 * Single registry mapping an `exec` name (what a k6 `scenarios` entry
 * points to) to the scenario function that implements it. Every
 * test-type entrypoint (smoke/load/stress/spike/soak) imports from
 * here instead of importing each scenario module directly — one
 * place to add a new domain scenario and have it available to every
 * test type, instead of five files to touch.
 *
 * k6 requires every `exec` target to be an exported top-level
 * function in the entrypoint file itself, so each name below is
 * re-exported by every `tests/*.js` file via `export const <name> =
 * registry.<name>` (see the bottom of each file).
 *
 * Every entry except `auth_login` is wrapped with `thinkTime()` — see
 * `helpers/pacing.js` for why: without it, k6's lack of per-VU
 * pacing collides with the global per-IP rate limit and the run
 * measures the limiter, not the backend.
 */
import { checkHealth } from '../scenarios/health/health.scenario.js';
import { concurrentLogin } from '../scenarios/auth/login.scenario.js';
import { browseMarketplace } from '../scenarios/marketplace/browse.scenario.js';
import { browseProviderProfile } from '../scenarios/providers/profile.scenario.js';
import { createTestOrder, listMyOrders, listRelevantForProvider } from '../scenarios/orders/lifecycle.scenario.js';
import { createOrderQuoteAndAccept, createOrderQuoteAndReject } from '../scenarios/quotes/lifecycle.scenario.js';
import { createChatSendAndReadMessages } from '../scenarios/chat/messaging.scenario.js';
import { listAndMarkRead } from '../scenarios/notifications/notifications.scenario.js';
import { listReviews, createReview } from '../scenarios/reviews/reviews.scenario.js';
import { listPayments, createPayment } from '../scenarios/payments/payments.scenario.js';
import { thinkTime } from '../helpers/pacing.js';

function paced(fn) {
  return () => {
    fn();
    thinkTime();
  };
}

export const registry = {
  health_check: paced(checkHealth),
  auth_login: concurrentLogin,
  marketplace_browse: paced(browseMarketplace),
  provider_profile: paced(browseProviderProfile),
  order_create: paced(() => createTestOrder()),
  order_list_mine: paced(listMyOrders),
  order_list_relevant: paced(listRelevantForProvider),
  quote_accept_flow: paced(createOrderQuoteAndAccept),
  quote_reject_flow: paced(createOrderQuoteAndReject),
  chat_messaging: paced(createChatSendAndReadMessages),
  notifications: paced(listAndMarkRead),
  review_list: paced(listReviews),
  review_create: paced(createReview),
  payment_list: paced(listPayments),
  payment_create: paced(createPayment),
};
