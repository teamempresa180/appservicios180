import { CredentialController } from './credential.controller';
import { CreateCredentialUseCase } from '../../application/use_cases/create-credential.use-case';
import { UpdateCredentialUseCase } from '../../application/use_cases/update-credential.use-case';
import { DeleteCredentialUseCase } from '../../application/use_cases/delete-credential.use-case';
import { GetCredentialUseCase } from '../../application/use_cases/get-credential.use-case';
import { CreateCredentialCommand } from '../../application/commands/create-credential.command';
import { UpdateCredentialCommand } from '../../application/commands/update-credential.command';
import { DeleteCredentialCommand } from '../../application/commands/delete-credential.command';
import { GetCredentialQuery } from '../../application/queries/get-credential.query';
import { CredentialDto } from '../../application/dto/credential.dto';
import { CredentialType } from '../../domain/value-objects/credential-type.value-object';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';
import { CreateCredentialRequestDto } from '../dto/create-credential.request.dto';
import { UpdateCredentialRequestDto } from '../dto/update-credential.request.dto';

describe('CredentialController', () => {
  let controller: CredentialController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };

  const credentialDto: CredentialDto = {
    id: 'id-1',
    identityId: 'identity-1',
    type: CredentialType.Password,
    status: CredentialStatus.Active,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(credentialDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(credentialDto) };
    deleteUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    getUseCase = { execute: jest.fn().mockResolvedValue(credentialDto) };

    controller = new CredentialController(
      createUseCase as unknown as CreateCredentialUseCase,
      updateUseCase as unknown as UpdateCredentialUseCase,
      deleteUseCase as unknown as DeleteCredentialUseCase,
      getUseCase as unknown as GetCredentialUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateCredentialRequestDto = {
      identityId: 'identity-1',
      type: CredentialType.Password,
      password: 'Str0ngPassw0rd!',
    };

    const response = await controller.create(dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateCredentialCommand(
        'identity-1',
        CredentialType.Password,
        'Str0ngPassw0rd!',
      ),
    );
    expect(response.id).toBe('id-1');
    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('update() maps id + request DTO to a command', async () => {
    const dto: UpdateCredentialRequestDto = {
      status: CredentialStatus.Revoked,
    };

    const response = await controller.update('id-1', dto);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateCredentialCommand('id-1', CredentialStatus.Revoked),
    );
    expect(response.id).toBe('id-1');
  });

  it('remove() delegates to DeleteCredentialUseCase with the id', async () => {
    await controller.remove('id-1');

    expect(deleteUseCase.execute).toHaveBeenCalledWith(
      new DeleteCredentialCommand('id-1'),
    );
  });

  it('findOne() maps the Application DTO returned by GetCredentialUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetCredentialQuery('id-1'),
    );
    expect(response.type).toBe(CredentialType.Password);
  });
});
