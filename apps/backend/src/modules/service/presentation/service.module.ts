import { Module } from '@nestjs/common';
import { CategoryPresentationModule } from '../../category/presentation/category.module';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from '../../category/domain/interfaces/category-repository.interface';
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
 * the `SERVICE_REPOSITORY` DI token. Imports `CategoryPresentationModule`
 * to get `CATEGORY_REPOSITORY` — `CreateServiceUseCase` verifies the
 * referenced Category exists before creating a service for it.
 * Does not import a Provider module — no `PrismaProviderRepository`
 * exists yet (see `PrismaServiceRepository`'s own doc comment).
 */
@Module({
  imports: [CategoryPresentationModule],
  controllers: [ServiceController],
  providers: [
    { provide: SERVICE_REPOSITORY, useClass: PrismaServiceRepository },
    {
      provide: CreateServiceUseCase,
      useFactory: (
        serviceRepo: ServiceRepository,
        categoryRepo: CategoryRepository,
      ) => new CreateServiceUseCase(serviceRepo, categoryRepo),
      inject: [SERVICE_REPOSITORY, CATEGORY_REPOSITORY],
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
