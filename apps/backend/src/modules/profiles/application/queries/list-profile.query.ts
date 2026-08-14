import { Role } from '../../../../common/auth/role.enum';
import {
  normalizePage,
  normalizePageSize,
} from '../../../core/application/pagination';

/**
 * Intent to list Profiles with pagination. Plain data — no behavior.
 *
 * `callerId` scopes the listing to that Identity's own Profiles —
 * `GET /profiles` previously returned every Profile in the system to
 * any authenticated caller, i.e. a full user directory. The mobile app
 * only ever used this endpoint to find *its own* Profile (it filtered
 * `identityId == currentUserId` client-side, in three separate
 * repositories), so scoping it server-side returns exactly what the
 * only real consumer already wanted.
 */
export class ListProfileQuery {
  public readonly page: number;
  public readonly pageSize: number;

  constructor(
    public readonly callerId: string,
    public readonly callerRole: Role,
    page: number = 1,
    pageSize: number = 20,
  ) {
    this.page = normalizePage(page);
    this.pageSize = normalizePageSize(pageSize);
  }
}
