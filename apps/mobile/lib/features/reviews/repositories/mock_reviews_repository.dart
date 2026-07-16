import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';
import '../mock/mock_reviews_data.dart';
import 'reviews_repository.dart';

/// In-memory `ReviewsRepository` backed by fixed mock data. No
/// backend, no persistence, no network — see the feature README.
class MockReviewsRepository implements ReviewsRepository {
  @override
  Future<List<Review>> getReviews() =>
      Future.value(List.unmodifiable(mockReviews));

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
}
