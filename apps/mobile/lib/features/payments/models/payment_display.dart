import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../payment/models/payment_method.dart';
import '../../../payment/models/payment_status.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';

/// Human label for a real `PaymentMethod` value — UI concern, not a
/// domain field. Kept here (not in `payment/models/`) since the domain
/// module deliberately stays free of presentation strings.
extension PaymentMethodLabel on PaymentMethod {
  String get label {
    switch (this) {
      case PaymentMethod.card:
        return 'Tarjeta';
      case PaymentMethod.bankTransfer:
        return 'Transferencia bancaria';
      case PaymentMethod.cash:
        return 'Efectivo';
      case PaymentMethod.digitalWallet:
        return 'Billetera digital';
      case PaymentMethod.other:
        return 'Otro';
    }
  }
}

/// Presentation-only composition of everything a Payments screen needs.
/// Composes six real domain entities — [payment], [order], [quote],
/// [service], [provider], [profile] — plus two fields with no domain
/// equivalent yet:
///
/// - [paymentReference]: **fully simulated** — no domain concept of a
///   gateway/transaction reference exists (`Payment` is a pure record,
///   no gateway integration per its own class doc).
/// - [receiptNumber]: **fully simulated** — no receipt/invoicing module
///   exists yet.
///
/// Three fields the prompt asked for already have a real domain source
/// and are exposed as getters instead of being fabricated a second
/// time, following the same judgment call already documented in
/// `ProviderProfileData.experienceYears`, `QuoteData.subtotal` and
/// `OrderDisplay.scheduledDate`:
///
/// - [paymentMethod]: **real, not fabricated** — direct passthrough of
///   `Payment.method` (as the real `PaymentMethod` enum; `.label` above
///   is the only presentation addition, a plain string).
/// - [paymentDate]: **real, not fabricated** — direct passthrough of
///   `Payment.createdAt`. The prompt itself allowed "real o derivada"
///   for this one.
/// - [total]: **real, not fabricated** — direct passthrough of
///   `Payment.amount`. Unlike `Quote`, `Payment` models a single
///   `amount` with no subtotal/fee/tax line items, so there is nothing
///   to derive a breakdown from — `PaymentBreakdown` only presents this
///   one real number.
///
/// [statusText] is UI-derived from `Payment.status` (a plain label, not
/// a stored field) — same approach as `OrderDisplay.statusText`, and
/// for the same reason no `Color` is stored here either (see
/// `PaymentStatusBadge`, which resolves color from `context.colors.*`).
///
/// Nothing here is added to the domain entities themselves.
class PaymentDisplay {
  const PaymentDisplay({
    required this.payment,
    required this.order,
    required this.quote,
    required this.service,
    required this.provider,
    required this.profile,
    required this.paymentReference,
    required this.receiptNumber,
  });

  final Payment payment;
  final Order order;
  final Quote quote;
  final Service service;
  final Provider provider;
  final Profile profile;

  /// Simulated — see the class doc.
  final String paymentReference;

  /// Simulated — see the class doc.
  final String receiptNumber;

  String get providerName => profile.displayName;

  /// Real domain data (`Payment.method`) — see the class doc.
  PaymentMethod get paymentMethod => payment.method;

  /// Real domain data (`Payment.createdAt`) — see the class doc.
  DateTime get paymentDate => payment.createdAt;

  /// Real domain data (`Payment.amount`) — see the class doc.
  num get total => payment.amount;

  /// UI label derived from `Payment.status` — see the class doc.
  String get statusText {
    switch (payment.status) {
      case PaymentStatus.pending:
        return 'Pendiente';
      case PaymentStatus.completed:
        return 'Completado';
      case PaymentStatus.failed:
        return 'Fallido';
      case PaymentStatus.cancelled:
        return 'Cancelado';
    }
  }
}
