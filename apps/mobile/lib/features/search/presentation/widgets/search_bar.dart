import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_text_field.dart';

/// Search input field. Reuses `AppTextField`'s `prefixIcon` support.
/// Accepts typing (owns a real `TextEditingController`) but performs no
/// real search — `onChanged` is intentionally a no-op.
///
/// Named `SearchInputBar` (not `SearchBar`) to avoid colliding with
/// Flutter's own Material 3 `SearchBar` widget.
class SearchInputBar extends StatefulWidget {
  const SearchInputBar({super.key});

  @override
  State<SearchInputBar> createState() => _SearchInputBarState();
}

class _SearchInputBarState extends State<SearchInputBar> {
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppTextField(
      controller: _controller,
      hint: 'Buscar servicios o profesionales',
      prefixIcon: Icons.search,
      onChanged: (_) {},
    );
  }
}
