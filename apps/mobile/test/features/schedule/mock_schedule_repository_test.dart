import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/features/schedule/repositories/mock_schedule_repository.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/schedule/entities/schedule.dart';

void main() {
  group('MockScheduleRepository', () {
    final repository = MockScheduleRepository();

    test('getProvider returns a real Provider entity, not a map', () async {
      expect(await repository.getProvider(), isA<Provider>());
    });

    test('getSchedules returns real Schedule entities, not maps', () async {
      final schedules = await repository.getSchedules();
      expect(schedules, isNotEmpty);
      expect(schedules, everyElement(isA<Schedule>()));
    });

    test('returns six schedule blocks covering every status and type', () async {
      final schedules = await repository.getSchedules();
      expect(schedules.length, equals(6));
      expect(schedules.map((s) => s.status).toSet().length, equals(4));
      expect(schedules.map((s) => s.type).toSet().length, equals(4));
    });

    test('every schedule references the same provider returned', () async {
      final providerId = (await repository.getProvider()).id;
      final schedules = await repository.getSchedules();
      expect(
        schedules.every((s) => s.providerId == providerId),
        isTrue,
      );
    });

    test('is independent from every other feature mock data', () async {
      final provider = await repository.getProvider();
      expect(provider.id.value.startsWith('schedule-'), isTrue);
    });
  });
}
