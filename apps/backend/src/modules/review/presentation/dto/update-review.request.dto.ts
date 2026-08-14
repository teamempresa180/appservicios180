import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

/**
 * HTTP request body for `PUT /reviews/:id`. Distinct from
 * `application/dto/update-review.dto.ts` — see
 * `create-review.request.dto.ts` for the rationale, including why
 * every field needs `class-validator` decorators. Only mirrors the
 * fields `UpdateReviewCommand` actually accepts (`title`/`comment`) —
 * `rating`/`status` are not updatable via this endpoint, per the
 * existing Application layer contract.
 */
export class UpdateReviewRequestDto {
  @ApiPropertyOptional({ example: 'Great service', maxLength: 100 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({
    example: 'Fixed the leak quickly and left the area clean.',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  comment?: string;
}
