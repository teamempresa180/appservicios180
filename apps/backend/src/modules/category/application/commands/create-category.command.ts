import { CategoryType } from '../../domain/value-objects/category-type.value-object';

/**
 * Intent to create a new Category. Plain data — no behavior.
 */
export class CreateCategoryCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly icon: string,
    public readonly color: string,
    public readonly type: CategoryType,
  ) {}
}
