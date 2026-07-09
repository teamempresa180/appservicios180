import { Module } from '@nestjs/common';
import { ServiceController } from './controllers/service.controller';
import { CreateServiceUseCase } from '../application/use_cases/create-service.use-case';
import { UpdateServiceUseCase } from '../application/use_cases/update-service.use-case';
import { DeleteServiceUseCase } from '../application/use_cases/delete-service.use-case';
import { GetServiceUseCase } from '../application/use_cases/get-service.use-case';
import { ServiceRepository } from '../domain/interfaces/service-repository.interface';

/**
 * Wires the Service presentation layer to its Use Cases.
 *
 * No concrete ServiceRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [ServiceController],
  providers: [
    {
      provide: CreateServiceUseCase,
      useFactory: () =>
        new CreateServiceUseCase(undefined as unknown as ServiceRepository),
    },
    {
      provide: UpdateServiceUseCase,
      useFactory: () =>
        new UpdateServiceUseCase(undefined as unknown as ServiceRepository),
    },
    {
      provide: DeleteServiceUseCase,
      useFactory: () =>
        new DeleteServiceUseCase(undefined as unknown as ServiceRepository),
    },
    {
      provide: GetServiceUseCase,
      useFactory: () =>
        new GetServiceUseCase(undefined as unknown as ServiceRepository),
    },
  ],
})
export class ServicePresentationModule {}
