import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';

/// Horizontally scrollable, simulated image gallery. No real images or
/// illustrations exist yet (no official branding) — each slot is a
/// neutral placeholder: a Material Icon + the label from
/// `ServiceDetailData.images`. See the feature README.
class ServiceGallery extends StatelessWidget {
  const ServiceGallery({super.key, required this.images});

  final List<String> images;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 128,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: images.length,
        separatorBuilder: (context, index) =>
            const SizedBox(width: AppSpacing.space12),
        itemBuilder: (context, index) {
          return SizedBox(
            width: 180,
            child: AppCard(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.image_outlined,
                    size: AppSpacing.space48,
                    color: context.colors.secondary,
                  ),
                  const SizedBox(height: AppSpacing.space8),
                  Text(
                    images[index],
                    textAlign: TextAlign.center,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: context.textStyles.bodySmall,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
