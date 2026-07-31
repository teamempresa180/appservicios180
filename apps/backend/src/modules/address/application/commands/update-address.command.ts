import { AddressStatus } from '../../domain/value-objects/address-status.value-object';

/**
 * Intent to update an existing Address. Plain data — no behavior.
 */
export class UpdateAddressCommand {
  constructor(
    public readonly id: string,
    public readonly alias?: string,
    public readonly fullAddress?: string,
    public readonly status?: AddressStatus,
    public readonly latitude?: number | null,
    public readonly longitude?: number | null,
  ) {}
}
