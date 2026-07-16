import '../../../service/entities/service.dart';

/// Contract for reading `Service` data for the Search feature. Returns
/// only `List<Service>` — no `Map`, no `dynamic`. Implemented today by
/// `MockSearchRepository`; a future `ApiSearchRepository` or
/// `FirebaseSearchRepository` would implement this same interface (see
/// the feature README).
abstract class SearchRepository {
  Future<List<Service>> getAll();
}
