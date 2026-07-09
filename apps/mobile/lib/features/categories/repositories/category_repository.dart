import '../../../category/entities/category.dart';

/// Contract for reading `Category` data for the Categories feature.
/// Returns only `List<Category>` — no `Map`, no `dynamic`. Implemented
/// today by `MockCategoryRepository`; a future `ApiCategoryRepository`
/// or `FirebaseCategoryRepository` would implement this same interface
/// (see the feature README).
abstract class CategoryRepository {
  List<Category> getAll();
}
