import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/review/models/review_id.dart';

void main() {
  test('creates unique ids', () {
    final a = ReviewId.create();
    final b = ReviewId.create();
    expect(a.value == b.value, isFalse);
  });

  test('wraps an existing string value', () {
    final id = ReviewId.fromString('fixed-id');
    expect(id.value, 'fixed-id');
  });

  test('is equal by value', () {
    final a = ReviewId.fromString('same-id');
    final b = ReviewId.fromString('same-id');
    expect(a, equals(b));
  });
}
