import '../../../service/entities/service.dart';
import '../../../service/models/service_id.dart';
import '../mock/mock_services_data.dart';
import 'service_repository.dart';

/// In-memory `ServiceRepository` backed by fixed mock data. No backend,
/// no persistence, no network — see the feature README.
class MockServiceRepository implements ServiceRepository {
  @override
  List<Service> getFeatured() => List.unmodifiable(mockServices);

  @override
  double ratingOf(ServiceId id) => mockServiceRatings[id.value] ?? 4.5;
}
