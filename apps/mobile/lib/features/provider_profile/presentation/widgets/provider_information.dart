import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/provider_profile_data.dart';

/// Provider description — the provider's own real
/// `Provider.biography` (see `ProviderProfileData.about`). Renders
/// nothing when they haven't written one, instead of the fixed mock
/// paragraph this used to show on every profile. Reuses
/// `AppCard`/`AppSectionTitle` only.
class ProviderInformation extends StatelessWidget {
  const ProviderInformation({super.key, required this.data});

  final ProviderProfileData data;

  @override
  Widget build(BuildContext context) {
    if (data.about.isEmpty) return const SizedBox.shrink();

    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Descripción'),
          Text(data.about, style: context.textStyles.bodyMedium),
        ],
      ),
    );
  }
}
