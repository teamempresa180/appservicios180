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
  Provider getProvider() => mockServicesProvider;

  @override
  Profile getProfile() => mockServicesProfile;

  @override
  List<Service> getServices() => List.unmodifiable(mockProviderServices);

  @override
  Category getCategoryFor(Service service) =>
      mockServiceCategories[service.id]!;
}
