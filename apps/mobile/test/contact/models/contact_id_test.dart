import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/contact/models/contact_id.dart';

void main() {
  test('creates unique ids', () {
    final a = ContactId.create();
    final b = ContactId.create();
    expect(a.value == b.value, isFalse);
  });

  test('is equal by value', () {
    final a = ContactId.fromString('same-id');
    final b = ContactId.fromString('same-id');
    expect(a, equals(b));
  });
}
