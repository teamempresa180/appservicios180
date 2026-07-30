-- CreateTable
CREATE TABLE `identities` (
    `id` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `document_type` ENUM('NATIONAL_ID', 'PASSPORT', 'FOREIGN_ID', 'TAX_ID', 'OTHER') NOT NULL,
    `document_number` VARCHAR(191) NOT NULL,
    `birth_date` DATETIME(3) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'ARCHIVED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `authentications` (
    `id` VARCHAR(191) NOT NULL,
    `identity_id` VARCHAR(191) NOT NULL,
    `method_type` ENUM('PASSWORD', 'BIOMETRIC', 'ONE_TIME_CODE', 'THIRD_PARTY', 'OTHER') NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'LOCKED', 'REVOKED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `authentications_identity_id_idx`(`identity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credentials` (
    `id` VARCHAR(191) NOT NULL,
    `identity_id` VARCHAR(191) NOT NULL,
    `type` ENUM('PASSWORD', 'RECOVERY_CODE', 'SECURITY_KEY', 'OTHER') NOT NULL,
    `status` ENUM('ACTIVE', 'EXPIRED', 'REVOKED') NOT NULL,
    `password_hash` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `credentials_identity_id_idx`(`identity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` VARCHAR(191) NOT NULL,
    `identity_id` VARCHAR(191) NOT NULL,
    `token_hash` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `revoked_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,

    INDEX `refresh_tokens_identity_id_idx`(`identity_id`),
    INDEX `refresh_tokens_token_hash_idx`(`token_hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `id` VARCHAR(191) NOT NULL,
    `identity_id` VARCHAR(191) NOT NULL,
    `display_name` VARCHAR(191) NOT NULL,
    `avatar_url` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `visibility` ENUM('PUBLIC', 'PRIVATE', 'CONTACTS_ONLY') NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `profiles_identity_id_idx`(`identity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacts` (
    `id` VARCHAR(191) NOT NULL,
    `identity_id` VARCHAR(191) NOT NULL,
    `type` ENUM('EMAIL', 'PHONE', 'OTHER') NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `contacts_identity_id_idx`(`identity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addresses` (
    `id` VARCHAR(191) NOT NULL,
    `identity_id` VARCHAR(191) NOT NULL,
    `alias` VARCHAR(191) NOT NULL,
    `full_address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `postal_code` VARCHAR(191) NOT NULL,
    `type` ENUM('HOME', 'WORK', 'BILLING', 'SERVICE', 'EMERGENCY', 'OTHER') NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `addresses_identity_id_idx`(`identity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verifications` (
    `id` VARCHAR(191) NOT NULL,
    `identity_id` VARCHAR(191) NOT NULL,
    `type` ENUM('DOCUMENT', 'FACIAL', 'ADDRESS', 'PHONE', 'EMAIL', 'OTHER', 'CRIMINAL_RECORD', 'CERTIFICATION') NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED') NOT NULL,
    `verified_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `document_path` VARCHAR(191) NULL,

    INDEX `verifications_identity_id_idx`(`identity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trust_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `identity_id` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `level` ENUM('LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH') NOT NULL,
    `status` ENUM('ACTIVE', 'SUSPENDED', 'ARCHIVED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `trust_profiles_identity_id_key`(`identity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_records` (
    `id` VARCHAR(191) NOT NULL,
    `identity_id` VARCHAR(191) NOT NULL,
    `action_type` ENUM('CREATED', 'UPDATED', 'DELETED', 'ACCESSED', 'LOGGED_IN', 'LOGGED_OUT', 'OTHER') NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `occurred_at` DATETIME(3) NOT NULL,

    INDEX `audit_records_identity_id_idx`(`identity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED') NOT NULL,
    `type` ENUM('STANDARD', 'PREMIUM', 'SEASONAL', 'OTHER') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `services` (
    `id` VARCHAR(191) NOT NULL,
    `provider_id` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `base_price` DOUBLE NOT NULL,
    `estimated_duration` INTEGER NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED') NOT NULL,
    `type` ENUM('STANDARD', 'EXPRESS', 'CUSTOM', 'OTHER') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `services_provider_id_idx`(`provider_id`),
    INDEX `services_category_id_idx`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `providers` (
    `id` VARCHAR(191) NOT NULL,
    `identity_id` VARCHAR(191) NOT NULL,
    `provider_profile_id` VARCHAR(191) NOT NULL,
    `category_id` VARCHAR(191) NULL,
    `specialization` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'IN_REVIEW', 'ACTIVE', 'REJECTED', 'INACTIVE', 'SUSPENDED', 'BLOCKED', 'ARCHIVED') NOT NULL,
    `type` ENUM('INDEPENDENT', 'FREELANCER', 'COMPANY', 'OTHER') NOT NULL,
    `experience` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') NOT NULL,
    `biography` VARCHAR(191) NOT NULL,
    `years_of_experience` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `providers_identity_id_key`(`identity_id`),
    INDEX `providers_provider_profile_id_idx`(`provider_profile_id`),
    INDEX `providers_category_id_idx`(`category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availabilities` (
    `id` VARCHAR(191) NOT NULL,
    `provider_id` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') NOT NULL,
    `type` ENUM('FULL_TIME', 'PART_TIME', 'ON_DEMAND', 'SEASONAL', 'OTHER') NOT NULL,
    `available_from` DATETIME(3) NOT NULL,
    `available_to` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `availabilities_provider_id_idx`(`provider_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedules` (
    `id` VARCHAR(191) NOT NULL,
    `provider_id` VARCHAR(191) NOT NULL,
    `start_date_time` DATETIME(3) NOT NULL,
    `end_date_time` DATETIME(3) NOT NULL,
    `status` ENUM('OPEN', 'BLOCKED', 'CANCELLED', 'COMPLETED') NOT NULL,
    `type` ENUM('REGULAR', 'BLOCKED', 'SPECIAL', 'OTHER') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `schedules_provider_id_idx`(`provider_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` VARCHAR(191) NOT NULL,
    `identity_id` VARCHAR(191) NOT NULL,
    `provider_id` VARCHAR(191) NULL,
    `service_id` VARCHAR(191) NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `scheduled_date` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED') NOT NULL,
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `orders_identity_id_idx`(`identity_id`),
    INDEX `orders_category_id_idx`(`category_id`),
    INDEX `orders_provider_id_idx`(`provider_id`),
    INDEX `orders_service_id_idx`(`service_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quotes` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `provider_id` VARCHAR(191) NOT NULL,
    `proposed_price` DOUBLE NOT NULL,
    `estimated_duration` INTEGER NOT NULL,
    `notes` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'WITHDRAWN') NOT NULL,
    `type` ENUM('STANDARD', 'DETAILED', 'ESTIMATE', 'OTHER') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `quotes_order_id_idx`(`order_id`),
    INDEX `quotes_provider_id_idx`(`provider_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` VARCHAR(191) NOT NULL,
    `quote_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `payer_identity_id` VARCHAR(191) NOT NULL,
    `receiver_provider_id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `method` ENUM('CARD', 'BANK_TRANSFER', 'CASH', 'DIGITAL_WALLET', 'OTHER') NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `payments_quote_id_idx`(`quote_id`),
    INDEX `payments_order_id_idx`(`order_id`),
    INDEX `payments_payer_identity_id_idx`(`payer_identity_id`),
    INDEX `payments_receiver_provider_id_idx`(`receiver_provider_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `provider_id` VARCHAR(191) NOT NULL,
    `reviewer_identity_id` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `comment` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'PUBLISHED', 'HIDDEN', 'ARCHIVED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `reviews_order_id_idx`(`order_id`),
    INDEX `reviews_provider_id_idx`(`provider_id`),
    INDEX `reviews_reviewer_identity_id_idx`(`reviewer_identity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chats` (
    `id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `client_identity_id` VARCHAR(191) NOT NULL,
    `provider_id` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'ARCHIVED', 'CLOSED') NOT NULL,
    `type` ENUM('ORDER_RELATED', 'SUPPORT', 'OTHER') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `chats_order_id_idx`(`order_id`),
    INDEX `chats_client_identity_id_idx`(`client_identity_id`),
    INDEX `chats_provider_id_idx`(`provider_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` VARCHAR(191) NOT NULL,
    `chat_id` VARCHAR(191) NOT NULL,
    `sender_identity_id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `type` ENUM('TEXT', 'SYSTEM', 'OTHER') NOT NULL,
    `status` ENUM('SENT', 'DELIVERED', 'READ') NOT NULL,
    `sent_at` DATETIME(3) NOT NULL,
    `read_at` DATETIME(3) NULL,

    INDEX `messages_chat_id_idx`(`chat_id`),
    INDEX `messages_sender_identity_id_idx`(`sender_identity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `identity_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `type` ENUM('SYSTEM', 'INFO', 'WARNING', 'ALERT', 'OTHER') NOT NULL,
    `status` ENUM('UNREAD', 'READ', 'ARCHIVED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `read_at` DATETIME(3) NULL,

    INDEX `notifications_identity_id_idx`(`identity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attachments` (
    `id` VARCHAR(191) NOT NULL,
    `message_id` VARCHAR(191) NOT NULL,
    `file_name` VARCHAR(191) NOT NULL,
    `mime_type` VARCHAR(191) NOT NULL,
    `file_size` INTEGER NOT NULL,
    `type` ENUM('IMAGE', 'DOCUMENT', 'AUDIO', 'VIDEO', 'OTHER') NOT NULL,
    `status` ENUM('PENDING', 'AVAILABLE', 'FAILED', 'REMOVED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    INDEX `attachments_message_id_idx`(`message_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `authentications` ADD CONSTRAINT `authentications_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `credentials` ADD CONSTRAINT `credentials_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `verifications` ADD CONSTRAINT `verifications_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trust_profiles` ADD CONSTRAINT `trust_profiles_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_records` ADD CONSTRAINT `audit_records_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `services` ADD CONSTRAINT `services_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `services` ADD CONSTRAINT `services_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `providers` ADD CONSTRAINT `providers_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `providers` ADD CONSTRAINT `providers_provider_profile_id_fkey` FOREIGN KEY (`provider_profile_id`) REFERENCES `profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `providers` ADD CONSTRAINT `providers_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `availabilities` ADD CONSTRAINT `availabilities_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotes` ADD CONSTRAINT `quotes_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_quote_id_fkey` FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_payer_identity_id_fkey` FOREIGN KEY (`payer_identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_receiver_provider_id_fkey` FOREIGN KEY (`receiver_provider_id`) REFERENCES `providers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_reviewer_identity_id_fkey` FOREIGN KEY (`reviewer_identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chats` ADD CONSTRAINT `chats_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chats` ADD CONSTRAINT `chats_client_identity_id_fkey` FOREIGN KEY (`client_identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chats` ADD CONSTRAINT `chats_provider_id_fkey` FOREIGN KEY (`provider_id`) REFERENCES `providers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_identity_id_fkey` FOREIGN KEY (`sender_identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_identity_id_fkey` FOREIGN KEY (`identity_id`) REFERENCES `identities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attachments` ADD CONSTRAINT `attachments_message_id_fkey` FOREIGN KEY (`message_id`) REFERENCES `messages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

