import { Role } from '../../../../common/auth/role.enum';

/**
 * Intent to fetch a single Profile by id. Plain data — no behavior.
 *
 * Unlike the write commands, reading is *not* owner-only: a Profile is
 * the public/social face of an account, and the app reads other
 * people's Profiles constantly (every Provider card, chat header,
 * order and review resolves the provider's Profile by id). The rule
 * `GetProfileUseCase` applies is the `visibility` field the domain
 * already models — `Public` is readable by any authenticated caller,
 * `Private` only by its owner — so `callerId`/`callerRole` are still
 * needed to make that decision.
 */
export class GetProfileQuery {
  constructor(
    public readonly id: string,
    public readonly callerId: string,
    public readonly callerRole: Role,
  ) {}
}
