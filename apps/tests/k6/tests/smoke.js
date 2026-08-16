/**
 * Smoke test — "does the backend respond correctly at all", not "how
 * much load can it take". One VU, one pass through every domain in
 * the order a real user would actually hit them (health → login →
 * browse → provider reads → order → quote → chat → notifications →
 * reviews → payments). Run this first, always — a red smoke test
 * means load/stress/spike/soak would just be measuring a broken
 * backend.
 *
 * Usage: npm run k6:smoke  (from apps/backend)
 */
import { group, sleep } from 'k6';
import { GLOBAL_THRESHOLDS } from '../config/thresholds.js';
import { registry } from './_registry.js';
import { buildReportFiles } from '../helpers/report.js';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: GLOBAL_THRESHOLDS,
};

export function handleSummary(data) {
  return buildReportFiles('smoke', data);
}

export default function smoke() {
  group('health', () => registry.health_check());
  sleep(0.2);

  group('auth', () => registry.auth_login());
  sleep(0.2);

  group('marketplace', () => registry.marketplace_browse());
  sleep(0.2);

  group('provider profile', () => registry.provider_profile());
  sleep(0.2);

  group('orders', () => {
    registry.order_create();
    registry.order_list_mine();
    registry.order_list_relevant();
  });
  sleep(0.2);

  group('quotes', () => {
    registry.quote_accept_flow();
    registry.quote_reject_flow();
  });
  sleep(0.2);

  group('chat', () => registry.chat_messaging());
  sleep(0.2);

  group('notifications', () => registry.notifications());
  sleep(0.2);

  group('reviews', () => {
    registry.review_list();
    registry.review_create();
  });
  sleep(0.2);

  group('payments', () => {
    registry.payment_list();
    registry.payment_create();
  });
}
