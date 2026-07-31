import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/features/tracking/entities/distance_remaining.dart';

void main() {
  test('formats sub-kilometer distances in meters', () {
    expect(const DistanceRemaining(850).formatted, '850 m');
    expect(const DistanceRemaining(4).formatted, '4 m');
  });

  test('formats distances of 1km or more in kilometers with one decimal', () {
    expect(const DistanceRemaining(1000).formatted, '1.0 km');
    expect(const DistanceRemaining(1250).formatted, '1.3 km');
  });

  test('is equal by value', () {
    expect(const DistanceRemaining(500), equals(const DistanceRemaining(500)));
  });
}
