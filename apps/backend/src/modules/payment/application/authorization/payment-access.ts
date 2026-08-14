import { Caller } from '../../../core/application/caller';
import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { Payment } from '../../domain/entities/payment.entity';

/**
 * Per-record authorization rules for a single Payment.
 *
 * A Payment names both of its parties directly: `payerIdentityId`
 * (the customer, already an `Identity` id) and `receiverProviderId`
 * (a `Provider` id, so it needs one lookup to reach the Identity
 * behind it). Reading is open to both; mutating is the payer's alone,
 * since `status`/`cancel` describe what the payer did with their own
 * money and a receiver must not be able to mark a payment completed.
 *
 * `Caller.isAdmin` short-circuits both.
 */

/** The customer who made the Payment. */
export function isPayer(payment: Payment, caller: Caller): boolean {
  return payment.payerIdentityId.value === caller.identityId;
}

/** The Provider on the receiving end of the Payment. */
export async function isReceivingProvider(
  payment: Payment,
  caller: Caller,
  providerRepository: ProviderRepository,
): Promise<boolean> {
  const provider = await providerRepository.findById(
    payment.receiverProviderId,
  );
  return provider !== null && provider.identityId.value === caller.identityId;
}

/** Mutation rule: the payer, or an Admin. */
export function assertPayer(
  payment: Payment,
  caller: Caller,
  action: string,
): void {
  if (caller.isAdmin || isPayer(payment, caller)) {
    return;
  }
  throw new ForbiddenException(
    `Only the payer of Payment ${payment.id.value} may ${action} it`,
  );
}

/** Read rule: either party, or an Admin. */
export async function assertPartyToPayment(
  payment: Payment,
  caller: Caller,
  providerRepository: ProviderRepository,
  action: string,
): Promise<void> {
  if (caller.isAdmin || isPayer(payment, caller)) {
    return;
  }
  if (await isReceivingProvider(payment, caller, providerRepository)) {
    return;
  }
  throw new ForbiddenException(
    `Only the payer or the receiving Provider of Payment ${payment.id.value} may ${action} it`,
  );
}
