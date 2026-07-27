import { Module } from '@nestjs/common';
import { IdentityPresentationModule } from '../../identity/presentation/identity.module';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../identity/domain/interfaces/identity-repository.interface';
import { ProfileController } from './controllers/profile.controller';
import { CreateProfileUseCase } from '../application/use_cases/create-profile.use-case';
import { UpdateProfileUseCase } from '../application/use_cases/update-profile.use-case';
import { DeleteProfileUseCase } from '../application/use_cases/delete-profile.use-case';
import { GetProfileUseCase } from '../application/use_cases/get-profile.use-case';
import { ListProfileUseCase } from '../application/use_cases/list-profile.use-case';
import { SearchProfileUseCase } from '../application/use_cases/search-profile.use-case';
import { UpdateProfileAvatarUseCase } from '../application/use_cases/update-profile-avatar.use-case';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from '../domain/interfaces/profile-repository.interface';
import { PrismaProfileRepository } from '../infrastructure/persistence/prisma-profile.repository';
import { LocalProfileAvatarStorageService } from '../infrastructure/storage/local-profile-avatar-storage.service';

/**
 * Wires the Profiles presentation layer to its Use Cases, which are
 * wired to the real `PrismaProfileRepository` (Sprint 3, Etapa 3) via
 * the `PROFILE_REPOSITORY` DI token — Use Cases depend on the
 * `ProfileRepository` interface only, never on `PrismaProfileRepository`
 * directly. Imports `IdentityPresentationModule` to get
 * `IDENTITY_REPOSITORY` — `CreateProfileUseCase` verifies the
 * referenced Identity exists before creating a profile for it.
 */
@Module({
  imports: [IdentityPresentationModule],
  controllers: [ProfileController],
  providers: [
    { provide: PROFILE_REPOSITORY, useClass: PrismaProfileRepository },
    {
      provide: CreateProfileUseCase,
      useFactory: (
        profileRepo: ProfileRepository,
        identityRepo: IdentityRepository,
      ) => new CreateProfileUseCase(profileRepo, identityRepo),
      inject: [PROFILE_REPOSITORY, IDENTITY_REPOSITORY],
    },
    {
      provide: UpdateProfileUseCase,
      useFactory: (repo: ProfileRepository) => new UpdateProfileUseCase(repo),
      inject: [PROFILE_REPOSITORY],
    },
    {
      provide: DeleteProfileUseCase,
      useFactory: (repo: ProfileRepository) => new DeleteProfileUseCase(repo),
      inject: [PROFILE_REPOSITORY],
    },
    {
      provide: GetProfileUseCase,
      useFactory: (repo: ProfileRepository) => new GetProfileUseCase(repo),
      inject: [PROFILE_REPOSITORY],
    },
    {
      provide: ListProfileUseCase,
      useFactory: (repo: ProfileRepository) => new ListProfileUseCase(repo),
      inject: [PROFILE_REPOSITORY],
    },
    {
      provide: SearchProfileUseCase,
      useFactory: (repo: ProfileRepository) => new SearchProfileUseCase(repo),
      inject: [PROFILE_REPOSITORY],
    },
    {
      provide: UpdateProfileAvatarUseCase,
      useFactory: (repo: ProfileRepository) =>
        new UpdateProfileAvatarUseCase(repo),
      inject: [PROFILE_REPOSITORY],
    },
    LocalProfileAvatarStorageService,
  ],
  exports: [PROFILE_REPOSITORY],
})
export class ProfilesPresentationModule {}
