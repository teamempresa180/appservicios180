import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { AvailabilityType } from '../../domain/value-objects/availability-type.value-object';

/**
 * HTTP request body for `POST /availabilities`. Distinct from
 * `application/dto/create-availability.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `AvailabilityHttpMapper` translates between the two.
 * `availableFrom`/`availableTo` are ISO strings here, parsed to
 * `Date` in the mapper — malformed input still reaches
 * `AvailabilityValidator.validateCreate`, which already rejects a
 * non-`Date`/invalid `Date`, so no validation logic is duplicated.
 */
export class CreateAvailabilityRequestDto {
  @ApiProperty({
    example: 'provider-id-123',
    description: 'The id of the Provider this Availability belongs to.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  providerId!: string;

  @ApiProperty({ enum: AvailabilityType, example: AvailabilityType.FullTime })
  @IsEnum(AvailabilityType)
  type!: AvailabilityType;

  @ApiProperty({ example: '2026-01-01T08:00:00.000Z', type: String })
  @IsDateString()
  availableFrom!: string;

  /** Ordering against `availableFrom` stays in `AvailabilityValidator` — a cross-field rule the pipe cannot express. */
  @ApiProperty({ example: '2026-01-01T18:00:00.000Z', type: String })
  @IsDateString()
  availableTo!: string;
}
