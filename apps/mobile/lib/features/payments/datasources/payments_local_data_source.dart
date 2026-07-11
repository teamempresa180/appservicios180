import '../../../order/entities/order.dart';
import '../../../payment/entities/payment.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../quote/entities/quote.dart';
import '../../../service/entities/service.dart';

/// Local (on-device) source for the domain entities the Payments
/// screen needs. No implementation — see `PROJECT_STATUS.md` (Sprint
/// 2, Etapa 6).
abstract class PaymentsLocalDataSource {
  Payment getPayment();
  Order getOrder();
  Quote getQuote();
  Service getService();
  Provider getProvider();
  Profile getProfile();
}
