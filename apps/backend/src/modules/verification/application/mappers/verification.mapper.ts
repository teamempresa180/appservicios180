import { Verification } from '../../domain/entities/verification.entity';
import { VerificationDto } from '../dto/verification.dto';

/**
 * Translates between the Verification domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class VerificationMapper {
  static toDto(verification: Verification): VerificationDto {
    const dto = new VerificationDto();
    dto.id = verification.id.value;
    dto.identityId = verification.identityId.value;
    dto.type = verification.type;
    dto.status = verification.status;
    dto.verifiedAt = verification.verifiedAt;
    dto.createdAt = verification.createdAt;
    dto.updatedAt = verification.updatedAt;
    dto.documentPath = verification.documentPath;
    return dto;
  }
}
