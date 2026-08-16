/**
 * Load test — expected steady-state traffic. Every domain runs
 * concurrently for the whole duration, reads at a higher VU count
 * than writes (matching real traffic shape: browsing far outweighs
 * creating an order/quote/chat/review/payment). This is the profile
 * that answers "does the backend hold up under normal expected use",
 * not "where does it break" (that's stress.js).
 *
 * Usage: npm run k6:load  (from apps/backend)
 *   K6_LOAD_READ_VUS=25 K6_LOAD_DURATION=5m npm run k6:load   # heavier run
 */
import { LOAD } from '../config/profiles.js';
import { GLOBAL_THRESHOLDS, readThresholds, writeThresholds, authThresholds } from '../config/thresholds.js';
import { registry } from './_registry.js';
import { rampingScenarios } from './_scenario-builder.js';
import { buildReportFiles } from '../helpers/report.js';

const READ_SCENARIOS = ['health_check', 'marketplace_browse', 'provider_profile', 'order_list_mine', 'order_list_relevant', 'notifications', 'review_list', 'payment_list'];
const WRITE_SCENARIOS = ['order_create', 'quote_accept_flow', 'quote_reject_flow', 'chat_messaging', 'review_create', 'payment_create'];
const AUTH_SCENARIOS = ['auth_login'];

function stagesFor(target) {
  return [
    { duration: LOAD.rampUp, target },
    { duration: LOAD.duration, target },
    { duration: LOAD.rampDown, target: 0 },
  ];
}

export const options = {
  scenarios: {
    ...rampingScenarios(READ_SCENARIOS, stagesFor(LOAD.readVus)),
    ...rampingScenarios(WRITE_SCENARIOS, stagesFor(LOAD.writeVus)),
    ...rampingScenarios(AUTH_SCENARIOS, stagesFor(LOAD.writeVus)),
  },
  thresholds: {
    ...GLOBAL_THRESHOLDS,
    ...readThresholds('health_check'),
    ...readThresholds('marketplace_categories'),
    ...readThresholds('marketplace_providers'),
    ...readThresholds('marketplace_services'),
    ...readThresholds('marketplace_provider_detail'),
    ...readThresholds('provider_self'),
    ...readThresholds('order_list_mine'),
    ...readThresholds('order_list_relevant_for_provider'),
    ...readThresholds('notification_list'),
    ...readThresholds('review_list'),
    ...readThresholds('payment_list'),
    ...authThresholds('auth_login'),
    ...writeThresholds('order_create'),
    ...writeThresholds('quote_create'),
    ...writeThresholds('quote_accept'),
    ...writeThresholds('quote_reject'),
    ...writeThresholds('chat_create'),
    ...writeThresholds('message_send'),
    ...writeThresholds('review_create'),
    ...writeThresholds('payment_create'),
  },
};

// k6 executors resolve `exec` by name against this file's own
// top-level exports — re-exporting the registry functions here is
// what wires `options.scenarios[name].exec = name` to real code.
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
  return buildReportFiles('load', data);
}
