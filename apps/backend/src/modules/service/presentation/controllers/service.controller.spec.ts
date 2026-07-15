import { ServiceController } from './service.controller';
import { CreateServiceUseCase } from '../../application/use_cases/create-service.use-case';
import { UpdateServiceUseCase } from '../../application/use_cases/update-service.use-case';
import { DeleteServiceUseCase } from '../../application/use_cases/delete-service.use-case';
import { GetServiceUseCase } from '../../application/use_cases/get-service.use-case';
import { ListServiceUseCase } from '../../application/use_cases/list-service.use-case';
import { SearchServiceUseCase } from '../../application/use_cases/search-service.use-case';
import { CreateServiceCommand } from '../../application/commands/create-service.command';
import { UpdateServiceCommand } from '../../application/commands/update-service.command';
import { DeleteServiceCommand } from '../../application/commands/delete-service.command';
import { GetServiceQuery } from '../../application/queries/get-service.query';
import { ListServiceQuery } from '../../application/queries/list-service.query';
import { SearchServiceQuery } from '../../application/queries/search-service.query';
import { ServiceDto } from '../../application/dto/service.dto';
import { ServiceType } from '../../domain/value-objects/service-type.value-object';
import { ServiceStatus } from '../../domain/value-objects/service-status.value-object';
import { CreateServiceRequestDto } from '../dto/create-service.request.dto';
import { UpdateServiceRequestDto } from '../dto/update-service.request.dto';

describe('ServiceController', () => {
  let controller: ServiceController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

  const serviceDto: ServiceDto = {
    id: 'id-1',
    providerId: 'provider-1',
    categoryId: 'category-1',
    name: 'Pipe repair',
    description: 'Fixes leaking or broken pipes.',
    basePrice: 50.0,
    estimatedDuration: 60,
    status: ServiceStatus.Active,
    type: ServiceType.Standard,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(serviceDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(serviceDto) };
    deleteUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    getUseCase = { execute: jest.fn().mockResolvedValue(serviceDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [serviceDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([serviceDto]) };

    controller = new ServiceController(
      createUseCase as unknown as CreateServiceUseCase,
      updateUseCase as unknown as UpdateServiceUseCase,
      deleteUseCase as unknown as DeleteServiceUseCase,
      getUseCase as unknown as GetServiceUseCase,
      listUseCase as unknown as ListServiceUseCase,
      searchUseCase as unknown as SearchServiceUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateServiceRequestDto = {
      providerId: 'provider-1',
      categoryId: 'category-1',
      name: 'Pipe repair',
      description: 'Fixes leaking or broken pipes.',
      basePrice: 50.0,
      estimatedDuration: 60,
      type: ServiceType.Standard,
    };

    const response = await controller.create(dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateServiceCommand(
        'provider-1',
        'category-1',
        'Pipe repair',
        'Fixes leaking or broken pipes.',
        50.0,
        60,
        ServiceType.Standard,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('update() maps id + request DTO to a command', async () => {
    const dto: UpdateServiceRequestDto = { basePrice: 55.0 };

    const response = await controller.update('id-1', dto);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateServiceCommand('id-1', 55.0, undefined, undefined),
    );
    expect(response.id).toBe('id-1');
  });

  it('remove() delegates to DeleteServiceUseCase with the id', async () => {
    await controller.remove('id-1');

    expect(deleteUseCase.execute).toHaveBeenCalledWith(
      new DeleteServiceCommand('id-1'),
    );
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list('2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListServiceQuery(2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('Pipe repair');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchServiceQuery('Pipe repair'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].name).toBe('Pipe repair');
  });

  it('findOne() maps the Application DTO returned by GetServiceUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetServiceQuery('id-1'),
    );
    expect(response.name).toBe('Pipe repair');
  });
});
