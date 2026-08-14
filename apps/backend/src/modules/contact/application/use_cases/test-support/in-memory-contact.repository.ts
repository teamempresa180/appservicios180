import { PaginatedResult } from '../../../../core/application/paginated-result';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { Contact } from '../../../domain/entities/contact.entity';
import { ContactRepository } from '../../../domain/interfaces/contact-repository.interface';
import { ContactId } from '../../../domain/value-objects/contact-id.value-object';

/** In-memory `ContactRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryContactRepository implements ContactRepository {
  private readonly rows = new Map<string, Contact>();

  findById(id: ContactId): Promise<Contact | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByIdentityId(identityId: IdentityId): Promise<Contact[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.identityId.equals(identityId),
      ),
    );
  }

  save(contact: Contact): Promise<void> {
    this.rows.set(contact.id.value, contact);
    return Promise.resolve();
  }

  delete(id: ContactId): Promise<void> {
    this.rows.delete(id.value);
    return Promise.resolve();
  }

  list(
    page: number,
    pageSize: number,
    identityId?: IdentityId,
  ): Promise<PaginatedResult<Contact>> {
    const all = [...this.rows.values()].filter(
      (row) => identityId === undefined || row.identityId.equals(identityId),
    );
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string, identityId?: IdentityId): Promise<Contact[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) =>
          (identityId === undefined || row.identityId.equals(identityId)) &&
          row.value.toLowerCase().includes(lower),
      ),
    );
  }
}
