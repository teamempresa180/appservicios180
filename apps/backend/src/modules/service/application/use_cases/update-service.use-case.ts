import { ServiceRepository } from '../../domain/interfaces/service-repository.interface';
import { ServiceDto } from '../dto/service.dto';
import { UpdateServiceCommand } from '../commands/update-service.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class UpdateServiceUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  execute(command: UpdateServiceCommand): Promise<ServiceDto> {
    void this.serviceRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
