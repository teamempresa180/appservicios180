import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';
import 'reviews_repository.dart';

/// [ReviewsRepository] backed by [ApiClient].
///
/// `getReviews()` calls `GET /reviews` directly. `getProviderFor` and
/// `getOrderFor` follow the ids already carried by [Review] itself
/// (`providerId`, `orderId`) via `GET /{resource}/:id`, same style as
/// `HttpOrdersRepository`. `getProfileFor` chains through the
/// provider's `providerProfileId`.
///
/// `Review` carries no `serviceId` of its own — [getServiceFor] first
/// resolves the review's order (`getOrderFor`) and follows that
/// order's `serviceId` instead.
class HttpReviewsRepository implements ReviewsRepository {
  HttpReviewsRepository(this._apiClient);

  final ApiClient _apiClient;

  @override
  Future<List<Review>> getReviews() async {
    final json = await _apiClient.get('/reviews');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items.map(ReviewHttpMapper.fromJson).toList();
  }

  @override
  Future<Provider> getProviderFor(Review review) async {
    final json = await _apiClient.get('/providers/${review.providerId.value}');
    return ProviderHttpMapper.fromJson(json);
  }

  @override
  Future<Profile> getProfileFor(Review review) async {
    final provider = await getProviderFor(review);
    final json = await _apiClient.get(
      '/profiles/${provider.providerProfileId.value}',
    );
    return ProfileHttpMapper.fromJson(json);
  }

  @override
  Future<Order> getOrderFor(Review review) async {
    final json = await _apiClient.get('/orders/${review.orderId.value}');
    return OrderHttpMapper.fromJson(json);
  }

  @override
  Future<Service> getServiceFor(Review review) async {
    // Review has no serviceId of its own — go through its order.
    final order = await getOrderFor(review);
    final json = await _apiClient.get('/services/${order.serviceId.value}');
    return ServiceHttpMapper.fromJson(json);
  }
}
