import '../../../../category/models/category_id.dart';
import '../models/specialization.dart';
import 'specialization_repository.dart';

/// In-memory `SpecializationRepository` — no backend, no persistence,
/// no network. Temporary: the real specialization concept (and its
/// `GET /categories/:categoryId/specializations` endpoint) is being
/// built by a parallel backend effort; this exists only so Paso 2 of
/// the provider wizard has real, swappable data to show today.
///
/// Keyed by the category id values `MockCategoryRepository` actually
/// uses (see `features/categories/mock/mock_categories_data.dart`), so
/// this pairs correctly with the mock backend end to end. Falls back
/// to a small generic list for any category id it doesn't recognize
/// (e.g. when the app is wired to the real `HttpCategoryRepository`,
/// whose category ids are real UUIDs) — the picker never comes up
/// empty while this mock is still in place.
class MockSpecializationRepository implements SpecializationRepository {
  static final Map<String, List<Specialization>> _byCategoryId = {
    'categories-plumbing': const [
      Specialization(id: 'spec-plumbing-residential', name: 'Residencial'),
      Specialization(id: 'spec-plumbing-commercial', name: 'Comercial'),
      Specialization(id: 'spec-plumbing-gas', name: 'Gasodomésticos'),
      Specialization(id: 'spec-plumbing-drainage', name: 'Redes de desagüe'),
    ],
    'categories-electricity': const [
      Specialization(id: 'spec-electricity-residential', name: 'Residencial'),
      Specialization(id: 'spec-electricity-commercial', name: 'Comercial'),
      Specialization(id: 'spec-electricity-industrial', name: 'Industrial'),
      Specialization(id: 'spec-electricity-domotics', name: 'Domótica'),
      Specialization(id: 'spec-electricity-networks', name: 'Redes'),
      Specialization(id: 'spec-electricity-solar', name: 'Paneles solares'),
    ],
    'categories-cleaning': const [
      Specialization(id: 'spec-cleaning-home', name: 'Hogares'),
      Specialization(id: 'spec-cleaning-office', name: 'Oficinas'),
      Specialization(id: 'spec-cleaning-deep', name: 'Limpieza profunda'),
      Specialization(id: 'spec-cleaning-postconstruction', name: 'Post obra'),
    ],
    'categories-gardening': const [
      Specialization(id: 'spec-gardening-maintenance', name: 'Mantenimiento'),
      Specialization(id: 'spec-gardening-design', name: 'Diseño de jardines'),
      Specialization(id: 'spec-gardening-trees', name: 'Poda de árboles'),
    ],
    'categories-painting': const [
      Specialization(id: 'spec-painting-interior', name: 'Interiores'),
      Specialization(id: 'spec-painting-exterior', name: 'Exteriores'),
      Specialization(id: 'spec-painting-decorative', name: 'Decorativa'),
    ],
    'categories-pets': const [
      Specialization(id: 'spec-pets-walking', name: 'Paseo'),
      Specialization(id: 'spec-pets-grooming', name: 'Peluquería'),
      Specialization(id: 'spec-pets-sitting', name: 'Cuidado en casa'),
    ],
    'categories-technology': const [
      Specialization(id: 'spec-technology-computers', name: 'Computadores'),
      Specialization(id: 'spec-technology-networks', name: 'Redes'),
      Specialization(id: 'spec-technology-mobile', name: 'Dispositivos móviles'),
      Specialization(id: 'spec-technology-smarthome', name: 'Hogar inteligente'),
    ],
    'categories-beauty': const [
      Specialization(id: 'spec-beauty-hair', name: 'Peluquería'),
      Specialization(id: 'spec-beauty-nails', name: 'Manicure y pedicure'),
      Specialization(id: 'spec-beauty-makeup', name: 'Maquillaje'),
      Specialization(id: 'spec-beauty-spa', name: 'Spa y masajes'),
    ],
  };

  static const List<Specialization> _fallback = [
    Specialization(id: 'spec-general', name: 'General'),
    Specialization(id: 'spec-residential', name: 'Residencial'),
    Specialization(id: 'spec-commercial', name: 'Comercial'),
  ];

  @override
  Future<List<Specialization>> getByCategory(CategoryId categoryId) async {
    return _byCategoryId[categoryId.value] ?? _fallback;
  }
}
