import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/provider/models/provider_id.dart';

void main() {
  test('creates unique ids', () {
    final a = ProviderId.create();
    final b = ProviderId.create();
    expect(a.value == b.value, isFalse);
  });

  test('wraps an existing string value', () {
    final id = ProviderId.fromString('fixed-id');
    expect(id.value, 'fixed-id');
  });

  test('is equal by value', () {
    final a = ProviderId.fromString('same-id');
    final b = ProviderId.fromString('same-id');
    expect(a, equals(b));
  });
}
