import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/request_service_data.dart';

/// Recap of the provider handling the request: name (from `Profile`) and
/// years of experience. Purely visual — no navigation, unlike
/// `service_detail`'s provider card.
class ProviderSummary extends StatelessWidget {
  const ProviderSummary({super.key, required this.data});

  final RequestServiceData data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Proveedor'),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const AppAvatar(),
              const SizedBox(width: AppSpacing.space12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      data.providerName ?? '',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: context.textStyles.titleSmall,
                    ),
                    Text(
                      '${data.provider?.yearsOfExperience ?? 0} años de experiencia',
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: context.textStyles.bodySmall,
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
