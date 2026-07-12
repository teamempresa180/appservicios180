import { ServiceModel as PrismaServiceModel } from '@prisma/client';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Service } from '../../domain/entities/service.entity';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { ServiceStatus } from '../../domain/value-objects/service-status.value-object';
import { ServiceType } from '../../domain/value-objects/service-type.value-object';

/**
 * Translates between the `Service` domain entity and its Prisma row
 * shape (`ServiceModel`, mapped to the `services` table). The only
 * place in this module that imports from `@prisma/client` — Domain/
 * Application never do.
 */
export class ServicePrismaMapper {
  static toDomain(row: PrismaServiceModel): Service {
    return new Service(ServiceId.fromString(row.id), {
      providerId: ProviderId.fromString(row.providerId),
      categoryId: CategoryId.fromString(row.categoryId),
      name: row.name,
      description: row.description,
      basePrice: row.basePrice,
      estimatedDuration: row.estimatedDuration,
      status: row.status as unknown as ServiceStatus,
      type: row.type as unknown as ServiceType,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(service: Service): PrismaServiceModel {
    return {
      id: service.id.value,
      providerId: service.providerId.value,
      categoryId: service.categoryId.value,
      name: service.name,
      description: service.description,
      basePrice: service.basePrice,
      estimatedDuration: service.estimatedDuration,
      status: service.status,
      type: service.type,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  }
}
