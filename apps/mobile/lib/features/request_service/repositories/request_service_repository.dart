import '../../../address/entities/address.dart';
import '../../../category/models/category_id.dart';
import '../../../order/entities/order.dart';
import '../../../provider/models/provider_id.dart';
import '../../../service/models/service_id.dart';
import '../models/request_priority.dart';

/// Contract for creating a real `Order` from the Request Service
/// screen, and for reading the one supporting entity this screen still
/// needs a real value for ([getAddress]) — every other piece of context
/// (category/provider/service) is now supplied by whoever navigated
/// here (`ProviderProfilePage`'s "Solicitar servicio"/"Publicar
/// solicitud abierta" actions, or the Marketplace's compatible-
/// providers flow), not fetched blindly.
abstract class RequestServiceRepository {
  /// Arbitrary-but-documented pick of the client's first `Address` — see
  /// `HttpRequestServiceRepository`'s own doc comment for why there's no
  /// better real relation to resolve instead yet.
  Future<Address> getAddress();

  /// Submits the request as a real `Order` (`POST /orders` on the real
  /// backend) — this is the action "Continuar" performs.
  ///
  /// [providerId]/[serviceId] are **both provided together** for a
  /// direct hire, or **both omitted** for an open request — mirroring
  /// `Order`'s own nullable-together `providerId`/`serviceId` (see its
  /// class doc).
  Future<Order> createOrder({
    required CategoryId categoryId,
    ProviderId? providerId,
    ServiceId? serviceId,
    required String title,
    required String description,
    required DateTime scheduledDate,
    required RequestPriority priority,
  });
}
