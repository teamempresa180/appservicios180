import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../core/ui/widgets/app_stat_tile.dart';
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
                child: AppStatTile(
                  icon: Icons.workspace_premium_outlined,
                  value: '${data.experienceYears}',
                  label: 'Años de\nexperiencia',
                ),
              ),
              const SizedBox(width: AppSpacing.space12),
              Expanded(
                child: AppStatTile(
                  icon: Icons.task_alt_outlined,
                  value: '${data.completedServices}',
                  label: 'Servicios\ncompletados',
                ),
              ),
              const SizedBox(width: AppSpacing.space12),
              Expanded(
                child: AppStatTile(
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
