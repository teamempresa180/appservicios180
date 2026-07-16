import { Role } from '../../../../common/auth/role.enum';
import { UnauthorizedException } from '../../../core/domain/exceptions/unauthorized.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { RefreshTokenRepository } from '../../domain/interfaces/refresh-token-repository.interface';
import { TokenService } from '../ports/token.port';
import { RefreshCommand } from '../commands/refresh.command';
import { AuthTokensDto } from '../dto/auth-tokens.dto';
import { issueTokenPair } from '../services/issue-token-pair';

/**
 * Exchanges a valid, not-yet-revoked, not-yet-expired refresh token
 * for a new access/refresh pair, revoking the presented token in the
 * same operation (rotation) — a refresh token can only ever be used
 * once. The role is recomputed from the current Provider relationship
 * rather than trusted from the old token's claims, since it could
 * have changed since the token was issued.
 */
export class RefreshUseCase {
  constructor(
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly identityRepository: IdentityRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(command: RefreshCommand): Promise<AuthTokensDto> {
    const claims = this.tokenService.verifyRefreshToken(command.refreshToken);

    const tokenHash = this.tokenService.hashRefreshToken(command.refreshToken);
    const stored = await this.refreshTokenRepository.findByTokenHash(tokenHash);
    if (!stored || stored.isRevoked || stored.isExpired) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    await this.refreshTokenRepository.revoke(stored.id);

    const identityId = IdentityId.fromString(claims.sub);
    const identity = await this.identityRepository.findById(identityId);
    if (!identity || identity.status !== IdentityStatus.Active) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    const provider = await this.providerRepository.findByIdentityId(identityId);
    const role = provider ? Role.Provider : Role.Customer;

    return issueTokenPair(
      this.tokenService,
      this.refreshTokenRepository,
      identityId,
      role,
    );
  }
}
