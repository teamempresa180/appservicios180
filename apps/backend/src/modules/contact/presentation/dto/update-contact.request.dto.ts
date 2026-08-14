import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';

/**
 * HTTP request body for `PUT /contacts/:id`. Distinct from
 * `application/dto/update-contact.dto.ts` — see
 * `create-contact.request.dto.ts` for the rationale. `type` is not
 * updatable, so the channel-specific shape of `value` is checked
 * against the stored Contact's own type in `UpdateContactUseCase`.
 */
export class UpdateContactRequestDto {
  @ApiPropertyOptional({ example: 'jane.doe@example.com' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  value?: string;

  @ApiPropertyOptional({ enum: ContactStatus, example: ContactStatus.Active })
  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;
}
