/**
 * Opaque marker for "the persistence client to use for this call,
 * inside an active transaction" — deliberately untyped (`unknown`) so
 * that domain-layer repository interfaces can accept an optional
 * transaction context without depending on Prisma (or any other ORM)
 * by name. Only the Infrastructure-layer Prisma repositories know
 * what's actually inside it (a `Prisma.TransactionClient`); everyone
 * else just forwards it unchanged from `TransactionRunner.run`.
 */
export type TransactionContext = unknown;
