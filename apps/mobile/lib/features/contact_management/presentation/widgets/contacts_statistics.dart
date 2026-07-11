import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../core/ui/widgets/app_stat_tile.dart';
import '../../models/contact_management_display.dart';

/// Summary: per-status contact counts — all **derived** from the real
/// `Contact` list (see `ContactManagementDisplay` and the feature
/// README), no simulated field involved.
class ContactsStatistics extends StatelessWidget {
  const ContactsStatistics({super.key, required this.data});

  final ContactManagementDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Resumen'),
          GridView.count(
            crossAxisCount: 3,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            childAspectRatio: 1.4,
            mainAxisSpacing: AppSpacing.space8,
            crossAxisSpacing: AppSpacing.space8,
            children: [
              AppStatTile(label: 'Activos', value: '${data.activeCount}'),
              AppStatTile(label: 'Inactivos', value: '${data.inactiveCount}'),
              AppStatTile(label: 'Archivados', value: '${data.archivedCount}'),
            ],
          ),
        ],
      ),
    );
  }
}
