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
import {
  CREDENTIAL_REPOSITORY,
  CredentialRepository,
} from '../domain/interfaces/credential-repository.interface';
import { PrismaCredentialRepository } from '../infrastructure/persistence/prisma-credential.repository';

/**
 * Wires the Credentials presentation layer to its Use Cases, wired to
 * the real `PrismaCredentialRepository` (Sprint 3, Etapa 2). Imports
 * `IdentityPresentationModule` to get `IDENTITY_REPOSITORY` —
 * `CreateCredentialUseCase` verifies the referenced Identity exists
 * before creating a record for it.
 */
@Module({
  imports: [IdentityPresentationModule],
  controllers: [CredentialController],
  providers: [
    { provide: CREDENTIAL_REPOSITORY, useClass: PrismaCredentialRepository },
    {
      provide: CreateCredentialUseCase,
      useFactory: (
        credRepo: CredentialRepository,
        identityRepo: IdentityRepository,
      ) => new CreateCredentialUseCase(credRepo, identityRepo),
      inject: [CREDENTIAL_REPOSITORY, IDENTITY_REPOSITORY],
    },
    {
      provide: UpdateCredentialUseCase,
      useFactory: (repo: CredentialRepository) =>
        new UpdateCredentialUseCase(repo),
      inject: [CREDENTIAL_REPOSITORY],
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
})
export class CredentialsPresentationModule {}
