import { CategoryRepository } from '../../domain/interfaces/category-repository.interface';
import { CategoryDto } from '../dto/category.dto';
import { CreateCategoryCommand } from '../commands/create-category.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  execute(command: CreateCategoryCommand): Promise<CategoryDto> {
    void this.categoryRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
