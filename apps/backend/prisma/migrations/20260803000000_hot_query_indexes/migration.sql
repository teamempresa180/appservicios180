-- Composite indexes for the three hottest filtered+sorted queries.
-- Additive only: no column, table or constraint is touched, so this
-- migration is safe to apply to the live database while it serves
-- traffic.

-- `PrismaOrderRepository.findOpenByCategoryId` — the open-request feed
-- every Provider polls:
--   WHERE category_id = ? AND provider_id IS NULL AND status = ?
--   ORDER BY created_at DESC
-- CreateIndex
CREATE INDEX `orders_category_id_status_provider_id_created_at_idx` ON `orders`(`category_id`, `status`, `provider_id`, `created_at`);

-- `PrismaOrderRepository.findByIdentityId` / `findByProviderId` — the
-- "my orders" feeds, both newest-first.
-- CreateIndex
CREATE INDEX `orders_identity_id_created_at_idx` ON `orders`(`identity_id`, `created_at`);

-- CreateIndex
CREATE INDEX `orders_provider_id_created_at_idx` ON `orders`(`provider_id`, `created_at`);

-- `PrismaProviderRepository.findCompatible` — provider matching behind
-- category browse:
--   WHERE category_id = ? AND status = ? [AND specialization_id = ?]
--   ORDER BY created_at DESC
-- CreateIndex
CREATE INDEX `providers_category_id_status_specialization_id_created_at_idx` ON `providers`(`category_id`, `status`, `specialization_id`, `created_at`);
