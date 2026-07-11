import '../../../service/entities/service.dart';

/// Remote (API/search backend) source for `Service` data for the
/// Search feature — where a real query/full-text-search endpoint
/// would eventually live. No implementation — see
/// `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
abstract class SearchRemoteDataSource {
  Future<List<Service>> getAll();
}
