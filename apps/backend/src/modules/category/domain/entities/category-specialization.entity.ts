import { Entity } from '../../../core/domain/base/entity.base';
import { CategoryId } from '../value-objects/category-id.value-object';
import { SpecializationId } from '../value-objects/specialization-id.value-object';

export interface CategorySpecializationProps {
  categoryId: CategoryId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a real specialization within a Category (e.g. Electricidad
 * -> Residencial/Comercial/Industrial/Domótica/Redes/Paneles solares).
 * Pure data holder — no behavior, no persistence. A Provider picks a
 * Category and, optionally, one of its Specializations
 * (`Provider.specializationId`); the association is enforced by
 * `ProviderValidator`/`CreateProviderUseCase`, not here.
 */
export class CategorySpecialization extends Entity<SpecializationId> {
  public readonly categoryId: CategoryId;
  public readonly name: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: SpecializationId, props: CategorySpecializationProps) {
    super(id);
    this.categoryId = props.categoryId;
    this.name = props.name;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
