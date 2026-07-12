import { CategoryModel as PrismaCategory } from '@prisma/client';
import { Category } from '../../domain/entities/category.entity';
import { CategoryId } from '../../domain/value-objects/category-id.value-object';
import { CategoryStatus } from '../../domain/value-objects/category-status.value-object';
import { CategoryType } from '../../domain/value-objects/category-type.value-object';
import { CategoryPrismaMapper } from './category-prisma.mapper';

describe('CategoryPrismaMapper', () => {
  const row: PrismaCategory = {
    id: 'id-1',
    name: 'Plumbing',
    description: 'Pipes and water systems',
    icon: 'icon-plumbing',
    color: '#0000FF',
    status: 'ACTIVE',
    type: 'STANDARD',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const category = CategoryPrismaMapper.toDomain(row);

    expect(category.id.value).toBe('id-1');
    expect(category.name).toBe('Plumbing');
    expect(category.status).toBe(CategoryStatus.Active);
    expect(category.type).toBe(CategoryType.Standard);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const category = new Category(CategoryId.fromString('id-1'), {
      name: 'Plumbing',
      description: 'Pipes and water systems',
      icon: 'icon-plumbing',
      color: '#0000FF',
      status: CategoryStatus.Active,
      type: CategoryType.Standard,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(CategoryPrismaMapper.toPersistence(category)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const category = CategoryPrismaMapper.toDomain(row);
    expect(CategoryPrismaMapper.toPersistence(category)).toEqual(row);
  });
});
