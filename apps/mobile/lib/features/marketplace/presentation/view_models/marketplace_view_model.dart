import 'package:flutter/foundation.dart' hide Category;
import '../../../../category/entities/category.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../provider/entities/provider.dart';
import '../../../../service/entities/service.dart';
import '../../models/provider_display.dart';
import '../../models/service_display.dart';
import '../../repositories/category_repository.dart';
import '../../repositories/provider_repository.dart';
import '../../repositories/service_repository.dart';

enum MarketplaceLoadStatus { loading, success, error }

/// Owns the async load of [MarketplacePage]'s data against the three
/// real Marketplace repositories (backend-backed via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildCategories()`/`_buildServices()`/
/// `_buildProviders()` now that every repository method is a `Future`.
///
/// [load] fetches the three top-level lists with [Future.wait] (they
/// don't depend on each other), then enriches each service/provider
/// into its `*Display` — that enrichment step (`profileOf`/`ratingOf`/
/// `servicesCountOf`) still needs one awaited call per item, same as
/// the previous build-time composition just made asynchronous.
class MarketplaceViewModel extends ChangeNotifier {
  MarketplaceViewModel({
    required CategoryRepository categoryRepository,
    required ServiceRepository serviceRepository,
    required ProviderRepository providerRepository,
  }) : _categoryRepository = categoryRepository,
       _serviceRepository = serviceRepository,
       _providerRepository = providerRepository;

  final CategoryRepository _categoryRepository;
  final ServiceRepository _serviceRepository;
  final ProviderRepository _providerRepository;

  MarketplaceLoadStatus _status = MarketplaceLoadStatus.loading;
  List<Category> _categories = const [];
  List<ServiceDisplay> _services = const [];
  List<ProviderDisplay> _providers = const [];
  String? _errorMessage;

  MarketplaceLoadStatus get status => _status;
  List<Category> get categories => _categories;
  List<ServiceDisplay> get services => _services;
  List<ProviderDisplay> get providers => _providers;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = MarketplaceLoadStatus.loading;
    notifyListeners();
    try {
      final results = await Future.wait([
        _categoryRepository.getAll(),
        _serviceRepository.getFeatured(),
        _providerRepository.getRecommended(),
      ]);
      _categories = results[0] as List<Category>;
      final services = results[1] as List<Service>;
      final providers = results[2] as List<Provider>;

      _services = await Future.wait(services.map(_buildServiceDisplay));
      _providers = await Future.wait(providers.map(_buildProviderDisplay));
      _status = MarketplaceLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = MarketplaceLoadStatus.error;
    }
    notifyListeners();
  }

  Future<ServiceDisplay> _buildServiceDisplay(Service service) async {
    final profile = await _providerRepository.profileOf(service.providerId);
    final category = await _categoryRepository.getById(service.categoryId);
    final rating = await _serviceRepository.ratingOf(service.id);
    return ServiceDisplay(
      service: service,
      providerName: profile.displayName,
      categoryName: category?.name ?? '',
      rating: rating,
    );
  }

  Future<ProviderDisplay> _buildProviderDisplay(Provider provider) async {
    final profile = await _providerRepository.profileOf(provider.id);
    final rating = await _providerRepository.ratingOf(provider.id);
    final servicesCount = await _providerRepository.servicesCountOf(
      provider.id,
    );
    return ProviderDisplay(
      provider: provider,
      profile: profile,
      rating: rating,
      servicesCount: servicesCount,
    );
  }

  Future<void> retry() => load();
}
