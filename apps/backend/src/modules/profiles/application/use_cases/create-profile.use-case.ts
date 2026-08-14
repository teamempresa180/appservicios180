import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileRepository } from '../../domain/interfaces/profile-repository.interface';
import { ProfileId } from '../../domain/value-objects/profile-id.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';
import { CreateProfileCommand } from '../commands/create-profile.command';
import { ProfileDto } from '../dto/profile.dto';
import { ProfileMapper } from '../mappers/profile.mapper';
import { ProfileValidator } from '../validators/profile.validator';

/**
 * Creates a new Profile for an existing Identity, always in `Active`
 * status. Depends on `IdentityRepository` (not just its own) to verify
 * the referenced Identity actually exists before creating a profile
 * for it — same rule already applied to `Authentication`/`Credential`
 * in Sprint 3 Etapa 2, since `Profile` also references `IdentityId`.
 *
 * A caller may only create a Profile for their own Identity — see
 * `CreateProfileCommand`. The check runs before the Identity lookup so
 * the endpoint can't be used to probe which Identity ids exist.
 */
export class CreateProfileUseCase {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly identityRepository: IdentityRepository,
  ) {}

  async execute(command: CreateProfileCommand): Promise<ProfileDto> {
    ProfileValidator.validateCreate(command);

    if (
      command.identityId !== command.callerId &&
      command.callerRole !== Role.Admin
    ) {
      throw new ForbiddenException(
        'You may only create a Profile for your own Identity',
      );
    }

    const identityId = IdentityId.fromString(command.identityId);
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) {
      throw new NotFoundException(`Identity ${command.identityId} not found`);
    }

    const now = new Date();
    const profile = new Profile(ProfileId.create(), {
      identityId,
      displayName: command.displayName,
      avatarUrl: command.avatarUrl,
      bio: command.bio,
      visibility: command.visibility,
      status: ProfileStatus.Active,
      createdAt: now,
      updatedAt: now,
    });

    await this.profileRepository.save(profile);
    return ProfileMapper.toDto(profile);
  }
}
