import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/chat/models/chat_id.dart';

void main() {
  test('creates unique ids', () {
    final a = ChatId.create();
    final b = ChatId.create();
    expect(a.value == b.value, isFalse);
  });

  test('wraps an existing string value', () {
    final id = ChatId.fromString('fixed-id');
    expect(id.value, 'fixed-id');
  });

  test('is equal by value', () {
    final a = ChatId.fromString('same-id');
    final b = ChatId.fromString('same-id');
    expect(a, equals(b));
  });
}
