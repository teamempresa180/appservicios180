import { ChatType } from '../../domain/value-objects/chat-type.value-object';

/**
 * Input shape for creating a Chat. No validation.
 */
export class CreateChatDto {
  orderId!: string;
  clientIdentityId!: string;
  providerId!: string;
  type!: ChatType;
}
