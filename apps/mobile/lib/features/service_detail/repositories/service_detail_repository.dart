import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';

/// Contract for reading the domain entities a Service Detail screen
/// needs. Returns only real domain entities — no `Map`, no `dynamic`.
/// Implemented today by `HttpServiceDetailRepository` (real backend) and
/// `MockServiceDetailRepository` (kept for tests/offline fallback, see
/// the feature README).
///
/// There is no id-based lookup yet — this feature shows a single fixed
/// service (see the feature README for why).
abstract class ServiceDetailRepository {
  Future<Service> getService();
  Future<Provider> getProvider();
  Future<Profile> getProviderProfile();
  Future<Category> getCategory();
  Future<List<Review>> getReviews();
}
