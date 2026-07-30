-- CreateEnum
CREATE TYPE "chat_status" AS ENUM ('ACTIVE', 'ARCHIVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "chat_type" AS ENUM ('ORDER_RELATED', 'SUPPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "message_status" AS ENUM ('SENT', 'DELIVERED', 'READ');

-- CreateEnum
CREATE TYPE "message_type" AS ENUM ('TEXT', 'SYSTEM', 'OTHER');

-- CreateEnum
CREATE TYPE "notification_status" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('SYSTEM', 'INFO', 'WARNING', 'ALERT', 'OTHER');

-- CreateEnum
CREATE TYPE "attachment_status" AS ENUM ('PENDING', 'AVAILABLE', 'FAILED', 'REMOVED');

-- CreateEnum
CREATE TYPE "attachment_type" AS ENUM ('IMAGE', 'DOCUMENT', 'AUDIO', 'VIDEO', 'OTHER');

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "client_identity_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "status" "chat_status" NOT NULL,
    "type" "chat_type" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "sender_identity_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "message_type" NOT NULL,
    "status" "message_status" NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "identity_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "notification_type" NOT NULL,
    "status" "notification_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "type" "attachment_type" NOT NULL,
    "status" "attachment_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chats_order_id_idx" ON "chats"("order_id");

-- CreateIndex
CREATE INDEX "chats_client_identity_id_idx" ON "chats"("client_identity_id");

-- CreateIndex
CREATE INDEX "chats_provider_id_idx" ON "chats"("provider_id");

-- CreateIndex
CREATE INDEX "messages_chat_id_idx" ON "messages"("chat_id");

-- CreateIndex
CREATE INDEX "messages_sender_identity_id_idx" ON "messages"("sender_identity_id");

-- CreateIndex
CREATE INDEX "notifications_identity_id_idx" ON "notifications"("identity_id");

-- CreateIndex
CREATE INDEX "attachments_message_id_idx" ON "attachments"("message_id");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_client_identity_id_fkey" FOREIGN KEY ("client_identity_id") REFERENCES "identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_identity_id_fkey" FOREIGN KEY ("sender_identity_id") REFERENCES "identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "identities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
