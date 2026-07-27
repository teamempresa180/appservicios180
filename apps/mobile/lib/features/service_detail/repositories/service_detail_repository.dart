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
/// [getService] has no id parameter — it is only used as a fallback
/// when the caller reaches this screen without already knowing which
/// [Service] to show (e.g. a direct/test navigation). The normal path
/// (tapping a service card in Marketplace/Search, which always already
/// has the real [Service] in hand) passes it straight into
/// [getProviderFor]/[getCategoryFor]/[getReviewsFor] — real per-id
/// lookups, not a fixed record.
abstract class ServiceDetailRepository {
  Future<Service> getService();
  Future<Provider> getProviderFor(Service service);
  Future<Profile> getProviderProfileFor(Provider provider);
  Future<Category> getCategoryFor(Service service);
  Future<List<Review>> getReviewsFor(Service service);
}
