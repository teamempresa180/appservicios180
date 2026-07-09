import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/message/models/message_id.dart';

void main() {
  test('creates unique ids', () {
    final a = MessageId.create();
    final b = MessageId.create();
    expect(a.value == b.value, isFalse);
  });

  test('wraps an existing string value', () {
    final id = MessageId.fromString('fixed-id');
    expect(id.value, 'fixed-id');
  });

  test('is equal by value', () {
    final a = MessageId.fromString('same-id');
    final b = MessageId.fromString('same-id');
    expect(a, equals(b));
  });
}
