import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';

/// Remote (API/Firebase) source for the domain entities the Provider
/// Services screen needs. No implementation — see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
abstract class ProviderServicesRemoteDataSource {
  Future<Provider> getProvider();
  Future<Profile> getProfile();
  Future<List<Service>> getServices();
  Future<Category> getCategoryFor(Service service);
}
