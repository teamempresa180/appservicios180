import { ServiceRepository } from '../../domain/interfaces/service-repository.interface';
import { DeleteServiceCommand } from '../commands/delete-service.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class DeleteServiceUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  execute(command: DeleteServiceCommand): Promise<void> {
    void this.serviceRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
