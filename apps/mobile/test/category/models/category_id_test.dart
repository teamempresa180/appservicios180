import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/category/models/category_id.dart';

void main() {
  test('creates unique ids', () {
    final a = CategoryId.create();
    final b = CategoryId.create();
    expect(a.value == b.value, isFalse);
  });

  test('wraps an existing string value', () {
    final id = CategoryId.fromString('fixed-id');
    expect(id.value, 'fixed-id');
  });

  test('is equal by value', () {
    final a = CategoryId.fromString('same-id');
    final b = CategoryId.fromString('same-id');
    expect(a, equals(b));
  });
}
