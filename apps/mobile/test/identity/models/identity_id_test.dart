import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/identity/models/identity_id.dart';

void main() {
  test('creates unique ids', () {
    final a = IdentityId.create();
    final b = IdentityId.create();
    expect(a.value == b.value, isFalse);
  });

  test('wraps an existing string value', () {
    final id = IdentityId.fromString('fixed-id');
    expect(id.value, 'fixed-id');
  });

  test('is equal by value', () {
    final a = IdentityId.fromString('same-id');
    final b = IdentityId.fromString('same-id');
    expect(a, equals(b));
  });
}
