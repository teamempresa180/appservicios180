-- Promotes the existing `identities.document_number` index to a UNIQUE
-- constraint (Etapa 18, Security Hardening).
--
-- `document_number` is the login identifier — `LoginUseCase` resolves
-- an account with `findByDocumentNumber` alone. Without uniqueness a
-- second registration reusing an existing document number creates a
-- second row, and which of the two rows login resolves to is left to
-- the database's row order: an attacker who knows a victim's document
-- number can register a shadow account and make login ambiguous.
-- `CreateIdentityUseCase` rejects duplicates at the application level;
-- this constraint closes the concurrency window that check cannot (two
-- simultaneous registrations both passing the lookup before either
-- writes).
--
-- Replaces the plain index created in `20260731000000_order_address` —
-- a UNIQUE index serves the same `WHERE document_number = ?` lookup, so
-- no query loses its index.
--
-- NOTE: this migration fails if the target database already contains
-- rows sharing a `document_number`. That is intentional: such rows are
-- exactly the ambiguity described above and must be reconciled by hand
-- before the constraint can be applied. The committed seed
-- (`prisma/seed.ts`) creates a single Identity, so a freshly seeded or
-- development database applies this cleanly.

-- DropIndex
DROP INDEX `identities_document_number_idx` ON `identities`;

-- CreateIndex
CREATE UNIQUE INDEX `identities_document_number_key` ON `identities`(`document_number`);
