import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/quote_data.dart';

/// The quote's estimated duration. Real domain data
/// (`Quote.estimatedDuration`, in minutes) — see `QuoteData` and the
/// feature README.
class EstimatedTime extends StatelessWidget {
  const EstimatedTime({super.key, required this.data});

  final QuoteData data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Tiempo estimado'),
          Row(
            children: [
              Icon(Icons.schedule_outlined, color: context.colors.primary),
              const SizedBox(width: AppSpacing.space8),
              Text(
                '${data.estimatedTime} min',
                style: context.textStyles.bodyMedium,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
