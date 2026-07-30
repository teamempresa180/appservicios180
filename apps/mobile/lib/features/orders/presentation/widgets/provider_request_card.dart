import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';
import '../../../../core/ui/widgets/app_badge.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/order_progress.dart';
import '../../../../order/journey/order_journey_action.dart';
import '../../../../order/journey/order_journey_stage.dart';
import '../../../../order/models/order_status.dart';
import '../../models/provider_request_display.dart';

/// One relevant Order for this provider: who's asking (or, for an open
/// request, just the category), for what, when, and its current
/// status — title/description/actions all sourced from
/// `ProviderRequestDisplay.journey` (`ProviderOrderJourney`, the single
/// source of truth for "what's the right copy/action for this state"),
/// so this card never re-derives that logic itself:
///
/// - `Pending`, not yet quoted: journey offers "Enviar cotización";
///   "Rechazar" stays alongside it as a provider escape hatch the
///   journey module doesn't model (declining a request has no
///   "journey forward", so it isn't one of `ProviderOrderJourney`'s
///   derived actions — see `OrdersRepository.rejectOrder`).
/// - `Pending`, already quoted by this provider: no action, just the
///   journey's own "Cotización enviada" badge — waiting on the client.
/// - `Accepted`: "Abrir chat" + the journey's "Iniciar servicio".
/// - `InProgress`: "Abrir chat" + the journey's "Marcar como
///   finalizado".
/// - `Completed`/`Cancelled`/`Rejected`: history only, journey
///   description explains what happened, no action.
///
/// An expandable "Ver progreso" section renders the full
/// `OrderProgress` timeline on demand — always the canonical
/// `OrderJourneyStage.values`, never a hand-picked subset — without
/// permanently inflating every card in a long list.
///
/// [isBusy] disables every action and shows a spinner on whichever one
/// was pressed while its request is in flight ([busyAction]:
/// `'reject'`/`'quote'`/`'start'`/`'complete'`).
class ProviderRequestCard extends StatelessWidget {
  const ProviderRequestCard({
    super.key,
    required this.data,
    required this.onSubmitQuote,
    required this.onStart,
    required this.onComplete,
    required this.onReject,
    this.onOpenChat,
    this.isBusy = false,
    this.busyAction,
  });

  final ProviderRequestDisplay data;
  final VoidCallback onSubmitQuote;
  final VoidCallback onStart;
  final VoidCallback onComplete;
  final VoidCallback onReject;
  final VoidCallback? onOpenChat;
  final bool isBusy;
  final String? busyAction;

  String _formatDate(DateTime date) {
    final day = date.day.toString().padLeft(2, '0');
    final month = date.month.toString().padLeft(2, '0');
    final hour = date.hour.toString().padLeft(2, '0');
    final minute = date.minute.toString().padLeft(2, '0');
    return '$day/$month/${date.year} · $hour:$minute';
  }

