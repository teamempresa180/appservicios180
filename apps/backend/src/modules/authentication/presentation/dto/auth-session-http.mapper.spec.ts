import { AuthTokensDto } from '../../application/dto/auth-tokens.dto';
import { Role } from '../../../../common/auth/role.enum';
import { LoginRequestDto } from './login.request.dto';
import { RefreshRequestDto } from './refresh.request.dto';
import { LogoutRequestDto } from './logout.request.dto';
import { AuthSessionHttpMapper } from './auth-session-http.mapper';

describe('AuthSessionHttpMapper', () => {
  it('toLoginCommand() carries documentNumber/password through', () => {
    const dto: LoginRequestDto = {
      documentNumber: '123456789',
      password: 'Str0ngPassw0rd!',
    };

    const command = AuthSessionHttpMapper.toLoginCommand(dto);

    expect(command.documentNumber).toBe('123456789');
    expect(command.password).toBe('Str0ngPassw0rd!');
  });

  it('toRefreshCommand() carries the refreshToken through', () => {
    const dto: RefreshRequestDto = { refreshToken: 'a-refresh-token' };

    const command = AuthSessionHttpMapper.toRefreshCommand(dto);

    expect(command.refreshToken).toBe('a-refresh-token');
  });

  it('toLogoutCommand() carries the refreshToken through', () => {
    const dto: LogoutRequestDto = { refreshToken: 'a-refresh-token' };

    const command = AuthSessionHttpMapper.toLogoutCommand(dto);

    expect(command.refreshToken).toBe('a-refresh-token');
  });

  it('toTokensResponse() maps every field', () => {
    const dto: AuthTokensDto = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      tokenType: 'Bearer',
      expiresIn: 900,
      role: Role.Provider,
    };

    const response = AuthSessionHttpMapper.toTokensResponse(dto);

    expect(response.accessToken).toBe('access-token');
    expect(response.refreshToken).toBe('refresh-token');
    expect(response.tokenType).toBe('Bearer');
    expect(response.expiresIn).toBe(900);
    expect(response.role).toBe(Role.Provider);
  });

  it('toCurrentUserResponse() maps id/role from the authenticated user', () => {
    const response = AuthSessionHttpMapper.toCurrentUserResponse({
      id: 'identity-1',
      role: Role.Customer,
    });

    expect(response.id).toBe('identity-1');
    expect(response.role).toBe(Role.Customer);
  });
});
