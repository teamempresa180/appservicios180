import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_info_row.dart';
import '../../../../core/ui/widgets/app_section.dart';
import '../../models/request_service_data.dart';

/// Recap of the service being requested: name, category and base price.
/// Reuses `AppSection`/`AppInfoRow` only.
class ServiceSummary extends StatelessWidget {
  const ServiceSummary({super.key, required this.data});

  final RequestServiceData data;

  @override
  Widget build(BuildContext context) {
    return AppSection(
      title: 'Servicio',
      children: [
        Text(data.service.name, style: context.textStyles.titleSmall),
        const SizedBox(height: AppSpacing.space4),
        Text(data.category.name, style: context.textStyles.bodySmall),
        const SizedBox(height: AppSpacing.space8),
        AppInfoRow(
          label: 'Precio base',
          value: '\$${data.service.basePrice}',
          labelStyle: context.textStyles.bodySmall,
        ),
      ],
    );
  }
}
