import { Service } from '../../domain/entities/service.entity';
import { ServiceDto } from '../dto/service.dto';

/**
 * Translates between the Service domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class ServiceMapper {
  static toDto(service: Service): ServiceDto {
    const dto = new ServiceDto();
    dto.id = service.id.value;
    dto.providerId = service.providerId.value;
    dto.categoryId = service.categoryId.value;
    dto.name = service.name;
    dto.description = service.description;
    dto.basePrice = service.basePrice;
    dto.estimatedDuration = service.estimatedDuration;
    dto.status = service.status;
    dto.type = service.type;
    dto.createdAt = service.createdAt;
    dto.updatedAt = service.updatedAt;
    return dto;
  }
}
