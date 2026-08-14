import { Caller } from '../../../core/application/caller';

/**
 * Intent to update an existing Review. Plain data — no behavior.
 * `caller` is who is asking: `UpdateReviewUseCase` only lets the
 * original reviewer, or an Admin, edit it.
 */
export class UpdateReviewCommand {
  constructor(
    public readonly id: string,
    public readonly caller: Caller,
    public readonly title?: string,
    public readonly comment?: string,
  ) {}
}
