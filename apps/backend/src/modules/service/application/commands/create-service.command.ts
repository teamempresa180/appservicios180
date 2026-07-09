import { ServiceType } from '../../domain/value-objects/service-type.value-object';

/**
 * Intent to create a new Service. Plain data — no behavior.
 */
export class CreateServiceCommand {
  constructor(
    public readonly providerId: string,
    public readonly categoryId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly basePrice: number,
    public readonly estimatedDuration: number,
    public readonly type: ServiceType,
  ) {}
}
