import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/trust/models/trust_id.dart';

void main() {
  test('creates unique ids', () {
    final a = TrustId.create();
    final b = TrustId.create();
    expect(a.value == b.value, isFalse);
  });

  test('is equal by value', () {
    final a = TrustId.fromString('same-id');
    final b = TrustId.fromString('same-id');
    expect(a, equals(b));
  });
}
