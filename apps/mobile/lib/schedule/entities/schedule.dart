import '../../core/base/entity.dart';
import '../../provider/models/provider_id.dart';
import '../models/schedule_id.dart';
import '../models/schedule_status.dart';
import '../models/schedule_type.dart';

/// Represents a specific time block in a provider's agenda.
/// Pure data holder — no bookings, no orders, no external calendars, no
/// reminders, no recurrence logic, no persistence, no business rules.
class Schedule extends Entity<ScheduleId> {
  const Schedule({
    required ScheduleId id,
    required this.providerId,
    required this.startDateTime,
    required this.endDateTime,
    required this.status,
    required this.type,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final ProviderId providerId;
  final DateTime startDateTime;
  final DateTime endDateTime;
  final ScheduleStatus status;
  final ScheduleType type;
  final DateTime createdAt;
  final DateTime updatedAt;
}
