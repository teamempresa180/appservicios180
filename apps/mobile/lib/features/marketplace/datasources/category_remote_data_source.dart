import '../../../category/entities/category.dart';
import '../../../category/models/category_id.dart';

/// Remote (API/Firebase) source for `Category` data for the
/// Marketplace. No implementation — see `PROJECT_STATUS.md` (Sprint 2,
/// Etapa 6).
abstract class CategoryRemoteDataSource {
  Future<List<Category>> getAll();
  Future<Category?> getById(CategoryId id);
}
