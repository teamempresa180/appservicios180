import { AddressType } from '../../domain/value-objects/address-type.value-object';

/**
 * Input shape for creating an Address. No validation.
 */
export class CreateAddressDto {
  identityId!: string;
  alias!: string;
  fullAddress!: string;
  city!: string;
  state!: string;
  country!: string;
  postalCode!: string;
  latitude?: number;
  longitude?: number;
  type!: AddressType;
}
