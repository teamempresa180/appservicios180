import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProfileRepository } from '../../domain/interfaces/profile-repository.interface';
import { ProfileId } from '../../domain/value-objects/profile-id.value-object';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { GetProfileQuery } from '../queries/get-profile.query';
import { ProfileDto } from '../dto/profile.dto';
import { ProfileMapper } from '../mappers/profile.mapper';

/**
 * Fetches a single Profile by id. Throws `NotFoundException` instead
 * of returning `null` — same pattern as `GetIdentityUseCase`, so the
 * caller (a future controller) maps that to a 404 via
 * `DomainExceptionFilter` without checking for `null` itself.
 *
 * Access is governed by the Profile's own `visibility`, not by
 * ownership: a `Public` Profile is readable by any authenticated
 * caller (this is how the app renders a Provider's card, chat header,
 * order and reviews — all of which resolve someone else's Profile by
 * id), while a `Private` one is readable only by its owner or an
 * `Admin`. Enforcing strict ownership here instead would have been
 * both wrong for the domain — `visibility` exists precisely to express
 * this — and a break of every Provider-facing screen in the mobile
 * app.
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
    if (
      profile.visibility !== ProfileVisibility.Public &&
      profile.identityId.value !== query.callerId &&
      query.callerRole !== Role.Admin
    ) {
      throw new ForbiddenException('This Profile is private');
    }
    return ProfileMapper.toDto(profile);
  }
}
