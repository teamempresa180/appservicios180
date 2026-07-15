import { VerificationController } from './verification.controller';
import { CreateVerificationUseCase } from '../../application/use_cases/create-verification.use-case';
import { UpdateVerificationUseCase } from '../../application/use_cases/update-verification.use-case';
import { GetVerificationUseCase } from '../../application/use_cases/get-verification.use-case';
import { ListVerificationUseCase } from '../../application/use_cases/list-verification.use-case';
import { SearchVerificationUseCase } from '../../application/use_cases/search-verification.use-case';
import { CreateVerificationCommand } from '../../application/commands/create-verification.command';
import { UpdateVerificationCommand } from '../../application/commands/update-verification.command';
import { GetVerificationQuery } from '../../application/queries/get-verification.query';
import { ListVerificationQuery } from '../../application/queries/list-verification.query';
import { SearchVerificationQuery } from '../../application/queries/search-verification.query';
import { VerificationDto } from '../../application/dto/verification.dto';
import { VerificationType } from '../../domain/value-objects/verification-type.value-object';
import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';
import { CreateVerificationRequestDto } from '../dto/create-verification.request.dto';
import { UpdateVerificationRequestDto } from '../dto/update-verification.request.dto';

describe('VerificationController', () => {
  let controller: VerificationController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

  const verificationDto: VerificationDto = {
    id: 'id-1',
    identityId: 'identity-1',
    type: VerificationType.Document,
    status: VerificationStatus.Pending,
    verifiedAt: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(verificationDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(verificationDto) };
    getUseCase = { execute: jest.fn().mockResolvedValue(verificationDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [verificationDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([verificationDto]) };

    controller = new VerificationController(
      createUseCase as unknown as CreateVerificationUseCase,
      updateUseCase as unknown as UpdateVerificationUseCase,
      getUseCase as unknown as GetVerificationUseCase,
      listUseCase as unknown as ListVerificationUseCase,
      searchUseCase as unknown as SearchVerificationUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateVerificationRequestDto = {
      identityId: 'identity-1',
      type: VerificationType.Document,
    };

    const response = await controller.create(dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateVerificationCommand('identity-1', VerificationType.Document),
    );
    expect(response.id).toBe('id-1');
    expect(response.verifiedAt).toBeNull();
  });

  it('update() maps id + request DTO to a command', async () => {
    const dto: UpdateVerificationRequestDto = {
      status: VerificationStatus.Approved,
    };

    const response = await controller.update('id-1', dto);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateVerificationCommand('id-1', VerificationStatus.Approved),
    );
    expect(response.id).toBe('id-1');
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list('2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListVerificationQuery(2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('DOCUMENT');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchVerificationQuery('DOCUMENT'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].type).toBe(VerificationType.Document);
  });

  it('findOne() maps the Application DTO returned by GetVerificationUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetVerificationQuery('id-1'),
    );
    expect(response.type).toBe(VerificationType.Document);
  });
});
