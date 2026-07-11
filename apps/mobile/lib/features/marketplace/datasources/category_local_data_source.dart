import '../../../category/entities/category.dart';
import '../../../category/models/category_id.dart';

/// Local (on-device) source for `Category` data for the Marketplace.
/// No implementation — see `PROJECT_STATUS.md` (Sprint 2, Etapa 6).
abstract class CategoryLocalDataSource {
  List<Category> getAll();
  Category? getById(CategoryId id);
}
