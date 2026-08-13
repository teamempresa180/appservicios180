import { Role } from '../../../../common/auth/role.enum';
import { IdentityDto } from '../../application/dto/identity.dto';
import { DocumentType } from '../../domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../../domain/value-objects/identity-status.value-object';
import { CreateIdentityRequestDto } from './create-identity.request.dto';
import { UpdateIdentityRequestDto } from './update-identity.request.dto';
import { IdentityHttpMapper } from './identity-http.mapper';

describe('IdentityHttpMapper', () => {
  it('toCreateCommand() parses birthDate from an ISO string to a Date', () => {
    const dto: CreateIdentityRequestDto = {
      fullName: 'Jane Doe',
      documentType: DocumentType.NationalId,
      documentNumber: '123456789',
      birthDate: '1990-01-01',
    };

    const command = IdentityHttpMapper.toCreateCommand(dto);

    expect(command.fullName).toBe('Jane Doe');
    expect(command.birthDate).toEqual(new Date('1990-01-01'));
  });

  it('toCreateCommand() produces an Invalid Date for malformed input, left for IdentityValidator to reject', () => {
    const dto: CreateIdentityRequestDto = {
      fullName: 'Jane Doe',
      documentType: DocumentType.NationalId,
      documentNumber: '123456789',
      birthDate: 'not-a-date',
    };

    const command = IdentityHttpMapper.toCreateCommand(dto);

    expect(Number.isNaN(command.birthDate.getTime())).toBe(true);
  });

  it('toUpdateCommand() carries the id, the caller and optional fields through', () => {
    const dto: UpdateIdentityRequestDto = { status: IdentityStatus.Suspended };

    const command = IdentityHttpMapper.toUpdateCommand('id-1', dto, {
      id: 'caller-1',
      role: Role.Customer,
    });

    expect(command.id).toBe('id-1');
    expect(command.callerId).toBe('caller-1');
    expect(command.callerRole).toBe(Role.Customer);
    expect(command.fullName).toBeUndefined();
    expect(command.status).toBe(IdentityStatus.Suspended);
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: IdentityDto = {
      id: 'id-1',
      fullName: 'Jane Doe',
      documentType: DocumentType.NationalId,
      documentNumber: '123456789',
      birthDate: new Date('1990-01-01T00:00:00.000Z'),
      status: IdentityStatus.Active,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = IdentityHttpMapper.toResponse(dto);

    expect(response.birthDate).toBe('1990-01-01T00:00:00.000Z');
    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });
});
