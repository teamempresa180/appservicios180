import { Entity } from '../../../core/domain/base/entity.base';
import { IdentityId } from '../value-objects/identity-id.value-object';
import { DocumentType } from '../value-objects/document-type.value-object';
import { IdentityStatus } from '../value-objects/identity-status.value-object';

export interface IdentityProps {
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  birthDate: Date;
  status: IdentityStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents the core legal identity of a person.
 * Pure data holder — no behavior, no persistence, no business rules.
 */
export class Identity extends Entity<IdentityId> {
  public readonly fullName: string;
  public readonly documentType: DocumentType;
  public readonly documentNumber: string;
  public readonly birthDate: Date;
  public readonly status: IdentityStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: IdentityId, props: IdentityProps) {
    super(id);
    this.fullName = props.fullName;
    this.documentType = props.documentType;
    this.documentNumber = props.documentNumber;
    this.birthDate = props.birthDate;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
