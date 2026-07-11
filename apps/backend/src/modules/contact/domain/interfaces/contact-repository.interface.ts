import { PaginatedResult } from '../../../core/application/paginated-result';
import { Contact } from '../entities/contact.entity';
import { ContactId } from '../value-objects/contact-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Contact persistence. No implementation lives in this module —
 * concrete repositories belong to the infrastructure layer (Sprint 3, Etapa 4:
 * `PrismaContactRepository`).
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject a `ContactRepository` implementation by contract
 *  instead of by concrete class. */
export const CONTACT_REPOSITORY = Symbol('ContactRepository');

export interface ContactRepository {
  findById(id: ContactId): Promise<Contact | null>;
  findByIdentityId(identityId: IdentityId): Promise<Contact[]>;
  save(contact: Contact): Promise<void>;
  delete(id: ContactId): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Contact>>;
  /** Free-text match against `value`. */
  search(term: string): Promise<Contact[]>;
}
