import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_radius.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../service/models/service_status.dart';
import '../../models/provider_service_display.dart';

/// Colored badge for a service's status. Resolves its color from
/// `context.colors` (the app's neutral `ColorScheme`) based on the
/// real `Service.status` — never a hardcoded `Color` literal, same
/// rule already applied in `OrderStatusBadge`/`PaymentStatusBadge`.
class ServiceStatusBadge extends StatelessWidget {
  const ServiceStatusBadge({super.key, required this.data});

  final ProviderServiceDisplay data;

  Color _colorFor(BuildContext context, ServiceStatus status) {
    switch (status) {
      case ServiceStatus.active:
        return context.colors.primary;
      case ServiceStatus.inactive:
        return context.colors.secondary;
      case ServiceStatus.archived:
        return context.colors.error;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _colorFor(context, data.service.status);

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.space12,
        vertical: AppSpacing.space4,
      ),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(AppRadius.radius8),
      ),
      child: Text(
        data.statusText,
        style: context.textStyles.bodySmall?.copyWith(
          color: color,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
