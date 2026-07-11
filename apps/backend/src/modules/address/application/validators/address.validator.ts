import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { AddressType } from '../../domain/value-objects/address-type.value-object';
import { AddressStatus } from '../../domain/value-objects/address-status.value-object';
import { CreateAddressCommand } from '../commands/create-address.command';
import { UpdateAddressCommand } from '../commands/update-address.command';

/**
 * Structural validation for Address commands — required fields,
 * well-formed values. No business rules (e.g. no geolocation/postal
 * code format validation — nothing in `address/domain` documents
 * either as a real invariant, and no uniqueness-per-Identity check —
 * the repository contract's `findByIdentityId` returns `Address[]`,
 * so multiple addresses per Identity are allowed).
 */
export class AddressValidator {
  static validateCreate(command: CreateAddressCommand): void {
    if (!command.identityId?.trim()) {
      throw new ValidationException('identityId is required');
    }
    if (!command.alias?.trim()) {
      throw new ValidationException('alias is required');
    }
    if (!command.fullAddress?.trim()) {
      throw new ValidationException('fullAddress is required');
    }
    if (!command.city?.trim()) {
      throw new ValidationException('city is required');
    }
    if (!command.state?.trim()) {
      throw new ValidationException('state is required');
    }
    if (!command.country?.trim()) {
      throw new ValidationException('country is required');
    }
    if (!command.postalCode?.trim()) {
      throw new ValidationException('postalCode is required');
    }
    if (!Object.values(AddressType).includes(command.type)) {
      throw new ValidationException(
        `type must be one of: ${Object.values(AddressType).join(', ')}`,
      );
    }
  }

  static validateUpdate(command: UpdateAddressCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (command.alias !== undefined && !command.alias.trim()) {
      throw new ValidationException('alias cannot be blank');
    }
    if (command.fullAddress !== undefined && !command.fullAddress.trim()) {
      throw new ValidationException('fullAddress cannot be blank');
    }
    if (
      command.status !== undefined &&
      !Object.values(AddressStatus).includes(command.status)
    ) {
      throw new ValidationException(
        `status must be one of: ${Object.values(AddressStatus).join(', ')}`,
      );
    }
  }
}
