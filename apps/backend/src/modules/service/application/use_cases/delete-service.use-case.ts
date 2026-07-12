import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ServiceRepository } from '../../domain/interfaces/service-repository.interface';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { DeleteServiceCommand } from '../commands/delete-service.command';

/**
 * Deletes an existing Service. No cascade rule is documented for what
 * happens to other data referencing this `ServiceId` (e.g. future
 * `Order`/`Quote` records) — not implemented here, same criterion as
 * every other `Delete*UseCase`.
 */
export class DeleteServiceUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async execute(command: DeleteServiceCommand): Promise<void> {
    const id = ServiceId.fromString(command.id);
    const existing = await this.serviceRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Service ${command.id} not found`);
    }
    await this.serviceRepository.delete(id);
  }
}
