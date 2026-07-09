import { Availability } from '../../domain/entities/availability.entity';
import { AvailabilityDto } from '../dto/availability.dto';

/**
 * Translates between the Availability domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class AvailabilityMapper {
  static toDto(availability: Availability): AvailabilityDto {
    const dto = new AvailabilityDto();
    dto.id = availability.id.value;
    dto.providerId = availability.providerId.value;
    dto.status = availability.status;
    dto.type = availability.type;
    dto.availableFrom = availability.availableFrom;
    dto.availableTo = availability.availableTo;
    dto.createdAt = availability.createdAt;
    dto.updatedAt = availability.updatedAt;
    return dto;
  }
}
