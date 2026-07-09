import { Module } from '@nestjs/common';
import { TrustController } from './controllers/trust.controller';
import { CreateTrustProfileUseCase } from '../application/use_cases/create-trust-profile.use-case';
import { UpdateTrustProfileUseCase } from '../application/use_cases/update-trust-profile.use-case';
import { GetTrustUseCase } from '../application/use_cases/get-trust.use-case';
import { TrustRepository } from '../domain/interfaces/trust-repository.interface';

/**
 * Wires the Trust presentation layer to its Use Cases.
 *
 * No concrete TrustRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [TrustController],
  providers: [
    {
      provide: CreateTrustProfileUseCase,
      useFactory: () =>
        new CreateTrustProfileUseCase(undefined as unknown as TrustRepository),
    },
    {
      provide: UpdateTrustProfileUseCase,
      useFactory: () =>
        new UpdateTrustProfileUseCase(undefined as unknown as TrustRepository),
    },
    {
      provide: GetTrustUseCase,
      useFactory: () =>
        new GetTrustUseCase(undefined as unknown as TrustRepository),
    },
  ],
})
export class TrustPresentationModule {}
