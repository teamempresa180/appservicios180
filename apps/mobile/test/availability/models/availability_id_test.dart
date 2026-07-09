import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/availability/models/availability_id.dart';

void main() {
  test('creates unique ids', () {
    final a = AvailabilityId.create();
    final b = AvailabilityId.create();
    expect(a.value == b.value, isFalse);
  });

  test('wraps an existing string value', () {
    final id = AvailabilityId.fromString('fixed-id');
    expect(id.value, 'fixed-id');
  });

  test('is equal by value', () {
    final a = AvailabilityId.fromString('same-id');
    final b = AvailabilityId.fromString('same-id');
    expect(a, equals(b));
  });
}
