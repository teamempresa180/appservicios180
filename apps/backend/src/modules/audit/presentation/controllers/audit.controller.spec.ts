import { AuditController } from './audit.controller';
import { CreateAuditRecordUseCase } from '../../application/use_cases/create-audit-record.use-case';
import { GetAuditUseCase } from '../../application/use_cases/get-audit.use-case';
import { ListAuditUseCase } from '../../application/use_cases/list-audit.use-case';
import { SearchAuditUseCase } from '../../application/use_cases/search-audit.use-case';
import { CreateAuditRecordCommand } from '../../application/commands/create-audit-record.command';
import { GetAuditQuery } from '../../application/queries/get-audit.query';
import { ListAuditQuery } from '../../application/queries/list-audit.query';
import { SearchAuditQuery } from '../../application/queries/search-audit.query';
import { AuditRecordDto } from '../../application/dto/audit-record.dto';
import { AuditActionType } from '../../domain/value-objects/audit-action-type.value-object';
import { CreateAuditRecordRequestDto } from '../dto/create-audit-record.request.dto';

describe('AuditController', () => {
  let controller: AuditController;
  let createUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

  const auditDto: AuditRecordDto = {
    id: 'id-1',
    identityId: 'identity-1',
    actionType: AuditActionType.LoggedIn,
    description: 'User logged in from a new device.',
    occurredAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(auditDto) };
    getUseCase = { execute: jest.fn().mockResolvedValue(auditDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [auditDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([auditDto]) };

    controller = new AuditController(
      createUseCase as unknown as CreateAuditRecordUseCase,
      getUseCase as unknown as GetAuditUseCase,
      listUseCase as unknown as ListAuditUseCase,
      searchUseCase as unknown as SearchAuditUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateAuditRecordRequestDto = {
      identityId: 'identity-1',
      actionType: AuditActionType.LoggedIn,
      description: 'User logged in from a new device.',
    };

    const response = await controller.create(dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateAuditRecordCommand(
        'identity-1',
        AuditActionType.LoggedIn,
        'User logged in from a new device.',
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list('2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(new ListAuditQuery(2, 10));
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('logged in');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchAuditQuery('logged in'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].actionType).toBe(AuditActionType.LoggedIn);
  });

  it('findOne() maps the Application DTO returned by GetAuditUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(new GetAuditQuery('id-1'));
    expect(response.description).toBe('User logged in from a new device.');
  });
});
