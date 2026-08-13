import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { AddressStatus } from '../../domain/value-objects/address-status.value-object';

/**
 * Intent to update an existing Address. Plain data — no behavior.
 * `caller` is the authenticated user the ownership check is made
 * against in `UpdateAddressUseCase`.
 */
export class UpdateAddressCommand {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly id: string,
    public readonly alias?: string,
    public readonly fullAddress?: string,
    public readonly status?: AddressStatus,
    public readonly latitude?: number | null,
    public readonly longitude?: number | null,
  ) {}
}
