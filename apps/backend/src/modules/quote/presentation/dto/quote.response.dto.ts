import { ApiProperty } from '@nestjs/swagger';
import { QuoteStatus } from '../../domain/value-objects/quote-status.value-object';
import { QuoteType } from '../../domain/value-objects/quote-type.value-object';

/**
 * HTTP response body for the Quote endpoints. Distinct from
 * `application/dto/quote.dto.ts` — see
 * `create-quote.request.dto.ts` for the rationale.
 */
export class QuoteResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  orderId!: string;

  @ApiProperty()
  providerId!: string;

  @ApiProperty({ example: 75.0 })
  proposedPrice!: number;

  @ApiProperty({ example: 90 })
  estimatedDuration!: number;

  @ApiProperty({ example: 'Includes parts and labor.' })
  notes!: string;

  @ApiProperty({ enum: QuoteStatus })
  status!: QuoteStatus;

  @ApiProperty({ enum: QuoteType })
  type!: QuoteType;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
