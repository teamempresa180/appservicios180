-- AlterTable
ALTER TABLE `orders` ADD COLUMN `address_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `identities_document_number_idx` ON `identities`(`document_number`);

-- CreateIndex
CREATE INDEX `orders_address_id_idx` ON `orders`(`address_id`);

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

