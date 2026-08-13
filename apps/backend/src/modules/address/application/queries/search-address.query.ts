import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to search Addresses by a free-text term. Plain data — no
 * behavior. `caller` scopes the search to that Identity's own
 * Addresses, exactly like `ListAddressQuery`.
 */
export class SearchAddressQuery {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly term: string,
  ) {}
}
