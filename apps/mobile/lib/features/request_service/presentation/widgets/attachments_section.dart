import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../core/ui/widgets/app_snack_bar.dart';

/// Horizontally scrollable, simulated photo attachments. No real camera
/// or gallery integration exists yet (no official branding, no
/// `Attachment` upload use case wired) — each slot is a neutral
/// placeholder: a Material Icon + the label from
/// `RequestServiceData.attachments`. The trailing "add" tile is a no-op
/// (see the feature README).
class AttachmentsSection extends StatelessWidget {
  const AttachmentsSection({super.key, required this.attachments});

  final List<String> attachments;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Adjuntar fotografías'),
          SizedBox(
            height: 96,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: attachments.length + 1,
              separatorBuilder: (context, index) =>
                  const SizedBox(width: AppSpacing.space12),
              itemBuilder: (context, index) {
                if (index == attachments.length) {
                  return InkWell(
                    onTap: () => AppSnackBar.show(
                      context,
                      'Selección de fotos próximamente',
                      type: AppSnackBarType.info,
                    ),
                    child: SizedBox(
                      width: 96,
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          border: Border.all(color: context.colors.outline),
                          borderRadius: BorderRadius.circular(
                            AppSpacing.space8,
                          ),
                        ),
                        child: Icon(
                          Icons.add_a_photo_outlined,
                          color: context.colors.primary,
                        ),
                      ),
                    ),
                  );
                }

                return SizedBox(
                  width: 96,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.image_outlined,
                        size: AppSpacing.space32,
                        color: context.colors.secondary,
                      ),
                      const SizedBox(height: AppSpacing.space4),
                      Text(
                        attachments[index],
                        textAlign: TextAlign.center,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: context.textStyles.bodySmall,
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
