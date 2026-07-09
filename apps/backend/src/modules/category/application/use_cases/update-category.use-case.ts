import { CategoryRepository } from '../../domain/interfaces/category-repository.interface';
import { CategoryDto } from '../dto/category.dto';
import { UpdateCategoryCommand } from '../commands/update-category.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  execute(command: UpdateCategoryCommand): Promise<CategoryDto> {
    void this.categoryRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
