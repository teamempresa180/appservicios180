import { Entity } from '../../../core/domain/base/entity.base';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { AddressId } from '../value-objects/address-id.value-object';
import { AddressType } from '../value-objects/address-type.value-object';
import { AddressStatus } from '../value-objects/address-status.value-object';

export interface AddressProps {
  identityId: IdentityId;
  alias: string;
  fullAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  /** Pin location dropped by the client on the map picker. Both present or both absent. */
  latitude: number | null;
  longitude: number | null;
  type: AddressType;
  status: AddressStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a physical address associated with an Identity.
 * Pure data holder — no maps rendering, no validation, no behavior.
 * `latitude`/`longitude` are an optional geolocation pin (both present
 * or both `null`) captured by the client's map picker, on top of the
 * required text fields.
 */
export class Address extends Entity<AddressId> {
  public readonly identityId: IdentityId;
  public readonly alias: string;
  public readonly fullAddress: string;
  public readonly city: string;
  public readonly state: string;
  public readonly country: string;
  public readonly postalCode: string;
  public readonly latitude: number | null;
  public readonly longitude: number | null;
  public readonly type: AddressType;
  public readonly status: AddressStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: AddressId, props: AddressProps) {
    super(id);
    this.identityId = props.identityId;
    this.alias = props.alias;
    this.fullAddress = props.fullAddress;
    this.city = props.city;
    this.state = props.state;
    this.country = props.country;
    this.postalCode = props.postalCode;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.type = props.type;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
