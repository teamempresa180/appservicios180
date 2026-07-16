import '../../../category/entities/category.dart';

/// Contract for reading `Category` data for the Categories feature.
/// Returns only `List<Category>` — no `Map`, no `dynamic`. Implemented
/// today by `HttpCategoryRepository` (real backend) and
/// `MockCategoryRepository` (kept for tests/offline fallback, see the
/// feature README).
abstract class CategoryRepository {
  Future<List<Category>> getAll();
}
