import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';

/// Contract for reading the domain entities the Provider Services
/// screen needs. Returns only real domain entities — no `Map`, no
/// `dynamic`, no JSON. Implemented today by
/// `MockProviderServicesRepository`; a future
/// `ApiProviderServicesRepository` would implement this same
/// interface (see the feature README).
///
/// There is no id-based lookup yet — this feature shows a single fixed
/// provider's services (see the feature README for why).
abstract class ProviderServicesRepository {
  Provider getProvider();
  Profile getProfile();
  List<Service> getServices();
  Category getCategoryFor(Service service);
}
