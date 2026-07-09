import { CategoryStatus } from '../../domain/value-objects/category-status.value-object';

/**
 * Intent to update an existing Category. Plain data — no behavior.
 */
export class UpdateCategoryCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly status?: CategoryStatus,
  ) {}
}
