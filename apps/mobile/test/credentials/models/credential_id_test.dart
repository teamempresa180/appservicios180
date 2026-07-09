import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/credentials/models/credential_id.dart';

void main() {
  test('creates unique ids', () {
    final a = CredentialId.create();
    final b = CredentialId.create();
    expect(a.value == b.value, isFalse);
  });

  test('is equal by value', () {
    final a = CredentialId.fromString('same-id');
    final b = CredentialId.fromString('same-id');
    expect(a, equals(b));
  });
}
