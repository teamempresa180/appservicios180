import { DomainException } from './domain.exception';

/**
 * Thrown when a lookup by id (or any other unique criterion) finds no
 * matching record. Every module's `get`/`update`/`delete` use case
 * throws this once its Prisma-backed repository confirms no row
 * matches the given criterion.
 */
export class NotFoundException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
