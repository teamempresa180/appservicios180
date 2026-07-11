import '../../../category/entities/category.dart';

/// Remote (API/Firebase) source for `Category` data for the
/// Categories feature. No implementation — see `PROJECT_STATUS.md`
/// (Sprint 2, Etapa 6).
abstract class CategoryRemoteDataSource {
  Future<List<Category>> getAll();
}
