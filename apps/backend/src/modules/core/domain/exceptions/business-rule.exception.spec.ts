import { DomainException } from './domain.exception';
import { BusinessRuleException } from './business-rule.exception';

describe('BusinessRuleException', () => {
  it('carries the message and is a DomainException', () => {
    const error = new BusinessRuleException(
      'Order already has an accepted Quote',
    );
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainException);
    expect(error).toBeInstanceOf(BusinessRuleException);
    expect(error.message).toBe('Order already has an accepted Quote');
    expect(error.name).toBe('BusinessRuleException');
  });
});
