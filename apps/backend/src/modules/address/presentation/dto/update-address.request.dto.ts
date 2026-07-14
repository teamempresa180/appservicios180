import { ApiPropertyOptional } from '@nestjs/swagger';
import { AddressStatus } from '../../domain/value-objects/address-status.value-object';

/**
 * HTTP request body for `PUT /addresses/:id`. Distinct from
 * `application/dto/update-address.dto.ts` — see
 * `create-address.request.dto.ts` for the rationale. Only mirrors the
 * fields `UpdateAddressCommand` actually accepts (alias/fullAddress/
 * status) — city/state/country/postalCode are not updatable, per the
 * existing Application layer contract.
 */
export class UpdateAddressRequestDto {
  @ApiPropertyOptional({ example: 'Home' })
  alias?: string;

  @ApiPropertyOptional({ example: 'Calle 123 #45-67' })
  fullAddress?: string;

  @ApiPropertyOptional({ enum: AddressStatus, example: AddressStatus.Active })
  status?: AddressStatus;
}
