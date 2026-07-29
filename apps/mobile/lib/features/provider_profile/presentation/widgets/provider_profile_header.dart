import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../models/provider_profile_data.dart';
import 'provider_avatar.dart';
import 'provider_cover.dart';

/// Top section of the Provider Profile screen: simulated cover +
/// simulated avatar + name + aggregate rating + reviews count.
class ProviderProfileHeader extends StatelessWidget {
  const ProviderProfileHeader({super.key, required this.data});

  final ProviderProfileData data;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ProviderCover(label: data.coverImages.first),
        const SizedBox(height: AppSpacing.space12),
        Row(
          children: [
            const ProviderAvatar(),
            const SizedBox(width: AppSpacing.space12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    data.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: context.textStyles.titleLarge,
                  ),
                  const SizedBox(height: AppSpacing.space4),
                  Row(
                    children: [
                      Icon(
                        Icons.star_outline,
                        size: AppSpacing.space16,
                        color: context.colors.primary,
                      ),
                      const SizedBox(width: AppSpacing.space4),
                      Text(
                        data.rating.toStringAsFixed(1),
                        style: context.textStyles.bodyMedium,
                      ),
                      const SizedBox(width: AppSpacing.space4),
                      Flexible(
                        child: Text(
                          '(${data.reviewsCount} reseñas)',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: context.textStyles.bodySmall,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }
}
