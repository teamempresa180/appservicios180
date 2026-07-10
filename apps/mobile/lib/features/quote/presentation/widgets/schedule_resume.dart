import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/quote_data.dart';

/// Recap of the estimated date, split into "Fecha"/"Hora" rows.
/// `QuoteData.estimatedDate` is **simulated** — see the feature README.
class ScheduleResume extends StatelessWidget {
  const ScheduleResume({super.key, required this.data});

  final QuoteData data;

  String _formatDate(DateTime date) {
    final day = date.day.toString().padLeft(2, '0');
    final month = date.month.toString().padLeft(2, '0');
    return '$day/$month/${date.year}';
  }

  String _formatTime(DateTime date) {
    final hour = date.hour.toString().padLeft(2, '0');
    final minute = date.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  @override
  Widget build(BuildContext context) {
    final date = data.estimatedDate;

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Fecha y hora'),
          Row(
            children: [
              Expanded(
                child: Row(
                  children: [
                    Icon(
                      Icons.calendar_today_outlined,
                      color: context.colors.primary,
                    ),
                    const SizedBox(width: AppSpacing.space8),
                    Flexible(
                      child: Text(
                        _formatDate(date),
                        overflow: TextOverflow.ellipsis,
                        style: context.textStyles.bodyMedium,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: AppSpacing.space8),
              Expanded(
                child: Row(
                  children: [
                    Icon(
                      Icons.access_time_outlined,
                      color: context.colors.primary,
                    ),
                    const SizedBox(width: AppSpacing.space8),
                    Flexible(
                      child: Text(
                        _formatTime(date),
                        overflow: TextOverflow.ellipsis,
                        style: context.textStyles.bodyMedium,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
