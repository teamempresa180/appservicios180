import '../../../availability/entities/availability.dart';
import '../../../provider/entities/provider.dart';
import '../mock/mock_availability_data.dart';
import 'availability_repository.dart';

/// In-memory `AvailabilityRepository` backed by fixed mock data. No
/// backend, no persistence, no network — see the feature README.
class MockAvailabilityRepository implements AvailabilityRepository {
  @override
  Provider getProvider() => mockAvailabilityProvider;

  @override
  List<Availability> getAvailabilities() =>
      List.unmodifiable(mockAvailabilities);
}
