import { CategoryDto } from '../../application/dto/category.dto';
import { CategoryType } from '../../domain/value-objects/category-type.value-object';
import { CategoryStatus } from '../../domain/value-objects/category-status.value-object';
import { CreateCategoryRequestDto } from './create-category.request.dto';
import { UpdateCategoryRequestDto } from './update-category.request.dto';
import { CategoryHttpMapper } from './category-http.mapper';

describe('CategoryHttpMapper', () => {
  it('toCreateCommand() carries all create fields through', () => {
    const dto: CreateCategoryRequestDto = {
      name: 'Plumbing',
      description: 'Plumbing-related home services.',
      icon: 'wrench-icon',
      color: '#0088CC',
      type: CategoryType.Standard,
    };

    const command = CategoryHttpMapper.toCreateCommand(dto);

    expect(command.name).toBe('Plumbing');
    expect(command.description).toBe('Plumbing-related home services.');
    expect(command.icon).toBe('wrench-icon');
    expect(command.color).toBe('#0088CC');
    expect(command.type).toBe(CategoryType.Standard);
  });

  it('toUpdateCommand() carries the id and optional fields through', () => {
    const dto: UpdateCategoryRequestDto = { status: CategoryStatus.Archived };

    const command = CategoryHttpMapper.toUpdateCommand('id-1', dto);

    expect(command.id).toBe('id-1');
    expect(command.status).toBe(CategoryStatus.Archived);
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: CategoryDto = {
      id: 'id-1',
      name: 'Plumbing',
      description: 'Plumbing-related home services.',
      icon: 'wrench-icon',
      color: '#0088CC',
      status: CategoryStatus.Active,
      type: CategoryType.Standard,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = CategoryHttpMapper.toResponse(dto);

    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: CategoryDto = {
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

    const response = CategoryHttpMapper.toListResponse({
      items: [dto],
      total: 1,
      page: 1,
      pageSize: 20,
    });

    expect(response.items).toHaveLength(1);
    expect(response.items[0].id).toBe('id-1');
    expect(response.total).toBe(1);
  });
});
