import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../service/entities/service.dart';
import 'search_repository.dart';

/// [SearchRepository] backed by [ApiClient] — calls `GET /services`,
/// which returns the paginated shape `{ items, total, page, pageSize }`.
/// This pilot only needs the first page's items; pagination and real
/// free-text search wiring for this feature is left for a future
/// prompt (see the feature README).
class HttpSearchRepository implements SearchRepository {
  HttpSearchRepository(this._apiClient);

  final ApiClient _apiClient;

  @override
  Future<List<Service>> getAll() async {
    final json = await _apiClient.get('/services');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items.map(ServiceHttpMapper.fromJson).toList();
  }
}
