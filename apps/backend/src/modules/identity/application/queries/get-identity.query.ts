import { Role } from '../../../../common/auth/role.enum';

/**
 * Intent to fetch a single Identity by id. Plain data — no behavior.
 * `callerId`/`callerRole` carry the authenticated caller — see
 * `UpdateIdentityCommand` for why every by-id Identity operation needs
 * them. Reading someone else's Identity would expose their legal name,
 * document type and document number.
 */
export class GetIdentityQuery {
  constructor(
    public readonly id: string,
    public readonly callerId: string,
    public readonly callerRole: Role,
  ) {}
}
