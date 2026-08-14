import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IdentityStatus } from '../../domain/value-objects/identity-status.value-object';

/**
 * HTTP request body for `PUT /identities/:id`. Distinct from
 * `application/dto/update-identity.dto.ts` — see
 * `create-identity.request.dto.ts` for the rationale, including why
 * every field must be decorated.
 */
export class UpdateIdentityRequestDto {
  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  fullName?: string;

  @ApiPropertyOptional({ enum: IdentityStatus, example: IdentityStatus.Active })
  @IsOptional()
  @IsEnum(IdentityStatus)
  status?: IdentityStatus;
}
