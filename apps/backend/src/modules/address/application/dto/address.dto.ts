import { AddressType } from '../../domain/value-objects/address-type.value-object';
import { AddressStatus } from '../../domain/value-objects/address-status.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class AddressDto {
  id!: string;
  identityId!: string;
  alias!: string;
  fullAddress!: string;
  city!: string;
  state!: string;
  country!: string;
  postalCode!: string;
  latitude!: number | null;
  longitude!: number | null;
  type!: AddressType;
  status!: AddressStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
