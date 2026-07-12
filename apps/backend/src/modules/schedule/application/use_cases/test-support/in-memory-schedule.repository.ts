import { PaginatedResult } from '../../../../core/application/paginated-result';
import { ProviderId } from '../../../../provider/domain/value-objects/provider-id.value-object';
import { Schedule } from '../../../domain/entities/schedule.entity';
import { ScheduleRepository } from '../../../domain/interfaces/schedule-repository.interface';
import { ScheduleId } from '../../../domain/value-objects/schedule-id.value-object';

/** In-memory `ScheduleRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryScheduleRepository implements ScheduleRepository {
  private readonly rows = new Map<string, Schedule>();

  findById(id: ScheduleId): Promise<Schedule | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByProviderId(providerId: ProviderId): Promise<Schedule[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.providerId.equals(providerId),
      ),
    );
  }

  save(schedule: Schedule): Promise<void> {
    this.rows.set(schedule.id.value, schedule);
    return Promise.resolve();
  }

  delete(id: ScheduleId): Promise<void> {
    this.rows.delete(id.value);
    return Promise.resolve();
  }

  list(page: number, pageSize: number): Promise<PaginatedResult<Schedule>> {
    const all = [...this.rows.values()];
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string): Promise<Schedule[]> {
    const upper = term.toUpperCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) => row.type.includes(upper) || row.status.includes(upper),
      ),
    );
  }
}
