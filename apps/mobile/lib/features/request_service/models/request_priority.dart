import '../../../order/models/order_priority.dart';

/// Priority level for a service request. Presentation-only label — see
/// [asOrderPriority] for how it maps onto the real `Order.priority`
/// once a request is submitted.
enum RequestPriority {
  low,
  normal,
  high;

  String get label {
    switch (this) {
      case RequestPriority.low:
        return 'Baja';
      case RequestPriority.normal:
        return 'Normal';
      case RequestPriority.high:
        return 'Alta';
    }
  }

  /// Maps onto the real `OrderPriority` domain enum — [normal] becomes
  /// [OrderPriority.medium] (this feature has no `urgent` option).
  OrderPriority get asOrderPriority {
    switch (this) {
      case RequestPriority.low:
        return OrderPriority.low;
      case RequestPriority.normal:
        return OrderPriority.medium;
      case RequestPriority.high:
        return OrderPriority.high;
    }
  }
}
