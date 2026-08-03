import { Logger } from '@nestjs/common';
import { Role } from '../../../../common/auth/role.enum';
import { UnauthorizedException } from '../../../core/domain/exceptions/unauthorized.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { ProviderStatus } from '../../../provider/domain/value-objects/provider-status.value-object';
import { RefreshTokenRepository } from '../../domain/interfaces/refresh-token-repository.interface';
import { TokenService } from '../ports/token.port';
import { RefreshCommand } from '../commands/refresh.command';
import { AuthSessionValidator } from '../validators/auth-session.validator';
import { AuthTokensDto } from '../dto/auth-tokens.dto';
import { issueTokenPair } from '../services/issue-token-pair';

/**
 * Exchanges a valid, not-yet-revoked, not-yet-expired refresh token
 * for a new access/refresh pair, revoking the presented token in the
 * same operation (rotation) — a refresh token can only ever be used
 * once. The role is recomputed from the current Provider relationship
 * rather than trusted from the old token's claims, since it could
 * have changed since the token was issued.
 *
 * Reuse detection: presenting an *already-revoked* token is not a
 * normal client mistake — a rotated token is discarded by the client
 * the instant it's exchanged, so a second use means the value leaked
 * (stolen backup, intercepted response, malware). The whole family of
 * refresh tokens for that Identity is revoked, forcing a real
 * re-login. Standard OAuth 2.0 refresh-token-rotation guidance
 * (RFC 6819 §5.2.2.3).
 */
export class RefreshUseCase {
  private readonly logger = new Logger(RefreshUseCase.name);

  constructor(
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly identityRepository: IdentityRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(command: RefreshCommand): Promise<AuthTokensDto> {
    AuthSessionValidator.validateRefresh(command);

    const claims = this.tokenService.verifyRefreshToken(command.refreshToken);

    const tokenHash = this.tokenService.hashRefreshToken(command.refreshToken);
    const stored = await this.refreshTokenRepository.findByTokenHash(tokenHash);
    if (!stored) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
    if (stored.isRevoked) {
      // Replay of a token that was already rotated away or logged out
      // — treat as a compromise and kill every session for the
      // Identity, not just this one token.
      this.logger.warn(
        `Refresh token reuse detected for identityId=${stored.identityId.value} — revoking all sessions`,
      );
      await this.refreshTokenRepository.revokeAllForIdentity(
        stored.identityId,
      );
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
    if (stored.isExpired) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    await this.refreshTokenRepository.revoke(stored.id);

    const identityId = IdentityId.fromString(claims.sub);
    const identity = await this.identityRepository.findById(identityId);
    if (!identity || identity.status !== IdentityStatus.Active) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    // Must match `LoginUseCase`'s rule exactly: only an **Active**
    // Provider grants `Role.Provider`. Deriving it from the mere
    // *existence* of a Provider record (as this did before) let a
    // Pending/InReview/Rejected/Suspended/Blocked applicant escalate
    // from Customer to Provider simply by refreshing their token —
    // and `RolesGuard` trusts this claim on every provider-only
    // endpoint.
    const provider = await this.providerRepository.findByIdentityId(identityId);
    const role =
      provider && provider.status === ProviderStatus.Active
        ? Role.Provider
        : Role.Customer;

    return issueTokenPair(
      this.tokenService,
      this.refreshTokenRepository,
      identityId,
      role,
    );
  }
}