  Color _statusColor(BuildContext context, OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return context.colors.secondary;
      case OrderStatus.accepted:
      case OrderStatus.inProgress:
        return context.colors.primary;
      case OrderStatus.completed:
        return context.colors.primary;
      case OrderStatus.cancelled:
      case OrderStatus.rejected:
        return context.colors.error;
    }
  }

  String _statusLabel(OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return 'Pendiente';
      case OrderStatus.accepted:
        return 'Aceptada';
      case OrderStatus.inProgress:
        return 'En progreso';
      case OrderStatus.completed:
        return 'Finalizada';
      case OrderStatus.cancelled:
        return 'Cancelada';
      case OrderStatus.rejected:
        return 'Rechazada';
    }
  }

  Widget _actionButtonFor(OrderJourneyAction action) {
    switch (action.kind) {
      case OrderJourneyActionKind.submitQuote:
        return Expanded(
          child: AppButton(
            label: action.label,
            isLoading: isBusy && busyAction == 'quote',
            onPressed: isBusy ? null : onSubmitQuote,
          ),
        );
      case OrderJourneyActionKind.startService:
        return Expanded(
          child: AppButton(
            label: action.label,
            isLoading: isBusy && busyAction == 'start',
            onPressed: isBusy ? null : onStart,
          ),
        );
      case OrderJourneyActionKind.completeService:
        return Expanded(
          child: AppButton(
            label: action.label,
            isLoading: isBusy && busyAction == 'complete',
            onPressed: isBusy ? null : onComplete,
          ),
        );
      case OrderJourneyActionKind.openChat:
        return Expanded(
          child: AppButton(
            label: action.label,
            variant: AppButtonVariant.outlined,
            onPressed: isBusy ? null : onOpenChat,
          ),
        );
      // A provider's journey never derives these — see the class doc.
      case OrderJourneyActionKind.viewQuotes:
      case OrderJourneyActionKind.acceptQuote:
      case OrderJourneyActionKind.cancelOrder:
      case OrderJourneyActionKind.rateProvider:
        return const SizedBox.shrink();
    }
  }

  Widget _buildActions(BuildContext context) {
    final journey = data.journey;

    // Pending + not yet quoted: the journey only derives "Enviar
    // cotización", but "Rechazar" stays available alongside it — see
    // the class doc for why it isn't journey-derived.
    if (data.status == OrderStatus.pending && !data.hasSubmittedQuote) {
      return Row(
        children: [
          Expanded(
            child: AppButton(
              label: 'Rechazar',
              variant: AppButtonVariant.outlined,
              isLoading: isBusy && busyAction == 'reject',
              onPressed: isBusy ? null : onReject,
            ),
          ),
          const SizedBox(width: AppSpacing.space12),
          _actionButtonFor(
            journey.actions.firstWhere(
              (action) => action.kind == OrderJourneyActionKind.submitQuote,
            ),
          ),
        ],
      );
    }

    if (data.status == OrderStatus.pending && data.hasSubmittedQuote) {
      return Align(
        alignment: Alignment.centerLeft,
        child: AppBadge(label: journey.title, tone: AppBadgeTone.info),
      );
    }

    if (journey.actions.isEmpty) return const SizedBox.shrink();

    final buttons = journey.actions.map(_actionButtonFor).toList();
    return Row(
      children: [
        for (final (index, button) in buttons.indexed) ...[
          if (index > 0) const SizedBox(width: AppSpacing.space12),
          button,
        ],
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final price = data.price;
    final journey = data.journey;

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              AppAvatar(radius: AppSpacing.space20),
              const SizedBox(width: AppSpacing.space12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      data.clientName,
                      style: context.textStyles.titleSmall,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      data.category.name,
                      style: context.textStyles.bodySmall,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: AppSpacing.space8),
              if (price != null)
                Text('\$$price', style: context.textStyles.titleMedium),
            ],
          ),
          const SizedBox(height: AppSpacing.space12),
          Wrap(
            spacing: AppSpacing.space8,
            runSpacing: AppSpacing.space8,
            children: [
              AppBadge(
                label: data.isDirectHire ? 'Solicitud directa' : 'Solicitud abierta',
              ),
              AppBadge(
                label: _statusLabel(data.status),
                color: _statusColor(context, data.status),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.space12),
          Text(
            data.service?.name ?? data.category.description,
            style: context.textStyles.bodyMedium,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: AppSpacing.space4),
          Text(
            _formatDate(data.scheduledDate),
            style: context.textStyles.bodySmall,
          ),
          if (journey.description.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.space8),
            Text(journey.description, style: context.textStyles.bodySmall),
          ],
          const SizedBox(height: AppSpacing.space16),
          _buildActions(context),
          Theme(
            data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
            child: ExpansionTile(
              tilePadding: EdgeInsets.zero,
              childrenPadding: const EdgeInsets.only(top: AppSpacing.space8),
              title: Text('Ver progreso', style: context.textStyles.bodySmall),
              children: [
                OrderProgress(
                  stages: OrderJourneyStage.values,
                  current: journey.stage,
                  cancelled: journey.cancelled,
                  cancelledLabel: journey.title,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
