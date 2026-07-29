import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';
import '../../../../core/ui/widgets/app_badge.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../order/models/order_status.dart';
import '../../models/provider_request_display.dart';

/// One relevant Order for this provider: who's asking (or, for an open
/// request, just the category), for what, when, and its current
/// status — with the action appropriate to that status:
///
/// - `Pending`, not yet quoted: "Rechazar" / "Enviar cotización".
/// - `Pending`, already quoted by this provider: no action, just a
///   "Cotización enviada" badge — waiting on the client.
/// - `Accepted`: "Comenzar servicio".
/// - `InProgress`: "Marcar como finalizado".
/// - `Completed`/`Cancelled`/`Rejected`: history only, no action.
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
    this.isBusy = false,
    this.busyAction,
  });

  final ProviderRequestDisplay data;
  final VoidCallback onSubmitQuote;
  final VoidCallback onStart;
  final VoidCallback onComplete;
  final VoidCallback onReject;
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

  Widget _buildActions(BuildContext context) {
    switch (data.status) {
      case OrderStatus.pending:
        if (data.hasSubmittedQuote) {
          return const Align(
            alignment: Alignment.centerLeft,
            child: AppBadge(
              label: 'Cotización enviada',
              tone: AppBadgeTone.info,
            ),
          );
        }
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
            Expanded(
              child: AppButton(
                label: 'Enviar cotización',
                isLoading: isBusy && busyAction == 'quote',
                onPressed: isBusy ? null : onSubmitQuote,
              ),
            ),
          ],
        );
      case OrderStatus.accepted:
        return AppButton(
          label: 'Comenzar servicio',
          isLoading: isBusy && busyAction == 'start',
          onPressed: isBusy ? null : onStart,
        );
      case OrderStatus.inProgress:
        return AppButton(
          label: 'Marcar como finalizado',
          isLoading: isBusy && busyAction == 'complete',
          onPressed: isBusy ? null : onComplete,
        );
      case OrderStatus.completed:
      case OrderStatus.cancelled:
      case OrderStatus.rejected:
        return const SizedBox.shrink();
    }
  }

  @override
  Widget build(BuildContext context) {
    final price = data.price;

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
          const SizedBox(height: AppSpacing.space16),
          _buildActions(context),
        ],
      ),
    );
  }
}
