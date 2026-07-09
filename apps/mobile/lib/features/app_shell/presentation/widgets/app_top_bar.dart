import 'package:flutter/material.dart';

/// Top bar shared by every screen hosted inside the App Shell. Temporary
/// title only — no logo, no brand colors (none exist yet).
///
/// Prepared for, but not implementing, three future additions (see the
/// feature README for exactly where each one would slot in):
/// - An avatar as the `leading` widget.
/// - A badge on the notifications icon.
/// - A search field, likely replacing the title when active.
class AppTopBar extends StatelessWidget implements PreferredSizeWidget {
  const AppTopBar({super.key, this.onNotificationsPressed});

  final VoidCallback? onNotificationsPressed;

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: const Text('AppServicios'),
      actions: [
        IconButton(
          icon: const Icon(Icons.notifications_outlined),
          tooltip: 'Notificaciones',
          onPressed: onNotificationsPressed,
        ),
      ],
    );
  }
}
