import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/notification/models/notification_id.dart';

void main() {
  test('creates unique ids', () {
    final a = NotificationId.create();
    final b = NotificationId.create();
    expect(a.value == b.value, isFalse);
  });

  test('wraps an existing string value', () {
    final id = NotificationId.fromString('fixed-id');
    expect(id.value, 'fixed-id');
  });

  test('is equal by value', () {
    final a = NotificationId.fromString('same-id');
    final b = NotificationId.fromString('same-id');
    expect(a, equals(b));
  });
}
