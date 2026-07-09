import { CategoryType } from '../../domain/value-objects/category-type.value-object';

/**
 * Input shape for creating a Category. No validation.
 */
export class CreateCategoryDto {
  name!: string;
  description!: string;
  icon!: string;
  color!: string;
  type!: CategoryType;
}
