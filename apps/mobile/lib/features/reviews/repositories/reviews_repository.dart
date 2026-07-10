import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
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
  List<Review> getReviews();
  Provider getProviderFor(Review review);
  Profile getProfileFor(Review review);
  Order getOrderFor(Review review);
  Service getServiceFor(Review review);
}
