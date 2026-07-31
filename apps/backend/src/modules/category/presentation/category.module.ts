import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/category.controller';
import { CreateCategoryUseCase } from '../application/use_cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../application/use_cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../application/use_cases/delete-category.use-case';
import { GetCategoryUseCase } from '../application/use_cases/get-category.use-case';
import { ListCategoryUseCase } from '../application/use_cases/list-category.use-case';
import { SearchCategoryUseCase } from '../application/use_cases/search-category.use-case';
import { ListCategorySpecializationsUseCase } from '../application/use_cases/list-category-specializations.use-case';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from '../domain/interfaces/category-repository.interface';
import {
  CATEGORY_SPECIALIZATION_REPOSITORY,
  CategorySpecializationRepository,
} from '../domain/interfaces/category-specialization-repository.interface';
import { PrismaCategoryRepository } from '../infrastructure/persistence/prisma-category.repository';
import { PrismaCategorySpecializationRepository } from '../infrastructure/persistence/prisma-category-specialization.repository';

/**
 * Wires the Category presentation layer to its Use Cases, which are
 * wired to the real `PrismaCategoryRepository` (Sprint 3, Etapa 6) via
 * the `CATEGORY_REPOSITORY` DI token. `Category` is a standalone
 * catalog entity — no other bounded context's repository is imported
 * here (unlike every module referencing `IdentityId`).
 */
@Module({
  controllers: [CategoryController],
  providers: [
    { provide: CATEGORY_REPOSITORY, useClass: PrismaCategoryRepository },
    {
      provide: CATEGORY_SPECIALIZATION_REPOSITORY,
      useClass: PrismaCategorySpecializationRepository,
    },
    {
      provide: CreateCategoryUseCase,
      useFactory: (repo: CategoryRepository) => new CreateCategoryUseCase(repo),
      inject: [CATEGORY_REPOSITORY],
    },
    {
      provide: UpdateCategoryUseCase,
      useFactory: (repo: CategoryRepository) => new UpdateCategoryUseCase(repo),
      inject: [CATEGORY_REPOSITORY],
    },
    {
      provide: DeleteCategoryUseCase,
      useFactory: (repo: CategoryRepository) => new DeleteCategoryUseCase(repo),
      inject: [CATEGORY_REPOSITORY],
    },
    {
      provide: GetCategoryUseCase,
      useFactory: (repo: CategoryRepository) => new GetCategoryUseCase(repo),
      inject: [CATEGORY_REPOSITORY],
    },
    {
      provide: ListCategoryUseCase,
      useFactory: (repo: CategoryRepository) => new ListCategoryUseCase(repo),
      inject: [CATEGORY_REPOSITORY],
    },
    {
      provide: SearchCategoryUseCase,
      useFactory: (repo: CategoryRepository) => new SearchCategoryUseCase(repo),
      inject: [CATEGORY_REPOSITORY],
    },
    {
      provide: ListCategorySpecializationsUseCase,
      useFactory: (
        specializationRepo: CategorySpecializationRepository,
        categoryRepo: CategoryRepository,
      ) =>
        new ListCategorySpecializationsUseCase(specializationRepo, categoryRepo),
      inject: [CATEGORY_SPECIALIZATION_REPOSITORY, CATEGORY_REPOSITORY],
    },
  ],
  exports: [CATEGORY_REPOSITORY, CATEGORY_SPECIALIZATION_REPOSITORY],
})
export class CategoryPresentationModule {}
