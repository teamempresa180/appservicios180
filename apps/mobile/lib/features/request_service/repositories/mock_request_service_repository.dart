import '../../../address/entities/address.dart';
import '../../../availability/entities/availability.dart';
import '../../../category/entities/category.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../service/entities/service.dart';
import '../mock/mock_request_service_data.dart';
import 'request_service_repository.dart';

/// In-memory `RequestServiceRepository` backed by fixed mock data. No
/// backend, no persistence, no network — see the feature README.
class MockRequestServiceRepository implements RequestServiceRepository {
  @override
  Future<Service> getService() => Future.value(mockRequestServiceService);

  @override
  Future<Provider> getProvider() => Future.value(mockRequestServiceProvider);

  @override
  Future<Profile> getProfile() => Future.value(mockRequestServiceProfile);

  @override
  Future<Category> getCategory() => Future.value(mockRequestServiceCategory);

  @override
  Future<Availability> getAvailability() =>
      Future.value(mockRequestServiceAvailability);

  @override
  Future<Address> getAddress() => Future.value(mockRequestServiceAddress);
}
