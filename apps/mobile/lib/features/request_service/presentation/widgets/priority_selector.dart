import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_chip.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../models/request_priority.dart';

/// Priority chip selector. The chosen [RequestPriority] is surfaced to
/// the parent via [onChanged] so `RequestServicePage` can send the
/// real priority when submitting the request (mapped onto
/// `Order.priority` — see `RequestPriority.asOrderPriority`).
class PrioritySelector extends StatefulWidget {
  const PrioritySelector({
    super.key,
    required this.initialPriority,
    this.onChanged,
  });

  final RequestPriority initialPriority;
  final ValueChanged<RequestPriority>? onChanged;

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
                onTap: () {
                  setState(() => _priority = priority);
                  widget.onChanged?.call(priority);
                },
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
