import '../../core/base/entity.dart';
import '../../quote/models/quote_id.dart';
import '../../order/models/order_id.dart';
import '../../identity/models/identity_id.dart';
import '../../provider/models/provider_id.dart';
import '../models/payment_id.dart';
import '../models/payment_method.dart';
import '../models/payment_status.dart';

/// Represents the record of a payment associated with an accepted quote.
/// Pure data holder — no payment gateways, no bank transactions, no
/// invoicing, no refunds, no reconciliation, no persistence, no business rules.
class Payment extends Entity<PaymentId> {
  const Payment({
    required PaymentId id,
    required this.quoteId,
    required this.orderId,
    required this.payerIdentityId,
    required this.receiverProviderId,
    required this.amount,
    required this.method,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  }) : super(id);

  final QuoteId quoteId;
  final OrderId orderId;
  final IdentityId payerIdentityId;
  final ProviderId receiverProviderId;
  final num amount;
  final PaymentMethod method;
  final PaymentStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;
}
