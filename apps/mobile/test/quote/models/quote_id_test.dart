import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/quote/models/quote_id.dart';

void main() {
  test('creates unique ids', () {
    final a = QuoteId.create();
    final b = QuoteId.create();
    expect(a.value == b.value, isFalse);
  });

  test('wraps an existing string value', () {
    final id = QuoteId.fromString('fixed-id');
    expect(id.value, 'fixed-id');
  });

  test('is equal by value', () {
    final a = QuoteId.fromString('same-id');
    final b = QuoteId.fromString('same-id');
    expect(a, equals(b));
  });
}
