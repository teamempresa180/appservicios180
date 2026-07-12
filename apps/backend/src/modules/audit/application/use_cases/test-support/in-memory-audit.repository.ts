import { PaginatedResult } from '../../../../core/application/paginated-result';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { Audit } from '../../../domain/entities/audit.entity';
import { AuditRepository } from '../../../domain/interfaces/audit-repository.interface';
import { AuditId } from '../../../domain/value-objects/audit-id.value-object';

/** In-memory `AuditRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryAuditRepository implements AuditRepository {
  private readonly rows = new Map<string, Audit>();

  findById(id: AuditId): Promise<Audit | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByIdentityId(identityId: IdentityId): Promise<Audit[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.identityId.equals(identityId),
      ),
    );
  }

  save(audit: Audit): Promise<void> {
    this.rows.set(audit.id.value, audit);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Audit>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Audit[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) =>
          row.description.toLowerCase().includes(lower) ||
          row.actionType.toLowerCase().includes(lower),
      ),
    );
  }
}
