import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_section_title.dart';

/// Static Schedule title. No subtitle: unlike other provider-facing
/// features, `Provider` (the only entity this feature composes besides
/// `Schedule`) has no display name of its own — see the feature
/// README.
class ScheduleHeader extends StatelessWidget {
  const ScheduleHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppSectionTitle(title: 'Agenda');
  }
}
