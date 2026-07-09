import { Entity } from '../../../core/domain/base/entity.base';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ChatId } from '../value-objects/chat-id.value-object';
import { ChatStatus } from '../value-objects/chat-status.value-object';
import { ChatType } from '../value-objects/chat-type.value-object';

export interface ChatProps {
  orderId: OrderId;
  clientIdentityId: IdentityId;
  providerId: ProviderId;
  status: ChatStatus;
  type: ChatType;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a conversation between a client and a provider tied to an
 * order. Pure data holder — no messages, no attachments, no real-time
 * transport, no AI, no persistence, no business rules.
 */
export class Chat extends Entity<ChatId> {
  public readonly orderId: OrderId;
  public readonly clientIdentityId: IdentityId;
  public readonly providerId: ProviderId;
  public readonly status: ChatStatus;
  public readonly type: ChatType;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: ChatId, props: ChatProps) {
    super(id);
    this.orderId = props.orderId;
    this.clientIdentityId = props.clientIdentityId;
    this.providerId = props.providerId;
    this.status = props.status;
    this.type = props.type;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
