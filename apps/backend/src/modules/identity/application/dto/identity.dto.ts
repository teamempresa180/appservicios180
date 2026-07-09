import { DocumentType } from '../../domain/value-objects/document-type.value-object';
import { IdentityStatus } from '../../domain/value-objects/identity-status.value-object';

/**
 * Output shape returned by queries and use cases. Plain data — never the
 * domain entity itself.
 */
export class IdentityDto {
  id!: string;
  fullName!: string;
  documentType!: DocumentType;
  documentNumber!: string;
  birthDate!: Date;
  status!: IdentityStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
