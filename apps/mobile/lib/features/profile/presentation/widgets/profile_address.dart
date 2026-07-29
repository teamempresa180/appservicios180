import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/profile_display.dart';

/// Recap of the real `Address` domain entity.
class ProfileAddress extends StatelessWidget {
  const ProfileAddress({super.key, required this.data});

  final ProfileDisplay data;

  @override
  Widget build(BuildContext context) {
    final address = data.address;

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Dirección'),
          Row(
            children: [
              Icon(Icons.place_outlined, color: context.colors.primary),
              const SizedBox(width: AppSpacing.space8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      address.alias,
                      style: context.textStyles.titleSmall,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      '${address.fullAddress}, ${address.city}',
                      style: context.textStyles.bodySmall,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
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
