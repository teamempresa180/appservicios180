import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/payment/models/payment_id.dart';

void main() {
  test('creates unique ids', () {
    final a = PaymentId.create();
    final b = PaymentId.create();
    expect(a.value == b.value, isFalse);
  });

  test('wraps an existing string value', () {
    final id = PaymentId.fromString('fixed-id');
    expect(id.value, 'fixed-id');
  });

  test('is equal by value', () {
    final a = PaymentId.fromString('same-id');
    final b = PaymentId.fromString('same-id');
    expect(a, equals(b));
  });
}
