import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AddressType } from '../../domain/value-objects/address-type.value-object';

/**
 * HTTP request body for `POST /addresses`. Distinct from
 * `application/dto/create-address.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `AddressHttpMapper` translates between the two.
 */
export class CreateAddressRequestDto {
  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity this Address belongs to.',
  })
  identityId!: string;

  @ApiProperty({ example: 'Home' })
  alias!: string;

  @ApiProperty({ example: 'Calle 123 #45-67' })
  fullAddress!: string;

  @ApiProperty({ example: 'Bogotá' })
  city!: string;

  @ApiProperty({ example: 'Cundinamarca' })
  state!: string;

  @ApiProperty({ example: 'Colombia' })
  country!: string;

  @ApiProperty({ example: '110111' })
  postalCode!: string;

  @ApiPropertyOptional({
    example: 4.710989,
    description:
      'Latitude of the pin dropped on the map picker (-90..90). Must be provided together with `longitude`, or omitted entirely.',
  })
  latitude?: number;

  @ApiPropertyOptional({
    example: -74.072092,
    description:
      'Longitude of the pin dropped on the map picker (-180..180). Must be provided together with `latitude`, or omitted entirely.',
  })
  longitude?: number;

  @ApiProperty({ enum: AddressType, example: AddressType.Home })
  type!: AddressType;
}
