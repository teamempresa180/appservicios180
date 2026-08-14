import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to delete an existing Address. Plain data — no behavior.
 * `caller` is the authenticated user the ownership check is made
 * against in `DeleteAddressUseCase`.
 */
export class DeleteAddressCommand {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly id: string,
  ) {}
}
