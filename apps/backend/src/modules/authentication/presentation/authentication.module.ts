import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '../../../config/config.module';
import { IdentityPresentationModule } from '../../identity/presentation/identity.module';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../identity/domain/interfaces/identity-repository.interface';
import { ProviderPresentationModule } from '../../provider/presentation/provider.module';
import {
  PROVIDER_REPOSITORY,
  ProviderRepository,
} from '../../provider/domain/interfaces/provider-repository.interface';
import { CredentialsPresentationModule } from '../../credentials/presentation/credential.module';
import {
  CREDENTIAL_REPOSITORY,
  CredentialRepository,
} from '../../credentials/domain/interfaces/credential-repository.interface';
import {
  PASSWORD_HASHER,
  PasswordHasher,
} from '../../credentials/application/ports/password-hasher.port';
import { JwtStrategy } from '../../../common/auth/jwt.strategy';
import { AuthenticationController } from './controllers/authentication.controller';
import { CreateAuthenticationUseCase } from '../application/use_cases/create-authentication.use-case';
import { UpdateAuthenticationUseCase } from '../application/use_cases/update-authentication.use-case';
import { DeleteAuthenticationUseCase } from '../application/use_cases/delete-authentication.use-case';
import { GetAuthenticationUseCase } from '../application/use_cases/get-authentication.use-case';
import { ListAuthenticationUseCase } from '../application/use_cases/list-authentication.use-case';
import { SearchAuthenticationUseCase } from '../application/use_cases/search-authentication.use-case';
import { LoginUseCase } from '../application/use_cases/login.use-case';
import { RefreshUseCase } from '../application/use_cases/refresh.use-case';
import { LogoutUseCase } from '../application/use_cases/logout.use-case';
import {
  AUTHENTICATION_REPOSITORY,
  AuthenticationRepository,
} from '../domain/interfaces/authentication-repository.interface';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepository,
} from '../domain/interfaces/refresh-token-repository.interface';
import { PrismaAuthenticationRepository } from '../infrastructure/persistence/prisma-authentication.repository';
import { PrismaRefreshTokenRepository } from '../infrastructure/persistence/prisma-refresh-token.repository';
import { TOKEN_SERVICE, TokenService } from '../application/ports/token.port';
import { JwtTokenService } from '../infrastructure/security/jwt-token.service';

/**
 * Wires the Authentication presentation layer to its Use Cases, wired
 * to the real `PrismaAuthenticationRepository` (Sprint 3, Etapa 2).
 * Imports `IdentityPresentationModule` to get `IDENTITY_REPOSITORY` —
 * `CreateAuthenticationUseCase` verifies the referenced Identity
 * exists before creating a method for it.
 *
 * Sprint 4, Etapa 7 additions: `ProviderPresentationModule` (role
 * derivation) and `CredentialsPresentationModule` (`CREDENTIAL_REPOSITORY`
 * + `PASSWORD_HASHER`, reused rather than duplicated) back
 * `LoginUseCase`/`RefreshUseCase`/`LogoutUseCase`. `JwtModule.register({})`
 * is registered with no default options — every `sign`/`verify` call
 * passes its own secret/issuer/audience/expiresIn explicitly (see
 * `JwtTokenService`), so access and refresh tokens can use different
 * secrets. `JwtStrategy` is registered here (not per-consuming-module)
 * — Passport strategies register into a process-global registry by
 * name, so `JwtAuthGuard` works from any module once this one is
 * loaded into the `AppModule` graph.
 */
@Module({
  imports: [
    ConfigModule,
    IdentityPresentationModule,
    ProviderPresentationModule,
    CredentialsPresentationModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [AuthenticationController],
  providers: [
    JwtStrategy,
    {
      provide: AUTHENTICATION_REPOSITORY,
      useClass: PrismaAuthenticationRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshTokenRepository,
    },
    { provide: TOKEN_SERVICE, useClass: JwtTokenService },
    {
      provide: CreateAuthenticationUseCase,
      useFactory: (
        authRepo: AuthenticationRepository,
        identityRepo: IdentityRepository,
      ) => new CreateAuthenticationUseCase(authRepo, identityRepo),
      inject: [AUTHENTICATION_REPOSITORY, IDENTITY_REPOSITORY],
    },
    {
      provide: UpdateAuthenticationUseCase,
      useFactory: (repo: AuthenticationRepository) =>
        new UpdateAuthenticationUseCase(repo),
      inject: [AUTHENTICATION_REPOSITORY],
    },
    {
      provide: DeleteAuthenticationUseCase,
      useFactory: (repo: AuthenticationRepository) =>
        new DeleteAuthenticationUseCase(repo),
      inject: [AUTHENTICATION_REPOSITORY],
    },
    {
      provide: GetAuthenticationUseCase,
      useFactory: (repo: AuthenticationRepository) =>
        new GetAuthenticationUseCase(repo),
      inject: [AUTHENTICATION_REPOSITORY],
    },
    {
      provide: ListAuthenticationUseCase,
      useFactory: (repo: AuthenticationRepository) =>
        new ListAuthenticationUseCase(repo),
      inject: [AUTHENTICATION_REPOSITORY],
    },
    {
      provide: SearchAuthenticationUseCase,
      useFactory: (repo: AuthenticationRepository) =>
        new SearchAuthenticationUseCase(repo),
      inject: [AUTHENTICATION_REPOSITORY],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        identityRepo: IdentityRepository,
        authRepo: AuthenticationRepository,
        credentialRepo: CredentialRepository,
        providerRepo: ProviderRepository,
        passwordHasher: PasswordHasher,
        tokenService: TokenService,
        refreshTokenRepo: RefreshTokenRepository,
      ) =>
        new LoginUseCase(
          identityRepo,
          authRepo,
          credentialRepo,
          providerRepo,
          passwordHasher,
          tokenService,
          refreshTokenRepo,
        ),
      inject: [
        IDENTITY_REPOSITORY,
        AUTHENTICATION_REPOSITORY,
        CREDENTIAL_REPOSITORY,
        PROVIDER_REPOSITORY,
        PASSWORD_HASHER,
        TOKEN_SERVICE,
        REFRESH_TOKEN_REPOSITORY,
      ],
    },
    {
      provide: RefreshUseCase,
      useFactory: (
        tokenService: TokenService,
        refreshTokenRepo: RefreshTokenRepository,
        identityRepo: IdentityRepository,
        providerRepo: ProviderRepository,
      ) =>
        new RefreshUseCase(
          tokenService,
          refreshTokenRepo,
          identityRepo,
          providerRepo,
        ),
      inject: [
        TOKEN_SERVICE,
        REFRESH_TOKEN_REPOSITORY,
        IDENTITY_REPOSITORY,
        PROVIDER_REPOSITORY,
      ],
    },
    {
      provide: LogoutUseCase,
      useFactory: (
        tokenService: TokenService,
        refreshTokenRepo: RefreshTokenRepository,
      ) => new LogoutUseCase(tokenService, refreshTokenRepo),
      inject: [TOKEN_SERVICE, REFRESH_TOKEN_REPOSITORY],
    },
  ],
})
export class AuthenticationPresentationModule {}
