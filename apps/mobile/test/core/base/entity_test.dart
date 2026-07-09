import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/base/entity.dart';

class TestEntity extends Entity<String> {
  const TestEntity(super.id);
}

class OtherEntity extends Entity<String> {
  const OtherEntity(super.id);
}

void main() {
  test('exposes its id', () {
    const entity = TestEntity('id-1');
    expect(entity.id, 'id-1');
  });

  test('is equal to another entity of the same type with the same id', () {
    const a = TestEntity('id-1');
    const b = TestEntity('id-1');
    expect(a, equals(b));
  });

  test('is not equal when ids differ', () {
    const a = TestEntity('id-1');
    const b = TestEntity('id-2');
    expect(a == b, isFalse);
  });

  test('is not equal to an entity of a different type sharing the same id', () {
    const a = TestEntity('id-1');
    const b = OtherEntity('id-1');
    expect(a == b, isFalse);
  });
}
