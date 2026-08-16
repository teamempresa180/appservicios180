/**
 * Spike test — a sudden, brief jump from a small baseline to a high
 * peak and back down, unlike stress.js's gradual climb. This is what
 * a viral moment, a push notification blast, or a marketing campaign
 * looks like from the backend's point of view: near-instant
 * concurrency, not a slow ramp — and the interesting failure modes
 * (connection pool exhaustion, cold-cache latency, Railway
 * autoscaling lag if any) only show up under that shape.
 *
 * Usage: npm run k6:spike  (from apps/backend)
 */
import { SPIKE } from '../config/profiles.js';
import { GLOBAL_THRESHOLDS, readThresholds, writeThresholds } from '../config/thresholds.js';
import { registry } from './_registry.js';
import { rampingScenarios } from './_scenario-builder.js';
import { buildReportFiles } from '../helpers/report.js';

const READ_SCENARIOS = ['health_check', 'marketplace_browse', 'provider_profile', 'order_list_mine', 'notifications', 'review_list'];
const WRITE_SCENARIOS = ['order_create', 'chat_messaging'];

function spikeStages(peak) {
  return [
    { duration: '10s', target: SPIKE.baseVus },
    { duration: '5s', target: peak }, // the spike itself — as close to instant as k6 allows
    { duration: SPIKE.spikeDuration, target: peak },
    { duration: '10s', target: SPIKE.baseVus },
    { duration: SPIKE.recoveryDuration, target: SPIKE.baseVus }, // does it recover, or stay degraded?
    { duration: '10s', target: 0 },
  ];
}

export const options = {
  scenarios: {
    ...rampingScenarios(READ_SCENARIOS, spikeStages(SPIKE.peakVus)),
    ...rampingScenarios(WRITE_SCENARIOS, spikeStages(Math.max(2, Math.round(SPIKE.peakVus / 4)))),
  },
  thresholds: {
    ...GLOBAL_THRESHOLDS,
    ...readThresholds('health_check'),
    ...readThresholds('marketplace_categories'),
    ...readThresholds('order_list_mine'),
    ...readThresholds('notification_list'),
    ...readThresholds('review_list'),
    ...writeThresholds('order_create'),
    ...writeThresholds('chat_create'),
    ...writeThresholds('message_send'),
  },
};

export const health_check = registry.health_check;
export const marketplace_browse = registry.marketplace_browse;
export const provider_profile = registry.provider_profile;
export const order_list_mine = registry.order_list_mine;
export const notifications = registry.notifications;
export const review_list = registry.review_list;
export const order_create = registry.order_create;
export const chat_messaging = registry.chat_messaging;

export function handleSummary(data) {
  return buildReportFiles('spike', data);
}
