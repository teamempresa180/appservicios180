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
  Service getService() => mockRequestServiceService;

  @override
  Provider getProvider() => mockRequestServiceProvider;

  @override
  Profile getProfile() => mockRequestServiceProfile;

  @override
  Category getCategory() => mockRequestServiceCategory;

  @override
  Availability getAvailability() => mockRequestServiceAvailability;

  @override
  Address getAddress() => mockRequestServiceAddress;
}
