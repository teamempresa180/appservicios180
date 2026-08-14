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
  /**
   * Paginates Contacts. `identityId` restricts the page (and its
   * `total`) to that Identity's own contact channels — an email
   * address or phone number is personal data, so callers list their
   * own unless they are an `Admin`, in which case the scope is
   * omitted.
   */
  list(
    page: number,
    pageSize: number,
    identityId?: IdentityId,
  ): Promise<PaginatedResult<Contact>>;
  /**
   * Free-text match against `value`, scoped to `identityId` when given
   * — same ownership rule as `list`.
   */
  search(term: string, identityId?: IdentityId): Promise<Contact[]>;
}
