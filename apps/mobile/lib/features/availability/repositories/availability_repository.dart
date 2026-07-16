import '../../../availability/entities/availability.dart';
import '../../../provider/entities/provider.dart';

/// Contract for reading the domain entities the Availability screen
/// needs. Returns only real domain entities — no `Map`, no `dynamic`,
/// no JSON. Implemented today by `HttpAvailabilityRepository` (real
/// backend) and `MockAvailabilityRepository` (kept for tests/offline
/// fallback, see the feature README).
///
/// There is no id-based lookup yet — this feature shows a single fixed
/// provider's weekly schedule (see the feature README for why).
abstract class AvailabilityRepository {
  Future<Provider> getProvider();
  Future<List<Availability>> getAvailabilities();
}
