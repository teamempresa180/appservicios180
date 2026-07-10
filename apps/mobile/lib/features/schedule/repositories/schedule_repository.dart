import '../../../provider/entities/provider.dart';
import '../../../schedule/entities/schedule.dart';

/// Contract for reading the domain entities the Schedule screen needs.
/// Returns only real domain entities — no `Map`, no `dynamic`, no
/// JSON. Implemented today by `MockScheduleRepository`; a future
/// `ApiScheduleRepository` would implement this same interface (see
/// the feature README).
///
/// There is no id-based lookup yet — this feature shows a single fixed
/// provider's agenda (see the feature README for why).
abstract class ScheduleRepository {
  Provider getProvider();
  List<Schedule> getSchedules();
}
