import { QuoteController } from './quote.controller';
import { CreateQuoteUseCase } from '../../application/use_cases/create-quote.use-case';
import { UpdateQuoteUseCase } from '../../application/use_cases/update-quote.use-case';
import { AcceptQuoteUseCase } from '../../application/use_cases/accept-quote.use-case';
import { RejectQuoteUseCase } from '../../application/use_cases/reject-quote.use-case';
import { GetQuoteUseCase } from '../../application/use_cases/get-quote.use-case';
import { ListQuoteUseCase } from '../../application/use_cases/list-quote.use-case';
import { SearchQuoteUseCase } from '../../application/use_cases/search-quote.use-case';
import { CreateQuoteCommand } from '../../application/commands/create-quote.command';
import { UpdateQuoteCommand } from '../../application/commands/update-quote.command';
import { AcceptQuoteCommand } from '../../application/commands/accept-quote.command';
import { RejectQuoteCommand } from '../../application/commands/reject-quote.command';
import { GetQuoteQuery } from '../../application/queries/get-quote.query';
import { ListQuoteQuery } from '../../application/queries/list-quote.query';
import { SearchQuoteQuery } from '../../application/queries/search-quote.query';
import { Caller } from '../../../core/application/caller';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { QuoteDto } from '../../application/dto/quote.dto';
import { QuoteStatus } from '../../domain/value-objects/quote-status.value-object';
import { QuoteType } from '../../domain/value-objects/quote-type.value-object';
import { CreateQuoteRequestDto } from '../dto/create-quote.request.dto';
import { UpdateQuoteRequestDto } from '../dto/update-quote.request.dto';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';

describe('QuoteController', () => {
  const user: AuthenticatedUser = { id: 'identity-1', role: Role.Provider };
  const caller: Caller = { identityId: 'identity-1', isAdmin: false };

  let controller: QuoteController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let acceptUseCase: { execute: jest.Mock };
  let rejectUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

  const quoteDto: QuoteDto = {
    id: 'id-1',
    orderId: 'order-1',
    providerId: 'provider-1',
    proposedPrice: 75.0,
    estimatedDuration: 90,
    notes: 'Includes parts and labor.',
    status: QuoteStatus.Pending,
    type: QuoteType.Standard,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(quoteDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(quoteDto) };
    acceptUseCase = { execute: jest.fn().mockResolvedValue(quoteDto) };
    rejectUseCase = { execute: jest.fn().mockResolvedValue(quoteDto) };
    getUseCase = { execute: jest.fn().mockResolvedValue(quoteDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [quoteDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([quoteDto]) };

    controller = new QuoteController(
      createUseCase as unknown as CreateQuoteUseCase,
      updateUseCase as unknown as UpdateQuoteUseCase,
      acceptUseCase as unknown as AcceptQuoteUseCase,
      rejectUseCase as unknown as RejectQuoteUseCase,
      getUseCase as unknown as GetQuoteUseCase,
      listUseCase as unknown as ListQuoteUseCase,
      searchUseCase as unknown as SearchQuoteUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateQuoteRequestDto = {
      orderId: 'order-1',
      providerId: 'provider-1',
      proposedPrice: 75.0,
      estimatedDuration: 90,
      notes: 'Includes parts and labor.',
      type: QuoteType.Standard,
    };

    const response = await controller.create(dto, user);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateQuoteCommand(
        'order-1',
        'provider-1',
        75.0,
        90,
        'Includes parts and labor.',
        QuoteType.Standard,
        caller,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('update() maps id + request DTO + caller to a command', async () => {
    const dto: UpdateQuoteRequestDto = { proposedPrice: 80.0 };

    const response = await controller.update('id-1', dto, user);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateQuoteCommand('id-1', caller, 80.0, undefined, undefined),
    );
    expect(response.id).toBe('id-1');
  });

  it('accept() delegates to AcceptQuoteUseCase with the id and the caller', async () => {
    const response = await controller.accept('id-1', user);

    expect(acceptUseCase.execute).toHaveBeenCalledWith(
      new AcceptQuoteCommand('id-1', caller),
    );
    expect(response.id).toBe('id-1');
  });

  it('reject() delegates to RejectQuoteUseCase with the id and the caller', async () => {
    const response = await controller.reject('id-1', user);

    expect(rejectUseCase.execute).toHaveBeenCalledWith(
      new RejectQuoteCommand('id-1', caller),
    );
    expect(response.id).toBe('id-1');
  });

  it('list() maps page/pageSize query params plus the caller to a query', async () => {
    const response = await controller.list(user, '2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListQuoteQuery(caller, 2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the caller', async () => {
    const response = await controller.search('labor', user);

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchQuoteQuery('labor', caller),
    );
    expect(response).toHaveLength(1);
    expect(response[0].notes).toBe('Includes parts and labor.');
  });

  it('findOne() maps the Application DTO returned by GetQuoteUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(new GetQuoteQuery('id-1'));
    expect(response.notes).toBe('Includes parts and labor.');
  });

  it('findOne() throws NotFoundException when GetQuoteUseCase returns null', async () => {
    getUseCase.execute.mockResolvedValue(null);

    await expect(controller.findOne('unknown-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
