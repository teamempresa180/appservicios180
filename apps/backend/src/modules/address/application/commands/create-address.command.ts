import { AddressType } from '../../domain/value-objects/address-type.value-object';

/**
 * Intent to create a new Address. Plain data — no behavior.
 */
export class CreateAddressCommand {
  constructor(
    public readonly identityId: string,
    public readonly alias: string,
    public readonly fullAddress: string,
    public readonly city: string,
    public readonly state: string,
    public readonly country: string,
    public readonly postalCode: string,
    public readonly type: AddressType,
    public readonly latitude?: number,
    public readonly longitude?: number,
  ) {}
}
