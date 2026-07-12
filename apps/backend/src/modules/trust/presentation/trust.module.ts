import { Module } from '@nestjs/common';
import { IdentityPresentationModule } from '../../identity/presentation/identity.module';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../identity/domain/interfaces/identity-repository.interface';
import { TrustController } from './controllers/trust.controller';
import { CreateTrustProfileUseCase } from '../application/use_cases/create-trust-profile.use-case';
import { UpdateTrustProfileUseCase } from '../application/use_cases/update-trust-profile.use-case';
import { GetTrustUseCase } from '../application/use_cases/get-trust.use-case';
import { ListTrustUseCase } from '../application/use_cases/list-trust.use-case';
import { SearchTrustUseCase } from '../application/use_cases/search-trust.use-case';
import {
  TRUST_REPOSITORY,
  TrustRepository,
} from '../domain/interfaces/trust-repository.interface';
import { PrismaTrustRepository } from '../infrastructure/persistence/prisma-trust.repository';

/**
 * Wires the Trust presentation layer to its Use Cases, which are
 * wired to the real `PrismaTrustRepository` (Sprint 3, Etapa 5) via
 * the `TRUST_REPOSITORY` DI token. Imports `IdentityPresentationModule`
 * to get `IDENTITY_REPOSITORY` — `CreateTrustProfileUseCase` verifies
 * the referenced Identity exists and enforces the 1:1 invariant
 * before creating a record for it.
 */
@Module({
  imports: [IdentityPresentationModule],
  controllers: [TrustController],
  providers: [
    { provide: TRUST_REPOSITORY, useClass: PrismaTrustRepository },
    {
      provide: CreateTrustProfileUseCase,
      useFactory: (
        trustRepo: TrustRepository,
        identityRepo: IdentityRepository,
      ) => new CreateTrustProfileUseCase(trustRepo, identityRepo),
      inject: [TRUST_REPOSITORY, IDENTITY_REPOSITORY],
    },
    {
      provide: UpdateTrustProfileUseCase,
      useFactory: (repo: TrustRepository) =>
        new UpdateTrustProfileUseCase(repo),
      inject: [TRUST_REPOSITORY],
    },
    {
      provide: GetTrustUseCase,
      useFactory: (repo: TrustRepository) => new GetTrustUseCase(repo),
      inject: [TRUST_REPOSITORY],
    },
    {
      provide: ListTrustUseCase,
      useFactory: (repo: TrustRepository) => new ListTrustUseCase(repo),
      inject: [TRUST_REPOSITORY],
    },
    {
      provide: SearchTrustUseCase,
      useFactory: (repo: TrustRepository) => new SearchTrustUseCase(repo),
      inject: [TRUST_REPOSITORY],
    },
  ],
  exports: [TRUST_REPOSITORY],
})
export class TrustPresentationModule {}
