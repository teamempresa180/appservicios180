import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/service_detail_data.dart';

/// Main service information: long description and base price. Reuses
/// `AppCard`/`AppSectionTitle` only.
class ServiceInformation extends StatelessWidget {
  const ServiceInformation({super.key, required this.data});

  final ServiceDetailData data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Descripción'),
          Text(data.longDescription, style: context.textStyles.bodyMedium),
          const SizedBox(height: AppSpacing.space16),
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
