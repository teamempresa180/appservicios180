import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { CategoryRepository } from '../../../category/domain/interfaces/category-repository.interface';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
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
 * always in `Active` status. Depends on `CategoryRepository` to
 * verify the referenced Category actually exists before creating a
 * service for it — same rule already applied to every other module
 * referencing an entity by ID.
 *
 * Does **not** verify that `providerId` references a real `Provider`:
 * the Provider bounded context has no Infrastructure yet (no
 * `PrismaProviderRepository`), out of scope for this stage per the
 * Marketplace roadmap ("Category → Service → Provider"). This is a
 * documented, intentional gap — not an oversight — see
 * `PROJECT_STATUS.md`, section "Prompt 63".
 */
export class CreateServiceUseCase {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(command: CreateServiceCommand): Promise<ServiceDto> {
    ServiceValidator.validateCreate(command);

    const categoryId = CategoryId.fromString(command.categoryId);
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category ${command.categoryId} not found`);
    }

    const now = new Date();
    const service = new Service(ServiceId.create(), {
      providerId: ProviderId.fromString(command.providerId),
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
