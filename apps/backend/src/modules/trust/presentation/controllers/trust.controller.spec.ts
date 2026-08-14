import { Role } from '../../../../common/auth/role.enum';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { TrustController } from './trust.controller';
import { CreateTrustProfileUseCase } from '../../application/use_cases/create-trust-profile.use-case';
import { UpdateTrustProfileUseCase } from '../../application/use_cases/update-trust-profile.use-case';
import { GetTrustUseCase } from '../../application/use_cases/get-trust.use-case';
import { ListTrustUseCase } from '../../application/use_cases/list-trust.use-case';
import { SearchTrustUseCase } from '../../application/use_cases/search-trust.use-case';
import { CreateTrustProfileCommand } from '../../application/commands/create-trust-profile.command';
import { UpdateTrustProfileCommand } from '../../application/commands/update-trust-profile.command';
import { GetTrustQuery } from '../../application/queries/get-trust.query';
import { ListTrustQuery } from '../../application/queries/list-trust.query';
import { SearchTrustQuery } from '../../application/queries/search-trust.query';
import { TrustDto } from '../../application/dto/trust.dto';
import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';
import { TrustStatus } from '../../domain/value-objects/trust-status.value-object';
import { CreateTrustProfileRequestDto } from '../dto/create-trust-profile.request.dto';
import { UpdateTrustProfileRequestDto } from '../dto/update-trust-profile.request.dto';

describe('TrustController', () => {
  let controller: TrustController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

  const trustDto: TrustDto = {
    id: 'id-1',
    identityId: 'identity-1',
    score: 75,
    level: TrustLevel.High,
    status: TrustStatus.Active,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(trustDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(trustDto) };
    getUseCase = { execute: jest.fn().mockResolvedValue(trustDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [trustDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([trustDto]) };

    controller = new TrustController(
      createUseCase as unknown as CreateTrustProfileUseCase,
      updateUseCase as unknown as UpdateTrustProfileUseCase,
      getUseCase as unknown as GetTrustUseCase,
      listUseCase as unknown as ListTrustUseCase,
      searchUseCase as unknown as SearchTrustUseCase,
    );
  });

  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateTrustProfileRequestDto = {
      identityId: 'identity-1',
      score: 75,
      level: TrustLevel.High,
    };

    const response = await controller.create(dto, caller);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateTrustProfileCommand('identity-1', 75, TrustLevel.High, caller),
    );
    expect(response.id).toBe('id-1');
  });

  it('update() maps id + request DTO to a command', async () => {
    const dto: UpdateTrustProfileRequestDto = { score: 90 };

    const response = await controller.update('id-1', dto);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateTrustProfileCommand('id-1', 90, undefined, undefined),
    );
    expect(response.id).toBe('id-1');
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list('2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(new ListTrustQuery(2, 10));
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('HIGH');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchTrustQuery('HIGH'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].level).toBe(TrustLevel.High);
  });

  it('findOne() maps the Application DTO returned by GetTrustUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(new GetTrustQuery('id-1'));
    expect(response.score).toBe(75);
  });
});

