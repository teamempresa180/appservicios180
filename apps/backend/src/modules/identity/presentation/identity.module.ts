import { Module } from '@nestjs/common';
import { IdentityController } from './controllers/identity.controller';
import { CreateIdentityUseCase } from '../application/use_cases/create-identity.use-case';
import { UpdateIdentityUseCase } from '../application/use_cases/update-identity.use-case';
import { DeleteIdentityUseCase } from '../application/use_cases/delete-identity.use-case';
import { GetIdentityUseCase } from '../application/use_cases/get-identity.use-case';
import { ListIdentityUseCase } from '../application/use_cases/list-identity.use-case';
import { SearchIdentityUseCase } from '../application/use_cases/search-identity.use-case';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../domain/interfaces/identity-repository.interface';
import { PrismaIdentityRepository } from '../infrastructure/persistence/prisma-identity.repository';

/**
 * Wires the Identity presentation layer to its Use Cases, which are
 * wired to the real `PrismaIdentityRepository` (Sprint 3, Etapa 2) via
 * the `IDENTITY_REPOSITORY` DI token — Use Cases depend on the
 * `IdentityRepository` interface only, never on `PrismaIdentityRepository`
 * directly.
 */
@Module({
  controllers: [IdentityController],
  providers: [
    { provide: IDENTITY_REPOSITORY, useClass: PrismaIdentityRepository },
    {
      provide: CreateIdentityUseCase,
      useFactory: (repo: IdentityRepository) => new CreateIdentityUseCase(repo),
      inject: [IDENTITY_REPOSITORY],
    },
    {
      provide: UpdateIdentityUseCase,
      useFactory: (repo: IdentityRepository) => new UpdateIdentityUseCase(repo),
      inject: [IDENTITY_REPOSITORY],
    },
    {
      provide: DeleteIdentityUseCase,
      useFactory: (repo: IdentityRepository) => new DeleteIdentityUseCase(repo),
      inject: [IDENTITY_REPOSITORY],
    },
    {
      provide: GetIdentityUseCase,
      useFactory: (repo: IdentityRepository) => new GetIdentityUseCase(repo),
      inject: [IDENTITY_REPOSITORY],
    },
    {
      provide: ListIdentityUseCase,
      useFactory: (repo: IdentityRepository) => new ListIdentityUseCase(repo),
      inject: [IDENTITY_REPOSITORY],
    },
    {
      provide: SearchIdentityUseCase,
      useFactory: (repo: IdentityRepository) => new SearchIdentityUseCase(repo),
      inject: [IDENTITY_REPOSITORY],
    },
  ],
  exports: [IDENTITY_REPOSITORY],
})
export class IdentityPresentationModule {}
