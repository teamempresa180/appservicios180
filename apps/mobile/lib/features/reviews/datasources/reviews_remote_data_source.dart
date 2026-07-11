import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';

/// Remote (API/Firebase) source for the domain entities the Reviews
/// screen needs. No implementation — see `PROJECT_STATUS.md` (Sprint
/// 2, Etapa 6).
abstract class ReviewsRemoteDataSource {
  Future<List<Review>> getReviews();
  Future<Provider> getProviderFor(Review review);
  Future<Profile> getProfileFor(Review review);
  Future<Order> getOrderFor(Review review);
  Future<Service> getServiceFor(Review review);
}
