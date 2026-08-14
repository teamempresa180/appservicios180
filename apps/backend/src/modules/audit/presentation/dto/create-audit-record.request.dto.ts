import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { AuditActionType } from '../../domain/value-objects/audit-action-type.value-object';

/**
 * HTTP request body for `POST /audit-records`. Distinct from
 * `application/dto/create-audit-record.dto.ts` — that DTO is the
 * Application layer's internal input shape, this one is the wire
 * contract exposed to API clients (documented via `@ApiProperty` for
 * Swagger). `AuditHttpMapper` translates between the two. There is no
 * update/delete Request DTO — audit records are immutable by design
 * (see `CreateAuditRecordCommand`).
 *
 * Every field carries `class-validator` decorators: the global
 * `ValidationPipe` runs with `whitelist`/`forbidNonWhitelisted`, so an
 * undecorated field would be stripped from the payload rather than
 * reaching the Use Case.
 */
export class CreateAuditRecordRequestDto {
  @ApiProperty({
    example: 'identity-id-123',
    description: 'The id of the Identity this Audit record belongs to.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  identityId!: string;

  @ApiProperty({ enum: AuditActionType, example: AuditActionType.LoggedIn })
  @IsEnum(AuditActionType)
  actionType!: AuditActionType;

  @ApiProperty({ example: 'User logged in from a new device.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description!: string;
}
