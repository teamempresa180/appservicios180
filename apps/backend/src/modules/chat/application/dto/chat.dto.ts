import { ChatStatus } from '../../domain/value-objects/chat-status.value-object';
import { ChatType } from '../../domain/value-objects/chat-type.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class ChatDto {
  id!: string;
  orderId!: string;
  clientIdentityId!: string;
  providerId!: string;
  status!: ChatStatus;
  type!: ChatType;
  createdAt!: Date;
  updatedAt!: Date;
}
