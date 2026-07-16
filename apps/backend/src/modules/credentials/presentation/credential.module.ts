import { Module } from '@nestjs/common';
import { IdentityPresentationModule } from '../../identity/presentation/identity.module';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../identity/domain/interfaces/identity-repository.interface';
import { CredentialController } from './controllers/credential.controller';
import { CreateCredentialUseCase } from '../application/use_cases/create-credential.use-case';
import { UpdateCredentialUseCase } from '../application/use_cases/update-credential.use-case';
import { DeleteCredentialUseCase } from '../application/use_cases/delete-credential.use-case';
import { GetCredentialUseCase } from '../application/use_cases/get-credential.use-case';
import { ListCredentialUseCase } from '../application/use_cases/list-credential.use-case';
import { SearchCredentialUseCase } from '../application/use_cases/search-credential.use-case';
import { ChangePasswordUseCase } from '../application/use_cases/change-password.use-case';
import {
  CREDENTIAL_REPOSITORY,
  CredentialRepository,
} from '../domain/interfaces/credential-repository.interface';
import { PrismaCredentialRepository } from '../infrastructure/persistence/prisma-credential.repository';
import {
  PASSWORD_HASHER,
  PasswordHasher,
} from '../application/ports/password-hasher.port';
import { BcryptPasswordHasher } from '../infrastructure/security/bcrypt-password-hasher';

/**
 * Wires the Credentials presentation layer to its Use Cases, wired to
 * the real `PrismaCredentialRepository` (Sprint 3, Etapa 2). Imports
 * `IdentityPresentationModule` to get `IDENTITY_REPOSITORY` —
 * `CreateCredentialUseCase` verifies the referenced Identity exists
 * before creating a record for it. `PASSWORD_HASHER` (Sprint 4, Etapa
 * 7) is exported so `AuthenticationPresentationModule` can reuse it
 * for password verification during login without duplicating the
 * hashing implementation.
 */
@Module({
  imports: [IdentityPresentationModule],
  controllers: [CredentialController],
  providers: [
    { provide: CREDENTIAL_REPOSITORY, useClass: PrismaCredentialRepository },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    {
      provide: CreateCredentialUseCase,
      useFactory: (
        credRepo: CredentialRepository,
        identityRepo: IdentityRepository,
        hasher: PasswordHasher,
      ) => new CreateCredentialUseCase(credRepo, identityRepo, hasher),
      inject: [CREDENTIAL_REPOSITORY, IDENTITY_REPOSITORY, PASSWORD_HASHER],
    },
    {
      provide: UpdateCredentialUseCase,
      useFactory: (repo: CredentialRepository) =>
        new UpdateCredentialUseCase(repo),
      inject: [CREDENTIAL_REPOSITORY],
    },
    {
      provide: ChangePasswordUseCase,
      useFactory: (repo: CredentialRepository, hasher: PasswordHasher) =>
        new ChangePasswordUseCase(repo, hasher),
      inject: [CREDENTIAL_REPOSITORY, PASSWORD_HASHER],
    },
    {
      provide: DeleteCredentialUseCase,
      useFactory: (repo: CredentialRepository) =>
        new DeleteCredentialUseCase(repo),
      inject: [CREDENTIAL_REPOSITORY],
    },
    {
      provide: GetCredentialUseCase,
      useFactory: (repo: CredentialRepository) =>
        new GetCredentialUseCase(repo),
      inject: [CREDENTIAL_REPOSITORY],
    },
    {
      provide: ListCredentialUseCase,
      useFactory: (repo: CredentialRepository) =>
        new ListCredentialUseCase(repo),
      inject: [CREDENTIAL_REPOSITORY],
    },
    {
      provide: SearchCredentialUseCase,
      useFactory: (repo: CredentialRepository) =>
        new SearchCredentialUseCase(repo),
      inject: [CREDENTIAL_REPOSITORY],
    },
  ],
  exports: [CREDENTIAL_REPOSITORY, PASSWORD_HASHER],
})
export class CredentialsPresentationModule {}
