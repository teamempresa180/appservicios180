import 'package:flutter/material.dart';
import '../../../../core/di/service_locator.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../app_shell/navigation_intent.dart';
import '../../../orders/presentation/pages/orders_page.dart';
import '../mock/mock_home_data.dart';
import '../view_models/client_home_orders_view_model.dart';
import '../../../../core/session/user_role.dart';
import 'home_active_order_card.dart';
import 'quick_categories.dart';

/// Static (non-draggable) panel floating over [HomeMapBackground] —
/// Uber/inDrive-style: a fixed rounded sheet anchored to the bottom of
/// the map, not a `DraggableScrollableSheet`. Rounded only at the top,
/// so it reads as an extension of the bottom navigation bar beneath it.
///
/// For [UserRole.client] with [ordersViewModel] set, leads with the
/// client's most important active order (see
/// `ClientHomeOrdersViewModel`) above the usual quick-categories
/// prompt — the "operations center" that guides a client who already
/// has something in flight straight to what's next, instead of always
/// re-showing "what service do you need today?" underneath it.
class HomeFloatingPanel extends StatelessWidget {
  const HomeFloatingPanel({
    super.key,
    required this.role,
    this.ordersViewModel,
  });

  final UserRole role;

  /// Only meaningful for [UserRole.client] — `null` for Proveedor Home
  /// (which never instantiates this with one).
  final ClientHomeOrdersViewModel? ordersViewModel;

  void _openOrders(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Mis órdenes')),
          body: const SafeArea(child: OrdersPage()),
        ),
      ),
    );
  }

  Widget _buildActiveOrderSection(BuildContext context, ClientHomeOrdersViewModel vm) {
    final display = vm.topDisplay;
    final journey = vm.topJourney;
    if (display == null || journey == null) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.space20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppSectionTitle(
            title: 'Tu servicio activo',
            actionLabel: vm.hasMultipleActive ? 'Ver todas' : null,
            onActionTap: vm.hasMultipleActive
                ? () => _openOrders(context)
                : null,
          ),
          HomeActiveOrderCard(
            data: display,
            journey: journey,
            onTap: () => _openOrders(context),
            onChanged: vm.retry,
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final vm = ordersViewModel;
    final showActiveOrder = vm != null && vm.status == ClientHomeOrdersStatus.active;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(
        AppSpacing.space20,
        AppSpacing.space20,
        AppSpacing.space20,
        AppSpacing.space16,
      ),
      decoration: BoxDecoration(
        color: context.colors.surface,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(AppRadius.radius24),
          topRight: Radius.circular(AppRadius.radius24),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 24,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 36,
              height: 4,
              margin: const EdgeInsets.only(bottom: AppSpacing.space16),
              decoration: BoxDecoration(
                color: context.colors.outlineVariant,
                borderRadius: BorderRadius.circular(AppRadius.radiusPill),
              ),
            ),
          ),
          // The panel is a fixed-height sheet (not a
          // `DraggableScrollableSheet`, per the class doc), but adding
          // the active-order section on top of the always-present
          // categories prompt can now make its content taller than the
          // space the map Stack gives it — `Flexible` + a scroll view
          // lets that content scroll internally instead of overflowing,
          // while staying exactly as tall as it needs to be (no taller)
          // when there's nothing active to show.
          Flexible(
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (showActiveOrder) _buildActiveOrderSection(context, vm),
                  const AppSectionTitle(title: '¿Qué servicio necesitas hoy?'),
                  Padding(
                    padding: const EdgeInsets.only(
                      bottom: AppSpacing.space16,
                    ),
                    child: Text(
                      'Elige una categoría para empezar a buscar.',
                      style: context.textStyles.bodyMedium,
                    ),
                  ),
                  QuickCategories(
                    categories: MockHomeData.quickCategories,
                    onCategoryTap: (category) =>
                        locator<AppShellNavigationIntent>()
                            .goToBuscarWithCategory(category),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
