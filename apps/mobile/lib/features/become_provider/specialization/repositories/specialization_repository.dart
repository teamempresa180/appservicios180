import '../../../../category/models/category_id.dart';
import '../models/specialization.dart';

/// Contract for reading the specializations available within a
/// `Category` (Paso 2 of the provider wizard, "Especialización").
///
/// Deliberately a single, minimal method — [HttpSpecializationRepository]
/// (backed by the real `GET /categories/:categoryId/specializations`
/// endpoint) and [MockSpecializationRepository] are both trivial
/// implementations of this same contract.
abstract class SpecializationRepository {
  Future<List<Specialization>> getByCategory(CategoryId categoryId);
}
