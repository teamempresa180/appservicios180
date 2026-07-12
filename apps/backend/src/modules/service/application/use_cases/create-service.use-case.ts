import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { CategoryRepository } from '../../../category/domain/interfaces/category-repository.interface';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Service } from '../../domain/entities/service.entity';
import { ServiceRepository } from '../../domain/interfaces/service-repository.interface';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { ServiceStatus } from '../../domain/value-objects/service-status.value-object';
import { CreateServiceCommand } from '../commands/create-service.command';
import { ServiceDto } from '../dto/service.dto';
import { ServiceMapper } from '../mappers/service.mapper';
import { ServiceValidator } from '../validators/service.validator';

/**
 * Creates a new Service offered by a Provider within a Category,
 * always in `Active` status. Depends on `CategoryRepository` and
 * `ProviderRepository` to verify both the referenced Category and the
 * referenced Provider actually exist before creating a service for
 * it.
 *
 * **Resolved dependency (Prompt 63 → Prompt 64)**: Prompt 63 left the
 * Provider check undone because the Provider bounded context had no
 * Infrastructure yet. `Provider` now has a real
 * `PrismaProviderRepository` (Sprint 3, Etapa 7), so this check is no
 * longer deferred — see `PROJECT_STATUS.md`, section "Prompt 64", for
 * the full resolution.
 */
export class CreateServiceUseCase {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(command: CreateServiceCommand): Promise<ServiceDto> {
    ServiceValidator.validateCreate(command);

    const categoryId = CategoryId.fromString(command.categoryId);
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category ${command.categoryId} not found`);
    }

    const providerId = ProviderId.fromString(command.providerId);
    const provider = await this.providerRepository.findById(providerId);
    if (!provider) {
      throw new NotFoundException(`Provider ${command.providerId} not found`);
    }

    const now = new Date();
    const service = new Service(ServiceId.create(), {
      providerId,
      categoryId,
      name: command.name,
      description: command.description,
      basePrice: command.basePrice,
      estimatedDuration: command.estimatedDuration,
      status: ServiceStatus.Active,
      type: command.type,
      createdAt: now,
      updatedAt: now,
    });

    await this.serviceRepository.save(service);
    return ServiceMapper.toDto(service);
  }
}
