/**
 * Intent to fetch a single Attachment by id. Plain data — no behavior.
 */
export class GetAttachmentQuery {
  constructor(public readonly id: string) {}
}
