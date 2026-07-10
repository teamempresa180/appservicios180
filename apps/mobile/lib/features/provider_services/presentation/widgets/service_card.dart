import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../models/provider_service_display.dart';
import 'service_actions.dart';
import 'service_status_badge.dart';

/// A single service card: name, category, base price, status,
/// simulated views/requests, simulated last-updated label and the
/// edit/pause/delete actions.
class ServiceCard extends StatelessWidget {
  const ServiceCard({super.key, required this.data});

  final ProviderServiceDisplay data;

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
                child: Text(service.name, style: context.textStyles.titleSmall),
              ),
              ServiceStatusBadge(data: data),
            ],
          ),
          const SizedBox(height: AppSpacing.space4),
          Text(data.category.name, style: context.textStyles.bodySmall),
          const SizedBox(height: AppSpacing.space8),
          Text(
            '\$${service.basePrice}',
            style: context.textStyles.titleMedium,
          ),
          const SizedBox(height: AppSpacing.space8),
          Row(
            children: [
              Icon(
                Icons.visibility_outlined,
                size: AppSpacing.space16,
                color: context.colors.secondary,
              ),
              const SizedBox(width: AppSpacing.space4),
              Text(
                '${data.viewsCount}',
                style: context.textStyles.bodySmall,
              ),
              const SizedBox(width: AppSpacing.space12),
              Icon(
                Icons.request_page_outlined,
                size: AppSpacing.space16,
                color: context.colors.secondary,
              ),
              const SizedBox(width: AppSpacing.space4),
              Text(
                '${data.requestsCount}',
                style: context.textStyles.bodySmall,
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.space4),
          Text(data.lastUpdatedLabel, style: context.textStyles.bodySmall),
          const SizedBox(height: AppSpacing.space12),
          const ServiceActions(),
        ],
      ),
    );
  }
}
