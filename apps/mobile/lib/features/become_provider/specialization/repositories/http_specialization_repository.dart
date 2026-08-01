import '../../../../category/models/category_id.dart';
import '../../../../core/network/api_client.dart';
import '../models/specialization.dart';
import 'specialization_repository.dart';

/// [SpecializationRepository] backed by the real
/// `GET /categories/:categoryId/specializations` endpoint — returns a
/// bare JSON array, not the paginated `{items, ...}` shape most list
/// endpoints in this app use.
class HttpSpecializationRepository implements SpecializationRepository {
  HttpSpecializationRepository(this._apiClient);

  final ApiClient _apiClient;

  @override
  Future<List<Specialization>> getByCategory(CategoryId categoryId) async {
    final items = await _apiClient.getList(
      '/categories/${categoryId.value}/specializations',
    );
    return items
        .cast<Map<String, dynamic>>()
        .map(
          (json) => Specialization(
            id: json['id'] as String,
            name: json['name'] as String,
          ),
        )
        .toList();
  }
}
