import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to fetch a single Contact by id. Plain data — no behavior.
 * `caller` is the authenticated user the ownership check is made
 * against in `GetContactUseCase`.
 */
export class GetContactQuery {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly id: string,
  ) {}
}
