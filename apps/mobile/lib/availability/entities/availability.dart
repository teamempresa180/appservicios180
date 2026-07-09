import '../../core/base/entity.dart';
import '../../provider/models/provider_id.dart';
import '../models/availability_id.dart';
import '../models/availability_status.dart';
import '../models/availability_type.dart';

/// Represents the general availability of a provider to render services.
/// Pure data holder — no schedule, no bookings, no specific time slots, no
/// vacations, no zones, no persistence, no business rules.
class Availability extends Entity<AvailabilityId> {
  const Availability({
    required AvailabilityId id,
    required this.providerId,
    required this.status,
    required this.type,
    required this.availableFrom,
    required this.availableTo,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final ProviderId providerId;
  final AvailabilityStatus status;
  final AvailabilityType type;
  final DateTime availableFrom;
  final DateTime availableTo;
  final DateTime createdAt;
  final DateTime updatedAt;
}
