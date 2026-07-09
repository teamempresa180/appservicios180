import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/base/value_object.dart';

class TestValueObject extends ValueObject {
  const TestValueObject(this.value);

  final String value;

  @override
  List<Object?> get props => [value];
}

void main() {
  test('is equal when props are equal', () {
    const a = TestValueObject('same');
    const b = TestValueObject('same');
    expect(a, equals(b));
  });

  test('is not equal when props differ', () {
    const a = TestValueObject('one');
    const b = TestValueObject('other');
    expect(a == b, isFalse);
  });
}
