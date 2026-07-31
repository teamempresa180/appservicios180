import { PaginatedResult } from '../../../../core/application/paginated-result';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { CategoryId } from '../../../../category/domain/value-objects/category-id.value-object';
import { SpecializationId } from '../../../../category/domain/value-objects/specialization-id.value-object';
import { Provider } from '../../../domain/entities/provider.entity';
import { ProviderRepository } from '../../../domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../../domain/value-objects/provider-id.value-object';
import { ProviderStatus } from '../../../domain/value-objects/provider-status.value-object';

/**
 * In-memory `ProviderRepository` fake — see `InMemoryIdentityRepository`.
 * `findByIdentityId` returns a single `Provider | null`, matching the
 * real 1:1 invariant with `Identity`.
 */
export class InMemoryProviderRepository implements ProviderRepository {
  private readonly rows = new Map<string, Provider>();

  findById(id: ProviderId): Promise<Provider | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByIdentityId(identityId: IdentityId): Promise<Provider | null> {
    return Promise.resolve(
      [...this.rows.values()].find((row) =>
        row.identityId.equals(identityId),
      ) ?? null,
    );
  }

  save(provider: Provider): Promise<void> {
    this.rows.set(provider.id.value, provider);
    return Promise.resolve();
  }

  delete(id: ProviderId): Promise<void> {
    this.rows.delete(id.value);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Provider>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Provider[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) =>
          row.type.toLowerCase().includes(lower) ||
          row.biography.toLowerCase().includes(lower),
      ),
    );
  }

  findCompatible(
    categoryId: CategoryId,
    specializationId?: SpecializationId,
  ): Promise<Provider[]> {
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) =>
          row.categoryId?.equals(categoryId) &&
          row.status === ProviderStatus.Active &&
          (!specializationId ||
            (row.specializationId?.equals(specializationId) ?? false)),
      ),
    );
  }
}
