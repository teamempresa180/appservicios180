import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../service_detail/presentation/pages/service_detail_page.dart';
import '../../models/search_result.dart';

/// A single search result: service name, provider, category, base
/// price, rating, reviews count, distance and a "Ver" button. Pressing
/// "Ver" opens the (visual-only, single fixed mock service) Service
/// Detail preview — see the feature README and `service_detail`'s
/// README for why every result currently opens the same mock service.
///
/// `SearchResult` intentionally has no `Profile` (only `Provider`,
/// which the domain does not give a display name) — the provider's
/// `biography` is shown instead, as the closest real field available.
class SearchResultCard extends StatelessWidget {
  const SearchResultCard({super.key, required this.result});

  final SearchResult result;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            result.service.name,
            style: context.textStyles.titleMedium,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: AppSpacing.space4),
          Text(
            result.provider.biography,
            style: context.textStyles.bodySmall,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: AppSpacing.space4),
          Text(result.category.name, style: context.textStyles.bodySmall),
          const SizedBox(height: AppSpacing.space8),
          Wrap(
            spacing: AppSpacing.space12,
            runSpacing: AppSpacing.space4,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.star_outline,
                    size: AppSpacing.space16,
                    color: context.colors.primary,
                  ),
                  const SizedBox(width: AppSpacing.space4),
                  Text(
                    result.rating.toStringAsFixed(1),
                    style: context.textStyles.bodySmall,
                  ),
                  const SizedBox(width: AppSpacing.space4),
                  Text(
                    '(${result.reviewsCount})',
                    style: context.textStyles.bodySmall,
                  ),
                ],
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.place_outlined,
                    size: AppSpacing.space16,
                    color: context.colors.primary,
                  ),
                  const SizedBox(width: AppSpacing.space4),
                  Text(
                    '${result.distance.toStringAsFixed(1)} km',
                    style: context.textStyles.bodySmall,
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.space12),
          Row(
            children: [
              Text(
                '\$${result.service.basePrice}',
                style: context.textStyles.titleSmall,
              ),
              const Spacer(),
              AppButton(
                label: 'Ver',
                expand: false,
                onPressed: () => Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (context) => Scaffold(
                      appBar: AppBar(title: const Text('Detalle del servicio')),
                      body: const SafeArea(child: ServiceDetailPage()),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
