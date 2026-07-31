import { AddressStatus } from '../../domain/value-objects/address-status.value-object';

/**
 * Input shape for updating an Address. No validation.
 */
export class UpdateAddressDto {
  alias?: string;
  fullAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number | null;
  longitude?: number | null;
  status?: AddressStatus;
}
