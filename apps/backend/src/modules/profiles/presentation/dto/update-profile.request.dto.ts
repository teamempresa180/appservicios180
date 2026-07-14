import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';

/**
 * HTTP request body for `PUT /profiles/:id`. Distinct from
 * `application/dto/update-profile.dto.ts` — see
 * `create-profile.request.dto.ts` for the rationale.
 */
export class UpdateProfileRequestDto {
  @ApiPropertyOptional({ example: 'Jane Doe' })
  displayName?: string;

  @ApiPropertyOptional({
    enum: ProfileVisibility,
    example: ProfileVisibility.Private,
  })
  visibility?: ProfileVisibility;

  @ApiPropertyOptional({ enum: ProfileStatus, example: ProfileStatus.Active })
  status?: ProfileStatus;
}
