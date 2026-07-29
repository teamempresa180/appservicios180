import '../../../identity/models/identity_id.dart';
import '../../../order/entities/order.dart';
import '../../../order/models/order_id.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_id.dart';
import '../../../review/entities/review.dart';
import '../../../review/models/review_id.dart';
import '../../../review/models/review_rating.dart';
import '../../../review/models/review_status.dart';
import '../../../service/entities/service.dart';
import '../mock/mock_reviews_data.dart';
import 'reviews_repository.dart';

/// In-memory `ReviewsRepository` backed by fixed mock data. No
/// backend, no persistence, no network — see the feature README.
class MockReviewsRepository implements ReviewsRepository {
  final List<Review> _reviews = List.of(mockReviews);

  @override
  Future<List<Review>> getReviews() =>
      Future.value(List.unmodifiable(_reviews));

  @override
  Future<Provider> getProviderFor(Review review) =>
      Future.value(mockReviewProviders[review.id]!);

  @override
  Future<Profile> getProfileFor(Review review) =>
      Future.value(mockReviewProfiles[review.id]!);

  @override
  Future<Order> getOrderFor(Review review) =>
      Future.value(mockReviewOrders[review.id]!);

  @override
  Future<Service> getServiceFor(Review review) =>
      Future.value(mockReviewServices[review.id]!);

  @override
  Future<Review> createReview({
    required OrderId orderId,
    required ProviderId providerId,
    required IdentityId reviewerIdentityId,
    required num rating,
    required String title,
    required String comment,
  }) async {
    final now = DateTime.now();
    final review = Review(
      id: ReviewId.create(),
      orderId: orderId,
      providerId: providerId,
      reviewerIdentityId: reviewerIdentityId,
      rating: ReviewRating.of(rating),
      title: title,
      comment: comment,
      status: ReviewStatus.published,
      createdAt: now,
      updatedAt: now,
    );
    _reviews.add(review);
    return review;
  }
}
