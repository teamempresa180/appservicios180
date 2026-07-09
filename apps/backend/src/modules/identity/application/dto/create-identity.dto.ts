import { DocumentType } from '../../domain/value-objects/document-type.value-object';

/**
 * Input shape for creating an Identity. No validation — that belongs to a
 * future validation layer (e.g. class-validator decorators), not here.
 */
export class CreateIdentityDto {
  fullName!: string;
  documentType!: DocumentType;
  documentNumber!: string;
  birthDate!: Date;
}
