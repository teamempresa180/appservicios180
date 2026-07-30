import { Entity } from '../../../core/domain/base/entity.base';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { QuoteId } from '../value-objects/quote-id.value-object';
import { QuoteStatus } from '../value-objects/quote-status.value-object';
import { QuoteType } from '../value-objects/quote-type.value-object';

export interface QuoteProps {
  orderId: OrderId;
  providerId: ProviderId;
  proposedPrice: number;
  estimatedDuration: number;
  notes: string;
  status: QuoteStatus;
  type: QuoteType;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a quote a provider submits in response to an order.
 * Pure data holder — no payments, no invoices, no contracts, no chat, no
 * negotiation, no persistence, no business rules.
 */
export class Quote extends Entity<QuoteId> {
  public readonly orderId: OrderId;
  public readonly providerId: ProviderId;
  public readonly proposedPrice: number;
  public readonly estimatedDuration: number;
  public readonly notes: string;
  public readonly status: QuoteStatus;
  public readonly type: QuoteType;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: QuoteId, props: QuoteProps) {
    super(id);
    this.orderId = props.orderId;
    this.providerId = props.providerId;
    this.proposedPrice = props.proposedPrice;
    this.estimatedDuration = props.estimatedDuration;
    this.notes = props.notes;
    this.status = props.status;
    this.type = props.type;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Returns a new `Quote` with the same id, copying every current
   * property except those overridden. Used by use cases that
   * transition status or patch mutable fields without repeating the
   * full property list at each call site.
   */
  public with(overrides: Partial<QuoteProps>): Quote {
    return new Quote(this.id, {
      orderId: this.orderId,
      providerId: this.providerId,
      proposedPrice: this.proposedPrice,
      estimatedDuration: this.estimatedDuration,
      notes: this.notes,
      status: this.status,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      ...overrides,
    });
  }
}
