import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * HTTP request body for `PUT /reviews/:id`. Distinct from
 * `application/dto/update-review.dto.ts` — see
 * `create-review.request.dto.ts` for the rationale. Only mirrors the
 * fields `UpdateReviewCommand` actually accepts (`title`/`comment`) —
 * `rating`/`status` are not updatable via this endpoint, per the
 * existing Application layer contract.
 */
export class UpdateReviewRequestDto {
  @ApiPropertyOptional({ example: 'Great service' })
  title?: string;

  @ApiPropertyOptional({
    example: 'Fixed the leak quickly and left the area clean.',
  })
  comment?: string;
}
