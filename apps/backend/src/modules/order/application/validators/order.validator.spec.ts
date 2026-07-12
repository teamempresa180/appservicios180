import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { OrderPriority } from '../../domain/value-objects/order-priority.value-object';
import { CreateOrderCommand } from '../commands/create-order.command';
import { UpdateOrderCommand } from '../commands/update-order.command';
import { OrderValidator } from './order.validator';

describe('OrderValidator', () => {
  function validCommand(
    overrides: Partial<{ identityId: string }> = {},
  ): CreateOrderCommand {
    return new CreateOrderCommand(
      overrides.identityId ?? 'identity-1',
      'provider-1',
      'service-1',
      'Fix the sink',
      'The kitchen sink is leaking',
      new Date('2026-01-01T08:00:00Z'),
      OrderPriority.Medium,
    );
  }

  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() => OrderValidator.validateCreate(validCommand())).not.toThrow();
    });

    it('rejects a blank identityId', () => {
      expect(() =>
        OrderValidator.validateCreate(validCommand({ identityId: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid scheduledDate', () => {
      expect(() =>
        OrderValidator.validateCreate(
          new CreateOrderCommand(
            'identity-1',
            'provider-1',
            'service-1',
            'Fix the sink',
            'desc',
            new Date('invalid'),
            OrderPriority.Medium,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid priority', () => {
      expect(() =>
        OrderValidator.validateCreate(
          new CreateOrderCommand(
            'identity-1',
            'provider-1',
            'service-1',
            'Fix the sink',
            'desc',
            new Date('2026-01-01T08:00:00Z'),
            'INVALID' as OrderPriority,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        OrderValidator.validateUpdate(
          new UpdateOrderCommand('id-1', 'New title'),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        OrderValidator.validateUpdate(new UpdateOrderCommand('  ')),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid priority when provided', () => {
      expect(() =>
        OrderValidator.validateUpdate(
          new UpdateOrderCommand(
            'id-1',
            undefined,
            undefined,
            undefined,
            'INVALID' as OrderPriority,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
