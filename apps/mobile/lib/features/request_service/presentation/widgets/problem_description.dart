import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../core/ui/widgets/app_text_field.dart';

/// Free-text description of the problem. **Simulated** — typed text only
/// lives in this widget's local `TextEditingController`, never sent
/// anywhere (see the feature README).
class ProblemDescription extends StatefulWidget {
  const ProblemDescription({super.key, required this.initialText});

  final String initialText;

  @override
  State<ProblemDescription> createState() => _ProblemDescriptionState();
}

class _ProblemDescriptionState extends State<ProblemDescription> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialText);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const AppSectionTitle(title: 'Descripción del problema'),
          const SizedBox(height: AppSpacing.space8),
          AppTextField(
            controller: _controller,
            label: 'Descripción',
            hint: 'Cuéntanos qué necesitas',
          ),
        ],
      ),
    );
  }
}
