import { Credential } from '../../domain/entities/credential.entity';
import { CredentialDto } from '../dto/credential.dto';

/**
 * Translates between the Credential domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class CredentialMapper {
  static toDto(credential: Credential): CredentialDto {
    const dto = new CredentialDto();
    dto.id = credential.id.value;
    dto.identityId = credential.identityId.value;
    dto.type = credential.type;
    dto.status = credential.status;
    dto.createdAt = credential.createdAt;
    dto.updatedAt = credential.updatedAt;
    return dto;
  }
}
