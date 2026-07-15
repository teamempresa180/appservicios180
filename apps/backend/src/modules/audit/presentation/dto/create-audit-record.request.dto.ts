import { ApiProperty } from '@nestjs/swagger';
import { AuditActionType } from '../../domain/value-objects/audit-action-type.value-object';

/**
 * HTTP request body for `POST /audit-records`. Distinct from
 * `application/dto/create-audit-record.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `AuditHttpMapper` translates between the two. There is no
 * update/delete Request DTO — audit records are immutable by design
 * (see `CreateAuditRecordCommand`).
 */
export class CreateAuditRecordRequestDto {
  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity this Audit record belongs to.',
  })
  identityId!: string;

  @ApiProperty({ enum: AuditActionType, example: AuditActionType.LoggedIn })
  actionType!: AuditActionType;

  @ApiProperty({ example: 'User logged in from a new device.' })
  description!: string;
}
