import 'package:flutter/material.dart';
import 'app_card.dart';
import 'app_section_title.dart';

/// A titled block of content inside an `AppCard` — the "title +
/// content" wrapper that most detail/summary widgets across features
/// (`PaymentInformation`, `ServiceInformation`, `CredentialsSection`,
/// `AuditLogSection`, statistics widgets, etc.) each rebuilt by hand as
/// `AppCard(child: Column(children: [AppSectionTitle(...), ...]))`.
class AppSection extends StatelessWidget {
  const AppSection({
    super.key,
    required this.title,
    this.subtitle,
    this.actionLabel,
    this.onActionTap,
    required this.children,
  });

  final String title;
  final String? subtitle;
  final String? actionLabel;
  final VoidCallback? onActionTap;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AppSectionTitle(
            title: title,
            subtitle: subtitle,
            actionLabel: actionLabel,
            onActionTap: onActionTap,
          ),
          ...children,
        ],
      ),
    );
  }
}
