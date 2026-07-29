import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../service_detail/presentation/pages/service_detail_page.dart';
import '../../models/service_display.dart';

/// A single featured service card: name, provider, category, base price
/// and a simulated rating. Tapping it opens Service Detail for this
/// card's own [Service] — different cards now open different services.
class ServiceCard extends StatelessWidget {
  const ServiceCard({super.key, required this.display});

  final ServiceDisplay display;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 220,
      child: AppCard(
        onTap: () => Navigator.of(context).push(
          MaterialPageRoute<void>(
            builder: (context) => Scaffold(
              appBar: AppBar(title: const Text('Detalle del servicio')),
              body: SafeArea(child: ServiceDetailPage(service: display.service)),
            ),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              display.service.name,
              style: context.textStyles.titleSmall,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: AppSpacing.space4),
            Text(
              display.providerName,
              style: context.textStyles.bodySmall,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            Text(
              display.categoryName,
              style: context.textStyles.bodySmall,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: AppSpacing.space8),
            Row(
              children: [
                Icon(
                  Icons.star_outline,
                  size: AppSpacing.space16,
                  color: context.colors.primary,
                ),
                const SizedBox(width: AppSpacing.space4),
                Text(
                  display.rating.toStringAsFixed(1),
                  style: context.textStyles.bodySmall,
                ),
                const SizedBox(width: AppSpacing.space4),
                Expanded(
                  child: Text(
                    '\$${display.service.basePrice}',
                    textAlign: TextAlign.end,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: context.textStyles.titleSmall,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
