import { Role } from '../../../../common/auth/role.enum';

/**
 * Intent to attach an uploaded avatar photo's stored path to an
 * existing Profile. Plain data — no behavior. `avatarUrl` is the
 * relative path the file was already written to on disk (see
 * `LocalProfileAvatarStorageService`); this command only carries it
 * through to persistence, it never touches file bytes itself.
 *
 * `callerId`/`callerRole` carry the authenticated caller — replacing
 * someone else's avatar is the same write-to-another-account problem
 * described on `CreateProfileCommand`.
 */
export class UpdateProfileAvatarCommand {
  constructor(
    public readonly id: string,
    public readonly callerId: string,
    public readonly callerRole: Role,
    public readonly avatarUrl: string,
  ) {}
}
