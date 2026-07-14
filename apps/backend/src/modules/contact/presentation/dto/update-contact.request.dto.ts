import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';

/**
 * HTTP request body for `PUT /contacts/:id`. Distinct from
 * `application/dto/update-contact.dto.ts` — see
 * `create-contact.request.dto.ts` for the rationale.
 */
export class UpdateContactRequestDto {
  @ApiPropertyOptional({ example: 'jane.doe@example.com' })
  value?: string;

  @ApiPropertyOptional({ enum: ContactStatus, example: ContactStatus.Active })
  status?: ContactStatus;
}
