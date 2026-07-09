import '../../../availability/entities/availability.dart';
import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';

/// Contract for reading the domain entities a Provider Profile screen
/// needs. Returns only real domain entities — no `Map`, no `dynamic`.
/// Implemented today by `MockProviderProfileRepository`; a future
/// `ApiProviderProfileRepository` or `FirebaseProviderProfileRepository`
/// would implement this same interface (see the feature README).
///
/// There is no id-based lookup yet — this feature shows a single fixed
/// provider (see the feature README for why).
abstract class ProviderProfileRepository {
  Provider getProvider();
  Profile getProfile();
  Availability getAvailability();
  List<Review> getReviews();
  List<Service> getServices();
  List<Category> getCategories();
}
