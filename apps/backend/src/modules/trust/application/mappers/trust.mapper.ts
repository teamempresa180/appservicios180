import { Trust } from '../../domain/entities/trust.entity';
import { TrustDto } from '../dto/trust.dto';

/**
 * Translates between the Trust domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class TrustMapper {
  static toDto(trust: Trust): TrustDto {
    const dto = new TrustDto();
    dto.id = trust.id.value;
    dto.identityId = trust.identityId.value;
    dto.score = trust.score.value;
    dto.level = trust.level;
    dto.status = trust.status;
    dto.createdAt = trust.createdAt;
    dto.updatedAt = trust.updatedAt;
    return dto;
  }
}
