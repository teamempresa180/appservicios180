import '../../../availability/entities/availability.dart';
import '../../../provider/entities/provider.dart';

/// Remote (API/Firebase) source for the domain entities the
/// Availability screen needs. No implementation — see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
abstract class AvailabilityRemoteDataSource {
  Future<Provider> getProvider();
  Future<List<Availability>> getAvailabilities();
}
