import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { Service } from '../../domain/entities/service.entity';
import { ServiceRepository } from '../../domain/interfaces/service-repository.interface';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { UpdateServiceCommand } from '../commands/update-service.command';
import { ServiceDto } from '../dto/service.dto';
import { ServiceMapper } from '../mappers/service.mapper';
import { ServiceValidator } from '../validators/service.validator';

/**
 * Updates the mutable fields of an existing Service (`basePrice`,
 * `estimatedDuration`, `status`) — `providerId`/`categoryId`/`name`/
 * `description`/`type` are not offered by `UpdateServiceCommand`, so
 * they stay untouched. Reassigning a Service to a different Provider
 * or Category is structurally impossible here, same criterion as
 * `Trust`'s 1:1 `identityId` being unreachable from its update
 * command.
 *
 * Authorization (Sprint 4, Etapa 18): the Service's owning Provider is
 * resolved and its `identityId` compared against the caller. Only that
 * Identity — or an `Admin` — may edit the Service; previously any
 * authenticated caller could repricing or deactivate a competitor's
 * listing.
 */
export class UpdateServiceUseCase {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(
    command: UpdateServiceCommand,
    caller: AuthenticatedUser,
  ): Promise<ServiceDto> {
    ServiceValidator.validateUpdate(command);

    const id = ServiceId.fromString(command.id);
    const existing = await this.serviceRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Service ${command.id} not found`);
    }

    await this.assertCallerOwnsService(existing, caller);

    const updated = new Service(existing.id, {
      providerId: existing.providerId,
      categoryId: existing.categoryId,
      name: existing.name,
      description: existing.description,
      basePrice: command.basePrice ?? existing.basePrice,
      estimatedDuration:
        command.estimatedDuration ?? existing.estimatedDuration,
      status: command.status ?? existing.status,
      type: existing.type,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.serviceRepository.save(updated);
    return ServiceMapper.toDto(updated);
  }

  private async assertCallerOwnsService(
    service: Service,
    caller: AuthenticatedUser,
  ): Promise<void> {
    if (caller.role === Role.Admin) {
      return;
    }
    const provider = await this.providerRepository.findById(service.providerId);
    if (!provider || provider.identityId.value !== caller.id) {
      throw new ForbiddenException(
        'Only the Provider owning this Service, or an Admin, may modify it',
      );
    }
  }
}
