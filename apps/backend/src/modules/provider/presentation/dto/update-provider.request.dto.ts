import { ApiPropertyOptional } from '@nestjs/swagger';
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
  biography?: string;

  @ApiPropertyOptional({
    enum: ProviderExperience,
    example: ProviderExperience.Advanced,
  })
  experience?: ProviderExperience;

  @ApiPropertyOptional({ enum: ProviderStatus, example: ProviderStatus.Active })
  status?: ProviderStatus;

  @ApiPropertyOptional({ example: 'category-id-123' })
  categoryId?: string;

  @ApiPropertyOptional({
    example: 'specialization-id-123',
    description:
      'The real Specialization within categoryId this Provider offers. Requires categoryId.',
  })
  specializationId?: string;
}
