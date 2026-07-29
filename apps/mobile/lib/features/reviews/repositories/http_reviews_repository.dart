import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../identity/models/identity_id.dart';
import '../../../order/entities/order.dart';
import '../../../order/models/order_id.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';
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
    // Review has no serviceId of its own — go through its order. Only
    // meaningful for a direct-hire order (`Order.serviceId` set) — an
    // open request's order may have none, in which case there is
    // genuinely no service to resolve.
    final order = await getOrderFor(review);
    final serviceId = order.serviceId;
    if (serviceId == null) {
      throw StateError('Order ${order.id.value} has no service assigned');
    }
    final json = await _apiClient.get('/services/${serviceId.value}');
    return ServiceHttpMapper.fromJson(json);
  }

  @override
  Future<Review> createReview({
    required OrderId orderId,
    required ProviderId providerId,
    required IdentityId reviewerIdentityId,
    required num rating,
    required String title,
    required String comment,
  }) async {
    final json = await _apiClient.post(
      '/reviews',
      data: {
        'orderId': orderId.value,
        'providerId': providerId.value,
        'reviewerIdentityId': reviewerIdentityId.value,
        'rating': rating,
        'title': title,
        'comment': comment,
        'status': 'PUBLISHED',
      },
    );
    return ReviewHttpMapper.fromJson(json);
  }
}
