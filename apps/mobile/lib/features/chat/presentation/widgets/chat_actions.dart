import 'package:flutter/material.dart';
import '../../../../core/ui/extensions/context_theme_extensions.dart';
import '../../../../core/ui/tokens/app_spacing.dart';
import '../../../notifications/presentation/pages/notifications_page.dart';

/// Secondary chat actions (view order, more options). Purely visual —
/// [onViewOrder] is a no-op by default. "Más opciones" opens the
/// (visual-only, fixed mock) Notifications screen — the only change
/// authorized in the Notifications prompt, since an overflow/"more"
/// menu is a natural place to reach the notification center. See the
/// feature README.
class ChatActions extends StatelessWidget {
  const ChatActions({super.key, this.onViewOrder, this.onMore});

  final VoidCallback? onViewOrder;
  final VoidCallback? onMore;

  void _openNotifications(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (context) => Scaffold(
          appBar: AppBar(title: const Text('Notificaciones')),
          body: const SafeArea(child: NotificationsPage()),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        IconButton(
          onPressed: onViewOrder ?? () {},
          icon: Icon(
            Icons.receipt_long_outlined,
            color: context.colors.primary,
          ),
          tooltip: 'Ver orden',
        ),
        const SizedBox(width: AppSpacing.space4),
        IconButton(
          onPressed: onMore ?? () => _openNotifications(context),
          icon: Icon(Icons.more_vert, color: context.colors.primary),
          tooltip: 'Más opciones',
        ),
      ],
    );
  }
}
