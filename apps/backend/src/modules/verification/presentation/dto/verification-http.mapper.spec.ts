import { Role } from '../../../../common/auth/role.enum';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { VerificationDto } from '../../application/dto/verification.dto';
import { VerificationType } from '../../domain/value-objects/verification-type.value-object';
import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';
import { CreateVerificationRequestDto } from './create-verification.request.dto';
import { UpdateVerificationRequestDto } from './update-verification.request.dto';
import { VerificationHttpMapper } from './verification-http.mapper';

describe('VerificationHttpMapper', () => {
  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  it('toCreateCommand() carries identityId/type through', () => {
    const dto: CreateVerificationRequestDto = {
      identityId: 'identity-1',
      type: VerificationType.Phone,
    };

    const command = VerificationHttpMapper.toCreateCommand(dto, caller);

    expect(command.identityId).toBe('identity-1');
    expect(command.type).toBe(VerificationType.Phone);
    expect(command.caller).toBe(caller);
  });

  it('toUpdateCommand() carries the id and optional status through', () => {
    const dto: UpdateVerificationRequestDto = {
      status: VerificationStatus.Rejected,
    };

    const command = VerificationHttpMapper.toUpdateCommand('id-1', dto, caller);

    expect(command.id).toBe('id-1');
    expect(command.status).toBe(VerificationStatus.Rejected);
  });

  it('toUploadDocumentCommand() carries the id and documentPath through', () => {
    const command = VerificationHttpMapper.toUploadDocumentCommand(
      'id-1',
      'uploads/verifications/id-1/record.pdf',
      caller,
    );

    expect(command.id).toBe('id-1');
    expect(command.documentPath).toBe('uploads/verifications/id-1/record.pdf');
  });

  it('toResponse() converts Date fields to ISO strings and null verifiedAt stays null', () => {
    const dto: VerificationDto = {
      id: 'id-1',
      identityId: 'identity-1',
      type: VerificationType.Email,
      status: VerificationStatus.Pending,
      verifiedAt: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      documentPath: null,
    };

    const response = VerificationHttpMapper.toResponse(dto);

    expect(response.verifiedAt).toBeNull();
    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
    expect(response.documentPath).toBeNull();
  });

  it('toResponse() converts a non-null verifiedAt to an ISO string', () => {
    const dto: VerificationDto = {
      id: 'id-1',
      identityId: 'identity-1',
      type: VerificationType.Email,
      status: VerificationStatus.Approved,
      verifiedAt: new Date('2026-01-03T00:00:00.000Z'),
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      documentPath: 'uploads/verifications/id-1/record.pdf',
    };

    const response = VerificationHttpMapper.toResponse(dto);

    expect(response.verifiedAt).toBe('2026-01-03T00:00:00.000Z');
    expect(response.documentPath).toBe('uploads/verifications/id-1/record.pdf');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: VerificationDto = {
      id: 'id-1',
      identityId: 'identity-1',
      type: VerificationType.Document,
      status: VerificationStatus.Pending,
      verifiedAt: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      documentPath: null,
    };

    const response = VerificationHttpMapper.toListResponse({
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
