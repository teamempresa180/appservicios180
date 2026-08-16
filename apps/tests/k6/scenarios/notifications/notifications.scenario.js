/**
 * Notifications: list the caller's own notifications, then mark the
 * first one read if there is one. Read-heavy — this is the endpoint a
 * real client polls most frequently (bell icon badge).
 */
import { vuClient } from '../../data/fixtures.js';
import { loginAs } from '../../helpers/auth.js';
import { apiGet, apiPut } from '../../helpers/http.js';
import { checkStatus, safeJson } from '../../helpers/checks.js';
import { domainMetrics, recordOutcome } from '../../helpers/metrics.js';

export const notificationListMetrics = domainMetrics('notification_list');
export const notificationReadMetrics = domainMetrics('notification_mark_read');

export function listAndMarkRead() {
  const client = vuClient();
  const session = loginAs({ documentNumber: client.documentNumber, password: client.password });
  if (!session) return;

  const listRes = apiGet('notifications?page=1&pageSize=20', session.accessToken, {
    tags: { name: 'notification_list' },
  });
  recordOutcome(notificationListMetrics, listRes, [200]);
  checkStatus(listRes, 200, 'notification_list');

  const body = safeJson(listRes);
  const first = body && Array.isArray(body.items) ? body.items[0] : null;
  if (!first) return;

  const readRes = apiPut(`notifications/${first.id}/read`, {}, session.accessToken, {
    tags: { name: 'notification_mark_read' },
  });
  recordOutcome(notificationReadMetrics, readRes, [200]);
  checkStatus(readRes, 200, 'notification_mark_read');
}
