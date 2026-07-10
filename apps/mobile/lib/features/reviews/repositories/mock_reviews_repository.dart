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
  List<Review> getReviews() => List.unmodifiable(mockReviews);

  @override
  Provider getProviderFor(Review review) => mockReviewProviders[review.id]!;

  @override
  Profile getProfileFor(Review review) => mockReviewProfiles[review.id]!;

  @override
  Order getOrderFor(Review review) => mockReviewOrders[review.id]!;

  @override
  Service getServiceFor(Review review) => mockReviewServices[review.id]!;
}
