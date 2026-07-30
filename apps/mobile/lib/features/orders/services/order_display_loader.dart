import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';
import '../mock/mock_orders_data.dart';
import '../models/order_display.dart';
import '../repositories/orders_repository.dart';

/// Shared "build the `OrderDisplay` for one `Order`" helper — both the
/// Orders list (`OrdersViewModel`, one per order) and Home's "most
/// important active order" card (`ClientHomeOrdersViewModel`, just the
/// one) need the exact same composition, so this is the one place that
/// degrades [OrdersRepository.getServiceFor]/[getProviderFor]/
/// [getQuoteFor]'s `StateError` (open request / no `Quote` yet) to
/// `null` instead of duplicating that judgment call in two view models.
abstract final class OrderDisplayLoader {
  static Future<OrderDisplay> load(
    Order order,
    OrdersRepository repository,
  ) async {
    final category = await repository.getCategoryFor(order);
    final service = await _orNull<Service>(() => repository.getServiceFor(order));
    final provider = await _orNull<Provider>(
      () => repository.getProviderFor(order),
    );
    final profile = await _orNull<Profile>(
      () => repository.getProfileFor(order),
    );
    final quote = await _orNull<Quote>(() => repository.getQuoteFor(order));
    return OrderDisplay(
      order: order,
      service: service,
      provider: provider,
      profile: profile,
      category: category,
      quote: quote,
      estimatedArrival: mockOrderEstimatedArrival[order.id] ?? '—',
    );
  }

  static Future<T?> _orNull<T>(Future<T> Function() call) async {
    try {
      return await call();
    } on StateError {
      return null;
    }
  }
}
