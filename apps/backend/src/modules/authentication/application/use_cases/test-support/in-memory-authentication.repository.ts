import { PaginatedResult } from '../../../../core/application/paginated-result';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { Authentication } from '../../../domain/entities/authentication.entity';
import { AuthenticationRepository } from '../../../domain/interfaces/authentication-repository.interface';
import { AuthenticationId } from '../../../domain/value-objects/authentication-id.value-object';

/** In-memory `AuthenticationRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryAuthenticationRepository implements AuthenticationRepository {
  private readonly rows = new Map<string, Authentication>();

  findById(id: AuthenticationId): Promise<Authentication | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByIdentityId(identityId: IdentityId): Promise<Authentication[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.identityId.equals(identityId),
      ),
    );
  }

  save(authentication: Authentication): Promise<void> {
    this.rows.set(authentication.id.value, authentication);
    return Promise.resolve();
  }

  delete(id: AuthenticationId): Promise<void> {
    this.rows.delete(id.value);
    return Promise.resolve();
  }

  list(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Authentication>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Authentication[]> {
    const upper = term.toUpperCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) => row.methodType.includes(upper) || row.status.includes(upper),
      ),
    );
  }
}
