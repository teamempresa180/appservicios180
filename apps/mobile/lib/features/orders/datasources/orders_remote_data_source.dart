import '../../../category/entities/category.dart';
import '../../../order/entities/order.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';

/// Remote (API/Firebase) source for the domain entities the Orders
/// screen needs. No implementation — see `PROJECT_STATUS.md` (Sprint
/// 2, Etapa 6).
abstract class OrdersRemoteDataSource {
  Future<List<Order>> getOrders();
  Future<Service> getServiceFor(Order order);
  Future<Provider> getProviderFor(Order order);
  Future<Profile> getProfileFor(Order order);
  Future<Category> getCategoryFor(Order order);
  Future<Quote> getQuoteFor(Order order);
}
