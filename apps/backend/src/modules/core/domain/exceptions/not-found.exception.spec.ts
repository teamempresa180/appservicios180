import { DomainException } from './domain.exception';
import { NotFoundException } from './not-found.exception';

describe('NotFoundException', () => {
  it('carries the message and is a DomainException', () => {
    const error = new NotFoundException('Identity a1 not found');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainException);
    expect(error).toBeInstanceOf(NotFoundException);
    expect(error.message).toBe('Identity a1 not found');
    expect(error.name).toBe('NotFoundException');
  });
});
