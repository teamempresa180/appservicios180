import { PaginatedResult } from '../../../../core/application/paginated-result';
import { ProviderId } from '../../../../provider/domain/value-objects/provider-id.value-object';
import { Availability } from '../../../domain/entities/availability.entity';
import { AvailabilityRepository } from '../../../domain/interfaces/availability-repository.interface';
import { AvailabilityId } from '../../../domain/value-objects/availability-id.value-object';

/** In-memory `AvailabilityRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryAvailabilityRepository implements AvailabilityRepository {
  private readonly rows = new Map<string, Availability>();

  findById(id: AvailabilityId): Promise<Availability | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByProviderId(providerId: ProviderId): Promise<Availability[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.providerId.equals(providerId),
      ),
    );
  }

  save(availability: Availability): Promise<void> {
    this.rows.set(availability.id.value, availability);
    return Promise.resolve();
  }

  delete(id: AvailabilityId): Promise<void> {
    this.rows.delete(id.value);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Availability>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Availability[]> {
    const upper = term.toUpperCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) => row.type.includes(upper) || row.status.includes(upper),
      ),
    );
  }
}
