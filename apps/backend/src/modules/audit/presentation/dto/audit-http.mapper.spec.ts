import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { AuditRecordDto } from '../../application/dto/audit-record.dto';
import { AuditActionType } from '../../domain/value-objects/audit-action-type.value-object';
import { CreateAuditRecordRequestDto } from './create-audit-record.request.dto';
import { AuditHttpMapper } from './audit-http.mapper';

describe('AuditHttpMapper', () => {
  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  it('toCreateCommand() carries identityId/actionType/description through', () => {
    const dto: CreateAuditRecordRequestDto = {
      identityId: 'identity-1',
      actionType: AuditActionType.Updated,
      description: 'Profile updated.',
    };

    const command = AuditHttpMapper.toCreateCommand(caller, dto);

    expect(command.identityId).toBe('identity-1');
    expect(command.actionType).toBe(AuditActionType.Updated);
    expect(command.description).toBe('Profile updated.');
  });

  it('toResponse() converts occurredAt to an ISO string', () => {
    const dto: AuditRecordDto = {
      id: 'id-1',
      identityId: 'identity-1',
      actionType: AuditActionType.LoggedIn,
      description: 'User logged in from a new device.',
      occurredAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const response = AuditHttpMapper.toResponse(dto);

    expect(response.occurredAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: AuditRecordDto = {
      id: 'id-1',
      identityId: 'identity-1',
      actionType: AuditActionType.LoggedIn,
      description: 'User logged in from a new device.',
      occurredAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const response = AuditHttpMapper.toListResponse({
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
