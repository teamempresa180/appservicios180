import { Role } from '../../../../common/auth/role.enum';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { IdentityController } from './identity.controller';
import { CreateIdentityUseCase } from '../../application/use_cases/create-identity.use-case';
import { UpdateIdentityUseCase } from '../../application/use_cases/update-identity.use-case';
import { DeleteIdentityUseCase } from '../../application/use_cases/delete-identity.use-case';
import { GetIdentityUseCase } from '../../application/use_cases/get-identity.use-case';
import { CreateIdentityCommand } from '../../application/commands/create-identity.command';
import { UpdateIdentityCommand } from '../../application/commands/update-identity.command';
import { DeleteIdentityCommand } from '../../application/commands/delete-identity.command';
import { GetIdentityQuery } from '../../application/queries/get-identity.query';
import { IdentityDto } from '../../application/dto/identity.dto';
import { DocumentType } from '../../domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../../domain/value-objects/identity-status.value-object';
import { CreateIdentityRequestDto } from '../dto/create-identity.request.dto';
import { UpdateIdentityRequestDto } from '../dto/update-identity.request.dto';

describe('IdentityController', () => {
  let controller: IdentityController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };

  const caller: AuthenticatedUser = { id: 'id-1', role: Role.Customer };

  const identityDto: IdentityDto = {
    id: 'id-1',
    fullName: 'Jane Doe',
    documentType: DocumentType.NationalId,
    documentNumber: '123456789',
    birthDate: new Date('1990-01-01T00:00:00.000Z'),
    status: IdentityStatus.Active,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(identityDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(identityDto) };
    deleteUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    getUseCase = { execute: jest.fn().mockResolvedValue(identityDto) };

    controller = new IdentityController(
      createUseCase as unknown as CreateIdentityUseCase,
      updateUseCase as unknown as UpdateIdentityUseCase,
      deleteUseCase as unknown as DeleteIdentityUseCase,
      getUseCase as unknown as GetIdentityUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateIdentityRequestDto = {
      fullName: 'Jane Doe',
      documentType: DocumentType.NationalId,
      documentNumber: '123456789',
      birthDate: '1990-01-01',
    };

    const response = await controller.create(dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateIdentityCommand(
        'Jane Doe',
        DocumentType.NationalId,
        '123456789',
        new Date('1990-01-01'),
      ),
    );
    expect(response.id).toBe('id-1');
    expect(response.birthDate).toBe('1990-01-01T00:00:00.000Z');
    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('update() maps id + request DTO + caller to a command', async () => {
    const dto: UpdateIdentityRequestDto = { fullName: 'New Name' };

    const response = await controller.update('id-1', dto, caller);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateIdentityCommand(
        'id-1',
        'id-1',
        Role.Customer,
        'New Name',
        undefined,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('remove() delegates to DeleteIdentityUseCase with the id and the caller', async () => {
    await controller.remove('id-1', caller);

    expect(deleteUseCase.execute).toHaveBeenCalledWith(
      new DeleteIdentityCommand('id-1', 'id-1', Role.Customer),
    );
  });

  it('findOne() passes the caller to GetIdentityUseCase and maps its Application DTO', async () => {
    const response = await controller.findOne('id-1', caller);

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetIdentityQuery('id-1', 'id-1', Role.Customer),
    );
    expect(response.fullName).toBe('Jane Doe');
  });
});
