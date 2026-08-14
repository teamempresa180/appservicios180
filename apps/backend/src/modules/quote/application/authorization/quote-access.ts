import { Caller } from '../../../core/application/caller';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderRepository } from '../../../order/domain/interfaces/order-repository.interface';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { Quote } from '../../domain/entities/quote.entity';

/**
 * Per-record authorization rules for a single Quote.
 *
 * A Quote sits between two parties: the Provider who submitted it
 * (`Quote.providerId`) and the customer who requested the Order it
 * answers (`Order.identityId`, reached through `Quote.orderId`).
 * Which side may do what is asymmetric — the Provider owns the
 * *offer* (may edit its price/duration/notes), the customer owns the
 * *decision* (may accept or reject it) — so there are two distinct
 * assertions rather than one shared "is a party" check.
 *
 * `Caller.isAdmin` short-circuits both.
 */

/** The Provider that submitted the Quote. */
export async function isSubmittingProvider(
  quote: Quote,
  caller: Caller,
  providerRepository: ProviderRepository,
): Promise<boolean> {
  const provider = await providerRepository.findById(quote.providerId);
  return provider !== null && provider.identityId.value === caller.identityId;
}

/** The customer who requested the Order this Quote answers. */
export async function isOrderCustomer(
  quote: Quote,
  caller: Caller,
  orderRepository: OrderRepository,
): Promise<boolean> {
  const order = await orderRepository.findById(quote.orderId);
  return order !== null && order.identityId.value === caller.identityId;
}

/**
 * Editing the offer: only the Provider who submitted it, or an Admin.
 */
export async function assertSubmittingProvider(
  quote: Quote,
  caller: Caller,
  providerRepository: ProviderRepository,
  action: string,
): Promise<void> {
  if (caller.isAdmin) {
    return;
  }
  if (await isSubmittingProvider(quote, caller, providerRepository)) {
    return;
  }
  throw new ForbiddenException(
    `Only the Provider that submitted Quote ${quote.id.value} may ${action} it`,
  );
}

/**
 * Deciding on the offer: only the customer whose Order the Quote
 * answers, or an Admin. Accepting a Quote is what advances the Order
 * to `Accepted` and binds a Provider to it, so it is emphatically not
 * the quoting Provider's own call.
 */
export async function assertOrderCustomer(
  quote: Quote,
  caller: Caller,
  orderRepository: OrderRepository,
  action: string,
): Promise<void> {
  if (caller.isAdmin) {
    return;
  }
  if (await isOrderCustomer(quote, caller, orderRepository)) {
    return;
  }
  throw new ForbiddenException(
    `Only the customer who requested the Order behind Quote ${quote.id.value} may ${action} it`,
  );
}

/**
 * Resolves the two id sets a caller's visibility over Quotes depends
 * on, in one pass: the `Provider` record they own (if any) and the
 * ids of the Orders they requested as a customer. Used by the list/
 * search Use Cases, which need the same two lookups.
 */
export async function resolveQuoteScope(
  caller: Caller,
  orderRepository: OrderRepository,
  providerRepository: ProviderRepository,
): Promise<{ providerId: string | null; orderIds: Set<string> }> {
  const identityId = IdentityId.fromString(caller.identityId);
  const [provider, orders] = await Promise.all([
    providerRepository.findByIdentityId(identityId),
    orderRepository.findByIdentityId(identityId),
  ]);
  return {
    providerId: provider ? provider.id.value : null,
    orderIds: new Set(orders.map((order) => order.id.value)),
  };
}
