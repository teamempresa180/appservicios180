import { PaginatedResult } from '../../../core/application/paginated-result';
import { ProfileRepository } from '../../domain/interfaces/profile-repository.interface';
import { ListProfileQuery } from '../queries/list-profile.query';
import { ProfileDto } from '../dto/profile.dto';
import { ProfileMapper } from '../mappers/profile.mapper';

/** Lists Profiles page by page. */
export class ListProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(query: ListProfileQuery): Promise<PaginatedResult<ProfileDto>> {
    const result = await this.profileRepository.list(
      query.page,
      query.pageSize,
    );
    return {
      items: result.items.map((profile) => ProfileMapper.toDto(profile)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
