import '../../../service/entities/service.dart';

/// Local (on-device) source for `Service` data for the Search
/// feature. No implementation — see `PROJECT_STATUS.md` (Sprint 2,
/// Etapa 6).
abstract class SearchLocalDataSource {
  List<Service> getAll();
}
