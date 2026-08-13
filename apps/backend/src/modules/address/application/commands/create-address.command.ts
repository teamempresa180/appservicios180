import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { AddressType } from '../../domain/value-objects/address-type.value-object';

/**
 * Intent to create a new Address. Plain data — no behavior.
 * `caller` is the authenticated user: `CreateAddressUseCase` rejects
 * an `identityId` that is not the caller's own, so an Address can
 * never be planted on another Identity.
 */
export class CreateAddressCommand {
  constructor(
    public readonly caller: AuthenticatedUser,
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
