import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ServiceRepository } from '../../domain/interfaces/service-repository.interface';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { GetServiceQuery } from '../queries/get-service.query';
import { ServiceDto } from '../dto/service.dto';
import { ServiceMapper } from '../mappers/service.mapper';

/**
 * Fetches a single Service by id. Throws `NotFoundException` instead
 * of returning `null` — same pattern as `GetIdentityUseCase`.
 */
export class GetServiceUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async execute(query: GetServiceQuery): Promise<ServiceDto> {
    const service = await this.serviceRepository.findById(
      ServiceId.fromString(query.id),
    );
    if (!service) {
      throw new NotFoundException(`Service ${query.id} not found`);
    }
    return ServiceMapper.toDto(service);
  }
}
