import { Module } from '@nestjs/common';
import { CredentialController } from './controllers/credential.controller';
import { CreateCredentialUseCase } from '../application/use_cases/create-credential.use-case';
import { UpdateCredentialUseCase } from '../application/use_cases/update-credential.use-case';
import { DeleteCredentialUseCase } from '../application/use_cases/delete-credential.use-case';
import { GetCredentialUseCase } from '../application/use_cases/get-credential.use-case';
import { CredentialRepository } from '../domain/interfaces/credential-repository.interface';

/**
 * Wires the Credentials presentation layer to its Use Cases.
 *
 * No concrete CredentialRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [CredentialController],
  providers: [
    {
      provide: CreateCredentialUseCase,
      useFactory: () =>
        new CreateCredentialUseCase(
          undefined as unknown as CredentialRepository,
        ),
    },
    {
      provide: UpdateCredentialUseCase,
      useFactory: () =>
        new UpdateCredentialUseCase(
          undefined as unknown as CredentialRepository,
        ),
    },
    {
      provide: DeleteCredentialUseCase,
      useFactory: () =>
        new DeleteCredentialUseCase(
          undefined as unknown as CredentialRepository,
        ),
    },
    {
      provide: GetCredentialUseCase,
      useFactory: () =>
        new GetCredentialUseCase(undefined as unknown as CredentialRepository),
    },
  ],
})
export class CredentialsPresentationModule {}
