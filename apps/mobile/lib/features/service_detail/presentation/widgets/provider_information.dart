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
/// opens the (visual-only, single fixed mock provider) Provider Profile
/// preview — the only change authorized this prompt. See the feature
/// README and `provider_profile`'s README for why it always opens the
/// same mock provider.
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
            body: const SafeArea(child: ProviderProfilePage()),
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
                    ),
                    Text(
                      '${data.provider.yearsOfExperience} años de experiencia',
                      style: context.textStyles.bodySmall,
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
