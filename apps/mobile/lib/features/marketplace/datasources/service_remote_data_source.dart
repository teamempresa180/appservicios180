import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';

/// Remote (API/Firebase) source for `Service` data for the
/// Marketplace. No implementation — see `PROJECT_STATUS.md` (Sprint 2,
/// Etapa 6).
abstract class ServiceRemoteDataSource {
  Future<List<Service>> getFeatured();
  Future<double> ratingOf(ServiceId id);
}
