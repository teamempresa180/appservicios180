import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/widgets/app_badge.dart';
import '../../../../service/models/service_status.dart';
import '../../models/provider_service_display.dart';

/// Colored badge for a service's status. Resolves its color from
/// `context.colors` (the app's neutral `ColorScheme`) based on the
/// real `Service.status` — never a hardcoded `Color` literal, same
/// rule already applied in `OrderStatusBadge`/`PaymentStatusBadge`.
/// Renders via `AppBadge`.
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
    return AppBadge(
      label: data.statusText,
      color: _colorFor(context, data.service.status),
    );
  }
}
