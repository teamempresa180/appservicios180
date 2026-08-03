import { Logger } from '@nestjs/common';
import { Role } from '../../../../common/auth/role.enum';
import { UnauthorizedException } from '../../../core/domain/exceptions/unauthorized.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { ProviderStatus } from '../../../provider/domain/value-objects/provider-status.value-object';
import { CredentialRepository } from '../../../credentials/domain/interfaces/credential-repository.interface';
import { CredentialType } from '../../../credentials/domain/value-objects/credential-type.value-object';
import { CredentialStatus } from '../../../credentials/domain/value-objects/credential-status.value-object';
import { PasswordHasher } from '../../../credentials/application/ports/password-hasher.port';
import { AuthenticationRepository } from '../../domain/interfaces/authentication-repository.interface';
import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';
import { RefreshTokenRepository } from '../../domain/interfaces/refresh-token-repository.interface';
import { TokenService } from '../ports/token.port';
import { LoginCommand } from '../commands/login.command';
import { AuthTokensDto } from '../dto/auth-tokens.dto';
import { issueTokenPair } from '../services/issue-token-pair';

const INVALID_CREDENTIALS_MESSAGE = 'Invalid document number or password';

/**
 * Authenticates a documentNumber/password pair and issues a new
 * access/refresh token pair. Every failure path (unknown
 * documentNumber, inactive Identity, no active Password credential,
 * wrong password, no active Password Authentication method) throws
 * the exact same `UnauthorizedException` message — this is
 * deliberate: never let a caller distinguish "no such account" from
 * "wrong password", which would let an attacker enumerate valid
 * document numbers.
 *
 * Role derivation (Sprint 4, Etapa 7 decision): the domain has no
 * "role" field on `Identity`. The role is derived at login time by
 * checking whether an **Active** `Provider` record exists for the
 * Identity — `Role.Provider` if so, `Role.Customer` otherwise. A
 * `Pending` Provider (the status every newly-created Provider starts
 * in — see `CreateProviderUseCase`) does not yet grant `Role.Provider`:
 * the account keeps acting as a Customer until its verification
 * documents are reviewed and its Provider record is moved to `Active`
 * (today via `PUT /providers/:id`). This is a read, not a new business
 * rule.
 */
export class LoginUseCase {
  // Business-event logging only — identity id and outcome, never the
  // document number/password. See `common/README.md` logging conventions.
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    private readonly identityRepository: IdentityRepository,
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly credentialRepository: CredentialRepository,
    private readonly providerRepository: ProviderRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(command: LoginCommand): Promise<AuthTokensDto> {
    const identity = await this.identityRepository.findByDocumentNumber(
      command.documentNumber,
    );
    if (!identity || identity.status !== IdentityStatus.Active) {
      this.logger.warn('Login failed: unknown or inactive identity');
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    // Both lookups are keyed on the same `identity.id` and neither
    // depends on the other's result, so they go out in parallel — one
    // database round-trip instead of two on the hottest path in the
    // app. The checks below still run in the original order, so the
    // failure a caller sees is unchanged.
    const [authentications, credentials] = await Promise.all([
      this.authenticationRepository.findByIdentityId(identity.id),
      this.credentialRepository.findByIdentityId(identity.id),
    ]);

    const hasActivePasswordMethod = authentications.some(
      (auth) =>
        auth.methodType === AuthMethodType.Password &&
        auth.status === AuthenticationStatus.Active,
    );
    if (!hasActivePasswordMethod) {
      this.logger.warn(
        `Login failed: no active Password method for identityId=${identity.id.value}`,
      );
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const passwordCredential = credentials.find(
      (credential) =>
        credential.type === CredentialType.Password &&
        credential.status === CredentialStatus.Active &&
        credential.passwordHash,
    );
    if (!passwordCredential?.passwordHash) {
      this.logger.warn(
        `Login failed: no active Password credential for identityId=${identity.id.value}`,
      );
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const passwordMatches = await this.passwordHasher.verify(
      command.password,
      passwordCredential.passwordHash,
    );
    if (!passwordMatches) {
      this.logger.warn(
        `Login failed: wrong password for identityId=${identity.id.value}`,
      );
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const provider = await this.providerRepository.findByIdentityId(
      identity.id,
    );
    const role =
      provider && provider.status === ProviderStatus.Active
        ? Role.Provider
        : Role.Customer;

    this.logger.log(
      `Login succeeded for identityId=${identity.id.value} role=${role}`,
    );
    return issueTokenPair(
      this.tokenService,
      this.refreshTokenRepository,
      identity.id,
      role,
    );
  }
}
