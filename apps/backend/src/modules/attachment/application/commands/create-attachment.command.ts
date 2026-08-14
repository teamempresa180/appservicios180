import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { AttachmentType } from '../../domain/value-objects/attachment-type.value-object';

/**
 * Intent to create a new Attachment. Plain data — no behavior.
 * `caller` is the authenticated user: `CreateAttachmentUseCase` only
 * lets an Identity attach files to its own Messages.
 */
export class CreateAttachmentCommand {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly messageId: string,
    public readonly fileName: string,
    public readonly mimeType: string,
    public readonly fileSize: number,
    public readonly type: AttachmentType,
  ) {}
}
