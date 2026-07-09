import { ProfileRepository } from '../../domain/interfaces/profile-repository.interface';
import { DeleteProfileCommand } from '../commands/delete-profile.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class DeleteProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  execute(command: DeleteProfileCommand): Promise<void> {
    void this.profileRepository;
    throw new Error(
      `DeleteProfileUseCase.execute is not implemented yet (received: ${JSON.stringify(command)})`,
    );
  }
}
