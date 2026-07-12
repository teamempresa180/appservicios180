import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { CategoryType } from '../../domain/value-objects/category-type.value-object';
import { CategoryStatus } from '../../domain/value-objects/category-status.value-object';
import { CreateCategoryCommand } from '../commands/create-category.command';
import { UpdateCategoryCommand } from '../commands/update-category.command';

/**
 * Structural validation for Category commands — required fields,
 * well-formed values. No business rules — `Category` is a standalone
 * catalog entity (no `IdentityId`, no hierarchy), so there is no
 * existence check or uniqueness invariant to enforce.
 */
export class CategoryValidator {
  static validateCreate(command: CreateCategoryCommand): void {
    if (!command.name?.trim()) {
      throw new ValidationException('name is required');
    }
    if (!command.description?.trim()) {
      throw new ValidationException('description is required');
    }
    if (!command.icon?.trim()) {
      throw new ValidationException('icon is required');
    }
    if (!command.color?.trim()) {
      throw new ValidationException('color is required');
    }
    if (!Object.values(CategoryType).includes(command.type)) {
      throw new ValidationException(
        `type must be one of: ${Object.values(CategoryType).join(', ')}`,
      );
    }
  }

  static validateUpdate(command: UpdateCategoryCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (command.name !== undefined && !command.name.trim()) {
      throw new ValidationException('name cannot be blank');
    }
    if (command.description !== undefined && !command.description.trim()) {
      throw new ValidationException('description cannot be blank');
    }
    if (
      command.status !== undefined &&
      !Object.values(CategoryStatus).includes(command.status)
    ) {
      throw new ValidationException(
        `status must be one of: ${Object.values(CategoryStatus).join(', ')}`,
      );
    }
  }
}
