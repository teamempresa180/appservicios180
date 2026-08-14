import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to fetch a single Attachment by id. Plain data — no
 * behavior. `caller` is the authenticated user the participation
 * check is made against in `GetAttachmentUseCase`.
 */
export class GetAttachmentQuery {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly id: string,
  ) {}
}
