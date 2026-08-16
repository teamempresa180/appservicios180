/**
 * Soak test — modest, constant concurrency sustained for a long
 * duration, to catch what only shows up over time: a connection pool
 * that slowly leaks, a cache that never gets evicted and grows
 * unbounded, latency creeping upward minute over minute even though
 * VU count never changes. `load.js` and `stress.js` are both too
 * short to see this class of bug.
 *
 * A dedicated `health_monitor` scenario polls `/health` on a fixed
 * interval for the entire run, independent of the domain scenarios —
 * so even if every domain scenario's VUs get starved out, the health
 * Trend alone still shows whether the backend degraded over the soak
 * window.
 *
 * Usage: npm run k6:soak  (from apps/backend)
 *   K6_SOAK_DURATION=30m K6_SOAK_VUS=10 npm run k6:soak   # the real thing
 */
import { sleep } from 'k6';
import { SOAK } from '../config/profiles.js';
import { GLOBAL_THRESHOLDS, readThresholds, writeThresholds } from '../config/thresholds.js';
import { registry } from './_registry.js';
import { checkHealth } from '../scenarios/health/health.scenario.js';
import { constantScenarios } from './_scenario-builder.js';
import { buildReportFiles } from '../helpers/report.js';

const READ_SCENARIOS = ['marketplace_browse', 'provider_profile', 'order_list_mine', 'notifications', 'review_list', 'payment_list'];
const WRITE_SCENARIOS = ['order_create', 'chat_messaging', 'review_create'];

function healthPollIntervalSeconds() {
  const match = /^(\d+)s$/.exec(SOAK.healthPollInterval);
  return match ? Number(match[1]) : 10;
}

export function health_monitor() {
  checkHealth();
  sleep(healthPollIntervalSeconds());
}

export const options = {
  scenarios: {
    ...constantScenarios(READ_SCENARIOS, { vus: SOAK.vus, duration: SOAK.duration }),
    ...constantScenarios(WRITE_SCENARIOS, { vus: Math.max(1, Math.round(SOAK.vus / 3)), duration: SOAK.duration }),
    health_monitor: {
      executor: 'constant-vus',
      exec: 'health_monitor',
      vus: 1,
      duration: SOAK.duration,
      tags: { domain: 'health_monitor' },
    },
  },
  thresholds: {
    ...GLOBAL_THRESHOLDS,
    ...readThresholds('health_check'),
    ...readThresholds('marketplace_categories'),
    ...readThresholds('order_list_mine'),
    ...readThresholds('notification_list'),
    ...readThresholds('review_list'),
    ...readThresholds('payment_list'),
    ...writeThresholds('order_create'),
    ...writeThresholds('chat_create'),
    ...writeThresholds('review_create'),
  },
};

export const marketplace_browse = registry.marketplace_browse;
export const provider_profile = registry.provider_profile;
export const order_list_mine = registry.order_list_mine;
export const notifications = registry.notifications;
export const review_list = registry.review_list;
export const payment_list = registry.payment_list;
export const order_create = registry.order_create;
export const chat_messaging = registry.chat_messaging;
export const review_create = registry.review_create;

export function handleSummary(data) {
  return buildReportFiles('soak', data);
}
