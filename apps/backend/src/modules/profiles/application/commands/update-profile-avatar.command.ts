/**
 * Intent to attach an uploaded avatar photo's stored path to an
 * existing Profile. Plain data — no behavior. `avatarUrl` is the
 * relative path the file was already written to on disk (see
 * `LocalProfileAvatarStorageService`); this command only carries it
 * through to persistence, it never touches file bytes itself.
 */
export class UpdateProfileAvatarCommand {
  constructor(
    public readonly id: string,
    public readonly avatarUrl: string,
  ) {}
}
