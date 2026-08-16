/**
 * Stress test — climbs well past `load.js`'s steady-state VU count in
 * stages, holding each step long enough to see whether latency/error
 * thresholds start failing before the next step. The goal is to find
 * where the system starts degrading, not to hold a fixed load — so
 * unlike load.js, breaching a threshold mid-run is an expected,
 * useful outcome (that's the "límite real del sistema" the Etapa 20
 * brief asks for), not a bug in the script.
 *
 * Usage: npm run k6:stress  (from apps/backend)
 *   K6_STRESS_PEAK_VUS=120 npm run k6:stress   # push further
 */
import { STRESS } from '../config/profiles.js';
import { GLOBAL_THRESHOLDS, readThresholds, writeThresholds, authThresholds } from '../config/thresholds.js';
import { registry } from './_registry.js';
import { rampingScenarios } from './_scenario-builder.js';
import { buildReportFiles } from '../helpers/report.js';

const READ_SCENARIOS = ['health_check', 'marketplace_browse', 'provider_profile', 'order_list_mine', 'order_list_relevant', 'notifications', 'review_list', 'payment_list'];
const WRITE_SCENARIOS = ['order_create', 'quote_accept_flow', 'quote_reject_flow', 'chat_messaging', 'review_create', 'payment_create'];
const AUTH_SCENARIOS = ['auth_login'];

function climbingStages(peak) {
  const d = STRESS.stageDuration;
  return [
    { duration: d, target: Math.round(peak * 0.25) },
    { duration: d, target: Math.round(peak * 0.5) },
    { duration: d, target: Math.round(peak * 0.75) },
    { duration: d, target: peak },
    { duration: d, target: peak }, // hold at peak — this is where the ceiling shows up
    { duration: d, target: 0 },
  ];
}

export const options = {
  scenarios: {
    ...rampingScenarios(READ_SCENARIOS, climbingStages(STRESS.readPeakVus)),
    ...rampingScenarios(WRITE_SCENARIOS, climbingStages(STRESS.writePeakVus)),
    ...rampingScenarios(AUTH_SCENARIOS, climbingStages(STRESS.writePeakVus)),
  },
  // No `abortOnFail` — stress is meant to run past the point of
  // failure so the summary shows exactly where things broke.
  thresholds: {
    ...GLOBAL_THRESHOLDS,
    ...readThresholds('health_check'),
    ...readThresholds('marketplace_categories'),
    ...readThresholds('marketplace_providers'),
    ...readThresholds('marketplace_services'),
    ...readThresholds('provider_self'),
    ...readThresholds('order_list_mine'),
    ...readThresholds('order_list_relevant_for_provider'),
    ...readThresholds('notification_list'),
    ...readThresholds('review_list'),
    ...readThresholds('payment_list'),
    ...authThresholds('auth_login'),
    ...writeThresholds('order_create'),
    ...writeThresholds('quote_accept'),
    ...writeThresholds('quote_reject'),
    ...writeThresholds('chat_create'),
    ...writeThresholds('review_create'),
    ...writeThresholds('payment_create'),
  },
};

export const health_check = registry.health_check;
export const marketplace_browse = registry.marketplace_browse;
export const provider_profile = registry.provider_profile;
export const order_list_mine = registry.order_list_mine;
export const order_list_relevant = registry.order_list_relevant;
export const notifications = registry.notifications;
export const review_list = registry.review_list;
export const payment_list = registry.payment_list;
export const order_create = registry.order_create;
export const quote_accept_flow = registry.quote_accept_flow;
export const quote_reject_flow = registry.quote_reject_flow;
export const chat_messaging = registry.chat_messaging;
export const review_create = registry.review_create;
export const payment_create = registry.payment_create;
export const auth_login = registry.auth_login;

export function handleSummary(data) {
  return buildReportFiles('stress', data);
}
