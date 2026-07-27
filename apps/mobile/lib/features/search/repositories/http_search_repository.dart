import '../../../category/entities/category.dart';
import '../../../category/models/category_id.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';
import '../../categories/repositories/category_http_mapper.dart';
import 'search_repository.dart';

/// [SearchRepository] backed by [ApiClient] — calls `GET /services`,
/// which returns the paginated shape `{ items, total, page, pageSize }`.
/// This pilot only needs the first page's items; pagination and real
/// free-text search wiring for this feature is left for a future
/// prompt (see the feature README).
///
/// `providerOf`/`categoryOf` fetch `GET /providers/:id`/
/// `GET /categories/:id` directly.
///
/// `ratingOf`/`reviewsCountOf` are real, but there is no
/// `GET /reviews?providerId=` filter on the backend — both fetch the
/// full, unfiltered `GET /reviews` list and filter client-side, same
/// interim pattern as `HttpMarketplaceProviderRepository.ratingOf`.
class HttpSearchRepository implements SearchRepository {
  HttpSearchRepository(this._apiClient);

  final ApiClient _apiClient;

  @override
  Future<List<Service>> getAll() async {
    final json = await _apiClient.get('/services');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items.map(ServiceHttpMapper.fromJson).toList();
  }

  @override
  Future<Provider> providerOf(ProviderId id) async {
    final json = await _apiClient.get('/providers/${id.value}');
    return ProviderHttpMapper.fromJson(json);
  }

  @override
  Future<Category> categoryOf(CategoryId id) async {
    final json = await _apiClient.get('/categories/${id.value}');
    return CategoryHttpMapper.fromJson(json);
  }

  Future<List<Review>> _reviewsFor(ProviderId providerId) async {
    final json = await _apiClient.get('/reviews');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .map(ReviewHttpMapper.fromJson)
        .where((review) => review.providerId == providerId)
        .toList();
  }

  @override
  Future<double> ratingOf(ProviderId providerId) async {
    final reviews = await _reviewsFor(providerId);
    if (reviews.isEmpty) return 0;
    final total = reviews.fold<num>(
      0,
      (sum, review) => sum + review.rating.value,
    );
    return total / reviews.length;
  }

  @override
  Future<int> reviewsCountOf(ProviderId providerId) async =>
      (await _reviewsFor(providerId)).length;
}
