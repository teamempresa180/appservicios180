import { PrismaClient } from '@prisma/client';
import { Category } from '../../domain/entities/category.entity';
import { CategoryId } from '../../domain/value-objects/category-id.value-object';
import { CategoryStatus } from '../../domain/value-objects/category-status.value-object';
import { CategoryType } from '../../domain/value-objects/category-type.value-object';
import { PrismaCategoryRepository } from './prisma-category.repository';

/**
 * Integration test — runs against a real PostgreSQL database, same
 * setup as `PrismaIdentityRepository (integration)`. Excluded from
 * `npm test` (see `testPathIgnorePatterns`).
 */
describe('PrismaCategoryRepository (integration)', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaCategoryRepository(prisma as never);

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function buildCategory(overrides: Partial<{ name: string }> = {}) {
    const now = new Date();
    return new Category(CategoryId.create(), {
      name: overrides.name ?? `Integration Test Category ${Date.now()}`,
      description: 'A category created for integration testing',
      icon: 'icon-test',
      color: '#123456',
      status: CategoryStatus.Active,
      type: CategoryType.Standard,
      createdAt: now,
      updatedAt: now,
    });
  }

  it('saves and finds a Category by id', async () => {
    const category = buildCategory();

    await repository.save(category);
    const found = await repository.findById(category.id);

    expect(found).not.toBeNull();
    expect(found?.id.equals(category.id)).toBe(true);
    expect(found?.name).toBe(category.name);
  });

  it('returns null for an unknown id', async () => {
    const found = await repository.findById(CategoryId.create());
    expect(found).toBeNull();
  });

  it('finds all Categories', async () => {
    const category = buildCategory();
    await repository.save(category);

    const results = await repository.findAll();

    expect(results.some((c) => c.id.equals(category.id))).toBe(true);
  });

  it('updates an existing Category on save (upsert)', async () => {
    const category = buildCategory({ name: 'Before Update' });
    await repository.save(category);

    const updated = new Category(category.id, {
      name: 'After Update',
      description: category.description,
      icon: category.icon,
      color: category.color,
      status: category.status,
      type: category.type,
      createdAt: category.createdAt,
      updatedAt: new Date(),
    });
    await repository.save(updated);

    const found = await repository.findById(category.id);
    expect(found?.name).toBe('After Update');
  });

  it('deletes a Category', async () => {
    const category = buildCategory();
    await repository.save(category);

    await repository.delete(category.id);

    const found = await repository.findById(category.id);
    expect(found).toBeNull();
  });

  it('lists Categories with pagination', async () => {
    await repository.save(buildCategory());
    await repository.save(buildCategory());

    const page = await repository.list(1, 1);

    expect(page.items).toHaveLength(1);
    expect(page.total).toBeGreaterThanOrEqual(2);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(1);
  });

  it('searches Categories by name', async () => {
    const marker = `Searchable-${Date.now()}`;
    await repository.save(buildCategory({ name: marker }));

    const results = await repository.search(marker);

    expect(results.some((category) => category.name === marker)).toBe(true);
  });
});
