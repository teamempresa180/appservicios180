import { Address } from '../../domain/entities/address.entity';
import { AddressDto } from '../dto/address.dto';

/**
 * Translates between the Address domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class AddressMapper {
  static toDto(address: Address): AddressDto {
    const dto = new AddressDto();
    dto.id = address.id.value;
    dto.identityId = address.identityId.value;
    dto.alias = address.alias;
    dto.fullAddress = address.fullAddress;
    dto.city = address.city;
    dto.state = address.state;
    dto.country = address.country;
    dto.postalCode = address.postalCode;
    dto.latitude = address.latitude;
    dto.longitude = address.longitude;
    dto.type = address.type;
    dto.status = address.status;
    dto.createdAt = address.createdAt;
    dto.updatedAt = address.updatedAt;
    return dto;
  }
}
