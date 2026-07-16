import '../../../category/entities/category.dart';
import '../../../core/network/api_client.dart';
import 'category_http_mapper.dart';
import 'category_repository.dart';

/// [CategoryRepository] backed by [ApiClient] — calls
/// `GET /categories`, which returns the paginated shape
/// `{ items, total, page, pageSize }` (see `CategoryListResponseDto`
/// on the backend). This pilot only needs the first page's items;
/// pagination wiring for this feature is left for a future prompt.
class HttpCategoryRepository implements CategoryRepository {
  HttpCategoryRepository(this._apiClient);

  final ApiClient _apiClient;

  @override
  Future<List<Category>> getAll() async {
    final json = await _apiClient.get('/categories');
    final items = json['items'] as List<dynamic>;
    return items
        .map((item) => CategoryHttpMapper.fromJson(item as Map<String, dynamic>))
        .toList();
  }
}
