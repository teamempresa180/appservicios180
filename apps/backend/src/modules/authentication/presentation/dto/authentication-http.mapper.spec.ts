import { Role } from '../../../../common/auth/role.enum';
import { AuthenticationDto } from '../../application/dto/authentication.dto';
import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';
import { CreateAuthenticationRequestDto } from './create-authentication.request.dto';
import { UpdateAuthenticationRequestDto } from './update-authentication.request.dto';
import { AuthenticationHttpMapper } from './authentication-http.mapper';

describe('AuthenticationHttpMapper', () => {
  it('toCreateCommand() carries identityId and methodType through', () => {
    const dto: CreateAuthenticationRequestDto = {
      identityId: 'identity-1',
      methodType: AuthMethodType.Biometric,
    };

    const command = AuthenticationHttpMapper.toCreateCommand(dto);

    expect(command.identityId).toBe('identity-1');
    expect(command.methodType).toBe(AuthMethodType.Biometric);
  });

  it('toUpdateCommand() carries the id, the caller and optional status through', () => {
    const dto: UpdateAuthenticationRequestDto = {
      status: AuthenticationStatus.Revoked,
    };

    const command = AuthenticationHttpMapper.toUpdateCommand('id-1', dto, {
      id: 'identity-1',
      role: Role.Customer,
    });

    expect(command.id).toBe('id-1');
    expect(command.callerId).toBe('identity-1');
    expect(command.callerRole).toBe(Role.Customer);
    expect(command.status).toBe(AuthenticationStatus.Revoked);
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: AuthenticationDto = {
      id: 'id-1',
      identityId: 'identity-1',
      methodType: AuthMethodType.Password,
      status: AuthenticationStatus.Active,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = AuthenticationHttpMapper.toResponse(dto);

    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });
});
