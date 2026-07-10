import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/quote_data.dart';

/// Recap of the quoted service: name and category. Reuses
/// `AppCard`/`AppSectionTitle` only.
class ServiceResume extends StatelessWidget {
  const ServiceResume({super.key, required this.data});

  final QuoteData data;

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
        ],
      ),
    );
  }
}
