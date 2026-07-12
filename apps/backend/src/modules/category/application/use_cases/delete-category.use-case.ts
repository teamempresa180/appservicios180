import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { CategoryRepository } from '../../domain/interfaces/category-repository.interface';
import { CategoryId } from '../../domain/value-objects/category-id.value-object';
import { DeleteCategoryCommand } from '../commands/delete-category.command';

/**
 * Deletes an existing Category. No cascade rule is documented for
 * what happens to `Service` records referencing this `CategoryId` —
 * same pattern as `DeleteIdentityUseCase` leaving cross-module cascade
 * undocumented behavior unimplemented rather than inventing a policy.
 */
export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(command: DeleteCategoryCommand): Promise<void> {
    const id = CategoryId.fromString(command.id);
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Category ${command.id} not found`);
    }
    await this.categoryRepository.delete(id);
  }
}
