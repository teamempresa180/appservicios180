import { ProfileRepository } from '../../domain/interfaces/profile-repository.interface';
import { ProfileDto } from '../dto/profile.dto';
import { UpdateProfileCommand } from '../commands/update-profile.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class UpdateProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  execute(command: UpdateProfileCommand): Promise<ProfileDto> {
    void this.profileRepository;
    throw new Error(
      `UpdateProfileUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
