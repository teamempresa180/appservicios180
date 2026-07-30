import 'package:flutter/material.dart';
import '../../../../category/entities/category.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/animations/fade_in.dart';
import '../../../../core/ui/tokens/app_durations.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/session/user_role.dart';
import '../../../marketplace/repositories/category_repository.dart'
    as marketplace;
import '../view_models/client_home_orders_view_model.dart';
import 'home_floating_panel.dart';
import 'home_map_background.dart';
import 'home_map_greeting_pill.dart';

/// Cliente-specific Home content: a full-bleed map with a static
/// (non-draggable) floating panel on top — the Uber/inDrive-style
/// layout — instead of the previous scrolling card list. The panel
/// slides out of view while the user is actively panning the map (so it
/// doesn't get in the way) and slides back in once the map settles.
///
/// Owns two real network calls this screen makes:
/// [ClientHomeOrdersViewModel], which decides whether the floating
/// panel leads with the client's most important active order or falls
/// back to the categories/quick-actions it always showed before (see
/// that view model's own doc for the "active" derivation and priority
/// order); and a lightweight load of the real category list (the same
/// `CategoryRepository` Marketplace/Buscar uses) for the "quick
/// categories" row — this used to be a fixed, hardcoded list of names
/// shown regardless of what the backend actually has, so tapping one
/// could silently do nothing on Buscar if the real categories didn't
/// match those names.
class ClientHomeContent extends StatefulWidget {
  const ClientHomeContent({
    super.key,
    ClientHomeOrdersViewModel? ordersViewModel,
    marketplace.CategoryRepository? categoryRepository,
  }) : _ordersViewModel = ordersViewModel,
       _categoryRepository = categoryRepository;

  /// Overridable for tests only — production call sites always let this
  /// resolve its own repositories from the service locator.
  final ClientHomeOrdersViewModel? _ordersViewModel;

  /// Overridable for tests only — production call sites always resolve
  /// the real repository from the service locator.
  final marketplace.CategoryRepository? _categoryRepository;

  @override
  State<ClientHomeContent> createState() => _ClientHomeContentState();
}

class _ClientHomeContentState extends State<ClientHomeContent> {
  late final ClientHomeOrdersViewModel _ordersViewModel =
      widget._ordersViewModel ?? ClientHomeOrdersViewModel();

  late final marketplace.CategoryRepository _categoryRepository =
      widget._categoryRepository ?? locator<marketplace.CategoryRepository>();

  bool _isPanelVisible = true;
  bool _disposed = false;
  List<Category> _quickCategories = const [];

  @override
  void initState() {
    super.initState();
    _ordersViewModel.load();
    _ordersViewModel.addListener(_onOrdersChanged);
    _loadQuickCategories();
  }

  Future<void> _loadQuickCategories() async {
    try {
      final categories = await _categoryRepository.getAll();
      if (_disposed || !mounted) return;
      setState(() => _quickCategories = categories.take(5).toList());
    } catch (_) {
      // Left empty on failure — the quick-categories row is an optional
      // shortcut, not a hard requirement to use Home, so this never
      // blocks the rest of the screen with an error state.
    }
  }

  void _onOrdersChanged() {
    if (_disposed) return;
    setState(() {});
  }

  @override
  void dispose() {
    _disposed = true;
    _ordersViewModel.removeListener(_onOrdersChanged);
    _ordersViewModel.dispose();
    super.dispose();
  }

  void _onMapMoveStarted() {
    if (!_isPanelVisible) return;
    setState(() => _isPanelVisible = false);
  }

  void _onMapIdle() {
    if (_isPanelVisible) return;
    setState(() => _isPanelVisible = true);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return SizedBox.expand(
      child: ClipRRect(
        borderRadius: BorderRadius.circular(AppSpacing.space16),
        child: Stack(
          fit: StackFit.expand,
          children: [
            HomeMapBackground(
              isDark: isDark,
              onCameraMoveStarted: _onMapMoveStarted,
              onCameraIdle: _onMapIdle,
            ),
            Positioned(
              top: AppSpacing.space16,
              left: AppSpacing.space16,
              child: FadeIn(
                child: const HomeMapGreetingPill(role: UserRole.client),
              ),
            ),
            Align(
              alignment: Alignment.bottomCenter,
              child: AnimatedSlide(
                duration: AppDurations.medium,
                curve: Curves.easeOutCubic,
                offset: _isPanelVisible ? Offset.zero : const Offset(0, 1),
                child: AnimatedOpacity(
                  duration: AppDurations.medium,
                  opacity: _isPanelVisible ? 1 : 0,
                  child: HomeFloatingPanel(
                    role: UserRole.client,
                    ordersViewModel: _ordersViewModel,
                    quickCategories: _quickCategories,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
