import { ProfileRepository } from '../../domain/interfaces/profile-repository.interface';
import { ProfileDto } from '../dto/profile.dto';
import { CreateProfileCommand } from '../commands/create-profile.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  execute(command: CreateProfileCommand): Promise<ProfileDto> {
    void this.profileRepository;
    throw new Error(
      `CreateProfileUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
