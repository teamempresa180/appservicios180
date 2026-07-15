import { ApiProperty } from '@nestjs/swagger';
import { CategoryStatus } from '../../domain/value-objects/category-status.value-object';
import { CategoryType } from '../../domain/value-objects/category-type.value-object';

/**
 * HTTP response body for the Category endpoints. Distinct from
 * `application/dto/category.dto.ts` — see
 * `create-category.request.dto.ts` for the rationale.
 */
export class CategoryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'Plumbing' })
  name!: string;

  @ApiProperty({ example: 'Plumbing-related home services.' })
  description!: string;

  @ApiProperty({ example: 'wrench-icon' })
  icon!: string;

  @ApiProperty({ example: '#0088CC' })
  color!: string;

  @ApiProperty({ enum: CategoryStatus })
  status!: CategoryStatus;

  @ApiProperty({ enum: CategoryType })
  type!: CategoryType;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
