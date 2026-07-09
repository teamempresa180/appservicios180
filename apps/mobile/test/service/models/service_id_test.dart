import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/service/models/service_id.dart';

void main() {
  test('creates unique ids', () {
    final a = ServiceId.create();
    final b = ServiceId.create();
    expect(a.value == b.value, isFalse);
  });

  test('wraps an existing string value', () {
    final id = ServiceId.fromString('fixed-id');
    expect(id.value, 'fixed-id');
  });

  test('is equal by value', () {
    final a = ServiceId.fromString('same-id');
    final b = ServiceId.fromString('same-id');
    expect(a, equals(b));
  });
}
