import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';
import { CategoryPresentationModule } from '../../category/presentation/category.module';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from '../../category/domain/interfaces/category-repository.interface';
import { ProviderPresentationModule } from '../../provider/presentation/provider.module';
import {
  PROVIDER_REPOSITORY,
  ProviderRepository,
} from '../../provider/domain/interfaces/provider-repository.interface';
import { ServiceController } from './controllers/service.controller';
import { CreateServiceUseCase } from '../application/use_cases/create-service.use-case';
import { UpdateServiceUseCase } from '../application/use_cases/update-service.use-case';
import { DeleteServiceUseCase } from '../application/use_cases/delete-service.use-case';
import { GetServiceUseCase } from '../application/use_cases/get-service.use-case';
import { ListServiceUseCase } from '../application/use_cases/list-service.use-case';
import { SearchServiceUseCase } from '../application/use_cases/search-service.use-case';
import {
  SERVICE_REPOSITORY,
  ServiceRepository,
} from '../domain/interfaces/service-repository.interface';
import { PrismaServiceRepository } from '../infrastructure/persistence/prisma-service.repository';

/**
 * Wires the Service presentation layer to its Use Cases, which are
 * wired to the real `PrismaServiceRepository` (Sprint 3, Etapa 6) via
 * the `SERVICE_REPOSITORY` DI token. Imports
 * `CategoryPresentationModule` and, as of Sprint 3 Etapa 7,
 * `ProviderPresentationModule` too — `CreateServiceUseCase` now
 * verifies both the referenced Category and the referenced Provider
 * exist before creating a service for it (Provider check was
 * previously deferred, see `CreateServiceUseCase`'s doc comment).
 */
@Module({
  imports: [
    CategoryPresentationModule,
    ProviderPresentationModule,
    PrismaModule,
  ],
  controllers: [ServiceController],
  providers: [
    { provide: SERVICE_REPOSITORY, useClass: PrismaServiceRepository },
    {
      provide: CreateServiceUseCase,
      useFactory: (
        serviceRepo: ServiceRepository,
        categoryRepo: CategoryRepository,
        providerRepo: ProviderRepository,
      ) => new CreateServiceUseCase(serviceRepo, categoryRepo, providerRepo),
      inject: [SERVICE_REPOSITORY, CATEGORY_REPOSITORY, PROVIDER_REPOSITORY],
    },
    {
      provide: UpdateServiceUseCase,
      useFactory: (repo: ServiceRepository) => new UpdateServiceUseCase(repo),
      inject: [SERVICE_REPOSITORY],
    },
    {
      provide: DeleteServiceUseCase,
      useFactory: (repo: ServiceRepository) => new DeleteServiceUseCase(repo),
      inject: [SERVICE_REPOSITORY],
    },
    {
      provide: GetServiceUseCase,
      useFactory: (repo: ServiceRepository) => new GetServiceUseCase(repo),
      inject: [SERVICE_REPOSITORY],
    },
    {
      provide: ListServiceUseCase,
      useFactory: (repo: ServiceRepository) => new ListServiceUseCase(repo),
      inject: [SERVICE_REPOSITORY],
    },
    {
      provide: SearchServiceUseCase,
      useFactory: (repo: ServiceRepository) => new SearchServiceUseCase(repo),
      inject: [SERVICE_REPOSITORY],
    },
  ],
  exports: [SERVICE_REPOSITORY],
})
export class ServicePresentationModule {}
