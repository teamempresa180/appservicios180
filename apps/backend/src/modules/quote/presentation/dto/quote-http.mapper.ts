import { Caller } from '../../../core/application/caller';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateQuoteCommand } from '../../application/commands/create-quote.command';
import { UpdateQuoteCommand } from '../../application/commands/update-quote.command';
import { QuoteDto } from '../../application/dto/quote.dto';
import { CreateQuoteRequestDto } from './create-quote.request.dto';
import { UpdateQuoteRequestDto } from './update-quote.request.dto';
import { QuoteResponseDto } from './quote.response.dto';
import { QuoteListResponseDto } from './quote-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `QuoteController` never builds a
 * `CreateQuoteCommand` or a `QuoteResponseDto` by hand.
 */
export class QuoteHttpMapper {
  static toCreateCommand(
    dto: CreateQuoteRequestDto,
    caller: Caller,
  ): CreateQuoteCommand {
    return new CreateQuoteCommand(
      dto.orderId,
      dto.providerId,
      dto.proposedPrice,
      dto.estimatedDuration,
      dto.notes,
      dto.type,
      caller,
    );
  }

  static toUpdateCommand(
    id: string,
    dto: UpdateQuoteRequestDto,
    caller: Caller,
  ): UpdateQuoteCommand {
    return new UpdateQuoteCommand(
      id,
      caller,
      dto.proposedPrice,
      dto.estimatedDuration,
      dto.notes,
    );
  }

  static toResponse(dto: QuoteDto): QuoteResponseDto {
    const response = new QuoteResponseDto();
    response.id = dto.id;
    response.orderId = dto.orderId;
    response.providerId = dto.providerId;
    response.proposedPrice = dto.proposedPrice;
    response.estimatedDuration = dto.estimatedDuration;
    response.notes = dto.notes;
    response.status = dto.status;
    response.type = dto.type;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }

  static toListResponse(
    result: PaginatedResult<QuoteDto>,
  ): QuoteListResponseDto {
    const response = new QuoteListResponseDto();
    response.items = result.items.map((item) =>
      QuoteHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
