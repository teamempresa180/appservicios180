import { Entity } from '../../../core/domain/base/entity.base';
import { CategoryId } from '../value-objects/category-id.value-object';
import { CategoryStatus } from '../value-objects/category-status.value-object';
import { CategoryType } from '../value-objects/category-type.value-object';

export interface CategoryProps {
  name: string;
  description: string;
  icon: string;
  color: string;
  status: CategoryStatus;
  type: CategoryType;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a service category. Pure data holder — no hierarchy, no
 * providers, no services, no search, no behavior, no persistence.
 */
export class Category extends Entity<CategoryId> {
  public readonly name: string;
  public readonly description: string;
  public readonly icon: string;
  public readonly color: string;
  public readonly status: CategoryStatus;
  public readonly type: CategoryType;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: CategoryId, props: CategoryProps) {
    super(id);
    this.name = props.name;
    this.description = props.description;
    this.icon = props.icon;
    this.color = props.color;
    this.status = props.status;
    this.type = props.type;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
