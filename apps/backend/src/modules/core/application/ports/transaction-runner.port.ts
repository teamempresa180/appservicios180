import { TransactionContext } from '../../domain/ports/transaction-context';

/**
 * Runs `work` atomically: every repository `save` call made with the
 * `tx` it hands back either all commit together or all roll back
 * together. Exists so a use case that writes to more than one
 * aggregate in a single business operation (e.g. `AcceptQuoteUseCase`
 * transitioning both a Quote and its Order) can't leave the two
 * halfway out of sync if the process dies between the two writes —
 * see Etapa 18, Security Hardening.
 *
 * An Application-layer port (not a repository method) because it
 * spans repositories — no single `XRepository` interface should know
 * about another module's aggregate.
 */
export interface TransactionRunner {
  run<T>(work: (tx: TransactionContext) => Promise<T>): Promise<T>;
}

export const TRANSACTION_RUNNER = Symbol('TRANSACTION_RUNNER');
