import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from '../../domain/value-objects/category-type.value-object';

/**
 * HTTP request body for `POST /categories`. Distinct from
 * `application/dto/create-category.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `CategoryHttpMapper` translates between the two.
 */
export class CreateCategoryRequestDto {
  @ApiProperty({ example: 'Plumbing' })
  name!: string;

  @ApiProperty({ example: 'Plumbing-related home services.' })
  description!: string;

  @ApiProperty({ example: 'wrench-icon' })
  icon!: string;

  @ApiProperty({ example: '#0088CC' })
  color!: string;

  @ApiProperty({ enum: CategoryType, example: CategoryType.Standard })
  type!: CategoryType;
}
