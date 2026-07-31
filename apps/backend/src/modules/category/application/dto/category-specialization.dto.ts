/**
 * Output shape returned by queries and use cases.
 */
export class CategorySpecializationDto {
  id!: string;
  categoryId!: string;
  name!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
