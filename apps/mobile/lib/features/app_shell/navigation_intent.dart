import 'package:flutter/foundation.dart';

/// Cross-tab navigation signal — lets a widget outside the App Shell
/// (e.g. a Home quick-category card) ask the Shell to switch to a given
/// tab and, optionally, hand that tab a one-shot piece of state to
/// consume once (e.g. "open Buscar pre-filtered to this category").
///
/// Deliberately not a full router: `AppShellPage` still owns
/// `_selectedIndex` locally (see its own doc comment for why), this
/// only pokes it from outside. Each pending value is consumed exactly
/// once by whoever reads it, so it never re-fires on rebuild.
class AppShellNavigationIntent extends ChangeNotifier {
  static const int buscarTabIndex = 1;

  int? _pendingTabIndex;
  String? _pendingCategoryName;

  int? get pendingTabIndex => _pendingTabIndex;
  String? get pendingCategoryName => _pendingCategoryName;

  void goToBuscarWithCategory(String categoryName) {
    _pendingTabIndex = buscarTabIndex;
    _pendingCategoryName = categoryName;
    notifyListeners();
  }

  int? consumeTabIndex() {
    final value = _pendingTabIndex;
    _pendingTabIndex = null;
    return value;
  }

  String? consumeCategoryName() {
    final value = _pendingCategoryName;
    _pendingCategoryName = null;
    return value;
  }
}
