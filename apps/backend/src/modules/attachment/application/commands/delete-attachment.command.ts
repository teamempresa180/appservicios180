import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to delete an existing Attachment. Plain data — no behavior.
 * `caller` is the authenticated user: `DeleteAttachmentUseCase` only
 * lets the sender of the Attachment's Message remove it, so the other
 * side of a conversation cannot delete your files.
 */
export class DeleteAttachmentCommand {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly id: string,
  ) {}
}
