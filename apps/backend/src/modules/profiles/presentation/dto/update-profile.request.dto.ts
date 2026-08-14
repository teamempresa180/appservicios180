import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';

/**
 * HTTP request body for `PUT /profiles/:id`. Distinct from
 * `application/dto/update-profile.dto.ts` — see
 * `create-profile.request.dto.ts` for the rationale, including why
 * every field must be decorated.
 */
export class UpdateProfileRequestDto {
  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  displayName?: string;

  @ApiPropertyOptional({
    enum: ProfileVisibility,
    example: ProfileVisibility.Private,
  })
  @IsOptional()
  @IsEnum(ProfileVisibility)
  visibility?: ProfileVisibility;

  @ApiPropertyOptional({ enum: ProfileStatus, example: ProfileStatus.Active })
  @IsOptional()
  @IsEnum(ProfileStatus)
  status?: ProfileStatus;
}
