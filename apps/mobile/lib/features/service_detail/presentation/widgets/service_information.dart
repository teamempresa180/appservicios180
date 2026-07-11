import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_info_row.dart';
import '../../../../core/ui/widgets/app_section.dart';
import '../../models/service_detail_data.dart';

/// Main service information: long description and base price. Reuses
/// `AppSection`/`AppInfoRow` only.
class ServiceInformation extends StatelessWidget {
  const ServiceInformation({super.key, required this.data});

  final ServiceDetailData data;

  @override
  Widget build(BuildContext context) {
    return AppSection(
      title: 'Descripción',
      children: [
        Text(data.longDescription, style: context.textStyles.bodyMedium),
        const SizedBox(height: AppSpacing.space16),
        AppInfoRow(
          label: 'Precio base',
          value: '\$${data.service.basePrice}',
          labelStyle: context.textStyles.bodySmall,
        ),
      ],
    );
  }
}
