import { AvailabilityController } from './availability.controller';
import { CreateAvailabilityUseCase } from '../../application/use_cases/create-availability.use-case';
import { UpdateAvailabilityUseCase } from '../../application/use_cases/update-availability.use-case';
import { DeleteAvailabilityUseCase } from '../../application/use_cases/delete-availability.use-case';
import { GetAvailabilityUseCase } from '../../application/use_cases/get-availability.use-case';
import { ListAvailabilityUseCase } from '../../application/use_cases/list-availability.use-case';
import { SearchAvailabilityUseCase } from '../../application/use_cases/search-availability.use-case';
import { CreateAvailabilityCommand } from '../../application/commands/create-availability.command';
import { UpdateAvailabilityCommand } from '../../application/commands/update-availability.command';
import { DeleteAvailabilityCommand } from '../../application/commands/delete-availability.command';
import { GetAvailabilityQuery } from '../../application/queries/get-availability.query';
import { ListAvailabilityQuery } from '../../application/queries/list-availability.query';
import { SearchAvailabilityQuery } from '../../application/queries/search-availability.query';
import { AvailabilityDto } from '../../application/dto/availability.dto';
import { AvailabilityType } from '../../domain/value-objects/availability-type.value-object';
import { AvailabilityStatus } from '../../domain/value-objects/availability-status.value-object';
import { CreateAvailabilityRequestDto } from '../dto/create-availability.request.dto';
import { UpdateAvailabilityRequestDto } from '../dto/update-availability.request.dto';

describe('AvailabilityController', () => {
  let controller: AvailabilityController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

  const availabilityDto: AvailabilityDto = {
    id: 'id-1',
    providerId: 'provider-1',
    status: AvailabilityStatus.Active,
    type: AvailabilityType.FullTime,
    availableFrom: new Date('2026-01-01T08:00:00.000Z'),
    availableTo: new Date('2026-01-01T18:00:00.000Z'),
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(availabilityDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(availabilityDto) };
    deleteUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    getUseCase = { execute: jest.fn().mockResolvedValue(availabilityDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [availabilityDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([availabilityDto]) };

    controller = new AvailabilityController(
      createUseCase as unknown as CreateAvailabilityUseCase,
      updateUseCase as unknown as UpdateAvailabilityUseCase,
      deleteUseCase as unknown as DeleteAvailabilityUseCase,
      getUseCase as unknown as GetAvailabilityUseCase,
      listUseCase as unknown as ListAvailabilityUseCase,
      searchUseCase as unknown as SearchAvailabilityUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateAvailabilityRequestDto = {
      providerId: 'provider-1',
      type: AvailabilityType.FullTime,
      availableFrom: '2026-01-01T08:00:00.000Z',
      availableTo: '2026-01-01T18:00:00.000Z',
    };

    const response = await controller.create(dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateAvailabilityCommand(
        'provider-1',
        AvailabilityType.FullTime,
        new Date('2026-01-01T08:00:00.000Z'),
        new Date('2026-01-01T18:00:00.000Z'),
      ),
    );
    expect(response.id).toBe('id-1');
    expect(response.availableFrom).toBe('2026-01-01T08:00:00.000Z');
  });

  it('update() maps id + request DTO to a command', async () => {
    const dto: UpdateAvailabilityRequestDto = {
      status: AvailabilityStatus.Inactive,
    };

    const response = await controller.update('id-1', dto);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateAvailabilityCommand(
        'id-1',
        undefined,
        undefined,
        AvailabilityStatus.Inactive,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('remove() delegates to DeleteAvailabilityUseCase with the id', async () => {
    await controller.remove('id-1');

    expect(deleteUseCase.execute).toHaveBeenCalledWith(
      new DeleteAvailabilityCommand('id-1'),
    );
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list('2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListAvailabilityQuery(2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('FULL_TIME');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchAvailabilityQuery('FULL_TIME'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].type).toBe(AvailabilityType.FullTime);
  });

  it('findOne() maps the Application DTO returned by GetAvailabilityUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetAvailabilityQuery('id-1'),
    );
    expect(response.type).toBe(AvailabilityType.FullTime);
  });
});
