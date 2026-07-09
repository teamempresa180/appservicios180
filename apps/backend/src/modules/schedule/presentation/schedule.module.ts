import { Module } from '@nestjs/common';
import { ScheduleController } from './controllers/schedule.controller';
import { CreateScheduleUseCase } from '../application/use_cases/create-schedule.use-case';
import { UpdateScheduleUseCase } from '../application/use_cases/update-schedule.use-case';
import { DeleteScheduleUseCase } from '../application/use_cases/delete-schedule.use-case';
import { GetScheduleUseCase } from '../application/use_cases/get-schedule.use-case';
import { ScheduleRepository } from '../domain/interfaces/schedule-repository.interface';

/**
 * Wires the Schedule presentation layer to its Use Cases.
 *
 * No concrete ScheduleRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [ScheduleController],
  providers: [
    {
      provide: CreateScheduleUseCase,
      useFactory: () =>
        new CreateScheduleUseCase(undefined as unknown as ScheduleRepository),
    },
    {
      provide: UpdateScheduleUseCase,
      useFactory: () =>
        new UpdateScheduleUseCase(undefined as unknown as ScheduleRepository),
    },
    {
      provide: DeleteScheduleUseCase,
      useFactory: () =>
        new DeleteScheduleUseCase(undefined as unknown as ScheduleRepository),
    },
    {
      provide: GetScheduleUseCase,
      useFactory: () =>
        new GetScheduleUseCase(undefined as unknown as ScheduleRepository),
    },
  ],
})
export class SchedulePresentationModule {}
