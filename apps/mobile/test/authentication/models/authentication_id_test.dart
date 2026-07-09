import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/authentication/models/authentication_id.dart';

void main() {
  test('creates unique ids', () {
    final a = AuthenticationId.create();
    final b = AuthenticationId.create();
    expect(a.value == b.value, isFalse);
  });

  test('is equal by value', () {
    final a = AuthenticationId.fromString('same-id');
    final b = AuthenticationId.fromString('same-id');
    expect(a, equals(b));
  });
}
