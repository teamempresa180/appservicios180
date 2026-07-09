import { Entity } from '../../../core/domain/base/entity.base';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ContactId } from '../value-objects/contact-id.value-object';
import { ContactType } from '../value-objects/contact-type.value-object';
import { ContactStatus } from '../value-objects/contact-status.value-object';

export interface ContactProps {
  identityId: IdentityId;
  type: ContactType;
  value: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a contact channel (email, phone) associated with an Identity.
 * Pure data holder — no format validation, no verification logic, no
 * persistence, no business rules.
 */
export class Contact extends Entity<ContactId> {
  public readonly identityId: IdentityId;
  public readonly type: ContactType;
  public readonly value: string;
  public readonly status: ContactStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: ContactId, props: ContactProps) {
    super(id);
    this.identityId = props.identityId;
    this.type = props.type;
    this.value = props.value;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
