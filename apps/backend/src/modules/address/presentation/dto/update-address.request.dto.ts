import { ApiPropertyOptional } from '@nestjs/swagger';
import { AddressStatus } from '../../domain/value-objects/address-status.value-object';

/**
 * HTTP request body for `PUT /addresses/:id`. Distinct from
 * `application/dto/update-address.dto.ts` — see
 * `create-address.request.dto.ts` for the rationale. Only mirrors the
 * fields `UpdateAddressCommand` actually accepts (alias/fullAddress/
 * status) — city/state/country/postalCode are not updatable, per the
 * existing Application layer contract. `latitude`/`longitude` are also
 * updatable: omit both to leave the pin untouched, send both as
 * numbers to set/move it, or send both as `null` to clear it.
 */
export class UpdateAddressRequestDto {
  @ApiPropertyOptional({ example: 'Home' })
  alias?: string;

  @ApiPropertyOptional({ example: 'Calle 123 #45-67' })
  fullAddress?: string;

  @ApiPropertyOptional({
    example: 4.710989,
    nullable: true,
    description:
      'Latitude of the pin (-90..90). Provide together with `longitude`, or both as `null` to clear the pin.',
  })
  latitude?: number | null;

  @ApiPropertyOptional({
    example: -74.072092,
    nullable: true,
    description:
      'Longitude of the pin (-180..180). Provide together with `latitude`, or both as `null` to clear the pin.',
  })
  longitude?: number | null;

  @ApiPropertyOptional({ enum: AddressStatus, example: AddressStatus.Active })
  status?: AddressStatus;
}
