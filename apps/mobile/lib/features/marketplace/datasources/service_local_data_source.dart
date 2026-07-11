import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';

/// Local (on-device) source for `Service` data for the Marketplace.
/// No implementation — see `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
abstract class ServiceLocalDataSource {
  List<Service> getFeatured();
  double ratingOf(ServiceId id);
}
