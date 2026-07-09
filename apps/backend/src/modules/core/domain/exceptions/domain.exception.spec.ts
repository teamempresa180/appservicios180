import { DomainException } from './domain.exception';

class TestDomainException extends DomainException {
  constructor() {
    super('something went wrong');
  }
}

describe('DomainException', () => {
  it('carries the message and is an instance of Error', () => {
    const error = new TestDomainException();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainException);
    expect(error.message).toBe('something went wrong');
    expect(error.name).toBe('TestDomainException');
  });
});
