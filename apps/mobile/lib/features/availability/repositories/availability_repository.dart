import '../../../availability/entities/availability.dart';
import '../../../provider/entities/provider.dart';

/// Contract for reading the domain entities the Availability screen
/// needs. Returns only real domain entities — no `Map`, no `dynamic`,
/// no JSON. Implemented today by `MockAvailabilityRepository`; a
/// future `ApiAvailabilityRepository` would implement this same
/// interface (see the feature README).
///
/// There is no id-based lookup yet — this feature shows a single fixed
/// provider's weekly schedule (see the feature README for why).
abstract class AvailabilityRepository {
  Provider getProvider();
  List<Availability> getAvailabilities();
}
