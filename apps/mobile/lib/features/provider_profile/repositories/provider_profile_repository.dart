import '../../../availability/entities/availability.dart';
import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';

/// Contract for reading the domain entities a Provider Profile screen
/// needs. Returns only real domain entities — no `Map`, no `dynamic`.
/// Implemented today by `MockProviderProfileRepository` (in-memory) and
/// `HttpProviderProfileRepository` (real backend, see the feature
/// README).
///
/// [getProvider] has no id parameter — only used as a fallback when the
/// caller reaches this screen without already knowing which [Provider]
/// to show (e.g. a direct/test navigation). The normal path (tapping a
/// provider card in Marketplace, or the provider section of Service
/// Detail — both already have the real [Provider]/[Profile] in hand)
/// passes it into the "for(Provider)" getters below — real per-id
/// lookups, not a fixed record.
abstract class ProviderProfileRepository {
  Future<Provider> getProvider();
  Future<Profile> getProfileFor(Provider provider);
  Future<Availability> getAvailabilityFor(Provider provider);
  Future<List<Review>> getReviewsFor(Provider provider);
  Future<List<Service>> getServicesFor(Provider provider);
  Future<List<Category>> getCategoriesFor(List<Service> services);
}
