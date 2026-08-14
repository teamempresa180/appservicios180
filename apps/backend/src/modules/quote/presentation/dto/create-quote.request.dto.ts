import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { QuoteType } from '../../domain/value-objects/quote-type.value-object';

/**
 * HTTP request body for `POST /quotes`. Distinct from
 * `application/dto/create-quote.dto.ts` — that DTO is the Application
 * layer's internal input shape, this one is the wire contract exposed
 * to API clients (documented via `@ApiProperty` for Swagger).
 * `QuoteHttpMapper` translates between the two.
 *
 * `estimatedDuration` is `@IsInt()`, not merely a number: the Prisma
 * column is `Int`, so a fractional value used to reach the driver and
 * fail there instead of being rejected at the edge. `proposedPrice`
 * has a `0.01` floor rather than `0` — a "free" quote is not a
 * meaningful offer, and a negative one was previously accepted by
 * nothing but the column type.
 */
export class CreateQuoteRequestDto {
  @ApiProperty({
    example: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    description: 'The id of the Order this Quote is submitted for.',
  })
  @IsUUID()
  orderId!: string;

  @ApiProperty({
    example: '1b2c3d4e-5f6a-4b7c-8d9e-0f1a2b3c4d5e',
    description: 'The id of the Provider submitting the Quote.',
  })
  @IsUUID()
  providerId!: string;

  @ApiProperty({ example: 75.0, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  proposedPrice!: number;

  @ApiProperty({
    example: 90,
    minimum: 1,
    description: 'Estimated duration in whole minutes.',
  })
  @IsInt()
  @Min(1)
  estimatedDuration!: number;

  @ApiProperty({ example: 'Includes parts and labor.', maxLength: 1000 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  notes!: string;

  @ApiProperty({ enum: QuoteType, example: QuoteType.Standard })
  @IsEnum(QuoteType)
  type!: QuoteType;
}
