import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';
import 'mock_provider_repository.dart';
import 'provider_repository.dart';

/// [ProviderRepository] (Marketplace's own) backed by [ApiClient].
///
/// `getRecommended()` calls `GET /providers` and returns the full list
/// — the backend has no "recommended" concept, so this is honestly the
/// full provider list, not a real recommendation algorithm.
///
/// `profileOf(id)` first fetches the provider (`GET /providers/:id`)
/// to read its `providerProfileId`, then `GET /profiles/:id`.
///
/// `ratingOf`/`servicesCountOf` have no backend counterpart at all —
/// there is no `Review`-aggregation or `Service`-count endpoint yet —
/// so both stay simulated by delegating to a kept-around
/// [MockProviderRepository] instance, same judgment call already
/// documented for `OrderDisplay.estimatedArrival`.
class HttpMarketplaceProviderRepository implements ProviderRepository {
  HttpMarketplaceProviderRepository(this._apiClient);

  final ApiClient _apiClient;
  final _mockFallback = MockProviderRepository();

  @override
  Future<List<Provider>> getRecommended() async {
    final json = await _apiClient.get('/providers');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items.map(ProviderHttpMapper.fromJson).toList();
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
  Future<double> ratingOf(ProviderId id) => _mockFallback.ratingOf(id);

  @override
  Future<int> servicesCountOf(ProviderId id) =>
      _mockFallback.servicesCountOf(id);
}
