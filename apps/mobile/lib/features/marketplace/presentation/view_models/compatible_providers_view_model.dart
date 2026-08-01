import 'package:flutter/foundation.dart' hide Category;
import '../../../../category/entities/category.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../../../provider/entities/provider.dart';
import '../../models/provider_display.dart';
import '../../repositories/provider_repository.dart';

enum CompatibleProvidersLoadStatus { loading, success, error }

/// Owns the async load of the Marketplace's category →
/// specialization → compatible-providers browse flow —
/// `GET /providers/compatible?categoryId=&specialization=` on the real
/// backend (see `ProviderRepository.getCompatible`'s own doc comment).
/// Enriches each returned `Provider` into a [ProviderDisplay] the same
/// way `MarketplaceViewModel` already does for "Recomendados", so
/// `ProviderCard` can be reused as-is.
class CompatibleProvidersViewModel extends ChangeNotifier {
  CompatibleProvidersViewModel(this._repository, this.category);

  final ProviderRepository _repository;
  final Category category;

  CompatibleProvidersLoadStatus _status = CompatibleProvidersLoadStatus.loading;
  List<ProviderDisplay> _providers = const [];
  String? _errorMessage;
  String _specialization = '';
  bool _disposed = false;

  /// Bumped on every [search] call and captured locally so a slow, stale
  /// response (e.g. the request for "a" resolving after the request for
  /// "ab" already did) can never overwrite newer results — only the
  /// request matching the current [_requestId] is allowed to apply.
  int _requestId = 0;

  CompatibleProvidersLoadStatus get status => _status;
  List<ProviderDisplay> get providers => _providers;
  String? get errorMessage => _errorMessage;

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }

  void _notifyIfActive() {
    if (!_disposed) notifyListeners();
  }

  Future<void> search([String specialization = '']) async {
    _specialization = specialization;
    final requestId = ++_requestId;
    _status = CompatibleProvidersLoadStatus.loading;
    _notifyIfActive();
    try {
      final providers = await _repository.getCompatible(
        categoryId: category.id,
        specialization: specialization.isEmpty ? null : specialization,
      );
      final displays = await Future.wait(providers.map(_buildDisplay));
      if (_disposed || requestId != _requestId) return;
      _providers = displays;
      _status = CompatibleProvidersLoadStatus.success;
    } on HttpException catch (exception) {
      if (_disposed || requestId != _requestId) return;
      _errorMessage = exception.message;
      _status = CompatibleProvidersLoadStatus.error;
    } catch (_) {
      if (_disposed || requestId != _requestId) return;
      _errorMessage = 'Ocurrió un problema inesperado. Intenta de nuevo.';
      _status = CompatibleProvidersLoadStatus.error;
    }
    _notifyIfActive();
  }

  Future<ProviderDisplay> _buildDisplay(Provider provider) async {
    final profile = await _repository.profileOf(provider.id);
    final rating = await _repository.ratingOf(provider.id);
    final servicesCount = await _repository.servicesCountOf(provider.id);
    return ProviderDisplay(
      provider: provider,
      profile: profile,
      rating: rating,
      servicesCount: servicesCount,
    );
  }

  Future<void> retry() => search(_specialization);
}
