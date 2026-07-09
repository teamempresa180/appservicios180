import '../../../service/entities/service.dart';
import '../mock/mock_search_data.dart';
import 'search_repository.dart';

/// In-memory `SearchRepository` backed by fixed mock data. No backend,
/// no persistence, no network, no real search — see the feature README.
class MockSearchRepository implements SearchRepository {
  @override
  List<Service> getAll() => List.unmodifiable(mockSearchServices);
}
