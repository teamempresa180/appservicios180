/**
 * Marketplace browsing — the highest-traffic read path in the real
 * app (every Home/Marketplace open): categories, providers, services,
 * and one provider profile detail per iteration, mirroring how the
 * Flutter client actually sequences these calls (see
 * `apps/mobile/lib/features/marketplace/presentation/pages/marketplace_page.dart`).
 */
import { vuClient, getFixtures } from '../../data/fixtures.js';
import { loginAs } from '../../helpers/auth.js';
import { apiGet } from '../../helpers/http.js';
import { checkStatus } from '../../helpers/checks.js';
import { domainMetrics, recordOutcome } from '../../helpers/metrics.js';

export const categoriesMetrics = domainMetrics('marketplace_categories');
export const providersMetrics = domainMetrics('marketplace_providers');
export const servicesMetrics = domainMetrics('marketplace_services');
export const providerDetailMetrics = domainMetrics('marketplace_provider_detail');

export function browseMarketplace() {
  const client = vuClient();
  const session = loginAs({ documentNumber: client.documentNumber, password: client.password });
  if (!session) return;
  const token = session.accessToken;

  const categoriesRes = apiGet('categories', token, { tags: { name: 'marketplace_categories' } });
  recordOutcome(categoriesMetrics, categoriesRes, [200]);
  checkStatus(categoriesRes, 200, 'categories');

  const providersRes = apiGet('providers?page=1&pageSize=20', token, {
    tags: { name: 'marketplace_providers' },
  });
  recordOutcome(providersMetrics, providersRes, [200]);
  checkStatus(providersRes, 200, 'providers');

  const servicesRes = apiGet('services?page=1&pageSize=20', token, {
    tags: { name: 'marketplace_services' },
  });
  recordOutcome(servicesMetrics, servicesRes, [200]);
  checkStatus(servicesRes, 200, 'services');

  const { providers } = getFixtures();
  const targetProvider = providers[Math.floor(Math.random() * providers.length)];
  const detailRes = apiGet(`providers/${targetProvider.providerId}`, token, {
    tags: { name: 'marketplace_provider_detail' },
  });
  recordOutcome(providerDetailMetrics, detailRes, [200]);
  checkStatus(detailRes, 200, 'provider_detail');
}
