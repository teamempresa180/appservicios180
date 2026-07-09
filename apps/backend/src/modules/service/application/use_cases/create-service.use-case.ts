import { ServiceRepository } from '../../domain/interfaces/service-repository.interface';
import { ServiceDto } from '../dto/service.dto';
import { CreateServiceCommand } from '../commands/create-service.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreateServiceUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  execute(command: CreateServiceCommand): Promise<ServiceDto> {
    void this.serviceRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
