import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';
import 'mock_service_repository.dart';
import 'service_repository.dart';

/// [ServiceRepository] (Marketplace's own) backed by [ApiClient].
///
/// `getFeatured()` calls `GET /services` and returns the full list —
/// the backend has no "featured" concept, so this is honestly the full
/// service list, not a real featured-services algorithm (same judgment
/// call already documented elsewhere for simulated fields).
///
/// `ratingOf` has no backend counterpart at all — there is no
/// `Review`-aggregation endpoint yet — so it stays simulated by
/// delegating to a kept-around [MockServiceRepository] instance, same
/// as `HttpMarketplaceProviderRepository.ratingOf`/`servicesCountOf`.
class HttpMarketplaceServiceRepository implements ServiceRepository {
  HttpMarketplaceServiceRepository(this._apiClient);

  final ApiClient _apiClient;
  final _mockFallback = MockServiceRepository();

  @override
  Future<List<Service>> getFeatured() async {
    final json = await _apiClient.get('/services');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items.map(ServiceHttpMapper.fromJson).toList();
  }

  @override
  Future<double> ratingOf(ServiceId id) => _mockFallback.ratingOf(id);
}
