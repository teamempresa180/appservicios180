import { CategoryController } from './category.controller';
import { CreateCategoryUseCase } from '../../application/use_cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../../application/use_cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../../application/use_cases/delete-category.use-case';
import { GetCategoryUseCase } from '../../application/use_cases/get-category.use-case';
import { ListCategoryUseCase } from '../../application/use_cases/list-category.use-case';
import { SearchCategoryUseCase } from '../../application/use_cases/search-category.use-case';
import { ListCategorySpecializationsUseCase } from '../../application/use_cases/list-category-specializations.use-case';
import { CreateCategoryCommand } from '../../application/commands/create-category.command';
import { UpdateCategoryCommand } from '../../application/commands/update-category.command';
import { DeleteCategoryCommand } from '../../application/commands/delete-category.command';
import { GetCategoryQuery } from '../../application/queries/get-category.query';
import { ListCategoryQuery } from '../../application/queries/list-category.query';
import { SearchCategoryQuery } from '../../application/queries/search-category.query';
import { ListCategorySpecializationsQuery } from '../../application/queries/list-category-specializations.query';
import { CategoryDto } from '../../application/dto/category.dto';
import { CategorySpecializationDto } from '../../application/dto/category-specialization.dto';
import { CategoryType } from '../../domain/value-objects/category-type.value-object';
import { CategoryStatus } from '../../domain/value-objects/category-status.value-object';
import { CreateCategoryRequestDto } from '../dto/create-category.request.dto';
import { UpdateCategoryRequestDto } from '../dto/update-category.request.dto';

describe('CategoryController', () => {
  let controller: CategoryController;
  let createUseCase: { execute: jest.Mock };
  let updateUseCase: { execute: jest.Mock };
  let deleteUseCase: { execute: jest.Mock };
  let getUseCase: { execute: jest.Mock };
  let listUseCase: { execute: jest.Mock };
  let searchUseCase: { execute: jest.Mock };
  let specializationsUseCase: { execute: jest.Mock };

  const categoryDto: CategoryDto = {
    id: 'id-1',
    name: 'Plumbing',
    description: 'Plumbing-related home services.',
    icon: 'wrench-icon',
    color: '#0088CC',
    status: CategoryStatus.Active,
    type: CategoryType.Standard,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  const specializationDto: CategorySpecializationDto = {
    id: 'specialization-1',
    categoryId: 'id-1',
    name: 'Residencial',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(() => {
    createUseCase = { execute: jest.fn().mockResolvedValue(categoryDto) };
    updateUseCase = { execute: jest.fn().mockResolvedValue(categoryDto) };
    deleteUseCase = { execute: jest.fn().mockResolvedValue(undefined) };
    getUseCase = { execute: jest.fn().mockResolvedValue(categoryDto) };
    listUseCase = {
      execute: jest.fn().mockResolvedValue({
        items: [categoryDto],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    };
    searchUseCase = { execute: jest.fn().mockResolvedValue([categoryDto]) };
    specializationsUseCase = {
      execute: jest.fn().mockResolvedValue([specializationDto]),
    };

    controller = new CategoryController(
      createUseCase as unknown as CreateCategoryUseCase,
      updateUseCase as unknown as UpdateCategoryUseCase,
      deleteUseCase as unknown as DeleteCategoryUseCase,
      getUseCase as unknown as GetCategoryUseCase,
      listUseCase as unknown as ListCategoryUseCase,
      searchUseCase as unknown as SearchCategoryUseCase,
      specializationsUseCase as unknown as ListCategorySpecializationsUseCase,
    );
  });

  it('create() maps the request DTO to a command and the Application DTO to a response DTO', async () => {
    const dto: CreateCategoryRequestDto = {
      name: 'Plumbing',
      description: 'Plumbing-related home services.',
      icon: 'wrench-icon',
      color: '#0088CC',
      type: CategoryType.Standard,
    };

    const response = await controller.create(dto);

    expect(createUseCase.execute).toHaveBeenCalledWith(
      new CreateCategoryCommand(
        'Plumbing',
        'Plumbing-related home services.',
        'wrench-icon',
        '#0088CC',
        CategoryType.Standard,
      ),
    );
    expect(response.id).toBe('id-1');
  });

  it('update() maps id + request DTO to a command', async () => {
    const dto: UpdateCategoryRequestDto = { name: 'New Name' };

    const response = await controller.update('id-1', dto);

    expect(updateUseCase.execute).toHaveBeenCalledWith(
      new UpdateCategoryCommand('id-1', 'New Name', undefined, undefined),
    );
    expect(response.id).toBe('id-1');
  });

  it('remove() delegates to DeleteCategoryUseCase with the id', async () => {
    await controller.remove('id-1');

    expect(deleteUseCase.execute).toHaveBeenCalledWith(
      new DeleteCategoryCommand('id-1'),
    );
  });

  it('list() maps page/pageSize query params to a query and wraps the paginated result', async () => {
    const response = await controller.list('2', '10');

    expect(listUseCase.execute).toHaveBeenCalledWith(
      new ListCategoryQuery(2, 10),
    );
    expect(response.items).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  it('search() maps the term query param and the Application DTOs to response DTOs', async () => {
    const response = await controller.search('Plumbing');

    expect(searchUseCase.execute).toHaveBeenCalledWith(
      new SearchCategoryQuery('Plumbing'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].name).toBe('Plumbing');
  });

  it('findOne() maps the Application DTO returned by GetCategoryUseCase', async () => {
    const response = await controller.findOne('id-1');

    expect(getUseCase.execute).toHaveBeenCalledWith(
      new GetCategoryQuery('id-1'),
    );
    expect(response.name).toBe('Plumbing');
  });

  it('specializations() maps the categoryId param and the Application DTOs to response DTOs', async () => {
    const response = await controller.specializations('id-1');

    expect(specializationsUseCase.execute).toHaveBeenCalledWith(
      new ListCategorySpecializationsQuery('id-1'),
    );
    expect(response).toHaveLength(1);
    expect(response[0].name).toBe('Residencial');
  });
});
