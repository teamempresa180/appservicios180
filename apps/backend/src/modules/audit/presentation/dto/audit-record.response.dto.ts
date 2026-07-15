import { ApiProperty } from '@nestjs/swagger';
import { AuditActionType } from '../../domain/value-objects/audit-action-type.value-object';

/**
 * HTTP response body for the Audit endpoints. Distinct from
 * `application/dto/audit-record.dto.ts` — see
 * `create-audit-record.request.dto.ts` for the rationale.
 */
export class AuditRecordResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  identityId!: string;

  @ApiProperty({ enum: AuditActionType })
  actionType!: AuditActionType;

  @ApiProperty({ example: 'User logged in from a new device.' })
  description!: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', type: String })
  occurredAt!: string;
}
