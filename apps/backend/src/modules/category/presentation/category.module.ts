import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/category.controller';
import { CreateCategoryUseCase } from '../application/use_cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../application/use_cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../application/use_cases/delete-category.use-case';
import { GetCategoryUseCase } from '../application/use_cases/get-category.use-case';
import { CategoryRepository } from '../domain/interfaces/category-repository.interface';

/**
 * Wires the Category presentation layer to its Use Cases.
 *
 * No concrete CategoryRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [CategoryController],
  providers: [
    {
      provide: CreateCategoryUseCase,
      useFactory: () =>
        new CreateCategoryUseCase(undefined as unknown as CategoryRepository),
    },
    {
      provide: UpdateCategoryUseCase,
      useFactory: () =>
        new UpdateCategoryUseCase(undefined as unknown as CategoryRepository),
    },
    {
      provide: DeleteCategoryUseCase,
      useFactory: () =>
        new DeleteCategoryUseCase(undefined as unknown as CategoryRepository),
    },
    {
      provide: GetCategoryUseCase,
      useFactory: () =>
        new GetCategoryUseCase(undefined as unknown as CategoryRepository),
    },
  ],
})
export class CategoryPresentationModule {}
