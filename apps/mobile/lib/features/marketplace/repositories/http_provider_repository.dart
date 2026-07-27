import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';
import '../../../provider/models/provider_status.dart';
import 'provider_repository.dart';

/// [ProviderRepository] (Marketplace's own) backed by [ApiClient].
///
/// `getRecommended()` calls `GET /providers` and filters to
/// `ProviderStatus.active` client-side (no `?status=` filter exists on
/// the backend) — the backend has no "recommended" concept either, so
/// this is honestly "every active provider", not a real recommendation
/// algorithm. Filtering out `pending`/`inactive`/`suspended`/`archived`
/// providers here is what keeps a "become a provider" applicant out of
/// search results until their documents are approved (see
/// `HttpBecomeProviderRepository`'s doc comment).
///
/// `profileOf(id)` first fetches the provider (`GET /providers/:id`)
/// to read its `providerProfileId`, then `GET /profiles/:id`.
///
/// `ratingOf`/`servicesCountOf` are real, but computed client-side:
/// there is no `GET /reviews?providerId=`/`GET /services?providerId=`
/// filter on the backend, so both fetch the full, unfiltered list and
/// filter/aggregate here — same interim pattern already documented on
/// `HttpOrdersRepository.getQuoteFor`. `ratingOf` returns `0` when the
/// provider has no reviews yet (an honest "no data" value, not a
/// fabricated default).
class HttpMarketplaceProviderRepository implements ProviderRepository {
  HttpMarketplaceProviderRepository(this._apiClient);

  final ApiClient _apiClient;

  @override
  Future<List<Provider>> getRecommended() async {
    final json = await _apiClient.get('/providers');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .map(ProviderHttpMapper.fromJson)
        .where((provider) => provider.status == ProviderStatus.active)
        .toList();
  }

  @override
  Future<Profile> profileOf(ProviderId id) async {
    final providerJson = await _apiClient.get('/providers/${id.value}');
    final provider = ProviderHttpMapper.fromJson(providerJson);
    final json = await _apiClient.get(
      '/profiles/${provider.providerProfileId.value}',
    );
    return ProfileHttpMapper.fromJson(json);
  }

  @override
  Future<double> ratingOf(ProviderId id) async {
    final json = await _apiClient.get('/reviews');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final reviews = items
        .map(ReviewHttpMapper.fromJson)
        .where((review) => review.providerId == id)
        .toList();
    if (reviews.isEmpty) return 0;
    final total = reviews.fold<num>(
      0,
      (sum, review) => sum + review.rating.value,
    );
    return total / reviews.length;
  }

  @override
  Future<int> servicesCountOf(ProviderId id) async {
    final json = await _apiClient.get('/services');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .map(ServiceHttpMapper.fromJson)
        .where((service) => service.providerId == id)
        .length;
  }
}
