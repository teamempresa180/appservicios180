import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateAttachmentCommand } from '../../application/commands/create-attachment.command';
import { AttachmentDto } from '../../application/dto/attachment.dto';
import { CreateAttachmentRequestDto } from './create-attachment.request.dto';
import { AttachmentResponseDto } from './attachment.response.dto';
import { AttachmentListResponseDto } from './attachment-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `AttachmentController` never builds a
 * `CreateAttachmentCommand` or an `AttachmentResponseDto` by hand. No
 * `toUpdateCommand`: there is no `UpdateAttachmentCommand` in the
 * Application layer, only Create/Delete.
 *
 * The command carries the authenticated caller so the Use Case can
 * enforce authorship; it comes from `@CurrentUser()`, never from the
 * request body.
 */
export class AttachmentHttpMapper {
  static toCreateCommand(
    caller: AuthenticatedUser,
    dto: CreateAttachmentRequestDto,
  ): CreateAttachmentCommand {
    return new CreateAttachmentCommand(
      caller,
      dto.messageId,
      dto.fileName,
      dto.mimeType,
      dto.fileSize,
      dto.type,
    );
  }

  static toResponse(dto: AttachmentDto): AttachmentResponseDto {
    const response = new AttachmentResponseDto();
    response.id = dto.id;
    response.messageId = dto.messageId;
    response.fileName = dto.fileName;
    response.mimeType = dto.mimeType;
    response.fileSize = dto.fileSize;
    response.type = dto.type;
    response.status = dto.status;
    response.createdAt = dto.createdAt.toISOString();
    return response;
  }

  static toListResponse(
    result: PaginatedResult<AttachmentDto>,
  ): AttachmentListResponseDto {
    const response = new AttachmentListResponseDto();
    response.items = result.items.map((item) =>
      AttachmentHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
