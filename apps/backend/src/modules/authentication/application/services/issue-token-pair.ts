import { Role } from '../../../../common/auth/role.enum';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenId } from '../../domain/value-objects/refresh-token-id.value-object';
import { RefreshTokenRepository } from '../../domain/interfaces/refresh-token-repository.interface';
import { AuthTokensDto } from '../dto/auth-tokens.dto';
import { TokenService } from '../ports/token.port';

/**
 * Signs a new access/refresh token pair, persists the refresh
 * token's hash, and builds the `AuthTokensDto`. Shared by
 * `LoginUseCase` and `RefreshUseCase` — both need identical
 * "issue a fresh pair" behavior, only the caller differs (a verified
 * password vs. a verified prior refresh token).
 */
export async function issueTokenPair(
  tokenService: TokenService,
  refreshTokenRepository: RefreshTokenRepository,
  identityId: IdentityId,
  role: Role,
): Promise<AuthTokensDto> {
  const claims = { sub: identityId.value, role };
  const accessToken = tokenService.signAccessToken(claims);
  const refreshToken = tokenService.signRefreshToken(claims);

  const tokenHash = tokenService.hashRefreshToken(refreshToken);
  const expiresAt = tokenService.getExpiry(refreshToken);
  await refreshTokenRepository.save(
    new RefreshToken(RefreshTokenId.create(), {
      identityId,
      tokenHash,
      expiresAt,
      revokedAt: null,
      createdAt: new Date(),
    }),
  );

  const expiresIn = Math.max(
    0,
    Math.floor(
      (tokenService.getExpiry(accessToken).getTime() - Date.now()) / 1000,
    ),
  );

  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn,
    role,
  };
}
