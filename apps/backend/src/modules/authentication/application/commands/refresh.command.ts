/**
 * Intent to exchange a valid refresh token for a new access/refresh
 * pair. Plain data — no behavior.
 */
export class RefreshCommand {
  constructor(public readonly refreshToken: string) {}
}
