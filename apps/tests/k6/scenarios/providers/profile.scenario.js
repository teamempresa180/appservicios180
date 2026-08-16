/**
 * Provider-side reads: own profile, own services, own availability,
 * own schedule — the four calls `ProviderDashboardPage` fires on open
 * (see `apps/mobile/lib/features/provider_dashboard`).
 */
import { vuProvider } from '../../data/fixtures.js';
import { loginAs } from '../../helpers/auth.js';
import { apiGet } from '../../helpers/http.js';
import { checkStatus } from '../../helpers/checks.js';
import { domainMetrics, recordOutcome } from '../../helpers/metrics.js';

export const providerSelfMetrics = domainMetrics('provider_self');
export const providerServicesMetrics = domainMetrics('provider_services');
export const providerAvailabilityMetrics = domainMetrics('provider_availability');
export const providerScheduleMetrics = domainMetrics('provider_schedule');

export function browseProviderProfile() {
  const provider = vuProvider();
  const session = loginAs({ documentNumber: provider.documentNumber, password: provider.password });
  if (!session) return;
  const token = session.accessToken;

  const selfRes = apiGet(`providers/${provider.providerId}`, token, {
    tags: { name: 'provider_self' },
  });
  recordOutcome(providerSelfMetrics, selfRes, [200]);
  checkStatus(selfRes, 200, 'provider_self');

  const servicesRes = apiGet('services?page=1&pageSize=20', token, {
    tags: { name: 'provider_services' },
  });
  recordOutcome(providerServicesMetrics, servicesRes, [200]);
  checkStatus(servicesRes, 200, 'provider_services');

  const availabilityRes = apiGet('availabilities?page=1&pageSize=20', token, {
    tags: { name: 'provider_availability' },
  });
  recordOutcome(providerAvailabilityMetrics, availabilityRes, [200]);
  checkStatus(availabilityRes, 200, 'provider_availability');

  const scheduleRes = apiGet('schedules?page=1&pageSize=20', token, {
    tags: { name: 'provider_schedule' },
  });
  recordOutcome(providerScheduleMetrics, scheduleRes, [200]);
  checkStatus(scheduleRes, 200, 'provider_schedule');
}
