import '../../../category/entities/category.dart';
import '../../../category/models/category_id.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/http_exceptions.dart';
import '../../categories/repositories/category_http_mapper.dart';
import 'category_repository.dart';

/// [CategoryRepository] (Marketplace's own, distinct from
/// `features/categories`' `CategoryRepository`) backed by [ApiClient].
/// Named `HttpMarketplaceCategoryRepository` — not `HttpCategoryRepository`
/// — to avoid a class-name collision with
/// `features/categories/repositories/http_category_repository.dart`'s
/// `HttpCategoryRepository`, since both are imported side by side once
/// DI wiring is centralized.
class HttpMarketplaceCategoryRepository implements CategoryRepository {
  HttpMarketplaceCategoryRepository(this._apiClient);

  final ApiClient _apiClient;

  @override
  Future<List<Category>> getAll() async {
    final json = await _apiClient.get('/categories');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items.map(CategoryHttpMapper.fromJson).toList();
  }

  @override
  Future<Category?> getById(CategoryId id) async {
    try {
      final json = await _apiClient.get('/categories/${id.value}');
      return CategoryHttpMapper.fromJson(json);
    } on NotFoundHttpException {
      return null;
    }
  }
}
