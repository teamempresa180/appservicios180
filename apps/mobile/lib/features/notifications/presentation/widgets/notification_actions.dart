import 'package:flutter/material.dart';
import '../../../../core/ui/widgets/app_button.dart';
import '../../models/notification_display.dart';

/// The notification's action button — its label depends on
/// `NotificationDisplay.category`. Purely visual — [onPressed] is a
/// no-op by default; it does not open a real order/payment/quote/chat
/// detail yet (see the feature README).
class NotificationActions extends StatelessWidget {
  const NotificationActions({super.key, required this.data, this.onPressed});

  final NotificationDisplay data;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return AppButton(
      label: data.actionLabel,
      onPressed: onPressed ?? () {},
      expand: false,
    );
  }
}
