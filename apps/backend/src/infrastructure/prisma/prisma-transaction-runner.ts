import { Injectable } from '@nestjs/common';
import { TransactionRunner } from '../../modules/core/application/ports/transaction-runner.port';
import { TransactionContext } from '../../modules/core/domain/ports/transaction-context';
import { PrismaService } from './prisma.service';

/**
 * `TransactionRunner` backed by Prisma's interactive transactions
 * (`$transaction(callback)`). The `tx` handed to `work` is a
 * transaction-scoped `PrismaClient` — every Prisma repository that
 * receives it as its `TransactionContext` parameter casts it back to
 * `Prisma.TransactionClient` internally (see
 * `PrismaOrderRepository.save`/`PrismaQuoteRepository.save`) and
 * queries through it instead of the app-wide singleton, which is what
 * makes the writes participate in the same transaction.
 */
@Injectable()
export class PrismaTransactionRunner implements TransactionRunner {
  constructor(private readonly prisma: PrismaService) {}

  run<T>(work: (tx: TransactionContext) => Promise<T>): Promise<T> {
    return this.prisma.$transaction((tx) => work(tx));
  }
}
