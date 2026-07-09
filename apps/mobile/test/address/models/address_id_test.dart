import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/address/models/address_id.dart';

void main() {
  test('creates unique ids', () {
    final a = AddressId.create();
    final b = AddressId.create();
    expect(a.value == b.value, isFalse);
  });

  test('is equal by value', () {
    final a = AddressId.fromString('same-id');
    final b = AddressId.fromString('same-id');
    expect(a, equals(b));
  });
}
