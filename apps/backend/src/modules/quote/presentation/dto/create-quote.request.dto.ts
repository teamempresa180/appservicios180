import { ApiProperty } from '@nestjs/swagger';
import { QuoteType } from '../../domain/value-objects/quote-type.value-object';

/**
 * HTTP request body for `POST /quotes`. Distinct from
 * `application/dto/create-quote.dto.ts` — that DTO is the Application
 * layer's internal input shape, this one is the wire contract exposed
 * to API clients (documented via `@ApiProperty` for Swagger).
 * `QuoteHttpMapper` translates between the two.
 */
export class CreateQuoteRequestDto {
  @ApiProperty({
    example: 'order-id-123',
    description: 'The id of the Order this Quote is submitted for.',
  })
  orderId!: string;

  @ApiProperty({
    example: 'provider-id-123',
    description: 'The id of the Provider submitting the Quote.',
  })
  providerId!: string;

  @ApiProperty({ example: 75.0 })
  proposedPrice!: number;

  @ApiProperty({ example: 90, description: 'Estimated duration in minutes.' })
  estimatedDuration!: number;

  @ApiProperty({ example: 'Includes parts and labor.' })
  notes!: string;

  @ApiProperty({ enum: QuoteType, example: QuoteType.Standard })
  type!: QuoteType;
}
