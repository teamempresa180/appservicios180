import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CategoryStatus } from '../../domain/value-objects/category-status.value-object';

/**
 * HTTP request body for `PUT /categories/:id`. Distinct from
 * `application/dto/update-category.dto.ts` — see
 * `create-category.request.dto.ts` for the rationale. Only mirrors
 * the fields `UpdateCategoryCommand` actually accepts (name/
 * description/status) — icon/color are not updatable, per the
 * existing Application layer contract.
 */
export class UpdateCategoryRequestDto {
  @ApiPropertyOptional({ example: 'Plumbing' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Plumbing-related home services.' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ enum: CategoryStatus, example: CategoryStatus.Active })
  @IsOptional()
  @IsEnum(CategoryStatus)
  status?: CategoryStatus;
}
