import '../../core/base/entity.dart';
import '../../order/models/order_id.dart';
import '../../provider/models/provider_id.dart';
import '../models/quote_id.dart';
import '../models/quote_status.dart';
import '../models/quote_type.dart';

/// Represents a quote a provider submits in response to an order.
/// Pure data holder — no payments, no invoices, no contracts, no chat, no
/// negotiation, no persistence, no business rules.
class Quote extends Entity<QuoteId> {
  const Quote({
    required QuoteId id,
    required this.orderId,
    required this.providerId,
    required this.proposedPrice,
    required this.estimatedDuration,
    required this.notes,
    required this.status,
    required this.type,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final OrderId orderId;
  final ProviderId providerId;
  final num proposedPrice;
  final int estimatedDuration;
  final String notes;
  final QuoteStatus status;
  final QuoteType type;
  final DateTime createdAt;
  final DateTime updatedAt;
}
