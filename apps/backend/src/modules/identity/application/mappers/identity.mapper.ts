import { Identity } from '../../domain/entities/identity.entity';
import { IdentityDto } from '../dto/identity.dto';

/**
 * Translates between the Identity domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class IdentityMapper {
  static toDto(identity: Identity): IdentityDto {
    const dto = new IdentityDto();
    dto.id = identity.id.value;
    dto.fullName = identity.fullName;
    dto.documentType = identity.documentType;
    dto.documentNumber = identity.documentNumber;
    dto.birthDate = identity.birthDate;
    dto.status = identity.status;
    dto.createdAt = identity.createdAt;
    dto.updatedAt = identity.updatedAt;
    return dto;
  }
}
