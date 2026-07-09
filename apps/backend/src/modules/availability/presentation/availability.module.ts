import { Module } from '@nestjs/common';
import { AvailabilityController } from './controllers/availability.controller';
import { CreateAvailabilityUseCase } from '../application/use_cases/create-availability.use-case';
import { UpdateAvailabilityUseCase } from '../application/use_cases/update-availability.use-case';
import { DeleteAvailabilityUseCase } from '../application/use_cases/delete-availability.use-case';
import { GetAvailabilityUseCase } from '../application/use_cases/get-availability.use-case';
import { AvailabilityRepository } from '../domain/interfaces/availability-repository.interface';

/**
 * Wires the Availability presentation layer to its Use Cases.
 *
 * No concrete AvailabilityRepository exists yet (Infrastructure layer is
 * not built). Each Use Case is constructed with an unset repository
 * reference — this is safe because every Use Case currently throws before
 * touching it.
 */
@Module({
  controllers: [AvailabilityController],
  providers: [
    {
      provide: CreateAvailabilityUseCase,
      useFactory: () =>
        new CreateAvailabilityUseCase(
          undefined as unknown as AvailabilityRepository,
        ),
    },
    {
      provide: UpdateAvailabilityUseCase,
      useFactory: () =>
        new UpdateAvailabilityUseCase(
          undefined as unknown as AvailabilityRepository,
        ),
    },
    {
      provide: DeleteAvailabilityUseCase,
      useFactory: () =>
        new DeleteAvailabilityUseCase(
          undefined as unknown as AvailabilityRepository,
        ),
    },
    {
      provide: GetAvailabilityUseCase,
      useFactory: () =>
        new GetAvailabilityUseCase(
          undefined as unknown as AvailabilityRepository,
        ),
    },
  ],
})
export class AvailabilityPresentationModule {}
