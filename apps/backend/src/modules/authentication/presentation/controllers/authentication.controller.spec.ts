import { AuthenticationController } from './authentication.controller';
import { CreateAuthenticationUseCase } from '../../application/use_cases/create-authentication.use-case';
import { UpdateAuthenticationUseCase } from '../../application/use_cases/update-authentication.use-case';
import { DeleteAuthenticationUseCase } from '../../application/use_cases/delete-authentication.use-case';
import { GetAuthenticationUseCase } from '../../application/use_cases/get-authentication.use-case';
import { CreateAuthenticationCommand } from '../../application/commands/create-authentication.command';
import { UpdateAuthenticationCommand } from '../../application/commands/update-authentication.command';
import { DeleteAuthenticationCommand } from '../../application/commands/delete-authentication.command';
import { GetAuthenticationQuery } from '../../application/queries/get-authentication.query';
import { AuthenticationDto } from '../../application/dto/authentication.dto';
import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';
import { CreateAuthenticationRequestDto } from '../dto/create-authentication.request.dto';
import { UpdateAuthenticationRequestDto } from '../dto/update-authentication.request.dto';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };

  const authenticationDto: AuthenticationDto = {
    id: 'id-1',
    identityId: 'identity-1',
    methodType: AuthMethodType.Password,
    status: AuthenticationStatus.Active,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(authenticationDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(authenticationDto) };
    deleteUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    getUseCase = { execute: jest.fn().mockResolvedValue(authenticationDto) };

    controller = new AuthenticationController(
      createUseCase as unknown as CreateAuthenticationUseCase,
      updateUseCase as unknown as UpdateAuthenticationUseCase,
      deleteUseCase as unknown as DeleteAuthenticationUseCase,
      getUseCase as unknown as GetAuthenticationUseCase,
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
});
