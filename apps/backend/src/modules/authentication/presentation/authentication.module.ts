import { Module } from '@nestjs/common';
import { IdentityPresentationModule } from '../../identity/presentation/identity.module';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../identity/domain/interfaces/identity-repository.interface';
import { AuthenticationController } from './controllers/authentication.controller';
import { CreateAuthenticationUseCase } from '../application/use_cases/create-authentication.use-case';
import { UpdateAuthenticationUseCase } from '../application/use_cases/update-authentication.use-case';
import { DeleteAuthenticationUseCase } from '../application/use_cases/delete-authentication.use-case';
import { GetAuthenticationUseCase } from '../application/use_cases/get-authentication.use-case';
import { ListAuthenticationUseCase } from '../application/use_cases/list-authentication.use-case';
import { SearchAuthenticationUseCase } from '../application/use_cases/search-authentication.use-case';
import {
  AUTHENTICATION_REPOSITORY,
  AuthenticationRepository,
} from '../domain/interfaces/authentication-repository.interface';
import { PrismaAuthenticationRepository } from '../infrastructure/persistence/prisma-authentication.repository';

/**
 * Wires the Authentication presentation layer to its Use Cases, wired
 * to the real `PrismaAuthenticationRepository` (Sprint 3, Etapa 2).
 * Imports `IdentityPresentationModule` to get `IDENTITY_REPOSITORY` —
 * `CreateAuthenticationUseCase` verifies the referenced Identity
 * exists before creating a method for it.
 */
@Module({
  imports: [IdentityPresentationModule],
  controllers: [AuthenticationController],
  providers: [
    {
      provide: AUTHENTICATION_REPOSITORY,
      useClass: PrismaAuthenticationRepository,
    },
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
  ],
})
export class AuthenticationPresentationModule {}
