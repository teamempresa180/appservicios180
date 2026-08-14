import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';
import { ProviderPresentationModule } from '../../provider/presentation/provider.module';
import {
  PROVIDER_REPOSITORY,
  ProviderRepository,
} from '../../provider/domain/interfaces/provider-repository.interface';
import { AvailabilityController } from './controllers/availability.controller';
import { CreateAvailabilityUseCase } from '../application/use_cases/create-availability.use-case';
import { UpdateAvailabilityUseCase } from '../application/use_cases/update-availability.use-case';
import { DeleteAvailabilityUseCase } from '../application/use_cases/delete-availability.use-case';
import { GetAvailabilityUseCase } from '../application/use_cases/get-availability.use-case';
import { ListAvailabilityUseCase } from '../application/use_cases/list-availability.use-case';
import { SearchAvailabilityUseCase } from '../application/use_cases/search-availability.use-case';
import {
  AVAILABILITY_REPOSITORY,
  AvailabilityRepository,
} from '../domain/interfaces/availability-repository.interface';
import { PrismaAvailabilityRepository } from '../infrastructure/persistence/prisma-availability.repository';

/**
 * Wires the Availability presentation layer to its Use Cases, which
 * are wired to the real `PrismaAvailabilityRepository` (Sprint 3,
 * Etapa 7) via the `AVAILABILITY_REPOSITORY` DI token. Imports
 * `ProviderPresentationModule` — `CreateAvailabilityUseCase` verifies
 * the referenced Provider exists before creating a record for it.
 */
@Module({
  imports: [ProviderPresentationModule, PrismaModule],
  controllers: [AvailabilityController],
  providers: [
    {
      provide: AVAILABILITY_REPOSITORY,
      useClass: PrismaAvailabilityRepository,
    },
    {
      provide: CreateAvailabilityUseCase,
      useFactory: (
        availabilityRepo: AvailabilityRepository,
        providerRepo: ProviderRepository,
      ) => new CreateAvailabilityUseCase(availabilityRepo, providerRepo),
      inject: [AVAILABILITY_REPOSITORY, PROVIDER_REPOSITORY],
    },
    {
      provide: UpdateAvailabilityUseCase,
      useFactory: (
        repo: AvailabilityRepository,
        providerRepo: ProviderRepository,
      ) => new UpdateAvailabilityUseCase(repo, providerRepo),
      inject: [AVAILABILITY_REPOSITORY, PROVIDER_REPOSITORY],
    },
    {
      provide: DeleteAvailabilityUseCase,
      useFactory: (
        repo: AvailabilityRepository,
        providerRepo: ProviderRepository,
      ) => new DeleteAvailabilityUseCase(repo, providerRepo),
      inject: [AVAILABILITY_REPOSITORY, PROVIDER_REPOSITORY],
    },
    {
      provide: GetAvailabilityUseCase,
      useFactory: (repo: AvailabilityRepository) =>
        new GetAvailabilityUseCase(repo),
      inject: [AVAILABILITY_REPOSITORY],
    },
    {
      provide: ListAvailabilityUseCase,
      useFactory: (repo: AvailabilityRepository) =>
        new ListAvailabilityUseCase(repo),
      inject: [AVAILABILITY_REPOSITORY],
    },
    {
      provide: SearchAvailabilityUseCase,
      useFactory: (repo: AvailabilityRepository) =>
        new SearchAvailabilityUseCase(repo),
      inject: [AVAILABILITY_REPOSITORY],
    },
  ],
  exports: [AVAILABILITY_REPOSITORY],
})
export class AvailabilityPresentationModule {}
