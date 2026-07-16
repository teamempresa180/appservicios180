import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';

/// Contract for reading the domain entities the Provider Services
/// screen needs. Returns only real domain entities — no `Map`, no
/// `dynamic`, no JSON. Implemented today by
/// `MockProviderServicesRepository` (kept for tests/offline fallback)
/// and `HttpProviderServicesRepository` (real backend, see the feature
/// README).
///
/// There is no id-based lookup yet for `getProvider`/`getProfile`/
/// `getServices` — this feature shows a single fixed provider's
/// services (see the feature README for why).
abstract class ProviderServicesRepository {
  Future<Provider> getProvider();
  Future<Profile> getProfile();
  Future<List<Service>> getServices();
  Future<Category> getCategoryFor(Service service);
}
