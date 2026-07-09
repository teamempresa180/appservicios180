import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/schedule/entities/schedule.dart';
import 'package:mobile/schedule/models/schedule_id.dart';
import 'package:mobile/schedule/models/schedule_status.dart';
import 'package:mobile/schedule/models/schedule_type.dart';
import 'package:mobile/provider/models/provider_id.dart';

void main() {
  test('holds all the assigned properties', () {
    final id = ScheduleId.create();
    final providerId = ProviderId.create();
    final now = DateTime(2026, 1, 1);
    final schedule = Schedule(
      id: id,
      providerId: providerId,
      startDateTime: DateTime(2026, 2, 1, 8, 0),
      endDateTime: DateTime(2026, 2, 1, 10, 0),
      status: ScheduleStatus.open,
      type: ScheduleType.regular,
      createdAt: now,
      updatedAt: now,
    );

    expect(schedule.id, id);
    expect(schedule.providerId, providerId);
    expect(schedule.status, ScheduleStatus.open);
    expect(schedule.type, ScheduleType.regular);
  });

  test('is equal to another schedule with the same id', () {
    final id = ScheduleId.create();
    final providerId = ProviderId.create();
    final now = DateTime(2026, 1, 1);
    Schedule build() => Schedule(
      id: id,
      providerId: providerId,
      startDateTime: now,
      endDateTime: now,
      status: ScheduleStatus.open,
      type: ScheduleType.blocked,
      createdAt: now,
      updatedAt: now,
    );

    expect(build(), equals(build()));
  });
}
