import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProfileRepository } from '../../domain/interfaces/profile-repository.interface';
import { ProfileId } from '../../domain/value-objects/profile-id.value-object';
import { GetProfileQuery } from '../queries/get-profile.query';
import { ProfileDto } from '../dto/profile.dto';
import { ProfileMapper } from '../mappers/profile.mapper';

/**
 * Fetches a single Profile by id. Throws `NotFoundException` instead
 * of returning `null` — same pattern as `GetIdentityUseCase`, so the
 * caller (a future controller) maps that to a 404 via
 * `DomainExceptionFilter` without checking for `null` itself.
 */
export class GetProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(query: GetProfileQuery): Promise<ProfileDto> {
    const profile = await this.profileRepository.findById(
      ProfileId.fromString(query.id),
    );
    if (!profile) {
      throw new NotFoundException(`Profile ${query.id} not found`);
    }
    return ProfileMapper.toDto(profile);
  }
}
