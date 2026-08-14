import { Caller } from '../../../core/application/caller';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { Order } from '../../domain/entities/order.entity';

/**
 * Per-record authorization rules for a single Order, shared by every
 * Use Case that reads or mutates one.
 *
 * An Order has exactly two legitimate parties: the customer who
 * requested it (`Order.identityId`, an `Identity` id) and the Provider
 * fulfilling it (`Order.providerId`, a `Provider` id — `null` while
 * the request is still open). `@CurrentUser()` only carries an
 * Identity id, so deciding "is the caller the assigned Provider?"
 * requires resolving `Order.providerId` back to its owning Identity
 * through `ProviderRepository` — that indirection is the reason these
 * checks live in the Application layer next to a repository rather
 * than in a guard.
 *
 * `Caller.isAdmin` short-circuits every rule.
 */

/** The customer who requested the Order. */
export function isOwningCustomer(order: Order, caller: Caller): boolean {
  return order.identityId.value === caller.identityId;
}

/**
 * The Provider currently assigned to the Order. Always `false` for an
 * open request (`providerId === null`) — nobody is assigned yet, so
 * no Provider can claim it.
 */
export async function isAssignedProvider(
  order: Order,
  caller: Caller,
  providerRepository: ProviderRepository,
): Promise<boolean> {
  if (!order.providerId) {
    return false;
  }
  const provider = await providerRepository.findById(order.providerId);
  return provider !== null && provider.identityId.value === caller.identityId;
}

/**
 * Read/cancel rule: either party to the Order (customer or assigned
 * Provider), or an Admin.
 */
export async function assertCustomerOrAssignedProvider(
  order: Order,
  caller: Caller,
  providerRepository: ProviderRepository,
  action: string,
): Promise<void> {
  if (caller.isAdmin || isOwningCustomer(order, caller)) {
    return;
  }
  if (await isAssignedProvider(order, caller, providerRepository)) {
    return;
  }
  throw new ForbiddenException(
    `Only the customer who requested Order ${order.id.value} or its assigned Provider may ${action} it`,
  );
}

/**
 * Fulfillment rule: only the assigned Provider (or an Admin) may move
 * the Order through the work states — starting or completing someone
 * else's job is not the customer's call either.
 */
export async function assertAssignedProvider(
  order: Order,
  caller: Caller,
  providerRepository: ProviderRepository,
  action: string,
): Promise<void> {
  if (caller.isAdmin) {
    return;
  }
  if (await isAssignedProvider(order, caller, providerRepository)) {
    return;
  }
  throw new ForbiddenException(
    `Only the Provider assigned to Order ${order.id.value} may ${action} it`,
  );
}

/** Customer-only rule: editing the request's own fields. */
export function assertOwningCustomer(
  order: Order,
  caller: Caller,
  action: string,
): void {
  if (caller.isAdmin || isOwningCustomer(order, caller)) {
    return;
  }
  throw new ForbiddenException(
    `Only the customer who requested Order ${order.id.value} may ${action} it`,
  );
}
