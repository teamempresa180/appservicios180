import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/theme/app_brand_palette.dart';
import '../../../../core/ui/tokens/app_elevation.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_badge.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/order_progress.dart';
import '../../../../order/entities/order.dart';
import '../../../../order/journey/order_journey_action.dart';
import '../../../../order/journey/order_journey_info.dart';
import '../../../../order/journey/order_journey_stage.dart';

/// The single most prominent thing on the Provider Dashboard: the one
/// order this provider is actively working right now (see
/// `ProviderDashboardDisplay.activeOrder` for how it's picked), with
/// the full `OrderProgress` timeline plus [journey]'s own title/
/// description and its primary action button — "the provider should
/// never have to wonder what to do next" starts here. Higher elevation
/// and a tinted border set it apart from every other, lower-priority
/// dashboard section.
///
/// [otherActiveCount] surfaces a "ver los N restantes" link when more
/// than one order is active at once, instead of silently hiding them.
class ActiveServiceCard extends StatelessWidget {
  const ActiveServiceCard({
    super.key,
    required this.order,
    required this.journey,
    this.otherActiveCount = 0,
    this.onStart,
    this.onComplete,
    this.onOpenChat,
    this.onViewOthers,
    this.onNavigate,
    this.busyAction,
  });

  /// Which action is currently in flight (`'start'`/`'complete'`), if
  /// any — shows a spinner on that button and disables every other
  /// action meanwhile. Without it the whole card looks inert between
  /// the tap and the success snackbar (the post-action reload is now
  /// silent, so nothing else on screen moves).
  final String? busyAction;

  final Order order;
  final OrderJourneyInfo journey;
  final int otherActiveCount;
  final VoidCallback? onStart;
  final VoidCallback? onComplete;
  final VoidCallback? onOpenChat;
  final VoidCallback? onViewOthers;

  /// Opens the Google Maps/Waze chooser for this order's client
  /// address — resolved (and any failure handled with an
  /// `AppSnackBar`) by the caller, since only it holds the
  /// `AddressManagementRepository`. Only shown when [order.addressId]
  /// is non-null — an order created before this field existed, or one
  /// that otherwise never got an address, has nothing to navigate to.
  final VoidCallback? onNavigate;

  bool get _isBusy => busyAction != null;

  Widget? _primaryActionFor(OrderJourneyAction action) {
    switch (action.kind) {
      case OrderJourneyActionKind.startService:
        return AppButton(
          label: action.label,
          isLoading: busyAction == 'start',
          onPressed: _isBusy ? null : onStart,
        );
      case OrderJourneyActionKind.completeService:
        return AppButton(
          label: action.label,
          isLoading: busyAction == 'complete',
          onPressed: _isBusy ? null : onComplete,
        );
      default:
        return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final primaryAction = journey.actions
        .map(_primaryActionFor)
        .whereType<Widget>()
        .toList();
    final hasChatAction = journey.actions.any(
      (action) => action.kind == OrderJourneyActionKind.openChat,
    );
    final canNavigate = order.addressId != null;

    return AppCard(
      elevation: AppElevation.level4,
      child: DecoratedBox(
        decoration: BoxDecoration(
          border: Border(
            left: BorderSide(
              color: AppBrandPalette.primary600,
              width: AppSpacing.space4,
            ),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.only(left: AppSpacing.space12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  AppBadge(label: 'Servicio activo', tone: AppBadgeTone.info),
                  const Spacer(),
                  if (otherActiveCount > 0)
                    TextButton(
                      onPressed: onViewOthers,
                      child: Text('Ver $otherActiveCount más'),
                    ),
                ],
              ),
              const SizedBox(height: AppSpacing.space8),
              Text(order.title, style: context.textStyles.titleMedium),
              const SizedBox(height: AppSpacing.space4),
              Text(journey.title, style: context.textStyles.titleSmall),
              const SizedBox(height: AppSpacing.space4),
              Text(journey.description, style: context.textStyles.bodyMedium),
              if (journey.helpMessage.isNotEmpty) ...[
                const SizedBox(height: AppSpacing.space4),
                Text(
                  journey.helpMessage,
                  style: context.textStyles.bodySmall,
                ),
              ],
              const SizedBox(height: AppSpacing.space16),
              OrderProgress(
                stages: OrderJourneyStage.values,
                current: journey.stage,
                cancelled: journey.cancelled,
              ),
              if (canNavigate) ...[
                const SizedBox(height: AppSpacing.space16),
                AppButton(
                  label: 'Iniciar navegación',
                  variant: AppButtonVariant.outlined,
                  onPressed: _isBusy ? null : onNavigate,
                ),
              ],
              const SizedBox(height: AppSpacing.space16),
              Row(
                children: [
                  if (hasChatAction) ...[
                    Expanded(
                      child: AppButton(
                        label: 'Abrir chat',
                        variant: AppButtonVariant.outlined,
                        onPressed: _isBusy ? null : onOpenChat,
                      ),
                    ),
                    const SizedBox(width: AppSpacing.space12),
                  ],
                  for (final button in primaryAction) ...[
                    Expanded(child: button),
                  ],
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
