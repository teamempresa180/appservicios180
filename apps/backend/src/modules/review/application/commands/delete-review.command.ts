/**
 * Intent to delete an existing Review. Plain data — no behavior.
 */
export class DeleteReviewCommand {
  constructor(public readonly id: string) {}
}
