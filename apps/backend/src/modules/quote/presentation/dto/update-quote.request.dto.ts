import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * HTTP request body for `PUT /quotes/:id`. Distinct from
 * `application/dto/update-quote.dto.ts` — see
 * `create-quote.request.dto.ts` for the rationale. Only mirrors the
 * fields `UpdateQuoteCommand` actually accepts (proposedPrice/
 * estimatedDuration/notes) — `status` is not updatable via this
 * endpoint (see `PUT /quotes/:id/accept` and `PUT /quotes/:id/reject`
 * for the only supported status transitions), per the existing
 * Application layer contract.
 */
export class UpdateQuoteRequestDto {
  @ApiPropertyOptional({ example: 80.0 })
  proposedPrice?: number;

  @ApiPropertyOptional({ example: 100 })
  estimatedDuration?: number;

  @ApiPropertyOptional({ example: 'Updated notes.' })
  notes?: string;
}
