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

  CategoriesLoadStatus get status => _status;
  List<CategoryDisplay> get categories => _categories;
  String? get errorMessage => _errorMessage;

  Future<void> load() async {
    _status = CategoriesLoadStatus.loading;
    notifyListeners();
    try {
      final categories = await _repository.getAll();
      _categories = [
        for (final category in categories)
          CategoryDisplay(
            category: category,
            servicesCount: mockCategoryServicesCount[category.id.value] ?? 0,
          ),
      ];
      _status = CategoriesLoadStatus.success;
    } on HttpException catch (exception) {
      _errorMessage = exception.message;
      _status = CategoriesLoadStatus.error;
    }
    notifyListeners();
  }

  Future<void> retry() => load();
}
