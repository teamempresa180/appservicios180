import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import {
  normalizePage,
  normalizePageSize,
} from '../../../core/application/pagination';

/**
 * Intent to list Attachments with pagination. Plain data — no
 * behavior. `caller` is the authenticated user the listing is scoped
 * to: only Attachments from Chats that Identity takes part in (an
 * `Admin` caller sees every Attachment).
 */
export class ListAttachmentQuery {
  public readonly page: number;
  public readonly pageSize: number;

  constructor(
    public readonly caller: AuthenticatedUser,
    page: number = 1,
    pageSize: number = 20,
  ) {
    this.page = normalizePage(page);
    this.pageSize = normalizePageSize(pageSize);
  }
}
