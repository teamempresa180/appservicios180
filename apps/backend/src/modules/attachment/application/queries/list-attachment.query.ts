/**
 * Intent to list Attachments with pagination. Plain data — no behavior.
 */
export class ListAttachmentQuery {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 20,
  ) {}
}
