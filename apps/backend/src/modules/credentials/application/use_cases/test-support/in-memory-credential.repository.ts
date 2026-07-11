import { PaginatedResult } from '../../../../core/application/paginated-result';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { Credential } from '../../../domain/entities/credential.entity';
import { CredentialRepository } from '../../../domain/interfaces/credential-repository.interface';
import { CredentialId } from '../../../domain/value-objects/credential-id.value-object';

/** In-memory `CredentialRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryCredentialRepository implements CredentialRepository {
  private readonly rows = new Map<string, Credential>();

  findById(id: CredentialId): Promise<Credential | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByIdentityId(identityId: IdentityId): Promise<Credential[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.identityId.equals(identityId),
      ),
    );
  }

  save(credential: Credential): Promise<void> {
    this.rows.set(credential.id.value, credential);
    return Promise.resolve();
  }

  delete(id: CredentialId): Promise<void> {
    this.rows.delete(id.value);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Credential>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Credential[]> {
    const upper = term.toUpperCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) => row.type.includes(upper) || row.status.includes(upper),
      ),
    );
  }
}
