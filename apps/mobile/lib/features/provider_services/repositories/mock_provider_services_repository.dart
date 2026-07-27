import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';
import '../../../service/models/service_status.dart';
import '../../../service/models/service_type.dart';
import '../mock/mock_provider_services_data.dart';
import 'provider_services_repository.dart';

/// In-memory `ProviderServicesRepository` backed by fixed mock data.
/// No backend, no persistence, no network — see the feature README.
/// Keeps its own mutable copy of [mockProviderServices] (same pattern
/// as `MockAddressManagementRepository`) so create/update/delete
/// actually change what [getServices] returns afterwards.
class MockProviderServicesRepository implements ProviderServicesRepository {
  final List<Service> _services = List.of(mockProviderServices);
  final Map<ServiceId, Category> _categories = Map.of(mockServiceCategories);

  @override
  Future<Provider> getProvider() => Future.value(mockServicesProvider);

  @override
  Future<Profile> getProfile() => Future.value(mockServicesProfile);

  @override
  Future<List<Service>> getServices() =>
      Future.value(List.unmodifiable(_services));

  @override
  Future<Category> getCategoryFor(Service service) =>
      Future.value(_categories[service.id]!);

  @override
  Future<Service> createService({
    required Provider provider,
    required Category category,
    required String name,
    required String description,
    required num basePrice,
    required int estimatedDuration,
    required ServiceType type,
  }) async {
    final service = Service(
      id: ServiceId.create(),
      providerId: provider.id,
      categoryId: category.id,
      name: name,
      description: description,
      basePrice: basePrice,
      estimatedDuration: estimatedDuration,
      status: ServiceStatus.active,
      type: type,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
    _services.add(service);
    _categories[service.id] = category;
    return service;
  }

  @override
  Future<Service> updateService(
    Service service, {
    num? basePrice,
    int? estimatedDuration,
    ServiceStatus? status,
  }) async {
    final updated = service.copyWith(
      basePrice: basePrice,
      estimatedDuration: estimatedDuration,
      status: status,
    );
    final index = _services.indexWhere((s) => s.id == service.id);
    if (index != -1) _services[index] = updated;
    return updated;
  }

  @override
  Future<void> deleteService(Service service) async {
    _services.removeWhere((s) => s.id == service.id);
    _categories.remove(service.id);
  }
}
