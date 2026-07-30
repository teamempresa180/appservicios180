import 'package:flutter/foundation.dart';
import '../../../../core/network/http_exceptions.dart';
import '../../mock/mock_categories_data.dart';
import '../../models/category_display.dart';
import '../../repositories/category_repository.dart';

enum CategoriesLoadStatus { loading, success, error }

/// Owns the async load of [CategoriesPage]'s data against the real
/// [CategoryRepository] (backend-backed via DI, see
/// `core/di/service_locator.dart`). Replaces the previous
/// build-time-only `_buildCategories()` now that `getAll()` is a
/// `Future` — a real network call needs a real Loading/Success/Error
/// state, not a boolean toggle.
class CategoriesViewModel extends ChangeNotifier {
  CategoriesViewModel(this._repository);

  final CategoryRepository _repository;

  CategoriesLoadStatus _status = CategoriesLoadStatus.loading;
  List<CategoryDisplay> _categories = const [];
  String? _errorMessage;
  bool _disposed = false;

  CategoriesLoadStatus get status => _status;
  List<CategoryDisplay> get categories => _categories;
  String? get errorMessage => _errorMessage;

  @override
  void dispose() {
    _disposed = true;
    super.dispose();
  }

  void _notifyIfActive() {
    if (!_disposed) notifyListeners();
  }

  Future<void> load() async {
    _status = CategoriesLoadStatus.loading;
    _notifyIfActive();
    try {
      final categories = await _repository.getAll();
      if (_disposed) return;
      _categories = [
        for (final category in categories)
          CategoryDisplay(
            category: category,
            servicesCount: mockCategoryServicesCount[category.id.value] ?? 0,
          ),
      ];
      _status = CategoriesLoadStatus.success;
    } on HttpException catch (exception) {
      if (_disposed) return;
      _errorMessage = exception.message;
      _status = CategoriesLoadStatus.error;
    }
    _notifyIfActive();
  }

  Future<void> retry() => load();
}
