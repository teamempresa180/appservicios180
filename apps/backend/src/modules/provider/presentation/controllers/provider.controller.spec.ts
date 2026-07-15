import { ProviderController } from './provider.controller';
import { CreateProviderUseCase } from '../../application/use_cases/create-provider.use-case';
import { UpdateProviderUseCase } from '../../application/use_cases/update-provider.use-case';
import { DeleteProviderUseCase } from '../../application/use_cases/delete-provider.use-case';
import { GetProviderUseCase } from '../../application/use_cases/get-provider.use-case';
import { ListProviderUseCase } from '../../application/use_cases/list-provider.use-case';
import { SearchProviderUseCase } from '../../application/use_cases/search-provider.use-case';
import { CreateProviderCommand } from '../../application/commands/create-provider.command';
import { UpdateProviderCommand } from '../../application/commands/update-provider.command';
import { DeleteProviderCommand } from '../../application/commands/delete-provider.command';
import { GetProviderQuery } from '../../application/queries/get-provider.query';
import { ListProviderQuery } from '../../application/queries/list-provider.query';
import { SearchProviderQuery } from '../../application/queries/search-provider.query';
import { ProviderDto } from '../../application/dto/provider.dto';
import { ProviderType } from '../../domain/value-objects/provider-type.value-object';
import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';
import { CreateProviderRequestDto } from '../dto/create-provider.request.dto';
import { UpdateProviderRequestDto } from '../dto/update-provider.request.dto';

describe('ProviderController', () => {
  let controller: ProviderController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

  const providerDto: ProviderDto = {
    id: 'id-1',
    identityId: 'identity-1',
    providerProfileId: 'profile-1',
    status: ProviderStatus.Active,
    type: ProviderType.Independent,
    experience: ProviderExperience.Intermediate,
    biography: 'Plumber with 10 years of experience.',
    yearsOfExperience: 10,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(providerDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(providerDto) };
    deleteUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    getUseCase = { execute: jest.fn().mockResolvedValue(providerDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [providerDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([providerDto]) };

    controller = new ProviderController(
      createUseCase as unknown as CreateProviderUseCase,
      updateUseCase as unknown as UpdateProviderUseCase,
      deleteUseCase as unknown as DeleteProviderUseCase,
      getUseCase as unknown as GetProviderUseCase,
      listUseCase as unknown as ListProviderUseCase,
      searchUseCase as unknown as SearchProviderUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateProviderRequestDto = {
      identityId: 'identity-1',
      providerProfileId: 'profile-1',
      type: ProviderType.Independent,
      experience: ProviderExperience.Intermediate,
      biography: 'Plumber with 10 years of experience.',
      yearsOfExperience: 10,
    };

    const response = await controller.create(dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateProviderCommand(
        'identity-1',
        'profile-1',
        ProviderType.Independent,
        ProviderExperience.Intermediate,
        'Plumber with 10 years of experience.',
        10,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('update() maps id + request DTO to a command', async () => {
    const dto: UpdateProviderRequestDto = { biography: 'Updated bio.' };

    const response = await controller.update('id-1', dto);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateProviderCommand('id-1', 'Updated bio.', undefined, undefined),
    );
    expect(response.id).toBe('id-1');
  });

  it('remove() delegates to DeleteProviderUseCase with the id', async () => {
    await controller.remove('id-1');

    expect(deleteUseCase.execute).toHaveBeenCalledWith(
      new DeleteProviderCommand('id-1'),
    );
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list('2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListProviderQuery(2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('plumber');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchProviderQuery('plumber'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].biography).toBe('Plumber with 10 years of experience.');
  });

  it('findOne() maps the Application DTO returned by GetProviderUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetProviderQuery('id-1'),
    );
    expect(response.yearsOfExperience).toBe(10);
  });
});
