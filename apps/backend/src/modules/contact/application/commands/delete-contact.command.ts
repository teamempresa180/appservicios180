import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to delete an existing Contact. Plain data — no behavior.
 * `caller` is the authenticated user the ownership check is made
 * against in `DeleteContactUseCase`.
 */
export class DeleteContactCommand {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly id: string,
  ) {}
}
