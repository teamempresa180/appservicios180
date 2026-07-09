/**
 * Intent to update an existing Review. Plain data — no behavior.
 */
export class UpdateReviewCommand {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly comment?: string,
  ) {}
}
