import { CategoryStatus } from '../../domain/value-objects/category-status.value-object';

/**
 * Input shape for updating a Category. No validation.
 */
export class UpdateCategoryDto {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  status?: CategoryStatus;
}
