import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section.dart';
import '../../../../core/ui/widgets/app_stat_grid.dart';
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
    return AppSection(
      title: 'Resumen',
      children: [
        AppStatGrid(
          crossAxisCount: 3,
          childAspectRatio: 1.4,
          tiles: [
            AppStatTile(label: 'Activos', value: '${data.activeCount}'),
            AppStatTile(label: 'Inactivos', value: '${data.inactiveCount}'),
            AppStatTile(label: 'Archivados', value: '${data.archivedCount}'),
          ],
        ),
      ],
    );
  }
}
