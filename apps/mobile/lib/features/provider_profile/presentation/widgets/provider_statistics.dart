import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/provider_profile_data.dart';

/// Quick-glance grid of stats: experience (real domain data), completed
/// services and response time (both simulated) — see
/// `ProviderProfileData` for what's real vs. simulated. Intentionally
/// self-contained (does not import `home`'s `StatCard`, since features
/// stay independent of one another).
class ProviderStatistics extends StatelessWidget {
  const ProviderStatistics({super.key, required this.data});

  final ProviderProfileData data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Experiencia'),
          Row(
            children: [
              Expanded(
                child: _StatTile(
                  icon: Icons.workspace_premium_outlined,
                  value: '${data.experienceYears}',
                  label: 'Años de\nexperiencia',
                ),
              ),
              const SizedBox(width: AppSpacing.space12),
              Expanded(
                child: _StatTile(
                  icon: Icons.task_alt_outlined,
                  value: '${data.completedServices}',
                  label: 'Servicios\ncompletados',
                ),
              ),
              const SizedBox(width: AppSpacing.space12),
              Expanded(
                child: _StatTile(
                  icon: Icons.schedule_outlined,
                  value: data.responseTime,
                  label: 'Tiempo de\nrespuesta',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatTile extends StatelessWidget {
  const _StatTile({
    required this.icon,
    required this.value,
    required this.label,
  });

  final IconData icon;
  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: context.colors.primary),
        const SizedBox(height: AppSpacing.space4),
        Text(
          value,
          textAlign: TextAlign.center,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: context.textStyles.titleSmall,
        ),
        Text(
          label,
          textAlign: TextAlign.center,
          style: context.textStyles.bodySmall,
        ),
      ],
    );
  }
}
