-- AlterTable
ALTER TABLE `addresses` ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL;

-- AlterTable
ALTER TABLE `providers` DROP COLUMN `specialization`,
    ADD COLUMN `specialization_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `category_specializations` (
    `id` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `category_specializations_category_id_idx`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `category_specializations` ADD CONSTRAINT `category_specializations_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `providers` ADD CONSTRAINT `providers_specialization_id_fkey` FOREIGN KEY (`specialization_id`) REFERENCES `category_specializations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

