import 'package:flutter/material.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../../core/ui/widgets/app_card.dart';
import '../../../../core/ui/widgets/app_section_title.dart';
import '../../../../core/ui/widgets/app_text_field.dart';

/// Free-text description of the problem. Typed text is surfaced to the
/// parent via [onChanged] so `RequestServicePage` can send the real
/// description when submitting the request (see
/// `RequestServiceRepository.createOrder`).
class ProblemDescription extends StatefulWidget {
  const ProblemDescription({
    super.key,
    required this.initialText,
    this.onChanged,
  });

  final String initialText;
  final ValueChanged<String>? onChanged;

  @override
  State<ProblemDescription> createState() => _ProblemDescriptionState();
}

class _ProblemDescriptionState extends State<ProblemDescription> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialText);
    _controller.addListener(() => widget.onChanged?.call(_controller.text));
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
            // A single-line field forced a client describing a real
            // problem to scroll horizontally inside a tiny box — bumped
            // to a proper multi-line field with a hard cap so the
            // description stays reasonable without silently truncating.
            maxLines: 4,
            maxLength: 500,
          ),
        ],
      ),
    );
  }
}
