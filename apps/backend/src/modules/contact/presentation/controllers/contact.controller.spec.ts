import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ContactController } from './contact.controller';
import { CreateContactUseCase } from '../../application/use_cases/create-contact.use-case';
import { UpdateContactUseCase } from '../../application/use_cases/update-contact.use-case';
import { DeleteContactUseCase } from '../../application/use_cases/delete-contact.use-case';
import { GetContactUseCase } from '../../application/use_cases/get-contact.use-case';
import { ListContactUseCase } from '../../application/use_cases/list-contact.use-case';
import { SearchContactUseCase } from '../../application/use_cases/search-contact.use-case';
import { CreateContactCommand } from '../../application/commands/create-contact.command';
import { UpdateContactCommand } from '../../application/commands/update-contact.command';
import { DeleteContactCommand } from '../../application/commands/delete-contact.command';
import { GetContactQuery } from '../../application/queries/get-contact.query';
import { ListContactQuery } from '../../application/queries/list-contact.query';
import { SearchContactQuery } from '../../application/queries/search-contact.query';
import { ContactDto } from '../../application/dto/contact.dto';
import { ContactType } from '../../domain/value-objects/contact-type.value-object';
import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';
import { CreateContactRequestDto } from '../dto/create-contact.request.dto';
import { UpdateContactRequestDto } from '../dto/update-contact.request.dto';

describe('ContactController', () => {
  let controller: ContactController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  const contactDto: ContactDto = {
    id: 'id-1',
    identityId: 'identity-1',
    type: ContactType.Email,
    value: 'jane.doe@example.com',
    status: ContactStatus.Active,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(contactDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(contactDto) };
    deleteUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    getUseCase = { execute: jest.fn().mockResolvedValue(contactDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [contactDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([contactDto]) };

    controller = new ContactController(
      createUseCase as unknown as CreateContactUseCase,
      updateUseCase as unknown as UpdateContactUseCase,
      deleteUseCase as unknown as DeleteContactUseCase,
      getUseCase as unknown as GetContactUseCase,
      listUseCase as unknown as ListContactUseCase,
      searchUseCase as unknown as SearchContactUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateContactRequestDto = {
      identityId: 'identity-1',
      type: ContactType.Email,
      value: 'jane.doe@example.com',
    };

    const response = await controller.create(caller, dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateContactCommand(
        caller,
        'identity-1',
        ContactType.Email,
        'jane.doe@example.com',
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('update() maps id + request DTO to a command', async () => {
    const dto: UpdateContactRequestDto = { value: 'new@example.com' };

    const response = await controller.update(caller, 'id-1', dto);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateContactCommand(caller, 'id-1', 'new@example.com', undefined),
    );
    expect(response.id).toBe('id-1');
  });

  it('remove() delegates to DeleteContactUseCase with the id', async () => {
    await controller.remove(caller, 'id-1');

    expect(deleteUseCase.execute).toHaveBeenCalledWith(
      new DeleteContactCommand(caller, 'id-1'),
    );
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list(caller, '2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListContactQuery(caller, 2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search(caller, 'jane');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchContactQuery(caller, 'jane'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].value).toBe('jane.doe@example.com');
  });

  it('findOne() maps the Application DTO returned by GetContactUseCase', async () => {
    const response = await controller.findOne(caller, 'id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetContactQuery(caller, 'id-1'),
    );
    expect(response.value).toBe('jane.doe@example.com');
  });
});
