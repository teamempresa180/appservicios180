import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';

/// Local (on-device) source for the domain entities the Reviews
/// screen needs. No implementation — see `PROJECT_STATUS.md` (Sprint
/// 2, Etapa 6).
abstract class ReviewsLocalDataSource {
  List<Review> getReviews();
  Provider getProviderFor(Review review);
  Profile getProfileFor(Review review);
  Order getOrderFor(Review review);
  Service getServiceFor(Review review);
}
