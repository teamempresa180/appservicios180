import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateAuditRecordCommand } from '../../application/commands/create-audit-record.command';
import { AuditRecordDto } from '../../application/dto/audit-record.dto';
import { CreateAuditRecordRequestDto } from './create-audit-record.request.dto';
import { AuditRecordResponseDto } from './audit-record.response.dto';
import { AuditRecordListResponseDto } from './audit-record-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `AuditController` never builds a
 * `CreateAuditRecordCommand` or an `AuditRecordResponseDto` by hand.
 * No `toUpdateCommand()` — audit records are immutable by design.
 *
 * The command carries the authenticated caller so the Use Case can
 * enforce ownership; it comes from `@CurrentUser()`, never from the
 * request body.
 */
export class AuditHttpMapper {
  static toCreateCommand(
    caller: AuthenticatedUser,
    dto: CreateAuditRecordRequestDto,
  ): CreateAuditRecordCommand {
    return new CreateAuditRecordCommand(
      caller,
      dto.identityId,
      dto.actionType,
      dto.description,
    );
  }

  static toResponse(dto: AuditRecordDto): AuditRecordResponseDto {
    const response = new AuditRecordResponseDto();
    response.id = dto.id;
    response.identityId = dto.identityId;
    response.actionType = dto.actionType;
    response.description = dto.description;
    response.occurredAt = dto.occurredAt.toISOString();
    return response;
  }

  static toListResponse(
    result: PaginatedResult<AuditRecordDto>,
  ): AuditRecordListResponseDto {
    const response = new AuditRecordListResponseDto();
    response.items = result.items.map((item) =>
      AuditHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
