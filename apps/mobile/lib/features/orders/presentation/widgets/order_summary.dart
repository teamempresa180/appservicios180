import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/order_display.dart';

/// Recap of an order: service, provider, scheduled date/time and price.
/// Purely visual — reuses only theme extensions, no new Core UI widget.
class OrderSummary extends StatelessWidget {
  const OrderSummary({super.key, required this.data});

  final OrderDisplay data;

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
    final date = data.scheduledDate;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          data.service?.name ?? data.category.name,
          style: context.textStyles.titleSmall,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: AppSpacing.space4),
        Text(
          data.providerName,
          style: context.textStyles.bodySmall,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: AppSpacing.space8),
        Wrap(
          crossAxisAlignment: WrapCrossAlignment.center,
          spacing: AppSpacing.space4,
          runSpacing: AppSpacing.space4,
          children: [
            Icon(
              Icons.calendar_today_outlined,
              size: AppSpacing.space16,
              color: context.colors.secondary,
            ),
            Text(_formatDate(date), style: context.textStyles.bodySmall),
            const SizedBox(width: AppSpacing.space8),
            Icon(
              Icons.access_time_outlined,
              size: AppSpacing.space16,
              color: context.colors.secondary,
            ),
            Text(_formatTime(date), style: context.textStyles.bodySmall),
          ],
        ),
        const SizedBox(height: AppSpacing.space8),
        Text(
          data.price == null ? 'Esperando cotización' : '\$${data.price}',
          style: context.textStyles.titleMedium,
        ),
      ],
    );
  }
}
