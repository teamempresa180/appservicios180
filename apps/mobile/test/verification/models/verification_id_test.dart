import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/verification/models/verification_id.dart';

void main() {
  test('creates unique ids', () {
    final a = VerificationId.create();
    final b = VerificationId.create();
    expect(a.value == b.value, isFalse);
  });

  test('is equal by value', () {
    final a = VerificationId.fromString('same-id');
    final b = VerificationId.fromString('same-id');
    expect(a, equals(b));
  });
}
