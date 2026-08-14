import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * HTTP request body for `PUT /quotes/:id`. Distinct from
 * `application/dto/update-quote.dto.ts` — see
 * `create-quote.request.dto.ts` for the rationale, including why
 * `estimatedDuration` must be an integer and `proposedPrice`
 * positive. Only mirrors the fields `UpdateQuoteCommand` actually
 * accepts (proposedPrice/estimatedDuration/notes) — `status` is not
 * updatable via this endpoint (see `PUT /quotes/:id/accept` and
 * `PUT /quotes/:id/reject` for the only supported status
 * transitions), per the existing Application layer contract.
 */
export class UpdateQuoteRequestDto {
  @ApiPropertyOptional({ example: 80.0, minimum: 0.01 })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  proposedPrice?: number;

  @ApiPropertyOptional({ example: 100, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedDuration?: number;

  @ApiPropertyOptional({ example: 'Updated notes.', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  notes?: string;
}
