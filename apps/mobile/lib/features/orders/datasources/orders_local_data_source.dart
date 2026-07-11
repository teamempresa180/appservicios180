import '../../../category/entities/category.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';

/// Local (on-device) source for the domain entities the Orders screen
/// needs. No implementation — see `PROJECT_STATUS.md` (Sprint 2,
/// Etapa 6).
abstract class OrdersLocalDataSource {
  List<Order> getOrders();
  Service getServiceFor(Order order);
  Provider getProviderFor(Order order);
  Profile getProfileFor(Order order);
  Category getCategoryFor(Order order);
  Quote getQuoteFor(Order order);
}
