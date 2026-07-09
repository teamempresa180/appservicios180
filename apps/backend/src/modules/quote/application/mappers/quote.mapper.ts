import { Quote } from '../../domain/entities/quote.entity';
import { QuoteDto } from '../dto/quote.dto';

/**
 * Translates between the Quote domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class QuoteMapper {
  static toDto(quote: Quote): QuoteDto {
    const dto = new QuoteDto();
    dto.id = quote.id.value;
    dto.orderId = quote.orderId.value;
    dto.providerId = quote.providerId.value;
    dto.proposedPrice = quote.proposedPrice;
    dto.estimatedDuration = quote.estimatedDuration;
    dto.notes = quote.notes;
    dto.status = quote.status;
    dto.type = quote.type;
    dto.createdAt = quote.createdAt;
    dto.updatedAt = quote.updatedAt;
    return dto;
  }
}
