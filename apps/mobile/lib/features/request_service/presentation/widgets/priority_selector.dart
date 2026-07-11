import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_chip.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/request_priority.dart';

/// Priority chip selector. **Simulated** — see `RequestPriority` and the
/// feature README: the chosen value only lives in this widget's local
/// state, never sent anywhere.
class PrioritySelector extends StatefulWidget {
  const PrioritySelector({super.key, required this.initialPriority});

  final RequestPriority initialPriority;

  @override
  State<PrioritySelector> createState() => _PrioritySelectorState();
}

class _PrioritySelectorState extends State<PrioritySelector> {
  late RequestPriority _priority;

  @override
  void initState() {
    super.initState();
    _priority = widget.initialPriority;
  }

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Prioridad'),
          Wrap(
            spacing: AppSpacing.space8,
            children: RequestPriority.values.map((priority) {
              return AppChip(
                label: priority.label,
                selected: _priority == priority,
                onTap: () => setState(() => _priority = priority),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
