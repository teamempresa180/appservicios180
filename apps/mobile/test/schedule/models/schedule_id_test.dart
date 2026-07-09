import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/schedule/models/schedule_id.dart';

void main() {
  test('creates unique ids', () {
    final a = ScheduleId.create();
    final b = ScheduleId.create();
    expect(a.value == b.value, isFalse);
  });

  test('wraps an existing string value', () {
    final id = ScheduleId.fromString('fixed-id');
    expect(id.value, 'fixed-id');
  });

  test('is equal by value', () {
    final a = ScheduleId.fromString('same-id');
    final b = ScheduleId.fromString('same-id');
    expect(a, equals(b));
  });
}
