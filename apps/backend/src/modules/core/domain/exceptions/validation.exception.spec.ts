import { DomainException } from './domain.exception';
import { ValidationException } from './validation.exception';

describe('ValidationException', () => {
  it('carries the message and is a DomainException', () => {
    const error = new ValidationException('fullName is required');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainException);
    expect(error).toBeInstanceOf(ValidationException);
    expect(error.message).toBe('fullName is required');
    expect(error.name).toBe('ValidationException');
  });
});
