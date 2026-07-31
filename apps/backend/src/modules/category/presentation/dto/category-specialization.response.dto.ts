import { ApiProperty } from '@nestjs/swagger';

/**
 * HTTP response body for `GET /categories/:categoryId/specializations`.
 * Distinct from `application/dto/category-specialization.dto.ts` — see
 * `create-category.request.dto.ts` for the rationale.
 */
export class CategorySpecializationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  categoryId!: string;

  @ApiProperty({ example: 'Residencial' })
  name!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  updatedAt!: string;
}
