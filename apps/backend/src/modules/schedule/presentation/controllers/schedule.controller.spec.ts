import { ScheduleController } from './schedule.controller';
import { CreateScheduleUseCase } from '../../application/use_cases/create-schedule.use-case';
import { UpdateScheduleUseCase } from '../../application/use_cases/update-schedule.use-case';
import { DeleteScheduleUseCase } from '../../application/use_cases/delete-schedule.use-case';
import { GetScheduleUseCase } from '../../application/use_cases/get-schedule.use-case';
import { ListScheduleUseCase } from '../../application/use_cases/list-schedule.use-case';
import { SearchScheduleUseCase } from '../../application/use_cases/search-schedule.use-case';
import { CreateScheduleCommand } from '../../application/commands/create-schedule.command';
import { UpdateScheduleCommand } from '../../application/commands/update-schedule.command';
import { DeleteScheduleCommand } from '../../application/commands/delete-schedule.command';
import { GetScheduleQuery } from '../../application/queries/get-schedule.query';
import { ListScheduleQuery } from '../../application/queries/list-schedule.query';
import { SearchScheduleQuery } from '../../application/queries/search-schedule.query';
import { ScheduleDto } from '../../application/dto/schedule.dto';
import { ScheduleType } from '../../domain/value-objects/schedule-type.value-object';
import { ScheduleStatus } from '../../domain/value-objects/schedule-status.value-object';
import { CreateScheduleRequestDto } from '../dto/create-schedule.request.dto';
import { UpdateScheduleRequestDto } from '../dto/update-schedule.request.dto';

describe('ScheduleController', () => {
  let controller: ScheduleController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

  const scheduleDto: ScheduleDto = {
    id: 'id-1',
    providerId: 'provider-1',
    startDateTime: new Date('2026-01-01T08:00:00.000Z'),
    endDateTime: new Date('2026-01-01T09:00:00.000Z'),
    status: ScheduleStatus.Open,
    type: ScheduleType.Regular,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(scheduleDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(scheduleDto) };
    deleteUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    getUseCase = { execute: jest.fn().mockResolvedValue(scheduleDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [scheduleDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([scheduleDto]) };

    controller = new ScheduleController(
      createUseCase as unknown as CreateScheduleUseCase,
      updateUseCase as unknown as UpdateScheduleUseCase,
      deleteUseCase as unknown as DeleteScheduleUseCase,
      getUseCase as unknown as GetScheduleUseCase,
      listUseCase as unknown as ListScheduleUseCase,
      searchUseCase as unknown as SearchScheduleUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateScheduleRequestDto = {
      providerId: 'provider-1',
      startDateTime: '2026-01-01T08:00:00.000Z',
      endDateTime: '2026-01-01T09:00:00.000Z',
      type: ScheduleType.Regular,
    };

    const response = await controller.create(dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateScheduleCommand(
        'provider-1',
        new Date('2026-01-01T08:00:00.000Z'),
        new Date('2026-01-01T09:00:00.000Z'),
        ScheduleType.Regular,
      ),
    );
    expect(response.id).toBe('id-1');
    expect(response.startDateTime).toBe('2026-01-01T08:00:00.000Z');
  });

  it('update() maps id + request DTO to a command', async () => {
    const dto: UpdateScheduleRequestDto = { status: ScheduleStatus.Cancelled };

    const response = await controller.update('id-1', dto);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateScheduleCommand(
        'id-1',
        undefined,
        undefined,
        ScheduleStatus.Cancelled,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('remove() delegates to DeleteScheduleUseCase with the id', async () => {
    await controller.remove('id-1');

    expect(deleteUseCase.execute).toHaveBeenCalledWith(
      new DeleteScheduleCommand('id-1'),
    );
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list('2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListScheduleQuery(2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('REGULAR');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchScheduleQuery('REGULAR'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].type).toBe(ScheduleType.Regular);
  });

  it('findOne() maps the Application DTO returned by GetScheduleUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetScheduleQuery('id-1'),
    );
    expect(response.type).toBe(ScheduleType.Regular);
  });
});
