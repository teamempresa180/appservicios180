import { Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile.controller';
import { CreateProfileUseCase } from '../application/use_cases/create-profile.use-case';
import { UpdateProfileUseCase } from '../application/use_cases/update-profile.use-case';
import { DeleteProfileUseCase } from '../application/use_cases/delete-profile.use-case';
import { GetProfileUseCase } from '../application/use_cases/get-profile.use-case';
import { ProfileRepository } from '../domain/interfaces/profile-repository.interface';

/**
 * Wires the Profiles presentation layer to its Use Cases.
 *
 * No concrete ProfileRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [ProfileController],
  providers: [
    {
      provide: CreateProfileUseCase,
      useFactory: () =>
        new CreateProfileUseCase(undefined as unknown as ProfileRepository),
    },
    {
      provide: UpdateProfileUseCase,
      useFactory: () =>
        new UpdateProfileUseCase(undefined as unknown as ProfileRepository),
    },
    {
      provide: DeleteProfileUseCase,
      useFactory: () =>
        new DeleteProfileUseCase(undefined as unknown as ProfileRepository),
    },
    {
      provide: GetProfileUseCase,
      useFactory: () =>
        new GetProfileUseCase(undefined as unknown as ProfileRepository),
    },
  ],
})
export class ProfilesPresentationModule {}
