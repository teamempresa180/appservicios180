import { Module } from '@nestjs/common';
import { IdentityController } from './controllers/identity.controller';
import { CreateIdentityUseCase } from '../application/use_cases/create-identity.use-case';
import { UpdateIdentityUseCase } from '../application/use_cases/update-identity.use-case';
import { DeleteIdentityUseCase } from '../application/use_cases/delete-identity.use-case';
import { GetIdentityUseCase } from '../application/use_cases/get-identity.use-case';
import { IdentityRepository } from '../domain/interfaces/identity-repository.interface';

/**
 * Wires the Identity presentation layer to its Use Cases.
 *
 * No concrete IdentityRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 * Once a real repository provider exists, replace this placeholder wiring.
 */
@Module({
  controllers: [IdentityController],
  providers: [
    {
      provide: CreateIdentityUseCase,
      useFactory: () =>
        new CreateIdentityUseCase(undefined as unknown as IdentityRepository),
    },
    {
      provide: UpdateIdentityUseCase,
      useFactory: () =>
        new UpdateIdentityUseCase(undefined as unknown as IdentityRepository),
    },
    {
      provide: DeleteIdentityUseCase,
      useFactory: () =>
        new DeleteIdentityUseCase(undefined as unknown as IdentityRepository),
    },
    {
      provide: GetIdentityUseCase,
      useFactory: () =>
        new GetIdentityUseCase(undefined as unknown as IdentityRepository),
    },
  ],
})
export class IdentityPresentationModule {}
