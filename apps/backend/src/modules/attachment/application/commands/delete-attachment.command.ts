/**
 * Intent to delete an existing Attachment. Plain data — no behavior.
 */
export class DeleteAttachmentCommand {
  constructor(public readonly id: string) {}
}
