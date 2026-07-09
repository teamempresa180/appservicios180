import { Schedule } from '../entities/schedule.entity';
import { ScheduleId } from '../value-objects/schedule-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

/**
 * Contract for Schedule persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface ScheduleRepository {
  findById(id: ScheduleId): Promise<Schedule | null>;
  findByProviderId(providerId: ProviderId): Promise<Schedule[]>;
  save(schedule: Schedule): Promise<void>;
}
