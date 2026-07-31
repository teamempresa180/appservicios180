import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/features/tracking/entities/current_location.dart';

void main() {
  test('holds all the assigned properties', () {
    final recordedAt = DateTime(2026, 1, 1, 12, 30);
    final location = CurrentLocation(
      latitude: 4.710,
      longitude: -74.072,
      recordedAt: recordedAt,
      headingDegrees: 87.5,
      speedMetersPerSecond: 8.3,
    );

    expect(location.latitude, 4.710);
    expect(location.longitude, -74.072);
    expect(location.recordedAt, recordedAt);
    expect(location.headingDegrees, 87.5);
    expect(location.speedMetersPerSecond, 8.3);
  });

  test('allows heading and speed to be omitted', () {
    final location = CurrentLocation(
      latitude: 0,
      longitude: 0,
      recordedAt: DateTime(2026, 1, 1),
    );

    expect(location.headingDegrees, isNull);
    expect(location.speedMetersPerSecond, isNull);
  });

  test('is equal by value', () {
    final recordedAt = DateTime(2026, 1, 1);
    final a = CurrentLocation(
      latitude: 1,
      longitude: 2,
      recordedAt: recordedAt,
    );
    final b = CurrentLocation(
      latitude: 1,
      longitude: 2,
      recordedAt: recordedAt,
    );

    expect(a, equals(b));
  });
}
