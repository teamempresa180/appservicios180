import { Module } from '@nestjs/common';
import { AuthenticationController } from './controllers/authentication.controller';
import { CreateAuthenticationUseCase } from '../application/use_cases/create-authentication.use-case';
import { UpdateAuthenticationUseCase } from '../application/use_cases/update-authentication.use-case';
import { DeleteAuthenticationUseCase } from '../application/use_cases/delete-authentication.use-case';
import { GetAuthenticationUseCase } from '../application/use_cases/get-authentication.use-case';
import { AuthenticationRepository } from '../domain/interfaces/authentication-repository.interface';

/**
 * Wires the Authentication presentation layer to its Use Cases.
 *
 * No concrete AuthenticationRepository exists yet (Infrastructure layer is
 * not built). Each Use Case is constructed with an unset repository
 * reference — this is safe because every Use Case currently throws before
 * touching it.
 */
@Module({
  controllers: [AuthenticationController],
  providers: [
    {
      provide: CreateAuthenticationUseCase,
      useFactory: () =>
        new CreateAuthenticationUseCase(
          undefined as unknown as AuthenticationRepository,
        ),
    },
    {
      provide: UpdateAuthenticationUseCase,
      useFactory: () =>
        new UpdateAuthenticationUseCase(
          undefined as unknown as AuthenticationRepository,
        ),
    },
    {
      provide: DeleteAuthenticationUseCase,
      useFactory: () =>
        new DeleteAuthenticationUseCase(
          undefined as unknown as AuthenticationRepository,
        ),
    },
    {
      provide: GetAuthenticationUseCase,
      useFactory: () =>
        new GetAuthenticationUseCase(
          undefined as unknown as AuthenticationRepository,
        ),
    },
  ],
})
export class AuthenticationPresentationModule {}
