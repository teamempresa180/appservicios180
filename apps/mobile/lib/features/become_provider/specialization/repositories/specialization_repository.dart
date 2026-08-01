import '../../../../category/models/category_id.dart';
import '../models/specialization.dart';

/// Contract for reading the specializations available within a
/// `Category` (Paso 2 of the provider wizard, "Especialización").
///
/// Deliberately a single, minimal method so a real
/// `HttpSpecializationRepository` — backed by the real
/// `GET /categories/:categoryId/specializations` endpoint another
/// backend effort is adding in parallel — is a trivial drop-in
/// replacement for [MockSpecializationRepository], the only
/// implementation that exists today.
abstract class SpecializationRepository {
  Future<List<Specialization>> getByCategory(CategoryId categoryId);
}
