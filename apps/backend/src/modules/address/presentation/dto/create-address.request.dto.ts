import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({ enum: AddressType, example: AddressType.Home })
  type!: AddressType;
}
