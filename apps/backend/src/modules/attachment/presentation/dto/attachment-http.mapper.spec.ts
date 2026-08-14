import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { AttachmentDto } from '../../application/dto/attachment.dto';
import { AttachmentStatus } from '../../domain/value-objects/attachment-status.value-object';
import { AttachmentType } from '../../domain/value-objects/attachment-type.value-object';
import { CreateAttachmentRequestDto } from './create-attachment.request.dto';
import { AttachmentHttpMapper } from './attachment-http.mapper';

describe('AttachmentHttpMapper', () => {
  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  it('toCreateCommand() maps every field in order', () => {
    const dto: CreateAttachmentRequestDto = {
      messageId: 'message-1',
      fileName: 'leak-photo.jpg',
      mimeType: 'image/jpeg',
      fileSize: 204800,
      type: AttachmentType.Image,
    };

    const command = AttachmentHttpMapper.toCreateCommand(caller, dto);

    expect(command.messageId).toBe('message-1');
    expect(command.fileName).toBe('leak-photo.jpg');
    expect(command.mimeType).toBe('image/jpeg');
    expect(command.fileSize).toBe(204800);
    expect(command.type).toBe(AttachmentType.Image);
  });

  it('toResponse() converts createdAt to an ISO string', () => {
    const dto: AttachmentDto = {
      id: 'id-1',
      messageId: 'message-1',
      fileName: 'leak-photo.jpg',
      mimeType: 'image/jpeg',
      fileSize: 204800,
      type: AttachmentType.Image,
      status: AttachmentStatus.Pending,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const response = AttachmentHttpMapper.toResponse(dto);

    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: AttachmentDto = {
      id: 'id-1',
      messageId: 'message-1',
      fileName: 'leak-photo.jpg',
      mimeType: 'image/jpeg',
      fileSize: 204800,
      type: AttachmentType.Image,
      status: AttachmentStatus.Pending,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const response = AttachmentHttpMapper.toListResponse({
      items: [dto],
      total: 1,
      page: 1,
      pageSize: 20,
    });

    expect(response.items).toHaveLength(1);
    expect(response.items[0].id).toBe('id-1');
    expect(response.total).toBe(1);
  });
});
