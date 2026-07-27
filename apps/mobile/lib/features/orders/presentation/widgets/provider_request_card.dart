import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../models/provider_request_display.dart';

/// One incoming client request: who's asking, for what service, when,
/// and the proposed price — with Aceptar/Rechazar actions. [isBusy]
/// disables both buttons and shows a spinner on whichever one was
/// pressed while its request is in flight.
class ProviderRequestCard extends StatelessWidget {
  const ProviderRequestCard({
    super.key,
    required this.data,
    required this.onAccept,
    required this.onReject,
    this.isBusy = false,
    this.busyAction,
  });

  final ProviderRequestDisplay data;
  final VoidCallback onAccept;
  final VoidCallback onReject;
  final bool isBusy;

  /// Which action is in flight — `'accept'` or `'reject'` — so only
  /// that button shows its loading spinner.
  final String? busyAction;

  String _formatDate(DateTime date) {
    final day = date.day.toString().padLeft(2, '0');
    final month = date.month.toString().padLeft(2, '0');
    final hour = date.hour.toString().padLeft(2, '0');
    final minute = date.minute.toString().padLeft(2, '0');
    return '$day/$month/${date.year} · $hour:$minute';
  }

  @override
  Widget build(BuildContext context) {
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
                    Text(data.clientName, style: context.textStyles.titleSmall),
                    Text(
                      data.category.name,
                      style: context.textStyles.bodySmall,
                    ),
                  ],
                ),
              ),
              Text('\$${data.price}', style: context.textStyles.titleMedium),
            ],
          ),
          const SizedBox(height: AppSpacing.space12),
          Text(data.service.name, style: context.textStyles.bodyMedium),
          const SizedBox(height: AppSpacing.space4),
          Text(
            _formatDate(data.scheduledDate),
            style: context.textStyles.bodySmall,
          ),
          const SizedBox(height: AppSpacing.space16),
          Row(
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
                  label: 'Aceptar',
                  isLoading: isBusy && busyAction == 'accept',
                  onPressed: isBusy ? null : onAccept,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
