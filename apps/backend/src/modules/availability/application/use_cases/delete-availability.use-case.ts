import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { AvailabilityRepository } from '../../domain/interfaces/availability-repository.interface';
import { AvailabilityId } from '../../domain/value-objects/availability-id.value-object';
import { DeleteAvailabilityCommand } from '../commands/delete-availability.command';

/**
 * Deletes an existing Availability record. No cascade rule is
 * documented for what happens to other data referencing this
 * `AvailabilityId` — same criterion as every other `Delete*UseCase`.
 */
export class DeleteAvailabilityUseCase {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
  ) {}

  async execute(command: DeleteAvailabilityCommand): Promise<void> {
    const id = AvailabilityId.fromString(command.id);
    const existing = await this.availabilityRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Availability ${command.id} not found`);
    }
    await this.availabilityRepository.delete(id);
  }
}
