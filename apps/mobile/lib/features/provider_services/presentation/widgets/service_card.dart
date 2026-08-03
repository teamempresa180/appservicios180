import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../service/models/service_status.dart';
import '../../models/provider_service_display.dart';
import 'service_actions.dart';
import 'service_status_badge.dart';

/// A single service card: name, category, base price, status, when it
/// was last updated (derived from the real `Service.updatedAt`) and
/// the edit/pause/delete actions.
///
/// The former "views / requests" counter row is gone — it was backed
/// by a simulated per-service map that resolved to a flat 0/0 for
/// every real service, i.e. an invented performance metric shown as
/// real data (see `ProviderServiceDisplay`'s class doc).
class ServiceCard extends StatelessWidget {
  const ServiceCard({
    super.key,
    required this.data,
    this.onEdit,
    this.onPause,
    this.onDelete,
  });

  final ProviderServiceDisplay data;
  final VoidCallback? onEdit;
  final VoidCallback? onPause;
  final VoidCallback? onDelete;

  @override
  Widget build(BuildContext context) {
    final service = data.service;

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  service.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: context.textStyles.titleSmall,
                ),
              ),
              const SizedBox(width: AppSpacing.space8),
              ServiceStatusBadge(data: data),
            ],
          ),
          const SizedBox(height: AppSpacing.space4),
          Text(
            data.category.name,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: context.textStyles.bodySmall,
          ),
          const SizedBox(height: AppSpacing.space8),
          Text('\$${service.basePrice}', style: context.textStyles.titleMedium),
          const SizedBox(height: AppSpacing.space8),
          Text(data.lastUpdatedLabel, style: context.textStyles.bodySmall),
          const SizedBox(height: AppSpacing.space12),
          ServiceActions(
            onEdit: onEdit,
            onPause: onPause,
            onDelete: onDelete,
            isPaused: service.status == ServiceStatus.inactive,
          ),
        ],
      ),
    );
  }
}
