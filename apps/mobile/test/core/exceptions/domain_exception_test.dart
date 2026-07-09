import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/core/exceptions/domain_exception.dart';

class TestDomainException extends DomainException {
  const TestDomainException() : super('something went wrong');
}

void main() {
  test('carries the message and is an Exception', () {
    const error = TestDomainException();
    expect(error, isA<Exception>());
    expect(error.message, 'something went wrong');
    expect(error.toString(), contains('something went wrong'));
  });
}
