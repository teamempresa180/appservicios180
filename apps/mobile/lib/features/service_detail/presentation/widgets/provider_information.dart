import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../provider_profile/presentation/pages/provider_profile_page.dart';
import '../../models/service_detail_data.dart';

/// Provider information: name (from `Profile`, since `Provider` itself
/// has no display name), biography and years of experience. Tapping it
/// opens Provider Profile for this service's own provider — real
/// per-provider navigation, not a fixed mock preview.
class ProviderInformation extends StatelessWidget {
  const ProviderInformation({super.key, required this.data});

  final ServiceDetailData data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      onTap: () => Navigator.of(context).push(
        MaterialPageRoute<void>(
          builder: (context) => Scaffold(
            appBar: AppBar(title: const Text('Perfil del proveedor')),
            body: SafeArea(
              child: ProviderProfilePage(
                provider: data.provider,
                profile: data.profile,
              ),
            ),
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Proveedor'),
          Row(
            children: [
              const AppAvatar(),
              const SizedBox(width: AppSpacing.space12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      data.providerName,
                      style: context.textStyles.titleSmall,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      '${data.provider.yearsOfExperience} años de experiencia',
                      style: context.textStyles.bodySmall,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.space8),
          Text(data.provider.biography, style: context.textStyles.bodyMedium),
        ],
      ),
    );
  }
}
