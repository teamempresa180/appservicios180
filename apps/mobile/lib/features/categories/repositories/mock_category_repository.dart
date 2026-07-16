import '../../../category/entities/category.dart';
import '../mock/mock_categories_data.dart';
import 'category_repository.dart';

/// In-memory `CategoryRepository` backed by fixed mock data. No backend,
/// no persistence, no network — see the feature README.
class MockCategoryRepository implements CategoryRepository {
  @override
  Future<List<Category>> getAll() =>
      Future.value(List.unmodifiable(mockCategories));
}
