import '../../../availability/entities/availability.dart';
import '../../../category/entities/category.dart';
import '../../../core/network/api_client.dart';
import '../../../core/network/mappers/domain_http_mappers.dart';
import '../../../profiles/entities/profile.dart';
import '../../../provider/entities/provider.dart';
import '../../../review/entities/review.dart';
import '../../../service/entities/service.dart';
import '../../categories/repositories/category_http_mapper.dart';
import 'provider_profile_repository.dart';

/// [ProviderProfileRepository] backed by [ApiClient].
///
/// The feature interface still models a single fixed provider (see
/// `provider_profile_repository.dart`'s own doc comment: "no id-based
/// lookup yet"). The backend mirrors that limitation — there is no
/// "provider for the current screen" endpoint, only `GET /providers`
/// (paginated, unfiltered) and `GET /providers/:id`. [_fetchProvider]
/// takes the first item of the list as the one provider this screen
/// shows, exactly matching what the previous mock data represented (a
/// single fixed provider) — just sourced from the real backend now
/// instead of a hardcoded object.
///
/// [getAvailability], [getReviews] and [getServices] have the same
/// interim shape as `HttpChatRepository.getMessages`: the backend has
/// no `GET /availabilities?providerId=`, `GET /reviews?providerId=` or
/// `GET /services?providerId=` filter, so all three list the full
/// unfiltered collection and match `providerId` client-side. Adding
/// those query filters is the natural Prompt 76 follow-up.
///
/// [getCategories] goes one step further: there is no
/// `GET /categories?providerId=` endpoint at all, direct or otherwise.
/// Instead it derives the provider's categories from the provider's own
/// services — it calls [getServices], collects the distinct
/// `categoryId`s referenced by them, then lists `GET /categories` and
/// keeps only the ones whose id is in that set. This is correct today
/// (a provider's categories are exactly the categories of the services
/// they offer) but is one more client-side join than the other getters
/// need — worth revisiting if the backend ever exposes a direct
/// provider→category relationship.
class HttpProviderProfileRepository implements ProviderProfileRepository {
  HttpProviderProfileRepository(this._apiClient);

  final ApiClient _apiClient;

  Future<Provider> _fetchProvider() async {
    final json = await _apiClient.get('/providers');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    if (items.isEmpty) {
      throw StateError('No providers available for the current session');
    }
    return ProviderHttpMapper.fromJson(items.first);
  }

  @override
  Future<Provider> getProvider() => _fetchProvider();

  @override
  Future<Profile> getProfile() async {
    final provider = await _fetchProvider();
    final json = await _apiClient.get(
      '/profiles/${provider.providerProfileId.value}',
    );
    return ProfileHttpMapper.fromJson(json);
  }

  @override
  Future<Availability> getAvailability() async {
    final provider = await _fetchProvider();
    final json = await _apiClient.get('/availabilities');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final matches = items
        .where((item) => item['providerId'] == provider.id.value)
        .toList();
    if (matches.isEmpty) {
      throw StateError(
        'No availability found for provider ${provider.id.value}',
      );
    }
    return AvailabilityHttpMapper.fromJson(matches.first);
  }

  @override
  Future<List<Review>> getReviews() async {
    final provider = await _fetchProvider();
    final json = await _apiClient.get('/reviews');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .where((item) => item['providerId'] == provider.id.value)
        .map(ReviewHttpMapper.fromJson)
        .toList();
  }

  @override
  Future<List<Service>> getServices() async {
    final provider = await _fetchProvider();
    final json = await _apiClient.get('/services');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    return items
        .where((item) => item['providerId'] == provider.id.value)
        .map(ServiceHttpMapper.fromJson)
        .toList();
  }

  @override
  Future<List<Category>> getCategories() async {
    final services = await getServices();
    final categoryIds = services
        .map((service) => service.categoryId.value)
        .toSet();
    final json = await _apiClient.get('/categories');
    final items = (json['items'] as List<dynamic>).cast<Map<String, dynamic>>();
    final seen = <String>{};
    final categories = <Category>[];
    for (final item in items) {
      final id = item['id'] as String;
      if (categoryIds.contains(id) && seen.add(id)) {
        categories.add(CategoryHttpMapper.fromJson(item));
      }
    }
    return categories;
  }
}
