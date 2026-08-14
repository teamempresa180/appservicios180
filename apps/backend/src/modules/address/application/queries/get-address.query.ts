import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to fetch a single Address by id. Plain data — no behavior.
 * `caller` is the authenticated user the ownership check is made
 * against in `GetAddressUseCase`.
 */
export class GetAddressQuery {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly id: string,
  ) {}
}
