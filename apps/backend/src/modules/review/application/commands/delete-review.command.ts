import { Caller } from '../../../core/application/caller';

/**
 * Intent to delete an existing Review. Plain data — no behavior.
 * `caller` is who is asking: `DeleteReviewUseCase` only lets the
 * original reviewer, or an Admin, delete it — in particular, not the
 * reviewed Provider.
 */
export class DeleteReviewCommand {
  constructor(
    public readonly id: string,
    public readonly caller: Caller,
  ) {}
}
