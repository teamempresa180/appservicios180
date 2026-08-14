import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
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
 *
 * Authorization (Sprint 4, Etapa 18): the record's owning Provider is
 * resolved and its `identityId` compared against the caller, so only
 * that Identity — or an `Admin` — may edit the window.
 */
export class UpdateAvailabilityUseCase {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(
    command: UpdateAvailabilityCommand,
    caller: AuthenticatedUser,
  ): Promise<AvailabilityDto> {
    AvailabilityValidator.validateUpdate(command);

    const id = AvailabilityId.fromString(command.id);
    const existing = await this.availabilityRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Availability ${command.id} not found`);
    }

    if (caller.role !== Role.Admin) {
      const provider = await this.providerRepository.findById(
        existing.providerId,
      );
      if (!provider || provider.identityId.value !== caller.id) {
        throw new ForbiddenException(
          'Only the Provider owning this Availability, or an Admin, may modify it',
        );
      }
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
