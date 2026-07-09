import { CategoryRepository } from '../../domain/interfaces/category-repository.interface';
import { DeleteCategoryCommand } from '../commands/delete-category.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  execute(command: DeleteCategoryCommand): Promise<void> {
    void this.categoryRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
