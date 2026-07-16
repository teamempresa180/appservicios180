import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/availability/entities/availability.dart';
import 'package:mobile/availability/models/availability_status.dart';
import 'package:mobile/features/availability/repositories/mock_availability_repository.dart';
import 'package:mobile/provider/entities/provider.dart';

void main() {
  group('MockAvailabilityRepository', () {
    final repository = MockAvailabilityRepository();

    test('getProvider returns a real Provider entity, not a map', () async {
      expect(await repository.getProvider(), isA<Provider>());
    });

    test('getAvailabilities returns real Availability entities, not maps', () async {
      final availabilities = await repository.getAvailabilities();
      expect(availabilities, isNotEmpty);
      expect(availabilities, everyElement(isA<Availability>()));
    });

    test('returns exactly one Availability per day of the week', () async {
      final availabilities = await repository.getAvailabilities();
      expect(availabilities.length, equals(7));
      final weekdays = availabilities
          .map((a) => a.availableFrom.weekday)
          .toSet();
      expect(weekdays, equals({1, 2, 3, 4, 5, 6, 7}));
    });

    test('six days are active and Sunday is inactive', () async {
      final availabilities = await repository.getAvailabilities();
      final active = availabilities.where(
        (a) => a.status == AvailabilityStatus.active,
      );
      final sunday = availabilities.firstWhere(
        (a) => a.availableFrom.weekday == DateTime.sunday,
      );
      expect(active.length, equals(6));
      expect(sunday.status, equals(AvailabilityStatus.inactive));
    });

    test('every availability references the same provider returned', () async {
      final providerId = (await repository.getProvider()).id;
      final availabilities = await repository.getAvailabilities();
      expect(
        availabilities.every((a) => a.providerId == providerId),
        isTrue,
      );
    });

    test('is independent from every other feature mock data', () async {
      final provider = await repository.getProvider();
      expect(provider.id.value.startsWith('availability-'), isTrue);
    });
  });
}
