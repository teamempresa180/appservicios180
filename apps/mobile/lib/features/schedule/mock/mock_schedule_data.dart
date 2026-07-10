import '../../../identity/models/identity_id.dart';
import '../../../profiles/models/profile_id.dart';
import '../../../provider/entities/provider.dart';
import '../../../provider/models/provider_experience.dart';
import '../../../provider/models/provider_id.dart';
import '../../../provider/models/provider_status.dart';
import '../../../provider/models/provider_type.dart';
import '../../../schedule/entities/schedule.dart';
import '../../../schedule/models/schedule_id.dart';
import '../../../schedule/models/schedule_status.dart';
import '../../../schedule/models/schedule_type.dart';

final DateTime _seedTimestamp = DateTime(2026, 1, 1);

/// A known Monday (2024-01-01) used only as a base date for each mock
/// `Schedule` block's `startDateTime`/`endDateTime` — same approach
/// already used in `mock_availability_data.dart`.
final DateTime _monday = DateTime(2024, 1, 1);

DateTime _at(int dayOffset, int hour, int minute) {
  final day = _monday.add(Duration(days: dayOffset));
  return DateTime(day.year, day.month, day.day, hour, minute);
}

final Provider mockScheduleProvider = Provider(
  id: ProviderId.fromString('schedule-provider-emilio'),
  identityId: IdentityId.fromString('schedule-identity-emilio'),
  providerProfileId: ProfileId.fromString('schedule-profile-emilio'),
  status: ProviderStatus.active,
  type: ProviderType.independent,
  experience: ProviderExperience.advanced,
  biography: 'Electricista independiente, especializado en instalaciones.',
  yearsOfExperience: 6,
  createdAt: _seedTimestamp,
  updatedAt: _seedTimestamp,
);

/// Fixed, deterministic mock domain entities for the Schedule feature.
/// Intentionally its own set — independent of every other feature's
/// mock data (see the feature README). Six real `Schedule` blocks
/// spanning the same reference week as `mock_availability_data.dart`,
/// covering every `ScheduleStatus`/`ScheduleType` value at least once.
final List<Schedule> mockSchedules = [
  Schedule(
    id: ScheduleId.fromString('schedule-monday-morning'),
    providerId: mockScheduleProvider.id,
    startDateTime: _at(0, 8, 0),
    endDateTime: _at(0, 11, 0),
    status: ScheduleStatus.open,
    type: ScheduleType.regular,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Schedule(
    id: ScheduleId.fromString('schedule-monday-afternoon'),
    providerId: mockScheduleProvider.id,
    startDateTime: _at(0, 14, 0),
    endDateTime: _at(0, 17, 0),
    status: ScheduleStatus.completed,
    type: ScheduleType.regular,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Schedule(
    id: ScheduleId.fromString('schedule-wednesday-morning'),
    providerId: mockScheduleProvider.id,
    startDateTime: _at(2, 9, 0),
    endDateTime: _at(2, 12, 0),
    status: ScheduleStatus.open,
    type: ScheduleType.special,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Schedule(
    id: ScheduleId.fromString('schedule-thursday-full'),
    providerId: mockScheduleProvider.id,
    startDateTime: _at(3, 8, 0),
    endDateTime: _at(3, 18, 0),
    status: ScheduleStatus.blocked,
    type: ScheduleType.blocked,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Schedule(
    id: ScheduleId.fromString('schedule-friday-morning'),
    providerId: mockScheduleProvider.id,
    startDateTime: _at(4, 8, 0),
    endDateTime: _at(4, 12, 0),
    status: ScheduleStatus.open,
    type: ScheduleType.regular,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
  Schedule(
    id: ScheduleId.fromString('schedule-saturday-morning'),
    providerId: mockScheduleProvider.id,
    startDateTime: _at(5, 9, 0),
    endDateTime: _at(5, 13, 0),
    status: ScheduleStatus.cancelled,
    type: ScheduleType.other,
    createdAt: _seedTimestamp,
    updatedAt: _seedTimestamp,
  ),
];
