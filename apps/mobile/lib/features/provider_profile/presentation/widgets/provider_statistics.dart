import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../core/ui/widgets/app_stat_tile.dart';
import '../../models/provider_profile_data.dart';

/// Quick-glance grid of stats, all **real domain data**: years of
/// experience (`Provider.yearsOfExperience`), how many services this
/// provider publishes, and how many reviews they've received.
///
/// The previous "Servicios completados" (a fixed 47) and "Tiempo de
/// respuesta" ("Responde en menos de 1 hora") tiles were removed —
/// nothing aggregates either figure, so both were invented numbers
/// shown to a client at the exact moment they decide whom to hire.
/// Intentionally self-contained (does not import `home`'s `StatCard`,
/// since features stay independent of one another).
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
                  icon: Icons.design_services_outlined,
                  value: '${data.services.length}',
                  label: 'Servicios\npublicados',
                ),
              ),
              const SizedBox(width: AppSpacing.space12),
              Expanded(
                child: AppStatTile(
                  icon: Icons.star_outline,
                  value: '${data.reviewsCount}',
                  label: 'Reseñas\nrecibidas',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
