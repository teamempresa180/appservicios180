import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/order/models/order_id.dart';

void main() {
  test('creates unique ids', () {
    final a = OrderId.create();
    final b = OrderId.create();
    expect(a.value == b.value, isFalse);
  });

  test('wraps an existing string value', () {
    final id = OrderId.fromString('fixed-id');
    expect(id.value, 'fixed-id');
  });

  test('is equal by value', () {
    final a = OrderId.fromString('same-id');
    final b = OrderId.fromString('same-id');
    expect(a, equals(b));
  });
}
