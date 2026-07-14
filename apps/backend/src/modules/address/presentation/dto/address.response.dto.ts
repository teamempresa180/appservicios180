import { ApiProperty } from '@nestjs/swagger';
import { AddressType } from '../../domain/value-objects/address-type.value-object';
import { AddressStatus } from '../../domain/value-objects/address-status.value-object';

/**
 * HTTP response body for the Address endpoints. Distinct from
 * `application/dto/address.dto.ts` — see
 * `create-address.request.dto.ts` for the rationale.
 */
export class AddressResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
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

  @ApiProperty({ enum: AddressType })
  type!: AddressType;

  @ApiProperty({ enum: AddressStatus })
  status!: AddressStatus;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
