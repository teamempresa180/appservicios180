import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Availability } from '../../domain/entities/availability.entity';
import { AvailabilityRepository } from '../../domain/interfaces/availability-repository.interface';
import { AvailabilityId } from '../../domain/value-objects/availability-id.value-object';
import { AvailabilityStatus } from '../../domain/value-objects/availability-status.value-object';
import { CreateAvailabilityCommand } from '../commands/create-availability.command';
import { AvailabilityDto } from '../dto/availability.dto';
import { AvailabilityMapper } from '../mappers/availability.mapper';
import { AvailabilityValidator } from '../validators/availability.validator';

/**
 * Creates a new Availability record for an existing Provider, always
 * in `Active` status. Depends on `ProviderRepository` (not just its
 * own) to verify the referenced Provider actually exists before
 * creating a record for it — `Provider` gets its Infrastructure in
 * this same stage (Sprint 3, Etapa 7), so this check is real from the
 * start, not deferred like `Service`'s Provider check was in Prompt 63.
 *
 * Authorization (Sprint 4, Etapa 18): the resolved Provider must be
 * owned by the authenticated caller unless the caller is an `Admin`,
 * so nobody can publish availability windows against another
 * provider's calendar.
 */
export class CreateAvailabilityUseCase {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(
    command: CreateAvailabilityCommand,
    caller: AuthenticatedUser,
  ): Promise<AvailabilityDto> {
    AvailabilityValidator.validateCreate(command);

    const providerId = ProviderId.fromString(command.providerId);
    const provider = await this.providerRepository.findById(providerId);
    if (!provider) {
      throw new NotFoundException(`Provider ${command.providerId} not found`);
    }

    if (caller.role !== Role.Admin && provider.identityId.value !== caller.id) {
      throw new ForbiddenException(
        'Availability can only be created for a Provider owned by the authenticated Identity',
      );
    }

    const now = new Date();
    const availability = new Availability(AvailabilityId.create(), {
      providerId,
      status: AvailabilityStatus.Active,
      type: command.type,
      availableFrom: command.availableFrom,
      availableTo: command.availableTo,
      createdAt: now,
      updatedAt: now,
    });

    await this.availabilityRepository.save(availability);
    return AvailabilityMapper.toDto(availability);
  }
}
