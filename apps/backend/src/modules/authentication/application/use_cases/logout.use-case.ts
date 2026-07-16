import { RefreshTokenRepository } from '../../domain/interfaces/refresh-token-repository.interface';
import { TokenService } from '../ports/token.port';
import { LogoutCommand } from '../commands/logout.command';

/**
 * Revokes a single refresh token (one session logged out, not "log
 * out everywhere" — no endpoint for that exists, per Prompt 74's
 * scope). Idempotent by design: an unknown or already-revoked token
 * still returns successfully, since the caller's goal ("I am no
 * longer logged in with this token") is already true either way —
 * no need to leak whether the token existed. No signature
 * verification is performed: looking a token up by its hash already
 * requires knowing the exact token value, which is proof enough of
 * possession for a revoke-only operation.
 */
export class LogoutUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    const tokenHash = this.tokenService.hashRefreshToken(command.refreshToken);
    const stored = await this.refreshTokenRepository.findByTokenHash(tokenHash);
    if (stored && !stored.isRevoked) {
      await this.refreshTokenRepository.revoke(stored.id);
    }
  }
}
