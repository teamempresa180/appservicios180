import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Availability } from '../../domain/entities/availability.entity';
import { AvailabilityRepository } from '../../domain/interfaces/availability-repository.interface';
import { AvailabilityId } from '../../domain/value-objects/availability-id.value-object';
import { UpdateAvailabilityCommand } from '../commands/update-availability.command';
import { AvailabilityDto } from '../dto/availability.dto';
import { AvailabilityMapper } from '../mappers/availability.mapper';
import { AvailabilityValidator } from '../validators/availability.validator';

/**
 * Updates the mutable fields of an existing Availability
 * (`availableFrom`, `availableTo`, `status`) — `providerId`/`type`
 * are not offered by `UpdateAvailabilityCommand`, so they stay
 * untouched.
 */
export class UpdateAvailabilityUseCase {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
  ) {}

  async execute(command: UpdateAvailabilityCommand): Promise<AvailabilityDto> {
    AvailabilityValidator.validateUpdate(command);

    const id = AvailabilityId.fromString(command.id);
    const existing = await this.availabilityRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Availability ${command.id} not found`);
    }

    const updated = new Availability(existing.id, {
      providerId: existing.providerId,
      status: command.status ?? existing.status,
      type: existing.type,
      availableFrom: command.availableFrom ?? existing.availableFrom,
      availableTo: command.availableTo ?? existing.availableTo,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.availabilityRepository.save(updated);
    return AvailabilityMapper.toDto(updated);
  }
}
