import { AddressController } from './address.controller';
import { CreateAddressUseCase } from '../../application/use_cases/create-address.use-case';
import { UpdateAddressUseCase } from '../../application/use_cases/update-address.use-case';
import { DeleteAddressUseCase } from '../../application/use_cases/delete-address.use-case';
import { GetAddressUseCase } from '../../application/use_cases/get-address.use-case';
import { ListAddressUseCase } from '../../application/use_cases/list-address.use-case';
import { SearchAddressUseCase } from '../../application/use_cases/search-address.use-case';
import { CreateAddressCommand } from '../../application/commands/create-address.command';
import { UpdateAddressCommand } from '../../application/commands/update-address.command';
import { DeleteAddressCommand } from '../../application/commands/delete-address.command';
import { GetAddressQuery } from '../../application/queries/get-address.query';
import { ListAddressQuery } from '../../application/queries/list-address.query';
import { SearchAddressQuery } from '../../application/queries/search-address.query';
import { AddressDto } from '../../application/dto/address.dto';
import { AddressType } from '../../domain/value-objects/address-type.value-object';
import { AddressStatus } from '../../domain/value-objects/address-status.value-object';
import { CreateAddressRequestDto } from '../dto/create-address.request.dto';
import { UpdateAddressRequestDto } from '../dto/update-address.request.dto';

describe('AddressController', () => {
  let controller: AddressController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };

  const addressDto: AddressDto = {
    id: 'id-1',
    identityId: 'identity-1',
    alias: 'Home',
    fullAddress: 'Calle 123 #45-67',
    city: 'Bogotá',
    state: 'Cundinamarca',
    country: 'Colombia',
    postalCode: '110111',
    type: AddressType.Home,
    status: AddressStatus.Active,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(addressDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(addressDto) };
    deleteUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    getUseCase = { execute: jest.fn().mockResolvedValue(addressDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [addressDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([addressDto]) };

    controller = new AddressController(
      createUseCase as unknown as CreateAddressUseCase,
      updateUseCase as unknown as UpdateAddressUseCase,
      deleteUseCase as unknown as DeleteAddressUseCase,
      getUseCase as unknown as GetAddressUseCase,
      listUseCase as unknown as ListAddressUseCase,
      searchUseCase as unknown as SearchAddressUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateAddressRequestDto = {
      identityId: 'identity-1',
      alias: 'Home',
      fullAddress: 'Calle 123 #45-67',
      city: 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      postalCode: '110111',
      type: AddressType.Home,
    };

    const response = await controller.create(dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateAddressCommand(
        'identity-1',
        'Home',
        'Calle 123 #45-67',
        'Bogotá',
        'Cundinamarca',
        'Colombia',
        '110111',
        AddressType.Home,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('update() maps id + request DTO to a command', async () => {
    const dto: UpdateAddressRequestDto = { alias: 'New Alias' };

    const response = await controller.update('id-1', dto);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateAddressCommand('id-1', 'New Alias', undefined, undefined),
    );
    expect(response.id).toBe('id-1');
  });

  it('remove() delegates to DeleteAddressUseCase with the id', async () => {
    await controller.remove('id-1');

    expect(deleteUseCase.execute).toHaveBeenCalledWith(
      new DeleteAddressCommand('id-1'),
    );
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list('2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListAddressQuery(2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('Bogotá');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchAddressQuery('Bogotá'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].city).toBe('Bogotá');
  });

  it('findOne() maps the Application DTO returned by GetAddressUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetAddressQuery('id-1'),
    );
    expect(response.alias).toBe('Home');
  });
});
