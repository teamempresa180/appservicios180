import { PaginatedResult } from '../../../../core/application/paginated-result';
import { Identity } from '../../../domain/entities/identity.entity';
import { IdentityRepository } from '../../../domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../domain/value-objects/identity-id.value-object';

/**
 * In-memory `IdentityRepository` fake for Application-layer unit
 * tests — no Prisma, no I/O. Not exported outside this module's
 * `application/` layer; it exists purely to test Use Cases against
 * the repository *contract* without a real database.
 */
export class InMemoryIdentityRepository implements IdentityRepository {
  private readonly rows = new Map<string, Identity>();

  findById(id: IdentityId): Promise<Identity | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  save(identity: Identity): Promise<void> {
    this.rows.set(identity.id.value, identity);
    return Promise.resolve();
  }

  delete(id: IdentityId): Promise<void> {
    this.rows.delete(id.value);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Identity>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Identity[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (identity) =>
          identity.fullName.toLowerCase().includes(lower) ||
          identity.documentNumber.toLowerCase().includes(lower),
      ),
    );
  }
}
