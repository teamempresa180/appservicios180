import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Solicitar servicio" call to action. [ServiceDetailPage] wires
/// [onPressed] to open Request Service as a direct hire for this
/// screen's own service/provider — falls back to a no-op only when a
/// caller (e.g. a test) omits it.
class RequestServiceButton extends StatelessWidget {
  const RequestServiceButton({super.key, this.onPressed});

  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return AppButton(
      label: 'Solicitar servicio',
      onPressed: onPressed ?? () {},
    );
  }
}
