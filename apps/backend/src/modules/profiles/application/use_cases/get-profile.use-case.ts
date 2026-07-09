import { ProfileRepository } from '../../domain/interfaces/profile-repository.interface';
import { ProfileDto } from '../dto/profile.dto';
import { GetProfileQuery } from '../queries/get-profile.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  execute(query: GetProfileQuery): Promise<ProfileDto | null> {
    void this.profileRepository;
    throw new Error(
      `GetProfileUseCase.execute is not implemented yet (received: ${JSON.stringify(query)})`,
    );
  }
}
