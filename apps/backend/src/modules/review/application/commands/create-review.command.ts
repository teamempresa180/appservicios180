import { Caller } from '../../../core/application/caller';

/**
 * Intent to create a new Review. Plain data — no behavior. `caller`
 * is who is asking: `CreateReviewUseCase` requires
 * `reviewerIdentityId` to be that same caller, so nobody can post a
 * review under another customer's name.
 */
export class CreateReviewCommand {
  constructor(
    public readonly orderId: string,
    public readonly providerId: string,
    public readonly reviewerIdentityId: string,
    public readonly rating: number,
    public readonly title: string,
    public readonly comment: string,
    public readonly caller: Caller,
  ) {}
}
