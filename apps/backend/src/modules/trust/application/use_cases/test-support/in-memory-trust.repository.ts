import { PaginatedResult } from '../../../../core/application/paginated-result';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { Trust } from '../../../domain/entities/trust.entity';
import { TrustRepository } from '../../../domain/interfaces/trust-repository.interface';
import { TrustId } from '../../../domain/value-objects/trust-id.value-object';

/**
 * In-memory `TrustRepository` fake — see `InMemoryIdentityRepository`.
 * `findByIdentityId` returns a single `Trust | null`, matching the
 * real 1:1 invariant with `Identity`.
 */
export class InMemoryTrustRepository implements TrustRepository {
  private readonly rows = new Map<string, Trust>();

  findById(id: TrustId): Promise<Trust | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByIdentityId(identityId: IdentityId): Promise<Trust | null> {
    return Promise.resolve(
      [...this.rows.values()].find((row) =>
        row.identityId.equals(identityId),
      ) ?? null,
    );
  }

  save(trust: Trust): Promise<void> {
    this.rows.set(trust.id.value, trust);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Trust>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Trust[]> {
    const upper = term.toUpperCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) => row.level.includes(upper) || row.status.includes(upper),
      ),
    );
  }
}
