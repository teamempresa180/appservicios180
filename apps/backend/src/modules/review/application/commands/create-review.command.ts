/**
 * Intent to create a new Review. Plain data — no behavior.
 */
export class CreateReviewCommand {
  constructor(
    public readonly orderId: string,
    public readonly providerId: string,
    public readonly reviewerIdentityId: string,
    public readonly rating: number,
    public readonly title: string,
    public readonly comment: string,
  ) {}
}
