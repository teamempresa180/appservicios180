import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';
import '../../../service/models/service_status.dart';
import '../../../service/models/service_type.dart';

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

  Future<Service> createService({
    required Provider provider,
    required Category category,
    required String name,
    required String description,
    required num basePrice,
    required int estimatedDuration,
    required ServiceType type,
  });

  /// Only `basePrice`/`estimatedDuration`/`status` are updatable —
  /// matches the backend's `UpdateServiceRequestDto` contract
  /// (name/description aren't). `status` is what "Pausar" sets to
  /// [ServiceStatus.inactive].
  Future<Service> updateService(
    Service service, {
    num? basePrice,
    int? estimatedDuration,
    ServiceStatus? status,
  });

  Future<void> deleteService(Service service);
}
