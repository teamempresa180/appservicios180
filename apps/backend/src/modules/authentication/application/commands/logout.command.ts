/**
 * Intent to revoke a refresh token (log out). Plain data — no behavior.
 */
export class LogoutCommand {
  constructor(public readonly refreshToken: string) {}
}
