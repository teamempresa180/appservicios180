import { Profile } from '../../domain/entities/profile.entity';
import { ProfileDto } from '../dto/profile.dto';

/**
 * Translates between the Profile domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class ProfileMapper {
  static toDto(profile: Profile): ProfileDto {
    const dto = new ProfileDto();
    dto.id = profile.id.value;
    dto.identityId = profile.identityId.value;
    dto.displayName = profile.displayName;
    dto.avatarUrl = profile.avatarUrl;
    dto.bio = profile.bio;
    dto.visibility = profile.visibility;
    dto.status = profile.status;
    dto.createdAt = profile.createdAt;
    dto.updatedAt = profile.updatedAt;
    return dto;
  }
}
