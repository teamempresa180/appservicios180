import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/utils/id_generator.dart';

void main() {
  final uuidV4 = RegExp(
    r'^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
  );

  test('generates a valid UUID v4 string', () {
    expect(uuidV4.hasMatch(generateId()), isTrue);
  });

  test('generates unique values across calls', () {
    final ids = List.generate(100, (_) => generateId()).toSet();
    expect(ids.length, 100);
  });
}
