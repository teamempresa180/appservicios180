import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/request_service_data.dart';

/// Recap of the service being requested: name, category and base price.
/// Reuses `AppCard`/`AppSectionTitle` only.
class ServiceSummary extends StatelessWidget {
  const ServiceSummary({super.key, required this.data});

  final RequestServiceData data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Servicio'),
          Text(data.service.name, style: context.textStyles.titleSmall),
          const SizedBox(height: AppSpacing.space4),
          Text(data.category.name, style: context.textStyles.bodySmall),
          const SizedBox(height: AppSpacing.space8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Precio base', style: context.textStyles.bodySmall),
              Text(
                '\$${data.service.basePrice}',
                style: context.textStyles.titleMedium,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
