import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';
import '../mock/mock_provider_services_data.dart';
import 'provider_services_repository.dart';

/// In-memory `ProviderServicesRepository` backed by fixed mock data.
/// No backend, no persistence, no network — see the feature README.
class MockProviderServicesRepository implements ProviderServicesRepository {
  @override
  Future<Provider> getProvider() => Future.value(mockServicesProvider);

  @override
  Future<Profile> getProfile() => Future.value(mockServicesProfile);

  @override
  Future<List<Service>> getServices() =>
      Future.value(List.unmodifiable(mockProviderServices));

  @override
  Future<Category> getCategoryFor(Service service) =>
      Future.value(mockServiceCategories[service.id]!);
}
