import { Module } from '@nestjs/common';
import { IdentityPresentationModule } from '../../identity/presentation/identity.module';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../identity/domain/interfaces/identity-repository.interface';
import { ProfilesPresentationModule } from '../../profiles/presentation/profile.module';
import {
  PROFILE_REPOSITORY,
  ProfileRepository,
} from '../../profiles/domain/interfaces/profile-repository.interface';
import { CategoryPresentationModule } from '../../category/presentation/category.module';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from '../../category/domain/interfaces/category-repository.interface';
import { ProviderController } from './controllers/provider.controller';
import { CreateProviderUseCase } from '../application/use_cases/create-provider.use-case';
import { UpdateProviderUseCase } from '../application/use_cases/update-provider.use-case';
import { DeleteProviderUseCase } from '../application/use_cases/delete-provider.use-case';
import { GetProviderUseCase } from '../application/use_cases/get-provider.use-case';
import { ListProviderUseCase } from '../application/use_cases/list-provider.use-case';
import { SearchProviderUseCase } from '../application/use_cases/search-provider.use-case';
import { FindCompatibleProvidersUseCase } from '../application/use_cases/find-compatible-providers.use-case';
import {
  PROVIDER_REPOSITORY,
  ProviderRepository,
} from '../domain/interfaces/provider-repository.interface';
import { PrismaProviderRepository } from '../infrastructure/persistence/prisma-provider.repository';

/**
 * Wires the Provider presentation layer to its Use Cases, which are
 * wired to the real `PrismaProviderRepository` (Sprint 3, Etapa 7) via
 * the `PROVIDER_REPOSITORY` DI token. Imports
 * `IdentityPresentationModule` and `ProfilesPresentationModule` —
 * `CreateProviderUseCase` verifies both the referenced Identity and
 * the referenced Profile exist, and enforces the 1:1 invariant with
 * Identity before creating a Provider record.
 */
@Module({
  imports: [
    IdentityPresentationModule,
    ProfilesPresentationModule,
    CategoryPresentationModule,
  ],
  controllers: [ProviderController],
  providers: [
    { provide: PROVIDER_REPOSITORY, useClass: PrismaProviderRepository },
    {
      provide: CreateProviderUseCase,
      useFactory: (
        providerRepo: ProviderRepository,
        identityRepo: IdentityRepository,
        profileRepo: ProfileRepository,
        categoryRepo: CategoryRepository,
      ) =>
        new CreateProviderUseCase(
          providerRepo,
          identityRepo,
          profileRepo,
          categoryRepo,
        ),
      inject: [
        PROVIDER_REPOSITORY,
        IDENTITY_REPOSITORY,
        PROFILE_REPOSITORY,
        CATEGORY_REPOSITORY,
      ],
    },
    {
      provide: UpdateProviderUseCase,
      useFactory: (repo: ProviderRepository) => new UpdateProviderUseCase(repo),
      inject: [PROVIDER_REPOSITORY],
    },
    {
      provide: DeleteProviderUseCase,
      useFactory: (repo: ProviderRepository) => new DeleteProviderUseCase(repo),
      inject: [PROVIDER_REPOSITORY],
    },
    {
      provide: GetProviderUseCase,
      useFactory: (repo: ProviderRepository) => new GetProviderUseCase(repo),
      inject: [PROVIDER_REPOSITORY],
    },
    {
      provide: ListProviderUseCase,
      useFactory: (repo: ProviderRepository) => new ListProviderUseCase(repo),
      inject: [PROVIDER_REPOSITORY],
    },
    {
      provide: SearchProviderUseCase,
      useFactory: (repo: ProviderRepository) => new SearchProviderUseCase(repo),
      inject: [PROVIDER_REPOSITORY],
    },
    {
      provide: FindCompatibleProvidersUseCase,
      useFactory: (repo: ProviderRepository) =>
        new FindCompatibleProvidersUseCase(repo),
      inject: [PROVIDER_REPOSITORY],
    },
  ],
  exports: [PROVIDER_REPOSITORY],
})
export class ProviderPresentationModule {}
