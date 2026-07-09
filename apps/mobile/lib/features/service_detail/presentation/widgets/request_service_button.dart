import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';

/// "Solicitar servicio" call to action. Purely visual — [onPressed] is
/// a no-op by default; it does not create an Order, Quote or anything
/// else yet (see the feature README).
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
