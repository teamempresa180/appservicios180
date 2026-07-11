import { ProfileRepository } from '../../domain/interfaces/profile-repository.interface';
import { SearchProfileQuery } from '../queries/search-profile.query';
import { ProfileDto } from '../dto/profile.dto';
import { ProfileMapper } from '../mappers/profile.mapper';

/** Free-text search over `displayName`/`bio`. */
export class SearchProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(query: SearchProfileQuery): Promise<ProfileDto[]> {
    const results = await this.profileRepository.search(query.term);
    return results.map((profile) => ProfileMapper.toDto(profile));
  }
}
