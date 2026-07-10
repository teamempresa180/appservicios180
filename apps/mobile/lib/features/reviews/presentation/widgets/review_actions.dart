import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../models/review_display.dart';

/// The review's action button — its label depends on
/// `ReviewDisplay.canEdit`. Purely visual — [onPressed] is a no-op by
/// default; it does not open a real edit form or detail view yet (see
/// the feature README).
class ReviewActions extends StatelessWidget {
  const ReviewActions({super.key, required this.data, this.onPressed});

  final ReviewDisplay data;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return AppButton(
      label: data.canEdit ? 'Editar' : 'Ver detalle',
      onPressed: onPressed ?? () {},
      expand: false,
    );
  }
}
