import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';
import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';

/**
 * HTTP request body for `PUT /providers/:id`. Distinct from
 * `application/dto/update-provider.dto.ts` — see
 * `create-provider.request.dto.ts` for the rationale. Only mirrors
 * the fields `UpdateProviderCommand` actually accepts (biography/
 * experience/status) — yearsOfExperience is not updatable, per the
 * existing Application layer contract.
 */
export class UpdateProviderRequestDto {
  @ApiPropertyOptional({ example: 'Plumber with 12 years of experience.' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  biography?: string;

  @ApiPropertyOptional({
    enum: ProviderExperience,
    example: ProviderExperience.Advanced,
  })
  @IsOptional()
  @IsEnum(ProviderExperience)
  experience?: ProviderExperience;

  @ApiPropertyOptional({
    enum: ProviderStatus,
    example: ProviderStatus.Pending,
    description:
      'Admin-only, except that the owning Identity may resubmit a REJECTED application by sending PENDING. See UpdateProviderUseCase.',
  })
  @IsOptional()
  @IsEnum(ProviderStatus)
  status?: ProviderStatus;

  @ApiPropertyOptional({ example: 'category-id-123' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  categoryId?: string;

  @ApiPropertyOptional({
    example: 'specialization-id-123',
    description:
      'The real Specialization within categoryId this Provider offers. Requires categoryId.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  specializationId?: string;
}
