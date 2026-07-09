import 'package:collection/collection.dart';

import '../../../category/entities/category.dart';
import '../../../category/models/category_id.dart';
import '../mock/mock_categories_data.dart';
import 'category_repository.dart';

/// In-memory `CategoryRepository` backed by fixed mock data. No backend,
/// no persistence, no network — see the feature README.
class MockCategoryRepository implements CategoryRepository {
  @override
  List<Category> getAll() => List.unmodifiable(mockCategories);

  @override
  Category? getById(CategoryId id) =>
      mockCategories.firstWhereOrNull((category) => category.id == id);
}
