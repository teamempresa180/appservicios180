import '../../../category/entities/category.dart';
import '../../../category/models/category_id.dart';

/// Contract for reading `Category` data for the Marketplace. Implemented
/// today by `MockCategoryRepository`; a future `ApiCategoryRepository`
/// or `FirebaseCategoryRepository` would implement this same interface
/// (see the feature README).
abstract class CategoryRepository {
  Future<List<Category>> getAll();
  Future<Category?> getById(CategoryId id);
}
