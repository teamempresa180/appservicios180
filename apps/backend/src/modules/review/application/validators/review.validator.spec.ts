import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { CreateReviewCommand } from '../commands/create-review.command';
import { UpdateReviewCommand } from '../commands/update-review.command';
import { ReviewValidator } from './review.validator';

describe('ReviewValidator', () => {
  function validCommand(
    overrides: Partial<{ orderId: string }> = {},
  ): CreateReviewCommand {
    return new CreateReviewCommand(
      overrides.orderId ?? 'order-1',
      'provider-1',
      'identity-1',
      5,
      'Great service',
      'Very professional and on time.',
    );
  }

  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ReviewValidator.validateCreate(validCommand()),
      ).not.toThrow();
    });

    it('rejects a blank orderId', () => {
      expect(() =>
        ReviewValidator.validateCreate(validCommand({ orderId: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects a non-numeric rating', () => {
      expect(() =>
        ReviewValidator.validateCreate(
          new CreateReviewCommand(
            'order-1',
            'provider-1',
            'identity-1',
            NaN,
            'title',
            'comment',
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a blank title', () => {
      expect(() =>
        ReviewValidator.validateCreate(
          new CreateReviewCommand(
            'order-1',
            'provider-1',
            'identity-1',
            5,
            '  ',
            'comment',
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ReviewValidator.validateUpdate(
          new UpdateReviewCommand('id-1', 'New title'),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        ReviewValidator.validateUpdate(new UpdateReviewCommand('  ')),
      ).toThrow(ValidationException);
    });

    it('rejects a blank comment when provided', () => {
      expect(() =>
        ReviewValidator.validateUpdate(
          new UpdateReviewCommand('id-1', undefined, '  '),
        ),
      ).toThrow(ValidationException);
    });
  });
});
