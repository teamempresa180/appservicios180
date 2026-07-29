import '../../../identity/models/identity_id.dart';
import '../../../order/entities/order.dart';
import '../../../order/models/order_id.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';

/// Contract for reading the domain entities the Reviews screen needs.
/// Returns only real domain entities — no `Map`, no `dynamic`, no JSON.
/// Implemented today by `MockReviewsRepository`; a future
/// `ApiReviewsRepository` or `FirebaseReviewsRepository` would
/// implement this same interface (see the feature README).
///
/// Unlike a single-fixed-record feature, this one already shows a
/// **list** of reviews (not a single fixed record) — but still no
/// id-based lookup for a single review's own detail page.
abstract class ReviewsRepository {
  Future<List<Review>> getReviews();
  Future<Provider> getProviderFor(Review review);
  Future<Profile> getProfileFor(Review review);
  Future<Order> getOrderFor(Review review);
  Future<Service> getServiceFor(Review review);

  /// Submits a real rating for a completed order (`POST /reviews` on the
  /// real backend) — backs the "Calificar" action once an order is
  /// `Completed`. [status] should be `ReviewStatus.published` for a
  /// real user rating submitted from the UI.
  Future<Review> createReview({
    required OrderId orderId,
    required ProviderId providerId,
    required IdentityId reviewerIdentityId,
    required num rating,
    required String title,
    required String comment,
  });
}
