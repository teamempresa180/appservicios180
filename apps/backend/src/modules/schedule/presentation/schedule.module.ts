import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';
import { ProviderPresentationModule } from '../../provider/presentation/provider.module';
import {
  PROVIDER_REPOSITORY,
  ProviderRepository,
} from '../../provider/domain/interfaces/provider-repository.interface';
import { ScheduleController } from './controllers/schedule.controller';
import { CreateScheduleUseCase } from '../application/use_cases/create-schedule.use-case';
import { UpdateScheduleUseCase } from '../application/use_cases/update-schedule.use-case';
import { DeleteScheduleUseCase } from '../application/use_cases/delete-schedule.use-case';
import { GetScheduleUseCase } from '../application/use_cases/get-schedule.use-case';
import { ListScheduleUseCase } from '../application/use_cases/list-schedule.use-case';
import { SearchScheduleUseCase } from '../application/use_cases/search-schedule.use-case';
import {
  SCHEDULE_REPOSITORY,
  ScheduleRepository,
} from '../domain/interfaces/schedule-repository.interface';
import { PrismaScheduleRepository } from '../infrastructure/persistence/prisma-schedule.repository';

/**
 * Wires the Schedule presentation layer to its Use Cases, which are
 * wired to the real `PrismaScheduleRepository` (Sprint 3, Etapa 7) via
 * the `SCHEDULE_REPOSITORY` DI token. Imports
 * `ProviderPresentationModule` — `CreateScheduleUseCase` verifies the
 * referenced Provider exists before creating a block for it.
 */
@Module({
  imports: [ProviderPresentationModule, PrismaModule],
  controllers: [ScheduleController],
  providers: [
    { provide: SCHEDULE_REPOSITORY, useClass: PrismaScheduleRepository },
    {
      provide: CreateScheduleUseCase,
      useFactory: (
        scheduleRepo: ScheduleRepository,
        providerRepo: ProviderRepository,
      ) => new CreateScheduleUseCase(scheduleRepo, providerRepo),
      inject: [SCHEDULE_REPOSITORY, PROVIDER_REPOSITORY],
    },
    {
      provide: UpdateScheduleUseCase,
      useFactory: (
        repo: ScheduleRepository,
        providerRepo: ProviderRepository,
      ) => new UpdateScheduleUseCase(repo, providerRepo),
      inject: [SCHEDULE_REPOSITORY, PROVIDER_REPOSITORY],
    },
    {
      provide: DeleteScheduleUseCase,
      useFactory: (
        repo: ScheduleRepository,
        providerRepo: ProviderRepository,
      ) => new DeleteScheduleUseCase(repo, providerRepo),
      inject: [SCHEDULE_REPOSITORY, PROVIDER_REPOSITORY],
    },
    {
      provide: GetScheduleUseCase,
      useFactory: (repo: ScheduleRepository) => new GetScheduleUseCase(repo),
      inject: [SCHEDULE_REPOSITORY],
    },
    {
      provide: ListScheduleUseCase,
      useFactory: (repo: ScheduleRepository) => new ListScheduleUseCase(repo),
      inject: [SCHEDULE_REPOSITORY],
    },
    {
      provide: SearchScheduleUseCase,
      useFactory: (repo: ScheduleRepository) => new SearchScheduleUseCase(repo),
      inject: [SCHEDULE_REPOSITORY],
    },
  ],
  exports: [SCHEDULE_REPOSITORY],
})
export class SchedulePresentationModule {}
