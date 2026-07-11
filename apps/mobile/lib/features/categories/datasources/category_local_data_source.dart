import '../../../category/entities/category.dart';

/// Local (on-device) source for `Category` data for the Categories
/// feature. No implementation — see `PROJECT_STATUS.md` (Sprint 2,
/// Etapa 6).
abstract class CategoryLocalDataSource {
  List<Category> getAll();
}
