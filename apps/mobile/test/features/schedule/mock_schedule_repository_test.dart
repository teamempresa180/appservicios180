import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/features/schedule/repositories/mock_schedule_repository.dart';
import 'package:mobile/provider/entities/provider.dart';
import 'package:mobile/schedule/entities/schedule.dart';

void main() {
  group('MockScheduleRepository', () {
    final repository = MockScheduleRepository();

    test('getProvider returns a real Provider entity, not a map', () {
      expect(repository.getProvider(), isA<Provider>());
    });

    test('getSchedules returns real Schedule entities, not maps', () {
      final schedules = repository.getSchedules();
      expect(schedules, isNotEmpty);
      expect(schedules, everyElement(isA<Schedule>()));
    });

    test('returns six schedule blocks covering every status and type', () {
      final schedules = repository.getSchedules();
      expect(schedules.length, equals(6));
      expect(schedules.map((s) => s.status).toSet().length, equals(4));
      expect(schedules.map((s) => s.type).toSet().length, equals(4));
    });

    test('every schedule references the same provider returned', () {
      final providerId = repository.getProvider().id;
      expect(
        repository.getSchedules().every((s) => s.providerId == providerId),
        isTrue,
      );
    });

    test('is independent from every other feature mock data', () {
      expect(repository.getProvider().id.value.startsWith('schedule-'), isTrue);
    });
  });
}
