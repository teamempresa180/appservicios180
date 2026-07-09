import { Module } from '@nestjs/common';
import { ProviderController } from './controllers/provider.controller';
import { CreateProviderUseCase } from '../application/use_cases/create-provider.use-case';
import { UpdateProviderUseCase } from '../application/use_cases/update-provider.use-case';
import { DeleteProviderUseCase } from '../application/use_cases/delete-provider.use-case';
import { GetProviderUseCase } from '../application/use_cases/get-provider.use-case';
import { ProviderRepository } from '../domain/interfaces/provider-repository.interface';

/**
 * Wires the Provider presentation layer to its Use Cases.
 *
 * No concrete ProviderRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [ProviderController],
  providers: [
    {
      provide: CreateProviderUseCase,
      useFactory: () =>
        new CreateProviderUseCase(undefined as unknown as ProviderRepository),
    },
    {
      provide: UpdateProviderUseCase,
      useFactory: () =>
        new UpdateProviderUseCase(undefined as unknown as ProviderRepository),
    },
    {
      provide: DeleteProviderUseCase,
      useFactory: () =>
        new DeleteProviderUseCase(undefined as unknown as ProviderRepository),
    },
    {
      provide: GetProviderUseCase,
      useFactory: () =>
        new GetProviderUseCase(undefined as unknown as ProviderRepository),
    },
  ],
})
export class ProviderPresentationModule {}
