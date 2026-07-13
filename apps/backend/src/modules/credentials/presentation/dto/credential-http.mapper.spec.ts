import { CredentialDto } from '../../application/dto/credential.dto';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';
import { CreateCredentialRequestDto } from './create-credential.request.dto';
import { UpdateCredentialRequestDto } from './update-credential.request.dto';
import { CredentialHttpMapper } from './credential-http.mapper';

describe('CredentialHttpMapper', () => {
  it('toCreateCommand() carries identityId and type through', () => {
    const dto: CreateCredentialRequestDto = {
      identityId: 'identity-1',
      type: CredentialType.RecoveryCode,
    };

    const command = CredentialHttpMapper.toCreateCommand(dto);

    expect(command.identityId).toBe('identity-1');
    expect(command.type).toBe(CredentialType.RecoveryCode);
  });

  it('toUpdateCommand() carries the id and optional status through', () => {
    const dto: UpdateCredentialRequestDto = {
      status: CredentialStatus.Expired,
    };

    const command = CredentialHttpMapper.toUpdateCommand('id-1', dto);

    expect(command.id).toBe('id-1');
    expect(command.status).toBe(CredentialStatus.Expired);
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: CredentialDto = {
      id: 'id-1',
      identityId: 'identity-1',
      type: CredentialType.Password,
      status: CredentialStatus.Active,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = CredentialHttpMapper.toResponse(dto);

    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });
});
