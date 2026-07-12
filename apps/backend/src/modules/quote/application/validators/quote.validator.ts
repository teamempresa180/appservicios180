import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { QuoteType } from '../../domain/value-objects/quote-type.value-object';
import { CreateQuoteCommand } from '../commands/create-quote.command';
import { UpdateQuoteCommand } from '../commands/update-quote.command';

/**
 * Structural validation for Quote commands — required fields,
 * well-formed values. No uniqueness-per-Order/Provider check —
 * `findByOrderId` returns `Quote[]`, so multiple quotes per Order are
 * allowed.
 */
export class QuoteValidator {
  static validateCreate(command: CreateQuoteCommand): void {
    if (!command.orderId?.trim()) {
      throw new ValidationException('orderId is required');
    }
    if (!command.providerId?.trim()) {
      throw new ValidationException('providerId is required');
    }
    if (
      typeof command.proposedPrice !== 'number' ||
      Number.isNaN(command.proposedPrice) ||
      command.proposedPrice < 0
    ) {
      throw new ValidationException(
        'proposedPrice must be a non-negative number',
      );
    }
    if (
      typeof command.estimatedDuration !== 'number' ||
      Number.isNaN(command.estimatedDuration) ||
      command.estimatedDuration < 0
    ) {
      throw new ValidationException(
        'estimatedDuration must be a non-negative number',
      );
    }
    if (!command.notes?.trim()) {
      throw new ValidationException('notes is required');
    }
    if (!Object.values(QuoteType).includes(command.type)) {
      throw new ValidationException(
        `type must be one of: ${Object.values(QuoteType).join(', ')}`,
      );
    }
  }

  static validateUpdate(command: UpdateQuoteCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (
      command.proposedPrice !== undefined &&
      (typeof command.proposedPrice !== 'number' ||
        Number.isNaN(command.proposedPrice) ||
        command.proposedPrice < 0)
    ) {
      throw new ValidationException(
        'proposedPrice must be a non-negative number',
      );
    }
    if (
      command.estimatedDuration !== undefined &&
      (typeof command.estimatedDuration !== 'number' ||
        Number.isNaN(command.estimatedDuration) ||
        command.estimatedDuration < 0)
    ) {
      throw new ValidationException(
        'estimatedDuration must be a non-negative number',
      );
    }
    if (command.notes !== undefined && !command.notes.trim()) {
      throw new ValidationException('notes cannot be blank');
    }
  }
}
