import { PaginatedResult } from '../../../core/application/paginated-result';
import { Schedule } from '../entities/schedule.entity';
import { ScheduleId } from '../value-objects/schedule-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

/**
 * Contract for Schedule persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer
 * (Sprint 3, Etapa 7: `PrismaScheduleRepository`).
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject a `ScheduleRepository` implementation by contract
 *  instead of by concrete class. */
export const SCHEDULE_REPOSITORY = Symbol('ScheduleRepository');

export interface ScheduleRepository {
  findById(id: ScheduleId): Promise<Schedule | null>;
  findByProviderId(providerId: ProviderId): Promise<Schedule[]>;
  save(schedule: Schedule): Promise<void>;
  delete(id: ScheduleId): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Schedule>>;
  /** Free-text match against `type`/`status`. */
  search(term: string): Promise<Schedule[]>;
}
