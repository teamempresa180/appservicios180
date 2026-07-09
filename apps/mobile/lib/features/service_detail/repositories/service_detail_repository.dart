import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';

/// Contract for reading the domain entities a Service Detail screen
/// needs. Returns only real domain entities — no `Map`, no `dynamic`.
/// Implemented today by `MockServiceDetailRepository`; a future
/// `ApiServiceDetailRepository` or `FirebaseServiceDetailRepository`
/// would implement this same interface (see the feature README).
///
/// There is no id-based lookup yet — this feature shows a single fixed
/// service (see the feature README for why).
abstract class ServiceDetailRepository {
  Service getService();
  Provider getProvider();
  Profile getProviderProfile();
  Category getCategory();
  List<Review> getReviews();
}
