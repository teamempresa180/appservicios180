import { Role } from '../../../../common/auth/role.enum';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProfileRepository } from '../../domain/interfaces/profile-repository.interface';
import { ListProfileQuery } from '../queries/list-profile.query';
import { ProfileDto } from '../dto/profile.dto';
import { ProfileMapper } from '../mappers/profile.mapper';

/**
 * Lists the caller's own Profiles, page by page. Previously this
 * returned every Profile in the system to any authenticated caller —
 * a full user directory (display names, bios, avatars) behind nothing
 * but a valid token. Scoping it to `callerId` matches the only real
 * consumer: the mobile app called `GET /profiles` in three places
 * purely to locate its *own* Profile, filtering
 * `identityId == currentUserId` client-side each time.
 *
 * `findByIdentityId` returns the caller's Profiles as an array (an
 * account is expected to have exactly one), so the page window is
 * applied here rather than pushed into the repository — no new
 * repository method, and the slice is over a handful of rows, not a
 * table scan.
 *
 * An `Admin` still sees the unscoped listing; no account can hold that
 * role today, so the global directory is effectively closed until the
 * domain defines administrative accounts.
 */
export class ListProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(query: ListProfileQuery): Promise<PaginatedResult<ProfileDto>> {
    if (query.callerRole === Role.Admin) {
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

    const owned = await this.profileRepository.findByIdentityId(
      IdentityId.fromString(query.callerId),
    );
    const start = (query.page - 1) * query.pageSize;

    return {
      items: owned
        .slice(start, start + query.pageSize)
        .map((profile) => ProfileMapper.toDto(profile)),
      total: owned.length,
      page: query.page,
      pageSize: query.pageSize,
    };
  }
}
