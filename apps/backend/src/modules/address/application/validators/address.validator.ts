import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { AddressType } from '../../domain/value-objects/address-type.value-object';
import { AddressStatus } from '../../domain/value-objects/address-status.value-object';
import { CreateAddressCommand } from '../commands/create-address.command';
import { UpdateAddressCommand } from '../commands/update-address.command';

const MIN_LATITUDE = -90;
const MAX_LATITUDE = 90;
const MIN_LONGITUDE = -180;
const MAX_LONGITUDE = 180;

/**
 * Structural validation for Address commands — required fields,
 * well-formed values. No business rules (e.g. no postal code format
 * validation — nothing in `address/domain` documents either as a real
 * invariant, and no uniqueness-per-Identity check — the repository
 * contract's `findByIdentityId` returns `Address[]`, so multiple
 * addresses per Identity are allowed).
 *
 * `latitude`/`longitude` follow the same "both or neither" pattern as
 * `providerId`/`serviceId` in `order.validator.ts` (direct hire vs.
 * open request): a map pin is optional, but a partial pin (only one
 * coordinate) is never valid.
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
    AddressValidator.validateCoordinates(
      command.latitude,
      command.longitude,
    );
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
    AddressValidator.validateCoordinates(
      command.latitude,
      command.longitude,
      // Update commands may explicitly clear the pin with `null` —
      // undefined means "leave untouched", so only treat the pair as
      // present when strictly not undefined.
      true,
    );
  }

  /**
   * Both coordinates must be present or both absent — never just one.
   * When `allowNull` is set (update flow), a pin may also be cleared
   * by passing `null` for both.
   */
  private static validateCoordinates(
    latitude: number | null | undefined,
    longitude: number | null | undefined,
    allowNull = false,
  ): void {
    const hasLatitude = allowNull
      ? latitude !== undefined
      : latitude !== undefined && latitude !== null;
    const hasLongitude = allowNull
      ? longitude !== undefined
      : longitude !== undefined && longitude !== null;

    if (hasLatitude !== hasLongitude) {
      throw new ValidationException(
        'latitude and longitude must both be present or both be absent',
      );
    }

    if (allowNull && latitude !== undefined && longitude !== undefined) {
      if ((latitude === null) !== (longitude === null)) {
        throw new ValidationException(
          'latitude and longitude must both be present or both be absent',
        );
      }
    }

    if (typeof latitude === 'number') {
      if (Number.isNaN(latitude) || latitude < MIN_LATITUDE || latitude > MAX_LATITUDE) {
        throw new ValidationException(
          `latitude must be between ${MIN_LATITUDE} and ${MAX_LATITUDE}`,
        );
      }
    }

    if (typeof longitude === 'number') {
      if (
        Number.isNaN(longitude) ||
        longitude < MIN_LONGITUDE ||
        longitude > MAX_LONGITUDE
      ) {
        throw new ValidationException(
          `longitude must be between ${MIN_LONGITUDE} and ${MAX_LONGITUDE}`,
        );
      }
    }
  }
}
