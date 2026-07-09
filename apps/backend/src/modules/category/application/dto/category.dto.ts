import { CategoryStatus } from '../../domain/value-objects/category-status.value-object';
import { CategoryType } from '../../domain/value-objects/category-type.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class CategoryDto {
  id!: string;
  name!: string;
  description!: string;
  icon!: string;
  color!: string;
  status!: CategoryStatus;
  type!: CategoryType;
  createdAt!: Date;
  updatedAt!: Date;
}
