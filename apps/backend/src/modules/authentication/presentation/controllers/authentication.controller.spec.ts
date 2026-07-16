import { AuthenticationController } from './authentication.controller';
import { CreateAuthenticationUseCase } from '../../application/use_cases/create-authentication.use-case';
import { UpdateAuthenticationUseCase } from '../../application/use_cases/update-authentication.use-case';
import { DeleteAuthenticationUseCase } from '../../application/use_cases/delete-authentication.use-case';
import { GetAuthenticationUseCase } from '../../application/use_cases/get-authentication.use-case';
import { LoginUseCase } from '../../application/use_cases/login.use-case';
import { RefreshUseCase } from '../../application/use_cases/refresh.use-case';
import { LogoutUseCase } from '../../application/use_cases/logout.use-case';
import { CreateAuthenticationCommand } from '../../application/commands/create-authentication.command';
import { UpdateAuthenticationCommand } from '../../application/commands/update-authentication.command';
import { DeleteAuthenticationCommand } from '../../application/commands/delete-authentication.command';
import { LoginCommand } from '../../application/commands/login.command';
import { RefreshCommand } from '../../application/commands/refresh.command';
import { LogoutCommand } from '../../application/commands/logout.command';
import { GetAuthenticationQuery } from '../../application/queries/get-authentication.query';
import { AuthenticationDto } from '../../application/dto/authentication.dto';
import { AuthTokensDto } from '../../application/dto/auth-tokens.dto';
import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';
import { CreateAuthenticationRequestDto } from '../dto/create-authentication.request.dto';
import { UpdateAuthenticationRequestDto } from '../dto/update-authentication.request.dto';
import { LoginRequestDto } from '../dto/login.request.dto';
import { RefreshRequestDto } from '../dto/refresh.request.dto';
import { LogoutRequestDto } from '../dto/logout.request.dto';
import { Role } from '../../../../common/auth/role.enum';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let loginUseCase: { execute: jest.Mock };
  let refreshUseCase: { execute: jest.Mock };
  let logoutUseCase: { execute: jest.Mock };

  const authenticationDto: AuthenticationDto = {
    id: 'id-1',
    identityId: 'identity-1',
    methodType: AuthMethodType.Password,
    status: AuthenticationStatus.Active,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  const authTokensDto: AuthTokensDto = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    tokenType: 'Bearer',
    expiresIn: 900,
    role: Role.Customer,
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(authenticationDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(authenticationDto) };
    deleteUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    getUseCase = { execute: jest.fn().mockResolvedValue(authenticationDto) };
    loginUseCase = { execute: jest.fn().mockResolvedValue(authTokensDto) };
    refreshUseCase = { execute: jest.fn().mockResolvedValue(authTokensDto) };
    logoutUseCase = { execute: jest.fn().mockResolvedValue(undefined) };

    controller = new AuthenticationController(
      createUseCase as unknown as CreateAuthenticationUseCase,
      updateUseCase as unknown as UpdateAuthenticationUseCase,
      deleteUseCase as unknown as DeleteAuthenticationUseCase,
      getUseCase as unknown as GetAuthenticationUseCase,
      loginUseCase as unknown as LoginUseCase,
      refreshUseCase as unknown as RefreshUseCase,
      logoutUseCase as unknown as LogoutUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateAuthenticationRequestDto = {
      identityId: 'identity-1',
      methodType: AuthMethodType.Password,
    };

    const response = await controller.create(dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateAuthenticationCommand('identity-1', AuthMethodType.Password),
    );
    expect(response.id).toBe('id-1');
    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('update() maps id + request DTO to a command', async () => {
    const dto: UpdateAuthenticationRequestDto = {
      status: AuthenticationStatus.Locked,
    };

    const response = await controller.update('id-1', dto);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateAuthenticationCommand('id-1', AuthenticationStatus.Locked),
    );
    expect(response.id).toBe('id-1');
  });

  it('remove() delegates to DeleteAuthenticationUseCase with the id', async () => {
    await controller.remove('id-1');

    expect(deleteUseCase.execute).toHaveBeenCalledWith(
      new DeleteAuthenticationCommand('id-1'),
    );
  });

  it('findOne() maps the Application DTO returned by GetAuthenticationUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetAuthenticationQuery('id-1'),
    );
    expect(response.methodType).toBe(AuthMethodType.Password);
  });

  it('login() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: LoginRequestDto = {
      documentNumber: '123456789',
      password: 'Str0ngPassw0rd!',
    };

    const response = await controller.login(dto);

    expect(loginUseCase.execute).toHaveBeenCalledWith(
      new LoginCommand('123456789', 'Str0ngPassw0rd!'),
    );
    expect(response.accessToken).toBe('access-token');
    expect(response.role).toBe(Role.Customer);
  });

  it('refresh() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: RefreshRequestDto = { refreshToken: 'refresh-token' };

    const response = await controller.refresh(dto);

    expect(refreshUseCase.execute).toHaveBeenCalledWith(
      new RefreshCommand('refresh-token'),
    );
    expect(response.accessToken).toBe('access-token');
  });

  it('logout() delegates to LogoutUseCase with the mapped command', async () => {
    const dto: LogoutRequestDto = { refreshToken: 'refresh-token' };

    await controller.logout(dto);

    expect(logoutUseCase.execute).toHaveBeenCalledWith(
      new LogoutCommand('refresh-token'),
    );
  });

  it('me() maps the authenticated user to a response DTO', () => {
    const response = controller.me({ id: 'identity-1', role: Role.Provider });

    expect(response.id).toBe('identity-1');
    expect(response.role).toBe(Role.Provider);
  });
});
