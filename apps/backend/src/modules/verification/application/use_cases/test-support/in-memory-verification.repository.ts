import { PaginatedResult } from '../../../../core/application/paginated-result';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { Verification } from '../../../domain/entities/verification.entity';
import { VerificationRepository } from '../../../domain/interfaces/verification-repository.interface';
import { VerificationId } from '../../../domain/value-objects/verification-id.value-object';

/** In-memory `VerificationRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryVerificationRepository implements VerificationRepository {
  private readonly rows = new Map<string, Verification>();

  findById(id: VerificationId): Promise<Verification | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByIdentityId(identityId: IdentityId): Promise<Verification[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.identityId.equals(identityId),
      ),
    );
  }

  save(verification: Verification): Promise<void> {
    this.rows.set(verification.id.value, verification);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Verification>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Verification[]> {
    const upper = term.toUpperCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) => row.type.includes(upper) || row.status.includes(upper),
      ),
    );
  }
}
