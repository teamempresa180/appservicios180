import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../models/chat_display.dart';

/// Contact-style header: provider avatar, name and online/last-seen
/// status. `isOnline`/`lastSeen` are simulated — see the feature
/// README. Colors are resolved from `context.colors`, never hardcoded.
class ProviderHeader extends StatelessWidget {
  const ProviderHeader({super.key, required this.data});

  final ChatDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        children: [
          Stack(
            children: [
              CircleAvatar(
                radius: AppSpacing.space24,
                backgroundColor: context.colors.primary,
                child: Icon(Icons.person, color: context.colors.onPrimary),
              ),
              if (data.isOnline)
                Positioned(
                  right: 0,
                  bottom: 0,
                  child: Container(
                    width: AppSpacing.space12,
                    height: AppSpacing.space12,
                    decoration: BoxDecoration(
                      color: context.colors.primary,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: context.colors.surface,
                        width: 2,
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(width: AppSpacing.space12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(data.providerName, style: context.textStyles.titleSmall),
                Text(
                  data.isOnline ? 'En línea' : data.lastSeen,
                  style: context.textStyles.bodySmall,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
