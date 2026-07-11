import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section.dart';
import '../../../../core/ui/widgets/app_stat_grid.dart';
import '../../../../core/ui/widgets/app_stat_tile.dart';
import '../../models/security_display.dart';

/// Summary: per-status auth method counts — all **derived** from the
/// real `Authentication` list (see `SecurityDisplay` and the feature
/// README), no simulated field involved.
class SecurityStatistics extends StatelessWidget {
  const SecurityStatistics({super.key, required this.data});

  final SecurityDisplay data;

  @override
  Widget build(BuildContext context) {
    return AppSection(
      title: 'Resumen',
      children: [
        AppStatGrid(
          tiles: [
            AppStatTile(label: 'Activos', value: '${data.activeCount}'),
            AppStatTile(label: 'Inactivos', value: '${data.inactiveCount}'),
            AppStatTile(label: 'Bloqueados', value: '${data.lockedCount}'),
            AppStatTile(label: 'Revocados', value: '${data.revokedCount}'),
          ],
        ),
      ],
    );
  }
}
