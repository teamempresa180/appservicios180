import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_avatar.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../provider_profile/presentation/pages/provider_profile_page.dart';
import '../../models/provider_display.dart';

/// A single recommended provider card: name, simulated rating and
/// simulated services count. Tapping it opens Provider Profile for
/// this card's own [Provider]/[Profile] — different cards now open
/// different providers.
class ProviderCard extends StatelessWidget {
  const ProviderCard({super.key, required this.display});

  final ProviderDisplay display;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 160,
      child: AppCard(
        onTap: () => Navigator.of(context).push(
          MaterialPageRoute<void>(
            builder: (context) => Scaffold(
              appBar: AppBar(title: const Text('Perfil del proveedor')),
              body: SafeArea(
                child: ProviderProfilePage(
                  provider: display.provider,
                  profile: display.profile,
                ),
              ),
            ),
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const AppAvatar(),
            const SizedBox(height: AppSpacing.space8),
            Text(
              display.name,
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: context.textStyles.titleSmall,
            ),
            const SizedBox(height: AppSpacing.space4),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
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
              ],
            ),
            Text(
              '${display.servicesCount} servicios',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: context.textStyles.bodySmall,
            ),
          ],
        ),
      ),
    );
  }
}
