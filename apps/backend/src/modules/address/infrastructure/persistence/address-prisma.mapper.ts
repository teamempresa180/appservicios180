import { AddressModel as PrismaAddress } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Address } from '../../domain/entities/address.entity';
import { AddressId } from '../../domain/value-objects/address-id.value-object';
import { AddressStatus } from '../../domain/value-objects/address-status.value-object';
import { AddressType } from '../../domain/value-objects/address-type.value-object';

/**
 * Translates between the `Address` domain entity and its Prisma row
 * shape (`AddressModel`, mapped to the `addresses` table). The only
 * place in this module that imports from `@prisma/client` — Domain/
 * Application never do.
 */
export class AddressPrismaMapper {
  static toDomain(row: PrismaAddress): Address {
    return new Address(AddressId.fromString(row.id), {
      identityId: IdentityId.fromString(row.identityId),
      alias: row.alias,
      fullAddress: row.fullAddress,
      city: row.city,
      state: row.state,
      country: row.country,
      postalCode: row.postalCode,
      latitude: row.latitude,
      longitude: row.longitude,
      type: row.type as unknown as AddressType,
      status: row.status as unknown as AddressStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(address: Address): PrismaAddress {
    return {
      id: address.id.value,
      identityId: address.identityId.value,
      alias: address.alias,
      fullAddress: address.fullAddress,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      latitude: address.latitude,
      longitude: address.longitude,
      type: address.type,
      status: address.status,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }
}
