import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateVerificationCommand } from '../../application/commands/create-verification.command';
import { UpdateVerificationCommand } from '../../application/commands/update-verification.command';
import { UploadVerificationDocumentCommand } from '../../application/commands/upload-verification-document.command';
import { VerificationDto } from '../../application/dto/verification.dto';
import { CreateVerificationRequestDto } from './create-verification.request.dto';
import { UpdateVerificationRequestDto } from './update-verification.request.dto';
import { VerificationResponseDto } from './verification.response.dto';
import { VerificationListResponseDto } from './verification-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `VerificationController` never builds a
 * `CreateVerificationCommand` or a `VerificationResponseDto` by hand.
 */
export class VerificationHttpMapper {
  static toCreateCommand(
    dto: CreateVerificationRequestDto,
    caller: AuthenticatedUser,
  ): CreateVerificationCommand {
    return new CreateVerificationCommand(dto.identityId, dto.type, caller);
  }

  static toUpdateCommand(
    id: string,
    dto: UpdateVerificationRequestDto,
    caller: AuthenticatedUser,
  ): UpdateVerificationCommand {
    return new UpdateVerificationCommand(id, dto.status, caller);
  }

  static toUploadDocumentCommand(
    id: string,
    documentPath: string,
    caller: AuthenticatedUser,
  ): UploadVerificationDocumentCommand {
    return new UploadVerificationDocumentCommand(id, documentPath, caller);
  }

  static toResponse(dto: VerificationDto): VerificationResponseDto {
    const response = new VerificationResponseDto();
    response.id = dto.id;
    response.identityId = dto.identityId;
    response.type = dto.type;
    response.status = dto.status;
    response.verifiedAt = dto.verifiedAt ? dto.verifiedAt.toISOString() : null;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    response.documentPath = dto.documentPath;
    return response;
  }

  static toListResponse(
    result: PaginatedResult<VerificationDto>,
  ): VerificationListResponseDto {
    const response = new VerificationListResponseDto();
    response.items = result.items.map((item) =>
      VerificationHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
