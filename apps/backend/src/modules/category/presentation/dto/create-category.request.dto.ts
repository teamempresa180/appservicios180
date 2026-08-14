import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
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
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'Plumbing-related home services.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description!: string;

  @ApiProperty({ example: 'wrench-icon' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  icon!: string;

  @ApiProperty({ example: '#0088CC' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  color!: string;

  @ApiProperty({ enum: CategoryType, example: CategoryType.Standard })
  @IsEnum(CategoryType)
  type!: CategoryType;
}
