import { AttachmentType } from '../../domain/value-objects/attachment-type.value-object';

/**
 * Intent to create a new Attachment. Plain data — no behavior.
 */
export class CreateAttachmentCommand {
  constructor(
    public readonly messageId: string,
    public readonly fileName: string,
    public readonly mimeType: string,
    public readonly fileSize: number,
    public readonly type: AttachmentType,
  ) {}
}
