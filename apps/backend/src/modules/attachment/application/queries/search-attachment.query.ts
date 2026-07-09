/**
 * Intent to search Attachments by a free-text term. Plain data — no behavior.
 */
export class SearchAttachmentQuery {
  constructor(public readonly term: string) {}
}
