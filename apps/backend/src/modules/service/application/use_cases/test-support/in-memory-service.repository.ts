import { PaginatedResult } from '../../../../core/application/paginated-result';
import { CategoryId } from '../../../../category/domain/value-objects/category-id.value-object';
import { ProviderId } from '../../../../provider/domain/value-objects/provider-id.value-object';
import { Service } from '../../../domain/entities/service.entity';
import { ServiceRepository } from '../../../domain/interfaces/service-repository.interface';
import { ServiceId } from '../../../domain/value-objects/service-id.value-object';

/** In-memory `ServiceRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryServiceRepository implements ServiceRepository {
  private readonly rows = new Map<string, Service>();

  findById(id: ServiceId): Promise<Service | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByProviderId(providerId: ProviderId): Promise<Service[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.providerId.equals(providerId),
      ),
    );
  }

  findByCategoryId(categoryId: CategoryId): Promise<Service[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.categoryId.equals(categoryId),
      ),
    );
  }

  save(service: Service): Promise<void> {
    this.rows.set(service.id.value, service);
    return Promise.resolve();
  }

  delete(id: ServiceId): Promise<void> {
    this.rows.delete(id.value);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Service>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Service[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) =>
          row.name.toLowerCase().includes(lower) ||
          row.description.toLowerCase().includes(lower),
      ),
    );
  }
}
