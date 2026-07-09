import { Category } from './category.entity';
import { CategoryId } from '../value-objects/category-id.value-object';
import { CategoryStatus } from '../value-objects/category-status.value-object';
import { CategoryType } from '../value-objects/category-type.value-object';

describe('Category', () => {
  it('holds all the assigned properties', () => {
    const id = CategoryId.create();
    const now = new Date();
    const category = new Category(id, {
      name: 'Plomería',
      description: 'Servicios de plomería residencial y comercial',
      icon: 'plumbing_icon',
      color: '#2196F3',
      status: CategoryStatus.Active,
      type: CategoryType.Standard,
      createdAt: now,
      updatedAt: now,
    });

    expect(category.id).toBe(id);
    expect(category.name).toBe('Plomería');
    expect(category.description).toBe(
      'Servicios de plomería residencial y comercial',
    );
    expect(category.icon).toBe('plumbing_icon');
    expect(category.color).toBe('#2196F3');
    expect(category.status).toBe(CategoryStatus.Active);
    expect(category.type).toBe(CategoryType.Standard);
  });

  it('is equal to another category with the same id', () => {
    const id = CategoryId.create();
    const now = new Date();
    const props = {
      name: 'Plomería',
      description: 'Desc',
      icon: 'icon',
      color: '#000000',
      status: CategoryStatus.Active,
      type: CategoryType.Standard,
      createdAt: now,
      updatedAt: now,
    };
    const a = new Category(id, props);
    const b = new Category(id, props);
    expect(a.equals(b)).toBe(true);
  });
});
