import { DomainException } from './domain.exception';

/**
 * Thrown when a lookup by id (or any other unique criterion) finds no
 * matching record. Every module's `get`/`update`/`delete` use case
 * will need this once its repository is implemented — today those
 * use cases only throw the placeholder `Error('Not implemented yet')`.
 */
export class NotFoundException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
