import { ServiceRepository } from '../../domain/interfaces/service-repository.interface';
import { ServiceDto } from '../dto/service.dto';
import { GetServiceQuery } from '../queries/get-service.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetServiceUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  execute(query: GetServiceQuery): Promise<ServiceDto | null> {
    void this.serviceRepository;
    void query;
    throw new Error('Not implemented yet');
  }
}
