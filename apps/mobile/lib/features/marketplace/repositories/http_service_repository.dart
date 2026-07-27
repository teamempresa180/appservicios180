import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';
import 'service_repository.dart';

/// [ServiceRepository] (Marketplace's own) backed by [ApiClient].
///
/// `getFeatured()` calls `GET /services` and returns the full list —
/// the backend has no "featured" concept, so this is honestly the full
/// service list, not a real featured-services algorithm (same judgment
/// call already documented elsewhere for simulated fields).
///
/// `ratingOf` is real, but approximated: `Review` only links to a
/// `Provider`, never to a `Service` directly, so there is no way to
/// compute a rating scoped to one specific service. This averages the
/// **provider's** reviews instead (fetches the service to read its
/// `providerId`, then `GET /reviews` filtered client-side) — the
/// closest real signal available, not a fabricated number.
class HttpMarketplaceServiceRepository implements ServiceRepository {
  HttpMarketplaceServiceRepository(this._apiClient);

  final ApiClient _apiClient;

  @override
  Future<List<Service>> getFeatured() async {
    final json = await _apiClient.get('/services');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items.map(ServiceHttpMapper.fromJson).toList();
  }

  @override
  Future<double> ratingOf(ServiceId id) async {
    final serviceJson = await _apiClient.get('/services/${id.value}');
    final service = ServiceHttpMapper.fromJson(serviceJson);
    final json = await _apiClient.get('/reviews');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final reviews = items
        .map(ReviewHttpMapper.fromJson)
        .where((review) => review.providerId == service.providerId)
        .toList();
    if (reviews.isEmpty) return 0;
    final total = reviews.fold<num>(
      0,
      (sum, review) => sum + review.rating.value,
    );
    return total / reviews.length;
  }
}
