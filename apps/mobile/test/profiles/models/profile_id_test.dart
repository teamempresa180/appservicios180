import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/profiles/models/profile_id.dart';

void main() {
  test('creates unique ids', () {
    final a = ProfileId.create();
    final b = ProfileId.create();
    expect(a.value == b.value, isFalse);
  });

  test('is equal by value', () {
    final a = ProfileId.fromString('same-id');
    final b = ProfileId.fromString('same-id');
    expect(a, equals(b));
  });
}
