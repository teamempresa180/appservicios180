import '../../../category/entities/category.dart';
import '../../../order/entities/order.dart';
import '../../../order/models/order_status.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';

/// Presentation-only composition of everything an Order card needs.
/// Composes six real domain entities — [order], [service], [provider],
/// [profile], [category], [quote] — plus one field with no domain
/// equivalent yet:
///
/// - [estimatedArrival]: **fully simulated** — no domain concept of a
///   live arrival estimate exists (no tracking/logistics module).
///
/// Two fields the prompt asked for already have a real domain source
/// and are exposed as getters instead of being fabricated a second
/// time, following the same judgment call already documented in
/// `ProviderProfileData.experienceYears` and `QuoteData.subtotal`:
///
/// - [scheduledDate]: **real, not fabricated** — direct passthrough of
///   `Order.scheduledDate`.
/// - [price]: **real, not fabricated** — direct passthrough of
///   `Quote.proposedPrice`.
///
/// [statusText] is UI-derived from `Order.status` (a plain label, not a
/// stored field). The prompt also asked for a `statusColor` field, but
/// **no `Color` is stored here** — resolving a color from a status is
/// the Design System's job, not the model's. `OrderStatusBadge` maps
/// `Order.status` to `context.colors.*` directly, so every color still
/// comes from the app's neutral `ColorScheme` (see the feature README
/// for why this deviates from the prompt's literal field list).
///
/// Nothing here is added to the domain entities themselves.
class OrderDisplay {
  const OrderDisplay({
    required this.order,
    required this.service,
    required this.provider,
    required this.profile,
    required this.category,
    required this.quote,
    required this.estimatedArrival,
  });

  final Order order;
  final Service service;
  final Provider provider;
  final Profile profile;
  final Category category;
  final Quote quote;

  /// Simulated — see the class doc.
  final String estimatedArrival;

  String get providerName => profile.displayName;

  /// Real domain data (`Order.scheduledDate`) — see the class doc.
  DateTime get scheduledDate => order.scheduledDate;

  /// Real domain data (`Quote.proposedPrice`) — see the class doc.
  num get price => quote.proposedPrice;

  /// UI label derived from `Order.status` — see the class doc.
  String get statusText {
    switch (order.status) {
      case OrderStatus.pending:
        return 'Pendiente';
      case OrderStatus.accepted:
        return 'Aceptada';
      case OrderStatus.inProgress:
        return 'En progreso';
      case OrderStatus.completed:
        return 'Finalizada';
      case OrderStatus.cancelled:
        return 'Cancelada';
      case OrderStatus.rejected:
        return 'Rechazada';
    }
  }
}
