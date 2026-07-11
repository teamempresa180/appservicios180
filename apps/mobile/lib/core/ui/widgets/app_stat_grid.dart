import 'package:flutter/material.dart';
import '../tokens/app_spacing.dart';

/// The `GridView.count` wrapper used by every `*_statistics.dart`
/// widget that lays out a fixed set of `AppStatTile`s
/// (`SecurityStatistics`, `AvailabilityStatistics`,
/// `ContactsStatistics`, `DashboardStatistics`, `ServicesStatistics`,
/// `ScheduleStatistics`) — same `shrinkWrap`/`physics`/spacing
/// boilerplate in all of them, only [crossAxisCount]/[childAspectRatio]
/// differ per feature (kept as parameters so each call site preserves
/// its exact original layout). Not every stat widget fits this shape
/// (`ProviderStatistics` uses a 3-across `Row`, `ProfileStatistics`
/// isn't a tile grid at all) — those are left as-is rather than forced
/// into this widget.
class AppStatGrid extends StatelessWidget {
  const AppStatGrid({
    super.key,
    required this.tiles,
    this.crossAxisCount = 2,
    this.childAspectRatio = 1.7,
  });

  final List<Widget> tiles;
  final int crossAxisCount;
  final double childAspectRatio;

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: crossAxisCount,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: childAspectRatio,
      mainAxisSpacing: AppSpacing.space8,
      crossAxisSpacing: AppSpacing.space8,
      children: tiles,
    );
  }
}
