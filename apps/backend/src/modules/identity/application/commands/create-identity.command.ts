import { DocumentType } from '../../domain/value-objects/document-type.value-object';

/**
 * Intent to create a new Identity. Plain data — no behavior.
 */
export class CreateIdentityCommand {
  constructor(
    public readonly fullName: string,
    public readonly documentType: DocumentType,
    public readonly documentNumber: string,
    public readonly birthDate: Date,
  ) {}
}
