import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/features/tracking/entities/eta.dart';

void main() {
  test('minutesRemaining rounds up to the nearest whole minute', () {
    final calculatedAt = DateTime(2026, 1, 1, 12, 0, 0);
    final eta = ETA(
      arrivalTime: calculatedAt.add(const Duration(seconds: 90)),
      calculatedAt: calculatedAt,
    );

    expect(eta.minutesRemaining, 2);
  });

  test('minutesRemaining is zero once arrival time has passed', () {
    final calculatedAt = DateTime(2026, 1, 1, 12, 5);
    final eta = ETA(
      arrivalTime: DateTime(2026, 1, 1, 12, 0),
      calculatedAt: calculatedAt,
    );

    expect(eta.minutesRemaining, 0);
  });

  test('isStaleAt is false right after calculation', () {
    final calculatedAt = DateTime(2026, 1, 1, 12, 0);
    final eta = ETA(
      arrivalTime: calculatedAt.add(const Duration(minutes: 5)),
      calculatedAt: calculatedAt,
    );

    expect(eta.isStaleAt(calculatedAt.add(const Duration(seconds: 5))), isFalse);
  });

  test('isStaleAt is true after the default staleness window', () {
    final calculatedAt = DateTime(2026, 1, 1, 12, 0);
    final eta = ETA(
      arrivalTime: calculatedAt.add(const Duration(minutes: 5)),
      calculatedAt: calculatedAt,
    );

    expect(eta.isStaleAt(calculatedAt.add(const Duration(seconds: 45))), isTrue);
  });
}
