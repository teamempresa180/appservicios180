import { Authentication } from '../../domain/entities/authentication.entity';
import { AuthenticationDto } from '../dto/authentication.dto';

/**
 * Translates between the Authentication domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class AuthenticationMapper {
  static toDto(authentication: Authentication): AuthenticationDto {
    const dto = new AuthenticationDto();
    dto.id = authentication.id.value;
    dto.identityId = authentication.identityId.value;
    dto.methodType = authentication.methodType;
    dto.status = authentication.status;
    dto.createdAt = authentication.createdAt;
    dto.updatedAt = authentication.updatedAt;
    return dto;
  }
}
